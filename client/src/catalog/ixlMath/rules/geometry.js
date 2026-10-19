/* Geometry: shapes, solids, angles, lines, symmetry, transformations, spatial sense (Grades 1–5). */
import {
  ri, pick, shuffle, sample, range, uniq, m, b, fmt, num, mc, yesNo, near, svg, C, thing, emojiRow, big, cap,
  SHAPES_2D, SIDES, shapeSvg, shapeRow, SOLIDS
} from '../h.js';
import { R } from '../engine.js';

const stroke = (extra = '') => `stroke="${C.primary}" stroke-width="3" stroke-linejoin="round" ${extra}`;
const poly = (pts, fill = '#c7d2fe', extra = '') => `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${fill}" ${stroke(extra)}/>`;
const g = (inner, w = 160, h = 130) => svg(w, h, inner);

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
  const t = TRIS[key], p = t.pts; let inner = poly(p, '#c7d2fe');
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
const quadSvg = k => g(poly(QUADS[k].pts), 160, 115);
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
  return g((map[name] || map.cube)(), 160, 125);
};
const DISPLAY_SOLIDS = ['cube', 'rectangular prism', 'cylinder', 'cone', 'sphere', 'square pyramid', 'triangular pyramid', 'triangular prism'];
const solidsFor = grade => (grade <= 2 ? ['cube', 'rectangular prism', 'cylinder', 'cone', 'sphere', 'square pyramid'] : DISPLAY_SOLIDS);
const POLYHEDRA = SOLIDS.filter(s => s[3] > 0 && s[4] > 0 && !['cylinder', 'cone', 'sphere'].includes(s[0]));
const solidFaces = name => SOLIDS.find(s => s[0] === name);
const REAL = { cube: ['a dice 🎲', 'a sugar cube'], 'rectangular prism': ['a cereal box 📦', 'a brick', 'a shoebox'], cylinder: ['a soup can 🥫', 'a drum', 'a pipe'], cone: ['an ice cream cone 🍦', 'a party hat', 'a traffic cone'], sphere: ['a soccer ball ⚽', 'a marble', 'a globe 🌍'], 'square pyramid': ['a pyramid in Egypt', 'a tent roof', 'a pyramid-shaped paperweight'] };

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
  ['a rectangle and a triangle', 'a house shape (a pentagon)', ['a circle', 'a hexagon']], ['two trapezoids', 'a hexagon', ['a circle', 'a triangle']], ['four squares', 'a bigger square', ['a circle', 'a triangle']]
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
    const want = /Rhomb/.test(ctx.title) ? 'rhombus' : 'rectangle', qs = ['rhombus', 'rectangle', 'trapezoid', 'triangle', 'parallelogram'];
    const s = pick(qs), isIt = s === want || (want === 'rectangle' && s === 'square');
    const qk = { rhombus: 'rhombus', rectangle: 'rectangle', trapezoid: 'trapezoid', parallelogram: 'parallelogram', triangle: 'triangle' }[s];
    return yesNo(`${shapeSvg(s, 100)}Is this shape a ${b(want)}?`, s === want, s === want ? `Yes, it is a ${want}.` : `No — it is a ${s}.`, ['Yes', 'No']);
  }),
  R(/^Count sides and vertices$|^Count and compare sides and vertices$|^Compare sides and vertices$/, (mt, ctx) => () => {
    const s = pick(shapeNames(ctx.grade).filter(x => SIDES[x] > 0)), n = SIDES[s];
    if (/Compare/.test(ctx.title)) { const [a, c] = sample(shapeNames(ctx.grade).filter(x => SIDES[x] > 0), 2, []); if (SIDES[a] === SIDES[c]) return null; const more = SIDES[a] > SIDES[c] ? a : c; return mc(`Which has more sides: a ${b(a)} or a ${b(c)}?`, more, [more === a ? c : a], `A ${a} has ${SIDES[a]} sides and a ${c} has ${SIDES[c]}.`, 2); }
    return Math.random() < 0.5 ? num(`${shapeSvg(s, 100)}How many sides does this shape have?`, n, `Count the sides: ${b(n)}.`) : num(`${shapeSvg(s, 100)}How many vertices (corners) does this shape have?`, n, `A polygon has as many vertices as sides: ${b(n)}.`);
  }),
  R(/^Number of sides in polygons$/, () => () => {
    const s = pick(POLYGONS); return num(`How many sides does a ${b(s)} have?`, SIDES[s], `A ${s} has ${b(SIDES[s])} sides.`);
  }),
  R(/^Equal sides$/, () => () => {
    const s = pick(['square', 'rectangle', 'triangle', 'rhombus', 'trapezoid']), eq = { square: 'all 4 sides equal', rectangle: 'opposite sides equal', triangle: 'sides that may differ', rhombus: 'all 4 sides equal', trapezoid: 'sides that may differ' }[s];
    const allEqual = ['square', 'rhombus'].includes(s);
    return yesNo(`Does a ${b(s)} always have ${b('all sides equal')} in length?`, allEqual, `A ${s} has ${eq}.`, ['Yes', 'No']);
  }),
  R(/^Square corners$/, () => () => {
    const s = pick(['square', 'rectangle', 'triangle', 'circle', 'rhombus']), n = { square: 4, rectangle: 4, triangle: 0, circle: 0, rhombus: 0 }[s];
    return num(`How many square corners (right angles) does a typical ${b(s)} have? ${s === 'triangle' ? '(A triangle with no right angle.)' : s === 'rhombus' ? '(A rhombus that is not a square.)' : ''}`, n, `A ${s} has ${b(n)} square corners.`);
  }),
  R(/^Open and closed shapes$/, () => () => {
    const closed = Math.random() < 0.5, pic = closed ? g(poly([[30, 20], [120, 30], [100, 95], [40, 90]])) : g(`<polyline points="30,25 120,30 100,95 40,90" fill="none" ${stroke()}/>`);
    return yesNo(`${pic}Is this shape ${b('closed')}?`, closed, closed ? 'All the sides connect, so it is closed.' : 'There is a gap, so it is open.', ['Yes, closed', 'No, open']);
  }),
  R(/^Attributes of two-dimensional shapes$|^Attributes of polygons$|^Properties of polygons$/, () => () => {
    const q = pick([['A shape with 3 sides', 'triangle'], ['A shape with 4 equal sides and 4 right angles', 'square'], ['A shape with 6 sides', 'hexagon'], ['A shape with 5 sides', 'pentagon'], ['A shape with 8 sides', 'octagon'], ['A shape with no straight sides', 'circle'], ['A shape with 4 sides where opposite sides are equal and all angles are right angles', 'rectangle']]);
    return mc(`Which shape is described? ${b(q[0])}`, q[1], ['triangle', 'square', 'hexagon', 'pentagon', 'octagon', 'circle', 'rectangle'].filter(x => x !== q[1]), `It is a ${b(q[1])}.`, 4);
  }),
  R(/^Sort two-dimensional shapes$/, () => () => {
    const s = pick(['triangle', 'square', 'circle', 'pentagon', 'hexagon', 'rectangle']), cat = SIDES[s] === 0 ? 'No sides' : SIDES[s] <= 4 ? '3 or 4 sides' : '5 or more sides';
    return mc(`${shapeSvg(s, 90)}Sort this shape. Which group does it belong to?`, cat, ['No sides', '3 or 4 sides', '5 or more sides'].filter(x => x !== cat), `A ${s} ${SIDES[s] ? `has ${SIDES[s]} sides` : 'has no straight sides'}: ${b(cat)}.`, 3);
  }),
  R(/^Two-dimensional shapes in the real world$|^Two-dimensional shapes in real-world objects$/, () => () => {
    const q = pick([['a clock face', 'circle'], ['a stop sign', 'octagon'], ['a slice of pizza', 'triangle'], ['a window pane', 'rectangle'], ['a chessboard square', 'square'], ['a yield sign', 'triangle']]);
    return mc(`What shape is ${b(q[0])}?`, q[1], ['circle', 'octagon', 'triangle', 'rectangle', 'square'].filter(x => x !== q[1]), `${q[0]} is a ${b(q[1])}.`, 4);
  }),
  R(/^Compose two-dimensional shapes(?:: which shapes can you make\?)?$/, () => () => {
    const [parts, ans, wrong] = pick(COMPOSE);
    return mc(`What can you make by putting together ${b(parts)}?`, ans, wrong, `${parts[0].toUpperCase() + parts.slice(1)} can make ${b(ans)}.`, 3);
  }),
  R(/^Congruent shapes$|^Identify congruent (?:shapes|figures)$/, () => () => {
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
    const k = pick(Object.keys(LINES_OF_SYM).filter(x => LINES_OF_SYM[x] !== '∞')), n = LINES_OF_SYM[k];
    return num(`How many lines of symmetry does a ${b(k)} have? (a regular shape if no other detail)`, n, `A ${k} has ${b(n)} line${n === 1 ? '' : 's'} of symmetry.`);
  }),
  R(/^Rotational symmetry$/, () => () => {
    const k = pick([['square', 4], ['rectangle', 2], ['regular hexagon', 6], ['equilateral triangle', 3], ['parallelogram', 2], ['regular pentagon', 5]]);
    return num(`How many times does a ${b(k[0])} look the same during one full turn (order of rotational symmetry)?`, k[1], `A ${k[0]} has rotational symmetry of order ${b(k[1])}.`);
  }),
  R(/^Is it a polygon\?$/, () => () => {
    const poly_ = Math.random() < 0.5, pic = poly_ ? g(poly(pick([[[30, 20], [130, 30], [110, 100], [20, 85]], [[80, 8], [140, 55], [100, 105], [30, 90], [20, 40]], [[20, 100], [80, 10], [140, 100]]]))) : pick([g(`<circle cx="80" cy="55" r="45" fill="#c7d2fe" ${stroke()}/>`), g(`<polyline points="25,95 60,30 100,85 135,20" fill="none" ${stroke()}/>`), g(`<path d="M20,90 Q80,0 140,90 Z" fill="#c7d2fe" ${stroke()}/>`)]);
    return yesNo(`${pic}Is this figure a polygon?`, poly_, poly_ ? 'It is closed and made only of straight sides.' : 'A polygon is closed and made of straight sides only — this figure is not.', ['Yes', 'No']);
  }),
  R(/^Regular and irregular polygons$/, () => () => {
    const reg = Math.random() < 0.5, name = pick(['pentagon', 'hexagon', 'octagon']), pic = reg ? shapeSvg(name, 100) : g(poly(pick([[[20, 90], [40, 25], [100, 15], [145, 70], [90, 105]], [[15, 60], [60, 10], [130, 30], [140, 90], [50, 105]]])));
    return mc(`${pic}Is this polygon regular or irregular?`, reg ? 'Regular' : 'Irregular', [reg ? 'Irregular' : 'Regular'], reg ? 'All sides and angles are equal.' : 'The sides and angles are not all equal.', 2);
  }),
  R(/^Sort polygons into Venn diagrams$/, () => () => {
    const poly_ = pick([['square', 'Yes', 'Yes'], ['triangle', 'No', 'No'], ['rectangle', 'Yes', 'Yes'], ['rhombus', 'No', 'Yes'], ['trapezoid', 'No', 'Yes'], ['pentagon', 'No', 'No'], ['right triangle', 'Yes', 'No']]);
    const where = poly_[1] === 'Yes' && poly_[2] === 'Yes' ? 'In both circles' : poly_[1] === 'Yes' ? 'Only "has a right angle"' : poly_[2] === 'Yes' ? 'Only "has 4 sides"' : 'Outside both circles';
    return mc(`A Venn diagram has two circles: "has a right angle" and "has 4 sides". Where does a ${b(poly_[0])} go?`, where, ['In both circles', 'Only "has a right angle"', 'Only "has 4 sides"', 'Outside both circles'].filter(x => x !== where), `A ${poly_[0]} ${poly_[1] === 'Yes' ? 'has' : 'does not have'} a right angle and ${poly_[2] === 'Yes' ? 'has' : 'does not have'} 4 sides: ${b(where)}.`);
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
    const q = pick([['4 equal sides and 4 right angles', 'square'], ['2 pairs of parallel sides and 4 right angles but not all sides equal', 'rectangle'], ['4 equal sides but no right angles', 'rhombus'], ['exactly 1 pair of parallel sides', 'trapezoid'], ['2 pairs of parallel sides but no right angles', 'parallelogram']]);
    return mc(`Which quadrilateral has ${b(q[0])}?`, q[1], ['square', 'rectangle', 'rhombus', 'trapezoid', 'parallelogram'].filter(x => x !== q[1]), `That describes a ${b(q[1])}.`);
  }),
  R(/^Identify the relationships between quadrilaterals$|^Describe relationships among quadrilaterals$/, () => () => {
    const t = pick([['Every square is a rectangle.', true], ['Every rectangle is a square.', false], ['Every rhombus is a parallelogram.', true], ['Every trapezoid is a parallelogram.', false], ['Every square is a rhombus.', true], ['Every parallelogram is a rectangle.', false]]);
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
    const q = pick([['cube', 'square'], ['rectangular prism', 'rectangle'], ['square pyramid', 'triangle and square'], ['triangular prism', 'triangle and rectangle'], ['cylinder', 'circle'], ['cone', 'circle']]);
    return mc(`Which shape(s) do you see as ${b('flat faces')} on a ${b(q[0])}?`, q[1], ['square', 'rectangle', 'triangle and square', 'triangle and rectangle', 'circle', 'oval'].filter(x => x !== q[1]), `A ${q[0]} has ${b(q[1])} faces.`, 4);
  }),
  R(/^Identify shapes traced from solids$/, () => () => {
    const q = pick([['cube', 'square'], ['cylinder', 'circle'], ['cone', 'circle'], ['rectangular prism', 'rectangle'], ['square pyramid', 'triangle']]);
    return mc(`You trace around a flat face of a ${b(q[0])}. What shape do you get?`, q[1], ['square', 'circle', 'rectangle', 'triangle'].filter(x => x !== q[1]), `A flat face of a ${q[0]} is a ${b(q[1])}.`, 4);
  }),
  R(/^(?:Attributes of three-dimensional shapes|Which three-dimensional figure is being described\?)$/, () => () => {
    const q = pick([['6 square faces', 'cube'], ['1 curved surface and 2 circular faces', 'cylinder'], ['no flat faces and no edges', 'sphere'], ['1 circular face, 1 curved surface and 1 vertex', 'cone'], ['5 faces: 1 square and 4 triangles', 'square pyramid'], ['6 rectangular faces', 'rectangular prism']]);
    return mc(`Which solid is described? ${b(q[0])}`, q[1], ['cube', 'cylinder', 'sphere', 'cone', 'square pyramid', 'rectangular prism'].filter(x => x !== q[1]), `It is a ${b(q[1])}.`, 4);
  }),
  R(/^Cubes and rectangular prisms$/, () => () => {
    const s = pick(['cube', 'rectangular prism']), n = 6;
    return mc(`${solidSvg(s)}How many faces does this solid have?`, '6', ['4', '5', '8'], `A ${s} has ${b(6)} faces.`, 4);
  }),
  R(/^Two-dimensional and three-dimensional shapes$/, () => () => {
    const flat = Math.random() < 0.5, nm = flat ? pick(['circle', 'triangle', 'square']) : pick(['cube', 'sphere', 'cylinder', 'cone']);
    return mc(`Is a ${b(nm)} a flat (2-D) shape or a solid (3-D) shape?`, flat ? 'Flat (2-D)' : 'Solid (3-D)', [flat ? 'Solid (3-D)' : 'Flat (2-D)'], `A ${nm} is ${flat ? 'flat' : 'a solid'}.`, 2);
  }),
  R(/^Three-dimensional shapes in the real world(?: I| II)?$|^Three-dimensional shapes in real-world objects$/, (mt, ctx) => () => {
    const s = pick(Object.keys(REAL)), obj = pick(REAL[s]), others = sample(Object.keys(REAL), 3, [s]);
    return mc(`Which solid shape is ${b(obj)} most like?`, s, others, `${obj[0].toUpperCase() + obj.slice(1)} is shaped like a ${b(s)}.`, 4);
  }),
  R(/^Nets of (?:three-dimensional shapes|three-dimensional figures|prisms and pyramids)$/, () => () => {
    const s = pick(['cube', 'square pyramid', 'triangular prism', 'triangular pyramid']);
    return mc(`${netSvg(s)}Which solid can be folded from this net?`, s, ['cube', 'square pyramid', 'triangular prism', 'triangular pyramid', 'cylinder'].filter(x => x !== s).slice(0, 3), `Fold the net: you get a ${b(s)}.`, 4);
  }),
  R(/^(?:Sort three-dimensional shapes|Compose three-dimensional shapes|Compose bigger three-dimensional shapes|Three-dimensional figures viewed from different perspectives)$/, (mt, ctx) => () => {
    if (/Sort/.test(ctx.title)) { const s = pick(DISPLAY_SOLIDS), rolls = ['cylinder', 'cone', 'sphere'].includes(s); return mc(`Does a ${b(s)} have a ${b('curved surface')}?`, rolls ? 'Yes' : 'No', [rolls ? 'No' : 'Yes'], `${rolls ? 'A' : 'A'} ${s} ${rolls ? 'has a curved surface' : 'has only flat faces'}.`, 2); }
    if (/perspectives/.test(ctx.title)) { const s = pick([['cylinder', 'from above', 'circle'], ['cube', 'from the front', 'square'], ['cone', 'from above', 'circle'], ['rectangular prism', 'from the side', 'rectangle']]); return mc(`What shape do you see when you look at a ${b(s[0])} ${s[1]}?`, s[2], ['circle', 'square', 'rectangle', 'triangle'].filter(x => x !== s[2]), `Looking at a ${s[0]} ${s[1]}, you see a ${b(s[2])}.`, 4); }
    const n = pick([[2, 'cubes', 'a rectangular prism'], [4, 'cubes', 'a larger cube (2 by 2 by 1 is a flat square block)'], [8, 'cubes', 'a larger cube']]);
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
export { triSvg, quadSvg, angleSvg, protractor, linePair, solidSvg, netSvg, TRIS, QUADS, g as geoSvg, poly, symFigure, tfSvg, LINES_OF_SYM, ALL_QUAD_NAMES, DISPLAY_SOLIDS };
