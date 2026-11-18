/* ===== Custom model sets 1-12 (+ chemistry lab kit): animal cell, plant cell, bacterium, atomic models, neuron/synapse/reflex, kidney/nephron/dialysis, human reproduction, flower/pollination, genetics, cell division, ionic bond, electric circuit, ray diagrams (detailed 3D) =====
   Fully procedural, hand-modelled geometry (no imported mesh): parametric surfaces for the membrane, nuclear envelope with pores, mitochondria with cristae,
   rough ER sheets with ribosomes, Golgi stack, lysosomes, vesicles, centrioles and microtubules. Source for the block injected by tools/inject-anatomy.py.
   Proportions are artistic but follow textbook organisation; sizes are NOT to scale and the protein-traffic particles are schematic (stated on screen). */
(function(){
const PI=Math.PI,TAU=PI*2,sin=Math.sin,cos=Math.cos,min=Math.min,max=Math.max,lerp=(a,b,t)=>a+(b-a)*t,cl=(v,a,b)=>max(a,min(b,v));
const Q_=(k,l)=>{cf[k]=l};
const lb=(id,en,hi,p,o={})=>({id,en,hi,at:typeof p==="function"?p:()=>p,...o});
const note=(en,hi,a,b)=>Rt(en,hi,`${a}<br><span class="hi" lang="hi">${b}</span>`);
/* deterministic noise */
let sd=7;const R=()=>(sd=(sd*16807)%2147483647)/2147483647;
const h3=(x,y,z)=>{const s=sin(x*127.1+y*311.7+z*74.7)*43758.5453;return s-Math.floor(s)};
const sm=t=>t*t*(3-2*t);
const vn=(x,y,z)=>{const X=Math.floor(x),Y=Math.floor(y),Z=Math.floor(z),a=sm(x-X),b=sm(y-Y),d=sm(z-Z),L=(p,q,t)=>p+(q-p)*t;
 return L(L(L(h3(X,Y,Z),h3(X+1,Y,Z),a),L(h3(X,Y+1,Z),h3(X+1,Y+1,Z),a),b),L(L(h3(X,Y,Z+1),h3(X+1,Y,Z+1),a),L(h3(X,Y+1,Z+1),h3(X+1,Y+1,Z+1),a),b),d)};
const fbm=(x,y,z)=>vn(x,y,z)*.6+vn(x*2.1,y*2.1,z*2.1)*.28+vn(x*4.3,y*4.3,z*4.3)*.12;
/* parametric surface builder: f(u,v)->[x,y,z] */
function param(nu,nv,f){const P=new Float32Array((nu+1)*(nv+1)*3),I=[];
 for(let i=0;i<=nu;i++)for(let j=0;j<=nv;j++){const p=f(i/nu,j/nv),k=(i*(nv+1)+j)*3;P[k]=p[0];P[k+1]=p[1];P[k+2]=p[2]}
 for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const a=i*(nv+1)+j,b=a+nv+1;I.push(a,b,a+1,b,b+1,a+1)}
 const g=new zt;g.setAttribute("position",new dn(P,3));g.setIndex(I);g.computeVertexNormals();return g}
const sph=(r,amp=0,fr=1.2,sx=1,sy=1,sz=1,nu=48,nv=64,seed=0)=>param(nu,nv,(u,v)=>{const th=u*PI,ph=v*TAU,x=sin(th)*cos(ph),y=cos(th),z=sin(th)*sin(ph),k=1+amp*(fbm(x*fr+seed,y*fr,z*fr)-.5);return[x*r*k*sx,y*r*k*sy,z*r*k*sz]});
/* tube along points (parallel-transport frame) */
function tube(pts,r,seg=10,rf=null){const cur=new It(pts),N=Math.max(8,pts.length*8),Pp=cur.getPoints(N);let T,Nn=c(0,1,0);const frames=[];
 for(let i=0;i<=N;i++){T=(i<N?Pp[i+1].clone().sub(Pp[i]):Pp[i].clone().sub(Pp[i-1])).normalize();const B=T.clone().cross(Nn);if(B.lengthSq()<1e-6)Nn=c(1,0,0).cross(T).normalize();else{Nn=B.cross(T).normalize()}frames.push([Nn.clone(),T.clone().cross(Nn).normalize()])}
 return param(N,seg,(u,v)=>{const i=Math.round(u*N),p=Pp[i],f=frames[i],a=v*TAU,rr=(rf?rf(u):1)*r;return[p.x+rr*(cos(a)*f[0].x+sin(a)*f[1].x),p.y+rr*(cos(a)*f[0].y+sin(a)*f[1].y),p.z+rr*(cos(a)*f[0].z+sin(a)*f[1].z)]})}
/* cap of a sphere (curved cisterna), centred on direction d, half-angle a, radius r */
function cap(r,a,fl=.25,wob=.02,seed=0){return param(24,48,(u,v)=>{const th=u*a*(1+fl*u*u),ph=v*TAU,k=r*(1+wob*(fbm(u*3+seed,v*3,seed)-.5)+(u>.82?.05*(u-.82)/.18:0));return[sin(th)*cos(ph)*k,cos(th)*k-r,sin(th)*sin(ph)*k]})}
/* cell body */
const MAT=(col,o={})=>Me(col,{roughness:.4,clearcoat:.6,clearcoatRoughness:.25,sheen:.4,sheenColor:new we(0xffffff),side:vt,transparent:!0,opacity:1,emissive:0x000000,bumpMap:$t,bumpScale:.12,envMapIntensity:1.2,...o});
const KINDS={
 mem:["Plasma membrane","कोशिका झिल्ली","Phospholipid bilayer with proteins. Selectively permeable: it decides what enters and leaves the cell.","प्रोटीन युक्त फ़ॉस्फ़ोलिपिड द्विस्तर; वरणात्मक पारगम्य — तय करती है कि क्या अंदर आए, क्या बाहर जाए।"],
 nuc:["Nucleus","केंद्रक","Control room: holds DNA as chromatin and is wrapped in a double envelope with pores.","नियंत्रण कक्ष: DNA को क्रोमैटिन के रूप में रखता है; दोहरी झिल्ली व छिद्रों से घिरा।"],
 nucleolus:["Nucleolus","केंद्रिका","Dense spot inside the nucleus where ribosomes are made.","केंद्रक के भीतर घना बिंदु जहाँ राइबोसोम बनते हैं।"],
 chromatin:["Chromatin (DNA)","क्रोमैटिन (DNA)","Long DNA threads packed with proteins; they condense into chromosomes when the cell divides.","प्रोटीन से लिपटे लंबे DNA धागे; कोशिका विभाजन के समय गुणसूत्र बन जाते हैं।"],
 mit:["Mitochondrion","माइटोकॉन्ड्रिया","Double-membrane organelle; the folded inner membrane (cristae) is the site of ATP production — the powerhouse.","दोहरी झिल्ली; मुड़ी भीतरी झिल्ली (क्रिस्टी) पर ATP बनता है — ऊर्जा-गृह।"],
 rer:["Rough ER","खुरदरी अंतःप्रद्रव्यी जालिका","Flattened sacs studded with ribosomes; makes proteins for export and for the membrane.","राइबोसोम लगी चपटी थैलियाँ; निर्यात व झिल्ली के लिए प्रोटीन बनाती हैं।"],
 ser:["Smooth ER","चिकनी अंतःप्रद्रव्यी जालिका","Tubular network without ribosomes; makes lipids and detoxifies.","राइबोसोम-रहित नलिकाकार जाल; लिपिड बनाता और विषहरण करता है।"],
 rib:["Ribosomes","राइबोसोम","Tiny protein factories — free in the cytoplasm or attached to the rough ER.","सूक्ष्म प्रोटीन-कारखाने — कोशिकाद्रव्य में मुक्त या खुरदरी ER पर लगे।"],
 golgi:["Golgi apparatus","गॉल्जी उपकरण","Stack of flat sacs that modifies, sorts and packs proteins into vesicles.","चपटी थैलियों का ढेर; प्रोटीन को संशोधित, छाँटकर पुटिकाओं में पैक करता है।"],
 ves:["Vesicle","पुटिका","Small membrane bag that carries material between organelles and to the membrane.","छोटी झिल्लीदार थैली जो पदार्थ को अंगकों के बीच व झिल्ली तक ले जाती है।"],
 lys:["Lysosome","लाइसोसोम","Bag of digestive enzymes that breaks down worn-out parts and germs — the 'suicide bag'.","पाचक एंज़ाइमों की थैली; घिसे भागों व रोगाणुओं को तोड़ती है — 'आत्मघाती थैली'।"],
 cen:["Centrioles","तारककाय","A pair of barrel-shaped structures (9 triplets of microtubules) that organise the spindle in cell division.","बैरल-आकार की जोड़ी (सूक्ष्मनलिकाओं के 9 त्रिक) जो कोशिका विभाजन में तर्कु बनाती है।"],
 mt:["Microtubules","सूक्ष्मनलिकाएँ","Hollow protein tubes of the cytoskeleton: give shape, and act as tracks for transport.","कंकाल-तंत्र की खोखली प्रोटीन नलिकाएँ: आकार देती हैं और परिवहन की पटरियाँ हैं।"],
 vac:["Vacuole","रिक्तिका","Storage sac for water, nutrients and wastes.","जल, पोषक तत्व व अपशिष्ट का भंडार।"]};
const ST=[
["1","A eukaryotic cell","एक यूकैरियोटिक कोशिका","A cell is the basic unit of life. This is an animal cell, wrapped in a thin, flexible plasma membrane. Everything you will see is hidden inside.","कोशिका जीवन की मूल इकाई है। यह पशु कोशिका है, जो पतली लचीली कोशिका झिल्ली से घिरी है; सब कुछ भीतर छिपा है।","Artistic model",8],
["2","Cut open: the nucleus","काटकर देखें: केंद्रक","The nucleus is the control room. A double envelope with pores guards the DNA; the dark spot is the nucleolus, where ribosomes are made.","केंद्रक नियंत्रण कक्ष है: दोहरी झिल्ली व छिद्र DNA की रक्षा करते हैं; गहरा बिंदु केंद्रिका है जहाँ राइबोसोम बनते हैं।","Artistic model",9],
["3","Mitochondria: the powerhouse","माइटोकॉन्ड्रिया: ऊर्जा-गृह","Each mitochondrion has an outer membrane and a folded inner membrane (cristae). Respiration here releases energy as ATP.","प्रत्येक माइटोकॉन्ड्रिया में बाहरी झिल्ली व मुड़ी भीतरी झिल्ली (क्रिस्टी) होती है; श्वसन से यहाँ ATP के रूप में ऊर्जा मिलती है।","Artistic model (shape simplified)",9],
["4","Rough ER and ribosomes","खुरदरी ER व राइबोसोम","Flattened sacs of rough ER, dotted with ribosomes, wrap around the nucleus. Ribosomes build proteins.","खुरदरी ER की चपटी थैलियाँ केंद्रक के चारों ओर होती हैं, राइबोसोम उन पर लगे हैं और प्रोटीन बनाते हैं।","Artistic model",9],
["5","Golgi and protein traffic","गॉल्जी व प्रोटीन का परिवहन","Proteins travel in vesicles from the ER to the Golgi, are modified and packed, then sent to the membrane or out of the cell (exocytosis).","प्रोटीन पुटिकाओं में ER से गॉल्जी तक जाते हैं, वहाँ संशोधित व पैक होकर झिल्ली तक या कोशिका से बाहर (बहिःस्राव) जाते हैं।","Animated (schematic path)",11],
["6","Lysosomes and vacuoles","लाइसोसोम व रिक्तिकाएँ","Lysosomes digest worn-out parts and germs; small vacuoles store water and wastes. Together they keep the cell clean.","लाइसोसोम घिसे भागों व रोगाणुओं को पचाते हैं, छोटी रिक्तिकाएँ जल व अपशिष्ट रखती हैं; दोनों मिलकर कोशिका साफ़ रखते हैं।","Artistic model",8],
["7","Cytoskeleton and centrioles","कंकाल-तंत्र व तारककाय","Microtubules radiate from the centrioles and act as the cell's scaffolding and transport tracks; they also form the spindle in division.","सूक्ष्मनलिकाएँ तारककाय से निकलकर कोशिका का ढाँचा व परिवहन-पटरियाँ बनाती हैं; विभाजन में तर्कु भी बनाती हैं।","Artistic model",9]];
function Mcell3d(){
 sd=7;const n=new Ne;Ge(n,{key:1.9});Je(n,-4.6,13,.1);Vt.localClippingEnabled=!0;
 const g=new J;n.add(g);const org=[],M={};const mats=[];
 const add=(id,geo,mat,p=[0,0,0],o={})=>{const m=new N(geo,mat);m.position.set(p[0],p[1],p[2]);if(o.rot)m.rotation.set(...o.rot);if(o.scl)m.scale.set(...o.scl);m.userData.part=id;m.castShadow=!o.ns;m.frustumCulled=!1;(o.parent||g).add(m);org.push({m,id,mat});return m};
 const NUC=[-.5,.35,0];
 /* --- plasma membrane: bumpy translucent shell, front slice cut away --- */
 const plane=new Zt(c(0,0,-1),99);const memMat=MAT(0xf3c9b8,{opacity:.28,roughness:.18,clearcoat:1,clearcoatRoughness:.1,transmission:.35,thickness:.6,ior:1.3,depthWrite:!1,bumpScale:.25});memMat.clippingPlanes=[plane];
 const mem=add("mem",sph(4.3,.07,1.1,1.12,.95,1,64,96),memMat,[0,0,0],{ns:1});
 const inner=add("mem",sph(4.17,.05,1.1,1.12,.95,1,48,72),MAT(0xe8a5a0,{opacity:.1,depthWrite:!1,bumpScale:.1}),[0,0,0],{ns:1});inner.material.clippingPlanes=[plane];
 /* --- nucleus --- */
 const nuc=new J;nuc.position.set(...NUC);g.add(nuc);
 const envMat=MAT(0x8d92e6,{opacity:.55,roughness:.3,clearcoat:.8,emissive:0x1b2160,emissiveIntensity:.25,bumpScale:.2});
 add("nuc",sph(1.35,.05,1.6,1,1,1,56,80),envMat,[0,0,0],{parent:nuc,ns:1});
 add("nuc",sph(1.42,.04,1.6,1,1,1,40,64,3),MAT(0xa4a9f0,{opacity:.22,depthWrite:!1,bumpScale:.1}),[0,0,0],{parent:nuc,ns:1});
 /* pores */
 const NPO=70,pores=new Wn(new it(.045,8,6),new bt({color:0x2a2f9a}),NPO);const m4=new gt;pores.frustumCulled=!1;
 for(let i=0;i<NPO;i++){const y=1-(i+.5)/NPO*2,r=Math.sqrt(1-y*y),a=i*2.399963,p=[cos(a)*r*1.4,y*1.4,sin(a)*r*1.4];m4.makeScale(1,1,.5);m4.setPosition(p[0],p[1],p[2]);pores.setMatrixAt(i,m4)}nuc.add(pores);
 /* chromatin: coiled strands */
 const chrMat=MAT(0xf08a6a,{roughness:.5,clearcoat:.4,opacity:.95,emissive:0x5a1a08,emissiveIntensity:.2});
 for(let k=0;k<7;k++){const pts=[];const cx=(R()-.5)*.7,cy=(R()-.5)*.7,cz=(R()-.5)*.7;for(let i=0;i<14;i++){const a=i/13*TAU*2.3+k,rr=.3+.28*R();pts.push(c(cx+cos(a*1.7+k)*rr,cy+sin(a*1.3)*rr,cz+sin(a*1.7+k)*rr))}add("chromatin",tube(pts,.045,8),chrMat,[0,0,0],{parent:nuc,ns:1})}
 add("nucleolus",sph(.36,.12,3,1,1,1,24,32,5),MAT(0x5b2f86,{roughness:.6,clearcoat:.2,opacity:1,emissive:0x1d0a33,emissiveIntensity:.3,bumpScale:.35}),[.35,-.1,.25],{parent:nuc});
 /* --- mitochondria --- */
 const mitOuter=MAT(0xf0a24a,{opacity:.34,roughness:.2,clearcoat:1,transmission:.3,thickness:.3,depthWrite:!1,emissive:0x4a2000,emissiveIntensity:.15});
 const mitInner=MAT(0xd9732b,{roughness:.45,clearcoat:.5,opacity:1,emissive:0x5a2200,emissiveIntensity:.25,bumpScale:.25});
 const cristae=(L,Rr)=>param(48,56,(u,v)=>{const th=u*PI,ph=v*TAU,x=cos(th),rad=sin(th),f=.78+.22*cos(x*12*PI*.5)*0+(-.34*Math.pow(Math.abs(sin(x*7.5)),1.4)*rad),yy=sin(ph),zz=cos(ph);return[x*L,rad*yy*Rr*(.8+f*.2)*(1-.28*Math.pow(Math.abs(sin(x*7.5+yy*.8)),1.6)),rad*zz*Rr*(.8+f*.2)*(1-.28*Math.pow(Math.abs(sin(x*7.5+zz*.8)),1.6))]});
 const mits=[];[[2.2,-.9,1.3,.3,.8,-.3],[-2.6,-1.5,1.4,.1,-.5,.4],[1.1,2.1,-1.4,.5,.2,.9],[-1.9,1.9,-1.8,-.4,1,-.2],[2.9,.4,-.9,.2,-.2,.1],[.1,-2.3,-1.4,.7,.1,.5],[-3.0,-.2,.2,.3,.4,-.4]].forEach((p,i)=>{const mg=new J;mg.position.set(p[0],p[1],p[2]);mg.rotation.set(p[3],p[4],p[5]);g.add(mg);
  add("mit",sph(1,0,1,.95,.5,.5,32,48),mitOuter,[0,0,0],{parent:mg,ns:1,scl:[1.0,1,1]});add("mit",cristae(.84,.41),mitInner,[0,0,0],{parent:mg,ns:1});mits.push(mg)});
 /* --- rough ER: curved sheets hugging the nucleus + ribosomes --- */
 const erMat=MAT(0xe08fb4,{opacity:.88,roughness:.45,clearcoat:.5,bumpScale:.2,emissive:0x40122a,emissiveIntensity:.12});const rib=[];
 const sheets=[[1.75,.9,[.8,.2,.6]],[1.95,.85,[.7,.3,.2]],[2.15,.82,[-.2,.9,.5]],[1.75,.8,[.2,-.9,.5]],[1.95,.7,[.5,-.7,-.6]],[2.15,.8,[-.8,.1,-.7]]];
 sheets.forEach(([r,a,d],i)=>{const dir=c(...d).normalize();const gr=new J;gr.position.set(...NUC);g.add(gr);const geo=param(30,56,(u,v)=>{const th=u*a*(1+.25*u*u),ph=v*TAU,k=r*(1+.025*(fbm(u*4+i,v*4,i)-.5)*2);return[sin(th)*cos(ph)*k,cos(th)*k,sin(th)*sin(ph)*k]});
  const e=add("rer",geo,erMat,[0,0,0],{parent:gr,ns:1});gr.quaternion.setFromUnitVectors(c(0,1,0),dir);
  for(let k=0;k<60;k++){const u=Math.sqrt(R())*.98,v=R(),th=u*a*(1+.25*u*u),ph=v*TAU,kk=r*1.012;rib.push([gr,sin(th)*cos(ph)*kk,cos(th)*kk,sin(th)*sin(ph)*kk])}});
 const NR=rib.length,ribos=new Wn(new it(.03,8,6),new bt({color:0x1f6f7d}),NR);ribos.frustumCulled=!1;g.add(ribos);
 const ribM=new gt;const setRib=()=>{rib.forEach((r,i)=>{const v=c(r[1],r[2],r[3]).applyQuaternion(r[0].quaternion).add(r[0].position);ribM.makeScale(1,1,1);ribM.setPosition(v.x,v.y,v.z);ribos.setMatrixAt(i,ribM)});ribos.instanceMatrix.needsUpdate=!0};setRib();
 /* smooth ER tubules */
 const serMat=MAT(0xf2a3c4,{opacity:.9,roughness:.4,emissive:0x40122a,emissiveIntensity:.1});
 for(let k=0;k<4;k++){const pts=[];const a0=k*1.6+.4;for(let i=0;i<9;i++){const a=a0+i*.4,rr=2.4+.35*sin(i*1.7+k);pts.push(c(NUC[0]+cos(a)*rr,NUC[1]+(i-4)*.28*(k%2?1:-1),NUC[2]+sin(a)*rr*.9))}add("ser",tube(pts,.055,8),serMat,[0,0,0],{ns:1})}
 /* --- Golgi --- */
 const GP=[2.0,-.2,1.7],golgiMat=MAT(0xf2c64a,{opacity:.95,roughness:.35,clearcoat:.6,emissive:0x5a4000,emissiveIntensity:.2,bumpScale:.15});const gg=new J;gg.position.set(...GP);gg.rotation.set(.3,.6,-.2);g.add(gg);
 for(let i=0;i<6;i++){const m=add("golgi",cap(1.1-.07*i,.62+.04*i,.5,.04,i*3),golgiMat,[0,i*.19-.45,0],{parent:gg,ns:1});m.rotation.x=PI}
 const vesMat=MAT(0xf7d58a,{opacity:.85,roughness:.25,clearcoat:.9,emissive:0x4a3000,emissiveIntensity:.15});
 for(let i=0;i<7;i++){const a=i/7*TAU;add("ves",sph(.11+.05*R(),.05,3,1,1,1,14,18),vesMat,[cos(a)*1.0,-.5+R()*1.0,sin(a)*1.0],{parent:gg,ns:1})}
 /* --- lysosomes, vacuoles --- */
 const lysMat=MAT(0xc94f58,{opacity:.9,roughness:.3,clearcoat:.8,emissive:0x40080c,emissiveIntensity:.2,bumpScale:.3});
 [[-2.2,2.2,.9],[.2,2.9,1.3],[3.2,-1.8,.3],[-1.2,-2.6,1.0],[1.4,-1.6,2.4]].forEach(p=>{add("lys",sph(.3,.06,2.5,1,1,1,24,32,p[0]),lysMat,p);for(let k=0;k<6;k++)add("lys",sph(.045,0,1,1,1,1,8,10),new bt({color:0x3a0a10}),[p[0]+(R()-.5)*.3,p[1]+(R()-.5)*.3,p[2]+(R()-.5)*.3],{ns:1})});
 const vacMat=MAT(0xa5d3f0,{opacity:.4,roughness:.1,clearcoat:1,transmission:.5,thickness:.4,depthWrite:!1,bumpScale:.05});
 [[2.8,2.0,1.0,.45],[-3.0,.8,1.6,.38],[-.6,-1.6,2.8,.34]].forEach(p=>add("vac",sph(p[3],.05,2,1,1,1,24,32,p[0]),vacMat,p,{ns:1}));
 /* --- centrioles + microtubules --- */
 const CP=[-.2,.2,-2.2];const cenMat=MAT(0xb6e08a,{roughness:.4,opacity:1,emissive:0x1f3a08,emissiveIntensity:.2});const cg=new J;cg.position.set(...CP);g.add(cg);
 const barrel=()=>{const gr=new J;for(let k=0;k<9;k++){const a=k/9*TAU;const m=new N(tube([c(cos(a)*.17,-.3,sin(a)*.17),c(cos(a)*.17,.3,sin(a)*.17)],.04,8),cenMat);m.userData.part="cen";m.frustumCulled=!1;gr.add(m);org.push({m,id:"cen",mat:cenMat})}return gr};
 const c1=barrel();c1.position.set(0,0,0);cg.add(c1);const c2=barrel();c2.position.set(.4,0,.15);c2.rotation.z=PI/2;cg.add(c2);
 const mtMat=MAT(0x8fd4a6,{opacity:.65,roughness:.4,depthWrite:!1,emissive:0x0f3a22,emissiveIntensity:.15});
 for(let k=0;k<34;k++){const dir=c(R()-.5,R()-.5,(R()-.5)*1.4).normalize(),len=2.6+R()*1.2,pts=[];for(let i=0;i<8;i++){const q=i/7;pts.push(c(CP[0]+dir.x*len*q+(R()-.5)*.15*q,CP[1]+dir.y*len*q+(R()-.5)*.15*q,CP[2]+dir.z*len*q+(R()-.5)*.15*q))}add("mt",tube(pts,.022,6),mtMat,[0,0,0],{ns:1})}
 /* --- free ribosomes + traffic particles --- */
 const NF=80,fr=new Wn(new it(.026,6,5),new bt({color:0x2e7d8a}),NF);fr.frustumCulled=!1;g.add(fr);
 for(let i=0;i<NF;i++){const p=c(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(2.2+R()*1.4);p.x*=1.1;p.y*=.9;ribM.makeScale(1,1,1);ribM.setPosition(p.x,p.y,p.z);fr.setMatrixAt(i,ribM)}
 const NT=24,tr=new Wn(new it(.075,10,8),new bt({color:0xffe27a}),NT);tr.frustumCulled=!1;g.add(tr);
 const path=new It([c(NUC[0]+1.7,NUC[1]-.2,NUC[2]+.9),c(1.2,-.1,1.4),c(GP[0]-.2,GP[1]+.1,GP[2]-.1),c(GP[0]+.6,GP[1],GP[2]+.6),c(3.0,-.2,2.6),c(4.3,-.2,3.0)]).getPoints(60);
 /* animation + labels */
 const cams=[[c(0,2,16),c(0,0,0)],[c(-1.6,1.4,7.2),c(-.5,.3,0)],[c(4.4,.6,6.4),c(1.7,-.3,0)],[c(-.5,1.4,6.6),c(-.5,.3,0)],[c(3.6,.8,6.2),c(1.5,-.1,.5)],[c(0,-1.2,8),c(0,-.6,.6)],[c(-.4,.2,5),c(-.2,.2,-1.6)]];
 const camK=["Whole cell","Nucleus","Mitochondria","ER","Golgi","Lysosomes","Skeleton"];
 let lastS=-1,lastT=0,sel=null,allLab=0,iso=0,cut=1;const hl=new Set();
 const fly=i=>window.__atlas.fly(cams[i][0].toArray(),cams[i][1].toArray(),1.4);
 const show={mem:[1,1,1,1,1,1,1],nuc:[0,1,1,1,1,1,1],nucleolus:[0,1,0,0,0,0,0],chromatin:[0,1,0,0,0,0,0],mit:[0,0,1,0,0,0,0],rer:[0,0,0,1,1,0,0],ser:[0,0,0,1,1,0,0],golgi:[0,0,0,0,1,0,0],ves:[0,0,0,0,1,0,0],lys:[0,0,0,0,0,1,0],vac:[0,0,0,0,0,1,0],cen:[0,0,0,0,0,0,1],mt:[0,0,0,0,0,0,1]};
 const base={mem:.28,nuc:.55,nucleolus:1,chromatin:.95,mit:.34,rer:.88,ser:.9,golgi:.95,ves:.85,lys:.9,vac:.4,cen:1,mt:.65};
 const W=id=>()=>{const o=org.find(q=>q.id===id);return o.m.getWorldPosition(c())};
 const labels=[["c-mem","Plasma membrane","कोशिका झिल्ली",()=>c(4.3,.8,.9),[0,1]],["c-nuc","Nucleus","केंद्रक",()=>g.localToWorld(c(NUC[0]+1.3,NUC[1]+.9,NUC[2]+.2)),[1,3]],["c-nl","Nucleolus","केंद्रिका",()=>g.localToWorld(c(NUC[0]+.35,NUC[1]-.1,NUC[2]+.25)),[1]],["c-ch","Chromatin (DNA)","क्रोमैटिन (DNA)",()=>g.localToWorld(c(NUC[0]-.3,NUC[1]+.2,NUC[2]+.2)),[1]],["c-np","Nuclear pores","केंद्रक छिद्र",()=>g.localToWorld(c(NUC[0]-1.0,NUC[1]+.95,NUC[2]+.6)),[1]],
  ["c-mi","Mitochondrion (cristae inside)","माइटोकॉन्ड्रिया (भीतर क्रिस्टी)",()=>g.localToWorld(c(2.2,-.9,1.3)),[2]],["c-mi2","ATP: energy released here","ATP: यहाँ ऊर्जा मुक्त",()=>g.localToWorld(c(-2.6,-1.5,1.4)),[2]],
  ["c-er","Rough ER (with ribosomes)","खुरदरी ER (राइबोसोम सहित)",()=>g.localToWorld(c(NUC[0]+1.2,NUC[1]+1.5,NUC[2]+1.2)),[3,4]],["c-rb","Ribosomes","राइबोसोम",()=>g.localToWorld(c(NUC[0]+1.9,NUC[1]+.5,NUC[2]+.7)),[3]],["c-se","Smooth ER","चिकनी ER",()=>g.localToWorld(c(NUC[0]+2.4,NUC[1]+.4,NUC[2]+.4)),[3]],
  ["c-go","Golgi apparatus","गॉल्जी उपकरण",()=>g.localToWorld(c(GP[0],GP[1]+.2,GP[2])),[4]],["c-ve","Vesicles carry proteins","पुटिकाएँ प्रोटीन ले जाती हैं",()=>g.localToWorld(c(GP[0]+1.0,GP[1]-.1,GP[2])),[4]],["c-ex","Exocytosis (out of the cell)","बहिःस्राव (कोशिका से बाहर)",()=>c(4.3,-.2,3.0),[4]],
  ["c-ly","Lysosome (digestion)","लाइसोसोम (पाचन)",()=>g.localToWorld(c(-2.2,2.2,.9)),[5]],["c-va","Vacuole (storage)","रिक्तिका (भंडारण)",()=>g.localToWorld(c(2.8,2.0,1.0)),[5]],
  ["c-ce","Centrioles","तारककाय",()=>g.localToWorld(c(CP[0]+.2,CP[1],CP[2])),[6]],["c-mt","Microtubules","सूक्ष्मनलिकाएँ",()=>g.localToWorld(c(CP[0]+1.6,CP[1]+.6,CP[2]+1.2)),[6]]].map(([id,en,hi,p,st])=>lb(id,en,hi,()=>allLab||st.includes(lastS)?p():c(1e6,1e6,1e6),{steps:{includes:i=>allLab||st.includes(i),length:1,find:()=>st[0]},up:!0}));
 const tools=[...cams.map((q,i)=>({label:"📷 "+camK[i],group:"cam",on:i===0,act:()=>fly(i)})),{label:"✂ Cut-away membrane",on:!0,toggle:()=>(cut=cut?0:1,!!cut)},{label:"Isolate selected",toggle:()=>(iso=iso?0:1,!!iso)},{label:"All labels",toggle:()=>(allLab=allLab?0:1,!!allLab)}];
 return{scene:n,view:{pos:cams[0][0],target:cams[0][1]},labels,pickables:org.map(o=>o.m),tools,
  steps:ST.map(s=>({dur:s[6],en:`${s[0]} · ${s[1]} — ${s[3]}`,hi:`${s[2]} — ${s[4]}`})),
  predict:{q:"Which organelle releases energy (ATP) from food?",opts:[["Nucleus",!1,"The nucleus stores DNA and controls the cell."],["Mitochondrion",!0,"Correct — its folded inner membrane (cristae) makes ATP."],["Golgi apparatus",!1,"The Golgi sorts and packs proteins."]]},
  onPick(o){const id=o.userData.part,i=KINDS[id];if(i)note(i[0],i[1],i[2],i[3]);sel=id;hl.clear();hl.add(id)},
  apply(s,k,t){const dt=min(.1,max(0,t-lastT));lastT=t;if(s!==lastS){lastS=s;fly(s)}
   g.rotation.y=sin(t*.12)*.18;plane.constant=s===0||!cut?99:.9;
   mits.forEach((m,i)=>{m.position.y+=sin(t*.9+i)*.0015;m.rotation.z+=sin(t*.5+i)*.0008});
   for(let i=0;i<NT;i++){if(s!==4){ribM.makeScale(0,0,0)}else{const f=((i/NT)+t*.07)%1,p=path[Math.min(59,Math.floor(f*59))];ribM.makeScale(1,1,1);ribM.setPosition(p.x,p.y,p.z)}tr.setMatrixAt(i,ribM)}tr.instanceMatrix.needsUpdate=!0;
   for(const o of org){let a=base[o.id]*(show[o.id][s]?1:.07);if(o.id==="mem"&&s>=1)a=.14;if(s===0)a=o.id==="mem"?.2:o.id==="nuc"?.0:.0;if(iso&&sel&&o.id!==sel)a=min(a,.05);const m=o.mat;if(m.opacity!==undefined){m.opacity=a;m.transparent=a<.999;m.depthWrite=a>.6}
    const on=show[o.id]&&show[o.id][s]&&s>0,h=(on?.12+.06*sin(t*3):0)+(hl.has(o.id)?.2:0);if(m.emissive&&o.id!=="mem"){m.userData.e0=m.userData.e0??m.emissiveIntensity;m.emissiveIntensity=m.userData.e0+h}}
   pores.visible=s===1;ribos.visible=s>=3&&s<=4;fr.visible=s>=3&&s<=4;tr.visible=s===4;
   const i=ST[s];$e(`<b>${i[0]} · ${i[1]}</b> <span style="color:var(--hi)">/ ${i[2]}</span><br><span style="color:#ffd36b">${i[5]}</span> · ${i[3]}<br><span style="color:#9fb3cf;font-size:.82em">Hand-modelled procedural geometry (no imported mesh). Sizes are not to scale; protein-traffic particles are schematic.</span>`)}}}
Q_("ix1/cell3d",[["Which organelle is called the powerhouse of the cell?","कोशिका का ऊर्जा-गृह किसे कहते हैं?",["Nucleus","Mitochondrion","Golgi apparatus","Lysosome"],1,"It releases energy as ATP."],["Ribosomes attached to the ER make…","ER से लगे राइबोसोम क्या बनाते हैं?",["Lipids","Proteins","Starch","DNA"],1,"Ribosomes are protein factories."],["Which organelle packs proteins into vesicles?","कौन-सा अंगक प्रोटीन को पुटिकाओं में पैक करता है?",["Golgi apparatus","Nucleolus","Vacuole","Centriole"],0,"Golgi modifies, sorts and packs."],["Digestive enzymes are stored in…","पाचक एंज़ाइम कहाँ रहते हैं?",["Lysosomes","Ribosomes","Centrioles","Nucleus"],0,"Lysosomes digest worn-out parts."]]);
Px["ix1/cell3d"]=[["Muscle cells have many mitochondria because they need a lot of energy.","पेशी कोशिकाओं में अधिक माइटोकॉन्ड्रिया होते हैं क्योंकि उन्हें अधिक ऊर्जा चाहिए।"],["Cells that make hormones or enzymes (like in the pancreas) have a lot of rough ER and Golgi.","हार्मोन या एंज़ाइम बनाने वाली कोशिकाओं (जैसे अग्न्याशय) में खुरदरी ER व गॉल्जी अधिक होते हैं।"]];
{const L=Hj.find(h=>h.kp==="ix1").topics,i=L.findIndex(x=>x.id==="cell");L.splice(i<0?L.length:i+1,0,{id:"cell3d",title:"Animal cell — detailed 3D",hi:"पशु कोशिका — विस्तृत 3D",build:Mcell3d,ncert:"Class IX · cell as the unit of life"})}
/* ---------- Custom model set 2: plant cell + bacterium (reuses the helpers above) ---------- */
const KIND2={
 wall:["Cell wall","कोशिका भित्ति","Rigid layer of cellulose outside the membrane. It gives the plant cell its fixed, boxy shape and protects it. Absent in animal cells.","झिल्ली के बाहर सेलुलोज़ की कठोर परत; पादप कोशिका को निश्चित, आयताकार आकार व सुरक्षा देती है। जंतु कोशिका में नहीं होती।"],
 pd:["Plasmodesmata","जीवद्रव्य तंतु","Tiny channels through the wall that join neighbouring plant cells so that materials can pass between them.","भित्ति में सूक्ष्म नलिकाएँ जो पड़ोसी पादप कोशिकाओं को जोड़ती हैं और पदार्थों का आदान-प्रदान होने देती हैं।"],
 pvac:["Large central vacuole","बड़ी केंद्रीय रिक्तिका","Fluid-filled sac that takes up most of the cell. It stores water and wastes and its pressure (turgor) keeps the cell firm. It pushes the nucleus to the side.","तरल से भरी बड़ी थैली; जल व अपशिष्ट जमा करती है, दाब (स्फीति) से कोशिका को कड़ा रखती है और केंद्रक को किनारे धकेलती है।"],
 chl:["Chloroplast","हरितलवक","Double-membrane organelle with stacks of thylakoids (grana) holding chlorophyll. Photosynthesis makes glucose from CO₂, water and sunlight and releases O₂.","दोहरी झिल्ली वाला अंगक; क्लोरोफ़िल युक्त थायलेकॉइड के ढेर (ग्रेना)। प्रकाश-संश्लेषण में CO₂, जल व सूर्य-प्रकाश से ग्लूकोज़ बनता और O₂ निकलती है।"],
 grana:["Grana (thylakoid stacks)","ग्रेना (थायलेकॉइड ढेर)","Coin-like stacks where chlorophyll traps light energy.","सिक्कों जैसे ढेर जहाँ क्लोरोफ़िल प्रकाश-ऊर्जा सोखता है।"],
 capsule:["Capsule / slime layer","कैप्सूल / श्लेष्मा परत","Sticky outer coat that protects the bacterium and helps it stick to surfaces.","चिपचिपी बाहरी परत; जीवाणु की रक्षा करती और सतहों से चिपकाती है।"],
 bwall:["Cell wall (peptidoglycan)","कोशिका भित्ति (पेप्टिडोग्लाइकन)","Strong mesh that keeps the bacterium's shape. Many antibiotics (such as penicillin) attack it.","मज़बूत जाल जो आकार बनाए रखता है; पेनिसिलिन जैसी अनेक प्रतिजैविक औषधियाँ इसी पर वार करती हैं।"],
 bmem:["Plasma membrane","कोशिका झिल्ली","Thin membrane that controls what enters and leaves; also where bacteria make energy, since they have no mitochondria.","पतली झिल्ली जो आवागमन नियंत्रित करती है; माइटोकॉन्ड्रिया न होने से ऊर्जा भी यहीं बनती है।"],
 nucleoid:["Nucleoid (DNA)","केंद्राभ (DNA)","A single long circular DNA coiled in the cytoplasm. There is NO nuclear membrane — that is why a bacterium is a prokaryote.","कोशिकाद्रव्य में कुंडलित एक लंबा वृत्ताकार DNA; केंद्रक झिल्ली नहीं होती — इसी कारण जीवाणु प्रोकैरियोट है।"],
 plasmid:["Plasmid","प्लाज़्मिड","Small extra DNA ring. It can carry useful genes, e.g. for antibiotic resistance, and is used in genetic engineering.","छोटा अतिरिक्त DNA छल्ला; उपयोगी जीन (जैसे प्रतिजैविक-प्रतिरोध) ले जा सकता है और आनुवंशिक इंजीनियरिंग में उपयोगी है।"],
 brib:["Ribosomes","राइबोसोम","Tiny protein factories scattered freely in the cytoplasm — the only organelle a bacterium has.","कोशिकाद्रव्य में बिखरे सूक्ष्म प्रोटीन-कारखाने; जीवाणु में केवल यही अंगक है।"],
 flag:["Flagellum","कशाभिका","Whip-like tail rotated by a tiny motor at its base; it pushes the bacterium forward.","कोड़े जैसी पूँछ, जिसके आधार पर सूक्ष्म मोटर उसे घुमाती है और जीवाणु को आगे धकेलती है।"],
 pili:["Pili (fimbriae)","पिली (रोम)","Short hair-like threads used to attach to surfaces and to other cells.","छोटे बालों जैसे तंतु जो सतहों व अन्य कोशिकाओं से चिपकने में काम आते हैं।"]};
const rod=(L,r,amp=0,fr=1.4,seed=0)=>param(44,56,(u,v)=>{const t=u*PI,ph=v*TAU,x=cos(t)*(L/2+r*.55),rad=r*Math.pow(sin(t),.38),k=1+amp*(fbm(x*fr+seed,sin(ph)*fr,cos(ph)*fr)-.5);return[x,rad*sin(ph)*k,rad*cos(ph)*k]});
const sg=(a,e)=>Math.sign(a)*Math.pow(Math.abs(a),e);
const boxy=(A,B,C,e=.22,amp=0,seed=0)=>param(56,72,(u,v)=>{const th=u*PI,ph=v*TAU,x=sin(th)*cos(ph),y=cos(th),z=sin(th)*sin(ph),k=1+amp*(fbm(x*2+seed,y*2,z*2)-.5);return[sg(x,e)*A*k,sg(y,e)*B*k,sg(z,e)*C*k]});
const torus=(R_,r)=>param(36,14,(u,v)=>{const a=u*TAU,b=v*TAU;return[(R_+r*cos(b))*cos(a),r*sin(b),(R_+r*cos(b))*sin(a)]});
const cristae2=(L,Rr)=>param(40,48,(u,v)=>{const th=u*PI,ph=v*TAU,x=cos(th),rad=sin(th),yy=sin(ph),zz=cos(ph),f=1-.3*Math.pow(Math.abs(sin(x*7.5+yy*.8)),1.6);return[x*L,rad*yy*Rr*f,rad*zz*Rr*f]});
/* shared runner */
function run(C){const {n,g,org,show,base,ST,cams,camK,labels,frame,predict,plane,cutAt=.9,op}=C;let lastS=-1,lastT=0,sel=null,allLab=0,iso=0,cut=1;const hl=new Set();
 const fly=i=>window.__atlas.fly(cams[i][0].toArray(),cams[i][1].toArray(),1.4);
 const FAR=c(1e6,1e6,1e6);const lab=labels.map(([id,en,hi,p,st])=>{const P=typeof p==="function"?p:()=>p;return lb(id,en,hi,()=>allLab||st.includes(lastS)?P():FAR,{steps:{includes:i=>allLab||st.includes(i),length:1,find:()=>st[0]},up:!0})});
 const tools=[...cams.map((q,i)=>({label:"📷 "+camK[i],group:"cam",on:i===0,act:()=>fly(i)})),...(C.tools2||[]),...(plane?[{label:"✂ Cut-away",on:!0,toggle:()=>(cut=cut?0:1,!!cut)}]:[]),{label:"Isolate selected",toggle:()=>(iso=iso?0:1,!!iso)},{label:"All labels",toggle:()=>(allLab=allLab?0:1,!!allLab)}];
 return{scene:n,view:{pos:cams[0][0],target:cams[0][1]},labels:lab,pickables:org.map(o=>o.m),tools,
  steps:ST.map(s=>({dur:s[6],en:`${s[0]} · ${s[1]} — ${s[3]}`,hi:`${s[2]} — ${s[4]}`})),predict,
  onPick(o){const id=o.userData.part,i=KIND2[id]||KINDS[id];if(i)note(i[0],i[1],i[2],i[3]);sel=id;hl.clear();hl.add(id)},
  apply(s,k,t){const dt=min(.1,max(0,t-lastT));lastT=t;if(s!==lastS){lastS=s;fly(s)}
   if(plane)plane.constant=s===0||!cut?99:cutAt;frame&&frame(s,t,dt);
   for(const o of org){const sh=show[o.id];let a=(base[o.id]??1)*(sh&&sh[s]?1:.07);const q=op&&op(o.id,s,a);if(q!==undefined)a=q;if(iso&&sel&&o.id!==sel)a=min(a,.05);const m=o.mat;if(m.opacity!==undefined){m.opacity=a;m.transparent=a<.999;m.depthWrite=a>.6}
    const on=sh&&sh[s]&&s>0,h=(on?.12+.06*sin(t*3):0)+(hl.has(o.id)?.2:0);if(m.emissive){m.userData.e0=m.userData.e0??m.emissiveIntensity;m.emissiveIntensity=m.userData.e0+h}}
   const i=ST[s],xh=C.hud&&C.hud(s,t);$e(`<b>${i[0]} · ${i[1]}</b> <span style="color:var(--hi)">/ ${i[2]}</span><br><span style="color:#ffd36b">${i[5]}</span> · ${i[3]}${xh?`<br><b style="color:#2b6cb0">${xh}</b>`:""}<br><span style="color:#9fb3cf;font-size:.82em">Hand-modelled procedural geometry (no imported mesh). Sizes are not to scale; particles and motion are schematic.</span>`)}}}
const mkAdd=(g,org)=>(id,geo,mat,p=[0,0,0],o={})=>{const m=new N(geo,mat);m.position.set(p[0],p[1],p[2]);if(o.rot)m.rotation.set(...o.rot);if(o.scl)m.scale.set(...o.scl);m.userData.part=id;m.castShadow=!o.ns;m.frustumCulled=!1;(o.parent||g).add(m);org.push({m,id,mat});return m};
const mkParts=(n,add)=>({});
/* ============================== PLANT CELL ============================== */
const PST=[
["1","A plant cell","एक पादप कोशिका","A plant cell is boxy because of its rigid cell wall. Inside, a huge vacuole, many chloroplasts and a nucleus pushed to the side are the clues that tell it from an animal cell.","पादप कोशिका कठोर कोशिका भित्ति के कारण आयताकार होती है। भीतर विशाल रिक्तिका, अनेक हरितलवक और किनारे खिसका केंद्रक इसे जंतु कोशिका से अलग पहचान देते हैं।","Artistic model",8],
["2","Cell wall and membrane","कोशिका भित्ति व झिल्ली","Outside is the thick cellulose wall (full of tiny channels, the plasmodesmata); just inside it lies the thin plasma membrane that controls entry and exit.","बाहर मोटी सेलुलोज़ भित्ति (जिसमें सूक्ष्म जीवद्रव्य तंतु हैं); उसके ठीक भीतर पतली कोशिका झिल्ली आवागमन नियंत्रित करती है।","Artistic model",9],
["3","The large central vacuole","बड़ी केंद्रीय रिक्तिका","The vacuole stores water and wastes. When it is full, its pressure pushes against the wall and keeps the cell firm (turgid); if water is lost the plant wilts.","रिक्तिका जल व अपशिष्ट रखती है; भरी होने पर उसका दाब भित्ति पर पड़ता है और कोशिका कड़ी (स्फीत) रहती है; जल घटने पर पौधा मुरझा जाता है।","Animated (turgor pulse exaggerated)",10],
["4","Chloroplasts: making food","हरितलवक: भोजन बनाना","Chloroplasts hold chlorophyll in stacks called grana. With sunlight they turn CO₂ and water into glucose and release oxygen — photosynthesis.","हरितलवक में क्लोरोफ़िल ग्रेना के ढेरों में होता है; सूर्य-प्रकाश से CO₂ व जल ग्लूकोज़ में बदलते हैं और ऑक्सीजन निकलती है — प्रकाश-संश्लेषण।","Animated (schematic particles)",11],
["5","Nucleus, mitochondria and the rest","केंद्रक, माइटोकॉन्ड्रिया व अन्य","The nucleus is squeezed to the edge. Mitochondria still release energy by respiration, and ER and Golgi make and pack proteins, as in an animal cell.","केंद्रक किनारे दबा होता है; माइटोकॉन्ड्रिया श्वसन से ऊर्जा देते हैं, ER व गॉल्जी जंतु कोशिका की तरह प्रोटीन बनाते व पैक करते हैं।","Artistic model",9],
["6","Plant vs animal cell","पादप बनाम जंतु कोशिका","Only plant cells have a cell wall, chloroplasts and a large central vacuole. Both have a nucleus, mitochondria, ER, Golgi and a plasma membrane.","केवल पादप कोशिका में कोशिका भित्ति, हरितलवक व बड़ी रिक्तिका होती है; दोनों में केंद्रक, माइटोकॉन्ड्रिया, ER, गॉल्जी व कोशिका झिल्ली होती है।","Summary",9]];
function Mplant(){sd=11;const n=new Ne;Ge(n,{key:1.9});Je(n,-4.4,13,.1);Vt.localClippingEnabled=!0;const g=new J;n.add(g);const org=[];const add=mkAdd(g,org);
 const plane=new Zt(c(0,0,-1),99);const wallMat=MAT(0x9bc86a,{opacity:.5,roughness:.4,clearcoat:.2,sheen:0,envMapIntensity:.4,depthWrite:!1,bumpScale:.3,emissive:0x1d3a08,emissiveIntensity:.1});wallMat.clippingPlanes=[plane];
 add("wall",boxy(4.8,3.3,3.3,.2,.02,1),wallMat,[0,0,0],{ns:1});
 const memMat=MAT(0xf0c9a8,{opacity:.28,roughness:.3,clearcoat:.2,sheen:0,envMapIntensity:.4,depthWrite:!1,bumpScale:.1});memMat.clippingPlanes=[plane];add("mem",boxy(4.55,3.1,3.1,.2,.015,2),memMat,[0,0,0],{ns:1});
 /* plasmodesmata: small channels through the wall on the +x/-x faces */
 const pdMat=MAT(0xf2e6a0,{roughness:.4,opacity:1});for(let i=0;i<9;i++){const y=(i%3-1)*1.6,z=(((i/3)|0)-1)*1.6;add("pd",tube([c(4.45,y,z),c(4.95,y,z)],.09,10),pdMat,[0,0,0],{ns:1});add("pd",tube([c(-4.95,y*.9,z),c(-4.45,y*.9,z)],.09,10),pdMat,[0,0,0],{ns:1})}
 /* vacuole */
 const vacMat=MAT(0x90cdf2,{opacity:.4,roughness:.08,clearcoat:.4,transmission:0,depthWrite:!1,bumpScale:.04,ior:1.33});const vac=add("pvac",sph(2.7,.05,1.4,1.2,.9,.9,40,56,4),vacMat,[.35,-.05,0],{ns:1});
 /* nucleus at the edge */
 const NP=[-3.55,1.5,1.3],nuc=new J;nuc.position.set(...NP);g.add(nuc);
 add("nuc",sph(.82,.05,1.6,1,1,1,40,56),MAT(0x8d92e6,{opacity:.55,roughness:.3,clearcoat:.8,emissive:0x1b2160,emissiveIntensity:.25}),[0,0,0],{parent:nuc,ns:1});
 add("nucleolus",sph(.24,.1,3,1,1,1,20,28,5),MAT(0x5b2f86,{roughness:.6,opacity:1,emissive:0x1d0a33,emissiveIntensity:.3}),[.18,-.05,.12],{parent:nuc});
 for(let k=0;k<4;k++){const pts=[];for(let i=0;i<10;i++){const a=i/9*TAU*1.8+k;pts.push(c(cos(a*1.5+k)*.35,sin(a*1.2)*.3,sin(a*1.5+k)*.35))}add("chromatin",tube(pts,.035,6),MAT(0xf08a6a,{emissive:0x5a1a08,emissiveIntensity:.2}),[0,0,0],{parent:nuc,ns:1})}
 /* chloroplasts with grana */
 const chOut=MAT(0x4caf50,{opacity:.4,roughness:.15,clearcoat:1,transmission:.3,thickness:.2,depthWrite:!1,emissive:0x0e3a0e,emissiveIntensity:.12}),chIn=MAT(0x7cc46a,{opacity:.9,roughness:.5,emissive:0x0e3a0e,emissiveIntensity:.15}),grMat=MAT(0x1f8f3a,{roughness:.35,clearcoat:.6,emissive:0x07300f,emissiveIntensity:.25,bumpScale:.1});
 const CH=[[-2.6,-2.55,1.9,.2],[2.9,2.5,1.6,-.3],[3.4,-2.4,-1.4,.5],[-.6,2.6,-1.8,.1],[-3.2,-1.2,-2.2,.9],[1.2,-2.8,2.1,-.2],[-1.2,2.5,2.0,.3],[3.9,.2,2.0,0]];const chs=[];
 CH.forEach((p,i)=>{const cg=new J;cg.position.set(p[0],p[1],p[2]);cg.rotation.set(p[3],i*.7,p[3]*.5);g.add(cg);chs.push(cg);
  add("chl",sph(1,.03,3,.66,.31,.31,22,32,i),chOut,[0,0,0],{parent:cg,ns:1});add("chl",sph(.9,0,1,.6,.27,.27,18,24),chIn,[0,0,0],{parent:cg,ns:1});
  [-.32,0,.32].forEach((x,j)=>{for(let d=0;d<5;d++)add("grana",sph(.1,0,1,1,.16,1,10,14),grMat,[x,-.12+d*.06,(j-1)*.04],{parent:cg,ns:1});});
  add("grana",tube([c(-.4,.0,.03),c(-.15,.02,-.05),c(.15,-.01,.05),c(.4,.0,-.02)],.018,6),grMat,[0,0,0],{parent:cg,ns:1})});
 /* mitochondria, ER, Golgi */
 const mO=MAT(0xf0a24a,{opacity:.34,roughness:.2,clearcoat:1,depthWrite:!1,emissive:0x4a2000,emissiveIntensity:.15}),mI=MAT(0xd9732b,{roughness:.45,emissive:0x5a2200,emissiveIntensity:.25,bumpScale:.25});
 [[-1.6,-2.8,-1.2,.4,.6,0],[3.1,-.9,-2.5,.2,1,.3],[-3.8,-.5,1.0,.7,.1,.6],[.8,2.9,1.2,.1,.5,.2]].forEach(p=>{const mg=new J;mg.position.set(p[0],p[1],p[2]);mg.rotation.set(p[3],p[4],p[5]);g.add(mg);add("mit",sph(1,0,1,.6,.31,.31,22,32),mO,[0,0,0],{parent:mg,ns:1});add("mit",cristae2(.52,.25),mI,[0,0,0],{parent:mg,ns:1})});
 const erMat=MAT(0xe08fb4,{opacity:.88,roughness:.45,emissive:0x40122a,emissiveIntensity:.12});
 for(let i=0;i<3;i++){const gr=new J;gr.position.set(NP[0],NP[1],NP[2]);gr.quaternion.setFromUnitVectors(c(0,1,0),c(.4,.5,.2+i*.4).normalize());g.add(gr);add("rer",param(22,40,(u,v)=>{const th=u*.8*(1+.2*u*u),ph=v*TAU,k=1.05+.15*i;return[sin(th)*cos(ph)*k,cos(th)*k,sin(th)*sin(ph)*k]}),erMat,[0,0,0],{parent:gr,ns:1})}
 const gg=new J;gg.position.set(-3.3,-.6,-1.2);gg.rotation.set(.5,.8,0);g.add(gg);const gm=MAT(0xf2c64a,{opacity:.95,roughness:.35,emissive:0x5a4000,emissiveIntensity:.2});for(let i=0;i<5;i++){const m=add("golgi",cap(.75-.05*i,.6+.04*i,.5,.04,i*3),gm,[0,i*.14-.3,0],{parent:gg,ns:1});m.rotation.x=PI}
 /* photosynthesis particles */
 const NPT=36,pt=new Wn(new it(.07,8,6),new bt({color:0xffffff}),NPT);pt.frustumCulled=!1;g.add(pt);const m4=new gt,col=new we;const kind=i=>i%3;const cols=[0xffe27a,0x9aa5b1,0x59b4ff];for(let i=0;i<NPT;i++)pt.setColorAt(i,col.setHex(cols[kind(i)]));
 const cams=[[c(0,2.6,17),c(0,0,0)],[c(5.4,1.6,9),c(2,0,0)],[c(0,1.2,10),c(.3,0,0)],[c(3.6,2.6,11),c(2.4,2,1)],[c(-4,2,8),c(-3,.6,.5)],[c(0,2.6,17),c(0,0,0)]];
 const camK=["Whole cell","Wall","Vacuole","Chloroplast","Nucleus etc.","Summary"];
 const show={wall:[1,1,0,0,0,1],mem:[1,1,0,0,0,1],pd:[0,1,0,0,0,1],pvac:[0,0,1,0,0,1],chl:[0,0,0,1,0,1],grana:[0,0,0,1,0,1],nuc:[0,0,0,0,1,1],nucleolus:[0,0,0,0,1,0],chromatin:[0,0,0,0,1,0],mit:[0,0,0,0,1,1],rer:[0,0,0,0,1,0],golgi:[0,0,0,0,1,0]};
 const base={wall:.4,mem:.28,pd:1,pvac:.24,chl:.4,grana:1,nuc:.55,nucleolus:1,chromatin:.95,mit:.34,rer:.45,golgi:.95};
 const L=(p)=>()=>g.localToWorld(c(...p));
 const labels=[["p-w","Cell wall (cellulose)","कोशिका भित्ति (सेलुलोज़)",L([4.8,2.4,3.3]),[0,1,5]],["p-m","Plasma membrane","कोशिका झिल्ली",L([4.5,-2.2,2.9]),[1]],["p-pd","Plasmodesmata","जीवद्रव्य तंतु",L([4.9,1.6,1.6]),[1]],["p-v","Large central vacuole","बड़ी केंद्रीय रिक्तिका",L([.4,.4,2.4]),[2,5]],["p-tu","Turgor pressure ↔ wall","स्फीति दाब ↔ भित्ति",L([3.3,-1.2,2.0]),[2]],
  ["p-c","Chloroplast","हरितलवक",L([2.9,2.5,1.6]),[3,5]],["p-g","Grana (chlorophyll)","ग्रेना (क्लोरोफ़िल)",L([-2.6,-2.55,1.9]),[3]],["p-s","Sunlight","सूर्य-प्रकाश",L([4.2,4.6,3]),[3]],["p-co","CO₂ in · O₂ out","CO₂ अंदर · O₂ बाहर",L([1.2,3.6,2.4]),[3]],
  ["p-n","Nucleus (pushed to the side)","केंद्रक (किनारे खिसका)",L(NP),[4,5]],["p-mi","Mitochondrion","माइटोकॉन्ड्रिया",L([3.1,-.9,-2.5]),[4]],["p-er","Rough ER","खुरदरी ER",L([-3.2,2.1,1.5]),[4]],["p-go","Golgi apparatus","गॉल्जी उपकरण",L([-3.3,-.5,-1.2]),[4]]];
 return run({n,g,org,show,base,ST:PST,cams,camK,labels,plane,cutAt:1.2,
  frame:(s,t)=>{g.rotation.y=sin(t*.12)*.16;const tu=s===2?1+.03*sin(t*1.6):1;vac.scale.set(tu,tu,tu);
   for(let i=0;i<NPT;i++){if(s!==3){m4.makeScale(0,0,0);pt.setMatrixAt(i,m4);continue}const ch=chs[i%chs.length],f=((i/NPT)+t*.12)%1,k=kind(i),T=ch.position;let p;
    if(k===0)p=c(T.x+5*(1-f),T.y+6*(1-f),T.z+3*(1-f));else if(k===1)p=c(T.x+(1-f)*1.5,T.y+(1-f)*3.4,T.z+(1-f)*2.2+.4);else p=c(T.x+f*1.6+.3,T.y+f*3.2,T.z+f*2.6);
    m4.makeScale(k===0?1.3:1,k===0?1.3:1,k===0?1.3:1);m4.setPosition(p.x,p.y,p.z);pt.setMatrixAt(i,m4)}pt.instanceMatrix.needsUpdate=!0},
  predict:{q:"Which structure gives a plant cell its fixed rectangular shape?",opts:[["Cell membrane",!1,"All cells have one, but it is soft and flexible."],["Cell wall",!0,"Correct — the rigid cellulose wall."],["Nucleus",!1,"The nucleus controls the cell; it does not give shape."]]}})}
Q_("ix1/plant3d",[["Which organelle in a plant cell carries out photosynthesis?","पादप कोशिका का कौन-सा अंगक प्रकाश-संश्लेषण करता है?",["Mitochondrion","Chloroplast","Golgi","Nucleus"],1,"Chloroplasts hold chlorophyll."],["Why is the nucleus of a mature plant cell pushed to the side?","परिपक्व पादप कोशिका का केंद्रक किनारे क्यों होता है?",["It is small","The large central vacuole takes the space","The wall pushes it","It has no role"],1,"The vacuole fills most of the cell."],["Plasmodesmata are…","जीवद्रव्य तंतु हैं…",["Channels through the cell wall","Chloroplast stacks","DNA rings","Ribosomes"],0,"They link neighbouring plant cells."],["A wilted plant has lost water from its…","मुरझाए पौधे ने जल खोया है…",["Vacuoles","Nucleus","Ribosomes","Centrioles"],0,"Turgor pressure drops."]]);
Px["ix1/plant3d"]=[["Leaves look green because chloroplasts contain the green pigment chlorophyll.","पत्तियाँ हरी इसलिए दिखती हैं क्योंकि हरितलवक में हरा वर्णक क्लोरोफ़िल होता है।"],["Crisp celery goes limp when left out: its vacuoles lose water and turgor drops.","कुरकुरी सेलरी रखी रहने पर नरम पड़ जाती है: रिक्तिकाओं का जल घटता है।"]];
/* ============================== BACTERIUM ============================== */
const BST=[
["1","A bacterium (prokaryote)","जीवाणु (प्रोकैरियोट)","A bacterium is a single, tiny cell, about 1–5 µm long, with no nucleus. This rod-shaped cell is drawn thousands of times larger than life.","जीवाणु एकल सूक्ष्म कोशिका (लगभग 1–5 µm) है जिसमें केंद्रक नहीं होता। यह छड़-आकार की कोशिका वास्तविक से हज़ारों गुना बड़ी दिखाई है।","Artistic model",8],
["2","The cell envelope","कोशिका आवरण","From outside in: a sticky capsule, a strong peptidoglycan cell wall, and the thin plasma membrane around the cytoplasm.","बाहर से भीतर: चिपचिपा कैप्सूल, मज़बूत पेप्टिडोग्लाइकन भित्ति और कोशिकाद्रव्य को घेरे पतली कोशिका झिल्ली।","Artistic model (cut-away)",9],
["3","Nucleoid and plasmids","केंद्राभ व प्लाज़्मिड","The DNA is one long circular thread coiled in the cytoplasm (nucleoid) — no nuclear membrane. Small extra DNA rings called plasmids may carry useful genes.","DNA कोशिकाद्रव्य में कुंडलित एक लंबा वृत्ताकार धागा (केंद्राभ) है — केंद्रक झिल्ली नहीं। प्लाज़्मिड छोटे अतिरिक्त DNA छल्ले हैं जो उपयोगी जीन ले जा सकते हैं।","Artistic model",10],
["4","Ribosomes: the only organelle","राइबोसोम: एकमात्र अंगक","The cytoplasm holds thousands of free ribosomes that make proteins. Bacteria have no mitochondria, ER, Golgi or other membrane-bound organelles.","कोशिकाद्रव्य में हज़ारों मुक्त राइबोसोम प्रोटीन बनाते हैं; जीवाणु में माइटोकॉन्ड्रिया, ER, गॉल्जी जैसे झिल्ली-युक्त अंगक नहीं होते।","Artistic model",9],
["5","Flagellum and pili","कशाभिका व पिली","A flagellum, spun by a tiny motor in the wall, drives the bacterium forward; short pili help it stick to surfaces.","दीवार में लगी सूक्ष्म मोटर से घूमती कशाभिका जीवाणु को आगे बढ़ाती है; छोटी पिली चिपकने में मदद करती हैं।","Animated (schematic motion)",11],
["6","Prokaryote vs eukaryote","प्रोकैरियोट बनाम यूकैरियोट","Prokaryote: no true nucleus, no membrane-bound organelles, small (1–5 µm). Eukaryote: DNA inside a nucleus and many membrane-bound organelles, larger (10–100 µm).","प्रोकैरियोट: सच्चा केंद्रक नहीं, झिल्ली-युक्त अंगक नहीं, छोटा (1–5 µm)। यूकैरियोट: DNA केंद्रक में व अनेक झिल्ली-युक्त अंगक, बड़ा (10–100 µm)।","Summary",9]];
function Mbact(){sd=21;const n=new Ne;Ge(n,{key:1.9});Je(n,-3.6,13,.1);Vt.localClippingEnabled=!0;const g=new J;n.add(g);const org=[];const add=mkAdd(g,org);const cell=new J;g.add(cell);
 const plane=new Zt(c(0,0,-1),99);const L=5.2,r=1.35;
 const cap_=MAT(0xd8e8c8,{opacity:.16,roughness:.3,clearcoat:.2,sheen:0,envMapIntensity:.4,depthWrite:!1,bumpScale:.4});cap_.clippingPlanes=[plane];add("capsule",rod(L+.5,r+.32,.06,1.1,1),cap_,[0,0,0],{parent:cell,ns:1});
 const bw=MAT(0xd8c694,{opacity:.4,roughness:.4,clearcoat:.15,sheen:0,envMapIntensity:.4,depthWrite:!1,bumpScale:.5,emissive:0x3a2f0a,emissiveIntensity:.1});bw.clippingPlanes=[plane];add("bwall",rod(L+.2,r+.1,.025,1.8,2),bw,[0,0,0],{parent:cell,ns:1});
 const bm=MAT(0xe8a5a5,{opacity:.3,roughness:.3,clearcoat:.2,sheen:0,envMapIntensity:.4,depthWrite:!1,bumpScale:.1});bm.clippingPlanes=[plane];add("bmem",rod(L,r,.01,1,3),bm,[0,0,0],{parent:cell,ns:1});
 /* nucleoid: coiled circular DNA */
 const pts=[];for(let i=0;i<=90;i++){const a=i/90*TAU;pts.push(c(sin(3*a)*1.6+.45*sin(11*a),.6*sin(5*a)+.3*sin(13*a),.6*cos(4*a)+.3*cos(15*a)))}
 const dna=MAT(0x5e6ad8,{roughness:.4,clearcoat:.6,emissive:0x16206a,emissiveIntensity:.3});add("nucleoid",tube(pts,.055,8),dna,[0,0,0],{parent:cell,ns:1});
 const pm=MAT(0xff9d5c,{roughness:.4,clearcoat:.6,emissive:0x5a2a08,emissiveIntensity:.25});[[1.3,-.55,.3,.3],[-1.6,.5,-.35,1.1],[.3,.65,-.4,.7]].forEach(p=>add("plasmid",torus(.2+.05*p[3],.04),pm,[p[0],p[1],p[2]],{parent:cell,rot:[p[3]*2,p[3],0],ns:1}));
 /* ribosomes */
 const NR=300,rb=new Wn(new it(.05,8,6),new bt({color:0x1f7f8a}),NR);rb.frustumCulled=!1;cell.add(rb);const m4=new gt;for(let i=0;i<NR;i++){const x=(R()-.5)*(L+.6),q=Math.sqrt(R())*r*.92*Math.pow(1-Math.pow(Math.abs(x)/(L/2+.7),3),.4),a=R()*TAU;m4.makeScale(1,1,1);m4.setPosition(x,q*sin(a),q*cos(a));rb.setMatrixAt(i,m4)}
 org.push({m:rb,id:"brib",mat:rb.material});rb.userData.part="brib";
 /* flagellum + basal body, pili */
 const fl=new J;fl.position.set(-L/2-.7,0,0);cell.add(fl);const fp=[];for(let i=0;i<=40;i++){const q=i/40,amp=.16+.2*q;fp.push(c(-q*5.4,amp*sin(q*34),amp*cos(q*34)))}const fm=MAT(0xe8d49a,{roughness:.35,clearcoat:.6,emissive:0x3a2f0a,emissiveIntensity:.15});add("flag",tube(fp,.07,10,u=>1-.4*u),fm,[0,0,0],{parent:fl,ns:1});
 [0,.18,.36].forEach((x,i)=>add("flag",torus(.17-.02*i,.035),fm,[-.0-x*1+.62,0,0],{parent:cell,rot:[0,0,PI/2],ns:1}));
 for(let i=0;i<34;i++){const a=R()*TAU,x=(R()-.5)*L*.9,dy=sin(a),dz=cos(a),rr=r+.34;add("pili",tube([c(x,dy*rr,dz*rr),c(x+.05,dy*(rr+.45),dz*(rr+.45)),c(x+.12,dy*(rr+.85),dz*(rr+.85))],.025,5),fm,[0,0,0],{parent:cell,ns:1})}
 const cams=[[c(0,1.6,11.5),c(0,0,0)],[c(0,.6,7.6),c(0,0,0)],[c(0,1.2,8.6),c(0,0,0)],[c(0,.4,7),c(0,0,0)],[c(-2.4,1.2,9.6),c(-2.2,0,0)],[c(0,1.6,11.5),c(0,0,0)]];const camK=["Whole","Envelope","DNA","Ribosomes","Flagellum","Summary"];
 const show={capsule:[1,1,0,0,1,1],bwall:[1,1,0,0,1,1],bmem:[1,1,0,0,1,1],nucleoid:[0,0,1,0,0,1],plasmid:[0,0,1,0,0,1],brib:[0,0,0,1,0,1],flag:[0,0,0,0,1,1],pili:[0,0,0,0,1,1]};
 const base={capsule:.16,bwall:.4,bmem:.3,nucleoid:1,plasmid:1,brib:1,flag:1,pili:1};
 const W=(p)=>()=>cell.localToWorld(c(...p));
 const labels=[["b-ca","Capsule","कैप्सूल",W([1.2,1.9,.4]),[1]],["b-w","Cell wall (peptidoglycan)","कोशिका भित्ति",W([2.0,1.7,0]),[0,1]],["b-m","Plasma membrane","कोशिका झिल्ली",W([-.6,-1.45,0]),[1]],["b-cy","Cytoplasm (no organelles)","कोशिकाद्रव्य (अंगक नहीं)",W([.2,-.2,.9]),[1]],
  ["b-n","Nucleoid — DNA, no nuclear membrane","केंद्राभ — DNA, केंद्रक झिल्ली नहीं",W([-.2,.5,.4]),[2,5]],["b-p","Plasmid","प्लाज़्मिड",W([1.3,-.55,.3]),[2]],["b-r","Ribosomes","राइबोसोम",W([-1.0,-.6,.5]),[3,5]],["b-f","Flagellum","कशाभिका",W([-5.0,.2,.2]),[4]],["b-bb","Basal body (motor)","आधार-मोटर",W([-2.5,0,0]),[4]],["b-pi","Pili","पिली",W([1.0,2.1,.8]),[4]],["b-sz","About 1–5 µm long","लगभग 1–5 µm लंबा",W([0,-2.2,0]),[0]]];
 return run({n,g,org,show,base,ST:BST,cams,camK,labels,plane,cutAt:.5,
  frame:(s,t)=>{g.rotation.y=s===4?sin(t*.3)*.25:sin(t*.12)*.16;fl.rotation.x=t*(s===4?7:1.2);cell.position.x=s===4?sin(t*.4)*.8:0;cell.position.y=s===4?sin(t*.9)*.12:0},
  predict:{q:"Why is a bacterium called a prokaryote?",opts:[["It has no true nucleus",!0,"Correct — its DNA lies free in the cytoplasm (nucleoid)."],["It has no DNA",!1,"It does have DNA, as a circular chromosome."],["It is multicellular",!1,"Bacteria are single-celled."]]}})}
Q_("ix1/bacterium3d",[["Which of these is absent in a bacterial cell?","जीवाणु कोशिका में क्या नहीं होता?",["Ribosomes","Nuclear membrane","Cell wall","DNA"],1,"Prokaryotes have no nuclear membrane."],["The genetic material of a bacterium lies in the…","जीवाणु का आनुवंशिक पदार्थ कहाँ होता है?",["Nucleus","Nucleoid","Vacuole","Golgi"],1,"The nucleoid region of the cytoplasm."],["What does the flagellum do?","कशाभिका क्या करती है?",["Makes proteins","Helps swimming","Stores DNA","Makes energy"],1,"It is a rotating whip-like tail."],["Small extra DNA rings in bacteria are…","जीवाणु में छोटे अतिरिक्त DNA छल्ले…",["Plasmids","Ribosomes","Pili","Capsules"],0,"Used in genetic engineering."]]);
Px["ix1/bacterium3d"]=[["Antibiotics like penicillin work by attacking the bacterial cell wall — human cells have none, so they are safe.","पेनिसिलिन जैसी औषधियाँ जीवाणु की भित्ति पर वार करती हैं; मानव कोशिका में भित्ति नहीं होती, इसलिए वे सुरक्षित हैं।"],["Curd forms when Lactobacillus bacteria turn milk sugar into lactic acid.","दही में लैक्टोबैसिलस जीवाणु दूध की शर्करा को लैक्टिक अम्ल में बदलते हैं।"]];
{const Lh=Hj.find(h=>h.kp==="ix1").topics,i=Lh.findIndex(x=>x.id==="cell3d");Lh.splice(i<0?Lh.length:i+1,0,{id:"plant3d",title:"Plant cell — detailed 3D",hi:"पादप कोशिका — विस्तृत 3D",build:Mplant,ncert:"Class IX · plant cell"},{id:"bacterium3d",title:"Bacterium — detailed 3D",hi:"जीवाणु — विस्तृत 3D",build:Mbact,ncert:"Class IX · prokaryotic cell"})}
/* ============================ ATOMIC MODELS (set 3) ============================ */
const KIND3={
 dalton:["Dalton's atom (1803)","डाल्टन का परमाणु (1803)","Atoms are tiny, solid, indivisible spheres. All atoms of an element are identical. (We now know atoms can be divided.)","परमाणु सूक्ष्म, ठोस, अविभाज्य गोले हैं; किसी तत्व के सभी परमाणु समान होते हैं। (अब हम जानते हैं कि परमाणु विभाज्य है।)"],
 thomson:["Thomson's model (1904)","थॉमसन का मॉडल (1904)","A positive sphere with negative electrons embedded in it, like plums in a pudding or seeds in a watermelon. The atom is neutral overall.","धनावेशित गोले में ऋणावेशित इलेक्ट्रॉन धँसे हैं — पुडिंग में बेर या तरबूज़ में बीज की तरह; परमाणु कुल मिलाकर उदासीन है।"],
 foil:["Gold foil","सोने की पन्नी","An extremely thin gold foil (about 1000 atoms thick) that Rutherford's students bombarded with alpha particles.","लगभग 1000 परमाणु मोटी अत्यंत पतली सोने की पन्नी, जिस पर α-कण बरसाए गए।"],
 nucleus:["Nucleus","नाभिक","A tiny, dense, positively charged centre holding protons and neutrons: almost all the mass of the atom in a space about 1/100000 of its size.","छोटा, घना, धनावेशित केंद्र जिसमें प्रोटॉन व न्यूट्रॉन हैं; परमाणु का लगभग पूरा द्रव्यमान, आकार का लगभग 1/100000 भाग।"],
 rings:["Electron shell (orbit)","इलेक्ट्रॉन कक्षा (शेल)","Electrons move only in fixed energy levels called shells K, L, M, N. K holds up to 2 electrons, L up to 8, M up to 18 (8 for the first 20 elements).","इलेक्ट्रॉन केवल निश्चित ऊर्जा-स्तरों (कक्षाओं) K, L, M, N में घूमते हैं। K में अधिकतम 2, L में 8, M में 18 (पहले 20 तत्वों में 8)।"]};
const A_ST=[
["1","Dalton: the solid ball","डाल्टन: ठोस गेंद","In 1803 John Dalton pictured the atom as a tiny, solid, indivisible sphere — like a billiard ball.","1803 में जॉन डाल्टन ने परमाणु को छोटे, ठोस, अविभाज्य गोले की तरह माना — बिलियर्ड की गेंद जैसा।","Model (1803)",8],
["2","Thomson: plum pudding","थॉमसन: प्लम पुडिंग","In 1897 J. J. Thomson discovered the electron. His model: negative electrons embedded in a positive sphere, so the atom is neutral.","1897 में जे. जे. थॉमसन ने इलेक्ट्रॉन खोजा। उनका मॉडल: धनावेशित गोले में ऋणावेशित इलेक्ट्रॉन धँसे हैं, इसलिए परमाणु उदासीन है।","Model (1904) · electrons jiggle",9],
["3","Rutherford: gold foil experiment","रदरफ़ोर्ड: सोने की पन्नी का प्रयोग","Alpha particles were fired at a thin gold foil. Most went straight through, some bent, and a very few bounced back — so most of the atom is empty space and the positive charge is packed in a tiny nucleus.","पतली सोने की पन्नी पर α-कण दागे गए। अधिकांश सीधे निकल गए, कुछ मुड़े और बहुत थोड़े वापस लौटे — अतः परमाणु का अधिकांश भाग खाली है और धनावेश एक छोटे नाभिक में है।","Animated (1911) · schematic path",12],
["4","Rutherford's atom and the neutron","रदरफ़ोर्ड का परमाणु व न्यूट्रॉन","Electrons orbit a tiny dense nucleus. In 1932 Chadwick found the neutron: the nucleus holds protons (+) and neutrons (no charge).","इलेक्ट्रॉन छोटे घने नाभिक की परिक्रमा करते हैं। 1932 में चैडविक ने न्यूट्रॉन खोजा: नाभिक में प्रोटॉन (+) और न्यूट्रॉन (आवेशहीन) हैं।","Model · not to scale",10],
["5","Bohr: electrons in shells","बोर: कक्षाओं में इलेक्ट्रॉन","In 1913 Bohr said electrons move only in fixed orbits (shells) and do not lose energy while in them. Choose an element below to fill the shells.","1913 में बोर ने कहा कि इलेक्ट्रॉन केवल निश्चित कक्षाओं में घूमते हैं और उनमें ऊर्जा नहीं खोते। नीचे से तत्व चुनकर कक्षाएँ भरें।","Model (1913) · not to scale",12],
["6","An electron jumps: light is emitted","इलेक्ट्रॉन की छलाँग: प्रकाश उत्सर्जन","When an electron falls from an outer shell to an inner one, it gives out the energy difference as a photon of light — this is how atoms make their spectrum.","जब इलेक्ट्रॉन बाहरी कक्षा से भीतरी कक्षा में गिरता है तो ऊर्जा-अंतर प्रकाश-फ़ोटॉन के रूप में निकलता है — परमाणु का स्पेक्ट्रम ऐसे ही बनता है।","Animated · schematic",11],
["7","Build an atom","अपना परमाणु बनाइए","Atomic number Z = number of protons = number of electrons. Mass number A = protons + neutrons. Valency = electrons gained, lost or shared to complete the outer shell.","परमाणु क्रमांक Z = प्रोटॉन = इलेक्ट्रॉन। द्रव्यमान संख्या A = प्रोटॉन + न्यूट्रॉन। संयोजकता = बाहरी कक्षा पूरी करने के लिए ली, दी या साझा की गई इलेक्ट्रॉन संख्या।","Interactive",14]];
const ELS=[["H","Hydrogen","हाइड्रोजन",1,0,1],["He","Helium","हीलियम",2,2,0],["Li","Lithium","लिथियम",3,4,1],["C","Carbon","कार्बन",6,6,4],["N","Nitrogen","नाइट्रोजन",7,7,3],["O","Oxygen","ऑक्सीजन",8,8,2],["Ne","Neon","नियॉन",10,10,0],["Na","Sodium","सोडियम",11,12,1],["Al","Aluminium","ऐल्युमिनियम",13,14,3],["Cl","Chlorine","क्लोरीन",17,18,1],["Ar","Argon","आर्गन",18,22,0],["K","Potassium","पोटैशियम",19,20,1],["Ca","Calcium","कैल्शियम",20,20,2]];
const shellFill=z=>{const cap=[2,8,8,2],o=[];let r=z;for(const k of cap){const t=Math.min(k,r);if(t<=0)break;o.push(t);r-=t}return o};
function Matom(){sd=31;const n=new Ne;Ge(n,{key:1.8});Je(n,-4.2,13,.1);const g=new J;n.add(g);const org=[];const add=mkAdd(g,org);
 const gD=new J,gT=new J,gR=new J,gB=new J;[gD,gT,gR,gB].forEach(x=>g.add(x));
 const pM=MAT(0xe0453a,{roughness:.3,clearcoat:.8,emissive:0x5a0e08,emissiveIntensity:.3,bumpScale:.05}),nM=MAT(0xaab3bd,{roughness:.35,clearcoat:.8,emissive:0x1a2026,emissiveIntensity:.2,bumpScale:.05}),eM=MAT(0x3b82f6,{roughness:.2,clearcoat:1,emissive:0x1033aa,emissiveIntensity:.8,bumpScale:0});
 const sphG=r=>new it(r,20,16);
 /* Dalton */
 add("dalton",sph(2,.0,1,1,1,1,40,56),MAT(0xc9d3dd,{roughness:.15,clearcoat:1,metal:.3,opacity:1,bumpScale:.03,envMapIntensity:1.5,sheen:0}),[0,0,0],{parent:gD});
 /* Thomson */
 add("thomson",sph(2.6,.0,1,1,1,1,40,56),MAT(0xff9aa0,{opacity:.4,roughness:.2,clearcoat:.4,sheen:0,envMapIntensity:.5,depthWrite:!1,bumpScale:.02}),[0,0,0],{parent:gT,ns:1});
 const plum=[];for(let i=0;i<12;i++){const d=c(R()-.5,R()-.5,R()-.5).normalize().multiplyScalar(.4+1.7*Math.cbrt(R()));const m=new N(sphG(.17),eM);m.position.copy(d);m.userData.part="thomson";gT.add(m);plum.push([m,d.clone(),R()*TAU])}
 /* Rutherford foil + alpha particles */
 const foilM=MAT(0xf2c447,{roughness:.25,clearcoat:.9,metal:.7,emissive:0x4a3300,emissiveIntensity:.15,bumpScale:.02});
 for(let y=-3;y<=3;y++)for(let z=-3;z<=3;z++){const m=add("foil",sphG(.26),foilM,[0,y*.62,z*.62],{parent:gR,ns:1});add("foil",sphG(.05),nM,[0,y*.62,z*.62],{parent:gR,ns:1})}
 const NA=22,al=new Wn(new it(.12,12,10),new bt({color:0xffd54f}),NA);al.frustumCulled=!1;gR.add(al);const m4=new gt;
 const AP=[];for(let i=0;i<NA;i++){const big=i%7===0,small=i%4===0&&!big,sgn=i%2?1:-1;AP.push({y:big?sgn*.06+(i%3-1)*.02:(R()-.5)*3.4,z:(R()-.5)*3.4,ang:big?sgn*(0.7+R()*2.2):small?sgn*(.08+R()*.14):(R()-.5)*.02,ph:i/NA})}
 /* screen arc behind */
 const scr=add("screen",param(30,12,(u,v)=>{const a=(u-.5)*2.6,y=(v-.5)*5;return[cos(a)*8,y,sin(a)*8]}),MAT(0x7ad1a8,{opacity:.18,roughness:.5,sheen:0,depthWrite:!1,envMapIntensity:.3}),[0,0,0],{parent:gR,ns:1});scr.rotation.y=PI/2;
 /* Bohr / nuclear atom (element dependent) */
 const nucG=new J;gB.add(nucG);const shG=new J;gB.add(shG);let curEl=ELS[3],eList=[];
 add("nucleus",new it(1.2,24,20),MAT(0xffb4a8,{opacity:.12,depthWrite:!1,sheen:0,envMapIntensity:.3}),[0,0,0],{parent:gB,ns:1});
 const ringM=MAT(0x9fb3cf,{opacity:.35,roughness:.4,sheen:0,depthWrite:!1,envMapIntensity:.3});const ringMeshes=[];
 const label2=new J;gB.add(label2);
 function build(el){curEl=el;while(nucG.children.length)nucG.remove(nucG.children[0]);while(shG.children.length)shG.remove(shG.children[0]);eList=[];
  const Z=el[3],Nn=el[4],A=Z+Nn,rN=.2*Math.cbrt(A)+.1;const pts=[];for(let i=0;i<A;i++){const y=1-(i+.5)/A*2,r=Math.sqrt(1-y*y),a=i*2.399963;pts.push(c(cos(a)*r,y,sin(a)*r).multiplyScalar(rN*(A>1?1:0)))}
  for(let i=A-1;i>0;i--){const j=(i*7+3)%(i+1);const t=pts[i];pts[i]=pts[j];pts[j]=t}
  pts.forEach((p,i)=>{const isP=i<Z,m=new N(sphG(.2),isP?pM:nM);m.position.copy(p);m.userData.part="nucleus";nucG.add(m)});
  const sh=shellFill(Z);sh.forEach((cnt,k)=>{const R_=1.9+1.35*k,rg=new J;rg.rotation.set(.35*k,0,k*.5);shG.add(rg);
   const ring=new N(torus(R_,.02),ringM);ring.userData.part="rings";rg.add(ring);ringMeshes.push(ring);
   for(let e=0;e<cnt;e++){const m=new N(sphG(.14),eM);m.userData.part="rings";rg.add(m);eList.push({m,k,R_,e,cnt,rg})}})}
 build(ELS[3]);
 /* photon for the jump */
 const ph=new N(new it(.16,12,10),new bt({color:0xfff2a0}));gB.add(ph);ph.visible=!1;
 const cams=[[c(0,.6,9),c(0,0,0)],[c(0,.6,10),c(0,0,0)],[c(-.6,5.4,13),c(2.5,0,0)],[c(0,2.4,9.5),c(0,0,0)],[c(0,3,12),c(0,0,0)],[c(0,2.8,11.5),c(0,0,0)],[c(0,3.2,12.5),c(0,0,0)]];
 const camK=["Dalton","Thomson","Gold foil","Nucleus","Bohr","Photon","Build"];
 const show={dalton:[1,0,0,0,0,0,0],thomson:[0,1,0,0,0,0,0],foil:[0,0,1,0,0,0,0],screen:[0,0,1,0,0,0,0],nucleus:[0,0,0,1,1,1,1]};
 const base={dalton:1,thomson:.4,foil:1,screen:.18,nucleus:.12};
 const W=(g_,p)=>()=>g_.localToWorld(c(...p));
 const labels=[["a-d","Solid, indivisible sphere","ठोस, अविभाज्य गोला",W(gD,[1.5,1.4,0]),[0]],["a-t1","Positive sphere (pudding)","धन-आवेशित गोला (पुडिंग)",W(gT,[1.9,1.8,0]),[1]],["a-t2","Electrons (plums), negative","इलेक्ट्रॉन (बेर), ऋणात्मक",()=>gT.localToWorld(plum[2][0].position.clone()),[1]],
  ["a-f","Gold foil","सोने की पन्नी",W(gR,[0,2.3,2.3]),[2]],["a-a","α-particles (positive)","α-कण (धनात्मक)",()=>al.localToWorld(c(-4.5,.8,0)),[2]],["a-s","Fluorescent screen","प्रतिदीप्त पर्दा",W(gR,[0,2.6,-7.7]),[2]],["a-m","Most pass straight: atom is mostly empty","अधिकांश सीधे: परमाणु मुख्यतः खाली",W(gR,[4.8,-.3,0]),[2]],["a-b","A few bounce back: tiny dense nucleus","कुछ वापस: छोटा घना नाभिक",W(gR,[-4.5,.2,2.6]),[2]],
  ["a-n","Nucleus (protons + neutrons)","नाभिक (प्रोटॉन + न्यूट्रॉन)",W(gB,[0,.9,0]),[3,4,6]],["a-p","Proton (+)","प्रोटॉन (+)",W(gB,[.7,-.4,.5]),[3]],["a-nn","Neutron (no charge)","न्यूट्रॉन (आवेशहीन)",W(gB,[-.6,.3,.7]),[3]],["a-e","Electron (−)","इलेक्ट्रॉन (−)",()=>eList[0]?eList[0].m.getWorldPosition(c()):c(),[3,4]],
  ["a-k","K shell (n = 1): max 2","K कक्षा (n = 1): अधिकतम 2",()=>g.localToWorld(c(0,1.9,0)),[4,6]],["a-l","L shell (n = 2): max 8","L कक्षा (n = 2): अधिकतम 8",()=>g.localToWorld(c(0,3.25,0)),[4,6]],["a-ph","Photon (energy emitted)","फ़ोटॉन (ऊर्जा उत्सर्जित)",()=>ph.getWorldPosition(c()),[5]],["a-jump","Electron falls L → K","इलेक्ट्रॉन L → K में गिरा",()=>g.localToWorld(c(0,2.6,0)),[5]],["a-z","Z = protons = electrons","Z = प्रोटॉन = इलेक्ट्रॉन",()=>g.localToWorld(c(0,-.4,0)),[6]]];
 const tools2=ELS.map((e,i)=>({label:e[0]+" · "+e[3],group:"el",on:i===3,act:()=>build(e)}));
 const info=()=>{const e=curEl,sh=shellFill(e[3]);return`${e[1]} (${e[0]}) · Z = ${e[3]} · A = ${e[3]+e[4]} · shells ${sh.join(",")} · valency ${e[5]}`};
 const run0=run({n,g,org,show,base,ST:A_ST,cams,camK,labels,tools2,
  frame:(s,t,dt)=>{g.rotation.y=s===2?0:sin(t*.12)*.2;gD.visible=s===0;gT.visible=s===1;gR.visible=s===2;gB.visible=s>=3;
   plum.forEach(([m,d,p])=>{m.position.set(d.x+.06*sin(t*3+p),d.y+.06*cos(t*2.6+p),d.z+.06*sin(t*2.2+p*2))});
   /* alpha scattering */
   for(let i=0;i<NA;i++){if(s!==2){m4.makeScale(0,0,0);al.setMatrixAt(i,m4);continue}const a=AP[i],f=(t*.18+a.ph)%1;let x,y,z=a.z;
    if(f<.5){x=-7+14*f;y=a.y}else{const d=(f-.5)*14,cs=cos(a.ang),sn=sin(a.ang);x=cs*d;y=a.y+sn*d}
    m4.makeScale(1,1,1);m4.setPosition(x,y,z);al.setMatrixAt(i,m4)}al.instanceMatrix.needsUpdate=!0;
   /* electrons orbit */
   const shellsOn=s>=4,flat=s===3;eList.forEach(o=>{const w=(1.6/(o.k+1))*(s===5||s===4||s===6?1:1)*.9,a=o.e/o.cnt*TAU+t*w;let R_=o.R_;let x=cos(a)*R_,z=sin(a)*R_;
    if(s===5&&o.k===1&&o.e===0){const j=((t*.25)%1);const q=cl((j-.15)/.4,0,1);R_=lerp(o.R_,1.9,q);x=cos(a*0+1.2)*R_;z=sin(1.2)*R_;o.jump=q}
    o.m.position.set(x,0,z)});
   shG.children.forEach((rg,k)=>{rg.children[0].visible=shellsOn||s===3?true:true});
   if(s===3)shG.children.forEach((rg,k)=>{rg.children[0].material.opacity=.12});else ringM.opacity=.35;
   /* photon */
   const j=((t*.25)%1);ph.visible=s===5&&j>.55;if(ph.visible){const q=(j-.55)/.45;const dirv=c(cos(1.2),.5,sin(1.2)).normalize();ph.position.copy(dirv.multiplyScalar(1.9+q*6));ph.scale.setScalar(1+q*.8)}
   if(s===6||s===4){const d=info();window.__atomInfo=d}},
  predict:{q:"Rutherford found that a few alpha particles bounced straight back. What did this show?",opts:[["Electrons are heavy",!1,"Electrons are very light; they cannot reflect alpha particles."],["A tiny, dense, positive nucleus",!0,"Correct — only a very concentrated positive centre could repel them so strongly."],["The atom is a solid ball",!1,"Then none would pass straight through."]]}});
 const ap=run0.apply;run0.apply=(s,k,t)=>{ap(s,k,t);if(s===4||s===6){const i=A_ST[s];$e(`<b>${i[0]} · ${i[1]}</b> <span style="color:var(--hi)">/ ${i[2]}</span><br><span style="color:#ffd36b">${i[5]}</span> · ${i[3]}<br><b style="color:#2b6cb0">${info()}</b><br><span style="color:#9fb3cf;font-size:.82em">Hand-modelled procedural geometry. Sizes are not to scale; motion is schematic.</span>`)}};
 return run0}
Q_("ix6/atom3d",[["Who discovered the electron?","इलेक्ट्रॉन की खोज किसने की?",["Rutherford","J. J. Thomson","Bohr","Chadwick"],1,"Thomson, in 1897."],["The nucleus was discovered by…","नाभिक की खोज किसने की?",["Dalton","Rutherford","Bohr","Thomson"],1,"Using the gold-foil experiment."],["Maximum electrons in the L shell:","L कक्षा में अधिकतम इलेक्ट्रॉन:",["2","8","18","32"],1,"K:2, L:8, M:18."],["Sodium has atomic number 11. Its shell arrangement is…","सोडियम का परमाणु क्रमांक 11 है; कक्षा-व्यवस्था:",["2,8,1","2,8,2","2,9","1,8,2"],0,"2 + 8 + 1 = 11."],["Neutrons were discovered by…","न्यूट्रॉन की खोज किसने की?",["Chadwick","Goldstein","Thomson","Bohr"],0,"In 1932."]]);
Px["ix6/atom3d"]=[["The atom is ~99.999% empty space — if the nucleus were a marble, the electrons would be ~1 km away.","परमाणु लगभग पूरा खाली है — यदि नाभिक कंचा हो तो इलेक्ट्रॉन लगभग 1 किमी दूर होंगे।"],["The colours of fireworks and neon signs are photons from electrons falling to lower shells.","आतिशबाज़ी व नियॉन बोर्ड के रंग निचली कक्षा में गिरते इलेक्ट्रॉनों के फ़ोटॉन हैं।"]];
{const La=Hj.find(h=>h.kp==="ix6").topics,i=La.findIndex(x=>x.id==="models");La.splice(i<0?La.length:i+1,0,{id:"atom3d",title:"Structure of the atom — detailed 3D",hi:"परमाणु की संरचना — विस्तृत 3D",build:Matom,ncert:"Class IX · structure of the atom"})}
/* ===================== SET 4: NEURON · IMPULSE · SYNAPSE · REFLEX ARC ===================== */
const KIND4={
 soma:["Cell body (soma)","कोशिका काय","The neuron's control centre: it holds the nucleus and makes the proteins the cell needs. Dendrites bring signals to it.","तंत्रिका कोशिका का नियंत्रण केंद्र: केंद्रक व आवश्यक प्रोटीन यहीं; द्रुमिकाएँ संकेत यहाँ लाती हैं।"],
 nuc4:["Nucleus","केंद्रक","Holds the DNA that directs the neuron's activities.","DNA रखता है जो तंत्रिका कोशिका की क्रियाओं को निर्देशित करता है।"],
 dend:["Dendrites","द्रुमिकाएँ","Branched, short fibres that receive information from other neurons or from receptors. Tiny spines increase the area for contacts.","छोटी, शाखित तंतुएँ जो अन्य तंत्रिकाओं या ग्राही से सूचना लेती हैं; सूक्ष्म काँटे संपर्क-क्षेत्र बढ़ाते हैं।"],
 axon:["Axon","तंत्रिकाक्ष (एक्सॉन)","A single long fibre that carries the impulse away from the cell body — up to a metre in the leg.","एक लंबा तंतु जो आवेग को कोशिका काय से दूर ले जाता है — पैर में लगभग एक मीटर तक।"],
 myelin:["Myelin sheath","माइलिन आवरण","Fatty insulating layer made by Schwann cells. It makes the impulse jump from gap to gap and travel up to 100 m/s.","श्वान कोशिकाओं की वसीय अवरोधी परत; आवेग को अंतराल से अंतराल तक कुदाती है और गति 100 m/s तक पहुँचती है।"],
 node:["Node of Ranvier","रैन्वियर पर्व","A small uncovered gap between myelin segments where ion channels sit and the impulse is renewed.","माइलिन खंडों के बीच का खुला अंतराल जहाँ आयन-चैनल होते हैं और आवेग नवीकृत होता है।"],
 term:["Axon terminals","तंत्रिकाक्ष अंत","Branched ends of the axon with swollen knobs (boutons) that contain vesicles of neurotransmitter.","एक्सॉन के शाखित सिरे, फूले बटन (बूटॉन) जिनमें न्यूरोट्रांसमीटर की पुटिकाएँ होती हैं।"],
 pre:["Pre-synaptic knob","पूर्व-सिनैप्टिक बटन","The end of the sending neuron. An arriving impulse makes vesicles fuse with the membrane and release neurotransmitter.","भेजने वाली तंत्रिका का सिरा; आवेग आने पर पुटिकाएँ झिल्ली से जुड़कर न्यूरोट्रांसमीटर छोड़ती हैं।"],
 ves4:["Vesicle","पुटिका","A bubble packed with neurotransmitter molecules.","न्यूरोट्रांसमीटर अणुओं से भरी बुलबुले जैसी थैली।"],
 cleft:["Synaptic cleft","सिनैप्टिक दरार","A gap of about 20 nm. The chemical signal must cross it by diffusion — electricity cannot jump here.","लगभग 20 nm की दरार; रासायनिक संकेत को विसरण से पार करना पड़ता है — यहाँ विद्युत नहीं कूद सकती।"],
 post:["Post-synaptic membrane","पश्च-सिनैप्टिक झिल्ली","The receiving cell's membrane, with receptor proteins that fit the neurotransmitter like a key in a lock.","ग्राही कोशिका की झिल्ली; ग्राही प्रोटीन न्यूरोट्रांसमीटर को ताले-चाबी की तरह पकड़ते हैं।"],
 nt:["Neurotransmitter","न्यूरोट्रांसमीटर","Chemical messenger (e.g. acetylcholine) that carries the signal across the cleft.","रासायनिक संदेशवाहक (जैसे ऐसीटिलकोलीन) जो दरार पार संकेत ले जाता है।"],
 rec:["Receptor protein","ग्राही प्रोटीन","Binds the neurotransmitter and opens a channel, starting a new impulse in the next cell.","न्यूरोट्रांसमीटर को बाँधकर चैनल खोलता है और अगली कोशिका में नया आवेग शुरू करता है।"],
 skin:["Receptor (skin)","ग्राही (त्वचा)","Sense organ that detects the stimulus (heat, touch, pain) and starts a nerve impulse.","संवेदी अंग जो उद्दीपन (ऊष्मा, स्पर्श, पीड़ा) पहचानकर तंत्रिका आवेग शुरू करता है।"],
 sens:["Sensory neuron","संवेदी तंत्रिका","Carries the impulse from the receptor to the spinal cord.","आवेग को ग्राही से मेरुरज्जु तक ले जाती है।"],
 cord:["Spinal cord (relay)","मेरुरज्जु (रिले)","Grey matter where the relay neuron connects the sensory neuron to the motor neuron — the reflex is decided here, without waiting for the brain.","धूसर पदार्थ जहाँ रिले तंत्रिका संवेदी को प्रेरक से जोड़ती है — प्रतिवर्त यहीं तय होता है, मस्तिष्क की प्रतीक्षा किए बिना।"],
 motor:["Motor neuron","प्रेरक तंत्रिका","Carries the command from the spinal cord to the muscle.","आदेश को मेरुरज्जु से पेशी तक ले जाती है।"],
 musc:["Effector (muscle)","प्रभावक (पेशी)","The muscle contracts and pulls the hand away.","पेशी सिकुड़ती है और हाथ को खींच लेती है।"]};
const N_ST=[
["1","The neuron: the cell of the nervous system","न्यूरॉन: तंत्रिका तंत्र की कोशिका","A neuron has a cell body, many short dendrites and one long axon ending in terminals. Nothing else in the body is so specialised for carrying messages.","न्यूरॉन में कोशिका काय, अनेक छोटी द्रुमिकाएँ और एक लंबा एक्सॉन होता है जो अंत-शाखाओं में समाप्त होता है; संदेश ढोने के लिए इतनी विशिष्ट कोई और कोशिका नहीं।","Artistic model",9],
["2","Dendrites receive, the axon sends","द्रुमिकाएँ लेती हैं, एक्सॉन भेजता है","Information enters through the dendrites, passes through the cell body and leaves along the axon: dendrite → cell body → axon → terminal. The impulse is electrical here.","सूचना द्रुमिकाओं से आती है, कोशिका काय से गुज़रती है और एक्सॉन से बाहर जाती है: द्रुमिका → कोशिका काय → एक्सॉन → अंत। यहाँ आवेग विद्युत है।","Animated (schematic)",10],
["3","Myelin and the jumping impulse","माइलिन व कूदता आवेग","Myelin insulates the axon. The impulse jumps from one node of Ranvier to the next (saltatory conduction), which is much faster than creeping along a bare fibre.","माइलिन एक्सॉन को ढकता है; आवेग एक रैन्वियर पर्व से अगले पर कूदता है (लवणीय चालन), जो नंगे तंतु पर रेंगने से कहीं तेज़ है।","Animated · speed exaggerated",11],
["4","What happens at a node","पर्व पर क्या होता है","At a node, sodium ions rush IN and the membrane flips from −70 mV to about +30 mV; then potassium ions flow OUT and it resets. This wave of change is the action potential.","पर्व पर Na⁺ आयन तेज़ी से अंदर आते हैं और झिल्ली −70 mV से लगभग +30 mV हो जाती है; फिर K⁺ बाहर बहते हैं और पुनः स्थापित होती है — यही क्रिया-विभव है।","Animated · schematic (ions not to scale)",11],
["5","The synapse: a chemical bridge","सिनैप्स: रासायनिक पुल","The impulse reaches the knob; vesicles release neurotransmitter into the 20 nm gap; it binds receptors on the next cell and starts a new impulse. The signal goes one way only.","आवेग बटन तक पहुँचता है; पुटिकाएँ 20 nm दरार में न्यूरोट्रांसमीटर छोड़ती हैं; वह अगली कोशिका के ग्राहियों से जुड़कर नया आवेग शुरू करता है; संकेत केवल एक दिशा में जाता है।","Animated · magnified (not to scale)",13],
["6","Reflex arc: the fast shortcut","प्रतिवर्त चाप: तेज़ छोटा रास्ता","Touch something hot: receptor → sensory neuron → spinal cord (relay) → motor neuron → muscle. The hand moves away before the brain even feels the pain.","गर्म वस्तु छूते ही: ग्राही → संवेदी तंत्रिका → मेरुरज्जु (रिले) → प्रेरक तंत्रिका → पेशी; मस्तिष्क को दर्द महसूस होने से पहले ही हाथ हट जाता है।","Animated · schematic",13]];
function Mneuron(){sd=41;const n=new Ne;Ge(n,{key:1.9});Je(n,-5.2,40,.08);const g=new J;n.add(g);const org=[];const add=mkAdd(g,org);
 const SY=[18,0,0],RF=[0,-13,0];
 const syn=new J;syn.position.set(...SY);g.add(syn);const ref=new J;ref.position.set(...RF);g.add(ref);
 const warm=MAT(0xe8844f,{roughness:.5,clearcoat:.4,bumpScale:.3,opacity:.97,sheen:.2,sheenC:0xffd0b0,emissive:0x5a2008,emissiveIntensity:.18});
 /* soma */
 add("soma",sph(1.15,.09,1.6,1.05,1,1,48,64,2),warm,[-6,0,0]);
 add("nuc4",sph(.58,.04,2,1,1,1,32,40,4),MAT(0x7a83d6,{roughness:.35,clearcoat:.7,opacity:.9,emissive:0x1b2160,emissiveIntensity:.25}),[-6.05,0,0]);
 add("nuc4",sph(.2,.1,3,1,1,1,16,20,6),MAT(0x40206b,{roughness:.6,emissive:0x1d0a33,emissiveIntensity:.3}),[-5.9,.1,.2],{ns:1});
 /* dendritic trees with spines */
 const segs=[];const dend=(base,dir,len,r,depth)=>{const pts=[base.clone()];let p=base.clone(),d=dir.clone();for(let i=0;i<4;i++){d.add(c(R()-.5,R()-.5,R()-.5).multiplyScalar(.55)).normalize();p=p.clone().add(d.clone().multiplyScalar(len/4));pts.push(p)}segs.push({pts,r});
  if(depth>0)for(let k=0;k<2;k++)dend(p,d.clone().add(c(R()-.5,R()-.5,R()-.5).multiplyScalar(1.3)).normalize(),len*.72,r*.7,depth-1)};
 [[-1,.7,.4],[-1,-.6,.7],[-.7,1,-.3],[-.8,-1,-.2],[-.5,.2,1],[-.4,-.1,-1],[-1,.1,-.9]].forEach(d=>dend(c(-6+d[0]*.9,d[1]*.8,d[2]*.8),c(d[0],d[1],d[2]).normalize(),1.9,.2,2));
 const spM=MAT(0xf7b894,{roughness:.5,opacity:1});
 segs.forEach(s=>{add("dend",tube(s.pts,s.r,8,u=>1-.55*u),warm,[0,0,0],{ns:1});if(s.r<.12)for(let k=0;k<5;k++){const q=s.pts[1+(k%3)].clone().lerp(s.pts[2+(k%2)],R());add("dend",sph(.05,0,1,1,1,1,8,10),spM,[q.x+(R()-.5)*.18,q.y+(R()-.5)*.18,q.z+(R()-.5)*.18],{ns:1})}});
 /* axon hillock + axon */
 const axM=MAT(0xf3df9a,{roughness:.4,clearcoat:.6,emissive:0x4a3a08,emissiveIntensity:.2,bumpScale:.15});
 add("axon",tube([c(-5,0,0),c(-4.6,0,0),c(-3.8,0,0)],.5,12,u=>1-.7*u),warm,[0,0,0],{ns:1});
 add("axon",tube([c(-4.4,0,0),c(0,0,0),c(4,0,0),c(6.7,0,0)],.15,10),axM,[0,0,0],{ns:1});
 /* myelin sheaths (Schwann cells) */
 const myM=MAT(0xfff1c8,{roughness:.22,clearcoat:.9,clearcoatRoughness:.15,sheen:.5,emissive:0x3a2c08,emissiveIntensity:.18,bumpScale:.3,opacity:.97});const XN=[];
 const myM2=MAT(0xf4d58a,{roughness:.3,clearcoat:.8,sheen:.4,emissive:0x4a3408,emissiveIntensity:.15,bumpScale:.4,opacity:.97});
 for(let i=0;i<7;i++){const x0=-4.3+i*1.6,L=1.35-.04*(i%3),cut=i===3,mat=i%2?myM:myM2;
  add("myelin",param(30,56,(u,v)=>{const x=(u-.5)*L,a=(cut?(.05+v*.7):v)*TAU,pr=Math.pow(sin(u*PI),.25),ridge=1+.045*sin(u*PI*5+i)+.03*fbm(u*3+i,v*3,i),k=.38*pr*ridge+.02;return[x,cos(a)*k,sin(a)*k]}),mat,[x0+L/2,0,0],{ns:1});
  if(cut){[-1,1].forEach(sg=>add("myelin",param(6,150,(u,v)=>{const a=v*TAU*3.4,r=.07+.3*v+u*.03;return[sg*L/2*.985+sg*u*.02,cos(a)*r,sin(a)*r]}),MAT(0xfff4cf,{roughness:.4,opacity:1,emissive:0x4a3408,emissiveIntensity:.2,sheen:0}),[x0+L/2,0,0],{ns:1}))}
  if(i<6)XN.push(x0+L+.1)}
 /* nodes: tiny glowing rings */
 const nodeM=MAT(0x9fd3ff,{roughness:.3,emissive:0x2a6ac0,emissiveIntensity:.5,opacity:.95});XN.forEach(x=>add("node",torus(.17,.045),nodeM,[x,0,0],{rot:[0,0,PI/2],ns:1}));
 /* terminals + boutons */
 const boM=MAT(0xf5c26b,{roughness:.35,clearcoat:.7,emissive:0x5a3a08,emissiveIntensity:.25});
 [[1.2,.9,.4],[1.5,.2,1],[1.4,-.6,.6],[1.6,-.9,-.3],[1.3,.4,-.9]].forEach((e,i)=>{add("term",tube([c(6.7,0,0),c(7.2,e[1]*.4,e[2]*.4),c(7.7+e[0]*.15,e[1]*.9,e[2]*.9)],.09,8),axM,[0,0,0],{ns:1});add("term",sph(.3,.06,2,1,1,1,16,20,i),boM,[7.8+e[0]*.15,e[1]*.9,e[2]*.9])});
 /* ---- synapse (magnified) ---- */
 const preM=MAT(0xf0a63a,{roughness:.3,clearcoat:.7,opacity:.3,sheen:0,emissive:0x5a3a08,emissiveIntensity:.15,depthWrite:!1});
 add("pre",sph(2.4,.04,1.2,1,.95,1,44,60,3),preM,[-3,0,0],{parent:syn,ns:1});
 const vesM=MAT(0x3fb6a8,{roughness:.25,clearcoat:1,opacity:.95,emissive:0x0a4a44,emissiveIntensity:.35});const vs=[];
 for(let i=0;i<14;i++){const a=i*2.399963,y=(i%5-2)*.55,z=Math.sin(a)*1.4,x=-1.6-(i%3)*.55+(i<4?.35:0);const m=add("ves4",sph(.27,.04,2,1,1,1,16,20,i),vesM,[x,y,z],{parent:syn,ns:1});vs.push({m,x,y,z,dock:i<5})}
 add("ves4",sph(.5,0,1,1.6,.7,.7,18,24),MAT(0xd9732b,{roughness:.5,opacity:.8,emissive:0x5a2200,emissiveIntensity:.2}),[-3.6,-1.2,.4],{parent:syn,ns:1}); /* mitochondrion */
 const postM=MAT(0xe08a8a,{roughness:.5,clearcoat:.5,opacity:.9,sheen:.3,emissive:0x4a1010,emissiveIntensity:.15,bumpScale:.25});
 add("post",param(36,36,(u,v)=>{const y=(u-.5)*7,z=(v-.5)*7,x=1.1+.5*Math.cos(Math.hypot(y,z)*.45)+.18*fbm(y*.4,z*.4,2);return[x,y,z]}),postM,[0,0,0],{parent:syn,ns:1});
 add("cleft",param(2,2,(u,v)=>[.55,(u-.5)*5.4,(v-.5)*5.4]),MAT(0xbfe4ff,{opacity:.12,roughness:.1,depthWrite:!1,sheen:0}),[0,0,0],{parent:syn,ns:1});
 const recM=MAT(0x3b6fd6,{roughness:.35,clearcoat:.7,emissive:0x0a2a7a,emissiveIntensity:.35});const recs=[];
 for(let i=0;i<12;i++){const a=i*2.399963,rr=.5+2.3*Math.sqrt(i/12),y=Math.cos(a)*rr,z=Math.sin(a)*rr,x=1.1+.5*Math.cos(Math.hypot(y,z)*.45)-.05;
  add("rec",tube([c(x+.05,y,z),c(x-.2,y,z)],.07,6),recM,[0,0,0],{parent:syn,ns:1});add("rec",sph(.16,0,1,.8,1,1,12,14),recM,[x-.3,y,z],{parent:syn,ns:1});recs.push([x-.3,y,z])}
 const NN=48,nt=new Wn(new it(.065,8,6),new bt({color:0xffe45e}),NN);nt.frustumCulled=!1;syn.add(nt);const m4=new gt;const nts=[];for(let i=0;i<NN;i++)nts.push({o:R(),v:recs[i%recs.length],v0:vs[i%vs.length]});
 /* ---- reflex arc ---- */
 const skinM=MAT(0xf1c9a5,{roughness:.55,clearcoat:.2,bumpScale:.3,opacity:.95});
 add("skin",param(24,24,(u,v)=>[-9.5+u*3,-.5+.12*Math.sin(u*14)+.1*fbm(u*6,v*4,1),(v-.5)*2.4]),skinM,[0,0,0],{parent:ref,ns:1});
 add("skin",sph(.2,.05,3,1,.6,1,14,18),MAT(0xff7a6a,{emissive:0x7a1a10,emissiveIntensity:.4,roughness:.4}),[-8,-.3,0],{parent:ref,ns:1});
 const sensP=[c(-8,-.2,0),c(-6.5,.2,.1),c(-4.5,.1,.5),c(-2.6,.3,.4),c(-1.6,.5,.2)],motP=[c(1.4,.5,.2),c(2.8,.2,.5),c(4.6,.4,.3),c(6.2,.2,0),c(7.4,0,0)];
 const sensM=MAT(0x6fb6ff,{roughness:.4,clearcoat:.6,emissive:0x0a2a6a,emissiveIntensity:.35}),motM=MAT(0xff8a6a,{roughness:.4,clearcoat:.6,emissive:0x6a1a0a,emissiveIntensity:.3}),relM=MAT(0xd6a8ff,{roughness:.4,clearcoat:.6,emissive:0x3a1a6a,emissiveIntensity:.3});
 add("sens",tube(sensP,.1,8),sensM,[0,0,0],{parent:ref,ns:1});add("sens",sph(.35,.05,2,1,1,1,16,20),sensM,[-3.6,.3,.5],{parent:ref,ns:1});
 add("motor",tube(motP,.1,8),motM,[0,0,0],{parent:ref,ns:1});add("motor",sph(.4,.05,2,1,1,1,16,20),motM,[1.9,.3,.3],{parent:ref,ns:1});
 const cordM=MAT(0xf1e9d8,{roughness:.55,clearcoat:.2,opacity:.45,depthWrite:!1,bumpScale:.2}),grayM=MAT(0x6b6860,{roughness:.6,opacity:1,bumpScale:.25});
 add("cord",sph(2.3,.02,1.5,1,1.02,.22,44,56,5),cordM,[0,0,0],{parent:ref,ns:1});
 [[-.55,.6],[.55,.6],[-.5,-.6],[.5,-.6]].forEach(q=>add("cord",sph(.8,.04,2,.85,.9,.25,22,30),grayM,[q[0],q[1],.06],{parent:ref,ns:1}));add("cord",sph(.12,0,1,1,1,.4,10,12),MAT(0x9fd3ff,{roughness:.2,emissive:0x1a4a8a,emissiveIntensity:.4}),[0,0,.14],{parent:ref,ns:1});
 add("cord",tube([c(-1.5,.5,.3),c(-.4,.4,.35),c(.4,.4,.35),c(1.4,.5,.3)],.09,8),relM,[0,0,0],{parent:ref,ns:1});add("cord",sph(.3,.05,2,1,1,1,14,18),relM,[0,.5,.38],{parent:ref,ns:1});
 const musc=add("musc",sph(1,.03,2,1.6,.55,.55,28,36),MAT(0xb23838,{roughness:.4,clearcoat:.5,sheen:.7,sheenC:0xff9a8a,bumpScale:.5}),[8.6,0,0],{parent:ref});
 /* impulse pulses */
 const pulseM=new bt({color:0xfff7a0}),halo=new bt({color:0xffd54f,transparent:!0,opacity:.35});
 const mkPulse=(par)=>{const a=new N(new it(.2,14,12),pulseM),b=new N(new it(.42,14,12),halo);a.add(b);par.add(a);a.visible=!1;return a};
 const pAx=mkPulse(g),pRef=mkPulse(ref);
 const refPath=new It([...sensP,c(-.8,.5,.2),c(0,.5,.25),c(.8,.5,.2),...motP]).getPoints(90);
 /* ions at a node */
 const NI=32,ions=new Wn(new it(.045,8,6),new bt({color:0xffffff}),NI);ions.frustumCulled=!1;g.add(ions);const ic=new we;for(let i=0;i<NI;i++)ions.setColorAt(i,ic.setHex(i%2?0xff9f43:0xb36bff));
 const nx0=XN[1];
 const cams=[[c(.8,1.6,21),c(.8,-1.4,0)],[c(-6.4,2.2,9.2),c(-6,0,0)],[c(0,2.2,11),c(0,0,0)],[c(nx0+.2,1.4,4.8),c(nx0,0,0)],[c(SY[0]-.5,2.4,11),c(SY[0],0,0)],[c(0,RF[1]+2,20),c(0,RF[1],0)]];
 const camK=["Neuron","Dendrites","Axon","Node","Synapse","Reflex arc"];
 const mine={soma:0,nuc4:0,dend:0,axon:0,myelin:0,node:0,term:0},S4=[...Object.keys(mine)];
 const show={};const fr=(ids,on)=>ids.forEach(i=>show[i]=on);
 const NEU=["soma","nuc4","dend","axon","myelin","node","term"],SYN=["pre","ves4","post","cleft","rec"],REF=["skin","sens","cord","motor","musc"];
 [...NEU,...SYN,...REF].forEach(i=>show[i]=[0,0,0,0,0,0]);
 NEU.forEach(i=>{for(let s=0;s<4;s++)show[i][s]=1});SYN.forEach(i=>show[i][4]=1);REF.forEach(i=>show[i][5]=1);show.soma[4]=0;
 const base={soma:.96,nuc4:.9,dend:.96,axon:1,myelin:.97,node:.95,term:1,pre:.3,ves4:.95,post:.9,cleft:.12,rec:1,skin:.95,sens:1,cord:.45,motor:1,musc:1};
 const L=(par,p)=>()=>par.localToWorld(c(...p));
 const labels=[["n-so","Cell body (soma)","कोशिका काय",L(g,[-6,1.2,0]),[0,1]],["n-nu","Nucleus","केंद्रक",L(g,[-6,0,.6]),[0,1]],["n-de","Dendrites (receive)","द्रुमिकाएँ (ग्रहण)",L(g,[-7.6,1.6,.5]),[0,1]],["n-ax","Axon (carries away)","एक्सॉन (दूर ले जाता)",L(g,[0,.2,0]),[0,1,2]],["n-my","Myelin sheath","माइलिन आवरण",L(g,[-.9,.5,0]),[0,2]],["n-no","Node of Ranvier","रैन्वियर पर्व",L(g,[XN[1],.2,0]),[2,3]],["n-te","Axon terminals","एक्सॉन अंत",L(g,[8.2,.9,.4]),[0,4]],["n-dir","Impulse direction →","आवेग की दिशा →",L(g,[-2,1.6,0]),[1,2]],
  ["n-na","Na⁺ in (depolarise)","Na⁺ अंदर (विध्रुवण)",L(g,[nx0-.3,.9,0]),[3]],["n-k","K⁺ out (repolarise)","K⁺ बाहर (पुनर्ध्रुवण)",L(g,[nx0+.3,-.9,0]),[3]],["n-ap","Action potential −70 → +30 mV","क्रिया-विभव −70 → +30 mV",L(g,[nx0,1.5,0]),[3]],
  ["s-pr","Pre-synaptic knob","पूर्व-सिनैप्टिक बटन",L(syn,[-3,2.4,0]),[4]],["s-ve","Vesicles with neurotransmitter","पुटिकाएँ (न्यूरोट्रांसमीटर)",L(syn,[-1.8,.55,1.4]),[4]],["s-cl","Synaptic cleft (~20 nm)","सिनैप्टिक दरार",L(syn,[.55,2.4,0]),[4]],["s-po","Post-synaptic membrane","पश्च-सिनैप्टिक झिल्ली",L(syn,[1.3,-2.5,1]),[4]],["s-re","Receptors","ग्राही",L(syn,[.8,.9,.6]),[4]],["s-nt","Neurotransmitter crossing","न्यूरोट्रांसमीटर पार जाता",L(syn,[.5,-.5,.5]),[4]],
  ["r-sk","Receptor (skin) — hot!","ग्राही (त्वचा) — गर्म!",L(ref,[-8,.7,0]),[5]],["r-se","Sensory neuron →","संवेदी तंत्रिका →",L(ref,[-4.6,.9,.5]),[5]],["r-sp","Spinal cord (relay neuron)","मेरुरज्जु (रिले तंत्रिका)",L(ref,[0,1.7,.2]),[5]],["r-mo","→ Motor neuron","→ प्रेरक तंत्रिका",L(ref,[4.5,.9,.3]),[5]],["r-mu","Effector: muscle contracts","प्रभावक: पेशी सिकुड़ती",L(ref,[8.6,1.1,0]),[5]]];
 return run({n,g,org,show,base,ST:N_ST,cams,camK,labels,
  frame:(s,t)=>{g.rotation.y=0;const f=(t*.13)%1;
   /* axon pulse: hops node to node */
   pAx.visible=s===1||s===2||s===3;if(pAx.visible){const pts=[-5.2,...XN,6.7],k=Math.floor(f*(pts.length-1)),q=f*(pts.length-1)-k,e=q<.35?q/.35:1,x=pts[k]+(pts[k+1]-pts[k])*(s===1?q:e*e*(3-2*e));pAx.position.set(x,0,0);pAx.scale.setScalar(1+.3*sin(t*14))}
   /* nodes flash as the pulse passes */
   org.forEach(o=>{if(o.id==="node"){const nx=o.m.position.x,near=pAx.visible&&Math.abs(pAx.position.x-nx)<.7;o.mat.emissiveIntensity=near?1.6:.5}});
   /* ions */
   for(let i=0;i<NI;i++){if(s!==3){m4.makeScale(0,0,0);ions.setMatrixAt(i,m4);continue}const na=i%2===0,q=((t*.5+i*.137)%1),side=(i>>1)%2?1:-1;const inn=na?q:1-q;const y=.2+(1-inn)*.9,z=((i*.31)%1-.5)*.5;m4.makeScale(1,1,1);m4.setPosition(nx0+(i%7-3)*.1+side*.05,na?y*(1):-.2-(1-q)*.0-(q*.9)+(q<.5?0:0),z);ions.setMatrixAt(i,m4)}ions.instanceMatrix.needsUpdate=!0;
   /* synapse vesicles dock/burst + transmitter */
   vs.forEach((v,i)=>{const rel=s===4?((t*.35+i*.07)%1):0;v.m.position.x=v.dock?v.x+(rel>.5?.6*(rel-.5)*2:0):v.x+.05*sin(t+i);v.m.scale.setScalar(v.dock&&rel>.55?Math.max(.3,1-(rel-.55)*2):1)});
   for(let i=0;i<NN;i++){const a=nts[i];if(s!==4){m4.makeScale(0,0,0);nt.setMatrixAt(i,m4);continue}const q=((t*.3+a.o)%1),st=q<.15?0:(q-.15)/.85,p0=a.v0,p1=a.v;const x=lerp(p0.x+.3,p1[0]-.2,Math.min(1,st*1.2)),y=lerp(p0.y,p1[1],st)+.08*sin(t*5+i),z=lerp(p0.z,p1[2],st);m4.makeScale(st>.02?1:0,st>.02?1:0,st>.02?1:0);m4.setPosition(x,y,z);nt.setMatrixAt(i,m4)}nt.instanceMatrix.needsUpdate=!0;
   /* reflex pulse + muscle */
   pRef.visible=s===5;if(pRef.visible){const k=Math.min(refPath.length-1,Math.floor(f*1.15*refPath.length)),p=refPath[k];pRef.position.copy(p);pRef.scale.setScalar(1+.3*sin(t*14));musc.scale.set(f*1.15>.92?.82:1,f*1.15>.92?1.35:1,f*1.15>.92?1.35:1)}else musc.scale.set(1,1,1)},
  predict:{q:"Why can the impulse travel faster along a myelinated axon?",opts:[["It jumps between the nodes of Ranvier",!0,"Correct — saltatory conduction skips the insulated parts."],["The axon is thicker",!1,"Thickness helps a little, but myelin is the main reason."],["Myelin makes electrons move",!1,"The impulse is a wave of ion movement, not a flow of electrons."]]}})}
Q_("ch6/neuron3d",[["Which part of a neuron receives information?","तंत्रिका कोशिका का कौन-सा भाग सूचना ग्रहण करता है?",["Axon","Dendrites","Myelin sheath","Axon terminal"],1,"Dendrites receive; the axon sends."],["What is the function of the myelin sheath?","माइलिन आवरण का कार्य?",["Makes proteins","Speeds up the impulse by insulating the axon","Stores neurotransmitter","Receives signals"],1,"Impulses jump between nodes."],["At a synapse the signal crosses the gap as…","सिनैप्स में संकेत दरार पार करता है…",["Electric current","Chemical neurotransmitter","Light","Sound"],1,"A chemical messenger diffuses across."],["Which is the correct reflex arc?","सही प्रतिवर्त चाप कौन-सा है?",["Receptor→sensory→relay→motor→effector","Brain→muscle→skin","Muscle→sensory→skin","Effector→relay→receptor"],0,"The path avoids the brain for speed."],["Which neuron carries the signal from the spinal cord to the muscle?","मेरुरज्जु से पेशी तक संकेत कौन-सी तंत्रिका ले जाती है?",["Sensory","Relay","Motor","None"],2,"Motor neurons carry commands to effectors."]]);
Px["ch6/neuron3d"]=[["Touching a hot pan: your hand pulls back in about 0.05 s — before the pain reaches your brain.","गर्म बर्तन छूते ही हाथ लगभग 0.05 s में हट जाता है — दर्द मस्तिष्क तक पहुँचने से पहले।"],["Some neurons in your leg are about 1 m long — the longest cells in the body.","पैर की कुछ तंत्रिका कोशिकाएँ लगभग 1 m लंबी होती हैं — शरीर की सबसे लंबी कोशिकाएँ।"]];
{const Ln=Hi.find(h=>h.no===6).topics,i=Ln.findIndex(x=>x.id==="neuron");Ln.splice(i<0?Ln.length:i+1,0,{id:"neuron3d",title:"Neuron, synapse & reflex arc — detailed 3D",hi:"न्यूरॉन, सिनैप्स व प्रतिवर्त चाप — विस्तृत 3D",build:Mneuron,ncert:"Ch 6 · control and coordination"})}
/* ===================== SET 5: KIDNEY · NEPHRON · DIALYSIS ===================== */
const KIND5={
 kid:["Kidney","वृक्क","Bean-shaped organ (about 11 cm) that filters about 180 litres of blood plasma a day and makes 1–2 litres of urine. We have two. (Hand-modelled; not a medical mesh.)","सेम के आकार का अंग (लगभग 11 cm) जो प्रतिदिन लगभग 180 लीटर रक्त-प्लाज़्मा छानता और 1–2 लीटर मूत्र बनाता है; हमारे दो वृक्क होते हैं।"],
 cortex:["Cortex","वल्कुट","Outer layer of the kidney where the glomeruli and convoluted tubules sit.","वृक्क की बाहरी परत जहाँ केशिकागुच्छ व कुंडलित नलिकाएँ होती हैं।"],
 medulla:["Medulla (pyramids)","मध्यांश (पिरामिड)","Inner cone-shaped region with the loops of Henle and collecting ducts; its salty fluid helps save water.","भीतरी शंकु-आकार क्षेत्र जिसमें हेनले-लूप व संग्रह नलिकाएँ हैं; इसका नमकीन द्रव जल बचाने में सहायक है।"],
 pelvis:["Renal pelvis","वृक्क श्रोणि","Funnel that collects urine and passes it into the ureter.","कीप जो मूत्र एकत्र कर मूत्रवाहिनी में भेजती है।"],
 ureter:["Ureter","मूत्रवाहिनी","Muscular tube that pushes urine from kidney to bladder by peristalsis.","पेशीय नली जो क्रमाकुंचन से मूत्र को वृक्क से मूत्राशय तक पहुँचाती है।"],
 bladder:["Urinary bladder","मूत्राशय","Stretchy muscular bag that stores urine until it is passed out through the urethra.","लचीली पेशीय थैली जो मूत्र को मूत्रमार्ग से बाहर निकलने तक जमा रखती है।"],
 renalA:["Renal artery","वृक्क धमनी","Brings blood (rich in urea) from the aorta to the kidney.","महाधमनी से यूरिया-युक्त रक्त वृक्क तक लाती है।"],
 renalV:["Renal vein","वृक्क शिरा","Takes the cleaned blood away from the kidney.","साफ़ हुआ रक्त वृक्क से दूर ले जाती है।"],
 bow:["Bowman's capsule","बोमन संपुट","Cup-shaped end of the nephron that wraps the glomerulus and collects the filtrate.","नेफ्रॉन का प्याले जैसा सिरा जो केशिकागुच्छ को घेरकर निस्यंद एकत्र करता है।"],
 glom:["Glomerulus","केशिकागुच्छ","A tuft of capillaries. High pressure squeezes water, glucose, salts and urea out of the blood; blood cells and big proteins stay in.","केशिकाओं का गुच्छा; उच्च दाब से जल, ग्लूकोज़, लवण व यूरिया रक्त से बाहर निचुड़ते हैं; रक्त कोशिकाएँ व बड़े प्रोटीन अंदर रहते हैं।"],
 aff:["Afferent arteriole","अभिवाही धमनिका","Wide vessel bringing blood into the glomerulus (wider than the exit, so pressure builds).","केशिकागुच्छ में रक्त लाने वाली चौड़ी वाहिका (निकास से चौड़ी, इसलिए दाब बनता है)।"],
 eff:["Efferent arteriole","अपवाही धमनिका","Narrow vessel leaving the glomerulus; it then forms capillaries around the tubule.","केशिकागुच्छ से निकलने वाली संकरी वाहिका; आगे नलिका के चारों ओर केशिकाएँ बनाती है।"],
 pct:["Proximal convoluted tubule","समीपस्थ कुंडलित नलिका","Where selective reabsorption happens: all glucose and amino acids, most salts and about two-thirds of the water go back to the blood.","चयनात्मक पुनरावशोषण यहीं: सारा ग्लूकोज़ व अमीनो अम्ल, अधिकांश लवण और लगभग दो-तिहाई जल रक्त में लौटता है।"],
 loop:["Loop of Henle","हेनले का पाश","U-shaped tube dipping into the medulla; it builds a salty gradient so more water can be recovered.","मध्यांश में उतरती U-आकार की नली; नमकीन ढाल बनाकर अधिक जल लौटाने में सहायक।"],
 dct:["Distal convoluted tubule","दूरस्थ कुंडलित नलिका","Fine-tunes salts and pH; secretes extra ions and waste into the tubule.","लवण व pH का सूक्ष्म नियमन; अतिरिक्त आयन व अपशिष्ट नलिका में स्रावित करती है।"],
 duct:["Collecting duct","संग्रह नलिका","Many nephrons drain here. Water is recovered under the control of hormone ADH; the remaining fluid is urine.","अनेक नेफ्रॉन यहाँ खाली होते हैं; हार्मोन ADH के नियंत्रण में जल लौटता है; शेष द्रव मूत्र है।"],
 cap:["Peritubular capillaries","नलिका-परिवेशी केशिकाएँ","Capillary net around the tubule that takes back the reabsorbed substances.","नलिका के चारों ओर केशिका-जाल जो पुनरावशोषित पदार्थ वापस ले लेता है।"],
 dia:["Dialysis machine (artificial kidney)","डायलिसिस मशीन (कृत्रिम वृक्क)","When kidneys fail, blood flows through tubes made of a semi-permeable membrane in dialysing fluid. Urea and extra salts diffuse out; blood cells and proteins stay in.","वृक्क विफल होने पर रक्त अर्धपारगम्य झिल्ली की नलिकाओं से डायलिसिस द्रव में बहता है; यूरिया व अतिरिक्त लवण बाहर विसरित होते हैं; रक्त कोशिकाएँ व प्रोटीन अंदर रहते हैं।"]};
const NE_ST=[
["1","The excretory system","उत्सर्जन तंत्र","Metabolism makes wastes such as urea. Two kidneys filter the blood; urine flows down the ureters to the bladder and leaves through the urethra.","उपापचय से यूरिया जैसे अपशिष्ट बनते हैं; दो वृक्क रक्त छानते हैं; मूत्र मूत्रवाहिनियों से मूत्राशय में आता है और मूत्रमार्ग से निकलता है।","Hand-modelled · not a medical mesh",9],
["2","Inside a kidney","वृक्क के भीतर","A cut kidney shows the outer cortex and the inner medulla made of pyramids that drain into the pelvis. Each kidney holds about a million tiny filters called nephrons.","कटे वृक्क में बाहरी वल्कुट और पिरामिडों वाला भीतरी मध्यांश दिखता है जो श्रोणि में खुलता है; प्रत्येक वृक्क में लगभग दस लाख सूक्ष्म छन्ने — नेफ्रॉन — होते हैं।","Hand-modelled",10],
["3","One nephron, enlarged","एक नेफ्रॉन, बड़ा करके","A nephron is the structural and functional unit of the kidney: Bowman's capsule with the glomerulus, proximal tubule, loop of Henle, distal tubule, ending in a collecting duct. (Greatly enlarged and stretched.)","नेफ्रॉन वृक्क की संरचनात्मक व क्रियात्मक इकाई है: केशिकागुच्छ सहित बोमन संपुट, समीपस्थ नलिका, हेनले पाश, दूरस्थ नलिका, और संग्रह नलिका। (बहुत बड़ा व खिंचा हुआ)।","Schematic · greatly enlarged",11],
["4","Step 1 — Filtration","चरण 1 — निस्यंदन","Blood enters the glomerulus under high pressure. Small molecules — water, glucose, salts, urea — are forced into Bowman's capsule. Blood cells and big proteins stay in the blood.","रक्त उच्च दाब पर केशिकागुच्छ में आता है; छोटे अणु — जल, ग्लूकोज़, लवण, यूरिया — बोमन संपुट में निचुड़ते हैं; रक्त कोशिकाएँ व बड़े प्रोटीन रक्त में रहते हैं।","Animated (particles not to scale)",12],
["5","Step 2 — Selective reabsorption","चरण 2 — चयनात्मक पुनरावशोषण","Along the proximal tubule the useful substances — all the glucose, amino acids, most salts and much water — are taken back into the capillaries. Urea stays behind.","समीपस्थ नलिका में उपयोगी पदार्थ — सारा ग्लूकोज़, अमीनो अम्ल, अधिकांश लवण व बहुत सा जल — केशिकाओं में लौट जाते हैं; यूरिया पीछे रहता है।","Animated · schematic",13],
["6","Step 3 — Loop of Henle and urine","चरण 3 — हेनले पाश व मूत्र","The loop recovers more water, the distal tubule fine-tunes salts, and the collecting duct saves still more water. What is left — water, urea, extra salts — is urine.","पाश और जल लौटाता है, दूरस्थ नलिका लवण समायोजित करती है, संग्रह नलिका और जल बचाती है; शेष — जल, यूरिया, अतिरिक्त लवण — मूत्र है।","Animated · schematic",13],
["7","Urine's journey","मूत्र की यात्रा","Urine collects in the renal pelvis, is pushed down the ureters by peristalsis into the bladder, and is stored. When the bladder is full, sphincters relax and urine is passed out.","मूत्र श्रोणि में एकत्र होता है, क्रमाकुंचन से मूत्रवाहिनियों में नीचे धकेला जाता है, मूत्राशय में जमा होता है; भर जाने पर अवरोधिनी शिथिल होकर मूत्र निकलता है।","Animated · schematic",10],
["8","When kidneys fail: dialysis","वृक्क विफल हों तो: डायलिसिस","In haemodialysis the patient's blood runs through tubes of semi-permeable membrane bathed in dialysing fluid. Urea and extra salts diffuse out; the cleaned blood returns to the body. A kidney transplant is the permanent cure.","हीमोडायलिसिस में रोगी का रक्त अर्धपारगम्य झिल्ली की नलिकाओं में डायलिसिस द्रव के बीच बहता है; यूरिया व अतिरिक्त लवण बाहर विसरित होते हैं; साफ़ रक्त शरीर में लौटता है। वृक्क प्रत्यारोपण स्थायी उपचार है।","Animated · schematic",13]];
function Mneph(){sd=51;const n=new Ne;Ge(n,{key:1.9});Je(n,-6,60,.08);const g=new J;n.add(g);const org=[];const add=mkAdd(g,org);
 const AN=new J;g.add(AN);const NP_=new J;NP_.position.set(24,0,0);g.add(NP_);const DI=new J;DI.position.set(0,-24,0);g.add(DI);
 /* ---------- anatomy ---------- */
 const cortM=MAT(0xc0584a,{roughness:.5,clearcoat:.5,bumpScale:.4,opacity:.55,sheen:.4,sheenC:0xff9a8a,emissive:0x3a0c08,emissiveIntensity:.15,depthWrite:!1});
 const medM=MAT(0x8a2f2c,{roughness:.55,clearcoat:.3,bumpScale:.35,emissive:0x2a0808,emissiveIntensity:.2});
 const kid=(sx)=>{const k=new J;k.position.set(sx,.4,0);AN.add(k);
  const bean=(u,v,cutFront)=>{const th=u*PI,ph=cutFront?(.75+v*1.5)*PI:v*TAU,x=sin(th)*cos(ph),y=cos(th),z=sin(th)*sin(ph),kk=1+.05*(fbm(x*2+sx,y*2,z*2)-.5);let X=x*1.45*kk,Y=y*2.5*kk,Z=z*1.05*kk;X-=sx>0?.0:0;const hil=Math.exp(-((y*2.5)*(y*2.5))/.9)*Math.max(0,-x*(sx>0?-1:1));X+=(sx>0?-1:1)*0;const side=sx>0?-1:1;X+=side*.55*Math.exp(-(Y*Y)/1.1)*Math.max(0,x*side*-1+.2)*.9*-1;return[X,Y,Z]};
  const c1=add("cortex",param(40,60,(u,v)=>bean(u,v,true)),cortM,[0,0,0],{parent:k,ns:1});
  add("kid",param(30,40,(u,v)=>{const p=bean(u,v,false);return[p[0]*.92,p[1]*.92,p[2]*.9]}),MAT(0xa94540,{roughness:.5,opacity:.0,depthWrite:!1}),[0,0,0],{parent:k,ns:1});
  for(let i=0;i<7;i++){const a=(i/7)*TAU*.85+.3,hx=Math.cos(a)*.7*(sx>0?-1:1)*0+Math.cos(a)*.65,hy=Math.sin(a)*1.55;add("medulla",param(14,24,(u,v)=>{const q=v*TAU,r=(1-u)*.34;return[hx+Math.cos(a)*u*.6+Math.cos(q)*r*.9,hy+Math.sin(a)*u*.45*0+Math.sin(q)*r*.9,Math.sin(q)*r*0+u*.0+Math.cos(q)*r*.5-.1]}),medM,[0,0,0],{parent:k,ns:1})}
  add("pelvis",tube([c(0,.5,0),c(-.5*(sx>0?1:-1)*-1,0,.1),c(-.9*(sx>0?1:-1)*-1,-.7,.1)],.26,10,u=>1-.4*u),MAT(0xf2d06b,{roughness:.4,clearcoat:.5,emissive:0x4a3a08,emissiveIntensity:.2}),[0,0,0],{parent:k,ns:1});
  return k};
 kid(-3.4);kid(3.4);
 const urM=MAT(0xf2d06b,{roughness:.4,clearcoat:.5,emissive:0x4a3a08,emissiveIntensity:.2});
 [-1,1].forEach(sx=>add("ureter",tube([c(sx*2.5,-.3,0),c(sx*2.2,-2.2,.1),c(sx*1.6,-4.2,.2),c(sx*.9,-5.6,.1)],.1,8),urM,[0,0,0],{parent:AN,ns:1}));
 const blad=add("bladder",sph(1.15,.05,2,1.1,.95,.9,32,44,3),MAT(0xe8b04a,{roughness:.45,clearcoat:.5,opacity:.8,bumpScale:.4,emissive:0x4a3008,emissiveIntensity:.15}),[0,-6.4,.1],{parent:AN});
 add("ureter",tube([c(0,-7.4,0),c(0,-8.6,0)],.12,8),urM,[0,0,0],{parent:AN,ns:1});
 const artM=MAT(0xd2413f,{roughness:.35,clearcoat:.7,emissive:0x5a0a08,emissiveIntensity:.25}),veinM=MAT(0x4f63d6,{roughness:.35,clearcoat:.7,emissive:0x101a5a,emissiveIntensity:.25});
 add("renalA",tube([c(0,3.4,0),c(0,2.2,0)],.26,10),artM,[0,0,0],{parent:AN,ns:1});add("renalV",tube([c(.5,-3.5,-.2),c(.5,2.6,-.2)],.2,10),veinM,[0,0,0],{parent:AN,ns:1});
 [-1,1].forEach(sx=>{add("renalA",tube([c(0,2.6,0),c(sx*1.2,1.5,.1),c(sx*2.2,.8,.2)],.12,8),artM,[0,0,0],{parent:AN,ns:1});add("renalV",tube([c(.5,0,-.2),c(sx*1.2,.3,-.1),c(sx*2.2,.3,0)],.1,8),veinM,[0,0,0],{parent:AN,ns:1})});
 /* ---------- one nephron ---------- */
 const tubM=MAT(0xf0b45a,{roughness:.3,clearcoat:.7,opacity:.8,emissive:0x5a3a08,emissiveIntensity:.18,depthWrite:!1,bumpScale:.15}),tubIn=MAT(0xfff1c8,{roughness:.4,opacity:.4,depthWrite:!1,sheen:0});
 const cur=[];const heli=(y0,y1,x0,r,tn,steps)=>{for(let i=0;i<=steps;i++){const q=i/steps;cur.push(c(x0+r*Math.sin(q*TAU*tn),y0+(y1-y0)*q,r*Math.cos(q*TAU*tn)*.9))}};
 cur.push(c(-3.9,4.6,0));heli(4.5,1.9,-3.4,.75,3.5,36);const M1=cur.length;                 /* PCT */
 cur.push(c(-2.6,1.2,0),c(-1.9,-1,0),c(-1.7,-4,0),c(-1.5,-6.4,0),c(-.9,-7.4,0),c(-.1,-6.4,0)); /* descending + turn */
 cur.push(c(.1,-3,0),c(.1,0,0),c(.1,2,0));const M2=cur.length;                              /* ascending */
 heli(2.3,3.5,1.2,.6,2.5,22);const M3=cur.length;cur.push(c(3.3,3.4,0),c(3.4,1,0),c(3.4,-3,0),c(3.4,-7,0),c(3.4,-9.2,0)); /* DCT + collecting */
 const cs=new It(cur),path=cs.getPoints(300);
 const CAPSULE=c(-4.7,6,0);
 add("bow",param(30,44,(u,v)=>{const th=u*PI*.82,ph=v*TAU,r=1.25;return[CAPSULE.x+Math.cos(th)*r*.0+Math.cos(ph)*Math.sin(th)*r-.0,CAPSULE.y-Math.cos(th)*r+.0,Math.sin(ph)*Math.sin(th)*r]}),tubM,[0,0,0],{parent:NP_,ns:1});
 add("pct",tube(cur.slice(0,M1+1),.2,10),tubM,[0,0,0],{parent:NP_,ns:1});
 add("loop",tube(cur.slice(M1,M2),.14,10),tubM,[0,0,0],{parent:NP_,ns:1});
 add("dct",tube(cur.slice(M2-1,M3+1),.17,10),tubM,[0,0,0],{parent:NP_,ns:1});
 add("duct",tube(cur.slice(M3),.26,10),tubM,[0,0,0],{parent:NP_,ns:1});
 [[-1.2,5,2.6],[1,5.2,-2.6],[-1.1,7.8,-3],[1.1,7.4,3]].forEach(q=>add("duct",tube([c(3.4+q[2]*.0,q[1],q[0]*2),c(3.4,q[1]-1.4,q[0]),c(3.4,q[1]-3,0)],.14,8),tubM,[0,0,0],{parent:NP_,ns:1}));
 /* glomerulus tuft inside capsule */
 const gloM=MAT(0xd2413f,{roughness:.35,clearcoat:.8,emissive:0x5a0a08,emissiveIntensity:.35,bumpScale:.2});
 for(let k=0;k<6;k++){const pts=[];for(let i=0;i<10;i++){const a=i/9*TAU*1.5+k*1.1;pts.push(c(CAPSULE.x+Math.cos(a)*(.45+.12*Math.sin(k+i)),CAPSULE.y+.0+Math.sin(a*1.3+k)*.45,Math.sin(a)*.5))}add("glom",tube(pts,.1,8),gloM,[0,0,0],{parent:NP_,ns:1})}
 const affP=[c(-9,8.2,0),c(-7.2,7.2,0),c(-5.6,6.5,0),CAPSULE.clone().add(c(.2,.4,0))];
 add("aff",tube(affP,.3,10,u=>1),gloM,[0,0,0],{parent:NP_,ns:1});
 const effP=[CAPSULE.clone().add(c(-.2,-.3,0)),c(-5.9,4.6,0),c(-6.4,3.6,0)];
 add("eff",tube(effP,.13,10),MAT(0xb23a38,{roughness:.35,clearcoat:.7,emissive:0x4a0a08,emissiveIntensity:.25}),[0,0,0],{parent:NP_,ns:1});
 /* peritubular capillaries wrapping the proximal tubule, then venule */
 const capM=MAT(0xd2413f,{roughness:.35,clearcoat:.6,opacity:.55,emissive:0x5a0a08,emissiveIntensity:.25,depthWrite:!1});
 for(let k=0;k<7;k++){const pts=[];for(let i=0;i<=16;i++){const q=i/16,a=q*TAU*5+k*.9;pts.push(c(-3.4+1.05*Math.sin(a)+(k%2?.15:-.15),4.7-(2.9)*q+.0,1.05*Math.cos(a)*.95))}add("cap",tube(pts,.05,6),capM,[0,0,0],{parent:NP_,ns:1})}
 const venP=[c(-3.6,1.6,0),c(-5.5,.8,0),c(-8,-.4,0),c(-10,-1.4,0)];add("cap",tube(venP,.2,10),MAT(0x4f63d6,{roughness:.35,clearcoat:.7,emissive:0x101a5a,emissiveIntensity:.25,opacity:.9}),[0,0,0],{parent:NP_,ns:1});
 /* medulla salt gradient backdrop */
 add("medbg",param(2,2,(u,v)=>[-6+u*13,-9+v*11.2,-1.6]),MAT(0xffb88a,{roughness:.6,opacity:.1,depthWrite:!1,sheen:0,envMapIntensity:.2}),[0,0,0],{parent:NP_,ns:1});
 /* particles */
 const NPT=110,pt=new Wn(new it(.07,8,6),new bt({color:0xffffff}),NPT);pt.frustumCulled=!1;NP_.add(pt);const pc=new we;const PT=[];
 const TYP=[[0x59b4ff,.3,1],[0xffd23f,.2,1.1],[0x8b5a2b,0,1.2],[0xff8a3d,.36,.9],[0x59b4ff,.58,1],[0x8b5a2b,0,1.2]];
 for(let i=0;i<NPT;i++){const t=TYP[i%6];PT.push({o:R(),leave:t[1],sc:t[2],col:t[0],side:(i%2?1:-1)});pt.setColorAt(i,pc.setHex(t[0]))}
 const nm4=new gt;const cellsA=[];const cell=new we(0xd2413f);const NC=10,rc=new Wn(new it(.14,10,8),new bt({color:0xb02a2a}),NC);rc.frustumCulled=!1;NP_.add(rc);
 const bigP=new Wn(new it(.1,8,6),new bt({color:0xfafafa}),6);bigP.frustumCulled=!1;NP_.add(bigP);
 /* ---------- dialysis ---------- */
 const tank=add("dia",boxy(5.6,2.5,2.2,.18,.0,2),MAT(0xbfe4ff,{opacity:.22,roughness:.1,clearcoat:.5,depthWrite:!1,sheen:0,envMapIntensity:.4}),[0,0,0],{parent:DI,ns:1});
 const bloodM=MAT(0xd2413f,{roughness:.35,clearcoat:.7,opacity:.85,emissive:0x5a0a08,emissiveIntensity:.3});
 for(let k=0;k<5;k++){const z=(k-2)*.6;add("dia",tube([c(-7.5,.2*(k-2),z),c(-5.5,.8*(k%2?1:-1),z),c(-2.5,-.8*(k%2?1:-1),z),c(.5,.8*(k%2?1:-1),z),c(3.5,-.8*(k%2?1:-1),z),c(7.5,.2*(k-2),z)],.16,10),bloodM,[0,0,0],{parent:DI,ns:1})}
 add("dia",tube([c(-9.5,0,0),c(-7.5,0,0)],.3,10),bloodM,[0,0,0],{parent:DI,ns:1});add("dia",tube([c(7.5,0,0),c(9.5,0,0)],.3,10),MAT(0xe86a5a,{roughness:.35,clearcoat:.7,emissive:0x5a1a08,emissiveIntensity:.25}),[0,0,0],{parent:DI,ns:1});
 const ND=60,dp=new Wn(new it(.07,8,6),new bt({color:0x8b5a2b}),ND);dp.frustumCulled=!1;DI.add(dp);const DD=[];for(let i=0;i<ND;i++)DD.push({o:R(),z:(R()-.5)*2.4,k:i%5});
 const ND2=40,flow=new Wn(new it(.05,6,5),new bt({color:0x59b4ff}),ND2);flow.frustumCulled=!1;DI.add(flow);
 const cams=[[c(0,1.4,19),c(0,-2,0)],[c(0,0,11),c(0,.2,0)],[c(21,-.5,40),c(21,-.5,0)],[c(21,5.6,12),c(21.4,5.6,0)],[c(21,3.2,12),c(20.8,3.2,0)],[c(24.4,-2.4,18),c(24.4,-2.4,0)],[c(0,-1,16),c(0,-3,0)],[c(0,-22,19),c(0,-24,0)]];
 const camK=["System","Kidney","Nephron","Filtration","Reabsorption","Loop & urine","Urine path","Dialysis"];
 const show={};const rows={medbg:[0,0,1,0,0,1,0,0],kid:[1,0,0,0,0,0,1,0],cortex:[1,1,0,0,0,0,1,0],medulla:[1,1,0,0,0,0,1,0],pelvis:[1,1,0,0,0,0,1,0],ureter:[1,1,0,0,0,0,1,0],bladder:[1,0,0,0,0,0,1,0],renalA:[1,1,0,0,0,0,1,0],renalV:[1,1,0,0,0,0,1,0],
  bow:[0,0,1,1,1,1,0,0],glom:[0,0,1,1,1,0,0,0],aff:[0,0,1,1,0,0,0,0],eff:[0,0,1,1,1,0,0,0],pct:[0,0,1,1,1,1,0,0],loop:[0,0,1,0,0,1,0,0],dct:[0,0,1,0,0,1,0,0],duct:[0,0,1,0,0,1,0,0],cap:[0,0,1,0,1,0,0,0],dia:[0,0,0,0,0,0,0,1]};
 Object.assign(show,rows);
 const base={medbg:.12,kid:0,cortex:.55,medulla:.95,pelvis:1,ureter:1,bladder:.8,renalA:1,renalV:1,bow:.8,glom:1,aff:1,eff:1,pct:.8,loop:.8,dct:.8,duct:.8,cap:.55,dia:.22};
 const L=(par,p)=>()=>par.localToWorld(c(...p));
 const labels=[["k-ki","Kidney (×2)","वृक्क (×2)",L(AN,[-3.4,1.2,1.1]),[0]],["k-ur","Ureter","मूत्रवाहिनी",L(AN,[-2.2,-2.2,.1]),[0,6]],["k-bl","Urinary bladder","मूत्राशय",L(AN,[1.2,-6.4,.6]),[0,6]],["k-ra","Renal artery (urea-rich blood)","वृक्क धमनी",L(AN,[-.4,2.8,0]),[0]],["k-rv","Renal vein (clean blood)","वृक्क शिरा",L(AN,[.9,-2,-.2]),[0]],["k-ur2","Urethra → out","मूत्रमार्ग → बाहर",L(AN,[.2,-8.4,0]),[0,6]],
  ["k-co","Cortex (nephrons here)","वल्कुट (नेफ्रॉन यहाँ)",L(AN,[-4.6,1.6,.9]),[1]],["k-me","Medulla (pyramids)","मध्यांश (पिरामिड)",L(AN,[-3.4,-.6,.3]),[1]],["k-pe","Renal pelvis","वृक्क श्रोणि",L(AN,[-2.6,-.1,.1]),[1]],
  ["n-bo","Bowman's capsule","बोमन संपुट",L(NP_,[-4.7,6,.9]),[2,3]],["n-gl","Glomerulus","केशिकागुच्छ",L(NP_,[-4.7,6.2,0]),[2,3]],["n-af","Afferent (wide) in","अभिवाही (चौड़ी) अंदर",L(NP_,[-7.6,7.6,0]),[2,3]],["n-ef","Efferent (narrow) out","अपवाही (संकरी) बाहर",L(NP_,[-6.2,4,0]),[2,3]],["n-pc","Proximal tubule","समीपस्थ नलिका",L(NP_,[-2.6,3.2,.9]),[2,4]],["n-lo","Loop of Henle","हेनले पाश",L(NP_,[-.8,-7.6,0]),[2,5]],["n-dc","Distal tubule","दूरस्थ नलिका",L(NP_,[1.8,3.4,.8]),[2,5]],["n-cd","Collecting duct","संग्रह नलिका",L(NP_,[3.4,-4,.6]),[2,5]],["n-ca","Peritubular capillaries","नलिका-परिवेशी केशिकाएँ",L(NP_,[-4.3,3.2,.9]),[2,4]],
  ["f-fi","Filtrate: water, glucose, salts, urea","निस्यंद: जल, ग्लूकोज़, लवण, यूरिया",L(NP_,[-3,7.2,.4]),[3]],["f-rb","Blood cells & proteins stay","रक्त कोशिकाएँ व प्रोटीन रुकते",L(NP_,[-6.4,6.6,.5]),[3]],["r-gl","Glucose back to blood (100%)","ग्लूकोज़ रक्त में लौटा (100%)",L(NP_,[-4.9,2.5,.9]),[4]],["r-wa","Water & salts back","जल व लवण वापस",L(NP_,[-2.6,2,.9]),[4]],["r-ur","Urea stays in the tubule","यूरिया नलिका में रहता",L(NP_,[-1.8,-2,.6]),[4,5]],["l-sa","Salty medulla (gradient)","नमकीन मध्यांश (ढाल)",L(NP_,[1.6,-5.4,-.8]),[5]],["l-ur","Urine: water + urea + salts","मूत्र: जल + यूरिया + लवण",L(NP_,[3.4,-8.4,.6]),[5]],
  ["d-bl","Blood in (urea high)","रक्त अंदर (यूरिया अधिक)",L(DI,[-8.6,.8,0]),[7]],["d-me","Semi-permeable membrane","अर्धपारगम्य झिल्ली",L(DI,[-3,1.6,.5]),[7]],["d-fl","Dialysing fluid","डायलिसिस द्रव",L(DI,[2,-2.4,1]),[7]],["d-ur","Urea leaves the blood","यूरिया रक्त से बाहर",L(DI,[.4,.8,1.2]),[7]],["d-cl","Cleaned blood returns","साफ़ रक्त लौटता",L(DI,[8.8,.8,0]),[7]]];
 return run({n,g,org,show,base,ST:NE_ST,cams,camK,labels,
  frame:(s,t)=>{const f0=(t*.1)%1;AN.rotation.y=s===0?sin(t*.2)*.18:0;
   /* nephron particles */
   for(let i=0;i<NPT;i++){const p=PT[i];let vis=s>=3&&s<=5;if(!vis){nm4.makeScale(0,0,0);pt.setMatrixAt(i,nm4);continue}
    const lim=s===3?.1:s===4?.5:1;let f=((t*.045+p.o)%1)*lim;let pos;
    if(s===3){const q=((t*.2+p.o)%1);const a=CAPSULE;pos=c(a.x+(q-.5)*.5,a.y+q*.5+.1,(p.o-.5)*.9);pos.x+=q*.8;if(i%6>2)pos.copy(path[Math.floor(q*20)])}else if(f<p.leave||p.leave===0||s<4){pos=path[Math.min(299,Math.floor(f*299))].clone();pos.z+=(p.o-.5)*.1}
    else{const g_=cl((f-p.leave)/.12,0,1),a0=path[Math.min(299,Math.floor(p.leave*299))];const tgt=c(a0.x+p.side*.7,a0.y,a0.z+p.side*.5);pos=a0.clone().lerp(tgt,Math.min(1,g_*3));if(g_>.3){const w=venP[1].clone().lerp(venP[2],(g_-.3)/.7);pos.lerp(w,(g_-.3)*1.2)}}
    const k=p.sc*(s===4&&p.leave>0&&f>p.leave?.8:1);nm4.makeScale(k,k,k);nm4.setPosition(pos.x,pos.y,pos.z);pt.setMatrixAt(i,nm4)}pt.instanceMatrix.needsUpdate=!0;
   /* blood cells through the glomerulus loop */
   for(let i=0;i<NC;i++){if(s<2||s>4){nm4.makeScale(0,0,0)}else{const q=((t*.12+i/NC)%1),P=q<.5?affP[0].clone().lerp(affP[3],q/.5):CAPSULE.clone().lerp(effP[2],(q-.5)/.5);nm4.makeScale(1,.6,1);nm4.setPosition(P.x,P.y,P.z)}rc.setMatrixAt(i,nm4)}rc.instanceMatrix.needsUpdate=!0;
   for(let i=0;i<6;i++){if(s!==3){nm4.makeScale(0,0,0)}else{const q=((t*.12+i/6)%1),P=affP[1].clone().lerp(CAPSULE,q);nm4.makeScale(1.2,1.2,1.2);nm4.setPosition(P.x+.1,P.y+.15,P.z+.12)}bigP.setMatrixAt(i,nm4)}bigP.instanceMatrix.needsUpdate=!0;
   /* bladder fills in step 7 */blad.scale.setScalar(s===6?1+.18*(.5+.5*sin(t*.6)):1);
   /* dialysis */
   for(let i=0;i<ND;i++){const d=DD[i];if(s!==7){nm4.makeScale(0,0,0)}else{const q=((t*.12+d.o)%1);nm4.makeScale(1,1,1);const x=-6+q*12,y=Math.sin(q*TAU*1.5)*.7*(d.k%2?1:-1);nm4.setPosition(x,y+(q>.1?(q-.1)*(d.k%2?1.2:-1.2):0)*(.8),d.z*.8)}dp.setMatrixAt(i,nm4)}dp.instanceMatrix.needsUpdate=!0;
   for(let i=0;i<ND2;i++){if(s!==7){nm4.makeScale(0,0,0)}else{const q=((t*.2+i/ND2)%1);nm4.makeScale(1,1,1);nm4.setPosition(5.5-q*11,(i%4-1.5)*.5,((i*.37)%1-.5)*1.6)}flow.setMatrixAt(i,nm4)}flow.instanceMatrix.needsUpdate=!0},
  predict:{q:"In which part of the nephron is all the glucose reabsorbed?",opts:[["Bowman's capsule",!1,"Glucose is filtered here, not taken back."],["Proximal convoluted tubule",!0,"Correct — selective reabsorption returns all the glucose to the blood."],["Collecting duct",!1,"Mainly water is recovered there."]]}})}
Q_("ch5/nephron3d",[["The structural and functional unit of the kidney is…","वृक्क की संरचनात्मक व क्रियात्मक इकाई…",["Neuron","Nephron","Alveolus","Villus"],1,"Each kidney has about a million nephrons."],["Filtration takes place in the…","निस्यंदन कहाँ होता है?",["Loop of Henle","Glomerulus and Bowman's capsule","Collecting duct","Ureter"],1,"High pressure forces small molecules out of the blood."],["Which substance is NOT normally present in the filtrate that passes into urine?","इनमें से मूत्र में सामान्यतः क्या नहीं आता?",["Urea","Glucose","Water","Salts"],1,"All glucose is reabsorbed."],["The tube carrying urine from kidney to bladder is the…","मूत्र को वृक्क से मूत्राशय ले जाने वाली नली?",["Urethra","Ureter","Aorta","Trachea"],1,"The urethra carries urine out of the body."],["Dialysis works because the membrane is…","डायलिसिस इसलिए काम करता है क्योंकि झिल्ली…",["Semi-permeable","Impermeable","Fully permeable","Thick"],0,"Small waste molecules pass; blood cells and proteins do not."]]);
Px["ch5/nephron3d"]=[["Your kidneys filter all your blood about 40 times a day — and send back all the glucose.","आपके वृक्क एक दिन में लगभग 40 बार सारा रक्त छानते हैं — और सारा ग्लूकोज़ लौटा देते हैं।"],["Drinking enough water keeps urine pale; very dark urine means the body is saving water.","पर्याप्त जल पीने से मूत्र हल्का रहता है; बहुत गहरा रंग शरीर में जल की कमी बताता है।"]];
{const Lq=Hi.find(h=>h.no===5).topics,i=Lq.findIndex(x=>x.id==="nephron");Lq.splice(i<0?Lq.length:i+1,0,{id:"nephron3d",title:"Kidney, nephron & dialysis — detailed 3D",hi:"वृक्क, नेफ्रॉन व डायलिसिस — विस्तृत 3D",build:Mneph,ncert:"Ch 5 · excretion in human beings"})}
/* ===================== SET 6: HUMAN REPRODUCTION ===================== */
const KIND6={
 testis:["Testis","वृषण","Makes sperm (in seminiferous tubules) and the hormone testosterone. It hangs in the scrotum where it is about 2–3 °C cooler than the body — needed for sperm formation.","शुक्राणु (शुक्रजनक नलिकाओं में) और टेस्टोस्टेरोन बनाता है; वृषणकोष में लटका रहता है जहाँ तापमान शरीर से 2–3 °C कम होता है — शुक्राणु बनने के लिए आवश्यक।"],
 epid:["Epididymis","अधिवृषण","A tightly coiled tube on the testis where sperm mature and are stored.","वृषण पर कसकर कुंडलित नली जहाँ शुक्राणु परिपक्व होकर संचित रहते हैं।"],
 vas:["Vas deferens","शुक्रवाहिका","Muscular tube that carries sperm from the epididymis up and over the bladder to join the urethra.","पेशीय नली जो शुक्राणुओं को अधिवृषण से मूत्राशय के ऊपर से मूत्रमार्ग तक ले जाती है।"],
 scrot:["Scrotum","वृषणकोष","Skin sac keeping the testes 2–3 °C below body temperature.","त्वचा की थैली जो वृषणों को शरीर से 2–3 °C ठंडा रखती है।"],
 sv:["Seminal vesicle","शुक्राशय","Gland adding a sugar-rich fluid (fructose) that feeds the sperm and helps them swim.","ग्रंथि जो फ्रक्टोज़-युक्त द्रव मिलाती है; यह शुक्राणुओं को पोषण व तैरने में सहायता देता है।"],
 prost:["Prostate gland","पुरःस्थ ग्रंथि","Adds an alkaline fluid. Sperm + these fluids = semen.","क्षारीय द्रव जोड़ती है; शुक्राणु + ये द्रव = वीर्य।"],
 ureth:["Urethra","मूत्रमार्ग","In males it carries both urine and semen (never at the same time).","पुरुषों में मूत्र व वीर्य दोनों ले जाता है (एक साथ नहीं)।"],
 bladm:["Urinary bladder","मूत्राशय","Part of the urinary system, shown for position.","मूत्र-तंत्र का भाग, स्थिति दिखाने हेतु।"],
 head:["Sperm head","शुक्राणु का शीर्ष","Contains the nucleus with 23 chromosomes. The acrosome cap holds enzymes that dissolve the egg's coat.","23 गुणसूत्रों वाला केंद्रक; एक्रोसोम टोपी में एंज़ाइम होते हैं जो अंडे की परत घोलते हैं।"],
 mid:["Mid-piece","मध्य खंड","Packed with mitochondria that release the energy (ATP) for swimming.","माइटोकॉन्ड्रिया से भरा; तैरने के लिए ऊर्जा (ATP) देता है।"],
 tail:["Tail (flagellum)","पूँछ (कशाभिका)","Whip-like tail that propels the sperm forward at about 3 mm per minute.","कोड़े जैसी पूँछ जो शुक्राणु को लगभग 3 mm प्रति मिनट आगे धकेलती है।"],
 uterus:["Uterus (womb)","गर्भाशय","A pear-shaped muscular organ where the embryo implants and grows. Its inner lining (endometrium) thickens every month.","नाशपाती के आकार का पेशीय अंग जहाँ भ्रूण रोपित होकर बढ़ता है; इसकी भीतरी परत (एंडोमेट्रियम) हर माह मोटी होती है।"],
 endo:["Endometrium","एंडोमेट्रियम","Soft, blood-rich lining that prepares for the embryo each month; shed as menstruation if there is no pregnancy.","कोमल, रक्त-समृद्ध परत जो हर माह भ्रूण के लिए तैयार होती है; गर्भ न ठहरे तो माहवारी में निकल जाती है।"],
 cervix:["Cervix","ग्रीवा","Narrow lower end of the uterus opening into the vagina.","गर्भाशय का संकरा निचला सिरा जो योनि में खुलता है।"],
 vagina:["Vagina","योनि","Muscular canal that receives sperm and serves as the birth canal.","पेशीय नली जो शुक्राणु ग्रहण करती है और जन्म-मार्ग भी है।"],
 tube:["Fallopian tube (oviduct)","अंडवाहिनी","Carries the egg from the ovary towards the uterus. Fertilisation normally happens in its upper part.","अंडे को अंडाशय से गर्भाशय की ओर ले जाती है; निषेचन सामान्यतः इसके ऊपरी भाग में होता है।"],
 fim:["Fimbriae","झालर","Finger-like fringes that sweep the released egg into the tube.","उँगली जैसी झालरें जो निकले अंडे को नली में बुहार लेती हैं।"],
 ovary:["Ovary","अंडाशय","Makes eggs (ova) and the hormones oestrogen and progesterone. One egg is released about every 28 days.","अंडाणु तथा हार्मोन एस्ट्रोजन व प्रोजेस्टेरोन बनाता है; लगभग हर 28 दिन में एक अंडाणु निकलता है।"],
 foll:["Follicle","पुटक","A fluid-filled bubble in which an egg ripens. The mature follicle bursts at ovulation.","तरल से भरा बुलबुला जिसमें अंडाणु परिपक्व होता है; अंडोत्सर्ग पर परिपक्व पुटक फटता है।"],
 egg:["Egg cell (ovum)","अंडाणु","The largest human cell (~0.1 mm). It carries 23 chromosomes and a store of food in its cytoplasm.","मानव की सबसे बड़ी कोशिका (~0.1 mm); 23 गुणसूत्र व कोशिकाद्रव्य में भोजन भंडार।"],
 zona:["Zona pellucida","ज़ोना पेल्यूसिडा","Clear protective coat. Once one sperm gets through, it hardens so no other sperm can enter.","पारदर्शी सुरक्षा-परत; एक शुक्राणु के प्रवेश के बाद सख्त हो जाती है ताकि दूसरा न घुसे।"],
 corona:["Corona radiata","कोरोना रेडिएटा","Ring of follicle cells that surround the egg.","अंडे को घेरे हुए पुटक कोशिकाओं का घेरा।"],
 nucz:["Nucleus","केंद्रक","Holds the mother's 23 chromosomes; after fertilisation it fuses with the father's 23 to make the zygote's 46.","माँ के 23 गुणसूत्र; निषेचन के बाद पिता के 23 से मिलकर युग्मनज के 46 बनाता है।"],
 stage:["Early embryo","प्रारंभिक भ्रूण","The zygote divides again and again (cleavage) without growing: 2 → 4 → 8 → morula → blastocyst.","युग्मनज बिना बढ़े बार-बार विभाजित होता है (विदलन): 2 → 4 → 8 → मोरुला → ब्लास्टोसिस्ट।"],
 blast:["Blastocyst","ब्लास्टोसिस्ट","A hollow ball: the outer cells will form the placenta, the inner cell mass will become the baby. It implants in the uterus wall about 6–7 days after fertilisation.","खोखली गेंद: बाहरी कोशिकाएँ अपरा बनाएँगी, भीतरी कोशिका समूह शिशु; निषेचन के लगभग 6–7 दिन बाद गर्भाशय की भित्ति में रोपित होता है।"],
 foet:["Embryo / foetus","भ्रूण / गर्भस्थ शिशु","Grows in a fluid-filled amniotic sac that cushions it. Human pregnancy lasts about 9 months (≈ 40 weeks).","तरल से भरी उल्ब-थैली में बढ़ता है जो इसे आघात से बचाती है; मानव गर्भकाल लगभग 9 माह (≈ 40 सप्ताह)।"],
 plac:["Placenta","अपरा (प्लेसेंटा)","Disc-shaped organ with villi embedded in the uterus wall. Oxygen and nutrients pass from mother to baby; CO₂ and wastes pass back. Mother's and baby's blood never mix.","गर्भाशय-भित्ति में धँसी तश्तरीनुमा संरचना (दीर्घरोम सहित); ऑक्सीजन व पोषण माँ से शिशु को, CO₂ व अपशिष्ट वापस; दोनों का रक्त आपस में नहीं मिलता।"],
 cord:["Umbilical cord","नाभि-रज्जु","Links the baby to the placenta: two arteries and one vein.","शिशु को अपरा से जोड़ती है: दो धमनियाँ व एक शिरा।"],
 amn:["Amniotic fluid","उल्बीय द्रव","Protects the foetus from shocks and keeps temperature steady.","भ्रूण को आघात से बचाता और तापमान स्थिर रखता है।"]};
const R_ST=[
["1","Male reproductive system","पुरुष जनन तंत्र","Testes make sperm and testosterone. Sperm mature in the epididymis, travel through the vas deferens, mix with fluids from the seminal vesicles and prostate (semen) and leave through the urethra.","वृषण शुक्राणु व टेस्टोस्टेरोन बनाते हैं; शुक्राणु अधिवृषण में परिपक्व होते, शुक्रवाहिका से जाते, शुक्राशय व पुरःस्थ ग्रंथि के द्रवों से मिलकर (वीर्य) मूत्रमार्ग से निकलते हैं।","Hand-modelled · schematic",11],
["2","The sperm cell","शुक्राणु कोशिका","A sperm is a tiny swimmer (about 0.05 mm) with a head carrying 23 chromosomes and an acrosome, a mid-piece full of mitochondria and a long tail.","शुक्राणु लगभग 0.05 mm का सूक्ष्म तैराक है: 23 गुणसूत्रों व एक्रोसोम वाला शीर्ष, माइटोकॉन्ड्रिया से भरा मध्य खंड और लंबी पूँछ।","Animated · greatly enlarged",11],
["3","Female reproductive system","महिला जनन तंत्र","Two ovaries make eggs and hormones. Fallopian tubes carry the egg to the pear-shaped uterus. The cervix and vagina lead outside.","दो अंडाशय अंडाणु व हार्मोन बनाते हैं; अंडवाहिनियाँ अंडे को नाशपाती-आकार के गर्भाशय तक पहुँचाती हैं; ग्रीवा व योनि बाहर की ओर खुलते हैं।","Hand-modelled · cut-away",11],
["4","The egg and ovulation","अंडाणु व अंडोत्सर्ग","Every month a follicle ripens, bursts and releases an egg (ovulation, about day 14). The fimbriae sweep it into the fallopian tube.","हर माह एक पुटक परिपक्व होकर फटता है और अंडाणु निकलता है (अंडोत्सर्ग, लगभग 14वाँ दिन); झालरें उसे अंडवाहिनी में बुहार लेती हैं।","Animated · schematic",12],
["5","Fertilisation","निषेचन","Millions of sperm swim up; they must pass the corona and zona. The first to enter fuses with the egg: the nuclei merge (23 + 23 = 46 chromosomes) and the zygote is formed.","लाखों शुक्राणु तैरते हैं; कोरोना व ज़ोना पार करनी होती है; पहला प्रवेश करने वाला अंडे से जुड़ता है, केंद्रक मिलते हैं (23 + 23 = 46 गुणसूत्र) और युग्मनज बनता है।","Animated · greatly enlarged",14],
["6","Cleavage and implantation","विदलन व रोपण","The zygote divides repeatedly as it moves to the uterus: 2, 4, 8 cells, morula, then a hollow blastocyst, which burrows into the endometrium (implantation).","युग्मनज गर्भाशय की ओर जाते हुए बार-बार विभाजित होता है: 2, 4, 8 कोशिकाएँ, मोरुला, फिर खोखला ब्लास्टोसिस्ट, जो एंडोमेट्रियम में धँस जाता है (रोपण)।","Schematic row · not to scale",12],
["7","Placenta and the growing baby","अपरा व बढ़ता शिशु","The embryo floats in amniotic fluid and is nourished through the placenta and umbilical cord: oxygen and food go in, carbon dioxide and wastes come out.","भ्रूण उल्बीय द्रव में तैरता है और अपरा व नाभि-रज्जु से पोषण पाता है: ऑक्सीजन व भोजन अंदर, CO₂ व अपशिष्ट बाहर।","Animated · schematic",13],
["8","The monthly (menstrual) cycle","मासिक (आर्तव) चक्र","Over about 28 days a follicle ripens, ovulation occurs near day 14 and the uterine lining thickens. If no embryo implants, the lining is shed (menstruation, days 1–5) and the cycle repeats.","लगभग 28 दिन में पुटक परिपक्व होता है, 14वें दिन के आसपास अंडोत्सर्ग होता है, गर्भाशय-परत मोटी होती है; भ्रूण न रुके तो परत निकल जाती है (माहवारी, दिन 1–5) और चक्र दोहराता है।","Animated · 28-day loop",16]];
function Mrepro(){sd=61;const n=new Ne;Ge(n,{key:1.9});Je(n,-7,80,.08);const g=new J;n.add(g);const org=[];const add=mkAdd(g,org);
 const M=new J;M.position.set(-26,0,0);g.add(M);const F=new J;g.add(F);const Z=new J;Z.position.set(26,0,0);g.add(Z);const Dv=new J;Dv.position.set(0,-24,0);g.add(Dv);const E=new J;E.position.set(26,-24,0);g.add(E);
 const pink=MAT(0xe9a2a0,{roughness:.5,clearcoat:.4,sheen:.4,sheenC:0xffd0d0,bumpScale:.3,opacity:.5,depthWrite:!1,emissive:0x3a1010,emissiveIntensity:.1});
 const flesh=MAT(0xeaa39a,{roughness:.7,clearcoat:.1,bumpScale:.06,sheen:0,emissive:0x6a2a24,emissiveIntensity:.28});const yel=MAT(0xf2d06b,{roughness:.4,clearcoat:.5,emissive:0x4a3a08,emissiveIntensity:.2});
 const prof=u=>{const w=u<.12?.24+.2*u:.24+.98*Math.pow(Math.sin(Math.min(1,(u-.08)/.82)*PI/2),1.25);return u>.9?w*Math.sqrt(Math.max(0,1-Math.pow((u-.9)/.1,2))):w};
 /* ---------- male ---------- */
 const sac=add("scrot",param(30,44,(u,v)=>{const th=u*PI,ph=v*TAU;return[sin(th)*cos(ph)*2.1,-3.1+cos(th)*1.35,sin(th)*sin(ph)*.95]}),MAT(0xf1c9a5,{roughness:.55,opacity:.22,depthWrite:!1,bumpScale:.3,sheen:0}),[0,0,0],{parent:M,ns:1});
 [-1,1].forEach(sx=>{add("testis",sph(.72,.04,2,.8,1.15,.8,28,36,sx),MAT(0xf0d8b8,{roughness:.4,clearcoat:.7,opacity:.95,sheen:.3,emissive:0x3a2a10,emissiveIntensity:.1}),[sx*.95,-3.1,0],{parent:M});
  const pts=[];for(let i=0;i<=40;i++){const q=i/40,a=q*TAU*5;pts.push(c(sx*.95+sx*.35+.18*Math.sin(a),-2.4-q*.0+.45*Math.cos(q*PI)*.0-.45*q+.25*(1-q),-.15+.16*Math.cos(a)))}add("epid",tube(pts,.07,8),yel,[0,0,0],{parent:M,ns:1});
  add("vas",tube([c(sx*1.3,-2.5,-.25),c(sx*1.45,-1,-.3),c(sx*1.1,.6,-.3),c(sx*.5,1.5,-.1),c(sx*.3,.2,.1),c(sx*.12,-.7,.1)],.1,8),yel,[0,0,0],{parent:M,ns:1});
  add("sv",sph(.36,.15,3,.8,1.6,.8,18,24,sx),MAT(0xe4b86a,{roughness:.5,bumpScale:.4}),[sx*.65,-.2,-.55],{parent:M,rot:[0,0,sx*.5]})});
 add("bladm",sph(.95,.05,2,1,.9,.9,28,36),MAT(0xe8b04a,{roughness:.45,clearcoat:.5,opacity:.7,bumpScale:.3,depthWrite:!1}),[0,1.5,.3],{parent:M});
 add("prost",sph(.5,.05,2,1.1,.9,.9,20,28),MAT(0xd98a6a,{roughness:.5,bumpScale:.3}),[0,-.9,.1],{parent:M});
 add("ureth",tube([c(0,1.0,.3),c(0,-.6,.15),c(0,-1.5,.3),c(0,-3.4,.85)],.12,8),MAT(0xfff1a8,{roughness:.4,emissive:0x4a3a08,emissiveIntensity:.25}),[0,0,0],{parent:M,ns:1});
 add("ureth",tube([c(0,-1.4,.3),c(0,-3.2,.8),c(0,-4.2,1.0)],.3,12,u=>1-.15*u),MAT(0xf1c9a5,{roughness:.55,opacity:.55,depthWrite:!1,bumpScale:.2}),[0,0,0],{parent:M,ns:1});
 /* ---------- female ---------- */
 const ang=v=>(.75+v*1.5)*PI;
 const wall=add("uterus",param(36,60,(u,v)=>{const y=-1.6+u*3.2,r=prof(u)*1.0,a=ang(v);return[cos(a)*r*1.15,y,sin(a)*r*.7]}),pink,[0,0,0],{parent:F,ns:1});
 const endoM=MAT(0xc9373a,{roughness:.5,clearcoat:.4,bumpScale:.4,emissive:0x4a0808,emissiveIntensity:.25,sheen:.5,sheenC:0xff9a9a});
 const endo=add("endo",param(34,56,(u,v)=>{const y=-1.1+u*2.5,r=prof(.15+u*.8)*.62,a=ang(v);return[cos(a)*r*1.15,y,sin(a)*r*.7]}),endoM,[0,0,0],{parent:F,ns:1});
 add("cervix",tube([c(0,-1.9,0),c(0,-1.45,0)],.3,12),MAT(0xe29c94,{roughness:.7,bumpScale:.05,sheen:0,emissive:0x6a2a24,emissiveIntensity:.25}),[0,0,0],{parent:F,ns:1});
 add("vagina",tube([c(0,-1.9,0),c(0,-3.6,.2),c(0,-5,.5)],.4,14),flesh,[0,0,0],{parent:F,ns:1});
 const tubeP=sx=>[c(sx*.7,1.05,0),c(sx*1.5,1.65,0),c(sx*2.4,1.55,.05),c(sx*3.1,1.1,.1),c(sx*3.4,.55,.1)];
 [-1,1].forEach(sx=>{add("tube",tube(tubeP(sx),.1,10,u=>1+.9*u),MAT(0xf0a89c,{roughness:.6,clearcoat:.2,bumpScale:.05,sheen:0,emissive:0x6a2a24,emissiveIntensity:.25}),[0,0,0],{parent:F,ns:1});
  for(let k=0;k<9;k++){const a=k/9*TAU,e=tubeP(sx)[4];add("fim",tube([c(e.x,e.y,e.z),c(e.x+sx*.15*cos(a),e.y-.15+.25*sin(a),e.z+.3*cos(a)),c(e.x+sx*.3*cos(a),e.y-.4+.45*sin(a),e.z+.55*cos(a))],.04,5),MAT(0xf0a0a0,{roughness:.4,emissive:0x3a1010,emissiveIntensity:.15}),[0,0,0],{parent:F,ns:1})}
  add("ovary",sph(.62,.05,2,1.25,1,.85,28,36,sx),MAT(0xf6bfae,{roughness:.8,clearcoat:0,bumpScale:.05,sheen:0,envMapIntensity:.5,emissive:0x6a3a2a,emissiveIntensity:.3}),[sx*3.55,-.35,.1],{parent:F});
  for(let k=0;k<6;k++){const a=k*1.9;add("foll",sph(.12,.05,3,1,1,1,12,16),MAT(0xfff2d0,{roughness:.2,clearcoat:1,opacity:.9}),[sx*3.55+cos(a)*.5*sx,-.35+sin(a)*.4,.1+cos(a*2)*.3],{parent:F,ns:1})}});
 const mature=add("foll",sph(.3,.03,2,1,1,1,20,26),MAT(0xfff6d8,{roughness:.15,clearcoat:1,opacity:.85,emissive:0x6a5a20,emissiveIntensity:.3}),[3.95,-.2,.35],{parent:F,ns:1});
 const ovum=add("egg",sph(.13,0,1,1,1,1,16,20),MAT(0xffd7a0,{roughness:.2,clearcoat:1,emissive:0x8a5a10,emissiveIntensity:.5}),[3.95,-.2,.35],{parent:F,ns:1});
 const eggPath=new It([c(3.95,-.2,.35),c(4.2,.2,.45),c(3.5,.5,.35),c(3.25,.75,.2),c(2.8,1.3,.08),c(2.1,1.6,.05)]).getPoints(60);
 /* ---------- sperm + egg ---------- */
 const mkSperm=(par,x,y,z)=>{const sg=new J;sg.position.set(x,y,z);par.add(sg);const hm=MAT(0x7b8fe0,{roughness:.35,clearcoat:.8,emissive:0x1a2a7a,emissiveIntensity:.3}),am=MAT(0xd6e0ff,{roughness:.25,clearcoat:1,opacity:.9}),mm=MAT(0xf2a63a,{roughness:.4,emissive:0x5a3408,emissiveIntensity:.3}),tm=MAT(0x9fb0f0,{roughness:.4,clearcoat:.6});
  const part=(id,geo,mat,p)=>{const m=add(id,geo,mat,p,{parent:sg,ns:1});return m};
  part("head",sph(.5,0,1,1.05,.78,.42,24,32),hm,[0,0,0]);part("head",sph(.33,0,1,.7,.95,.5,16,22),am,[.42,0,0]);
  for(let i=0;i<8;i++)part("mid",torus(.16,.045),mm,[-.55-i*.14,0,0]).rotation.z=PI/2;
  part("mid",tube([c(-.5,0,0),c(-1.75,0,0)],.12,8),mm,[0,0,0]);
  const tp=[];for(let i=0;i<=24;i++){const q=i/24;tp.push(c(-1.75-q*4.2,Math.sin(q*TAU*2.2)*.22*q,0))}part("tail",tube(tp,.07,6,u=>1-.7*u),tm,[0,0,0]);return sg};
 const sperms=[[-14,.8,-1,.6],[-12,-2.2,1.2,.5],[-16,2.4,.4,.8],[-11,-.6,-1.8,.4],[-13,1.6,1.8,.7]].map((p,i)=>({g:mkSperm(Z,p[0],p[1],p[2]),i,v:p[3]}));
 const eggG=new J;eggG.position.set(2.5,0,0);Z.add(eggG);
 add("zona",sph(2.0,.03,2,1,1,1,36,48,2),MAT(0xcfe8ff,{roughness:.2,clearcoat:.8,opacity:.28,depthWrite:!1,bumpScale:.4,sheen:0}),[0,0,0],{parent:eggG,ns:1});
 add("egg",sph(1.65,.02,2,1,1,1,36,48,3),MAT(0xffd9a8,{roughness:.45,clearcoat:.6,opacity:.95,bumpScale:.3,emissive:0x6a4a18,emissiveIntensity:.15}),[0,0,0],{parent:eggG});
 const nzM=MAT(0x6f7ad8,{roughness:.35,clearcoat:.8,emissive:0x1a2060,emissiveIntensity:.35});const nuc1=add("nucz",sph(.5,.04,2,1,1,1,20,26),nzM,[-.2,0,.1],{parent:eggG,ns:1});const nuc2=add("nucz",sph(.35,.04,2,1,1,1,16,22),MAT(0x9aa4f2,{roughness:.35,emissive:0x2a3080,emissiveIntensity:.35}),[.9,.2,0],{parent:eggG,ns:1});nuc2.visible=!1;
 for(let i=0;i<34;i++){const y=1-(i+.5)/34*2,r=Math.sqrt(1-y*y),a=i*2.399963;add("corona",sph(.24,.1,3,1,1,1,10,14,i),MAT(0xffe6d0,{roughness:.45,opacity:.85}),[cos(a)*r*2.2,y*2.2,sin(a)*r*2.2],{parent:eggG,ns:1})}
 /* ---------- cleavage row ---------- */
 const cm=MAT(0xffd9a8,{roughness:.4,clearcoat:.6,opacity:.92,bumpScale:.25,emissive:0x6a4a18,emissiveIntensity:.15}),shell=MAT(0xcfe8ff,{roughness:.2,opacity:.25,depthWrite:!1,sheen:0});
 const X0=-10.5,DX=3.5;
 add("stage",sph(1.0,.03,2,1,1,1,24,32),cm,[X0,0,0],{parent:Dv});add("stage",sph(1.25,0,1,1,1,1,24,32),shell,[X0,0,0],{parent:Dv,ns:1});
 [[-.55,0],[.55,0]].forEach(q=>add("stage",sph(.62,.03,2,1,1,1,20,26),cm,[X0+DX+q[0],q[1],0],{parent:Dv}));
 [[-.5,.5],[.5,.5],[-.5,-.5],[.5,-.5]].forEach(q=>add("stage",sph(.46,.03,2,1,1,1,18,24),cm,[X0+DX*2+q[0],q[1],0],{parent:Dv}));
 for(let i=0;i<8;i++){const a=i/8*TAU,z=i<4?.3:-.3;add("stage",sph(.36,.03,2,1,1,1,16,20),cm,[X0+DX*3+cos(a)*.5,sin(a)*.5,(i%2?.35:-.35)],{parent:Dv})}
 for(let i=0;i<20;i++){const y=1-(i+.5)/20*2,r=Math.sqrt(1-y*y),a=i*2.399963;add("stage",sph(.3,.03,2,1,1,1,14,18),cm,[X0+DX*4+cos(a)*r*.7,y*.7,sin(a)*r*.7],{parent:Dv})}
 add("blast",sph(1.15,.02,2,1,1,1,36,48),MAT(0xffe0b8,{roughness:.3,clearcoat:.7,opacity:.4,depthWrite:!1,sheen:0}),[X0+DX*5,0,0],{parent:Dv,ns:1});
 for(let i=0;i<7;i++){const a=i*.9+.4;add("blast",sph(.3,.03,2,1,1,1,14,18),MAT(0x6f7ad8,{roughness:.35,emissive:0x1a2060,emissiveIntensity:.3}),[X0+DX*5-.55+cos(a)*.35,sin(a)*.35,sin(a*2)*.3],{parent:Dv,ns:1})}
 add("endo",param(20,20,(u,v)=>[X0+DX*6.1+Math.sin(v*PI)*0+(.9-.4*Math.cos(u*PI)*Math.cos(v*PI)*0),(u-.5)*5.2,(v-.5)*5]),endoM,[0,0,0],{parent:Dv,ns:1}).position.x=0;
 add("blast",sph(.9,.02,2,.8,1,1,28,36),MAT(0xffe0b8,{roughness:.3,clearcoat:.7,opacity:.7,sheen:0}),[X0+DX*6.1-.2,0,0],{parent:Dv});
 /* ---------- placenta & foetus ---------- */
 const sacM=MAT(0xffd0d0,{roughness:.3,opacity:.16,depthWrite:!1,sheen:0,bumpScale:.1,clearcoat:.5});
 add("uterus",param(34,50,(u,v)=>{const y=-3+u*6.2,r=prof(u)*2.6,a=ang(v);return[cos(a)*r*1.1,y,sin(a)*r*.8]}),pink,[0,0,0],{parent:E,ns:1});
 add("amn",sph(2.5,.03,1.5,1,1.15,.9,36,48,1),sacM,[0,.3,.2],{parent:E,ns:1});
 const fM=MAT(0xf2b9a0,{roughness:.45,clearcoat:.5,bumpScale:.3,sheen:.4,sheenC:0xffd8c8,emissive:0x4a2010,emissiveIntensity:.12});const fet=new J;fet.position.set(0,.3,.2);E.add(fet);
 add("foet",sph(.8,.03,2,1,1.05,.95,28,36),fM,[0,.9,0],{parent:fet});add("foet",tube([c(0,.2,0),c(-.1,-.5,.1),c(.15,-1.1,.15),c(.5,-1.5,.0)],.55,12,u=>1-.4*u),fM,[0,0,0],{parent:fet});
 [-1,1].forEach(sx=>{add("foet",tube([c(sx*.35,.1,.2),c(sx*.7,-.2,.5),c(sx*.45,-.6,.7)],.14,8),fM,[0,0,0],{parent:fet,ns:1});add("foet",tube([c(sx*.2,-1,.1),c(sx*.5,-1.4,.4),c(sx*.3,-1.9,.3)],.17,8),fM,[0,0,0],{parent:fet,ns:1})});
 const plM=MAT(0xa23a3a,{roughness:.55,bumpScale:.5,emissive:0x3a0808,emissiveIntensity:.25,sheen:.4});
 add("plac",sph(1.15,.12,3,.5,1,1,28,36,4),plM,[-2.3,1.2,-.6],{parent:E});
 for(let i=0;i<14;i++){const q=i/14;add("plac",tube([c(-2.4,.5+q*1.5,-.6),c(-2.7,.3+q*1.6,-.7),c(-3,.4+q*1.5,-.9)],.05,5),plM,[0,0,0],{parent:E,ns:1})}
 const cordA=[c(-.2,1,.1),c(-1,1.3,-.1),c(-1.8,1.5,-.4),c(-2.3,1.4,-.5)];
 add("cord",tube(cordA,.17,10),MAT(0xe8d8b0,{roughness:.4,clearcoat:.6,bumpScale:.3}),[0,0,0],{parent:E});
 add("cord",tube(cordA.map((p,i)=>p.clone().add(c(0,.08*sin(i*2),.08))),.06,6),artM6(),[0,0,0],{parent:E,ns:1});add("cord",tube(cordA.map((p,i)=>p.clone().add(c(0,-.08,.06*cos(i*2)))),.06,6),vM6(),[0,0,0],{parent:E,ns:1});
 function artM6(){return MAT(0x4f63d6,{roughness:.35,emissive:0x101a5a,emissiveIntensity:.3})}function vM6(){return MAT(0xd2413f,{roughness:.35,emissive:0x5a0a08,emissiveIntensity:.3})}
 const NF=36,fl=new Wn(new it(.06,8,6),new bt({color:0xffffff}),NF);fl.frustumCulled=!1;E.add(fl);const fc=new we;for(let i=0;i<NF;i++)fl.setColorAt(i,fc.setHex(i%2?0xd2413f:0x4f63d6));
 const m4=new gt,cordB=cordA.map(p=>p.clone().add(c(0,0,.02)));const cordCur=new It(cordA).getPoints(40);
 /* ---------- cameras ---------- */
 const cams=[[c(-26,-1.6,17),c(-26,-1.4,0)],[c(24,0,16),c(22,0,0)],[c(0,-.2,15.5),c(0,-.2,0)],[c(2.6,.5,9),c(3,.3,0)],[c(26,0,17),c(24,0,0)],[c(0,-24,19),c(0,-24,0)],[c(26,-24,16),c(26,-23.6,0)],[c(0,.2,14),c(0,-.2,0)]];
 const camK=["Male","Sperm","Female","Ovulation","Fertilisation","Cleavage","Placenta","Cycle"];
 const show={};const ids=["scrot","testis","epid","vas","sv","bladm","prost","ureth","head","mid","tail","uterus","endo","cervix","vagina","tube","fim","ovary","foll","egg","zona","corona","nucz","stage","blast","foet","plac","cord","amn"];
 ids.forEach(i=>show[i]=[0,0,0,0,0,0,0,0]);const on=(i,ss)=>ss.forEach(x=>show[i][x]=1);
 on("scrot",[0]);on("testis",[0]);on("epid",[0]);on("vas",[0]);on("sv",[0]);on("bladm",[0]);on("prost",[0]);on("ureth",[0]);on("head",[1,4]);on("mid",[1,4]);on("tail",[1,4]);on("uterus",[2,3,4,7]);on("endo",[2,3,4,5,7]);on("cervix",[2,7]);on("vagina",[2,7]);on("tube",[2,3,4,7]);on("fim",[2,3,7]);on("ovary",[2,3,7]);on("foll",[2,3,7]);on("egg",[3,4]);on("zona",[4]);on("corona",[4]);on("nucz",[4]);on("stage",[5]);on("blast",[5]);on("foet",[6]);on("plac",[6]);on("cord",[6]);on("amn",[6]);
 const base={scrot:.22,testis:.95,epid:1,vas:1,sv:1,bladm:.7,prost:1,ureth:1,head:1,mid:1,tail:1,uterus:.5,endo:1,cervix:1,vagina:1,tube:1,fim:1,ovary:1,foll:.9,egg:1,zona:.28,corona:.85,nucz:1,stage:.92,blast:.9,foet:1,plac:1,cord:1,amn:.16};
 const Lw=(par,p)=>()=>par.localToWorld(c(...p));
 const labels=[["m-te","Testis (sperm + testosterone)","वृषण (शुक्राणु + टेस्टोस्टेरोन)",Lw(M,[.95,-3.1,.8]),[0]],["m-ep","Epididymis (sperm mature)","अधिवृषण (शुक्राणु परिपक्व)",Lw(M,[1.4,-2.2,-.1]),[0]],["m-va","Vas deferens","शुक्रवाहिका",Lw(M,[1.45,-.6,-.3]),[0]],["m-sv","Seminal vesicle","शुक्राशय",Lw(M,[.8,-.1,-.5]),[0]],["m-pr","Prostate gland","पुरःस्थ ग्रंथि",Lw(M,[0,-.9,.5]),[0]],["m-ur","Urethra","मूत्रमार्ग",Lw(M,[0,-3.1,.9]),[0]],["m-sc","Scrotum (cooler: 2–3 °C)","वृषणकोष (2–3 °C ठंडा)",Lw(M,[-2,-3.4,.2]),[0]],["m-bl","Bladder","मूत्राशय",Lw(M,[-.8,1.9,.4]),[0]],
  ["z-he","Head: nucleus (23) + acrosome","शीर्ष: केंद्रक (23) + एक्रोसोम",Lw(Z,[-14,1,-1]),[1]],["z-mi","Mid-piece: mitochondria","मध्य खंड: माइटोकॉन्ड्रिया",Lw(Z,[-14.9,.8,-1]),[1]],["z-ta","Tail: swims","पूँछ: तैरती है",Lw(Z,[-17.2,1,-1]),[1]],
  ["f-ut","Uterus (womb)","गर्भाशय",Lw(F,[0,1.5,.6]),[2,7]],["f-en","Endometrium (lining)","एंडोमेट्रियम (परत)",Lw(F,[0,.2,.5]),[2,7]],["f-ce","Cervix","ग्रीवा",Lw(F,[0,-1.7,.4]),[2]],["f-va","Vagina","योनि",Lw(F,[0,-3.4,.6]),[2]],["f-tu","Fallopian tube","अंडवाहिनी",Lw(F,[2.2,1.7,.2]),[2,3]],["f-fi","Fimbriae","झालर",Lw(F,[3.5,.5,.5]),[2,3]],["f-ov","Ovary","अंडाशय",Lw(F,[-3.5,-.3,.5]),[2,3]],["f-fo","Mature follicle","परिपक्व पुटक",Lw(F,[3.95,-.2,.6]),[3]],["f-eg","Egg released (ovulation)","अंडाणु निकला (अंडोत्सर्ग)",()=>ovum.getWorldPosition(c()),[3]],
  ["e-eg","Egg cell (largest human cell)","अंडाणु (सबसे बड़ी कोशिका)",Lw(Z,[2.5,-1.3,1.6]),[4]],["e-zo","Zona pellucida","ज़ोना पेल्यूसिडा",Lw(Z,[2.5,1.9,.5]),[4]],["e-co","Corona radiata","कोरोना रेडिएटा",Lw(Z,[2.5,-2.2,.6]),[4]],["e-nu","Nucleus (23 + 23 = 46)","केंद्रक (23 + 23 = 46)",Lw(Z,[2.3,.2,.6]),[4]],["e-sp","Sperm entering","शुक्राणु प्रवेश",Lw(Z,[-1,.2,0]),[4]],
  ["c-z","Zygote (1 cell)","युग्मनज (1 कोशिका)",Lw(Dv,[X0,1.5,0]),[5]],["c-2","2 cells","2 कोशिकाएँ",Lw(Dv,[X0+DX,1.2,0]),[5]],["c-4","4 cells","4 कोशिकाएँ",Lw(Dv,[X0+DX*2,1.4,0]),[5]],["c-8","8 cells","8 कोशिकाएँ",Lw(Dv,[X0+DX*3,1.2,0]),[5]],["c-mo","Morula","मोरुला",Lw(Dv,[X0+DX*4,1.2,0]),[5]],["c-bl","Blastocyst","ब्लास्टोसिस्ट",Lw(Dv,[X0+DX*5,1.6,0]),[5]],["c-im","Implantation in endometrium","एंडोमेट्रियम में रोपण",Lw(Dv,[X0+DX*6.1,2.2,0]),[5]],
  ["p-fo","Foetus","गर्भस्थ शिशु",()=>fet.getWorldPosition(c()),[6]],["p-pl","Placenta","अपरा",Lw(E,[-2.6,2.5,-.6]),[6]],["p-co","Umbilical cord","नाभि-रज्जु",Lw(E,[-1.2,1.7,-.2]),[6]],["p-am","Amniotic fluid","उल्बीय द्रव",Lw(E,[2.2,1.4,.5]),[6]],["p-ox","O₂ + food → baby","O₂ + भोजन → शिशु",Lw(E,[-1.8,.7,0]),[6]],["p-wa","CO₂ + waste → mother","CO₂ + अपशिष्ट → माँ",Lw(E,[-1.2,2,0]),[6]],
  ["y-fo","Follicle grows","पुटक बढ़ता",Lw(F,[3.95,.2,.6]),[7]],["y-en","Lining thickens / is shed","परत मोटी / निष्कासित",Lw(F,[0,.2,.5]),[7]]];
 const phase=t=>((t*.07)%1)*28;
 return run({n,g,org,show,base,ST:R_ST,cams,camK,labels,
  hud:(s,t)=>s===7?`Day ${Math.floor(phase(t))+1} of 28 · `+(phase(t)<5?"menstruation (lining shed)":phase(t)<13?"follicle ripens · lining rebuilds":phase(t)<15?"OVULATION":phase(t)<24?"corpus luteum · lining thick":"lining breaks down"):"",
  frame:(s,t)=>{F.rotation.y=s===2?sin(t*.2)*.25:0;M.rotation.y=s===0?sin(t*.2)*.3:0;
   const pd=s===7?phase(t):13,thick=s===7?(pd<5?.35+.0:pd<14?.45+.55*(pd-5)/9:pd<24?1:1-.65*(pd-24)/4):1;endo.scale.set(thick*.8+.2,1,thick*.8+.2);endoM.emissiveIntensity=s===7&&pd<5?.8:.25;
   mature.scale.setScalar(s===7?.4+.9*cl(pd/13,0,1)*(pd>14?0:1):1);mature.visible=s!==7||pd<14||pd>14.5;
   /* ovulation: egg leaves follicle and moves along the tube */
   const q=s===3?((t*.07)%1):s===7?cl((pd-13.5)/3,0,1):0;ovum.visible=s===3||(s===7&&pd>13.4&&pd<17);const k=Math.min(59,Math.floor(q*59));ovum.position.copy(eggPath[s===3||s===7?k:0]);
   /* sperm swim toward the egg */
   sperms.forEach((p,i)=>{const sw=s===4?(1-Math.exp(-t*.15)):0,tx=s===1?0:(i===0&&s===4?7.6+.0:6.4+i*.0),x0=-14+i*-.4;const base0=s===1?-6+i*1.6:x0;const tt=s===4?lerp(x0,tx-2.2,cl(((t*.06)%1)*1.6,0,1)):base0;p.g.position.set(s===1?-3.4+i*.0:tt,s===1?(i-2)*1.0:p.g.position.y,s===1?(i%2?-1:1)*(i*.6):p.g.position.z);p.g.rotation.z=sin(t*6+i)*.08;p.g.rotation.y=s===1?0:0;p.g.children.forEach(c_=>{if(c_.userData.part==="tail")c_.rotation.y=sin(t*9+i)*.12})});
   sperms.forEach((p,i)=>{p.g.visible=s===1||s===4;if(s===1){p.g.position.set(-3.5,(i-2)*1.15,(i%2?-1:1)*(i*.5-.5));p.g.scale.setScalar(i===0?1:.7)}else if(s===4){const ff=cl(((t*.07)%1)*1.4,0,1);p.g.position.set(lerp(-16+i*-1.5,i===0?-.2:-1.4,ff*(i===0?1:.9)),(i-2)*.9*(1-ff*.8),(i%2?-1:1)*(1-ff)*i*.5);p.g.scale.setScalar(.8)}});
   const fz=s===4?cl(((t*.07)%1)*1.4-.9,0,1):0;nuc2.visible=s===4&&fz>.2;nuc1.position.x=-.2+fz*.5;nuc2.position.x=.9-fz*.8;nuc1.scale.setScalar(1+fz*.3);
   /* placenta flow */
   for(let i=0;i<NF;i++){if(s!==6){m4.makeScale(0,0,0)}else{const f=((t*.2+i/NF*2)%1),to=i%2===0,P=cordCur[Math.floor((to?f:1-f)*39)];m4.makeScale(1,1,1);m4.setPosition(P.x+(i%3-1)*.05,P.y+(to?.1:-.1),P.z+(i%2)*.06)}fl.setMatrixAt(i,m4)}fl.instanceMatrix.needsUpdate=!0;
   fet.scale.setScalar(1+.02*sin(t*2))},
  predict:{q:"Where does fertilisation normally take place?",opts:[["In the uterus",!1,"The embryo implants in the uterus a few days later."],["In the fallopian tube (oviduct)",!0,"Correct — in the upper part of the tube."],["In the vagina",!1,"Sperm are deposited in the vagina but must swim on."]]}})}
Q_("ch7/human3d",[["Where are sperm produced?","शुक्राणु कहाँ बनते हैं?",["Epididymis","Testes","Prostate","Vas deferens"],1,"In the seminiferous tubules of the testes."],["Why are the testes outside the body in the scrotum?","वृषण शरीर के बाहर वृषणकोष में क्यों होते हैं?",["For protection","Sperm formation needs a temperature lower than body temperature","To store urine","For hormones only"],1,"About 2–3 °C cooler."],["The release of an egg from the ovary is called…","अंडाशय से अंडाणु निकलना कहलाता है…",["Fertilisation","Ovulation","Implantation","Menstruation"],1,"Near day 14 of the cycle."],["The placenta allows exchange of…","अपरा किसका आदान-प्रदान कराती है?",["Blood of mother and baby","Oxygen, nutrients and wastes (blood does not mix)","Only hormones","Only water"],1,"Materials diffuse across the villi."],["If the egg is not fertilised, what happens to the uterine lining?","यदि अंडाणु निषेचित न हो तो गर्भाशय-परत का क्या होता है?",["It becomes thicker","It is shed as menstruation","It becomes an embryo","It stays"],1,"Menstruation lasts about 2–8 days."]]);
Px["ch7/human3d"]=[["A human egg is about 0.1 mm — just visible to the naked eye; a sperm is about 0.05 mm long.","मानव अंडाणु लगभग 0.1 mm — नंगी आँख से बस दिखता है; शुक्राणु लगभग 0.05 mm।"],["Identical twins form when one zygote splits in two; fraternal twins come from two separate eggs.","समान जुड़वाँ तब बनते हैं जब एक युग्मनज दो भागों में बँट जाए; असमान जुड़वाँ दो अलग अंडाणुओं से।"]];
{const Lr=Hi.find(h=>h.no===7).topics,i=Lr.findIndex(x=>x.id==="human");Lr.splice(i<0?Lr.length:i+1,0,{id:"human3d",title:"Human reproduction — detailed 3D",hi:"मानव प्रजनन — विस्तृत 3D",build:Mrepro,ncert:"Ch 7 · reproduction in human beings"})}
/* ===================== SET 7: FLOWER · POLLINATION · FERTILISATION · FRUIT & SEED ===================== */
const KIND7={
 sepal:["Sepals (calyx)","बाह्यदल (कैलिक्स)","Green leaf-like parts that protect the flower bud.","हरे पत्ती-जैसे भाग जो कली की रक्षा करते हैं।"],
 petal:["Petals (corolla)","दल (कोरोला)","Brightly coloured, often scented parts that attract insects for pollination.","चटक रंग व प्रायः सुगंध वाले भाग जो परागण हेतु कीटों को आकर्षित करते हैं।"],
 fil:["Filament","पुंतंतु","The stalk that holds the anther up where insects or wind can reach the pollen.","वह डंठल जो परागकोश को ऊपर थामता है ताकि कीट/वायु पराग तक पहुँच सकें।"],
 anther:["Anther","परागकोश","Makes and holds pollen grains (the male gametophytes). Together anther + filament = stamen, the male part.","पराग कण (नर युग्मकजनक) बनाता व रखता है; परागकोश + पुंतंतु = पुंकेसर, नर भाग।"],
 pollen:["Pollen grain","पराग कण","Microscopic grain with a hard, sculpted wall. It carries the male gametes.","कठोर, नक्काशीदार भित्ति वाला सूक्ष्म कण; नर युग्मक ले जाता है।"],
 stigma:["Stigma","वर्तिकाग्र","Sticky top of the pistil that catches pollen and helps it germinate.","स्त्रीकेसर का चिपचिपा शीर्ष जो पराग पकड़ता और अंकुरण में मदद करता है।"],
 style:["Style","वर्तिका","Tube-like stalk through which the pollen tube grows down to the ovary.","नली जैसा डंठल जिसमें से पराग नलिका नीचे अंडाशय तक बढ़ती है।"],
 ovary:["Ovary","अंडाशय","Swollen base of the pistil containing ovules. After fertilisation it becomes the fruit.","स्त्रीकेसर का फूला आधार जिसमें बीजांड होते हैं; निषेचन के बाद फल बनता है।"],
 ovule:["Ovule","बीजांड","Holds the egg cell inside an embryo sac. After fertilisation it becomes the seed.","भ्रूणकोष के भीतर अंड कोशिका रखता है; निषेचन के बाद बीज बनता है।"],
 recept:["Receptacle","पुष्पासन","The swollen tip of the flower stalk that holds all the floral parts.","पुष्प-डंठल का फूला सिरा जो सभी पुष्प-भाग थामता है।"],
 bee:["Bee (pollinating agent)","मधुमक्खी (परागण कारक)","Collects nectar and carries pollen on its hairy body from flower to flower — cross-pollination.","मकरंद इकट्ठा करती है और बालों वाले शरीर पर पराग एक फूल से दूसरे तक ले जाती है — पर-परागण।"],
 tubeP:["Pollen tube","पराग नलिका","Grows from the pollen grain down the style, carrying two male gametes to the ovule.","पराग कण से वर्तिका में नीचे बढ़ती है और दो नर युग्मक बीजांड तक ले जाती है।"],
 micro:["Micropyle","बीजांडद्वार","The tiny opening of the ovule through which the pollen tube enters.","बीजांड का सूक्ष्म छिद्र जिससे पराग नलिका प्रवेश करती है।"],
 egg7:["Egg cell","अंड कोशिका","The female gamete in the embryo sac. It fuses with one male gamete to form the zygote.","भ्रूणकोष में मादा युग्मक; एक नर युग्मक से मिलकर युग्मनज बनाती है।"],
 polar:["Polar nuclei","ध्रुवीय केंद्रक","Two nuclei in the centre of the embryo sac; the second male gamete fuses with them to start the endosperm (food store) — double fertilisation.","भ्रूणकोष के केंद्र के दो केंद्रक; दूसरा नर युग्मक इनसे जुड़कर भ्रूणपोष (खाद्य भंडार) शुरू करता है — द्विनिषेचन।"],
 male:["Male gamete","नर युग्मक","One of the two sperm cells carried by the pollen tube.","पराग नलिका द्वारा लाई गई दो शुक्राणु कोशिकाओं में से एक।"],
 zyg:["Zygote","युग्मनज","Formed when the male gamete fuses with the egg; it divides to form the embryo.","नर युग्मक व अंड के मिलने से बनता है; विभाजित होकर भ्रूण बनाता है।"],
 fruit:["Fruit","फल","The ripened ovary, which protects the seeds and helps to spread them.","परिपक्व अंडाशय जो बीजों की रक्षा करता और उनके प्रसार में मदद करता है।"],
 seed:["Seed","बीज","The ripened ovule: it holds the embryo and a food store inside a protective seed coat.","परिपक्व बीजांड: बीज-चोल के भीतर भ्रूण व खाद्य भंडार।"],
 coty:["Cotyledon","बीजपत्र","Seed leaf that stores or absorbs food for the growing seedling.","बीज-पत्ती जो अंकुर के लिए भोजन संचित/अवशोषित करती है।"],
 radicle:["Radicle","मूलांकुर","The embryonic root: it grows out first and anchors the seedling.","भ्रूणीय जड़: सबसे पहले निकलकर अंकुर को जमाती है।"],
 plumule:["Plumule","प्रांकुर","The embryonic shoot that grows up into stem and leaves.","भ्रूणीय प्ररोह जो ऊपर बढ़कर तना व पत्तियाँ बनाता है।"]};
const F_ST=[
["1","Parts of a flower","पुष्प के भाग","A flower is the reproductive organ of a flowering plant. From outside to inside: sepals, petals, stamens (male) and the pistil (female), all attached to the receptacle. The front half is cut away.","पुष्प आवृतबीजी पौधे का जनन अंग है: बाहर से भीतर — बाह्यदल, दल, पुंकेसर (नर) और स्त्रीकेसर (मादा), सब पुष्पासन पर; आगे का आधा भाग काट दिया है।","Hand-modelled · half cut-away",10],
["2","The stamen: pollen factory","पुंकेसर: पराग की फ़ैक्टरी","Each stamen has a filament and an anther. The anther splits open (dehisces) and releases pollen grains — each with a tough, patterned wall.","प्रत्येक पुंकेसर में पुंतंतु व परागकोश होता है; परागकोश फटकर पराग कण छोड़ता है — हर कण की कठोर, नक्काशीदार भित्ति होती है।","Animated · pollen not to scale",11],
["3","The pistil: stigma, style, ovary","स्त्रीकेसर: वर्तिकाग्र, वर्तिका, अंडाशय","The pistil is the female part. The sticky stigma receives pollen, the style is a tube leading down, and the ovary at the base holds the ovules, each with an egg cell.","स्त्रीकेसर मादा भाग है: चिपचिपा वर्तिकाग्र पराग लेता है, वर्तिका नीचे जाने वाली नली है, और आधार का अंडाशय बीजांड रखता है — प्रत्येक में अंड कोशिका।","Hand-modelled · ovary cut open",11],
["4","Pollination","परागण","Pollen is transferred from an anther to a stigma. Here a bee carries it from another flower. Same flower or same plant = self-pollination; a different plant = cross-pollination. Wind, water and animals are the agents.","पराग का परागकोश से वर्तिकाग्र तक पहुँचना। यहाँ मधुमक्खी दूसरे फूल से पराग लाती है। उसी फूल/पौधे में = स्व-परागण; दूसरे पौधे में = पर-परागण; वायु, जल व जंतु वाहक हैं।","Animated · schematic",13],
["5","The pollen tube grows","पराग नलिका बढ़ती है","On the stigma the pollen grain germinates. A pollen tube grows down through the style towards the ovule, guided by chemical signals, carrying two male gametes.","वर्तिकाग्र पर पराग कण अंकुरित होता है; पराग नलिका रासायनिक संकेतों के सहारे वर्तिका में नीचे बीजांड की ओर बढ़ती है और दो नर युग्मक ले जाती है।","Animated · tube growth speeded up",13],
["6","Fertilisation inside the ovule","बीजांड के भीतर निषेचन","The tube enters the ovule through the micropyle. One male gamete fuses with the egg to make the zygote; the other fuses with the two polar nuclei to start the food store (endosperm): double fertilisation.","नलिका बीजांडद्वार से बीजांड में जाती है; एक नर युग्मक अंड से मिलकर युग्मनज बनाता है, दूसरा दो ध्रुवीय केंद्रकों से मिलकर भ्रूणपोष शुरू करता है — द्विनिषेचन।","Animated · magnified ovule",14],
["7","Ovary becomes fruit, ovule becomes seed","अंडाशय फल, बीजांड बीज","After fertilisation the petals and stamens wither. The zygote grows into the embryo, the ovule into the seed and the ovary into the fruit.","निषेचन के बाद दल व पुंकेसर मुरझा जाते हैं; युग्मनज भ्रूण में, बीजांड बीज में और अंडाशय फल में बदलता है।","Animated · schematic",13],
["8","Seed to seedling: germination","बीज से अंकुर: अंकुरण","With water, air and warmth the seed germinates: the radicle grows down as the root and the plumule grows up as the shoot, fed by the cotyledons. The life cycle begins again.","जल, वायु व गर्मी मिलने पर बीज अंकुरित होता है: मूलांकुर नीचे जड़ बनता है और प्रांकुर ऊपर प्ररोह, बीजपत्र भोजन देते हैं; जीवन-चक्र फिर शुरू।","Animated · schematic",13]];
function Mflower(){sd=71;const n=new Ne;Ge(n,{key:1.9});Je(n,-4.6,90,.08);const g=new J;n.add(g);const org=[];const add=mkAdd(g,org);
 const FL=new J;g.add(FL);const OV=new J;OV.position.set(22,0,0);g.add(OV);const GR=new J;GR.position.set(0,-22,0);g.add(GR);const FB=new J;FB.position.set(-14,.6,-2.5);g.add(FB);
 const petM=MAT(0xe8407c,{roughness:.6,clearcoat:.1,sheen:0,envMapIntensity:.5,bumpScale:.08,opacity:1,side:vt,emissive:0x7a1038,emissiveIntensity:.3});
 const petal=(par,ang,tilt,L,W,mat,id)=>{const gr=new J;gr.rotation.y=ang;par.add(gr);add(id,param(18,12,(u,v)=>{const w=Math.pow(sin(Math.min(1,u*.97)*PI*.85+.15),.8)*W*(v-.5)*2*(1-.25*u*u),x=u*L,y=u*u*L*.55*(tilt*.5)-Math.pow(Math.abs(v-.5)*2,2)*.5*W*.55*(.4+u)+.07*L*Math.sin(v*PI*5)*u*u*(1-u*.3);return[x,y,w]}),mat,[0,0,0],{parent:gr,ns:0});return gr};
 const flowerAt=(par,sc,ids)=>{const P=new J;P.scale.setScalar(sc);par.add(P);
  /* sepals */
  const sepM=MAT(0x6aa84f,{roughness:.55,clearcoat:.2,bumpScale:.15,side:vt,emissive:0x143a0e,emissiveIntensity:.15});
  for(let i=0;i<5;i++)petal(P,i/5*TAU+.3,1.6,2.1,.45,sepM,ids.sepal).position.y=-.2;
  /* petals (front two removed in the cut-away flower) */
  for(let i=0;i<6;i++){const a=i/6*TAU+.1;if(ids.cut&&Math.cos(a-.0)>.55&&Math.sin(a)>-.1&&Math.sin(a)<.9&&i<2&&false)continue;const p=petal(P,a,1.5,3.1,1.0,petM,ids.petal);p.position.y=-.05;p.userData.a=a}
  add(ids.recept,sph(.55,.05,2,1.1,.55,1.1,22,28),MAT(0x7cb55a,{roughness:.5,bumpScale:.2}),[0,-.35,0],{parent:P});
  /* stamens */
  const an=[];for(let i=0;i<6;i++){const a=i/6*TAU+.52,r=.95,fx=Math.cos(a)*r,fz=Math.sin(a)*r;add(ids.fil,tube([c(fx*.3,-.1,fz*.3),c(fx*.8,1,fz*.8),c(fx*1.05,1.9,fz*1.05)],.045,8),MAT(0xf2e6a0,{roughness:.45,bumpScale:.1,emissive:0x4a3a08,emissiveIntensity:.15}),[0,0,0],{parent:P,ns:1});
   const am=MAT(0xf5c518,{roughness:.55,bumpScale:.5,emissive:0x6a4a00,emissiveIntensity:.25,sheen:0});
   [[-.07,0],[.07,0]].forEach(q=>add(ids.anther,sph(.12,.15,3,.8,1.7,.8,14,18,i),am,[fx*1.08+q[0]*Math.cos(a+PI/2),2.05,fz*1.08+q[0]*Math.sin(a+PI/2)],{parent:P,ns:1}));an.push(c(fx*1.08,2.05,fz*1.08))}
  return{P,an}};
 const A=flowerAt(FL,1,{sepal:"sepal",petal:"petal",recept:"recept",fil:"fil",anther:"anther",cut:!0});
 /* pistil: stigma, style, ovary (cut open), ovules */
 const styleM=MAT(0xb8e08a,{roughness:.45,clearcoat:.4,bumpScale:.15,emissive:0x2a4a10,emissiveIntensity:.15});
 add("style",tube([c(0,.5,0),c(0,1.5,0),c(0,2.7,0)],.1,10,u=>1-.2*u),styleM,[0,0,0],{parent:FL,ns:1});
 add("stigma",sph(.3,.1,3,1,.7,1,18,24),MAT(0xe8f080,{roughness:.2,clearcoat:.9,bumpScale:.5,emissive:0x4a5a10,emissiveIntensity:.25,sheen:0}),[0,2.82,0],{parent:FL});
 for(let i=0;i<14;i++){const a=i*2.4,r=.22;add("stigma",tube([c(Math.cos(a)*.14,2.88,Math.sin(a)*.14),c(Math.cos(a)*r,3.05,Math.sin(a)*r)],.025,4),MAT(0xf3f6a0,{roughness:.3}),[0,0,0],{parent:FL,ns:1})}
 const ovM=MAT(0x9cd06a,{roughness:.4,clearcoat:.5,bumpScale:.2,opacity:.6,depthWrite:!1,emissive:0x2a4a10,emissiveIntensity:.15});
 const ovMesh=add("ovary",param(30,48,(u,v)=>{const th=u*PI,ph=(.62+v*1.76)*PI,x=Math.sin(th)*Math.cos(ph)*.8,y=Math.cos(th)*.95,z=Math.sin(th)*Math.sin(ph)*.8;return[x,y+.35,z]}),ovM,[0,0,0],{parent:FL,ns:1});
 const ovuleM=MAT(0xf7e3a0,{roughness:.6,clearcoat:.05,envMapIntensity:.35,bumpScale:.08,sheen:0,emissive:0x8a7a30,emissiveIntensity:.45});
 [[.28,.1,.18],[-.25,.35,.2],[.05,.7,-.25],[-.25,.6,-.2]].forEach(p=>add("ovule",sph(.19,.05,3,1,1.2,1,16,22),ovuleM,[p[0],p[1]+.05,p[2]],{parent:FL}));
 /* pollen grains released in step 2 */
 const NP=60,pol=new Wn(new it(.05,8,6),new bt({color:0xffd23f}),NP);pol.frustumCulled=!1;FL.add(pol);const m4=new gt;const PL=[];for(let i=0;i<NP;i++)PL.push({a:i%6,o:R(),dx:(R()-.5)*.5,dz:(R()-.5)*.5});
 /* big pollen grain (sculpted) for step 2/5 close-up */
 const bigPol=add("pollen",param(30,44,(u,v)=>{const th=u*PI,ph=v*TAU,k=1+.12*Math.pow(Math.abs(Math.sin(th*6)*Math.sin(ph*6)),.6);return[sin(th)*cos(ph)*.28*k,cos(th)*.28*k,sin(th)*sin(ph)*.28*k]}),MAT(0xffd23f,{roughness:.6,bumpScale:.8,emissive:0x6a4a00,emissiveIntensity:.3,sheen:0}),[1.7,1.7,1.4],{parent:FL});
 /* bee + second flower */
 flowerAt(FB,.55,{sepal:"sepalB",petal:"petalB",recept:"receptB",fil:"filB",anther:"antherB"});
 const bee=new J;g.add(bee);const stripe=MAT(0x2a2a2a,{roughness:.5}),yw=MAT(0xf5c518,{roughness:.5,bumpScale:.4,emissive:0x5a4000,emissiveIntensity:.2});
 add("bee",sph(.28,0,1,1.3,.9,.9,16,20),yw,[0,0,0],{parent:bee});add("bee",sph(.22,0,1,.35,1.05,1.05,12,16),stripe,[.1,0,0],{parent:bee,ns:1});add("bee",sph(.2,0,1,.8,.9,.9,12,16),yw,[.34,0,0],{parent:bee});add("bee",sph(.15,0,1,1,1,1,12,16),stripe,[.55,0,0],{parent:bee});
 const wM=MAT(0xdfefff,{roughness:.1,opacity:.45,depthWrite:!1,sheen:0});const w1=add("bee",sph(.34,0,1,1,.04,.55,12,16),wM,[.05,.2,.25],{parent:bee,ns:1}),w2=add("bee",sph(.34,0,1,1,.04,.55,12,16),wM,[.05,.2,-.25],{parent:bee,ns:1});
 [-.18,.0,.18].forEach(x=>add("bee",tube([c(x,-.15,.1),c(x,-.35,.2)],.02,4),stripe,[0,0,0],{parent:bee,ns:1}));
 const beeP=new It([c(-14,2.4,-2.5),c(-10,3.3,-1.5),c(-5.5,4.2,.2),c(-2.2,3.9,.6),c(-.3,3.4,.4),c(.1,3.2,.2)]).getPoints(80);
 /* pollen tube in the style (grows with progress), pollen on stigma */
 const tubeCur=new It([c(0,2.9,0),c(.04,2.2,.03),c(-.04,1.4,-.02),c(.02,.9,.05),c(.0,.62,.06)]);const TN=60,tubeG=(()=>{const pts=tubeCur.getPoints(TN);const frames=pts.map(()=>[c(1,0,0),c(0,0,1)]);return param(TN,8,(u,v)=>{const i=Math.round(u*TN),p=pts[i],a=v*TAU,r=.035*(i>TN-3?1.3:1);return[p.x+Math.cos(a)*r,p.y,p.z+Math.sin(a)*r]})})();
 const tubeM=MAT(0xff8fb0,{roughness:.35,clearcoat:.7,emissive:0x7a1a3a,emissiveIntensity:.35});const tubeMesh=add("tubeP",tubeG,tubeM,[0,0,0],{parent:FL,ns:1});
 /* ---------- magnified ovule ---------- */
 const intM=MAT(0xf2d28a,{roughness:.6,clearcoat:.05,envMapIntensity:.3,sheen:0,bumpScale:.1,opacity:.42,depthWrite:!1,emissive:0x5a4a10,emissiveIntensity:.15});
 add("ovule",param(36,56,(u,v)=>{const th=u*PI,ph=(.6+v*1.8)*PI,x=Math.sin(th)*Math.cos(ph)*3.1,y=Math.cos(th)*4.2,z=Math.sin(th)*Math.sin(ph)*3.1;return[x,y,z+Math.max(0,-y-3.5)*0]}),intM,[0,0,0],{parent:OV,ns:1});
 add("ovule",param(32,52,(u,v)=>{const th=u*PI,ph=(.6+v*1.8)*PI;return[Math.sin(th)*Math.cos(ph)*2.7,Math.cos(th)*3.8,Math.sin(th)*Math.sin(ph)*2.7]}),MAT(0xf7e6b0,{roughness:.4,opacity:.5,depthWrite:!1,sheen:0,bumpScale:.15}),[0,0,0],{parent:OV,ns:1});
 add("ovule",sph(1.6,.03,2,.95,1.35,.95,34,48,3),MAT(0xfff0c4,{roughness:.6,clearcoat:.05,envMapIntensity:.3,opacity:.62,depthWrite:!1,sheen:0,bumpScale:.05}),[0,.3,0],{parent:OV,ns:1});
 add("micro",torus(.45,.1),MAT(0xc9a15a,{roughness:.5}),[0,-4.15,0],{parent:OV,ns:1});
 const cellM=MAT(0xffd7a0,{roughness:.6,clearcoat:.05,envMapIntensity:.35,sheen:0,emissive:0x8a5a10,emissiveIntensity:.45}),nucM=MAT(0x6f7ad8,{roughness:.5,clearcoat:.1,envMapIntensity:.4,sheen:0,emissive:0x2a3090,emissiveIntensity:.55});
 const eggG=new J;eggG.position.set(0,-1.55,0);OV.add(eggG);add("egg7",sph(.55,.03,2,1,1.15,1,22,30),cellM,[0,0,0],{parent:eggG});const eggN=add("egg7",sph(.2,0,1,1,1,1,12,16),nucM,[0,.1,0],{parent:eggG,ns:1});
 [-.55,.55].forEach(x=>add("egg7",sph(.3,.03,2,.8,1.1,.8,16,22),MAT(0xffe6b8,{roughness:.35,emissive:0x6a4a18,emissiveIntensity:.2}),[x,-.1,0],{parent:eggG,ns:1}));
 const polA=add("polar",sph(.22,0,1,1,1,1,14,18),nucM,[-.25,.5,0],{parent:OV}),polB=add("polar",sph(.22,0,1,1,1,1,14,18),nucM,[.25,.5,0],{parent:OV});
 for(let i=0;i<3;i++)add("polar",sph(.2,0,1,1,1,1,12,16),MAT(0xc9d0ff,{roughness:.4}),[(i-1)*.4,2.35,0],{parent:OV,ns:1});
 const OVT=[c(0,-9,0),c(.15,-7,0),c(-.1,-5.4,0),c(0,-4.2,0),c(0,-3.3,0)];const tubeOC=new It(OVT),ON=50;
 const tubeOG=param(ON,10,(u,v)=>{const p=tubeOC.getPoint(u),a=v*TAU,r=.22;return[p.x+Math.cos(a)*r,p.y,p.z+Math.sin(a)*r]});tubeOG.setDrawRange(0,0);
 const tubeO=add("tubeP",tubeOG,MAT(0xff8fb0,{roughness:.35,clearcoat:.7,opacity:.8,emissive:0x7a1a3a,emissiveIntensity:.35,depthWrite:!1}),[0,0,0],{parent:OV,ns:1});
 const mg1=add("male",sph(.2,0,1,1,1,1,12,16),MAT(0xffd23f,{emissive:0x8a6a00,emissiveIntensity:.8}),[0,-9,0],{parent:OV,ns:1}),mg2=add("male",sph(.2,0,1,1,1,1,12,16),MAT(0xffd23f,{emissive:0x8a6a00,emissiveIntensity:.8}),[0,-9,0],{parent:OV,ns:1});
 const seedCoat=add("seed",param(30,44,(u,v)=>{const th=u*PI,ph=(.6+v*1.8)*PI;return[Math.sin(th)*Math.cos(ph)*3.1,Math.cos(th)*4.2,Math.sin(th)*Math.sin(ph)*3.1]}),MAT(0x8a5a2b,{roughness:.6,bumpScale:.6,opacity:0,depthWrite:!1,sheen:0}),[0,0,0],{parent:OV,ns:1});
 /* ---------- germination ---------- */
 const soil=add("soil",new Xe(6.5,6.5,4.4,48,1,!1,PI*.5,PI),new bt({color:0x6b4a2e,side:vt}),[0,-2.7,0],{parent:GR,ns:1});const soil2=add("soil",new Xe(6.5,6.5,.14,48,1,!1,PI*.5,PI),new bt({color:0x8a5e38,side:vt}),[0,-.5,0],{parent:GR,ns:1});const cutFace=add("soil",new Xe(6.5,6.5,.2,4),new bt({color:0x7d5535}),[0,-2.7,-.15],{parent:GR,ns:1,rot:[PI/2,PI/4,0],scl:[1,1,.68]});
 const sdM=MAT(0xb98450,{roughness:.7,clearcoat:.05,envMapIntensity:.35,bumpScale:.3,sheen:0,emissive:0x4a2c10,emissiveIntensity:.35});
 const sd_=add("seed",sph(1.1,.05,2,1.2,.9,.8,26,34),sdM,[0,-1.6,0],{parent:GR});
 [-1,1].forEach(sx=>add("coty",sph(.8,.04,2,.55,.9,.8,20,26),MAT(0xf2e6a0,{roughness:.45,emissive:0x4a3a08,emissiveIntensity:.15}),[sx*.55,-1.6,0],{parent:GR}));
 const rad=new J;rad.position.set(0,-2.3,0);GR.add(rad);const rootC=new It([c(0,0,0),c(.1,-1,0),c(-.1,-2.2,.1),c(.2,-3.4,0)]);add("radicle",tube(rootC.getPoints(10),.12,8,u=>1-.7*u),MAT(0xf3ead0,{roughness:.5,bumpScale:.2}),[0,0,0],{parent:rad});
 for(let k=0;k<6;k++){const q=rootC.getPoint(.3+k*.12);add("radicle",tube([q,q.clone().add(c((k%2?1:-1)*.5,-.3,0))],.04,5),MAT(0xf3ead0,{roughness:.5}),[0,0,0],{parent:rad,ns:1})}
 const shoot=new J;shoot.position.set(0,-1.1,0);GR.add(shoot);add("plumule",tube([c(0,0,0),c(0,.8,0),c(.1,1.7,0),c(0,2.6,0)],.1,8,u=>1-.4*u),MAT(0x8cc152,{roughness:.45,clearcoat:.3,bumpScale:.2}),[0,0,0],{parent:shoot});
 [-1,1].forEach(sx=>add("plumule",sph(.5,.04,2,1.2,.1,.7,18,24),MAT(0x5aa83a,{roughness:.45,clearcoat:.3,side:vt,bumpScale:.25}),[sx*.55,2.7,0],{parent:shoot,rot:[0,0,sx*-.6]}));
 /* cameras */
 const cams=[[c(0,3.2,9.5),c(0,1.3,0)],[c(0,3.6,7.4),c(0,2,0)],[c(1.4,1.6,6.8),c(0,1.2,0)],[c(-5,3.4,12),c(-4,2.6,0)],[c(.6,2,6),c(0,1.5,0)],[c(22,-2.2,26),c(22,-2.4,0)],[c(0,2,13),c(0,1,0)],[c(0,-19,16),c(0,-23,0)]];
 const camK=["Flower","Stamen","Pistil","Pollination","Pollen tube","Ovule","Fruit & seed","Germination"];
 const show={};const ids=["sepal","petal","recept","fil","anther","pollen","stigma","style","ovary","ovule","bee","sepalB","petalB","receptB","filB","antherB","tubeP","micro","egg7","polar","male","zyg","fruit","seed","coty","radicle","plumule","soil"];ids.forEach(i=>show[i]=[0,0,0,0,0,0,0,0]);const on=(i,ss)=>ss.forEach(x=>show[i][x]=1);
 ["sepal","petal","recept","fil","anther","stigma","style","ovary"].forEach(i=>on(i,[0,1,2,3,4,6]));on("ovule",[0,2,3,4,6]);on("pollen",[1]);on("bee",[3]);["sepalB","petalB","receptB","filB","antherB"].forEach(i=>on(i,[3]));on("tubeP",[4,5]);["micro","egg7","polar","male"].forEach(i=>on(i,[5]));on("ovule",[5]);on("seed",[6,7]);on("soil",[7]);on("coty",[7]);on("radicle",[7]);on("plumule",[7]);
 show.petal=[1,0,0,1,1,0,1,0].map((v,i)=>v);show.sepal=show.petal.slice();show.ovary=[1,1,1,1,1,0,1,0];
 const base={sepal:.96,petal:.96,recept:1,fil:1,anther:1,pollen:1,stigma:1,style:1,ovary:.6,ovule:1,bee:1,sepalB:.96,petalB:.96,receptB:1,filB:1,antherB:1,tubeP:1,micro:1,egg7:1,polar:1,male:1,seed:1,soil:1,coty:1,radicle:1,plumule:1};
 const Lw=(par,p)=>()=>par.localToWorld(c(...p));
 const labels=[["f-pe","Petals (corolla)","दल (कोरोला)",Lw(FL,[3.2,.8,1.1]),[0,3]],["f-se","Sepals (calyx)","बाह्यदल",Lw(FL,[2,-.2,-1.1]),[0]],["f-st","Stamen (male)","पुंकेसर (नर)",Lw(FL,[1.3,2.2,.9]),[0,1]],["f-an","Anther","परागकोश",Lw(FL,[.4,2.2,1]),[1]],["f-fi","Filament","पुंतंतु",Lw(FL,[.9,1,.9]),[0,1]],["f-pi","Pistil (female)","स्त्रीकेसर (मादा)",Lw(FL,[0,3.1,.2]),[0,2]],["f-sg","Stigma (sticky)","वर्तिकाग्र (चिपचिपा)",Lw(FL,[.5,3,.3]),[2,3,4]],["f-sy","Style","वर्तिका",Lw(FL,[.15,1.8,0]),[0,2,4]],["f-ov","Ovary","अंडाशय",Lw(FL,[.8,.5,.4]),[0,2]],["f-ovu","Ovules (each has an egg)","बीजांड (प्रत्येक में अंड)",Lw(FL,[-.5,.55,.2]),[2]],["f-re","Receptacle","पुष्पासन",Lw(FL,[-.7,-.5,.2]),[0]],["f-po","Pollen grain (magnified)","पराग कण (बड़ा)",Lw(FL,[1.7,2.1,1.4]),[1]],
  ["p-be","Bee carries pollen","मधुमक्खी पराग लाती",()=>bee.getWorldPosition(c()),[3]],["p-fb","Pollen donor flower","पराग-दाता फूल",Lw(FB,[0,3,0]),[3]],["p-cr","Cross-pollination (different plant)","पर-परागण (दूसरा पौधा)",Lw(FL,[-3,4.6,0]),[3]],
  ["t-tu","Pollen tube","पराग नलिका",Lw(FL,[.25,1.9,.15]),[4]],["t-ga","2 male gametes inside","2 नर युग्मक भीतर",Lw(FL,[-.2,1.2,0]),[4]],
  ["o-mi","Micropyle (entry)","बीजांडद्वार (प्रवेश)",Lw(OV,[1,-4.2,0]),[5]],["o-tu","Pollen tube","पराग नलिका",Lw(OV,[1.1,-6,0]),[5]],["o-eg","Egg cell + 2 synergids","अंड + 2 सहायक कोशिकाएँ",Lw(OV,[1.2,-1.6,0]),[5]],["o-po","2 polar nuclei → endosperm","2 ध्रुवीय केंद्रक → भ्रूणपोष",Lw(OV,[1.2,.6,0]),[5]],["o-ma","Male gametes","नर युग्मक",()=>mg1.getWorldPosition(c()),[5]],["o-zy","Zygote (egg + male gamete)","युग्मनज (अंड + नर युग्मक)",Lw(OV,[1.2,-2.4,0]),[5]],
  ["r-fr","Ovary → fruit","अंडाशय → फल",Lw(FL,[1.2,.4,.4]),[6]],["r-se","Ovule → seed","बीजांड → बीज",Lw(OV,[3.4,0,0]),[6]],["r-wi","Petals & stamens wither","दल व पुंकेसर मुरझाते",Lw(FL,[3,1.6,1]),[6]],
  ["g-se","Seed coat","बीज-चोल",Lw(GR,[1.4,-1.6,.4]),[7]],["g-co","Cotyledons","बीजपत्र",Lw(GR,[-.9,-1.6,.5]),[7]],["g-ra","Radicle → root","मूलांकुर → जड़",Lw(GR,[.8,-3.8,.2]),[7]],["g-pl","Plumule → shoot","प्रांकुर → प्ररोह",Lw(GR,[.9,.9,.3]),[7]],["g-so","Soil","मिट्टी",Lw(GR,[-5,-.2,.5]),[7]]];
 const clk=t=>(t*.08)%1;
 return run({n,g,org,show,base,ST:F_ST,cams,camK,labels,
  frame:(s,t)=>{FL.rotation.y=s===0?sin(t*.18)*.25:0;GR.rotation.y=0;
   /* pollen release */
   for(let i=0;i<NP;i++){const p=PL[i];if(s!==1){m4.makeScale(0,0,0)}else{const q=((t*.18+p.o)%1),a=A.an[p.a];m4.makeScale(1,1,1);m4.setPosition(a.x+p.dx*q*2,a.y-q*1.3+Math.sin(q*3)*.1,a.z+p.dz*q*2)}pol.setMatrixAt(i,m4)}pol.instanceMatrix.needsUpdate=!0;bigPol.rotation.y=t*.8;
   /* bee flight and wing beat */
   bee.visible=s===3;if(bee.visible){const f=clk(t)*1.1,k=Math.min(79,Math.floor(cl(f,0,1)*79)),p=beeP[k],pn=beeP[Math.min(79,k+1)];bee.position.copy(p);bee.lookAt(pn.x+p.x*0,pn.y,pn.z);bee.rotation.y+=PI/2*0;bee.rotation.z=0;w1.rotation.x=w2.rotation.x=sin(t*60)*.6;
    bee.rotation.set(0,Math.atan2(-(pn.z-p.z),pn.x-p.x),Math.atan2(pn.y-p.y,Math.hypot(pn.x-p.x,pn.z-p.z)))}
   /* pollen tube grows */
   const tg=s===4?cl(((t*.07)%1)*1.2,0,1):s===5||s===6?1:0;tubeG.setDrawRange(0,Math.floor(tg*TN)*8*6);tubeMesh.visible=s>=4&&s<=6;
   const og=s===5?cl(((t*.05)%1)*2,0,1):s>5?1:0;tubeOG.setDrawRange(0,Math.floor(Math.min(1,og*1.3)*ON)*10*6);
   const fz=s===5?cl(((t*.05)%1)*2-1,0,1):s>5?1:0;mg1.visible=mg2.visible=s===5;const tp=tubeOC.getPoint(cl(og*1.3,0,1));
   mg1.position.set(tp.x-.08,fz>0?lerp(tp.y,-1.6,fz):tp.y,0);mg2.position.set(tp.x+.08,fz>0?lerp(tp.y,.5,fz):tp.y,0);if(fz>0){mg1.position.x=lerp(mg1.position.x,0,fz);mg2.position.x=lerp(mg2.position.x,0,fz)}
   eggN.scale.setScalar(1+.5*fz);polA.position.x=-.25+.25*fz;polB.position.x=.25-.25*fz;
   /* fruit and seed development in step 7 */
   const dv=s===6?cl(((t*.06)%1)*1.4,0,1):s>6?1:0;org.forEach(o=>{if(o.id==="petal"&&o.m.parent&&o.m.parent.parent===FL)o.m.parent.scale.setScalar(s===6?1-dv:1)});ovMesh.scale.setScalar(1+dv*.9);ovM.color.setHex(dv>.5?0xf2a23a:0x9cd06a);ovM.opacity=s===6?.6+.3*dv:.6;
   seedCoat.material.opacity=s===6?dv*.9:0;
   /* germination */
   const gm=s===7?cl(((t*.05)%1)*1.3,0,1):0;rad.scale.set(1,.2+.8*gm,1);rad.position.y=-2.3;shoot.scale.set(1,.15+.85*gm,1);shoot.position.y=-1.1+gm*.3;sd_.scale.set(1,1,1)},
  predict:{q:"After fertilisation, what does the ovary develop into?",opts:[["Seed",!1,"The ovule becomes the seed."],["Fruit",!0,"Correct — the ovary becomes the fruit and the ovule becomes the seed."],["Flower",!1,"The flower withers after fertilisation."]]}})}
Q_("ch7/flower3d",[["The male reproductive part of a flower is the…","पुष्प का नर जनन भाग?",["Pistil","Stamen","Petal","Sepal"],1,"Anther + filament = stamen."],["Transfer of pollen from anther to stigma is called…","पराग का परागकोश से वर्तिकाग्र तक पहुँचना?",["Fertilisation","Pollination","Germination","Dispersal"],1,"Pollination comes before fertilisation."],["Pollen tube enters the ovule through the…","पराग नलिका बीजांड में कहाँ से घुसती है?",["Stigma","Micropyle","Style","Receptacle"],1,"The micropyle is the small opening."],["After fertilisation the ovule develops into a…","निषेचन के बाद बीजांड क्या बनता है?",["Fruit","Seed","Petal","Pollen"],1,"The ovary becomes the fruit."],["Cross-pollination brings pollen from…","पर-परागण में पराग कहाँ से आता है?",["The same flower","A flower on a different plant of the same species","A different species","The stem"],1,"It increases variation."]]);
Px["ch7/flower3d"]=[["Bees visit about 2 million flowers to make 500 g of honey — and pollinate crops on the way.","500 g शहद के लिए मधुमक्खियाँ लगभग 20 लाख फूलों पर जाती हैं — और रास्ते में फ़सलों का परागण करती हैं।"],["Fruits like mango, tomato and cucumber are ripened ovaries; the seeds inside were ovules.","आम, टमाटर, खीरा परिपक्व अंडाशय हैं; भीतर के बीज पहले बीजांड थे।"]];
{const Lf=Hi.find(h=>h.no===7).topics,i=Lf.findIndex(x=>x.id==="flower");Lf.splice(i<0?Lf.length:i+1,0,{id:"flower3d",title:"Flower, pollination & fertilisation — detailed 3D",hi:"पुष्प, परागण व निषेचन — विस्तृत 3D",build:Mflower,ncert:"Ch 7 · sexual reproduction in flowering plants"})}
/* ===================== SET 8: DNA · GENES · MENDEL · SEX DETERMINATION ===================== */
const KIND8={
 nuc8:["Nucleus","केंद्रक","Holds the chromosomes. A human cell nucleus has 46 chromosomes (23 pairs).","इसमें गुणसूत्र होते हैं; मानव कोशिका के केंद्रक में 46 गुणसूत्र (23 जोड़े) होते हैं।"],
 chrom:["Chromosome","गुणसूत्र","A coiled thread of DNA wrapped around histone proteins. Before division it is copied, so it looks like an X: two identical chromatids joined at the centromere.","हिस्टोन प्रोटीन पर लिपटा DNA का कुंडलित धागा; विभाजन से पहले प्रतिलिपि बनने पर X जैसा दिखता है — सेंट्रोमियर पर जुड़ी दो समान क्रोमैटिड।"],
 histone:["Histones (nucleosomes)","हिस्टोन (न्यूक्लियोसोम)","Protein 'spools' on which DNA is wound so that 2 m of DNA fits inside a tiny nucleus.","प्रोटीन 'चरखियाँ' जिन पर DNA लिपटा रहता है ताकि लगभग 2 m DNA छोटे केंद्रक में समा जाए।"],
 back:["Sugar–phosphate backbone","शर्करा–फ़ॉस्फ़ेट आधार-रज्जु","The two outer rails of the DNA ladder: deoxyribose sugar and phosphate in a repeating chain.","DNA सीढ़ी की दो बाहरी पटरियाँ: डीऑक्सीराइबोस शर्करा व फ़ॉस्फ़ेट की दोहराती कड़ी।"],
 A:["Adenine (A)","एडेनीन (A)","Pairs only with thymine (T) using two hydrogen bonds.","केवल थाइमीन (T) से दो हाइड्रोजन बंधों द्वारा जुड़ता है।"],
 T:["Thymine (T)","थाइमीन (T)","Pairs only with adenine (A).","केवल एडेनीन (A) से जुड़ता है।"],
 G:["Guanine (G)","ग्वानीन (G)","Pairs only with cytosine (C) using three hydrogen bonds.","केवल साइटोसीन (C) से तीन हाइड्रोजन बंधों द्वारा जुड़ता है।"],
 C:["Cytosine (C)","साइटोसीन (C)","Pairs only with guanine (G).","केवल ग्वानीन (G) से जुड़ता है।"],
 gene:["Gene","जीन","A stretch of DNA with the code for one protein. Proteins decide traits such as seed shape or flower colour.","DNA का वह खंड जिसमें एक प्रोटीन का कूट होता है; प्रोटीन बीज का आकार, फूल का रंग जैसे लक्षण तय करते हैं।"],
 mrna:["mRNA","mRNA","A single-stranded copy of a gene that carries the code from the nucleus to the ribosome.","जीन की एकल-रज्जु प्रतिलिपि जो कूट को केंद्रक से राइबोसोम तक ले जाती है।"],
 ribo:["Ribosome","राइबोसोम","Reads the mRNA three letters at a time and joins amino acids into a protein.","mRNA को तीन अक्षर प्रति बार पढ़ता है और अमीनो अम्ल जोड़कर प्रोटीन बनाता है।"],
 prot:["Protein (trait)","प्रोटीन (लक्षण)","The finished protein — e.g. an enzyme — produces the visible trait.","तैयार प्रोटीन — जैसे एंज़ाइम — दृश्य लक्षण पैदा करता है।"],
 pea:["Pea plant","मटर का पौधा","Mendel's experimental plant: many contrasting traits, short life cycle, easy to cross.","मेंडल का प्रयोग-पौधा: अनेक विपरीत लक्षण, छोटा जीवन-चक्र, आसान संकरण।"],
 allT:["Allele T (tall, dominant)","उपजाति T (लंबा, प्रभावी)","A dominant allele shows its trait even when only one copy is present.","प्रभावी उपजाति का लक्षण तब भी दिखता है जब केवल एक प्रति हो।"],
 allt:["Allele t (dwarf, recessive)","उपजाति t (बौना, अप्रभावी)","A recessive allele shows its trait only when both copies are recessive (tt).","अप्रभावी उपजाति का लक्षण तभी दिखता है जब दोनों प्रतियाँ अप्रभावी हों (tt)।"],
 gam:["Gamete","युग्मक","Sex cell carrying only one allele of each gene (law of segregation).","लैंगिक कोशिका जिसमें प्रत्येक जीन की केवल एक उपजाति होती है (पृथक्करण का नियम)।"],
 punn:["Punnett square","पुनेट वर्ग","A grid that combines the gametes of the two parents to show every possible offspring.","ग्रिड जो दोनों जनकों के युग्मकों को मिलाकर सभी संभावित संतानें दिखाता है।"],
 off:["Offspring","संतान","Genotype shows the alleles; phenotype shows the trait you can see.","जीनप्ररूप में उपजातियाँ, लक्षणप्ररूप में दिखने वाला लक्षण।"],
 X:["X chromosome","X गुणसूत्र","Large chromosome carried by everyone; females have two (XX).","बड़ा गुणसूत्र जो सबमें होता है; महिलाओं में दो (XX)।"],
 Y:["Y chromosome","Y गुणसूत्र","Small chromosome only in males (XY); it carries the gene that makes the embryo male.","छोटा गुणसूत्र जो केवल पुरुषों में (XY) होता है; इसमें वह जीन है जो भ्रूण को नर बनाता है।"]};
const G_ST=[
["1","From cell to DNA","कोशिका से DNA तक","Zoom into a cell: the nucleus holds 46 chromosomes; each chromosome is DNA wound around histone proteins; unwound it is a double helix about 2 nm wide.","कोशिका में ज़ूम करें: केंद्रक में 46 गुणसूत्र हैं; प्रत्येक गुणसूत्र हिस्टोन पर लिपटा DNA है; खोलने पर यह लगभग 2 nm चौड़ी दोहरी कुंडली है।","Hand-modelled · zoom levels not to scale",12],
["2","The DNA double helix","DNA की दोहरी कुंडली","Two sugar–phosphate backbones twist round each other. The rungs are base pairs: A always pairs with T, G with C (Chargaff's rule). The order of the letters is the genetic code.","दो शर्करा–फ़ॉस्फ़ेट रज्जुएँ एक-दूसरे पर ऐंठी हैं; डंडियाँ क्षार-युग्म हैं: A सदा T से, G सदा C से (शारगाफ़ का नियम); अक्षरों का क्रम ही आनुवंशिक कूट है।","Hand-modelled · ~10 base pairs per turn",12],
["3","Copying DNA","DNA की प्रतिलिपि","Before a cell divides the helix unzips and each strand builds a new partner from free letters. Two identical DNA molecules result — each has one old and one new strand (semi-conservative).","कोशिका विभाजन से पहले कुंडली खुलती है और प्रत्येक रज्जु मुक्त अक्षरों से नया साथी बनाती है; दो समान DNA बनते हैं — प्रत्येक में एक पुरानी, एक नई रज्जु (अर्ध-संरक्षी)।","Animated · schematic",13],
["4","Gene → protein → trait","जीन → प्रोटीन → लक्षण","A gene is a stretch of DNA. It is copied into mRNA; a ribosome reads the mRNA and builds a protein; the protein produces the trait.","जीन DNA का खंड है; इसकी प्रतिलिपि mRNA बनती है; राइबोसोम mRNA पढ़कर प्रोटीन बनाता है; प्रोटीन लक्षण पैदा करता है।","Animated · schematic",13],
["5","Mendel and his peas","मेंडल व उनके मटर","Gregor Mendel studied pairs of contrasting traits in pea plants — tall/dwarf, round/wrinkled, yellow/green. A tall (TT) plant crossed with a dwarf (tt) gives all tall (Tt) plants in F1.","ग्रेगर मेंडल ने मटर में विपरीत लक्षण-जोड़ों — लंबा/बौना, गोल/झुर्रीदार, पीला/हरा — का अध्ययन किया; लंबा (TT) × बौना (tt) से F1 में सभी लंबे (Tt) मिलते हैं।","Hand-modelled",12],
["6","F2: the 3 : 1 ratio","F2: 3 : 1 अनुपात","Self-pollinate the F1 (Tt × Tt). The Punnett square gives TT, Tt, Tt, tt: genotype 1 : 2 : 1 and phenotype 3 tall : 1 dwarf. The dwarf trait that vanished in F1 returns in F2.","F1 का स्व-परागण (Tt × Tt): पुनेट वर्ग से TT, Tt, Tt, tt — जीनप्ररूप 1 : 2 : 1 और लक्षणप्ररूप 3 लंबे : 1 बौना; F1 में लुप्त बौना लक्षण F2 में लौट आता है।","Animated · Punnett square",14],
["7","Two traits together: 9 : 3 : 3 : 1","दो लक्षण साथ: 9 : 3 : 3 : 1","Cross round-yellow (RRYY) with wrinkled-green (rryy): F1 is all round-yellow (RrYy). In F2 the traits assort independently: 9 round-yellow : 3 round-green : 3 wrinkled-yellow : 1 wrinkled-green.","गोल-पीले (RRYY) × झुर्रीदार-हरे (rryy): F1 सभी गोल-पीले (RrYy); F2 में लक्षण स्वतंत्र रूप से छँटते हैं: 9 गोल-पीले : 3 गोल-हरे : 3 झुर्रीदार-पीले : 1 झुर्रीदार-हरे।","Animated · 4×4 Punnett square",16],
["8","Sex determination","लिंग निर्धारण","Humans have 22 pairs of autosomes and one pair of sex chromosomes: XX in females, XY in males. All eggs carry X; a sperm carries X or Y — so the father's sperm decides the baby's sex, 50 : 50.","मनुष्य में 22 जोड़े अलिंग-सूत्र और एक जोड़ा लिंग-गुणसूत्र: महिला XX, पुरुष XY; सभी अंडाणुओं में X; शुक्राणु में X या Y — अतः पिता का शुक्राणु शिशु का लिंग तय करता है, 50 : 50।","Animated · Punnett square",13]];
function Mgenetics(){sd=81;const n=new Ne;Ge(n,{key:1.9});Je(n,-6.5,90,.08);const g=new J;n.add(g);const org=[];const add=mkAdd(g,org);
 const ZM=new J,HX=new J,CP=new J,PR=new J,MD=new J,PN=new J,SX=new J;[ZM,HX,CP,PR,MD,PN,SX].forEach(x=>g.add(x));
 HX.position.set(0,0,0);ZM.position.set(-13,0,0);CP.position.set(0,-24,0);CP.scale.setScalar(1.5);PR.position.set(34,0,0);MD.position.set(-30,-24,0);PN.position.set(30,-24,0);SX.position.set(0,-48,0);
 /* ---------- zoom stack: nucleus -> chromosome -> nucleosomes ---------- */
 const nucM=MAT(0x8d92e6,{opacity:.4,roughness:.4,clearcoat:.2,envMapIntensity:.4,sheen:0,depthWrite:!1,emissive:0x1b2160,emissiveIntensity:.25,bumpScale:.1});
 add("nuc8",sph(4.2,.05,1.5,1,1,1,40,56,2),nucM,[0,0,0],{parent:ZM,ns:1});
 const chM=[0xe0453a,0x3a86e0,0x45b97c,0xf2a63a,0xa05ad6,0xe86aa0].map(c_=>MAT(c_,{roughness:.5,clearcoat:.3,envMapIntensity:.4,sheen:0,bumpScale:.25,emissive:c_*0+0x101010,emissiveIntensity:.3}));
 const chr=(par,id,L,r,mat,cx,cy,cz,rot)=>{const grp=new J;grp.position.set(cx,cy,cz);grp.rotation.z=rot||0;par.add(grp);[-1,1].forEach(sd_=>{const pts=[];for(let i=0;i<=14;i++){const q=i/14;pts.push(c(sd_*(.18+.12*sin(q*PI)*.5),.0+q*L*.5-.0,0))}const m=add(id,tube([c(sd_*.16,.06,0),c(sd_*.2,L*.25,0),c(sd_*.16,L*.5,0)],r,10,u=>1-.15*u),mat,[0,0,0],{parent:grp,ns:1});const m2=add(id,tube([c(sd_*.16,-.06,0),c(sd_*.2,-L*.25,0),c(sd_*.16,-L*.5,0)],r,10,u=>1-.15*u),mat,[0,0,0],{parent:grp,ns:1})});add(id,sph(r*1.05,0,1,1.3,.8,1,12,16),MAT(0xffffff,{roughness:.4,emissive:0x333333,emissiveIntensity:.3}),[0,0,0],{parent:grp,ns:1});return grp};
 for(let i=0;i<10;i++){const a=i*2.399963,y=1-(i+.5)/10*2,r=Math.sqrt(1-y*y);chr(ZM,"chrom",1.2+.5*(i%3),.2,chM[i%6],cos(a)*r*2.3,y*2.3,sin(a)*r*2.3,i*.9)}
 /* big chromosome for zoom 2 */
 const BC=new J;BC.position.set(0,0,0);HX.add(BC);
 const bcM=MAT(0xe0453a,{roughness:.5,clearcoat:.3,bumpScale:.3,envMapIntensity:.4,sheen:0,emissive:0x3a0a08,emissiveIntensity:.3}),hsM=MAT(0xffb0a0,{roughness:.4,emissive:0x5a1a10,emissiveIntensity:.3,envMapIntensity:.4,sheen:0});
 [-1,1].forEach(sd_=>{const a0=c(-sd_*1.9,-4.6,0),a1=c(sd_*1.9,4.6,0),d=a1.clone().sub(a0),Ld=d.length(),dn=d.clone().normalize(),u=c(dn.y,-dn.x,0).normalize(),v=c(0,0,1);
  const pts=[0,.25,.5,.75,1].map(q=>a0.clone().lerp(a1,q));add("chrom",tube(pts,.62,14,u_=>.55+.45*Math.pow(sin(u_*PI),.35)),bcM,[0,0,0],{parent:BC});
  const hel=[];for(let i=0;i<=150;i++){const q=i/150,ang=q*TAU*18,r=.95*(.6+.4*Math.pow(sin(q*PI),.35));const pp=a0.clone().lerp(a1,q);hel.push(pp.add(u.clone().multiplyScalar(Math.cos(ang)*r)).add(v.clone().multiplyScalar(Math.sin(ang)*r)))}add("histone",tube(hel,.13,6),hsM,[0,0,0],{parent:BC,ns:1})});
 add("chrom",sph(.55,0,1,1,1,1,16,20),MAT(0xffffff,{roughness:.4,emissive:0x555555,emissiveIntensity:.4,sheen:0}),[0,0,0],{parent:BC});
 /* nucleosomes + DNA, helix */
 const NUCL=new J;NUCL.position.set(0,0,0);HX.add(NUCL);
 const bm={A:MAT(0x3fb0ff,{roughness:.35,clearcoat:.6,emissive:0x0a3a6a,emissiveIntensity:.4,envMapIntensity:.5}),T:MAT(0xffd23f,{roughness:.35,clearcoat:.6,emissive:0x6a5000,emissiveIntensity:.4,envMapIntensity:.5}),G:MAT(0x4fd17a,{roughness:.35,clearcoat:.6,emissive:0x0a5a24,emissiveIntensity:.4,envMapIntensity:.5}),C:MAT(0xff6a6a,{roughness:.35,clearcoat:.6,emissive:0x6a1010,emissiveIntensity:.4,envMapIntensity:.5})};
 const bkM=MAT(0xb9c3d6,{roughness:.4,clearcoat:.6,envMapIntensity:.6,emissive:0x1a2030,emissiveIntensity:.25,bumpScale:.1,sheen:0});
 const seq="ATGCCGTAGCTAAGCTTGCA";const comp={A:"T",T:"A",G:"C",C:"G"};const HN=24,HT=.55,HH=.62,HR=1.1;
 const hp=(i,sd_)=>{const a=i*HT+(sd_?PI:0);return c(Math.cos(a)*HR,i*HH-HN*HH/2,Math.sin(a)*HR)};
 const DNA=new J;HX.add(DNA);
 [0,1].forEach(sd_=>{const pts=[];for(let i=0;i<=HN*4;i++){const q=i/4;pts.push(hp(q,sd_))}add("back",tube(pts,.16,8),bkM,[0,0,0],{parent:DNA,ns:1});for(let i=0;i<HN;i++)add("back",sph(.24,0,1,1,1,1,10,14),MAT(0xe8ecf6,{roughness:.4,emissive:0x2a3040,emissiveIntensity:.25,sheen:0}),hp(i,sd_).toArray(),{parent:DNA,ns:1})});
 const rungs=[];for(let i=0;i<HN;i++){const b1=seq[i%seq.length],b2=comp[b1],p1=hp(i,0),p2=hp(i,1),mid=p1.clone().lerp(p2,.5);
  const h1=add(b1,tube([p1.clone().lerp(mid,.12),mid],.17,8),bm[b1],[0,0,0],{parent:DNA,ns:1}),h2=add(b2,tube([mid,p2.clone().lerp(mid,.12)],.17,8),bm[b2],[0,0,0],{parent:DNA,ns:1});rungs.push({b1,b2,p1,p2,mid,h1,h2})}
 /* free letters for replication */
 const NL=HN*2,fl=new Wn(new it(.2,10,8),new bt({color:0xffffff}),NL);fl.frustumCulled=!1;DNA.add(fl);const m4=new gt,fc=new we;const LC={A:0x3fb0ff,T:0xffd23f,G:0x4fd17a,C:0xff6a6a};for(let i=0;i<NL;i++){const r=rungs[i>>1];fl.setColorAt(i,fc.setHex(LC[i%2?r.b2:r.b1]))}
 /* ---------- gene -> protein ---------- */
 const GN=[c(-6,.8,0),c(-3,.8,0),c(0,.8,0),c(3,.8,0)];const gp=new J;gp.position.set(0,0,0);CP.add(gp);
 const gnM=MAT(0xf2c64a,{roughness:.4,clearcoat:.5,emissive:0x6a4a00,emissiveIntensity:.35,bumpScale:.1});
 const dnaPts=[];for(let i=0;i<=80;i++){const q=i/80;dnaPts.push(c(-9+q*18,-3+Math.sin(q*TAU*4)*.5,Math.cos(q*TAU*4)*.5))}add("back",tube(dnaPts,.11,6),bkM,[0,0,0],{parent:CP,ns:1});const dnaPts2=dnaPts.map((p,i)=>c(p.x,-3-Math.sin(i/80*TAU*4)*.5,-Math.cos(i/80*TAU*4)*.5));add("back",tube(dnaPts2,.11,6),bkM,[0,0,0],{parent:CP,ns:1});
 add("gene",tube(dnaPts.filter((p,i)=>i>=18&&i<=50),.17,6),gnM,[0,0,0],{parent:CP,ns:1});add("gene",tube(dnaPts2.filter((p,i)=>i>=18&&i<=50),.17,6),gnM,[0,0,0],{parent:CP,ns:1});
 const mr=[];for(let i=0;i<=40;i++){const q=i/40;mr.push(c(-3+q*6-q*q*2,-.6+q*2.4+Math.sin(q*TAU*3)*.2,Math.cos(q*TAU*3)*.3))}const mrM=MAT(0xff8fb0,{roughness:.35,clearcoat:.6,emissive:0x7a1a3a,emissiveIntensity:.35});
 const mrG=tube(mr,.17,8);mrG.setDrawRange(0,0);const mrMesh=add("mrna",mrG,mrM,[0,0,0],{parent:CP,ns:1});
 const rb1=add("ribo",sph(1.0,.03,2,1.3,.75,.9,20,26),MAT(0x2e9ab0,{roughness:.45,clearcoat:.4,emissive:0x0a3a48,emissiveIntensity:.3}),[5.5,2.8,0],{parent:CP}),rb2=add("ribo",sph(.7,.03,2,1.3,.7,.9,16,22),MAT(0x2e9ab0,{roughness:.45,emissive:0x0a3a48,emissiveIntensity:.3}),[5.5,3.55,0],{parent:CP,ns:1});
 const NA=14,aa=new Wn(new it(.5,14,12),new bt({color:0xffffff}),NA);aa.frustumCulled=!1;CP.add(aa);const ac=new we;const ACOL=[0xff6a6a,0x3fb0ff,0x4fd17a,0xffd23f,0xa05ad6,0xf2a63a,0xe86aa0];for(let i=0;i<NA;i++)aa.setColorAt(i,ac.setHex(ACOL[i%7]));
 const protP=[];for(let i=0;i<NA;i++){const q=i/NA;protP.push(c(6.8+Math.cos(q*TAU*1.2)*1.4+q*1.6,3.1+q*1.4+Math.sin(q*TAU*1.2)*1.4,Math.sin(q*TAU*2)*.4))}
 const protM=MAT(0xff9a3d,{roughness:.4,clearcoat:.7,emissive:0x6a3000,emissiveIntensity:.35,bumpScale:.15});const protG=add("prot",sph(1.8,.14,3,1.2,1,1,32,40,3),protM,[11.5,5.6,0],{parent:CP});
 /* ---------- Mendel: pea plants ---------- */
 const stem=(par,x,h,mat,leafM)=>{add("pea",tube([c(x,0,0),c(x+.05,h*.5,0),c(x,h,0)],.1,8,u=>1-.4*u),mat,[0,0,0],{parent:par});for(let k=1;k<=Math.max(2,Math.round(h/1.3));k++){[-1,1].forEach(sg=>add("pea",sph(.42,.03,2,1,.12,.6,14,18),leafM,[x+sg*.4,k*h/(Math.max(2,Math.round(h/1.3))+1),0],{parent:par,ns:1}))}add("pea",sph(.28,.04,2,1,1,1,12,16),MAT(0xffffff,{roughness:.5,emissive:0x444444,emissiveIntensity:.3}),[x,h+.1,0],{parent:par,ns:1})};
 const stM=MAT(0x6aa84f,{roughness:.5,bumpScale:.2,emissive:0x143a0e,emissiveIntensity:.2}),lfM=MAT(0x4a9a3a,{roughness:.5,side:vt,emissive:0x143a0e,emissiveIntensity:.2});
 const plant=(par,x,tall,tag)=>{const gr=new J;gr.position.set(x,-3,0);par.add(gr);stem(gr,0,tall?4.6:1.9,stM,lfM);return gr};
 const pot=(par,x)=>add("pea",new Xe(.9,.7,.5,24),new bt({color:0xb5693a}),[x,-3.3,0],{parent:par,ns:1});
 /* P generation: TT tall, tt dwarf ; F1 Tt tall */
 const pea=[];const mkPea=(par,x,y,col,wr,rr)=>{const m=add("off",sph(.3,wr?.18:.02,3,1,1,1,16,20,Math.floor(x*10)),MAT(col,{roughness:.55,clearcoat:.15,envMapIntensity:.4,bumpScale:wr?.4:.05,sheen:0,emissive:col*0+0x222200,emissiveIntensity:.2}),[x,y,0],{parent:par,ns:1});return m};
 /* P cross panel */
 plant(PR,-5.6,!0);plant(PR,-1.4,!1);pot(PR,-5.6);pot(PR,-1.4);plant(PR,5.6,!0);pot(PR,5.6);
 add("allT",sph(.5,0,1,1,1,1,14,18),MAT(0x3fb0ff,{emissive:0x0a3a6a,emissiveIntensity:.5,roughness:.35}),[-5.6,-5.2,0],{parent:PR,ns:1});add("allT",sph(.5,0,1,1,1,1,14,18),MAT(0x3fb0ff,{emissive:0x0a3a6a,emissiveIntensity:.5,roughness:.35}),[-5.0,-5.2,0],{parent:PR,ns:1});
 add("allt",sph(.5,0,1,1,1,1,14,18),MAT(0xff9a3d,{emissive:0x6a3000,emissiveIntensity:.5,roughness:.35}),[-1.7,-5.2,0],{parent:PR,ns:1});add("allt",sph(.5,0,1,1,1,1,14,18),MAT(0xff9a3d,{emissive:0x6a3000,emissiveIntensity:.5,roughness:.35}),[-1.1,-5.2,0],{parent:PR,ns:1});
 add("allT",sph(.5,0,1,1,1,1,14,18),MAT(0x3fb0ff,{emissive:0x0a3a6a,emissiveIntensity:.5,roughness:.35}),[5.3,-5.2,0],{parent:PR,ns:1});add("allt",sph(.5,0,1,1,1,1,14,18),MAT(0xff9a3d,{emissive:0x6a3000,emissiveIntensity:.5,roughness:.35}),[5.9,-5.2,0],{parent:PR,ns:1});
 const arrM=MAT(0xffffff,{roughness:.4,emissive:0x555555,emissiveIntensity:.4});add("gam",tube([c(-3.6,.4,0),c(-3.6,-1.4,0)],.08,6),arrM,[0,0,0],{parent:PR,ns:1});add("gam",tube([c(1.8,.4,0),c(3.0,-.4,0),c(4.2,-1.4,0)],.0,6),arrM,[0,0,0],{parent:PR,ns:1});
 /* monohybrid Punnett grid (MD) */
 const cell=(par,id,x,y,w,col,txt)=>add(id,new Xe(w/2*1.42,w/2*1.42,.18,4),new bt({color:col,transparent:!0}),[x,y,0],{parent:par,rot:[PI/2,PI/4,0],ns:1});
 const gridM=[];const mono=[["TT",0],["Tt",0],["Tt",0],["tt",1]];
 [[-1.6,1.6],[1.6,1.6],[-1.6,-1.6],[1.6,-1.6]].forEach((p,i)=>{const dw=mono[i][1];cell(MD,"punn",p[0],p[1],3.0,dw?0xfff0d0:0xe8f4ff);add("pea",tube([c(p[0],p[1]-.7,.3),c(p[0],p[1]-.7+(dw?.5:1.3),.3)],.07,6),stM,[0,0,0],{parent:MD,ns:1});add("pea",sph(.26,0,1,1.6,.25,.8,12,16),lfM,[p[0]+.2,p[1]-.7+(dw?.35:1.0),.3],{parent:MD,ns:1});add("pea",sph(.26,0,1,1.6,.25,.8,12,16),lfM,[p[0]-.2,p[1]-.7+(dw?.2:.6),.3],{parent:MD,ns:1});
  [0,1].forEach(k=>add(mono[i][0][k]===mono[i][0][k].toUpperCase()?"allT":"allt",sph(.2,0,1,1,1,1,10,14),MAT(mono[i][0][k]===mono[i][0][k].toUpperCase()?0x3fb0ff:0xff9a3d,{emissive:mono[i][0][k]===mono[i][0][k].toUpperCase()?0x0a3a6a:0x6a3000,emissiveIntensity:.5,roughness:.35}),[p[0]-.35+k*.7,p[1]-1.0,.3],{parent:MD,ns:1}))});
 [[-1.6,2.9,"T"],[1.6,2.9,"t"]].forEach(q=>add(q[2]==="T"?"allT":"allt",sph(.42,0,1,1,1,1,14,18),MAT(q[2]==="T"?0x3fb0ff:0xff9a3d,{emissive:q[2]==="T"?0x0a3a6a:0x6a3000,emissiveIntensity:.5,roughness:.35}),[q[0],q[1],0],{parent:MD,ns:1}));
 [[-3.5,1.6,"T"],[-3.5,-1.6,"t"]].forEach(q=>add(q[2]==="T"?"allT":"allt",sph(.42,0,1,1,1,1,14,18),MAT(q[2]==="T"?0x3fb0ff:0xff9a3d,{emissive:q[2]==="T"?0x0a3a6a:0x6a3000,emissiveIntensity:.5,roughness:.35}),[q[0],q[1],0],{parent:MD,ns:1}));
 /* dihybrid 4x4 (PN) */
 const gm=["RY","Ry","rY","ry"];const col={R:0x3fb0ff,r:0xff9a3d,Y:0xffd23f,y:0x4fd17a};
 const dih=[];for(let i=0;i<4;i++)for(let j=0;j<4;j++){const a=gm[i],b=gm[j],ge=(a[0]<b[0]?a[0]+b[0]:b[0]+a[0]),g1=[a[0],b[0]].sort().join(""),g2=[a[1],b[1]].sort().join("");const round=/R/.test(g1),yel=/Y/.test(g2);
  const x=(j-1.5)*2.05,y=(1.5-i)*2.05;add("punn",new Xe(1.38,1.38,.14,4),new bt({color:round?(yel?0xfff2a0:0xcdf0c0):(yel?0xffe6b8:0xdfeedb),transparent:!0}),[x,y,0],{parent:PN,rot:[PI/2,PI/4,0],ns:1});
  const pm=add("off",sph(.5,round?.015:.0,3,1,1,1,20,26,i*4+j),MAT(yel?0xf2c200:0x3f9a3a,{roughness:.5,clearcoat:.1,envMapIntensity:.4,sheen:0,bumpScale:round?.05:.7,emissive:yel?0x6a5000:0x0a3a0a,emissiveIntensity:.4}),[x,y,.25],{parent:PN});if(!round){pm.scale.set(.85,.8,.85)}dih.push({pm,round,yel,i,j})}
 gm.forEach((q,k)=>{[[(k-1.5)*2.05,4.0],[-4.4,(1.5-k)*2.05]].forEach(p=>{[0,1].forEach(m=>add(q[m]==="R"||q[m]==="r"?(q[m]==="R"?"allT":"allt"):(q[m]==="Y"?"allT":"allt"),sph(.28,0,1,1,1,1,12,16),MAT(col[q[m]],{emissive:col[q[m]]*0+0x222222,emissiveIntensity:.5,roughness:.35}),[p[0]-.3+m*.6,p[1],.15],{parent:PN,ns:1}))})});
 /* sex determination (SX): chromosomes X and Y + 2x2 Punnett */
 const xM=MAT(0xe86aa0,{roughness:.45,clearcoat:.4,envMapIntensity:.4,sheen:0,bumpScale:.2,emissive:0x4a1030,emissiveIntensity:.3}),yM=MAT(0x3a86e0,{roughness:.45,clearcoat:.4,envMapIntensity:.4,sheen:0,bumpScale:.2,emissive:0x0a2a5a,emissiveIntensity:.3});
 const xchr=(par,x,y,id,mat,L)=>{const gr=new J;gr.position.set(x,y,0);par.add(gr);[[-1,1],[1,1]].forEach(q=>{add(id,tube([c(0,0,0),c(q[0]*.9,L*.55,0)],.26,10,u=>1-.2*u),mat,[0,0,0],{parent:gr,ns:1});add(id,tube([c(0,0,0),c(q[0]*.9,-L*.55,0)],.26,10,u=>1-.2*u),mat,[0,0,0],{parent:gr,ns:1})});if(id==="Y"){gr.children.forEach((m,i)=>{if(i===0||i===1)return;});}return gr};
 const xl=(par,x,y,id,mat)=>{const gr=new J;gr.position.set(x,y,0);par.add(gr);const L=id==="X"?1.5:1.0;[-1,1].forEach(sg=>{add(id,tube([c(sg*.05,0,0),c(sg*.55,L*.5,0),c(sg*.9,L,0)],.24,10,u=>1-.25*u),mat,[0,0,0],{parent:gr,ns:1});add(id,tube([c(sg*.05,0,0),c(sg*.55,-L*.5,0),c(sg*.9,-L,0)],.24,10,u=>1-.25*u),mat,[0,0,0],{parent:gr,ns:1})});return gr};
 /* parents' sex chromosomes */
 xl(SX,-7,3.2,"X",xM).scale.setScalar(.6);xl(SX,-5.4,3.2,"X",xM).scale.setScalar(.6);xl(SX,7,3.2,"X",xM).scale.setScalar(.6);xl(SX,8.6,3.2,"Y",yM).scale.setScalar(.6);
 /* gametes row + Punnett 2x2 */
 [[-1.6,1.6,"XX",0],[1.6,1.6,"XY",1],[-1.6,-1.6,"XX",0],[1.6,-1.6,"XY",1]].forEach((p,i)=>{const mm=i%2;add("punn",new Xe(1.98,1.98,.15,4),new bt({color:mm?0xdbe9ff:0xffe0ec,transparent:!0}),[p[0],p[1]-3.2,0],{parent:SX,rot:[PI/2,PI/4,0],ns:1});xl(SX,p[0]-.5,p[1]-3.2,"X",xM).scale.setScalar(.5);xl(SX,p[0]+.5,p[1]-3.2,mm?"Y":"X",mm?yM:xM).scale.setScalar(.5)});
 xl(SX,-1.6,-.2,"X",xM).scale.setScalar(.5);xl(SX,1.6,-.2,"X",xM).scale.setScalar(.5);xl(SX,-3.8,-2.7,"X",xM).scale.setScalar(.5);xl(SX,-3.8,-6.2,"X",xM).scale.setScalar(.5);
 /* cameras */
 const cams=[[c(-1,0,33),c(-1,0,0)],[c(0,0,22),c(0,0,0)],[c(0,0,22),c(0,0,0)],[c(7,-22,31),c(7,-22,0)],[c(32,-3,17),c(32,-3.6,0)],[c(-30,-24.4,21),c(-30,-24.4,0)],[c(30,-24.4,23),c(30,-24.4,0)],[c(0,-50,31),c(0,-50.5,0)]];
 const camK=["Cell→DNA","Helix","Copying","Gene","Mendel","3:1","9:3:3:1","Sex"];
 const show={};const ids=["nuc8","chrom","histone","back","A","T","G","C","gene","mrna","ribo","prot","pea","allT","allt","gam","punn","off","X","Y"];ids.forEach(i=>show[i]=[0,0,0,0,0,0,0,0]);const on=(i,ss)=>ss.forEach(x=>show[i][x]=1);
 on("nuc8",[0]);on("chrom",[0]);on("histone",[0]);["back","A","T","G","C"].forEach(i=>on(i,[0,1,2,3]));on("gene",[3]);on("mrna",[3]);on("ribo",[3]);on("prot",[3]);on("pea",[4]);on("allT",[4,5,6]);on("allt",[4,5,6]);on("gam",[4]);on("punn",[5,6,7]);on("off",[5,6]);on("X",[7]);on("Y",[7]);
 const base={nuc8:.4,chrom:1,histone:1,back:1,A:1,T:1,G:1,C:1,gene:1,mrna:1,ribo:1,prot:1,pea:1,allT:1,allt:1,gam:1,punn:1,off:1,X:1,Y:1};
 const Lw=(par,p)=>()=>par.localToWorld(c(...p));
 const labels=[["z-nu","Nucleus (46 chromosomes)","केंद्रक (46 गुणसूत्र)",Lw(ZM,[0,4.4,0]),[0]],["z-ch","Chromosomes","गुणसूत्र",Lw(ZM,[2.2,1.2,.6]),[0]],["z-ze","Chromosome (DNA on histones)","गुणसूत्र (हिस्टोन पर DNA)",Lw(HX,[2,4.4,0]),[0]],["z-dn","DNA double helix","DNA दोहरी कुंडली",Lw(HX,[11,5,0]),[0]],
  ["h-ba","Sugar–phosphate backbone","शर्करा–फ़ॉस्फ़ेट आधार-रज्जु",Lw(DNA,[1.1,5,.2]),[1,2]],["h-A","A–T (2 H-bonds)","A–T (2 H-बंध)",Lw(DNA,[0,-2,0]),[1]],["h-G","G–C (3 H-bonds)","G–C (3 H-बंध)",Lw(DNA,[0,-4.3,0]),[1]],["h-tu","One turn = 10 base pairs (3.4 nm)","एक घुमाव = 10 क्षार-युग्म (3.4 nm)",Lw(DNA,[-1.3,6,0]),[1]],["h-co","A=T · G≡C (Chargaff)","A=T · G≡C (शारगाफ़)",Lw(DNA,[1.3,2,0]),[1]],["h-re","Free letters build new strands","मुक्त अक्षर नई रज्जु बनाते",Lw(DNA,[2.6,.4,0]),[2]],["h-se","Each copy: 1 old + 1 new strand","प्रत्येक: 1 पुरानी + 1 नई रज्जु",Lw(DNA,[-2.6,5,0]),[2]],
  ["g-ge","Gene (stretch of DNA)","जीन (DNA का खंड)",Lw(CP,[-1.5,-2.2,0]),[3]],["g-mr","mRNA copy leaves the nucleus","mRNA प्रतिलिपि केंद्रक से बाहर",Lw(CP,[1,1.5,.4]),[3]],["g-ri","Ribosome reads mRNA","राइबोसोम mRNA पढ़ता",Lw(CP,[5.5,2.8,0]),[3]],["g-pr","Protein → trait","प्रोटीन → लक्षण",Lw(CP,[10.3,6.6,0]),[3]],
  ["m-tt","TT tall (P)","TT लंबा (P)",Lw(PR,[-5.6,2,0]),[4]],["m-dd","tt dwarf (P)","tt बौना (P)",Lw(PR,[-1.4,-.2,0]),[4]],["m-f1","F1: all Tt, tall","F1: सभी Tt, लंबे",Lw(PR,[5.6,2.2,0]),[4]],["m-ga","Gametes: T and t","युग्मक: T व t",Lw(PR,[2,-1.8,0]),[4]],["m-do","T dominant · t recessive","T प्रभावी · t अप्रभावी",Lw(PR,[5.6,-4.4,0]),[4]],
  ["u-gt","Gametes T / t","युग्मक T / t",Lw(MD,[0,3.8,0]),[5]],["u-pu","Punnett square","पुनेट वर्ग",Lw(MD,[0,-3.4,0]),[5]],["u-tt","TT","TT",Lw(MD,[-1.6,.6,0]),[5]],["u-dw","tt (dwarf)","tt (बौना)",Lw(MD,[1.6,-2.6,0]),[5]],["u-ra","3 tall : 1 dwarf","3 लंबे : 1 बौना",Lw(MD,[3.8,0,0]),[5]],["u-ge","Genotype 1 TT : 2 Tt : 1 tt","जीनप्ररूप 1 : 2 : 1",Lw(MD,[-3.6,-3.2,0]),[5]],
  ["d-rr","9 round-yellow","9 गोल-पीले",Lw(PN,[-2.0,2.0,0]),[6]],["d-rg","3 round-green","3 गोल-हरे",Lw(PN,[2.0,-.2,0]),[6]],["d-wy","3 wrinkled-yellow","3 झुर्रीदार-पीले",Lw(PN,[-2.0,-2.2,0]),[6]],["d-wg","1 wrinkled-green","1 झुर्रीदार-हरा",Lw(PN,[3.0,-3.1,0]),[6]],["d-ga","16 gamete combinations","16 युग्मक-संयोजन",Lw(PN,[0,4.8,0]),[6]],["d-pu","Independent assortment","स्वतंत्र छँटाव",Lw(PN,[-5.8,0,0]),[6]],
  ["x-mo","Mother XX → all eggs X","माँ XX → सभी अंडाणु X",Lw(SX,[-6.2,4.3,0]),[7]],["x-fa","Father XY → X or Y sperm","पिता XY → X या Y शुक्राणु",Lw(SX,[8,4.3,0]),[7]],["x-gi","XX girl","XX बालिका",Lw(SX,[-1.6,-4.4,0]),[7]],["x-bo","XY boy","XY बालक",Lw(SX,[1.6,-4.4,0]),[7]],["x-ra","50 : 50 — father decides","50 : 50 — पिता तय करता",Lw(SX,[4.2,-5,0]),[7]]];
 const gr_=(q)=>q;
 return run({n,g,org,show,base,ST:G_ST,cams,camK,labels,
  hud:(s,t)=>s===5?"F2 phenotype 3 tall : 1 dwarf · genotype 1 TT : 2 Tt : 1 tt":s===6?"F2 phenotype 9 : 3 : 3 : 1":s===7?"Daughters 50% · Sons 50%":"",
  frame:(s,t)=>{const ph=(t*.05)%1;
   ZM.rotation.y=sin(t*.3)*.4;ZM.visible=s===0;HX.visible=s===0||s===1||s===2;
   /* step 0: zoom - show nucleus+chromosomes, big chromosome and helix gradually; step 1+: helix only */
   BC.visible=s===0;NUCL.visible=!1;DNA.visible=s>=1&&s<=2;DNA.position.set(0,0,0);DNA.rotation.y=t*.35;
   BC.position.set(8,0,0);BC.scale.setScalar(.8);BC.rotation.y=t*.3;ZM.position.set(-13,0,0);
   if(s===0){HX.position.set(0,0,0);DNA.visible=!0;DNA.position.set(11,0,0);DNA.scale.setScalar(.95);BC.position.set(2,0,0)}else{DNA.scale.setScalar(1.15);HX.position.set(0,0,0)}
   /* replication */
   const un=s===2?cl(ph*1.3,0,1):0;rungs.forEach((r,i)=>{const k=cl(un*1.6-i/HN*.6,0,1),off=k*1.2;[r.h1,r.h2].forEach(h=>h.visible=k<.98);if(s===2){r.h1.position.set(0,0,0)}});
   for(let i=0;i<NL;i++){if(s!==2){m4.makeScale(0,0,0);fl.setMatrixAt(i,m4);continue}const r=rungs[i>>1],side=i%2,k=cl(un*1.6-(i>>1)/HN*.6,0,1),home=side?r.p2:r.p1,away=c(home.x*(side?-1:1)*0+home.x*2.3,home.y+((i*13)%7-3)*.1,home.z*2.3);const p=away.clone().lerp(home,k);const nm=side?r.p2:r.p1;m4.makeScale(1,1,1);const q=home.clone().multiplyScalar(1).add(home.clone().setY(0).normalize().multiplyScalar(.9+(1-k)*1.8));m4.setPosition(q.x,home.y,q.z);fl.setMatrixAt(i,m4)}fl.instanceMatrix.needsUpdate=!0;
   /* gene -> protein */
   const gp_=s===3?ph:0;mrG.setDrawRange(0,Math.floor(cl(gp_*2.2,0,1)*(mrG.index.count/3))*3);mrMesh.visible=s===3;
   for(let i=0;i<NA;i++){if(s!==3){m4.makeScale(0,0,0)}else{const f=cl((gp_-.45)*3.2-i/NA*1.2,0,1),p=protP[i],from=c(5.5,2.2,0);const q=from.clone().lerp(p,f);m4.makeScale(f>0?1:0,f>0?1:0,f>0?1:0);m4.setPosition(q.x,q.y,q.z)}aa.setMatrixAt(i,m4)}aa.instanceMatrix.needsUpdate=!0;
   protG.visible=s===3&&gp_>.8;rb1.position.x=5.5+cl((gp_-.2)*3,0,1)*.3},
  predict:{q:"In a cross between two heterozygous tall pea plants (Tt × Tt), what fraction of the offspring will be dwarf?",opts:[["1/4",!0,"Correct — only tt is dwarf: 3 tall : 1 dwarf."],["1/2",!1,"That is the ratio for a test cross (Tt × tt)."],["3/4",!1,"3/4 are tall."]]}})}
Q_("ch8/genetics3d",[["DNA base A always pairs with…","DNA में A सदा किससे जुड़ता है?",["G","T","C","A"],1,"A–T and G–C."],["A gene is…","जीन क्या है?",["A whole chromosome","A segment of DNA coding for a protein","A protein","A cell"],1,"Genes are stretches of DNA."],["F2 phenotypic ratio of a monohybrid cross is…","एकल संकर का F2 लक्षणप्ररूप अनुपात?",["1:1","3:1","9:3:3:1","1:2:1"],1,"3 dominant : 1 recessive."],["F2 ratio of a dihybrid cross is…","द्विसंकर का F2 अनुपात?",["3:1","1:2:1","9:3:3:1","1:1:1:1"],2,"Independent assortment."],["Who determines the sex of a human baby?","शिशु का लिंग कौन तय करता है?",["Mother's egg","Father's sperm (X or Y)","The doctor","Both equally"],1,"All eggs carry X."]]);
Px["ch8/genetics3d"]=[["If you stretched out the DNA in one human cell it would be about 2 metres long.","एक मानव कोशिका का DNA खींचने पर लगभग 2 मीटर लंबा होगा।"],["Mendel grew and counted about 28,000 pea plants over eight years to find his ratios.","मेंडल ने अनुपात खोजने के लिए आठ वर्षों में लगभग 28,000 मटर के पौधे उगाए और गिने।"]];
{const Lg=Hi.find(h=>h.no===8).topics,i=Lg.findIndex(x=>x.id==="mendel");Lg.splice(i<0?Lg.length:i+1,0,{id:"genetics3d",title:"DNA, genes & Mendel's laws — detailed 3D",hi:"DNA, जीन व मेंडल के नियम — विस्तृत 3D",build:Mgenetics,ncert:"Ch 8 · heredity"})}
/* ===================== SET 9: CELL DIVISION — MITOSIS & MEIOSIS ===================== */
const KIND9={
 cell9:["Cell (plasma membrane)","कोशिका (झिल्ली)","The dividing cell. In this model the organism has 2 pairs of chromosomes (2n = 4): a long pair and a short pair; red came from the mother, blue from the father.","विभाजित होती कोशिका; इस मॉडल में जीव में 2 जोड़े गुणसूत्र (2n = 4) हैं — एक लंबा, एक छोटा; लाल माँ से, नीला पिता से।"],
 nuc9:["Nuclear envelope","केंद्रक आवरण","Double membrane around the chromosomes. It breaks down in prophase and re-forms in telophase.","गुणसूत्रों को घेरने वाली दोहरी झिल्ली; पूर्वावस्था में टूटती और अंत्यावस्था में पुनः बनती है।"],
 chrom9:["Chromosome / chromatid","गुणसूत्र / क्रोमैटिड","Each duplicated chromosome has two identical sister chromatids joined at the centromere. Long thin chromatin condenses into short thick chromosomes so they can be moved without tangling.","प्रत्येक द्विगुणित गुणसूत्र में सेंट्रोमियर पर जुड़ी दो समान सहोदर क्रोमैटिड होती हैं; लंबा पतला क्रोमैटिन छोटे मोटे गुणसूत्र में संघनित होता है ताकि बिना उलझे खिसक सके।"],
 spindle:["Spindle fibres","तर्कु तंतु","Microtubules from the two centrioles. They attach to the centromeres, line the chromosomes up and pull the chromatids apart.","दो तारककायों से निकली सूक्ष्मनलिकाएँ; सेंट्रोमियर से जुड़कर गुणसूत्रों को पंक्ति में लाती और क्रोमैटिड खींचती हैं।"],
 cen9:["Centrioles (poles)","तारककाय (ध्रुव)","They organise the spindle. They duplicate in interphase and move to opposite poles in prophase.","तर्कु को व्यवस्थित करती हैं; अंतरावस्था में द्विगुणित होकर पूर्वावस्था में विपरीत ध्रुवों पर जाती हैं।"],
 chiasma:["Crossing over (chiasma)","जीन विनिमय (किएज़्मा)","In meiosis I, homologous chromosomes pair up and swap pieces. The new combinations (recombination) make every gamete different — a source of variation.","अर्धसूत्री-I में समजात गुणसूत्र जोड़ी बनाकर टुकड़े अदल-बदल करते हैं; नए संयोजन हर युग्मक को अलग बनाते हैं — विविधता का स्रोत।"]};
const D_ST=[
["1","Interphase: getting ready","अंतरावस्था: तैयारी","Before dividing the cell grows and copies its DNA (S phase), so every chromosome now has two identical sister chromatids. The chromosomes are long, thin threads (chromatin) inside the nucleus.","विभाजन से पहले कोशिका बढ़ती है और अपना DNA दोहराती है (S-प्रावस्था), इसलिए हर गुणसूत्र में दो समान सहोदर क्रोमैटिड हैं; गुणसूत्र केंद्रक में लंबे पतले धागे (क्रोमैटिन) हैं।","Animated · 2n = 4 model",11],
["2","Mitosis · Prophase","समसूत्री · पूर्वावस्था","The chromosomes coil up and become short and thick — visible X shapes. The nuclear envelope and nucleolus disappear; the centrioles move to the two poles and spindle fibres start to form.","गुणसूत्र कुंडलित होकर छोटे व मोटे (X आकार) हो जाते हैं; केंद्रक आवरण व केंद्रिका लुप्त होते हैं; तारककाय दोनों ध्रुवों पर जाती हैं और तर्कु तंतु बनने लगते हैं।","Animated",12],
["3","Mitosis · Metaphase","समसूत्री · मध्यावस्था","Spindle fibres line all the chromosomes up on the equator (metaphase plate), one chromatid facing each pole. This is the best stage to count and photograph chromosomes.","तर्कु तंतु सभी गुणसूत्रों को मध्य रेखा (मध्यावस्था पट्टिका) पर पंक्ति में लाते हैं, प्रत्येक की एक क्रोमैटिड प्रत्येक ध्रुव की ओर; गुणसूत्र गिनने व चित्र लेने का सर्वोत्तम चरण।","Animated",12],
["4","Mitosis · Anaphase","समसूत्री · पश्चावस्था","The centromeres split and the spindle shortens: the sister chromatids are pulled to opposite poles. Each pole now receives an identical, complete set of chromosomes.","सेंट्रोमियर टूटते हैं और तर्कु छोटा होता है: सहोदर क्रोमैटिड विपरीत ध्रुवों पर खिंच जाते हैं; प्रत्येक ध्रुव को गुणसूत्रों का एक समान, पूरा समूह मिलता है।","Animated",12],
["5","Telophase and cytokinesis","अंत्यावस्था व कोशिकाद्रव्य-विभाजन","Nuclear envelopes re-form round each set, the chromosomes uncoil, and the cytoplasm pinches in two (cytokinesis). Result: 2 daughter cells, identical to each other and to the parent (2n = 4). Used for growth and repair.","प्रत्येक समूह के चारों ओर केंद्रक आवरण पुनः बनता है, गुणसूत्र खुलते हैं और कोशिकाद्रव्य बीच से दो भागों में बँटता है; परिणाम: 2 संतति कोशिकाएँ, परस्पर व जनक के समान (2n = 4); वृद्धि व मरम्मत हेतु।","Animated",13],
["6","Meiosis I · Prophase I: pairing and crossing over","अर्धसूत्री-I · पूर्वावस्था-I: जोड़ी व विनिमय","Now a cell that will make gametes. Homologous chromosomes (red + blue) find each other and pair up as a tetrad. They swap pieces at crossing-over points (chiasmata) — new gene combinations.","अब ऐसी कोशिका जो युग्मक बनाएगी: समजात गुणसूत्र (लाल + नीला) एक-दूसरे को पहचानकर चतुष्क (टेट्राड) में जुड़ते हैं और किएज़्मा पर टुकड़े अदल-बदल करते हैं — नए जीन-संयोजन।","Animated · schematic",14],
["7","Meiosis I: homologues separate","अर्धसूत्री-I: समजात अलग होते हैं","The pairs line up on the equator and then the whole homologous chromosomes (not chromatids) are pulled apart. Two cells form, each with only 2 chromosomes (n = 2): the chromosome number is halved. The reduction division.","जोड़े मध्य रेखा पर आते हैं और फिर पूरे समजात गुणसूत्र (क्रोमैटिड नहीं) अलग खिंचते हैं; दो कोशिकाएँ बनती हैं जिनमें केवल 2 गुणसूत्र (n = 2) हैं: संख्या आधी — न्यूनीकरण विभाजन।","Animated",14],
["8","Meiosis II: chromatids separate","अर्धसूत्री-II: क्रोमैटिड अलग होते हैं","Each cell divides again like mitosis: the sister chromatids split. Result: 4 genetically different haploid cells (n = 2) — the gametes (sperm or egg).","प्रत्येक कोशिका समसूत्री की तरह फिर बँटती है: सहोदर क्रोमैटिड अलग होते हैं; परिणाम: 4 आनुवंशिक रूप से भिन्न अगुणित कोशिकाएँ (n = 2) — युग्मक (शुक्राणु या अंडाणु)।","Animated",14],
["9","Mitosis vs meiosis","समसूत्री बनाम अर्धसूत्री","Mitosis: 1 division → 2 identical diploid cells (growth, repair, asexual reproduction). Meiosis: 2 divisions → 4 different haploid cells (gametes). At fertilisation two haploid gametes restore the diploid number.","समसूत्री: 1 विभाजन → 2 समान द्विगुणित कोशिकाएँ (वृद्धि, मरम्मत, अलैंगिक जनन)। अर्धसूत्री: 2 विभाजन → 4 भिन्न अगुणित कोशिकाएँ (युग्मक); निषेचन पर दो अगुणित युग्मक द्विगुणित संख्या लौटाते हैं।","Comparison",14]];
function Mdivision(){sd=91;const n=new Ne;Ge(n,{key:1.9});Je(n,-6.5,90,.08);const g=new J;n.add(g);const org=[];const add=mkAdd(g,org);
 const M=new J,E=new J;M.position.set(-18,0,0);E.position.set(18,0,0);g.add(M);g.add(E);
 const cmem=(col,op)=>MAT(col,{opacity:op,roughness:.4,clearcoat:.2,envMapIntensity:.4,sheen:0,depthWrite:!1,bumpScale:.05,emissive:0x302020,emissiveIntensity:.15});
 const cellMat=cmem(0xf3c9b8,.22),envMat=MAT(0x8d92e6,{opacity:.4,roughness:.4,clearcoat:.2,envMapIntensity:.4,sheen:0,depthWrite:!1,emissive:0x1b2160,emissiveIntensity:.25});
 const mkCell=(par,r,x,y)=>add("cell9",sph(r,.03,1.4,1,1,1,36,48,Math.abs(x*3+y)|0),cellMat,[x,y,0],{parent:par,ns:1});
 const mkEnv=(par,r,x,y)=>add("nuc9",sph(r,.03,1.5,1,1,1,32,44,2),envMat,[x,y,0],{parent:par,ns:1});
 /* membranes */
 const mBig=mkCell(M,5.0,0,0),mA=mkCell(M,3.1,0,3.4),mB=mkCell(M,3.1,0,-3.4),mNuc=mkEnv(M,3.4,0,0),mNA=mkEnv(M,1.9,0,3.5),mNB=mkEnv(M,1.9,0,-3.5);
 const eBig=mkCell(E,5.0,0,0),eT=mkCell(E,3.0,0,3.3),eBt=mkCell(E,3.0,0,-3.3),eTL=mkCell(E,1.95,-3.1,3.3),eTR=mkCell(E,1.95,3.1,3.3),eBL=mkCell(E,1.95,-3.1,-3.3),eBR=mkCell(E,1.95,3.1,-3.3),eNuc=mkEnv(E,3.4,0,0);
 /* chromatids */
 const CL=[0xe0453a,0x3a86e0,0xe0453a,0x3a86e0],LEN=[1.6,1.6,1.0,1.0],HOME=[[-1.5,1.0],[1.4,1.1],[-1.1,-1.2],[1.6,-.9]],RH=[.5,-.4,1.2,-.9];
 const mkChr=(par)=>{const L=[];for(let k=0;k<8;k++){const i=k>>1;const grp=new J;par.add(grp);const mat=MAT(CL[i],{roughness:.45,clearcoat:.3,envMapIntensity:.4,sheen:0,bumpScale:.2,emissive:CL[i]===0xe0453a?0x3a0a08:0x08203a,emissiveIntensity:.35});
  const body=add("chrom9",sph(1,0,1,1,1,1,14,18),mat,[0,0,0],{parent:grp,ns:1});const kin=add("chrom9",sph(.2,0,1,1,1,1,10,12),new bt({color:0xffffff}),[0,0,0],{parent:grp,ns:1});
  const capM=new bt({color:CL[i]===0xe0453a?0x3a86e0:0xe0453a});const cap=add("chiasma",sph(.3,0,1,1,1.1,1,10,14),capM,[0,LEN[i]*.78,0],{parent:grp,ns:1});cap.visible=!1;L.push({grp,body,kin,cap,capM,mat,i,side:k&1?1:-1,L:LEN[i]})}return L};
 const cM=mkChr(M),cE=mkChr(E);
 /* centrioles + spindle */
 const cenM=MAT(0x7ac05a,{roughness:.4,emissive:0x1f3a08,emissiveIntensity:.3,envMapIntensity:.4});const cenMs=[M,E].map(par=>[1,-1].map(sg=>add("cen9",new Xe(.16,.16,.5,10),cenM,[0,sg*4.4,0],{parent:par,ns:1})));
 const spM=MAT(0x9fd0a8,{roughness:.5,opacity:.7,depthWrite:!1,emissive:0x0f3a22,emissiveIntensity:.25});
 const mkSp=(par)=>{const L=[];for(let k=0;k<8;k++){const m=add("spindle",new Xe(.028,.028,1,6),spM,[0,0,0],{parent:par,ns:1});m.visible=!1;L.push(m)}return L};
 const spMs=mkSp(M),spEs=mkSp(E);
 const up=c(0,1,0);
 const setSp=(L,cr,show,poles)=>{L.forEach((m,k)=>{m.visible=show;if(!show)return;const t=cr[k],pole=c(0,poles*(k&1?-1:1)*0+(k&1?-4.4:4.4),0);const a=c(t.grp.position.x,t.grp.position.y,0),d=pole.clone().sub(a),len=d.length();m.position.copy(a.clone().add(pole).multiplyScalar(.5));m.scale.set(1,len,1);m.quaternion.setFromUnitVectors(up,d.normalize())})};
 /* state helpers */
 const EQ=[[-2.5,0],[-.85,0],[.85,0],[2.5,0]];
 const lerp2=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t)];
 const apply=(L,k,x,y,rot,cond,sep,t,thick=1)=>{const o=L[k],side=o.side;const sp=sep*1.1;const px=Math.cos(rot),py=Math.sin(rot);o.grp.position.set(x+px*side*sep*.12,y+py*side*sep*.12,0);o.grp.rotation.z=rot+side*sp*(cond>.5?1:.0)+(1-cond)*Math.sin(t*2.2+k*1.7)*.35;
  const th=lerp(.1,.3,cond)*thick,ln=o.L*lerp(1.45,1,cond);o.body.scale.set(th,ln,th);o.body.material.opacity=lerp(.8,1,cond);o.body.material.transparent=!0;o.kin.visible=cond>.6;o.kin.scale.setScalar(1)};
 const mitosis=(s,p,t)=>{const A=s,Pp=p;for(let k=0;k<8;k++){const i=k>>1,h=HOME[i];let x=h[0]*.9,y=h[1]*.9,rot=RH[i],cond=0,sep=0,pole=0;
   if(s===0){sep=.3*p;cond=0}else if(s===1){x=h[0]*.9+(h[0]*.1)*p;y=h[1]*.9+(h[1]*.1)*p;cond=p;sep=.3+.1*p;rot=RH[i]}
   else if(s===2){const e=EQ[i],q=cl(p*1.3,0,1);const pq=lerp2(h,e,q);x=pq[0];y=pq[1];rot=lerp(RH[i],0,q);cond=1;sep=.4}
   else if(s===3){const e=EQ[i];x=e[0];y=e[1];rot=0;cond=1;sep=.4+.0;pole=3.4*p}
   else{const e=EQ[i];x=e[0]*lerp(1,.6,p);y=e[1];rot=0;cond=lerp(1,.35,p);sep=.4;pole=3.4+.2*p}
   const side=k&1?1:-1,yy=y+side*pole;apply(cM,k,x,yy,rot,cond,(s>=3?0:sep),t);if(s>=3){cM[k].grp.rotation.z=rot+side*(s===3?-.18*Math.sin(p*PI)*0:0)}}};
 const meiosis=(s,p,t)=>{const PAIR=[[-1.8,.4],[-1.0,.4],[1.0,-.4],[1.8,-.4]];for(let k=0;k<8;k++){const i=k>>1,h=HOME[i],side=k&1?1:-1;let x,y,rot,cond,sep,fx=0;
   if(s<=5){cond=s<5?cl(p*0+(s===5?1:0),0,1):cl(p*3,0,1);const pr=cl((p-.25)/.45,0,1),q=lerp2(h,PAIR[i],pr);x=q[0];y=q[1];rot=lerp(RH[i],0,pr);sep=.3+.2*pr;cond=cl(p*3,0,1)}
   else if(s===6){cond=1;sep=.5;const a=cl(p/.35,0,1),b=cl((p-.35)/.45,0,1),c2=cl((p-.8)/.2,0,1);const eqy=0;x=PAIR[i][0];y=lerp(PAIR[i][1],eqy,a);const dir=(i%2===0)?1:-1;y=y+dir*3.3*b;x=lerp(x,(i%2===0?-.5:-.5)+(i>1?1:0),c2);rot=0}
   else{cond=1;const a=cl((p-.0)/.3,0,1),b=cl((p-.35)/.4,0,1);const dir=(i%2===0)?1:-1,cy=dir*3.3,cx=(i>1?.5:-.5);x=cx+side*b*2.7;y=cy;rot=0;sep=.5*(1-b)}
   apply(cE,k,x,y,rot,cond,sep,t,.95);
   const cross=s===5?cl((p-.7)/.3,0,1):(s>5?1:0);const inner=(i===0&&side===1)||(i===1&&side===-1)||(i===2&&side===1)||(i===3&&side===-1);cE[k].cap.visible=inner&&cross>.5}};
 /* ---- cell shapes by step ---- */
 const cellsM=(s,p)=>{const big=s<4?1:(s===4?1-cl((p-.35)/.4,0,1):0),two=s===4?cl((p-.35)/.4,0,1):(s>4?1:0);mBig.visible=big>.02;mBig.scale.set(1,1+(s===3?.35*p:s===4?.45:0),1);mA.visible=mB.visible=two>.02;mA.position.y=3.4*two*1.0;mB.position.y=-3.4*two*1.0;mA.scale.setScalar(.6+.4*two);mB.scale.setScalar(.6+.4*two);
  const nv=s===0?1:s===1?1-cl((p-.3)/.5,0,1):0;mNuc.visible=nv>.02;envMat.opacity=.4*nv||.4;mNuc.material.opacity=.4*nv;mNA.visible=mNB.visible=s===4&&p>.1||s>4;};
 const cellsE=(s,p)=>{const k1=cl((p-.35)/.35,0,1),k2=cl((p-.7)/.2,0,1);
  eBig.visible=s<=5||(s===6&&p<.7);eBig.scale.set(1,s===6?1+.35*k1:1,1);eNuc.visible=s===5&&p<.35;
  const two=(s===6&&p>=.7)||(s===7&&p<.7);eT.visible=eBt.visible=two;const g2=s===6?.6+.4*k2:1;eT.scale.setScalar(g2);eBt.scale.setScalar(g2);
  const four=(s===7&&p>=.7)||s>=8;[eTL,eTR,eBL,eBR].forEach(m=>{m.visible=four;m.scale.setScalar(s===7?.6+.4*k2:1)})};
 const cams=[[c(-18,-.6,17),c(-18,-.6,0)],[c(-18,-.6,17),c(-18,-.6,0)],[c(-18,-.6,17),c(-18,-.6,0)],[c(-18,-.8,19),c(-18,-.8,0)],[c(-18,-1.4,24),c(-18,-1.4,0)],[c(18,-.6,17),c(18,-.6,0)],[c(18,-1.5,24),c(18,-1.5,0)],[c(18,-1.5,25),c(18,-1.5,0)],[c(0,-1.5,40),c(0,-1.5,0)]];
 const camK=["Interphase","Prophase","Metaphase","Anaphase","Telophase","Meiosis I prophase","Meiosis I","Meiosis II","Compare"];
 const show={};const ids=["cell9","nuc9","chrom9","spindle","cen9","chiasma"];ids.forEach(i=>show[i]=[1,1,1,1,1,1,1,1,1]);
 const base={cell9:.22,nuc9:.4,chrom9:1,spindle:.7,cen9:1,chiasma:1};
 const Lw=(par,p)=>()=>par.localToWorld(c(...p));
 const labels=[["d-nu","Nucleus (intact)","केंद्रक (साबुत)",Lw(M,[2.6,2.4,0]),[0]],["d-ch","Chromatin: long thin threads","क्रोमैटिन: लंबे पतले धागे",Lw(M,[-2,1.5,0]),[0]],["d-ce","Centrioles duplicated","तारककाय द्विगुणित",Lw(M,[1,4.5,0]),[0,1]],["d-sc","2 sister chromatids","2 सहोदर क्रोमैटिड",Lw(M,[1.4,.4,0]),[0]],
  ["d-co","Condensed chromosomes (X)","संघनित गुणसूत्र (X)",Lw(M,[-1.4,1.6,0]),[1]],["d-ne","Envelope breaking down","आवरण टूटता हुआ",Lw(M,[2.9,1.8,0]),[1]],["d-po","Centrioles move to poles","तारककाय ध्रुवों पर",Lw(M,[1,-4.5,0]),[1,2]],
  ["d-eq","Equator: chromosomes line up","मध्य रेखा: गुणसूत्र पंक्ति में",Lw(M,[3.2,0,0]),[2]],["d-sp","Spindle fibres","तर्कु तंतु",Lw(M,[-1.6,2.6,0]),[2,3]],
  ["d-an","Chromatids pulled apart","क्रोमैटिड अलग खिंचते",Lw(M,[2.8,2.6,0]),[3]],["d-pl","Poles: identical sets","ध्रुव: समान समूह",Lw(M,[-3,-3.2,0]),[3]],
  ["d-d1","Daughter cell 1 (2n = 4)","संतति कोशिका 1 (2n = 4)",Lw(M,[3.4,3.6,0]),[4]],["d-d2","Daughter cell 2 (2n = 4)","संतति कोशिका 2 (2n = 4)",Lw(M,[3.4,-3.6,0]),[4]],["d-ne2","Nuclei re-form · chromosomes uncoil","केंद्रक पुनः बनते",Lw(M,[-3.4,0,0]),[4]],
  ["e-ho","Homologous pair (tetrad)","समजात जोड़ी (टेट्राड)",Lw(E,[-1.4,2.4,0]),[5]],["e-ch","Crossing over (chiasma)","जीन विनिमय (किएज़्मा)",Lw(E,[-1.4,1.8,0]),[5]],["e-mo","Maternal (red) · paternal (blue)","मातृक (लाल) · पैतृक (नीला)",Lw(E,[2.6,1.2,0]),[5]],
  ["f-eq","Pairs on the equator","जोड़े मध्य रेखा पर",Lw(E,[3.4,.2,0]),[6]],["f-se","Whole homologues separate","समजात गुणसूत्र अलग",Lw(E,[2.6,3.4,0]),[6]],["f-n2","Two cells: n = 2 (halved)","दो कोशिकाएँ: n = 2 (आधी)",Lw(E,[-3.6,0,0]),[6]],
  ["g-m2","Meiosis II: chromatids split","अर्धसूत्री-II: क्रोमैटिड टूटते",Lw(E,[0,5.4,0]),[7]],["g-4","4 different haploid gametes","4 भिन्न अगुणित युग्मक",Lw(E,[0,-5.6,0]),[7]],
  ["c-mi","MITOSIS → 2 identical (2n)","समसूत्री → 2 समान (2n)",Lw(M,[0,5.8,0]),[8]],["c-me","MEIOSIS → 4 different (n)","अर्धसूत्री → 4 भिन्न (n)",Lw(E,[0,5.8,0]),[8]],["c-pu","Growth · repair","वृद्धि · मरम्मत",Lw(M,[0,-5.8,0]),[8]],["c-ga","Gametes · variation","युग्मक · विविधता",Lw(E,[0,-5.8,0]),[8]]];
 const r0=run({n,g,org,show,base,ST:D_ST,cams,camK,labels,
  hud:(s,t)=>s<=4?["2n = 4 · DNA copied (S phase)","2n = 4 · chromosomes condensed","2n = 4 · chromosomes at equator","2n = 4 each pole · 4 chromatids to each side","2 cells · 2n = 4 each"][s]:s===5?"2n = 4 · tetrad · crossing over":s===6?"n = 2 per cell · chromosomes still doubled":s===7?"4 cells · n = 2 · single chromatids":"Mitosis: 2 cells 2n | Meiosis: 4 cells n",
  frame:(s,t)=>{const p=(t*.07)%1,pM=s<=4?p:1,sM=s<=4?s:4,pE=s>=5&&s<=7?p:(s>7?1:0),sE=s>=5?s:5;
   M.rotation.y=0;E.rotation.y=0;
   const ms=s<=4?s:4,mp=s<=4?p:1;mitosis(ms,mp,t);cellsM(ms,mp);
   const es=s<5?5:(s>7?7:s),ep=s<5?0:(s>7?1:p);meiosis(es,ep,t);cellsE(es,ep);
   setSp(spMs,cM,ms>=1&&ms<=3&&s<=4||false,4.4);setSp(spEs,cE,false,4.4);
   cenMs[0].forEach((m,j)=>{const sg=j?-1:1,pe=ms===0?0:ms===1?p:1;m.position.set(sg*0,sg*lerp(1.2,4.4,pe),0);m.rotation.z=0;m.visible=s<=4});
   cenMs[1].forEach((m,j)=>{const sg=j?-1:1;m.position.set(0,sg*4.4,0);m.visible=s>=5&&s<=6});
   const showE=s>=5;E.visible=showE||s>=0;M.visible=!0;
   if(s<5){E.visible=!1}else{E.visible=!0}
   if(s===8){M.visible=!0;E.visible=!0}},
  predict:{q:"How many daughter cells and what chromosome number result from meiosis of a diploid (2n = 4) cell?",opts:[["2 cells, 2n = 4",!1,"That is mitosis."],["4 cells, n = 2",!0,"Correct — two divisions halve the chromosome number."],["4 cells, 2n = 4",!1,"Meiosis halves the number."]]}});
 const ap=r0.apply;r0.apply=(s,k,t)=>{ap(s,k,t);cellMat.opacity=.22;const nv=envMat;};return r0}
Q_("ix1/division3d",[["During which phase do chromosomes line up at the equator?","किस प्रावस्था में गुणसूत्र मध्य रेखा पर आते हैं?",["Prophase","Metaphase","Anaphase","Telophase"],1,"Metaphase."],["Mitosis produces…","समसूत्री विभाजन से बनती हैं…",["2 identical daughter cells","4 different cells","2 haploid cells","1 cell"],0,"2n → 2 × 2n."],["Crossing over occurs in…","जीन विनिमय होता है…",["Mitosis","Prophase I of meiosis","Anaphase II","Interphase"],1,"Homologous chromosomes swap segments."],["Meiosis results in…","अर्धसूत्री से बनती हैं…",["2 diploid cells","4 haploid cells","4 diploid cells","1 haploid cell"],1,"Two divisions → 4 gametes."],["Which type of division is used for growth and repair?","वृद्धि व मरम्मत के लिए कौन-सा विभाजन?",["Meiosis","Mitosis","Fertilisation","Budding only"],1,"Mitosis keeps the chromosome number."]]);
Px["ix1/division3d"]=[["Your body makes about 2 million new red blood cells every second by mitosis.","आपका शरीर समसूत्री से प्रति सेकंड लगभग 20 लाख नई लाल रक्त कोशिकाएँ बनाता है।"],["Crossing over means no two sperm — or siblings, except identical twins — carry the same gene combination.","जीन विनिमय के कारण दो शुक्राणु — या (समान जुड़वाँ को छोड़) भाई-बहन — समान जीन-संयोजन नहीं रखते।"]];
{const Ld=Hj.find(h=>h.kp==="ix1").topics,i=Ld.findIndex(x=>x.id==="division");Ld.splice(i<0?Ld.length:i+1,0,{id:"division3d",title:"Cell division: mitosis & meiosis — detailed 3D",hi:"कोशिका विभाजन: समसूत्री व अर्धसूत्री — विस्तृत 3D",build:Mdivision,ncert:"Class IX/X · cell division"})}
/* ===================== SET 10: IONIC BOND — NaCl ===================== */
const KIND10={
 Na:["Sodium atom (Na)","सोडियम परमाणु (Na)","11 protons, 11 electrons: shells 2, 8, 1. One electron alone in the outer shell — easy to lose.","11 प्रोटॉन, 11 इलेक्ट्रॉन: कक्षाएँ 2, 8, 1; बाहरी कक्षा में अकेला एक इलेक्ट्रॉन — आसानी से निकल जाता है।"],
 Cl:["Chlorine atom (Cl)","क्लोरीन परमाणु (Cl)","17 protons, 17 electrons: shells 2, 8, 7. One electron short of a full octet — it wants to gain one.","17 प्रोटॉन, 17 इलेक्ट्रॉन: कक्षाएँ 2, 8, 7; अष्टक में एक इलेक्ट्रॉन कम — एक पाना चाहता है।"],
 e:["Electron (−)","इलेक्ट्रॉन (−)","Negative particle. In ionic bonding it is TRANSFERRED from the metal atom to the non-metal atom.","ऋणावेशित कण; आयनिक बंध में धातु परमाणु से अधातु परमाणु को स्थानांतरित होता है।"],
 Nap:["Sodium ion (Na⁺)","सोडियम आयन (Na⁺)","After losing one electron: 11 protons, 10 electrons (2, 8) — like neon, a stable octet, and charge +1. It is SMALLER than the atom.","एक इलेक्ट्रॉन खोने पर: 11 प्रोटॉन, 10 इलेक्ट्रॉन (2, 8) — नियॉन जैसा स्थिर अष्टक, आवेश +1; परमाणु से छोटा।"],
 Clm:["Chloride ion (Cl⁻)","क्लोराइड आयन (Cl⁻)","After gaining one electron: 17 protons, 18 electrons (2, 8, 8) — like argon, stable octet, charge −1. It is LARGER than the atom.","एक इलेक्ट्रॉन पाने पर: 17 प्रोटॉन, 18 इलेक्ट्रॉन (2, 8, 8) — आर्गन जैसा, आवेश −1; परमाणु से बड़ा।"],
 bond:["Ionic bond","आयनिक बंध","The strong electrostatic attraction between oppositely charged ions (Na⁺ and Cl⁻).","विपरीत आवेशित आयनों (Na⁺ व Cl⁻) के बीच प्रबल स्थिर-विद्युत आकर्षण।"],
 lat:["Crystal lattice","क्रिस्टल जालक","Each Na⁺ is surrounded by 6 Cl⁻ and each Cl⁻ by 6 Na⁺ in a repeating cube: that is why salt crystals are cubes.","प्रत्येक Na⁺ को 6 Cl⁻ और प्रत्येक Cl⁻ को 6 Na⁺ घेरते हैं — घन में दोहराव; इसीलिए नमक के क्रिस्टल घनाकार होते हैं।"],
 nuc10:["Nucleus","नाभिक","Positive centre: protons and neutrons. It does not change in the reaction — only electrons move.","धनावेशित केंद्र: प्रोटॉन व न्यूट्रॉन; अभिक्रिया में नहीं बदलता — केवल इलेक्ट्रॉन चलते हैं।"],
 shell:["Electron shell","इलेक्ट्रॉन कक्षा","K holds 2, L holds 8, M holds 8 (for the first 20 elements).","K में 2, L में 8, M में 8 (पहले 20 तत्वों के लिए)।"],
 bulb:["Conductivity test","चालकता परीक्षण","Solid NaCl does not conduct (ions are fixed). Molten or dissolved NaCl conducts because the ions are free to move.","ठोस NaCl चालक नहीं (आयन बँधे हैं); गलित या घुला NaCl चालक है क्योंकि आयन स्वतंत्र हैं।"]};
const I_ST=[
["1","Two atoms: sodium and chlorine","दो परमाणु: सोडियम व क्लोरीन","Sodium (2, 8, 1) is a soft metal with ONE outer electron; chlorine (2, 8, 7) is a gas with SEVEN. Atoms are most stable with a full outer shell (octet).","सोडियम (2, 8, 1) नरम धातु है — बाहरी कक्षा में एक इलेक्ट्रॉन; क्लोरीन (2, 8, 7) गैस है — सात; पूर्ण बाहरी कक्षा (अष्टक) वाले परमाणु सबसे स्थिर होते हैं।","Hand-modelled · not to scale",10],
["2","The electron jumps","इलेक्ट्रॉन की छलाँग","Sodium gives its outer electron to chlorine. This transfer of an electron is what 'ionic' bonding means.","सोडियम अपना बाहरी इलेक्ट्रॉन क्लोरीन को दे देता है; इलेक्ट्रॉन का यही स्थानांतरण 'आयनिक' बंध है।","Animated · schematic",12],
["3","Two ions are born","दो आयन बने","Na lost an electron: Na⁺ (2, 8), smaller, +1. Cl gained one: Cl⁻ (2, 8, 8), larger, −1. Both now have a stable octet.","Na ने इलेक्ट्रॉन खोया: Na⁺ (2, 8), छोटा, +1; Cl ने पाया: Cl⁻ (2, 8, 8), बड़ा, −1; दोनों अब स्थिर अष्टक वाले।","Hand-modelled",11],
["4","Opposite charges attract","विपरीत आवेश आकर्षित","The positive and negative ions pull together — the electrostatic attraction between them is the ionic bond. They snap together to form NaCl.","धनात्मक व ऋणात्मक आयन खिंचकर मिलते हैं — उनके बीच का स्थिर-विद्युत आकर्षण ही आयनिक बंध है; वे जुड़कर NaCl बनाते हैं।","Animated",11],
["5","Billions of ions: the crystal","अरबों आयन: क्रिस्टल","Ions pack into a 3-D lattice: each Na⁺ touches 6 Cl⁻ and vice-versa. The repeating cube gives salt its cubic crystals and high melting point (801 °C).","आयन त्रिविम जालक में सजते हैं: प्रत्येक Na⁺ 6 Cl⁻ को छूता है और उलटा भी; दोहराता घन नमक के घनाकार क्रिस्टल व उच्च गलनांक (801 °C) देता है।","Hand-modelled · enlarged ~10⁸×",13],
["6","Properties of ionic compounds","आयनिक यौगिकों के गुण","Hard and brittle crystals, high melting and boiling points, soluble in water. Solid: ions fixed → no conduction. Molten or dissolved: ions free → conducts electricity.","कठोर व भंगुर क्रिस्टल, उच्च गलनांक/क्वथनांक, जल में विलेय; ठोस में आयन बँधे → चालक नहीं; गलित/घोल में आयन स्वतंत्र → विद्युत चालक।","Animated",13],
["7","Other ionic compounds","अन्य आयनिक यौगिक","MgCl₂: Mg gives TWO electrons, one to each of two Cl. CaO: Ca gives two electrons to O. The formula comes from balancing charges: total + = total −.","MgCl₂: Mg दो इलेक्ट्रॉन देता है, दो Cl को एक-एक; CaO: Ca दो इलेक्ट्रॉन O को; सूत्र आवेश-संतुलन से: कुल + = कुल −।","Hand-modelled",12]];
function Mionic(){sd=101;const n=new Ne;Ge(n,{key:1.9});Je(n,-6,90,.08);const g=new J;n.add(g);const org=[];const add=mkAdd(g,org);
 const NA=new J,CL=new J,LT=new J,MG=new J;NA.position.set(-6,0,0);CL.position.set(6,0,0);LT.position.set(0,-30,0);MG.position.set(0,-60,0);[NA,CL,LT,MG].forEach(x=>g.add(x));
 const eM=MAT(0x3b82f6,{roughness:.25,clearcoat:.9,emissive:0x1033aa,emissiveIntensity:.9,envMapIntensity:.6,sheen:0}),sh=MAT(0x9fb3cf,{opacity:.4,roughness:.4,sheen:0,depthWrite:!1,envMapIntensity:.3,emissive:0x202a3a,emissiveIntensity:.2});
 const atom=(par,col,rn,shells,idNuc)=>{const nm=MAT(col,{roughness:.3,clearcoat:.8,emissive:col*0+0x303030,emissiveIntensity:.35,envMapIntensity:.5,sheen:0});add(idNuc,sph(rn,.03,2,1,1,1,28,36),nm,[0,0,0],{parent:par});const es=[];shells.forEach((cnt,k)=>{const R_=rn+1.5+1.3*k;const ring=add("shell",torus(R_,.025),sh,[0,0,0],{parent:par,rot:[PI/2,0,0],ns:1});for(let i=0;i<cnt;i++){const m=add("e",sph(.2,0,1,1,1,1,12,16),eM,[0,0,0],{parent:par,ns:1});es.push({m,k,R_,i,cnt})}});return es};
 const naE=atom(NA,0xf2a63a,1.1,[2,8,1],"Na"),clE=atom(CL,0x58c46a,1.3,[2,8,7],"Cl");
 /* placing rule: ions drawn with updated shell contents via a state function */
 let naOut=!0;const spot=(o,t,shellsFn)=>{const w=(.7/(o.k+1)),a=o.i/o.cnt*TAU+t*w;o.m.position.set(Math.cos(a)*o.R_,Math.sin(a)*o.R_,0)};
 const jump=naE[naE.length-1];const ex=clE.filter(o=>o.k===2);const gap=clE.find(o=>o.k===2&&o.i===0);
 /* the 9th electron slot on Cl (M shell, 8th place) for the incoming electron */
 const inc=add("e",sph(.2,0,1,1,1,1,12,16),MAT(0xffd23f,{roughness:.25,clearcoat:.9,emissive:0xaa7a00,emissiveIntensity:.9,sheen:0}),[0,0,0],{parent:g,ns:1});
 /* charge tags */
 const tag=(par,x,y,txt,col)=>{const m=add("bond",sph(.01,0,1,1,1,1,4,4),new bt({color:col,transparent:!0,opacity:0}),[x,y,0],{parent:par,ns:1});m.visible=!1;return m};
 const bondL=add("bond",new Xe(.09,.09,1,8),new bt({color:0xff5a5a,transparent:!0,opacity:.7}),[0,0,0],{parent:g,ns:1});bondL.visible=!1;const nap=add("Nap",sph(1.1,.02,2,1,1,1,24,30),MAT(0xf2a63a,{roughness:.3,clearcoat:.8,emissive:0x5a3a00,emissiveIntensity:.5,opacity:.0,depthWrite:!1,sheen:0}),[0,0,0],{parent:NA,ns:1});nap.visible=!1;
 /* ---------- lattice ---------- */
 const NL=4,SP=2.3,nM=MAT(0xf2a63a,{roughness:.3,clearcoat:.7,emissive:0x4a3000,emissiveIntensity:.35,envMapIntensity:.5,sheen:0}),cM=MAT(0x58c46a,{roughness:.3,clearcoat:.7,emissive:0x0a3a14,emissiveIntensity:.35,envMapIntensity:.5,sheen:0});const ions=[];
 for(let x=0;x<NL;x++)for(let y=0;y<NL;y++)for(let z=0;z<NL;z++){const na=(x+y+z)%2===0,p=[(x-1.5)*SP,(y-1.5)*SP,(z-1.5)*SP];const m=add(na?"Nap":"Clm",sph(na?.55:.8,0,1,1,1,1,16,20),na?nM:cM,p,{parent:LT,ns:1});ions.push({m,na,p})}
 const bondM=MAT(0xdfe6f0,{roughness:.5,opacity:.5,depthWrite:!1,sheen:0});
 for(let x=0;x<NL;x++)for(let y=0;y<NL;y++)for(let z=0;z<NL;z++){[[1,0,0],[0,1,0],[0,0,1]].forEach(d=>{if(x+d[0]<NL&&y+d[1]<NL&&z+d[2]<NL)add("lat",tube([c((x-1.5)*SP,(y-1.5)*SP,(z-1.5)*SP),c((x+d[0]-1.5)*SP,(y+d[1]-1.5)*SP,(z+d[2]-1.5)*SP)],.045,6),bondM,[0,0,0],{parent:LT,ns:1})})}
 /* conductivity test: beaker + bulb */
 const bulb=add("bulb",sph(.7,0,1,1,1,1,20,26),MAT(0xfff2b0,{roughness:.2,emissive:0x000000,emissiveIntensity:0,opacity:.9,sheen:0}),[7,4.5,0],{parent:LT,ns:1});
 const wire=add("bulb",tube([c(7,3.8,0),c(7,1.6,0),c(5,1.2,0),c(2.6,1.2,0)],.05,6),MAT(0x333333,{roughness:.5,sheen:0}),[0,0,0],{parent:LT,ns:1});
 const cur=new J;LT.add(cur);const NC=20,cur_=new Wn(new it(.11,8,6),new bt({color:0xffe45e}),NC);cur_.frustumCulled=!1;LT.add(cur_);const m4=new gt;
 /* ---------- MgCl2 / CaO ---------- */
 const mgM=MAT(0x9ad2ff,{roughness:.3,clearcoat:.8,emissive:0x103a5a,emissiveIntensity:.4,sheen:0}),oM=MAT(0xe86a5a,{roughness:.3,clearcoat:.8,emissive:0x4a1008,emissiveIntensity:.4,sheen:0});
 const mg=add("Nap",sph(1.1,0,1,1,1,1,24,30),mgM,[0,0,0],{parent:MG,ns:1}),cl1=add("Clm",sph(1.5,0,1,1,1,1,24,30),cM,[-4.6,0,0],{parent:MG,ns:1}),cl2=add("Clm",sph(1.5,0,1,1,1,1,24,30),cM,[4.6,0,0],{parent:MG,ns:1});
 [[-2.5,0],[2.5,0]].forEach(q=>add("e",sph(.2,0,1,1,1,1,12,16),eM,[q[0],.0,0],{parent:MG,ns:1}));
 const ca=add("Nap",sph(1.3,0,1,1,1,1,24,30),MAT(0xc9a0ff,{roughness:.3,clearcoat:.8,emissive:0x2a1050,emissiveIntensity:.4,sheen:0}),[0,-8,0],{parent:MG,ns:1}),ox=add("Clm",sph(1.6,0,1,1,1,1,24,30),oM,[4,-8,0],{parent:MG,ns:1});
 [[1.6,-8.3],[1.9,-7.7]].forEach(q=>add("e",sph(.2,0,1,1,1,1,12,16),eM,[q[0],q[1],0],{parent:MG,ns:1}));
 const cams=[[c(0,.8,19),c(0,0,0)],[c(0,1,19),c(0,0,0)],[c(0,.6,17),c(0,0,0)],[c(0,.6,14),c(0,0,0)],[c(10,-26,22),c(0,-30,0)],[c(5,-27,18),c(1.8,-28.6,0)],[c(0,-59,27),c(0,-63,0)]];
 const camK=["Atoms","Transfer","Ions","Attraction","Crystal","Conductivity","MgCl₂ · CaO"];
 const show={};const ids=["Na","Cl","e","shell","nuc10","Nap","Clm","bond","lat","bulb"];ids.forEach(i=>show[i]=[0,0,0,0,0,0,0]);const on=(i,ss)=>ss.forEach(x=>show[i][x]=1);
 on("Na",[0,1,2,3]);on("Cl",[0,1,2,3]);on("e",[0,1,2,3,6]);on("shell",[0,1,2,3]);on("Nap",[2,3,4,5,6]);on("Clm",[2,3,4,5,6]);on("bond",[3]);on("lat",[4,5]);on("bulb",[5]);
 const base={Na:1,Cl:1,e:1,shell:.4,nuc10:1,Nap:1,Clm:1,bond:1,lat:1,bulb:1};
 const Lw=(par,p)=>()=>par.localToWorld(c(...p));
 const labels=[["i-na","Sodium atom: 2, 8, 1","सोडियम परमाणु: 2, 8, 1",Lw(NA,[0,4.6,0]),[0]],["i-cl","Chlorine atom: 2, 8, 7","क्लोरीन परमाणु: 2, 8, 7",Lw(CL,[0,5.3,0]),[0]],["i-e1","1 outer electron (easy to lose)","1 बाहरी इलेक्ट्रॉन (आसानी से जाता)",Lw(NA,[3.4,2.9,0]),[0]],["i-e2","7 outer electrons (needs 1 more)","7 बाहरी इलेक्ट्रॉन (1 और चाहिए)",Lw(CL,[-4.6,3.4,0]),[0]],["i-ng","Nucleus (+11)","नाभिक (+11)",Lw(NA,[0,-1.3,0]),[0]],["i-nc","Nucleus (+17)","नाभिक (+17)",Lw(CL,[0,-1.5,0]),[0]],
  ["t-el","Electron transferred →","इलेक्ट्रॉन स्थानांतरित →",()=>jump.m.getWorldPosition(c()),[1]],["t-oc","Full octet now (2, 8, 8)","अब पूर्ण अष्टक (2, 8, 8)",Lw(CL,[0,5.3,0]),[2,3]],["t-na","Na⁺ (2, 8) · +1 · smaller","Na⁺ (2, 8) · +1 · छोटा",Lw(NA,[0,3.3,0]),[2,3]],["t-cl","Cl⁻ (2, 8, 8) · −1 · larger","Cl⁻ (2, 8, 8) · −1 · बड़ा",Lw(CL,[0,5.7,0]),[2,3]],["a-at","Attraction (+ −)","आकर्षण (+ −)",Lw(g,[0,.9,0]),[3]],["a-bo","IONIC BOND","आयनिक बंध",Lw(g,[0,-1.6,0]),[3]],
  ["l-na","Na⁺","Na⁺",Lw(LT,[-1.15,1.15,-1.15]),[4]],["l-cl","Cl⁻","Cl⁻",Lw(LT,[1.15,1.15,-1.15]),[4]],["l-6","6 neighbours each","प्रत्येक के 6 पड़ोसी",Lw(LT,[4.4,0,0]),[4]],["l-cu","Cubic lattice","घनाकार जालक",Lw(LT,[0,-4.4,0]),[4]],["l-mp","m.p. 801 °C","गलनांक 801 °C",Lw(LT,[-4.8,3.5,0]),[4]],
  ["c-so","Solid: ions fixed — bulb OFF","ठोस: आयन स्थिर — बल्ब बंद",Lw(LT,[-4.6,-4.4,0]),[5]],["c-mo","Molten/dissolved: ions move — bulb ON","गलित/घोल: आयन गतिशील — बल्ब चालू",Lw(LT,[4.4,-4.4,0]),[5]],["c-bu","Bulb","बल्ब",Lw(LT,[7,5.6,0]),[5]],
  ["m-mg","Mg²⁺ (loses 2 e⁻)","Mg²⁺ (2 e⁻ खोता)",Lw(MG,[0,2,0]),[6]],["m-cl","2 × Cl⁻","2 × Cl⁻",Lw(MG,[0,3.3,0]),[6]],["m-fo","MgCl₂: +2 balanced by 2 × (−1)","MgCl₂: +2 = 2 × (−1)",Lw(MG,[0,-2.6,0]),[6]],["m-ca","CaO: Ca²⁺ + O²⁻","CaO: Ca²⁺ + O²⁻",Lw(MG,[2,-5.4,0]),[6]]];
 const phase=t=>(t*.08)%1;
 return run({n,g,org,show,base,ST:I_ST,cams,camK,labels,
  hud:(s,t)=>s===0?"Na: 2,8,1 · Cl: 2,8,7":s===1?"Na → Na⁺ + e⁻   ·   Cl + e⁻ → Cl⁻":s===2?"Na⁺ (2,8) and Cl⁻ (2,8,8) · both octets complete":s===3?"Na⁺ + Cl⁻ → NaCl  (electrostatic attraction)":s===5?(phase(t)<.5?"Solid NaCl · ions fixed · bulb OFF":"Molten / dissolved NaCl · ions free · bulb ON"):"",
  frame:(s,t)=>{const ph=phase(t),f=s===1?cl(ph*1.5,0,1):s>=2?1:0,ez=f*f*(3-2*f);
   NA.visible=CL.visible=s<=3;MG.visible=s===6;LT.visible=s===4||s===5;
   const close=s===3?cl(ph*1.4,0,1):0;NA.position.x=-6+close*3.4;CL.position.x=6-close*3.4;NA.scale.setScalar(s>=2?.8:1);CL.scale.setScalar(s>=2?1.1:1);
   /* electrons orbit: Na outer electron leaves for Cl */
   naE.forEach(o=>{if(o===jump){const a=o.i/o.cnt*TAU+t*.35,startp=c(Math.cos(a)*o.R_,Math.sin(a)*o.R_,0).add(NA.position),endp=c(CL.position.x-4.0,1.6,0);const p=startp.clone().lerp(endp,ez);const q=p.clone().sub(NA.position);o.m.position.set(q.x,q.y+Math.sin(ez*PI)*2.0,0);o.m.visible=!0}else spot(o,t)});
   clE.forEach(o=>spot(o,t));inc.visible=!1;
   if(s>=2&&s<=3){jump.m.parent!==CL&&CL.add(jump.m);jump.m.position.set(Math.cos(t*.5)*(clE[0].R_+1.3*1+0)*1,Math.sin(t*.5)*(clE[0].R_+1.3),0);jump.m.parent===CL||0}else if(jump.m.parent!==NA){NA.add(jump.m)}
   /* ion size and glow */
   nap.visible=!1;bondL.visible=s===3;if(s===3){const a_=NA.position,b_=CL.position,dd_=b_.clone().sub(a_),L_=Math.max(.2,dd_.length()-4.6);bondL.position.copy(a_.clone().add(b_).multiplyScalar(.5));bondL.scale.set(.7+.4*Math.sin(t*6),L_,.7+.4*Math.sin(t*6));bondL.quaternion.setFromUnitVectors(c(0,1,0),dd_.normalize())}
   /* lattice: gentle vibration */
   ions.forEach((o,i)=>{o.m.position.set(o.p[0]+.05*Math.sin(t*3+i),o.p[1]+.05*Math.cos(t*2.7+i),o.p[2]+.05*Math.sin(t*2.2+i*2))});LT.rotation.y=s===4?t*.25:.4;LT.rotation.x=s===4?.35:.25;
   /* conductivity */
   const molten=s===5&&ph>=.5;ions.forEach((o,i)=>{if(s===5&&molten){o.m.position.x+=Math.sin(t*2+i)*.35;o.m.position.y+=Math.cos(t*1.8+i*1.3)*.35}});
   bulb.material.emissiveIntensity=molten?1.6:0;bulb.material.emissive.setHex(molten?0xffcc33:0x000000);
   for(let i=0;i<NC;i++){if(!(s===5&&molten)){m4.makeScale(0,0,0)}else{const q=((t*.3+i/NC)%1);let x,y;if(q<.5){x=2.6+q*2*4.4;y=1.2}else{x=7;y=1.2+(q-.5)*2*2.6}m4.makeScale(1,1,1);m4.setPosition(x,y,0)}cur_.setMatrixAt(i,m4)}cur_.instanceMatrix.needsUpdate=!0},
  predict:{q:"Why does solid NaCl NOT conduct electricity but molten NaCl does?",opts:[["Solid NaCl has no ions",!1,"It is made entirely of ions."],["In the solid the ions are fixed; when molten they are free to move",!0,"Correct — mobile ions carry the current."],["Molten NaCl has free electrons",!1,"The charge carriers are ions, not electrons."]]}})}
Q_("ix7/ionic3d",[["Sodium becomes Na⁺ by…","सोडियम Na⁺ कैसे बनता है?",["Gaining an electron","Losing an electron","Gaining a proton","Losing a neutron"],1,"Na (2, 8, 1) loses one electron → 2, 8."],["The ionic bond is…","आयनिक बंध है…",["Sharing of electrons","Attraction between oppositely charged ions","Attraction between atoms of the same kind","A bond between two metals"],1,"Electrostatic attraction."],["Cl⁻ is larger than the Cl atom because…","Cl⁻, Cl परमाणु से बड़ा क्यों?",["It has more protons","It has one more electron and the same nuclear charge","It lost a shell","It is a metal"],1,"More electron repulsion."],["Which solid ionic compound conducts electricity?","कौन-सा ठोस आयनिक यौगिक चालक है?",["Solid NaCl","Molten NaCl","Solid sugar","Diamond"],1,"Free ions when molten."],["The formula of magnesium chloride is…","मैग्नीशियम क्लोराइड का सूत्र?",["MgCl","MgCl₂","Mg₂Cl","Mg₂Cl₂"],1,"Mg²⁺ + 2 Cl⁻."]]);
Px["ix7/ionic3d"]=[["Table salt is an ionic crystal: each tiny grain holds about 10¹⁸ ions in a perfect cube pattern.","खाने के नमक का हर कण एक आयनिक क्रिस्टल है — लगभग 10¹⁸ आयन, घन पैटर्न में।"],["Salt dissolves in water because water molecules pull the ions apart; the free ions then conduct electricity.","नमक जल में घुलता है क्योंकि जल-अणु आयनों को अलग खींचते हैं; मुक्त आयन विद्युत ले जाते हैं।"]];
{const Li=Hj.find(h=>h.kp==="ix7").topics,i=Li.findIndex(x=>x.id==="ionic");Li.splice(i<0?Li.length:i+1,0,{id:"ionic3d",title:"Ionic bond: NaCl — detailed 3D",hi:"आयनिक बंध: NaCl — विस्तृत 3D",build:Mionic,ncert:"Class IX · ionic compounds"})}
/* ===================== SET 11: ELECTRIC CIRCUIT — current, Ohm, series & parallel ===================== */
const KIND11={
 cell:["Cell / battery","सेल / बैटरी","Pushes charges round the circuit: it provides the potential difference (voltage). Long plate +, short plate −.","आवेशों को परिपथ में धकेलता है — विभवांतर (वोल्टता) देता है; लंबी पट्टी +, छोटी −।"],
 key:["Plug key (switch)","कुंजी (स्विच)","Closes or opens the circuit. Current flows only in a CLOSED circuit.","परिपथ बंद/खोलता है; धारा केवल बंद परिपथ में बहती है।"],
 res:["Resistor","प्रतिरोधक","Opposes the flow of current. R = V / I, measured in ohm (Ω).","धारा के प्रवाह का विरोध करता है; R = V / I, मात्रक ओम (Ω)।"],
 bulb:["Bulb","बल्ब","A resistor that glows: electrical energy → light and heat. Brighter = more current.","चमकने वाला प्रतिरोधक: विद्युत ऊर्जा → प्रकाश व ऊष्मा; अधिक चमक = अधिक धारा।"],
 amm:["Ammeter (in SERIES)","एमीटर (श्रेणी में)","Measures current in ampere (A). It has a very LOW resistance and is connected in series.","धारा ऐम्पियर (A) में मापता है; प्रतिरोध बहुत कम, श्रेणी में जुड़ता है।"],
 volt:["Voltmeter (in PARALLEL)","वोल्टमीटर (पार्श्व में)","Measures potential difference in volt (V). It has a very HIGH resistance and is connected in parallel across the component.","विभवांतर वोल्ट (V) में मापता है; प्रतिरोध बहुत अधिक, घटक के समांतर जुड़ता है।"],
 wire:["Connecting wire","संयोजी तार","Copper wire with almost zero resistance; free electrons drift through it.","लगभग शून्य प्रतिरोध वाला ताँबे का तार; मुक्त इलेक्ट्रॉन इसमें बहते हैं।"],
 el:["Electron (drifts − → +)","इलेक्ट्रॉन (− → + की ओर)","The actual charge carriers. They drift from the negative to the positive terminal; conventional current is drawn the opposite way (+ → −).","वास्तविक आवेश-वाहक; ऋण से धन टर्मिनल की ओर बहते हैं; परंपरागत धारा विपरीत (+ → −) दिखाई जाती है।"]};
const C_ST=[
["1","An open circuit","खुला परिपथ","A cell, a key, a bulb, an ammeter and a voltmeter joined by wires. The key is OPEN: the circuit is broken and no current flows, so the bulb is off.","एक सेल, कुंजी, बल्ब, एमीटर व वोल्टमीटर तारों से जुड़े; कुंजी खुली है: परिपथ टूटा है, धारा नहीं बहती, बल्ब बंद।","Hand-modelled",10],
["2","Close the key: current flows","कुंजी बंद: धारा बहती है","Closing the key completes the loop. Electrons drift from the − terminal round the circuit to the + terminal; the arrows show conventional current from + to −. The bulb glows.","कुंजी बंद करने से लूप पूरा होता है; इलेक्ट्रॉन − से चलकर परिपथ में घूमते हुए + तक पहुँचते हैं; तीर परंपरागत धारा (+ → −) दिखाते हैं; बल्ब जलता है।","Animated · drift speed exaggerated",12],
["3","Ammeter and voltmeter","एमीटर व वोल्टमीटर","The ammeter is in SERIES and reads the current I. The voltmeter is in PARALLEL across the bulb and reads the voltage V. Note the readings.","एमीटर श्रेणी में है और धारा I पढ़ता है; वोल्टमीटर बल्ब के समांतर है और वोल्टता V पढ़ता है; पाठ्यांक नोट कीजिए।","Animated · readings from V = IR",12],
["4","Ohm's law: V = IR","ओम का नियम: V = IR","Add cells: the voltage doubles and the current doubles too. The V–I graph is a straight line through the origin, and its slope is the resistance R = V / I.","सेल जोड़ने पर वोल्टता दोगुनी और धारा भी दोगुनी; V–I आलेख मूलबिंदु से जाती सरल रेखा है, ढाल = प्रतिरोध R = V / I।","Animated · live graph",14],
["5","Two resistors in series","श्रेणी में दो प्रतिरोधक","One path only. The SAME current flows through both; the voltage divides: V = V₁ + V₂ and R = R₁ + R₂. If one bulb fails, the whole circuit stops.","केवल एक मार्ग; दोनों में समान धारा; वोल्टता बँटती है: V = V₁ + V₂ और R = R₁ + R₂; एक बल्ब ख़राब हो तो पूरा परिपथ बंद।","Animated",13],
["6","Two resistors in parallel","समांतर में दो प्रतिरोधक","Two paths. The SAME voltage across each; the current divides: I = I₁ + I₂ and 1/R = 1/R₁ + 1/R₂ (total R is smaller). If one bulb fails the other keeps glowing — this is how houses are wired.","दो मार्ग; दोनों पर समान वोल्टता; धारा बँटती है: I = I₁ + I₂ और 1/R = 1/R₁ + 1/R₂ (कुल R कम); एक बल्ब ख़राब होने पर दूसरा जलता रहता है — घरों में यही जोड़।","Animated",13],
["7","Heating effect","ऊष्मीय प्रभाव","Current in a resistor produces heat: H = I²Rt. Doubling the current gives FOUR times the heat — this is why overloaded wires get hot and why a fuse is used.","प्रतिरोधक में धारा से ऊष्मा बनती है: H = I²Rt; धारा दोगुनी होने पर ऊष्मा चार गुनी — इसीलिए अतिभारित तार गरम होते हैं और फ़्यूज़ लगाया जाता है।","Animated",12]];
function Mcircuit(){sd=111;const n=new Ne;Ge(n,{key:1.9});Je(n,-5.2,70,.08);const g=new J;n.add(g);const org=[];const add=mkAdd(g,org);
 const Bd=new J;g.add(Bd);
 const wd=MAT(0xb8743a,{roughness:.35,clearcoat:.6,metal:.7,envMapIntensity:.7,sheen:0,emissive:0x2a1408,emissiveIntensity:.25}),steel=MAT(0xd8dce6,{roughness:.2,metal:.9,clearcoat:.5,sheen:0});
 add("wire",new Xe(19,19,.5,4),MAT(0xdfe3ec,{roughness:.8,sheen:0,envMapIntensity:.3,emissive:0x303640,emissiveIntensity:.15}),[0,-.4,1.5],{parent:Bd,ns:1,rot:[0,PI/4,0],scl:[1.18,1,.82]});
 const Wire=(pts,grp)=>add("wire",tube(pts.map(p=>c(p[0],.12,p[1])),.09,8),wd,[0,0,0],{parent:grp||Bd,ns:1});
 const par2=new J;Bd.add(par2);const ser=new J,lp=new J;Bd.add(ser);Bd.add(lp);
 /* shared rails: top z=-4, bottom z=4, battery on the left */
 Wire([[-9,-1.7],[-9,-4],[9,-4],[9,4],[-9,4],[-9,1.7]]);
 /* parallel branch (shown in step 6): nodes at x=-1 and x=6 */
 Wire([[-1,-4],[-1,-.4],[6,-.4],[6,-4]],par2);
 /* voltmeter leads (loop mode) */
 const vlead=new J;Bd.add(vlead);Wire([[.1,-4],[.1,-7.2],[0.6,-7.2]],vlead);Wire([[1.9,-4],[1.9,-7.2],[1.4,-7.2]],vlead);
 /* cell */
 const cellG=new J;cellG.position.set(-9,0,0);Bd.add(cellG);const cb=MAT(0x2a3a8a,{roughness:.35,clearcoat:.8,envMapIntensity:.6,sheen:0});
 add("cell",new Xe(.9,.9,3.2,24),cb,[0,.9,0],{parent:cellG,rot:[PI/2,0,0]});add("cell",new Xe(.35,.35,.4,16),steel,[0,.9,-1.8],{parent:cellG,rot:[PI/2,0,0],ns:1});
 add("cell",sph(.01,0,1,1,1,1,4,4),new bt({color:0xff4a4a}),[0,1.8,-1.9],{parent:cellG,ns:1});
 /* key */
 const keyG=new J;keyG.position.set(-5,.2,-4);Bd.add(keyG);const dk=MAT(0x333a44,{roughness:.4,clearcoat:.5,sheen:0});add("key",new Xe(.5,.5,.35,16),dk,[-1,.2,0],{parent:keyG,ns:1});add("key",new Xe(.5,.5,.35,16),dk,[1,.2,0],{parent:keyG,ns:1});
 const blade=new J;blade.position.set(-1,.4,0);keyG.add(blade);add("key",new Xe(.12,.12,2.0,10),steel,[1,0,0],{parent:blade,rot:[0,0,PI/2]});
 /* bulb / resistor / meter builders */
 const bulbG=(x,z,grp)=>{const gr=new J;gr.position.set(x,0,z);(grp||Bd).add(gr);add("bulb",new Xe(.7,.9,.9,20),MAT(0x777d88,{roughness:.4,metal:.7,sheen:0}),[0,.5,0],{parent:gr,ns:1});const gm=MAT(0xfff6d0,{roughness:.15,clearcoat:1,opacity:.9,emissive:0x000000,emissiveIntensity:0,sheen:0,envMapIntensity:.8});const gl_=add("bulb",sph(.95,0,1,1,1.1,1,24,32),gm,[0,1.75,0],{parent:gr});add("bulb",tube([c(-.3,1.05,0),c(-.3,1.8,0),c(.3,1.8,0),c(.3,1.05,0)],.03,6),MAT(0xffd770,{emissive:0xaa7a00,emissiveIntensity:.8,sheen:0}),[0,0,0],{parent:gr,ns:1});return{gr,gm}};
 const meter=(x,z,id,col,grp)=>{const gr=new J;gr.position.set(x,0,z);(grp||Bd).add(gr);add(id,new Xe(1.15,1.15,.9,28),MAT(0x2a2e38,{roughness:.4,clearcoat:.5,sheen:0}),[0,.5,0],{parent:gr});add(id,new Xe(.95,.95,.05,28),new bt({color:0xf7f7ef}),[0,1.0,0],{parent:gr,ns:1});for(let k=0;k<7;k++){const a=-.8+k*.27;add(id,tube([c(Math.sin(a)*.85,1.03,-Math.cos(a)*.85),c(Math.sin(a)*.7,1.03,-Math.cos(a)*.7)],.015,4),new bt({color:0x333333}),[0,0,0],{parent:gr,ns:1})}const needle=new J;needle.position.set(0,1.06,0);gr.add(needle);add(id,tube([c(0,0,0),c(0,0,-.8)],.035,6),new bt({color:col}),[0,0,0],{parent:needle,ns:1});return{gr,needle}};
 const B1=bulbG(1,-4,lp),SB1=bulbG(-1.5,-4,ser),SB2=bulbG(4.5,-4,ser),PB1=bulbG(2.5,-4,par2),PB2=bulbG(2.5,-.4,par2);
 const resG=new J;resG.position.set(2.8,.2,4);lp.add(resG);const rm=MAT(0xd9c28a,{roughness:.5,sheen:0,envMapIntensity:.4,emissive:0xff3a10,emissiveIntensity:0});add("res",new Xe(.5,.5,2.8,16),rm,[0,.3,0],{parent:resG,rot:[0,0,PI/2]});[[-.55,0xc0392b],[0,0x6a3a1a],[.55,0xf1c40f]].forEach(q=>add("res",new Xe(.53,.53,.18,16),new bt({color:q[1]}),[q[0],.3,0],{parent:resG,ns:1,rot:[0,0,PI/2]}));
 const AM=meter(-3,4,"amm",0xd62828),VM=meter(1,-7.2,"volt",0x1d4ed8,vlead);
 /* V–I graph */
 const GR=new J;GR.position.set(0,.02,9.6);Bd.add(GR);add("wire",new Xe(3.6,3.6,.05,4),new bt({color:0xffffff,transparent:!0,opacity:.95}),[0,0,0],{parent:GR,ns:1,rot:[PI/2,PI/4,0]});
 const ax=new bt({color:0x333333});add("wire",tube([c(-2.2,.06,1.9),c(-2.2,.06,-1.9)],.04,5),ax,[0,0,0],{parent:GR,ns:1});add("wire",tube([c(-2.2,.06,1.9),c(2.2,.06,1.9)],.04,5),ax,[0,0,0],{parent:GR,ns:1});
 add("wire",sph(.01,0,1,1,1,1,4,4),new bt({color:0x333333}),[2.4,.06,1.9],{parent:GR,ns:1});
 const gline=add("wire",new Xe(.05,.05,1,6),new bt({color:0x1d4ed8}),[0,.07,0],{parent:GR,ns:1});
 const pDots=[1,2,3,4].map(k=>{const d=add("wire",sph(.13,0,1,1,1,1,10,12),new bt({color:0xd62828}),[-2.2+k*1.0,.12,1.9-k*.8],{parent:GR,ns:1});d.visible=!1;return d});
 /* polylines (electron direction: − terminal → bottom rail → right → top rail → + terminal) */
 const mk=(pts)=>{const P=pts.map(p=>c(p[0],.12,p[1])),cum=[0];for(let i=1;i<P.length;i++)cum.push(cum[i-1]+P[i].distanceTo(P[i-1]));return{P,cum,L:cum[cum.length-1],at(u){u=((u%1)+1)%1*this.L;let k=1;while(k<this.cum.length-1&&this.cum[k]<u)k++;const a=this.P[k-1],b=this.P[k],f=(u-this.cum[k-1])/((this.cum[k]-this.cum[k-1])||1);return a.clone().lerp(b,f)}}};
 const pathL=mk([[-9,1.7],[-9,4],[9,4],[9,-4],[-9,-4],[-9,-1.7]]);
 const pathA=mk([[-9,1.7],[-9,4],[9,4],[9,-4],[6,-4],[-1,-4],[-9,-4],[-9,-1.7]]),pathB=mk([[-9,1.7],[-9,4],[9,4],[9,-4],[6,-4],[6,-.4],[-1,-.4],[-1,-4],[-9,-4],[-9,-1.7]]);
 const NE=64,el=new Wn(new it(.12,10,8),new bt({color:0x3b82f6}),NE);el.frustumCulled=!1;g.add(el);const NA_=28,arr=new Wn(new it(.11,8,6),new bt({color:0xffd23f}),NA_);arr.frustumCulled=!1;g.add(arr);const m4=new gt;
 const cams=[[c(0,28,12),c(0,0,0)],[c(0,28,12),c(0,0,0)],[c(0,25,13),c(0,0,0)],[c(0,28,13),c(0,0,3.6)],[c(0,26,12),c(0,0,-.5)],[c(0,26,12),c(0,0,-.5)],[c(0,28,12),c(0,0,0)]];
 const camK=["Circuit","Current","Meters","Ohm","Series","Parallel","Heat"];
 const show={};const ids=["cell","key","res","bulb","amm","volt","wire","el"];ids.forEach(i=>show[i]=[1,1,1,1,1,1,1]);const base={cell:1,key:1,res:1,bulb:1,amm:1,volt:1,wire:1,el:1};
 const Lw=(par,p)=>()=>par.localToWorld(c(...p));
 const labels=[["c-ce","Cell (+ top, − bottom)","सेल (+ ऊपर, − नीचे)",Lw(cellG,[0,2.4,-1.9]),[0,1]],["c-ke","Plug key (OPEN → no current)","कुंजी (खुली → धारा नहीं)",Lw(keyG,[0,1.6,0]),[0]],["c-kc","Plug key (CLOSED)","कुंजी (बंद)",Lw(keyG,[0,1.6,0]),[1,2,3,4,5,6]],["c-bu","Bulb","बल्ब",Lw(B1.gr,[0,3.3,0]),[0,1,2,3,6]],["c-am","Ammeter (series)","एमीटर (श्रेणी)",Lw(AM.gr,[0,1.9,0]),[0,2,3,4,5]],["c-vo","Voltmeter (parallel across bulb)","वोल्टमीटर (बल्ब के समांतर)",Lw(VM.gr,[0,1.9,0]),[0,2,3]],["c-wi","Copper wire","ताँबे का तार",Lw(Bd,[6.5,.5,4]),[0]],["c-re","Resistor R","प्रतिरोधक R",Lw(resG,[0,1.4,0]),[0,3,6]],
  ["f-el","Electrons drift − → +","इलेक्ट्रॉन − → + बहते",Lw(Bd,[-4,.9,4.6]),[1]],["f-co","Conventional current + → −","परंपरागत धारा + → −",Lw(Bd,[4,.9,-4.7]),[1]],
  ["m-i","I = current (A)","I = धारा (A)",Lw(AM.gr,[-2.2,1.3,0]),[2]],["m-v","V = voltage (V)","V = वोल्टता (V)",Lw(VM.gr,[2.4,1.3,0]),[2]],
  ["o-v","V = I R","V = I R",Lw(Bd,[-4,.9,6.4]),[3]],["o-g","V–I graph: straight line","V–I आलेख: सरल रेखा",Lw(GR,[0,.5,-2.3]),[3]],["o-s","slope = R","ढाल = R",Lw(GR,[2.4,.5,-1.4]),[3]],
  ["s-1","R₁ (bulb)","R₁ (बल्ब)",Lw(SB1.gr,[0,3.3,0]),[4]],["s-2","R₂ (bulb)","R₂ (बल्ब)",Lw(SB2.gr,[0,3.3,0]),[4]],["s-r","Same I · V divides · R = R₁ + R₂","समान I · V बँटता · R = R₁ + R₂",Lw(Bd,[0,.9,6.4]),[4]],
  ["p-1","R₁ branch","R₁ शाखा",Lw(PB1.gr,[0,3.3,0]),[5]],["p-2","R₂ branch","R₂ शाखा",Lw(PB2.gr,[0,3.3,0]),[5]],["p-r","Same V · I divides · 1/R = 1/R₁ + 1/R₂","समान V · I बँटता · 1/R = 1/R₁ + 1/R₂",Lw(Bd,[0,.9,6.4]),[5]],
  ["h-r","Resistor gets hot (H = I²Rt)","प्रतिरोधक गरम (H = I²Rt)",Lw(resG,[0,1.6,0]),[6]],["h-f","2× current = 4× heat","2× धारा = 4× ऊष्मा",Lw(Bd,[0,.9,6.4]),[6]]];
 /* step mapping: 0-3,6 single loop ; 4 series ; 5 parallel (own wiring and own electron paths) */
 const phase=t=>(t*.12)%1;
 const Vof=(s,t)=>s===3?(2+2*(Math.floor(t*.18)%2)):s===4?6:s===5?3:s===6?(Math.floor(t*.2)%2?6:3):3;
 const Rof=s=>s===4?6:s===5?2:3;
 return run({n,g,org,show,base,ST:C_ST,cams,camK,labels,
  hud:(s,t)=>{const V=Vof(s,t),R=Rof(s),I=V/R;return s>=2?`V = ${V.toFixed(1)} V · I = ${I.toFixed(2)} A · R = ${R.toFixed(1)} Ω`:s===1?"Circuit CLOSED · current flows":"Circuit OPEN · I = 0"},
  frame:(s,t)=>{const closed=s>=1;blade.rotation.z=closed?0:.55;
   lp.visible=s!==4&&s!==5;ser.visible=s===4;par2.visible=s===5;vlead.visible=s!==4&&s!==5;
   /* show a bulb in loop group, 2 bulbs in series, 2 in parallel */
   const V=Vof(s,t),R=Rof(s),I=closed?V/R:0,br=cl(I/1.6,0,1.2);
   [B1,SB1,SB2,PB1,PB2].forEach(b=>{b.gm.emissive.setHex(0xffc933);b.gm.emissiveIntensity=closed?(br*.9+.2):0});
   AM.needle.rotation.y=-.8+cl(I/2,0,1)*1.6;VM.needle.rotation.y=-.8+cl(V/6,0,1)*1.6;
   const cur=s===5?[pathA,pathB]:[pathL];
   for(let i=0;i<NE;i++){if(!closed){m4.makeScale(0,0,0)}else{const pt=cur[i%cur.length],u=(i/NE*cur.length*0+Math.floor(i/cur.length)/(NE/cur.length)-t*.03*(.6+I*.4));const p=pt.at(u);m4.makeScale(1,1,1);m4.setPosition(p.x,p.y,p.z)}el.setMatrixAt(i,m4)}el.instanceMatrix.needsUpdate=!0;
   for(let i=0;i<NA_;i++){if(s!==1){m4.makeScale(0,0,0)}else{const u=-(i/NA_+t*.03),p=pathL.at(-u);m4.makeScale(1,1,1);m4.setPosition(p.x,p.y+.5,p.z)}arr.setMatrixAt(i,m4)}arr.instanceMatrix.needsUpdate=!0;
   rm.emissiveIntensity=s===6?cl(I*I/8,0,1)*1.3:0;
   gline.visible=s===3;if(s===3){gline.scale.set(1,Math.hypot(3.0,2.4),1);gline.position.set(-.7+.05,.07,.65);gline.rotation.set(PI/2,0,Math.atan2(3.0,2.4)*-1+PI/2*0)}
   pDots.forEach((d,i)=>{d.visible=s===3&&((t*.5)%5)>i*.9+.2})},
  predict:{q:"Two identical bulbs are connected in PARALLEL. If one bulb burns out, what happens to the other?",opts:[["It also goes out",!1,"That happens in a series circuit."],["It keeps glowing",!0,"Correct — each branch has its own path and the same voltage."],["It glows brighter and burns out",!1,"Its voltage and current stay the same."]]}})}
Q_("ch11/circuit3d",[["An ammeter is connected in…","एमीटर किसमें जोड़ा जाता है?",["Parallel with the component","Series with the component","Either way","Across the cell only"],1,"Series, with very low resistance."],["A voltmeter is connected in…","वोल्टमीटर किसमें जोड़ा जाता है?",["Series","Parallel across the component","Between the cell and key","Inside the wire"],1,"Parallel, with very high resistance."],["In a series circuit of two resistors the…","श्रेणी परिपथ में दो प्रतिरोधकों में…",["Current is the same","Voltage is the same","Resistance is the smaller one","Each branch has its own current"],0,"Same current; voltage divides."],["Why are home appliances connected in parallel?","घरेलू उपकरण समांतर क्यों जोड़े जाते?",["To increase resistance","Each gets the full voltage and works independently","To save wire","To reduce voltage"],1,"Same 220 V across each."],["If the voltage across a 4 Ω resistor is 12 V, the current is…","4 Ω पर 12 V हो तो धारा?",["0.33 A","3 A","48 A","8 A"],1,"I = V/R = 3 A."]]);
Px["ch11/circuit3d"]=[["Fairy lights used to be in series: one dead bulb put out the whole string. Modern strings use parallel or bypass paths.","पुरानी झालरें श्रेणी में थीं: एक बल्ब ख़राब तो पूरी बंद; आधुनिक झालरों में समांतर/बाईपास पथ होते हैं।"],["The electrons in a wire drift at only about 0.1 mm/s, yet the bulb lights instantly because the whole wire is already full of electrons.","तार में इलेक्ट्रॉन केवल लगभग 0.1 mm/s से बहते हैं, फिर भी बल्ब तुरंत जलता है क्योंकि पूरा तार पहले से इलेक्ट्रॉनों से भरा है।"]];
{const Lc=Hi.find(h=>h.no===11).topics,i=Lc.findIndex(x=>x.id==="ohm");Lc.splice(i<0?Lc.length:i+1,0,{id:"circuit3d",title:"Electric circuit: current, Ohm, series & parallel — detailed 3D",hi:"विद्युत परिपथ: धारा, ओम, श्रेणी व समांतर — विस्तृत 3D",build:Mcircuit,ncert:"Ch 11 · electricity"})}
/* ===================== SET 12: RAY DIAGRAMS — mirrors & lenses ===================== */
const KIND12={
 axis:["Principal axis","मुख्य अक्ष","The straight line through the optical centre (lens) or pole (mirror), perpendicular to the surface.","प्रकाशिक केंद्र (लेंस) या ध्रुव (दर्पण) से गुज़रती सरल रेखा, सतह पर लंबवत।"],
 pole:["Pole / optical centre","ध्रुव / प्रकाशिक केंद्र","The middle point of the mirror or lens: P for a mirror, O for a lens.","दर्पण या लेंस का मध्य बिंदु: दर्पण में P, लेंस में O।"],
 F:["Principal focus F","मुख्य फ़ोकस F","Parallel rays meet at (or appear to come from) this point. Focal length f = distance from pole to F.","समांतर किरणें यहाँ मिलती (या यहीं से आती प्रतीत होती) हैं; फ़ोकस दूरी f = ध्रुव से F की दूरी।"],
 C:["Centre of curvature C (= 2F)","वक्रता केंद्र C (= 2F)","The centre of the sphere of which the mirror is a part; C is at 2f. For a lens, 2F marks twice the focal length.","उस गोले का केंद्र जिसका दर्पण एक भाग है; C, 2f पर होता है; लेंस में 2F फ़ोकस दूरी का दोगुना।"],
 obj:["Object (orange arrow)","वस्तु (नारंगी तीर)","Placed on the principal axis. Its distance u is measured from the pole/optical centre.","मुख्य अक्ष पर रखी; दूरी u ध्रुव/प्रकाशिक केंद्र से मापी जाती है।"],
 img:["Image","प्रतिबिंब","Real image: rays actually meet — it can be caught on a screen (inverted). Virtual image: rays only appear to meet — it cannot be caught (upright).","वास्तविक प्रतिबिंब: किरणें सचमुच मिलती हैं — परदे पर पकड़ा जा सकता है (उलटा); आभासी: केवल मिलती प्रतीत — परदे पर नहीं (सीधा)।"],
 r1:["Ray 1: parallel to the axis","किरण 1: अक्ष के समांतर","After reflection/refraction it passes through (or appears to come from) the focus F.","परावर्तन/अपवर्तन के बाद फ़ोकस F से गुज़रती (या वहाँ से आती प्रतीत होती) है।"],
 r2:["Ray 2: through the pole / centre","किरण 2: ध्रुव / केंद्र से","Through a lens centre it goes straight. At a mirror pole it reflects with ∠i = ∠r.","लेंस के केंद्र से सीधी निकलती है; दर्पण के ध्रुव पर ∠i = ∠r से परावर्तित।"],
 r3:["Ray 3: through (or towards) F","किरण 3: F से (या F की ओर)","A ray through the focus comes out parallel to the axis.","फ़ोकस से जाती किरण अक्ष के समांतर निकलती है।"],
 elem:["Mirror / lens","दर्पण / लेंस","Concave mirror and convex lens converge light; convex mirror and concave lens diverge it.","अवतल दर्पण व उत्तल लेंस प्रकाश अभिसारित करते हैं; उत्तल दर्पण व अवतल लेंस अपसारित।"]};
const RY_ST=[
["1","The optical bench and the three rays","प्रकाशिक बेंच व तीन किरणें","A concave mirror on a bench with its principal axis, focus F (f = 3) and centre of curvature C = 2f. To find an image we need only 3 rays: parallel to the axis, through the pole, and through F.","बेंच पर अवतल दर्पण: मुख्य अक्ष, फ़ोकस F (f = 3) और वक्रता केंद्र C = 2f; प्रतिबिंब हेतु केवल तीन किरणें चाहिए: अक्ष के समांतर, ध्रुव से, और F से।","Animated · object moves",12],
["2","Concave mirror: object beyond C","अवतल दर्पण: वस्तु C से पार","Object beyond C (u > 2f): the image forms between F and C — REAL, INVERTED and DIMINISHED. This is how a camera or a telescope objective forms its image.","वस्तु C के पार (u > 2f): प्रतिबिंब F और C के बीच — वास्तविक, उलटा, छोटा; कैमरा/दूरदर्शी का अभिदृश्यक ऐसे ही प्रतिबिंब बनाता है।","Animated",13],
["3","Concave mirror: between C and F","अवतल दर्पण: C और F के बीच","Object between C and F (f < u < 2f): the image forms BEYOND C — REAL, INVERTED and ENLARGED. A projector uses this.","वस्तु C और F के बीच (f < u < 2f): प्रतिबिंब C के पार — वास्तविक, उलटा, बड़ा; प्रोजेक्टर इसी का उपयोग करता है।","Animated",13],
["4","Concave mirror: inside F","अवतल दर्पण: F के भीतर","Object inside F (u < f): the reflected rays diverge, so the image is formed BEHIND the mirror — VIRTUAL, UPRIGHT and ENLARGED. A shaving mirror works this way.","वस्तु F के भीतर (u < f): परावर्तित किरणें अपसारित, प्रतिबिंब दर्पण के पीछे — आभासी, सीधा, बड़ा; शेविंग दर्पण ऐसे काम करता है।","Animated",13],
["5","Convex mirror","उत्तल दर्पण","Always gives a VIRTUAL, UPRIGHT, DIMINISHED image behind the mirror, wherever the object is. It shows a wide field of view — used as a rear-view mirror.","सदा आभासी, सीधा, छोटा प्रतिबिंब दर्पण के पीछे; दृष्टि-क्षेत्र विस्तृत — पश्च-दर्शी दर्पण में प्रयुक्त।","Animated",13],
["6","Convex lens: every position","उत्तल लेंस: हर स्थिति","Move the object from far to near: beyond 2F real, inverted, smaller; at 2F real, inverted, same size; between F and 2F real, inverted, bigger; inside F virtual, upright, bigger (magnifying glass).","वस्तु को दूर से पास लाइए: 2F के पार वास्तविक, उलटा, छोटा; 2F पर समान आकार; F और 2F के बीच बड़ा; F के भीतर आभासी, सीधा, बड़ा (आवर्धक लेंस)।","Animated · full sweep",18],
["7","Concave lens","अवतल लेंस","Always a VIRTUAL, UPRIGHT, DIMINISHED image on the same side as the object. Used to correct myopia.","सदा आभासी, सीधा, छोटा प्रतिबिंब वस्तु की ही ओर; निकट-दृष्टि के सुधार में प्रयुक्त।","Animated",13],
["8","The formula and magnification","सूत्र व आवर्धन","Mirror: 1/v + 1/u = 1/f. Lens: 1/v − 1/u = 1/f. Magnification m = h′/h = −v/u (mirror) or v/u (lens). Negative m: inverted; |m| > 1: enlarged. The numbers update live.","दर्पण: 1/v + 1/u = 1/f; लेंस: 1/v − 1/u = 1/f; आवर्धन m = h′/h = −v/u (दर्पण) या v/u (लेंस); m ऋणात्मक: उलटा; |m| > 1: बड़ा; संख्याएँ सजीव बदलती हैं।","Animated",14]];
function Mrays(){sd=121;const n=new Ne;Ge(n,{key:1.9});Je(n,-3.6,60,.08);const g=new J;n.add(g);const org=[];const add=mkAdd(g,org);
 const O=new J;g.add(O);
 /* bench */
 add("axis",new Xe(.07,.07,36,8),new bt({color:0x333a4a}),[0,0,0],{parent:O,ns:1,rot:[0,0,PI/2]});
 add("elem",new Xe(18.5,18.5,.4,4),MAT(0xcdd3dd,{roughness:.7,sheen:0,envMapIntensity:.3}),[0,-2.4,0],{parent:O,ns:1,rot:[0,PI/4,0],scl:[1.0,1,.12]});
 for(let x=-16;x<=16;x++)add("axis",new Xe(.025,.025,x%5===0?.7:.35,5),new bt({color:0x556}),[x,-2.0,.9],{parent:O,ns:1});
 /* optical elements as surfaces of revolution about the x-axis */
 const rev=(prof,rmax,nu=32,nv=48)=>param(nu,nv,(u,v)=>{const r=u*rmax,x=prof(r),a=v*TAU;return[x,r*Math.cos(a),r*Math.sin(a)]});
 const H=3.6,glass=MAT(0xbfe4ff,{roughness:.1,clearcoat:1,opacity:.45,depthWrite:!1,sheen:0,envMapIntensity:1.0,transmission:0,emissive:0x2a4a6a,emissiveIntensity:.15});
 const lensCx=new J,lensCv=new J,mirCc=new J,mirCx=new J;[lensCx,lensCv,mirCc,mirCx].forEach(x=>{O.add(x);x.visible=!1});
 const w0=.12,ww=.55;
 [1,-1].forEach(sg=>{add("elem",rev(r=>sg*(w0+ww*(1-(r/H)*(r/H))),H),glass,[0,0,0],{parent:lensCx,ns:1});add("elem",rev(r=>sg*(w0+.9*(r/H)*(r/H)),H),glass,[0,0,0],{parent:lensCv,ns:1})});
 const R=6,silver=MAT(0xdde3ec,{roughness:.12,metal:1,clearcoat:.6,sheen:0,envMapIntensity:1.4,emissive:0x303844,emissiveIntensity:.2});
 add("elem",rev(r=>-(R-Math.sqrt(Math.max(0,R*R-r*r))),H),silver,[0,0,0],{parent:mirCc,ns:1});add("elem",rev(r=>-(R-Math.sqrt(Math.max(0,R*R-r*r)))+.35,H),MAT(0x6a7280,{roughness:.6,sheen:0}),[0,0,0],{parent:mirCc,ns:1});
 add("elem",rev(r=>(R-Math.sqrt(Math.max(0,R*R-r*r))),H),silver,[0,0,0],{parent:mirCx,ns:1});add("elem",rev(r=>(R-Math.sqrt(Math.max(0,R*R-r*r)))+.35,H),MAT(0x6a7280,{roughness:.6,sheen:0}),[0,0,0],{parent:mirCx,ns:1});
 /* points: F, 2F markers, pole */
 const pt=(col,r_=.16)=>{const m=add("F",sph(r_,0,1,1,1,1,12,16),new bt({color:col}),[0,0,0],{parent:O,ns:1});return m};
 const mF1=pt(0x1d4ed8),mF2=pt(0x1d4ed8),mC1=pt(0x7c3aed),mC2=pt(0x7c3aed),mP=pt(0x111111,.12);
 /* object + image arrows */
 const arrow=(col,id)=>{const gr=new J;O.add(gr);const mat=new bt({color:col,transparent:!0});add(id,new Xe(.09,.09,1,8),mat,[0,.5,0],{parent:gr,ns:1});const head=add(id,new Xe(0,.28,.5,12),mat,[0,1,0],{parent:gr,ns:1});return{gr,head,mat}};
 const OBJ=arrow(0xf29a1c,"obj"),IMG=arrow(0xd6249f,"img");
 /* ray segments pool */
 const up=c(0,1,0),rc=[0xe53935,0x1e88e5,0x2e7d32];const SEG=[];for(let r=0;r<3;r++)for(let k=0;k<3;k++){const m=add("r"+(r+1),new Xe(.05,.05,1,6),new bt({color:rc[r],transparent:!0,opacity:k===2?.5:1}),[0,0,0],{parent:O,ns:1});m.visible=!1;SEG.push({m,virt:k===2})}
 const seg=(s_,a,b)=>{const m=s_.m,d=b.clone().sub(a),L=d.length();if(L<.02){m.visible=!1;return}m.visible=!0;m.position.copy(a.clone().add(b).multiplyScalar(.5));const w=s_.virt?.55:1;m.scale.set(w,L,w);m.quaternion.setFromUnitVectors(up,d.normalize())};
 /* geometry ------------------------------------------------------------- */
 const CFG={1:["mc",3,12,12],2:["mc",3,10,7.2],3:["mc",3,5.6,3.6],4:["mc",3,2.5,.8],5:["mx",-3,9,2.5],6:["lc",3,10,.8],7:["lv",-3,9,2.5],8:["lc",3,9,1.4]};
 const ease=x=>x*x*(3-2*x),tri=x=>1-Math.abs(((x%1)*2)-1);
 const state={d:10,F:3,type:"mc",xi:0,hi:0,real:!1,m:0,v:0};
 const solve=(type,F,d,h)=>{const mirror=type[0]==="m",di=d*F/(d-F),m=-di/d,hi=m*h,xi=mirror?-di:di,real=di>0;return{di,m,hi,xi,real,mirror}};
 const rays=(type,F,d,h,S)=>{const mirror=type[0]==="m",tip=c(-d,h,0),out=[];const far=16;
  /* ray 1 */
  const p1=c(0,h,0);let d1=mirror?(F>0?c(-F,-h,0):c(F,h,0)):(F>0?c(F,-h,0):c(-F,h,0));d1.normalize();
  const e1=p1.clone().add(d1.clone().multiplyScalar((mirror?-far-p1.x:far-p1.x)/(d1.x||1e-6)));
  out.push([[tip,p1],[p1,e1],(!S.real)?[p1,c(S.xi,S.hi,0)]:null]);
  /* ray 2 */
  const p2=c(0,0,0);let d2=mirror?c(-d,-h,0).normalize():c(d,-h,0).normalize();
  const e2=p2.clone().add(d2.clone().multiplyScalar((mirror?-far:far)/(d2.x||1e-6)));
  out.push([[tip,p2],[p2,e2],(mirror&&!S.real)?[p2,c(S.xi,S.hi,0)]:null]);
  /* ray 3 */
  const y3=-h*F/(d-F),p3=c(0,y3,0),e3=c(mirror?-far:far,y3,0);
  out.push([[tip,p3],[p3,e3],(!S.real)?[p3,c(S.xi,S.hi,0)]:null]);return out};
 const NM={mc:"Concave mirror",mx:"Convex mirror",lc:"Convex lens",lv:"Concave lens"};
 const nature=(S,d,F)=>{if(S.mirror&&F<0)return"VIRTUAL · upright · diminished";if(!S.mirror&&F<0)return"VIRTUAL · upright · diminished";const f=Math.abs(F),a=Math.abs(S.m);if(!S.real)return"VIRTUAL · upright · enlarged";if(Math.abs(d-2*f)<.25)return"REAL · inverted · same size";return a>1?"REAL · inverted · enlarged":"REAL · inverted · diminished"};
 const cams=[[c(0,3,25),c(0,.2,0)],[c(0,3,25),c(0,.2,0)],[c(0,3,25),c(0,.2,0)],[c(0,3,25),c(0,.2,0)],[c(0,3,25),c(0,.2,0)],[c(0,3,26),c(0,.2,0)],[c(0,3,25),c(0,.2,0)],[c(0,3,25),c(0,.2,0)]];
 const camK=["Bench","Beyond C","C–F","Inside F","Convex mirror","Convex lens","Concave lens","Formula"];
 const show={};["axis","elem","F","obj","img","r1","r2","r3"].forEach(i=>show[i]=[1,1,1,1,1,1,1,1]);const base={axis:1,elem:1,F:1,obj:1,img:1,r1:1,r2:1,r3:1};
 const Lw=p=>()=>O.localToWorld(p().clone());
 const labels=[["a-ax","Principal axis","मुख्य अक्ष",Lw(()=>c(13,.5,0)),[0]],["a-po","Pole P / centre O","ध्रुव P / केंद्र O",Lw(()=>c(.0,-1.2,0)),[0]],["a-f1","F","F",Lw(()=>mF1.position.clone().add(c(0,-.8,0))),[0,1,2,3,4,5,6,7]],["a-c","C = 2F","C = 2F",Lw(()=>mC1.position.clone().add(c(0,-.8,0))),[0,1,2,3,7]],["a-ob","Object","वस्तु",Lw(()=>OBJ.gr.position.clone().add(c(0,2.2,0))),[0,1,2,3,4,5,6,7]],["a-im","Image","प्रतिबिंब",Lw(()=>IMG.gr.position.clone().add(c(0,state.hi>=0?state.hi+1.3:state.hi-1.3,0))),[0,1,2,3,4,5,6,7]],
  ["a-r1","Ray 1 ∥ axis → F","किरण 1 ∥ अक्ष → F",Lw(()=>c(-state.d*.45,1.9,0)),[0]],["a-r2","Ray 2 → pole","किरण 2 → ध्रुव",Lw(()=>c(-state.d*.45,-1.4,0)),[0]],["a-r3","Ray 3 via F → ∥ axis","किरण 3 F से → ∥ अक्ष",Lw(()=>c(-state.d*.25,-2.4,0)),[0]],
  ["a-rl","REAL · inverted","वास्तविक · उलटा",Lw(()=>c(state.xi,state.hi-1.6,0)),[1,2,5]],["a-vi","VIRTUAL · upright","आभासी · सीधा",Lw(()=>c(state.xi,state.hi+1.6,0)),[3,4,6]],["a-sc","Screen can catch a real image","परदा वास्तविक प्रतिबिंब पकड़ता",Lw(()=>c(state.xi,-3,0)),[1,2]]];
 const r0=run({n,g,org,show,base,ST:RY_ST,cams,camK,labels,
  hud:(s,t)=>{const S=state,f=Math.abs(S.F),u=S.mirror?-S.d:-S.d,vv=S.mirror?-S.xi*-1:S.xi;const sg=S.mirror?"1/v + 1/u = 1/f":"1/v − 1/u = 1/f";const uu=-S.d,v_=S.mirror?S.xi:S.xi,ff=S.mirror?(S.F>0?-f:f):(S.F);return`${NM[S.type]} · f = ${S.F>0?"":"−"}${f.toFixed(0)} · u = ${uu.toFixed(1)} · v = ${v_.toFixed(1)} · m = ${S.m.toFixed(2)} · ${nature({mirror:S.mirror,real:S.real,m:S.m},S.d,S.F)}`},
  frame:(s,t)=>{const c_=CFG[s+1],type=c_[0],F=c_[1],d0=c_[2],d1=c_[3];
   const ph=(t*.07)%1,u=s===0?0:ease(tri(ph)),d=lerp(d0,d1,u),dd=Math.abs(d-Math.abs(F))<.12?Math.abs(F)+.12:d;
   const S=solve(type,F,dd,1.6);S.d=dd;S.F=F;S.type=type;Object.assign(state,{d:dd,F,type,xi:S.xi,hi:S.hi,real:S.real,m:S.m,mirror:S.mirror});
   lensCx.visible=type==="lc";lensCv.visible=type==="lv";mirCc.visible=type==="mc";mirCx.visible=type==="mx";
   const f=Math.abs(F);mF1.position.set(S.mirror?(F>0?-f:f):f,0,0);mF2.position.set(S.mirror?(F>0?-f:f)*-1:-f,0,0);mC1.position.set(S.mirror?(F>0?-2*f:2*f):2*f,0,0);mC2.position.set(S.mirror?-mC1.position.x:-2*f,0,0);mP.position.set(0,0,0);
   mF2.visible=!S.mirror;mC2.visible=!S.mirror;
   /* object arrow */
   OBJ.gr.position.set(-dd,0,0);OBJ.gr.scale.set(1,1.6,1);OBJ.head.position.set(0,1,0);OBJ.head.scale.set(1,1/1.6,1);
   /* image arrow */
   const ok=Math.abs(S.hi)<9&&Math.abs(S.xi)<22;IMG.gr.visible=ok;IMG.gr.position.set(S.xi,0,0);IMG.gr.scale.set(1,S.hi,1);IMG.head.scale.set(1,1/Math.max(.01,Math.abs(S.hi))*(S.hi>=0?1:-1),1);IMG.head.position.set(0,1,0);
   IMG.mat.opacity=S.real?1:.5;
   const R_=rays(type,F,dd,1.6,S);let k=0;R_.forEach(rr=>{seg(SEG[k++],rr[0][0],rr[0][1]);seg(SEG[k++],rr[1][0],rr[1][1]);if(rr[2]&&ok)seg(SEG[k++],rr[2][0],rr[2][1]);else{SEG[k++].m.visible=!1}});},
  predict:{q:"An object is placed beyond C (u > 2f) of a concave mirror. The image is…",opts:[["Virtual, upright and enlarged",!1,"That is for an object inside F."],["Real, inverted and diminished, between F and C",!0,"Correct — three-ray construction gives this."],["Real, inverted and enlarged, beyond C",!1,"That is for an object between F and C."]]}});
 return r0}
Q_("ch9/rays3d",[["Where must an object be placed so that a concave mirror gives a virtual, enlarged image?","अवतल दर्पण से आभासी, बड़ा प्रतिबिंब पाने हेतु वस्तु कहाँ रखें?",["Beyond C","At C","Between F and C","Between P and F"],3,"Inside the focus (u < f)."],["Which mirror always forms a virtual, upright, diminished image?","कौन-सा दर्पण सदा आभासी, सीधा, छोटा प्रतिबिंब बनाता है?",["Concave","Convex","Plane only","Both"],1,"Convex mirror."],["A convex lens forms a real, inverted image of the same size when the object is at…","उत्तल लेंस समान आकार का वास्तविक, उलटा प्रतिबिंब कब बनाता है?",["F","2F","Infinity","Between O and F"],1,"At 2F the image is also at 2F."],["A ray parallel to the principal axis, after reflection from a concave mirror, passes through…","अक्ष के समांतर किरण अवतल दर्पण से परावर्तित होकर कहाँ से गुज़रती है?",["The pole","The focus","The centre of curvature","Infinity"],1,"Through F."],["Magnification m = −2 means the image is…","m = −2 का अर्थ प्रतिबिंब…",["Upright and twice the size","Inverted and twice the size","Inverted and half the size","Upright and half the size"],1,"Negative = inverted, |m| = 2 = enlarged."]]);
Px["ch9/rays3d"]=[["A magnifying glass is a convex lens used with the object inside its focus — that gives a virtual, upright, enlarged image.","आवर्धक लेंस उत्तल लेंस है जिसे वस्तु फ़ोकस के भीतर रखकर प्रयोग करते हैं — आभासी, सीधा, बड़ा प्रतिबिंब।"],["Car rear-view mirrors are convex: they show a wider area, but objects look smaller and farther than they are.","कार के पश्च-दर्शी दर्पण उत्तल होते हैं: अधिक क्षेत्र दिखता है, पर वस्तुएँ छोटी व दूर दिखती हैं।"]];
{const Lr=Hi.find(h=>h.no===9).topics,i=Lr.findIndex(x=>x.id==="optics");Lr.splice(i<0?Lr.length:i+1,0,{id:"rays3d",title:"Ray diagrams: mirrors & lenses — detailed 3D",hi:"किरण-आरेख: दर्पण व लेंस — विस्तृत 3D",build:Mrays,ncert:"Ch 9 · light — reflection and refraction"})}
/* ===================== LABKIT — shared glassware, liquids, ions, flames (chemistry batch 1) ===================== */
const LAB={};const ease=t=>t*t*(3-2*t);
LAB.glassM=()=>MAT(0xe6f2ff,{roughness:.04,clearcoat:1,clearcoatRoughness:.02,opacity:.2,depthWrite:!1,sheen:0,envMapIntensity:1.5,emissive:0x1a2a3a,emissiveIntensity:.05,bumpScale:0});
LAB.liqM=col=>MAT(col,{roughness:.08,clearcoat:.9,opacity:.86,depthWrite:!1,sheen:0,envMapIntensity:.9,emissive:0x101820,emissiveIntensity:.08,bumpScale:0});
LAB.table=g=>{const t=new N(new Xe(14,14,.5,4),MAT(0xc98d6a,{roughness:.65,sheen:0,bumpScale:.25,envMapIntensity:.35}));t.rotation.y=PI/4;t.scale.set(2.0,1,.75);t.position.y=-.3;t.receiveShadow=!0;g.add(t);const e=new N(new Xe(14.4,14.4,.1,4),MAT(0x8a5a3a,{roughness:.7,sheen:0}));e.rotation.y=PI/4;e.scale.set(2.0,1,.75);e.position.y=-.6;g.add(e)};
LAB.vessel=(g,x,z,r,h,kind,color,level)=>{const v=new J;v.position.set(x,0,z);g.add(v);const gm=LAB.glassM();
 const wall=kind==="flask"?new N(param(30,48,(u,w)=>{const t=u,rad=t<.55?lerp(r,r*.26,Math.pow(t/.55,1.15)):r*.26+(t>.9?.05*(t-.9)/.1*r:0),a=w*TAU;return[Math.cos(a)*rad,u*h,Math.sin(a)*rad]}),gm):new N(new Xe(r,r,h,40,1,!0),gm);if(kind!=="flask")wall.position.y=h/2;v.add(wall);
 const base=new N(new Xe(r,r,.1,40),gm);base.position.y=.05;v.add(base); const rimT=new N(param(6,40,(u,w)=>{const a=w*TAU,rr=(kind==="flask"?r*.3:r)+.02*Math.cos(u*TAU);return[Math.cos(a)*rr,h+.02*Math.sin(u*TAU),Math.sin(a)*rr]}),gm);v.add(rimT);
 const liqM=LAB.liqM(color);let liq;if(kind==="flask"){liq=new N(new Xe(r*.9,r*.9,1,32),liqM)}else liq=new N(new Xe(r*.94,r*.94,1,36),liqM);v.add(liq);
 const o={v,liq,liqM,r,h,kind,level:level};
 o.set=(lv,col)=>{o.level=lv;const hh=Math.max(.001,lv*h);liq.scale.y=hh;liq.position.y=.1+hh/2;liq.visible=lv>.01;if(kind==="flask"){const f=Math.min(1,lv*h/(h*.55));const rt=lerp(r*.9,r*.3,Math.pow(f,1.0));liq.scale.x=rt/(r*.9);liq.scale.z=rt/(r*.9)}if(col!==undefined)liqM.color.setHex(col)};o.set(level,color);return o};
LAB.tint=(m,col)=>{m.color.copy(col);m.emissive.copy(col).multiplyScalar(.5);m.emissiveIntensity=1};
LAB.ions=(g,n,rad)=>{const m=new Wn(new it(rad,10,8),new bt({color:0xffffff}),n);m.frustumCulled=!1;g.add(m);const P=[];for(let i=0;i<n;i++)P.push({p:c(R()-.5,R(),R()-.5),v:c((R()-.5),(R()-.5),(R()-.5)).multiplyScalar(.6),col:0xffffff});return{m,P,n,m4:new gt,cc:new we,setCol(i,hx){P[i].col=hx;m.setColorAt(i,this.cc.setHex(hx))},each(f){for(let i=0;i<n;i++)f(P[i],i)},update(t,box,sp,vis){for(let i=0;i<n;i++){const q=P[i];if(vis&&!vis(i)){this.m4.makeScale(0,0,0);m.setMatrixAt(i,this.m4);continue}q.p.x+=q.v.x*sp*.02;q.p.y+=q.v.y*sp*.02;q.p.z+=q.v.z*sp*.02;if(Math.abs(q.p.x)>.5||q.p.x*q.v.x>0&&Math.abs(q.p.x)>.48)q.v.x*=-1;if(q.p.y<0||q.p.y>1)q.v.y*=-1;if(Math.abs(q.p.z)>.5)q.v.z*=-1;q.p.x=cl(q.p.x,-.5,.5);q.p.y=cl(q.p.y,0,1);q.p.z=cl(q.p.z,-.5,.5);this.m4.makeScale(1,1,1);this.m4.setPosition(box.x+q.p.x*box.w,box.y0+q.p.y*box.h,box.z+q.p.z*box.w);m.setMatrixAt(i,this.m4)}m.instanceMatrix.needsUpdate=!0;if(m.instanceColor)m.instanceColor.needsUpdate=!0}}};
LAB.bubbles=(g,n,rad,col)=>{const m=new Wn(new it(rad,8,6),new bt({color:col||0xffffff,transparent:!0,opacity:.7}),n);m.frustumCulled=!1;g.add(m);const o=[];for(let i=0;i<n;i++)o.push({a:R()*TAU,r:Math.sqrt(R()),ph:R(),sp:.6+R()*.8});const m4=new gt;return{m,update(t,box,rate){for(let i=0;i<n;i++){const q=o[i];if(rate<=0){m4.makeScale(0,0,0)}else{const f=(t*.35*q.sp*rate+q.ph)%1;m4.makeScale(1,1,1);m4.setPosition(box.x+Math.cos(q.a+f*3)*q.r*box.rad,box.y0+f*(box.y1-box.y0),box.z+Math.sin(q.a+f*3)*q.r*box.rad)}m.setMatrixAt(i,m4)}m.instanceMatrix.needsUpdate=!0}}};
LAB.flame=(g,x,z)=>{const f=new J;f.position.set(x,0,z);g.add(f);const burner=new N(new Xe(.35,.5,1.3,16),MAT(0x6a707c,{roughness:.4,metal:.8,sheen:0}));burner.position.y=.65;f.add(burner);const cone=new N(new Xe(0,.38,1.6,16),new bt({color:0xffa726,transparent:!0,opacity:.75}));cone.position.y=2.1;f.add(cone);const inner=new N(new Xe(0,.2,1.0,16),new bt({color:0x3a7bff,transparent:!0,opacity:.85}));inner.position.y=1.85;f.add(inner);f.userData.upd=(on,t)=>{cone.visible=inner.visible=on;const k=1+.08*Math.sin(t*18)+.05*Math.sin(t*31);cone.scale.set(k,1+.1*Math.sin(t*22),k)};return f};
LAB.metal=(col,rough)=>MAT(col,{roughness:rough??.3,metal:.9,clearcoat:.4,sheen:0,envMapIntensity:1.2,emissive:0x101010,emissiveIntensity:.1,bumpScale:.1});
LAB.nail=(col)=>{const gr=new J,m=LAB.metal(col);const sh=new N(new Xe(.09,.09,3.6,12),m);sh.position.y=-1.8;gr.add(sh);const hd=new N(new Xe(.22,.22,.09,16),m);hd.position.y=.04;gr.add(hd);const pt_=new N(new Xe(.09,0,.35,12),m);pt_.position.y=-3.77;gr.add(pt_);gr.userData.m=m;return gr};

/* ---- chemistry batch 1 ---- */
const specSteps=key=>((window.__vaSpecs&&window.__vaSpecs[key])||[]).map((x,i)=>[""+(i+1),x[0],x[1],x[2],x[3],"Hand-modelled · schematic",x[5]||10]);
const labRun=o=>run({n:o.n,g:o.g,org:[],show:{},base:{},ST:specSteps(o.key),cams:o.cams,camK:o.camK,labels:o.labels,hud:o.hud,frame:o.frame,predict:o.predict});
const labScene=()=>{sd=131;const n=new Ne;Ge(n,{key:1.9});Je(n,-1,40,.08);const g=new J;n.add(g);LAB.table(g);return{n,g}};
const Lb=(par,p)=>()=>par.localToWorld(c(...p));
const mkDT=()=>{let lt=0;return t=>{const d=min(.1,max(0,t-lt));lt=t;return d}};
const toward=(p,T,dt,r)=>T>=p?min(T,p+dt*r):max(T,p-dt*.6);
const insAfter=(list,id,t)=>{const i=list.findIndex(x=>x.id===id);list.splice(i<0?list.length:i+1,0,t)};
const stand=(g,x,h)=>{const m=LAB.metal(0x6a707c);const p=new N(new Xe(.12,.12,h,10),m);p.position.set(x,h/2,0);g.add(p);const b=new N(new Xe(1.4,1.4,.25,24),m);b.position.set(x,.1,0);g.add(b);const a=new N(new Xe(.1,.1,3.2,8),m);a.rotation.z=PI/2;a.position.set(x+1.6,h-.8,0);g.add(a)};
/* 1 · displacement */
function Mdisp(){const {n,g}=labScene();
 const V=LAB.vessel(g,0,0,1.9,3.8,"beaker",0x2e6fd6,.72);
 const nail=LAB.nail(0x8a909b);nail.scale.set(1.9,1,1.9);nail.position.set(.2,6.4,0);g.add(nail);
 const dm=MAT(0xc7733a,{roughness:.5,metal:.5,sheen:0,opacity:0,depthWrite:!1});const dep=new N(new Xe(.15,.15,3.5,14),dm);dep.position.y=-1.8;nail.add(dep);
 const ions=LAB.ions(g,70,.1);
 const MG=new J;MG.position.set(8.2,3.2,0);g.add(MG);const ring=new N(new Xe(3.3,3.3,.12,48),MAT(0xcfe3ff,{roughness:.2,opacity:.16,depthWrite:!1,sheen:0}));ring.rotation.x=PI/2;MG.add(ring);
 const at=(col,x,y,r)=>{const m=new N(new it(r,20,16),MAT(col,{roughness:.35,metal:.2,clearcoat:.5,sheen:0,envMapIntensity:.6}));m.position.set(x,y,.2);MG.add(m);return m};
 for(let i=0;i<5;i++)at(0x6b7280,-2.2+i*1.1,-2.3,.45);for(let i=0;i<4;i++)at(0x6b7280,-1.65+i*1.1,-1.5,.45);
 const fe=at(0x6b7280,-1.1,-1.5,.45),cu=at(0x3b82f6,1.3,1.9,.36);
 const wire=new N(new Xe(.05,.05,1,6),new bt({color:0xffd23f}));MG.add(wire);wire.visible=!1;
 const cams=[[c(2.5,6,14),c(2.2,2.6,0)],[c(2.5,6,14),c(2.2,2.6,0)],[c(2.5,6,14),c(2.2,2.6,0)],[c(8.2,3.8,15),c(8.2,3.2,0)]];
 let p=0,ls=-1,DT=mkDT();const T_=[0,.55,1,1];
 const labels=[["d-be","Copper sulphate solution (blue)","कॉपर सल्फ़ेट विलयन (नीला)",Lb(V.v,[1.9,2.6,0]),[0,1,2]],["d-na","Iron nail","लोहे की कील",Lb(nail,[.3,.4,0]),[0,1,2]],["d-de","Reddish-brown copper layer","लाल-भूरी ताँबे की परत",Lb(nail,[.3,-1.8,0]),[1,2]],["d-gr","Fe²⁺ — solution turns pale green","Fe²⁺ — विलयन हरा",Lb(V.v,[-1.9,1.6,0]),[2]],["m-fe","Fe atom → Fe²⁺ (loses 2 e⁻)","Fe परमाणु → Fe²⁺ (2 e⁻ खोता)",Lb(MG,[-1.1,-.3,0]),[3]],["m-cu","Cu²⁺ → Cu atom (gains 2 e⁻)","Cu²⁺ → Cu परमाणु (2 e⁻ पाता)",Lb(MG,[1.3,2.7,0]),[3]],["m-ti","Zoomed particle view","कण-दृश्य (बड़ा)",Lb(MG,[0,3.8,0]),[3]]];
 return labRun({n,g,key:"ch1/displacement",cams,camK:["Setup","Reaction","20 min later","Particles"],labels,
  hud:()=>`Fe + CuSO₄ → FeSO₄ + Cu · reaction ${Math.round(p*100)} %`,
  frame:(s,t)=>{if(ls!==s){ls=s;p=max(p,[0,0,.45,.95][s])}p=toward(p,T_[s],DT(t),.045);
   nail.position.y=lerp(nail.position.y,s===0?6.4:3.9,.05);dm.opacity=cl(p*1.2,0,.95);dm.transparent=!0;
   LAB.tint(V.liqM,new we().setRGB(lerp(.18,.72,p),lerp(.43,.85,p),lerp(.84,.62,p)));
   ions.update(t,{x:0,w:3.2,y0:.4,h:2.5,z:0},1);ions.each((q,i)=>{const hx=i/70<1-p?0x3b82f6:0x6fcf7a;if(q.col!==hx)ions.setCol(i,hx)});
   MG.visible=s===3;const k=ease((t*.18)%1);fe.position.set(-1.1+k*1.2,-1.5+k*3.4,.2);fe.material.color.setHex(k>.55?0x6fcf7a:0x6b7280);cu.position.set(1.3-k*2.4,1.9-k*3.4,.2);cu.material.color.setHex(k>.9?0xc7733a:0x3b82f6);cu.scale.setScalar(k>.9?1.3:1)},
  predict:{q:"Why does the nail turn reddish-brown in copper sulphate solution?",opts:[["Iron is more reactive and displaces copper",!0,"Correct — copper atoms deposit on the nail."],["Copper is more reactive than iron",!1,"Then nothing would happen."],["The nail melts",!1,"No melting at room temperature."]]}})}
Q_("ch1/displacement3d",[["In Fe + CuSO₄ → FeSO₄ + Cu, which element is displaced?","Fe + CuSO₄ → FeSO₄ + Cu में कौन विस्थापित होता है?",["Iron","Copper","Sulphur","Oxygen"],1,"Copper is displaced by the more reactive iron."],["The blue colour fades because…","नीला रंग फीका क्यों?",["Cu²⁺ ions are used up","Water evaporates","The nail dissolves","Light is absorbed"],0,"Cu²⁺ becomes copper atoms."],["This is a…","यह है…",["Combination","Displacement","Decomposition","Neutralisation"],1,"A more reactive metal displaces a less reactive one."]]);
Px["ch1/displacement3d"]=[["Iron tools left in copper-sulphate sprays turn coppery — the same reaction.","नीले थोथे के घोल में लोहे के औज़ार ताँबे जैसे हो जाते हैं — यही अभिक्रिया।"],["Copper plating of objects uses a similar idea — electrons move so Cu²⁺ deposits as metal.","वस्तुओं पर ताँबे की परत चढ़ाना भी इसी विचार पर चलता है।"]];
insAfter(Hi.find(h=>h.no===1).topics,"displacement",{id:"displacement3d",title:"Iron nail in copper sulphate — detailed 3D",hi:"कॉपर सल्फ़ेट में लोहे की कील — विस्तृत 3D",build:Mdisp,ncert:"Ch 1 · displacement reaction"});
/* 2 · neutralisation */
function Mneut(){const {n,g}=labScene();
 const F=LAB.vessel(g,0,0,2.1,4,"flask",0xff3d9a,.42);
 const bu=LAB.vessel(g,0,0,.45,4.2,"beaker",0xffd23f,.95);bu.v.position.y=6.7;
 const tap=new N(new Xe(.24,.24,.5,12),LAB.metal(0xbfc5cf));tap.rotation.z=PI/2;tap.position.set(0,6.5,0);g.add(tap);stand(g,-3,11.4);
 const drop=new N(new it(.16,12,10),new bt({color:0xffd23f,transparent:!0,opacity:.95}));g.add(drop);
 const ions=LAB.ions(g,40,.1);
 const cams=[[c(0,6,20),c(0,5.2,0)],[c(0,6,20),c(0,5.2,0)],[c(0,5,14),c(0,3.2,0)],[c(0,6,20),c(0,5.2,0)]];
 let p=0,ls=-1,DT=mkDT();const T_=[0,.8,1,1];
 const labels=[["n-fl","Flask: NaOH + phenolphthalein (pink)","फ्लास्क: NaOH + फ़िनॉल्फ़थैलीन (गुलाबी)",Lb(F.v,[2.1,1.6,0]),[0,1,3]],["n-bu","Burette: HCl","ब्यूरेट: HCl",Lb(bu.v,[.5,3.5,0]),[0,1,2]],["n-oh","OH⁻ ions (red)","OH⁻ आयन (लाल)",Lb(F.v,[-2,1.4,0]),[0,1]],["n-wa","H⁺ + OH⁻ → H₂O","H⁺ + OH⁻ → H₂O",Lb(F.v,[2.1,2.4,0]),[1,2]],["n-en","End-point: pink just vanishes — pH 7","अंतिम बिंदु: गुलाबी लुप्त — pH 7",Lb(F.v,[0,4.6,0]),[2]],["n-an","Antacid · toothpaste · lime in soil","एंटैसिड · टूथपेस्ट · मिट्टी में चूना",Lb(F.v,[0,4.8,0]),[3]]];
 return labRun({n,g,key:"ch2/neutralisation",cams,camK:["Setup","Add acid","End-point","Uses"],labels,
  hud:()=>`HCl added: ${Math.round(p*6)} drops · pH ≈ ${(p<.99?13-6*p:7).toFixed(1)} · ${p<.99?"still BASIC (pink)":"NEUTRAL — pink gone"}`,
  frame:(s,t)=>{if(ls!==s){ls=s;p=max(p,[0,0,.7,1][s])}p=toward(p,T_[s],DT(t),.05);
   LAB.tint(F.liqM,new we(0xff2d8a).lerp(new we(0xeaf6ff),cl(p*1.1,0,1)));F.set(.5+.05*p);bu.set(.95-.18*p);
   const act=(s===1||s===2)&&p<.98,ph=(t*.7)%1;drop.visible=act;if(act)drop.position.set(0,lerp(6.2,2.3,ph*ph),0);
   ions.update(t,{x:0,w:1.5,y0:.35,h:1.1,z:0},.9);ions.each((q,i)=>{const gone=i%2===1&&i/40<p;const hx=i%2?(gone?0xeaf4ff:0xe53935):0xf5c542;if(q.col!==hx)ions.setCol(i,hx)})},
  predict:{q:"Antacid tablets relieve acidity because they are…",opts:[["Bases that neutralise stomach acid",!0,"Correct — acid + base → salt + water."],["Acids",!1,"That would make it worse."],["Salts that cool the stomach",!1,"They work by neutralisation."]]}})}
Q_("ch2/neutralisation3d",[["Neutralisation gives…","उदासीनीकरण से मिलता है…",["Salt and water","Acid and base","Salt and hydrogen","Oxide only"],0,"Acid + base → salt + water."],["Phenolphthalein turns colourless when the solution becomes…","फ़िनॉल्फ़थैलीन रंगहीन कब होता है?",["Basic","Neutral/acidic","Concentrated","Hot"],1,"It is colourless in acid."],["pH at the end-point of strong acid–strong base titration is…","अंतिम बिंदु पर pH…",["1","7","10","14"],1,"Neutral solution."]]);
Px["ch2/neutralisation3d"]=[["Rubbing baking soda on an ant bite neutralises the formic acid.","चींटी के डंक पर बेकिंग सोडा फ़ॉर्मिक अम्ल को उदासीन करता है।"],["Milk of magnesia (Mg(OH)₂) is a mild base used to treat stomach acidity.","मिल्क ऑफ़ मैग्नीशिया (Mg(OH)₂) हल्का क्षार है, अम्लता में उपयोगी।"]];
insAfter(Hi.find(h=>h.no===2).topics,"neutralisation",{id:"neutralisation3d",title:"Neutralisation — detailed 3D",hi:"उदासीनीकरण — विस्तृत 3D",build:Mneut,ncert:"Ch 2 · neutralisation"});
/* 3 · pH */
function Mph(){const {n,g}=labScene();
 const PH=[[1,0xe53935],[3,0xff8f1f],[5,0xf4d21f],[7,0x2e9a54],[9,0x2a8fb0],[11,0x3a4fd6],[13,0x8a3fd6]];
 const T=PH.map((q,i)=>LAB.vessel(g,-9+i*3,0,.75,5,"beaker",0xe4f0ff,.55));
 const strip=PH.map((q,i)=>{const b=new N(new _e(3,.5,.3),new bt({color:q[1]}));b.position.set(-9+i*3,7.2,0);g.add(b);return b});
 const dr=new J;g.add(dr);const db=new N(new Xe(.16,.16,1.5,12),MAT(0x2a2e38,{roughness:.5,sheen:0}));dr.add(db);const dt=new N(new Xe(.34,.34,.5,12),MAT(0xc0392b,{roughness:.6,sheen:0}));dt.position.y=1;dr.add(dt);
 const mk=new N(new Xe(0,.4,.8,10),new bt({color:0x111111}));mk.rotation.x=PI;g.add(mk);
 const cams=[[c(0,6.5,25),c(0,3.2,0)],[c(0,6.5,25),c(0,3.2,0)],[c(0,6,21),c(0,3.5,0)],[c(0,6.5,25),c(0,3.2,0)]];
 let fill=0,ls=-1,DT=mkDT();
 const lab=(id,en,hi,x,y,st)=>[id,en,hi,Lb(g,[x,y,0]),st];
 const labels=[lab("p-ac","ACIDS · pH < 7","अम्ल · pH < 7",-9,8.4,[1,2,3]),lab("p-ne","NEUTRAL · pH 7","उदासीन · pH 7",0,8.4,[1,2,3]),lab("p-ba","BASES · pH > 7","क्षार · pH > 7",9,8.4,[1,2,3]),lab("p-hc","HCl · pH ≈ 1","HCl · pH ≈ 1",-9,6.2,[1,2]),lab("p-le","Lemon · pH 2–3","नींबू · pH 2–3",-6,6.2,[2]),lab("p-bl","Blood · pH 7.4","रक्त · pH 7.4",0,6.2,[3]),lab("p-so","Soap · pH 10–11","साबुन · pH 10–11",6,6.2,[2]),lab("p-na","NaOH · pH 14","NaOH · pH 14",9,6.2,[1,2])];
 return labRun({n,g,key:"ch2/ph",cams,camK:["Tubes","Indicator","Strong / weak","In life"],labels,
  hud:s=>s>=1?"Universal indicator: red/orange = acid · green = neutral · blue/violet = base":"Seven tubes of clear liquid",
  frame:(s,t)=>{if(ls!==s){ls=s;fill=max(fill,s>=2?1:0)}fill=toward(fill,s>=1?1:0,DT(t),.12);PH.forEach((q,i)=>{const k=cl(fill*1.5-i*.1,0,1);LAB.tint(T[i].liqM,new we(0xe4f0ff).lerp(new we(q[1]),k))});
   dr.visible=s===1&&fill<.95;if(dr.visible){const i=cl(Math.floor(fill*7.5),0,6);dr.position.set(-9+i*3,6.4+.4*Math.sin(t*5),0)}
   const i=s>=2?Math.floor(t*.5)%7:3;mk.position.set(-9+i*3,6.6,0);mk.visible=s>=2},
  predict:{q:"A solution turns universal indicator green. Its pH is about…",opts:[["1",!1,"Red means strong acid."],["7",!0,"Correct — green is neutral."],["14",!1,"Violet means strong base."]]}})}
Q_("ch2/ph3d",[["pH of a neutral solution is…","उदासीन विलयन का pH…",["0","7","14","1"],1,"pH 7."],["Which has the lowest pH?","किसका pH सबसे कम?",["Lemon juice","Soap","Water","Baking soda solution"],0,"Lemon juice is acidic."],["Universal indicator in a base shows…","क्षार में सार्वत्रिक सूचक…",["Red","Green","Blue/violet","Colourless"],2,"Blue to violet."]]);
Px["ch2/ph3d"]=[["Tooth decay begins when mouth pH falls below ~5.5 — brush after sweets.","मुँह का pH 5.5 से नीचे जाने पर दाँत सड़ते हैं — मीठे के बाद ब्रश करें।"],["Human blood is kept at pH 7.35–7.45; a small change is dangerous.","मानव रक्त का pH 7.35–7.45 रहता है; थोड़ा परिवर्तन भी ख़तरनाक।"]];
insAfter(Hi.find(h=>h.no===2).topics,"ph",{id:"ph3d",title:"pH scale & universal indicator — detailed 3D",hi:"pH पैमाना व सार्वत्रिक सूचक — विस्तृत 3D",build:Mph,ncert:"Ch 2 · pH scale"});

/* 4 · reactivity series */
function Mreact(){const {n,g}=labScene();
 const SER=[["K",0x8e5bd6],["Na",0xd65b8e],["Ca",0xd68a3a],["Mg",0xc9b21f],["Al",0x6fa8d6],["Zn",0x5f7a99],["Fe",0x4a4f5a],["Pb",0x3a3f4a],["H",0xffffff],["Cu",0xc7733a],["Ag",0xb8bec8],["Au",0xe0b030]];
 const bars=SER.map((q,i)=>{const b=new N(new _e(1.6,1.0,.8),q[0]==="H"?new bt({color:0xdfeeff,transparent:!0,opacity:.7}):LAB.metal(q[1],.35));b.position.set(-9+i*1.64,9.2-i*.05,-1.5);g.add(b);return b});
 const arrow=new N(new Xe(.08,.08,19,8),new bt({color:0x1d4ed8}));arrow.rotation.z=PI/2;arrow.position.set(0,7.9,-1.5);g.add(arrow);
 const hdr=new N(new Xe(.5,0,.8,12),new bt({color:0x1d4ed8}));hdr.rotation.z=-PI/2;hdr.position.set(9.6,7.9,-1.5);g.add(hdr);
 const V=LAB.vessel(g,0,0,2,3.8,"beaker",0x2e6fd6,.72);
 const sm=LAB.metal(0x9aa5b4,.35);const strip=new N(new _e(.45,3.6,.1),sm);g.add(strip);
 const dm=MAT(0xc7733a,{roughness:.5,metal:.5,sheen:0,opacity:0,depthWrite:!1});dm.transparent=!0;const dep=new N(new _e(.52,3.3,.18),dm);strip.add(dep);dep.position.y=-.1;
 const bub=LAB.bubbles(g,24,.07,0xffffff);
 /* [metal colour, solution colour before, after, deposit colour, reacts] per step */
 const CASE=[null,[0x9aa5b4,0x2e6fd6,0xe6f2ff,0xc7733a,1],[0x6b7280,0x2e6fd6,0x9fd8a2,0xc7733a,1],[0xc7733a,0x9fd8a2,0x9fd8a2,0,0],[0xc7733a,0xe6f2ff,0x3b82f6,0xdfe6ee,1]];
 const cams=[[c(0,8,22),c(0,5,0)],[c(0,6,15),c(0,3.5,0)],[c(0,6,15),c(0,3.5,0)],[c(0,6,15),c(0,3.5,0)],[c(0,6,15),c(0,3.5,0)]];
 let p=0,ls=-1,DT=mkDT();const cur=new we;
 const Lx=(i,y)=>Lb(g,[-9+i*1.64,y,-1.5]);
 const labels=[["r-k","K — most reactive","K — सबसे अभिक्रियाशील",Lx(0,10.2),[0]],["r-au","Au — least reactive","Au — सबसे कम अभिक्रियाशील",Lx(11,10.2),[0]],["r-fe","Fe","Fe",Lx(6,10.2),[0]],["r-cu","Cu","Cu",Lx(9,10.2),[0]],["r-ag","Ag","Ag",Lx(10,10.2),[0]],["r-ar","Reactivity decreases →","अभिक्रियाशीलता घटती है →",Lb(g,[0,7.3,-1.5]),[0]],["r-st","Metal strip","धातु की पट्टी",Lb(strip,[.5,1.5,0]),[1,2,3,4]],["r-so","Salt solution","लवण विलयन",Lb(V.v,[2,2.4,0]),[1,2,3,4]],["r-no","NO reaction — Cu is below Fe","कोई अभिक्रिया नहीं — Cu, Fe से नीचे",Lb(V.v,[-2,3.2,0]),[3]],["r-de","Displaced metal deposits","विस्थापित धातु जमती है",Lb(strip,[-.5,-.8,0]),[1,2,4]]];
 return labRun({n,g,key:"ch3/reactivity",cams,camK:["Series","Zn in CuSO₄","Fe in CuSO₄","Cu in FeSO₄","Cu in AgNO₃"],labels,
  hud:s=>s===0?"K > Na > Ca > Mg > Al > Zn > Fe > Pb > H > Cu > Ag > Au":(CASE[s][4]?"Reaction: "+Math.round(p*100)+" %":"No reaction (0 %)"),
  frame:(s,t)=>{bars.forEach(b=>b.visible=s===0);arrow.visible=hdr.visible=s===0;const C=CASE[s];
   if(ls!==s){ls=s;p=C&&C[4]?.5:0}
   const show=s>0;strip.visible=show;V.v.visible=true;
   if(C){sm.color.setHex(C[0]);strip.position.set(.2,show?lerp(strip.position.y,3.0,.06):6,0);if(s===4)dm.color.setHex(C[3]);else dm.color.setHex(C[3]||0xc7733a);p=toward(p,C[4]?1:0,DT(t),.07);if(C[4]){dep.visible=!0;dm.opacity=cl(p*1.1,0,.95)}else{dm.opacity=0}
    LAB.tint(V.liqM,cur.setHex(C[1]).lerp(new we(C[2]),p));V.set(.72)}
   else{strip.position.set(.2,8,0);dm.opacity=0;LAB.tint(V.liqM,cur.setHex(0xe6f2ff));p=0}
   bub.update(t,{x:.2,y0:.8,y1:3.3,z:0,rad:.5},C&&C[4]&&p<.98?1:0)},
  predict:{q:"Will copper displace iron from iron sulphate solution?",opts:[["No — copper is less reactive than iron",!0,"Correct — only a more reactive metal displaces."],["Yes — copper is heavier",!1,"Weight does not matter."],["Yes — it is a shiny metal",!1,"Reactivity decides."]]}})}
Q_("ch3/reactivity3d",[["Which is more reactive?","कौन अधिक अभिक्रियाशील?",["Cu","Zn","Ag","Au"],1,"Zn is above Cu."],["Cu + FeSO₄ →","Cu + FeSO₄ →",["Fe + CuSO₄","No reaction","Cu₂O","FeO"],1,"Cu is below Fe."],["Which metal displaces silver from AgNO₃?","AgNO₃ से चाँदी कौन विस्थापित करता है?",["Au","Cu","Pt","None"],1,"Cu is above Ag."]]);
Px["ch3/reactivity3d"]=[["Gold stays shiny for thousands of years — it sits at the bottom of the reactivity series.","सोना हज़ारों वर्ष चमकता रहता है — वह क्रियाशीलता श्रेणी में सबसे नीचे है।"],["Sodium and potassium are stored under kerosene because they react with air and water.","सोडियम व पोटैशियम को मिट्टी के तेल में रखते हैं क्योंकि वे वायु-जल से अभिक्रिया करते हैं।"]];
insAfter(Hi.find(h=>h.no===3).topics,"reactivity",{id:"reactivity3d",title:"Reactivity series & displacement — detailed 3D",hi:"क्रियाशीलता श्रेणी व विस्थापन — विस्तृत 3D",build:Mreact,ncert:"Ch 3 · reactivity series"});
/* 5 · corrosion */
function Mcorr(){const {n,g}=labScene();
 const XS=[-6,0,6],KIND=["Dry air (CaCl₂ absorbs moisture)","Boiled water + oil layer (no air)","Moist air (water + oxygen)"],HI=["सूखी हवा (CaCl₂)","उबला जल + तेल (वायु नहीं)","नम वायु (जल + ऑक्सीजन)"];
 const S1=new J;g.add(S1);const T=XS.map((x,i)=>{const v=LAB.vessel(g,x,0,1.0,6,"beaker",i===0?0xffffff:0xdff0ff,i===0?.05:i===1?.6:.35);const nl=LAB.nail(0x8a909b);nl.scale.set(1.8,1,1.8);nl.position.set(x,5.2,0);g.add(nl);const rm=MAT(0xa5481f,{roughness:.9,metal:0,sheen:0,opacity:0,depthWrite:!1,bumpScale:.5});rm.transparent=!0;const rust=new N(new Xe(.14,.14,3.5,14),rm);rust.position.y=-1.85;nl.add(rust);
  if(i===1){const oil=new N(new Xe(.95,.95,.35,28),LAB.liqM(0xe8b830));oil.position.set(x,4.1+.2,0);S1.add(oil)}
  if(i===0){const cc=new N(new Xe(.8,.8,.5,20),MAT(0xf2f2f2,{roughness:.9,sheen:0}));cc.position.set(x,.4,0);S1.add(cc)}
  const cork=new N(new Xe(1.05,1.05,.4,24),MAT(0xc58b4b,{roughness:.9,sheen:0}));cork.position.set(x,6.1,0);if(i!==2)S1.add(cork);
  return{v,nl,rm}});
 const sw=(x,col)=>{const b=new N(new _e(2.2,2.2,.25),LAB.metal(col,.3));b.position.set(x,2,0);g.add(b);return b};
 const ag=sw(-5,0xe6e9ee),cu=sw(0,0xc7733a),fe=sw(5,0x6b7280);ag.visible=cu.visible=fe.visible=!1;
 const oilF=LAB.vessel(g,-4,0,1.3,2.6,"beaker",0xe8c040,.8),oilR=LAB.vessel(g,4,0,1.3,2.6,"beaker",0xc4a050,.8);oilF.v.visible=oilR.v.visible=!1;
 const gas=LAB.bubbles(g,20,.09,0xd9e8ff);
 let day=0,ls=-1,DT=mkDT();const cams=[[c(0,6,20),c(0,3.5,0)],[c(0,6,20),c(0,3.5,0)],[c(0,3.5,14),c(0,1.6,0)],[c(0,3.5,14),c(0,1.4,0)]];
 const labels=[["c-1",KIND[0],HI[0],Lb(g,[-6,7.3,0]),[0,1]],["c-2",KIND[1],HI[1],Lb(g,[0,7.3,0]),[0,1]],["c-3",KIND[2],HI[2],Lb(g,[6,7.3,0]),[0,1]],["c-ru","Rust: hydrated iron oxide Fe₂O₃·xH₂O","जंग: जलयोजित आयरन ऑक्साइड",Lb(T[2].nl,[.4,-1.8,0]),[1]],["c-ag","Silver tarnish Ag₂S (black)","चाँदी: Ag₂S (काला)",Lb(g,[-5,3.5,0]),[2]],["c-cu","Copper patina (green)","ताँबा: हरी परत",Lb(g,[0,3.5,0]),[2]],["c-fe","Iron rust (brown)","लोहा: जंग (भूरा)",Lb(g,[5,3.5,0]),[2]],["c-ra","Rancid oil: bad smell","तेल खट्टा: दुर्गंध",Lb(g,[4,3.4,0]),[3]],["c-n2","Chips in nitrogen: no oxidation","चिप्स नाइट्रोजन में: ऑक्सीकरण नहीं",Lb(g,[-4,3.4,0]),[3]]];
 return labRun({n,g,key:"ch1/corrosion",cams,camK:["Three tubes","Days pass","Other metals","Rancidity"],labels,
  hud:s=>s<=1?`Day ${Math.round(day*14)}: only the tube with water AND air shows rust`:s===2?"Corrosion = slow attack on metals by air, moisture, acids":"Fats + O₂ → oxidised, rancid",
  frame:(s,t)=>{S1.visible=s<=1;if(ls!==s){ls=s;if(s>=2)day=1;if(s===0)day=0;if(s===1)day=Math.max(day,.4)}day=toward(day,s>=1?1:0,DT(t),.07);
   T.forEach((q,i)=>{q.rm.opacity=i===2?cl(day*1.3,0,.97):0;q.nl.visible=s<=1;q.v.v.visible=s<=1});
   T[0].v.v.children.forEach(()=>0);
   ag.visible=cu.visible=fe.visible=s===2;const k=s===2?cl(.45+(t%12)/14,0,1):0;ag.material.color.setHex(0xe6e9ee).lerp(new we(0x2a2d33),k);cu.material.color.setHex(0xc7733a).lerp(new we(0x4fa58c),k);fe.material.color.setHex(0x6b7280).lerp(new we(0xa5481f),k);
   oilF.v.visible=oilR.v.visible=s===3;const r_=s===3?cl(t%10/7,0,1):0;LAB.tint(oilR.liqM,new we(0xe8c040).lerp(new we(0x6a4a1c),r_));
   gas.update(t,{x:4,y0:2.8,y1:5,z:0,rad:.9},s===3?.8*r_:0)},
  predict:{q:"Which nail rusts?",opts:[["Only the one in moist air (water + oxygen)",!0,"Correct — both oxygen and water are needed."],["The one in dry air",!1,"No moisture — no rust."],["All three equally",!1,"Rust needs both air and water."]]}})}
Q_("ch1/corrosion3d",[["Rusting needs…","जंग के लिए चाहिए…",["Only air","Only water","Air and water","Only heat"],2,"Both oxygen and moisture."],["Silver tarnishes black due to…","चाँदी काली पड़ती है…",["Ag₂S","Ag₂O","AgCl","Ag₂CO₃"],0,"Reaction with sulphur compounds in air."],["Chips are packed in nitrogen to prevent…","चिप्स नाइट्रोजन में क्यों?",["Rancidity","Melting","Freezing","Rusting"],0,"Nitrogen prevents oxidation of oil."]]);
Px["ch1/corrosion3d"]=[["Galvanising coats iron with zinc so it rusts far more slowly.","गैल्वनीकरण लोहे पर ज़िंक की परत चढ़ाकर जंग रोकता है।"],["The iron pillar of Delhi has stood for 1,600 years because of its special composition.","दिल्ली का लौह स्तंभ अपनी विशेष संरचना से 1,600 वर्ष से खड़ा है।"]];
insAfter(Hi.find(h=>h.no===1).topics,"corrosion",{id:"corrosion3d",title:"Rusting & corrosion — detailed 3D",hi:"जंग व संक्षारण — विस्तृत 3D",build:Mcorr,ncert:"Ch 1 · corrosion & rancidity"});
/* 6 · combination & decomposition */
function Mcomb(){const {n,g}=labScene();
 const A=LAB.vessel(g,-9,0,1.7,3.2,"beaker",0xdff0ff,.6);const lump=[0,1,2].map(i=>{const m=new N(sph(.42,.25,1.5,1,.8,1,12,16),MAT(0xf5f5f0,{roughness:.9,sheen:0}));m.position.set(-9.6+i*.55,.55+.15*i,.2*(i-1));g.add(m);return m});
 const th=new N(new Xe(.08,.08,3.6,8),new bt({color:0xe8eef6}));th.position.set(-7.6,2.4,.3);g.add(th);const mer=new N(new Xe(.05,.05,1,8),new bt({color:0xe53935}));g.add(mer);
 const stB=(x)=>stand(g,x+1.5,6);
 const B=LAB.vessel(g,0,0,.7,3.4,"beaker",0xdfeaf5,.001);B.v.position.y=3.3;const cr=new N(new Xe(.58,.58,.7,16),MAT(0x6fcf7a,{roughness:.7,sheen:0}));cr.position.set(0,3.75,0);g.add(cr);stB(0);const fl=LAB.flame(g,0,0);
 const fume=LAB.bubbles(g,18,.1,0x8a5a2a);
 const E=LAB.vessel(g,9,0,1.9,3.4,"beaker",0xdff0ff,.75);
 const el=[7.9,10.1].map(x=>{const e=new N(new Xe(.1,.1,2.6,10),LAB.metal(0x333a44));e.position.set(x,1.6,0);g.add(e);return e});
 const tubeH=new N(new Xe(.45,.45,2.4,20,1,!0),LAB.glassM());tubeH.position.set(7.9,4.6,0);g.add(tubeH);const tubeO=new N(new Xe(.45,.45,2.4,20,1,!0),LAB.glassM());tubeO.position.set(10.1,4.6,0);g.add(tubeO);
 const gH=new N(new Xe(.4,.4,1,16),new bt({color:0xbcd4ff,transparent:!0,opacity:.7}));const gO=new N(new Xe(.4,.4,1,16),new bt({color:0xffd1d1,transparent:!0,opacity:.7}));g.add(gH);g.add(gO);
 const bH=LAB.bubbles(g,16,.07,0xffffff),bO=LAB.bubbles(g,10,.07,0xffffff);
 const bat=new N(new _e(1.6,.9,.9),MAT(0x2a2e38,{roughness:.6,sheen:0}));bat.position.set(9,.5,-3);g.add(bat);
 let p=0,ls=-1,DT=mkDT();const cams=[[c(0,6,28),c(0,3.2,0)],[c(-9,5,13),c(-9,2.2,0)],[c(0,6.5,13),c(0,3.8,0)],[c(9,4.5,15),c(9,2.6,0)],[c(0,6,28),c(0,3.2,0)]];
 const labels=[["a-ca","CaO + H₂O → Ca(OH)₂ + heat","CaO + H₂O → Ca(OH)₂ + ऊष्मा",Lb(A.v,[1.9,2.6,0]),[0,1,4]],["a-th","Temperature rises (exothermic)","ताप बढ़ता है (ऊष्माक्षेपी)",Lb(g,[-7.6,4.5,0]),[1]],["b-fe","FeSO₄ crystals: green → brown","FeSO₄ क्रिस्टल: हरा → भूरा",Lb(g,[0,5.2,0]),[2,4]],["b-gs","SO₂ + SO₃ fumes","SO₂ + SO₃ धुआँ",Lb(g,[1,6.4,0]),[2]],["b-fl","Burner flame (heat)","बर्नर की लौ (ऊष्मा)",Lb(fl,[.6,1.4,0]),[2]],["c-h2","H₂ at cathode (2 volumes)","कैथोड पर H₂ (2 आयतन)",Lb(g,[7.4,6.2,0]),[3]],["c-o2","O₂ at anode (1 volume)","ऐनोड पर O₂ (1 आयतन)",Lb(g,[10.6,6.2,0]),[3]],["c-bt","DC supply","DC स्रोत",Lb(bat,[0,1,0]),[3]]];
 return labRun({n,g,key:"ch1/combination",cams,camK:["Overview","Combination","Heat","Electricity","Summary"],labels,
  hud:s=>s===1?`Quicklime + water: temperature ${Math.round(25+p*45)} °C`:s===2?`Heating FeSO₄: ${Math.round(p*100)} % decomposed`:s===3?`Electrolysis: H₂ : O₂ = 2 : 1 (${Math.round(p*100)} %)`:"Combination: A + B → AB · Decomposition: AB → A + B",
  frame:(s,t)=>{if(ls!==s){ls=s;p=s===4?1:(s>=1?.45:0)}p=toward(p,s===0?0:1,DT(t),.07);
   const q1=s===1?p:s>=2?1:0,q2=s===2?p:s>=3?1:0,q3=s===3?p:s>=4?1:0;
   LAB.tint(A.liqM,new we(0xdff0ff).lerp(new we(0xffffff),q1));lump.forEach((m,i)=>{m.scale.setScalar(1-.6*q1);m.visible=q1<.95});
   mer.scale.y=.4+q1*2.4;mer.position.set(-7.6,1.0+(.4+q1*2.4)/2,.3);
   cr.material.color.setHex(0x6fcf7a);cr.material.color.lerp(new we(0x8b3a1a),q2);fl.userData.upd(s===2&&q2<.98,t);fume.m.visible=!0;fume.update(t,{x:0,y0:4.2,y1:7.6,z:0,rad:.4},s===2&&q2<.98?.9:0);
   gH.scale.set(1,.1+q3*2,1);gH.position.set(7.9,4.6-1.2+(.1+q3*2)/2,0);gO.scale.set(1,.1+q3*1,1);gO.position.set(10.1,4.6-1.2+(.1+q3*1)/2,0);
   bH.update(t,{x:7.9,y0:1.1,y1:3.2,z:0,rad:.2},s===3&&q3<.98?1:0);bO.update(t,{x:10.1,y0:1.1,y1:3.2,z:0,rad:.2},s===3&&q3<.98?.7:0);
   if(s===1&&q1<.98)A.liq.position.y=A.liq.position.y},
  predict:{q:"In electrolysis of water, the volume of hydrogen compared to oxygen is…",opts:[["Twice",!0,"Correct — 2H₂O → 2H₂ + O₂."],["Equal",!1,"The ratio of H : O in water is 2 : 1."],["Half",!1,"Hydrogen is double."]]}})}
Q_("ch1/combination3d",[["CaO + H₂O → Ca(OH)₂ is a…","CaO + H₂O → Ca(OH)₂ है…",["Decomposition","Combination (exothermic)","Displacement","Double displacement"],1,"Two substances join and heat is released."],["Heating green FeSO₄ crystals gives…","हरे FeSO₄ को गर्म करने पर…",["Fe₂O₃ + SO₂ + SO₃","FeO only","Fe + S","No change"],0,"Brown Fe₂O₃ forms."],["At the cathode, electrolysis of water gives…","जल के विद्युत-अपघटन में कैथोड पर…",["O₂","H₂","CO₂","N₂"],1,"Hydrogen, double volume."]]);
Px["ch1/combination3d"]=[["Whitewashing a wall: quicklime is slaked with water (heat!), then CaCO₃ forms on the wall.","दीवार की पुताई: चूने को जल में बुझाते हैं (ऊष्मा!), फिर दीवार पर CaCO₃ बनता है।"],["Photographic film darkens because silver bromide decomposes in light.","सिल्वर ब्रोमाइड प्रकाश में अपघटित होने से फ़िल्म काली पड़ती है।"]];
insAfter(Hi.find(h=>h.no===1).topics,"combination",{id:"combination3d",title:"Combination & decomposition — detailed 3D",hi:"संयोजन व अपघटन — विस्तृत 3D",build:Mcomb,ncert:"Ch 1 · types of reactions"});

})();
