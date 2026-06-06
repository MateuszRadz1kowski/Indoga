import requests
from backend.app.api.exceptions import (
    UserNotFoundException,
    PrivateProfileException,
    RateLimitException,
    AniRecException,
)

def get_user_anilist_data(username):
    query = '''
        query($userName: String) {
          anime: MediaListCollection(userName: $userName, type: ANIME) {
            lists {
              name
              status
              entries {
                repeat
                score
                status
                media {
                  title { english romaji }
                  id
                  favourites
                  format
                  genres
                  idMal
                  isAdult
                  meanScore
                  popularity
                  startDate { year }
                  coverImage { large }
                  episodes
                  chapters
                  recommendations {
                    nodes {
                      mediaRecommendation {
                        id
                        title { english romaji }
                      }
                    }
                  }
                  tags { id name rank }
                }
              }
            }
          }
          manga: MediaListCollection(userName: $userName, type: MANGA) {
            lists {
              name
              status
              entries {
                repeat
                score
                status
                media {
                  title { english romaji }
                  id
                  favourites
                  format
                  genres
                  idMal
                  isAdult
                  meanScore
                  popularity
                  startDate { year }
                  coverImage { large }
                  episodes
                  chapters
                  recommendations {
                    nodes {
                      mediaRecommendation {
                        id
                        title { english romaji }
                      }
                    }
                  }
                  tags { id name rank }
                }
              }
            }
          }
          User(name: $userName) {
            avatar { medium }
            mediaListOptions { scoreFormat }
            favourites { 
                anime { nodes { id } } 
                manga { nodes { id } } 
            }
          }
        }
    '''
    variables = {'userName': username}
    url = 'https://graphql.anilist.co'

    try:
        response = requests.post(
            url,
            json={'query': query, 'variables': variables},
            timeout=30,
        )
    except requests.exceptions.ConnectionError:
        raise AniRecException(
            error_code="network_error",
            detail="Could not connect to AniList API.",
            status_code=503,
        )
    except requests.exceptions.Timeout:
        raise AniRecException(
            error_code="network_error",
            detail="AniList API timed out.",
            status_code=503,
        )

    if response.status_code == 429:
        raise RateLimitException("AniList")

    res = response.json()

    if res.get("errors"):
        for error in res["errors"]:
            message = error.get("message", "").lower()
            if "not found" in message or "user" in message:
                raise UserNotFoundException(username, "AniList")
        raise UserNotFoundException(username, "AniList")

    data = res.get("data") or {}

    if data.get("User") is None:
        raise UserNotFoundException(username, "AniList")

    anime_collection = data.get("anime")
    manga_collection = data.get("manga")

    if not anime_collection and not manga_collection:
        raise PrivateProfileException(username)

    merged_lists_map = {}
    for collection in [anime_collection, manga_collection]:
        if not collection or not collection.get("lists"):
            continue
        
        for list in collection["lists"]:
            status = list.get("status")
            list_key = status or list.get("name")
            
            if list_key not in merged_lists_map:
                merged_lists_map[list_key] = {
                    "name": list.get("name"),
                    "status": status,
                    "entries": []
                }
            
            for entry in list.get("entries", []):
                media = entry.get("media", {})
                if media.get("chapters") is not None:
                    media["episodes"] = media["chapters"]
                merged_lists_map[list_key]["entries"].append(entry)

    final_lists = list(merged_lists_map.values())
    
    user_info = data.get("User", {})
    favs = user_info.get("favourites", {})
    merged_favs = favs.get("anime", {}).get("nodes", []) + favs.get("manga", {}).get("nodes", [])
    user_info["favourites"] = {"anime": {"nodes": merged_favs}}

    res["data"] = {
        "MediaListCollection": {"lists": final_lists},
        "User": user_info
    }

    return res