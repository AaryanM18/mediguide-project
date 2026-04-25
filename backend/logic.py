import pandas as pd
import os
from sentence_transformers import SentenceTransformer, util
import torch


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(
    BASE_DIR,
    "SmartHomeoAIAdvisor_Dataset_V9_Final.csv"
)

df = pd.read_csv(DATASET_PATH)
df = df.fillna("")

df["symptom"] = df["symptom"].str.strip().str.lower()
df["severity"] = df["severity"].str.strip().str.lower()

model = SentenceTransformer("all-MiniLM-L6-v2")

all_symptoms = df["symptom"].dropna().unique().tolist()

symptom_embeddings = model.encode(
    all_symptoms,
    convert_to_tensor=True
)


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

    return None if match.empty else match.iloc[0].to_dict()


def detect_category(symptom):
    symptom = symptom.lower()

    if "ear" in symptom:
        return "Ears"

    elif "head" in symptom:
        return "Head"

    elif "eye" in symptom:
        return "Eyes"

    elif "nose" in symptom:
        return "Nose"

    elif "stomach" in symptom:
        return "Stomach"

    return None


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
            "patient_name": patient.get("name", "Patient")
        },
        "remedy": {
            "name": row.get("remedy_name"),
            "potency": row.get("potency"),
            "possible_condition": row.get("possible_condition"),
            "keynote": row.get("keynote_indication"),
            "why_this_remedy": row.get("remedy_reason")
        }
    }


def generate_human_response(response):
    name = response["query"]["patient_name"]
    symptom = response["query"]["symptom"]
    remedy = response["remedy"]["name"]

    return (
        f"Hi {name}, "
        f"for symptom '{symptom}', "
        f"recommended remedy is {remedy}."
    )