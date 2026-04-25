import React, { useState } from 'react';
import { Eye, EyeOff, UserPlus, User, Mail, Lock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signupUser, registerPatient } from '../services/api';

const SignupPage = ({ onSignup }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'M',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const parseBackendError = (err) => {
    if (!err) return 'Unknown error';

    if (typeof err === 'string') return err;

    if (err.message && typeof err.message === 'string') {
      if (!err.message.includes('[object Object]')) {
        return err.message;
      }
    }

    if (Array.isArray(err.detail)) {
      return err.detail.map((e) => e.msg || JSON.stringify(e)).join(', ');
    }

    if (typeof err.detail === 'string') {
      return err.detail;
    }

    if (Array.isArray(err.response?.data?.detail)) {
      return err.response.data.detail
        .map((e) => e.msg || JSON.stringify(e))
        .join(', ');
    }

    if (typeof err.response?.data?.detail === 'string') {
      return err.response.data.detail;
    }

    if (typeof err.response?.data?.message === 'string') {
      return err.response.data.message;
    }

    return 'Signup failed. Please check your details.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    if (!formData.name.trim()) {
      setError('Full name is required.');
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required.');
      setLoading(false);
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    const parsedAge = parseInt(formData.age, 10);

    if (!parsedAge || parsedAge <= 0 || parsedAge > 120) {
      setError('Please enter a valid age.');
      setLoading(false);
      return;
    }

    try {
      await signupUser(
        formData.email.trim(),
        formData.name.trim(),
        formData.password
      );

      try {
        await registerPatient({
          user_id: formData.email.trim(),
          name: formData.name.trim(),
          age: parsedAge,
          gender: formData.gender === 'M' ? 'male' : 'female',

          existing_conditions: [],
          allergies: [],
          current_medications: [],
          family_history: [],
          food_preferences: [],

          other_conditions: '',
          other_allergy: '',
          other_medication: '',
          other_family_condition: '',
          other_family_relation: '',
          other_food_preference: '',

          sleep_quality: '',
          overthinking_level: '',
          anger_level: '',
          appetite_level: '',
          stress_level: '',
          energy_level: '',

          blood_group: '',
          bp_high: false,
          diabetic: false,
          sugar_level: '',
          bp_reading: '',

          thermal: '',
          thirst: '',
          sleep_pattern: '',
          mental_state: ''
        });
      } catch (profileErr) {
        console.error('Failed to auto-provision profile:', profileErr);
      }

     onSignup(
  formData.email.trim(),
  formData.name.trim(),
  parsedAge,
  formData.gender === 'M' ? 'male' : 'female'
);

    } catch (err) {
      const parsedError = parseBackendError(err);

      if (
        parsedError.toLowerCase().includes('already') ||
        parsedError.toLowerCase().includes('exists')
      ) {
        setError('Account already exists. Please log in.');
      } else {
        setError(parsedError);
      }

      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper fade-in">
      <div className="logo-section">
        <UserPlus size={48} color="white" />
        <h1>Join MediGuide</h1>
      </div>

      <div className="login-card">
        {error && (
          <div
            style={{
              background: '#fee2e2',
              color: '#ef4444',
              padding: '12px',
              borderRadius: '12px',
              marginBottom: '16px',
              fontSize: '14px',
              textAlign: 'center',
              fontWeight: '600'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <User size={20} className="input-icon" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Full Name"
              required
            />
          </div>

          <div className="row-group">
            <div className="input-group half">
              <Calendar size={20} className="input-icon" />
              <input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                placeholder="Age"
                min="1"
                max="120"
                required
              />
            </div>

            <div className="gender-toggle">
              <button
                type="button"
                className={formData.gender === 'M' ? 'active' : ''}
                onClick={() => setFormData({ ...formData, gender: 'M' })}
              >
                M
              </button>

              <button
                type="button"
                className={formData.gender === 'F' ? 'active' : ''}
                onClick={() => setFormData({ ...formData, gender: 'F' })}
              >
                F
              </button>
            </div>
          </div>

          <div className="input-group">
            <Mail size={20} className="input-icon" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email"
              required
            />
          </div>

          <div className="input-group">
            <Lock size={20} className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
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

          <button
            type="submit"
            className="btn-dark"
            style={{ marginTop: '16px' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
      </div>

      <div className="signup-link">
        Already have an account?
        <span onClick={() => navigate('/login')}> Log In</span>
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
          margin-top: 40px;
          margin-bottom: 30px;
          text-align: center;
          color: white;
        }

        .logo-section h1 {
          font-size: 28px;
          font-weight: 800;
          margin-top: 8px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .login-card {
          background: white;
          border-radius: 32px;
          padding: 32px 24px;
          width: 100%;
          box-shadow: var(--shadow);
        }

        .input-group {
          position: relative;
          margin-bottom: 16px;
        }

        .row-group {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .input-group.half {
          flex: 1;
          margin-bottom: 0;
        }

        .gender-toggle {
          flex: 1;
          display: flex;
          background: #f4f3f7;
          border-radius: 16px;
          padding: 4px;
          align-items: center;
        }

        .gender-toggle button {
          flex: 1;
          border: none;
          background: transparent;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          color: #6b7280;
          padding: 12px 0;
          cursor: pointer;
          transition: all 0.2s;
        }

        .gender-toggle button.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          z-index: 2;
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
          box-sizing: border-box;
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
          z-index: 2;
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

        .btn-dark:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-dark:active {
          opacity: 0.8;
        }

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

export default SignupPage;