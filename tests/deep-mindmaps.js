const fs=require('fs'),path=require('path'),assert=require('assert'),vm=require('vm');
const root=path.resolve(__dirname,'..');
const w={};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/va-deep-maps.js'),'utf8'),{window:w});
const D=w.VA_DEEP_MAPS,ix=JSON.parse(fs.readFileSync(path.join(root,'api/ai/curriculum.json'),'utf8')).chapters;
assert.strictEqual(Object.keys(D.ix).length,12);assert.strictEqual(Object.keys(D.x).length,13);
for(const c of ix){const m=D.ix[c.id];assert(m,'missing '+c.id);assert.strictEqual(m.title,c.title);assert(m.branches.length>=4,c.id+' thin');for(const b of m.branches)assert(b.i.length>=1,c.id+' empty branch')}
for(const m of Object.values(D.x))assert(m.branches.length>=4&&m.branches.every(b=>b.i.length));
assert(D.x[8].branches.every(b=>b.scope==='formative'),'Heredity/Evolution formative');
assert(D.x[12].branches.some(b=>b.scope==='formative'));
const files=fs.readdirSync(path.join(root,'docs/chapters'));assert.strictEqual(files.length,25);
assert(fs.readFileSync(path.join(root,'index.html'),'utf8').includes('va-deepmap.js'));
console.log('deep mind maps ok · 25 chapters');
