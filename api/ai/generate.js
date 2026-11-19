const {config,PROMPT_VERSION,CONTEXT_VERSION,validateRequest,promptEnvelope,validateOutput,takeRateLimit,originAllowed}=require('../../lib/ai');
const MAX_BODY_BYTES=16*1024;
const GEMINI_API='https://generativelanguage.googleapis.com/v1beta/models/';
const fail=(res,status,error)=>res.status(status).json({error});
function readBody(req){
  if(req.body&&typeof req.body==='object'&&!Buffer.isBuffer(req.body))return req.body;
  const raw=Buffer.isBuffer(req.body)?req.body.toString('utf8'):typeof req.body==='string'?req.body:'';
  if(Buffer.byteLength(raw,'utf8')>MAX_BODY_BYTES)return {__tooLarge:true};
  try{return JSON.parse(raw);}catch{return null;}
}
function parseJson(text){
  let value=String(text||'').trim();
  value=value.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'');
  try{return JSON.parse(value);}catch{return null;}
}
module.exports=async function generate(req,res){
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','same-origin');
  if(req.method!=='POST'){
    res.setHeader('Allow','POST');
    return fail(res,405,'METHOD_NOT_ALLOWED');
  }
  if(!originAllowed(req))return fail(res,403,'ORIGIN_NOT_ALLOWED');
  const type=String(req.headers?.['content-type']||'').split(';')[0].trim().toLowerCase();
  if(type!=='application/json')return fail(res,415,'JSON_REQUIRED');
  const cfg=config();
  if(!cfg.enabled)return fail(res,503,'AI_NOT_CONFIGURED');
  const body=readBody(req);
  if(body?.__tooLarge)return fail(res,413,'REQUEST_TOO_LARGE');
  if(!body)return fail(res,400,'INVALID_INPUT');
  if(Buffer.byteLength(JSON.stringify(body),'utf8')>MAX_BODY_BYTES)return fail(res,413,'REQUEST_TOO_LARGE');
  const input=validateRequest(body);
  if(input.error)return fail(res,400,input.error);
  const rate=await takeRateLimit(req,cfg);
  if(rate.unavailable)return fail(res,503,'RATE_LIMIT_UNAVAILABLE');
  if(!rate.ok){res.setHeader('Retry-After','60');return fail(res,429,rate.code||'RATE_LIMITED');}
  const {system,user}=promptEnvelope(input);
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),22000);
  try{
    const response=await fetch(`${GEMINI_API}${encodeURIComponent(cfg.model)}:generateContent`,{
      method:'POST',signal:controller.signal,
      headers:{'Content-Type':'application/json','x-goog-api-key':cfg.key},
      body:JSON.stringify({
        systemInstruction:{parts:[{text:system}]},
        contents:[{role:'user',parts:[{text:user}]}],
        generationConfig:{responseMimeType:'application/json',temperature:0.35,maxOutputTokens:3000}
      })
    });
    if(!response.ok)return fail(res,502,'AI_PROVIDER_FAILURE');
    const payload=await response.json();
    const candidate=payload?.candidates?.[0];
    if(!candidate||candidate.finishReason==='MAX_TOKENS')return fail(res,502,'AI_INVALID_OUTPUT');
    const text=(candidate.content?.parts||[]).map(p=>p?.text||'').join('\n');
    const raw=parseJson(text);
    const result=validateOutput(input,raw);
    if(!result)return fail(res,502,'AI_INVALID_OUTPUT');
    return res.status(200).json({toolId:input.toolId,schemaVersion:1,promptVersion:PROMPT_VERSION,contextVersion:CONTEXT_VERSION,course:'ix',chapterId:input.chapter.id,chapterTitle:input.chapter.title,locale:input.locale,result,reviewRequired:true});
  }catch(error){
    if(error?.name==='AbortError')return fail(res,504,'AI_TIMEOUT');
    return fail(res,502,'AI_PROVIDER_FAILURE');
  }finally{clearTimeout(timeout);}
};
module.exports._test={readBody,parseJson,MAX_BODY_BYTES};
