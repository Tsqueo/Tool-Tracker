/* Independent Halloween scenery. No inventory or Firebase writes. */
(()=>{
'use strict';
const scenes=[['excavator','The Midnight Crew','sparks'],['laundromat','The Midnight Laundromat','bubbles'],['porch','All Hallows’ Porch','embers'],['fireworks','The Halloween Finale','fireworks'],['skeleton','The Pumpkin Gentleman','sparks']];
let previous=-1;try{previous=Number(localStorage.getItem('tt-last-halloween-world')??-1)}catch{}
const candidates=scenes.map((_,i)=>i).filter(i=>i!==previous);const selected=candidates[Math.floor(Math.random()*candidates.length)];
const [name,title,motion]=scenes[selected];let remembered=false,active=false,timer=0,frame=0,dialogOpen=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const backdrop=document.createElement('div');backdrop.id='halloweenWorld';backdrop.setAttribute('aria-hidden','true');
backdrop.innerHTML='<div class="world-art"></div><div class="world-shade"></div><div class="world-motes"></div>';
document.body.prepend(backdrop);
const art=backdrop.querySelector('.world-art');
const canvas=document.createElement('canvas');canvas.id='halloweenWeather';canvas.setAttribute('aria-hidden','true');document.body.append(canvas);const ctx=canvas.getContext('2d');
const button=document.createElement('button');button.className='world-view btn';button.textContent='View Halloween scene';button.hidden=true;document.body.append(button);
const dialog=document.createElement('dialog');dialog.className='world-dialog';dialog.innerHTML='<div class="world-dialog-art"></div><div class="world-dialog-shade"></div><div class="world-dialog-controls"><span></span><button class="btn">Back to app</button></div>';document.body.append(dialog);dialog.querySelector('span').textContent=title;
button.onclick=()=>{dialogOpen=true;dialog.showModal()};dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialogOpen=false);
const url='halloween-art/'+name+'.webp';
function setArt(){art.style.backgroundImage=`url("${url}")`;dialog.querySelector('.world-dialog-art').style.backgroundImage=`url("${url}")`;backdrop.dataset.world=name;backdrop.dataset.motion=motion;
 const motes=backdrop.querySelector('.world-motes');for(let i=0;i<18;i++){const p=document.createElement('i');p.style.setProperty('--x',Math.random()*100+'%');p.style.setProperty('--delay',-Math.random()*16+'s');p.style.setProperty('--duration',10+Math.random()*12+'s');p.style.setProperty('--sway',(Math.random()-.5)*150+'px');motes.append(p)}
}
setArt();
function clearWeather(){cancelAnimationFrame(frame);ctx?.clearRect(0,0,canvas.width,canvas.height)}
function queueStorm(){clearTimeout(timer);if(active&&!document.hidden&&!reduced.matches)timer=setTimeout(strike,18000+Math.random()*27000)}
function strike(){if(!active||document.hidden||reduced.matches)return; if(dialogOpen){queueStorm();return}
 const w=innerWidth,h=innerHeight,dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
 const lines=[];let x=w*(.12+Math.random()*.76),y=0;const main=[[x,y]];
 while(y<h*.78){const nx=Math.max(0,Math.min(w,x+(Math.random()-.5)*w*.24)),ny=y+25+Math.random()*55;main.push([nx,ny]);if(Math.random()<.55){let bx=nx,by=ny;const branch=[[bx,by]];const side=Math.random()<.5?-1:1;for(let j=0;j<4;j++){bx+=side*(14+Math.random()*w*.12);by+=15+Math.random()*35;branch.push([bx,by])}lines.push([branch,.8])}x=nx;y=ny}lines.push([main,2]);
 const start=performance.now();function draw(now){const t=now-start;ctx.clearRect(0,0,w,h);if(t>620){queueStorm();return}let a=t<90?1-t/130:t<230?0:t<310?.38*(1-(t-230)/80):0;
 ctx.fillStyle=`rgba(220,230,255,${a*.19})`;ctx.fillRect(0,0,w,h);for(const [points,width] of lines){ctx.beginPath();points.forEach(([px,py],i)=>i?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.strokeStyle=`rgba(235,247,255,${a})`;ctx.lineWidth=width;ctx.shadowColor='#91b8ff';ctx.shadowBlur=16;ctx.stroke()}ctx.shadowBlur=0;frame=requestAnimationFrame(draw)}frame=requestAnimationFrame(draw)
}
function sync(){const next=document.body.dataset.season==='halloween'&&document.body.dataset.seasonStage==='full'&&document.body.dataset.seasonEffects==='on';
 if(next===active)return;active=next;document.body.classList.toggle('halloween-world-active',active);button.hidden=!active;backdrop.hidden=!active;canvas.hidden=!active;
 if(active){if(!remembered){try{localStorage.setItem('tt-last-halloween-world',String(selected))}catch{}remembered=true}queueStorm()}else{clearTimeout(timer);clearWeather();if(dialog.open)dialog.close()}}
new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-season','data-season-stage','data-season-effects']});
document.addEventListener('visibilitychange',()=>{backdrop.classList.toggle('world-paused',document.hidden);if(document.hidden){clearTimeout(timer);clearWeather()}else queueStorm()});reduced.addEventListener('change',()=>{clearWeather();queueStorm()});sync();
})();
