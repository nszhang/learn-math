/* Functions, linear algebra, systems, inequalities, exponentials, logarithms, sequences and series (Grades 9–12). */
import { ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, dec, num, mc, yesNo, near, svg, C, NAMES, gcd, lcm, table, plane, MINUS } from '../h.js';
import { R } from '../engine.js';
import { S, P, nz, evalExpr } from './numsys.js';
import { stack, fs, simp } from './fractions.js';
import { polyTxt, pmul, padd, pEval } from './poly.js';
import { ineqLine } from './algebra.js';

const sup = (a, e) => `${a}<sup>${e}</sup>`;
const pt = (x, y) => `(${S(x)}, ${S(y)})`;
const slopeTxt = (n, d) => { const [a, c] = simp(n, d); return c === 1 ? S(a) : (a < 0 ? MINUS : '') + Math.abs(a) + '/' + c; };
const lineEq = (mm, bb) => `y = ${mm === 0 ? '' : mm === 1 ? 'x' : mm === -1 ? MINUS + 'x' : S(mm) + 'x'}${bb === 0 ? (mm === 0 ? '0' : '') : mm === 0 ? S(bb) : bb < 0 ? ` ${MINUS} ${-bb}` : ` + ${bb}`}`;
const stdEq = (a, c, d) => `${a === 1 ? '' : a === -1 ? MINUS : S(a)}x ${c < 0 ? MINUS : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}y = ${S(d)}`;
const segFor = (mm, bb, lim = 8) => { const pts = []; for (const x of [-lim, lim]) { const y = mm * x + bb; if (Math.abs(y) <= lim) pts.push([x, y]); } for (const y of [-lim, lim]) { if (mm !== 0) { const x = (y - bb) / mm; if (Math.abs(x) <= lim && !pts.some(p => Math.abs(p[0] - x) < 1e-9)) pts.push([x, y]); } } return pts.length >= 2 ? [pts[0][0], pts[0][1], pts[1][0], pts[1][1]] : [-lim, mm * -lim + bb, lim, mm * lim + bb]; };
const gridLine = (mm, bb, pts = [], opts = {}) => plane({ min: -8, max: 8, points: pts, lines: [segFor(mm, bb), ...(opts.extra || [])], labelEvery: 2, size: 300 });
const lineChoices = (mm, bb) => uniq([lineEq(-mm || 1, bb), lineEq(mm, -bb || 1), lineEq(mm + 1, bb), lineEq(mm, bb + 2)]).filter(x => x !== lineEq(mm, bb));
const nzSlope = () => pick([-3, -2, -1, 1, 2, 3, 0.5, -0.5].filter(Boolean));
const frac = (n, d) => { const [a, c] = simp(n, d); return c === 1 ? S(a) : `${a < 0 ? MINUS : ''}${Math.abs(a)}/${c}`; };
const coefTxt = k => (k === 1 ? 'x' : k === -1 ? MINUS + 'x' : S(k) + 'x');

/* systems */
function sysInt() { const x = ri(-5, 5), y = ri(-5, 5), a1 = nz(1, 4), b1 = nz(-4, 4), a2 = nz(-4, 4), b2 = nz(-4, 4); if (a1 * b2 - a2 * b1 === 0) return sysInt(); return { x, y, e1: [a1, b1, a1 * x + b1 * y], e2: [a2, b2, a2 * x + b2 * y] }; }
const sysTxt = s => `${m(stdEq(...s.e1))}<br>${m(stdEq(...s.e2))}`;

export const FUNC9_RULES = [
  /* ===== number-sense leftovers for Grade 9–10 ===== */
  R(/^Classify rational and irrational numbers$/, () => () => {
    const items = [['√49', 'rational'], ['√50', 'irrational'], ['0.3̅', 'rational'], ['π', 'irrational'], ['−3/7', 'rational'], ['√2 + 1', 'irrational'], ['2.5', 'rational'], ['∛27', 'rational']], [t, k] = pick(items);
    return mc(`Is ${b(t)} rational or irrational?`, k === 'rational' ? 'Rational' : 'Irrational', [k === 'rational' ? 'Irrational' : 'Rational'], k === 'rational' ? `${t} can be written as a ratio of integers.` : `${t} is a non-terminating, non-repeating decimal.`, 2);
  }),
  R(/^Compare and order rational numbers$/, () => () => {
    const vals = uniq([ri(-9, 9) / pick([1, 2, 4]), ri(-9, 9) / pick([1, 2, 4]), ri(-9, 9) / pick([1, 2, 4]), ri(-9, 9) / pick([1, 2, 4])]); if (vals.length < 4) return null;
    const sorted = vals.slice().sort((a, c) => a - c), key = a => a.map(v_ => S(fix(v_, 2))).join(', ');
    return mc(`Order from ${b('least to greatest')}:<br>${m(key(vals))}`, key(sorted), uniq([shuffle(sorted), shuffle(sorted), sorted.slice().reverse()].map(key)).filter(k => k !== key(sorted)), `${b(key(sorted))}.`);
  }),
  R(/^Number lines$/, () => () => {
    const a = nz(-8, 8), c = nz(-8, 8); if (a === c) return null; return mc(`Which number is farther to the right on a number line: ${b(S(a))} or ${b(S(c))}?`, S(Math.max(a, c)), [S(Math.min(a, c))], `${S(Math.max(a, c))} is greater.`, 2);
  }),
  R(/^Absolute value and opposites$/, () => () => {
    const x = nz(-12, 12), y = nz(-9, 9); return num(`${m(`|${S(x)}| + |${S(y)}|`)} = ?`, Math.abs(x) + Math.abs(y), `${Math.abs(x)} + ${Math.abs(y)} = ${b(Math.abs(x) + Math.abs(y))}.`);
  }),
  R(/^Evaluate variable expressions involving (?:integers|rational numbers)$/, (mt, ctx) => () => {
    const rat = /rational/.test(ctx.title), x = rat ? pick([0.5, -1.5, 2.5, -0.25, 3.5]) : nz(-9, 9), a = nz(-5, 5), c = nz(-9, 9);
    return num(`Evaluate ${m(`${S(a)}x ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`)} when ${b('x = ' + S(x))}.`, fix(a * x + c, 4), `${S(a)} × ${P(x)} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${b(S(fix(a * x + c, 4)))}.`);
  }),
  R(/^Distributive property$|^Simplify variable expressions involving like terms and the distributive property$/, () => () => {
    const a = nz(-5, 6), c = nz(1, 6), d = nz(-6, 6), e = nz(-5, 5), co = [a * 1 + e, a * c + d]; const ans = polyTxt(co);
    return mc(`Simplify ${m(`${S(a)}(x + ${c}) ${d < 0 ? MINUS : '+'} ${Math.abs(d)} ${e < 0 ? MINUS : '+'} ${Math.abs(e)}x`)}.`, ans, uniq([polyTxt([a - e, a * c + d]), polyTxt([a + e, a + c + d]), polyTxt([a + e, a * c - d])]).filter(v_ => v_ !== ans), `Distribute and combine like terms: ${b(ans)}.`, 4);
  }),
  R(/^Write variable equations$/, () => () => {
    const a = ri(2, 9), c = ri(2, 20), nm = pick(NAMES);
    return mc(`${nm} buys ${a} notebooks that cost the same price n each, and pays $${c} extra for a bag. The total is $${a * 3 + c}. Which equation matches?`, `${a}n + ${c} = ${a * 3 + c}`, [`${a} + n + ${c} = ${a * 3 + c}`, `${a}n − ${c} = ${a * 3 + c}`, `n + ${a * c} = ${a * 3 + c}`], `${a} notebooks cost ${a}n, plus ${c}.`, 4);
  }),
  R(/^Does x satisfy the equation\?$|^Solve equations using order of operations$/, (mt, ctx) => () => {
    const x = nz(-6, 8), a = nz(2, 6), c = nz(-9, 9), rhs = a * x + c;
    if (/Does/.test(ctx.title)) { const t = x + (Math.random() < 0.5 ? 0 : 1); return yesNo(`Does ${b('x = ' + S(t))} satisfy ${m(`${polyTxt([a, c])} = ${S(rhs)}`)}?`, t === x, t === x ? `${a}(${S(t)}) ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${S(rhs)} ✓.` : `${a}(${S(t)}) ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${S(a * t + c)}, not ${S(rhs)}.`, ['Yes', 'No']); }
    return num(`Solve ${m(`${a}(x ${c < 0 ? MINUS : '+'} ${Math.abs(c)}) = ${S(a * (x + c))}`)}.`, x, `Divide by ${a}, then ${c < 0 ? 'add' : 'subtract'} ${Math.abs(c)}: x = ${b(S(x))}.`);
  }),
  R(/^Percent word problems$|^Word problems with money$|^Rate of travel: word problems$|^Weighted averages: word problems$|^Word problems: mixed review$/, (mt, ctx) => () => {
    const t = ctx.title, nm = pick(NAMES);
    if (/Percent/.test(t)) { const p = pick([10, 15, 20, 25, 30, 40]), v_ = pick([40, 60, 80, 120, 200]); return num(`${nm} scored ${p}% on a ${v_}-point test. How many points is that?`, (p * v_) / 100, `${p}% × ${v_} = ${b((p * v_) / 100)}.`); }
    if (/money/.test(t)) { const q = ri(2, 9), d = ri(2, 9), tot = q * 25 + d * 10; return num(`${nm} has quarters and dimes worth ${b('$' + (tot / 100).toFixed(2))}. There are ${b(q)} quarters. How many dimes are there?`, d, `${tot} − ${q * 25} = ${tot - q * 25}¢, which is ${b(d)} dimes.`); }
    if (/Rate of travel/.test(t)) { const v1 = ri(40, 80), v2 = ri(40, 80), tm = ri(2, 6); return num(`Two trains leave the same station at the same time in opposite directions at ${b(v1 + ' km/h')} and ${b(v2 + ' km/h')}. How many kilometres apart are they after ${b(tm + ' hours')}?`, (v1 + v2) * tm, `(${v1} + ${v2}) × ${tm} = ${b((v1 + v2) * tm)} km.`); }
    if (/Weighted/.test(t)) { const a = ri(60, 90), n1 = ri(2, 4), c = ri(60, 90), n2 = ri(2, 4); return num(`${n1} quizzes average ${b(a)} and ${n2} tests average ${b(c)}. What is the overall average of all ${n1 + n2} scores? (round to 1 decimal)`, fix((a * n1 + c * n2) / (n1 + n2), 1), `(${a}×${n1} + ${c}×${n2}) ÷ ${n1 + n2} = ${b(fix((a * n1 + c * n2) / (n1 + n2), 1))}.`); }
    const a = ri(3, 9), c = ri(2, 6), d = ri(10, 40); return num(`${nm} rents a bike for a $${d} fee plus $${a} per hour. The total was $${d + a * c}. For how many hours was it rented?`, c, `(${d + a * c} − ${d}) ÷ ${a} = ${b(c)}.`);
  }),

  /* ===== linear equations ===== */
  R(/^Solve (?:one-step|two-step|advanced) linear equations$|^Solve linear equations(?:: (?:word problems|mixed review))?$|^Solve linear equations: mixed review$/, (mt, ctx) => () => {
    const t = ctx.title, x = nz(-9, 10);
    if (/one-step/.test(t)) { const a = ri(2, 9), kind = pick(['+', '×']); return kind === '+' ? num(`Solve ${m(`x + ${a} = ${S(x + a)}`)}.`, x, `x = ${b(S(x))}.`) : num(`Solve ${m(`${a}x = ${S(a * x)}`)}.`, x, `x = ${b(S(x))}.`); }
    if (/word/.test(t)) { const per = ri(2, 9), fee = ri(5, 30), n = ri(2, 12); return num(`A gym charges a $${fee} sign-up fee plus $${per} per visit. Maya paid $${fee + per * n}. How many visits did she make?`, n, `${per}v + ${fee} = ${fee + per * n}, so v = ${b(n)}.`); }
    if (/advanced|mixed/.test(t)) { const a = ri(2, 5), c = ri(1, 4), d = ri(2, 6), e = nz(-6, 6), lhs = a * (x + c) - d, rhs = lhs; return num(`Solve ${m(`${a}(x + ${c}) ${MINUS} ${d} = ${S(rhs)}`)}.`, x, `Add ${d}, divide by ${a}, subtract ${c}: x = ${b(S(x))}.`); }
    const a = nz(2, 7), c = nz(-9, 9); return num(`Solve ${m(`${polyTxt([a, c])} = ${S(a * x + c)}`)}.`, x, `x = ${b(S(x))}.`);
  }),
  R(/^Find the number of solutions$|^Create equations with no solutions or infinitely many solutions$/, (mt, ctx) => () => {
    const a = ri(2, 6), c = ri(1, 9), kind = pick(['one', 'none', 'infinite']), lhs = `${a}x + ${c}`, rhs = kind === 'one' ? `${a + 1}x + ${c}` : kind === 'none' ? `${a}x + ${c + 2}` : `${a}x + ${c}`;
    if (/Create/.test(ctx.title)) { const want = pick(['no solutions', 'infinitely many solutions']); return mc(`Which equation has ${b(want)}?`, want === 'no solutions' ? `${a}x + ${c} = ${a}x + ${c + 3}` : `${a}x + ${c} = ${a}x + ${c}`, want === 'no solutions' ? [`${a}x + ${c} = ${a + 1}x + ${c}`, `${a}x + ${c} = ${a}x + ${c}`, `${a}x = ${c}`] : [`${a}x + ${c} = ${a}x + ${c + 3}`, `${a}x + ${c} = ${a + 1}x + ${c}`, `${a}x = ${c}`], want === 'no solutions' ? 'The x-terms match but the constants differ, which is impossible.' : 'Both sides are identical, so every x works.', 4); }
    return mc(`How many solutions does ${m(`${lhs} = ${rhs}`)} have?`, { one: 'One solution', none: 'No solutions', infinite: 'Infinitely many solutions' }[kind], ['One solution', 'No solutions', 'Infinitely many solutions'].filter(v_ => v_ !== { one: 'One solution', none: 'No solutions', infinite: 'Infinitely many solutions' }[kind]), kind === 'one' ? 'The x-coefficients differ, so x has one value.' : kind === 'none' ? 'The x terms cancel and leave a false statement.' : 'Both sides are identical.', 3);
  }),
  R(/^Solve absolute value equations$|^Graph solutions to absolute value equations$/, (mt, ctx) => () => {
    const c = nz(-6, 6), k = ri(1, 8), good = `x = ${S(c - k)}, ${S(c + k)}`, inside = `x ${c < 0 ? '+' : MINUS} ${Math.abs(c)}`;
    return mc(`Solve ${m(`|${inside}| = ${k}`)}.`, good, uniq([`x = ${S(k)}`, `x = ${S(-c - k)}, ${S(-c + k)}`, `x = ${S(c + k)}`]).filter(v_ => v_ !== good), `${inside} = ±${k}, so ${b(good)}.`, 4);
  }),

  /* ===== inequalities ===== */
  R(/^Graph inequalities$|^Graph a linear inequality in one variable$|^Graph solutions to (?:one-step |two-step |multi-step )?linear inequalities$|^Graph solutions to (?:one-step|two-step|multi-step) linear inequalities$|^Write inequalities from graphs$|^Identify solutions to inequalities$/, (mt, ctx) => () => {
    const x = ri(-4, 6), rel = pick(['>', '<', '≥', '≤']), dir = rel === '>' || rel === '≥' ? 'right' : 'left', closed = rel === '≥' || rel === '≤';
    if (/Identify solutions/.test(ctx.title)) { const pool = range(-8, 10), sol = pool.filter(n => (rel === '>' ? n > x : rel === '<' ? n < x : rel === '≥' ? n >= x : n <= x)); return mc(`Which number is a solution of ${m(`x ${rel} ${S(x)}`)}?`, S(pick(sol)), sample(pool.filter(n => !sol.includes(n)), 3).map(S), `A solution makes the inequality true.`, 4); }
    if (/Write inequalities|Graph solutions to/.test(ctx.title)) return mc(`${ineqLine({ val: x, dir, closed, lo: -8, hi: 10 })}Which inequality does the graph show?`, `x ${rel} ${S(x)}`, uniq([`x ${{ '>': '<', '<': '>', '≥': '≤', '≤': '≥' }[rel]} ${S(x)}`, `x ${rel === '>' ? '≥' : rel === '<' ? '≤' : rel === '≥' ? '>' : '<'} ${S(x)}`, `x ${rel} ${S(-x || 1)}`]), `Circle ${closed ? 'filled' : 'open'}, shaded to the ${dir}: ${b(`x ${rel} ${S(x)}`)}.`, 4);
    return mc(`How is ${m(`x ${rel} ${S(x)}`)} graphed?`, `${closed ? 'Filled' : 'Open'} circle at ${S(x)}, shaded to the ${dir}`, [`${closed ? 'Open' : 'Filled'} circle at ${S(x)}, shaded to the ${dir}`, `${closed ? 'Filled' : 'Open'} circle at ${S(x)}, shaded to the ${dir === 'right' ? 'left' : 'right'}`, `${closed ? 'Open' : 'Filled'} circle at ${S(x)}, shaded to the ${dir === 'right' ? 'left' : 'right'}`], `${closed ? '≥ and ≤ use a filled circle' : '> and < use an open circle'}.`, 4);
  }),
  R(/^Write and graph inequalities: word problems$|^Write a linear inequality: word problems$/, () => () => {
    const n = ri(5, 40), q = pick([['at least', '≥'], ['at most', '≤'], ['more than', '>'], ['fewer than', '<']]);
    return mc(`A customer must spend ${b(q[0] + ' $' + n)}. Let s be the amount spent. Which inequality is correct?`, `s ${q[1]} ${n}`, ['≥', '>', '≤', '<'].filter(v_ => v_ !== q[1]).map(v_ => `s ${v_} ${n}`), `"${q[0]}" means ${b(q[1])}.`, 4);
  }),
  R(/^Solve one-step linear inequalities(?:: (?:addition and subtraction|multiplication and division))?$|^Solve (?:two-step|multi-step) linear inequalities$|^Solve linear inequalities$/, (mt, ctx) => () => {
    const t = ctx.title, x = nz(-8, 9), a = nz(-5, 5), c = nz(-9, 9), rel = pick(['>', '<', '≥', '≤']); if (a === 0) return null;
    const flipRel = r_ => ({ '>': '<', '<': '>', '≥': '≤', '≤': '≥' }[r_]);
    if (/addition/.test(t)) return mc(`Solve ${m(`x + ${Math.abs(c)} ${rel} ${S(x + Math.abs(c))}`)}.`, `x ${rel} ${S(x)}`, uniq([`x ${flipRel(rel)} ${S(x)}`, `x ${rel} ${S(x + 2 * Math.abs(c))}`, `x ${rel} ${S(-x)}`]), `Subtract ${Math.abs(c)}: ${b(`x ${rel} ${S(x)}`)}.`, 4);
    const aa = /multiplication|one-step/.test(t) ? a : a, rhs = /one-step|multiplication/.test(t) ? aa * x : aa * x + c, lhsTxt = /one-step|multiplication/.test(t) ? `${S(aa)}x` : polyTxt([aa, c]), fin = aa < 0 ? flipRel(rel) : rel;
    return mc(`Solve ${m(`${lhsTxt} ${rel} ${S(rhs)}`)}.`, `x ${fin} ${S(x)}`, uniq([`x ${rel} ${S(x)}`, `x ${flipRel(fin)} ${S(x)}`, `x ${fin} ${S(-x || 1)}`]).filter(v_ => v_ !== `x ${fin} ${S(x)}`), aa < 0 ? `Dividing by a negative flips the inequality: ${b(`x ${fin} ${S(x)}`)}.` : `${b(`x ${fin} ${S(x)}`)}.`, 4);
  }),
  R(/^Graph compound inequalities$|^Write compound inequalities from graphs$|^Solve compound inequalities$|^Graph solutions to compound inequalities$/, (mt, ctx) => () => {
    const lo = ri(-6, 2), hi = lo + ri(2, 8), kind = pick(['and', 'or']);
    return mc(`${kind === 'and' ? `Which numbers satisfy ${m(`${S(lo)} < x ≤ ${S(hi)}`)}?` : `Which numbers satisfy ${m(`x < ${S(lo)} or x ≥ ${S(hi)}`)}?`}`, kind === 'and' ? `All numbers greater than ${S(lo)} and at most ${S(hi)}` : `All numbers less than ${S(lo)} or at least ${S(hi)}`, kind === 'and' ? [`All numbers less than ${S(lo)} or at least ${S(hi)}`, `All numbers at least ${S(lo)} and less than ${S(hi)}`, `Only ${S(lo)} and ${S(hi)}`] : [`All numbers greater than ${S(lo)} and at most ${S(hi)}`, `All numbers at least ${S(lo)} and less than ${S(hi)}`, `Only ${S(lo)} and ${S(hi)}`], `${kind === 'and' ? 'And' : 'Or'} describes ${kind === 'and' ? 'the overlap' : 'either piece'}.`, 4);
  }),
  R(/^Solve absolute value inequalities$|^Graph solutions to absolute value inequalities$/, () => () => {
    const k = ri(1, 8), c = ri(-4, 4), less = Math.random() < 0.5; const good = less ? `${S(c - k)} < x < ${S(c + k)}` : `x < ${S(c - k)} or x > ${S(c + k)}`;
    return mc(`Solve ${m(`|x ${c < 0 ? '+' : MINUS} ${Math.abs(c)}| ${less ? '<' : '>'} ${k}`)}.`, good, [less ? `x < ${S(c - k)} or x > ${S(c + k)}` : `${S(c - k)} < x < ${S(c + k)}`, `${S(-k)} < x < ${S(k)}`, `x < ${S(c + k)}`], `${less ? 'Less than means between' : 'Greater than means outside'}: ${b(good)}.`, 4);
  }),
  R(/^Graph a linear inequality in the coordinate plane$|^Is \(x, y\) a solution to the system of inequalities\?$/, (mt, ctx) => () => {
    const mm = nzSlope(), bb = ri(-3, 3), rel = pick(['>', '<', '≥', '≤']), px = ri(-4, 4), py = ri(-6, 6), line = mm * px + bb;
    if (py === line) return null; const sat = rel === '>' || rel === '≥' ? py > line : py < line;
    if (/system/.test(ctx.title)) { const m2 = pick([-1, 1, 2]), b2 = ri(-4, 4), rel2 = pick(['>', '<']), sat2 = rel2 === '>' ? py > m2 * px + b2 : py < m2 * px + b2; if (py === m2 * px + b2) return null; return yesNo(`Is ${b(pt(px, py))} a solution of the system?<br>${m(`y ${rel} ${lineEq(mm, bb).slice(4)}`)}<br>${m(`y ${rel2} ${lineEq(m2, b2).slice(4)}`)}`, sat && sat2, `Check both: the first is ${sat ? 'true' : 'false'} and the second is ${sat2 ? 'true' : 'false'}.`, ['Yes', 'No']); }
    return yesNo(`Is ${b(pt(px, py))} a solution of ${m(`y ${rel} ${lineEq(mm, bb).slice(4)}`)}?`, sat, `At x = ${px}, the line has y = ${fix(line, 2)}; ${py} ${sat ? 'satisfies' : 'does not satisfy'} ${rel}.`, ['Yes', 'No']);
  }),
  R(/^Graph solutions to quadratic inequalities$|^Solve quadratic inequalities$|^Solve higher-degree inequalities$|^Graph solutions to higher-degree inequalities$/, () => () => {
    const r1 = ri(-5, 0), r2 = r1 + ri(2, 6), less = Math.random() < 0.5, co = pmul([1, -r1], [1, -r2]);
    const good = less ? `${S(r1)} < x < ${S(r2)}` : `x < ${S(r1)} or x > ${S(r2)}`;
    return mc(`Solve ${m(`${polyTxt(co)} ${less ? '<' : '>'} 0`)}.`, good, [less ? `x < ${S(r1)} or x > ${S(r2)}` : `${S(r1)} < x < ${S(r2)}`, `${S(-r2)} < x < ${S(-r1)}`, `x < ${S(r2)}`], `The roots are ${S(r1)} and ${S(r2)}; the parabola opens upward, so it is ${less ? 'negative between' : 'positive outside'} them: ${b(good)}.`, 4);
  }),
  R(/^Find the vertices of a solution set$|^Linear programming$|^Solve systems of inequalities by graphing$/, (mt, ctx) => () => {
    const w = ri(3, 8), h = ri(3, 8), pc = pick([[2, 3], [3, 1], [1, 4], [5, 2]]), verts = [[0, 0], [w, 0], [w, h], [0, h]], vals = verts.map(v_ => pc[0] * v_[0] + pc[1] * v_[1]);
    if (/Find the vertices/.test(ctx.title)) return mc(`The solution set of x ≥ 0, y ≥ 0, x ≤ ${w}, y ≤ ${h} is a rectangle. Which point is a vertex?`, `(${w}, ${h})`, [`(${h}, ${w + 1})`, `(${w + 1}, 0)`, `(${w}, ${h + 1})`], `The corners are (0,0), (${w},0), (${w},${h}), (0,${h}).`, 4);
    if (/Linear programming/.test(ctx.title)) return num(`Maximize ${m(`P = ${pc[0]}x + ${pc[1]}y`)} subject to 0 ≤ x ≤ ${w}, 0 ≤ y ≤ ${h}. What is the maximum value of P?`, Math.max(...vals), `Check the corners: the largest value is ${b(Math.max(...vals))} at (${w}, ${h}).`);
    return yesNo(`Is the point ${b(pt(1, 1))} in the solution of x ≥ 0, y ≥ 0, x ≤ ${w}, y ≤ ${h}?`, true, 'All four conditions hold.', ['Yes', 'No']);
  }),

  /* ===== functions ===== */
  R(/^Domain and range(?: of relations)?$/, () => () => {
    const pairs = Array.from({ length: 4 }, () => [ri(-4, 6), ri(-4, 6)]), xs = uniq(pairs.map(p => p[0])).sort((a, c) => a - c), ys = uniq(pairs.map(p => p[1])).sort((a, c) => a - c);
    const ask = pick(['domain', 'range']), list = ask === 'domain' ? xs : ys, other = ask === 'domain' ? ys : xs, key = a => `{${a.map(S).join(', ')}}`;
    return mc(`A relation is ${m(pairs.map(p => pt(...p)).join(', '))}. What is its ${b(ask)}?`, key(list), uniq([key(other), key(list.slice(1)), key([...list, ri(7, 9)])]).filter(v_ => v_ !== key(list)), `The ${ask} is the set of ${ask === 'domain' ? 'x' : 'y'}-values: ${b(key(list))}.`, 4);
  }),
  R(/^Identify functions$|^Identify functions: vertical line test$/, (mt, ctx) => () => {
    const isF = Math.random() < 0.5, xs = sample(range(-4, 5), 4), pairs = xs.map(x => [x, ri(-4, 6)]); if (!isF) pairs[3] = [pairs[0][0], pairs[0][1] + nz(1, 3)];
    return yesNo(`Is ${m(pairs.map(p => pt(...p)).join(', '))} a function?`, isF, isF ? 'Every x-value has exactly one y-value.' : `The x-value ${pairs[0][0]} appears with two different y-values.`, ['Yes', 'No']);
  }),
  R(/^Evaluate (?:a )?functions?(?:: plug in an expression)?$|^Evaluate functions$/, (mt, ctx) => () => {
    const a = nz(-4, 5), c = nz(-6, 6), x = nz(-4, 5), k = nz(1, 4);
    if (/expression/.test(ctx.title)) { const ans = a * (x + k) + c; return num(`${m(`f(x) = ${polyTxt([a, c])}`)}. Find ${m(`f(${x} + ${k})`)}.`, ans, `f(${x + k}) = ${S(a)}(${x + k}) ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${b(S(ans))}.`); }
    return num(`${m(`f(x) = ${polyTxt([a, c])}`)}. Find ${m(`f(${S(x)})`)}.`, a * x + c, `f(${S(x)}) = ${b(S(a * x + c))}.`);
  }),
  R(/^Find values using function graphs$|^Complete a function table from a graph$|^Complete a table for a function graph$/, () => () => {
    const mm = ri(-2, 2) || 1, bb = ri(-3, 3), x = ri(-3, 3);
    return num(`${gridLine(mm, bb)}Use the graph. What is ${m(`f(${S(x)})`)}?`, mm * x + bb, `Read the graph at x = ${S(x)}: ${b(S(mm * x + bb))}.`);
  }),
  R(/^Complete a function table from an equation$|^Complete a function table: absolute value functions$/, (mt, ctx) => () => {
    const abs = /absolute/.test(ctx.title), a = nz(-3, 3), c = nz(-4, 4), xs = [-2, -1, 0, 1, 2], hole = ri(0, 4), f = x => (abs ? a * Math.abs(x - 1) + c : a * x + c);
    return num(`${table(['x', ...xs.map(S)], [['f(x)', ...xs.map((x, i) => (i === hole ? '?' : S(f(x))))]])}The rule is ${m(`f(x) = ${abs ? `${S(a)}|x ${MINUS} 1| ${c < 0 ? MINUS : '+'} ${Math.abs(c)}` : polyTxt([a, c])}`)}. What is the missing value?`, f(xs[hole]), `f(${S(xs[hole])}) = ${b(S(f(xs[hole])))}.`);
  }),
  R(/^Relations: convert between tables, graphs, mappings and lists of points$/, () => () => {
    const pairs = [[1, 3], [2, 5], [3, 7]]; return mc(`A table lists x: 1, 2, 3 and y: 3, 5, 7. Which list of points matches?`, pairs.map(p => pt(...p)).join(', '), [pairs.map(p => pt(p[1], p[0])).join(', '), pairs.map(p => pt(p[0], p[1] + 1)).join(', '), pairs.map(p => pt(p[0], -p[1])).join(', ')], `Pair each x with its y: ${b(pairs.map(p => pt(...p)).join(', '))}.`, 4);
  }),
  R(/^Interpret the graph of a function: word problems$/, () => () => {
    const rate = ri(2, 9), start = ri(5, 40), t = ri(2, 8); return num(`A function models savings: ${m(`S(t) = ${rate}t + ${start}`)} dollars after t weeks. How much is saved after ${b(t + ' weeks')}? ($)`, rate * t + start, `${rate}(${t}) + ${start} = ${b(rate * t + start)}.`);
  }),
  R(/^Add, subtract, multiply and divide functions$/, () => () => {
    const f = [ri(1, 3), ri(-4, 4)], g = [ri(1, 3), ri(-4, 4)], op = pick(['+', '−', '×']), res = op === '+' ? padd(f, g) : op === '−' ? padd(f, g.map(x => -x)) : pmul(f, g);
    return mc(`${m(`f(x) = ${polyTxt(f)}`)} and ${m(`g(x) = ${polyTxt(g)}`)}. Find ${m(`(f ${op} g)(x)`)}.`, polyTxt(res), uniq([polyTxt(padd(f, g)), polyTxt(pmul(f, g)), polyTxt(padd(f, g.map(x => -x)))]).filter(v_ => v_ !== polyTxt(res)), `${op === '×' ? 'Multiply' : op === '+' ? 'Add' : 'Subtract'} the expressions: ${b(polyTxt(res))}.`, 4);
  }),
  R(/^Composition of functions$/, () => () => {
    const f = [ri(1, 4), ri(-3, 3)], g = [ri(1, 3), ri(-3, 3)], x = ri(-3, 4), gx = g[0] * x + g[1], ans = f[0] * gx + f[1];
    return num(`${m(`f(x) = ${polyTxt(f)}`)} and ${m(`g(x) = ${polyTxt(g)}`)}. Find ${m(`f(g(${S(x)}))`)}.`, ans, `g(${S(x)}) = ${S(gx)}, then f(${S(gx)}) = ${b(S(ans))}.`);
  }),
  R(/^Identify inverse functions$|^Find inverse functions and relations$|^Find values of inverse functions from (?:tables|graphs)$|^Graphs of inverse functions$/, (mt, ctx) => () => {
    const a = nz(2, 5), c = nz(-6, 6), t = ctx.title;
    if (/Find values/.test(t)) { const x = ri(-3, 4), y = a * x + c; return num(`A function satisfies ${m(`f(${S(x)}) = ${S(y)}`)}. What is ${m(`f⁻¹(${S(y)})`)}?`, x, `If f(${S(x)}) = ${S(y)}, then f⁻¹(${S(y)}) = ${b(S(x))}.`); }
    if (/Identify/.test(t)) { const yes = Math.random() < 0.5; return yesNo(`${m(`f(x) = ${polyTxt([a, c])}`)} and ${m(`g(x) = ${yes ? `(x ${c < 0 ? '+' : MINUS} ${Math.abs(c)}) ÷ ${a}` : `(x ${c < 0 ? MINUS : '+'} ${Math.abs(c)}) ÷ ${a}`}`)}. Are f and g inverses?`, yes, yes ? 'f(g(x)) = x.' : 'f(g(x)) ≠ x.', ['Yes', 'No']); }
    if (/Graphs/.test(t)) return mc(`The graph of ${m('f')} contains the point ${b(pt(3, 7))}. Which point is on the graph of ${m('f⁻¹')}?`, pt(7, 3), [pt(3, 7), pt(-3, -7), pt(-7, 3)], `Inverse functions swap x and y.`, 4);
    return mc(`Find the inverse of ${m(`f(x) = ${polyTxt([a, c])}`)}.`, `f⁻¹(x) = (x ${c < 0 ? '+' : MINUS} ${Math.abs(c)}) ÷ ${a}`, [`f⁻¹(x) = (x ${c < 0 ? MINUS : '+'} ${Math.abs(c)}) ÷ ${a}`, `f⁻¹(x) = ${a}x ${c < 0 ? '+' : MINUS} ${Math.abs(c)}`, `f⁻¹(x) = (x ${c < 0 ? '+' : MINUS} ${Math.abs(c)}) × ${a}`], `Swap x and y, then solve for y: ${b(`(x ${c < 0 ? '+' : '−'} ${Math.abs(c)}) ÷ ${a}`)}.`, 4);
  }),
  R(/^Identify graphs of continuous functions$/, () => () => {
    const q = pick([['f(x) = x² + 1', 'Continuous'], ['f(x) = 1/x', 'Not continuous (break at x = 0)'], ['f(x) = |x|', 'Continuous'], ['f(x) = ⌊x⌋ (greatest integer)', 'Not continuous (jumps)']]);
    return mc(`Is the graph of ${b(q[0])} continuous (can you draw it without lifting your pencil)?`, q[1], ['Continuous', 'Not continuous (break at x = 0)', 'Not continuous (jumps)'].filter(v_ => v_ !== q[1]).slice(0, 2), `${q[1]}.`, 3);
  }),
  R(/^Translations of functions$|^Reflections of functions$|^Dilations of functions$|^Transformations of functions$|^Function transformation rules$|^Describe function transformations$|^Transformations of linear functions$/, (mt, ctx) => () => {
    const h = nz(-5, 5), k = nz(-5, 5), q = pick([[`g(x) = f(x ${h < 0 ? '+' : MINUS} ${Math.abs(h)})`, `shifted ${Math.abs(h)} unit${Math.abs(h) > 1 ? 's' : ''} ${h > 0 ? 'right' : 'left'}`], [`g(x) = f(x) ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`, `shifted ${Math.abs(k)} unit${Math.abs(k) > 1 ? 's' : ''} ${k > 0 ? 'up' : 'down'}`], [`g(x) = −f(x)`, 'reflected across the x-axis'], [`g(x) = f(−x)`, 'reflected across the y-axis'], [`g(x) = 2f(x)`, 'stretched vertically by a factor of 2']]);
    return mc(`How is the graph of ${m(q[0])} related to the graph of f?`, q[1], ['shifted 3 units right', 'shifted 3 units up', 'reflected across the x-axis', 'reflected across the y-axis', 'stretched vertically by a factor of 2', 'shifted 4 units left'].filter(v_ => v_ !== q[1]).slice(0, 3), `${q[0]} is f ${b(q[1])}.`, 4);
  }),
  R(/^Domain and range of exponential and logarithmic functions$/, () => () => {
    const base = ri(2, 5), exp = Math.random() < 0.5;
    return mc(`What is the range of ${m(exp ? `f(x) = ${base}<sup>x</sup>` : `f(x) = log<sub>${base}</sub>(x)`)}?`, exp ? 'y > 0' : 'all real numbers', exp ? ['all real numbers', 'y ≥ 0', 'y < 0'] : ['y > 0', 'y ≥ 0', 'x > 0'], exp ? 'Powers of a positive base are always positive.' : 'Logarithms can take any real value.', 4);
  }),

  /* ===== linear functions (forms, slope, lines) ===== */
  R(/^Identify linear functions$|^Identify linear and exponential functions$|^Identify linear, quadratic and exponential functions from (?:graphs|tables)$/, (mt, ctx) => () => {
    const kind = pick(['linear', 'quadratic', 'exponential']), xs = [0, 1, 2, 3], f = x => (kind === 'linear' ? 3 * x + 2 : kind === 'quadratic' ? x * x + 1 : 2 * 2 ** x);
    const opts = /quadratic/.test(ctx.title) ? ['linear', 'quadratic', 'exponential'] : ['linear', 'exponential'], k = opts.includes(kind) ? kind : 'linear';
    const g = x => (k === 'linear' ? 3 * x + 2 : k === 'quadratic' ? x * x + 1 : 2 * 2 ** x);
    return mc(`${table(['x', ...xs], [['y', ...xs.map(g)]])}Is the function linear, quadratic or exponential?`, k, opts.filter(v_ => v_ !== k).concat(opts.length < 3 ? ['neither'] : []), k === 'linear' ? 'The first differences are constant.' : k === 'quadratic' ? 'The second differences are constant.' : 'Each y-value is multiplied by the same factor.', 3);
  }),
  R(/^Find the slope of a graph$|^Find the slope of a linear function$/, () => () => {
    const [n, d] = pick([[2, 1], [3, 1], [-1, 1], [-2, 1], [1, 2], [3, 2], [-3, 2], [2, 3]]), bb = ri(-3, 3), x1 = 0, y1 = bb, x2 = d, y2 = bb + n;
    return mc(`${gridLine(n / d, bb, [{ x: x1, y: y1, color: C.blue }, { x: x2, y: y2, color: C.blue }])}What is the slope of the line?`, frac(n, d), uniq([frac(d, n), frac(-n, d), frac(n, d + 1)]).filter(v_ => v_ !== frac(n, d)), `rise ÷ run = ${S(n)}/${d} = ${b(frac(n, d))}.`, 4);
  }),
  R(/^Find the slope from two points$/, () => () => {
    const x1 = ri(-5, 3), y1 = ri(-5, 5), dx = nz(1, 4), dy = nz(-6, 6), x2 = x1 + dx, y2 = y1 + dy;
    return mc(`What is the slope of the line through ${b(pt(x1, y1))} and ${b(pt(x2, y2))}?`, frac(dy, dx), uniq([frac(dx, dy), frac(-dy, dx), frac(dy, dx + 1)]).filter(v_ => v_ !== frac(dy, dx)), `(${S(y2)} − ${P(y1)}) ÷ (${S(x2)} − ${P(x1)}) = ${b(frac(dy, dx))}.`, 4);
  }),
  R(/^Find a missing coordinate using slope$/, () => () => {
    const mm = nz(-4, 4), x1 = ri(-3, 3), y1 = ri(-4, 4), dx = ri(1, 4), y2 = y1 + mm * dx;
    return num(`A line with slope ${b(S(mm))} passes through ${b(pt(x1, y1))} and ${b(`(${S(x1 + dx)}, y)`)}. What is y?`, y2, `y = ${S(y1)} + ${S(mm)} × ${dx} = ${b(S(y2))}.`);
  }),
  R(/^Slope-intercept form: find the slope and y-intercept$/, () => () => {
    const mm = nz(-5, 5), bb = nz(-7, 7);
    return mc(`What are the slope and y-intercept of ${m(lineEq(mm, bb))}?`, `slope ${S(mm)}, y-intercept ${S(bb)}`, [`slope ${S(bb)}, y-intercept ${S(mm)}`, `slope ${S(-mm)}, y-intercept ${S(bb)}`, `slope ${S(mm)}, y-intercept ${S(-bb)}`], `In y = mx + b, m = ${S(mm)} and b = ${S(bb)}.`, 4);
  }),
  R(/^Slope-intercept form: graph an equation$/, () => () => {
    const mm = nzSlope(), bb = ri(-4, 4), x = ri(1, 3), y = mm * x + bb; if (!Number.isInteger(y)) return null;
    return mc(`Which point lies on the graph of ${m(lineEq(mm, bb))}?`, pt(x, y), [pt(x, y + 1), pt(x, -y), pt(y, x)].filter(v_ => v_ !== pt(x, y)), `At x = ${x}: y = ${S(y)}.`, 4);
  }),
  R(/^Slope-intercept form: write an equation(?: from a graph| from a table| from a word problem)?$|^Write the equation of a linear function$|^Write linear functions to solve word problems$|^Rate of change of a linear function: tables$/, (mt, ctx) => () => {
    const mm = nzSlope(), bb = ri(-4, 4), t = ctx.title; if (!Number.isInteger(mm) && /table/.test(t)) return null;
    if (/graph/.test(t)) return mc(`${gridLine(mm, bb)}Which equation is shown?`, lineEq(mm, bb), lineChoices(mm, bb).slice(0, 3), `The y-intercept is ${S(bb)} and the slope is ${S(mm)}.`, 4);
    if (/table/.test(t) && /Rate/.test(t)) return num(`${table(['x', 0, 1, 2, 3], [['y', ...range(0, 3).map(x => mm * x + bb)]])}What is the rate of change?`, mm, `y increases by ${S(mm)} each step: ${b(S(mm))}.`);
    if (/table/.test(t)) return mc(`${table(['x', 0, 1, 2, 3], [['y', ...range(0, 3).map(x => mm * x + bb)]])}Which equation fits the table?`, lineEq(mm, bb), lineChoices(mm, bb).slice(0, 3), `y = ${S(bb)} at x = 0 and changes by ${S(mm)}: ${b(lineEq(mm, bb))}.`, 4);
    if (/word|solve word/.test(t) || /Write linear functions/.test(t)) { const per = ri(2, 9), fee = ri(3, 20); return mc(`A taxi charges $${fee} plus $${per} per km. Which equation gives the cost C for d km?`, `C = ${per}d + ${fee}`, [`C = ${fee}d + ${per}`, `C = ${per + fee}d`, `C = ${per}d − ${fee}`], `Fixed fee ${fee} plus ${per} per km: ${b(`C = ${per}d + ${fee}`)}.`, 4); }
    const x1 = ri(-3, 3), x2 = x1 + 1; return mc(`Write the equation of the line through ${b(pt(x1, mm * x1 + bb))} and ${b(pt(x2, mm * x2 + bb))}.`, lineEq(mm, bb), lineChoices(mm, bb).slice(0, 3), `Slope ${S(mm)}, intercept ${S(bb)}.`, 4);
  }),
  R(/^Linear equations: solve for y$/, () => () => {
    const c = ri(1, 4), mm = nz(-4, 4), q = nz(-5, 5), a = -mm * c, d = q * c;
    return mc(`Solve ${m(`${coefTxt(a)} + ${c === 1 ? '' : c}y = ${S(d)}`)} for y.`, lineEq(mm, q), uniq([lineEq(-mm, q), lineEq(mm, -q), lineEq(mm + 1, q)]), `Subtract ${coefTxt(a)} from both sides${c === 1 ? '' : ' and divide by ' + c}: ${b(lineEq(mm, q))}.`, 4);
  }),
  R(/^Write equations in standard form$/, () => () => {
    const a = nz(1, 4), c = nz(1, 4), d = nz(-9, 9), mm = -a / c; if (!Number.isInteger(mm)) return null; const bb = d / c;
    return mc(`Write ${m(lineEq(mm, bb))} in standard form ${m('Ax + By = C')}.`, stdEq(a, c, d), [stdEq(-a, c, d), stdEq(a, c, -d), stdEq(a, -c, d)], `Move the x-term: ${b(stdEq(a, c, d))}.`, 4);
  }),
  R(/^Standard form: find x- and y-intercepts$/, () => () => {
    const a = ri(1, 4), c = ri(1, 4), k = ri(2, 6), d = a * c * k;
    return mc(`What are the x- and y-intercepts of ${m(`${a}x + ${c}y = ${d}`)}?`, `x-intercept ${d / a}, y-intercept ${d / c}`, [`x-intercept ${d / c}, y-intercept ${d / a}`, `x-intercept ${a}, y-intercept ${c}`, `x-intercept ${S(-d / a)}, y-intercept ${d / c}`], `Set y = 0 for x: ${d / a}; set x = 0 for y: ${d / c}.`, 4);
  }),
  R(/^Standard form: graph an equation$/, () => () => {
    const a = ri(1, 3), c = ri(1, 3), k = ri(2, 4), d = a * c * k; const xi = d / a, yi = d / c;
    return mc(`${plane({ min: -8, max: 8, points: [{ x: xi, y: 0, color: C.blue }, { x: 0, y: yi, color: C.blue }], lines: [segFor(-a / c, d / c)], labelEvery: 2, size: 300 })}Which equation has this graph?`, `${a}x + ${c}y = ${d}`, [`${a}x + ${c}y = ${d + 1}`, `${c}x + ${a}y = ${d}`, `${a}x − ${c}y = ${d}`].filter(v_ => v_ !== `${a}x + ${c}y = ${d}`), `The intercepts are (${xi}, 0) and (0, ${yi}).`, 4);
  }),
  R(/^Equations of horizontal and vertical lines$|^Graph a horizontal or vertical line$/, () => () => {
    const k = nz(-6, 6), horiz = Math.random() < 0.5;
    return mc(`${horiz ? plane({ min: -8, max: 8, lines: [[-8, k, 8, k]], labelEvery: 2, size: 280 }) : plane({ min: -8, max: 8, lines: [[k, -8, k, 8]], labelEvery: 2, size: 280 })}What is the equation of the line?`, `${horiz ? 'y' : 'x'} = ${S(k)}`, [`${horiz ? 'x' : 'y'} = ${S(k)}`, `${horiz ? 'y' : 'x'} = ${S(-k)}`, `y = ${S(k)}x`], `A ${horiz ? 'horizontal' : 'vertical'} line has the equation ${b(`${horiz ? 'y' : 'x'} = ${S(k)}`)}.`, 4);
  }),
  R(/^Point-slope form: (?:graph an equation|write an equation(?: from a graph)?)$/, (mt, ctx) => () => {
    const mm = nz(-4, 4), x1 = nz(-4, 4), y1 = nz(-5, 5); if (Math.abs(x1) === Math.abs(y1)) return null; const good = `y ${y1 < 0 ? '+' : MINUS} ${Math.abs(y1)} = ${mm === 1 ? '' : mm === -1 ? MINUS : S(mm)}(x ${x1 < 0 ? '+' : MINUS} ${Math.abs(x1)})`.replace(/y [−+] 0/, 'y');
    if (/graph an equation/.test(ctx.title)) return mc(`Which point is on the line ${m(good)}?`, pt(x1, y1), [pt(y1, x1), pt(-x1, y1), pt(x1, -y1)].filter(v_ => v_ !== pt(x1, y1)), `The equation is y − y₁ = m(x − x₁), so (x₁, y₁) = ${b(pt(x1, y1))}.`, 4);
    return mc(`Write the equation of the line with slope ${b(S(mm))} through ${b(pt(x1, y1))} in point-slope form.`, good, uniq([good.replace(/y [−+] \d+/, `y ${y1 < 0 ? MINUS : '+'} ${Math.abs(y1)}`), good.replace(/\(x [−+] (\d+)\)/, `(x ${x1 < 0 ? MINUS : '+'} $1)`), `y = ${S(mm)}x ${y1 < 0 ? MINUS : '+'} ${Math.abs(y1)}`]).filter(v_ => v_ !== good), `y − ${P(y1)} = ${S(mm)}(x − ${P(x1)}).`, 4);
  }),
  R(/^Slopes of parallel and perpendicular lines$|^Write an equation for a parallel or perpendicular line$/, (mt, ctx) => () => {
    const [n, d] = pick([[2, 1], [3, 2], [-1, 3], [-4, 1], [1, 2]]), par = Math.random() < 0.5, mm = n / d, pm = par ? mm : -d / n;
    if (/Write/.test(ctx.title)) { const bb = ri(-4, 4), px = ri(-3, 3), py = ri(-4, 4), newM = pm; if (!Number.isInteger(newM)) return null; const nb = py - newM * px; return mc(`Write the equation of the line through ${b(pt(px, py))} that is ${b(par ? 'parallel' : 'perpendicular')} to ${m(`y = ${S(mm)}x + ${bb}`.replace('+ -', '− '))}.`, lineEq(newM, nb), lineChoices(newM, nb).slice(0, 3), `The slope is ${S(newM)}; then solve for b using the point.`, 4); }
    return mc(`A line has slope ${b(frac(n, d))}. What is the slope of a line ${b(par ? 'parallel' : 'perpendicular')} to it?`, frac(par ? n : -d, par ? d : n), uniq([frac(-n, d), frac(d, n), frac(-d, n), frac(n, d)]).filter(v_ => v_ !== frac(par ? n : -d, par ? d : n)), par ? 'Parallel lines have equal slopes.' : 'Perpendicular slopes are negative reciprocals.', 4);
  }),
  R(/^Find the distance between a point and a line$|^Find the distance between two parallel lines$/, (mt, ctx) => () => {
    const [a, c, h] = pick([[3, 4, 5], [5, 12, 13]]), d = ri(1, 4) * h, k = ri(1, 3);
    return /parallel/.test(ctx.title) ? num(`Find the distance between the parallel lines ${m(`${a}x + ${c}y = 0`)} and ${m(`${a}x + ${c}y = ${d * k}`)}.`, k * d / h, `|${d * k}| ÷ √(${a}² + ${c}²) = ${b(k * d / h)}.`) : num(`Find the distance from the origin to the line ${m(`${a}x + ${c}y = ${d * k}`)}.`, k * d / h, `|${d * k}| ÷ √(${a}² + ${c}²) = ${b(k * d / h)}.`);
  }),
  R(/^Compare linear functions: graphs, tables and equations$/, () => () => {
    const m1 = ri(1, 5), m2 = ri(1, 5); if (m1 === m2) return null; return mc(`Function A is ${m(`y = ${m1}x + 2`)}. Function B has a table with y increasing by ${m2} for every 1 step in x. Which has the greater rate of change?`, m1 > m2 ? 'Function A' : 'Function B', [m1 > m2 ? 'Function B' : 'Function A'], `A: ${m1}; B: ${m2}.`, 2);
  }),
  R(/^Graph a linear function$/, () => () => {
    const mm = nzSlope(), bb = ri(-4, 4); return mc(`${gridLine(mm, bb)}Which function is graphed?`, lineEq(mm, bb).replace('y', 'f(x)'), lineChoices(mm, bb).slice(0, 3).map(v_ => v_.replace('y', 'f(x)')), `The line has slope ${S(mm)} and y-intercept ${S(bb)}.`, 4);
  }),
  R(/^Graph a proportional relationship$/, () => () => {
    const k = nz(-4, 4); return mc(`${gridLine(k, 0)}Which equation describes this proportional relationship?`, `y = ${k === 1 ? '' : k === -1 ? MINUS : S(k)}x`, [`y = ${S(k)}x + 1`, `y = ${S(-k)}x`, `y = x ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`], `It passes through the origin with slope ${S(k)}.`, 4);
  }),
  R(/^Find the constant of variation$|^Write direct variation equations$|^Write and solve direct variation equations$/, (mt, ctx) => () => {
    const k = ri(2, 9), x = ri(2, 8); if (/constant/.test(ctx.title)) return num(`y varies directly with x, and y = ${b(k * x)} when x = ${b(x)}. What is the constant of variation?`, k, `${k * x} ÷ ${x} = ${b(k)}.`);
    if (/solve/.test(ctx.title)) { const x2 = ri(2, 10); return num(`y varies directly with x, and y = ${k * x} when x = ${x}. Find y when x = ${b(x2)}.`, k * x2, `y = ${k}x, so y = ${b(k * x2)}.`); }
    return mc(`y varies directly with x, and y = ${b(k * x)} when x = ${b(x)}. Which equation models this?`, `y = ${k}x`, [`y = x + ${k * x - x}`, `y = ${x}x`, `y = x ÷ ${k}`], `y = kx with k = ${k * x} ÷ ${x} = ${k}.`, 4);
  }),
  R(/^Identify direct variation and inverse variation$|^Write inverse variation equations$|^Write and solve inverse variation equations$/, (mt, ctx) => () => {
    const k = ri(2, 12), x = pick([1, 2, 3, 4, 6]), y = k * (12 / 12) / x * x === 0 ? 1 : (k * 6) / x; const K = k * 6;
    if (/Identify/.test(ctx.title)) { const dir = Math.random() < 0.5; return mc(`${table(['x', 1, 2, 3, 6], [['y', ...(dir ? [k, 2 * k, 3 * k, 6 * k] : [6 * k, 3 * k, 2 * k, k])]])}Is this direct or inverse variation?`, dir ? 'Direct variation' : 'Inverse variation', [dir ? 'Inverse variation' : 'Direct variation'], dir ? 'y ÷ x is constant.' : 'x × y is constant.', 2); }
    if (/solve/.test(ctx.title)) { const x2 = pick([2, 3, 4, 6].filter(v_ => v_ !== x)); return num(`y varies inversely with x, and y = ${K / x} when x = ${x}. Find y when x = ${b(x2)}.`, K / x2, `xy = ${K}, so y = ${K} ÷ ${x2} = ${b(K / x2)}.`); }
    return mc(`y varies inversely with x, and y = ${b(K / x)} when x = ${b(x)}. Which equation models this?`, `y = ${K}/x`, [`y = ${K / x}x`, `y = x/${K}`, `y = ${K / x} + x`], `xy = ${K}, so ${b(`y = ${K}/x`)}.`, 4);
  }),

  /* ===== systems of equations ===== */
  R(/^Is \(x, y\) a solution to the system of equations\?$/, () => () => {
    const s = sysInt(), isSol = Math.random() < 0.5, px = isSol ? s.x : s.x + nz(-2, 2), py = isSol ? s.y : s.y + nz(-2, 2), ok = s.e1[0] * px + s.e1[1] * py === s.e1[2] && s.e2[0] * px + s.e2[1] * py === s.e2[2];
    return yesNo(`Is ${b(pt(px, py))} a solution of the system?<br>${sysTxt(s)}`, ok, ok ? 'It satisfies both equations.' : 'It fails at least one equation.', ['Yes', 'No']);
  }),
  R(/^Solve a system of equations by graphing(?:: word problems)?$/, (mt, ctx) => () => {
    const x = nz(-4, 4), y = nz(-4, 4), m1 = pick([-2, -1, 1, 2]), m2 = pick([-1, 1, 2, 0.5].filter(v_ => v_ !== m1)), b1 = y - m1 * x, b2 = y - m2 * x; if (!Number.isInteger(b2) || Math.abs(b1) > 7 || Math.abs(b2) > 7 || Math.abs(x) === Math.abs(y)) return null;
    if (/word/.test(ctx.title)) { const a = ri(2, 6), c = ri(2, 6), n = ri(2, 6); if (a === c) return null; return mc(`Gym A charges a $${c * n} fee plus $${a} per visit and Gym B charges a $${a * n} fee plus $${c} per visit. After how many visits do they cost the same?`, String(n), [String(n + 1), String(n - 1 || 2), String(n * 2)], `${c * n} + ${a}v = ${a * n} + ${c}v gives v = ${b(n)}.`, 4); }
    return mc(`${plane({ min: -8, max: 8, lines: [segFor(m1, b1), segFor(m2, b2)], labelEvery: 2, size: 300 })}The graph shows the system ${m(lineEq(m1, b1))} and ${m(lineEq(m2, b2))}. What is the solution?`, pt(x, y), [pt(y, x), pt(x, -y), pt(-x, y)].filter(v_ => v_ !== pt(x, y)), `The lines cross at ${b(pt(x, y))}.`, 4);
  }),
  R(/^Solve a system of equations using substitution(?:: word problems)?$|^Solve a system of equations using elimination(?:: word problems)?$|^Solve a system of equations using any method(?:: word problems)?$/, (mt, ctx) => () => {
    const s = sysInt(), t = ctx.title, method = /substitution/.test(t) ? 'substitution' : /elimination/.test(t) ? 'elimination' : 'any method';
    if (/word/.test(t)) { const a = ri(2, 6), c = ri(2, 6), x = ri(2, 9), y = ri(2, 9); if (a === c) return null; return mc(`${a} adult tickets and ${c} child tickets cost $${a * x + c * y}. ${c} adult tickets and ${a} child tickets cost $${c * x + a * y}. What is the price of an adult ticket?`, `$${x}`, [`$${y}`, `$${x + 1}`, `$${x + y}`], `Subtract and solve: adult tickets cost ${b('$' + x)}.`, 4); }
    return mc(`Solve by ${method}:<br>${sysTxt(s)}`, pt(s.x, s.y), uniq([pt(s.y, s.x), pt(-s.x, s.y), pt(s.x, -s.y), pt(s.x + 1, s.y)]).filter(v_ => v_ !== pt(s.x, s.y)), `Solving gives ${b(pt(s.x, s.y))}.`, 4);
  }),
  R(/^Find the number of solutions to a system of equations(?: by graphing)?$|^Classify a system of equations(?: by graphing)?$/, (mt, ctx) => () => {
    const kind = pick(['one', 'none', 'infinite']), mm = nzSlope(), bb = ri(-4, 4), m2 = kind === 'one' ? mm + pick([1, -1, 2]) : mm, b2 = kind === 'infinite' ? bb : bb + nz(1, 3);
    const label = { one: 'One solution', none: 'No solution', infinite: 'Infinitely many solutions' }[kind], cls = { one: 'Consistent and independent', none: 'Inconsistent', infinite: 'Consistent and dependent' }[kind];
    if (/Classify/.test(ctx.title)) return mc(`Classify the system:<br>${m(lineEq(mm, bb))}<br>${m(lineEq(m2, b2))}`, cls, ['Consistent and independent', 'Inconsistent', 'Consistent and dependent'].filter(v_ => v_ !== cls), kind === 'one' ? 'Different slopes: the lines cross once.' : kind === 'none' ? 'Same slope, different intercepts: parallel lines.' : 'The equations describe the same line.', 3);
    return mc(`How many solutions does this system have?<br>${m(lineEq(mm, bb))}<br>${m(lineEq(m2, b2))}`, label, ['One solution', 'No solution', 'Infinitely many solutions'].filter(v_ => v_ !== label), kind === 'one' ? 'Different slopes.' : kind === 'none' ? 'Parallel lines never meet.' : 'The same line.', 3);
  }),
  R(/^Solve a nonlinear system of equations$/, () => () => {
    const x1 = ri(1, 3), x2 = -ri(1, 3), k = x1 + x2, bb = -x1 * x2, lo = Math.min(x1, x2), hi = Math.max(x1, x2), good = `x = ${S(lo)}, ${S(hi)}`;
    return mc(`Solve the system ${m('y = x²')} and ${m(`y = ${k === 0 ? '' : coefTxt(k) + ' + '}${bb}`.replace('+ -', '− '))}. Which x-values are solutions?`, good, uniq([`x = ${S(-hi)}, ${S(-lo)}`, `x = ${S(k)}, ${S(bb)}`, `x = ${S(hi)}, ${S(hi)}`]).filter(v_ => v_ !== good), `Set x² = ${k}x + ${bb}, which factors as (x ${x1 < 0 ? '+' : MINUS} ${Math.abs(x1)})(x ${x2 < 0 ? '+' : MINUS} ${Math.abs(x2)}) = 0: ${b(good)}.`, 4);
  }),
  R(/^Solve a system of equations in three variables using (?:substitution|elimination)$|^Determine the number of solutions to a system of equations in three variables$/, (mt, ctx) => () => {
    const x = ri(-3, 4), y = ri(-3, 4), z = ri(-3, 4), eqs = [[1, 1, 1], [1, -1, 2], [2, 1, -1]].map(c => [...c, c[0] * x + c[1] * y + c[2] * z]);
    if (/Determine/.test(ctx.title)) { const kind = pick(['one', 'none']); return mc(`A system of three linear equations in three variables has ${kind === 'one' ? 'planes that meet at a single point' : 'two parallel planes'}. How many solutions does it have?`, kind === 'one' ? 'Exactly one solution' : 'No solution', [kind === 'one' ? 'No solution' : 'Exactly one solution', 'Infinitely many solutions'], kind === 'one' ? 'One common point.' : 'Parallel planes never meet.', 3); }
    const ask = pick(['x', 'y', 'z']), val = { x, y, z }[ask];
    return num(`Solve the system:<br>${eqs.map(e => m(`${S(e[0])}x ${e[1] < 0 ? MINUS : '+'} ${Math.abs(e[1])}y ${e[2] < 0 ? MINUS : '+'} ${Math.abs(e[2])}z = ${S(e[3])}`)).join('<br>')}What is ${b(ask)}?`, val, `Eliminating variables gives ${ask} = ${b(S(val))}.`);
  }),

  /* ===== exponential & logarithmic ===== */
  R(/^Evaluate exponential functions$/, () => () => {
    const a = ri(1, 5), base = pick([2, 3, 4, 5]), x = ri(0, 4); return num(`${m(`f(x) = ${a === 1 ? '' : a}(${base})<sup>x</sup>`)}. Find ${m(`f(${x})`)}.`, a * base ** x, `${a} × ${base}^${x} = ${b(a * base ** x)}.`);
  }),
  R(/^Match exponential functions and graphs(?: I| II)?$/, () => () => {
    const a = pick([1, 2, 3]), base = pick([2, 3]), growth = Math.random() < 0.6, g = growth ? base : 1 / base;
    return mc(`The graph of ${m(`y = ${a}(${growth ? base : '1/' + base})<sup>x</sup>`)} crosses the y-axis at which point, and is it increasing or decreasing?`, `${pt(0, a)}, ${growth ? 'increasing' : 'decreasing'}`, [`${pt(0, a)}, ${growth ? 'decreasing' : 'increasing'}`, `${pt(0, 1)}, ${growth ? 'increasing' : 'decreasing'}`, `${pt(a, 0)}, ${growth ? 'increasing' : 'decreasing'}`], `y(0) = ${a}, and the base is ${growth ? 'greater' : 'less'} than 1.`, 4);
  }),
  R(/^Linear functions over unit intervals$|^Exponential functions over unit intervals$/, (mt, ctx) => () => {
    const lin = /Linear/.test(ctx.title), a = ri(2, 6), r = ri(2, 4); return lin ? num(`A linear function has ${m(`f(2) = ${a * 2 + 1}`)} and ${m(`f(3) = ${a * 3 + 1}`)}. By how much does f change over each unit interval?`, a, `${a * 3 + 1} − ${a * 2 + 1} = ${b(a)}.`) : num(`An exponential function has ${m(`f(2) = ${a * r * r}`)} and ${m(`f(3) = ${a * r ** 3}`)}. By what factor does f multiply over each unit interval?`, r, `${a * r ** 3} ÷ ${a * r * r} = ${b(r)}.`);
  }),
  R(/^Describe linear and exponential growth and decay$/, () => () => {
    const q = pick([['y = 5(1.2)^x', 'exponential growth'], ['y = 5(0.8)^x', 'exponential decay'], ['y = 5 + 2x', 'linear growth'], ['y = 20 − 3x', 'linear decay']]);
    return mc(`Describe the function ${b(q[0])}.`, q[1], ['exponential growth', 'exponential decay', 'linear growth', 'linear decay'].filter(v_ => v_ !== q[1]), `${q[1][0].toUpperCase() + q[1].slice(1)}.`, 4);
  }),
  R(/^Write linear, quadratic and exponential functions$|^Find a quadratic function$/, (mt, ctx) => () => {
    const a = ri(2, 4), r = ri(2, 3); if (/quadratic function/.test(ctx.title)) { const r1 = ri(-4, 0), r2 = ri(1, 4); return mc(`Which quadratic has roots ${b(S(r1))} and ${b(S(r2))} and a leading coefficient of 1?`, `y = ${polyTxt(pmul([1, -r1], [1, -r2]))}`, uniq([`y = ${polyTxt(pmul([1, r1], [1, r2]))}`, `y = ${polyTxt(pmul([1, -r1], [1, r2]))}`, `y = ${polyTxt(pmul([1, r1], [1, -r2]))}`]).filter(v_ => v_ !== `y = ${polyTxt(pmul([1, -r1], [1, -r2]))}`), `y = (x − ${P(r1)})(x − ${P(r2)}) = ${polyTxt(pmul([1, -r1], [1, -r2]))}.`, 4); }
    return mc(`A population starts at ${b(a * 10)} and is multiplied by ${b(r)} every year. Which function gives the population P after t years?`, `P = ${a * 10}(${r})<sup>t</sup>`, [`P = ${a * 10} + ${r}t`, `P = ${r}(${a * 10})<sup>t</sup>`, `P = ${a * 10}t<sup>${r}</sup>`], `Exponential: start × factor^t.`, 4);
  }),
  R(/^Exponential growth and decay(?:: word problems)?$/, (mt, ctx) => () => {
    const P0 = pick([100, 200, 500, 1000]), r = pick([10, 20, 25, 50]), t = ri(2, 3), growth = Math.random() < 0.6, A = fix(P0 * (1 + (growth ? 1 : -1) * r / 100) ** t, 2);
    return num(`A quantity of ${b(P0)} ${growth ? 'grows' : 'decays'} by ${b(r + '%')} each year. What is its value after ${b(t + ' years')}? (round to 2 decimals)`, A, `${P0} × ${1 + (growth ? 1 : -1) * r / 100}^${t} = ${b(A)}.`);
  }),
  R(/^Compound interest: word problems$|^Continuously compounded interest: word problems$/, (mt, ctx) => () => {
    const P0 = pick([500, 1000, 2000, 5000]), r = pick([2, 3, 4, 5]), t = ri(2, 6);
    if (/Continuously/.test(ctx.title)) { const A = fix(P0 * Math.exp((r / 100) * t), 2); return num(`${b('$' + P0)} is invested at ${b(r + '%')} compounded continuously. What is the balance after ${b(t + ' years')}? ($, rounded to 2 decimals) Use A = Pe^(rt).`, A, `A = ${P0}e^(${r / 100}×${t}) = ${b('$' + A)}.`); }
    const n = pick([1, 2, 4, 12]), A = fix(P0 * (1 + r / 100 / n) ** (n * t), 2); return num(`${b('$' + P0)} is invested at ${b(r + '%')} per year compounded ${n === 1 ? 'annually' : n === 2 ? 'semi-annually' : n === 4 ? 'quarterly' : 'monthly'}. What is the balance after ${b(t + ' years')}? ($, rounded to 2 decimals)`, A, `A = P(1 + r/n)^(nt) = ${b('$' + A)}.`);
  }),
  R(/^Convert between exponential and logarithmic form: rational bases$/, () => () => {
    const base = pick([2, 3, 5, 10]), e = ri(2, 4), val = base ** e;
    return mc(`Write ${m(`${base}<sup>${e}</sup> = ${val}`)} in logarithmic form.`, `log<sub>${base}</sub>(${val}) = ${e}`, [`log<sub>${val}</sub>(${base}) = ${e}`, `log<sub>${e}</sub>(${val}) = ${base}`, `log<sub>${base}</sub>(${e}) = ${val}`], `If b^y = x then log_b(x) = y.`, 4);
  }),
  R(/^Evaluate logarithms$|^Evaluate logarithms: mixed review$/, () => () => {
    const base = pick([2, 3, 4, 5, 10]), e = ri(0, 4), neg = Math.random() < 0.2, val = neg ? fs(1, base) : String(base ** e);
    return neg ? num(`${m(`log<sub>${base}</sub>(${stack(1, base)})`)} = ?`, -1, `${base}^(−1) = 1/${base}: ${b(-1)}.`) : num(`${m(`log<sub>${base}</sub>(${val})`)} = ?`, e, `${base}^${e} = ${val}, so the log is ${b(e)}.`);
  }),
  R(/^Identify properties of logarithms$|^Product property of logarithms$|^Quotient property of logarithms$|^Power property of logarithms$|^Properties of logarithms: mixed review$|^Change of base formula$/, (mt, ctx) => () => {
    const t = ctx.title, a = ri(2, 6), c = ri(2, 6), base = pick([2, 3, 5]);
    if (/Change/.test(t)) return mc(`Which expression equals ${m(`log<sub>${base}</sub>(${a})`)}?`, `log(${a}) / log(${base})`, [`log(${base}) / log(${a})`, `log(${a}) × log(${base})`, `log(${a}) − log(${base})`], `Change of base: log_b a = log a ÷ log b.`, 4);
    if (/Product/.test(t)) return mc(`${m(`log<sub>${base}</sub>(${a}) + log<sub>${base}</sub>(${c})`)} = ?`, `log<sub>${base}</sub>(${a * c})`, [`log<sub>${base}</sub>(${a + c})`, `log<sub>${base}</sub>(${a}) × log<sub>${base}</sub>(${c})`, `log<sub>${base * base}</sub>(${a * c})`], `Product property: log a + log c = log(ac).`, 4);
    if (/Quotient/.test(t)) return mc(`${m(`log<sub>${base}</sub>(${a * c}) − log<sub>${base}</sub>(${c})`)} = ?`, `log<sub>${base}</sub>(${a})`, [`log<sub>${base}</sub>(${a * c - c})`, `log<sub>${base}</sub>(${a * c * c})`, `log<sub>${base}</sub>(${a * c}) ÷ log<sub>${base}</sub>(${c})`], `Quotient property: log(ac) − log(c) = log(a).`, 4);
    if (/Power/.test(t)) return mc(`${m(`log<sub>${base}</sub>(${a}<sup>${c}</sup>)`)} = ?`, `${c} log<sub>${base}</sub>(${a})`, [`${a} log<sub>${base}</sub>(${c})`, `log<sub>${base}</sub>(${a}) + ${c}`, `log<sub>${base}</sub>(${a * c})`], `Power property: log(a^c) = c·log(a).`, 4);
    const q = pick([[`log(xy) = log x + log y`, 'Product property'], [`log(x/y) = log x − log y`, 'Quotient property'], [`log(x^n) = n log x`, 'Power property']]);
    return mc(`Which property is ${b(q[0])}?`, q[1], ['Product property', 'Quotient property', 'Power property'].filter(v_ => v_ !== q[1]), `${q[1]}.`, 3);
  }),
  R(/^Solve exponential equations by rewriting the base$|^Solve exponential equations using common logarithms$/, (mt, ctx) => () => {
    const base = pick([2, 3, 5]), e = ri(2, 5), k = ri(1, 3);
    if (/common logarithms/.test(ctx.title)) { const v_ = ri(5, 90), x = fix(Math.log10(v_) / Math.log10(base), 2); return num(`Solve ${m(`${base}<sup>x</sup> = ${v_}`)}. (round x to 2 decimals)`, x, `x = log(${v_}) ÷ log(${base}) ≈ ${b(x)}.`); }
    return num(`Solve ${m(`${base}<sup>x ${MINUS} ${k}</sup> = ${base ** e}`)}.`, e + k, `x − ${k} = ${e}, so x = ${b(e + k)}.`);
  }),
  R(/^Solve logarithmic equations I{1,2}$/, (mt, ctx) => () => {
    const base = pick([2, 3, 5]), e = ri(2, 4), k = ri(1, 5);
    return /II/.test(ctx.title) ? num(`Solve ${m(`log<sub>${base}</sub>(x + ${k}) = ${e}`)}.`, base ** e - k, `x + ${k} = ${base ** e}, so x = ${b(base ** e - k)}.`) : num(`Solve ${m(`log<sub>${base}</sub>(x) = ${e}`)}.`, base ** e, `x = ${base}^${e} = ${b(base ** e)}.`);
  }),

  /* ===== sequences and series ===== */
  R(/^Classify formulas and sequences$|^Identify a sequence as explicit or recursive$/, () => () => {
    const kind = pick(['explicit', 'recursive']), f = kind === 'explicit' ? `a<sub>n</sub> = 3n + 2` : `a<sub>1</sub> = 4, a<sub>n</sub> = a<sub>n−1</sub> + 3`;
    return mc(`Is ${m(f)} an explicit or a recursive formula?`, kind === 'explicit' ? 'Explicit' : 'Recursive', [kind === 'explicit' ? 'Recursive' : 'Explicit'], kind === 'explicit' ? 'It gives any term directly from n.' : 'Each term is defined from the previous term.', 2);
  }),
  R(/^Find terms of (?:an arithmetic |a geometric |a recursive )?sequence$|^Evaluate formulas for sequences$/, (mt, ctx) => () => {
    const t = ctx.title, a = nz(-4, 8), d = nz(2, 6), r = ri(2, 3), n = ri(4, 8);
    if (/geometric/.test(t)) return num(`A geometric sequence has first term ${b(a === 0 ? 2 : Math.abs(a) || 2)} and common ratio ${b(r)}. What is the ${b(n + 'th')} term?`, (Math.abs(a) || 2) * r ** (n - 1), `a·r^(n−1) = ${b((Math.abs(a) || 2) * r ** (n - 1))}.`);
    if (/recursive/.test(t)) { const seq = [a]; for (let i = 1; i < 5; i++) seq.push(2 * seq[i - 1] + 1); return num(`${m(`a<sub>1</sub> = ${S(a)}, a<sub>n</sub> = 2a<sub>n−1</sub> + 1`)}. What is ${m('a<sub>4</sub>')}?`, seq[3], `a₂ = ${S(seq[1])}, a₃ = ${S(seq[2])}, a₄ = ${b(S(seq[3]))}.`); }
    if (/Evaluate formulas/.test(t)) return num(`${m(`a<sub>n</sub> = ${d}n ${a < 0 ? MINUS : '+'} ${Math.abs(a)}`)}. What is ${m(`a<sub>${n}</sub>`)}?`, d * n + a, `${d}(${n}) ${a < 0 ? '−' : '+'} ${Math.abs(a)} = ${b(S(d * n + a))}.`);
    return num(`An arithmetic sequence has first term ${b(S(a))} and common difference ${b(d)}. What is the ${b(n + 'th')} term?`, a + (n - 1) * d, `a + (n − 1)d = ${b(S(a + (n - 1) * d))}.`);
  }),
  R(/^Write a formula for an arithmetic sequence$|^Write a formula for a geometric sequence$|^Write a formula for a recursive sequence$|^Find a recursive formula$|^Find recursive and explicit formulas$|^Convert (?:a recursive formula to an explicit formula|an explicit formula to a recursive formula|between explicit and recursive formulas)$|^Write variable expressions for geometric sequences$/, (mt, ctx) => () => {
    const a = ri(2, 8), d = ri(2, 6), r = ri(2, 4), t = ctx.title, geo = /geometric/.test(t) || /recursive|explicit/.test(t) && Math.random() < 0.4;
    if (geo) { const seq = range(0, 3).map(i => a * r ** i); return mc(`${m(seq.join(', ') + ', …')} is geometric. Which is the explicit formula?`, `a<sub>n</sub> = ${a}(${r})<sup>n−1</sup>`, [`a<sub>n</sub> = ${a}(${r})<sup>n</sup>`, `a<sub>n</sub> = ${a} + ${r}(n − 1)`, `a<sub>n</sub> = ${r}(${a})<sup>n−1</sup>`], `a·r^(n−1).`, 4); }
    const seq = range(0, 3).map(i => a + i * d); return mc(`${m(seq.join(', ') + ', …')} is arithmetic. Which is a formula for the nth term?`, `a<sub>n</sub> = ${a + 0} + ${d}(n − 1)`, [`a<sub>n</sub> = ${a} + ${d}n`, `a<sub>n</sub> = ${d} + ${a}(n − 1)`, `a<sub>n</sub> = ${a}(${d})<sup>n−1</sup>`], `a + (n − 1)d.`, 4);
  }),
  R(/^Sequences: mixed review$/, () => () => {
    const a = ri(2, 8), d = ri(2, 5); return num(`${m(range(0, 4).map(i => a + i * d).join(', ') + ', ___')} What comes next?`, a + 5 * d, `Add ${d}: ${b(a + 5 * d)}.`);
  }),
  R(/^Introduction to sigma notation$/, () => () => {
    const n = ri(3, 5), k = ri(1, 4), val = sum(range(1, n).map(i => k * i)); return num(`Evaluate ${m(`Σ<sub>i=1</sub><sup>${n}</sup> ${k}i`)}.`, val, `${range(1, n).map(i => k * i).join(' + ')} = ${b(val)}.`);
  }),
  R(/^Identify arithmetic and geometric series$/, () => () => {
    const geo = Math.random() < 0.5, a = ri(2, 5), r = ri(2, 3), d = ri(2, 5), seq = range(0, 3).map(i => (geo ? a * r ** i : a + i * d));
    return mc(`Is ${m(seq.join(' + ') + ' + …')} an arithmetic or a geometric series?`, geo ? 'Geometric' : 'Arithmetic', [geo ? 'Arithmetic' : 'Geometric'], geo ? `Each term is multiplied by ${r}.` : `Each term adds ${d}.`, 2);
  }),
  R(/^Find the sum of a finite arithmetic or geometric series$|^Introduction to partial sums$|^Partial sums of arithmetic series$|^Partial sums of geometric series$|^Partial sums: mixed review$/, (mt, ctx) => () => {
    const t = ctx.title, geo = /geometric/.test(t) || (/finite|mixed|Introduction/.test(t) && Math.random() < 0.5), a = ri(2, 6), n = ri(4, 8);
    if (geo) { const r = pick([2, 3]), s = (a * (r ** n - 1)) / (r - 1); return num(`Find the sum of the first ${b(n)} terms of the geometric series with first term ${b(a)} and ratio ${b(r)}.`, s, `S = a(rⁿ − 1)/(r − 1) = ${b(fmt(s))}.`); }
    const d = ri(2, 6), s = (n * (2 * a + (n - 1) * d)) / 2; return num(`Find the sum of the first ${b(n)} terms of the arithmetic series with first term ${b(a)} and common difference ${b(d)}.`, s, `S = n/2 (2a + (n − 1)d) = ${b(s)}.`);
  }),
  R(/^Convergent and divergent geometric series$/, () => () => {
    const r = pick([[1, 2], [1, 3], [3, 2], [2, 1], [1, 4], [5, 4]]), conv = r[0] < r[1]; return mc(`Does the geometric series with common ratio ${b(fs(...r))} converge or diverge?`, conv ? 'Converges' : 'Diverges', [conv ? 'Diverges' : 'Converges'], conv ? '|r| < 1, so it converges.' : '|r| ≥ 1, so it diverges.', 2);
  }),
  R(/^Find the value of an infinite geometric series$/, () => () => {
    const a = ri(2, 12), d = pick([2, 3, 4, 5]), r = fs(1, d), s = (a * d) / (d - 1); return mc(`Find the sum of the infinite geometric series with first term ${b(a)} and common ratio ${b(r)}.`, fs(...simp(a * d, d - 1)), uniq([fs(a, d - 1), fs(a * (d - 1), d), fs(a, d)]).filter(v_ => v_ !== fs(...simp(a * d, d - 1))).map(v_ => v_.replace(/^(\d+)\/1$/, '$1')), `S = a/(1 − r) = ${b(fs(...simp(a * d, d - 1)))}.`.replace(/(\d+)\/1/, '$1'), 4);
  }),
  R(/^Write a repeating decimal as a fraction$/, () => () => {
    const d = ri(1, 8), [n, dd] = simp(d, 9); return mc(`Write ${b('0.' + String(d).repeat(3) + '…')} (repeating) as a fraction in lowest terms.`, fs(n, dd), [fs(d, 10), fs(d, 99), fs(d + 1, 9)], `0.${d}̅ = ${d}/9 = ${b(fs(n, dd))}.`, 4);
  })
];
