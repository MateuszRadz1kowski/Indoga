import math
from backend.app.anime_profile.check_filters import check_if_adult, check_season_year, check_show_planning, \
    check_episode_number, check_media_type
from backend.app.anime_profile.user_anime_status import user_anime_status
from backend.config.reccomender_values_settings import ANIME_PROFILE_GENRE_MODIFIER, mean_score_multiplier, \
    anime_favourites_multiplier, ANIME_USER_PLANNING_MULTIPLIER, ANIME_PROFILE_API_RECOMMENDATIONS_MODIFIER


def create_anime_profile(db_response,user_interests_profile,filters):
    anime_profile = {}
    anime_completed = user_anime_status(0)
    anime_planning = user_anime_status(2)
    for anime in db_response:
        if len(anime_profile) >= 100:
            break

        anime_name = anime[2]
        anime_score = 0
        if anime_name in anime_completed:
            continue
        print(filters)
        if not (check_if_adult(anime, filters["show_18_rated"]) and
                check_season_year(anime,filters["min_release_year"],filters["max_release_year"]) and
                check_episode_number(anime, filters["min_number_episodes"], filters["max_number_episodes"]) and
                check_media_type(anime, filters["media_types"]) and
                check_show_planning(anime, anime_planning)): continue

        anime_profile[anime_name] = {
            "score": 0,
            "why_recommended": {}
        }
        for tag in anime[7]:
            tag_name = tag["name"]
            tag_rank = tag["rank"]
            if tag_name in user_interests_profile[0]:
                value = tag_rank * user_interests_profile[0][tag_name]

                anime_score += value

                anime_profile[anime_name]["why_recommended"].setdefault(tag_name, 0)
                anime_profile[anime_name]["why_recommended"][tag_name] += value

        for genre in anime[6]:
            if genre in user_interests_profile[1]:
                anime_score += ANIME_PROFILE_GENRE_MODIFIER * user_interests_profile[1][genre]

        if anime_name in anime_planning:
            anime_score *= ANIME_USER_PLANNING_MULTIPLIER

        if anime_name in user_interests_profile[2]:
            anime_score += ANIME_PROFILE_API_RECOMMENDATIONS_MODIFIER * user_interests_profile[2][anime_name]

        if anime[11] is not None:
            anime_score *= mean_score_multiplier(anime[11])
        anime_score *= anime_favourites_multiplier(anime[10])

        anime_profile[anime_name]["score"] = anime_score
    normalise_score(anime_profile)
    sorted_anime_profile = dict(
        sorted(
            anime_profile.items(),
            key=lambda x: x[1]["score"],
            reverse=True
        )
    )
    return sorted_anime_profile

def normalise_score(anime):
    sum_sq = 0.0

    for value in anime.values():
        sum_sq += value["score"] ** 2

    norm = math.sqrt(sum_sq)

    for key in anime:
        anime[key]["score"] = anime[key]["score"] / norm

    return anime