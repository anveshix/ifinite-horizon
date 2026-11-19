/* Class IX teacher-assist drafts. Cards are enabled only by the same-origin server capability endpoint. */
(()=>{
  'use strict';
  const $=s=>document.querySelector(s);
  const cards=[...document.querySelectorAll('[data-ai-tool]')];
  if(!cards.length)return;
  const css=document.createElement('style');
  css.textContent=`
  .va-ai-tool[hidden]{display:none!important}
  #vaAiDialog[hidden]{display:none!important}
  #vaAiDialog{position:fixed;z-index:120;inset:0;display:grid;place-items:center;padding:16px;background:rgba(10,22,25,.72);backdrop-filter:blur(4px)}
  #vaAiDialog .va-ai-window{position:relative;width:min(760px,100%);max-height:min(92vh,900px);overflow:auto;padding:clamp(18px,4vw,30px);border:1px solid #bfc9c0;border-radius:8px;background:#f2f0e8;color:#17252a;box-shadow:0 24px 80px rgba(0,0,0,.35)}
  #vaAiDialog .va-ai-window [hidden]{display:none!important}
  #vaAiDialog .va-ai-head{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;padding-bottom:16px;border-bottom:1px solid #c9cec5}
  #vaAiDialog .va-ai-kicker{margin:0 0 7px;color:#6d7a73;font:700 9px/1.2 "Segoe UI",sans-serif;letter-spacing:1.3px}
  #vaAiDialog h2{margin:0;color:#17252a;font:500 clamp(25px,5vw,36px)/1.08 Georgia,"Times New Roman",serif}
  #vaAiDialog .va-ai-intro{margin:8px 0 0;color:#56645e;font:400 12px/1.55 "Segoe UI",sans-serif}
  #vaAiDialog .va-ai-close{flex:none;width:38px;height:38px;border:1px solid #c4ccc3;border-radius:50%;background:transparent;color:#263b3b;font-size:23px;cursor:pointer}
  #vaAiDialog form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:18px}
  #vaAiDialog label{display:flex;flex-direction:column;gap:5px;color:#43524c;font:600 11px/1.35 "Segoe UI",sans-serif}
  #vaAiDialog select,#vaAiDialog textarea,#vaAiDialog input{width:100%;min-height:39px;padding:9px 10px;border:1px solid #bec7be;border-radius:4px;background:#fbfaf5;color:#1b2b2b;font:400 13px/1.45 "Segoe UI",sans-serif}
  #vaAiDialog textarea{min-height:83px;resize:vertical}
  #vaAiDialog .va-ai-wide{grid-column:1/-1}
  #vaAiDialog .va-ai-note{grid-column:1/-1;margin:0;color:#68756f;font:400 10px/1.5 "Segoe UI",sans-serif}
  #vaAiDialog .va-ai-actions{display:flex;flex-wrap:wrap;gap:8px;grid-column:1/-1;align-items:center}
  #vaAiDialog .va-ai-actions button{min-height:39px;padding:8px 14px;border:1px solid #b7c2b8;border-radius:4px;background:#f7f5ec;color:#17252a;font:600 12px/1.2 "Segoe UI",sans-serif;cursor:pointer}
  #vaAiDialog .va-ai-actions button.primary{border-color:#13252a;background:#13252a;color:#f7f3e8}
  #vaAiDialog .va-ai-actions button:disabled{opacity:.55;cursor:wait}
  #vaAiDialog .va-ai-status{min-height:20px;margin:10px 0 0;color:#3f665a;font:600 11px/1.45 "Segoe UI",sans-serif}
  #vaAiDialog .va-ai-status.error{color:#a04432}
  #vaAiDialog .va-ai-result{margin-top:12px;padding-top:16px;border-top:1px solid #c9cec5}
  #vaAiDialog .va-ai-result[hidden]{display:none}
  #vaAiDialog .va-ai-result h3{margin:0 0 6px;font:600 17px/1.2 Georgia,"Times New Roman",serif}
  #vaAiDialog .va-ai-result p{margin:0 0 10px;color:#596762;font:400 11px/1.5 "Segoe UI",sans-serif}
  #vaAiDialog .va-ai-draft{min-height:280px;max-height:45vh;font:400 12px/1.6 ui-monospace,SFMono-Regular,Consolas,monospace}
  #vaAiDialog .va-ai-privacy{margin:14px 0 0;padding-top:10px;border-top:1px solid #d4d8cf;color:#758079;font:400 10px/1.5 "Segoe UI",sans-serif}
  @media(max-width:560px){#vaAiDialog{padding:8px}#vaAiDialog .va-ai-window{max-height:96vh;padding:16px}#vaAiDialog form{grid-template-columns:1fr;gap:10px}#vaAiDialog .va-ai-wide,#vaAiDialog .va-ai-note,#vaAiDialog .va-ai-actions{grid-column:1}#vaAiDialog .va-ai-draft{max-height:38vh}}
  @media print{#vaAiDialog{position:static;padding:0;background:white;backdrop-filter:none}#vaAiDialog .va-ai-window{max-height:none;overflow:visible;border:0;box-shadow:none}#vaAiDialog .va-ai-head,#vaAiDialog form,#vaAiDialog .va-ai-status,#vaAiDialog .va-ai-privacy{display:none!important}#vaAiDialog .va-ai-result{display:block!important;border:0}#vaAiDialog .va-ai-draft{max-height:none;border:0;background:white;white-space:pre-wrap}}
  `;
  document.head.appendChild(css);
  const dialog=document.createElement('div');dialog.id='vaAiDialog';dialog.hidden=true;
  dialog.innerHTML=`<div class="va-ai-window" role="dialog" aria-modal="true" aria-labelledby="vaAiTitle" tabindex="-1">
    <header class="va-ai-head"><div><p class="va-ai-kicker">AI-GENERATED DRAFT · CLASS IX</p><h2 id="vaAiTitle"></h2><p class="va-ai-intro">A starting point grounded in Vigyan Atlas chapter context. Review and edit before classroom use.</p></div><button class="va-ai-close" type="button" aria-label="Close">×</button></header>
    <form id="vaAiForm">
      <label class="va-ai-wide">Chapter<select name="chapterId" required></select></label>
      <label>Output language<select name="locale"><option value="en">English</option><option value="hi">Hindi</option></select></label>
      <label data-ai-field="duration">Lesson duration<select name="durationMinutes"><option>30</option><option selected>40</option><option>45</option><option>60</option></select></label>
      <label data-ai-field="count" hidden>Number of questions<select name="questionCount"><option>5</option><option selected>8</option><option>10</option></select></label>
      <label data-ai-field="format" hidden>Question format<select name="questionFormat"><option value="mixed">Mixed</option><option value="mcq">Multiple choice</option><option value="short">Short answer</option></select></label>
      <label data-ai-field="difficulty" hidden>Difficulty<select name="difficulty"><option value="mixed">Mixed</option><option value="foundational">Foundational</option><option value="challenging">Challenging</option></select></label>
      <label class="va-ai-wide" data-ai-field="goals">Learning goals<textarea name="learningGoals" maxlength="1200" placeholder="What should learners understand or be able to do? (optional)"></textarea></label>
      <label class="va-ai-wide">Teacher notes<textarea name="teacherNotes" maxlength="1200" placeholder="Classroom constraints, materials, or emphasis (optional)"></textarea></label>
      <p class="va-ai-note">Do not include student names, roll numbers, report codes, health details, or other identifying information.</p>
      <div class="va-ai-actions"><button class="primary" type="submit" id="vaAiGenerate">Generate draft</button></div>
    </form>
    <p class="va-ai-status" role="status" aria-live="polite"></p>
    <section class="va-ai-result" hidden><h3>Editable draft</h3><p>AI-generated suggestions may be incomplete or incorrect. Verify science, scope, answer keys, translations, and safety before use.</p><textarea class="va-ai-draft" aria-label="Editable AI draft"></textarea><div class="va-ai-actions"><button type="button" data-ai-action="regenerate">Regenerate draft</button><button type="button" data-ai-action="copy">Copy draft</button><button type="button" data-ai-action="copy-student" hidden>Copy student worksheet</button><button type="button" data-ai-action="copy-key" hidden>Copy answer key</button><button type="button" data-ai-action="print">Print teacher copy</button><button type="button" data-ai-action="print-student" hidden>Print student worksheet</button></div></section>
    <p class="va-ai-privacy">When you generate a draft, the chapter selection and teacher-provided text are sent to Google Gemini through Vigyan Atlas’s server. The app does not save this draft.</p>
  </div>`;
  document.body.appendChild(dialog);
  const panel=dialog.querySelector('.va-ai-window'),form=dialog.querySelector('form'),status=dialog.querySelector('.va-ai-status'),result=dialog.querySelector('.va-ai-result'),draft=dialog.querySelector('.va-ai-draft'),submit=dialog.querySelector('#vaAiGenerate'),availability=$('#vaAiAvailability');
  let capability=null,activeTool='',busy=false,lastFocus=null,lastPayload=null;
  const labels={ 'lesson-plan':'Lesson planner','worksheet-builder':'Quiz & worksheet builder' };
  const field=(name)=>form.querySelector(`[data-ai-field="${name}"]`);
  function setStatus(message,isError=false){status.textContent=message;status.classList.toggle('error',isError)}
  async function loadCapability(){
    try{const r=await fetch('/api/ai/status',{headers:{Accept:'application/json'},cache:'no-store',credentials:'same-origin'});if(!r.ok)return;const data=await r.json();if(!data.enabled||!Array.isArray(data.tools)||!data.course?.chapters?.length)return;capability=data;const select=form.elements.chapterId;select.replaceChildren(...data.course.chapters.map(ch=>{const o=document.createElement('option');o.value=ch.id;o.dataset.course=ch.course||'ix';o.textContent=`${ch.number}. ${ch.title} · ${ch.unit}${ch.course==='ix25'?' · 2025–26 historical syllabus':''}`;return o}));cards.forEach(c=>{c.hidden=!data.tools.includes(c.dataset.aiTool)});if(availability)availability.hidden=true;
    }catch{/* static/offline builds keep the AI-unavailable notice and hide draft cards. */}
  }
  function open(tool){
    if(!capability?.tools.includes(tool)||busy)return;
    activeTool=tool;lastFocus=document.activeElement;dialog.querySelector('#vaAiTitle').textContent=labels[tool]||'AI draft tool';
    field('duration').hidden=tool!=='lesson-plan';field('goals').hidden=tool!=='lesson-plan';
    field('count').hidden=tool!=='worksheet-builder';field('format').hidden=tool!=='worksheet-builder';field('difficulty').hidden=tool!=='worksheet-builder';
    form.reset();if(capability.course.chapters.length)form.elements.chapterId.value=capability.course.chapters[0].id;
    result.hidden=true;draft.value='';lastPayload=null;dialog.querySelector('[data-ai-action="copy-student"]').hidden=true;dialog.querySelector('[data-ai-action="copy-key"]').hidden=true;dialog.querySelector('[data-ai-action="print-student"]').hidden=true;setStatus('');dialog.hidden=false;document.body.style.overflow='hidden';panel.focus();
  }
  function close(){if(busy)return;dialog.hidden=true;document.body.style.overflow='';lastFocus?.focus?.()}
  function worksheetText(payload,mode='all'){
    const r=payload.result,lines=[r.title,`Class IX · ${payload.chapterTitle}`,`Language: ${payload.locale==='hi'?'Hindi':'English'}`,''];
    if(mode!=='key'){
      lines.push('STUDENT WORKSHEET',r.instructions,'');
      r.questions.forEach((q,i)=>{lines.push(`${i+1}. [${q.marks} mark${q.marks===1?'':'s'}] ${q.prompt}`);if(q.type==='multiple_choice')q.options.forEach((o,j)=>lines.push(`   ${String.fromCharCode(65+j)}. ${o}`));lines.push('')});
      lines.push(`TOTAL MARKS: ${r.totalMarks}`);
    }
    if(mode!=='student'){
      lines.push('','TEACHER ANSWER KEY · REVIEW BEFORE USE');
      r.questions.forEach((q,i)=>lines.push(`${i+1}. ${q.prompt}`,`   Answer: ${q.answer}`,`   Rationale: ${q.rationale}`));
    }
    if(mode==='all')lines.push('','AI-generated draft. Verify science, chapter scope, answer key, and language before classroom use.');
    return lines.join('\n');
  }
  function formatDraft(payload){
    const r=payload.result,chapter=payload.chapterTitle,lines=[r.title,`Class IX · ${chapter}`,`Language: ${payload.locale==='hi'?'Hindi':'English'}`,`Status: AI-generated draft — teacher review required`,''];
    if(payload.toolId==='worksheet-builder')return worksheetText(payload,'all');
    lines.push('LEARNING OBJECTIVES',...r.objectives.map((x,i)=>`${i+1}. ${x}`),'','MATERIALS',...r.materials.map(x=>`• ${x}`),'','LESSON SEQUENCE');
    r.sequence.forEach((x,i)=>lines.push(`${i+1}. ${x.minutes} min — ${x.activity}`,`   Teacher: ${x.teacherMoves}`,`   Learners: ${x.learnerActions}`,`   Check: ${x.checkForUnderstanding}`));
    lines.push('','DIFFERENTIATION',`Support: ${r.differentiation.support}`,`Extension: ${r.differentiation.extension}`,'','EXIT TICKET',r.exitTicket.prompt,...r.exitTicket.expectedPoints.map(x=>`• ${x}`),'','Review this draft for scientific accuracy, age-appropriateness, chapter scope, language, and safety before classroom use.');return lines.join('\n');
  }
  async function copyText(value){try{await navigator.clipboard.writeText(value);setStatus('Copied to clipboard.')}catch{draft.focus();draft.select();setStatus('Select and copy the highlighted draft text.',true)}}
  function printText(title,value){const w=window.open('','_blank');if(!w){setStatus('Allow pop-ups to print or save this draft.',true);return}const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));w.document.write(`<!doctype html><meta charset="utf-8"><title>${esc(title)} · Vigyan Atlas</title><style>body{font:14px/1.55 system-ui,sans-serif;max-width:850px;margin:36px auto;padding:0 24px;color:#18282a}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.6 ui-monospace,monospace}h1{font:600 22px Georgia,serif}</style><h1>${esc(title)}</h1><pre>${esc(value)}</pre><script>onload=()=>print()</script>`);w.document.close()}
  function requestBody(){const fd=new FormData(form);const selected=form.elements.chapterId.selectedOptions[0];const common={schemaVersion:1,toolId:activeTool,course:selected?.dataset.course||'ix',chapterId:fd.get('chapterId'),locale:fd.get('locale')};
    common.inputs=activeTool==='lesson-plan'?{durationMinutes:Number(fd.get('durationMinutes')),learningGoals:fd.get('learningGoals')||'',teacherNotes:fd.get('teacherNotes')||''}:{questionCount:Number(fd.get('questionCount')),questionFormat:fd.get('questionFormat'),difficulty:fd.get('difficulty'),teacherNotes:fd.get('teacherNotes')||''};return common;}
  async function generate(){if(busy)return;busy=true;submit.disabled=true;submit.textContent='Generating…';dialog.querySelector('[data-ai-action="regenerate"]').disabled=true;setStatus('Preparing a draft…');
    try{const response=await fetch('/api/ai/generate',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(requestBody())});let data={};try{data=await response.json()}catch{}
      if(!response.ok){const messages={AI_NOT_CONFIGURED:'AI drafting is not configured on this deployment.',RATE_LIMITED:'Request limit reached. Please wait a moment and try again.',AI_CAP_REACHED:'The daily AI usage cap has been reached.',RATE_LIMIT_UNAVAILABLE:'AI drafting is temporarily unavailable.',AI_TIMEOUT:'The draft took too long. Try a shorter request.',AI_INVALID_OUTPUT:'The draft could not be validated. Try again or simplify your notes.',INVALID_INPUT:'Please check the fields and try again.',AI_PROVIDER_FAILURE:'The AI service is temporarily unavailable.'};throw new Error(messages[data.error]||'Could not generate a draft. Please try again later.')}
      lastPayload=data;draft.value=formatDraft(data);result.hidden=false;const worksheet=data.toolId==='worksheet-builder';dialog.querySelector('[data-ai-action="copy-student"]').hidden=!worksheet;dialog.querySelector('[data-ai-action="copy-key"]').hidden=!worksheet;dialog.querySelector('[data-ai-action="print-student"]').hidden=!worksheet;setStatus('Draft ready. Review and edit it before use.');result.scrollIntoView({block:'nearest',behavior:'smooth'});
    }catch(error){setStatus(error.message||'Could not reach the AI service. Check your connection and try again.',true)}finally{busy=false;submit.disabled=false;submit.textContent='Generate draft';dialog.querySelector('[data-ai-action="regenerate"]').disabled=false;}
  }
  form.addEventListener('submit',e=>{e.preventDefault();generate()});
  dialog.querySelector('.va-ai-close').addEventListener('click',close);
  dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
  dialog.querySelector('[data-ai-action="regenerate"]').addEventListener('click',generate);
  dialog.querySelector('[data-ai-action="copy"]').addEventListener('click',()=>copyText(draft.value));
  dialog.querySelector('[data-ai-action="copy-student"]').addEventListener('click',()=>lastPayload&&copyText(worksheetText(lastPayload,'student')));
  dialog.querySelector('[data-ai-action="copy-key"]').addEventListener('click',()=>lastPayload&&copyText(worksheetText(lastPayload,'key')));
  dialog.querySelector('[data-ai-action="print-student"]').addEventListener('click',()=>lastPayload&&printText('Student worksheet',worksheetText(lastPayload,'student')));
  dialog.querySelector('[data-ai-action="print"]').addEventListener('click',()=>{const w=window.open('','_blank');if(!w){setStatus('Allow pop-ups to print or save this draft.',true);return}const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));w.document.write(`<!doctype html><meta charset="utf-8"><title>${esc(labels[activeTool])} · Vigyan Atlas</title><style>body{font:14px/1.55 system-ui,sans-serif;max-width:850px;margin:36px auto;padding:0 24px;color:#18282a}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:13px/1.6 ui-monospace,monospace}h1{font:600 22px Georgia,serif}</style><h1>${esc(labels[activeTool])}</h1><pre>${esc(draft.value)}</pre><script>onload=()=>print()</script>`);w.document.close()});
  document.addEventListener('keydown',e=>{if(dialog.hidden)return;if(e.key==='Escape'){e.preventDefault();close()}else if(e.key==='Tab'){const focusable=[...panel.querySelectorAll('button:not([disabled]),select:not([disabled]),textarea:not([disabled])')].filter(x=>!x.closest('[hidden]'));if(!focusable.length)return;const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
  cards.forEach(card=>card.addEventListener('click',()=>open(card.dataset.aiTool)));
  loadCapability();
})();
