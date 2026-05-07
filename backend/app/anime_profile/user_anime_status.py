from backend.app.db.get_data.get_user_MAL_data import get_user_MAL_data
from backend.app.db.get_data.get_user_anilist_data import get_user_anilist_data


def user_anime_status(status_number, user_data):
    anime_titles = {}

    data = None
    platform = user_data.get("platform", "")
    username = user_data.get("username")

    if platform == "AniList": data = get_user_anilist_data(username)
    elif platform == "MyAnimeList": data = get_user_MAL_data(username)

    if data is not None:
        all_lists = data.get('data', {}).get('MediaListCollection', {}).get('lists', [])

        if len(all_lists) > status_number:
            entries = all_lists[status_number].get('entries', [])

            for entry in entries:
                media = entry.get("media", {})
                title_obj = media.get("title", {})
                entry_title = title_obj.get("english") or title_obj.get("romaji")

                if entry_title:
                    anime_titles[entry_title] = entry_title

    return anime_titles

print(user_anime_status(0,{"platform":"Anilist","username":"RadzikTestAccount"}))