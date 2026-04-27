import React,{useState} from 'react';
import {
Eye,
EyeOff,
Sparkles,
AtSign,
Lock
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const LoginPage=({onLogin})=>{

const [showPassword,setShowPassword]=useState(false);
const [email,setEmail]=useState('');
const [password,setPassword]=useState('');
const [error,setError]=useState('');
const [loading,setLoading]=useState(false);

const navigate=useNavigate();

const parseBackendError=(err)=>{

if(!err) return "Unknown error";

if(typeof err==="string") return err;

if(err.message && typeof err.message==="string"){
if(!err.message.includes("[object Object]")){
return err.message;
}
}

if(Array.isArray(err.detail)){
return err.detail.map(
e=>e.msg || JSON.stringify(e)
).join(", ");
}

if(typeof err.detail==="string"){
return err.detail;
}

return "Login failed. Check credentials.";

};

const handleSubmit=async(e)=>{

e.preventDefault();

setError('');
setLoading(true);

try{

const data=await loginUser(
email,
password
);

onLogin(
email,
data.username || data.name || email
);

}catch(err){

const parsed=parseBackendError(err);

if(
parsed.toLowerCase().includes("user not found")
){
setError("User not found. Redirecting...");
setTimeout(
()=>navigate('/signup'),
1500
);
}
else if(
parsed.toLowerCase().includes("password")
){
setError("Incorrect password.");
}
else{
setError(parsed);
}

}
finally{
setLoading(false);
}

};

return(

<div className="login-wrapper fade-in">

<div className="logo-section">

<div className="logo-circle">
<Sparkles
size={42}
color="white"
/>
</div>

<span className="mini-label">
AI Homeopathic Assistant
</span>

<h1>MediGuide AI</h1>

<p>
Your Personal Homeo Advisor
</p>

</div>

<div className="login-card">

<h2>Welcome Back</h2>

{error && (
<div className="error-box">
{error}
</div>
)}

<form onSubmit={handleSubmit}>

<div className="input-group">

<AtSign
size={20}
className="input-icon"
/>

<input
type="email"
value={email}
onChange={(e)=>
setEmail(e.target.value)
}
placeholder="Email Address"
required
/>

</div>

<div className="input-group">

<Lock
size={20}
className="input-icon"
/>

<input
type={showPassword
?"text"
:"password"
}
value={password}
onChange={(e)=>
setPassword(e.target.value)
}
placeholder="Password"
required
/>

<button
type="button"
className="toggle-password"
onClick={()=>
setShowPassword(!showPassword)
}
>
{showPassword
?<EyeOff size={20}/>
:<Eye size={20}/>
}
</button>

</div>

<div className="forgot-password">
<a href="#">
Forgot Password?
</a>
</div>

<button
type="submit"
className="btn-dark"
disabled={loading}
>
{loading
?"Logging In..."
:"Log In"
}
</button>

</form>

</div>

<div className="signup-link">
New here?
<span onClick={()=>navigate('/signup')}>
Create an Account
</span>
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

.login-wrapper{
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

display:flex;
flex-direction:column;
align-items:center;

padding:42px 24px 28px;

position:relative;
overflow:hidden;
}

.login-wrapper:before{
content:"";
position:absolute;
width:260px;
height:260px;
border-radius:50%;
background:rgba(143,86,235,.08);
top:-90px;
right:-90px;
}

/* HERO */

.logo-section{
margin-top:55px;
margin-bottom:42px;
text-align:center;
z-index:2;
}

.logo-circle{
width:100px;
height:100px;

margin:0 auto 22px;

border-radius:30px;

background:
linear-gradient(
135deg,
#2d0a54,
#5b21b6,
#8f56eb
);

display:flex;
align-items:center;
justify-content:center;

box-shadow:
0 20px 42px var(--glow);

animation:floatLogo 6s ease-in-out infinite;
}

.mini-label{
font-size:11px;
font-weight:800;
letter-spacing:.7px;
text-transform:uppercase;
color:#7c3aed;
}

.logo-section h1{
font-size:32px;
font-weight:900;
color:#24143f;
margin:8px 0 6px;
}

.logo-section p{
font-size:14px;
font-weight:700;
color:#6d28d9;
}

/* CARD */

.login-card{
width:100%;

padding:34px 26px;
border-radius:34px;

background:
linear-gradient(
145deg,
rgba(255,255,255,.98),
rgba(243,235,255,.92)
);

border:1px solid rgba(143,86,235,.12);

box-shadow:
0 18px 36px rgba(143,86,235,.10),
inset 0 1px 0 rgba(255,255,255,.95);

z-index:2;
}

.login-card h2{
text-align:center;
font-size:22px;
font-weight:900;
color:#24143f;
margin-bottom:26px;
}

/* ERROR */

.error-box{
background:#fff1f2;
border:1px solid #fecdd3;
color:#dc2626;
padding:12px;
border-radius:14px;
margin-bottom:16px;
font-size:14px;
font-weight:700;
text-align:center;
}

/* INPUT */

.input-group{
position:relative;
margin-bottom:18px;
}

.input-icon{
position:absolute;
left:16px;
top:50%;
transform:translateY(-50%);
color:#8f56eb;
}

.input-group input{
width:100%;
padding:16px 16px 16px 50px;

border-radius:18px;
border:1px solid #ede9fe;

background:
linear-gradient(
145deg,
#ffffff,
#f5eeff
);

font-size:15px;
font-weight:700;

color:#312e81;
outline:none;

box-sizing:border-box;
}

.input-group input:focus{
border-color:#8f56eb;

box-shadow:
0 0 0 4px rgba(143,86,235,.12);
}

.toggle-password{
position:absolute;
right:16px;
top:50%;
transform:translateY(-50%);
background:none;
border:none;
color:#8f56eb;
}

/* LINKS */

.forgot-password{
text-align:right;
margin-bottom:26px;
}

.forgot-password a{
font-size:13px;
font-weight:800;
text-decoration:none;
color:#7c3aed;
}

/* BUTTON */

.btn-dark{
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

.btn-dark:active{
transform:scale(.98);
}

.btn-dark:disabled{
opacity:.6;
box-shadow:none;
}

/* FOOTER */

.signup-link{
margin-top:auto;
padding-top:28px;
padding-bottom:18px;

font-size:14px;
font-weight:600;
color:#64748b;

z-index:2;
}

.signup-link span{
margin-left:6px;
color:#7c3aed;
font-weight:900;
cursor:pointer;
}

/* ANIM */

@keyframes floatLogo{
0%{
transform:translateY(0);
}
50%{
transform:translateY(-4px);
}
100%{
transform:translateY(0);
}
}

@media(max-width:420px){

.login-wrapper{
padding:34px 18px 24px;
}

.logo-circle{
width:90px;
height:90px;
}

.login-card{
padding:28px 20px;
border-radius:28px;
}

}

`}</style>

</div>

);

};

export default LoginPage;