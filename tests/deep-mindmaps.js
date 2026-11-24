const fs=require('fs'),path=require('path'),assert=require('assert'),vm=require('vm');
const root=path.resolve(__dirname,'..');
const w={};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/va-deep-maps.js'),'utf8'),{window:w});
const D=JSON.parse(JSON.stringify(w.VA_DEEP_MAPS)),ix=JSON.parse(fs.readFileSync(path.join(root,'api/ai/curriculum.json'),'utf8')).chapters;
assert.strictEqual(Object.keys(D.ix).length,12);assert.strictEqual(Object.keys(D.x).length,14);
for(const c of ix){const m=D.ix[c.id];assert(m,'missing '+c.id);assert.strictEqual(m.title,c.title);assert(m.branches.length>=4&&m.cbse&&m.periods,c.id+' thin');for(const b of m.branches)assert(b.i.length>=1,c.id+' empty branch')}
for(const m of Object.values(D.x))assert(m.branches.length>=1&&m.branches.every(b=>b.i.length)&&/^Unit [IV]+ ·/.test(m.unit));
assert.deepStrictEqual(D.x[8].branches.filter(b=>b.scope==='formative').map(b=>b.n),['Evolution'],'only Evolution is formative; Heredity is assessed');
assert.deepStrictEqual(Object.values(D.x).flatMap(m=>m.branches.filter(b=>b.scope==='formative').map(b=>m.no+':'+b.n)),['8:Evolution','12:Motor, Electromagnetic Induction, Electric Generator','14:Periodic Classification of Elements']);
assert(!JSON.stringify(D.x[10]).includes('Atmospheric'),'atmospheric refraction excluded');
assert(D.x[14].topics.length===3&&/Periodic/.test(D.x[14].title),'chapter 14 built with 3 scenes');
assert(D.x[12].branches.some(b=>b.scope==='formative'));
const pdf={ix1:[2,12],ix2:[3,13],ix3:[11,13],ix4:[12,12],ix5:[5,12],ix6:[8,14],ix7:[9,14],ix8:[13,12],ix9:[4,13],ix10:[6,13],ix11:[7,13],ix12:[10,11]};
for(const[k,[n,p]]of Object.entries(pdf)){assert.strictEqual(D.ix[k].cbse,n,k+' cbse no');assert.strictEqual(D.ix[k].periods,p,k+' periods')}
assert.strictEqual(Object.values(D.ix).reduce((a,m)=>a+m.periods,0),152);
const units={'World of living':[2,3,11,12],'Matter':[5,8,9],'Earth as a system':[13]};
for(const[u,n]of Object.entries(units))assert.deepStrictEqual(Object.values(D.ix).filter(m=>m.unit===u).map(m=>m.cbse).sort((a,b)=>a-b),n,u);
const gone=JSON.stringify(D.ix.ix1);for(const bad of ['Golgi','lysosome','ribosome'])assert(!gone.includes(bad),'non-PDF term '+bad);
const files=fs.readdirSync(path.join(root,'docs/chapters'));assert.strictEqual(files.length,26);
assert(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('va-deepmap.js'));
console.log('deep mind maps ok · 26 chapters');
