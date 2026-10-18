/* Number systems for Grades 6–12: whole numbers, integers, absolute value, rational numbers, exponents, roots,
   scientific notation, number theory and numerical expressions. Generators scale their difficulty with ctx.grade. */
import {
  ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, dec, num, mc, yesNo, near, svg, C, NAMES, gcd, lcm, words, numberLine, emojiRow, big, PLACES, digits, MINUS
} from '../h.js';
import { R } from '../engine.js';
import { stack, fs, simp, mixedStr, mixedStack, cmpSym } from './fractions.js';

const S = n => (n < 0 ? MINUS + Math.abs(n) : String(n));              // signed integer text
const P = n => (n < 0 ? `(${S(n)})` : String(n));                       // parenthesised when negative
const sup = (a, e) => `${a}<sup>${e}</sup>`;
const nz = (lo, hi) => { let x = 0; while (x === 0) x = ri(lo, hi); return x; };
const ints = (grade, big_ = false) => { const hi = grade <= 6 ? 12 : grade === 7 ? 15 : 20; return [nz(-hi, hi), nz(-hi, hi)]; };
const wrongInts = (ans, k = 3) => uniq([-ans, ans + 1, ans - 1, ans + 2, ans - 2, ans * -1 + 1]).filter(x => x !== ans).slice(0, k);

/** evaluate a small arithmetic string made of numbers, + − × ÷ and parentheses */
const evalExpr = str => Function(`"use strict";return (${str.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/<sup>(\d+)<\/sup>/g, '**$1')});`)();

/* ---------- rational number helpers ---------- */
const decStr = x => String(fix(x, 4));
function rationalNumber(grade) {                 // returns {v, text, kind}
  const k = pick(['int', 'dec', 'frac', 'mixed']);
  if (k === 'int') { const n = ri(-9, 9); return { v: n, text: S(n) }; }
  if (k === 'dec') { const x = ri(-99, 99) / 10; return { v: x, text: S(fix(x, 1)) }; }
  const d = pick([2, 3, 4, 5, 6, 8]), n = ri(1, 2 * d), sg = pick([-1, 1]);
  if (k === 'frac') return { v: (sg * n) / d, text: (sg < 0 ? MINUS : '') + n + '/' + d };
  const w = ri(1, 4), nn = ri(1, d - 1); return { v: sg * (w + nn / d), text: (sg < 0 ? MINUS : '') + mixedStr(w, nn, d) };
}
const SCI = (x, digits_ = 1) => { const e = Math.floor(Math.log10(Math.abs(x))), mant = fix(x / 10 ** e, digits_); return { mant, e }; };

const COUNTERS = (n, c) => `<span style="font-size:22px;letter-spacing:2px">${(c === '+' ? '🟡' : '🔴').repeat(Math.abs(n))}</span>`;

export const NUMSYS_RULES = [
  /* ===== whole numbers & decimals (G6) ===== */
  R(/^Place values in whole numbers up to (?:1 million|billions)$/, (mt, ctx) => () => {
    const d = /billions/.test(ctx.title) ? ri(7, 10) : ri(5, 7), n = digits(d), s = String(n), i = ri(0, d - 1), place = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions', 'ten millions', 'hundred millions', 'billions'][d - 1 - i];
    return mc(`In ${b(fmt(n))}, which place is the digit ${b(s[i])} in?`, place, ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions', 'ten millions', 'hundred millions', 'billions'].slice(0, d).filter(x => x !== place).sort(() => Math.random() - 0.5).slice(0, 3), `Counting from the right, that digit is in the ${b(place)} place.`, 4);
  }),
  R(/^Compare whole numbers$|^Order whole numbers$/, (mt, ctx) => () => {
    const d = ri(5, 9);
    if (/Compare/.test(ctx.title)) { const a = digits(d), c = Math.random() < 0.2 ? a : a + ri(-999, 999); const s = cmpSym(a, c); return mc(`Compare. ${m(`${fmt(a)} ___ ${fmt(c)}`)}`, s, ['<', '>', '='].filter(x => x !== s), `${fmt(a)} ${s} ${fmt(c)}.`, 3); }
    const vals = uniq(Array.from({ length: 4 }, () => digits(d))); if (vals.length < 4) return null; const asc = Math.random() < 0.5, sorted = vals.slice().sort((x, y) => (asc ? x - y : y - x)), key = a => a.map(fmt).join(', ');
    return mc(`Order from ${b(asc ? 'least to greatest' : 'greatest to least')}:<br>${m(key(vals))}`, key(sorted), uniq([shuffle(sorted), shuffle(sorted), sorted.slice().reverse()].map(key)).filter(k => k !== key(sorted)), `${b(key(sorted))}.`);
  }),
  R(/^Use logical reasoning to find the order$/, () => () => {
    const [a, c, d] = sample(NAMES, 3), order = shuffle([a, c, d]);
    return mc(`${order[0]} finished before ${order[1]}. ${order[1]} finished before ${order[2]}. Who finished ${b('last')}?`, order[2], [order[0], order[1]], `${order[0]} < ${order[1]} < ${order[2]} in finishing order, so ${b(order[2])} was last.`, 3);
  }),
  R(/^Find the missing exponent or base$/, () => () => {
    const base = ri(2, 9), e = ri(2, 4), val = base ** e;
    return Math.random() < 0.5 ? num(`${m(`${sup(base, '___')} = ${fmt(val)}`)}`, e, `${Array(e).fill(base).join(' × ')} = ${fmt(val)}: the exponent is ${b(e)}.`) : num(`${m(`${sup('___', e)} = ${fmt(val)}`)}`, base, `${base}${e === 2 ? '²' : e === 3 ? '³' : '^' + e} = ${fmt(val)}: the base is ${b(base)}.`);
  }),
  R(/^Evaluate numerical expressions involving whole numbers$|^Evaluate numerical expressions with exponents$|^Evaluate numerical expressions involving exponents$/, (mt, ctx) => () => {
    const a = ri(2, 9), c = ri(2, 6), d = ri(2, 9), e = pick([2, 3]), forms = [`${a} + ${c} × ${d}`, `(${a} + ${c}) × ${d}`, `${a} × ${c} − ${d}`, `${a}<sup>${e}</sup> + ${c} × ${d}`, `${d} × (${a} − ${Math.min(c, a - 1)})<sup>2</sup>`, `${a}<sup>2</sup> − ${c}<sup>${e}</sup>`];
    const ex = /exponents/.test(ctx.title) ? pick(forms.filter(f => f.includes('sup'))) : pick(forms.filter(f => !f.includes('sup'))), v_ = evalExpr(ex); if (!Number.isFinite(v_) || v_ < 0) return null;
    return num(`${m(`${ex} = ?`)}`, v_, `Follow the order of operations (brackets, exponents, × ÷, then + −): ${b(fmt(v_))}.`);
  }),
  R(/^Estimate to solve word problems$|^Guess-and-check word problems$/, (mt, ctx) => () => {
    if (/Estimate/.test(ctx.title)) { const a = ri(120, 890), c = ri(110, 480), nm = pick(NAMES); const A = Math.round(a / 100) * 100, B = Math.round(c / 100) * 100; return num(`${nm} read ${a} pages in one month and ${c} pages in another. About how many pages is that altogether? (Round each to the nearest hundred.)`, A + B, `${A} + ${B} = ${b(A + B)}.`); }
    const x = ri(3, 12), y = ri(2, 12); if (x === y) return null; return num(`The sum of two numbers is ${b(x + y)} and their product is ${b(x * y)}. What is the larger number?`, Math.max(x, y), `Try pairs adding to ${x + y}: ${Math.max(x, y)} × ${Math.min(x, y)} = ${x * y}.`);
  }),
  R(/^Find the number of each type of coin$/, () => () => {
    const q = ri(2, 8), d = ri(2, 8), total = q * 25 + d * 10;
    return num(`${q + d} coins (only quarters and dimes) are worth ${b((total / 100).toFixed(2).replace(/^/, '$'))}. How many quarters are there?`, q, `Try ${q} quarters and ${d} dimes: ${q * 25} + ${d * 10} = ${total}¢. So ${b(q)} quarters.`);
  }),
  R(/^Consecutive integer problems$/, () => () => {
    const n = ri(3, 30), kind = pick(['sum2', 'sum3']);
    return kind === 'sum2' ? num(`The sum of two consecutive integers is ${b(2 * n + 1)}. What is the smaller integer?`, n, `n + (n + 1) = ${2 * n + 1}, so n = ${b(n)}.`) : num(`The sum of three consecutive integers is ${b(3 * n + 3)}. What is the smallest integer?`, n, `n + (n + 1) + (n + 2) = ${3 * n + 3}, so n = ${b(n)}.`);
  }),
  R(/^Decimal place values$/, () => () => {
    const x = fix(ri(1, 99) + ri(1, 999) / 1000, 3), s = dec(x, 3), frac = s.split('.')[1], k = ri(0, 2), dgt = frac[k]; if (frac.split(dgt).length > 2) return null;
    return mc(`In ${b(s)}, what is the place value of the digit ${b(dgt)}?`, ['tenths', 'hundredths', 'thousandths'][k], ['tenths', 'hundredths', 'thousandths', 'ones', 'tens'].filter(x2 => x2 !== ['tenths', 'hundredths', 'thousandths'][k]).slice(0, 3), `It is ${k + 1} place${k ? 's' : ''} after the decimal point.`, 4);
  }),
  R(/^Word names for decimal numbers$/, () => () => {
    const w = ri(1, 99), p = pick([1, 2, 3]), f = ri(1, 10 ** p - 1), x = w + f / 10 ** p, name = ['tenths', 'hundredths', 'thousandths'][p - 1];
    return mc(`Which is the word name for ${b(dec(x, p))}?`, `${words(w)} and ${words(f)} ${name}`, [`${words(w)} and ${words(f)} ${['hundredths', 'thousandths', 'tenths'][p - 1]}`, `${words(w)} and ${words(f + 1)} ${name}`, `${words(f)} and ${words(w)} ${name}`], `${dec(x, p)} is ${b(`${words(w)} and ${words(f)} ${name}`)}.`, 4);
  }),
  R(/^Convert decimals between standard and expanded form$/, () => () => {
    const x = fix(ri(1, 99) + ri(1, 99) / 100, 2), [i, f] = dec(x, 2).split('.'), exp = `${+i - (+i % 10)}${+i % 10 ? ' + ' + (+i % 10) : ''} + ${+f[0] ? f[0] / 10 : ''}`.replace(/^0 \+ /, '');
    const parts = [+i >= 10 ? Math.floor(+i / 10) * 10 : null, +i % 10 || null, +f[0] ? +f[0] / 10 : null, +f[1] ? +f[1] / 100 : null].filter(v_ => v_ !== null), e = parts.join(' + ');
    return mc(`Write ${b(dec(x, 2))} in expanded form.`, e, [parts.map(v_ => (v_ < 1 ? v_ * 10 : v_)).join(' + '), parts.slice().reverse().join(' + '), [...parts.slice(0, -1), fix(parts[parts.length - 1] * 10, 2)].join(' + ')].filter(z => z !== e), `Add the value of each digit: ${b(e)}.`, 4);
  }),
  R(/^Round whole numbers and decimals: find the missing digit$/, () => () => {
    const d1 = ri(0, 9), d2 = ri(0, 9), x = `${ri(1, 9)}.${d1}${d2}`, target = pick([1, 2]);
    const lvl = target === 1 ? 'tenth' : 'whole number'; const missing = ri(0, 9), n = `3.${missing}${d2}`, r = target === 1 ? fix(Math.round(+n * 10) / 10, 1) : Math.round(+n);
    const opts = range(0, 9), good = opts.filter(k => (target === 1 ? fix(Math.round(+`3.${k}${d2}` * 10) / 10, 1) : Math.round(+`3.${k}${d2}`)) === r);
    if (good.length === 10 || !good.length) return null;
    return mc(`The number ${b(`3.?${d2}`)} rounds to ${b(r)} when rounded to the nearest ${lvl}. Which digit could replace the ?`, String(good[0]), opts.filter(k => !good.includes(k)).slice(0, 3).map(String), `Try ${good[0]}: 3.${good[0]}${d2} rounds to ${r}.`, 4);
  }),
  R(/^Mixed operations: decimals$|^Add, subtract, multiply or divide decimals(?:: word problems)?$|^Evaluate numerical expressions involving decimals$/, (mt, ctx) => () => {
    const a = ri(11, 99) / 10, c = ri(2, 9), d = ri(11, 49) / 10, op = pick(['+', '−', '×', '÷']), nm = pick(NAMES);
    if (/Evaluate/.test(ctx.title)) { const ex = pick([`${dec(a, 1)} + ${c} × ${dec(d, 1)}`, `(${dec(a, 1)} − ${dec(d, 1)}) × ${c}`, `${dec(a, 1)} × ${c} − ${dec(d, 1)}`]), r = fix(evalExpr(ex), 4); if (r < 0) return null; return num(`${m(`${ex} = ?`)}`, r, `Order of operations: ${b(r)}.`); }
    const r = op === '+' ? a + d : op === '−' ? Math.abs(a - d) : op === '×' ? a * c : fix(a * c, 2) / c, pa = op === '−' && a < d ? d : a, pd = op === '−' && a < d ? a : d;
    if (/word/.test(ctx.title) && op === '−' && a === d) return null;
    if (/word/.test(ctx.title)) return num(op === '+' ? `${nm} buys items costing $${dec(a, 2)} and $${dec(d, 2)}. What is the total? ($)` : op === '−' ? `${nm} has $${dec(pa, 2)} and spends $${dec(pd, 2)}. How much is left? ($)` : op === '×' ? `${nm} buys ${c} items at $${dec(a, 2)} each. What is the total? ($)` : `${nm} splits $${dec(fix(a * c, 2), 2)} equally among ${c} friends. How much does each get? ($)`, fix(r, 4), `The answer is ${b(fix(r, 4))}.`);
    return num(op === '÷' ? `${m(`${dec(fix(a * c, 2), 2)} ÷ ${c} = ?`)}` : op === '×' ? `${m(`${dec(a, 1)} × ${c} = ?`)}` : `${m(`${dec(pa, 1)} ${op} ${dec(pd, 1)} = ?`)}`, fix(r, 4), `The answer is ${b(fix(r, 4))}.`);
  }),

  /* ===== number theory leftovers ===== */
  R(/^Prime or composite$|^Classify numbers$|^Factors$/, (mt, ctx) => () => {
    const n = ri(10, 120), isP = n > 1 && ![...Array(Math.floor(Math.sqrt(n)) - 1).keys()].some(i => n % (i + 2) === 0);
    if (/Factors/.test(ctx.title)) { const f = range(1, n).filter(k => n % k === 0); return num(`How many factors does ${b(n)} have?`, f.length, `The factors are ${f.join(', ')}: ${b(f.length)}.`); }
    if (/Classify/.test(ctx.title)) { const kinds = [['natural number', n > 0], ['prime', isP], ['composite', n > 1 && !isP], ['even', n % 2 === 0]]; const [k, ok] = pick(kinds); return yesNo(`Is ${b(n)} ${k === 'even' ? 'an' : 'a'} ${b(k)} number?`, ok, `${n} ${ok ? 'is' : 'is not'} ${k === 'even' ? 'even' : 'a ' + k + ' number'}.`, ['Yes', 'No']); }
    return mc(`Is ${b(n)} prime or composite?`, isP ? 'Prime' : 'Composite', [isP ? 'Composite' : 'Prime'], isP ? `${n} has only two factors.` : `${n} has more than two factors.`, 2);
  }),
  R(/^Prime factorization with exponents$/, () => () => {
    const n = pick([12, 18, 24, 36, 40, 45, 48, 54, 60, 72, 75, 90, 100, 120]), f = {}; let x = n; for (let p = 2; x > 1; p++) while (x % p === 0) { f[p] = (f[p] || 0) + 1; x /= p; }
    const ans = Object.entries(f).map(([p, e]) => (e > 1 ? `${p}^${e}` : p)).join(' × ');
    const alt = [Object.entries(f).map(([p, e]) => `${p}^${e + 1}`).join(' × '), Object.entries(f).map(([p, e]) => (e > 1 ? `${p * e}` : p)).join(' × '), Object.entries(f).reverse().map(([p, e]) => `${p}^${e === 1 ? 2 : 1}`).join(' × ')].filter(v_ => v_ !== ans);
    return mc(`Write the prime factorization of ${b(n)} using exponents.`, ans, uniq(alt), `${n} = ${b(ans)}.`, 4);
  }),
  R(/^GCF and LCM: word problems$/, () => () => {
    const a = pick([6, 8, 9, 10, 12, 15]), c = pick([4, 6, 9, 10, 14, 15, 18]); if (a === c) return null; const nm = pick(NAMES);
    return Math.random() < 0.5 ? num(`${nm} has ${a * 3} red beads and ${c * 3} blue beads and wants to make identical bracelets using all the beads. What is the greatest number of bracelets ${nm} can make?`, gcd(a * 3, c * 3), `The greatest common factor of ${a * 3} and ${c * 3} is ${b(gcd(a * 3, c * 3))}.`) : num(`One bus comes every ${a} minutes and another every ${c} minutes. They arrive together now. In how many minutes will they arrive together again?`, lcm(a, c), `The least common multiple of ${a} and ${c} is ${b(lcm(a, c))}.`);
  }),
  R(/^Multiplicative inverses$/, () => () => {
    const [n, d] = pick([[2, 3], [3, 4], [5, 2], [7, 5], [1, 6], [4, 9]]);
    return mc(`What is the multiplicative inverse (reciprocal) of ${m(stack(n, d))}?`, fs(d, n), [fs(n, d), fs(-n, d).replace('-', MINUS), fs(d + 1, n)].filter(v_ => v_ !== fs(d, n)), `Flip the fraction: ${b(fs(d, n))}.`, 4);
  }),

  /* ===== integers ===== */
  R(/^Compare and order integers$|^Compare integers$|^Put integers in order$/, (mt, ctx) => () => {
    if (/Compare integers|Compare and order/.test(ctx.title) && Math.random() < 0.5) { const [a, c] = ints(ctx.grade); const s = cmpSym(a, c); return mc(`Compare. ${m(`${S(a)} ___ ${S(c)}`)}`, s, ['<', '>', '='].filter(x => x !== s), `${S(a)} is ${s === '>' ? 'to the right of' : 'to the left of'} ${S(c)}.`, 3); }
    const vals = uniq(Array.from({ length: 4 }, () => ri(-12, 12))); if (vals.length < 4) return null; const asc = Math.random() < 0.5, sorted = vals.slice().sort((x, y) => (asc ? x - y : y - x)), key = a => a.map(S).join(', ');
    return mc(`Order from ${b(asc ? 'least to greatest' : 'greatest to least')}:<br>${m(key(vals))}`, key(sorted), uniq([shuffle(sorted), shuffle(sorted), sorted.slice().reverse()].map(key)).filter(k => k !== key(sorted)), `${b(key(sorted))}.`);
  }),
  R(/^(?:Understanding absolute value|Absolute value|Absolute value and opposite integers)$/, (mt, ctx) => () => {
    const x = nz(-15, 15);
    if (/Understanding/.test(ctx.title)) return mc(`The absolute value of ${b(S(x))} is its distance from 0. What is ${m(`|${S(x)}|`)}?`, String(Math.abs(x)), [S(-Math.abs(x)), S(x) === String(Math.abs(x)) ? S(x + 1) : S(x), String(Math.abs(x) + 1)].filter(v_ => v_ !== String(Math.abs(x))), `${S(x)} is ${Math.abs(x)} units from 0: ${b(Math.abs(x))}.`, 4);
    if (/opposite/.test(ctx.title)) { const kind = pick(['abs', 'opp']); return kind === 'abs' ? num(`${m(`|${S(x)}|`)} = ?`, Math.abs(x), `${b(Math.abs(x))}.`) : mc(`What is the opposite of ${b(S(x))}?`, S(-x), [S(x), S(x + 1), '0'].filter(v_ => v_ !== S(-x)), `${b(S(-x))}.`, 4); }
    const y = nz(-9, 9); const e = pick([`|${S(x)}|`, `|${S(x)}| + |${S(y)}|`, `−|${S(x)}|`]); const r = e.startsWith('−') ? -Math.abs(x) : e.includes('+') ? Math.abs(x) + Math.abs(y) : Math.abs(x);
    return num(`${m(`${e} = ?`)}`, r, `Take the absolute values first: ${b(S(r))}.`);
  }),
  R(/^Absolute value and integers: word problems$/, () => () => {
    const a = nz(-20, -5), c = ri(5, 20), nm = pick(NAMES);
    return num(`${nm} is at an elevation of ${b(a + ' m')} (below sea level), and a bird is at ${b(c + ' m')}. How many metres apart are they?`.replace('-', MINUS), c - a, `|${c}| + |${a}| = ${b(c - a)} m.`);
  }),
  R(/^Integer inequalities with absolute values$/, () => () => {
    const a = nz(-12, 12), c = nz(-12, 12), s = cmpSym(Math.abs(a), Math.abs(c));
    return mc(`Compare. ${m(`|${S(a)}| ___ |${S(c)}|`)}`, s, ['<', '>', '='].filter(x => x !== s), `|${S(a)}| = ${Math.abs(a)} and |${S(c)}| = ${Math.abs(c)}.`, 3);
  }),
  R(/^Integer addition rules$|^Integer subtraction rules$|^Integer addition and subtraction rules$|^Apply addition and subtraction rules$/, (mt, ctx) => () => {
    const a = nz(-12, 12), c = nz(-12, 12), sub = /subtraction rules$/.test(ctx.title) && !/addition and/.test(ctx.title) || (/and subtraction|Apply/.test(ctx.title) && Math.random() < 0.5), r = sub ? a - c : a + c; if (r === 0) return null;
    return mc(`Without finishing the calculation, will ${m(`${S(a)} ${sub ? '−' : '+'} ${P(c)}`)} be positive or negative?`, r > 0 ? 'Positive' : 'Negative', [r > 0 ? 'Negative' : 'Positive'], `${S(a)} ${sub ? '−' : '+'} ${P(c)} = ${S(r)}, which is ${r > 0 ? 'positive' : 'negative'}.`, 2);
  }),
  R(/^Add integers using counters$|^Subtract integers using counters$|^Add and subtract integers using counters$/, (mt, ctx) => () => {
    const a = nz(-7, 7), c = nz(-7, 7), sub = /^Subtract/.test(ctx.title) || (/and subtract/.test(ctx.title) && Math.random() < 0.5), r = sub ? a - c : a + c;
    return num(`${COUNTERS(a, a > 0 ? '+' : '-')} ${sub ? '− ' : '+ '}${COUNTERS(c, c > 0 ? '+' : '-')}<br>🟡 = +1 and 🔴 = −1. What is ${m(`${S(a)} ${sub ? '−' : '+'} ${P(c)}`)}?`, r, `${S(a)} ${sub ? '−' : '+'} ${P(c)} = ${b(S(r))}.`);
  }),
  R(/^Add integers using number lines$|^Subtract integers using number lines$/, (mt, ctx) => () => {
    const a = nz(-8, 8), c = nz(-8, 8), sub = /^Subtract/.test(ctx.title), r = sub ? a - c : a + c; if (Math.abs(r) > 10) return null;
    return mc(`${numberLine({ min: -12, max: 12, step: 1, labelEvery: 2, marks: [{ v: a, label: S(a), color: C.blue }, { v: r, label: S(r), color: C.red }], width: 480 })}The blue point is the start and the red point is the result. Which number sentence matches?`, `${S(a)} ${sub ? '−' : '+'} ${P(c)} = ${S(r)}`, uniq([`${S(a)} ${sub ? '+' : '−'} ${P(c)} = ${S(r)}`, `${S(a)} ${sub ? '−' : '+'} ${P(-c)} = ${S(r + 1)}`, `${S(c)} ${sub ? '−' : '+'} ${P(a)} = ${S(r)}`]).filter(x => x !== `${S(a)} ${sub ? '−' : '+'} ${P(c)} = ${S(r)}`), `${S(a)} ${sub ? '−' : '+'} ${P(c)} = ${b(S(r))}.`);
  }),
  R(/^Add integers$|^Subtract integers$|^Add and subtract integers$|^Add three or more integers$|^Add and subtract three or more integers$|^Add and subtract integers: word problems$|^Complete addition and subtraction sentences with integers$/, (mt, ctx) => () => {
    const t = ctx.title, sub = /^Subtract/.test(t) || (/and subtract/.test(t) && Math.random() < 0.5);
    if (/three or more/.test(t)) { const xs = Array.from({ length: ri(3, 4) }, () => nz(-12, 12)); return num(`${m(xs.map((x, i) => (i ? (x < 0 ? `− ${Math.abs(x)}` : `+ ${x}`) : S(x))).join(' '))} = ?`, sum(xs), `${b(S(sum(xs)))}.`); }
    const [a, c] = ints(ctx.grade), r = sub ? a - c : a + c, nm = pick(NAMES);
    if (/word/.test(t)) { const temp = ri(-10, 10), ch = nz(-8, 8); return num(`The temperature was ${b(S(temp) + '°C')} and then changed by ${b(S(ch) + '°C')}. What is the new temperature? (°C)`, temp + ch, `${S(temp)} + ${P(ch)} = ${b(S(temp + ch))}.`); }
    if (/Complete/.test(t)) return num(`${m(`${S(a)} ${sub ? '−' : '+'} ___ = ${S(r)}`)}`, sub ? a - r : r - a, `${S(a)} ${sub ? '−' : '+'} ${P(sub ? a - r : r - a)} = ${S(r)}.`);
    return num(`${m(`${S(a)} ${sub ? '−' : '+'} ${P(c)} = ?`)}`, r, `${S(a)} ${sub ? '−' : '+'} ${P(c)} = ${b(S(r))}.`);
  }),
  R(/^Understand multiplying by a negative integer using a number line$/, () => () => {
    const a = ri(2, 5), c = ri(2, 5);
    return num(`${numberLine({ min: -20, max: 5, step: 1, labelEvery: 5, marks: [{ v: -a * c, label: '?' }], width: 480 })}Starting at 0, make ${b(a)} jumps of ${b(S(-c))}. What number do you land on?`, -a * c, `${a} × ${P(-c)} = ${b(S(-a * c))}.`);
  }),
  R(/^Integer multiplication rules$|^Integer division rules$|^Integer multiplication and division rules$|^Apply multiplication and division rules$/, (mt, ctx) => () => {
    const a = nz(-9, 9), c = nz(-9, 9), div = /division/.test(ctx.title) && !/multiplication and/.test(ctx.title) || (/and division|Apply/.test(ctx.title) && Math.random() < 0.5);
    const sa = a < 0 ? 'negative' : 'positive', sc = c < 0 ? 'negative' : 'positive', res = (a < 0) === (c < 0) ? 'positive' : 'negative';
    return mc(`What is the sign of ${b(`a ${sa} ${div ? 'divided by' : 'times'} a ${sc}`)}?`, res, [res === 'positive' ? 'negative' : 'positive'], `Same signs give a positive; different signs give a negative: ${b(res)}.`, 2);
  }),
  R(/^Multiply integers$|^Divide integers$|^Multiply and divide integers$|^Equal quotients of integers$|^Complete multiplication and division sentences with integers$/, (mt, ctx) => () => {
    const t = ctx.title, a = nz(-9, 9), c = nz(-9, 9), div = /^Divide/.test(t) || (/and divide|Complete/.test(t) && Math.random() < 0.5);
    if (/Equal quotients/.test(t)) { const p = nz(2, 9) * pick([-1, 1]), q = nz(2, 9) * pick([-1, 1]); const base = p * q; return mc(`Which expression is equal to ${m(`${S(base)} ÷ ${P(q)}`)}?`, `${S(p)}`, [S(-p), S(p + 1), S(q)].filter(v_ => v_ !== S(p)), `${S(base)} ÷ ${P(q)} = ${S(p)}.`, 4); }
    if (div) { const q = a, d = c, prod = q * d; if (/Complete/.test(t)) return num(`${m(`${S(prod)} ÷ ___ = ${S(q)}`)}`, d, `${S(prod)} ÷ ${P(d)} = ${S(q)}.`); return num(`${m(`${S(prod)} ÷ ${P(d)} = ?`)}`, q, `${b(S(q))}.`); }
    if (/Complete/.test(t)) return num(`${m(`${S(a)} × ___ = ${S(a * c)}`)}`, c, `${S(a * c)} ÷ ${P(a)} = ${S(c)}.`);
    return num(`${m(`${S(a)} × ${P(c)} = ?`)}`, a * c, `${b(S(a * c))}.`);
  }),
  R(/^Add, subtract, multiply and divide integers$/, (mt, ctx) => () => {
    const op = pick(['+', '−', '×', '÷']), a = nz(-10, 10), c = nz(-9, 9), x = op === '÷' ? a * c : a, r = op === '+' ? a + c : op === '−' ? a - c : op === '×' ? a * c : a;
    return num(`${m(`${S(x)} ${op} ${P(c)} = ?`)}`, op === '÷' ? a : r, `${b(S(op === '÷' ? a : r))}.`);
  }),
  R(/^Evaluate numerical expressions involving integers$/, () => () => {
    const a = nz(-9, 9), c = nz(-6, 6), d = nz(-6, 6), forms = [`${S(a)} + ${P(c)} × ${P(d)}`, `${S(a)} − ${P(c)} × ${P(d)}`, `(${S(a)} + ${P(c)}) × ${P(d)}`, `${S(a)} × ${P(c)} − ${P(d)}`];
    const ex = pick(forms), r = evalExpr(ex.replace(/−/g, '-')); return num(`${m(`${ex} = ?`)}`, r, `Use the order of operations: ${b(S(r))}.`);
  }),

  /* ===== rational numbers ===== */
  R(/^Identify rational numbers$|^Identify rational and irrational numbers$|^Classify real numbers$/, (mt, ctx) => () => {
    const items = [['3/4', 'rational'], ['0.25', 'rational'], ['−7', 'rational'], ['√9', 'rational'], ['√2', 'irrational'], ['π', 'irrational'], ['√5', 'irrational'], ['0.333…', 'rational'], ['−2.5', 'rational'], ['√16', 'rational'], ['√7', 'irrational']], [t, k] = pick(items);
    return mc(`Is ${b(t)} a rational or an irrational number?`, k === 'rational' ? 'Rational' : 'Irrational', [k === 'rational' ? 'Irrational' : 'Rational'], k === 'rational' ? `${t} can be written as a fraction of two integers.` : `${t} cannot be written as a fraction: it never ends or repeats.`, 2);
  }),
  R(/^Absolute value of rational numbers$/, () => () => {
    const x = rationalNumber(8); if (x.v === 0) return null;
    return mc(`What is ${m(`|${x.text}|`)}?`, (x.text.startsWith(MINUS) ? x.text.slice(1) : x.text), [x.text.startsWith(MINUS) ? x.text : MINUS + x.text, '0'], `The absolute value is the distance from 0, so it is never negative.`, 3);
  }),
  R(/^Rational numbers on number lines$|^Compare and order rational numbers using number lines$/, () => () => {
    const d = pick([2, 4, 5]), vals = sample(range(-3 * d, 3 * d).filter(k => k !== 0), 3).sort((x, y) => x - y), letters = ['A', 'B', 'C'], k = ri(0, 2), t = vals[k];
    const txt = k_ => { const n = Math.abs(vals[k_]), dd = d; const [sn, sd] = simp(n, dd); return (vals[k_] < 0 ? MINUS : '') + (sd === 1 ? sn : `${sn}/${sd}`); };
    return mc(`${numberLine({ min: -3, max: 3, step: 1 / d, labelEvery: d, marks: vals.map((v_, i) => ({ v: v_ / d, label: letters[i], color: C.blue })), width: 480, fmtLabel: x => fmt(Math.round(x)) })}Which point is at ${b(txt(k))}?`, letters[k], letters.filter((_, i) => i !== k), `Count ${Math.abs(t)} tick${Math.abs(t) > 1 ? 's' : ''} ${t < 0 ? 'left' : 'right'} of 0: point ${b(letters[k])}.`, 3);
  }),
  R(/^Compare rational numbers$|^Compare positive rational numbers$|^Compare and order decimals$|^Compare mixed numbers and improper fractions$/, (mt, ctx) => () => {
    const pos = /positive/.test(ctx.title), draw_ = () => { for (let i = 0; i < 40; i++) { const r = rationalNumber(ctx.grade); if (!pos || r.v > 0) return r; } return { v: 1, text: '1' }; }, a = draw_(), c = draw_();
    const s = cmpSym(fix(a.v, 8), fix(c.v, 8)); return mc(`Compare. ${m(`${a.text} ___ ${c.text}`)}`, s, ['<', '>', '='].filter(x => x !== s), `${a.text} ≈ ${fix(a.v, 3)} and ${c.text} ≈ ${fix(c.v, 3)}.`.replace(/−/g, '-').replace(/-/g, MINUS), 3);
  }),
  R(/^Put rational numbers in order$/, () => () => {
    const items = []; const seen = new Set(); while (items.length < 4) { const r = rationalNumber(7), key = fix(r.v, 6); if (!seen.has(key)) { seen.add(key); items.push(r); } }
    const asc = Math.random() < 0.5, sorted = items.slice().sort((x, y) => (asc ? x.v - y.v : y.v - x.v)), key = a => a.map(i => i.text).join(', ');
    return mc(`Order from ${b(asc ? 'least to greatest' : 'greatest to least')}:<br>${m(key(items))}`, key(sorted), uniq([shuffle(sorted), shuffle(sorted), sorted.slice().reverse()].map(key)).filter(k => k !== key(sorted)), `${b(key(sorted))}.`);
  }),
  R(/^Convert between decimals and fractions or mixed numbers$/, () => () => {
    const d = pick([2, 4, 5, 8, 10, 20, 25]), w = ri(0, 4), n = ri(1, d - 1), x = w + n / d, [sn, sd] = simp(n, d), frac = w ? mixedStr(w, sn, sd) : fs(sn, sd);
    return Math.random() < 0.5 ? mc(`Write ${b(String(fix(x, 4)))} as a ${w ? 'mixed number' : 'fraction'} in lowest terms.`, frac, [w ? mixedStr(w, sd, sn > 1 ? sn : sn + 1) : fs(sd, sn), w ? mixedStr(w + 1, sn, sd) : fs(sn + 1, sd), w ? mixedStr(w, sn, sd + 1) : fs(sn, sd + 1)].filter(v_ => v_ !== frac), `${fix(x, 4)} = ${b(frac)}.`, 4) : mc(`Write ${b(frac)} as a decimal.`, String(fix(x, 4)), uniq([String(fix(x + 0.1, 4)), String(fix(n / (d + w), 4)), String(fix(x * 10, 4))]).filter(v_ => v_ !== String(fix(x, 4))), `${frac} = ${b(fix(x, 4))}.`, 4);
  }),
  R(/^Round decimals and mixed numbers$/, () => () => {
    const x = ri(100, 999) / 100, place = pick([['whole number', 0], ['tenth', 1]]);
    return num(`Round ${b(dec(x, 2))} to the nearest ${b(place[0])}.`, fix(Math.round(x * 10 ** place[1]) / 10 ** place[1], place[1]), `${b(fix(Math.round(x * 10 ** place[1]) / 10 ** place[1], place[1]))}.`);
  }),
  R(/^Add and subtract positive and negative decimals$|^Multiply and divide positive and negative decimals$|^Evaluate numerical expressions involving positive and negative decimals$/, (mt, ctx) => () => {
    const a = nz(-99, 99) / 10, c = nz(-99, 99) / 10, mul = /Multiply/.test(ctx.title), div = mul && Math.random() < 0.5, p = x => (x < 0 ? `(${S(fix(x, 1))})` : String(x));
    if (/Evaluate/.test(ctx.title)) { const d = nz(-9, 9) / 10, r = fix(a + c * d, 3); return num(`${m(`${S(fix(a, 1))} + ${p(c)} × ${p(d)} = ?`)}`, r, `Multiply first, then add: ${b(S(r))}.`); }
    if (div) { const q = nz(-40, 40) / 10, d = nz(-9, 9) / 10; const prod = fix(q * d, 3); return num(`${m(`${S(prod)} ÷ ${p(d)} = ?`)}`, q, `${b(S(q))}.`); }
    const r = mul ? fix(a * c, 3) : pick([1, -1]) === 1 ? fix(a + c, 3) : fix(a - c, 3), sym = mul ? '×' : (r === fix(a + c, 3) ? '+' : '−');
    return num(`${m(`${S(fix(a, 1))} ${sym} ${p(c)} = ?`)}`, r, `${b(S(r))}.`);
  }),
  R(/^Add and subtract rational numbers$|^Multiply and divide rational numbers$|^Add and subtract rational numbers: word problems$|^Multiply and divide rational numbers: word problems$|^Apply addition, subtraction, multiplication and division rules$/, (mt, ctx) => () => {
    const [d1, d2] = [pick([2, 3, 4, 5]), pick([2, 3, 4, 5])], n1 = nz(-7, 7), n2 = nz(-7, 7), mul = /Multiply|multiplication/.test(ctx.title), a = n1 / d1, c = n2 / d2; if (Math.abs(n1) >= d1 * 2 || Math.abs(n2) >= d2 * 2) return null;
    const r = mul ? a * c : a + c, [rn, rd] = (() => { const D = mul ? d1 * d2 : lcm(d1, d2), N = mul ? n1 * n2 : n1 * (D / d1) + n2 * (D / d2); const g = gcd(Math.abs(N), D) || 1; return [N / g, D / g]; })();
    const ans = rn === 0 ? '0' : rd === 1 ? S(rn) : (rn < 0 ? MINUS : '') + Math.abs(rn) + '/' + rd, fr = (n, d) => (n < 0 ? MINUS : '') + Math.abs(n) + '/' + d;
    const wrong = (rd === 1 ? [S(rn + 1), S(rn - 1), S(-rn), S(rn + 2)] : [fr(rn + 1, rd), fr(rn - 1, rd) , fr(-rn, rd), fr(rn, rd + 1)]).filter(x => x !== ans && !/^[−-]?0\//.test(x));
    return mc(`${m(`${stack(S(n1), d1)} ${mul ? '×' : '+'} ${stack(S(n2), d2)}`)} = ?`, ans, wrong.slice(0, 3), `${mul ? 'Multiply' : 'Add'} the fractions: ${b(ans)}.`, 4);
  }),
  R(/^Distance between rational numbers on a number line$/, () => () => {
    const a = ri(-12, 12) / 2, c = ri(-12, 12) / 2; if (a === c) return null;
    return num(`How far apart are ${b(S(a))} and ${b(S(c))} on a number line?`, Math.abs(a - c), `|${S(a)} − ${P(c)}| = ${b(Math.abs(a - c))}.`);
  }),
  R(/^Evaluate numerical expressions involving rational numbers$|^Evaluate numerical expressions involving fractions$/, () => () => {
    const d = pick([2, 3, 4, 5]), n = ri(1, d - 1), k = ri(2, 6), c = ri(1, 5), res = (n * k) / d + c;
    if (!Number.isInteger(res * d)) return null; const [rn, rd] = simp(n * k + c * d, d);
    return mc(`${m(`${stack(n, d)} × ${k} + ${c}`)} = ?`, rd === 1 ? String(rn) : fs(rn, rd), [fs(rn + 1, rd), fs(rn, rd + 1), fs(n * k, d)].filter(x => x !== (rd === 1 ? String(rn) : fs(rn, rd)) && !x.endsWith('/1')), `Multiply first, then add: ${b(rd === 1 ? rn : fs(rn, rd))}.`, 4);
  }),

  /* ===== exponents, roots, scientific notation ===== */
  R(/^Powers with negative bases$/, () => () => {
    const base = -ri(2, 5), e = ri(2, 4), val = base ** e;
    return num(`${m(`(${S(base)})<sup>${e}</sup> = ?`)}`, val, `${Array(e).fill(P(base)).join(' × ')} = ${b(S(val))}. An ${e % 2 ? 'odd' : 'even'} power of a negative number is ${e % 2 ? 'negative' : 'positive'}.`);
  }),
  R(/^Powers with decimal and fractional bases$/, () => () => {
    const useF = Math.random() < 0.5, e = pick([2, 3]);
    if (useF) { const [n, d] = pick([[1, 2], [2, 3], [1, 3], [3, 4]]); return mc(`${m(`(${stack(n, d)})<sup>${e}</sup>`)} = ?`, fs(n ** e, d ** e), [fs(n * e, d * e), fs(n ** e, d), fs(n, d ** e)].filter(x => x !== fs(n ** e, d ** e)), `Raise the numerator and the denominator to the power: ${b(fs(n ** e, d ** e))}.`, 4); }
    const x = pick([0.1, 0.2, 0.3, 0.5, 1.5]); return num(`${m(`${x}<sup>${e}</sup> = ?`)}`, fix(x ** e, 4), `${Array(e).fill(x).join(' × ')} = ${b(fix(x ** e, 4))}.`);
  }),
  R(/^Solve equations with variable exponents$/, () => () => {
    const base = ri(2, 5), e = ri(2, 4);
    return num(`${m(`${base}<sup>x</sup> = ${fmt(base ** e)}`)} Solve for x.`, e, `${base}^${e} = ${fmt(base ** e)}, so x = ${b(e)}.`);
  }),
  R(/^Square roots of perfect squares$|^Relationship between squares and square roots$|^Estimate square roots$|^Solve equations involving squares and square roots$/, (mt, ctx) => () => {
    const n = ri(2, 15);
    if (/Estimate/.test(ctx.title)) { const x = n * n + ri(1, 2 * n), r = Math.sqrt(x), lo = Math.floor(r); return mc(`Between which two integers is ${m(`√${x}`)}?`, `${lo} and ${lo + 1}`, [`${lo - 1} and ${lo}`, `${lo + 1} and ${lo + 2}`, `${Math.round(x / 10)} and ${Math.round(x / 10) + 1}`].filter(v_ => v_ !== `${lo} and ${lo + 1}` && !v_.startsWith('0') && !v_.includes('-')), `${lo}² = ${lo * lo} and ${lo + 1}² = ${(lo + 1) ** 2}.`, 4); }
    if (/Relationship/.test(ctx.title)) return num(`${m(`(√${n * n})²`)} = ?`, n * n, `Squaring undoes a square root: ${b(n * n)}.`);
    if (/Solve/.test(ctx.title)) return num(`${m(`x² = ${n * n}`)}. What is the positive solution for x?`, n, `√${n * n} = ${b(n)}.`);
    return num(`${m(`√${n * n} = ?`)}`, n, `${n} × ${n} = ${n * n}, so the square root is ${b(n)}.`);
  }),
  R(/^Convert between standard and scientific notation$/, () => () => {
    const big_ = Math.random() < 0.6, mant = ri(11, 99) / 10, e = ri(3, 8), digs = String(Math.round(mant * 10));
    const text = big_ ? digs + '0'.repeat(e - 1) : '0.' + '0'.repeat(e - 1) + digs, shownE = big_ ? e : -e, sci = `${mant} × 10<sup>${S(shownE)}</sup>`;
    return mc(`Write ${b(big_ ? fmt(+text) : text)} in scientific notation.`, sci, uniq([`${mant} × 10<sup>${S(-shownE)}</sup>`, `${fix(mant * 10, 1)} × 10<sup>${S(shownE)}</sup>`, `${mant} × 10<sup>${S(shownE + (big_ ? 1 : -1))}</sup>`]), `Move the decimal point to get ${mant}, then count the places: ${b(sci)}.`, 4);
  }),
  R(/^Compare numbers written in scientific notation$/, () => () => {
    const a = ri(11, 99) / 10, c = ri(11, 99) / 10, e1 = ri(2, 8), e2 = ri(2, 8), va = a * 10 ** e1, vc = c * 10 ** e2, s = cmpSym(fix(va, 6), fix(vc, 6));
    return mc(`Compare. ${m(`${a} × 10<sup>${e1}</sup> ___ ${c} × 10<sup>${e2}</sup>`)}`, s, ['<', '>', '='].filter(x => x !== s), `Compare the exponents first, then the front numbers.`, 3);
  })
];
export { evalExpr, S, P, nz, rationalNumber };
