/* Interactive chapter mind map — the COMPLETE NCERT chapter as a 4-level tree:
   chapter → book sections (3.x) → subsections (3.x.y) → contents (activities, figures, tables,
   boxes, exercises, key points), with cross-links between related nodes and per-node attachments
   (source-grounded lesson sections, 2D images, 3D views, simulators, practicals) read at runtime
   from the registry, window.__va2d.map, window.VA_SIM_CORE.SIMS and the chapter lesson module.
   DATA.ix.ix2.book is the hand-authored inventory of every node in printed Chapter 3
   ("Tissues in Action", pp. 28–47) — see docs/ch2-ncert-inventory.md. */
(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;if(root)root.VA_CHAPTER_MAPS=api})(typeof globalThis!=="undefined"?globalThis:this,function(){
"use strict";
const DATA={ix:{ix2:{
  lessonClass:"tissue-lesson",sectionsClass:"tissue-section",
  book:[
    {id:"b0",n:"Chapter opener · Tissues in Action (p.28)",kind:"box",kids:[
      {id:"b0a",n:"Hierarchy: cells → tissues → organs → organ systems → organism",kind:"point"},
      {id:"b0b",n:"Tissue = group of similar cells working together · division of labour",kind:"point"},
      {id:"b0c",n:"Think It Over · 3 questions on cells, tissues and organisation",kind:"box"}]},
    {id:"b1",n:"3.1 Why are Plant and Animal Tissues Different? (p.29)",kind:"section",kids:[
      {id:"b1a",n:"Cell wall rigidity vs flexible animal cells & locomotion",kind:"point"},
      {id:"b1b",n:"Nutrition: photosynthesis vs digestion",kind:"point"},
      {id:"b1c",n:"Distinct transport tissues & different growth patterns",kind:"point"}]},
    {id:"b2",n:"3.2 Tissues for Growth in Plants (pp.29–33)",kind:"section",kids:[
      {id:"b2i",n:"3 growth modes: length · girth · regrowth → meristematic tissue",kind:"point"},
      {id:"b21",n:"3.2.1 Apical meristem — How do plants grow in length?",kind:"section",topic:"meristem",kids:[
        {id:"b21a",n:"Activity 3.1 onion-jar experiment · Table 3.1 · Fig 3.1–3.2",kind:"activity"},
        {id:"b21b",n:"Meet a Scientist: B. G. L. Swamy (Hasuru Honnu, KSA 1978)",kind:"box"},
        {id:"b21c",n:"Root & shoot tips contain dividing cells (mitosis recall) · Fig 3.3",kind:"point"}]},
      {id:"b22",n:"3.2.2 Lateral meristem — How do plants grow in girth?",kind:"section",topic:"plant-support",kids:[
        {id:"b22a",n:"Annual growth rings: age & climate of a tree · Fig 3.4",kind:"figure"},
        {id:"b22b",n:"Ring of dividing cells → increase in stem diameter",kind:"point"}]},
      {id:"b23",n:"3.2.3 Intercalary meristem — growth after being cut",kind:"section",topic:"growth",kids:[
        {id:"b23a",n:"Node & internode; new branches at nodes · Fig 3.5",kind:"figure"},
        {id:"b23b",n:"Hedge regrowth & lawn mowing · Fig 3.6",kind:"figure"},
        {id:"b23c",n:"Meristem cells: small, thin walls, big nucleus, dense cytoplasm, no vacuoles",kind:"point"},
        {id:"b23d",n:"Differentiation: meristematic → permanent tissues",kind:"point"}]},
      {id:"b24",n:"3.2.4 Permanent tissues (simple & complex)",kind:"section",topic:"plant-support",kids:[
        {id:"b24a",n:"T.S. sunflower stem observation · simple vs complex · Fig 3.7",kind:"figure"},
        {id:"b24b",n:"(i) Protective — Epidermis: cuticle, root hair, stomata, transpiration pull",kind:"point"},
        {id:"b24c",n:"(ii) Supporting — Parenchyma · Collenchyma · Sclerenchyma · Fig 3.8a–c",kind:"figure"},
        {id:"b24d",n:"(iii) Conducting — Xylem & Phloem: tracheids, vessels, sieve tubes, companion cells · Fig 3.9",kind:"figure",topic:"xylem"},
        {id:"b24e",n:"Tissue systems: dermal · ground · vascular · Fig 3.10",kind:"figure"},
        {id:"b24f",n:"Pause and Ponder Q1–Q4 (husk, cuticle, dead xylem, stomata)",kind:"box"}]}]},
    {id:"b3",n:"3.3 Animal Tissues (pp.34–38)",kind:"section",kids:[
      {id:"b3i",n:"Starter actions: blink · clench fist · deep breath · warm/cold touch",kind:"point"},
      {id:"b31",n:"3.3.1 Epithelial tissues — structure and functions",kind:"section",topic:"epithelial",kids:[
        {id:"b31a",n:"Table 3.2 five functions + Fig 3.11a–e (exchange, protection, secretion, sensory, absorption)",kind:"table"},
        {id:"b31b",n:"Meet the Scientists: Sipra Guha Mukherjee & S. C. Maheshwari (anther culture)",kind:"box"},
        {id:"b31c",n:"Ready to Go Beyond: cork cambium → bark",kind:"box"}]},
      {id:"b32",n:"3.3.2 Connective tissues — how parts are connected",kind:"section",topic:"connective",kids:[
        {id:"b32a",n:"Matrix: blood fluid vs bone rigid · Fig 3.12a",kind:"figure"},
        {id:"b32b",n:"Activity 3.2 · Table 3.3: cut→clot, infection→pus, exercise→breathing",kind:"activity"},
        {id:"b32c",n:"Activity 3.3 · Table 3.4: bone, cartilage, tendon, ligament · Fig 3.12b–c",kind:"activity"},
        {id:"b32d",n:"RBC haemoglobin · platelets clot · WBC pus facts",kind:"point"}]},
      {id:"b33",n:"3.3.3 Muscular tissues — controlling movement",kind:"section",topic:"muscle-nerve",kids:[
        {id:"b33a",n:"Skeletal muscle: voluntary, cylindrical, multinucleate, striated · Fig 3.13",kind:"figure"},
        {id:"b33b",n:"Smooth muscle: involuntary, spindle-shaped, single nucleus",kind:"point"},
        {id:"b33c",n:"Cardiac muscle: branched, faint striations, tireless heart",kind:"point"}]},
      {id:"b34",n:"3.3.4 Nervous tissues — sense, communicate, respond",kind:"section",topic:"muscle-nerve",kids:[
        {id:"b34a",n:"Brain as control centre; muscles follow nervous instructions",kind:"point"},
        {id:"b34b",n:"Neuron: cell body · dendrites · axon · axon terminals · Fig 3.14",kind:"figure"}]}]},
    {id:"b4",n:"3.4 The Musculoskeletal System (pp.38–39)",kind:"section",topic:"joint",kids:[
      {id:"b4a",n:"Bones · muscles · joints · cartilage · tendons · ligaments · Fig 3.15",kind:"figure"},
      {id:"b4b",n:"Skeleton ≈12–15% of body weight · Activity 3.4 estimate",kind:"activity"},
      {id:"b4c",n:"3.4.1 In action: Activity 3.5 · Table 3.5 body-part movements",kind:"activity"},
      {id:"b4d",n:"A joint is a junction between two or more bones",kind:"point"}]},
    {id:"b5",n:"3.5 Types of Joints (p.40)",kind:"section",topic:"joint",kids:[
      {id:"b5a",n:"3.5.1 Ball and socket — shoulder, shoulder girdle, all directions",kind:"section"},
      {id:"b5b",n:"3.5.2 Hinge — elbow, knee & kneecap, one plane",kind:"section"},
      {id:"b5c",n:"3.5.3 Pivot — skull on backbone, doorknob turn",kind:"section"},
      {id:"b5d",n:"3.5.4 Fixed — skull bones · Fig 3.16 types of joints",kind:"figure"},
      {id:"b5e",n:"Pause and Ponder Q5 · classical & folk dance poses · Fig 3.17",kind:"box"},
      {id:"b5f",n:"Ready to Go Beyond: bone-marrow stem cells (Leukemia/Thalassemia transplant)",kind:"box"}]},
    {id:"b6",n:"3.6 Skeletal System (p.41)",kind:"section",topic:"joint",kids:[
      {id:"b6a",n:"Skull · vertebral column (vertebrae + cartilage disc) · rib cage",kind:"point"},
      {id:"b6b",n:"12 pairs of ribs, sternum; rib cage moves for breathing",kind:"point"},
      {id:"b6c",n:"Bridging Science and Society: Yoga & posture, 21 June · Fig 3.18 Surya Namaskar",kind:"box"}]},
    {id:"b7",n:"Think as a Scientist · Totipotency (p.42)",kind:"box",topic:"organisation",kids:[
      {id:"b7a",n:"F. C. Steward, 1958: carrot phloem cells regenerate plants · Fig 3.19",kind:"figure"},
      {id:"b7b",n:"Dedifferentiation → undifferentiated mass → redifferentiation",kind:"point"},
      {id:"b7c",n:"Table 3.6 light/air/media results (liquid +20%) + questions (a)–(d)",kind:"table"}]},
    {id:"b8",n:"Bridging Science and Society · crown gall (p.43)",kind:"box",kids:[
      {id:"b8a",n:"Agrobacterium tumefaciens → genetic engineering tool · Fig 3.20",kind:"figure"}]},
    {id:"b9",n:"At a Glance · 14 chapter takeaways (p.43)",kind:"box",topic:"tissues"},
    {id:"b10",n:"Revise, Reflect, Refine · Q1–Q15 (pp.44–46)",kind:"section",kids:[
      {id:"b10a",n:"Q1–Q3 MCQs: meristem property · phloem transport · thin epithelium",kind:"exercise"},
      {id:"b10b",n:"Q4–Q6: jump comparison (Fig 3.21) · hinge joint · assertion–reason A–D",kind:"exercise"},
      {id:"b10c",n:"Q7 teak graph (Table 3.7) · Q8 elephant debarking (Fig 3.22)",kind:"exercise"},
      {id:"b10d",n:"Q9 mango-sapling flexibility · Q10 sugarcane cuttings (Fig 3.23)",kind:"exercise"},
      {id:"b10e",n:"Q11–Q15: simple vs complex · coconut husk · meristem claim · vacuole · functions",kind:"exercise"}]},
    {id:"b11",n:"The Journey Beyond · 6 investigations (p.47)",kind:"box",kids:[
      {id:"b11a",n:"Doctor visit: ligament rupture, cartilage, bone fracture",kind:"point"},
      {id:"b11b",n:"Ankle tendon activity: point toes up & down · Fig 3.24",kind:"figure"},
      {id:"b11c",n:"Yoga & kabaddi for bone and muscle health",kind:"point"},
      {id:"b11d",n:"Gardening: pruning, grafting, irrigation, crop rotation",kind:"point"},
      {id:"b11e",n:"Nature-walk leaf adaptations research project",kind:"point"},
      {id:"b11f",n:"Tribal dance forms: joint movements performance · Fig 3.25",kind:"figure"}]},
    {id:"b12",n:"The Quest Continues… (p.47)",kind:"box",topic:"organisation"}
  ],
  xlinks:[
    ["b22","b10c","annual rings"],
    ["b24d","b10a","xylem & phloem"],
    ["b31","b10a","thin epithelium"],
    ["b33","b10b","cardiac muscle"],
    ["b5","b10b","hinge joint"],
    ["b5","b11f","joints in dance"],
    ["b24c","b10d","collenchyma"],
    ["b23","b10e","meristem locations"],
    ["b7","b12","totipotency"],
    ["b33","b34","muscles follow nerves"]
  ],
  lesson:{0:["b0","b1"],1:["b21","b23"],2:["b24"],3:["b24d"],4:["b31","b32"],5:["b33","b34"],6:["b4","b5"],7:["b7"]},
  kc:{0:["b0","b9"],1:["b0","b1"],2:["b9"],3:["b24"],4:["b21"],5:["b24"],6:["b3"],7:["b31","b32","b33","b34"],8:["b4"],9:["b6"]},
  images:{"b24c":["class9/biology/plant_tissues_schematic"],"b33":["class9/biology/tissue_muscular","class9/biology/tissue_nervous"],"b4":["class9/biology/musculoskeletal_care"],"b5":["class9/biology/skeleton_joint"]},
  prac:{nodes:["b21"],items:[{act:"lab",n:5,label:"Practical 5 · onion-root slides"},{act:"inquiry",label:"Record root growth & graph"}]}
}}};
const W=w=>typeof window!=="undefined"?window:globalThis;
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cut=(s,n)=>{s=String(s||"");return s.length>n?s.slice(0,n-1)+"…":s};
let host=null,model=null,sel=null,zoom=1,folded=new Set();

function has(kp){return !!(DATA.ix&&DATA.ix[kp])}
function harvest(){
  const w=W();
  return {map2d:(w.__va2d&&w.__va2d.map)||{},sims:(w.VA_SIM_CORE&&w.VA_SIM_CORE.SIMS)||[],
    lesson:w.VA_TISSUE_CONTENT||null,keys:(w.__atlas&&w.__atlas.keys&&w.__atlas.keys())||null};
}
function flatten(nodes,depth,parent,out){
  out=out||[];
  (nodes||[]).forEach(n=>{n.depth=depth;n.parent=parent;out.push(n);if(n.kids)flatten(n.kids,depth+1,n.id,out)});
  return out;
}
function walkStats(nodes,s){
  (nodes||[]).forEach(n=>{
    if(n.kind==="box")s.boxes++;
    const t=String(n.n);
    if(/^3\.\d/.test(t))s.sections++;
    let m=t.match(/Activity ?3\.(\d+)/g);
    if(m)m.forEach(x=>s.activities.add(+x.replace(/.*3\./,"")));
    m=t.match(/Table ?3\.(\d+)/g);
    if(m)m.forEach(x=>s.tables.add(+x.replace(/.*3\./,"")));
    m=t.match(/Fig\.? ?3\.(\d+)(?:[–-]3\.(\d+))?/g);
    if(m)m.forEach(x=>{const g=/3\.(\d+)(?:[–-]3\.(\d+))?/.exec(x);if(g){s.figs.add(+g[1]);if(g[2])s.figs.add(+g[2])}});
    m=t.match(/Q(\d+)(?:[–-](?:Q)?(\d+))?/g);
    if(m)m.forEach(x=>{const g=/Q(\d+)(?:[–-](?:Q)?(\d+))?/.exec(x);if(!g)return;const a=+g[1],b=g[2]?+g[2]:a;for(let q=a;q<=b&&q-a<50;q++)s.exercises.add(q)});
    if(n.kids)walkStats(n.kids,s);
  });
  return s;
}
/* Pure structure builder: registry chapter + injected runtime sources → full map model. */
function build(kp,ch,rt){
  const d=DATA.ix&&DATA.ix[kp];
  if(!d||!d.book||!ch)return null;
  rt=rt||harvest();
  const map2d=rt.map2d||{},sims=rt.sims||[],keys=rt.keys;
  const byId={};
  (ch.topics||[]).forEach(t=>{
    const key=kp+"/"+t.id;
    const route=Array.isArray(map2d[key])?map2d[key].slice():[];
    const extra=Array.isArray(d.images&&d.images[t.id])?d.images[t.id]:[];
    const images=route.concat(extra.filter(x=>!route.includes(x)));
    const sim=sims.find(s=>s.key===key)||sims.find(s=>s.key&&s.key.indexOf(key+"/")===0)||null;
    byId[t.id]={id:t.id,key,title:t.title||t.id,hi:t.hi||"",brief:t.brief||t.ref||"",
      has3d:!!(t.build||t.cx)||(Array.isArray(keys)&&keys.indexOf(key)>=0),
      images,sim:sim?sim.id:null,lesson:[],kc:[],prac:[]};
  });
  const topicIds=Object.keys(byId);
  Object.keys(d.lesson||{}).forEach(i=>{
    (d.lesson[i]||[]).forEach(id=>{if(byId[id]&&byId[id].lesson.indexOf(+i)<0)byId[id].lesson.push(+i)});
  });
  // node-level attachments (book nodes carrying lesson/kc/prac/images directly)
  const nodeAtt={};
  const att=(id)=>nodeAtt[id]||(nodeAtt[id]={lesson:[],kc:[],images:[],prac:[],topic:null});
  Object.keys(d.lesson||{}).forEach(i=>(d.lesson[i]||[]).forEach(nid=>{if(!byId[nid]){const a=att(nid);if(a.lesson.indexOf(+i)<0)a.lesson.push(+i)}}));
  Object.keys(d.kc||{}).forEach(i=>(d.kc[i]||[]).forEach(nid=>{if(!byId[nid]){const a=att(nid);if(a.kc.indexOf(+i)<0)a.kc.push(+i)}}));
  ((d.prac&&d.prac.nodes)||[]).forEach(nid=>{if(!byId[nid])att(nid).prac=(d.prac.items)||[]});
  Object.keys(d.images||{}).forEach(nid=>{if(!byId[nid]){const a=att(nid);(d.images[nid]||[]).forEach(x=>{if(a.images.indexOf(x)<0)a.images.push(x)})}});
  // walk book: attach topic-derived attachments onto nodes with topic field
  const decorate=(nodes)=>{
    (nodes||[]).forEach(n=>{
      if(n.topic&&byId[n.topic]){
        const t=byId[n.topic];
        n.att={key:t.key,images:t.images.slice(),lesson:t.lesson.slice(),kc:t.kc.slice(),sim:t.sim,has3d:t.has3d,
          prac:(d.prac&&d.prac.nodes&&d.prac.nodes.indexOf(n.id)>=0)?(d.prac.items||[]):[]};
      }
      const a=nodeAtt[n.id];
      if(a){
        n.att=n.att||{key:null,images:[],lesson:[],kc:[],sim:null,has3d:false,prac:[]};
        a.lesson.forEach(x=>{if(n.att.lesson.indexOf(x)<0)n.att.lesson.push(x)});
        a.kc.forEach(x=>{if(n.att.kc.indexOf(x)<0)n.att.kc.push(x)});
        a.images.forEach(x=>{if(n.att.images.indexOf(x)<0)n.att.images.push(x)});
        if(a.prac.length)n.att.prac=a.prac;
      }
      if(n.kids)decorate(n.kids);
    });
  };
  decorate(d.book);
  const s={sections:0,activities:new Set(),tables:new Set(),exercises:new Set(),boxes:0,figs:new Set()};
  walkStats(d.book,s);
  const flat=flatten(d.book,0,null,[]);
  const xlinks=(d.xlinks||[]).filter(l=>flat.some(n=>n.id===l[0])&&flat.some(n=>n.id===l[1]));
  const lesson=((rt.lesson&&rt.lesson.sections)||[]).map((x,i)=>({i,title:x.title||"",hi:x.hi||"",pages:x.pages||""}));
  const imageSet=new Set();let simsN=0;
  flat.forEach(n=>{if(n.att){n.att.images.forEach(x=>imageSet.add(x));if(n.att.sim)simsN++}});
  return {kp,ch,d,root:d.book,flat,byId,xlinks,lesson,
    stats:{sections:s.sections,activities:s.activities.size,tables:s.tables.size,exercises:s.exercises.size,boxes:s.boxes,
      figs:s.figs.size,nodes:flat.length,images:imageSet.size,sims:simsN,lessons:lesson.length,
      prac:((d.prac&&d.prac.items)||[]).length}};
}
function branchColor(i){return ["#2f7d6d","#a95132","#4a67a8","#8a5a9e","#b08a1f","#2c8aa0","#a14d6c","#5f7f2c","#7a6a52","#c0622d","#54877e","#8a6d3b","#6b5b95","#3e7cb1"][i%14]}
const COLX=[14,220,500,830],COLW=[176,252,300,300];
function layout(root){
  let y=16;const pos={},order=[];
  const rowH=d=>d===1?60:d===2?56:44;
  const place=(nodes,depth,branchIdx)=>{
    nodes.forEach((n,i)=>{
      const bi=depth===0?0:depth===1?i:branchIdx;
      const visible=!folded.has(n.id);
      const kids=visible&&n.kids&&n.kids.length?n.kids:null;
      let cy;
      if(kids){
        const start=y;
        place(kids,depth+1,bi);
        const ys=kids.map(k=>pos[k.id].y);
        cy=(Math.min(...ys)+Math.max(...ys))/2;
        void start;
      }else{
        cy=y+rowH(depth)/2;y+=rowH(depth)+(depth===3?6:10);
      }
      pos[n.id]={id:n.id,node:n,depth,x:COLX[Math.min(depth,3)],w:COLW[Math.min(depth,3)],y:cy,
        h:rowH(depth),color:depth===0?"#233e34":branchColor(bi),hasKids:!!(n.kids&&n.kids.length),hidden:!kids&&!!(n.kids&&n.kids.length)&&!visible};
      order.push(pos[n.id]);
      if(depth===0&&n.kids&&visible){y+=18}
      else if(depth===1&&kids&&i<nodes.length-1){y+=14}
    });
  };
  place(root,0,0);
  const H=Math.max(y+20,160),Wd=COLX[3]+COLW[3]+40;
  return {pos,order,H,W:Wd};
}
function edgePath(x1,y1,x2,y2,bend){const mx=(x1+x2)/2;return `M${x1} ${y1} C ${mx+(bend||0)} ${y1}, ${mx+(bend||0)} ${y2}, ${x2} ${y2}`}
function svgNode(p,extra){
  const n=p.node,att=n.att;
  const badges=[];
  if(att){if(att.lesson.length)badges.push("📖"+att.lesson.length);if(att.images.length)badges.push("📷"+att.images.length);
    if(att.has3d)badges.push("🎲");if(att.sim)badges.push("⚗");if(att.prac&&att.prac.length)badges.push("🧪")}
  const kidsHidden=n.kids&&n.kids.length&&folded.has(n.id);
  const kidsShown=n.kids&&n.kids.length&&!folded.has(n.id);
  const meta=p.depth===1?`${n.kids?n.kids.length:0} items${kidsHidden?" ⊕":kidsShown?" •":""}`
    :p.depth===2&&n.kids?`${n.kids.length} ${kidsHidden?"⊕":"•"}`:"";
  const sub=p.depth<=1?(n.kind==="section"||n.kind==="box"?kindTag(n.kind):""):"";
  return `<g class="cm-nd cm-d${p.depth}${sel===n.id?" sel":""}${extra&&extra.near?" near":""}${extra&&extra.dim?" dim":""}" data-cm-node="${esc(n.id)}" tabindex="0" role="button" aria-label="${esc(n.n)}">
<rect x="${p.x}" y="${p.y-p.h/2}" width="${p.w}" height="${p.h}" rx="12"/>
<rect class="cm-stripe" x="${p.x}" y="${p.y-p.h/2}" width="6" height="${p.h}" rx="3" fill="${p.color}"/>
<text class="cm-t" x="${p.x+14}" y="${p.y+(sub?-1:5)}">${esc(cut(n.n,p.depth===3?58:p.depth===2?44:36))}</text>
${sub?`<text class="cm-s" x="${p.x+14}" y="${p.y+16}">${esc(sub)}</text>`:""}
${badges.length?`<text class="cm-b" x="${p.x+p.w-10}" y="${p.y-8}" text-anchor="end">${esc(badges.join(" "))}</text>`:""}
${meta?`<text class="cm-m" x="${p.x+p.w-10}" y="${p.y+(sub?17:5)}" text-anchor="end">${esc(meta)}</text>`:""}
</g>`;
}
function kindTag(k){return ({section:"SECTION ·खंड",box:"BOX · बॉक्स",activity:"ACTIVITY",figure:"FIGURE",table:"TABLE",exercise:"EXERCISE",point:"KEY POINT"})[k]||""}
function canvasHtml(m,L){
  const near=new Set();
  if(sel)m.xlinks.forEach(l=>{if(l[0]===sel)near.add(l[1]);if(l[1]===sel)near.add(l[0])});
  let h=`<svg class="cm-svg" viewBox="0 0 ${L.W} ${L.H}" width="${Math.round(L.W*zoom)}" height="${Math.round(L.H*zoom)}" role="img" aria-label="Complete chapter mind map: ${esc(m.ch.title)}"><title>${esc(m.ch.title)} · complete NCERT chapter map</title>`;
  h+='<g class="cm-edges">';
  m.flat.forEach(n=>{const p=L.pos[n.id];if(!p||!n.parent)return;const pp=L.pos[n.parent];if(!pp)return;
    h+=`<path d="${edgePath(pp.x+pp.w,pp.y,p.x,p.y-p.h/2+8,12)}" stroke="${p.color}" fill="none" stroke-width="1.7" stroke-opacity=".5"/>`});
  h+='</g><g class="cm-x">';
  m.xlinks.forEach(l=>{
    const a=L.pos[l[0]],b=L.pos[l[1]];if(!a||!b)return;
    const hot=sel&&(l[0]===sel||l[1]===sel);
    const x1=a.x+a.w,y1=a.y,x2=b.x,y2=b.y;
    const bend=Math.abs(y1-y2)>160?100:64;
    h+=`<path class="cm-xl${hot?" hot":""}${sel&&!hot?" dim":""}" d="${edgePath(x1,y1,x2,y2,bend)}" fill="none"/>`;
    if(l[2]&&hot)h+=`<text class="cm-xl-t hot" x="${(x1+x2)/2+bend/2}" y="${(y1+y2)/2-6}">${esc(l[2])}</text>`;
  });
  h+='</g><g class="cm-nodes">';
  L.order.forEach(p=>{
    const n=p.node;
    h+=svgNode(p,{near:near.has(n.id),dim:!!sel&&sel!==n.id&&!near.has(n.id)});
  });
  h+='</g></svg>';
  return h;
}
function actBtn(cls,label,attrs){return `<button type="button" class="cm-a ${cls||""}" ${attrs}>${label}</button>`}
function infoHtml(m){
  if(!sel){
    const s=m.stats;
    const simNode=m.flat.find(n=>n.att&&n.att.sim);
    const prac=(m.d.prac&&m.d.prac.items)||[];
    return `<div class="cm-over"><span class="cm-kicker">COMPLETE NCERT CHAPTER MAP · पूरा अध्याय मानचित्र</span>
<b>${esc(m.ch.title)}${m.ch.hi?" · "+esc(m.ch.hi):""}</b>
<p>Printed Chapter 3 · “Tissues in Action” · pp. 28–47 — every section, subsection, activity, figure, table, box and exercise of the chapter, nothing skipped. Select any node for its contents and attachments.</p>
<div class="cm-stats-list"><span>${s.sections} sections</span><span>${s.activities} activities</span><span>${s.figs} figures</span><span>${s.tables} tables</span><span>${s.exercises} exercises</span><span>${s.boxes} boxes</span><span>${s.nodes} nodes</span></div>
<div class="cm-actions">
${actBtn("prim","📖 Read source-grounded lesson ("+m.lesson.length+" sections)",'data-cm-act="lessonall"')}
${prac.map(p=>actBtn("",p.act==="lab"?"🧪 "+esc(p.label):"🌱 "+esc(p.label),p.act==="lab"?`data-cm-act="lab" data-cm-n="${p.n}"`:'data-cm-act="inquiry"')).join("")}
${simNode?actBtn("","⚗ "+esc(simNode.att.sim==="apical"?"Root-tip growth simulator":simNode.n),'data-cm-act="sim" data-cm-sim="'+esc(simNode.att.sim)+"\""):""}
</div>
<div class="cm-legend"><span>📖 lesson</span><span>📷 image</span><span>🎲 3D</span><span>⚗ simulator</span><span>🧪 practical</span><span>⊕ fold / • unfold</span></div></div>`;
  }
  const n=m.flat.find(x=>x.id===sel);
  if(!n)return "";
  const att=n.att;
  const acts=[];
  if(att){
    att.lesson.forEach(i=>{const s=m.lesson[i];if(s)acts.push(actBtn("","📖 Lesson §"+(i+1)+" · "+esc(s.title),`data-cm-act="lesson" data-cm-i="${i}"`))});
    att.images.forEach(img=>acts.push(actBtn("","📷 "+esc(img.split("/").pop().replace(/_/g," ")),`data-cm-act="2d" data-cm-key="${esc(att.key||"")}" data-cm-img="${esc(img)}"`)));
    if(att.has3d&&att.key)acts.push(actBtn("","🎲 Open 3D view",`data-cm-act="3d" data-cm-key="${esc(att.key)}"`));
    if(att.images.length&&att.key)acts.push(actBtn("","🖼 Open 2D atlas",`data-cm-act="2d" data-cm-key="${esc(att.key)}"`));
    if(att.sim)acts.push(actBtn("","⚗ Open simulator",`data-cm-act="sim" data-cm-sim="${esc(att.sim)}"`));
    (att.prac||[]).forEach(p=>acts.push(actBtn("",p.act==="lab"?"🧪 "+esc(p.label):"🌱 "+esc(p.label),p.act==="lab"?`data-cm-act="lab" data-cm-n="${p.n}"`:'data-cm-act="inquiry"')));
  }
  const kcTexts=[];
  if(m.d.kc)Object.keys(m.d.kc).forEach(i=>{if(m.d.kc[i].indexOf(n.id)>=0&&m.kcTexts&&m.kcTexts[i])kcTexts.push(m.kcTexts[i])});
  const connected=m.xlinks.filter(l=>l[0]===n.id||l[1]===n.id);
  const kids=(n.kids||[]).map(k=>actBtn("ghost","→ "+esc(k.n),`data-cm-node-btn="${esc(k.id)}"`));
  const chips=[kindTag(n.kind)];
  if(att){if(att.images.length)chips.push("📷 "+att.images.length);if(att.lesson.length)chips.push("📖 "+att.lesson.length+" §");
    if(att.has3d)chips.push("🎲");if(att.sim)chips.push("⚗");if(att.prac&&att.prac.length)chips.push("🧪")}
  return `<div class="cm-pick"><span class="cm-kicker">${esc(kindTag(n.kind)||"NODE")}</span>
<b>${esc(n.n)}</b>
<div class="cm-chips">${chips.filter(Boolean).map(c=>`<span>${esc(c)}</span>`).join("")}</div>
${n.kind==="box"||n.kind==="point"||n.kind==="exercise"?`<p>Part of the source chapter — open the lesson for the full text.</p>`:""}
${acts.length?`<h4>Contents · सामग्री</h4><div class="cm-actions">${acts.join("")}</div>`:""}
${kcTexts.length?`<h4>Syllabus points</h4><ul class="cm-kc">${kcTexts.map(t=>`<li>${esc(t)}</li>`).join("")}</ul>`:""}
${kids.length?`<h4>Subtopics (${kids.length})</h4><div class="cm-actions">${kids.join("")}</div>`:""}
${connected.length?`<h4>Connected · जुड़े विषय</h4><div class="cm-actions">${connected.map(l=>{const o=m.flat.find(x=>x.id===(l[0]===n.id?l[1]:l[0]));return o?actBtn("ghost","↔ "+esc(o.n)+(l[2]?" · "+esc(l[2]):""),`data-cm-jump="${esc(o.id)}"`):""}).join("")}</div>`:""}
<div class="cm-actions cm-back"><button type="button" class="cm-a" data-cm-back="1">← Chapter overview</button></div></div>`;
}
function bodyHtml(m){
  const L=layout(m.root);
  return `<div class="cm-canvas" id="cmCanvas">${canvasHtml(m,L)}</div><aside class="cm-info" aria-live="polite">${infoHtml(m)}</aside>`;
}
function statsHtml(m){const s=m.stats;
  return `<span>${s.sections} sections</span><span>${s.activities} acts</span><span>Fig ${s.figs}</span><span>Tbl ${s.tables}</span><span>Q ${s.exercises}</span><span>📷 ${s.images}</span><span>📖 ${s.lessons}</span>${s.sims?`<span>⚗ ${s.sims}</span>`:""}`;}
function render(ch){
  if(!ch||!has(ch.kp))return "";
  model=build(ch.kp,ch,null);
  if(!model)return "";
  sel=null;zoom=1;folded=new Set();
  const m=model;
  m.kcTexts=(ch.kc||[]).slice();
  return `<section class="cmap-int" data-cm-chapter="${esc(m.kp)}" aria-label="Complete NCERT chapter mind map">
<header class="cm-head"><div><b>Complete chapter mind map · पूरा अध्याय</b><small>NCERT printed Chapter 3 “Tissues in Action” · pp. 28–47 · every section, activity, figure, table &amp; exercise</small></div>
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
  setTimeout(()=>{const v=w.__va2d;if(!v)return;if(v.set)v.set("2d");if(imgId&&v.show)v.show(imgId)},300);
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
function selectNode(id){
  if(sel===id){sel=null;const n=model.flat.find(x=>x.id===id);if(n&&n.kids&&n.kids.length)folded.add(id);}
  else{
    sel=id;
    const n=model.flat.find(x=>x.id===id);
    if(n){
      // unfold ancestors so the selection is visible
      let p=n.parent;
      while(p){folded.delete(p);const pn=model.flat.find(x=>x.id===p);p=pn?pn.parent:null}
      if(n.kids&&n.kids.length&&folded.has(id))folded.delete(id);
    }
  }
  paint();
}
function wire(scope){
  if(!scope||!scope.querySelector)return;
  const root=scope.querySelector(".cmap-int");
  if(!root||root.dataset.cmWired)return;
  root.dataset.cmWired="1";host=root;
  root.addEventListener("click",e=>{
    const zoomBtn=e.target.closest("[data-cm-zoom]");
    if(zoomBtn){const z=zoomBtn.dataset.cmZoom;zoom=z==="in"?Math.min(2.2,zoom+.2):z==="out"?Math.max(.4,zoom-.2):1;paint();return}
    const tog=e.target.closest("[data-cm-toggle]");
    if(tog){
      if(tog.dataset.cmToggle==="none"){folded=new Set(model.flat.filter(n=>n.kids&&n.kids.length).map(n=>n.id))}
      else folded=new Set();
      paint();return}
    const jump=e.target.closest("[data-cm-jump]");
    if(jump){selectNode(jump.dataset.cmJump);return}
    const nodeBtn=e.target.closest("[data-cm-node-btn]");
    if(nodeBtn){selectNode(nodeBtn.dataset.cmNodeBtn);return}
    if(e.target.closest("[data-cm-back]")){sel=null;paint();return}
    const act=e.target.closest("[data-cm-act]");
    if(act){runAction(act);return}
    const nd=e.target.closest("[data-cm-node]");
    if(nd){selectNode(nd.dataset.cmNode)}
  });
  root.addEventListener("keydown",e=>{
    if(e.key!=="Enter"&&e.key!==" ")return;
    const n=e.target.closest("[data-cm-node]");
    if(n){e.preventDefault();n.dispatchEvent(new MouseEvent("click",{bubbles:true}))}
  });
}
function preview(kp,ch,id){
  if(!ch||!has(kp))return "";
  model=build(kp,ch,null);
  sel=id||null;
  if(model)model.kcTexts=(ch.kc||[]).slice();
  return model?infoHtml(model):"";
}
return Object.freeze({DATA,has,build,render,wire,preview});
});
