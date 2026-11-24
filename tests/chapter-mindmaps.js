const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),md=fs.readFileSync(path.join(root,'docs/CHAPTER_MINDMAPS.md'),'utf8');
const ix=JSON.parse(fs.readFileSync(path.join(root,'api/ai/curriculum.json'),'utf8')).chapters;
const x=JSON.parse(fs.readFileSync(path.join(root,'tools/data/class10-mindmaps.json'),'utf8')).chapters;
assert.strictEqual(ix.length,12);assert.strictEqual(x.length,14);
assert.strictEqual((md.match(/^```mermaid/gm)||[]).length,26);
for(const c of ix){assert(md.includes(`### IX · Ch ${c.number} — ${c.title}`),`missing IX ${c.id}`);for(const k of c.keyConcepts)assert(md.includes(k.replace(/[()[\]{}"`<>#]/g,' ').replace(/;/g,',').replace(/\s+/g,' ').trim()),`IX ${c.id} concept lost: ${k}`)}
for(const c of x){assert(md.includes(`### X · Ch ${c.no} — ${c.title}`),`missing X ${c.no}`);assert(c.branches.length>=1&&c.branches.every(b=>b.i.length),`X ${c.no} thin`)}
console.log('chapter mind maps ok');
