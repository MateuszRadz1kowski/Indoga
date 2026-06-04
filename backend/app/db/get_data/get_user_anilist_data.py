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
  MediaListCollection(userName: $userName, type: ANIME) {
    lists {
      entries {
        repeat
        score
        status
        media {
          title { english }
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
  }
  User(name: $userName) {
    avatar { medium }
    mediaListOptions { scoreFormat }
    favourites { anime { nodes { id } } }
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

    if data.get("MediaListCollection") is None:
        raise PrivateProfileException(username)

    return res