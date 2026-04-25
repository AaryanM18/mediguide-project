import React, { useState, useEffect } from 'react';
import { ChevronLeft, Info, BookOpen, ScrollText } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getRemedyDetails } from '../services/api';

const LibraryDetailPage = () => {
    const { name } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [remedy, setRemedy] = useState(location.state || null);
    const [loading, setLoading] = useState(!location.state);

    useEffect(() => {
        if (!remedy) {
            const fetchDetails = async () => {
                const data = await getRemedyDetails(decodeURIComponent(name));
                setRemedy(data);
                setLoading(false);
            };
            fetchDetails();
        }
    }, [name, remedy]);

    if (loading) return <div className="loading-full">Opening Archives...</div>;
    if (!remedy) return <div className="error-full">Remedy not found in library.</div>;

    return (
        <div className="library-detail-container fade-in">
            <header className="library-detail-header gradient-bg">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="white" />
                </button>
                <div className="rem-header-icon-box">
                    <ScrollText size={40} color="white" />
                </div>
                <h1>{remedy.name}</h1>
                <div className="source-badge">
                    <BookOpen size={14} />
                    <span>{remedy.source || 'Classic Reference'}</span>
                </div>
            </header>

            <div className="library-detail-body">
                {remedy.details.map((detail, idx) => (
                    <div key={idx} className="detail-section card slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                        <div className="detail-category">
                            <Info size={18} color="#8B5CF6" />
                            <h3>{detail.category}</h3>
                        </div>
                        <div className="detail-description">
                            <p>{detail.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .library-detail-container {
                    min-height: 100vh;
                    background: #F9FAFB;
                }
                .library-detail-header {
                    padding: 80px 24px 60px 24px;
                    background: var(--dark-header);
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
                .rem-header-icon-box {
                    width: 80px;
                    height: 80px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                    backdrop-filter: blur(10px);
                }
                .library-detail-header h1 {
                    font-size: 32px;
                    color: white;
                    font-weight: 800;
                    margin-bottom: 12px;
                    text-align: center;
                }
                .source-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255,255,255,0.15);
                    padding: 6px 16px;
                    border-radius: 100px;
                    color: white;
                    font-size: 12px;
                    font-weight: 600;
                }

                .library-detail-body {
                    padding: 30px 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .detail-section.card {
                    background: white;
                    padding: 24px;
                    border-radius: 30px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                }
                .detail-category {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #f3f4f6;
                }
                .detail-category h3 {
                    font-size: 16px;
                    color: #1F2937;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .detail-description p {
                    font-size: 15px;
                    color: #4B5563;
                    line-height: 1.7;
                    font-weight: 500;
                }

                .loading-full, .error-full {
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    color: #9ca3af;
                }
            `}</style>
        </div>
    );
};

export default LibraryDetailPage;
