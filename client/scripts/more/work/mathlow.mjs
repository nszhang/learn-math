const m = await import('../../../src/catalog/ixlMath/index.js');
const { SUBJECTS } = await import('../../../src/skills.js');
const math = SUBJECTS.find(s => s.id === 'math');
const ruleOf = new Map(m.IXL_MATH_SKILLS.map(s => [s.id, s.rule]));
const groups = new Map(); let low = 0, total = 0;
for (const g of math.grades) for (const sec of g.sections) for (const sk of sec.skills) {
  total++; const seen = new Set();
  for (let i = 0; i < 60; i++) { try { const q = sk.gen(); seen.add(q.prompt + '|' + q.answer); } catch {} }
  if (seen.size >= 12) continue; low++;
  const r = ruleOf.get(sk.id) || '(legacy ' + sk.id + ')';
  const e = groups.get(r) || { n: 0, d: seen.size, ex: [] }; e.n++; e.ex.push(`${g.num}:${sk.title}`); groups.set(r, e);
}
console.log('low', low, 'of', total, '| distinct rules', groups.size);
const arr = [...groups].sort((a, b) => b[1].n - a[1].n);
for (const [r, e] of arr.slice(0, 25)) console.log(String(e.n).padStart(3), 'd=' + e.d, r.slice(0, 70), '|', e.ex.slice(0, 2).join('; ').slice(0, 90));
console.log('rules covering 1 skill:', arr.filter(x => x[1].n === 1).length);
