import React, { useEffect, useState } from 'react';
import { User, Activity, Lightbulb, Folder, Brain, ThermometerSun, Leaf, ScanHeart, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getHealthFacts } from '../services/api';

const HomePage = ({ user }) => {
    const navigate = useNavigate();
    const [factIndex, setFactIndex] = useState(0);

    const [facts, setFacts] = useState([
        "Homeopathy works on the principle of 'Like Cures Like'.",
        "It is one of the most widely used systems of medicine in the world."
    ]);

    useEffect(() => {
        const fetchFacts = async () => {
            const data = await getHealthFacts();
            if (data && data.length > 0) setFacts(data);
        };
        fetchFacts();
        if (localStorage.getItem('is_new') === 'true') {
            localStorage.removeItem('is_new');
            navigate('/health-profile');
        }
    }, [navigate]);

    useEffect(() => {
        const timer = setInterval(() => {
            setFactIndex(prev => (prev + 1) % facts.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [facts.length]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning,";
        if (hour < 18) return "Good Afternoon,";
        if (hour < 22) return "Good Evening,";
        return "Good Night,";
    };

    return (
        <div className="home-container fade-in">
            <header className="home-header">
                <div className="header-text">
                    <p>{getGreeting()}</p>
                    <h1>{user.name.split(' ')[0]} 👋</h1>
                </div>
                <div className="header-avatar" onClick={() => navigate('/profile')}>
                    <User size={24} color="white" />
                </div>
            </header>

            <div className="home-content">
                <div className="section-header">
                    <h2>Health Actions</h2>
                    <span onClick={() => navigate('/health-profile')}>See all</span>
                </div>

                <div className="bento-grid">
                    <div className="bento-large gradient-bg" onClick={() => navigate('/find')}>
                        <Activity size={32} color="white" />
                        <div className="bento-text">
                            <h3>Analyze Symptoms</h3>
                            <p>AI-powered remedy matching</p>
                        </div>
                    </div>
                    <div className="bento-side-col">
                        <div className="bento-small orange" onClick={() => navigate('/learn')}>
                            <Lightbulb size={24} color="white" />
                            <h3>Health Tips</h3>
                        </div>
                        <div className="bento-small green" onClick={() => navigate('/history')}>
                            <Folder size={24} color="white" />
                            <h3>Records</h3>
                        </div>
                    </div>
                </div>

                <div className="section-header">
                    <h2>Quick Categories</h2>
                    <span onClick={() => navigate('/categories')}>See all</span>
                </div>

                <div className="cat-row">
                    <div className="cat-item" onClick={() => navigate('/analyze', { state: { prefilledSymptom: 'headache' } })}>
                        <div className="cat-icon pink"><Brain size={24} /></div>
                        <span>Headache</span>
                    </div>
                    <div className="cat-item" onClick={() => navigate('/analyze', { state: { prefilledSymptom: 'fever' } })}>
                        <div className="cat-icon red"><ThermometerSun size={24} /></div>
                        <span>Fever</span>
                    </div>
                    <div className="cat-item" onClick={() => navigate('/analyze', { state: { prefilledSymptom: 'stomach pain' } })}>
                        <div className="cat-icon light-green"><Leaf size={24} /></div>
                        <span>Stomach</span>
                    </div>
                    <div className="cat-item" onClick={() => navigate('/analyze', { state: { prefilledSymptom: 'skin rash' } })}>
                        <div className="cat-icon blue"><ScanHeart size={24} /></div>
                        <span>Skin</span>
                    </div>
                </div>

                <div className="section-header">
                    <h2>Health Records</h2>
                    <span onClick={() => navigate('/history')}>View History</span>
                </div>

                <div className="info-card dark clickable-fact" onClick={() => setFactIndex((prev) => (prev + 1) % facts.length)}>
                    <div className="info-content">
                        <span className="label">
                            Did you know? <span className="tap-hint">(Tap to change)</span>
                        </span>
                        <p className="fade-text" key={factIndex}>{facts[factIndex]}</p>
                        <div className="fact-dots">
                            {facts.map((_, i) => (
                                <span key={i} className={`dot ${i === factIndex ? 'active' : ''}`}></span>
                            ))}
                        </div>
                    </div>
                    <BookOpen size={48} className="bg-icon" />
                </div>
            </div>

            <style>{`
                .home-container {
                    padding-bottom: 40px;
                }
                .home-header {
                    background: var(--dark-header);
                    color: white;
                    padding: 40px 24px 30px;
                    border-bottom-left-radius: 40px;
                    border-bottom-right-radius: 40px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .header-text p {
                    font-size: 14px;
                    color: #d1d5db;
                    margin-bottom: 4px;
                }
                .header-text h1 {
                    font-size: 28px;
                    font-weight: 800;
                    margin: 0;
                }
                .header-avatar {
                    width: 50px;
                    height: 50px;
                    background: var(--primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
                    cursor: pointer;
                }

                .home-content {
                    padding: 0 24px;
                    margin-top: 24px;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                    margin-top: 24px;
                }
                .section-header h2 {
                    font-size: 18px;
                    color: var(--text-main);
                    font-weight: 700;
                }
                .section-header span {
                    font-size: 13px;
                    color: var(--primary);
                    font-weight: 600;
                    cursor: pointer;
                }

                .bento-grid {
                    display: flex;
                    gap: 16px;
                }
                .bento-large {
                    flex: 1.2;
                    border-radius: 28px;
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    color: white;
                    min-height: 180px;
                    cursor: pointer;
                    box-shadow: 0 10px 20px -5px rgba(139, 92, 246, 0.3);
                }
                .bento-large .bento-text h3 {
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 4px;
                }
                .bento-large .bento-text p {
                    font-size: 12px;
                    opacity: 0.9;
                }
                
                .bento-side-col {
                    flex: 0.8;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .bento-small {
                    flex: 1;
                    border-radius: 24px;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    cursor: pointer;
                    text-align: center;
                    gap: 8px;
                }
                .bento-small.orange {
                    background: #fbbf24;
                    box-shadow: 0 8px 16px -4px rgba(251, 191, 36, 0.3);
                }
                .bento-small.green {
                    background: #34d399;
                    box-shadow: 0 8px 16px -4px rgba(52, 211, 153, 0.3);
                }
                .bento-small h3 {
                    font-size: 14px;
                    font-weight: 700;
                }

                .cat-row {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 16px;
                }
                .cat-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                }
                .cat-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .cat-icon.pink { background: #fce7f3; color: #db2777; }
                .cat-icon.red { background: #fee2e2; color: #dc2626; }
                .cat-icon.light-green { background: #dcfce7; color: #16a34a; }
                .cat-icon.blue { background: #e0f2fe; color: #0284c7; }
                
                .cat-item span {
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--text-main);
                }

                .info-card {
                    border-radius: 24px;
                    padding: 24px;
                    position: relative;
                    overflow: hidden;
                    margin-bottom: 80px;
                }
                .info-card.dark {
                    background: var(--dark-header);
                    color: white;
                }
                .info-content .label {
                    font-size: 12px;
                    color: #a78bfa;
                    font-weight: 600;
                    margin-bottom: 8px;
                    display: block;
                }
                .info-content p {
                    font-size: 15px;
                    font-weight: 500;
                    width: 80%;
                    line-height: 1.4;
                }
                .bg-icon {
                    position: absolute;
                    right: -10px;
                    bottom: -10px;
                    color: rgba(255,255,255,0.1);
                }
                .clickable-fact {
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .clickable-fact:active {
                    transform: scale(0.98);
                }
                .tap-hint {
                    opacity: 0.5;
                    font-size: 10px;
                    font-weight: normal;
                    margin-left: 6px;
                }
                .fade-text {
                    animation: fadeIn 0.5s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fact-dots {
                    display: flex;
                    gap: 6px;
                    margin-top: 16px;
                }
                .fact-dots .dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.2);
                    transition: all 0.3s;
                }
                .fact-dots .dot.active {
                    background: white;
                    width: 16px;
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
};

export default HomePage;
