import React, { useState, useEffect } from 'react';
import {
ChevronLeft,
BookOpen,
Search,
Pill,
ChevronRight,
Scale,
ScrollText,
Library,
Sparkles
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { searchLibrary } from '../services/api';

const LearnPage = () => {
const navigate = useNavigate();

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const [searchQuery,setSearchQuery]=useState('');
const [results,setResults]=useState([]);
const [loading,setLoading]=useState(false);
const [activeTab,setActiveTab]=useState('library');
const [activeLetter,setActiveLetter]=useState('A');

useEffect(()=>{
loadByLetter('A');
},[]);

const loadByLetter=async(letter)=>{
try{
setLoading(true);
setActiveLetter(letter);
setSearchQuery('');

const data=await searchLibrary(letter);
setResults(data || []);
}
catch(err){
console.error('Library load failed:',err);
setResults([]);
}
finally{
setLoading(false);
}
};

const handleSearch=async(e)=>{
const q=e.target.value;
setSearchQuery(q);

if(activeTab!=='library'){
setActiveTab('library');
}

try{
setLoading(true);

if(!q.trim()){
const data=await searchLibrary(activeLetter);
setResults(data || []);
return;
}

const searchResults=await searchLibrary(q);
setResults(searchResults || []);
}
catch(err){
console.error('Search failed:',err);
setResults([]);
}
finally{
setLoading(false);
}
};

const referenceBooks=[
{
name:"Organon of Medicine",
author:"Samuel Hahnemann",
desc:"Foundation of homeopathic philosophy, case taking and principles.",
action:()=>navigate('/philosophy')
},
{
name:"Boericke's Materia Medica",
author:"William Boericke",
desc:"Clinical descriptions, keynote symptoms and remedy relationships.",
action:()=>setActiveTab('library')
},
{
name:"Allen's Keynotes",
author:"H.C. Allen",
desc:"Characteristic keynote symptoms used for remedy differentiation.",
action:()=>setActiveTab('library')
},
{
name:"Materia Medica Pura",
author:"Samuel Hahnemann",
desc:"Original proving records and symptom observations.",
action:()=>setActiveTab('library')
}
];

const healthPrinciples=[
{
title:"Like Cures Like",
desc:"A substance producing symptoms in a healthy person may help similar symptoms in a patient."
},
{
title:"Minimum Dose",
desc:"The smallest effective dose is preferred to stimulate the body's response gently."
},
{
title:"Totality of Symptoms",
desc:"Remedy selection considers physical, mental and emotional symptoms together."
},
{
title:"Individualization",
desc:"Two people with the same complaint may need different remedies based on their constitution."
}
];

return(
<div className="learn-container fade-in">

<header className="learn-header">

<button className="back-btn" onClick={()=>navigate(-1)}>
<ChevronLeft size={24} color="white"/>
</button>

<div className="learn-header-content">

<div className="header-icon-orb">
<BookOpen size={34} color="white"/>
</div>

<span className="mini-label">
Classical Knowledge
</span>

<h1>Knowledge Hub</h1>

<p className="subtitle">
Explore remedies, principles and classical references.
</p>

</div>

<div className="search-bar-container">
<Search size={18} color="#ddd6fe"/>

<input
type="search"
placeholder="Search remedies or symptoms..."
value={searchQuery}
onChange={handleSearch}
/>
</div>

<div className="tab-switcher">

<button
className={activeTab==='library'?'active':''}
onClick={()=>setActiveTab('library')}
>
Materia Medica
</button>

<button
className={activeTab==='knowledge'?'active':''}
onClick={()=>setActiveTab('knowledge')}
>
Principles
</button>

</div>

</header>

<div className="learn-body">

{activeTab==='library' ? (

<div className="results-section">

{!searchQuery && (
<div className="alphabet-scroll">
{letters.map(letter=>(
<button
key={letter}
className={activeLetter===letter?'active-letter':''}
onClick={()=>loadByLetter(letter)}
>
{letter}
</button>
))}
</div>
)}

{searchQuery==='' && (
<div className="info-cards-row">

<div
className="mini-info-card"
onClick={()=>navigate('/philosophy')}
>
<Scale size={20}/>
<span>Organon</span>
</div>

<div
className="mini-info-card"
onClick={()=>setActiveTab('knowledge')}
>
<Sparkles size={20}/>
<span>Principles</span>
</div>

</div>
)}

<h3 className="section-title">
{searchQuery
?`Search Results (${results.length})`
:`Materia Medica (${activeLetter})`
}
</h3>

{loading ? (

<div className="loading-state">
Loading knowledge archive...
</div>

):(

<div className="remedy-list">

{results.length===0 ? (

<div className="empty-state">
<Library size={34}/>
<h4>No records found</h4>
<p>Try another letter or search term.</p>
</div>

):(

results.map((rem,idx)=>(

<div
key={`${rem.name}-${idx}`}
className="remedy-list-item slide-up"
style={{animationDelay:`${idx*.025}s`}}
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

))

)}

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

<div
key={i}
className="book-card"
onClick={book.action}
>
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
Core Principles
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

z-index:3;
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
position:relative;
z-index:2;
}

.mini-label{
font-size:11px;
font-weight:800;
color:var(--primary-300);
text-transform:uppercase;
letter-spacing:.7px;
position:relative;
z-index:2;
}

.learn-header h1{
font-size:30px;
font-weight:900;
color:white;
margin:8px 0;
position:relative;
z-index:2;
}

.subtitle{
font-size:14px;
color:var(--primary-300);
margin-bottom:22px;
position:relative;
z-index:2;
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
position:relative;
z-index:2;
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

.search-bar-container input::placeholder{
color:#ddd6fe;
}

.tab-switcher{
display:flex;
background:rgba(255,255,255,.08);
padding:4px;
gap:4px;
border-radius:100px;
max-width:310px;
margin:auto;
position:relative;
z-index:2;
}

.tab-switcher button{
flex:1;
border:none;
background:none;
padding:10px;
border-radius:100px;
color:#c4b5fd;
font-weight:800;
font-size:13px;
}

.tab-switcher button.active{
background:rgba(255,255,255,.18);
color:white;
}

.learn-body{
padding:26px 24px 90px;
}

.alphabet-scroll{
display:flex;
overflow-x:auto;
gap:10px;
margin-bottom:22px;
padding-bottom:8px;
scrollbar-width:none;
}

.alphabet-scroll::-webkit-scrollbar{
display:none;
}

.alphabet-scroll button{
min-width:42px;
height:42px;
border:none;
border-radius:14px;
font-weight:900;
background:#efe7ff;
color:#7c3aed;
box-shadow:0 8px 16px rgba(143,86,235,.08);
}

.alphabet-scroll button.active-letter{
background:
linear-gradient(135deg,#4c1d95,#8f56eb);
color:white;
box-shadow:0 12px 22px rgba(143,86,235,.22);
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
flex-shrink:0;
}

.rem-info{
flex:1;
position:relative;
z-index:1;
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
cursor:pointer;
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
line-height:1.45;
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
flex-shrink:0;
}

.tip-text h5{
font-size:14px;
font-weight:900;
margin-bottom:4px;
}

.tip-text p{
font-size:12px;
color:#ddd6fe;
line-height:1.45;
}

.loading-state{
text-align:center;
padding:50px 20px;
font-weight:900;
color:#7c3aed;
}

.empty-state{
padding:40px 20px;
border-radius:26px;
background:linear-gradient(145deg,#ffffff,#f4eeff);
text-align:center;
color:#7c3aed;
box-shadow:0 12px 24px rgba(143,86,235,.08);
}

.empty-state h4{
font-size:17px;
font-weight:900;
color:#24143f;
margin:10px 0 4px;
}

.empty-state p{
font-size:13px;
font-weight:600;
color:#6d6290;
}

.remedy-list-item:active,
.book-card:active,
.tip-card:active,
.mini-info-card:active,
.alphabet-scroll button:active{
transform:scale(.98);
}

@media(max-width:480px){

.learn-header{
padding:72px 20px 30px;
}

.learn-body{
padding:24px 18px 90px;
}

.books-grid{
grid-template-columns:1fr;
}

.remedy-list-item{
padding:16px;
border-radius:24px;
}

}

`}</style>

</div>
);

};

export default LearnPage;