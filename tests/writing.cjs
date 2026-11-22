// Every free-writing model answer must pass its own checks in the real app logic (catches bad regex, umlaut folding, Python-only syntax).
global.window = global; require('../dist/core.js'); const K = window.KLEIN_CORE; const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', 'content'); let total = 0; const fail = [];
for (const lv of fs.readdirSync(root).filter(d => /^[ab]\d$/.test(d)))
  for (const f of fs.readdirSync(path.join(root, lv)).filter(x => /^ch\d+\.json$/.test(x)))
    for (const d of JSON.parse(fs.readFileSync(path.join(root, lv, f))).skillDays || []) {
      const F = d.writing && d.writing.free; if (!F || !F.model) continue; total++;
      const bad = K.writingFeedback(F, F.model).checks.filter(c => !c.passed).map(c => c.label);
      if (bad.length) fail.push(`${d.id}: ${bad.join(' / ')}`);
    }
if (fail.length) { console.error(`writing checks: ${fail.length} model answers fail their own checks\n  ` + fail.join('\n  ')); process.exit(1); }
console.log(`writing checks: all ${total} model answers pass their own checks`);
