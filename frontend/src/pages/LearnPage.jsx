import React, { useState, useEffect } from 'react';
import {
ChevronLeft,
Droplets,
BookOpen,
Search,
Pill,
ChevronRight,
Scale,
ScrollText
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { searchLibrary } from '../services/api';

const LearnPage = () => {

const navigate = useNavigate();

const [searchQuery,setSearchQuery]=useState('');
const [results,setResults]=useState([]);
const [loading,setLoading]=useState(false);
const [activeTab,setActiveTab]=useState('library');

useEffect(()=>{

const fetchInitial=async()=>{
setLoading(true);
const initial=await searchLibrary('');
setResults(initial);
setLoading(false);
};

fetchInitial();

},[]);

const handleSearch=async(e)=>{
const q=e.target.value;
setSearchQuery(q);

if(activeTab!=='library'){
setActiveTab('library');
}

setLoading(true);

const searchResults=await searchLibrary(q);
setResults(searchResults);

setLoading(false);
};

const referenceBooks=[
{
name:"Organon of Medicine",
author:"Samuel Hahnemann",
desc:"Philosophical foundation of homeopathy."
},
{
name:"Materia Medica Pura",
author:"Samuel Hahnemann",
desc:"Pure remedy provings and symptoms."
},
{
name:"Boericke's Materia Medica",
author:"William Boericke",
desc:"Clinical descriptions of remedies."
},
{
name:"Allen's Keynotes",
author:"H.C Allen",
desc:"Keynote symptoms for remedy choice."
}
];

const healthPrinciples=[
{
title:"Avoid Strong Smells",
desc:"Camphor, coffee and perfumes may antidote remedies."
},
{
title:"Clean Palate",
desc:"Wait before or after food before taking medicines."
},
{
title:"Holistic View",
desc:"Treats the person not merely disease."
}
];

return(
<div className="learn-container fade-in">

<header className="learn-header">

<button className="back-btn"
onClick={()=>navigate(-1)}>
<ChevronLeft size={24} color="white"/>
</button>

<div className="learn-header-content">

<div className="header-icon-orb">
<BookOpen size={34} color="white"/>
</div>

<span className="mini-label">
Knowledge Hub
</span>

<h1>Knowledge Hub</h1>

<p className="subtitle">
Explore libraries, principles and historical reference books.
</p>

</div>

<div className="search-bar-container">

<Search size={18} color="#ddd6fe"/>

<input
type="search"
placeholder="Search medicines or symptoms..."
value={searchQuery}
onChange={handleSearch}
/>

</div>

<div className="tab-switcher">

<button
className={activeTab==='library'?'active':''}
onClick={()=>setActiveTab('library')}
>
Library
</button>

<button
className={activeTab==='knowledge'?'active':''}
onClick={()=>setActiveTab('knowledge')}
>
Health Tips
</button>

</div>

</header>

<div className="learn-body">

{activeTab==='library' ? (

<div className="results-section">

{searchQuery==='' && (

<div className="info-cards-row">

<div
className="mini-info-card"
onClick={()=>navigate('/philosophy')}
>
<Scale size={20}/>
<span>Organon (§)</span>
</div>

<div className="mini-info-card">
<Droplets size={20}/>
<span>Potency</span>
</div>

</div>

)}

<h3 className="section-title">
{searchQuery
?`Search Results (${results.length})`
:'Materia Medica (A-Z)'
}
</h3>

{loading ? (

<div className="loading-state">
Consulting the archives...
</div>

):(

<div className="remedy-list">

{results.map((rem,idx)=>(

<div
key={idx}
className="remedy-list-item slide-up"
style={{animationDelay:`${idx*.04}s`}}
onClick={()=>navigate(
`/remedy-library/${encodeURIComponent(rem.name)}`,
{state:rem}
)}
>

<div className="rem-icon">
<Pill size={20}/>
</div>

<div className="rem-info">
<h4>{rem.name}</h4>
<p>{rem.source || 'Historical Reference'}</p>
</div>

<ChevronRight size={18} color="#ddd6fe"/>

</div>

))}

</div>

)}

</div>

):(

<div className="knowledge-section fade-in">

<section className="knowledge-block">

<h3 className="section-title">
<BookOpen size={20}/>
Reference Books
</h3>

<div className="books-grid">

{referenceBooks.map((book,i)=>(

<div key={i} className="book-card">
<h4>{book.name}</h4>
<span className="author">
{book.author}
</span>
<p>{book.desc}</p>
</div>

))}

</div>

</section>

<section className="knowledge-block">

<h3 className="section-title">
<ScrollText size={20}/>
Health Principles
</h3>

{healthPrinciples.map((tip,i)=>(

<div key={i} className="tip-card">

<div className="tip-circle">
{i+1}
</div>

<div className="tip-text">
<h5>{tip.title}</h5>
<p>{tip.desc}</p>
</div>

</div>

))}

</section>

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
--primary-300:#ddd6fe;
--glow:rgba(143,86,235,.28);
}

.learn-container{
min-height:100vh;
background:
radial-gradient(circle at top right,
rgba(143,86,235,.18),
transparent 34%),
linear-gradient(180deg,#f8f4ff,#efe7ff);
}

.learn-header{
padding:78px 24px 32px;

border-bottom-left-radius:42px;
border-bottom-right-radius:42px;

background:
linear-gradient(
135deg,
#2d0a54 0%,
#5b21b6 45%,
#8f56eb 100%
);

text-align:center;
position:relative;
overflow:hidden;

box-shadow:
0 16px 38px var(--glow),
0 4px 12px rgba(76,29,149,.16);
}

.learn-header:after{
content:"";
position:absolute;
width:190px;
height:190px;
border-radius:50%;
background:rgba(255,255,255,.09);
top:-70px;
right:-60px;
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

margin:0 auto 16px;

backdrop-filter:blur(14px);
}

.mini-label{
font-size:11px;
font-weight:800;
color:var(--primary-300);
text-transform:uppercase;
letter-spacing:.7px;
}

.learn-header h1{
font-size:30px;
font-weight:900;
color:white;
margin:8px 0;
}

.subtitle{
font-size:14px;
color:var(--primary-300);
margin-bottom:22px;
}

.search-bar-container{
width:100%;
padding:14px 18px;

background:rgba(255,255,255,.14);
border:1px solid rgba(255,255,255,.22);

border-radius:18px;

display:flex;
align-items:center;
gap:10px;

margin-bottom:20px;
}

.search-bar-container input{
background:transparent;
border:none;
outline:none;
width:100%;
font-size:14px;
font-weight:700;
color:white;
}

.tab-switcher{
display:flex;
background:rgba(255,255,255,.08);
padding:4px;
gap:4px;
border-radius:100px;
max-width:280px;
margin:auto;
}

.tab-switcher button{
flex:1;
border:none;
background:none;
padding:10px;
border-radius:100px;
color:#c4b5fd;
font-weight:800;
}

.tab-switcher button.active{
background:rgba(255,255,255,.18);
color:white;
}

.learn-body{
padding:28px 24px;
}

.info-cards-row{
display:flex;
gap:12px;
margin-bottom:24px;
}

.mini-info-card,
.remedy-list-item,
.book-card,
.tip-card{

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
}

.mini-info-card{
flex:1;
padding:18px;
border-radius:24px;
display:flex;
align-items:center;
gap:10px;
color:white;
cursor:pointer;
}

.section-title{
display:flex;
align-items:center;
gap:10px;
font-size:18px;
font-weight:900;
color:#24143f;
margin-bottom:20px;
}

.remedy-list-item{
padding:18px;
border-radius:28px;
display:flex;
align-items:center;
gap:16px;
margin-bottom:14px;
color:white;
cursor:pointer;
position:relative;
overflow:hidden;
}

.remedy-list-item:after{
content:"";
position:absolute;
width:120px;
height:120px;
right:-35px;
top:-35px;
border-radius:50%;
background:rgba(255,255,255,.08);
}

.rem-icon{
width:50px;
height:50px;
border-radius:15px;
background:rgba(255,255,255,.16);

display:flex;
align-items:center;
justify-content:center;
color:#ddd6fe;
}

.rem-info h4{
font-size:16px;
font-weight:900;
margin-bottom:3px;
}

.rem-info p{
font-size:12px;
color:#ddd6fe;
}

.books-grid{
display:grid;
grid-template-columns:1fr 1fr;
gap:14px;
}

.book-card{
padding:18px;
border-radius:24px;
color:white;
}

.book-card h4{
font-size:14px;
font-weight:900;
}

.author{
display:block;
font-size:10px;
font-weight:700;
margin:8px 0;
color:#c4b5fd;
}

.book-card p{
font-size:11px;
line-height:1.4;
}

.knowledge-block{
margin-top:28px;
}

.tip-card{
padding:18px;
border-radius:24px;
display:flex;
align-items:center;
gap:16px;
margin-bottom:14px;
color:white;
}

.tip-circle{
width:34px;
height:34px;
border-radius:50%;

background:rgba(255,255,255,.16);

display:flex;
align-items:center;
justify-content:center;

font-weight:900;
}

.tip-text h5{
font-size:14px;
font-weight:900;
margin-bottom:4px;
}

.tip-text p{
font-size:12px;
color:#ddd6fe;
}

.loading-state{
text-align:center;
padding:50px;
font-weight:900;
color:#7c3aed;
}

`}</style>

</div>
);

};

export default LearnPage;