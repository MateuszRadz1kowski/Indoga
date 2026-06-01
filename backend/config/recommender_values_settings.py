import math

REPEAT_MULTIPLIER = 1  # w kodzie: repeat + multiplier, więc 1x powtórzenie = *2
USER_FAVOURITES_MULTIPLIER = 2
TAG_WEIGHT_BASE_BONUS = 100
ANIME_PROFILE_GENRE_MODIFIER = 1.0
ANIME_PROFILE_API_RECOMMENDATIONS_MODIFIER = 0.3
ANIME_USER_PLANNING_MULTIPLIER = 1.3

# Górna granica dla normalizacji popularności
MAX_POPULARITY_REFERENCE = 500_000

def score_multiplier(score_100):
    if score_100 == 0: return 0.5
    if score_100 < 20: return -2.0
    if score_100 < 30: return -1.5
    if score_100 < 40: return -0.8
    if score_100 < 50: return -0.3
    if score_100 < 55: return 0.2
    if score_100 < 60: return 0.5
    if score_100 < 65: return 0.9
    if score_100 < 70: return 1.2
    if score_100 < 75: return 1.5
    if score_100 < 80: return 1.8
    if score_100 < 85: return 2.1
    if score_100 < 90: return 2.4
    if score_100 < 95: return 2.7
    if score_100 < 98: return 2.85
    if score_100 < 100: return 2.95
    return 3.0


def mean_score_multiplier(score_100):
    if score_100 is None: return 0.8
    if score_100 < 30: return 0.3
    if score_100 < 40: return 0.5
    if score_100 < 50: return 0.7
    if score_100 < 55: return 0.85
    if score_100 < 60: return 1.0
    if score_100 < 65: return 1.1
    if score_100 < 70: return 1.2
    if score_100 < 75: return 1.3
    if score_100 < 79: return 1.4
    if score_100 < 83: return 1.5
    if score_100 < 85: return 1.6
    if score_100 < 88: return 1.7
    if score_100 < 90: return 1.8
    return 2.0


def anime_favourites_multiplier(favourites):
    fav = max(favourites or 0, 0)
    if fav == 0:
        return 1.0
    return 1.0 + 0.3 * math.log1p(fav) / math.log1p(10000)


def anime_popularity_multiplier(popularity_importance, popularity):
    pop = max(popularity or 1, 1)

    log_max = math.log1p(MAX_POPULARITY_REFERENCE)
    norm_pop = min(math.log1p(pop) / log_max, 1.0)

    if popularity_importance == "low":
        return 0.8 + 0.4 * (1.0 - norm_pop)

    elif popularity_importance == "high":
        return 0.5 + 1.5 * norm_pop

    else:
        return 0.95 + 0.1 * norm_pop