import psycopg2
import os
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("DATABASE_URL not found")

# Fix for Render/SQLAlchemy compatibility if needed
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)


def get_db():
    try:
        conn = psycopg2.connect(
            DATABASE_URL,
            sslmode="require"
        )
        print("Database connected successfully")
        return conn
    except Exception as e:
        print("Database connection failed:", str(e))
        raise


def init_db():
    conn = None
    cursor = None

    try:
        conn = get_db()
        cursor = conn.cursor()

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS patients (
                user_id TEXT PRIMARY KEY,
                name TEXT,
                age INTEGER,
                gender TEXT,
                blood_group TEXT,
                bp_high BOOLEAN DEFAULT FALSE,
                bp_low BOOLEAN DEFAULT FALSE,
                diabetic BOOLEAN DEFAULT FALSE,
                sugar_level TEXT,
                bp_reading TEXT,
                allergies TEXT,
                existing_conditions TEXT,
                other_conditions TEXT,
                current_medications TEXT,
                family_history TEXT,
                sleep_quality TEXT,
                overthinking_level TEXT,
                anger_level TEXT,
                appetite_level TEXT,
                food_preferences TEXT,
                stress_level TEXT,
                energy_level TEXT
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS consultations (
                id SERIAL PRIMARY KEY,
                user_id TEXT,
                symptom TEXT,
                severity TEXT,
                remedy_name TEXT,
                potency TEXT,
                condition TEXT,
                consult_doctor BOOLEAN,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE,
                password TEXT
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS saved_remedies (
                user_id TEXT,
                data JSONB,
                PRIMARY KEY (user_id)
            )
        """)

        conn.commit()
        print("Tables created successfully")

    except Exception as e:
        if conn:
            conn.rollback()
        print("Database initialization failed:", str(e))
        raise

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()