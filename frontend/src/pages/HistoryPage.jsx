import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Activity,
  CalendarClock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getConsultationHistory } from '../services/api';

const HistoryPage = ({ user }) => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getConsultationHistory(user.id);

        const rawHistory = data?.history || [];

        const uniqueHistory = rawHistory.filter((item, index, self) => {
          const key = `${item.symptom}-${item.remedy_name}-${item.potency}-${item.created_at}`;

          return (
            index ===
            self.findIndex((record) => {
              const recordKey = `${record.symptom}-${record.remedy_name}-${record.potency}-${record.created_at}`;
              return recordKey === key;
            })
          );
        });

        setHistory([...uniqueHistory].reverse());
      } catch (err) {
        console.error('History loading failed:', err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user.id]);

  const filteredHistory = history.filter((item) => {
    const remedy = item.remedy_name || '';
    const symptoms = item.symptom || '';
    const condition = item.condition || '';

    const q = searchQuery.toLowerCase();

    return (
      remedy.toLowerCase().includes(q) ||
      symptoms.toLowerCase().includes(q) ||
      condition.toLowerCase().includes(q)
    );
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
          <p>Review your previous remedy suggestions and symptom records.</p>
        </div>

        <div className="search-and-filter">
          <div className="search-minimal">
            <Search size={18} color="#ddd6fe" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="history-body">
        {loading ? (
          <div className="loading-state">Loading records...</div>
        ) : (
          <>
            <div className="record-summary">
              <div>
                <span>Total Records</span>
                <strong>{history.length}</strong>
              </div>

              <div>
                <span>Showing</span>
                <strong>{filteredHistory.length}</strong>
              </div>
            </div>

            <div className="history-list">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item, idx) => (
                  <div
                    key={`${item.remedy_name}-${item.created_at}-${idx}`}
                    className="history-card slide-up"
                    style={{ animationDelay: `${idx * 0.04}s` }}
                    onClick={() =>
                      navigate(`/remedy/${encodeURIComponent(item.remedy_name)}`, { state: item })
                    }
                  >
                    <div className="card-top">
                      <div className="record-icon">
                        <CalendarClock size={18} />
                      </div>

                      <span className="timestamp">
                        {item.created_at || 'Recent'}
                      </span>
                    </div>

                    <div className="card-main">
                      <div className="symptom-info">
                        <h3>{item.symptom || 'Recorded Consultation'}</h3>

                        <p className="remedy-preview">
                          {item.remedy_name || 'Remedy not found'} {item.potency || ''}
                        </p>

                        {item.condition && (
                          <p className="condition-preview">
                            {item.condition}
                          </p>
                        )}
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
                  <p>
                    {searchQuery
                      ? 'No records match your search.'
                      : 'Your consultation history will appear here.'}
                  </p>

                  <button className="start-btn" onClick={() => navigate('/find')}>
                    Start Consultation
                  </button>
                </div>
              )}
            </div>
          </>
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
max-width:310px;
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

.history-body{
padding:26px 24px;
}

.record-summary{
display:grid;
grid-template-columns:1fr 1fr;
gap:14px;
margin-bottom:22px;
}

.record-summary div{
background:
linear-gradient(145deg,#ffffff,#f4eeff);
border:1px solid rgba(143,86,235,.10);
border-radius:22px;
padding:16px;
box-shadow:0 12px 24px rgba(143,86,235,.08);
}

.record-summary span{
display:block;
font-size:11px;
font-weight:900;
text-transform:uppercase;
letter-spacing:.5px;
color:var(--primary-700);
margin-bottom:4px;
}

.record-summary strong{
font-size:22px;
font-weight:900;
color:var(--text-dark);
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

.record-icon{
width:34px;
height:34px;
border-radius:12px;
background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.18);
display:flex;
align-items:center;
justify-content:center;
color:#ddd6fe;
}

.timestamp{
font-size:11px;
font-weight:800;
color:var(--primary-300);
text-transform:uppercase;
letter-spacing:.5px;
}

.card-main{
display:flex;
justify-content:space-between;
align-items:center;
gap:14px;
position:relative;
z-index:1;
}

.symptom-info{
flex:1;
}

.symptom-info h3{
font-size:18px;
font-weight:900;
margin-bottom:6px;
color:white;
}

.remedy-preview{
font-size:13px;
font-weight:800;
color:var(--primary-300);
}

.condition-preview{
font-size:12px;
font-weight:600;
color:#ede9fe;
margin-top:5px;
line-height:1.4;
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
flex-shrink:0;
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
padding:24px 18px;
}

.history-card{
padding:20px;
border-radius:26px;
}

.symptom-info h3{
font-size:17px;
}

.record-summary{
gap:10px;
}
}
      `}</style>
    </div>
  );
};

export default HistoryPage;