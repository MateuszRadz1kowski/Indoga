import psycopg2
from psycopg2.pool import ThreadedConnectionPool
from contextlib import contextmanager

from backend.config.db_settings import HOST, DATABASE, USER, PASSWORD

try:
    db_pool = ThreadedConnectionPool(
        minconn=1,
        maxconn=10,
        host=HOST,
        database=DATABASE,
        user=USER,
        password=PASSWORD
    )
    print("[DB] Connection pool created successfully.")
except Exception as e:
    print(f"[DB] Error creating connection pool: {e}")
    db_pool = None

@contextmanager
def get_db_connection():
    if db_pool is None:
        raise Exception("Database connection pool is not initialized.")
    
    conn = db_pool.getconn()
    try:
        yield conn
    finally:
        db_pool.putconn(conn)