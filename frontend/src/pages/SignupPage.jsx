import React,{useState} from 'react';
import {
Eye,
EyeOff,
UserPlus,
User,
Mail,
Lock,
Calendar,
Sparkles
} from 'lucide-react';

import {useNavigate} from 'react-router-dom';
import {
signupUser,
registerPatient
} from '../services/api';

const SignupPage=({onSignup})=>{

const [showPassword,setShowPassword]=useState(false);
const [loading,setLoading]=useState(false);
const [error,setError]=useState('');

const [formData,setFormData]=useState({
name:'',
age:'',
gender:'M',
email:'',
password:''
});

const navigate=useNavigate();

const parseBackendError=(err)=>{

if(!err) return 'Unknown error';

if(typeof err==='string') return err;

if(typeof err.detail==='string'){
return err.detail;
}

if(Array.isArray(err.detail)){
return err.detail.map(
e=>e.msg || JSON.stringify(e)
).join(', ');
}

return 'Signup failed.';

};

const handleSubmit=async(e)=>{

e.preventDefault();

setError('');
setLoading(true);

const age=parseInt(formData.age,10);

if(!formData.name.trim()){
setError('Full name required');
setLoading(false);
return;
}

if(!age || age<1 || age>120){
setError('Enter valid age');
setLoading(false);
return;
}

try{

await signupUser(
formData.email.trim(),
formData.name.trim(),
formData.password
);

try{

await registerPatient({
user_id:formData.email.trim(),
name:formData.name.trim(),
age,
gender:
formData.gender==='M'
?'male'
:'female',

existing_conditions:[],
allergies:[],
current_medications:[],
family_history:[],
food_preferences:[],

other_conditions:'',
other_allergy:'',
other_medication:'',
other_family_condition:'',
other_family_relation:'',
other_food_preference:'',

sleep_quality:'',
overthinking_level:'',
anger_level:'',
appetite_level:'',
stress_level:'',
energy_level:'',

blood_group:'',
bp_high:false,
diabetic:false,
sugar_level:'',
bp_reading:'',

thermal:'',
thirst:'',
sleep_pattern:'',
mental_state:''

});

}catch(e){
console.error(e);
}

onSignup(
formData.email.trim(),
formData.name.trim(),
age,
formData.gender==='M'
?'male'
:'female'
);

}catch(err){

const parsed=parseBackendError(err);

if(
parsed.toLowerCase().includes('exists')
){
setError(
'Account already exists.'
);
}else{
setError(parsed);
}

}
finally{
setLoading(false);
}

};

return(

<div className="signup-wrapper fade-in">

<div className="hero-section">

<div className="hero-logo">
<Sparkles
size={42}
color="white"
/>
</div>

<span className="mini-label">
AI Homeopathic Assistant
</span>

<h1>Create Account</h1>

<p>
Begin your personalized wellness journey.
</p>

</div>

<div className="signup-card">

<h2>Join MediGuide</h2>

{error && (
<div className="error-box">
{error}
</div>
)}

<form onSubmit={handleSubmit}>

<div className="input-group">
<User size={20} className="input-icon"/>
<input
type="text"
placeholder="Full Name"
value={formData.name}
onChange={(e)=>
setFormData({
...formData,
name:e.target.value
})
}
required
/>
</div>

<div className="row-group">

<div className="input-group half">
<Calendar
size={20}
className="input-icon"
/>

<input
type="number"
placeholder="Age"
value={formData.age}
onChange={(e)=>
setFormData({
...formData,
age:e.target.value
})
}
/>
</div>

<div className="gender-toggle">

<button
type="button"
className={
formData.gender==='M'
?'active':''
}
onClick={()=>
setFormData({
...formData,
gender:'M'
})
}
>
Male
</button>

<button
type="button"
className={
formData.gender==='F'
?'active':''
}
onClick={()=>
setFormData({
...formData,
gender:'F'
})
}
>
Female
</button>

</div>

</div>

<div className="input-group">
<Mail size={20} className="input-icon"/>
<input
type="email"
placeholder="Email"
value={formData.email}
onChange={(e)=>
setFormData({
...formData,
email:e.target.value
})
}
/>
</div>

<div className="input-group">

<Lock
size={20}
className="input-icon"
/>

<input
type={
showPassword
?'text'
:'password'
}
placeholder="Password"
value={formData.password}
onChange={(e)=>
setFormData({
...formData,
password:e.target.value
})
}
/>

<button
type="button"
className="toggle-password"
onClick={()=>
setShowPassword(
!showPassword
)
}
>
{showPassword
?<EyeOff size={20}/>
:<Eye size={20}/>
}
</button>

</div>

<button
className="btn-main"
disabled={loading}
>
{loading
?'Creating Account...'
:'Create Account'
}
</button>

</form>

</div>

<div className="login-link">
Already have an account?
<span
onClick={()=>
navigate('/login')
}
>
Log In
</span>
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

.signup-wrapper{
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

.signup-wrapper:before{
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

.hero-section{
margin-top:50px;
margin-bottom:38px;
text-align:center;
z-index:2;
}

.hero-logo{
width:100px;
height:100px;

margin:0 auto 20px;

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

.hero-section h1{
font-size:32px;
font-weight:900;
color:#24143f;
margin:8px 0 6px;
}

.hero-section p{
font-size:14px;
font-weight:700;
color:#6d28d9;
}

/* CARD */

.signup-card{
width:100%;

padding:34px 24px;
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

.signup-card h2{
text-align:center;
font-size:22px;
font-weight:900;
color:#24143f;
margin-bottom:24px;
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

/* ROW */

.row-group{
display:flex;
gap:12px;
margin-bottom:18px;
}

/* INPUT */

.input-group{
position:relative;
margin-bottom:18px;
}

.half{
margin-bottom:0;
flex:1;
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

/* GENDER */

.gender-toggle{
flex:1;
display:flex;

background:#f8f5ff;
border:1px solid #ede9fe;

border-radius:18px;
padding:4px;
}

.gender-toggle button{
flex:1;
border:none;
background:transparent;

border-radius:14px;

font-size:14px;
font-weight:900;
color:#7c3aed;

padding:13px 0;
}

.gender-toggle button.active{
background:
linear-gradient(
135deg,
#5b21b6,
#8f56eb
);

color:white;

box-shadow:
0 8px 18px rgba(143,86,235,.20);
}

/* PASSWORD */

.toggle-password{
position:absolute;
right:16px;
top:50%;
transform:translateY(-50%);
background:none;
border:none;
color:#8f56eb;
}

/* BUTTON */

.btn-main{
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

margin-top:12px;
}

.btn-main:disabled{
opacity:.6;
box-shadow:none;
}

/* FOOTER */

.login-link{
margin-top:auto;
padding-top:28px;
padding-bottom:18px;

font-size:14px;
font-weight:600;
color:#64748b;
z-index:2;
}

.login-link span{
margin-left:8px;
color:#7c3aed;
font-weight:900;
cursor:pointer;
}

@keyframes floatLogo{
0%{transform:translateY(0);}
50%{transform:translateY(-4px);}
100%{transform:translateY(0);}
}

`}</style>

</div>

);

};

export default SignupPage;