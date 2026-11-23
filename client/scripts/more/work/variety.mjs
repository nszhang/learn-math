import fs from 'fs';
const HERE = new URL('./', import.meta.url).pathname;   // this folder
const { SUBJECTS } = await import('../../../src/skills.js');
const shape = p => p.replace(/<svg[\s\S]*?<\/svg>/g, '[pic]').replace(/<[^>]+>/g, ' ').replace(/[−-]?\d[\d.,/]*/g, '#').replace(/\s+/g, ' ').trim();
const rows = [];
for (const s of SUBJECTS) for (const g of s.grades) for (const sec of g.sections) for (const k of sec.skills) {
  const prompts = new Set(), shapes = new Set();
  for (let i = 0; i < 40; i++) { let q; try { q = k.gen(); } catch { continue; } prompts.add(q.prompt + '|' + q.answer); shapes.add(shape(q.prompt)); }
  rows.push({ subj: s.id, grade: g.num, id: k.id, title: k.title, distinct: prompts.size, shapes: shapes.size });
}
fs.writeFileSync(HERE + 'variety.json', JSON.stringify(rows));
for (const subj of ['math', 'english', 'science', 'chinese']) {
  const r = rows.filter(x => x.subj === subj);
  const low = r.filter(x => x.distinct < 12), mono = r.filter(x => x.shapes === 1);
  console.log(`${subj.padEnd(8)} ${r.length} skills | fewer than 12 distinct questions in 40 draws: ${low.length} | a single question pattern: ${mono.length}`);
}
