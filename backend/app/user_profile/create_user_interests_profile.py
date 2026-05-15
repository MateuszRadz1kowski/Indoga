import math

from backend.app.user_profile.completed_anime_reccomendations_ import create_completed_anime_recommendations
from backend.app.user_profile.create_user_tag_profile import user_tag_profile
from backend.app.user_profile.user_genre_profile import user_genre_profile


def create_user_interests_profile(raw_data):
    if not raw_data:
        return {}, {}, {}

    inner_data = raw_data.get('data')
    if not inner_data:
        return {}, {}, {}

    collection = inner_data.get('MediaListCollection')
    if not collection or not collection.get('lists'):
        return {}, {}, {}

    user_data = inner_data.get('User', {})
    user_tags = {}
    user_genres = {}
    completed_anime_recommendations = {}

    for list in collection['lists']:
        status = list.get('name', '').lower()
        entries = list.get('entries', [])

        for entry in entries:
            if status == 'dropped' and entry.get('score') == 0:
                entry = dict(entry)
                entry['score'] = 2

            user_tag_profile(entry, user_data, user_tags)
            user_genre_profile(entry, user_data, user_genres)

            score = entry.get('score')
            score_format = user_data.get('mediaListOptions', {}).get('scoreFormat', 'POINT_10')
            if score_format in ('POINT_10', 'POINT_10_DECIMAL'):
                score_100 = score * 10
            elif score_format == 'POINT_5':
                score_100 = score * 20
            elif score_format == 'POINT_3':
                score_100 = score * 33
            else:
                score_100 = score

            if score_100 >= 65 or (score_100 == 0 and status not in ('dropped',)):
                create_completed_anime_recommendations(entry, user_data, completed_anime_recommendations)

    if user_tags:
        user_tags = normalise_score_with_negatives(user_tags)
    if user_genres:
        user_genres = normalise_score_with_negatives(user_genres)
    if completed_anime_recommendations:
        completed_anime_recommendations = normalise_score_positive_only(completed_anime_recommendations)

    return (
        sort_interests(user_tags),
        sort_interests(user_genres),
        sort_interests(completed_anime_recommendations)
    )


def normalise_score_with_negatives(user_interests):

    sum_sq = sum(v ** 2 for v in user_interests.values())
    if sum_sq == 0:
        return user_interests

    norm = math.sqrt(sum_sq)
    return {k: v / norm for k, v in user_interests.items()}


def normalise_score_positive_only(user_interests):
    positive = {k: v for k, v in user_interests.items() if v > 0}
    if not positive:
        return {}

    sum_sq = sum(v ** 2 for v in positive.values())
    norm = math.sqrt(sum_sq)
    return {k: v / norm for k, v in positive.items()}


def sort_interests(user_interests):
    return dict(
        sorted(
            user_interests.items(),
            key=lambda x: x[1],
            reverse=True
        )
    )