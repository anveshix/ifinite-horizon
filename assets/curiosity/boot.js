/* Curiosity Lab — boot (ES module). The single entry the launcher imports: registers every lab, wires the quiz, re-exports the shell API.
   Adding a lab = write assets/curiosity/labs/<id>.js (default export = lab object) and add one line to LAB_FILES below. */
import { registerLab, labs } from "./core.js";
import * as shell from "./shell.js";

const LAB_FILES = ["./labs/lens.js", "./labs/ohm.js", "./labs/force.js", "./labs/energy.js"];

let booted = null;
async function boot() {
  for (const f of LAB_FILES) {
    try { registerLab((await import(f)).default); }
    catch (e) { console.error("[curiosity] lab skipped:", f, e); }   // one broken lab never takes the whole Curiosity Lab down
  }
  return labs().length;
}
export function open(labId) { (booted = booted || boot()).then(() => shell.open(labId)); }
export const close = shell.close, isOpen = shell.isOpen;
export { shell };
