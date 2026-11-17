// Curiosity Lab · the four simulators in a real browser. Run: node tests/curiosity-labs.js [http://localhost:8765/index.html]
// Opens every lab, drives every slider to both extremes, checks the 3D canvas really renders and changes, facts update, the quiz unlocks,
// every question image (2D snapshot) draws, labs dispose cleanly, and the lab-specific behaviour (run / swing / wiring / lens type).
const {chromium}=require('playwright');const path=require('path');
const fails=[];const ok=(c,m)=>{if(!c)fails.push(m)};
(async()=>{
  const b=await chromium.launch({args:['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
  const p=await b.newPage({viewport:{width:1366,height:800}});const errs=[];
  p.on('pageerror',e=>errs.push(String(e).slice(0,200)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,200))});
  const url=process.argv[2]||('file://'+path.resolve(__dirname,'..','index.html'));await p.goto(url+'#ch9/optics');await p.waitForTimeout(3000);
  const stageShot=async()=>(await p.locator('#clStage').screenshot()).length;
  const facts=()=>p.evaluate(()=>[...document.querySelectorAll('#clSide .cl-fl dd')].map(d=>d.textContent).join('|'));
  const setVar=(id,val)=>p.evaluate(([id,val])=>{const i=document.querySelector(`#clSide .cl-row[data-var="${id}"] input`);i.value=val;i.dispatchEvent(new Event('input',{bubbles:true}))},[id,val]);
  const LABS={lens:['u','f'],ohm:['V','R1','R2'],force:['F','m'],energy:['m','h']};
  const picker=await (async()=>{await p.evaluate(()=>__curiosity.open());await p.waitForSelector('#cl:not([hidden]) .cl-card',{timeout:15000});return p.evaluate(()=>[...document.querySelectorAll('.cl-card')].map(c=>c.dataset.lab))})();
  ok(['lens','ohm','force','energy'].every(l=>picker.includes(l)),`picker lists ${picker.join(',')}`);
  /* class filter: IX shows force + energy, X shows lens + ohm */
  await p.click('.cl-f[data-filter="9"]');ok((await p.evaluate(()=>[...document.querySelectorAll('.cl-card')].map(c=>c.dataset.lab))).sort().join()==='energy,force','Class IX filter');
  await p.click('.cl-f[data-filter="10"]');ok((await p.evaluate(()=>[...document.querySelectorAll('.cl-card')].map(c=>c.dataset.lab))).sort().join()==='lens,ohm','Class X filter');
  await p.click('.cl-f[data-filter="all"]');await p.evaluate(()=>document.getElementById('clClose').click());

  for(const lab of Object.keys(LABS)){
    await p.evaluate(l=>__curiosity.open(l),lab);
    await p.waitForSelector('#clStage[data-ready="1"] canvas',{timeout:15000}).catch(()=>fails.push(`${lab}: 3D stage never became ready`));
    await p.waitForTimeout(900);
    ok(await p.evaluate(()=>document.getElementById('clTabQuiz').disabled),`${lab}: quiz must start locked`);
    const s0=await stageShot();ok(s0>9000,`${lab}: 3D view looks blank (${s0} bytes)`);
    const f0=await facts();ok(f0.length>20,`${lab}: no facts`);
    if(lab==='ohm')await p.click('.cl-seg .cl-opt:nth-child(2)');          // R₂ only matters once it is wired in
    /* every slider to min then max: facts must change, no errors, stage must change */
    for(const id of LABS[lab]){
      const [mn,mx]=await p.evaluate(id=>{const i=document.querySelector(`#clSide .cl-row[data-var="${id}"] input`);return[+i.min,+i.max]},id);
      await setVar(id,mn);await p.waitForTimeout(250);const fa=await facts(),sa=await stageShot();
      await setVar(id,mx);await p.waitForTimeout(250);const fb=await facts(),sb=await stageShot();
      ok(fa!==fb,`${lab}: moving ${id} from ${mn} to ${mx} did not change the facts`);
      ok(sa!==sb||lab==='energy',`${lab}: moving ${id} did not change the 3D picture`);
      ok(await p.evaluate(id=>{const o=document.querySelector(`#clSide .cl-row[data-var="${id}"] output`);return /\d/.test(o.textContent)},id),`${lab}: ${id} readout empty`);
    }
    ok(await p.evaluate(()=>!document.getElementById('clTabQuiz').disabled),`${lab}: quiz must unlock after a tweak`);
    ok(await p.evaluate(()=>document.querySelectorAll('#clStage canvas').length===1),`${lab}: expected exactly one canvas`);
    /* keyboard: slider reachable and ± buttons work */
    const before=await p.evaluate(()=>document.querySelector('#clSide .cl-row input').value);await p.click('#clSide .cl-step[data-d="-1"]');      // sliders are at their maximum now, so step down
    ok(await p.evaluate(b=>document.querySelector('#clSide .cl-row input').value!==b,before),`${lab}: − button does nothing`);

    /* lab-specific behaviour */
    if(lab==='lens'){
      await setVar('u',30);await setVar('f',10);await p.waitForTimeout(150);
      let f=await facts();ok(/diminished/.test(f)&&/Between F and 2F/.test(f)&&/-?0\.5/.test(f),`lens: u=30,f=10 should give a diminished image between F and 2F (m=-0.5): ${f}`);
      await setVar('u',20);f=await facts();ok(/same size/.test(f)&&/At 2F/.test(f),`lens: u=2f ⇒ same size at 2F: ${f}`);
      await setVar('u',10);f=await facts();ok(/∞/.test(f)&&/At infinity/.test(f),`lens: u=f ⇒ image at infinity: ${f}`);
      await setVar('u',5);f=await facts();ok(/virtual, erect, magnified/.test(f),`lens: u<f ⇒ virtual erect magnified: ${f}`);
      await p.click('.cl-opt:nth-child(2)');f=await facts();ok(/virtual, erect, diminished/.test(f)&&/Between F and O/.test(f)&&/-[\d.]+ D/.test(f),`lens: concave lens ⇒ virtual erect diminished, negative power: ${f}`);
      ok(await p.evaluate(()=>document.querySelector('.cl-opt:nth-child(2)').getAttribute('aria-pressed')==='true'),'lens: concave button not pressed');
    }
    if(lab==='ohm'){
      await p.click('.cl-seg .cl-opt:nth-child(1)');ok(await p.evaluate(()=>getComputedStyle(document.querySelector('#clSide .cl-row[data-var="R2"]')).display==='none'),'ohm: R2 slider must hide in single mode');
      await setVar('V',6);await setVar('R1',6);let f=await facts();ok(/1 A/.test(f)&&/6 W/.test(f),`ohm: 6 V over 6 Ω ⇒ 1 A, 6 W: ${f}`);
      await p.click('.cl-seg .cl-opt:nth-child(2)');await setVar('R2',12);f=await facts();ok(/18 Ω/.test(f)&&/0\.33 A/.test(f),`ohm: series 6+12 ⇒ 18 Ω, 0.33 A: ${f}`);
      await p.click('.cl-seg .cl-opt:nth-child(3)');f=await facts();ok(/4 Ω/.test(f)&&/1\.5 A/.test(f)&&/I₁ = 1 A/.test(f)&&/I₂ = 0\.5 A/.test(f),`ohm: parallel 6‖12 ⇒ 4 Ω, 1.5 A (1 A + 0.5 A): ${f}`);
    }
    if(lab==='force'){
      await setVar('F',10);await setVar('m',5);let f=await facts();ok(/2 m\/s²/.test(f)&&/6 m\/s/.test(f)&&/30 kg/.test(f),`force: 10 N on 5 kg ⇒ a=2, v(3s)=6, p=30: ${f}`);
      await p.click('.cl-btns .cl-act:nth-child(1)');await p.waitForTimeout(1800);
      const h1=await p.evaluate(()=>document.querySelector('.cl-hudline').textContent);const m1=h1.match(/v = ([\d.]+)/);ok(m1&&+m1[1]>1.5&&+m1[1]<4.5,`force: after ~1.8 s of 2 m/s² speed should be ≈3.6 m/s: ${h1}`);
      await p.click('.cl-btns .cl-act:nth-child(1)');await p.waitForTimeout(300);const h2=await p.evaluate(()=>document.querySelector('.cl-hudline').textContent);await p.waitForTimeout(500);ok(h2===await p.evaluate(()=>document.querySelector('.cl-hudline').textContent),'force: Pause did not freeze the trolley');
      await p.click('.cl-btns .cl-act:nth-child(2)');ok(/v = 0 m\/s/.test(await p.evaluate(()=>document.querySelector('.cl-hudline').textContent)),'force: Reset did not zero the speed');
    }
    if(lab==='energy'){
      await setVar('m',2);await setVar('h',0.4);let f=await facts();ok(/7\.84 J/.test(f)&&/2\.8 m\/s/.test(f),`energy: 2 kg at 0.4 m ⇒ PE 7.84 J, v 2.8 m/s: ${f}`);
      await p.click('.cl-btns .cl-act');const tot=[];
      for(let i=0;i<5;i++){await p.waitForTimeout(330);tot.push(await p.evaluate(()=>{const m=document.querySelector('.cl-hudline').textContent.match(/= ([\d.]+) J/);return m?+m[1]:null}))}
      ok(tot.every(x=>x!==null&&Math.abs(x-7.84)<0.02),`energy: PE+KE must stay 7.84 J while swinging, saw ${tot}`);
      const gaps=[];for(let i=0;i<4;i++){await p.waitForTimeout(260);gaps.push(+await p.evaluate(()=>document.getElementById('clStage').dataset.stringGap))}
      ok(gaps.every(g=>g<0.02),`energy: the string must stay attached to the bob (gaps ${gaps})`);
      await setVar('m',4);await p.waitForTimeout(200);const t2=await p.evaluate(()=>+document.querySelector('.cl-hudline').textContent.match(/= ([\d.]+) J/)[1]);ok(Math.abs(t2-15.68)<0.05,`energy: changing mass while swinging re-releases (4 kg ⇒ 15.68 J) saw ${t2}`);
    }
    /* quiz tab works and the question images draw (2D snapshot of 60 random states) */
    const snap=await p.evaluate(async lab=>{
      const core=await import(new URL('assets/curiosity/core.js',location.href).href),L=core.getLab(lab),res={n:0,blank:0,bad:[]};
      const rng=(s=>()=>((s=(s*1664525+1013904223)>>>0)/4294967296))(7);
      for(let i=0;i<60;i++){const vars={},explored={};L.vars.forEach(v=>{const k=Math.floor((v.max-v.min)/v.step),x=+(v.min+v.step*Math.floor(rng()*(k+1))).toFixed(3);vars[v.id]=x;explored[v.id]=[x]});
        let qs;try{qs=L.questions({vars,explored,rnd:rng,seed:i})}catch(e){res.bad.push('questions threw '+e.message);continue}
        for(const q of qs){res.n++;const c=document.createElement('canvas');try{L.snapshot(c,q.image.vars,q.image.focus)}catch(e){res.bad.push(q.id+' snapshot threw '+e.message);continue}
          const g=c.getContext('2d'),d=g.getImageData(0,0,c.width,c.height).data;const first=[d[0],d[1],d[2]];let diff=0;for(let k=0;k<d.length;k+=4*37){if(Math.abs(d[k]-first[0])+Math.abs(d[k+1]-first[1])+Math.abs(d[k+2]-first[2])>40)diff++}
          if(c.width<300||diff<40){res.blank++;res.bad.push(q.id+' image nearly empty')}}}
      return res},lab);
    ok(snap.n>=60*4,`${lab}: only ${snap.n} question images`);ok(snap.blank===0&&!snap.bad.length,`${lab}: ${snap.bad.slice(0,3).join('; ')}`);
    /* dispose: back to the picker frees the canvas, and the lab re-opens */
    await p.click('.cl-back');ok(await p.evaluate(()=>document.querySelectorAll('#cl canvas').length===0),`${lab}: canvas not freed after leaving the lab`);
    await p.evaluate(l=>document.querySelector(`.cl-card[data-lab="${l}"]`).click(),lab);await p.waitForSelector('#clStage[data-ready="1"] canvas',{timeout:15000}).catch(()=>fails.push(`${lab}: would not re-open`));
    await p.click('.cl-back');await p.evaluate(()=>document.getElementById('clClose').click());
  }
  /* mobile layout: the lab must fit a phone without sideways scrolling and keep the stage visible */
  await p.setViewportSize({width:390,height:844});await p.evaluate(()=>__curiosity.open('lens'));await p.waitForSelector('#clStage[data-ready="1"] canvas',{timeout:15000});await p.waitForTimeout(600);
  const mob=await p.evaluate(()=>{const s=document.getElementById('clStage').getBoundingClientRect();return{overflowX:document.documentElement.scrollWidth>innerWidth+1||document.getElementById('cl').scrollWidth>innerWidth+1,w:s.width,h:s.height}});
  ok(!mob.overflowX,'mobile: horizontal overflow');ok(mob.w>=340&&mob.h>=250,`mobile: stage too small ${mob.w}×${mob.h}`);
  ok(errs.length===0,'console/page errors: '+errs.slice(0,4).join(' | '));
  await b.close();
  console.log(`curiosity labs · 4 labs · failures ${fails.length}`);fails.forEach(f=>console.log(' ✗',f));process.exit(fails.length?1:0);
})();
