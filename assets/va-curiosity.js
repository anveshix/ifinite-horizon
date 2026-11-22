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

/* ---------- Lesson panel: "try it in the lab" across ALL 122 topics & 25 chapters ---------- */
const LINKS={
 /* Class X Ch 1: Chemical Reactions & Equations */
 "ch1/displacement":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Drop Zinc, Iron & Copper into salt solutions and watch the Reactivity Series in 3D!"],
 "ch1/balancing":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Balance coefficients and verify Law of Conservation of Mass across atoms!"],
 "ch1/combination":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Combine Mg + O₂ or CaO + H₂O in 3D exothermic synthesis reactions."],
 "ch1/redox":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Track oxidation & reduction electron shifts live in CuO + H₂ → Cu + H₂O!"],
 "ch1/corrosion":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Inspect rusting of iron, rancidity, and sacrificial galvanisation protection."],
 /* Class X Ch 2: Acids, Bases & Salts */
 "ch2/ph":["ph","pH Lab","pH प्रयोगशाला","Test Litmus, Phenolphthalein & Universal pH across 0–14 and drop Zinc for H₂ fizz!"],
 "ch2/indicators":["ph","pH Lab","pH प्रयोगशाला","Compare Litmus, Turmeric, Universal & Phenolphthalein colour shifts across acids & bases."],
 "ch2/neutralisation":["ph","pH Lab","pH प्रयोगशाला","Titrate HCl and NaOH in 3D to reach pH 7 neutral salt + water!"],
 "ch2/salts":["ph","pH Lab","pH प्रयोगशाला","Mix acids and bases to form neutral, acidic or basic salt solutions."],
 "ch2/acidrx":["ph","pH Lab","pH प्रयोगशाला","Drop Zinc metal into strong acid (pH ≤ 4) to watch H₂ gas bubbles rise!"],
 /* Class X Ch 3: Metals & Non-metals */
 "ch3/ionic":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Inspect Na⁺Cl⁻ ionic crystal lattices, reactivity series & metal displacement."],
 "ch3/reactivity":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Compare K > Na > Ca > Mg > Al > Zn > Fe > Cu > Ag reactivity in displacement tests!"],
 "ch3/extraction":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","See thermite reduction (Fe₂O₃ + Al), roasting, and electrolytic refining."],
 "ch3/prevent":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Test galvanisation (Zn coat) and alloying to halt iron corrosion."],
 "ch3/physical":["reactions","Reactions Lab","अभिक्रिया प्रयोगशाला","Compare metallic lustre, malleability, conductivity & reactivity series."],
 /* Class X Ch 4: Carbon & its Compounds */
 "ch4/molecules":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Rotate 3D Methane, Ethanol, Acetic Acid, Diamond, Graphite & Soap Micelles!"],
 "ch4/covalent":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","See shared covalent electron pairs in CH₄, H₂O, CO₂ & N₂ triple bonds."],
 "ch4/allotropes":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Compare 3D tetrahedral Diamond (insulator) vs hexagonal Graphite (conductor) vs C₆₀!"],
 "ch4/homologous":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Step through alkanes/alcohols differing by −CH₂− (14 u) in a homologous series."],
 "ch4/ethanol":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Inspect 3D Ethanol (CH₃CH₂OH) oxidation, esterification & dehydration."],
 "ch4/micelle":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Watch amphiphilic soap micelles trap grease in their hydrophobic tails!"],
 "ch4/reactions":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Explore combustion, oxidation, addition (H₂/Ni) & substitution of carbon compounds."],
 /* Class X Ch 5: Life Processes */
 "ch5/heart":["heart","Heart Lab","हृदय प्रयोगशाला","Watch O₂-rich & CO₂-rich blood flow through RA, RV, LA & LV and hear lub-dub!"],
 "ch5/heart3d":["heart","Heart Lab","हृदय प्रयोगशाला","Interactive double-circulation simulator with BPM & cardiac output readout."],
 "ch5/alveoli":["heart","Heart Lab","हृदय प्रयोगशाला","Switch to Alveoli mode to see O₂/CO₂ gas exchange across lung capillaries!"],
 "ch5/lungs3d":["heart","Heart Lab","हृदय प्रयोगशाला","Explore 3D Alveoli air sacs and pulmonary blood oxygenation."],
 "ch5/nephron":["heart","Heart Lab","हृदय प्रयोगशाला","Switch to Nephron mode to trace ultrafiltration & selective reabsorption!"],
 "ch5/nephron3d":["heart","Heart Lab","हृदय प्रयोगशाला","Inspect Bowman's capsule, glomerulus & tubule in 3D nephron view."],
 "ch5/dialysis3d":["heart","Heart Lab","हृदय प्रयोगशाला","See how kidney filtration & artificial dialysis clear urea from blood."],
 "ch5/digestion":["organs","Organs 3D Lab","अंग 3D प्रयोगशाला","Explode the human digestive tract in 3D: Amylase, HCl/Pepsin, Bile & Villi!"],
 "ch5/digest3d":["organs","Organs 3D Lab","अंग 3D प्रयोगशाला","Interactive 3D exploded view of Stomach, Liver, Pancreas & Small Intestine."],
 "ch5/xylem":["tissues","Tissues Lab","ऊतक प्रयोगशाला","Watch unidirectional Xylem water flow and bidirectional Phloem transport."],
 /* Class X Ch 6: Control & Coordination */
 "ch6/neuron":["nervous","Nervous 3D Lab","तंत्रिका 3D प्रयोगशाला","Fire an action potential along a 3D myelinated neuron & cross the synapse!"],
 "ch6/neuron3d":["nervous","Nervous 3D Lab","तंत्रिका 3D प्रयोगशाला","Explore Dendrite → Soma → Axon → Synapse neurotransmitter release in 3D."],
 "ch6/synapse":["nervous","Nervous 3D Lab","तंत्रिका 3D प्रयोगशाला","Watch electrical impulses convert into chemical neurotransmitters at the synaptic cleft!"],
 "ch6/reflex":["nervous","Nervous 3D Lab","तंत्रिका 3D प्रयोगशाला","Trigger a hot-flame stimulus and race the spinal Reflex Arc in milliseconds!"],
 "ch6/brain":["nervous","Nervous 3D Lab","तंत्रिका 3D प्रयोगशाला","Inspect Forebrain (thinking), Midbrain, Cerebellum (balance) & Medulla in 3D!"],
 "ch6/plants":["nervous","Nervous 3D Lab","तंत्रिका 3D प्रयोगशाला","Rotate the sunlight to watch Auxin migrate and bend the plant shoot (Phototropism)!"],
 "ch6/hormones":["nervous","Nervous 3D Lab","तंत्रिका 3D प्रयोगशाला","Compare Adrenaline, Insulin, Thyroxine, Auxin & Gibberellin endocrine feedback."],
 /* Class X Ch 7: How do Organisms Reproduce? */
 "ch7/flower":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Dissect a 3D flower and grow the pollen tube down into the ovule!"],
 "ch7/flower3d":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Rotate 3D sepals, petals, stamen & carpel to trace pollination & fertilisation."],
 "ch7/fission":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Multiply Amoeba across 4 generations via Binary Fission (2ⁿ clones)!"],
 "ch7/budding":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Grow a tiny Hydra bud in 3D until it detaches as a new individual."],
 "ch7/vegetative":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Explore vegetative propagation, grafting & clonal plant growth."],
 "ch7/human":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Compare gametes, fertilisation & reproductive development stages."],
 "ch7/human3d":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Explore gamete fusion, zygote formation & reproductive biology in 3D."],
 /* Class X Ch 8: Heredity */
 "ch8/mendel":["genetics","Genetics Lab","आनुवंशिकता प्रयोगशाला","Cross TT, Tt, and tt pea plants in 3D and verify Mendel's 3:1 & 1:2:1 ratios!"],
 "ch8/dihybrid":["genetics","Genetics Lab","आनुवंशिकता प्रयोगशाला","Explore independent assortment, dominant vs recessive alleles & Punnett squares."],
 "ch8/sex":["genetics","Genetics Lab","आनुवंशिकता प्रयोगशाला","Switch to Human XX × XY mode and test the 50% Boy / 50% Girl probability."],
 "ch8/genetics3d":["genetics","Genetics Lab","आनुवंशिकता प्रयोगशाला","Watch the 3D DNA double helix and live Punnett Square genotypes."],
 "ch8/evolution":["genetics","Genetics Lab","आनुवंशिकता प्रयोगशाला","Tap Evolution & Fossils to compare Homologous vs Analogous organs!"],
 /* Class X Ch 9: Light — Reflection & Refraction */
 "ch9/optics":["lens","Lens Lab","लेंस प्रयोगशाला","Move the object, change f, and see where the image forms."],
 "ch9/power":["lens","Lens Lab","लेंस प्रयोगशाला","See how the focal length decides the power P = 1/f of a lens."],
 "ch9/slab":["lens","Lens Lab","लेंस प्रयोगशाला","Toggle Glass Slab mode to bend light via Snell's Law (n₁ sin i = n₂ sin r)!"],
 "ch9/reflection":["lens","Lens Lab","लेंस प्रयोगशाला","Trace real & virtual rays across mirrors and lenses with live focal metrics."],
 /* Class X Ch 10: The Human Eye & Colourful World */
 "ch10/eye":["eye","Eye Lab","नेत्र प्रयोगशाला","Adjust ciliary power, trigger Myopia/Hypermetropia and correct vision with glasses!"],
 "ch10/eyeparts":["eye","Eye Lab","नेत्र प्रयोगशाला","Trace light from cornea & eye lens onto the retina in real-time 3D."],
 "ch10/eye3d":["eye","Eye Lab","नेत्र प्रयोगशाला","Explore accommodation, near/far points and corrective concave/convex lenses."],
 "ch10/prism":["eye","Eye Lab","नेत्र प्रयोगशाला","Watch white light disperse through a 3D glass prism into VIBGYOR!"],
 "ch10/scatter":["eye","Eye Lab","नेत्र प्रयोगशाला","Toggle Blue Sky / Sunset mode to see λ⁻⁴ Rayleigh scattering live!"],
 /* Class X Ch 11: Electricity */
 "ch11/ohm":["ohm","Circuit Lab","परिपथ प्रयोगशाला","Turn voltage and resistance, watch electrons flow and test the 6.5 A safety fuse!"],
 "ch11/resistance":["ohm","Circuit Lab","परिपथ प्रयोगशाला","Wire R₁ and R₂ in series or parallel and read the meters."],
 "ch11/series":["ohm","Circuit Lab","परिपथ प्रयोगशाला","Compare Series (R₁+R₂) vs Parallel (R₁‖R₂) current & voltage division."],
 "ch11/heating":["ohm","Circuit Lab","परिपथ प्रयोगशाला","Watch Joule heating I²Rt glow and trip the 6.5 A safety fuse!"],
 /* Class X Ch 12: Magnetic Effects of Electric Current */
 "ch12/field":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Place a 3D compass around a bar magnet or solenoid to trace B-field lines!"],
 "ch12/solenoid":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Increase coil turns N and current I to supercharge the electromagnet B ∝ nI!"],
 "ch12/magnet":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Flip current direction to swap North and South poles on the solenoid."],
 "ch12/flhr":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Inspect magnetic field vectors B and Fleming's Left-Hand motor force!"],
 "ch12/motor":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Explore how solenoid current strength builds uniform magnetic fields for motors."],
 "ch12/induction":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Move the magnet to deflect Faraday's galvanometer needle live!"],
 "ch12/domestic":["magnet","Magnet Lab","चुंबक प्रयोगशाला","Toggle 220V Domestic AC mode to see Live/Neutral/Earth wires & MCB trip!"],
 /* Class X Ch 13: Our Environment */
 "ch13/pyramid":["ecology","Ecology 3D Lab","पारिस्थितिकी प्रयोगशाला","Explore the 3D 10% Energy Pyramid from T₁ Producers to T₄ Top Carnivores!"],
 "ch13/web":["ecology","Ecology 3D Lab","पारिस्थितिकी प्रयोगशाला","See DDT biomagnification concentrate 1000× up the aquatic food web!"],
 "ch13/ozone":["ecology","Ecology 3D Lab","पारिस्थितिकी प्रयोगशाला","Test CFC depletion of the Stratospheric Ozone (O₃) UV-B shield!"],
 "ch13/waste":["ecology","Ecology 3D Lab","पारिस्थितिकी प्रयोगशाला","Compare biodegradable nutrient recycling vs non-biodegradable biomagnification."],
 /* Class IX Ch 1: The Fundamental Unit of Life */
 "ix1/cell":["cell","Cell Lab","कोशिका प्रयोगशाला","Explore Animal, Plant, and Prokaryotic cells in 3D."],
 "ix1/cell3d":["cell","Cell Lab","कोशिका प्रयोगशाला","Rotate 3D organelles, spotlight Mitochondria/Nucleus & toggle Mitosis/Meiosis!"],
 "ix1/plant3d":["cell","Cell Lab","कोशिका प्रयोगशाला","Inspect the Plant Cell Wall, Chloroplasts & Central Vacuole in 3D."],
 "ix1/bacterium3d":["cell","Cell Lab","कोशिका प्रयोगशाला","Inspect a Prokaryote (Bacterium) with its membrane-free Nucleoid in 3D."],
 "ix1/osmosis":["cell","Cell Lab","कोशिका प्रयोगशाला","Test Hypotonic, Isotonic & Hypertonic solutions and watch H₂O cross!"],
 "ix1/division":["cell","Cell Lab","कोशिका प्रयोगशाला","Toggle Mitosis (2n→2×2n) vs Meiosis (2n→4×n) division right in the 3D Cell Lab!"],
 "ix1/division3d":["cell","Cell Lab","कोशिका प्रयोगशाला","Compare Mitosis growth divisions vs Meiosis gamete formation in 3D."],
 "ix1/microscope":["cell","Cell Lab","कोशिका प्रयोगशाला","Spotlight organelles and see cell structures in 3D."],
 "ix1/scale":["cell","Cell Lab","कोशिका प्रयोगशाला","Compare cell structures across Animal, Plant & Bacterial cells."],
 /* Class IX Ch 2: Tissues & Human Joints */
 "ix2/tissues":["tissues","Tissues Lab","ऊतक प्रयोगशाला","Inspect Parenchyma, Collenchyma, Sclerenchyma, Muscle & Neuron under 3D zoom."],
 "ix2/xylem":["tissues","Tissues Lab","ऊतक प्रयोगशाला","Watch unidirectional Xylem water flow and bidirectional Phloem transport."],
 "ix2/growth":["tissues","Tissues Lab","ऊतक प्रयोगशाला","Compare plant tissue cell walls, living state, and flexibility."],
 "ix2/meristem":["tissues","Tissues Lab","ऊतक प्रयोगशाला","Explore plant meristematic vs permanent tissues under 3D magnification."],
 "ix2/joint":["organs","Organs 3D Lab","अंग 3D प्रयोगशाला","Flex the 3D Ball-and-Socket vs Hinge Joint and inspect Cartilage & Ligaments!"],
 "ix2/joint3d":["organs","Organs 3D Lab","अंग 3D प्रयोगशाला","Bend & rotate human bone joints, tendons, and ligaments in real-time 3D."],
 /* Class IX Ch 3: Reproduction & Continuity */
 "ix3/fission":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Watch Amoeba divide by Binary Fission across 4 exponential generations!"],
 "ix3/budding":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Grow a Hydra bud in 3D until it detaches as a clone."],
 "ix3/vegetative":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Explore vegetative propagation and clonal plant multiplication."],
 "ix3/flower":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Dissect sepals, petals, stamen & carpel and trace pollen-tube fertilisation!"],
 "ix3/human":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Compare sexual gamete fusion vs asexual reproduction outcomes."],
 "ix3/dispersal":["repro","Repro & Flower 3D Lab","जनन व पुष्प प्रयोगशाला","Watch winged seeds disperse away from the parent plant in 3D!"],
 /* Class IX Ch 4: Diversity in Living Organisms */
 "ix4/kingdoms":["ecology","Ecology 3D Lab","पारिस्थितिकी प्रयोगशाला","Review Whittaker's 5 Kingdoms (Monera, Protista, Fungi, Plantae, Animalia)."],
 "ix4/acellular":["ecology","Ecology 3D Lab","पारिस्थितिकी प्रयोगशाला","See why acellular Viruses sit outside the 5 Kingdoms and need host cells."],
 /* Class IX Ch 5: Matter & Mixtures */
 "ix5/types":["matter","Matter Lab","पदार्थ प्रयोगशाला","Shine a laser beam through Solution, Colloid & Suspension to test the Tyndall Effect!"],
 "ix5/lab":["matter","Matter Lab","पदार्थ प्रयोगशाला","Watch thermal convection currents & Brownian motion from −10 °C to 110 °C!"],
 "ix5/conc":["matter","Matter Lab","पदार्थ प्रयोगशाला","Compute mass-by-mass % concentration and compare particle sizes in 3D."],
 /* Class IX Ch 6: Atomic Structure */
 "ix6/atom":["atom","Atom Lab","परमाणु प्रयोगशाला","Build elements Z = 1–20 in 3D, fill K, L, M, N Bohr shells and inspect valency!"],
 "ix6/models":["atom","Atom Lab","परमाणु प्रयोगशाला","Add extra neutrons to create isotopes like ¹⁴C and verify mass number A."],
 "ix6/atom3d":["atom","Atom Lab","परमाणु प्रयोगशाला","Watch electrons orbit the nucleus in Bohr shells and spot inert noble gases."],
 /* Class IX Ch 7: Molecules & Chemical Bonding */
 "ix7/conserve":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Verify constant atomic composition & molar mass across 3D molecules!"],
 "ix7/molecules":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Explore 3D H₂O, CO₂, CH₄, Diamond, Graphite & crystal structures!"],
 "ix7/ionic":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Compare electrostatic ionic lattices vs shared-electron covalent molecules."],
 "ix7/covalent":["molecules","Molecules 3D Lab","अणु 3D प्रयोगशाला","Inspect 3D tetrahedral CH₄ and shared covalent bonds."],
 /* Class IX Ch 8: Earth Systems, Breeze & Cycles */
 "ix8/breeze":["climate","Earth & Breeze Lab","पृथ्वी व समीर प्रयोगशाला","Watch fluid convection currents reverse between Day Sea Breeze & Night Land Breeze!"],
 "ix8/heating":["climate","Earth & Breeze Lab","पृथ्वी व समीर प्रयोगशाला","Adjust CO₂ concentration and observe Greenhouse infrared heat trapping!"],
 "ix8/spheres":["climate","Earth & Breeze Lab","पृथ्वी व समीर प्रयोगशाला","Explore Troposphere weather & Stratospheric Ozone (O₃) protection."],
 "ix8/spectrum":["climate","Earth & Breeze Lab","पृथ्वी व समीर प्रयोगशाला","Inspect the Electromagnetic Spectrum from Gamma rays to Radio waves."],
 "ix8/cycles":["climate","Earth & Breeze Lab","पृथ्वी व समीर प्रयोगशाला","Trace Carbon, Water & Nitrogen fixation (Rhizobium) biogeochemical cycles!"],
 /* Class IX Ch 9: Motion & Gravitation */
 "ix9/line":["gravity","Gravity Lab","गुरुत्व प्रयोगशाला","Drop balls in vacuum with cannon-es bounce and read the live velocity–time graph."],
 "ix9/circular":["gravity","Gravity Lab","गुरुत्व प्रयोगशाला","Test gravity g on Moon, Earth, and Jupiter in real time."],
 /* Class IX Ch 10: Force & Laws of Motion */
 "ix10/forces":["force","Force Lab","बल प्रयोगशाला","Push crates with cannon-es 3D collisions: F = m × a."],
 "ix10/trolley":["force","Force Lab","बल प्रयोगशाला","Pull a trolley with different forces and masses: F = m × a."],
 /* Class IX Ch 11: Work, Energy & Power */
 "ix11/energy":["energy","Energy Lab","ऊर्जा प्रयोगशाला","Swing a pendulum, strike the cannon-es Work puck, and watch PE turn into KE."],
 "ix11/machines":["energy","Energy Lab","ऊर्जा प्रयोगशाला","Compare mechanical work W = F·d and conservation of mechanical energy."],
 /* Class IX Ch 12: Sound */
 "ix12/wave":["sound","Sound Lab","ध्वनि प्रयोगशाला","See longitudinal compressions & rarefactions and hear real pitch!"],
 "ix12/source":["sound","Sound Lab","ध्वनि प्रयोगशाला","Pluck a 3D tuning fork and hear frequency and amplitude live."],
 "ix12/echo":["sound","Sound Lab","ध्वनि प्रयोगशाला","Clap toward a cliff wall and test the 0.1 s echo threshold!"],
 /* 2025-26 Track */
 "ix25_1/states":["matter","Matter Lab","पदार्थ प्रयोगशाला","Heat & cool water from −10 °C ice to 110 °C steam and watch convection!"],
 "ix25_1/diffusion":["matter","Matter Lab","पदार्थ प्रयोगशाला","Watch Brownian motion and diffusion speed rise as temperature increases!"],
 "ix25_1/evaporation":["matter","Matter Lab","पदार्थ प्रयोगशाला","Explore surface evaporation, thermal convection & steam state transitions in 3D!"]
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
