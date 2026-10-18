/* ============================================================
   LearnAce — shared question builders for text-based subjects
   (English, Science). Every builder returns a gen() function that
   yields { type: 'mc', prompt, answer, choices, explain }.
   ============================================================ */

export const ri = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const pick = arr => arr[ri(0, arr.length - 1)];
export const shuffle = arr => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = ri(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
export const S = (id, title, grade, section, icon, gen) => ({ id, title, grade, section, icon, gen });

// Pick from a bank without repeating the previous pick.
function picker(bank) {
  let last = -1;
  return () => {
    let i;
    do { i = ri(0, bank.length - 1); } while (bank.length > 1 && i === last);
    last = i;
    return bank[i];
  };
}

/** "Which category does this belong to?"  items: [text, category, note?] */
export function classify({ categories, items, prompt, explain }) {
  const next = picker(items);
  return () => {
    const [text, cat, note] = next();
    return {
      type: 'mc',
      prompt: prompt(text),
      answer: cat,
      choices: shuffle(categories),
      explain: note || (explain ? explain(text, cat) : `<strong>${text}</strong> is <strong>${cat}</strong>.`)
    };
  };
}

/**
 * Question → answer. items: [question, answer, note?, wrongAnswers?]
 * Wrong choices come from `wrongAnswers` when given, else from other items' answers.
 */
export function pairs({ items, prompt = q => q, choicesPer = 4 }) {
  const next = picker(items);
  const allAnswers = [...new Set(items.map(i => i[1]))];
  return () => {
    const [q, a, note, wrong] = next();
    const pool = shuffle((wrong || allAnswers).filter(x => x !== a));
    const choices = shuffle([a, ...pool.slice(0, choicesPer - 1)]);
    return {
      type: 'mc',
      prompt: prompt(q),
      answer: a,
      choices,
      explain: note || `The answer is <strong>${a}</strong>.`
    };
  };
}

/** "Choose the correct one": correct answer plus wrong options. Returns a pairs() item. */
export const ok = (correct, wrong, note) => ['', correct, note, [correct, ...wrong]];

/**
 * Passage questions. items: [passage, question, answer, wrongAnswers, note].
 * The passage is shown above the question.
 */
export function passageQs({ items, title = 'Read the passage.' }) {
  return pairs({
    prompt: q => q,
    items: items.map(([p, q, a, w, n]) => [
      `<div class="passage"><small class="muted">${title}</small><br>${p}</div><p style="margin-top:10px">${q}</p>`, a, n, [a, ...w]])
  });
}
