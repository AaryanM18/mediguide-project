import json
from database import get_db


def register_patient(patient):
    conn = get_db()

    conn.execute("""
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
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON CONFLICT(user_id) DO UPDATE SET
            name=excluded.name,
            age=excluded.age,
            gender=excluded.gender,
            blood_group=excluded.blood_group,
            bp_high=excluded.bp_high,
            bp_low=excluded.bp_low,
            diabetic=excluded.diabetic,
            sugar_level=excluded.sugar_level,
            bp_reading=excluded.bp_reading,
            allergies=excluded.allergies,
            existing_conditions=excluded.existing_conditions,
            other_conditions=excluded.other_conditions,
            current_medications=excluded.current_medications,
            family_history=excluded.family_history,
            sleep_quality=excluded.sleep_quality,
            overthinking_level=excluded.overthinking_level,
            anger_level=excluded.anger_level,
            appetite_level=excluded.appetite_level,
            food_preferences=excluded.food_preferences,
            stress_level=excluded.stress_level,
            energy_level=excluded.energy_level
    """, (
        patient.user_id,
        patient.name,
        patient.age,
        patient.gender,
        patient.blood_group,
        int(patient.bp_high),
        int(patient.bp_low),
        int(patient.diabetic),
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
    conn.close()

    return {
        "success": True,
        "message": f"Profile saved for {patient.name}"
    }

def get_patient_from_db(user_id):
    conn = get_db()

    row = conn.execute(
        "SELECT * FROM patients WHERE user_id = ?",
        (user_id,)
    ).fetchone()

    conn.close()

    if not row:
        return {}

    patient = dict(row)

    for field in [
        "allergies",
        "existing_conditions",
        "current_medications",
        "family_history",
        "food_preferences"
    ]:
        try:
            patient[field] = json.loads(patient.get(field) or "[]")
        except:
            patient[field] = []


    patient["bp_high"] = bool(patient.get("bp_high", 0))
    patient["bp_low"] = bool(patient.get("bp_low", 0))
    patient["diabetic"] = bool(patient.get("diabetic", 0))

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

    conn.execute("""
        INSERT INTO consultations (
            user_id,
            symptom,
            severity,
            remedy_name,
            potency,
            condition,
            consult_doctor
        )
        VALUES (?,?,?,?,?,?,?)
    """, (
        user_id,
        symptom,
        severity,
        remedy_name,
        potency,
        condition,
        consult_doctor
    ))

    conn.commit()
    conn.close()

def get_patient_profile(user_id):
    conn = get_db()

    patient = conn.execute(
        "SELECT * FROM patients WHERE user_id=?",
        (user_id,)
    ).fetchone()

    conn.close()

    return patient    