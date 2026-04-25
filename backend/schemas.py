from pydantic import BaseModel, Field
from typing import List, Optional

class FamilyHistoryItem(BaseModel):
    condition: str
    relation: str

class PatientProfile(BaseModel):
    user_id: str
    name: str
    age: int
    gender: str

    blood_group: Optional[str] = ""
    bp_high: bool = False
    diabetic: bool = False
    sugar_level: Optional[str] = "normal"
    bp_reading: Optional[str] = ""

    allergies: List[str] = []
    existing_conditions: List[str] = []
    other_conditions: Optional[str] = ""
    current_medications: List[str] = []

    family_history: List[FamilyHistoryItem] = Field(
        default_factory=list,
        example=[
           {
            "condition": "Diabetes",
            "relation": "Father"
           }
        ]
    )

    sleep_quality: Optional[str] = ""
    overthinking_level: Optional[str] = ""
    anger_level: Optional[str] = ""
    appetite_level: Optional[str] = ""
    food_preferences: List[str] = []
    stress_level: Optional[str] = ""
    energy_level: Optional[str] = ""


class ConsultRequest(BaseModel):
    user_id: str
    symptom: str
    severity: str


class RemedyRequest(BaseModel):
    symptom: str
    severity: str
    patient: Optional[dict] = {}