import json
from database import get_db


def register_patient(patient):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO patients (
            user_id,
            name,
            age,
            gender,
            blood_group,
            bp_high,
            bp_low,
            diabetic,
            sugar_level,
            bp_reading,
            allergies,
            existing_conditions,
            other_conditions,
            current_medications,
            family_history,
            sleep_quality,
            overthinking_level,
            anger_level,
            appetite_level,
            food_preferences,
            stress_level,
            energy_level
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        ON CONFLICT(user_id) DO UPDATE SET
            name=EXCLUDED.name,
            age=EXCLUDED.age,
            gender=EXCLUDED.gender,
            blood_group=EXCLUDED.blood_group,
            bp_high=EXCLUDED.bp_high,
            bp_low=EXCLUDED.bp_low,
            diabetic=EXCLUDED.diabetic,
            sugar_level=EXCLUDED.sugar_level,
            bp_reading=EXCLUDED.bp_reading,
            allergies=EXCLUDED.allergies,
            existing_conditions=EXCLUDED.existing_conditions,
            other_conditions=EXCLUDED.other_conditions,
            current_medications=EXCLUDED.current_medications,
            family_history=EXCLUDED.family_history,
            sleep_quality=EXCLUDED.sleep_quality,
            overthinking_level=EXCLUDED.overthinking_level,
            anger_level=EXCLUDED.anger_level,
            appetite_level=EXCLUDED.appetite_level,
            food_preferences=EXCLUDED.food_preferences,
            stress_level=EXCLUDED.stress_level,
            energy_level=EXCLUDED.energy_level
    """, (
        patient.user_id,
        patient.name,
        patient.age,
        patient.gender,
        patient.blood_group,
        patient.bp_high,
        patient.bp_low,
        patient.diabetic,
        patient.sugar_level,
        patient.bp_reading,
        json.dumps(patient.allergies),
        json.dumps(patient.existing_conditions),
        patient.other_conditions,
        json.dumps(patient.current_medications),
        json.dumps(
            [item.dict() for item in patient.family_history]
        ),
        patient.sleep_quality,
        patient.overthinking_level,
        patient.anger_level,
        patient.appetite_level,
        json.dumps(patient.food_preferences),
        patient.stress_level,
        patient.energy_level
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return {
        "success": True,
        "message": f"Profile saved for {patient.name}"
    }


def get_patient_from_db(user_id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM patients WHERE user_id = %s",
        (user_id,)
    )

    row = cursor.fetchone()

    if not row:
        cursor.close()
        conn.close()
        return {}

    columns = [desc[0] for desc in cursor.description]
    patient = dict(zip(columns, row))

    for field in [
        "allergies",
        "existing_conditions",
        "current_medications",
        "family_history",
        "food_preferences"
    ]:
        try:
            patient[field] = json.loads(
                patient.get(field) or "[]"
            )
        except:
            patient[field] = []

    patient["bp_high"] = bool(patient.get("bp_high", False))
    patient["bp_low"] = bool(patient.get("bp_low", False))
    patient["diabetic"] = bool(patient.get("diabetic", False))

    cursor.close()
    conn.close()

    return patient


def save_consultation(
    user_id,
    symptom,
    severity,
    remedy_name,
    potency,
    condition,
    consult_doctor
):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO consultations (
            user_id,
            symptom,
            severity,
            remedy_name,
            potency,
            condition,
            consult_doctor
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s)
    """, (
        user_id,
        symptom,
        severity,
        remedy_name,
        potency,
        condition,
        bool(consult_doctor)
    ))

    conn.commit()
    cursor.close()
    conn.close()


def get_consultation_history(user_id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM consultations WHERE user_id = %s ORDER BY created_at DESC LIMIT 20",
        (user_id,)
    )

    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]
    
    history = []
    for row in rows:
        item = dict(zip(columns, row))
        item["created_at"] = str(item["created_at"])
        history.append(item)

    cursor.close()
    conn.close()
    return history


def get_saved_remedies(user_id):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT data FROM saved_remedies WHERE user_id = %s",
        (user_id,)
    )

    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if row:
        return row[0]
    return []


def save_remedies(user_id, data):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO saved_remedies (user_id, data)
        VALUES (%s, %s)
        ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data
    """, (user_id, json.dumps(data)))

    conn.commit()
    cursor.close()
    conn.close()
    return True