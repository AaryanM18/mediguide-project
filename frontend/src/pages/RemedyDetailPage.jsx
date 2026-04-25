import React, { useState, useEffect } from 'react';
import { ChevronLeft, X, Bookmark, BookmarkCheck, Droplets, BarChart3, HelpCircle, ChevronRight, BookOpen, ShieldCheck, Info } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateSavedRemedies, getSavedRemedies } from '../services/api';

const RemedyDetailPage = ({ user }) => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [remedyData, setRemedyData] = useState(location.state || {
        remedy_name: "Loading...",
        potency: "30C",
        symptoms: "Consultation"
    });
    
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const checkSaved = async () => {
            const res = await getSavedRemedies(user.id);
            if (res.success) {
                const name = remedyData.remedy_name || remedyData.name;
                if (res.saved_remedies.some(r => (r.remedy?.name || r.name) === name)) {
                    setIsSaved(true);
                }
            }
        };
        checkSaved();
    }, [remedyData, user.id]);

    const toggleSave = async () => {
        let saved = JSON.parse(localStorage.getItem(`saved_remedies_${user.id}`)) || [];
        const name = remedyData.remedy_name || remedyData.name;
        if (isSaved) {
            saved = saved.filter(r => (r.remedy?.name || r.name) !== name);
        } else {
            saved.push({ name: name, potency: remedyData.potency });
        }
        await updateSavedRemedies(user.id, saved);
        setIsSaved(!isSaved);
    };

    return (
        <div className="remedy-detail-container fade-in">
            <header className="header-actions">
                <button className="icon-btn" onClick={() => navigate(-1)}><X size={24} /></button>
                <div className="spacer"></div>
                <h2>Remedy Insight</h2>
                <div className="spacer"></div>
                <button className={`icon-btn ${isSaved ? 'saved' : ''}`} onClick={toggleSave}>
                    {isSaved ? <BookmarkCheck size={24} color="white" /> : <Bookmark size={24} />}
                </button>
            </header>

            <div className="remedy-card-main">
                <div className="remedy-icon-lg">
                    <div className="inner-remedy-icon">
                        <div className="bottle-icon">+</div>
                    </div>
                </div>
                
                <div className="remedy-title-section">
                    <h1>{remedyData.remedy_name || remedyData.name}</h1>
                    <p>Referenced for: {remedyData.symptoms || "Symptom Cluster"}</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon-bg purple">
                            <Info size={20} />
                        </div>
                        <div className="stat-value">{remedyData.severity?.toUpperCase() || 'MODERATE'}</div>
                        <div className="stat-label">Intensity Level</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon-bg red">
                            <Droplets size={20} />
                        </div>
                        <div className="stat-value">{remedyData.potency}</div>
                        <div className="stat-label">Recommended Potency</div>
                    </div>
                </div>

                <div className="remedy-section">
                    <div className="section-head">
                        <h3><ShieldCheck size={20} color="#8b5cf6" /> Medical Rationale</h3>
                    </div>
                    <div className="overview-content">
                        <p>
                            {remedyData.remedy_reason || remedyData.why_this_remedy || `This remedy is historically indicated for patients manifesting these symptoms accurately. In classic Materia Medica, it matches the constitutional and emotional profile presented.`}
                        </p>
                        <button 
                            className="full-library-btn" 
                            onClick={() => navigate(`/remedy-library/${encodeURIComponent(remedyData.remedy_name || remedyData.name)}`)}
                        >
                            <BookOpen size={16} />
                            <span>View Full Materia Medica Info</span>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="remedy-section">
                    <div className="section-head">
                        <h3><Info size={20} color="#10b981" /> Consultation Notes</h3>
                    </div>
                    <div className="matched-symptom-tag">
                        <HelpCircle size={20} color="#8b5cf6" />
                        <span>Source: {remedyData.source_book || "Historical Clinical Archives"}</span>
                    </div>
                </div>
            </div>

            <style>{`
                header h2 { font-size: 16px; font-weight: 800; color: #374151; }
                .remedy-detail-container { min-height: 100vh; padding-bottom: 40px; display: flex; flex-direction: column; }
                .header-actions { padding: 60px 24px 32px 24px; display: flex; align-items: center; justify-content: space-between; }
                .icon-btn { background: var(--dark-header); border: none; border-radius: 12px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; color: white; cursor: pointer; transition: all 0.2s; }
                .icon-btn.saved { background: var(--primary); }
                .spacer { flex: 1; }
                .remedy-card-main { flex: 1; background: white; margin: 0 16px; border-radius: 40px; padding: 40px 24px; display: flex; flex-direction: column; align-items: center; box-shadow: var(--shadow); margin-bottom: 24px; }
                .remedy-icon-lg { width: 100px; height: 100px; background: #F5F3FF; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 30px; }
                .inner-remedy-icon { width: 60px; height: 60px; background: #A78BFA; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
                .bottle-icon { color: white; font-size: 30px; font-weight: 800; }
                .remedy-title-section { text-align: center; margin-bottom: 32px; }
                .remedy-title-section h1 { font-size: 28px; color: #2F2E41; margin-bottom: 4px; font-weight: 800; }
                .remedy-title-section p { color: #9ca3af; font-size: 13px; font-weight: 600; }
                .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; width: 100%; margin-bottom: 32px; }
                .stat-card { background: white; border-radius: 20px; padding: 20px 16px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                .stat-icon-bg { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px auto; }
                .stat-icon-bg.purple { background: #F5F3FF; color: #8B5CF6; }
                .stat-icon-bg.red { background: #FFF1F2; color: #F43F5E; }
                .stat-value { font-size: 15px; font-weight: 800; color: #2F2E41; margin-bottom: 2px; }
                .stat-label { font-size: 10px; color: #9ca3af; font-weight: 700; text-transform: uppercase; }
                .remedy-section { width: 100%; margin-bottom: 24px; }
                .section-head h3 { display: flex; align-items: center; gap: 8px; font-size: 16px; color: #2F2E41; margin-bottom: 12px; font-weight: 800; }
                .overview-content p { font-size: 14px; color: #6B7280; line-height: 1.6; margin-bottom: 16px; }
                .full-library-btn { display: flex; align-items: center; gap: 10px; width: 100%; padding: 14px; background: #F3F4F6; border: none; border-radius: 14px; color: #4B5563; font-size: 12px; font-weight: 700; cursor: pointer; }
                .full-library-btn span { flex: 1; text-align: left; }
                .matched-symptom-tag { display: flex; align-items: center; gap: 12px; padding: 14px; background: #F5F3FF; border-radius: 14px; color: #2F2E41; font-size: 12px; font-weight: 700; }
            `}</style>
        </div>
    );
};

export default RemedyDetailPage;
