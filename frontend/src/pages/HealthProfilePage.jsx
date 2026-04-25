import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Shield,
  Edit2,
  User,
  Calendar,
  Activity,
  Heart,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { registerPatient, getPatientProfile } from '../services/api';

const HealthProfilePage = ({ user }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    age: 21,
    gender: 'male',
    blood_group: 'O+',

    bp_high: false,
    diabetic: false,
    sugar_level: 'normal',
    bp_reading: '',

    existing_conditions: [],
    other_conditions: '',

    allergies: [],
    other_allergy: '',

    current_medications: [],
    other_medication: '',

    family_history: [],
    other_family_condition: '',
    other_family_relation: '',

    sleep_quality: '',
    overthinking_level: '',
    anger_level: '',
    appetite_level: '',
    food_preferences: [],
    other_food_preference: '',
    stress_level: '',
    energy_level: '',

    thermal: '',
    thirst: '',
    sleep_pattern: '',
    mental_state: ''
  });

  const conditionCategories = {
    Metabolic: [
      'Diabetes',
      'Prediabetes',
      'Thyroid Disorder',
      'Obesity',
      'High Cholesterol'
    ],
    'Blood Pressure / Heart': [
      'Hypertension',
      'Low Blood Pressure',
      'Heart Disease',
      'Heart Palpitations'
    ],
    Respiratory: [
      'Asthma',
      'Sinusitis',
      'Allergic Rhinitis',
      'Bronchitis'
    ],
    Digestive: [
      'Acidity',
      'Gastritis',
      'Constipation',
      'IBS',
      'Gastric Ulcer'
    ],
    Skin: [
      'Psoriasis',
      'Eczema',
      'Acne',
      'Fungal Infection'
    ],
    'Joint / Body Pain': [
      'Arthritis',
      'Back Pain',
      'Joint Pain',
      'Spondylitis'
    ],
    'Mental / Emotional': [
      'Anxiety',
      'Depression',
      'Panic Disorder',
      'Overthinking',
      'Stress Disorder',
      'Insomnia'
    ],
    Neurological: [
      'Migraine',
      'Epilepsy',
      'Vertigo',
      'Neuropathy'
    ],
    'Organ-related': [
      'Kidney Disease',
      'Liver Disease',
      'Fatty Liver'
    ],
    'Hormonal / Reproductive': [
      'PCOS',
      'Menstrual Disorder',
      'Hormonal Imbalance',
      'Infertility'
    ],
    Other: ['Other']
  };

  const allergyOptions = [
    'Dust',
    'Pollen',
    'Milk',
    'Egg',
    'Peanuts',
    'Seafood',
    'Medicine Allergy',
    'Cold Weather',
    'Heat',
    'Strong Smells',
    'Other'
  ];

  const medicationOptions = [
    'Blood Pressure Medicine',
    'Diabetes Medicine',
    'Thyroid Medicine',
    'Asthma Inhaler',
    'Painkillers',
    'Antibiotics',
    'Antidepressants',
    'Sleeping Pills',
    'Other'
  ];

  const sleepOptions = ['Very Poor', 'Poor', 'Normal', 'Good', 'Very Good'];
  const overthinkingOptions = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
  const angerOptions = ['Very Calm', 'Mild', 'Moderate', 'High', 'Extreme'];
  const appetiteOptions = ['Low', 'Normal', 'High', 'Very High'];

  const foodOptions = [
    'Sweet',
    'Spicy',
    'Salty',
    'Sour',
    'Cold Food',
    'Hot Food',
    'Fried Food',
    'Junk Food',
    'Other'
  ];

  const stressOptions = ['Low', 'Moderate', 'High', 'Severe'];
  const energyOptions = ['Very Low', 'Low', 'Normal', 'High', 'Very High'];

  const hereditaryConditions = [
    'Diabetes',
    'Hypertension',
    'Heart Disease',
    'Cancer',
    'Thyroid Disorder',
    'Asthma',
    'Arthritis',
    'Kidney Disease',
    'Mental Illness',
    'Other'
  ];

  const relations = [
    'Father',
    'Mother',
    'Both Parents',
    'Grandparents',
    'Sibling',
    'Other'
  ];

  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user]);

  const safeArray = (value) => (Array.isArray(value) ? value : []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getPatientProfile(user.id);

      if (response.success && response.patient) {
        const p = response.patient;

        setFormData({
          name: p.name || '',
          age: p.age || 21,
          gender: p.gender || 'male',
          blood_group: p.blood_group || 'O+',

          bp_high: !!p.bp_high,
          diabetic: !!p.diabetic,
          sugar_level: p.sugar_level || 'normal',
          bp_reading: p.bp_reading || '',

          existing_conditions: safeArray(p.existing_conditions),
          other_conditions: p.other_conditions || '',

          allergies: safeArray(p.allergies),
          other_allergy: p.other_allergy || '',

          current_medications: safeArray(p.current_medications),
          other_medication: p.other_medication || '',

          family_history: safeArray(p.family_history),
          other_family_condition: p.other_family_condition || '',
          other_family_relation: p.other_family_relation || '',

          sleep_quality: p.sleep_quality || '',
          overthinking_level: p.overthinking_level || '',
          anger_level: p.anger_level || '',
          appetite_level: p.appetite_level || '',
          food_preferences: safeArray(p.food_preferences),
          other_food_preference: p.other_food_preference || '',
          stress_level: p.stress_level || '',
          energy_level: p.energy_level || '',

          thermal: p.thermal || '',
          thirst: p.thirst || '',
          sleep_pattern: p.sleep_pattern || '',
          mental_state: p.mental_state || ''
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayValue = (field, value) => {
    const current = formData[field] || [];

    setFormData({
      ...formData,
      [field]: current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    });
  };

  const updateFamilyHistory = (condition, relation) => {
    const filtered = formData.family_history.filter(
      (item) => item.condition !== condition
    );

    if (!relation) {
      setFormData({ ...formData, family_history: filtered });
      return;
    }

    setFormData({
      ...formData,
      family_history: [...filtered, { condition, relation }]
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        ...formData,
        user_id: user.id
      };

      const response = await registerPatient(payload);

      if (response.success) {
        localStorage.removeItem('is_new');
        alert('Profile saved successfully!');
        navigate('/');
      } else {
        throw new Error(
          response.message ||
            (response.detail ? JSON.stringify(response.detail) : 'Unknown backend error')
        );
      }
    } catch (err) {
      alert(`Failed to save profile: ${err.message || 'Network error'}`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Fetching your health records...</p>
      </div>
    );
  }

  return (
    <div className="health-profile-container fade-in">
      <header className="health-header gradient-bg">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} color="white" />
        </button>

        <div className="health-header-content">
          <div className="shield-icon">
            <Shield size={40} color="white" fill="white" />
            <div className="shield-plus">+</div>
          </div>
          <h1>Health Profile</h1>
          <p>Comprehensive health details for safer AI care</p>
        </div>
      </header>

      <div className="health-body">
        <section className="form-section">
          <div className="section-title">
            <User size={20} className="section-icon" />
            <h3>Basic Information</h3>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Patient Name"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group half">
              <label>Age</label>
              <div className="input-with-icon">
                <Calendar size={18} />
                <input
                  type="number"
                  className="input-field"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="input-group half">
              <label>Gender</label>
              <select
                className="input-field"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </section>

        <section className="form-section">
          <div className="section-title">
            <Heart size={20} className="section-icon" />
            <h3>Existing Conditions</h3>
          </div>

          {Object.entries(conditionCategories).map(([category, items]) => (
            <div key={category} className="option-category">
              <h4>{category}</h4>
              <div className="conditions-grid">
                {items.map((condition) => (
                  <button
                    type="button"
                    key={condition}
                    className={`condition-tag ${
                      formData.existing_conditions.includes(condition) ? 'active' : ''
                    }`}
                    onClick={() => toggleArrayValue('existing_conditions', condition)}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {formData.existing_conditions.includes('Other') && (
            <div className="input-group top-gap">
              <label>Other Conditions</label>
              <div className="other-input-box">
                <Edit2 size={20} color="#8b5cf6" />
                <textarea
                  className="other-textarea"
                  value={formData.other_conditions}
                  onChange={(e) =>
                    setFormData({ ...formData, other_conditions: e.target.value })
                  }
                  placeholder="Enter other condition"
                />
              </div>
            </div>
          )}
        </section>

        <section className="form-section">
          <div className="section-title">
            <Activity size={20} className="section-icon" />
            <h3>Family History</h3>
          </div>

          {hereditaryConditions.map((condition) => {
            const selected = formData.family_history.find(
              (item) => item.condition === condition
            );

            return (
              <div key={condition} className="family-history-item">
                <button
                  type="button"
                  className={`condition-tag ${selected ? 'active' : ''}`}
                  onClick={() =>
                    updateFamilyHistory(condition, selected ? '' : 'Father')
                  }
                >
                  {condition}
                </button>

                {selected && (
                  <select
                    className="input-field relation-select"
                    value={selected.relation}
                    onChange={(e) => updateFamilyHistory(condition, e.target.value)}
                  >
                    {relations.map((relation) => (
                      <option key={relation} value={relation}>
                        {relation}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}

          {formData.family_history.some((item) => item.condition === 'Other') && (
            <div className="input-group top-gap">
              <label>Other Family Condition</label>
              <input
                type="text"
                className="input-field"
                value={formData.other_family_condition}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    other_family_condition: e.target.value
                  })
                }
                placeholder="Enter other hereditary condition"
              />
            </div>
          )}

          {formData.family_history.some((item) => item.relation === 'Other') && (
            <div className="input-group top-gap">
              <label>Other Relation</label>
              <input
                type="text"
                className="input-field"
                value={formData.other_family_relation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    other_family_relation: e.target.value
                  })
                }
                placeholder="Enter relation"
              />
            </div>
          )}
        </section>

        <section className="form-section">
          <div className="section-title">
            <Activity size={20} className="section-icon" />
            <h3>Constitutional Profile</h3>
          </div>

          <div className="input-row">
            <SelectBox label="Sleep Quality" field="sleep_quality" options={sleepOptions} formData={formData} setFormData={setFormData} />
            <SelectBox label="Overthinking Level" field="overthinking_level" options={overthinkingOptions} formData={formData} setFormData={setFormData} />
          </div>

          <div className="input-row top-gap">
            <SelectBox label="Anger Level" field="anger_level" options={angerOptions} formData={formData} setFormData={setFormData} />
            <SelectBox label="Appetite Level" field="appetite_level" options={appetiteOptions} formData={formData} setFormData={setFormData} />
          </div>

          <div className="input-row top-gap">
            <SelectBox label="Stress Level" field="stress_level" options={stressOptions} formData={formData} setFormData={setFormData} />
            <SelectBox label="Energy Level" field="energy_level" options={energyOptions} formData={formData} setFormData={setFormData} />
          </div>

          <div className="questionnaire-group top-gap">
            <label className="q-label">Food Preferences</label>
            <div className="conditions-grid">
              {foodOptions.map((food) => (
                <button
                  type="button"
                  key={food}
                  className={`condition-tag ${
                    formData.food_preferences.includes(food) ? 'active' : ''
                  }`}
                  onClick={() => toggleArrayValue('food_preferences', food)}
                >
                  {food}
                </button>
              ))}
            </div>
          </div>

          {formData.food_preferences.includes('Other') && (
            <div className="input-group top-gap">
              <label>Other Food Preference</label>
              <input
                type="text"
                className="input-field"
                value={formData.other_food_preference}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    other_food_preference: e.target.value
                  })
                }
                placeholder="Enter other food preference"
              />
            </div>
          )}
        </section>

        <section className="form-section">
          <div className="section-title">
            <AlertCircle size={20} className="section-icon" />
            <h3>Allergies</h3>
          </div>

          <div className="conditions-grid">
            {allergyOptions.map((allergy) => (
              <button
                type="button"
                key={allergy}
                className={`condition-tag ${
                  formData.allergies.includes(allergy) ? 'active' : ''
                }`}
                onClick={() => toggleArrayValue('allergies', allergy)}
              >
                {allergy}
              </button>
            ))}
          </div>

          {formData.allergies.includes('Other') && (
            <div className="input-group top-gap">
              <label>Other Allergy</label>
              <input
                type="text"
                className="input-field"
                value={formData.other_allergy}
                onChange={(e) =>
                  setFormData({ ...formData, other_allergy: e.target.value })
                }
                placeholder="Enter other allergy"
              />
            </div>
          )}
        </section>

        <section className="form-section">
          <div className="section-title">
            <AlertCircle size={20} className="section-icon" />
            <h3>Current Medications</h3>
          </div>

          <div className="conditions-grid">
            {medicationOptions.map((medicine) => (
              <button
                type="button"
                key={medicine}
                className={`condition-tag ${
                  formData.current_medications.includes(medicine) ? 'active' : ''
                }`}
                onClick={() => toggleArrayValue('current_medications', medicine)}
              >
                {medicine}
              </button>
            ))}
          </div>

          {formData.current_medications.includes('Other') && (
            <div className="input-group top-gap">
              <label>Other Medication</label>
              <input
                type="text"
                className="input-field"
                value={formData.other_medication}
                onChange={(e) =>
                  setFormData({ ...formData, other_medication: e.target.value })
                }
                placeholder="Enter other medication"
              />
            </div>
          )}
        </section>

        <section className="form-section">
          <div className="section-title">
            <Activity size={20} className="section-icon" />
            <h3>Additional Homeopathic Case Details</h3>
          </div>

          <div className="questionnaire-group">
            <label className="q-label">Thermal Preferences</label>
            <div className="toggle-row">
              <button
                type="button"
                className={`toggle-btn ${formData.thermal === 'Chilly' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, thermal: 'Chilly' })}
              >
                Chilly
              </button>

              <button
                type="button"
                className={`toggle-btn ${formData.thermal === 'Hot' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, thermal: 'Hot' })}
              >
                Hot
              </button>
            </div>
          </div>

          <div className="questionnaire-group">
            <label className="q-label">Thirst</label>
            <input
              type="text"
              className="input-field"
              value={formData.thirst}
              onChange={(e) => setFormData({ ...formData, thirst: e.target.value })}
              placeholder="e.g. Thirsty for cold water"
            />
          </div>

          <div className="questionnaire-group">
            <label className="q-label">Sleep Pattern / Dreams</label>
            <textarea
              className="input-field q-textarea"
              value={formData.sleep_pattern}
              onChange={(e) =>
                setFormData({ ...formData, sleep_pattern: e.target.value })
              }
              placeholder="Describe sleep pattern or recurring dreams"
            />
          </div>

          <div className="questionnaire-group">
            <label className="q-label">Mental State</label>
            <input
              type="text"
              className="input-field"
              value={formData.mental_state}
              onChange={(e) =>
                setFormData({ ...formData, mental_state: e.target.value })
              }
              placeholder="e.g. Calm, anxious, quick-tempered"
            />
          </div>
        </section>

        <button
          className="btn btn-primary next-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving Profile...' : 'Save Health Profile'}
        </button>
      </div>

      <style>{`
        .health-profile-container { padding-bottom: 40px; }

        .health-header {
          height: 240px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-bottom-left-radius: 40px;
          border-bottom-right-radius: 40px;
          position: relative;
          background: var(--dark-header);
        }

        .back-btn {
          position: absolute;
          top: 60px;
          left: 20px;
          background: none;
          border: none;
          cursor: pointer;
        }

        .health-header-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .health-header-content p {
          color: rgba(255,255,255,0.8);
          font-size: 14px;
        }

        .shield-icon {
          width: 70px;
          height: 80px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.9;
        }

        .shield-plus {
          position: absolute;
          font-size: 24px;
          font-weight: bold;
          color: rgba(139, 92, 246, 0.6);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
        }

        .health-header h1 {
          font-size: 28px;
          color: white;
          font-weight: 700;
        }

        .health-body { padding: 24px; }

        .form-section {
          margin-bottom: 32px;
          padding: 24px;
          background: white;
          border-radius: 24px;
          border: none;
          box-shadow: var(--shadow);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .section-icon { color: var(--primary); }

        .section-title h3 {
          font-size: 16px;
          color: #2F2E41;
        }

        .input-row {
          display: flex;
          gap: 16px;
        }

        .input-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 13px;
          color: #9ca3af;
          font-weight: 600;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-with-icon svg {
          position: absolute;
          left: 16px;
          color: #9ca3af;
        }

        .input-with-icon .input-field { padding-left: 48px; }

        .input-field {
          padding: 16px;
          border-radius: 16px;
          border: none;
          background: #f4f3f7;
          font-size: 15px;
          outline: none;
          transition: all 0.2s;
          font-weight: 500;
          color: #33324f;
          width: 100%;
          box-sizing: border-box;
        }

        .input-field:focus {
          background: white;
          box-shadow: 0 0 0 2px var(--primary-light);
        }

        .conditions-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .condition-tag {
          padding: 12px 18px;
          border-radius: 16px;
          border: none;
          background: #f4f3f7;
          font-size: 14px;
          font-weight: 600;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s;
        }

        .condition-tag.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 10px rgba(139, 92, 246, 0.4);
        }

        .option-category {
          margin-bottom: 18px;
        }

        .option-category h4 {
          font-size: 14px;
          color: #2F2E41;
          margin-bottom: 10px;
          font-weight: 800;
        }

        .family-history-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .relation-select {
          max-width: 220px;
          padding: 12px;
        }

        .other-input-box {
          background: #f4f3f7;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          gap: 12px;
        }

        .other-textarea {
          flex: 1;
          background: none;
          border: none;
          resize: none;
          height: 80px;
          outline: none;
          font-family: inherit;
          font-size: 14px;
          color: #2F2E41;
        }

        .questionnaire-group { margin-bottom: 24px; }

        .q-label {
          font-size: 15px;
          font-weight: 800;
          color: #2F2E41;
          display: block;
          margin-bottom: 6px;
        }

        .q-textarea {
          min-height: 80px;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: 16px;
          padding: 14px;
          width: 100%;
          box-sizing: border-box;
        }

        .toggle-row {
          display: flex;
          gap: 8px;
        }

        .toggle-btn {
          flex: 1;
          padding: 12px;
          border-radius: 14px;
          border: 1px solid #E5E7EB;
          background: #F9FAFB;
          font-size: 13px;
          font-weight: 700;
          color: #4b5563;
          cursor: pointer;
          transition: all 0.2s;
        }

        .toggle-btn.active {
          background: #8B5CF6;
          color: white;
          border-color: #8B5CF6;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
        }

        .top-gap { margin-top: 16px; }

        .next-btn {
          height: 60px;
          border-radius: 20px;
          font-size: 16px;
          margin-top: 10px;
          width: 100%;
          background: var(--dark-header);
          color: white;
          border: none;
          font-weight: 700;
          cursor: pointer;
        }

        .next-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-screen {
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          color: #9ca3af;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const SelectBox = ({ label, field, options, formData, setFormData }) => {
  return (
    <div className="input-group half">
      <label>{label}</label>
      <select
        className="input-field"
        value={formData[field]}
        onChange={(e) =>
          setFormData({
            ...formData,
            [field]: e.target.value
          })
        }
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default HealthProfilePage;