import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Bookmark,
  ChevronRight,
  Search,
  Activity,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getConsultationHistory } from '../services/api';

const HistoryPage = ({ user }) => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getConsultationHistory(user.id);
      if (data.history) {
        setHistory(data.history.reverse());
      }
      setLoading(false);
    };

    fetchHistory();
  }, [user.id]);

  const filteredHistory = history.filter((item) => {
    const name = item.remedy_name || '';
    const symptoms = item.symptom || '';

    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      symptoms.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === 'all' || (filter === 'saved' && item.is_saved);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="history-container fade-in">
      <header className="history-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={24} color="white" />
        </button>

        <div className="history-header-content">
          <div className="header-icon-orb">
            <Activity size={34} color="white" />
          </div>

          <span className="mini-label">Consultation Archive</span>
          <h1>Health Records</h1>
          <p>Track your homeopathic consultation history</p>
        </div>

        <div className="search-and-filter">
          <div className="search-minimal">
            <Search size={18} color="#ddd6fe" />
            <input
              type="text"
              placeholder="Search symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div
            className={`filter-pill ${filter === 'saved' ? 'active' : ''}`}
            onClick={() => setFilter(filter === 'all' ? 'saved' : 'all')}
          >
            <Filter size={16} color="white" />
            <span>{filter === 'saved' ? 'Saved' : 'Filter'}</span>
          </div>
        </div>
      </header>

      <div className="history-body">
        {loading ? (
          <div className="loading-state">Accessing medical records...</div>
        ) : (
          <div className="history-list">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="history-card slide-up"
                  style={{ animationDelay: `${idx * 0.04}s` }}
                  onClick={() =>
                    navigate(`/remedy/${item.remedy_name}`, { state: item })
                  }
                >
                  <div className="card-top">
                    <div
                      className={`severity-dot ${
                        item.severity === 'high'
                          ? 'high'
                          : item.severity === 'moderate'
                          ? 'moderate'
                          : 'low'
                      }`}
                    ></div>

                    <span className="timestamp">
                      {item.created_at || 'Recent'}
                    </span>

                    {item.is_saved && (
                      <Bookmark
                        size={14}
                        fill="#ddd6fe"
                        color="#ddd6fe"
                        className="saved-icon"
                      />
                    )}
                  </div>

                  <div className="card-main">
                    <div className="symptom-info">
                      <h3>{item.symptom}</h3>
                      <p className="remedy-preview">
                        {item.remedy_name} {item.potency}
                      </p>
                    </div>

                    <button className="view-details">
                      <ChevronRight size={20} color="#ddd6fe" />
                    </button>
                  </div>

                  <div className="card-glow"></div>
                </div>
              ))
            ) : (
              <div className="no-history">
                <Activity size={64} color="#8f56eb" strokeWidth={1.2} />
                <h3>No records found</h3>
                <p>No records found matching your search.</p>
                <button className="start-btn" onClick={() => navigate('/find')}>
                  Get a Consultation
                </button>
              </div>
            )}
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

.history-container{
min-height:100vh;
padding-bottom:40px;
background:
radial-gradient(circle at top right, rgba(143,86,235,.18), transparent 34%),
linear-gradient(180deg,#f8f4ff,#efe7ff);
}

.history-header{
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

.history-header::after{
content:"";
position:absolute;
width:190px;
height:190px;
border-radius:50%;
background:rgba(255,255,255,.09);
top:-70px;
right:-60px;
}

.history-header::before{
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

.history-header-content{
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

.history-header h1{
font-size:30px;
color:white;
font-weight:900;
margin-bottom:6px;
}

.history-header p{
color:var(--primary-300);
font-size:14px;
line-height:1.45;
margin-bottom:22px;
}

.search-and-filter{
position:relative;
z-index:2;
display:flex;
gap:12px;
margin-top:20px;
}

.search-minimal{
flex:1;
border-radius:100px;
padding:14px 18px;
background:rgba(255,255,255,.14);
backdrop-filter:blur(14px);
border:1px solid rgba(255,255,255,.22);
display:flex;
align-items:center;
gap:10px;
box-shadow:
inset 0 1px 0 rgba(255,255,255,.16);
}

.search-minimal input{
background:transparent;
border:none;
outline:none;
font-size:14px;
font-weight:700;
color:white;
width:100%;
}

.search-minimal input::placeholder{
color:#ddd6fe;
}

.filter-pill{
border-radius:100px;
padding:0 18px;
background:rgba(255,255,255,.14);
backdrop-filter:blur(14px);
border:1px solid rgba(255,255,255,.22);
display:flex;
align-items:center;
gap:8px;
cursor:pointer;
box-shadow:
inset 0 1px 0 rgba(255,255,255,.16);
}

.filter-pill.active{
background:rgba(255,255,255,.24);
}

.filter-pill span{
font-size:12px;
font-weight:800;
color:white;
}

.history-body{
padding:30px 24px;
}

.history-list{
display:flex;
flex-direction:column;
gap:18px;
padding-bottom:30px;
}

.history-card{
background:
linear-gradient(145deg,var(--primary-900),var(--primary-600));
border-radius:30px;
padding:22px;
color:white;
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

.history-card:nth-child(even){
background:
linear-gradient(145deg,var(--primary-800),var(--primary-600));
}

.history-card:nth-child(3n){
background:
linear-gradient(145deg,var(--primary-950),var(--primary-700));
}

.history-card::after{
content:"";
position:absolute;
width:140px;
height:140px;
right:-40px;
top:-40px;
border-radius:50%;
background:rgba(255,255,255,.08);
}

.history-card:hover{
transform:translateY(-3px);
box-shadow:
0 22px 44px rgba(143,86,235,.32),
0 5px 14px rgba(76,29,149,.16);
}

.history-card:active{
transform:scale(.97);
}

.card-top{
display:flex;
align-items:center;
gap:10px;
margin-bottom:16px;
position:relative;
z-index:1;
}

.severity-dot{
width:9px;
height:9px;
border-radius:50%;
box-shadow:0 0 8px currentColor;
}

.severity-dot.high{
background:#ef4444;
color:#ef4444;
}

.severity-dot.moderate{
background:#f59e0b;
color:#f59e0b;
}

.severity-dot.low{
background:#34d399;
color:#34d399;
}

.timestamp{
font-size:11px;
font-weight:800;
color:var(--primary-300);
text-transform:uppercase;
letter-spacing:.5px;
}

.saved-icon{
margin-left:auto;
}

.card-main{
display:flex;
justify-content:space-between;
align-items:center;
position:relative;
z-index:1;
}

.symptom-info h3{
font-size:18px;
font-weight:900;
margin-bottom:6px;
color:white;
}

.remedy-preview{
font-size:13px;
font-weight:700;
color:var(--primary-300);
}

.view-details{
background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.18);
width:42px;
height:42px;
border-radius:14px;
display:flex;
align-items:center;
justify-content:center;
}

.card-glow{
position:absolute;
bottom:-35px;
left:50%;
transform:translateX(-50%);
width:130px;
height:70px;
background:rgba(196,181,253,.18);
filter:blur(25px);
}

.no-history{
min-height:320px;
text-align:center;
padding:70px 20px;
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
gap:14px;
color:var(--text-dark);
}

.no-history h3{
font-size:20px;
font-weight:900;
}

.no-history p{
color:var(--primary-700);
font-weight:700;
font-size:14px;
}

.start-btn{
background:
linear-gradient(135deg,#5b21b6,#8f56eb);
border:none;
padding:14px 30px;
border-radius:18px;
font-size:14px;
font-weight:800;
color:white;
box-shadow:
0 14px 28px rgba(143,86,235,.28);
cursor:pointer;
}

.loading-state{
text-align:center;
padding:50px;
font-weight:900;
color:var(--primary-700);
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
.history-header{
padding:74px 20px 30px;
}

.history-body{
padding:28px 18px;
}

.search-and-filter{
gap:10px;
}

.filter-pill{
padding:0 14px;
}

.history-card{
padding:20px;
}

.symptom-info h3{
font-size:17px;
}
}
      `}</style>
    </div>
  );
};

export default HistoryPage;