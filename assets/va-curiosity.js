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
function mk(cls,home){const b=document.createElement("button");b.type="button";b.className=cls+" clBtn";b.textContent="Curiosity Lab";b.title="3D simulator + visual knowledge check (K)";b.onclick=()=>open();return b}
if(bar)bar.insertBefore(mk("ib"),$("#tlab")||null);
const hero=$("#home .va-hero-actions");if(hero){const b=mk("va-secondary");b.innerHTML="Curiosity Lab <span aria-hidden=\"true\">→</span>";const go=$("#homeGo");hero.insertBefore(b,go?go.nextSibling:hero.firstChild)}
addEventListener("keydown",e=>{if((e.key==="k"||e.key==="K")&&!(e.ctrlKey||e.metaKey||e.altKey||/^(INPUT|TEXTAREA|SELECT)$/.test((e.target||{}).tagName||""))){if(document.body.classList.contains("cl-open"))return;e.preventDefault();open()}});

/* ---------- progress → the atlas (student report, teacher dashboard, home) — works without loading the lab ---------- */
const rd=()=>{try{const o=JSON.parse(localStorage.getItem("va.cl.v1")||"null");return o&&typeof o==="object"?o:null}catch{return null}};
const lvl=xp=>Math.floor((1+Math.sqrt(1+8*Math.max(0,xp)/100))/2);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
/** compact text stored inside the student's report code:  xp.answered.correct.bestStreak~lab:answered:correct,… */
function reportString(){const s=rd();if(!s||(!s.xp&&!s.answered))return"";
 const labs=Object.entries(s.labs||{}).filter(([,r])=>r&&r.answered).map(([id,r])=>`${id}:${r.answered|0}:${r.correct|0}`).join(",");
 return`${s.xp|0}.${s.answered|0}.${s.correct|0}.${s.bestStreak|0}~${labs}`}
/** the teacher's side: old codes (no field) and damaged text both give null */
function parseReport(str){if(typeof str!=="string"||!str||str.length>600)return null;const[h,l=""]=str.split("~"),n=h.split(".");if(n.length!==4)return null;
 const[xp,ans,cor,best]=n.map(x=>Math.min(1e7,Math.max(0,parseInt(x,10)||0))),labs={};
 l.split(",").filter(Boolean).forEach(x=>{const[id,a,c]=x.split(":");if(/^[a-z0-9-]{1,24}$/.test(id||""))labs[id]=[Math.max(0,+a||0),Math.max(0,Math.min(+a||0,+c||0))]});
 return{xp,ans,cor:Math.min(cor,ans),best,labs,lv:lvl(xp)}}
const pct=(c,a)=>a?Math.round(100*c/a):0;
function chips(){const s=rd();if(!s||(!s.xp&&!s.answered))return"";
 return`<span><b>${s.xp|0}</b> Curiosity XP · Lv ${lvl(s.xp|0)}</span>${s.answered?`<span><b>${pct(s.correct|0,s.answered|0)}%</b> lab questions right (${s.answered|0})</span>`:""}`}
function classSummary(list){const w=(list||[]).filter(x=>x&&x.cl);if(!w.length)return"";
 const xp=Math.round(w.reduce((a,x)=>a+x.cl.xp,0)/w.length),an=w.reduce((a,x)=>a+x.cl.ans,0),co=w.reduce((a,x)=>a+x.cl.cor,0);
 return`<span><b>${xp}</b> avg Curiosity XP (${w.length} students)</span>${an?`<span><b>${pct(co,an)}%</b> lab questions right</span>`:""}`}

/* ---------- Home: the button shows the student's level ---------- */
function badge(){const b=$("#home .clBtn.va-secondary");if(!b||b.disabled)return;const s=rd(),x=s&&s.xp|0;
 b.innerHTML=x?`Curiosity Lab · Lv ${lvl(x)} · ${x} XP <span aria-hidden="true">→</span>`:`Curiosity Lab <span aria-hidden="true">→</span>`}
badge();addEventListener("va-cl-progress",badge);addEventListener("storage",e=>{if(e.key==="va.cl.v1")badge()});

/* ---------- Lesson panel: "try it in the lab" on the topics a lab belongs to ---------- */
const LINKS={
 "ch2/ph":["ph","pH Lab","pH प्रयोगशाला","Test Litmus, Phenolphthalein & Universal pH across 0–14 and watch HCl + NaOH neutralise!"],
 "ch2/indicators":["ph","pH Lab","pH प्रयोगशाला","Compare Litmus, Methyl Orange & Phenolphthalein colour shifts across acids and bases."],
 "ch2/neutralisation":["ph","pH Lab","pH प्रयोगशाला","Titrate HCl and NaOH in 3D to reach pH 7 neutral salt + water!"],
 "ch2/salts":["ph","pH Lab","pH प्रयोगशाला","Mix acids and bases to form neutral, acidic or basic salt solutions."],
 "ch2/acidrx":["ph","pH Lab","pH प्रयोगशाला","Explore strong vs weak acids, H⁺ concentration and neutralisation reactions."],
 "ch5/heart":["heart","Heart Lab","हृदय प्रयोगशाला","Watch oxygenated & deoxygenated blood flow through RA, RV, LA & LV and hear lub-dub!"],
 "ch5/heart3d":["heart","Heart Lab","हृदय प्रयोगशाला","Interactive double-circulation simulator with BPM & cardiac output readout."],
 "ch5/xylem":["tissues","Tissues Lab","ऊतक प्रयोगशाला","Watch unidirectional Xylem water flow and bidirectional Phloem transport."],
 "ch8/mendel":["genetics","Genetics Lab","आनुवंशिकता प्रयोगशाला","Cross TT, Tt, and tt pea plants in 3D and verify Mendel's 3:1 & 1:2:1 ratios!"],
 "ch8/dihybrid":["genetics","Genetics Lab","आनुवंशिकता प्रयोगशाला","Explore dominant vs recessive alleles and Punnett square inheritance."],
 "ch8/sex":["genetics","Genetics Lab","आनुवंशिकता प्रयोगशाला","Switch to Human XX × XY mode and test the 50% Boy / 50% Girl probability."],
 "ch8/genetics3d":["genetics","Genetics Lab","आनुवंशिकता प्रयोगशाला","Watch the 3D DNA double helix and live Punnett Square genotypes."],
 "ch9/optics":["lens","Lens Lab","लेंस प्रयोगशाला","Move the object, change f, and see where the image forms."],
 "ch9/power":["lens","Lens Lab","लेंस प्रयोगशाला","See how the focal length decides the power of a lens."],
 "ch10/eye":["eye","Eye Lab","नेत्र प्रयोगशाला","Adjust ciliary power, trigger Myopia/Hypermetropia and correct vision with glasses!"],
 "ch10/eyeparts":["eye","Eye Lab","नेत्र प्रयोगशाला","Trace light from cornea & eye lens onto the retina in real-time 3D."],
 "ch10/eye3d":["eye","Eye Lab","नेत्र प्रयोगशाला","Explore accommodation, near/far points and corrective concave/convex lenses."],
 "ch10/prism":["eye","Eye Lab","नेत्र प्रयोगशाला","Watch white light disperse through the eye & corrective optics in 3D."],
 "ch11/ohm":["ohm","Circuit Lab","परिपथ प्रयोगशाला","Turn the voltage and the resistance, watch the current follow Ohm's law."],
 "ch11/resistance":["ohm","Circuit Lab","परिपथ प्रयोगशाला","Wire R₁ and R₂ in series or parallel and read the meters."],
 "ch11/series":["ohm","Circuit Lab","परिपथ प्रयोगशाला","Wire R₁ and R₂ in series or parallel and read the meters."],
 "ch11/heating":["ohm","Circuit Lab","परिपथ प्रयोगशाला","Watch a resistor heat up as the current grows."],
 "ch12/field":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Place a 3D compass anywhere around a bar magnet or solenoid to trace B-field lines!"],
 "ch12/solenoid":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Increase coil turns N and current I to supercharge the electromagnet B = μ₀nI!"],
 "ch12/magnet":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Flip current direction to swap North and South poles on the solenoid."],
 "ch12/flhr":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Inspect magnetic field vectors B and poles around current-carrying coils."],
 "ch12/motor":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Explore how solenoid current strength builds strong uniform magnetic fields."],
 "ch12/induction":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Change coil turns and current to see magnetic flux density B shift live."],
 "ix1/cell":["cell","Cell Lab","कोशिका प्रयोगशाला","Explore Animal, Plant, and Prokaryotic cells in 3D."],
 "ix1/osmosis":["cell","Cell Lab","कोशिका प्रयोगशाला","Test Hypotonic, Isotonic & Hypertonic solutions and watch H₂O cross!"],
 "ix1/microscope":["cell","Cell Lab","कोशिका प्रयोगशाला","Spotlight organelles and see cell structures in 3D."],
 "ix1/scale":["cell","Cell Lab","कोशिका प्रयोगशाला","Compare cell structures across Animal, Plant & Bacterial cells."],
 "ix2/tissues":["tissues","Tissues Lab","ऊतक प्रयोगशाला","Inspect Parenchyma, Collenchyma, Sclerenchyma, Muscle & Neuron under 3D zoom."],
 "ix2/xylem":["tissues","Tissues Lab","ऊतक प्रयोगशाला","Watch unidirectional Xylem water flow and bidirectional Phloem transport."],
 "ix2/growth":["tissues","Tissues Lab","ऊतक प्रयोगशाला","Compare plant tissue cell walls, living state, and flexibility."],
 "ix2/meristem":["tissues","Tissues Lab","ऊतक प्रयोगशाला","Explore plant tissues under adjustable microscope magnification."],
 "ix5/types":["matter","Matter Lab","पदार्थ प्रयोगशाला","Shine a laser beam through Solution, Colloid & Suspension to test the Tyndall Effect!"],
 "ix5/lab":["matter","Matter Lab","पदार्थ प्रयोगशाला","Compare particle sizes, filtration, and Brownian motion with temperature."],
 "ix5/conc":["matter","Matter Lab","पदार्थ प्रयोगशाला","Explore true solutions vs heterogeneous colloids and suspensions in 3D."],
 "ix6/atom":["atom","Atom Lab","परमाणु प्रयोगशाला","Build elements Z = 1–20 in 3D, fill K, L, M, N Bohr shells and inspect valency!"],
 "ix6/models":["atom","Atom Lab","परमाणु प्रयोगशाला","Add extra neutrons to create isotopes like ¹⁴C and verify mass number A."],
 "ix6/atom3d":["atom","Atom Lab","परमाणु प्रयोगशाला","Watch electrons orbit the nucleus in Bohr shells and spot inert noble gases."],
 "ix9/line":["gravity","Gravity Lab","गुरुत्व प्रयोगशाला","Drop balls in vacuum and read the live velocity–time graph."],
 "ix9/circular":["gravity","Gravity Lab","गुरुत्व प्रयोगशाला","Test gravity g on Moon, Earth, and Jupiter in real time."],
 "ix10/forces":["force","Force Lab","बल प्रयोगशाला","Pull a trolley with different forces and masses: F = m × a."],
 "ix10/trolley":["force","Force Lab","बल प्रयोगशाला","Pull a trolley with different forces and masses: F = m × a."],
 "ix11/energy":["energy","Energy Lab","ऊर्जा प्रयोगशाला","Swing a pendulum and watch PE turn into KE."],
 "ix12/wave":["sound","Sound Lab","ध्वनि प्रयोगशाला","See longitudinal compressions & rarefactions and hear real pitch!"],
 "ix12/source":["sound","Sound Lab","ध्वनि प्रयोगशाला","Pluck a 3D tuning fork and hear frequency and amplitude live."],
 "ix12/echo":["sound","Sound Lab","ध्वनि प्रयोगशाला","Clap toward a cliff wall and test the 0.1 s echo threshold!"]
};
const lcss=document.createElement("style");lcss.textContent=`
#clLink{display:flex;align-items:center;gap:12px;margin:8px 0;padding:10px 12px;border:1px solid var(--bd,var(--line));border-left:4px solid var(--acc,#ffd36b);border-radius:12px;background:var(--glass,rgba(255,255,255,.05));animation:clLinkIn .4s ease both}
#clLink[hidden]{display:none}
#clLink .ic{font-size:1.7em;flex:none}#clLink div{flex:1;min-width:0;line-height:1.3}
#clLink b{display:block;font-size:calc(14.5px*var(--fs,1))}#clLink small{display:block;opacity:.85;font-size:calc(12.5px*var(--fs,1))}#clLink .hi{color:var(--hi,#ffc98a)}
@keyframes clLinkIn{from{opacity:0;transform:translateY(-6px)}}
@media (prefers-reduced-motion:reduce){#clLink{animation:none}}
@media print{#clLink{display:none}}`;document.head.appendChild(lcss);
const card=document.createElement("div");card.id="clLink";card.hidden=true;
card.innerHTML=`<span class="ic" aria-hidden="true">🧪</span><div><b></b><small></small></div><button type="button" class="btn prim">Open lab →</button>`;
const anchor=$("#info");if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(card,anchor.nextSibling);
let shownKey=null;
function syncCard(){const k=window.__atlas&&window.__atlas.key&&window.__atlas.key(),L=LINKS[k];
 if(!L){card.hidden=true;shownKey=null;return}
 if(shownKey===k&&!card.hidden)return;shownKey=k;
 card.querySelector("b").innerHTML=`Try it yourself in the ${esc(L[1])} <span class="hi" lang="hi">· ${esc(L[2])}</span>`;card.querySelector("small").textContent=L[3];
 card.querySelector("button").onclick=()=>open(L[0]);card.hidden=false}
setInterval(syncCard,600);addEventListener("hashchange",()=>setTimeout(syncCard,0));
const ttl=$("#ttl");if(ttl)new MutationObserver(syncCard).observe(ttl,{childList:true,subtree:true,characterData:true});

window.__curiosity={open,load,isOpen:()=>document.body.classList.contains("cl-open"),reportString,parseReport,chips,classSummary,links:LINKS};
})();
