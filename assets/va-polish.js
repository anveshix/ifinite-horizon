/* Vigyan Atlas — polish behaviour: tidy toolbar, home section nav with scroll-spy. No feature logic. */
(function () {
  "use strict";

  /* 1. Stage toolbar: keep the primary controls, move secondary tools into the "More" menu. */
  var MOVE = ["vtBtn", "fnBtn", "cineBtn", "tlab", "resetv", "simOpenStage", "mindMapOpenStage", "vaIksStageBtn"];
  function tidyToolbar() {
    var bar = document.getElementById("stagebar");
    var more = document.getElementById("more");
    var pop = more && more.querySelector(".pop");
    if (!bar || !pop) return;
    var box = pop.querySelector(".mtools");
    if (!box) { box = document.createElement("div"); box.className = "mtools"; pop.insertBefore(box, pop.firstChild); }
    MOVE.forEach(function (id) { var b = document.getElementById(id); if (b && b.parentNode !== box) { b.classList.add("ib"); box.appendChild(b); } });
    var clb = bar.querySelector(".clBtn"); if (clb && clb.parentNode !== box) box.appendChild(clb);
    var summary = more.querySelector("summary");
    if (summary && summary.textContent.trim() === "⋯") { summary.textContent = "More"; summary.setAttribute("aria-label", "More tools and settings"); }
  }
  var bar = document.getElementById("stagebar");
  if (bar) {
    tidyToolbar();
    new MutationObserver(function () { tidyToolbar(); }).observe(bar, { childList: true, subtree: true });
    setTimeout(tidyToolbar, 1200);
    document.addEventListener("click", function (e) {
      var more = document.getElementById("more");
      if (!more || !more.open) return;
      var t = e.target.closest && e.target.closest("#more .mtools button");
      if (t) more.open = false;
    });
  }

  /* 2. Home: section nav in the sticky masthead, with scroll-spy. */
  var home = document.getElementById("home");
  if (!home) return;
  var tools = home.querySelector(".va-tools-section");
  var topics = home.querySelector(".va-topics-section");
  if (tools && !tools.id) tools.id = "toolkit";
  if (topics && !topics.id) topics.id = "chapters";
  var masthead = home.querySelector(".va-masthead");
  if (!masthead || masthead.querySelector(".va-nav")) return;
  var items = [["#toolkit", "Toolkit"], ["#course-selector", "Syllabus"], ["#chapters", "Chapters"]];
  var nav = document.createElement("nav");
  nav.className = "va-nav";
  nav.setAttribute("aria-label", "Sections");
  items.forEach(function (it) {
    var b = document.createElement("button");
    b.type = "button"; b.textContent = it[1]; b.dataset.target = it[0];
    b.addEventListener("click", function () {
      var el = home.querySelector(it[0]);
      if (el) el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth", block: "start" });
    });
    nav.appendChild(b);
  });
  var brand = masthead.querySelector(".va-brand");
  masthead.insertBefore(nav, brand ? brand.nextSibling : masthead.firstChild);

  var buttons = [].slice.call(nav.children);
  function spy() {
    var top = home.getBoundingClientRect().top + 120, current = null;
    items.forEach(function (it, i) {
      var el = home.querySelector(it[0]);
      if (el && el.getBoundingClientRect().top <= top) current = i;
    });
    buttons.forEach(function (b, i) { if (i === current) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
  }
  home.addEventListener("scroll", spy, { passive: true });
  spy();

  /* 3. Drop leading emoji / play glyphs from text buttons (labels live in lesson data; keys stay untouched). */
  var LEAD = /^[\s\u25B6\u23E9\u23F8\u2600\u26A1\uFE0F\p{Extended_Pictographic}]+/u;
  var SEL = "#tools button, #play, #testbtn, #predbtn, #replay, #homeGo, .va-hero-actions button, #info button, .ctrl .btn";
  function strip(root) {
    root.querySelectorAll(SEL).forEach(function (b) {
      var n = b.firstChild;
      if (!n || n.nodeType !== 3) return;
      var t = n.nodeValue, r = t.replace(LEAD, "");
      if (r !== t && (r.trim() || b.children.length || b.textContent.length > t.length)) n.nodeValue = r;
    });
  }
  var roots = [document.getElementById("panel"), home].filter(Boolean);
  roots.forEach(function (r) {
    strip(r);
    new MutationObserver(function () { strip(r); }).observe(r, { childList: true, subtree: true, characterData: true });
  });
})();
