import math

from backend.app.db.get_data.get_user_MAL_data import get_user_MAL_data
from backend.app.user_profile.completed_anime_reccomendations_ import create_completed_anime_recommendations
from backend.app.user_profile.create_user_tag_profile import user_tag_profile
from backend.app.user_profile.user_genre_profile import user_genre_profile
from backend.app.db.get_data.get_user_anilist_data import get_user_anilist_data

def create_user_interests_profile(raw_data):
    data = raw_data
    if data is None:
        return None

    if data is not None:
        entries = data['data']['MediaListCollection']['lists'][0]['entries']
        user_data = data['data']['User']

        user_tags = {}
        user_genres = {}
        completed_anime_recommendations = {}

        for entry in entries:
            user_tag_profile(entry, user_data, user_tags)
            user_genre_profile(entry, user_data, user_genres)
            create_completed_anime_recommendations(entry, user_data, completed_anime_recommendations)

        user_tags = normalise_score(user_tags)
        user_genres = normalise_score(user_genres)
        completed_anime_recommendations = normalise_score(completed_anime_recommendations)

        user_tags = sort_interests(user_tags)
        user_genres = sort_interests(user_genres)
        completed_anime_recommendations = sort_interests(completed_anime_recommendations)
        return user_tags,user_genres,completed_anime_recommendations

def normalise_score(user_interests):
    sum_sq = 0.0

    for value in user_interests.values():
        sum_sq += value ** 2

    norm = math.sqrt(sum_sq)

    for key in user_interests:
        user_interests[key] = user_interests[key] / norm

    return user_interests


def sort_interests(user_interests):
    return dict(
        sorted(
            user_interests.items(),
            key=lambda x: x[1],
            reverse=True
        )
    )