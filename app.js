import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js';
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut,
  sendPasswordResetEmail, updateProfile
} from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js';
import {
  getFirestore, collection, doc, getDoc, setDoc, addDoc, updateDoc,
  onSnapshot, query, orderBy, limit, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js';
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from 'https://www.gstatic.com/firebasejs/12.18.0/firebase-storage.js';
import { firebaseConfig } from './firebase-config.js';

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const state = { user:null, tools:[], locations:[], history:[], users:new Map(), unsubscribers:[], installPrompt:null };
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
const slugStatus = value => String(value || '').toLowerCase().replace(/\s+/g,'-');

function toast(message, error=false) {
  const el = $('toast'); el.textContent = message; el.classList.remove('hidden');
  el.style.background = error ? '#991b1b' : '#111827';
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.add('hidden'), 3200);
}
function displayName(user=state.user) { return user?.displayName || user?.email?.split('@')[0] || 'Employee'; }
function formatDate(ts) { if (!ts) return 'Just now'; const d = ts.toDate ? ts.toDate() : new Date(ts); return d.toLocaleString([], {dateStyle:'medium',timeStyle:'short'}); }
function openModal(id) { $(id).classList.remove('hidden'); }
function closeModal(id) { $(id).classList.add('hidden'); }

function currentLocation(id) { return state.locations.find(l => l.id === id); }
function nextToolLabel() {
  let max = 0;
  for (const t of state.tools) {
    const match = String(t.label || '').match(/(?:^|\D)(\d{1,6})$/);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `T-${String(max + 1).padStart(3,'0')}`;
}

async function ensureUserProfile(user) {
  const refDoc = doc(db,'users',user.uid);
  const snap = await getDoc(refDoc);
  if (!snap.exists()) {
    await setDoc(refDoc, { email:user.email || '', displayName:displayName(user), active:true, createdAt:serverTimestamp(), updatedAt:serverTimestamp() });
  }
}

async function seedLocationsIfEmpty() {
  if (state.locations.length) return;
  const defaults = [
    {name:'Shop',type:'Shop',active:true},
    {name:'In Transit',type:'Other',active:true},
    {name:'Repair',type:'Other',active:true},
    {name:'Unassigned',type:'Other',active:true}
  ];
  await Promise.all(defaults.map(x => addDoc(collection(db,'locations'), {...x, createdAt:serverTimestamp(), updatedAt:serverTimestamp(), updatedBy:state.user.uid})));
}

function startRealtime() {
  state.unsubscribers.forEach(fn => fn()); state.unsubscribers=[];
  state.unsubscribers.push(onSnapshot(query(collection(db,'locations'), orderBy('name')), snap => {
    state.locations = snap.docs.map(d => ({id:d.id,...d.data()}));
    renderLocations(); fillLocationSelects(); renderTools();
    seedLocationsIfEmpty().catch(e => console.error(e));
  }, e => toast(`Locations: ${e.message}`, true)));
  state.unsubscribers.push(onSnapshot(query(collection(db,'tools'), orderBy('label')), snap => {
    state.tools = snap.docs.map(d => ({id:d.id,...d.data()})); renderTools(); updateStats(); $('labelSuggestion').textContent = nextToolLabel();
  }, e => toast(`Tools: ${e.message}`, true)));
  state.unsubscribers.push(onSnapshot(query(collection(db,'history'), orderBy('createdAt','desc'), limit(100)), snap => {
    state.history = snap.docs.map(d => ({id:d.id,...d.data()})); renderHistory();
  }, e => toast(`History: ${e.message}`, true)));
}

function fillLocationSelects() {
  const active = state.locations.filter(x => x.active !== false);
  const options = active.map(x => `<option value="${esc(x.id)}">${esc(x.name)} — ${esc(x.type || 'Other')}</option>`).join('');
  $('toolLocation').innerHTML = options;
  $('moveLocation').innerHTML = options;
  $('locationFilter').innerHTML = '<option value="">All locations</option>' + active.map(x => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('');
}

function updateStats() {
  $('statTotal').textContent = state.tools.length;
  $('statInUse').textContent = state.tools.filter(t => t.status === 'In Use').length;
  $('statAvailable').textContent = state.tools.filter(t => t.status === 'Available').length;
  $('statAttention').textContent = state.tools.filter(t => ['Repair','Lost'].includes(t.status)).length;
}

function filteredTools() {
  const text = $('searchInput').value.trim().toLowerCase(), status=$('statusFilter').value, loc=$('locationFilter').value;
  return state.tools.filter(t => {
    const hay = [t.label,t.name,t.category,t.serial,t.locationName,t.notes].join(' ').toLowerCase();
    return (!text || hay.includes(text)) && (!status || t.status===status) && (!loc || t.locationId===loc);
  });
}

function renderTools() {
  if (!$('toolsGrid')) return;
  const rows = filteredTools();
  if (!rows.length) { $('toolsGrid').innerHTML = '<div class="panel empty" style="grid-column:1/-1">No tools match this view.</div>'; return; }
  $('toolsGrid').innerHTML = rows.map(t => `
    <article class="tool-card">
      ${t.photoURL ? `<img class="tool-photo" src="${esc(t.photoURL)}" alt="${esc(t.name)}" loading="lazy">` : '<div class="photo-placeholder">NO PHOTO</div>'}
      <div class="tool-content">
        <div class="tool-title"><h3>${esc(t.name)}</h3><span class="label">${esc(t.label)}</span></div>
        <span class="badge ${slugStatus(t.status)}">${esc(t.status || 'Available')}</span>
        <div class="meta"><span>📍 ${esc(t.locationName || 'Unassigned')}</span>${t.category ? `<span>Category: ${esc(t.category)}</span>`:''}${t.serial ? `<span>Serial: ${esc(t.serial)}</span>`:''}</div>
        <div class="card-actions"><button class="btn accent smallbtn" data-move-tool="${t.id}">Move / status</button><button class="btn smallbtn" data-edit-tool="${t.id}">Edit</button></div>
      </div>
    </article>`).join('');
}

function renderLocations() {
  if (!$('locationsList')) return;
  if (!state.locations.length) { $('locationsList').innerHTML='<div class="empty">No locations yet.</div>'; return; }
  $('locationsList').innerHTML = state.locations.map(l => {
    const count=state.tools.filter(t=>t.locationId===l.id).length;
    return `<div class="list-row"><div><h3>${esc(l.name)}</h3><p class="small muted">${esc(l.type || 'Other')} · ${count} tool${count===1?'':'s'} · ${l.active===false?'Inactive':'Active'}</p></div><button class="btn smallbtn" data-edit-location="${l.id}">Edit</button></div>`;
  }).join('');
}

function renderHistory() {
  if (!$('historyList')) return;
  if (!state.history.length) { $('historyList').innerHTML='<div class="empty">Tool changes will appear here.</div>'; return; }
  $('historyList').innerHTML = state.history.map(h => `<div class="history-item"><strong>${esc(h.toolLabel || '')} ${esc(h.toolName || '')}</strong><div>${esc(h.action || 'Updated')}${h.note ? ` — ${esc(h.note)}`:''}</div><div class="small muted">${esc(h.actorName || 'Employee')} · ${formatDate(h.createdAt)}</div></div>`).join('');
}

async function writeHistory(tool, action, note='') {
  await addDoc(collection(db,'history'), {
    toolId:tool.id || '', toolLabel:tool.label || '', toolName:tool.name || '',
    action, note, actorUid:state.user.uid, actorName:displayName(), createdAt:serverTimestamp()
  });
}

function resetToolForm() {
  $('toolForm').reset(); $('toolId').value=''; $('toolStatus').value='Available';
  $('toolModalTitle').textContent='Add tool'; $('toolLabel').value=nextToolLabel(); $('labelSuggestion').textContent=nextToolLabel();
  const preferred=state.locations.find(l=>l.name==='Shop'&&l.active!==false) || state.locations.find(l=>l.active!==false);
  if (preferred) $('toolLocation').value=preferred.id;
}

function editTool(id) {
  const t=state.tools.find(x=>x.id===id); if(!t)return;
  $('toolId').value=t.id; $('toolLabel').value=t.label||''; $('toolName').value=t.name||''; $('toolCategory').value=t.category||'';
  $('toolSerial').value=t.serial||''; $('toolStatus').value=t.status||'Available'; $('toolLocation').value=t.locationId||''; $('toolNotes').value=t.notes||'';
  $('toolPhoto').value=''; $('toolModalTitle').textContent='Edit tool'; openModal('toolModal');
}

function moveTool(id) {
  const t=state.tools.find(x=>x.id===id); if(!t)return;
  $('moveToolId').value=id; $('moveStatus').value=t.status||'Available'; $('moveLocation').value=t.locationId||''; $('moveNote').value=''; openModal('moveModal');
}

async function saveTool(event) {
  event.preventDefault();
  const id=$('toolId').value.trim(); const location=currentLocation($('toolLocation').value);
  if (!location) return toast('Choose a location first.',true);
  const duplicate=state.tools.find(t=>t.label.trim().toLowerCase()===$('toolLabel').value.trim().toLowerCase() && t.id!==id);
  if (duplicate) return toast('That tool label is already in use.',true);
  const payload={ label:$('toolLabel').value.trim(), name:$('toolName').value.trim(), category:$('toolCategory').value.trim(), serial:$('toolSerial').value.trim(),
    status:$('toolStatus').value, locationId:location.id, locationName:location.name, notes:$('toolNotes').value.trim(), updatedAt:serverTimestamp(), updatedBy:state.user.uid, updatedByName:displayName() };
  const btn=$('saveToolBtn'); btn.disabled=true; btn.textContent='Saving…';
  try {
    let toolRef, existing=id ? state.tools.find(t=>t.id===id) : null;
    if (id) { toolRef=doc(db,'tools',id); await updateDoc(toolRef,payload); }
    else { toolRef=await addDoc(collection(db,'tools'), {...payload,createdAt:serverTimestamp(),createdBy:state.user.uid}); }
    const photo=$('toolPhoto').files?.[0];
    if (photo) {
      if (photo.size > 8*1024*1024) throw new Error('Photo is over 8 MB.');
      const safeName=photo.name.replace(/[^a-zA-Z0-9._-]/g,'_'); const path=`tool-photos/${toolRef.id}/${Date.now()}-${safeName}`;
      const storageRef=ref(storage,path); await uploadBytes(storageRef,photo,{contentType:photo.type}); const photoURL=await getDownloadURL(storageRef);
      await updateDoc(toolRef,{photoURL,photoPath:path,updatedAt:serverTimestamp()}); payload.photoURL=photoURL;
    }
    await writeHistory({id:toolRef.id,...payload}, id ? 'Tool details updated' : 'Tool added', existing ? `Previous location: ${existing.locationName || 'Unassigned'}` : '');
    closeModal('toolModal'); toast(id?'Tool updated.':'Tool added.');
  } catch(e) { console.error(e); toast(e.message || 'Could not save tool.',true); }
  finally { btn.disabled=false; btn.textContent='Save tool'; }
}

async function saveMove(event) {
  event.preventDefault(); const id=$('moveToolId').value; const tool=state.tools.find(t=>t.id===id); const location=currentLocation($('moveLocation').value); if(!tool||!location)return;
  const oldStatus=tool.status||'Available', oldLocation=tool.locationName||'Unassigned', status=$('moveStatus').value, note=$('moveNote').value.trim();
  try {
    await updateDoc(doc(db,'tools',id),{status,locationId:location.id,locationName:location.name,assignedToUid:status==='In Use'?state.user.uid:'',assignedToName:status==='In Use'?displayName():'',updatedAt:serverTimestamp(),updatedBy:state.user.uid,updatedByName:displayName()});
    await writeHistory(tool, `${oldStatus} @ ${oldLocation} → ${status} @ ${location.name}`, note);
    closeModal('moveModal'); toast('Tool updated.');
  } catch(e){toast(e.message,true);}
}

function resetLocationForm() { $('locationForm').reset(); $('locationId').value=''; $('locationActive').checked=true; $('locationModalTitle').textContent='Add location'; }
function editLocation(id){ const l=state.locations.find(x=>x.id===id); if(!l)return; $('locationId').value=id;$('locationName').value=l.name||'';$('locationType').value=l.type||'Other';$('locationActive').checked=l.active!==false;$('locationModalTitle').textContent='Edit location';openModal('locationModal'); }
async function saveLocation(event){ event.preventDefault(); const id=$('locationId').value; const payload={name:$('locationName').value.trim(),type:$('locationType').value,active:$('locationActive').checked,updatedAt:serverTimestamp(),updatedBy:state.user.uid}; try{ if(id)await updateDoc(doc(db,'locations',id),payload);else await addDoc(collection(db,'locations'),{...payload,createdAt:serverTimestamp()}); closeModal('locationModal');toast('Location saved.'); }catch(e){toast(e.message,true);} }

async function saveProfile(event){ event.preventDefault(); const name=$('displayNameInput').value.trim(); if(!name)return; try{await updateProfile(state.user,{displayName:name});await setDoc(doc(db,'users',state.user.uid),{email:state.user.email||'',displayName:name,active:true,updatedAt:serverTimestamp()},{merge:true});$('currentUserName').textContent=name;toast('Profile saved.');}catch(e){toast(e.message,true);} }

$('loginForm').addEventListener('submit', async e => { e.preventDefault(); try{ await signInWithEmailAndPassword(auth,$('email').value.trim(),$('password').value); }catch(err){ toast('Sign-in failed. Check the email and password.',true); } });
$('resetPasswordBtn').addEventListener('click', async()=>{const email=$('email').value.trim();if(!email)return toast('Enter your employee email first.',true);try{await sendPasswordResetEmail(auth,email);toast('Password reset email sent.');}catch(e){toast('Could not send reset email.',true);}});
$('signOutBtn').addEventListener('click',()=>signOut(auth));
$('addToolBtn').addEventListener('click',()=>{resetToolForm();openModal('toolModal');});
$('useSuggestionBtn').addEventListener('click',()=>{$('toolLabel').value=nextToolLabel();});
$('toolForm').addEventListener('submit',saveTool);
$('moveForm').addEventListener('submit',saveMove);
$('addLocationBtn').addEventListener('click',()=>{resetLocationForm();openModal('locationModal');});
$('locationForm').addEventListener('submit',saveLocation);
$('profileForm').addEventListener('submit',saveProfile);
['searchInput','statusFilter','locationFilter'].forEach(id=>$(id).addEventListener(id==='searchInput'?'input':'change',renderTools));
$('clearFiltersBtn').addEventListener('click',()=>{$('searchInput').value='';$('statusFilter').value='';$('locationFilter').value='';renderTools();});
document.addEventListener('click',e=>{ const close=e.target.dataset.close;if(close)closeModal(close); const edit=e.target.dataset.editTool;if(edit)editTool(edit); const move=e.target.dataset.moveTool;if(move)moveTool(move); const loc=e.target.dataset.editLocation;if(loc)editLocation(loc); });
document.querySelectorAll('.nav-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b===btn));document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===btn.dataset.view));}));

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();state.installPrompt=e;$('installBanner').classList.remove('hidden');});
$('installBtn').addEventListener('click',async()=>{if(!state.installPrompt)return;await state.installPrompt.prompt();state.installPrompt=null;$('installBanner').classList.add('hidden');});
if ('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(console.error));

onAuthStateChanged(auth, async user => {
  state.user=user;
  if(user){
    $('authScreen').classList.add('hidden');$('app').classList.remove('hidden');$('currentUserName').textContent=displayName(user);$('profileEmail').value=user.email||'';$('displayNameInput').value=displayName(user);
    try{await ensureUserProfile(user);startRealtime();}catch(e){toast(`Firebase setup error: ${e.message}`,true);}
  } else {
    state.unsubscribers.forEach(fn=>fn());state.unsubscribers=[];$('app').classList.add('hidden');$('authScreen').classList.remove('hidden');
  }
});
