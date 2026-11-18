/* Renders the condition ("sub-image") pictures for the 2D layer from the atlas's own 3D scenes.
   For every manifest entry it opens the 3D topic, jumps to the step (end state), hides all UI, takes a picture of the stage and records where each
   label's anchor lands in the picture, so the 2D image gets exactly the same bilingual labels as the 3D scene.
   Usage:  node tools/conditions/render.mjs [base-url=http://127.0.0.1:8765/index.html] [only-substring]   (needs Playwright + Chromium; software GL is fine)
   Output: tools/conditions/out/<slug>__<n>.png  +  out/data.json  → then  python3 tools/conditions/build.py  */
import {createRequire} from 'module';import fs from 'fs';import path from 'path';import {fileURLToPath} from 'url';
const require=createRequire(import.meta.url);const {chromium}=require('playwright');
const here=path.dirname(fileURLToPath(import.meta.url)),OUT=path.join(here,'out');fs.mkdirSync(OUT,{recursive:true});
const base=process.argv[2]||'http://127.0.0.1:8765/index.html',only=process.argv[3]||'';
const man=JSON.parse(fs.readFileSync(path.join(here,'manifest.json'),'utf8'));
const slug=s=>s.replace(/\//g,'_');
(async()=>{
  const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:1280,height:720}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto(base);await p.waitForTimeout(3500);
  await p.addStyleTag({content:'#stage>:not(canvas){visibility:hidden!important}'});      // only the 3D picture: no toolbar, captions, labels, leaders, HUD
  const dataPath=path.join(OUT,'data.json');const data=fs.existsSync(dataPath)?JSON.parse(fs.readFileSync(dataPath,'utf8')):{};
  let cur=null;
  const open=async topic=>{if(cur===topic)return;cur=topic;await p.evaluate(k=>{__atlas.go(k);__atlas.closePredict&&__atlas.closePredict()},topic);
    await p.waitForFunction(k=>__atlas.key()===k,topic,{timeout:10000}).catch(()=>{});await p.evaluate(()=>__atlas.hide(true,true));await p.waitForTimeout(2200);await p.evaluate(()=>{__atlas.closePredict&&__atlas.closePredict()})};
  const grab=async(topic,step,file,all)=>{await open(topic);
    const cap=await p.evaluate(s=>{const li=document.querySelectorAll('#steps li')[s];if(!li)return null;return{en:li.querySelector('.en')?.textContent||'',hi:li.querySelector('.hi')?.textContent||''}},step);
    if(!cap)throw new Error(`no step ${step} in ${topic}`);
    await p.evaluate(s=>{__atlas.goStep(s,1);__atlas.advance(3);__atlas.settle&&__atlas.settle()},step);await p.waitForTimeout(900);await p.evaluate(()=>{__atlas.advance(1);__atlas.settle&&__atlas.settle()});await p.waitForTimeout(700);
    if(all)await p.evaluate(()=>__atlas.tool('All labels'));            // scenes park labels that belong to other steps far away until 'All labels' is on
    const anchors=await p.evaluate(a=>__atlas.anchors(a),!!all);
    if(all)await p.evaluate(()=>__atlas.tool('All labels'));
    const bb=await p.evaluate(()=>{const r=document.querySelector('#stage').getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}});await p.screenshot({path:file,clip:bb,animations:'disabled',timeout:60000});
    return{cap,anchors}};
  const split=t=>{const i=t.indexOf(' — ');return i<0?[t,'']:[t.slice(0,i),t.slice(i+3)]};
  const clean=t=>t.replace(/^\d+\s*·\s*/,'');
  for(const e of man){
    if(only&&!e.main.includes(only))continue;
    const jobs=[...(e.steps||[]).map(s=>({topic:e.topic,step:s})),...(e.conds||[])];const res=[];let k=0;
    if(e.mainStep!==undefined){const f=path.join(OUT,slug(e.main)+'__main.png');try{const r=await grab(e.topic,e.mainStep,f,!!e.mainAll);const [t0,d0]=split(clean(r.cap.en)),[h0,hd0]=split(clean(r.cap.hi));data[e.main+'#main']={file:path.basename(f),title:{en:t0,hi:h0},desc:{en:d0||t0,hi:hd0||h0},marks:r.anchors.map(a=>({x:+(a.x*100).toFixed(1),y:+(a.y*100).toFixed(1),en:a.en,hi:a.hi}))};console.log('main',e.main,r.anchors.length,'labels')}catch(x){console.log('FAIL main',e.main,x.message)}}
    for(const j of jobs){k++;const f=path.join(OUT,`${slug(e.main)}__${k}.png`);
      try{const r=await grab(j.topic,j.step,f,false);const [t1,d1]=split(clean(r.cap.en)),[h1,hd1]=split(clean(r.cap.hi));
        res.push({n:k,file:path.basename(f),topic:j.topic,step:j.step,title:{en:t1,hi:h1},desc:{en:d1||t1,hi:hd1||h1},marks:r.anchors.map(a=>({x:+(a.x*100).toFixed(1),y:+(a.y*100).toFixed(1),en:a.en,hi:a.hi}))});
        console.log('ok',e.main,k,j.topic,j.step,r.anchors.length+' labels')}catch(x){console.log('FAIL',e.main,k,j.topic,j.step,x.message)}}
    data[e.main]=res;fs.writeFileSync(dataPath,JSON.stringify(data,null,1));
  }
  console.log('page errors:',errs.length,errs.slice(0,3));await b.close();
})();
