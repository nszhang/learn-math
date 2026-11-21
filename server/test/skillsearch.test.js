// The skill search box indexes the live catalog, so new skills are searchable automatically.
// This guards that every skill — including ones added later — can be found by its own title.
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('skill search: every skill in every subject is found by its own title', async () => {
  const { SUBJECTS } = await import('../../client/src/skills.js');
  const { searchSkills } = await import('../../client/src/skillSearch.js');
  const missing = [];
  for (const subj of SUBJECTS) for (const g of subj.grades) for (const sec of g.sections) for (const sk of sec.skills) {
    const { results } = searchSkills(subj, sk.title, { myGrade: g.num, limit: Infinity });
    if (!results.some(r => r.skill.id === sk.id)) missing.push(`${subj.id} ${g.name} ${sk.code} ${sk.id} "${sk.title}"`);
  }
  assert.deepEqual(missing, [], `skills the search cannot find:\n${missing.join('\n')}`);
});

test('skill search: plain-language requests find the right skills', async () => {
  const { SUBJECTS } = await import('../../client/src/skills.js');
  const { searchSkills } = await import('../../client/src/skillSearch.js');
  const math = SUBJECTS.find(s => s.id === 'math');
  const top = (q, n = 10) => searchSkills(math, q, { myGrade: 9 }).results.slice(0, n).map(r => r.skill.id);
  assert.ok(top('give me the skills I should practice for similar triangles', 5).includes('t116'));
  assert.ok(top('scale factor', 5).includes('t143'));
  assert.ok(searchSkills(math, 'grade 9 linear equations').results.every(r => r.grade.num === 9));
  assert.equal(searchSkills(math, 'xyzzy blorp').results.length, 0);
});
