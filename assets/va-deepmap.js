/* Deep chapter-wise mind map (centre = chapter, branches = syllabus topics, leaves = sub-points). Data: window.VA_DEEP_MAPS. */
(()=>{"use strict";
const D=window.VA_DEEP_MAPS;if(!D)return;
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const PAL=["#2f7d6d","#a95132","#4a67a8","#8a5a9e","#b08a1f","#2c8aa0","#a14d6c","#5f7f2c","#7a6a52","#c0622d"];
const SCOPE={formative:["Formative only · not in year-end exam","फॉर्मेटिव"],enrichment:["Enrichment · no separate marks","अतिरिक्त"],verify:["Confirm with textbook / teacher","पुष्टि करें"]};
let o,last,cur;
function find(ch){return ch.course==="ix"?D.ix[ch.id]:ch.course==="x"?D.x[ch.no]:null}
function make(){if(o)return o;o=document.createElement("div");o.id="vaDeepMap";o.className="va-dm";o.hidden=true;o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label","Deep chapter mind map");document.body.appendChild(o);
o.addEventListener("click",e=>{const b=e.target.closest("[data-dm]");if(!b)return;const k=b.dataset.dm;if(k==="close")close();else if(k==="all"||k==="none"){o.querySelectorAll(".dm-branch").forEach(d=>d.open=k==="all");draw()}else if(k==="print")window.print()});
o.addEventListener("toggle",draw,true);addEventListener("resize",()=>{if(o&&!o.hidden)draw()});
document.addEventListener("keydown",e=>{if(o&&!o.hidden&&e.key==="Escape"){e.preventDefault();e.stopImmediatePropagation();close()}},true);return o}
function branch(b,i){const c=PAL[i%PAL.length],sc=b.scope&&SCOPE[b.scope];return`<details class="dm-branch" open style="--c:${c}" data-i="${i}"><summary><span class="dm-n">${String(i+1).padStart(2,"0")}</span><b>${esc(b.n)}</b>${sc?`<em class="dm-tag dm-${b.scope}" title="${esc(sc[0])}">${esc(sc[0])}</em>`:""}</summary><ul>${b.i.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details>`}
function open(ch){const m=find(ch);if(!m)return;cur=m;last=document.activeElement;make();const half=Math.ceil(m.branches.length/2),L=m.branches.slice(0,half),R=m.branches.slice(half),pts=m.branches.reduce((a,b)=>a+b.i.length,0);
const extra=[["Learning outcomes",m.outcomes],["Activities",m.activities],["Practicals",m.practicals],["Visual lessons in the app",m.topics],["Source & scope notes",m.flags]].filter(x=>x[1]&&x[1].length);
o.innerHTML=`<header class="dm-head"><div><small>${ch.course==="ix"?"CLASS IX · 2026–27":"CLASS X · 2026–27"} · CHAPTER ${esc(m.no)} · ${esc(m.unit)}</small><h2>${esc(m.title)}</h2>${ch.hi?`<p lang="hi">${esc(ch.hi)}</p>`:""}</div><div class="dm-tools"><span>${m.branches.length} branches · ${pts} points</span><button type="button" data-dm="all">Expand all</button><button type="button" data-dm="none">Collapse all</button><button type="button" data-dm="print">Print</button><button type="button" data-dm="close" aria-label="Close deep map" class="dm-x">×</button></div></header>
<div class="dm-body"><div class="dm-map" id="dmMap"><svg class="dm-svg" id="dmSvg" aria-hidden="true"></svg><div class="dm-col dm-l">${L.map((b,i)=>branch(b,i)).join("")}</div><div class="dm-root"><b>${esc(m.title)}</b><small>Ch ${esc(m.no)}</small></div><div class="dm-col dm-r">${R.map((b,i)=>branch(b,i+half)).join("")}</div></div>
${extra.length?`<div class="dm-extra">${extra.map(([t,a])=>`<section><h3>${t}</h3><ul>${a.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>`).join("")}</div>`:""}
<p class="dm-note">Branches follow the CBSE 2026–27 syllabus items held in this app; sub-points are textbook-standard elaborations and are not a substitute for NCERT/CBSE documents or teacher review.</p></div>`;
o.hidden=false;requestAnimationFrame(()=>{draw();o.querySelector(".dm-x").focus()})}
function draw(){if(!o||o.hidden)return;const map=o.querySelector("#dmMap"),svg=o.querySelector("#dmSvg"),root=o.querySelector(".dm-root");if(!map||!svg)return;const wide=getComputedStyle(map).display==="grid"&&innerWidth>860;svg.innerHTML="";if(!wide)return;const mr=map.getBoundingClientRect(),rr=root.getBoundingClientRect(),rx=rr.left-mr.left+rr.width/2,ry=rr.top-mr.top+rr.height/2;svg.setAttribute("width",mr.width);svg.setAttribute("height",mr.height);let h="";o.querySelectorAll(".dm-branch").forEach(d=>{const r=d.getBoundingClientRect(),left=d.parentElement.classList.contains("dm-l"),sy=r.top-mr.top+22,sx=left?r.right-mr.left:r.left-mr.left,ex=left?rr.left-mr.left:rr.right-mr.left,c=getComputedStyle(d).getPropertyValue("--c");h+=`<path d="M${sx} ${sy} C ${(sx+ex)/2} ${sy}, ${(sx+ex)/2} ${ry}, ${ex} ${ry}" stroke="${c}" fill="none" stroke-width="2.2" stroke-opacity=".55"/>`});svg.innerHTML=h}
function close(){if(!o||o.hidden)return;o.hidden=true;last?.focus?.()}
window.__vaDeepMap={open,close,has:ch=>!!find(ch)};
})();
