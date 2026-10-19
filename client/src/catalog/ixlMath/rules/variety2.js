/* ============================================================
   Generated replacements (Grades 6–12 geometry, logic and reasoning)
   for skills that used to draw from a few fixed questions.
   ============================================================ */
import { ri, pick, shuffle, sample, range, uniq, m, b, fmt, fix, num, mc, yesNo, svg, C, cap, gcd } from '../h.js';
import { R } from '../engine.js';

const MINUS = '−';
const S = n => (n < 0 ? MINUS + Math.abs(n) : String(n));
const pt = (x, y) => `(${S(x)}, ${S(y)})`;
const nz = (lo, hi) => { let x = 0; while (x === 0) x = ri(lo, hi); return x; };
const deg = d => (d * Math.PI) / 180;
const r1 = x => fix(x, 1), r2 = x => fix(x, 2);
const LET = 'ABCDEFGHJKLMNPQRSTUVWXYZ'.split('');
const letters = n => sample(LET, n);
const lin = (a, c, v = 'x') => `${a === 1 ? '' : a === -1 ? MINUS : a}${v}${c ? (c > 0 ? ' + ' + c : ' ' + MINUS + ' ' + Math.abs(c)) : ''}`;
/** a·x + c = d·x + e with an integer solution x0 (both sides positive at x0) */
function linEq(lo = 2, hi = 12) {
  for (let t = 0; t < 100; t++) {
    const x0 = ri(lo, hi), a = ri(2, 9), d = ri(2, 9); if (a === d) continue;
    const c = ri(-20, 30), e = a * x0 + c - d * x0; if (a * x0 + c <= 0) continue;
    return { x0, a, c, d, e, val: a * x0 + c };
  }
  return { x0: 5, a: 3, c: 2, d: 2, e: 7, val: 17 };
}

/* ---------- logic ---------- */
// [subject, [P, not P], [Q, not Q], "if P then Q" is true, converse is true]
const CONDS = [
  ['a polygon', ['has exactly three sides', 'does not have exactly three sides'], ['is a triangle', 'is not a triangle'], true, true],
  ['a number', ['is divisible by 4', 'is not divisible by 4'], ['is even', 'is not even'], true, false],
  ['an angle', ['measures 90°', 'does not measure 90°'], ['is a right angle', 'is not a right angle'], true, true],
  ['a quadrilateral', ['is a square', 'is not a square'], ['is a rectangle', 'is not a rectangle'], true, false],
  ['two lines', ['are perpendicular', 'are not perpendicular'], ['intersect', 'do not intersect'], true, false],
  ['a number', ['is prime', 'is not prime'], ['is odd', 'is not odd'], false, false],
  ['a shape', ['has four sides', 'does not have four sides'], ['is a square', 'is not a square'], false, true],
  ['an animal', ['is a dog', 'is not a dog'], ['is a mammal', 'is not a mammal'], true, false],
  ['a triangle', ['is equilateral', 'is not equilateral'], ['is isosceles', 'is not isosceles'], true, false],
  ['a whole number', ['ends in 0', 'does not end in 0'], ['is divisible by 10', 'is not divisible by 10'], true, true],
  ['a number', ['is a multiple of 6', 'is not a multiple of 6'], ['is a multiple of 3', 'is not a multiple of 3'], true, false],
  ['the number x', ['satisfies x² = 9', 'does not satisfy x² = 9'], ['equals 3', 'does not equal 3'], false, true],
  ['two angles', ['are vertical angles', 'are not vertical angles'], ['are congruent', 'are not congruent'], true, false],
  ['a month', ['is February', 'is not February'], ['has fewer than 30 days', 'does not have fewer than 30 days'], true, true],
  ['a whole number', ['is even', 'is not even'], ['is divisible by 2', 'is not divisible by 2'], true, true],
  ['an angle', ['is acute', 'is not acute'], ['measures less than 90°', 'does not measure less than 90°'], true, true],
  ['a person', ['lives in Toronto', 'does not live in Toronto'], ['lives in Ontario', 'does not live in Ontario'], true, false],
  ['two lines in a plane', ['are parallel', 'are not parallel'], ['never intersect', 'intersect'], true, true],
  ['the number x', ['is greater than 5', 'is not greater than 5'], ['is greater than 2', 'is not greater than 2'], true, false],
  ['a quadrilateral', ['is a rhombus', 'is not a rhombus'], ['has four equal sides', 'does not have four equal sides'], true, true],
  ['a rectangle', ['is a square', 'is not a square'], ['has four equal sides', 'does not have four equal sides'], true, true],
  ['a triangle', ['has a right angle', 'does not have a right angle'], ['has two acute angles', 'does not have two acute angles'], true, false]
];
const pron = subj => (/^two /.test(subj) ? 'they' : 'it');
const ifThen = (subj, p, q) => `If ${subj} ${p}, then ${pron(subj)} ${q}.`;
const sent = (subj, p) => `${cap(subj)} ${p}.`;
const COUNTER = [
  ['All prime numbers are odd.', '2', ['3', '7', '13'], '2 is prime but it is even.'], ['Every quadrilateral with four equal sides is a square.', 'a rhombus with angles 60° and 120°', ['a square', 'a 3 by 3 rectangle', 'a regular hexagon'], 'A rhombus has four equal sides but need not have right angles.'],
  ['The square of a number is always greater than the number.', '0.5', ['3', '10', '7'], '0.5² = 0.25, which is less than 0.5.'], ['All rectangles are squares.', 'a 2 cm by 5 cm rectangle', ['a 3 cm by 3 cm rectangle', 'a 4 cm by 4 cm square', 'a 1 m by 1 m tile'], 'It has unequal sides, so it is not a square.'],
  ['The sum of two odd numbers is odd.', '3 + 5', ['2 + 4', '3 + 4', '1 + 2'], '3 + 5 = 8, which is even.'], ['If two angles are supplementary, they are both obtuse.', '100° and 80°', ['30° and 60°', '45° and 45°', '20° and 70°'], '100° + 80° = 180°, but 80° is acute.'],
  ['Dividing a number always makes it smaller.', '8 ÷ 0.5', ['8 ÷ 2', '10 ÷ 5', '9 ÷ 3'], '8 ÷ 0.5 = 16, which is bigger than 8.'], ['All triangles have a right angle.', 'an equilateral triangle', ['a 3-4-5 triangle', 'an isosceles right triangle', 'a 5-12-13 triangle'], 'Each angle of an equilateral triangle is 60°.'],
  ['If x² > 4, then x > 2.', 'x = −3', ['x = 3', 'x = 5', 'x = 2.5'], '(−3)² = 9 > 4, but −3 is not greater than 2.'], ['The product of two numbers is always larger than either number.', '0.5 × 4', ['3 × 4', '2 × 7', '5 × 5'], '0.5 × 4 = 2, which is less than 4.'],
  ['Every parallelogram is a rectangle.', 'a parallelogram with angles 70° and 110°', ['a square', 'a 2 by 6 rectangle', 'a 5 by 5 rectangle'], 'It has no right angles, so it is not a rectangle.'], ['If a number is a multiple of 3, it is odd.', '12', ['9', '15', '21'], '12 is a multiple of 3 and even.']
];
function counterGen() {
  if (Math.random() < 0.5) return pick(COUNTER);
  const kind = ri(0, 2);
  if (kind === 0) { const a = pick([2, 3, 4, 5]), k = pick([2, 3]), bb = a * k, ans = a * pick(range(1, 9).filter(j => j % k !== 0)); return [`If a number is divisible by ${a}, then it is divisible by ${bb}.`, String(ans), sample(range(1, 6).map(i => bb * i), 3).map(String), `${ans} is divisible by ${a} but not by ${bb}.`]; }
  if (kind === 1) { const n = ri(3, 9), x = -(n + ri(1, 5)); return [`If x < ${n}, then x² < ${n * n}.`, `x = ${S(x)}`, sample(range(0, n - 1), 3).map(v => `x = ${v}`), `${S(x)} < ${n}, but (${S(x)})² = ${x * x}, which is not less than ${n * n}.`]; }
  const ans = pick([9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51]);
  return [`Every odd number greater than 7 is prime.`, String(ans), ['11', '13', '17', '19', '23', '29'].filter(x => +x !== ans).slice(0, 3), `${ans} is odd and greater than 7, but it is not prime.`];
}

/* ---------- triangles ---------- */
function randTri() {
  for (let t = 0; t < 200; t++) {
    const P = [[ri(20, 70), ri(110, 140)], [ri(150, 220), ri(110, 140)], [ri(60, 180), ri(15, 50)]];
    const ang = i => { const [a, bb, c] = [P[i], P[(i + 1) % 3], P[(i + 2) % 3]]; const u = [bb[0] - a[0], bb[1] - a[1]], v = [c[0] - a[0], c[1] - a[1]]; return Math.acos((u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)) * 180 / Math.PI; };
    if ([0, 1, 2].every(i => ang(i) > 30 && ang(i) < 105)) return P;
  }
  return [[40, 130], [200, 130], [110, 30]];
}
function specialSegment(kind) {
  const P = randTri(), [A, B, Cc] = P, L = letters(4), ink = C.ink, col = C.red;
  const line = (p, q, c = ink, w = 2.5, dash = '') => `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${c}" stroke-width="${w}" ${dash}/>`;
  let s = `<polygon points="${P.map(p => p.join(',')).join(' ')}" fill="#e0e7ff" stroke="${ink}" stroke-width="2.5"/>`;
  const mid = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
  const tick = (p, q) => { const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy), nx = -dy / l * 6, ny = dx / l * 6; return line([mx - nx, my - ny], [mx + nx, my + ny], col, 2); };
  const foot = (() => { const d = [B[0] - A[0], B[1] - A[1]], t = ((Cc[0] - A[0]) * d[0] + (Cc[1] - A[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2); return [A[0] + t * d[0], A[1] + t * d[1]]; })();
  const rightMark = (f, along, toward) => { const u = [(along[0] - f[0]), (along[1] - f[1])], lu = Math.hypot(...u), v = [toward[0] - f[0], toward[1] - f[1]], lv = Math.hypot(...v), k = 9; const p1 = [f[0] + u[0] / lu * k, f[1] + u[1] / lu * k], p3 = [f[0] + v[0] / lv * k, f[1] + v[1] / lv * k]; return `<polyline points="${p1.join(',')} ${p1[0] + v[0] / lv * k},${p1[1] + v[1] / lv * k} ${p3.join(',')}" fill="none" stroke="${col}" stroke-width="2"/>`; };
  if (kind === 'median') s += line(Cc, mid, col, 3) + tick(A, mid) + tick(mid, B);
  else if (kind === 'altitude') s += line(Cc, foot, col, 3) + rightMark(foot, B, Cc);
  else if (kind === 'angle bisector') { const u = [A[0] - Cc[0], A[1] - Cc[1]], v = [B[0] - Cc[0], B[1] - Cc[1]], lu = Math.hypot(...u), lv = Math.hypot(...v), dir = [u[0] / lu + v[0] / lv, u[1] / lu + v[1] / lv]; const t = ((A[0] - Cc[0]) * (B[1] - A[1]) - (A[1] - Cc[1]) * (B[0] - A[0])) / (dir[0] * (B[1] - A[1]) - dir[1] * (B[0] - A[0])); const D = [Cc[0] + dir[0] * t, Cc[1] + dir[1] * t]; s += line(Cc, D, col, 3); const arc = (from, r) => { const a1 = Math.atan2(from[1] - Cc[1], from[0] - Cc[0]), a2 = Math.atan2(D[1] - Cc[1], D[0] - Cc[0]); return `<path d="M${Cc[0] + r * Math.cos(a1)},${Cc[1] + r * Math.sin(a1)} A${r},${r} 0 0 ${a2 > a1 ? 1 : 0} ${Cc[0] + r * Math.cos(a2)},${Cc[1] + r * Math.sin(a2)}" fill="none" stroke="${col}" stroke-width="2"/>`; }; s += arc(A, 20) + arc(B, 26); }
  else { const d = [B[0] - A[0], B[1] - A[1]], l = Math.hypot(...d), n = [-d[1] / l, d[0] / l]; s += line([mid[0] - n[0] * 60, mid[1] - n[1] * 60], [mid[0] + n[0] * 60, mid[1] + n[1] * 60], col, 3, 'stroke-dasharray="7 4"') + tick(A, mid) + tick(mid, B) + rightMark(mid, B, [mid[0] - n[0] * 30, mid[1] - n[1] * 30]); }
  const lab = (p, t) => `<text x="${p[0]}" y="${p[1] + (p[1] < 60 ? -6 : 16)}" font-size="13" font-weight="700" text-anchor="middle">${t}</text>`;
  s += lab(A, L[0]) + lab(B, L[1]) + lab(Cc, L[2]);
  return svg(240, 160, s, 'aria-label="triangle"');
}

/* ---------- solids ---------- */
const SECTIONS_X = [
  ['cube', 'parallel to a face', 'square'], ['cube', 'through four vertices along a diagonal of two opposite faces', 'rectangle'], ['cube', 'that cuts off one corner', 'triangle'], ['cube', 'through the midpoints of six edges', 'hexagon'],
  ['cylinder', 'parallel to its bases', 'circle'], ['cylinder', 'perpendicular to its bases through the axis', 'rectangle'], ['cylinder', 'at a slant through the curved side only', 'ellipse'],
  ['cone', 'parallel to its base', 'circle'], ['cone', 'perpendicular to its base through the vertex', 'triangle'], ['cone', 'at a slant that does not reach the base', 'ellipse'],
  ['sphere', 'in any direction', 'circle'], ['square pyramid', 'parallel to its base', 'square'], ['square pyramid', 'perpendicular to its base through the vertex', 'triangle'], ['square pyramid', 'perpendicular to the base, not through the vertex', 'trapezoid'],
  ['rectangular prism', 'parallel to a face', 'rectangle'], ['triangular prism', 'parallel to its triangular bases', 'triangle'], ['triangular prism', 'perpendicular to its triangular bases', 'rectangle']
];
const REVOLVE = [
  ['a rectangle about one of its sides', 'cylinder'], ['a right triangle about one of its legs', 'cone'], ['a semicircle about its diameter', 'sphere'], ['a circle about a line outside it in the same plane', 'torus (doughnut)'],
  ['a right trapezoid about the side perpendicular to its bases', 'frustum (cone with its top cut off)'], ['a rectangle about a parallel line a short distance away from it', 'cylinder with a hole (a pipe)'], ['an isosceles triangle about its line of symmetry', 'cone'], ['a right triangle about its hypotenuse', 'two cones joined at their bases']
];
const REV_ALL = ['cylinder', 'cone', 'sphere', 'torus (doughnut)', 'frustum (cone with its top cut off)', 'cylinder with a hole (a pipe)', 'two cones joined at their bases', 'square pyramid'];
const POLY_NAMES = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };

/* ---------- angle naming picture ---------- */
function anglePic(L, a1, a2) {
  const vx = 120, vy = 90, R_ = 85, p = a => [vx + R_ * Math.cos(deg(a)), vy - R_ * Math.sin(deg(a))];
  const P1 = p(a1), P2 = p(a2), lab = (q, t, dy = 0) => `<text x="${q[0]}" y="${q[1] + dy}" font-size="14" font-weight="700" text-anchor="middle">${t}</text>`;
  return svg(250, 130, `<line x1="${vx}" y1="${vy}" x2="${P1[0]}" y2="${P1[1]}" stroke="${C.ink}" stroke-width="3"/><line x1="${vx}" y1="${vy}" x2="${P2[0]}" y2="${P2[1]}" stroke="${C.ink}" stroke-width="3"/>${[P1, P2, [vx, vy]].map(q => `<circle cx="${q[0]}" cy="${q[1]}" r="4" fill="${C.primary}"/>`).join('')}${lab(P1, L[0], -8)}${lab(P2, L[2], -8)}${lab([vx, vy], L[1], 20)}`, 'aria-label="angle"');
}

/* ---------- regular polygons ---------- */
const symInfo = () => pick([
  ['equilateral triangle', 3, 3], ['square', 4, 4], ['regular pentagon', 5, 5], ['regular hexagon', 6, 6], ['regular octagon', 8, 8], ['regular decagon', 10, 10], ['regular dodecagon', 12, 12], ['regular nonagon', 9, 9],
  ['rectangle (not a square)', 2, 2], ['rhombus (not a square)', 2, 2], ['parallelogram (not a rectangle or rhombus)', 2, 0], ['isosceles trapezoid', 1, 1]
]);

export const VARIETY2_RULES = [
  /* ===== Grade 6–7 ===== */
  R(/^Name angles$/, () => () => {
    const L = letters(3), a1 = ri(5, 50), a2 = a1 + ri(40, 140), pic = anglePic(L, a1, a2), ans = pick([`∠${L[0]}${L[1]}${L[2]}`, `∠${L[2]}${L[1]}${L[0]}`]);
    return mc(`${pic}Which is a correct name for this angle?`, ans, [`∠${L[1]}${L[0]}${L[2]}`, `∠${L[0]}${L[2]}${L[1]}`, `∠${L[1]}${L[2]}${L[0]}`], `The vertex (${L[1]}) must be the middle letter: ${b(ans)}.`, 4);
  }),
  R(/^Identify polyhedra$/, () => () => {
    const n = ri(3, 10), kind = pick(['prism', 'pyramid']), base = POLY_NAMES[n] === 'quadrilateral' ? (Math.random() < 0.5 ? 'rectangular' : 'square') : { 3: 'triangular', 5: 'pentagonal', 6: 'hexagonal', 7: 'heptagonal', 8: 'octagonal', 9: 'nonagonal', 10: 'decagonal' }[n];
    const F = kind === 'prism' ? n + 2 : n + 1, E = kind === 'prism' ? 3 * n : 2 * n, V = kind === 'prism' ? 2 * n : n + 1, name = `${base} ${kind}`;
    const q = ri(0, 3);
    if (q === 0) { const nonP = pick(['cylinder', 'cone', 'sphere']); const isPoly = Math.random() < 0.6; return yesNo(`Is a ${b(isPoly ? name : nonP)} a polyhedron?`, isPoly, isPoly ? 'All of its faces are flat polygons.' : 'It has a curved surface, so it is not a polyhedron.', ['Yes', 'No']); }
    if (q === 1) return num(`How many ${b('faces')} does a ${b(name)} have?`, F, `A ${kind} with a ${n}-sided base has ${kind === 'prism' ? `2 bases + ${n} rectangles` : `1 base + ${n} triangles`} = ${b(F)} faces.`);
    if (q === 2) return num(`How many ${b('edges')} does a ${b(name)} have?`, E, `${kind === 'prism' ? `${n} on each base + ${n} joining them` : `${n} around the base + ${n} to the apex`} = ${b(E)} edges.`);
    return mc(`A polyhedron has ${b(F)} faces, ${b(E)} edges and ${b(V)} vertices. Which polyhedron is it?`, name, uniq([`${base} ${kind === 'prism' ? 'pyramid' : 'prism'}`, ...sample(['triangular prism', 'square pyramid', 'hexagonal prism', 'pentagonal pyramid', 'octagonal prism', 'triangular pyramid', 'heptagonal pyramid'], 4)]).filter(x => x !== name), `Check: ${F} − ${E} + ${V} = 2 (Euler), and the counts match a ${b(name)}.`, 4);
  }),
  R(/^Construct (?:the midpoint or perpendicular bisector of a segment|an angle bisector|a congruent angle|a perpendicular line|parallel lines|an equilateral triangle or regular hexagon)$/, (mt, ctx) => () => {
    const t = ctx.title, [P, Q, M] = letters(3);
    if (/midpoint/.test(t)) {
      if (Math.random() < 0.5) { const L = ri(5, 30) * 2; return num(`You construct the perpendicular bisector of segment ${P}${Q}, which is ${b(L + ' cm')} long. It crosses ${P}${Q} at ${M}. How long is ${P}${M}? (cm)`, L / 2, `The perpendicular bisector passes through the midpoint, so ${P}${M} = ${L} ÷ 2 = ${b(L / 2)} cm.`); }
      return mc(`To construct the perpendicular bisector of ${P}${Q}, you draw arcs from ${P} and ${Q} that cross above and below the segment. What must be true about the compass opening?`, `It is the same for both arcs and more than half of ${P}${Q}`, [`It is less than half of ${P}${Q}`, 'It changes for each arc', `It equals exactly ${P}${Q} ÷ 4`], 'Equal arcs longer than half the segment cross in two points on the bisector.', 4);
    }
    if (/angle bisector/.test(t)) { const a = ri(20, 170); if (Math.random() < 0.6) return num(`You bisect ∠${P}${M}${Q}, which measures ${b(a + '°')}. What is the measure of each new angle? (degrees)`, a / 2, `An angle bisector splits the angle into two equal parts: ${a} ÷ 2 = ${b(fmt(a / 2))}°.`); return mc(`After drawing an arc from vertex ${M} that crosses both sides of the angle, what is the next step in bisecting ∠${P}${M}${Q}?`, 'From each crossing point, draw equal arcs that meet inside the angle', ['Measure the angle with a protractor', 'Draw a circle centred at the midpoint', 'Extend one side past the vertex'], 'The point where the equal arcs meet is on the bisector.', 4); }
    if (/congruent angle/.test(t)) { const a = ri(15, 165); return num(`Using only a compass and straightedge, you copy ∠${P}${M}${Q} = ${b(a + '°')} to make ∠${letters(3).join('')}. What is the measure of the copy? (degrees)`, a, `A copied angle is congruent: ${b(a)}°.`); }
    if (/perpendicular line/.test(t)) { const a = ri(0, 1); return a ? num(`You construct a line perpendicular to line ${P}${Q} through point ${M}. What angle does the new line make with ${P}${Q}? (degrees)`, 90, `Perpendicular lines meet at ${b('90°')}.`) : mc(`To construct a perpendicular through point ${M} on line ${P}${Q}, what do you do first?`, `Draw arcs from ${M} that cross the line at two points the same distance from ${M}`, [`Draw a circle through ${P} and ${Q}`, 'Measure 90° with a protractor', `Draw a line parallel to ${P}${Q}`], 'Then bisect the segment between those two points.', 4); }
    if (/parallel lines/.test(t)) { const a = ri(25, 155); return num(`To draw a line through ${M} parallel to ${P}${Q}, you copy the angle a transversal makes with ${P}${Q}. If that angle is ${b(a + '°')}, what angle do you construct at ${M}? (degrees)`, a, `Copying the corresponding angle (${a}°) makes the lines parallel.`); }
    const r = ri(2, 12), hex = Math.random() < 0.5;
    return hex ? num(`You construct a regular hexagon inside a circle of radius ${b(r + ' cm')} by marking off the radius around the circle. What is the perimeter of the hexagon? (cm)`, 6 * r, `Each side equals the radius: 6 × ${r} = ${b(6 * r)} cm.`) : num(`You construct an equilateral triangle on a segment of length ${b(r + ' cm')} using the compass set to that length. What is its perimeter? (cm)`, 3 * r, `All three sides are ${r} cm: ${b(3 * r)} cm.`);
  }),

  /* ===== logic ===== */
  R(/^Identify hypotheses and conclusions$/, () => () => {
    const [sj, [p, np], [q]] = pick(CONDS), hyp = Math.random() < 0.5, H = `${sj} ${p}`, Cn = `${pron(sj)} ${q}`;
    return mc(`In the conditional "${ifThen(sj, p, q)}", what is the ${b(hyp ? 'hypothesis' : 'conclusion')}?`, hyp ? H : Cn, [hyp ? Cn : H, ifThen(sj, q, p), `${sj} ${np}`].filter(x => x !== (hyp ? H : Cn)), `The hypothesis follows "if" and the conclusion follows "then": ${b(hyp ? H : Cn)}.`, 4);
  }),
  R(/^Counterexamples$/, () => () => { const c = counterGen(); if (!c) return null; const [claim, ans, wrong, why] = c; return mc(`Which is a ${b('counterexample')} to this claim?<br>${claim}`, ans, wrong, why, 4); }),
  R(/^Conditionals$/, () => () => {
    const [sj, [p, np], [q, nq], tru] = pick(CONDS), form = pick(['converse', 'inverse', 'contrapositive', 'truth']);
    if (form === 'truth') return yesNo(`Is this conditional true?<br>${ifThen(sj, p, q)}`, tru, tru ? 'Whenever the hypothesis is true, the conclusion is true too.' : 'There is a counterexample, so it is false.', ['True', 'False']);
    const forms = { converse: ifThen(sj, q, p), inverse: ifThen(sj, np, nq), contrapositive: ifThen(sj, nq, np) }, ans = forms[form];
    return mc(`Statement: ${ifThen(sj, p, q)}<br>What is its ${b(form)}?`, ans, [...Object.values(forms), ifThen(sj, p, nq)].filter(x => x !== ans), `The ${form} ${form === 'converse' ? 'swaps the hypothesis and conclusion' : form === 'inverse' ? 'negates both parts' : 'swaps and negates both parts'}.`, 4);
  }),
  R(/^Negations$/, () => () => {
    const [sj, P, Q] = pick(CONDS), other = Math.random() < 0.5, [p, np] = other ? Q : P, [, onp] = other ? P : Q, st = sent(sj, p), ans = sent(sj, np);
    if (Math.random() < 0.3) { const ok = Math.random() < 0.5; return yesNo(`Statement: ${st}<br>Is "${ok ? ans : sent(sj, onp)}" its negation?`, ok, ok ? 'It states exactly the opposite.' : 'It is about a different property, so it is not the negation.', ['Yes', 'No']); }
    return mc(`What is the ${b('negation')} of this statement?<br>${st}`, ans, [st, `It is not true that ${sj} ${np}.`, sent(sj, onp)], `The negation states the opposite: ${b(ans)}`, 4);
  }),
  R(/^Biconditionals$/, () => () => {
    const [sj, [p], [q], tru, conv] = pick(CONDS), bic = `${cap(sj)} ${p} if and only if ${pron(sj)} ${q}.`;
    if (Math.random() < 0.5) return yesNo(`Is this biconditional true?<br>${bic}`, tru && conv, tru && conv ? 'The conditional and its converse are both true.' : `It is false because ${!tru ? 'the conditional' : 'the converse'} is false.`, ['True', 'False']);
    return mc(`Which biconditional combines "${ifThen(sj, p, q)}" and its converse?`, bic, [ifThen(sj, q, p), `${cap(sj)} ${p} or ${pron(sj)} ${q}.`, `${cap(sj)} ${p} if ${pron(sj)} ${q}.`], 'A biconditional joins a conditional and its converse with "if and only if".', 4);
  }),
  R(/^Estimate imperial measurements of length$/, () => () => {
    const [obj, ans, wrong] = pick([
      ['the length of a pencil', '7 inches', ['7 feet', '7 yards', '7 miles']], ['the height of a door', '7 feet', ['7 inches', '7 yards', '7 miles']], ['the length of a football field', '100 yards', ['100 inches', '100 feet', '100 miles']],
      ['the distance between two nearby towns', '12 miles', ['12 yards', '12 feet', '12 inches']], ['the width of a smartphone', '3 inches', ['3 feet', '3 yards', '3 miles']], ['the length of a car', '15 feet', ['15 inches', '15 yards', '15 miles']],
      ['the length of a paper clip', '1 inch', ['1 foot', '1 yard', '1 mile']], ['the height of a basketball hoop', '10 feet', ['10 inches', '10 yards', '10 miles']], ['the length of a marathon', '26 miles', ['26 yards', '26 feet', '26 inches']],
      ['the length of a swimming pool', '25 yards', ['25 inches', '25 miles', '250 yards']], ['the width of a classroom', '30 feet', ['30 inches', '30 miles', '3 feet']], ['the length of a shoe', '10 inches', ['10 feet', '10 yards', '1 inch']],
      ['the height of an adult', '6 feet', ['6 inches', '6 yards', '6 miles']], ['the length of a banana', '8 inches', ['8 feet', '8 yards', '8 miles']], ['the length of a long bridge', '2 miles', ['2 feet', '2 inches', '20 inches']]
    ]);
    return mc(`What is the best estimate for ${b(obj)}?`, ans, wrong, `${cap(obj)} is about ${b(ans)}.`, 4);
  }),

  /* ===== transformations ===== */
  R(/^Classify congruence transformations$|^Congruence transformations: mixed review$/, (mt, ctx) => () => {
    const h = nz(-6, 6), k = nz(-6, 6), kind = pick(['translation', 'reflection', 'reflection', 'rotation', 'rotation', 'dilation']);
    const rules = {
      translation: [`(x, y) → (x ${h > 0 ? '+' : MINUS} ${Math.abs(h)}, y ${k > 0 ? '+' : MINUS} ${Math.abs(k)})`, (x, y) => [x + h, y + k]],
      reflection: pick([['(x, y) → (−x, y)', (x, y) => [-x, y]], ['(x, y) → (x, −y)', (x, y) => [x, -y]], ['(x, y) → (y, x)', (x, y) => [y, x]], ['(x, y) → (−y, −x)', (x, y) => [-y, -x]]]),
      rotation: pick([['(x, y) → (−y, x)', (x, y) => [-y, x]], ['(x, y) → (−x, −y)', (x, y) => [-x, -y]], ['(x, y) → (y, −x)', (x, y) => [y, -x]]]),
      dilation: [`(x, y) → (${pick([2, 3])}x, ${'·'}y)`.replace('·', ''), null]
    };
    if (kind === 'dilation') { const f = pick([2, 3, 4]); rules.dilation = [`(x, y) → (${f}x, ${f}y)`, (x, y) => [f * x, f * y]]; }
    const [rule, fn] = rules[kind];
    if (/mixed/.test(ctx.title) && kind !== 'dilation' && Math.random() < 0.5) { const x = nz(-8, 8), y = nz(-8, 8), [X, Y] = fn(x, y); return mc(`The rule ${m(rule)} is applied to the point ${pt(x, y)}. What is the image?`, pt(X, Y), uniq([pt(-X, Y), pt(X, -Y), pt(Y, X), pt(x, y), pt(-Y, -X)]).filter(v => v !== pt(X, Y)), `Substitute x = ${S(x)}, y = ${S(y)}: ${b(pt(X, Y))}.`, 4); }
    const ans = kind === 'dilation' ? 'not a congruence transformation' : kind;
    return mc(`Which kind of transformation is ${m(rule)}?`, ans, ['translation', 'reflection', 'rotation', 'not a congruence transformation'].filter(x => x !== ans), kind === 'dilation' ? 'It changes the size (a dilation), so it is not a congruence transformation.' : `${cap(kind)}.`, 4);
  }),
  R(/^Transformations that carry a polygon onto itself$/, () => () => {
    const [name, rotOrder, lines] = symInfo(), q = ri(0, 2);
    if (q === 0) return num(`What is the smallest positive rotation (in degrees) about its centre that carries a ${b(name)} onto itself?`, 360 / rotOrder, `It matches itself ${rotOrder} times in a full turn: 360 ÷ ${rotOrder} = ${b(360 / rotOrder)}°.`);
    if (q === 1) return num(`How many lines of reflection carry a ${b(name)} onto itself?`, lines, `A ${name} has ${b(lines)} line${lines === 1 ? '' : 's'} of symmetry.`);
    const a = pick(range(1, 12).map(i => i * 30).concat([45, 72, 36, 40, 135])), ok = (a % (360 / rotOrder)) === 0;
    return yesNo(`Does a rotation of ${b(a + '°')} about its centre carry a ${b(name)} onto itself?`, ok, ok ? `${a} is a multiple of ${360 / rotOrder}°.` : `${a} is not a multiple of ${360 / rotOrder}°.`, ['Yes', 'No']);
  }),
  R(/^Dilations and parallel lines$/, () => () => {
    const x1 = ri(-6, 6), y1 = ri(-6, 6), x2 = x1 + nz(-5, 5), y2 = y1 + ri(-6, 6), k = pick([2, 3, 0.5, 4]);
    if (k === 0.5 && (x1 % 2 || y1 % 2 || x2 % 2 || y2 % 2)) return null;
    const sl = (y2 - y1) / (x2 - x1), q = ri(0, 1);
    if (q === 0) return num(`Line ℓ passes through ${pt(x1, y1)} and ${pt(x2, y2)}. It is dilated by a scale factor of ${b(k)} centred at the origin. What is the slope of the image line? (round to 2 decimals)`, r2(sl), `A dilation maps a line to a parallel line, so the slope stays ${b(r2(sl))}.`);
    return mc(`The point ${pt(x1, y1)} is dilated by a factor of ${b(k)} centred at the origin. What is its image?`, pt(k * x1, k * y1), [pt(x1 + k, y1 + k), pt(k * x1, y1), pt(x1 / k, y1 / k)].filter(v => v !== pt(k * x1, k * y1)), `Multiply both coordinates by ${k}: ${b(pt(k * x1, k * y1))}.`, 4);
  }),

  /* ===== triangles ===== */
  R(/^Identify medians, altitudes, angle bisectors and perpendicular bisectors$|^Triangles and bisectors$/, (mt, ctx) => () => {
    if (/Triangles and bisectors/.test(ctx.title) && Math.random() < 0.6) {
      const { x0, a, c, d, e, val } = linEq(); const [P, A, B] = letters(3);
      return pick([
        num(`Point ${P} lies on the perpendicular bisector of ${A}${B}. ${P}${A} = ${m(lin(a, c))} and ${P}${B} = ${m(lin(d, e))}. What is x?`, x0, `A point on the perpendicular bisector is equidistant from ${A} and ${B}: ${lin(a, c)} = ${lin(d, e)} gives x = ${b(x0)}.`),
        num(`Point ${P} lies on the bisector of ∠${A}${letters(1)[0]}${B}. Its distances to the two sides are ${m(lin(a, c))} and ${m(lin(d, e))}. What is x?`, x0, `A point on an angle bisector is equidistant from the sides: x = ${b(x0)}.`)
      ]);
    }
    const kind = pick(['median', 'altitude', 'angle bisector', 'perpendicular bisector']);
    return mc(`${specialSegment(kind)}What is the red segment or line?`, kind, ['median', 'altitude', 'angle bisector', 'perpendicular bisector'].filter(x => x !== kind), { median: 'It joins a vertex to the midpoint of the opposite side (tick marks).', altitude: 'It goes from a vertex and meets the opposite side at a right angle.', 'angle bisector': 'It splits the angle at the vertex into two equal angles.', 'perpendicular bisector': 'It passes through the midpoint of a side at a right angle.' }[kind], 4);
  }),
  R(/^Angles in inscribed right triangles$/, () => () => {
    const [A, B, Cc] = letters(3);
    if (Math.random() < 0.5) { const a = ri(15, 75); return num(`△${A}${B}${Cc} is inscribed in a circle and ${A}${B} is a diameter. If ∠${A} = ${b(a + '°')}, what is ∠${B}? (degrees)`, 90 - a, `∠${Cc} = 90° (inscribed in a semicircle), so ∠${B} = 180 − 90 − ${a} = ${b(90 - a)}°.`); }
    const [p, q, r] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]]), k = ri(1, 3);
    return num(`△${A}${B}${Cc} is inscribed in a circle with diameter ${A}${B} = ${b(r * k)}. If ${A}${Cc} = ${b(p * k)}, what is ${B}${Cc}?`, q * k, `∠${Cc} = 90°, so ${B}${Cc} = √(${r * k}² − ${p * k}²) = ${b(q * k)}.`);
  }),
  R(/^SSS and SAS Theorems$|^ASA and AAS Theorems$|^SSS, SAS, ASA and AAS Theorems$|^Hypotenuse-Leg Theorem$/, (mt, ctx) => () => {
    const t = ctx.title, [A, B, Cc, D, E, F] = letters(6), s = (p, q) => p + q, ang = p => `∠${p}`;
    const make = {
      SSS: () => [`${s(A, B)} ≅ ${s(D, E)}, ${s(B, Cc)} ≅ ${s(E, F)} and ${s(A, Cc)} ≅ ${s(D, F)}`],
      SAS: () => pick([[`${s(A, B)} ≅ ${s(D, E)}, ${ang(B)} ≅ ${ang(E)} and ${s(B, Cc)} ≅ ${s(E, F)}`], [`${s(A, Cc)} ≅ ${s(D, F)}, ${ang(A)} ≅ ${ang(D)} and ${s(A, B)} ≅ ${s(D, E)}`]]),
      ASA: () => pick([[`${ang(A)} ≅ ${ang(D)}, ${s(A, B)} ≅ ${s(D, E)} and ${ang(B)} ≅ ${ang(E)}`], [`${ang(B)} ≅ ${ang(E)}, ${s(B, Cc)} ≅ ${s(E, F)} and ${ang(Cc)} ≅ ${ang(F)}`]]),
      AAS: () => pick([[`${ang(A)} ≅ ${ang(D)}, ${ang(B)} ≅ ${ang(E)} and ${s(B, Cc)} ≅ ${s(E, F)}`], [`${ang(B)} ≅ ${ang(E)}, ${ang(Cc)} ≅ ${ang(F)} and ${s(A, B)} ≅ ${s(D, E)}`]]),
      HL: () => [`${ang(Cc)} and ${ang(F)} are right angles, hypotenuse ${s(A, B)} ≅ ${s(D, E)} and leg ${s(B, Cc)} ≅ ${s(E, F)}`],
      'not enough information': () => pick([[`${ang(A)} ≅ ${ang(D)}, ${ang(B)} ≅ ${ang(E)} and ${ang(Cc)} ≅ ${ang(F)}`], [`${s(A, B)} ≅ ${s(D, E)}, ${s(B, Cc)} ≅ ${s(E, F)} and ${ang(A)} ≅ ${ang(D)}`]])
    };
    const pool = /^SSS and SAS/.test(t) ? ['SSS', 'SAS', 'not enough information'] : /^ASA and AAS/.test(t) ? ['ASA', 'AAS', 'not enough information'] : /Hypotenuse/.test(t) ? ['HL', 'SAS', 'not enough information'] : ['SSS', 'SAS', 'ASA', 'AAS', 'not enough information'];
    const ans = pick(pool), [given] = make[ans]();
    return mc(`In △${A}${B}${Cc} and △${D}${E}${F}: ${given}.<br>Which theorem proves △${A}${B}${Cc} ≅ △${D}${E}${F}?`, ans, uniq([...pool, 'SSS', 'SAS', 'ASA', 'AAS', 'HL', 'not enough information']).filter(x => x !== ans).slice(0, 3), ans === 'not enough information' ? 'AAA and SSA do not prove congruence.' : `The given parts match the ${b(ans)} pattern.`, 4);
  }),
  R(/^SSS Theorem in the coordinate plane$/, () => () => {
    const P = [[0, 0], [ri(2, 6), 0], [ri(0, 5), ri(2, 6)]].map(([x, y]) => [x + ri(-6, 0), y + ri(-6, 0)]);
    const congruent = Math.random() < 0.6, dx = ri(-3, 8), dy = ri(-3, 8), flip = Math.random() < 0.5;
    let Q = P.map(([x, y]) => (flip ? [-x + dx, y + dy] : [x + dx, y + dy]));
    if (!congruent) { const i = ri(0, 2); Q = Q.map((p, j) => (j === i ? [p[0] + pick([-1, 1]), p[1]] : p)); }
    const d2 = (p, q) => (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2, sides = T => [d2(T[0], T[1]), d2(T[1], T[2]), d2(T[0], T[2])].sort((x, y) => x - y);
    const same = sides(P).every((v, i) => v === sides(Q)[i]);
    const [A, B, Cc, D, E, F] = letters(6), fmtSide = v => (Number.isInteger(Math.sqrt(v)) ? Math.sqrt(v) : `√${v}`);
    return yesNo(`△${A}${B}${Cc} has vertices ${P.map(p => pt(...p)).join(', ')}. △${D}${E}${F} has vertices ${Q.map(p => pt(...p)).join(', ')}. Are the triangles congruent by SSS?`, same, `Side lengths: ${sides(P).map(fmtSide).join(', ')} and ${sides(Q).map(fmtSide).join(', ')}. ${same ? 'They match, so the triangles are congruent.' : 'They do not all match.'}`, ['Yes', 'No']);
  }),
  R(/^Similarity statements$|^Similarity rules for triangles$|^Similar triangles and similarity transformations$/, (mt, ctx) => () => {
    const t = ctx.title, [A, B, Cc, D, E, F] = letters(6);
    if (/statements/.test(t)) {
      const what = pick(['angle', 'side']), map = { [A]: D, [B]: E, [Cc]: F };
      if (what === 'angle') { const v = pick([A, B, Cc]); return mc(`△${A}${B}${Cc} ∼ △${D}${E}${F}. Which angle corresponds to ∠${v}?`, `∠${map[v]}`, [D, E, F].filter(x => x !== map[v]).map(x => `∠${x}`).concat([`∠${v}`]), `Corresponding letters are in the same position: ${v} ↔ ${b(map[v])}.`, 4); }
      const [p, q] = sample([A, B, Cc], 2); return mc(`△${A}${B}${Cc} ∼ △${D}${E}${F}. Which side corresponds to ${p}${q}?`, `${map[p]}${map[q]}`, uniq([`${map[q]}${map[[A, B, Cc].find(x => x !== p && x !== q)]}`, `${map[p]}${map[[A, B, Cc].find(x => x !== p && x !== q)]}`, `${p}${map[q]}`]).filter(x => x !== `${map[p]}${map[q]}`), `${p} ↔ ${map[p]} and ${q} ↔ ${map[q]}, so ${p}${q} ↔ ${b(map[p] + map[q])}.`, 4);
    }
    if (/rules/.test(t)) {
      const kind = pick(['AA', 'SSS', 'SAS', 'not similar']), k = pick([1.5, 2, 2.5, 3, 0.5]), x = ri(3, 9), y = ri(3, 9), z = ri(Math.abs(x - y) + 1, x + y - 1);
      let txt;
      if (kind === 'AA') { const a1 = ri(30, 80), a2 = ri(30, 180 - a1 - 20); txt = `∠${A} = ${a1}°, ∠${B} = ${a2}°, ∠${D} = ${a1}° and ∠${E} = ${a2}°`; }
      else if (kind === 'SSS') txt = `${A}${B} = ${x}, ${B}${Cc} = ${y}, ${A}${Cc} = ${z}; ${D}${E} = ${fix(x * k)}, ${E}${F} = ${fix(y * k)}, ${D}${F} = ${fix(z * k)}`;
      else if (kind === 'SAS') { const a1 = ri(30, 120); txt = `${A}${B} = ${x}, ${A}${Cc} = ${y}, ∠${A} = ${a1}°; ${D}${E} = ${fix(x * k)}, ${D}${F} = ${fix(y * k)}, ∠${D} = ${a1}°`; }
      else txt = `${A}${B} = ${x}, ${B}${Cc} = ${y}, ${A}${Cc} = ${z}; ${D}${E} = ${fix(x * k)}, ${E}${F} = ${fix(y * k + 1)}, ${D}${F} = ${fix(z * k)}`;
      return mc(`${txt}.<br>Which rule shows that △${A}${B}${Cc} ∼ △${D}${E}${F}?`, kind === 'not similar' ? 'They are not necessarily similar' : `${kind} similarity`, ['AA similarity', 'SSS similarity', 'SAS similarity', 'They are not necessarily similar'].filter(v => v !== (kind === 'not similar' ? 'They are not necessarily similar' : `${kind} similarity`)), kind === 'not similar' ? 'The side ratios are not all equal.' : kind === 'AA' ? 'Two pairs of equal angles.' : `Ratios are all ${k}${kind === 'SAS' ? ' with the included angles equal' : ''}.`, 4);
    }
    const k = pick([2, 3, 0.5, 1.5, 4]), s1 = ri(2, 10) * 2;
    return num(`△${A}${B}${Cc} is dilated by a scale factor of ${b(k)} and then reflected to give △${D}${E}${F}. If ${A}${B} = ${b(s1)}, what is ${D}${E}?`, s1 * k, `The dilation multiplies lengths by ${k}; the reflection keeps lengths: ${b(fmt(s1 * k))}.`);
  }),
  R(/^Similarity of circles$/, () => () => {
    const r1_ = ri(2, 12), r2_ = ri(2, 15); if (r1_ === r2_) return null;
    const q = ri(0, 2), g = gcd(r1_, r2_), ratio = `${r1_ / g}:${r2_ / g}`;
    if (q === 0) return num(`Circle A has radius ${b(r1_)} and circle B has radius ${b(r2_)}. What scale factor dilates circle A onto circle B? (round to 2 decimals)`, r2(r2_ / r1_), `Scale factor = ${r2_} ÷ ${r1_} = ${b(r2(r2_ / r1_))}.`);
    if (q === 1) return mc(`Circle A has radius ${b(r1_)} and circle B has radius ${b(r2_)}. What is the ratio of their ${b('circumferences')} (A:B)?`, ratio, uniq([`${(r1_ / g) ** 2}:${(r2_ / g) ** 2}`, `${r2_ / g}:${r1_ / g}`, `${2 * r1_ / g}:${r2_ / g}`]).filter(x => x !== ratio), `Circumference is proportional to the radius: ${b(ratio)}.`, 4);
    const ar = `${(r1_ / g) ** 2}:${(r2_ / g) ** 2}`;
    return mc(`Circle A has radius ${b(r1_)} and circle B has radius ${b(r2_)}. What is the ratio of their ${b('areas')} (A:B)?`, ar, uniq([ratio, `${(r2_ / g) ** 2}:${(r1_ / g) ** 2}`, `${2 * r1_ / g}:${2 * r2_ / g}`]).filter(x => x !== ar), `Area ratio = (radius ratio)²: ${b(ar)}.`, 4);
  }),
  R(/^Properties of parallelograms$|^Properties of rhombuses$/, (mt, ctx) => () => {
    const rh = /rhomb/.test(ctx.title), [A, B, Cc, D] = letters(4), q = ri(0, 2);
    if (rh && q === 0) { const p = ri(3, 12), r = ri(3, 12); return num(`The diagonals of rhombus ${A}${B}${Cc}${D} are ${b(2 * p)} and ${b(2 * r)}. What is the side length? (round to 1 decimal)`, r1(Math.hypot(p, r)), `The diagonals are perpendicular bisectors, forming right triangles with legs ${p} and ${r}: √(${p}² + ${r}²) ≈ ${b(r1(Math.hypot(p, r)))}.`); }
    if (rh && q === 1) { const a = ri(20, 70); return num(`In rhombus ${A}${B}${Cc}${D}, ∠${A}${B}${D} = ${b(a + '°')}. What is the measure of the angle where the diagonals cross? (degrees)`, 90, `The diagonals of a rhombus are perpendicular: ${b('90°')}.`); }
    if (q === 2) { const a = ri(40, 140); return num(`In ${rh ? 'rhombus' : 'parallelogram'} ${A}${B}${Cc}${D}, ∠${A} = ${b(a + '°')}. What is ∠${B}? (degrees)`, 180 - a, `Consecutive angles are supplementary: 180 − ${a} = ${b(180 - a)}°.`); }
    const { x0, a, c, d, e } = linEq();
    return pick([
      num(`In parallelogram ${A}${B}${Cc}${D}, ${A}${B} = ${m(lin(a, c))} and ${Cc}${D} = ${m(lin(d, e))}. What is x?`, x0, `Opposite sides are congruent: x = ${b(x0)}.`),
      num(`The diagonals of parallelogram ${A}${B}${Cc}${D} meet at E. ${A}E = ${m(lin(a, c))} and E${Cc} = ${m(lin(d, e))}. What is x?`, x0, `The diagonals bisect each other: x = ${b(x0)}.`),
      num(`In ${rh ? 'rhombus' : 'parallelogram'} ${A}${B}${Cc}${D}, ∠${A} = ${m(lin(a, c) + '°')} and ∠${Cc} = ${m(lin(d, e) + '°')}. What is x?`, x0, `Opposite angles are congruent: x = ${b(x0)}.`)
    ]);
  }),

  /* ===== proofs (reason + algebra) ===== */
  R(/^Proofs involving angles$|^Proofs involving parallel lines I{1,2}$|^Proofs involving triangles I{1,2}$/, (mt, ctx) => () => {
    const t = ctx.title, [P, Q, Rr] = letters(3);
    const algebra = (rel, sumTo, reason) => {
      for (let i = 0; i < 50; i++) { const x0 = ri(4, 20), a = ri(2, 7), c = ri(-10, 20), d = ri(2, 7), A1 = a * x0 + c; if (A1 <= 0 || A1 >= 180) continue; const B1 = sumTo ? sumTo - A1 : A1; if (B1 <= 0) continue; const e = B1 - d * x0; return num(`${rel(lin(a, c), lin(d, e))} What is x?`, x0, `${reason}: ${sumTo ? `(${lin(a, c)}) + (${lin(d, e)}) = ${sumTo}` : `${lin(a, c)} = ${lin(d, e)}`}, so x = ${b(x0)}.`); }
      return null;
    };
    if (/angles/.test(t)) {
      const k = pick(['vertical', 'linear', 'complementary', 'reason']);
      if (k === 'vertical') return algebra((p, q) => `∠1 and ∠2 are vertical angles with m∠1 = (${p})° and m∠2 = (${q})°.`, 0, 'Vertical Angles Theorem');
      if (k === 'linear') return algebra((p, q) => `∠1 and ∠2 form a linear pair with m∠1 = (${p})° and m∠2 = (${q})°.`, 180, 'Linear Pair Postulate (supplementary)');
      if (k === 'complementary') return algebra((p, q) => `∠${P} and ∠${Q} are complementary with m∠${P} = (${p})° and m∠${Q} = (${q})°.`, 90, 'Definition of complementary angles');
      const [st, ans, w] = pick([['∠1 and ∠2 are a linear pair, so m∠1 + m∠2 = 180°.', 'Linear Pair Postulate', ['Vertical Angles Theorem', 'Definition of bisector', 'Triangle Sum Theorem']], ['∠1 and ∠3 are vertical angles, so ∠1 ≅ ∠3.', 'Vertical Angles Theorem', ['Linear Pair Postulate', 'Corresponding Angles Postulate', 'Reflexive Property']], ['Ray BD bisects ∠ABC, so ∠ABD ≅ ∠DBC.', 'Definition of angle bisector', ['Definition of midpoint', 'Vertical Angles Theorem', 'Angle Addition Postulate']], ['m∠ABD + m∠DBC = m∠ABC.', 'Angle Addition Postulate', ['Segment Addition Postulate', 'Linear Pair Postulate', 'Transitive Property']], ['∠1 ≅ ∠2 and ∠2 ≅ ∠3, so ∠1 ≅ ∠3.', 'Transitive Property of Congruence', ['Reflexive Property', 'Symmetric Property', 'Vertical Angles Theorem']], ['∠A ≅ ∠A.', 'Reflexive Property of Congruence', ['Symmetric Property', 'Transitive Property', 'Definition of congruence']]]);
      return mc(`Which reason justifies this step?<br>${st}`, ans, w, `${b(ans)}.`, 4);
    }
    if (/parallel lines/.test(t)) {
      const k = pick(['corr', 'alt', 'same', 'reason']);
      if (k === 'corr') return algebra((p, q) => `Lines ℓ ∥ m are cut by a transversal. Corresponding angles measure (${p})° and (${q})°.`, 0, 'Corresponding Angles Postulate');
      if (k === 'alt') return algebra((p, q) => `Lines ℓ ∥ m are cut by a transversal. Alternate interior angles measure (${p})° and (${q})°.`, 0, 'Alternate Interior Angles Theorem');
      if (k === 'same') return algebra((p, q) => `Lines ℓ ∥ m are cut by a transversal. Same-side interior angles measure (${p})° and (${q})°.`, 180, 'Same-Side Interior Angles Theorem');
      const [st, ans, w] = pick([['ℓ ∥ m, so corresponding angles ∠1 ≅ ∠5.', 'Corresponding Angles Postulate', ['Alternate Exterior Angles Theorem', 'Vertical Angles Theorem', 'Linear Pair Postulate']], ['∠3 ≅ ∠6 (alternate interior), so ℓ ∥ m.', 'Converse of the Alternate Interior Angles Theorem', ['Alternate Interior Angles Theorem', 'Corresponding Angles Postulate', 'Transitive Property']], ['ℓ ∥ m, so m∠4 + m∠5 = 180° (same-side interior).', 'Same-Side Interior Angles Theorem', ['Linear Pair Postulate', 'Vertical Angles Theorem', 'Corresponding Angles Postulate']], ['ℓ ∥ m, so alternate exterior angles ∠1 ≅ ∠8.', 'Alternate Exterior Angles Theorem', ['Alternate Interior Angles Theorem', 'Vertical Angles Theorem', 'Reflexive Property']], ['ℓ ⟂ t and m ⟂ t, so ℓ ∥ m.', 'Two lines perpendicular to the same line are parallel', ['Corresponding Angles Postulate', 'Linear Pair Postulate', 'Vertical Angles Theorem']]]);
      return mc(`Which reason justifies this step?<br>${st}`, ans, w, `${b(ans)}.`, 4);
    }
    const k = pick(['sum', 'ext', 'iso', 'reason']);
    if (k === 'sum') { const a = ri(25, 90), bb = ri(20, 150 - a); return num(`In △${P}${Q}${Rr}, m∠${P} = ${a}° and m∠${Q} = ${bb}°. By the Triangle Sum Theorem, what is m∠${Rr}? (degrees)`, 180 - a - bb, `180 − ${a} − ${bb} = ${b(180 - a - bb)}°.`); }
    if (k === 'ext') { const a = ri(25, 80), bb = ri(25, 80); return num(`An exterior angle at ${Rr} of △${P}${Q}${Rr} is formed. The two remote interior angles measure ${a}° and ${bb}°. What is the exterior angle? (degrees)`, a + bb, `Exterior Angle Theorem: ${a} + ${bb} = ${b(a + bb)}°.`); }
    if (k === 'iso') { const v = ri(20, 140); return num(`△${P}${Q}${Rr} is isosceles with ${P}${Q} ≅ ${P}${Rr} and vertex angle ∠${P} = ${v}°. What is m∠${Q}? (degrees)`, fix((180 - v) / 2, 1), `Base angles are congruent: (180 − ${v}) ÷ 2 = ${b(fix((180 - v) / 2, 1))}°.`); }
    const [st, ans, w] = pick([['AB ≅ AC, so ∠B ≅ ∠C.', 'Isosceles Triangle Theorem', ['Converse of the Isosceles Triangle Theorem', 'Triangle Sum Theorem', 'SAS']], ['△ABC ≅ △DEF, so AB ≅ DE.', 'CPCTC', ['SSS', 'Reflexive Property', 'Definition of midpoint']], ['M is the midpoint of AB, so AM ≅ MB.', 'Definition of midpoint', ['Definition of bisector', 'Segment Addition Postulate', 'CPCTC']], ['m∠A + m∠B + m∠C = 180°.', 'Triangle Sum Theorem', ['Exterior Angle Theorem', 'Linear Pair Postulate', 'Isosceles Triangle Theorem']], ['∠B ≅ ∠C, so AB ≅ AC.', 'Converse of the Isosceles Triangle Theorem', ['Isosceles Triangle Theorem', 'CPCTC', 'ASA']]]);
    return mc(`Which reason justifies this step?<br>${st}`, ans, w, `${b(ans)}.`, 4);
  }),

  /* ===== polygons & solids ===== */
  R(/^Polygon vocabulary$/, () => () => {
    const q = ri(0, 2), n = pick([3, 4, 5, 6, 7, 8, 9, 10, 12]);
    if (q === 0) return mc(`What is a polygon with ${b(n)} sides called?`, POLY_NAMES[n], sample(Object.values(POLY_NAMES).filter(x => x !== POLY_NAMES[n]), 3), `A ${n}-sided polygon is a ${b(POLY_NAMES[n])}.`, 4);
    if (q === 1) return num(`How many ${b('diagonals')} does a ${b(POLY_NAMES[n])} have?`, (n * (n - 3)) / 2, `n(n − 3) ÷ 2 = ${n} × ${n - 3} ÷ 2 = ${b((n * (n - 3)) / 2)}.`);
    const [d, a] = pick([['a polygon with all sides and all angles equal', 'regular'], ['a segment joining two non-adjacent vertices', 'diagonal'], ['a polygon with every interior angle less than 180°', 'convex'], ['a polygon with at least one interior angle greater than 180°', 'concave'], ['a point where two sides meet', 'vertex'], ['a polygon whose sides are not all equal', 'irregular'], ['the angle formed by one side and the extension of the next side', 'exterior angle'], ['two sides that share a vertex', 'consecutive (adjacent) sides']]);
    return mc(`Which term matches ${b(d)}?`, a, sample(['regular', 'diagonal', 'convex', 'concave', 'vertex', 'irregular', 'exterior angle', 'consecutive (adjacent) sides'].filter(x => x !== a), 3), `That is a ${b(a)}.`, 4);
  }),
  R(/^Nets and drawings of three-dimensional figures$|^Cross-sections of three-dimensional figures$|^Solids of revolution$/, (mt, ctx) => () => {
    const t = ctx.title;
    if (/Cross/.test(t)) { const [s, how, ans] = pick(SECTIONS_X); return mc(`A ${b(s)} is sliced by a plane ${b(how)}. What shape is the cross-section?`, ans, sample(['square', 'rectangle', 'triangle', 'circle', 'ellipse', 'hexagon', 'trapezoid'].filter(x => x !== ans), 3), `The cross-section is a ${b(ans)}.`, 4); }
    if (/revolution/.test(t)) {
      if (Math.random() < 0.5) { const [what, ans] = pick(REVOLVE); return mc(`Which solid is formed by rotating ${b(what)}?`, ans, sample(REV_ALL.filter(x => x !== ans), 3), `Rotating ${what} sweeps out a ${b(ans)}.`, 4); }
      const p = ri(2, 9), q = ri(2, 9), cone = Math.random() < 0.5;
      return cone ? num(`A right triangle with legs ${b(p)} and ${b(q)} is rotated about the leg of length ${b(p)}. What is the volume of the solid? (round to 1 decimal)`, r1((Math.PI * q * q * p) / 3), `It makes a cone with r = ${q} and h = ${p}: ⅓π(${q})²(${p}) ≈ ${b(r1((Math.PI * q * q * p) / 3))}.`) : num(`A ${p} by ${q} rectangle is rotated about its side of length ${b(q)}. What is the volume of the solid? (round to 1 decimal)`, r1(Math.PI * p * p * q), `It makes a cylinder with r = ${p} and h = ${q}: π(${p})²(${q}) ≈ ${b(r1(Math.PI * p * p * q))}.`);
    }
    const n = ri(3, 10), kind = pick(['prism', 'pyramid']), nm = POLY_NAMES[n] === 'quadrilateral' ? 'rectangular' : { 3: 'triangular', 5: 'pentagonal', 6: 'hexagonal', 7: 'heptagonal', 8: 'octagonal', 9: 'nonagonal', 10: 'decagonal', 12: 'dodecagonal' }[n];
    if (Math.random() < 0.3) { const [desc, ans] = pick([['two circles and a rectangle', 'cylinder'], ['a circle and a sector of a circle', 'cone'], ['six squares', 'cube'], ['one square and four triangles', 'square pyramid'], ['two triangles and three rectangles', 'triangular prism'], ['four triangles', 'triangular pyramid']]); return mc(`A net is made of ${b(desc)}. What solid does it fold into?`, ans, sample(['cylinder', 'cone', 'cube', 'square pyramid', 'triangular prism', 'triangular pyramid'].filter(x => x !== ans), 3), `${cap(desc)} fold into a ${b(ans)}.`, 4); }
    return kind === 'prism' ? num(`How many ${b('rectangles')} are in the net of a ${b(nm + ' prism')}?`, n, `One rectangle for each side of the ${n}-sided base: ${b(n)}.`) : num(`How many ${b('triangles')} are in the net of a ${b(nm + ' pyramid')}?`, n + (n === 3 ? 1 : 0), n === 3 ? `All 4 faces of a triangular pyramid are triangles: ${b(4)}.` : `One triangle for each side of the base: ${b(n)}.`);
  }),
  R(/^Introduction to similar solids$/, () => () => {
    const k = pick([1.5, 2, 2.5, 3, 4]), e = ri(2, 10) * 2, q = ri(0, 2), sol = pick(['cones', 'cylinders', 'rectangular prisms', 'square pyramids']);
    if (q === 0) return num(`Two similar ${sol} have corresponding heights ${b(e)} and ${b(fix(e * k))}. What is the scale factor from the smaller to the larger?`, k, `${fix(e * k)} ÷ ${e} = ${b(k)}.`);
    if (q === 1) { const w = ri(2, 9); return num(`Two similar ${sol} have scale factor ${b(k)}. The smaller one has a width of ${b(w)}. What is the corresponding width of the larger one?`, fix(w * k), `${w} × ${k} = ${b(fix(w * k))}.`); }
    const [a1, a2] = [ri(2, 6), ri(2, 6)]; const sim = Math.random() < 0.5, c2 = sim ? a2 * k : a2 * k + 1;
    return yesNo(`Cylinder A has radius ${a1} and height ${a2}. Cylinder B has radius ${fix(a1 * k)} and height ${fix(c2)}. Are the cylinders similar?`, sim, sim ? `Both dimensions are multiplied by ${k}.` : 'The ratios of the dimensions are not equal.', ['Yes', 'No']);
  }),
  R(/^Surface area and volume review$/, () => () => {
    const r = ri(2, 9), h = ri(2, 12), s = pick(['cylinder', 'cone', 'sphere', 'rectangular prism', 'square pyramid']), what = pick(['volume', 'surface area']);
    if (s === 'rectangular prism') { const l = ri(2, 12), w = ri(2, 10); return what === 'volume' ? num(`Find the volume of a rectangular prism ${l} × ${w} × ${h}.`, l * w * h, `V = lwh = ${b(l * w * h)}.`) : num(`Find the surface area of a rectangular prism ${l} × ${w} × ${h}.`, 2 * (l * w + l * h + w * h), `SA = 2(lw + lh + wh) = ${b(2 * (l * w + l * h + w * h))}.`); }
    if (s === 'square pyramid') { const a = ri(2, 12), sl = ri(a, 15); return what === 'volume' ? num(`Find the volume of a square pyramid with base edge ${a} and height ${h}. (round to 1 decimal)`, r1((a * a * h) / 3), `V = ⅓a²h ≈ ${b(r1((a * a * h) / 3))}.`) : num(`Find the surface area of a square pyramid with base edge ${a} and slant height ${sl}.`, a * a + 2 * a * sl, `SA = a² + 2a·l = ${b(a * a + 2 * a * sl)}.`); }
    const f = { cylinder: { volume: Math.PI * r * r * h, 'surface area': 2 * Math.PI * r * r + 2 * Math.PI * r * h, desc: `radius ${r} and height ${h}`, fV: 'πr²h', fS: '2πr² + 2πrh' }, cone: { volume: (Math.PI * r * r * h) / 3, 'surface area': Math.PI * r * r + Math.PI * r * Math.hypot(r, h), desc: `radius ${r} and height ${h}`, fV: '⅓πr²h', fS: 'πr² + πr·√(r² + h²)' }, sphere: { volume: (4 / 3) * Math.PI * r ** 3, 'surface area': 4 * Math.PI * r * r, desc: `radius ${r}`, fV: '⁴⁄₃πr³', fS: '4πr²' } }[s];
    return num(`Find the ${what} of a ${s} with ${f.desc}. (round to 1 decimal)`, r1(f[what]), `${what === 'volume' ? 'V = ' + f.fV : 'SA = ' + f.fS} ≈ ${b(r1(f[what]))}.`);
  })
];
