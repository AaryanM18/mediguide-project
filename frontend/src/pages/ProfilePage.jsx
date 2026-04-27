import React,{useState,useEffect} from 'react';
import {
ChevronLeft,
User,
Settings,
Shield,
History,
LogOut,
Heart,
Activity,
Calendar
} from 'lucide-react';

import {useNavigate} from 'react-router-dom';
import {getPatientProfile} from '../services/api';

const ProfilePage=({user,onLogout})=>{

const navigate=useNavigate();

const [profile,setProfile]=useState(null);
const [loading,setLoading]=useState(true);

useEffect(()=>{

const fetch=async()=>{
const data=await getPatientProfile(user.id);

if(data.success){
setProfile(data.patient);
}

setLoading(false);
};

fetch();

},[user.id]);

return(

<div className="profile-container fade-in">

<header className="profile-header">

<button
className="back-btn"
onClick={()=>navigate(-1)}
>
<ChevronLeft size={24} color="white"/>
</button>

<div className="profile-avatar-big">
<User size={42} color="white"/>
</div>

<span className="mini-label">
Patient Identity
</span>

<h1>
{user?.name||user?.username||'User'}
</h1>

<p className="email-label">
{user?.id||user?.email||'No email found'}
</p>

</header>

<div className="profile-body">

{!loading && profile && (

<div className="snapshot-card slide-up">

<div className="snapshot-item">
<div className="snapshot-icon">
<Calendar size={18}/>
</div>
<span>{profile.age} Years</span>
<small>Age</small>
</div>

<div className="snapshot-item">
<div className="snapshot-icon">
<Activity size={18}/>
</div>
<span>{profile?.blood_group || 'Not set'}</span>
<small>Blood</small>
</div>

<div className="snapshot-item">
<div className="snapshot-icon">
<Heart size={18}/>
</div>
<span>
{profile?.thermal
?`${profile.thermal}`
:'Not set'}
</span>
<small>Thermal</small>
</div>

</div>

)}

<div className="menu-group">

<div
className="menu-item"
onClick={()=>navigate('/health-profile')}
>
<div className="menu-icon">
<Shield size={20}/>
</div>

<div className="menu-text">
<span>My Health Profile</span>
<p>View and update medical details</p>
</div>

<ChevronLeft size={18} className="rotate-180"/>
</div>

<div
className="menu-item"
onClick={()=>navigate('/history')}
>
<div className="menu-icon">
<History size={20}/>
</div>

<div className="menu-text">
<span>Consultation History</span>
<p>Check previous remedy analysis</p>
</div>

<ChevronLeft size={18} className="rotate-180"/>
</div>

<div className="menu-item">
<div className="menu-icon">
<Settings size={20}/>
</div>

<div className="menu-text">
<span>Settings</span>
<p>Manage app preferences</p>
</div>

<ChevronLeft size={18} className="rotate-180"/>
</div>

</div>

<button
className="logout-btn"
onClick={()=>{
onLogout();
navigate('/login');
}}
>
<LogOut size={20}/>
<span>Log Out</span>
</button>

</div>

<style>{`

:root{
--primary-950:#1e0738;
--primary-900:#2d0a54;
--primary-800:#4c1d95;
--primary-700:#6d28d9;
--primary-600:#8f56eb;
--primary-300:#ddd6fe;
--surface:#f8f4ff;
--surface-card:#ffffff;
--text-dark:#24143f;
--text-muted:#7c6f9a;
--glow:rgba(143,86,235,.22);
}

/* PAGE */

.profile-container{
min-height:100vh;
padding-bottom:40px;

background:
radial-gradient(circle at top right, rgba(143,86,235,.14), transparent 34%),
linear-gradient(180deg,#f8f4ff,#efe7ff);
}

/* HEADER */

.profile-header{
padding:78px 24px 72px;

border-bottom-left-radius:44px;
border-bottom-right-radius:44px;

background:
linear-gradient(
135deg,
#2d0a54 0%,
#4c1d95 55%,
#7c3aed 100%
);

text-align:center;
position:relative;
overflow:hidden;

box-shadow:
0 18px 42px rgba(76,29,149,.24);
}

.profile-header:after{
content:"";
position:absolute;
width:210px;
height:210px;
border-radius:50%;
background:rgba(255,255,255,.08);
top:-80px;
right:-70px;
}

.profile-header:before{
content:"";
position:absolute;
width:150px;
height:150px;
border-radius:50%;
background:rgba(255,255,255,.05);
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
0 14px 28px rgba(0,0,0,.14),
inset 0 1px 0 rgba(255,255,255,.14);

z-index:3;
}

.profile-avatar-big{
width:96px;
height:96px;

margin:0 auto 20px;

border-radius:32px;

background:
linear-gradient(
145deg,
rgba(255,255,255,.22),
rgba(255,255,255,.10)
);

border:1px solid rgba(255,255,255,.24);

display:flex;
align-items:center;
justify-content:center;

backdrop-filter:blur(16px);

box-shadow:
0 18px 34px rgba(0,0,0,.16),
inset 0 1px 0 rgba(255,255,255,.18);

position:relative;
z-index:2;
}

.mini-label{
font-size:11px;
font-weight:800;
letter-spacing:.7px;
text-transform:uppercase;
color:#ddd6fe;

position:relative;
z-index:2;
}

.profile-header h1{
font-size:30px;
font-weight:900;
color:white;

margin:10px 0 6px;

position:relative;
z-index:2;
}

.email-label{
font-size:13px;
font-weight:600;
color:#ddd6fe;

position:relative;
z-index:2;
}

/* BODY */

.profile-body{
padding:0 22px 28px;
}

/* SNAPSHOT */

.snapshot-card{
margin-top:-38px;
margin-bottom:28px;

border-radius:30px;
padding:18px;

background:
rgba(255,255,255,.92);

backdrop-filter:blur(16px);

display:grid;
grid-template-columns:repeat(3,1fr);
gap:12px;

border:1px solid rgba(143,86,235,.12);

box-shadow:
0 18px 38px rgba(143,86,235,.14),
inset 0 1px 0 rgba(255,255,255,.9);

position:relative;
z-index:10;
}

.snapshot-item{
display:flex;
flex-direction:column;
align-items:center;
gap:6px;

padding:12px 6px;
border-radius:22px;

background:
linear-gradient(
145deg,
#ffffff,
#f5eeff
);
}

.snapshot-icon{
width:38px;
height:38px;
border-radius:14px;

display:flex;
align-items:center;
justify-content:center;

background:#f1e8ff;
color:#6d28d9;
}

.snapshot-item span{
font-size:13px;
font-weight:900;
color:#24143f;
text-align:center;
}

.snapshot-item small{
font-size:10px;
font-weight:800;
color:#8b5cf6;
text-transform:uppercase;
letter-spacing:.4px;
}

/* MENU */

.menu-group{
display:flex;
flex-direction:column;
gap:14px;
}

.menu-item{
padding:18px;
border-radius:26px;

background:
rgba(255,255,255,.94);

display:flex;
align-items:center;
gap:14px;

cursor:pointer;

border:1px solid rgba(143,86,235,.10);

box-shadow:
0 12px 28px rgba(143,86,235,.08),
inset 0 1px 0 rgba(255,255,255,.9);

position:relative;
overflow:hidden;
}

.menu-item:active{
transform:scale(.985);
}

.menu-icon{
width:48px;
height:48px;

border-radius:18px;

background:
linear-gradient(
145deg,
#f8f4ff,
#ede7ff
);

display:flex;
align-items:center;
justify-content:center;

color:#6d28d9;

flex-shrink:0;
}

.menu-text{
flex:1;
}

.menu-text span{
display:block;
font-size:15px;
font-weight:900;
color:#24143f;
margin-bottom:3px;
}

.menu-text p{
font-size:12px;
font-weight:600;
color:#7c6f9a;
}

.rotate-180{
transform:rotate(180deg);
color:#8b5cf6;
}

/* LOGOUT */

.logout-btn{
width:100%;
margin-top:34px;

padding:17px;
border-radius:22px;

border:1px solid rgba(239,68,68,.18);

background:#fff1f2;

color:#dc2626;
font-size:15px;
font-weight:900;

display:flex;
align-items:center;
justify-content:center;
gap:12px;

box-shadow:
0 10px 24px rgba(239,68,68,.10);
}

.logout-btn:active{
transform:scale(.98);
}

/* MOBILE */

@media(max-width:420px){

.profile-body{
padding:0 18px 24px;
}

.snapshot-card{
padding:14px;
gap:8px;
}

.snapshot-item{
padding:10px 4px;
}

.menu-item{
padding:16px;
border-radius:24px;
}

.menu-icon{
width:44px;
height:44px;
}

}

`}</style>

</div>

);

};

export default ProfilePage;