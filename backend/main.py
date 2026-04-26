from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from auth import (
    create_user,
    authenticate_user
)
from schemas import (
    UserSignup,
    UserLogin
)

from database import init_db
from schemas import (
    PatientProfile,
    ConsultRequest
)
from crud import (
    register_patient,
    get_patient_from_db,
    save_consultation
)
from logic import (
    df,
    smart_symptom_match,
    find_row,
    detect_category,
    build_response,
    generate_human_response
)


app = FastAPI(
    title="SmartHomeoAIAdvisor API",
    version="2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

init_db()


@app.get("/")
def health():
    return {
        "status": "running"
    }

@app.post("/api/auth/signup")
def signup(user: UserSignup):
    user_id = create_user(
    user.user_id,
    user.email,
    user.password
)

    return {
        "success": True,
        "user_id": user_id,
        "email": user.email,
        "message": "Signup successful"
    }


@app.post("/api/auth/login")
def login(user: UserLogin):
    auth = authenticate_user(
        user.email,
        user.password
    )

    if not auth:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    return {
        "success": True,
        "message": "Login successful"
    }


@app.get("/symptoms")
def get_symptoms():
    symptoms = sorted(
        df["symptom"].unique().tolist()
    )

    return {
        "total": len(symptoms),
        "symptoms": symptoms
    }


@app.post("/patient/register")
def register(patient: PatientProfile):
    return register_patient(patient)


@app.get("/patient/{user_id}")
def get_patient(user_id: str):
    patient = get_patient_from_db(user_id)

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient


@app.post("/consult")
def consult(req: ConsultRequest):
    user_input = req.symptom.lower().strip()
    severity = req.severity.lower().strip()

    patient = get_patient_from_db(req.user_id)

    mapped_symptom = smart_symptom_match(
        user_input
    )

    row = find_row(
        df,
        mapped_symptom,
        severity
    )

    if row is None:
        raise HTTPException(
            status_code=404,
            detail="No remedy found"
        )

    save_consultation(
        req.user_id,
        mapped_symptom,
        severity,
        row.get("remedy_name"),
        row.get("potency"),
        row.get("possible_condition"),
        1
    )

    response = build_response(
        row,
        patient,
        mapped_symptom,
        severity
    )

    human_message = generate_human_response(
        response
    )

    return {
        "success": True,
        "data": response,
        "message": human_message
    }