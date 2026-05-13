import psycopg2

from backend.config.db_settings import HOST,DATABASE,USER,PASSWORD


def get_recommended_animes_data(anime_list, media_types="TV"):
    ANIME_FORMATS = ("TV", "TV_SHORT", "MOVIE", "SPECIAL", "OVA", "ONA", "MUSIC")
    MANGA_FORMATS = ("MANGA", "NOVEL", "ONE_SHOT")

    formats = MANGA_FORMATS if media_types == "MANGA" else ANIME_FORMATS

    placeholders_titles = ','.join(['%s'] * len(anime_list))
    placeholders_formats = ','.join(['%s'] * len(formats))
    SQL = f"""
    SELECT id, id_mal, title_english, season_year, format, is_adult,
           mean_score, description, episode_number, cover_image,
           trailer_id, trailer_site, season, external_links, popularity, status, studios, genres, banner_image
    FROM anime_data
    WHERE title_english IN ({placeholders_titles})
    AND format IN ({placeholders_formats})
    """
    config = {'host': HOST, 'database': DATABASE, 'user': USER, 'password': PASSWORD}
    try:
        with psycopg2.connect(**config) as conn:
            with conn.cursor() as cur:
                cur.execute(SQL, list(anime_list) + list(formats))
                return cur.fetchall()
    except Exception as e:
        print("DB ERROR:", e)