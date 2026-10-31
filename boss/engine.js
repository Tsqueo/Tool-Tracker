(function(root){
'use strict';
const CREW=[{id:'ada',name:'Ada',role:'Lead carpenter',colour:'#139ed4',leave:20},{id:'bo',name:'Bo',role:'Installer',colour:'#d29d48',leave:20},{id:'cam',name:'Cam',role:'Site support',colour:'#3eab91',leave:12}];
const TASKS=[
{id:'access',name:'Clear the truck access',short:'Clear lane',duration:2,crew:['ada','bo','cam'],deps:[],zone:'gate',note:'30 min. Any crew member. Must finish before unloading can begin.'},
{id:'layout',name:'Lay out the opening',short:'Lay out',duration:3,crew:['ada'],deps:[],laser:true,zone:'opening',note:'45 min. Ada only. Requires the shared laser.'},
{id:'frame',name:'Frame the opening',short:'Frame',duration:4,crew:['ada','bo'],deps:['layout'],zone:'opening',note:'60 min. Ada or Bo. Waits for layout to finish.'},
{id:'unload',name:'Receive the delivery',short:'Unload',duration:2,crew:['cam'],deps:['access'],zone:'gate',note:'30 min. Cam only. Truck arrives 9:00 a.m.; unloading must START by 9:15 a.m.. The lane must be clear.'},
{id:'mark',name:'Mark the bracket positions',short:'Mark brackets',duration:2,crew:['ada','bo'],deps:[],laser:true,zone:'brackets',note:'30 min. Ada or Bo. Requires the shared laser. Can be marked before delivery.'},
{id:'brackets',name:'Install the brackets',short:'Install brackets',duration:3,crew:['ada','bo'],deps:['mark','unload'],zone:'brackets',note:'45 min. Ada or Bo. Needs marked positions and the delivered hardware.'},
{id:'panel',name:'Install the access panel',short:'Install panel',duration:3,crew:['ada','bo'],deps:['frame','unload'],zone:'opening',note:'45 min. Ada or Bo. Needs framing and the delivered panel.'},
{id:'tidy',name:'Clear the work area',short:'Clear work area',duration:2,crew:['ada','bo','cam'],deps:['panel','brackets'],zone:'store',note:'30 min. Any crew member. Both installations must finish first. Can run alongside the final check.'},
{id:'check',name:'Complete the final check',short:'Final check',duration:2,crew:['ada'],deps:['panel','brackets'],zone:'opening',note:'30 min. Ada only. Both installations must finish first. Inspection also needs the work area cleared.'}
];
if(root.BossScenario)for(const t of TASKS)Object.assign(t,root.BossScenario.changes[t.id]||{});
const time=t=>{const mins=480+t*15,h=Math.floor(mins/60);return (h%12||12)+':'+String(mins%60).padStart(2,'0')+' '+(h>=12?'p.m.':'a.m.')};
const crewFor=p=>[p.crew,...(p.helper?[p.helper]:[])];
const duration=(t,p)=>p?.helper&&['frame','unload','tidy'].includes(t.id)?Math.max(1,t.duration-1):t.duration;
function simulate(plan,options={}){
 const states=Object.fromEntries(TASKS.map(t=>[t.id,{id:t.id,start:null,end:null,reason:plan[t.id]?'Waiting for planned start':'Not assigned',wait:0}]));const events=[],log=(t,text,type='info',id=null)=>events.push({t,text,type,id});let missed=false;
 const sorted=[...TASKS].sort((a,b)=>(plan[a.id]?.start??99)-(plan[b.id]?.start??99)||TASKS.indexOf(a)-TASKS.indexOf(b));
 for(let tick=0;tick<=20;tick++){
  for(const task of TASKS){const st=states[task.id];if(st.end===tick)log(tick,task.short+' complete.','complete',task.id)}
  if(tick===4)log(tick,'The truck has arrived. The driver has another delivery after this one.','truck');
  if(tick===6&&states.unload.start===null){missed=true;log(tick,'The truck leaves with the panel and hardware. Nobody began unloading by 9:15 a.m..','danger','unload')}
  if(tick===12)log(tick,options.extendCam?'Cam stays until noon. The extra shift costs $90.':'Cam clocks out at 11:00 a.m.. His afternoon is already booked.','crew');
  if(tick===16){const ready=['panel','brackets','tidy','check'].every(id=>states[id].end!==null&&states[id].end<=16);log(tick,ready?'The inspector arrives. The work is ready and the route is clear.':'The inspector arrives. The work is not ready for handoff.','inspection')}
  for(const task of sorted){const p=plan[task.id],st=states[task.id];if(!p||st.start!==null||tick<p.start)continue;
   let why='';const member=CREW.find(c=>c.id===p.crew),leave=p.crew==='cam'&&options.extendCam?16:member?.leave;
   if(!member||!task.crew.includes(p.crew))why='This task needs '+task.crew.map(id=>CREW.find(c=>c.id===id).name).join(' or ');
   else if(task.id==='unload'&&(missed||tick>5))why='Delivery missed';
   else if(task.id==='unload'&&tick<4)why='Truck has not arrived';
   else if(task.deps.some(id=>states[id].end===null||states[id].end>tick))why='Waiting for '+task.deps.filter(id=>states[id].end===null||states[id].end>tick).map(id=>TASKS.find(t=>t.id===id).short.toLowerCase()).join(' and ');
   else if(p.helper&&(!CREW.some(c=>c.id===p.helper)||p.helper===p.crew||!['frame','unload','tidy'].includes(task.id)))why='Choose a different helper for framing, unloading or cleanup';
   else if(TASKS.some(t=>states[t.id].start!==null&&states[t.id].end>tick&&states[t.id].start<=tick&&crewFor(plan[t.id]).some(c=>crewFor(p).includes(c))))why='A crew member is still on another task';
   else if(p.helper&&tick+duration(task,p)>(p.helper==='cam'?(options.extendCam?16:12):20))why='Helper cannot finish before shift end';
   else if(task.laser&&TASKS.filter(t=>t.laser&&states[t.id].start!==null&&states[t.id].end>tick&&states[t.id].start<=tick).length>=(options.secondLaser?2:1))why='Waiting for the laser';
   else if(tick+duration(task,p)>leave)why=member.name+' cannot finish before shift end';
   else if(tick+duration(task,p)>20)why='Not enough time left in the shift';
   if(why){if(st.reason!==why&&why!=='Truck has not arrived')log(tick,task.short+': '+why+'.','wait',task.id);st.reason=why;st.wait+=tick>=p.start?1:0;continue}
   st.start=tick;st.end=tick+duration(task,p);st.reason='';log(tick,crewFor(p).map(id=>CREW.find(c=>c.id===id).name).join(' + ')+' start '+task.short.toLowerCase()+'.','start',task.id);
  }
 }
 const finished=TASKS.filter(t=>states[t.id].end!==null),allDone=finished.length===TASKS.length,finish=allDone?Math.max(...finished.map(t=>states[t.id].end)):null,ready=allDone&&finish<=16;
 const overtime=finished.reduce((n,t)=>n+Math.max(0,states[t.id].end-Math.max(16,states[t.id].start))*30*crewFor(plan[t.id]).length,0),cost=(options.secondLaser?60:0)+(options.extendCam?90:0)+overtime;
 const waits=TASKS.filter(t=>states[t.id].start!==null&&states[t.id].start>plan[t.id].start).map(t=>({task:t.name,minutes:(states[t.id].start-plan[t.id].start)*15}));
 return {states,events,ready,allDone,finish,cost,overtime,completed:finished.length,waits,missed,options:{...options},plan:JSON.parse(JSON.stringify(plan))};
}
root.BossEngine={CREW,TASKS,time,simulate,crewFor,duration};
})(typeof window==='undefined'?globalThis:window);
