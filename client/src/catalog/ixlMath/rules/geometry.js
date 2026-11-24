/* Geometry: shapes, solids, angles, lines, symmetry, transformations, spatial sense (Grades 1–5). */
import {
  ri, pick, shuffle, sample, range, uniq, m, b, fmt, num, mc, yesNo, near, svg, C, thing, emojiRow, big, cap, NAMES,
  SHAPES_2D, SIDES, shapeSvg as shapeSvg0, shapeRow, SOLIDS
} from '../h.js';
import { R } from '../engine.js';

const stroke = (extra = '') => `stroke="${C.primary}" stroke-width="3" stroke-linejoin="round" ${extra}`;
const poly = (pts, fill = '#c7d2fe', extra = '') => `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${fill}" ${stroke(extra)}/>`;
const g = (inner, w = 160, h = 130) => svg(w, h, inner);
/* random colour scheme so repeated pictures of the same shape are not identical */
const PAL = [['#c7d2fe', '#e0e7ff', '#a5b4fc', C.primary], ['#bbf7d0', '#dcfce7', '#86efac', '#16a34a'], ['#fde68a', '#fef3c7', '#fcd34d', '#d97706'], ['#fecaca', '#fee2e2', '#fca5a5', '#dc2626'], ['#e9d5ff', '#f3e8ff', '#d8b4fe', '#7c3aed'], ['#bae6fd', '#e0f2fe', '#7dd3fc', '#0284c7']];
const tint = html => { const p = pick(PAL); return html.split('#c7d2fe').join(p[0]).split('#e0e7ff').join(p[1]).split('#a5b4fc').join(p[2]).split(C.primary).join(p[3]); };
const shapeSvg = (name, size) => tint(shapeSvg0(name, size));
const picChoices = (names, draw) => `<div style="display:flex;gap:12px;flex-wrap:wrap">${names.map((n, i) => `<span><b>${'ABCD'[i]}</b>${draw(n)}</span>`).join('')}</div>`;

/* ---------- 2-D shapes: names, attributes ---------- */
const SHAPE_LABEL = { circle: 'circle', oval: 'oval', triangle: 'triangle', square: 'square', rectangle: 'rectangle', rhombus: 'rhombus', trapezoid: 'trapezoid', parallelogram: 'parallelogram', pentagon: 'pentagon', hexagon: 'hexagon', heptagon: 'heptagon', octagon: 'octagon', nonagon: 'nonagon', decagon: 'decagon' };
const POLYGONS = Object.keys(SIDES).filter(k => SIDES[k] >= 3);
const shapeNames = (grade) => (grade <= 1 ? ['circle', 'triangle', 'square', 'rectangle'] : grade === 2 ? ['circle', 'triangle', 'square', 'rectangle', 'pentagon', 'hexagon', 'rhombus', 'trapezoid'] : Object.keys(SHAPE_LABEL).filter(x => x !== 'oval'));

/* ---------- triangles ---------- */
const TRIS = {
  'acute equilateral': { pts: [[20, 105], [140, 105], [80, 2]], sides: 'equilateral', angles: 'acute', ticks: [0, 1, 2] },
  'acute isosceles': { pts: [[20, 105], [140, 105], [80, 25]], sides: 'isosceles', angles: 'acute', ticks: [1, 2] },
  'acute scalene': { pts: [[15, 105], [145, 105], [105, 20]], sides: 'scalene', angles: 'acute', ticks: [] },
  'right isosceles': { pts: [[20, 105], [20, 25], [100, 105]], sides: 'isosceles', angles: 'right', ticks: [0, 2], right: 0 },
  'right scalene': { pts: [[20, 105], [20, 20], [130, 105]], sides: 'scalene', angles: 'right', ticks: [], right: 0 },
  'obtuse isosceles': { pts: [[10, 90], [150, 90], [80, 55]], sides: 'isosceles', angles: 'obtuse', ticks: [1, 2] },
  'obtuse scalene': { pts: [[10, 105], [90, 105], [140, 40]], sides: 'scalene', angles: 'obtuse', ticks: [] }
};
function triSvg(key, { showTicks = true } = {}) {
  const t = TRIS[key], p = fitShape(t.pts); let inner = poly(p, "#c7d2fe");
  if (showTicks && t.ticks.length) for (const i of t.ticks) { const a = p[i], c = p[(i + 1) % 3], mx = (a[0] + c[0]) / 2, my = (a[1] + c[1]) / 2, dx = c[0] - a[0], dy = c[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L * 6, ny = dx / L * 6; inner += `<line x1="${mx - nx}" y1="${my - ny}" x2="${mx + nx}" y2="${my + ny}" stroke="${C.red}" stroke-width="3"/>`; }
  if (t.right !== undefined) { const v = p[t.right], a = p[(t.right + 1) % 3], c = p[(t.right + 2) % 3], u = [(a[0] - v[0]), (a[1] - v[1])], w2 = [(c[0] - v[0]), (c[1] - v[1])], lu = Math.hypot(...u), lw = Math.hypot(...w2), s = 14; inner += `<polyline points="${v[0] + u[0] / lu * s},${v[1] + u[1] / lu * s} ${v[0] + u[0] / lu * s + w2[0] / lw * s},${v[1] + u[1] / lu * s + w2[1] / lw * s} ${v[0] + w2[0] / lw * s},${v[1] + w2[1] / lw * s}" fill="none" stroke="${C.red}" stroke-width="2"/>`; }
  return g(inner, 160, 115);
}

/* ---------- quadrilaterals ---------- */
const QUADS = {
  square: { pts: [[40, 15], [120, 15], [120, 95], [40, 95]], names: ['square', 'rectangle', 'rhombus', 'parallelogram', 'quadrilateral'], parallel: 2 },
  rectangle: { pts: [[20, 25], [140, 25], [140, 90], [20, 90]], names: ['rectangle', 'parallelogram', 'quadrilateral'], parallel: 2 },
  rhombus: { pts: [[80, 8], [140, 55], [80, 102], [20, 55]], names: ['rhombus', 'parallelogram', 'quadrilateral'], parallel: 2 },
  parallelogram: { pts: [[45, 22], [150, 22], [115, 92], [10, 92]], names: ['parallelogram', 'quadrilateral'], parallel: 2 },
  trapezoid: { pts: [[50, 22], [110, 22], [145, 92], [15, 92]], names: ['trapezoid', 'quadrilateral'], parallel: 1 },
  kite: { pts: [[80, 5], [125, 40], [80, 108], [35, 40]], names: ['kite', 'quadrilateral'], parallel: 0 },
  'irregular quadrilateral': { pts: [[20, 30], [130, 15], [145, 92], [45, 100]], names: ['quadrilateral'], parallel: 0 }
};
// Every drawing is fresh: random proportions for the kind (aspect, slant, top length …), then a random
// rotation, optional mirror and size, fitted to the frame. Similarity transforms never change the
// kind of shape, and seeing shapes turned stops students relying on how they usually sit.
const rr = (lo, hi) => lo + Math.random() * (hi - lo);
const QUAD_MAKE = {
  square: () => [[0, 0], [1, 0], [1, 1], [0, 1]],
  rectangle: () => { const h = rr(0.38, 0.68); return [[0, 0], [1, 0], [1, h], [0, h]]; },
  rhombus: () => { const h = rr(0.48, 0.68); return [[0, -h], [1, 0], [0, h], [-1, 0]]; },
  parallelogram: () => { const sl = rr(0.22, 0.48), h = rr(0.42, 0.7); return [[sl, 0], [sl + 1, 0], [1, h], [0, h]]; },
  trapezoid: () => { const t = rr(0.35, 0.72), a = rr(0.06, 1 - t - 0.06), h = rr(0.42, 0.7); return [[a, 0], [a + t, 0], [1, h], [0, h]]; },
  kite: () => { const top = rr(0.28, 0.5), bot = rr(0.85, 1.15), w = rr(0.36, 0.55); return [[0, -top], [w, 0], [0, bot], [-w, 0]]; }
};
export function fitShape(pts, { W = 160, H = 115, pad = 9, turn = true } = {}) {
  const th = turn ? (pick([0, 0, 0, 0, 12, -12, 90, 180]) * Math.PI) / 180 : 0, flip = turn && Math.random() < 0.3 ? -1 : 1;
  const q = pts.map(([x, y]) => [flip * x * Math.cos(th) - y * Math.sin(th), flip * x * Math.sin(th) + y * Math.cos(th)]);
  const xs = q.map(p => p[0]), ys = q.map(p => p[1]), w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
  const k = Math.min((W - 2 * pad) / w, (H - 2 * pad) / h) * rr(0.78, 1), ox = (W - w * k) / 2 - Math.min(...xs) * k, oy = (H - h * k) / 2 - Math.min(...ys) * k;
  return q.map(([x, y]) => [Math.round((x * k + ox) * 10) / 10, Math.round((y * k + oy) * 10) / 10]);
}
const quadSvg = k => tint(g(poly(fitShape(QUAD_MAKE[k] ? QUAD_MAKE[k]() : QUADS[k].pts)), 160, 115));
const ALL_QUAD_NAMES = ['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid', 'kite', 'quadrilateral'];

/* ---------- angles & lines ---------- */
function angleSvg(deg, { label = false, w = 170, h = 120, arc = true } = {}) {
  const vx = 30, vy = h - 18, L = 110, rad = (deg * Math.PI) / 180, ex = vx + L * Math.cos(rad), ey = vy - L * Math.sin(rad);
  let inner = `<line x1="${vx}" y1="${vy}" x2="${vx + L}" y2="${vy}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/><line x1="${vx}" y1="${vy}" x2="${ex}" y2="${ey}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`;
  if (deg === 90) inner += `<polyline points="${vx + 16},${vy} ${vx + 16},${vy - 16} ${vx},${vy - 16}" fill="none" stroke="${C.red}" stroke-width="2"/>`;
  else if (arc) { const r = 24, ax = vx + r * Math.cos(rad), ay = vy - r * Math.sin(rad); inner += `<path d="M${vx + r},${vy} A${r},${r} 0 ${deg > 180 ? 1 : 0} 0 ${ax},${ay}" fill="none" stroke="${C.red}" stroke-width="2"/>`; }
  inner += `<circle cx="${vx}" cy="${vy}" r="3.5" fill="${C.ink}"/>`;
  if (label) inner += `<text x="${vx + 34}" y="${vy - 8}" font-size="13" fill="${C.red}" font-weight="700">${deg}°</text>`;
  return svg(w, h, inner, 'aria-label="angle"');
}
function protractor(deg) {
  const cx = 130, cy = 125, R_ = 110; let inner = `<path d="M${cx - R_},${cy} A${R_},${R_} 0 0 1 ${cx + R_},${cy} Z" fill="#e0f2fe" fill-opacity=".7" stroke="${C.ink}" stroke-width="1.5"/>`;
  for (let a = 0; a <= 180; a += 10) { const r1 = R_, r2 = R_ - (a % 30 === 0 ? 14 : 8), x1 = cx + r1 * Math.cos((a * Math.PI) / 180), y1 = cy - r1 * Math.sin((a * Math.PI) / 180), x2 = cx + r2 * Math.cos((a * Math.PI) / 180), y2 = cy - r2 * Math.sin((a * Math.PI) / 180); inner += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.ink}"/>${a % 30 === 0 ? `<text x="${cx + (R_ - 28) * Math.cos((a * Math.PI) / 180)}" y="${cy - (R_ - 28) * Math.sin((a * Math.PI) / 180) + 4}" font-size="11" text-anchor="middle" fill="${C.ink}">${a}</text>` : ''}`; }
  const ex = cx + (R_ + 10) * Math.cos((deg * Math.PI) / 180), ey = cy - (R_ + 10) * Math.sin((deg * Math.PI) / 180);
  inner += `<line x1="${cx - R_ - 10}" y1="${cy}" x2="${cx + R_ + 10}" y2="${cy}" stroke="${C.ink}" stroke-width="2"/><line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="${C.red}" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="3.5" fill="${C.ink}"/>`;
  return svg(260, 140, inner, 'aria-label="angle on a protractor"');
}
const linePair = kind => {
  const L = (x1, y1, x2, y2, col = C.ink) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`;
  if (kind === 'parallel') { const t = ri(-18, 18); return g(L(15, 35, 145, 35 + t) + L(15, 85, 145, 85 + t, C.primary)); }
  if (kind === 'perpendicular') { const a = ri(-30, 30), rad = (a * Math.PI) / 180; return g(L(80 - 65 * Math.cos(rad), 60 + 65 * Math.sin(rad), 80 + 65 * Math.cos(rad), 60 - 65 * Math.sin(rad)) + L(80 - 50 * Math.sin(rad), 60 - 50 * Math.cos(rad), 80 + 50 * Math.sin(rad), 60 + 50 * Math.cos(rad), C.primary)); }
  const ang = pick([25, 35, 50, 65]) * (Math.random() < 0.5 ? 1 : -1), rad = (ang * Math.PI) / 180; return g(L(15, 60, 145, 60) + L(80 - 55 * Math.cos(rad), 60 + 55 * Math.sin(rad), 80 + 55 * Math.cos(rad), 60 - 55 * Math.sin(rad), C.primary));
};

/* ---------- solids ---------- */
const solidSvg = name => {
  const S = `stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"`;
  const cube = (w, h, d) => `<polygon points="30,${20 + d} ${30 + w},${20 + d} ${30 + w},${20 + d + h} 30,${20 + d + h}" fill="#c7d2fe" ${S}/><polygon points="30,${20 + d} ${30 + d},20 ${30 + w + d},20 ${30 + w},${20 + d}" fill="#e0e7ff" ${S}/><polygon points="${30 + w},${20 + d} ${30 + w + d},20 ${30 + w + d},${20 + h} ${30 + w},${20 + d + h}" fill="#a5b4fc" ${S}/>`;
  const map = {
    cube: () => cube(70, 70, 28), 'rectangular prism': () => cube(100, 50, 28),
    cylinder: () => `<ellipse cx="80" cy="95" rx="45" ry="14" fill="#a5b4fc" ${S}/><rect x="35" y="30" width="90" height="65" fill="#a5b4fc" stroke="none"/><line x1="35" y1="30" x2="35" y2="95" stroke="${C.ink}" stroke-width="2"/><line x1="125" y1="30" x2="125" y2="95" stroke="${C.ink}" stroke-width="2"/><ellipse cx="80" cy="30" rx="45" ry="14" fill="#c7d2fe" ${S}/>`,
    cone: () => `<ellipse cx="80" cy="95" rx="45" ry="14" fill="#a5b4fc" ${S}/><polygon points="35,95 80,12 125,95" fill="#a5b4fc" stroke="none"/><line x1="35" y1="95" x2="80" y2="12" stroke="${C.ink}" stroke-width="2"/><line x1="125" y1="95" x2="80" y2="12" stroke="${C.ink}" stroke-width="2"/><path d="M35,95 A45,14 0 0 0 125,95" fill="#a5b4fc" ${S}/>`,
    sphere: () => `<defs><radialGradient id="sg" cx="35%" cy="35%"><stop offset="0%" stop-color="#e0e7ff"/><stop offset="100%" stop-color="#6366f1"/></radialGradient></defs><circle cx="80" cy="62" r="48" fill="url(#sg)" ${S}/>`,
    'square pyramid': () => `<polygon points="30,95 110,95 140,70 60,70" fill="#e0e7ff" ${S}/><polygon points="30,95 110,95 85,12" fill="#a5b4fc" ${S}/><polygon points="110,95 140,70 85,12" fill="#c7d2fe" ${S}/>`,
    'triangular pyramid': () => `<polygon points="25,100 120,100 145,72" fill="#e0e7ff" ${S}/><polygon points="25,100 120,100 82,12" fill="#a5b4fc" ${S}/><polygon points="120,100 145,72 82,12" fill="#c7d2fe" ${S}/>`,
    'triangular prism': () => `<polygon points="25,100 95,100 60,40" fill="#a5b4fc" ${S}/><polygon points="60,40 95,100 140,86 105,26" fill="#c7d2fe" ${S}/><polygon points="95,100 140,86 105,26 95,40 60,40" fill="none" ${S}/>`
  };
  const body = (map[name] || map.cube)();
  return tint(g(Math.random() < 0.5 ? body : `<g transform="translate(160,0) scale(-1,1)">${body}</g>`, 160, 125));
};
const DISPLAY_SOLIDS = ['cube', 'rectangular prism', 'cylinder', 'cone', 'sphere', 'square pyramid', 'triangular pyramid', 'triangular prism'];
const solidsFor = grade => (grade <= 2 ? ['cube', 'rectangular prism', 'cylinder', 'cone', 'sphere', 'square pyramid'] : DISPLAY_SOLIDS);
const POLYHEDRA = SOLIDS.filter(s => s[3] > 0 && s[4] > 0 && !['cylinder', 'cone', 'sphere'].includes(s[0]));
const solidFaces = name => SOLIDS.find(s => s[0] === name);
export const REAL = { cube: ['a dice 🎲', 'a sugar cube', 'a Rubik’s cube', 'a block of ice in a drink', 'a square tissue box'], 'rectangular prism': ['a cereal box 📦', 'a brick', 'a shoebox', 'a carton of milk', 'a hardcover book', 'a fridge'], cylinder: ['a soup can 🥫', 'a drum', 'a pipe', 'a roll of paper towels', 'a candle', 'a tin of tuna'], cone: ['an ice cream cone 🍦', 'a party hat', 'a traffic cone', 'a funnel'], sphere: ['a soccer ball ⚽', 'a marble', 'a globe 🌍', 'a basketball', 'an orange', 'a bowling ball'], 'square pyramid': ['a pyramid in Egypt', 'a tent roof', 'a pyramid-shaped paperweight'] };

/* ---------- nets ---------- */
function netSvg(name) {
  const U = 36, S = `stroke="${C.ink}" stroke-width="2"`, sq = (x, y) => `<rect x="${x * U + 6}" y="${y * U + 6}" width="${U}" height="${U}" fill="#c7d2fe" ${S}/>`;
  const tri = (x, y, dir) => { const X = x * U + 6, Y = y * U + 6, P = { up: [[X, Y + U], [X + U, Y + U], [X + U / 2, Y]], down: [[X, Y], [X + U, Y], [X + U / 2, Y + U]], left: [[X + U, Y], [X + U, Y + U], [X, Y + U / 2]], right: [[X, Y], [X, Y + U], [X + U, Y + U / 2]] }[dir]; return `<polygon points="${P.map(p => p.join(',')).join(' ')}" fill="#fde68a" ${S}/>`; };
  if (name === 'cube') return svg(4 * U + 12, 3 * U + 12, [sq(1, 0), sq(0, 1), sq(1, 1), sq(2, 1), sq(3, 1), sq(1, 2)].join(''));
  if (name === 'rectangular prism') return svg(4 * U + 12, 3 * U + 12, `<rect x="${1 * U + 6}" y="6" width="${U}" height="${U * 1.5}" fill="#c7d2fe" ${S}/><rect x="6" y="${U * 1.5 + 6}" width="${U * 1.5}" height="${U * 1.5}" fill="#c7d2fe" ${S}/><rect x="${U * 1.5 + 6}" y="${U * 1.5 + 6}" width="${U}" height="${U * 1.5}" fill="#c7d2fe" ${S}/><rect x="${U * 2.5 + 6}" y="${U * 1.5 + 6}" width="${U * 1.5}" height="${U * 1.5}" fill="#c7d2fe" ${S}/>`.replace('"4"', '"4"'));
  if (name === 'square pyramid') return svg(3 * U + 12, 3 * U + 12, sq(1, 1) + tri(1, 0, 'up') + tri(0, 1, 'left') + tri(2, 1, 'right') + tri(1, 2, 'down'));
  if (name === 'triangular prism') return svg(4 * U + 12, 3 * U + 12, sq(0, 1) + sq(1, 1) + sq(2, 1) + tri(1, 0, 'up') + tri(1, 2, 'down'));
  if (name === 'triangular pyramid') return svg(3 * U + 12, 2 * U + 12, tri(0, 1, 'up') + tri(1, 1, 'up') + tri(2, 1, 'up') + tri(1, 0, 'down'));
  return svg(120, 80, sq(0, 0));
}

/* ---------- transformations (F-shaped glyph) ---------- */
const F_PTS = [[0, 0], [30, 0], [30, 10], [10, 10], [10, 22], [24, 22], [24, 32], [10, 32], [10, 50], [0, 50]];
const place = (pts, ox, oy, tf) => pts.map(([x, y]) => { let X = x - 15, Y = y - 25; if (tf === 'flip') X = -X; if (tf === 'flipv') Y = -Y; if (tf === 'turn90') [X, Y] = [-Y, X]; if (tf === 'turn180') [X, Y] = [-X, -Y]; if (tf === 'turn270') [X, Y] = [Y, -X]; return [ox + X, oy + Y]; });
const tfSvg = (tf, gap = 90) => g(`<polygon points="${place(F_PTS, 45, 62, 'none').map(p => p.join(',')).join(' ')}" fill="#c7d2fe" ${stroke()}/><polygon points="${place(F_PTS, 45 + gap + (tf === 'slide' ? 0 : 0), 62, tf === 'slide' ? 'none' : tf).map(p => p.join(',')).join(' ')}" fill="#fde68a" stroke="${C.accent}" stroke-width="3" stroke-linejoin="round"/>` + `<text x="45" y="120" font-size="12" text-anchor="middle" fill="${C.ink}">Before</text><text x="${45 + gap}" y="120" font-size="12" text-anchor="middle" fill="${C.ink}">After</text>`, 190, 128);
const TF_NAME = { slide: 'slide (translation)', flip: 'flip (reflection)', turn90: 'turn (rotation)', turn180: 'turn (rotation)' };

/* ---------- congruence & symmetry pictures ---------- */
function congruentPair(same) {
  const base = pick([[[0, 40], [70, 40], [35, 0]], [[0, 0], [60, 0], [60, 40], [0, 40]], [[0, 30], [30, 0], [60, 30], [30, 60]]]);
  const sc = same ? 1 : pick([0.6, 1.5]), rot = same ? pick([0, 1]) : 0;
  const scalePts = (pts, s, ox, oy, flip) => pts.map(([x, y]) => [ox + (flip ? -x : x) * s + (flip ? 70 * s : 0), oy + y * s]);
  return g(`<polygon points="${scalePts(base, 1, 15, 40, false).map(p => p.join(',')).join(' ')}" fill="#c7d2fe" ${stroke()}/><polygon points="${scalePts(base, sc, 95, 30 + (same ? 10 : 0), !!rot).map(p => p.join(',')).join(' ')}" fill="#fde68a" stroke="${C.accent}" stroke-width="3" stroke-linejoin="round"/>`, 190, 120);
}
function symFigure(kind, drawLine) {   // kind: shape name; drawLine: 'v'|'h'|'d'|'none'
  const shapes = {
    rectangle: { svg: `<rect x="20" y="25" width="120" height="70" fill="#c7d2fe" ${stroke()}/>`, lines: { v: true, h: true, d: false } },
    square: { svg: `<rect x="40" y="10" width="80" height="80" fill="#c7d2fe" ${stroke()}/>`, lines: { v: true, h: true, d: true } },
    isosceles: { svg: poly([[80, 8], [135, 95], [25, 95]]), lines: { v: true, h: false, d: false } },
    circle: { svg: `<circle cx="80" cy="55" r="45" fill="#c7d2fe" ${stroke()}/>`, lines: { v: true, h: true, d: true } },
    parallelogram: { svg: poly([[45, 22], [145, 22], [115, 92], [15, 92]]), lines: { v: false, h: false, d: false } },
    heart: { svg: `<path d="M80,95 C20,55 35,15 80,40 C125,15 140,55 80,95 Z" fill="#fecaca" ${stroke()}/>`, lines: { v: true, h: false, d: false } }
  };
  const s = shapes[kind], cx = kind === 'square' ? 80 : 80, line = { v: `<line x1="${cx}" y1="2" x2="${cx}" y2="108" stroke="${C.red}" stroke-width="2.5" stroke-dasharray="6 4"/>`, h: `<line x1="5" y1="55" x2="155" y2="55" stroke="${C.red}" stroke-width="2.5" stroke-dasharray="6 4"/>`, d: `<line x1="35" y1="105" x2="125" y2="5" stroke="${C.red}" stroke-width="2.5" stroke-dasharray="6 4"/>` }[drawLine] || '';
  const isSym = drawLine === 'none' ? false : kind === 'square' && drawLine === 'd' ? true : s.lines[drawLine];
  return { html: g(s.svg + line, 160, 112), isSym };
}
const LINES_OF_SYM = { triangle: 3, square: 4, rectangle: 2, rhombus: 2, pentagon: 5, hexagon: 6, octagon: 8, circle: '∞', 'isosceles triangle': 1, 'scalene triangle': 0, parallelogram: 0, trapezoid: 0 };

/* ---------- compose shapes ---------- */
const COMPOSE = [
  ['two triangles', 'a square or a rectangle or a parallelogram', ['a hexagon', 'a circle']], ['two squares', 'a rectangle', ['a triangle', 'a circle']], ['six triangles', 'a hexagon', ['a square', 'a circle']],
  ['a rectangle and a triangle', 'a house shape (a pentagon)', ['a circle', 'a hexagon']], ['two trapezoids', 'a hexagon', ['a circle', 'a triangle']], ['four squares', 'a bigger square', ['a circle', 'a triangle']],
  ['two equal right triangles', 'a rectangle', ['a circle', 'a pentagon']], ['two equilateral triangles', 'a rhombus', ['a circle', 'a pentagon']], ['three equilateral triangles', 'a trapezoid', ['a circle', 'a square']],
  ['two rectangles side by side', 'a bigger rectangle', ['a circle', 'a triangle']], ['two half circles', 'a circle', ['a square', 'a triangle']], ['four equal right triangles', 'a square', ['a circle', 'a hexagon']],
  ['a square and a triangle on top', 'a house shape (a pentagon)', ['a circle', 'a hexagon']], ['three rhombuses', 'a hexagon', ['a circle', 'a triangle']], ['three squares in a row', 'a long rectangle', ['a circle', 'a triangle']],
  ['two small squares and one rectangle', 'a bigger rectangle', ['a circle', 'a triangle']], ['eight triangles', 'an octagon', ['a circle', 'a square']], ['two equal rectangles', 'a bigger square', ['a circle', 'a triangle']]
];

/* ---------- spatial sense ---------- */
const ANIMALS = ['🐶', '🐱', '🐰', '🐸', '🐻', '🦊', '🐼', '🐵'];

export const GEOMETRY_RULES = [
  /* ===== 2-D shapes ===== */
  R(/^Name the two-dimensional shape$|^Name the two-dimensional shape and explain your answer$|^Identify two-dimensional shapes$/, (mt, ctx) => () => {
    const names = shapeNames(ctx.grade), s = pick(names), others = sample(names, 3, [s]);
    return mc(`${shapeSvg(s, 100)}What is the name of this shape?`, s, others, `This is a ${b(s)}${SIDES[s] ? ` — it has ${SIDES[s]} sides` : ''}.`);
  }),
  R(/^Select two-dimensional shapes$/, (mt, ctx) => () => {
    const names = shapeNames(ctx.grade), s0 = pick(names), pool = shuffle(sample(names, 3, [s0]).concat(s0)), L = 'ABCD'[pool.indexOf(s0)];
    return mc(`Which picture shows a ${b(s0)}?<div style="display:flex;gap:12px;flex-wrap:wrap">${pool.map((n, i) => `<span><b>${'ABCD'[i]}</b>${shapeSvg(n, 80)}</span>`).join('')}</div>`, L, 'ABCD'.split('').filter(x => x !== L), `Picture ${b(L)} is a ${s0}.`, 4);
  }),
  R(/^Rhombuses$|^Rectangles$/, (mt, ctx) => () => {
    const want = /Rhomb/.test(ctx.title) ? 'rhombus' : 'rectangle', others = ['rhombus', 'rectangle', 'trapezoid', 'parallelogram', 'triangle'].filter(x => x !== want);
    const pic = (k, sz = 90) => (k === 'triangle' ? shapeSvg('triangle', sz) : quadSvg(k));
    const form = ri(0, 3);
    if (form === 1) { const pool = shuffle(sample(others, 3).concat(want)), L = 'ABCD'[pool.indexOf(want)]; return mc(`Which picture shows a ${b(want)}?${picChoices(pool, k => pic(k, 80))}`, L, 'ABCD'.split('').filter(x => x !== L), `Picture ${b(L)} is a ${want}.`, 4); }
    if (form === 2) { const s = Math.random() < 0.5 ? want : pick(others), names = ['rhombus', 'rectangle', 'trapezoid', 'parallelogram']; if (s === 'triangle') return null; return mc(`${pic(s)}What is the name of this shape?`, s, names.filter(x => x !== s), `This shape is a ${b(s)}.`, 4); }
    const s = Math.random() < 0.5 ? want : pick(others);
    return yesNo(`${pic(s)}${pick([`Is this shape a ${b(want)}?`, `Is this a ${b(want)}? ${want === 'rhombus' ? '(A rhombus has 4 equal sides.)' : '(A rectangle has 4 square corners.)'}`])}`, s === want, s === want ? `Yes, it is a ${want}.` : `No — it is a ${s}.`, ['Yes', 'No']);
  }),
  R(/^Count sides and vertices$|^Count and compare sides and vertices$|^Compare sides and vertices$/, (mt, ctx) => () => {
    const pool = shapeNames(ctx.grade).filter(x => SIDES[x] > 0), s = pick(pool), n = SIDES[s];
    const pic = (k, sz = 100) => (['rectangle', 'rhombus', 'parallelogram', 'trapezoid'].includes(k) ? quadSvg(k) : shapeSvg(k, sz));
    if (/Compare/.test(ctx.title)) {
      const [a, c] = sample(pool, 2, []); if (SIDES[a] === SIDES[c]) return null;
      const w = pick(['sides', 'vertices (corners)']), more = ri(0, 1) === 0, ans = (SIDES[a] > SIDES[c]) === more ? a : c;
      return mc(`Which has ${more ? 'more' : 'fewer'} ${w}: a ${b(a)} or a ${b(c)}?`, ans, [ans === a ? c : a], `A ${a} has ${SIDES[a]} ${w.split(' ')[0]} and a ${c} has ${SIDES[c]}.`, 2);
    }
    const form = ri(0, 3);
    if (form === 2) { const k = pick([3, 4, 5, 6, 7, 8].filter(x => pool.some(p => SIDES[p] === x))), ok = pool.filter(p => SIDES[p] === k), ans = pick(ok); return mc(`Which shape has ${b(k + ' ' + pick(['sides', 'vertices (corners)']))}?`, ans, sample(pool.filter(p => SIDES[p] !== k), 3), `A ${ans} has ${k} sides and ${k} vertices.`, 4); }
    if (form === 3) return num(`How many ${pick(['sides', 'vertices (corners)'])} does a ${b(s)} have?`, n, `A ${s} has ${b(n)} sides and ${n} vertices.`);
    return form === 0 ? num(`${pic(s)}How many sides does this shape have?`, n, `Count the sides: ${b(n)}.`) : num(`${pic(s)}How many vertices (corners) does this shape have?`, n, `A polygon has as many vertices as sides: ${b(n)}.`);
  }),
  R(/^Number of sides in polygons$/, () => () => {
    const s = pick(POLYGONS), f = ri(0, 3), k = ri(2, 4);
    if (f === 1) return mc(`A polygon has ${b(SIDES[s] + ' sides')}. What is it called?`, s, sample(POLYGONS.filter(x => SIDES[x] !== SIDES[s]), 3), `A polygon with ${SIDES[s]} sides is a ${b(s)}.`, 4);
    if (f === 2) return num(`How many ${pick(['vertices (corners)', 'angles'])} does a ${b(s)} have?`, SIDES[s], `A ${s} has ${b(SIDES[s])} sides, so it has ${SIDES[s]} vertices and ${SIDES[s]} angles.`);
    if (f === 3) return num(`How many sides are there in all on ${b(k)} ${s}s?`, k * SIDES[s], `${k} × ${SIDES[s]} = ${b(k * SIDES[s])}.`);
    return num(`How many sides does a ${b(s)} have?`, SIDES[s], `A ${s} has ${b(SIDES[s])} sides.`);
  }),
  R(/^Equal sides$/, () => () => {
    const EQ = ['square', 'rhombus', 'equilateral triangle', 'regular pentagon', 'regular hexagon', 'regular octagon'], NE = ['rectangle', 'trapezoid', 'parallelogram', 'kite', 'scalene triangle', 'right triangle', 'isosceles triangle'];
    const form = ri(0, 3);
    if (form === 2) { const ans = pick(EQ); return mc(`Which shape always has ${b('all sides equal')} in length?`, ans, sample(NE, 3), `A ${ans} has all its sides equal.`, 4); }
    if (form === 3) { const ans = pick(NE); return mc(`Which shape does ${b('not')} always have all sides equal in length?`, ans, sample(EQ, 3), `The sides of a ${ans} are not always all equal.`, 4); }
    const s = form === 0 ? pick(['square', 'rectangle', 'triangle', 'rhombus', 'trapezoid', 'parallelogram']) : pick(EQ.concat(NE)), allEqual = EQ.includes(s) || s === 'triangle' && false;
    const isEq = EQ.includes(s);
    return yesNo(`Does a ${b(s)} always have ${b('all sides equal')} in length?`, isEq, isEq ? `A ${s} has all its sides equal.` : `The sides of a ${s} can be different lengths.`, ['Yes', 'No']);
  }),
  R(/^Square corners$/, () => () => {
    const form = ri(0, 1);
    if (form === 0) {
      const s = pick(['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid', 'right scalene', 'acute equilateral']), n = { square: 4, rectangle: 4, rhombus: 0, parallelogram: 0, trapezoid: 0, 'right scalene': 1, 'acute equilateral': 0 }[s];
      return num(`${QUADS[s] ? quadSvg(s) : triSvg(s, { showTicks: false })}How many square corners (right angles) does this shape have?`, n, `Count the corners that are square: ${b(n)}.`);
    }
    const s = pick(['square', 'rectangle', 'triangle', 'circle', 'rhombus', 'pentagon', 'hexagon', 'parallelogram']), n = { square: 4, rectangle: 4 }[s] || 0;
    return num(`How many square corners (right angles) does a typical ${b(s)} have? ${s === 'triangle' ? '(A triangle with no right angle.)' : s === 'rhombus' ? '(A rhombus that is not a square.)' : s === 'parallelogram' ? '(A parallelogram that is not a rectangle.)' : ''}`, n, `A ${s} has ${b(n)} square corners.`);
  }),
  R(/^Open and closed shapes$/, () => () => {
    const closed = Math.random() < 0.5, pic = closed ? g(poly([[30, 20], [120, 30], [100, 95], [40, 90]])) : g(`<polyline points="30,25 120,30 100,95 40,90" fill="none" ${stroke()}/>`);
    return yesNo(`${pic}Is this shape ${b('closed')}?`, closed, closed ? 'All the sides connect, so it is closed.' : 'There is a gap, so it is open.', ['Yes, closed', 'No, open']);
  }),
  R(/^Attributes of two-dimensional shapes$|^Attributes of polygons$|^Properties of polygons$/, () => () => {
    const q = pick([['A shape with 3 sides', 'triangle'], ['A shape with 4 equal sides and 4 right angles', 'square'], ['A shape with 6 sides', 'hexagon'], ['A shape with 5 sides', 'pentagon'], ['A shape with 8 sides', 'octagon'], ['A shape with no straight sides', 'circle'], ['A shape with 4 sides where opposite sides are equal and all angles are right angles', 'rectangle'],
      ['A shape with 7 sides', 'heptagon'], ['A shape with 9 sides', 'nonagon'], ['A shape with 10 sides', 'decagon'], ['A shape with 3 corners', 'triangle'], ['A shape with 6 corners', 'hexagon'], ['A shape with 5 corners', 'pentagon'], ['A shape with 8 corners', 'octagon'], ['A four-sided shape with exactly one pair of parallel sides', 'trapezoid'], ['A four-sided shape with 4 equal sides that is not a square because its angles are not right angles', 'rhombus'], ['A four-sided shape with two pairs of parallel sides but no right angles', 'parallelogram']]);
    const all = ['triangle', 'square', 'hexagon', 'pentagon', 'octagon', 'circle', 'rectangle', 'heptagon', 'nonagon', 'decagon', 'trapezoid', 'rhombus', 'parallelogram'];
    return mc(`Which shape is described? ${b(q[0])}`, q[1], sample(all, 3, [q[1]]), `It is a ${b(q[1])}.`, 4);
  }),
  R(/^Sort two-dimensional shapes$/, (mt, ctx) => () => {
    const names = ctx.grade <= 0 ? ['triangle', 'square', 'circle', 'pentagon', 'hexagon', 'rectangle', 'oval', 'octagon'] : ['triangle', 'square', 'circle', 'pentagon', 'hexagon', 'rectangle', 'oval', 'octagon', 'rhombus', 'trapezoid'];
    const cat = s => (SIDES[s] === 0 ? 'No straight sides' : SIDES[s] <= 4 ? '3 or 4 sides' : '5 or more sides');
    const form = ri(0, 3);
    if (form === 1) {            // which shape belongs in the group
      const n = pick([3, 4, 5, 6, 8]), want = `${n} sides`, ok = names.filter(x => SIDES[x] === n), s0 = pick(ok), pool = shuffle(sample(names.filter(x => SIDES[x] !== n), 3).concat(s0)), L = 'ABCD'[pool.indexOf(s0)];
      return mc(`Which shape belongs in the group ${b(`"shapes with ${want}"`)}?${picChoices(pool, x => shapeSvg(x, 80))}`, L, 'ABCD'.split('').filter(x => x !== L), `Picture ${b(L)} is a ${s0}, and a ${s0} has ${n} sides.`, 4);
    }
    if (form === 2) {            // curved vs straight
      const s = pick(names);
      return mc(`${shapeSvg(s, 90)}Look at this shape. Which group does it belong to?`, SIDES[s] === 0 ? 'Has a curved edge' : 'Has only straight sides', [SIDES[s] === 0 ? 'Has only straight sides' : 'Has a curved edge'], `A ${s} ${SIDES[s] === 0 ? 'has a curved edge' : 'has only straight sides'}.`, 2);
    }
    if (form === 3) {            // odd one out
      const grp = pick(['3 or 4 sides', '5 or more sides']), inG = names.filter(x => SIDES[x] > 0 && cat(x) === grp), out = names.filter(x => cat(x) !== grp);
      if (inG.length < 3) return null;
      const odd = pick(out), pool = shuffle(sample(inG, 3).concat(odd)), L = 'ABCD'[pool.indexOf(odd)];
      return mc(`Three of these shapes belong to the group ${b(`"${grp}"`)}. Which one does ${b('not')} belong?${picChoices(pool, x => shapeSvg(x, 80))}`, L, 'ABCD'.split('').filter(x => x !== L), `Picture ${b(L)} is a ${odd}, which is not in the group "${grp}".`, 4);
    }
    const s = pick(names);
    return mc(`${shapeSvg(s, 90)}Sort this shape. Which group does it belong to?`, cat(s), ['No straight sides', '3 or 4 sides', '5 or more sides'].filter(x => x !== cat(s)), `A ${s} ${SIDES[s] ? `has ${SIDES[s]} sides` : 'has no straight sides'}: ${b(cat(s))}.`, 3);
  }),
  R(/^Two-dimensional shapes in the real world$|^Two-dimensional shapes in real-world objects$/, () => () => {
    const ALL = [['a clock face', 'circle'], ['a stop sign', 'octagon'], ['a slice of pizza', 'triangle'], ['a window pane', 'rectangle'], ['a chessboard square', 'square'], ['a yield sign', 'triangle'], ['a loonie coin', 'circle'], ['a door', 'rectangle'],
      ['a slice of cheese', 'square'], ['a hockey puck seen from above', 'circle'], ['a picture frame', 'rectangle'], ['a pizza box lid', 'square'], ['a dinner plate', 'circle'], ['a book cover', 'rectangle'],
      ['a road sign for a school zone (pentagon)', 'pentagon'], ['a honeycomb cell', 'hexagon'], ['a sheet of notebook paper', 'rectangle'], ['a pizza', 'circle'], ['a Canadian flag', 'rectangle'], ['a nacho chip', 'triangle'], ['a tile on a floor', 'square'], ['a wheel', 'circle'], ['a slice of bread', 'square'], ['a pennant flag', 'triangle'], ['a ping-pong table top', 'rectangle']];
    const q = pick(ALL), shapes = ['circle', 'octagon', 'triangle', 'rectangle', 'square', 'hexagon', 'pentagon'];
    return mc(pick([`What shape is ${b(q[0])}?`, `Which shape does ${b(q[0])} look like?`]), q[1], shapes.filter(x => x !== q[1]), `${q[0][0].toUpperCase() + q[0].slice(1)} is a ${b(q[1])}.`, 4);
  }),
  R(/^Compose two-dimensional shapes(?:: which shapes can you make\?)?$/, () => () => {
    const [parts, ans, wrong] = pick(COMPOSE);
    const stem = pick([`What can you make by putting together ${b(parts)}?`, `Which shape can you build with ${b(parts)}?`]);
    return mc(stem, ans, wrong, `${parts[0].toUpperCase() + parts.slice(1)} can make ${b(ans)}.`, 3);
  }),
  R(/^Congruent shapes$|^Identify congruent (?:shapes|figures)$/, () => () => {
    const f = ri(0, 2);
    if (f === 1) { const sh = pick(['square', 'rectangle']), a = ri(2, 12), c = sh === 'square' ? a : ri(2, 12), same = Math.random() < 0.5; let a2 = a, c2 = c; if (!same) { if (sh === 'square') a2 = a + pick([-1, 1, 2]) || a + 1; else { c2 = c + pick([-1, 1, 2]) || c + 1; } if (a2 <= 0) a2 = a + 1; if (c2 <= 0) c2 = c + 1; } const A = sh === 'square' ? `a square with side ${a} cm` : `a rectangle ${a} cm by ${c} cm`, B2 = sh === 'square' ? `a square with side ${a2} cm` : (same && Math.random() < 0.5 ? `a rectangle ${c} cm by ${a} cm` : `a rectangle ${a2} cm by ${c2} cm`);
      const cong = sh === 'square' ? a === a2 : (a === a2 && c === c2) || (a === c2 && c === a2); return yesNo(`Are ${A} and ${B2} congruent?`, cong, cong ? 'They have the same size and shape, so they are congruent.' : 'Their sizes are different, so they are not congruent.', ['Yes', 'No']); }
    if (f === 2) { const T = [['Two shapes that are the same size and the same shape are congruent.', true], ['Congruent shapes can be flipped or turned and still be congruent.', true], ['Two squares of different sizes are congruent.', false], ['A shape and its mirror image (a flip) are congruent.', true], ['Two circles with different radii are congruent.', false], ['A triangle that has been slid to a new place is still congruent to the original.', true], ['A small rectangle and a bigger rectangle with the same shape are congruent.', false], ['Two circles with the same radius are congruent.', true]], t = pick(T); return yesNo(`True or false? ${b(t[0])}`, t[1], t[1] ? 'This is true.' : 'This is false.', ['True', 'False']); }
    const same = Math.random() < 0.5;
    return yesNo(`${congruentPair(same)}Are these two figures congruent? (same size and same shape)`, same, same ? 'They are the same size and shape (one may be flipped or turned).' : 'One is bigger than the other, so they are not congruent.', ['Yes', 'No']);
  }),
  R(/^Flip, turn and slide$|^Reflection, rotation and translation$|^Combinations of reflections, rotations and translations$/, (mt, ctx) => () => {
    const tf = pick(['slide', 'flip', 'turn90', 'turn180']);
    const nm = { slide: 'slide', flip: 'flip', turn90: 'turn', turn180: 'turn' }[tf], gradeUp = ctx.grade >= 3, label = gradeUp ? { slide: 'translation', flip: 'reflection', turn90: 'rotation', turn180: 'rotation' }[tf] : nm;
    const choices = gradeUp ? ['translation', 'reflection', 'rotation'] : ['slide', 'flip', 'turn'];
    return mc(`${tfSvg(tf)}Which move takes the blue shape to the orange shape?`, label, choices.filter(x => x !== label), `The shape ${label === 'slide' || label === 'translation' ? 'moves without turning' : label === 'flip' || label === 'reflection' ? 'is mirrored' : 'is turned around a point'}: ${b(label)}.`, 3);
  }),
  R(/^Symmetry$|^Identify lines of symmetry$|^Lines of symmetry$/, () => () => {
    const kind = pick(['rectangle', 'square', 'isosceles', 'circle', 'parallelogram', 'heart']), ln = pick(['v', 'h', 'd']);
    const { html, isSym } = symFigure(kind, ln);
    return yesNo(`${html}Is the dashed line a ${b('line of symmetry')}?`, isSym, isSym ? 'Folding along the line makes both halves match.' : 'The two sides would not match if you folded along the line.', ['Yes', 'No']);
  }),
  R(/^Draw lines of symmetry$|^Count lines of symmetry$/, () => () => {
    const L2 = { square: 4, 'rectangle that is not a square': 2, 'rhombus that is not a square': 2, 'regular pentagon': 5, 'regular hexagon': 6, 'regular heptagon': 7, 'regular octagon': 8, 'regular nonagon': 9, 'regular decagon': 10, 'equilateral triangle': 3, 'isosceles triangle that is not equilateral': 1, 'scalene triangle': 0, 'parallelogram that is not a rectangle or rhombus': 0, 'kite that is not a rhombus': 1, 'isosceles trapezoid': 1, 'right isosceles triangle': 1 };
    const names = Object.keys(L2), form = ri(0, 2);
    if (form === 2) { const n = pick([1, 2, 3, 4, 5, 6, 8]), ok = names.filter(x => L2[x] === n); if (!ok.length) return null; const ans = pick(ok); return mc(`Which shape has exactly ${b(n + ' line' + (n === 1 ? '' : 's'))} of symmetry?`, ans, sample(names.filter(x => L2[x] !== n), 3), `A ${ans} has ${b(n)} line${n === 1 ? '' : 's'} of symmetry.`, 4); }
    const k = pick(names), n = L2[k];
    return num(`How many lines of symmetry does a ${b(k)} have?`, n, `A ${k} has ${b(n)} line${n === 1 ? '' : 's'} of symmetry.`);
  }),
  R(/^Rotational symmetry$/, () => () => {
    const T = [['square', 4], ['rectangle that is not a square', 2], ['regular hexagon', 6], ['equilateral triangle', 3], ['parallelogram that is not a rhombus', 2], ['regular pentagon', 5], ['regular octagon', 8], ['rhombus that is not a square', 2], ['regular heptagon', 7], ['regular decagon', 10], ['regular nonagon', 9]];
    const k = pick(T);
    if (ri(0, 1)) return num(`What is the smallest turn, in degrees, that makes a ${b(k[0])} look the same?`, 360 / k[1], `A full turn is 360°. ${k[1]} matching positions means turns of 360 ÷ ${k[1]} = ${b(360 / k[1])}°.`);
    return num(`How many times does a ${b(k[0])} look the same during one full turn (order of rotational symmetry)?`, k[1], `A ${k[0]} has rotational symmetry of order ${b(k[1])}.`);
  }),
  R(/^Is it a polygon\?$/, () => () => {
    if (Math.random() < 0.6) {
      const isPoly = Math.random() < 0.5, n = ri(3, 8), pts = Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI + rr(-0.25, 0.25), r = rr(0.6, 1); return [Math.cos(t) * r, Math.sin(t) * r]; }), fit = fitShape(pts);
      let inner;
      if (isPoly) inner = poly(fit);
      else { const how = n >= 5 ? ri(0, 2) : pick([0, 2]); inner = how === 0 ? `<polyline points="${fit.map(p => p.join(',')).join(' ')}" fill="none" ${stroke()}/>` : how === 1 ? `<path d="M${fit[0]} ${fit.slice(1).map((p, i) => (i === 0 ? `Q${(fit[0][0] + p[0]) / 2},${fit[0][1] - 40} ${p}` : `L${p}`)).join(' ')} Z" fill="#c7d2fe" ${stroke()}/>` : `<ellipse cx="80" cy="57" rx="${ri(40, 60)}" ry="${ri(25, 45)}" fill="#c7d2fe" ${stroke()}/>`; }
      return yesNo(`${g(inner)}Is this figure a polygon?`, isPoly, isPoly ? 'It is closed and made only of straight sides.' : 'A polygon is closed and made of straight sides only — this figure is not.', ['Yes', 'No']);
    }
    const poly_ = Math.random() < 0.5, pic = poly_ ? g(poly(pick([[[30, 20], [130, 30], [110, 100], [20, 85]], [[80, 8], [140, 55], [100, 105], [30, 90], [20, 40]], [[20, 100], [80, 10], [140, 100]]]))) : pick([g(`<circle cx="80" cy="55" r="45" fill="#c7d2fe" ${stroke()}/>`), g(`<polyline points="25,95 60,30 100,85 135,20" fill="none" ${stroke()}/>`), g(`<path d="M20,90 Q80,0 140,90 Z" fill="#c7d2fe" ${stroke()}/>`)]);
    return yesNo(`${pic}Is this figure a polygon?`, poly_, poly_ ? 'It is closed and made only of straight sides.' : 'A polygon is closed and made of straight sides only — this figure is not.', ['Yes', 'No']);
  }),
  R(/^Regular and irregular polygons$/, () => () => {
    const form = ri(0, 2);
    if (form === 2) {
      const T = [['square', true], ['equilateral triangle', true], ['rectangle that is not a square', false], ['rhombus that is not a square', false], ['regular hexagon', true], ['regular octagon', true], ['regular pentagon', true], ['scalene triangle', false], ['parallelogram with no right angles', false], ['right triangle', false], ['kite', false], ['regular decagon', true], ['regular heptagon', true], ['trapezoid', false]];
      const [nm, reg] = pick(T);
      return mc(`Is a ${b(nm)} a regular polygon?`, reg ? 'Yes' : 'No', [reg ? 'No' : 'Yes'], reg ? 'All its sides and all its angles are equal.' : 'Its sides or angles are not all equal.', 2);
    }
    const reg = Math.random() < 0.5, name = pick(['pentagon', 'hexagon', 'octagon', 'heptagon', 'nonagon', 'decagon']);
    let pic;
    if (reg) pic = shapeSvg(name, 100);
    else { const n = ri(5, 8), pts = Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI + rr(-0.28, 0.28), r = rr(0.55, 1); return [Math.cos(t) * r, Math.sin(t) * r]; }); pic = tint(g(poly(fitShape(pts)), 160, 115)); }
    return mc(`${pic}Is this polygon regular or irregular?`, reg ? 'Regular' : 'Irregular', [reg ? 'Irregular' : 'Regular'], reg ? 'All sides and angles are equal.' : 'The sides and angles are not all equal.', 2);
  }),
  R(/^Sort polygons into Venn diagrams$/, () => () => {
    // R = has a right angle, F = has 4 sides, E = all sides equal, P = a pair of parallel sides, T = has 3 sides  (null = not always the same)
    const SH = { square: { R: 1, F: 1, E: 1, P: 1, T: 0 }, rectangle: { R: 1, F: 1, E: 0, P: 1, T: 0 }, rhombus: { R: null, F: 1, E: 1, P: 1, T: 0 }, parallelogram: { R: null, F: 1, E: 0, P: 1, T: 0 }, trapezoid: { R: null, F: 1, E: 0, P: 1, T: 0 }, kite: { R: null, F: 1, E: 0, P: 0, T: 0 },
      'equilateral triangle': { R: 0, F: 0, E: 1, P: 0, T: 1 }, 'right triangle': { R: 1, F: 0, E: 0, P: 0, T: 1 }, 'regular pentagon': { R: 0, F: 0, E: 1, P: 0, T: 0 }, 'regular hexagon': { R: 0, F: 0, E: 1, P: 1, T: 0 }, 'regular octagon': { R: 0, F: 0, E: 1, P: 1, T: 0 } };
    const TXT = { R: 'has a right angle', F: 'has 4 sides', E: 'has all sides equal', P: 'has a pair of parallel sides', T: 'has 3 sides' };
    const pair = pick([['R', 'F'], ['R', 'E'], ['F', 'E'], ['F', 'P'], ['E', 'P'], ['T', 'E'], ['R', 'P'], ['T', 'R']]), [A, B] = pair;
    const ok = Object.keys(SH).filter(k => SH[k][A] !== null && SH[k][B] !== null), nm = pick(ok), x = SH[nm][A], y = SH[nm][B];
    const where = x && y ? 'In both circles' : x ? `Only "${TXT[A]}"` : y ? `Only "${TXT[B]}"` : 'Outside both circles';
    return mc(`A Venn diagram has two circles: "${TXT[A]}" and "${TXT[B]}". Where does a ${b(nm)} go?`, where, ['In both circles', `Only "${TXT[A]}"`, `Only "${TXT[B]}"`, 'Outside both circles'].filter(v => v !== where), `A ${nm} ${x ? 'does' : 'does not'} have the first property (${TXT[A]}) and ${y ? 'does' : 'does not'} have the second (${TXT[B]}): ${b(where)}.`);
  }),
  R(/^Parts of a circle$/, () => () => {
    const q = pick([['the line from the centre to the edge', 'radius'], ['the line across the circle through the centre', 'diameter'], ['the distance around the circle', 'circumference'], ['a line joining two points on the circle', 'chord']]);
    if (Math.random() < 0.5) { const r = ri(2, 12); return num(`A circle has a radius of ${b(r + ' cm')}. What is its diameter? (cm)`, 2 * r, `Diameter = 2 × radius = ${b(2 * r)} cm.`); }
    return mc(`What is ${b(q[0])} called?`, q[1], ['radius', 'diameter', 'circumference', 'chord'].filter(x => x !== q[1]), `It is called the ${b(q[1])}.`);
  }),

  /* ===== triangles & quadrilaterals ===== */
  R(/^Acute, obtuse and right triangles$|^Types of triangles$/, (mt, ctx) => () => {
    const key = pick(Object.keys(TRIS)), t = TRIS[key];
    if (/Types of triangles/.test(ctx.title) && Math.random() < 0.5) return mc(`${triSvg(key)}Classify the triangle by its ${b('sides')}.`, t.sides, ['equilateral', 'isosceles', 'scalene'].filter(x => x !== t.sides), `Compare the side lengths: ${b(t.sides)}.`, 3);
    return mc(`${triSvg(key, { showTicks: false })}Is this triangle acute, obtuse or right?`, t.angles, ['acute', 'obtuse', 'right'].filter(x => x !== t.angles), `Check its largest angle: it is ${b(t.angles)}.`, 3);
  }),
  R(/^Scalene, isosceles and equilateral triangles$/, () => () => {
    const key = pick(Object.keys(TRIS)), t = TRIS[key];
    return mc(`${triSvg(key)}The red marks show equal sides. What kind of triangle is this by its sides?`, t.sides, ['equilateral', 'isosceles', 'scalene'].filter(x => x !== t.sides), `${t.sides === 'equilateral' ? 'All 3 sides are equal' : t.sides === 'isosceles' ? 'Exactly 2 sides are equal' : 'No sides are equal'}: ${b(t.sides)}.`, 3);
  }),
  R(/^Classify triangles$/, () => () => {
    const key = pick(Object.keys(TRIS).filter(k => k !== 'acute equilateral')), t = TRIS[key], ans = `${t.angles} ${t.sides}`;
    const all = Object.keys(TRIS).filter(k => k !== 'acute equilateral' && k !== key);
    return mc(`${triSvg(key)}Classify this triangle by both its angles and its sides.`, ans, uniq(all.map(k => `${TRIS[k].angles} ${TRIS[k].sides}`)).filter(x => x !== ans).slice(0, 3), `It is ${b(ans)}.`);
  }),
  R(/^Parallel sides in quadrilaterals$/, () => () => {
    const k = pick(['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid', 'kite', 'irregular quadrilateral']), n = QUADS[k].parallel;
    return mc(`${quadSvg(k)}How many pairs of parallel sides does this quadrilateral have?`, String(n), ['0', '1', '2'].filter(x => x !== String(n)), `It has ${b(n)} pair${n === 1 ? '' : 's'} of parallel sides.`, 3);
  }),
  R(/^Identify (parallelograms|trapezoids|rectangles|rhombuses)$/, mt => () => {
    const want = { parallelograms: 'parallelogram', trapezoids: 'trapezoid', rectangles: 'rectangle', rhombuses: 'rhombus' }[mt[1]], k = pick(['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid', 'kite']);
    const is = k === want || QUADS[k].names.includes(want);
    return yesNo(`${quadSvg(k)}Is this shape a ${b(want)}?`, is, is ? `Yes — it ${k === want ? 'is' : 'also counts as'} a ${want}.` : `No — it is a ${k}, not a ${want}.`, ['Yes', 'No']);
  }),
  R(/^Classify quadrilaterals$|^Attributes of quadrilaterals$/, () => () => {
    const k = pick(['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid', 'kite']);
    return mc(`${quadSvg(k)}What is the most specific name for this quadrilateral?`, k, ['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid', 'kite'].filter(x => x !== k), `The most specific name is ${b(k)}.`, 4);
  }),
  R(/^Pick all the names for a quadrilateral$/, () => () => {
    const k = pick(['square', 'rectangle', 'rhombus', 'parallelogram']), nm = QUADS[k].names, notName = ALL_QUAD_NAMES.filter(x => !nm.includes(x));
    return mc(`${quadSvg(k)}Which name does ${b('NOT')} describe this shape?`, pick(notName), sample(nm, 3), `A ${k} is also a ${nm.filter(x => x !== k).join(', ')}.`.replace('is also a ', 'can be called a ').replace(', quadrilateral', ' and quadrilateral'));
  }),
  R(/^Draw quadrilaterals$/, () => () => {
    const D = [['4 equal sides and 4 right angles', 'square'], ['2 pairs of parallel sides and 4 right angles but not all sides equal', 'rectangle'], ['4 equal sides but no right angles', 'rhombus'], ['exactly 1 pair of parallel sides', 'trapezoid'], ['2 pairs of parallel sides but no right angles', 'parallelogram'],
      ['4 right angles and 4 equal sides', 'square'], ['opposite sides equal and parallel, 4 right angles, and 2 sides longer than the other 2', 'rectangle'], ['4 equal sides and opposite angles equal (not right angles)', 'rhombus'], ['only 1 pair of parallel sides and 2 pairs of different-length sides', 'trapezoid'],
      ['opposite sides parallel and equal, no right angles, and sides of 2 different lengths', 'parallelogram']];
    const form = ri(0, 2), all = ['square', 'rectangle', 'rhombus', 'trapezoid', 'parallelogram'];
    if (form === 2) { const k = pick(['square', 'rectangle', 'rhombus', 'trapezoid', 'parallelogram']), pool = shuffle(sample(all, 3, [k]).concat(k)), L = 'ABCD'[pool.indexOf(k)]; return mc(`Which picture shows a ${b(k)}?${picChoices(pool, x => quadSvg(x))}`, L, 'ABCD'.split('').filter(x => x !== L), `Picture ${b(L)} is a ${k}.`, 4); }
    const q = pick(D);
    const ans = q[1], wrong = all.filter(x => x !== ans);
    return mc(pick([`Which quadrilateral has ${b(q[0])}?`, `Which shape has ${b(q[0])}?`]), ans, wrong, `That describes a ${b(ans)}.`);
  }),
  R(/^Identify the relationships between quadrilaterals$|^Describe relationships among quadrilaterals$/, () => () => {
    const T = [['Every square is a rectangle.', true], ['Every rectangle is a square.', false], ['Every rhombus is a parallelogram.', true], ['Every trapezoid is a parallelogram.', false], ['Every square is a rhombus.', true], ['Every parallelogram is a rectangle.', false],
      ['Every rectangle is a parallelogram.', true], ['Every rhombus is a square.', false], ['Every square is a parallelogram.', true], ['Every parallelogram is a rhombus.', false], ['Every rectangle is a quadrilateral.', true], ['Every quadrilateral is a square.', false],
      ['Every rhombus is a rectangle.', false], ['Every square is a quadrilateral.', true], ['Every rhombus is a quadrilateral.', true], ['Every kite is a parallelogram.', false], ['Every rectangle is a rhombus.', false], ['Every parallelogram is a quadrilateral.', true],
      ['A shape with 4 equal sides and 4 right angles is a square.', true], ['A shape with 4 equal sides must be a square.', false], ['A shape with 4 right angles must be a square.', false], ['A shape with 4 right angles is a rectangle.', true], ['A shape with 2 pairs of parallel sides is a parallelogram.', true], ['A shape with 2 pairs of parallel sides must be a rectangle.', false]];
    const t = pick(T);
    return yesNo(`True or false? ${b(t[0])}`, t[1], t[1] ? 'This is true.' : 'This is false.', ['True', 'False']);
  }),

  /* ===== 3-D shapes ===== */
  R(/^(?:Name|Identify) (?:the )?three-dimensional (?:shape|figure)s?$|^Name the three-dimensional shape$/, (mt, ctx) => () => {
    const names = solidsFor(ctx.grade), s = pick(names);
    return mc(`${solidSvg(s)}What is the name of this solid?`, s, sample(names, 3, [s]), `This solid is a ${b(s)}.`);
  }),
  R(/^Select three-dimensional shapes$/, (mt, ctx) => () => {
    const names = solidsFor(ctx.grade), s0 = pick(names), pool = shuffle(sample(names, 3, [s0]).concat(s0)), L = 'ABCD'[pool.indexOf(s0)];
    return mc(`Which picture shows a ${b(s0)}?<div style="display:flex;gap:12px;flex-wrap:wrap">${pool.map((n, i) => `<span><b>${'ABCD'[i]}</b>${solidSvg(n)}</span>`).join('')}</div>`, L, 'ABCD'.split('').filter(x => x !== L), `Picture ${b(L)} is a ${s0}.`, 4);
  }),
  R(/^Count vertices, edges and faces$|^Compare vertices, edges and faces$/, (mt, ctx) => () => {
    const [name, , f, e, v] = pick(POLYHEDRA.filter(s => (ctx.grade <= 2 ? ['cube', 'rectangular prism', 'square pyramid', 'triangular prism'].includes(s[0]) : true)));
    if (/Compare/.test(ctx.title)) { const [n2, , f2, e2, v2] = pick(POLYHEDRA.filter(s => s[0] !== name)); const part = pick([['faces', f, f2], ['edges', e, e2], ['vertices', v, v2]]); if (part[1] === part[2]) return null; const more = part[1] > part[2] ? name : n2; return mc(`Which has more ${part[0]}: a ${b(name)} or a ${b(n2)}?`, more, [more === name ? n2 : name], `A ${name} has ${part[1]} ${part[0]}; a ${n2} has ${part[2]}.`, 2); }
    const part = pick([['faces', f], ['edges', e], ['vertices', v]]);
    return num(`${DISPLAY_SOLIDS.includes(name) ? solidSvg(name) : ''}How many ${b(part[0])} does a ${b(name)} have?`, part[1], `A ${name} has ${b(part[1])} ${part[0]}.`);
  }),
  R(/^Identify faces of three-dimensional (?:shapes|figures)$/, () => () => {
    const q = pick([['cube', 'square'], ['rectangular prism', 'rectangle'], ['square pyramid', 'triangle and square'], ['triangular prism', 'triangle and rectangle'], ['cylinder', 'circle'], ['cone', 'circle']]), who = pick(NAMES), f = ri(0, 3);
    if (f === 3) { const [nm, , fc] = pick(POLYHEDRA.filter(s => ['cube', 'rectangular prism', 'square pyramid', 'triangular prism', 'triangular pyramid'].includes(s[0]))); return mc(`${solidSvg(nm)}${who} paints every flat face of this ${b(nm)} red. How many faces does ${who} paint?`, String(fc), uniq([fc + 1, fc - 1, fc + 2, fc * 2].map(String)).filter(x => x !== String(fc)), `A ${nm} has ${b(fc)} flat faces.`, 4); }
    if (f === 2) { const pic = solidSvg(q[0]); return mc(`${pic}Which shapes are the flat faces of this solid?`, q[1] === 'circle' ? 'circle' : q[1], ['square', 'rectangle', 'triangle and square', 'triangle and rectangle', 'circle', 'oval'].filter(x => x !== q[1]), `The flat faces of a ${q[0]} are ${b(q[1])}.`, 4); }
    if (f === 1) {
      const nm = { 'square': ['cube'], 'rectangle': ['rectangular prism'], 'triangle and square': ['square pyramid'], 'triangle and rectangle': ['triangular prism'], 'circle': ['cylinder', 'cone'] }[q[1]], ans = pick(nm);
      const wrong = ['cube', 'rectangular prism', 'square pyramid', 'triangular prism', 'cylinder', 'cone', 'sphere'].filter(x => !nm.includes(x) && !(q[1] === 'circle' && ['cylinder', 'cone'].includes(x)));
      return mc(`Which solid has flat faces that are ${b(q[1] === 'circle' ? 'circles' : q[1] === 'square' ? 'only squares' : q[1].replace(' and ', ' and ') + 's')}?`, ans, sample(wrong, 3), `A ${ans} has ${b(q[1])} faces.`, 4);
    }
    return mc(`Which shape(s) do you see as ${b('flat faces')} on a ${b(q[0])}?`, q[1], ['square', 'rectangle', 'triangle and square', 'triangle and rectangle', 'circle', 'oval'].filter(x => x !== q[1]), `A ${q[0]} has ${b(q[1])} faces.`, 4);
  }),
  R(/^Identify shapes traced from solids$/, () => () => {
    const q = pick([['cube', 'square'], ['cylinder', 'circle'], ['cone', 'circle'], ['rectangular prism', 'rectangle'], ['triangular pyramid', 'triangle']]);
    const facesOf = { cube: ['square'], cylinder: ['circle'], cone: ['circle'], 'rectangular prism': ['rectangle', 'square'], 'square pyramid': ['triangle', 'square'], 'triangular prism': ['triangle', 'rectangle'], 'triangular pyramid': ['triangle'], sphere: [] };
    const objs = [['a tissue box', 'rectangle'], ['a can of soup', 'circle'], ['a dice', 'square'], ['a party hat', 'circle'], ['a cereal box', 'rectangle'], ['a block of wood shaped like a cube', 'square'], ['a drum', 'circle'], ['a brick', 'rectangle'], ['an ice cream cone', 'circle']];
    const form = ri(0, 2), who = pick(NAMES);
    if (form === 1) { const [o, ans] = pick(objs); return mc(`${who} traces around the flat bottom of ${b(o)}. What shape does ${who} get?`, ans, ['square', 'circle', 'rectangle', 'triangle'].filter(x => x !== ans), `The flat face of ${o} is a ${b(ans)}.`, 4); }
    if (form === 2) { const s = pick(['square', 'circle', 'rectangle', 'triangle']), all = Object.keys(facesOf), good = all.filter(x => facesOf[x].includes(s)), ans = pick(good), wrong = all.filter(x => !good.includes(x));
      return mc(`${who} traces around one flat face of a solid and gets a ${b(s)}. Which solid could ${who} have traced?`, ans, sample(wrong, 3), `A ${ans} has a flat face shaped like a ${b(s)}.`, 4); }
    return mc(`You trace around a flat face of a ${b(q[0])}. What shape do you get?`, q[1], ['square', 'circle', 'rectangle', 'triangle'].filter(x => x !== q[1]), `A flat face of a ${q[0]} is a ${b(q[1])}.`, 4);
  }),
  R(/^(?:Attributes of three-dimensional shapes|Which three-dimensional figure is being described\?)$/, () => () => {
    const D = [['6 square faces', 'cube'], ['1 curved surface and 2 circular faces', 'cylinder'], ['no flat faces and no edges', 'sphere'], ['1 circular face, 1 curved surface and 1 vertex', 'cone'], ['5 faces: 1 square and 4 triangles', 'square pyramid'], ['6 rectangular faces', 'rectangular prism'],
      ['12 edges and all faces are squares', 'cube'], ['8 vertices and 6 faces that are all the same size squares', 'cube'], ['2 flat faces that are circles and no vertices', 'cylinder'], ['a round surface that rolls in every direction', 'sphere'], ['1 flat face that is a circle and 1 pointed tip', 'cone'],
      ['5 vertices and 8 edges', 'square pyramid'], ['1 square base and 4 triangular faces that meet at a point', 'square pyramid'], ['6 faces, 12 edges and 8 vertices, with faces that are rectangles', 'rectangular prism'], ['5 faces: 2 triangles and 3 rectangles', 'triangular prism'], ['6 vertices and 9 edges', 'triangular prism'],
      ['4 faces that are all triangles', 'triangular pyramid'], ['4 vertices and 6 edges', 'triangular pyramid'], ['a curved surface and exactly 1 vertex', 'cone'], ['a curved surface and no vertices and no edges', 'sphere']];
    const q = pick(D), all = ['cube', 'cylinder', 'sphere', 'cone', 'square pyramid', 'rectangular prism', 'triangular prism', 'triangular pyramid'];
    return mc(pick([`Which solid is described? ${b(q[0])}`, `Which solid has ${b(q[0])}?`]), q[1], sample(all, 3, [q[1]]), `It is a ${b(q[1])}.`, 4);
  }),
  R(/^Cubes and rectangular prisms$/, () => () => {
    const s = pick(['cube', 'rectangular prism']), n = 6;
    return mc(`${solidSvg(s)}How many faces does this solid have?`, '6', ['4', '5', '8'], `A ${s} has ${b(6)} faces.`, 4);
  }),
  R(/^Two-dimensional and three-dimensional shapes$/, () => () => {
    const flat = Math.random() < 0.5, nm = flat ? pick(['circle', 'triangle', 'square', 'rectangle', 'hexagon', 'pentagon', 'oval']) : pick(['cube', 'sphere', 'cylinder', 'cone', 'rectangular prism', 'square pyramid']);
    const form = ri(0, 2);
    if (form === 1) return mc(`${flat ? shapeSvg(nm, 90) : solidSvg(nm)}Is this a flat (2-D) shape or a solid (3-D) shape?`, flat ? 'Flat (2-D)' : 'Solid (3-D)', [flat ? 'Solid (3-D)' : 'Flat (2-D)'], `A ${nm} is ${flat ? 'flat' : 'a solid'}.`, 2);
    if (form === 2) {
      const flats = ['circle', 'triangle', 'square', 'rectangle', 'hexagon', 'pentagon', 'oval'], solids = ['cube', 'sphere', 'cylinder', 'cone', 'rectangular prism', 'square pyramid'], want = pick(['flat (2-D)', 'solid (3-D)']);
      const ans = want === 'flat (2-D)' ? pick(flats) : pick(solids);
      return mc(`Which of these is a ${b(want)} shape?`, ans, sample(want === 'flat (2-D)' ? solids : flats, 3), `A ${ans} is ${want === 'flat (2-D)' ? 'flat' : 'a solid'}.`, 4);
    }
    return mc(`Is a ${b(nm)} a flat (2-D) shape or a solid (3-D) shape?`, flat ? 'Flat (2-D)' : 'Solid (3-D)', [flat ? 'Solid (3-D)' : 'Flat (2-D)'], `A ${nm} is ${flat ? 'flat' : 'a solid'}.`, 2);
  }),
  R(/^Three-dimensional shapes in the real world(?: I| II)?$|^Three-dimensional shapes in real-world objects$/, (mt, ctx) => () => {
    const s = pick(Object.keys(REAL)), obj = pick(REAL[s]), others = sample(Object.keys(REAL), 3, [s]);
    return mc(pick([`Which solid shape is ${b(obj)} most like?`, `${obj[0].toUpperCase() + obj.slice(1)} has the shape of which solid?`]), s, others, `${obj[0].toUpperCase() + obj.slice(1)} is shaped like a ${b(s)}.`, 4);
  }),
  R(/^Nets of (?:three-dimensional shapes|three-dimensional figures|prisms and pyramids)$/, () => () => {
    const s = pick(['cube', 'square pyramid', 'triangular prism', 'triangular pyramid']);
    return mc(`${netSvg(s)}Which solid can be folded from this net?`, s, ['cube', 'square pyramid', 'triangular prism', 'triangular pyramid', 'cylinder'].filter(x => x !== s).slice(0, 3), `Fold the net: you get a ${b(s)}.`, 4);
  }),
  R(/^(?:Sort three-dimensional shapes|Compose three-dimensional shapes|Compose bigger three-dimensional shapes|Three-dimensional figures viewed from different perspectives)$/, (mt, ctx) => () => {
    if (/Sort/.test(ctx.title)) {
      const s = pick(DISPLAY_SOLIDS), curved = ['cylinder', 'cone', 'sphere'].includes(s), pr = ri(0, 2);
      const props = [['a curved surface', curved, `A ${s} ${curved ? 'has a curved surface' : 'has only flat faces'}.`], ['at least one flat face', s !== 'sphere', `A ${s} ${s === 'sphere' ? 'has no flat faces' : 'has a flat face'}.`], ['a vertex (a pointed corner)', !['cylinder', 'sphere'].includes(s), `A ${s} ${['cylinder', 'sphere'].includes(s) ? 'has no vertices' : 'has a vertex'}.`]][pr];
      const pic = ri(0, 1) ? solidSvg(s) : '';
      return mc(`${pic}Does a ${b(s)} have ${b(props[0])}?`, props[1] ? 'Yes' : 'No', [props[1] ? 'No' : 'Yes'], props[2], 2);
    }
    if (/perspectives/.test(ctx.title)) { const s = pick([['cylinder', 'from above', 'circle'], ['cube', 'from the front', 'square'], ['cone', 'from above', 'circle'], ['rectangular prism', 'from the side', 'rectangle'], ['cylinder', 'from the side', 'rectangle'], ['cone', 'from the side', 'triangle'], ['sphere', 'from any direction', 'circle'], ['cube', 'from above', 'square'], ['square pyramid', 'from above', 'square'], ['square pyramid', 'from the side', 'triangle'], ['cylinder', 'from the bottom', 'circle'], ['cube', 'from the side', 'square']]); return mc(`What shape do you see when you look at a ${b(s[0])} ${s[1]}?`, s[2], ['circle', 'square', 'rectangle', 'triangle'].filter(x => x !== s[2]), `Looking at a ${s[0]} ${s[1]}, you see a ${b(s[2])}.`, 4); }
    const n = pick([[2, 'cubes', 'a rectangular prism'], [4, 'cubes', 'a rectangular prism'], [8, 'cubes', 'a larger cube'], [3, 'cubes', 'a rectangular prism'], [6, 'cubes', 'a rectangular prism'], [12, 'cubes', 'a rectangular prism'], [27, 'cubes', 'a larger cube'], [10, 'cubes', 'a rectangular prism']]);
    return mc(`What can you build with ${b(n[0] + ' ' + n[1])}?`, n[2], ['a sphere', 'a cone', 'a cylinder'].filter(x => x !== n[2]), `Stacking cubes makes ${b(n[2])}.`, 4);
  }),

  /* ===== spatial sense (G1) ===== */
  R(/^In front of and behind$/, () => () => {
    const row = sample(ANIMALS, 4).slice(0, 3), front = Math.random() < 0.5;
    // the animals walk to the right, so the one on the right is at the front of the line
    const idx = ri(front ? 0 : 1, front ? 1 : 2), ans = row[front ? idx + 1 : idx - 1];
    return mc(`${big(row.join(' ') + ' →')}The animals walk to the right. Which animal is directly ${b(front ? 'in front of' : 'behind')} ${b(row[idx])}?`, ans, row.filter(x => x !== ans && x !== row[idx]).concat(sample(ANIMALS, 2, row)).slice(0, 2), `Walking right, the one in front is on the right and the one behind is on the left: ${b(ans)}.`, 3);
  }),
  R(/^Above and below$/, () => () => {
    const [a, c] = sample(ANIMALS, 2), up = Math.random() < 0.5;
    return mc(`${big(`${a}<br>${c}`)}Which animal is ${b(up ? 'above' : 'below')} the other?`, up ? a : c, [up ? c : a], `${up ? 'Above' : 'Below'} means ${up ? 'higher up' : 'lower down'}.`, 2);
  }),
  R(/^Beside and next to$/, () => () => {
    const [a, c, d] = sample(ANIMALS, 3), row = [a, c, d];
    return mc(`${big(row.join(' '))}Which animal is ${b('beside')} ${c} on the left?`, a, [d, '🐢'], `The animal to the left of ${c} is ${b(a)}.`, 3);
  }),
  R(/^Left, middle and right$/, () => () => {
    const row = sample(ANIMALS, 3), pos = pick(['left', 'middle', 'right']), idx = { left: 0, middle: 1, right: 2 }[pos];
    return mc(`${big(row.join(' '))}Which animal is on the ${b(pos)}?`, row[idx], row.filter((_, i) => i !== idx), `The ${pos} one is ${b(row[idx])}.`, 3);
  }),
  R(/^Top, middle and bottom$/, () => () => {
    const col = sample(ANIMALS, 3), pos = pick(['top', 'middle', 'bottom']), idx = { top: 0, middle: 1, bottom: 2 }[pos];
    return mc(`${big(col.join('<br>'))}Which animal is at the ${b(pos)}?`, col[idx], col.filter((_, i) => i !== idx), `The ${pos} one is ${b(col[idx])}.`, 3);
  }),
  R(/^Location in a grid$/, () => () => {
    const grid = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => pick(ANIMALS))), r = ri(0, 2), c = ri(0, 2), target = grid[r][c];
    let n = 0; grid.forEach(rr => rr.forEach(x => { if (x === target) n++; })); if (n > 1) return null;
    const html = `<table style="border-collapse:collapse;font-size:30px">${grid.map(rr => `<tr>${rr.map(x => `<td style="border:2px solid #94a3b8;padding:2px 10px">${x}</td>`).join('')}</tr>`).join('')}</table>`;
    return mc(`${html}Which animal is in ${b('row ' + (r + 1))}, ${b('column ' + (c + 1))}? (Rows go down, columns go across.)`, target, uniq(grid.flat()).filter(x => x !== target).slice(0, 3), `Go to row ${r + 1}, column ${c + 1}: ${b(target)}.`, 4);
  })
];
export { tint, triSvg, quadSvg, angleSvg, protractor, linePair, solidSvg, netSvg, TRIS, QUADS, g as geoSvg, poly, symFigure, tfSvg, LINES_OF_SYM, ALL_QUAD_NAMES, DISPLAY_SOLIDS };
