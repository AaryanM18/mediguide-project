import React, { useEffect, useState } from 'react';
import {
  User, Activity, Lightbulb, Folder, Brain,
  ThermometerSun, Leaf, ScanHeart, BookOpen, Moon, Zap, Flame, Utensils
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getHealthFacts, getPatientProfile } from '../services/api';

const HomePage = ({ user }) => {
  const navigate = useNavigate();
  const [factIndex, setFactIndex] = useState(0);
  const [profile, setProfile] = useState(null);

  const [facts, setFacts] = useState([
    "Homeopathy works on the principle of 'Like Cures Like'.",
    "It considers physical, mental, and emotional patterns together."
  ]);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const factData = await getHealthFacts();
        if (factData?.length) setFacts(factData);

        if (user?.id) {
          const res = await getPatientProfile(user.id);
          if (res.success && res.patient) setProfile(res.patient);
        }
      } catch (err) {
        console.error('Home data loading failed:', err);
      }
    };

    loadHomeData();

    if (localStorage.getItem('is_new') === 'true') {
      localStorage.removeItem('is_new');
      navigate('/health-profile');
    }
  }, [navigate, user?.id]);

  useEffect(() => {
    if (!facts.length) return;

    const timer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % facts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [facts.length]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 18) return 'Good Afternoon,';
    if (hour < 22) return 'Good Evening,';
    return 'Good Night,';
  };

  const displayValue = (value) => value && value !== '' ? value : 'Not set';

  return (
    <div className="home-container fade-in">
      <header className="home-header">
        <div className="header-text">
          <p>{getGreeting()}</p>
          <h1>{(user?.name || user?.username || user?.id || 'User').split(' ')[0]} 👋</h1>
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
          <div className="bento-large" onClick={() => navigate('/find')}>
            <Activity size={32} color="white" />
            <div className="bento-text">
              <h3>Analyze Symptoms</h3>
              <p>AI-powered remedy matching</p>
            </div>
          </div>

          <div className="bento-side-col">
            <div className="bento-small" onClick={() => navigate('/learn')}>
              <Lightbulb size={24} color="white" />
              <h3>Health Tips</h3>
            </div>

            <div className="bento-small darker" onClick={() => navigate('/history')}>
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
            <div className="cat-icon"><Brain size={24} /></div>
            <span>Headache</span>
          </div>

          <div className="cat-item" onClick={() => navigate('/analyze', { state: { prefilledSymptom: 'fever' } })}>
            <div className="cat-icon"><ThermometerSun size={24} /></div>
            <span>Fever</span>
          </div>

          <div className="cat-item" onClick={() => navigate('/analyze', { state: { prefilledSymptom: 'stomach pain' } })}>
            <div className="cat-icon"><Leaf size={24} /></div>
            <span>Stomach</span>
          </div>

          <div className="cat-item" onClick={() => navigate('/analyze', { state: { prefilledSymptom: 'skin rash' } })}>
            <div className="cat-icon"><ScanHeart size={24} /></div>
            <span>Skin</span>
          </div>
        </div>

        <div className="section-header">
          <h2>Wellness Insights</h2>
          <span onClick={() => navigate('/health-profile')}>Edit Profile</span>
        </div>

        <div className="premium-snapshot-card">
          <div className="snapshot-top">
            <div>
              <span className="mini-label">Personal Constitution</span>
              <h3>Constitutional Snapshot</h3>
            </div>
            <div className="premium-badge">Live Profile</div>
          </div>

          <div className="snapshot-grid">
            <InsightItem icon={<Moon size={18} />} label="Sleep" value={displayValue(profile?.sleep_quality)} />
            <InsightItem icon={<Flame size={18} />} label="Stress" value={displayValue(profile?.stress_level)} />
            <InsightItem icon={<Zap size={18} />} label="Energy" value={displayValue(profile?.energy_level)} />
            <InsightItem icon={<Utensils size={18} />} label="Appetite" value={displayValue(profile?.appetite_level)} />
          </div>

          <button className="snapshot-action" onClick={() => navigate('/health-profile')}>
            Update constitutional profile
          </button>
        </div>

        <div
          className="info-card dark clickable-fact"
          onClick={() => setFactIndex((prev) => (prev + 1) % facts.length)}
        >
          <div className="info-content">
            <span className="label">
              Did you know? <span className="tap-hint">(Tap to change)</span>
            </span>

            <p className="fade-text" key={factIndex}>
              {facts[factIndex]}
            </p>

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
:root{
--primary-950:#1e0738;
--primary-900:#2d0a54;
--primary-800:#4c1d95;
--primary-700:#6d28d9;
--primary-600:#8f56eb;
--primary-500:#a78bfa;
--primary-400:#c4b5fd;
--primary-300:#ddd6fe;

--surface:#f8f4ff;
--surface-2:#efe7ff;
--text-dark:#24143f;
--text-muted:#6d6290;

--glow:rgba(143,86,235,.28);
}

.home-container{
min-height:100vh;
padding-bottom:40px;
background:
radial-gradient(circle at top right, rgba(143,86,235,.18), transparent 34%),
linear-gradient(180deg,#f8f4ff,#efe7ff);
}

.home-header{
background:
linear-gradient(135deg,#2d0a54 0%,#5b21b6 45%,#8f56eb 100%);
color:white;
padding:40px 24px 30px;
border-bottom-left-radius:40px;
border-bottom-right-radius:40px;
display:flex;
justify-content:space-between;
align-items:center;
box-shadow:
0 16px 38px var(--glow),
0 4px 12px rgba(76,29,149,.16);
position:relative;
overflow:hidden;
}

.home-header::after{
content:"";
position:absolute;
width:180px;
height:180px;
right:-55px;
top:-70px;
border-radius:50%;
background:rgba(255,255,255,.09);
}

.header-text{
position:relative;
z-index:1;
}

.header-text p{
font-size:14px;
color:var(--primary-300);
margin-bottom:4px;
}

.header-text h1{
font-size:28px;
font-weight:800;
margin:0;
}

.header-avatar{
width:56px;
height:56px;
border-radius:18px;
background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.22);
backdrop-filter:blur(14px);
display:flex;
align-items:center;
justify-content:center;
box-shadow:
0 14px 28px rgba(0,0,0,.16),
inset 0 1px 0 rgba(255,255,255,.16);
cursor:pointer;
position:relative;
z-index:1;
}

.home-content{
padding:0 24px;
margin-top:24px;
}

.section-header{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:16px;
margin-top:24px;
}

.section-header h2{
font-size:18px;
font-weight:800;
color:var(--text-dark);
}

.section-header span{
font-size:13px;
font-weight:700;
color:var(--primary-700);
cursor:pointer;
}

.bento-grid{
display:flex;
gap:16px;
}

.bento-large{
flex:1.2;
border-radius:30px;
padding:24px;
display:flex;
flex-direction:column;
justify-content:space-between;
min-height:180px;
cursor:pointer;
color:white;
position:relative;
overflow:hidden;
background:
linear-gradient(145deg,var(--primary-900),var(--primary-600));
border:1px solid rgba(255,255,255,.12);
box-shadow:
0 18px 40px var(--glow),
0 4px 10px rgba(76,29,149,.14),
inset 0 1px 0 rgba(255,255,255,.12);
}

.bento-large::after{
content:"";
position:absolute;
width:150px;
height:150px;
right:-40px;
top:-40px;
border-radius:50%;
background:rgba(255,255,255,.08);
}

.bento-text h3{
font-size:18px;
font-weight:800;
margin-bottom:6px;
}

.bento-text p{
font-size:12px;
opacity:.92;
}

.bento-side-col{
flex:.8;
display:flex;
flex-direction:column;
gap:16px;
}

.bento-small{
flex:1;
border-radius:24px;
padding:20px;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
gap:10px;
cursor:pointer;
color:white;
background:
linear-gradient(145deg,var(--primary-800),var(--primary-600));
border:1px solid rgba(255,255,255,.12);
box-shadow:
0 14px 30px rgba(143,86,235,.22),
inset 0 1px 0 rgba(255,255,255,.10);
}

.bento-small.darker{
background:
linear-gradient(145deg,var(--primary-950),var(--primary-700));
}

.bento-small h3{
font-size:14px;
font-weight:800;
}

.bento-large,
.bento-small,
.premium-snapshot-card{
animation:floatCard 5s ease-in-out infinite;
}

@keyframes floatCard{
0%{transform:translateY(0);}
50%{transform:translateY(-4px);}
100%{transform:translateY(0);}
}

.cat-row{
display:flex;
justify-content:space-between;
margin-top:16px;
}

.cat-item{
display:flex;
flex-direction:column;
align-items:center;
gap:8px;
cursor:pointer;
}

.cat-icon{
width:64px;
height:64px;
border-radius:22px;
display:flex;
align-items:center;
justify-content:center;
background:
linear-gradient(145deg,rgba(255,255,255,.95),rgba(237,228,255,.9));
border:1px solid rgba(143,86,235,.20);
color:var(--primary-600);
box-shadow:
0 12px 24px rgba(143,86,235,.14),
inset 0 1px 0 rgba(255,255,255,.9);
}

.cat-item span{
font-size:12px;
font-weight:700;
color:var(--text-dark);
}

.premium-snapshot-card{
border-radius:30px;
padding:22px;
background:
linear-gradient(135deg,#2d0a54 0%,#5b21b6 48%,#8f56eb 100%);
color:white;
box-shadow:
0 20px 42px var(--glow),
0 4px 12px rgba(76,29,149,.16);
position:relative;
overflow:hidden;
}

.premium-snapshot-card::after{
content:"";
position:absolute;
width:170px;
height:170px;
border-radius:50%;
background:rgba(255,255,255,.09);
top:-60px;
right:-50px;
}

.snapshot-top{
display:flex;
justify-content:space-between;
align-items:flex-start;
margin-bottom:18px;
z-index:1;
position:relative;
}

.mini-label{
font-size:11px;
color:var(--primary-300);
font-weight:800;
letter-spacing:.5px;
text-transform:uppercase;
}

.snapshot-top h3{
font-size:20px;
font-weight:900;
margin-top:4px;
}

.premium-badge{
background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.20);
padding:7px 10px;
border-radius:999px;
font-size:11px;
font-weight:800;
backdrop-filter:blur(10px);
}

.snapshot-grid{
display:grid;
grid-template-columns:1fr 1fr;
gap:12px;
position:relative;
z-index:1;
}

.insight-item{
background:rgba(255,255,255,.13);
border:1px solid rgba(255,255,255,.18);
border-radius:18px;
padding:14px;
backdrop-filter:blur(10px);
}

.insight-icon{
width:32px;
height:32px;
border-radius:12px;
background:rgba(255,255,255,.16);
display:flex;
align-items:center;
justify-content:center;
margin-bottom:10px;
color:var(--primary-300);
}

.insight-item span{
font-size:11px;
color:var(--primary-300);
display:block;
margin-bottom:3px;
}

.insight-item strong{
font-size:14px;
color:white;
}

.snapshot-action{
margin-top:16px;
width:100%;
padding:13px;
border-radius:16px;
border:1px solid rgba(255,255,255,.22);
background:
linear-gradient(135deg,rgba(255,255,255,.18),rgba(255,255,255,.10));
backdrop-filter:blur(12px);
color:white;
font-size:13px;
font-weight:900;
cursor:pointer;
position:relative;
z-index:1;
}

.snapshot-action:hover{
background:
linear-gradient(135deg,rgba(255,255,255,.26),rgba(255,255,255,.14));
}

.info-card{
border-radius:26px;
padding:24px;
margin-top:18px;
margin-bottom:80px;
overflow:hidden;
position:relative;
}

.info-card.dark{
background:
linear-gradient(135deg,var(--primary-950),var(--primary-800),var(--primary-600));
color:white;
box-shadow:
0 18px 38px rgba(143,86,235,.24),
0 4px 10px rgba(76,29,149,.12);
}

.info-content .label{
font-size:12px;
font-weight:700;
color:var(--primary-300);
display:block;
margin-bottom:8px;
}

.info-content p{
font-size:15px;
line-height:1.4;
width:80%;
}

.bg-icon{
position:absolute;
right:-10px;
bottom:-10px;
color:rgba(255,255,255,.09);
}

.tap-hint{
opacity:.6;
font-size:10px;
margin-left:6px;
}

.fade-text{
animation:fadeIn .5s ease;
}

@keyframes fadeIn{
from{
opacity:0;
transform:translateY(4px);
}
to{
opacity:1;
transform:none;
}
}

.fact-dots{
display:flex;
gap:6px;
margin-top:16px;
}

.fact-dots .dot{
width:6px;
height:6px;
border-radius:50%;
background:rgba(255,255,255,.25);
}

.fact-dots .dot.active{
width:16px;
border-radius:4px;
background:white;
}

.bento-large:active,
.bento-small:active,
.cat-item:active,
.snapshot-action:active{
transform:scale(.98);
}

@media(max-width:480px){
.home-header{
padding:34px 20px 28px;
}

.home-content{
padding:0 18px;
}

.bento-grid{
gap:12px;
}

.bento-large{
min-height:170px;
padding:20px;
}

.bento-small{
padding:16px;
}

.cat-icon{
width:58px;
height:58px;
}

.cat-item span{
font-size:11px;
}
}
`}</style>
    </div>
  );
};

const InsightItem = ({ icon, label, value }) => {
  return (
    <div className="insight-item">
      <div className="insight-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
};

export default HomePage;