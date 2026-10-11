/* ============================================================
   MathAce — unified skill catalog.
   Merges school topics + AlgebraAce + ExponentAce catalogs.
   Skill IDs are namespaced to stay unique across catalogs:
   school: schN1..schS4 · algebra: algA1..algI1 · exponent: expA1..expD6
   ============================================================ */
import { SCHOOL_TOPICS } from './catalog/school.js';
import { ALGEBRA_TOPICS } from './catalog/algebra.js';
import { EXPONENT_TOPICS } from './catalog/exponent.js';

// shared helpers (re-exported for the rest of the app)
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

// flat lookup: skill id -> { topic, skill }
export const SKILL_INDEX = {};
TOPICS.forEach(topic => topic.skills.forEach(skill => {
  SKILL_INDEX[skill.id] = { topic, skill };
}));

export const ALL_SKILLS = TOPICS.flatMap(t => t.skills);
