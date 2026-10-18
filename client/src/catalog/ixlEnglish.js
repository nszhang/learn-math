/* ============================================================
   LearnAce — English catalog organised like IXL language arts:
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
import { FOUNDATION_SPECS } from './eng/foundations.js';
import { LANGUAGE_SPECS } from './eng/language.js';
import { READING_E_SPECS } from './eng/reading.js';

const G = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// Section registry — order here is the order shown on every grade page.
const SECTIONS = [
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

// Grade 6–12 skills that IXL also teaches in earlier grades (content is simple enough).
const GRADE_OVERRIDES = {
  Frag: G(2, 12), RunO: G(2, 12), FrRo: G(2, 12), PrPh: G(3, 12), CpTt: G(2, 12), FmTt: G(3, 12), FmQt: G(3, 12),
  TnPr: G(4, 12), TnPf: G(4, 12), AdAv: G(2, 11), PnRl: G(4, 12), CxMn: G(3, 12), CxSy: G(4, 12),
  RtCl: G(3, 12), RtMn: G(4, 12), RtWd: G(4, 12), RtSo: G(4, 12), InfD1: G(4, 12), FcOp: G(3, 12),
  BrNr: G(3, 12), OrgT: G(3, 12), PlgR: G(4, 12), SvCp: G(4, 12), Anl: G(5, 12), FgSp: G(5, 12)
};

// Skills IXL already teaches in grades 6–7: start them earlier (keeps their top grade).
const LOWER_START = {
  Frml: 6, SbOb: 6, AuPu: 6, TnCp: 7, AlSr: 7, FgEf: 6, ThSt: 7, EvSw: 6, EvBt: 6, PsAd: 6, CjAv: 7, Rdn: 6, RvSg: 6, MsSp: 6, EvRs: 6, CfPr: 6, MnId: 6,
  WpAn: 6, WpSn: 6, NuCd: 7, NuTh: 6, NuDc: 6, AnlC: 7, CxAn: 6, CxDm: 6,
  PhCl: 6, Appo: 6, DpIn: 6, SnTy: 6, RlCl: 7, PnVg: 7, PnSh: 7, PnRf: 6, VbTr: 7, VbLk: 7, VbPt: 7, VbGr: 7, VbIn: 7, DiOb: 6,
  SvEr: 6, SvIn: 6, TnSh: 6, AvCp: 6, AvWl: 6, MdSl: 7, MdOk: 7, RsPn: 7, RsCm: 7, CmDa: 6, CmCs: 6, CmCa: 6, CmRv: 6,
  ScJn: 7, ScCl: 7, ScSr: 7, DsUs: 7, DsHy: 7, DsEl: 7, ApPl: 6
};

// Expand { k, t, s, g, gen } specs into one skill per grade.
function expand(specs) {
  return specs.flatMap(spec => {
    const info = SECTION_INFO.get(spec.s);
    if (!info) throw new Error(`Unknown section "${spec.s}" for ${spec.k}`);
    const grades = GRADE_OVERRIDES[spec.k] || (LOWER_START[spec.k] ? G(LOWER_START[spec.k], Math.max(...spec.g)) : spec.g);
    return grades.map(grade => ({
      id: 'eng' + spec.k + grade, title: spec.t, grade, section: spec.s, icon: info.icon,
      category: info.cat, _order: info.order, gen: spec.gen
    }));
  });
}

const all = [...placedOld, ...expand([...FOUNDATION_SPECS, ...READING_E_SPECS, ...READING_SPECS, ...VOCAB_SPECS, ...LANGUAGE_SPECS, ...GRAMMAR_SPECS])];
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
