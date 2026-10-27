/* Random curved bat encounters. Weather is owned by halloween-worlds.js. */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const layer=document.createElement('div');layer.className='illustrated-bats';layer.setAttribute('aria-hidden','true');document.body.append(layer);
 let timer=0,running=false;const flights=new Set();
 const allowed=()=>document.body.classList.contains('halloween-world-active')&&!reduced.matches&&!document.hidden;
 function fly(){
  if(!allowed()||flights.size>=3)return;
  const el=document.createElement('div');el.className='illustrated-bat';const size=48+Math.random()*65;
  el.style.width=size+'px';el.style.height=size*.5+'px';el.style.setProperty('--flap',(0.32+Math.random()*.23)+'s');
  el.innerHTML='<img class="bat-left" src="halloween-art/bat.webp" alt=""><img class="bat-right" src="halloween-art/bat.webp" alt=""><img class="bat-body" src="halloween-art/bat.webp" alt="">';layer.append(el);
  const w=innerWidth,h=innerHeight,reverse=Math.random()<.5,x0=reverse?w+size:-size,x3=reverse?-size:w+size,y0=h*(.2+Math.random()*.5),y3=h*(.2+Math.random()*.5),x1=w*Math.random(),x2=w*Math.random(),y1=h*(.12+Math.random()*.65),y2=h*(.12+Math.random()*.65),keys=[];
  for(let i=0;i<=24;i++){const t=i/24,u=1-t,x=u*u*u*x0+3*u*u*t*x1+3*u*t*t*x2+t*t*t*x3,y=u*u*u*y0+3*u*u*t*y1+3*u*t*t*y2+t*t*t*y3,bank=Math.sin(t*Math.PI*3)*(reverse?-17:17);keys.push({transform:`translate(${x}px,${y}px) rotate(${bank}deg) scale(${.8+.2*Math.sin(t*Math.PI)})`,opacity:i===0||i===24?0:1})}
  const a=el.animate(keys,{duration:8500+Math.random()*7000,easing:'linear'});const record={a,el};flights.add(record);a.onfinish=()=>{flights.delete(record);el.remove()};
 }
 function queue(){clearTimeout(timer);if(allowed())timer=setTimeout(()=>{fly();if(Math.random()<.3&&flights.size<3)fly();queue()},4500+Math.random()*8500)}
 function sync(){const next=allowed();if(next===running)return;running=next;if(next)queue();else{clearTimeout(timer);for(const f of flights){f.a.cancel();f.el.remove()}flights.clear()}}
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);sync();
})();
