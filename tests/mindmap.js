const assert=require('node:assert/strict');
const {normalize,filter,layout}=require('../assets/va-mindmap-core.js');
const records=[
 {key:'ix5/types',ch:{kp:'ix5',no:5,set:'ix',title:'Mixtures',hi:'मिश्रण',unit:'Matter',brief:'Solutions and separation',color:'#627f82',kc:['Solution','Suspension'],lo:['Classify mixtures'],act:['Compare a real sample'],flags:['Source scope caveat'],topics:[{id:'types',title:'Types',hi:'प्रकार'},{id:'lab',title:'Separation lab'}]}},
 {key:'ix6/atom',ch:{kp:'ix6',no:6,set:'ix',title:'Atoms',unit:'Matter',kc:['Protons'],topics:[{id:'atom',title:'Atom builder'}]}},
 {key:'ix9/line',ch:{kp:'ix9',no:9,set:'ix',title:'Motion',unit:'Physics',topics:[{id:'line',title:'Motion graph'}]}},
 {key:'ix25_1/states',ch:{kp:'ix25_1',set:'ix25',no:1,title:'Matter in Our Surroundings',unit:'Unit I · Matter',topics:[{id:'states',title:'Particles and states'}]}},
 {key:'ch1/reaction',ch:{no:1,title:'Reactions',unit:'Chemistry',topics:[{id:'reaction',title:'Reaction model'}]}},
];
const chapters=normalize(records,['ix5/types','ix6/atom','ix9/line','ix25_1/states','ch1/reaction']);
assert.equal(chapters.length,5,'one chapter per registry key, not one per model entry');
assert.deepEqual(chapters.map(c=>c.id),['ix25_1','ch1','ix5','ix6','ix9']);
assert.equal(chapters.find(c=>c.id==='ix25_1').course,'ix25','historical syllabus is not normalised into current IX compulsory course');
assert.deepEqual(filter(chapters,'ix25').map(c=>c.id),['ix25_1']);
assert.equal(chapters.find(c=>c.id==='ix5').models[1].available,false,'unbuilt topics remain identified as unavailable');
assert.equal(chapters.find(c=>c.id==='ix5').models[0].available,true);
assert.deepEqual(chapters.find(c=>c.id==='ix5').activities,['Compare a real sample']);
assert.deepEqual(chapters.find(c=>c.id==='ix5').reviewFlags,['Source scope caveat']);
assert.deepEqual(filter(chapters,'ix','scope caveat').map(c=>c.id),['ix5'],'mind map search includes source/scope notes');
assert.deepEqual(filter(chapters,'ix').map(c=>c.id),['ix5','ix6','ix9']);
assert.deepEqual(filter(chapters,'ix','proton').map(c=>c.id),['ix6']);
assert.deepEqual(filter(chapters,'ix','', 'Matter').map(c=>c.id),['ix5','ix6']);
const allLayout=layout(filter(chapters,'ix'),'');
assert.equal(allLayout.nodes.length,3);
assert.equal(allLayout.units.length,2);
assert.ok(allLayout.height>0&&allLayout.root.y===allLayout.height/2);
const expanded=layout(filter(chapters,'ix'),'ix5');
assert.equal(expanded.topics.length,2);
const exRow=expanded.nodes.find(n=>n.chapter.id==='ix5');
assert.equal(exRow.h,expanded.nodes.find(n=>n.chapter.id==='ix6').h,'chapter cards keep one size when expanded');
assert.ok(exRow.span>exRow.h,'expanded chapter reserves room for its topics');
const ys=expanded.topics.map(t=>t.y);assert.ok(ys.every(y=>y>=exRow.y-exRow.span/2&&y<=exRow.y+exRow.span/2),'topics stay inside the reserved band');
const rows=expanded.nodes.slice().sort((a,b)=>a.y-b.y);for(let i=1;i<rows.length;i++)assert.ok(rows[i].y-rows[i].span/2>=rows[i-1].y+rows[i-1].span/2,'rows do not overlap');
console.log(`Mind map core OK · ${chapters.length} unique chapters · hierarchy and filtering checked`);
