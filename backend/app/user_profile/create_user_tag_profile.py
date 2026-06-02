from backend.config.recommender_values_settings import (
    REPEAT_MULTIPLIER,
    USER_FAVOURITES_MULTIPLIER,
    score_multiplier
)
from backend.scripts.tag_count import get_tag_popularity_weight


def user_tag_profile(entry, user_data, user_tags):
    anime_score = entry["score"]
    tags = entry["media"]["tags"]
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

    for tag in tags:
        tag_name = tag["name"]
        tag_rank = tag["rank"] / 100.0

        if multiplier >= 0:
            pop_weight = get_tag_popularity_weight(tag)
        else:
            pop_weight = 1.0

        tag_score = (
            tag_rank
            * multiplier
            * repeat_multiplier
            * favourites_multiplier
            * pop_weight
        )

        user_tags[tag_name] = user_tags.get(tag_name, 0) + tag_score