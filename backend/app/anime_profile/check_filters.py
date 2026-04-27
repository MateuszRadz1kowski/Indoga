from backend.app.anime_profile.filters import SHOW_PLANNING


def check_if_adult(anime,show_18_rated):
    if anime[5] is not None:
        if show_18_rated == True:
            return True
        elif anime[5] == True:
            return False
        else:
            return True
    return False


def check_media_type(anime,media_types):
    if anime[4] is not None:
        if anime[4] == media_types[0]:
            return True
        else:
            return False
    return False


def check_season_year(anime,min_release_year,max_release_year):
    if anime[3] is not None:
        if int(min_release_year) <= int(anime[3]) <= int(max_release_year):
            return True
        else:
            return False
    return False

def check_episode_number(anime,min_number_episodes,max_number_episodes):
    if anime[13] is not None:
        if int(min_number_episodes) <= int(anime[13]) <= int(max_number_episodes):
            return True
        else:
            return False
    return False


def check_show_planning(anime,anime_planning):
    if anime[2] is not None:
        if SHOW_PLANNING == True:
            return True
        elif anime[2] in anime_planning:
            return False
        else:
            return True
    return False

def check_mean_score(anime,min_mean_score):
    if anime[11] is not None:
        if anime[11] >= min_mean_score:
            return True
        else:
            return False
    return False


def check_show_selected_tags(anime, show_selected_tags):
    if not show_selected_tags:
        return True

    if anime[7] is None:
        return False

    try:
        anime_tag_names = {tag["name"] for tag in anime[7] if "name" in tag}

        return all(selected_tag in anime_tag_names for selected_tag in show_selected_tags)

    except (TypeError, KeyError, IndexError):
        return False