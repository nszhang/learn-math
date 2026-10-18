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

test('Math grades JK–Calculus follow IXL section counts', async () => {
  const { GRADES } = await import('../../client/src/skills.js');
  const want = { '-1': 12, 0: 43, 13: 27, 1: 41, 2: 34, 3: 43, 4: 46, 5: 54, 6: 41, 7: 36, 8: 34, 9: 25, 10: 34, 11: 25, 12: 28 };
  // BEDMAS practice (grades 3–9) is our own addition alongside the BEDMAS lesson, not an IXL section
  const ixlSections = g => GRADES.find(x => x.num === +g).sections.filter(s => s.name !== 'BEDMAS: order of operations');
  for (const [g, n] of Object.entries(want)) assert.equal(ixlSections(g).length, n, `grade ${g} sections`);
});

test('skills pages group sections under topic headings, with sequential letters and unique codes', async () => {
  const { GRADES, SCIENCE_GRADES, ENGLISH_GRADES } = await import('../../client/src/skills.js');
  for (const grades of [GRADES, SCIENCE_GRADES, ENGLISH_GRADES]) {
    const codes = new Set();
    for (const g of grades) {
      const seen = new Set();
      let prev = null;
      for (const s of g.sections) {
        assert.ok(s.category, `${g.name} / ${s.name} has a topic`);
        if (s.category !== prev) { assert.ok(!seen.has(s.category), `${g.name}: topic "${s.category}" is contiguous`); seen.add(s.category); prev = s.category; }
        for (const sk of s.skills) { assert.ok(!codes.has(sk.code + g.id), `duplicate code ${sk.code}`); codes.add(sk.code + g.id); }
      }
    }
  }
});

test('BEDMAS practice: grades 3–9, linked to the lesson, answers match the step engine', async () => {
  const { GRADES, SKILL_INDEX } = await import('../../client/src/skills.js');
  const { solve, fmt } = await import('../../client/src/learn/bedmas.js');
  for (const g of GRADES) {
    const sec = g.sections.find(s => s.name === 'BEDMAS: order of operations');
    assert.equal(!!sec, g.num >= 3 && g.num <= 9, `grade ${g.num} BEDMAS section`);
  }
  for (let grade = 3; grade <= 9; grade++) {
    const sk = SKILL_INDEX['mthBev' + grade].skill;
    assert.equal(sk.learn, 'bedmas');
    for (let i = 0; i < 50; i++) {
      const q = sk.gen();
      const expr = q.prompt.replace(/<[^>]+>/g, ' ').replace(/.*evaluate:\s*/, '').trim();
      assert.equal(fmt(solve(expr).value), String(q.answer).replace('-', '−'), expr);
    }
  }
});
