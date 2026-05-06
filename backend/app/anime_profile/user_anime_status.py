from backend.app.db.get_data.get_user_MAL_data import get_user_MAL_data
from backend.app.db.get_data.get_user_anilist_data import get_user_anilist_data


def user_anime_status(status_number,filters):
    anime_completed = {}


    data = get_user_anilist_data("Radzik123")
    # data = get_user_MAL_data("Radz1k_")
    entries = data['data']['MediaListCollection']['lists'][status_number]['entries']
    for entry in entries:
        entry_title = entry["media"]["title"]["english"]
        if entry_title not in anime_completed:
            anime_completed[entry_title] = entry_title
    return anime_completed