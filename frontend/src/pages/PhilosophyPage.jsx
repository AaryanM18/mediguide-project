import React,{useState,useEffect} from 'react';
import {
ChevronLeft,
Scale,
Search,
Book
} from 'lucide-react';

import {useNavigate} from 'react-router-dom';
import {getPhilosophy} from '../services/api';

const PhilosophyPage=()=>{

const navigate=useNavigate();

const [aphorisms,setAphorisms]=useState([]);
const [searchQuery,setSearchQuery]=useState('');
const [loading,setLoading]=useState(true);

useEffect(()=>{

const fetch=async()=>{
const data=await getPhilosophy();
setAphorisms(data);
setLoading(false);
};

fetch();

},[]);

const filtered=aphorisms.filter(a=>
a.text.toLowerCase().includes(
searchQuery.toLowerCase()
)||
a.id.toString().includes(searchQuery)
);

return(

<div className="philosophy-container fade-in">

<header className="philosophy-header">

<button
className="back-btn"
onClick={()=>navigate(-1)}
>
<ChevronLeft size={24} color="white"/>
</button>

<div className="phi-header-content">

<div className="header-icon-orb">
<Scale size={36} color="white"/>
</div>

<span className="mini-label">
Classical Philosophy
</span>

<h1>Organon of Medicine</h1>

<p>
The philosophical foundation of Homeopathy by Samuel Hahnemann.
</p>

</div>

<div className="phi-search">

<Search size={18} color="#ddd6fe"/>

<input
type="text"
placeholder="Search aphorisms (e.g §1)"
value={searchQuery}
onChange={(e)=>
setSearchQuery(e.target.value)
}
/>

</div>

</header>

<div className="philosophy-body">

{loading ? (

<div className="phi-loading">
Consulting the Organon...
</div>

):(

<div className="aphorism-list">

{filtered.map((a,idx)=>(

<div
key={idx}
className="aphorism-card slide-up"
style={{
animationDelay:`${idx*.04}s`
}}
>

<div className="phi-id">
§ {a.id}
</div>

<p className="phi-text">
{a.text}
</p>

<div className="card-glow"></div>

</div>

))}

{filtered.length===0 && (
<div className="phi-none">
No aphorisms found.
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
--primary-400:#c4b5fd;
--primary-300:#ddd6fe;
--glow:rgba(143,86,235,.28);
}

.philosophy-container{
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

.philosophy-header{
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
0 16px 38px var(--glow),
0 4px 12px rgba(76,29,149,.16);
}

.philosophy-header:after{
content:"";
position:absolute;
width:190px;
height:190px;
border-radius:50%;
background:rgba(255,255,255,.09);
top:-70px;
right:-60px;
}

.philosophy-header:before{
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

.phi-header-content{
text-align:center;
display:flex;
flex-direction:column;
align-items:center;
margin-bottom:24px;
z-index:2;
}

.header-icon-orb{
width:74px;
height:74px;

border-radius:24px;

background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.22);

display:flex;
align-items:center;
justify-content:center;

margin-bottom:16px;

backdrop-filter:blur(14px);
}

.mini-label{
font-size:11px;
font-weight:800;
letter-spacing:.7px;
text-transform:uppercase;
color:var(--primary-300);
}

.phi-header-content h1{
font-size:30px;
font-weight:900;
color:white;
margin:8px 0 8px;
}

.phi-header-content p{
color:var(--primary-300);
font-size:14px;
max-width:290px;
line-height:1.5;
}

.phi-search{
width:100%;
max-width:340px;

padding:14px 18px;
border-radius:18px;

background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.22);

display:flex;
align-items:center;
gap:10px;

z-index:2;
}

.phi-search input{
border:none;
outline:none;
background:transparent;
width:100%;

font-size:14px;
font-weight:700;
color:white;
}

.phi-search input::placeholder{
color:#ddd6fe;
}

.philosophy-body{
padding:30px 24px;
}

.aphorism-list{
display:flex;
flex-direction:column;
gap:18px;
}

.aphorism-card{
padding:24px;
border-radius:30px;

background:
linear-gradient(
145deg,
var(--primary-900),
var(--primary-600)
);

color:white;

border:1px solid rgba(255,255,255,.12);

box-shadow:
0 18px 40px var(--glow),
0 4px 10px rgba(76,29,149,.14);

position:relative;
overflow:hidden;
}

.aphorism-card:nth-child(even){
background:
linear-gradient(
145deg,
var(--primary-800),
var(--primary-600)
);
}

.aphorism-card:nth-child(3n){
background:
linear-gradient(
145deg,
var(--primary-950),
var(--primary-700)
);
}

.aphorism-card:after{
content:"";
position:absolute;
width:130px;
height:130px;
right:-40px;
top:-40px;
border-radius:50%;
background:rgba(255,255,255,.08);
}

.phi-id{
display:inline-block;

padding:6px 14px;
border-radius:10px;

background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.12);

font-size:12px;
font-weight:900;
letter-spacing:.5px;

margin-bottom:16px;

position:relative;
z-index:1;
}

.phi-text{
font-size:15px;
line-height:1.72;
font-weight:500;
color:#e5e7eb;

position:relative;
z-index:1;
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

.phi-loading,
.phi-none{
text-align:center;
padding:60px;
font-weight:900;
color:#7c3aed;
}

`}</style>

</div>

);

};

export default PhilosophyPage;