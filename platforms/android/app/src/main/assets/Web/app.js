
/* ══════════════════════════════════════════════
   PLANS DEFINITION
══════════════════════════════════════════════ */
const PLANS = [
  {id:'free', name:'Free', cls:'free-card', badge:'plan-free', emoji:'🌱', price:'₹0', period:' forever', cta:'Choose Free', features:[{label:'Basic chat',on:true},{label:'5,000 tokens per day — planned',on:true},{label:'Local tools',on:true}]},
  {id:'basic', name:'Basic', cls:'silver-card', badge:'plan-silver', emoji:'✦', price:'₹500', period:'/month', cta:'Choose Basic', features:[{label:'15,000 tokens per day — planned',on:true},{label:'Gemini chat and small coding tasks — planned',on:true}]},
  {id:'pro', name:'Pro', cls:'gold-card', badge:'plan-gold', emoji:'✨', price:'₹1,000', period:'/month', cta:'Choose Pro', features:[{label:'SatBot Pro',on:true},{label:'Cloud AI access',on:true},{label:'25,000 tokens per day — planned',on:true}]},
  {id:'max', name:'Max', cls:'diamond-card', badge:'plan-diamond', emoji:'💎', price:'₹1,500', period:'/month', cta:'Choose Max', features:[{label:'SatBot ULTRA — planned',on:true},{label:'Everything in Pro',on:true},{label:'25,000 tokens per day — planned',on:true}]},
  {id:'teams', name:'Teams', cls:'maxdiamond-card', badge:'plan-maxdiamond', emoji:'👥', price:'₹5,000–₹7,000', period:'/3 months', cta:'Choose Teams', features:[{label:'Max for team members — planned',on:true},{label:'Organization invitations — planned',on:true},{label:'Up to 10 members: ₹5,000 / 3 months',on:true},{label:'11–100 members: ₹7,000 / 3 months',on:true},{label:'25,000 tokens per member per day — planned',on:true}]}
];

/* ══════════════════════════════════════════════
   STATE / HELPERS
══════════════════════════════════════════════ */
const KEY_STORE   = 'bb_keys_v3';
const AUTH_STORE  = '__bb_auth__';
const PLAN_STORE  = '__bb_plan__';
const USERS_STORE = '__bb_users__';

const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function getKeys(){ try{return JSON.parse(localStorage.getItem(KEY_STORE)||'{}')}catch(e){return{}} }
function setKeys(o){ localStorage.setItem(KEY_STORE, JSON.stringify(o)) }
function getAuth(){ try{return JSON.parse(localStorage.getItem(AUTH_STORE)||'null')}catch(e){return null} }
function setAuth(o){ localStorage.setItem(AUTH_STORE, JSON.stringify(o)) }
function getPlan(){ const p=localStorage.getItem(PLAN_STORE)||'free'; return ['free','basic','pro','max','teams'].includes(p)?p:'free' }
function setPlan(p){ localStorage.setItem(PLAN_STORE,p); applyPlan(p) }
function getUsers(){ try{return JSON.parse(localStorage.getItem(USERS_STORE)||'{}')}catch(e){return{}} }
function setUsers(u){ localStorage.setItem(USERS_STORE,JSON.stringify(u)) }

const PLAN_RANK = {free:0,basic:1,pro:2,max:3,teams:4};
function hasPlan(required){ return Object.hasOwn(PLAN_RANK,required) && (PLAN_RANK[getPlan()]||0) >= PLAN_RANK[required] }

/* ══════════════════════════════════════════════
   PLAN APPLICATION
══════════════════════════════════════════════ */
function applyPlan(planId){
  const plan = PLANS.find(p=>p.id===planId)||PLANS[0];
  // Update header badge
  const hb = document.getElementById('planBadgHeader');
  if(hb){ hb.className='plan-badge '+plan.badge; hb.textContent=plan.emoji+' '+plan.name }
  // Music section
  const musicOk = hasPlan('pro');
  const ml = document.getElementById('musicLocked');
  const mc = document.getElementById('musicContent');
  if(ml) ml.style.display = musicOk ? 'none' : '';
  if(mc) mc.style.display = musicOk ? 'block' : 'none';
  // Provider access — free only gets lite
  if(!hasPlan('pro')){
    const prov = document.getElementById('provider');
    if(prov && !['local','lite'].includes(prov.value)){
      prov.value = 'lite';
    }
  }
  // Re-render plans grid if open
  if(document.getElementById('plansGrid').children.length){
    renderPlansGrid();
  }
}

/* ══════════════════════════════════════════════
   PLANS MODAL
══════════════════════════════════════════════ */
function openPlans(){ document.getElementById('plansModal').classList.add('open'); renderPlansGrid() }
function closePlans(){ document.getElementById('plansModal').classList.remove('open') }
document.getElementById('plansModal').addEventListener('click', e=>{ if(e.target===e.currentTarget)closePlans() });
document.getElementById('openPlansBtn').addEventListener('click', openPlans);

function renderPlansGrid(){
  const grid = document.getElementById('plansGrid');
  const cur = getPlan();
  grid.innerHTML = PLANS.map(plan=>{
    const isCur = plan.id===cur;
    const feats = plan.features.map(f=>`<div class="plan-feature ${f.on?'on':'off'}">${f.label}</div>`).join('');
    const ctaLabel = isCur ? '✓ Current Plan' : plan.cta;
    const ctaStyle = isCur ? 'opacity:.5;cursor:default' : '';
    return `<div class="plan-card ${plan.cls} ${isCur?'current':''}">
      <div class="plan-name">${plan.emoji} ${plan.name}</div>
      <div class="plan-price">${plan.price}<span>${plan.period}</span></div>
      ${feats}
      <button class="plan-cta" style="${ctaStyle}" onclick="selectPlan('${plan.id}')" ${isCur?'disabled':''}>${ctaLabel}</button>
    </div>`;
  }).join('');
}

function selectPlan(planId){
  const plan = PLANS.find(p=>p.id===planId);
  if(!plan)return;
  const cur = getPlan();
  if(planId===cur){ alert('You already have this plan!'); return }
  if(plan.id==='free'){
    setPlan(planId);
    alert('✅ Switched to Free plan.');
    renderPlansGrid();
    return;
  }
  // Simulate payment (demo)
  const ok = confirm(`🛒 Demo purchase: ${plan.emoji} ${plan.name} — ${plan.price}${plan.period}\n\nThis is a demo — no real payment. Click OK to activate.`);
  if(ok){
    setPlan(planId);
    alert(`🎉 Welcome to ${plan.emoji} ${plan.name}! Features unlocked.`);
    renderPlansGrid();
  }
}

/* ══════════════════════════════════════════════
   AUTH TABS
══════════════════════════════════════════════ */
function switchAuthTab(tab){
  $$('.auth-tab').forEach((t,i)=>{ t.classList.toggle('active', ['signin','signup','passkey'][i]===tab) });
  $$('.auth-panel').forEach(p=>p.classList.remove('active'));
  const el = document.getElementById('tab-'+tab);
  if(el) el.classList.add('active');
}

/* ══════════════════════════════════════════════
   EMAIL AUTH (local demo)
══════════════════════════════════════════════ */
function emailSignUp(){
  const name  = $('#suName').value.trim();
  const email = $('#suEmail').value.trim().toLowerCase();
  const pass  = $('#suPass').value;
  if(!email||!pass){ alert('Email and password required.'); return }
  if(pass.length<6){ alert('Password must be at least 6 characters.'); return }
  const users = getUsers();
  if(users[email]){ alert('Account already exists. Sign in instead.'); return }
  // Store hashed-ish (demo only — NOT secure for production!)
  users[email] = { name: name||email.split('@')[0], email, passHash: btoa(pass), plan:'free', created: Date.now() };
  setUsers(users);
  const profile = { email, name: users[email].name, method:'email' };
  setAuth(profile);
  afterSignIn(profile);
}

function emailSignIn(){
  const email = $('#siEmail').value.trim().toLowerCase();
  const pass  = $('#siPass').value;
  if(!email||!pass){ alert('Email and password required.'); return }
  const users = getUsers();
  const user  = users[email];
  if(!user){ alert('No account found. Create one first.'); return }
  if(btoa(pass) !== user.passHash){ alert('Incorrect password.'); return }
  // restore plan from account
  if(user.plan) setPlan(user.plan);
  const profile = { email, name: user.name, method:'email' };
  setAuth(profile);
  afterSignIn(profile);
}

/* ══════════════════════════════════════════════
   GOOGLE SIGN-IN (GIS — needs real Client ID)
══════════════════════════════════════════════ */
const GOOGLE_CLIENT_ID = 'REPLACE_ME.apps.googleusercontent.com'; // Replace with real Client ID

function initGoogleSignIn(){
  if(GOOGLE_CLIENT_ID.startsWith('REPLACE_ME')){
    // Demo fallback
    ['googleSignInBtn','googleSignUpBtn'].forEach(id=>{
      const btn = document.getElementById(id);
      if(!btn) return;
      btn.onclick = ()=>{
        const email = prompt('DEMO Google Sign-In — enter your email:');
        if(!email) return;
        const profile = { email: email.toLowerCase(), name: email.split('@')[0], method:'google' };
        setAuth(profile);
        afterSignIn(profile);
      };
    });
    return;
  }
  const s = document.createElement('script');
  s.src = '';
  s.async = true; s.defer = true;
  s.onload = ()=>{
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (resp)=>{
        try{
          const b64 = resp.credential.split('.')[1];
          const data = JSON.parse(decodeURIComponent(escape(atob(b64.replace(/-/g,'+').replace(/_/g,'/')))));
          const profile = { email: data.email, name: data.name||data.given_name||'User', picture: data.picture, method:'google' };
          setAuth(profile); afterSignIn(profile);
        } catch(e){ alert('Google sign-in failed.') }
      }
    });
    window.google.accounts.id.renderButton(document.getElementById('googleSignInBtn'), {theme:'outline',size:'large',shape:'pill',text:'continue_with',width:240});
    document.getElementById('googleSignUpBtn').onclick = ()=> window.google.accounts.id.prompt();
  };
  document.head.appendChild(s);
}

/* ══════════════════════════════════════════════
   PASSKEY AUTH (WebAuthn)
══════════════════════════════════════════════ */
async function passkeyRegister(){
  if(!window.PublicKeyCredential){ alert('Passkeys not supported on this browser/device.'); return }
  try{
    const email = prompt('Enter your email for this passkey:');
    if(!email) return;
    const enc = new TextEncoder();
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userId = enc.encode(email.toLowerCase());
    const cred = await navigator.credentials.create({
      publicKey:{
        challenge,
        rp:{ name:'BetterBot DC', id: location.hostname||'localhost' },
        user:{ id: userId, name: email, displayName: email.split('@')[0] },
        pubKeyCredParams:[{alg:-7,type:'public-key'},{alg:-257,type:'public-key'}],
        authenticatorSelection:{ residentKey:'required', userVerification:'preferred' },
        timeout: 60000,
        attestation:'none'
      }
    });
    // Store credential ID for this email (demo)
    const stored = JSON.parse(localStorage.getItem('__bb_passkeys__')||'{}');
    stored[email.toLowerCase()] = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
    localStorage.setItem('__bb_passkeys__', JSON.stringify(stored));
    const profile = { email: email.toLowerCase(), name: email.split('@')[0], method:'passkey' };
    setAuth(profile); afterSignIn(profile);
    alert('✅ Passkey created! You can sign in with it next time.');
  } catch(e){
    alert('Passkey creation failed: '+(e.message||e)+'\n\nMake sure you\'re on HTTPS or localhost.');
  }
}

async function passkeyAuth(){
  if(!window.PublicKeyCredential){ alert('Passkeys not supported on this browser/device.'); return }
  try{
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const cred = await navigator.credentials.get({
      publicKey:{
        challenge,
        userVerification:'preferred',
        timeout:60000
      }
    });
    // For demo: look up stored passkeys
    const stored = JSON.parse(localStorage.getItem('__bb_passkeys__')||'{}');
    const credId = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
    const matchEmail = Object.keys(stored).find(e=>stored[e]===credId);
    if(matchEmail){
      const profile = { email: matchEmail, name: matchEmail.split('@')[0], method:'passkey' };
      setAuth(profile); afterSignIn(profile);
    } else {
      // Passkey verified by device — accept it
      const profile = { email:'passkey-user@device', name:'Passkey User', method:'passkey' };
      setAuth(profile); afterSignIn(profile);
    }
  } catch(e){
    if(e.name==='NotAllowedError') return; // user cancelled
    alert('Passkey sign-in failed: '+(e.message||e));
  }
}

function skipSignIn(){
  const profile = { email:'guest', name:'Guest', method:'guest' };
  setAuth(profile); afterSignIn(profile);
}

/* ══════════════════════════════════════════════
   AFTER SIGN-IN
══════════════════════════════════════════════ */
function afterSignIn(profile){
  // Restore plan
  const users = getUsers();
  const user = users[profile.email];
  if(user && user.plan) setPlan(user.plan);
  else applyPlan(getPlan());

  // Update name field
  const ni = document.getElementById('name');
  if(ni && profile.name && profile.name !== 'Guest') ni.value = profile.name;

  // Update header plan badge from stored plan
  applyPlan(getPlan());

  // Dismiss gate
  const gate = document.getElementById('bbGate');
  if(gate){ gate.style.opacity='0'; gate.style.pointerEvents='none'; setTimeout(()=>{gate.hidden=true;gate.style.opacity='1';gate.style.pointerEvents='auto';},400) }

  diag.textContent = '';
}

/* ══════════════════════════════════════════════
   SIGN-IN GATE LOADING ANIMATION
══════════════════════════════════════════════ */
(function(){
  const tips = [
    '💎 Now with Claude (Anthropic) AI!',
    '🔑 Keys saved once — reload any time.',
    '🎵 Music unlocks at Silver plan.',
    '🤖 Auto mode: Claude → OpenAI → HF → Local.',
    '📲 Install as a PWA for offline use.',
    '👑 MAX Diamond — every feature unlocked.',
  ];
  let i=0, p=0;
  const fill = document.getElementById('bbFill');
  const tip  = document.getElementById('bbTip');
  const prog = setInterval(()=>{
    p = Math.min(88, p + Math.random()*11);
    fill.style.width = p+'%';
    tip.textContent = tips[i++%tips.length];
  }, 900);

  const existing = getAuth();
  if(existing){
    // Already logged in — skip gate quickly
    clearInterval(prog);
    fill.style.width = '100%';
    setTimeout(()=> afterSignIn(existing), 300);
  } else {
    // Show auth UI after loading anim
    setTimeout(()=>{
      clearInterval(prog);
      fill.style.width='95%';
      document.getElementById('loadingSection').style.display='none';
      document.getElementById('authSection').style.display='';
      initGoogleSignIn();
    }, 2000);
  }
})();

/* ══════════════════════════════════════════════
   CORE CHAT ENGINE
══════════════════════════════════════════════ */
var logEl=$('#log'), diag=$('#diag'), modeBadge=$('#modeBadge');
var OPENAI_CANDIDATES=['gpt-4o-mini','gpt-4.1-mini','gpt-4o'];
var DEEPSEEK_CANDIDATES=['deepseek-v3','deepseek-chat'];
var CLAUDE_CANDIDATES=['claude-sonnet-4-5','claude-opus-4-5','claude-haiku-4-5-20251001'];
var speakReplies=false, currentSessionId=null;
var chat=[{role:'bot',text:"Hey! I'm BetterBot DC ⚡\n\nAsk me ANYTHING — no API key needed. I answer questions, write code, explain things, tell jokes, help with homework — just talk naturally.\n\nWhat do you want to know?"}];
var aiPersona='zap'; // 'better' | 'zap' | 'talklock'

function render(){
  var html='';
  for(var i=0;i<chat.length;i++){
    var m=chat[i];
    var cls='bubble '+(m.role==='user'?'user':'bot'+(m.provider==='Claude'?' claude-reply':''));
    html+='<div class="'+cls+'">'
      +'<div class="small" style="margin-bottom:3px">'
        +(m.role==='user'?(getUserName()||'Me'):'🤖 BetterBot'+(m.provider?' <span style="font-size:10px;opacity:.65">['+m.provider+']</span>':''))
      +'</div>'
      +String(m.text||'').replace(/&/g,'&amp;').replace(/</g,'&lt;')
    +'</div>';
  }
  logEl.innerHTML=html; logEl.scrollTop=logEl.scrollHeight;
}
render();
function clearChat(){ chat=[{role:'bot',text:'Chat cleared.'}]; render() }

/* Keys persistence */
function loadKeysToUI(){
  var k=getKeys();
  if(k.provider) $('#provider').value=k.provider;
  if(k.claude){$('#claudeKey').value=k.claude; showSaved('claudeSaved','dotClaude')}
  if(k.claudeModel) $('#claudeModel').value=k.claudeModel;
  if(k.oa){$('#oaKey').value=k.oa; showSaved('oaSaved','dotOA')}
  if(k.oaModel) $('#oaModel').value=k.oaModel||'auto';
  if(k.ds){$('#dsKey').value=k.ds; showSaved('dsSaved','dotDS')}
  if(k.dsModel) $('#dsModel').value=k.dsModel||'auto';
  if(k.hf){$('#hfKey').value=k.hf; showSaved('hfSaved','dotHF')}
  if(k.hfModel) $('#hfModel').value=k.hfModel||'google/gemma-2-2b-it';
  if(k.localModel) $('#localModel').value=k.localModel;
}
function showSaved(bid,did){
  var b=document.getElementById(bid); if(b)b.style.display='inline';
  var d=document.getElementById(did); if(d){d.style.background='var(--ok)'}
}
function readKeysFromUI(){
  return{
    provider:$('#provider').value,
    claude:$('#claudeKey').value.trim(), claudeModel:$('#claudeModel').value,
    oa:$('#oaKey').value.trim(), oaModel:$('#oaModel').value.trim(),
    ds:$('#dsKey').value.trim(), dsModel:$('#dsModel').value.trim(),
    hf:$('#hfKey').value.trim(), hfModel:$('#hfModel').value.trim(),
    localModel:$('#localModel').value
  }
}
$('#saveKeysBtn').addEventListener('click',()=>{
  var k=readKeysFromUI(); setKeys(k);
  if(k.claude)showSaved('claudeSaved','dotClaude');
  if(k.oa)showSaved('oaSaved','dotOA');
  if(k.ds)showSaved('dsSaved','dotDS');
  if(k.hf)showSaved('hfSaved','dotHF');
  diag.textContent='✅ All keys saved permanently.';
  setTimeout(()=>diag.textContent='',3500);
});
$('#forgetKeysBtn').addEventListener('click',()=>{
  if(!confirm('Delete all saved keys?'))return;
  localStorage.removeItem(KEY_STORE);
  ['claudeKey','oaKey','dsKey','hfKey'].forEach(id=>{var e=document.getElementById(id);if(e)e.value=''});
  alert('Keys cleared.');
});
$('#exportKeysBtn').addEventListener('click',()=>{
  var blob=new Blob([JSON.stringify(readKeysFromUI(),null,2)],{type:'application/json'});
  var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='betterbot-keys.json'; a.click();
});
$('#importKeysFile').addEventListener('change',e=>{
  var f=e.target.files&&e.target.files[0]; if(!f)return;
  var r=new FileReader(); r.onload=()=>{try{setKeys(JSON.parse(r.result));loadKeysToUI();alert('Keys imported.')}catch(e){alert('Invalid JSON')}};
  r.readAsText(f);
});
loadKeysToUI();

/* Memory */
function getUserName(){return $('#name').value||'Dhruv'}
function memKey(){return 'bb_memory_'+getUserName()}
function getMem(){try{return JSON.parse(localStorage.getItem(memKey())||'[]')}catch(e){return[]}}
function setMem(a){localStorage.setItem(memKey(),JSON.stringify(a))}
function rememberLatest(){
  var last=null; for(var i=chat.length-1;i>=0;i--){if(chat[i].role==='user'){last=chat[i].text;break}}
  if(!last){alert('No user message to remember.');return}
  var mem=getMem(); mem.unshift(last); setMem(mem.slice(0,hasPlan('max')?1000:500));
  alert('Saved to memory!');
}
$('#rememberBtn').addEventListener('click',rememberLatest);
$('#viewMemBtn').addEventListener('click',()=>{var m=getMem();alert(m.length?('Memory:\n- '+m.join('\n- ')):'No memory yet.')});
$('#forgetMemBtn').addEventListener('click',()=>{if(confirm('Forget ALL memory?')){setMem([]);alert('Memory cleared.')}});

function buildSystem(){
  var mem=getMem(), name=getUserName();
  var ints=((document.getElementById('ints')&&document.getElementById('ints').value)||'').split(',').map(function(s){return s.trim();}).filter(Boolean).join(', ');
  var memBlock=mem.length?('\n\nYou remember: '+mem.slice(0,30).join(', ')):'';
  var cur=typeof currentMode!=='undefined'?currentMode:'chat';
  var modeHint='';
  if(cur==='fast')  modeHint='\nBe very brief — 1-2 sentences max.';
  if(cur==='code')  modeHint='\nAlways write code in ```language``` blocks. Write complete, working code.';
  if(cur==='write') modeHint='\nProduce the actual written content directly.';
  if(cur==='math')  modeHint='\nSolve step by step. Show all working. Highlight the final answer.';
  return 'You are BetterBot DC — a brilliant, helpful friend who knows everything.\n\nUser: '+name+(ints?' | Interests: '+ints:'')+memBlock+'\n\nSpeak naturally like a real person. No robotic phrases like "certainly!" or "great question!". Match the user energy — casual message gets casual reply, formal gets formal. Be direct and actually answer. Never refuse a normal question.\n\nYou know: all programming languages, science, math, history, philosophy, pop culture, games, music, movies, cooking, fitness, law, medicine (general), relationships, finance, languages, creative writing — everything.\n\nFor code: write the full working version always.'+modeHint;
}

/* Usage */
var usageState={last:null,total:0,by:{}};
function addUsage(prov,tokens){
  usageState.last=prov+(tokens?': '+tokens:': n/a');
  if(tokens){usageState.total+=tokens; usageState.by[prov]=(usageState.by[prov]||0)+tokens}
  $('#usageLast').textContent='Last: '+(usageState.last||'—');
  $('#usageTotal').textContent='Total: '+usageState.total;
  var s=[];for(var k in usageState.by){s.push(k+' '+usageState.by[k])};
  $('#usageBy').textContent='By: '+(s.join(', ')||'—');
}

function historyForAPI(){
  var h=[],start=Math.max(0,chat.length-8);
  for(var i=start;i<chat.length;i++){var m=chat[i]; h.push({role:m.role==='user'?'user':'assistant',content:m.text})}
  return h;
}

/* ── CLAUDE ── */
async function callClaude(p){
  if(!hasPlan('pro')){ throw new Error('skip: plan') }
  var key=(getKeys().claude||$('#claudeKey').value||'').trim(); if(!key)throw new Error('skip');
  var model=(getKeys().claudeModel||$('#claudeModel').value||'claude-sonnet-4-5');
  var res=await fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',
    headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
    body:JSON.stringify({model,max_tokens:1024,system:p.system,messages:p.history.concat([{role:'user',content:p.userText}])})
  });
  if(!res.ok){var e=await res.text().catch(()=>'HTTP '+res.status); throw new Error('Claude: '+e)}
  var data=await res.json();
  var tokens=data.usage?(data.usage.input_tokens+data.usage.output_tokens):null;
  addUsage('Claude',tokens);
  return {text:(data.content&&data.content[0]&&data.content[0].text||'(no reply)').trim(), provider:'Claude'};
}

/* ── OPENAI ── */
async function callOpenAI(p){
  if(!hasPlan('pro')){ throw new Error('skip: plan') }
  var key=(getKeys().oa||$('#oaKey').value||'').trim(); if(!key)throw new Error('skip');
  var mf=(getKeys().oaModel||$('#oaModel').value||'auto').toLowerCase();
  var list=(mf&&mf!=='auto')?[mf]:OPENAI_CANDIDATES; var lastErr=null;
  for(var i=0;i<list.length;i++){
    var model=list[i];
    var res=await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
      body:JSON.stringify({model,messages:[{role:'system',content:p.system}].concat(p.history).concat([{role:'user',content:p.userText}]),temperature:0.7,max_tokens:512})
    });
    if(res.ok){var data=await res.json(); addUsage('OpenAI',data.usage&&data.usage.total_tokens); return {text:(data.choices[0].message.content||'').trim(),provider:'OpenAI'}}
    else lastErr=await res.text().catch(()=>'HTTP '+res.status);
  }
  throw new Error('OpenAI: '+(lastErr||'error'));
}

/* ── DEEPSEEK ── */
async function callDeepSeek(p){
  if(!hasPlan('pro')){ throw new Error('skip: plan') }
  var key=(getKeys().ds||$('#dsKey').value||'').trim(); if(!key)throw new Error('skip');
  var mf=(getKeys().dsModel||'auto').toLowerCase();
  var list=(mf&&mf!=='auto')?[mf]:DEEPSEEK_CANDIDATES; var lastErr=null;
  for(var i=0;i<list.length;i++){
    var model=list[i];
    var res=await fetch('https://api.deepseek.com/chat/completions',{
      method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
      body:JSON.stringify({model,messages:[{role:'system',content:p.system}].concat(p.history).concat([{role:'user',content:p.userText}]),temperature:0.7,max_tokens:512})
    });
    if(res.ok){var data=await res.json(); addUsage('DeepSeek',data.usage&&data.usage.total_tokens); return {text:(data.choices[0].message.content||'').trim(),provider:'DeepSeek'}}
    else lastErr=await res.text().catch(()=>'HTTP '+res.status);
  }
  throw new Error('DeepSeek: '+(lastErr||'error'));
}

/* ── HF ── */
async function callHF(p){
  if(!hasPlan('pro')){ throw new Error('skip: plan') }
  var key=(getKeys().hf||$('#hfKey').value||'').trim(); if(!key)throw new Error('skip');
  var model=(getKeys().hfModel||$('#hfModel').value||'google/gemma-2-2b-it');
  var hist=''; var h=p.history;
  for(var i=0;i<h.length;i++){hist+=(h[i].role==='user'?'User: ':'Assistant: ')+h[i].content+'\n'}
  var prompt=p.system+'\n\n'+hist+'User: '+p.userText+'\nAssistant:';
  var res=await fetch('https://api-inference.huggingface.co/models/'+encodeURIComponent(model),{
    method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
    body:JSON.stringify({inputs:prompt,parameters:{max_new_tokens:512,temperature:0.7,return_full_text:false}})
  });
  if(!res.ok){var e=await res.text().catch(()=>'HTTP '+res.status); throw new Error('HF: '+e)}
  var data=await res.json(); addUsage('HF',null);
  var txt=Array.isArray(data)?data[0]&&data[0].generated_text:data.generated_text;
  return {text:(txt||'(no reply)').trim(), provider:'HF'};
}

/* ── LOCAL WebLLM ── */
var webllmEngine=null, webllmLoading=false, localMode='detecting';
function setModeBadge(text){modeBadge.textContent=text}
async function ensureLocalWebLLM(){
  if(webllmEngine||webllmLoading)return;
  webllmLoading=true; diag.textContent='Loading local model…';
  try{
    var start=Date.now();
    while(!(window.webllm&&window.webllm.CreateMLCEngine)){
      if(Date.now()-start>12000)throw new Error('WebLLM missing');
      await new Promise(r=>setTimeout(r,120));
    }
    var modelId=getKeys().localModel||$('#localModel').value;
    webllmEngine=await window.webllm.CreateMLCEngine(modelId,{gpuMemoryUtilization:0.6,
      streamProgressCallback:p=>{diag.textContent='Loading: '+Math.round((p.progress||0)*100)+'%'}});
    localMode='webllm'; setModeBadge('Local WebLLM'); diag.textContent='Local model ready.';
  }catch(e){
    localMode='lite'; setModeBadge('Lite'); diag.textContent='Local (Lite) active.';
  }finally{webllmLoading=false}
}
async function callLocalWebLLM(p){
  await ensureLocalWebLLM();
  if(localMode!=='webllm')throw new Error('fallback');
  var messages=[{role:'system',content:p.system}].concat(p.history).concat([{role:'user',content:p.userText}]);
  var out=''; var idx=chat.push({role:'bot',text:'…',provider:'Local'})-1; render();
  var stream=await webllmEngine.chat.completions.create({messages,stream:true,temperature:0.7,max_tokens:512});
  try{for await(var ch of stream){var d=(ch.choices[0].delta.content)||''; out+=d; chat[idx].text=out||'…'; render()}}catch(e){}
  addUsage('Local',null); chat[idx].text=(out||'(no reply)').trim(); render();
  return {text:chat[idx].text, provider:'Local', streamed:true};
}

/* ── LITE ── */
function liteReply(user){
  var t=user.trim(),lc=t.toLowerCase();
  if(t==='/help')return 'Commands:\n/help • /time • /coin • /echo <text> • /roll 1d20 • /timer 10s • /sum <text>';
  if(t==='/time')return 'Time: '+new Date().toLocaleString();
  if(t==='/coin')return Math.random()<0.5?'Heads! 🪙':'Tails! 🪙';
  if(/^\/echo\s+/.test(t))return t.replace(/^\/echo\s+/,'');
  if(/^\/roll\s+(\d+)d(\d+)\s*$/i.test(t)){
    var m=t.match(/^\/roll\s+(\d+)d(\d+)\s*$/i),n=Math.min(+m[1],20),sides=+m[2],arr=[],sum=0;
    for(var i=0;i<n;i++){var r=1+Math.floor(Math.random()*sides);arr.push(r);sum+=r}
    return '🎲 '+arr.join(', ')+'  total='+sum;
  }
  if(/^\/timer\s+(\d+)(s|m)$/i.test(t)){
    var mm=t.match(/^\/timer\s+(\d+)(s|m)$/i),num=+mm[1],unit=mm[2];
    setTimeout(()=>{chat.push({role:'bot',text:'⏰ Timer done!'});render()},unit==='s'?num*1000:num*60000);
    return '⏳ Timer set for '+num+unit;
  }
  if(/^\/sum\s+/.test(t)){
    var txt=t.replace(/^\/sum\s+/,'').trim(); if(!txt)return '(nothing to summarize)';
    var sents=txt.split(/(?<=[.!?])\s+/).slice(0,10);
    return 'TL;DR:\n- '+sents.slice(0,3).join('\n- ');
  }
  if(/\bhello|hi|hey\b/.test(lc))return 'Hey '+getUserName()+'! 👋';
  if(/your name|who are you/i.test(t))return "I'm BetterBot DC (Free/Lite). Upgrade for full AI!";
  return ["Try /help for commands!","Want to upgrade? Tap 💎 Plans for cloud AI.","Got it! Type /help for tricks."][Math.floor(Math.random()*3)];
}
async function callLocalLite(p){
  var reply=liteReply(p.userText); var out='';
  var idx=chat.push({role:'bot',text:'…',provider:'Lite'})-1; render();
  for(var i=0;i<reply.length;i+=10){await new Promise(r=>setTimeout(r,12)); out+=reply.slice(i,i+10); chat[idx].text=out; render()}
  return {text:out.trim(), provider:'Lite', streamed:true};
}

/* ── ROUTER ── */
function looksLikeAKey(s){return /(sk-[\w-]{10,}|hf_[\w-]{10,}|sk-ant-api|ghp_[\w]{20,}|-----BEGIN)/i.test(s)}
function mode(){return $('#provider').value||'auto'}

async function askSmart(userText){
  var payload={system:buildSystem(),history:historyForAPI(),userText};
  if(aiPersona==='satbot') return await callSatBot(payload);
  var m=mode();
  async function tryRun(fn){try{var r=await fn(payload);if(r&&r.text)return r}catch(e){return null}return null}
  var r;
  if(m==='claude'){r=await tryRun(callClaude); return r||{text:'(no reply — check Claude key & plan)',provider:'Claude'}}
  if(m==='openai'){r=await tryRun(callOpenAI); return r||{text:'(no reply)',provider:'OpenAI'}}
  if(m==='deepseek'){r=await tryRun(callDeepSeek); return r||{text:'(no reply)',provider:'DeepSeek'}}
  if(m==='hf'){r=await tryRun(callHF); return r||{text:'(no reply)',provider:'HF'}}
  if(m==='local'){r=await tryRun(callLocalWebLLM); if(r&&r.streamed)return r; return await callLocalLite(payload)}
  if(m==='lite'){return await callLocalLite(payload)}
  // AUTO
  r=await tryRun(callClaude); if(r)return r;
  r=await tryRun(callOpenAI); if(r)return r;
  r=await tryRun(callDeepSeek); if(r)return r;
  r=await tryRun(callHF); if(r)return r;
  r=await tryRun(callLocalWebLLM); if(r&&r.streamed)return r;
  return await callLocalLite(payload);
}

/* ── SEND ── */
var msgBox=document.getElementById('msg');
msgBox.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}});
const LITE_CMD_RE=/^(\/help|\/time|\/coin|\/echo |\/roll \d+d\d+|\/timer \d+(s|m)$|\/sum )/i;
async function send(){
  var msgEl=document.getElementById('msg');
  var t=(msgEl&&msgEl.value||'').trim(); if(!t) return;
  if(looksLikeAKey(t)){alert('That looks like an API key — paste it in the Keys panel.');return;}
  msgEl.value='';

  // ZAP mode
  if(zapModeOn){
    chat.push({role:'user',text:t}); render();
    try{var zr=await askZapMax(t); chat.push({role:'bot',text:zr.text,provider:zr.provider}); render();}
    catch(e){chat.push({role:'bot',text:'ZAP error: '+(e.message||e)}); render();}
    return;
  }

  // Natural language local commands (time, coin, dice, calc, timer)
  var localRep=detectLocalCommand(t);
  if(localRep!==null){
    chat.push({role:'user',text:t});
    chat.push({role:'bot',text:localRep,provider:'Local'});
    render(); return;
  }

  chat.push({role:'user',text:t}); render();

  // Detect coding requests → CodeCar
  var isCode=(typeof currentMode!=='undefined'&&currentMode==='code')||
    /\b(code|build|create|make|write|program)\b.{0,60}\b(app|game|website|page|tool|script|function|calculator|todo|quiz|clock|timer|component|form|html)\b/i.test(t);

  if(isCode){
    ccStart(t);
    var loadIdx=chat.push({role:'bot',text:'__CC_LOADING__',provider:'CodeCar',_noCode:true})-1;
    render();
    await _doAICall(t);
    // Strip raw code from AI reply — it lives in the CodeCar popup instead
    for(var ci=chat.length-1;ci>=0;ci--){
      var cm=chat[ci];
      if(cm&&cm.role==='bot'&&cm.provider!=='CodeCar'&&cm.text&&!cm._noCode){
        _ccLastCode=extractLastCode();
        cm.text=cm.text.replace(/```[\s\S]*?```/g,'').replace(/<!DOCTYPE[\s\S]*?<\/html>/gi,'').trim();
        if(!cm.text) cm.text='Code ready! Tap the orb \u{1F30D} on the left \u2192 CODE button to view & edit.';
        cm._codeHidden=true; break;
      }
    }
    chat.splice(loadIdx,1);
    ccFinish();
    return;
  }

  // Normal AI call
  await _doAICall(t);
}

async function _doAICall(t){
  if(diag) diag.textContent='';
  try{
    var payload={system:buildSystem(),history:historyForAPI(),userText:t};
    var result=await askSmart(t);
    if(!result.streamed){chat.push({role:'bot',text:result.text,provider:result.provider});render();}
    if(typeof speakReplies!=='undefined'&&speakReplies&&typeof speakText==='function') speakText(result.text||'');
    if(diag) diag.textContent='';
    if(typeof setModeBadge==='function') setModeBadge(result.provider||'AI');
  }catch(e){
    chat.push({role:'bot',text:'Error: '+(e.message||e)}); render();
    if(diag) diag.textContent=e.message||e;
  }
}



/* ── SESSIONS ── */
function sessionKey(id){return 'bb_session_'+id}
function loadSessionList(){try{return JSON.parse(localStorage.getItem('bb_sessions_v1')||'[]')}catch(e){return[]}}
function saveSessionList(list){localStorage.setItem('bb_sessions_v1',JSON.stringify(list))}
function refreshChatSelect(){
  var sel=$('#chatSelect'),list=loadSessionList(); sel.innerHTML='';
  var opt=document.createElement('option');opt.value='__current__';opt.textContent='(unsaved)';sel.appendChild(opt);
  list.forEach(s=>{var o=document.createElement('option');o.value=s.id;o.textContent=s.title;sel.appendChild(o)});
  sel.value=currentSessionId||'__current__';
}
function newChat(){chat=[{role:'bot',text:'New chat started!'}];currentSessionId=null;render();refreshChatSelect()}
function saveChat(){
  var fu='';for(var i=0;i<chat.length;i++){if(chat[i].role==='user'){fu=chat[i].text;break}}
  var title=prompt('Chat name:',(fu||'Untitled').slice(0,40))||(fu||'Untitled').slice(0,40);
  var id=currentSessionId||String(Date.now());
  localStorage.setItem(sessionKey(id),JSON.stringify(chat));
  var list=loadSessionList().filter(s=>s.id!==id); list.unshift({id,title});
  saveSessionList(list); currentSessionId=id; refreshChatSelect(); alert('Saved!');
}
function deleteChat(){
  var sel=$('#chatSelect'); if(sel.value==='__current__'){alert('Select a saved chat.');return}
  if(!confirm('Delete?'))return;
  localStorage.removeItem(sessionKey(sel.value));
  saveSessionList(loadSessionList().filter(s=>s.id!==sel.value));
  currentSessionId=null; refreshChatSelect();
}
$('#chatSelect').addEventListener('change',()=>{
  var id=$('#chatSelect').value; if(id==='__current__'){currentSessionId=null;return}
  var raw=localStorage.getItem(sessionKey(id)); if(!raw)return;
  chat=JSON.parse(raw); currentSessionId=id; render();
});
refreshChatSelect();
function autosave(){try{localStorage.setItem('__bb_autosave__',JSON.stringify(chat))}catch(e){}}
var _r0=render; render=function(){_r0();autosave()};
(function(){var s=localStorage.getItem('__bb_autosave__');if(s&&chat.length<=1){try{chat=JSON.parse(s);render()}catch(e){}}})();
function downloadChat(){
  var lines=chat.map(m=>m.role.toUpperCase()+(m.provider?'['+m.provider+']':'')+': '+m.text).join('\n\n');
  var blob=new Blob([lines],{type:'text/plain'}); var a=document.createElement('a');
  a.href=URL.createObjectURL(blob); a.download='betterbot-chat.txt'; a.click();
}

/* ── MIC + TTS (plan-gated) ── */
var rec=null, listening=false;
function toggleMic(){
  if(!hasPlan('pro')){openPlans();return}
  var btn=$('#micBtn'),SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){alert('Speech recognition needs Chrome.');return}
  if(!rec){
    rec=new SR(); rec.lang='en-AU'; rec.interimResults=true; rec.maxAlternatives=1;
    rec.onresult=e=>{var t='';for(var i=e.resultIndex;i<e.results.length;i++){t+=e.results[i][0].transcript}$('#msg').value=t};
    rec.onend=()=>{listening=false;btn.textContent='🎙️ Mic';btn.classList.remove('ghost');btn.classList.add('secondary')};
    rec.onerror=()=>{listening=false;btn.textContent='🎙️ Mic'};
  }
  if(!listening){try{rec.start();listening=true;btn.textContent='🛑 Stop';btn.classList.remove('secondary');btn.classList.add('ghost')}catch(e){}}
  else{try{rec.stop()}catch(e){}}
}
function toggleTTS(){
  if(!hasPlan('pro')){openPlans();return}
  speakReplies=!speakReplies; $('#ttsBtn').textContent=speakReplies?'🔊 On':'🔊 Off';
}
function speakText(t){try{speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.rate=1;u.lang='en-AU';speechSynthesis.speak(u)}catch(e){}}

/* ── MUSIC ── */
function validUrl(u){try{return new URL(u).protocol.indexOf('http')===0}catch(e){return false}}
function ensureEmbed(u){try{var x=new URL(u);if(x.hostname==='open.spotify.com'&&!x.pathname.startsWith('/embed')){x.pathname='/embed'+x.pathname;return x.toString()}return u}catch(e){return u}}
function setStation(u){
  u=(u||'').trim(); if(!u)return; u=ensureEmbed(u); if(!validUrl(u)){alert('Invalid URL');return}
  var f=document.getElementById('playerFrame'); if(f)f.src=u; localStorage.setItem('bb_station_url',u);
}
(function(){var last=localStorage.getItem('bb_station_url');if(last)setStation(last);else setStation('https://www.youtube.com/embed/videoseries?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj')})();

/* ── THEME ── */
var blueOn=true;
$('#blueBtn').onclick=function(){
  var r=document.documentElement.style;
  if(blueOn){r.setProperty('--accent','#9333ea');r.setProperty('--accent2','#a855f7');r.setProperty('--panel','#17142a');r.setProperty('--bg','#0c0a16');this.textContent='💜'}
  else{r.setProperty('--accent','#1a56db');r.setProperty('--accent2','#3b82f6');r.setProperty('--panel','#0d1628');r.setProperty('--bg','#080d18');this.textContent='🎨'}
  blueOn=!blueOn;
};

/* ── PWA ── */
var deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault(); deferredPrompt=e;
  var b=$('#installBtn'); b.style.display='';
  b.onclick=()=>{if(!deferredPrompt)return;deferredPrompt.prompt();deferredPrompt=null;b.style.display='none'};
});
if('serviceWorker' in navigator && navigator.serviceWorker && navigator.serviceWorker.register) navigator.serviceWorker.register('service-worker.js').catch(()=>{});

$('#makePwaBtn').addEventListener('click',async function(){
  var k=readKeysFromUI();
  var manifest={name:"BetterBot DC",short_name:"BetterBotDC",description:"Claude + multi-AI chat PWA",start_url:"./index.html",scope:"./",display:"standalone",orientation:"any",theme_color:"#0d1628",background_color:"#080d18",icons:[{src:"icon-192.png",sizes:"192x192",type:"image/png",purpose:"any maskable"},{src:"icon-512.png",sizes:"512x512",type:"image/png",purpose:"any maskable"}]};
  var sw="const CACHE='bb-v3';const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(()=>{})));self.skipWaiting()});self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});self.addEventListener('fetch',e=>{const url=new URL(e.request.url);if(/api\\.anthropic|api\\.openai|api\\.deepseek|huggingface/.test(url.host)||e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(url.origin===location.origin){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match('./index.html'))))});";
  async function makePng(size){
    var c=document.createElement('canvas'); c.width=c.height=size; var x=c.getContext('2d');
    x.fillStyle='#080d18'; x.fillRect(0,0,size,size);
    var g=x.createRadialGradient(size/2,size/2,0,size/2,size/2,size*0.46);
    g.addColorStop(0,'#1d4ed8'); g.addColorStop(1,'#0a1a3a');
    x.beginPath(); x.arc(size/2,size/2,size*0.44,0,Math.PI*2); x.fillStyle=g; x.fill();
    x.beginPath(); x.arc(size/2,size/2,size*0.44,Math.PI*0.65,Math.PI*1.35);
    x.strokeStyle='#e8722a'; x.lineWidth=size*0.07; x.stroke();
    x.fillStyle='#fff'; x.font='bold '+Math.round(size*0.23)+'px system-ui'; x.textAlign='center'; x.textBaseline='middle';
    x.fillText('DC',size/2,size/2-size*0.02);
    x.fillStyle='#93c5fd'; x.font=Math.round(size*0.1)+'px system-ui';
    x.fillText('BetterBot',size/2,size/2+size*0.19);
    return new Promise(r=>c.toBlob(r,'image/png'));
  }
  function dl(text,name,type){var blob=new Blob([text],{type:type||'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click()}
  function dlB(blob,name){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click()}
  var i192=await makePng(192), i512=await makePng(512);
  dl(JSON.stringify(manifest,null,2),'manifest.webmanifest','application/manifest+json');
  await new Promise(r=>setTimeout(r,250));
  dl(sw,'service-worker.js','application/javascript');
  await new Promise(r=>setTimeout(r,250));
  dlB(i192,'icon-192.png'); await new Promise(r=>setTimeout(r,250));
  dlB(i512,'icon-512.png');
  setTimeout(()=>alert('✅ 4 PWA files downloaded!\n\n1. Save this page as index.html\n2. Put manifest & service-worker.js next to it\n3. Create  folder, put icons inside\n4. Serve via HTTPS or localhost\n5. Install button appears!\n\n🔑 Keys are in localStorage — persist through install automatically.'),500);
});

/* ── INIT ── */
(async function init(){
  setModeBadge('detecting…');
  var k=getKeys();
  if(k.claude||k.oa||k.ds||k.hf){setModeBadge('Cloud ready')}
  else{try{await ensureLocalWebLLM()}catch(e){localMode='lite';setModeBadge('Lite')}}
})();

/* ═══════════════════════════════════════════════
   ALL SESSION ADDITIONS — Free AI, ZAP, Tools, etc.
═══════════════════════════════════════════════ */

/* ── OVERRIDE buildSystem with natural friend version ── */

/* ── FREE AI — no user key needed ── */
async function callFreeAI(payload){
  var sys=payload.system||buildSystem();
  try{
    var res=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json','anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
      body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:2000,system:sys,messages:payload.history.concat([{role:'user',content:payload.userText}])})
    });
    if(res.ok){
      var data=await res.json();
      var text=(data.content&&data.content[0]&&data.content[0].text||'').trim();
      if(text) return{text:text,provider:'BetterBot'};
    }
  }catch(e){}
  // Try user key
  try{
    var k=getKeys();
    var key=(k.claude||(document.getElementById('claudeKey')&&document.getElementById('claudeKey').value)||'').trim();
    if(key){
      var res2=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:k.claudeModel||'claude-haiku-4-5-20251001',max_tokens:2000,system:sys,messages:payload.history.concat([{role:'user',content:payload.userText}])})});
      if(res2.ok){var d2=await res2.json();var t2=(d2.content&&d2.content[0]&&d2.content[0].text||'').trim();if(t2)return{text:t2,provider:'BetterBot'};}
    }
  }catch(e){}
  return{text:offlineBrain(payload.userText,payload.userText.toLowerCase(),getUserName()),provider:'BetterBot (offline)'};
}

/* ── OFFLINE BRAIN fallback ── */
function offlineBrain(t,lc,name){
  if(/^(hey|hi|hello|yo|sup|hiya|howdy|wsp)\b/i.test(lc)){return'Hey '+name+'! Ask me anything — I understand natural conversation.';}
  if(/\b(how are you|you good|you ok)\b/i.test(lc)){return'Doing great! How are YOU doing, '+name+'?';}
  if(/\b(joke|make me laugh)\b/i.test(lc)){return'Why do programmers prefer dark mode? Light attracts bugs. 😂';}
  if(/\b(motivate me|inspire me)\b/i.test(lc)){return'Hey '+name+' — you\'ve got this. Take one step right now. Go! ⚡';}
  if(/\b(trivia|quiz me)\b/i.test(lc)){return'TRIVIA: Which planet has the most moons?\nA) Jupiter  B) Saturn ✓  C) Uranus  D) Neptune\nAnswer: B — Saturn has 146!';}
  if(/\b(wild fact|fun fact)\b/i.test(lc)){return'Honey never expires — 3000 year old honey was found in Egyptian tombs, still edible. 🍯';}
  return'I\'m here, '+name+'! Ask me anything — questions, code, advice, jokes, whatever you need.';
}

/* ── OVERRIDE callLocalLite to use free AI ── */
callLocalLite = async function(p){
  var result=await callFreeAI(p);
  if(result&&result.text){
    var out='',idx=chat.push({role:'bot',text:'...',provider:result.provider})-1; render();
    for(var i=0;i<result.text.length;i+=12){await new Promise(function(r){setTimeout(r,8);});out+=result.text.slice(i,i+12);chat[idx].text=out;render();}
    chat[idx].text=out.trim(); render();
    return{text:out.trim(),provider:result.provider,streamed:true};
  }
  var reply=offlineBrain(p.userText,p.userText.toLowerCase(),getUserName());
  var out='',idx=chat.push({role:'bot',text:'...',provider:'BetterBot'})-1; render();
  for(var i=0;i<reply.length;i+=10){await new Promise(function(r){setTimeout(r,9);});out+=reply.slice(i,i+10);chat[idx].text=out;render();}
  return{text:out.trim(),provider:'BetterBot',streamed:true};
};

/* ── REMOVE plan gates from provider calls ── */
// Wrap callClaude, callOpenAI etc. to skip the plan check
var _pc=callClaude,_po=callOpenAI,_pd=callDeepSeek,_ph=callHF;
callClaude=async function(p){try{return await _pc(p);}catch(e){if(String(e).includes('skip: plan')){var k=getKeys(),key=(k.claude||(document.getElementById('claudeKey')&&document.getElementById('claudeKey').value)||'').trim();if(!key)throw new Error('skip');var model=k.claudeModel||'claude-sonnet-4-5';var res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:model,max_tokens:2000,system:p.system,messages:p.history.concat([{role:'user',content:p.userText}])})});if(!res.ok)throw new Error('Claude '+res.status);var data=await res.json();return{text:(data.content&&data.content[0]&&data.content[0].text||'').trim(),provider:'Claude'};}throw e;}};

/* ── ZAP MAX SYSTEM ── */
var zapModeOn=false;
var ZAP_SYSTEM='You are ZAP MAX — BetterBot DC\'s AI. You have Claude-level intelligence with electric, hype energy.\n\nYou know everything: science, code, history, math, philosophy, pop culture, cooking, fitness, relationships, art — literally everything.\n\nPersonality:\n- High energy but genuinely smart and accurate\n- Funny, warm, sarcastic with love — never mean\n- Open with energy: "ZAP!", "BOOM", "SHEEEESH", or just dive in\n- Adapt: casual question = casual reply, complex = full breakdown\n- For code: always write complete working code in ```blocks```\n- Never boring, never refuse a normal question\n\nCurrent user: __USERNAME__ | Interests: __USERINTS__ | Mode: __CHATMODE__';

function buildZapSystem(){
  var name=getUserName();
  var ints=((document.getElementById('ints')&&document.getElementById('ints').value)||'').split(',').map(function(s){return s.trim();}).filter(Boolean).join(', ');
  var modes={chat:'normal chat',fast:'FAST — keep answers under 3 sentences',code:'CODECAR — always use ```code blocks```',media:'PIC+VID',write:'WRITE',math:'MATH — step by step solutions'};
  var cur=typeof currentMode!=='undefined'?currentMode:'chat';
  return ZAP_SYSTEM.replace('__USERNAME__',name).replace('__USERINTS__',ints||'general').replace('__CHATMODE__',modes[cur]||'normal chat');
}

async function askZapMax(userText){
  var k=getKeys();
  var sys=buildZapSystem();
  var hist=historyForAPI();
  var msgs=hist.concat([{role:'user',content:userText}]);

  // Try user's Claude key
  try{
    var key=(k.claude||(document.getElementById('claudeKey')&&document.getElementById('claudeKey').value)||'').trim();
    if(key){
      var r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:k.claudeModel||'claude-sonnet-4-5',max_tokens:2048,system:sys,messages:msgs})});
      if(r.ok){var d=await r.json();var t=(d.content&&d.content[0]&&d.content[0].text||'').trim();if(t)return{text:t,provider:'ZAP+Claude'};}
    }
  }catch(e){}

  // Try user's OpenAI key
  try{
    var oaKey=(k.oa||(document.getElementById('oaKey')&&document.getElementById('oaKey').value)||'').trim();
    if(oaKey){
      var r2=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+oaKey},body:JSON.stringify({model:'gpt-4o-mini',messages:[{role:'system',content:sys}].concat(msgs),temperature:0.85,max_tokens:2048})});
      if(r2.ok){var d2=await r2.json();var t2=(d2.choices[0].message.content||'').trim();if(t2)return{text:t2,provider:'ZAP+OpenAI'};}
    }
  }catch(e){}

  // Free AI fallback
  try{
    var fr=await callFreeAI({system:sys,history:hist,userText:userText});
    if(fr&&fr.text&&!fr.text.startsWith("I'm here"))return{text:fr.text,provider:'ZAP\u26a1'};
  }catch(e){}

  // Local fallback
  return{text:zapLocalFallback(userText,getUserName()),provider:'ZAP+Local'};
}

function zapLocalFallback(text,name){
  var lc=text.toLowerCase();
  var ops=['ZAP!','BOOM -','SHEEEESH -','LET\'S GO -'];
  var o=ops[Math.floor(Math.random()*ops.length)];
  if(/^(hey|hi|yo|sup)\b/i.test(lc)) return o+' YO '+name+'! ZAP MAX online! Ask me anything - I solve everything. \u26a1';
  if(/\b(roast me)\b/.test(lc)) return o+' '+name+' - you spend 3 hours planning productivity and 0 hours executing. Notes app is a graveyard. But you\'re here so clearly leveling up. \ud83d\udd25';
  if(/\b(joke)\b/.test(lc)) return o+' Why do programmers prefer dark mode? Light attracts bugs. \ud83d\ude02 BOOM! \u26a1';
  if(/\b(motivate|inspire)\b/.test(lc)) return '\u26a1 '+name.toUpperCase()+' - LOCK IN. Every person you admire almost quit. The difference? They kept going. Take ONE step right now. LET\'S GO! \ud83d\udd25';
  if(/\b(fact|did you know)\b/.test(lc)) return o+' Honey never expires. 3000-year-old honey found in Egyptian tombs still edible. Bees are BUILT DIFFERENT. \ud83d\udc1d BOOM! \u26a1';
  return o+' '+name+' - great question! I\'m on it. BOOM! \u26a1';
}

function toggleZapMode(){
  zapModeOn=!zapModeOn;
  var btn=document.getElementById('zapBtn');
  var banner=document.getElementById('zapBanner');
  if(zapModeOn){
    if(btn){btn.classList.add('active');btn.textContent='ZAP ON';}
    if(banner) banner.classList.add('on');
    document.body.classList.add('zap-mode');document.documentElement.classList.add('zap-mode');
    document.getElementById('msg').placeholder='Ask ZAP anything — no key needed, I answer everything...';
    if(!chat.find(function(m){return m.provider&&m.provider.startsWith('ZAP');})){
      chat.push({role:'bot',text:'ZAP MAX ONLINE! No key needed - I solve everything.\n\nAsk me:\nCode a game \u2022 Explain quantum \u2022 Write a song \u2022 Solve math \u2022 Roast me \u2022 Plan goals \u2022 Debug code \u2022 Translate \u2022 Homework\n\nFree AI powered. LET\'S GO '+getUserName().toUpperCase()+'!',provider:'ZAP\u26a1'});
      render();
    }
  }else{
    if(btn){btn.classList.remove('active');btn.textContent='ZAP MAX';}
    if(banner) banner.classList.remove('on');
    document.body.classList.remove('zap-mode');document.documentElement.classList.remove('zap-mode');
    document.getElementById('msg').placeholder='Ask me anything — code, questions, advice, jokes, anything...';
  }
}

/* ── NATURAL LANGUAGE COMMAND DETECTION ── */
function detectLocalCommand(t){
  var lc=t.toLowerCase().trim();
  if(/\b(what.{0,8}time|time right now|current time|time is it)\b/i.test(lc)){var now=new Date();return '\ud83d\udd50 '+now.toLocaleTimeString()+'\n\ud83d\udcc5 '+now.toLocaleDateString(undefined,{weekday:'long',year:'numeric',month:'long',day:'numeric'});}
  if(/\b(flip.{0,10}coin|heads or tails|toss a coin)\b/i.test(lc)){return Math.random()<0.5?'\ud83e\ude99 Heads!':'\ud83e\ude99 Tails!';}
  var dm=lc.match(/(\d+)d(\d+)/i);if(dm){var n=Math.min(+dm[1],20),sides=+dm[2],arr=[],s=0;for(var i=0;i<n;i++){var r=1+Math.floor(Math.random()*sides);arr.push(r);s+=r;}return '\ud83c\udfb2 Rolled '+n+'d'+sides+': ['+arr.join(', ')+'] = '+s;}
  var tm=lc.match(/(?:set (?:a )?timer|timer|remind me)(?: for| in)?\s+(\d+)\s*(second|sec|s|minute|min|m)\b/i);
  if(tm){var num=+tm[1],isMin=/^m/.test(tm[2]);setTimeout(function(){chat.push({role:'bot',text:'\u23f0 Timer done! ('+num+(isMin?' min':' sec')+')'});render();},isMin?num*60000:num*1000);return'\u23f3 Timer set for '+num+(isMin?' minute'+(num>1?'s':''):' second'+(num>1?'s':''))+'!';}
  var cm=lc.match(/(?:calc(?:ulate)?|compute|what(?:\'s| is)(?: the)? value of)\s*([0-9\s\+\-\*\/\(\)\.%\^]+)/i);
  if(!cm&&/^[\d\s\+\-\*\/\(\)\.%\^]+$/.test(t.trim())&&/\d/.test(t)&&/[\+\-\*\/\^%]/.test(t))cm=[null,t.trim()];
  if(cm){var expr=(cm[1]||'').trim().replace(/\^/g,'**');if(expr){try{var res=new Function('return ('+expr+')')();if(isFinite(res))return'\ud83d\udd22 '+cm[1].trim()+' = '+res;}catch(e){}}}
  return null;
}

/* ── OVERRIDE send() to add CodeCar + ZAP + natural lang ── */
var _origSend=send;
/* ── TOAST ── */
var _toastTimer;
function showToast(msg){
  var el=document.getElementById('shortcutToast');
  if(!el){el=document.createElement('div');el.id='shortcutToast';document.body.appendChild(el);}
  el.textContent=msg;el.classList.add('show');
  clearTimeout(_toastTimer);_toastTimer=setTimeout(function(){el.classList.remove('show');},2200);
}

/* ── CODECAR ── */
var _ccSteps=[],_ccActive=false,_ccPopupOpen=false,_ccLastCode='',_ccBlobUrl='',_ccCodeAreaOpen=false;
var CC_STEPS=[
  {icon:'\ud83e\udde0',text:'Reading your request\u2026'},
  {icon:'\ud83d\udcd0',text:'Planning structure\u2026'},
  {icon:'\ud83d\udcbb',text:'Writing code\u2026'},
  {icon:'\ud83c\udfa8',text:'Styling the UI\u2026'},
  {icon:'\u26a1',text:'Adding interactivity\u2026'},
  {icon:'\ud83d\udd17',text:'Connecting parts\u2026'},
  {icon:'\ud83e\uddea',text:'Checking logic\u2026'},
  {icon:'\u2728',text:'Polishing\u2026'},
  {icon:'\ud83d\ude80',text:'Wrapping up\u2026'},
  {icon:'\u2705',text:'Done!'},
];

function ccStart(userText){
  _ccActive=true;_ccSteps=[];_ccLastCode='';_ccBlobUrl='';_ccCodeAreaOpen=false;
  var orb=document.getElementById('codeCarOrb');
  var label=document.getElementById('codeCarLabel');
  if(orb) orb.classList.add('on');
  if(label) label.textContent='CODING';
  var codeBtn=document.getElementById('ccCodeBtn');
  var codeArea=document.getElementById('ccCodeArea');
  var footer=document.getElementById('stepsFooter');
  var titleEl=document.getElementById('stepsTitle');
  var iconEl=document.getElementById('stepsStatusIcon');
  var prog=document.getElementById('stepsProgressFill');
  if(codeBtn) codeBtn.classList.remove('on');
  if(codeArea) codeArea.classList.remove('on');
  if(footer) footer.classList.remove('on');
  if(titleEl) titleEl.textContent='CodeCar is working\u2026';
  if(iconEl) iconEl.textContent='\u2699\ufe0f';
  if(prog) prog.style.width='0%';
  var steps=CC_STEPS.map(function(s,i){return{icon:s.icon,text:s.text,state:'pending',id:i};});
  if(/python/i.test(userText)) steps[2]={icon:'\ud83d\udc0d',text:'Writing Python\u2026',state:'pending',id:2};
  if(/game/i.test(userText)) steps[4]={icon:'\ud83c\udfae',text:'Programming game\u2026',state:'pending',id:4};
  _ccSteps=steps;
  renderStepsCC();
  var idx2=0;
  window._ccInterval=setInterval(function(){
    if(!_ccActive){clearInterval(window._ccInterval);return;}
    if(idx2>0) _ccSteps[idx2-1].state='done';
    if(idx2<_ccSteps.length-1){_ccSteps[idx2].state='active';idx2++;}
    updateProgressCC(Math.round((idx2/(_ccSteps.length-1))*80));
    renderStepsCC();
  },700);
}

function ccFinish(){
  _ccActive=false;clearInterval(window._ccInterval);
  _ccSteps.forEach(function(s){s.state='done';});
  updateProgressCC(100);renderStepsCC();
  var label=document.getElementById('codeCarLabel');if(label) label.textContent='DONE \u2713';
  _ccLastCode=extractLastCode();
  if(_ccLastCode){
    try{
      var html=_ccLastCode;
            if(!/<html/i.test(html)) html='<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:system-ui,sans-serif;padding:16px;margin:0}</style></head><body>'+html+'</body></html>';

      _ccLastCode=html;
      _ccBlobUrl=URL.createObjectURL(new Blob([_ccLastCode],{type:'text/html'}));
    }catch(e){_ccBlobUrl='';}
  }
  var ta=document.getElementById('ccCodeTextarea');
  if(ta) ta.value=_ccLastCode||'// No code found. Ask for an HTML page, game, or web app.';
  var codeBtn=document.getElementById('ccCodeBtn');
  var footer=document.getElementById('stepsFooter');
  var titleEl=document.getElementById('stepsTitle');
  var iconEl=document.getElementById('stepsStatusIcon');
  var safariLink=document.getElementById('stepsSafariLink');
  if(codeBtn) codeBtn.classList.add('on');
  if(footer) footer.classList.add('on');
  if(titleEl) titleEl.textContent='Code ready!';
  if(iconEl) iconEl.textContent='\u2705';
  if(safariLink&&_ccBlobUrl){safariLink.href=_ccBlobUrl;}else if(safariLink){safariLink.style.display='none';}
  if(!_ccPopupOpen){var popup=document.getElementById('codeStepsPopup');if(popup){popup.classList.add('on');_ccPopupOpen=true;}}
  setTimeout(function(){
    chat.push({role:'bot',text:_ccBlobUrl?'__SAFARI_LINK__'+_ccBlobUrl:'\u2705 Code ready! Tap the orb on the left \u2192 then tap \u25fc CODE to view and edit.',provider:'CodeCar',_noCode:true});
    render();
  },200);
}

function updateProgressCC(pct){var fill=document.getElementById('stepsProgressFill');if(fill) fill.style.width=pct+'%';}

function renderStepsCC(){
  var list=document.getElementById('stepsList');if(!list) return;
  list.innerHTML=_ccSteps.map(function(s){
    var cls='step-item'+(s.state==='done'?' done':s.state==='active'?' active':'');
    return '<div class="'+cls+'"><span class="step-icon">'+s.icon+'</span><span class="step-text">'+s.text+'</span></div>';
  }).join('');
  list.scrollTop=list.scrollHeight;
}

function toggleStepsPopup(){
  var popup=document.getElementById('codeStepsPopup');if(!popup) return;
  _ccPopupOpen=!_ccPopupOpen;popup.classList.toggle('on',_ccPopupOpen);
}

function toggleCodeArea(){
  _ccCodeAreaOpen=!_ccCodeAreaOpen;
  var area=document.getElementById('ccCodeArea');
  var btn=document.getElementById('ccCodeBtn');
  if(area) area.classList.toggle('on',_ccCodeAreaOpen);
  if(btn) btn.textContent=_ccCodeAreaOpen?'\u25b2 HIDE CODE':'\u25fc CODE';
}

function copyCodeFromArea(){
  var ta=document.getElementById('ccCodeTextarea');
  var code=(ta&&ta.value)||_ccLastCode;
  if(!code){showToast('No code yet!');return;}
  navigator.clipboard.writeText(code).then(function(){showToast('Code copied! \u2705');});
}

function applyEditedCode(){
  var ta=document.getElementById('ccCodeTextarea');
  if(!ta||!ta.value.trim()){showToast('Nothing to apply!');return;}
  _ccLastCode=ta.value.trim();
  try{
    _ccBlobUrl=URL.createObjectURL(new Blob([_ccLastCode],{type:'text/html'}));
    var safariLink=document.getElementById('stepsSafariLink');
    if(safariLink) safariLink.href=_ccBlobUrl;
    render();showToast('Applied! \u2705');
  }catch(e){showToast('Failed.');}
}

function copyLastCode(){
  var ta=document.getElementById('ccCodeTextarea');
  var code=(ta&&ta.value)||_ccLastCode||extractLastCode();
  if(!code){showToast('No code found!');return;}
  navigator.clipboard.writeText(code).then(function(){
    showToast('Copied! \u2705');
    var btn=document.getElementById('stepsCopyBtn');
    if(btn){btn.textContent='\u2705 Copied!';setTimeout(function(){btn.textContent='\ud83d\udccb Copy Code';},2000);}
  });
}

function extractLastCode(){
  for(var i=chat.length-1;i>=0;i--){
    var m=chat[i];if(!m||!m.text) continue;
    var full=m.text.match(/<!DOCTYPE[\s\S]*?<\/html>/i)||m.text.match(/<html[\s\S]*?<\/html>/i);
    if(full) return full[0];
    var block=m.text.match(/```(?:html|javascript|css|python)?\n?([\s\S]*?)```/);
    if(block){
      var code=block[1].trim();
      if(!/<html/i.test(code)) code='<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:system-ui,sans-serif;padding:16px}</style></head><body>'+code+'</body></html>';
      return code;
    }
  }
  return '';
}

/* ── PATCH render() for CodeCar ── */
var _origRenderCC=render;
render=function(){
  _origRenderCC();
  // Skip code formatting for CodeCar messages; format normally for others
  document.querySelectorAll('#log .bubble.bot:not(.formatted)').forEach(function(el){
    el.classList.add('formatted');
    var idx=parseInt(el.dataset.i);
    var msg=chat[idx];
    if(msg&&(msg.provider==='CodeCar'||msg._noCode||msg._codeHidden)) return;
    el.innerHTML=el.innerHTML.replace(/```(\w*)\n?([\s\S]*?)```/g,function(_,lang,code){
      var id='cb'+Math.random().toString(36).slice(2);
      return '<div class="code-block"><div class="code-block-header"><span>'+(lang||'code').toUpperCase()+'</span><button class="code-copy-btn" onclick="copyCode(\''+id+'\')">Copy</button></div><pre id="'+id+'"><code>'+code+'</code></pre></div>';
    });
  });
  // Handle special chat messages
  document.querySelectorAll('#log .bubble.bot').forEach(function(el){
    var txt=el.textContent||'';
    // Loading card
    if(txt.startsWith('__CC_LOADING__')){
      el.innerHTML='<div class="cc-chat-card"><div class="cc-chat-globe"><span class="cc-chat-car-spin">\ud83d\ude97</span></div><div class="cc-chat-info"><div class="cc-chat-title">\u2699\ufe0f Coding\u2026</div><div class="cc-chat-sub">Tap the orb to see progress</div></div><button class="cc-open-btn" onclick="toggleStepsPopup()">\u25b6 View</button></div>';
      el.style.cssText='background:transparent;border:none;padding:2px 0';
      return;
    }
    // Safari link card
    if(txt.startsWith('__SAFARI_LINK__')){
      var url=txt.replace('__SAFARI_LINK__','').trim();
      el.innerHTML='<div class="cc-chat-card"><div class="cc-chat-globe"><span class="cc-chat-car-spin">\ud83d\ude97</span></div><div class="cc-chat-info"><div class="cc-chat-title">Code Ready!</div><div class="cc-chat-sub">Tap orb to view \u2022 Edit \u2022 Copy</div></div>'+(url?'<a href="'+url+'" target="_blank" class="cc-open-btn">\ud83c\udf10 Open</a>':'<button class="cc-open-btn" onclick="toggleStepsPopup()">\u25fc View</button>')+'</div>';
      el.style.cssText='background:transparent;border:none;padding:2px 0';
      return;
    }
    // Hidden code indicator
    if(txt.includes('[code hidden')||txt.includes('tap the orb')||txt.includes('Tap the')&&txt.includes('orb')){
      // Already handled, just style it
    }
  });
};

/* ── PICDOT ── */
var pdMode='image', pdGalleryItems=[], pdEditImageData=null;

function pdSetMode(mode,btn){
  pdMode=mode;
  document.querySelectorAll('.pd-tab').forEach(function(b){b.classList.remove('active');});
  if(btn) btn.classList.add('active');
  ['pdImage','pdVideo','pdEdit','pdGallery'].forEach(function(id){
    var el=document.getElementById(id);if(el) el.style.display=(id==='pd'+mode.charAt(0).toUpperCase()+mode.slice(1))?'block':'none';
  });
}

function pdUseSuggestion(el){var inp=document.getElementById('pdPrompt');if(inp){inp.value=el.textContent.trim();inp.focus();}}

async function pdEnhancePrompt(rawPrompt,style){
  try{
    var res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:120,messages:[{role:'user',content:'Enhance this image prompt for '+style+' style. Add lighting, mood, detail. Under 100 words. Return ONLY the enhanced prompt:\n\n'+rawPrompt}]})});
    if(res.ok){var data=await res.json();var txt=(data.content&&data.content[0]&&data.content[0].text||'').trim();if(txt) return txt;}
  }catch(e){}
  return rawPrompt;
}

async function pdGenerate(){
  var rawPrompt=(document.getElementById('pdPrompt')&&document.getElementById('pdPrompt').value||'').trim();
  if(!rawPrompt){alert('Describe the image!');return;}
  var style=(document.getElementById('pdStyle')&&document.getElementById('pdStyle').value)||'photorealistic';
  var ratio=(document.getElementById('pdRatio')&&document.getElementById('pdRatio').value)||'square';
  var count=parseInt((document.getElementById('pdCount')&&document.getElementById('pdCount').value)||'1');
  var btn=document.getElementById('pdGenBtn');
  var prog=document.getElementById('pdImgProgress');
  var statusEl=document.getElementById('pdStatus');
  var resultEl=document.getElementById('pdImgResult');
  if(btn) btn.disabled=true;
  if(prog) prog.style.display='block';
  if(resultEl) resultEl.innerHTML='';
  var statusMsgs=['Enhancing prompt...','Generating...','Adding magic...','Almost done...'];
  var si=0,statusTimer=setInterval(function(){if(statusEl) statusEl.textContent=statusMsgs[si++%statusMsgs.length];},1200);
  try{
    var enhanced=await pdEnhancePrompt(rawPrompt,style);
    var styleSfx={'photorealistic':'photorealistic, 8K, sharp, professional photography','cinematic':'cinematic photography, dramatic lighting, film grain','anime':'anime style, vibrant, detailed illustration','digital art':'digital art, concept art, trending artstation','neon glow':'neon lights, cyberpunk, dark background, glowing'};
    var finalPrompt=enhanced+', '+(styleSfx[style]||style);
    var dims={square:{w:1024,h:1024},landscape:{w:1792,h:1024},portrait:{w:1024,h:1792}};
    var dim=dims[ratio]||dims.square;
    var html='<div style="display:grid;grid-template-columns:'+(count===1?'1fr':'repeat(2,1fr)')+';gap:8px">';
    for(var i=0;i<count;i++){
      var seed=Math.floor(Math.random()*999999);
      var url='https://image.pollinations.ai/prompt/'+encodeURIComponent(finalPrompt)+'?width='+dim.w+'&height='+dim.h+'&seed='+seed+'&nologo=true';
      html+='<div style="border-radius:12px;overflow:hidden;cursor:pointer;position:relative" onclick="pdViewFull(\''+url+'\')"><img src="'+url+'" style="width:100%;display:block;opacity:0;transition:opacity .5s" onload="this.style.opacity=1" onerror="this.parentElement.innerHTML=\'<div style=padding:20px;color:var(--muted);font-size:12px>Generation failed. Try again.</div>\'"/></div>';
      pdGalleryItems.push({url:url,prompt:rawPrompt,style:style,ts:Date.now()});
    }
    html+='</div><div style="display:flex;gap:6px;margin-top:8px">';
    html+='<button class="pd-action-btn" onclick="pdDownloadOne(\''+url+'\')">⬇️ Download</button>';
    html+='<button class="pd-action-btn" onclick="document.getElementById(\'pdPrompt\').value=\''+rawPrompt.replace(/'/g,"\\'")+'\'">🔄 Re-gen</button>';
    html+='</div>';
    if(resultEl) resultEl.innerHTML=html;
  }catch(err){if(resultEl) resultEl.innerHTML='<div style="color:var(--danger);font-size:12px;padding:10px">Error: '+err.message+'</div>';}
  finally{clearInterval(statusTimer);if(btn) btn.disabled=false;if(prog) prog.style.display='none';}
}

function pdViewFull(url){
  var overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;background:#000d;z-index:200000;display:flex;align-items:center;justify-content:center;cursor:zoom-out;padding:20px';
  overlay.onclick=function(){overlay.remove();};
  var img=document.createElement('img');img.src=url;img.style.cssText='max-width:100%;max-height:90vh;border-radius:12px';
  overlay.appendChild(img);document.body.appendChild(overlay);
}

function pdDownloadOne(url){var a=document.createElement('a');a.href=url;a.download='picdot-'+Date.now()+'.png';a.target='_blank';document.body.appendChild(a);a.click();document.body.removeChild(a);}

/* ── MEDIA TAB INTERCEPT for PicDot ── */
var _origSetMediaTab=typeof setMediaTab==='function'?setMediaTab:function(){};
setMediaTab=function(tab,btn){
  var picdotPanel=document.getElementById('picdotPanel');
  var mediaDrop=document.getElementById('mediaDrop');
  var mediaPreview=document.getElementById('mediaPreview');
  if(tab==='picdot'){
    document.querySelectorAll('.media-tab').forEach(function(b){b.classList.remove('active');});
    if(btn) btn.classList.add('active');
    if(picdotPanel) picdotPanel.classList.add('on');
    if(mediaDrop) mediaDrop.style.display='none';
    if(mediaPreview) mediaPreview.style.display='none';
  }else{
    if(picdotPanel) picdotPanel.classList.remove('on');
    if(mediaDrop) mediaDrop.style.display='';
    if(mediaPreview) mediaPreview.style.display='';
    _origSetMediaTab(tab,btn);
  }
};

/* ── CURRENCY CONVERTER ── */
async function convertCurrency(){
  var amt=parseFloat((document.getElementById('currAmt')&&document.getElementById('currAmt').value)||1);
  var from=(document.getElementById('currFrom')&&document.getElementById('currFrom').value)||'USD';
  var to=(document.getElementById('currTo')&&document.getElementById('currTo').value)||'INR';
  var el=document.getElementById('currResult');
  if(el) el.textContent='Loading...';
  try{var res=await fetch('https://open.er-api.com/v6/latest/'+from);var data=await res.json();var rate=data.rates&&data.rates[to];if(!rate)throw new Error('No rate');var result=(amt*rate).toFixed(4);if(el) el.textContent=amt+' '+from+' = '+result+' '+to;showToast(result+' '+to);}
  catch(e){if(el) el.textContent='Try again';}
}

/* ── BMI CALCULATOR ── */
function calcBMI(){
  var w=parseFloat((document.getElementById('bmiWeight')&&document.getElementById('bmiWeight').value)||0);
  var h=parseFloat((document.getElementById('bmiHeight')&&document.getElementById('bmiHeight').value)||0)/100;
  var el=document.getElementById('bmiResult');
  if(!w||!h){if(el) el.textContent='Enter weight & height';return;}
  var bmi=(w/(h*h)).toFixed(1);
  var cat=bmi<18.5?'Underweight':bmi<25?'Healthy':bmi<30?'Overweight':'Obese';
  var emoji=bmi<25?'\u2705':bmi<30?'\u26a0\ufe0f':'\u2757';
  if(el) el.textContent=emoji+' BMI: '+bmi+' ('+cat+')';
}

/* ── DAILY CHALLENGE ── */
var _challenges=['Brain Stretch: Explain quantum entanglement using only everyday objects.','Physical: Do 20 push-ups right now. Go!','Writing: Write 5 sentences about the most interesting person you know, without using their name.','Creative: Draw something using only 3 shapes.','Learning: Pick a random Wikipedia article and read the whole thing.','Math: Calculate how many seconds you have been alive.'];
async function getDailyChallenge(){
  var el=document.getElementById('challengeVal');
  var sub=document.getElementById('challengeSub');
  try{
    var res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:100,messages:[{role:'user',content:'ONE daily challenge for personal growth. Format: "TITLE: description". Short, actionable, completable today.'}]})});
    if(res.ok){var data=await res.json();var txt=(data.content&&data.content[0]&&data.content[0].text||'').trim();var parts=txt.split(':');if(parts.length>=2){if(el) el.textContent=parts[0].trim();if(sub) sub.textContent=parts.slice(1).join(':').trim();return;}}
  }catch(e){}
  var c=_challenges[Math.floor(Math.random()*_challenges.length)].split(':');
  if(el) el.textContent=c[0];if(sub) sub.textContent=c.slice(1).join(':').trim();
}

/* ── POMODORO ── */
var _pomSecs=25*60,_pomRunning=false,_pomInterval=null;
function pomUpdate(){var el=document.getElementById('pomTimer');if(!el) return;var m=Math.floor(_pomSecs/60),s=_pomSecs%60;el.textContent=(m<10?'0':'')+m+':'+(s<10?'0':'')+s;}
function pomStart(){
  if(_pomRunning){clearInterval(_pomInterval);_pomRunning=false;showToast('Paused');}
  else{_pomRunning=true;showToast('Pomodoro started!');_pomInterval=setInterval(function(){_pomSecs--;if(_pomSecs<=0){clearInterval(_pomInterval);_pomRunning=false;_pomSecs=25*60;showToast('\ud83c\udf45 Done! 5 min break.');chat.push({role:'bot',text:'\ud83c\udf45 Pomodoro done! Take a 5-minute break.',provider:'Timer'});render();}pomUpdate();},1000);}
}
function pomReset(){clearInterval(_pomInterval);_pomRunning=false;_pomSecs=25*60;pomUpdate();showToast('Reset');}

/* ── PASSWORD GENERATOR ── */
function genPass(){var c='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*',p='';for(var i=0;i<16;i++) p+=c[Math.floor(Math.random()*c.length)];var el=document.getElementById('passVal');if(el) el.textContent=p;showToast('Password generated!');}
function copyPass(){var el=document.getElementById('passVal');if(!el) return;navigator.clipboard.writeText(el.textContent).then(function(){showToast('Copied!');});}

/* ── MOOD ── */
function setMood(emoji,label){var el=document.getElementById('moodVal');if(el) el.textContent='Feeling: '+emoji+' '+label;chat.push({role:'bot',text:'Noted your mood: '+emoji+' '+label+'. How can I help you today?',provider:'Mood'});render();}

/* ── IDEA GENERATOR ── */
var _ideas=['Build a habit tracker app','Start a YouTube channel about your passion','Write a short story this weekend','Learn a new programming language','Create a digital art portfolio','Build a browser extension'];
async function generateIdea(){
  var el=document.getElementById('ideaVal');if(el) el.textContent='Thinking...';
  try{
    var res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:80,messages:[{role:'user',content:'ONE creative actionable project idea. 1-2 sentences. Be specific and interesting.'}]})});
    if(res.ok){var data=await res.json();var idea=(data.content&&data.content[0]&&data.content[0].text||'').trim();if(el&&idea) el.textContent=idea;return;}
  }catch(e){}
  if(el) el.textContent=_ideas[Math.floor(Math.random()*_ideas.length)];
}

/* ── QUIZ ── */
var _quizScore=0,_quizTotal=0,_quizAnswered=false,_currentQuiz=null;
var _quizBank=[
  {q:'Which planet has the most moons?',opts:['Venus','Mercury','Saturn','Neptune'],ans:2,cat:'\ud83c\udf0c Space'},
  {q:'What is the symbol for Gold?',opts:['Ag','Fe','Au','Gd'],ans:2,cat:'\ud83e\uddea Science'},
  {q:'Who wrote Romeo and Juliet?',opts:['Dickens','Shakespeare','Hemingway','Tolkien'],ans:1,cat:'\ud83d\udcda Literature'},
  {q:'What is 15 x 15?',opts:['205','215','225','235'],ans:2,cat:'\ud83d\udd22 Math'},
  {q:'How many hearts does an octopus have?',opts:['1','2','3','4'],ans:2,cat:'\ud83d\udc19 Nature'},
];
async function startQuiz(){document.getElementById('quizModal').classList.add('on');_quizScore=0;_quizTotal=0;await nextQuestion();}
async function nextQuestion(){
  _quizAnswered=false;
  try{
    var res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:180,messages:[{role:'user',content:'Trivia question. JSON only, no other text: {"q":"question","opts":["A","B","C","D"],"ans":0,"cat":"emoji Topic"} - ans is 0-based index of correct answer.'}]})});
    if(res.ok){var data=await res.json();var txt=(data.content&&data.content[0]&&data.content[0].text||'').trim();var q=JSON.parse(txt.replace(/```json|```/g,'').trim());if(q.q&&q.opts&&q.opts.length===4){_currentQuiz=q;renderQuiz();return;}}
  }catch(e){}
  _currentQuiz=_quizBank[Math.floor(Math.random()*_quizBank.length)];renderQuiz();
}
function renderQuiz(){
  var q=_currentQuiz;var el=document.getElementById('quizContent');
  var scoreEl=document.getElementById('quizScoreDisplay');var totalEl=document.getElementById('quizTotal');var catEl=document.getElementById('quizCat');
  if(scoreEl) scoreEl.textContent=_quizScore;if(totalEl) totalEl.textContent=_quizTotal;if(catEl) catEl.textContent=q.cat;
  if(!el) return;
  el.innerHTML='<div class="quiz-q">'+escHtml(q.q)+'</div>'+q.opts.map(function(opt,i){return '<button class="quiz-opt" onclick="answerQuiz('+i+')">'+escHtml(opt)+'</button>';}).join('');
}
function answerQuiz(idx){
  if(_quizAnswered) return;_quizAnswered=true;_quizTotal++;
  var q=_currentQuiz;var btns=document.querySelectorAll('.quiz-opt');
  btns.forEach(function(b,i){if(i===q.ans) b.classList.add('correct');else if(i===idx) b.classList.add('wrong');b.disabled=true;});
  if(idx===q.ans){_quizScore++;showToast('\u2705 Correct! +1');}else{showToast('\u274c Wrong! Answer: '+q.opts[q.ans]);}
  var scoreEl=document.getElementById('quizScoreDisplay');var totalEl=document.getElementById('quizTotal');
  if(scoreEl) scoreEl.textContent=_quizScore;if(totalEl) totalEl.textContent=_quizTotal;
  setTimeout(nextQuestion,1600);
}
function closeQuiz(){
  document.getElementById('quizModal').classList.remove('on');
  if(_quizTotal>0){chat.push({role:'bot',text:'Quiz done! Score: '+_quizScore+'/'+_quizTotal+' ('+Math.round(_quizScore/_quizTotal*100)+'%) '+((_quizScore/_quizTotal)>=0.8?'\u2b50 Outstanding!':'\ud83d\udcaa Keep practicing!'),provider:'Quiz'});render();}
}
function escHtml(t){return t?String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'):''}

/* ── HABITS ── */
var _habits=[];(function(){try{_habits=JSON.parse(localStorage.getItem('bb_habits')||'[]');}catch(e){_habits=[];}renderHabits();})();
function addHabit(){var inp=document.getElementById('habitInput');var name=(inp&&inp.value.trim())||'';if(!name) return;_habits.push({name:name,streak:0,lastDone:null,id:Date.now()});saveHabits();renderHabits();if(inp) inp.value='';}
function saveHabits(){try{localStorage.setItem('bb_habits',JSON.stringify(_habits));}catch(e){}}
function checkHabit(id){var today=new Date().toDateString();var h=_habits.find(function(x){return x.id===id;});if(!h) return;if(h.lastDone===today){h.lastDone=null;h.streak=Math.max(0,h.streak-1);}else{h.streak=(h.lastDone===new Date(Date.now()-86400000).toDateString())?h.streak+1:1;h.lastDone=today;}saveHabits();renderHabits();}
function deleteHabit(id){_habits=_habits.filter(function(x){return x.id!==id;});saveHabits();renderHabits();}
function renderHabits(){var el=document.getElementById('habitList');if(!el) return;var today=new Date().toDateString();el.innerHTML=_habits.length?_habits.map(function(h){var done=h.lastDone===today;return '<div class="habit-item"><div class="habit-check'+(done?' done':'')+'" onclick="checkHabit('+h.id+')">'+(done?'\u2713':'')+'</div><span style="flex:1;font-size:11px">'+escHtml(h.name)+'</span><span class="habit-streak">\ud83d\udd25'+h.streak+'</span><button class="todo-del" onclick="deleteHabit('+h.id+')">\u00d7</button></div>';}).join(''):'<div style="font-size:10px;color:var(--muted)">No habits yet</div>';}

/* ── TODOS ── */
var _todos=[];(function(){try{_todos=JSON.parse(localStorage.getItem('bb_todos')||'[]');}catch(e){_todos=[];}renderTodos();})();
function addTodo(){var inp=document.getElementById('todoInput');var text=(inp&&inp.value.trim())||'';if(!text) return;_todos.push({text:text,done:false,id:Date.now()});saveTodos();renderTodos();if(inp) inp.value='';}
function toggleTodo(id){var t=_todos.find(function(x){return x.id===id;});if(t) t.done=!t.done;saveTodos();renderTodos();}
function deleteTodo(id){_todos=_todos.filter(function(x){return x.id!==id;});saveTodos();renderTodos();}
function saveTodos(){try{localStorage.setItem('bb_todos',JSON.stringify(_todos));}catch(e){}}
function renderTodos(){var el=document.getElementById('todoList');if(!el) return;el.innerHTML=_todos.length?_todos.map(function(t){return '<div class="todo-item"><div class="todo-check'+(t.done?' done':'')+'" onclick="toggleTodo('+t.id+')">'+(t.done?'\u2713':'')+'</div><span style="flex:1;font-size:11px;text-decoration:'+(t.done?'line-through':'none')+'">'+escHtml(t.text)+'</span><button class="todo-del" onclick="deleteTodo('+t.id+')">\u00d7</button></div>';}).join(''):'<div style="font-size:10px;color:var(--muted)">No tasks</div>';}
async function aiPrioritizeTodos(){var active=_todos.filter(function(t){return !t.done;});if(active.length<2){showToast('Need 2+ tasks');return;}showToast('AI prioritizing...');try{var list=active.map(function(t,i){return (i+1)+'. '+t.text;}).join('\n');var res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:100,messages:[{role:'user',content:'Prioritize these tasks, return ONLY comma-separated numbers in priority order:\n'+list}]})});var data=await res.json();var txt=(data.content&&data.content[0]&&data.content[0].text||'').trim();var order=txt.split(',').map(function(x){return parseInt(x.trim())-1;}).filter(function(n){return !isNaN(n);});if(order.length>0){order.forEach(function(origIdx,pri){if(active[origIdx]) active[origIdx].priority=order.length-pri;});saveTodos();renderTodos();showToast('\ud83e\udd16 Prioritized!');}}catch(e){showToast('Failed');}}

/* ── TRANSLATOR ── */
function activateTranslator(){var tp=document.getElementById('translatorPanel');if(tp){tp.style.display=tp.style.display==='none'?'block':'none';}}
function swapLangs(){var f=document.getElementById('transFrom'),t=document.getElementById('transTo');if(!f||!t) return;var tmp=f.value;f.value=t.value;t.value=tmp;}
async function doTranslate(){
  var text=(document.getElementById('transInput')&&document.getElementById('transInput').value||'').trim();
  var toLang=(document.getElementById('transTo')&&document.getElementById('transTo').value)||'English';
  var fromLang=(document.getElementById('transFrom')&&document.getElementById('transFrom').value)||'auto';
  var out=document.getElementById('transOutput');
  if(!text){alert('Enter text!');return;}
  if(out){out.style.display='block';out.textContent='Translating...';}
  try{
    var fromStr=fromLang==='auto'?'':'from '+fromLang+' ';
    var res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:500,messages:[{role:'user',content:'Translate this '+fromStr+'to '+toLang+'. Return ONLY the translation:\n\n'+text}]})});
    var data=await res.json();
    var translation=(data.content&&data.content[0]&&data.content[0].text||'').trim();
    if(out) out.textContent=translation;
  }catch(e){if(out) out.textContent='Translation failed.';}
}

/* ── CHAT SEARCH ── */
var _searchActive=false;
function toggleSearch(){_searchActive=!_searchActive;var el=document.getElementById('chatSearch');if(el) el.classList.toggle('on',_searchActive);if(_searchActive){var inp=document.getElementById('chatSearchInput');if(inp){inp.focus();inp.value='';}}else{searchChat('');}}
function searchChat(q){document.querySelectorAll('#log .bubble').forEach(function(b){b.classList.remove('search-hit');if(q&&q.length>1&&b.textContent.toLowerCase().includes(q.toLowerCase())) b.classList.add('search-hit');});}

/* ── EMOJI REACTIONS ── */
var _emojiList=['\ud83d\udc4d','\u2764\ufe0f','\ud83d\ude02','\ud83d\udd25','\ud83d\udcaf','\ud83e\udd2f','\ud83d\ude2e','\ud83d\udc4f','\u26a1','\ud83c\udfaf'];
function addReaction(idx,emoji){if(!chat[idx]) return;if(!chat[idx].reactions) chat[idx].reactions={};var r=chat[idx].reactions;r[emoji]=(r[emoji]||0)+1;render();}
function showEmojiPicker(msgIdx){
  var old=document.getElementById('emojiPicker');if(old){old.remove();return;}
  var picker=document.createElement('div');picker.id='emojiPicker';
  picker.style.cssText='position:fixed;bottom:140px;right:20px;background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:8px;display:flex;flex-wrap:wrap;gap:4px;z-index:9999;max-width:200px;box-shadow:0 8px 24px rgba(0,0,0,.2)';
  picker.innerHTML=_emojiList.map(function(e){return '<span style="font-size:20px;cursor:pointer;padding:4px;border-radius:6px" onclick="addReaction('+msgIdx+',\''+e+'\');document.getElementById(\'emojiPicker\').remove()">'+e+'</span>';}).join('');
  document.body.appendChild(picker);
  setTimeout(function(){document.addEventListener('click',function rm(e){if(!picker.contains(e.target)){picker.remove();document.removeEventListener('click',rm);}});},100);
}

/* ── CONTEXT MENU ── */
function showMsgMenu(event,idx){
  event.preventDefault();
  var old=document.getElementById('msgCtxMenu');if(old) old.remove();
  var m=document.createElement('div');m.id='msgCtxMenu';
  m.style.cssText='position:fixed;left:'+event.clientX+'px;top:'+event.clientY+'px;background:var(--panel);border:1px solid var(--border);border-radius:10px;padding:6px;z-index:99999;box-shadow:0 8px 24px rgba(0,0,0,.2);min-width:140px';
  m.innerHTML=['<div style="padding:6px 10px;cursor:pointer;font-size:12px;border-radius:6px" onclick="pinMsg('+idx+');this.closest(\'#msgCtxMenu\').remove()">\ud83d\udccc Pin</div>',
    '<div style="padding:6px 10px;cursor:pointer;font-size:12px;border-radius:6px" onclick="navigator.clipboard.writeText(chat['+idx+']&&chat['+idx+'].text||\'\')" >\ud83d\udccb Copy</div>',
    '<div style="padding:6px 10px;cursor:pointer;font-size:12px;border-radius:6px;color:var(--danger)" onclick="chat.splice('+idx+',1);render();this.closest(\'#msgCtxMenu\').remove()">\ud83d\uddd1\ufe0f Delete</div>'].join('');
  document.body.appendChild(m);
  setTimeout(function(){document.addEventListener('click',function rm(e){if(!m.contains(e.target)){m.remove();document.removeEventListener('click',rm);}});},100);
}

/* ── PINNED ── */
var _pinned=[];
function pinMsg(idx){if(!chat[idx]) return;_pinned.push({text:chat[idx].text.slice(0,120),ts:Date.now()});renderPinned();showToast('Pinned \ud83d\udccc');}
function renderPinned(){var panel=document.getElementById('pinnedPanel');var list=document.getElementById('pinnedList');if(!panel||!list) return;if(_pinned.length===0){panel.classList.remove('on');return;}panel.classList.add('on');list.innerHTML=_pinned.map(function(p,i){return '<div style="display:flex;align-items:flex-start;gap:8px;padding:4px 0;border-bottom:1px solid #fde047"><span style="flex:1;color:#92400e;font-size:11px">'+escHtml(p.text)+'</span><button style="background:none;border:none;cursor:pointer;color:#92400e" onclick="_pinned.splice('+i+',1);renderPinned()">\u00d7</button></div>';}).join('');}

/* ── THEME SWITCHER ── */
var _ti=0,_themes=[
  {a:'#0a2d6e',a2:'#1a56db',p:'#ffffff',bg:'#f0f4ff',e:'\ud83c\udfa8',name:'Navy'},
  {a:'#7c3aed',a2:'#9333ea',p:'#fdf4ff',bg:'#f5f0ff',e:'\ud83d\udc9c',name:'Purple'},
  {a:'#065f46',a2:'#059669',p:'#f0fdf4',bg:'#ecfdf5',e:'\ud83c\udf3f',name:'Forest'},
  {a:'#9f1239',a2:'#e11d48',p:'#fff0f3',bg:'#fdf2f8',e:'\ud83c\udf38',name:'Rose'},
  {a:'#0f172a',a2:'#1e293b',p:'#1e293b',bg:'#0f172a',e:'\ud83c\udf19',name:'Dark'},
];
(function(){
  var btn=document.getElementById('blueBtn');
  if(btn) btn.onclick=function(){
    _ti=(_ti+1)%_themes.length;var t=_themes[_ti],r=document.documentElement.style;
    r.setProperty('--accent',t.a);r.setProperty('--accent2',t.a2);r.setProperty('--panel',t.p);r.setProperty('--bg',t.bg);
    if(_ti===4){r.setProperty('--text','#e2e8f0');r.setProperty('--muted','#64748b');r.setProperty('--border','#1e2d47');r.setProperty('--panel2','#1e293b');}
    else{r.setProperty('--text','#0a1628');r.setProperty('--muted','#5a6a8a');r.setProperty('--border','#c8d4ee');r.setProperty('--panel2','#e8edf8');}
    this.textContent=t.e;showToast(t.name+' theme');
  };
})();

/* ── KEYBOARD SHORTCUTS ── */
document.addEventListener('keydown',function(e){
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
  if(e.key==='/'&&!e.altKey){var m=document.getElementById('msg');if(m){m.focus();e.preventDefault();}}
  if(e.altKey){
    if(e.key==='z'){toggleZapMode();showToast('ZAP '+(zapModeOn?'ON':'OFF'));}
    if(e.key==='n'){newChat();}
  }
});

/* ── WEATHER ── */
async function loadWeather(){
  var el=document.getElementById('weatherVal');if(el) el.textContent='Loading...';
  try{
    var pos=await new Promise(function(res,rej){navigator.geolocation.getCurrentPosition(res,rej,{timeout:5000});});
    var url='https://api.open-meteo.com/v1/forecast?latitude='+pos.coords.latitude.toFixed(2)+'&longitude='+pos.coords.longitude.toFixed(2)+'&current_weather=true&timezone=auto';
    var res2=await fetch(url);var data=await res2.json();var w=data.current_weather;
    var codes={0:'\u2600\ufe0f Clear',1:'\ud83c\udf24\ufe0f Mostly Clear',2:'\u26c5 Cloudy',3:'\u2601\ufe0f Overcast',45:'\ud83c\udf2b\ufe0f Foggy',51:'\ud83c\udf26\ufe0f Drizzle',61:'\ud83c\udf27\ufe0f Rain',71:'\u2744\ufe0f Snow',80:'\ud83c\udf26\ufe0f Showers',95:'\u26c8\ufe0f Thunder'};
    if(el) el.textContent=w.temperature+'\u00b0C '+( codes[w.weathercode]||'Code '+w.weathercode);
    showToast('Weather loaded!');
  }catch(e){if(el) el.textContent='Enable location';}
}

/* ── WORD COUNTER ── */
function updateWordCount(){var el=document.getElementById('wordCountInput');var val=document.getElementById('wordCountVal');if(!el||!val) return;var txt=el.value;val.textContent=(txt.trim()?txt.trim().split(/\s+/).length:0)+' words \u00b7 '+txt.length+' chars';}

/* ── ZAP CSS ── */
if(!document.querySelector('#zapCss')){
  var s=document.createElement('style');s.id='zapCss';
  s.textContent=':root.zap-mode{--bg:#0a1628;--panel:#0f2040;--panel2:#162a50;--border:#1e3a6e;--accent:#f59e0b;--accent2:#fbbf24;--text:#ffffff;--muted:#94a3b8}body.zap-mode{background:var(--bg)}';
  document.head.appendChild(s);
}

/* ── EVENT DELEGATION for log ── */
(function(){
  var log=document.getElementById('log');
  if(!log) return;
  log.addEventListener('contextmenu',function(e){
    var bubble=e.target.closest('[data-i]');
    if(bubble&&bubble.classList.contains('bubble')){e.preventDefault();showMsgMenu(e,parseInt(bubble.dataset.i));}
  });
  log.addEventListener('click',function(e){
    var t=e.target;
    if(t.dataset.i!==undefined&&t.dataset.r!==undefined) addReaction(parseInt(t.dataset.i),t.dataset.r);
    if(t.dataset.i!==undefined&&t.dataset.ep) showEmojiPicker(parseInt(t.dataset.i));
  });
})();


function runCodePreview(){
  var html='';
  for(var i=chat.length-1;i>=0;i--){
    var m=chat[i];if(!m||!m.text) continue;
    var full=m.text.match(/<!DOCTYPE[\s\S]*?<\/html>/i)||m.text.match(/<html[\s\S]*?<\/html>/i);
    if(full){html=full[0];break;}
    var block=m.text.match(/```(?:html)?\n?([\s\S]*?)```/);
    if(block){html=block[1];break;}
  }
  if(!html){showToast('No HTML code in chat yet. Ask me to build something!');return;}
  var panel=document.getElementById('codePreviewPanel');
  var frame=document.getElementById('codePreviewFrame');
  if(panel&&frame){panel.style.display='flex';frame.srcdoc=html;}
}

function writeInsert(prefix){var m=document.getElementById('msg');if(m){m.value=prefix+(m.value||'');m.focus();}}

// Extend setMode for write/math

// Extend setMode for write/math/picdot panels
var _origSetModeWM = typeof setMode === 'function' ? setMode : function(){};
setMode = function(m){
  if(typeof _origSetModeWM === 'function') _origSetModeWM(m);
  // Writing toolbar
  var wp = document.getElementById('writingPanel');
  if(wp) wp.classList.toggle('on', m === 'write');
  // PicDot panel
  var pdp = document.getElementById('picdotModePanel');
  if(pdp) pdp.style.display = (m === 'picdot') ? 'block' : 'none';
  // Media panel — hide when picdot active
  var mp = document.getElementById('mediaPanel');
  if(mp) mp.style.display = (m === 'picdot') ? 'none' : (m === 'media' ? 'block' : 'none');
  // Active states for extra mode buttons
  ['write','math','picdot'].forEach(function(id){
    var el = document.getElementById('mode' + id.charAt(0).toUpperCase() + id.slice(1));
    if(el) el.classList.toggle('active', id === m);
  });
};

/* ── TOOL DRAWER TOGGLE ── */
var _openDrawer=null;
function toggleDrawer(id){
  var el=document.getElementById(id);
  if(!el) return;
  if(_openDrawer&&_openDrawer!==id){
    var prev=document.getElementById(_openDrawer);
    if(prev) prev.classList.remove('on');
  }
  var opening=!el.classList.contains('on');
  el.classList.toggle('on');
  _openDrawer=opening?id:null;
  // Auto-load weather when opened
  if(opening&&id==='drawerWeather') loadWeather();
}

/* ── INLINE CALC ── */
function doCalc(){
  var inp=document.getElementById('calcInput');
  var el=document.getElementById('calcResult');
  if(!inp||!el) return;
  var expr=inp.value.trim().replace(/\^/g,'**');
  if(!expr){el.textContent='—';return;}
  try{
    if(!/^[\d\s\+\-\*\/\(\)\.%\^e]+$/i.test(expr)){el.textContent='Only numbers and operators';return;}
    var res=new Function('return ('+expr+')')();
    el.textContent=inp.value.trim()+' = '+res;
  }catch(e){el.textContent='Invalid expression';}
}
document.addEventListener('DOMContentLoaded',function(){
  var ci=document.getElementById('calcInput');
  if(ci) ci.addEventListener('keydown',function(e){if(e.key==='Enter') doCalc();});
});

/* ── UPDATE setMediaTab to handle picdot as first tab ── */
var _origSetMT=typeof setMediaTab==='function'?setMediaTab:function(){};
setMediaTab=function(tab,btn){
  var picdot=document.getElementById('picdotPanel');
  var drop=document.getElementById('mediaDrop');
  var preview=document.getElementById('mediaPreview');
  document.querySelectorAll('.media-tab').forEach(function(b){b.classList.remove('active');});
  if(btn) btn.classList.add('active');
  if(tab==='picdot'){
    if(picdot) picdot.style.display='block';
    if(drop) drop.style.display='none';
    if(preview) preview.style.display='none';
  } else {
    if(picdot) picdot.style.display='none';
    if(drop) drop.style.display='block';
    if(preview) preview.style.display='flex';
    if(typeof mediaAnalysisMode!=='undefined') window.mediaAnalysisMode=tab;
  }
};

/* ── OVERRIDE loadWeather to also update chip val ── */
var _origLoadWeather=typeof loadWeather==='function'?loadWeather:null;
loadWeather=async function(){
  var chipVal=document.getElementById('weatherVal');
  var resultEl=document.getElementById('weatherResult');
  if(chipVal) chipVal.textContent='…';
  if(resultEl) resultEl.textContent='Loading…';
  try{
    var pos=await new Promise(function(res,rej){navigator.geolocation.getCurrentPosition(res,rej,{timeout:6000});});
    var url='https://api.open-meteo.com/v1/forecast?latitude='+pos.coords.latitude.toFixed(2)+'&longitude='+pos.coords.longitude.toFixed(2)+'&current_weather=true&timezone=auto';
    var r=await fetch(url); var data=await r.json(); var w=data.current_weather;
    var codes={0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',51:'🌦️',61:'🌧️',71:'❄️',80:'🌦️',95:'⛈️'};
    var icon=codes[w.weathercode]||'🌡️';
    var txt=icon+' '+w.temperature+'°C';
    if(chipVal) chipVal.textContent=txt;
    if(resultEl) resultEl.textContent=txt+(w.windspeed?' · 💨 '+w.windspeed+' km/h':'');
    showToast(txt);
  }catch(e){
    if(chipVal) chipVal.textContent='';
    if(resultEl) resultEl.textContent='Enable location access';
  }
};

/* ── OVERRIDE convertCurrency to update chip + full result ── */
var _origCC=convertCurrency;
convertCurrency=async function(){
  var amt=parseFloat((document.getElementById('currAmt')&&document.getElementById('currAmt').value)||1);
  var from=(document.getElementById('currFrom')&&document.getElementById('currFrom').value)||'USD';
  var to=(document.getElementById('currTo')&&document.getElementById('currTo').value)||'USD';
  var chipVal=document.getElementById('currResult');
  var fullEl=document.getElementById('currResultFull');
  if(chipVal) chipVal.textContent='…';
  if(fullEl) fullEl.textContent='Loading…';
  try{
    var res=await fetch('https://open.er-api.com/v6/latest/'+from);
    var data=await res.json();
    var rate=data.rates&&data.rates[to];
    if(!rate) throw new Error('No rate');
    var result=(amt*rate).toFixed(4);
    var txt=result+' '+to;
    if(chipVal) chipVal.textContent=txt;
    if(fullEl) fullEl.textContent=amt+' '+from+' = '+txt;
    showToast(amt+' '+from+' = '+txt);
  }catch(e){
    if(chipVal) chipVal.textContent='';
    if(fullEl) fullEl.textContent='Could not load rates';
  }
};

/* ── OVERRIDE setMood to update chip ── */
var _origSetMood=setMood;
setMood=function(emoji,label){
  var chipVal=document.getElementById('moodVal');
  if(chipVal) chipVal.textContent=emoji;
  if(typeof _origSetMood==='function') _origSetMood(emoji,label);
  // close drawer
  var d=document.getElementById('drawerMood');
  if(d){d.classList.remove('on');_openDrawer=null;}
};

/* ── PicDot subtab switch ── */
var _origPdSetMode=typeof pdSetMode==='function'?pdSetMode:null;
pdSetMode=function(mode,btn){
  var ids=['pdImage','pdEdit','pdGallery','pdVideo'];
  var btnIds=['pdTabImg','pdTabEdit','pdTabGallery','pdTabVideo'];
  ids.forEach(function(id){var el=document.getElementById(id);if(el)el.style.display='none';});
  document.querySelectorAll('.pd-subtab').forEach(function(b){b.classList.remove('active');});
  var show=document.getElementById('pd'+mode.charAt(0).toUpperCase()+mode.slice(1));
  if(show) show.style.display='block';
  if(btn) btn.classList.add('active');
};


/* ════════════════════════════════════════
   PERSONA SYSTEM — Better 2.0 · Zap Pro · TalkLock®
════════════════════════════════════════ */
var aiPersona = 'zap';
var aiIntensityVal = 70;

var PERSONA_PROMPTS = {
  satbot: 'You are SatBot, a helpful and accurate assistant. Be clear about uncertainty and explain code carefully.',
  better: 'You are BetterAI — a calm, brilliant AI assistant. You are confident, clear, and thoughtful. You give accurate, well-structured answers without being robotic. Warm but not over-excited. Like a brilliant friend who happens to know everything. No filler phrases. Just great answers.',
  zap:    'You are Zap MAX \u26a1 — an extremely fun, hyped, energetic AI. You bring massive energy to every reply. Use phrases like ZAP!, BOOM!, SHEEEESH, LET\'S GO!, no cap, built different, GOATED, fr fr. You\'re wildly smart AND wildly fun. Code questions get perfect code WITH hype. Never boring, never robotic. Pure electric energy.',
  talklock: 'You are TalkLock\u00ae — an AI that LOVES to talk. You are conversational, warm, chatty, and engaging. You give rich detailed answers, add anecdotes, make connections, ask follow-up questions, share thoughts freely. Like having a long conversation with a brilliant friend over coffee. Never brief unless asked. Always engaging.'
};

var PERSONA_WELCOME = {
  satbot: "I’m SatBot. Sign in to use the connected SatBot service.",
  better:   "Hey! I'm Better 2.0 \ud83e\udd16\n\nAsk me anything \u2014 I'm calm, smart, and I'll give you a great answer. Questions, code, homework, advice \u2014 whatever you need.\n\nWhat's on your mind?",
  zap:      "Hey! I'm Zap MAX \u26a1\n\nAsk me ANYTHING \u2014 no API key needed. I answer questions, write code, explain things, tell jokes, help with homework \u2014 just talk naturally.\n\nWhat do you want to know?!",
  talklock: "Hey! I'm TalkLock\u00ae \ud83d\udde3\ufe0f\n\nI love to talk. Ask me anything and I'll give you a real, rich, full answer \u2014 not just a quick line. I'm here for a proper conversation.\n\nSo, what shall we talk about?"
};

function setPersona(p, announce = true) {
  if (!Object.hasOwn(PERSONA_PROMPTS,p)) return;
  aiPersona = p;
  // update button states
  ['better','zap','talklock','satbot'].forEach(function(id) {
    var map = {better:'pBetter', zap:'pZap', talklock:'pTalk', satbot:'pSatbot'};
    var el = document.getElementById(map[id]);
    if(el) el.classList.toggle('active', id === p);
  });
  // ZAP mode toggle for Zap Pro
  if(p === 'zap' && !zapModeOn) {
    zapModeOn = true;
    var zapBtn = document.getElementById('zapBtn');
    if(zapBtn) { zapBtn.classList.add('active'); zapBtn.textContent = 'ZAP ON'; }
    document.body.classList.add('zap-mode');
    document.documentElement.classList.add('zap-mode');
  } else if(p !== 'zap' && zapModeOn) {
    zapModeOn = false;
    var zapBtn = document.getElementById('zapBtn');
    if(zapBtn) { zapBtn.classList.remove('active'); zapBtn.textContent = '\u26a1 ZAP MAX'; }
    document.body.classList.remove('zap-mode');
    document.documentElement.classList.remove('zap-mode');
  }
  // Show welcome in chat
  if(announce) chat.push({ role:'bot', text: PERSONA_WELCOME[p], provider: p==='satbot'?'SatBot':p==='better'?'BetterAI':p==='zap'?'Zap MAX':'TalkLock' });
  render();
  // Update placeholder
  var msgs = {
    satbot: 'Ask SatBot…',
    better:   'Ask me anything\u2026',
    zap:      'Ask ZAP anything \u2014 I answer everything! \u26a1',
    talklock: 'Start a conversation\u2026 I love to talk!'
  };
  var msgEl = document.getElementById('msg');
  if(msgEl) msgEl.placeholder = msgs[p];
  if(announce) showToast({better:'BetterAI',zap:'Zap MAX',talklock:'TalkLock',satbot:'SatBot'}[p]);
}

function updateAIIntensity(v) {
  aiIntensityVal = parseInt(v);
  var el = document.getElementById('aiIntensityLabel');
  if(el) el.textContent = v + '%';
}

/* Patch buildSystem to inject persona + intensity */
var _origBuildSystemPersona = buildSystem;
buildSystem = function() {
  var base = _origBuildSystemPersona();
  var personaSys = PERSONA_PROMPTS[aiPersona] || PERSONA_PROMPTS.better;
  // Intensity affects response length/depth
  var intensityHint = '';
  if(aiIntensityVal <= 20)  intensityHint = '\n\nResponse style: Very brief. 1-2 sentences max. Minimal.';
  else if(aiIntensityVal <= 40) intensityHint = '\n\nResponse style: Short and direct. 2-4 sentences.';
  else if(aiIntensityVal <= 60) intensityHint = '\n\nResponse style: Balanced. Clear and complete without being verbose.';
  else if(aiIntensityVal <= 80) intensityHint = '\n\nResponse style: Rich and detailed. Give full answers with examples.';
  else intensityHint = '\n\nResponse style: Maximum detail. Comprehensive, deep, thorough answers. Go all in.';
  return personaSys + '\n\n' + base + intensityHint;
};



/* ── OFFLINE-BUILD: Gemini (free key, stored only on this device) ── */
function getGeminiKey(){ return (localStorage.getItem('bb_gemini_key')||'').trim(); }
function setGeminiKey(){
  var k=prompt('Paste your Gemini API key (stored only on this device):', getGeminiKey());
  if(k===null) return;
  localStorage.setItem('bb_gemini_key', k.trim());
  if(typeof showToast==='function') showToast('Gemini key saved on this device');
}
async function callGemini(p){
  var key=getGeminiKey(); if(!key) throw new Error('skip');
  var model='gemini-2.0-flash';
  var contents=(p.history||[]).concat([{role:'user',content:p.userText}]).map(function(m){
    return {role: m.role==='assistant'?'model':'user', parts:[{text:String(m.content)}]};
  });
  var res=await fetch('https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent?key='+encodeURIComponent(key),{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({systemInstruction:{parts:[{text:p.system||''}]},contents:contents})
  });
  if(!res.ok){ var e=await res.text().catch(()=>'HTTP '+res.status); throw new Error('Gemini: '+e); }
  var data=await res.json();
  var text=(data.candidates&&data.candidates[0]&&data.candidates[0].content&&data.candidates[0].content.parts&&data.candidates[0].content.parts[0].text)||'(no reply)';
  return {text:text.trim(), provider:'Gemini'};
}
/* Route the main chat through Gemini first, then fall back to the original Claude path */
(function(){
  var original=callClaude;
  callClaude=async function(p){
    try{ return await callGemini(p); }
    catch(e){ if(String(e).includes('skip')) return await original(p); throw e; }
  };
})();

/* ── SATBOT: connects the app to your Firebase backend ── */
const SATBOT_CONFIG = {
  // Paste from Firebase console → Project settings → Your apps (web app config).
  // These values are public identifiers, not secret keys.
  firebase: {
    apiKey: "AIzaSyAqbIzJmnn2xDonaj8Y9Ht66t30lO50nxM",
    authDomain: "betterai-3ca66.firebaseapp.com",
    projectId: "betterai-3ca66",
    appId: "1:201700695165:web:21fe4d848f5dbef6f2a514",
    storageBucket: "betterai-3ca66.firebasestorage.app",
    messagingSenderId: "201700695165"
  },
  // Paste the base URL of your deployed functions, e.g. https://us-central1-PROJECT.cloudfunctions.net
  functionsBase: "https://satbot.drarcode22.workers.dev"
};
let satbotUser = null;
let fbAuth = null, fbAuthMod = null, fbStoreMod = null, fbDb = null;
async function satbotToken(){
  if(!satbotUser) return null;
  return await satbotUser.getIdToken();
}
async function satbotInit(){
  if(SATBOT_CONFIG.functionsBase.startsWith('PASTE')) return; // not configured yet
  try{
    const app = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    fbAuthMod = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
    fbStoreMod = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');
    const fb = app.initializeApp(SATBOT_CONFIG.firebase);
    fbDb = fbStoreMod.getFirestore(fb);
    fbAuth = fbAuthMod.getAuth(fb);
    fbAuthMod.onAuthStateChanged(fbAuth, u => { satbotUser = u; updateAuthUI(); });
    if(fbAuthMod.isSignInWithEmailLink(fbAuth, location.href)){
      let email = localStorage.getItem('bb_email_link_email') || prompt('Confirm your email to finish sign-in:');
      if(email){
        try{
          await fbAuthMod.signInWithEmailLink(fbAuth, email.trim(), location.href);
          localStorage.removeItem('bb_email_link_email');
          history.replaceState(null, '', location.pathname);
        }catch(e){ alert('Sign-in link failed: ' + e.message); }
      }
    }
  }catch(e){ console.warn('SatBot init failed', e); }
}
function updateAuthUI(){
  const b = document.getElementById('bbAuthBtn');
  if(b) b.textContent = satbotUser ? ('Sign out ('+(satbotUser.email||'account')+')') : 'Sign in';
}
async function bbSignIn(){
  if(!fbAuthMod) return alert('Sign-in is not set up yet.');
  if(satbotUser){ await fbAuthMod.signOut(fbAuth); return; }
  const mode = prompt('Type: "google" for Google, "email" for email/password, or "link" for an email sign-in link');
  if(mode === null) return;
  try{
    if(mode.trim().toLowerCase() === 'link'){
      const email = prompt('Email to send the sign-in link to:'); if(!email) return;
      await fbAuthMod.sendSignInLinkToEmail(fbAuth, email.trim(), {
        url: location.origin + location.pathname,
        handleCodeInApp: true
      });
      localStorage.setItem('bb_email_link_email', email.trim());
      alert('Link sent to ' + email.trim() + '. Open it on this same browser.');
      return;
    }
    if(mode.trim().toLowerCase() === 'google'){
      await fbAuthMod.signInWithPopup(fbAuth, new fbAuthMod.GoogleAuthProvider());
    } else {
      const email = prompt('Email:'); if(!email) return;
      const pass = prompt('Password (6+ characters):'); if(!pass) return;
      try{ await fbAuthMod.signInWithEmailAndPassword(fbAuth, email, pass); }
      catch(e){ await fbAuthMod.createUserWithEmailAndPassword(fbAuth, email, pass); }
    }
  }catch(e){ alert('Sign-in failed: ' + e.message); }
}
async function callSatBot(p){
  const token = await satbotToken();
  if(!token) throw new Error('skip');
  const r = await fetch(SATBOT_CONFIG.functionsBase + '/chat',{
    method:'POST',
    signal:AbortSignal.timeout(45000),
    headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
    body:JSON.stringify({system:p.system||'',history:p.history||[],userText:p.userText})
  });
  const data = await r.json().catch(()=>({}));
  if(!r.ok) throw new Error('SatBot: '+(data.error||r.status));
  return {text:data.text, provider: data.cached ? 'SatBot (cached)' : 'SatBot'};
}
async function saveNoteToCloud(id, text){
  if(!satbotUser || !fbDb) throw new Error('Sign in first');
  const ref = fbStoreMod.doc(fbDb, 'users', satbotUser.uid, 'notes', String(id));
  await fbStoreMod.setDoc(ref, { text: String(text).slice(0,10000), updated: fbStoreMod.serverTimestamp() });
  return { ok: true, id: String(id) };
}
/* Priority: SatBot backend → your own Gemini key on device → original path */
(function(){
  var prev=callClaude;
  callClaude=async function(p){
    try{ return await callSatBot(p); }
    catch(e){ if(!String(e).includes('skip')) console.warn(e); }
    return await prev(p);
  };
})();
satbotInit();

/* ── FASTZAP: one-line quick answers ── */
async function fastZapAsk(){
  const q = prompt('FastZap: ask a quick question');
  if(!q || !q.trim()) return;
  const out = document.getElementById('bbFastOut');
  out.style.display='block'; out.textContent='⚡ thinking…';
  try{
    const token = await satbotToken();
    if(token && !SATBOT_CONFIG.functionsBase.startsWith('PASTE')){
      const r = await fetch(SATBOT_CONFIG.functionsBase+'/chat',{method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body:JSON.stringify({system:'Answer in one or two short sentences. No lists, no preamble.',history:[],userText:q.trim(),fast:true})});
      const d = await r.json().catch(()=>({}));
      out.textContent = r.ok ? d.text : ('FastZap: '+(d.error||r.status));
    } else {
      const key = getGeminiKey();
      if(!key){ out.textContent='FastZap needs sign-in or a Gemini key (🔑 button).'; return; }
      const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key='+encodeURIComponent(key),{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({systemInstruction:{parts:[{text:'Answer in one or two short sentences. No lists, no preamble.'}]},contents:[{role:'user',parts:[{text:q.trim()}]}]})});
      const d = await r.json();
      out.textContent = d.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'No answer.';
    }
  }catch(e){ out.textContent='FastZap error: '+e.message; }
  clearTimeout(window._bbFastT); window._bbFastT=setTimeout(()=>{out.style.display='none'},15000);
}

/* ── OFFLINE-BUILD: one gate for every cloud call ── */
(function(){
  const _origFetch = window.fetch.bind(window);
  const fakeAnthropic = (text, status) => new Response(
    JSON.stringify({content:[{type:'text',text}], usage:{input_tokens:0,output_tokens:0}}),
    {status: status||200, headers:{'Content-Type':'application/json'}});
  const textOf = c => typeof c === 'string' ? c : (c||[]).map(x => x.text||'').join(' ');
  window.fetch = async function(input, init){
    init = init || {};
    const url = typeof input === 'string' ? input : (input.url || '');
    // Direct Anthropic calls: send through SatBot when signed in and online
    if(url.startsWith('https://api.anthropic.com/v1/messages')){
      let body={}; try{ body = JSON.parse(init.body||'{}'); }catch(e){}
      const msgs = body.messages || [];
      const last = msgs[msgs.length-1] || {content:''};
      const history = msgs.slice(0,-1).map(m => ({role:m.role, content:textOf(m.content)}));
      if(!navigator.onLine) return fakeAnthropic('You are offline. This AI feature needs internet. The on-device chat still works.');
      if(!satbotUser || SATBOT_CONFIG.functionsBase.startsWith('PASTE'))
        return fakeAnthropic('Sign in with the Sign in button to use SatBot for this feature.');
      try{ const r = await callSatBot({system: body.system||'', history, userText: textOf(last.content)}); return fakeAnthropic(r.text); }
      catch(e){ return fakeAnthropic('SatBot error: ' + e.message); }
    }
    // Other paid AI providers: disabled in the offline build
    if(/api\.(openai|deepseek)\.com|api-inference\.huggingface\.co/.test(url)){
      return new Response(JSON.stringify({error:'This provider is disabled in the offline build. Use SatBot or on-device chat.'}),{status:503,headers:{'Content-Type':'application/json'}});
    }
    // Live data: works online, clear message offline
    if(/api\.open-meteo\.com|open\.er-api\.com/.test(url) && !navigator.onLine){
      return new Response('You are offline. Weather and currency need internet.',{status:503});
    }
    return _origFetch(input, init);
  };
})();

/* Shared answer-cache writes disabled: private prompts must not become public knowledge. */

function bbGames(){
  const pick = prompt('Backup games (work offline):\n1 = Dino Dash\n2 = Wave Surfer 3D');
  if(pick === '1') location.href = 'games/dino.html';
  else if(pick === '2') location.href = 'games/surf.html';
}
/* ═══ PATCH: Games menu, AI game maker, readable text, working intensity slider ═══ */
(function(){
  var css=[
    'body{color:#0a0f1e}',
    '.small{font-size:12px;color:#3a4660}',
    '.bubble{font-size:15px;line-height:1.6;color:#0a0f1e}',
    '.bubble.bot{background:#ffffff;border:1px solid #c8d4ee}',
    '.bubble.user{background:#dbe7ff;color:#0a0f1e}',
    '.bot.claude-reply{background:#fff7ed;border-left:3px solid #c2410c;color:#0a0f1e}',
    '.btn.ghost{color:#1e293b;border-color:#94a3b8;background:#ffffff}',
    '.btn{color:#ffffff}',
    '.input,select,textarea{color:#0a0f1e;background:#ffffff;font-size:14px}',
    '.tool-chip{color:#0a0f1e;font-size:13px}',
    '.tool-chip .tc-val{color:#1a56db}',
    '.mode-label{font-size:11px;color:#1e293b}',
    '.auth-tab{color:#1e293b}.auth-tab.active{color:#0a0f1e;font-weight:700}',
    '.auth-input{color:#0a0f1e;background:#fff}',
    '#bbTip{color:#1e3a8a;font-size:12px}',
    '.plan-card .plan-name,.plan-card .plan-price{color:#ffffff}',
    '.plan-card .plan-price span{color:#c7d2ea}',
    '.plan-card .plan-feature{color:#c7d2ea}',
    '.plan-card .plan-feature.on{color:#f1f5ff}',
    '.bb-games-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-top:10px}',
    '.bb-game-card{padding:12px;border-radius:14px;border:1px solid #c8d4ee;background:#fff;cursor:pointer;text-align:left;color:#0a0f1e;font-weight:700;font-size:14px}',
    '.bb-game-card small{display:block;font-weight:400;color:#3a4660;font-size:12px;margin-top:4px}',
    '.modal-overlay.open{opacity:1;pointer-events:all}',
    '#aiIntensity{height:26px;cursor:pointer}'
  ].join('\n');

  var GAMES=[
    {title:'Dino Dash',sub:'2D runner: jump and duck',url:'games/dino.html'},
    {title:'Dino Dash 3D',sub:'3D runner (needs games/vendor)',url:'games/dino3d.html'},
    {title:'Wave Surfer 3D',sub:'Surf and collect rings',url:'games/surf.html'}
  ];
  var ov,frame,playTitle,statusEl,ideaEl;

  function buildModal(){
    ov=document.createElement('div');
    ov.id='bbGamesOv';ov.className='modal-overlay';
    ov.innerHTML=
      '<div class="modal-box" style="width:min(580px,96vw)">'+
        '<button class="modal-close" id="bbGamesClose">✕</button>'+
        '<h2 style="font-size:20px;margin-bottom:4px">🎮 Games</h2>'+
        '<div id="bbGameList">'+
          '<p class="small">Play offline, or ask AI to make a new game.</p>'+
          '<div class="bb-games-grid" id="bbGameGrid"></div>'+
        '</div>'+
        '<div id="bbGameMaker" style="margin-top:14px">'+
          '<h3 style="font-size:15px">✨ Make a new game with AI</h3>'+
          '<textarea id="bbGameIdea" class="input" style="width:100%;height:64px;margin-top:6px" placeholder="e.g. a space shooter where you dodge asteroids"></textarea>'+
          '<div class="row" style="margin-top:8px"><button class="btn ok" id="bbGameMake">Create game</button><span class="small" id="bbGameStatus"></span></div>'+
        '</div>'+
        '<div id="bbGamePlay" style="display:none">'+
          '<div class="row" style="justify-content:space-between;margin-bottom:8px"><b id="bbGamePlayTitle" style="font-size:15px"></b><button class="btn ghost" id="bbGameBack">← Back</button></div>'+
          '<iframe id="bbGameFrame" style="width:100%;height:58vh;border:1px solid #c8d4ee;border-radius:12px;background:#fff"></iframe>'+
        '</div>'+
      '</div>';
    document.body.appendChild(ov);
    var grid=document.getElementById('bbGameGrid');
    GAMES.forEach(function(g){
      var b=document.createElement('button');
      b.className='bb-game-card';
      b.innerHTML=g.title+'<small>'+g.sub+'</small>';
      b.onclick=function(){playUrl(g.url,g.title);};
      grid.appendChild(b);
    });
    document.getElementById('bbGamesClose').onclick=closeGames;
    ov.addEventListener('click',function(e){if(e.target===ov)closeGames();});
    document.getElementById('bbGameBack').onclick=showList;
    document.getElementById('bbGameMake').onclick=makeGame;
    frame=document.getElementById('bbGameFrame');
    playTitle=document.getElementById('bbGamePlayTitle');
    statusEl=document.getElementById('bbGameStatus');
    ideaEl=document.getElementById('bbGameIdea');
  }
  function openGames(){ if(!ov) buildModal(); showList(); ov.classList.add('open'); }
  function closeGames(){ ov.classList.remove('open'); frame.src='about:blank'; frame.removeAttribute('srcdoc'); }
  function showList(){
    document.getElementById('bbGameList').style.display='';
    document.getElementById('bbGameMaker').style.display='';
    document.getElementById('bbGamePlay').style.display='none';
    frame.src='about:blank'; frame.removeAttribute('srcdoc');
  }
  function showPlay(title){
    document.getElementById('bbGameList').style.display='none';
    document.getElementById('bbGameMaker').style.display='none';
    document.getElementById('bbGamePlay').style.display='';
    playTitle.textContent=title;
  }
  function playUrl(url,title){
    showPlay(title);
    frame.removeAttribute('sandbox');frame.removeAttribute('srcdoc');
    frame.src=url;
  }
  function playHtml(html,title){
    showPlay(title);
    frame.setAttribute('sandbox','allow-scripts');
    frame.srcdoc=html;
  }
  async function makeGame(){
    var idea=(ideaEl.value||'').trim();
    if(!idea){statusEl.textContent='Describe the game first.';return;}
    statusEl.textContent='Creating… this can take 20–40 seconds';
    var sys='You create ONE complete single-file HTML browser game. Reply with ONLY the HTML document, starting with <!doctype html> and ending with </html>. No markdown, no code fences, no explanation. Put all CSS and JavaScript inline. Use no external libraries and no network requests. Do not use localStorage or any browser storage; keep the best score in memory. The game must work with mouse, touch and keyboard, show a live score, have a clear start screen and a restart screen, and use bright, readable colors and large text.';
    try{
      var res=await callClaude({system:sys,history:[],userText:'Make this game: '+idea});
      var txt=(res&&res.text)||'';
      var m=txt.match(/<!doctype html[\s\S]*<\/html>/i)||txt.match(/<html[\s\S]*<\/html>/i);
      if(!m){statusEl.textContent='No game came back. Sign in, or add a 🔑 Gemini key, then try again.';return;}
      statusEl.textContent='Ready!';
      playHtml(m[0],'AI game: '+idea.slice(0,40));
    }catch(e){statusEl.textContent='Error: '+(e.message||e);}
  }
  function setupSlider(){
    window.updateAIIntensity=function(v){
      aiIntensityVal=parseInt(v,10)||70;
      try{localStorage.setItem('bb_intensity',String(aiIntensityVal));}catch(e){}
      var lb=document.getElementById('aiIntensityLabel');
      if(lb) lb.textContent=aiIntensityVal+'%';
    };
    var sl=document.getElementById('aiIntensity');
    if(sl){
      var saved=null;try{saved=localStorage.getItem('bb_intensity');}catch(e){}
      if(saved!==null) sl.value=saved;
      window.updateAIIntensity(sl.value);
    }
  }
  function addButton(){
    var sb=document.getElementById('saveKeysBtn');
    if(sb&&sb.parentElement&&!document.getElementById('bbGamesBtn')){
      var b=document.createElement('button');
      b.id='bbGamesBtn';b.className='btn secondary';b.textContent='🎮 Games';
      b.style.padding='5px 10px';b.style.fontSize='11px';
      b.onclick=openGames;
      sb.parentElement.insertBefore(b,sb);
    }
    document.querySelectorAll('button[onclick="bbGames()"]').forEach(function(x){x.remove();});
  }
  window.bbGames=openGames;
  document.addEventListener('DOMContentLoaded',function(){
    var st=document.createElement('style');st.id='bb-patch-css';st.textContent=css;document.head.appendChild(st);
    addButton();
    setupSlider();
  });
})();

/* ═══ PATCH 2: Light / Colorful / Dark themes + SatBot black & violet look ═══ */
(function(){
  var css=[
    'body.theme-colorful{background:linear-gradient(135deg,#fde2f3 0%,#e0f2fe 45%,#fef9c3 100%)!important;color:#1e1b4b!important}',
    'body.theme-colorful .panel{background:rgba(255,255,255,.85)!important;border-color:#f0abfc!important}',
    'body.theme-colorful .bubble.bot{background:#ffffff!important;border-color:#a5b4fc!important;color:#1e1b4b!important}',
    'body.theme-colorful .bubble.user{background:#fbcfe8!important;color:#1e1b4b!important}',
    'body.theme-dark{background:#0b1020!important;color:#e5e7eb!important}',
    'body.theme-dark .panel,body.theme-dark .modal-box,body.theme-dark #bbCard{background:#131a2e!important;border-color:#2a3758!important;color:#e5e7eb!important}',
    'body.theme-dark .bubble.bot{background:#1a2440!important;color:#f1f5f9!important}',
    'body.theme-dark .bubble.user{background:#1e3a8a!important;color:#ffffff!important}',
    'body.theme-dark .input,body.theme-dark select,body.theme-dark textarea{background:#0f1729!important;color:#f1f5f9!important;border-color:#2a3758!important}',
    'body.satbot{background:#07030f!important;color:#ffffff!important}',
    'body.satbot *{color:#ffffff!important}',
    'body.satbot .panel,body.satbot .modal-box,body.satbot #bbCard,body.satbot .tool-chip,body.satbot .mode-bar,body.satbot .auth-input,body.satbot .input,body.satbot select,body.satbot textarea{background:#140a26!important;border-color:#6d28d9!important}',
    'body.satbot .bubble.bot{background:#1d0f38!important;border-left:3px solid #a855f7!important}',
    'body.satbot .bubble.user{background:#6d28d9!important}',
    'body.satbot .btn{background:#7c3aed!important;border-color:#a855f7!important}',
    'body.satbot .btn.ghost{background:transparent!important;border-color:#a855f7!important}',
    'body.satbot .btn.ok{background:#9333ea!important}',
    'body.satbot .bb-game-card,body.satbot .plan-card{background:#140a26!important;border-color:#6d28d9!important}',
    'body.satbot .persona-btn.active{background:#7c3aed!important}',
    'body.satbot .mode-btn.active{background:#2e1065!important}',
    'body.satbot .bb-fast{background:linear-gradient(135deg,#7c3aed,#a855f7)!important}',
    'body.satbot .bb-fast-out{background:#140a26!important}',
    'body.satbot #bbGate{background:#07030f!important}'
  ].join('\n');

  var THEMES=['light','colorful','dark','satbot'];
  var NAMES={light:'☀️ Light',colorful:'🌈 Colorful',dark:'🌙 Dark',satbot:'🟣 SatBot'};
  var cur='light';

  function applyTheme(t){
    cur=t;
    document.body.classList.remove('theme-colorful','theme-dark','satbot');
    if(t==='colorful') document.body.classList.add('theme-colorful');
    if(t==='dark') document.body.classList.add('theme-dark');
    if(t==='satbot') document.body.classList.add('satbot');
    var r=document.documentElement.style;
    ['--accent','--accent2','--panel','--bg','--text','--muted','--border','--panel2'].forEach(function(v){r.removeProperty(v);});
    try{localStorage.setItem('bb_theme',t);}catch(e){}
    var b=document.getElementById('blueBtn');
    if(b) b.textContent=NAMES[t].split(' ')[0];
    b&&(b.title='Theme: '+NAMES[t]);
    if(typeof showToast==='function') showToast(NAMES[t]);
  }

  window.bbSetTheme=function(t){if(THEMES.includes(t)) applyTheme(t);};

  document.addEventListener('DOMContentLoaded',function(){
    var st=document.createElement('style');st.id='bb-theme-css';st.textContent=css;document.head.appendChild(st);
    var b=document.getElementById('blueBtn');
    if(b){
      b.onclick=function(){
        var i=THEMES.indexOf(cur);
        applyTheme(THEMES[(i+1)%THEMES.length]);
      };
    }
    var saved='light';
    try{saved=localStorage.getItem('bb_theme')||'light';}catch(e){}
    applyTheme(saved);
  });
})();

/* ═══ PATCH 3: Real sign-in (Google + email/password) through Firebase ═══ */
(function(){
  var origAfter=window.afterSignIn;
  var entered=false;
  var busy=false;

  function friendly(e){
    var c=(e&&e.code)||'';
    var map={
      'auth/invalid-credential':'Wrong email or password.',
      'auth/wrong-password':'Wrong password.',
      'auth/user-not-found':'No account with that email. Create one first.',
      'auth/invalid-email':'That email address looks wrong.',
      'auth/email-already-in-use':'That email already has an account. Sign in instead.',
      'auth/weak-password':'Password must be at least 6 characters.',
      'auth/too-many-requests':'Too many tries. Wait a few minutes and try again.',
      'auth/popup-blocked':'Pop-up blocked. Allow pop-ups for this site and try again.',
      'auth/unauthorized-domain':'This website address is not authorized in Firebase. Add it under Authentication → Settings → Authorized domains.',
      'auth/operation-not-allowed':'This sign-in method is off. Turn it on in Firebase → Authentication → Sign-in method.',
      'auth/network-request-failed':'No internet connection.'
    };
    return map[c]||('Sign-in failed: '+((e&&e.message)||c));
  }

  function waitFirebase(){
    return new Promise(function(resolve){
      var n=0;
      var iv=setInterval(function(){
        n++;
        if(fbAuth&&fbAuthMod){clearInterval(iv);resolve(true);}
        else if(n>100){clearInterval(iv);resolve(false);}
      },100);
    });
  }

  function showGate(){
    var gate=document.getElementById('bbGate');
    if(!gate) return;
    gate.hidden=false;gate.style.opacity='1';gate.style.pointerEvents='auto';
    gate.setAttribute('role','dialog');gate.setAttribute('aria-modal','true');gate.setAttribute('aria-label','Sign in');
    var ls=document.getElementById('loadingSection');
    var as=document.getElementById('authSection');
    if(ls) ls.style.display='none';
    if(as) as.style.display='';
  }

  function enterApp(u){
    if(entered) return;
    entered=true;
    var prof={
      email:u.email||'',
      name:u.displayName||((u.email||'user').split('@')[0]),
      picture:u.photoURL||null,
      method:'firebase'
    };
    setAuth(prof);
    origAfter(prof);
  }

  function watchAuth(){
    var n=0;
    var iv=setInterval(function(){
      n++;
      if(fbAuth&&fbAuthMod){
        clearInterval(iv);
        fbAuthMod.onAuthStateChanged(fbAuth,function(u){
          if(busy) return;
          if(u){
            var pw=(u.providerData||[]).some(function(p){return p.providerId==='password';});
            if(pw&&!u.emailVerified){
              fbAuthMod.sendEmailVerification(u).catch(function(){}).then(function(){return fbAuthMod.signOut(fbAuth);});
              alert('Please verify your email first. We sent a new link to your inbox. Then sign in again.');
              return;
            }
            enterApp(u);
          }else{
            var lp=getAuth();
            if(!lp||lp.method!=='guest'){localStorage.removeItem(AUTH_STORE);showGate();}
          }
        });
      }else if(n>100){clearInterval(iv);}
    },100);
  }

  async function googleSignIn(){
    var ok=await waitFirebase();
    if(!ok) return alert('Sign-in is still loading. Wait a second and try again.');
    var provider=new fbAuthMod.GoogleAuthProvider();
    provider.setCustomParameters({prompt:'select_account'});
    try{
      await fbAuthMod.signInWithPopup(fbAuth,provider);
    }catch(e){
      if(e&&e.code==='auth/popup-blocked'){
        try{await fbAuthMod.signInWithRedirect(fbAuth,provider);}catch(e2){alert(friendly(e2));}
      }else if(e&&e.code!=='auth/popup-closed-by-user'&&e.code!=='auth/cancelled-popup-request'){
        alert(friendly(e));
      }
    }
  }

  window.emailSignIn=async function(){
    var email=(document.getElementById('siEmail').value||'').trim();
    var pass=document.getElementById('siPass').value||'';
    if(!email||!pass) return alert('Email and password required.');
    var ok=await waitFirebase();
    if(!ok) return alert('Sign-in is still loading. Try again in a second.');
    busy=true;
    try{
      var c=await fbAuthMod.signInWithEmailAndPassword(fbAuth,email,pass);
      if(!c.user.emailVerified){
        await fbAuthMod.sendEmailVerification(c.user).catch(function(){});
        await fbAuthMod.signOut(fbAuth);
        alert('Please verify your email first. We sent a new link to '+email+'.');
      }else{
        enterApp(c.user);
      }
    }catch(e){alert(friendly(e));}
    finally{busy=false;}
  };

  window.emailSignUp=async function(){
    var name=(document.getElementById('suName').value||'').trim();
    var email=(document.getElementById('suEmail').value||'').trim();
    var pass=document.getElementById('suPass').value||'';
    if(!email||!pass) return alert('Email and password required.');
    if(pass.length<6) return alert('Password must be at least 6 characters.');
    var ok=await waitFirebase();
    if(!ok) return alert('Sign-in is still loading. Try again in a second.');
    busy=true;
    try{
      var c=await fbAuthMod.createUserWithEmailAndPassword(fbAuth,email,pass);
      if(name) await fbAuthMod.updateProfile(c.user,{displayName:name});
      await fbAuthMod.sendEmailVerification(c.user);
      await fbAuthMod.signOut(fbAuth);
      alert('Account created! We sent a verification link to '+email+'. Open it, then sign in.');
    }catch(e){alert(friendly(e));}
    finally{busy=false;}
  };

  window.initGoogleSignIn=function(){};

  window.afterSignIn=function(profile){
    if(profile&&profile.method==='guest') return origAfter(profile);
  };

  window.bbSignIn=async function(){
    if(satbotUser){
      try{await fbAuthMod.signOut(fbAuth);}catch(e){}
      localStorage.removeItem(AUTH_STORE);
      location.reload();
      return;
    }
    showGate();
  };

  document.addEventListener('DOMContentLoaded',function(){
    ['googleSignInBtn','googleSignUpBtn'].forEach(function(id){
      var b=document.getElementById(id);
      if(b) b.onclick=googleSignIn;
    });
    watchAuth();
  });
})();

