import React from 'react';
import { ChevronLeft, Search, Mic, Scan, Activity, Thermometer, Brain, Heart, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SymptomSearchPage = () => {
    const navigate = useNavigate();

    const quickSearches = [
        { name: "Headache", icon: <Thermometer size={24} color="#F87171" />, color: "red" },
        { name: "Cold", icon: <Activity size={24} color="#60A5FA" />, color: "blue" },
        { name: "Anxiety", icon: <Heart size={24} color="#34D399" />, color: "green" },
        { name: "Digestive", icon: <Brain size={24} color="#FBBF24" />, color: "yellow" }
    ];

    return (
        <div className="search-page-container fade-in">
            <header className="search-header gradient-bg">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} color="white" />
                </button>
                <div className="search-header-content">
                    <h1>Describe Symptoms</h1>
                    <div className="search-icon-bg">
                        <Search size={80} color="rgba(255,255,255,0.1)" />
                    </div>
                </div>
            </header>

            <div className="search-body">
                <section className="search-intro">
                    <h2>How are you feeling?</h2>
                    <p>You can describe multiple symptoms. Let our AI find the common diagnosis.</p>
                </section>

                <section className="common-searches">
                    <h3>Common Searches</h3>
                    <div className="quick-grid">
                        {quickSearches.map((s, i) => (
                            <div key={i} className="quick-card">
                                <div className="quick-icon-box">
                                   {s.icon}
                                </div>
                                <span>{s.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="search-input-section">
                    <div className="main-search-card">
                        <div className="input-row">
                            <Mic size={24} color="#9ca3af" />
                            <textarea 
                                placeholder="Search or describe symptoms (e.g. slight fever tonight)..."
                                className="search-textarea"
                            />
                            <div className="scan-icon-box">
                                <Scan size={24} color="#8b5cf6" />
                            </div>
                        </div>
                        
                        <button className="btn-save-list">
                            <PlusCircle size={20} />
                            Save Symptom to List
                        </button>
                    </div>

                    <button className="btn btn-primary analyze-now" onClick={() => navigate('/find')}>
                        Analyze Now
                    </button>
                </div>
            </div>

            <style>{`

:root{
--primary-950:#1e0738;
--primary-900:#2d0a54;
--primary-800:#4c1d95;
--primary-700:#6d28d9;
--primary-600:#8f56eb;
--primary-400:#c4b5fd;
--primary-300:#ddd6fe;
--glow:rgba(143,86,235,.28);
}

.search-page-container{
min-height:100vh;
padding-bottom:50px;

background:
radial-gradient(circle at top right,
rgba(143,86,235,.18),
transparent 34%),
linear-gradient(
180deg,
#f8f4ff,
#efe7ff
);
}

/* HEADER */

.search-header{
padding:78px 24px 38px;

border-bottom-left-radius:42px;
border-bottom-right-radius:42px;

background:
linear-gradient(
135deg,
#2d0a54 0%,
#5b21b6 45%,
#8f56eb 100%
);

position:relative;
overflow:hidden;

box-shadow:
0 18px 40px var(--glow),
0 4px 12px rgba(76,29,149,.16);
}

.search-header:after{
content:"";
position:absolute;
width:190px;
height:190px;
right:-60px;
top:-70px;
border-radius:50%;
background:rgba(255,255,255,.08);
}

.search-header:before{
content:"";
position:absolute;
width:150px;
height:150px;
left:-50px;
bottom:-70px;
border-radius:50%;
background:rgba(255,255,255,.05);
}

.back-btn{
position:absolute;
top:58px;
left:20px;

width:46px;
height:46px;

background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.22);

border-radius:15px;
backdrop-filter:blur(14px);

display:flex;
align-items:center;
justify-content:center;

box-shadow:
0 14px 28px rgba(0,0,0,.16),
inset 0 1px 0 rgba(255,255,255,.16);

z-index:3;
}

.search-header h1{
font-size:30px;
font-weight:900;
color:white;
margin-top:24px;
position:relative;
z-index:2;
}

.search-icon-bg{
position:absolute;
right:-10px;
top:50px;
transform:rotate(14deg);
}

/* BODY */

.search-body{
padding:28px 22px;
}

/* INTRO */

.search-intro{
padding:24px;
border-radius:30px;

background:
linear-gradient(
145deg,
rgba(255,255,255,.98),
rgba(243,235,255,.92)
);

border:1px solid rgba(143,86,235,.12);

box-shadow:
0 18px 34px rgba(143,86,235,.10),
inset 0 1px 0 rgba(255,255,255,.95);

margin-bottom:28px;
}

.search-intro h2{
font-size:26px;
font-weight:900;
color:#24143f;
margin-bottom:10px;
}

.search-intro p{
font-size:14px;
line-height:1.6;
font-weight:600;
color:#7c3aed;
}

/* QUICK SEARCH */

.common-searches h3{
font-size:13px;
font-weight:900;
letter-spacing:.6px;
text-transform:uppercase;
color:#5b21b6;
margin-bottom:16px;
}

.quick-grid{
display:flex;
gap:14px;
overflow-x:auto;
padding-bottom:18px;
margin-bottom:24px;
scrollbar-width:none;
}

.quick-grid::-webkit-scrollbar{
display:none;
}

.quick-card{
min-width:108px;

padding:22px 16px;
border-radius:28px;

display:flex;
flex-direction:column;
align-items:center;
gap:12px;

background:
linear-gradient(
145deg,
var(--primary-900),
var(--primary-600)
);

color:white;

box-shadow:
0 18px 40px var(--glow);

position:relative;
overflow:hidden;
}

.quick-card:nth-child(even){
background:
linear-gradient(
145deg,
var(--primary-800),
var(--primary-600)
);
}

.quick-card:after{
content:"";
position:absolute;
width:100px;
height:100px;
right:-30px;
top:-30px;
border-radius:50%;
background:rgba(255,255,255,.07);
}

.quick-icon-box{
width:56px;
height:56px;

border-radius:18px;

background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.16);

display:flex;
align-items:center;
justify-content:center;

z-index:1;
}

.quick-card span{
font-size:12px;
font-weight:900;
z-index:1;
}

/* MAIN SEARCH CARD */

.main-search-card{
padding:24px;
border-radius:32px;

background:
linear-gradient(
145deg,
rgba(255,255,255,.98),
rgba(243,235,255,.92)
);

border:1px solid rgba(143,86,235,.12);

box-shadow:
0 18px 34px rgba(143,86,235,.10);

margin-bottom:28px;
}

.input-row{
display:flex;
align-items:flex-start;
gap:14px;

padding:18px;

background:#f8f5ff;
border:1px solid #ede9fe;

border-radius:22px;
margin-bottom:20px;
}

.search-textarea{
flex:1;
background:transparent;
border:none;
resize:none;
height:88px;

font-size:15px;
font-weight:700;
font-family:inherit;

color:#312e81;
outline:none;
}

.search-textarea::placeholder{
color:#8b5cf6;
}

.scan-icon-box{
width:46px;
height:46px;
border-radius:15px;

background:white;

display:flex;
align-items:center;
justify-content:center;

box-shadow:
0 10px 18px rgba(143,86,235,.12);
}

/* SAVE BUTTON */

.btn-save-list{
width:100%;
padding:17px;

border:none;
border-radius:20px;

background:
linear-gradient(
135deg,
#2d0a54,
#5b21b6,
#8f56eb
);

color:white;
font-size:14px;
font-weight:900;

display:flex;
align-items:center;
justify-content:center;
gap:10px;

box-shadow:
0 16px 28px rgba(143,86,235,.22);
}

/* ANALYZE */

.analyze-now{
width:100%;
height:62px;

border:none;
border-radius:22px;

background:
linear-gradient(
135deg,
#2d0a54,
#5b21b6,
#8f56eb
);

color:white;
font-size:16px;
font-weight:900;

box-shadow:
0 18px 34px rgba(143,86,235,.28);
}

/* MOBILE */

@media(max-width:420px){

.search-body{
padding:24px 18px;
}

.search-intro,
.main-search-card{
padding:20px;
border-radius:28px;
}

.quick-card{
min-width:98px;
padding:18px 14px;
}

.quick-icon-box{
width:50px;
height:50px;
}

}

`}</style>
        </div>
    );
};

export default SymptomSearchPage;
