/* High-school geometry (Grades 9–12): circle theorems, triangles & congruence, similarity, solids, transformations,
   coordinate geometry, logic, and measurement conversions. */
import { ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, dec, num, mc, yesNo, near, svg, C, NAMES, gcd, table, plane, MINUS } from '../h.js';
import { R } from '../engine.js';
import { S, P, nz } from './numsys.js';
import { stack, fs, simp } from './fractions.js';
import { angleSvg, solidSvg, geoSvg, poly } from './geometry.js';

const pt = (x, y) => `(${S(x)}, ${S(y)})`;
const pi = k => (k === 1 ? 'π' : `${fmt(fix(k, 3))}π`);
const MC = (prompt, ans, wrong, expl, n = 4) => mc(prompt, ans, wrong, expl, n);
const bank = (qs, n = 4) => () => { const [q, a, ws, e] = pick(qs); return mc(q, a, ws, e, n); };

/* circle picture: centre O with radius, optional labelled points on circle */
function circlePic({ chord, central, inscribed, tangent } = {}) {
  const cx = 90, cy = 85, r = 64, P_ = a => [cx + r * Math.cos((a * Math.PI) / 180), cy - r * Math.sin((a * Math.PI) / 180)];
  let inner = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#e0e7ff" stroke="${C.primary}" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="3.5" fill="${C.ink}"/><text x="${cx + 6}" y="${cy + 14}" font-size="12" fill="${C.ink}">O</text>`;
  const L = (p, q, col = C.ink, w = 2.5) => `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${col}" stroke-width="${w}"/>`, dot = (p, t, dx = 8, dy = -6) => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${C.red}"/><text x="${p[0] + dx}" y="${p[1] + dy}" font-size="13" font-weight="700" fill="${C.red}">${t}</text>`;
  if (central) { const A = P_(central[0]), B = P_(central[1]); inner += L([cx, cy], A) + L([cx, cy], B) + dot(A, 'A') + dot(B, 'B'); }
  if (chord) { const A = P_(chord[0]), B = P_(chord[1]); inner += L(A, B, C.accent, 3) + dot(A, 'A') + dot(B, 'B'); }
  if (inscribed) { const [a, c, d] = inscribed, A = P_(a), B = P_(c), D = P_(d); inner += L(D, A) + L(D, B) + dot(A, 'A') + dot(B, 'B') + dot(D, 'C'); }
  if (tangent) { const T = P_(tangent), tx = -Math.sin((tangent * Math.PI) / 180), ty = -Math.cos((tangent * Math.PI) / 180); inner += L([T[0] - tx * 50, T[1] - ty * 50], [T[0] + tx * 50, T[1] + ty * 50], C.accent, 3) + L([cx, cy], T) + dot(T, 'T'); }
  return svg(190, 170, inner, 'aria-label="circle"');
}

const SOLID_REAL = [['cone', 'a traffic cone'], ['sphere', 'a basketball'], ['cylinder', 'a can of soup'], ['square pyramid', 'a pyramid in Egypt']];
const unitName = { 'in': 'inches', ft: 'feet', yd: 'yards', mi: 'miles' };
const IMPERIAL = [['ft', 'in', 12], ['yd', 'ft', 3], ['mi', 'ft', 5280], ['yd', 'in', 36]];

export const GEO9_RULES = [
  /* ===== circles ===== */
  R(/^Central angles$|^Arc measure and arc length$|^Arcs and chords$/, (mt, ctx) => () => {
    const a = ri(2, 8) * 10, r = ri(2, 12), t = ctx.title;
    if (/Arcs and chords/.test(t)) { const d = ri(2, 6), rr = ri(d + 1, 12), half = Math.sqrt(rr * rr - d * d); return Math.random() < 0.5 ? mc(`A chord is ${b(d)} units from the centre of a circle of radius ${b(rr)}. Which is true about the chord and its perpendicular from the centre?`, 'The perpendicular from the centre bisects the chord', ['The perpendicular from the centre is longer than the radius', 'The chord is a diameter', 'The chord is tangent to the circle'], 'A radius perpendicular to a chord bisects it.', 4) : mc(`In a circle, two chords are equal in length. What do we know about their arcs?`, 'The arcs they cut off are equal', ['The arcs are different', 'The arcs add to 180°', 'The chords must be parallel'], 'Equal chords cut off equal arcs.', 4); }
    if (/Arc measure/.test(t)) return Math.random() < 0.5 ? num(`${circlePic({ central: [30, 30 + a] })}A central angle ∠AOB measures ${b(a + '°')}. What is the measure of arc AB? (degrees)`, a, `An arc has the same measure as its central angle: ${b(a)}°.`) : num(`A central angle of ${b(a + '°')} cuts an arc on a circle of radius ${b(r)}. What is the arc length? (Give the number in front of π; round to 2 decimals.)`, fix((a / 360) * 2 * r, 2), `(${a}/360) × 2π × ${r} = ${b(pi(fix((a / 360) * 2 * r, 2)))}.`);
    const A5 = ri(4, 34) * 5, form = pick(['cen', 'cen', 'arc', 'major', 'diam']);
    if (form === 'arc') return num(`${circlePic({ central: [20, 20 + A5] })}The central angle ∠AOB measures ${b(A5 + '°')}. What is the measure of the minor arc AB? (degrees)`, A5, `An arc has the same measure as its central angle: ${b(A5)}°.`);
    if (form === 'major') return num(`${circlePic({ central: [20, 20 + A5] })}The central angle ∠AOB measures ${b(A5 + '°')}. What is the measure of the major arc AB? (degrees)`, 360 - A5, `A full circle is 360°: 360 − ${A5} = ${b(360 - A5)}°.`);
    if (form === 'diam') return num(`AB is a diameter of a circle with centre O, and C is a point on the circle with ∠AOC = ${b(A5 + '°')}. What is the measure of ∠COB? (degrees)`, 180 - A5, `A diameter makes a straight angle of 180°: 180 − ${A5} = ${b(180 - A5)}°.`);
    return num(`${circlePic({ central: [20, 20 + A5] })}What is the measure of the central angle ∠AOB if it intercepts an arc of ${b(A5 + '°')}? (degrees)`, A5, `The central angle equals its arc: ${b(A5)}°.`);
  }),
  R(/^Tangent lines$/, () => () => {
    const r = ri(3, 12), d = ri(r + 2, r + 12), tan = Math.sqrt(d * d - r * r);
    return Math.random() < 0.5 ? mc(`${circlePic({ tangent: 40 })}A tangent line touches a circle at point T. What is the angle between the tangent and the radius OT?`, '90°', ['45°', '180°', '60°'], 'A tangent is perpendicular to the radius at the point of tangency.', 4) : num(`A point is ${b(d)} units from the centre of a circle with radius ${b(r)}. How long is the tangent segment from the point to the circle? (round to 2 decimals)`, fix(tan, 2), `√(${d}² − ${r}²) = ${b(fix(tan, 2))}.`);
  }),
  R(/^Inscribed angles$|^Angles in inscribed right triangles$|^Angles in inscribed quadrilaterals I{1,2}$/, (mt, ctx) => () => {
    const arc = ri(3, 17) * 10, t = ctx.title;
    if (/right triangles/.test(t)) return mc(`A triangle is inscribed in a circle with one side as a diameter. What is the measure of the angle opposite the diameter?`, '90°', ['45°', '180°', '60°'], 'An angle inscribed in a semicircle is a right angle.', 4);
    if (/quadrilaterals/.test(t)) {
      const A = ri(40, 140), form = pick(['opp', 'opp', 'opp2', 'arc', 'alg']);
      if (form === 'opp2') { const [X, Y] = pick([['B', 'D'], ['D', 'B']]); return num(`A quadrilateral ABCD is inscribed in a circle and ∠${X} = ${b(A + '°')}. What is ∠${Y}? (degrees)`, 180 - A, `Opposite angles of an inscribed quadrilateral are supplementary: 180 − ${A} = ${b(180 - A)}°.`); }
      if (form === 'arc') { const a2 = ri(40, 140) * 2; return num(`A quadrilateral ABCD is inscribed in a circle. Arc BCD measures ${b(a2 + '°')}. What is ∠A? (degrees)`, a2 / 2, `An inscribed angle is half its intercepted arc: ${a2} ÷ 2 = ${b(a2 / 2)}°.`); }
      if (form === 'alg') { const x = ri(8, 30), p = ri(1, 4), q = ri(1, 4), c1 = ri(0, 25), c2 = 180 - (p + q) * x - c1; const ex = (k, c) => `${k === 1 ? '' : k}x ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`; return num(`In an inscribed quadrilateral ABCD, ∠A = ${m(`(${ex(p, c1)})°`)} and ∠C = ${m(`(${ex(q, c2)})°`)}. Find x.`, x, `Opposite angles are supplementary: ${p}x + ${c1} + ${q}x ${c2 < 0 ? MINUS : '+'} ${Math.abs(c2)} = 180, so ${p + q}x = ${(p + q) * x} and x = ${b(x)}.`); }
      return num(`A quadrilateral ABCD is inscribed in a circle and ∠A = ${b(A + '°')}. What is ∠C? (degrees)`, 180 - A, `Opposite angles of an inscribed quadrilateral are supplementary: 180 − ${A} = ${b(180 - A)}°.`);
    }
    return num(`${circlePic({ inscribed: [60, 60 + arc > 330 ? 300 : 60 + arc, 250] })}An inscribed angle intercepts an arc of ${b(arc + '°')}. What is the measure of the inscribed angle? (degrees)`, arc / 2, `An inscribed angle is half its intercepted arc: ${b(arc / 2)}°.`);
  }),
  R(/^Perimeter of polygons with an inscribed circle$/, () => () => {
    const a = ri(2, 6), c = ri(2, 6), d = ri(2, 6); return num(`A circle is inscribed in a triangle. The tangent segments from the three vertices measure ${b(a)}, ${b(c)} and ${b(d)}. What is the perimeter of the triangle?`, 2 * (a + c + d), `Each tangent length appears twice: 2(${a} + ${c} + ${d}) = ${b(2 * (a + c + d))}.`);
  }),
  R(/^Circles: calculate area, circumference, radius and diameter$|^Area and circumference of circles$|^Circle measurements: mixed review$/, (mt, ctx) => () => {
    const r = ri(2, 15), kind = pick(['area', 'circ', 'rFromArea', 'dFromC']);
    if (kind === 'area') return num(`A circle has radius ${b(r)}. What is its area? (Give the number in front of π.)`, r * r, `A = πr² = ${b(pi(r * r))}.`);
    if (kind === 'circ') return num(`A circle has diameter ${b(2 * r)}. What is its circumference? (Give the number in front of π.)`, 2 * r, `C = πd = ${b(pi(2 * r))}.`);
    if (kind === 'rFromArea') return num(`A circle has area ${b(pi(r * r))}. What is its radius?`, r, `r² = ${r * r}, so r = ${b(r)}.`);
    return num(`A circle has circumference ${b(pi(2 * r))}. What is its diameter?`, 2 * r, `d = C ÷ π = ${b(2 * r)}.`);
  }),
  R(/^Similarity of circles$/, () => () => {
    return mc('Are any two circles similar?', 'Yes, all circles are similar', ['No, only circles with equal radii are similar', 'Only if they share a centre', 'Only if their diameters are equal'], 'A dilation maps any circle onto any other circle.', 4);
  }),

  /* ===== triangles, congruence, theorems ===== */
  R(/^Congruent line segments$/, () => () => {
    const a = ri(4, 12), x = ri(2, 6); return num(`Segment AB = ${b(`${a}`)} and segment CD = ${b(`${a - x} + x`)}. If AB ≅ CD, what is x?`, x, `${a} = ${a - x} + x, so x = ${b(x)}.`);
  }),
  R(/^Solve problems involving corresponding parts$/, () => () => {
    const a = ri(3, 12), x = ri(2, 8); return num(`△ABC ≅ △DEF. AB = ${b(a + x)} and DE = ${b(`${a} + x`)}. Find x.`, x, `Corresponding sides are equal: ${a + x} = ${a} + x, so x = ${b(x)}.`);
  }),
  R(/^SSS and SAS Theorems$|^ASA and AAS Theorems$|^SSS, SAS, ASA and AAS Theorems$|^Hypotenuse-Leg Theorem$/, (mt, ctx) => () => {
    const all = [['three pairs of equal sides', 'SSS'], ['two pairs of equal sides and the equal angles between them', 'SAS'], ['two pairs of equal angles and the equal side between them', 'ASA'], ['two pairs of equal angles and an equal side not between them', 'AAS'], ['equal hypotenuses and one pair of equal legs in right triangles', 'HL']];
    const pool = /SSS and SAS/.test(ctx.title) ? all.slice(0, 2) : /ASA and AAS/.test(ctx.title) ? all.slice(2, 4) : /Hypotenuse/.test(ctx.title) ? all.slice(4) : all.slice(0, 4), [d, ans] = pick(pool);
    return mc(`Two triangles have ${b(d)}. Which theorem proves they are congruent?`, ans, ['SSS', 'SAS', 'ASA', 'AAS', 'HL'].filter(v_ => v_ !== ans).slice(0, 3), `${d} is ${b(ans)}.`, 4);
  }),
  R(/^SSS Theorem in the coordinate plane$/, () => () => {
    const [a, c, h] = pick([[3, 4, 5], [6, 8, 10]]); return yesNo(`△ABC has side lengths ${a}, ${c} and ${h}; △DEF has side lengths ${h}, ${a} and ${c}. Are they congruent by SSS?`, true, 'The three side lengths match in pairs.', ['Yes', 'No']);
  }),
  R(/^Congruency in isosceles and equilateral triangles$/, () => () => {
    const a = ri(30, 80); return Math.random() < 0.5 ? num(`In isosceles △ABC, AB = AC and the vertex angle A = ${b(a + '°')}. What is each base angle? (degrees)`, (180 - a) / 2, `(180 − ${a}) ÷ 2 = ${b((180 - a) / 2)}°.`) : mc('Each angle of an equilateral triangle measures…', '60°', ['45°', '90°', '30°'], '180° ÷ 3 = 60°.', 4);
  }),
  R(/^Proofs involving angles$|^Proofs involving parallel lines I{1,2}$|^Proofs involving triangles I{1,2}$/, (mt, ctx) => () => {
    const t = ctx.title;
    if (/angles/.test(t)) return bank([[`Given that ∠1 and ∠2 are a linear pair, which reason justifies m∠1 + m∠2 = 180°?`, 'Linear Pair Postulate', ['Vertical Angles Theorem', 'Definition of a bisector', 'Triangle Sum Theorem'], 'A linear pair is supplementary.'], [`Lines cross, and ∠1 and ∠3 are opposite each other. Which reason shows ∠1 ≅ ∠3?`, 'Vertical Angles Theorem', ['Linear Pair Postulate', 'Alternate Interior Angles Theorem', 'SSS'], 'Opposite angles formed by intersecting lines are congruent.']])();
    if (/parallel lines/.test(t)) return bank([[`Parallel lines are cut by a transversal. Which reason shows the alternate interior angles are congruent?`, 'Alternate Interior Angles Theorem', ['Vertical Angles Theorem', 'Definition of a midpoint', 'SAS'], 'When lines are parallel, alternate interior angles are congruent.'], [`If corresponding angles are congruent, what can you conclude about the lines?`, 'The lines are parallel', ['The lines are perpendicular', 'The lines are skew', 'The lines intersect at 45°'], 'The converse of the Corresponding Angles Postulate.']])();
    return bank([[`To prove two triangles congruent, you show ∠A ≅ ∠D, AB ≅ DE and ∠B ≅ ∠E. Which reason completes the proof?`, 'ASA', ['SSS', 'SAS', 'HL'], 'Two angles and the included side.'], [`In △ABC, ∠A = 50° and ∠B = 60°. Which reason justifies ∠C = 70°?`, 'Triangle Angle-Sum Theorem', ['Exterior Angle Theorem', 'Vertical Angles Theorem', 'SSS'], 'The three angles sum to 180°.']])();
  }),
  R(/^Angle-side relationships in triangles$/, () => () => {
    const a = ri(30, 60), c = ri(61, 85), d = 180 - a - c; if (d <= 10 || d === a || d === c) return null;
    const big_ = Math.max(a, c, d), small = Math.min(a, c, d);
    return mc(`A triangle has angles ${b(a + '°')}, ${b(c + '°')} and ${b(d + '°')}. Which side is the longest?`, `The side opposite the ${big_}° angle`, [`The side opposite the ${small}° angle`, 'All sides are equal', 'The side between the two smallest angles'], 'The longest side is opposite the largest angle.', 4);
  }),
  R(/^Triangle Inequality Theorem$/, () => () => {
    const a = ri(3, 9), c = ri(3, 9), ok = Math.random() < 0.5, h = ok ? ri(Math.abs(a - c) + 1, a + c - 1) : a + c + ri(0, 3); if (h <= 0) return null;
    return yesNo(`Can a triangle have side lengths ${b(a)}, ${b(c)} and ${b(h)}?`, a + c > h && a + h > c && c + h > a, a + c > h ? 'The sum of any two sides exceeds the third.' : `${a} + ${c} is not greater than ${h}.`, ['Yes', 'No']);
  }),
  R(/^Identify medians, altitudes, angle bisectors and perpendicular bisectors$|^Triangles and bisectors$/, (mt, ctx) => () => {
    const q = [['a segment from a vertex to the midpoint of the opposite side', 'median'], ['a segment from a vertex perpendicular to the opposite side', 'altitude'], ['a segment from a vertex that splits the angle into two equal angles', 'angle bisector'], ['a line perpendicular to a side through its midpoint', 'perpendicular bisector']];
    const [d, a] = pick(q); return mc(`What is ${b(d)} called?`, a, ['median', 'altitude', 'angle bisector', 'perpendicular bisector'].filter(v_ => v_ !== a), `That is a ${b(a)}.`, 4);
  }),
  R(/^Midsegments of triangles$/, () => () => {
    const s = ri(3, 15) * 2; return num(`A midsegment of a triangle is parallel to the side of length ${b(s)}. How long is the midsegment?`, s / 2, `A midsegment is half the parallel side: ${b(s / 2)}.`);
  }),
  R(/^Triangle Proportionality Theorem$/, () => () => {
    const a = ri(2, 6), c = ri(2, 6), k = ri(2, 4); return num(`A line parallel to one side of a triangle splits the other two sides. One side is split into ${b(a)} and ${b(c)}. The other side's first piece is ${b(a * k)}. How long is the second piece?`, c * k, `${a}/${c} = ${a * k}/x, so x = ${b(c * k)}.`);
  }),
  R(/^Polygon vocabulary$/, () => () => {
    const q = [['A polygon with all sides and all angles equal', 'regular'], ['A segment joining two non-adjacent vertices', 'diagonal'], ['A polygon where no interior angle is greater than 180°', 'convex'], ['A point where two sides meet', 'vertex']];
    const [d, a] = pick(q); return mc(`Which term matches: ${b(d)}?`, a, ['regular', 'diagonal', 'convex', 'vertex'].filter(v_ => v_ !== a), `${a[0].toUpperCase() + a.slice(1)}.`, 4);
  }),
  R(/^Properties of parallelograms$|^Properties of rhombuses$/, (mt, ctx) => () => {
    const rh = /rhombuses/.test(ctx.title), q = rh ? [['The diagonals of a rhombus are…', 'perpendicular bisectors of each other', ['equal in length', 'parallel to each other', 'never intersecting']], ['All sides of a rhombus are…', 'equal in length', ['parallel to the diagonals', 'perpendicular to each other', 'different lengths']]] : [['Opposite sides of a parallelogram are…', 'parallel and congruent', ['perpendicular', 'always unequal', 'adjacent']], ['The diagonals of a parallelogram…', 'bisect each other', ['are always equal', 'are always perpendicular', 'never intersect']]];
    const [d, a, w] = pick(q); return mc(d, a, w, `${a[0].toUpperCase() + a.slice(1)}.`, 4);
  }),
  R(/^Graph quadrilaterals$|^Area and perimeter in the coordinate plane I{1,2}$|^Area of triangles and quadrilaterals$/, (mt, ctx) => () => {
    const w = ri(2, 7), h = ri(2, 6), x0 = ri(-4, 1), y0 = ri(-4, 1), pts = [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h]];
    const pic = plane({ min: -8, max: 8, points: pts.map((p, i) => ({ x: p[0], y: p[1], label: 'ABCD'[i], color: C.blue })), lines: pts.map((p, i) => [p[0], p[1], ...pts[(i + 1) % 4]]), labelEvery: 2, size: 280 });
    if (/Area of triangles/.test(ctx.title)) { const bs = ri(3, 12), hh = ri(2, 9); return num(`A triangle has base ${b(bs)} and height ${b(hh)}. What is its area?`, (bs * hh) / 2, `½ × ${bs} × ${hh} = ${b((bs * hh) / 2)}.`); }
    return /perimeter/.test(ctx.title) && /II/.test(ctx.title) ? num(`${pic}What is the perimeter of rectangle ABCD? (units)`, 2 * (w + h), `2(${w} + ${h}) = ${b(2 * (w + h))}.`) : num(`${pic}What is the area of rectangle ABCD? (square units)`, w * h, `${w} × ${h} = ${b(w * h)}.`);
  }),
  R(/^Midpoints$/, () => () => {
    const x1 = ri(-8, 8), y1 = ri(-8, 8), x2 = x1 + 2 * ri(-4, 4), y2 = y1 + 2 * ri(-4, 4); const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    return mc(`What is the midpoint of ${b(pt(x1, y1))} and ${b(pt(x2, y2))}?`, pt(mx, my), uniq([pt(x2 - x1, y2 - y1), pt(mx + 1, my), pt(my, mx), pt(x1 + x2, y1 + y2)]).filter(v_ => v_ !== pt(mx, my)), `Average the coordinates: ${b(pt(mx, my))}.`, 4);
  }),
  R(/^Transversal of parallel lines$/, () => () => {
    const th = pick([ri(20, 89), ri(91, 160)]), kind = pick(['sameSide', 'corr', 'altInt', 'altExt', 'vert', 'linear', 'alg1', 'alg2']);
    if (kind === 'corr') return num(`Two parallel lines are cut by a transversal. One angle measures ${b(th + '°')}. What is the measure of its corresponding angle? (degrees)`, th, `Corresponding angles are equal: ${b(th)}°.`);
    if (kind === 'altInt') return num(`Two parallel lines are cut by a transversal. One angle measures ${b(th + '°')}. What is the measure of its alternate interior angle? (degrees)`, th, `Alternate interior angles are equal: ${b(th)}°.`);
    if (kind === 'altExt') return num(`Two parallel lines are cut by a transversal. One angle measures ${b(th + '°')}. What is the measure of its alternate exterior angle? (degrees)`, th, `Alternate exterior angles are equal: ${b(th)}°.`);
    if (kind === 'vert') return num(`Two parallel lines are cut by a transversal. One angle measures ${b(th + '°')}. What is the measure of the angle vertically opposite it? (degrees)`, th, `Vertical angles are equal: ${b(th)}°.`);
    if (kind === 'linear') return num(`Two parallel lines are cut by a transversal. One angle measures ${b(th + '°')}. What is the measure of the angle that forms a linear pair with it? (degrees)`, 180 - th, `A linear pair adds to 180°: ${b(180 - th)}°.`);
    const ex = (k, c) => `${k === 1 ? '' : k}x ${c < 0 ? MINUS : '+'} ${Math.abs(c)}`;
    if (kind === 'alg1') { const x = ri(8, 30), p = ri(2, 5), q = ri(1, p - 1), c1 = ri(-15, 20), c2 = c1 + (p - q) * x; return num(`Two parallel lines are cut by a transversal. Corresponding angles measure ${m(`(${ex(p, c1)})°`)} and ${m(`(${ex(q, c2)})°`)}. Find x.`, x, `Corresponding angles are equal: ${p}x ${c1 < 0 ? MINUS : '+'} ${Math.abs(c1)} = ${q}x ${c2 < 0 ? MINUS : '+'} ${Math.abs(c2)}, so ${p - q}x = ${(p - q) * x} and x = ${b(x)}.`); }
    if (kind === 'alg2') { const x = ri(8, 25), p = ri(1, 4), q = ri(1, 4), c1 = ri(0, 25), c2 = 180 - (p + q) * x - c1; return num(`Two parallel lines are cut by a transversal. Same-side interior angles measure ${m(`(${ex(p, c1)})°`)} and ${m(`(${ex(q, c2)})°`)}. Find x.`, x, `Same-side interior angles add to 180°: ${p + q}x ${c1 + c2 < 0 ? MINUS : '+'} ${Math.abs(c1 + c2)} = 180, so x = ${b(x)}.`); }
    return num(`Two parallel lines are cut by a transversal. One angle measures ${b(th + '°')}. What is the measure of its same-side interior angle? (degrees)`, 180 - th, `Same-side interior angles are supplementary: ${b(180 - th)}°.`);
  }),
  R(/^Ratios in similar figures$|^Similarity statements$|^Side lengths and angle measures in similar figures$|^Similar figures: side lengths and angle measures$|^Similar triangles and indirect measurement$|^Similarity rules for triangles$|^Similar triangles and similarity transformations$/, (mt, ctx) => () => {
    const t = ctx.title, k = pick([2, 3, 1.5]), a = ri(2, 8) * 2, c = ri(2, 8) * 2;
    if (/rules/.test(t)) return mc('Two triangles have two pairs of congruent angles. Which rule shows they are similar?', 'AA similarity', ['SSS congruence', 'SAS congruence', 'HL'], 'Two pairs of equal angles prove similarity (AA).', 4);
    if (/statements/.test(t)) return mc('△ABC ∼ △DEF. Which angle corresponds to ∠B?', '∠E', ['∠D', '∠F', '∠A'], 'The order of the letters shows the correspondence: B ↔ E.', 4);
    if (/indirect/.test(t)) { const h = ri(4, 12), sh = ri(2, 6), big_ = sh * ri(2, 4); return num(`A ${b(h + ' m')} pole casts a ${b(sh + ' m')} shadow. At the same time a building casts a ${b(big_ + ' m')} shadow. How tall is the building? (m)`, (h * big_) / sh, `${h}/${sh} = x/${big_}, so x = ${b((h * big_) / sh)}.`); }
    if (/transformations/.test(t)) return mc('A dilation followed by a rigid motion maps △ABC to △DEF. What does this prove about the triangles?', 'They are similar', ['They are congruent', 'They are equilateral', 'They have equal areas'], 'Dilations preserve shape, not size: similar.', 4);
    if (/Ratios/.test(t)) return num(`Two similar figures have corresponding sides ${b(a)} and ${b(a * k)}. What is the ratio (larger to smaller)?`, k, `${a * k} ÷ ${a} = ${b(k)}.`);
    return num(`△ABC ∼ △DEF with scale factor ${b(k)} (from ABC to DEF). If AB = ${b(a)}, what is DE?`, a * k, `DE = ${a} × ${k} = ${b(a * k)}.`);
  }),
  R(/^Dilations and scale factors$|^Dilations and parallel lines$/, (mt, ctx) => () => {
    const k = pick([2, 3, 0.5, 4]), a = ri(2, 8) * (k === 0.5 ? 2 : 1);
    return /parallel/.test(ctx.title) ? mc('A dilation maps a line not through the centre to another line. How are the two lines related?', 'They are parallel', ['They are perpendicular', 'They are the same line', 'They intersect at the centre'], 'Dilations map lines to parallel lines.', 4) : num(`A segment of length ${b(a)} is dilated by a scale factor of ${b(k)}. What is the new length?`, a * k, `${a} × ${k} = ${b(a * k)}.`);
  }),
  R(/^Perimeters of similar figures$|^Areas of similar figures$|^Area and perimeter of similar figures$|^Perimeter, area and volume: changes in scale$/, (mt, ctx) => () => {
    const k = pick([2, 3, 4, 5]), p = ri(2, 9) * 3, A = ri(2, 9) * 4, t = ctx.title;
    if (/Perimeters/.test(t)) return num(`Two similar figures have a scale factor of ${b(k)}. The smaller has perimeter ${b(p)}. What is the larger's perimeter?`, p * k, `Perimeters scale by ${k}: ${b(p * k)}.`);
    if (/Areas/.test(t)) return num(`Two similar figures have a scale factor of ${b(k)}. The smaller has area ${b(A)}. What is the larger's area?`, A * k * k, `Areas scale by ${k}² = ${k * k}: ${b(A * k * k)}.`);
    const q = pick(['perimeter', 'area', 'volume']); return num(`All dimensions of a figure are multiplied by ${b(k)}. By what factor does its ${q} change?`, q === 'perimeter' ? k : q === 'area' ? k * k : k ** 3, `${q === 'perimeter' ? 'Length' : q === 'area' ? 'Area' : 'Volume'} scales by ${k}${q === 'area' ? '²' : q === 'volume' ? '³' : ''} = ${b(q === 'perimeter' ? k : q === 'area' ? k * k : k ** 3)}.`);
  }),
  R(/^Introduction to similar solids$|^Surface area and volume of similar solids$/, (mt, ctx) => () => {
    const k = pick([2, 3, 4]), V = ri(2, 9) * 8, which = pick(['volume', 'surface area']);
    return /Introduction/.test(ctx.title) ? num(`Two similar solids have corresponding edges 3 and ${k * 3}. What is the scale factor from the smaller to the larger?`, k, `${k * 3} ÷ 3 = ${b(k)}.`) : num(`Two similar solids have a scale factor of ${b(k)}. The smaller has ${which} ${b(V)}. What is the ${which} of the larger?`, V * k ** (which === 'volume' ? 3 : 2), `${which === 'volume' ? 'Volume' : 'Area'} scales by ${k}^${which === 'volume' ? 3 : 2}: ${b(V * k ** (which === 'volume' ? 3 : 2))}.`);
  }),

  /* ===== transformations ===== */
  R(/^Translations: write the rule$/, () => () => {
    const dx = nz(-5, 5), dy = nz(-5, 5), x = ri(-4, 4), y = ri(-4, 4); return mc(`A figure is translated so that ${b(pt(x, y))} maps to ${b(pt(x + dx, y + dy))}. Which rule describes the translation?`, `(x, y) → (x ${dx < 0 ? MINUS : '+'} ${Math.abs(dx)}, y ${dy < 0 ? MINUS : '+'} ${Math.abs(dy)})`, uniq([`(x, y) → (x ${dx < 0 ? '+' : MINUS} ${Math.abs(dx)}, y ${dy < 0 ? '+' : MINUS} ${Math.abs(dy)})`, `(x, y) → (x ${dy < 0 ? MINUS : '+'} ${Math.abs(dy)}, y ${dx < 0 ? MINUS : '+'} ${Math.abs(dx)})`, `(x, y) → (${S(dx)}x, ${S(dy)}y)`]), `Each coordinate changes by ${S(dx)} and ${S(dy)}.`, 4);
  }),
  R(/^Reflections, rotations and translations: find the coordinates$|^Reflections, rotations and translations: graph the image$|^Rotate polygons about a point$/, (mt, ctx) => () => {
    const x = nz(-6, 6), y = nz(-6, 6); if (Math.abs(x) === Math.abs(y)) return null; const kind = pick(['rx', 'ry', 'rot90', 'rot180', 'rot270', 'tr']);
    const dx = nz(-4, 4), dy = nz(-4, 4), res = { rx: [x, -y], ry: [-x, y], rot90: [-y, x], rot180: [-x, -y], rot270: [y, -x], tr: [x + dx, y + dy] }[kind];
    const desc = { rx: 'reflected across the x-axis', ry: 'reflected across the y-axis', rot90: 'rotated 90° counterclockwise about the origin', rot180: 'rotated 180° about the origin', rot270: 'rotated 270° counterclockwise about the origin', tr: `translated by ⟨${S(dx)}, ${S(dy)}⟩` }[kind];
    return mc(`The point ${b(pt(x, y))} is ${desc}. What are the coordinates of its image?`, pt(...res), (kind === 'tr' ? uniq([pt(x - dx, y - dy), pt(x + dx, y - dy), pt(x - dx, y + dy), pt(x + dy, y + dx)]) : uniq([pt(res[1], res[0]), pt(-res[0], res[1]), pt(res[0], -res[1]), pt(-res[0], -res[1])])).filter(v_ => v_ !== pt(...res)).slice(0, 3), `Apply the rule: ${b(pt(...res))}.`, 4);
  }),
  R(/^Classify congruence transformations$|^Congruence transformations: mixed review$/, () => () => {
    const q = [['A figure is moved without turning or flipping', 'translation'], ['A figure is flipped over a line', 'reflection'], ['A figure is turned about a point', 'rotation'], ['A figure is enlarged', 'none of these (a dilation is not a congruence transformation)']];
    const [d, a] = pick(q); return mc(`Which congruence transformation is this? ${b(d)}`, a, ['translation', 'reflection', 'rotation', 'none of these (a dilation is not a congruence transformation)'].filter(v_ => v_ !== a), `${a[0].toUpperCase() + a.slice(1)}.`, 4);
  }),
  R(/^Compositions of congruence transformations: graph the image$/, () => () => {
    const x = nz(-5, 5), y = nz(-5, 5), dx = nz(-4, 4), dy = nz(-4, 4); if (Math.abs(x) === Math.abs(y)) return null; const mid = [-x, y], end = [mid[0] + dx, mid[1] + dy];
    return mc(`The point ${b(pt(x, y))} is reflected across the y-axis, then translated by ${b(`⟨${S(dx)}, ${S(dy)}⟩`)}. Where does it end up?`, pt(...end), uniq([pt(x + dx, y + dy), pt(-x - dx, y + dy), pt(...[mid[0], mid[1] + dy])]).filter(v_ => v_ !== pt(...end)), `Reflect: ${pt(...mid)}; translate: ${b(pt(...end))}.`, 4);
  }),
  R(/^Transformations that carry a polygon onto itself$/, () => () => {
    const [n, name] = pick([[3, 'equilateral triangle'], [4, 'square'], [5, 'regular pentagon'], [6, 'regular hexagon']]); return mc(`What is the smallest positive rotation (about its centre) that carries a ${b(name)} onto itself?`, `${360 / n}°`, [`${180 / n}°`, `${360 / (n + 1)}°`, '180°'].filter(v_ => v_ !== `${360 / n}°`), `360° ÷ ${n} = ${b(360 / n + '°')}.`, 4);
  }),

  /* ===== 3-D figures ===== */
  R(/^Three-dimensional figure vocabulary$/, () => () => {
    const q = [['A flat surface of a solid', 'face'], ['A flat surface of a polyhedron, such as one side of a cube', 'face'], ['A segment where two faces meet', 'edge'], ['A line segment formed where two faces of a solid meet', 'edge'], ['A point where edges meet', 'vertex'], ['A corner of a solid, where three or more edges meet', 'vertex'],
      ['The perpendicular distance from the apex of a cone to its base', 'height'], ['The perpendicular distance between the two bases of a prism', 'height'], ['The distance along the lateral surface of a cone from apex to base edge', 'slant height'], ['The height of a triangular face of a regular pyramid, measured along the face', 'slant height'],
      ['The point at the top of a pyramid or cone where the faces meet', 'apex'], ['The vertex of a cone that is opposite its base', 'apex'], ['A face of a prism or pyramid that is not a base', 'lateral face'], ['The rectangular side faces of a prism', 'lateral face'], ['The face (or faces) a prism or pyramid sits on, used to name it', 'base'], ['The two parallel, congruent faces of a prism', 'base'],
      ['A flat pattern that folds up to make a solid', 'net'], ['A two-dimensional shape that can be folded to form a three-dimensional solid', 'net'], ['The shape you see when a plane slices through a solid', 'cross-section'], ['The two-dimensional face revealed when a solid is cut by a plane', 'cross-section'], ['A solid whose faces are all flat polygons', 'polyhedron'], ['A three-dimensional figure with two parallel, congruent bases joined by rectangles', 'prism'], ['A polyhedron with one polygon base and triangular faces meeting at an apex', 'pyramid']];
    const all = [...new Set(q.map(x => x[1]))], [d, a] = pick(q);
    return mc(`What is ${b(d)} called?`, a, sample(all, 3, [a]), `${a[0].toUpperCase() + a.slice(1)}.`, 4);
  }),
  R(/^Nets and drawings of three-dimensional figures$|^Cross-sections of three-dimensional figures$|^Solids of revolution$/, (mt, ctx) => () => {
    const t = ctx.title;
    if (/Cross-sections/.test(t)) return bank([['A horizontal slice through a cylinder gives what shape?', 'circle', ['rectangle', 'triangle', 'ellipse'], 'A cut parallel to the bases is a circle.'], ['A vertical slice through the axis of a cylinder gives what shape?', 'rectangle', ['circle', 'triangle', 'oval'], 'A vertical cut through the axis is a rectangle.'], ['A vertical slice through the apex of a cone gives what shape?', 'triangle', ['circle', 'rectangle', 'trapezoid'], 'It is a triangle.'], ['Any plane slice through the centre of a sphere gives what shape?', 'circle', ['ellipse', 'square', 'point'], 'It is a great circle.']])();
    if (/revolution/.test(t)) return bank([['Which solid is formed by rotating a right triangle about one of its legs?', 'cone', ['cylinder', 'sphere', 'pyramid'], 'A right triangle spun about a leg makes a cone.'], ['Which solid is formed by rotating a rectangle about one of its sides?', 'cylinder', ['cone', 'sphere', 'prism'], 'A rectangle spun about a side makes a cylinder.'], ['Which solid is formed by rotating a semicircle about its diameter?', 'sphere', ['cone', 'cylinder', 'torus'], 'A semicircle spun about its diameter makes a sphere.']])();
    return bank([['Which solid has a net made of a circle and a sector of a circle?', 'cone', ['cylinder', 'pyramid', 'prism'], 'A cone has one circular base and a curved face.'], ['A net with two circles and one rectangle folds into…', 'cylinder', ['cone', 'prism', 'sphere'], 'The rectangle wraps around the two circular bases.'], ['A net with a square and four triangles folds into…', 'square pyramid', ['cube', 'triangular prism', 'cone'], 'The triangles meet at the apex.']])();
  }),
  R(/^Introduction to surface area and volume$/, () => () => {
    const l = ri(2, 9), w = ri(2, 8), h = ri(2, 7), kind = pick(['sa', 'v']);
    return kind === 'v' ? num(`A box is ${l} by ${w} by ${h}. What is its volume?`, l * w * h, `${l} × ${w} × ${h} = ${b(l * w * h)}.`) : num(`A box is ${l} by ${w} by ${h}. What is its surface area?`, 2 * (l * w + l * h + w * h), `2(lw + lh + wh) = ${b(2 * (l * w + l * h + w * h))}.`);
  }),
  R(/^Surface area of prisms and pyramids$|^Surface area of pyramids and cones$|^Surface area of cones and cylinders$|^Surface area of spheres$|^Surface area and volume of spheres$|^Volume of spheres$/, (mt, ctx) => () => {
    const t = ctx.title, r = ri(2, 9);
    if (/spheres|Volume of spheres/.test(t)) {
      const vol = /Volume/.test(t) || (/and volume/.test(t) && Math.random() < 0.5), rv = 3 * ri(1, 10), rs = ri(1, 20), form = pick(['rad', 'rad', 'diam', 'rev']);
      if (vol) {
        const V = k_ => fix((4 / 3) * k_ ** 3, 2);
        if (form === 'diam') return num(`A sphere has diameter ${b(rv * 2)}. What is its volume? (Give the number in front of π.)`, V(rv), `r = ${rv}; V = (4/3)πr³ = ${b(pi(V(rv)))}.`);
        if (form === 'rev') return num(`A sphere has volume ${b(pi(V(rv)))}. What is its radius?`, rv, `(4/3)r³ = ${V(rv)}, so r³ = ${rv ** 3} and r = ${b(rv)}.`);
        return num(`A sphere has radius ${b(rv)}. What is its volume? (Give the number in front of π.)`, V(rv), `V = (4/3)πr³ = ${b(pi(V(rv)))}.`);
      }
      if (form === 'diam') return num(`A sphere has diameter ${b(rs * 2)}. What is its surface area? (Give the number in front of π.)`, 4 * rs * rs, `r = ${rs}; SA = 4πr² = ${b(pi(4 * rs * rs))}.`);
      if (form === 'rev') return num(`A sphere has surface area ${b(pi(4 * rs * rs))}. What is its radius?`, rs, `4r² = ${4 * rs * rs}, so r² = ${rs * rs} and r = ${b(rs)}.`);
      return num(`A sphere has radius ${b(rs)}. What is its surface area? (Give the number in front of π.)`, 4 * rs * rs, `SA = 4πr² = ${b(pi(4 * rs * rs))}.`);
    }
    if (/cones and cylinders/.test(t)) { const h = ri(2, 10), cyl = Math.random() < 0.5; return cyl ? num(`A cylinder has radius ${b(r)} and height ${b(h)}. What is its total surface area? (Give the number in front of π.)`, 2 * r * r + 2 * r * h, `2πr² + 2πrh = ${b(pi(2 * r * r + 2 * r * h))}.`) : (() => { const sl = ri(r + 1, r + 8); return num(`A cone has radius ${b(r)} and slant height ${b(sl)}. What is its total surface area? (Give the number in front of π.)`, r * r + r * sl, `πr² + πrl = ${b(pi(r * r + r * sl))}.`); })(); }
    if (/pyramids and cones/.test(t)) { const s = ri(3, 10), sl = ri(s, s + 8); return num(`A square pyramid has base side ${b(s)} and slant height ${b(sl)}. What is its total surface area?`, s * s + 2 * s * sl, `Base ${s * s} + 4 triangles (½ × ${s} × ${sl}) = ${b(s * s + 2 * s * sl)}.`); }
    const l = ri(2, 9), w = ri(2, 8), h = ri(2, 7); return num(`A rectangular prism is ${l} by ${w} by ${h}. What is its surface area?`, 2 * (l * w + l * h + w * h), `2(lw + lh + wh) = ${b(2 * (l * w + l * h + w * h))}.`);
  }),
  R(/^Volume of prisms and pyramids$|^Volume of cones and cylinders$|^Volume of pyramids and cones$/, (mt, ctx) => () => {
    const t = ctx.title, r = ri(2, 9), h = ri(3, 12) * 3, s = ri(3, 10);
    if (/cones and cylinders/.test(t)) return Math.random() < 0.5 ? num(`A cylinder has radius ${b(r)} and height ${b(h)}. What is its volume? (Give the number in front of π.)`, r * r * h, `V = πr²h = ${b(pi(r * r * h))}.`) : num(`A cone has radius ${b(r)} and height ${b(h)}. What is its volume? (Give the number in front of π.)`, (r * r * h) / 3, `V = ⅓πr²h = ${b(pi((r * r * h) / 3))}.`);
    if (/pyramids and cones/.test(t)) return num(`A square pyramid has base side ${b(s)} and height ${b(h)}. What is its volume?`, (s * s * h) / 3, `V = ⅓ × ${s}² × ${h} = ${b((s * s * h) / 3)}.`);
    return Math.random() < 0.5 ? num(`A triangular prism has a base area of ${b(s * 2)} and a height of ${b(h)}. What is its volume?`, s * 2 * h, `V = Bh = ${b(s * 2 * h)}.`) : num(`A pyramid has a base area of ${b(s * 3)} and a height of ${b(h)}. What is its volume?`, s * h, `V = ⅓Bh = ${b(s * h)}.`);
  }),
  R(/^Surface area and volume review$/, () => () => {
    const r = ri(2, 6), kind = pick(['cyl', 'sph']); return kind === 'cyl' ? mc(`Which formula gives the volume of a cylinder with radius r and height h?`, 'V = πr²h', ['V = 2πrh', 'V = ⅓πr²h', 'V = πr²'], 'Base area × height.', 4) : mc(`Which formula gives the surface area of a sphere with radius r?`, 'SA = 4πr²', ['SA = (4/3)πr³', 'SA = 2πr²', 'SA = πr²'], 'Four great circles.', 4);
  }),

  /* ===== logic ===== */
  R(/^Identify hypotheses and conclusions$/, () => () => {
    const q = [['If it rains, then the ground is wet.', 'It rains', 'The ground is wet'], ['If a number is even, then it is divisible by 2.', 'A number is even', 'It is divisible by 2'], ['If x > 5, then x > 3.', 'x > 5', 'x > 3']], [s, h, c] = pick(q);
    return mc(`In the statement "${s}", what is the ${b('hypothesis')}?`, h, [c, 'None of the above', s], 'The hypothesis follows "if".', 3);
  }),
  R(/^Counterexamples$/, () => () => {
    const q = [['All prime numbers are odd.', '2', ['3', '9', '15']], ['If x² = 9 then x = 3.', 'x = −3', ['x = 3', 'x = 9', 'x = 0']], ['All numbers divisible by 3 are odd.', '6', ['9', '15', '21']]], [s, a, w] = pick(q);
    return mc(`Which is a counterexample to the statement "${s}"?`, a, w, `${a} satisfies the hypothesis but not the conclusion.`, 4);
  }),
  R(/^Truth values$|^Truth tables$/, (mt, ctx) => () => {
    const a = ri(2, 30), c = ri(2, 30), PR = [11, 13, 17, 19, 23, 29, 31, 37], NP = [9, 15, 21, 25, 27, 33, 35, 39];
    const S_ = [[`${a} is even`, a % 2 === 0], [`${a} is odd`, a % 2 === 1], [`${a} is greater than ${c}`, a > c], [`${a} + ${c} = ${a + c + pick([0, 0, 1, -1])}`, null], [`${pick(PR)} is prime`, true], [`${pick(NP)} is prime`, false], [`${a} is a multiple of 5`, a % 5 === 0], [`a triangle has ${pick([3, 3, 4])} sides`, null], [`${a} is less than ${c}`, a < c], [`a square has ${pick([4, 4, 5])} sides`, null], [`2 + 2 = ${pick([4, 4, 5])}`, null], [`the number ${a} is divisible by 3`, a % 3 === 0]];
    const ev = s_ => { if (s_[1] !== null) return s_[1]; const t = s_[0], mm = t.match(/^(\d+) \+ (\d+) = (\d+)$/); if (mm) return +mm[1] + +mm[2] === +mm[3]; const mt2 = t.match(/^(?:a triangle has|a square has) (\d+) sides$/); if (mt2) return /triangle/.test(t) ? +mt2[1] === 3 : +mt2[1] === 4; const m2 = t.match(/^2 \+ 2 = (\d+)$/); return +m2[1] === 4; };
    const [sp, sq] = sample(S_, 2), p = ev(sp), q = ev(sq);
    if (Math.random() < 0.4) { const op = pick(['and', 'or', 'implies']), res = op === 'and' ? p && q : op === 'or' ? p || q : !p || q; return yesNo(`Statement p is ${b(p ? 'true' : 'false')} and statement q is ${b(q ? 'true' : 'false')}. Is ${b(op === 'implies' ? 'p → q (if p then q)' : `p ${op} q`)} true?`, res, `Using the ${op === 'and' ? 'AND' : op === 'or' ? 'OR' : 'conditional'} truth table: ${res ? 'true' : 'false'}.`, ['True', 'False']); }
    const F = [['p and q', p && q], ['p or q', p || q], ['if p, then q', !p || q], ['p if and only if q', p === q], ['not p', !p], ['not q', !q], ['p and not q', p && !q], ['not p or q', !p || q], ['not (p and q)', !(p && q)]], [name, res] = pick(F);
    return yesNo(`Let p be "${sp[0]}" and q be "${sq[0]}". Is the statement ${b(name)} true or false?`, res, `p is ${p ? 'true' : 'false'} and q is ${q ? 'true' : 'false'}, so "${name}" is ${res ? 'true' : 'false'}.`, ['True', 'False']);
  }),
  R(/^Conditionals$|^Negations$|^Converses, inverses and contrapositives$|^Biconditionals$/, (mt, ctx) => () => {
    const B = [['it rains', 'the grass is wet', 'it does not rain', 'the grass is not wet'], ['a shape is a square', 'it has four sides', 'a shape is not a square', 'it does not have four sides'], ['n is even', 'n is divisible by 2', 'n is not even', 'n is not divisible by 2'],
      ['a number ends in 0', 'it is divisible by 10', 'a number does not end in 0', 'it is not divisible by 10'], ['an animal is a dog', 'it is a mammal', 'an animal is not a dog', 'it is not a mammal'], ['a triangle is equilateral', 'it has three equal sides', 'a triangle is not equilateral', 'it does not have three equal sides'],
      ['a polygon is a hexagon', 'it has six sides', 'a polygon is not a hexagon', 'it does not have six sides'], ['a number is divisible by 6', 'it is divisible by 3', 'a number is not divisible by 6', 'it is not divisible by 3'], ['a figure is a rectangle', 'it has four right angles', 'a figure is not a rectangle', 'it does not have four right angles'],
      ['a student studies', 'the student passes the test', 'a student does not study', 'the student does not pass the test'], ['a number is prime', 'it has exactly two factors', 'a number is not prime', 'it does not have exactly two factors'], ['an angle is acute', 'it measures less than 90°', 'an angle is not acute', 'it does not measure less than 90°'],
      ['the temperature is below 0 °C', 'water freezes', 'the temperature is not below 0 °C', 'water does not freeze'], ['a figure is a circle', 'it has no vertices', 'a figure is not a circle', 'it has a vertex'], ['a number is a multiple of 8', 'it is a multiple of 4', 'a number is not a multiple of 8', 'it is not a multiple of 4'],
      ['a quadrilateral is a rhombus', 'it has four equal sides', 'a quadrilateral is not a rhombus', 'it does not have four equal sides'], ['two angles are vertical angles', 'they are congruent', 'two angles are not vertical angles', 'they are not congruent'], ['a ball is dropped', 'it falls', 'a ball is not dropped', 'it does not fall'], ['it is a Canadian province', 'it is part of Canada', 'it is not a Canadian province', 'it is not part of Canada']];
    const t = ctx.title, [p, q, np, nq] = pick(B), cp = x => x[0].toUpperCase() + x.slice(1);
    const cv = `If ${q}, then ${p}`, inv = `If ${np}, then ${nq}`, cn = `If ${nq}, then ${np}`, cd = `If ${p}, then ${q}`;
    if (/Negations/.test(t)) return mc(`What is the negation of "${p}"?`, cp(np), [cp(q), cd, cp(p)], 'A negation reverses the truth value.', 4);
    if (/Biconditionals/.test(t)) return mc(`Which is the biconditional for "${p}" and "${q}"?`, `${cp(p)} if and only if ${q}`, [cd, cv, `${cp(p)} or ${q}`], '"If and only if" means both directions.', 4);
    if (/Converses/.test(t)) { const kind = pick(['converse', 'inverse', 'contrapositive']), M = { converse: cv, inverse: inv, contrapositive: cn }, ans = M[kind]; return mc(`What is the ${b(kind)} of "${cd}"?`, ans, ['converse', 'inverse', 'contrapositive'].filter(v_ => v_ !== kind).map(k => M[k]).concat([cd]), `The ${kind}: ${b(ans)}.`, 4); }
    if (Math.random() < 0.5) return mc(`Which is a conditional statement?`, cd, [`${cp(p)} and ${q}`, `${cp(p)} or ${q}`, `Not (${p})`], 'A conditional has the form "if p, then q".', 4);
    return mc(`In the conditional "${cd}", which part is the ${b('hypothesis')}?`.replace('hypothesis', pick(['hypothesis', 'hypothesis'])), p, [q, np, nq], `The hypothesis follows "if": ${b(p)}.`, 4);
  }),

  /* ===== imperial measurement ===== */
  R(/^Convert between metric and imperial units of length$|^Estimate imperial measurements of length$|^Mixed imperial units of length$|^Convert rates and measurements: imperial units of length$|^Unit prices with imperial length conversions$/, (mt, ctx) => () => {
    const t = ctx.title, [big_, small, f] = pick(IMPERIAL), n = ri(2, 9);
    if (/metric and imperial/.test(t)) {
      const U = [['inches', 'centimetres', 2.54, 'in', 'cm'], ['feet', 'centimetres', 30.48, 'ft', 'cm'], ['yards', 'metres', 0.9144, 'yd', 'm'], ['miles', 'kilometres', 1.609, 'mi', 'km']], [iu, mu, k, ia, ma] = pick(U), n_ = iu === 'inches' ? ri(2, 60) : iu === 'miles' ? ri(2, 50) : ri(2, 30), form = pick(['toMetric', 'toMetric', 'toImp']);
      if (form === 'toImp') { const v_ = fix(n_ * k, 2); return num(`Convert ${b(`${fmt(v_)} ${mu}`)} to ${iu}. (1 ${ia} = ${k} ${ma})`, n_, `${fmt(v_)} ÷ ${k} = ${b(n_)} ${iu}.`); }
      const v_ = fix(n_ * k, 1); return num(`Convert ${b(`${n_} ${iu}`)} to ${mu}. (1 ${ia} = ${k} ${ma}; round to 1 decimal)`, v_, `${n_} × ${k} = ${fix(n_ * k, 3)} ≈ ${b(fmt(v_))} ${ma}.`);
    }
    if (/Estimate/.test(t)) return bank([['About how long is a pencil?', '7 inches', ['7 feet', '7 yards', '7 miles'], 'A pencil is about 7 inches.'], ['About how tall is a door?', '7 feet', ['7 inches', '7 miles', '70 feet'], 'A door is about 7 feet.'], ['About how far is a long walk to a nearby town?', '3 miles', ['3 inches', '3 feet', '30 yards'], 'Miles measure long distances.']])();
    if (/Mixed/.test(t)) { const w = ri(2, 6), r = ri(1, 11); return num(`${w} ft ${r} in = ___ in`, w * 12 + r, `${w} × 12 + ${r} = ${b(w * 12 + r)}.`); }
    if (/rates/.test(t)) {
      const v_ = ri(2, 9), who = pick(['A snail', 'A caterpillar', 'A garden worm', 'A toy car', 'A sloth']), form = pick(['fth', 'ydmin', 'mih', 'inmin']);
      if (form === 'ydmin') return num(`${pick(['A jogger', 'A cyclist', 'A skater'])} travels ${b(v_ * 10 + ' yards')} each minute. How many feet per minute is that?`, v_ * 30, `${v_ * 10} × 3 = ${b(v_ * 30)}.`);
      if (form === 'mih') return num(`A trail runner covers ${b(v_ + ' miles')} each hour. How many feet per hour is that?`, v_ * 5280, `${v_} × 5280 = ${b(v_ * 5280)}.`);
      if (form === 'inmin') return num(`${who} crawls ${b(v_ * 12 + ' inches')} each minute. How many feet per minute is that?`, v_, `${v_ * 12} ÷ 12 = ${b(v_)}.`);
      return num(`${who} moves ${b(v_ + ' feet')} per hour. How many inches per hour is that?`, v_ * 12, `${v_} × 12 = ${b(v_ * 12)}.`);
    }
    const price = ri(2, 9), ft = ri(2, 10); return num(`Ribbon costs $${price} per foot. How much does ${b(ft * 12 + ' inches')} cost? ($)`, price * ft, `${ft * 12} in = ${ft} ft; ${ft} × ${price} = ${b(price * ft)}.`);
  }),

  /* ===== misc ===== */
  R(/^Graph an absolute value function$/, () => () => {
    const h = nz(-4, 4), k = nz(-4, 4), a = pick([1, -1]); const f = `y = ${a < 0 ? MINUS : ''}|x ${h < 0 ? '+' : MINUS} ${Math.abs(h)}| ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`;
    return mc(`What is the vertex of ${m(f)}?`, pt(h, k), [pt(-h, k), pt(h, -k), pt(k, h)].filter(v_ => v_ !== pt(h, k)), `y = a|x − h| + k has vertex (h, k): ${b(pt(h, k))}.`, 4);
  }),
  R(/^Check whether two rational functions are inverses$/, () => () => {
    const a = ri(1, 9), c = ri(1, 9), yes = Math.random() < 0.5, fam = pick(['A', 'B']), bad = pick([1, 2, 3, 4]);
    if (fam === 'A') {
      const gd = yes ? `${stack(c, `x ${MINUS} ${a}`)}` : bad === 1 ? stack(c, `x + ${a}`) : bad === 2 ? stack(c, `x ${MINUS} ${a + 1}`) : bad === 3 ? stack(c + 1, `x ${MINUS} ${a}`) : stack(a, `x ${MINUS} ${c}`);
      if (!yes && bad === 4 && a === c) return null;
      return yesNo(`Let ${m(`f(x) = ${stack(`${a}x + ${c}`, 'x')}`)} and ${m(`g(x) = ${gd}`)}. Are f and g inverses of each other?`, yes, yes ? `Swapping x and y in f and solving gives g(x) = ${c}/(x ${MINUS} ${a}).` : `Solving x = f(y) for y gives ${c}/(x ${MINUS} ${a}), which is not g.`, ['Yes', 'No']);
    }
    const gd = yes ? stack(a, `x ${MINUS} ${c}`) : bad === 1 ? stack(a, `x + ${c}`) : bad === 2 ? `${stack(a, 'x')} ${MINUS} ${c}` : bad === 3 ? stack(c, `x ${MINUS} ${a}`) : stack(a + 1, `x ${MINUS} ${c}`);
    if (!yes && bad === 3 && a === c) return null;
    return yesNo(`Let ${m(`f(x) = ${stack(a, 'x')} + ${c}`)} and ${m(`g(x) = ${gd}`)}. Are f and g inverses of each other?`, yes, yes ? `Swap x and y: x = ${a}/y + ${c}, so y = ${a}/(x ${MINUS} ${c}) = g(x).` : `Solving x = f(y) for y gives ${a}/(x ${MINUS} ${c}), which is not g.`, ['Yes', 'No']);
  }),
  R(/^Find terms of a sequence$/, () => () => {
    const a = nz(-3, 7), d = nz(2, 5), n = ri(5, 9); return num(`${m(`a<sub>n</sub> = ${a} + ${d}(n − 1)`)}. Find ${m(`a<sub>${n}</sub>`)}.`, a + d * (n - 1), `${a} + ${d}(${n - 1}) = ${b(S(a + d * (n - 1)))}.`);
  })
];
