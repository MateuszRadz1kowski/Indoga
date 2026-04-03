from backend.app.anime_profile.filters import FORMAT, SHOW_PLANNING


def check_if_adult(anime,show_18_rated):
    if anime[5] is not None:
        if show_18_rated == True:
            return True
        elif anime[5] == True:
            return False
        else:
            return True
    return None


# def check_format(anime):
#     if anime[4] is not None:
#         if FORMAT[anime[4]] == True:
#             return True
#         else:
#             return False
#     return None


def check_season_year(anime,min_release_year,max_release_year):
    if anime[3] is not None:
        if int(min_release_year) <= int(anime[3]) <= int(max_release_year):
            return True
        else:
            return False
    return None

def check_episode_number(anime,min_number_episodes,max_number_episodes):
    if anime[13] is not None:
        if int(min_number_episodes) <= int(anime[13]) <= int(max_number_episodes):
            return True
        else:
            return False
    return None


def check_show_planning(anime,anime_planning):
    if anime[2] is not None:
        if SHOW_PLANNING == True:
            return True
        elif anime[2] in anime_planning:
            return False
        else:
            return True
    return None