/* Fraction operations (Grade 5): add/subtract (like & unlike denominators, mixed numbers), multiply by whole numbers, divide by unit fractions. */
import { ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, num, mc, yesNo, NAMES, thing, gcd, lcm, C, fracBar, big } from '../h.js';
import { R } from '../engine.js';
import { stack, fs, simp, mixedStr, mixedStack, cmpSym, drawModel, labelled, fracLineLabeled } from './fractions.js';

const val = (n, d) => n / d;
/** "n/d" simplified; improper results become mixed numbers when asked */
const ansStr = (n, d, mixed = true) => {
  const [a, c] = simp(n, d);
  if (c === 1) return String(a);
  return mixed && a > c ? mixedStr(Math.floor(a / c), a % c, c) || fs(a, c) : fs(a, c);
};
const mixedFull = (w, n, d) => { const t = w * d + n; return [t, d]; };
/** distractors that differ in value from the real answer */
const wrongs = (n, d, tries = []) => {
  const true_ = n / d, out = [];
  for (const [a, c] of [[n + 1, d], [Math.max(1, n - 1), d], [n, d + 1], [n + d, d * 2], [n, d * 2], ...tries]) if (c > 0 && a > 0 && Math.abs(a / c - true_) > 1e-9) out.push(ansStr(a, c));
  return uniq(out).filter(x => x !== ansStr(n, d));
};
const comm = (...ds) => ds.reduce(lcm);
const denLike = () => pick([5, 6, 7, 8, 9, 10, 12]);
const denPair = () => { const d1 = pick([2, 3, 4, 5, 6, 8, 10]), d2 = pick([2, 3, 4, 5, 6, 8, 10]); return d1 === d2 ? null : [d1, d2]; };
const NOUN = ['pizza', 'pie', 'ribbon', 'rope', 'juice'];

function pair(title, grade) {            // fractions for add/sub; returns {a:[n,d], c:[n,d], op}
  const like = /like denominators/.test(title), tens = /10 and 100/.test(title), sub = /^Subtract|subtract/.test(title) && !/Add and subtract/.test(title) ? true : /Add and subtract/.test(title) ? Math.random() < 0.5 : false;
  let a, c;
  if (tens) { a = [ri(1, 9), 10]; c = [ri(1, 99), 100]; if (sub && val(...a) < val(...c)) [a, c] = [c, a]; }
  else if (like) { const d = denLike(); a = [ri(1, d - 1), d]; c = [ri(1, d - 1), d]; if (sub && a[0] < c[0]) [a, c] = [c, a]; if (sub && a[0] === c[0]) return null; }
  else { const dp = denPair(); if (!dp) return null; a = [ri(1, dp[0] - 1), dp[0]]; c = [ri(1, dp[1] - 1), dp[1]]; if (sub && val(...a) <= val(...c)) [a, c] = [c, a]; if (sub && val(...a) === val(...c)) return null; }
  return { a, c, sub };
}
const calc = (a, c, sub) => { const D = comm(a[1], c[1]), n = a[0] * (D / a[1]) + (sub ? -1 : 1) * c[0] * (D / c[1]); return [n, D]; };

const mixedOf = (d, wMax = 5) => ({ w: ri(1, wMax), n: ri(1, d - 1), d });
const mixedVal = x => x.w + x.n / x.d;

export { ansStr, wrongs, comm, mixedOf, mixedVal, mixedFull };
export const FRACOPS_RULES = [
  R(/^Decompose fractions multiple ways$/, () => () => {
    const d = pick([4, 5, 6, 8, 10]), n = ri(3, d - 1), a = ri(1, n - 1);
    return mc(`${m(`${stack(n, d)} = ${stack(a, d)} + ___`)}`, fs(n - a, d), [fs(n + a, d), fs(a, d), fs(n - a + 1, d)].filter(x => x !== fs(n - a, d)), `${n} − ${a} = ${n - a}, so the missing fraction is ${b(fs(n - a, d))}.`, 4);
  }),
  R(/^Relate division and fractions$/, () => () => {
    const a = ri(1, 9), c = ri(a + 1, 12);
    return mc(`${m(`${a} ÷ ${c}`)} is the same as which fraction?`, fs(a, c), [fs(c, a), fs(a, c + 1), fs(a + 1, c)], `Dividing ${a} by ${c} gives the fraction ${b(fs(a, c))}.`, 4);
  }),

  /* ----- add & subtract with models ----- */
  R(/^(?:Add|Subtract|Add and subtract) fractions with like denominators using (?:area models|strip models|number lines)$/, (mt, ctx) => () => {
    const t = ctx.title, d = pick([5, 6, 8, 10]), sub = /^Subtract/.test(t) || (/and subtract/.test(t) && Math.random() < 0.5);
    let a = ri(1, d - 2), c = ri(1, d - 1 - (sub ? 0 : a)); if (!sub && a + c >= d) c = d - a - 1 || 1; if (sub) { a = ri(2, d - 1); c = ri(1, a - 1); }
    const r = sub ? a - c : a + c; if (r <= 0 || r >= d + 1) return null;
    const pic = /number lines/.test(t) ? fracLineLabeled(d, 1, [{ v: a / d, label: 'start', color: C.blue }, { v: r / d, label: 'end', color: C.red }]) : labelled([fracBar(a, d, { width: 180 }), fracBar(c, d, { width: 180 })], ['', '']);
    const text = /number lines/.test(t) ? `Start at ${m(stack(a, d))} and ${sub ? 'move back' : 'move forward'} ${m(stack(c, d))}. Where do you land?` : `${m(`${stack(a, d)} ${sub ? '−' : '+'} ${stack(c, d)}`)} = ?`;
    return mc(`${pic}${text}`, ansStr(r, d), wrongs(r, d), `${a}/${d} ${sub ? '−' : '+'} ${c}/${d} = ${b(ansStr(r, d))}.`, 4);
  }),
  R(/^(?:Add|Subtract) fractions with unlike denominators using models$/, (mt, ctx) => () => {
    const p = pair(ctx.title, 5); if (!p) return null; const [n, D] = calc(p.a, p.c, p.sub); if (n <= 0) return null;
    const pics = labelled([fracBar(p.a[0], p.a[1], { width: 180 }), fracBar(p.c[0], p.c[1], { width: 180 })], ['', '']);
    return mc(`${pics}${m(`${stack(...p.a)} ${p.sub ? '−' : '+'} ${stack(...p.c)}`)} = ?`, ansStr(n, D), wrongs(n, D, [[p.a[0] + p.c[0], p.a[1] + p.c[1]]]), `Rename with denominator ${D}: ${p.a[0] * (D / p.a[1])}/${D} ${p.sub ? '−' : '+'} ${p.c[0] * (D / p.c[1])}/${D} = ${b(ansStr(n, D))}.`, 4);
  }),

  /* ----- plain computation ----- */
  R(/^(?:Add|Subtract|Add and subtract) fractions(?: with (?:like|unlike) denominators|: denominators of 10 and 100)$/, (mt, ctx) => () => {
    const p = pair(ctx.title, 5); if (!p) return null; const [n, D] = calc(p.a, p.c, p.sub); if (n <= 0) return null;
    const tens = /10 and 100/.test(ctx.title), res = tens ? fs(n, D) : ansStr(n, D);
    const bad = tens ? [fs(n + 10, D), fs(n - 1, D), fs(p.a[0] + p.c[0], p.a[1] + p.c[1])] : wrongs(n, D, [[p.a[0] + p.c[0], p.a[1] + p.c[1]]]);
    return mc(`${m(`${stack(...p.a)} ${p.sub ? '−' : '+'} ${stack(...p.c)}`)} = ?`, res, bad.filter(x => x !== res), `${p.a[1] === p.c[1] ? '' : `Use a common denominator of ${D}. `}${p.a[0] * (D / p.a[1])}/${D} ${p.sub ? '−' : '+'} ${p.c[0] * (D / p.c[1])}/${D} = ${b(res)}.`, 4);
  }),
  R(/^Add (?:three or more|up to four) fractions with (?:like|unlike) denominators$|^Add up to four fractions with denominators of 10 and 100$/, (mt, ctx) => () => {
    const like = /like/.test(ctx.title) && !/unlike/.test(ctx.title), tens = /10 and 100/.test(ctx.title), k = /four/.test(ctx.title) ? ri(3, 4) : ri(3, 4);
    let fr; if (tens) fr = Array.from({ length: k }, () => (Math.random() < 0.5 ? [ri(1, 9), 10] : [ri(1, 30), 100])); else if (like) { const d = denLike(); fr = Array.from({ length: k }, () => [ri(1, 3), d]); } else { const ds = pick([[2, 4, 8], [3, 6, 12], [2, 3, 6], [5, 10, 2]]); fr = Array.from({ length: k }, (_, i) => [ri(1, ds[i % 3] - 1), ds[i % 3]]); }
    const D = comm(...fr.map(f => f[1])), n = sum(fr.map(f => f[0] * (D / f[1]))), res = tens ? fs(n, D) : ansStr(n, D);
    return mc(`${m(fr.map(f => stack(...f)).join(' + '))} = ?`, res, (tens ? [fs(n + 1, D), fs(n - 1, D), fs(n, D * 10)] : wrongs(n, D)).filter(x => x !== res), `Use ${D} as the common denominator: ${b(res)}.`, 4);
  }),
  R(/^Add three or more fractions with (?:like|unlike) denominators: word problems$|^Add and subtract fractions with (?:like|unlike) denominators: word problems$/, (mt, ctx) => () => {
    const like = /like/.test(ctx.title) && !/unlike/.test(ctx.title), nm = pick(NAMES), noun = pick(NOUN), three = /three/.test(ctx.title);
    let a, c, e; if (like) { const d = denLike(); a = [ri(1, 3), d]; c = [ri(1, 3), d]; e = [ri(1, 3), d]; } else { const dp = denPair(); if (!dp) return null; a = [1, dp[0]]; c = [1, dp[1]]; e = [1, pick([4, 8, 12].filter(x => x % dp[0] === 0 && x % dp[1] === 0).concat([comm(...dp)]))]; }
    if (three) { const D = comm(a[1], c[1], e[1]), n = a[0] * (D / a[1]) + c[0] * (D / c[1]) + e[0] * (D / e[1]); return mc(`${nm} uses ${fs(...a)} of a ${noun} on Monday, ${fs(...c)} on Tuesday and ${fs(...e)} on Wednesday. What fraction did ${nm} use in all?`, ansStr(n, D), wrongs(n, D), `Add: ${b(ansStr(n, D))}.`, 4); }
    const sub = Math.random() < 0.5; if (sub && val(...a) <= val(...c)) return null; const [n, D] = calc(a, c, sub); if (n <= 0) return null;
    return mc(sub ? `${nm} has ${fs(...a)} of a ${noun}. ${nm} uses ${fs(...c)} of the whole ${noun}. How much is left?` : `${nm} eats ${fs(...a)} of a ${noun} and then ${fs(...c)} of the same ${noun}. How much is eaten in all?`, ansStr(n, D), wrongs(n, D), `${fs(...a)} ${sub ? '−' : '+'} ${fs(...c)} = ${b(ansStr(n, D))}.`, 4);
  }),
  R(/^Complete addition and subtraction sentences with fractions with (like|unlike) denominators$/, mt => () => {
    const like = mt[1] === 'like', sub = Math.random() < 0.5;
    if (like) { const d = denLike(), a = ri(2, d - 1), c = ri(1, a - 1); return sub ? num(`${m(`${stack(a, d)} − ${stack('___', d)} = ${stack(a - c, d)}`)}`, c, `${a} − ${a - c} = ${b(c)}.`) : num(`${m(`${stack(a - c, d)} + ${stack('___', d)} = ${stack(a, d)}`)}`, c, `${a} − ${a - c} = ${b(c)}.`); }
    const dp = pick([[2, 4], [3, 6], [4, 8], [5, 10], [2, 6]]), d1 = dp[0], d2 = dp[1], a = [1, d1], c = ri(1, d2 - 1), r = a[0] * (d2 / d1) + c;
    if (r >= d2) return null;
    return num(`${m(`${stack(1, d1)} + ${stack('___', d2)} = ${stack(r, d2)}`)}`, c, `${stack(1, d1)} = ${a[0] * (d2 / d1)}/${d2}, so ${r} − ${a[0] * (d2 / d1)} = ${b(c)}.`);
  }),
  R(/^Inequalities with addition and subtraction of fractions with (like|unlike) denominators$/, mt => () => {
    const p = pair(mt[1] === 'like' ? 'like denominators' : 'unlike denominators', 5); if (!p) return null; const [n, D] = calc(p.a, p.c, false), t = ri(1, 3) * 0 + pick([[1, 2], [3, 4], [1, 1]]), s = cmpSym(fix(n / D, 9), fix(t[0] / t[1], 9));
    return mc(`Choose the symbol. ${m(`${stack(...p.a)} + ${stack(...p.c)} ___ ${t[1] === 1 ? 1 : stack(...t)}`)}`, s, ['<', '>', '='].filter(x => x !== s), `${fs(...p.a)} + ${fs(...p.c)} = ${ansStr(n, D)} ${s} ${t[1] === 1 ? 1 : fs(...t)}.`, 3);
  }),

  /* ----- mixed numbers ----- */
  R(/^Estimate sums and differences of mixed numbers with like denominators$/, () => () => {
    const d = pick([4, 5, 8, 10]), x = mixedOf(d), y = mixedOf(d), sub = Math.random() < 0.5; if (sub && mixedVal(x) < mixedVal(y)) return null;
    const rd = z => (z.n * 2 >= z.d ? z.w + 1 : z.w), A = rd(x), B = rd(y);
    return num(`Estimate ${m(`${mixedStack(x.w, x.n, d)} ${sub ? '−' : '+'} ${mixedStack(y.w, y.n, d)}`)} by rounding each mixed number to the nearest whole number.`, sub ? A - B : A + B, `${A} ${sub ? '−' : '+'} ${B} = ${b(sub ? A - B : A + B)}.`);
  }),
  R(/^Add and subtract mixed numbers with (?:like|unlike) denominators(?:: word problems)?$/, (mt, ctx) => () => {
    const like = !/unlike/.test(ctx.title); let d1, d2; if (like) { d1 = d2 = pick([4, 5, 6, 8, 10]); } else { const dp = pick([[2, 4], [3, 6], [4, 8], [2, 6], [5, 10], [3, 4]]); d1 = dp[0]; d2 = dp[1]; }
    const x = mixedOf(d1, 5), y = mixedOf(d2, 3), sub = Math.random() < 0.5; if (sub && mixedVal(x) <= mixedVal(y)) return null;
    const [xn, xd] = mixedFull(x.w, x.n, x.d), [yn, yd] = mixedFull(y.w, y.n, y.d), D = comm(xd, yd), n = xn * (D / xd) + (sub ? -1 : 1) * yn * (D / yd); if (n <= 0) return null;
    const res = ansStr(n, D), nm = pick(NAMES);
    const prompt = /word/.test(ctx.title) ? (sub ? `${nm} has a board that is ${mixedStr(x.w, x.n, x.d)} m long and cuts off ${mixedStr(y.w, y.n, y.d)} m. How long is the board now? (m)` : `${nm} ran ${mixedStr(x.w, x.n, x.d)} km and then walked ${mixedStr(y.w, y.n, y.d)} km. How far did ${nm} go in all? (km)`) : m(`${mixedStack(x.w, x.n, x.d)} ${sub ? '−' : '+'} ${mixedStack(y.w, y.n, y.d)}`) + ' = ?';
    const bad = uniq([ansStr(n + 1, D), ansStr(Math.max(1, n - 1), D), ansStr(n + D, D), ansStr(n, D * 2)]).filter(v => v !== res);
    return mc(prompt, res, bad, `Write as improper fractions with denominator ${D}, ${sub ? 'subtract' : 'add'}: ${b(res)}.`, 4);
  }),

  /* ----- multiply by whole numbers ----- */
  R(/^Multiply unit fractions by whole numbers using number lines$|^Multiply fractions by whole numbers using number lines$/, (mt, ctx) => () => {
    const unit = /unit/.test(ctx.title), d = pick([3, 4, 5, 6, 8]), n = unit ? 1 : ri(2, d - 1), k = ri(2, 5), r = n * k;
    const marks = range(1, k).map(i => ({ v: (i * n) / d, label: '', color: C.blue })).filter(mk => mk.v <= 3);
    const hi = Math.max(1, Math.ceil(r / d)); if (r / d > 3) return null;
    return mc(`${fracLineLabeled(d, hi, [{ v: r / d, label: '●' }])}The point shows ${b(k)} jumps of ${m(stack(n, d))}. What is ${m(`${k} × ${stack(n, d)}`)}?`, ansStr(r, d), wrongs(r, d), `${k} × ${n}/${d} = ${b(ansStr(r, d))}.`, 4);
  }),
  R(/^Multiply (?:unit )?fractions by whole numbers: choose the model$|^Multiply fractions by whole numbers using models: complete the equation$|^Multiply fractions by whole numbers using arrays$/, (mt, ctx) => () => {
    const unit = /unit/.test(ctx.title), d = pick([3, 4, 5, 6, 8]), n = unit ? 1 : ri(2, d - 1), k = ri(2, 5), r = n * k;
    const bars = Array.from({ length: k }, () => fracBar(n, d, { width: 120 })).join('');
    if (/complete the equation/.test(ctx.title) || /arrays/.test(ctx.title)) return num(`<div style="display:flex;gap:6px;flex-wrap:wrap">${bars}</div>${m(`${k} × ${stack(n, d)} = ${stack('___', d)}`)}`, r, `${k} groups of ${n}/${d} make ${r}/${d}.`);
    return mc(`Which expression matches the picture?<div style="display:flex;gap:6px;flex-wrap:wrap">${bars}</div>`, `${k} × ${n}/${d}`, [`${n} × ${k}/${d}`, `${k} + ${n}/${d}`, `${k} × ${n}/${d + 1}`].filter(x => x !== `${k} × ${n}/${d}`), `There are ${k} bars, each showing ${n}/${d}: ${b(`${k} × ${n}/${d}`)}.`, 4);
  }),
  R(/^Multiples of (?:unit )?fractions: find the missing numbers$/, (mt, ctx) => () => {
    const unit = /unit/.test(ctx.title), d = pick([3, 4, 5, 6, 8, 10]), s = unit ? 1 : ri(2, 4), seq = range(1, 4).map(i => i * s), hole = ri(1, 3);
    return num(`${m(seq.map((v, i) => (i === hole ? `${stack('___', d)}` : stack(v, d))).join(' , '))}<br>These are multiples of ${m(stack(s, d))}. What numerator is missing?`, seq[hole], `Each fraction adds ${s}/${d}: the numerator is ${b(seq[hole])}.`);
  }),
  R(/^Multiply (?:unit )?fractions(?: and whole numbers)?(?: by whole numbers)?: sorting$|^Multiply fractions and whole numbers: sorting$/, (mt, ctx) => () => {
    const unit = /unit/.test(ctx.title), d = pick([3, 4, 5, 6, 8]), n = unit ? 1 : ri(1, d - 1), k = ri(2, 9), v = (n * k) / d, cat = v < 1 ? 'Less than 1' : v === 1 ? 'Equal to 1' : 'Greater than 1';
    return mc(`Sort. ${m(`${k} × ${stack(n, d)}`)} is…`, cat, ['Less than 1', 'Equal to 1', 'Greater than 1'].filter(x => x !== cat), `${k} × ${n}/${d} = ${n * k}/${d}, which is ${cat.toLowerCase()}.`, 3);
  }),
  R(/^Multiply (?:unit )?fractions by whole numbers$|^Multiply fractions by whole numbers$/, (mt, ctx) => () => {
    const unit = /unit/.test(ctx.title), d = pick([2, 3, 4, 5, 6, 8, 10]), n = unit ? 1 : ri(2, d - 1), k = ri(2, 9), r = n * k;
    return mc(`${m(`${k} × ${stack(n, d)}`)} = ?`, ansStr(r, d), wrongs(r, d, [[n, d * k]]), `${k} × ${n}/${d} = ${r}/${d} = ${b(ansStr(r, d))}.`, 4);
  }),
  R(/^Multiply (?:unit )?fractions by whole numbers: word problems$/, (mt, ctx) => () => {
    const unit = /unit/.test(ctx.title), d = pick([2, 3, 4, 5, 6, 8]), n = unit ? 1 : ri(2, d - 1), k = ri(2, 8), nm = pick(NAMES), r = n * k;
    return mc(`${nm} drinks ${fs(n, d)} L of water each day for ${k} days. How much water does ${nm} drink in all? (L)`, ansStr(r, d), wrongs(r, d), `${k} × ${n}/${d} = ${b(ansStr(r, d))}.`, 4);
  }),
  R(/^Multiply fractions by whole numbers: input\/output tables$/, () => () => {
    const d = pick([3, 4, 5, 6]), n = ri(1, d - 1), xs = sample(range(2, 9), 3), last = xs[2];
    return mc(`Rule: ${b(`multiply by ${fs(n, d)}`)}<br>Inputs: ${xs.map((x, i) => (i < 2 ? x : last)).join(', ')}. What is the output for input ${b(last)}?`, ansStr(last * n, d), wrongs(last * n, d), `${last} × ${n}/${d} = ${b(ansStr(last * n, d))}.`, 4);
  }),
  R(/^Scaling whole numbers by fractions$/, () => () => {
    const w = ri(3, 12), t = pick([[2, 3], [3, 4], [1, 2], [5, 4], [3, 2], [7, 6]]), s = t[0] / t[1] < 1 ? 'less than' : t[0] / t[1] === 1 ? 'equal to' : 'greater than';
    return mc(`Without calculating, is ${m(`${w} × ${stack(...t)}`)} greater than, less than, or equal to ${b(w)}?`, s, ['less than', 'greater than', 'equal to'].filter(x => x !== s), `Multiplying by a fraction ${t[0] < t[1] ? 'less than' : 'greater than'} 1 makes the result ${s} ${w}.`, 3);
  }),

  /* ----- divide ----- */
  R(/^Divide whole numbers by unit fractions(?: using (?:area )?models)?$/, (mt, ctx) => () => {
    const w = ri(2, 6), d = pick([2, 3, 4, 5, 6]), withModel = /models/.test(ctx.title), bars = withModel ? Array.from({ length: Math.min(w, 4) }, () => fracBar(0, d, { width: 130 })).join('') : '';
    return num(`${withModel ? `<div style="display:flex;gap:6px;flex-wrap:wrap">${bars}</div>Each bar is 1 whole divided into ${d} equal parts. ` : ''}${m(`${w} ÷ ${stack(1, d)} = ?`)}`, w * d, `Each whole has ${d} parts of size 1/${d}: ${w} × ${d} = ${b(w * d)}.`);
  }),

  /* ----- mixed operations ----- */
  R(/^Add, subtract, multiply and divide fractions(?:: word problems)?$/, (mt, ctx) => () => {
    const op = pick(['+', '−', '×', '÷']), a = [ri(1, 3), pick([4, 5, 6, 8])], c = [ri(1, 3), pick([4, 5, 6, 8])]; if (a[0] >= a[1] || c[0] >= c[1]) return null;
    let n, D; if (op === '+' || op === '−') { [n, D] = calc(a, c, op === '−'); if (n <= 0) return null; } else if (op === '×') { n = a[0] * c[0]; D = a[1] * c[1]; } else { n = a[0] * c[1]; D = a[1] * c[0]; }
    const res = ansStr(n, D);
    if (/word/.test(ctx.title)) { const nm = pick(NAMES); const text = op === '+' ? `${nm} has ${fs(...a)} L of paint and buys ${fs(...c)} L more. How much paint now?` : op === '−' ? `${nm} has ${fs(...a)} kg of flour and uses ${fs(...c)} kg. How much is left?` : op === '×' ? `${nm} has ${fs(...a)} of a pizza and eats ${fs(...c)} of that part. What fraction of the whole pizza is eaten?` : `${nm} shares ${fs(...a)} of a cake equally into portions of ${fs(...c)} of a cake. How many portions?`; if (op === '−' && val(...a) <= val(...c)) return null; return mc(text, res, wrongs(n, D), `The operation is ${op}: ${b(res)}.`, 4); }
    if (op === '−' && val(...a) <= val(...c)) return null;
    return mc(`${m(`${stack(...a)} ${op} ${stack(...c)}`)} = ?`, res, wrongs(n, D), `${fs(...a)} ${op} ${fs(...c)} = ${b(res)}.`, 4);
  })
];
