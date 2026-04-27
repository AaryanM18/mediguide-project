import React,{useState,useEffect} from 'react';
import {
ChevronLeft,
Bookmark,
ArrowRight,
Beaker,
Heart
} from 'lucide-react';

import {useNavigate} from 'react-router-dom';
import {getSavedRemedies} from '../services/api';

const SavedPage=({user})=>{

const navigate=useNavigate();

const [savedRemedies,setSavedRemedies]=useState([]);
const [loading,setLoading]=useState(true);

useEffect(()=>{

const fetchSaved=async()=>{

setLoading(true);

const res=await getSavedRemedies(user.id);

if(res.success){
setSavedRemedies(res.saved_remedies);
}

setLoading(false);

};

if(user?.id){
fetchSaved();
}

},[user.id]);

return(

<div className="saved-page fade-in">

<header className="saved-header">

<button
className="back-btn"
onClick={()=>navigate(-1)}
>
<ChevronLeft size={24} color="white"/>
</button>

<div className="header-icon-orb">
<Heart size={34} color="white"/>
</div>

<span className="mini-label">
Personal Collection
</span>

<h1>Saved Remedies</h1>

<p>
{savedRemedies.length} remedies bookmarked
</p>

</header>

<div className="saved-body">

{loading ? (

<div className="empty-state">
<div className="spinner"></div>
<p>Loading saved remedies...</p>
</div>

): savedRemedies.length===0 ? (

<div className="empty-state">

<Bookmark
size={54}
color="#8f56eb"
/>

<h3>No Saved Remedies</h3>

<p>
Remedies you bookmark will appear here.
</p>

<button
className="find-btn"
onClick={()=>navigate('/find')}
>
Find Remedies
</button>

</div>

):( 

<div className="saved-list">

{savedRemedies.map(
(remedy,index)=>(

<div
key={index}
className="saved-card slide-up"
style={{
animationDelay:`${index*.04}s`
}}
onClick={()=>
navigate(
`/remedy/${remedy.remedy?.name||remedy.name}`,
{state:remedy}
)
}
>

<div className="card-icon">
<Beaker size={22}/>
</div>

<div className="card-info">
<h3>
{remedy.remedy?.name||remedy.name}
</h3>

<p>
{remedy.remedy?.potency||remedy.potency}
</p>
</div>

<ArrowRight
size={20}
color="#ddd6fe"
/>

</div>

))
}

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
--primary-400:#c4b5fd;
--primary-300:#ddd6fe;
--glow:rgba(143,86,235,.28);
}

.saved-page{
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

/* HEADER */

.saved-header{
padding:78px 24px 34px;

border-bottom-left-radius:42px;
border-bottom-right-radius:42px;

background:
linear-gradient(
135deg,
#2d0a54 0%,
#5b21b6 45%,
#8f56eb 100%
);

display:flex;
flex-direction:column;
align-items:center;

position:relative;
overflow:hidden;

box-shadow:
0 18px 40px var(--glow),
0 4px 12px rgba(76,29,149,.16);
}

.saved-header:after{
content:"";
position:absolute;
width:190px;
height:190px;
border-radius:50%;
background:rgba(255,255,255,.09);
top:-70px;
right:-60px;
}

.saved-header:before{
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
border:1px solid rgba(255,255,255,.22);

border-radius:15px;

backdrop-filter:blur(14px);

display:flex;
align-items:center;
justify-content:center;

box-shadow:
0 14px 28px rgba(0,0,0,.16),
inset 0 1px 0 rgba(255,255,255,.16);
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

z-index:2;
}

.mini-label{
font-size:11px;
font-weight:800;
letter-spacing:.7px;
text-transform:uppercase;
color:var(--primary-300);

z-index:2;
}

.saved-header h1{
font-size:30px;
font-weight:900;
color:white;

margin:8px 0;
z-index:2;
}

.saved-header p{
font-size:14px;
color:#ddd6fe;
z-index:2;
}

/* BODY */

.saved-body{
padding:30px 22px;
}

.saved-list{
display:flex;
flex-direction:column;
gap:18px;
}

/* CARDS */

.saved-card{
padding:22px;
border-radius:30px;

background:
linear-gradient(
145deg,
var(--primary-900),
var(--primary-600)
);

display:flex;
align-items:center;
gap:16px;

cursor:pointer;
color:white;

border:1px solid rgba(255,255,255,.12);

box-shadow:
0 18px 40px var(--glow),
0 4px 10px rgba(76,29,149,.14);

position:relative;
overflow:hidden;
}

.saved-card:nth-child(even){
background:
linear-gradient(
145deg,
var(--primary-800),
var(--primary-600)
);
}

.saved-card:after{
content:"";
position:absolute;
width:120px;
height:120px;
right:-35px;
top:-35px;
border-radius:50%;
background:rgba(255,255,255,.08);
}

.saved-card:active{
transform:scale(.98);
}

.card-icon{
width:56px;
height:56px;
border-radius:18px;

background:rgba(255,255,255,.15);
border:1px solid rgba(255,255,255,.18);

display:flex;
align-items:center;
justify-content:center;

color:#ddd6fe;

z-index:1;
}

.card-info{
flex:1;
z-index:1;
}

.card-info h3{
font-size:17px;
font-weight:900;
margin-bottom:4px;
}

.card-info p{
font-size:12px;
font-weight:800;
color:#c4b5fd;
}

/* EMPTY */

.empty-state{
min-height:420px;

display:flex;
flex-direction:column;
align-items:center;
justify-content:center;

gap:14px;
text-align:center;
}

.empty-state h3{
font-size:22px;
font-weight:900;
color:#24143f;
}

.empty-state p{
font-size:14px;
max-width:260px;
color:#7c3aed;
}

.find-btn{
margin-top:16px;

padding:14px 28px;
border:none;
border-radius:20px;

background:
linear-gradient(
135deg,
#5b21b6,
#8b5cf6
);

color:white;
font-weight:900;

box-shadow:
0 14px 24px rgba(143,86,235,.22);
}

/* SPINNER */

.spinner{
width:42px;
height:42px;

border:4px solid #ede9fe;
border-top:4px solid #7c3aed;

border-radius:50%;

animation:spin 1s linear infinite;
}

@keyframes spin{
0%{transform:rotate(0)}
100%{transform:rotate(360deg)}
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

@media(max-width:420px){

.saved-body{
padding:24px 18px;
}

.saved-card{
padding:18px;
border-radius:26px;
}

}

`}</style>

</div>

);

};

export default SavedPage;