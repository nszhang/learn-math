/* Lines & angles, perimeter, area, volume, surface area, coordinate plane (Grades 1–5). */
import {
  ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, num, mc, yesNo, near, svg, C, NAMES, big, money, plane, table, dec
} from '../h.js';
import { R } from '../engine.js';
import { angleSvg, protractor, linePair, geoSvg, poly } from './geometry.js';

const U = 24;                         // pixel size of a grid unit
/** grid figure from a list of [x, y] unit squares (y grows downward) */
function gridFigure(cells, { cell = U, fill = '#c7d2fe', showGrid = true } = {}) {
  const maxX = Math.max(...cells.map(c => c[0])) + 1, maxY = Math.max(...cells.map(c => c[1])) + 1;
  let inner = '';
  for (const [x, y] of cells) inner += `<rect x="${4 + x * cell}" y="${4 + y * cell}" width="${cell}" height="${cell}" fill="${fill}" stroke="${showGrid ? '#818cf8' : 'none'}" stroke-width="1"/>`;
  const set = new Set(cells.map(c => c.join(',')));
  for (const [x, y] of cells) {
    const edge = (x1, y1, x2, y2) => `<line x1="${4 + x1 * cell}" y1="${4 + y1 * cell}" x2="${4 + x2 * cell}" y2="${4 + y2 * cell}" stroke="${C.primary}" stroke-width="3" stroke-linecap="round"/>`;
    if (!set.has(`${x},${y - 1}`)) inner += edge(x, y, x + 1, y);
    if (!set.has(`${x},${y + 1}`)) inner += edge(x, y + 1, x + 1, y + 1);
    if (!set.has(`${x - 1},${y}`)) inner += edge(x, y, x, y + 1);
    if (!set.has(`${x + 1},${y}`)) inner += edge(x + 1, y, x + 1, y + 1);
  }
  return svg(maxX * cell + 8, maxY * cell + 8, inner, 'aria-label="grid figure"');
}
const rectCells = (w, h, ox = 0, oy = 0) => { const r = []; for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) r.push([ox + x, oy + y]); return r; };
const perimeterOfCells = cells => { const set = new Set(cells.map(c => c.join(','))); let p = 0; for (const [x, y] of cells) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!set.has(`${x + dx},${y + dy}`)) p++; return p; };
/** staircase / L-shaped region anchored at the bottom-left */
function lShape(maxW = 7, maxH = 6) {
  const a = ri(3, maxW), bb = ri(2, maxH - 1), c = ri(1, a - 1), d = ri(bb + 1, maxH);   // wide-short rectangle + narrow-tall rectangle
  const cells = [];
  for (let x = 0; x < a; x++) for (let y = maxH - bb; y < maxH; y++) cells.push([x, y]);
  for (let x = 0; x < c; x++) for (let y = maxH - d; y < maxH - bb; y++) cells.push([x, y]);
  return { cells, a, bb, c, d };
}
const lShapeLabeled = (W, H, w, h) => {      // outer W×H with a w×h notch removed from the top-right
  const s = 22, ox = 30, oy = 20, pts = [[0, 0], [W - w, 0], [W - w, h], [W, h], [W, H], [0, H]].map(([x, y]) => [ox + x * s, oy + y * s]);
  const lab = (x, y, t) => `<text x="${x}" y="${y}" font-size="12" text-anchor="middle" fill="${C.red}" font-weight="700">${t}</text>`;
  const inner = poly(pts) + lab(ox + ((W - w) * s) / 2, oy - 5, W - w) + lab(ox + (W - w) * s + 14, oy + (h * s) / 2, h) + lab(ox + (W - w + w / 2) * s, oy + h * s - 5, w) + lab(ox + W * s + 14, oy + h * s + ((H - h) * s) / 2, H - h) + lab(ox + (W * s) / 2, oy + H * s + 14, W) + lab(ox - 12, oy + (H * s) / 2, H);
  return svg(ox + W * s + 40, oy + H * s + 26, inner, 'aria-label="L-shaped figure"');
};
const rectLabeled = (l, w, { unit = 'cm', unknown = null } = {}) => {
  const s = Math.min(24, 200 / Math.max(l, w)), W = Math.max(60, l * s), H = Math.max(40, w * s);
  const inner = `<rect x="30" y="14" width="${W}" height="${H}" fill="#c7d2fe" stroke="${C.primary}" stroke-width="3"/><text x="${30 + W / 2}" y="11" font-size="13" text-anchor="middle" fill="${C.red}" font-weight="700">${unknown === 'l' ? '?' : fmt(l) + ' ' + unit}</text><text x="${30 + W / 2}" y="${H + 30}" font-size="13" text-anchor="middle" fill="${C.red}" font-weight="700">${unknown === 'l' ? '?' : fmt(l) + ' ' + unit}</text><text x="22" y="${14 + H / 2 + 4}" font-size="13" text-anchor="end" fill="${C.red}" font-weight="700">${unknown === 'w' ? '?' : fmt(w) + ' ' + unit}</text><text x="${38 + W}" y="${14 + H / 2 + 4}" font-size="13" fill="${C.red}" font-weight="700">${unknown === 'w' ? '?' : fmt(w) + ' ' + unit}</text>`.replace(/(<text x="\d+(?:\.\d+)?" y="[\d.]+" font-size="13" text-anchor="middle" fill="[^"]+" font-weight="700">)\? <\/text>/g, '$1?</text>');
  return svg(W + 100, H + 40, inner, 'aria-label="rectangle"');
};
/** isometric box made of unit cubes */
function isoBox(L, W, H, u = 16) {
  const dx = u * 0.7, dy = u * 0.45;
  const P = (x, y, z) => [10 + x * u + y * dx, 10 + W * dy + (H - z) * u - y * dy];   // y runs back (up and to the right)
  const face = (pts, fill) => `<polygon points="${pts.map(p => p.map(v => Math.round(v * 10) / 10).join(',')).join(' ')}" fill="${fill}" stroke="${C.ink}" stroke-width="1"/>`;
  let inner = '';
  for (let x = 0; x < L; x++) for (let z = 0; z < H; z++) inner += face([P(x, 0, z), P(x + 1, 0, z), P(x + 1, 0, z + 1), P(x, 0, z + 1)], '#c7d2fe');          // front
  for (let x = 0; x < L; x++) for (let y = 0; y < W; y++) inner += face([P(x, y, H), P(x + 1, y, H), P(x + 1, y + 1, H), P(x, y + 1, H)], '#e0e7ff');      // top
  for (let y = 0; y < W; y++) for (let z = 0; z < H; z++) inner += face([P(L, y, z), P(L, y + 1, z), P(L, y + 1, z + 1), P(L, y, z + 1)], '#a5b4fc');      // right
  return svg(Math.ceil(L * u + W * dx + 24), Math.ceil(H * u + W * dy + 24), inner, 'aria-label="box made of unit cubes"');
}
const quadrant = (x, y) => (x > 0 && y > 0 ? 'I' : x < 0 && y > 0 ? 'II' : x < 0 && y < 0 ? 'III' : 'IV');
const PLACES = [['🏫', 'school'], ['🏠', 'home'], ['🌳', 'park'], ['🏥', 'hospital'], ['🛒', 'store'], ['📚', 'library'], ['⚽', 'field']];
const pt = (x, y) => `(${fmt(x)}, ${fmt(y)})`;

export const GEOMEASURE_RULES = [
  /* ===== lines & angles ===== */
  R(/^Lines, line segments and rays$|^Points, lines, line segments, rays and angles$/, () => () => {
    const kind = pick(['line', 'line segment', 'ray', 'point']);
    const pic = { line: geoSvg(`<line x1="5" y1="55" x2="155" y2="55" stroke="${C.ink}" stroke-width="3"/><polygon points="5,55 17,49 17,61" fill="${C.ink}"/><polygon points="155,55 143,49 143,61" fill="${C.ink}"/>`, 160, 110), 'line segment': geoSvg(`<line x1="25" y1="55" x2="135" y2="55" stroke="${C.ink}" stroke-width="3"/><circle cx="25" cy="55" r="5" fill="${C.ink}"/><circle cx="135" cy="55" r="5" fill="${C.ink}"/>`, 160, 110), ray: geoSvg(`<line x1="25" y1="55" x2="155" y2="55" stroke="${C.ink}" stroke-width="3"/><circle cx="25" cy="55" r="5" fill="${C.ink}"/><polygon points="155,55 143,49 143,61" fill="${C.ink}"/>`, 160, 110), point: geoSvg(`<circle cx="80" cy="55" r="6" fill="${C.ink}"/>`, 160, 110) }[kind];
    return mc(`${pic}What is this called?`, kind, ['line', 'line segment', 'ray', 'point'].filter(x => x !== kind), kind === 'line' ? 'A line goes on forever in both directions.' : kind === 'ray' ? 'A ray has one endpoint and goes on forever in one direction.' : kind === 'point' ? 'A point marks an exact location.' : 'A line segment has two endpoints.', 4);
  }),
  R(/^Parallel, perpendicular and intersecting lines$/, () => () => {
    const kind = pick(['parallel', 'perpendicular', 'intersecting']), ans = kind === 'perpendicular' ? 'perpendicular' : kind;
    const opts = ['parallel', 'perpendicular', 'intersecting'];
    return mc(`${linePair(kind)}These two lines are…`, ans, opts.filter(x => x !== ans), kind === 'parallel' ? 'Parallel lines never meet.' : kind === 'perpendicular' ? 'Perpendicular lines meet at a right angle (90°).' : 'Intersecting lines cross each other (not at a right angle).', 3);
  }),
  R(/^Angles greater than, less than or equal to a right angle$|^Acute, right, obtuse and straight angles$|^Types of angles$/, (mt, ctx) => () => {
    const deg = pick(/straight/.test(ctx.title) ? [30, 45, 60, 90, 120, 135, 150, 180] : [30, 45, 60, 90, 90, 110, 120, 135, 150]);
    const type = deg < 90 ? 'acute' : deg === 90 ? 'right' : deg < 180 ? 'obtuse' : 'straight';
    if (/greater than, less than/.test(ctx.title)) return mc(`${angleSvg(deg)}Compare this angle to a right angle (90°).`, deg < 90 ? 'Less than a right angle' : deg === 90 ? 'Equal to a right angle' : 'Greater than a right angle', ['Less than a right angle', 'Equal to a right angle', 'Greater than a right angle'].filter(x => x !== (deg < 90 ? 'Less than a right angle' : deg === 90 ? 'Equal to a right angle' : 'Greater than a right angle')), `A right angle is 90°. This angle is ${deg < 90 ? 'smaller' : deg === 90 ? 'the same' : 'bigger'}.`, 3);
    const opts = ctx.grade >= 4 ? ['acute', 'right', 'obtuse', 'straight'] : ['acute', 'right', 'obtuse'];
    if (type === 'straight' && ctx.grade < 4) return null;
    return mc(`${deg === 180 ? geoSvg(`<line x1="20" y1="85" x2="150" y2="85" stroke="${C.ink}" stroke-width="3"/><circle cx="85" cy="85" r="4" fill="${C.ink}"/>`, 170, 110) : angleSvg(deg)}What type of angle is this?`, type, opts.filter(x => x !== type), `${type === 'acute' ? 'Less than 90°' : type === 'right' ? 'Exactly 90°' : type === 'obtuse' ? 'Between 90° and 180°' : 'Exactly 180°'}: ${b(type)}.`, 4);
  }),
  R(/^Angles as fractions of a circle$/, () => () => {
    const q = pick([[90, '1/4'], [180, '1/2'], [270, '3/4'], [360, '1'], [60, '1/6'], [120, '1/3']]);
    return mc(`What fraction of a full circle is a ${b(q[0] + '°')} angle?`, q[1], ['1/4', '1/2', '3/4', '1/3', '1/6', '1'].filter(x => x !== q[1]).slice(0, 3), `${q[0]}° out of 360° is ${b(q[1])}.`, 4);
  }),
  R(/^Angles of 90, 180, 270 and 360 degrees$/, () => () => {
    const q = pick([['a quarter turn', 90], ['a half turn', 180], ['a three-quarter turn', 270], ['a full turn', 360]]);
    return mc(`How many degrees is ${b(q[0])}?`, q[1] + '°', [90, 180, 270, 360].filter(x => x !== q[1]).map(x => x + '°'), `${q[0][0].toUpperCase() + q[0].slice(1)} is ${b(q[1] + '°')}.`, 4);
  }),
  R(/^Measure angles with a protractor$/, () => () => {
    const deg = ri(1, 17) * 10;
    return num(`${protractor(deg)}What is the measure of the angle? (degrees)`, deg, `The red ray points at ${b(deg)}° on the scale.`);
  }),
  R(/^Draw angles with a protractor$/, () => () => {
    const target = ri(2, 16) * 10, ok = Math.random() < 0.5, drawn = ok ? target : target + pick([-20, -10, 10, 20]);
    return yesNo(`${protractor(drawn)}Maya wants to draw a ${b(target + '°')} angle. Did the red ray end up at the correct mark?`, drawn === target, drawn === target ? 'Yes — the red ray is at the right mark.' : `No — the ray points at ${drawn}°, not ${target}°.`, ['Yes', 'No']);
  }),

  /* ===== perimeter ===== */
  R(/^Perimeter(?: of rectangles)?$|^Perimeter with whole number side lengths$|^Perimeter with decimal side lengths$/, (mt, ctx) => () => {
    const dec_ = /decimal/.test(ctx.title), l = dec_ ? ri(15, 90) / 10 : ri(3, ctx.grade <= 2 ? 9 : 20), w = dec_ ? ri(10, 60) / 10 : ri(2, ctx.grade <= 2 ? 6 : 15), p = fix(2 * (l + w));
    if (l === w) return null;
    return num(`${rectLabeled(l, w)}What is the perimeter of the rectangle? (cm)`, p, `Perimeter = 2 × (${fmt(l)} + ${fmt(w)}) = ${b(fmt(p))} cm.`);
  }),
  R(/^Perimeter of polygons$/, () => () => {
    const n = pick([3, 4, 5, 6]), sides = Array.from({ length: n }, () => ri(2, 12));
    return num(`A polygon has ${n} sides measuring ${b(sides.join(' cm, ') + ' cm')}. What is its perimeter? (cm)`, sum(sides), `${sides.join(' + ')} = ${b(sum(sides))} cm.`);
  }),
  R(/^Perimeter of rectilinear shapes$/, () => () => {
    const W = ri(5, 10), H = ri(4, 8), w = ri(1, W - 2), h = ri(1, H - 2);
    return num(`${lShapeLabeled(W, H, w, h)}All angles are right angles. What is the perimeter of the figure? (units)`, 2 * (W + H), `The perimeter of this shape equals that of its bounding rectangle: 2 × (${W} + ${H}) = ${b(2 * (W + H))}.`);
  }),
  R(/^Perimeter of figures on grids$/, () => () => {
    const { cells } = lShape(); return num(`${gridFigure(cells)}Each square has side length 1 unit. What is the perimeter of the figure? (units)`, perimeterOfCells(cells), `Count the outside edges of the figure: ${b(perimeterOfCells(cells))}.`);
  }),
  R(/^Perimeter: find the missing side lengths?$/, () => () => {
    if (Math.random() < 0.5) { const l = ri(4, 15), w = ri(2, 10), P = 2 * (l + w); return num(`${rectLabeled(l, w, { unknown: 'w' })}The perimeter is ${b(P + ' cm')}. What is the missing width? (cm)`, w, `Half the perimeter is ${P / 2}. ${P / 2} − ${l} = ${b(w)} cm.`); }
    const a = ri(3, 12), c = ri(3, 12), d = ri(3, 12), missing = ri(3, 12), P = a + c + d + missing;
    return num(`A four-sided shape has sides ${a} cm, ${c} cm, ${d} cm and one unknown side. Its perimeter is ${b(P + ' cm')}. How long is the unknown side? (cm)`, missing, `${P} − (${a} + ${c} + ${d}) = ${b(missing)} cm.`);
  }),
  R(/^Perimeter - word problems$|^Area and perimeter: word problems$|^Area and perimeter$/, (mt, ctx) => () => {
    const l = ri(4, 18), w = ri(3, 12), n = pick(NAMES), ask = /^Perimeter/.test(ctx.title) ? 'p' : pick(['p', 'a']);
    if (ask === 'p') return num(`${n} puts a fence around a rectangular garden that is ${b(l + ' m')} long and ${b(w + ' m')} wide. How much fence is needed? (m)`, 2 * (l + w), `2 × (${l} + ${w}) = ${b(2 * (l + w))} m.`);
    return num(`${n} covers a rectangular floor that is ${b(l + ' m')} long and ${b(w + ' m')} wide with tiles. What is the area of the floor? (m²)`, l * w, `${l} × ${w} = ${b(l * w)} m².`);
  }),
  R(/^Use area and perimeter to determine cost$/, () => () => {
    const l = ri(4, 12), w = ri(3, 9), f = ri(2, 9), c = ri(2, 9), fence = Math.random() < 0.5;
    return fence ? num(`A rectangular yard is ${l} m by ${w} m. Fencing costs $${f} per metre. How much does it cost to fence the whole yard? ($)`, 2 * (l + w) * f, `Perimeter ${2 * (l + w)} m × $${f} = ${b('$' + 2 * (l + w) * f)}.`) : num(`A rectangular floor is ${l} m by ${w} m. Flooring costs $${c} per square metre. How much does it cost to cover the floor? ($)`, l * w * c, `Area ${l * w} m² × $${c} = ${b('$' + l * w * c)}.`);
  }),
  R(/^Rectangles: relationship between perimeter and area(?: word problems)?$/, () => () => {
    const P = pick([16, 20, 24, 30]), pairs = range(1, P / 2 - 1).map(l => [l, P / 2 - l]).filter(p => p[0] <= p[1]), [a, c] = sample(pairs, 2); if (!a || !c || a[0] * a[1] === c[0] * c[1]) return null;
    const A = a[0] * a[1], B = c[0] * c[1];
    return mc(`Two rectangles each have a perimeter of ${b(P + ' cm')}. Rectangle A is ${a[0]} cm by ${a[1]} cm. Rectangle B is ${c[0]} cm by ${c[1]} cm. Which has the greater area?`, A > B ? 'Rectangle A' : 'Rectangle B', [A > B ? 'Rectangle B' : 'Rectangle A', 'They have the same area'], `A: ${a[0]} × ${a[1]} = ${A}. B: ${c[0]} × ${c[1]} = ${B}.`, 3);
  }),

  /* ===== area ===== */
  R(/^Area$/, (mt, ctx) => () => {
    const w = ri(2, 6), h = ri(2, 5), cells = rectCells(w, h);
    return num(`${gridFigure(cells)}Each square is 1 square unit. What is the area of the rectangle? (square units)`, w * h, `Count the squares: ${w} × ${h} = ${b(w * h)}.`);
  }),
  R(/^Tile a rectangle with squares$|^Tile a rectangle and find the area$|^Multiply to find the area of a rectangle made of unit squares$/, () => () => {
    const w = ri(2, 8), h = ri(2, 6);
    return num(`${gridFigure(rectCells(w, h))}The rectangle is covered with unit squares: ${b(w)} squares across and ${b(h)} rows. What is the area? (square units)`, w * h, `${w} × ${h} = ${b(w * h)}.`);
  }),
  R(/^Find the area of figures made of unit squares$|^Area of figures on grids$/, () => () => {
    const { cells } = lShape();
    return num(`${gridFigure(cells)}Each square is 1 square unit. What is the area of the figure? (square units)`, cells.length, `Count all the squares: ${b(cells.length)}.`);
  }),
  R(/^Select figures with a given area$/, () => () => {
    const A = pick([8, 10, 12, 15, 16, 18, 20, 24]), dims = [[A, 1], ...range(2, 6).map(d => [d, A / d]).filter(d => Number.isInteger(d[1]))].filter(d => d[0] <= 12 && d[1] <= 12 && d[1] >= 1);
    const good = pick(dims.length ? dims : [[A, 1]]), bad = [[good[0] + 1, good[1]], [good[0], good[1] + 1], [good[0] + 2, good[1] + 1]].filter(d => d[0] * d[1] !== A);
    return mc(`Which rectangle has an area of ${b(A + ' square units')}?`, `${good[0]} by ${good[1]}`, bad.map(d => `${d[0]} by ${d[1]}`), `${good[0]} × ${good[1]} = ${b(A)}.`, 4);
  }),
  R(/^Select two figures with the same area$|^Create figures with a given area$|^Create rectangles with a given area$/, (mt, ctx) => () => {
    const A = pick([12, 16, 18, 24, 20, 30, 36]), facs = range(1, 12).filter(d => A % d === 0 && A / d <= 12), f = pick(facs);
    const bad = [[f + 1, A / f], [f, A / f + 1], [f + 2, A / f + 1]].filter(d => d[0] * d[1] !== A);
    return mc(`Which pair of side lengths makes a rectangle with an area of ${b(A + ' square units')}?`, `${f} and ${A / f}`, bad.map(d => `${d[0]} and ${d[1]}`), `${f} × ${A / f} = ${b(A)}.`, 4);
  }),
  R(/^Find the area of rectangles and squares$|^Area of squares and rectangles$|^Find the area or missing side length of a rectangle$/, (mt, ctx) => () => {
    const l = ri(3, 15), w = ri(2, 12), missing = /missing/.test(ctx.title) && Math.random() < 0.5;
    if (missing) return num(`${rectLabeled(l, w, { unknown: 'w', unit: 'cm' })}The area is ${b(l * w + ' cm²')} and the length is ${b(l + ' cm')}. What is the width? (cm)`, w, `${l * w} ÷ ${l} = ${b(w)} cm.`);
    return num(`${rectLabeled(l, w)}What is the area of the rectangle? (cm²)`, l * w, `Area = length × width = ${l} × ${w} = ${b(l * w)} cm².`);
  }),
  R(/^Find the missing side length of a rectangle with a given area$/, () => () => {
    const l = ri(3, 12), w = ri(2, 10);
    return num(`A rectangle has an area of ${b(l * w + ' square units')} and a length of ${b(l)} units. What is its width? (units)`, w, `${l * w} ÷ ${l} = ${b(w)}.`);
  }),
  R(/^Find the area of complex figures(?: by dividing them into rectangles)?$|^Find the areas of complex figures$/, () => () => {
    const W = ri(5, 10), H = ri(4, 8), w = ri(1, W - 2), h = ri(1, H - 2);
    return num(`${lShapeLabeled(W, H, w, h)}All angles are right angles. What is the area of the figure? (square units)`, W * H - w * h, `Big rectangle ${W} × ${H} = ${W * H}, minus the missing corner ${w} × ${h} = ${w * h}: ${b(W * H - w * h)}.`);
  }),
  R(/^Understanding area of a parallelogram$/, () => () => {
    const bs = ri(3, 12), h = ri(2, 8);
    return num(`A parallelogram can be cut and rearranged into a rectangle with the same base and height. The base is ${b(bs)} and the height is ${b(h)}. What is the area of the rectangle (and parallelogram)?`, bs * h, `${bs} × ${h} = ${b(bs * h)}.`);
  }),
  R(/^Area of parallelograms$/, () => () => {
    const bs = ri(3, 14), h = ri(2, 9), s = ri(h + 1, h + 5);
    const pic = geoSvg(`<polygon points="40,100 150,100 190,30 80,30" fill="#c7d2fe" stroke="${C.primary}" stroke-width="3"/><line x1="150" y1="100" x2="150" y2="30" stroke="${C.red}" stroke-width="2" stroke-dasharray="5 4"/><text x="95" y="116" font-size="13" text-anchor="middle" fill="${C.red}" font-weight="700">${bs} cm</text><text x="158" y="68" font-size="13" fill="${C.red}" font-weight="700">${h} cm</text><text x="45" y="62" font-size="12" fill="${C.ink}">${s} cm</text>`, 220, 125);
    return num(`${pic}What is the area of the parallelogram? (cm²)`, bs * h, `Area = base × height = ${bs} × ${h} = ${b(bs * h)} cm². (The slanted side is not used.)`);
  }),
  R(/^Understanding area of a triangle$/, () => () => {
    const bs = ri(3, 12) * 2, h = ri(2, 8);
    return num(`Two identical triangles with base ${b(bs)} and height ${b(h)} make a parallelogram with area ${bs * h}. What is the area of one triangle?`, (bs * h) / 2, `${bs * h} ÷ 2 = ${b((bs * h) / 2)}.`);
  }),
  R(/^Area of triangles$/, () => () => {
    const bs = ri(2, 10) * 2, h = ri(2, 12);
    const pic = geoSvg(`<polygon points="30,100 150,100 100,25" fill="#c7d2fe" stroke="${C.primary}" stroke-width="3"/><line x1="100" y1="100" x2="100" y2="25" stroke="${C.red}" stroke-width="2" stroke-dasharray="5 4"/><text x="90" y="116" font-size="13" text-anchor="middle" fill="${C.red}" font-weight="700">${bs} cm</text><text x="108" y="66" font-size="13" fill="${C.red}" font-weight="700">${h} cm</text>`, 180, 125);
    return num(`${pic}What is the area of the triangle? (cm²)`, (bs * h) / 2, `Area = ½ × base × height = ½ × ${bs} × ${h} = ${b((bs * h) / 2)} cm².`);
  }),

  /* ===== volume & surface area ===== */
  R(/^Volume$/, () => () => {
    const L = ri(2, 4), W = ri(2, 3), H = ri(1, 3);
    return num(`${isoBox(L, W, H)}Each cube is 1 cubic unit. What is the volume of this box? (cubic units)`, L * W * H, `${L} × ${W} × ${H} = ${b(L * W * H)} cubes.`);
  }),
  R(/^Volume of rectangular prisms made of unit cubes$/, () => () => {
    const L = ri(2, 5), W = ri(2, 4), H = ri(2, 4);
    return num(`${isoBox(L, W, H)}The prism is made of unit cubes: ${L} long, ${W} wide and ${H} high. What is the volume? (cubic units)`, L * W * H, `${L} × ${W} × ${H} = ${b(L * W * H)} cubic units.`);
  }),
  R(/^Volume of irregular figures made of unit cubes$/, () => () => {
    const L1 = ri(3, 5), W = ri(2, 3), H1 = ri(1, 2), L2 = ri(1, L1 - 1), H2 = ri(1, 2), v1 = L1 * W * H1, v2 = L2 * W * H2;
    return num(`A figure is made of two boxes stacked together. The bottom box is ${L1} × ${W} × ${H1} cubes and the box on top is ${L2} × ${W} × ${H2} cubes. What is the total volume? (cubic units)`, v1 + v2, `${v1} + ${v2} = ${b(v1 + v2)}.`);
  }),
  R(/^Volume of cubes and rectangular prisms$/, () => () => {
    if (Math.random() < 0.3) { const s = ri(2, 9); return num(`A cube has edges of ${b(s + ' cm')}. What is its volume? (cm³)`, s ** 3, `${s} × ${s} × ${s} = ${b(s ** 3)} cm³.`); }
    const l = ri(2, 12), w = ri(2, 10), h = ri(2, 9);
    return num(`A rectangular prism is ${b(l + ' cm')} long, ${b(w + ' cm')} wide and ${b(h + ' cm')} high. What is its volume? (cm³)`, l * w * h, `${l} × ${w} × ${h} = ${b(l * w * h)} cm³.`);
  }),
  R(/^Surface area of cubes and rectangular prisms$/, () => () => {
    if (Math.random() < 0.3) { const s = ri(2, 9); return num(`A cube has edges of ${b(s + ' cm')}. What is its surface area? (cm²)`, 6 * s * s, `6 faces × ${s} × ${s} = ${b(6 * s * s)} cm².`); }
    const l = ri(2, 10), w = ri(2, 8), h = ri(2, 7), sa = 2 * (l * w + l * h + w * h);
    return num(`A rectangular prism is ${b(l + ' cm')} long, ${b(w + ' cm')} wide and ${b(h + ' cm')} high. What is its surface area? (cm²)`, sa, `2 × (${l}×${w} + ${l}×${h} + ${w}×${h}) = ${b(sa)} cm².`);
  }),

  /* ===== coordinate plane ===== */
  R(/^Objects on a coordinate plane(?:: all four quadrants)?$/, (mt, ctx) => () => {
    const four = /four quadrants/.test(ctx.title), lo = four ? -6 : 0, hi = four ? 6 : 10, ps = [];
    const labs = ['A', 'B', 'C', 'D'];
    while (ps.length < 4) { const p = { x: ri(four ? -5 : 1, hi - 1), y: ri(four ? -5 : 1, hi - 1) }; if (!ps.some(q => q.x === p.x && q.y === p.y) && !(four && (p.x === 0 || p.y === 0))) ps.push(p); }
    const k = ri(0, 3), pts = ps.map((p, i) => ({ ...p, label: labs[i] }));
    const ans = pt(ps[k].x, ps[k].y), alts = [pt(ps[k].y, ps[k].x), pt(ps[k].x + 1, ps[k].y), pt(ps[k].x, ps[k].y - 1)];
    return mc(`${plane({ min: lo, max: hi, points: pts, labelEvery: four ? 2 : 1, step: 1 })}What are the coordinates of point ${b(labs[k])}?`, ans, alts, `Go ${b(fmt(ps[k].x))} across and ${b(fmt(ps[k].y))} up: ${b(ans)}.`);
  }),
  R(/^Graph points on a coordinate plane(?:: all four quadrants)?$/, (mt, ctx) => () => {
    const four = /four quadrants/.test(ctx.title), lo = four ? -6 : 0, hi = four ? 6 : 10, ps = [], labs = ['A', 'B', 'C', 'D'];
    while (ps.length < 4) { const p = { x: ri(four ? -5 : 1, hi - 1), y: ri(four ? -5 : 1, hi - 1) }; if (!ps.some(q => q.x === p.x || q.y === p.y) && !(four && (p.x === 0 || p.y === 0))) ps.push(p); }
    const k = ri(0, 3);
    return mc(`${plane({ min: lo, max: hi, points: ps.map((p, i) => ({ ...p, label: labs[i] })), labelEvery: four ? 2 : 1 })}Which point is at ${b(pt(ps[k].x, ps[k].y))}?`, labs[k], labs.filter((_, i) => i !== k), `Point ${b(labs[k])} is at ${pt(ps[k].x, ps[k].y)}.`, 4);
  }),
  R(/^Coordinate planes as maps$/, () => () => {
    const places = sample(PLACES, 4), ps = [];
    while (ps.length < 4) { const p = { x: ri(1, 9), y: ri(1, 9) }; if (!ps.some(q => q.x === p.x && q.y === p.y)) ps.push(p); }
    const k = ri(0, 3), pts = ps.map((p, i) => ({ ...p, label: places[i][0], color: C.primary }));
    return Math.random() < 0.5
      ? mc(`${plane({ min: 0, max: 10, points: pts })}What is at ${b(pt(ps[k].x, ps[k].y))} on the map?`, places[k][1], places.filter((_, i) => i !== k).map(p => p[1]), `The ${places[k][1]} ${places[k][0]} is at ${pt(ps[k].x, ps[k].y)}.`, 4)
      : mc(`${plane({ min: 0, max: 10, points: pts })}Where is the ${b(places[k][1])} ${places[k][0]}?`, pt(ps[k].x, ps[k].y), ps.filter((_, i) => i !== k).map(p => pt(p.x, p.y)), `Read across, then up: ${b(pt(ps[k].x, ps[k].y))}.`, 4);
  }),
  R(/^Follow directions on a coordinate plane$/, () => () => {
    const x = ri(1, 6), y = ri(1, 6), r = ri(1, 3), u = ri(1, 3), dirR = Math.random() < 0.5, dirU = Math.random() < 0.5, nx = x + (dirR ? r : -r), ny = y + (dirU ? u : -u);
    if (nx < 0 || ny < 0) return null;
    return mc(`${plane({ min: 0, max: 10, points: [{ x, y, label: 'Start', color: C.blue }] })}Start at ${b(pt(x, y))}. Move ${b(r)} ${dirR ? 'right' : 'left'} and ${b(u)} ${dirU ? 'up' : 'down'}. Where do you end up?`, pt(nx, ny), [pt(nx, y), pt(x, ny), pt(ny, nx)].filter(v => v !== pt(nx, ny)), `Right/left changes x; up/down changes y: ${b(pt(nx, ny))}.`);
  }),
  R(/^Describe the coordinate plane$/, () => () => {
    const q = pick([['Which axis is horizontal (goes left to right)?', 'x-axis', ['y-axis']], ['Which axis is vertical (goes up and down)?', 'y-axis', ['x-axis']], ['The point (0, 0) is called the…', 'origin', ['axis', 'quadrant']], ['In an ordered pair (3, 5), which number is the x-coordinate?', '3', ['5']], ['In an ordered pair (3, 5), which number tells you how far up to go?', '5', ['3']]]);
    return mc(q[0], q[1], q[2], `${b(q[1])}.`, 3);
  }),
  R(/^Quadrants$/, () => () => {
    const x = pick([-1, 1]) * ri(1, 9), y = pick([-1, 1]) * ri(1, 9), ans = quadrant(x, y);
    return mc(`In which quadrant is the point ${b(pt(x, y))}?`, ans, ['I', 'II', 'III', 'IV'].filter(q => q !== ans), `x is ${x > 0 ? 'positive' : 'negative'} and y is ${y > 0 ? 'positive' : 'negative'}: quadrant ${b(ans)}.`, 4);
  }),
  R(/^Graph points from a table$/, () => () => {
    const k = ri(1, 4), xs = sample([1, 2, 3, 4, 5, 6], 3).sort((a, c) => a - c), ys = xs.map(x => x + k), labs = ['A', 'B', 'C'], i = ri(0, 2);
    return mc(`${table(['x', 'y'], xs.map((x, j) => [x, ys[j]]))}${plane({ min: 0, max: 10, points: xs.map((x, j) => ({ x, y: ys[j], label: labs[j] })) })}Which point matches the row ${b(`x = ${xs[i]}, y = ${ys[i]}`)}?`, labs[i], labs.filter((_, j) => j !== i), `Go ${xs[i]} across and ${ys[i]} up: point ${b(labs[i])}.`, 3);
  }),
  R(/^Use a rule to complete a table and a graph$/, () => () => {
    const mul = Math.random() < 0.5, k = mul ? ri(2, 4) : ri(1, 5), xs = [1, 2, 3, 4], ys = xs.map(x => (mul ? x * k : x + k)), i = ri(1, 3);
    return num(`Rule: ${b(mul ? `y = ${k} × x` : `y = x + ${k}`)}<br>${table(['x', 'y'], xs.map((x, j) => [x, j === i ? '?' : ys[j]]))}What is the missing y-value?`, ys[i], `${mul ? `${k} × ${xs[i]}` : `${xs[i]} + ${k}`} = ${b(ys[i])}.`);
  }),
  R(/^Analyze graphed relationships$/, () => () => {
    const mul = Math.random() < 0.5, k = mul ? ri(2, 3) : ri(1, 4), xs = [1, 2, 3, 4], pts = xs.map(x => ({ x, y: mul ? x * k : x + k, color: C.primary })), rule = mul ? `y = ${k} × x` : `y = x + ${k}`;
    const alts = mul ? [`y = x + ${k}`, `y = x + ${k + 1}`, `y = ${k + 1} × x`] : [`y = ${k} × x`, `y = x + ${k + 1}`, `y = x − ${k}`];
    return mc(`${plane({ min: 0, max: 14, points: pts, labelEvery: 2 })}Which rule describes the points on the graph?`, rule, alts, `Check a point: when x = ${xs[1]}, y = ${pts[1].y}. That fits ${b(rule)}.`);
  }),
  R(/^Transformations on the coordinate plane$/, () => () => {
    const x = ri(1, 6), y = ri(1, 6), t = pick(['reflectY', 'reflectX', 'translate']);
    if (t === 'reflectY') return mc(`The point ${b(pt(x, y))} is reflected across the ${b('y-axis')}. What are its new coordinates?`, pt(-x, y), [pt(x, -y), pt(-x, -y), pt(y, x)], `Reflecting across the y-axis changes the sign of x: ${b(pt(-x, y))}.`);
    if (t === 'reflectX') return mc(`The point ${b(pt(x, y))} is reflected across the ${b('x-axis')}. What are its new coordinates?`, pt(x, -y), [pt(-x, y), pt(-x, -y), pt(y, x)], `Reflecting across the x-axis changes the sign of y: ${b(pt(x, -y))}.`);
    const dx = ri(-4, 4), dy = ri(-4, 4); if (!dx && !dy) return null;
    return mc(`The point ${b(pt(x, y))} is translated ${b(`${Math.abs(dx)} ${dx >= 0 ? 'right' : 'left'} and ${Math.abs(dy)} ${dy >= 0 ? 'up' : 'down'}`)}. What are its new coordinates?`, pt(x + dx, y + dy), [pt(x + dy, y + dx), pt(x - dx, y + dy), pt(x + dx, y - dy)].filter(v => v !== pt(x + dx, y + dy)), `Add ${dx} to x and ${dy} to y: ${b(pt(x + dx, y + dy))}.`);
  })
];
export { gridFigure, rectCells, lShape, perimeterOfCells, rectLabeled, isoBox, quadrant };
