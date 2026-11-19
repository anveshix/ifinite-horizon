#!/usr/bin/env node
/* Build the AI endpoint's compact curriculum snapshot from the existing Class IX registry. */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
function extract(marker){const at=source.indexOf(marker);if(at<0)throw new Error(`Could not find registry ${marker}`);const start=at+marker.length-1;let depth=0,quote='',escaped=false,end=-1;for(let i=start;i<source.length;i++){const ch=source[i];if(quote){if(escaped)escaped=false;else if(ch==='\\')escaped=true;else if(ch===quote)quote='';continue;}if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue;}if(ch==='[')depth++;else if(ch===']'&&--depth===0){end=i+1;break;}}if(end<0)throw new Error(`Could not parse registry ${marker}`);return source.slice(start,end);}
const literal=extract('const IXC=['),legacyLiteral=extract('const IX25=[');
const refs=new Proxy({
  TP:(id,title,hi,_model,summary)=>({id,title,hi,summary}),
  reuse:(...args)=>args[1],
  LV:'World of living',MT:'Matter',ES:'Earth as a system',PH:'Motion, force, work & sound',
  COL:{lv:'#',mt:'#',es:'#',ph:'#',ad:'#'},Mmatter:undefined
},{get(target,key){if(key in target)return target[key];if(key===Symbol.unscopables)return undefined;return undefined;}});
const modules=vm.runInNewContext(`(()=>{return (${literal})})()`,refs,{timeout:1000});
const legacy=vm.runInNewContext(`(()=>{return (${legacyLiteral})})()`,refs,{timeout:1000});
const coverage=JSON.parse(fs.readFileSync(path.join(root,'docs/class9-coverage.json'),'utf8'));
const snapshot={schemaVersion:2,source:'Class IX registry in index.html (IXC)',generatedAt:coverage.generated||'unknown',course:{id:'ix',title:'Class IX · Compulsory Science (086)'},chapters:modules.map(ch=>({
  id:ch.kp,number:String(ch.no),title:ch.title,unit:ch.unit,brief:ch.brief||'',briefHi:ch.briefHi||'',topics:(ch.topics||[]).map(t=>({id:t.id,title:t.title,summary:t.summary||''})),keyConcepts:ch.kc||[],learningOutcomes:ch.lo||[],activities:ch.act||[],practicals:ch.prac||[],reviewFlags:ch.flags||[]
}))};
const out=path.join(root,'api/ai/curriculum.json');
fs.mkdirSync(path.dirname(out),{recursive:true});
fs.writeFileSync(out,JSON.stringify(snapshot,null,2)+'\n');
const legacySnapshot={schemaVersion:1,source:'CBSE Science (086), Class IX 2025–26 syllabus + NCERT 2024–25 Chapter 1; separate historical track',generatedAt:coverage.generated||'unknown',course:{id:'ix25',title:'Class IX · CBSE Science (086), 2025–26'},chapters:legacy.map(ch=>({id:ch.kp,number:String(ch.no),title:ch.title,unit:ch.unit,brief:ch.brief||'',briefHi:ch.briefHi||'',topics:(ch.topics||[]).map(t=>({id:t.id,title:t.title,summary:t.ref||''})),keyConcepts:ch.kc||[],learningOutcomes:ch.lo||[],practicals:[],reviewFlags:ch.flags||[]}))};
const legacyOut=path.join(root,'api/ai/supplementary-curriculum.json');fs.writeFileSync(legacyOut,JSON.stringify(legacySnapshot,null,2)+'\n');
console.log(`Wrote ${snapshot.chapters.length} current and ${legacySnapshot.chapters.length} historical-track chapters.`);
