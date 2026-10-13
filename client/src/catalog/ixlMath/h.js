/* ============================================================
   MathAce — shared helpers for the IXL-style math catalog:
   random utilities, question builders ({type:'num'|'mc'}), number
   formatting, and small inline-SVG pictures (ten frames, number lines,
   clocks, fraction models, graphs …).
   ============================================================ */

export const ri = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const pick = arr => arr[ri(0, arr.length - 1)];
export const shuffle = arr => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = ri(0, i); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
export const sample = (arr, n, exclude = []) => shuffle(arr.filter(x => !exclude.includes(x))).slice(0, n);
export const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b));
export const lcm = (a, b) => (a / gcd(a, b)) * b;
export const range = (a, b, step = 1) => { const r = []; for (let i = a; step > 0 ? i <= b : i >= b; i += step) r.push(i); return r; };
export const uniq = arr => [...new Set(arr)];
export const sum = arr => arr.reduce((x, y) => x + y, 0);
export const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

export const m = s => `<span class="math">${s}</span>`;
export const b = s => `<strong>${s}</strong>`;
export const MINUS = '−';
const NB = ' ';
/** 12345 → "12 345" (IXL Canada style for 5+ digits); negatives use a true minus. */
export const fmt = n => {
  if (typeof n !== 'number') return String(n);
  const neg = n < 0;
  let s = Math.abs(n).toString();
  if (!s.includes('e')) {
    let [i, d] = s.split('.');
    if (i.length >= 5) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, NB);
    s = d !== undefined ? i + '.' + d : i;
  }
  return (neg ? MINUS : '') + s;
};
/** round away floating-point noise */
export const fix = (x, d = 6) => Math.round(x * 10 ** d) / 10 ** d;
/** decimal text with a fixed number of places: dec(0.5, 2) → "0.50" */
export const dec = (x, d) => fix(x, d).toFixed(d);
export const money = x => '$' + (Math.round(x * 100) / 100).toFixed(2);
export const moneyShort = x => (Math.abs(x - Math.round(x)) < 1e-9 ? '$' + Math.round(x) : money(x));

/* ---------- question builders ---------- */
export const num = (prompt, answer, explain) => ({ type: 'num', prompt, answer: fix(answer), explain });

/** Multiple choice. answer + distractors may be numbers or strings; unique, shuffled, max `n` choices. */
const SUPCH = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '+': '⁺', '-': '⁻', '−': '⁻', '(': '⁽', ')': '⁾', n: 'ⁿ', i: 'ⁱ', x: 'ˣ' };
/** choices are shown as plain text, so turn <sup>…</sup> markup into Unicode superscripts */
export const plain = s => String(s)
  .replace(/<sup>([^<]*)<\/sup>/g, (_, e) => ([...e].every(c => SUPCH[c]) ? [...e].map(c => SUPCH[c]).join('') : `^(${e})`))
  .replace(/<sub>([^<]*)<\/sub>/g, '_$1');
export function mc(prompt, answer, distractors, explain, n = 4) {
  answer = plain(answer); distractors = distractors.map(plain);
  const a = String(answer);
  const seen = new Set([a]);
  const ds = [];
  for (const d of distractors) {
    const s = String(d);
    if (!seen.has(s) && s !== 'NaN' && s !== 'undefined' && s !== 'null') { seen.add(s); ds.push(s); }
  }
  return { type: 'mc', prompt, answer: a, choices: shuffle([a, ...ds.slice(0, n - 1)]), explain };
}
export const yesNo = (prompt, truth, explain, labels = ['True', 'False']) =>
  mc(prompt, truth ? labels[0] : labels[1], [truth ? labels[1] : labels[0]], explain, 2);

/** numbers near n, never equal to n, never negative unless allowNeg */
export function near(n, count = 5, spread = 3, { min = 0, allowNeg = false, step = 1 } = {}) {
  const out = [];
  let guard = 0;
  while (out.length < count && guard++ < 80) {
    const d = (ri(1, spread)) * step * (Math.random() < 0.5 ? -1 : 1);
    const v = fix(n + d);
    if (v !== n && (allowNeg || v >= min) && !out.includes(v)) out.push(v);
  }
  return out;
}

/* ---------- words ---------- */
export const NAMES = ['Ava', 'Ben', 'Chloe', 'Dev', 'Emma', 'Finn', 'Grace', 'Hugo', 'Isla', 'Jack', 'Kira', 'Liam', 'Maya', 'Noah', 'Olive', 'Pablo', 'Quinn', 'Ravi', 'Sofia', 'Theo', 'Uma', 'Victor', 'Wen', 'Zoe', 'Amir', 'Bella', 'Carlos', 'Dana', 'Elio', 'Farah'];
export const nm2 = () => { const [a, c] = sample(NAMES, 2); return [a, c]; };
// [singular, plural, emoji]
export const THINGS = [
  ['apple', 'apples', '🍎'], ['banana', 'bananas', '🍌'], ['cookie', 'cookies', '🍪'], ['ball', 'balls', '⚽'], ['book', 'books', '📚'],
  ['pencil', 'pencils', '✏️'], ['sticker', 'stickers', '⭐'], ['marble', 'marbles', '🔮'], ['flower', 'flowers', '🌸'], ['cupcake', 'cupcakes', '🧁'],
  ['toy car', 'toy cars', '🚗'], ['balloon', 'balloons', '🎈'], ['shell', 'shells', '🐚'], ['carrot', 'carrots', '🥕'], ['fish', 'fish', '🐟'],
  ['bird', 'birds', '🐦'], ['kite', 'kites', '🪁'], ['crayon', 'crayons', '🖍️'], ['coin', 'coins', '🪙'], ['stamp', 'stamps', '📮'],
  ['cherry', 'cherries', '🍒'], ['leaf', 'leaves', '🍃'], ['block', 'blocks', '🧱'], ['card', 'cards', '🃏'], ['bead', 'beads', '📿']
];
export const thing = () => pick(THINGS);
export const emojiRow = (e, n, perRow = 10) => {
  let s = '';
  for (let i = 0; i < n; i++) s += e + ((i + 1) % perRow === 0 && i + 1 < n ? '<br>' : '');
  return `<div class="big-emoji" style="font-size:26px;line-height:1.3">${s}</div>`;
};
export const big = s => `<div style="font-size:30px;line-height:1.35">${s}</div>`;

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
/** 0 … 999 999 999 → words (Canadian style: no "and") */
export function words(n) {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
  if (n < 1000) return ONES[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + words(n % 100) : '');
  if (n < 1e6) return words(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + words(n % 1000) : '');
  return words(Math.floor(n / 1e6)) + ' million' + (n % 1e6 ? ' ' + words(n % 1e6) : '');
}
export const ordinal = n => {
  const irr = { 1: 'first', 2: 'second', 3: 'third', 5: 'fifth', 8: 'eighth', 9: 'ninth', 12: 'twelfth' };
  if (n < 20) return irr[n] || ONES[n] + 'th';
  if (n < 100) {
    if (n % 10 === 0) return TENS[n / 10].replace('y', 'ieth');
    return TENS[Math.floor(n / 10)] + '-' + ordinal(n % 10);
  }
  if (n === 100) return 'hundredth';
  return words(n) + 'th';
};
export const ordSuffix = n => (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] || 'th'));

/** random integer with exactly `d` digits */
export const digits = d => ri(10 ** (d - 1), 10 ** d - 1);
export const DIGIT_NAMES = { 1: 'one-digit', 2: 'two-digit', 3: 'three-digit', 4: 'four-digit', 5: 'five-digit', 6: 'six-digit' };
export const PLACES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions'];

/* ---------- parse difficulty hints from skill titles ---------- */
const NUMWORD = { two: 2, three: 3, four: 4, five: 5, six: 6 };
/** "up to 100 000" → 100000; "up to three digits" → 999; fallback `dflt` */
export function limitOf(title, dflt) {
  let r = title.match(/up to ([\d\s ]+)/i);
  if (r) { const v = parseInt(r[1].replace(/\D/g, ''), 10); if (v) return v; }
  r = title.match(/(?:up to |to )?(one|two|three|four|five|six)[- ]digits?/i) || title.match(/(two|three|four|five|six)-digit/i);
  if (r) { const d = { one: 1, ...NUMWORD }[r[1].toLowerCase()]; return 10 ** d - 1; }
  r = title.match(/(?:up to|to) (tens|hundreds|thousands|ten thousands|hundred thousands|millions)/i);
  if (r) return 10 ** PLACES.indexOf(r[1].toLowerCase()) * 10 - 1;
  r = title.match(/sums? (?:to|up to) (\d+)/i) || title.match(/\bto (\d+)\b/);
  if (r) return parseInt(r[1], 10);
  return dflt;
}
export const digitsOf = (title, dflt = 2) => {
  const r = title.match(/(one|two|three|four|five|six)[- ]digits?/i) || title.match(/(\d)-digit/i);
  if (!r) return dflt;
  return isNaN(r[1]) ? { one: 1, ...NUMWORD }[r[1].toLowerCase()] : +r[1];
};

/* ============================================================
   Inline SVG pictures
   ============================================================ */
export const C = { primary: '#4f46e5', accent: '#f59e0b', green: '#10b981', red: '#ef4444', blue: '#3b82f6', pink: '#ec4899', grey: '#94a3b8', ink: '#334155', light: '#e0e7ff', paper: '#ffffff' };
export const COLORS = C;
const svg = (w, h, inner, extra = '') =>
  `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="max-width:100%;height:auto;display:block;margin:6px 0" role="img" ${extra}>${inner}</svg>`;
export { svg };

/** Ten frame(s) with n counters (1–40). */
export function tenFrame(n, color = C.primary) {
  const frames = Math.max(1, Math.ceil(n / 10));
  let inner = '';
  for (let f = 0; f < frames; f++) {
    const x0 = f * 150;
    for (let i = 0; i < 10; i++) {
      const cx = x0 + (i % 5) * 28, cy = Math.floor(i / 5) * 28;
      inner += `<rect x="${cx + 2}" y="${cy + 2}" width="26" height="26" fill="#fff" stroke="${C.ink}" stroke-width="1.5"/>`;
      if (f * 10 + i < n) inner += `<circle cx="${cx + 15}" cy="${cy + 15}" r="10" fill="${color}"/>`;
    }
  }
  return svg(frames * 150 - 10, 60, inner, 'aria-label="ten frame"');
}
/** counters in rows of 5 (for "count" skills) */
export const counters = (n, e = '🔵') => emojiRow(e, n, 5);

/** Base-ten blocks: hundreds flats, tens rods, ones cubes */
export function baseTen(h, t, o) {
  let x = 4, inner = '';
  for (let i = 0; i < h; i++) { inner += `<rect x="${x}" y="4" width="46" height="46" fill="#c7d2fe" stroke="${C.primary}"/>`; for (let k = 1; k < 5; k++) inner += `<line x1="${x + k * 9.2}" y1="4" x2="${x + k * 9.2}" y2="50" stroke="${C.primary}" stroke-width=".5"/><line x1="${x}" y1="${4 + k * 9.2}" x2="${x + 46}" y2="${4 + k * 9.2}" stroke="${C.primary}" stroke-width=".5"/>`; x += 52; }
  for (let i = 0; i < t; i++) { inner += `<rect x="${x}" y="4" width="9" height="46" fill="#fde68a" stroke="${C.accent}"/>`; for (let k = 1; k < 5; k++) inner += `<line x1="${x}" y1="${4 + k * 9.2}" x2="${x + 9}" y2="${4 + k * 9.2}" stroke="${C.accent}" stroke-width=".5"/>`; x += 13; }
  x += 6;
  for (let i = 0; i < o; i++) { const row = Math.floor(i / 5); inner += `<rect x="${x + (i % 5) * 11}" y="${4 + row * 11}" width="9" height="9" fill="#a7f3d0" stroke="${C.green}"/>`; if (i % 5 === 4 && i + 1 < o) { /* new row handled by floor */ } }
  x += Math.min(5, o) * 11 + 4;
  return svg(Math.max(x, 60), 56, inner, 'aria-label="place value blocks"');
}

/** Number line with evenly spaced ticks; `marks` = [{v, label?, color?}] ; `hide` ticks without labels */
export function numberLine({ min, max, step = 1, labelEvery = 1, marks = [], hideLabels = false, width = 440, fmtLabel = x => fmt(x), dots = [] }) {
  const pad = 22, H = 58, y = 26;
  const span = max - min, X = v => pad + ((v - min) / span) * (width - 2 * pad);
  let inner = `<line x1="${pad - 8}" y1="${y}" x2="${width - pad + 8}" y2="${y}" stroke="${C.ink}" stroke-width="2"/>`;
  const n = Math.round(span / step);
  for (let i = 0; i <= n; i++) {
    const v = fix(min + i * step), x = X(v);
    const major = i % labelEvery === 0;
    inner += `<line x1="${x}" y1="${y - (major ? 8 : 5)}" x2="${x}" y2="${y + (major ? 8 : 5)}" stroke="${C.ink}" stroke-width="${major ? 2 : 1}"/>`;
    if (major && !hideLabels) inner += `<text x="${x}" y="${y + 24}" font-size="12" text-anchor="middle" fill="${C.ink}">${fmtLabel(v)}</text>`;
  }
  for (const mk of marks) {
    const x = X(mk.v);
    inner += `<circle cx="${x}" cy="${y}" r="6" fill="${mk.color || C.red}"/>`;
    if (mk.label) inner += `<text x="${x}" y="${y - 12}" font-size="14" font-weight="700" text-anchor="middle" fill="${mk.color || C.red}">${mk.label}</text>`;
  }
  for (const d of dots) inner += `<circle cx="${X(d)}" cy="${y}" r="5" fill="${C.primary}"/>`;
  return svg(width, H, inner, 'aria-label="number line"');
}

/** Analogue clock showing h:mm */
export function clock(h, min, size = 130) {
  const r = size / 2 - 4, c = size / 2;
  let inner = `<circle cx="${c}" cy="${c}" r="${r}" fill="#fff" stroke="${C.ink}" stroke-width="3"/>`;
  for (let i = 1; i <= 12; i++) {
    const a = (i / 12) * 2 * Math.PI;
    inner += `<text x="${c + Math.sin(a) * (r - 13)}" y="${c - Math.cos(a) * (r - 13) + 5}" font-size="13" text-anchor="middle" fill="${C.ink}">${i}</text>`;
  }
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * 2 * Math.PI, l = i % 5 === 0 ? 5 : 2.5;
    inner += `<line x1="${c + Math.sin(a) * r}" y1="${c - Math.cos(a) * r}" x2="${c + Math.sin(a) * (r - l)}" y2="${c - Math.cos(a) * (r - l)}" stroke="${C.ink}" stroke-width="1"/>`;
  }
  const ha = (((h % 12) + min / 60) / 12) * 2 * Math.PI, ma = (min / 60) * 2 * Math.PI;
  inner += `<line x1="${c}" y1="${c}" x2="${c + Math.sin(ha) * r * 0.5}" y2="${c - Math.cos(ha) * r * 0.5}" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`;
  inner += `<line x1="${c}" y1="${c}" x2="${c + Math.sin(ma) * r * 0.78}" y2="${c - Math.cos(ma) * r * 0.78}" stroke="${C.primary}" stroke-width="3" stroke-linecap="round"/>`;
  inner += `<circle cx="${c}" cy="${c}" r="3.5" fill="${C.ink}"/>`;
  return svg(size, size, inner, 'aria-label="analogue clock"');
}
export const digital = (h, min, ampm) => `<span class="math" style="font-family:monospace;font-size:1.3em;background:#0f172a;color:#86efac;padding:2px 10px;border-radius:6px">${h}:${String(min).padStart(2, '0')}${ampm ? ' ' + ampm : ''}</span>`;

/** Fraction bar (strip) with `num` of `den` parts shaded */
export function fracBar(numr, den, { width = 240, color = C.primary, h = 34 } = {}) {
  const w = width / den;
  let inner = '';
  for (let i = 0; i < den; i++) inner += `<rect x="${2 + i * w}" y="2" width="${w}" height="${h}" fill="${i < numr ? color : '#fff'}" stroke="${C.ink}" stroke-width="2"/>`;
  return svg(width + 4, h + 4, inner, `aria-label="fraction bar ${numr} of ${den}"`);
}
/** Fraction circle (pie) with `num` of `den` slices shaded */
export function fracCircle(numr, den, { size = 100, color = C.primary } = {}) {
  const c = size / 2, r = size / 2 - 3;
  if (den === 1) return svg(size, size, `<circle cx="${c}" cy="${c}" r="${r}" fill="${numr ? color : '#fff'}" stroke="${C.ink}" stroke-width="2"/>`);
  let inner = '';
  for (let i = 0; i < den; i++) {
    const a0 = (i / den) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / den) * 2 * Math.PI - Math.PI / 2;
    const p = a => `${c + r * Math.cos(a)},${c + r * Math.sin(a)}`;
    inner += `<path d="M${c},${c} L${p(a0)} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${p(a1)} Z" fill="${i < numr ? color : '#fff'}" stroke="${C.ink}" stroke-width="2"/>`;
  }
  return svg(size, size, inner, `aria-label="fraction circle ${numr} of ${den}"`);
}
/** Area model: rows×cols grid with `shaded` cells shaded */
export function fracGrid(shaded, rows, cols, { cell = 28, color = C.primary } = {}) {
  let inner = '';
  for (let i = 0; i < rows * cols; i++) {
    inner += `<rect x="${2 + (i % cols) * cell}" y="${2 + Math.floor(i / cols) * cell}" width="${cell}" height="${cell}" fill="${i < shaded ? color : '#fff'}" stroke="${C.ink}" stroke-width="1.5"/>`;
  }
  return svg(cols * cell + 4, rows * cell + 4, inner);
}

/** Array of emoji / dots */
export const arrayPic = (r, c, e = '🔵') => {
  let s = '';
  for (let i = 0; i < r; i++) s += e.repeat(c) + (i + 1 < r ? '<br>' : '');
  return `<div style="font-size:24px;line-height:1.3">${s}</div>`;
};

/** Vertical bar graph. data: [[label, value]] */
export function barGraph(data, { title = '', max, step, width = 360, height = 190, color = C.primary, yLabel = '' } = {}) {
  const top = max ?? Math.max(...data.map(d => d[1]));
  const st = step ?? (top <= 10 ? 1 : top <= 20 ? 2 : top <= 50 ? 5 : 10);
  const ymax = Math.ceil(top / st) * st;
  const L = 36, B = 28, T = title ? 24 : 10, W = width - L - 8, H = height - B - T;
  const bw = W / data.length;
  let inner = title ? `<text x="${width / 2}" y="14" font-size="13" font-weight="700" text-anchor="middle" fill="${C.ink}">${title}</text>` : '';
  for (let v = 0; v <= ymax; v += st) {
    const y = T + H - (v / ymax) * H;
    inner += `<line x1="${L}" y1="${y}" x2="${width - 8}" y2="${y}" stroke="#e2e8f0"/><text x="${L - 6}" y="${y + 4}" font-size="11" text-anchor="end" fill="${C.ink}">${v}</text>`;
  }
  data.forEach(([lab, v], i) => {
    const h = (v / ymax) * H;
    inner += `<rect x="${L + i * bw + bw * 0.18}" y="${T + H - h}" width="${bw * 0.64}" height="${h}" fill="${color}"/>`;
    inner += `<text x="${L + i * bw + bw / 2}" y="${height - 10}" font-size="11" text-anchor="middle" fill="${C.ink}">${lab}</text>`;
  });
  inner += `<line x1="${L}" y1="${T}" x2="${L}" y2="${T + H}" stroke="${C.ink}" stroke-width="2"/><line x1="${L}" y1="${T + H}" x2="${width - 8}" y2="${T + H}" stroke="${C.ink}" stroke-width="2"/>`;
  return svg(width, height, inner, 'aria-label="bar graph"');
}
/** Pictograph as an HTML table: data [[label, count]], each symbol = `each` */
export function pictograph(data, { symbol = '⭐', each = 1, title = '' } = {}) {
  const rows = data.map(([l, v]) => {
    const full = Math.floor(v / each), half = (v / each) % 1 >= 0.5 ? '½' : '';
    return `<tr><td style="padding:3px 12px 3px 0;font-weight:600">${l}</td><td style="font-size:22px">${symbol.repeat(full)}${half}</td></tr>`;
  }).join('');
  return `<table style="border-collapse:collapse;margin:6px 0">${title ? `<caption style="font-weight:700;text-align:left">${title}</caption>` : ''}${rows}</table><div class="muted" style="font-size:13px">Each ${symbol} = ${each}${each > 1 ? '' : ''}</div>`;
}
/** simple HTML data table */
export function table(headers, rows) {
  return `<table style="border-collapse:collapse;margin:6px 0">${headers ? `<tr>${headers.map(h => `<th style="border:1px solid #cbd5e1;padding:4px 12px;background:#eef2ff">${h}</th>`).join('')}</tr>` : ''}${rows.map(r => `<tr>${r.map(c => `<td style="border:1px solid #cbd5e1;padding:4px 12px;text-align:center">${c}</td>`).join('')}</tr>`).join('')}</table>`;
}
/** tally marks for n */
export const tally = n => {
  const groups = Math.floor(n / 5), rest = n % 5;
  return `<span style="font-family:monospace;font-size:22px;letter-spacing:3px">${'𝍸 '.repeat(groups)}${'|'.repeat(rest)}</span>`;
};
/** Line plot: values array of numbers (x marks) */
export function linePlot(values, { min, max, step = 1, width = 400, label = '', fmtLabel = x => x } = {}) {
  const lo = min ?? Math.min(...values); let hi = max ?? Math.max(...values); if (hi <= lo) hi = lo + 1;
  const pad = 24, y0 = 100, X = v => pad + ((v - lo) / (hi - lo)) * (width - 2 * pad);
  let inner = `<line x1="${pad - 10}" y1="${y0}" x2="${width - pad + 10}" y2="${y0}" stroke="${C.ink}" stroke-width="2"/>`;
  for (let v = lo; v <= hi + 1e-9; v = fix(v + step)) inner += `<line x1="${X(v)}" y1="${y0 - 4}" x2="${X(v)}" y2="${y0 + 4}" stroke="${C.ink}"/><text x="${X(v)}" y="${y0 + 18}" font-size="11" text-anchor="middle" fill="${C.ink}">${fmtLabel(v)}</text>`;
  const counts = {};
  for (const v of values) { counts[v] = (counts[v] || 0) + 1; inner += `<text x="${X(v)}" y="${y0 - 6 - (counts[v] - 1) * 15}" font-size="15" font-weight="700" text-anchor="middle" fill="${C.primary}">✕</text>`; }
  if (label) inner += `<text x="${width / 2}" y="${y0 + 36}" font-size="12" text-anchor="middle" fill="${C.ink}">${label}</text>`;
  return svg(width, 150, inner, 'aria-label="line plot"');
}
/** Line graph: points [[label, value]] */
export function lineGraph(points, { max, step, width = 360, height = 190, title = '' } = {}) {
  const top = max ?? Math.max(...points.map(p => p[1]));
  const st = step ?? (top <= 10 ? 1 : top <= 20 ? 2 : top <= 50 ? 5 : 10);
  const ymax = Math.ceil(top / st) * st;
  const L = 36, B = 28, T = title ? 24 : 10, W = width - L - 14, H = height - B - T;
  const X = i => L + (points.length === 1 ? W / 2 : (i / (points.length - 1)) * W), Y = v => T + H - (v / ymax) * H;
  let inner = title ? `<text x="${width / 2}" y="14" font-size="13" font-weight="700" text-anchor="middle" fill="${C.ink}">${title}</text>` : '';
  for (let v = 0; v <= ymax; v += st) inner += `<line x1="${L}" y1="${Y(v)}" x2="${width - 10}" y2="${Y(v)}" stroke="#e2e8f0"/><text x="${L - 6}" y="${Y(v) + 4}" font-size="11" text-anchor="end" fill="${C.ink}">${v}</text>`;
  inner += `<polyline points="${points.map((p, i) => `${X(i)},${Y(p[1])}`).join(' ')}" fill="none" stroke="${C.primary}" stroke-width="2.5"/>`;
  points.forEach((p, i) => { inner += `<circle cx="${X(i)}" cy="${Y(p[1])}" r="4" fill="${C.primary}"/><text x="${X(i)}" y="${height - 10}" font-size="11" text-anchor="middle" fill="${C.ink}">${p[0]}</text>`; });
  inner += `<line x1="${L}" y1="${T}" x2="${L}" y2="${T + H}" stroke="${C.ink}" stroke-width="2"/><line x1="${L}" y1="${T + H}" x2="${width - 10}" y2="${T + H}" stroke="${C.ink}" stroke-width="2"/>`;
  return svg(width, height, inner, 'aria-label="line graph"');
}
/** Coordinate plane (first quadrant or all four). points: [{x,y,label?,color?}] */
export function plane({ min = 0, max = 10, points = [], size = 260, step = 1, labelEvery = 1, lines = [] } = {}) {
  const pad = 26, span = max - min, U = (size - 2 * pad) / span;
  const X = v => pad + (v - min) * U, Y = v => size - pad - (v - min) * U;
  let inner = '';
  for (let v = min; v <= max; v += step) {
    inner += `<line x1="${X(v)}" y1="${Y(min)}" x2="${X(v)}" y2="${Y(max)}" stroke="#e2e8f0"/><line x1="${X(min)}" y1="${Y(v)}" x2="${X(max)}" y2="${Y(v)}" stroke="#e2e8f0"/>`;
    if ((v - min) % labelEvery === 0) {
      const ax = min < 0 ? 0 : min;
      inner += `<text x="${X(v)}" y="${Y(ax) + 14}" font-size="10" text-anchor="middle" fill="${C.ink}">${v === 0 && min < 0 ? '' : fmt(v)}</text>`;
      if (v !== 0 || min >= 0) inner += `<text x="${X(ax) - 6}" y="${Y(v) + 4}" font-size="10" text-anchor="end" fill="${C.ink}">${v === 0 && min >= 0 ? '' : fmt(v)}</text>`;
    }
  }
  const ax = min < 0 ? 0 : min;
  inner += `<line x1="${X(min)}" y1="${Y(ax)}" x2="${X(max)}" y2="${Y(ax)}" stroke="${C.ink}" stroke-width="2"/><line x1="${X(ax)}" y1="${Y(min)}" x2="${X(ax)}" y2="${Y(max)}" stroke="${C.ink}" stroke-width="2"/>`;
  for (const l of lines) inner += `<line x1="${X(l[0])}" y1="${Y(l[1])}" x2="${X(l[2])}" y2="${Y(l[3])}" stroke="${C.primary}" stroke-width="2.5"/>`;
  for (const p of points) {
    inner += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="5.5" fill="${p.color || C.red}"/>`;
    if (p.label) inner += `<text x="${X(p.x) + 8}" y="${Y(p.y) - 7}" font-size="13" font-weight="700" fill="${p.color || C.red}">${p.label}</text>`;
  }
  return svg(size, size, inner, 'aria-label="coordinate plane"');
}

/* ---------- 2-D / 3-D shapes ---------- */
const poly = (pts, fill = '#c7d2fe', stroke = C.primary, extra = '') => `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round" ${extra}/>`;
const regular = (n, cx = 50, cy = 50, r = 42, rot = -Math.PI / 2) => Array.from({ length: n }, (_, i) => [cx + r * Math.cos(rot + (i * 2 * Math.PI) / n), cy + r * Math.sin(rot + (i * 2 * Math.PI) / n)].map(v => Math.round(v * 10) / 10));
export const SHAPES_2D = {
  circle: () => `<circle cx="50" cy="50" r="40" fill="#c7d2fe" stroke="${C.primary}" stroke-width="3"/>`,
  oval: () => `<ellipse cx="50" cy="50" rx="44" ry="28" fill="#c7d2fe" stroke="${C.primary}" stroke-width="3"/>`,
  triangle: () => poly([[50, 8], [92, 88], [8, 88]]),
  square: () => poly([[14, 14], [86, 14], [86, 86], [14, 86]]),
  rectangle: () => poly([[6, 26], [94, 26], [94, 74], [6, 74]]),
  rhombus: () => poly([[50, 6], [90, 50], [50, 94], [10, 50]]),
  trapezoid: () => poly([[28, 22], [72, 22], [94, 78], [6, 78]]),
  parallelogram: () => poly([[26, 24], [94, 24], [74, 76], [6, 76]]),
  pentagon: () => poly(regular(5)),
  hexagon: () => poly(regular(6, 50, 50, 44, 0)),
  heptagon: () => poly(regular(7)),
  octagon: () => poly(regular(8, 50, 50, 44, Math.PI / 8)),
  nonagon: () => poly(regular(9)),
  decagon: () => poly(regular(10))
};
export const SIDES = { triangle: 3, square: 4, rectangle: 4, rhombus: 4, trapezoid: 4, parallelogram: 4, pentagon: 5, hexagon: 6, heptagon: 7, octagon: 8, nonagon: 9, decagon: 10, circle: 0, oval: 0 };
export const shapeSvg = (name, size = 90) => svg(size, size, `<g transform="scale(${size / 100})">${SHAPES_2D[name]()}</g>`, `aria-label="${name}"`).replace(`width="${size}" height="${size}"`, `width="${size}" height="${size}"`);
/** several shapes inline */
export const shapeRow = names => `<div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center">${names.map(n => `<span>${shapeSvg(n, 80)}</span>`).join('')}</div>`;

// 3-D solids: [name, emoji-or-svg, faces, edges, vertices, curved?]
export const SOLIDS = [
  ['cube', '🧊', 6, 12, 8], ['rectangular prism', '📦', 6, 12, 8], ['triangular prism', '🔺', 5, 9, 6], ['square pyramid', '🔼', 5, 8, 5],
  ['triangular pyramid', '🔻', 4, 6, 4], ['pentagonal prism', '⬟', 7, 15, 10], ['hexagonal prism', '⬢', 8, 18, 12], ['pentagonal pyramid', '⬠', 6, 10, 6],
  ['cylinder', '🥫', 3, 2, 0], ['cone', '🍦', 2, 1, 1], ['sphere', '⚽', 1, 0, 0]
];

export { C as PALETTE };
