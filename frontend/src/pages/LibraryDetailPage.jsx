import React, { useState, useEffect } from 'react';
import {
ChevronLeft,
Info,
BookOpen,
ScrollText
} from 'lucide-react';

import {
useNavigate,
useParams,
useLocation
} from 'react-router-dom';

import { getRemedyDetails } from '../services/api';

const LibraryDetailPage = ()=>{

const {name}=useParams();
const navigate=useNavigate();
const location=useLocation();

const [remedy,setRemedy]=useState(location.state || null);
const [loading,setLoading]=useState(!location.state);

useEffect(()=>{

if(!remedy){

const fetchDetails=async()=>{
const data=await getRemedyDetails(
decodeURIComponent(name)
);

setRemedy(data);
setLoading(false);
};

fetchDetails();

}

},[name,remedy]);

if(loading){
return(
<div className="loading-full">
Opening Archives...
</div>
);
}

if(!remedy){
return(
<div className="error-full">
Remedy not found in library.
</div>
);
}

return(

<div className="library-detail-container fade-in">

<header className="library-detail-header">

<button
className="back-btn"
onClick={()=>navigate(-1)}
>
<ChevronLeft size={24} color="white"/>
</button>

<div className="rem-header-icon-box">
<ScrollText size={40} color="white"/>
</div>

<span className="mini-label">
Classical Materia Medica
</span>

<h1>{remedy.name}</h1>

<div className="source-badge">
<BookOpen size={14}/>
<span>
{remedy.source || 'Classic Reference'}
</span>
</div>

</header>

<div className="library-detail-body">

{remedy.details.map((detail,idx)=>(

<div
key={idx}
className="detail-section slide-up"
style={{
animationDelay:`${idx*.06}s`
}}
>

<div className="detail-category">
<Info size={18}/>
<h3>{detail.category}</h3>
</div>

<div className="detail-description">
<p>
{detail.description}
</p>
</div>

<div className="card-glow"></div>

</div>

))}

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

/* CONTAINER */

.library-detail-container{
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
}

/* HEADER */

.library-detail-header{
padding:82px 24px 56px;

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

border-bottom-left-radius:42px;
border-bottom-right-radius:42px;

position:relative;
overflow:hidden;

box-shadow:
0 18px 40px var(--glow),
0 4px 12px rgba(76,29,149,.16);
}

.library-detail-header:after{
content:"";
position:absolute;
width:190px;
height:190px;
border-radius:50%;
background:rgba(255,255,255,.09);
top:-70px;
right:-60px;
}

.library-detail-header:before{
content:"";
position:absolute;
width:150px;
height:150px;
border-radius:50%;
background:rgba(255,255,255,.06);
bottom:-70px;
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

.rem-header-icon-box{
width:88px;
height:88px;

border-radius:26px;

background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.22);

display:flex;
align-items:center;
justify-content:center;

margin-bottom:18px;

backdrop-filter:blur(14px);

box-shadow:
0 14px 28px rgba(0,0,0,.16),
inset 0 1px 0 rgba(255,255,255,.14);

z-index:2;
}

.mini-label{
font-size:11px;
font-weight:800;
color:var(--primary-300);

text-transform:uppercase;
letter-spacing:.7px;

margin-bottom:8px;
z-index:2;
}

.library-detail-header h1{
font-size:34px;
font-weight:900;
color:white;

margin-bottom:14px;
text-align:center;

z-index:2;
}

.source-badge{
display:flex;
align-items:center;
gap:8px;

padding:8px 18px;

border-radius:999px;

background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.18);

backdrop-filter:blur(12px);

color:white;
font-size:12px;
font-weight:800;

z-index:2;
}

/* BODY */

.library-detail-body{
padding:30px 22px;
display:flex;
flex-direction:column;
gap:20px;
}

/* CARDS */

.detail-section{

padding:24px;
border-radius:30px;

background:
linear-gradient(
145deg,
var(--primary-900),
var(--primary-600)
);

border:1px solid rgba(255,255,255,.12);

box-shadow:
0 18px 40px var(--glow),
0 4px 10px rgba(76,29,149,.14);

position:relative;
overflow:hidden;

color:white;
}

.detail-section:nth-child(even){
background:
linear-gradient(
145deg,
var(--primary-800),
var(--primary-600)
);
}

.detail-section:nth-child(3n){
background:
linear-gradient(
145deg,
var(--primary-950),
var(--primary-700)
);
}

.detail-section:after{
content:"";
position:absolute;
width:140px;
height:140px;
right:-45px;
top:-45px;
border-radius:50%;
background:rgba(255,255,255,.08);
}

.detail-category{
display:flex;
align-items:center;
gap:12px;

margin-bottom:18px;
padding-bottom:14px;

border-bottom:1px solid rgba(255,255,255,.14);

position:relative;
z-index:1;
}

.detail-category svg{
color:#ddd6fe;
}

.detail-category h3{
font-size:15px;
font-weight:900;

letter-spacing:.5px;
text-transform:uppercase;
}

.detail-description{
position:relative;
z-index:1;
}

.detail-description p{
font-size:15px;
line-height:1.75;
font-weight:500;
color:#e5e7eb;
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

/* STATES */

.loading-full,
.error-full{
height:100vh;

display:flex;
align-items:center;
justify-content:center;

background:
linear-gradient(
180deg,
#f8f4ff,
#efe7ff
);

font-weight:900;
color:#7c3aed;
}

`}</style>

</div>

);

};

export default LibraryDetailPage;