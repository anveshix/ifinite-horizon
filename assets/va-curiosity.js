/* Infinite Horizons — Curiosity Lab launcher.
   Adds a "🧪 Curiosity Lab" button to the stage bar and to Home (key K). Nothing heavy loads until the first tap:
   the lab shell, styles and (later) Three.js are fetched on demand, so the atlas itself starts exactly as fast as before.
   Code lives in assets/curiosity/ (core.js, shell.js, labs/, quiz/); contract and architecture: docs/CURIOSITY_LAB.md. */
(()=>{"use strict";
const $=s=>document.querySelector(s),bar=$("#stagebar");
const base=new URL("curiosity/",(document.currentScript||{}).src||new URL("assets/va-curiosity.js",location.href)).href;
let mod=null,loading=null;
function css(){if($("#clCss"))return;const l=document.createElement("link");l.id="clCss";l.rel="stylesheet";l.href=base+"curiosity.css";document.head.appendChild(l)}
function load(){if(mod)return Promise.resolve(mod);if(!loading){css();loading=import(base+"boot.js").then(m=>(mod=m),e=>{loading=null;throw e})}return loading}
async function open(labId,preset){
  const btns=document.querySelectorAll(".clBtn");btns.forEach(b=>{b.disabled=true;b.dataset.t=b.innerHTML;b.textContent="⏳ …"});
  try{const m=await load();m.open(labId,preset)}
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

/* ---------- Lesson panel: "try it in the lab" across ALL 122 topics & 25 chapters ---------- */
const LINKS={
 /* Class X Ch 1: Chemical Reactions & Equations */
 "ch1/displacement":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Drop Zinc, Iron & Copper into salt solutions and watch the Reactivity Series in 3D!",{rxn:2,progress:90}],
 "ch1/balancing":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Balance coefficients and verify Law of Conservation of Mass across atoms!",{rxn:0,sub:"balance"}],
 "ch1/combination":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Combine Mg + O₂ or CaO + H₂O in 3D exothermic synthesis reactions.",{rxn:0,progress:90}],
 "ch1/redox":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Track oxidation & reduction electron shifts live in CuO + H₂ → Cu + H₂O!",{rxn:4,progress:90}],
 "ch1/corrosion":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Inspect rusting of iron, rancidity, and sacrificial galvanisation protection.",{rxn:2,sub:"corrosion"}],
 /* Class X Ch 2: Acids, Bases & Salts */
 "ch2/ph":["ph","pH Lab","pH प्रयोगशाला","Test Litmus, Phenolphthalein & Universal pH across 0–14 and drop Zinc for H₂ fizz!",{pH:2}],
 "ch2/indicators":["ph","pH Lab","pH प्रयोगशाला","Compare Litmus, Turmeric, Universal & Phenolphthalein colour shifts across acids & bases.",{pH:11,indicator:1}],
 "ch2/neutralisation":["ph","pH Lab","pH प्रयोगशाला","Titrate HCl and NaOH in 3D to reach pH 7 neutral salt + water!",{pH:7}],
 "ch2/salts":["ph","pH Lab","pH प्रयोगशाला","Mix acids and bases to form neutral, acidic or basic salt solutions.",{pH:7}],
 "ch2/acidrx":["ph","pH Lab","pH प्रयोगशाला","Drop Zinc metal into strong acid (pH ≤ 4) to watch H₂ gas bubbles rise!",{pH:2,sub:"acidrx"}],
 /* Class X Ch 3: Metals & Non-metals */
 "ch3/ionic":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Inspect Na⁺Cl⁻ ionic crystal lattices, reactivity series & metal displacement.",{rxn:5,progress:90}],
 "ch3/reactivity":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Compare K > Na > Ca > Mg > Al > Zn > Fe > Cu > Ag reactivity in displacement tests!",{rxn:2,sub:"series"}],
 "ch3/extraction":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","See thermite reduction (Fe₂O₃ + Al), roasting, and electrolytic refining.",{rxn:4,sub:"extraction"}],
 "ch3/prevent":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Test galvanisation (Zn coat) and alloying to halt iron corrosion.",{rxn:2,sub:"corrosion"}],
 "ch3/physical":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Compare metallic lustre, malleability, conductivity & reactivity series.",{rxn:5,progress:90}],
 /* Class X Ch 4: Carbon & its Compounds */
 "ch4/molecules":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Rotate 3D Methane, Ethanol, Acetic Acid, Diamond, Graphite & Soap Micelles!",{mol:1}],
 "ch4/covalent":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","See shared covalent electron pairs in CH₄, H₂O, CO₂ & N₂ triple bonds.",{mol:1}],
 "ch4/allotropes":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Compare 3D tetrahedral Diamond (insulator) vs hexagonal Graphite (conductor) vs C₆₀!",{mol:5}],
 "ch4/homologous":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Step through alkanes/alcohols differing by −CH₂− (14 u) in a homologous series.",{sub:"homologous"}],
 "ch4/ethanol":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Inspect 3D Ethanol (CH₃CH₂OH) oxidation, esterification & dehydration.",{mol:3}],
 "ch4/micelle":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Watch amphiphilic soap micelles trap grease in their hydrophobic tails!",{mol:7}],
 "ch4/reactions":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Explore combustion, oxidation, addition (H₂/Ni) & substitution of carbon compounds.",{mol:3,sub:"creactions"}],
 /* Class X Ch 5: Life Processes */
 "ch5/heart":["heart","Heart Lab","हृदय प्रयोगशाला","Watch O₂-rich & CO₂-rich blood flow through RA, RV, LA & LV and hear lub-dub!",{bpm:72,loop:0}],
 "ch5/heart3d":["heart","Heart Lab","हृदय प्रयोगशाला","Interactive double-circulation simulator with BPM & cardiac output readout.",{bpm:72,loop:0}],
 "ch5/alveoli":["heart","Heart Lab","हृदय प्रयोगशाला","Switch to Alveoli mode to see O₂/CO₂ gas exchange across lung capillaries!",{sub:"alveoli"}],
 "ch5/lungs3d":["heart","Heart Lab","हृदय प्रयोगशाला","Explore 3D Alveoli air sacs and pulmonary blood oxygenation.",{sub:"alveoli"}],
 "ch5/nephron":["heart","Heart Lab","हृदय प्रयोगशाला","Switch to Nephron mode to trace ultrafiltration & selective reabsorption!",{sub:"nephron"}],
 "ch5/nephron3d":["heart","Heart Lab","हृदय प्रयोगशाला","Inspect Bowman's capsule, glomerulus & tubule in 3D nephron view.",{sub:"nephron"}],
 "ch5/dialysis3d":["heart","Heart Lab","हृदय प्रयोगशाला","See how kidney filtration & artificial dialysis clear urea from blood.",{sub:"dialysis"}],
 "ch5/digestion":["organs","Organs 3D Lab","अंग 3D प्रयोगशाला","Explode the human digestive tract in 3D: Amylase, HCl/Pepsin, Bile & Villi!",{mode:0}],
 "ch5/digest3d":["organs","Organs 3D Lab","अंग 3D प्रयोगशाला","Interactive 3D exploded view of Stomach, Liver, Pancreas & Small Intestine.",{mode:1}],
 "ch5/xylem":["tissues","Tissues Lab","ऊतक प्रयोगशाला","Watch unidirectional Xylem water flow and bidirectional Phloem transport.",{tissue:3,transp:4}],
 "ch5/xylem3d":["tissues","Tissues Lab","ऊतक प्रयोगशाला","Explore lignified xylem, phloem sieve plates & guard-cell transpiration in 3D!",{tissue:3,transp:4}],
 /* Class X Ch 6: Control & Coordination */
 "ch6/neuron":["nervous","Nervous 3D Lab","तंत्रिका 3D प्रयोगशाला","Fire an action potential along a 3D myelinated neuron & cross the synapse!",{mode:0}],
 "ch6/neuron3d":["nervous","Nervous 3D Lab","तंत्रिका 3D प्रयोगशाला","Explore Dendrite → Soma → Axon → Synapse neurotransmitter release in 3D.",{mode:0}],
 "ch6/synapse":["nervous","Nervous 3D Lab","तंत्रिका 3D प्रयोगशाला","Watch electrical impulses convert into chemical neurotransmitters at the synaptic cleft!",{mode:0}],
 "ch6/reflex":["nervous","Nervous 3D Lab","तंत्रिका 3D प्रयोगशाला","Trigger a hot-flame stimulus and race the spinal Reflex Arc in milliseconds!",{mode:1}],
 "ch6/brain":["nervous","Nervous 3D Lab","तंत्रिका 3D प्रयोगशाला","Inspect Forebrain (thinking), Midbrain, Cerebellum (balance) & Medulla in 3D!",{mode:2}],
 "ch6/brain3d":["nervous","Nervous 3D Lab","तंत्रिका 3D प्रयोगशाला","Explore cerebral lobes, corpus callosum, cerebellum & brainstem in 3D!",{mode:2}],
 "ch6/plants":["nervous","Nervous 3D Lab","तंत्रिका 3D प्रयोगशाला","Rotate the sunlight to watch Auxin migrate and bend the plant shoot (Phototropism)!",{mode:3}],
 "ch6/plants3d":["nervous","Nervous 3D Lab","तंत्रिका 3D प्रयोगशाला","Compare Phototropism, Geotropism & Mimosa thigmonasty in 3D!",{mode:3}],
 "ch6/hormones":["nervous","Nervous 3D Lab","तंत्रिका 3D प्रयोगशाला","Compare Adrenaline, Insulin, Thyroxine & Pituitary endocrine feedback in 3D!",{sub:"hormones"}],
 "ch6/hormones3d":["nervous","Nervous 3D Lab","तंत्रिका 3D प्रयोगशाला","Trigger Adrenaline surges, Insulin feedback & Goitre in 3D!",{sub:"hormones"}],
 /* Class X Ch 7: How do Organisms Reproduce? */
 "ch7/flower":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Dissect a 3D flower and grow the pollen tube down into the ovule!",{mode:0}],
 "ch7/flower3d":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Rotate 3D sepals, petals, stamen & carpel to trace pollination & fertilisation.",{mode:0}],
 "ch7/fission":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Multiply Amoeba across 4 generations via Binary Fission (2ⁿ clones)!",{mode:1}],
 "ch7/budding":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Grow a tiny Hydra bud in 3D until it detaches as a new individual.",{mode:2}],
 "ch7/vegetative":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Grow Bryophyllum leaf-margin buds & clonal plants in 3D!",{sub:"vegetative"}],
 "ch7/human":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Watch Sperm + Ovum fertilisation, Zygote cleavage & Placenta in 3D!",{sub:"human"}],
 "ch7/human3d":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Explore gamete fusion, embryo implantation & placenta exchange in 3D.",{sub:"human"}],
 /* Class X Ch 8: Heredity */
 "ch8/mendel":["genetics","Genetics Lab","आनुवंशिकता प्रयोगशाला","Cross TT, Tt, and tt pea plants in 3D and verify Mendel's 3:1 & 1:2:1 ratios!",{cross:0,p1:1,p2:1}],
 "ch8/dihybrid":["genetics","Genetics Lab","आनुवंशिकता प्रयोगशाला","Explore the 4×4 Dihybrid Cross (RrYy × RrYy → 9:3:3:1) in 3D!",{sub:"dihybrid"}],
 "ch8/sex":["genetics","Genetics Lab","आनुवंशिकता प्रयोगशाला","Switch to Human XX × XY mode and test the 50% Boy / 50% Girl probability.",{cross:1}],
 "ch8/genetics3d":["genetics","Genetics Lab","आनुवंशिकता प्रयोगशाला","Watch the 3D DNA double helix and live Punnett Square genotypes.",{cross:0}],
 "ch8/evolution":["genetics","Genetics Lab","आनुवंशिकता प्रयोगशाला","Tap Evolution & Fossils to compare Homologous vs Analogous organs!",{sub:"evolution"}],
 "ch8/evolution3d":["genetics","Genetics Lab","आनुवंशिकता प्रयोगशाला","Compare fossil strata, homologous limbs & natural selection in 3D!",{sub:"evolution"}],
 /* Class X Ch 9: Light — Reflection & Refraction */
 "ch9/optics":["lens","Lens Lab","लेंस प्रयोगशाला","Move the object, change f, and see where the image forms.",{type:1}],
 "ch9/power":["lens","Lens Lab","लेंस प्रयोगशाला","See how the focal length decides the power P = 1/f of a lens.",{type:1,f:10}],
 "ch9/slab":["lens","Lens Lab","लेंस प्रयोगशाला","Toggle Glass Slab mode to bend light via Snell's Law (n₁ sin i = n₂ sin r)!",{sub:"slab"}],
 "ch9/reflection":["lens","Lens Lab","लेंस प्रयोगशाला","Trace real & virtual rays across spherical mirrors with live focal metrics.",{sub:"mirror"}],
 /* Class X Ch 10: The Human Eye & Colourful World */
 "ch10/eye":["eye","Eye Lab","नेत्र प्रयोगशाला","Adjust ciliary power, trigger Myopia/Hypermetropia and correct vision with glasses!",{defect:0}],
 "ch10/eyeparts":["eye","Eye Lab","नेत्र प्रयोगशाला","Trace light from cornea & eye lens onto the retina in real-time 3D.",{defect:0}],
 "ch10/eye3d":["eye","Eye Lab","नेत्र प्रयोगशाला","Explore accommodation, near/far points and corrective concave/convex lenses.",{defect:1}],
 "ch10/prism":["eye","Eye Lab","नेत्र प्रयोगशाला","Watch white light disperse through a 3D glass prism into VIBGYOR!",{viewMode:1}],
 "ch10/scatter":["eye","Eye Lab","नेत्र प्रयोगशाला","Toggle Blue Sky / Sunset mode to see λ⁻⁴ Rayleigh scattering live!",{sub:"sky"}],
 /* Class X Ch 11: Electricity */
 "ch11/ohm":["ohm","Circuit Lab","परिपथ प्रयोगशाला","Turn voltage and resistance, watch electrons flow and test the 6.5 A safety fuse!",{mode:0}],
 "ch11/resistance":["ohm","Circuit Lab","परिपथ प्रयोगशाला","Wire R₁ and R₂ in series or parallel and read the meters.",{mode:1}],
 "ch11/series":["ohm","Circuit Lab","परिपथ प्रयोगशाला","Compare Series (R₁+R₂) vs Parallel (R₁‖R₂) current & voltage division.",{mode:2}],
 "ch11/heating":["ohm","Circuit Lab","परिपथ प्रयोगशाला","Watch Joule heating I²Rt glow and trip the 6.5 A safety fuse!",{V:12,R1:2,mode:0}],
 /* Class X Ch 12: Magnetic Effects of Electric Current */
 "ch12/field":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Place a 3D compass around a bar magnet or solenoid to trace B-field lines!",{I:3}],
 "ch12/solenoid":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Increase coil turns N and current I to supercharge the electromagnet B ∝ nI!",{I:4,N:12}],
 "ch12/magnet":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Flip current direction to swap North and South poles on the solenoid.",{dir:-1}],
 "ch12/flhr":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Inspect Fleming's Left-Hand Rule motor force F = BIL on the 3D spinning armature!",{I:3,sub:"flhr"}],
 "ch12/motor":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Spin the 3D DC Electric Motor with split-ring commutator and reverse current!",{I:4,sub:"motor"}],
 "ch12/induction":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Move the magnet to deflect Faraday's galvanometer needle live!",{speed:3}],
 "ch12/domestic":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Toggle 220V Domestic AC mode to see Live/Neutral/Earth wires & MCB trip!",{sub:"domestic"}],
 /* Class X Ch 13: Our Environment */
 "ch13/pyramid":["ecology","Ecology 3D Lab","पारिस्थितिकी प्रयोगशाला","Explore the 3D 10% Energy Pyramid from T₁ Producers to T₄ Top Carnivores!",{producerE:10000}],
 "ch13/ecosystem3d":["ecology","Ecology 3D Lab","पारिस्थितिकी प्रयोगशाला","Explore 10% Energy Pyramid, DDT biomagnification & Ozone O₃ shield in 3D!",{producerE:10000}],
 "ch13/web":["ecology","Ecology 3D Lab","पारिस्थितिकी प्रयोगशाला","See DDT biomagnification concentrate 1000× up the aquatic food web!",{ddt:8}],
 "ch13/ozone":["ecology","Ecology 3D Lab","पारिस्थितिकी प्रयोगशाला","Test CFC depletion of the Stratospheric Ozone (O₃) UV-B shield!",{ozonePct:35}],
 "ch13/waste":["ecology","Ecology 3D Lab","पारिस्थितिकी प्रयोगशाला","Compare biodegradable nutrient recycling vs non-biodegradable biomagnification.",{ddt:6}],
 /* Class IX Ch 1: The Fundamental Unit of Life */
 "ix1/cell":["cell","Cell Lab","कोशिका प्रयोगशाला","Explore Animal, Plant, and Prokaryotic cells in 3D.",{cellType:0}],
 "ix1/cell3d":["cell","Cell Lab","कोशिका प्रयोगशाला","Rotate 3D organelles, spotlight Mitochondria/Nucleus & toggle Mitosis/Meiosis!",{cellType:0}],
 "ix1/plant3d":["cell","Cell Lab","कोशिका प्रयोगशाला","Inspect the Plant Cell Wall, Chloroplasts & Central Vacuole in 3D.",{cellType:1}],
 "ix1/bacterium3d":["cell","Cell Lab","कोशिका प्रयोगशाला","Inspect a Prokaryote (Bacterium) with its membrane-free Nucleoid in 3D.",{cellType:2}],
 "ix1/osmosis":["cell","Cell Lab","कोशिका प्रयोगशाला","Test Hypotonic, Isotonic & Hypertonic solutions and watch H₂O cross!",{cellType:1,tonicity:-1}],
 "ix1/division":["cell","Cell Lab","कोशिका प्रयोगशाला","Toggle Mitosis (2n→2×2n) vs Meiosis (2n→4×n) division right in the 3D Cell Lab!",{sub:"division"}],
 "ix1/division3d":["cell","Cell Lab","कोशिका प्रयोगशाला","Compare Mitosis growth divisions vs Meiosis gamete formation in 3D.",{sub:"division"}],
 "ix1/microscope":["cell","Cell Lab","कोशिका प्रयोगशाला","Spotlight organelles and see cell structures in 3D.",{cellType:1}],
 "ix1/scale":["cell","Cell Lab","कोशिका प्रयोगशाला","Compare cell structures across Animal, Plant & Bacterial cells.",{cellType:2}],
 /* Class IX Ch 2: Tissues & Human Joints */
 "ix2/tissues":["tissues","Tissues Lab","ऊतक प्रयोगशाला","Inspect Parenchyma, Collenchyma, Sclerenchyma, Muscle & Neuron under 3D zoom.",{tissue:0}],
 "ix2/xylem":["tissues","Tissues Lab","ऊतक प्रयोगशाला","Watch unidirectional Xylem water flow and bidirectional Phloem transport.",{tissue:3,transp:4}],
 "ix2/growth":["tissues","Tissues Lab","ऊतक प्रयोगशाला","Compare Onion Root Tip intact Jar A vs tip-cut Jar B apical meristem growth!",{sub:"meristem"}],
 "ix2/meristem":["tissues","Tissues Lab","ऊतक प्रयोगशाला","Explore apical meristem root-tip growth vs permanent tissues in 3D.",{sub:"meristem"}],
 "ix2/joint":["organs","Organs 3D Lab","अंग 3D प्रयोगशाला","Flex the 3D Ball-and-Socket vs Hinge Joint and inspect Cartilage & Ligaments!",{mode:3}],
 "ix2/joint3d":["organs","Organs 3D Lab","अंग 3D प्रयोगशाला","Bend & rotate human bone joints, tendons, and ligaments in real-time 3D.",{mode:3}],
 /* Class IX Ch 3: Reproduction & Continuity */
 "ix3/fission":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Watch Amoeba divide by Binary Fission across 4 exponential generations!",{mode:1}],
 "ix3/budding":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Grow a Hydra bud in 3D until it detaches as a clone.",{mode:2}],
 "ix3/vegetative":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Grow Bryophyllum leaf-margin buds & clonal plants in 3D!",{sub:"vegetative"}],
 "ix3/flower":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Dissect sepals, petals, stamen & carpel and trace pollen-tube fertilisation!",{mode:0}],
 "ix3/human":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Watch Sperm + Ovum fertilisation, Zygote cleavage & Placenta in 3D!",{sub:"human"}],
 "ix3/dispersal":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Watch winged seeds disperse away from the parent plant in 3D!",{mode:3}],
 /* Class IX Ch 4: Diversity in Living Organisms */
 "ix4/kingdoms":["ecology","Ecology 3D Lab","पारिस्थितिकी प्रयोगशाला","Review Whittaker's 5 Kingdoms (Monera, Protista, Fungi, Plantae, Animalia) in 3D!",{sub:"kingdoms"}],
 "ix4/acellular":["ecology","Ecology 3D Lab","पारिस्थितिकी प्रयोगशाला","Inspect the 3D Bacteriophage Virus outside Whittaker's 5 Kingdoms!",{sub:"virus"}],
 /* Class IX Ch 5: Matter & Mixtures */
 "ix5/types":["matter","Matter Lab","पदार्थ प्रयोगशाला","Shine a laser beam through Solution, Colloid & Suspension to test the Tyndall Effect!",{mix:1}],
 "ix5/lab":["matter","Matter Lab","पदार्थ प्रयोगशाला","Watch thermal convection currents & Brownian motion from −10 °C to 110 °C!",{temp:65}],
 "ix5/conc":["matter","Matter Lab","पदार्थ प्रयोगशाला","Compute mass-by-mass % concentration and compare particle sizes in 3D.",{mix:0,sub:"conc"}],
 /* Class IX Ch 6: Atomic Structure */
 "ix6/atom":["atom","Atom Lab","परमाणु प्रयोगशाला","Build elements Z = 1–20 in 3D, fill K, L, M, N Bohr shells and inspect valency!",{Z:6}],
 "ix6/models":["atom","Atom Lab","परमाणु प्रयोगशाला","Fire α-particles at Gold Foil (Rutherford 1911) and test Bohr shells & isotopes!",{sub:"rutherford"}],
 "ix6/atom3d":["atom","Atom Lab","परमाणु प्रयोगशाला","Watch electrons orbit the nucleus in Bohr shells and spot inert noble gases.",{Z:10}],
 /* Class IX Ch 7: Molecules & Chemical Bonding */
 "ix7/conserve":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Verify constant atomic composition & molar mass across 3D molecules!",{mol:0,count:2}],
 "ix7/molecules":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Explore 3D H₂O, CO₂, CH₄, Diamond, Graphite & crystal structures!",{mol:0}],
 "ix7/ionic":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Compare electrostatic 3D Na⁺Cl⁻ ionic crystal lattices vs covalent molecules.",{mol:4}],
 "ix7/covalent":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Inspect 3D tetrahedral CH₄ and shared covalent bonds.",{mol:1}],
 /* Class IX Ch 8: Earth Systems, Breeze & Cycles */
 "ix8/breeze":["climate","Earth & Breeze Lab","पृथ्वी व समीर प्रयोगशाला","Watch fluid convection currents reverse between Day Sea Breeze & Night Land Breeze!",{mode:0,sun:85}],
 "ix8/heating":["climate","Earth & Breeze Lab","पृथ्वी व समीर प्रयोगशाला","Adjust CO₂ concentration and observe Greenhouse infrared heat trapping!",{mode:0,co2:680}],
 "ix8/spheres":["climate","Earth & Breeze Lab","पृथ्वी व समीर प्रयोगशाला","Explore 3D Troposphere weather & Stratospheric Ozone (O₃) protection.",{mode:1}],
 "ix8/spectrum":["climate","Earth & Breeze Lab","पृथ्वी व समीर प्रयोगशाला","Inspect the 3D oscillating Electromagnetic Spectrum from Gamma to Radio waves.",{mode:2}],
 "ix8/cycles":["climate","Earth & Breeze Lab","पृथ्वी व समीर प्रयोगशाला","Trace Carbon, Water & Nitrogen fixation (Rhizobium) biogeochemical cycles in 3D!",{mode:3}],
 /* Class IX Ch 9: Motion & Gravitation */
 "ix9/line":["gravity","Gravity Lab","गुरुत्व प्रयोगशाला","Drop balls in vacuum with cannon-es bounce and read the live velocity–time graph.",{planet:0}],
 "ix9/circular":["gravity","Gravity Lab","गुरुत्व प्रयोगशाला","Watch 3D Satellite Circular Orbit & centripetal force F_c = mv²/r around planets!",{sub:"orbit"}],
 /* Class IX Ch 10: Force & Laws of Motion */
 "ix10/forces":["force","Force Lab","बल प्रयोगशाला","Push crates with cannon-es 3D collisions and test Momentum Conservation!",{sub:"collision"}],
 "ix10/trolley":["force","Force Lab","बल प्रयोगशाला","Pull a trolley with different forces and masses: F = m × a.",{F:8,m:4}],
 /* Class IX Ch 11: Work, Energy & Power */
 "ix11/energy":["energy","Energy Lab","ऊर्जा प्रयोगशाला","Swing a pendulum, view θ–ω Phase Space, strike the Work puck, and track PE ↔ KE.",{h:0.6}],
 "ix11/machines":["energy","Energy Lab","ऊर्जा प्रयोगशाला","Explore 3D Class-1 Levers & Mechanical Advantage (MA = Effort Arm / Load Arm)!",{sub:"lever"}],
 /* Class IX Ch 12: Sound */
 "ix12/wave":["sound","Sound Lab","ध्वनि प्रयोगशाला","See longitudinal compressions & rarefactions and hear real pitch!",{f:440}],
 "ix12/source":["sound","Sound Lab","ध्वनि प्रयोगशाला","Pluck a 3D tuning fork and hear frequency and amplitude live.",{f:512}],
 "ix12/echo":["sound","Sound Lab","ध्वनि प्रयोगशाला","Clap toward a cliff wall and test the 0.1 s echo threshold!",{dist:34}],
 /* 2025-26 Track */
 "ix25_1/states":["matter","Matter Lab","पदार्थ प्रयोगशाला","Heat & cool water from −10 °C ice to 110 °C steam and watch convection!",{temp:60}],
 "ix25_1/diffusion":["matter","Matter Lab","पदार्थ प्रयोगशाला","Watch Brownian motion and diffusion speed rise as temperature increases!",{temp:85}],
 "ix25_1/evaporation":["matter","Matter Lab","पदार्थ प्रयोगशाला","Explore surface evaporation, thermal convection & steam state transitions in 3D!",{temp:105,sub:"evap"}]
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
card.innerHTML=`<div><b></b><small></small></div><button type="button" class="btn prim">Open lab →</button>`;
const anchor=$("#info");if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(card,anchor.nextSibling);
let shownKey=null;
function syncCard(){const k=window.__atlas&&window.__atlas.key&&window.__atlas.key(),L=LINKS[k];
 if(!L){card.hidden=true;shownKey=null;return}
 if(shownKey===k&&!card.hidden)return;shownKey=k;
 card.querySelector("b").innerHTML=`Try it yourself in the ${esc(L[1])} <span class="hi" lang="hi">${esc(L[2])}</span>`;card.querySelector("small").textContent=L[3];
 card.querySelector("button").onclick=()=>open(L[0],L[4]);card.hidden=false}
setInterval(syncCard,600);addEventListener("hashchange",()=>setTimeout(syncCard,0));
const ttl=$("#ttl");if(ttl)new MutationObserver(syncCard).observe(ttl,{childList:true,subtree:true,characterData:true});

window.__curiosity={open,load,isOpen:()=>document.body.classList.contains("cl-open"),reportString,parseReport,chips,classSummary,links:LINKS};
})();
