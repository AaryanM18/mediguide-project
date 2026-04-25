import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, AtSign, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const LoginPage = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const data = await loginUser(email, password);
        setError('');
        onLogin(email, data.name);
    } catch (err) {
        setError(err.message || "Network error connecting to backend server.");
        if (err.message === "User not found") {
            setError("Invalid ID. Redirecting to signup...");
            setTimeout(() => navigate('/signup'), 1500);
        }
    }
  };

  return (
    <div className="login-wrapper fade-in">
        <div className="logo-section">
            <div className="logo-circle">
                <Sparkles size={40} color="#8b5cf6" className="sparkle-main" />
            </div>
            <h1>MediGuide AI</h1>
            <p>Your Personal Homeo Advisor</p>
        </div>

        <div className="login-card">
            <h2>Welcome Back</h2>
            {error && (
                <div style={{background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontSize: '14px', textAlign: 'center', fontWeight: '600'}}>
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <AtSign size={20} className="input-icon" />
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address" 
                        required
                    />
                </div>

                <div className="input-group">
                    <Lock size={20} className="input-icon" />
                    <input 
                        type={showPassword ? "text" : "password"} 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password" 
                        required
                    />
                    <button 
                        type="button" 
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="forgot-password">
                    <a href="#">Forgot Password?</a>
                </div>

                <button type="submit" className="btn-dark">Log In</button>
            </form>
        </div>

        <div className="signup-link">
            New here? <span onClick={() => navigate('/signup')}>Create an Account</span>
        </div>

        <style>{`
            .login-wrapper {
                padding: 40px 24px;
                display: flex;
                flex-direction: column;
                align-items: center;
                min-height: 100vh;
                position: relative;
                z-index: 1;
            }
            .logo-section {
                margin-top: 60px;
                margin-bottom: 40px;
                text-align: center;
            }
            .logo-circle {
                width: 90px;
                height: 90px;
                background: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 24px;
                box-shadow: 0 4px 20px rgba(139, 92, 246, 0.15);
            }
            .sparkle-main { margin-top: -4px; margin-right: -4px; }
            .logo-section h1 {
                font-size: 28px;
                color: #33324f;
                font-weight: 800;
                margin-bottom: 4px;
            }
            .logo-section p {
                color: #6b7280;
                font-size: 14px;
                font-weight: 500;
            }

            .login-card {
                background: white;
                border-radius: 32px;
                padding: 32px 24px;
                width: 100%;
                box-shadow: var(--shadow);
            }
            .login-card h2 {
                text-align: center;
                font-size: 20px;
                color: #33324f;
                margin-bottom: 24px;
                font-weight: 700;
            }

            .input-group {
                position: relative;
                margin-bottom: 16px;
            }
            .input-icon {
                position: absolute;
                left: 16px;
                top: 50%;
                transform: translateY(-50%);
                color: #9ca3af;
            }
            .input-group input {
                width: 100%;
                padding: 16px 16px 16px 48px;
                border-radius: 16px;
                border: none;
                background: #f4f3f7;
                font-size: 15px;
                outline: none;
                transition: all 0.2s;
                font-weight: 500;
                color: #33324f;
            }
            .input-group input:focus {
                background: white;
                box-shadow: 0 0 0 2px var(--primary-light);
            }
            
            .toggle-password {
                position: absolute;
                right: 16px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
            }

            .forgot-password {
                text-align: right;
                margin-bottom: 24px;
            }
            .forgot-password a {
                color: var(--primary);
                text-decoration: none;
                font-size: 13px;
                font-weight: 600;
            }

            .btn-dark {
                width: 100%;
                padding: 18px;
                border-radius: 16px;
                border: none;
                background: var(--dark-header);
                color: white;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: opacity 0.2s;
            }
            .btn-dark:active { opacity: 0.8; }

            .signup-link {
                margin-top: auto;
                font-size: 14px;
                color: #6b7280;
                padding-bottom: 20px;
            }
            .signup-link span {
                color: var(--primary);
                font-weight: 600;
                cursor: pointer;
            }
        `}</style>
    </div>
  );
};

export default LoginPage;
