/* Vigyan Atlas — Curiosity Lab launcher.
   Adds a "🧪 Curiosity Lab" button to the stage bar and to Home (key K). Nothing heavy loads until the first tap:
   the lab shell, styles and (later) Three.js are fetched on demand, so the atlas itself starts exactly as fast as before.
   Code lives in assets/curiosity/ (core.js, shell.js, labs/, quiz/); contract and architecture: docs/CURIOSITY_LAB.md. */
(()=>{"use strict";
const $=s=>document.querySelector(s),bar=$("#stagebar");
const base=new URL("curiosity/",(document.currentScript||{}).src||new URL("assets/va-curiosity.js",location.href)).href;
let mod=null,loading=null;
function css(){if($("#clCss"))return;const l=document.createElement("link");l.id="clCss";l.rel="stylesheet";l.href=base+"curiosity.css";document.head.appendChild(l)}
function load(){if(mod)return Promise.resolve(mod);if(!loading){css();loading=import(base+"boot.js").then(m=>(mod=m),e=>{loading=null;throw e})}return loading}
async function open(labId){
  const btns=document.querySelectorAll(".clBtn");btns.forEach(b=>{b.disabled=true;b.dataset.t=b.innerHTML;b.textContent="⏳ …"});
  try{const m=await load();m.open(labId)}
  catch(e){console.error("[curiosity] could not load",e);alert("Curiosity Lab could not load. Check your connection and try again. · क्यूरियॉसिटी लैब लोड नहीं हो सकी।")}
  finally{btns.forEach(b=>{b.disabled=false;if(b.dataset.t)b.innerHTML=b.dataset.t})}}
function mk(cls,home){const b=document.createElement("button");b.type="button";b.className=cls+" clBtn";b.textContent="🧪 Curiosity Lab";b.title="3D simulator + visual knowledge check (K)";b.onclick=()=>open();return b}
if(bar)bar.insertBefore(mk("ib"),$("#tlab")||null);
const hero=$("#home .va-hero-actions");if(hero){const b=mk("va-secondary");b.innerHTML="🧪 Curiosity Lab <span aria-hidden=\"true\">→</span>";const go=$("#homeGo");hero.insertBefore(b,go?go.nextSibling:hero.firstChild)}
addEventListener("keydown",e=>{if((e.key==="k"||e.key==="K")&&!(e.ctrlKey||e.metaKey||e.altKey||/^(INPUT|TEXTAREA|SELECT)$/.test((e.target||{}).tagName||""))){if(document.body.classList.contains("cl-open"))return;e.preventDefault();open()}});
window.__curiosity={open,load,isOpen:()=>document.body.classList.contains("cl-open")};
})();
