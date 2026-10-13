// Dev check: node client/src/catalog/ixlMath/check.mjs [grade] [--missing] [--samples N] [--id mth1A01]
import { IXL_MATH_SKILLS, IXL_MATH_MISSING } from './index.js';

const args = process.argv.slice(2);
const flag = f => args.includes(f);
const val = f => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const gradeFilter = args.find((a, i) => /^\d+$/.test(a) && !args[i - 1]?.startsWith('--'));
const samples = +(val('--samples') || 40);
const onlyId = val('--id');

export function validate(q) {
  const errs = [];
  if (!q || typeof q !== 'object') return ['no question'];
  if (typeof q.prompt !== 'string' || !q.prompt.trim()) errs.push('empty prompt');
  if (typeof q.explain !== 'string' || !q.explain.trim()) errs.push('empty explain');
  const text = `${q.prompt} ${q.explain} ${q.choices || ''}`;
  if (/NaN|undefined|\[object|null|Infinity/.test(text)) errs.push('bad token in text');
  if (q.type === 'num') {
    if (!Number.isFinite(q.answer)) errs.push('num answer not finite');
  } else if (q.type === 'mc') {
    if (!Array.isArray(q.choices) || q.choices.length < 2 || q.choices.length > 6) errs.push('choices count ' + q.choices?.length);
    else {
      if (new Set(q.choices).size !== q.choices.length) errs.push('duplicate choices');
      if (!q.choices.includes(q.answer)) errs.push('answer not in choices');
    }
  } else errs.push('bad type ' + q.type);
  return errs;
}

let bad = 0, n = 0;
const list = IXL_MATH_SKILLS.filter(s => (!gradeFilter || s.grade === +gradeFilter) && (!onlyId || s.id === onlyId));
for (const sk of list) {
  const seen = new Set(); let problems = null;
  for (let i = 0; i < samples; i++) {
    let q;
    try { q = sk.gen(); } catch (e) { problems = ['threw: ' + e.message]; break; }
    const errs = validate(q);
    if (errs.length) { problems = errs.concat(['prompt: ' + String(q && q.prompt).slice(0, 160)]); break; }
    seen.add(q.prompt);
  }
  n++;
  if (problems) { bad++; console.log(`✗ G${sk.grade} ${sk.id} ${sk.title}\n    ${problems.join('\n    ')}`); }
  else if (seen.size < Math.min(6, samples / 4)) console.log(`~ G${sk.grade} ${sk.id} ${sk.title}: only ${seen.size} distinct of ${samples}`);
  if (onlyId) { for (let i = 0; i < 3; i++) { const q = sk.gen(); console.log('\n' + q.prompt.replace(/<svg[\s\S]*?<\/svg>/g, '[svg]').replace(/<[^>]+>/g, ' '), '\n→', q.type === 'mc' ? q.choices.join(' | ') + '  (answer: ' + q.answer + ')' : q.answer, '\n  ', q.explain.replace(/<[^>]+>/g, '')); } }
}
const miss = IXL_MATH_MISSING.filter(s => !gradeFilter || s.grade === +gradeFilter);
console.log(`\nchecked ${n} skills, ${bad} with problems; ${miss.length} skills without a generator (of ${IXL_MATH_SKILLS.length + IXL_MATH_MISSING.length})`);
if (flag('--missing')) for (const s of miss) console.log(`  G${s.grade} ${s.id} [${s.section}] ${s.title}`);
