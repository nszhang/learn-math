/* ============================================================
   Generated replacements (functions, trigonometry, vectors, conics,
   complex numbers, statistics and calculus) for skills that used to
   draw from a few fixed questions. Numbers are random so students must
   calculate every time.
   ============================================================ */
import { ri, pick, shuffle, sample, range, uniq, m, b, fmt, fix, num, mc, yesNo, svg, C, cap, gcd } from '../h.js';
import { R } from '../engine.js';

const MINUS = '−';
const S = n => (n < 0 ? MINUS + fmt(Math.abs(n)) : fmt(n));
const nz = (lo, hi) => { let x = 0; while (x === 0) x = ri(lo, hi); return x; };
const r1 = x => fix(x, 1), r2 = x => fix(x, 2), r3 = x => fix(x, 3);
const DEG = 180 / Math.PI;
const term = (c, v, first = false) => { if (c === 0) return ''; const sg = c < 0 ? (first ? MINUS : ` ${MINUS} `) : first ? '' : ' + ', a = Math.abs(c); return sg + (a === 1 && v ? '' : fmt(a)) + v; };
const poly = cs => { const s = cs.map(([c, v], i) => term(c, v, false)).join('').replace(/^ \+ /, '').replace(/^ − /, MINUS); return s || '0'; };
const lin = (a, c, v = 'x') => poly([[a, v], [c, '']]);
const cplx = (a, c) => (a === 0 ? (c === 0 ? '0' : `${c === 1 ? '' : c === -1 ? MINUS : S(c)}i`) : `${S(a)}${c === 0 ? '' : c > 0 ? ` + ${c === 1 ? '' : fmt(c)}i` : ` ${MINUS} ${c === -1 ? '' : fmt(-c)}i`}`);

/* ---------- tables ---------- */
const tbl = (xs, ys, xl = 'x', yl = 'y') => `<table class="data-table" style="border-collapse:collapse;margin:6px 0"><tr><th style="border:1px solid #94a3b8;padding:3px 10px">${xl}</th>${xs.map(x => `<td style="border:1px solid #94a3b8;padding:3px 10px">${S(x)}</td>`).join('')}</tr><tr><th style="border:1px solid #94a3b8;padding:3px 10px">${yl}</th>${ys.map(y => `<td style="border:1px solid #94a3b8;padding:3px 10px">${S(y)}</td>`).join('')}</tr></table>`;
/** small function graph */
function graph(f, { xmin = -5, xmax = 5, ymin = -6, ymax = 10 } = {}) {
  const W = 220, H = 180, X = x => ((x - xmin) / (xmax - xmin)) * W, Y = y => H - ((y - ymin) / (ymax - ymin)) * H;
  let pts = []; for (let i = 0; i <= 120; i++) { const x = xmin + ((xmax - xmin) * i) / 120, y = f(x); if (Number.isFinite(y) && y > ymin - 20 && y < ymax + 20) pts.push(`${X(x).toFixed(1)},${Y(y).toFixed(1)}`); }
  let grid = ''; for (let x = Math.ceil(xmin); x <= xmax; x++) grid += `<line x1="${X(x)}" y1="0" x2="${X(x)}" y2="${H}" stroke="#e2e8f0"/>`; for (let y = Math.ceil(ymin); y <= ymax; y += 2) grid += `<line x1="0" y1="${Y(y)}" x2="${W}" y2="${Y(y)}" stroke="#e2e8f0"/>`;
  return svg(W, H, `${grid}<line x1="${X(0)}" y1="0" x2="${X(0)}" y2="${H}" stroke="${C.ink}"/><line x1="0" y1="${Y(0)}" x2="${W}" y2="${Y(0)}" stroke="${C.ink}"/><polyline points="${pts.join(' ')}" fill="none" stroke="${C.primary}" stroke-width="3"/>`, 'aria-label="graph"');
}
function scatterPlot(points, { line = null } = {}) {
  const W = 230, H = 170, xs = points.map(p => p[0]), ys = points.map(p => p[1]), x0 = Math.min(...xs) - 1, x1 = Math.max(...xs) + 1, y0 = Math.min(...ys) - 1, y1 = Math.max(...ys) + 1;
  const X = x => 20 + ((x - x0) / (x1 - x0)) * (W - 30), Y = y => H - 20 - ((y - y0) / (y1 - y0)) * (H - 30);
  let s = `<line x1="20" y1="${H - 20}" x2="${W}" y2="${H - 20}" stroke="${C.ink}"/><line x1="20" y1="0" x2="20" y2="${H - 20}" stroke="${C.ink}"/>`;
  s += points.map(([x, y]) => `<circle cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="3.5" fill="${C.primary}"/>`).join('');
  if (line) s += `<line x1="${X(x0)}" y1="${Y(line(x0))}" x2="${X(x1)}" y2="${Y(line(x1))}" stroke="${C.red}" stroke-width="2" stroke-dasharray="6 4"/>`;
  return svg(W, H, s, 'aria-label="scatter plot"');
}
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];

export const VARIETY3_RULES = [
  /* ===== functions ===== */
  R(/^Identify linear functions$|^Identify linear and exponential functions$|^Identify linear, quadratic and exponential functions from (graphs|tables)$/, (mt, ctx) => () => {
    const t = ctx.title, types = /quadratic/.test(t) ? ['linear', 'quadratic', 'exponential'] : /exponential/.test(t) ? ['linear', 'exponential'] : ['linear', 'not linear'];
    const ty = pick(types), xs = range(0, 4), a = nz(-4, 4), c = ri(-5, 5), base = pick([2, 3, 0.5]), k = pick([1, 2, 3]), qa = nz(-2, 2), h = ri(-1, 2);
    const kind = ty === 'not linear' ? pick(['quadratic', 'exponential']) : ty;
    const f = { linear: x => a * x + c, quadratic: x => qa * (x - h) ** 2 + c, exponential: x => k * base ** x }[kind];
    const ys = xs.map(f);
    const show = mt[1] === 'graphs' || (!mt[1] && Math.random() < 0.4) ? 'graph' : mt[1] === 'tables' || Math.random() < 0.6 ? 'table' : 'equation';
    const eq = { linear: `y = ${lin(a, c)}`, quadratic: `y = ${qa === 1 ? '' : qa === -1 ? MINUS : S(qa)}(x ${h >= 0 ? MINUS : '+'} ${Math.abs(h)})²${c ? (c > 0 ? ' + ' + c : ' ' + MINUS + ' ' + -c) : ''}`.replace('(x − 0)', 'x'), exponential: `y = ${k === 1 ? '' : k}(${base})<sup>x</sup>` }[kind];
    const pic = show === 'graph' ? graph(f, { xmin: -4, xmax: 4, ymin: Math.min(-6, ...ys) - 1, ymax: Math.max(10, ...ys) + 1 }) : show === 'table' ? tbl(xs, ys.map(v => fix(v, 3))) : m(eq);
    const why = { linear: 'The y-values change by the same amount each step (constant rate of change).', quadratic: 'The second differences are constant, so it is quadratic (a parabola).', exponential: 'Each y-value is multiplied by the same factor, so it is exponential.' }[kind];
    return mc(`${pic}Which kind of function is this?`, ty, types.filter(x => x !== ty), `${why} ${ty === 'not linear' ? 'So it is not linear.' : ''}`, types.length);
  }),
  R(/^Describe linear and exponential growth and decay$/, () => () => {
    const kind = pick(['linear growth', 'linear decay', 'exponential growth', 'exponential decay']), amt = ri(2, 40) * 5, pct = ri(2, 30), unit = pick(['month', 'year', 'week', 'day', 'hour']);
    const thing = pick([['A savings account', '$'], ['A town\'s population', ''], ['The value of a car', '$'], ['The number of bacteria', ''], ['The water in a tank', ' L'], ['A plant\'s height', ' cm'], ['A phone\'s battery', '%']]);
    const desc = { 'linear growth': `increases by ${thing[1] === '$' ? '$' + amt : amt + thing[1]} each ${unit}`, 'linear decay': `decreases by ${thing[1] === '$' ? '$' + amt : amt + thing[1]} each ${unit}`, 'exponential growth': `increases by ${pct}% each ${unit}`, 'exponential decay': `decreases by ${pct}% each ${unit}` }[kind];
    return mc(`${thing[0]} ${desc}. Which describes this situation?`, kind, ['linear growth', 'linear decay', 'exponential growth', 'exponential decay'].filter(x => x !== kind), `A constant ${kind.startsWith('linear') ? 'amount' : 'percent'} each ${unit} means ${b(kind)}.`, 4);
  }),
  R(/^Classify formulas and sequences$|^Identify a sequence as explicit or recursive$/, (mt, ctx) => () => {
    const a1 = ri(-5, 9), d = nz(-6, 6), r = pick([2, 3, -2, 0.5]), geo = Math.random() < 0.5, rec = Math.random() < 0.5;
    const f = rec ? (geo ? `a<sub>1</sub> = ${S(a1 || 1)}, a<sub>n</sub> = ${S(r)}·a<sub>n−1</sub>` : `a<sub>1</sub> = ${S(a1)}, a<sub>n</sub> = a<sub>n−1</sub> ${d > 0 ? '+' : MINUS} ${Math.abs(d)}`) : (geo ? `a<sub>n</sub> = ${S(a1 || 1)}·(${S(r)})<sup>n−1</sup>` : `a<sub>n</sub> = ${S(a1)} ${d > 0 ? '+' : MINUS} ${Math.abs(d)}(n − 1)`);
    if (/explicit or recursive/.test(ctx.title) || Math.random() < 0.5) return mc(`Is this formula ${b('explicit')} or ${b('recursive')}?<br>${m(f)}`, rec ? 'recursive' : 'explicit', [rec ? 'explicit' : 'recursive'], rec ? 'Each term is found from the term before it.' : 'Any term can be found directly from n.', 2);
    return mc(`Does this formula describe an ${b('arithmetic')} or a ${b('geometric')} sequence?<br>${m(f)}`, geo ? 'geometric' : 'arithmetic', [geo ? 'arithmetic' : 'geometric'], geo ? `Each term is multiplied by ${S(r)}.` : `${S(d)} is added each time.`, 2);
  }),
  R(/^Identify graphs of continuous functions$/, () => () => {
    const c = ri(-3, 3), a = nz(-3, 3), k = ri(-4, 4), cont = Math.random() < 0.5, left = a * c + k, gap = cont ? 0 : nz(-3, 3), b2 = nz(-2, 2), e = left + gap - b2 * c;
    const f = x => (x < c ? a * x + k : b2 * x + e);
    const def = `f(x) = { ${lin(a, k)} if x < ${S(c)};  ${lin(b2, e)} if x ≥ ${S(c)} }`;
    return yesNo(`${graph(f, { xmin: -6, xmax: 6, ymin: -14, ymax: 14 })}${m(def)}<br>Is this function continuous at x = ${S(c)}?`, cont, `Left piece at x = ${S(c)}: ${S(left)}. Right piece: ${S(b2 * c + e)}. ${cont ? 'They meet, so there is no break.' : 'They do not meet, so there is a jump.'}`, ['Yes, continuous', 'No, there is a break']);
  }),
  R(/^Graphs of inverse functions$/, () => () => {
    const a = nz(-5, 5), c = ri(-8, 8), p = ri(-5, 5), q = a * p + c, kind = ri(0, 1);
    if (kind === 0) return mc(`The point ${m(`(${S(p)}, ${S(q)})`)} is on the graph of ${m(`f(x) = ${lin(a, c)}`)}. Which point must be on the graph of ${m('f<sup>−1</sup>')}?`, `(${S(q)}, ${S(p)})`, [`(${S(-p)}, ${S(-q)})`, `(${S(p)}, ${S(-q)})`, `(${S(-q)}, ${S(p)})`].filter(x => x !== `(${S(q)}, ${S(p)})`), 'The graph of an inverse is the reflection in y = x: swap the coordinates.', 4);
    return num(`${m(`f(x) = ${lin(a, c)}`)}. What is ${m(`f<sup>−1</sup>(${S(q)})`)}?`, p, `Solve ${lin(a, c)} = ${S(q)}: x = ${b(S(p))}.`);
  }),
  R(/^Relations: convert between tables, graphs, mappings and lists of points$/, () => () => {
    const n = ri(3, 5), xs = sample(range(-5, 6), n).sort((x, y) => x - y), ys = xs.map(() => ri(-5, 6)), pts = xs.map((x, i) => `(${S(x)}, ${S(ys[i])})`);
    const ans = `{${pts.join(', ')}}`, k = ri(0, 2);
    const show = k === 0 ? tbl(xs, ys) : k === 1 ? `<div>${xs.map((x, i) => `${S(x)} → ${S(ys[i])}`).join('<br>')}</div>` : `<div>Domain values ${xs.map(S).join(', ')} are paired, in order, with range values ${ys.map(S).join(', ')}.</div>`;
    const wrong = [`{${xs.map((x, i) => `(${S(ys[i])}, ${S(x)})`).join(', ')}}`, `{${xs.map((x, i) => `(${S(x)}, ${S(ys[(i + 1) % n])})`).join(', ')}}`, `{${xs.map((x, i) => `(${S(x)}, ${S(-ys[i])})`).join(', ')}}`];
    return mc(`${show}Which list of ordered pairs shows the same relation?`, ans, uniq(wrong).filter(x => x !== ans), `Pair each input with its output: ${b(ans)}.`, 4);
  }),
  R(/^Determine the number of solutions to a system of equations in three variables$/, () => () => {
    const kind = pick(['one', 'none', 'infinite']), sol = [ri(-4, 4), ri(-4, 4), ri(-4, 4)];
    const row = () => [nz(-4, 4), nz(-4, 4), nz(-4, 4)], r1_ = row(), r2_ = row();
    let r3_ = row(); if (kind !== 'one') r3_ = [r1_[0] + r2_[0], r1_[1] + r2_[1], r1_[2] + r2_[2]];
    const rhs = r => r[0] * sol[0] + r[1] * sol[1] + r[2] * sol[2];
    const d3 = kind === 'none' ? rhs(r3_) + nz(-5, 5) : rhs(r3_);
    const det = r1_[0] * (r2_[1] * r3_[2] - r2_[2] * r3_[1]) - r1_[1] * (r2_[0] * r3_[2] - r2_[2] * r3_[0]) + r1_[2] * (r2_[0] * r3_[1] - r2_[1] * r3_[0]);
    if (kind === 'one' && det === 0) return null;
    const eq = (r, d) => `${poly([[r[0], 'x'], [r[1], 'y'], [r[2], 'z']])} = ${S(d)}`;
    const ans = { one: 'exactly one solution', none: 'no solution', infinite: 'infinitely many solutions' }[kind];
    return mc(`How many solutions does this system have?<br>${m(eq(r1_, rhs(r1_)))}<br>${m(eq(r2_, rhs(r2_)))}<br>${m(eq(r3_, d3))}`, ans, ['exactly one solution', 'no solution', 'infinitely many solutions'].filter(x => x !== ans), kind === 'one' ? `The equations are independent; the solution is (${sol.map(S).join(', ')}).` : `The third left side is the sum of the first two; its right side ${kind === 'none' ? 'is not' : 'is'} the sum of theirs, so ${ans}.`, 3);
  }),
  R(/^Even and odd functions$/, () => () => {
    const kind = pick(['even', 'odd', 'neither']), pw = kind === 'even' ? [4, 2, 0] : kind === 'odd' ? [5, 3, 1] : [3, 2, 1];
    const cs = pw.map(() => nz(-6, 6)), f = poly(cs.map((c, i) => [c, pw[i] === 0 ? '' : pw[i] === 1 ? 'x' : `x<sup>${pw[i]}</sup>`]).filter((_, i) => Math.random() < 0.8 || i === 0));
    const fnc = x => cs.reduce((s, c, i) => s + c * x ** pw[i], 0);
    const real = fnc(2) === fnc(-2) && fnc(1) === fnc(-1) ? 'even' : fnc(2) === -fnc(-2) && fnc(1) === -fnc(-1) ? 'odd' : 'neither';
    const shown = poly(cs.map((c, i) => [c, pw[i] === 0 ? '' : pw[i] === 1 ? 'x' : `x<sup>${pw[i]}</sup>`]));
    return mc(`Is ${m(`f(x) = ${shown}`)} even, odd, or neither?`, real, ['even', 'odd', 'neither'].filter(x => x !== real), real === 'even' ? 'f(−x) = f(x): only even powers.' : real === 'odd' ? 'f(−x) = −f(x): only odd powers.' : 'It mixes even and odd powers, so neither.', 3);
  }),

  /* ===== logarithms ===== */
  R(/^Identify properties of logarithms$|^Properties of logarithms: mixed review$|^Expand logarithms$/, (mt, ctx) => () => {
    const bse = pick(['', '₂', '₃', '₅']), L = `log${bse}`, p = ri(2, 5), q = ri(2, 4), [u, v] = sample(['x', 'y', 'z', 'a', 'w'], 2), k = ri(0, 3);
    if (k === 0) return mc(`Expand: ${m(`${L}(${u}<sup>${p}</sup>${v})`)}`, `${p}${L} ${u} + ${L} ${v}`, [`${p}${L} ${u} − ${L} ${v}`, `${L} ${u} + ${p}${L} ${v}`, `${p}(${L} ${u} + ${L} ${v})`], 'Product rule, then power rule.', 4);
    if (k === 1) return mc(`Expand: ${m(`${L}(${u}<sup>${p}</sup> / ${v}<sup>${q}</sup>)`)}`, `${p}${L} ${u} − ${q}${L} ${v}`, [`${p}${L} ${u} + ${q}${L} ${v}`, `${q}${L} ${u} − ${p}${L} ${v}`, `${p}${L} ${u} ÷ ${q}${L} ${v}`], 'Quotient rule, then power rule.', 4);
    if (k === 2) { const prop = pick([['log<sub>b</sub>(MN) = log<sub>b</sub>M + log<sub>b</sub>N', 'product property'], ['log<sub>b</sub>(M/N) = log<sub>b</sub>M − log<sub>b</sub>N', 'quotient property'], ['log<sub>b</sub>(M<sup>p</sup>) = p·log<sub>b</sub>M', 'power property'], ['log<sub>b</sub>M = log M / log b', 'change of base formula']]); return mc(`Which property is shown? ${m(prop[0])}`, prop[1], ['product property', 'quotient property', 'power property', 'change of base formula'].filter(x => x !== prop[1]), `That is the ${b(prop[1])}.`, 4); }
    const B = pick([2, 3, 5, 10]), e1 = ri(1, 4), e2 = ri(1, 3), M = B ** e1, N = B ** e2, op = pick(['+', '−']);
    return num(`Evaluate: ${m(`log<sub>${B}</sub>${fmt(M)} ${op} log<sub>${B}</sub>${fmt(N)}`)}`, op === '+' ? e1 + e2 : e1 - e2, `${fmt(M)} = ${B}<sup>${e1}</sup> and ${fmt(N)} = ${B}<sup>${e2}</sup>: ${e1} ${op} ${e2} = ${b(op === '+' ? e1 + e2 : e1 - e2)}.`);
  }),

  /* ===== complex numbers ===== */
  R(/^Introduction to complex numbers$|^Absolute values of complex numbers$|^The imaginary unit i$/, (mt, ctx) => () => {
    const a = ri(-9, 9), c = nz(-9, 9), k = /Absolute/.test(ctx.title) ? 2 : ri(0, 3);
    if (k === 0) return num(`What is the ${b('real part')} of ${m(cplx(a, c))}?`, a, `The real part is ${b(S(a))}.`);
    if (k === 1) return num(`What is the ${b('imaginary part')} of ${m(cplx(a, c))}? (the coefficient of i)`, c, `The imaginary part is ${b(S(c))}.`);
    if (k === 2) { const [p, q, h] = pick(TRIPLES), s = ri(1, 2), sa = pick([1, -1]), sc = pick([1, -1]); return num(`Find ${m(`|${cplx(sa * p * s, sc * q * s)}|`)}.`, h * s, `√(${p * s}² + ${q * s}²) = ${b(h * s)}.`); }
    const n = ri(2, 40), r = n % 4, ans = ['1', 'i', MINUS + '1', MINUS + 'i'][r];
    return mc(`Simplify ${m(`i<sup>${n}</sup>`)}.`, ans, ['1', 'i', MINUS + '1', MINUS + 'i'].filter(x => x !== ans), `Powers of i repeat every 4. ${n} ÷ 4 leaves ${r}, so i<sup>${n}</sup> = ${b(ans)}.`, 4);
  }),
  R(/^Absolute value in the complex plane$|^Distance in the complex plane$/, (mt, ctx) => () => {
    const [p, q, h] = pick(TRIPLES), s = ri(1, 2), a = ri(-6, 6), c = ri(-6, 6), dx = pick([1, -1]) * p * s, dy = pick([1, -1]) * q * s;
    if (/Distance/.test(ctx.title)) return num(`What is the distance between ${m(cplx(a, c))} and ${m(cplx(a + dx, c + dy))} in the complex plane?`, h * s, `|(${cplx(a + dx, c + dy)}) − (${cplx(a, c)})| = |${cplx(dx, dy)}| = ${b(h * s)}.`);
    return num(`What is the absolute value of ${m(cplx(dx, dy))}? (its distance from 0 in the complex plane)`, h * s, `√(${dx}² + ${dy}²) = ${b(h * s)}.`);
  }),
  R(/^Find the modulus and argument of a complex number$|^Convert complex numbers from rectangular to polar form$|^Convert complex numbers between rectangular and polar form$/, (mt, ctx) => () => {
    const a = nz(-9, 9), c = nz(-9, 9), r = Math.hypot(a, c), th = ((Math.atan2(c, a) * DEG) + 360) % 360, toRect = /between/.test(ctx.title) && Math.random() < 0.5;
    if (toRect) { const R_ = ri(2, 10), T = pick([30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330]), part = pick(['real', 'imaginary']); const v = part === 'real' ? R_ * Math.cos(T / DEG) : R_ * Math.sin(T / DEG); return num(`Write ${m(`${R_}(cos ${T}° + i sin ${T}°)`)} in rectangular form a + bi. What is the ${b(part)} part? (round to 2 decimals)`, r2(v), `${part === 'real' ? 'a = r cos θ' : 'b = r sin θ'} = ${R_} × ${part === 'real' ? 'cos' : 'sin'} ${T}° ≈ ${b(r2(v))}.`); }
    if (Math.random() < 0.5) return num(`Find the ${b('modulus')} of ${m(cplx(a, c))}. (round to 2 decimals)`, r2(r), `r = √(${S(a)}² + ${S(c)}²) ≈ ${b(r2(r))}.`);
    return num(`Find the ${b('argument')} of ${m(cplx(a, c))} in degrees, between 0° and 360°. (round to 1 decimal)`, r1(th), `θ = tan⁻¹(${S(c)}/${S(a)}) adjusted for quadrant ${a > 0 ? (c > 0 ? 'I' : 'IV') : (c > 0 ? 'II' : 'III')} ≈ ${b(r1(th))}°.`);
  }),

  /* ===== trigonometry & vectors ===== */
  R(/^Trigonometric ratios: find an angle measure$|^Solve a right triangle$/, (mt, ctx) => () => {
    const a = ri(3, 25), c = ri(3, 25), hyp = Math.hypot(a, c), solve = /Solve/.test(ctx.title);
    if (!solve || Math.random() < 0.5) {
      const k = ri(0, 2), angle = Math.atan(a / c) * DEG;
      const given = k === 0 ? `the side opposite θ is ${a} and the side adjacent to θ is ${c}` : k === 1 ? `the side opposite θ is ${a} and the hypotenuse is ${r1(hyp)}` : `the side adjacent to θ is ${c} and the hypotenuse is ${r1(hyp)}`;
      const ans = k === 0 ? Math.atan(a / c) * DEG : k === 1 ? Math.asin(a / r1(hyp)) * DEG : Math.acos(c / r1(hyp)) * DEG;
      return num(`In a right triangle, ${given}. Find θ in degrees. (round to 1 decimal)`, r1(ans), `Use ${['tan⁻¹(opp/adj)', 'sin⁻¹(opp/hyp)', 'cos⁻¹(adj/hyp)'][k]}: θ ≈ ${b(r1(ans))}°.`);
    }
    const A = ri(15, 75), side = ri(4, 30), k = ri(0, 2);
    if (k === 0) return num(`In right triangle ABC, ∠C = 90°, ∠A = ${A}° and the hypotenuse c = ${side}. Find side a (opposite ∠A). (round to 1 decimal)`, r1(side * Math.sin(A / DEG)), `a = c·sin A = ${side} sin ${A}° ≈ ${b(r1(side * Math.sin(A / DEG)))}.`);
    if (k === 1) return num(`In right triangle ABC, ∠C = 90°, ∠A = ${A}° and side b = ${side} (adjacent to ∠A). Find side a. (round to 1 decimal)`, r1(side * Math.tan(A / DEG)), `a = b·tan A = ${side} tan ${A}° ≈ ${b(r1(side * Math.tan(A / DEG)))}.`);
    return num(`In right triangle ABC, ∠C = 90° and ∠A = ${A}°. What is ∠B? (degrees)`, 90 - A, `∠B = 90 − ${A} = ${b(90 - A)}°.`);
  }),
  R(/^Area of a triangle: Heron's formula$/, () => () => {
    for (let t = 0; t < 50; t++) { const a = ri(4, 20), c = ri(4, 20), d = ri(Math.abs(a - c) + 1, a + c - 1), s = (a + c + d) / 2, A = Math.sqrt(s * (s - a) * (s - c) * (s - d)); if (A > 0) return num(`A triangle has sides ${a}, ${c} and ${d}. Use Heron's formula to find its area. (round to 1 decimal)`, r1(A), `s = ${s}; A = √(${s}·${fix(s - a)}·${fix(s - c)}·${fix(s - d)}) ≈ ${b(r1(A))}.`); }
    return null;
  }),
  R(/^Find the direction angle of a vector$|^Find the magnitude or direction of a vector scalar multiple$/, (mt, ctx) => () => {
    const x = nz(-9, 9), y = nz(-9, 9), th = ((Math.atan2(y, x) * DEG) + 360) % 360;
    if (/scalar/.test(ctx.title)) { const k = nz(-4, 4); if (Math.random() < 0.5) return num(`u = ⟨${S(x)}, ${S(y)}⟩. Find the magnitude of ${m(`${S(k)}u`)}. (round to 2 decimals)`, r2(Math.abs(k) * Math.hypot(x, y)), `|${S(k)}u| = ${Math.abs(k)}·√(${x * x} + ${y * y}) ≈ ${b(r2(Math.abs(k) * Math.hypot(x, y)))}.`); const th2 = ((Math.atan2(k * y, k * x) * DEG) + 360) % 360; return num(`u = ⟨${S(x)}, ${S(y)}⟩. Find the direction angle of ${m(`${S(k)}u`)} (0° to 360°, round to 1 decimal).`, r1(th2), `${k > 0 ? 'A positive multiple keeps the direction' : 'A negative multiple reverses the direction (adds 180°)'}: ${b(r1(th2))}°.`); }
    return num(`Find the direction angle of ${m(`⟨${S(x)}, ${S(y)}⟩`)} (0° to 360°, round to 1 decimal).`, r1(th), `tan θ = ${S(y)}/${S(x)}, in quadrant ${x > 0 ? (y > 0 ? 'I' : 'IV') : (y > 0 ? 'II' : 'III')}: θ ≈ ${b(r1(th))}°.`);
  }),
  R(/^Find a unit vector$|^Find a three-dimensional unit vector$|^Find the magnitude of a three-dimensional vector$/, (mt, ctx) => () => {
    const three = /three-dimensional/.test(ctx.title), v = three ? [nz(-8, 8), nz(-8, 8), nz(-8, 8)] : [nz(-9, 9), nz(-9, 9)], mag = Math.hypot(...v), names = ['x', 'y', 'z'];
    if (/magnitude/.test(ctx.title)) return num(`Find the magnitude of ${m(`⟨${v.map(S).join(', ')}⟩`)}. (round to 2 decimals)`, r2(mag), `√(${v.map(c => c * c).join(' + ')}) ≈ ${b(r2(mag))}.`);
    const i = ri(0, v.length - 1);
    return num(`Find the unit vector in the direction of ${m(`⟨${v.map(S).join(', ')}⟩`)}. What is its ${b(names[i] + '-component')}? (round to 3 decimals)`, r3(v[i] / mag), `Divide by the magnitude ${r3(mag)}: ${S(v[i])} ÷ ${r3(mag)} ≈ ${b(r3(v[i] / mag))}.`);
  }),
  R(/^Find properties of ellipses$|^Find the eccentricity of an ellipse$|^Write equations of ellipses in standard form$|^Find properties of hyperbolas$|^Find the eccentricity of a hyperbola$|^Write equations of hyperbolas in standard form$/, (mt, ctx) => () => {
    const hyp = /hyperbola/.test(ctx.title), h = ri(-5, 5), k = ri(-5, 5); let a = ri(2, 9), c2 = ri(1, 8); if (!hyp && c2 >= a) c2 = ri(1, a - 1);
    const horiz = Math.random() < 0.5, A2 = a * a, B2 = hyp ? c2 * c2 : a * a - c2 * c2; if (B2 <= 0) return null;
    const c = hyp ? Math.sqrt(A2 + B2) : Math.sqrt(A2 - B2), e = c / a;
    const X = h === 0 ? 'x' : `(x ${h > 0 ? MINUS : '+'} ${Math.abs(h)})`, Y = k === 0 ? 'y' : `(y ${k > 0 ? MINUS : '+'} ${Math.abs(k)})`;
    const eqn = hyp ? (horiz ? `${X}²/${A2} ${MINUS} ${Y}²/${B2} = 1` : `${Y}²/${A2} ${MINUS} ${X}²/${B2} = 1`) : (horiz ? `${X}²/${A2} + ${Y}²/${B2} = 1` : `${X}²/${B2} + ${Y}²/${A2} = 1`);
    if (/eccentricity/.test(ctx.title)) return num(`Find the eccentricity of ${m(eqn)}. (round to 2 decimals)`, r2(e), `c² = a² ${hyp ? '+' : MINUS} b² = ${hyp ? A2 + B2 : A2 - B2}, c ≈ ${r3(c)}; e = c/a ≈ ${b(r2(e))}.`);
    if (/Write equations/.test(ctx.title)) {
      const shape = hyp ? 'hyperbola' : 'ellipse', axis = hyp ? 'transverse' : 'major';
      const ans = eqn, wrong = hyp ? [eqn.replace(MINUS, '+'), horiz ? `${Y}²/${A2} ${MINUS} ${X}²/${B2} = 1` : `${X}²/${A2} ${MINUS} ${Y}²/${B2} = 1`, eqn.replace(String(A2), String(a))] : [horiz ? `${X}²/${B2} + ${Y}²/${A2} = 1` : `${X}²/${A2} + ${Y}²/${B2} = 1`, eqn.replace('+', MINUS), eqn.replace(String(A2), String(a))];
      return mc(`${hyp ? 'A hyperbola' : 'An ellipse'} has centre (${S(h)}, ${S(k)}), a ${horiz ? 'horizontal' : 'vertical'} ${axis} axis of length ${2 * a}, and ${hyp ? 'conjugate' : 'minor'} axis of length ${r2(2 * Math.sqrt(B2))}. Which equation is it?`, ans, uniq(wrong).filter(x => x !== ans), `a = ${a}, b² = ${B2}, centre (${S(h)}, ${S(k)}): ${b(ans)}.`, 4);
    }
    const q = ri(0, 2);
    if (q === 0) return num(`What is the length of the ${b(hyp ? 'transverse' : 'major')} axis of ${m(eqn)}?`, 2 * a, `a² = ${A2}, so a = ${a} and the axis is 2a = ${b(2 * a)}.`);
    if (q === 1) return mc(`What is the centre of ${m(eqn)}?`, `(${S(h)}, ${S(k)})`, [`(${S(-h)}, ${S(-k)})`, `(${S(k)}, ${S(h)})`, `(${S(h)}, ${S(-k)})`], `The centre is (h, k) = ${b(`(${S(h)}, ${S(k)})`)}.`, 4);
    return num(`What is the distance from the centre to each ${b('focus')} of ${m(eqn)}? (round to 2 decimals)`, r2(c), `c² = ${A2} ${hyp ? '+' : MINUS} ${B2} = ${hyp ? A2 + B2 : A2 - B2}, so c ≈ ${b(r2(c))}.`);
  }),
  R(/^Find trigonometric ratios using a Pythagorean or reciprocal identity$|^Find trigonometric ratios using multiple identities$/, () => () => {
    const [p, q, h] = pick(TRIPLES), quad = ri(1, 4), sx = quad === 1 || quad === 4 ? 1 : -1, sy = quad <= 2 ? 1 : -1;
    const sin = `${sy < 0 ? MINUS : ''}${p}/${h}`, cos = `${sx < 0 ? MINUS : ''}${q}/${h}`, tan = `${sx * sy < 0 ? MINUS : ''}${p}/${q}`;
    const vals = { sin, cos, tan, csc: `${sy < 0 ? MINUS : ''}${h}/${p}`, sec: `${sx < 0 ? MINUS : ''}${h}/${q}`, cot: `${sx * sy < 0 ? MINUS : ''}${q}/${p}` };
    const given = pick(['sin', 'cos']), want = pick(Object.keys(vals).filter(x => x !== given));
    const ans = vals[want], flip = s => (s.startsWith(MINUS) ? s.slice(1) : MINUS + s);
    return mc(`${m(`${given} θ = ${vals[given]}`)} and θ is in quadrant ${['I', 'II', 'III', 'IV'][quad - 1]}. What is ${m(`${want} θ`)}?`, ans, uniq([flip(ans), ans.replace(/(\d+)\/(\d+)/, '$2/$1'), flip(ans.replace(/(\d+)\/(\d+)/, '$2/$1')), vals[pick(Object.keys(vals).filter(x => x !== want && vals[x] !== ans))]]).filter(x => x !== ans), `Use sin² θ + cos² θ = 1 to find the missing side (${p}, ${q}, ${h}), then apply quadrant ${['I', 'II', 'III', 'IV'][quad - 1]} signs: ${b(ans)}.`, 4);
  }),

  /* ===== statistics & probability ===== */
  R(/^Identify discrete and continuous random variables$/, () => () => {
    const [v, d] = pick([['the number of goals scored in a hockey game', 'discrete'], ['the exact time it takes to run 100 m', 'continuous'], ['the number of students absent today', 'discrete'], ['the mass of a randomly chosen apple', 'continuous'], ['the number of heads in 10 coin flips', 'discrete'], ['the temperature at noon tomorrow', 'continuous'], ['the number of cars in a parking lot', 'discrete'], ['the height of a randomly chosen student', 'continuous'], ['the number of emails received in an hour', 'discrete'], ['the volume of water in a bottle', 'continuous'], ['the number of pets a family owns', 'discrete'], ['the distance a paper airplane flies', 'continuous'], ['the number of defective bulbs in a box', 'discrete'], ['the amount of rain that falls in a day', 'continuous'], ['the roll of a die', 'discrete'], ['the time a battery lasts', 'continuous']]);
    return mc(`Is ${b(v)} a discrete or a continuous random variable?`, d, [d === 'discrete' ? 'continuous' : 'discrete'], d === 'discrete' ? 'It is counted, so it takes separate values.' : 'It is measured and can take any value in a range.', 2);
  }),
  R(/^Write a discrete probability distribution$|^Graph a discrete probability distribution$|^Expected values of random variables$|^Write the probability distribution for a game of chance$|^Variance of random variables$|^Standard deviation of random variables$/, (mt, ctx) => () => {
    const t = ctx.title;
    if (/game of chance/.test(t)) { const n = pick([4, 5, 6, 8, 10]), wins = ri(1, n - 1), prize = ri(2, 20), cost = ri(1, 6); const ev = r2((wins / n) * prize - cost); return num(`A game costs $${cost} to play. A spinner has ${n} equal sections; ${wins} of them win $${prize}. Let X be your net gain. What is E(X)? (dollars, round to 2 decimals)`, ev, `E(X) = ${wins}/${n} × ${prize} − ${cost} ≈ ${b(ev)}.`); }
    if (/Write a discrete/.test(t)) { const counts = [ri(1, 5), ri(1, 5), ri(1, 5), ri(1, 5)], tot = counts.reduce((s, c) => s + c, 0), i = ri(0, 3), g = gcd(counts[i], tot); return mc(`A bag has ${counts.map((c, j) => `${c} tiles labelled ${j + 1}`).join(', ')}. One tile is drawn; X is its label. What is ${m(`P(X = ${i + 1})`)}?`, `${counts[i] / g}/${tot / g}`, uniq([`${counts[i]}/${tot + 1}`, `1/${tot}`, `${counts[(i + 1) % 4]}/${tot}`, `1/4`]).filter(x => x !== `${counts[i] / g}/${tot / g}` && x !== `${counts[i]}/${tot}`), `${counts[i]} of the ${tot} tiles: ${b(`${counts[i] / g}/${tot / g}`)}.`, 4); }
    const xs = sample(range(0, 9), 4).sort((x, y) => x - y), cut = sample(range(1, 9), 3).sort((x, y) => x - y), ps = [cut[0], cut[1] - cut[0], cut[2] - cut[1], 10 - cut[2]].map(v => v / 10);
    const E = xs.reduce((s, x, i) => s + x * ps[i], 0), V = xs.reduce((s, x, i) => s + (x - E) ** 2 * ps[i], 0);
    const tab = tbl(xs, ps.map(p => fix(p, 1)), 'x', 'P(X = x)');
    if (/Graph/.test(t)) { const i = ri(0, 3), xs2 = xs; return num(`${tab}A bar graph of this distribution is drawn. How tall is the bar at x = ${xs2[i]}? (as a decimal)`, ps[i], `The bar height equals the probability: ${b(fix(ps[i], 1))}.`); }
    if (/Variance/.test(t)) return num(`${tab}Find the variance of X. (round to 2 decimals)`, r2(V), `E(X) = ${r2(E)}; Var(X) = Σ(x − μ)²P(x) ≈ ${b(r2(V))}.`);
    if (/Standard deviation/.test(t)) return num(`${tab}Find the standard deviation of X. (round to 2 decimals)`, r2(Math.sqrt(V)), `Var(X) ≈ ${r2(V)}, so σ = √Var ≈ ${b(r2(Math.sqrt(V)))}.`);
    return num(`${tab}What is the expected value E(X)?`, r2(E), `E(X) = Σ x·P(x) = ${xs.map((x, i) => `${x}(${fix(ps[i], 1)})`).join(' + ')} = ${b(r2(E))}.`);
  }),
  R(/^Find probabilities using the normal distribution I$|^The Central Limit Theorem$|^Use normal distributions to approximate binomial distributions$/, (mt, ctx) => () => {
    const t = ctx.title;
    if (/Central/.test(t)) { const mu = ri(20, 200), sd = ri(4, 30), n = pick([16, 25, 36, 49, 64, 100]); return Math.random() < 0.5 ? num(`A population has mean ${mu} and standard deviation ${sd}. Samples of size ${n} are taken. What is the standard deviation of the sample means? (round to 2 decimals)`, r2(sd / Math.sqrt(n)), `σ / √n = ${sd} / ${Math.sqrt(n)} = ${b(r2(sd / Math.sqrt(n)))}.`) : num(`A population has mean ${mu} and standard deviation ${sd}. What is the mean of the sampling distribution of x̄ for samples of size ${n}?`, mu, `The mean of the sample means equals the population mean: ${b(mu)}.`); }
    if (/binomial/.test(t)) { const n = pick([50, 80, 100, 120, 200, 400]), p = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6]); return Math.random() < 0.5 ? num(`X is binomial with n = ${n} and p = ${p}. What mean would you use for the normal approximation?`, fix(n * p), `μ = np = ${n} × ${p} = ${b(fix(n * p))}.`) : num(`X is binomial with n = ${n} and p = ${p}. What standard deviation would you use for the normal approximation? (round to 2 decimals)`, r2(Math.sqrt(n * p * (1 - p))), `σ = √(np(1 − p)) = √(${fix(n * p * (1 - p))}) ≈ ${b(r2(Math.sqrt(n * p * (1 - p))))}.`); }
    const mu = ri(40, 120), sd = ri(3, 15), [lo, hi, pct] = pick([[-1, 1, 68], [-2, 2, 95], [-3, 3, 99.7], [0, 1, 34], [-1, 0, 34], [0, 2, 47.5], [-2, 0, 47.5], [1, 2, 13.5], [-2, -1, 13.5], [0, 3, 49.85]]);
    return num(`Heights are normally distributed with mean ${mu} and standard deviation ${sd}. Using the empirical rule, what percent fall between ${mu + lo * sd} and ${mu + hi * sd}?`, pct, `That is from ${lo} to ${hi} standard deviations: ${b(pct + '%')}.`);
  }),
  R(/^Identify independent events$|^Independent and dependent events$/, () => () => {
    const [d, ind] = pick([['You roll a die and flip a coin.', true], ['You draw a card, do not replace it, and draw another card.', false], ['You draw a marble, put it back, and draw again.', true], ['You pick a student for president, then a different student for vice-president.', false], ['It rains today and you get a 6 on a die.', true], ['You choose two socks from a drawer without putting the first back.', false], ['You spin a spinner twice.', true], ['You take two cookies from a jar one after the other and eat the first.', false], ['You flip a coin and then flip it again.', true], ['You choose a card from one deck and a card from a different deck.', true], ['A team picks 3 players from a group of 10, one at a time.', false]]);
    if (Math.random() < 0.5) return mc(`${d}<br>Are the two events independent or dependent?`, ind ? 'independent' : 'dependent', [ind ? 'dependent' : 'independent'], ind ? 'The first result does not change the probabilities for the second.' : 'The first result changes what is left for the second.', 2);
    const r = ri(2, 7), bl = ri(2, 7), tot = r + bl, rep = Math.random() < 0.5, num_ = rep ? r * r : r * (r - 1), den = rep ? tot * tot : tot * (tot - 1), g = gcd(num_, den);
    return mc(`A bag has ${r} red and ${bl} blue marbles. You draw two marbles ${rep ? 'with' : 'without'} replacement. What is P(both red)?`, `${num_ / g}/${den / g}`, uniq([`${r * r}/${tot * tot}`, `${r * (r - 1)}/${tot * (tot - 1)}`, `${r}/${tot}`, `${2 * r}/${tot}`].map(f => { const [x, y] = f.split('/').map(Number); const gg = gcd(x, y); return `${x / gg}/${y / gg}`; })).filter(x => x !== `${num_ / g}/${den / g}`), `${r}/${tot} × ${rep ? r : r - 1}/${rep ? tot : tot - 1} = ${b(`${num_ / g}/${den / g}`)}.`, 4);
  }),
  R(/^Match correlation coefficients to scatter plots$/, () => () => {
    const opts = [-0.9, -0.5, 0, 0.5, 0.9], r = pick(opts), noise = { 0.9: 1.5, 0.5: 5, 0: 0 }[Math.abs(r)], pts = [];
    for (let i = 0; i < 20; i++) { const x = ri(0, 20); pts.push([x, r === 0 ? ri(0, 20) : 10 + Math.sign(r) * 0.8 * x + (Math.random() * 2 - 1) * noise]); }
    return mc(`${scatterPlot(pts)}Which correlation coefficient best matches this scatter plot?`, String(r), opts.filter(x => x !== r).map(String), r === 0 ? 'There is no linear pattern: r ≈ 0.' : `The points ${r > 0 ? 'rise' : 'fall'} ${Math.abs(r) > 0.8 ? 'in an almost straight line' : 'with a lot of scatter'}: r ≈ ${b(r)}.`, 4);
  }),
  R(/^Interpret confidence intervals for population means$/, () => () => {
    const mean = ri(20, 200), me = ri(2, 15), lo = mean - me, hi = mean + me, lvl = pick([90, 95, 99]), q = ri(0, 2), what = pick(['minutes of homework per night', 'hours of sleep per week', 'dollars spent on lunch per week', 'kilometres driven per day']);
    if (q === 0) return num(`A ${lvl}% confidence interval for the mean ${what} is (${lo}, ${hi}). What is the sample mean?`, mean, `The interval is centred at x̄: (${lo} + ${hi}) ÷ 2 = ${b(mean)}.`);
    if (q === 1) return num(`A ${lvl}% confidence interval for the mean ${what} is (${lo}, ${hi}). What is the margin of error?`, me, `Half the width: (${hi} − ${lo}) ÷ 2 = ${b(me)}.`);
    const v = pick([lo - ri(1, 10), hi + ri(1, 10), ri(lo + 1, hi - 1)]), inside = v > lo && v < hi;
    return yesNo(`A ${lvl}% confidence interval for the mean ${what} is (${lo}, ${hi}). Is ${v} a plausible value of the population mean?`, inside, inside ? `${v} is inside the interval.` : `${v} is outside the interval.`, ['Yes', 'No']);
  }),
  R(/^Make predictions with scatter plots$|^Scatter plot trends$/, (mt, ctx) => () => {
    const slope = pick([-3, -2, -1.5, -1, 1, 1.5, 2, 3, 0]), c = ri(5, 30), pts = range(1, 10).map(x => [x, fix(c + slope * x + ri(-3, 3) * (slope === 0 ? 2 : 1), 1)]);
    if (/trends/.test(ctx.title) || Math.random() < 0.3) { const ans = slope > 0 ? 'positive' : slope < 0 ? 'negative' : 'no association'; return mc(`${scatterPlot(pts)}What association does this scatter plot show?`, ans, ['positive', 'negative', 'no association'].filter(x => x !== ans), slope > 0 ? 'The points rise from left to right.' : slope < 0 ? 'The points fall from left to right.' : 'There is no clear upward or downward pattern.', 3); }
    if (slope === 0) return null;
    const x = ri(11, 14), y = c + slope * x;
    return num(`${scatterPlot(pts, { line: z => c + slope * z })}The line of best fit is ${m(`y = ${lin(slope, c)}`)}. Predict y when x = ${x}.`, fix(y, 1), `${S(slope)} × ${x} + ${c} = ${b(fix(y, 1))}.`);
  }),
  R(/^Permutations$/, () => () => {
    const n = ri(4, 10), r = ri(2, Math.min(5, n)), P = range(n - r + 1, n).reduce((a, x) => a * x, 1), all = Math.random() < 0.3;
    if (all) { const f = range(1, n).reduce((a, x) => a * x, 1); return num(`In how many ways can ${n} students line up in a row?`, f, `${n}! = ${b(fmt(f))}.`); }
    const roles = r === 3 ? pick(['a president, a vice-president and a secretary', 'first, second and third place', 'a gold, a silver and a bronze medal winner']) : `${r} people for ${r} different jobs`;
    return num(`In how many ways can ${roles} be chosen from ${n} people?`, P, `Order matters: ${n}P${r} = ${range(n - r + 1, n).reverse().join(' × ')} = ${b(fmt(P))}.`);
  }),

  /* ===== calculus ===== */
  R(/^Find derivatives of inverse trigonometric functions$/, () => () => {
    const a = pick([1, 2, 3, 0.5]), x0 = pick([0, 0.1, 0.2, 0.25, 0.3]), f = pick(['arcsin', 'arccos', 'arctan']);
    if (f !== 'arctan' && Math.abs(a * x0) >= 1) return null;
    const d = f === 'arcsin' ? a / Math.sqrt(1 - (a * x0) ** 2) : f === 'arccos' ? -a / Math.sqrt(1 - (a * x0) ** 2) : a / (1 + (a * x0) ** 2);
    return num(`f(x) = ${f}(${a === 1 ? '' : a}x). Find f′(${x0}). (round to 3 decimals)`, r3(d), `${f === 'arcsin' ? 'd/dx arcsin(u) = u′/√(1 − u²)' : f === 'arccos' ? 'd/dx arccos(u) = −u′/√(1 − u²)' : 'd/dx arctan(u) = u′/(1 + u²)'} with u = ${a}x: ${b(r3(d))}.`);
  }),
  R(/^Find derivatives using the chain rule II$/, () => () => {
    const a = nz(-4, 4), c = ri(-3, 3), n = ri(2, 5), x0 = ri(-2, 2), k = ri(0, 3);
    const u = a * x0 * x0 + c;
    if (k === 0) { const d = n * (a * x0 + c) ** (n - 1) * a; return num(`f(x) = (${lin(a, c)})<sup>${n}</sup>. Find f′(${S(x0)}).`, d, `f′(x) = ${n}(${lin(a, c)})<sup>${n - 1}</sup>·${S(a)} → ${b(S(d))}.`); }
    if (k === 1) { const d = Math.cos(u) * 2 * a * x0; return num(`f(x) = sin(${poly([[a, 'x²'], [c, '']])}). Find f′(${S(x0)}). (round to 3 decimals)`, r3(d), `f′(x) = cos(${poly([[a, 'x²'], [c, '']])})·${2 * a}x ≈ ${b(r3(d))}.`); }
    if (k === 2) { const d = Math.exp(u) * 2 * a * x0; if (Math.abs(d) > 1e5) return null; return num(`f(x) = e<sup>${poly([[a, 'x²'], [c, '']])}</sup>. Find f′(${S(x0)}). (round to 3 decimals)`, r3(d), `f′(x) = e<sup>${poly([[a, 'x²'], [c, '']])}</sup>·${2 * a}x ≈ ${b(r3(d))}.`); }
    const cc = ri(1, 6), aa = ri(1, 4), d = (2 * aa * x0) / (aa * x0 * x0 + cc);
    return num(`f(x) = ln(${poly([[aa, 'x²'], [cc, '']])}). Find f′(${S(x0)}). (round to 3 decimals)`, r3(d), `f′(x) = ${2 * aa}x / (${poly([[aa, 'x²'], [cc, '']])}) ≈ ${b(r3(d))}.`);
  }),
  R(/^Find derivatives using implicit differentiation$|^Find tangent lines using implicit differentiation$/, (mt, ctx) => () => {
    const kind = ri(0, 2); let eq, x0, y0, d;
    if (kind === 0) { const [p, q, h] = pick(TRIPLES); x0 = pick([1, -1]) * p; y0 = pick([1, -1]) * q; eq = `x² + y² = ${h * h}`; d = -x0 / y0; }
    else if (kind === 1) { x0 = nz(-5, 5); y0 = nz(-5, 5); eq = `xy = ${S(x0 * y0)}`; d = -y0 / x0; }
    else { x0 = nz(-3, 3); y0 = nz(-3, 3); const k = x0 * x0 + x0 * y0 + y0 * y0; eq = `x² + xy + y² = ${k}`; if (x0 + 2 * y0 === 0) return null; d = -(2 * x0 + y0) / (x0 + 2 * y0); }
    if (/tangent/.test(ctx.title)) { const bInt = y0 - d * x0; return num(`Find the y-intercept of the tangent line to ${m(eq)} at (${S(x0)}, ${S(y0)}). (round to 2 decimals)`, r2(bInt), `dy/dx = ${r3(d)} at the point; y − ${S(y0)} = ${r3(d)}(x − ${S(x0)}) gives a y-intercept of ${b(r2(bInt))}.`); }
    return num(`Find dy/dx for ${m(eq)} at the point (${S(x0)}, ${S(y0)}). (round to 2 decimals)`, r2(d), `Differentiate implicitly and solve for dy/dx, then substitute: ${b(r2(d))}.`);
  }),
  R(/^Find derivatives using logarithmic differentiation$/, () => () => {
    const kind = ri(0, 2), x0 = pick([1, 2, 3, 0.5]);
    if (kind === 0) { const d = x0 ** x0 * (Math.log(x0) + 1); return num(`f(x) = x<sup>x</sup>. Find f′(${x0}). (round to 3 decimals)`, r3(d), `ln f = x ln x, so f′ = x<sup>x</sup>(ln x + 1) ≈ ${b(r3(d))}.`); }
    if (kind === 1) { const k = ri(2, 4), d = x0 ** (k * x0) * (k * Math.log(x0) + k); return num(`f(x) = x<sup>${k}x</sup>. Find f′(${x0}). (round to 3 decimals)`, r3(d), `ln f = ${k}x ln x, so f′ = x<sup>${k}x</sup>(${k} ln x + ${k}) ≈ ${b(r3(d))}.`); }
    const p = ri(1, 3), q = ri(1, 3), r = ri(1, 2), xx = ri(0, 3), f = (xx + 1) ** p * (xx + 2) ** q / (xx + 3) ** r, d = f * (p / (xx + 1) + q / (xx + 2) - r / (xx + 3));
    return num(`f(x) = (x + 1)<sup>${p}</sup>(x + 2)<sup>${q}</sup> / (x + 3)<sup>${r}</sup>. Use logarithmic differentiation to find f′(${xx}). (round to 3 decimals)`, r3(d), `f′/f = ${p}/(x + 1) + ${q}/(x + 2) − ${r}/(x + 3); at x = ${xx}, f = ${r3(f)}, so f′ ≈ ${b(r3(d))}.`);
  }),
  R(/^Find second derivatives of trigonometric, exponential and logarithmic functions$/, () => () => {
    const a = nz(-3, 3), x0 = pick([0, 0.5, 1, 2]), k = ri(0, 3);
    if (k === 0) return num(`f(x) = sin(${a === 1 ? '' : a === -1 ? MINUS : a}x). Find f″(${x0}). (round to 3 decimals)`, r3(-a * a * Math.sin(a * x0)), `f″(x) = −${a * a} sin(${a}x) ≈ ${b(r3(-a * a * Math.sin(a * x0)))}.`);
    if (k === 1) return num(`f(x) = cos(${a === 1 ? '' : a === -1 ? MINUS : a}x). Find f″(${x0}). (round to 3 decimals)`, r3(-a * a * Math.cos(a * x0)), `f″(x) = −${a * a} cos(${a}x) ≈ ${b(r3(-a * a * Math.cos(a * x0)))}.`);
    if (k === 2) return num(`f(x) = e<sup>${a}x</sup>. Find f″(${x0}). (round to 3 decimals)`, r3(a * a * Math.exp(a * x0)), `f″(x) = ${a * a}e<sup>${a}x</sup> ≈ ${b(r3(a * a * Math.exp(a * x0)))}.`);
    const xp = pick([1, 2, 3, 4, 5]), c = ri(1, 5); return num(`f(x) = ${c} ln x. Find f″(${xp}). (round to 3 decimals)`, r3(-c / (xp * xp)), `f′(x) = ${c}/x, f″(x) = −${c}/x² = ${b(r3(-c / (xp * xp)))}.`);
  }),
  R(/^Evaluate definite integrals involving trigonometric functions$/, () => () => {
    const a = pick([1, 2, 3]), k = ri(0, 2), ends = pick([[0, 'π/6', Math.PI / 6], [0, 'π/4', Math.PI / 4], [0, 'π/3', Math.PI / 3], [0, 'π/2', Math.PI / 2], [0, 'π', Math.PI]]), U = ends[2];
    const c = ri(1, 5);
    if (k === 0) { const v = c * (1 - Math.cos(a * U)) / a; return num(`Evaluate ${m(`∫<sub>0</sub><sup>${ends[1]}</sup> ${c === 1 ? '' : c}sin(${a === 1 ? '' : a}x) dx`)}. (round to 3 decimals)`, r3(v), `= ${c}/${a}·[−cos(${a}x)] from 0 to ${ends[1]} ≈ ${b(r3(v))}.`); }
    if (k === 1) { const v = c * Math.sin(a * U) / a; return num(`Evaluate ${m(`∫<sub>0</sub><sup>${ends[1]}</sup> ${c === 1 ? '' : c}cos(${a === 1 ? '' : a}x) dx`)}. (round to 3 decimals)`, r3(v), `= ${c}/${a}·[sin(${a}x)] from 0 to ${ends[1]} ≈ ${b(r3(v))}.`); }
    if (U >= Math.PI / 2) return null; const v = c * Math.tan(U); return num(`Evaluate ${m(`∫<sub>0</sub><sup>${ends[1]}</sup> ${c === 1 ? '' : c}sec²x dx`)}. (round to 3 decimals)`, r3(v), `= ${c}[tan x] from 0 to ${ends[1]} ≈ ${b(r3(v))}.`);
  }),
  R(/^Evaluate definite integrals using substitution$/, () => () => {
    const n = ri(1, 4), c = ri(1, 3), top = ri(1, 3), k = ri(0, 1);
    if (k === 0) { const v = ((top * top + c) ** (n + 1) - c ** (n + 1)) / (n + 1); return num(`Evaluate ${m(`∫<sub>0</sub><sup>${top}</sup> 2x(x² + ${c})<sup>${n}</sup> dx`)}. (round to 2 decimals if needed)`, r2(v), `Let u = x² + ${c}: ∫ from ${c} to ${top * top + c} of u<sup>${n}</sup> du = [u<sup>${n + 1}</sup>/${n + 1}] = ${b(r2(v))}.`); }
    const v = (Math.exp(top * top) - 1) / 2 * c; return num(`Evaluate ${m(`∫<sub>0</sub><sup>${top}</sup> ${c === 1 ? '' : c}x·e<sup>x²</sup> dx`)}. (round to 2 decimals)`, r2(v), `Let u = x²: ${c}/2·(e<sup>${top * top}</sup> − 1) ≈ ${b(r2(v))}.`);
  }),
  R(/^Areas of regions bounded by graphs and the y-axis$|^Areas of regions bounded by two curves: functions of y$|^Areas of regions bounded by curves with more than two intersection points$/, (mt, ctx) => () => {
    const t = ctx.title;
    if (/y-axis/.test(t)) { const a = ri(1, 4), c = ri(2, 6), A = a * c ** 3 / 6; return num(`Find the area of the region bounded by ${m(`x = ${a === 1 ? '' : a}y(${c} − y)`)} and the y-axis. (round to 2 decimals)`, r2(A), `The curve meets the y-axis at y = 0 and y = ${c}: ∫<sub>0</sub><sup>${c}</sup> ${a}y(${c} − y) dy = ${a}·${c}³/6 ≈ ${b(r2(A))}.`); }
    if (/functions of y/.test(t)) {
      if (Math.random() < 0.5) { const q = ri(1, 8), A = q ** 3 / 6; return num(`Find the area between ${m('x = y²')} and ${m(`x = ${q === 1 ? '' : q}y`)}. (round to 2 decimals)`, r2(A), `They meet at y = 0 and y = ${q}: ∫<sub>0</sub><sup>${q}</sup> (${q}y − y²) dy = ${q}³/6 ≈ ${b(r2(A))}.`); }
      const c = ri(1, 9), A = (4 / 3) * c ** 1.5; return num(`Find the area between ${m('x = y²')} and ${m(`x = ${c}`)}. (round to 2 decimals)`, r2(A), `Integrate in y from −√${c} to √${c}: ∫(${c} − y²) dy = (4/3)·${c}<sup>3/2</sup> ≈ ${b(r2(A))}.`);
    }
    if (Math.random() < 0.5) { const q = ri(1, 9), A = q * q / 2; return num(`Find the total area enclosed between ${m('y = x³')} and ${m(`y = ${q === 1 ? '' : q}x`)}. (round to 2 decimals)`, r2(A), `They meet at x = −√${q}, 0, √${q}. By symmetry the area is 2∫<sub>0</sub><sup>√${q}</sup> (${q}x − x³) dx = ${q}²/2 = ${b(r2(A))}.`); }
    const k = ri(1, 4), A = k ** 4 / 2; return num(`Find the total area enclosed between ${m(`y = x³ − ${k * k === 1 ? '' : k * k}x`)} and ${m('y = 0')}. (round to 2 decimals)`, r2(A), `The curves meet at x = −${k}, 0, ${k}. By symmetry the area is 2∫<sub>0</sub><sup>${k}</sup> (${k * k}x − x³) dx = ${k}⁴/2 = ${b(r2(A))}.`);
  }),
  R(/^Find volumes using the disk method: revolve around (?:the x-axis or y-axis|a horizontal or vertical line)$/, (mt, ctx) => () => {
    const t = ctx.title, c = ri(1, 5), a = ri(1, 3), k = ri(0, 1);
    if (/horizontal or vertical/.test(t)) {
      const h = ri(2, 5), d = ri(1, 3);   // region 0 ≤ y ≤ h, 0 ≤ x ≤ c revolved about y = h + d gives a washer; about y = h gives a disk
      if (Math.random() < 0.5) { const V = Math.PI * h * h * c; return num(`The rectangle 0 ≤ x ≤ ${c}, 0 ≤ y ≤ ${h} is revolved about the line ${m(`y = ${h}`)}. Find the volume. (round to 2 decimals)`, r2(V), `Each disk has radius ${h} (from y = 0 up to the line): π·${h}²·${c} ≈ ${b(r2(V))}.`); }
      const V = Math.PI * a * a * c ** 3 / 3; return num(`The triangle bounded by ${m(`y = ${a === 1 ? '' : a}x`)}, the x-axis and ${m(`x = ${c}`)} is revolved about the x-axis. Find the volume. (round to 2 decimals)`, r2(V), `V = π∫<sub>0</sub><sup>${c}</sup> (${a}x)² dx = π·${a * a}·${c}³/3 ≈ ${b(r2(V))}.`);
    }
    if (k === 0) { const V = Math.PI * a * a * c ** 3 / 3; return num(`The region under ${m(`y = ${a === 1 ? '' : a}x`)} from x = 0 to x = ${c} is revolved about the x-axis. Find the volume. (round to 2 decimals)`, r2(V), `V = π∫<sub>0</sub><sup>${c}</sup> (${a}x)² dx = π·${a * a}·${c}³/3 ≈ ${b(r2(V))}.`); }
    const V = Math.PI * c * c / 2 * a; return num(`The region under ${m(`y = √(${a === 1 ? '' : a}x)`)} from x = 0 to x = ${c} is revolved about the x-axis. Find the volume. (round to 2 decimals)`, r2(V), `V = π∫<sub>0</sub><sup>${c}</sup> ${a}x dx = π·${a}·${c}²/2 ≈ ${b(r2(V))}.`);
  })
];
