import os
import sys
import glob
import csv
import json
import ast
import shutil
import psycopg2
from kaggle.api.kaggle_api_extended import KaggleApi

from backend.config.db_settings import HOST, DATABASE, USER, PASSWORD

DATASET_NAME = "calebmwelsh/anilist-anime-dataset"
TEMP_DIR = "./temp_kaggle_dataset"

INSERT_SQL = """
INSERT INTO anime_data (
    id, id_mal, title_english, season_year, format, is_adult,
    genres, tags, recommendations, popularity, favourites,
    mean_score, description, episode_number, cover_image,
    trailer_id, trailer_site, season, relations, external_links, status, banner_image, creators
)
VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
ON CONFLICT (id) DO UPDATE SET
    title_english = EXCLUDED.title_english,
    mean_score = EXCLUDED.mean_score,
    popularity = EXCLUDED.popularity,
    favourites = EXCLUDED.favourites,
    status = EXCLUDED.status,
    episode_number = EXCLUDED.episode_number,
    cover_image = EXCLUDED.cover_image,
    tags = EXCLUDED.tags,
    genres = EXCLUDED.genres,
    relations = EXCLUDED.relations,
    external_links = EXCLUDED.external_links,
    banner_image = EXCLUDED.banner_image,
    creators = EXCLUDED.creators,
    recommendations = EXCLUDED.recommendations
"""


def safe_int(value):
    try:
        return int(float(str(value).strip()))
    except (ValueError, TypeError):
        return None


def safe_bool(value):
    return str(value).strip().lower() in ("true", "1", "yes")


def clean_str(value):
    val = str(value).strip()
    return val if val and val not in ("None", "NaN", "nan", "null", "") else None


def parse_raw(value):
    value = str(value).strip()
    try:
        return json.loads(value)
    except (json.JSONDecodeError, ValueError):
        pass
    try:
        return ast.literal_eval(value)
    except Exception:
        pass
    return None


def convert_tags(raw):
    parsed = parse_raw(raw)
    res = []
    if isinstance(parsed, list):
        for item in parsed:
            if isinstance(item, dict):
                res.append({"name": str(item.get("name") or ""), "rank": int(item.get("rank") or 50)})
            elif isinstance(item, str):
                res.append({"name": item, "rank": 50})
    return json.dumps(res)


def convert_genres(raw):
    parsed = parse_raw(raw)
    res = []
    if isinstance(parsed, list):
        for item in parsed:
            res.append(str(item).strip())
    return json.dumps(res)


def convert_recommendations(raw):
    parsed = parse_raw(raw)
    res = []
    if isinstance(parsed, list):
        for item in parsed:
            if not isinstance(item, dict):
                continue
            node = item.get("node") or {}
            media = node.get("mediaRecommendation") or {}
            title_dict = media.get("title") or {}
            title = title_dict.get("english") or title_dict.get("romaji") or title_dict.get("native")
            if title:
                res.append(str(title))
    return json.dumps(res)


def convert_relations(raw):
    parsed = parse_raw(raw)
    res = []
    if isinstance(parsed, list):
        for item in parsed:
            if not isinstance(item, dict):
                continue
            rel_type = item.get("relationType")
            node = item.get("node") or {}
            fmt = node.get("format")
            if rel_type and fmt:
                res.append({
                    "type": str(rel_type).upper(),
                    "format": str(fmt).upper()
                })
    return json.dumps(res)


def convert_external_links(raw):
    parsed = parse_raw(raw)
    res = []
    if isinstance(parsed, list):
        for item in parsed:
            if not isinstance(item, dict):
                continue
            url = item.get("url")
            if url:
                res.append({
                    "url": str(url),
                    "icon": str(item.get("icon") or ""),
                    "site": str(item.get("site") or ""),
                    "type": str(item.get("type") or ""),
                })
    return json.dumps(res)


def convert_creators(studios_raw, staff_raw, is_manga):
    res = []
    if is_manga:
        parsed = parse_raw(staff_raw)
        if isinstance(parsed, list):
            for item in parsed:
                if not isinstance(item, dict):
                    continue
                role = item.get("role") or "Story"
                node = item.get("node") or {}
                name_dict = node.get("name") or {}
                full_name = name_dict.get("full")
                if full_name:
                    res.append({"role": str(role), "node": {"name": {"full": str(full_name)}}})
    else:
        parsed = parse_raw(studios_raw)
        if isinstance(parsed, list):
            for item in parsed:
                if not isinstance(item, dict):
                    continue
                node = item.get("node") or {}
                name = node.get("name")
                if name:
                    res.append({"name": str(name)})
    return json.dumps(res)


def download_and_extract_dataset():
    print(f"[{DATASET_NAME}] API KAGGLE iniciation")
    api = KaggleApi()
    api.authenticate()

    if not os.path.exists(TEMP_DIR):
        os.makedirs(TEMP_DIR)

    print("Dowloading and upack newest set")
    api.dataset_download_files(DATASET_NAME, path=TEMP_DIR, unzip=True)
    print("Downloading ended")


def process_and_insert():
    csv_files = glob.glob(os.path.join(TEMP_DIR, "*.csv"))
    if not csv_files:
        print("Error no CSV file found")
        return

    csv_file_path = csv_files[0]
    csv.field_size_limit(sys.maxsize)

    print(f"Mapping data from : {csv_file_path}")
    packed_data = []

    with open(csv_file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)

        for row in reader:
            media_id = safe_int(row.get("id"))
            if not media_id:
                continue

            format_val = clean_str(row.get("format"))
            is_manga = format_val in ("MANGA", "NOVEL", "ONE_SHOT")

            episodes = row.get("chapters") if is_manga else row.get("episodes")

            record = (
                media_id,
                safe_int(row.get("idMal")),
                clean_str(row.get("title_english")) or clean_str(row.get("title_romaji")),
                safe_int(row.get("seasonYear")),
                format_val,
                safe_bool(row.get("isAdult")),
                convert_genres(row.get("genres")),
                convert_tags(row.get("tags")),
                convert_recommendations(row.get("recommendations")),
                safe_int(row.get("popularity")),
                safe_int(row.get("favourites")),
                safe_int(row.get("meanScore")),
                clean_str(row.get("description")),
                safe_int(episodes),
                clean_str(row.get("coverImage_extraLarge")),
                clean_str(row.get("trailer_id")),
                clean_str(row.get("trailer_site")),
                clean_str(row.get("season")),
                convert_relations(row.get("relations")),
                convert_external_links(row.get("externalLinks")),
                clean_str(row.get("status")),
                clean_str(row.get("bannerImage")),
                convert_creators(row.get("studios"), row.get("staff"), is_manga),
            )
            packed_data.append(record)

    print(f"Processed {len(packed_data)} records. Importing do PostgreSQL...")

    chunk_size = 2000
    config = {"host": HOST, "database": DATABASE, "user": USER, "password": PASSWORD}

    try:
        with psycopg2.connect(**config) as conn:
            with conn.cursor() as cur:
                for i in range(0, len(packed_data), chunk_size):
                    chunk = packed_data[i: i + chunk_size]
                    cur.executemany(INSERT_SQL, chunk)
                    conn.commit()
                    print(f"  -> Saved: {i}–{i + len(chunk)} / {len(packed_data)}")
        print("\nSucces! Database updated.")
    except Exception as e:
        print("\n[Error DB]:", e)
        raise


def cleanup():
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
        print("Removed temporary files")


if __name__ == "__main__":
    try:
        download_and_extract_dataset()
        process_and_insert()
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cleanup()