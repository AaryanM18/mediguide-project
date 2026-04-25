import dataset from '../data/dataset.json';

// Destructure for internal use to keep most logic unchanged
const mappings = dataset.mappings;
const library = dataset.library;

// Helper to delay for realistic loading animations
const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const getSymptoms = async () => {
    await delay(300);
    let result = {};
    mappings.forEach(row => {
        let sym = (row.symptom || '').toString().trim().toLowerCase();
        let sev = (row.severity || '').toString().trim().toLowerCase();
        if (!sym || !sev) return;
        if (!result[sym]) result[sym] = new Set();
        result[sym].add(sev);
    });
    
    let symptomsMap = {};
    Object.keys(result).sort().forEach(key => {
        symptomsMap[key] = Array.from(result[key]).sort();
    });
    
    return { total: Object.keys(symptomsMap).length, symptoms: symptomsMap };
};

const getBaseUrl = () => {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || 
                    hostname === '127.0.0.1' || 
                    hostname.startsWith('192.168.') || 
                    hostname.startsWith('10.') || 
                    hostname.endsWith('.local');
    
    // On Capacitor/Mobile, localhost refers to the phone. 
    // If not debugging on a specific local IP, use production.
    const isMobile = window.location.protocol === 'capacitor:' || window.location.protocol === 'http:' && hostname === 'localhost' && window.navigator.userAgent.includes('Android');

    if (isMobile && hostname === 'localhost') {
        return 'https://mediguide-3jm3.onrender.com';
    }
    
    return isLocal ? `http://${hostname}:8000` : 'https://mediguide-3jm3.onrender.com';
};

const BASE_URL = getBaseUrl();

export const loginUser = async (email, password) => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: email, data: { password: password } })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Login failed");
    return data;
};

export const signupUser = async (email, name, password) => {
    const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: email, data: { name, password } })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Signup failed");
    return data;
};

export const registerPatient = async (patientData) => {
  const res = await fetch(`${BASE_URL}/patient/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patientData)
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Profile save failed");

  localStorage.setItem(`patient_${patientData.user_id}`, JSON.stringify(patientData));
  return data;
};

export const getPatientProfile = async (userId) => {
  const res = await fetch(`${BASE_URL}/patient/${userId}`);

  if (!res.ok) {
    const raw = localStorage.getItem(`patient_${userId}`);
    if (!raw) return { success: false, detail: "Patient not found" };
    return { success: true, patient: JSON.parse(raw) };
  }

  const data = await res.json();
  if (data.patient) {
    localStorage.setItem(`patient_${userId}`, JSON.stringify(data.patient));
  }

  return data;
};

const buildSafety = (row, patient) => {
    let warnings = [];
    let is_safe = true;
    
    const age = patient.age || 25;
    const allergies = (patient.allergies || []).map(a => a.trim().toLowerCase());
    const conditions = (patient.existing_conditions || []).map(c => c.trim().toLowerCase());
    const other = (patient.other_conditions || "").toLowerCase();
    
    const has = (cond) => conditions.some(c => c.includes(cond)) || other.includes(cond);
    
    const remedy_name = (row.remedy_name || "").toString().toLowerCase();
    const bp_note = (row.suitable_for_bp_high || "").toString().toLowerCase();
    const dm_note = (row.suitable_for_diabetic || "").toString().toLowerCase();
    const avoid_note = (row.avoid_if_allergy || "").toString().toLowerCase();
    const what_avoid = (row.what_to_avoid || "").toString().toLowerCase();

    // 1. Hypertension
    if (has("hypertension") || patient.bp_high) {
        if (bp_note.includes("caution")) warnings.push("⚠️ HYPERTENSION: This remedy needs caution for high BP patients. Consult your homeopathic doctor before use.");
        else if (bp_note.includes("specifically indicated")) warnings.push("✅ HYPERTENSION: This remedy is specifically beneficial for high BP patients.");
        else if (!bp_note.includes("not relevant") && !bp_note.includes("emergency")) warnings.push("✅ HYPERTENSION: This remedy is safe for high BP patients.");
        if (what_avoid.includes("salt") || what_avoid.includes("sodium")) warnings.push("🧂 Avoid extra salt — important for your blood pressure.");
    }

    // 2. Diabetes
    if (has("diabetes") || patient.diabetic) {
        if (dm_note.includes("caution") || dm_note.includes("monitor")) warnings.push("⚠️ DIABETES: Monitor your blood sugar closely while taking this remedy.");
        else if (dm_note.includes("specifically indicated")) warnings.push("✅ DIABETES: This remedy is specifically beneficial for diabetic patients.");
        else if (!dm_note.includes("not relevant") && !dm_note.includes("emergency")) warnings.push("✅ DIABETES: This remedy is safe for diabetic patients.");
        if (what_avoid.includes("sugar") || what_avoid.includes("sweet")) warnings.push("🍬 Avoid sugar and sweets — critical for your diabetes management.");
    }

    // 3. Thyroid
    if (has("thyroid")) {
        warnings.push("🦋 THYROID: Homeopathic remedies are generally safe with thyroid conditions. Monitor your thyroid levels regularly.");
        if (remedy_name.includes("thyroidinum")) warnings.push("✅ This remedy specifically addresses thyroid-related complaints.");
    }

    // 4. Asthma
    if (has("asthma")) {
        warnings.push("🫁 ASTHMA: Always keep your prescribed rescue inhaler with you. Never replace it with homeopathic remedy alone during an acute attack.");
        if (what_avoid.includes("mint") || what_avoid.includes("camphor")) warnings.push("⚠️ ASTHMA: Avoid strong smells — camphor, mint, eucalyptus — as they can trigger attacks and also antidote homeopathic remedies.");
    }

    // 5. Heart Disease
    if (has("heart")) {
        warnings.push("❤️ HEART DISEASE: Always use homeopathic remedies as a COMPLEMENT to your prescribed heart medication.");
        if (remedy_name.includes("cactus") || remedy_name.includes("digitalis")) warnings.push("✅ This remedy has specific action on the heart and is well-indicated for your condition.");
    }

    // 6. Arthritis
    if (has("arthritis")) {
        warnings.push("🦴 ARTHRITIS: Avoid cold damp environments as they typically worsen arthritic symptoms. Warm compress and gentle movement are helpful.");
        if (remedy_name.includes("rhus tox") || remedy_name.includes("colchicum") || remedy_name.includes("causticum")) warnings.push("✅ This remedy is specifically well-suited for arthritic conditions.");
    }

    // 7. Migraine
    if (has("migraine")) {
        warnings.push("🧠 MIGRAINE: Avoid triggers — bright light, loud noise, strong smells, and skipping meals.");
        if (remedy_name.includes("belladonna") || remedy_name.includes("iris") || remedy_name.includes("spigelia") || remedy_name.includes("sanguinaria")) warnings.push("✅ This remedy is specifically indicated for migrainous headaches.");
    }

    // 8. Gastric Issues
    if (has("gastric")) {
        warnings.push("🫃 GASTRIC ISSUES: Avoid spicy oily and heavy food. Eat small frequent meals.");
        if (remedy_name.includes("nux vomica") || remedy_name.includes("carbo veg") || remedy_name.includes("argentum")) warnings.push("✅ This remedy has strong action on gastric complaints.");
    }

    // 9. Psoriasis
    if (has("psoriasis")) {
        warnings.push("🩹 PSORIASIS: Avoid stress and alcohol as they are major triggers. Moisturize skin regularly.");
        if (remedy_name.includes("arsenicum") || remedy_name.includes("sulphur") || remedy_name.includes("graphites")) warnings.push("✅ This remedy has deep action on chronic skin conditions including psoriasis.");
    }
    
    // 10. High Cholesterol
    if (has("cholesterol")) {
        warnings.push("🫀 CHOLESTEROL: Avoid fatty fried food and refined carbohydrates. Regular walking is essential.");
        if (remedy_name.includes("crataegus") || remedy_name.includes("aurum")) warnings.push("✅ This remedy supports cardiovascular health.");
    }

    // 11. Allergies Check
    if (has("allerg")) {
        warnings.push("🤧 ALLERGIES: Identify and avoid your specific allergens. Wear a mask in dusty environments.");
    }

    if (avoid_note && avoid_note !== "none" && avoid_note !== "nan") {
        for (let allergy of allergies) {
            if (avoid_note.includes(allergy)) {
                warnings.push(`🚨 ALLERGY ALERT: You listed '${allergy}' as an allergy — consult doctor before taking this remedy.`);
                is_safe = false;
            }
        }
    }

    // 12. Anxiety
    if (has("anxiety")) {
        warnings.push("🧘 ANXIETY: Avoid caffeine and stimulants. Practice deep breathing.");
        if (["aconite", "argentum", "arsenicum", "ignatia"].some(x => remedy_name.includes(x))) warnings.push("✅ This remedy is specifically well-indicated for anxiety-related complaints.");
    }

    // 13. Depression
    if (has("depression")) {
        warnings.push("💙 DEPRESSION: Continue any prescribed antidepressants — do not stop without doctor's advice.");
        if (["ignatia", "natrum mur", "aurum", "sepia"].some(x => remedy_name.includes(x))) warnings.push("✅ This remedy has deep action on emotional and depressive states.");
    }

    // 14. Neurological
    if (has("neurolog")) {
        warnings.push("🧬 NEUROLOGICAL CONDITION: Always continue prescribed neurological medications. Use homeopathy only as a supportive therapy.");
    }

    // 15. Kidney Issues
    if (has("kidney")) {
        warnings.push("🫘 KIDNEY ISSUES: Drink adequate water. Avoid high protein and high sodium diet.");
        if (["berberis", "cantharis", "sarsaparilla"].some(x => remedy_name.includes(x))) warnings.push("✅ This remedy has specific action on the urinary and kidney system.");
    }

    // 16. Liver Issues
    if (has("liver")) {
        warnings.push("🫀 LIVER ISSUES: Strictly avoid alcohol. Eat a low-fat easily digestible diet.");
        if (["chelidonium", "lycopodium", "carduus"].some(x => remedy_name.includes(x))) warnings.push("✅ This remedy has specific action on the liver.");
    }

    // Age Group logic
    const age_group = (row.patient_age_group || "all").toString().toLowerCase();
    if (age < 12 && age_group === "adult") warnings.push("⚠️ AGE: This remedy is for adults — consult a doctor for child-safe dosage.");
    if (age > 65 && age_group.includes("child")) warnings.push("ℹ️ AGE: This remedy is typically for children — adult dosing may differ.");
    if (age > 65) warnings.push("👴 ELDERLY PATIENT: Start with lower potency (6C or 30C) and take fewer doses. Elderly patients are more sensitive.");

    if (warnings.length === 0) warnings.push("✅ This remedy is suitable for your health profile. Take as directed.");

    return { is_safe, warnings };
}

export const performConsultation = async (userId, symptomsInput) => {
    await delay(600);
    const list = Array.isArray(symptomsInput) ? symptomsInput : [{ symptom: arguments[1], severity: arguments[2] }];
    
    let rows = [];
    let querySyms = [];
    
    list.forEach(item => {
        const sym = item.symptom.trim().toLowerCase();
        const sev = item.severity.trim().toLowerCase();
        querySyms.push(`${sym} (${sev})`);
        
        let row = mappings.find(r => (r.symptom || "").toString().trim().toLowerCase() === sym && (r.severity || "").toString().trim().toLowerCase() === sev);
        if (!row) {
            row = mappings.find(r => (r.symptom || "").toString().trim().toLowerCase().includes(sym) && (r.severity || "").toString().trim().toLowerCase() === sev);
        }
        if (row) rows.push(row);
    });

    if (rows.length === 0) {
        return { detail: { error: `No remedy found for the selected symptoms.` } };
    }

    let patientRaw = localStorage.getItem(`patient_${userId}`);
    let patient = patientRaw ? JSON.parse(patientRaw) : {};
    
    let remedyCounts = {};
    rows.forEach(r => {
        remedyCounts[r.remedy_name] = (remedyCounts[r.remedy_name] || 0) + 1;
    });
    
    let bestRow = rows.sort((a, b) => remedyCounts[b.remedy_name] - remedyCounts[a.remedy_name])[0];
    const safety = buildSafety(bestRow, patient);

    const result = {
        success: true,
        query: { symptom: querySyms.join(", "), severity: "Various", patient_name: patient.name || "Patient" },
        remedy: {
            name: bestRow.remedy_name,
            potency: bestRow.potency,
            possible_condition: rows.length > 1 ? `Multiple Symptoms (Primary Match: ${bestRow.possible_condition})` : bestRow.possible_condition,
            keynote: bestRow.keynote_indication,
            why_this_remedy: rows.length > 1 ? `Selected for totality of symptoms based on highest coverage. ${bestRow.remedy_reason}` : bestRow.remedy_reason,
            source_book: bestRow.source_book,
            additional_notes: bestRow.additional_notes,
        },
        patient_safety: {
            is_safe: safety.is_safe,
            warnings: safety.warnings,
            bp_note: bestRow.suitable_for_bp_high,
            diabetes_note: bestRow.suitable_for_diabetic,
            allergy_note: bestRow.avoid_if_allergy,
        },
        lifestyle: {
            dietary_restrictions: bestRow.dietary_restrictions,
            what_to_avoid: bestRow.what_to_avoid,
        },
        consult_doctor: (bestRow.consult_doctor || "").toString().trim().toLowerCase() === "yes"
    };

    // Save hardware history
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
        await fetch(`${BASE_URL}/api/patient/history`, {
            method: "POST", headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ user_id: userId, data: history })
        });
    } catch(err) {}

    return result;
};

export const getHistory = async (userId) => {
    try {
        const res = await fetch(`${BASE_URL}/api/patient/history/${userId}`);
        if (res.ok) {
            const data = await res.json();
            if (data.history && data.history.length > 0) {
                localStorage.setItem(`history_${userId}`, JSON.stringify(data.history));
            }
        }
    } catch(err) { console.error(err); }

    const raw = localStorage.getItem(`history_${userId}`);
    const history = raw ? JSON.parse(raw) : [];
    
    const pRaw = localStorage.getItem(`patient_${userId}`);
    const patientName = pRaw ? JSON.parse(pRaw).name : "User";
    
    return {
        success: true,
        patient_name: patientName,
        total: history.length,
        history: history
    };
};

export const getSavedRemedies = async (userId) => {
    try {
        const res = await fetch(`${BASE_URL}/api/patient/saved/${userId}`);
        if (res.ok) {
            const data = await res.json();
            if (data.saved_remedies) {
                localStorage.setItem(`saved_remedies_${userId}`, JSON.stringify(data.saved_remedies));
            }
        }
    } catch(err) { console.error(err); }

    const raw = localStorage.getItem(`saved_remedies_${userId}`);
    return { success: true, saved_remedies: raw ? JSON.parse(raw) : [] };
};

export const updateSavedRemedies = async (userId, savedData) => {
    try {
        await fetch(`${BASE_URL}/api/patient/saved`, {
            method: "POST", headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ user_id: userId, data: savedData })
        });
    } catch(err) { console.error(err); }
    localStorage.setItem(`saved_remedies_${userId}`, JSON.stringify(savedData));
    return { success: true };
};

// --- Library Functions ---

export const searchLibrary = async (query) => {
    await delay(200);
    if (!query) return library.slice(0, 20); // Return first 20 if no query
    
    const q = query.toLowerCase();
    return library.filter(rem => 
        rem.name.toLowerCase().includes(q) || 
        rem.details.some(d => d.description.toLowerCase().includes(q))
    ).slice(0, 50); // Limit results for performance
};

export const getRemedyDetails = async (remedyName) => {
    await delay(100);
    const remedy = library.find(r => r.name.toLowerCase() === remedyName.toLowerCase());
    return remedy || null;
};

// --- Philosophy Functions ---

export const getPhilosophy = async () => {
    await delay(200);
    return dataset.philosophy || [];
};

export const getHealthFacts = async () => {
    await delay(100);
    return dataset.health_facts || [];
};

export const getConsultationHistory = async (userId) => {
    await delay(300);
    const history = JSON.parse(localStorage.getItem(`history_${userId}`)) || [];
    return { success: true, history };
};
