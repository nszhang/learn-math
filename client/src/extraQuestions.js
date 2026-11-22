/* ============================================================
   Extra question banks (client/public/more/{subject}.json, built by scripts/more/build.py).
   Thousands of additional hand-written questions for skills whose own banks are small, keyed by
   "bank" (a skill shared across grades is one bank). A subject's file is fetched the first time
   the student opens that subject or practises one of its skills; until then the skill's own
   questions are used.
   ============================================================ */
const EXTRA = {};
const loading = {};
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

/** The bank a skill draws from: the same English/Science skill at several grades shares one bank. */
export const bankKey = (subject, id, title) =>
  subject === 'english' ? id.replace(/(JK|\d+)$/, '') : subject === 'science' ? id.replace(/\d+$/, '') : subject === 'math' ? 'mth:' + title : id;

export function registerExtras(subject, data) { EXTRA[subject] = data; }
export function loadExtras(subject) {
  if (!subject || EXTRA[subject] || loading[subject] || typeof window === 'undefined' || typeof fetch === 'undefined') return;
  const base = (import.meta.env?.BASE_URL || '/').replace(/\/?$/, '/');
  loading[subject] = fetch(`${base}more/${subject}.json`).then(r => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(data => registerExtras(subject, data)).catch(() => { delete loading[subject]; });
}

/** Mix a bank's extra questions into a skill's generator (most of the time, once loaded). */
export function withExtras(subject, key, gen, share = 0.7) {
  return (...args) => {
    const list = EXTRA[subject]?.[key];
    if (list?.length && Math.random() < share) {
      const [prompt, answer, wrong, explain] = pick(list);
      return { type: 'mc', prompt, answer, choices: shuffle([answer, ...wrong]), explain };
    }
    return gen(...args);
  };
}
