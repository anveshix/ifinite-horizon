#!/usr/bin/env node
/* Build the AI endpoint's compact curriculum snapshot from the existing Class IX registry. */
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const marker='const IXC=[';
const at=source.indexOf(marker);
if(at<0)throw new Error('Could not find the Class IX curriculum registry (IXC).');
const start=at+marker.length-1;
let depth=0,quote='',escaped=false,end=-1;
for(let i=start;i<source.length;i++){
  const ch=source[i];
  if(quote){if(escaped)escaped=false;else if(ch==='\\')escaped=true;else if(ch===quote)quote='';continue;}
  if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue;}
  if(ch==='[')depth++;
  else if(ch===']'&&--depth===0){end=i+1;break;}
}
if(end<0)throw new Error('Could not parse the Class IX curriculum registry.');
const literal=source.slice(start,end);
const refs=new Proxy({
  TP:(id,title,hi,_model,summary)=>({id,title,hi,summary}),
  reuse:(...args)=>args[1],
  LV:'World of living',MT:'Matter',ES:'Earth as a system',PH:'Motion, force, work & sound',
  COL:{lv:'#',mt:'#',es:'#',ph:'#',ad:'#'}
},{get(target,key){if(key in target)return target[key];if(key===Symbol.unscopables)return undefined;return undefined;}});
const modules=vm.runInNewContext(`(()=>{return (${literal})})()`,refs,{timeout:1000});
const coverage=JSON.parse(fs.readFileSync(path.join(root,'docs/class9-coverage.json'),'utf8'));
const snapshot={schemaVersion:1,source:'Class IX registry in index.html (IXC)',generatedAt:coverage.generated||'unknown',course:{id:'ix',title:'Class IX · Compulsory Science (086)'},chapters:modules.map(ch=>({
  id:ch.kp,number:String(ch.no),title:ch.title,unit:ch.unit,brief:ch.brief||'',briefHi:ch.briefHi||'',topics:(ch.topics||[]).map(t=>({id:t.id,title:t.title,summary:t.summary||''})),keyConcepts:ch.kc||[],learningOutcomes:ch.lo||[],practicals:ch.prac||[],reviewFlags:ch.flags||[]
}))};
const out=path.join(root,'api/ai/curriculum.json');
fs.mkdirSync(path.dirname(out),{recursive:true});
fs.writeFileSync(out,JSON.stringify(snapshot,null,2)+'\n');
console.log(`Wrote ${snapshot.chapters.length} Class IX chapters to ${path.relative(root,out)}.`);
