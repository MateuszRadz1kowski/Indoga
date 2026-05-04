import math

REPEAT_MULTIPLIER = 1  # w kodzie: repeat + multiplier, więc 1x powtórzenie = *2
USER_FAVOURITES_MULTIPLIER = 2
TAG_WEIGHT_BASE_BONUS = 100
ANIME_PROFILE_GENRE_MODIFIER = 15   # 0-100, wagowanie gatunków względem tagów
ANIME_PROFILE_API_RECOMMENDATIONS_MODIFIER = 20
ANIME_USER_PLANNING_MULTIPLIER = 1.5

# Górna granica dla normalizacji popularności
MAX_POPULARITY_REFERENCE = 500_000

def score_multiplier(score_100):
    if score_100 < 15: return 0.3
    if score_100 < 30: return 0.45
    if score_100 < 40: return 0.6
    if score_100 < 50: return 0.75
    if score_100 < 55: return 1.0
    if score_100 < 60: return 1.15
    if score_100 < 65: return 1.3
    if score_100 < 70: return 1.5
    if score_100 < 75: return 1.7
    if score_100 < 80: return 1.8
    if score_100 < 85: return 2.0
    if score_100 < 90: return 2.2
    if score_100 < 95: return 2.45
    if score_100 < 98: return 2.6
    if score_100 < 100: return 2.7
    return 3.0


def mean_score_multiplier(score_100):
    if score_100 < 30: return 0.05
    if score_100 < 40: return 0.1
    if score_100 < 50: return 0.2
    if score_100 < 55: return 0.5
    if score_100 < 60: return 0.7
    if score_100 < 65: return 1.0
    if score_100 < 70: return 1.2
    if score_100 < 75: return 1.5
    if score_100 < 79: return 1.7
    if score_100 < 83: return 2.0
    if score_100 < 85: return 2.3
    if score_100 < 88: return 2.5
    if score_100 < 90: return 2.7
    return 3.0


def anime_favourites_multiplier(favourites):
    return math.log1p(max(favourites or 0, 0))


def anime_popularity_multiplier(popularity_importance, popularity):
    pop = max(popularity or 1, 1)

    log_max = math.log1p(MAX_POPULARITY_REFERENCE)
    norm_pop = min(math.log1p(pop) / log_max, 1.0)

    if popularity_importance == "low":
        return 0.3 + 2.2 * (1.0 - norm_pop)

    elif popularity_importance == "high":
        return 0.3 + 2.7 * norm_pop

    else:
        return 0.5 + 1.0 * norm_pop
