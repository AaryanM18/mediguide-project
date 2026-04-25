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
import './index.css'

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const savedUserId = localStorage.getItem('user_id');
    const savedUserName = localStorage.getItem('user_name');
    if (savedUserId) {
        setUser({ id: savedUserId, name: savedUserName || 'User' });
    }
  }, []);

  const handleLogin = (userId, name) => {
    let derivedName = name;
    if (!derivedName && userId) {
      derivedName = userId.split('@')[0].replace(/[._]/g, ' ');
      derivedName = derivedName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    } else if (!derivedName) {
      derivedName = 'User';
    }
    localStorage.setItem('user_id', userId);
    localStorage.setItem('user_name', derivedName);
    setUser({ id: userId, name: derivedName });
  };

  const handleSignup = (userId, name, password) => {
    localStorage.setItem('user_id', userId);
    localStorage.setItem('user_name', name);
    if (password) localStorage.setItem(`auth_password_${userId}`, password);
    localStorage.setItem('is_new', 'true');
    setUser({ id: userId, name: name });
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    setUser(null);
  };

  return (
    <Router>
      <div id="root-container">
        <Routes>
          <Route path="/login" element={!user ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <SignupPage onSignup={handleSignup} /> : <Navigate to="/health-profile" />} />
          <Route path="/*" element={user ? (
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
                  <Route path="/categories" element={<CategoriesPage user={user} />} />
                  <Route path="/remedy/:id" element={<RemedyDetailPage user={user} />} />
                  <Route path="/remedy-library/:name" element={<LibraryDetailPage user={user} />} />
                  <Route path="/philosophy" element={<PhilosophyPage user={user} />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              <BottomNav />
            </>
          ) : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
