import psycopg2
import os


DATABASE_URL = os.getenv("DATABASE_URL")


def get_db():
    conn = psycopg2.connect(DATABASE_URL)
    return conn


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