import psycopg2
import os


NEON_URL = "postgresql://neondb_owner:npg_SeijqlHh7NG3@ep-shy-firefly-an0xw4m1-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL = os.getenv("DATABASE_URL", NEON_URL)


def get_db():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        print("Database connected successfully")
        return conn
    except Exception as e:
        print("Database connection failed:", str(e))
        raise


def init_db():
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

    conn.commit()
    cursor.close()
    conn.close()