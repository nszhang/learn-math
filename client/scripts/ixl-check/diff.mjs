import fs from 'fs';
const D = new URL('./', import.meta.url).pathname;
const ixl = JSON.parse(fs.readFileSync(D + 'ixl_current.json'));
const { SUBJECTS } = await import('../../src/skills.js');
const norm = t => t.toLowerCase().replace(/[–—]/g, '-').replace(/["“”'’]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const subjMap = { math: 'math', ela: 'english', science: 'science' };
const report = {};
for (const [s, grades] of Object.entries(ixl)) {
  const sub = SUBJECTS.find(x => x.id === subjMap[s]);
  const byGrade = new Map(sub.grades.map(g => [g.num, new Set(g.sections.flatMap(sec => sec.skills.map(k => norm(k.title))))]));
  const anywhere = new Set([...byGrade.values()].flatMap(x => [...x]));
  const missing = [], moved = [];
  let total = 0;
  for (const [g, rows] of Object.entries(grades)) for (const [sec, title] of rows) {
    total++;
    const n = norm(title);
    if (byGrade.get(+g)?.has(n)) continue;
    (anywhere.has(n) ? moved : missing).push([+g, sec, title]);
  }
  report[s] = { total, missing, moved };
  console.log(`${s}: ${total} IXL skills; ${missing.length} not in our catalog at all; ${moved.length} we have but at a different grade`);
}
fs.writeFileSync(D + 'missing.json', JSON.stringify(report, null, 1));
