// Writes mathlow_NN.json: low-variety math rules grouped by the rule file that defines them
const HERE = new URL('./', import.meta.url).pathname;
import fs from 'fs';
const m = await import('../../../src/catalog/ixlMath/index.js');
const { SUBJECTS } = await import('../../../src/skills.js');
const math = SUBJECTS.find(s => s.id === 'math');
const ruleOf = new Map(m.IXL_MATH_SKILLS.map(s => [s.id, s.rule]));
const dir = HERE + '../../../src/catalog/ixlMath/rules/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js')).map(f => [f, fs.readFileSync(dir + f, 'utf8')]);
const groups = new Map();
for (const g of math.grades) for (const sec of g.sections) for (const sk of sec.skills) {
  const seen = new Set(); for (let i = 0; i < 60; i++) { try { const q = sk.gen(); seen.add(q.prompt + '|' + q.answer); } catch {} }
  if (seen.size >= 12) continue;
  const r = ruleOf.get(sk.id); if (!r) continue;
  const f = files.find(([, t]) => t.includes(r.replace(/\\/g, '\\\\').slice(0, 40)) || t.includes(r.slice(0, 40)));
  const key = r; const e = groups.get(key) || { rule: r, file: f ? f[0] : '?', distinct: seen.size, skills: [] }; e.skills.push(`g${g.num} ${sk.id} ${sk.title}`); groups.set(key, e);
}
const arr = [...groups.values()].sort((a, b) => a.file.localeCompare(b.file));
fs.writeFileSync(HERE + 'mathlow.json', JSON.stringify(arr, null, 1));
const byFile = {}; for (const e of arr) byFile[e.file] = (byFile[e.file] || 0) + 1;
console.log(arr.length, 'rules', byFile);
