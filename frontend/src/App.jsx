import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import HealthProfilePage from './pages/HealthProfilePage';
import SymptomAnalysisPage from './pages/SymptomAnalysisPage';
import SymptomSearchPage from './pages/SymptomSearchPage';
import SavedPage from './pages/SavedPage';
import LearnPage from './pages/LearnPage';
import CategoriesPage from './pages/CategoriesPage';
import RemedyDetailPage from './pages/RemedyDetailPage';
import LibraryDetailPage from './pages/LibraryDetailPage';
import PhilosophyPage from './pages/PhilosophyPage';
import BottomNav from './components/BottomNav';
import './index.css';

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const savedUserId = localStorage.getItem('user_id');
    const savedUserName = localStorage.getItem('user_name');
    const savedUserAge = localStorage.getItem('user_age');
    const savedUserGender = localStorage.getItem('user_gender');

    if (savedUserId) {
      setUser({
        id: savedUserId,
        email: savedUserId,
        name: savedUserName || savedUserId.split('@')[0] || 'User',
        age: savedUserAge || '',
        gender: savedUserGender || ''
      });
    }
  }, []);

  const cleanName = (email, name) => {
    if (name && name.trim()) return name.trim();

    if (email) {
      return email
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    return 'User';
  };

  const saveUserSession = (email, name, age = '', gender = '') => {
    const finalName = cleanName(email, name);

    localStorage.setItem('user_id', email);
    localStorage.setItem('user_name', finalName);

    if (age !== '') localStorage.setItem('user_age', age);
    if (gender !== '') localStorage.setItem('user_gender', gender);

    setUser({
      id: email,
      email,
      name: finalName,
      age,
      gender
    });
  };

  const handleLogin = (email, name) => {
    const savedUserAge = localStorage.getItem('user_age') || '';
    const savedUserGender = localStorage.getItem('user_gender') || '';

    saveUserSession(email, name, savedUserAge, savedUserGender);
  };

  const handleSignup = (email, name, age, gender) => {
    localStorage.setItem('is_new', 'true');
    saveUserSession(email, name, age, gender);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_age');
    localStorage.removeItem('user_gender');
    localStorage.removeItem('is_new');
    setUser(null);
  };

  return (
    <Router>
      <div id="root-container">
        <Routes>
          <Route
            path="/login"
            element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" replace />}
          />

          <Route
            path="/signup"
            element={!user ? <SignupPage onSignup={handleSignup} /> : <Navigate to="/health-profile" replace />}
          />

          <Route
            path="/*"
            element={
              user ? (
                <>
                  <main style={{ paddingBottom: '80px', minHeight: '100vh' }}>
                    <Routes>
                      <Route index element={<HomePage user={user} />} />
                      <Route path="/profile" element={<ProfilePage user={user} onLogout={handleLogout} />} />
                      <Route path="/history" element={<HistoryPage user={user} />} />
                      <Route path="/health-profile" element={<HealthProfilePage user={user} />} />
                      <Route path="/find" element={<SymptomAnalysisPage user={user} />} />
                      <Route path="/search" element={<SymptomSearchPage user={user} />} />
                      <Route path="/saved" element={<SavedPage user={user} />} />
                      <Route path="/analyze" element={<SymptomAnalysisPage user={user} />} />
                      <Route path="/learn" element={<LearnPage user={user} />} />
                      <Route path="/categories" element={<CategoriesPage />} />
                      <Route path="/remedy/:id" element={<RemedyDetailPage user={user} />} />
                      <Route path="/remedy-library/:name" element={<LibraryDetailPage />} />
                      <Route path="/philosophy" element={<PhilosophyPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>

                  <BottomNav />
                </>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;