const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert');
const root=path.resolve(__dirname,'..');const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const shell=JSON.parse(sw.match(/SHELL=(\[.*?\]);/s)[1]),ver=sw.match(/VERSION="([a-f0-9]+)"/)[1];
for(const f of shell)if(f!=='./')assert(fs.existsSync(path.join(root,f)),'sw precache file missing: '+f);
const h=crypto.createHash('sha1');for(const f of shell){if(f!=='./')h.update(f+fs.statSync(path.join(root,f)).size+crypto.createHash('md5').update(fs.readFileSync(path.join(root,f))).digest('hex'))}
assert.strictEqual(h.digest('hex').slice(0,10),ver,'sw.js is stale — run: node tools/build-pwa.mjs');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert(html.includes('rel="manifest" href="manifest.webmanifest"'),'manifest link missing');
const m=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));assert(m.icons.length>=3&&m.start_url&&m.name);for(const i of m.icons)assert(fs.existsSync(path.join(root,i.src)),'icon missing '+i.src);
console.log(`PWA OK · ${shell.length} precached files · version ${ver}`);
