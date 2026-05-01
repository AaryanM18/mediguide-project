import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Bookmark, User, History } from 'lucide-react';

const BottomNav = () => {
    return (
        <nav className="bottom-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <div className="nav-icon-box">
                    <Home size={20} />
                    <span className="nav-text">Home</span>
                </div>
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <div className="nav-icon-box">
                    <History size={24} />
                    <span className="nav-text">History</span>
                </div>
            </NavLink>
            <NavLink to="/saved" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <div className="nav-icon-box">
                    <Bookmark size={24} />
                    <span className="nav-text">Saved</span>
                </div>
            </NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                <div className="nav-icon-box">
                    <User size={24} />
                    <span className="nav-text">Profile</span>
                </div>
            </NavLink>

            <style>{`
                .bottom-nav {
                    position: fixed;
                    bottom: 24px;
                    left: 24px;
                    right: 24px;
                    background: var(--dark-header);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 24px;
                    border-radius: 40px;
                    box-shadow: 0 10px 25px rgba(54, 53, 74, 0.4);
                    z-index: 1000;
                    max-width: 432px;
                    margin: 0 auto;
                }
                .nav-item {
                    color: #9ca3af;
                    text-decoration: none;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .nav-icon-box {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 18px;
                    border-radius: 30px;
                    transition: all 0.3s;
                }
                .nav-text {
                    display: none;
                    font-size: 14px;
                    font-weight: 600;
                }
                .nav-item.active {
                    color: white;
                }
                .nav-item.active .nav-icon-box {
                    background: var(--primary);
                }
                .nav-item.active .nav-text {
                    display: block;
                }
            `}</style>
        </nav>
    );
};

export default BottomNav;
