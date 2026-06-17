import psycopg2
import json
from backend.config.db_settings import HOST, DATABASE, USER, PASSWORD
from backend.config.redis_client import redis_client
from backend.app.api.exceptions import DatabaseException

SQL = "SELECT id, title_english, format, tags, genres, relations, popularity, favourites, mean_score, status, external_links, season_year, episode_number FROM anime_data"
ANIME_CACHE_KEY = "anime_db:all"
ANIME_CACHE_TTL = 86400

def get_anime_data():
    try:
        cached = redis_client.get(ANIME_CACHE_KEY)
        if cached:
            return json.loads(cached)
    except Exception as e:
        print(f"[Redis] Cache read failed, falling back to DB: {e}")

    config = {'host': HOST, 'database': DATABASE, 'user': USER, 'password': PASSWORD}
    try:
        with psycopg2.connect(**config) as conn:
            with conn.cursor() as cur:
                cur.execute(SQL)
                response = cur.fetchall()
            conn.commit()

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