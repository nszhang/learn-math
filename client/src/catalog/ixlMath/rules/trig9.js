/* Trigonometry, vectors, matrices and conic sections (Grades 9–12). */
import { ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, dec, num, mc, yesNo, near, svg, C, NAMES, gcd, table, plane, MINUS } from '../h.js';
import { R } from '../engine.js';
import { S, P, nz } from './numsys.js';
import { stack, fs, simp } from './fractions.js';

const rad = d => (d * Math.PI) / 180, deg = r => (r * 180) / Math.PI;
const sinD = d => Math.sin(rad(d)), cosD = d => Math.cos(rad(d)), tanD = d => Math.tan(rad(d));
const pt = (x, y) => `(${S(x)}, ${S(y)})`;
/* exact values for special angles */
const EXACT = {
  sin: { 0: '0', 30: '1/2', 45: '√2/2', 60: '√3/2', 90: '1', 120: '√3/2', 135: '√2/2', 150: '1/2', 180: '0', 210: '−1/2', 225: '−√2/2', 240: '−√3/2', 270: '−1', 300: '−√3/2', 315: '−√2/2', 330: '−1/2', 360: '0' },
  cos: { 0: '1', 30: '√3/2', 45: '√2/2', 60: '1/2', 90: '0', 120: '−1/2', 135: '−√2/2', 150: '−√3/2', 180: '−1', 210: '−√3/2', 225: '−√2/2', 240: '−1/2', 270: '0', 300: '1/2', 315: '√2/2', 330: '√3/2', 360: '1' },
  tan: { 0: '0', 30: '√3/3', 45: '1', 60: '√3', 90: 'undefined', 120: '−√3', 135: '−1', 150: '−√3/3', 180: '0', 210: '√3/3', 225: '1', 240: '√3', 270: 'undefined', 300: '−√3', 315: '−1', 330: '−√3/3', 360: '0' }
};
const RECIP = { csc: 'sin', sec: 'cos', cot: 'tan' };
const recipTxt = v_ => { if (v_ === '0') return 'undefined'; if (v_ === 'undefined') return '0'; const neg = v_.startsWith('−'), a = neg ? v_.slice(1) : v_; const map = { '1/2': '2', '√2/2': '√2', '√3/2': '2√3/3', '1': '1', '√3/3': '√3', '√3': '√3/3' }; return map[a] === undefined ? null : (neg ? '−' : '') + map[a]; };
const SPECIAL = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
const valWrong = (ans, key) => uniq(Object.values(EXACT[key]).filter(v_ => v_ !== ans && v_ !== 'undefined')).slice(0, 12);
const quad = d => (d % 360 < 90 ? 'I' : d % 360 < 180 ? 'II' : d % 360 < 270 ? 'III' : 'IV');

function rightTriSvg({ angle, labels }) {          // labels: {adj, opp, hyp}, '?' allowed
  const W = 150, H = 110, ox = 30, oy = 135, inner = `<polygon points="${ox},${oy} ${ox + W},${oy} ${ox + W},${oy - H}" fill="#c7d2fe" stroke="${C.primary}" stroke-width="3"/><polyline points="${ox + W - 14},${oy} ${ox + W - 14},${oy - 14} ${ox + W},${oy - 14}" fill="none" stroke="${C.red}" stroke-width="2"/>` +
    `<text x="${ox + W / 2}" y="${oy + 16}" font-size="13" text-anchor="middle" font-weight="700" fill="${C.red}">${labels.adj}</text><text x="${ox + W + 8}" y="${oy - H / 2}" font-size="13" font-weight="700" fill="${C.red}">${labels.opp}</text><text x="${ox + W / 2 - 14}" y="${oy - H / 2 - 6}" font-size="13" font-weight="700" fill="${C.red}">${labels.hyp}</text><text x="${ox + 34}" y="${oy - 6}" font-size="13" font-weight="700" fill="${C.ink}">${angle}</text>`;
  return svg(W + 90, H + 50, inner, 'aria-label="right triangle"');
}
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];

/* vectors & matrices */
const vecTxt = v_ => `⟨${v_.map(S).join(', ')}⟩`;
const matTxt = M => `<span style="display:inline-block;vertical-align:middle;border-left:2px solid currentColor;border-right:2px solid currentColor;border-radius:6px;padding:0 6px;margin:0 3px"><table style="border-collapse:collapse;display:inline-table">${M.map(r => `<tr>${r.map(c => `<td style="padding:1px 7px;text-align:center">${S(c)}</td>`).join('')}</tr>`).join('')}</table></span>`;
const matPlain = M => `[${M.map(r => r.map(S).join(' ')).join(' ; ')}]`;
const randMat = (r, c, lo = -5, hi = 6) => Array.from({ length: r }, () => Array.from({ length: c }, () => ri(lo, hi)));
const mAdd = (A, B, sg = 1) => A.map((r, i) => r.map((v_, j) => v_ + sg * B[i][j]));
const mScale = (k, A) => A.map(r => r.map(v_ => k * v_));
const mMul = (A, B) => A.map(r => B[0].map((_, j) => sum(r.map((v_, k) => v_ * B[k][j]))));
const det2 = A => A[0][0] * A[1][1] - A[0][1] * A[1][0];
const det3 = A => A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
const matChoices = (ans, tweaks = 3) => { const out = [matPlain(ans)]; for (let i = 0; out.length < tweaks + 1 && i < 30; i++) { const c = ans.map(r => r.slice()); const a = ri(0, c.length - 1), bb = ri(0, c[0].length - 1); c[a][bb] += pick([-2, -1, 1, 2]); const t = matPlain(c); if (!out.includes(t)) out.push(t); } return out.slice(1); };

export const TRIG9_RULES = [
  /* ===== right triangles ===== */
  R(/^Pythagorean [Tt]heorem$|^Pythagorean [Tt]heorem: word problems$/, (mt, ctx) => () => {
    const [a, c, h] = pick(TRIPLES).map(x => x * pick([1, 2])), hide = pick(['h', 'a']);
    return num(`${rightTriSvg({ angle: '', labels: { adj: hide === 'a' ? '?' : a, opp: c, hyp: hide === 'h' ? '?' : h } })}A right triangle has legs and hypotenuse as shown. Find the missing length.`, hide === 'h' ? h : a, hide === 'h' ? `√(${a}² + ${c}²) = ${b(h)}.` : `√(${h}² − ${c}²) = ${b(a)}.`);
  }),
  R(/^Converse of the Pythagorean theorem$/, () => () => {
    const [a, c, h] = pick(TRIPLES), right = Math.random() < 0.5, hh = right ? h : h + 1; return yesNo(`A triangle has sides ${b(a)}, ${b(c)} and ${b(hh)}. Is it a right triangle?`, a * a + c * c === hh * hh, a * a + c * c === hh * hh ? 'The Pythagorean relationship holds.' : `${a}² + ${c}² = ${a * a + c * c} ≠ ${hh * hh}.`, ['Yes', 'No']);
  }),
  R(/^Pythagorean Inequality Theorems$/, () => () => {
    const a = ri(3, 6), c = ri(4, 8), kind = pick(['acute', 'obtuse']), h = kind === 'acute' ? Math.round(Math.sqrt(a * a + c * c)) - 1 + 0 : Math.round(Math.sqrt(a * a + c * c)) + 1, s = [a, c, h].sort((x, y) => x - y), type = s[2] * s[2] < s[0] * s[0] + s[1] * s[1] ? 'acute' : s[2] * s[2] > s[0] * s[0] + s[1] * s[1] ? 'obtuse' : 'right';
    if (s[0] + s[1] <= s[2]) return null; return mc(`A triangle has sides ${b(s.join(', '))}. Is it acute, right or obtuse?`, type, ['acute', 'right', 'obtuse'].filter(v_ => v_ !== type), `Compare ${s[2]}² = ${s[2] ** 2} with ${s[0]}² + ${s[1]}² = ${s[0] ** 2 + s[1] ** 2}.`, 3);
  }),
  R(/^Special right triangles$/, () => () => {
    const k = ri(2, 9), kind = pick(['45', '30']);
    return kind === '45' ? mc(`In a 45°-45°-90° triangle, each leg is ${b(k)}. What is the hypotenuse?`, `${k}√2`, [`${k}`, `${2 * k}`, `${k}√3`], `Hypotenuse = leg × √2 = ${b(k + '√2')}.`, 4) : num(`In a 30°-60°-90° triangle, the shortest side is ${b(k)}. What is the hypotenuse?`, 2 * k, `Hypotenuse = 2 × shortest side = ${b(2 * k)}.`);
  }),

  /* ===== trigonometric ratios ===== */
  R(/^Trigonometric ratios: sin, cos and tan$|^Trigonometric ratios: csc, sec and cot$|^Find trigonometric ratios using right triangles$|^Trigonometric ratios in similar right triangles$/, (mt, ctx) => () => {
    const [a, c, h] = pick(TRIPLES), fn = /csc/.test(ctx.title) ? pick(['csc', 'sec', 'cot']) : pick(['sin', 'cos', 'tan']);
    const val = { sin: [c, h], cos: [a, h], tan: [c, a], csc: [h, c], sec: [h, a], cot: [a, c] }[fn], ans = fs(...simp(...val));
    return mc(`${rightTriSvg({ angle: 'θ', labels: { adj: a, opp: c, hyp: h } })}Find ${b(fn + ' θ')}.`, ans, uniq(Object.values({ sin: [c, h], cos: [a, h], tan: [c, a], csc: [h, c], sec: [h, a], cot: [a, c] }).map(v_ => fs(...simp(...v_)))).filter(v_ => v_ !== ans).slice(0, 3), `${fn} = ${{ sin: 'opposite ÷ hypotenuse', cos: 'adjacent ÷ hypotenuse', tan: 'opposite ÷ adjacent', csc: 'hypotenuse ÷ opposite', sec: 'hypotenuse ÷ adjacent', cot: 'adjacent ÷ opposite' }[fn]} = ${b(ans)}.`, 4);
  }),
  R(/^Trigonometric ratios: find a side length$/, () => () => {
    const th = pick([20, 25, 30, 35, 40, 50, 55, 60]), hyp = ri(8, 40), fn = pick(['sin', 'cos']), side = fn === 'sin' ? hyp * sinD(th) : hyp * cosD(th);
    return num(`${rightTriSvg({ angle: th + '°', labels: { adj: fn === 'cos' ? 'x' : '', opp: fn === 'sin' ? 'x' : '', hyp } })}Find x. (round to 1 decimal)`, fix(side, 1), `x = ${hyp} × ${fn} ${th}° ≈ ${b(fix(side, 1))}.`);
  }),
  R(/^Trigonometric ratios: find an angle measure$|^Solve a right triangle$/, (mt, ctx) => () => {
    const [a, c, h] = pick(TRIPLES), th = Math.round(deg(Math.atan2(c, a)) * 10) / 10;
    return /Solve/.test(ctx.title) ? num(`A right triangle has legs ${b(a)} and ${b(c)}. What is the measure of the angle opposite the leg of length ${b(c)}? (degrees, round to 1 decimal)`, th, `tan⁻¹(${c}/${a}) ≈ ${b(th)}°.`) : num(`${rightTriSvg({ angle: 'θ', labels: { adj: a, opp: c, hyp: '' } })}Find θ. (degrees, round to 1 decimal)`, th, `θ = tan⁻¹(${c}/${a}) ≈ ${b(th)}°.`);
  }),
  R(/^Trigonometric ratios: word problems$/, () => () => {
    const th = pick([25, 30, 35, 40, 50, 60]), d = ri(10, 60), h = fix(d * tanD(th), 1), nm = pick(NAMES);
    return num(`${nm} stands ${b(d + ' m')} from a tree and measures an angle of elevation of ${b(th + '°')} to the top. How tall is the tree? (m, round to 1 decimal; ignore ${nm}'s eye height)`, h, `h = ${d} × tan ${th}° ≈ ${b(h)} m.`);
  }),
  R(/^Find trigonometric functions of special angles$|^Sin, cos and tan of special angles$|^Csc, sec and cot of special angles$|^Find trigonometric ratios using the unit circle$|^Find trigonometric ratios using reference angles$|^Find trigonometric functions using a calculator$/, (mt, ctx) => () => {
    const t = ctx.title, d = pick(SPECIAL.filter(x => x !== 0 && x !== 360));
    if (/calculator/.test(t)) { const a = ri(5, 85), fn = pick(['sin', 'cos', 'tan']), v_ = { sin: sinD, cos: cosD, tan: tanD }[fn](a); return num(`Use a calculator: ${m(`${fn} ${a}°`)} ≈ ? (round to 3 decimals)`, fix(v_, 3), `${fn} ${a}° ≈ ${b(fix(v_, 3))}.`); }
    const fn = /Csc/.test(t) ? pick(['csc', 'sec', 'cot']) : pick(['sin', 'cos', 'tan']), base = RECIP[fn] || fn, ex = EXACT[base][d], ans = RECIP[fn] ? recipTxt(ex) : ex; if (!ans || ans === 'undefined') return null;
    if (/unit circle/.test(t)) { const x = EXACT.cos[d], y = EXACT.sin[d]; return mc(`On the unit circle, the point at ${b(d + '°')} has coordinates ${b(`(${x}, ${y})`)}. What is ${b('sin ' + d + '°')}?`, y, uniq([x, y.startsWith('−') ? y.slice(1) : '−' + y, EXACT.tan[d] === 'undefined' ? '1' : EXACT.tan[d]]).filter(v_ => v_ !== y), `sin is the y-coordinate: ${b(y)}.`, 4); }
    if (/reference/.test(t)) { const ref = d > 90 && d <= 180 ? 180 - d : d > 180 && d <= 270 ? d - 180 : d > 270 ? 360 - d : d; return mc(`What is the reference angle for ${b(d + '°')}?`, ref + '°', uniq([d + '°', (180 - ref) + '°', (ref + 90 > 360 ? 45 : ref + 90) + '°']).filter(v_ => v_ !== ref + '°'), `The reference angle is the acute angle to the x-axis: ${b(ref + '°')}.`, 4); }
    return mc(`Find the exact value of ${m(`${fn} ${d}°`)}.`, ans, uniq(Object.values(EXACT[base]).map(v_ => (RECIP[fn] ? recipTxt(v_) : v_)).filter(v_ => v_ && v_ !== 'undefined' && v_ !== ans)).slice(0, 3), `${fn} ${d}° = ${b(ans)}.`, 4);
  }),
  R(/^Inverses of (?:sin, cos and tan|csc, sec and cot|trigonometric functions)$/, (mt, ctx) => () => {
    const fn = pick(['sin', 'cos', 'tan']), d = pick([30, 45, 60]), v_ = EXACT[fn][d];
    return mc(`Find ${m(`${fn}⁻¹(${v_})`)} in degrees (principal value).`, d + '°', [(90 - d) + '°', (d * 2) + '°', '0°'].filter(x => x !== d + '°'), `${fn} ${d}° = ${v_}, so ${fn}⁻¹(${v_}) = ${b(d + '°')}.`, 4);
  }),
  R(/^Solve trigonometric equations(?: I| II)?$/, (mt, ctx) => () => {
    const fn = pick(['sin', 'cos']), d = pick([30, 45, 60]), v_ = EXACT[fn][d], sol = fn === 'sin' ? [d, 180 - d] : [d, 360 - d];
    return mc(`Solve ${m(`${fn} θ = ${v_}`)} for 0° ≤ θ < 360°.`, sol.sort((x, y) => x - y).map(x => x + '°').join(' and '), uniq([`${d}° only`, `${d}° and ${180 + d}°`, `${360 - d}° and ${180 + d}°`]).filter(v_2 => v_2 !== sol.join(' and ')), `Use the reference angle ${d}° in the quadrants where ${fn} is positive.`, 4);
  }),
  R(/^Sine Law$|^Cosine Law$|^Solve a triangle$/, (mt, ctx) => () => {
    const A = ri(30, 70), B = ri(40, 80), a = ri(8, 25), C = 180 - A - B, bb = fix((a * sinD(B)) / sinD(A), 1);
    if (/Cosine/.test(ctx.title)) { const s1 = ri(5, 12), s2 = ri(5, 12), ang = pick([40, 50, 60, 70, 80, 100]), c3 = fix(Math.sqrt(s1 * s1 + s2 * s2 - 2 * s1 * s2 * cosD(ang)), 1); return num(`In a triangle, two sides are ${b(s1)} and ${b(s2)} with an included angle of ${b(ang + '°')}. Find the third side. (round to 1 decimal)`, c3, `c² = ${s1}² + ${s2}² − 2(${s1})(${s2})cos ${ang}°, so c ≈ ${b(c3)}.`); }
    if (/Solve a triangle/.test(ctx.title)) return num(`In triangle ABC, A = ${b(A + '°')}, B = ${b(B + '°')} and side a = ${b(a)}. Find angle C. (degrees)`, C, `C = 180° − ${A}° − ${B}° = ${b(C)}°.`);
    return num(`In triangle ABC, A = ${b(A + '°')}, B = ${b(B + '°')} and a = ${b(a)}. Use the Sine Law to find b. (round to 1 decimal)`, bb, `b = a sin B ÷ sin A ≈ ${b(bb)}.`);
  }),
  R(/^Area of a triangle: (?:sine formula|Sine Law|Heron's formula)$/, (mt, ctx) => () => {
    if (/Heron/.test(ctx.title)) { const [a, c, h] = pick([[13, 14, 15], [5, 12, 13], [9, 10, 17], [7, 15, 20]].slice(0, 2)), s_ = (a + c + h) / 2, area = Math.sqrt(s_ * (s_ - a) * (s_ - c) * (s_ - h)); return num(`A triangle has sides ${b(a)}, ${b(c)} and ${b(h)}. Use Heron's formula to find its area.`, fix(area, 2), `s = ${s_}; area = √(s(s−a)(s−b)(s−c)) = ${b(fix(area, 2))}.`); }
    const a = ri(5, 15), c = ri(5, 15), ang = pick([30, 40, 50, 60, 70, 90]), area = fix(0.5 * a * c * sinD(ang), 1); return num(`Two sides of a triangle are ${b(a)} and ${b(c)} with an included angle of ${b(ang + '°')}. Find its area. (round to 1 decimal)`, area, `A = ½ab sin C = ${b(area)}.`);
  }),
  R(/^Graphs of angles I{1,2}$|^Quadrants$|^Coterminal angles$|^Coterminal and reference angles$|^Reference angles$/, (mt, ctx) => () => {
    const d = ri(30, 330) * pick([1, 1, -1]), t = ctx.title;
    if (/Coterminal/.test(t)) { const ang = ri(10, 350), k = pick([1, -1, 2]); return num(`The angle ${b(S(ang + k * 360) + '°')} is coterminal with an angle between 0° and 360°. What is that angle? (degrees)`, ang, `Add or subtract full turns of 360°: ${b(ang + '°')}.`); }
    if (/Reference/.test(t)) { const ang = ri(100, 350), ref = ang > 270 ? 360 - ang : ang > 180 ? ang - 180 : 180 - ang; return num(`What is the reference angle of ${b(ang + '°')}? (degrees)`, ref, `The acute angle to the x-axis is ${b(ref)}°.`); }
    const ang = ri(10, 350); return mc(`In which quadrant does an angle of ${b(ang + '°')} in standard position terminate?`, quad(ang), ['I', 'II', 'III', 'IV'].filter(v_ => v_ !== quad(ang)), `${ang}° is in quadrant ${b(quad(ang))}.`, 4);
  }),
  R(/^Convert between radians and degrees$|^Radians and arc length$/, (mt, ctx) => () => {
    const [n, d] = pick([[1, 6], [1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [5, 6], [1, 1], [3, 2]]), degs = (180 * n) / d;
    if (/arc/.test(ctx.title)) { const r = ri(2, 10); return num(`A circle has radius ${b(r)}. What is the arc length for a central angle of ${b(fs(n, d) + 'π')} radians? (Give the number in front of π.)`, fix((n * r) / d, 3), `s = rθ = ${r} × ${fs(n, d)}π = ${b(fix((n * r) / d, 3))}π.`); }
    return Math.random() < 0.5 ? mc(`Convert ${b(degs + '°')} to radians.`, `${fs(n, d)}π`.replace('1/1π', 'π'), uniq([`${fs(d, n)}π`, `${fs(n + 1, d)}π`, `${fs(n, d + 1)}π`]).filter(v_ => v_ !== `${fs(n, d)}π`.replace('1/1π', 'π')), `${degs}° × π/180° = ${b(`${fs(n, d)}π`)}.`, 4) : num(`Convert ${b(fs(n, d) + 'π')} radians to degrees.`, degs, `${fs(n, d)}π × 180/π = ${b(degs)}°.`);
  }),
  R(/^Symmetry and periodicity of trigonometric functions$|^Complementary angle identities$/, (mt, ctx) => () => {
    const a = pick([20, 25, 30, 40, 50, 65]);
    return /Complementary/.test(ctx.title) ? mc(`${m(`sin ${a}°`)} = ${m('cos ___')}`, (90 - a) + '°', [a + '°', (180 - a) + '°', (90 + a) + '°'], `sin θ = cos(90° − θ): ${b((90 - a) + '°')}.`, 4) : mc(`${m(`sin(${a}° + 360°)`)} = ?`, `sin ${a}°`, [`cos ${a}°`, `−sin ${a}°`, `sin ${a + 180}°`], `Sine has period 360°.`, 4);
  }),
  R(/^Find trigonometric ratios using a Pythagorean or reciprocal identity$|^Find trigonometric ratios using multiple identities$|^Trigonometric sum and difference identities$/, (mt, ctx) => () => {
    const [p, q, r] = pick(TRIPLES); if (/sum and difference/.test(ctx.title)) { const a = pick([30, 45, 60]), c = pick([30, 45, 60]); const v_ = fix(sinD(a + c), 3); return num(`Use ${m('sin(A + B) = sin A cos B + cos A sin B')} to find ${m(`sin ${a + c}°`)} with A = ${a}°, B = ${c}°. (round to 3 decimals)`, v_, `sin ${a + c}° ≈ ${b(v_)}.`); }
    return mc(`If ${m(`sin θ = ${fs(q, r)}`)} and θ is in quadrant I, what is ${b('cos θ')}?`, fs(p, r), [fs(r, p), fs(q, p), fs(-p, r).replace('-', MINUS)], `cos²θ = 1 − sin²θ, so cos θ = ${b(fs(p, r))}.`, 4);
  }),

  /* ===== graphs of sine and cosine ===== */
  R(/^Find properties of sine functions$|^Find properties of cosine functions$|^Write equations of (?:sine|cosine) functions(?: from graphs| using properties)$|^Graph (?:sine|cosine|sine and cosine) functions$/, (mt, ctx) => () => {
    const fn = /cosine/.test(ctx.title) ? 'cos' : 'sin', A = ri(1, 5), k = ri(-3, 3);
    const q = pick(['amplitude', 'period', 'midline']);
    if (/Write equations/.test(ctx.title)) return mc(`A ${fn} function has amplitude ${b(A)}, period ${b('360°')} and midline ${b('y = ' + S(k))}. Which equation matches?`, `y = ${A === 1 ? '' : A}${fn}(x) ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`.replace(/ [+−] 0$/, ''), [`y = ${k === 0 ? 1 : Math.abs(k)}${fn}(x) + ${A}`, `y = ${A}${fn}(2x) ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`, `y = ${A + 1}${fn}(x) ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`].map(v_ => v_.replace(/ [+−] 0$/, '')), `Amplitude ${A}, vertical shift ${S(k)}, period 360° (B = 1).`, 4);
    if (q === 'amplitude') return num(`What is the amplitude of ${m(`y = ${A}${fn}(x) ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`.replace(/ [+−] 0$/, ''))}?`, A, `Amplitude = |${A}| = ${b(A)}.`);
    if (q === 'midline') return num(`What is the midline value (y = ?) of ${m(`y = ${A}${fn}(x) ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`.replace(/ [+−] 0$/, ''))}?`, k, `The midline is y = ${b(S(k))}.`);
    const B2 = pick([1, 2, 3, 4]); return num(`What is the period (in degrees) of ${m(`y = ${fn}(${B2 === 1 ? '' : B2}x)`)}?`, 360 / B2, `Period = 360° ÷ ${B2} = ${b(360 / B2)}°.`);
  }),

  /* ===== vectors ===== */
  R(/^Find the magnitude of a vector$|^Find the magnitude of a three-dimensional vector$/, (mt, ctx) => () => {
    if (/three/.test(ctx.title)) { const [x, y, z] = pick([[2, 3, 6], [1, 2, 2], [2, 6, 9], [4, 4, 7]]); return num(`Find the magnitude of ${m(vecTxt([x, y, z]))}.`, Math.sqrt(x * x + y * y + z * z), `√(${x}² + ${y}² + ${z}²) = ${b(Math.sqrt(x * x + y * y + z * z))}.`); }
    const [x, y] = pick([[3, 4], [5, 12], [6, 8], [8, 15]]).map(v_ => v_ * pick([1, -1])); return num(`Find the magnitude of ${m(vecTxt([x, y]))}.`, Math.hypot(x, y), `√(${x}² + ${y}²) = ${b(Math.hypot(x, y))}.`);
  }),
  R(/^Find the component form of a vector$|^Find the component form of a three-dimensional vector$/, (mt, ctx) => () => {
    const three = /three/.test(ctx.title), p = three ? [ri(-5, 5), ri(-5, 5), ri(-5, 5)] : [ri(-5, 5), ri(-5, 5)], q = p.map(v_ => v_ + nz(-6, 6)), comp = q.map((v_, i) => v_ - p[i]);
    return mc(`Find the component form of the vector from ${b(`(${p.map(S).join(', ')})`)} to ${b(`(${q.map(S).join(', ')})`)}.`, vecTxt(comp), uniq([vecTxt(comp.map(v_ => -v_)), vecTxt(comp.map((v_, i) => v_ + 1)), vecTxt(p.map((v_, i) => v_ + q[i]))]).filter(v_ => v_ !== vecTxt(comp)), `Subtract the initial point from the terminal point: ${b(vecTxt(comp))}.`, 4);
  }),
  R(/^Find the direction angle of a vector$|^Find the component form of a vector from its magnitude and direction angle$|^Find the magnitude or direction of a vector scalar multiple$/, (mt, ctx) => () => {
    const t = ctx.title, [x, y] = pick([[1, 1], [1, 2], [3, 4], [2, 1]]), ang = fix(deg(Math.atan2(y, x)), 1);
    if (/component form/.test(t)) { const mag = ri(2, 10), a = pick([0, 90, 180, 270, 30, 60]), cx = fix(mag * cosD(a), 2), cy = fix(mag * sinD(a), 2); return mc(`A vector has magnitude ${b(mag)} and direction angle ${b(a + '°')}. What is its component form? (round to 2 decimals)`, `⟨${S(cx)}, ${S(cy)}⟩`, uniq([`⟨${S(cy)}, ${S(cx)}⟩`, `⟨${S(-cx)}, ${S(cy)}⟩`, `⟨${S(cx)}, ${S(-cy)}⟩`]).filter(v_ => v_ !== `⟨${S(cx)}, ${S(cy)}⟩`), `⟨r cos θ, r sin θ⟩ = ${b(`⟨${S(cx)}, ${S(cy)}⟩`)}.`, 4); }
    if (/scalar multiple/.test(t)) { const k = pick([2, 3, -2]); return num(`The vector ${m(vecTxt([3 * 1, 4]))} is multiplied by ${b(S(k))}. What is the magnitude of the new vector?`, Math.abs(k) * 5, `|${S(k)}| × 5 = ${b(Math.abs(k) * 5)}.`); }
    return num(`Find the direction angle of ${m(vecTxt([x, y]))} (degrees, round to 1 decimal).`, ang, `θ = tan⁻¹(${y}/${x}) ≈ ${b(ang)}°.`);
  }),
  R(/^Find a unit vector$|^Find a three-dimensional unit vector$/, (mt, ctx) => () => {
    const three = /three/.test(ctx.title), v_ = three ? pick([[2, 3, 6], [1, 2, 2]]) : pick([[3, 4], [5, 12], [6, 8]]), mag = Math.sqrt(sum(v_.map(x => x * x)));
    return mc(`Find the unit vector in the direction of ${m(vecTxt(v_))}.`, `⟨${v_.map(x => fs(...simp(x, mag))).join(', ')}⟩`, uniq([`⟨${v_.map(x => fs(...simp(x, mag * 2))).join(', ')}⟩`, `⟨${v_.map(x => fs(...simp(x, mag + 1))).join(', ')}⟩`, `⟨${v_.map(x => S(x)).join(', ')}⟩`]), `Divide each component by the magnitude ${mag}.`, 4);
  }),
  R(/^Add and subtract vectors$|^Add and subtract three-dimensional vectors$|^Multiply a vector by a scalar$|^Scalar multiples of three-dimensional vectors$|^Linear combinations of vectors$|^Linear combinations of three-dimensional vectors$|^Find the magnitude and direction of a vector sum$/, (mt, ctx) => () => {
    const three = /three/.test(ctx.title), u = Array.from({ length: three ? 3 : 2 }, () => nz(-5, 5)), w = Array.from({ length: three ? 3 : 2 }, () => nz(-5, 5)), k = nz(-3, 3), t = ctx.title;
    if (/magnitude and direction/.test(t)) { const s_ = u.map((x, i) => x + w[i]); return num(`Find the magnitude of ${m(vecTxt(u))} + ${m(vecTxt(w))}. (round to 1 decimal)`, fix(Math.hypot(...s_), 1), `Sum = ${vecTxt(s_)}; magnitude ≈ ${b(fix(Math.hypot(...s_), 1))}.`); }
    if (/Scalar|Multiply/.test(t)) { const res = u.map(x => k * x); return mc(`${m(`${S(k)}${vecTxt(u)}`)} = ?`, vecTxt(res), uniq([vecTxt(u.map(x => x + k)), vecTxt(res.map(x => -x)), vecTxt(u)]).filter(v_ => v_ !== vecTxt(res)), `Multiply each component by ${S(k)}.`, 4); }
    if (/Linear/.test(t)) { const a = nz(-3, 3), c = nz(-3, 3), res = u.map((x, i) => a * x + c * w[i]); return mc(`${m(`${S(a)}${vecTxt(u)} + ${S(c)}${vecTxt(w)}`)} = ?`, vecTxt(res), uniq([vecTxt(u.map((x, i) => a * x - c * w[i])), vecTxt(u.map((x, i) => x + w[i])), vecTxt(res.map(x => -x))]).filter(v_ => v_ !== vecTxt(res)), `Scale each vector, then add components.`, 4); }
    const sub = Math.random() < 0.5, res = u.map((x, i) => (sub ? x - w[i] : x + w[i])); return mc(`${m(`${vecTxt(u)} ${sub ? '−' : '+'} ${vecTxt(w)}`)} = ?`, vecTxt(res), uniq([vecTxt(u.map((x, i) => (sub ? x + w[i] : x - w[i]))), vecTxt(res.map(x => -x)), vecTxt(u.map((x, i) => x * w[i]))]).filter(v_ => v_ !== vecTxt(res)), `${sub ? 'Subtract' : 'Add'} the components.`, 4);
  }),
  R(/^Graph a resultant vector using the (?:triangle|parallelogram) method$/, (mt, ctx) => () => {
    const u = [ri(1, 4), ri(0, 3)], w = [ri(0, 3), ri(1, 4)], res = [u[0] + w[0], u[1] + w[1]];
    return mc(`${plane({ min: 0, max: 10, lines: [[0, 0, ...u], [u[0], u[1], ...res]], points: [{ x: res[0], y: res[1], label: 'R', color: C.red }], labelEvery: 2, size: 260 })}Vector u = ${vecTxt(u)} is drawn from the origin, and w = ${vecTxt(w)} is drawn starting at the tip of u (${/triangle/.test(ctx.title) ? 'triangle method' : 'parallelogram method'}). What is the resultant u + w?`, vecTxt(res), [vecTxt([u[0] - w[0], u[1] - w[1]]), vecTxt([w[0], u[1]]), vecTxt(u)].filter(v_ => v_ !== vecTxt(res)), `Add components: ${b(vecTxt(res))}.`, 4);
  }),

  /* ===== matrices ===== */
  R(/^Matrix vocabulary$/, () => () => {
    const r = ri(2, 4), c = ri(2, 4), M = randMat(r, c); return mc(`${matTxt(M)}What are the dimensions of this matrix (rows × columns)?`, `${r} × ${c}`, [`${c} × ${r}`, `${r} × ${r}`, `${r + 1} × ${c}`].filter(v_ => v_ !== `${r} × ${c}`), `${r} rows and ${c} columns.`, 4);
  }),
  R(/^Matrix operation rules$/, () => () => {
    const [r1, c1, r2, c2] = [ri(2, 3), ri(2, 3), ri(2, 3), ri(2, 3)], canAdd = r1 === r2 && c1 === c2, canMul = c1 === r2, op = pick(['add', 'multiply']);
    return yesNo(`Can a ${r1} × ${c1} matrix and a ${r2} × ${c2} matrix be ${op === 'add' ? 'added' : 'multiplied (in that order)'}?`, op === 'add' ? canAdd : canMul, op === 'add' ? 'Matrices can be added only if they have the same dimensions.' : 'The number of columns of the first must equal the number of rows of the second.', ['Yes', 'No']);
  }),
  R(/^Add and subtract matrices$/, () => () => {
    const A = randMat(2, 2), B = randMat(2, 2), sub = Math.random() < 0.5, res = mAdd(A, B, sub ? -1 : 1);
    return mc(`${matTxt(A)} ${sub ? '−' : '+'} ${matTxt(B)} = ?`, matPlain(res), matChoices(res), `${sub ? 'Subtract' : 'Add'} matching entries.`, 4);
  }),
  R(/^Multiply a matrix by a scalar$/, () => () => {
    const A = randMat(2, 2), k = nz(-3, 4), res = mScale(k, A); return mc(`${m(S(k))} ${matTxt(A)} = ?`, matPlain(res), matChoices(res), `Multiply each entry by ${S(k)}.`, 4);
  }),
  R(/^Linear combinations of matrices$|^Simplify matrix expressions$/, () => () => {
    const A = randMat(2, 2), B = randMat(2, 2), a = nz(-2, 3), c = nz(-2, 3), res = mAdd(mScale(a, A), mScale(c, B)); return mc(`${m(`${S(a)}`)}${matTxt(A)} + ${m(`${S(c)}`)}${matTxt(B)} = ?`, matPlain(res), matChoices(res), `Scale each matrix, then add.`, 4);
  }),
  R(/^Multiply two matrices$/, () => () => {
    const A = randMat(2, 2, -3, 4), B = randMat(2, 2, -3, 4), res = mMul(A, B); return mc(`${matTxt(A)}${matTxt(B)} = ?`, matPlain(res), matChoices(res), `Row × column: ${matPlain(res)}.`, 4);
  }),
  R(/^Solve matrix equations$/, () => () => {
    const A = randMat(2, 2), X = randMat(2, 2), B = mAdd(A, X); return mc(`Solve ${m('A + X = B')} for X, where A = ${matTxt(A)} and B = ${matTxt(B)}.`, matPlain(X), matChoices(X), `X = B − A.`, 4);
  }),
  R(/^Determinant of a matrix$/, () => () => {
    const three = Math.random() < 0.3, A = three ? randMat(3, 3, -3, 4) : randMat(2, 2, -5, 6); return num(`Find the determinant of ${matTxt(A)}.`, three ? det3(A) : det2(A), three ? `Expand along a row: ${b(det3(A))}.` : `ad − bc = ${A[0][0]}×${A[1][1]} − ${A[0][1]}×${A[1][0]} = ${b(det2(A))}.`);
  }),
  R(/^Is a matrix invertible\?$/, () => () => {
    const inv = Math.random() < 0.5, a = nz(1, 4), c = nz(1, 4), A = inv ? [[a, c], [c + 1, c + 2]] : [[a, c], [2 * a, 2 * c]]; const ok = det2(A) !== 0;
    return yesNo(`Is ${matTxt(A)} invertible?`, ok, ok ? `det = ${det2(A)} ≠ 0.` : 'det = 0, so there is no inverse.', ['Yes', 'No']);
  }),
  R(/^Inverse of a 2 x 2 matrix$|^Identify inverse matrices$|^Solve matrix equations using inverses$|^Inverse of a 3 x 3 matrix$/, (mt, ctx) => () => {
    const t = ctx.title; let A; do { A = randMat(2, 2, -3, 5); } while (Math.abs(det2(A)) !== 1 && Math.abs(det2(A)) !== 2 || det2(A) === 0);
    const d = det2(A), inv = [[A[1][1] / d, -A[0][1] / d], [-A[1][0] / d, A[0][0] / d]]; if (inv.some(r => r.some(v_ => !Number.isInteger(v_)))) return null;
    if (/Identify/.test(t)) { const yes = Math.random() < 0.5; const B = yes ? inv : inv.map(r => r.map(v_ => v_ + 1)); return yesNo(`Are ${matTxt(A)} and ${matTxt(B)} inverses of each other?`, yes, yes ? 'Their product is the identity.' : 'Their product is not the identity.', ['Yes', 'No']); }
    if (/Solve/.test(t)) { const X = [ri(-3, 3), ri(-3, 3)], Bv = [A[0][0] * X[0] + A[0][1] * X[1], A[1][0] * X[0] + A[1][1] * X[1]]; return mc(`Solve ${m('A')}${m('x')} = ${m('b')} with A = ${matTxt(A)} and b = ${m(vecTxt(Bv))} using the inverse. What is x?`, vecTxt(X), uniq([vecTxt([X[1], X[0]]), vecTxt(X.map(v_ => -v_)), vecTxt([X[0] + 1, X[1]])]), `x = A⁻¹b = ${b(vecTxt(X))}.`, 4); }
    return mc(`Find the inverse of ${matTxt(A)}.`, matPlain(inv), matChoices(inv), `A⁻¹ = (1/${d}) × ${matPlain([[A[1][1], -A[0][1]], [-A[1][0], A[0][0]]])} = ${b(matPlain(inv))}.`, 4);
  }),

  /* ===== conics ===== */
  R(/^Find the centre of a circle$|^Find the radius or diameter of a circle$|^Find properties of circles$|^Write equations of circles in standard form(?: from graphs| using properties)?$|^Graph circles$/, (mt, ctx) => () => {
    const h = nz(-5, 5), k = nz(-5, 5), r = ri(2, 6), t = ctx.title; if (Math.abs(h) === Math.abs(k)) return null; const eq_ = `(x ${h < 0 ? '+' : MINUS} ${Math.abs(h)})² + (y ${k < 0 ? '+' : MINUS} ${Math.abs(k)})² = ${r * r}`.replace('(x − 0)', 'x').replace('(y − 0)', 'y');
    if (/Write/.test(t) || /Graph/.test(t)) return mc(`${/graph|Graph|graphs/.test(t) ? plane({ min: -9, max: 9, points: [{ x: h, y: k, label: 'centre', color: C.primary }, { x: h + r, y: k, color: C.blue }], labelEvery: 3, size: 280 }) : ''}A circle has centre ${b(pt(h, k))} and radius ${b(r)}. Which equation is correct?`, eq_, uniq([`(x ${h < 0 ? MINUS : '+'} ${Math.abs(h)})² + (y ${k < 0 ? MINUS : '+'} ${Math.abs(k)})² = ${r * r}`, `(x ${h < 0 ? '+' : MINUS} ${Math.abs(h)})² + (y ${k < 0 ? '+' : MINUS} ${Math.abs(k)})² = ${r}`, `(x ${h < 0 ? '+' : MINUS} ${Math.abs(h)})² + (y ${k < 0 ? '+' : MINUS} ${Math.abs(k)})² = ${2 * r}`]).filter(v_ => v_ !== eq_), `(x − h)² + (y − k)² = r²: ${b(eq_)}.`, 4);
    if (/radius or diameter/.test(t)) return num(`A circle has equation ${m(eq_)}. What is its diameter?`, 2 * r, `r² = ${r * r}, so r = ${r} and the diameter is ${b(2 * r)}.`);
    return mc(`What is the centre of the circle ${m(eq_)}?`, pt(h, k), [pt(-h, -k), pt(k, h), pt(h, -k)].filter(v_ => v_ !== pt(h, k)), `Centre (h, k) = ${b(pt(h, k))}.`, 4);
  }),
  R(/^Find properties of ellipses$|^Find the eccentricity of an ellipse$|^Write equations of ellipses in standard form$/, (mt, ctx) => () => {
    const [a, c] = pick([[5, 3], [13, 5], [5, 4], [10, 6]]), b_ = Math.sqrt(a * a - c * c);
    if (/eccentricity/.test(ctx.title)) return mc(`An ellipse has semi-major axis ${b(a)} and focal distance c = ${b(c)}. What is its eccentricity?`, fs(...simp(c, a)), [fs(a, c), fs(b_, a), fs(c + 1, a)].map(v_ => v_.replace(/\/1$/, '')).filter(v_ => v_ !== fs(...simp(c, a))), `e = c/a = ${b(fs(...simp(c, a)))}.`, 4);
    if (/Write/.test(ctx.title)) return mc(`Write the equation of the ellipse centred at the origin with horizontal semi-axis ${b(a)} and vertical semi-axis ${b(b_)}.`, `x²/${a * a} + y²/${b_ * b_} = 1`, [`x²/${b_ * b_} + y²/${a * a} = 1`, `x²/${a} + y²/${b_} = 1`, `x²/${a * a} − y²/${b_ * b_} = 1`], `x²/a² + y²/b² = 1.`, 4);
    return num(`An ellipse has the equation ${m(`x²/${a * a} + y²/${b_ * b_} = 1`)}. What is the length of its major axis?`, 2 * a, `Major axis = 2a = ${b(2 * a)}.`);
  }),
  R(/^Find properties of hyperbolas$|^Find the eccentricity of a hyperbola$|^Write equations of hyperbolas in standard form$/, (mt, ctx) => () => {
    const [a, bb] = pick([[3, 4], [5, 12], [4, 3], [8, 15]]), c = Math.sqrt(a * a + bb * bb);
    if (/eccentricity/.test(ctx.title)) return mc(`A hyperbola has a = ${b(a)} and c = ${b(c)}. What is its eccentricity?`, fs(...simp(c, a)), [fs(a, c), fs(bb, a), fs(c - 1, a)].filter(v_ => v_ !== fs(...simp(c, a))), `e = c/a = ${b(fs(...simp(c, a)))}.`, 4);
    if (/Write/.test(ctx.title)) return mc(`Write the equation of the hyperbola centred at the origin that opens left and right with a = ${b(a)} and b = ${b(bb)}.`, `x²/${a * a} − y²/${bb * bb} = 1`, [`y²/${a * a} − x²/${bb * bb} = 1`, `x²/${a * a} + y²/${bb * bb} = 1`, `x²/${bb * bb} − y²/${a * a} = 1`], `x²/a² − y²/b² = 1.`, 4);
    return num(`The hyperbola ${m(`x²/${a * a} − y²/${bb * bb} = 1`)} has foci at (±c, 0). What is c?`, c, `c² = a² + b² = ${a * a + bb * bb}, so c = ${b(c)}.`);
  }),
  R(/^Find properties of parabolas$|^Write equations of parabolas in vertex form$/, (mt, ctx) => () => {
    const p = ri(1, 4), h = ri(-4, 4), k = ri(-4, 4), a = 1 / (4 * p);
    return /Write/.test(ctx.title) ? mc(`A parabola has vertex ${b(pt(h, k))} and focus ${b(pt(h, k + p))}. Which is its equation?`, `y = ${fs(...simp(1, 4 * p))}(x ${h < 0 ? '+' : MINUS} ${Math.abs(h)})² ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`.replace('1/1', '1').replace(/\(x [−+] 0\)/, 'x'), [`y = ${fs(...simp(1, 4 * p + 1))}(x − ${h})² + ${k}`, `y = ${p}(x − ${h})² + ${k}`, `y = −${fs(...simp(1, 4 * p))}(x − ${h})² + ${k}`].filter(v_ => v_ !== ''), `a = 1/(4p) with p = ${p}.`, 4) : num(`A parabola ${m(`y = ${fs(...simp(1, 4 * p))}x²`)} has its focus at (0, p). What is p?`, p, `y = x²/(4p), so p = ${b(p)}.`);
  }),
  R(/^Convert equations of conic sections from general to standard form$/, () => () => {
    const h = ri(1, 4), k = ri(1, 4), r = ri(2, 5), D = -2 * h, E = -2 * k, F = h * h + k * k - r * r;
    return mc(`Write ${m(`x² + y² ${D < 0 ? MINUS : '+'} ${Math.abs(D)}x ${E < 0 ? MINUS : '+'} ${Math.abs(E)}y ${F < 0 ? MINUS : '+'} ${Math.abs(F)} = 0`)} in standard form.`, `(x − ${h})² + (y − ${k})² = ${r * r}`, [`(x + ${h})² + (y + ${k})² = ${r * r}`, `(x − ${h})² + (y − ${k})² = ${r}`, `(x − ${h})² + (y − ${k})² = ${r * r + 1}`], `Complete the square in x and y: ${b(`(x − ${h})² + (y − ${k})² = ${r * r}`)}.`, 4);
  })
];
export { EXACT, matTxt, matPlain };
