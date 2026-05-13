import requests
import json
import time


def anilist_export_data(page_number, media_type="ANIME"):
    query = '''
    query GetMedia($page: Int, $type: MediaType) {
      Page(page: $page) {
        media(type: $type, sort: POPULARITY_DESC) {
          id
          idMal
          title { english romaji native }
          tags { name rank }
          seasonYear
          startDate { year }
          format
          isAdult
          genres
          popularity
          favourites
          meanScore
          recommendations { nodes { mediaRecommendation { title { english } } } }
          coverImage { extraLarge }
          description
          episodes
          studios {
            nodes {
              name
            }
          }
          status
          bannerImage
          chapters
          trailer { id site }
          staff {
            edges {
              role
              node {
                name {
                  full
                }
              image {
                large
              }
              }
            }
          }
          season
          relations { edges { relationType node { id format } } }
          externalLinks {
            site
            icon
            url
            type
          }
        }
        pageInfo { hasNextPage }
      }
    }
    '''
    variables = {'page': page_number, 'type': media_type}
    url = 'https://graphql.anilist.co'

    try:
        api_response = requests.post(url, json={'query': query, 'variables': variables})

        if api_response.status_code == 429:
            print("Rate limit! Sleeping...")
            time.sleep(10)
            return anilist_export_data(page_number, media_type)

        res = api_response.json()
        if res is None or "data" not in res or res["data"] is None:
            print(f"API Error on page {page_number}: {res.get('errors') if res else 'Empty response'}")
            return None
        return res
    except Exception as e:
        print(f"Request error: {e}")
        return None

def anilist_pack_data_to_db(res):
    if not res or not res.get('data') or not res['data'].get('Page'):
        return []

    media_list = res['data']['Page'].get('media', [])
    result = []

    for media in media_list:
        media_id = media.get('id')
        title_obj = media.get('title') or {}
        title = title_obj.get('english') or title_obj.get('romaji') or title_obj.get('native')

        if media_id is None or title is None:
            continue

        is_manga_format = media.get('format') in ('MANGA', 'NOVEL', 'ONE_SHOT')

        season_year = (
            (media.get('startDate') or {}).get('year')
            if is_manga_format
            else media.get('seasonYear')
        )

        episode_number = (
            media.get('chapters')
            if is_manga_format
            else media.get('episodes')
        )

        creators = (
            json.dumps(media.get('staff', {}).get('edges'))
            if is_manga_format
            else json.dumps(media.get('studios', {}).get('nodes'))
        )

        try:
            relations_list = []
            rel_edges = media.get('relations', {}).get('edges', [])
            for edge in rel_edges:
                rel_type = edge.get('relationType')
                rel_format = edge.get('node', {}).get('format')
                relations_list.append({"type": rel_type, "format": rel_format})

            rec_nodes = media.get('recommendations', {}).get('nodes', [])
            recommendations = [
                node.get('mediaRecommendation', {}).get('title', {}).get('english')
                for node in rec_nodes if node.get('mediaRecommendation')
            ]

            result.append((
                media_id,
                media.get('idMal'),
                title,
                season_year,
                media.get('format'),
                media.get('isAdult'),
                json.dumps(media.get('genres', [])),
                json.dumps(media.get('tags', [])),
                json.dumps([r for r in recommendations if r]),
                media.get('popularity'),
                media.get('favourites'),
                media.get('meanScore'),
                media.get('description'),
                episode_number,
                media.get('coverImage', {}).get("extraLarge"),
                (media.get("trailer") or {}).get("id"),
                (media.get("trailer") or {}).get("site"),
                media.get('season'),
                json.dumps(relations_list),
                json.dumps(media.get('externalLinks', [])),
                media.get('status'),
                media.get('bannerImage'),
                creators,
            ))
        except Exception as e:
            print(f"Skipping media {media_id} due to packing error: {e}")
            continue

    return result