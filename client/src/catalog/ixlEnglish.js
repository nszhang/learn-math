/* ============================================================
   MathAce — English catalog organised like IXL language arts:
   Category → lettered Section → numbered Skill, per grade.
   A skill is declared once ({ k, t, s, g:[grades], gen }) and expanded
   into one skill per grade with id "eng" + k + grade, so each grade keeps
   its own SmartScore. Content lives in ixlEnglishReading/Vocab/Grammar.js.
   ============================================================ */
import { ENGLISH_SKILLS as OLD_1_5 } from './english.js';
import { ENGLISH_6_12 as OLD_6_12 } from './english612.js';
import { READING_SPECS } from './ixlEnglishReading.js';
import { VOCAB_SPECS } from './ixlEnglishVocab.js';
import { GRAMMAR_SPECS } from './ixlEnglishGrammar.js';

// Section registry — order here is the order shown on the grade page.
const SECTIONS = [
  ['Reading Strategies', 'Main idea', '📌'],
  ['Reading Strategies', 'Audience, purpose and tone', '🎯'],
  ['Reading Strategies', 'Literary devices', '🎭'],
  ['Reading Strategies', 'Analyzing literature', '📖'],
  ['Reading Strategies', 'Analyzing informational texts', '📰'],
  ['Writing Strategies', 'Organizing writing', '🗂️'],
  ['Writing Strategies', 'Topic sentences and thesis statements', '💡'],
  ['Writing Strategies', 'Developing and supporting arguments', '⚖️'],
  ['Writing Strategies', 'Persuasive strategies', '📣'],
  ['Writing Strategies', 'Writing clearly and concisely', '✂️'],
  ['Writing Strategies', 'Editing and revising', '✏️'],
  ['Writing Strategies', 'Research skills', '🔎'],
  ['Vocabulary', 'Prefixes and suffixes', '🧱'],
  ['Vocabulary', 'Greek and Latin roots', '🏛️'],
  ['Vocabulary', 'Homophones', '👂'],
  ['Vocabulary', 'Foreign words and expressions', '🌍'],
  ['Vocabulary', 'Word usage and nuance', '🎚️'],
  ['Vocabulary', 'Analogies', '🔁'],
  ['Vocabulary', 'Context clues', '🔍'],
  ['Grammar and Mechanics', 'Sentences, fragments and run-ons', '🧩'],
  ['Grammar and Mechanics', 'Phrases and clauses', '🏗️'],
  ['Grammar and Mechanics', 'Pronouns', '👤'],
  ['Grammar and Mechanics', 'Verb types', '🏃'],
  ['Grammar and Mechanics', 'Subject-verb agreement', '🤝'],
  ['Grammar and Mechanics', 'Verb tense', '⏳'],
  ['Grammar and Mechanics', 'Adjectives and adverbs', '🎨'],
  ['Grammar and Mechanics', 'Misplaced modifiers', '🎯'],
  ['Grammar and Mechanics', 'Restrictive and nonrestrictive elements', '🧷'],
  ['Grammar and Mechanics', 'Commas', ','],
  ['Grammar and Mechanics', 'Semicolons, colons and commas', ';'],
  ['Grammar and Mechanics', 'Dashes, hyphens and ellipses', '—'],
  ['Grammar and Mechanics', 'Apostrophes', '’'],
  ['Grammar and Mechanics', 'Capitalization', '🔠'],
  ['Grammar and Mechanics', 'Formatting', '🗨️']
];
const SECTION_INFO = new Map(SECTIONS.map(([cat, name, icon], i) => [name, { cat, icon, order: i }]));

// Where the original skills (written before this catalog) now live for grades 6–12.
const OLD_PLACEMENT = {
  engMNI6: 'Main idea', engFIG6: 'Literary devices', engROT6: 'Greek and Latin roots', engPCS6: 'Pronouns',
  engCMA6: 'Commas', engCLS7: 'Phrases and clauses', engSNT7: 'Phrases and clauses', engCON7: 'Word usage and nuance',
  engSMC7: 'Semicolons, colons and commas', engANL7: 'Analogies', engVCE8: 'Verb types', engVBL8: 'Verb types',
  engPRL8: 'Writing clearly and concisely', engALU8: 'Literary devices', engMOD8: 'Misplaced modifiers',
  engLTD9: 'Literary devices', engAGR9: 'Subject-verb agreement', engRHA9: 'Persuasive strategies',
  engSPL9: 'Editing and revising', engPOV9: 'Literary devices', engFLC10: 'Developing and supporting arguments',
  engWHM10: 'Pronouns', engPOE10: 'Analyzing literature', engVOC10: 'Context clues', engRED10: 'Audience, purpose and tone',
  engRHD11: 'Literary devices', engAUT11: 'Analyzing literature', engERR11: 'Editing and revising',
  engPER11: 'Analyzing literature', engBRL12: 'Analyzing literature', engSHK12: 'Analyzing literature',
  engMVT12: 'Analyzing literature', engVOC12: 'Word usage and nuance', engCNV12: 'Pronouns'
};
// Grades 1–5 keep their original section names, grouped under a category.
const EARLY_CATEGORY = { 'Reading and phonics': 'Reading Foundations', Grammar: 'Grammar and Mechanics', Vocabulary: 'Vocabulary' };

const placedOld = OLD_6_12.map(sk => {
  const sec = OLD_PLACEMENT[sk.id];
  const info = SECTION_INFO.get(sec);
  if (!info) throw new Error(`No section placement for ${sk.id}`);
  return { ...sk, section: sec, icon: info.icon, category: info.cat, _order: info.order };
});
const early = OLD_1_5.map(sk => ({ ...sk, category: EARLY_CATEGORY[sk.section] || 'Grammar and Mechanics', _order: -1 }));

// Expand { k, t, s, g, gen } specs into one skill per grade.
function expand(specs) {
  return specs.flatMap(spec => {
    const info = SECTION_INFO.get(spec.s);
    if (!info) throw new Error(`Unknown section "${spec.s}" for ${spec.k}`);
    return spec.g.map(grade => ({
      id: 'eng' + spec.k + grade, title: spec.t, grade, section: spec.s, icon: info.icon,
      category: info.cat, _order: info.order, gen: spec.gen
    }));
  });
}

const all = [...early, ...placedOld, ...expand([...READING_SPECS, ...VOCAB_SPECS, ...GRAMMAR_SPECS])];
const ids = new Set();
for (const sk of all) {
  if (ids.has(sk.id)) throw new Error(`Duplicate English skill id ${sk.id}`);
  ids.add(sk.id);
}
// grade, then section order, then declaration order (Array.sort is stable)
export const ENGLISH_ALL = all
  .map((sk, i) => ({ sk, i }))
  .sort((a, b) => a.sk.grade - b.sk.grade || a.sk._order - b.sk._order || a.i - b.i)
  .map(({ sk }) => { const { _order, ...rest } = sk; return rest; });
