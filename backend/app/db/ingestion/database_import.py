import psycopg2

from backend.config.db_settings import HOST,DATABASE,USER,PASSWORD
from backend.scripts.tag_count import count_tags
from anilist_export_data import anilist_export_data, anilist_pack_data_to_db

INSERT_SQL = """
INSERT INTO anime_data (
    id, id_mal, title_english, season_year, format, is_adult,
    genres, tags, recommendations, popularity, favourites,
    mean_score, description, episode_number, cover_image,
    trailer_id, trailer_site, season, relations, external_links, status, banner_image, creators
)
VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
ON CONFLICT (id) DO UPDATE SET
    mean_score = EXCLUDED.mean_score,
    external_links = EXCLUDED.external_links
"""

def insert_anime_data(data):
    config = {'host': HOST, 'database': DATABASE, 'user': USER, 'password': PASSWORD}
    if not data:
        return
    try:
        with psycopg2.connect(**config) as conn:
            with conn.cursor() as cur:
                cur.executemany(INSERT_SQL, data)
            conn.commit()
            print(f"Inserted {len(data)} records")
    except Exception as e:
        print("DB ERROR:", e)

page = 1

for m_type in ["ANIME", "MANGA"]:
    page = 1
    while True:
        print(f"Fetching {m_type} page {page}...")
        raw_data = anilist_export_data(page, m_type)

        if raw_data is None:
            break

        packed_data = anilist_pack_data_to_db(raw_data)

        if packed_data:
            insert_anime_data(packed_data)

        try:
            page_info = raw_data.get("data", {}).get("Page", {}).get("pageInfo", {})
            has_next = page_info.get("hasNextPage", False)
        except Exception:
            has_next = False

        if not has_next:
            print(f"Finished {m_type}. No more pages.")
            break
        page += 1
insert_anime_data(anilist_pack_data_to_db(anilist_export_data(1)))