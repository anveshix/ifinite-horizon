// Curiosity Lab checks. Run: node tests/curiosity.js [http://localhost:8765/index.html]   (needs Playwright + Chromium)
// Phase 1: launcher, overlay shell, HUD, tab gating, focus/pause handling, core.js (registry contract, snap, XP/level, store).
const {chromium}=require('playwright');const path=require('path');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m)};
(async()=>{
  const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:1366,height:800}});const errs=[];
  p.on('pageerror',e=>errs.push(String(e).slice(0,200)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,200))});
  const url=process.argv[2]||('file://'+path.resolve(__dirname,'..','index.html'));await p.goto(url);await p.waitForTimeout(2500);
  /* lazy: nothing of the lab is loaded until the first tap */
  ok(await p.evaluate(()=>!document.getElementById('cl')&&!document.getElementById('clCss')),'Curiosity Lab loaded before first tap (must be lazy)');
  /* the Home button works from the landing page too */
  await p.click('#home .clBtn');await p.waitForSelector('#cl:not([hidden])',{timeout:8000});await p.click('#clClose');
  await p.evaluate(()=>{location.hash='#ch9/optics'});await p.waitForTimeout(3500);
  const before=await p.evaluate(()=>({tabs:document.querySelectorAll('#stagebar > *').length,pause:window.__vaPause}));

  /* launcher */
  ok(await p.evaluate(()=>!!document.querySelector('#stagebar .clBtn')),'launcher button missing in stage bar');
  ok(await p.evaluate(()=>!!document.querySelector('#home .clBtn')),'launcher button missing on Home');

  /* open / shell */
  await p.focus('#stagebar .clBtn');await p.click('#stagebar .clBtn');await p.waitForSelector('#cl:not([hidden])',{timeout:8000});
  const s=await p.evaluate(()=>{const d=document.getElementById('cl');return{role:d.getAttribute('role'),modal:d.getAttribute('aria-modal'),pause:window.__vaPause,bodyCls:document.body.classList.contains('cl-open'),quizDisabled:document.getElementById('clTabQuiz').disabled,xp:document.querySelector('#clXp b').textContent,streak:document.querySelector('#clStreak b').textContent,lv:document.querySelector('.cl-lvn').textContent,picker:!document.getElementById('clPick').hidden,lab:!document.getElementById('clLab').hidden,empty:(document.querySelector('.cl-empty')||{}).textContent||''}});
  ok(s.role==='dialog'&&s.modal==='true','dialog semantics missing');ok(s.pause===true&&s.bodyCls,'atlas 3D loop not paused while open');
  ok(s.quizDisabled,'quiz tab must be locked before any experiment');ok(s.xp==='0'&&s.streak==='0'&&s.lv==='Lv 1','HUD should start at 0 XP / 0 streak / Lv 1');
  ok(s.picker&&!s.lab,'picker should show first');
  ok(await p.evaluate(()=>getComputedStyle(document.getElementById('clLab')).display==='none'&&getComputedStyle(document.getElementById('clQuiz')).display==='none'&&getComputedStyle(document.getElementById('clPick')).display!=='none'),'hidden sections must be display:none (only the picker visible)');
  await p.screenshot({path:process.env.SHOT||'/tmp/curiosity-phase1.png'});

  /* keyboard: focus trap + Esc restores everything */
  for(let i=0;i<12;i++)await p.keyboard.press('Tab');
  ok(await p.evaluate(()=>document.getElementById('cl').contains(document.activeElement)),'focus escaped the dialog');
  await p.keyboard.press('Escape');await p.waitForTimeout(200);
  const e1=await p.evaluate(()=>({hidden:document.getElementById('cl').hidden,pause:window.__vaPause,cls:document.body.classList.contains('cl-open'),focus:document.activeElement&&document.activeElement.className}));
  ok(e1.hidden&&!e1.cls,'Esc did not close');ok(e1.pause===before.pause,'pause flag not restored');ok(/clBtn/.test(e1.focus||''),'focus not returned to launcher');
  /* K key opens */
  await p.keyboard.press('k');await p.waitForSelector('#cl:not([hidden])',{timeout:3000}).catch(()=>fails.push('K key did not open'));await p.click('#clClose');
  ok(await p.evaluate(()=>document.getElementById('cl').hidden),'close button failed');

  /* core.js unit checks inside the page */
  const u=await p.evaluate(async()=>{
    const c=await import(new URL('assets/curiosity/core.js',location.href).href);const out=[];const t=(n,f)=>{try{out.push([n,!!f()])}catch(e){out.push([n,false,String(e).slice(0,80)])}};
    const bad=(o,re)=>{try{c.registerLab(o);return false}catch(e){return re.test(e.message)}};
    const good=()=>({id:'t-lens',cls:10,unit:'x/ch9',icon:'🔭',title:{en:'T',hi:'ट'},blurb:{en:'b',hi:'ब'},vars:[{id:'u',label:{en:'u',hi:'यू'},unit:'cm',min:10,max:50,step:1,value:30}],mount(){return{}},facts(v){return[]},questions(){return[]},snapshot(){}});
    c._resetLabs();
    t('valid lab registers',()=>c.registerLab(good()).id==='t-lens'&&c.labs().length===1&&c.getLab('t-lens'));
    t('duplicate id rejected',()=>bad(good(),/duplicate/));
    t('unknown unit rejected',()=>bad({...good(),id:'a',unit:'x/ch99'},/not an NCERT unit/));
    t('class/unit mismatch rejected',()=>bad({...good(),id:'b',cls:9},/belongs to class 10/));
    t('bad variable range rejected',()=>bad({...good(),id:'c',vars:[{...good().vars[0],value:99}]},/min ≤ value ≤ max/));
    t('missing hindi rejected',()=>bad({...good(),id:'d',title:{en:'x'}},/\{en, hi\}/));
    t('missing mount rejected',()=>bad({...good(),id:'e',mount:null},/mount must be a function/));
    t('missing snapshot rejected',()=>bad({...good(),id:'e2',snapshot:null},/snapshot must be a function/));
    t('question validator accepts a good question and rejects bad ones',()=>{const q={id:'q',kind:'name',prompt:{en:'a',hi:'क'},why:{en:'b',hi:'ख'},image:null,options:[{id:'o0',en:'x',hi:'क'},{id:'o1',en:'y',hi:'ख'}],answer:'o1'};const rej=o=>{try{c.validateQuestion(o);return false}catch{return true}};return c.validateQuestion(q)===q&&rej({...q,answer:'zz'})&&rej({...q,options:[q.options[0],{...q.options[1],en:'x'}]})&&rej({...q,options:[q.options[0]]})&&rej({...q,kind:'x'})});
    t('frozen lab',()=>Object.isFrozen(c.getLab('t-lens')));
    t('snap clamps + steps',()=>{const v={min:0,max:10,step:0.5};return c.snap(v,3.26)===3.5&&c.snap(v,-4)===0&&c.snap(v,99)===10&&c.snap({min:0,max:1,step:0.1},0.30000000000000004)===0.3});
    t('defaults',()=>c.defaults(c.getLab('t-lens')).u===30);
    t('level maths',()=>c.levelInfo(0).level===1&&c.levelInfo(99).level===1&&c.levelInfo(100).level===2&&c.levelInfo(300).level===3&&c.levelInfo(300).into===0);
    c.store.reset();
    t('tweak counts distinct values',()=>{c.store.recordTweak('t-lens','u',31);c.store.recordTweak('t-lens','u',31);c.store.recordTweak('t-lens','u',32);const r=c.store.lab('t-lens');return r.tweaks===3&&r.explored.u.length===2&&c.store.explored('t-lens')===1});
    t('streak + XP',()=>{const a=c.store.recordAnswer('t-lens',true),b2=c.store.recordAnswer('t-lens',true),w=c.store.recordAnswer('t-lens',false);return a.gained===10&&b2.gained===12&&w.gained===0&&c.store.get().streak===0&&c.store.get().bestStreak===2&&c.store.get().xp===22});
    t('level-up flag',()=>{c.store.reset();const r=c.store.recordAnswer('x',true,95);return r.leveledUp===true&&r.level===2});
    t('persists',()=>{c.store._reload();return c.store.get().xp>0});
    t('bus delivers + unsubscribes',()=>{let n=0;const off=c.bus.on('k',()=>n++);c.bus.emit('k');off();c.bus.emit('k');return n===1});
    t('bus isolates a throwing listener',()=>{const ce=console.error;console.error=()=>{};try{let n=0;c.bus.on('z',()=>{throw new Error('x')});c.bus.on('z',()=>n++);c.bus.emit('z');return n===1}finally{console.error=ce}});
    c.store.reset();c._resetLabs();
    return out});
  u.forEach(([n,r,e])=>ok(r,'core: '+n+(e?' — '+e:'')));

  /* layout of the existing atlas is untouched */
  const after=await p.evaluate(()=>({tabs:document.querySelectorAll('#stagebar > *').length,overflowX:document.documentElement.scrollWidth>innerWidth+1}));
  ok(after.tabs===before.tabs,`stage bar children changed while using the lab (${before.tabs} -> ${after.tabs})`);ok(await p.evaluate(()=>document.querySelectorAll('#stagebar .clBtn').length===1),'expected exactly one launcher in the stage bar');ok(!after.overflowX,'page gained horizontal overflow');
  ok(errs.length===0,'console/page errors: '+errs.slice(0,3).join(' | '));
  await b.close();
  console.log(`curiosity core + shell · core checks ${u.length} · failures ${fails.length}`);fails.forEach(f=>console.log(' ✗',f));
  process.exit(fails.length?1:0);
})();
