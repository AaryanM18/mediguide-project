import React, { useEffect, useState } from 'react';
import { ChevronLeft, Sparkles, AlertTriangle, ShieldCheck, Activity, Info } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSymptoms, performConsultation, getSavedRemedies, updateSavedRemedies } from '../services/api';

const SymptomAnalysisPage = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [symptomsData, setSymptomsData] = useState({});
    const [searchTerm, setSearchTerm] = useState(location.state?.prefilledSymptom || "");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedSymptom, setSelectedSymptom] = useState(location.state?.prefilledSymptom || "");
    const [selectedSeverity, setSelectedSeverity] = useState("");
    const [selectedSymptomsList, setSelectedSymptomsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(location.state?.savedResult || null);
    const [error, setError] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchSaved = async () => {
            const res = await getSavedRemedies(user.id);
            if (res.success && result?.remedy) {
                const name = result.remedy.name;
                setIsSaved(res.saved_remedies.some(r => (r.remedy?.name || r.name) === name));
            }
        };
        if (user?.id) fetchSaved();
    }, [result, user.id]);

    const toggleSave = async () => {
        if (!result) return;
        let saved = JSON.parse(localStorage.getItem(`saved_remedies_${user.id}`)) || [];
        const name = result.remedy.name;
        
        if (isSaved) {
            saved = saved.filter(r => (r.remedy?.name || r.name) !== name);
        } else {
            saved.push(result);
        }
        
        await updateSavedRemedies(user.id, saved);
        setIsSaved(!isSaved);
    };

    useEffect(() => {
        fetchSymptoms();
    }, []);

    const fetchSymptoms = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getSymptoms();
            if (data.symptoms) {
                setSymptomsData(data.symptoms);
            } else {
                setError(data.message || (data.detail && data.detail.error) || data.detail || "Failed to load symptoms");
            }
        } catch (err) {
            setError(err.message || "Failed to connect to backend");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSymptomToList = () => {
        if (!selectedSymptom || !selectedSeverity) return;
        setSelectedSymptomsList([...selectedSymptomsList, { symptom: selectedSymptom, severity: selectedSeverity }]);
        setSelectedSymptom("");
        setSearchTerm("");
        setSelectedSeverity("");
    };

    const handleRemoveSymptom = (index) => {
        const newList = [...selectedSymptomsList];
        newList.splice(index, 1);
        setSelectedSymptomsList(newList);
    };

    const handleAnalyze = async () => {
        const toAnalyze = selectedSymptom && selectedSeverity 
            ? [...selectedSymptomsList, { symptom: selectedSymptom, severity: selectedSeverity }] 
            : selectedSymptomsList;

        if (toAnalyze.length === 0) return;
        
        try {
            setAnalyzing(true);
            setError(null);
            const data = await performConsultation(user.id, toAnalyze);
            if (data.success) {
                setResult(data);
            } else {
                setError(data.message || (data.detail && data.detail.error) || data.detail || "No remedy found for this combination");
            }
        } catch (err) {
            setError(err.message || "Consultation failed");
            console.error(err);
        } finally {
            setAnalyzing(false);
        }
    };

    const reset = () => {
        if (location.state?.savedResult) {
            navigate(-1);
            return;
        }
        setResult(null);
        setSelectedSymptom("");
        setSearchTerm("");
        setSelectedSeverity("");
        setSelectedSymptomsList([]);
    };

    const allSymptoms = Object.keys(symptomsData);
    const filteredSymptoms = searchTerm.length >= 3 
        ? allSymptoms.filter(sym => sym.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    // If viewing saved entry, no need to show loading symptoms
    if (loading && !result) return <div className="loader">Loading symptoms...</div>;

    return (
        <div className="analysis-container fade-in">
            <header className="analysis-header gradient-bg">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="white" />
                </button>
                <div className="analysis-header-content">
                    <h1>Symptom Analysis</h1>
                </div>
            </header>

            <div className="analysis-body">
                {!result ? (
                    <>
                        {selectedSymptomsList.length > 0 && (
                            <div className="premium-card fade-in" style={{padding: '16px 20px', marginBottom: '16px'}}>
                                <div className="section-head-row" style={{marginBottom: '4px'}}>
                                    <Activity size={20} color="#10b981" />
                                    <h2 style={{fontSize: '16px'}}>Symptoms Added ({selectedSymptomsList.length})</h2>
                                </div>
                                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px'}}>
                                    {selectedSymptomsList.map((s, i) => (
                                        <div key={i} style={{background: '#f1f5f9', padding: '8px 12px', borderRadius: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', fontWeight: '600'}}>
                                            <span><span style={{textTransform: 'capitalize'}}>{s.symptom}</span> ({s.severity})</span>
                                            <button onClick={() => handleRemoveSymptom(i)} style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, display: 'flex'}}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <section className="input-section premium-card fade-in" style={{ position: 'relative', zIndex: 50 }}>
                            <div className="section-head-row">
                                <Activity size={24} color="#8b5cf6" />
                                <h2>Select Symptom</h2>
                            </div>
                            <p className="subtext">Choose the main issue you are experiencing.</p>
                            
                            {error && <div className="error-message"><AlertTriangle size={18}/> {error}</div>}

                            <div className="autocomplete-wrapper">
                                <input 
                                    type="text"
                                    className="premium-select" 
                                    placeholder="Type symptom (min 3 letters)..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setShowDropdown(true);
                                        if (e.target.value !== selectedSymptom) {
                                            setSelectedSymptom("");
                                            setSelectedSeverity("");
                                        }
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                    disabled={!!error || allSymptoms.length === 0}
                                />
                                {showDropdown && searchTerm.length >= 3 && (
                                    <ul className="autocomplete-dropdown">
                                        {filteredSymptoms.map(sym => (
                                            <li key={sym} onMouseDown={(e) => {
                                                e.preventDefault();
                                                setSelectedSymptom(sym);
                                                setSearchTerm(sym);
                                                setSelectedSeverity("");
                                                setShowDropdown(false);
                                            }}>
                                                {sym}
                                            </li>
                                        ))}
                                        {filteredSymptoms.length === 0 && (
                                            <li className="no-result">No matching symptoms found</li>
                                        )}
                                    </ul>
                                )}
                            </div>
                        </section>

                        {selectedSymptom && symptomsData[selectedSymptom] && (
                            <section className="input-section premium-card fade-in delay-1">
                                <div className="section-head-row">
                                    <AlertTriangle size={24} color="#f59e0b" />
                                    <h2>Intensity Level</h2>
                                </div>
                                <p className="subtext">How severe is the {selectedSymptom}?</p>
                                <div className="severity-grid">
                                    {symptomsData[selectedSymptom].map(sev => {
                                        const getPct = (s) => {
                                            if (s.includes('mild')) return '10-30%';
                                            if (s.includes('moderate')) return '40-60%';
                                            if (s.includes('high')) return '70-90%';
                                            if (s.includes('severe')) return '90-100%';
                                            return '';
                                        };
                                        const pct = getPct(sev.toLowerCase());
                                        return (
                                            <button 
                                                key={sev} 
                                                className={`severity-btn premium-btn-outline ${selectedSeverity === sev ? 'active' : ''}`}
                                                onClick={() => setSelectedSeverity(sev)}
                                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <span>{sev.charAt(0).toUpperCase() + sev.slice(1)}</span>
                                                {pct && <span style={{fontSize: '11px', marginTop: '4px', opacity: 0.7}}>{pct}</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                {selectedSeverity && (
                                    <button 
                                        className="add-sym-btn"
                                        onClick={handleAddSymptomToList}
                                        style={{width: '100%', marginTop: '16px', padding: '14px', borderRadius: '16px', background: 'transparent', color: '#8b5cf6', border: '2px dashed #cbd5e1', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'}}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                                        Add Another Symptom
                                    </button>
                                )}
                            </section>
                        )}

                        <button 
                            className="btn btn-primary analyze-btn" 
                            disabled={(selectedSymptomsList.length === 0 && (!selectedSymptom || !selectedSeverity)) || analyzing}
                            onClick={handleAnalyze}
                        >
                            {analyzing ? "Analyzing..." : "Get AI Advice"}
                        </button>
                    </>
                ) : (
                    <div className="result-view fade-in">
                        <div className="result-header" style={{ position: 'relative' }}>
                            <button 
                                onClick={toggleSave}
                                style={{ position: 'absolute', top: 0, right: 0, padding: '8px', background: 'none', border: 'none', cursor: 'pointer', color: isSaved ? '#8b5cf6' : '#cbd5e1', transition: 'all 0.2s' }}
                            >
                                <svg width="32" height="32" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                            </button>
                            <Sparkles size={40} color="#8b5cf6" />
                            <h2>Recommended Remedy</h2>
                            <p className="remedy-name">{result.remedy.name}</p>
                            <div style={{display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px'}}>
                                <span className="potency-badge">{result.remedy.potency}</span>
                                <span className="source-badge">Source: {result.remedy.source_book || 'Classic Reference'}</span>
                            </div>
                        </div>

                        <div className="result-info-stack">

    <div className="info-card condition-card">
        <Activity size={20} color="#8b5cf6" />
        <h5>Possible Condition</h5>
        <p>{result.remedy.possible_condition}</p>
    </div>

    <div className="info-card why-card">
        <Info size={20} color="#8b5cf6" />
        <h5>Why this medicine?</h5>

        <div className="why-scroll">
            <p>
                {result.remedy.why_this_remedy || result.remedy.remedy_reason}
            </p>
        </div>

    </div>

</div>

                        {result.patient_safety.warnings.length > 0 && (
                            <div className="safety-section">
                                <h3><ShieldCheck size={20} color="#8b5cf6" /> Health Profile Assessment</h3>
                                <div className="warnings-list">
                                    {result.patient_safety.warnings.map((w, i) => (
                                        <p key={i} className="warning-text" style={{ borderLeftColor: w.includes('✅') || w.includes('ℹ️') ? (w.includes('✅') ? '#10b981' : '#3b82f6') : '#ef4444' }}>{w}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="lifestyle-section">
                            <h3><ShieldCheck size={18} /> Lifestyle Advice</h3>
                            <div className="advice-card">
                                <h5>Dietary Restrictions</h5>
                                <p>{result.remedy.lifestyle?.dietary_restrictions || "Warm water; avoid cold drinks; light food."}</p>
                            </div>
                            <div className="advice-card">
                                <h5>What to avoid</h5>
                                <p>{result.remedy.lifestyle?.what_to_avoid || "Coffee / Camphor / Mint / Strong smells"}</p>
                            </div>
                        </div>

                        <button className="reset-btn" onClick={reset}>
                            {location.state?.savedResult ? "Back to Saved Remedies" : "Analyze Another Symptom"}
                        </button>
                    </div>
                )}
            </div>
            <style>{`

:root{
--primary-950:#1e0738;
--primary-900:#2d0a54;
--primary-800:#4c1d95;
--primary-700:#6d28d9;
--primary-600:#8f56eb;
--primary-400:#c4b5fd;
--primary-300:#ddd6fe;
--glow:rgba(143,86,235,.28);
}

.analysis-container{
min-height:100vh;
padding-bottom:50px;

background:
radial-gradient(circle at top right,
rgba(143,86,235,.18),
transparent 34%),
linear-gradient(
180deg,
#f8f4ff,
#efe7ff
);
}

/* HEADER */

.analysis-header{
padding:78px 24px 34px;

border-bottom-left-radius:42px;
border-bottom-right-radius:42px;

background:
linear-gradient(
135deg,
#2d0a54 0%,
#5b21b6 45%,
#8f56eb 100%
);

position:relative;
overflow:hidden;

box-shadow:
0 18px 40px var(--glow),
0 4px 12px rgba(76,29,149,.16);

margin-bottom:28px;
}

.analysis-header:after{
content:"";
position:absolute;
width:190px;
height:190px;
right:-60px;
top:-70px;
border-radius:50%;
background:rgba(255,255,255,.08);
}

.analysis-header:before{
content:"";
position:absolute;
width:150px;
height:150px;
left:-50px;
bottom:-70px;
border-radius:50%;
background:rgba(255,255,255,.05);
}

.back-btn{
position:absolute;
top:58px;
left:20px;

width:46px;
height:46px;

background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.22);

border-radius:15px;
backdrop-filter:blur(14px);

display:flex;
align-items:center;
justify-content:center;

box-shadow:
0 14px 28px rgba(0,0,0,.16),
inset 0 1px 0 rgba(255,255,255,.16);

z-index:2;
}

.analysis-header-content{
display:flex;
justify-content:center;
}

.analysis-header h1{
font-size:30px;
font-weight:900;
color:white;
margin-top:18px;
z-index:2;
position:relative;
}

/* BODY */

.analysis-body{
padding:24px 20px;
}

/* CARDS */

.premium-card{
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
0 18px 34px rgba(143,86,235,.10),
inset 0 1px 0 rgba(255,255,255,.95);

margin-bottom:24px;

animation:slideUp .45s ease both;
}

.section-head-row{
display:flex;
align-items:center;
gap:12px;
margin-bottom:10px;
}

.section-head-row h2{
font-size:18px;
font-weight:900;
color:#24143f;
}

.subtext{
font-size:14px;
font-weight:600;
color:#7c3aed;
margin-bottom:18px;
}

/* INPUT */

.autocomplete-wrapper{
position:relative;
}

.premium-select{
width:100%;
padding:16px 18px;

border-radius:18px;
border:1px solid #ede9fe;

background:
linear-gradient(
145deg,
#ffffff,
#f5eeff
);

font-size:15px;
font-weight:700;
color:#312e81;
outline:none;
}

.premium-select:focus{
border-color:#8f56eb;
box-shadow:
0 0 0 4px rgba(143,86,235,.12);
}

.autocomplete-dropdown{
position:absolute;
top:calc(100% - 2px);
width:100%;

background:white;
border:1px solid #ede9fe;
border-top:none;

border-bottom-left-radius:18px;
border-bottom-right-radius:18px;

overflow-y:auto;
max-height:240px;

list-style:none;
padding:0;
margin:0;

z-index:50;

box-shadow:
0 12px 24px rgba(0,0,0,.06);
}

.autocomplete-dropdown li{
padding:14px 18px;
font-size:14px;
font-weight:700;
color:#4c1d95;
border-bottom:1px solid #f3f4f6;
}

/* SYMPTOM TAGS */

.add-sym-btn{
border:2px dashed #c4b5fd !important;
background:#faf7ff !important;
color:#7c3aed !important;
font-weight:900 !important;
}

.add-sym-btn:hover{
background:#f4efff !important;
}

/* SEVERITY */

.severity-grid{
display:grid;
grid-template-columns:repeat(3,1fr);
gap:12px;
}

.premium-btn-outline{
padding:15px 8px;

border-radius:18px;

background:
linear-gradient(
145deg,
#ffffff,
#f5eeff
);

border:1px solid #ede9fe;

font-size:14px;
font-weight:800;

color:#5b21b6;
}

.premium-btn-outline.active{
background:
linear-gradient(
135deg,
#5b21b6,
#8f56eb
);

color:white;
border:none;

box-shadow:
0 12px 24px rgba(143,86,235,.25);
}

/* MAIN CTA */

.analyze-btn{
height:62px;
width:100%;

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

/* RESULT VIEW */

.result-header{
padding:30px;
border-radius:34px;

background:
linear-gradient(
135deg,
#2d0a54,
#5b21b6,
#8f56eb
);

color:white;

box-shadow:
0 24px 48px rgba(143,86,235,.34);

margin-bottom:26px;
position:relative;
overflow:hidden;
}

.result-header:after{
content:"";
position:absolute;
width:150px;
height:150px;
right:-40px;
top:-40px;
border-radius:50%;
background:rgba(255,255,255,.08);
}

.remedy-name{
font-size:32px;
font-weight:900;
margin:12px 0;
color:white;
}

.potency-badge{
padding:8px 14px;
border-radius:100px;

background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.18);

font-size:12px;
font-weight:800;
color:white;
}

.source-badge{
padding:8px 14px;
border-radius:100px;

background:rgba(255,255,255,.12);

font-size:11px;
font-weight:800;
color:#ddd6fe;
}

/* INFO GRID */

.result-info-stack{
display:flex;
flex-direction:column;
gap:14px;
margin-bottom:28px;
}

.condition-card{
min-height:110px;
}

.why-card{
padding-bottom:18px;
background:
linear-gradient(
145deg,
rgba(255,255,255,.98),
rgba(243,235,255,.92)
) !important;
color:#312e81 !important;
border:1px solid rgba(143,86,235,.12);
box-shadow:0 10px 22px rgba(143,86,235,.08);
}

.why-card h5{
color:#7c3aed !important;
}

.why-card p{
color:#334155 !important;
}

.why-scroll{
max-height:240px;
overflow-y:auto;
padding-right:8px;
margin-top:10px;
}

.why-scroll::-webkit-scrollbar{
width:5px;
}

.why-scroll::-webkit-scrollbar-thumb{
background:#c4b5fd;
border-radius:10px;
}

.why-scroll p{
font-size:14px;
line-height:1.7;
}

.info-card{
padding:22px;
border-radius:26px;

background:
linear-gradient(
145deg,
var(--primary-900),
var(--primary-600)
);

color:white;

box-shadow:
0 18px 40px var(--glow);
}

.info-card h5{
font-size:12px;
margin:8px 0 6px;
color:#ddd6fe;
}

.info-card p{
font-size:14px;
line-height:1.55;
color:#f3f4f6;
}

/* WARNINGS */

.warning-text{
padding:16px;
border-radius:18px;
background:white;
box-shadow:
0 8px 18px rgba(143,86,235,.07);
}

.safety-section{
margin-top:30px;
}

.safety-section h3,
.lifestyle-section h3{
font-size:22px;
font-weight:900;
color:#33324f;
margin-bottom:12px;
}

/* LIFESTYLE */

.advice-card{
padding:24px 22px;
margin-bottom:18px;

border-radius:24px;

background:
linear-gradient(
145deg,
rgba(255,255,255,.98),
rgba(243,235,255,.92)
);

border-left:4px solid #34d399;

box-shadow:
0 10px 20px rgba(143,86,235,.07);
}
.advice-card h4{
font-size:16px;
font-weight:800;
margin-bottom:10px;
line-height:1.4;
}

.advice-card p{
font-size:15px;
line-height:1.7;
color:#4b5563;
}

.lifestyle-section h3{
margin-bottom:18px;
}

/* RESET */

.reset-btn{
width:100%;
padding:18px;

border-radius:22px;

background:transparent;
border:2px solid #8f56eb;

color:#7c3aed;
font-size:15px;
font-weight:900;
}

/* STATES */

.error-message{
background:#fff1f2;
border:1px solid #fecdd3;
color:#dc2626;

padding:13px 14px;
border-radius:16px;

display:flex;
gap:8px;
align-items:center;

font-weight:700;
margin-bottom:16px;
}

.loader{
height:100vh;
display:flex;
align-items:center;
justify-content:center;

background:
linear-gradient(180deg,#f8f4ff,#efe7ff);

font-weight:900;
color:#7c3aed;
}

@keyframes slideUp{
from{
opacity:0;
transform:translateY(18px);
}
to{
opacity:1;
transform:translateY(0);
}
}

@media(max-width:420px){

.analysis-body{
padding:20px 16px;
}

.premium-card{
padding:18px;
border-radius:26px;
}


.severity-grid{
grid-template-columns:repeat(2,1fr);
}

}

`}</style>
        </div>
    );
};

export default SymptomAnalysisPage;
