import fs from 'fs';
const HERE = new URL('./', import.meta.url).pathname;   // this folder
const D = HERE;
const { SUBJECTS } = await import('../../../src/skills.js');
const v = JSON.parse(fs.readFileSync(D + 'banks.json'));
export const bankKey = (subj, id, title) => subj === 'english' ? id.replace(/(JK|\d+)$/, '') : subj === 'science' ? id.replace(/\d+$/, '') : subj === 'math' ? 'mth:' + title : id;
const idx = new Map(); for (const s of SUBJECTS) for (const g of s.grades) for (const sec of g.sections) for (const k of sec.skills) idx.set(k.id, { s: s.id, g: g.num, sec: sec.name, k });
const banks = new Map(); let skippedVisual = 0;
for (const x of v.filter(x => x.s === 'english' || x.s === 'science')) {
  const key = bankKey(x.s, x.id, x.title);
  const b = banks.get(key) || { key, subject: x.s, title: x.title, section: x.sec, grades: [], skillIds: [], examples: [] };
  b.grades.push(x.g); b.skillIds.push(x.id); banks.set(key, b);
}
const out = [];
for (const b of banks.values()) {
  const { k } = idx.get(b.skillIds[0]); const seen = new Set(); let visual = false;
  for (let i = 0; i < 300 && seen.size < 40; i++) {
    let q; try { q = k.gen(); } catch { continue; }
    if (q.listen || q.say || /<svg|<img/.test(q.prompt) || q.type !== 'mc') { visual = true; break; }
    const p = q.prompt.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (seen.has(p + q.answer)) continue; seen.add(p + q.answer);
    b.examples.push({ question: p, answer: q.answer, choices: q.choices });
  }
  if (visual) { skippedVisual++; continue; }
  b.grades = [...new Set(b.grades)].sort((a, c) => a - c);
  out.push(b);
}
out.sort((a, c) => a.subject.localeCompare(c.subject) || a.grades[0] - c.grades[0]);
const N = 25, batches = [];
for (let i = 0; i < out.length; i += N) batches.push(out.slice(i, i + N));
batches.forEach((bt, i) => fs.writeFileSync(D + `bank_${String(i).padStart(2, '0')}.json`, JSON.stringify(bt, null, 1)));
console.log(out.length, 'text banks exported in', batches.length, 'batches;', skippedVisual, 'audio/picture banks skipped;',
  'english', out.filter(b => b.subject === 'english').length, 'science', out.filter(b => b.subject === 'science').length);
