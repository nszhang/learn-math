import fs from 'fs';
const { SUBJECTS } = await import('../../../src/skills.js');
const { registerExtras } = await import('../../../src/extraQuestions.js');
for (const s of ['english', 'science']) registerExtras(s, JSON.parse(fs.readFileSync(new URL(`../../../public/more/${s}.json`, import.meta.url))));
const SUBJ = await import('../../../src/skills.js');
for (const id of ['english', 'science', 'chinese']) {
  const subj = SUBJECTS.find(s => s.id === id); let low = 0, tot = 0; const ex = [];
  for (const g of subj.grades) for (const sec of g.sections) for (const sk of sec.skills) {
    tot++; const seen = new Set(); let kind = '';
    for (let i = 0; i < 60; i++) { try { const q = sk.gen(); if (q.listen || q.say) kind = 'audio'; else if (/<svg|<img/.test(q.prompt)) kind = kind || 'picture'; seen.add(q.prompt.replace(/<svg[\s\S]*?<\/svg>/g, '[s]') + '|' + q.answer); } catch {} }
    if (seen.size < 12) { low++; ex.push(`${sk.id}(${kind || 'text'},${seen.size})`); }
  }
  console.log(id, 'low', low, 'of', tot, ex.slice(0, 14).join(' '));
}
