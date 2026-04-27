import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Brain,
  ThermometerSun,
  Leaf,
  ScanHeart,
  Droplets,
  Wind,
  User,
  Activity,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSymptoms } from '../services/api';

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const iconMap = {
    Head: <Brain size={24} />,
    Fever: <ThermometerSun size={24} />,
    Stomach: <Leaf size={24} />,
    Skin: <ScanHeart size={24} />,
    Eyes: <Droplets size={24} />,
    Respiratory: <Wind size={24} />,
    Male: <User size={24} />,
    Female: <User size={24} />,
    Nose: <Activity size={24} />,
    Mouth: <Activity size={24} />,
    Throat: <Activity size={24} />,
    Chest: <Wind size={24} />
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getSymptoms();

        if (data.symptoms) {
          const uniqueCats = Object.keys(data.symptoms).map((cat) => ({
            name: cat,
            icon: iconMap[cat] || <Activity size={24} />
          }));

          setCategories(uniqueCats);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="categories-page-container fade-in">
      <header className="categories-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} color="white" />
        </button>

        <div className="categories-header-content">
          <div className="header-icon-orb">
            <Search size={34} color="white" />
          </div>

          <span className="mini-label">Symptom Explorer</span>
          <h1>Quick Categories</h1>
          <p>Browse symptoms by body area and start analysis faster.</p>
        </div>

        <div className="category-search-box">
          <Search size={18} color="#ddd6fe" />
          <input
            type="text"
            placeholder="Search category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="categories-body">
        {loading ? (
          <div className="loading-state">Organizing categories...</div>
        ) : filteredCategories.length > 0 ? (
          <div className="categories-grid-all">
            {filteredCategories.map((cat, i) => (
              <div
                key={i}
                className="cat-card-all slide-up"
                style={{ animationDelay: `${i * 0.04}s` }}
                onClick={() =>
                  navigate('/analyze', {
                    state: { prefilledSymptom: cat.name }
                  })
                }
              >
                <div className="cat-icon-lg">{cat.icon}</div>

                <div className="cat-card-text">
                  <h3>{cat.name}</h3>
                  <p>Symptom Matching</p>
                </div>

                <div className="card-glow"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Search size={46} color="#8f56eb" />
            <h3>No category found</h3>
            <p>Try another keyword.</p>
          </div>
        )}
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

.categories-page-container{
min-height:100vh;
padding-bottom:40px;
background:
radial-gradient(circle at top right, rgba(143,86,235,.18), transparent 34%),
linear-gradient(180deg,#f8f4ff,#efe7ff);
}

.categories-header{
padding:78px 24px 32px;
border-bottom-left-radius:42px;
border-bottom-right-radius:42px;
background:
linear-gradient(135deg,#2d0a54 0%,#5b21b6 45%,#8f56eb 100%);
text-align:center;
position:relative;
overflow:hidden;
box-shadow:
0 16px 38px var(--glow),
0 4px 12px rgba(76,29,149,.16);
}

.categories-header::after{
content:"";
position:absolute;
width:190px;
height:190px;
border-radius:50%;
background:rgba(255,255,255,.09);
top:-70px;
right:-60px;
}

.categories-header::before{
content:"";
position:absolute;
width:150px;
height:150px;
border-radius:50%;
background:rgba(255,255,255,.06);
bottom:-80px;
left:-55px;
}

.back-btn{
position:absolute;
top:58px;
left:20px;
width:46px;
height:46px;
background:rgba(255,255,255,.14);
backdrop-filter:blur(14px);
border:1px solid rgba(255,255,255,.22);
border-radius:15px;
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
z-index:3;
box-shadow:
0 14px 28px rgba(0,0,0,.16),
inset 0 1px 0 rgba(255,255,255,.16);
}

.categories-header-content{
position:relative;
z-index:2;
display:flex;
flex-direction:column;
align-items:center;
}

.header-icon-orb{
width:72px;
height:72px;
border-radius:24px;
background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.22);
display:flex;
align-items:center;
justify-content:center;
margin-bottom:16px;
backdrop-filter:blur(14px);
box-shadow:
0 14px 28px rgba(0,0,0,.16),
inset 0 1px 0 rgba(255,255,255,.16);
}

.mini-label{
font-size:11px;
color:var(--primary-300);
font-weight:800;
text-transform:uppercase;
letter-spacing:.7px;
margin-bottom:6px;
}

.categories-header h1{
font-size:30px;
color:white;
font-weight:900;
margin-bottom:6px;
}

.categories-header p{
color:var(--primary-300);
font-size:14px;
line-height:1.45;
max-width:280px;
margin-bottom:22px;
}

.category-search-box{
position:relative;
z-index:2;
width:100%;
background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.22);
backdrop-filter:blur(14px);
border-radius:18px;
padding:14px 18px;
display:flex;
align-items:center;
gap:10px;
box-shadow:
inset 0 1px 0 rgba(255,255,255,.16);
}

.category-search-box input{
flex:1;
background:transparent;
border:none;
outline:none;
color:white;
font-size:14px;
font-weight:700;
}

.category-search-box input::placeholder{
color:#ddd6fe;
}

.categories-body{
padding:28px 24px;
}

.categories-grid-all{
display:grid;
grid-template-columns:1fr 1fr;
gap:16px;
}

.cat-card-all{
min-height:168px;
border-radius:30px;
padding:22px 18px;
background:
linear-gradient(145deg,var(--primary-900),var(--primary-600));
color:white;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
text-align:center;
cursor:pointer;
position:relative;
overflow:hidden;
border:1px solid rgba(255,255,255,.12);
box-shadow:
0 18px 40px var(--glow),
0 4px 10px rgba(76,29,149,.14),
inset 0 1px 0 rgba(255,255,255,.12);
transition:transform .2s ease, box-shadow .2s ease;
}

.cat-card-all:nth-child(even){
background:
linear-gradient(145deg,var(--primary-800),var(--primary-600));
}

.cat-card-all:nth-child(3n){
background:
linear-gradient(145deg,var(--primary-950),var(--primary-700));
}

.cat-card-all::after{
content:"";
position:absolute;
width:130px;
height:130px;
border-radius:50%;
background:rgba(255,255,255,.08);
top:-40px;
right:-40px;
}

.cat-card-all:hover{
transform:translateY(-3px);
box-shadow:
0 22px 44px rgba(143,86,235,.32),
0 5px 14px rgba(76,29,149,.16);
}

.cat-card-all:active{
transform:scale(.96);
}

.cat-icon-lg{
width:62px;
height:62px;
border-radius:20px;
background:rgba(255,255,255,.16);
border:1px solid rgba(255,255,255,.18);
display:flex;
align-items:center;
justify-content:center;
margin-bottom:16px;
color:var(--primary-300);
position:relative;
z-index:1;
backdrop-filter:blur(10px);
box-shadow:
inset 0 1px 0 rgba(255,255,255,.12);
}

.cat-card-text{
position:relative;
z-index:1;
}

.cat-card-all h3{
font-size:16px;
font-weight:900;
color:white;
margin-bottom:5px;
text-transform:capitalize;
}

.cat-card-all p{
font-size:10px;
color:var(--primary-300);
font-weight:800;
text-transform:uppercase;
letter-spacing:.6px;
}

.card-glow{
position:absolute;
bottom:-35px;
left:50%;
transform:translateX(-50%);
width:120px;
height:70px;
background:rgba(196,181,253,.18);
filter:blur(25px);
}

.loading-state{
text-align:center;
padding:50px 20px;
color:var(--primary-700);
font-weight:900;
}

.empty-state{
min-height:320px;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
text-align:center;
gap:10px;
color:var(--text-dark);
}

.empty-state h3{
font-size:20px;
font-weight:900;
margin-top:8px;
}

.empty-state p{
font-size:14px;
color:var(--primary-700);
font-weight:700;
}

.slide-up{
animation:slideUp .45s ease both;
}

@keyframes slideUp{
from{
opacity:0;
transform:translateY(18px);
}
to{
opacity:1;
transform:translateY(0);
}
}

@media(max-width:480px){
.categories-header{
padding:74px 20px 30px;
}

.categories-body{
padding:26px 18px;
}

.categories-grid-all{
gap:14px;
}

.cat-card-all{
min-height:158px;
padding:20px 14px;
}

.cat-icon-lg{
width:58px;
height:58px;
}
}
      `}</style>
    </div>
  );
};

export default CategoriesPage;