/* Infinite Horizons — projector / classroom presentation mode for the standalone 2D viewers (Class IX & X, all subjects).
   Same behaviour and keys as the in-app 2D layer (assets/va-2d.js). Loaded by every public/2d/<class>/<subject>/viewer.html.
   Needs the page globals DATA (subtopic -> {title,desc,img,marks}) and the #mainImg / #imageWrap / #labels elements. */
(()=>{"use strict";
if(typeof DATA==="undefined"||!document.getElementById("mainImg")||!document.getElementById("imageWrap"))return;
const $=s=>document.querySelector(s),B=document.body;
const LS={get:k=>{try{return localStorage.getItem(k)}catch{return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ---- same rule as the app: a label shows only for the dot you tap; tapping empty image hides it ---- */
const wrap0=$("#imageWrap");
wrap0.addEventListener("click",e=>{if(e.target.closest(".mark"))return;wrap0.querySelectorAll(".mark.active").forEach(m=>m.classList.remove("active"))});
document.addEventListener("click",e=>{const m=e.target.closest(".mark");if(!m)return;wrap0.querySelectorAll(".mark.active").forEach(x=>{if(x!==m)x.classList.remove("active")})});

/* ---- conditions: sub-images of the current picture (public/2d/conditions.js, rendered from the atlas's 3D scenes) ---- */
const GID=(location.pathname.match(/\/2d\/(class\d+\/[a-z]+)\//)||[])[1]||"",CONDS=window.VA_CONDS||{};
/* the in-app id of a standalone picture comes from its image file (images/<name>.webp, or ../../<class>/<subject>/images/<name>.webp), so short sidebar keys and aliases never matter */
const appId=o=>{const m=o&&String(o.img||"").match(/^(?:\.\.\/\.\.\/(class\d+\/[a-z]+)\/)?images\/([^\/]+)\.webp$/);return m?(m[1]||GID)+"/"+m[2]:""};
const condsFor=k=>{const id=appId(ORIG[k]||DATA[k]);return CONDS[id]||CONDS[(window.VA_COND_ALIAS||{})[id]]||[]};
const condSrc=c=>"../../"+c.img,ORIG={};let curCI=-1;
const condView=E=>{const o=ORIG[E.key]||DATA[E.key],c=condsFor(E.key)[E.ci];return{title:o.title+" · "+c.title.en+" — "+c.title.hi,desc:c.desc.en+(c.desc.hi?" · "+c.desc.hi:"")+(c.credit?"  —  "+c.credit:""),img:condSrc(c),marks:c.marks}};
const restoreCond=()=>{Object.keys(ORIG).forEach(k=>{DATA[k]=ORIG[k]});for(const k in ORIG)delete ORIG[k];curCI=-1};
const stripEl=document.createElement("div");stripEl.className="bar";stripEl.id="pvStrip";stripEl.hidden=true;
function paintStrip(){const k=curKey(),cs=k?condsFor(k):[];if(!cs.length){stripEl.hidden=true;stripEl.innerHTML="";return}
 const o=ORIG[k]||DATA[k],all=[{t:"Main picture",h:"मुख्य चित्र",img:o.img},...cs.map(c=>({t:c.title.en,h:c.title.hi,img:condSrc(c)}))];stripEl.hidden=false;
 stripEl.innerHTML=`<div class="pvs-l">Conditions · स्थितियाँ <b>${cs.length}</b></div><div class="pvs">`+all.map((x,i)=>`<button type="button" data-ci="${i-1}" aria-pressed="${i-1===curCI}" title="${esc(x.t)}"><img loading="lazy" alt="" src="${x.img}"><span><b>${esc(x.t)}</b><small lang="hi">${esc(x.h)}</small></span></button>`).join("")+`</div>`}
function applyCond(ci){const k=curKey();if(!k)return;const cs=condsFor(k);if(ci<0||!cs[ci]){if(ORIG[k]){DATA[k]=ORIG[k];delete ORIG[k]}curCI=-1}else{ORIG[k]=ORIG[k]||DATA[k];DATA[k]={...ORIG[k],...condView({key:k,ci})};curCI=ci}
 try{_selOrig(k)}catch{}paintStrip()}
const _selOrig=typeof selectSub==="function"?selectSub:()=>{};
if(typeof selectSub==="function")window.selectSub=function(sub){restoreCond();const r=_selOrig.apply(this,arguments);paintStrip();return r};
stripEl.addEventListener("click",e=>{const b=e.target.closest("button[data-ci]");if(b)applyCond(+b.dataset.ci)});
addEventListener("keydown",e=>{if(pOn||(e.key!=="["&&e.key!=="]")||e.ctrlKey||e.metaKey||e.altKey||/^(INPUT|TEXTAREA|SELECT)$/.test((e.target||{}).tagName||""))return;const k=curKey(),cs=k?condsFor(k):[];if(!cs.length)return;e.preventDefault();applyCond(Math.max(-1,Math.min(cs.length-1,curCI+(e.key==="]"?1:-1))))});

const css=document.createElement("style");css.textContent=`
#pvStrip{flex-direction:column;align-items:flex-start;gap:2px;max-width:min(92vw,900px)}#pvStrip[hidden]{display:none}
#pvStrip .pvs-l{font-size:11.5px;font-weight:700;color:#cfe0ff}#pvStrip .pvs-l b{color:#ffd54f}
#pvStrip .pvs{display:flex;gap:6px;overflow-x:auto;max-width:100%;padding-bottom:4px;scrollbar-width:thin}
#pvStrip button{flex:none;display:flex;gap:7px;align-items:center;text-align:left;border:1px solid rgba(255,255,255,.2);background:rgba(10,16,28,.85);color:#fff;border-radius:9px;padding:3px 9px 3px 3px;cursor:pointer;font:inherit;font-size:11px;max-width:210px}
#pvStrip button img{width:58px;height:33px;object-fit:cover;border-radius:5px;flex:none;background:#0b1424}
#pvStrip button span{display:flex;flex-direction:column;min-width:0}#pvStrip button b{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.15}
#pvStrip button small{color:#8ee0a7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#pvStrip button[aria-pressed="true"]{border-color:#ffd54f;box-shadow:inset 0 0 0 1px #ffd54f}
#pvBtn{white-space:nowrap}
#pv,#pv *{box-sizing:border-box}
#pv{position:fixed;inset:0;z-index:2147483000;display:none;flex-direction:column;gap:10px;padding:58px 18px 76px;background:#000;color:#fff;font-family:system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans","Noto Sans Devanagari",Arial,sans-serif;--ink:#fff;--glass:#0d1626;--bd:rgba(255,255,255,.65);--hi:#9bf0b5;--mk:calc(var(--fs,1) * clamp(34px,3vw,58px))}
#pv.on{display:flex}
#pv.pl{background:#fff;color:#0b1220;--ink:#0b1220;--glass:#fff;--bd:#2b3b58;--hi:#0a6b2d}
body.presenting{overflow:hidden}
#pvT{position:absolute;left:18px;right:18px;top:10px;margin:0;font-size:clamp(18px,2.2vw,38px);line-height:1.2;z-index:2;font-weight:700}
#pvBody{position:relative;flex:1;min-height:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
#pvWrap{position:relative;display:inline-block;line-height:0;border:1px solid rgba(255,255,255,.4);border-radius:12px;overflow:hidden;box-shadow:0 0 0 2px rgba(255,255,255,.25),0 14px 50px rgba(0,0,0,.6);max-width:100%;max-height:100%}
#pv.pl #pvWrap{box-shadow:0 0 0 2px #cfd8e6,0 10px 34px rgba(11,27,58,.3);border-color:#c3cfdf}
#pvZ{position:relative;display:block;transition:transform .4s ease}
#pvImg{display:block}
#pvMsg{text-align:center;font-size:clamp(14px,1.6vw,24px);line-height:1.6;padding:20px;max-width:560px}
.pvm{position:absolute;width:var(--mk);height:var(--mk);margin:calc(var(--mk) / -2) 0 0 calc(var(--mk) / -2);padding:0;border:0;background:transparent;cursor:pointer;line-height:1;z-index:1}
.pvm i{position:absolute;inset:13%;border-radius:50%;background:#ffd54f;color:#0b1220;border:3px solid #0b1220;box-shadow:0 0 0 1.5px rgba(255,255,255,.85),0 1px 6px rgba(0,0,0,.6);font:700 calc(var(--mk) * .34)/calc(var(--mk) * .72) system-ui,sans-serif;font-style:normal;text-align:center;transform:scale(calc(1 / var(--zs,1)));transition:transform .4s ease}
.pvm.on i{background:#fff;box-shadow:0 0 0 3px #ffd54f,0 0 14px #ffd54f}
#pv.mq .pvm:not(.on),#pv.mq.narrow .pvl:not(.on){visibility:hidden}
#pvCall{position:absolute;inset:0;pointer-events:none;z-index:2}
#pvLines{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;overflow:visible}
.pvl{display:flex;gap:.55em;align-items:flex-start;text-align:left;cursor:pointer;background:var(--glass);color:var(--ink);border:2px solid var(--bd);border-radius:.6em;padding:.4em .7em .4em .45em;font:inherit;font-size:calc(var(--fs,1) * clamp(14px,1.4vw,28px));line-height:1.3;box-shadow:0 6px 24px rgba(0,0,0,.45);transition:opacity .15s}
#pvCall .pvl{position:absolute;left:0;top:0;width:max-content;pointer-events:auto}
.pvl .n{flex:none;min-width:1.45em;height:1.45em;border-radius:50%;background:#ffd54f;color:#0b1220;font:700 .8em/1.45em system-ui,sans-serif;text-align:center}
.pvl .en{font-weight:700;display:block}.pvl .hi{display:block;color:var(--hi);font-size:.95em;line-height:1.45}
.pvl.on{border-color:#ffd54f;background:#e8efff;color:#0b1220;box-shadow:0 0 0 2px rgba(255,213,79,.55),0 6px 24px rgba(0,0,0,.45)}
.pvl.on .hi{color:#0a6b2d}
#pv.hassel .pvl:not(.on){opacity:.5}
#pv:not(.pall) #pvCall .pvl:not(.on){visibility:hidden}
#pv.pen .pvl .hi,#pv.pen #pvT .hi{display:none}#pv.phi .pvl .en{display:none}
#pvLegend{display:flex;flex-wrap:wrap;gap:6px;max-height:36%;overflow:auto;justify-content:center;flex:none}
#pvLegend[hidden]{display:none}#pvLegend .pvl{flex:1 1 230px;max-width:calc(50% - 3px)}
#pvDesc{font-size:clamp(14px,1.4vw,26px);line-height:1.4;text-align:center;opacity:1}
#pvBar,#pvLaser,#pvBlank,#pvHelp,#pvToast{display:none}
#pv.on #pvBar{display:flex;position:absolute;left:50%;bottom:12px;transform:translateX(-50%);width:max-content;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center;max-width:calc(100% - 24px);padding:7px 10px;border-radius:14px;background:rgba(10,16,28,.95);border:1px solid rgba(255,255,255,.35);box-shadow:0 8px 30px rgba(0,0,0,.55);z-index:5;transition:opacity .3s}
#pvBar button{border:1px solid rgba(255,255,255,.3);background:#16233a;color:#fff;border-radius:9px;padding:6px 11px;font:600 14px system-ui,sans-serif;cursor:pointer;min-height:38px;min-width:38px}
#pvBar button:hover{background:#25406a}#pvBar button.on{background:#ffd54f;color:#0b1220;border-color:#ffd54f}#pvBar .go{background:#2f6df6;border-color:#2f6df6}#pvBar .x{background:#7f1d1d;border-color:#b91c1c}
#pvBar .sep{width:1px;height:24px;background:rgba(255,255,255,.3)}#pvPos{color:#dbe6f5;font:600 13px system-ui,sans-serif;white-space:nowrap;padding:0 4px}
#pv.vidle #pvBar{opacity:0;pointer-events:none}#pv.vidle{cursor:none}
#pv.laser,#pv.laser *{cursor:none!important}
#pvLaser:not([hidden]){display:block;position:fixed;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;pointer-events:none;z-index:9;background:radial-gradient(circle,#ff2d20 0 26%,rgba(255,45,32,.55) 44%,rgba(255,45,32,0) 72%);box-shadow:0 0 20px 7px rgba(255,45,32,.45)}
#pvBlank:not([hidden]){display:block;position:fixed;inset:0;z-index:8;background:#000}
#pvToast:not([hidden]){display:block;position:absolute;left:50%;top:64px;transform:translateX(-50%);z-index:7;background:rgba(10,16,28,.96);color:#fff;border:1px solid rgba(255,255,255,.4);border-radius:10px;padding:7px 14px;font:600 15px system-ui,sans-serif;pointer-events:none;white-space:nowrap}
#pvHelp:not([hidden]){display:flex;position:absolute;inset:0;z-index:9;align-items:center;justify-content:center;background:rgba(0,0,0,.86);color:#fff}
#pvHelp .box{max-width:min(760px,94%);max-height:92%;overflow:auto;background:#0d1626;border:1px solid rgba(255,255,255,.4);border-radius:14px;padding:16px 20px}
#pvHelp h3{margin:0 0 10px;font-size:18px;color:#ffd54f}#pvHelp dl{display:grid;grid-template-columns:auto 1fr;gap:6px 16px;margin:0;font-size:15px}
#pvHelp dt{font-weight:700;color:#9bf0b5;white-space:nowrap}#pvHelp dd{margin:0}#pvHelp p{margin:12px 0 0;font-size:13px;opacity:.8}
@media (max-width:1100px){#pv{padding-bottom:118px}}
@media (max-width:640px){#pv{padding-top:50px;padding-bottom:150px}#pvBar button{padding:5px 8px;min-height:34px;font-size:13px}}
@media print{#pv{display:none!important}}`;
document.head.appendChild(css);

const pv=document.createElement("div");pv.id="pv";pv.setAttribute("role","dialog");pv.setAttribute("aria-label","Presentation");
pv.innerHTML=`<h2 id="pvT"></h2><div id="pvBody"><div id="pvWrap" hidden><div id="pvZ"><img id="pvImg" alt=""></div></div><div id="pvMsg" hidden></div></div><div id="pvLegend" hidden></div><div id="pvDesc"></div><div id="pvCall"></div><svg id="pvLines" aria-hidden="true"></svg>
<div id="pvBar" role="toolbar" aria-label="Presentation controls"><button data-a="pimg" title="Previous image (PgUp / ↑)">⏮</button><button data-a="prev" title="Back (← / Backspace / right-click)">◀</button><span id="pvPos"></span><button data-a="next" class="go" title="Next label (→ / Space / click)">▶ Next</button><button data-a="nimg" title="Next image (PgDn / ↓)">⏭</button><i class="sep"></i><button data-a="mode" id="pvMode" title="Reveal · Quiz · Show all (A)"></button><button data-a="zoom" id="pvZoomB" title="Zoom into the label (Z)">🔍 Zoom</button><button data-a="laser" id="pvLas" title="Laser pointer (L)">🔴 Laser</button><button data-a="blank" title="Blank the screen (B)">⬛</button><i class="sep"></i><button data-a="lang" id="pvLang" title="Language (E)"></button><button data-a="fm" title="Smaller text (−)">A−</button><button data-a="fp" title="Larger text (+)">A+</button><button data-a="theme" title="Dark / light (T)">🌓</button><button data-a="fs" title="Full screen (F)">⛶</button><button data-a="help" title="Keyboard help (?)">?</button><button data-a="exit" class="x" title="Exit (Esc)">✕ Exit</button></div>
<div id="pvLaser" hidden></div><div id="pvBlank" hidden></div><div id="pvToast" hidden role="status"></div>
<div id="pvHelp" hidden><div class="box"><h3>📽 Presentation keys · प्रस्तुति कुंजियाँ</h3><dl>
<dt>Space · → · click</dt><dd>Next label (after the last one, the next image)</dd><dt>← · Backspace · right-click</dt><dd>Back one label</dd>
<dt>PgDn · ↓ / PgUp · ↑</dt><dd>Next / previous image</dd><dt>1 – 9 · 0</dt><dd>Jump to label n · hide label</dd>
<dt>A</dt><dd>Mode: Reveal (numbered dots) · Quiz (dots hidden) · Show all</dd><dt>Z</dt><dd>Zoom into the selected part</dd>
<dt>L</dt><dd>Laser pointer</dd><dt>B · W</dt><dd>Black / white screen (any key returns)</dd>
<dt>E · T</dt><dd>Language EN+हिं / EN / हिं · Dark / light</dd><dt>+ · −</dt><dd>Bigger / smaller text</dd>
<dt>F · Esc</dt><dd>Full screen · Exit</dd></dl><p>Tap anywhere to continue · कहीं भी टैप करें</p></div></div>`;
document.body.appendChild(pv);
const T=$("#pvT"),body=$("#pvBody"),wrap=$("#pvWrap"),zl=$("#pvZ"),img=$("#pvImg"),msg=$("#pvMsg"),legend=$("#pvLegend"),desc=$("#pvDesc"),call=$("#pvCall"),lines=$("#pvLines"),bar=$("#pvBar"),laser=$("#pvLaser"),blankEl=$("#pvBlank"),toastEl=$("#pvToast"),help=$("#pvHelp");

/* entry button in the page's top bar */
const hud=$("#hud");const btn=document.createElement("button");btn.type="button";btn.id="pvBtn";btn.className="btn";btn.textContent="📽 Present";btn.title="Projector / classroom presentation mode (S)";
const bars=hud?hud.querySelectorAll(".bar"):[];(bars[bars.length-1]||hud||document.body).appendChild(btn);
if(hud)hud.appendChild(stripEl);

const PS=(()=>{try{return JSON.parse(LS.get("va.pres")||"{}")||{}}catch{return{}}})();
let pOn=false,pMode=PS.mode|0,pZoom=false,pLaser=false,pLang=PS.lang|0,pLight=!!PS.light,pFs=+PS.fs||1,pIdle=0,pTo=0,pWL=null,pFsOn=false;
let di=-1,marks=[],sel=-1,wide=true,after=null,tok=0,cur=null;
const savePS=()=>LS.set("va.pres",JSON.stringify({mode:pMode,lang:pLang,light:pLight,fs:pFs}));
const deck=()=>{const ks=[...document.querySelectorAll(".sub[data-sub]")].map(e=>e.dataset.sub).filter(k=>DATA[k]),o=[];(ks.length?ks:Object.keys(DATA)).forEach(k=>{o.push({key:k,ci:-1});condsFor(k).forEach((c,i)=>o.push({key:k,ci:i}))});return o};
const curKey=()=>{try{return typeof state!=="undefined"&&state.sub}catch{return null}};

function toast(s){toastEl.textContent=s;toastEl.hidden=false;clearTimeout(pTo);pTo=setTimeout(()=>{toastEl.hidden=true},1800)}
function posTxt(){const n=deck().length;return `🖼 ${di<0?"–":di+1}/${n}  ·  🏷 ${sel<0?"–":sel+1}/${marks.length}`}

function clearMarks(){marks.forEach(m=>{m.dot.remove();m.lab.remove()});marks=[];sel=-1;pv.classList.remove("hassel");lines.innerHTML=""}
function pick(i){sel=sel===i?-1:i;pv.classList.toggle("hassel",sel>=0);marks.forEach((m,j)=>{m.dot.classList.toggle("on",j===sel);m.lab.classList.toggle("on",j===sel);m.lab.setAttribute("aria-pressed",String(j===sel))});
 if(sel>=0&&!wide)marks[sel].lab.scrollIntoView({block:"nearest"});place();paint()}
function fit(){if(!pOn||wrap.hidden){lines.innerHTML="";legend.hidden=true;return}
 wide=pv.clientWidth>=640;pv.classList.toggle("narrow",!wide);legend.hidden=wide||!marks.length;call.hidden=!wide;const host=wide?call:legend;marks.forEach(m=>{if(m.lab.parentNode!==host)host.appendChild(m.lab)});
 const r=body.getBoundingClientRect(),lw=wide&&marks.length?Math.round(Math.max(190,Math.min(330,r.width*.17))):0,mw=Math.max(120,r.width-2*(lw?lw+34:1)),mh=Math.max(100,r.height-2),nw=img.naturalWidth||16,nh=img.naturalHeight||9,k=Math.min(mw/nw,mh/nh);
 img.style.width=Math.floor(nw*k)+"px";img.style.height=Math.floor(nh*k)+"px";marks.forEach(m=>{m.lab.style.maxWidth=wide?lw+"px":"";if(!wide)m.lab.style.left=m.lab.style.top=""});place()}
function place(){if(!pOn||wrap.hidden||!marks.length){lines.innerHTML="";return}
 const O=pv.getBoundingClientRect(),I=img.getBoundingClientRect(),Wr=wrap.getBoundingClientRect(),R=body.getBoundingClientRect(),top=R.top-O.top,bot=R.bottom-O.top,all=pv.classList.contains("pall");
 marks.forEach(m=>{m.px=I.left-O.left+I.width*m.x/100;m.py=I.top-O.top+I.height*m.y/100});
 if(wide){const by=marks.slice().sort((a,b)=>a.x-b.x);let L=by.filter(m=>m.x<50),Rt=by.filter(m=>m.x>=50);while(L.length-Rt.length>1)Rt.unshift(L.pop());while(Rt.length-L.length>1)L.push(Rt.shift());
  const avail=bot-top;let sc=1;const need=()=>[L,Rt].some(c=>c.reduce((t,m)=>t+m.lab.offsetHeight+6,0)>avail);
  call.style.fontSize="";if(all){for(const f of [1,.9,.8,.7,.6,.5]){call.style.fontSize=f===1?"":f+"em";sc=f;if(!need())break}}
  [[L,"l"],[Rt,"r"]].forEach(([col,sd])=>{col.sort((a,b)=>a.py-b.py);let y=top;col.forEach(m=>{m.sd=sd;m.w=m.lab.offsetWidth;m.h=m.lab.offsetHeight;m.lx=sd==="l"?Wr.left-O.left-28-m.w:Wr.right-O.left+28;m.ly=Math.max(m.py-m.h/2,y);y=m.ly+m.h+6});
   y=bot;for(let i=col.length-1;i>=0;i--){const m=col[i];m.ly=Math.max(top,Math.min(m.ly,y-m.h));y=m.ly-6}
   col.forEach(m=>{m.lab.style.left=Math.round(Math.max(2,m.lx))+"px";m.lab.style.top=Math.round(m.ly)+"px"})})}
 let o="";const sc2=1.8;
 marks.forEach((m,i)=>{const on=i===sel;if(!on&&(!wide||!all))return;const b=m.lab.getBoundingClientRect();let pts;
  if(wide){const x0=(m.sd==="l"?b.right:b.left)-O.left,y0=b.top+b.height/2-O.top,ex=m.sd==="l"?Math.min(x0+16,m.px):Math.max(x0-16,m.px);pts=[[x0,y0],[ex,y0]]}else pts=[[b.left+b.width/2-O.left,b.top-O.top]];
  const q=pts[pts.length-1],dx=m.px-q[0],dy=m.py-q[1],len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len,gap=on?3:11,ex2=m.px-ux*gap,ey2=m.py-uy*gap;pts.push([ex2,ey2]);
  const P=pts.map(p=>p[0].toFixed(1)+","+p[1].toFixed(1)).join(" "),c=on?"#ffd54f":pv.classList.contains("pl")?"#27364f":"#e8eef7",w=(on?2.4:1.2)*sc2,op=on?1:sel>=0?.25:.7;
  o+=`<polyline points="${P}" fill="none" stroke="#0b1220" stroke-width="${w+2.2}" opacity="${op*.6}" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${P}" fill="none" stroke="${c}" stroke-width="${w}" opacity="${op}" stroke-linejoin="round" stroke-linecap="round"/>`;
  if(on){const bx=ex2-ux*12*sc2,by2=ey2-uy*12*sc2;o+=`<polygon points="${ex2.toFixed(1)},${ey2.toFixed(1)} ${(bx-uy*5.5*sc2).toFixed(1)},${(by2+ux*5.5*sc2).toFixed(1)} ${(bx+uy*5.5*sc2).toFixed(1)},${(by2-ux*5.5*sc2).toFixed(1)}" fill="${c}" stroke="#0b1220" stroke-width="1"/>`}});
 lines.setAttribute("viewBox",`0 0 ${O.width} ${O.height}`);lines.innerHTML=o}

function show(i,as){const dk=deck();if(i<0||i>=dk.length)return;di=i;const E=dk[i],key=E.key,d=E.ci>=0?condView(E):(ORIG[key]||DATA[key]);if(!d)return;cur=key+(E.ci>=0?"#"+E.ci:"");after=as==null?null:as;const my=++tok;
 clearMarks();T.innerHTML=esc(d.title||"");desc.textContent=d.desc||"";msg.hidden=true;wrap.hidden=false;wrap.style.opacity=".35";
 const im=new Image();im.onload=()=>{if(my!==tok)return;img.alt=d.title||"";img.src=im.src;
  (d.marks||[]).slice().sort((a,b)=>a.y-b.y||a.x-b.x).forEach((m,k)=>{const n=k+1,dot=document.createElement("button"),lab=document.createElement("button");
   dot.type=lab.type="button";dot.className="pvm";dot.style.left=m.x+"%";dot.style.top=m.y+"%";dot.setAttribute("aria-label",n+". "+m.en+" · "+m.hi);dot.innerHTML=`<i>${n}</i>`;
   lab.className="pvl";lab.setAttribute("aria-pressed","false");lab.innerHTML=`<span class="n">${n}</span><span><span class="en">${esc(m.en)}</span><span class="hi" lang="hi">${esc(m.hi)}</span></span>`;
   dot.onclick=lab.onclick=e=>{e.stopPropagation();pick(k)};zl.appendChild(dot);marks.push({x:m.x,y:m.y,dot,lab})});
  wrap.style.opacity="";fit();if(after!=null){const j=after==="last"?marks.length-1:after;after=null;if(j>=0&&j<marks.length)pick(j)}paint()};
 im.onerror=()=>{if(my!==tok)return;wrap.hidden=true;msg.hidden=false;msg.textContent="Image could not be loaded · चित्र लोड नहीं हुआ ("+d.img+")";paint()};
 im.src=d.img;if(E.ci<0)sync(key);paint()}
function sync(key){try{if(typeof selectSub==="function"&&curKey()!==key)selectSub(key)}catch{}}
function nImg(dir,as){const n=deck().length,i=di+dir;if(i<0||i>=n){toast(i<0?"First image · पहला चित्र":"End of images · चित्र समाप्त");return}show(i,as)}
function step(d){const n=marks.length;if(d>0){if(sel<n-1)pick(sel+1);else nImg(1,null)}else{if(sel>0)pick(sel-1);else if(sel===0)pick(0);else nImg(-1,"last")}}

function zoomApply(){const m=marks[sel],z=pOn&&pZoom&&m;if(z){zl.style.transformOrigin=m.x+"% "+m.y+"%";zl.style.transform="scale(2.4)";zl.style.setProperty("--zs","2.4")}else{zl.style.transform="";zl.style.setProperty("--zs","1")}const t0=performance.now();(function f(){place();if(performance.now()-t0<520)requestAnimationFrame(f)})()}
function paint(){if(!pOn)return;$("#pvPos").textContent=posTxt();$("#pvZoomB").classList.toggle("on",pZoom);$("#pvLas").classList.toggle("on",pLaser);zoomApply()}
function sync2(){pv.classList.toggle("pl",pLight);pv.classList.toggle("pen",pLang===1);pv.classList.toggle("phi",pLang===2);pv.classList.toggle("mq",pMode===1);pv.classList.toggle("pall",pMode===2);pv.classList.toggle("laser",pLaser);pv.style.setProperty("--fs",pFs);
 $("#pvMode").textContent=["👁 Reveal","🙈 Quiz","📋 All"][pMode];$("#pvLang").textContent=["EN+हिं","EN","हिं"][pLang];fit();paint()}
function bump(){pv.classList.remove("vidle");clearTimeout(pIdle);pIdle=setTimeout(()=>{if(pOn&&blankEl.hidden&&help.hidden)pv.classList.add("vidle")},2600)}
const fsNow=()=>!!(document.fullscreenElement||document.webkitFullscreenElement);
function fsOn(){const f=pv.requestFullscreen||pv.webkitRequestFullscreen;if(!f)return;try{const r=f.call(pv);if(r&&r.then)r.then(()=>{pFsOn=true},()=>{});else pFsOn=true}catch{}}
function fsOff(){pFsOn=false;if(fsNow()){try{(document.exitFullscreen||document.webkitExitFullscreen).call(document)}catch{}}}
async function wl(on){try{if(on&&navigator.wakeLock&&!pWL){pWL=await navigator.wakeLock.request("screen");pWL.addEventListener("release",()=>{pWL=null})}else if(!on&&pWL){const w=pWL;pWL=null;await w.release()}}catch{}}
function enter(){if(pOn)return;pOn=true;pv.classList.add("on");B.classList.add("presenting");const dk=deck(),k=curKey(),i=Math.max(0,dk.findIndex(e=>e.key===k&&e.ci===curCI));sync2();show(i);bump();fsOn();wl(true);toast("Space / → next · ← back · ? keys")}
function exit(){if(!pOn)return;pOn=false;pZoom=false;pLaser=false;tok++;pv.classList.remove("on","pl","pen","phi","mq","pall","vidle","laser");B.classList.remove("presenting");zl.style.transform="";clearMarks();blankEl.hidden=laser.hidden=help.hidden=toastEl.hidden=true;fsOff();wl(false)}
const blank=c=>{blankEl.style.background=c;blankEl.hidden=false};
function act(a){switch(a){
 case"next":step(1);break;case"prev":step(-1);break;case"nimg":nImg(1,null);break;case"pimg":nImg(-1,null);break;
 case"mode":pMode=(pMode+1)%3;savePS();sync2();toast(["Reveal — numbered dots, label on step","Quiz — dots hidden until revealed","Show all labels"][pMode]);break;
 case"zoom":pZoom=!pZoom;paint();if(pZoom&&sel<0)toast("Pick a label, then zoom");break;
 case"laser":pLaser=!pLaser;laser.hidden=!pLaser;sync2();break;
 case"blank":blank("#000");break;case"white":blank("#fff");break;
 case"lang":pLang=(pLang+1)%3;savePS();sync2();break;
 case"fp":pFs=Math.min(1.9,+(pFs+.15).toFixed(2));savePS();sync2();break;case"fm":pFs=Math.max(.75,+(pFs-.15).toFixed(2));savePS();sync2();break;
 case"theme":pLight=!pLight;savePS();sync2();break;
 case"fs":if(fsNow())fsOff();else fsOn();break;
 case"help":help.hidden=!help.hidden;break;case"exit":exit();break}}
bar.addEventListener("click",e=>{const b=e.target.closest("button[data-a]");if(b){e.stopPropagation();act(b.dataset.a);b.blur()}});
btn.onclick=enter;
addEventListener("keydown",e=>{const tg=(e.target||{}).tagName||"";
 if(!pOn){if((e.key==="s"||e.key==="S")&&!(e.ctrlKey||e.metaKey||e.altKey||/^(INPUT|TEXTAREA|SELECT)$/.test(tg))){e.preventDefault();enter()}return}
 if(e.ctrlKey||e.metaKey||e.altKey)return;
 e.stopImmediatePropagation();bump();const k=e.key;
 if(!blankEl.hidden){blankEl.hidden=true;e.preventDefault();return}
 if(!help.hidden&&k!=="?"){help.hidden=true;e.preventDefault();return}
 const lk=k.length===1?k.toLowerCase():k;let h=true;
 if(k===" "||k==="ArrowRight"||k==="Enter")act("next");else if(k==="ArrowLeft"||k==="Backspace")act("prev");
 else if(k==="PageDown"||k==="ArrowDown")act("nimg");else if(k==="PageUp"||k==="ArrowUp")act("pimg");
 else if(/^[1-9]$/.test(k)){const i=+k-1;if(i<marks.length&&sel!==i)pick(i)}else if(k==="0"){if(sel>=0)pick(sel)}
 else if(lk==="a")act("mode");else if(lk==="z")act("zoom");else if(lk==="l")act("laser");else if(lk==="b"||k===".")act("blank");else if(lk==="w")act("white");
 else if(lk==="e")act("lang");else if(lk==="t")act("theme");else if(lk==="f")act("fs");else if(k==="+"||k==="=")act("fp");else if(k==="-"||k==="_")act("fm");
 else if(k==="?"||lk==="h")act("help");else if(k==="Escape")exit();else h=false;
 if(h)e.preventDefault()},true);
pv.addEventListener("pointermove",e=>{if(!pOn)return;bump();if(pLaser){laser.style.left=e.clientX+"px";laser.style.top=e.clientY+"px"}});
pv.addEventListener("click",e=>{if(!pOn)return;if(!blankEl.hidden){blankEl.hidden=true;return}if(!help.hidden){help.hidden=true;return}if(e.target.closest("#pvBar,.pvm,.pvl,button"))return;step(1)});
pv.addEventListener("contextmenu",e=>{if(pOn){e.preventDefault();step(-1)}});
let sw=null;pv.addEventListener("touchstart",e=>{if(pOn&&e.touches.length===1)sw=[e.touches[0].clientX,e.touches[0].clientY]},{passive:true});
pv.addEventListener("touchend",e=>{if(!pOn||!sw)return;const t=e.changedTouches[0],dx=t.clientX-sw[0],dy=t.clientY-sw[1];sw=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5){e.preventDefault();step(dx<0?1:-1)}},{passive:false});
document.addEventListener("fullscreenchange",()=>{if(pOn&&pFsOn&&!fsNow()){pFsOn=false;exit()}});
document.addEventListener("visibilitychange",()=>{if(pOn&&document.visibilityState==="visible")wl(true)});
addEventListener("resize",()=>{if(pOn)fit()});if(window.ResizeObserver)new ResizeObserver(()=>{if(pOn)fit()}).observe(body);
paintStrip();
window.__va2dPresent={enter,exit,isPresenting:()=>pOn,current:()=>cur,deck:()=>deck().map(e=>e.key+(e.ci>=0?"#"+e.ci:"")),conds:()=>{const k=curKey();return k?condsFor(k).length:0},applyCond,curCond:()=>curCI,marks:()=>marks.length,index:()=>di,mode:()=>pMode};
})();
