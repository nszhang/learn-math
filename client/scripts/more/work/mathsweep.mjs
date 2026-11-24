const { SUBJECTS } = await import('../../../src/skills.js');
const math = SUBJECTS.find(s => s.id === 'math'); const bad = new Map(); let n = 0;
for (const g of math.grades) for (const sec of g.sections) for (const sk of sec.skills) {
  for (let i = 0; i < 400; i++) {
    let q; try { q = sk.gen(); } catch (e) { bad.set(sk.id + ' throws: ' + e.message.slice(0, 60), 1); break; }
    n++; const e = [];
    if (!q || typeof q.prompt !== 'string' || !q.prompt.trim()) e.push('empty prompt');
    else {
      if (typeof q.explain !== 'string' || !q.explain.trim()) e.push('empty explain');
      if (/NaN|undefined|\[object|Infinity/.test(`${q.prompt} ${q.explain} ${q.choices || ''}`)) e.push('bad token');
      if (q.type === 'num' && !Number.isFinite(q.answer)) e.push('num not finite');
      if (q.type === 'mc') { if (!Array.isArray(q.choices) || q.choices.length < 2 || q.choices.length > 6) e.push('choices count'); else if (new Set(q.choices).size !== q.choices.length) e.push('dup choices'); else if (!q.choices.includes(q.answer)) e.push('answer missing'); }
    }
    if (e.length) { const k = `${sk.id} ${sk.title.slice(0, 40)}: ${e[0]}`; bad.set(k, (bad.get(k) || 0) + 1); }
  }
}
console.log('questions', n, 'problem kinds', bad.size); [...bad].slice(0, 40).forEach(([k, v]) => console.log(' ', k, v));
