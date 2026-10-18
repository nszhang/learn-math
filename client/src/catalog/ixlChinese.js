/* ============================================================
   MathAce — Chinese catalog (Mandarin, Simplified characters + pinyin),
   organised by HSK level 1–6 instead of school grade. Category → Section → Skill.
   Specs { k, t, s, g, gen } from zh/skills.js expand into one skill per HSK level
   with id "chiH" + level + k. A skill's `grade` holds its HSK level.
   ============================================================ */
import { CHINESE_SPECS } from './zh/skills.js';

export const HSK_LEVELS = [1, 2, 3, 4, 5, 6];
export const hskLabel = n => 'HSK ' + n;

const SECTIONS = [
  ['Pronunciation', 'Tones', '🎵'],
  ['HSK words', /^Words /, '🀄'], ['HSK words', 'Picture words', '🖼️'],
  ['Listening', 'Listening', '🎧'],
  ['Numbers and time', 'Numbers', '🔢'], ['Numbers and time', 'Time and dates', '🗓️'],
  ['Grammar', 'Grammar patterns', '🧱'], ['Grammar', 'Sentence building', '🧩'], ['Grammar', 'Measure words', '📏'], ['Grammar', 'Question words', '❓'],
  ['Grammar', 'Particles', '💬'], ['Grammar', 'Comparisons', '⚖️'], ['Grammar', 'Opposites', '↔️'],
  ['Characters', 'Radicals', '🔍'], ['Characters', 'Idioms (chengyu)', '📜'],
  ['Reading', 'Reading comprehension', '📖'],
  ['Culture', 'Festivals and culture', '🏮']
];
const infoFor = name => {
  const i = SECTIONS.findIndex(([, n]) => (n instanceof RegExp ? n.test(name) : n === name));
  if (i < 0) throw new Error(`Unknown Chinese section "${name}"`);
  return { cat: SECTIONS[i][0], icon: SECTIONS[i][2], order: i };
};

const all = CHINESE_SPECS.flatMap(spec => {
  const info = infoFor(spec.s);
  // tone and tone-listening skills link to the Mandarin tones lesson ("🎓 Learn it")
  const learn = spec.s === 'Tones' || spec.k === 'LsPy' ? { learn: 'tones' } : {};
  return spec.g.map(level => ({ id: `chiH${level}${spec.k}`, title: spec.t, grade: level, section: spec.s, icon: info.icon, category: info.cat, _order: info.order, gen: spec.gen, ...learn }));
});
const seen = new Set();
for (const sk of all) { if (seen.has(sk.id)) throw new Error(`Duplicate Chinese skill id ${sk.id}`); seen.add(sk.id); }

export const CHINESE_ALL = all
  .map((sk, i) => ({ sk, i }))
  .sort((a, b) => a.sk.grade - b.sk.grade || a.sk._order - b.sk._order || a.i - b.i)
  .map(({ sk }) => { const { _order, ...rest } = sk; return rest; });
