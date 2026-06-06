import requests
import time
from bs4 import BeautifulSoup

from backend.config.MAL_api_key import MAL_KEY
from backend.app.api.exceptions import (
    UserNotFoundException,
    RateLimitException,
    AniRecException,
)

ANILIST_URL = 'https://graphql.anilist.co'

ANILIST_BATCH_QUERY = '''
query($ids: [Int], $type: MediaType) {
  Page(perPage: 50) {
    media(idMal_in: $ids, type: $type) {
      title { english }
      id
      favourites
      format
      genres
      idMal
      isAdult
      meanScore
      startDate { year }
      coverImage { large }
      popularity
      episodes
      chapters
      recommendations {
        nodes {
          mediaRecommendation {
            id
            title { english }
          }
        }
      }
      tags { id name rank }
    }
  }
}
'''

STATUS_MAP = {
    "completed": 0,
    "watching": 1,
    "plan_to_watch": 2,
    "dropped": 3,
    "on_hold": 4,
}

def get_mal_list(username, media_type="anime"):
    headers = {'X-MAL-CLIENT-ID': MAL_KEY}
    url = f"https://api.myanimelist.net/v2/users/{username}/{media_type}list"
    params = {
        "limit": 1000,
        "fields": "list_status{score,status,num_times_rewatched,num_times_reread}",
        "nsfw": "true",
    }

    all_entries = []
    while url:
        try:
            response = requests.get(url, headers=headers, params=params, timeout=30)
        except requests.exceptions.ConnectionError:
            raise AniRecException(
                error_code="network_error",
                detail="Could not connect to MyAnimeList API.",
                status_code=503,
            )
        except requests.exceptions.Timeout:
            raise AniRecException(
                error_code="network_error",
                detail="MyAnimeList API timed out.",
                status_code=503,
            )

        if response.status_code == 404:
            raise UserNotFoundException(username, "MyAnimeList")
        if response.status_code == 401:
            raise AniRecException(
                error_code="server_error",
                detail="Invalid MAL API key.",
                status_code=500,
            )
        if response.status_code == 429:
            raise RateLimitException("MyAnimeList")
        if response.status_code >= 500:
            raise AniRecException(
                error_code="server_error",
                detail="MyAnimeList is currently unavailable.",
                status_code=503,
            )

        data = response.json()
        all_entries.extend(data.get("data", []))
        url = data.get("paging", {}).get("next")
        params = {}
    return all_entries


def fetch_anilist_batch(mal_ids, media_type):
    try:
        response = requests.post(
            ANILIST_URL,
            json={'query': ANILIST_BATCH_QUERY, 'variables': {'ids': mal_ids, 'type': media_type}},
            timeout=30,
        )

        if response.status_code == 429:
            print(f"AniList rate limit during MAL batch, sleeping 10s...")
            time.sleep(10)
            return fetch_anilist_batch(mal_ids, media_type)

        data = response.json()
        media_list = (
            data.get('data', {}).get('Page', {}).get('media', [])
        )
        return {media['idMal']: media for media in media_list if media.get('idMal')}

    except AniRecException:
        raise
    except Exception as e:
        print(f"AniList batch error: {e}")
        return {}


def get_mal_user_avatar(username):
    url = f"https://myanimelist.net/profile/{username}"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            img_tag = soup.find('div', class_='user-image').find('img')
            if img_tag:
                return img_tag.get('data-src') or img_tag.get('src')
    except Exception as e:
        print(f"Avatar scraping failed for {username}: {e}")
    return None


def get_user_MAL_data(username):
    user_avatar_url = get_mal_user_avatar(username)

    mal_anime_entries = get_mal_list(username, "anime")
    mal_manga_entries = get_mal_list(username, "manga")
    
    all_mal_anime_ids = [item["node"]["id"] for item in mal_anime_entries if item.get("node", {}).get("id")]
    all_mal_manga_ids = [item["node"]["id"] for item in mal_manga_entries if item.get("node", {}).get("id")]

    anilist_anime_cache = {}
    anilist_manga_cache = {}
    batch_size = 50

    for i in range(0, len(all_mal_anime_ids), batch_size):
        batch = all_mal_anime_ids[i: i + batch_size]
        anilist_anime_cache.update(fetch_anilist_batch(batch, "ANIME"))
        if i + batch_size < len(all_mal_anime_ids):
            time.sleep(1)

    for i in range(0, len(all_mal_manga_ids), batch_size):
        batch = all_mal_manga_ids[i: i + batch_size]
        anilist_manga_cache.update(fetch_anilist_batch(batch, "MANGA"))
        if i + batch_size < len(all_mal_manga_ids):
            time.sleep(1)

    lists_dict = {status: {"entries": []} for status in STATUS_MAP}

    def process_entries(entries, cache):
        for item in entries:
            mal_id = item.get("node", {}).get("id")
            mal_title = item.get("node", {}).get("title")
            if not mal_id or mal_id not in cache:
                continue

            mal_status = item.get("list_status", {})
            status_str = mal_status.get("status", "completed")
            
            if status_str == "reading":
                status_str = "watching"
            elif status_str == "plan_to_read":
                status_str = "plan_to_watch"

            ani_media = cache[mal_id]
            
            if ani_media.get("chapters") is not None:
                ani_media["episodes"] = ani_media.get("chapters")
                
            if "title" not in ani_media:
                ani_media["title"] = {}
            if not ani_media["title"].get("english"):
                ani_media["title"]["english"] = mal_title

            entry = {
                "score": mal_status.get("score", 0),
                "repeat": mal_status.get("num_times_rewatched") or mal_status.get("num_times_reread", 0),
                "status": status_str,
                "media": ani_media,
            }
            if status_str in lists_dict:
                lists_dict[status_str]["entries"].append(entry)

    process_entries(mal_anime_entries, anilist_anime_cache)
    process_entries(mal_manga_entries, anilist_manga_cache)

    final_lists = [lists_dict[status] for status in sorted(STATUS_MAP, key=STATUS_MAP.get) if lists_dict[status]["entries"]]

    return {
        "data": {
            "MediaListCollection": {"lists": final_lists},
            "User": {
                "avatar": {"medium": user_avatar_url},
                "mediaListOptions": {"scoreFormat": "POINT_10"},
                "favourites": {"anime": {"nodes": []}},
            },
        }
    }