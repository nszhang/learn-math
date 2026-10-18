/* Fraction, mixed-number and decimal operations for Grades 6–12 (add, subtract, multiply, divide, compare, estimate). */
import { ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, dec, num, mc, yesNo, near, NAMES, gcd, lcm, thing, MINUS, fracBar } from '../h.js';
import { R } from '../engine.js';
import { stack, fs, simp, mixedStr, mixedStack, cmpSym, fracLineLabeled } from './fractions.js';
import { ansStr, wrongs, comm, mixedOf, mixedVal, mixedFull } from './fracops.js';
import { decPlaces } from './decimals.js';

const val = (n, d) => n / d;
const mixedText = (n, d) => ansStr(n, d, true);
const showMixed = x => mixedStack(x.w, x.n, x.d);
const impr = x => mixedFull(x.w, x.n, x.d);                  // [n, d]
const dens = [2, 3, 4, 5, 6, 8, 10, 12];
const frac = (maxD = 12) => { const d = pick(dens.filter(x => x <= maxD)), n = ri(1, d - 1); return [n, d]; };
const sumFr = (a, c, sub) => { const D = lcm(a[1], c[1]); return [a[0] * (D / a[1]) + (sub ? -1 : 1) * c[0] * (D / c[1]), D]; };
const goodSub = (a, c) => val(...a) > val(...c);
const decN = (p, hi = 20) => fix(ri(10 ** (p - 1) + 1, hi * 10 ** p) / 10 ** p, p);
const dstr = x => dec(x, Math.max(1, decPlaces(x)));
const choicesFor = (n, d) => wrongs(n, d);
const mkWord = (a, c, sub, nm) => (sub ? `${nm} has ${fs(...a)} of a tank of fuel and uses ${fs(...c)} of a tank. How much is left?` : `${nm} walks ${fs(...a)} km in the morning and ${fs(...c)} km in the afternoon. How far does ${nm} walk in all? (km)`);

export const FRACDEC6_RULES = [
  /* ===== add & subtract fractions / mixed numbers (grade 6+) ===== */
  R(/^(?:Add|Subtract|Add and subtract) fractions with unlike denominators(?: I| II)?(?:: word problems(?: I| II)?)?$/, (mt, ctx) => () => {
    const t = ctx.title, sub = /^Subtract/.test(t) || (/and subtract/.test(t) && Math.random() < 0.5), easy = / I(?::|$)| I$/.test(t) && !/ II/.test(t);
    let a = frac(), c = easy ? [ri(1, 3), pick([2, 4, 8].filter(x => x % a[1] === 0 || a[1] % x === 0))] : frac(); if (!c || !c[1]) c = frac();
    if (c[0] >= c[1]) c = [1, c[1]];
    if (a[1] === c[1]) return null; if (sub && !goodSub(a, c)) [a, c] = [c, a]; if (sub && val(...a) === val(...c)) return null;
    const [n, D] = sumFr(a, c, sub), nm = pick(NAMES);
    if (/word/.test(t)) return mc(mkWord(a, c, sub, nm), mixedText(n, D), choicesFor(n, D), `${fs(...a)} ${sub ? '−' : '+'} ${fs(...c)} = ${b(mixedText(n, D))}.`, 4);
    return mc(`${m(`${stack(...a)} ${sub ? '−' : '+'} ${stack(...c)}`)} = ?`, mixedText(n, D), choicesFor(n, D), `Common denominator ${D}: ${b(mixedText(n, D))}.`, 4);
  }),
  R(/^Inequalities with addition and subtraction of (?:like )?fractions(?: and mixed numbers)?$/, () => () => {
    const d = pick([5, 6, 8, 10]), a = [ri(1, d - 1), d], c = [ri(1, d - 1), d], t = pick([[1, 1], [3, 2], [1, 2]]), [n, D] = sumFr(a, c, false), s = cmpSym(val(n, D), val(...t));
    return mc(`Choose the symbol. ${m(`${stack(...a)} + ${stack(...c)} ___ ${t[1] === 1 ? 1 : stack(...t)}`)}`, s, ['<', '>', '='].filter(x => x !== s), `${fs(...a)} + ${fs(...c)} = ${mixedText(n, D)}.`, 3);
  }),
  R(/^Add and subtract mixed numbers(?:: word problems)?$/, (mt, ctx) => () => {
    const d1 = pick([2, 3, 4, 5, 6, 8]), d2 = pick([d1, d1, 2 * d1, d1 * 2].filter(x => x <= 12)), x = mixedOf(d1, 6), y = mixedOf(d2, 4), sub = Math.random() < 0.5; if (sub && mixedVal(x) <= mixedVal(y)) return null;
    const [xn, xd] = impr(x), [yn, yd] = impr(y), D = lcm(xd, yd), n = xn * (D / xd) + (sub ? -1 : 1) * yn * (D / yd), res = mixedText(n, D), nm = pick(NAMES);
    const prompt = /word/.test(ctx.title) ? (sub ? `${nm} has ${mixedStr(x.w, x.n, x.d)} m of rope and uses ${mixedStr(y.w, y.n, y.d)} m. How much rope is left? (m)` : `${nm} ran ${mixedStr(x.w, x.n, x.d)} km and walked ${mixedStr(y.w, y.n, y.d)} km. How far in all? (km)`) : `${m(`${showMixed(x)} ${sub ? '−' : '+'} ${showMixed(y)}`)} = ?`;
    return mc(prompt, res, uniq([mixedText(n + 1, D), mixedText(Math.max(1, n - 1), D), mixedText(n + D, D), mixedText(n, D * 2)]).filter(v_ => v_ !== res), `Rename with denominator ${D} and ${sub ? 'subtract' : 'add'}: ${b(res)}.`, 4);
  }),
  R(/^Estimate sums and differences of (?:mixed numbers|fractions using benchmarks)$/, (mt, ctx) => () => {
    const d = pick([4, 5, 8, 10]), x = mixedOf(d, 5), y = mixedOf(d, 4), sub = Math.random() < 0.5; if (sub && mixedVal(x) < mixedVal(y)) return null; const rd = z => (z.n * 2 >= z.d ? z.w + 1 : z.w);
    return num(`Estimate ${m(`${showMixed(x)} ${sub ? '−' : '+'} ${showMixed(y)}`)} by rounding each to the nearest whole number.`, sub ? rd(x) - rd(y) : rd(x) + rd(y), `${rd(x)} ${sub ? '−' : '+'} ${rd(y)} = ${b(sub ? rd(x) - rd(y) : rd(x) + rd(y))}.`);
  }),
  R(/^Complete addition and subtraction sentences with fractions$/, () => () => {
    const d = pick([4, 6, 8, 10, 12]), a = ri(1, d - 2), c = ri(1, d - a - 1), sub = Math.random() < 0.5;
    return sub ? num(`${m(`${stack(a + c, d)} − ${stack('___', d)} = ${stack(a, d)}`)} What numerator is missing?`, c, `${a + c} − ${a} = ${b(c)}.`) : num(`${m(`${stack(a, d)} + ${stack('___', d)} = ${stack(a + c, d)}`)} What numerator is missing?`, c, `${a + c} − ${a} = ${b(c)}.`);
  }),

  /* ===== multiply fractions ===== */
  R(/^Multiply (?:unit )?fractions(?: and whole numbers| by whole numbers)?(?: I| II)?(?: using models)?$|^Multiply fractions and whole numbers: word problems$|^Multiply fractions: word problems$/, (mt, ctx) => () => {
    const t = ctx.title, a = frac(), whole = ri(2, 9), c = frac(), nm = pick(NAMES), twoFr = /^Multiply fractions/.test(t) && !/whole/.test(t);
    if (/models/.test(t)) { const d = pick([3, 4, 5]), k = ri(2, 4); return mc(`${fracBar(1, d, { width: 150 })}Which number sentence matches ${b(k)} copies of this bar?`, `${k} × ${fs(1, d)} = ${fs(k, d)}`, [`${k} × ${fs(1, d)} = ${fs(1, d * k)}`, `${k} + ${fs(1, d)} = ${fs(k + 1, d)}`, `${k} × ${fs(1, d)} = ${fs(k, d + 1)}`], `${k} × 1/${d} = ${b(fs(k, d))}.`, 4); }
    if (twoFr) { const [n, D] = [a[0] * c[0], a[1] * c[1]]; const res = mixedText(n, D); if (/word/.test(t)) return mc(`${nm} has ${fs(...a)} of a pizza and eats ${fs(...c)} of that part. What fraction of the whole pizza does ${nm} eat?`, res, choicesFor(n, D), `${fs(...a)} × ${fs(...c)} = ${b(res)}.`, 4); return mc(`${m(`${stack(...a)} × ${stack(...c)}`)} = ?`, res, choicesFor(n, D), `Multiply numerators and denominators: ${b(res)}.`, 4); }
    const n = a[0] * whole; if (/word/.test(t)) return mc(`${nm} drinks ${fs(...a)} L of water each day for ${whole} days. How much water is that? (L)`, mixedText(n, a[1]), choicesFor(n, a[1]), `${whole} × ${fs(...a)} = ${b(mixedText(n, a[1]))}.`, 4);
    return mc(`${m(`${whole} × ${stack(...a)}`)} = ?`, mixedText(n, a[1]), choicesFor(n, a[1]), `${whole} × ${a[0]}/${a[1]} = ${b(mixedText(n, a[1]))}.`, 4);
  }),
  R(/^Multiply two fractions using models$/, () => () => {
    const a = frac(6), c = frac(6), [n, D] = [a[0] * c[0], a[1] * c[1]];
    return mc(`A rectangle is split into ${a[1]} equal columns and ${c[1]} equal rows. ${a[0]} columns and ${c[0]} rows are shaded where they overlap. What fraction of the whole rectangle is double-shaded (${m(`${stack(...a)} × ${stack(...c)}`)})?`, fs(n, D), uniq([fs(a[0] + c[0], a[1] + c[1]), fs(n, D + 1), fs(a[0], c[1])]).filter(v_ => v_ !== fs(n, D)), `The overlap is ${a[0]} × ${c[0]} of ${a[1]} × ${c[1]} parts: ${b(fs(n, D))}.`, 4);
  }),
  R(/^Complete the fraction multiplication sentence$/, () => () => {
    const a = frac(8), c = frac(8), [n, D] = [a[0] * c[0], a[1] * c[1]];
    return num(`${m(`${stack(...a)} × ${stack('___', c[1])} = ${stack(n, D)}`)} What numerator is missing?`, c[0], `${a[0]} × ${c[0]} = ${n}, so the missing numerator is ${b(c[0])}.`);
  }),
  R(/^Multiply three or more fractions and whole numbers$/, () => () => {
    const a = frac(6), c = frac(6), w = ri(2, 6), [n, D] = [a[0] * c[0] * w, a[1] * c[1]];
    return mc(`${m(`${stack(...a)} × ${stack(...c)} × ${w}`)} = ?`, mixedText(n, D), choicesFor(n, D), `${b(mixedText(n, D))}.`, 4);
  }),
  R(/^Multiply mixed numbers(?: and whole numbers)?(?:: word problems)?$/, (mt, ctx) => () => {
    const x = mixedOf(pick([2, 3, 4, 5]), 4), whole = /whole/.test(ctx.title), y = whole ? null : mixedOf(pick([2, 3, 4]), 3), [xn, xd] = impr(x), [yn, yd] = whole ? [ri(2, 6), 1] : impr(y), n = xn * yn, D = xd * yd, res = mixedText(n, D), nm = pick(NAMES);
    if (/word/.test(ctx.title)) return mc(`A recipe needs ${mixedStr(x.w, x.n, x.d)} cups of flour per batch. How much flour is needed for ${yn} batches? (cups)`, mixedText(xn * yn, xd), choicesFor(xn * yn, xd), `${mixedStr(x.w, x.n, x.d)} × ${yn} = ${b(mixedText(xn * yn, xd))}.`, 4);
    return mc(`${m(`${showMixed(x)} × ${whole ? yn : showMixed(y)}`)} = ?`, res, choicesFor(n, D), `Write as improper fractions and multiply: ${b(res)}.`, 4);
  }),
  R(/^Estimate products of fractions and whole numbers$|^Estimate products and quotients of fractions and mixed numbers$|^Estimate quotients when dividing mixed numbers$/, (mt, ctx) => () => {
    const x = mixedOf(pick([2, 3, 4, 5]), 8), y = mixedOf(pick([2, 3, 4]), 4), rd = z => (z.n * 2 >= z.d ? z.w + 1 : z.w);
    if (/quotients/.test(ctx.title)) { const A = rd(x) * rd(y); return num(`Estimate ${m(`${showMixed({ ...x, w: x.w })} ÷ ${showMixed(y)}`)} by rounding each mixed number to the nearest whole number.`, Math.round(rd(x) / rd(y) * 10) / 10 === Math.round(rd(x) / rd(y)) ? rd(x) / rd(y) : Math.round(rd(x) / rd(y)), `${rd(x)} ÷ ${rd(y)} ≈ ${b(Math.round(rd(x) / rd(y)))}.`); }
    const w = ri(2, 9); return num(`Estimate ${m(`${w} × ${showMixed(x)}`)} by rounding the mixed number to the nearest whole number.`, w * rd(x), `${w} × ${rd(x)} = ${b(w * rd(x))}.`);
  }),
  R(/^Multiples of fractions$/, () => () => {
    const d = pick([3, 4, 5, 6, 8]), n = ri(1, d - 1), k = ri(2, 4), seq = range(1, 4).map(i => fs(i * n, d));
    return mc(`What are the first multiples of ${m(stack(n, d))}? Which comes next after ${b(seq.slice(0, 3).join(', '))}?`, seq[3], [fs(4 * n + 1, d), fs(3 * n, d + 1), fs(4 * n, d + 1)], `Add ${n}/${d} each time: ${b(seq[3])}.`, 4);
  }),

  /* ===== divide fractions ===== */
  R(/^Reciprocals(?: and multiplicative inverses)?$/, () => () => {
    const [n, d] = frac(10);
    return mc(`What is the reciprocal of ${m(stack(n, d))}?`, fs(d, n), [fs(n, d), fs(-d, n).replace('-', MINUS), fs(d + 1, n)].filter(v_ => v_ !== fs(d, n)), `Flip the numerator and denominator: ${b(fs(d, n))}.`, 4);
  }),
  R(/^Divide whole numbers (?:and unit fractions|by fractions)$|^Divide whole numbers by fractions$|^Multiply and divide whole numbers by fractions$/, (mt, ctx) => () => {
    const unit = /unit/.test(ctx.title), [n, d] = unit ? [1, pick([2, 3, 4, 5, 6])] : frac(8), w = ri(2, 12) * (unit ? 1 : n), mul = /Multiply and divide/.test(ctx.title) && Math.random() < 0.5;
    if (mul) { const w2 = ri(2, 6) * d; return mc(`${m(`${w2} × ${stack(n, d)}`)} = ?`, ansStr(w2 * n, d), choicesFor(w2 * n, d), `${b(ansStr(w2 * n, d))}.`, 4); }
    return mc(`${m(`${w} ÷ ${stack(n, d)}`)} = ?`, ansStr(w * d, n), choicesFor(w * d, n), `${w} × ${fs(d, n)} = ${b(ansStr(w * d, n))}.`, 4);
  }),
  R(/^Divide fractions(?:: word problems)?$/, (mt, ctx) => () => {
    const a = frac(8), c = frac(8), [n, D] = [a[0] * c[1], a[1] * c[0]], nm = pick(NAMES);
    if (/word/.test(ctx.title)) return mc(`${nm} has ${fs(...a)} kg of rice and puts ${fs(...c)} kg in each bag. How many bags can ${nm} fill?`, ansStr(n, D), choicesFor(n, D), `${fs(...a)} ÷ ${fs(...c)} = ${fs(...a)} × ${fs(c[1], c[0])} = ${b(ansStr(n, D))}.`, 4);
    return mc(`${m(`${stack(...a)} ÷ ${stack(...c)}`)} = ?`, ansStr(n, D), choicesFor(n, D), `Multiply by the reciprocal: ${b(ansStr(n, D))}.`, 4);
  }),
  R(/^Divide (?:fractions and )?mixed numbers(?:: word problems)?$|^Divide fractions and mixed numbers(?:: word problems)?$/, (mt, ctx) => () => {
    const x = mixedOf(pick([2, 3, 4]), 4), y = mixedOf(pick([2, 3, 5]), 2), [xn, xd] = impr(x), [yn, yd] = impr(y), n = xn * yd, D = xd * yn, res = ansStr(n, D), nm = pick(NAMES);
    if (/word/.test(ctx.title)) return mc(`${nm} has ${mixedStr(x.w, x.n, x.d)} m of ribbon and cuts pieces of ${mixedStr(y.w, y.n, y.d)} m. How many pieces can ${nm} cut?`, res, choicesFor(n, D), `Convert to improper fractions and divide: ${b(res)}.`, 4);
    return mc(`${m(`${showMixed(x)} ÷ ${showMixed(y)}`)} = ?`, res, choicesFor(n, D), `Improper fractions then multiply by the reciprocal: ${b(res)}.`, 4);
  }),
  R(/^Add, subtract or multiply fractions(?:: word problems)?$|^Add, subtract, multiply or divide two fractions(?:: word problems)?$|^Add, subtract, multiply and divide fractions and mixed numbers: word problems$/, (mt, ctx) => () => {
    const ops = /divide/.test(ctx.title) ? ['+', '−', '×', '÷'] : ['+', '−', '×'], op = pick(ops), a = frac(8), c = frac(8); let n, D;
    if (op === '+' || op === '−') { if (op === '−' && !goodSub(a, c)) return null; [n, D] = sumFr(a, c, op === '−'); } else if (op === '×') { n = a[0] * c[0]; D = a[1] * c[1]; } else { n = a[0] * c[1]; D = a[1] * c[0]; }
    if (n <= 0) return null; const res = mixedText(n, D), nm = pick(NAMES);
    if (/word|problems/.test(ctx.title)) return mc({ '+': `${nm} drinks ${fs(...a)} L of milk and then ${fs(...c)} L more. How many litres in all?`, '−': `${nm} has ${fs(...a)} L of juice and pours out ${fs(...c)} L. How much is left?`, '×': `${nm} uses ${fs(...c)} of a ${fs(...a)}-kg bag of flour. How many kilograms is that?`, '÷': `${nm} splits ${fs(...a)} kg of nuts into bags of ${fs(...c)} kg. How many bags?` }[op], res, choicesFor(n, D), `The operation is ${op}: ${b(res)}.`, 4);
    return mc(`${m(`${stack(...a)} ${op} ${stack(...c)}`)} = ?`, res, choicesFor(n, D), `${b(res)}.`, 4);
  }),
  R(/^Add and subtract fractions and decimals$|^Multiply and divide fractions and decimals$/, (mt, ctx) => () => {
    const mulDiv = /Multiply/.test(ctx.title), [n, d] = pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 10]]), x = pick([0.5, 0.2, 0.25, 0.4, 0.6, 0.1, 1.5, 2.5, 0.75]);
    const op = mulDiv ? pick(['×', '÷']) : pick(['+', '−']), a = n / d, r = op === '+' ? a + x : op === '−' ? Math.abs(a - x) : op === '×' ? a * x : a / x; if (op === '−' && a === x) return null;
    const first = op === '−' && a < x ? dstr(x) : fs(n, d), second = op === '−' && a < x ? fs(n, d) : dstr(x);
    return num(`${m(`${first} ${op} ${second}`)} = ? (Write the answer as a decimal.)`, fix(r, 4), `Convert ${fs(n, d)} to ${fix(a, 3)}: ${b(fix(r, 4))}.`);
  }),
  R(/^Fractions and mixed numbers review$|^Equivalent fractions review$/, (mt, ctx) => () => {
    const [n, d] = frac(10), k = ri(2, 5);
    return /Equivalent/.test(ctx.title) ? num(`${m(`${stack(n, d)} = ${stack('___', d * k)}`)}`, n * k, `Multiply top and bottom by ${k}: ${b(n * k)}.`) : mc(`Write ${m(stack(n + d * k, d))} as a mixed number in simplest form.`, mixedText(n + d * k, d), uniq([mixedText(n + d * k + 1, d), mixedStr(k + 1, n, d), fs(n + d * k, d)]).filter(v_ => v_ !== mixedText(n + d * k, d)), `${b(mixedText(n + d * k, d))}.`, 4);
  }),
  R(/^Understanding fractions: word problems$|^Fractions: word problems with graphs and tables$|^Compare fractions: word problems$/, (mt, ctx) => () => {
    const nm = pick(NAMES), [x, y] = sample(NAMES, 2);
    if (/Compare/.test(ctx.title)) { const a = frac(), c = frac(); const va = val(...a), vc = val(...c); if (va === vc) return null; return mc(`${x} finished ${fs(...a)} of a puzzle and ${y} finished ${fs(...c)} of the same puzzle. Who finished more?`, va > vc ? x : y, [va > vc ? y : x], `${fs(...a)} ≈ ${fix(va, 2)} and ${fs(...c)} ≈ ${fix(vc, 2)}.`, 2); }
    if (/graphs and tables/.test(ctx.title)) { const tot = ri(4, 8) * 5, part = ri(1, 3) * 5 ; return mc(`In a survey of ${tot} students, ${part} chose soccer. What fraction chose soccer?`, fs(...simp(part, tot)), uniq([fs(tot, part), fs(part, tot + 5), fs(tot - part, tot)]).filter(v_ => v_ !== fs(...simp(part, tot))), `${part}/${tot} = ${b(fs(...simp(part, tot)))}.`, 4); }
    const d = pick([3, 4, 5, 6, 8]), n = ri(1, d - 1); return mc(`${nm} reads ${n} pages of a ${d}-page story. What fraction of the story did ${nm} read?`, fs(n, d), [fs(d, n), fs(n, d + 1), fs(d - n, d)], `${n} out of ${d}: ${b(fs(n, d))}.`, 4);
  }),
  R(/^Compare fractions: find the missing numerator or denominator$/, () => () => {
    const d = pick([6, 8, 10, 12]), n = ri(1, d - 2);
    return num(`${m(`${stack(n, d)} < ${stack('___', d)}`)} What is the smallest whole number that makes this true?`, n + 1, `Same denominator: the numerator must be greater than ${n}, so ${b(n + 1)}.`);
  }),
  R(/^Compare and order fractions$/, () => () => {
    const items = []; const seen = new Set(); while (items.length < 3) { const f_ = frac(12); const key = fix(val(...f_), 6); if (!seen.has(key)) { seen.add(key); items.push(f_); } }
    const asc = Math.random() < 0.5, sorted = items.slice().sort((a, c) => (asc ? val(...a) - val(...c) : val(...c) - val(...a))), key = a => a.map(f => fs(...f)).join(', ');
    return mc(`Order from ${b(asc ? 'least to greatest' : 'greatest to least')}:<br>${m(items.map(f => stack(...f)).join(' , '))}`, key(sorted), uniq([shuffle(sorted), shuffle(sorted), sorted.slice().reverse()].map(key)).filter(k => k !== key(sorted)), `${b(key(sorted))}.`);
  }),
  R(/^Graph and order fractions on number lines$/, () => () => {
    const d = pick([4, 5, 6, 8]), pts = sample(range(1, d - 1), 3).sort((a, c) => a - c), letters = ['A', 'B', 'C'], order = shuffle(letters), asc = order.map(l => pts[letters.indexOf(l)]);
    return mc(`${fracLineLabeled(d, 1, pts.map((p, i) => ({ v: p / d, label: letters[i], color: '#3b82f6' })))}Which list shows ${b('greatest to least')}?`, letters.slice().reverse().join(', '), uniq([letters.join(', '), [letters[1], letters[0], letters[2]].join(', '), [letters[2], letters[0], letters[1]].join(', ')]), `The point farthest right is greatest: ${b(letters.slice().reverse().join(', '))}.`, 4);
  }),
  R(/^Put a mix of decimals, fractions and mixed numbers in order$/, () => () => {
    const items = [], seen = new Set(); const mk = () => { const k = pick(['d', 'f', 'm']); if (k === 'd') { const x = ri(5, 45) / 10; return { s: dstr(x), v: x }; } if (k === 'f') { const f_ = frac(10); return { s: fs(...f_), v: val(...f_) }; } const x = mixedOf(pick([2, 4, 5]), 3); return { s: mixedStr(x.w, x.n, x.d), v: mixedVal(x) }; };
    while (items.length < 4) { const it = mk(), key = fix(it.v, 5); if (!seen.has(key)) { seen.add(key); items.push(it); } }
    const sorted = items.slice().sort((a, c) => a.v - c.v), key = a => a.map(i => i.s).join(', ');
    return mc(`Order from ${b('least to greatest')}:<br>${m(items.map(i => i.s).join(', '))}`, key(sorted), uniq([shuffle(sorted), shuffle(sorted), sorted.slice().reverse()].map(key)).filter(k => k !== key(sorted)), `Convert to decimals and compare: ${b(key(sorted))}.`);
  }),
  R(/^Convert between mixed numbers and improper fractions$|^Compare mixed numbers and improper fractions$/, (mt, ctx) => () => {
    const d = pick([2, 3, 4, 5, 6, 8]), w = ri(1, 5), n = ri(1, d - 1), imp = w * d + n;
    if (/Compare/.test(ctx.title)) { const other = [imp + pick([-1, 0, 1]), d]; const s = cmpSym(imp / d, other[0] / other[1]); return mc(`Compare. ${m(`${mixedStack(w, n, d)} ___ ${stack(...other)}`)}`, s, ['<', '>', '='].filter(x => x !== s), `${mixedStr(w, n, d)} = ${imp}/${d}.`, 3); }
    return Math.random() < 0.5 ? mc(`Write ${m(stack(imp, d))} as a mixed number.`, mixedStr(w, n, d), [mixedStr(w + 1, n, d), mixedStr(w, d - n, d), mixedStr(w - 1 || 2, n, d)].filter(v_ => v_ !== mixedStr(w, n, d)), `${imp} ÷ ${d} = ${w} R ${n}.`, 4) : mc(`Write ${m(mixedStack(w, n, d))} as an improper fraction.`, fs(imp, d), [fs(imp + 1, d), fs(w * n + d, d), fs(imp, d + 1)], `${w} × ${d} + ${n} = ${imp}.`, 4);
  }),
  R(/^Decimal numbers review$/, () => () => {
    const x = decN(2, 9), y = decN(2, 9), op = pick(['+', '−']), a = Math.max(x, y), c = Math.min(x, y);
    return num(`${m(`${dstr(op === '+' ? x : a)} ${op} ${dstr(op === '+' ? y : c)}`)} = ?`, fix(op === '+' ? x + y : a - c, 3), `Line up the decimal points: ${b(fix(op === '+' ? x + y : a - c, 3))}.`);
  }),
  R(/^Divide by two-digit numbers: write remainders as fractions$/, () => () => {
    const d = ri(11, 30), q = ri(5, 40), r = ri(1, d - 1), a = d * q + r, [rn, rd] = simp(r, d);
    return mc(`${m(`${a} ÷ ${d}`)} Write the answer as a mixed number.`, mixedStr(q, rn, rd), [mixedStr(q, r, d + 1), mixedStr(q + 1, rn, rd), mixedStr(q, rd, rn + 1)].filter(v_ => v_ !== mixedStr(q, rn, rd)), `${a} ÷ ${d} = ${q} R ${r}, so ${b(mixedStr(q, rn, rd))}.`, 4);
  }),

  /* ===== decimals: multiply & divide ===== */
  R(/^Multiply and divide decimals by powers of ten$/, () => () => {
    const x = decN(ri(1, 2), 90), k = pick([10, 100, 1000]), mul = Math.random() < 0.5;
    return num(`${m(`${dstr(x)} ${mul ? '×' : '÷'} ${fmt(k)} = ?`)}`, fix(mul ? x * k : x / k, 6), `Move the decimal point ${Math.log10(k)} place${k > 10 ? 's' : ''} ${mul ? 'right' : 'left'}: ${b(fix(mul ? x * k : x / k, 6))}.`);
  }),
  R(/^Multiply a decimal by a one-digit whole number using (?:blocks|the distributive property)$/, (mt, ctx) => () => {
    const x = decN(1, 9), n = ri(2, 9), w = Math.floor(x), f = fix(x - w, 1);
    return /distributive/.test(ctx.title) ? num(`${m(`${dstr(x)} × ${n} = (${w} × ${n}) + (${dstr(f)} × ${n})`)} What is the product?`, fix(x * n, 3), `${w * n} + ${fix(f * n, 2)} = ${b(fix(x * n, 3))}.`) : num(`Using tenths blocks: ${m(`${dstr(x)} × ${n}`)} = ?`, fix(x * n, 3), `${Math.round(x * 10)} tenths × ${n} = ${b(fix(x * n, 3))}.`);
  }),
  R(/^Multiply a decimal by a two-digit whole number using area models$|^Multiply a decimal by a multi-digit whole number$/, () => () => {
    const x = decN(1, 9), n = ri(11, 49);
    return num(`${m(`${dstr(x)} × ${n}`)} = ?`, fix(x * n, 3), `${Math.round(x * 10)} × ${n} = ${Math.round(x * 10) * n} tenths = ${b(fix(x * n, 3))}.`);
  }),
  R(/^Multiply a decimal up to (?:tenths|hundredths) by a whole number(?:: word problems)?$/, (mt, ctx) => () => {
    const p = /hundredths/.test(ctx.title) ? 2 : 1, x = decN(p, 9), n = ri(2, 12), nm = pick(NAMES);
    return /word/.test(ctx.title) ? num(`${nm} buys ${n} items that each cost ${'$' + x.toFixed(2)}. What is the total cost? ($)`, fix(x * n, 4), `${n} × ${dstr(x)} = ${b(fix(x * n, 4))}.`) : num(`${m(`${dstr(x)} × ${n}`)} = ?`, fix(x * n, 4), `${b(fix(x * n, 4))}.`);
  }),
  R(/^Multiply decimals: where does the decimal point go\?$/, () => () => {
    const a = decN(1, 9), c = decN(ri(1, 2), 9), prod = fix(a * c, 4), digs = String(Math.round(a * 10) * Math.round(c * 10 ** decPlaces(c)));
    return mc(`${m(`${dstr(a)} × ${dstr(c)}`)}. Ignoring the decimal points, the digits of the product are ${b(digs)}. What is the product?`, String(prod), uniq([String(fix(prod * 10, 5)), String(fix(prod / 10, 5)), String(fix(prod * 100, 5))]).filter(v_ => v_ !== String(prod)), `Count the decimal places in both factors (${decPlaces(a)} + ${decPlaces(c)}): ${b(prod)}.`, 4);
  }),
  R(/^Multiply decimals$/, () => () => {
    const a = decN(ri(1, 2), 9), c = decN(ri(1, 2), 9);
    return num(`${m(`${dstr(a)} × ${dstr(c)} = ?`)}`, fix(a * c, 6), `Multiply as whole numbers, then count decimal places: ${b(fix(a * c, 6))}.`);
  }),
  R(/^Estimate products of decimal numbers$|^Estimate sums, differences and products of decimals$/, (mt, ctx) => () => {
    const a = decN(1, 19), c = decN(1, 9), op = /sums/.test(ctx.title) ? pick(['+', '−', '×']) : '×', A = Math.round(a), Cc = Math.round(c); if (op === '−' && A < Cc) return null;
    return num(`Estimate ${m(`${dstr(a)} ${op} ${dstr(c)}`)} by rounding each number to the nearest whole number.`, op === '+' ? A + Cc : op === '−' ? A - Cc : A * Cc, `${A} ${op} ${Cc} = ${b(op === '+' ? A + Cc : op === '−' ? A - Cc : A * Cc)}.`);
  }),
  R(/^Divide whole numbers: decimal quotients$/, () => () => {
    const d = pick([4, 5, 8, 20, 25]), a = ri(3, 99); const q = a / d; if (String(q).split('.')[1]?.length > 3) return null;
    return num(`${m(`${a} ÷ ${d}`)} = ? (Write the answer as a decimal.)`, fix(q, 4), `${a} ÷ ${d} = ${b(fix(q, 4))}.`);
  }),
  R(/^Divide whole numbers by decimals$/, () => () => {
    const dv = pick([0.2, 0.5, 0.25, 0.4, 0.1, 0.05]), w = ri(2, 20), q = fix(w / dv, 4);
    return num(`${m(`${w} ÷ ${dv} = ?`)}`, q, `Multiply both numbers by ${dv < 0.1 ? 100 : 10}: ${b(q)}.`);
  }),
  R(/^Inequalities with decimal division$/, () => () => {
    const a = decN(1, 40), d = pick([2, 4, 5]), q = fix(a / d, 4), other = fix(q + pick([-1, 0, 1, 0.5]), 3), s = cmpSym(q, other);
    return mc(`Choose the symbol. ${m(`${dstr(a)} ÷ ${d} ___ ${dstr(other)}`)}`, s, ['<', '>', '='].filter(x => x !== s), `${dstr(a)} ÷ ${d} = ${q}.`, 3);
  }),
  R(/^Maps with decimal distances$/, () => () => {
    const a = decN(1, 9), c = decN(1, 9), nm = pick(NAMES);
    return num(`On a map, the library is ${dstr(a)} km from the school and the park is ${dstr(c)} km farther along the same road. How far is the park from the school? (km)`, fix(a + c, 3), `${dstr(a)} + ${dstr(c)} = ${b(fix(a + c, 3))} km.`);
  }),
  R(/^Multi-step inequalities with decimals$/, () => () => {
    const a = decN(1, 9), c = ri(2, 6), d = decN(1, 9), v_ = fix(a * c - d, 3), other = fix(v_ + pick([-1, 1]), 3), s = cmpSym(v_, other);
    return mc(`Choose the symbol. ${m(`${dstr(a)} × ${c} ${MINUS} ${dstr(d)} ___ ${dstr(other)}`)}`, s, ['<', '>', '='].filter(x => x !== s), `${dstr(a)} × ${c} − ${dstr(d)} = ${v_}.`, 3);
  })
];
