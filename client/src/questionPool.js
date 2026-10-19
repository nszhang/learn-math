// Avoid repeating questions within an assignment (or one practice session).
// A question's identity is its prompt + answer (+ spoken text); choice order does not matter.

const hash = s => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return (h >>> 0).toString(36); };
// listening questions share one prompt, so what is spoken is part of their identity
export const questionSig = q => hash(String(q.prompt) + '|' + String(q.answer) + (q.say ? '|' + q.say : ''));

const MAX_PER_SKILL = 300;
const load = key => { try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; } };
const save = (key, data) => { try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* storage unavailable */ } };

/**
 * Deduper for one assignment/session. With a storageKey, what was shown is kept in
 * localStorage so a student who leaves and returns still gets new questions.
 */
export function createDeduper(storageKey = null) {
  const data = storageKey ? load(storageKey) : {};     // { skillId: [sig, …] }
  const missedQs = {};                                // { skillId: [question, …] } answered wrong this visit
  let lastSig = null;
  return {
    /**
     * A question for this skill that has not been shown yet in this assignment/session.
     * When every question has been shown: null if repeats are not allowed (practice), else a
     * question the student missed (re-asked once), else any question but the previous one.
     */
    next(skill, { allowRepeat = true } = {}) {
      const seen = new Set(data[skill.id] || []);
      let q = skill.gen(), sig = questionSig(q);
      for (let i = 0; i < 300 && seen.has(sig); i++) { q = skill.gen(); sig = questionSig(q); }
      if (!seen.has(sig)) {
        data[skill.id] = [...(data[skill.id] || []), sig].slice(-MAX_PER_SKILL);
        if (storageKey) save(storageKey, data);
        lastSig = sig;
        return q;
      }
      if (!allowRepeat) return null;
      const missed = (missedQs[skill.id] || []).filter(m => questionSig(m) !== lastSig);
      if (missed.length) {
        q = missed[0];
        missedQs[skill.id] = missedQs[skill.id].filter(m => m !== q);
      } else {
        for (let i = 0; i < 40 && sig === lastSig; i++) { q = skill.gen(); sig = questionSig(q); }
      }
      lastSig = questionSig(q);
      return q;
    },
    /** Remember a wrongly answered question so a forced repeat re-asks it first. */
    missed(skill, q) { (missedQs[skill.id] ||= []).push(q); },
    /** Start a new round for this skill (practice only). */
    reset(skill) { delete data[skill.id]; delete missedQs[skill.id]; lastSig = null; if (storageKey) save(storageKey, data); }
  };
}

/** How many different questions a skill can produce — sampled, stopping once `enough` are found. */
const distinctCache = new Map();
export function distinctQuestions(skill, enough = 20, tries = 400) {
  const key = skill.id + ':' + enough;
  if (distinctCache.has(key)) return distinctCache.get(key);
  const sigs = new Set();
  for (let i = 0; i < tries && sigs.size < enough; i++) sigs.add(questionSig(skill.gen()));
  distinctCache.set(key, sigs.size);
  return sigs.size;
}
