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

                        <div className="result-info-grid">
                            <div className="info-card">
                                <Activity size={20} color="#8b5cf6" />
                                <h5>Possible Condition</h5>
                                <p>{result.remedy.possible_condition}</p>
                            </div>
                            <div className="info-card" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                <Info size={20} color="#8b5cf6" />
                                <h5>Why this? {result.remedy.name}?</h5>
                                <p style={{fontSize: '13px'}}>{result.remedy.why_this_remedy || result.remedy.remedy_reason}</p>
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
                .analysis-header {
                    height: 160px; display: flex; align-items: center; justify-content: center;
                    border-bottom-left-radius: 40px; border-bottom-right-radius: 40px;
                    position: relative; margin-bottom: 24px; background: var(--dark-header);
                }
                .back-btn { position: absolute; top: 60px; left: 20px; background: none; border: none; cursor: pointer; }
                .analysis-header h1 { font-size: 28px; color: white; margin-top: 20px; }

                .analysis-body { padding: 24px; }
                .premium-card {
                    background: white;
                    border-radius: 24px;
                    padding: 24px;
                    box-shadow: 0 10px 30px rgba(139, 92, 246, 0.08);
                    margin-bottom: 24px;
                    border: 1px solid rgba(139, 92, 246, 0.1);
                }
                .section-head-row {
                    display: flex; align-items: center; gap: 12px; margin-bottom: 8px;
                }
                .section-head-row h2 {
                    font-size: 18px; color: #2F2E41; margin: 0; font-weight: 800;
                }
                .subtext {
                    font-size: 14px; color: #9ca3af; margin-bottom: 20px;
                }
                
                .autocomplete-wrapper {
                    position: relative;
                }
                .premium-select {
                    width: 100%;
                    appearance: none;
                    background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 16px;
                    padding: 16px 20px; font-size: 16px; font-weight: 600; color: #334155;
                    outline: none; transition: all 0.3s ease; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
                }
                .premium-select:focus {
                    border-color: #8b5cf6; background: white; box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
                }
                
                .autocomplete-dropdown {
                    position: absolute; width: 100%; max-height: 250px; overflow-y: auto;
                    background: white; border: 2px solid #e2e8f0; border-top: none;
                    border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;
                    z-index: 20; padding: 0; margin: 0; list-style: none;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05); top: calc(100% - 2px);
                }
                .autocomplete-dropdown li {
                    padding: 14px 20px; font-size: 15px; color: #334155; font-weight: 500;
                    cursor: pointer; transition: background 0.2s; border-bottom: 1px solid #f1f5f9;
                }
                .autocomplete-dropdown li:last-child { border-bottom: none; }
                .autocomplete-dropdown li:hover { background: #f8fafc; color: #8b5cf6; }
                .autocomplete-dropdown .no-result { color: #9ca3af; text-align: center; cursor: default; }
                .autocomplete-dropdown .no-result:hover { background: white; color: #9ca3af; }
                
                .severity-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
                .premium-btn-outline {
                    padding: 16px 8px; border-radius: 16px; background: white; font-weight: 700; font-size: 15px;
                    color: #64748b; cursor: pointer; transition: all 0.2s; border: 2px solid #e2e8f0;
                }
                .premium-btn-outline.active {
                    background: #8b5cf6; color: white; border-color: #8b5cf6; box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3); transform: translateY(-2px);
                }

                .analyze-btn { height: 64px; border-radius: 20px; margin-top: 10px; background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white; width: 100%; border: none; font-size: 18px; font-weight: 800; cursor: pointer; box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4); text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s; }
                .analyze-btn:disabled { opacity: 0.5; box-shadow: none; cursor: not-allowed; transform: none; }

                .error-message {
                    background: #fee2e2; color: #ef4444; padding: 12px; border-radius: 12px;
                    display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600;
                    margin-bottom: 16px;
                }

                .result-view { text-align: center; }
                .result-header { margin-bottom: 32px; }
                .remedy-name { font-size: 28px; font-weight: 800; color: var(--dark-header); margin: 8px 0; }
                .potency-badge {
                    display: inline-block; padding: 6px 16px; background: white; box-shadow: 0 2px 6px rgba(0,0,0,0.05);
                    color: var(--primary); border-radius: 100px; font-weight: 700; font-size: 14px;
                }
                .source-badge {
                    display: inline-block; padding: 6px 16px; background: #FFF1F2;
                    color: #F43F5E; border-radius: 100px; font-weight: 700; font-size: 12px;
                }

                .result-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
                .info-card {
                    background: white; padding: 20px; border-radius: 24px; text-align: left;
                    box-shadow: var(--shadow); border: none;
                }
                .info-card h5 { font-size: 12px; color: #9ca3af; margin: 8px 0 4px 0; }
                .info-card p { font-size: 14px; color: #2f2e41; font-weight: 600; line-height: 1.4; }

                .safety-section, .lifestyle-section {
                    text-align: left; margin-bottom: 32px;
                }
                .safety-section h3, .lifestyle-section h3 {
                    display: flex; align-items: center; gap: 8px; font-size: 18px; margin-bottom: 16px; color: #2f2e41;
                }
                .warning-text {
                    background: white; border-left: 4px solid #ef4444; color: #334155; padding: 16px; border-radius: 16px;
                    font-size: 14px; font-weight: 500; margin-bottom: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    line-height: 1.5;
                }
                .advice-card {
                    background: white; padding: 16px; border-radius: 16px; margin-bottom: 12px;
                    border-left: 4px solid #10b981; box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }
                .advice-card h5 { font-size: 13px; color: #10b981; margin-bottom: 6px; font-weight: 700; }
                .advice-card p { font-size: 14px; color: #334155; line-height: 1.5; }
                
                .reset-btn {
                    width: 100%;
                    padding: 18px;
                    border-radius: 20px;
                    background: transparent;
                    border: 2px solid #8b5cf6;
                    color: #8b5cf6;
                    font-size: 16px;
                    font-weight: 700;
                    cursor: pointer;
                    margin-top: 16px;
                    transition: all 0.3s;
                }
                .reset-btn:active {
                    background: #f5f3ff;
                    transform: scale(0.98);
                }
            `}</style>
        </div>
    );
};

export default SymptomAnalysisPage;
