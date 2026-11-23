import fs from 'fs';
const HERE = new URL('./', import.meta.url).pathname;   // this folder
const { SUBJECTS } = await import('../../../src/skills.js');
const v = JSON.parse(fs.readFileSync(HERE + 'variety.json'));
const flagged = new Set(v.filter(x => x.distinct < 12).map(x => x.id));
const idx = new Map(); for (const s of SUBJECTS) for (const g of s.grades) for (const sec of g.sections) for (const k of sec.skills) idx.set(k.id, { s: s.id, g: g.num, sec: sec.name, k });
const out = [];
for (const id of flagged) { const { s, g, sec, k } = idx.get(id); const seen = new Set(); for (let i = 0; i < 400; i++) { try { const q = k.gen(); seen.add(q.prompt + '|' + q.answer); } catch {} } out.push({ s, g, sec, id, title: k.title, bank: seen.size }); }
fs.writeFileSync(HERE + 'banks.json', JSON.stringify(out));
for (const subj of ['math', 'english', 'science', 'chinese']) {
  const r = out.filter(x => x.s === subj).map(x => x.bank);
  const h = [[0, 5], [6, 10], [11, 15], [16, 25], [26, 999]].map(([a, b]) => `${a}-${b === 999 ? '+' : b}: ${r.filter(n => n >= a && n <= b).length}`);
  console.log(subj.padEnd(8), r.length, 'skills; distinct questions (400 draws) →', h.join(' | '));
}
