from backend.config.recommender_values_settings import REPEAT_MULTIPLIER, USER_FAVOURITES_MULTIPLIER, score_multiplier


def create_completed_anime_recommendations(entry, user_data, completed_anime_recommendations):
    anime_score = entry["score"]

    recommendations = entry["media"]["recommendations"]["nodes"]
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
            favourites_multiplier = USER_FAVOURITES_MULTIPLIER


    for recommendation in recommendations:
        try:
            recommendation_name = recommendation["mediaRecommendation"]["title"]["english"]
            tag_score = (
                    1
                    * multiplier
                    * repeat_multiplier
                    * favourites_multiplier
            )

            if recommendation_name not in completed_anime_recommendations:
                completed_anime_recommendations[recommendation_name] = 1
            elif recommendation_name is None:
                continue
            else:
                completed_anime_recommendations[recommendation_name] += tag_score
        except Exception as e:
            continue
