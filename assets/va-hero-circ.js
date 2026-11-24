/* Home hero: live, schematic double circulation — heart (72 beats/min), lungs (15 breaths/min) and flowing blood. Pure SVG, no assets, works offline. */
(()=>{"use strict";
const host=document.getElementById("heroCirc");if(!host)return;
const OX="#d4414a",DX="#3566c8",NS="http://www.w3.org/2000/svg";
const SEG={
 aortaHead:["M292 296 C302 262 300 205 292 180 C280 150 262 140 262 92",OX],
 hcapA:["M262 92 C285 70 250 40 238 48",OX],hcapB:["M238 48 C222 52 212 78 232 92",DX],
 svc:["M232 92 C225 140 222 180 226 214",DX],
 raS:["M226 214 L224 244 L228 290",DX],
 descAorta:["M292 296 C318 262 340 260 338 340 C336 410 318 460 300 482",OX],
 bcapA:["M300 482 C320 508 300 540 260 540",OX],bcapB:["M260 540 C220 540 200 508 222 482",DX],
 ivc:["M222 482 C200 440 194 340 206 270 C210 255 214 245 218 236",DX],
 raI:["M218 236 L224 252 L228 290",DX],
 trunk:["M230 290 C246 262 244 232 242 205",DX],
 paL:["M242 205 C215 190 170 190 140 205",DX],paR:["M242 205 C262 176 340 178 392 205",DX],
 lcapA:["M140 205 C118 225 118 250 130 262",DX],lcapB:["M130 262 C138 272 140 280 142 288",OX],
 rcapA:["M392 205 C414 225 414 250 402 262",DX],rcapB:["M402 262 C396 272 394 280 392 288",OX],
 pvL:["M142 288 C185 292 235 262 272 238",OX],pvR:["M392 288 C350 290 322 262 312 238",OX],
 laL:["M272 238 L284 262 L292 296",OX],laR:["M312 238 L300 262 L292 296",OX]};
const LOOPS=[["aortaHead","hcapA","hcapB","svc","raS","trunk","paL","lcapA","lcapB","pvL","laL"],["aortaHead","hcapA","hcapB","svc","raS","trunk","paR","rcapA","rcapB","pvR","laR"],["descAorta","bcapA","bcapB","ivc","raI","trunk","paL","lcapA","lcapB","pvL","laL"],["descAorta","bcapA","bcapB","ivc","raI","trunk","paR","rcapA","rcapB","pvR","laR"]];
const big=["aortaHead","descAorta","svc","ivc","trunk","paL","paR","pvL","pvR"];
let svg=`<svg viewBox="0 -36 520 606" role="img" aria-labelledby="hcT hcD" xmlns="${NS}"><title id="hcT">Live model of the human circulatory system</title><desc id="hcD">Schematic of double circulation: the right side of the heart pumps oxygen-poor blue blood to the lungs, the left side pumps oxygen-rich red blood to the head and body. The heart beats at 72 beats per minute and the lungs expand about 15 times per minute.</desc>
<defs><linearGradient id="hcLung" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f9dfe1"/><stop offset="1" stop-color="#f0bcc1"/></linearGradient><linearGradient id="hcBed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdf0f1"/><stop offset="1" stop-color="#f6d6d9"/></linearGradient></defs>
<style>
.hc-l{transform-box:fill-box;transform-origin:50% 40%;animation:hcBreath 4s ease-in-out infinite}
.hc-ra,.hc-la{transform-box:fill-box;transform-origin:50% 50%;animation:hcAtria .8333s ease-in-out infinite}
.hc-rv,.hc-lv{transform-box:fill-box;transform-origin:50% 40%;animation:hcVent .8333s ease-in-out infinite}
@keyframes hcAtria{0%{transform:scale(1)}8%{transform:scale(.9)}16%,100%{transform:scale(1)}}
@keyframes hcVent{0%,16%{transform:scale(1)}30%{transform:scale(.9)}46%,100%{transform:scale(1)}}
@keyframes hcBreath{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}
@media (prefers-reduced-motion:reduce){.hc-l,.hc-ra,.hc-la,.hc-rv,.hc-lv{animation:none}}
text{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
</style>

<ellipse cx="260" cy="62" rx="74" ry="32" fill="url(#hcBed)" stroke="#e8c5c9"/>
<ellipse cx="260" cy="512" rx="130" ry="32" fill="url(#hcBed)" stroke="#e8c5c9"/>
<ellipse class="hc-l" cx="130" cy="246" rx="62" ry="108" fill="url(#hcLung)" stroke="#e3a9b0"/>
<ellipse class="hc-l" cx="392" cy="246" rx="62" ry="108" fill="url(#hcLung)" stroke="#e3a9b0"/>`;
for(const k in SEG){const w=big.includes(k)?9:5,inner=/^(raS|raI|laL|laR)$/.test(k);svg+=`<path id="hs-${k}" d="${SEG[k][0]}" fill="none" stroke="${inner?"none":SEG[k][1]}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${big.includes(k)?.92:.8}"/>`}
svg+=`<g id="hcDots"></g>
<path d="M260 214 C226 196 184 220 192 266 C198 304 236 334 266 356 C298 334 340 304 340 264 C342 222 296 196 260 214Z" fill="#f4d3d5" stroke="#d99aa0" stroke-width="2"/>
<ellipse class="hc-ra" cx="216" cy="246" rx="25" ry="29" fill="#8ea8e8"/><ellipse class="hc-rv" cx="238" cy="300" rx="31" ry="40" fill="#5f84d8"/>
<ellipse class="hc-la" cx="298" cy="246" rx="23" ry="27" fill="#ec9da1"/><ellipse class="hc-lv" cx="298" cy="300" rx="35" ry="47" fill="#cc4f56"/>
<g fill="#fff" font-size="12" font-weight="700" text-anchor="middle"><text x="216" y="250">RA</text><text x="238" y="305">RV</text><text x="298" y="250">LA</text><text x="298" y="305">LV</text></g>
<g font-size="13" font-weight="600" fill="#52606a" text-anchor="middle"><text x="342" y="66" text-anchor="start">Head &amp; upper body</text><text x="260" y="563">Trunk, abdomen &amp; limbs</text><text x="130" y="378">Lungs</text><text x="392" y="378">Lungs</text></g>
<g font-size="11.5" font-weight="700"><text x="346" y="404" fill="${OX}">Aorta</text><text x="198" y="404" fill="${DX}" text-anchor="end">Vena cava</text><text x="266" y="378" fill="#7a4a50" text-anchor="middle" font-size="12.5">Heart</text></g></svg>`;
host.innerHTML=svg;
const root=host.querySelector("svg"),dotsG=root.querySelector("#hcDots");
const paths={};for(const k in SEG)paths[k]=root.querySelector("#hs-"+k);
const meta=LOOPS.map(loop=>{const segs=loop.map(k=>({el:paths[k],len:paths[k].getTotalLength(),col:SEG[k][1]}));const total=segs.reduce((a,s)=>a+s.len,0);return{segs,total}});
const dots=[];meta.forEach((m,li)=>{for(let i=0;i<11;i++){const c=document.createElementNS(NS,"circle");c.setAttribute("r","3.4");c.setAttribute("stroke","#fff");c.setAttribute("stroke-width","1.2");dotsG.appendChild(c);dots.push({c,m,s:(i/11+li*.07)%1})}});
const BEAT=.8333;let last=performance.now(),run=true,t0=last;
const reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
function place(d){let s=d.s*d.m.total;for(const g of d.m.segs){if(s<=g.len){const p=g.el.getPointAtLength(s);d.c.setAttribute("cx",p.x.toFixed(1));d.c.setAttribute("cy",p.y.toFixed(1));d.c.setAttribute("fill",g.col===OX?"#ff8d94":"#86a9f5");return}s-=g.len}}
function frame(now){if(!run)return;const dt=Math.min(.05,(now-last)/1000);last=now;const ph=(((now-t0)/1000)%BEAT)/BEAT,sys=ph>.16&&ph<.46?1.9:.75;
 dots.forEach(d=>{d.s=(d.s+dt*sys*92/d.m.total)%1;place(d)});requestAnimationFrame(frame)}
dots.forEach(place);
if(!reduce){const io="IntersectionObserver"in window?new IntersectionObserver(es=>{const v=es[0].isIntersecting&&!document.hidden;if(v&&!run){run=true;last=performance.now();requestAnimationFrame(frame)}else if(!v)run=false}):null;io&&io.observe(host);document.addEventListener("visibilitychange",()=>{if(document.hidden)run=false;else if(!run){run=true;last=performance.now();requestAnimationFrame(frame)}});requestAnimationFrame(frame)}
})();
