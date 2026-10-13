/* Fractions (Grades 1–5): models, number lines, equivalence, comparing, ordering, operations, mixed numbers. */
import {
  ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, num, mc, yesNo, near, svg, C, NAMES, thing, emojiRow, big, gcd, lcm, words,
  fracBar, fracCircle, fracGrid, numberLine
} from '../h.js';
import { R } from '../engine.js';

/* ---------- representation ---------- */
export const stack = (n, d) => `<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1.15;margin:0 3px;font-size:.95em"><span style="border-bottom:1.6px solid currentColor;padding:0 4px">${n}</span><span style="padding:0 4px">${d}</span></span>`;
export const fs = (n, d) => `${n}/${d}`;
export const mixedStack = (w, n, d) => `${w} ${stack(n, d)}`;
export const mixedStr = (w, n, d) => `${w} ${n}/${d}`;
export const simp = (n, d) => { const g = gcd(n, d); return [n / g, d / g]; };
const fsimp = (n, d) => { const [a, c] = simp(n, d); return c === 1 ? String(a) : fs(a, c); };
export const toMixed = (n, d) => ({ w: Math.floor(n / d), n: n % d, d });
const mixedText = (n, d) => { const x = toMixed(n, d); return x.n === 0 ? String(x.w) : x.w === 0 ? fs(x.n, d) : mixedStr(x.w, x.n, d); };
const FRAC_NAMES = { 2: 'half', 3: 'third', 4: 'fourth', 5: 'fifth', 6: 'sixth', 7: 'seventh', 8: 'eighth', 9: 'ninth', 10: 'tenth', 12: 'twelfth' };
const nameOf = (n, d) => (d === 2 && n === 1 ? 'one half' : d === 2 ? `${words(n)} halves` : `${words(n)} ${FRAC_NAMES[d]}${n > 1 ? 's' : ''}`);
const denFor = (grade, title = '') => {
  if (/halves and fourths/.test(title)) return pick([2, 4]);
  if (/halves, thirds and fourths/.test(title)) return pick([2, 3, 4]);
  if (/sixths and eighths/.test(title)) return pick([6, 8]);
  if (/halves, thirds, fourths, sixths and eighths/.test(title)) return pick([2, 3, 4, 6, 8]);
  return grade <= 2 ? pick([2, 3, 4]) : grade === 3 ? pick([2, 3, 4, 6, 8]) : grade === 4 ? pick([2, 3, 4, 5, 6, 8, 10, 12]) : pick([2, 3, 4, 5, 6, 8, 10, 12]);
};
const proper = d => { const n = ri(1, d - 1); return [n, d]; };
const fracDistractors = (n, d, extra = 3) => uniq([fs(n + 1 <= d ? n + 1 : n - 1, d), fs(d - n || 1, d), fs(n, d + 1), fs(d, n), fs(n, d - 1 || 2), fs(n - 1 || 1, d)].filter(x => x !== fs(n, d) && !/\/0$|^0\//.test(x))).slice(0, extra + 2);

/* ---------- pictures ---------- */
const MODELS = ['bar', 'circle', 'grid'];
const modelFor = (title, grade) => (/fraction bars|strip/.test(title) ? 'bar' : /area models/.test(title) ? 'grid' : /circle/.test(title) ? 'circle' : pick(grade <= 2 ? ['circle', 'bar'] : ['bar', 'circle']));
function drawModel(kind, n, d, opts = {}) {
  if (kind === 'circle') return fracCircle(n, d, { size: opts.size || 96 });
  if (kind === 'grid' && d <= 12) { const rows = d % 3 === 0 && d > 3 ? 3 : d % 2 === 0 && d > 2 ? 2 : 1; return fracGrid(n, rows, d / rows, { cell: Math.min(40, Math.floor(200 / (d / rows))) }); }
  return fracBar(n, d, { width: opts.width || 220 });
}
const labelled = (pics, letters = 'ABCD') => `<div style="display:flex;gap:18px;flex-wrap:wrap;align-items:flex-end">${pics.map((p, i) => `<div><b>${letters[i]}</b>${p}</div>`).join('')}</div>`;
/** choose-the-picture question: correct(n,d) renders the right model; wrong variants shade a different amount */
function pictureQ(prompt, n, d, kind, explain) {
  const wrongs = uniq([n + 1 <= d ? n + 1 : n - 1, n - 1 >= 1 ? n - 1 : n + 1, n + 2 <= d ? n + 2 : Math.max(1, n - 2)]).filter(x => x !== n && x >= 0 && x <= d).slice(0, 3);
  const all = shuffle([n, ...wrongs]), L = 'ABCD'[all.indexOf(n)];
  return mc(`${prompt}${labelled(all.map(k => drawModel(kind, k, d, { width: 150, size: 80 })))}`, L, 'ABCD'.slice(0, all.length).split('').filter(x => x !== L), explain || `Picture ${b(L)} shades ${b(fs(n, d))}.`, 4);
}
/** fraction number line from `lo` to `hi` with ticks 1/den */
function fracLine({ den, hi = 1, marks = [], label = true, width = 460 }) {
  return numberLine({ min: 0, max: hi, step: 1 / den, labelEvery: 1, marks, hideLabels: true, width }) + (label ? `<div class="muted" style="font-size:12px;margin-top:-4px">Each tick is ${stack(1, den)}.</div>` : '');
}
function fracLineLabeled(den, hi, marks) {
  // replace tick labels with 0 and hi only
  const tickLabels = `<div style="display:flex;justify-content:space-between;max-width:420px;font-size:13px;margin:-4px 22px 4px"><span>0</span><span>${hi}</span></div>`;
  return fracLine({ den, hi, marks, label: false }) + tickLabels;
}

/* ---------- helpers for comparing / operations ---------- */
const cmpSym = (a, c) => (a === c ? '=' : a > c ? '>' : '<');
const fv = (n, d) => n / d;
const orderQ = (title, grade) => () => {
  let fr;
  if (/like denominators/.test(title)) { const d = pick([6, 8, 10, 12]); fr = sample(range(1, d - 1), 3).map(n => [n, d]); }
  else if (/like numerators/.test(title)) { const n = ri(1, 5); fr = sample(range(n + 1, n + 9), 3).map(d => [n, d]); }
  else fr = [pick([[1, 2], [1, 3], [2, 3], [3, 4], [1, 4]]), pick([[3, 8], [5, 6], [2, 5], [7, 10], [5, 8]]), pick([[1, 6], [4, 5], [3, 5], [7, 12], [9, 10]])];
  if (new Set(fr.map(f => fv(...f))).size < 3) return null;
  const asc = Math.random() < 0.5, sorted = fr.slice().sort((x, y) => (asc ? fv(...x) - fv(...y) : fv(...y) - fv(...x))), key = a => a.map(f => fs(...f)).join(', ');
  const wrongs = [shuffle(sorted), shuffle(sorted), sorted.slice().reverse()].map(key).filter(k => k !== key(sorted));
  return mc(`Order from ${b(asc ? 'least to greatest' : 'greatest to least')}:<br>${m(fr.map(f => stack(...f)).join(' , '))}`, key(sorted), uniq(wrongs), `Compare the fractions: ${b(key(sorted))}.`);
};

export const FRACTION_RULES = [
  /* ===== G1–G3: understanding fractions ===== */
  R(/^(?:Identify equal parts|Equal parts)$/, () => () => {
    const equal = Math.random() < 0.5, d = pick([2, 3, 4]);
    const pic = equal ? fracBar(0, d, { width: 180 }) : svg(184, 38, `<rect x="2" y="2" width="180" height="34" fill="#fff" stroke="${C.ink}" stroke-width="2"/><line x1="${ri(30, 60)}" y1="2" x2="${ri(30, 60)}" y2="36" stroke="${C.ink}" stroke-width="2"/><line x1="${ri(120, 150)}" y1="2" x2="${ri(120, 150)}" y2="36" stroke="${C.ink}" stroke-width="2"/>`);
    return yesNo(`${pic}Is this shape divided into ${b('equal parts')}?`, equal, equal ? 'All the parts are the same size.' : 'The parts are different sizes, so they are not equal parts.', ['Yes', 'No']);
  }),
  R(/^Identify halves and fourths$|^Identify halves, thirds and fourths$|^Identify the fraction$|^Identify fractions$|^Understand fractions(?:: .*)?$|^Fractions of a whole$/, (mt, ctx) => () => {
    const d = denFor(ctx.grade, ctx.title), [n] = proper(d), kind = modelFor(ctx.title, ctx.grade);
    const ans = fs(n, d), alts = fracDistractors(n, d);
    return mc(`${drawModel(kind, n, d)}What fraction of the shape is ${b('shaded')}?`, ans, alts, `${n} of the ${d} equal parts are shaded: ${b(ans)}${d <= 4 && ctx.grade <= 2 ? ` (${nameOf(n, d)})` : ''}.`, 4);
  }),
  R(/^Make halves and fourths$|^Make halves and fourths in different ways$|^Make halves, thirds and fourths$|^Make sixths and eighths$|^Make halves, thirds, fourths, sixths and eighths$/, (mt, ctx) => () => {
    const d = denFor(ctx.grade, ctx.title), kind = pick(['circle', 'bar']), parts = Array.from({ length: 3 }, (_, i) => pick([d, d + 1 + i, d - 1 > 1 ? d - 1 : d + 4])), all = uniq([d, ...parts.filter(p => p !== d)]).slice(0, 3);
    while (all.length < 3) all.push(d + all.length + 2);
    const order = shuffle(all), L = 'ABC'[order.indexOf(d)];
    return mc(`Which shape is divided into ${b(d === 2 ? 'halves' : FRAC_NAMES[d] + 's')} (${d} equal parts)?${labelled(order.map(k => drawModel(kind, 0, k, { width: 150, size: 80 })), 'ABC')}`, L, 'ABC'.split('').filter(x => x !== L), `Shape ${b(L)} has ${d} equal parts.`, 3);
  }),
  R(/^Which shape illustrates the fraction\?$|^Match fractions to models(?:: halves, thirds and fourths)?$|^Show fractions(?:: .*)?$/, (mt, ctx) => () => {
    const d = denFor(ctx.grade, ctx.title), [n] = proper(d), kind = modelFor(ctx.title, ctx.grade);
    return pictureQ(`Which picture shows ${m(stack(n, d))}?`, n, d, kind);
  }),
  R(/^Match unit fractions to models$/, (mt, ctx) => () => {
    const d = denFor(ctx.grade, ctx.title), kind = pick(['bar', 'circle']);
    return pictureQ(`Which picture shows the unit fraction ${m(stack(1, d))}?`, 1, d, kind);
  }),
  R(/^Unit fractions$|^Unit fractions: (?:modelling )?word problems$/, (mt, ctx) => () => {
    const d = pick([2, 3, 4, 6, 8]), n1 = pick(NAMES), t = pick(['pizza', 'pie', 'sandwich', 'cake', 'pan of brownies']);
    return mc(`${n1} cuts a ${t} into ${b(d)} equal slices and eats ${b(1)} slice. What fraction of the ${t} did ${n1} eat?`, fs(1, d), [fs(1, d + 1), fs(d, 1) === '2/1' ? '1/3' : fs(d, 1), fs(2, d)].filter(x => x !== fs(1, d)), `1 slice out of ${d} equal slices is ${b(fs(1, d))}.`, 4);
  }),
  R(/^Fractions of a whole: (?:modelling )?word problems$/, () => () => {
    const d = pick([3, 4, 5, 6, 8]), n = ri(2, d - 1), nm = pick(NAMES);
    return mc(`${nm} cuts a loaf into ${b(d)} equal pieces and eats ${b(n)} pieces. What fraction of the loaf did ${nm} eat?`, fs(n, d), fracDistractors(n, d), `${n} out of ${d} equal pieces: ${b(fs(n, d))}.`, 4);
  }),
  R(/^Fractions of a group$|^Fractions of a group: word problems$/, (mt, ctx) => () => {
    const d = pick([3, 4, 5, 6, 8, 10]), n = ri(1, d - 1), [, , e1] = thing(); let [, , e2] = thing(); if (e2 === e1) e2 = '🔶';
    const row = shuffle([...Array(n).fill(e1), ...Array(d - n).fill(e2)]).join('');
    return mc(`${big(row)}What fraction of the shapes are ${b(e1)}?`, fs(n, d), fracDistractors(n, d), `${n} of the ${d} shapes are ${e1}: ${b(fs(n, d))}.`, 4);
  }),
  R(/^Fractions of a number$|^Fractions of a number: word problems$/, (mt, ctx) => () => {
    const d = pick([2, 3, 4, 5, 6, 8, 10]), n = ri(1, d - 1), total = d * ri(2, 9), nm = pick(NAMES), t = thing()[1];
    if (/word/.test(ctx.title)) return num(`${nm} has ${b(total)} ${t}. ${m(stack(n, d))} of them are red. How many ${t} are red?`, (total / d) * n, `${total} ÷ ${d} = ${total / d}, and ${total / d} × ${n} = ${b((total / d) * n)}.`);
    return num(`Find ${m(stack(n, d))} of ${b(total)}.`, (total / d) * n, `${total} ÷ ${d} = ${total / d}, then × ${n} = ${b((total / d) * n)}.`);
  }),
  R(/^Decompose fractions into unit fractions(?: using models)?$/, (mt, ctx) => () => {
    const d = pick([3, 4, 5, 6, 8]), n = ri(2, d - 1), withModel = /models/.test(ctx.title);
    const pic = withModel ? fracBar(n, d, { width: 220 }) : '';
    const unit = fs(1, d), pre = Array(n - 1).fill(unit).join(' + ');
    return mc(`${pic}${m(`${stack(n, d)} = ${Array(n - 1).fill(stack(1, d)).join(' + ')} + ___`)}`, unit, [fs(1, d + 1), fs(2, d), fs(n, d)].filter(x => x !== unit), `${fs(n, d)} is ${n} unit fractions of ${unit}, so the missing part is ${b(unit)}.`, 4);
  }),

  /* ===== number lines ===== */
  R(/^(?:Fractions of number lines|Identify unit fractions on number lines|Identify fractions on number lines|Fractions of number lines: .*)$/, (mt, ctx) => () => {
    const unit = /unit/.test(ctx.title), d = /halves, fourths and eighths/.test(ctx.title) ? pick([2, 4, 8]) : denFor(ctx.grade, ctx.title), hi = unit || ctx.grade <= 4 ? 1 : pick([1, 2]);
    const n = unit ? 1 : ri(1, d * hi - 1), v = n / d;
    const ans = n > d ? mixedText(n, d) : fs(n, d), alts = uniq(fracDistractors(n % d || n, d).concat([fs(n + 1, d), fs(Math.max(1, n - 1), d)])).filter(x => x !== ans);
    return mc(`${fracLineLabeled(d, hi, [{ v, label: '●' }])}What fraction does the point show?`, ans, alts, `The line is split into ${d} equal parts. The point is ${n} part${n > 1 ? 's' : ''} from 0: ${b(ans)}.`.replace('is split into ' + d, 'from 0 to 1 is split into ' + d), 4);
  }),
  R(/^Graph (?:unit |smaller or larger )?fractions on number lines$/, (mt, ctx) => () => {
    const d = pick([5, 6, 8, 10]), letters = ['A', 'B', 'C', 'D'], pts = sample(range(1, d - 1), 4), marks = pts.map((p, i) => ({ v: p / d, label: letters[i], color: C.blue })), line = fracLineLabeled(d, 1, marks);
    if (/unit/.test(ctx.title)) { const ans = letters[pts.indexOf(Math.min(...pts))], pos = pts.indexOf(1); if (pos < 0) return null; return mc(`${line}Which point shows the unit fraction ${m(stack(1, d))}?`, letters[pos], letters.filter(x => x !== letters[pos]), `${fs(1, d)} is one tick from 0: point ${b(letters[pos])}.`, 4); }
    if (/smaller or larger/.test(ctx.title)) {
      const srt = sample(range(1, d - 1), 4).sort((x, y) => x - y), bigger = Math.random() < 0.5, ref = bigger ? srt[2] : srt[1], target = bigger ? srt[3] : srt[0];
      const rest = shuffle(srt.filter(v_ => v_ !== ref)), all = [ref, ...rest], mk = all.map((p_, i) => ({ v: p_ / d, label: letters[i], color: C.blue })), ans = letters[all.indexOf(target)];
      return mc(`${fracLineLabeled(d, 1, mk)}Point A shows ${m(stack(ref, d))}. Which point shows a fraction ${b(bigger ? 'greater' : 'less')} than ${m(stack(ref, d))}?`, ans, letters.slice(1).filter(x => x !== ans), `A point to the ${bigger ? 'right' : 'left'} of A is ${bigger ? 'greater' : 'less'}: point ${b(ans)}.`, 3);
    }
    const k = ri(0, 3), tgt = pts[k];
    return mc(`${line}Which point shows ${m(stack(tgt, d))}?`, letters[k], letters.filter((_, i) => i !== k), `Count ${tgt} tick${tgt > 1 ? 's' : ''} from 0: point ${b(letters[k])}.`, 4);
  }),

  /* ===== equivalent fractions ===== */
  R(/^Find equivalent fractions using area models(?:: (?:two|one) models?)?$/, (mt, ctx) => () => {
    const [n, d] = pick([[1, 2], [1, 3], [2, 3], [3, 4], [1, 4], [2, 5], [3, 5]]), k = ri(2, 4);
    return num(`${fracBar(n, d, { width: 200 })}${fracBar(n * k, d * k, { width: 200 })}The bars show equivalent fractions. ${m(`${stack(n, d)} = ${stack('___', d * k)}`)} What is the missing numerator?`, n * k, `Multiply top and bottom by ${k}: ${n} × ${k} = ${b(n * k)}.`);
  }),
  R(/^Identify equivalent fractions on number lines$|^Find equivalent fractions using number lines$|^Graph equivalent fractions on number lines$/, (mt, ctx) => () => {
    const [n, d] = pick([[1, 2], [1, 3], [2, 3], [3, 4], [1, 4]]), k = ri(2, 3), line = fracLineLabeled(d * k, 1, [{ v: n / d, label: '●' }]);
    return mc(`${line}Which fraction is equal to ${m(stack(n, d))} on this number line?`, fs(n * k, d * k), [fs(n * k + 1, d * k), fs(n * k - 1 || 1, d * k), fs(n, d * k)].filter(x => x !== fs(n * k, d * k)), `${fs(n, d)} = ${b(fs(n * k, d * k))}.`);
  }),
  R(/^(?:Equivalent fractions|Find equivalent fractions|Identify equivalent fractions)$/, (mt, ctx) => () => {
    const [n, d] = pick([[1, 2], [1, 3], [2, 3], [3, 4], [1, 4], [2, 5], [3, 5], [5, 6]]), k = ri(2, 6);
    if (/^Find/.test(ctx.title) || ctx.grade >= 4 && Math.random() < 0.5) return num(`${m(`${stack(n, d)} = ${stack('___', d * k)}`)} Find the missing numerator.`, n * k, `${d} × ${k} = ${d * k}, so multiply the numerator by ${k} too: ${n} × ${k} = ${b(n * k)}.`);
    return mc(`Which fraction is equivalent to ${m(stack(n, d))}?`, fs(n * k, d * k), [fs(n * k + 1, d * k), fs(n + k, d + k), fs(n, d * k)].filter(x => x !== fs(n * k, d * k)), `Multiply both numerator and denominator by ${k}: ${b(fs(n * k, d * k))}.`);
  }),
  R(/^Patterns of equivalent fractions$/, () => () => {
    const [n, d] = pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]), seq = [1, 2, 3].map(k => fs(n * k, d * k)), next = fs(n * 4, d * 4);
    return mc(`What comes next? ${m(seq.join(', ') + ', ___')}`, next, [fs(n * 4 + 1, d * 4), fs(n * 3, d * 4), fs(n * 4, d * 4 + 1)], `Each fraction is ${fs(n, d)} scaled up: the next is ${b(next)}.`);
  }),
  R(/^Fractions with denominators of 10 and 100$/, () => () => {
    const n = ri(1, 9);
    return Math.random() < 0.5 ? num(`${m(`${stack(n, 10)} = ${stack('___', 100)}`)}`, n * 10, `Multiply top and bottom by 10: ${b(n * 10)}.`) : mc(`Which fraction is equal to ${m(stack(n * 10, 100))}?`, fs(n, 10), [fs(n, 100), fs(n * 10, 10), fs(n + 1, 10)], `${n * 10} ÷ 10 = ${n} and 100 ÷ 10 = 10: ${b(fs(n, 10))}.`);
  }),
  R(/^Write fractions in lowest terms$/, () => () => {
    const [n, d] = pick([[1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [5, 6], [3, 8], [7, 10]]), k = ri(2, 5);
    return mc(`Write ${m(stack(n * k, d * k))} in lowest terms.`, fs(n, d), [fs(n * (k - 1) || 1, d * (k - 1) || 2), fs(n + 1, d), fs(d, n)].filter(x => x !== fs(n, d)), `Divide top and bottom by ${k}: ${b(fs(n, d))}.`);
  }),
  R(/^Least common denominator$/, () => () => {
    const d1 = pick([2, 3, 4, 5, 6, 8]), d2 = pick([2, 3, 4, 5, 6, 9]); if (d1 === d2) return null;
    return num(`What is the least common denominator of ${m(stack(1, d1))} and ${m(stack(1, d2))}?`, lcm(d1, d2), `The least common multiple of ${d1} and ${d2} is ${b(lcm(d1, d2))}.`);
  }),
  R(/^Convert between improper fractions and mixed numbers$/, () => () => {
    const d = pick([2, 3, 4, 5, 6, 8]), w = ri(1, 4), n = ri(1, d - 1), imp = w * d + n;
    return Math.random() < 0.5 ? mc(`Write ${m(stack(imp, d))} as a mixed number.`, mixedStr(w, n, d), [mixedStr(w + 1, n, d), mixedStr(w, d - n || 1, d), mixedStr(w - 1 || 2, n, d)].filter(x => x !== mixedStr(w, n, d)), `${imp} ÷ ${d} = ${w} remainder ${n}: ${b(mixedStr(w, n, d))}.`) : mc(`Write ${m(mixedStack(w, n, d))} as an improper fraction.`, fs(imp, d), [fs(imp + 1, d), fs(w * n + d, d), fs(imp, d + 1)].filter(x => x !== fs(imp, d)), `${w} × ${d} + ${n} = ${imp}: ${b(fs(imp, d))}.`);
  }),
  R(/^Mixed numbers$|^Round mixed numbers$/, (mt, ctx) => () => {
    const d = pick([2, 3, 4, 5, 6, 8, 10]), w = ri(1, 6), n = ri(1, d - 1);
    if (/Round/.test(ctx.title)) { const r = n * 2 >= d ? w + 1 : w; return num(`Round ${m(mixedStack(w, n, d))} to the nearest whole number.`, r, `${fs(n, d)} is ${n * 2 >= d ? 'at least' : 'less than'} one half, so round ${n * 2 >= d ? 'up' : 'down'} to ${b(r)}.`); }
    const imp = w * d + n, pic = fracBar(Math.min(d, d), d, { width: 120 });
    return mc(`A picture has ${b(w)} whole bar${w > 1 ? 's' : ''} and ${b(n)} of ${b(d)} parts of another bar shaded. Which mixed number does it show?`, mixedStr(w, n, d), [mixedStr(w, d - n || 1, d), mixedStr(w + 1, n, d), mixedStr(n, w, d > w ? d : d + 1)].filter(x => x !== mixedStr(w, n, d)), `${w} wholes and ${fs(n, d)}: ${b(mixedStr(w, n, d))}.`);
  }),

  /* ===== comparing & ordering ===== */
  R(/^Compare fractions using models$|^Compare fractions with like numerators or denominators using models$|^Compare fractions with like denominators using models$/, (mt, ctx) => () => {
    const d = pick([4, 6, 8]), a = ri(1, d - 1), c = ri(1, d - 1); if (a === c) return null;
    return mc(`${fracBar(a, d, { width: 200 })}${fracBar(c, d, { width: 200 })}Compare the shaded parts. ${m(`${stack(a, d)} ___ ${stack(c, d)}`)}`, cmpSym(a, c), ['<', '>', '='].filter(x => x !== cmpSym(a, c)), `${a} parts vs ${c} parts of the same size: ${a} ${cmpSym(a, c)} ${c}.`, 3);
  }),
  R(/^Compare fractions using number lines$|^Graph and compare fractions .*$/, (mt, ctx) => () => {
    const d = pick([4, 6, 8]), a = ri(1, d - 1), c = ri(1, d - 1); if (a === c) return null;
    return mc(`${fracLineLabeled(d, 1, [{ v: a / d, label: 'A', color: C.red }, { v: c / d, label: 'B', color: C.blue }])}Point A is ${m(stack(a, d))} and point B is ${m(stack(c, d))}. Which is true?`, `A ${cmpSym(a, c)} B`, ['A > B', 'A < B', 'A = B'].filter(x => x !== `A ${cmpSym(a, c)} B`), `Numbers farther right are greater.`, 3);
  }),
  R(/^Compare fractions with like denominators$|^Compare fractions with like denominators in recipes$|^Compare fractions with like numerators or denominators$/, (mt, ctx) => () => {
    const like = /numerators or denominators/.test(ctx.title) ? pick(['d', 'n']) : 'd';
    let a, c, A, Bb;
    if (like === 'd') { const d = pick([5, 6, 8, 10, 12]); [a, c] = sample(range(1, d - 1), 2); A = [a, d]; Bb = [c, d]; }
    else { const n = ri(1, 4); [a, c] = sample(range(n + 1, n + 8), 2); A = [n, a]; Bb = [n, c]; }
    if (/recipes/.test(ctx.title)) { const [x, y] = sample(['flour', 'sugar', 'milk', 'butter'], 2); return mc(`A recipe uses ${b(fs(...A))} cup of ${x} and ${b(fs(...Bb))} cup of ${y}. Which ingredient uses more?`, A[0] / A[1] > Bb[0] / Bb[1] ? x : y, [A[0] / A[1] > Bb[0] / Bb[1] ? y : x], `${fs(...A)} ${cmpSym(A[0] / A[1], Bb[0] / Bb[1])} ${fs(...Bb)}.`, 2); }
    const s = cmpSym(A[0] / A[1], Bb[0] / Bb[1]);
    return mc(`Compare. ${m(`${stack(...A)} ___ ${stack(...Bb)}`)}`, s, ['<', '>', '='].filter(x => x !== s), like === 'd' ? `Same denominator: compare numerators.` : `Same numerator: the smaller denominator is the bigger fraction.`, 3);
  }),
  R(/^Compare fractions using ½ as a benchmark$|^Compare fractions using ½ as a benchmark: find the missing numerator$/, (mt, ctx) => () => {
    const d = pick([6, 8, 10, 12]), a = ri(1, d - 1); if (a * 2 === d) return null;
    if (/missing/.test(ctx.title)) { const target = pick(['greater', 'less']); const ans = target === 'greater' ? d / 2 + 1 : d / 2 - 1; return num(`Write the smallest whole number that makes ${m(`${stack('___', d)}`)} ${b(target === 'greater' ? 'greater than' : 'less than')} ½ ${target === 'greater' ? '(smallest)' : '(largest)'}.`.replace('smallest whole number', target === 'greater' ? 'smallest whole number' : 'largest whole number'), ans, `Half of ${d} is ${d / 2}, so the numerator must be ${target === 'greater' ? 'more' : 'less'} than ${d / 2}: ${b(ans)}.`); }
    return mc(`Is ${m(stack(a, d))} greater than or less than ${m(stack(1, 2))}?`, a * 2 > d ? 'Greater than ½' : 'Less than ½', [a * 2 > d ? 'Less than ½' : 'Greater than ½'], `Half of ${d} is ${d / 2}, and ${a} is ${a * 2 > d ? 'more' : 'less'}.`, 2);
  }),
  R(/^Benchmark fractions$|^Compare fractions using benchmarks$/, (mt, ctx) => () => {
    const d = pick([8, 10, 12]), n = ri(1, d - 1), x = n / d, near_ = x < 0.25 ? '0' : x <= 0.75 ? '½' : '1'; if (Math.abs(x - 0.25) < 0.01 || Math.abs(x - 0.75) < 0.01) return null;
    return mc(`Which benchmark is ${m(stack(n, d))} closest to?`, near_, ['0', '½', '1'].filter(q => q !== near_), `${fs(n, d)} ≈ ${fix(x, 2)}, closest to ${b(near_)}.`, 3);
  }),
  R(/^Compare fractions(?: and mixed numbers)?$/, (mt, ctx) => () => {
    const mixed = /mixed/.test(ctx.title), dens = [2, 3, 4, 5, 6, 8, 10, 12], d1 = pick(dens), d2 = pick(dens);
    let A, Bb, va, vb;
    if (mixed) { const w1 = ri(1, 3), w2 = ri(1, 3); A = [w1, ri(1, d1 - 1), d1]; Bb = [w2, ri(1, d2 - 1), d2]; va = w1 + A[1] / d1; vb = w2 + Bb[1] / d2; }
    else { A = [ri(1, d1 - 1), d1]; Bb = [ri(1, d2 - 1), d2]; va = A[0] / A[1]; vb = Bb[0] / Bb[1]; }
    if (Math.abs(va - vb) < 1e-9 && Math.random() < 0.7) return null;
    const s = cmpSym(fix(va, 9), fix(vb, 9)), show = x => (mixed ? mixedStack(...x) : stack(...x));
    return mc(`Compare. ${m(`${show(A)} ___ ${show(Bb)}`)}`, s, ['<', '>', '='].filter(x => x !== s), `${mixed ? '' : `${fs(...A)} ≈ ${fix(va, 3)} and ${fs(...Bb)} ≈ ${fix(vb, 3)}. `}${s === '=' ? 'They are equal' : s === '>' ? 'The first is greater' : 'The first is less'}.`, 3);
  }),
  R(/^Find smaller or larger fractions$/, () => () => {
    const d = pick([8, 10, 12]), n = ri(2, d - 2), larger = Math.random() < 0.5, ans = larger ? fs(n + ri(1, d - n - 1 || 1), d) : fs(ri(1, n - 1 || 1), d);
    const v = x => +x.split('/')[0] / +x.split('/')[1]; if (larger ? v(ans) <= n / d : v(ans) >= n / d) return null;
    const wrong = larger ? [fs(n - 1 || 1, d), fs(Math.max(1, n - 2), d)] : [fs(n + 1, d), fs(Math.min(d - 1, n + 2), d)];
    return mc(`Which fraction is ${b(larger ? 'greater' : 'less')} than ${m(stack(n, d))}?`, ans, wrong.filter(x => x !== ans), `${ans} ${larger ? '>' : '<'} ${fs(n, d)}.`, 3);
  }),
  R(/^Order fractions(?: with like denominators| with like numerators| with like numerators or denominators| with unlike denominators)?$|^Order fractions review$/, (mt, ctx) => orderQ(ctx.title, ctx.grade)),
];
export { drawModel, labelled, pictureQ, fracLine, fracLineLabeled, mixedText, fsimp, nameOf, orderQ, cmpSym };
