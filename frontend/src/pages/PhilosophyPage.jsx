import React, { useState, useEffect } from 'react';
import { ChevronLeft, Scale, Search, Book } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPhilosophy } from '../services/api';

const PhilosophyPage = () => {
    const navigate = useNavigate();
    const [aphorisms, setAphorisms] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const data = await getPhilosophy();
            setAphorisms(data);
            setLoading(false);
        };
        fetch();
    }, []);

    const filtered = aphorisms.filter(a => 
        a.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.id.toString().includes(searchQuery)
    );

    return (
        <div className="philosophy-container fade-in">
            <header className="philosophy-header gradient-bg">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="white" />
                </button>
                <div className="phi-header-content">
                    <Scale size={40} color="white" />
                    <h1>Organon of Medicine</h1>
                    <p>The philosophical foundation of Homeopathy by Samuel Hahnemann.</p>
                </div>
                
                <div className="phi-search">
                    <Search size={18} color="#9ca3af" />
                    <input 
                        type="text" 
                        placeholder="Search aphorisms (e.g. § 1)..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            <div className="philosophy-body">
                {loading ? (
                    <div className="phi-loading">Consulting the Organon...</div>
                ) : (
                    <div className="aphorism-list">
                        {filtered.map((a, idx) => (
                            <div key={idx} className="aphorism-card slide-up">
                                <div className="phi-id">§ {a.id}</div>
                                <p className="phi-text">{a.text}</p>
                            </div>
                        ))}
                        {filtered.length === 0 && <div className="phi-none">No aphorisms found.</div>}
                    </div>
                )}
            </div>

            <style>{`
                .philosophy-container {
                    min-height: 100vh;
                    background: #F3F4F6;
                }
                .philosophy-header {
                    padding: 80px 24px 40px 24px;
                    background: #1F2937;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    border-bottom-left-radius: 40px;
                    border-bottom-right-radius: 40px;
                    position: relative;
                }
                .back-btn {
                    position: absolute;
                    top: 60px;
                    left: 20px;
                    background: rgba(255,255,255,0.1);
                    border: none;
                    border-radius: 12px;
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
                .phi-header-content {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 24px;
                }
                .phi-header-content h1 {
                    font-size: 24px;
                    color: white;
                    margin: 12px 0 4px 0;
                    font-weight: 800;
                }
                .phi-header-content p {
                    color: rgba(255,255,255,0.6);
                    font-size: 13px;
                    max-width: 280px;
                    line-height: 1.4;
                }

                .phi-search {
                    width: 100%;
                    max-width: 320px;
                    background: white;
                    border-radius: 16px;
                    padding: 12px 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                .phi-search input {
                    border: none;
                    outline: none;
                    flex: 1;
                    font-size: 14px;
                    font-weight: 600;
                }

                .philosophy-body {
                    padding: 24px;
                }
                .phi-loading, .phi-none {
                    text-align: center;
                    padding: 40px;
                    color: #9ca3af;
                }
                
                .aphorism-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .aphorism-card {
                    background: white;
                    padding: 24px;
                    border-radius: 24px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
                }
                .phi-id {
                    display: inline-block;
                    background: #F3F4F6;
                    color: #4B5563;
                    padding: 4px 12px;
                    border-radius: 8px;
                    font-weight: 800;
                    font-size: 13px;
                    margin-bottom: 12px;
                }
                .phi-text {
                    font-size: 14px;
                    color: #374151;
                    line-height: 1.6;
                    font-weight: 500;
                }
            `}</style>
        </div>
    );
};

export default PhilosophyPage;
