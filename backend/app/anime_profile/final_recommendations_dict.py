from backend.app.anime_profile.create_anime_profile import create_anime_profile
from backend.app.db.get_data.get_anime_data_db import get_anime_data
from backend.app.db.get_data.get_recommended_animes_data import get_recommended_animes_data
from backend.app.db.get_data.get_user_MAL_data import get_user_MAL_data
from backend.app.db.get_data.get_user_anilist_data import get_user_anilist_data
from backend.app.user_profile.create_user_interests_profile import create_user_interests_profile
from backend.app.api.exceptions import (
    EmptyListException,
    DatabaseException,
    AniRecException,
)
import time
from backend.config.redis_client import redis_client
import json

USER_CACHE_TTL = 86400


async def prepare_dictionary(filters, user_data):
    start_time = time.time()
    raw_data = await fetch_raw_user_data(user_data)

    if not raw_data:
        return {}

    recommendations_dictionary = {}
    anime_data = get_anime_data() or []

    user_tags, user_genres, user_recs = create_user_interests_profile(raw_data)
    user_interests_profile = (user_tags, user_genres, user_recs)

    if not user_tags and not user_genres:
        username = user_data.get("username", "")
        raise EmptyListException(username)

    anime_recommendations = create_anime_profile(
        anime_data, user_interests_profile, filters, user_data, raw_data
    )

    if not anime_recommendations:
        return {}

    recommended_anime_data = get_recommended_animes_data(
        tuple(anime_recommendations), filters["media_types"]
    )
    if recommended_anime_data is None:
        raise DatabaseException("Failed to fetch anime details from the database.")

    for recommendation in anime_recommendations.keys():
        recommendations_dictionary[recommendation] = {}

    for recommendation_data in recommended_anime_data:
        title = recommendation_data[2]
        recommendations_dictionary[title]["id"] = recommendation_data[0]
        recommendations_dictionary[title]["id_mal"] = recommendation_data[1]
        recommendations_dictionary[title]["title"] = recommendation_data[2]
        recommendations_dictionary[title]["season_year"] = recommendation_data[3]
        recommendations_dictionary[title]["format"] = recommendation_data[4]
        recommendations_dictionary[title]["isAdult"] = recommendation_data[5]
        recommendations_dictionary[title]["mean_score"] = recommendation_data[6]
        recommendations_dictionary[title]["description"] = recommendation_data[7]
        recommendations_dictionary[title]["episode_number"] = recommendation_data[8]
        recommendations_dictionary[title]["cover_image"] = recommendation_data[9]
        recommendations_dictionary[title]["trailer_id"] = recommendation_data[10]
        recommendations_dictionary[title]["trailer_site"] = recommendation_data[11]
        recommendations_dictionary[title]["season"] = recommendation_data[12]
        recommendations_dictionary[title]["score"] = anime_recommendations[title]["score"]
        recommendations_dictionary[title]["why_recommended"] = anime_recommendations[title]["why_recommended"]
        recommendations_dictionary[title]["external_links"] = recommendation_data[13] or []
        recommendations_dictionary[title]["popularity"] = recommendation_data[14]
        recommendations_dictionary[title]["avatar_url"] = (
            raw_data.get('data', {}).get('User', {}).get('avatar', {}).get('medium')
        )
        recommendations_dictionary[title]["status"] = recommendation_data[15]
        recommendations_dictionary[title]["creators"] = recommendation_data[16]
        recommendations_dictionary[title]["genres"] = recommendation_data[17] or []
        recommendations_dictionary[title]["bannerImage"] = recommendation_data[18]

    print("FINAL_RECOMMENDATIONS_DICT--- %s seconds ---" % (time.time() - start_time))
    return recommendations_dictionary


async def fetch_raw_user_data(user_data):
    platform = user_data.get("platform")
    username = user_data.get("username")

    if not username or not platform:
        raise AniRecException(
            error_code="server_error",
            detail="Username and platform are required.",
            status_code=400,
        )

    cache_key = f"user:{platform}:{username}"

    try:
        cached = redis_client.get(cache_key)
        if cached:
            return json.loads(cached)
    except Exception as e:
        print(f"[Redis] User cache read failed: {e}")

    if platform == "AniList":
        data = get_user_anilist_data(username)
    elif platform == "MyAnimeList":
        data = get_user_MAL_data(username)
    else:
        raise AniRecException(
            error_code="server_error",
            detail=f"Unknown platform: {platform}",
            status_code=400,
        )

    if data:
        try:
            redis_client.setex(cache_key, USER_CACHE_TTL, json.dumps(data))
        except Exception as e:
            print(f"[Redis] User cache write failed: {e}")

    return data