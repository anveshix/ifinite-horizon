// 2D condition ("sub-image") pictures + the haemodialysis topic. Run: node tests/conditions.js [http://localhost:8765/index.html]
// Data: every condition picture exists, loads, belongs to a real main picture, has bilingual titles and valid label positions.
// UI: in-app 2D strip, keys, Present deck (each condition is a slide), all six standalone viewers, haemodialysis 2D + 3D (every part pickable, every step plays).
const {chromium}=require('playwright');const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');const fails=[];const ok=(c,m)=>{if(!c)fails.push(m)};
const dev=/[ऀ-ॿ]/;
(async()=>{
  /* ---------- data integrity (no browser) ---------- */
  const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'public/2d/conditions.js'),'utf8'),sandbox);const CONDS=sandbox.window.VA_CONDS,ALIAS=sandbox.window.VA_COND_ALIAS||{};
  const src=fs.readFileSync(path.join(root,'assets/va-2d.js'),'utf8'),DATA=JSON.parse(src.match(/const DATA=(\{.*?\});\n/s)[1]);
  let nCond=0,noMarks=[],tiny=[];const ids=new Set();
  for(const [main,list] of Object.entries(CONDS)){
    const gi=main.lastIndexOf('/'),g=main.slice(0,gi),k=main.slice(gi+1);ok(DATA[g]&&DATA[g][k],`condition set for unknown main picture ${main}`);
    ok(list.length>=2,`${main}: only ${list.length} condition(s)`);
    list.forEach(c=>{nCond++;const f=path.join(root,'public/2d',c.img);ok(!ids.has(c.img),`duplicate file ${c.img}`);ids.add(c.img);
      ok(fs.existsSync(f),`missing file ${c.img}`);if(fs.existsSync(f)&&fs.statSync(f).size<4000)tiny.push(c.img);
      ok(c.title&&c.title.en&&c.title.hi&&(dev.test(c.title.hi)||c.title.hi===c.title.en),`${main}/${c.id}: title needs English + Hindi (a formula such as "F = ma" may repeat)`);ok(c.desc&&c.desc.en&&c.desc.en.length>8,`${main}/${c.id}: description`);
      ok(Array.isArray(c.marks),`${main}/${c.id}: marks`);if(!c.marks.length)noMarks.push(main+'/'+c.id);
      (c.marks||[]).forEach((m,i)=>{ok(m.x>=0&&m.x<=100&&m.y>=0&&m.y<=100,`${main}/${c.id} mark ${i} outside the picture`);ok(m.en&&m.hi&&dev.test(m.hi),`${main}/${c.id} mark ${i} needs English + Hindi`)});
      ok(!c.title.en.match(/^\d+\s*·/),`${main}/${c.id}: step number left in the title`);
      ok(!/ch5\/(heart|lungs)3d|ch10\/eye3d|ix2\/joint3d/.test(c.src||'')||/CC BY-SA/.test(c.credit||''),`${main}/${c.id}: picture derived from an anatomy pack must carry its CC BY-SA credit`)});
  }
  ok(nCond>=100,`expected ≥ 100 condition pictures, found ${nCond}`);ok(!tiny.length,`suspiciously small images: ${tiny.slice(0,3)}`);ok(noMarks.length===0,`${noMarks.length} condition picture(s) without labels: ${noMarks.slice(0,5).join(', ')}`);
  ok(DATA['class10/biology'].dialysis&&DATA['class10/biology'].dialysis.marks.length>=12,'haemodialysis main picture / labels missing');
  ok(fs.existsSync(path.join(root,'public/2d/class10/biology/images/dialysis.webp')),'dialysis.webp missing');
  ok((CONDS['class10/biology/dialysis']||[]).length===7,'dialysis should have 7 condition pictures');

  /* ---------- browser ---------- */
  const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:1366,height:800}});const errs=[];
  p.on('pageerror',e=>errs.push(String(e).slice(0,200)));p.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource/.test(m.text()))errs.push(m.text().slice(0,200))});
  const base=process.argv[2]||('file://'+path.join(root,'index.html'));const site=base.replace(/index\.html.*$/,'');
  await p.goto(base+'?view=2d#ch5/heart3d');await p.waitForTimeout(3500);

  /* every picture really loads and is big enough */
  const load=await p.evaluate(async list=>{const bad=[];await Promise.all(list.map(u=>new Promise(r=>{const i=new Image();i.onload=()=>{if(i.naturalWidth<800||i.naturalHeight<400)bad.push(u+' '+i.naturalWidth+'x'+i.naturalHeight);r()};i.onerror=()=>{bad.push(u+' FAILED');r()};i.src='public/2d/'+u})));return bad},[...ids,'class10/biology/images/dialysis.webp']);
  ok(load.length===0,`pictures that do not load / too small: ${load.slice(0,4).join(' | ')}`);

  /* in-app 2D strip on the heart picture */
  const main='class10/biology/circulatory_system',cs=CONDS[main];
  await p.waitForSelector('#v2dConds:not([hidden])',{timeout:8000}).catch(()=>fails.push('conditions strip not shown for the heart picture'));
  const strip=await p.evaluate(()=>({n:document.querySelectorAll('#v2dConds button').length,pressed:document.querySelector('#v2dConds button[aria-pressed="true"]')?.dataset.ci,lab:document.querySelector('#v2dConds .vcl-l')?.textContent}));
  ok(strip.n===cs.length+1&&strip.pressed==='-1'&&/Conditions/.test(strip.lab),`strip: ${JSON.stringify(strip)}`);
  for(let k=0;k<cs.length;k++){
    await p.click(`#v2dConds button[data-ci="${k}"]`);await p.waitForFunction(f=>document.querySelector('#v2dImg').src.endsWith(f)&&!document.querySelector('#v2dWrap').classList.contains('busy'),cs[k].img,{timeout:6000}).catch(()=>fails.push(`condition ${k} did not load`));
    const s=await p.evaluate(()=>({marks:document.querySelectorAll('#v2dZ .vmk').length,title:document.querySelector('#v2dTitle').textContent,desc:document.querySelector('#v2dDesc').textContent,pressed:document.querySelector('#v2dConds button[aria-pressed="true"]')?.dataset.ci,cur:__va2d.curCond()}));
    ok(s.marks===cs[k].marks.length,`condition ${k}: ${s.marks} dots, expected ${cs[k].marks.length}`);ok(s.title.includes(cs[k].title.en)&&s.title.includes(cs[k].title.hi),`condition ${k} title: ${s.title}`);ok(s.desc.length>8,'condition description');ok(/CC BY-SA/.test(s.desc),`heart condition ${k}: the CC BY-SA credit must be shown with the picture`);ok(s.pressed===String(k)&&s.cur===k,'strip pressed state');
  }
  await p.click('#v2dConds button[data-ci="-1"]');await p.waitForFunction(()=>__va2d.curCond()===-1);await p.waitForTimeout(500);
  ok(await p.evaluate(m=>document.querySelectorAll('#v2dZ .vmk').length===m,DATA[main.split('/').slice(0,2).join('/')][main.split('/')[2]].marks.length),'main picture labels not restored');
  await p.keyboard.press(']');await p.waitForTimeout(300);ok(await p.evaluate(()=>__va2d.curCond())===0,']: next condition');await p.keyboard.press(']');await p.keyboard.press('[');await p.keyboard.press('[');await p.waitForTimeout(300);ok(await p.evaluate(()=>__va2d.curCond())===-1,'[ goes back to the main picture');
  /* a topic's other pictures reset the condition */
  await p.evaluate(()=>__va2d.showCond(1));await p.evaluate(()=>{location.hash='#ch10/eyeparts'});await p.waitForTimeout(2500);ok(await p.evaluate(()=>__va2d.curCond())===-1,'changing topic must reset the condition');

  /* Present deck: every condition is its own slide, right after its main picture */
  const expectDeck=Object.values(DATA).reduce((n,g)=>n+Object.keys(g).length,0)+nCond;
  await p.evaluate(()=>{location.hash='#ch5/heart3d'});await p.waitForTimeout(2500);await p.keyboard.press('s');await p.waitForTimeout(600);
  const deck=await p.evaluate(()=>__va2d.deck());ok(deck.length===expectDeck,`present deck has ${deck.length} slides, expected ${expectDeck} (images + conditions)`);
  ok(new Set(deck).size===deck.length,'deck has duplicate slides');
  const i0=deck.indexOf(main+'#0');ok(i0>0&&deck[i0-1]===main,'first condition must follow its main picture');
  await p.evaluate(i=>__va2d.presentGoto(i-1),i0);await p.waitForFunction(m=>__va2d.curCond()===-1&&document.querySelector('#v2dTitle').textContent.length>3,null,{timeout:6000});await p.waitForTimeout(500);
  const n0=await p.evaluate(()=>document.querySelectorAll('#v2dZ .vmk').length);for(let i=0;i<n0;i++)await p.keyboard.press('Space');await p.waitForTimeout(150);await p.keyboard.press('Space');
  await p.waitForFunction(()=>__va2d.curCond()===0,null,{timeout:6000}).catch(()=>fails.push('Space after the last label should move to the first condition'));
  ok(await p.evaluate(c=>document.querySelector('#v2dTitle').textContent.includes(c),cs[0].title.en),'present title should name the condition');
  await p.keyboard.press('ArrowLeft');await p.waitForFunction(()=>__va2d.curCond()===-1,null,{timeout:6000}).catch(()=>fails.push('← from a condition (no label selected) should go back to the main picture'));
  await p.keyboard.press('Escape');

  /* haemodialysis in 2D */
  await p.evaluate(()=>{location.hash='#ch5/dialysis3d'});await p.waitForTimeout(3000);
  const dia=await p.evaluate(()=>({img:__va2d.current&&__va2d.current(),n:document.querySelectorAll('#v2dZ .vmk').length,conds:__va2d.conds()}));
  ok(dia.img==='class10/biology/dialysis'&&dia.n>=12&&dia.conds===7,`dialysis 2D: ${JSON.stringify(dia)}`);

  /* ---------- haemodialysis in 3D: loads, every part gives its info card, every step plays ---------- */
  await p.evaluate(()=>__va2d.set('3d'));await p.waitForTimeout(500);await p.evaluate(()=>{__atlas.go('ch5/dialysis3d')});await p.waitForTimeout(5000);
  ok(await p.evaluate(()=>__atlas.key())==='ch5/dialysis3d','dialysis3d did not open');
  ok(await p.evaluate(()=>document.querySelectorAll('#steps li').length)===8,'dialysis3d should have 8 steps');
  const parts=['arm','fist','needleA','needleV','lineA','lineV','pump','hep','trap','mach','dial','fibre','pot','dsy','tank','drain','mem','urea','cells'];
  for(const id of parts){const r=await p.evaluate(id=>{const k=__atlas.pick(id);const i=document.querySelector('#info');return[k,!i.hidden&&i.innerText.length>60&&/[ऀ-ॿ]/.test(i.innerText)]},id);if(id==='mem'||id==='urea'||id==='cells'){ok(r[0]===true||r[0]===false,'pick '+id)}else ok(r[0]&&r[1],`part "${id}" should be pickable and show a bilingual info card (got ${JSON.stringify(r)})`)}
  for(let s=0;s<8;s++){await p.evaluate(s=>{__atlas.goStep(s,1);__atlas.advance(2)},s);await p.waitForTimeout(250)}
  ok(await p.evaluate(()=>!/hit a problem/.test(document.querySelector('#info').innerText)),'dialysis3d stopped with an error');
  ok(await p.evaluate(()=>__atlas.labels().length)>=20,'dialysis3d labels');
  ok(await p.evaluate(()=>{const t=__atlas.topic('ch5/dialysis3d');return!!t&&t.ch.no===5}),'dialysis3d registered in chapter 5');
  ok(await p.evaluate(()=>document.querySelector('#testbtn')&&!document.querySelector('#testbtn').hidden),'dialysis3d should have a quiz');

  /* ---------- the six standalone viewers ---------- */
  const groups=['class9/biology','class9/chemistry','class9/physics','class10/biology','class10/chemistry','class10/physics'];
  for(const g of groups){
    const q=await b.newPage({viewport:{width:1280,height:720}});const pe=[];q.on('pageerror',e=>pe.push(String(e).slice(0,160)));
    await q.goto(site+'public/2d/'+g+'/viewer.html');await q.waitForTimeout(1500);
    const mains=Object.keys(CONDS).filter(k=>k.startsWith(g+'/'));if(!mains.length){await q.close();continue}
    const imgs=await q.evaluate(()=>Object.fromEntries(Object.keys(DATA).map(k=>[k,((typeof ORIG!=="undefined"&&ORIG[k])||DATA[k]).img])));
    const nm=m=>{const id=Object.keys(ALIAS).find(s=>ALIAS[s]===m);return (id||m).split('/')[2]};      // the standalone image name of an in-app picture
    const pick=mains.find(m=>Object.values(imgs).some(i=>new RegExp('images/'+nm(m)+'\\.webp$').test(i)))||mains[0],long=nm(pick);
    const sub=Object.keys(imgs).find(k=>new RegExp('images/'+long+'\\.webp$').test(imgs[k]));
    const exists=await q.evaluate(s=>!!DATA[s],sub);ok(exists,`${g}: standalone viewer has no sub "${sub}" for ${pick}`);if(!exists){await q.close();continue}
    await q.evaluate(s=>selectSub(s),sub);await q.waitForTimeout(600);
    const list=CONDS[pick];
    const st=await q.evaluate(()=>({vis:!document.getElementById('pvStrip').hidden,n:document.querySelectorAll('#pvStrip button').length}));ok(st.vis&&st.n===list.length+1,`${g}: strip ${JSON.stringify(st)} for ${pick}`);
    await q.click('#pvStrip button[data-ci="0"]');await q.waitForFunction(f=>document.getElementById('mainImg').src.endsWith(f),list[0].img,{timeout:6000}).catch(()=>fails.push(`${g}: condition picture did not show`));
    ok(await q.evaluate(n=>document.querySelectorAll('#labels .mark').length===n,list[0].marks.length),`${g}: standalone dots for the condition`);
    ok(await q.evaluate(t=>document.getElementById('imgTitle').textContent.includes(t),list[0].title.en),`${g}: standalone title names the condition`);
    await q.keyboard.press(']');await q.waitForTimeout(500);ok(await q.evaluate(()=>__va2dPresent.curCond())===1,`${g}: ] key`);
    const total=await q.evaluate(()=>[...document.querySelectorAll('.sub[data-sub]')].length);
    const deck=await q.evaluate(()=>__va2dPresent.deck());const subs=await q.evaluate(()=>[...document.querySelectorAll('.sub[data-sub]')].map(e=>e.dataset.sub));
    const idOf=im=>{const m=im.match(/^(?:\.\.\/\.\.\/(class\d+\/[a-z]+)\/)?images\/([^\/]+)\.webp$/);if(!m){console.log("NOMATCH",g,im);return "x"}return (m[1]||g)+"/"+m[2]};
    const expN=subs.reduce((n,k)=>n+1+(((CONDS[idOf(imgs[k])]||CONDS[ALIAS[idOf(imgs[k])]])||[]).length),0);
    ok(deck.length===expN,`${g}: present deck ${deck.length} vs ${expN} (sidebar entries ${total} + conditions)`);
    /* choosing another picture restores the original data */
    const other=subs.find(s=>s!==sub);await q.evaluate(s=>selectSub(s),other);await q.waitForTimeout(400);
    await q.evaluate(s=>selectSub(s),sub);await q.waitForTimeout(500);
    ok(await q.evaluate(()=>!document.getElementById('mainImg').src.includes('conditions/')&&!/ · [A-Z]/.test(document.getElementById('imgTitle').textContent.slice(0,0))),`${g}: returning to a picture must show the main image again`);
    ok(pe.length===0,`${g}: page errors ${pe.slice(0,2)}`);await q.close();
  }
  ok(errs.length===0,'console/page errors: '+errs.slice(0,4).join(' | '));
  await b.close();
  console.log(`conditions · ${nCond} condition pictures · failures ${fails.length}`);fails.forEach(f=>console.log(' ✗',f));process.exit(fails.length?1:0);
})();
