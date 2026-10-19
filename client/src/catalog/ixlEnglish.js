/* ============================================================
   LearnAce — English catalog organised like IXL language arts:
   Category → lettered Section → numbered Skill, per grade.
   Each grade offers IXL's skill list for that grade (eng/ixlLists.js), in IXL's order, with
   every title resolved to one of our generators (eng/ixlAlign.js), plus our own extras such as
   Reading comprehension and literature. Skill ids are "eng" + key + grade, so each grade keeps
   its own SmartScore. Generators get the grade, and Grades 9–12 use harder banks where we
   have them (eng/advanced.js).
   ============================================================ */
import { ENGLISH_SKILLS as OLD_1_5 } from './english.js';
import { ENGLISH_6_12 as OLD_6_12 } from './english612.js';
import { READING_SPECS } from './ixlEnglishReading.js';
import { VOCAB_SPECS } from './ixlEnglishVocab.js';
import { GRAMMAR_SPECS } from './ixlEnglishGrammar.js';
import { FOUNDATION_SPECS } from './eng/foundations.js';
import { LANGUAGE_SPECS } from './eng/language.js';
import { READING_E_SPECS } from './eng/reading.js';
import { RC_SPECS } from './eng/comprehension.js';
import { FOUNDATION2_SPECS } from './eng/ixlFoundations2.js';
import { LANGUAGE2_SPECS } from './eng/ixlLanguage2.js';
import { STRATEGY2_SPECS } from './eng/ixlStrategies2.js';
import { KINDER_SPECS } from './eng/ixlKindergarten.js';
import { ADVANCED } from './eng/advanced.js';
import { IXL_ENGLISH } from './eng/ixlLists.js';
import { RESOLVE, SUPERSEDED, SKIPPED } from './eng/ixlAlign.js';

const G = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// Section registry — order here is the order shown on every grade page.
const SECTIONS = [
  ['Reading Strategies', 'Reading comprehension', '📖'],
  ['Reading Foundations', 'Consonants and vowels', '🔤'],
  ['Reading Foundations', 'Syllables', '👏'],
  ['Reading Foundations', 'Rhyming', '🎵'],
  ['Reading Foundations', 'Consonant sounds and letters', '🅱️'],
  ['Reading Foundations', 'Consonant blends and digraphs', '🧩'],
  ['Reading Foundations', 'Short vowels', '🐱'],
  ['Reading Foundations', 'Short and long vowels', '↕️'],
  ['Reading Foundations', 'Silent e', '🤫'],
  ['Reading Foundations', 'Vowel teams', '👯'],
  ['Reading Foundations', 'R-controlled vowels', '🚗'],
  ['Reading Foundations', 'Diphthongs: oi, oy, ou, ow', '🐄'],
  ['Reading Foundations', 'Two-syllable and multisyllable words', '🔗'],
  ['Reading Foundations', 'Sight words', '👀'],
  ['Reading Strategies', 'Reality vs. fiction', '🦄'],
  ['Reading Strategies', 'Main idea', '📌'],
  ['Reading Strategies', 'Theme', '🦊'],
  ['Reading Strategies', 'Audience, purpose and tone', '🎯'],
  ['Reading Strategies', 'Text structure', '🏗️'],
  ['Reading Strategies', 'Sequence', '🔢'],
  ['Reading Strategies', 'Cause and effect', '➡️'],
  ['Reading Strategies', 'Sensory details', '👃'],
  ['Reading Strategies', 'Literary devices', '🎭'],
  ['Reading Strategies', 'Point of view', '👁️'],
  ['Reading Strategies', 'Inference and analysis', '🕵️'],
  ['Reading Strategies', 'Story elements', '📚'],
  ['Reading Strategies', 'Analyzing literature', '📖'],
  ['Reading Strategies', 'Analyzing informational texts', '📰'],
  ['Writing Strategies', 'Organizing writing', '🗂️'],
  ['Writing Strategies', 'Topic sentences', '💡'],
  ['Writing Strategies', 'Topic sentences and thesis statements', '💡'],
  ['Writing Strategies', 'Linking words', '🔗'],
  ['Writing Strategies', 'Opinion writing', '💬'],
  ['Writing Strategies', 'Developing and supporting arguments', '⚖️'],
  ['Writing Strategies', 'Persuasive strategies', '📣'],
  ['Writing Strategies', 'Descriptive details', '🖍️'],
  ['Writing Strategies', 'Writing clearly and concisely', '✂️'],
  ['Writing Strategies', 'Editing and revising', '✏️'],
  ['Writing Strategies', 'Research skills', '🔎'],
  ['Vocabulary', 'Prefixes and suffixes', '🧱'],
  ['Vocabulary', 'Greek and Latin roots', '🏛️'],
  ['Vocabulary', 'Compound words', '➕'],
  ['Vocabulary', 'Categories', '🗃️'],
  ['Vocabulary', 'Synonyms and antonyms', '↔️'],
  ['Vocabulary', 'Homophones', '👂'],
  ['Vocabulary', 'Multiple-meaning words', '🦇'],
  ['Vocabulary', 'Shades of meaning', '🎚️'],
  ['Vocabulary', 'Word usage and nuance', '🎚️'],
  ['Vocabulary', 'Idioms and adages', '🗣️'],
  ['Vocabulary', 'Foreign words and expressions', '🌍'],
  ['Vocabulary', 'Analogies', '🔁'],
  ['Vocabulary', 'Context clues', '🔍'],
  ['Vocabulary', 'Reference skills', '📕'],
  ['Grammar and Mechanics', 'Sentences, fragments and run-ons', '🧩'],
  ['Grammar and Mechanics', 'Phrases and clauses', '🏗️'],
  ['Grammar and Mechanics', 'Nouns', '🏷️'],
  ['Grammar and Mechanics', 'Pronouns', '👤'],
  ['Grammar and Mechanics', 'Verb types', '🏃'],
  ['Grammar and Mechanics', 'Subject-verb agreement', '🤝'],
  ['Grammar and Mechanics', 'Verb tense', '⏳'],
  ['Grammar and Mechanics', 'Articles', '🅰️'],
  ['Grammar and Mechanics', 'Adjectives and adverbs', '🎨'],
  ['Grammar and Mechanics', 'Prepositions', '📍'],
  ['Grammar and Mechanics', 'Conjunctions', '🔗'],
  ['Grammar and Mechanics', 'Contractions', '✂️'],
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

// Where the original skills (written before this catalog) now live.
const OLD_PLACEMENT = {
  engRHY1: 'Rhyming', engALP1: 'Reference skills', engNVB1: 'Nouns', engPUN1: 'Sentences, fragments and run-ons', engOPP1: 'Synonyms and antonyms',
  engPLU1: 'Nouns', engSYN2: 'Synonyms and antonyms', engCMP2: 'Compound words', engCAP2: 'Capitalization', engPST2: 'Verb tense', engCON2: 'Contractions',
  engADJ3: 'Adjectives and adverbs', engHOM3: 'Homophones', engPFX3: 'Prefixes and suffixes', engPRO3: 'Pronouns',
  engSNT4: 'Sentences, fragments and run-ons', engAPO4: 'Nouns', engFIG4: 'Literary devices', engADV4: 'Adjectives and adverbs',
  engCNJ5: 'Conjunctions', engIRR5: 'Verb tense', engIDM5: 'Idioms and adages', engCNF5: 'Editing and revising',
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
const placedOld = [...OLD_1_5, ...OLD_6_12].map(sk => {
  const sec = OLD_PLACEMENT[sk.id];
  const info = SECTION_INFO.get(sec);
  if (!info) throw new Error(`No section placement for ${sk.id}`);
  return { ...sk, section: sec, icon: info.icon, category: info.cat, _order: info.order };
});


// Grade ranges for our own (non-IXL) skills that are shared across grades.
const GRADE_OVERRIDES = {
  Frag: G(2, 12), RunO: G(2, 12), FrRo: G(2, 12), PrPh: G(3, 12), CpTt: G(2, 12), FmTt: G(3, 12), FmQt: G(3, 12),
  TnPr: G(4, 12), TnPf: G(4, 12), AdAv: G(2, 11), PnRl: G(4, 12), CxMn: G(3, 12), CxSy: G(4, 12),
  RtCl: G(3, 12), RtMn: G(4, 12), RtWd: G(4, 12), RtSo: G(4, 12), InfD1: G(4, 12), FcOp: G(3, 12),
  BrNr: G(3, 12), OrgT: G(3, 12), PlgR: G(4, 12), SvCp: G(4, 12), Anl: G(5, 12), FgSp: G(5, 12)
};

/* ---------- every generator, by key ---------- */
const CAT_CASE = c => c[0].toUpperCase() + c.slice(1).toLowerCase(); // "Reading Strategies" → "Reading strategies"
const SPECS = new Map();
// Two older generators share a key at different grades (ShEm); the second is stored under an
// internal key but keeps its original skill ids.
const addSpec = (key, spec) => {
  if (!SPECS.has(key)) return SPECS.set(key, spec);
  const prev = SPECS.get(key);
  if (spec.grades.some(g => prev.grades.includes(g))) throw new Error(`Duplicate English generator key ${key}`);
  SPECS.set(key + '_2', { ...spec, idKey: key });
};
for (const sp of [...FOUNDATION_SPECS, ...READING_E_SPECS, ...READING_SPECS, ...VOCAB_SPECS, ...LANGUAGE_SPECS, ...GRAMMAR_SPECS,
  ...RC_SPECS, ...FOUNDATION2_SPECS, ...LANGUAGE2_SPECS, ...STRATEGY2_SPECS, ...KINDER_SPECS]) {
  addSpec(sp.k, { title: sp.t, section: sp.s, grades: GRADE_OVERRIDES[sp.k] || sp.g, gen: sp.gen });
}
// the original (pre-catalog) skills: one fixed grade each
for (const sk of placedOld) {
  const key = sk.id.slice(3, sk.id.length - String(sk.grade).length);
  addSpec(key, { title: sk.title, section: sk.section, grades: [sk.grade], gen: sk.gen, old: true });
}

const norm = t => t.toLowerCase().replace(/[–—]/g, '-').replace(/["“”'’]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const BY_TITLE = new Map();
for (const [key, sp] of SPECS) {
  const n = norm(sp.title);
  if (!BY_TITLE.has(n)) BY_TITLE.set(n, []);
  BY_TITLE.get(n).push(key);
}
const MANUAL = new Map();
for (const [title, key, grades] of RESOLVE) {
  if (!SPECS.has(key)) throw new Error(`IXL alignment: unknown key ${key} for "${title}"`);
  const n = norm(title);
  if (!MANUAL.has(n)) MANUAL.set(n, []);
  MANUAL.get(n).push({ key, grades });
}
function resolve(title, grade) {
  const n = norm(title);
  const m = (MANUAL.get(n) || []).find(x => !x.grades || x.grades.includes(grade));
  if (m) return m.key;
  const keys = BY_TITLE.get(n);
  if (!keys) return null;
  return keys.find(k => SPECS.get(k).grades.includes(grade)) || keys[0];
}

/* ---------- build each grade ---------- */
const CAT_ORDER = ['Reading foundations', 'Reading strategies', 'Writing strategies', 'Vocabulary', 'Grammar and mechanics'];
const ICON_BY_SECTION = new Map(SECTIONS.map(([, name, icon]) => [name, icon]));
const EXTRA_ICONS = {
  'Short and long vowels': '↕️', 'Short and long vowel sounds': '↕️', 'Short and long vowel patterns': '↕️', 'Long vowel patterns': '📏', 'Blending and segmenting': '🔗',
  'Variant vowels': '🔤', 'Soft g and c': '🧲', 'Consonant-l-e': '🐢', 'Two-syllable words': '🔗', 'Blends': '🧩', 'Multisyllabic words': '🔗', 'Irregular words': '👀',
  'Diphthongs and r vowel patterns': '🐄', 'Inference': '🕵️', 'Inference and analysis': '🕵️', 'Visual elements': '🖼️', 'Literary texts': '📚', 'Literary texts: level 1': '📚',
  'Literary texts: level 2': '📖', 'Informational texts': '📰', 'Informational texts: level 1': '📰', 'Informational texts: level 2': '🗞️', 'Comparing texts': '⚖️',
  'Topic and purpose': '🎯', "Author's purpose": '🎯', "Author's purpose and tone": '🎯', "Writer's purpose": '🎯', 'Topic sentences': '💡', 'Introductions and conclusions': '💡',
  'Creative techniques': '🎨', 'Active and passive voice': '🔄', 'Nouns and adjectives': '🏷️', 'Sentences': '🧩', 'Verbs': '🏃', 'Adjectives': '🎨', 'Idioms': '🗣️',
  'Pronouns and antecedents': '👤', 'Pronoun types': '👤', 'Direct and indirect objects': '🎯', 'Punctuation': '❗', 'Domain-specific vocabulary': '🔬', 'Word choice and usage': '🎚️',
  'Theme': '🦊', 'Point of view': '👁️', 'Text structure': '🏗️', 'Sequence': '🔢', 'Cause and effect': '➡️', 'Opinion writing': '💬', 'Linking words': '🔗'
};
const iconFor = name => ICON_BY_SECTION.get(name) || EXTRA_ICONS[name] || '📘';
const catOf = name => CAT_CASE(SECTION_INFO.get(name)?.cat || 'Reading strategies');
const supersededBy = new Map(SUPERSEDED);
const genFor = (key, grade) => {
  const adv = grade >= 9 && ADVANCED[key];
  const g = adv || SPECS.get(key).gen;
  return () => g(grade);
};

// keys that IXL titles resolve to at some grade
const IXL_KEYS = new Set();
for (let grade = 0; grade <= 12; grade++) for (const [, , title] of IXL_ENGLISH[grade]) { const k = resolve(title, grade); if (k) IXL_KEYS.add(k); }

// our Reading comprehension skills are offered at all their grades, even where IXL also uses them
const OWN = new Set(['RcL', 'RcI', 'RcA', 'RcP', 'RcC']);

export const ENGLISH_UNRESOLVED = []; // IXL titles we could not place (should stay empty apart from SKIPPED)
export const ENGLISH_ALIASES = {};    // old skill id → current skill id
const all = [];
const usedKeysAnyGrade = new Set();
for (let grade = 0; grade <= 12; grade++) {
  const rows = [], used = new Set(), titles = new Set();
  for (const [cat, section, title] of IXL_ENGLISH[grade]) {
    if (SKIPPED.includes(title)) continue;
    const key = resolve(title, grade);
    if (!key) { ENGLISH_UNRESOLVED.push(`${grade}: ${title}`); continue; }
    if (used.has(key)) { ENGLISH_UNRESOLVED.push(`${grade}: ${title} (generator ${key} already used)`); continue; }
    used.add(key); usedKeysAnyGrade.add(key); titles.add(norm(title));
    rows.push({ key, title, grade, section, category: cat });
  }
  // our own skills at this grade that IXL doesn't list (e.g. Reading comprehension, literature)
  for (const [key, sp] of SPECS) {
    if (!sp.grades.includes(grade) || used.has(key) || supersededBy.has(key)) continue;
    if (titles.has(norm(sp.title))) continue; // same skill already offered under IXL's title
    if (IXL_KEYS.has(key) && !OWN.has(key)) continue; // an IXL-aligned generator is offered only at IXL's grades
    used.add(key);
    rows.push({ key, title: sp.title, grade, section: sp.section, category: catOf(sp.section), extra: true });
  }
  // order: categories in IXL order; within a category IXL's sections first, then our extra sections
  // (Reading comprehension leads Reading strategies)
  const secOrder = [];
  for (const r of rows) if (!secOrder.includes(r.section)) secOrder.push(r.section);
  const rank = r => [CAT_ORDER.indexOf(r.category) < 0 ? 9 : CAT_ORDER.indexOf(r.category), r.section === 'Reading comprehension' ? -1 : secOrder.indexOf(r.section)];
  rows.map((r, i) => ({ r, i, k: rank(r) })).sort((a, z) => a.k[0] - z.k[0] || a.k[1] - z.k[1] || a.i - z.i)
    .forEach(({ r }) => all.push({
      id: 'eng' + (SPECS.get(r.key).idKey || r.key) + grade, key: r.key, title: r.title, grade, section: r.section,
      icon: iconFor(r.section), category: r.category, gen: genFor(r.key, grade)
    }));
}

const ids = new Set();
for (const sk of all) {
  if (ids.has(sk.id)) throw new Error(`Duplicate English skill id ${sk.id}`);
  ids.add(sk.id);
}
// Old ids that are no longer offered point to the same generator at the nearest grade it is offered.
const byKey = new Map();
for (const sk of all) { if (!byKey.has(sk.key)) byKey.set(sk.key, []); byKey.get(sk.key).push(sk); }
for (const [key, sp] of SPECS) {
  const target = byKey.get(key) || byKey.get(supersededBy.get(key));
  if (!target) continue;
  if (sp.idKey) continue; // shares ids with another generator
  const gs = new Set([...sp.grades, ...G(0, 12)]);
  for (const g of gs) {
    const id = 'eng' + key + g;
    if (ids.has(id)) continue;
    const near = target.reduce((best, s) => (Math.abs(s.grade - g) < Math.abs(best.grade - g) ? s : best));
    ENGLISH_ALIASES[id] = near.id;
  }
}

export const ENGLISH_ALL = all;
