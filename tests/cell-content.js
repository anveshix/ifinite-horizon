const assert=require('node:assert/strict');
const content=require('../assets/va-cell-content.js');
const coverage=require('../docs/class9-coverage.json');
const curriculum=require('../api/ai/curriculum.json');
const chapter=coverage.modules.find(x=>x.id==='ix1');
const aiChapter=curriculum.chapters.find(x=>x.id==='ix1');

assert.match(content.source,/Chapter 2/);
assert.match(content.source,/app’s current course labels this Cell as Chapter 1/);
assert.equal(content.sections.length,7);
assert.ok(content.sections.every(x=>x.title&&x.hi&&x.en&&x.pages));
for(const term of ['resolution','field diameter','mitosis','meiosis','prokaryotic','selectively permeable'])
  assert.ok(content.sections.some(x=>(x.en+' '+x.points.join(' ')).toLowerCase().includes(term)),`lesson covers ${term}`);
assert.match(content.scope,/not asserted as separate exam outcomes or marks/);
assert.match(content.practical.aim,/onion epidermis and human cheek cells/);
assert.ok(content.practical.safety.some(x=>/Never share swabs/.test(x)));
assert.ok(content.practical.safety.some(x=>/Teacher supervision/.test(x)));
assert.ok(content.practical.procedure.some(x=>/single-use swab/.test(x)));
assert.ok(content.practical.extension.includes('not an additional numbered CBSE practical'));
assert.equal(chapter.no,'1');
assert.equal(chapter.periods,12);
assert.equal(chapter.activities,4);
assert.equal(chapter.practicals[0],4);
assert.match(chapter.unit,/not chapter-specific/);
assert.ok(chapter.models.includes('ix1/microscope')&&chapter.models.includes('ix1/scale')&&chapter.models.includes('ix1/organelles'));
assert.ok(aiChapter.reviewFlags.some(x=>/Chapter 2/.test(x)));
assert.ok(aiChapter.activities.some(x=>/onion epidermis and cheek-cell/.test(x)));
console.log('Cell chapter content OK · 7 bilingual source-grounded sections · practical safety, chapter mapping and AI context checked');
