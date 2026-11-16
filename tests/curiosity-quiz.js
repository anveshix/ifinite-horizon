// Curiosity Lab · Knowledge check + dopamine effects in a real browser. Run: node tests/curiosity-quiz.js [http://localhost:8765/index.html]
// Wrong answer ⇒ shake, flash, vibration, streak reset, correct answer revealed with the explanation.  Right answer ⇒ XP, streak, confetti pixels on the canvas,
// floating "+XP", milestone banner, level-up screen.  Also: 50:50, keyboard, speed bonus, summary maths, review → simulator, reduced motion, persistence, phone layout.
const {chromium}=require('playwright');const path=require('path');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m)};
(async()=>{
  const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const ctxB=await b.newContext({viewport:{width:1366,height:800}});
  await ctxB.addInitScript(()=>{window.__vib=[];navigator.vibrate=p=>{window.__vib.push(p);return true}});
  const p=await ctxB.newPage();const errs=[];
  p.on('pageerror',e=>errs.push(String(e).slice(0,200)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,200))});
  const url=process.argv[2]||('file://'+path.resolve(__dirname,'..','index.html'));await p.goto(url+'#ch9/optics');await p.waitForTimeout(3000);

  const core=()=>p.evaluate(async()=>{const c=await import(new URL('assets/curiosity/core.js',location.href).href);const s=c.store.get();return{xp:s.xp,streak:s.streak,best:s.bestStreak,answered:s.answered,correct:s.correct}});
  const round=()=>p.evaluate(()=>{const R=document.querySelector('#clQuiz .cq').__round();return{i:R.i,n:R.qs.length,ans:R.qs[R.i]&&R.qs[R.i].answer,ids:R.qs[R.i]&&R.qs[R.i].opts.map(o=>o.id),qid:R.qs[R.i]&&R.qs[R.i].id,done:!!R.done,results:R.results.map(r=>r.correct)}});
  const fx=()=>p.evaluate(()=>({...document.getElementById('clFx').dataset}));
  const confettiPixels=()=>p.evaluate(()=>{const c=document.querySelector('#clFx canvas');if(!c)return 0;const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4*13)if(d[i]>20)n++;return n});
  const clickOpt=id=>p.click(`.cq-opt[data-id="${id}"]`);
  const answerRight=async()=>{const r=await round();await clickOpt(r.ans);return r};
  const answerWrong=async()=>{const r=await round();await clickOpt(r.ids.find(x=>x!==r.ans));return r};
  const next=async()=>{await p.click('#cqNext');await p.waitForTimeout(120)};
  const openQuiz=async lab=>{await p.evaluate(l=>__curiosity.open(l),lab);await p.waitForSelector('#clStage[data-ready="1"] canvas',{timeout:15000});await p.evaluate(()=>{const i=document.querySelector('#clSide .cl-row input');i.value=i.min;i.dispatchEvent(new Event('input',{bubbles:true}));i.value=i.max;i.dispatchEvent(new Event('input',{bubbles:true}))});await p.click('#clTabQuiz');await p.waitForSelector('.cq-card',{timeout:5000})};
  const closeLab=()=>p.evaluate(()=>document.getElementById('clClose').click());

  /* ---------- a round in the Force Lab ---------- */
  await openQuiz('force');
  const q0=await round();ok(q0.n>=6&&q0.n<=8,`round size ${q0.n}`);
  ok(await p.evaluate(()=>/Question 1 \/ \d/.test(document.querySelector('.cq-count').textContent)),'counter text');
  ok(await p.evaluate(()=>{const c=document.getElementById('cqImg');if(!c)return true;const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let k=0;for(let i=0;i<d.length;i+=4*41)if(Math.abs(d[i]-d[0])>40)k++;return k>30}),'question picture is blank');
  const nOpts=await p.evaluate(()=>document.querySelectorAll('.cq-opt').length);ok(nOpts>=2&&nOpts<=5,`options ${nOpts}`);
  ok(await p.evaluate(()=>document.querySelectorAll('.cq-opt .hi').length===document.querySelectorAll('.cq-opt').length),'every option needs Hindi');
  const c0=await core();

  /* wrong answer */
  await answerWrong();await p.waitForTimeout(120);
  const w=await p.evaluate(()=>({wrong:document.querySelectorAll('.cq-opt.wrong').length,right:document.querySelectorAll('.cq-opt.right').length,fb:document.getElementById('cqFb').className,why:document.querySelector('.cq-why').textContent.length,shake:document.getElementById('cqCard').classList.contains('cl-shake'),flash:!!document.querySelector('.cl-flash'),focus:document.activeElement.id,show:!!document.getElementById('cqShow'),vib:window.__vib.length,disabled:[...document.querySelectorAll('.cq-opt')].every(o=>o.disabled)}));
  ok(w.wrong===1&&w.right===1,`wrong answer must mark 1 wrong + reveal 1 right (${w.wrong}/${w.right})`);ok(/no/.test(w.fb)&&w.why>20,'wrong feedback / explanation missing');
  ok(w.shake,'card did not shake on a wrong answer');ok(w.flash,'no red flash');ok(w.vib>=1,'no vibration on a wrong answer');ok(w.focus==='cqNext','focus should move to Next');ok(w.show,'"Show me in the simulator" missing');ok(w.disabled,'options must lock after answering');
  const fxW=await fx();ok(+fxW.fxShakes===1,`shake counter ${fxW.fxShakes}`);
  const c1=await core();ok(c1.streak===0&&c1.answered===c0.answered+1&&c1.xp===c0.xp,'wrong answer must not give XP and must reset the streak');
  await next();

  /* right answer: XP, confetti pixels, floating text */
  const before=await core();await answerRight();await p.waitForTimeout(160);
  const r1=await p.evaluate(()=>({right:document.querySelectorAll('.cq-opt.right').length,wrong:document.querySelectorAll('.cq-opt.wrong').length,fb:document.getElementById('cqFb').className,head:document.querySelector('.cq-head').textContent,xp:document.querySelector('.cq-xp').textContent,float:!!document.querySelector('.cl-float'),flame:document.querySelector('#cqFlame b').textContent}));
  ok(r1.right===1&&r1.wrong===0&&/ok/.test(r1.fb)&&/Perfect/.test(r1.head),'right answer feedback');ok(/\+\d+ XP/.test(r1.xp),'XP text');ok(r1.float,'no floating +XP');ok(r1.flame==='1','streak flame should show 1');
  const after=await core();ok(after.xp>=before.xp+10&&after.streak===1,`XP/streak: ${before.xp}→${after.xp}, streak ${after.streak}`);
  ok(await confettiPixels()>3,'no confetti pixels drawn on the canvas');ok((await fx()).fxSpawned>=50,'confetti not spawned');
  await p.waitForTimeout(900);ok(await p.evaluate(x=>document.querySelector('#clXp b').textContent===String(x),after.xp),'HUD XP did not count up to the stored XP');
  await next();

  /* streak of 3 ⇒ milestone banner */
  await answerRight();await next();await answerRight();await p.waitForTimeout(700);
  ok(await p.evaluate(()=>/On fire/.test((document.querySelector('.cq-banner')||{}).textContent||'')),'streak-3 banner "On fire" missing');
  ok(await p.evaluate(()=>document.getElementById('cqFlame').classList.contains('hot')),'flame should glow at streak 3');
  await next();

  /* 50:50 */
  const q50=await round();
  if(q50.ids.length>=3){await p.click('#cqFifty');const g=await p.evaluate(()=>({gone:document.querySelectorAll('.cq-opt.gone').length,dis:document.getElementById('cqFifty').disabled}));
    ok(g.gone===Math.min(2,q50.ids.length-1)&&g.dis,`50:50 removed ${g.gone}`);
    ok(await p.evaluate(a=>!document.querySelector(`.cq-opt[data-id="${a}"]`).classList.contains('gone'),q50.ans),'50:50 removed the right answer!');
    await answerRight();ok(await p.evaluate(()=>/50:50 used/.test(document.querySelector('.cq-xp').textContent)),'50:50 answer must say no speed bonus');await next()}
  /* keyboard: 1 answers, Enter moves on */
  const kq=await round();await p.keyboard.press('1');await p.waitForTimeout(150);ok(await p.evaluate(()=>[...document.querySelectorAll('.cq-opt')].some(o=>o.disabled)),'key 1 did not answer');
  await p.keyboard.press('Enter');await p.waitForTimeout(150);ok((await round()).i===kq.i+1,'Enter did not go to the next question');

  /* finish the round, then check the summary maths */
  let guard=0;while(!(await round()).done&&guard++<12){const r=await round();if(r.i>=r.n)break;const anyAnswered=await p.evaluate(()=>!!document.getElementById('cqNext'));if(!anyAnswered){if(guard%3===0)await answerWrong();else await answerRight()}
    if(await p.evaluate(()=>!!document.getElementById('cqNext')))await next()}
  await p.waitForSelector('.cq-sum',{timeout:5000});await p.waitForTimeout(1200);
  const R=await round(),tally=R.results.filter(Boolean).length,sum=await p.evaluate(()=>({stats:[...document.querySelectorAll('.cq-stats b')].map(x=>x.textContent),pct:document.getElementById('cqPct').textContent,off:document.querySelector('.cq-ring .fg').style.strokeDashoffset,C:+document.querySelector('.cq-ring .fg').style.strokeDasharray,review:document.querySelectorAll('.cq-rv').length}));
  ok(sum.stats[0]===`${tally} / ${R.results.length}`,`summary score ${sum.stats[0]} vs tally ${tally}/${R.results.length}`);
  ok(+sum.pct===Math.round(tally/R.results.length*100),`summary percent ${sum.pct}`);ok(Math.abs(+sum.off-sum.C*(1-tally/R.results.length))<0.5,'ring does not match the score');
  ok(sum.review===R.results.length-tally,`review lists ${sum.review}, expected ${R.results.length-tally}`);
  ok(+sum.stats[1].replace('+','')>0,'XP earned in summary should be > 0');
  const cs=await core();ok(cs.answered-c0.answered===R.results.length,`store counted ${cs.answered-c0.answered} answers for a round of ${R.results.length}`);
  /* review → simulator */
  if(sum.review>0){await p.click('[data-show="0"]');await p.waitForTimeout(400);ok(await p.evaluate(()=>!document.getElementById('clLab').hidden&&document.getElementById('clQuiz').hidden),'Show me should return to the simulator')}
  /* leave and come back: the finished round is kept; "new round" gives a fresh one */
  await p.click('#clTabQuiz');await p.waitForSelector('.cq-sum');await p.click('#cqAgain');await p.waitForSelector('.cq-card');ok((await round()).i===0&&!(await round()).done,'new round should start at question 1');

  /* ---------- level-up screen ---------- */
  await p.evaluate(async()=>{const c=await import(new URL('assets/curiosity/core.js',location.href).href),s=c.store.get(),li=c.levelInfo(s.xp);s.xp=s.xp-li.into+li.span-5});            // 5 XP below the next level
  const lv0=await p.evaluate(async()=>{const c=await import(new URL('assets/curiosity/core.js',location.href).href);return c.levelInfo(c.store.get().xp).level});
  await answerRight();await p.waitForTimeout(1500);
  const lv1=await p.evaluate(async()=>{const c=await import(new URL('assets/curiosity/core.js',location.href).href);return c.levelInfo(c.store.get().xp).level});
  if(lv1>lv0)ok(await p.evaluate(()=>/LEVEL \d+/.test((document.querySelector('.cq-level')||{}).textContent||'')),'level-up screen missing');else ok(false,`expected a level-up (${lv0}→${lv1})`);
  await p.waitForTimeout(2500);

  /* ---------- sounds toggle persists ---------- */
  await next().catch(()=>{});await p.click('#cqSnd');ok(await p.evaluate(()=>localStorage.getItem('va.cl.snd')==='1'),'sound toggle did not persist');await p.click('#cqSnd');
  await closeLab();

  /* ---------- reduced motion: no shake / confetti, feedback still clear ---------- */
  await p.emulateMedia({reducedMotion:'reduce'});await openQuiz('ohm');
  const fx0=await fx();await answerWrong();await p.waitForTimeout(150);
  ok(await p.evaluate(()=>!document.getElementById('cqCard').classList.contains('cl-shake')&&document.querySelectorAll('.cq-opt.wrong').length===1&&document.getElementById('cqFb').className.includes('no')),'reduced motion: wrong feedback must still show, without shaking');
  await next();const sp0=(await fx()).fxSpawned||0;await answerRight();await p.waitForTimeout(150);ok(((await fx()).fxSpawned||0)===sp0,'reduced motion: confetti must not spawn');ok(await p.evaluate(()=>document.querySelectorAll('.cq-opt.right').length===1),'reduced motion: right answer still highlighted');
  await p.emulateMedia({reducedMotion:'no-preference'});void fx0;await closeLab();

  /* ---------- a perfect round in every lab ⇒ 100 %, rain of confetti, no errors ---------- */
  for(const lab of ['lens','ohm','force','energy']){
    await openQuiz(lab);let g=0;
    if((await round()).results.length>0){while(!(await round()).done&&g++<12){if(await p.evaluate(()=>!document.getElementById('cqNext')))await answerRight();await next()}await p.waitForSelector('.cq-sum');await p.click('#cqAgain');await p.waitForSelector('.cq-card')}     // an earlier test left a half-played round: start a clean one
    g=0;while(!(await round()).done&&g++<12){await answerRight();await next()}
    await p.waitForSelector('.cq-sum',{timeout:5000});await p.waitForTimeout(1300);
    const S=await p.evaluate(()=>({pct:document.getElementById('cqPct').textContent,all:!!document.querySelector('.cq-allgood'),sum:document.querySelector('.cq-sum').parentElement.dataset.summary}));
    ok(+S.pct===100||await p.evaluate(()=>document.getElementById('cqPct').textContent==='100'),`${lab}: perfect round should read 100% (${S.pct})`);ok(S.all,`${lab}: perfect round should say nothing to review`);ok(await confettiPixels()>3||(await fx()).fxSpawned>200,`${lab}: no celebration for a perfect round`);
    const rr=await round();ok(rr.results.length>=6&&rr.results.every(Boolean),`${lab}: only ${rr.results.length} questions or a wrong mark`);
    await closeLab()}

  /* ---------- persistence: reload keeps XP; phone layout ---------- */
  const keep=await core();await p.reload();await p.waitForTimeout(2500);await p.evaluate(()=>__curiosity.open());await p.waitForSelector('#clXp b');
  ok(await p.evaluate(x=>document.querySelector('#clXp b').textContent===String(x),keep.xp),`XP not kept after reload (expected ${keep.xp})`);await closeLab();
  await p.setViewportSize({width:390,height:844});await openQuiz('lens');
  const mob=await p.evaluate(()=>({ox:document.documentElement.scrollWidth>innerWidth+1||document.getElementById('cl').scrollWidth>innerWidth+1,cols:getComputedStyle(document.querySelector('.cq-opts')).gridTemplateColumns.split(' ').length,w:Math.round(document.querySelector('.cq-opt').getBoundingClientRect().width)}));
  ok(!mob.ox,'phone: horizontal overflow');ok(mob.cols===1&&mob.w>300,`phone: options should be one full-width column (${mob.cols} cols, ${mob.w}px)`);
  ok(errs.length===0,'console/page errors: '+errs.slice(0,4).join(' | '));
  await b.close();
  console.log(`curiosity quiz · failures ${fails.length}`);fails.forEach(f=>console.log(' ✗',f));process.exit(fails.length?1:0);
})();
