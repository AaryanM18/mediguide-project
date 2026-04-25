import React, { useState, useEffect } from 'react';
import { ChevronLeft, User, Mail, Calendar, Settings, Shield, History, LogOut, Heart, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPatientProfile } from '../services/api';

const ProfilePage = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const data = await getPatientProfile(user.id);
            if (data.success) {
                setProfile(data.patient);
            }
            setLoading(false);
        };
        fetch();
    }, [user.id]);

    return (
        <div className="profile-container fade-in">
            <header className="profile-header gradient-bg">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="white" />
                </button>
                <div className="profile-avatar-big">
                    <User size={40} color="white" />
                </div>
                <h1>{user.name}</h1>
                <p className="email-label">{user.id}</p>
            </header>

            <div className="profile-body">
                {/* Health Snapshot Card */}
                {!loading && profile && (
                    <div className="snapshot-card slide-up">
                        <div className="snapshot-item">
                            <Calendar size={16} color="#8b5cf6" />
                            <span>{profile.age} Years</span>
                        </div>
                        <div className="snapshot-item">
                            <Activity size={16} color="#ef4444" />
                            <span>{profile.blood_group || 'O+'}</span>
                        </div>
                        <div className="snapshot-item">
                            <Heart size={16} color="#f43f5e" />
                            <span>{profile.thermal || 'Chilly'} sensitive</span>
                        </div>
                    </div>
                )}

                <div className="menu-group">
                    <div className="menu-item" onClick={() => navigate('/health-profile')}>
                        <div className="menu-icon purple"><Shield size={20} /></div>
                        <span>My Health Profile</span>
                        <ChevronLeft size={18} className="rotate-180" />
                    </div>
                    <div className="menu-item" onClick={() => navigate('/history')}>
                        <div className="menu-icon blue"><History size={20} /></div>
                        <span>Consultation History</span>
                        <ChevronLeft size={18} className="rotate-180" />
                    </div>
                    <div className="menu-item">
                        <div className="menu-icon orange"><Settings size={20} /></div>
                        <span>Settings</span>
                        <ChevronLeft size={18} className="rotate-180" />
                    </div>
                </div>

                <button className="logout-btn" onClick={() => { onLogout(); navigate('/login'); }}>
                    <LogOut size={20} />
                    <span>Log Out</span>
                </button>
            </div>

            <style>{`
                .profile-header {
                    padding: 80px 24px 40px 24px;
                    border-bottom-left-radius: 40px; border-bottom-right-radius: 40px;
                    background: var(--dark-header); text-align: center; position: relative;
                }
                .back-btn { position: absolute; top: 60px; left: 20px; background: rgba(255,255,255,0.1); border: none; border-radius: 12px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; }
                .profile-avatar-big {
                    width: 90px; height: 90px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 10px 20px rgba(139, 92, 246, 0.4); border: 4px solid white;
                }
                .profile-header h1 { font-size: 24px; color: white; font-weight: 800; margin-bottom: 4px; }
                .email-label { color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 500; }

                .profile-body { padding: 30px 24px; }
                
                .snapshot-card { background: white; border-radius: 24px; padding: 20px; display: flex; justify-content: space-around; margin-top: -60px; box-shadow: var(--shadow); margin-bottom: 32px; border: 1px solid #f3f4f6; position: relative; z-index: 10; }
                .snapshot-item { display: flex; flex-direction: column; align-items: center; gap: 8px; }
                .snapshot-item span { font-size: 13px; font-weight: 700; color: #374151; }

                .menu-group { display: flex; flex-direction: column; gap: 12px; }
                .menu-item { background: white; padding: 18px 20px; border-radius: 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
                .menu-item:active { transform: scale(0.98); }
                .menu-icon { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
                .menu-icon.purple { background: #F5F3FF; color: #8B5CF6; }
                .menu-icon.blue { background: #EFF6FF; color: #3B82F6; }
                .menu-icon.orange { background: #FFF7ED; color: #F59E0B; }
                .menu-item span { flex: 1; font-weight: 700; font-size: 15px; color: #374151; }
                .rotate-180 { transform: rotate(180deg); color: #d1d5db; }

                .logout-btn { width: 100%; margin-top: 40px; padding: 18px; border-radius: 20px; border: 1px solid #fee2e2; background: #FFF1F2; color: #ef4444; font-weight: 800; font-size: 15px; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; }
                .logout-btn:active { background: #FEE2E2; }
            `}</style>
        </div>
    );
};

export default ProfilePage;
