from backend.app.db.get_data.get_user_MAL_data import get_user_MAL_data
from backend.app.db.get_data.get_user_anilist_data import get_user_anilist_data


def user_anime_status(status_number,user_data):
    anime_completed = {}

    data = None
    if user_data["platform"] == "AniList":  data = get_user_anilist_data(user_data["username"])
    if user_data["platform"] == "MyAnimeList": data = get_user_MAL_data(user_data["username"])

    if data is not None:
        entries = data['data']['MediaListCollection']['lists'][status_number]['entries']
        for entry in entries:
            entry_title = entry["media"]["title"]["english"]
            if entry_title not in anime_completed:
                anime_completed[entry_title] = entry_title
        return anime_completed