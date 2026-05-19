from backend.app.db.get_data.get_user_MAL_data import get_user_MAL_data
from backend.app.db.get_data.get_user_anilist_data import get_user_anilist_data


def user_anime_status(user_data, raw_data):
    data = raw_data
    if data is None:
        platform = user_data.get("platform")
        username = user_data.get("username")
        if platform == "AniList":
            data = get_user_anilist_data(username)
        elif platform == "MyAnimeList":
            data = get_user_MAL_data(username)

    if data is None:
        return {}

    all_lists = data.get('data', {}).get('MediaListCollection', {}).get('lists', [])

    result = {
        "COMPLETED": {},
        "PLANNING": {},
        "CURRENT": {},
        "DROPPED": {},
        "PAUSED": {}
    }

    for list in all_lists:
        for entry in list.get('entries', []):
            entry_status = entry.get("status")
            if not entry_status:
                continue

            media = entry.get("media", {})
            title_obj = media.get("title", {})
            entry_title = title_obj.get("english") or title_obj.get("romaji")
            if entry_title:
                if entry_status in result:
                    result[entry_status][entry_title] = entry_title
                else:
                    result[entry_status] = {entry_title: entry_title}

    return result