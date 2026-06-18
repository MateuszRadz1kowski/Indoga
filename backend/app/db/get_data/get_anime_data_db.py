import psycopg2
import json

from backend.config.redis_client import redis_client
from backend.app.api.exceptions import DatabaseException
from backend.app.db.threaded_connection_pool import get_db_connection

SQL = "SELECT id, id_mal, title_english, season_year, format, is_adult, genres, tags, recommendations, popularity, favourites, mean_score, description, episode_number, cover_image, trailer_id, trailer_site, season, relations, external_links, status, banner_image, creators FROM anime_data"
ANIME_CACHE_KEY = "anime_db:all"
ANIME_CACHE_TTL = 86400

def get_anime_data():
    try:
        cached = redis_client.get(ANIME_CACHE_KEY)
        if cached:
            return json.loads(cached)
    except Exception as e:
        print(f"[Redis] Cache read failed, falling back to DB: {e}")

    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(SQL)
                response = cur.fetchall()

        try:
            redis_client.setex(ANIME_CACHE_KEY, ANIME_CACHE_TTL, json.dumps(response))
        except Exception as e:
            print(f"[Redis] Cache write failed: {e}")

        return response

    except psycopg2.OperationalError as e:
        print(f"[DB] Connection error: {e}")
        raise DatabaseException("Cannot connect to the database. Try again shortly.")
    except psycopg2.Error as e:
        print(f"[DB] Query error: {e}")
        raise DatabaseException("Database query failed.")
    except Exception as e:
        print(f"[DB] Unexpected error: {e}")
        raise DatabaseException(str(e))