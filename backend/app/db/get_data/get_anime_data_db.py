import psycopg2
import json
from backend.config.db_settings import HOST, DATABASE, USER, PASSWORD
from backend.config.redis_client import redis_client

SQL = "SELECT * FROM anime_data"
ANIME_CACHE_KEY = "anime_db:all"
ANIME_CACHE_TTL =  86400 

def get_anime_data():
    cached = redis_client.get(ANIME_CACHE_KEY)
    if cached:
        return json.loads(cached)

    config = {'host': HOST, 'database': DATABASE, 'user': USER, 'password': PASSWORD}
    try:
        with psycopg2.connect(**config) as conn:
            with conn.cursor() as cur:
                cur.execute(SQL)
                response = cur.fetchall()
            conn.commit()

        serializable = [list(row) for row in response]
        redis_client.setex(ANIME_CACHE_KEY, ANIME_CACHE_TTL, json.dumps(serializable))
        return response

    except Exception as e:
        print("DB ERROR:", e)