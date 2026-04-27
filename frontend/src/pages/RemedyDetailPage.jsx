import React,{useState,useEffect} from 'react';
import {
X,
Bookmark,
BookmarkCheck,
Droplets,
HelpCircle,
ChevronRight,
BookOpen,
ShieldCheck,
Info
} from 'lucide-react';

import {useNavigate,useLocation} from 'react-router-dom';
import {
updateSavedRemedies,
getSavedRemedies
} from '../services/api';

const RemedyDetailPage=({user})=>{

const navigate=useNavigate();
const location=useLocation();

const [remedyData]=useState(location.state||null);
const [isSaved,setIsSaved]=useState(false);

const remedyName=
remedyData?.remedy_name||
remedyData?.name||
remedyData?.remedy?.name||'';

const potency=
remedyData?.potency||
remedyData?.remedy?.potency||
'Not available';

const symptoms=
remedyData?.symptoms||
remedyData?.symptom||
'Not available';

const severity=
remedyData?.severity||
'Not available';

const rationale=
remedyData?.remedy_reason||
remedyData?.why_this_remedy||
'No explanation available.';

const sourceBook=
remedyData?.source_book||
'Source not available';

useEffect(()=>{

const checkSaved=async()=>{

if(!user?.id || !remedyName) return;

const res=await getSavedRemedies(user.id);

if(res.success){
setIsSaved(
res.saved_remedies.some(
r=>(r.remedy?.name||r.name)===remedyName
)
);
}

};

checkSaved();

},[user?.id,remedyName]);

const toggleSave=async()=>{

if(!user?.id||!remedyName) return;

let saved=
JSON.parse(
localStorage.getItem(
`saved_remedies_${user.id}`
)
)||[];

if(isSaved){
saved=saved.filter(
r=>(r.remedy?.name||r.name)!==remedyName
);
}else{
saved.push({
name:remedyName,
potency
});
}

await updateSavedRemedies(
user.id,
saved
);

setIsSaved(!isSaved);

};

if(!remedyData){
return(
<div className="remedy-detail-container">
<div className="empty-state">
<Info size={50}/>
<h3>No remedy details found</h3>
<p>
Please run a consultation first.
</p>
<button
className="full-library-btn"
onClick={()=>navigate('/find')}
>
Start Consultation
</button>
</div>

<style>{styles}</style>
</div>
);
}

return(

<div className="remedy-detail-container fade-in">

<header className="detail-header">

<button
className="icon-btn"
onClick={()=>navigate(-1)}
>
<X size={24} color="white"/>
</button>

<h2>Remedy Insight</h2>

<button
className={`icon-btn ${
isSaved?'saved':''
}`}
onClick={toggleSave}
>
{isSaved
?<BookmarkCheck size={24} color="white"/>
:<Bookmark size={24} color="white"/>
}
</button>

</header>

<div className="remedy-card-main">

<div className="remedy-icon-lg">
<div className="inner-remedy-icon">
<div className="bottle-icon">
+
</div>
</div>
</div>

<div className="remedy-title-section">
<h1>{remedyName}</h1>
<p>
Referenced for: {symptoms}
</p>
</div>

<div className="stats-grid">

<div className="stat-card">
<div className="stat-icon-bg">
<Info size={20}/>
</div>

<div className="stat-value">
{severity.toString().toUpperCase()}
</div>

<div className="stat-label">
Intensity
</div>
</div>

<div className="stat-card">
<div className="stat-icon-bg red">
<Droplets size={20}/>
</div>

<div className="stat-value">
{potency}
</div>

<div className="stat-label">
Potency
</div>
</div>

</div>

<div className="remedy-section">

<div className="section-head">
<h3>
<ShieldCheck size={20}/>
Medical Rationale
</h3>
</div>

<div className="overview-content">
<p>{rationale}</p>

<button
className="full-library-btn"
onClick={()=>
navigate(
`/remedy-library/${encodeURIComponent(remedyName)}`
)
}
>
<BookOpen size={16}/>
<span>
View Full Materia Medica
</span>
<ChevronRight size={16}/>
</button>

</div>

</div>

<div className="remedy-section">

<div className="section-head">
<h3>
<Info size={20}/>
Consultation Notes
</h3>
</div>

<div className="matched-symptom-tag">
<HelpCircle size={20}/>
<span>
Source: {sourceBook}
</span>
</div>

</div>

</div>

<style>{styles}</style>

</div>

);

};

const styles=`

:root{
--primary-950:#1e0738;
--primary-900:#2d0a54;
--primary-800:#4c1d95;
--primary-700:#6d28d9;
--primary-600:#8f56eb;
--primary-300:#ddd6fe;
--glow:rgba(143,86,235,.28);
}

.remedy-detail-container{
min-height:100vh;

background:
radial-gradient(circle at top right,
rgba(143,86,235,.18),
transparent 34%),
linear-gradient(
180deg,
#f8f4ff,
#efe7ff
);

padding-bottom:40px;
}

.detail-header{
padding:62px 22px 28px;

display:flex;
align-items:center;
justify-content:space-between;
}

.detail-header h2{
font-size:18px;
font-weight:900;
color:#24143f;
}

.icon-btn{
width:46px;
height:46px;

border:none;
border-radius:15px;

background:
linear-gradient(
135deg,
#2d0a54,
#8f56eb
);

display:flex;
align-items:center;
justify-content:center;

box-shadow:
0 12px 24px rgba(143,86,235,.24);
}

.icon-btn.saved{
background:
linear-gradient(
135deg,
#5b21b6,
#a78bfa
);
}

.remedy-card-main{
margin:0 18px;

padding:34px 22px;
border-radius:38px;

background:
linear-gradient(
135deg,
#2d0a54 0%,
#5b21b6 48%,
#8f56eb 100%
);

display:flex;
flex-direction:column;
align-items:center;

box-shadow:
0 24px 48px rgba(143,86,235,.34);

position:relative;
overflow:hidden;
}

.remedy-card-main:after{
content:"";
position:absolute;
width:170px;
height:170px;
right:-55px;
top:-55px;
border-radius:50%;
background:rgba(255,255,255,.08);
}

.remedy-icon-lg{
width:104px;
height:104px;
border-radius:34px;

background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.18);

display:flex;
align-items:center;
justify-content:center;

margin-bottom:28px;
z-index:1;
}

.inner-remedy-icon{
width:62px;
height:62px;
border-radius:18px;

background:rgba(255,255,255,.18);

display:flex;
align-items:center;
justify-content:center;
}

.bottle-icon{
font-size:30px;
font-weight:900;
color:white;
}

.remedy-title-section{
text-align:center;
margin-bottom:30px;
z-index:1;
}

.remedy-title-section h1{
font-size:32px;
font-weight:900;
color:white;
margin-bottom:6px;
}

.remedy-title-section p{
font-size:13px;
font-weight:700;
color:#ddd6fe;
}

.stats-grid{
display:grid;
grid-template-columns:1fr 1fr;
gap:14px;
width:100%;
margin-bottom:28px;
z-index:1;
}

.stat-card{
padding:18px;
border-radius:24px;

background:rgba(255,255,255,.13);
border:1px solid rgba(255,255,255,.14);

text-align:center;
}

.stat-icon-bg{
width:36px;
height:36px;

margin:0 auto 12px;

border-radius:12px;

background:rgba(196,181,253,.18);

display:flex;
align-items:center;
justify-content:center;

color:#ddd6fe;
}

.stat-icon-bg.red{
background:rgba(251,113,133,.16);
color:#fecdd3;
}

.stat-value{
font-size:15px;
font-weight:900;
color:white;
}

.stat-label{
font-size:10px;
font-weight:800;
letter-spacing:.5px;
text-transform:uppercase;
color:#ddd6fe;
}

.remedy-section{
width:100%;
margin-bottom:24px;
z-index:1;
}

.section-head h3{
display:flex;
align-items:center;
gap:8px;

font-size:17px;
font-weight:900;
color:white;

margin-bottom:14px;
}

.overview-content p{
font-size:14px;
line-height:1.65;
color:#e5e7eb;
margin-bottom:18px;
}

.full-library-btn{
width:100%;
padding:15px 16px;

display:flex;
align-items:center;
gap:10px;

border:none;
border-radius:18px;

background:rgba(255,255,255,.14);

color:white;
font-size:12px;
font-weight:800;
}

.full-library-btn span{
flex:1;
text-align:left;
}

.matched-symptom-tag{
display:flex;
align-items:center;
gap:12px;

padding:16px;
border-radius:18px;

background:rgba(255,255,255,.14);

color:white;
font-size:12px;
font-weight:800;
}

.empty-state{
margin:80px 22px;
padding:34px 24px;

background:white;
border-radius:30px;

box-shadow:
0 14px 28px rgba(143,86,235,.10);

display:flex;
flex-direction:column;
align-items:center;
gap:14px;

text-align:center;
}

.empty-state h3{
font-size:22px;
font-weight:900;
color:#24143f;
}

.empty-state p{
color:#64748b;
}

@media(max-width:420px){

.remedy-card-main{
margin:0 14px;
padding:28px 18px;
border-radius:30px;
}

.stats-grid{
grid-template-columns:1fr;
}

}
`;

export default RemedyDetailPage;