import React, { useState, useEffect } from 'react';
import { ChevronLeft, Droplets, BookOpen, Search, Pill, ChevronRight, Scale, Info, ScrollText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchLibrary } from '../services/api';

const LearnPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('library'); // 'library' or 'knowledge'

    useEffect(() => {
        const fetchInitial = async () => {
            setLoading(true);
            const initial = await searchLibrary('');
            setResults(initial);
            setLoading(false);
        };
        fetchInitial();
    }, []);

    const handleSearch = async (e) => {
        const q = e.target.value;
        setSearchQuery(q);
        if (activeTab !== 'library') setActiveTab('library');
        setLoading(true);
        const searchResults = await searchLibrary(q);
        setResults(searchResults);
        setLoading(false);
    };

    const referenceBooks = [
        { name: "Organon of Medicine", author: "Samuel Hahnemann", desc: "The philosophical foundation and principles of homeopathy." },
        { name: "Materia Medica Pura", author: "Samuel Hahnemann", desc: "Pure records of remedy provings and primary symptoms." },
        { name: "Boericke's Materia Medica", author: "William Boericke", desc: "Comprehensive clinical descriptions of 800+ remedies." },
        { name: "Allen's Keynotes", author: "H.C. Allen", desc: "Condensed 'keynote' symptoms for rapid remedy selection." }
    ];

    const healthPrinciples = [
        { title: "Avoid Strong Smells", desc: "Camphor, coffee, and strong perfumes can antidote remedies." },
        { title: "Clean Palate", desc: "Wait 30 minutes before/after eating before taking medicine." },
        { title: "The Holistic View", desc: "Homeopathy treats the person, not just the disease." }
    ];

    return (
        <div className="learn-container fade-in">
            <header className="learn-header gradient-bg">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="white" />
                </button>
                <div className="learn-header-content">
                    <h1>Knowledge Hub</h1>
                    <p className="subtitle">Explore libraries, principles and historical reference books.</p>
                </div>
                
                <div className="search-bar-container">
                    <Search size={20} color="#9ca3af" />
                    <input 
                        type="search" 
                        placeholder="Search medicines or symptoms..." 
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>

                <div className="tab-switcher">
                    <button className={activeTab === 'library' ? 'active' : ''} onClick={() => setActiveTab('library')}>Library</button>
                    <button className={activeTab === 'knowledge' ? 'active' : ''} onClick={() => setActiveTab('knowledge')}>Health Tips</button>
                </div>
            </header>

            <div className="learn-body">
                {activeTab === 'library' ? (
                    <div className="results-section">
                         {searchQuery === '' && (
                            <div className="info-cards-row">
                                <div className="mini-info-card" onClick={() => navigate('/philosophy')}>
                                    <Scale size={20} color="#3B82F6" />
                                    <span>Organon (§)</span>
                                </div>
                                <div className="mini-info-card">
                                    <Droplets size={20} color="#8B5CF6" />
                                    <span>Potency</span>
                                </div>
                            </div>
                        )}
                        <h3 className="section-title">
                            {searchQuery ? `Search Results (${results.length})` : 'Materia Medica (A-Z)'}
                        </h3>
                        
                        {loading ? (
                            <div className="loading-state">Consulting the archives...</div>
                        ) : (
                            <div className="remedy-list">
                                {results.map((rem, idx) => (
                                    <div 
                                        key={idx} 
                                        className="remedy-list-item slide-up"
                                        onClick={() => navigate(`/remedy-library/${encodeURIComponent(rem.name)}`, { state: rem })}
                                    >
                                        <div className="rem-icon pink">
                                            <Pill size={20} />
                                        </div>
                                        <div className="rem-info">
                                            <h4>{rem.name}</h4>
                                            <p>{rem.source || 'Historical Reference'}</p>
                                        </div>
                                        <ChevronRight size={18} color="#d1d5db" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="knowledge-section fade-in">
                        <section className="knowledge-block">
                            <h3 className="section-title"><BookOpen size={20} color="#8b5cf6" /> Reference Books</h3>
                            <div className="books-grid">
                                {referenceBooks.map((book, i) => (
                                    <div key={i} className="book-card">
                                        <h4>{book.name}</h4>
                                        <span className="author">{book.author}</span>
                                        <p>{book.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="knowledge-block" style={{marginTop: '32px'}}>
                            <h3 className="section-title"><ScrollText size={20} color="#10b981" /> Health Principles</h3>
                            {healthPrinciples.map((tip, i) => (
                                <div key={i} className="tip-card">
                                    <div className="tip-circle">{i+1}</div>
                                    <div className="tip-text">
                                        <h5>{tip.title}</h5>
                                        <p>{tip.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </section>
                    </div>
                )}
            </div>

            <style>{`
                .learn-header {
                    padding: 80px 24px 30px 24px;
                    border-bottom-left-radius: 40px; border-bottom-right-radius: 40px;
                    background: var(--dark-header); display: flex; flex-direction: column; align-items: center;
                }
                .back-btn { position: absolute; top: 60px; left: 20px; background: rgba(255,255,255,0.1); border: none; border-radius: 12px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; }
                .learn-header h1 { font-size: 28px; color: white; font-weight: 800; margin-bottom: 8px; }
                .subtitle { color: rgba(255,255,255,0.6); font-size: 13px; margin-bottom: 24px; text-align: center; }
                
                .search-bar-container { width: 100%; max-width: 340px; background: white; border-radius: 18px; padding: 14px 20px; display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-bottom: 24px; }
                .search-bar-container input { border: none; outline: none; font-size: 15px; width: 100%; }

                .tab-switcher { display: flex; background: rgba(255,255,255,0.05); border-radius: 100px; padding: 4px; gap: 4px; width: 100%; max-width: 280px; }
                .tab-switcher button { flex: 1; border: none; background: none; color: rgba(255,255,255,0.5); padding: 8px; border-radius: 100px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
                .tab-switcher button.active { background: white; color: var(--dark-header); }

                .learn-body { padding: 30px 24px; }
                .info-cards-row { display: flex; gap: 12px; margin-bottom: 24px; }
                .mini-info-card { flex: 1; background: white; padding: 16px; border-radius: 20px; display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; box-shadow: var(--shadow); cursor: pointer; }
                
                .section-title { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 800; color: #2F2E41; margin-bottom: 20px; }
                
                .remedy-list-item { background: white; padding: 16px; border-radius: 24px; display: flex; align-items: center; gap: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); cursor: pointer; margin-bottom: 12px; }
                .rem-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: #FFF1F2; color: #F43F5E; }
                .rem-info h4 { font-size: 16px; font-weight: 700; margin-bottom: 2px; }
                .rem-info p { font-size: 12px; color: #9CA3AF; }

                .books-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                .book-card { background: white; padding: 16px; border-radius: 20px; box-shadow: var(--shadow); }
                .book-card h4 { font-size: 14px; font-weight: 800; color: #8b5cf6; margin-bottom: 4px; }
                .book-card .author { font-size: 10px; display: block; color: #9ca3af; margin-bottom: 8px; font-weight: 700; }
                .book-card p { font-size: 11px; line-height: 1.4; color: #64748b; }

                .tip-card { background: white; padding: 16px; border-radius: 20px; display: flex; align-items: center; gap: 16px; margin-bottom: 12px; box-shadow: var(--shadow); }
                .tip-circle { width: 32px; height: 32px; border-radius: 50%; background: #DCFCE7; color: #10B981; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; flex-shrink: 0; }
                .tip-text h5 { font-size: 14px; font-weight: 800; color: #2F2E41; margin-bottom: 2px; }
                .tip-text p { font-size: 12px; color: #64748b; line-height: 1.4; }
            `}</style>
        </div>
    );
};

export default LearnPage;
