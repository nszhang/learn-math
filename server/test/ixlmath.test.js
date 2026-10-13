// Every IXL-style math skill (Grades 1–5) must have a generator that produces well-formed questions.
import { test } from 'node:test';
import assert from 'node:assert/strict';

function problems(q) {
  const errs = [];
  if (!q || typeof q !== 'object') return ['no question'];
  if (typeof q.prompt !== 'string' || !q.prompt.trim()) errs.push('empty prompt');
  if (typeof q.explain !== 'string' || !q.explain.trim()) errs.push('empty explain');
  if (/NaN|undefined|\[object|Infinity/.test(`${q.prompt} ${q.explain} ${q.choices || ''}`)) errs.push('bad token in text');
  if (q.type === 'num') { if (!Number.isFinite(q.answer)) errs.push('num answer not finite'); }
  else if (q.type === 'mc') {
    if (!Array.isArray(q.choices) || q.choices.length < 2 || q.choices.length > 6) errs.push('choices count');
    else if (new Set(q.choices).size !== q.choices.length) errs.push('duplicate choices');
    else if (!q.choices.includes(q.answer)) errs.push('answer not in choices');
  } else errs.push('bad type');
  return errs;
}

test('IXL math catalog: every manifest skill has a generator', async () => {
  const { IXL_MATH_SKILLS, IXL_MATH_MISSING } = await import('../../client/src/catalog/ixlMath/index.js');
  assert.deepEqual(IXL_MATH_MISSING.map(s => `${s.id} ${s.title}`), []);
  assert.ok(IXL_MATH_SKILLS.length >= 1900);
  assert.equal(new Set(IXL_MATH_SKILLS.map(s => s.id)).size, IXL_MATH_SKILLS.length, 'ids are unique');
});

test('IXL math catalog: generators produce well-formed questions', async () => {
  const { IXL_MATH_SKILLS } = await import('../../client/src/catalog/ixlMath/index.js');
  const bad = [];
  for (const sk of IXL_MATH_SKILLS) {
    for (let i = 0; i < 25; i++) {
      let q;
      try { q = sk.gen(); } catch (e) { bad.push(`${sk.id} ${sk.title}: threw ${e.message}`); break; }
      const errs = problems(q);
      if (errs.length) { bad.push(`${sk.id} ${sk.title}: ${errs.join(', ')}`); break; }
    }
  }
  assert.deepEqual(bad, []);
});

test('Math grades 1–12 follow IXL section counts', async () => {
  const { GRADES } = await import('../../client/src/skills.js');
  const want = { 1: 41, 2: 34, 3: 43, 4: 46, 5: 54, 6: 41, 7: 36, 8: 34, 9: 25, 10: 34, 11: 25, 12: 28 };
  for (const [g, n] of Object.entries(want)) assert.equal(GRADES.find(x => x.num === +g).sections.length, n, `grade ${g} sections`);
});
