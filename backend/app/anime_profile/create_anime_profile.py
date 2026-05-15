import math

from backend.app.anime_profile.check_filters import (
    check_if_adult, check_season_year, check_show_planning,
    check_episode_number, check_show_media_type, check_mean_score,
    check_show_selected_tags, check_hide_selected_tags,
    check_show_selected_genres, check_hide_selected_genres,
    check_show_sequels, check_show_streaming_service
)
from backend.app.anime_profile.user_anime_status import user_anime_status
from backend.config.reccomender_values_settings import (
    mean_score_multiplier,
    anime_favourites_multiplier,
    ANIME_USER_PLANNING_MULTIPLIER,
    ANIME_PROFILE_API_RECOMMENDATIONS_MODIFIER,
    anime_popularity_multiplier,
    ANIME_PROFILE_GENRE_MODIFIER
)

FINAL_RESULTS_SIZE = 100


def build_anime_vector(anime):
    vector = {}

    for tag in (anime[7] or []):
        name = tag.get("name")
        rank = tag.get("rank", 0) / 100.0
        if name and rank > 0:
            vector[("tag", name)] = rank

    for genre in (anime[6] or []):
        if genre:
            vector[("genre", genre)] = 0.5 * ANIME_PROFILE_GENRE_MODIFIER

    if not vector:
        return {}

    norm = math.sqrt(sum(v ** 2 for v in vector.values()))
    if norm == 0:
        return {}

    return {k: v / norm for k, v in vector.items()}


def score_anime(anime_vector, user_tags, user_genres):
    score = 0.0
    why_recommended = {}

    for (feature_type, feature_name), anime_weight in anime_vector.items():
        if feature_type == "tag":
            user_weight = user_tags.get(feature_name, 0.0)
        else:
            user_weight = user_genres.get(feature_name, 0.0)

        if user_weight == 0.0:
            continue

        contribution = anime_weight * user_weight
        score += contribution

        if contribution > 0 and feature_type == "tag":
            why_recommended[feature_name] = contribution

    return score, why_recommended


def create_anime_profile(db_response, user_interests_profile, filters, user_data, raw_data):
    user_tags = user_interests_profile[0]
    user_genres = user_interests_profile[1]
    user_recs = user_interests_profile[2]

    all_statuses = user_anime_status(user_data, raw_data)
    anime_completed = all_statuses.get(0, {})
    anime_planning = all_statuses.get(2, {})

    anime_profile = {}

    for anime in db_response:
        anime_name = anime[2]
        if not anime_name:
            continue

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
            check_show_streaming_service(anime, filters["show_streaming_service"]) and
            check_show_planning(anime, anime_planning)
        ):
            continue

        anime_vector = build_anime_vector(anime)
        if not anime_vector:
            continue

        base_score, why_recommended = score_anime(anime_vector, user_tags, user_genres)

        if anime_name in user_recs:
            base_score += ANIME_PROFILE_API_RECOMMENDATIONS_MODIFIER * user_recs[anime_name]

        if anime_name in anime_planning:
            base_score *= ANIME_USER_PLANNING_MULTIPLIER

        base_score *= mean_score_multiplier(anime[11])

        base_score *= anime_favourites_multiplier(anime[10])

        base_score *= anime_popularity_multiplier(
            filters["popularity_importance"],
            anime[9]
        )

        anime_profile[anime_name] = {
            "score": base_score,
            "why_recommended": why_recommended
        }

    if not anime_profile:
        return {}

    normalise_score(anime_profile)
    prepare_recommendation_reasons(anime_profile)

    sorted_profile = dict(
        sorted(
            anime_profile.items(),
            key=lambda x: x[1]["score"],
            reverse=True
        )
    )

    return dict(list(sorted_profile.items())[:FINAL_RESULTS_SIZE])


def normalise_score(anime_profile):
    scores = [v["score"] for v in anime_profile.values()]
    min_score = min(scores)
    max_score = max(scores)

    score_range = max_score - min_score
    if score_range == 0:
        for key in anime_profile:
            anime_profile[key]["score"] = 0.5
        return

    for key in anime_profile:
        raw = anime_profile[key]["score"]
        anime_profile[key]["score"] = round((raw - min_score) / score_range, 4)

def prepare_recommendation_reasons(anime_profile):
    for data in anime_profile.values():
        reasons = data["why_recommended"]
        total = sum(reasons.values()) if reasons else 1

        if total <= 0:
            data["why_recommended"] = {}
            continue

        relative = {
            tag: round(contrib / total, 3)
            for tag, contrib in reasons.items()
            if contrib > 0
        }

        data["why_recommended"] = dict(
            sorted(relative.items(), key=lambda x: x[1], reverse=True)[:4]
        )