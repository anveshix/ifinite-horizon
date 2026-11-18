// Curiosity Lab compatibility regression: block WebGL only inside the lab and verify every experiment stays interactive in 2D.
// Run: node tests/curiosity-fallback.js http://localhost:8765/index.html (requires Playwright + Chromium).
const { chromium } = require("playwright");
const fails = [];
const ok = (condition, message) => { if (!condition) fails.push(message); };

(async () => {
  const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = [];
  page.on("pageerror", error => errors.push(String(error).slice(0, 180)));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text().slice(0, 180)); });
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (this.closest?.("#clStage") && /webgl/i.test(type)) throw new Error("Simulated WebGL unavailable");
      return getContext.call(this, type, ...args);
    };
  });
  await page.goto(process.argv[2] || "http://localhost:8765/index.html");
  await page.waitForFunction(() => !!window.__curiosity && !!window.__atlas, null, { timeout: 30000 });
  const labs = ["lens", "ohm", "force", "energy"];

  for (const id of labs) {
    await page.evaluate(async () => { await window.__curiosity.load(); window.__curiosity.open(); });
    await page.waitForSelector(`#cl:not([hidden]) .cl-card[data-lab="${id}"]`, { timeout: 15000 });
    await page.click(`#cl .cl-card[data-lab="${id}"]`);
    await page.waitForSelector("#clStage .cl-fallback-message", { timeout: 15000 });
    ok(await page.locator("#clStage .cl-fallback-art canvas").isVisible(), `${id}: 2D diagram should remain visible`);
    const before = await page.locator("#clSide .cl-fl dd").allTextContents();
    const input = page.locator("#clSide input[type=range]").first();
    await input.evaluate(element => {
      element.value = element.max;
      element.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForTimeout(50);
    const after = await page.locator("#clSide .cl-fl dd").allTextContents();
    ok(before.join("|") !== after.join("|"), `${id}: changing a control should update the calculated facts`);
    await page.click("#clClose");
  }

  await browser.close();
  console.log(`Curiosity 2D fallback · labs ${labs.length} · console/page errors ${errors.length} · failures ${fails.length}`);
  for (const error of errors) console.log("console:", error);
  for (const failure of fails) console.log("FAIL:", failure);
  process.exit(errors.length || fails.length ? 1 : 0);
})();
