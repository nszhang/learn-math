/* Number theory, exponents, expressions, equations, inequalities, integers, ratios, percents, multi-step word problems (Grades 2–5). */
import {
  ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, num, mc, yesNo, near, svg, C, NAMES, thing, gcd, lcm, emojiRow, big, numberLine, table, MINUS
} from '../h.js';
import { R } from '../engine.js';
import { decGrid, tenthsBar } from './decimals.js';
import { stack, fs, simp } from './fractions.js';

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const isPrime = n => n > 1 && PRIMES.includes(n) || (n > 97 && ![...Array(Math.floor(Math.sqrt(n)) - 1).keys()].some(i => n % (i + 2) === 0));
const factorsOf = n => range(1, n).filter(k => n % k === 0);
const primeFactors = n => { const out = []; let x = n; for (let p = 2; x > 1; p++) while (x % p === 0) { out.push(p); x /= p; } return out; };
const sup = (a, e) => `${a}<sup>${e}</sup>`;
const sy = s => s.replace(/-/g, MINUS);
const v = x => (x < 0 ? MINUS + Math.abs(x) : String(x));

/* ---------- inequality number line ---------- */
function ineqLine({ val, dir, closed, lo = -2, hi = 12 }) {
  const w = 440, pad = 22, X = t => pad + ((t - lo) / (hi - lo)) * (w - 2 * pad), y = 30;
  let inner = `<line x1="${pad - 8}" y1="${y}" x2="${w - pad + 8}" y2="${y}" stroke="${C.ink}" stroke-width="2"/>`;
  for (let t = lo; t <= hi; t++) inner += `<line x1="${X(t)}" y1="${y - 6}" x2="${X(t)}" y2="${y + 6}" stroke="${C.ink}"/><text x="${X(t)}" y="${y + 22}" font-size="11" text-anchor="middle" fill="${C.ink}">${fmt(t)}</text>`;
  const end = dir === 'right' ? w - pad + 8 : pad - 8;
  inner += `<line x1="${X(val)}" y1="${y}" x2="${end}" y2="${y}" stroke="${C.red}" stroke-width="5"/><polygon points="${end},${y} ${end + (dir === 'right' ? -10 : 10)},${y - 7} ${end + (dir === 'right' ? -10 : 10)},${y + 7}" fill="${C.red}"/>`;
  inner += `<circle cx="${X(val)}" cy="${y}" r="6" fill="${closed ? C.red : '#fff'}" stroke="${C.red}" stroke-width="3"/>`;
  return svg(w, 58, inner, 'aria-label="inequality on a number line"');
}
const ineqText = (dir, closed, val, vr = 'x') => `${vr} ${dir === 'right' ? (closed ? '≥' : '>') : closed ? '≤' : '<'} ${v(val)}`;
const ineqWhy = (dir, closed) => `${closed ? 'A filled circle includes the number' : 'An open circle does not include the number'} and the shading goes ${dir}.`;

/* ---------- strip (bar) diagram ---------- */
const strip = (parts, total, w = 280) => {
  const sum_ = parts.reduce((a, c) => a + (typeof c.v === 'number' ? c.v : 1), 0), unit = w / Math.max(sum_, 1); let x = 4, inner = '';
  parts.forEach((p, i) => { const pw = (typeof p.v === 'number' ? p.v : 1) * unit; inner += `<rect x="${x}" y="22" width="${pw}" height="30" fill="${i % 2 ? '#fde68a' : '#c7d2fe'}" stroke="${C.ink}" stroke-width="2"/><text x="${x + pw / 2}" y="42" font-size="13" text-anchor="middle" font-weight="700" fill="${C.ink}">${p.label}</text>`; x += pw; });
  inner += `<path d="M4,16 H${x} " stroke="${C.ink}" stroke-width="1.5"/><text x="${(x + 4) / 2}" y="11" font-size="13" text-anchor="middle" font-weight="700" fill="${C.red}">${total}</text>`;
  return svg(x + 10, 58, inner, 'aria-label="strip diagram"');
};

/* ---------- multi-step stories ---------- */
function twoStep() {
  const nm = pick(NAMES), k = pick(['shop', 'trip', 'books', 'team', 'bake']);
  if (k === 'shop') { const n = ri(2, 6), p = ri(2, 9), paid = Math.ceil((n * p + ri(1, 9)) / 10) * 10; return { text: `${nm} buys ${n} notebooks for $${p} each and pays with $${paid}. How much change does ${nm} get?`, ans: paid - n * p, expl: `${n} × ${p} = ${n * p}, then ${paid} − ${n * p} = ${paid - n * p}.` }; }
  if (k === 'trip') { const a = ri(2, 5), p = ri(8, 20), extra = ri(5, 30); return { text: `A class trip needs ${a} buses that each cost $${p * 10}. Another $${extra} is paid for snacks. What is the total cost?`, ans: a * p * 10 + extra, expl: `${a} × ${p * 10} = ${a * p * 10}, then + ${extra} = ${a * p * 10 + extra}.` }; }
  if (k === 'books') { const a = ri(20, 60), c = ri(10, 25), d = ri(5, 15); return { text: `${nm} has ${a} books. ${nm} gives away ${c} and then buys ${d} more. How many books does ${nm} have now?`, ans: a - c + d, expl: `${a} − ${c} = ${a - c}, then + ${d} = ${a - c + d}.` }; }
  if (k === 'team') { const g = ri(3, 6), per = ri(4, 8), left = ri(1, 5); return { text: `There are ${g} teams with ${per} players each. ${left} players leave. How many players are left?`, ans: g * per - left, expl: `${g} × ${per} = ${g * per}, then − ${left} = ${g * per - left}.` }; }
  const trays = ri(3, 8), per = ri(6, 12), eaten = ri(3, 10); return { text: `${nm} bakes ${trays} trays of ${per} cookies and eats ${eaten}. How many cookies are left?`, ans: trays * per - eaten, expl: `${trays} × ${per} = ${trays * per}, then − ${eaten} = ${trays * per - eaten}.` };
}
const reasonable = (s) => { const ans = s.ans, good = String(ans), bad = uniq([ans * 10, Math.max(1, Math.round(ans / 10)), ans + ri(40, 90)]).map(String).filter(x => x !== good); return mc(`${s.text}<br>Which answer is the most reasonable?`, good, bad.concat([String(ans * 100)]).slice(0, 3), `Estimate the problem: about ${b(ans)}.`, 4); };

export const ALGEBRA_RULES = [
  /* ===== early leftovers ===== */
  R(/^Word problems with (change|start) unknown - up to (10|20)$/, mt => () => {
    const lim = +mt[2], a = ri(1, lim - 2), c = ri(1, lim - a), sub = Math.random() < 0.5, nm = pick(NAMES), [sg, pl] = thing();
    if (mt[1] === 'change') return sub ? num(`${nm} had ${a + c} ${pl}. After giving some away, ${nm} has ${a} left. How many did ${nm} give away?`, c, `${a + c} − ${a} = ${b(c)}.`) : num(`${nm} had ${a} ${pl} and got some more. Now ${nm} has ${a + c}. How many did ${nm} get?`, c, `${a + c} − ${a} = ${b(c)}.`);
    return sub ? num(`${nm} had some ${pl} and gave away ${c}. Now ${nm} has ${a}. How many did ${nm} have at the start?`, a + c, `${a} + ${c} = ${b(a + c)}.`) : num(`${nm} had some ${pl} and got ${c} more. Now ${nm} has ${a + c}. How many did ${nm} have at the start?`, a, `${a + c} − ${c} = ${b(a)}.`);
  }),
  R(/^Purchases: do you have enough money\?$/, () => () => {
    const price = pick([10, 25, 30, 40, 50, 75]), coins = [5, 10, 25].flatMap(c => Array(ri(0, 4)).fill(c)), have = sum(coins); if (!coins.length || coins.length > 10) return null;
    return yesNo(`A toy costs ${b(price + '¢')}. You have coins worth ${b(have + '¢')}. Do you have enough money?`, have >= price, `${have}¢ is ${have >= price ? 'at least' : 'less than'} ${price}¢.`, ['Yes', 'No']);
  }),
  R(/^Compare numbers up to 100 using number lines$/, () => () => {
    const a = ri(1, 9) * 10, c = ri(1, 9) * 10; if (a === c) return null;
    return mc(`${numberLine({ min: 0, max: 100, step: 10, labelEvery: 5, marks: [{ v: a, label: 'A', color: C.red }, { v: c, label: 'B', color: C.blue }] })}Which is true?`, a > c ? 'A > B' : 'A < B', [a > c ? 'A < B' : 'A > B'], `The point farther right is greater.`, 2);
  }),
  R(/^Which sign \(\+ or -\) makes the number sentence true\? - up to 100$/, () => () => {
    const a = ri(20, 80), c = ri(5, 19), add = Math.random() < 0.5, r = add ? a + c : a - c;
    return mc(`Which sign makes the number sentence true? ${m(`${a} ___ ${c} = ${r}`)}`, add ? '+' : '−', [add ? '−' : '+'], `${a} ${add ? '+' : '−'} ${c} = ${r}.`, 2);
  }),
  R(/^Identify the mode$/, () => () => {
    const vals = Array.from({ length: ri(6, 9) }, () => ri(1, 6)), c = {}; vals.forEach(x => (c[x] = (c[x] || 0) + 1)); const mx = Math.max(...Object.values(c)), modes = Object.keys(c).filter(k => c[k] === mx); if (modes.length !== 1) return null;
    return num(`<div class="math">${vals.join(', ')}</div>Which number appears ${b('most often')} (the mode)?`, +modes[0], `${modes[0]} appears ${mx} times: ${b(modes[0])}.`);
  }),
  R(/^Count equal groups$/, () => () => {
    const g = ri(2, 5), per = ri(2, 6), [, , e] = thing(), boxes = Array.from({ length: g }, () => `<span style="display:inline-block;border:2px solid #94a3b8;border-radius:8px;padding:4px 8px;margin:4px;font-size:22px">${e.repeat(per)}</span>`).join('');
    return num(`${boxes}<br>There are ${b(g)} equal groups. How many ${e} are there in all?`, g * per, `${g} groups of ${per} = ${b(g * per)}.`);
  }),
  R(/^Perimeter: word problems$/, () => () => {
    const l = ri(4, 18), w = ri(3, 12), nm = pick(NAMES);
    return num(`${nm} puts a fence around a rectangular garden that is ${b(l + ' m')} long and ${b(w + ' m')} wide. How much fence is needed? (m)`, 2 * (l + w), `2 × (${l} + ${w}) = ${b(2 * (l + w))} m.`);
  }),
  R(/^Whole numbers on number lines$/, () => () => {
    const step = pick([10000, 50000, 100000]), base = ri(0, 4) * step * 10, v_ = base + ri(1, 9) * step;
    return mc(`${numberLine({ min: base, max: base + 10 * step, step, labelEvery: 5, marks: [{ v: v_, label: '?' }], width: 520, fmtLabel: x => fmt(x) })}What number is the point at?`, fmt(v_), near(v_ / step, 5, 3, { min: 1 }).map(k => fmt(base + k * step)), `Each tick is ${fmt(step)}. The point is at ${b(fmt(v_))}.`, 4);
  }),
  R(/^Which two-dimensional figure is being described\?$/, () => () => {
    const q = pick([['3 sides and 3 vertices', 'triangle'], ['4 equal sides and 4 right angles', 'square'], ['5 sides', 'pentagon'], ['6 sides', 'hexagon'], ['8 sides', 'octagon'], ['4 sides with 2 pairs of equal opposite sides and 4 right angles', 'rectangle'], ['no sides and no corners', 'circle']]);
    return mc(`Which two-dimensional figure is described? ${b(q[0])}`, q[1], ['triangle', 'square', 'pentagon', 'hexagon', 'octagon', 'rectangle', 'circle'].filter(x => x !== q[1]), `It is a ${b(q[1])}.`, 4);
  }),
  R(/^Distributive property: find the missing factor$/, () => () => {
    const a = ri(2, 9), c = ri(2, 5) * 10, d = ri(3, 9);
    return num(`${m(`${a} × ${c + d} = (${a} × ${c}) + (${a} × ___)`)}`, d, `Split ${c + d} into ${c} + ${d}: the missing factor is ${b(d)}.`);
  }),
  R(/^Unit rates and equivalent rates$|^Unit rates$|^Equivalent rates$/, (mt, ctx) => () => {
    // whole-dollar prices that make sense for the item
    const [nm, p] = pick([['notebooks', ri(2, 6)], ['comic books', ri(3, 8)], ['puzzles', ri(8, 20)], ['books', ri(8, 25)], ['T-shirts', ri(10, 25)], ['balls', ri(4, 15)], ['movie tickets', ri(8, 16)], ['sandwiches', ri(4, 9)]]), n = ri(2, 9);
    if (/Equivalent/.test(ctx.title)) { const k = ri(2, 4); return num(`${n} ${nm} cost $${n * p}. At the same rate, how much do ${n * k} ${nm} cost? ($)`, n * p * k, `One costs $${p}, so ${n * k} cost ${n * k} × ${p} = ${b('$' + n * k * p)}.`); }
    return num(`${n} ${nm} cost $${n * p}. What is the cost of ${b('1')} ${nm.replace(/ches$/, 'ch').replace(/s$/, '')}? ($)`, p, `${n * p} ÷ ${n} = ${b('$' + p)}.`);
  }),
  R(/^Write numerical expressions: one operation$|^Write numerical expressions$/, (mt, ctx) => () => {
    const a = ri(3, 12), c = ri(2, 9), q = pick([[`${c} more than ${a}`, `${a} + ${c}`, [`${c} + ${a + 1}`.replace(/^\d+ \+ /, `${a} − `), `${a} − ${c}`, `${c} × ${a}`]], [`${c} less than ${a + c}`, `${a + c} − ${c}`, [`${c} − ${a + c}`, `${a + c} + ${c}`, `${a + c} × ${c}`]], [`${c} times ${a}`, `${c} × ${a}`, [`${c} + ${a}`, `${a} − ${c}`, `${a} ÷ ${c}`]], [`${a * c} divided by ${c}`, `${a * c} ÷ ${c}`, [`${c} ÷ ${a * c}`, `${a * c} × ${c}`, `${a * c} − ${c}`]], [`the sum of ${a} and ${c}, times ${c}`, `(${a} + ${c}) × ${c}`, [`${a} + ${c} × ${c}`, `${a} + ${c} + ${c}`, `(${a} − ${c}) × ${c}`]]]);
    return mc(`Which expression matches ${b(q[0])}?`, q[1], q[2].filter(x => x !== q[1]), `${q[0]} is written ${b(q[1])}.`, 4);
  }),

  /* ===== number theory ===== */
  R(/^Prime and composite numbers$/, (mt, ctx) => () => {
    const max = ctx.grade <= 3 ? 50 : 100, n = ri(4, max), pr = PRIMES.includes(n);
    return mc(`Is ${b(n)} prime or composite?`, pr ? 'Prime' : 'Composite', [pr ? 'Composite' : 'Prime'], pr ? `${n} has only 2 factors: 1 and ${n}.` : `${n} has more than 2 factors, for example ${factorsOf(n).filter(k => k > 1 && k < n)[0]} × ${n / factorsOf(n).filter(k => k > 1 && k < n)[0]}.`, 2);
  }),
  R(/^Prime factorization$/, () => () => {
    const n = pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 60, 72]), pf = primeFactors(n), s = pf.join(' × ');
    const bad = [primeFactors(n + 2).join(' × '), `${factorsOf(n)[1]} × ${n / factorsOf(n)[1]}`, pf.map((x, i) => (i === 0 ? x + 1 : x)).join(' × ')].filter(x => x !== s && !/^\d+ × \d+$/.test(x) || /^\d+ × \d+$/.test(x) && x !== s);
    return mc(`Which is the prime factorization of ${b(n)}?`, s, uniq(bad).filter(x => x !== s), `${n} = ${b(s)}, and every factor is prime.`, 4);
  }),
  R(/^Identify factors$/, () => () => {
    const n = ri(12, 60), f = factorsOf(n).filter(k => k > 1 && k < n); if (!f.length) return null; const ans = pick(f), nonf = range(2, 12).filter(k => n % k !== 0);
    return mc(`Which number is a factor of ${b(n)}?`, String(ans), sample(nonf, 3).map(String), `${n} ÷ ${ans} = ${n / ans}, so ${b(ans)} is a factor.`, 4);
  }),
  R(/^Find all the factor pairs of a number$/, () => () => {
    const n = pick([12, 16, 18, 20, 24, 30, 36]), pairs = factorsOf(n).filter(k => k * k <= n).map(k => `${k} × ${n / k}`);
    return num(`How many different ${b('factor pairs')} does ${b(n)} have? (like 1 × ${n})`, pairs.length, `The pairs are ${pairs.join(', ')}: ${b(pairs.length)} pairs.`);
  }),
  R(/^Greatest common factor$/, () => () => {
    const g = pick([2, 3, 4, 5, 6, 8, 10, 12]), a = g * ri(2, 6), c = g * ri(2, 6); if (a === c) return null; const G = gcd(a, c);
    return num(`What is the greatest common factor of ${b(a)} and ${b(c)}?`, G, `The biggest number that divides both is ${b(G)}.`);
  }),
  R(/^Squares up to 100$/, () => () => { const n = ri(2, 10); return num(`${m(`${n} × ${n}`)} = ?`, n * n, `${n} × ${n} = ${b(n * n)}.`); }),
  R(/^Age puzzles$/, () => () => {
    const [x, y] = sample(NAMES, 2), a = ri(5, 12), d = ri(2, 6);
    return num(`${x} is ${a} years old. ${y} is ${d} years older than ${x}. What is the sum of their ages?`, a + a + d, `${y} is ${a + d}. ${a} + ${a + d} = ${b(2 * a + d)}.`);
  }),

  /* ===== exponents ===== */
  R(/^Understanding exponents$/, () => () => {
    const base = ri(2, 6), e = ri(2, 5);
    return num(`${m(`${Array(e).fill(base).join(' × ')} = ${sup(base, '___')}`)}`, e, `${base} is multiplied by itself ${e} times: ${b(e)}.`);
  }),
  R(/^Evaluate powers$/, () => () => {
    const base = ri(2, 9), e = base <= 3 ? ri(2, 5) : base <= 5 ? ri(2, 3) : 2;
    return num(`${m(`${sup(base, e)} = ?`)}`, base ** e, `${Array(e).fill(base).join(' × ')} = ${b(base ** e)}.`);
  }),
  R(/^Write powers of ten with exponents$/, () => () => {
    const e = ri(2, 6);
    return num(`${m(`${fmt(10 ** e)} = ${sup(10, '___')}`)}`, e, `${fmt(10 ** e)} has ${e} zeros: ${b(e)}.`);
  }),

  /* ===== numerical expressions & order of operations ===== */
  R(/^Evaluate numerical expressions$|^Perform multiple operations with whole numbers$|^Understanding parentheses$/, (mt, ctx) => () => {
    const a = ri(2, 12), c = ri(2, 9), d = ri(2, 9), form = pick(['a+b*c', '(a+b)*c', 'a*b-c', 'a-b+c', '(a-b)*c']);
    let ex, r;
    if (form === 'a+b*c') { ex = `${a} + ${c} × ${d}`; r = a + c * d; } else if (form === '(a+b)*c') { ex = `(${a} + ${c}) × ${d}`; r = (a + c) * d; } else if (form === 'a*b-c') { ex = `${a} × ${c} − ${d}`; r = a * c - d; } else if (form === 'a-b+c') { if (a < c) return null; ex = `${a} − ${c} + ${d}`; r = a - c + d; } else { if (a <= c) return null; ex = `(${a} − ${c}) × ${d}`; r = (a - c) * d; }
    if (/Understanding parentheses/.test(ctx.title) && !ex.includes('(')) return null;
    return num(`${m(`${ex} = ?`)}`, r, `Follow the order of operations: ${b(r)}.`);
  }),
  R(/^Evaluate numerical expressions with parentheses in different places$/, () => () => {
    const a = ri(2, 9), c = ri(2, 9), d = ri(2, 9), opts = [[`(${a} + ${c}) × ${d}`, (a + c) * d], [`${a} + (${c} × ${d})`, a + c * d]];
    const [ex, r] = pick(opts);
    return num(`${m(`${ex} = ?`)}`, r, `Do the part in parentheses first: ${b(r)}.`);
  }),
  R(/^Identify mistakes involving the order of operations$/, () => () => {
    const a = ri(2, 9), c = ri(2, 9), d = ri(2, 9), right = a + c * d, wrong = (a + c) * d; if (right === wrong) return null;
    return mc(`${m(`${a} + ${c} × ${d}`)} was solved as ${b(wrong)}. What mistake was made?`, 'Added before multiplying', ['Multiplied before adding', 'Subtracted instead of added', 'No mistake was made'], `Multiplication comes before addition. The correct answer is ${b(right)}.`, 4);
  }),
  R(/^Numerical operations: find the missing sign$|^Numerical operations$/, () => () => {
    const a = ri(2, 12), c = ri(2, 9), op = pick(['+', '−', '×', '÷']); let x = a, y = c; if (op === '−' && x <= y) [x, y] = [y + 1, y]; if (op === '÷') { x = c * ri(2, 9); y = c; }
    const r = op === '+' ? x + y : op === '−' ? x - y : op === '×' ? x * y : x / y; const poss = ['+', '−', '×', '÷'].filter(s => { const q = s === '+' ? x + y : s === '−' ? x - y : s === '×' ? x * y : x / y; return q === r; }); if (poss.length > 1) return null;
    return mc(`Which sign makes the sentence true? ${m(`${x} ___ ${y} = ${r}`)}`, op, ['+', '−', '×', '÷'].filter(s => s !== op), `${x} ${op} ${y} = ${r}.`, 4);
  }),
  R(/^Multi-step inequalities$|^Solve inequalities using estimation$/, (mt, ctx) => () => {
    if (/estimation/.test(ctx.title)) { const a = ri(120, 480), c = ri(120, 480), t = Math.round((a + c) / 100) * 100 + pick([-100, 0, 100]), A = Math.round(a / 100) * 100, Cc = Math.round(c / 100) * 100; if (A + Cc === t) return null; return yesNo(`Without adding exactly, is ${m(`${a} + ${c}`)} greater than ${b(t)}? (Estimate by rounding to the nearest hundred.)`, a + c > t, `${a} + ${c} = ${a + c}, which is ${a + c > t ? 'greater' : 'not greater'} than ${t}.`, ['Yes', 'No']); }
    const a = ri(2, 9), c = ri(2, 9), d = ri(2, 9), r = a + c * d, cmp = r + pick([-3, 0, 3, 5]), s = r === cmp ? '=' : r > cmp ? '>' : '<';
    return mc(`Choose the symbol. ${m(`${a} + ${c} × ${d} ___ ${cmp}`)}`, s, ['<', '>', '='].filter(x => x !== s), `${a} + ${c} × ${d} = ${r}, and ${r} ${s} ${cmp}.`, 3);
  }),
  R(/^Write numerical expressions for word problems$/, () => () => {
    const nm = pick(NAMES), a = ri(3, 9), c = ri(2, 9), d = ri(2, 9);
    return mc(`${nm} buys ${a} packs of ${c} pencils and then loses ${d} pencils. Which expression shows how many pencils ${nm} has left?`, `${a} × ${c} − ${d}`, [`${a} + ${c} − ${d}`, `${a} × (${c} − ${d})`, `${a} × ${c} + ${d}`], `${a} packs of ${c} is ${a} × ${c}, then subtract ${d}.`, 4);
  }),

  /* ===== word problems ===== */
  R(/^Two-step mixed operation word problems$|^Multi-step word problems$|^Multi-step word problems involving remainders$/, (mt, ctx) => () => {
    if (/remainders/.test(ctx.title)) { const per = ri(4, 9), total = per * ri(3, 9) + ri(1, per - 1), nm = pick(NAMES); return num(`${nm} packs ${total} cookies into boxes that hold ${per} each. How many boxes does ${nm} need so that every cookie is packed?`, Math.ceil(total / per), `${total} ÷ ${per} = ${Math.floor(total / per)} remainder ${total % per}, so one more box is needed: ${b(Math.ceil(total / per))}.`); }
    const s = twoStep(); return num(s.text, s.ans, s.expl + ` The answer is ${b(s.ans)}.`);
  }),
  R(/^(?:Two-step word problems|Multi-step word problems): identify reasonable answers$|^Multi-step word problems: identify reasonable answers$/, () => () => reasonable(twoStep())),
  R(/^Word problems with extra or missing information$/, () => () => {
    const nm = pick(NAMES), a = ri(3, 9), c = ri(10, 40), extra = pick(['The bags are red.', `${nm} walked to the store.`, 'It is a sunny day.']);
    return mc(`${nm} buys ${a} bags of apples with ${c} apples in each bag. ${extra} How many apples does ${nm} buy?<br>Which fact is ${b('not needed')} to solve the problem?`, extra, [`${nm} buys ${a} bags.`, `Each bag has ${c} apples.`], `You only need the number of bags and the apples per bag: ${a} × ${c}.`, 3);
  }),
  R(/^(?:Solve word problems using guess-and-check|Guess-and-check problems)$/, () => () => {
    const a = ri(3, 12), c = ri(2, 12); const s = a + c, p = a * c; if (a === c) return null;
    return num(`Two numbers have a sum of ${b(s)} and a product of ${b(p)}. What is the larger number?`, Math.max(a, c), `Try pairs that add to ${s}: ${Math.max(a, c)} × ${Math.min(a, c)} = ${p}. The larger number is ${b(Math.max(a, c))}.`);
  }),
  R(/^Multi-step word problems with strip diagrams$|^Use strip diagrams to represent and solve multi-step word problems$/, () => () => {
    const a = ri(10, 40), c = ri(10, 40), d = ri(5, 30), tot = a + c + d;
    return num(`${strip([{ label: a, v: a }, { label: c, v: c }, { label: '?', v: d }], tot)}The whole bar is ${b(tot)}. The first two parts are ${a} and ${c}. What is the third part?`, d, `${tot} − ${a} − ${c} = ${b(d)}.`);
  }),

  /* ===== variables & equations ===== */
  R(/^Write variable expressions(?:: word problems)?$/, (mt, ctx) => () => {
    const a = ri(2, 12), vr = pick(['n', 'x', 'p', 'k']), nm = pick(NAMES), q = pick([[`${a} more than a number ${vr}`, `${vr} + ${a}`, [`${vr} − ${a}`, `${a} − ${vr}`, `${a}${vr}`]], [`${a} less than a number ${vr}`, `${vr} − ${a}`, [`${a} − ${vr}`, `${vr} + ${a}`, `${a}${vr}`]], [`${a} times a number ${vr}`, `${a} × ${vr}`, [`${a} + ${vr}`, `${vr} ÷ ${a}`, `${vr} − ${a}`]], [`a number ${vr} divided by ${a}`, `${vr} ÷ ${a}`, [`${a} ÷ ${vr}`, `${a} × ${vr}`, `${vr} − ${a}`]]]);
    if (/word problems/.test(ctx.title)) { const t = pick([[`${nm} has ${vr} stickers and gets ${a} more. How many stickers does ${nm} have?`, `${vr} + ${a}`, [`${vr} − ${a}`, `${a} − ${vr}`, `${a}${vr}`]], [`${nm} buys ${a} pens that each cost $${vr}. What is the total cost?`, `${a} × ${vr}`, [`${a} + ${vr}`, `${vr} ÷ ${a}`, `${a} − ${vr}`]], [`${nm} shares ${vr} cookies equally among ${a} friends. How many does each friend get?`, `${vr} ÷ ${a}`, [`${a} ÷ ${vr}`, `${vr} × ${a}`, `${vr} − ${a}`]]]); return mc(t[0] + '<br>Which expression matches?', t[1], t[2], `The expression is ${b(t[1])}.`, 4); }
    return mc(`Which expression matches ${b(q[0])}?`, q[1], q[2], `${q[0]} is written ${b(q[1])}.`, 4);
  }),
  R(/^Evaluate variable expressions$/, () => () => {
    const x = ri(2, 9), a = ri(2, 6), c = ri(1, 9), form = pick([`${a}x + ${c}`, `${a}x − ${c}`, `x + ${a}`, `${a}x`]); const val = form.includes('+') && form.includes('x') && /^\d/.test(form) ? a * x + c : form.includes('−') ? a * x - c : form.startsWith('x') ? x + a : a * x; if (form.includes('−') && a * x - c < 0) return null;
    return num(`Evaluate ${m(form)} when ${b('x = ' + x)}.`, val, `Replace x with ${x}: ${b(val)}.`);
  }),
  R(/^Identify equations$/, () => () => {
    const a = ri(2, 9), c = ri(2, 9), eq_ = `${a} + x = ${a + c}`, notE = [`${a} + x`, `${a}x − ${c}`, `x + ${c}`];
    return mc(`Which of these is an ${b('equation')}?`, eq_, notE, `An equation has an equals sign: ${b(eq_)}.`, 4);
  }),
  R(/^Solve for the variable$|^Solve variable equations(?:: (?:addition and subtraction|multiplication and division))?$|^Solve equations with whole numbers$|^Solve for the variable: (?:addition and subtraction|multiplication and division)$/, (mt, ctx) => () => {
    const t = ctx.title, x = ri(2, 15), a = ri(2, 12), kind = /addition and subtraction/.test(t) ? pick(['+', '−']) : /multiplication and division/.test(t) ? pick(['×', '÷']) : pick(['+', '−', '×', '÷']);
    let eq_, ans = x; if (kind === '+') eq_ = `x + ${a} = ${x + a}`; else if (kind === '−') eq_ = `x − ${a} = ${x - a}`; else if (kind === '×') eq_ = `${a}x = ${a * x}`; else eq_ = `x ÷ ${a} = ${x}`, ans = x * a;
    if (kind === '−' && x - a < 0) return null; if (kind === '÷' && ans > 200) return null;
    return num(`Solve for ${b('x')}. ${m(eq_)}`, ans, `Use the inverse operation: x = ${b(ans)}.`);
  }),
  R(/^Write variable equations to represent word problems(?:: (?:addition and subtraction|multiplication and division))?$|^Write an equation from words$|^Write a one-step equation: word problems$/, (mt, ctx) => () => {
    const x = ri(2, 12), a = ri(2, 9), nm = pick(NAMES), q = pick([[`${nm} has some marbles. After finding ${a} more, ${nm} has ${x + a}. Let m be the starting number.`, `m + ${a} = ${x + a}`, [`m − ${a} = ${x + a}`, `${a}m = ${x + a}`, `m + ${x + a} = ${a}`]], [`${nm} buys ${a} packs with the same number p of cards in each. There are ${a * x} cards in all.`, `${a}p = ${a * x}`, [`p + ${a} = ${a * x}`, `p ÷ ${a} = ${a * x}`, `p − ${a} = ${a * x}`]], [`A rope was cut into ${a} equal pieces of ${x} cm each. Let L be the length of the rope.`, `L ÷ ${a} = ${x}`, [`L × ${a} = ${x}`, `L − ${a} = ${x}`, `L + ${a} = ${x}`]], [`${nm} had ${x + a} books and gave away b books. Now ${nm} has ${x}.`, `${x + a} − b = ${x}`, [`${x + a} + b = ${x}`, `b − ${x + a} = ${x}`, `${x + a}b = ${x}`]]]);
    return mc(`${q[0]}<br>Which equation matches?`, q[1], q[2], `The equation ${b(q[1])} fits the story.`, 4);
  }),
  R(/^Does x satisfy an equation\?$|^Which value makes the equation true\?$/, (mt, ctx) => () => {
    const x = ri(2, 12), a = ri(2, 9), eq_ = pick([`x + ${a} = ${x + a}`, `${a}x = ${a * x}`, `x − ${a} = ${x - a}`]); if (/x − /.test(eq_) && x - a < 0) return null;
    if (/Does/.test(ctx.title)) { const sat = Math.random() < 0.5, tryV = sat ? x : x + pick([1, -1, 2]); return yesNo(`Does ${b('x = ' + tryV)} make ${m(eq_)} true?`, tryV === x, tryV === x ? `Substitute: the equation is true.` : `Substitute x = ${tryV}: the sides are not equal.`, ['Yes', 'No']); }
    return mc(`Which value of x makes ${m(eq_)} true?`, String(x), [x + 1, x - 1 || 3, x + 2].map(String), `Substitute x = ${x}: the equation is true.`, 4);
  }),
  R(/^Model and solve equations using algebra tiles$|^Write and solve equations that represent diagrams$/, (mt, ctx) => () => {
    const x = ri(1, 9), a = ri(1, 6), sq = n => `<span style="font-size:20px;letter-spacing:2px">${'🟨'.repeat(n)}</span>`;
    if (/algebra tiles/.test(ctx.title)) return num(`<div>🟦 (one x-tile) + ${sq(a)}</div><div style="text-align:center;font-size:20px">=</div><div>${sq(x + a)}</div>Each 🟨 is 1. What is the value of the x-tile (🟦)?`, x, `Take ${a} units from both sides: ${x + a} − ${a} = ${b(x)}.`);
    return num(`${strip([{ label: 'x', v: x }, { label: a, v: a }], x + a)}The whole bar is ${b(x + a)}. One part is ${a} and the other is x. Solve for x.`, x, `x + ${a} = ${x + a}, so x = ${b(x)}.`);
  }),
  R(/^Which word problem matches the one-step equation\?$/, () => () => {
    const x = ri(2, 9), a = ri(2, 9), nm = pick(NAMES), eq_ = `${a}n = ${a * x}`;
    return mc(`Which word problem matches ${m(eq_)}?`, `${nm} buys ${a} packs with n pencils in each. There are ${a * x} pencils in all.`, [`${nm} has n pencils and gets ${a} more. Now there are ${a * x}.`, `${nm} shares ${a * x} pencils equally among n friends.`, `${nm} had ${a * x} pencils and lost n. Now ${nm} has ${a}.`], `${a} groups of n make ${a * x}: ${b(eq_)}.`, 4);
  }),

  /* ===== inequalities ===== */
  R(/^Solutions to inequalities$/, () => () => {
    const t = ri(2, 12), dir = pick(['>', '<', '≥', '≤']), pool = range(0, 15), sol = pool.filter(n => (dir === '>' ? n > t : dir === '<' ? n < t : dir === '≥' ? n >= t : n <= t)), non = pool.filter(n => !sol.includes(n));
    return mc(`Which number is a solution of ${m(`x ${dir} ${t}`)}?`, String(pick(sol)), sample(non, 3).map(String), `A solution makes the inequality true.`, 4);
  }),
  R(/^Graph inequalities on number lines$/, () => () => {
    const val_ = ri(1, 9), dir = pick(['right', 'left']), closed = Math.random() < 0.5, ineq = ineqText(dir, closed, val_), ans = `${closed ? 'Filled' : 'Open'} circle at ${val_}, shaded to the ${dir}`;
    const opts = [`${closed ? 'Open' : 'Filled'} circle at ${val_}, shaded to the ${dir}`, `${closed ? 'Filled' : 'Open'} circle at ${val_}, shaded to the ${dir === 'right' ? 'left' : 'right'}`, `${closed ? 'Open' : 'Filled'} circle at ${val_}, shaded to the ${dir === 'right' ? 'left' : 'right'}`];
    return mc(`How is ${m(ineq)} graphed on a number line?`, ans, opts, ineqWhy(dir, closed), 4);
  }),
  R(/^Write inequalities from number lines$/, () => () => {
    const val_ = ri(0, 8), dir = pick(['right', 'left']), closed = Math.random() < 0.5, ans = ineqText(dir, closed, val_);
    const opts = [ineqText(dir === 'right' ? 'left' : 'right', closed, val_), ineqText(dir, !closed, val_), ineqText(dir === 'right' ? 'left' : 'right', !closed, val_)];
    return mc(`${ineqLine({ val: val_, dir, closed })}Which inequality does the graph show?`, ans, opts, ineqWhy(dir, closed), 4);
  }),
  R(/^Solve one-step inequalities$|^Graph solutions to one-step inequalities$/, (mt, ctx) => () => {
    const x = ri(2, 12), a = ri(2, 9), kind = pick(['+', '−', '×']), rel = pick(['>', '<', '≥', '≤']);
    let lhs, rhs, sol; if (kind === '+') { lhs = `x + ${a}`; rhs = x + a; sol = x; } else if (kind === '−') { lhs = `x − ${a}`; rhs = x - a; sol = x; if (rhs < 0) return null; } else { lhs = `${a}x`; rhs = a * x; sol = x; }
    const ans = `x ${rel} ${sol}`;
    if (/Graph/.test(ctx.title)) { const dir = rel === '>' || rel === '≥' ? 'right' : 'left', closed = rel === '≥' || rel === '≤'; return mc(`Solve ${m(`${lhs} ${rel} ${rhs}`)}. Which graph shows the solution?`, `${closed ? 'Filled' : 'Open'} circle at ${sol}, shaded to the ${dir}`, [`${closed ? 'Open' : 'Filled'} circle at ${sol}, shaded to the ${dir}`, `${closed ? 'Filled' : 'Open'} circle at ${sol}, shaded to the ${dir === 'right' ? 'left' : 'right'}`, `${closed ? 'Filled' : 'Open'} circle at ${rhs}, shaded to the ${dir}`].filter(s => s !== `${closed ? 'Filled' : 'Open'} circle at ${sol}, shaded to the ${dir}`), `x ${rel} ${sol}, so ${ineqWhy(dir, closed).toLowerCase()}`, 4); }
    return mc(`Solve ${m(`${lhs} ${rel} ${rhs}`)}.`, ans, uniq([`x ${rel} ${rhs}`, `x ${rel === '>' ? '<' : rel === '<' ? '>' : rel === '≥' ? '≤' : '≥'} ${sol}`, `x ${rel} ${sol + a}`]).filter(s => s !== ans), `Use the inverse operation on both sides: ${b(ans)}.`, 4);
  }),

  /* ===== integers ===== */
  R(/^Integers on number lines$/, () => () => {
    const x = ri(-9, 9); if (x === 0) return null;
    return mc(`${numberLine({ min: -10, max: 10, step: 1, labelEvery: 2, marks: [{ v: x, label: '●' }] })}What integer does the point show?`, v(x), [v(-x), v(x + 1), v(x - 1)].filter(s => s !== v(x)), `The point is at ${b(v(x))}.`, 4);
  }),
  R(/^Graph integers on horizontal and vertical number lines$/, () => () => {
    const x = ri(-8, 8); if (!x) return null; const vert = Math.random() < 0.5;
    return mc(`${vert ? 'On a vertical number line, going up means numbers get greater.<br>' : ''}A point is ${b(Math.abs(x))} unit${Math.abs(x) > 1 ? 's' : ''} ${x > 0 ? (vert ? 'above' : 'to the right of') : vert ? 'below' : 'to the left of'} zero. Which integer is it?`, v(x), [v(-x), v(Math.abs(x) + 1), v(-(Math.abs(x) + 1))].filter(s => s !== v(x)), `${x > 0 ? 'Positive' : 'Negative'} ${Math.abs(x)}: ${b(v(x))}.`, 4);
  }),
  R(/^Understanding opposite integers$/, () => () => {
    const x = ri(1, 12) * pick([-1, 1]);
    return mc(`What is the ${b('opposite')} of ${b(v(x))}?`, v(-x), [v(x), v(x + 1), '0'].filter(s => s !== v(-x)), `Opposites are the same distance from 0 on opposite sides: ${b(v(-x))}.`, 4);
  }),
  R(/^Compare integers$/, () => () => {
    const a = ri(-9, 9), c = ri(-9, 9), s = a === c ? '=' : a > c ? '>' : '<';
    return mc(`Compare. ${m(`${v(a)} ___ ${v(c)}`)}`, s, ['<', '>', '='].filter(x => x !== s), `${v(a)} is ${s === '=' ? 'equal to' : s === '>' ? 'to the right of' : 'to the left of'} ${v(c)} on the number line.`, 3);
  }),
  R(/^Put integers in order$/, () => () => {
    const vals = uniq(Array.from({ length: 4 }, () => ri(-9, 9))); if (vals.length < 4) return null; const asc = Math.random() < 0.5, sorted = vals.slice().sort((x, y) => (asc ? x - y : y - x)), key = a => a.map(v).join(', ');
    return mc(`Order from ${b(asc ? 'least to greatest' : 'greatest to least')}:<br>${m(key(vals))}`, key(sorted), uniq([shuffle(sorted), shuffle(sorted), sorted.slice().reverse()].map(key)).filter(k => k !== key(sorted)), `${b(key(sorted))}.`);
  }),

  /* ===== ratios & rates ===== */
  R(/^Write a ratio using a colon$|^Write a ratio using a fraction$|^Write a ratio: word problems$|^Write a ratio$/, (mt, ctx) => () => {
    const a = ri(1, 9), c = ri(1, 9), [x, y] = sample(['red marbles', 'blue marbles', 'cats', 'dogs', 'boys', 'girls'], 2), colon = !/fraction/.test(ctx.title);
    const ans = colon ? `${a}:${c}` : fs(a, c), alts = colon ? [`${c}:${a}`, `${a}:${a + c}`, `${a + 1}:${c}`] : [fs(c, a), fs(a, a + c), fs(a + 1, c)];
    return mc(`A group has ${a} ${x} and ${c} ${y}. What is the ratio of ${b(x)} to ${b(y)}${colon ? '' : ' as a fraction'}?`, ans, alts.filter(s => s !== ans), `${x} to ${y} is ${b(ans)}.`, 4);
  }),
  R(/^Which model represents the ratio\?$/, () => () => {
    const a = ri(1, 5), c = ri(1, 5), mk = (p, q) => `${'🔴'.repeat(p)}${'🔵'.repeat(q)}`, opts = uniq([[a, c], [c, a], [a + 1, c], [a, c + 1]].map(x => x.join(','))).map(s => s.split(',').map(Number)); if (a === c) return null;
    const order = shuffle(opts), L = 'ABCD'[order.findIndex(o => o[0] === a && o[1] === c)];
    return mc(`Which picture shows the ratio of red to blue as ${b(`${a}:${c}`)}?<div>${order.map((o, i) => `<div style="font-size:20px"><b>${'ABCD'[i]}</b> ${mk(o[0], o[1])}</div>`).join('')}</div>`, L, 'ABCD'.slice(0, order.length).split('').filter(x => x !== L), `${a} red and ${c} blue is ${b(`${a}:${c}`)}.`, 4);
  }),
  R(/^Identify equivalent ratios$/, () => () => {
    const a = ri(1, 5), c = ri(1, 5), k = ri(2, 4); if (a === c) return null;
    return mc(`Which ratio is equivalent to ${b(`${a}:${c}`)}?`, `${a * k}:${c * k}`, [`${a + k}:${c + k}`, `${a * k}:${c + k}`, `${c * k}:${a * k}`].filter(s => s !== `${a * k}:${c * k}`), `Multiply both numbers by ${k}: ${b(`${a * k}:${c * k}`)}.`, 4);
  }),
  R(/^Write an equivalent ratio$/, () => () => {
    const a = ri(1, 5), c = ri(1, 5), k = ri(2, 5);
    return num(`${m(`${a}:${c} = ${a * k}:___`)}`, c * k, `Multiply by ${k}: ${c} × ${k} = ${b(c * k)}.`);
  }),
  R(/^Ratio tables$/, () => () => {
    const a = ri(1, 5), c = ri(1, 5), ks = [1, 2, 3, 4], hole = ri(1, 3);
    return num(`${table(['Red', 'Blue'], ks.map((k, i) => [a * k, i === hole ? '?' : c * k]))}The ratio of red to blue stays the same. What is the missing number?`, c * ks[hole], `Blue is ${c} for every ${a} red: ${b(c * ks[hole])}.`);
  }),

  /* ===== percents ===== */
  R(/^What percentage is illustrated\?$|^Understanding percents: strip models$/, (mt, ctx) => () => {
    const strip_ = /strip/.test(ctx.title), p = strip_ ? ri(1, 9) * 10 : ri(5, 95), pic = strip_ ? tenthsBar(p / 100) : decGrid(p / 100);
    return mc(`${pic}What percent of the ${strip_ ? 'strip' : 'grid'} is shaded?`, p + '%', near(p, 5, strip_ ? 3 : 8, { min: 1, step: strip_ ? 10 : 1 }).filter(x => x < 100).map(x => x + '%'), `${p} out of 100 is ${b(p + '%')}.`, 4);
  }),
  R(/^Convert fractions to percents using grid models$|^Convert between percents and fractions$/, () => () => {
    const [n, d] = pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [1, 20], [9, 20], [1, 25], [3, 25]]), p = (n * 100) / d;
    return Math.random() < 0.5 ? num(`Write ${m(stack(n, d))} as a percent. (Answer without the % sign)`, p, `${n}/${d} = ${p}/100 = ${b(p + '%')}.`) : mc(`Write ${b(p + '%')} as a fraction in lowest terms.`, fs(n, d), [fs(d, n), fs(n + 1, d), fs(n, d + 1)].filter(x => x !== fs(n, d)), `${p}% = ${p}/100 = ${b(fs(n, d))}.`, 4);
  }),
  R(/^Represent percents with grid models, decimals and fractions$|^Convert between percents and decimals$|^Convert between percents, fractions and decimals$/, (mt, ctx) => () => {
    const p = pick([10, 20, 25, 30, 40, 50, 60, 70, 75, 80]), [sn, sd] = simp(p, 100);
    if (/decimals$/.test(ctx.title) && !/fractions/.test(ctx.title)) return Math.random() < 0.5 ? num(`Write ${b(p + '%')} as a decimal.`, p / 100, `${p}% = ${p}/100 = ${b(p / 100)}.`) : num(`Write ${b(p / 100)} as a percent. (Answer without the % sign)`, p, `${p / 100} = ${p}/100 = ${b(p + '%')}.`);
    return mc(`${/grid/.test(ctx.title) ? decGrid(p / 100) : ''}Which of these is equal to ${b(p + '%')}?`, `${p / 100} and ${fs(sn, sd)}`, [`${p / 10} and ${fs(sn, sd)}`, `${p / 100} and ${fs(sd, sn)}`, `${p} and ${fs(sn, sd + 1)}`].filter(x => x !== `${p / 100} and ${fs(sn, sd)}`), `${p}% = ${p / 100} = ${b(fs(sn, sd))}.`, 4);
  }),
  R(/^Compare percents to each other and to fractions and decimals$|^Compare percents and fractions: word problems$/, (mt, ctx) => () => {
    const [n, d] = pick([[1, 2], [1, 4], [3, 4], [1, 5], [3, 5], [7, 10]]), p = pick([20, 25, 40, 50, 60, 70, 75, 80]), fv_ = n / d, pv = p / 100; if (fv_ === pv && Math.random() < 0.7) return null;
    const s = fv_ === pv ? '=' : fv_ > pv ? '>' : '<';
    if (/word/.test(ctx.title)) { const [x, y] = sample(NAMES, 2); return mc(`${x} finished ${fs(n, d)} of a book. ${y} finished ${p}% of the same book. Who read more?`, fv_ === pv ? 'The same' : fv_ > pv ? x : y, [x, y, 'The same'].filter(z => z !== (fv_ === pv ? 'The same' : fv_ > pv ? x : y)), `${fs(n, d)} = ${fix(fv_ * 100, 1)}%, compared with ${p}%.`, 3); }
    return mc(`Compare. ${m(`${stack(n, d)} ___ ${p}%`)}`, s, ['<', '>', '='].filter(x => x !== s), `${fs(n, d)} = ${fix(fv_ * 100, 1)}%, and ${fix(fv_ * 100, 1)}% ${s} ${p}%.`, 3);
  })
];
export { ineqLine, strip };
