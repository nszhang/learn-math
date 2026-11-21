/* ============================================================
   Skill search — "give me skills for similar triangles" → skills.
   Runs locally: drops filler words, stems what's left, and ranks
   skills whose title (then section) contain every topic word,
   favouring the student's own grade.
   ============================================================ */
import { gradeLevel } from './skills.js';

const STOP = new Set(`a an the and or of to in on for with about at by from into is are be am i im me my we us you your
  it its this that these those some any all what which who how do does can could should would will want wanna need
  give show find get list tell help let lets please practice practise practicing practising work working learn
  learning study studying review improve skill skills question questions problem problems exercise exercises topic
  topics thing things stuff more better good really just like also something maybe on`.split(/\s+/));

// words a student might use → the word the skill titles use
const SYNONYMS = {
  addition: 'add', adding: 'add', plus: 'add', sum: 'add', subtraction: 'subtract', minus: 'subtract',
  times: 'multiply', product: 'multiply', division: 'divide', dividing: 'divide', quotient: 'divide',
  percentage: 'percent', percentages: 'percent', pythagoras: 'pythagorean', pythagorus: 'pythagorean',
  bedmas: 'order operation', pemdas: 'order operation', bodmas: 'order operation',
  maths: 'math', stats: 'statistics', prob: 'probability',
  similarity: 'similar', scaling: 'scale', enlargement: 'enlarge', reduction: 'reduce',
  decimals: 'decimal', fractions: 'fraction', negatives: 'negative', integers: 'integer'
};

const SUFFIXES = ['ications', 'ication', 'ations', 'ation', 'ities', 'ity', 'ings', 'ing', 'ies', 'es', 's', 'ed', 'y', 'ly', 'e'];
const strip = w => { for (const suf of SUFFIXES) if (w.endsWith(suf) && w.length - suf.length >= 3) return w.slice(0, -suf.length); return w; };
export const stem = w => strip(strip(w));   // twice, so multiplying → multiply → multipl matches multiplication
const words = s => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').match(/[a-z0-9]+|[一-鿿]+/g) || [];
// one word → its search terms (synonym, then stem); used for BOTH queries and skill titles so they always agree
const termsOf = w => (SYNONYMS[w] || w).split(' ').map(stem);
const stems = s => words(s).flatMap(termsOf);

/* Turn a sentence into topic stems, plus an optional "grade 9" filter. */
export function parseQuery(q) {
  let grade = null;
  const text = q.toLowerCase().replace(/\b(?:grade|gr|g)\s*(\d{1,2})\b/, (_, n) => { grade = Number(n); return ' '; })
    .replace(/\bkindergarten\b/, () => { grade = 0; return ' '; });
  const all = words(text), topic = all.filter(w => !STOP.has(w));
  // only filler words (e.g. "more")? then search for them as typed
  const terms = [...new Set((topic.length ? topic : all).flatMap(termsOf))];
  return { terms, grade };
}

const indexCache = new WeakMap();
function indexOf(subject) {
  if (!indexCache.has(subject)) {
    const rows = [];
    for (const g of subject.grades) for (const sec of g.sections) for (const sk of sec.skills) {
      rows.push({ skill: sk, grade: g, section: sec, title: new Set(stems(sk.title)), sec: new Set(stems(sec.name)), titleSeq: stems(sk.title).join(' ') });
    }
    indexCache.set(subject, rows);
  }
  return indexCache.get(subject);
}

/* Best-matching skills of one subject. `myGrade` (school grade or HSK level) ranks nearby grades first. */
export function searchSkills(subject, query, { myGrade = null, limit = 40 } = {}) {
  const { terms, grade } = parseQuery(query);
  if (!terms.length) return { terms, grade, results: [], partial: false };
  const near = gNum => (myGrade === null ? 0 : Math.abs(gradeLevel(gNum) - myGrade));
  const score = (r, needAll) => {
    let hits = 0, s = 0;
    for (const t of terms) {
      if (r.title.has(t)) { hits++; s += 3; } else if (r.sec.has(t)) { hits++; s += 1.5; }
    }
    if (needAll ? hits < terms.length : hits < Math.max(1, Math.ceil(terms.length / 2))) return null;
    if (terms.length > 1 && r.titleSeq.includes(terms.join(' '))) s += 1;   // the exact phrase (less than the own-grade boost)
    s += hits === terms.length ? 2 : 0;
    s -= 0.02 * r.title.size;                                                // shorter, more focused titles first
    if (grade === null) { const d = near(r.grade.num); s += d === 0 ? 3 : d === 1 ? 1.5 : d === 2 ? 0.5 : 0; }
    return s;
  };
  const pool = indexOf(subject).filter(r => grade === null || gradeLevel(r.grade.num) === grade || r.grade.num === grade);
  const run = needAll => pool.map(r => ({ ...r, score: score(r, needAll) })).filter(r => r.score !== null);
  let results = run(true), partial = false;
  if (!results.length) { results = run(false); partial = results.length > 0; }
  results.sort((a, b) => b.score - a.score || near(a.grade.num) - near(b.grade.num) || a.grade.num - b.grade.num);
  return { terms, grade, partial, results: results.slice(0, limit) };
}
