/* Geometry for Grades 6–12: angle relationships, polygons, circles, area, surface area & volume, transformations,
   similarity & congruence, Pythagorean theorem, constructions and the coordinate plane. */
import { ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, dec, num, mc, yesNo, near, svg, C, NAMES, gcd, table, plane, MINUS } from '../h.js';
import { R } from '../engine.js';
import { angleSvg, protractor, geoSvg, poly, triSvg, QUADS, quadSvg, solidSvg, DISPLAY_SOLIDS, ALL_QUAD_NAMES } from './geometry.js';
import { rectLabeled, isoBox, lShape, gridFigure, perimeterOfCells } from './geomeasure.js';
import { S, P, nz } from './numsys.js';
import { fs, simp } from './fractions.js';

const pi = k => (k === 1 ? 'π' : `${fmt(fix(k, 3))}π`);
const piAns = (k, unit = '') => `${pi(k)}${unit}`;
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
const triple = () => { const [a, c, d] = pick(TRIPLES), k = pick([1, 1, 2, 3]); return [a * k, c * k, d * k]; };
const pt = (x, y) => `(${S(x)}, ${S(y)})`;

/* right triangle picture with labelled sides (unknown shown as ?) */
function rightTri(a, c, h, hide) {
  const s = 120 / Math.max(a, c), W = a * s, H = c * s, ox = 30, oy = 20 + H;
  const inner = `<polygon points="${ox},${oy} ${ox + W},${oy} ${ox},${oy - H}" fill="#c7d2fe" stroke="${C.primary}" stroke-width="3"/><polyline points="${ox + 14},${oy} ${ox + 14},${oy - 14} ${ox},${oy - 14}" fill="none" stroke="${C.red}" stroke-width="2"/>` +
    `<text x="${ox + W / 2}" y="${oy + 16}" font-size="13" text-anchor="middle" font-weight="700" fill="${C.red}">${hide === 'a' ? '?' : a}</text><text x="${ox - 8}" y="${oy - H / 2}" font-size="13" text-anchor="end" font-weight="700" fill="${C.red}">${hide === 'c' ? '?' : c}</text><text x="${ox + W / 2 + 12}" y="${oy - H / 2 - 4}" font-size="13" font-weight="700" fill="${C.red}">${hide === 'h' ? '?' : h}</text>`;
  return svg(W + 90, H + 44, inner, 'aria-label="right triangle"');
}

/* transversal diagram: two parallel lines cut by a rising transversal; angles 1–8 labelled */
function transversalSvg() {
  const L = (x1, y1, x2, y2, col = C.ink, w = 3) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}"/>`;
  const ix1 = 120, iy1 = 40, ix2 = 80, iy2 = 100, lab = (x, y, t) => `<text x="${x}" y="${y}" font-size="13" text-anchor="middle" font-weight="700" fill="${C.red}">${t}</text>`;
  return svg(220, 140, L(10, iy1, 210, iy1) + L(10, iy2, 210, iy2) + L(60, 130, 140, 10, C.primary) + lab(ix1 - 16, iy1 - 8, 1) + lab(ix1 + 16, iy1 - 8, 2) + lab(ix1 - 16, iy1 + 18, 3) + lab(ix1 + 16, iy1 + 18, 4) + lab(ix2 - 16, iy2 - 8, 5) + lab(ix2 + 16, iy2 - 8, 6) + lab(ix2 - 16, iy2 + 18, 7) + lab(ix2 + 16, iy2 + 18, 8), 'aria-label="parallel lines cut by a transversal"');
}
// with a rising transversal: angles 2,3,6,7 are acute (= theta); 1,4,5,8 are obtuse (= 180 − theta)
const ACUTE = new Set([2, 3, 6, 7]);
const PAIRS = { corresponding: [[1, 5], [2, 6], [3, 7], [4, 8]], 'alternate interior': [[3, 6], [4, 5]], 'alternate exterior': [[1, 8], [2, 7]], 'same-side interior': [[3, 5], [4, 6]], vertical: [[1, 4], [2, 3], [5, 8], [6, 7]], 'linear pair': [[1, 2], [1, 3], [2, 4], [3, 4], [5, 6], [5, 7], [6, 8], [7, 8]] };

/* coordinate-plane polygons */
const polyPoints = (pts, labels, color = C.blue) => pts.map((p, i) => ({ x: p[0], y: p[1], label: labels ? labels[i] : undefined, color }));
const polyLines = pts => pts.map((p, i) => { const q = pts[(i + 1) % pts.length]; return [p[0], p[1], q[0], q[1]]; });
const planeFor = (pts, extra = [], { min = -9, max = 9 } = {}) => plane({ min, max, points: [...polyPoints(pts, ['A', 'B', 'C', 'D'].slice(0, pts.length)), ...extra], lines: polyLines(pts), labelEvery: 3, size: 300 });
const randTri = () => { const pts = []; while (pts.length < 3) { const p = [nz(-5, 5), nz(-5, 5)]; if (Math.abs(p[0]) !== Math.abs(p[1]) && !pts.some(q => q[0] === p[0] && q[1] === p[1])) pts.push(p); } const [a, c, d] = pts; if ((c[0] - a[0]) * (d[1] - a[1]) - (c[1] - a[1]) * (d[0] - a[0]) === 0) return randTri(); return pts; };
const TFS = {
  translate: (p, dx, dy) => [p[0] + dx, p[1] + dy],
  reflectX: p => [p[0], -p[1]], reflectY: p => [-p[0], p[1]], reflectYX: p => [p[1], p[0]],
  rot90: p => [-p[1], p[0]], rot180: p => [-p[0], -p[1]], rot270: p => [p[1], -p[0]],
  dilate: (p, k) => [p[0] * k, p[1] * k]
};

export const GEO6_RULES = [
  /* ===== angles ===== */
  R(/^Measure angles on a circle$/, () => () => {
    const deg = ri(1, 17) * 10; return num(`${protractor(deg)}What is the measure of the angle? (degrees)`, deg, `The red ray points at ${b(deg)}°.`);
  }),
  R(/^Estimate angle measurements$/, () => () => {
    const deg = pick([30, 45, 60, 90, 120, 135, 150]), opts = [30, 45, 60, 90, 120, 135, 150];
    return mc(`${angleSvg(deg)}Which is the best estimate of this angle's measure?`, deg + '°', sample(opts.filter(x => Math.abs(x - deg) >= 25), 3).map(x => x + '°'), `The angle is about ${b(deg + '°')}.`, 4);
  }),
  R(/^Name angles$|^Name, measure and classify angles$/, (mt, ctx) => () => {
    const deg = pick([30, 40, 60, 90, 110, 130, 150]), type = deg < 90 ? 'acute' : deg === 90 ? 'right' : 'obtuse';
    return /measure/.test(ctx.title) ? mc(`${angleSvg(deg)}An angle measures ${b(deg + '°')}. What type of angle is it?`, type, ['acute', 'right', 'obtuse'].filter(x => x !== type), `${deg}° is ${b(type)}.`, 3) : mc(`Angle ABC has vertex B. Which name is another way to write ∠ABC?`, '∠CBA', ['∠BAC', '∠ACB', '∠BCA'], `The vertex letter B must be in the middle: ${b('∠CBA')}.`, 4);
  }),
  R(/^Identify complementary, supplementary, vertical,? (?:and )?adjacent(?: and congruent)? angles$/, () => () => {
    const q = pick([['Two angles whose measures add to 90°', 'complementary'], ['Two angles whose measures add to 180°', 'supplementary'], ['Angles that are opposite each other when two lines cross', 'vertical'], ['Two angles that share a vertex and a side but do not overlap', 'adjacent'], ['Angles that have the same measure', 'congruent']]);
    return mc(`What do we call: ${b(q[0])}?`, q[1], ['complementary', 'supplementary', 'vertical', 'adjacent', 'congruent'].filter(x => x !== q[1]).slice(0, 3), `${q[0]} are ${b(q[1])} angles.`, 4);
  }),
  R(/^Find measures of complementary, supplementary, vertical,? (?:and )?adjacent angles$/, () => () => {
    const x = ri(15, 80), kind = pick(['complementary', 'supplementary', 'vertical']), ans = kind === 'complementary' ? 90 - x : kind === 'supplementary' ? 180 - x : x;
    return num(`Two angles are ${b(kind)}. One measures ${b(x + '°')}. What is the measure of the other angle? (degrees)`, ans, kind === 'vertical' ? `Vertical angles are equal: ${b(x)}°.` : `${kind === 'complementary' ? 90 : 180} − ${x} = ${b(ans)}°.`);
  }),
  R(/^Transversals of parallel lines: name angle pairs$/, () => () => {
    const kind = pick(['corresponding', 'alternate interior', 'alternate exterior', 'same-side interior']), [p, q] = pick(PAIRS[kind]);
    return mc(`${transversalSvg()}Two parallel lines are cut by a transversal. Angles ${b(p)} and ${b(q)} are called…`, kind, ['corresponding', 'alternate interior', 'alternate exterior', 'same-side interior', 'vertical'].filter(x => x !== kind).slice(0, 3), `Angles ${p} and ${q} are ${b(kind)} angles.`, 4);
  }),
  R(/^Transversals of parallel lines: find angle measures$/, () => () => {
    const th = ri(3, 8) * 10, from = ri(1, 8), to = ri(1, 8); if (from === to) return null;
    const meas = k => (ACUTE.has(k) ? th : 180 - th);
    return num(`${transversalSvg()}The lines are parallel and ∠${from} = ${b(meas(from) + '°')}. What is ∠${to}? (degrees)`, meas(to), `Use the angle relationships: ∠${to} = ${b(meas(to))}°.`);
  }),
  R(/^Find lengths and measures of bisected line segments and angles$/, () => () => {
    const half = ri(8, 40);
    return Math.random() < 0.5 ? num(`Point M is the midpoint of segment AB. AM = ${b(half)} cm. What is the length of AB? (cm)`, 2 * half, `AB = 2 × ${half} = ${b(2 * half)} cm.`) : num(`Ray BD bisects ∠ABC. ∠ABD = ${b(half + '°')}. What is the measure of ∠ABC? (degrees)`, 2 * half, `A bisector splits the angle in two equal parts: ${b(2 * half)}°.`);
  }),

  /* ===== polygons ===== */
  R(/^Identify and classify polygons$/, () => () => {
    const n = ri(3, 10), names = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon' };
    return mc(`A polygon has ${b(n)} sides. What is it called?`, names[n], Object.values(names).filter(x => x !== names[n]).slice(0, 3), `A polygon with ${n} sides is a ${b(names[n])}.`, 4);
  }),
  R(/^Graph triangles and quadrilaterals$/, () => () => {
    const pts = randTri(), type = (() => { const d = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]); const s = [d(pts[0], pts[1]), d(pts[1], pts[2]), d(pts[2], pts[0])].map(v_ => fix(v_, 6)); return new Set(s).size === 1 ? 'equilateral' : new Set(s).size === 2 ? 'isosceles' : 'scalene'; })();
    return mc(`${planeFor(pts)}The triangle ABC is drawn on the coordinate plane. What are the coordinates of vertex ${b('A')}?`, pt(...pts[0]), [pt(pts[0][1], pts[0][0]), pt(-pts[0][0], pts[0][1]), pt(pts[0][0], -pts[0][1])].filter(v_ => v_ !== pt(...pts[0])), `Vertex A is at ${b(pt(...pts[0]))}.`, 4);
  }),
  R(/^Find missing angles in triangles(?: and quadrilaterals)?$|^Triangle Angle-Sum Theorem$/, (mt, ctx) => () => {
    const quad = /quadrilaterals/.test(ctx.title) && Math.random() < 0.5, k = quad ? 3 : 2, known = Array.from({ length: k }, () => ri(30, quad ? 110 : 90)), total = quad ? 360 : 180, ans = total - sum(known); if (ans <= 10 || ans >= 170) return null;
    return num(`A ${quad ? 'quadrilateral' : 'triangle'} has angles of ${known.map(x => b(x + '°')).join(', ')} and a missing angle. What is the missing angle? (degrees)`, ans, `${total} − (${known.join(' + ')}) = ${b(ans)}°.`);
  }),
  R(/^Find missing angles in triangles using ratios$/, () => () => {
    const a = ri(1, 4), c = ri(1, 4), d = ri(1, 4), k = 180 / (a + c + d); if (!Number.isInteger(k)) return null;
    return num(`The angles of a triangle are in the ratio ${b(`${a}:${c}:${d}`)}. What is the measure of the largest angle? (degrees)`, Math.max(a, c, d) * k, `${a + c + d} parts = 180°, so 1 part = ${k}°. Largest: ${b(Math.max(a, c, d) * k)}°.`);
  }),
  R(/^Find missing angles in quadrilaterals I{1,2}$/, () => () => {
    const known = [ri(60, 120), ri(60, 120), ri(60, 120)], ans = 360 - sum(known); if (ans <= 20) return null;
    return num(`Three angles of a quadrilateral are ${known.map(x => b(x + '°')).join(', ')}. What is the fourth angle? (degrees)`, ans, `360 − ${sum(known)} = ${b(ans)}°.`);
  }),
  R(/^Exterior Angle Theorem$/, () => () => {
    const a = ri(30, 80), c = ri(30, 80); return num(`In triangle ABC, ∠A = ${b(a + '°')} and ∠B = ${b(c + '°')}. What is the measure of the exterior angle at C? (degrees)`, a + c, `The exterior angle equals the sum of the two remote interior angles: ${b(a + c)}°.`);
  }),
  R(/^Interior angles of polygons$|^Sums of angles in polygons$/, () => () => {
    const n = ri(5, 12), regular = Math.random() < 0.5, total = (n - 2) * 180;
    return regular ? num(`What is the measure of one interior angle of a regular polygon with ${b(n)} sides? (degrees, rounded to the nearest degree)`, Math.round(total / n), `(${n} − 2) × 180 ÷ ${n} = ${fix(total / n, 1)} ≈ ${b(Math.round(total / n))}°.`) : num(`What is the sum of the interior angles of a polygon with ${b(n)} sides? (degrees)`, total, `(${n} − 2) × 180 = ${b(total)}°.`);
  }),
  R(/^Exterior angles of polygons$/, () => () => {
    const n = pick([3, 4, 5, 6, 8, 9, 10, 12]); return num(`What is the measure of one exterior angle of a regular polygon with ${b(n)} sides? (degrees)`, 360 / n, `360 ÷ ${n} = ${b(360 / n)}°.`);
  }),
  R(/^Central angles of circles$|^Central angles and arc measures$|^Circle graphs and central angles$/, (mt, ctx) => () => {
    const p = pick([10, 20, 25, 30, 40, 50]), deg = (p * 360) / 100;
    return /graphs/.test(ctx.title) ? num(`In a circle graph, a category is ${b(p + '%')} of the data. What is the central angle of its sector? (degrees)`, deg, `${p}% of 360° = ${b(deg)}°.`) : mc(`A central angle measures ${b(deg + '°')}. What is the measure of its intercepted arc?`, deg + '°', [(360 - deg) + '°', (deg / 2) + '°', (deg * 2) + '°'].filter(v_ => v_ !== deg + '°'), `The arc measure equals the central angle: ${b(deg + '°')}.`, 4);
  }),
  R(/^Classify quadrilaterals I{1,2}$/, () => () => {
    const k = pick(['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid', 'kite']), props = { square: 'four equal sides and four right angles', rectangle: 'four right angles and opposite sides equal', rhombus: 'four equal sides and opposite angles equal', parallelogram: 'opposite sides parallel and equal', trapezoid: 'exactly one pair of parallel sides', kite: 'two pairs of adjacent equal sides' };
    return mc(`Which quadrilateral has ${b(props[k])}?`, k, ['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid', 'kite'].filter(x => x !== k).slice(0, 3), `That is a ${b(k)}.`, 4);
  }),

  /* ===== 3-D figures ===== */
  R(/^Identify polyhedra$/, () => () => {
    const poly_ = ['cube', 'rectangular prism', 'square pyramid', 'triangular prism'], non = ['cylinder', 'cone', 'sphere'], ans = pick(poly_);
    return mc(`Which of these is a ${b('polyhedron')} (all faces are flat polygons)?`, ans, sample(non, 3), `${ans[0].toUpperCase() + ans.slice(1)}s have only flat faces.`, 4);
  }),
  R(/^Which figure is being described\?$/, () => () => {
    const q = pick([['6 identical square faces', 'cube'], ['2 circular bases and a curved surface', 'cylinder'], ['1 circular base, a curved surface and one vertex', 'cone'], ['5 faces: one square and four triangles', 'square pyramid'], ['2 triangular bases and 3 rectangular faces', 'triangular prism']]);
    return mc(`Which figure is described? ${b(q[0])}`, q[1], ['cube', 'cylinder', 'cone', 'square pyramid', 'triangular prism'].filter(x => x !== q[1]).slice(0, 3), `It is a ${b(q[1])}.`, 4);
  }),
  R(/^Front, side and top view$|^Base plans$/, () => () => {
    const s = pick([['cylinder', 'top', 'circle'], ['cylinder', 'side', 'rectangle'], ['cone', 'top', 'circle'], ['cone', 'side', 'triangle'], ['cube', 'front', 'square'], ['square pyramid', 'top', 'square'], ['square pyramid', 'side', 'triangle'], ['triangular prism', 'top', 'rectangle']]);
    return mc(`What shape is the ${b(s[1] + ' view')} of a ${b(s[0])}?`, s[2], ['circle', 'square', 'rectangle', 'triangle'].filter(x => x !== s[2]), `Looking at a ${s[0]} from the ${s[1]} you see a ${b(s[2])}.`, 4);
  }),
  R(/^Bases of three-dimensional figures$|^Parts of three-dimensional figures$/, () => () => {
    const q = pick([['triangular prism', 'two triangles'], ['rectangular prism', 'two rectangles'], ['cylinder', 'two circles'], ['square pyramid', 'one square'], ['cone', 'one circle'], ['hexagonal prism', 'two hexagons']]);
    return mc(`What are the base(s) of a ${b(q[0])}?`, q[1], ['two triangles', 'two rectangles', 'two circles', 'one square', 'one circle', 'two hexagons'].filter(x => x !== q[1]).slice(0, 3), `The base${q[1].startsWith('one') ? ' is' : 's are'} ${b(q[1])}.`, 4);
  }),
  R(/^Similar solids$/, () => () => {
    const k = pick([2, 3, 4]), a = ri(2, 6); return num(`Two cubes are similar. The edge of the smaller cube is ${b(a + ' cm')} and the larger cube's edge is ${b(a * k + ' cm')}. What is the scale factor from the smaller to the larger?`, k, `${a * k} ÷ ${a} = ${b(k)}.`);
  }),

  /* ===== area, perimeter, circles ===== */
  R(/^Understanding area of a trapezoid$|^Area of trapezoids$/, (mt, ctx) => () => {
    const b1 = ri(3, 12), b2 = ri(3, 12), h = ri(2, 10); if (b1 === b2 || (b1 + b2) * h % 2) return null;
    const pic = geoSvg(`<polygon points="50,100 170,100 140,30 80,30" fill="#c7d2fe" stroke="${C.primary}" stroke-width="3"/><line x1="140" y1="30" x2="140" y2="100" stroke="${C.red}" stroke-width="2" stroke-dasharray="5 4"/><text x="110" y="22" font-size="13" text-anchor="middle" fill="${C.red}" font-weight="700">${b1}</text><text x="110" y="116" font-size="13" text-anchor="middle" fill="${C.red}" font-weight="700">${b2}</text><text x="148" y="68" font-size="13" fill="${C.red}" font-weight="700">${h}</text>`, 220, 125);
    return num(`${pic}What is the area of the trapezoid? (square units)`, ((b1 + b2) * h) / 2, `A = ½(b₁ + b₂)h = ½(${b1} + ${b2})(${h}) = ${b(((b1 + b2) * h) / 2)}.`);
  }),
  R(/^Area of rhombuses$/, () => () => {
    const d1 = ri(4, 16), d2 = ri(4, 16); if ((d1 * d2) % 2) return null; return num(`A rhombus has diagonals of ${b(d1)} cm and ${b(d2)} cm. What is its area? (cm²)`, (d1 * d2) / 2, `A = ½ d₁d₂ = ${b((d1 * d2) / 2)} cm².`);
  }),
  R(/^Area of rectangles and parallelograms$/, () => () => {
    const bs = ri(3, 15), h = ri(2, 12), rect = Math.random() < 0.5; return num(`A ${rect ? 'rectangle' : 'parallelogram'} has a base of ${b(bs + ' cm')} and a height of ${b(h + ' cm')}. What is its area? (cm²)`, bs * h, `${bs} × ${h} = ${b(bs * h)} cm².`);
  }),
  R(/^Area with mixed numbers$/, () => () => {
    const w1 = ri(1, 4), w2 = ri(1, 4), d = pick([2, 4]), n = ri(1, d - 1), l = w1 + n / d, ww = w2, area = l * ww;
    return num(`A rectangle is ${b(w1 + ' ' + n + '/' + d + ' m')} long and ${b(w2 + ' m')} wide. What is its area? (m², as a decimal)`, fix(area, 4), `${l} × ${ww} = ${b(fix(area, 4))} m².`);
  }),
  R(/^Area of compound figures$|^Area and perimeter of figures on grids$|^Compare area and perimeter of two figures$|^Area between two rectangles$|^Area between two shapes$/, (mt, ctx) => () => {
    if (/between/.test(ctx.title)) { const W = ri(8, 16), H = ri(6, 12), w = ri(2, W - 3), h = ri(2, H - 3); return num(`A ${W} cm by ${H} cm rectangle has a ${w} cm by ${h} cm rectangle cut out of it. What is the area of the remaining shape? (cm²)`, W * H - w * h, `${W * H} − ${w * h} = ${b(W * H - w * h)} cm².`); }
    if (/Compare/.test(ctx.title)) { const a = [ri(3, 10), ri(3, 10)], c = [ri(3, 10), ri(3, 10)], A = a[0] * a[1], Cc = c[0] * c[1]; if (A === Cc) return null; return mc(`Rectangle A is ${a[0]} by ${a[1]}. Rectangle B is ${c[0]} by ${c[1]}. Which has the greater area?`, A > Cc ? 'Rectangle A' : 'Rectangle B', [A > Cc ? 'Rectangle B' : 'Rectangle A'], `A = ${A} and B = ${Cc}.`, 2); }
    const { cells } = lShape(); return /grids/.test(ctx.title) ? num(`${gridFigure(cells)}Each square is 1 unit by 1 unit. What is the area plus the perimeter of the figure?`, cells.length + perimeterOfCells(cells), `Area ${cells.length} + perimeter ${perimeterOfCells(cells)} = ${b(cells.length + perimeterOfCells(cells))}.`) : num(`${gridFigure(cells)}Each square is 1 unit by 1 unit. What is the area of the figure? (square units)`, cells.length, `Count the squares: ${b(cells.length)}.`);
  }),
  R(/^Circumference of circles$/, () => () => {
    const r = ri(2, 15), useD = Math.random() < 0.4;
    return num(`A circle has a ${useD ? 'diameter' : 'radius'} of ${b((useD ? 2 * r : r) + ' cm')}. What is its circumference? (Give the number in front of π.)`, 2 * r, `C = ${useD ? 'π × d' : '2πr'} = ${b(pi(2 * r))} cm.`);
  }),
  R(/^Area of circles$/, () => () => {
    const r = ri(2, 12), useD = Math.random() < 0.4;
    return num(`A circle has a ${useD ? 'diameter' : 'radius'} of ${b((useD ? 2 * r : r) + ' cm')}. What is its area? (Give the number in front of π.)`, r * r, `A = πr² = π × ${r}² = ${b(pi(r * r))} cm².`);
  }),
  R(/^Circles: word problems$/, () => () => {
    const r = ri(2, 10), nm = pick(NAMES); return Math.random() < 0.5 ? num(`${nm} walks once around a circular pond with radius ${b(r + ' m')}. How far does ${nm} walk? (Give the number in front of π.)`, 2 * r, `C = 2πr = ${b(pi(2 * r))} m.`) : num(`A circular rug has a radius of ${b(r + ' m')}. What is its area? (Give the number in front of π.)`, r * r, `A = πr² = ${b(pi(r * r))} m².`);
  }),
  R(/^Semicircles: calculate area, perimeter, radius and diameter$|^Area and perimeter of semicircles and quarter circles$|^Quarter circles: calculate area and perimeter$/, (mt, ctx) => () => {
    const r = ri(2, 12) * 2, quarter = /uarter/.test(ctx.title) && !/semicircles/.test(ctx.title) ? true : Math.random() < 0.4, f = quarter ? 4 : 2, wantA = Math.random() < 0.5;
    return wantA ? num(`What is the area of a ${quarter ? 'quarter circle' : 'semicircle'} with radius ${b(r + ' cm')}? (Give the number in front of π.)`, (r * r) / f, `${quarter ? '¼' : '½'} × π × ${r}² = ${b(pi((r * r) / f))} cm².`) : num(`What is the length of the curved edge of a ${quarter ? 'quarter circle' : 'semicircle'} with radius ${b(r + ' cm')}? (Give the number in front of π.)`, (2 * r) / f, `${quarter ? '¼' : '½'} × 2πr = ${b(pi((2 * r) / f))} cm.`);
  }),
  R(/^Area of sectors$|^Arc length$/, (mt, ctx) => () => {
    const r = ri(2, 12), deg = pick([45, 60, 90, 120, 180, 270]), frac = deg / 360, arc = /Arc/.test(ctx.title);
    const v_ = arc ? 2 * r * frac : r * r * frac; return num(`A sector has radius ${b(r + ' cm')} and central angle ${b(deg + '°')}. What is its ${arc ? 'arc length' : 'area'}? (Give the number in front of π, rounded to 2 decimals.)`, fix(v_, 2), `${fs(...simp(deg, 360))} of ${arc ? `2π × ${r}` : `π × ${r}²`} = ${b(pi(fix(v_, 2)))}.`);
  }),
  R(/^Area of compound figures with triangles, semicircles and quarter circles$/, () => () => {
    const w = ri(3, 8) * 2, h = ri(3, 8), area = fix(w * h + 0.5 * 3.14 * (w / 2) ** 2, 2);
    return num(`A figure is a ${w} cm by ${h} cm rectangle with a semicircle (diameter ${w} cm) attached to one ${w} cm side. What is the total area? (Use π ≈ 3.14; cm²)`, area, `${w * h} + ½ × 3.14 × ${w / 2}² = ${b(area)} cm².`);
  }),
  R(/^Perimeter and area: changes in scale$/, () => () => {
    const k = pick([2, 3, 4]), a = ri(2, 9), area = Math.random() < 0.5;
    return num(`Each side of a square is multiplied by ${b(k)}. By what factor does the ${area ? 'area' : 'perimeter'} change?`, area ? k * k : k, area ? `Area scales by ${k}² = ${b(k * k)}.` : `Perimeter scales by ${b(k)}.`);
  }),

  /* ===== surface area and volume ===== */
  R(/^Surface area of triangular prisms$/, () => () => {
    const a = pick([3, 6, 9]), h = pick([4, 8, 12]), hyp = Math.sqrt(a * a + h * h); if (!Number.isInteger(hyp)) return null; const L = ri(4, 12), sa = a * h + (a + h + hyp) * L;
    return num(`A triangular prism has right-triangle bases with legs ${b(a)} cm and ${b(h)} cm (hypotenuse ${hyp} cm) and length ${b(L + ' cm')}. What is its surface area? (cm²)`, sa, `2 × ½ × ${a} × ${h} + (${a} + ${h} + ${hyp}) × ${L} = ${b(sa)} cm².`);
  }),
  R(/^Surface area of pyramids$/, () => () => {
    const s = ri(4, 12), sl = ri(5, 15), sa = s * s + 2 * s * sl;
    return num(`A square pyramid has base side ${b(s + ' cm')} and slant height ${b(sl + ' cm')}. What is its surface area? (cm²)`, sa, `Base ${s * s} + 4 triangles ½ × ${s} × ${sl} = ${b(sa)} cm².`);
  }),
  R(/^Volume of triangular prisms$/, () => () => {
    const bs = ri(3, 12), h = ri(2, 10), L = ri(3, 12); if ((bs * h) % 2) return null; return num(`A triangular prism has a triangular base with base ${b(bs)} cm and height ${b(h)} cm, and the prism is ${b(L + ' cm')} long. What is its volume? (cm³)`, (bs * h * L) / 2, `V = ½ × ${bs} × ${h} × ${L} = ${b((bs * h * L) / 2)} cm³.`);
  }),
  R(/^Relate volume and surface area$/, () => () => {
    const a = ri(2, 6), c = ri(2, 6), d = ri(2, 6), V = a * c * d, sa = 2 * (a * c + a * d + c * d);
    return mc(`A box is ${a} × ${c} × ${d} units. Which statement is true?`, `Its volume is ${V} cubic units and its surface area is ${sa} square units`, [`Its volume is ${sa} cubic units and its surface area is ${V} square units`, `Its volume is ${V} square units`, `Its surface area is ${V} cubic units`], `Volume uses cubic units (${V}); surface area uses square units (${sa}).`, 4);
  }),
  R(/^Volume of prisms and cylinders$/, () => () => {
    const cyl = Math.random() < 0.5; if (cyl) { const r = ri(2, 8), h = ri(2, 12); return num(`A cylinder has radius ${b(r + ' cm')} and height ${b(h + ' cm')}. What is its volume? (Give the number in front of π.)`, r * r * h, `V = πr²h = ${b(pi(r * r * h))} cm³.`); }
    const l = ri(2, 10), w = ri(2, 9), h = ri(2, 9); return num(`A rectangular prism is ${l} cm by ${w} cm by ${h} cm. What is its volume? (cm³)`, l * w * h, `${l} × ${w} × ${h} = ${b(l * w * h)} cm³.`);
  }),
  R(/^Surface area of prisms$|^Surface area of prisms and cylinders$|^Surface area of cylinders$/, (mt, ctx) => () => {
    const cyl = /cylinders/.test(ctx.title) && (!/prisms/.test(ctx.title) || Math.random() < 0.5);
    if (cyl) { const r = ri(2, 8), h = ri(2, 12), k = 2 * r * r + 2 * r * h; return num(`A cylinder has radius ${b(r + ' cm')} and height ${b(h + ' cm')}. What is its surface area? (Give the number in front of π.)`, k, `SA = 2πr² + 2πrh = ${b(pi(k))} cm².`); }
    const l = ri(2, 10), w = ri(2, 9), h = ri(2, 9); return num(`A rectangular prism is ${l} cm by ${w} cm by ${h} cm. What is its surface area? (cm²)`, 2 * (l * w + l * h + w * h), `2(lw + lh + wh) = ${b(2 * (l * w + l * h + w * h))} cm².`);
  }),
  R(/^Relationship between volume and the area of the base: word problems$/, () => () => {
    const A = pick([5, 10, 12, 15, 20]), hh = ri(2, 9); return num(`A prism has a base area of ${b(A + ' cm²')} and a height of ${b(hh + ' cm')}. What is its volume? (cm³)`, A * hh, `V = base area × height = ${A} × ${hh} = ${b(A * hh)} cm³.`);
  }),
  R(/^Volume of cubes and rectangular prisms: word problems$/, () => () => {
    const l = ri(2, 10), w = ri(2, 8), h = ri(2, 6), nm = pick(NAMES); return num(`${nm}'s fish tank is ${l} dm long, ${w} dm wide and ${h} dm high. How many litres of water fill it? (1 dm³ = 1 L)`, l * w * h, `${l} × ${w} × ${h} = ${b(l * w * h)} dm³ = ${b(l * w * h)} L.`);
  }),
  R(/^Volume of compound figures$/, () => () => {
    const a = [ri(3, 8), ri(2, 6), ri(2, 6)], c = [ri(2, 5), ri(2, 5), ri(2, 5)];
    return num(`A solid is made of two boxes joined together: ${a.join(' × ')} units and ${c.join(' × ')} units. What is the total volume? (cubic units)`, a[0] * a[1] * a[2] + c[0] * c[1] * c[2], `${a[0] * a[1] * a[2]} + ${c[0] * c[1] * c[2]} = ${b(a[0] * a[1] * a[2] + c[0] * c[1] * c[2])}.`);
  }),
  R(/^Volume and surface area of similar solids$/, () => () => {
    const k = pick([2, 3]), V = ri(2, 9) * 10, vol = Math.random() < 0.5;
    return num(`Two similar solids have a scale factor of ${b(k)}. The smaller one has ${vol ? 'volume' : 'surface area'} ${b(V + (vol ? ' cm³' : ' cm²'))}. What is the ${vol ? 'volume' : 'surface area'} of the larger solid?`, V * k ** (vol ? 3 : 2), `${vol ? 'Volume' : 'Area'} scales by ${k}^${vol ? 3 : 2} = ${k ** (vol ? 3 : 2)}: ${b(V * k ** (vol ? 3 : 2))}.`);
  }),

  /* ===== Pythagorean theorem ===== */
  R(/^Pythagorean theorem: find the length of the hypotenuse$|^Pythagorean theorem: find the missing leg length$|^Pythagorean theorem: find the missing leg or hypotenuse length$/, (mt, ctx) => () => {
    const [a, c, h] = triple(), hide = /hypotenuse$/.test(ctx.title) && !/leg or/.test(ctx.title) ? 'h' : /missing leg length/.test(ctx.title) ? 'a' : pick(['a', 'c', 'h']);
    const ans = hide === 'h' ? h : hide === 'a' ? a : c;
    return num(`${rightTri(a, c, h, hide)}Find the missing side length. (units)`, ans, hide === 'h' ? `√(${a}² + ${c}²) = √${a * a + c * c} = ${b(h)}.` : `√(${h}² − ${hide === 'a' ? c : a}²) = ${b(ans)}.`);
  }),
  R(/^Pythagorean theorem: find the perimeter$/, () => () => {
    const [a, c, h] = triple(); return num(`${rightTri(a, c, h, 'h')}Find the perimeter of the right triangle. (units)`, a + c + h, `Hypotenuse = √(${a}² + ${c}²) = ${h}. Perimeter = ${a} + ${c} + ${h} = ${b(a + c + h)}.`);
  }),
  R(/^Pythagorean theorem: word problems$/, () => () => {
    const [a, c, h] = triple(), nm = pick(NAMES), kind = pick(['ladder', 'walk']);
    return kind === 'ladder' ? num(`${nm} leans a ${b(h + ' m')} ladder against a wall. The foot of the ladder is ${b(a + ' m')} from the wall. How high up the wall does it reach? (m)`, c, `√(${h}² − ${a}²) = ${b(c)} m.`) : num(`${nm} walks ${b(a + ' km')} east and then ${b(c + ' km')} north. How far is ${nm} from the start in a straight line? (km)`, h, `√(${a}² + ${c}²) = ${b(h)} km.`);
  }),
  R(/^Converse of the Pythagorean theorem: is it a right triangle\?$/, () => () => {
    const [a, c, h] = triple(), right = Math.random() < 0.5, hh = right ? h : h + pick([-1, 1, 2]); return yesNo(`A triangle has sides ${b(a)}, ${b(c)} and ${b(hh)}. Is it a right triangle?`, a * a + c * c === hh * hh, a * a + c * c === hh * hh ? `${a}² + ${c}² = ${hh}² ✓.` : `${a}² + ${c}² = ${a * a + c * c}, but ${hh}² = ${hh * hh}.`, ['Yes', 'No']);
  }),

  /* ===== coordinate plane ===== */
  R(/^Objects on a coordinate plane: positive numbers only$|^Graph points on a coordinate plane: positive numbers only$|^Objects on a coordinate plane: positive and negative numbers$|^Graph points on a coordinate plane: positive and negative numbers$/, (mt, ctx) => () => {
    const four = /negative/.test(ctx.title), pts = []; while (pts.length < 4) { const p = [ri(four ? -7 : 1, 8), ri(four ? -7 : 1, 8)]; if (!pts.some(q => q[0] === p[0] || q[1] === p[1]) && !(four && (p[0] === 0 || p[1] === 0))) pts.push(p); }
    const k = ri(0, 3), labs = ['A', 'B', 'C', 'D'], pic = plane({ min: four ? -9 : 0, max: 9, points: pts.map((p, i) => ({ x: p[0], y: p[1], label: labs[i] })), labelEvery: 3, size: 300 });
    return /^Graph/.test(ctx.title) ? mc(`${pic}Which point is at ${b(pt(...pts[k]))}?`, labs[k], labs.filter((_, i) => i !== k), `Point ${b(labs[k])} is at ${pt(...pts[k])}.`, 4) : mc(`${pic}What are the coordinates of point ${b(labs[k])}?`, pt(...pts[k]), [pt(pts[k][1], pts[k][0]), pt(pts[k][0], -pts[k][1]), pt(-pts[k][0], pts[k][1])].filter(v_ => v_ !== pt(...pts[k])), `Go ${S(pts[k][0])} across and ${S(pts[k][1])} up: ${b(pt(...pts[k]))}.`, 4);
  }),
  R(/^Distance\/direction to starting point$/, () => () => {
    const dx = nz(-5, 5), dy = nz(-5, 5), end = [dx, dy];
    return mc(`You start at the origin and end at ${b(pt(...end))}. Which moves get you back to the start?`, `${Math.abs(dx)} ${dx > 0 ? 'left' : 'right'} and ${Math.abs(dy)} ${dy > 0 ? 'down' : 'up'}`, [`${Math.abs(dx)} ${dx > 0 ? 'right' : 'left'} and ${Math.abs(dy)} ${dy > 0 ? 'up' : 'down'}`, `${Math.abs(dy)} ${dx > 0 ? 'left' : 'right'} and ${Math.abs(dx)} ${dy > 0 ? 'down' : 'up'}`, `${Math.abs(dx)} ${dx > 0 ? 'left' : 'right'} and ${Math.abs(dy)} ${dy > 0 ? 'up' : 'down'}`], `Reverse each move.`, 4);
  }),
  R(/^Coordinate plane review$|^Quadrants and axes$/, (mt, ctx) => () => {
    const x = nz(-9, 9), y = nz(-9, 9), onAxis = Math.random() < 0.3;
    if (onAxis && /Quadrants/.test(ctx.title)) { const px = Math.random() < 0.5; return mc(`The point ${b(px ? pt(x, 0) : pt(0, y))} lies on which axis?`, px ? 'x-axis' : 'y-axis', [px ? 'y-axis' : 'x-axis', 'neither axis'], px ? 'y = 0, so it is on the x-axis.' : 'x = 0, so it is on the y-axis.', 3); }
    const q = x > 0 && y > 0 ? 'I' : x < 0 && y > 0 ? 'II' : x < 0 && y < 0 ? 'III' : 'IV';
    return mc(`In which quadrant is ${b(pt(x, y))}?`, q, ['I', 'II', 'III', 'IV'].filter(v_ => v_ !== q), `x is ${x > 0 ? 'positive' : 'negative'} and y is ${y > 0 ? 'positive' : 'negative'}: quadrant ${b(q)}.`, 4);
  }),
  R(/^(?:Find the )?[Dd]istance between two points$/, () => () => {
    const x1 = ri(-6, 4), y1 = ri(-6, 4);
    if (Math.random() < 0.4) { const d = ri(2, 9); return num(`${m(`A${pt(x1, y1)}`)} and ${m(`B${pt(x1 + d, y1)}`)} lie on a horizontal line. How far apart are they?`, d, `|${S(x1 + d)} − ${P(x1)}| = ${b(d)}.`); }
    const [dx, dy] = pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]]), dd = Math.hypot(dx, dy);
    return num(`How far apart are ${b(pt(x1, y1))} and ${b(pt(x1 + dx, y1 + dy))}? (units)`, dd, `√(${dx}² + ${dy}²) = ${b(dd)}.`);
  }),

  /* ===== transformations, congruence, similarity ===== */
  R(/^(Translations|Reflections|Rotations|Dilations): (?:graph the image|find the coordinates)$/, (mt, ctx) => () => {
    const kind = mt[1], pts = randTri(); let f, desc, tdx = 0, tdy = 0;
    if (kind === 'Translations') { const dx = nz(-5, 5), dy = nz(-5, 5); tdx = dx; tdy = dy; f = p => TFS.translate(p, dx, dy); desc = `translated ${Math.abs(dx)} ${dx > 0 ? 'right' : 'left'} and ${Math.abs(dy)} ${dy > 0 ? 'up' : 'down'}`; }
    else if (kind === 'Reflections') { const t = pick(['reflectX', 'reflectY']); f = TFS[t]; desc = `reflected across the ${t === 'reflectX' ? 'x' : 'y'}-axis`; }
    else if (kind === 'Rotations') { const t = pick(['rot90', 'rot180', 'rot270']); f = TFS[t]; desc = `rotated ${t.slice(3)}° counterclockwise about the origin`; }
    else { const k = pick([2, 3, 0.5]); const base = k === 0.5 ? pts.map(p => [p[0] * 2, p[1] * 2]) : pts; pts.splice(0, 3, ...base); f = p => TFS.dilate(p, k); desc = `dilated about the origin with scale factor ${k}`; }
    const idx = ri(0, 2), a = pts[idx], im = f(a); if (Math.abs(im[0]) > 9 || Math.abs(im[1]) > 9) return null;
    const L = 'ABC'[idx];
    return mc(`${planeFor(pts)}Triangle ABC is ${desc}. Vertex ${L} starts at ${b(pt(...a))}. What are the coordinates of ${L}′ after the transformation?`, pt(...im), (kind === 'Translations' ? uniq([pt(a[0] - tdx, a[1] - tdy), pt(a[0] + tdx, a[1] - tdy), pt(a[0] - tdx, a[1] + tdy), pt(a[0] + tdy, a[1] + tdx)]) : uniq([pt(im[1], im[0]), pt(-im[0], im[1]), pt(im[0], -im[1]), pt(-im[0], -im[1])])).filter(v_ => v_ !== pt(...im)).slice(0, 3), `Apply the transformation to ${pt(...a)}: ${b(pt(...im))}.`, 4);
  }),
  R(/^Sequences of (?:congruence )?transformations: graph the image$|^Sequences of congruence transformations: choose the sequence$/, (mt, ctx) => () => {
    const pts = randTri(), dx = nz(-4, 4), dy = nz(-4, 4), a = pts[0], step1 = TFS.reflectY(a), end = TFS.translate(step1, dx, dy); if (Math.abs(end[0]) > 9 || Math.abs(end[1]) > 9) return null;
    return mc(`${planeFor(pts)}Vertex A${pt(...a)} is reflected across the y-axis and then translated ${Math.abs(dx)} ${dx > 0 ? 'right' : 'left'} and ${Math.abs(dy)} ${dy > 0 ? 'up' : 'down'}. Where does A end up?`, pt(...end), uniq([pt(...TFS.translate(a, dx, dy)), pt(...TFS.reflectY(TFS.translate(a, dx, dy))), pt(...TFS.translate(TFS.reflectX(a), dx, dy))]).filter(v_ => v_ !== pt(...end)), `Reflect: ${pt(...step1)}; translate: ${b(pt(...end))}.`, 4);
  }),
  R(/^Identify reflections, rotations and translations$|^Describe a sequence of transformations$|^Describe transformations$/, () => () => {
    const q = pick([[`(x, y) → (x + 3, y − 2)`, 'translation'], [`(x, y) → (−x, y)`, 'reflection across the y-axis'], [`(x, y) → (x, −y)`, 'reflection across the x-axis'], [`(x, y) → (−y, x)`, 'rotation 90° counterclockwise'], [`(x, y) → (−x, −y)`, 'rotation 180°'], [`(x, y) → (2x, 2y)`, 'dilation (scale factor 2)']]);
    return mc(`Which transformation is described by ${m(q[0])}?`, q[1], ['translation', 'reflection across the y-axis', 'reflection across the x-axis', 'rotation 90° counterclockwise', 'rotation 180°', 'dilation (scale factor 2)'].filter(x => x !== q[1]).slice(0, 3), `This rule gives a ${b(q[1])}.`, 4);
  }),
  R(/^Congruence statements and corresponding parts$/, () => () => {
    const a = ri(3, 12), c = ri(3, 12), d = ri(3, 12);
    return num(`△ABC ≅ △DEF. AB = ${b(a)}, BC = ${b(c)}, CA = ${b(d)}. What is the length of ${b('DE')}?`, a, `Corresponding sides are equal: DE = AB = ${b(a)}.`);
  }),
  R(/^Determine if two figures are congruent: justify your answer$|^Determine if two figures are similar: justify your answer$/, (mt, ctx) => () => {
    const sim = /similar/.test(ctx.title), a = [ri(3, 9), ri(3, 9), ri(3, 9)], k = ri(2, 3), same = Math.random() < 0.5, c = same ? a.map(x => x * (sim ? k : 1)) : a.map((x, i) => x * (sim ? k : 1) + (i === 0 ? 1 : 0));
    return yesNo(`Triangle 1 has sides ${a.join(', ')}. Triangle 2 has sides ${c.join(', ')}. Are they ${b(sim ? 'similar' : 'congruent')}?`, same, same ? (sim ? `All sides are ${k} times as long (SSS similarity).` : 'All three pairs of sides match (SSS).') : 'The side lengths do not match proportionally.', ['Yes', 'No']);
  }),
  R(/^Side lengths and angle measures of congruent figures$/, () => () => {
    const a = ri(20, 80); return num(`△ABC ≅ △PQR and ∠A = ${b(a + '°')}. What is the measure of ∠P? (degrees)`, a, `Corresponding angles are congruent: ${b(a)}°.`);
  }),
  R(/^Identify similar figures$|^Similar and congruent figures$|^Identify similar triangles$/, () => () => {
    const [x, y] = pick([[3, 4], [2, 5], [5, 6]]), k = ri(2, 3), kind = pick(['similar', 'congruent', 'neither']), w = kind === 'neither' ? [x * k, y * k + 1] : kind === 'similar' ? [x * k, y * k] : [x, y];
    return mc(`Rectangle 1 is ${x} by ${y}. Rectangle 2 is ${w[0]} by ${w[1]}. Which word best describes them?`, kind, ['similar', 'congruent', 'neither'].filter(v_ => v_ !== kind), kind === 'similar' ? 'The sides are proportional but not equal.' : kind === 'congruent' ? 'Same size and shape.' : 'The sides are not proportional.', 3);
  }),
  R(/^Dilations: find the scale factor$/, () => () => {
    const k = pick([2, 3, 0.5, 4]), a = ri(2, 8) * (k === 0.5 ? 2 : 1);
    return num(`A segment of length ${b(a)} is dilated to a segment of length ${b(a * k)}. What is the scale factor?`, k, `${a * k} ÷ ${a} = ${b(k)}.`);
  }),
  R(/^Side lengths and angle measures of similar figures$|^Similar figures and indirect measurement$/, (mt, ctx) => () => {
    const k = ri(2, 5), a = ri(2, 9), c = ri(2, 9), nm = pick(NAMES);
    return /indirect/.test(ctx.title) ? num(`A ${b(a + ' m')} pole casts a ${b(c + ' m')} shadow. At the same time a tree casts a ${b(c * k + ' m')} shadow. How tall is the tree? (m)`, a * k, `${a}/${c} = x/${c * k}, so x = ${b(a * k)} m.`) : num(`Two triangles are similar with scale factor ${b(k)}. A side of the small triangle is ${b(a)}. What is the matching side of the larger triangle?`, a * k, `${a} × ${k} = ${b(a * k)}.`);
  }),

  /* ===== constructions (concept checks) ===== */
  R(/^Construct (?:the midpoint or perpendicular bisector of a segment|an angle bisector|a congruent angle|a perpendicular line|parallel lines|an equilateral triangle or regular hexagon)$/, (mt, ctx) => () => {
    const q = [
      [/midpoint/, 'To construct the perpendicular bisector of segment AB, what do you do with the compass?', 'Draw arcs from A and from B with the same radius (more than half of AB) that cross above and below', ['Draw one arc from A only', 'Set the radius to exactly 1 cm', 'Measure AB with a protractor']],
      [/angle bisector/, 'To bisect ∠ABC, which is the first compass step?', 'Draw an arc centred at B that crosses both rays', ['Draw a line from A to C', 'Measure the angle with a ruler', 'Draw an arc centred at A only']],
      [/congruent angle/, 'To copy an angle, what do you do first?', 'Draw an arc across both rays of the original angle, keeping the compass width', ['Measure side lengths with a ruler', 'Draw a circle with no centre', 'Bisect the angle']],
      [/perpendicular line/, 'To construct a line perpendicular to line l through a point P on it, what do you do first?', 'Draw arcs on both sides of P that cut l at two points', ['Draw a line at 45° with a protractor', 'Draw an arc far from P', 'Join P to any point not on l']],
      [/parallel/, 'To construct a line parallel to line l through a point P, you can copy…', 'The angle a transversal through P makes with l (corresponding angles)', ['The length of l', 'A right angle only', 'The midpoint of l']],
      [/equilateral/, 'To construct an equilateral triangle on segment AB, what radius do you use for both arcs?', 'The length of AB', ['Half of AB', 'Twice AB', 'Any radius']]
    ].find(([re]) => re.test(ctx.title));
    return mc(q[1], q[2], q[3], `${b(q[2])}.`, 4);
  })
];
