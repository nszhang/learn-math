/* ============================================================
   Generated replacements for skills whose old generator only had a
   handful of fixed questions. Pictures, numbers and wording are drawn at
   random so a student meets new questions instead of memorising answers.
   These rules are tried before every other rule file.
   ============================================================ */
import { ri, pick, shuffle, sample, range, uniq, m, b, fmt, fix, num, mc, yesNo, svg, C, words, cap } from '../h.js';
import { R } from '../engine.js';

const upTo = (t, d = 10) => { const r = t.match(/up to (\d+)/); return r ? +r[1] : d; };
const FILLS = ['#c7d2fe', '#fde68a', '#bbf7d0', '#fecaca', '#bae6fd', '#e9d5ff', '#fed7aa'];
const INKS = [C.primary, '#0f766e', '#b45309', '#be123c', '#1d4ed8', '#7c3aed'];
const OBJ = ['🍎', '🐞', '⭐', '🐟', '🌼', '🚗', '🎈', '🐤', '🍓', '🦋', '🧁', '⚽', '🐢', '🍪', '🐸', '🌸'];
const LETTERS = 'ABCD';
const plural = w => (/^pair of /.test(w) ? w.replace('pair', 'pairs') : /x$/.test(w) ? w + 'es' : w + 's');
const deg = d => (d * Math.PI) / 180;
const rot = ([x, y], a, cx, cy) => { const c = Math.cos(deg(a)), s = Math.sin(deg(a)); return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c]; };
const ptsStr = pts => pts.map(p => p.map(v => Math.round(v * 10) / 10).join(',')).join(' ');
const polyEl = (pts, fill, ink) => `<polygon points="${ptsStr(pts)}" fill="${fill}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
const pics = list => `<div style="display:flex;gap:16px;flex-wrap:wrap;align-items:flex-end">${list.map((h, i) => `<div style="text-align:center"><b>${LETTERS[i]}</b>${h}</div>`).join('')}</div>`;
/** Multiple choice between pictures A–D; `correct` is the index of the right picture. */
const pickPic = (prompt, list, correct, explain) => { const order = shuffle(list.map((h, i) => [h, i])), L = LETTERS[order.findIndex(o => o[1] === correct)]; return mc(`${prompt}${pics(order.map(o => o[0]))}`, L, LETTERS.slice(0, list.length).split('').filter(x => x !== L), explain(L), list.length); };

/* ---------- random 2-D shapes ---------- */
function shapePts(name, cx = 60, cy = 60, r = 46) {
  const a = ri(0, 359);
  const reg = (n, rr = r, start = -90) => range(0, n - 1).map(i => [cx + rr * Math.cos(deg(start + (360 * i) / n)), cy + rr * Math.sin(deg(start + (360 * i) / n))]);
  let p;
  switch (name) {
    case 'triangle': { const t = [ri(-90, -60), ri(10, 60), ri(120, 170)]; p = t.map(x => [cx + r * Math.cos(deg(x)), cy + r * Math.sin(deg(x))]); break; }
    case 'square': p = reg(4, r * ri(70, 100) / 100, 45); break;
    case 'rectangle': { const w = ri(70, 92), h = ri(30, 50); p = [[cx - w / 2, cy - h / 2], [cx + w / 2, cy - h / 2], [cx + w / 2, cy + h / 2], [cx - w / 2, cy + h / 2]]; break; }
    case 'rhombus': { const w = ri(30, 46), h = ri(42, 52); if (w === h) return shapePts(name, cx, cy, r); p = [[cx, cy - h], [cx + w, cy], [cx, cy + h], [cx - w, cy]]; break; }
    case 'trapezoid': { const top = ri(18, 34), bot = ri(42, 52), h = ri(28, 40); p = [[cx - top, cy - h], [cx + top, cy - h], [cx + bot, cy + h], [cx - bot, cy + h]]; break; }
    case 'parallelogram': { const w = ri(30, 40), h = ri(24, 34), s = ri(12, 22); p = [[cx - w + s, cy - h], [cx + w + s, cy - h], [cx + w - s, cy + h], [cx - w - s, cy + h]]; break; }
    case 'pentagon': p = reg(5); break; case 'hexagon': p = reg(6); break; case 'heptagon': p = reg(7); break; case 'octagon': p = reg(8); break;
    default: p = reg(4);
  }
  return name === 'square' || name === 'pentagon' || name === 'hexagon' || name === 'octagon' || name === 'heptagon' ? p.map(q => rot(q, ri(0, 3) * 15, cx, cy)) : p.map(q => rot(q, pick([0, 0, a % 40 - 20, 180]), cx, cy));
}
const shapeSvgR = (name, size = 110) => {
  const fill = pick(FILLS), ink = pick(INKS);
  if (name === 'circle') return svg(size, size, `<circle cx="${size / 2}" cy="${size / 2}" r="${ri(30, 46) * size / 120}" fill="${fill}" stroke="${ink}" stroke-width="3"/>`, 'aria-label="shape"');
  if (name === 'oval') return svg(size, size, `<ellipse cx="${size / 2}" cy="${size / 2}" rx="${ri(40, 50) * size / 120}" ry="${ri(22, 32) * size / 120}" fill="${fill}" stroke="${ink}" stroke-width="3" transform="rotate(${ri(-30, 30)} ${size / 2} ${size / 2})"/>`, 'aria-label="shape"');
  const s = size / 120;
  return svg(size, size, `<g transform="scale(${s})">${polyEl(shapePts(name), fill, ink)}</g>`, 'aria-label="shape"');
};
const SIDES = { triangle: 3, square: 4, rectangle: 4, rhombus: 4, trapezoid: 4, parallelogram: 4, pentagon: 5, hexagon: 6, heptagon: 7, octagon: 8, circle: 0, oval: 0 };
const shapePool = (grade, title = '') => (/Circles, squares and triangles/.test(title) ? ['circle', 'square', 'triangle'] : /Squares and rectangles/.test(title) ? ['square', 'rectangle'] : grade <= 0 ? ['circle', 'square', 'triangle', 'rectangle', 'hexagon'] : grade === 1 ? ['circle', 'triangle', 'square', 'rectangle', 'hexagon', 'trapezoid', 'rhombus'] : ['circle', 'triangle', 'square', 'rectangle', 'pentagon', 'hexagon', 'octagon', 'rhombus', 'trapezoid', 'parallelogram']);
const WHY_SHAPE = { triangle: 'it has 3 straight sides and 3 vertices', square: 'it has 4 equal sides and 4 square corners', rectangle: 'it has 4 sides with square corners, and opposite sides are equal', rhombus: 'it has 4 equal sides but no square corners', trapezoid: 'it has 4 sides with exactly one pair of parallel sides', parallelogram: 'it has 2 pairs of parallel sides', pentagon: 'it has 5 sides', hexagon: 'it has 6 sides', heptagon: 'it has 7 sides', octagon: 'it has 8 sides', circle: 'it is round with no straight sides or vertices', oval: 'it is a stretched circle' };

/* ---------- counters scattered on a picture / ten frame ---------- */
function scatter(n, { emoji = null } = {}) {
  const W = 220, H = 110, used = []; let inner = `<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>`;
  const col = pick(INKS);
  for (let i = 0; i < n; i++) {
    let x, y, t = 0; do { x = ri(22, W - 22); y = ri(22, H - 22); t++; } while (t < 200 && used.some(([u, v]) => Math.hypot(u - x, v - y) < 34));
    used.push([x, y]);
    inner += emoji ? `<text x="${x}" y="${y + 9}" font-size="26" text-anchor="middle">${emoji}</text>` : `<circle cx="${x}" cy="${y}" r="${ri(10, 13)}" fill="${col}"/>`;
  }
  return svg(W, H, inner, 'aria-label="picture to count"');
}
function frameR(n, total = 10) {
  const cells = total, cols = 5, rows = Math.ceil(cells / cols), S = 36, col = pick(INKS);
  const filled = new Set(Math.random() < 0.5 ? range(0, n - 1) : sample(range(0, cells - 1), n));
  let inner = '';
  for (let i = 0; i < cells; i++) { const x = 4 + (i % cols) * S, y = 4 + Math.floor(i / cols) * S; inner += `<rect x="${x}" y="${y}" width="${S}" height="${S}" fill="#fff" stroke="#64748b" stroke-width="2"/>`; if (filled.has(i)) inner += `<circle cx="${x + S / 2}" cy="${y + S / 2}" r="12" fill="${col}"/>`; }
  return svg(cols * S + 8, rows * S + 8, inner, 'aria-label="ten frame"');
}

/* ---------- Canadian coins (pictures, no printed value) ---------- */
const COIN = { 5: ['nickel', '🦫', '#cbd5e1', 40], 10: ['dime', '⛵', '#e2e8f0', 34], 25: ['quarter', '🦌', '#d1d5db', 44], 100: ['loonie', '🦆', '#fcd34d', 48], 200: ['toonie', '🐻‍❄️', '#fbbf24', 52] };
const coinPic = v => { const [, e, col, s] = COIN[v]; const ring = v === 200 ? 'box-shadow:inset 0 0 0 7px #cbd5e1;' : ''; return `<span title="" style="display:inline-flex;align-items:center;justify-content:center;width:${s}px;height:${s}px;border-radius:50%;background:${col};${ring}border:2px solid #64748b;font-size:${Math.round(s / 2.3)}px;margin:2px">${e}</span>`; };
const cents = c => (c >= 100 ? '$' + (c / 100).toFixed(2) : c + '¢');
const coinName = v => COIN[v][0];

/* ---------- transformations: a random asymmetric glyph ---------- */
const GLYPHS = [
  [[0, 0], [30, 0], [30, 10], [10, 10], [10, 22], [24, 22], [24, 32], [10, 32], [10, 50], [0, 50]],          // F
  [[0, 0], [10, 0], [10, 40], [30, 40], [30, 50], [0, 50]],                                                   // L
  [[0, 0], [28, 10], [10, 18], [10, 50], [0, 50]],                                                           // flag
  [[0, 20], [20, 20], [20, 6], [42, 28], [20, 50], [20, 36], [0, 36]],                                        // arrow
  [[0, 0], [34, 0], [34, 12], [14, 12], [14, 50], [0, 50]]                                                    // Γ
];
function tfPicture(kind) {
  const glyph = pick(GLYPHS), fillA = pick(FILLS), inkA = pick(INKS), ox = ri(30, 50), oy = ri(30, 50);
  const ctr = glyph.reduce((a, [x, y]) => [a[0] + x / glyph.length, a[1] + y / glyph.length], [0, 0]);
  const at = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy]);
  const A = at(glyph, ox, oy); let B;
  const shift = ri(70, 110), vshift = ri(-15, 15);
  if (kind === 'slide') B = at(glyph, ox + shift, oy + vshift);
  else if (kind === 'flip') { const vert = Math.random() < 0.6; B = vert ? glyph.map(([x, y]) => [2 * ctr[0] - x + ox + shift, y + oy]) : glyph.map(([x, y]) => [x + ox + shift, 2 * ctr[1] - y + oy]); }
  else { const a = pick([90, 180, 270]); B = glyph.map(p => rot(p, a, ctr[0], ctr[1])).map(([x, y]) => [x + ox + shift, y + oy]); }
  return svg(230, 130, polyEl(A, fillA, inkA) + polyEl(B, '#fde68a', '#b45309'), 'aria-label="transformation"');
}

/* ---------- lines, rays, segments ---------- */
function linePic(kind) {
  const a = ri(-35, 35), L = ri(60, 85), cx = 110, cy = 55, dx = L * Math.cos(deg(a)), dy = L * Math.sin(deg(a)), ink = pick(INKS);
  const P = [cx - dx, cy - dy], Q = [cx + dx, cy + dy];
  const dot = ([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${ink}"/>`;
  const head = ([x, y], dir) => { const ang = Math.atan2(dir[1], dir[0]), s = 10; return `<polygon points="${x + s * Math.cos(ang)},${y + s * Math.sin(ang)} ${x + s * Math.cos(ang + 2.5)},${y + s * Math.sin(ang + 2.5)} ${x + s * Math.cos(ang - 2.5)},${y + s * Math.sin(ang - 2.5)}" fill="${ink}"/>`; };
  const seg = `<line x1="${P[0]}" y1="${P[1]}" x2="${Q[0]}" y2="${Q[1]}" stroke="${ink}" stroke-width="3"/>`;
  const [l1, l2] = sample(['A', 'B', 'C', 'D', 'P', 'Q', 'R', 'S', 'M', 'N', 'X', 'Y'], 2);
  const lab = ([x, y], t) => `<text x="${x}" y="${y - 10}" font-size="14" font-weight="700" text-anchor="middle" fill="${C.ink}">${t}</text>`;
  let inner;
  if (kind === 'point') { const p = [ri(60, 160), ri(30, 80)]; return { html: svg(220, 110, dot(p) + lab(p, l1)), name: l1 }; }
  if (kind === 'line segment') inner = seg + dot(P) + dot(Q) + lab(P, l1) + lab(Q, l2);
  else if (kind === 'ray') inner = seg + dot(P) + head(Q, [dx, dy]) + lab(P, l1) + lab([(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], l2) + dot([(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]);
  else inner = seg + head(Q, [dx, dy]) + head(P, [-dx, -dy]) + dot([cx - dx / 2, cy - dy / 2]) + dot([cx + dx / 3, cy + dy / 3]) + lab([cx - dx / 2, cy - dy / 2], l1) + lab([cx + dx / 3, cy + dy / 3], l2);
  return { html: svg(220, 110, inner, `aria-label="${kind}"`), name: kind === 'line segment' ? `segment ${l1}${l2}` : kind === 'ray' ? `ray ${l1}${l2}` : `line ${l1}${l2}` };
}

/* ---------- nets ---------- */
// all 11 nets of a cube and some hexominoes that do not fold into a cube (checked by rolling a cube over each net)
const CUBE_NETS = [[[1,1],[2,1],[0,1],[1,2],[1,0],[3,1]],[[1,1],[2,1],[0,1],[1,2],[3,1],[2,0]],[[1,1],[2,1],[0,1],[1,2],[3,1],[0,0]],[[1,1],[2,1],[0,1],[1,2],[3,1],[3,0]],[[1,1],[2,1],[0,1],[1,2],[2,0],[1,3]],[[1,1],[2,1],[0,1],[1,2],[2,0],[3,0]],[[1,0],[2,0],[0,0],[1,1],[1,2],[1,3]],[[1,1],[2,1],[0,1],[3,1],[0,2],[3,0]],[[1,1],[2,1],[0,1],[2,2],[0,0],[3,2]],[[1,0],[2,0],[0,0],[2,1],[3,1],[4,1]],[[1,1],[2,1],[1,2],[2,0],[0,2],[3,0]]];
const NOT_CUBE = [[[1,1],[2,1],[0,1],[1,2],[1,0],[2,2]],[[1,0],[2,0],[0,0],[1,1],[3,0],[2,1]],[[2,0],[3,0],[1,0],[2,1],[4,0],[0,0]],[[1,0],[2,0],[0,0],[1,1],[3,0],[0,1]],[[1,0],[2,0],[0,0],[1,1],[3,0],[1,2]],[[1,0],[2,0],[0,0],[1,1],[3,0],[4,0]],[[1,0],[2,0],[0,0],[1,1],[3,0],[3,1]],[[1,1],[2,1],[0,1],[1,2],[2,2],[2,0]],[[1,0],[2,0],[0,0],[1,1],[2,1],[0,1]],[[1,0],[2,0],[0,0],[1,1],[2,1],[3,1]]];
function gridNet(cells, U = 30) {
  const tf = pick(['', 'flipx', 'flipy', 'rot']), maxX = Math.max(...cells.map(c => c[0])), maxY = Math.max(...cells.map(c => c[1]));
  const cs = cells.map(([x, y]) => (tf === 'flipx' ? [maxX - x, y] : tf === 'flipy' ? [x, maxY - y] : tf === 'rot' ? [maxY - y, x] : [x, y]));
  const W = Math.max(...cs.map(c => c[0])) + 1, H = Math.max(...cs.map(c => c[1])) + 1, fill = pick(FILLS);
  return svg(W * U + 10, H * U + 10, cs.map(([x, y]) => `<rect x="${x * U + 5}" y="${y * U + 5}" width="${U}" height="${U}" fill="${fill}" stroke="${C.ink}" stroke-width="2"/>`).join(''), 'aria-label="net"');
}
function prismNet(kind, U = 30) {   // rectangular / triangular prism, square / triangular pyramid
  const fill = pick(FILLS), S = `fill="${fill}" stroke="${C.ink}" stroke-width="2"`, r = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${S}/>`, t = pts => `<polygon points="${ptsStr(pts)}" ${S}/>`;
  if (kind === 'rectangular prism') { const w = U * pick([1.4, 1.6, 2]), h = U, d = U * pick([0.7, 1]); return svg(2 * w + 2 * d + 10, 2 * d + h + 10, r(5 + d, 5, w, d) + r(5, 5 + d, d, h) + r(5 + d, 5 + d, w, h) + r(5 + d + w, 5 + d, d, h) + r(5 + 2 * d + w, 5 + d, w, h) + r(5 + d, 5 + d + h, w, d), 'aria-label="net"'); }
  if (kind === 'triangular prism') { const w = U * pick([1, 1.3]), n = 3, h = U * pick([1.6, 2]); let s = ''; for (let i = 0; i < n; i++) s += r(5 + i * w, 5 + U, w, h); s += t([[5 + w, 5 + U], [5 + 2 * w, 5 + U], [5 + 1.5 * w, 5 + U - w * 0.87]]) + t([[5 + w, 5 + U + h], [5 + 2 * w, 5 + U + h], [5 + 1.5 * w, 5 + U + h + w * 0.87]]); return svg(3 * w + 10, h + 2 * U + 20, s, 'aria-label="net"'); }
  if (kind === 'square pyramid') { const a = U * 1.3, h = U * pick([1, 1.3]), x = 5 + h, y = 5 + h; return svg(a + 2 * h + 10, a + 2 * h + 10, r(x, y, a, a) + t([[x, y], [x + a, y], [x + a / 2, y - h]]) + t([[x, y + a], [x + a, y + a], [x + a / 2, y + a + h]]) + t([[x, y], [x, y + a], [x - h, y + a / 2]]) + t([[x + a, y], [x + a, y + a], [x + a + h, y + a / 2]]), 'aria-label="net"'); }
  if (kind === 'triangular pyramid') { const a = U * 1.7, hh = a * 0.866, A = [5 + a, 5], B = [5, 5 + 2 * hh], Cc = [5 + 2 * a, 5 + 2 * hh], ab = [5 + a / 2, 5 + hh], ac = [5 + 1.5 * a, 5 + hh], bc = [5 + a, 5 + 2 * hh]; return svg(2 * a + 10, 2 * hh + 10, t([A, ab, ac]) + t([ab, B, bc]) + t([ac, bc, Cc]) + t([ab, bc, ac]), 'aria-label="net"'); }
  if (kind === 'pentagonal prism' || kind === 'hexagonal prism') { const n = kind[0] === 'p' ? 5 : 6, w = U * 0.9, h = U * 1.6; let s = ''; for (let i = 0; i < n; i++) s += r(5 + i * w, 5 + U * 1.4, w, h); const poly = (cx, cy, rr) => t(range(0, n - 1).map(i => [cx + rr * Math.cos(deg(-90 + (360 * i) / n)), cy + rr * Math.sin(deg(-90 + (360 * i) / n))])); s += poly(5 + 1.5 * w, 5 + U * 0.7, w * 0.85) + poly(5 + 1.5 * w, 5 + U * 1.4 + h + U * 0.7, w * 0.85); return svg(n * w + 10, h + U * 2.8 + 10, s, 'aria-label="net"'); }
  return gridNet(pick(CUBE_NETS));
}

/* ---------- 3-D descriptions ---------- */
const SOLID_FACTS = [
  ['cube', ['It has 6 square faces.', 'It has 12 edges and 8 vertices, and every face is a square.', 'A dice is shaped like this.', 'All of its faces are the same size square.']],
  ['rectangular prism', ['It has 6 faces that are rectangles.', 'A cereal box is shaped like this.', 'It has 12 edges and 8 vertices, and its faces are not all squares.', 'A brick is shaped like this.']],
  ['sphere', ['It is round all over and has no flat faces.', 'It has no edges and no vertices and can roll in any direction.', 'A ball is shaped like this.', 'Every point on it is the same distance from its centre.']],
  ['cylinder', ['It has 2 flat circle faces and 1 curved surface.', 'A soup can is shaped like this.', 'It can roll, and it can also stand on a flat end.', 'It has 2 curved edges and no vertices.']],
  ['cone', ['It has 1 flat circle face and comes to a point.', 'An ice cream cone is shaped like this.', 'It has 1 vertex (a point) and 1 curved surface.', 'A party hat is shaped like this.']],
  ['square pyramid', ['It has a square base and 4 triangle faces.', 'It has 5 faces and 5 vertices.', 'Its faces meet at one point at the top above a square.']],
  ['triangular prism', ['It has 2 triangle faces and 3 rectangle faces.', 'A tent is often shaped like this.', 'It has 5 faces, 9 edges and 6 vertices.']]
];

/* ---------- logic statements (geometry reasoning) ---------- */
const CONDS = [
  ['a polygon has exactly three sides', 'it is a triangle', true], ['a number is divisible by 4', 'it is even', true], ['an angle measures 90°', 'it is a right angle', true],
  ['a quadrilateral is a square', 'it is a rectangle', true], ['two lines are perpendicular', 'they intersect', true], ['a number is prime', 'it is odd', false],
  ['a shape has four sides', 'it is a square', false], ['two angles are supplementary', 'they are both right angles', false], ['an animal is a dog', 'it is a mammal', true],
  ['it is raining', 'the ground is wet', true], ['a triangle is equilateral', 'it is isosceles', true], ['a number ends in 0', 'it is divisible by 5', true],
  ['a number is a multiple of 6', 'it is a multiple of 3', true], ['a quadrilateral has four right angles', 'it is a square', false], ['x² = 9', 'x = 3', false],
  ['two angles are vertical angles', 'they are congruent', true], ['a figure is a rhombus', 'its diagonals are perpendicular', true], ['n is an integer', 'n is a whole number', false],
  ['a month has 31 days', 'it is July', false], ['a polygon is a regular hexagon', 'each interior angle measures 120°', true]
];
const COUNTER = [
  ['All prime numbers are odd.', '2', ['3', '9', '15'], '2 is prime but even.'], ['Every quadrilateral with four equal sides is a square.', 'a rhombus with no right angles', ['a square', 'a rectangle with unequal sides', 'a regular hexagon'], 'A rhombus has four equal sides but need not have right angles.'],
  ['If a number is divisible by 2, it is divisible by 4.', '6', ['8', '12', '16'], '6 is divisible by 2 but not 4.'], ['The square of a number is always greater than the number.', '0.5', ['3', '10', '−4'], '0.5² = 0.25, which is less than 0.5.'],
  ['All rectangles are squares.', 'a 2 cm by 5 cm rectangle', ['a 3 cm by 3 cm rectangle', 'a square', 'a circle'], 'It has unequal sides, so it is not a square.'], ['The sum of two odd numbers is odd.', '3 + 5', ['2 + 4', '3 + 4', '1 + 2'], '3 + 5 = 8, which is even.'],
  ['If two angles are supplementary, they are both obtuse.', '100° and 80°', ['30° and 60°', '45° and 45°', '20° and 70°'], '100° + 80° = 180°, but 80° is acute.'],
  ['Every multiple of 3 is odd.', '12', ['9', '15', '21'], '12 is a multiple of 3 and even.'], ['Dividing a number always makes it smaller.', 'dividing 8 by 0.5', ['dividing 8 by 2', 'dividing 10 by 5', 'dividing 9 by 3'], '8 ÷ 0.5 = 16, which is bigger.'],
  ['All triangles have a right angle.', 'an equilateral triangle', ['a 3-4-5 triangle', 'an isosceles right triangle', 'a 5-12-13 triangle'], 'Each angle of an equilateral triangle is 60°.'],
  ['If x² > 4, then x > 2.', 'x = −3', ['x = 3', 'x = 5', 'x = 2.5'], '(−3)² = 9 > 4 but −3 is not greater than 2.'], ['The product of two numbers is always larger than either number.', '0.5 × 4', ['3 × 4', '2 × 7', '5 × 5'], '0.5 × 4 = 2, which is less than 4.']
];

export const VARIETY_RULES = [
  /* ===== Kindergarten numbers ===== */
  R(/^Choose the number that you hear(?: - up to \d+)?$/, (mt, ctx) => () => {
    const lim = upTo(ctx.title, 10), n = ri(1, lim), ask = pick(['Listen. Which number do you hear?', 'Tap the number you hear.', 'Which number did you hear?', 'Listen and choose the number.']);
    const wrong = shuffle(range(0, Math.max(lim, 5)).filter(x => x !== n)).slice(0, 3).map(String);
    return { ...mc(ask, String(n), wrong, `You heard ${b(words(n))}, which is written ${b(n)}.`, 4), say: words(n), lang: 'en-US', listen: true };
  }),
  R(/^Identify numbers(?: - up to \d+)?$/, (mt, ctx) => () => {
    const lim = upTo(ctx.title, 10), n = ri(1, lim), kind = ri(0, 2), e = pick(OBJ);
    if (kind === 0) return mc(`Which number is ${b(words(n))}?`, String(n), shuffle(range(0, Math.max(lim, 5)).filter(x => x !== n)).slice(0, 3).map(String), `${cap(words(n))} is written ${b(n)}.`, 4);
    if (kind === 1) return mc(`${scatter(n, { emoji: e })}Which number tells how many ${e} there are?`, String(n), shuffle(range(1, Math.max(lim, 5)).filter(x => x !== n)).slice(0, 3).map(String), `There are ${b(n)}.`, 4);
    const opts = uniq([n, ...shuffle(range(1, Math.max(lim, 4)).filter(x => x !== n))]).slice(0, 3);
    return pickPic(`Which picture shows ${b(n)}?`, opts.map(k => scatter(k, { emoji: e })), 0, L => `Picture ${b(L)} has ${n}.`);
  }),
  R(/^Count dots(?: - up to \d+)?$/, (mt, ctx) => () => { const n = ri(1, upTo(ctx.title, 10)); return num(`${scatter(n)}How many dots are there?`, n, `Count each dot once: ${b(n)}.`); }),
  R(/^Count on ten frames(?: - up to \d+)?$/, (mt, ctx) => () => { const lim = upTo(ctx.title, 10), n = ri(1, lim); return num(`${frameR(n, lim > 10 ? 20 : 10)}How many counters are there?`, n, `Count the counters: ${b(n)}.`); }),
  R(/^What number comes next\? - up to 5$/, () => () => {
    const kind = ri(0, 3);
    if (kind === 0) { const k = ri(1, 4); return num(`What number comes right after ${b(k)}?`, k + 1, `${k}, ${b(k + 1)}.`); }
    if (kind === 1) { const s = ri(1, 2), seq = [s, s + 1, s + 2]; return num(`Count: ${m(seq.join(', ') + ', ___')}`, s + 3, `Count up by 1: ${b(s + 3)}.`); }
    if (kind === 2) { const k = ri(1, 4), e = pick(OBJ); return num(`${scatter(k, { emoji: e })}There are ${k}. One more ${e} comes. How many now?`, k + 1, `${k} and one more is ${b(k + 1)}.`); }
    const hole = ri(2, 5), labels = range(1, 5).map(v => (v === hole ? '?' : v));
    return num(`${svg(240, 60, range(0, 4).map(i => `<line x1="${20 + i * 50}" y1="20" x2="${20 + i * 50}" y2="32" stroke="${C.ink}" stroke-width="2"/><text x="${20 + i * 50}" y="52" font-size="16" text-anchor="middle" fill="${labels[i] === '?' ? C.red : C.ink}" font-weight="700">${labels[i]}</text>`).join('') + `<line x1="10" y1="26" x2="230" y2="26" stroke="${C.ink}" stroke-width="2"/>`)}What number goes where the ${b('?')} is?`, hole, `Counting 1, 2, 3, 4, 5, the missing number is ${b(hole)}.`);
  }),
  R(/^One (more|less) on frames - up to \d+$/, (mt, ctx) => () => {
    const lim = upTo(ctx.title, 10), more = mt[1] === 'more', n = more ? ri(1, lim - 1) : ri(2, lim), kind = ri(0, 1);
    if (kind === 0) return num(`${frameR(n)}What number is ${b('one ' + mt[1])} than this?`, more ? n + 1 : n - 1, `${n} ${more ? '+' : '−'} 1 = ${b(more ? n + 1 : n - 1)}.`);
    const opts = uniq([more ? n + 1 : n - 1, n, more ? Math.min(lim + 1, n + 2) : Math.max(0, n - 2)]);
    return pickPic(`Which ten frame shows ${b('one ' + mt[1])} than ${b(n)}?`, opts.map(k => frameR(k)), 0, L => `Frame ${b(L)} shows ${more ? n + 1 : n - 1}.`);
  }),
  R(/^Learn to skip-count by (twos|fives|tens)$/, mt => () => {
    const s = { twos: 2, fives: 5, tens: 10 }[mt[1]], len = 5, st = ri(0, s === 10 ? 4 : 5) * s, seq = range(0, len - 1).map(i => st + i * s), hole = ri(1, len - 1);
    if (Math.random() < 0.25) { const k = ri(1, 9) * s; return num(`Count by ${b(s)}s. What number comes right after ${b(k)}?`, k + s, `${k} + ${s} = ${b(k + s)}.`); }
    return num(`Count by ${b(s)}s: ${m(seq.map((v, i) => (i === hole ? '___' : v)).join(', '))}`, seq[hole], `Each number is ${s} more than the one before: ${b(seq[hole])}.`);
  }),
  R(/^Skip-count by twos on ten frames$/, () => () => { const pairs = ri(1, 10), n = pairs * 2; return num(`${frameR(n, n > 10 ? 20 : 10)}Count the counters by twos. How many are there?`, n, `Count 2, 4, 6 …: ${b(n)}.`); }),

  /* ===== Kindergarten: compare, money, shapes ===== */
  R(/^Wide and narrow$/, () => () => {
    if (Math.random() < 0.5) {
      const w1 = ri(20, 110), w2 = ri(20, 110); if (Math.abs(w1 - w2) < 25) return null;
      const [c1, c2] = sample(FILLS, 2), wide = Math.random() < 0.5, ans = (wide ? w1 > w2 : w1 < w2) ? 'A' : 'B';
      return mc(`${svg(260, 110, `<rect x="${70 - w1 / 2}" y="20" width="${w1}" height="70" fill="${c1}" stroke="${C.ink}" stroke-width="2"/><text x="70" y="106" text-anchor="middle" font-weight="700">A</text><rect x="${190 - w2 / 2}" y="20" width="${w2}" height="70" fill="${c2}" stroke="${C.ink}" stroke-width="2"/><text x="190" y="106" text-anchor="middle" font-weight="700">B</text>`)}Which is ${b(wide ? 'wider' : 'narrower')}?`, ans, [ans === 'A' ? 'B' : 'A'], `${ans} is ${wide ? 'wider' : 'narrower'} from side to side.`, 2);
    }
    const [w, n] = pick([['a road', 'a path'], ['a river', 'a stream'], ['a garage door', 'a front door'], ['a bed', 'a chair'], ['a sofa', 'a stool'], ['a bus', 'a bicycle'], ['a highway', 'a sidewalk'], ['a window', 'a mail slot'], ['a soccer field', 'a hallway'], ['an elephant', 'a cat']]);
    const wide = Math.random() < 0.5, first = Math.random() < 0.5 ? [w, n] : [n, w];
    return mc(`Which is ${b(wide ? 'wider' : 'narrower')}: ${first[0]} or ${first[1]}?`, wide ? w : n, [wide ? n : w], `${cap(w)} is wider than ${n}.`, 2);
  }),
  R(/^Coin values - (nickel and dime|quarter, loonie and toonie)$/, mt => () => {
    const pool = mt[1].startsWith('nickel') ? [5, 10] : [25, 100, 200], v = pick(pool), kind = ri(0, 3);
    if (kind === 0) return mc(`${coinPic(v)}<br>How much is this coin worth?`, cents(v), pool.filter(x => x !== v).map(cents).concat([5, 10, 25, 100, 200].filter(x => !pool.includes(x)).map(cents)).slice(0, 3), `This is a ${coinName(v)}. It is worth ${b(cents(v))}.`, 4);
    if (kind === 1) return mc(`${coinPic(v)}<br>What is the name of this coin?`, coinName(v), ['nickel', 'dime', 'quarter', 'loonie', 'toonie'].filter(x => x !== coinName(v)).slice(0, 3), `This coin is a ${b(coinName(v))}.`, 4);
    if (kind === 2) { const list = shuffle([5, 10, 25, 100, 200]).slice(0, 3); if (!list.includes(v)) list[ri(0, 2)] = v; return pickPic(`Which coin is the ${b(coinName(v))}?`, list.map(coinPic), list.indexOf(v), L => `Coin ${b(L)} is the ${coinName(v)}.`); }
    const [x, y] = sample(pool.length > 2 ? pool : [5, 10], 2), more = Math.random() < 0.5, ans = (more ? x > y : x < y) ? coinName(x) : coinName(y);
    return mc(`${coinPic(x)} ${coinPic(y)}<br>Which coin is worth ${b(more ? 'more' : 'less')}: the ${coinName(x)} or the ${coinName(y)}?`, ans, [ans === coinName(x) ? coinName(y) : coinName(x)], `A ${coinName(x)} is ${cents(x)} and a ${coinName(y)} is ${cents(y)}.`, 2);
  }),
  R(/^Count money - (nickels|dimes) only$/, mt => () => {
    const v = mt[1] === 'nickels' ? 5 : 10, n = ri(2, 10);
    if (Math.random() < 0.3) return num(`How many ${mt[1]} make ${b(cents(v * n))}?`, n, `Count by ${v}s up to ${v * n}: ${b(n)} ${mt[1]}.`);
    return num(`<div>${Array.from({ length: n }, () => coinPic(v)).join('')}</div>How much money is this? (¢)`, v * n, `Count by ${v}s: ${range(1, n).map(i => i * v).join(', ')}. That is ${b(v * n + '¢')}.`);
  }),
  R(/^Exchanging groups of coins$|^Exchanging coins(?: - up to \$[12])?$/, (mt, ctx) => () => {
    const max = /\$2/.test(ctx.title) ? 200 : /\$1/.test(ctx.title) ? 100 : ctx.grade <= 0 ? 50 : 100;
    const pairs = [[5, 10], [5, 25], [10, 50], [5, 50], [25, 50], [25, 100], [10, 100], [5, 100], [100, 200], [25, 200], [10, 200]].filter(([s, t]) => t <= max);
    const [small, unit] = pick(pairs), k = ri(1, Math.max(1, Math.floor(max / unit))), total = unit * k;
    const name = unit === 50 ? null : coinName(unit);
    const what = name ? `${k} ${name}${k > 1 ? 's' : ''}` : cents(total);
    if (unit === 50 && small === 25 && k === 1) return num(`How many quarters equal ${b('50¢')}?`, 2, `25¢ + 25¢ = 50¢: ${b(2)}.`);
    return num(`How many ${coinName(small)}s equal ${b(what)}?`, total / small, `${what} is ${cents(total)}. ${cents(total)} ÷ ${cents(small)} = ${b(total / small)}.`);
  }),
  R(/^Name the shape$|^Circles, squares and triangles$|^Squares and rectangles$|^Name the two-dimensional shape(?: and explain your answer)?$/, (mt, ctx) => () => {
    const pool = shapePool(ctx.grade, ctx.title), s = pick(pool), explain = /explain/.test(ctx.title);
    if (!explain && Math.random() < 0.3) { const opts = uniq([s, ...shuffle(pool.filter(x => x !== s))]).slice(0, Math.min(3, pool.length)); return pickPic(`Which picture shows a ${b(s)}?`, opts.map(x => shapeSvgR(x, 90)), 0, L => `Picture ${b(L)} is a ${s}: ${WHY_SHAPE[s]}.`); }
    if (explain) { const why = WHY_SHAPE[s]; const wrong = sample(pool.filter(x => x !== s), 3).map(x => `It is a ${x} because ${WHY_SHAPE[x]}.`); return mc(`${shapeSvgR(s)}Which answer names the shape and explains why?`, `It is a ${s} because ${why}.`, wrong, `It is a ${b(s)} because ${why}.`, 4); }
    return mc(`${shapeSvgR(s)}What is the name of this shape?`, s, sample(pool.filter(x => x !== s), Math.min(3, pool.length - 1)), `It is a ${b(s)}: ${WHY_SHAPE[s]}.`, Math.min(4, pool.length));
  }),
  R(/^Name the solid shape$|^Describe three-dimensional shapes$/, (mt, ctx) => () => {
    const pool = ctx.grade <= 0 ? SOLID_FACTS.slice(0, 5) : SOLID_FACTS, [s, facts] = pick(pool);
    if (/Name/.test(ctx.title) && Math.random() < 0.5) {
      const REALS = { cube: ['a dice 🎲', 'an ice cube 🧊', 'a toy block'], 'rectangular prism': ['a cereal box', 'a book', 'a brick'], sphere: ['a soccer ball ⚽', 'an orange 🍊', 'a globe 🌍'], cylinder: ['a soup can 🥫', 'a drum 🥁', 'a candle 🕯️'], cone: ['an ice cream cone 🍦', 'a party hat 🥳', 'a traffic cone'] };
      const obj = pick(REALS[s]); return mc(`What solid shape is ${b(obj)} like?`, s, sample(pool.map(p => p[0]).filter(x => x !== s), 3), `${cap(obj)} is shaped like a ${b(s)}.`, 4);
    }
    return mc(`Which solid shape is this? ${b(pick(facts))}`, s, sample(pool.map(p => p[0]).filter(x => x !== s), 3), `That describes a ${b(s)}.`, 4);
  }),
  R(/^Introduction to symmetry$|^Identify pictures with symmetry$/, () => () => {
    const sym = Math.random() < 0.5, n = ri(3, 5), H = 110, cx = 80, fill = pick(FILLS), ink = pick(INKS);
    const half = range(0, n - 1).map(i => [cx - ri(15, 60), 10 + (i * (H - 20)) / (n - 1)]);
    let pts = [...half, ...half.slice().reverse().map(([x, y]) => [2 * cx - x, y])];
    if (!sym) pts = pts.map(([x, y], i) => (i >= n ? [x + ri(10, 30) * (i % 2 ? 1 : -1), y + ri(-12, 12)] : [x, y]));
    const pic = svg(160, H, polyEl(pts, fill, ink) + `<line x1="${cx}" y1="0" x2="${cx}" y2="${H}" stroke="${C.red}" stroke-width="2" stroke-dasharray="6 4"/>`);
    return yesNo(`${pic}If you fold this shape along the dashed line, do the two halves match?`, sym, sym ? 'Both halves are mirror images, so the shape is symmetrical.' : 'The halves are different, so the shape is not symmetrical along this line.', ['Yes', 'No']);
  }),

  /* ===== Grade 1–2 geometry ===== */
  R(/^Count sides of shapes$|^Count corners \(vertices\)$/, (mt, ctx) => () => {
    const s = pick(['triangle', 'square', 'rectangle', 'pentagon', 'hexagon', 'octagon', 'rhombus', 'trapezoid', 'parallelogram', 'heptagon']), what = /corners/.test(ctx.title) ? 'corners (vertices)' : 'sides';
    return num(`${shapeSvgR(s)}How many ${what} does this shape have?`, SIDES[s], `Count them one at a time: ${b(SIDES[s])}.`);
  }),
  R(/^Compare sides and vertices$/, () => () => {
    const pool = ['triangle', 'square', 'rectangle', 'pentagon', 'hexagon', 'octagon', 'trapezoid'], [x, y] = sample(pool, 2); if (SIDES[x] === SIDES[y]) return null;
    const what = pick(['sides', 'vertices']), more = Math.random() < 0.5, ans = (more ? SIDES[x] > SIDES[y] : SIDES[x] < SIDES[y]) ? 'A' : 'B';
    return mc(`${pics([shapeSvgR(x, 90), shapeSvgR(y, 90)])}Which shape has ${b(more ? 'more' : 'fewer')} ${what}?`, ans, [ans === 'A' ? 'B' : 'A'], `Shape A has ${SIDES[x]} ${what} and shape B has ${SIDES[y]}.`, 2);
  }),
  R(/^Open and closed shapes$/, () => () => {
    const closed = Math.random() < 0.5, n = ri(3, 7), cx = 80, cy = 58, r = ri(36, 48), a0 = ri(0, 359);
    const pts = range(0, n - 1).map(i => [cx + (r + ri(-8, 8)) * Math.cos(deg(a0 + (360 * i) / n)), cy + (r + ri(-8, 8)) * Math.sin(deg(a0 + (360 * i) / n))]);
    const ink = pick(INKS), body = closed ? polyEl(pts, pick(FILLS), ink) : `<polyline points="${ptsStr(pts)}" fill="none" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
    return yesNo(`${svg(160, 116, body)}Is this shape ${b('closed')}?`, closed, closed ? 'All the sides join up with no gap, so it is closed.' : 'There is a gap between two ends, so it is open.', ['Yes, closed', 'No, open']);
  }),
  R(/^Flip, turn and slide$|^Reflection, rotation and translation$|^Combinations of reflections, rotations and translations$/, (mt, ctx) => () => {
    const kind = pick(['slide', 'flip', 'turn']), up = ctx.grade >= 3, name = up ? { slide: 'translation', flip: 'reflection', turn: 'rotation' }[kind] : kind;
    const all = up ? ['translation', 'reflection', 'rotation'] : ['slide', 'flip', 'turn'];
    return mc(`${tfPicture(kind)}Which move takes the first shape onto the yellow shape?`, name, all.filter(x => x !== name), `The shape ${kind === 'slide' ? 'moves without turning or flipping' : kind === 'flip' ? 'is mirrored over a line' : 'is turned around a point'}: ${b(name)}.`, 3);
  }),
  R(/^Cubes and rectangular prisms$/, () => () => {
    const cube = Math.random() < 0.5, kind = ri(0, 2);
    if (kind === 0) return mc(`Which solid has ${b(pick(cube ? ['6 faces that are all the same square', 'length, width and height all equal'] : ['6 faces where some are rectangles that are not squares', 'a long rectangular shape like a shoebox']))}?`, cube ? 'cube' : 'rectangular prism', [cube ? 'rectangular prism' : 'cube'], cube ? 'All faces of a cube are equal squares.' : 'A rectangular prism has rectangular faces.', 2);
    const obj = cube ? pick(['a dice 🎲', 'a sugar cube', 'a Rubik\'s cube', 'an ice cube 🧊', 'a toy block']) : pick(['a cereal box', 'a brick', 'a shoebox', 'a juice box', 'a book', 'a fridge']);
    if (kind === 1) return mc(`Is ${b(obj)} shaped more like a cube or a rectangular prism?`, cube ? 'cube' : 'rectangular prism', [cube ? 'rectangular prism' : 'cube'], `${cap(obj)} is like a ${cube ? 'cube' : 'rectangular prism'}.`, 2);
    const what = pick([['faces', 6], ['edges', 12], ['vertices', 8]]);
    return num(`How many ${b(what[0])} does a ${b(cube ? 'cube' : 'rectangular prism')} have?`, what[1], `Cubes and rectangular prisms both have 6 faces, 12 edges and 8 vertices: ${b(what[1])}.`);
  }),
  R(/^Compose three-dimensional shapes$|^Compose bigger three-dimensional shapes$/, (mt, ctx) => () => {
    const big = /bigger/.test(ctx.title);
    if (Math.random() < 0.5) { const l = ri(2, big ? 4 : 3), w = ri(1, big ? 3 : 2), h = ri(1, big ? 3 : 2); return num(`A rectangular prism is built from small cubes: ${b(l)} long, ${b(w)} wide and ${b(h)} tall. How many cubes are used?`, l * w * h, `${l} × ${w} × ${h} = ${b(l * w * h)} cubes.`); }
    const [parts, ans, wrong] = pick([['2 cubes side by side', 'a rectangular prism', ['a cone', 'a sphere', 'a cylinder']], ['8 small cubes in a 2 × 2 × 2 block', 'a bigger cube', ['a cylinder', 'a cone', 'a pyramid']], ['2 triangular prisms put together face to face', 'a rectangular prism', ['a sphere', 'a cone', 'a cylinder']], ['a cylinder with a cone on top', 'a rocket (pencil) shape', ['a sphere', 'a cube', 'a box']], ['a cube with a square pyramid on top', 'a house shape', ['a sphere', 'a can', 'a ball']], ['3 cubes stacked on top of each other', 'a tall rectangular prism', ['a sphere', 'a cone', 'a cylinder']], ['2 cones joined at their circle faces', 'a spinning-top shape', ['a cube', 'a box', 'a can']], ['27 small cubes in a 3 × 3 × 3 block', 'a bigger cube', ['a cylinder', 'a sphere', 'a pyramid']]]);
    return mc(`What shape do you make with ${b(parts)}?`, ans, wrong, `${cap(parts)} make ${b(ans)}.`, 4);
  }),
  R(/^Three-dimensional figures viewed from different perspectives$/, () => () => {
    const [s, view, ans] = pick([['cylinder', 'from above', 'circle'], ['cylinder', 'from the side', 'rectangle'], ['cube', 'from the front', 'square'], ['cube', 'from above', 'square'], ['cone', 'from above', 'circle (with a dot in the middle)'], ['cone', 'from the side', 'triangle'], ['square pyramid', 'from above', 'square (with an X)'], ['square pyramid', 'from the side', 'triangle'], ['rectangular prism', 'from the front', 'rectangle'], ['sphere', 'from any side', 'circle'], ['triangular prism', 'from the end', 'triangle'], ['triangular prism', 'from the side', 'rectangle']]);
    return mc(`You look at a ${b(s)} ${b(view)}. What shape do you see?`, ans, uniq(['circle', 'square', 'rectangle', 'triangle', 'circle (with a dot in the middle)', 'square (with an X)'].filter(x => x !== ans && !ans.startsWith(x) && !x.startsWith(ans))).slice(0, 3), `Viewed ${view}, a ${s} looks like a ${b(ans)}.`, 4);
  }),
  R(/^Nets of (?:three-dimensional shapes|three-dimensional figures|prisms and pyramids)$/, (mt, ctx) => () => {
    const solids = ctx.grade <= 3 ? ['cube', 'rectangular prism', 'square pyramid', 'triangular prism'] : ['cube', 'rectangular prism', 'square pyramid', 'triangular prism', 'triangular pyramid', 'pentagonal prism', 'hexagonal prism'];
    if (Math.random() < 0.3) { const ok = Math.random() < 0.5; return yesNo(`${gridNet(ok ? pick(CUBE_NETS) : pick(NOT_CUBE))}Can this net be folded into a ${b('cube')}?`, ok, ok ? 'The six squares fold up with no overlaps or gaps.' : 'When you fold it, two faces overlap (or one is missing), so it cannot make a cube.', ['Yes', 'No']); }
    const s = pick(solids.filter(x => x !== 'triangular pyramid'));
    return mc(`${prismNet(s)}Which three-dimensional figure does this net fold into?`, s, sample(solids.filter(x => x !== s), 3), `Count the faces and their shapes: it folds into a ${b(s)}.`, 4);
  }),
  R(/^Lines, line segments and rays$|^Points, lines, line segments, rays and angles$/, (mt, ctx) => () => {
    const kinds = /Points/.test(ctx.title) ? ['point', 'line', 'line segment', 'ray'] : ['line', 'line segment', 'ray'], k = pick(kinds), { html, name } = linePic(k);
    if (ctx.grade >= 5 && k !== 'point' && Math.random() < 0.5) return mc(`${html}What is the name of this figure?`, name, uniq([`line ${name.slice(-2)}`, `ray ${name.slice(-2)}`, `segment ${name.slice(-2)}`, `ray ${name.slice(-1)}${name.slice(-2, -1)}`]).filter(x => x !== name), `It is a ${k}, so it is named ${b(name)}.`, 4);
    return mc(`${html}What is this figure called?`, k, kinds.filter(x => x !== k), k === 'line' ? 'It goes on forever in both directions (two arrows).' : k === 'ray' ? 'It has one endpoint and goes on forever in one direction.' : k === 'point' ? 'It is a single location.' : 'It has two endpoints.', kinds.length);
  }),
  R(/^Angles of 90, 180, 270 and 360 degrees$/, () => () => {
    const kind = ri(0, 2);
    if (kind === 0) { const turn = pick([['a quarter turn', 90], ['a half turn', 180], ['a three-quarter turn', 270], ['a full turn', 360]]); return num(`How many degrees is ${b(turn[0])}?`, turn[1], `A full turn is 360°, so ${turn[0]} is ${b(turn[1] + '°')}.`); }
    if (kind === 1) { const h0 = ri(1, 12), add = pick([3, 6, 9, 12]), h1 = ((h0 + add - 1) % 12) + 1; return num(`The ${b('hour hand')} of a clock moves clockwise from ${b(h0)} to ${b(h1)}. How many degrees does it turn?`, add * 30, `Each hour mark is 30°. ${add} marks × 30° = ${b(add * 30 + '°')}.`); }
    const dirs = ['north', 'east', 'south', 'west'], s = ri(0, 3), k = ri(1, 4), e = (s + k) % 4;
    return num(`You face ${b(dirs[s])} and turn clockwise until you face ${b(dirs[e])}${k === 4 ? ' again' : ''}. How many degrees did you turn?`, k * 90, `Each quarter turn is 90°: ${k} × 90 = ${b(k * 90 + '°')}.`);
  }),

  /* ===== data, probability, money (Grades 4–8) ===== */
  R(/^Choose the best type of graph$/, () => () => {
    const [sit, ans] = pick([
      ['how the temperature changed every hour during one day', 'line graph'], ['the number of students who chose each favourite fruit', 'bar graph'], ['what fraction of a budget is spent on each category', 'circle graph'],
      ['the height of a plant measured every week for 2 months', 'line graph'], ['the number of goals scored by each team in a tournament', 'bar graph'], ['the percent of the class that walks, bikes, or takes the bus', 'circle graph'],
      ['the population of a town every 10 years since 1950', 'line graph'], ['how many books each grade read this month', 'bar graph'], ['how a family\'s monthly spending is split into parts of the whole', 'circle graph'],
      ['the test scores of 30 students grouped in intervals of 10', 'histogram'], ['the ages of runners in a race, grouped 10–19, 20–29, …', 'histogram'], ['the relationship between hours studied and test score for 20 students', 'scatter plot'],
      ['the relationship between a person\'s height and arm span', 'scatter plot'], ['the share of electricity Canada makes from each energy source', 'circle graph'], ['the price of a bus ticket each year from 2010 to 2025', 'line graph']
    ]);
    return mc(`Which type of graph is best to show ${b(sit)}?`, ans, ['line graph', 'bar graph', 'circle graph', 'histogram', 'scatter plot'].filter(x => x !== ans), `${ans === 'line graph' ? 'Change over time' : ans === 'bar graph' ? 'Comparing separate categories' : ans === 'circle graph' ? 'Parts of a whole' : ans === 'histogram' ? 'Numerical data grouped into intervals' : 'The relationship between two numerical variables'} → ${b(ans)}.`, 4);
  }),
  R(/^Sample spaces of simple events$/, () => () => {
    const [desc, space] = pick([
      ['rolling a six-sided die', ['1', '2', '3', '4', '5', '6']], ['flipping a coin', ['heads', 'tails']], ['spinning a spinner with sections red, blue, green and yellow', ['red', 'blue', 'green', 'yellow']],
      ['picking a day of the week at random', ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']], ['picking a vowel at random', ['A', 'E', 'I', 'O', 'U']], ['rolling an eight-sided die', range(1, 8).map(String)],
      ['picking a season at random', ['winter', 'spring', 'summer', 'fall']], ['spinning a spinner numbered 1 to 5', range(1, 5).map(String)], ['picking a card from cards labelled A, B, C', ['A', 'B', 'C']],
      ['choosing a month at random', ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']], ['rolling a ten-sided die', range(1, 10).map(String)]
    ]);
    if (Math.random() < 0.5) return num(`How many outcomes are in the sample space for ${b(desc)}?`, space.length, `The sample space is {${space.join(', ')}}: ${b(space.length)} outcomes.`);
    const extra = /^\d+$/.test(space[0]) ? String(space.length + 1) : pick(['purple', 'none', 'both', 'Z']), ans = `{${space.join(', ')}}`;
    const wrong = [`{${space.slice(0, -1).join(', ')}}`, `{${space.slice(1).join(', ')}}`, `{${[...space, extra].join(', ')}}`].filter(x => x !== '{}');
    return mc(`What is the sample space for ${b(desc)}?`, ans, uniq(wrong).filter(x => x !== ans), `List every possible outcome once: ${b(ans)}.`, 4);
  }),
  R(/^Debit cards and credit cards$/, () => () => {
    const [stmt, ans] = pick([
      ['The money is taken right away from your bank account.', 'debit card'], ['You borrow money from the bank and pay it back later.', 'credit card'], ['If you do not pay the full balance on time, you are charged interest.', 'credit card'],
      ['You can only spend money that is already in your account.', 'debit card'], ['Using it responsibly helps you build a credit history.', 'credit card'], ['It has a monthly spending limit set by the lender.', 'credit card'],
      ['You need to enter a PIN, and the money leaves your chequing account.', 'debit card'], ['It is a loan that must be repaid.', 'credit card'], ['There is no interest because you are spending your own money.', 'debit card'],
      ['A $300 purchase appears on a monthly statement that you pay later.', 'credit card'], ['Your bank balance drops by $45 as soon as you buy groceries.', 'debit card']
    ]);
    return mc(`Does this describe a ${b('debit card')} or a ${b('credit card')}?<br>${stmt}`, ans, [ans === 'debit card' ? 'credit card' : 'debit card'], ans === 'debit card' ? 'A debit card spends money already in your account.' : 'A credit card borrows money that you repay later (with interest if late).', 2);
  }),
  R(/^Evaluate payment methods$/, () => () => {
    const price = ri(4, 60) * 10, months = pick([3, 6, 10, 12]), rate = pick([10, 12, 15, 18, 20]), fee = pick([0, 2, 5]);
    const kind = ri(0, 2);
    if (kind === 0) { const per = Math.round(price * (1 + rate / 100) / months * 100) / 100, total = Math.round(per * months * 100) / 100; return num(`A bike costs ${b('$' + price)}. A store plan charges ${b(rate + '%')} extra and splits the total into ${b(months)} equal monthly payments. How much is the total paid? ($)`, total, `${price} × ${1 + rate / 100} = $${total}.`); }
    if (kind === 1) { const extra = Math.round(price * rate / 100); return num(`You buy a ${b('$' + price)} tablet on a credit card and pay it off after a year with ${b(rate + '%')} interest. How much more do you pay than with cash? ($)`, extra, `${rate}% of $${price} = ${b('$' + extra)}.`); }
    const save = ri(2, 8) * 5, weeks = Math.ceil(price / save);
    return num(`Instead of borrowing, you save ${b('$' + save)} per week for a ${b('$' + price)} item. How many weeks until you can pay cash?`, weeks, `${price} ÷ ${save} = ${(price / save).toFixed(2)}, so ${b(weeks)} weeks.`);
  }),
  R(/^Identify independent and dependent variables$/, () => () => {
    const [sit, ind, dep] = pick([
      ['The more hours Maya works, the more money she earns.', 'hours worked', 'money earned'], ['A plant grows taller as it gets more sunlight each day.', 'sunlight', 'plant height'], ['The cost of a taxi ride depends on the distance travelled.', 'distance', 'cost'],
      ['The longer the oven is on, the hotter it gets.', 'time', 'temperature'], ['The number of tickets sold determines the money raised.', 'tickets sold', 'money raised'], ['A car uses more gas the farther it drives.', 'distance driven', 'gas used'],
      ['Ben\'s test score depends on how many minutes he studies.', 'minutes studied', 'test score'], ['The amount of paint needed depends on the area of the wall.', 'wall area', 'paint needed'], ['The more people at a party, the more pizza is eaten.', 'number of people', 'pizza eaten'],
      ['A candle gets shorter the longer it burns.', 'burning time', 'candle length'], ['The total cost of apples depends on how many kilograms you buy.', 'kilograms bought', 'total cost'], ['The height of a ball depends on how long since it was thrown.', 'time', 'height']
    ]);
    const askInd = Math.random() < 0.5;
    return mc(`${sit}<br>What is the ${b(askInd ? 'independent' : 'dependent')} variable?`, askInd ? ind : dep, [askInd ? dep : ind], `The independent variable (${ind}) is changed or controlled; the dependent variable (${dep}) responds to it.`, 2);
  }),
  R(/^Compound events: find the number of sums$/, () => () => {
    const a = ri(4, 8), c = ri(3, 8), sums = new Set(); for (let i = 1; i <= a; i++) for (let j = 1; j <= c; j++) sums.add(i + j);
    return num(`You spin a spinner numbered 1 to ${b(a)} and roll a die numbered 1 to ${b(c)}, then add the two numbers. How many ${b('different sums')} are possible?`, sums.size, `The smallest sum is 2 and the largest is ${a + c}, and every sum in between is possible: ${b(sums.size)}.`);
  }),
  R(/^Relationship between decimal place values$/, () => () => {
    const places = ['thousands', 'hundreds', 'tens', 'ones', 'tenths', 'hundredths', 'thousandths'], i = ri(0, places.length - 2), j = ri(i + 1, Math.min(places.length - 1, i + 3)), times = 10 ** (j - i);
    return pick([
      num(`How many ${b(places[j])} are in one ${b(places[i].replace(/s$/, ''))}?`, times, `Each place is 10 times the place to its right: ${b(fmt(times))}.`),
      mc(`One ${b(places[j].replace(/s$/, ''))} is what fraction of one ${b(places[i].replace(/s$/, ''))}?`, `1/${fmt(times)}`, uniq([`1/${fmt(times * 10)}`, `${fmt(times)}`, `1/${fmt(Math.max(10, times / 10))}`]).filter(x => x !== `1/${fmt(times)}`), `Moving ${j - i} place${j - i > 1 ? 's' : ''} right divides by ${fmt(times)}.`, 4)
    ]);
  }),
  R(/^Integer (multiplication|division) rules$/, mt => () => {
    const div = mt[1] === 'division', x = ri(2, 12) * (Math.random() < 0.5 ? 1 : -1), y = ri(2, 12) * (Math.random() < 0.5 ? 1 : -1), a = div ? x * y : x;
    const r = div ? a / y : x * y, sign = r > 0 ? 'positive' : 'negative', expr = div ? `${fmt(a)} ÷ ${fmt(y)}` : `${fmt(x)} × ${fmt(y)}`;
    if (Math.random() < 0.5) return mc(`Without calculating, is ${m(expr)} positive or negative?`, sign, [sign === 'positive' ? 'negative' : 'positive'], `${(div ? a : x) > 0 ? 'Positive' : 'Negative'} ${div ? '÷' : '×'} ${y > 0 ? 'positive' : 'negative'} is ${b(sign)}: same signs give a positive, different signs give a negative.`, 2);
    return num(`${m(expr)} = ?`, r, `${Math.abs(div ? a : x)} ${div ? '÷' : '×'} ${Math.abs(y)} = ${Math.abs(r)}, and the signs are ${(div ? a : x) * y > 0 ? 'the same, so the answer is positive' : 'different, so the answer is negative'}: ${b(fmt(r))}.`);
  }),
  R(/^Skip-counting patterns with tables$/, () => () => {
    const s = pick([2, 3, 4, 5, 10]), start = ri(1, 3), n = 4, rows = range(start, start + n - 1).map(i => [i, i * s]), ask = start + n + ri(0, 2), units = [['bike', 'wheels', 2], ['pair of socks', 'socks', 2], ['hand', 'fingers', 5], ['star', 'points', 5], ['tricycle', 'wheels', 3], ['triangle', 'sides', 3], ['dog', 'legs', 4], ['car', 'wheels', 4], ['pack', 'pencils', 10], ['box', 'crayons', 10]].filter(u => u[2] === s), unit = units.length ? pick(units) : ['group', 'items', s];
    return num(`Each ${unit[0]} has ${s} ${unit[1]}.<br>${m(rows.map(([a, v]) => `${a} ${a > 1 ? plural(unit[0]) : unit[0]} → ${v} ${unit[1]}`).join('<br>'))}<br>How many ${unit[1]} do ${b(ask)} ${plural(unit[0])} have?`, ask * s, `Skip-count by ${s}: ${ask} × ${s} = ${b(ask * s)}.`);
  })
];
