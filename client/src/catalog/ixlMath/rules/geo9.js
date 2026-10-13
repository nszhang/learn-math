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
    return num(`${circlePic({ central: [20, 20 + a] })}What is the measure of the central angle ∠AOB if it intercepts an arc of ${b(a + '°')}? (degrees)`, a, `The central angle equals its arc: ${b(a)}°.`);
  }),
  R(/^Tangent lines$/, () => () => {
    const r = ri(3, 12), d = ri(r + 2, r + 12), tan = Math.sqrt(d * d - r * r);
    return Math.random() < 0.5 ? mc(`${circlePic({ tangent: 40 })}A tangent line touches a circle at point T. What is the angle between the tangent and the radius OT?`, '90°', ['45°', '180°', '60°'], 'A tangent is perpendicular to the radius at the point of tangency.', 4) : num(`A point is ${b(d)} units from the centre of a circle with radius ${b(r)}. How long is the tangent segment from the point to the circle? (round to 2 decimals)`, fix(tan, 2), `√(${d}² − ${r}²) = ${b(fix(tan, 2))}.`);
  }),
  R(/^Inscribed angles$|^Angles in inscribed right triangles$|^Angles in inscribed quadrilaterals I{1,2}$/, (mt, ctx) => () => {
    const arc = ri(3, 17) * 10, t = ctx.title;
    if (/right triangles/.test(t)) return mc(`A triangle is inscribed in a circle with one side as a diameter. What is the measure of the angle opposite the diameter?`, '90°', ['45°', '180°', '60°'], 'An angle inscribed in a semicircle is a right angle.', 4);
    if (/quadrilaterals/.test(t)) { const A = ri(5, 15) * 10; return num(`A quadrilateral ABCD is inscribed in a circle and ∠A = ${b(A + '°')}. What is ∠C? (degrees)`, 180 - A, `Opposite angles of an inscribed quadrilateral are supplementary: 180 − ${A} = ${b(180 - A)}°.`); }
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
    const th = ri(3, 8) * 10; return num(`Two parallel lines are cut by a transversal. One angle measures ${b(th + '°')}. What is the measure of its same-side interior angle? (degrees)`, 180 - th, `Same-side interior angles are supplementary: ${b(180 - th)}°.`);
  }),

  /* ===== similarity ===== */
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
    const q = [['A flat surface of a solid', 'face'], ['A segment where two faces meet', 'edge'], ['A point where edges meet', 'vertex'], ['The perpendicular distance from the apex of a cone to its base', 'height'], ['The distance along the lateral surface of a cone from apex to base edge', 'slant height']];
    const [d, a] = pick(q); return mc(`What is ${b(d)} called?`, a, ['face', 'edge', 'vertex', 'height', 'slant height'].filter(v_ => v_ !== a).slice(0, 3), `${a[0].toUpperCase() + a.slice(1)}.`, 4);
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
    if (/spheres|Volume of spheres/.test(t)) { const vol = /Volume/.test(t) || (/and volume/.test(t) && Math.random() < 0.5); return vol ? num(`A sphere has radius ${b(r * 3)}. What is its volume? (Give the number in front of π.)`, fix((4 / 3) * (r * 3) ** 3, 2), `V = (4/3)πr³ = ${b(pi(fix((4 / 3) * (r * 3) ** 3, 2)))}.`) : num(`A sphere has radius ${b(r)}. What is its surface area? (Give the number in front of π.)`, 4 * r * r, `SA = 4πr² = ${b(pi(4 * r * r))}.`); }
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
    const p = Math.random() < 0.5, q = Math.random() < 0.5, op = pick(['and', 'or', 'implies']), res = op === 'and' ? p && q : op === 'or' ? p || q : !p || q;
    return yesNo(`Statement p is ${b(p ? 'true' : 'false')} and statement q is ${b(q ? 'true' : 'false')}. Is ${b(op === 'implies' ? 'p → q (if p then q)' : `p ${op} q`)} true?`, res, `Using the ${op === 'and' ? 'AND' : op === 'or' ? 'OR' : 'conditional'} truth table: ${res ? 'true' : 'false'}.`, ['True', 'False']);
  }),
  R(/^Conditionals$|^Negations$|^Converses, inverses and contrapositives$|^Biconditionals$/, (mt, ctx) => () => {
    const t = ctx.title, [p, q] = pick([['it rains', 'the grass is wet'], ['a shape is a square', 'it has four sides'], ['n is even', 'n is divisible by 2']]);
    if (/Negations/.test(t)) return mc(`What is the negation of "${p}"?`, `It is not true that ${p}`, [`${q}`, `If ${p}, then ${q}`, p], 'A negation reverses the truth value.', 4);
    if (/Biconditionals/.test(t)) return mc(`Which is the biconditional for "${p}" and "${q}"?`, `${p[0].toUpperCase() + p.slice(1)} if and only if ${q}`, [`If ${p}, then ${q}`, `If ${q}, then ${p}`, `${p[0].toUpperCase() + p.slice(1)} or ${q}`], '"If and only if" means both directions.', 4);
    if (/Converses/.test(t)) { const kind = pick(['converse', 'inverse', 'contrapositive']), ans = { converse: `If ${q}, then ${p}`, inverse: `If not (${p}), then not (${q})`, contrapositive: `If not (${q}), then not (${p})` }[kind]; return mc(`What is the ${b(kind)} of "If ${p}, then ${q}"?`, ans, ['converse', 'inverse', 'contrapositive'].filter(v_ => v_ !== kind).map(k => ({ converse: `If ${q}, then ${p}`, inverse: `If not (${p}), then not (${q})`, contrapositive: `If not (${q}), then not (${p})` }[k])).concat([`If ${p}, then ${q}`]), `The ${kind}: ${b(ans)}.`, 4); }
    return mc(`Which is a conditional statement?`, `If ${p}, then ${q}`, [`${p} and ${q}`, `${p} or ${q}`, `Not (${p})`], 'A conditional has the form "if p, then q".', 4);
  }),

  /* ===== imperial measurement ===== */
  R(/^Convert between metric and imperial units of length$|^Estimate imperial measurements of length$|^Mixed imperial units of length$|^Convert rates and measurements: imperial units of length$|^Unit prices with imperial length conversions$/, (mt, ctx) => () => {
    const t = ctx.title, [big_, small, f] = pick(IMPERIAL), n = ri(2, 9);
    if (/metric and imperial/.test(t)) { const inch = ri(2, 12), cm = fix(inch * 2.54, 1); return num(`Convert ${b(inch + ' inches')} to centimetres. (1 in = 2.54 cm)`, cm, `${inch} × 2.54 = ${b(cm)} cm.`); }
    if (/Estimate/.test(t)) return bank([['About how long is a pencil?', '7 inches', ['7 feet', '7 yards', '7 miles'], 'A pencil is about 7 inches.'], ['About how tall is a door?', '7 feet', ['7 inches', '7 miles', '70 feet'], 'A door is about 7 feet.'], ['About how far is a long walk to a nearby town?', '3 miles', ['3 inches', '3 feet', '30 yards'], 'Miles measure long distances.']])();
    if (/Mixed/.test(t)) { const w = ri(2, 6), r = ri(1, 11); return num(`${w} ft ${r} in = ___ in`, w * 12 + r, `${w} × 12 + ${r} = ${b(w * 12 + r)}.`); }
    if (/rates/.test(t)) { const v_ = ri(2, 9); return num(`A snail crawls ${b(v_ + ' feet')} per hour. How many inches per hour is that?`, v_ * 12, `${v_} × 12 = ${b(v_ * 12)}.`); }
    const price = ri(2, 9), ft = ri(2, 10); return num(`Ribbon costs $${price} per foot. How much does ${b(ft * 12 + ' inches')} cost? ($)`, price * ft, `${ft * 12} in = ${ft} ft; ${ft} × ${price} = ${b(price * ft)}.`);
  }),

  /* ===== misc ===== */
  R(/^Graph an absolute value function$/, () => () => {
    const h = nz(-4, 4), k = nz(-4, 4), a = pick([1, -1]); const f = `y = ${a < 0 ? MINUS : ''}|x ${h < 0 ? '+' : MINUS} ${Math.abs(h)}| ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`;
    return mc(`What is the vertex of ${m(f)}?`, pt(h, k), [pt(-h, k), pt(h, -k), pt(k, h)].filter(v_ => v_ !== pt(h, k)), `y = a|x − h| + k has vertex (h, k): ${b(pt(h, k))}.`, 4);
  }),
  R(/^Check whether two rational functions are inverses$/, () => () => {
    const a = ri(2, 5), yes = Math.random() < 0.5, c = yes ? a : a + 1;
    return yesNo(`Let ${m(`f(x) = ${stack(`${a}x + 1`, 'x')}`)} and ${m(`g(x) = ${stack(1, `x ${MINUS} ${c}`)}`)}. Are f and g inverses of each other?`, yes, yes ? 'Swapping x and y in f and solving gives g.' : 'Solving x = f(y) for y does not give g.', ['Yes', 'No']);
  }),
  R(/^Find terms of a sequence$/, () => () => {
    const a = nz(-3, 7), d = nz(2, 5), n = ri(5, 9); return num(`${m(`a<sub>n</sub> = ${a} + ${d}(n − 1)`)}. Find ${m(`a<sub>${n}</sub>`)}.`, a + d * (n - 1), `${a} + ${d}(${n - 1}) = ${b(S(a + d * (n - 1)))}.`);
  })
];
