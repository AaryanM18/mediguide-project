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
  localStorage.setItem('user_name', formData.name.trim());
  localStorage.setItem('user_age', formData.age || '');
  localStorage.setItem('user_gender', formData.gender || '');
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
    <Activity size={20} className="section-icon"/>
    <h3>Family History</h3>
  </div>

  <div className="family-history-grid">
    {hereditaryConditions.map((condition) => {
      const selected = formData.family_history.find(
        item => item.condition === condition
      );

      return (
        <div key={condition} className="family-history-card">

          <button
            type="button"
            className={`condition-tag ${selected ? "active" : ""}`}
            onClick={() =>
              selected
                ? updateFamilyHistory(condition,null)
                : updateFamilyHistory(condition,"")
            }
          >
            {condition}
          </button>

          {selected && (
            <select
              className="relation-select"
              value={selected.relation}
              onChange={(e)=>
                updateFamilyHistory(
                  condition,
                  e.target.value
                )
              }
            >
              <option value="">
                Select relation
              </option>

              {relations.map((relation)=>(
                <option
                  key={relation}
                  value={relation}
                >
                  {relation}
                </option>
              ))}
            </select>
          )}

        </div>
      );
    })}
  </div>
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
:root{
--primary-950:#1e0738;
--primary-900:#2d0a54;
--primary-800:#4c1d95;
--primary-700:#6d28d9;
--primary-600:#8f56eb;
--primary-500:#a78bfa;
--primary-400:#c4b5fd;
--primary-300:#ddd6fe;

--surface:#f8f4ff;
--surface-2:#efe7ff;
--text-dark:#24143f;

--glow:rgba(143,86,235,.28);
}

.health-profile-container{
min-height:100vh;
padding-bottom:40px;
background:
radial-gradient(circle at top right, rgba(143,86,235,.18), transparent 34%),
linear-gradient(180deg,#f8f4ff,#efe7ff);
}

.health-header{
height:265px;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;

border-bottom-left-radius:42px;
border-bottom-right-radius:42px;

position:relative;
overflow:hidden;

background:
linear-gradient(
135deg,
#2d0a54 0%,
#5b21b6 48%,
#8f56eb 100%
);

box-shadow:
0 18px 40px var(--glow),
0 4px 12px rgba(76,29,149,.16);
}

.health-header:before{
content:"";
position:absolute;
width:170px;
height:170px;
left:-50px;
bottom:-60px;
border-radius:50%;
background:rgba(255,255,255,.06);
}

.health-header:after{
content:"";
position:absolute;
width:200px;
height:200px;
right:-55px;
top:-70px;
border-radius:50%;
background:rgba(255,255,255,.09);
}

.back-btn{
position:absolute;
top:58px;
left:20px;
width:48px;
height:48px;

background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.22);
border-radius:16px;

backdrop-filter:blur(14px);

display:flex;
align-items:center;
justify-content:center;

box-shadow:
0 14px 28px rgba(0,0,0,.16),
inset 0 1px 0 rgba(255,255,255,.16);
}

.health-header-content{
display:flex;
flex-direction:column;
align-items:center;
gap:12px;
position:relative;
z-index:2;
}

.shield-icon{
width:78px;
height:78px;
border-radius:24px;

background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.22);

backdrop-filter:blur(14px);

display:flex;
align-items:center;
justify-content:center;

position:relative;

box-shadow:
0 14px 28px rgba(0,0,0,.16),
inset 0 1px 0 rgba(255,255,255,.14);
}

.shield-plus{
color:#c4b5fd;
}

.health-header h1{
font-size:30px;
font-weight:900;
color:white;
}

.health-header p{
font-size:14px;
font-weight:600;
color:#ddd6fe;
}

.health-body{
padding:28px 22px;
}

.form-section{
margin-bottom:26px;
padding:24px;
border-radius:30px;

background:
linear-gradient(
145deg,
rgba(255,255,255,.98),
rgba(243,235,255,.92)
);

border:1px solid rgba(143,86,235,.12);

box-shadow:
0 16px 32px rgba(143,86,235,.10),
inset 0 1px 0 rgba(255,255,255,.95);
}

.section-title{
display:flex;
align-items:center;
gap:12px;
margin-bottom:20px;
}

.section-icon{
color:var(--primary-600);
}

.section-title h3{
font-size:17px;
font-weight:900;
color:var(--text-dark);
}

.input-row{
display:flex;
gap:16px;
}

.input-group{
flex:1;
display:flex;
flex-direction:column;
gap:8px;
}

.input-group label,
.q-label{
font-size:13px;
font-weight:800;
color:var(--primary-700);
}

.input-field{
width:100%;
padding:15px 16px;

border-radius:16px;
border:1px solid rgba(143,86,235,.16);

background:
linear-gradient(
145deg,
#ffffff,
#f5eeff
);

font-size:14px;
font-weight:700;
color:var(--text-dark);

box-sizing:border-box;

box-shadow:
0 6px 14px rgba(143,86,235,.06),
inset 0 1px 0 rgba(255,255,255,.9);
}

.input-field:focus{
outline:none;
border-color:var(--primary-600);
box-shadow:0 0 0 4px rgba(143,86,235,.12);
}

.input-with-icon{
position:relative;
display:flex;
align-items:center;
}

.input-with-icon svg{
position:absolute;
left:16px;
color:#8f56eb;
}

.input-with-icon .input-field{
padding-left:48px;
}

.conditions-grid{
display:flex;
flex-wrap:wrap;
gap:10px;
}

.condition-tag{
padding:11px 16px;
border-radius:16px;
border:1px solid #ede9fe;

background:
linear-gradient(
145deg,
#ffffff,
#f5eeff
);

font-size:13px;
font-weight:700;
color:#5b21b6;

box-shadow:
0 6px 14px rgba(143,86,235,.06),
inset 0 1px 0 rgba(255,255,255,.9);

cursor:pointer;
transition:.2s;
}

.condition-tag:hover{
transform:translateY(-1px);
box-shadow:0 8px 18px rgba(143,86,235,.14);
}

.condition-tag.active{
background:
linear-gradient(
135deg,
#5b21b6,
#8f56eb
);
color:white;
box-shadow:
0 10px 22px rgba(143,86,235,.28);
}

.option-category{
margin-bottom:20px;
}

.option-category h4{
font-size:14px;
font-weight:900;
color:var(--text-dark);
margin-bottom:10px;
}

.family-history-grid{
display:flex;
flex-wrap:wrap;
gap:14px;
}

.family-history-card{
display:flex;
flex-direction:column;
gap:10px;
}

.family-history-grid .condition-tag{
padding:11px 16px;
font-size:13px;
font-weight:700;
}

.family-history-grid .condition-tag.active{
background:linear-gradient(
135deg,
#5b21b6,
#8f56eb
);
}

.relation-select{
padding:10px 12px;
font-size:13px;
font-weight:600;

min-width:155px;

border-radius:14px;
border:1px solid #ddd6fe;

background:white;
color:#5b21b6;

box-shadow:
0 4px 10px rgba(139,92,246,.08);
}

.other-input-box{
background:linear-gradient(145deg,#ffffff,#f5eeff);
border:1px solid #ede9fe;
border-radius:18px;
padding:16px;
display:flex;
gap:12px;
}

.other-textarea{
flex:1;
height:90px;
resize:none;
border:none;
outline:none;
background:transparent;
font-size:14px;
font-weight:600;
color:#312e81;
}

.toggle-row{
display:flex;
gap:10px;
}

.half-toggle{
flex:1;
align-items:flex-end;
}

.toggle-btn{
flex:1;
padding:13px;

border-radius:16px;
border:1px solid #ede9fe;

background:
linear-gradient(
145deg,
#ffffff,
#f5eeff
);

font-size:13px;
font-weight:800;
color:#5b21b6;
}

.toggle-btn.active{
background:
linear-gradient(
135deg,
#5b21b6,
#8f56eb
);
color:white;
box-shadow:
0 10px 22px rgba(143,86,235,.28);
}

.questionnaire-group{
margin-bottom:24px;
}

.top-gap{
margin-top:16px;
}

.next-btn{
height:62px;
width:100%;
margin-top:14px;

border:none;
border-radius:22px;

background:
linear-gradient(
135deg,
#2d0a54,
#5b21b6,
#8f56eb
);

color:white;
font-size:16px;
font-weight:900;

box-shadow:
0 18px 34px rgba(143,86,235,.28);
}

.next-btn:active{
transform:scale(.98);
}

.next-btn:disabled{
opacity:.6;
box-shadow:none;
}

.loading-screen{
height:100vh;
background:
linear-gradient(180deg,#f8f4ff,#efe7ff);

display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
gap:20px;

color:#7c3aed;
font-weight:800;
}

.spinner{
width:42px;
height:42px;

border:4px solid #ede9fe;
border-top:4px solid #8f56eb;

border-radius:50%;
animation:spin 1s linear infinite;
}

@keyframes spin{
0%{transform:rotate(0deg);}
100%{transform:rotate(360deg);}
}
`;
export default HealthProfilePage;