import pandas as pd
import os
import json
from sentence_transformers import SentenceTransformer, util
import torch


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(
    BASE_DIR,
    "SmartHomeoAIAdvisor_Dataset_V9_Final.csv"
)

SYMPTOM_MAP_PATH = os.path.join(
    BASE_DIR,
    "knowledge",
    "symptom_map.json"
)


# Load dataset
df = pd.read_csv(DATASET_PATH)
df = df.fillna("")

# Load symptom mapping layer
with open(SYMPTOM_MAP_PATH, "r") as f:
    symptom_map = json.load(f)


# Normalize dataset
df["symptom"] = df["symptom"].str.strip().str.lower()
df["severity"] = df["severity"].str.strip().str.lower()


# Load semantic model
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

# Build symptom memory
all_symptoms = (
    df["symptom"]
    .dropna()
    .unique()
    .tolist()
)

symptom_embeddings = model.encode(
    all_symptoms,
    convert_to_tensor=True
)


# Semantic symptom matching
def smart_symptom_match(user_input):
    user_embedding = model.encode(
        user_input,
        convert_to_tensor=True
    )

    scores = util.pytorch_cos_sim(
        user_embedding,
        symptom_embeddings
    )[0]

    best_idx = torch.argmax(scores).item()
    best_score = scores[best_idx].item()

    if best_score > 0.4:
        return all_symptoms[best_idx]

    return user_input


# Layer 1: Intent Extraction
def extract_intent(user_input):
    user_input = user_input.lower()

    matched_symptoms = []

    for symptom in symptom_map.keys():
        if symptom in user_input:
            matched_symptoms.append(symptom)

    if matched_symptoms:
        matched_symptoms.sort(
            key=len,
            reverse=True
        )
        return matched_symptoms[0]

    return smart_symptom_match(user_input)


# Layer 2: Category Mapping
def map_symptom_to_category(symptom):
    return symptom_map.get(symptom)


# Layer 3: Dataset Filtering
def filter_dataset_by_category(subcategory):
    print("Filtering by:", subcategory)

    filtered = df[
        df["symptom"].str.lower().str.contains(
            subcategory.lower(),
            na=False
        )
    ]

    print("Filtered rows:", len(filtered))

    if filtered.empty:
        print("No filtered rows, using full dataset")
        return df

    return filtered

# Layer 4: Profile Context Builder
def enrich_symptom_context(
    symptom,
    patient
):
    context_parts = [symptom]

    if patient.get(
        "stress_level"
    ):
        context_parts.append(
            patient["stress_level"]
        )

    if patient.get(
        "sleep_quality"
    ):
        context_parts.append(
            patient["sleep_quality"]
        )

    if patient.get(
        "anger_level"
    ):
        context_parts.append(
            patient["anger_level"]
        )

    if patient.get(
        "overthinking_level"
    ):
        context_parts.append(
            patient["overthinking_level"]
        )

    return " ".join(context_parts)


# Layer 5: Remedy Selection
def find_row(df_data, symptom, severity):
    match = df_data[
        (df_data["symptom"] == symptom)
        &
        (df_data["severity"] == severity)
    ]

    if match.empty:
        match = df_data[
            df_data["symptom"].str.contains(
                symptom,
                case=False,
                na=False
            )
            &
            (df_data["severity"] == severity)
        ]

    if match.empty:
        return None

    return match.iloc[0].to_dict()


# Layer 6: Build structured response
def build_response(
    row,
    patient,
    symptom,
    severity
):
    return {
        "success": True,
        "query": {
            "symptom": symptom,
            "severity": severity,
            "patient_name": patient.get(
                "name",
                "Patient"
            )
        },
        "remedy": {
            "name": row.get("remedy_name"),
            "potency": row.get("potency"),
            "possible_condition": row.get(
                "possible_condition"
            ),
            "keynote": row.get(
                "keynote_indication"
            ),
            "why_this_remedy": row.get(
                "remedy_reason"
            )
        }
    }


# Layer 7: Human-readable explanation
def generate_human_response(response):
    name = response["query"]["patient_name"]
    symptom = response["query"]["symptom"]
    remedy = response["remedy"]["name"]

    return (
        f"Hi {name}, "
        f"for symptom '{symptom}', "
        f"recommended remedy is {remedy}."
    )

# Layer 8: Safety Checker
def apply_safety_checks(
    row,
    patient
):
    warnings = []

    if patient.get("diabetic"):
        warnings.append({
            "issue": "Diabetes",
            "reason": "Patient has diabetes.",
            "advice": [
                "Monitor blood sugar regularly",
                "Avoid irregular meal timings",
                "Follow prescribed diabetic care"
            ]
        })

    if patient.get("bp_high"):
        warnings.append({
            "issue": "High Blood Pressure History",
            "reason": "Patient has a history of high blood pressure.",
            "advice": [
                "Reduce salt intake",
                "Manage stress levels",
                "Monitor blood pressure regularly"
            ]
        })

    if patient.get("bp_low"):
        warnings.append({
            "issue": "Low Blood Pressure History",
            "reason": "Patient has a history of low blood pressure.",
            "advice": [
                "Stay hydrated",
                "Avoid skipping meals",
                "Stand up slowly to avoid dizziness"
            ]
        })

    if patient.get("existing_conditions"):
        warnings.append({
            "issue": "Existing Medical Conditions",
           # "reason": "Patient has pre-existing medical conditions.",
           # "advice": [
              #  "Check remedy compatibility carefully",
               # "Continue current prescribed treatment",
                #"Consult a doctor if symptoms worsen"
           # ]
        })

    if patient.get("allergies"):
        warnings.append({
           # "issue": "Allergy History",
           # "reason": "Patient has a history of allergies.",
          #  "advice": [
              #  "Review ingredients before use",
               # "Watch for allergic reactions",
                #"Stop use if irritation occurs"
           # ]
        })

    if patient.get("age", 0) > 60:
        warnings.append({
            "issue": "Senior Patient",
            "reason": "Patient is above 60 years of age.",
            "advice": [
                "Use remedies with extra caution",
                "Monitor response carefully",
                "Seek medical supervision when needed"
            ]
        })

    bp_reading = patient.get("bp_reading")

    if bp_reading:
        try:
            bp_value = int(bp_reading)

            if bp_value > 140:
                warnings.append({
                    "issue": "High Blood Pressure Reading",
                    "reason": "Blood pressure reading is above the normal range.",
                    "advice": [
                        "Reduce salt intake",
                        "Manage stress",
                        "Stay hydrated",
                        "Check blood pressure regularly",
                        "Consult a doctor if consistently high"
                    ]
                })

            elif bp_value < 90:
                warnings.append({
                    "issue": "Low Blood Pressure Reading",
                    "reason": "Blood pressure reading is below the normal range.",
                    "advice": [
                        "Increase fluid intake",
                        "Eat meals regularly",
                        "Avoid sudden standing",
                        "Monitor dizziness or weakness",
                        "Consult a doctor if symptoms continue"
                    ]
                })

        except ValueError:
            warnings.append({
                "issue": "Invalid BP Reading",
                "reason": "Blood pressure reading format could not be understood.",
                "advice": [
                    "Enter a valid numeric blood pressure value"
                ]
            })

    return warnings