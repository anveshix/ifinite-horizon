/* ===== Custom model sets 1-5: animal cell, plant cell, bacterium, atomic models, neuron/synapse/reflex, kidney/nephron/dialysis (detailed 3D) =====
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
   const i=ST[s];$e(`<b>${i[0]} · ${i[1]}</b> <span style="color:var(--hi)">/ ${i[2]}</span><br><span style="color:#ffd36b">${i[5]}</span> · ${i[3]}<br><span style="color:#9fb3cf;font-size:.82em">Hand-modelled procedural geometry (no imported mesh). Sizes are not to scale; particles and motion are schematic.</span>`)}}}
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
 add("medulla",param(2,2,(u,v)=>[-6+u*13,-9+v*11.2,-1.6]),MAT(0xffb88a,{roughness:.6,opacity:.1,depthWrite:!1,sheen:0,envMapIntensity:.2}),[0,0,0],{parent:NP_,ns:1});
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
 const cams=[[c(0,1.4,19),c(0,-2,0)],[c(0,0,11),c(0,.2,0)],[c(21,-.5,28),c(21,-.5,0)],[c(21,5.6,12),c(21.4,5.6,0)],[c(21,3.2,12),c(20.8,3.2,0)],[c(24.4,-2.4,18),c(24.4,-2.4,0)],[c(0,-1,16),c(0,-3,0)],[c(0,-22,19),c(0,-24,0)]];
 const camK=["System","Kidney","Nephron","Filtration","Reabsorption","Loop & urine","Urine path","Dialysis"];
 const show={};const rows={kid:[1,0,0,0,0,0,1,0],cortex:[1,1,0,0,0,0,1,0],medulla:[1,1,1,0,0,1,1,0],pelvis:[1,1,0,0,0,0,1,0],ureter:[1,1,0,0,0,0,1,0],bladder:[1,0,0,0,0,0,1,0],renalA:[1,1,0,0,0,0,1,0],renalV:[1,1,0,0,0,0,1,0],
  bow:[0,0,1,1,1,1,0,0],glom:[0,0,1,1,1,0,0,0],aff:[0,0,1,1,0,0,0,0],eff:[0,0,1,1,1,0,0,0],pct:[0,0,1,1,1,1,0,0],loop:[0,0,1,0,0,1,0,0],dct:[0,0,1,0,0,1,0,0],duct:[0,0,1,0,0,1,0,0],cap:[0,0,1,0,1,0,0,0],dia:[0,0,0,0,0,0,0,1]};
 Object.assign(show,rows);
 const base={kid:0,cortex:.55,medulla:.95,pelvis:1,ureter:1,bladder:.8,renalA:1,renalV:1,bow:.8,glom:1,aff:1,eff:1,pct:.8,loop:.8,dct:.8,duct:.8,cap:.55,dia:.22};
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
})();
