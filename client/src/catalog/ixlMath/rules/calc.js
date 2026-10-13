/* Calculus: limits, continuity, derivatives and their applications, integration and its applications. */
import { ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, dec, num, mc, yesNo, near, svg, C, NAMES, gcd, table, plane, MINUS } from '../h.js';
import { R } from '../engine.js';
import { S, P, nz } from './numsys.js';
import { stack, fs, simp } from './fractions.js';
import { polyTxt, pmul, padd, pEval } from './poly.js';

const sup = (a, e) => `${a}<sup>${e}</sup>`;
const num2 = (x, d = 3) => fix(x, d);
const dpoly = co => co.slice(0, -1).map((c, i) => c * (co.length - 1 - i));          // derivative (coefficients high→low)
const ipoly = co => co.map((c, i) => c / (co.length - i));                              // antiderivative without +C
const trimP = co => { const a = co.slice(); while (a.length > 1 && a[0] === 0) a.shift(); return a; };
const fx = co => polyTxt(trimP(co));
const C_ = 'C';

/* ---------- a small function-graph drawing helper ---------- */
function fnGraph({ segs = [], dots = [], asym = [], curves = [], lo = -5, hi = 5, size = 280 }) {
  const pad = 22, U = (size - 2 * pad) / (hi - lo), X = v_ => pad + (v_ - lo) * U, Y = v_ => size - pad - (v_ - lo) * U;
  let inner = '';
  for (let v_ = lo; v_ <= hi; v_++) inner += `<line x1="${X(v_)}" y1="${Y(lo)}" x2="${X(v_)}" y2="${Y(hi)}" stroke="#e2e8f0"/><line x1="${X(lo)}" y1="${Y(v_)}" x2="${X(hi)}" y2="${Y(v_)}" stroke="#e2e8f0"/><text x="${X(v_)}" y="${Y(0) + 13}" font-size="10" text-anchor="middle" fill="${C.ink}">${v_ === 0 ? '' : S(v_)}</text><text x="${X(0) - 5}" y="${Y(v_) + 4}" font-size="10" text-anchor="end" fill="${C.ink}">${v_ === 0 ? '' : S(v_)}</text>`;
  inner += `<line x1="${X(lo)}" y1="${Y(0)}" x2="${X(hi)}" y2="${Y(0)}" stroke="${C.ink}" stroke-width="2"/><line x1="${X(0)}" y1="${Y(lo)}" x2="${X(0)}" y2="${Y(hi)}" stroke="${C.ink}" stroke-width="2"/>`;
  for (const a of asym) inner += `<line x1="${X(a)}" y1="${Y(lo)}" x2="${X(a)}" y2="${Y(hi)}" stroke="${C.red}" stroke-width="1.5" stroke-dasharray="5 4"/>`;
  for (const [x1, y1, x2, y2] of segs) inner += `<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="${C.primary}" stroke-width="3" stroke-linecap="round"/>`;
  for (const pts of curves) inner += `<polyline points="${pts.map(p_ => `${X(p_[0])},${Y(Math.max(lo - 1, Math.min(hi + 1, p_[1])))}`).join(' ')}" fill="none" stroke="${C.primary}" stroke-width="3"/>`;
  for (const d of dots) inner += `<circle cx="${X(d.x)}" cy="${Y(d.y)}" r="5" fill="${d.open ? '#fff' : C.primary}" stroke="${C.primary}" stroke-width="2.5"/>`;
  return svg(size, size, inner, 'aria-label="graph of a function"');
}
const sample_ = (f, a, c, n = 60) => Array.from({ length: n + 1 }, (_, i) => { const x = a + ((c - a) * i) / n; return [x, f(x)]; });

/* a piecewise graph: two linear pieces meeting at x = c with the given left/right limits, f(c) value & open/closed dots */
function jumpGraph() {
  const c = ri(-2, 2), L = ri(-3, 3), Rv = L + nz(-3, 3), fc = pick(['L', 'R', 'none', 'other']), slopeL = pick([0, 1, -1]), slopeR = pick([0, 1, -1]);
  const yAt = (side, x) => (side === 'L' ? L + slopeL * (x - c) : Rv + slopeR * (x - c)), x0 = -5, x1 = 5;
  const segs = [[x0, yAt('L', x0), c, L], [c, Rv, x1, yAt('R', x1)]].filter(s => s.every(v_ => Math.abs(v_) <= 5.5) || true);
  const fVal = fc === 'L' ? L : fc === 'R' ? Rv : fc === 'other' ? Rv + nz(1, 2) : null;
  const dots = [{ x: c, y: L, open: fc !== 'L' }, { x: c, y: Rv, open: fc !== 'R' }];
  if (fc === 'other' && Math.abs(fVal) <= 5) dots.push({ x: c, y: fVal, open: false });
  return { c, L, R: Rv, fVal: fVal === undefined ? null : fVal, hasF: fc !== 'none', segs, dots, equal: L === Rv };
}

const ARROW = '→';
const D_ = (f_, a) => (f_(a + 1e-6) - f_(a - 1e-6)) / 2e-6;

export const CALC_RULES = [
  /* ===== functions & logs not matched earlier ===== */
  R(/^Find values of functions from graphs$/, () => () => {
    const mm = nz(-2, 2), bb = ri(-3, 3), x = ri(-3, 3);
    return num(`${plane({ min: -8, max: 8, lines: [[-8, -8 * mm + bb, 8, 8 * mm + bb]], labelEvery: 2, size: 280 })}What is f(${S(x)})?`, mm * x + bb, `Read the graph at x = ${S(x)}: ${b(S(mm * x + bb))}.`);
  }),
  R(/^Convert between exponential and logarithmic form$/, () => () => {
    const base = pick([2, 3, 5, 10]), e = ri(2, 4), val = base ** e; return mc(`Write ${m(`log<sub>${base}</sub>(${val}) = ${e}`)} in exponential form.`, `${base}<sup>${e}</sup> = ${val}`, [`${base}<sup>${val}</sup> = ${e}`, `${e}<sup>${base}</sup> = ${val}`, `${val}<sup>${e}</sup> = ${base}`], `log_b(x) = y means b^y = x.`, 4);
  }),
  R(/^Evaluate logarithms using properties$/, () => () => {
    const base = pick([2, 3, 5]), a = ri(1, 3), c = ri(1, 3); return num(`${m(`log<sub>${base}</sub>(${base ** a}) + log<sub>${base}</sub>(${base ** c})`)} = ?`, a + c, `${a} + ${c} = ${b(a + c)} (or log(${base ** (a + c)})).`);
  }),

  /* ===== limits from graphs ===== */
  R(/^Find limits using graphs$|^Find one-sided limits using graphs$|^Determine if a limit exists$/, (mt, ctx) => () => {
    const g = jumpGraph(), t = ctx.title;
    if (/one-sided/.test(t)) { const side = pick(['left', 'right']); return num(`${fnGraph(g)}Find ${m(`lim<sub>x${ARROW}${S(g.c)}<sup>${side === 'left' ? '−' : '+'}</sup></sub> f(x)`)}.`, side === 'left' ? g.L : g.R, `Approaching x = ${S(g.c)} from the ${side}, f(x) approaches ${b(S(side === 'left' ? g.L : g.R))}.`); }
    if (/exists/.test(t)) return yesNo(`${fnGraph(g)}Does ${m(`lim<sub>x${ARROW}${S(g.c)}</sub> f(x)`)} exist?`, g.equal, g.equal ? 'The left and right limits are equal.' : `The left limit ${S(g.L)} and right limit ${S(g.R)} differ.`, ['Yes', 'No']);
    if (!g.equal) return mc(`${fnGraph(g)}Find ${m(`lim<sub>x${ARROW}${S(g.c)}</sub> f(x)`)}.`, 'The limit does not exist', [S(g.L), S(g.R), g.hasF ? S(g.fVal) : '0'].filter((v_, i, a) => a.indexOf(v_) === i && v_ !== 'The limit does not exist'), `The left limit (${S(g.L)}) differs from the right limit (${S(g.R)}).`, 4);
    return num(`${fnGraph(g)}Find ${m(`lim<sub>x${ARROW}${S(g.c)}</sub> f(x)`)}.`, g.L, `Both sides approach ${b(S(g.L))}.`);
  }),
  R(/^Find limits at vertical asymptotes using graphs$/, () => () => {
    const a = ri(-3, 3), k = pick([1, -1]), curveL = sample_(x => k / (x - a), -5, a - 0.12), curveR = sample_(x => k / (x - a), a + 0.12, 5), side = pick(['left', 'right']);
    const val = side === 'left' ? (k > 0 ? '−∞' : '∞') : k > 0 ? '∞' : '−∞';
    return mc(`${fnGraph({ curves: [curveL, curveR], asym: [a] })}Find ${m(`lim<sub>x${ARROW}${a}<sup>${side === 'left' ? '−' : '+'}</sup></sub> f(x)`)}.`, val, ['∞', '−∞', '0', 'does not exist'].filter(x => x !== val).slice(0, 3), `The graph goes ${val === '∞' ? 'up' : 'down'} next to the asymptote.`, 4);
  }),
  R(/^Determine end behaviour using graphs$/, () => () => {
    const kind = pick(['asy', 'up', 'down']), h = ri(-3, 3), f = x => (kind === 'asy' ? h + 3 / (x + 6) : kind === 'up' ? x * x / 8 : -x * x / 8), curve = sample_(f, -5, 5), dir = pick([-1, 1]);
    const val = kind === 'asy' ? S(h) : kind === 'up' ? '∞' : '−∞';
    return mc(`${fnGraph({ curves: [curve] })}Find ${m(`lim<sub>x${ARROW}${dir > 0 ? '∞' : '−∞'}</sub> f(x)`)} (the graph continues in the same way beyond the window).`, val, [kind === 'asy' ? S(h + 1) : '0', '∞', '−∞', S(h)].filter((x, i, a) => a.indexOf(x) === i && x !== val).slice(0, 3), `The graph ${kind === 'asy' ? `levels off at y = ${S(h)}` : kind === 'up' ? 'rises without bound' : 'falls without bound'}.`, 4);
  }),

  /* ===== calculating limits ===== */
  R(/^Find limits using power and root laws$|^Find limits using limit laws$|^Find limits of polynomials and rational functions$/, (mt, ctx) => () => {
    const a = ri(-3, 4), t = ctx.title;
    if (/root/.test(t)) { const k = ri(2, 9), r = ri(2, 5); return num(`${m(`lim<sub>x${ARROW}${r * r - k}</sub> √(x + ${k})`)} = ?`, r, `Substitute: √(${r * r - k} + ${k}) = ${b(r)}.`); }
    if (/rational/.test(t)) { const p = [ri(1, 3), ri(-4, 4), ri(-5, 5)], q = [ri(1, 3), ri(1, 4)], den = pEval(q, a); if (den === 0) return null; const v_ = pEval(p, a) / den; return num(`${m(`lim<sub>x${ARROW}${a}</sub> ${stack(fx(p), fx(q))}`)} = ? (round to 3 decimals if needed)`, num2(v_), `Direct substitution: ${b(num2(v_))}.`); }
    const f = [ri(1, 3), ri(-4, 4), ri(-5, 5)], g = [ri(1, 3), ri(-4, 4)]; const v_ = pEval(f, a) * pEval(g, a); return num(`Given ${m(`f(x) = ${fx(f)}`)} and ${m(`g(x) = ${fx(g)}`)}, find ${m(`lim<sub>x${ARROW}${a}</sub> f(x)·g(x)`)}.`, v_, `Use the product law and substitute: ${b(v_)}.`);
  }),
  R(/^Find limits involving factorization and rationalization$/, () => () => {
    const a = nz(-4, 4), k = ri(1, 5);
    if (Math.random() < 0.6) return num(`${m(`lim<sub>x${ARROW}${a}</sub> ${stack(`x² ${MINUS} ${a * a}`, `x ${a < 0 ? '+' : MINUS} ${Math.abs(a)}`)}`)} = ?`, 2 * a, `Factor: (x − ${P(a)})(x + ${P(a)}) ÷ (x − ${P(a)}) = x + ${P(a)} → ${b(S(2 * a))}.`);
    const r = ri(2, 5), a2 = r * r - k; return num(`${m(`lim<sub>x${ARROW}${a2}</sub> ${stack(`√(x + ${k}) ${MINUS} ${r}`, `x ${a2 < 0 ? '+' : MINUS} ${Math.abs(a2)}`)}`)} = ? (round to 3 decimals)`, num2(1 / (2 * r)), `Rationalize: the limit is 1/(2√(${a2 + k})) = ${b(num2(1 / (2 * r)))}.`);
  }),
  R(/^Find limits involving absolute value functions$/, () => () => {
    const a = ri(-3, 3), side = pick(['left', 'right', 'both']);
    return side === 'both' ? mc(`${m(`lim<sub>x${ARROW}${a}</sub> ${stack(`|x ${a < 0 ? '+' : MINUS} ${Math.abs(a)}|`, `x ${a < 0 ? '+' : MINUS} ${Math.abs(a)}`)}`)} = ?`, 'does not exist', ['1', '−1', '0'], 'The left limit is −1 and the right limit is 1.', 4) : num(`${m(`lim<sub>x${ARROW}${a}<sup>${side === 'left' ? '−' : '+'}</sup></sub> ${stack(`|x ${a < 0 ? '+' : MINUS} ${Math.abs(a)}|`, `x ${a < 0 ? '+' : MINUS} ${Math.abs(a)}`)}`)} = ?`, side === 'left' ? -1 : 1, `${side === 'left' ? 'x − a < 0 so |x − a|/(x − a) = −1' : 'x − a > 0 so the ratio is 1'}: ${b(side === 'left' ? -1 : 1)}.`);
  }),
  R(/^Find limits involving trigonometric functions$/, () => () => {
    const k = ri(2, 6), kind = pick(['sinkx', 'sinx_kx', 'cos']);
    if (kind === 'sinkx') return num(`${m(`lim<sub>x${ARROW}0</sub> ${stack(`sin(${k}x)`, 'x')}`)} = ?`, k, `Since sin(u)/u → 1, this equals ${b(k)}.`);
    if (kind === 'sinx_kx') return num(`${m(`lim<sub>x${ARROW}0</sub> ${stack('sin x', `${k}x`)}`)} = ? (as a decimal, round to 3 decimals)`, num2(1 / k), `1/${k} = ${b(num2(1 / k))}.`);
    return num(`${m(`lim<sub>x${ARROW}0</sub> ${stack('1 − cos x', 'x')}`)} = ?`, 0, `This standard limit equals ${b(0)}.`);
  }),
  R(/^Determine end behaviour of polynomial and rational functions$/, () => () => {
    const p = ri(1, 4), q = ri(1, 4), dp = ri(1, 3), dq = ri(1, 3), a = nz(-5, 5), c = nz(1, 4);
    const lim_ = dp > dq ? (a / c > 0 ? '∞' : '−∞') : dp === dq ? fs(...simp(a, c)).replace(/\/1$/, '') : '0';
    return mc(`${m(`lim<sub>x${ARROW}∞</sub> ${stack(`${S(a)}x<sup>${dp}</sup> + ${p}`, `${c}x<sup>${dq}</sup> + ${q}`)}`)} = ?`, dp === dq ? (a % c === 0 ? S(a / c) : (a < 0 ? MINUS : '') + Math.abs(simp(a, c)[0]) + '/' + simp(a, c)[1]) : dp > dq ? (a / c > 0 ? '∞' : '−∞') : '0', uniq(['0', '∞', '−∞', S(a), fs(c, Math.abs(a))]).filter(v_ => v_ !== (dp === dq ? (a % c === 0 ? S(a / c) : (a < 0 ? MINUS : '') + Math.abs(simp(a, c)[0]) + '/' + simp(a, c)[1]) : dp > dq ? (a / c > 0 ? '∞' : '−∞') : '0')).slice(0, 3), dp > dq ? 'The numerator has the higher degree.' : dp === dq ? 'Equal degrees: the ratio of leading coefficients.' : 'The denominator has the higher degree: the limit is 0.', 4);
  }),
  R(/^Find the limit at a vertical asymptote of a rational function I{1,2}$/, () => () => {
    const a = ri(-4, 4), nume = nz(-5, 5), side = pick(['left', 'right', 'both']), pow = pick([1, 2]);
    const sgn = side === 'left' ? -1 : 1, v_ = nume * (pow === 2 ? 1 : sgn) > 0 ? '∞' : '−∞'; if (side === 'both' && pow === 1) return mc(`${m(`lim<sub>x${ARROW}${a}</sub> ${stack(nume, `x ${a < 0 ? '+' : MINUS} ${Math.abs(a)}`)}`)} = ?`, 'does not exist', ['∞', '−∞', '0'], 'The one-sided limits are ∞ and −∞.', 4);
    return mc(`${m(`lim<sub>x${ARROW}${a}${side === 'both' ? '' : `<sup>${side === 'left' ? '−' : '+'}</sup>`}</sub> ${stack(nume, `(x ${a < 0 ? '+' : MINUS} ${Math.abs(a)})${pow === 2 ? '²' : ''}`)}`)} = ?`, v_, ['∞', '−∞', '0', 'does not exist'].filter(x => x !== v_).slice(0, 3), `The denominator → 0⁺${pow === 1 && side === 'left' ? ' (negative side)' : ''}, and the numerator is ${nume > 0 ? 'positive' : 'negative'}: ${b(v_)}.`, 4);
  }),

  /* ===== continuity ===== */
  R(/^Determine continuity using graphs$|^Determine one-sided continuity using graphs$|^Find and analyze points of discontinuity using graphs$|^Determine continuity on an interval using graphs$/, (mt, ctx) => () => {
    const g = jumpGraph(), t = ctx.title, contAt = g.equal && g.hasF && g.fVal === g.L;
    if (/one-sided/.test(t)) { const side = pick(['left', 'right']), ok = side === 'left' ? g.hasF && g.fVal === g.L : g.hasF && g.fVal === g.R; return yesNo(`${fnGraph(g)}Is f continuous from the ${b(side)} at x = ${S(g.c)}?`, ok, ok ? `f(${S(g.c)}) equals the ${side} limit.` : `f(${S(g.c)}) does not equal the ${side} limit (or f is not defined there).`, ['Yes', 'No']); }
    if (/interval/.test(t)) { const ok = contAt || Math.abs(g.c) > 4; return yesNo(`${fnGraph(g)}Is f continuous on the interval ${b(`[${g.c + 1}, ${g.c + 3}]`)}?`, true, 'The graph has no break on that interval (the break is at the left of it).', ['Yes', 'No']); }
    if (/discontinuity/.test(t)) { const type = g.equal ? (g.hasF && g.fVal === g.L ? 'none' : 'removable') : 'jump'; if (type === 'none') return null; return mc(`${fnGraph(g)}What type of discontinuity does f have at x = ${S(g.c)}?`, type === 'jump' ? 'Jump' : 'Removable (hole)', ['Jump', 'Removable (hole)', 'Infinite'].filter(v_ => v_ !== (type === 'jump' ? 'Jump' : 'Removable (hole)')), type === 'jump' ? 'The one-sided limits differ.' : 'The limit exists but f(c) is missing or different.', 3); }
    return yesNo(`${fnGraph(g)}Is f continuous at x = ${S(g.c)}?`, contAt, contAt ? 'The limit exists and equals f(c).' : g.equal ? 'The limit exists but does not equal f(c).' : 'The limit does not exist.', ['Yes', 'No']);
  }),
  R(/^Determine the continuity of a piecewise function at a point$|^Make a piecewise function continuous$/, (mt, ctx) => () => {
    const a = ri(1, 4), m1 = ri(1, 3), b1 = ri(-3, 3), val = m1 * a + b1;
    if (/Make/.test(ctx.title)) return num(`A function is ${m1}x + ${S(b1)} for x < ${a} and kx for x ≥ ${a}. For what value of k is f continuous at x = ${a}? (round to 3 decimals)`, fix(val / a, 3), `Match the pieces at x = ${a}: ${m1}(${a}) + ${S(b1)} = k(${a}), so k = ${b(fix(val / a, 3))}.`);
    const cont = Math.random() < 0.5, rhs = cont ? val : val + pick([-2, -1, 1, 2]); return yesNo(`A function is ${m1}x + ${S(b1)} for x < ${a} and ${S(rhs)} for x ≥ ${a}. Is f continuous at x = ${a}?`, cont, cont ? `Both pieces equal ${val} at x = ${a}.` : `The left piece gives ${val} but the right piece gives ${rhs}.`, ['Yes', 'No']);
  }),
  R(/^Intermediate Value Theorem$/, () => () => {
    const lo = ri(-5, -1), hi = lo + ri(2, 6), f1 = nz(-9, -1), f2 = ri(1, 9); return mc(`f is continuous on [${lo}, ${hi}] with f(${lo}) = ${S(f1)} and f(${hi}) = ${f2}. What does the Intermediate Value Theorem guarantee?`, `f(c) = 0 for some c in (${lo}, ${hi})`, [`f(c) = 0 for every c`, `f is increasing on the interval`, `f has a maximum at ${lo}`], 'f changes sign, so it crosses 0 on the interval.', 4);
  }),

  /* ===== derivative basics ===== */
  R(/^Average rate of change I{1,2}$/, (mt, ctx) => () => {
    const a = ri(0, 3), h = ri(1, 4), co = [ri(1, 3), ri(-3, 3), ri(0, 4)], f = x => pEval(co, x), rate = (f(a + h) - f(a)) / h;
    return num(`${m(`f(x) = ${fx(co)}`)}. Find the average rate of change from x = ${b(a)} to x = ${b(a + h)}.`, num2(rate), `[f(${a + h}) − f(${a})] ÷ ${h} = ${b(num2(rate))}.`);
  }),
  R(/^Find instantaneous rates of change$|^Find values of derivatives using limits$|^Find the slope of a tangent line using limits$/, (mt, ctx) => () => {
    const co = [ri(1, 3), ri(-4, 4), ri(-3, 3)], a = ri(-2, 3), slope = pEval(dpoly(co), a);
    return num(`${m(`f(x) = ${fx(co)}`)}. Use the limit definition to find ${/slope/.test(ctx.title) ? 'the slope of the tangent line at' : /values/.test(ctx.title) ? `f′(${a}) — that is,` : 'the instantaneous rate of change at'} x = ${b(a)}.`, slope, `f′(x) = ${fx(dpoly(co))}, so at x = ${a} the value is ${b(S(slope))}.`);
  }),
  R(/^Find equations of tangent lines using limits$/, () => () => {
    const co = [ri(1, 2), ri(-3, 3), ri(-3, 3)], a = nz(-2, 2), y0 = pEval(co, a), mm = pEval(dpoly(co), a); if (mm === 0 || y0 === 0 || y0 === mm) return null; const good = `y = ${S(mm)}x ${y0 - mm * a < 0 ? MINUS : '+'} ${Math.abs(y0 - mm * a)}`;
    return mc(`Find the equation of the tangent line to ${m(`f(x) = ${fx(co)}`)} at x = ${b(a)}.`, good, uniq([`y = ${S(-mm)}x ${y0 + mm * a < 0 ? MINUS : '+'} ${Math.abs(y0 + mm * a)}`, `y = ${S(mm)}x ${y0 < 0 ? MINUS : '+'} ${Math.abs(y0)}`, `y = ${S(y0)}x ${mm < 0 ? MINUS : '+'} ${Math.abs(mm)}`]).filter(v_ => v_ !== good), `f(${a}) = ${y0}, f′(${a}) = ${mm}: y − ${P(y0)} = ${S(mm)}(x − ${P(a)}).`, 4);
  }),
  R(/^Velocity as a rate of change$/, () => () => {
    const co = [ri(1, 3), ri(-6, 6), ri(0, 8)], t0 = ri(1, 4), v_ = pEval(dpoly(co), t0); return num(`A particle's position is ${m(`s(t) = ${fx(co)}`)} metres after t seconds. What is its velocity at t = ${b(t0)}? (m/s)`, v_, `v = s′(t) = ${fx(dpoly(co))}; at t = ${t0}: ${b(S(v_))}.`);
  }),

  /* ===== derivative rules & calculation ===== */
  R(/^Power rule I{1,2}$|^Find derivatives of polynomials$/, (mt, ctx) => () => {
    const co = trimP([nz(-4, 5), ri(-5, 5), ri(-5, 5), ri(-6, 6)].slice(0, ri(2, 4))), d = dpoly(co);
    if (Math.random() < 0.5) { const a = ri(-2, 3); return num(`${m(`f(x) = ${fx(co)}`)}. Find ${m(`f′(${S(a)})`)}.`, pEval(d, a), `f′(x) = ${fx(d)}, so f′(${S(a)}) = ${b(S(pEval(d, a)))}.`); }
    const ans = fx(d), wrong = uniq([fx(co.map((c, i) => c)), fx(d.map(c => c + 1)), fx(co.slice(0, -1).map((c, i) => c * (co.length - 2 - i) + 1)), fx(d.map(c => -c))]).filter(v_ => v_ !== ans);
    return mc(`Differentiate ${m(`f(x) = ${fx(co)}`)}.`, ans.startsWith('0') ? '0' : ans, wrong, `Apply the power rule term by term: ${b(ans)}.`, 4);
  }),
  R(/^Find derivatives of rational functions$/, () => () => {
    const n = ri(1, 4), a = nz(1, 5), x0 = ri(1, 3); // f(x) = a / x^n  → f'(x) = −a n / x^(n+1)
    return mc(`Differentiate ${m(`f(x) = ${stack(a, `x<sup>${n}</sup>`)}`)}.`, `${S(-a * n)}/x<sup>${n + 1}</sup>`, [`${S(a * n)}/x<sup>${n + 1}</sup>`, `${S(-a * n)}/x<sup>${n - 1 || 1}</sup>`, `${S(-a)}/x<sup>${n + 1}</sup>`].filter((v_, i, ar) => ar.indexOf(v_) === i), `Rewrite as ${a}x^${-n} and use the power rule: ${b(`${S(-a * n)}/x^${n + 1}`)}.`, 4);
  }),
  R(/^Find derivatives of trigonometric functions I{1,2}$/, (mt, ctx) => () => {
    const chain = /II/.test(ctx.title);
    if (chain) { const k = ri(2, 5), [f, d, sg] = pick([['sin', 'cos', 1], ['cos', 'sin', -1]]); return mc(`Differentiate ${m(`f(x) = ${f}(${k}x)`)}.`, `${sg < 0 ? MINUS : ''}${k}${d}(${k}x)`, [`${sg < 0 ? MINUS : ''}${d}(${k}x)`, `${sg < 0 ? '' : MINUS}${k}${d}(${k}x)`, `${k}${f}(${k}x)`], `Chain rule: the inside derivative ${k} times ${sg < 0 ? '−sin' : 'cos'}(${k}x).`, 4); }
    const a = ri(2, 6), [f, d, neg, wrongFn] = pick([['sin', 'cos', false, 'sin'], ['cos', 'sin', true, 'cos'], ['tan', 'sec²', false, 'tan']]);
    const ans = `${neg ? MINUS : ''}${a}${d} x`;
    return mc(`Differentiate ${m(`f(x) = ${a}${f} x`)}.`, ans, uniq([`${neg ? '' : MINUS}${a}${d} x`, `${a}${wrongFn} x`, `${neg ? MINUS : ''}${a}${f === 'sin' ? 'sin' : f === 'cos' ? 'cos' : 'tan'} x`, `${a}${f === 'sin' ? 'cos' : f === 'cos' ? 'cos' : 'sec²'} x`]).filter(v_ => v_ !== ans), `d/dx ${f} x = ${neg ? '−' : ''}${d} x.`, 4);
  }),
  R(/^Find derivatives of exponential functions$/, () => () => {
    const k = ri(2, 5), base = pick([2, 3, 5]), kind = pick(['ekx', 'ax']);
    return kind === 'ekx' ? mc(`Differentiate ${m(`f(x) = e<sup>${k}x</sup>`)}.`, `${k}e<sup>${k}x</sup>`, [`e<sup>${k}x</sup>`, `${k}xe<sup>${k - 1}x</sup>`, `${k}e<sup>x</sup>`], `Chain rule: ${b(`${k}e^${k}x`)}.`, 4) : mc(`Differentiate ${m(`f(x) = ${base}<sup>x</sup>`)}.`, `${base}<sup>x</sup> ln ${base}`, [`x${base}<sup>x−1</sup>`, `${base}<sup>x</sup>`, `${base}<sup>x</sup>/ln ${base}`], `d/dx a^x = a^x ln a.`, 4);
  }),
  R(/^Find derivatives of logarithmic functions$/, () => () => {
    const k = ri(2, 6), kind = pick(['lnx', 'lnkx', 'logb']);
    return kind === 'lnx' ? mc(`Differentiate ${m(`f(x) = ${k} ln x`)}.`, `${k}/x`, [`${k} ln x`, `1/(${k}x)`, `${k}/x²`], `d/dx ln x = 1/x.`, 4) : kind === 'lnkx' ? mc(`Differentiate ${m(`f(x) = ln(${k}x)`)}.`, '1/x', [`${k}/x`, `1/(${k}x)`, `${k}`], `ln(kx) = ln k + ln x, so the derivative is 1/x.`, 4) : mc(`Differentiate ${m(`f(x) = log<sub>${k}</sub>(x)`)}.`, `1/(x ln ${k})`, [`1/x`, `ln ${k}/x`, `${k}/x`], `d/dx log_b x = 1/(x ln b).`, 4);
  }),
  R(/^Find derivatives of inverse trigonometric functions$/, () => () => {
    const [f, d] = pick([['sin⁻¹ x', '1/√(1 − x²)'], ['tan⁻¹ x', '1/(1 + x²)'], ['cos⁻¹ x', '−1/√(1 − x²)']]);
    return mc(`Differentiate ${m(`f(x) = ${f}`)}.`, d, ['1/√(1 − x²)', '1/(1 + x²)', '−1/√(1 − x²)', '1/(1 − x²)'].filter(v_ => v_ !== d).slice(0, 3), `${f}: derivative is ${b(d)}.`, 4);
  }),
  R(/^Find derivatives of radical functions$/, () => () => {
    const a = ri(2, 6), k = ri(1, 7); return mc(`Differentiate ${m(`f(x) = √(${a}x + ${k})`)}.`, `${a}/(2√(${a}x + ${k}))`, [`1/(2√(${a}x + ${k}))`, `${a}/√(${a}x + ${k})`, `${a}/(2(${a}x + ${k}))`], `Chain rule: ${a} × 1/(2√(${a}x + ${k})).`, 4);
  }),
  R(/^Chain rule$|^Find derivatives using the chain rule I{1,2}$/, (mt, ctx) => () => {
    const a = ri(2, 4), c = ri(1, 5), n = ri(2, 5), x0 = ri(0, 2); const f = x => (a * x + c) ** n, d = x => n * a * (a * x + c) ** (n - 1);
    if (/II/.test(ctx.title)) { const k = ri(2, 4); return num(`${m(`f(x) = sin(${k}x<sup>2</sup>)`)}. Find ${m('f′(0)')}.`, 0, `f′(x) = ${2 * k}x cos(${k}x²), so f′(0) = ${b(0)}.`); }
    return mc(`Differentiate ${m(`f(x) = (${a}x + ${c})<sup>${n}</sup>`)}.`, `${n * a}(${a}x + ${c})<sup>${n - 1}</sup>`, [`${n}(${a}x + ${c})<sup>${n - 1}</sup>`, `${n * a}(${a}x + ${c})<sup>${n}</sup>`, `${a}(${a}x + ${c})<sup>${n - 1}</sup>`], `Outer derivative times inner derivative: ${b(`${n * a}(${a}x + ${c})^${n - 1}`)}.`, 4);
  }),
  R(/^Inverse function rule$/, () => () => {
    const a = ri(2, 5), k = ri(1, 6); return num(`Let ${m(`f(x) = ${a}x + ${k}`)}. If g is the inverse of f, what is ${m('g′(5)')}?`, fix(1 / a, 4), `g′(y) = 1/f′(x) = 1/${a} = ${b(fix(1 / a, 4))}.`);
  }),
  R(/^Find derivatives: mixed review$/, () => () => {
    const a = ri(2, 5), x0 = ri(1, 2), kind = pick(['poly', 'exp', 'trig']);
    return kind === 'poly' ? num(`${m(`f(x) = ${a}x³ − ${a + 1}x`)}. Find ${m(`f′(${x0})`)}.`, 3 * a * x0 * x0 - (a + 1), `f′(x) = ${3 * a}x² − ${a + 1}: ${b(3 * a * x0 * x0 - (a + 1))}.`) : kind === 'exp' ? mc(`Differentiate ${m(`f(x) = x e<sup>x</sup>`)}.`, '(x + 1)e<sup>x</sup>', ['e<sup>x</sup>', 'xe<sup>x</sup>', 'e<sup>x</sup>(x − 1)'], 'Product rule: e^x + xe^x.', 4) : mc(`Differentiate ${m(`f(x) = ${a}x + cos x`)}.`, `${a} − sin x`, [`${a} + sin x`, `${a}x − sin x`, `${a} − cos x`], `d/dx cos x = −sin x.`, 4);
  }),
  R(/^Find derivatives using implicit differentiation$|^Find tangent lines using implicit differentiation$/, (mt, ctx) => () => {
    const [p, q] = pick([[3, 4], [5, 12], [6, 8]]), r2 = p * p + q * q;
    return /tangent/.test(ctx.title) ? mc(`Find the tangent line to ${m(`x² + y² = ${r2}`)} at ${b(`(${p}, ${q})`)}.`, `y = ${fs(-p, q).replace(/^-/, MINUS)}x + ${fs(r2, q)}`, [`y = ${fs(p, q)}x + ${fs(r2, q)}`, `y = ${fs(-p, q).replace(/^-/, MINUS)}x + ${fs(q, p)}`, `y = ${fs(-q, p).replace(/^-/, MINUS)}x + ${fs(r2, p)}`], `Slope = −x/y = ${fs(-p, q)}; then y = ${fs(-p, q)}x + ${fs(r2, q)}.`, 4) : num(`For ${m(`x² + y² = ${r2}`)}, find ${m('dy/dx')} at ${b(`(${p}, ${q})`)}. (as a decimal, round to 3 places)`, num2(-p / q), `2x + 2y·y′ = 0 so y′ = −x/y = ${fs(-p, q)} ≈ ${b(num2(-p / q))}.`);
  }),
  R(/^Find derivatives using logarithmic differentiation$/, () => () => {
    const k = ri(2, 4); return num(`For ${m('y = x<sup>x</sup>')}, find ${m('dy/dx')} at x = ${b(1)}.`, 1, `ln y = x ln x → y′/y = ln x + 1, so y′ = x^x(ln x + 1) = ${b(1)} at x = 1.`);
  }),
  R(/^Find higher derivatives of polynomials$|^Find higher derivatives of rational and radical functions$|^Find second derivatives of trigonometric, exponential and logarithmic functions$|^Find higher derivatives using patterns$/, (mt, ctx) => () => {
    const t = ctx.title;
    if (/patterns/.test(t)) { const n = ri(5, 40), r = n % 4; const ans = ['sin x', 'cos x', '−sin x', '−cos x'][r]; return mc(`What is the ${b(n + 'th')} derivative of ${m('f(x) = sin x')}?`, ans, ['sin x', 'cos x', '−sin x', '−cos x'].filter(v_ => v_ !== ans), `The derivatives of sin x repeat every 4: the ${n}th is ${b(ans)}.`, 4); }
    if (/trigonometric/.test(t)) { const k = ri(2, 4); return mc(`Find the second derivative of ${m(`f(x) = sin(${k}x)`)}.`, `${MINUS}${k * k}sin(${k}x)`, [`${k * k}sin(${k}x)`, `${MINUS}${k}sin(${k}x)`, `${MINUS}${k * k}cos(${k}x)`], `f′ = ${k}cos(${k}x), f″ = ${b(`−${k * k}sin(${k}x)`)}.`, 4); }
    if (/rational and radical/.test(t)) { const a = ri(1, 5); return mc(`Find f″(x) for ${m(`f(x) = ${a}/x`)}.`, `${2 * a}/x³`, [`${MINUS}${2 * a}/x³`, `${a}/x³`, `${2 * a}/x²`], `f′ = −${a}x^−2, f″ = ${b(`${2 * a}x^−3`)}.`, 4); }
    const co = trimP([nz(-3, 4), ri(-4, 4), ri(-5, 5), ri(-5, 5), ri(-4, 4)]), n = ri(2, 3); let d = co; for (let i = 0; i < n; i++) d = dpoly(d); const x0 = ri(-2, 2); return num(`${m(`f(x) = ${fx(co)}`)}. Find the ${b(n === 2 ? 'second' : 'third')} derivative at x = ${b(x0)}.`, pEval(d, x0), `Differentiate ${n} times: ${fx(d)}; evaluate: ${b(S(pEval(d, x0)))}.`);
  }),
  R(/^Relate position, velocity, speed and acceleration using derivatives$/, () => () => {
    const co = [ri(1, 2), ri(-6, 6), ri(-8, 8), 0], t0 = ri(1, 3), v_ = pEval(dpoly(co), t0), a_ = pEval(dpoly(dpoly(co)), t0), ask = pick(['velocity', 'acceleration', 'speed']);
    return num(`A particle moves with position ${m(`s(t) = ${fx(co)}`)}. Find its ${b(ask)} at t = ${b(t0)}.`, ask === 'velocity' ? v_ : ask === 'acceleration' ? a_ : Math.abs(v_), `v = s′ = ${fx(dpoly(co))}; a = s″ = ${fx(dpoly(dpoly(co)))}. ${ask === 'speed' ? 'Speed = |v|' : ''} = ${b(S(ask === 'velocity' ? v_ : ask === 'acceleration' ? a_ : Math.abs(v_)))}.`);
  }),
  R(/^Introduction to related rates$/, () => () => {
    const r = ri(2, 6), drdt = ri(1, 4); return num(`A circle's radius grows at ${b(drdt + ' cm/s')}. How fast is its area growing when r = ${b(r + ' cm')}? (Give the number in front of π.)`, 2 * r * drdt, `A = πr², dA/dt = 2πr·dr/dt = ${b(2 * r * drdt + 'π')} cm²/s.`);
  }),

  /* ===== analysing functions ===== */
  R(/^Mean Value Theorem$/, () => () => {
    const a = ri(0, 2), len = ri(2, 4), c0 = a + len / 2, A = ri(1, 3); const f = x => A * x * x; const lo = a, hi = a + len, avg = (f(hi) - f(lo)) / len, c = avg / (2 * A);
    return num(`${m(`f(x) = ${A === 1 ? '' : A}x²`)} on [${lo}, ${hi}]. Find the value c in (${lo}, ${hi}) given by the Mean Value Theorem.`, c, `[f(${hi}) − f(${lo})]/${len} = ${avg}, and f′(c) = ${2 * A}c = ${avg}, so c = ${b(c)}.`);
  }),
  R(/^Find critical points of functions$/, () => () => {
    const r1 = ri(-4, 1), r2 = r1 + ri(2, 5), dco = pmul([3, 0].slice(0, 1), pmul([1, -r1], [1, -r2])), co = ipoly(dco).concat([0]);
    return mc(`Find the critical numbers of ${m(`f(x) = ${fx(co.map(c => (Number.isInteger(c) ? c : fix(c, 3))))}`)}.`, `x = ${S(r1)}, ${S(r2)}`, uniq([`x = ${S(-r1)}, ${S(-r2)}`, `x = ${S(r1 + r2)}`, `x = ${S(r1)}, ${S(r1 + r2)}`]).filter(v_ => v_ !== `x = ${S(r1)}, ${S(r2)}`), `f′(x) = ${fx(dco)} = 0 at ${b(`x = ${S(r1)}, ${S(r2)}`)}.`, 4);
  }),
  R(/^Find local extrema using the first derivative test$/, () => () => {
    const r1 = ri(-3, 0), r2 = r1 + ri(2, 4), kind = pick(['max', 'min']), loc = kind === 'max' ? r1 : r2;
    return mc(`f′(x) = (x ${r1 < 0 ? '+' : MINUS} ${Math.abs(r1)})(x ${r2 < 0 ? '+' : MINUS} ${Math.abs(r2)}) changes sign at x = ${b(S(r1))} and x = ${b(S(r2))}. At which x does f have a local ${b(kind === 'max' ? 'maximum' : 'minimum')}?`, `x = ${S(loc)}`, [`x = ${S(kind === 'max' ? r2 : r1)}`, 'both', 'neither'], `f′ is positive then negative at the maximum (and negative then positive at the minimum): ${b(`x = ${S(loc)}`)}.`, 4);
  }),
  R(/^Find absolute extrema on a closed interval$/, () => () => {
    const j = ri(1, 3), e0 = ri(0, 3), co = [1, -3 * j, 0, e0], a = -1, c = 4, crit = [0, 2 * j], cand = [a, c, ...crit.filter(v_ => v_ >= a && v_ <= c)], vals = cand.map(x => pEval(co, x)), want = pick(['maximum', 'minimum']), ans = want === 'maximum' ? Math.max(...vals) : Math.min(...vals);
    return num(`Find the absolute ${b(want)} value of ${m(`f(x) = ${fx(co)}`)} on [${a}, ${c}].`, ans, `f′ = 3x² − ${6 * j}x = 0 at x = 0 and ${2 * j}. Compare f at ${cand.join(', ')}: ${b(S(ans))}.`);
  }),
  R(/^Find intervals of increase and decrease$/, () => () => {
    const r1 = ri(-4, 0), r2 = r1 + ri(2, 5), ans = `(${S(r1)}, ${S(r2)})`;
    return mc(`f′(x) = (x ${r1 < 0 ? '+' : MINUS} ${Math.abs(r1)})(x ${r2 < 0 ? '+' : MINUS} ${Math.abs(r2)}). On which interval is f decreasing?`, ans, [`(${MINUS}∞, ${S(r1)})`, `(${S(r2)}, ∞)`, `(${MINUS}∞, ${S(r2)})`], `f′ < 0 between the roots: ${b(ans)}.`, 4);
  }),
  R(/^Identify the graph of the derivative from the graph of the function$|^Identify the graph of a function from the graph of its derivative$|^Identify the graph of the second derivative from the graph of the function$|^Identify the graph of a function using its first and second derivatives$/, (mt, ctx) => () => {
    const q = [['f is increasing on an interval', 'f′ is positive there'], ['f has a local maximum', 'f′ changes from positive to negative'], ['f is concave up', 'f″ is positive'], ['f has an inflection point', 'f″ changes sign'], ['f has a horizontal tangent', 'f′ = 0']], [d, a] = pick(q);
    return mc(`If ${b(d)}, what does that say about the derivatives?`, a, q.map(x => x[1]).filter(v_ => v_ !== a).slice(0, 3), `${d} means ${b(a)}.`, 4);
  }),
  R(/^Find concavity and inflection points$/, () => () => {
    const h = nz(-3, 3), a = ri(1, 3), co = [a, -3 * a * h, 0, 0], ans = `x = ${S(h)}`;
    return mc(`Find the x-coordinate of the inflection point of ${m(`f(x) = ${fx(co)}`)}.`, ans, uniq([`x = ${S(-h)}`, 'x = 0', `x = ${S(2 * h)}`]).filter(v_ => v_ !== ans), `f″(x) = ${6 * a}x ${h > 0 ? MINUS : '+'} ${Math.abs(6 * a * h)} = 0 gives ${b(ans)}.`, 4);
  }),
  R(/^Introduction to optimization$/, () => () => {
    const P0 = ri(3, 12) * 4; return num(`A rectangle has perimeter ${b(P0)}. What is the largest possible area?`, (P0 / 4) ** 2, `The maximum area is a square of side ${P0 / 4}: ${b((P0 / 4) ** 2)}.`);
  }),
  R(/^Linear approximation$/, () => () => {
    const r = ri(2, 6), a = r * r, dx = pick([0.1, 0.2, -0.1]); const approx = r + dx / (2 * r); return num(`Use linear approximation of ${m('f(x) = √x')} at x = ${b(a)} to estimate ${m(`√${fix(a + dx, 1)}`)}. (round to 4 decimals)`, fix(approx, 4), `L(x) = ${r} + (x − ${a})/${2 * r} → ${b(fix(approx, 4))}.`);
  }),

  /* ===== integration ===== */
  R(/^Approximate the area under a curve: (?:left and right endpoints|midpoints|trapezoids)$/, (mt, ctx) => () => {
    const n = pick([4, 5]), w = 2, h0 = ri(1, 3), f = x => x * x + h0, a = 0, bnd = n * w, xs = range(0, n).map(i => a + i * w), t = ctx.title, method = /left/.test(t) ? pick(['left', 'right']) : /mid/.test(t) ? 'midpoint' : 'trapezoid';
    const val = method === 'left' ? w * sum(xs.slice(0, n).map(f)) : method === 'right' ? w * sum(xs.slice(1).map(f)) : method === 'midpoint' ? w * sum(xs.slice(0, n).map(x => f(x + w / 2))) : (w / 2) * (f(xs[0]) + 2 * sum(xs.slice(1, n).map(f)) + f(xs[n]));
    return num(`Approximate the area under ${m(`f(x) = x² + ${h0}`)} on [0, ${bnd}] using ${b(n)} subintervals and the ${b(method)} ${method === 'trapezoid' ? 'rule' : method === 'midpoint' ? 'rule' : 'endpoints'}.`, val, `Width ${w}; sum the function values accordingly: ${b(fmt(val))}.`);
  }),
  R(/^Definite integrals and net area$|^Evaluate definite integrals using graphs$/, () => () => {
    const base = ri(2, 6), h = ri(2, 6), len = base + 2;
    return num(`The graph of f from x = 0 to x = ${len} is a triangle above the x-axis with base ${b(len)} and height ${b(h)}. Find ${m(`∫<sub>0</sub><sup>${len}</sup> f(x) dx`)}.`, (len * h) / 2, `The integral equals the area: ½ × ${len} × ${h} = ${b((len * h) / 2)}.`);
  }),
  R(/^Properties of definite integrals$/, () => () => {
    const a = ri(2, 9), c = ri(2, 9), k = ri(2, 4), kind = pick(['sum', 'const', 'rev']);
    return kind === 'sum' ? num(`${m(`∫<sub>0</sub><sup>3</sup> f(x) dx = ${a}`)} and ${m(`∫<sub>3</sub><sup>7</sup> f(x) dx = ${c}`)}. Find ${m('∫<sub>0</sub><sup>7</sup> f(x) dx')}.`, a + c, `${a} + ${c} = ${b(a + c)}.`) : kind === 'const' ? num(`${m(`∫<sub>0</sub><sup>5</sup> f(x) dx = ${a}`)}. Find ${m(`∫<sub>0</sub><sup>5</sup> ${k}f(x) dx`)}.`, k * a, `Constant multiple: ${k} × ${a} = ${b(k * a)}.`) : num(`${m(`∫<sub>1</sub><sup>4</sup> f(x) dx = ${a}`)}. Find ${m('∫<sub>4</sub><sup>1</sup> f(x) dx')}.`, -a, `Reversing the limits changes the sign: ${b(S(-a))}.`);
  }),
  R(/^Fundamental Theorem of Calculus, Part 1$/, () => () => {
    const k = ri(2, 5), kind = pick(['poly', 'trig']); return kind === 'poly' ? mc(`Let ${m(`F(x) = ∫<sub>1</sub><sup>x</sup> (t² + ${k}t) dt`)}. Find ${m('F′(x)')}.`, `x² + ${k}x`, [`x³/3 + ${k}x²/2`, `2x + ${k}`, `x² + ${k}x − ${k + 1}`], `FTC Part 1: F′(x) = f(x) = ${b(`x² + ${k}x`)}.`, 4) : mc(`Let ${m('F(x) = ∫<sub>0</sub><sup>x</sup> cos t dt')}. Find ${m('F′(x)')}.`, 'cos x', ['sin x', '−sin x', '−cos x'], 'FTC Part 1: F′(x) = cos x.', 4);
  }),
  R(/^Fundamental Theorem of Calculus, Part 2$/, () => () => {
    const a = ri(1, 3), n = ri(1, 3), A = ri(1, 4); const F = x => A * x ** (n + 1) / (n + 1); const val = F(a + 1) - F(a); return num(`Use the Fundamental Theorem to evaluate ${m(`∫<sub>${a}</sub><sup>${a + 1}</sup> ${A === 1 ? '' : A}x<sup>${n}</sup> dx`)}. (round to 3 decimals)`, num2(val), `F(x) = ${fs(...simp(A, n + 1))}x^${n + 1}; F(${a + 1}) − F(${a}) = ${b(num2(val))}.`);
  }),
  R(/^Find antiderivatives$|^Find indefinite integrals using the power rule$|^Find indefinite integrals: mixed review$/, (mt, ctx) => () => {
    const n = ri(1, 5), A = (n + 1) * ri(1, 3), k = ri(1, 4), good = `${fs(...simp(A, n + 1)).replace(/\/1$/, '')}x<sup>${n + 1}</sup> + C`.replace(/^1x/, 'x');
    const f = `${A}x<sup>${n}</sup>`;
    return mc(`Find ${m(`∫ ${f} dx`)}.`, `${A / (n + 1)}x<sup>${n + 1}</sup> + C`, [`${A * (n + 1)}x<sup>${n + 1}</sup> + C`, `${A / (n + 1)}x<sup>${n}</sup> + C`, `${A * n}x<sup>${n - 1}</sup> + C`].filter(v_ => v_ !== `${A / (n + 1)}x<sup>${n + 1}</sup> + C`), `Increase the power by 1 and divide: ${b(`${A / (n + 1)}x^${n + 1} + C`)}.`, 4);
  }),
  R(/^Find indefinite integrals involving exponential and logarithmic functions$/, () => () => {
    const k = ri(2, 6), kind = pick(['ekx', 'inv']); return kind === 'ekx' ? mc(`Find ${m(`∫ e<sup>${k}x</sup> dx`)}.`, `(1/${k})e<sup>${k}x</sup> + C`, [`e<sup>${k}x</sup> + C`, `${k}e<sup>${k}x</sup> + C`, `(1/${k + 1})e<sup>${k + 1}x</sup> + C`], `Divide by the inner coefficient ${k}.`, 4) : mc(`Find ${m(`∫ ${k}/x dx`)}.`, `${k} ln|x| + C`, [`${k}/x² + C`, `ln|${k}x| + C`, `${k}x + C`], `∫ 1/x dx = ln|x|.`, 4);
  }),
  R(/^Find indefinite integrals involving trigonometric functions$/, () => () => {
    const k = ri(2, 5), [f, F, sgn] = pick([['sin x', 'cos x', -1], ['cos x', 'sin x', 1], ['sec² x', 'tan x', 1]]), ans = `${sgn < 0 ? MINUS : ''}${k}${F} + C`;
    return mc(`Find ${m(`∫ ${k}${f} dx`)}.`, ans, uniq([`${sgn < 0 ? '' : MINUS}${k}${F} + C`, `${k}${f} + C`, `${sgn < 0 ? MINUS : ''}${k}${f.replace('sin', 'cos').replace('cos', 'sin')} + C`]).filter(v_ => v_ !== ans), `An antiderivative of ${f} is ${sgn < 0 ? '−' : ''}${F}.`, 4);
  }),
  R(/^Evaluate definite integrals using the power rule$|^Evaluate definite integrals: mixed review$/, (mt, ctx) => () => {
    const co = trimP([ri(1, 3) * 3, ri(-3, 3) * 2, ri(-4, 4)]), a = ri(0, 1), c = a + ri(1, 3), F = ipoly(co).concat([0]), val = pEval(F, c) - pEval(F, a);
    return num(`Evaluate ${m(`∫<sub>${a}</sub><sup>${c}</sup> (${fx(co)}) dx`)}. (round to 3 decimals)`, num2(val), `Antiderivative evaluated at the limits: ${b(num2(val))}.`);
  }),
  R(/^Evaluate definite integrals involving exponential and logarithmic functions$/, () => () => {
    const kind = pick(['e', 'ln']); return kind === 'e' ? num(`Evaluate ${m('∫<sub>0</sub><sup>1</sup> e<sup>x</sup> dx')}. (round to 3 decimals)`, num2(Math.E - 1), `e − 1 ≈ ${b(num2(Math.E - 1))}.`) : (() => { const t = ri(2, 6); return num(`Evaluate ${m(`∫<sub>1</sub><sup>${t}</sup> (1/x) dx`)}. (round to 3 decimals)`, num2(Math.log(t)), `ln ${t} − ln 1 = ${b(num2(Math.log(t)))}.`); })();
  }),
  R(/^Evaluate definite integrals involving trigonometric functions$/, () => () => {
    const [f, lo, hi, val] = pick([['sin x', 0, 'π', 2], ['cos x', 0, 'π/2', 1], ['sin x', 0, 'π/2', 1], ['cos x', 0, 'π', 0]]); return num(`Evaluate ${m(`∫<sub>${lo}</sub><sup>${hi}</sup> ${f} dx`)}.`, val, `The exact value is ${b(val)}.`);
  }),
  R(/^Find indefinite integrals using substitution$|^Evaluate definite integrals using substitution$/, (mt, ctx) => () => {
    const n = ri(2, 4), k = ri(1, 3);
    if (/Evaluate/.test(ctx.title)) { const val = (2 ** (n + 1) - 1) / (n + 1); return num(`Evaluate ${m(`∫<sub>0</sub><sup>1</sup> 2x(x² + 1)<sup>${n}</sup> dx`)} using u = x² + 1. (round to 3 decimals)`, num2(val), `u from 1 to 2: ∫ u^${n} du = (2^${n + 1} − 1)/${n + 1} = ${b(num2(val))}.`); }
    return mc(`Find ${m(`∫ 2x(x² + ${k})<sup>${n}</sup> dx`)}.`, `(x² + ${k})<sup>${n + 1}</sup>/${n + 1} + C`, [`(x² + ${k})<sup>${n + 1}</sup> + C`, `2(x² + ${k})<sup>${n + 1}</sup>/${n + 1} + C`, `x(x² + ${k})<sup>${n + 1}</sup>/${n + 1} + C`], `Let u = x² + ${k}, du = 2x dx.`, 4);
  }),
  R(/^Integrals involving inverse trigonometric functions$/, () => () => {
    const a = ri(2, 6), kind = pick(['atan', 'asin']); return kind === 'atan' ? mc(`Find ${m(`∫ dx/(x² + ${a * a})`)}.`, `(1/${a})tan⁻¹(x/${a}) + C`, [`tan⁻¹(x/${a}) + C`, `(1/${a})ln(x² + ${a * a}) + C`, `${a}tan⁻¹(x/${a}) + C`], `∫ 1/(x² + a²) dx = (1/a) tan⁻¹(x/a).`, 4) : mc(`Find ${m(`∫ dx/√(${a * a} − x²)`)}.`, `sin⁻¹(x/${a}) + C`, [`(1/${a})sin⁻¹(x/${a}) + C`, `cos⁻¹(x/${a}) + C`, `ln|x + √(${a * a} − x²)| + C`], `∫ 1/√(a² − x²) dx = sin⁻¹(x/a).`, 4);
  }),
  R(/^Integrate by completing the square$/, () => () => {
    const h = ri(1, 4), k = ri(1, 3); return mc(`Complete the square in ${m(`x² + ${2 * h}x + ${h * h + k * k}`)}.`, `(x + ${h})² + ${k * k}`, [`(x + ${h})² + ${h * h + k * k}`, `(x − ${h})² + ${k * k}`, `(x + ${2 * h})² + ${k * k}`], `x² + ${2 * h}x + ${h * h} + ${k * k} = (x + ${h})² + ${k * k}.`, 4);
  }),

  /* ===== differential equations & applications ===== */
  R(/^Solve first-order initial value problems$|^Solve higher order initial value problems$|^Solve initial value problems involving linear motion$/, (mt, ctx) => () => {
    const t = ctx.title, k = ri(2, 6), c0 = ri(-5, 5), x0 = ri(1, 3), y0 = ri(-3, 6);
    if (/linear motion/.test(t)) { const v0 = ri(1, 5), a_ = ri(2, 6), s0 = ri(0, 4), tt = ri(1, 3); return num(`A particle has acceleration ${b(a_)}, initial velocity ${b(v0)} and initial position ${b(s0)}. Find its position at t = ${b(tt)}.`, s0 + v0 * tt + (a_ * tt * tt) / 2, `s = ${s0} + ${v0}t + ${a_ / 2}t² at t = ${tt}: ${b(s0 + v0 * tt + (a_ * tt * tt) / 2)}.`); }
    if (/higher/.test(t)) { const yp0 = ri(1, 4); return num(`${m(`y″ = ${2 * k}`)}, ${m(`y′(0) = ${yp0}`)} and ${m(`y(0) = ${y0}`)}. Find y(${x0}).`, y0 + yp0 * x0 + k * x0 * x0, `y′ = ${2 * k}x + ${yp0}; y = ${k}x² + ${yp0}x + ${y0}: ${b(y0 + yp0 * x0 + k * x0 * x0)}.`); }
    return num(`${m(`dy/dx = ${2 * k}x`)} with ${m(`y(0) = ${y0}`)}. Find y(${x0}).`, y0 + k * x0 * x0, `y = ${k}x² + ${y0}; at x = ${x0}: ${b(y0 + k * x0 * x0)}.`);
  }),
  R(/^Verify solutions to differential equations$/, () => () => {
    const k = ri(2, 5), good = Math.random() < 0.5, ans = good ? k : k + 1; return yesNo(`Is ${m(`y = e<sup>${ans}x</sup>`)} a solution of ${m(`y′ = ${k}y`)}?`, good, good ? `y′ = ${k}e^${k}x = ${k}y ✓.` : `y′ = ${ans}e^${ans}x, which is not ${k}y.`, ['Yes', 'No']);
  }),
  R(/^Solutions to differential equations using slope fields$/, () => () => {
    const x0 = ri(-3, 3), y0 = ri(-3, 3), mm = x0 + y0; return num(`A slope field comes from ${m('dy/dx = x + y')}. What is the slope of the line segment drawn at the point ${b(`(${S(x0)}, ${S(y0)})`)}?`, mm, `${S(x0)} + ${P(y0)} = ${b(S(mm))}.`);
  }),
  R(/^Find general solutions to separable differential equations$/, () => () => {
    const k = ri(2, 6); return mc(`Find the general solution of ${m(`dy/dx = ${k}y`)}.`, `y = Ce<sup>${k}x</sup>`, [`y = e<sup>${k}x</sup> + C`, `y = ${k}x + C`, `y = Cx<sup>${k}</sup>`], `Separate variables: ∫ dy/y = ∫ ${k} dx gives ln|y| = ${k}x + C.`, 4);
  }),
  R(/^Average value of a function$/, () => () => {
    const a = ri(0, 2), c = a + ri(2, 4), A = ri(1, 3), val = (A * (c ** 3 - a ** 3)) / 3 / (c - a); return num(`Find the average value of ${m(`f(x) = ${A === 1 ? '' : A}x²`)} on [${a}, ${c}]. (round to 3 decimals)`, num2(val), `(1/${c - a}) ∫ ${A}x² dx = ${b(num2(val))}.`);
  }),
  R(/^Relate position, velocity, speed and acceleration using integrals$/, () => () => {
    const k = ri(2, 6), t1 = ri(2, 4), s0 = ri(0, 5); return num(`A particle has velocity ${m(`v(t) = ${2 * k}t`)} and starts at position ${b(s0)}. What is its position at t = ${b(t1)}?`, s0 + k * t1 * t1, `s(t) = ∫ v dt = ${k}t² + ${s0}: ${b(s0 + k * t1 * t1)}.`);
  }),
  R(/^Areas of regions bounded by graphs and the y-axis$|^Areas of regions bounded by two curves: functions of y$|^Areas of regions bounded by curves with more than two intersection points$/, (mt, ctx) => () => {
    const a = ri(2, 6), val = (a ** 3) / 6, kind = pick(['yaxis', 'curves']); if (kind === 'yaxis') { const k = ri(2, 4); return num(`Find the area bounded by ${m(`x = y²`)}, the y-axis and the line y = ${b(k)}. (round to 3 decimals)`, num2(k ** 3 / 3), `∫₀^${k} y² dy = ${b(num2(k ** 3 / 3))}.`); }
    return num(`Find the area between ${m('y = x')} and ${m('y = x²')}.`, num2(1 / 6), `They cross at x = 0 and 1: ∫(x − x²) dx = ${b(num2(1 / 6))}.`);
  }),
  R(/^Find volumes using the disk method: revolve around (?:the x-axis or y-axis|a horizontal or vertical line)$/, () => () => {
    const c = ri(1, 4);
    return num(`The region under ${m('y = x')} from x = 0 to x = ${b(c)} is revolved about the x-axis. Find the volume. (Give the number in front of π; round to 3 decimals.)`, num2(c ** 3 / 3), `V = π ∫₀^${c} x² dx = ${b(pi_(c ** 3 / 3))}.`);
  })
];
function pi_(k) { return `${fix(k, 3)}π`; }
