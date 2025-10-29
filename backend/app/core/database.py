import psycopg2
from app.core import config


def get_connection():
    return psycopg2.connect(
        host=config.DB_HOST,
        database=config.DB_NAME,
        user=config.DB_USER,
        password=config.DB_PASS,
        sslmode=config.DB_SSL
    )
