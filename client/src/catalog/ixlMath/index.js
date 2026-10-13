/* ============================================================
   MathAce — IXL-style math catalog, Grades 1–5.
   manifest.js lists every IXL section/skill (with permanent ids); the rule
   files attach a generator to each skill by title. Skills whose title no
   rule matches are left out and listed in IXL_MATH_MISSING (a test keeps
   that list empty for finished grades).
   ============================================================ */
import { MANIFEST } from './manifest.js';
import { findGen } from './engine.js';
import { NUMBER_RULES } from './rules/numbers.js';
import { EARLY_RULES } from './rules/early.js';
import { MEASURE_RULES } from './rules/measure.js';
import { DATA_RULES } from './rules/data.js';
import { PATTERN_RULES } from './rules/patterns.js';
import { GEOMETRY_RULES } from './rules/geometry.js';
import { GEOMEASURE_RULES } from './rules/geomeasure.js';
import { FRACTION_RULES } from './rules/fractions.js';
import { DECIMAL_RULES } from './rules/decimals.js';
import { FRACOPS_RULES } from './rules/fracops.js';
import { ALGEBRA_RULES } from './rules/algebra.js';
import { MULDIV_RULES } from './rules/muldiv.js';
import { ARITH_RULE } from './rules/arith.js';

const RULES = [
  ...NUMBER_RULES,
  ...EARLY_RULES,
  ...MEASURE_RULES,
  ...DATA_RULES,
  ...PATTERN_RULES,
  ...GEOMETRY_RULES,
  ...GEOMEASURE_RULES,
  ...FRACTION_RULES,
  ...FRACOPS_RULES,
  ...DECIMAL_RULES,
  ...ALGEBRA_RULES,
  ...MULDIV_RULES,
  ARITH_RULE
];

// Section icons by keyword (first match wins).
const ICONS = [
  [/clock|time/i, '🕒'], [/money|financial/i, '💰'], [/data|graph/i, '📊'], [/probab|statistic/i, '🎲'],
  [/fraction/i, '🍕'], [/decimal|percent/i, '🔟'], [/ratio|rate/i, '⚖️'], [/coordinate/i, '🧭'],
  [/three-dimensional/i, '🧊'], [/two-dimensional|polygon|triangle|quadrilateral/i, '🔷'], [/symmetry|transform/i, '🦋'], [/angle|line/i, '📐'],
  [/perimeter|area|volume|surface/i, '📦'], [/measure|unit/i, '📏'], [/pattern|sequence|skip/i, '🔁'],
  [/exponent|expression|equation|inequal|variable/i, '🔤'], [/integer/i, '➖'], [/number theory|factor|multiple|prime/i, '🧬'],
  [/multipl/i, '✖️'], [/divis/i, '➗'], [/subtract/i, '➖'], [/add/i, '➕'], [/place value|number|counting|compar|order|round|estimat/i, '🔢'],
  [/calendar|day|month|season/i, '📅'], [/spatial/i, '👀'], [/word problem|mixed/i, '🧩'], [/property|properties/i, '🧮'], [/venn/i, '⭕']
];
export const ixlIconFor = name => (ICONS.find(([re]) => re.test(name)) || [0, '🧮'])[1];

// A generator may return null to ask for a fresh draw; exceptions also trigger a redraw.
const safe = (gen, id) => () => {
  let last;
  for (let i = 0; i < 40; i++) {
    try { const q = gen(); if (q) return q; } catch (e) { last = e; }
  }
  throw new Error(`generator for ${id} failed${last ? ': ' + last.message : ''}`);
};

export const IXL_MATH_MISSING = [];
export const IXL_MATH_SECTION_ORDER = {};   // grade → { sectionName → index }
export const IXL_MATH_SKILLS = [];

for (const grade of Object.keys(MANIFEST).map(Number)) {
  IXL_MATH_SECTION_ORDER[grade] = {};
  MANIFEST[grade].forEach((sec, si) => {
    IXL_MATH_SECTION_ORDER[grade][sec.name] = si;
    for (const [id, title] of sec.skills) {
      const gen = findGen(RULES, { grade, section: sec.name, title, id });
      if (!gen) { IXL_MATH_MISSING.push({ id, grade, section: sec.name, title }); continue; }
      IXL_MATH_SKILLS.push({ id, title, grade, section: sec.name, icon: ixlIconFor(sec.name), gen: safe(gen, id) });
    }
  });
}
