/* ============================================================
   LearnAce — skill catalog organized IXL-style by GRADE.
   Each grade has lettered sections; skills are numbered within
   their section (A.1, A.2, B.1 …) like ca.ixl.com.

   Skill IDs are namespaced: elementary el*, school sch*,
   algebra alg*, exponent exp*.
   ============================================================ */
import { SCHOOL_TOPICS } from './catalog/school.js';
import { ALGEBRA_TOPICS } from './catalog/algebra.js';
import { EXPONENT_TOPICS } from './catalog/exponent.js';
import { ELEMENTARY } from './catalog/elementary.js';
import { EXTRA_SKILLS } from './catalog/extra.js';
import { EXTRA2_SKILLS } from './catalog/extra2.js';
import { GRADE9_BOOK_SKILLS } from './catalog/grade9book.js';
import { ENGLISH_ALL, ENGLISH_ALIASES } from './catalog/ixlEnglish.js';
import { CHINESE_ALL, HSK_LEVELS, hskLabel } from './catalog/ixlChinese.js';
import { SCIENCE_ALL } from './catalog/ixlScience.js';
import { IXL_MATH_SKILLS, IXL_MATH_SECTION_ORDER, ixlIconFor } from './catalog/ixlMath/index.js';
import { MATH_TOPICS, mathTopic, SCIENCE_TOPICS, scienceTopic } from './catalog/topics.js';
import { BEDMAS_SKILLS, BEDMAS_SECTION } from './catalog/bedmasSkills.js';

const ENGLISH_SKILLS = ENGLISH_ALL;
const SCIENCE_SKILLS = SCIENCE_ALL;

export {
  ri, pick, fmtNum,
  PRAISE, PRAISE_CHALLENGE, ENCOURAGE, MASTERY_MSGS
} from './catalog/algebra.js';

const prefix = (topics, p) => topics.map(t => ({
  ...t,
  skills: t.skills.map(s => ({ ...s, id: p + s.id }))
}));

export const TOPICS = [
  ...prefix(SCHOOL_TOPICS, 'sch'),
  ...prefix(ALGEBRA_TOPICS, 'alg'),
  ...prefix(EXPONENT_TOPICS, 'exp')
];

/* ---------- placement of existing skills into grades ---------- */
// skillId → [grade, sectionName, icon]
const PLACEMENT = {
  // number sense
  schN1: [5, 'Order of operations', '🧮'],
  schN2: [5, 'Add and subtract fractions', '🍕'],
  schN3: [6, 'Percents', '💯'],
  // geometry
  schG1: [4, 'Geometry', '📐'],
  schG2: [4, 'Geometry', '📐'],
  schG3: [5, 'Geometry', '📐'],
  schG4: [7, 'Geometry', '📐'],
  schG5: [7, 'Geometry', '📐'],
  schG6: [5, 'Measurement', '📦'],
  // probability & statistics
  schP1: [7, 'Probability', '🎲'],
  schP2: [7, 'Probability', '🎲'],
  schP3: [7, 'Probability', '🎲'],
  schS1: [6, 'Statistics', '📊'],
  schS2: [6, 'Statistics', '📊'],
  schS3: [6, 'Statistics', '📊'],
  schS4: [6, 'Statistics', '📊'],
  // algebra
  algA1: [7, 'Expressions', '🧮'],
  algA2: [7, 'Expressions', '🧮'],
  algB1: [7, 'One-variable equations', '➕'],
  algB2: [7, 'One-variable equations', '➕'],
  algC1: [7, 'One-variable equations', '➕'],
  algI1: [7, 'One-variable equations', '➕'],
  algC2: [8, 'Equations', '🔀'],
  algD1: [8, 'Inequalities', '⚖️'],
  algD2: [8, 'Inequalities', '⚖️'],
  algE1: [8, 'Linear relations', '📈'],
  algE2: [8, 'Linear relations', '📈'],
  algE3: [8, 'Linear relations', '📈'],
  algF1: [9, 'Exponents', '💪'],
  algF2: [9, 'Exponents', '💪'],
  algF3: [9, 'Exponents', '💪'],
  algG1: [9, 'Systems of equations', '🤝'],
  algH1: [10, 'Quadratic equations', '🎯'],
  // exponents & logs
  expA1: [7, 'Exponents', '💪'],
  expA2: [8, 'Exponents', '💪'],
  expA3: [8, 'Exponents', '💪'],
  expB1: [9, 'Exponent rules', '🧬'],
  expB2: [9, 'Exponent rules', '🧬'],
  expB3: [9, 'Exponent rules', '🧬'],
  expB4: [9, 'Exponent rules', '🧬'],
  expC1: [10, 'Exponential equations', '📈'],
  expC2: [10, 'Exponential equations', '📈'],
  expC3: [10, 'Exponential equations', '📈'],
  expD1: [11, 'Logarithms', '🔢'],
  expD2: [11, 'Logarithms', '🔢'],
  expD3: [11, 'Logarithms', '🔢'],
  expD5: [11, 'Logarithms', '🔢'],
  expD4: [12, 'Logarithms', '🔢'],
  expD6: [12, 'Logarithms', '🔢']
};

/* ---------- build a grade tree (shared by every subject) ---------- */
// A, B … Z, AA, BB … ZZ (IXL-style section letters)
const GRADE_NAMES = { '-1': 'Junior Kindergarten', 0: 'Kindergarten', 13: 'Calculus' };

// Student grade levels: −1 = JK, 0 = K, 1–12. (Calculus, "grade" 13, is a grade-12 course.)
export const STUDENT_GRADES = Array.from({ length: 14 }, (_, i) => i - 1);
export const gradeLabel = n => (n === null || n === undefined ? 'No grade' : n === -1 ? 'JK' : n === 0 ? 'K' : n === 13 ? 'Calculus' : 'Grade ' + n);
// the grade level a skill's grade counts as when comparing with a student's grade
export const gradeLevel = n => (n === 13 ? 12 : n);
const letterFor = i => { const c = String.fromCharCode(65 + (i % 26)); return c.repeat(Math.floor(i / 26) + 1); };

// fill(add) calls add(grade, sectionName, icon, skill) for each skill.
// ordered=true keeps sections in the order they were added (IXL-style) instead of A→Z by name;
// sections carry the skill's optional `category` (e.g. "Grammar and Mechanics").
function buildGrades(fill, codePrefix = '', ordered = false, sectionOrder = null, topics = null) {
  const gradeMap = new Map(); // grade → { sections: Map(name → {name, icon, category, skills}) }
  fill((grade, sectionName, icon, skill) => {
    if (!gradeMap.has(grade)) gradeMap.set(grade, { sections: new Map() });
    const g = gradeMap.get(grade);
    if (!g.sections.has(sectionName)) g.sections.set(sectionName, { name: sectionName, icon, category: skill.category, skills: [] });
    g.sections.get(sectionName).skills.push(skill);
  });
  // topics = { list, of(grade, sectionName) }: group sections under topic headings, keeping each topic's
  // sections in their usual order. Letters and codes are assigned after grouping.
  const topicIndex = (num, name) => {
    const t = topics.of(num, name);
    const i = t === null ? -1 : topics.list.indexOf(t);
    if (i < 0) throw new Error(`Section "${name}" (grade ${num}) has no topic`);
    return i;
  };
  const baseOrder = (num, a, b) => (sectionOrder && sectionOrder(num, a.name) !== null ? sectionOrder(num, a.name) - sectionOrder(num, b.name) : ordered ? 0 : a.name.localeCompare(b.name));
  return [...gradeMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([num, g]) => ({
      id: 'g' + num,
      num,
      name: GRADE_NAMES[num] || 'Grade ' + num,
      sections: [...g.sections.values()]
        .map(sec => (topics ? { ...sec, category: topics.of(num, sec.name) } : sec))
        .sort((a, b) => (topics ? topicIndex(num, a.name) - topicIndex(num, b.name) : 0) || baseOrder(num, a, b))
        .map((sec, si) => ({
          ...sec,
          letter: letterFor(si),
          skills: sec.skills.map((sk, ki) => ({ ...sk, code: `${codePrefix}${letterFor(si)}.${ki + 1}` }))
        }))
    }));
}

/* ---------- Math ---------- */
// Grades 1–5 follow IXL's section structure (catalog/ixlMath). The skills written before that
// catalog existed are placed into the matching IXL section so nobody's progress moves or disappears.
const IXL_OLD_PLACEMENT = {
  // Grade 1
  elADD1: 'Addition up to 20', t3: 'Addition up to 20', elBND1: 'Addition and subtraction up to 10', t4: 'Addition strategies up to 20', t5: 'Addition word problems up to 20',
  elCMP1: 'Comparing and ordering', elSYM1: 'Comparing and ordering', t8: 'Comparing and ordering', elCNT1: 'Skip-counting', elCNT2: 'Counting and numbers', t1: 'Counting and numbers',
  t2: 'Addition and subtraction: multiples of ten', t11: 'Two-dimensional shapes', t10: 'Time', elPLG1: 'Place value', t9: 'Place value',
  elSUB1: 'Subtraction up to 20', t6: 'Subtraction up to 20', elFAM1: 'Addition and subtraction up to 10', t7: 'Subtraction word problems up to 20',
  // Grade 2
  elADD2: 'Addition - two digits', t15: 'Addition - two digits', elSUB2: 'Subtraction - two digits', t16: 'Subtraction - two digits', elADD3: 'Addition - one digit', elMIS2: 'Addition - one digit',
  t21: 'Data and graphs', t20: 'Two-dimensional shapes', t18: 'Money', t19: 'Units of measurement', elPAT2: 'Skip-counting and number patterns', elEVN2: 'Even and odd', t17: 'Patterns',
  elPLV1: 'Place value', elEXP2: 'Place value', t12: 'Place value', t14: 'Place value', t13: 'Comparing and ordering', elWPB2: 'Mixed operations - two digits',
  // Grade 3
  t31: 'Data and graphs', elDIV3: 'Division fluency', elDIN3: 'Understand division', t24: 'Division skill builders', t25: 'Division fluency', elFRQ3: 'Understand fractions', elFCP3: 'Compare and order fractions',
  t26: 'Fractions on number lines', t27: 'Understand fractions', elSHP3: 'Two-dimensional shapes', elPER3: 'Perimeter, area and volume', t28: 'Perimeter, area and volume', t30: 'Time',
  elMUL3: 'Multiplication fluency', elWPM3: 'Multiplication', elARR3: 'Understand multiplication', t22: 'Multiplication skill builders', t23: 'Multiplication fluency', elDIS3: 'Multiplication', t29: 'Multiplication', elRND3: 'Estimation and rounding',
  // Grade 4
  elEQF4: 'Equivalent fractions', elFCM4: 'Compare fractions', t34: 'Equivalent fractions', elANG4: 'Lines and angles', t37: 'Lines and angles', t38: 'Symmetry and transformations',
  schG1: 'Area, perimeter and volume', schG2: 'Area, perimeter and volume', t39: 'Units of measurement', t40: 'Patterns and sequences', elMUL4: 'Multiplication', elARE4: 'Multiplication', t32: 'Multiplication',
  elDIV4: 'Division', t33: 'Division', elGCF4: 'Factors and multiples', elFAC4: 'Factors and multiples', t35: 'Factors and multiples', elRND4: 'Rounding', t36: 'Rounding',
  // Grade 5
  schN2: 'Add and subtract fractions with unlike denominators', elDEC5: 'Add and subtract decimals up to hundredths', elDPV5: 'Decimal place value: up to hundredths', elDXW5: 'Multiply decimals by whole numbers',
  t41: 'Divide decimals', t42: 'Compare decimals', t43: 'Convert between decimals and fractions', elFRC5: 'Multiply fractions and whole numbers', elFXW5: 'Multiply fractions and whole numbers',
  t47: 'Triangles and quadrilaterals', schG3: 'Perimeter and area', elUNT5: 'Units of measurement', t46: 'Volume and surface area', schG6: 'Volume and surface area',
  elPRM5: 'Number theory', elLCM5: 'Number theory', t44: 'Number theory', t45: 'Numerical expressions', schN1: 'Numerical expressions', t48: 'Patterns and sequences',
  // Grade 6
  elFDC6: 'Percents', t52: 'Percents', elPRO6: 'Equivalent expresssions', t54: 'Expressions', t56: 'Perimeter and area', elINT6: 'Integers', elICO6: 'Integers', elABS6: 'Integers', t49: 'Integers', t50: 'Integers',
  t55: 'Number theory', t53: 'Consumer math', schN3: 'Percents of numbers', elRAT6: 'Ratios and rates', elERQ6: 'Ratios and rates', t51: 'Ratios and rates',
  elMIS6: 'Statistics', schS1: 'Statistics', schS2: 'Statistics', schS3: 'Statistics', schS4: 'Statistics',
  // Grade 7
  t64: 'Consumer math', elSQR7: 'Exponents and square roots', t60: 'Exponents and square roots', expA1: 'Exponents and square roots', elWRE7: 'Expressions', t59: 'Equivalent expressions', algA1: 'Expressions', algA2: 'Equivalent expressions',
  t57: 'Perimeter and area', schG5: 'Perimeter and area', schG4: 'Two-dimensional figures', t62: 'Operations with integers', elLAW7: 'Equivalent expressions', t65: 'Equivalent expressions',
  t66: 'One-variable equations', algB1: 'One-variable equations', algB2: 'One-variable equations', algC1: 'One-variable equations', algI1: 'One-variable equations', t61: 'Percents',
  t58: 'Probability', schP1: 'Probability', schP2: 'Probability', schP3: 'Probability', elPRP7: 'Ratios, rates and proportions', t63: 'Sequences',
  // Grade 8
  elDST8: 'One-variable equations', t67: 'One-variable equations', algC2: 'One-variable equations', t73: 'Two-variable statistics', t69: 'Scientific notation', t70: 'Scientific notation',
  expA2: 'Exponents', expA3: 'Exponents', elPYT8: 'Pythagorean theorem', elANR8: 'Lines and angles', t74: 'Lines and angles', t71: 'Surface area and volume',
  elGRD8: 'One-variable inequalities', algD1: 'One-variable inequalities', algD2: 'One-variable inequalities',
  elSLE8: 'Linear functions', t68: 'Linear functions', algE1: 'Linear functions', algE2: 'Linear functions', algE3: 'Linear functions', t72: 'Transformations and congruence',
  // Grade 9
  t126: 'Circles', t127: 'Circles', t128: 'Circles', t129: 'Circles', t130: 'Circles', t131: 'Circles', t132: 'Circles', t123: 'Statistics', t124: 'Statistics', t125: 'Probability',
  elMON9: 'Monomials', expB1: 'Exponents', expB2: 'Exponents', expB3: 'Exponents', expB4: 'Exponents', t112: 'Exponents', t113: 'Exponents', algF1: 'Exponents', algF2: 'Exponents', algF3: 'Exponents',
  elWLE9: 'Linear functions', t78: 'Linear functions', t81: 'Linear functions', t121: 'Number sequences', t122: 'Relations and functions', t80: 'Geometry', t79: 'Numbers',
  elPLY9: 'Polynomials', t76: 'Polynomials', t77: 'Polynomials', t118: 'Polynomials', t119: 'Polynomials', t120: 'Polynomials', t108: 'Numbers', t109: 'Operations', t110: 'Operations', t111: 'Numbers',
  t114: 'Geometry', t115: 'Geometry', t116: 'Geometry', t117: 'Geometry', t106: 'Geometry', t107: 'Geometry', t104: 'Geometry', t105: 'Geometry', t75: 'Systems of linear equations', algG1: 'Systems of linear equations',
  // Grade 10
  t88: 'Functions: linear, quadratic, exponential', expC1: 'Functions: linear, quadratic, exponential', expC2: 'Functions: linear, quadratic, exponential', expC3: 'Functions: linear, quadratic, exponential',
  elDIF10: 'Factoring', elCMF10: 'Factoring', t84: 'Factoring', t86: 'Quadratic equations', elVIE10: 'Quadratic equations', t82: 'Quadratic equations', t83: 'Parabolas', algH1: 'Quadratic equations',
  t85: 'Radical expressions', t87: 'Systems of linear equations',
  // Grade 11
  t93: 'Rational exponents', elINV11: 'Functions', t89: 'Functions', t90: 'Functions', expD1: 'Exponential functions', expD2: 'Exponential functions', expD3: 'Exponential functions', expD5: 'Exponential functions',
  t95: 'Polynomials', t94: 'Sequences and series', elTRG11: 'Trigonometry', elSPA11: 'Trigonometry', t91: 'Trigonometry', t92: 'Trigonometry',
  // Grade 12
  t102: 'Complex numbers', t103: 'Complex numbers', t101: 'Probability', elCMP12: 'Exponential and logarithmic functions', t97: 'Exponential and logarithmic functions', t99: 'Sequences and series',
  t96: 'Logarithms', expD4: 'Logarithms', expD6: 'Logarithms', t100: 'Probability', elARS12: 'Sequences and series', elGEO12: 'Sequences and series', t98: 'Sequences and series'
};
const IXL_GRADES = new Set(Object.keys(IXL_MATH_SECTION_ORDER).map(Number));

export const GRADES = buildGrades(addRaw => {
  const add = (grade, section, icon, skill) => {
    if (!IXL_GRADES.has(grade)) return addRaw(grade, section, icon, skill);
    const sec = IXL_OLD_PLACEMENT[skill.id];
    if (!sec || IXL_MATH_SECTION_ORDER[grade]?.[sec] === undefined) throw new Error(`Skill ${skill.id} (grade ${grade}) has no IXL section placement`);
    addRaw(grade, sec, ixlIconFor(sec), skill);
  };
  // elementary skills (already graded)
  for (const { grade, sections } of ELEMENTARY) {
    for (const sec of sections) {
      for (const skill of sec.skills) add(grade, sec.name, sec.icon, skill);
    }
  }
  // expansion skills (grade/section inline)
  for (const skill of EXTRA_SKILLS) add(skill.grade, skill.section, skill.icon, skill);
  for (const skill of EXTRA2_SKILLS) add(skill.grade, skill.section, skill.icon, skill);
  for (const skill of GRADE9_BOOK_SKILLS) add(skill.grade, skill.section, skill.icon, skill);

  // placed catalog skills
  for (const topic of TOPICS) {
    for (const skill of topic.skills) {
      const place = PLACEMENT[skill.id];
      if (!place) throw new Error(`Skill ${skill.id} has no grade placement`);
      add(place[0], place[1], place[2], skill);
    }
  }

  // IXL-structured skills
  for (const sk of IXL_MATH_SKILLS) addRaw(sk.grade, sk.section, sk.icon, sk);
  // BEDMAS practice (grades 3–9), paired with the Learn lesson
  for (const sk of BEDMAS_SKILLS) addRaw(sk.grade, sk.section, sk.icon, sk);
}, '', false, (grade, name) => (name === BEDMAS_SECTION ? 9999 : IXL_GRADES.has(grade) ? IXL_MATH_SECTION_ORDER[grade]?.[name] ?? null : null), { list: MATH_TOPICS, of: mathTopic });

/* ---------- English & Science (skills carry grade/section inline) ---------- */
const inlineFill = list => add => list.forEach(s => add(s.grade, s.section, s.icon, s));
export const ENGLISH_GRADES = buildGrades(inlineFill(ENGLISH_SKILLS), 'EN-', true);
// Chinese is organised by HSK level (1–6) rather than school grade: "grade" num = HSK level.
export const CHINESE_GRADES = buildGrades(inlineFill(CHINESE_ALL), 'ZH-', true).map(g => ({ ...g, name: hskLabel(g.num) }));
export const SCIENCE_GRADES = buildGrades(inlineFill(SCIENCE_SKILLS), 'SC-', true, null, { list: SCIENCE_TOPICS, of: scienceTopic });

// Subject registry — drives the top navigation and the per-subject skill pages.
export const SUBJECTS = [
  { id: 'math',    name: 'Math',    emoji: '➗', grades: GRADES,         blurb: 'Build number sense, algebra, geometry and more.' },
  { id: 'english', name: 'English', emoji: '📖', grades: ENGLISH_GRADES, blurb: 'Grammar, vocabulary and word skills.' },
  { id: 'science', name: 'Science', emoji: '🔬', grades: SCIENCE_GRADES, blurb: 'Physical, life, earth and space science.' },
  { id: 'chinese', name: 'Chinese', emoji: '🀄', grades: CHINESE_GRADES, levels: 'hsk', blurb: 'Mandarin (simplified characters + pinyin) by HSK level 1–6 — tones, listening, words, grammar, reading and culture. Go at your own pace!' }
];

/* ---------- levels: school grade, or HSK level for Chinese ---------- */
export { HSK_LEVELS, hskLabel };
export const isHsk = subject => subject?.levels === 'hsk';
// u: anything with grade / hskLevel (the user, a student row, homework data). HSK starts at 1.
export const studentLevelFor = (subject, u) => (isHsk(subject) ? (u?.hskLevel ?? 1) : (u?.grade ?? null));
export const levelLabelFor = (subject, n) => (isHsk(subject) ? hskLabel(n) : gradeLabel(n));
// the level a subject's grade/level number counts as when compared with the student's
export const levelOf = (subject, num) => (isHsk(subject) ? num : gradeLevel(num));
export const isStudentLevel = (subject, num, u) => num !== 13 && levelOf(subject, num) === studentLevelFor(subject, u);
export const isAboveLevel = (subject, num, u) => { const l = studentLevelFor(subject, u); return l !== null && levelOf(subject, num) > l; };

// HSK readiness: a student can move up whenever they like; we suggest it once
// 70% of the current level's skills have reached 🥉 70.
export const HSK_PASS_SCORE = 70, HSK_READY_SHARE = 0.7;
export function hskReadiness(level, scoreOf) {
  const g = CHINESE_GRADES.find(x => x.num === level);
  const skills = g ? g.sections.flatMap(s => s.skills) : [];
  const passed = skills.filter(s => scoreOf(s.id) >= HSK_PASS_SCORE).length;
  return { passed, total: skills.length, ready: skills.length > 0 && passed >= Math.ceil(skills.length * HSK_READY_SHARE) };
}

// flat lookup: skill id -> { subject, grade, section, skill }
export const SKILL_INDEX = {};
for (const subject of SUBJECTS) {
  subject.grades.forEach(grade => grade.sections.forEach(section =>
    section.skills.forEach(skill => {
      SKILL_INDEX[skill.id] = { subject, grade, section, skill };
    })));
}
// English skill ids that were renumbered when English was aligned with IXL's grade lists keep
// working (old homework, saved progress): they resolve to the same generator at the nearest grade.
for (const [oldId, newId] of Object.entries(ENGLISH_ALIASES)) {
  if (!SKILL_INDEX[oldId] && SKILL_INDEX[newId]) SKILL_INDEX[oldId] = SKILL_INDEX[newId];
}

// Math only: the deterministic daily-practice set draws from this list.
export const ALL_SKILLS = GRADES.flatMap(g => g.sections.flatMap(s => s.skills));
export const EVERY_SKILL = SUBJECTS.flatMap(sub => sub.grades.flatMap(g => g.sections.flatMap(s => s.skills)));
