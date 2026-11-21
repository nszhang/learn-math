/* English — Reading comprehension. A question shows a whole passage (numbered paragraphs, or
   stanzas for poems) followed by one question about it: main idea, details, inference,
   vocabulary in context, structure, purpose, theme or evidence. Passages are banded by grade. */
import { pick, shuffle } from '../quiz.js';
import { RC_LIT_1_2, RC_INFO_1_2, RC_LIT_3_4, RC_INFO_3_4, RC_LIT_5_6, RC_INFO_5_6 } from './rc/early.js';
import { RC_LIT_7_8, RC_INFO_7_8, RC_ARG_6_8 } from './rc/middle.js';
import {
  RC_LIT_9_10, RC_INFO_9_10, RC_ARG_9_10, RC_POEM_9_10,
  RC_LIT_11_12, RC_INFO_11_12, RC_ARG_11_12, RC_POEM_11_12, RC_CLASSIC_11_12
} from './rc/high.js';
import { TOPIC } from './rc/topics.js';
import {
  CL_FABLES, CL_BOOKS_1_2, CL_BOOKS_3_4, CL_NOVELS_5_6, CL_NOVELS_7_8, CL_NOVELS_9_10, CL_NOVELS_11_12,
  CL_STORIES, CL_POEMS_5_8, CL_POEMS_9_12, CL_SHAKESPEARE
} from './rc/classics.js';

const RC = 'Reading comprehension';
const sk = (k, t, s, g, gen) => ({ k, t, s, g, gen });

/** Passage as HTML: title (and author), optional picture, numbered paragraphs or stanzas. */
export function renderPassage(ps, { pic = true } = {}) {
  const body = ps.p.map((para, i) => {
    if (ps.poem) return `<p class="rc-stanza">${para.replace(/\n/g, '<br>')}</p>`;
    const n = ps.p.length > 1 && !/^(CHARACTERS|\[)/.test(para) && !/^[A-Z][A-Z .']+:/.test(para) ? `<span class="rc-pn">${i + 1}</span>` : '';
    return `<p>${n}${para}</p>`;
  }).join('');
  return `<div class="passage rc-passage${ps.poem ? ' rc-poem' : ''}">` +
    (pic && ps.pic ? `<div class="rc-pic" aria-hidden="true">${ps.pic}</div>` : '') +
    `<h4 class="rc-title">${ps.t}</h4>${ps.by ? `<div class="rc-by">by ${ps.by}</div>` : ''}${body}</div>`;
}

/** gen(grade): pick a passage from the pool for this grade, then one of its questions. */
export const passageGen = pools => grade => {
  const pool = typeof pools === 'function' ? pools(grade) : pools;
  const ps = pick(pool);
  const [q, a, wrong, why] = pick(ps.q);
  return {
    type: 'mc',
    prompt: `${renderPassage(ps)}<p class="rc-q">${q}</p>`,
    answer: a,
    choices: shuffle([a, ...shuffle(wrong.filter(w => w !== a)).slice(0, 3)]),
    explain: why
  };
};

const band = (g, map) => map[Math.min(12, Math.max(1, g))];
const LIT = { 1: RC_LIT_1_2, 2: RC_LIT_1_2, 3: RC_LIT_3_4, 4: RC_LIT_3_4, 5: RC_LIT_5_6, 6: RC_LIT_5_6, 7: RC_LIT_7_8, 8: RC_LIT_7_8, 9: RC_LIT_9_10, 10: RC_LIT_9_10, 11: RC_LIT_11_12, 12: RC_LIT_11_12 };
const INFO = { 1: RC_INFO_1_2, 2: RC_INFO_1_2, 3: RC_INFO_3_4, 4: RC_INFO_3_4, 5: RC_INFO_5_6, 6: RC_INFO_5_6, 7: RC_INFO_7_8, 8: RC_INFO_7_8, 9: RC_INFO_9_10, 10: RC_INFO_9_10, 11: RC_INFO_11_12, 12: RC_INFO_11_12 };
const ARG = g => (g <= 8 ? RC_ARG_6_8 : g <= 10 ? RC_ARG_9_10 : RC_ARG_11_12);
const POEM = g => (g <= 10 ? RC_POEM_9_10 : RC_POEM_11_12);
const G = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

// Famous books and authors (public-domain classics, copied word-for-word — see rc/classics.js)
const CL_BOOKS = g => (g <= 2 ? CL_BOOKS_1_2 : CL_BOOKS_3_4);
const CL_NOVELS = g => (g <= 6 ? CL_NOVELS_5_6 : g <= 8 ? CL_NOVELS_7_8 : g <= 10 ? CL_NOVELS_9_10 : CL_NOVELS_11_12);
const CL_POEMS = g => (g <= 8 ? CL_POEMS_5_8 : CL_POEMS_9_12);
// what a student of this grade may have met: everything up to their band
const CL_READ = g => [...CL_BOOKS_3_4, ...CL_NOVELS_5_6, ...(g >= 7 ? [...CL_NOVELS_7_8, ...CL_STORIES, ...CL_POEMS_5_8] : []),
  ...(g >= 9 ? [...CL_NOVELS_9_10, ...CL_NOVELS_11_12, ...CL_POEMS_9_12, ...CL_SHAKESPEARE] : [])];
const bookOf = ps => ps.t.replace(/^From /, '').replace(/ \(\d{4}\)$/, '').replace(/ \((Act|The Adventures)[^)]*\)$/, '').replace(/^Rikki-Tikki-Tavi \((.*)\)$/, '$1');
const authorOf = ps => ps.by.replace(/ \((translated|Canadian)[^)]*\)$/, '').replace(/ \(translated\)$/, '');
const yearOf = ps => ps.t.match(/\((\d{4})\)$/)?.[1];
const firstLine = ps => {
  const text = ps.p.map(x => x.replace(/<[^>]+>/g, '')).join('\n').split('\n').find(l => l.split(' ').length >= 5) || ps.p[0];
  const s = ps.poem ? text : (text.match(/^.*?[.!?](”|")?(?=\s|$)/) || [text])[0];
  return s.split(' ').length > 30 ? s.split(' ').slice(0, 30).join(' ') + ' …' : s;
};
/** Who wrote it / which book is it from — over the famous works a student of this grade has met. */
const authorsGen = grade => {
  const seen = new Map();
  for (const ps of CL_READ(grade)) if (!seen.has(bookOf(ps))) seen.set(bookOf(ps), ps);
  const works = [...seen.values()];
  const ps = pick(works), book = bookOf(ps), author = authorOf(ps);
  const others = (f, not) => shuffle([...new Set(works.map(f))].filter(x => x !== not)).slice(0, 3);
  const credit = `<strong>${book}</strong> was written by <strong>${author}</strong>${yearOf(ps) ? ` (${yearOf(ps)})` : ''}.`;
  const kind = pick(['author', 'book', 'line', 'line']);
  if (kind === 'author') return { type: 'mc', prompt: `Who wrote <em>${book}</em>?`, answer: author, choices: shuffle([author, ...others(authorOf, author)]), explain: credit };
  if (kind === 'book') {
    const wrong = shuffle(works.filter(w => authorOf(w) !== author).map(bookOf)).slice(0, 3);
    return { type: 'mc', prompt: `Which of these was written by <strong>${author}</strong>?`, answer: book, choices: shuffle([book, ...wrong]), explain: credit };
  }
  return { type: 'mc', prompt: `Which famous work does this line come from?<div class="passage rc-passage"><p>“${firstLine(ps)}”</p></div>`,
    answer: book, choices: shuffle([book, ...others(bookOf, book)]), explain: credit };
};

// Grades 3–5 genre and topic pools (IXL "Literary texts" / "Informational texts").
const T = TOPIC;
export const TOPIC_POOLS = {
  fantasy: T.fantasy, histfic: T.histfic, scifi: T.scifi, poetry: T.poetry, drama: T.drama,
  realistic1: [...T.realistic, RC_LIT_3_4[0]], realistic2: [RC_LIT_3_4[1], RC_LIT_3_4[2], RC_LIT_5_6[1]],
  realistic: [...T.realistic, ...RC_LIT_3_4, RC_LIT_5_6[1], RC_LIT_5_6[2]],
  animals: [...T.animals, RC_INFO_3_4[0], RC_INFO_3_4[2]], food: T.food, art: [...T.art, RC_INFO_5_6[2]],
  sports: T.sports, people: T.people, places: T.places, business: T.business,
  science: [...T.science, RC_INFO_3_4[1], RC_INFO_5_6[0], RC_INFO_5_6[1]], history: T.history
};
// pictures are shown only in the "with illustrations" skills
const noPic = pool => pool.map(ps => ({ ...ps, pic: null }));

export const RC_SPECS = [
  sk('RcL', 'Read and understand: stories', RC, G(1, 12), passageGen(g => band(g, LIT))),
  sk('RcI', 'Read and understand: nonfiction', RC, G(1, 12), passageGen(g => band(g, INFO))),
  sk('RcA', 'Read and understand: arguments', RC, G(6, 12), passageGen(ARG)),
  sk('RcP', 'Read and understand: poetry', RC, G(9, 12), passageGen(POEM)),
  sk('RcC', 'Read classic and historical texts', RC, [11, 12], passageGen(RC_CLASSIC_11_12)),
  // famous books and authors, Grades 1–12
  sk('RcKb', "Read from famous children's books", RC, G(1, 4), passageGen(CL_BOOKS)),
  sk('RcFb', "Read Aesop's fables", RC, G(2, 4), passageGen(CL_FABLES)),
  sk('RcNv', 'Read from classic novels', RC, G(5, 12), passageGen(CL_NOVELS)),
  sk('RcSs', 'Read classic short stories', RC, G(7, 10), passageGen(CL_STORIES)),
  sk('RcFp', 'Read famous poems', RC, G(5, 12), passageGen(CL_POEMS)),
  sk('RcSh', 'Read Shakespeare', RC, G(8, 12), passageGen(CL_SHAKESPEARE)),
  sk('RcAu', 'Famous authors and their works', RC, G(5, 12), authorsGen),
  // Grades 3–5 genre/topic skills (titles come from the IXL alignment)
  sk('TpFnI', 'Read fantasy with illustrations', RC, G(3, 5), passageGen(TOPIC_POOLS.fantasy)),
  sk('TpHfI', 'Read historical fiction with illustrations', RC, G(3, 5), passageGen(TOPIC_POOLS.histfic)),
  sk('TpSfI', 'Read science fiction with illustrations', RC, G(3, 4), passageGen(TOPIC_POOLS.scifi)),
  sk('TpRfI', 'Read realistic fiction with illustrations', RC, G(3, 5), passageGen(TOPIC_POOLS.realistic)),
  sk('TpRf1', 'Read realistic fiction: set 1', RC, [3], passageGen(noPic(TOPIC_POOLS.realistic1))),
  sk('TpRf2', 'Read realistic fiction: set 2', RC, [3], passageGen(noPic(TOPIC_POOLS.realistic2))),
  sk('TpRf', 'Read realistic fiction', RC, [4, 5], passageGen(noPic(TOPIC_POOLS.realistic))),
  sk('TpHf', 'Read historical fiction', RC, [4, 5], passageGen(noPic(TOPIC_POOLS.histfic))),
  sk('TpPo', 'Read poetry', RC, G(3, 5), passageGen(noPic(TOPIC_POOLS.poetry))),
  sk('TpDr', 'Read drama', RC, [4, 5], passageGen(noPic(TOPIC_POOLS.drama))),
  sk('TpAn', 'Read about animals', RC, G(3, 5), passageGen(noPic(TOPIC_POOLS.animals))),
  sk('TpFd', 'Read about food', RC, [3], passageGen(noPic(TOPIC_POOLS.food))),
  sk('TpAr', 'Read about art, music and traditions', RC, G(3, 5), passageGen(noPic(TOPIC_POOLS.art))),
  sk('TpSp', 'Read about sports and hobbies', RC, G(3, 5), passageGen(noPic(TOPIC_POOLS.sports))),
  sk('TpPe', 'Read about famous people', RC, G(3, 5), passageGen(noPic(TOPIC_POOLS.people))),
  sk('TpPl', 'Read about famous places', RC, G(3, 5), passageGen(noPic(TOPIC_POOLS.places))),
  sk('TpBu', 'Read about business and technology', RC, G(3, 5), passageGen(noPic(TOPIC_POOLS.business))),
  sk('TpSc', 'Read about science and nature', RC, G(3, 5), passageGen(noPic(TOPIC_POOLS.science))),
  sk('TpHi', 'Read about history', RC, [4, 5], passageGen(noPic(TOPIC_POOLS.history)))
];
