/* Winter 04: a single scene clock drives movement, poses, props and impacts. */
let fightCleanup=null,winterPaused=false,winterSpeed=1,sledRun=0,winterStep=0;
function startWinterScene(id){
 const W=layer.clientWidth,H=layer.clientHeight,ns='http://www.w3.org/2000/svg',cast=[],items=[],tweens=[],events=[],updates=[];
 let serial=0,time=0,last=0,raf=0,alive=true,finished=false;
 layer.dataset.scene=id;$('beeboDoor').hidden=id!=='nap';$('play').disabled=false;$('stepScene').disabled=false;$('pauseScene').disabled=false;$('pauseScene').textContent='Pause';winterPaused=false;
 const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),ease=t=>t*t*(3-2*t);
 function at(t,fn){events.push({t,fn});events.sort((a,b)=>a.t-b.t)}
 function after(t,fn){at(time+t,fn)}
 function tween(o,to,duration=.7,delay=0,linear=false){tweens.push({o,to,from:Object.fromEntries(Object.keys(to).map(k=>[k,+o[k]||0])),start:time+delay,duration,linear})}
 function node(tag,attrs={}){const e=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);return e}
 const specs={
 hermey:{col:0,box:[205,30,410,694],head:[420,300],shoulder:[500,360],elbow:[530,465],hand:[550,550],face:[490,240],headPoly:'220,20 600,20 600,305 220,305',torso:'355,300 480,300 515,515 335,530',back:'350,340 390,360 355,480 350,570 270,580 265,490 300,400',arm:'480,340 520,350 560,445 540,485 505,460',fore:'515,440 560,435 585,580 515,585 505,510',legs:['350,515 430,515 435,724 330,724','430,510 495,510 575,724 430,724'],hips:[[390,520],[462,520]]},
 yukon:{col:1,box:[105,0,520,724],head:[365,290],shoulder:[470,320],elbow:[520,440],hand:[555,525],face:[490,190],headPoly:'160,0 580,0 580,292 160,292',torso:'260,285 460,285 505,555 230,555',back:'240,290 295,310 250,455 240,555 130,560 125,460 165,360',arm:'450,300 500,310 550,420 520,465 480,440',fore:'510,410 560,420 600,550 515,565 490,480',legs:['235,545 350,545 355,724 210,724','350,545 460,545 520,724 355,724'],hips:[[290,545],[405,545]]},
 bumble:{col:2,box:[5,0,595,724],head:[340,280],shoulder:[465,310],elbow:[510,430],hand:[510,525],face:[440,175],headPoly:'100,0 550,0 550,285 100,285',torso:'155,270 455,270 490,625 100,625',back:'140,275 210,310 180,450 210,565 80,575 35,470 65,340',arm:'420,280 490,295 545,405 530,470 465,450',fore:'465,415 545,410 570,555 460,580 450,500',legs:['110,600 300,600 310,724 70,724','300,600 480,600 575,724 290,724'],hips:[[220,600],[395,600]]}
 };
 function makeRig(name,x,y,width,dir=1){
  const e=document.createElement('div');e.className='fight-actor';e.dataset.fighter=name;e.style.left=x+'px';e.style.top=y+'px';e.style.width=width+'px';
  const facing=document.createElement('div');facing.className='fight-facing';facing.style.transform=`scaleX(${dir})`;e.append(facing);
  const body=document.createElement('div');body.className='fight-body';facing.append(body);
  const s=specs[name],svg=node('svg');body.append(svg);const defs=node('defs');svg.append(defs);
  const joints={},rig={e,body,svg,joints,name,dir,x,y,width,pose:{arm:0,elbow:0,back:0,head:0,lean:0,duck:0,walk:0,shake:0},v:{arm:0,elbow:0,back:0,head:0,lean:0,duck:0,walk:0,shake:0},held:null};
  function piece(label,poly,origin,parent=svg,asset='art/fight-cast-v3.png',imageAttrs={x:-(s?s.col:0)*724,y:0,width:2172,height:724}){
   const id='joint-'+(++serial),clip=node('clipPath',{id,clipPathUnits:'userSpaceOnUse'});clip.append(node('polygon',{points:poly}));defs.append(clip);const g=node('g');g.append(node('image',{href:asset,...imageAttrs,'clip-path':`url(#${id})`,preserveAspectRatio:'none'}));parent.append(g);joints[label]={g,origin};return g;
  }
  if(s){
   svg.setAttribute('viewBox',s.box.join(' '));e.style.height=width*s.box[3]/s.box[2]+'px';
   piece('back',s.back,[s.head[0]-80,350]);
   s.legs.forEach((p,i)=>piece('leg'+i,p,s.hips[i]));
   piece('torso',s.torso,[s.head[0],500]);piece('head',s.headPoly,s.head);
   const arm=piece('arm',s.arm,s.shoulder);piece('elbow',s.fore,s.elbow,arm);const seam=node('ellipse',{cx:s.elbow[0],cy:s.elbow[1],rx:23,ry:25,fill:name==='bumble'?'#e6e0d5':name==='hermey'?'#20527b':'#254c70'});arm.insertBefore(seam,arm.lastChild);
   const ball=node('circle',{cx:s.hand[0],cy:s.hand[1],r:28,fill:'url(#fight-snow)',opacity:0,class:'held-snow'});joints.elbow.g.append(ball);rig.held=ball;
   rig.face=node('circle',{cx:s.face[0],cy:s.face[1],r:8,fill:'transparent'});joints.head.g.append(rig.face);
  }else if(['clarice','donner','mrsclaus','moonracer','charlie','elephant','dolly','santa'].includes(name)){
   const revised={mrsclaus:0,dolly:1,elephant:2,santa:3},isRef=name in revised,cell=isRef?revised[name]:['clarice','donner','mrsclaus','moonracer','charlie','elephant'].indexOf(name),cols=isRef?2:3,im={x:-(cell%cols)*512,y:-Math.floor(cell/cols)*512,width:cols*512,height:1024};const cellWidth=name==='elephant'?610:512;svg.setAttribute('viewBox',`0 0 ${cellWidth} 512`);e.style.height=width*512/cellWidth+'px';
   piece('torso',name==='donner'?'12,0 500,0 500,505 12,505':`3,3 ${cellWidth-3},3 ${cellWidth-3},509 3,509`,[256,360],svg,isRef?'art/reference-friends-v6.png':'art/friends-v6.png',im);
   rig.face=node('circle',{cx:name==='elephant'?570:390,cy:name==='elephant'?235:155,r:5,fill:'transparent'});svg.append(rig.face);
  }else if(name==='sam'){
   svg.setAttribute('viewBox','0 0 444 444');e.style.height=width+'px';
   const image={x:0,y:-444,width:1776,height:888};
   piece('back','0,185 160,185 175,350 0,350',[135,210],svg,'art/extras-motion-v2.png',image);
   piece('torso','145,180 305,180 330,330 390,444 60,444 115,330',[222,360],svg,'art/extras-motion-v2.png',image);
   piece('head','0,0 444,0 444,200 0,200',[222,185],svg,'art/extras-motion-v2.png',image);
   const arm=piece('arm','290,185 355,195 410,300 365,350 315,300',[305,210],svg,'art/extras-motion-v2.png',image);
   const held=node('circle',{cx:380,cy:310,r:15,fill:'url(#fight-snow)',opacity:0});arm.append(held);rig.held=held;
   rig.face=node('circle',{cx:220,cy:120,r:8,fill:'transparent'});joints.head.g.append(rig.face);
  }else{
   const dog=name==='beebo',asset=dog?'art/beebo-fight-v3.png':'art/rudolph-v4.png',img=dog?{x:0,y:0,width:1024,height:1024}:{x:0,y:0,width:1000,height:1100},unit=dog?1024:1000;
   svg.setAttribute('viewBox',`0 0 ${unit} ${dog?unit:1100}`);e.style.height=(width*(dog?1:1.1))+'px';
   if(dog){
    piece('tail','0,0 440,0 440,620 0,620',[380,470],svg,asset,img);
    piece('leg0','210,560 430,560 430,1024 210,1024',[355,590],svg,asset,img);
    piece('leg1','610,550 850,550 850,1024 610,1024',[720,585],svg,asset,img);
    piece('torso','300,350 760,350 800,670 300,670',[550,530],svg,asset,img);
    piece('head','650,0 1024,0 1024,600 650,600',[740,480],svg,asset,img);
    rig.face=node('circle',{cx:960,cy:330,r:8,fill:'transparent'});joints.head.g.append(rig.face);
   }else{
    piece('tail','0,300 300,300 330,650 0,650',[270,530],svg,asset,img);
    piece('leg0','120,660 430,660 430,1100 120,1100',[330,690],svg,asset,img);piece('leg1','560,650 880,650 880,1100 560,1100',[710,680],svg,asset,img);
    piece('torso','240,450 750,450 800,730 220,730',[500,610],svg,asset,img);piece('head','450,0 1000,0 1000,560 450,560',[670,480],svg,asset,img);
    rig.face=node('circle',{cx:935,cy:345,r:5,fill:'transparent'});joints.head.g.append(rig.face);
   }
  }
  if(name==='beebo'){e.onclick=openMorale;e.setAttribute('role','button');e.setAttribute('aria-label','Open Morale Department');e.tabIndex=0;}e.style.left='0';e.style.top='0';rig.x=x;rig.y=y;rig.scale=name==='bumble'?1.25:1;if(name==='bumble')e.style.transformOrigin='50% 100%';rig.rotation=0;rig.alpha=1;layer.append(e);cast.push(rig);return rig;
 }
 const definitions=node('svg',{width:0,height:0});definitions.innerHTML='<defs><radialGradient id="fight-snow" cx="30%" cy="25%"><stop stop-color="#fff"/><stop offset=".7" stop-color="#e5f5ff"/><stop offset="1" stop-color="#a0c3d9"/></radialGradient></defs>';layer.append(definitions);
 function point(el){const r=el.getBoundingClientRect(),l=layer.getBoundingClientRect();return{x:r.left+r.width/2-l.left,y:r.top+r.height/2-l.top}}
 const face=r=>point(r.face),hand=r=>point(r.held||r.face);
 function pose(r,p){Object.assign(r.pose,p);if(specs[r.name]){r.pose.arm=clamp(r.pose.arm,-150,65);r.pose.elbow=clamp(r.pose.elbow,-30,25);r.pose.back=clamp(r.pose.back,-85,40)}}
 function turn(r,d){r.dir=d;r.e.querySelector('.fight-facing').style.transform=`scaleX(${d})`}
 function move(r,x,y,seconds=1){y=Math.min(y,H-parseFloat(r.e.style.height)-8);if(Math.abs(x-r.x)>10)turn(r,x>r.x?1:-1);pose(r,{walk:1});tween(r,{x,y},seconds);after(seconds,()=>pose(r,{walk:0}))}
 function enter(name,x,y,width,dir=1,delay=0){const r=makeRig(name,x-dir*110,y,width,dir);y=Math.min(y,H-parseFloat(r.e.style.height)-8);r.y=y;r.alpha=0;at(delay,()=>{tween(r,{x,alpha:1},.9);pose(r,{walk:1});after(.9,()=>pose(r,{walk:0}))});if(name==='beebo'){$('beeboDoor').hidden=true;r.e.style.pointerEvents='auto';r.e.onclick=openMorale;r.e.tabIndex=0;r.e.setAttribute('role','button');r.e.setAttribute('aria-label','Open Morale Department');r.e.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openMorale()}}}return r}
 function exit(r,dir=r.dir,delay=0){after(delay,()=>{turn(r,dir);pose(r,{walk:1});tween(r,{x:dir>0?W+130:-160,alpha:0},1.2)})}
 const extraIndex={pickaxe:0,icicle:1,marshmallow:2};
 const snowParts={snowbody:0,snowhead:1,snowpile:2,topper:3};
 const propIndex={pinecone:0,carrot:1,gift:2,hat:3,ornament:4,boot:5,rod:6,snowman:7};
 function sprite(kind){if(kind in snowParts){const c=snowParts[kind],svg=node('svg',{viewBox:['0 0 560 540','560 0 464 512','0 560 560 464','560 560 464 464'][c]});svg.append(node('image',{href:'art/snow-parts-v7.png',width:1024,height:1024}));return svg}if(kind==='snowmanbody'){const svg=node('svg',{viewBox:'1330.5 620 443.5 267',preserveAspectRatio:'xMidYMid meet'});svg.append(node('image',{href:'art/props-v4.png',width:1774,height:887}));return svg}if(kind in extraIndex){const svg=node('svg',{viewBox:`${extraIndex[kind]*512} 0 512 512`,preserveAspectRatio:'xMidYMid meet'});svg.append(node('image',{href:'art/props-v5.png',width:1536,height:512}));return svg}const svg=node('svg',{viewBox:`${(propIndex[kind]%4)*443.5} ${Math.floor(propIndex[kind]/4)*443.5} 443.5 443.5`,preserveAspectRatio:'xMidYMid meet'});svg.append(node('image',{href:'art/props-v4.png',width:1774,height:887}));return svg}
 function clipViewport(svg){const box=svg.getAttribute('viewBox').split(/\s+/).map(Number),id='viewport-'+(++serial),defs=node('defs'),clip=node('clipPath',{id,clipPathUnits:'userSpaceOnUse'});clip.append(node('rect',{x:box[0],y:box[1],width:box[2],height:box[3]}));defs.append(clip);svg.prepend(defs);svg.querySelectorAll('image').forEach(im=>im.setAttribute('clip-path',`url(#${id})`));}
 function item(kind,x,y,size=40,parent=layer){const e=document.createElement('div');e.className='winter-prop '+kind;e.style.opacity='0';e.style.width=e.style.height=size+'px';const art=sprite(kind);clipViewport(art);e.append(art);parent.append(e);const p={e,x,y,size,rotation:0,scale:1,alpha:1};items.push(p);return p}
 function powder(x,y,size=32,dx=18){const p=plain('powder-tuft',x-size/2,y-size/3,size);tween(p,{x:p.x+dx,y:p.y-15,scale:1.65,alpha:0},.8);after(.85,()=>remove(p));return p}
 function plain(kind,x,y,size=20){const e=document.createElement('div');e.className='winter-prop '+kind;e.style.opacity='0';e.style.width=e.style.height=size+'px';layer.append(e);const p={e,x,y,size,rotation:0,scale:1,alpha:1};items.push(p);return p}
 function attach(p,r,where='mouth',dx=0,dy=0){p.follow={r,where,dx,dy};return p}
 function detach(p){if(p.follow){const q=p.follow.where==='hand'?hand(p.follow.r):face(p.follow.r);p.x=q.x-p.size/2+p.follow.dx;p.y=q.y-p.size/2+p.follow.dy;delete p.follow}return p}
 function remove(p){p.alpha=0;p.e.remove();p.removed=true}
 function burst(x,y,n=14,size=1){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,p=plain('snow-chip',x,y,(2+Math.random()*4)*size);tween(p,{x:x+Math.cos(a)*(18+Math.random()*35)*size,y:y+Math.sin(a)*35*size+22,alpha:0,scale:.3},.65+Math.random()*.4,0,true);after(1.1,()=>remove(p))}}
 function ball(from,to,duration=.8,size=12,arc=60,onHit=()=>{}){const p=plain('real-snowball',from.x-size/2,from.y-size/2,size),born=time;p.fly={from,to,duration,arc,born};after(duration,()=>{remove(p);onHit(to)});return p}
 function throwBall(r,target,{delay=0,size=11,miss=false,onHit=null,duration=.8}={}){after(delay,()=>{if(r.name==='bumble')r.held?.setAttribute('r',size*595/r.width/2);pose(r,{arm:-195,elbow:-45,lean:-5,head:-4});r.held?.setAttribute('opacity','1');after(.52,()=>{pose(r,{arm:-88,elbow:2,lean:6,head:1});after(.16,()=>{const from=hand(r),to=typeof target==='function'?target():face(target);r.held?.setAttribute('opacity','0');ball(from,to,duration,size,Math.min(95,Math.abs(to.x-from.x)*.28),q=>{if(onHit)onHit(q);else if(!miss)hit(target)});after(.22,()=>pose(r,{arm:-35,elbow:0,lean:2}));after(.68,()=>pose(r,{arm:0,lean:0,head:0}))})})})}
 function heavyHit(r,variant){const f=face(r),home={x:r.x,y:r.y};burst(f.x,f.y,28,1.4);powder(f.x,f.y,75,-25);pose(r,{walk:0,arm:-75,back:-60});
  if(variant===0){tween(r,{rotation:-85,x:Math.max(3,r.x-20),y:r.y+30},.4);after(1.5,()=>{tween(r,{rotation:0,x:home.x,y:home.y},.7);pose(r,{arm:0,back:0})})}
  else if(variant===1){tween(r,{x:Math.max(-25,r.x-55),rotation:-22},.55);after(1.3,()=>{tween(r,{x:home.x,rotation:0},.8);pose(r,{arm:0,back:0})})}
  else{const pile=plain('snow-burial',r.x-5,r.y+18,r.width+15);pose(r,{duck:1,head:-10});after(1.5,()=>{tween(pile,{alpha:0,scale:1.3},.6);pose(r,{duck:0,head:0,arm:0,back:0});burst(f.x,f.y+25,18);after(.7,()=>remove(pile))})}
 }
 function hit(r){const f=face(r);burst(f.x,f.y,13,.75);
  if(r.name==='hermey'){pose(r,{duck:.6,head:-14,back:-85,arm:-125,elbow:-35});const cap=plain('real-snowball',f.x-10,f.y-30,18);cap.follow={r,where:'mouth',dx:0,dy:-24};after(.8,()=>{detach(cap);tween(cap,{y:cap.y+55,alpha:0},.7);pose(r,{back:-110});after(.7,()=>{remove(cap);pose(r,{duck:0,head:0,back:0,arm:0,elbow:0})})})}
  else if(r.name==='yukon'){pose(r,{head:14,back:-75,elbow:-80,arm:-18});after(.5,()=>pose(r,{head:-6,back:-100}));after(1.3,()=>pose(r,{head:0,back:0,elbow:0,arm:0}))}
  else if(r.name==='bumble'){const snow=plain('face-snow',f.x-18,f.y-12,35);snow.follow={r,where:'mouth',dx:0,dy:0};pose(r,{head:-13});after(.8,()=>pose(r,{head:12,back:-65}));after(1.6,()=>{remove(snow);pose(r,{head:0,back:0});burst(f.x,f.y+15,8,.7)})}
  else if(r.name==='sam'){pose(r,{head:13,back:-70});after(1.2,()=>pose(r,{head:0,back:0}))}
  else if(r.name==='rudolph'){pose(r,{head:-15,duck:.45});after(.7,()=>pose(r,{head:8,duck:0}));after(1.3,()=>pose(r,{head:0}))}
  else{pose(r,{head:-15,duck:.25});after(.35,()=>{pose(r,{head:15});burst(f.x+12,f.y,11,.65)});after(.75,()=>pose(r,{head:0,duck:0}))}
 }
 function finish(seconds){at(seconds,()=>{finished=true;tweenExit();after(1.3,()=>{stopScene();$('status').textContent='Scene complete. Choose another, or let the crew surprise you.';queue()})})}
 function tweenExit(){cast.forEach(r=>exit(r,r.exitDir||(r.x+r.width/2<W/2?-1:1)));items.forEach(p=>{if(!p.removed)tween(p,{alpha:0},1)})}
 function label(text){$('status').textContent=text}
 function beat(name){layer.dataset.beat=name}
 function wave(r){pose(r,{arm:-155,elbow:-20,head:5});after(.5,()=>pose(r,{elbow:18}));after(1,()=>pose(r,{elbow:-18}));after(1.6,()=>pose(r,{arm:0,elbow:0,head:0}))}
 function film(asset,steps){const width=Math.min(W*.97,390),x=(W-width)/2,y=H-width*2/3-5,frames=[];
  for(let i=0;i<4;i++){const p=plain('pose-film',x,y,width);p.e.style.height=width*2/3+'px';const svg=node('svg',{viewBox:`${i%2*768} ${Math.floor(i/2)*512} 768 512`});svg.append(node('image',{href:asset,width:1536,height:1024}));p.e.append(svg);p.alpha=i===0?1:0;p.e.dataset.pose=String(i);frames.push(p)}
  let last=0;steps.forEach(([t,index,name])=>at(t,()=>{beat(name);if(index!==last){tween(frames[last],{alpha:0},.24);tween(frames[index],{alpha:1},.24);last=index}}));return frames;
 }
 function parcel(x,y,size){const front=item('gift',x,y,size);front.e.classList.add('parcel-front');front.e.style.clipPath='inset(32% 0 0 0)';front.e.style.zIndex=4;const mouth=plain('parcel-mouth',x+size*.1,y+size*.31,size*.8);mouth.e.style.height=size*.23+'px';mouth.e.style.zIndex=1;const lid=item('gift',x,y,size);lid.e.style.clipPath='inset(0 0 65% 0)';lid.e.style.zIndex=5;const ribbon=plain('parcel-ribbon',x+size*.45,y+size*.1,size*.1);ribbon.e.style.height=size*.8+'px';ribbon.e.style.zIndex=6;return {front,mouth,lid,ribbon,x,y,size}}
 function openParcel(q){beat('lid-opening');tween(q.ribbon,{x:q.x-q.size*.45,y:q.y+q.size*.8,rotation:-65},.65);after(.65,()=>{tween(q.lid,{x:q.x+q.size*.7,y:q.y-q.size*.5,rotation:35},.7);burst(q.x+q.size/2,q.y+q.size*.3,9,.6)})}
 function tissue(x,y,n=12){for(let i=0;i<n;i++){const p=plain('tissue-paper',x,y,7+Math.random()*8);p.e.style.background=['#fff5df','#d7ecd5','#f6c3c0'][i%3];p.e.style.height=(10+Math.random()*12)+'px';const dx=(Math.random()-.5)*145;tween(p,{x:x+dx,y:y-45-Math.random()*50,rotation:Math.random()*180},.45);after(.48,()=>tween(p,{x:x+dx*1.3,y:H+15,rotation:300+Math.random()*180,alpha:0},1.4));after(2,()=>remove(p))}}
 function ribbonPath(){const svg=node('svg',{class:'story-ribbon',viewBox:`0 0 ${W} ${H}`}),path=node('path');svg.append(path);layer.append(svg);return{svg,path}}
 const floor=H-110;
 if(id==='snowball'){
  label('Independent rows · Hermey / Yukon, Sam / Bumble, Rudolph / Beebo.');
  const h=enter('hermey',10,H*.24,74,1),y=enter('yukon',W-103,H*.24,92,-1,.3),s=enter('sam',4,H*.57,88,1,.7),b=enter('bumble',W-125,H*.55,120,-1,1.1);
  const d=enter('beebo',8,floor+5,115,1,1.4),r=enter('rudolph',W-115,floor,105,-1,1.7);
  // Each row has its own cadence and impact response. No shared firing loop.
  [1.7,7.8,14.6,22.3].forEach(t=>at(t,()=>throwBall(h,y)));
  [4.5,11.1,19.2,26.5].forEach((t,i)=>at(t,()=>{if(i%2===0){pose(h,{duck:1});after(1.65,()=>pose(h,{duck:0}));throwBall(y,()=>({x:24,y:H*.24+25}),{miss:true,onHit:q=>burst(q.x,q.y)})}else throwBall(y,h)}));
  [3.3,12.8,23.7].forEach(t=>at(t,()=>throwBall(s,b,{duration:1})));
  [8.8,18.1,28.7].forEach((t,i)=>at(t,()=>throwBall(b,s,{size:32+i*3,duration:1.1,onHit:()=>heavyHit(s,i)})));
  const dogHome=8,deerHome=W-111,dogMax=Math.max(20,W*.45-100);r.exitDir=1;d.exitDir=-1;
  function exchange(t,fromRight,pratfall=false){at(t,()=>{beat(pratfall?'beebo-pounce':'rolling-snowball');const y=H-25,from=fromRight?W-115:dogMax+105,to=fromRight?dogMax+100:W-125,q=plain('real-snowball',from,y-17,18);tween(q,{x:to,rotation:fromRight?-460:460},1.6,0,true);
   pose(d,{head:14});pose(r,{head:12});
   after(.9,()=>{if(fromRight){tween(d,{x:dogMax,y:floor-13,rotation:pratfall?12:0},.5);pose(d,{walk:0,head:16})}else{tween(r,{y:floor-18},.3);after(.35,()=>tween(r,{y:floor},.35))}});
   after(1.7,()=>{remove(q);if(pratfall){beat('powder-and-shake');tween(d,{y:floor+5,rotation:17},.25);powder(dogMax+100,H-28,65,12);pose(d,{head:20});tween(r,{x:deerHome+7},.3);after(.9,()=>{tween(d,{rotation:0,y:floor},.4);pose(d,{head:-14,lean:-6});after(.3,()=>{pose(d,{head:14,lean:6});powder(dogMax+110,H-55,35,65);pose(r,{head:-14})});after(.8,()=>{pose(d,{head:0,lean:0});pose(r,{head:0})})})}else{powder(fromRight?dogMax+95:W-120,H-22,25,fromRight?12:-12);pose(d,{head:-8});pose(r,{head:-8})}});
   after(3.8,()=>{tween(d,{x:dogHome},.7);tween(r,{x:deerHome},.7);pose(d,{head:0,lean:0});pose(r,{head:0})})
  })}
  exchange(3.8,true,true);exchange(11.2,false);exchange(16.1,true);exchange(21.3,false);exchange(26.1,true,true);
  updates.push(()=>{d.x=Math.min(d.x,dogMax);r.x=Math.max(r.x,deerHome-5)});
  finish(32)
 }
 if(id==='sled'){
  $('beeboDoor').hidden=true;label('The toboggan committee · curved course, seated passengers, a changing finish.');
  const team=document.createElement('div');team.className='tow-team';team.innerHTML='<img src="art/toboggan-v4-cutout.png" alt="Bumble, Yukon and Hermey seated in a wooden toboggan"><svg class="tow-ropes" viewBox="0 0 340 200"><path d="M180 143 Q210 155 244 135 M185 149 Q244 170 302 143"/></svg>';layer.append(team);
  const still=team.querySelector('img'),sledArt=node('svg',{class:'sled-art',viewBox:'0 0 1536 1024'}),seatDefs=node('defs'),seatMask=node('mask',{id:'seat-body-mask'});seatMask.append(node('rect',{width:1536,height:1024,fill:'white'}));seatDefs.append(seatMask);sledArt.append(seatDefs);
  const heads=[['300,70 635,70 665,385 605,435 340,425 285,290',470,410],['680,170 940,170 980,415 900,480 680,460 645,320',800,450],['960,295 1245,295 1270,535 1155,590 1000,560 950,435',1100,555]],seatHeads=[];
  heads.forEach(([points,x,y],i)=>{seatMask.append(node('polygon',{points,fill:'black'}));const cp=node('clipPath',{id:'seat-head-'+i});cp.append(node('polygon',{points}));seatDefs.append(cp)});
  sledArt.append(node('image',{href:'art/toboggan-v4-cutout.png',width:1536,height:1024,mask:'url(#seat-body-mask)'}));heads.forEach(([points,x,y],i)=>{const g=node('g');g.append(node('image',{href:'art/toboggan-v4-cutout.png',width:1536,height:1024,'clip-path':`url(#seat-head-${i})`}));sledArt.append(g);seatHeads.push({g,x,y})});still.remove();team.prepend(sledArt);
  const d=makeRig('beebo',0,0,85,1),r=makeRig('rudolph',0,0,78,1);d.e.remove();r.e.remove();team.append(r.e,d.e);pose(d,{walk:1,lean:-4});pose(r,{walk:1,lean:-3});
  const phase=Math.random()*1.2,ending=(sledRun++%4),run=9.8,scale=Math.min(.95,W/410);let sprayed=-1,teamX=W/2,teamY=-200,teamDir=1,falling=false;
  updates.push(()=>{const p=clamp(time/run),a=p*Math.PI*3.2+phase,dx=Math.cos(a),cx=W/2+Math.sin(a)*Math.max(20,(W-340*scale)/2-7),yy=-210+(H+260)*p,dir=dx>=0?1:-1,roll=dx*19,turnScale=Math.tanh(dx*5);teamX=cx;teamY=yy;teamDir=dir;team.style.transform=`translate(${cx-170}px,${yy+(falling?Math.max(0,time-6.6)*250:0)}px) rotate(${roll}deg) scale(${scale})`;team.style.opacity=time<run+2?'1':'0';team.style.setProperty('--turn',dir*turnScale);sledArt.style.transform=`scaleX(${turnScale}) rotate(${Math.sin(time*4)*1.2}deg)`;seatHeads.forEach((q,i)=>q.g.setAttribute('transform',`rotate(${Math.sin(time*3+i)*3+roll*.12} ${q.x} ${q.y})`));team.querySelector('.tow-ropes').style.transform=`scaleX(${turnScale})`;
   d.x=129+125*turnScale;d.y=115;r.x=130+72*turnScale;r.y=106;d.dir=r.dir=dir;d.e.querySelector('.fight-facing').style.transform=`scaleX(${turnScale})`;r.e.querySelector('.fight-facing').style.transform=`scaleX(${turnScale})`;d.pose.lean=Math.sin(time*5)*3;r.pose.lean=Math.sin(time*5+.7)*3;
   if(Math.floor(time*3)!==sprayed&&p>.1&&p<.95){sprayed=Math.floor(time*3);burst(cx-30,yy+150,4,.45)}
  });
  if(ending%2===0)at(6.6,()=>{
   falling=true;const isHermey=ending===0,idx=isHermey?2:1;seatHeads[idx].g.style.opacity=0;seatMask.append(node('polygon',{points:isHermey?'950,280 1280,280 1270,680 950,650':'650,160 990,160 990,650 650,625',fill:'black'}));
   const z=makeRig(isHermey?'hermey':'yukon',teamX-40,teamY+36,78,teamDir);pose(z,{arm:-140,back:-100,elbow:-30});powder(z.x+30,z.y+70,45,10);
   tween(z,{x:W*.35,y:floor-15,rotation:110},.85);after(.9,()=>{pose(z,{duck:1,head:20});powder(W*.46,H-35,85,0);burst(W*.46,H-35,26,1.2)});
   after(2,()=>{tween(z,{rotation:0,y:floor},.65);pose(z,{duck:.6,arm:-30,back:-40})});after(3,()=>{pose(z,{duck:0,head:-12,arm:0,back:0});powder(W*.46,H-70,35,15);after(.7,()=>pose(z,{head:0}))})
  });finish(13)
 }
 if(id==='pinecone'){
  label('Rudolph offers a carrot. Beebo has already chosen his pinecone.');const d=enter('beebo',8,floor,126,1),home=W-126,r=enter('rudolph',home,floor-5,118,-1,.4);d.exitDir=-1;r.exitDir=1;
  const cone=attach(item('pinecone',0,0,25),d,'mouth',-2,4),carrot=attach(item('carrot',0,0,42),r,'mouth',-20,4);
  at(1.8,()=>{beat('carrot-offer');pose(r,{walk:1,head:5});tween(r,{x:Math.max(160,home-65)},1);after(1,()=>pose(r,{walk:0,head:9}))});
  at(3.3,()=>{beat('offer-held');pose(d,{head:9});after(.6,()=>pose(d,{head:-12}))});
  at(4.5,()=>{beat('beebo-declines');turn(d,-1);pose(d,{head:0});tween(d,{x:d.x-10},.6)});
  at(5.6,()=>{beat('carrot-withdrawn');pose(r,{head:-9});tween(r,{x:home},.9)});at(7,()=>{pose(r,{head:0});turn(d,1)});
  updates.push(()=>{cone.follow.dx=8*d.dir;carrot.follow.dx=18*r.dir;carrot.flip=r.dir<0?1:-1});finish(9)
 }
 if(id==='fish'){
  label('Yukon lands something. Beebo would like a second opinion.');const y=enter('yukon',W-114,floor-18,102,-1),d=enter('beebo',-140,floor+4,111,1);
  pose(y,{arm:-28,elbow:-35,head:8});const rod=item('rod',0,0,110),boot=item('boot',W*.43,H+20,46);const line=node('svg',{class:'fishing-line',viewBox:`0 0 ${W} ${H}`}),path=node('path');line.append(path);layer.append(line);let reel=0;
  updates.push(()=>{const grip=hand(y);rod.x=grip.x-90;rod.y=grip.y-104;rod.rotation=12;rod.flip=-1;const tip={x:grip.x-69,y:grip.y-107},bx=boot.x+23,by=boot.y+4;path.setAttribute('d',`M${tip.x} ${tip.y} Q${(tip.x+bx)/2+9} ${(tip.y+by)/2} ${bx} ${by}`)});
  at(2,()=>{pose(y,{arm:-60,head:15});tween(boot,{x:W*.43,y:H-89,rotation:-12},2);after(2.3,()=>{pose(y,{head:-12});move(d,W*.37,floor+1,1.4)})});
  at(6,()=>{line.style.opacity=0;pose(d,{head:16,duck:.15});attach(boot,d,'mouth',14,10);pose(y,{head:14,back:-70});after(1,()=>{move(d,-130,floor,2);pose(y,{back:0,arm:0,elbow:0})})});finish(10)
 }
 if(id==='hats'){
  label('One tiny hat. One very proud Bumble.');film('art/hat-story-v7.png',[[0,0,'hat-in-hand'],[2,1,'placing-hat'],[4.1,2,'hat-on-crown'],[6.2,3,'proud-pose']]);finish(10)
 }
 if(id==='ornament'){
  label('Sam is taking care of the decorations.');const s=makeRig('sam',W*.6,H-116,104,-1),o=item('ornament',W*.35,-60,35);s.exitDir=1;beat('sam-watches');
  at(.9,()=>{const f=face(s);tween(o,{x:W*.43,y:H-43,rotation:-160},1.2);pose(s,{head:-10})});
  at(2.2,()=>{beat('bounce');const f=face(s);tween(o,{x:f.x-18,y:f.y-75,rotation:120},.7);pose(s,{lean:9,head:-12})});
  at(3,()=>{attach(o,s,'mouth',0,-24);pose(s,{lean:0,head:8});beat('caught-on-hat')});
  at(4.8,()=>{pose(s,{arm:-115,head:-8});after(.65,()=>{attach(o,s,'hand',0,0);beat('lifted-off');pose(s,{arm:-55,head:0})})});at(6.9,()=>{beat('sam-carries-it-away');exit(s,1)});finish(8.7)
 }
 if(id==='peek'){
  label('Hermey has found cover. Bumble has overestimated the cover.');const h=enter('hermey',W-62,H*.42,80,-1),b=enter('bumble',-65,H*.67,145,1,2.2);h.e.style.clipPath='inset(0 0 35% 0)';b.e.style.clipPath='inset(0 0 45% 0)';at(1.3,()=>{pose(h,{head:-12,lean:-12});wave(h)});at(3.4,()=>{pose(b,{head:14,lean:12});wave(b)});at(6,()=>{move(h,W+70,H*.42,1);pose(b,{duck:.6,head:-15})});finish(8)
 }
 if(id==='snowman'){
  label('Hermey has built the body. Bumble has overdone the head.');const h=enter('hermey',W*.05,H-157,80,1),b=enter('bumble',W*.69,H-185,125,-1,.5),body=item('snowbody',W*.36,H-130,100),head=item('snowhead',W*.56,H-215,92),pile=item('snowpile',W*.34,H-125,130);pile.alpha=0;head.alpha=0;let wobble=0;
  at(1.7,()=>{beat('headless-body');head.alpha=1;attach(head,b,'hand',-24,-12);pose(b,{arm:-90,head:5});pose(h,{head:6})});
  at(3.3,()=>{beat('oversized-head');detach(head);tween(head,{x:W*.36+4,y:H-188},1);pose(b,{arm:-120});after(1.1,()=>pose(b,{arm:0}))});
  updates.push(()=>{if(wobble){body.rotation=Math.sin(time*12)*wobble;head.rotation=Math.sin(time*12)*wobble}});
  at(5,()=>{beat('wobble');wobble=6;pose(h,{arm:-100,lean:7});after(.8,()=>wobble=12)});
  at(6.6,()=>{beat('collapse');wobble=0;tween(body,{alpha:0,rotation:35},.35);pile.alpha=1;powder(W*.48,H-45,100,0);tween(head,{x:W*.07,y:H-81,rotation:-180},1.5);pose(h,{head:-12,lean:-8,arm:-70});pose(b,{head:15,back:-35});after(.8,()=>{pose(h,{arm:0,lean:0});pose(b,{back:0})})});
  at(8.8,()=>{beat('head-rolls-away');tween(head,{x:-100,rotation:-400},1.3);pose(b,{head:-12});pose(h,{head:8})});finish(11.5)
 }
 if(id==='gift'){
  label('This parcel has paws.');const h=enter('hermey',W*.03,H-157,80,1),r=enter('rudolph',W-110,floor,98,-1,.4),q=parcel(W*.38,H-108,96);h.exitDir=-1;r.exitDir=1;
  const d=makeRig('beebo',q.x-9,H-102,113,1),cone=attach(item('pinecone',0,0,27),d,'mouth',5,5);d.alpha=0;cone.alpha=0;d.e.style.zIndex=2;d.e.style.clipPath='inset(0 0 24% 0)';
  function rock(angle){[q.front,q.lid,q.ribbon].forEach(p=>tween(p,{rotation:angle},.15))}
  [1.2,1.8,2.4].forEach((t,i)=>at(t,()=>{beat('parcel-rocks');rock((i+1)*4);after(.16,()=>rock(-(i+1)*4));after(.36,()=>rock(0));pose(h,{head:8});pose(r,{head:8})}));
  at(3.4,()=>{beat('lid-blasts-off');tween(q.ribbon,{x:-50,y:H-30,rotation:-230,alpha:0},.8);tween(q.lid,{x:W*.66,y:H-235,rotation:155},.65);after(.65,()=>tween(q.lid,{x:W+100,y:H-35,rotation:290,alpha:0},.9));tissue(q.x+48,q.y+20,18);powder(q.x+48,q.y+20,70,0)});
  at(3.6,()=>{beat('beebo-springs-out');remove(q.front);remove(q.mouth);remove(q.ribbon);tissue(q.x+q.size/2,q.y+q.size/2,18);d.alpha=cone.alpha=1;d.e.style.clipPath='none';tween(d,{y:H-235,rotation:-9},.5);pose(d,{walk:1});pose(h,{arm:-70,head:-12,lean:-9});tween(h,{x:2,y:H-178,rotation:-9},.3);after(.4,()=>tween(h,{y:H-157,rotation:0},.35));pose(r,{head:-13,lean:-9});tween(r,{x:W-102,y:floor-17},.3);after(.4,()=>tween(r,{y:floor},.35));after(.6,()=>{beat('beebo-lands');tween(d,{x:W*.35,y:H-121,rotation:0},.65);after(.65,()=>{pose(d,{walk:0,head:-5});powder(W*.49,H-20,66,0)})})});
  at(6.3,()=>{beat('proud-pinecone');pose(h,{arm:0,lean:0,head:7});pose(r,{lean:0,head:4});pose(d,{head:9});tween(q.front,{alpha:0},.7);tween(q.mouth,{alpha:0},.7)});finish(9.5)
 }
 if(id==='nose'){
  label('Rudolph holds still while Bumble toasts a marshmallow.');film('art/nose-story-v8.png',[[0,0,'marshmallow-over-nose'],[2.6,1,'marshmallow-toasts'],[5.3,2,'bumble-withdraws-stick'],[7.3,3,'toasted-marshmallow']]);finish(10.5)
 }
 if(id==='angel'){
  label('The snow angel contest · Bumble has booked considerably more space.');
  const ground=document.createElement('div');ground.className='angel-bed';layer.append(ground);
  const a=document.createElement('div');a.className='angel-duo';layer.append(a);a.style.width=W*.95+'px';a.style.left=W*.025+'px';a.style.top=H-215+'px';
  const art=node('svg',{viewBox:'0 0 1774 887'}),defs=node('defs');art.append(defs);a.append(art);const joints=[],angelScale=.68,smallAngel=node('g',{'data-angel':'hermey',transform:'translate(445 875) scale(.68) translate(-445 -875)'}),bigAngel=node('g',{'data-angel':'bumble',transform:'translate(1285 875) scale(1.08) translate(-1320 -875)'});art.append(smallAngel,bigAngel);
  const pieces=[
   ['260,0 620,0 620,535 510,595 350,595 260,530',0,0,0],
   ['30,215 190,260 350,345 350,435 150,370 0,310',340,365,1],
   ['530,350 680,260 810,210 835,320 690,395 550,435',550,365,-1],
   ['330,520 450,575 285,875 100,835',390,550,-.5],
   ['440,570 550,520 810,815 680,875',495,550,.5],
   ['1110,0 1535,0 1550,550 1490,650 1170,650 1090,550',0,0,0],
   ['880,170 1030,190 1170,300 1160,425 990,365 840,285',1150,345,1],
   ['1470,320 1640,170 1750,180 1774,310 1630,395 1510,440',1500,345,-1],
   ['1180,550 1350,620 1130,875 890,790',1260,590,-.4],
   ['1350,620 1500,550 1730,790 1530,875',1420,590,.4]
  ];pieces.forEach(([points,x,y,sign],index)=>{const key='angel-'+(++serial),clip=node('clipPath',{id:key});clip.append(node('polygon',{points}));defs.append(clip);const g=node('g');g.append(node('image',{href:'art/angels-v4.png',width:1774,height:887,'clip-path':`url(#${key})`}));(index<5?smallAngel:bigAngel).append(g);if(sign)joints.push({g,x,y,sign})});
  let sweep=-1;updates.push(()=>{joints.forEach(j=>j.g.setAttribute('transform',`rotate(${Math.sin(time*2.7)*16*j.sign} ${j.x} ${j.y})`));ground.style.opacity=Math.min(.8,time/7);const beat=Math.floor((time*2.7+Math.PI/2)/Math.PI);if(beat!==sweep&&time>.5){sweep=beat;[[90,290,24],[790,290,24],[180,790,22],[710,790,22],[900,260,39],[1710,260,39],[1000,790,34],[1650,790,34]].forEach(([x,y,size])=>{const small=x<887,px=small?445+(x-445)*angelScale:1285+(x-1320)*1.08,py=small?875+(y-875)*angelScale:875+(y-875)*1.08;powder(W*.025+px/1774*W*.95,H-215+py/1774*W*.95,size*(small?angelScale:1),small?-18:22)})}});
  finish(10)
 }
 if(id==='icicle'){
  label('Three swings. One stubborn icicle.');const y=enter('yukon',W*.55,H-160,110,1),ice=item('icicle',W*.78,H-232,75),pick=attach(item('pickaxe',0,0,86),y,'hand',20,-32);
  layer.dataset.strikes='0';updates.push(()=>{pick.rotation=y.v.arm*.7+45;const theta=pick.rotation*Math.PI/180;pick.follow.dx=35*Math.sin(theta);pick.follow.dy=-35*Math.cos(theta)});
  const frost=plain('frost-shelf',W*.73,H-235,95);frost.e.style.height='16px';
  [1.7,3.1,4.5].forEach((t,i)=>{at(t,()=>{beat('windup-'+(i+1));pose(y,{arm:-150,elbow:-25,head:7,lean:-4})});at(t+.65,()=>{layer.dataset.strikes=String(i+1);beat('strike-'+(i+1));pose(y,{arm:-78,elbow:10,lean:8});burst(W*.81,H-200,9+i*6,.45+i*.12);if(i<2){tween(ice,{rotation:i?5:-4},.12);after(.18,()=>tween(ice,{rotation:0},.25));after(.5,()=>pose(y,{lean:0}))}else{beat('icicle-breaks');tween(ice,{y:H-110,rotation:25},.55);after(.55,()=>{attach(ice,y,'hand',16,-10);pose(y,{arm:-70,elbow:-25,lean:0,head:12});pick.alpha=0;beat('icicle-caught')})}})});
  at(7,()=>{beat('icicle-inspection');pose(y,{head:12,arm:-55,elbow:-15});ice.rotation=12});
  at(8.7,()=>{detach(ice);tween(ice,{x:W*.79,y:H-77,rotation:4},.7);pose(y,{arm:0,elbow:0,head:0});pick.alpha=1});finish(11.5)
 }
 if(id==='clarice'){
  label('Rudolph tries to make an entrance.');const c=enter('clarice',W*.68,floor-5,105,-1),r=enter('rudolph',W*.08,floor,101,1,.6);r.exitDir=-1;c.exitDir=1;const stopX=Math.max(10,W*.68-101-36);
  at(2,()=>{beat('rudolph-skids');pose(r,{walk:1,head:-8});tween(r,{x:stopX,y:floor-12},.9);after(.95,()=>{tween(r,{y:floor,rotation:12},.35);powder(stopX+85,H-27,37,16);pose(r,{walk:0,head:10})})});at(3.8,()=>{beat('clarice-reacts');tween(r,{rotation:0},.5);pose(c,{lean:-6});after(.7,()=>pose(c,{lean:0}))});at(5.5,()=>{pose(r,{head:-8});tween(c,{y:c.y-5},.3);after(.4,()=>tween(c,{y:floor-5},.4))});updates.push(()=>{r.x=Math.min(r.x,W*.68-101-30)});finish(8.5)
 }
 if(id==='donner'){
  label('Donner has collected a decoration.');const d=enter('donner',W*.18,H-168,145,1),c=enter('clarice',W*.62,floor,100,-1,.4),o=attach(item('ornament',0,0,28),d,'mouth',-25,-34);
  at(2,()=>pose(d,{head:-12,lean:5}));at(3.2,()=>{detach(o);tween(o,{x:W*.52,y:H-34,rotation:230},1);pose(c,{head:13});after(1.1,()=>{move(c,W*.47,floor,.8);powder(W*.56,H-28,25,5)})});at(5.5,()=>{tween(o,{x:W+40,rotation:550},1.4);move(c,W+110,floor,2);pose(d,{head:0,lean:0})});finish(9)
 }
 if(id==='misfits'){
  label('Moonracer holds the ribbon. The elephant does the unwrapping.');const k=enter('moonracer',W*.01,H-161,136,1),e=enter('elephant',W*.68,H-115,112,-1,.4),gift=parcel(W*.4,H-90,78),rope=ribbonPath(),toy=plain('toy-train',W*.42,H-88,74);k.exitDir=-1;e.exitDir=1;toy.alpha=0;toy.e.style.zIndex=2;let taut=false;
  const trainImage=document.createElement('img');trainImage.src='art/toy-train-v8.png';trainImage.alt='Christmas toy locomotive';trainImage.style.cssText='width:100%;height:100%;object-fit:contain';toy.e.append(trainImage);
  updates.push(()=>{const f=face(e),paw={x:k.x+108,y:H-30};rope.path.setAttribute('d',`M${paw.x} ${paw.y} Q${W*.44} ${taut?H-64:H-17} ${f.x} ${f.y+10}`)});
  at(1.8,()=>{beat('moonracer-pins-ribbon');pose(k,{lean:6});powder(k.x+108,H-30,22,0)});
  at(3,()=>{beat('elephant-pulls-ribbon');taut=true;pose(e,{lean:-9});tween(e,{x:e.x+12},.8);tween(gift.ribbon,{x:W*.65,y:H-55,rotation:70,alpha:0},.8)});
  at(4.2,()=>{beat('present-unwraps');tween(gift.lid,{x:W*.63,y:H-170,rotation:75},.7);tissue(gift.x+39,gift.y+20,10);after(.8,()=>{tween(gift.lid,{x:W+80,y:H-15,rotation:150,alpha:0},.8);rope.svg.style.opacity=0})});
  at(5.1,()=>{beat('toy-revealed');toy.alpha=1;tween(toy,{y:H-143},.65);tween(gift.front,{alpha:0},.7);tween(gift.mouth,{alpha:0},.7);pose(k,{lean:0,head:8});pose(e,{lean:0});after(.8,()=>tween(toy,{y:H-84},.7))});
  at(7.1,()=>{beat('toy-train-rolls');tween(toy,{x:W*.51},1);pose(k,{head:-5});pose(e,{lean:5});after(1,()=>pose(e,{lean:0}))});finish(10.5)
 }
 if(id==='cocoa'){
  label('Mrs. Claus spots a cocoa moustache.');film('art/cocoa-story-v7.png',[[0,0,'mugs-in-hands'],[2.2,1,'sipping'],[4.7,2,'cocoa-moustache'],[6.9,3,'mrs-claus-points']]);finish(11)
 }
 if(id==='dolly'){
  label('Dolly unwraps a surprise for Santa.');const d=enter('dolly',W*.12,H-127,104,1),s=enter('santa',W*.67,H-163,139,-1,.4),q=parcel(W*.43,H-93,77),c=makeRig('charlie',W*.43-7,H-66,91,1),rope=ribbonPath();d.exitDir=-1;s.exitDir=1;c.alpha=0;c.e.style.zIndex=2;c.e.style.clipPath='inset(0 0 30% 0)';let pulled=0;
  updates.push(()=>{rope.path.setAttribute('d',`M${d.x+70} ${d.y+66} Q${W*.35-pulled*12} ${H-83} ${q.x+38} ${q.y+12}`)});
  at(1.8,()=>{beat('dolly-pulls-ribbon');pulled=1;tween(d,{x:d.x-12,rotation:-6},.6);tween(q.ribbon,{alpha:0},.5)});at(3.2,()=>{openParcel(q);rope.svg.style.opacity=0});
  at(4.8,()=>{beat('charlie-pops-out');c.alpha=1;tween(c,{y:H-160},.3);after(.33,()=>tween(c,{y:H-125},.3));after(.7,()=>tween(c,{y:H-135},.3));tween(s,{x:s.x+10,rotation:10},.35);tween(d,{rotation:7},.3);burst(q.x+38,q.y+15,14,.8)});at(6.5,()=>{beat('santa-recovers');tween(s,{rotation:0},.5);tween(d,{rotation:0},.5);pose(s,{lean:-4})});finish(9.5)
 }
 if(id==='cookies'){label('The cookie delivery has suffered a small loss.');film('art/cookie-story-v8.png',[[0,0,'cookie-delivery'],[2.5,1,'elephant-takes-cookie'],[5,2,'cookie-crumbs'],[7.4,3,'last-cookie-offered-back']]);finish(11.5)}
 if(id==='nap'){label('A well-earned pinecone break.');finish(17)}
 // Continuous scene clock: pausing freezes action and scheduled beats together.
 function tick(t){if(!alive)return;const dt=Math.min(.035,(t-(last||t))/1000);last=t;if(!winterPaused||winterStep){time+=winterStep||dt*winterSpeed;winterStep=0;layer.dataset.elapsed=time.toFixed(2);while(events.length&&events[0].t<=time){const ev=events.shift();ev.fn();if(!alive)return}
  for(let i=tweens.length-1;i>=0;i--){const q=tweens[i];if(time<q.start)continue;const p=clamp((time-q.start)/q.duration),v=q.linear?p:ease(p);for(const k in q.to)q.o[k]=q.from[k]+(q.to[k]-q.from[k])*v;if(p>=1)tweens.splice(i,1)}
  for(const r of cast){for(const k in r.pose)r.v[k]+=(r.pose[k]-r.v[k])*(1-Math.exp(-18*dt*winterSpeed));const v=r.v,walk=Math.sin(time*10+r.x*.015)*v.walk;
   const rot=(key,angle)=>{const j=r.joints[key];if(j)j.g.setAttribute('transform',`rotate(${angle} ${j.origin[0]} ${j.origin[1]})`)};
   rot('arm',v.arm-walk*13);rot('elbow',v.elbow);rot('back',v.back+walk*17);rot('head',v.head+Math.sin(time*1.7)*1.2);rot('leg0',walk*16);rot('leg1',-walk*16);rot('tail',Math.sin(time*4)*5);
   r.body.style.transform=`translateY(${v.duck*22-Math.abs(walk)*2}px) rotate(${v.lean}deg) scaleY(${1-v.duck*.22})`;r.e.style.transform=`translate(${r.x}px,${r.y}px) rotate(${r.rotation}deg) scale(${r.scale})`;r.e.style.opacity=r.alpha;r.e.style.pointerEvents=r.name==='beebo'&&r.alpha>.5?'auto':'none';
  }
  updates.forEach(fn=>fn());
  for(const p of items){if(p.removed)continue;if(p.follow){const q=p.follow.where==='hand'?hand(p.follow.r):face(p.follow.r);p.x=q.x-p.size/2+p.follow.dx;p.y=q.y-p.size/2+p.follow.dy}if(p.fly){const f=p.fly,k=clamp((time-f.born)/f.duration);p.x=f.from.x+(f.to.x-f.from.x)*k-p.size/2;p.y=f.from.y+(f.to.y-f.from.y)*k-4*f.arc*k*(1-k)-p.size/2}p.e.style.transform=`translate(${p.x}px,${p.y}px) rotate(${p.rotation}deg) scale(${p.scale}) scaleX(${p.flip||1})`;p.e.style.opacity=p.alpha}
 }raf=requestAnimationFrame(tick)}raf=requestAnimationFrame(tick);
 fightCleanup=()=>{alive=false;cancelAnimationFrame(raf);events.length=0;tweens.length=0;$('pauseScene').disabled=true;$('stepScene').disabled=true;fightCleanup=null;winterPaused=false;winterStep=0};
}
$('pauseScene').onclick=()=>{winterPaused=!winterPaused;$('pauseScene').textContent=winterPaused?'Resume':'Pause'};
$('speed').onchange=()=>winterSpeed=+$('speed').value;

$('stepScene').onclick=()=>{winterPaused=true;winterStep=1;$('pauseScene').textContent='Resume'};
