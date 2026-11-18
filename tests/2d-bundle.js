// Validate the main 2D bundle without a browser or third-party dependencies.
// Run with: npm run test:2d
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/va-2d.js'), 'utf8');
const dataStart = source.indexOf('const DATA=');
const mapStart = source.indexOf('const B9=', dataStart);
const end = source.indexOf('const GROUPS=', mapStart);
assert(dataStart >= 0 && mapStart > dataStart && end > mapStart,
  'Could not locate the 2D data and topic-map declarations');

// Evaluate only the static DATA/constants/MAP declarations; do not execute the UI IIFE.
const declarations = source.slice(dataStart, end) + '\nreturn {DATA, MAP};';
const { DATA, MAP } = new Function(declarations)(); // eslint-disable-line no-new-func
assert(DATA && MAP && typeof DATA === 'object' && typeof MAP === 'object',
  '2D data or topic map did not parse');

function extractArray(text, token) {
  const start = text.indexOf(token);
  assert(start >= 0, `Could not find ${token}`);
  const open = text.indexOf('[', start);
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = open; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === quote) quote = null;
    } else if (c === '"' || c === "'" || c === '`') quote = c;
    else if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) return text.slice(open, i + 1);
    }
  }
  assert.fail(`Unclosed array after ${token}`);
}

const app = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const expectedTopics = new Set();
const xChapters = extractArray(app, 'var Hi=[');
for (const [i, chapter] of xChapters.split(/\},\s*\{no:/).entries()) {
  const match = chapter.match(/no:(\d+)/) || (i > 0 && chapter.match(/^(\d+),unit:/));
  if (match) for (const id of chapter.matchAll(/id:"([^"]+)"/g)) expectedTopics.add(`ch${match[1]}/${id[1]}`);
}
const ixStart = app.indexOf('const IXC=[');
const advancedStart = app.indexOf('const AD=', ixStart);
assert(ixStart >= 0 && advancedStart > ixStart, 'Could not find Class IX registries');
const ixModules = app.slice(ixStart, advancedStart);
const moduleStarts = [...ixModules.matchAll(/\{kp:"(ix\d+)"/g)];
for (let i = 0; i < moduleStarts.length; i++) {
  const m = moduleStarts[i];
  const module = ixModules.slice(m.index, moduleStarts[i + 1]?.index ?? ixModules.length);
  for (const id of module.matchAll(/TP\("([^"]+)"/g)) expectedTopics.add(`${m[1]}/${id[1]}`);
}
const advancedEnd = app.indexOf('Hj.push', advancedStart);
const advanced = app.slice(advancedStart, advancedEnd > advancedStart ? advancedEnd : advancedStart + 100000);
const advancedStarts = [...advanced.matchAll(/AD\("(adv\d+)"/g)];
for (let i = 0; i < advancedStarts.length; i++) {
  const m = advancedStarts[i];
  const module = advanced.slice(m.index, advancedStarts[i + 1]?.index ?? advanced.length);
  for (const id of module.matchAll(/TP\("([^"]+)"/g)) expectedTopics.add(`${m[1]}/${id[1]}`);
}
const unmappedTopics = [...expectedTopics].filter(topic => !Object.hasOwn(MAP, topic));
assert.deepEqual(unmappedTopics, [], `App topics missing exact 2D mappings: ${unmappedTopics.join(', ')}`);

const referenced = new Set();
let topicMappings = 0;
for (const [topic, ids] of Object.entries(MAP)) {
  topicMappings++;
  assert(Array.isArray(ids) && ids.length > 0, `${topic}: expected at least one image`);
  for (const id of ids) {
    assert.equal(typeof id, 'string', `${topic}: image id must be a string`);
    const slash = id.lastIndexOf('/');
    assert(slash > 0, `${topic}: malformed image id ${id}`);
    const group = id.slice(0, slash);
    const name = id.slice(slash + 1);
    const entry = DATA[group] && DATA[group][name];
    assert(entry, `${topic}: ${id} has no image metadata`);
    assert(typeof entry.title === 'string' && entry.title.trim(), `${id}: missing title`);
    assert(typeof entry.desc === 'string' && entry.desc.trim(), `${id}: missing description`);
    assert(typeof entry.img === 'string' && entry.img.startsWith('images/'), `${id}: invalid image path`);

    const image = path.resolve(root, 'public/2d', group, entry.img);
    assert(image.startsWith(path.resolve(root, 'public/2d') + path.sep), `${id}: image escapes bundle`);
    assert(fs.existsSync(image), `${topic}: missing image file ${path.relative(root, image)}`);
    assert(fs.statSync(image).size > 0, `${topic}: image is empty`);
    assert(Array.isArray(entry.marks) && entry.marks.length > 0, `${id}: missing bilingual labels`);
    for (const [index, mark] of entry.marks.entries()) {
      assert(Number.isFinite(mark.x) && mark.x >= 0 && mark.x <= 100,
        `${id} label ${index + 1}: x must be in [0, 100]`);
      assert(Number.isFinite(mark.y) && mark.y >= 0 && mark.y <= 100,
        `${id} label ${index + 1}: y must be in [0, 100]`);
      assert(typeof mark.en === 'string' && mark.en.trim(), `${id} label ${index + 1}: missing English`);
      assert(typeof mark.hi === 'string' && mark.hi.trim(), `${id} label ${index + 1}: missing Hindi`);
    }
    referenced.add(id);
  }
}

const allImages = new Set();
for (const [group, images] of Object.entries(DATA)) {
  for (const name of Object.keys(images)) allImages.add(`${group}/${name}`);
}
const orphans = [...allImages].filter(id => !referenced.has(id));
assert.deepEqual(orphans, [], `Unmapped 2D images remain: ${orphans.join(', ')}`);

console.log(`2D bundle OK · ${expectedTopics.size} app topics · ${topicMappings} topic mappings · ${allImages.size} images · all files and bilingual label anchors validated`);
