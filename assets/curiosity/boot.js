/* Curiosity Lab — boot (ES module). The single entry the launcher imports: registers every lab, wires the quiz, re-exports the shell API.
   Adding a lab = write assets/curiosity/labs/<id>.js (default export = lab object) and add one line to LAB_FILES below. */
import { registerLab, labs } from "./core.js";
import * as shell from "./shell.js";
import { renderQuiz } from "./quiz/quiz.js";

shell.setQuizRenderer(renderQuiz);              // Phase 3: the Knowledge check tab

const LAB_FILES = [
  "./labs/lens.js",
  "./labs/eye.js",
  "./labs/ohm.js",
  "./labs/magnet.js",
  "./labs/force.js",
  "./labs/energy.js",
  "./labs/sound.js",
  "./labs/gravity.js",
  "./labs/ph.js",
  "./labs/atom.js",
  "./labs/matter.js",
  "./labs/reactions.js",
  "./labs/molecules.js",
  "./labs/cell.js",
  "./labs/tissues.js",
  "./labs/heart.js",
  "./labs/organs.js",
  "./labs/nervous.js",
  "./labs/repro.js",
  "./labs/genetics.js",
  "./labs/climate.js",
  "./labs/ecology.js"
];

let booted = null;
async function boot() {
  for (const f of LAB_FILES) {
    try { registerLab((await import(f)).default); }
    catch (e) { console.error("[curiosity] lab skipped:", f, e); }   // one broken lab never takes the whole Curiosity Lab down
  }
  return labs().length;
}
export function open(labId, preset = null) { (booted = booted || boot()).then(() => shell.open(labId, preset)); }
export const close = shell.close, isOpen = shell.isOpen;
export { shell };
