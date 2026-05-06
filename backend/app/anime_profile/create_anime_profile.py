import math
from backend.app.anime_profile.check_filters import (
    check_if_adult, check_season_year, check_show_planning,
    check_episode_number, check_show_media_type, check_mean_score,
    check_show_selected_tags, check_hide_selected_tags,
    check_show_selected_genres, check_hide_selected_genres,
    check_show_sequels
)
from backend.app.anime_profile.user_anime_status import user_anime_status
from backend.config.reccomender_values_settings import (
    ANIME_PROFILE_GENRE_MODIFIER, mean_score_multiplier,
    anime_favourites_multiplier, ANIME_USER_PLANNING_MULTIPLIER,
    ANIME_PROFILE_API_RECOMMENDATIONS_MODIFIER, anime_popularity_multiplier
)

CANDIDATE_POOL_SIZE = 10000

FINAL_RESULTS_SIZE = 100


def create_anime_profile(db_response, user_interests_profile, filters):
    anime_profile = {}
    anime_completed = user_anime_status(0,filters)
    anime_planning = user_anime_status(2,filters)
    for anime in db_response:
        if len(anime_profile) >= CANDIDATE_POOL_SIZE:
            break

        anime_name = anime[2]

        if anime_name in anime_completed:
            continue

        if not (
            check_if_adult(anime, filters["show_18_rated"]) and
            check_season_year(anime, filters["min_release_year"], filters["max_release_year"]) and
            check_episode_number(anime, filters["min_number_episodes"], filters["max_number_episodes"]) and
            check_mean_score(anime, filters["min_mean_score"]) and
            check_show_selected_tags(anime, filters["show_selected_tags"]) and
            check_hide_selected_tags(anime, filters["hide_selected_tags"]) and
            check_show_selected_genres(anime, filters["show_selected_genres"]) and
            check_hide_selected_genres(anime, filters["hide_selected_genres"]) and
            check_show_sequels(anime, filters["show_sequels"]) and
            check_show_media_type(anime, filters["media_types"]) and
            check_show_planning(anime, anime_planning)
        ):
            continue

        anime_profile[anime_name] = {
            "score": 0.0,
            "why_recommended": {}
        }

        anime_score = 0.0

        for tag in (anime[7] or []):
            tag_name = tag.get("name")
            tag_rank = tag.get("rank", 0)
            if tag_name and tag_name in user_interests_profile[0]:
                value = tag_rank * user_interests_profile[0][tag_name]
                anime_score += value
                anime_profile[anime_name]["why_recommended"].setdefault(tag_name, 0.0)
                anime_profile[anime_name]["why_recommended"][tag_name] += value

        for genre in (anime[6] or []):
            if genre in user_interests_profile[1]:
                anime_score += ANIME_PROFILE_GENRE_MODIFIER * user_interests_profile[1][genre]

        if anime_name in anime_planning:
            anime_score *= ANIME_USER_PLANNING_MULTIPLIER

        if anime_name in user_interests_profile[2]:
            anime_score += ANIME_PROFILE_API_RECOMMENDATIONS_MODIFIER * user_interests_profile[2][anime_name]

        if anime[11] is not None:
            anime_score *= mean_score_multiplier(anime[11])
        anime_score *= anime_favourites_multiplier(anime[10])

        anime_score *= anime_popularity_multiplier(
            filters["popularity_importance"],
            anime[9]
        )

        anime_profile[anime_name]["score"] = anime_score

    normalise_score(anime_profile)

    sorted_profile = dict(
        sorted(
            anime_profile.items(),
            key=lambda x: x[1]["score"],
            reverse=True
        )
    )

    final = dict(list(sorted_profile.items())[:FINAL_RESULTS_SIZE])
    return final


def normalise_score(anime: dict) -> dict:
    if not anime:
        return anime

    sum_sq = sum(v["score"] ** 2 for v in anime.values())

    if sum_sq == 0.0:
        return anime

    norm = math.sqrt(sum_sq)

    for key in anime:
        anime[key]["score"] = anime[key]["score"] / norm

    return anime