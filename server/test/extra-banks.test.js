// Extra question banks (client/public/more/{subject}.json): every bank belongs to a real skill and the
// questions it adds to that skill are well formed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('extra question banks: keys match skills and questions are well formed', async () => {
  const { registerExtras, bankKey } = await import('../../client/src/extraQuestions.js');
  const { SUBJECTS } = await import('../../client/src/skills.js');
  const dir = new URL('../../client/public/more/', import.meta.url);
  const problems = new Set(); let used = 0;
  for (const subj of SUBJECTS) {
    const f = new URL(`${subj.id}.json`, dir);
    if (!fs.existsSync(f)) continue;
    const data = JSON.parse(fs.readFileSync(f));
    registerExtras(subj.id, data);
    const keys = new Set(subj.grades.flatMap(g => g.sections.flatMap(s => s.skills.map(k => bankKey(subj.id, k.id, k.title)))));
    for (const k of Object.keys(data)) if (!keys.has(k)) problems.add(`${subj.id}: bank ${k} has no skill`);
    for (const g of subj.grades) for (const sec of g.sections) for (const sk of sec.skills) {
      if (!data[bankKey(subj.id, sk.id, sk.title)]) continue;
      for (let i = 0; i < 20; i++) {
        const q = sk.gen(); used++;
        if (q.type === 'mc' && (!q.choices.includes(q.answer) || new Set(q.choices).size !== q.choices.length || q.choices.length < 2)) problems.add(`${sk.id}: bad choices`);
        if (/\bundefined\b|\bNaN\b|\[object/.test(q.prompt + q.explain)) problems.add(`${sk.id}: junk text`);
      }
    }
  }
  assert.ok(used > 0, 'extra banks were exercised');
  assert.deepEqual([...problems], []);
});

// Multiple-choice giveaways: the right answer must not stand out from every wrong answer by length,
// or by being the only option with a (bracketed) note. A few borderline items are tolerated per bank.
test('extra question banks: right answers do not give themselves away', () => {
  const dir = new URL('../../client/public/more/', import.meta.url);
  const len = s => String(s).replace(/<[^>]+>/g, '').length;
  const bad = [];
  for (const f of ['english.json', 'science.json']) {
    const file = new URL(f, dir); if (!fs.existsSync(file)) continue;
    for (const [key, qs] of Object.entries(JSON.parse(fs.readFileSync(file)))) {
      let byLength = 0, byNote = 0;
      for (const [, a, wrong] of qs) {
        if (wrong.length === 3) {
          const lo = Math.min(...wrong.map(len)), hi = Math.max(...wrong.map(len)), n = len(a);
          if ((n * 1.8 < lo && lo - n > 8) || (n > 1.8 * hi && n - hi > 12)) byLength++;
        }
        if (/\s\([^)]+\)$/.test(String(a)) && !wrong.some(w => /\([^)]+\)/.test(String(w)))) byNote++;
      }
      if (byLength >= 3 || byNote) bad.push(`${key}: ${byLength} by length, ${byNote} by note`);
    }
  }
  assert.deepEqual(bad, []);
});
