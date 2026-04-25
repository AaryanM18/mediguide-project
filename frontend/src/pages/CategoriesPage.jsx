import React, { useState, useEffect } from 'react';
import { ChevronLeft, Brain, ThermometerSun, Leaf, ScanHeart, Droplets, Wind, User, Activity, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSymptoms } from '../services/api';

const CategoriesPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const iconMap = {
        "Head": <Brain size={24} />,
        "Fever": <ThermometerSun size={24} />,
        "Stomach": <Leaf size={24} />,
        "Skin": <ScanHeart size={24} />,
        "Eyes": <Droplets size={24} />,
        "Respiratory": <Wind size={24} />,
        "Male": <User size={24} />,
        "Female": <User size={24} />,
        "Nose": <Activity size={24} />,
        "Mouth": <Activity size={24} />,
        "Throat": <Activity size={24} />,
        "Chest": <Wind size={24} />,
    };

    const colorMap = {
        "Head": "pink",
        "Fever": "red",
        "Stomach": "light-green",
        "Skin": "blue",
        "Eyes": "purple",
        "Respiratory": "orange",
        "Male": "blue",
        "Female": "pink",
        "Default": "green"
    };

    useEffect(() => {
        const fetch = async () => {
            const data = await getSymptoms();
            if (data.symptoms) {
                // Get unique possible_condition or category from the dataset
                // Since our new dataset uses categories as keys in api.js:getSymptoms
                const uniqueCats = Object.keys(data.symptoms).map(cat => ({
                    name: cat,
                    icon: iconMap[cat] || <Activity size={24} />,
                    color: colorMap[cat] || colorMap["Default"]
                }));
                setCategories(uniqueCats);
            }
            setLoading(false);
        };
        fetch();
    }, []);

    return (
        <div className="categories-page-container fade-in">
            <header className="categories-header gradient-bg">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="white" />
                </button>
                <div className="categories-header-content">
                    <h1>Quick Categories</h1>
                    <p>Find remedies by body part or condition</p>
                </div>
            </header>

            <div className="categories-body">
                {loading ? (
                    <div className="loading-state">Organizing categories...</div>
                ) : (
                    <div className="categories-grid-all">
                        {categories.map((cat, i) => (
                            <div 
                                key={i} 
                                className="cat-card-all slide-up" 
                                onClick={() => navigate('/analyze', { state: { prefilledSymptom: cat.name } })}
                            >
                                <div className={`cat-icon-lg ${cat.color}`}>
                                    {cat.icon}
                                </div>
                                <h3>{cat.name}</h3>
                                <p>Symptom Matching</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                .categories-header {
                    padding: 80px 24px 40px 24px;
                    border-bottom-left-radius: 40px;
                    border-bottom-right-radius: 40px;
                    background: var(--dark-header);
                    text-align: center;
                    position: relative;
                }
                .back-btn {
                    position: absolute; top: 60px; left: 20px;
                    background: rgba(255,255,255,0.1);
                    border: none; border-radius: 12px;
                    width: 44px; height: 44px;
                    display: flex; align-items: center; justify-content: center;
                }
                .categories-header h1 { font-size: 28px; color: white; font-weight: 800; margin-bottom: 4px; }
                .categories-header p { color: rgba(255,255,255,0.6); font-size: 14px; }

                .categories-body { padding: 24px; }
                .categories-grid-all {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
                }

                .cat-card-all {
                    background: white; border-radius: 30px; padding: 24px 20px;
                    box-shadow: var(--shadow); border: none;
                    display: flex; flex-direction: column; align-items: center;
                    text-align: center; cursor: pointer; transition: transform 0.2s;
                }
                .cat-card-all:active { transform: scale(0.95); }

                .cat-icon-lg {
                    width: 64px; height: 64px; border-radius: 20px;
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 16px;
                }
                .cat-icon-lg.pink { background: #FCE7F3; color: #DB2777; }
                .cat-icon-lg.red { background: #FEE2E2; color: #DC2626; }
                .cat-icon-lg.light-green { background: #DCFCE7; color: #16A34A; }
                .cat-icon-lg.blue { background: #E0F2FE; color: #0284C7; }
                .cat-icon-lg.purple { background: #F5F3FF; color: #8B5CF6; }
                .cat-icon-lg.orange { background: #FFF7ED; color: #F59E0B; }
                .cat-icon-lg.green { background: #ECFDF5; color: #10B981; }

                .cat-card-all h3 { font-size: 16px; font-weight: 800; color: #2F2E41; margin-bottom: 4px; }
                .cat-card-all p { font-size: 11px; color: #9CA3AF; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

                .loading-state { text-align: center; padding: 40px; color: #9CA3AF; font-weight: 600; }
            `}</style>
        </div>
    );
};

export default CategoriesPage;
