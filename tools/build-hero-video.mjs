/* Renders the home-page hero video: the app's anatomical heart + lungs + great vessels, beating at 72 bpm with flowing blood.
   Usage: node tools/build-hero-video.mjs [--size 1000] [--fps 30]   (needs Playwright with Chromium and ffmpeg on PATH)
   Output: assets/home/heart-circulation.{webm,mp4} and heart-circulation-poster.webp — a seamless 10 s loop (12 beats, 2 breaths, 1 camera sway). */
import fs from "node:fs";import path from "node:path";import http from "node:http";import {spawnSync} from "node:child_process";import {createRequire} from "node:module";
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),"..");const require=createRequire(import.meta.url);
let chromium;try{({chromium}=require("playwright"))}catch{({chromium}=require(path.join(process.env.NODE_PATH||"","playwright")))}
const arg=(k,d)=>{const i=process.argv.indexOf("--"+k);return i>0?+process.argv[i+1]:d},SIZE=arg("size",1000),FPS=arg("fps",30),LOOP=10,L=LOOP*FPS,F=Math.round(FPS*1.2);
const MIME={".html":"text/html",".js":"text/javascript",".wasm":"application/wasm",".glb":"model/gltf-binary",".json":"application/json"};
const srv=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split("?")[0]));if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end()}r.writeHead(200,{"Content-Type":MIME[path.extname(f)]||"application/octet-stream"});fs.createReadStream(f).pipe(r)}).listen(0);
const port=srv.address().port,tmp=fs.mkdtempSync(path.join(process.env.TMPDIR||"/tmp","hero-"));
const b=await chromium.launch({args:["--use-gl=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]}),p=await b.newPage({viewport:{width:SIZE,height:SIZE}});
await p.goto(`http://localhost:${port}/tools/hero-heart/index.html?size=${SIZE}`);await p.waitForFunction(()=>window.__ready,null,{timeout:120000});
for(let i=0;i<L+F;i++){const t=i/FPS;const d=await p.evaluate(t=>{window.renderAt(t);return document.querySelector("canvas").toDataURL("image/png").split(",")[1]},t);fs.writeFileSync(path.join(tmp,`r${String(i).padStart(4,"0")}.png`),Buffer.from(d,"base64"));if(i%30===0)console.log("frame",i,"/",L+F)}
await b.close();srv.close();
/* seamless loop: for the first F frames blend the continuation (frame L+i) into frame i so particles do not jump at the loop point */
const dir=path.join(tmp,"loop");fs.mkdirSync(dir);
for(let i=0;i<L;i++){const out=path.join(dir,`f${String(i).padStart(4,"0")}.png`);if(i<F){const a=path.join(tmp,`r${String(i).padStart(4,"0")}.png`),c=path.join(tmp,`r${String(L+i).padStart(4,"0")}.png`),w=(i/F).toFixed(4);
 const r=spawnSync("ffmpeg",["-y","-loglevel","error","-i",c,"-i",a,"-filter_complex",`[0][1]blend=all_expr='A*(1-${w})+B*${w}'`,"-frames:v","1",out]);if(r.status)throw new Error("ffmpeg blend failed")}else fs.copyFileSync(path.join(tmp,`r${String(i).padStart(4,"0")}.png`),out)}
const out=path.join(root,"assets/home"),run=a=>{const r=spawnSync("ffmpeg",["-y","-loglevel","error",...a]);if(r.status)throw new Error("ffmpeg failed: "+a.join(" "))};
fs.mkdirSync(out,{recursive:true});
run(["-framerate",String(FPS),"-i",path.join(dir,"f%04d.png"),"-c:v","libvpx-vp9","-b:v","0","-crf","35","-pix_fmt","yuv420p","-an",path.join(out,"heart-circulation.webm")]);
run(["-framerate",String(FPS),"-i",path.join(dir,"f%04d.png"),"-c:v","libx264","-crf","27","-preset","slow","-pix_fmt","yuv420p","-movflags","+faststart","-an",path.join(out,"heart-circulation.mp4")]);
run(["-i",path.join(dir,"f0020.png"),"-quality","84",path.join(out,"heart-circulation-poster.webp")]);
fs.rmSync(tmp,{recursive:true,force:true});console.log("hero video written to assets/home/");
