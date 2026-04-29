import axios from 'axios';
import dataset from '../data/dataset.json';

const mappings = dataset.mappings || [];
const library = dataset.library || [];

// Ensure BASE_URL does not have a trailing slash for consistency
const BASE_URL = "https://mediguide-project-production.up.railway.app";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

const handleAxiosError = (error, fallbackMessage) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("Server Error:", error.response.data);
    throw error.response.data || new Error(fallbackMessage);
  } else if (error.request) {
    // The request was made but no response was received
    console.error("Network Error (No Response):", error.request);
    throw new Error("Network error. Please check your internet connection.");
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Request Error:", error.message);
    throw new Error(error.message || fallbackMessage);
  }
};

export const getSymptoms = async () => {
  const result = {};

  mappings.forEach((row) => {
    const sym = (row.symptom || '').toString().trim().toLowerCase();
    const sev = (row.severity || '').toString().trim().toLowerCase();

    if (!sym || !sev) return;

    if (!result[sym]) result[sym] = new Set();
    result[sym].add(sev);
  });

  const symptomsMap = {};

  Object.keys(result)
    .sort()
    .forEach((key) => {
      symptomsMap[key] = Array.from(result[key]).sort();
    });

  return {
    total: Object.keys(symptomsMap).length,
    symptoms: symptomsMap
  };
};

export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post("/api/auth/login", {
      email: email.trim(),
      password
    });
    return response.data;
  } catch (error) {
    return handleAxiosError(error, "Login failed");
  }
};

export const signupUser = async (email, name, password) => {
  const cleanedEmail = email.trim();
  try {
    const response = await apiClient.post("/api/auth/signup", {
      user_id: cleanedEmail,
      email: cleanedEmail,
      password
    });
    return response.data;
  } catch (error) {
    return handleAxiosError(error, "Signup failed");
  }
};

export const registerPatient = async (patientData) => {
  try {
    const response = await apiClient.post("/patient/register", patientData);
    const data = response.data;

    localStorage.setItem(
      `patient_${patientData.user_id}`,
      JSON.stringify(patientData)
    );

    return data;
  } catch (error) {
    return handleAxiosError(error, "Profile save failed");
  }
};

export const getPatientProfile = async (userId) => {
  try {
    const response = await apiClient.get(`/patient/${userId}`);
    const patient = response.data.patient || response.data;

    if (patient) {
      localStorage.setItem(`patient_${userId}`, JSON.stringify(patient));
    }

    return {
      success: true,
      patient
    };
  } catch (err) {
    console.error("Get profile failed, checking local storage", err);
    const raw = localStorage.getItem(`patient_${userId}`);

    if (!raw) {
      return {
        success: false,
        detail: err.message || "Patient not found"
      };
    }

    return {
      success: true,
      patient: JSON.parse(raw)
    };
  }
};

const buildSafety = (row, patient = {}) => {
  const warnings = [];
  let is_safe = true;

  const age = patient.age || 25;
  const allergies = (patient.allergies || []).map((a) =>
    a.trim().toLowerCase()
  );
  const conditions = (patient.existing_conditions || []).map((c) =>
    c.trim().toLowerCase()
  );
  const other = (patient.other_conditions || "").toLowerCase();

  const has = (cond) =>
    conditions.some((c) => c.includes(cond)) || other.includes(cond);

  const remedy_name = (row.remedy_name || "").toString().toLowerCase();
  const bp_note = (row.suitable_for_bp_high || "").toString().toLowerCase();
  const dm_note = (row.suitable_for_diabetic || "").toString().toLowerCase();
  const avoid_note = (row.avoid_if_allergy || "").toString().toLowerCase();
  const what_avoid = (row.what_to_avoid || "").toString().toLowerCase();

  if (has("hypertension") || patient.bp_high) {
    if (bp_note.includes("caution")) {
      warnings.push("⚠️ HYPERTENSION: This remedy needs caution for high BP patients. Consult your homeopathic doctor before use.");
    } else if (bp_note.includes("specifically indicated")) {
      warnings.push("✅ HYPERTENSION: This remedy is specifically beneficial for high BP patients.");
    } else if (!bp_note.includes("not relevant") && !bp_note.includes("emergency")) {
      warnings.push("✅ HYPERTENSION: This remedy is safe for high BP patients.");
    }

    if (what_avoid.includes("salt") || what_avoid.includes("sodium")) {
      warnings.push("🧂 Avoid extra salt — important for your blood pressure.");
    }
  }

  if (has("diabetes") || patient.diabetic) {
    if (dm_note.includes("caution") || dm_note.includes("monitor")) {
      warnings.push("⚠️ DIABETES: Monitor your blood sugar closely while taking this remedy.");
    } else if (dm_note.includes("specifically indicated")) {
      warnings.push("✅ DIABETES: This remedy is specifically beneficial for diabetic patients.");
    } else if (!dm_note.includes("not relevant") && !dm_note.includes("emergency")) {
      warnings.push("✅ DIABETES: This remedy is safe for diabetic patients.");
    }

    if (what_avoid.includes("sugar") || what_avoid.includes("sweet")) {
      warnings.push("🍬 Avoid sugar and sweets — critical for your diabetes management.");
    }
  }

  if (has("thyroid")) {
    warnings.push("🦋 THYROID: Homeopathic remedies are generally safe with thyroid conditions. Monitor your thyroid levels regularly.");
  }

  if (has("asthma")) {
    warnings.push("🫁 ASTHMA: Always keep your prescribed rescue inhaler with you. Never replace it with homeopathic remedy alone during an acute attack.");
  }

  if (has("heart")) {
    warnings.push("❤️ HEART DISEASE: Use homeopathic remedies only as a complement to prescribed heart medication.");
  }

  if (has("arthritis")) {
    warnings.push("🦴 ARTHRITIS: Avoid cold damp environments. Warm compress and gentle movement may help.");
  }

  if (has("migraine")) {
    warnings.push("🧠 MIGRAINE: Avoid bright light, loud noise, strong smells, and skipping meals.");
  }

  if (has("gastric")) {
    warnings.push("🫃 GASTRIC ISSUES: Avoid spicy, oily, and heavy food. Eat small frequent meals.");
  }

  if (has("psoriasis")) {
    warnings.push("🩹 PSORIASIS: Avoid stress and alcohol. Moisturize skin regularly.");
  }

  if (has("cholesterol")) {
    warnings.push("🫀 CHOLESTEROL: Avoid fatty fried food and refined carbohydrates. Regular walking is useful.");
  }

  if (has("anxiety")) {
    warnings.push("🧘 ANXIETY: Avoid caffeine and stimulants. Practice deep breathing.");
  }

  if (has("depression")) {
    warnings.push("💙 DEPRESSION: Continue prescribed medicines. Do not stop without doctor advice.");
  }

  if (has("kidney")) {
    warnings.push("🫘 KIDNEY ISSUES: Drink adequate water. Avoid high sodium diet.");
  }

  if (has("liver")) {
    warnings.push("🫀 LIVER ISSUES: Avoid alcohol. Prefer low-fat, easily digestible food.");
  }

  if (avoid_note && avoid_note !== "none" && avoid_note !== "nan") {
    allergies.forEach((allergy) => {
      if (avoid_note.includes(allergy)) {
        warnings.push(`🚨 ALLERGY ALERT: You listed '${allergy}' as an allergy — consult doctor before taking this remedy.`);
        is_safe = false;
      }
    });
  }

  const age_group = (row.patient_age_group || "all").toString().toLowerCase();

  if (age < 12 && age_group === "adult") {
    warnings.push("⚠️ AGE: This remedy is for adults — consult a doctor for child-safe dosage.");
  }

  if (age > 65) {
    warnings.push("👴 ELDERLY PATIENT: Start with lower potency and fewer doses. Elderly patients may be more sensitive.");
  }

  if (warnings.length === 0) {
    warnings.push("✅ This remedy is suitable for your health profile. Take as directed.");
  }

  return {
    is_safe,
    warnings
  };
};

export const performConsultation = async (userId, symptomsInput) => {
  const list = Array.isArray(symptomsInput)
    ? symptomsInput
    : [];

  if (list.length === 0) {
    return {
      success: false,
      detail: {
        error: "No symptoms selected."
      }
    };
  }

  const rows = [];
  const querySyms = [];

  list.forEach((item) => {
    const sym = item.symptom.trim().toLowerCase();
    const sev = item.severity.trim().toLowerCase();

    querySyms.push(`${sym} (${sev})`);

    let row = mappings.find(
      (r) =>
        (r.symptom || "").toString().trim().toLowerCase() === sym &&
        (r.severity || "").toString().trim().toLowerCase() === sev
    );

    if (!row) {
      row = mappings.find(
        (r) =>
          (r.symptom || "").toString().trim().toLowerCase().includes(sym) &&
          (r.severity || "").toString().trim().toLowerCase() === sev
      );
    }

    if (row) rows.push(row);
  });

  if (rows.length === 0) {
    return {
      success: false,
      detail: {
        error: "No remedy found for the selected symptoms."
      }
    };
  }

  const patientRaw = localStorage.getItem(`patient_${userId}`);
  const patient = patientRaw ? JSON.parse(patientRaw) : {};

  const remedyCounts = {};

  rows.forEach((r) => {
    remedyCounts[r.remedy_name] = (remedyCounts[r.remedy_name] || 0) + 1;
  });

  const bestRow = rows.sort(
    (a, b) => remedyCounts[b.remedy_name] - remedyCounts[a.remedy_name]
  )[0];

  const safety = buildSafety(bestRow, patient);

  const result = {
    success: true,
    query: {
      symptom: querySyms.join(", "),
      severity: "Various",
      patient_name: patient.name || "Patient"
    },
    remedy: {
      name: bestRow.remedy_name,
      potency: bestRow.potency,
      possible_condition:
        rows.length > 1
          ? `Multiple Symptoms (Primary Match: ${bestRow.possible_condition})`
          : bestRow.possible_condition,
      keynote: bestRow.keynote_indication,
      why_this_remedy:
        rows.length > 1
          ? `Selected for totality of symptoms based on highest coverage. ${bestRow.remedy_reason}`
          : bestRow.remedy_reason,
      source_book: bestRow.source_book,
      additional_notes: bestRow.additional_notes,
      lifestyle: {
        dietary_restrictions: bestRow.dietary_restrictions,
        what_to_avoid: bestRow.what_to_avoid
      }
    },
    patient_safety: {
      is_safe: safety.is_safe,
      warnings: safety.warnings,
      bp_note: bestRow.suitable_for_bp_high,
      diabetes_note: bestRow.suitable_for_diabetic,
      allergy_note: bestRow.avoid_if_allergy
    },
    lifestyle: {
      dietary_restrictions: bestRow.dietary_restrictions,
      what_to_avoid: bestRow.what_to_avoid
    },
    consult_doctor:
      (bestRow.consult_doctor || "").toString().trim().toLowerCase() === "yes"
  };

  const histRaw = localStorage.getItem(`history_${userId}`);
  let history = histRaw ? JSON.parse(histRaw) : [];

  history.unshift({
    user_id: userId,
    symptom: querySyms.join(" + "),
    severity: "Various",
    remedy_name: bestRow.remedy_name,
    potency: bestRow.potency,
    condition: result.remedy.possible_condition,
    consult_doctor: result.consult_doctor,
    created_at: new Date().toLocaleString()
  });

  history = history.slice(0, 20);

  localStorage.setItem(`history_${userId}`, JSON.stringify(history));

  try {
    await apiClient.post("/api/patient/history", {
      user_id: userId,
      data: history
    });
  } catch (err) {
    console.error("History sync failed:", err);
  }

  return result;
};

export const getHistory = async (userId) => {
  try {
    const response = await apiClient.get(`/api/patient/history/${userId}`);
    if (response.data.history && response.data.history.length > 0) {
      localStorage.setItem(`history_${userId}`, JSON.stringify(response.data.history));
    }
  } catch (err) {
    console.error("History fetch failed:", err);
  }

  const raw = localStorage.getItem(`history_${userId}`);
  const history = raw ? JSON.parse(raw) : [];

  const pRaw = localStorage.getItem(`patient_${userId}`);
  const patientName = pRaw ? JSON.parse(pRaw).name : "User";

  return {
    success: true,
    patient_name: patientName,
    total: history.length,
    history
  };
};

export const getSavedRemedies = async (userId) => {
  try {
    const response = await apiClient.get(`/api/patient/saved/${userId}`);
    if (response.data.saved_remedies) {
      localStorage.setItem(
        `saved_remedies_${userId}`,
        JSON.stringify(response.data.saved_remedies)
      );
    }
  } catch (err) {
    console.error("Saved remedies fetch failed:", err);
  }

  const raw = localStorage.getItem(`saved_remedies_${userId}`);

  return {
    success: true,
    saved_remedies: raw ? JSON.parse(raw) : []
  };
};

export const updateSavedRemedies = async (userId, savedData) => {
  try {
    await apiClient.post("/api/patient/saved", {
      user_id: userId,
      data: savedData
    });
  } catch (err) {
    console.error("Saved remedies sync failed:", err);
  }

  localStorage.setItem(`saved_remedies_${userId}`, JSON.stringify(savedData));

  return {
    success: true
  };
};

export const searchLibrary = async (query = "") => {
  const q = query.toLowerCase().trim();

  if (!q) return library.slice(0, 100);

  return library
    .filter((rem) => {
      const nameMatch = rem.name?.toLowerCase().includes(q);

      const detailMatch = rem.details?.some((d) =>
          d.description?.toLowerCase().includes(q)
      );

      return nameMatch || detailMatch;
    })
    .slice(0, 100);
};

export const getRemedyDetails = async (remedyName) => {
  const remedy = library.find(
    (r) => r.name.toLowerCase() === remedyName.toLowerCase()
  );

  return remedy || null;
};

export const getPhilosophy = async () => {
  return dataset.philosophy || [];
};

export const getHealthFacts = async () => {
  return dataset.health_facts || [];
};

export const getConsultationHistory = async (userId) => {
  const history = JSON.parse(localStorage.getItem(`history_${userId}`)) || [];

  return {
    success: true,
    history
  };
};