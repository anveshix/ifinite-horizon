const assert=require('node:assert/strict');
const {SIMS,calculate}=require('../assets/va-simulator-core.js');
const {modules}=require('../docs/class9-coverage.json');

assert.equal(SIMS.length,7,'initial Class IX simulator slice has seven investigations');
assert.equal(new Set(SIMS.map(s=>s.id)).size,SIMS.length,'simulator ids are unique');
assert.equal(SIMS.filter(s=>s.subject==='Physics').length,4);
assert.equal(SIMS.filter(s=>s.subject==='Chemistry').length,3);
const chapterKeys=['ix9/line','ix10/forces','ix11/energy','ix12/source','ix5/lab','ix6/atom','ix7/molecules'];
assert.deepEqual(SIMS.map(s=>s.related),chapterKeys,'every activity links to its Class IX chapter context');
for(const s of SIMS){
  const chapter=modules.find(m=>m.track==='compulsory_086'&&m.id===s.key.split('/')[0]);
  assert.ok(chapter,`${s.id}: belongs to a compulsory Class IX 086 chapter`);
  assert.equal(chapter.title,s.chapter,`${s.id}: chapter title matches the registry`);
  assert.ok(chapter.models.includes(s.related),`${s.id}: related topic exists in the chapter model registry`);
  assert.ok(s.objectives.length>=1&&s.objectives.length===s.objectivesHi.length,`${s.id}: objectives in English and Hindi`);
  assert.ok(s.fields.length>=1,`${s.id}: has adjustable controls`);
  for(const f of s.fields) if(f.type!=='select') assert.ok(f.min<f.max&&f.step>0&&f.value>=f.min&&f.value<=f.max,`${s.id}.${f.id}: valid initial range`);
}
assert.deepEqual(calculate('motion',{u:4,a:1,t:4}),{displacement:24,velocity:8});
assert.equal(calculate('force',{F:12,m:4}).acceleration,3);
assert.deepEqual(calculate('lever',{load:60,effortArm:1,loadArm:.5}),{effort:30,load:60,mechanicalAdvantage:2});
assert.equal(calculate('sound',{frequency:440,amplitude:.5,medium:'water'}).wavelength,1480/440);
assert.equal(calculate('mixtures',{case:'salt-water-water',method:'distillation'}).correct,true);
assert.equal(calculate('mixtures',{case:'salt-water-salt',method:'distillation'}).correct,false);
assert.equal(calculate('mixtures',{case:'salt-water-water',method:'distillation'}).best,'distillation');
assert.deepEqual(calculate('atom',{p:8,n:8,e:10}),{symbol:'O',element:'Oxygen',atomicNumber:8,massNumber:16,charge:-2,shells:[2,8,0]});
const water=calculate('molecules',{formula:'water',count:3});
assert.equal(water.formula,'H₂O');assert.equal(water.mass,18);assert.equal(water.totalAtoms,9);assert.equal(water.totalRelativeMass,54);
console.log(`Simulator core OK · ${SIMS.length} Class IX activities · ${SIMS.filter(s=>s.subject==='Physics').length} Physics · ${SIMS.filter(s=>s.subject==='Chemistry').length} Chemistry`);
