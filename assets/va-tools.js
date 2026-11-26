/* Home tools hub: route cards to the existing Infinite Horizons tools. */
(()=>{
  "use strict";
  const hub=document.querySelector("#home .va-tools-section");
  if(!hub)return;
  const actions={
    lessons:"#homeGo",
    simulator:"#homeSimulator",
    mindmap:"#homeMindMap",
    report:"#myReport",
    teacher:"#teacherBtn",
    practicals:"#openLab",
    competency:"#openCg"
  };
  (document.querySelector("#home")||hub).addEventListener("click",event=>{
    const card=event.target.closest("[data-va-tool]");
    if(!card)return;
    const tool=card.dataset.vaTool;
    if(tool==="curiosity"){
      const launch=document.querySelector("#home .clBtn");
      if(launch)launch.click();
      else window.__curiosity?.open?.();
      return;
    }
    const target=actions[tool]&&document.querySelector(actions[tool]);
    target?.click();
  });
})();
