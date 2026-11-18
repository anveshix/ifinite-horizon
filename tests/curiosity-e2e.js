// Curiosity Lab · end-to-end student → teacher journey. Run: node tests/curiosity-e2e.js [http://localhost:8765/index.html]
// Topic page → "Try it yourself" card → lab → nudge → Knowledge check built from the student's own settings → My report → report code →
// teacher dashboard (columns, summary, CSV) · old codes still import · hostile codes are ignored · adaptive difficulty · Home badge.
const {chromium}=require('playwright');const path=require('path');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m)};
const b64=s=>Buffer.from(s,'utf8').toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const mf=s=>{let e=7;for(let t=0;t<s.length;t++)e=(e*31+s.charCodeAt(t))%1679616;return e.toString(36).padStart(4,'0')};
const mkCode=o=>{const s=b64(JSON.stringify(o));return`VA1.${s}.${mf(s)}`};
(async()=>{
  const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const ctx=await b.newContext({viewport:{width:1366,height:800},acceptDownloads:true});const p=await ctx.newPage();const errs=[];
  p.on('pageerror',e=>errs.push(String(e).slice(0,200)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,200))});
  const url=process.argv[2]||('file://'+path.resolve(__dirname,'..','index.html'));
  await p.goto(url);await p.waitForTimeout(2800);
  const core=()=>p.evaluate(async()=>{const c=await import(new URL('assets/curiosity/core.js',location.href).href);const s=c.store.get();return{xp:s.xp,answered:s.answered,correct:s.correct,best:s.bestStreak,labs:JSON.parse(JSON.stringify(s.labs))}});
  const round=()=>p.evaluate(()=>{const R=document.querySelector('#clQuiz .cq').__round();return{i:R.i,n:R.qs.length,ans:R.qs[R.i]&&R.qs[R.i].answer,ids:R.qs[R.i]&&R.qs[R.i].opts.map(o=>o.id),kind:R.qs[R.i]&&R.qs[R.i].kind,done:!!R.done}});

  /* ---- Home: plain button before any XP ---- */
  ok(await p.evaluate(()=>/Curiosity Lab\s*→?$/.test(document.querySelector('#home .clBtn').textContent.trim())),'Home button should be plain before the first XP');

  /* ---- topic page: the "try it yourself" card appears only on lab topics ---- */
  await p.evaluate(()=>{location.hash='#ch5/heart'});await p.waitForTimeout(2500);
  ok(await p.evaluate(()=>document.getElementById('clLink').hidden),'link card must be hidden on an unrelated topic (heart)');
  const keys=await p.evaluate(()=>__atlas.keys());
  const links=await p.evaluate(()=>window.__curiosity.links);
  for(const k of Object.keys(links))ok(keys.includes(k),`LINKS references a topic that does not exist: ${k}`);
  for(const [k,v] of Object.entries(links)){
    await p.evaluate(k=>{location.hash='#'+k},k);await p.waitForFunction(()=>!document.getElementById('clLink').hidden,null,{timeout:5000}).catch(()=>fails.push(`card did not show on ${k}`));
    const txt=await p.evaluate(()=>document.querySelector('#clLink b').textContent);ok(txt.includes(v[1]),`card on ${k} should name ${v[1]}: ${txt}`);
  }
  /* each lab topic opens the right lab */
  for(const [k,v] of Object.entries(links)){
    await p.evaluate(k=>{location.hash='#'+k},k);await p.waitForFunction(()=>!document.getElementById('clLink').hidden,null,{timeout:5000});await p.waitForTimeout(700);
    await p.click('#clLink button');await p.waitForSelector('#clStage[data-ready="1"] canvas',{timeout:15000}).catch(()=>fails.push(`${k}: lab did not start`));
    ok(await p.evaluate(l=>document.querySelector('#clLabT').textContent.includes(l),v[1].split(' ')[0]),`${k} opened the wrong lab`);
    await p.evaluate(()=>document.getElementById('clClose').click());await p.waitForTimeout(150);
  }

  /* ---- the journey in the Lens Lab ---- */
  await p.evaluate(()=>{location.hash='#ch9/optics'});await p.waitForFunction(()=>!document.getElementById('clLink').hidden,null,{timeout:5000});await p.waitForTimeout(600);
  await p.click('#clLink button');await p.waitForSelector('#clStage[data-ready="1"] canvas',{timeout:15000});
  const setU=v=>p.evaluate(v=>{const i=document.querySelector('#clSide .cl-row[data-var="u"] input');i.value=v;i.dispatchEvent(new Event('input',{bubbles:true}))},v);
  await setU(35);await setU(20);await setU(12);
  ok(await p.evaluate(()=>!document.querySelector('.cl-nudge')),'nudge too early (after 3 settings)');ok(await p.evaluate(()=>!document.getElementById('clTabQuiz').classList.contains('ready')),'quiz tab pulsing too early');
  await setU(8);await p.waitForTimeout(300);
  ok(await p.evaluate(()=>!!document.querySelector('.cl-nudge')&&document.getElementById('clTabQuiz').classList.contains('ready')),'after 4 different settings the simulator must suggest the check');
  await p.click('.cl-nudge .cl-act');await p.waitForSelector('.cq-card');
  ok(await p.evaluate(()=>/Built from your experiments/.test(document.querySelector('.cq-based').textContent)&&/Object distance u/.test(document.querySelector('.cq-based').textContent)&&/35, 20, 12, 8/.test(document.querySelector('.cq-based').textContent)),'quiz must show the settings the student tried');
  /* answer: 2 wrong, the rest right */
  let g=0;while(!(await round()).done&&g++<14){const r=await round();if(r.i<2&&await p.evaluate(()=>!document.getElementById('cqNext')))await p.click(`.cq-opt[data-id="${r.ids.find(x=>x!==r.ans)}"]`);else if(await p.evaluate(()=>!document.getElementById('cqNext')))await p.click(`.cq-opt[data-id="${r.ans}"]`);if(await p.evaluate(()=>!!document.getElementById('cqNext')))await p.click('#cqNext');await p.waitForTimeout(80)}
  await p.waitForSelector('.cq-sum');const S=await core();
  ok(S.answered>=6&&S.xp>0&&S.labs.lens&&S.labs.lens.answered===S.answered,`store after the round: ${JSON.stringify(S)}`);
  await p.evaluate(()=>document.getElementById('clClose').click());

  /* ---- progress reaches the atlas ---- */
  const rs=await p.evaluate(()=>window.__curiosity.reportString());ok(new RegExp(`^${S.xp}\\.${S.answered}\\.${S.correct}\\.${S.best}~lens:${S.answered}:${S.correct}$`).test(rs),`report string ${rs}`);
  await p.evaluate(()=>__atlas.myReport());await p.waitForSelector('#stCode',{timeout:5000});
  await p.fill('#stN','Asha Test');await p.fill('#stC','X-B');await p.fill('#stR','7');
  ok(await p.evaluate(x=>[...document.querySelectorAll('#report .chips span')].some(s=>s.textContent.includes('Curiosity XP')&&s.textContent.includes(String(x))),S.xp),'My report should show Curiosity XP');
  ok(await p.evaluate(()=>[...document.querySelectorAll('#report .chips span')].some(s=>/lab questions right/.test(s.textContent))),'My report should show lab accuracy');
  const code=await p.inputValue('#stCode');ok(/^VA1\.[\w-]+\.[a-z0-9]{4}$/.test(code),'report code format');
  const payload=JSON.parse(Buffer.from(code.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'),'base64').toString('utf8'));
  ok(JSON.stringify(Object.keys(payload).sort())===JSON.stringify(['c','cl','k','n','q','r','t','v']),`report payload keys must stay minimal: ${Object.keys(payload)}`);ok(payload.cl===rs,'cl field');
  await p.evaluate(()=>document.querySelector('#report .x').click());

  /* ---- teacher side ---- */
  await p.evaluate(()=>__atlas.teacher());await p.waitForSelector('#tIn',{timeout:5000});
  const oldCode=mkCode({n:'Old Code Student',c:'X-A',r:'3',t:Date.now(),k:1,v:'1',q:''});                                   // from before the Curiosity Lab existed
  const evilCl=mkCode({n:'Evil Cl',c:'X-A',r:'4',t:Date.now(),k:1,v:'1',q:'',cl:'9.9.9.9~<img src=x onerror=window.__pwned=1>:1:1,lens:5:5'});
  const hugeCl=mkCode({n:'Huge Cl',c:'X-A',r:'5',t:Date.now(),k:1,v:'1',q:'',cl:'999999999999.5.99.7~lens:5:99'});
  const junkCl=mkCode({n:'Junk Cl',c:'X-A',r:'6',t:Date.now(),k:1,v:'1',q:'',cl:'not a number'});
  const tampered=code.slice(0,code.length-1)+(code.slice(-1)==='a'?'b':'a');
  await p.fill('#tIn',[code,oldCode,evilCl,hugeCl,junkCl,tampered].join('\n'));await p.click('#tAdd');await p.waitForTimeout(300);
  const msg=await p.textContent('#tMsg');ok(/6 code\(s\) found/.test(msg)&&/5 added/.test(msg)&&/1 damaged/.test(msg),`teacher import message: ${msg} (5 good, 1 tampered expected)`);
  const T=await p.evaluate(()=>{const rows=[...document.querySelectorAll('#tTable tr')].map(r=>[...r.children].map(c=>c.textContent.trim()));return{head:rows[0],rows:rows.slice(1),imgs:document.querySelectorAll('#tTable img').length,pwned:!!window.__pwned,sum:document.getElementById('tSum').textContent}});
  const hi=T.head.indexOf('🧪 XP'),hp=T.head.indexOf('🧪 %');ok(hi>0&&hp===hi+1,`teacher table header ${T.head.join('|')}`);
  const rowOf=n=>T.rows.find(r=>r[0]===n);
  const asha=rowOf('Asha Test');ok(asha&&asha[hi]===String(S.xp)&&asha[hp]===Math.round(100*S.correct/S.answered)+'%',`Asha row ${asha&&asha.slice(hi,hi+2)} vs ${S.xp}/${S.correct}/${S.answered}`);
  ok(rowOf('Old Code Student')[hi]==='—'&&rowOf('Old Code Student')[hp]==='—','old-format code must show — for the lab columns');
  ok(rowOf('Junk Cl')[hi]==='—','garbage cl must be ignored');
  ok(+rowOf('Huge Cl')[hi]===1e7,'absurd XP must be clamped');ok(rowOf('Huge Cl')[hp]==='100%','correct must be clamped to answered');
  ok(rowOf('Evil Cl')&&T.imgs===0&&!T.pwned,'a hostile cl field must not inject HTML');
  ok(/avg Curiosity XP/.test(T.sum),`class summary should mention Curiosity XP: ${T.sum}`);
  const dl=p.waitForEvent('download',{timeout:5000});await p.click('#tCsv');const d=await dl;const csv=require('fs').readFileSync(await d.path(),'utf8');
  const lines=csv.replace(/^﻿/,'').split('\n'),H=lines[0].split(',').map(x=>x.replace(/"/g,''));
  ok(H.includes('CuriosityXP')&&H.includes('CuriosityLabAccuracyPct')&&H.indexOf('CuriosityXP')===H.length-3,`CSV header ${H.slice(-4)}`);
  const cr=lines.find(l=>l.startsWith('"Asha Test"')).split(',').map(x=>x.replace(/"/g,''));ok(cr[H.indexOf('CuriosityXP')]===String(S.xp),'CSV row XP');ok(lines.find(l=>l.startsWith('"Old Code Student"')).split(',').map(x=>x.replace(/"/g,''))[H.indexOf('CuriosityXP')]==='','CSV old-code row must leave XP empty');
  await p.evaluate(()=>document.getElementById('tClose').click());await p.waitForTimeout(400);

  /* ---- Home badge shows level + XP ---- */
  await p.evaluate(()=>__atlas.myReport());await p.evaluate(()=>document.querySelector('#report .x').click());
  const badge=await p.evaluate(()=>document.querySelector('#home .clBtn')&&document.querySelector('#home .clBtn').textContent.trim());ok(new RegExp(`Lv \\d+ · ${S.xp} XP`).test(badge||''),`Home badge: ${badge}`);

  /* ---- adaptive difficulty: a student cruising at ≥ 85 % starts with a "predict" question ---- */
  await p.evaluate(()=>{location.hash='#ix10/forces'});await p.waitForFunction(()=>!document.getElementById('clLink').hidden,null,{timeout:5000});await p.waitForTimeout(500);
  await p.evaluate(async()=>{const c=await import(new URL('assets/curiosity/core.js',location.href).href);c.store.get().labs.force={tweaks:9,runs:1,explored:{F:[4,8,12],m:[2,4]},correct:19,answered:20}});
  await p.click('#clLink button');await p.waitForSelector('#clStage[data-ready="1"] canvas',{timeout:15000});await p.click('#clTabQuiz');await p.waitForSelector('.cq-card');
  let predictFirst=0,tries=6;for(let k=0;k<tries;k++){const r=await round();if(r.kind==='predict')predictFirst++;
    let g2=0;while(!(await round()).done&&g2++<12){const rr=await round();if(await p.evaluate(()=>!document.getElementById('cqNext')))await p.click(`.cq-opt[data-id="${rr.ans}"]`);await p.click('#cqNext');await p.waitForTimeout(40)}
    await p.waitForSelector('.cq-sum');await p.waitForTimeout(150);await p.click('#cqAgain');await p.waitForSelector('.cq-card')}
  ok(predictFirst>=tries-1,`a 95 % student should start with "predict" (got it ${predictFirst}/${tries})`);
  await p.evaluate(()=>document.getElementById('clClose').click());

  /* ---- the atlas's own progress is untouched ---- */
  ok(await p.evaluate(()=>{const o=JSON.parse(localStorage.getItem('va.progress')||'{}');return Object.keys(o).every(k=>['v','p','q','last'].includes(k))}),'va.progress gained unexpected keys');
  ok(errs.length===0,'console/page errors: '+errs.slice(0,4).join(' | '));
  await b.close();
  console.log(`curiosity end-to-end · failures ${fails.length}`);fails.forEach(f=>console.log(' ✗',f));process.exit(fails.length?1:0);
})();
