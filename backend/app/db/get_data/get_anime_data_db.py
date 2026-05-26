import psycopg2

from backend.config.db_settings import HOST,DATABASE,USER,PASSWORD

SQL = """
SELECT * FROM anime_data
"""

def get_anime_data():
    config = {'host': HOST, 'database': DATABASE, 'user': USER, 'password': PASSWORD}
    try:
        with psycopg2.connect(**config) as conn:
            with conn.cursor() as cur:
                cur.execute(SQL)
                response = cur.fetchall()
            conn.commit()
            return response
    except Exception as e:
        print("DB ERROR:", e)