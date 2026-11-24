/* Accessibility helpers: colour-safe mode (red–green daltonisation filter + shape cues), applied to the 3D stage and 2D diagrams. */
(()=>{"use strict";
const NS="http://www.w3.org/2000/svg",LS={get:k=>{try{return localStorage.getItem(k)}catch{return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch{}}};
const svg=document.createElementNS(NS,"svg");svg.setAttribute("width","0");svg.setAttribute("height","0");svg.setAttribute("aria-hidden","true");svg.style.position="absolute";
svg.innerHTML='<filter id="vaCB" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  -0.4375 1.4375 0 0 0  0.2625 -0.5625 1.3 0 0  0 0 0 1 0"/></filter>';
document.body.appendChild(svg);
const st=document.createElement("style");st.textContent="body.va-cb #stage,body.va-cb #v2dWrap img,body.va-cb .va-2dthumb img,body.va-cb #vaMindMap svg{filter:url(#vaCB)}body.va-cb .va-cbnote{display:block}.va-parts{position:absolute;left:10px;bottom:64px;z-index:7;max-height:52%;overflow:auto;background:var(--glass,#fff);color:var(--ink,#111);border:1px solid var(--bd,#999);border-radius:10px;padding:6px 10px;font-size:13px}.va-parts:not([open]):not(:focus-within){clip-path:inset(50%);width:1px;height:1px;overflow:hidden;padding:0;border:0}.va-parts[hidden]{display:none}.va-parts ul{list-style:none;margin:6px 0 0;padding:0}.va-parts button{display:block;width:100%;text-align:left;min-height:36px;background:transparent;border:0;border-bottom:1px solid var(--bd,#ddd);font:inherit;color:inherit;cursor:pointer}.va-parts button:focus-visible{outline:3px solid var(--acc,#1565c0);outline-offset:-2px}.xhits{list-style:none;margin:0;padding:0 8px}.xhits a small.cls{display:block;opacity:.75}.unit.nomatch{opacity:.8}";document.head.appendChild(st);
const btn=document.getElementById("cbmode");
function apply(on){document.body.classList.toggle("va-cb",on);if(btn){btn.setAttribute("aria-pressed",String(on));btn.classList.toggle("on",on)}window.__vaColourSafe=on;window.dispatchEvent(new Event("va-colour-safe"))}
apply(LS.get("va.cb")==="1");
btn&&btn.addEventListener("click",()=>{const on=!document.body.classList.contains("va-cb");LS.set("va.cb",on?"1":"0");apply(on)});
})();
