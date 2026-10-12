/* ============================================================
   MathAce — skill catalog organized IXL-style by GRADE.
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
import { ENGLISH_SKILLS } from './catalog/english.js';
import { SCIENCE_SKILLS } from './catalog/science.js';

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
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// fill(add) calls add(grade, sectionName, icon, skill) for each skill.
function buildGrades(fill, codePrefix = '') {
  const gradeMap = new Map(); // grade → { sections: Map(name → {name, icon, skills}) }
  fill((grade, sectionName, icon, skill) => {
    if (!gradeMap.has(grade)) gradeMap.set(grade, { sections: new Map() });
    const g = gradeMap.get(grade);
    if (!g.sections.has(sectionName)) g.sections.set(sectionName, { name: sectionName, icon, skills: [] });
    g.sections.get(sectionName).skills.push(skill);
  });
  return [...gradeMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([num, g]) => ({
      id: 'g' + num,
      num,
      name: 'Grade ' + num,
      sections: [...g.sections.values()]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((sec, si) => ({
          ...sec,
          letter: LETTERS[si],
          skills: sec.skills.map((sk, ki) => ({ ...sk, code: `${codePrefix}${LETTERS[si]}.${ki + 1}` }))
        }))
    }));
}

/* ---------- Math ---------- */
export const GRADES = buildGrades(add => {
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
});

/* ---------- English & Science (skills carry grade/section inline) ---------- */
const inlineFill = list => add => list.forEach(s => add(s.grade, s.section, s.icon, s));
export const ENGLISH_GRADES = buildGrades(inlineFill(ENGLISH_SKILLS), 'EN-');
export const SCIENCE_GRADES = buildGrades(inlineFill(SCIENCE_SKILLS), 'SC-');

// Subject registry — drives the top navigation and the per-subject skill pages.
export const SUBJECTS = [
  { id: 'math',    name: 'Math',    emoji: '➗', grades: GRADES,         blurb: 'Build number sense, algebra, geometry and more.' },
  { id: 'english', name: 'English', emoji: '📖', grades: ENGLISH_GRADES, blurb: 'Grammar, vocabulary and word skills.' },
  { id: 'science', name: 'Science', emoji: '🔬', grades: SCIENCE_GRADES, blurb: 'Life, earth and physical science.' }
];

// flat lookup: skill id -> { subject, grade, section, skill }
export const SKILL_INDEX = {};
for (const subject of SUBJECTS) {
  subject.grades.forEach(grade => grade.sections.forEach(section =>
    section.skills.forEach(skill => {
      SKILL_INDEX[skill.id] = { subject, grade, section, skill };
    })));
}

// Math only: the deterministic daily-practice set draws from this list.
export const ALL_SKILLS = GRADES.flatMap(g => g.sections.flatMap(s => s.skills));
export const EVERY_SKILL = SUBJECTS.flatMap(sub => sub.grades.flatMap(g => g.sections.flatMap(s => s.skills)));
