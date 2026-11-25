// Interactive chapter mind map (Ch2 Tissues exemplar): hierarchy, cross-links, attachments, wiring.
// Run with: npm run test:chaptermap
const assert=require('node:assert/strict');
const fs=require('node:fs');
const maps=require('../assets/va-chapter-map.js');
const tissue=require('../assets/va-tissues-content.js');
const {SIMS}=require('../assets/va-simulator-core.js');
const coverage=require('../docs/class9-coverage.json');
const curriculum=require('../api/ai/curriculum.json');
const app=fs.readFileSync(require.resolve('../index.html'),'utf8');
const modSrc=fs.readFileSync(require.resolve('../assets/va-chapter-map.js'),'utf8');
const css=fs.readFileSync(require.resolve('../assets/va-chapter-map.css'),'utf8');
const {MAP}=(()=>{ // evaluate only the static DATA/MAP declarations of the 2D bundle
  const source=fs.readFileSync(require.resolve('../assets/va-2d.js'),'utf8');
  const dataStart=source.indexOf('const DATA=');
  const mapStart=source.indexOf('const B9=',dataStart);
  const end=source.indexOf('const GROUPS=',mapStart);
  assert(dataStart>=0&&mapStart>dataStart&&end>mapStart,'2D data/MAP slice located');
  return new Function(source.slice(dataStart,end)+'\nreturn {DATA:null, MAP};')();
})();

assert.ok(maps.has('ix2'),'Ch2 Tissues is the chapter-map exemplar');
assert.ok(!maps.has('ix9'),'other chapters stay untouched until their own turn');

// --- hand-authored integration data ---
const d=maps.DATA.ix.ix2;
const themeTopics=d.themes.flatMap(t=>t.topics);
const expected=['organisation','tissues','meristem','plant-support','xylem','growth','epithelial','connective','muscle-nerve','joint'];
assert.deepEqual([...themeTopics].sort(),[...expected].sort(),'all 10 registry topics sit under exactly one theme');
assert.equal(new Set(themeTopics).size,10,'no topic is duplicated across themes');
assert.equal(d.themes.length,4);
assert.equal(d.links.length,9);
for(const [a,b,label] of d.links){
  assert.ok(expected.includes(a)&&expected.includes(b),`link ${a}–${b} uses known topics`);
  assert.ok(a!==b&&label,`link ${a}–${b} is labelled and non-self`);
}
// graph connectivity: every topic reachable from "organisation" over links
const seen=new Set(['organisation']);
let grew=true;
while(grew){grew=false;for(const [a,b] of d.links){if(seen.has(a)&&!seen.has(b)){seen.add(b);grew=true}if(seen.has(b)&&!seen.has(a)){seen.add(a);grew=true}}}
assert.equal(seen.size,10,'cross-links connect every topic into one graph');

// lesson & KC maps cover everything, with valid indices
const aiChapter=curriculum.chapters.find(x=>x.id==='ix2');
const chapter=coverage.modules.find(x=>x.id==='ix2');
assert.ok(aiChapter&&chapter);
assert.deepEqual(aiChapter.topics.map(t=>t.id).sort(),[...expected].sort(),'curriculum topic ids match the map themes');
assert.equal(Object.keys(d.lesson).length,tissue.sections.length,'lesson map keys match the lesson module sections');
for(let i=0;i<tissue.sections.length;i++)assert.ok(Array.isArray(d.lesson[i]),`lesson section ${i} is mapped`);
assert.ok(d.lesson[7].length===0,'chapter-level extension section belongs to the root, not one topic');
for(const id of expected){
  const secs=Object.keys(d.lesson).filter(k=>d.lesson[k].includes(id));
  assert.ok(secs.length>=1,`topic ${id} carries at least one lesson section`);
}
assert.ok(chapter.keyConcepts>=10,'coverage counts the chapter key concepts');
assert.equal(aiChapter.keyConcepts.length,chapter.keyConcepts,'curriculum lists exactly what coverage counts');
for(const id of expected){
  const kcs=Object.keys(d.kc).filter(k=>d.kc[k].includes(id));
  assert.ok(kcs.length>=1,`topic ${id} carries at least one syllabus point`);
}
for(const k of Object.keys(d.kc)){
  assert.ok(+k<aiChapter.keyConcepts.length,`kc index ${k} inside curriculum key concepts`);
  assert.ok(d.kc[k].some(id=>expected.includes(id)),'kc mapping targets known topics');
}

// --- pure build() with real sources: every topic gets images, lesson, sim where expected ---
const topics=expected.map(id=>({id,title:'Topic '+id,hi:'विषय',brief:'brief',build:()=>{}}));
const ch={kp:'ix2',no:2,title:'Tissues',hi:'ऊतक',unit:'World of living',topics,kc:aiChapter.keyConcepts.slice()};
const rt={map2d:MAP,sims:SIMS,lesson:tissue,keys:[]};
const model=maps.build('ix2',ch,rt);
assert.ok(model,'build produced a model');
assert.equal(model.stats.topics,10);
assert.equal(model.stats.links,9);
assert.equal(model.stats.lessons,tissue.sections.length);
assert.equal(model.stats.sims,1,'the apical-meristem simulator attaches to the map');
assert.equal(model.stats.prac,2,'practical record sheet + root-growth inquiry attach');
for(const id of expected){
  const t=model.byId[id];
  assert.ok(t.images.length>=1,`topic ${id} has at least one related image (route or hand-authored extra)`);
  assert.ok(t.lesson.length>=1,`topic ${id} has a lesson section`);
  assert.ok(t.has3d,'registry topic exposes a 3D-capable entry');
}
assert.equal(model.byId.meristem.sim,'apical','simulator attaches to its topic key');
assert.deepEqual(model.byId.growth.prac.map(p=>p.act),['lab','inquiry']);
assert.equal(model.byId['plant-support'].images[0],'class9/biology/plant_tissues_schematic','plant-support topic carries its schematic');
assert.equal(model.byId['muscle-nerve'].images.length,2,'muscle + nervous diagrams attach to their topic (hand extras dedupe against the route)');
assert.ok(model.byId.joint.images.includes('class9/biology/musculoskeletal_care'));
assert.equal(model.lesson.filter(s=>s.topics.length).length,tissue.sections.length-1,'every lesson section except the chapter-level one lands on a topic');

// --- render + inspector previews against a stubbed browser environment ---
global.window={
  __va2d:{map:MAP,set(){},show(){}},
  VA_SIM_CORE:{SIMS},
  VA_TISSUE_CONTENT:tissue,
  __atlas:{keys:()=>expected.map(id=>'ix2/'+id),go(){},key:()=>'ix2/tissues'}
};
const html=maps.render(ch);
assert.match(html,/class="cmap-int"/);
assert.match(html,/Interactive chapter mind map/);
assert.equal((html.match(/data-cm-topic="/g)||[]).length,10,'all 10 topic nodes render');
assert.equal((html.match(/data-cm-theme="/g)||[]).length,4);
assert.equal((html.match(/class="cm-xl/g)||[]).length,18,'9 cross-link paths + 9 labels');
assert.match(html,/data-cm-act="lessonall"/);
assert.match(html,/data-cm-act="lab" data-cm-n="5"/);
assert.match(html,/data-cm-act="inquiry"/);
assert.match(html,/data-cm-act="sim"/);
assert.match(html,/📷 \d+/,'image stats expose attached visuals');
assert.doesNotMatch(html,/�/);
const overview=maps.preview('ix2',ch,null);
assert.match(overview,/Read source-grounded lesson/);
const meristem=maps.preview('ix2',ch,'meristem');
assert.match(meristem,/data-cm-act="sim" data-cm-sim="apical"/);
assert.match(meristem,/data-cm-act="lesson"/);
assert.match(meristem,/data-cm-act="3d"/);
assert.match(meristem,/data-cm-jump="/,'connected topics listed');
const growth=maps.preview('ix2',ch,'growth');
assert.match(growth,/data-cm-act="lab" data-cm-n="5"/);
assert.match(growth,/data-cm-act="inquiry"/);
const muscle=maps.preview('ix2',ch,'muscle-nerve');
assert.equal((muscle.match(/data-cm-act="2d"/g)||[]).length,2,'muscle + nervous diagram buttons');

// --- app wiring ---
assert.match(app,/<link rel="stylesheet" href="assets\/va-chapter-map\.css">/);
assert.match(app,/<script src="assets\/va-chapter-map\.js"><\/script>/);
assert.match(app,/VA_CHAPTER_MAPS\.has\(ch\.kp\)\)\?window\.VA_CHAPTER_MAPS\.render\(ch\)/);
assert.match(app,/<div class="syl">\$\{chapterMap\}/);
assert.match(app,/VA_CHAPTER_MAPS\?\.wire\(box\)/);
assert.match(app,/const cellLesson=/,'existing lesson companions stay in place');
assert.match(app,/\$\{cellLesson\}\$\{tissueLesson\}\$\{motionLesson\}\$\{mixtureLesson\}\$\{forceLesson\}\$\{fl\}/);
assert.match(css,/\.cmap-int\{/);
assert.match(css,/\.cm-xl\{/);
assert.doesNotMatch(modSrc+css,/�/);
console.log('Chapter map OK · Ch2 exemplar: 4 themes, 10 connected topics, lesson/image/sim/practical attachments, app wiring');
