import pandas as pd
import os
import json
from sentence_transformers import SentenceTransformer, util
import torch
import random


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
df = None

def get_df():
    global df
    if df is None:
        temp = pd.read_csv(DATASET_PATH)
        temp = temp.fillna("")
        temp["symptom"] = temp["symptom"].str.strip().str.lower()
        temp["severity"] = temp["severity"].str.strip().str.lower()
        df = temp
    return df

# Load symptom mapping layer
with open(SYMPTOM_MAP_PATH, "r") as f:
    symptom_map = json.load(f)





# Load semantic model
model = None

def get_model():
    global model
    if model is None:
        model = SentenceTransformer("all-MiniLM-L6-v2")
    return model

# Build symptom memory
all_symptoms = None
symptom_embeddings = None

def build_embeddings():
    global all_symptoms, symptom_embeddings

    if all_symptoms is None or symptom_embeddings is None:
        model = get_model()
        df = get_df()

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
    build_embeddings()
    model = get_model()

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

    dataset = get_df()   # IMPORTANT FIX

    if dataset is None:
        raise ValueError("Dataset could not be loaded")

    filtered = dataset[
        dataset["symptom"].str.contains(
            subcategory.lower(),
            na=False
        )
    ]

    print("Filtered rows:", len(filtered))

    if filtered.empty:
        print("No filtered rows, using full dataset")
        return dataset

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
     warnings.append(random.choice([
        {
            "issue": "Diabetes",
            "reason": "Patient has diabetes.",
            "advice": [
                "Monitor blood sugar regularly",
                "Avoid irregular meal timings",
                "Follow prescribed diabetic care"
            ]
        },
        {
            "issue": "Diabetes Alert",
            "reason": "Blood sugar fluctuations can affect recovery.",
            "advice": [
                "Track glucose levels regularly",
                "Avoid skipping meals",
                "Maintain a balanced diabetic diet"
            ]
        },
        {
            "issue": "Diabetes Care Needed",
            "reason": "Existing diabetic condition requires extra monitoring.",
            "advice": [
                "Take medicines on time",
                "Maintain stable sugar levels",
                "Watch for weakness or fatigue"
            ]
        },
        {
            "issue": "Diabetes Precaution",
            "reason": "Diabetes may influence treatment response and healing.",
            "advice": [
                "Keep sugar levels under control",
                "Eat meals on time",
                "Consult a doctor if symptoms worsen"
            ]
        }
    ]))

    if patient.get("bp_high"):
      warnings.append(random.choice([
        {
            "issue": "High Blood Pressure History",
            "reason": "Patient has a history of high blood pressure.",
            "advice": [
                "Reduce salt intake",
                "Manage stress levels",
                "Monitor blood pressure regularly"
            ]
        },
        {
            "issue": "Hypertension Alert",
            "reason": "Patient has a known history of hypertension.",
            "advice": [
                "Limit salty and processed foods",
                "Practice stress control techniques",
                "Keep checking blood pressure frequently"
            ]
        },
        {
            "issue": "Blood Pressure Precaution",
            "reason": "High blood pressure may affect treatment response.",
            "advice": [
                "Maintain a heart-healthy diet",
                "Avoid excessive stress or anxiety",
                "Stay physically active if possible"
            ]
        },
        {
            "issue": "Hypertension Care Needed",
            "reason": "Elevated blood pressure history requires extra attention.",
            "advice": [
                "Follow your prescribed BP medication",
                "Avoid high-sodium meals",
                "Monitor symptoms like headache or dizziness"
            ]
        }
    ]))

    if patient.get("bp_low"):
       warnings.append(random.choice([
        {
            "issue": "Low Blood Pressure History",
            "reason": "Patient has a history of low blood pressure.",
            "advice": [
                "Stay hydrated",
                "Avoid skipping meals",
                "Stand up slowly to avoid dizziness"
            ]
        },
        {
            "issue": "Hypotension Alert",
            "reason": "Patient has a tendency for low blood pressure.",
            "advice": [
                "Increase fluid intake",
                "Take meals at regular intervals",
                "Avoid sudden body movements"
            ]
        },
        {
            "issue": "Blood Pressure Precaution",
            "reason": "Low blood pressure may cause weakness or dizziness.",
            "advice": [
                "Maintain hydration throughout the day",
                "Take balanced nutrition",
                "Rest if feeling tired or lightheaded"
            ]
        },
        {
            "issue": "Low BP Care Needed",
            "reason": "Low blood pressure history requires careful monitoring.",
            "advice": [
                "Do not stay hungry for long periods",
                "Monitor for fatigue or fainting",
                "Seek medical advice if symptoms persist"
            ]
        }
    ]))


    # Check for specific existing conditions
    existing = patient.get("existing_conditions", [])
    if existing and any(cond.strip() for cond in existing):
        conditions_str = ", ".join([c.strip() for c in existing if c.strip()])
        warnings.append({
            "issue": f"Health Profile: {conditions_str}",
            "reason": "You have these pre-existing conditions saved in your profile.",
            "advice": [
                "This remedy is checked against your specific health profile",
                "Ensure compatibility with your current medications",
                "Maintain your regular prescribed health routine"
            ]
        })

    if patient.get("existing_conditions"):
     for condition in patient.get("existing_conditions"):

        if condition == "Diabetes":
            warnings.append(random.choice([
                {
                    "issue": "Diabetes",
                    "reason": "Blood sugar levels may affect recovery.",
                    "advice": [
                        "Monitor glucose regularly",
                        "Eat meals on time",
                        "Continue diabetic medications"
                    ]
                },
                {
                    "issue": "Diabetes Care",
                    "reason": "Diabetes requires extra care during treatment.",
                    "advice": [
                        "Avoid sugar spikes",
                        "Stay hydrated",
                        "Watch for weakness"
                    ]
                }
            ]))

        elif condition == "Prediabetes":
            warnings.append(random.choice([
                {
                    "issue": "Prediabetes",
                    "reason": "Blood sugar levels are above normal and need attention.",
                    "advice": [
                        "Reduce sugar intake",
                        "Exercise regularly",
                        "Monitor glucose levels"
                    ]
                },
                {
                    "issue": "Prediabetes Alert",
                    "reason": "Prediabetes can progress if unmanaged.",
                    "advice": [
                        "Maintain a balanced diet",
                        "Avoid processed foods",
                        "Track sugar levels"
                    ]
                }
            ]))

        elif condition == "Thyroid Disorder":
            warnings.append(random.choice([
                {
                    "issue": "Thyroid Disorder",
                    "reason": "Thyroid imbalance may affect body response.",
                    "advice": [
                        "Take thyroid medication regularly",
                        "Monitor energy levels",
                        "Follow dietary advice"
                    ]
                },
                {
                    "issue": "Thyroid Care",
                    "reason": "Hormonal imbalance requires monitoring.",
                    "advice": [
                        "Maintain routine checkups",
                        "Avoid stress",
                        "Monitor symptoms"
                    ]
                }
            ]))

        elif condition == "Obesity":
            warnings.append(random.choice([
                {
                    "issue": "Obesity",
                    "reason": "Weight-related conditions may affect recovery.",
                    "advice": [
                        "Follow a healthy diet",
                        "Exercise regularly",
                        "Monitor body weight"
                    ]
                },
                {
                    "issue": "Weight Management Alert",
                    "reason": "Obesity may increase health risks.",
                    "advice": [
                        "Avoid junk food",
                        "Stay active",
                        "Manage calorie intake"
                    ]
                }
            ]))

        elif condition == "High Cholesterol":
            warnings.append(random.choice([
                {
                    "issue": "High Cholesterol",
                    "reason": "Cholesterol levels may affect heart health.",
                    "advice": [
                        "Avoid oily food",
                        "Exercise regularly",
                        "Monitor cholesterol"
                    ]
                },
                {
                    "issue": "Cholesterol Care",
                    "reason": "Elevated cholesterol requires lifestyle care.",
                    "advice": [
                        "Eat fiber-rich foods",
                        "Avoid fried foods",
                        "Maintain physical activity"
                    ]
                }
            ]))

        elif condition == "Hypertension":
            warnings.append(random.choice([
                {
                    "issue": "Hypertension",
                    "reason": "High blood pressure needs regular observation.",
                    "advice": [
                        "Reduce salt intake",
                        "Manage stress",
                        "Check BP regularly"
                    ]
                },
                {
                    "issue": "Hypertension Alert",
                    "reason": "Blood pressure fluctuations may affect treatment.",
                    "advice": [
                        "Maintain heart-friendly diet",
                        "Avoid stress",
                        "Stay active"
                    ]
                }
            ]))

        elif condition == "Low Blood Pressure":
            warnings.append(random.choice([
                {
                    "issue": "Low Blood Pressure",
                    "reason": "Low BP may cause weakness or dizziness.",
                    "advice": [
                        "Stay hydrated",
                        "Eat meals regularly",
                        "Avoid sudden standing"
                    ]
                },
                {
                    "issue": "Low BP Alert",
                    "reason": "Low blood pressure needs monitoring.",
                    "advice": [
                        "Increase fluid intake",
                        "Rest properly",
                        "Monitor dizziness"
                    ]
                }
            ]))

        elif condition == "Heart Disease":
            warnings.append(random.choice([
                {
                    "issue": "Heart Disease",
                    "reason": "Heart conditions require extra care.",
                    "advice": [
                        "Avoid stress",
                        "Follow prescribed medication",
                        "Monitor chest discomfort"
                    ]
                },
                {
                    "issue": "Cardiac Care",
                    "reason": "Heart health may affect treatment response.",
                    "advice": [
                        "Maintain regular checkups",
                        "Avoid heavy exertion",
                        "Watch for symptoms"
                    ]
                }
            ]))

        elif condition == "Heart Palpitations":
            warnings.append(random.choice([
                {
                    "issue": "Heart Palpitations",
                    "reason": "Irregular heartbeat needs monitoring.",
                    "advice": [
                        "Avoid caffeine",
                        "Reduce stress",
                        "Monitor heartbeat changes"
                    ]
                },
                {
                    "issue": "Palpitation Alert",
                    "reason": "Heart rhythm changes may worsen symptoms.",
                    "advice": [
                        "Stay calm",
                        "Avoid stimulants",
                        "Seek care if severe"
                    ]
                }
            ]))

        elif condition == "Asthma":
            warnings.append(random.choice([
                {
                    "issue": "Asthma",
                    "reason": "Respiratory sensitivity needs monitoring.",
                    "advice": [
                        "Avoid dust and smoke",
                        "Keep inhaler nearby",
                        "Monitor breathing"
                    ]
                },
                {
                    "issue": "Asthma Alert",
                    "reason": "Breathing issues may worsen symptoms.",
                    "advice": [
                        "Avoid allergens",
                        "Stay in fresh air",
                        "Seek help if breathing worsens"
                    ]
                }
            ]))

        elif condition == "Sinusitis":
            warnings.append(random.choice([
                {
                    "issue": "Sinusitis",
                    "reason": "Sinus inflammation may increase discomfort.",
                    "advice": [
                        "Use steam inhalation",
                        "Stay hydrated",
                        "Avoid cold exposure"
                    ]
                },
                {
                    "issue": "Sinus Care",
                    "reason": "Blocked sinuses need symptom care.",
                    "advice": [
                        "Keep nasal passages moist",
                        "Avoid dust",
                        "Take proper rest"
                    ]
                }
            ]))

        elif condition == "Allergic Rhinitis":
            warnings.append(random.choice([
                {
                    "issue": "Allergic Rhinitis",
                    "reason": "Allergy triggers may worsen symptoms.",
                    "advice": [
                        "Avoid allergens",
                        "Keep surroundings clean",
                        "Monitor sneezing or irritation"
                    ]
                },
                {
                    "issue": "Allergy Care",
                    "reason": "Respiratory allergies require attention.",
                    "advice": [
                        "Use masks in dusty areas",
                        "Avoid triggers",
                        "Stay hydrated"
                    ]
                }
            ]))

        elif condition == "Bronchitis":
            warnings.append(random.choice([
                {
                    "issue": "Bronchitis",
                    "reason": "Airway inflammation needs careful monitoring.",
                    "advice": [
                        "Avoid smoke exposure",
                        "Drink warm fluids",
                        "Take enough rest"
                    ]
                },
                {
                    "issue": "Respiratory Care",
                    "reason": "Bronchial irritation may affect breathing.",
                    "advice": [
                        "Use steam inhalation",
                        "Avoid cold weather",
                        "Watch breathing changes"
                    ]
                }
            ]))
        elif condition == "Acidity":
            warnings.append(random.choice([
                {
                    "issue": "Acidity",
                    "reason": "Excess stomach acid may worsen discomfort.",
                    "advice": [
                        "Avoid spicy foods",
                        "Eat smaller meals",
                        "Stay hydrated"
                    ]
                },
                {
                    "issue": "Acidity Care",
                    "reason": "Digestive imbalance needs careful food management.",
                    "advice": [
                        "Avoid late-night meals",
                        "Reduce caffeine intake",
                        "Maintain meal timing"
                    ]
                }
            ]))

        elif condition == "Gastritis":
            warnings.append(random.choice([
                {
                    "issue": "Gastritis",
                    "reason": "Stomach lining irritation may increase symptoms.",
                    "advice": [
                        "Avoid oily foods",
                        "Eat light meals",
                        "Stay hydrated"
                    ]
                },
                {
                    "issue": "Gastric Care",
                    "reason": "Stomach sensitivity needs monitoring.",
                    "advice": [
                        "Avoid spicy foods",
                        "Take proper rest",
                        "Follow meal schedule"
                    ]
                }
            ]))

        elif condition == "Constipation":
            warnings.append(random.choice([
                {
                    "issue": "Constipation",
                    "reason": "Digestive blockage may cause discomfort.",
                    "advice": [
                        "Increase fiber intake",
                        "Drink enough water",
                        "Exercise regularly"
                    ]
                },
                {
                    "issue": "Bowel Care",
                    "reason": "Irregular bowel movement requires management.",
                    "advice": [
                        "Eat fruits and vegetables",
                        "Stay active",
                        "Avoid processed foods"
                    ]
                }
            ]))

        elif condition == "IBS":
            warnings.append(random.choice([
                {
                    "issue": "IBS",
                    "reason": "Digestive sensitivity may affect daily comfort.",
                    "advice": [
                        "Avoid trigger foods",
                        "Manage stress",
                        "Eat balanced meals"
                    ]
                },
                {
                    "issue": "IBS Care",
                    "reason": "Bowel irregularity requires monitoring.",
                    "advice": [
                        "Track food reactions",
                        "Maintain hydration",
                        "Follow regular meal timing"
                    ]
                }
            ]))

        elif condition == "Gastric Ulcer":
            warnings.append(random.choice([
                {
                    "issue": "Gastric Ulcer",
                    "reason": "Stomach ulcers may worsen with improper diet.",
                    "advice": [
                        "Avoid spicy foods",
                        "Eat soft meals",
                        "Follow prescribed medications"
                    ]
                },
                {
                    "issue": "Ulcer Care",
                    "reason": "Ulcers require stomach-friendly habits.",
                    "advice": [
                        "Avoid alcohol and caffeine",
                        "Take proper rest",
                        "Monitor pain"
                    ]
                }
            ]))

        elif condition == "Psoriasis":
            warnings.append(random.choice([
                {
                    "issue": "Psoriasis",
                    "reason": "Skin sensitivity may flare under stress.",
                    "advice": [
                        "Keep skin moisturized",
                        "Avoid scratching",
                        "Reduce stress"
                    ]
                },
                {
                    "issue": "Skin Care",
                    "reason": "Chronic skin condition needs proper care.",
                    "advice": [
                        "Avoid harsh soaps",
                        "Maintain hydration",
                        "Watch skin changes"
                    ]
                }
            ]))

        elif condition == "Eczema":
            warnings.append(random.choice([
                {
                    "issue": "Eczema",
                    "reason": "Skin irritation may worsen with allergens.",
                    "advice": [
                        "Use moisturizers",
                        "Avoid allergens",
                        "Keep skin clean"
                    ]
                },
                {
                    "issue": "Eczema Care",
                    "reason": "Skin inflammation requires regular care.",
                    "advice": [
                        "Avoid hot showers",
                        "Use gentle soaps",
                        "Monitor irritation"
                    ]
                }
            ]))

        elif condition == "Acne":
            warnings.append(random.choice([
                {
                    "issue": "Acne",
                    "reason": "Skin breakouts may worsen due to irritation.",
                    "advice": [
                        "Keep skin clean",
                        "Avoid oily foods",
                        "Avoid touching the face"
                    ]
                },
                {
                    "issue": "Acne Care",
                    "reason": "Skin sensitivity requires proper hygiene.",
                    "advice": [
                        "Wash face regularly",
                        "Avoid harsh products",
                        "Stay hydrated"
                    ]
                }
            ]))

        elif condition == "Fungal Infection":
            warnings.append(random.choice([
                {
                    "issue": "Fungal Infection",
                    "reason": "Skin infection may spread if untreated.",
                    "advice": [
                        "Keep affected area dry",
                        "Maintain hygiene",
                        "Avoid scratching"
                    ]
                },
                {
                    "issue": "Infection Care",
                    "reason": "Fungal growth requires proper skin care.",
                    "advice": [
                        "Use clean clothing",
                        "Avoid moisture buildup",
                        "Monitor infection spread"
                    ]
                }
            ]))

        elif condition == "Arthritis":
            warnings.append(random.choice([
                {
                    "issue": "Arthritis",
                    "reason": "Joint inflammation may affect mobility.",
                    "advice": [
                        "Do light exercise",
                        "Avoid overexertion",
                        "Take enough rest"
                    ]
                },
                {
                    "issue": "Joint Care",
                    "reason": "Arthritis requires movement management.",
                    "advice": [
                        "Maintain flexibility exercises",
                        "Use warm compress",
                        "Monitor swelling"
                    ]
                }
            ]))

        elif condition == "Back Pain":
            warnings.append(random.choice([
                {
                    "issue": "Back Pain",
                    "reason": "Muscle strain or posture issues may worsen pain.",
                    "advice": [
                        "Maintain good posture",
                        "Avoid heavy lifting",
                        "Take adequate rest"
                    ]
                },
                {
                    "issue": "Back Care",
                    "reason": "Back pain requires movement caution.",
                    "advice": [
                        "Stretch regularly",
                        "Use proper support",
                        "Avoid sudden movements"
                    ]
                }
            ]))

        elif condition == "Joint Pain":
            warnings.append(random.choice([
                {
                    "issue": "Joint Pain",
                    "reason": "Joint stress may affect movement.",
                    "advice": [
                        "Rest affected joints",
                        "Avoid overuse",
                        "Do gentle stretching"
                    ]
                },
                {
                    "issue": "Joint Care",
                    "reason": "Joint discomfort needs regular care.",
                    "advice": [
                        "Maintain light activity",
                        "Monitor swelling",
                        "Use warm therapy if needed"
                    ]
                }
            ]))

        elif condition == "Spondylitis":
            warnings.append(random.choice([
                {
                    "issue": "Spondylitis",
                    "reason": "Spinal inflammation requires careful movement.",
                    "advice": [
                        "Avoid long sitting hours",
                        "Do stretching exercises",
                        "Maintain posture"
                    ]
                },
                {
                    "issue": "Spinal Care",
                    "reason": "Spinal issues require movement monitoring.",
                    "advice": [
                        "Take breaks while sitting",
                        "Use proper back support",
                        "Exercise carefully"
                    ]
                }
            ]))

        elif condition == "Anxiety":
            warnings.append(random.choice([
                {
                    "issue": "Anxiety",
                    "reason": "Stress may intensify symptoms.",
                    "advice": [
                        "Practice deep breathing",
                        "Reduce stress triggers",
                        "Take proper rest"
                    ]
                },
                {
                    "issue": "Mental Health Alert",
                    "reason": "Anxiety requires emotional care.",
                    "advice": [
                        "Stay calm",
                        "Avoid overthinking",
                        "Talk to someone trusted"
                    ]
                }
            ]))

        elif condition == "Depression":
            warnings.append(random.choice([
                {
                    "issue": "Depression",
                    "reason": "Mental health condition needs emotional support.",
                    "advice": [
                        "Maintain daily routine",
                        "Stay connected with people",
                        "Seek professional support if needed"
                    ]
                },
                {
                    "issue": "Emotional Care",
                    "reason": "Low mood may affect recovery.",
                    "advice": [
                        "Take enough rest",
                        "Do light physical activity",
                        "Avoid isolation"
                    ]
                }
            ]))

        elif condition == "Panic Disorder":
            warnings.append(random.choice([
                {
                    "issue": "Panic Disorder",
                    "reason": "Panic symptoms may increase under stress.",
                    "advice": [
                        "Practice breathing exercises",
                        "Avoid stress triggers",
                        "Stay calm"
                    ]
                },
                {
                    "issue": "Panic Care",
                    "reason": "Sudden anxiety episodes need management.",
                    "advice": [
                        "Use relaxation techniques",
                        "Take rest",
                        "Seek help if severe"
                    ]
                }
            ])) 
        
        elif condition == "Overthinking":
            warnings.append(random.choice([
                {
                    "issue": "Overthinking",
                    "reason": "Excessive mental stress may affect recovery.",
                    "advice": [
                        "Take mental breaks",
                        "Practice relaxation techniques",
                        "Avoid unnecessary stress"
                    ]
                },
                {
                    "issue": "Mental Fatigue",
                    "reason": "Continuous overthinking may impact emotional balance.",
                    "advice": [
                        "Focus on rest",
                        "Limit stressful activities",
                        "Practice mindfulness"
                    ]
                }
            ]))

        elif condition == "Stress Disorder":
            warnings.append(random.choice([
                {
                    "issue": "Stress Disorder",
                    "reason": "Stress may worsen physical and emotional symptoms.",
                    "advice": [
                        "Take enough rest",
                        "Reduce workload pressure",
                        "Practice calming activities"
                    ]
                },
                {
                    "issue": "Stress Alert",
                    "reason": "Chronic stress may slow recovery.",
                    "advice": [
                        "Maintain sleep routine",
                        "Take short breaks",
                        "Avoid mental overload"
                    ]
                }
            ]))

        elif condition == "Insomnia":
            warnings.append(random.choice([
                {
                    "issue": "Insomnia",
                    "reason": "Poor sleep may affect healing and recovery.",
                    "advice": [
                        "Maintain a fixed sleep schedule",
                        "Avoid screen time before bed",
                        "Reduce caffeine intake"
                    ]
                },
                {
                    "issue": "Sleep Care",
                    "reason": "Sleep disturbances may weaken body recovery.",
                    "advice": [
                        "Create a calm sleep environment",
                        "Avoid late-night meals",
                        "Take proper rest"
                    ]
                }
            ]))

        elif condition == "Epilepsy":
            warnings.append(random.choice([
                {
                    "issue": "Epilepsy",
                    "reason": "Neurological sensitivity requires extra monitoring.",
                    "advice": [
                        "Take prescribed medicines regularly",
                        "Avoid sleep deprivation",
                        "Monitor seizure triggers"
                    ]
                },
                {
                    "issue": "Seizure Care",
                    "reason": "Epilepsy requires consistent medical attention.",
                    "advice": [
                        "Avoid flashing lights if sensitive",
                        "Stay hydrated",
                        "Seek help during episodes"
                    ]
                }
            ]))

        elif condition == "Vertigo":
            warnings.append(random.choice([
                {
                    "issue": "Vertigo",
                    "reason": "Balance issues may increase risk of falls.",
                    "advice": [
                        "Move slowly",
                        "Avoid sudden head movements",
                        "Take proper rest"
                    ]
                },
                {
                    "issue": "Balance Care",
                    "reason": "Dizziness requires movement caution.",
                    "advice": [
                        "Sit or lie down if dizzy",
                        "Stay hydrated",
                        "Avoid driving during episodes"
                    ]
                }
            ]))

        elif condition == "Neuropathy":
            warnings.append(random.choice([
                {
                    "issue": "Neuropathy",
                    "reason": "Nerve sensitivity may affect body response.",
                    "advice": [
                        "Protect affected areas",
                        "Monitor numbness or pain",
                        "Avoid injuries"
                    ]
                },
                {
                    "issue": "Nerve Care",
                    "reason": "Nerve-related discomfort needs regular monitoring.",
                    "advice": [
                        "Maintain healthy blood circulation",
                        "Follow prescribed treatment",
                        "Watch for worsening symptoms"
                    ]
                }
            ]))

        elif condition == "Kidney Disease":
            warnings.append(random.choice([
                {
                    "issue": "Kidney Disease",
                    "reason": "Kidney health may affect treatment safety.",
                    "advice": [
                        "Stay hydrated as advised",
                        "Avoid excess salt",
                        "Follow prescribed medications"
                    ]
                },
                {
                    "issue": "Kidney Care",
                    "reason": "Kidney conditions require close monitoring.",
                    "advice": [
                        "Track fluid intake",
                        "Avoid harmful medications",
                        "Maintain regular checkups"
                    ]
                }
            ]))

        elif condition == "Liver Disease":
            warnings.append(random.choice([
                {
                    "issue": "Liver Disease",
                    "reason": "Liver health may influence medicine processing.",
                    "advice": [
                        "Avoid alcohol",
                        "Follow liver-safe diet",
                        "Monitor symptoms carefully"
                    ]
                },
                {
                    "issue": "Liver Care",
                    "reason": "Liver conditions require extra health attention.",
                    "advice": [
                        "Eat light meals",
                        "Avoid oily foods",
                        "Take medicines only as prescribed"
                    ]
                }
            ]))

        elif condition == "Fatty Liver":
            warnings.append(random.choice([
                {
                    "issue": "Fatty Liver",
                    "reason": "Liver fat accumulation may affect metabolism.",
                    "advice": [
                        "Avoid junk food",
                        "Exercise regularly",
                        "Maintain healthy weight"
                    ]
                },
                {
                    "issue": "Liver Health Alert",
                    "reason": "Fatty liver requires dietary management.",
                    "advice": [
                        "Reduce oily foods",
                        "Stay physically active",
                        "Monitor liver health"
                    ]
                }
            ]))

        elif condition == "PCOS":
            warnings.append(random.choice([
                {
                    "issue": "PCOS",
                    "reason": "Hormonal imbalance may affect symptoms.",
                    "advice": [
                        "Maintain healthy weight",
                        "Exercise regularly",
                        "Monitor menstrual cycle"
                    ]
                },
                {
                    "issue": "Hormonal Care",
                    "reason": "PCOS requires consistent health monitoring.",
                    "advice": [
                        "Eat balanced meals",
                        "Reduce stress",
                        "Follow doctor guidance"
                    ]
                }
            ]))

        elif condition == "Menstrual Disorder":
            warnings.append(random.choice([
                {
                    "issue": "Menstrual Disorder",
                    "reason": "Hormonal irregularities may affect body balance.",
                    "advice": [
                        "Maintain proper nutrition",
                        "Track menstrual cycle",
                        "Take enough rest"
                    ]
                },
                {
                    "issue": "Cycle Care",
                    "reason": "Irregular cycles need monitoring.",
                    "advice": [
                        "Stay hydrated",
                        "Reduce stress",
                        "Consult doctor if severe"
                    ]
                }
            ]))

        elif condition == "Hormonal Imbalance":
            warnings.append(random.choice([
                {
                    "issue": "Hormonal Imbalance",
                    "reason": "Hormonal changes may influence symptoms.",
                    "advice": [
                        "Maintain healthy lifestyle",
                        "Get proper sleep",
                        "Track unusual body changes"
                    ]
                },
                {
                    "issue": "Hormonal Care",
                    "reason": "Hormonal shifts require regular observation.",
                    "advice": [
                        "Eat balanced meals",
                        "Exercise regularly",
                        "Follow medical advice"
                    ]
                }
            ]))

        elif condition == "Infertility":
            warnings.append(random.choice([
                {
                    "issue": "Infertility",
                    "reason": "Reproductive health conditions require careful care.",
                    "advice": [
                        "Maintain healthy lifestyle",
                        "Reduce stress",
                        "Follow fertility specialist advice"
                    ]
                },
                {
                    "issue": "Reproductive Care",
                    "reason": "Fertility-related issues need regular monitoring.",
                    "advice": [
                        "Track reproductive health",
                        "Maintain emotional well-being",
                        "Seek medical support when needed"
                    ]
                }
            ]))       


    if patient.get("allergies"):
        warnings.append({
            "issue": "Known Allergies",
            "reason": "History of allergic sensitivities.",
            "advice": [
                "Review all ingredients carefully",
                "Perform a patch test if applicable",
                "Monitor for any adverse reaction"
            ]
        })

    if patient.get("age", 0) > 60:
      warnings.append(random.choice([
        {
            "issue": "Senior Patient",
            "reason": "Patient is above 60 years of age.",
            "advice": [
                "Use remedies with extra caution",
                "Monitor response carefully",
                "Seek medical supervision when needed"
            ]
        },
        {
            "issue": "Senior Health Alert",
            "reason": "Older age may require closer health observation.",
            "advice": [
                "Take medicines carefully",
                "Monitor symptoms regularly",
                "Avoid self-medication"
            ]
        },
        {
            "issue": "Age-Related Precaution",
            "reason": "Recovery may take longer in senior patients.",
            "advice": [
                "Take proper rest",
                "Stay hydrated",
                "Consult a doctor if symptoms worsen"
            ]
        },
        {
            "issue": "Elderly Care Needed",
            "reason": "Senior patients may have increased sensitivity to treatments.",
            "advice": [
                "Follow prescribed dosage carefully",
                "Watch for unusual reactions",
                "Maintain regular medical follow-up"
            ]
        }
    ]))


    bp_reading = patient.get("bp_reading")

    if bp_reading:
        try:
            bp_value = int(bp_reading)

            if bp_value > 140:
                warnings.append(random.choice([
                    {
                        "issue": "High Blood Pressure Reading",
                        "reason": "Blood pressure reading is above the normal range.",
                        "advice": [
                            "Reduce salt intake",
                            "Manage stress",
                            "Stay hydrated",
                            "Check blood pressure regularly",
                            "Consult a doctor if consistently high"
                        ]
                    },
                    {
                        "issue": "Elevated Blood Pressure",
                        "reason": "Current blood pressure is higher than the healthy range.",
                        "advice": [
                            "Avoid salty foods",
                            "Take proper rest",
                            "Monitor blood pressure again after some time",
                            "Stay calm and avoid stress",
                            "Seek medical advice if it remains high"
                        ]
                    },
                    {
                        "issue": "Hypertension Alert",
                        "reason": "Blood pressure levels indicate possible hypertension.",
                        "advice": [
                            "Limit sodium intake",
                            "Drink enough water",
                            "Avoid physical overexertion",
                            "Track BP readings regularly",
                            "Consult a healthcare professional"
                        ]
                    },
                    {
                        "issue": "Blood Pressure Warning",
                        "reason": "High BP readings may increase health risks.",
                        "advice": [
                            "Take medications if prescribed",
                            "Reduce stress triggers",
                            "Avoid caffeine or smoking",
                            "Monitor symptoms like headache or dizziness",
                            "Get checked if symptoms continue"
                        ]
                    }
                ]))

            elif bp_value < 90:
                warnings.append(random.choice([
                    {
                        "issue": "Low Blood Pressure Reading",
                        "reason": "Blood pressure reading is below the normal range.",
                        "advice": [
                            "Increase fluid intake",
                            "Eat meals regularly",
                            "Avoid sudden standing",
                            "Monitor dizziness or weakness",
                            "Consult a doctor if symptoms continue"
                        ]
                    },
                    {
                        "issue": "Low Blood Pressure Alert",
                        "reason": "Current blood pressure is lower than the healthy range.",
                        "advice": [
                            "Drink more fluids",
                            "Do not skip meals",
                            "Move slowly while standing up",
                            "Take proper rest",
                            "Seek medical advice if weakness continues"
                        ]
                    },
                    {
                        "issue": "Hypotension Warning",
                        "reason": "Low blood pressure may cause dizziness and fatigue.",
                        "advice": [
                            "Maintain hydration",
                            "Take balanced meals regularly",
                            "Avoid long gaps between meals",
                            "Monitor body weakness",
                            "Consult a healthcare professional if symptoms persist"
                        ]
                    },
                    {
                        "issue": "Blood Pressure Precaution",
                        "reason": "Lower BP readings may affect body balance and energy levels.",
                        "advice": [
                            "Increase salt intake if medically allowed",
                            "Rest when feeling weak",
                            "Avoid sudden body movements",
                            "Keep monitoring BP readings",
                            "Get checked if dizziness increases"
                        ]
                    }
                ]))

        except ValueError:
            warnings.append({
                "issue": "Invalid BP Reading",
                "reason": "Blood pressure reading format could not be understood.",
                "advice": [
                    "Enter a valid numeric blood pressure value"
                ]
            })

    return warnings                        