// Reading passages and quotations must say where they come from: every passage shows a source line,
// and a famous line never appears without its author (unless the question asks for the source).
import { test } from 'node:test';
import assert from 'node:assert/strict';

// [phrase, a word that must appear with it (author or work)]
const FAMOUS = [
  ['best of times', 'Dickens'], ['fight on the beaches', 'Churchill'], ['ask not what your country', 'Kennedy'],
  ['fear is fear itself', 'Roosevelt'], ['I have a dream', 'King'], ['of the people, by the people', 'Lincoln'],
  ['one small step for man', 'Armstrong'], ['to err is human', 'Pope'], ['fair is foul', 'Macbeth'],
  ['O Captain! my Captain', 'Whitman'], ['We hold these truths', 'Declaration'], ['Four score and seven', 'Lincoln'],
  ['To be, or not to be', 'Hamlet'], ['Tomorrow, and tomorrow', 'Macbeth'], ['Two roads diverged', 'Frost'],
  ['Shall I compare thee', 'Sonnet'], ['truth universally acknowledged', 'Austen'], ['Et tu, Brute', 'Caesar']
];
const strip = s => s.replace(/<[^>]+>/g, ' ');

test('attribution: every passage has a source line and famous lines name their author', async () => {
  const { SUBJECTS } = await import('../../client/src/skills.js');
  const english = SUBJECTS.find(s => s.id === 'english');
  const problems = new Set();
  for (const g of english.grades) for (const sec of g.sections) for (const sk of sec.skills) {
    for (let i = 0; i < 40; i++) {
      const q = sk.gen();
      if (/class="rc-title"/.test(q.prompt) && !/class="rc-by"/.test(q.prompt)) problems.add(`${sk.id}: passage without a source line`);
      const prompt = strip(q.prompt), all = `${prompt} ${q.answer} ${strip(q.explain || '')}`;
      for (const [phrase, who] of FAMOUS) {
        if (!prompt.toLowerCase().includes(phrase.toLowerCase())) continue;
        // naming the source may be the question itself ("Which play contains …?") — then the answer/explanation names it
        if (!all.includes(who)) problems.add(`${sk.id}: "${phrase}" shown without "${who}"`);
      }
    }
  }
  assert.deepEqual([...problems], []);
});
