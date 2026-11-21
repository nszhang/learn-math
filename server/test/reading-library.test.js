// The large reading library (client/public/reading/*.json): every passage has a source and every
// question built from it is well formed — including cloze questions, whose word must be blanked out.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('reading library: loads, and its questions are well formed', async () => {
  const { registerReadingBand } = await import('../../client/src/catalog/eng/comprehension.js');
  const dir = new URL('../../client/public/reading/', import.meta.url);
  let passages = 0;
  for (const band of ['3_4', '5_6', '7_8', '9_10', '11_12']) {
    const items = JSON.parse(fs.readFileSync(new URL(`${band}.json`, dir)));
    assert.ok(items.length > 150, `${band}: library too small (${items.length})`);
    for (const it of items) assert.ok(it.t && it.by && it.p.length && it.q.length >= 2, `${band}: malformed passage ${it.t}`);
    passages += items.length;
    registerReadingBand(band, items);
  }
  assert.ok(passages > 2000, `expected a large library, got ${passages}`);

  const { SUBJECTS } = await import('../../client/src/skills.js');
  const english = SUBJECTS.find(s => s.id === 'english');
  const problems = new Set(); let blanks = 0;
  for (const g of english.grades) for (const sec of g.sections) for (const sk of sec.skills) {
    if (!/^engRc(L|I|Kb|Nv|Ss|Nn|Es)\d/.test(sk.id)) continue;
    for (let i = 0; i < 150; i++) {
      const q = sk.gen();
      if (!q.choices.includes(q.answer) || new Set(q.choices).size !== q.choices.length || q.choices.length < 3) problems.add(`${sk.id}: bad choices`);
      if (!/class="rc-by"/.test(q.prompt)) problems.add(`${sk.id}: no source line`);
      if (/missing from the passage/.test(q.prompt)) {
        blanks++;
        if (!/class="rc-blank"/.test(q.prompt)) problems.add(`${sk.id}: cloze word not blanked`);
        if (new RegExp(`\\b${q.answer}\\b`).test(q.prompt.split('<p class="rc-q">')[0].replace(/<[^>]+>/g, ' '))) problems.add(`${sk.id}: cloze answer still visible`);
      }
    }
  }
  assert.ok(blanks > 50, 'library questions were used');
  assert.deepEqual([...problems], []);
});
