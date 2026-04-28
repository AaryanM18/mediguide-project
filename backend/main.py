from fastapi import FastAPI, HTTPException
print("✅ FastAPI imported")

from fastapi.middleware.cors import CORSMiddleware
print("✅ CORS imported")


from auth import (
    create_user,
    authenticate_user
)
print("✅ auth.py imported")


from schemas import (
    UserSignup,
    UserLogin
)
print("✅ auth schemas imported")


from database import init_db
print("✅ database.py imported")


from schemas import (
    PatientProfile,
    ConsultRequest
)
print("✅ patient schemas imported")


from crud import (
    register_patient,
    get_patient_from_db,
    save_consultation
)
print("✅ crud.py imported")


from logic import (
    get_df,
    smart_symptom_match,
    find_row,
    build_response,
    generate_human_response,
    extract_intent,
    map_symptom_to_category,
    filter_dataset_by_category,
    enrich_symptom_context,
    apply_safety_checks
)
print("✅ logic.py imported")


app = FastAPI(
    title="SmartHomeoAIAdvisor API",
    version="2.0"
)

print("✅ FastAPI app created")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

print("✅ Middleware added")


init_db()
print("✅ Database initialized")


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
@app.get("/symptoms")
def get_symptoms():
    df = get_df()

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

    intent_symptom = extract_intent(
        user_input
    )

    category_data = map_symptom_to_category(
        intent_symptom
    )

    if category_data:
        filtered_df = filter_dataset_by_category(
            category_data["subcategory"]
        )
    else:
        filtered_df = get_df()

    patient = get_patient_from_db(
        req.user_id
    )

    enriched_input = enrich_symptom_context(
        intent_symptom,
        patient
    )

    mapped_symptom = smart_symptom_match(
        enriched_input
    )

    row = find_row(
        filtered_df,
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
        True
        
    )

    safety_warnings = apply_safety_checks(
        row,
        patient
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
        "warnings": safety_warnings,
        "message": human_message
    }