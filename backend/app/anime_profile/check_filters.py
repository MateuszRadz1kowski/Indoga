MANGA_FORMATS = {"MANGA", "NOVEL", "ONE_SHOT"}
    
def check_if_adult(anime,show_18_rated):
    if anime[5] is not None:
        if show_18_rated == True:
            return True
        elif anime[5] == True:
            return False
        else:
            return True
    return True

def check_episode_number(anime, min_number_episodes, max_number_episodes):
    if anime[13] is not None:
        if int(min_number_episodes) <= int(anime[13]) <= int(max_number_episodes):
            return True
        else:
            return False
    return False


def check_season_year(anime, min_release_year, max_release_year):
    if anime[3] is not None:
        if int(min_release_year) <= int(anime[3]) <= int(max_release_year):
            return True
        else:
            return False
    return False

def check_show_planning(anime, show_planning, anime_planning):
    format = anime[4] or ""
    group = "MANGA" if format in MANGA_FORMATS else "ANIME"
    anime_key = (anime[2], group)
    
    if anime_key in anime_planning:
        return True if show_planning else False

    return True

def check_mean_score(anime, min_score):
    if min_score == 0:
        return True
    if anime[11] is None:
        return False
    return anime[11] >= min_score


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

def check_hide_selected_tags(anime, hide_selected_tags):
    if not hide_selected_tags:
        return True

    if anime[7] is None:
        return False

    try:
        anime_tag_names = {tag["name"] for tag in anime[7] if "name" in tag}

        return all(selected_tag not in anime_tag_names for selected_tag in hide_selected_tags)

    except (TypeError, KeyError, IndexError):
        return False


def check_show_selected_genres(anime, show_selected_genres):
    if not show_selected_genres:
        return True

    anime_genres = anime[6]
    if anime_genres is None:
        return False

    try:
        return all(genre in anime_genres for genre in show_selected_genres)
    except (TypeError, KeyError, IndexError):
        return False


def check_hide_selected_genres(anime, hide_selected_genres):
    if not hide_selected_genres:
        return True

    anime_genres = anime[6]
    if anime_genres is None:
        return True

    try:
        return not any(genre in hide_selected_genres for genre in anime_genres)
    except (TypeError, KeyError, IndexError):
        return False


def check_show_sequels(anime, show_sequels):
    if show_sequels == True:
        return True

    anime_format = anime[4]

    if anime_format in {"MANGA", "NOVEL", "ONE_SHOT"}:
        manga_sequels_formats = {"PREQUEL", "PARENT", "SUMMARY", "SEQUEL"}
        for relation in anime[18]:
            rel_type = str(relation.get("type") or "").upper()
            if rel_type in manga_sequels_formats:
                return False
        return True

    else:
        if anime_format != "TV":
            for relation in anime[18]:
                rel_type = relation.get("type") or ""
                if rel_type in { "PREQUEL", "PARENT", "SUMMARY", "SIDE_STORY", "ALTERNATIVE"}:
                    return False
            return True


        for relation in anime[18]:
            rel_type = relation.get("type") or ""
            related_format = relation.get("format") or ""

            if rel_type in {"PREQUEL", "PARENT"} and related_format == "TV":
                return False
        return True

def check_show_media_type(anime, media_types):
    ANIME_FORMATS = {"TV", "TV_SHORT", "MOVIE", "SPECIAL", "OVA", "ONA", "MUSIC"}

    anime_format = anime[4]
    if anime_format is None:
        return False

    if media_types == "TV":
        return anime_format in ANIME_FORMATS
    elif media_types == "MANGA":
        return anime_format in MANGA_FORMATS

    return False

def check_show_streaming_service(anime, show_streaming_service):
    if show_streaming_service == "All":
        return True

    if not anime[19]:
        return False

    for link in anime[19]:
        site_name = link.get("site", "")
        if show_streaming_service == site_name:
            return True
    return False


def check_high_popularity(anime, show_high_popularity):
    if show_high_popularity:
        return True

    if anime[4] not in {"MANGA", "NOVEL", "ONE_SHOT"} and anime[10] >= 7000 and anime[9] >= 150000:
        return False
    elif anime[4] in {"MANGA", "NOVEL", "ONE_SHOT"} and anime[10] >= 2500 and anime[9] >= 30000:
        return False

    for relation in anime[18]:
        rel_type = relation.get("type").upper()
        if rel_type in ["PARENT", "SIDE_STORY", "ALTERNATIVE", "SUMMARY"]:
            return False

    return True