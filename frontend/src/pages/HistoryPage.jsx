import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Clock, Bookmark, ChevronRight, Search, Activity, Trash2, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getConsultationHistory } from '../services/api';

const HistoryPage = ({ user }) => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'saved'

    useEffect(() => {
        const fetchHistory = async () => {
            const data = await getConsultationHistory(user.id);
            if (data.history) {
                setHistory(data.history.reverse());
            }
            setLoading(false);
        };
        fetchHistory();
    }, [user.id]);

    const filteredHistory = history.filter(item => {
        const name = item.remedy_name || "";
        const symptoms = item.symptom || "";
        const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             symptoms.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || (filter === 'saved' && item.is_saved);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="history-container fade-in">
            <header className="history-header gradient-bg">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="white" />
                </button>
                <div className="history-header-content">
                    <h1>Health Records</h1>
                    <p>Track your homeopathic consultation history</p>
                </div>

                <div className="search-and-filter">
                    <div className="search-minimal">
                        <Search size={18} color="#9ca3af" />
                        <input 
                            type="text" 
                            placeholder="Search symptoms..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="filter-pill" onClick={() => setFilter(filter === 'all' ? 'saved' : 'all')}>
                        <Filter size={16} color={filter === 'saved' ? '#8b5cf6' : '#9ca3af'} />
                        <span style={{color: filter === 'saved' ? '#8b5cf6' : '#4b5563'}}>
                            {filter === 'saved' ? 'Saved' : 'Filter'}
                        </span>
                    </div>
                </div>
            </header>

            <div className="history-body">
                {loading ? (
                    <div className="loading-state">Accessing medical records...</div>
                ) : (
                    <div className="history-list">
                        {filteredHistory.length > 0 ? (
                            filteredHistory.map((item, idx) => (
                                <div key={idx} className="history-card slide-up" onClick={() => navigate(`/remedy/${item.remedy_name}`, { state: item })}>
                                    <div className="card-top">
                                        <div className="severity-dot" style={{ background: item.severity === 'high' ? '#ef4444' : (item.severity === 'moderate' ? '#f59e0b' : '#34d399') }}></div>
                                        <span className="timestamp">{item.created_at || 'Recent'}</span>
                                        {item.is_saved && <Bookmark size={14} fill="#8b5cf6" color="#8b5cf6" className="saved-icon" />}
                                    </div>
                                    <div className="card-main">
                                        <div className="symptom-info">
                                            <h3>{item.symptom}</h3>
                                            <p className="remedy-preview">{item.remedy_name} {item.potency}</p>
                                        </div>
                                        <button className="view-details">
                                            <ChevronRight size={20} color="#d1d5db" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-history">
                                <Activity size={64} color="#e5e7eb" strokeWidth={1} />
                                <p>No records found matching your search.</p>
                                <button className="start-btn" onClick={() => navigate('/find')}>Get a Consultation</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                .history-header {
                    padding: 80px 24px 30px 24px;
                    border-bottom-left-radius: 40px; border-bottom-right-radius: 40px;
                    background: var(--dark-header); position: relative;
                }
                .back-btn { position: absolute; top: 60px; left: 20px; background: rgba(255,255,255,0.1); border: none; border-radius: 12px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; }
                .history-header h1 { font-size: 28px; color: white; font-weight: 800; margin-bottom: 4px; }
                .history-header p { color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 24px; }

                .search-and-filter { display: flex; gap: 12px; margin-top: 20px; }
                .search-minimal { flex: 1; background: white; border-radius: 100px; padding: 12px 16px; display: flex; align-items: center; gap: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                .search-minimal input { border: none; outline: none; font-size: 14px; width: 100%; }
                .filter-pill { background: white; border-radius: 100px; padding: 0 16px; display: flex; align-items: center; gap: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); cursor: pointer; }
                .filter-pill span { font-size: 12px; font-weight: 700; }

                .history-body { padding: 30px 24px; }
                .history-list { display: flex; flex-direction: column; gap: 16px; padding-bottom: 20px; }
                
                .history-card { background: white; border-radius: 24px; padding: 20px; box-shadow: var(--shadow); cursor: pointer; border-left: 4px solid transparent; }
                .card-top { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
                .severity-dot { width: 8px; height: 8px; border-radius: 50%; }
                .timestamp { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; }
                .saved-icon { margin-left: auto; }

                .card-main { display: flex; justify-content: space-between; align-items: center; }
                .symptom-info h3 { font-size: 16px; font-weight: 800; color: #2F2E41; margin-bottom: 4px; }
                .remedy-preview { font-size: 13px; color: #8b5cf6; font-weight: 700; }

                .no-history { text-align: center; padding: 60px 20px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
                .no-history p { color: #9ca3af; font-weight: 600; font-size: 14px; }
                .start-btn { background: var(--primary); color: white; border: none; padding: 14px 28px; border-radius: 16px; font-weight: 700; cursor: pointer; }
                
                .loading-state { text-align: center; padding: 40px; color: #9ca3af; font-weight: 600; }
            `}</style>
        </div>
    );
};

export default HistoryPage;
