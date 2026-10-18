/* ============================================================
   MathAce — Chinese catalog (Mandarin, Simplified characters + pinyin),
   taught as a second language from Grade 1. Category → Section → Skill,
   like English. Specs { k, t, s, g, gen } from zh/skills.js expand into one
   skill per grade with id "chi" + k + grade.
   ============================================================ */
import { CHINESE_SPECS } from './zh/skills.js';

const SECTIONS = [
  ['Pinyin and Tones', 'Tones', '🎵'],
  ['Characters', 'Radicals', '🧩'], ['Characters', 'Character meanings', '🀄'],
  ['Vocabulary', 'Greetings', '👋'], ['Vocabulary', 'Family', '👪'], ['Vocabulary', 'Colours', '🎨'], ['Vocabulary', 'Body', '🙂'],
  ['Vocabulary', 'Numbers', '🔢'], ['Vocabulary', 'Animals', '🐼'], ['Vocabulary', 'Food and drink', '🥟'], ['Vocabulary', 'School', '🏫'],
  ['Vocabulary', 'Action words', '🏃'], ['Vocabulary', 'Time and dates', '🗓️'], ['Vocabulary', 'Weather and seasons', '⛅'],
  ['Vocabulary', 'Places', '🏙️'], ['Vocabulary', 'Hobbies', '⚽'], ['Vocabulary', 'Feelings', '😊'], ['Vocabulary', 'Clothing and shopping', '🛍️'],
  ['Vocabulary', 'Transportation', '🚲'], ['Vocabulary', 'Everyday words', '👋'], ['Vocabulary', 'Food, animals and school', '🥟'],
  ['Vocabulary', 'Daily life', '🏃'], ['Vocabulary', 'Around town', '🏙️'], ['Vocabulary', 'Shopping and travel', '🛍️'], ['Vocabulary', 'Opposites', '↔️'], ['Vocabulary', 'Idioms (chengyu)', '📜'],
  ['Grammar', 'Measure words', '📏'], ['Grammar', 'Sentence building', '🧱'], ['Grammar', 'Question words', '❓'], ['Grammar', 'Particles', '💬'],
  ['Grammar', 'Comparisons', '⚖️'],
  ['Reading', 'Reading comprehension', '📖'],
  ['Culture', 'Festivals and culture', '🏮']
];
const INFO = new Map(SECTIONS.map(([cat, name, icon], i) => [name, { cat, icon, order: i }]));

const all = CHINESE_SPECS.flatMap(spec => {
  const info = INFO.get(spec.s);
  if (!info) throw new Error(`Unknown Chinese section "${spec.s}" for ${spec.k}`);
  return spec.g.map(grade => ({ id: 'chi' + spec.k + grade, title: spec.t, grade, section: spec.s, icon: info.icon, category: info.cat, _order: info.order, gen: spec.gen }));
});
const seen = new Set();
for (const sk of all) { if (seen.has(sk.id)) throw new Error(`Duplicate Chinese skill id ${sk.id}`); seen.add(sk.id); }

export const CHINESE_ALL = all
  .map((sk, i) => ({ sk, i }))
  .sort((a, b) => a.sk.grade - b.sk.grade || a.sk._order - b.sk._order || a.i - b.i)
  .map(({ sk }) => { const { _order, ...rest } = sk; return rest; });
