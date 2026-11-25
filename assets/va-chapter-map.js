/* Interactive chapter mind map — hierarchical topics → subtopics → contents, cross-topic links,
   and per-topic attachments: source-grounded lesson sections, 2D images, 3D views, simulators and practicals.
   Hand-authored integration lives in DATA (themes, links, lesson/KC mapping, extra images, practical actions);
   everything else is read at runtime from the registry chapter record, window.__va2d.map, window.VA_SIM_CORE.SIMS
   and the chapter lesson module, so the map stays wired to the app's single sources of truth. */
(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;if(root)root.VA_CHAPTER_MAPS=api})(typeof globalThis!=="undefined"?globalThis:this,function(){
"use strict";
const DATA={ix:{ix2:{
  lessonClass:"tissue-lesson",sectionsClass:"tissue-section",
  themes:[
    {id:"org",n:"From cells to tissues",hi:"कोशिका से ऊतक तक",topics:["organisation","tissues"]},
    {id:"plant",n:"Plant tissues",hi:"पादप ऊतक",topics:["meristem","plant-support","xylem","growth"]},
    {id:"animal",n:"Animal tissues",hi:"जंतु ऊतक",topics:["epithelial","connective","muscle-nerve"]},
    {id:"msk",n:"Musculoskeletal system",hi:"अस्थि-पेशी तंत्र",topics:["joint"]}
  ],
  links:[
    ["organisation","tissues","levels of organisation"],
    ["tissues","plant-support","plant branch"],
    ["tissues","epithelial","animal branch"],
    ["meristem","growth","concept to investigation"],
    ["growth","plant-support","growth evidence"],
    ["plant-support","xylem","transport in the plant body"],
    ["epithelial","connective","packing and matrix"],
    ["connective","muscle-nerve","support and movement"],
    ["muscle-nerve","joint","movement at joints"]
  ],
  lesson:{0:["organisation","tissues"],1:["meristem","growth"],2:["plant-support"],3:["xylem"],4:["epithelial","connective"],5:["muscle-nerve"],6:["joint"],7:[]},
  kc:{0:["organisation","tissues"],1:["organisation"],2:["tissues"],3:["plant-support"],4:["meristem","growth"],5:["plant-support","xylem"],6:["epithelial","connective","muscle-nerve"],7:["epithelial","connective","muscle-nerve"],8:["joint"],9:["joint"]},
  images:{"plant-support":["class9/biology/plant_tissues_schematic"],"muscle-nerve":["class9/biology/tissue_muscular","class9/biology/tissue_nervous"],"joint":["class9/biology/musculoskeletal_care"]},
  prac:{topics:["growth"],items:[{act:"lab",n:5,label:"Practical 5 · onion-root slides"},{act:"inquiry",label:"Record root growth & graph"}]}
}}};
const W=w=>typeof window!=="undefined"?window:globalThis;
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cut=(s,n)=>{s=String(s||"");return s.length>n?s.slice(0,n-1)+"…":s};
let host=null,model=null,sel=null,zoom=1,collapsed=new Set();

function has(kp){return !!(DATA.ix&&DATA.ix[kp])}
function harvest(){
  const w=W(),m=(w.__va2d&&w.__va2d.map)||{};
  const sims=(w.VA_SIM_CORE&&w.VA_SIM_CORE.SIMS)||[];
  const lesson=w.VA_TISSUE_CONTENT||null;
  const keys=(w.__atlas&&w.__atlas.keys&&w.__atlas.keys())||null;
  return {map2d:m,sims,lesson,keys};
}
/* Pure structure builder: chapter record + injected runtime sources → the full map model. */
function build(kp,ch,rt){
  const d=DATA.ix&&DATA.ix[kp];
  if(!d||!ch||!Array.isArray(ch.topics)||!ch.topics.length)return null;
  rt=rt||harvest();
  const map2d=rt.map2d||{},sims=rt.sims||[],keys=rt.keys;
  const byId={};
  const topics=ch.topics.map(t=>{
    const key=kp+"/"+t.id;
    const route=Array.isArray(map2d[key])?map2d[key].slice():[];
    const extra=Array.isArray(d.images&&d.images[t.id])?d.images[t.id]:[];
    const images=route.concat(extra.filter(x=>!route.includes(x)));
    const sim=sims.find(s=>s.key===key)||sims.find(s=>s.key&&s.key.indexOf(key+"/")===0)||null;
    const rec={id:t.id,key,title:t.title||t.id,hi:t.hi||"",brief:t.brief||t.ref||"",
      has3d:!!(t.build||t.cx)||(Array.isArray(keys)&&keys.indexOf(key)>=0),
      images,route:map2d[key]?key:null,sim:sim?sim.id:null,lesson:[],kc:[],prac:[]};
    byId[t.id]=rec;return rec;
  });
  Object.keys(d.lesson||{}).forEach(i=>{
    (d.lesson[i]||[]).forEach(id=>{if(byId[id])byId[id].lesson.push(+i)});
  });
  Object.keys(d.kc||{}).forEach(i=>{
    (d.kc[i]||[]).forEach(id=>{if(byId[id])byId[id].kc.push(+i)});
  });
  ((d.prac&&d.prac.topics)||[]).forEach(id=>{if(byId[id])byId[id].prac=(d.prac.items)||[]});
  const themeRecs=(d.themes||[]).map(t=>({id:t.id,n:t.n,hi:t.hi||"",
    topics:(t.topics||[]).map(id=>byId[id]).filter(Boolean)}));
  const links=(d.links||[]).filter(l=>byId[l[0]]&&byId[l[1]]).map(l=>({a:l[0],b:l[1],label:l[2]||""}));
  const kc=(Array.isArray(ch.kc)?ch.kc:[]).map((text,i)=>({i,text,topics:(d.kc&&d.kc[i])||[]}));
  const lesson=((rt.lesson&&rt.lesson.sections)||[]).map((s,i)=>({i,title:s.title||"",hi:s.hi||"",pages:s.pages||"",topics:(d.lesson&&d.lesson[i])||[]}));
  const themeOf={};themeRecs.forEach(t=>t.topics.forEach(p=>themeOf[p.id]=t.id));
  topics.forEach(t=>t.theme=themeOf[t.id]||"");
  const images=topics.reduce((a,t)=>a+t.images.length,0);
  const simsN=topics.filter(t=>t.sim).length;
  return {kp,ch,d,themes:themeRecs,topics,byId,links,kc,lesson,
    stats:{topics:topics.length,links:links.length,images,lessons:lesson.length,sims:simsN,
      kc:kc.length,prac:((d.prac&&d.prac.items)||[]).length}};
}
function themeColor(i){return ["#2f7d6d","#a95132","#4a67a8","#8a5a9e"][i%4]}
function layout(m,collapsedSet){
  const TW=210,TX=236,PW=264,PX=506,RW=152,RX=14,GAP=30,TH=54,PH=54;
  let y=16;const themes=[],topics=[];
  m.themes.forEach((t,ti)=>{
    const hidden=collapsedSet.has(t.id);
    const tps=hidden?[]:t.topics;
    const block=Math.max(1,tps.length)*64;
    themes.push({id:t.id,n:t.n,hi:t.hi,count:t.topics.length,topicIds:tps.map(p=>p.id),x:TX,y:y+block/2-4,w:TW,h:TH,color:themeColor(ti),hidden});
    tps.forEach((p,pi)=>topics.push({p,x:PX,y:y+pi*64+28,w:PW,h:PH,color:themeColor(ti),theme:t.id}));
    y+=block+GAP;
  });
  const H=Math.max(y,120),rootY=H/2-4;
  return {W:PX+PW+150,H,root:{x:RX,y:rootY,w:RW,h:60},themes,topics,RX,RW,TX,TW,PX,PW};
}
function edgePath(x1,y1,x2,y2,bend){
  const mx=(x1+x2)/2;
  return `M${x1} ${y1} C ${mx+(bend||0)} ${y1}, ${mx+(bend||0)} ${y2}, ${x2} ${y2}`;
}
function svgNode(o){
  const aria=esc(`${o.title}${o.hi?", "+o.hi:""}`);
  return `<g class="cm-nd ${o.cls||""}${o.sel?" sel":""}${o.near?" near":""}${o.dim?" dim":""}" ${o.attrs} tabindex="0" role="button" aria-label="${aria}">
<rect x="${o.x}" y="${o.y-o.h/2}" width="${o.w}" height="${o.h}" rx="13"/>
<rect class="cm-stripe" x="${o.x}" y="${o.y-o.h/2}" width="6" height="${o.h}" rx="3" fill="${o.color}"/>
<text class="cm-t" x="${o.x+15}" y="${o.y+(o.sub?-2:5)}">${esc(cut(o.title,32))}</text>
${o.sub?`<text class="cm-s" x="${o.x+15}" y="${o.y+16}">${esc(cut(o.sub,34))}</text>`:""}
${o.badges?`<text class="cm-b" x="${o.x+o.w-11}" y="${o.y-8}" text-anchor="end">${esc(o.badges)}</text>`:""}
${o.meta?`<text class="cm-m" x="${o.x+o.w-11}" y="${o.y+17}" text-anchor="end">${esc(o.meta)}</text>`:""}
</g>`;
}
function canvasHtml(m,L){
  const near=new Set();
  if(sel){
    m.links.forEach(l=>{if(l.a===sel)near.add(l.b);if(l.b===sel)near.add(l.a)});
  }
  let h=`<svg class="cm-svg" viewBox="0 0 ${L.W} ${L.H}" width="${Math.round(L.W*zoom)}" height="${Math.round(L.H*zoom)}" role="img" aria-label="Chapter mind map: ${esc(m.ch.title)}"><title>${esc(m.ch.title)} · chapter mind map</title>`;
  const pos={};L.topics.forEach(p=>{if(p.p&&p.p.id)pos[p.p.id]={x:p.x,y:p.y,w:p.w,h:p.h}});
  h+='<g class="cm-edges">';
  const rootC={x:L.root.x+L.root.w,y:L.root.y+L.root.h/2};
  L.themes.forEach((t,i)=>{
    const col=themeColor(i);
    h+=`<path d="${edgePath(rootC.x,rootC.y,t.x,t.y-t.h/2+6,0)}" stroke="${col}" fill="none" stroke-width="2.4" stroke-opacity=".65"/>`;
    if(!t.hidden)t.topicIds.forEach(id=>{
      const p=pos[id];if(!p)return;
      h+=`<path d="${edgePath(t.x+t.w,t.y,p.x,p.y-p.h/2+6,10)}" stroke="${col}" fill="none" stroke-width="1.8" stroke-opacity=".5"/>`;
    });
  });
  h+='</g><g class="cm-x">';
  m.links.forEach(l=>{
    const a=pos[l.a],b=pos[l.b];if(!a||!b)return;
    const hot=sel&&(l.a===sel||l.b===sel);
    const x1=a.x+a.w,y1=a.y,x2=b.x+b.w,y2=b.y;
    const bend=Math.abs(y1-y2)>140?90:56;
    h+=`<path class="cm-xl${hot?" hot":""}${sel&&!hot?" dim":""}" d="${edgePath(x1,y1,x2,y2,bend)}" fill="none"/>`;
    if(l.label)h+=`<text class="cm-xl-t${hot?" hot":""}${sel&&!hot?" dim":""}" x="${x1+18+bend/2}" y="${(y1+y2)/2}">${esc(l.label)}</text>`;
  });
  h+='</g><g class="cm-nodes">';
  h+=svgNode({x:L.root.x,y:L.root.y+L.root.h/2,w:L.root.w,h:L.root.h,cls:"cm-root",color:"#233e34",
    title:m.ch.title,sub:"Ch "+(m.ch.no||""),attrs:'data-cm-root="1"'});
  L.themes.forEach((t,i)=>{
    const col=themeColor(i);
    h+=svgNode({x:t.x,y:t.y,w:t.w,h:t.h,cls:"cm-th",color:col,title:t.n,sub:t.hi,
      meta:t.count+" topic"+(t.count===1?"":"s")+(t.hidden?" ⊕":" •"),
      attrs:`data-cm-theme="${esc(t.id)}"`,dim:!!sel&&t.topicIds.indexOf(sel)<0});
  });
  L.topics.forEach(p=>{
    const t=p.p,b=[];
    if(t.lesson.length)b.push("📖"+t.lesson.length);
    if(t.images.length)b.push("📷"+t.images.length);
    if(t.has3d)b.push("🎲");
    if(t.sim)b.push("⚗");
    if(t.prac.length)b.push("🧪");
    h+=svgNode({x:p.x,y:p.y,w:p.w,h:p.h,cls:"cm-tp",color:p.color,title:t.title,sub:t.hi,
      badges:b.join(" "),sel:sel===t.id,near:near.has(t.id),dim:!!sel&&sel!==t.id&&!near.has(t.id),
      attrs:`data-cm-topic="${esc(t.id)}"`});
  });
  h+='</g></svg>';
  return h;
}
function actBtn(cls,label,attrs){return `<button type="button" class="cm-a ${cls||""}" ${attrs}>${label}</button>`}
function infoHtml(m){
  if(!sel){
    const d=m.d,prac=(d.prac&&d.prac.items)||[];
    const sim=m.topics.find(t=>t.sim);
    return `<div class="cm-over"><span class="cm-kicker">CHAPTER MAP · अध्याय मानचित्र</span>
<b>${esc(m.ch.title)}${m.ch.hi?" · "+esc(m.ch.hi):""}</b>
<p>Select a topic to open its contents — lesson sections, images, 3D/2D views, simulator and practicals. Dashed links connect related topics.</p>
<div class="cm-actions">
${actBtn("prim","📖 Read source-grounded lesson ("+m.lesson.length+" sections)",'data-cm-act="lessonall"')}
${prac.map(p=>actBtn("",p.act==="lab"?"🧪 "+esc(p.label):"🌱 "+esc(p.label),p.act==="lab"?`data-cm-act="lab" data-cm-n="${p.n}"`:'data-cm-act="inquiry"')).join("")}
${sim?actBtn("","⚗ "+esc((sim.title||"Chapter simulator")),'data-cm-act="sim" data-cm-sim="'+esc(sim.sim)+"\""):""}
</div>
<div class="cm-legend"><span>📖 lesson</span><span>📷 image</span><span>🎲 3D</span><span>⚗ simulator</span><span>🧪 practical</span><span>– – – connected topics</span></div>
<div class="cm-hint">Tip: click a branch title (⊕/•) to fold or unfold its topics.</div></div>`;
  }
  const t=m.byId[sel];if(!t)return "";
  const theme=m.themes.find(x=>x.id===t.theme);
  const connected=m.links.filter(l=>l.a===sel||l.b===sel);
  const acts=[];
  t.lesson.forEach(i=>{const s=m.lesson[i];if(s)acts.push(actBtn("","📖 Lesson §"+(i+1)+" · "+esc(s.title),`data-cm-act="lesson" data-cm-i="${i}"`))});
  t.images.forEach(img=>acts.push(actBtn("","📷 "+esc(img.split("/").pop().replace(/_/g," ")),'data-cm-act="2d" data-cm-key="'+esc(t.key)+'" data-cm-img="'+esc(img)+'"')));
  if(t.has3d)acts.push(actBtn("","🎲 Open 3D view",'data-cm-act="3d" data-cm-key="'+esc(t.key)+'"'));
  if(t.images.length&&!t.route&&t.has3d)acts.push(actBtn("","🖼 Open 2D atlas",'data-cm-act="2d" data-cm-key="'+esc(t.key)+'"'));
  if(t.sim)acts.push(actBtn("","⚗ Open simulator",'data-cm-act="sim" data-cm-sim="'+esc(t.sim)+'"'));
  t.prac.forEach(p=>acts.push(actBtn("",p.act==="lab"?"🧪 "+esc(p.label):"🌱 "+esc(p.label),p.act==="lab"?`data-cm-act="lab" data-cm-n="${p.n}"`:'data-cm-act="inquiry"')));
  const chips=[];
  chips.push(t.images.length?"📷 "+t.images.length+" image"+(t.images.length===1?"":"s"):"");
  chips.push(t.has3d?"🎲 3D":"");
  chips.push(t.sim?"⚗ sim":"");
  chips.push(t.lesson.length?"📖 "+t.lesson.length+" lesson §":"");
  chips.push(t.prac.length?"🧪 practical":"");
  const kcs=t.kc.map(i=>m.kc[i]).filter(Boolean);
  return `<div class="cm-pick"><span class="cm-kicker">${esc((theme?theme.n+" · ":"")+"TOPIC · "+(m.ch.title||"").toUpperCase())}</span>
<b>${esc(t.title)}</b>${t.hi?`<small lang="hi">${esc(t.hi)}</small>`:""}
${t.brief?`<p>${esc(t.brief)}</p>`:""}
<div class="cm-chips">${chips.filter(Boolean).map(c=>`<span>${esc(c)}</span>`).join("")||"<span>text topic</span>"}</div>
<h4>Contents · सामग्री</h4><div class="cm-actions">${acts.join("")||"<small>No attachments yet — this topic still links through the chapter lesson.</small>"}</div>
${kcs.length?`<h4>Syllabus points · पाठ्यक्रम बिंदु</h4><ul class="cm-kc">${kcs.map(k=>`<li>${esc(k.text)}</li>`).join("")}</ul>`:""}
${connected.length?`<h4>Connected topics · जुड़े विषय</h4><div class="cm-actions">${connected.map(l=>{const o=m.byId[l.a===sel?l.b:l.a];return o?actBtn("ghost","↔ "+esc(o.title)+(l.label?" · "+esc(l.label):""),`data-cm-jump="${esc(o.id)}"`):""}).join("")}</div>`:""}
<div class="cm-actions cm-back"><button type="button" class="cm-a" data-cm-back="1">← All topics</button></div></div>`;
}
function bodyHtml(m){
  const L=layout(m,collapsed);
  return `<div class="cm-canvas" id="cmCanvas">${canvasHtml(m,L)}</div><aside class="cm-info" aria-live="polite">${infoHtml(m)}</aside>`;
}
function statsHtml(m){const s=m.stats;
  return `<span>${s.topics} topics</span><span>${s.links} links</span><span>📷 ${s.images}</span><span>📖 ${s.lessons} lesson §</span>${s.sims?`<span>⚗ ${s.sims} sim</span>`:""}`;}
function render(ch){
  if(!ch||!has(ch.kp))return "";
  model=build(ch.kp,ch,null);
  if(!model)return "";
  sel=null;zoom=1;collapsed=new Set();
  const m=model;
  return `<section class="cmap-int" data-cm-chapter="${esc(m.kp)}" aria-label="Interactive chapter mind map">
<header class="cm-head"><div><b>Interactive chapter mind map</b><small>चैप्टर मानचित्र · topics → contents · connected · images &amp; simulators attached</small></div>
<div class="cm-stats">${statsHtml(m)}</div>
<div class="cm-tools">
<button type="button" data-cm-toggle="all">Expand all</button>
<button type="button" data-cm-toggle="none">Fold all</button>
<button type="button" data-cm-zoom="out" aria-label="Zoom out">−</button>
<button type="button" data-cm-zoom="in" aria-label="Zoom in">+</button>
<button type="button" data-cm-zoom="fit">Fit</button>
</div></header>
<div class="cm-body">${bodyHtml(m)}</div></section>`;
}
function paint(){
  if(!host||!model)return;
  const body=host.querySelector(".cm-body");
  if(body)body.innerHTML=bodyHtml(model);
}
function openLesson(i){
  if(!host||!model)return;
  const sec=host.querySelectorAll("."+model.d.sectionsClass)[i];
  if(!sec)return;
  sec.open=true;sec.classList.add("cm-flash");
  sec.scrollIntoView({block:"center",behavior:"smooth"});
  setTimeout(()=>sec.classList.remove("cm-flash"),1800);
}
function openLessonAll(){
  if(!host||!model)return;
  const el=host.querySelector("."+model.d.lessonClass);
  if(el)el.scrollIntoView({block:"start",behavior:"smooth"});
}
function openImage(key,imgId){
  const w=W(),A=w.__atlas;
  if(A&&A.go&&key&&A.key()!==key)A.go(key);
  setTimeout(()=>{
    const v=w.__va2d;if(!v)return;
    if(v.set)v.set("2d");
    if(imgId&&v.show)v.show(imgId);
  },300);
}
function open3d(key){
  const w=W(),A=w.__atlas;
  if(A&&A.go)A.go(key);
  setTimeout(()=>{const v=w.__va2d;if(v&&v.set)v.set("3d")},300);
}
function runAction(el){
  const w=W(),a=el.dataset.cmAct;
  if(a==="lesson")openLesson(+el.dataset.cmI);
  else if(a==="lessonall")openLessonAll();
  else if(a==="2d")openImage(el.dataset.cmKey,el.dataset.cmImg||null);
  else if(a==="3d")open3d(el.dataset.cmKey);
  else if(a==="sim"&&w.__vaSim&&w.__vaSim.open)w.__vaSim.open(el.dataset.cmSim);
  else if(a==="lab"&&typeof openLab==="function")openLab(+el.dataset.cmN);
  else if(a==="inquiry"&&typeof openTissueInquiry==="function")openTissueInquiry();
}
function wire(scope){
  if(!scope||!scope.querySelector)return;
  const root=scope.querySelector(".cmap-int");
  if(!root||root.dataset.cmWired)return;
  root.dataset.cmWired="1";host=root;
  root.addEventListener("click",e=>{
    const zoomBtn=e.target.closest("[data-cm-zoom]");
    if(zoomBtn){const z=zoomBtn.dataset.cmZoom;zoom=z==="in"?Math.min(2,zoom+.2):z==="out"?Math.max(.5,zoom-.2):1;paint();return}
    const tog=e.target.closest("[data-cm-toggle]");
    if(tog){collapsed=tog.dataset.cmToggle==="none"?new Set(model.themes.map(t=>t.id)):new Set();paint();return}
    const th=e.target.closest("[data-cm-theme]");
    if(th){const id=th.dataset.cmTheme;collapsed.has(id)?collapsed.delete(id):collapsed.add(id);paint();return}
    const jump=e.target.closest("[data-cm-jump]");
    if(jump){sel=jump.dataset.cmJump;const r=model.byId[sel];if(r&&r.theme)collapsed.delete(r.theme);paint();return}
    if(e.target.closest("[data-cm-back]")){sel=null;paint();return}
    const act=e.target.closest("[data-cm-act]");
    if(act){runAction(act);return}
    const tp=e.target.closest("[data-cm-topic]");
    if(tp){sel=sel===tp.dataset.cmTopic?null:tp.dataset.cmTopic;if(sel){const r=model.byId[sel];if(r&&r.theme)collapsed.delete(r.theme)}paint()}
  });
  root.addEventListener("keydown",e=>{
    if(e.key!=="Enter"&&e.key!==" ")return;
    const n=e.target.closest("[data-cm-topic],[data-cm-theme]");
    if(n){e.preventDefault();n.dispatchEvent(new MouseEvent("click",{bubbles:true}))}
  });
}
function preview(kp,ch,id){
  if(!ch||!has(kp))return "";
  model=build(kp,ch,null);
  sel=id||null;
  return model?infoHtml(model):"";
}
return Object.freeze({DATA,has,build,render,wire,preview});
});
