import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "homeo.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS patients (
            user_id TEXT PRIMARY KEY,
            name TEXT,
            age INTEGER,
            gender TEXT,
            blood_group TEXT,
            bp_high INTEGER DEFAULT 0,
            diabetic INTEGER DEFAULT 0,
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

    conn.execute("""
        CREATE TABLE IF NOT EXISTS consultations (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            symptom TEXT,
            severity TEXT,
            remedy_name TEXT,
            potency TEXT,
            condition TEXT,
            consult_doctor INTEGER,
            created_at TEXT DEFAULT (datetime('now'))
        )
    """)

    conn.execute("""
         CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE,
                password TEXT
        )
    """)

    conn.commit()
    conn.close()