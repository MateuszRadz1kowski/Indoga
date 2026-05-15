from backend.config.reccomender_values_settings import (
    REPEAT_MULTIPLIER,
    USER_FAVOURITES_MULTIPLIER,
    score_multiplier
)

def user_genre_profile(entry, user_data, user_genres):
    anime_score = entry["score"]
    genres = entry["media"]["genres"]
    repeat_multiplier = entry["repeat"] + REPEAT_MULTIPLIER
    favourites_multiplier = 1

    score_format = user_data["mediaListOptions"]["scoreFormat"]
    if score_format in ("POINT_10", "POINT_10_DECIMAL"):
        anime_score *= 10
    elif score_format == "POINT_5":
        anime_score *= 20
    elif score_format == "POINT_3":
        anime_score *= 33

    multiplier = score_multiplier(anime_score)

    for fav in user_data["favourites"]["anime"]["nodes"]:
        if entry["media"]["id"] == fav["id"]:
            if multiplier > 0:
                favourites_multiplier = USER_FAVOURITES_MULTIPLIER
            break

    for genre in genres:
        contribution = multiplier * repeat_multiplier * favourites_multiplier
        user_genres[genre] = user_genres.get(genre, 0) + contribution