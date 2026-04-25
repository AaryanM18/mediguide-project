import React, { useState, useEffect } from 'react';
import { ChevronLeft, Bookmark, ArrowRight, Beaker } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSavedRemedies } from '../services/api';

const SavedPage = ({ user }) => {
    const navigate = useNavigate();
    const [savedRemedies, setSavedRemedies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSaved = async () => {
            setLoading(true);
            const res = await getSavedRemedies(user.id);
            if (res.success) {
                setSavedRemedies(res.saved_remedies);
            }
            setLoading(false);
        };
        if (user?.id) fetchSaved();
    }, [user.id]);

    return (
        <div className="saved-page fade-in">
            <header className="saved-header gradient-bg">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="white" />
                </button>
                <div className="header-content">
                    <h1>Saved Remedies</h1>
                    <p>{savedRemedies.length} saved</p>
                </div>
            </header>

            <div className="saved-body">
                {loading ? (
                    <div className="empty-state">
                        <div className="spinner"></div>
                        <p>Loading saved remedies...</p>
                    </div>
                ) : savedRemedies.length === 0 ? (
                    <div className="empty-state">
                        <Bookmark size={48} color="#cbd5e1" />
                        <h3>No Saved Remedies</h3>
                        <p>Remedies you bookmark will appear here.</p>
                        <button className="btn btn-primary mt-4" onClick={() => navigate('/find')}>Find Remedies</button>
                    </div>
                ) : (
                    <div className="saved-list">
                        {savedRemedies.map((remedy, index) => (
                            <div key={index} className="saved-card" onClick={() => navigate(`/remedy/${remedy.remedy?.name || remedy.name}`, { state: remedy })}>
                                <div className="card-icon">
                                    <Beaker size={24} color="#8b5cf6" />
                                </div>
                                <div className="card-info">
                                    <h3>{remedy.remedy?.name || remedy.name}</h3>
                                    <p>{remedy.remedy?.potency || remedy.potency}</p>
                                </div>
                                <ArrowRight size={20} color="#9ca3af" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .saved-header {
                    height: 200px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border-bottom-left-radius: 40px;
                    border-bottom-right-radius: 40px;
                    position: relative;
                }
                .back-btn {
                    position: absolute;
                    top: 60px;
                    left: 20px;
                    background: none;
                    border: none;
                    cursor: pointer;
                }
                .header-content {
                    text-align: center;
                    color: white;
                    margin-top: 40px;
                }
                .header-content h1 { font-size: 28px; font-weight: 800; margin-bottom: 4px; }
                .header-content p { font-size: 14px; opacity: 0.9; }

                .saved-body {
                    padding: 32px 24px;
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 60px 0;
                    color: #64748b;
                }
                .empty-state h3 { margin-top: 16px; margin-bottom: 8px; color: #334155; font-size: 20px; }
                .mt-4 { margin-top: 24px; padding: 12px 24px; border-radius: 20px; }

                .saved-card {
                    background: white;
                    border-radius: 20px;
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 16px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    cursor: pointer;
                }
                .card-icon {
                    width: 48px;
                    height: 48px;
                    background: #f5f3ff;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .card-info { flex: 1; }
                .card-info h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
                .card-info p { font-size: 13px; color: #64748b; }
            `}</style>
        </div>
    );
};

export default SavedPage;
