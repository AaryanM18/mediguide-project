import React from 'react';
import { ChevronLeft, Search, Mic, Scan, Activity, Thermometer, Brain, Heart, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SymptomSearchPage = () => {
    const navigate = useNavigate();

    const quickSearches = [
        { name: "Headache", icon: <Thermometer size={24} color="#F87171" />, color: "red" },
        { name: "Cold", icon: <Activity size={24} color="#60A5FA" />, color: "blue" },
        { name: "Anxiety", icon: <Heart size={24} color="#34D399" />, color: "green" },
        { name: "Digestive", icon: <Brain size={24} color="#FBBF24" />, color: "yellow" }
    ];

    return (
        <div className="search-page-container fade-in">
            <header className="search-header gradient-bg">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="white" />
                </button>
                <div className="search-header-content">
                    <h1>Describe Symptoms</h1>
                    <div className="search-icon-bg">
                        <Search size={80} color="rgba(255,255,255,0.1)" />
                    </div>
                </div>
            </header>

            <div className="search-body">
                <section className="search-intro">
                    <h2>How are you feeling?</h2>
                    <p>You can describe multiple symptoms. Let our AI find the common diagnosis.</p>
                </section>

                <section className="common-searches">
                    <h3>Common Searches</h3>
                    <div className="quick-grid">
                        {quickSearches.map((s, i) => (
                            <div key={i} className="quick-card">
                                <div className="quick-icon-box">
                                   {s.icon}
                                </div>
                                <span>{s.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="search-input-section">
                    <div className="main-search-card">
                        <div className="input-row">
                            <Mic size={24} color="#9ca3af" />
                            <textarea 
                                placeholder="Search or describe symptoms (e.g. slight fever tonight)..."
                                className="search-textarea"
                            />
                            <div className="scan-icon-box">
                                <Scan size={24} color="#8b5cf6" />
                            </div>
                        </div>
                        
                        <button className="btn-save-list">
                            <PlusCircle size={20} />
                            Save Symptom to List
                        </button>
                    </div>

                    <button className="btn btn-primary analyze-now" onClick={() => navigate('/find')}>
                        Analyze Now
                    </button>
                </div>
            </div>

            <style>{`
                .search-page-container {
                    padding-bottom: 40px;
                }
                .search-header {
                    height: 240px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border-bottom-left-radius: 40px;
                    border-bottom-right-radius: 40px;
                    position: relative;
                    overflow: hidden;
                    background: var(--dark-header);
                }
                .back-btn {
                    position: absolute;
                    top: 60px;
                    left: 20px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    z-index: 10;
                }
                .search-header h1 {
                    font-size: 32px;
                    color: white;
                    z-index: 2;
                    font-weight: 800;
                    margin-top: 40px;
                }
                .search-icon-bg {
                    position: absolute;
                    right: -20px;
                    top: 40px;
                    transform: rotate(15deg);
                }

                .search-body {
                    padding: 32px 24px;
                }
                .search-intro {
                    margin-bottom: 40px;
                }
                .search-intro h2 {
                    font-size: 26px;
                    color: #2F2E41;
                    margin-bottom: 12px;
                }
                .search-intro p {
                    font-size: 14px;
                    color: #9ca3af;
                    line-height: 1.6;
                    font-weight: 500;
                }

                .common-searches h3 {
                    font-size: 14px;
                    color: #2F2E41;
                    margin-bottom: 20px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .quick-grid {
                    display: flex;
                    gap: 16px;
                    overflow-x: auto;
                    padding-bottom: 20px;
                    margin-bottom: 20px;
                }
                .quick-grid::-webkit-scrollbar { display: none; }

                .quick-card {
                    min-width: 100px;
                    background: white;
                    padding: 24px 16px;
                    border-radius: 24px;
                    border: none;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }
                .quick-icon-box {
                    width: 50px;
                    height: 50px;
                    background: #f9fafb;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .quick-card span {
                    font-size: 12px;
                    font-weight: 700;
                    color: #2F2E41;
                }

                .main-search-card {
                    background: white;
                    border-radius: 30px;
                    padding: 24px;
                    box-shadow: var(--shadow);
                    margin-bottom: 32px;
                }
                .input-row {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    padding: 16px;
                    background: #f4f3f7;
                    border-radius: 20px;
                    margin-bottom: 24px;
                }
                .search-textarea {
                    flex: 1;
                    background: none;
                    border: none;
                    resize: none;
                    height: 80px;
                    font-family: inherit;
                    font-size: 15px;
                    color: #2F2E41;
                    outline: none;
                }
                .scan-icon-box {
                    width: 44px;
                    height: 44px;
                    background: white;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 10px rgba(139, 92, 246, 0.1);
                }

                .btn-save-list {
                    width: 100%;
                    padding: 18px;
                    background: var(--dark-header);
                    color: white;
                    border: none;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .analyze-now {
                    padding: 20px;
                    border-radius: 20px;
                    font-size: 16px;
                    font-weight: 700;
                    background: var(--primary);
                    color: white;
                    border: none;
                    width: 100%;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
                }
            `}</style>
        </div>
    );
};

export default SymptomSearchPage;
