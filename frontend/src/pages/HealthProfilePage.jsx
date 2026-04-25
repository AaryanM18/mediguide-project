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

const EMPTY_PROFILE = {
  name: '',
  age: '',
  gender: '',
  blood_group: '',

  bp_high: false,
  diabetic: false,
  sugar_level: '',
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
};

const conditionCategories = {
  Metabolic: ['Diabetes', 'Prediabetes', 'Thyroid Disorder', 'Obesity', 'High Cholesterol'],
  'Blood Pressure / Heart': ['Hypertension', 'Low Blood Pressure', 'Heart Disease', 'Heart Palpitations'],
  Respiratory: ['Asthma', 'Sinusitis', 'Allergic Rhinitis', 'Bronchitis'],
  Digestive: ['Acidity', 'Gastritis', 'Constipation', 'IBS', 'Gastric Ulcer'],
  Skin: ['Psoriasis', 'Eczema', 'Acne', 'Fungal Infection'],
  'Joint / Body Pain': ['Arthritis', 'Back Pain', 'Joint Pain', 'Spondylitis'],
  'Mental / Emotional': ['Anxiety', 'Depression', 'Panic Disorder', 'Overthinking', 'Stress Disorder', 'Insomnia'],
  Neurological: ['Migraine', 'Epilepsy', 'Vertigo', 'Neuropathy'],
  'Organ-related': ['Kidney Disease', 'Liver Disease', 'Fatty Liver'],
  'Hormonal / Reproductive': ['PCOS', 'Menstrual Disorder', 'Hormonal Imbalance', 'Infertility'],
  Other: ['Other']
};

const allergyOptions = [
  'Dust', 'Pollen', 'Milk', 'Egg', 'Peanuts', 'Seafood',
  'Medicine Allergy', 'Cold Weather', 'Heat', 'Strong Smells', 'Other'
];

const medicationOptions = [
  'Blood Pressure Medicine', 'Diabetes Medicine', 'Thyroid Medicine',
  'Asthma Inhaler', 'Painkillers', 'Antibiotics',
  'Antidepressants', 'Sleeping Pills', 'Other'
];

const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genderOptions = ['male', 'female', 'other'];
const sugarOptions = ['low', 'normal', 'high', 'unknown'];

const sleepOptions = ['Very Poor', 'Poor', 'Normal', 'Good', 'Very Good'];
const overthinkingOptions = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
const angerOptions = ['Very Calm', 'Mild', 'Moderate', 'High', 'Extreme'];
const appetiteOptions = ['Low', 'Normal', 'High', 'Very High'];
const foodOptions = ['Sweet', 'Spicy', 'Salty', 'Sour', 'Cold Food', 'Hot Food', 'Fried Food', 'Junk Food', 'Other'];
const stressOptions = ['Low', 'Moderate', 'High', 'Severe'];
const energyOptions = ['Very Low', 'Low', 'Normal', 'High', 'Very High'];

const hereditaryConditions = [
  'Diabetes', 'Hypertension', 'Heart Disease', 'Cancer',
  'Thyroid Disorder', 'Asthma', 'Arthritis',
  'Kidney Disease', 'Mental Illness', 'Other'
];

const relations = ['Father', 'Mother', 'Both Parents', 'Grandparents', 'Sibling', 'Other'];

const HealthProfilePage = ({ user }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
  ...EMPTY_PROFILE,
  name: user?.name || '',
  age: user?.age || '',
  gender: user?.gender || ''
});

  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user?.id]);

  const safeArray = (value) => (Array.isArray(value) ? value : []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getPatientProfile(user.id);

      if (response.success && response.patient) {
        const p = response.patient;

        setFormData({
          ...EMPTY_PROFILE,
          name: p.name || user?.name || '',
          age: p.age || user?.age || '',
          gender: p.gender || user?.gender || '',
          blood_group: p.blood_group || '',

          bp_high: !!p.bp_high,
          diabetic: !!p.diabetic,
          sugar_level: p.sugar_level || '',
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

    if (relation === null) {
      setFormData({ ...formData, family_history: filtered });
      return;
    }

    setFormData({
      ...formData,
      family_history: [...filtered, { condition, relation }]
    });
  };

  const parseSaveError = (err) => {
    if (!err) return 'Profile save failed.';
    if (typeof err === 'string') return err;
    if (err.message) return err.message;
    if (Array.isArray(err.detail)) {
      return err.detail.map((e) => e.msg || JSON.stringify(e)).join(', ');
    }
    if (typeof err.detail === 'string') return err.detail;
    return 'Profile save failed.';
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        ...formData,
        user_id: user.id,
        name: formData.name.trim(),
        age: formData.age ? Number(formData.age) : null
      };

      const response = await registerPatient(payload);

      if (response.success) {
        localStorage.removeItem('is_new');
        alert('Profile saved successfully!');
        navigate('/');
      } else {
        throw response;
      }
    } catch (err) {
      alert(parseSaveError(err));
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
                placeholder="Enter full name"
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
                  min="1"
                  max="120"
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="Enter age"
                />
              </div>
            </div>

            <SelectBox
              label="Gender"
              field="gender"
              options={genderOptions}
              formData={formData}
              setFormData={setFormData}
            />
          </div>

          <div className="input-row top-gap">
            <SelectBox
              label="Blood Group"
              field="blood_group"
              options={bloodGroupOptions}
              formData={formData}
              setFormData={setFormData}
            />

            <SelectBox
              label="Sugar Level"
              field="sugar_level"
              options={sugarOptions}
              formData={formData}
              setFormData={setFormData}
            />
          </div>

          <div className="input-row top-gap">
            <div className="input-group half">
              <label>BP Reading</label>
              <input
                type="text"
                className="input-field"
                value={formData.bp_reading}
                onChange={(e) => setFormData({ ...formData, bp_reading: e.target.value })}
                placeholder="e.g. 120/80"
              />
            </div>

            <div className="toggle-row half-toggle">
              <button
                type="button"
                className={`toggle-btn ${formData.bp_high ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, bp_high: !formData.bp_high })}
              >
                High BP
              </button>
              <button
                type="button"
                className={`toggle-btn ${formData.diabetic ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, diabetic: !formData.diabetic })}
              >
                Diabetic
              </button>
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
                    className={`condition-tag ${formData.existing_conditions.includes(condition) ? 'active' : ''}`}
                    onClick={() => toggleArrayValue('existing_conditions', condition)}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {formData.existing_conditions.includes('Other') && (
            <TextAreaField
              label="Other Conditions"
              value={formData.other_conditions}
              onChange={(value) => setFormData({ ...formData, other_conditions: value })}
              placeholder="Enter other condition"
            />
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
                    selected
                      ? updateFamilyHistory(condition, null)
                      : updateFamilyHistory(condition, '')
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
                    <option value="">Select relation</option>
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
            <InputField
              label="Other Family Condition"
              value={formData.other_family_condition}
              onChange={(value) => setFormData({ ...formData, other_family_condition: value })}
              placeholder="Enter other hereditary condition"
            />
          )}

          {formData.family_history.some((item) => item.relation === 'Other') && (
            <InputField
              label="Other Relation"
              value={formData.other_family_relation}
              onChange={(value) => setFormData({ ...formData, other_family_relation: value })}
              placeholder="Enter relation"
            />
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
                  className={`condition-tag ${formData.food_preferences.includes(food) ? 'active' : ''}`}
                  onClick={() => toggleArrayValue('food_preferences', food)}
                >
                  {food}
                </button>
              ))}
            </div>
          </div>

          {formData.food_preferences.includes('Other') && (
            <InputField
              label="Other Food Preference"
              value={formData.other_food_preference}
              onChange={(value) => setFormData({ ...formData, other_food_preference: value })}
              placeholder="Enter other food preference"
            />
          )}
        </section>

        <MultiSelectSection
          title="Allergies"
          icon={<AlertCircle size={20} className="section-icon" />}
          options={allergyOptions}
          values={formData.allergies}
          onToggle={(value) => toggleArrayValue('allergies', value)}
        />

        {formData.allergies.includes('Other') && (
          <section className="form-section">
            <InputField
              label="Other Allergy"
              value={formData.other_allergy}
              onChange={(value) => setFormData({ ...formData, other_allergy: value })}
              placeholder="Enter other allergy"
            />
          </section>
        )}

        <MultiSelectSection
          title="Current Medications"
          icon={<AlertCircle size={20} className="section-icon" />}
          options={medicationOptions}
          values={formData.current_medications}
          onToggle={(value) => toggleArrayValue('current_medications', value)}
        />

        {formData.current_medications.includes('Other') && (
          <section className="form-section">
            <InputField
              label="Other Medication"
              value={formData.other_medication}
              onChange={(value) => setFormData({ ...formData, other_medication: value })}
              placeholder="Enter other medication"
            />
          </section>
        )}

        <section className="form-section">
          <div className="section-title">
            <Activity size={20} className="section-icon" />
            <h3>Additional Homeopathic Case Details</h3>
          </div>

          <div className="questionnaire-group">
            <label className="q-label">Thermal Preferences</label>
            <div className="toggle-row">
              {['Chilly', 'Hot'].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`toggle-btn ${formData.thermal === value ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, thermal: value })}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <InputField
            label="Thirst"
            value={formData.thirst}
            onChange={(value) => setFormData({ ...formData, thirst: value })}
            placeholder="Describe thirst pattern"
          />

          <TextAreaField
            label="Sleep Pattern / Dreams"
            value={formData.sleep_pattern}
            onChange={(value) => setFormData({ ...formData, sleep_pattern: value })}
            placeholder="Describe sleep pattern or recurring dreams"
          />

          <InputField
            label="Mental State"
            value={formData.mental_state}
            onChange={(value) => setFormData({ ...formData, mental_state: value })}
            placeholder="Describe current mental state"
          />
        </section>

        <button
          className="btn btn-primary next-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving Profile...' : 'Save Health Profile'}
        </button>
      </div>

      <style>{styles}</style>
    </div>
  );
};

const SelectBox = ({ label, field, options, formData, setFormData }) => (
  <div className="input-group half">
    <label>{label}</label>
    <select
      className="input-field"
      value={formData[field]}
      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
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

const InputField = ({ label, value, onChange, placeholder }) => (
  <div className="input-group top-gap">
    <label>{label}</label>
    <input
      type="text"
      className="input-field"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder }) => (
  <div className="input-group top-gap">
    <label>{label}</label>
    <div className="other-input-box">
      <Edit2 size={20} color="#8b5cf6" />
      <textarea
        className="other-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  </div>
);

const MultiSelectSection = ({ title, icon, options, values, onToggle }) => (
  <section className="form-section">
    <div className="section-title">
      {icon}
      <h3>{title}</h3>
    </div>

    <div className="conditions-grid">
      {options.map((option) => (
        <button
          type="button"
          key={option}
          className={`condition-tag ${values.includes(option) ? 'active' : ''}`}
          onClick={() => onToggle(option)}
        >
          {option}
        </button>
      ))}
    </div>
  </section>
);

const styles = `
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
.option-category { margin-bottom: 18px; }
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
.toggle-row {
  display: flex;
  gap: 8px;
}
.half-toggle {
  flex: 1;
  align-items: flex-end;
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
`;

export default HealthProfilePage;