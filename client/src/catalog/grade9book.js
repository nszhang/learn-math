/* ============================================================
   LearnAce — Grade 9 expansion aligned to the MathLinks 9
   textbook (Canadian Grade 9). Sections mirror the textbook
   chapters; ids continue the t-series (t104..t151).
   ============================================================ */

import { svg, C } from './ixlMath/h.js';

const ri = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = arr => arr[ri(0, arr.length - 1)];
const shuffle = arr => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = ri(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const m = s => `<span class="math">${s}</span>`;
const sup = n => `<sup>${n}</sup>`;
const sub = n => `<sub>${n}</sub>`;
const MINUS = '−';
const fmtNum = n => String(n).replace('-', MINUS);
function mcChoices(correct, distractors) {
  const set = [correct];
  for (const d of distractors) if (!set.includes(d)) set.push(d);
  return shuffle(set);
}
const r2 = x => Number(x.toFixed(2));
/* 200000000 → "200 000 000" (SI digit grouping for display) */
const grp = n => { const [i, d] = String(n).split('.'); return i.replace(/\B(?=(\d{3})+$)/g, ' ') + (d ? '.' + d : ''); };
const S = (id, title, section, icon, gen) => ({ id, title, grade: 9, section, icon, gen });

/* "v = mx + b" as display text with proper signs (variable defaults to n). */
const linEq = (v, mv, b, x = 'n') => {
  const slope = mv === 1 ? '' : mv === -1 ? MINUS : fmtNum(mv);
  const term = `${slope}${x}`;
  if (b === 0) return `${v} = ${term}`;
  return `${v} = ${term} ${b > 0 ? '+' : MINUS} ${fmtNum(Math.abs(b))}`;
};
/* small x/y table of values */
const valTable = (xs, ys) => {
  const cell = v => `<td style="border:1px solid #94a3b8;padding:2px 10px">${fmtNum(v)}</td>`;
  const head = v => `<th style="border:1px solid #94a3b8;padding:2px 10px">${v}</th>`;
  return `<table style="border-collapse:collapse;margin:6px 0"><tr>${head('x')}${xs.map(cell).join('')}</tr><tr>${head('y')}${ys.map(cell).join('')}</tr></table>`;
};

/* Growing figure patterns (MathLinks 6.1 / HW 4.1 style). Each draw(n) returns
   { w, h, inner } for Figure n; count = mv·n + b0. */
const stick = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.accent}" stroke-width="3" stroke-linecap="round"/>`;
const tile = (x, y, s, fill = '#6ee7b7') => `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${fill}" stroke="${C.ink}" stroke-width="1"/>`;
const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="5" fill="${C.primary}"/>`;
const FIG_PATTERNS = [
  { obj: 'toothpicks', v: 't', mv: 3, b0: 1, draw: n => {   // row of squares
    const s = 22; let inner = '';
    for (let i = 0; i <= n; i++) inner += stick(i * s, 0, i * s, s);
    for (let i = 0; i < n; i++) inner += stick(i * s, 0, i * s + s, 0) + stick(i * s, s, i * s + s, s);
    return { w: n * s, h: s, inner };
  } },
  { obj: 'toothpicks', v: 't', mv: 2, b0: 1, draw: n => {   // strip of alternating triangles
    const s = 24, H = 21; let inner = '', w = 0;
    for (let i = 0; i < n; i++) {
      const k = Math.floor(i / 2);
      if (i % 2 === 0) { inner += stick(k * s, H, k * s + s, H) + stick(k * s, H, k * s + s / 2, 0) + stick(k * s + s, H, k * s + s / 2, 0); w = Math.max(w, k * s + s); }
      else { inner += stick(k * s + s / 2, 0, k * s + 1.5 * s, 0) + stick(k * s + 1.5 * s, 0, k * s + s, H); w = Math.max(w, k * s + 1.5 * s); }
    }
    return { w, h: H, inner };
  } },
  { obj: 'toothpicks', v: 't', mv: 5, b0: 1, draw: n => {   // row of houses sharing walls
    const s = 22, r = 14; let inner = '';
    for (let i = 0; i <= n; i++) inner += stick(i * s, r, i * s, r + s);
    for (let i = 0; i < n; i++) inner += stick(i * s, r + s, i * s + s, r + s) + stick(i * s, r, i * s + s, r) + stick(i * s, r, i * s + s / 2, 0) + stick(i * s + s / 2, 0, i * s + s, r);
    return { w: n * s, h: r + s, inner };
  } },
  { obj: 'tiles', v: 's', mv: 4, b0: 1, draw: n => {        // plus sign with arms of length n
    const s = 11, c = n * s; let inner = tile(c, c, s, '#fde047');
    for (let i = 1; i <= n; i++) inner += tile(c + i * s, c, s) + tile(c - i * s, c, s) + tile(c, c + i * s, s) + tile(c, c - i * s, s);
    return { w: (2 * n + 1) * s, h: (2 * n + 1) * s, inner };
  } },
  { obj: 'tiles', v: 's', mv: 2, b0: 1, draw: n => {        // n tiles on top of n + 1 tiles
    const s = 16; let inner = '';
    for (let i = 0; i < n; i++) inner += tile(i * s, 0, s);
    for (let i = 0; i <= n; i++) inner += tile(i * s, s, s);
    return { w: (n + 1) * s, h: 2 * s, inner };
  } },
  { obj: 'tiles', v: 's', mv: 3, b0: 2, draw: n => {        // 3 × n rectangle with a tile at each end of the middle row
    const s = 13; let inner = tile(0, s, s) + tile((n + 1) * s, s, s);
    for (let i = 1; i <= n; i++) for (let r = 0; r < 3; r++) inner += tile(i * s, r * s, s);
    return { w: (n + 2) * s, h: 3 * s, inner };
  } },
  ...[[2, 1], [2, 3], [3, 1], [3, 2], [4, 1], [4, 3]].map(([mv, b0]) => ({ obj: 'dots', v: 'd', mv, b0, draw: n => {
    const g = 14; let inner = '';                          // b0 dots, then n columns of mv dots
    for (let r = 0; r < b0; r++) inner += dot(6, 6 + r * g);
    for (let i = 1; i <= n; i++) for (let r = 0; r < mv; r++) inner += dot(6 + i * g + 6, 6 + r * g);
    return { w: n * g + 24, h: (Math.max(mv, b0) - 1) * g + 12, inner };
  } }))
];
/* Figures 1–3 of a pattern side by side, labelled underneath. */
const figureStrip = pat => {
  const figs = [1, 2, 3].map(n => pat.draw(n));
  const H = Math.max(...figs.map(f => f.h)), gap = 30;
  let x = 8, inner = '';
  figs.forEach((f, i) => {
    const w = Math.max(f.w, 52);
    inner += `<g transform="translate(${x + (w - f.w) / 2},${8 + H - f.h})">${f.inner}</g>`;
    inner += `<text x="${x + w / 2}" y="${H + 30}" font-size="13" text-anchor="middle" fill="${C.ink}">Figure ${i + 1}</text>`;
    x += w + gap;
  });
  return svg(x - gap + 8, H + 38, inner, 'aria-label="figures 1 to 3 of a growing pattern"');
};

export const GRADE9_BOOK_SKILLS = [
  /* ===== Chapter 1: Symmetry and Surface Area ===== */
  S('t104', 'Lines of symmetry of regular polygons', 'Symmetry', '📐', () => {
    const [name, n] = pick([['square', 4], ['regular pentagon', 5], ['regular hexagon', 6], ['regular octagon', 8], ['equilateral triangle', 3]]);
    return { type: 'num', prompt: `How many <strong>lines of symmetry</strong> does a ${m(name)} have?`,
      answer: n,
      explain: `💡 A regular polygon has as many lines of symmetry as it has sides: <strong>${n}</strong>.` };
  }),
  S('t105', 'Rotation symmetry', 'Symmetry', '📐', () => {
    const [shape, order] = pick([['square', 4], ['regular pentagon', 5], ['regular hexagon', 6], ['equilateral triangle', 3]]);
    return { type: 'num',
      prompt: `A ${m(shape)} has rotation symmetry. What is its <strong>order of rotation</strong> (how many times it maps onto itself in one full turn)?`,
      answer: order,
      explain: `💡 Order of rotation = the number of times the shape looks unchanged in a 360° turn.
        For a regular polygon that's the number of sides: <strong>${order}</strong>.` };
  }),
  S('t106', 'Surface area of triangular prisms', 'Surface area', '📦', () => {
    const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]);
    const L = ri(2, 10);
    const ans = a * b + (a + b + c) * L;
    return { type: 'num',
      prompt: `A prism ${m(String(L))} cm long has right-triangle ends with legs ${m(`${a} cm`)} and ${m(`${b} cm`)} (hypotenuse ${m(`${c} cm`)}). What is its <strong>surface area</strong>?`,
      answer: ans,
      explain: `Two triangle ends: 2 × ½ × ${a} × ${b} = ${a * b}.<br>
        Three rectangle sides: (${a} + ${b} + ${c}) × ${L} = ${(a + b + c) * L}.<br>
        Total SA = <strong>${ans} cm²</strong>.` };
  }),
  S('t107', 'Surface area of an open box', 'Surface area', '📦', () => {
    const l = ri(3, 9), w = ri(3, 9), h = ri(2, 9);
    const ans = l * w + 2 * l * h + 2 * w * h;
    return { type: 'num',
      prompt: `An <strong>open-top</strong> box (no lid) is ${m(`${l} × ${w}`)} cm with height ${m(`${h} cm`)}. What is its <strong>surface area</strong>?`,
      answer: ans,
      explain: `No top! Bottom only once: ${l} × ${w} = ${l * w}.
        Two pairs of sides: 2(${l}×${h}) + 2(${w}×${h}) = ${2 * l * h} + ${2 * w * h}.<br>
        SA = <strong>${ans} cm²</strong>. 💡 Read carefully — "open" changes the count!` };
  }),

  /* ===== Chapter 2: Rational Numbers ===== */
  S('t108', 'Compare rational numbers', 'Rational numbers', '🔢', () => {
    const pairs = pick([
      [[-3, 4], -0.8], [[-5, 8], -0.7], [[7, 10], 0.65], [[-2, 3], -0.75], [[3, 5], 0.5], [[-7, 20], -0.4]
    ]);
    const [frac, dec] = pairs;
    const [num, den] = frac;
    const correct = num / den > dec ? `${num}/${den}` : fmtNum(dec);
    return { type: 'mc',
      prompt: `Which is <strong>greater</strong>: ${m(`${num}/${den}`)} or ${m(fmtNum(dec))} ?`,
      answer: correct, choices: [`${num}/${den}`, fmtNum(dec)],
      explain: `${num}/${den} = ${fmtNum(Number((num / den).toFixed(4)))}. Comparing: <strong>${correct}</strong> is greater.
        💡 With negatives, closer to zero means greater!` };
  }),
  S('t109', 'Operations with rational numbers', 'Rational numbers', '🔢', () => {
    const a = ri(-15, 15) / 10 || -1.2, b = ri(-15, 15) / 10 || 0.4;
    const add = pick([true, false]);
    const ans = Number(((add ? a + b : a - b)).toFixed(1));
    return { type: 'num',
      prompt: `${m(`(${fmtNum(a)}) ${add ? '+' : MINUS} (${fmtNum(b)}) = ?`)}`,
      answer: ans,
      explain: `${add ? 'Add' : 'Subtract'} signed decimals: ${fmtNum(a)} ${add ? '+' : MINUS} ${fmtNum(b)} = <strong>${fmtNum(ans)}</strong>.` };
  }),
  S('t110', 'Operations with negative fractions', 'Rational numbers', '🔢', () => {
    const d = pick([5, 6, 7, 8, 9]);
    const a = ri(1, d - 1), b = ri(1, d - 1);
    const negFirst = pick([true, false]);
    const n1 = negFirst ? -a : a, n2 = negFirst ? b : -b;
    const ansN = n1 + n2;
    const correct = `${ansN}/${d}`;
    return { type: 'mc',
      prompt: `${m(`${fmtNum(n1)}/${d} + ${fmtNum(n2)}/${d} = ?`)}`,
      answer: correct,
      choices: mcChoices(correct, [`${Math.abs(ansN)}/${d}`, `${ansN + 1}/${d}`, `${d - ansN}/${d}`]),
      explain: `Same denominator — add numerators with signs: ${fmtNum(n1)} + ${fmtNum(n2)} = ${fmtNum(ansN)} → <strong>${correct}</strong>.` };
  }),
  S('t111', 'Square roots of rational numbers', 'Rational numbers', '🔢', () => {
    if (pick([true, false])) {
      const [num, den, rn, rd] = pick([[16, 25, 4, 5], [9, 16, 3, 4], [25, 36, 5, 6], [4, 49, 2, 7], [36, 81, 6, 9]]);
      const correct = `${rn}/${rd}`;
      return { type: 'mc', prompt: `${m(`√(${num}/${den}) = ?`)}`,
        answer: correct,
        choices: mcChoices(correct, [`${num}/${Math.round(Math.sqrt(den))}`, `${Math.round(Math.sqrt(num))}/${den}`, `${num * num}/${den}`]),
        explain: `√a/√b splits: √${num} = ${rn} and √${den} = ${rd} → <strong>${correct}</strong>.` };
    }
    const [sq, root] = pick([[0.36, 0.6], [0.49, 0.7], [0.25, 0.5], [0.64, 0.8], [0.81, 0.9], [0.04, 0.2]]);
    return { type: 'num', prompt: `${m(`√${sq}`)} = ?`, answer: root,
      explain: `${root}² = ${sq}, so √${sq} = <strong>${root}</strong>. 💡 Square root works on decimals too!` };
  }),

  /* ===== Chapter 3: Powers (into existing Exponents section) ===== */
  S('t112', 'Powers of 10', 'Exponents', '💪', () => {
    const n = ri(2, 6);
    const val = Math.pow(10, n);
    return { type: 'num', prompt: `${m(`10${sup(n)} = ?`)}`, answer: val,
      explain: `10${sup(n)} is a 1 followed by ${n} zeros: <strong>${fmtNum(val)}</strong>.` };
  }),
  S('t113', 'Order of operations with powers', 'Exponents', '💪', () => {
    const c = ri(2, 9), d = ri(2, 5), e = ri(2, 4);
    const g = ri(2, 3), f = g * ri(2, 6);
    const ans = c + d * d * e - f / g;
    return { type: 'num', prompt: `${m(`${c} + ${d}² × ${e} − ${f} ÷ ${g} = ?`)}`,
      answer: ans,
      explain: `BEDMAS: powers first → ${c} + ${d * d} × ${e} − ${f / g}; then multiply → ${c} + ${d * d * e} − ${f / g}.<br>
        <strong>${ans}</strong>.` };
  }),

  /* ===== Chapter 4: Scale Factors and Similarity ===== */
  S('t114', 'Enlargements and reductions', 'Scale factors and similarity', '📐', () => {
    const len = ri(2, 12);
    const k = pick([2, 2.5, 3, 0.5, 0.25, 1.5]);
    const ans = Number((len * k).toFixed(1));
    return { type: 'num',
      prompt: `A diagram has a side of ${m(`${len} cm`)}. It is ${k > 1 ? 'enlarged' : 'reduced'} by a <strong>scale factor of ${m(fmtNum(k))}</strong>. What is the new side length?`,
      answer: ans,
      explain: `${k > 1 ? 'Enlarge' : 'Reduce'} = multiply every dimension by the factor: ${len} × ${fmtNum(k)} = <strong>${fmtNum(ans)} cm</strong>.` };
  }),
  S('t115', 'Scale diagrams', 'Scale factors and similarity', '📐', () => {
    const scale = pick([1000, 2500, 5000, 10000, 25000, 50000]);
    const d = ri(2, 8);
    return { type: 'num',
      prompt: `A map uses a scale of ${m(`1 : ${scale}`)}. Two towns are ${m(`${d} cm`)} apart on the map. How far apart are they <strong>in real life (in km)</strong>?`,
      answer: Number(((d * scale) / 100000).toFixed(2)),
      explain: `Real distance = ${d} × ${scale} = ${d * scale} cm = ${d * scale / 100} m = <strong>${((d * scale) / 100000).toFixed(2)} km</strong>.` };
  }),
  S('t116', 'Similar triangles', 'Scale factors and similarity', '📐', () => {
    const [a, b] = [3, 4];
    const k = ri(2, 5);
    const askLong = pick([true, false]);
    const given = askLong ? a : b, find = askLong ? b : a;
    const ans = k * find;
    return { type: 'num',
      prompt: `Two similar right triangles. The first has legs ${m(`${a}`)} and ${m(`${b}`)}. The second's shorter leg is ${m(String(a * k))}. What is its <strong>longer leg</strong>?`,
      answer: ans,
      explain: `Similar → sides scale by the same factor: ${a * k} ÷ ${a} = ${k}, so the longer leg is ${b} × ${k} = <strong>${ans}</strong>.` };
  }),
  S('t117', 'Similar polygons', 'Scale factors and similarity', '📐', () => {
    const pairs = pick([[4, 10, 6], [3, 9, 5], [5, 15, 8], [2, 8, 7], [6, 9, 4]]);
    const [s1, s1b, s2] = pairs;
    const k = s1b / s1;
    const ans = Number((s2 * k).toFixed(1));
    return { type: 'num',
      prompt: `${m('ABCD ~ EFGH')}. Side ${m(`AB = ${s1}`)} corresponds to ${m(`EF = ${s1b}`)}, and ${m(`BC = ${s2}`)} corresponds to FG. Find ${m('FG')}.`,
      answer: ans,
      explain: `Scale factor from ABCD to EFGH: ${s1b} ÷ ${s1} = ${fmtNum(k)}.<br>
        FG = ${s2} × ${fmtNum(k)} = <strong>${fmtNum(ans)}</strong>.` };
  }),

  /* ===== Chapter 4 (more): Scale factors and similarity — 4.1–4.4, HW 7.1–7.4 ===== */
  S('t141', 'Enlargement, reduction or same size?', 'Scale factors and similarity', '🔎', () => {
    const ENL = 'an enlargement', RED = 'a reduction', SAME = 'neither — same size';
    const kind = pick(['factor', 'factor', 'lengths', 'meaning']);
    if (kind === 'meaning') {
      const [k, correct, wrong] = pick([
        ['10', 'the image is 10 times as large as the original', ['the image is 1/10 the size of the original', 'the image is 10 cm larger', 'the image is the same size']],
        ['0.001', 'the image is 1/1000 the size of the original', ['the image is 1000 times as large', 'the image is 0.001 cm smaller', 'the image is the same size']],
        ['1', 'the image is exactly the same size as the original', ['the image is twice as large', 'the image is 1 cm larger', 'the image is 1/10 the size']],
        ['0.5', 'the image is half the size of the original', ['the image is twice as large', 'the image is 0.5 cm smaller', 'the image is 5 times as large']],
        ['2.5', 'the image is 2.5 times as large as the original', ['the image is 2.5 cm larger', 'the image is 1/2.5 the size', 'the image is the same size']]
      ]);
      return { type: 'mc',
        prompt: `What does a <strong>scale factor of ${m(k)}</strong> mean?`,
        answer: correct, choices: mcChoices(correct, wrong),
        explain: `Scale factor = image length ÷ actual length. A factor of ${k} multiplies every length by ${k}, so <strong>${correct}</strong>.<br>💡 A scale factor has no units — it's a ratio of two lengths in the same unit.` };
    }
    if (kind === 'factor') {
      const [k, v] = pick([['3', 3], ['1.5', 1.5], ['10', 10], ['5/4', 1.25], ['0.25', 0.25], ['0.8', 0.8], ['2/3', 2 / 3], ['0.001', 0.001], ['1/50', 0.02], ['1', 1], ['100%', 1], ['1.05', 1.05], ['0.99', 0.99]]);
      const correct = v > 1 ? ENL : v < 1 ? RED : SAME;
      return { type: 'mc',
        prompt: `A figure is drawn using a <strong>scale factor of ${m(k)}</strong>. Is the image an enlargement or a reduction?`,
        answer: correct, choices: [ENL, RED, SAME],
        explain: `Scale factor ${v > 1 ? '&gt; 1 → <strong>enlargement</strong>' : v < 1 ? '&lt; 1 → <strong>reduction</strong>' : '= 1 → <strong>same size</strong> (a congruent copy)'}.<br>💡 Compare the factor to 1: bigger than 1 enlarges, between 0 and 1 reduces.` };
    }
    // compare an original and an image length — sometimes in different units
    const orig = ri(4, 20), k = pick([0.5, 0.8, 1, 1.5, 2, 3, 0.25, 1.2]);
    const imgCm = Number((orig * k).toFixed(2));
    const inMm = pick([true, false]);
    const imgTxt = inMm ? `${fmtNum(Number((imgCm * 10).toFixed(1)))} mm` : `${fmtNum(imgCm)} cm`;
    const correct = k > 1 ? ENL : k < 1 ? RED : SAME;
    return { type: 'mc',
      prompt: `A side of a figure is ${m(`${orig} cm`)}. The matching side of its image is ${m(imgTxt)}. Is the image an enlargement or a reduction?`,
      answer: correct, choices: [ENL, RED, SAME],
      explain: `${inMm ? `Same units first: ${imgTxt} = ${fmtNum(imgCm)} cm.<br>` : ''}Scale factor = image ÷ original = ${fmtNum(imgCm)} ÷ ${orig} = ${fmtNum(k)} → <strong>${correct}</strong>.${inMm ? '<br>💡 Always convert to the same unit before comparing!' : ''}` };
  }),
  S('t142', 'Convert metric lengths (km, m, cm, mm)', 'Scale factors and similarity', '📏', () => {
    const MM = { km: 1e6, m: 1e3, cm: 10, mm: 1 };
    const units = Object.keys(MM);
    let v, a, b, ans;
    do {
      a = pick(units); do { b = pick(units); } while (b === a);
      v = pick([8, 13, 90, 180, 16.5, 19, 5838, 9292, 0.45, 2.3, 250, 7.25, 3.6, 48, 1200, 0.8]);
      ans = Number((v * MM[a] / MM[b]).toPrecision(12));
    } while (ans < 0.001 || ans > 1e8);
    const bigger = MM[a] > MM[b];
    const factor = bigger ? MM[a] / MM[b] : MM[b] / MM[a];
    return { type: 'num',
      prompt: `Convert: ${m(`${fmtNum(v)} ${a} = ? ${b}`)}`,
      answer: ans,
      explain: `1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm.<br>
        1 ${bigger ? a : b} = ${factor} ${bigger ? b : a}, so ${bigger ? `<em>multiply</em> by ${factor}` : `<em>divide</em> by ${factor}`}: ${fmtNum(v)} ${bigger ? '×' : '÷'} ${factor} = <strong>${fmtNum(ans)} ${b}</strong>.<br>
        💡 ${bigger ? 'Big unit → small unit: the number gets bigger.' : 'Small unit → big unit: the number gets smaller.'}` };
  }),
  S('t143', 'Find the scale factor', 'Scale factors and similarity', '🧮', () => {
    const MM = { km: 1e6, m: 1e3, cm: 10, mm: 1 };
    const [what, model, av, au, iu, ks] = pick([
      ['car', 'toy car', 5, 'm', 'cm', [0.036, 0.04, 0.05]],
      ['giraffe', 'toy giraffe', 6, 'm', 'cm', [0.005, 0.01, 0.025]],
      ['hotel', 'model hotel', 150, 'm', 'cm', [0.0004, 0.0002, 0.001]],
      ['ladybug', 'model ladybug', 1.2, 'cm', 'cm', [50, 25, 40]],
      ['ant', 'model ant', 9, 'mm', 'cm', [100, 50, 20]],
      ['E. coli bacterium', 'model bacterium', 0.005, 'mm', 'cm', [70000, 40000, 20000]],
      ['donut', 'giant donut sign', 9, 'cm', 'm', [200, 100, 50]],
      ['bridge', 'map of the bridge', 1.2, 'km', 'cm', [0.0001, 0.00005]],
      ['city', 'city map', 40, 'km', 'cm', [0.000005, 0.0000025]]
    ]);
    const k = pick(ks);
    const iv = Number((av * MM[au] * k / MM[iu]).toPrecision(12));
    const u = MM[iu] < MM[au] ? iu : au;   // compare both lengths in the smaller unit
    const aU = Number((av * MM[au] / MM[u]).toPrecision(12)), iU = Number((iv * MM[iu] / MM[u]).toPrecision(12));
    const ratio = k < 0.01;   // tiny factors are written 1 : N
    const N = Math.round(1 / k);
    return { type: 'num',
      prompt: `A real ${what} is ${m(`${fmtNum(av)} ${au}`)} long. A ${model} is ${m(`${fmtNum(iv)} ${iu}`)} long. ${ratio
        ? `Write the scale as ${m('1 : N')}. What is ${m('N')}?`
        : 'What is the scale factor? (as a decimal or whole number)'}`,
      answer: ratio ? N : k,
      explain: `${iu === au ? '' : `① Same units: ${u === au ? `${fmtNum(iv)} ${iu} = ${grp(iU)} ${u}` : `${fmtNum(av)} ${au} = ${grp(aU)} ${u}`}.<br>
        ② `}Scale factor = image ÷ actual = ${grp(iU)} ÷ ${grp(aU)} = ${ratio ? `${fmtNum(k)} = 1 ÷ ${grp(N)}, so the scale is <strong>1 : ${grp(N)}</strong>` : `<strong>${fmtNum(k)}</strong>`}.<br>
        💡 ${k > 1 ? 'Greater than 1 — an enlargement.' : 'Less than 1 — a reduction.'} A scale factor has no units.` };
  }),
  S('t144', 'Find the actual size from a scale', 'Scale factors and similarity', '🔭', () => {
    const MM = { km: 1e6, m: 1e3, cm: 10, mm: 1 };
    const [desc, av, au, iu, k, asRatio] = pick([
      ['A drawing of a hockey stick', 147, 'cm', 'cm', 1 / 42, true],
      ['A map', 11000, 'km', 'cm', 1 / 200000000, true],
      ['A scale model of a building', 240, 'm', 'cm', 0.0005, false],
      ['A toy model of a car', 4.8, 'm', 'm', 0.25, false],
      ['A blueprint of a house', 12, 'm', 'cm', 1 / 300, true],
      ['A magnified photo of a beetle', 8, 'mm', 'cm', 5, false],
      ['A microscope image of a cell', 0.05, 'mm', 'cm', 400, false],
      ['A poster of a honeybee', 1.5, 'cm', 'cm', 12, false],
      ['A model of a train', 26.1, 'm', 'cm', 1 / 87, true]
    ]);
    const iv = Number((av * MM[au] * k / MM[iu]).toPrecision(10));
    const scaleTxt = asRatio ? `a scale of ${m(`1 : ${grp(Math.round(1 / k))}`)}` : `a scale factor of ${m(fmtNum(k))}`;
    const actualInIu = Number((iv / k).toPrecision(10));
    return { type: 'num',
      prompt: `${desc} uses ${scaleTxt}. On it, the length is ${m(`${fmtNum(iv)} ${iu}`)}. What is the <strong>actual</strong> length in ${m(au)}?`,
      answer: av,
      explain: `image = scale factor × actual, so <em>actual = image ÷ scale factor</em>${asRatio ? ` (dividing by 1/${grp(Math.round(1 / k))} = multiplying by ${grp(Math.round(1 / k))})` : ''}.<br>
        ${fmtNum(iv)} ${iu} ${asRatio ? `× ${grp(Math.round(1 / k))}` : `÷ ${fmtNum(k)}`} = ${iu !== au ? `${grp(actualInIu)} ${iu} = ` : ''}<strong>${grp(av)} ${au}</strong>.` };
  }),
  S('t145', 'Corresponding parts of similar triangles', 'Scale factors and similarity', '🔗', () => {
    const letters = shuffle('ABCDEFGHJKLMNPQRSTUVWXYZ'.split('')).slice(0, 6);
    const P = letters.slice(0, 3), Q = letters.slice(3);
    const stmt = `△${P.join('')} ∼ △${Q.join('')}`;
    const side = (T, i, j) => T[i] + T[j];
    const pairs = [[0, 1], [1, 2], [0, 2]];
    const kind = pick(['side', 'side', 'angle', 'ratio']);
    const [i, j] = pick(pairs);
    if (kind === 'angle') {
      const a = ri(0, 2);
      const correct = `∠${Q[a]}`;
      return { type: 'mc',
        prompt: `${m(stmt)}. Which angle is equal to ${m(`∠${P[a]}`)}?`,
        answer: correct, choices: mcChoices(correct, Q.filter((_, x) => x !== a).map(l => `∠${l}`).concat(`∠${P[(a + 1) % 3]}`)),
        explain: `Letters in the same position match: ${P.map((l, x) => `${l}↔${Q[x]}`).join(', ')}. So ∠${P[a]} = <strong>${correct}</strong>.<br>💡 Corresponding angles of similar triangles are equal.` };
    }
    if (kind === 'ratio') {
      const correct = `${side(P, 1, 2)}/${side(Q, 1, 2)}`;
      const wrong = [`${side(P, 1, 2)}/${side(Q, 0, 2)}`, `${side(Q, 1, 2)}/${side(P, 1, 2)}`, `${side(P, 0, 2)}/${side(Q, 0, 1)}`];
      return { type: 'mc',
        prompt: `${m(stmt)}. Which ratio is equal to ${m(`${side(P, 0, 1)}/${side(Q, 0, 1)}`)}?`,
        answer: correct, choices: mcChoices(correct, wrong),
        explain: `Corresponding sides are proportional: ${side(P, 0, 1)}/${side(Q, 0, 1)} = ${side(P, 1, 2)}/${side(Q, 1, 2)} = ${side(P, 0, 2)}/${side(Q, 0, 2)}.<br>
          Keep the <em>same triangle on top</em> in every ratio → <strong>${correct}</strong>.` };
    }
    const fromFirst = pick([true, false]);
    const [A, B] = fromFirst ? [P, Q] : [Q, P];
    const correct = side(B, i, j);
    const others = pairs.filter(([x, y]) => !(x === i && y === j)).map(([x, y]) => side(B, x, y));
    return { type: 'mc',
      prompt: `${m(stmt)}. Which side corresponds to ${m(side(A, i, j))}?`,
      answer: correct, choices: mcChoices(correct, [...others, side(A, (i + 1) % 3, (j + 1) % 3)]),
      explain: `Match letters by position: ${P.map((l, x) => `${l}↔${Q[x]}`).join(', ')}.<br>
        ${A[i]}↔${B[i]} and ${A[j]}↔${B[j]}, so ${side(A, i, j)} corresponds to <strong>${correct}</strong>.` };
  }),
  S('t146', 'Are the triangles similar?', 'Scale factors and similarity', '🔺', () => {
    const YES = 'similar', NO = 'not similar';
    if (pick([true, false])) {
      // two angles of each triangle (MathLinks review #16)
      let x, y; do { x = 5 * ri(6, 18); y = 5 * ri(6, 18); } while (x === y || x + y >= 160);
      const z = 180 - x - y;
      let similar = pick([true, false]);
      const t1 = [x, y];
      let t2;
      if (similar) t2 = shuffle(pick([[x, z], [y, z], [x, y]]));
      else { const d = pick([5, 10, -5, -10]); t2 = shuffle([x, z + d]); }
      const z2 = 180 - t2[0] - t2[1];
      similar = [x, y, z].sort().join() === [t2[0], t2[1], z2].sort().join();   // a nudged angle can land on a match
      return { type: 'mc',
        prompt: `Two angles of one triangle measure ${m(`${t1[0]}°`)} and ${m(`${t1[1]}°`)}. Two angles of another triangle measure ${m(`${t2[0]}°`)} and ${m(`${t2[1]}°`)}. Are the triangles similar?`,
        answer: similar ? YES : NO, choices: [YES, NO],
        explain: `Find each third angle (angles add to 180°):<br>
          first: ${x}°, ${y}°, ${z}° &nbsp; second: ${t2[0]}°, ${t2[1]}°, ${z2}°.<br>
          ${similar ? 'All three angles match → <strong>similar</strong>.' : 'The angles don\'t all match → <strong>not similar</strong>.'}<br>💡 Two triangles are similar if corresponding angles are equal.` };
    }
    // side lengths (MathLinks 4.3 #5–6)
    const base = pick([[3, 4, 5], [5, 12, 13], [4, 6, 7], [2, 3, 4], [5, 6, 8], [6, 8, 9], [7, 8, 10]]);
    const k = pick([1.5, 2, 2.5, 3, 0.5, 4]);
    const similar = pick([true, false]);
    const t2 = base.map(s => Number((s * k).toFixed(2)));
    if (!similar) { const idx = ri(0, 2); t2[idx] = Number((t2[idx] + pick([1, -1, 0.5, 2])).toFixed(2)); }
    const ratios = base.map((s, idx) => Number((t2[idx] / s).toFixed(3)));
    return { type: 'mc',
      prompt: `One triangle has sides ${m(base.join(', '))}. Another has sides ${m(t2.map(fmtNum).join(', '))}. Are the triangles similar?`,
      answer: similar ? YES : NO, choices: [YES, NO],
      explain: `Pair shortest with shortest, longest with longest and divide:<br>
        ${base.map((s, idx) => `${fmtNum(t2[idx])} ÷ ${s} = ${fmtNum(ratios[idx])}`).join(', ')}.<br>
        ${similar ? `All ratios are equal (scale factor ${fmtNum(k)}) → <strong>similar</strong>.` : 'The ratios are not all equal → <strong>not similar</strong>.'}<br>💡 Similar triangles have proportional corresponding sides.` };
  }),
  S('t147', 'Always similar? True or false', 'Scale factors and similarity', '✅', () => {
    const [stmt, tf, why] = pick([
      ['All equilateral triangles are similar', true, 'Every angle is 60°, so the angles always match.'],
      ['All isosceles triangles are similar', false, 'The vertex angle can be anything — a 20°-80°-80° and a 100°-40°-40° triangle are both isosceles.'],
      ['All isosceles right triangles are similar', true, 'Their angles are always 45°, 45°, 90°.'],
      ['All right triangles are similar', false, 'Only one angle is fixed at 90° — the other two can change (30°-60° vs 45°-45°).'],
      ['All squares are similar', true, 'All angles are 90° and all sides are equal, so the side ratios always match.'],
      ['All rectangles are similar', false, 'A 1 × 2 rectangle and a 1 × 5 rectangle have the same angles but sides that are not proportional.'],
      ['All rhombuses are similar', false, 'Their sides are proportional, but the angles can change (a square vs a squashed rhombus).'],
      ['All regular hexagons are similar', true, 'Every angle is 120° and all sides are equal.'],
      ['All circles are similar', true, 'Any circle is an enlargement or reduction of any other.'],
      ['If two triangles are similar, they have the same shape', true, 'Similar means same shape, possibly different size.'],
      ['If two triangles are similar, they are the same size', false, 'Similar figures can be different sizes — only congruent figures must be the same size.'],
      ['Congruent figures are also similar', true, 'They have the same shape — the scale factor is 1.'],
      ['Similar figures are always congruent', false, 'Only when the scale factor is 1.'],
      ['Similar polygons have only some of their angles equal', false, 'ALL corresponding angles of similar polygons are equal.'],
      ['If two angles of one triangle equal two angles of another triangle, the triangles are similar', true, 'The third angles must then be equal too (angles add to 180°).'],
      ['Two polygons with equal angles are always similar', false, 'Rectangles have equal angles but need not be similar — sides must also be proportional (except for triangles).']
    ]);
    return { type: 'mc',
      prompt: `True or false? <em>"${stmt}."</em>`,
      answer: tf ? 'true' : 'false', choices: ['true', 'false'],
      explain: `<strong>${tf ? 'True' : 'False'}.</strong> ${why}` };
  }),
  S('t148', 'Are the polygons similar?', 'Scale factors and similarity', '▭', () => {
    const YES = 'similar', NO = 'not similar';
    if (ri(1, 5) === 1) {   // MathLinks 4.4 #4a: squares vs a rhombus
      const s = pick([3, 4, 5]), t = s / 2;
      const isSquare = pick([true, false]);
      return { type: 'mc',
        prompt: `A square has sides ${m(String(s))}. A ${isSquare ? 'smaller square' : 'rhombus with angles 60° and 120°'} has sides ${m(fmtNum(t))}. Are they similar?`,
        answer: isSquare ? YES : NO, choices: [YES, NO],
        explain: isSquare
          ? `Sides are proportional (ratio ${fmtNum(t)} ÷ ${s} = 0.5) and all angles are 90° → <strong>similar</strong>.`
          : `The sides are proportional, but the angles are not equal (90° vs 60°/120°) → <strong>not similar</strong>.<br>💡 Polygons need BOTH equal angles and proportional sides.` };
    }
    const w = ri(2, 8), l = w + ri(1, 8);
    const k = pick([1.5, 2, 2.5, 3, 0.5, 4]);
    const similar = pick([true, false]);
    const w2 = Number((w * k).toFixed(2));
    const l2 = similar ? Number((l * k).toFixed(2)) : Number((l * k + pick([1, 2, -1, 3])).toFixed(2));
    return { type: 'mc',
      prompt: `Rectangle A is ${m(`${w} × ${l}`)}. Rectangle B is ${m(`${fmtNum(w2)} × ${fmtNum(l2)}`)}. Are the rectangles similar?`,
      answer: similar ? YES : NO, choices: [YES, NO],
      explain: `All angles are 90°, so compare the sides: ${fmtNum(w2)} ÷ ${w} = ${fmtNum(Number((w2 / w).toFixed(3)))} and ${fmtNum(l2)} ÷ ${l} = ${fmtNum(Number((l2 / l).toFixed(3)))}.<br>
        ${similar ? 'Same ratio → <strong>similar</strong>.' : 'Different ratios → <strong>not similar</strong>.'}` };
  }),
  S('t149', 'Perimeter and area of similar figures', 'Scale factors and similarity', '🖼️', () => {
    const kind = pick(['photo', 'perimeter', 'trim', 'area', 'factor']);
    if (kind === 'photo') {   // HW 7.2 #10
      const [w, h] = pick([[10, 15], [4, 6], [8, 10], [5, 7]]), k = pick([2, 3, 1.5, 2.5, 4]);
      const ans = Number((w * k * h * k).toFixed(2));
      return { type: 'num',
        prompt: `${w === 8 ? 'An' : 'A'} ${m(`${w} cm × ${h} cm`)} photo is enlarged by a scale factor of ${m(fmtNum(k))}. What is the <strong>area</strong> of the enlarged photo in cm²?`,
        answer: ans,
        explain: `New sides: ${w} × ${fmtNum(k)} = ${fmtNum(r2(w * k))} cm and ${h} × ${fmtNum(k)} = ${fmtNum(r2(h * k))} cm.<br>
          Area = ${fmtNum(r2(w * k))} × ${fmtNum(r2(h * k))} = <strong>${fmtNum(ans)} cm²</strong>.<br>💡 Check: the area grows by k² = ${fmtNum(k * k)}, not by ${fmtNum(k)}.` };
    }
    if (kind === 'perimeter') {
      const P = ri(12, 40), k = pick([2, 3, 1.5, 0.5, 2.5]);
      const ans = Number((P * k).toFixed(2));
      return { type: 'num',
        prompt: `A polygon has a perimeter of ${m(`${P} cm`)}. A similar polygon is drawn with a scale factor of ${m(fmtNum(k))}. What is its perimeter (cm)?`,
        answer: ans,
        explain: `Every side is multiplied by ${fmtNum(k)}, so the perimeter is too: ${P} × ${fmtNum(k)} = <strong>${fmtNum(ans)} cm</strong>.` };
    }
    if (kind === 'trim') {    // MathLinks 4.4 #9
      const [sw, sl] = pick([[20, 30], [10, 16], [12, 20], [15, 25]]), k = pick([1.6, 1.5, 2, 2.5]);
      const L = r2(sl * k), W = r2(sw * k), ans = Number((2 * (L + W)).toFixed(2));
      return { type: 'num',
        prompt: `Two trays are similar rectangles. The small tray is ${m(`${sw} cm × ${sl} cm`)}. The large tray is ${m(`${fmtNum(L)} cm`)} long. How much trim (cm) is needed to go around the outside edge of the large tray?`,
        answer: ans,
        explain: `Scale factor = ${fmtNum(L)} ÷ ${sl} = ${fmtNum(k)}, so the large width is ${sw} × ${fmtNum(k)} = ${fmtNum(W)} cm.<br>
          Perimeter = 2(${fmtNum(L)} + ${fmtNum(W)}) = <strong>${fmtNum(ans)} cm</strong>.` };
    }
    if (kind === 'area') {
      const A = ri(4, 30), k = pick([2, 3, 4, 0.5, 1.5]);
      const ans = Number((A * k * k).toFixed(2));
      return { type: 'num',
        prompt: `A figure has an area of ${m(`${A} cm²`)}. A similar figure is drawn with a scale factor of ${m(fmtNum(k))}. What is the area (cm²) of the new figure?`,
        answer: ans,
        explain: `Area scales by the <em>square</em> of the scale factor: ${A} × ${fmtNum(k)}² = ${A} × ${fmtNum(k * k)} = <strong>${fmtNum(ans)} cm²</strong>.<br>💡 Lengths × k, areas × k².` };
    }
    const k = pick([2, 3, 4, 5]), A = ri(2, 15);
    return { type: 'num',
      prompt: `Two similar triangles have areas ${m(`${A} cm²`)} and ${m(`${A * k * k} cm²`)}. What is the scale factor from the smaller to the larger triangle?`,
      answer: k,
      explain: `Area ratio = ${A * k * k} ÷ ${A} = ${k * k} = k², so k = √${k * k} = <strong>${k}</strong>.<br>💡 The area ratio is the square of the side ratio.` };
  }),
  S('t150', 'Indirect measurement: shadows, ladders and cliffs', 'Scale factors and similarity', '🌳', () => {
    const r1 = x => Number(x.toFixed(1));
    const kind = pick(['shadow', 'ladder', 'covered', 'cliff', 'compare']);
    if (kind === 'shadow') {   // HW 7.4 #4, #6
      const [name, h] = pick([['Naomi', 1.2], ['Jason', 1.8], ['Priya', 1.5], ['Omar', 1.6]]);
      const s = pick([2, 2.5, 2.75, 3, 1.6]), S2 = pick([10.5, 12, 18, 24, 7.5]);
      const ans = r1(h * S2 / s);
      return { type: 'num',
        prompt: `${name} is ${m(`${h} m`)} tall and casts a shadow ${m(`${s} m`)} long. At the same time, a tree casts a shadow ${m(`${S2} m`)} long. How tall is the tree (m, to the nearest tenth)?`,
        answer: ans,
        explain: `The sun's rays make similar triangles: height/shadow is the same.<br>
          tree/${S2} = ${h}/${s} → tree = ${h} × ${S2} ÷ ${s} ≈ <strong>${fmtNum(ans)} m</strong>.` };
    }
    if (kind === 'ladder') {   // review #15
      const [L1, H1] = pick([[3, 2.4], [5, 4], [2.5, 2], [4, 3.2], [5, 4.8]]);
      const L2 = pick([6, 8, 10, 7.5]);
      const H2 = Number((H1 * L2 / L1).toFixed(2));
      const farther = pick([true, false]);
      const ans = farther ? Number((H2 - H1).toFixed(2)) : H2;
      return { type: 'num',
        prompt: `Two ladders lean against a wall at the same angle. The ${m(`${L1} m`)} ladder reaches ${m(`${H1} m`)} up the wall. ${farther
          ? `How much <strong>farther</strong> up the wall (m) does the ${m(`${L2} m`)} ladder reach?`
          : `How high up the wall (m) does the ${m(`${L2} m`)} ladder reach?`}`,
        answer: ans,
        explain: `Same angle → similar triangles: height ÷ ladder length is constant.<br>
          h = ${H1} × ${L2} ÷ ${L1} = ${fmtNum(H2)} m${farther ? `, which is ${fmtNum(H2)} − ${H1} = <strong>${fmtNum(ans)} m</strong> farther` : ` → <strong>${fmtNum(ans)} m</strong>`}.` };
    }
    if (kind === 'covered') {  // MathLinks 4.3 #9 (Kaylee)
      const c = pick([100, 120, 90, 110]), d = pick([60, 80, 90, 100]), S2 = pick([225, 240, 250, 300]);
      const ans = Math.round(c * S2 / (S2 - d));
      return { type: 'num',
        prompt: `A child ${m(`${c} cm`)} tall stands ${m(`${d} cm`)} in front of a parent, so the parent's shadow exactly covers the child's. The parent's shadow is ${m(`${S2} cm`)} long. How tall is the parent (nearest cm)?`,
        answer: ans,
        explain: `The child's shadow ends where the parent's ends, so it is ${S2} − ${d} = ${S2 - d} cm long.<br>
          parent/${S2} = ${c}/${S2 - d} → parent = ${c} × ${S2} ÷ ${S2 - d} ≈ <strong>${ans} cm</strong>.<br>💡 Use the <em>whole</em> shadow for the parent and only the child's part for the child.` };
    }
    if (kind === 'cliff') {   // review #12
      const e = pick([1.5, 1.6, 1.8]), s = pick([4, 6, 3]), H = pick([8, 12, 9, 15]);
      const ans = r1(H * s / e);
      return { type: 'num',
        prompt: `Ms. Jordan stands ${m(`${s} m`)} back from the edge of ${H === 8 ? 'an' : 'a'} ${m(`${H} m`)}-high cliff. Her eyes are ${m(`${e} m`)} above the ground. Looking past the cliff edge, her line of sight just reaches a fire on the ground below. How far is the fire from the bottom of the cliff (m, nearest tenth)?`,
        answer: ans,
        explain: `Her line of sight forms two similar right triangles: (eye height, distance to edge) and (cliff height, distance to fire).<br>
          x/${H} = ${s}/${e} → x = ${H} × ${s} ÷ ${e} ≈ <strong>${fmtNum(ans)} m</strong>.` };
    }
    const h1 = pick([168, 160, 175, 152]), s1 = pick([45, 50, 40, 60]);
    let s2; do { s2 = pick([40, 42, 48, 55, 36]); } while (s2 === s1);
    const ans = Math.round(h1 * s2 / s1);
    return { type: 'num',
      prompt: `Peter is ${m(`${h1} cm`)} tall and casts a ${m(`${s1} cm`)} shadow. Michael, standing beside him, casts a ${m(`${s2} cm`)} shadow. How tall is Michael (nearest cm)?`,
      answer: ans,
      explain: `Same time, same sun → height/shadow is equal.<br>
        Michael = ${h1} × ${s2} ÷ ${s1} ≈ <strong>${ans} cm</strong> — ${s2 > s1 ? 'longer shadow, so taller' : 'shorter shadow, so shorter'} than Peter.` };
  }),
  S('t151', 'Nested similar triangles', 'Scale factors and similarity', '📐', () => {
    // △ADE ∼ △ABC with DE ∥ BC (MathLinks 4.3 #7b, 4.4 #8)
    let a, b, d, BC;
    do { a = ri(2, 8); b = ri(2, 10); d = ri(3, 12); BC = d * (a + b) / a; } while (!Number.isInteger(BC * 2) || BC > 40);
    const find = pick(['BC', 'DE', 'DB']);
    const lab = { AD: String(a), DB: fmtNum(b), DE: fmtNum(d), BC: fmtNum(BC) };
    lab[find] = 'x';
    // picture: A at top, B bottom-left, C bottom-right; D on AB, E on AC
    const A = [150, 14], B = [30, 170], Cc = [270, 170], t = 0.42;
    const D = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t], E = [A[0] + (Cc[0] - A[0]) * t, A[1] + (Cc[1] - A[1]) * t];
    const mid = (P, Q) => [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];
    const ln = (P, Q, col = C.ink) => `<line x1="${P[0]}" y1="${P[1]}" x2="${Q[0]}" y2="${Q[1]}" stroke="${col}" stroke-width="2"/>`;
    const tx = (P, s, dx, dy, col = C.ink, bold = false) => `<text x="${P[0] + dx}" y="${P[1] + dy}" font-size="14" text-anchor="middle" fill="${col}"${bold ? ' font-weight="700"' : ''}>${s}</text>`;
    const val = (k, P, dx, dy) => tx(P, lab[k], dx, dy, lab[k] === 'x' ? C.red : C.primary, true);
    const inner = ln(A, B) + ln(A, Cc) + ln(B, Cc) + ln(D, E, C.accent)
      + tx(A, 'A', 0, -2) + tx(B, 'B', -10, 6) + tx(Cc, 'C', 10, 6) + tx(D, 'D', -12, 2) + tx(E, 'E', 12, 2)
      + val('AD', mid(A, D), -16, 0) + val('DB', mid(D, B), -18, 0) + val('DE', mid(D, E), 0, -6) + val('BC', mid(B, Cc), 0, 20);
    const pic = svg(300, 196, inner, 'aria-label="triangle ABC with segment DE parallel to BC"');
    const AB = a + b;
    const ans = find === 'BC' ? BC : find === 'DE' ? d : b;
    const explain = find === 'DB'
      ? `△ADE ∼ △ABC, so AB/AD = BC/DE → AB = ${a} × ${fmtNum(BC)} ÷ ${d} = ${fmtNum(AB)}, so x = DB = ${fmtNum(AB)} − ${a} = <strong>${fmtNum(b)}</strong>.<br>💡 x is only <em>part</em> of side AB — find the whole side, then subtract.`
      : `△ADE ∼ △ABC. The whole side AB = ${a} + ${fmtNum(b)} = ${fmtNum(AB)} (not just ${fmtNum(b)}!).<br>
        Scale factor small → large = AB/AD = ${fmtNum(AB)}/${a}.<br>
        ${find === 'BC' ? `x = BC = ${d} × ${fmtNum(AB)} ÷ ${a} = <strong>${fmtNum(BC)}</strong>.` : `x = DE = ${fmtNum(BC)} × ${a} ÷ ${fmtNum(AB)} = <strong>${fmtNum(d)}</strong>.`}`;
    return { type: 'num',
      prompt: `In the diagram (not to scale), ${m('DE ∥ BC')}. Find ${m('x')}.${pic}`,
      answer: ans, explain };
  }),

  /* ===== Chapter 5 + 7: Polynomial language and monomial operations ===== */
  S('t118', 'Terms, coefficients, and degree', 'Polynomials', '🧬', () => {
    const a = ri(2, 9), p = ri(2, 4), b = ri(1, 9);
    if (pick([true, false])) {
      return { type: 'num',
        prompt: `What is the <strong>coefficient</strong> of ${m(`x${sup(p)}`)} in ${m(`${a}x${sup(p)} ${MINUS} ${b}x + ${ri(1, 9)}`)} ?`,
        answer: a,
        explain: `The coefficient is the number multiplying the variable: <strong>${a}</strong>.` };
    }
    return { type: 'num',
      prompt: `What is the <strong>degree</strong> of the polynomial ${m(`${a}x${sup(p)} ${MINUS} ${b}x${sup(p - 1)} + ${ri(1, 9)}`)} ?`,
      answer: p,
      explain: `Degree = the highest exponent on the variable: <strong>${p}</strong>.` };
  }),
  S('t119', 'Multiply a polynomial by a monomial', 'Polynomials', '🧬', () => {
    const a = ri(2, 5), b = ri(2, 6), c = ri(2, 9);
    const correct = `${a * b}x² + ${a * c}`;
    return { type: 'mc', prompt: `${m(`${a}x(${b}x + ${c}) = ?`)}`,
      answer: correct,
      choices: mcChoices(correct, [`${a * b}x² + ${c}`, `${a * b}x + ${a * c}`, `${a * b}x² + ${a * c}x²`, `${a + b}x² + ${a * c}`]),
      explain: `💡 Distributive law: ${a}x × ${b}x = ${a * b}x² and ${a}x × ${c} = ${a * c} → <strong>${correct}</strong>.` };
  }),
  S('t120', 'Divide a polynomial by a monomial', 'Polynomials', '🧬', () => {
    const g = ri(2, 4), q1 = ri(2, 6), q2 = ri(2, 9);
    const A = g * q1, B = g * q2;
    const correct = `${q1}x ${MINUS} ${q2}`;
    return { type: 'mc', prompt: `${m(`(${A}x² ${MINUS} ${B}x) ÷ ${g}x = ?`)}`,
      answer: correct,
      choices: mcChoices(correct, [`${q1}x ${MINUS} ${q2}x`, `${A}x ${MINUS} ${B}`, `${q1}x² ${MINUS} ${q2}x`, `${q1} + ${q2}x`]),
      explain: `Divide each term by ${g}x: ${A}x² ÷ ${g}x = ${q1}x and ${B}x ÷ ${g}x = ${q2} → <strong>${correct}</strong>.<br>
        💡 Check the inverse: ${g}x(${q1}x ${MINUS} ${q2}) = ${A}x² ${MINUS} ${B}x ✓` };
  }),

  /* ===== Chapter 6: Linear relations (patterns + graphs) ===== */
  S('t121', 'From patterns to expressions', 'Linear relations', '📈', () => {
    const start = ri(3, 8), d = ri(2, 5), fig = ri(4, 9);
    const ans = start + d * (fig - 1);
    return { type: 'num',
      prompt: `Figure 1 of a pattern has ${m(String(start))} dots. Each new figure adds ${m(String(d))} dots. How many dots are in <strong>Figure ${fig}</strong>?`,
      answer: ans,
      explain: `The rule is n × ${d} + ${start - d} (dots = start + ${d} × (figure − 1)).<br>
        Figure ${fig}: ${start} + ${d} × ${fig - 1} = <strong>${ans}</strong>.` };
  }),
  S('t122', 'Interpreting graphs', 'Linear relations', '📈', () => {
    const rows = pick([
      ['a distance-time graph is horizontal (flat)', 'the object is stopped'],
      ['a distance-time graph rises steeply', 'the object is moving fast'],
      ['a distance-time graph rises gently', 'the object is moving slowly'],
      ['a distance-time graph falls', 'the object is moving back toward the start'],
      ['a bath filling graph is flat', 'no more water is entering the tub']
    ]);
    const [clue, correct] = rows;
    const all = ['the object is stopped', 'the object is moving fast', 'the object is moving slowly',
      'the object is moving back toward the start', 'no more water is entering the tub'];
    return { type: 'mc', prompt: `On a graph of distance vs time, ${m(clue)}. What does it mean?`,
      answer: correct, choices: mcChoices(correct, all.filter(x => x !== correct)),
      explain: `Flat = no change; steeper = faster; falling = returning. So it means <strong>${correct}</strong>.` };
  }),

  /* ===== Chapter 11: Data collection ===== */
  S('t123', 'Bias in data collection', 'Data collection', '📊', () => {
    const rows = pick([
      ['A sausage company samples only customers who already buy its sausages and asks if they like them', 'biased'],
      ['A school surveys every 10th student who walks in the door about cafeteria food', 'not biased'],
      ['A skateboarding company asks only skaters at a skate park whether skateboarding should be an Olympic sport', 'biased'],
      ['A city randomly calls 500 phone numbers from the whole city directory to ask about transit', 'not biased']
    ]);
    const [scenario, correct] = rows;
    return { type: 'mc', prompt: `${scenario}. Is this sample <strong>biased</strong> or not?`,
      answer: correct, choices: ['biased', 'not biased'],
      explain: correct === 'biased'
        ? 'Only people already favouring the product/opinion were asked — convenience sampling creates <strong>bias</strong>.'
        : 'Random/systematic selection from the whole group gives a representative sample — <strong>not biased</strong>.' };
  }),
  S('t124', 'Population vs sample', 'Data collection', '📊', () => {
    const rows = pick([
      ['asking every single student in a school about the lunch menu', 'census'],
      ['asking 200 randomly chosen students about the lunch menu', 'sample'],
      ['testing every light bulb off a production line (destroying each one)', 'impossible — you must sample'],
      ['asking only the students in one classroom about the lunch menu', 'biased sample']
    ]);
    const [scenario, correct] = rows;
    const all = ['census', 'sample', 'impossible — you must sample', 'biased sample'];
    return { type: 'mc', prompt: `A study involves ${m(scenario)}. This is a…`,
      answer: correct, choices: mcChoices(correct, all.filter(x => x !== correct)),
      explain: `Whole group = census; part of the group = sample; destroying the items forces sampling; one classroom is not representative = <strong>${correct}</strong>.` };
  }),
  S('t125', 'Probability as a percent', 'Data collection', '📊', () => {
    const p = pick([0.05, 0.15, 0.25, 0.35, 0.4, 0.6, 0.75, 0.8]);
    return { type: 'num', prompt: `The weather forecast says the probability of rain is ${m(fmtNum(p))}. What is this as a <strong>percent</strong>? (Enter the number only.)`,
      answer: p * 100,
      explain: `${fmtNum(p)} = ${fmtNum(p)} × 100 = <strong>${p * 100}%</strong>. 💡 Percent is just "per hundred"!` };
  }),

  /* ===== Chapter 10: Circle Geometry ===== */
S('t126', 'Parts of a circle', 'Circle geometry', '⭕', () => {
  const parts = [
    ['a line segment from the centre to the circle', 'radius'],
    ['a line segment with both endpoints on the circle', 'chord'],
    ['a chord that passes through the centre', 'diameter'],
    ['a line that touches the circle at exactly one point', 'tangent'],
    ['a portion of the circumference', 'arc']
  ];
  const [clue, correct] = pick(parts);
  return { type: 'mc', prompt: `What is ${m(clue)} called?`,
    answer: correct,
    choices: mcChoices(correct, ['radius', 'chord', 'diameter', 'tangent', 'arc'].filter(x => x !== correct)),
    explain: `That describes a <strong>${correct}</strong>.` };
}),
S('t127', 'Central and inscribed angles', 'Circle geometry', '⭕', () => {
  const inscribed = ri(20, 70);
  const askCentral = pick([true, false]);
  return { type: 'num',
    prompt: askCentral
      ? `An inscribed angle measures ${m(`${inscribed}°`)} and subtends arc AB. What is the <strong>central angle</strong> subtending the same arc?`
      : `A central angle measures ${m(`${2 * inscribed}°`)} and subtends arc AB. What is the <strong>inscribed angle</strong> subtending the same arc?`,
    answer: askCentral ? 2 * inscribed : inscribed,
    explain: askCentral
      ? `💡 The central angle is always <em>twice</em> the inscribed angle on the same arc: 2 × ${inscribed}° = <strong>${2 * inscribed}°</strong>.`
      : `💡 The inscribed angle is <em>half</em> the central angle (inverse!): ${2 * inscribed}° ÷ 2 = <strong>${inscribed}°</strong>.` };
}),
S('t128', 'Inscribed angles on the same arc', 'Circle geometry', '⭕', () => {
  const angle = ri(25, 80);
  const correct = `${angle}°`;
  return { type: 'mc',
    prompt: `Points D and E are both on the circle on the same side of chord AB. If ${m(`∠DAB = ${angle}°`)}, what is ${m('∠DEB')} ?`,
    answer: correct,
    choices: mcChoices(correct, [`${2 * angle}°`, `${180 - angle}°`, `${90}°`]),
    explain: `💡 Inscribed angles subtended by the <em>same arc</em> are equal: ∠DEB = <strong>${correct}</strong>.` };
}),
S('t129', 'Angle in a semicircle', 'Circle geometry', '⭕', () => {
  return { type: 'mc',
    prompt: `A triangle is inscribed in a circle with one side being a <strong>diameter</strong>. What is the angle opposite the diameter?`,
    answer: '90°',
    choices: mcChoices('90°', ['60°', '45°', '180°']),
    explain: `💡 An inscribed angle subtended by a diameter is always a right angle — <strong>90°</strong>. (This is Thales' theorem — a triangle in a semicircle is always right-angled!)` };
}),
S('t130', 'Perpendicular bisectors of chords', 'Circle geometry', '⭕', () => {
  return { type: 'mc',
    prompt: `The perpendicular bisector of any chord of a circle always passes through…`,
    answer: 'the centre of the circle',
    choices: mcChoices('the centre of the circle', ['the midpoint of the arc', 'a point of tangency', 'the circumference twice']),
    explain: `💡 Draw any chord, bisect it at 90°, and that line <em>must</em> pass through the centre. (That's how you find a circle's centre with only two chords!)` };
}),
S('t131', 'Tangents and radii', 'Circle geometry', '⭕', () => {
  return { type: 'num',
    prompt: `A tangent line touches a circle at point T, where a radius meets it. What is the <strong>angle</strong> between the tangent and the radius (in degrees)?`,
    answer: 90,
    explain: `💡 A tangent is always <em>perpendicular</em> to the radius at the point of tangency: <strong>90°</strong>.` };
}),
S('t132', 'Chords equidistant from the centre', 'Circle geometry', '⭕', () => {
  return { type: 'mc',
    prompt: `Two chords of a circle are the <strong>same distance from the centre</strong>. What do you know about them?`,
    answer: 'they are congruent (equal length)',
    choices: mcChoices('they are congruent (equal length)', ['they are parallel', 'one is twice the other', 'they are perpendicular']),
    explain: `💡 Distance from centre ↔ chord length are inversely related: same distance ⇒ same length — <strong>congruent chords</strong>.` };
}),

/* ===== Chapter 6: Linear relations — 6.1 Representing Patterns ===== */
S('t133', 'Write an equation for a figure pattern', 'Linear relations', '🧩', () => {
  const pat = pick(FIG_PATTERNS);
  const { obj, v, mv, b0 } = pat;
  const start = mv + b0;                     // figure 1 count
  const counts = [1, 2, 3].map(n => mv * n + b0).join(', ');
  const correct = linEq(v, mv, b0);
  const how = `Count: Figures 1, 2, 3 use ${counts} ${obj} — each figure adds ${mv}.<br>
      So ${v} = ${mv}n + k. Use Figure 1: ${start} = ${mv}(1) + k → k = ${b0}.`;
  if (pick([true, false])) {
    const N = ri(10, 60), ans = mv * N + b0;
    return { type: 'num',
      prompt: `Look at the pattern.${figureStrip(pat)}If the pattern continues, how many ${obj} are in Figure ${m(String(N))}?`,
      answer: ans,
      explain: `${how}<br>Figure ${N}: ${v} = ${mv}(${N}) + ${b0} = <strong>${ans}</strong>.<br>
      💡 An equation beats drawing ${N} figures!` };
  }
  const distractors = [...new Set([linEq(v, mv, start), linEq(v, start, mv), linEq(v, mv + 1, b0), linEq(v, start, 0)])]
    .filter(d => d !== correct).slice(0, 3);
  return { type: 'mc',
    prompt: `Look at the pattern.${figureStrip(pat)}Which equation relates the number of ${obj} ${m(v)} to the figure number ${m('n')}?`,
    answer: correct,
    choices: mcChoices(correct, distractors),
    explain: `${how}<br>Equation: <strong>${correct}</strong>.<br>
      💡 The intercept is NOT the first figure's count — it's the value at figure 0!` };
}),
S('t134', 'Patterns: find the figure number', 'Linear relations', '🔍', () => {
  const [obj, v] = pick([['toothpicks', 't'], ['tiles', 's'], ['circles', 'c'], ['squares', 's']]);
  const mv = ri(2, 7);
  const b0 = ri(Math.max(-2, 2 - mv), 8);
  if (pick([true, false])) {
    const n = ri(5, 25), total = mv * n + b0;
    return { type: 'num',
      prompt: `A pattern follows the rule ${m(linEq(v, mv, b0))}. Which figure has ${m(String(total))} ${obj}?`,
      answer: n,
      explain: `Solve ${total} = ${linEq(v, mv, b0).slice(4)}: ${b0 >= 0 ? `subtract ${b0}` : `add ${Math.abs(b0)}`} → ${total - b0} = ${mv}n → n = ${total - b0} ÷ ${mv} = <strong>${n}</strong>.` };
  }
  // "Is it possible?" variant — like 6.1 #4c (could a figure have 2037 toothpicks?)
  const works = pick([true, false]);
  let K;
  if (works) { K = mv * ri(4, 20) + b0; }
  else { const lo = mv * 3 + b0 + 1, hi = mv * 22 + b0; do { K = ri(lo, hi); } while ((K - b0) % mv === 0); }
  const nExact = (K - b0) / mv;
  const loFig = Math.floor(nExact), hiFig = loFig + 1;
  const no = 'No — no whole-number figure works';
  return { type: 'mc',
    prompt: `A pattern follows the rule ${m(linEq(v, mv, b0))}. Jenny claims one figure uses exactly ${m(String(K))} ${obj}. Is she right?`,
    answer: works ? `Yes — figure ${nExact}` : no,
    choices: works
      ? mcChoices(`Yes — figure ${nExact}`, [`Yes — figure ${nExact + 1}`, `Yes — figure ${Math.max(1, nExact - 1)}`, no])
      : mcChoices(no, [`Yes — figure ${loFig}`, `Yes — figure ${hiFig}`]),
    explain: works
      ? `Set ${linEq(v, mv, b0).slice(4)} equal to ${K}: n = (${K} ${b0 >= 0 ? MINUS : '+'} ${Math.abs(b0)}) ÷ ${mv} = ${nExact} — a whole number, so <strong>yes, figure ${nExact}</strong>.`
      : `n = (${K} ${b0 >= 0 ? MINUS : '+'} ${Math.abs(b0)}) ÷ ${mv} = ${fmtNum(Number(nExact.toFixed(2)))} — not a whole number, so <strong>no figure</strong> uses exactly ${K} ${obj}.<br>💡 A pattern only exists at whole-number figures!` };
}),

/* ===== Chapter 6: Linear relations — 6.2 Interpreting Graphs ===== */
S('t135', 'Interpolate or extrapolate?', 'Linear relations', '📉', () => {
  const ctx = pick([
    ['wages vs hours worked, with data from 0 h to 8 h', 3.5, 10, 'h of work'],
    ['fuel used vs distance driven, with data from 0 km to 210 km', 150, 225, 'km'],
    ['a spring\'s length vs weight, with data from 0 kg to 35 kg', 25, 50, 'kg'],
    ['profit vs seats sold, with data from 0 to 150 seats', 100, 175, 'seats'],
    ['continental drift vs time, with data from 0 to 28 years', 17, 40, 'years'],
    ['medicine dosage vs body weight, with data from 18 kg to 60 kg', 40, 100, 'kg'],
    ['water pumped from an aquarium vs time, with data from 0 to 120 min', 60, 150, 'min'],
    ['the cost of Greek salad vs mass, with data from 100 g to 500 g', 350, 800, 'g']
  ]);
  const [desc, inVal, outVal, unit] = ctx;
  const within = pick([true, false]);
  const val = within ? inVal : outVal;
  const correct = within ? 'interpolation' : 'extrapolation';
  return { type: 'mc',
    prompt: `A graph shows ${desc}. You use the graph to estimate the value at ${m(`${val} ${unit}`)}. This is an example of…`,
    answer: correct,
    choices: mcChoices(correct, [within ? 'extrapolation' : 'interpolation', 'a table of values', 'an equation']),
    explain: within
      ? `${val} ${unit} lies <em>between</em> the known data values → <strong>interpolation</strong>. 💡 Think "inter" = inside.`
      : `${val} ${unit} lies <em>beyond</em> the known range of data → <strong>extrapolation</strong>. 💡 Think "extra" = outside.` };
}),
S('t136', 'Is interpolation reasonable here?', 'Linear relations', '🤔', () => {
  const [scenario, correct, why] = pick([
    ['Estimating the cost of 5.4 pizzas from a graph of cost vs number of pizzas', 'not reasonable', 'You cannot buy 0.4 of a pizza — the number of pizzas must be a whole number.'],
    ['Estimating the fuel used to drive 225 km from a graph with data up to 210 km', 'reasonable', 'Distance and fuel are continuous — extending the line a little beyond the data makes sense.'],
    ['Estimating profit for 200 seats from a graph for a 150-seat theatre (data up to 150 seats)', 'not reasonable', 'The theatre only holds 150 people — values beyond that are impossible.'],
    ['Estimating the wage for 5.5 h of work from a graph with data from 1 h to 8 h', 'reasonable', '5.5 h lies between known values and time is continuous.'],
    ['Estimating the number of dots in "figure 7.3" of a dot pattern', 'not reasonable', 'Figure numbers are whole numbers — 7.3 makes no sense.'],
    ['Estimating a spring\'s length under 25 kg from data measured between 0 kg and 35 kg', 'reasonable', '25 kg is inside the measured range and weight is continuous.'],
    ['Estimating a medicine dose for a 40 kg patient from a graph with data from 18 kg to 60 kg', 'reasonable', '40 kg lies between the measured values — a safe interpolation.'],
    ['Extrapolating a spring\'s length far past the heaviest weight tested, where the spring is already fully compressed', 'not reasonable', 'Once fully compressed, the spring cannot get shorter — the linear pattern stops.'],
    ['Estimating how many goals a hockey team will score in 2.5 games from a graph of goals vs games played', 'not reasonable', 'Games are whole events — there is no such thing as half a game played.'],
    ['Estimating the height of a candle after 45 min of burning from a graph with data from 0 to 90 min', 'reasonable', '45 min lies between measured values and burning time is continuous.'],
    ['Estimating the cost of 800 g of Greek salad from a graph with data from 100 g to 500 g', 'reasonable', 'Mass is continuous, so extending the line beyond 500 g still makes sense.'],
    ['Extrapolating the crowd at a concert to 30,000 people from a graph of a 12,000-seat arena', 'not reasonable', 'The arena cannot hold more than its seat capacity — the pattern cannot continue.']
  ]);
  return { type: 'mc',
    prompt: `${scenario}. Is this <strong>reasonable</strong>?`,
    answer: correct, choices: ['reasonable', 'not reasonable'],
    explain: `${why}<br>💡 Interpolate/extrapolate only when in-between (or beyond) values actually make sense — "5.4 people" doesn't!` };
}),

/* ===== Chapter 6: Linear relations — HW 4.1 Writing Equations ===== */
S('t137', 'Write an equation from words', 'Linear relations', '✍️', () => {
  const mv = ri(2, 6);
  let b = ri(2, 9); while (b === mv) b = ri(2, 9);
  const kind = pick(['plus', 'minus', 'less', 'cost']);
  if (kind === 'cost') {
    const r = pick([4, 5, 8, 10, 12, 15]), f = pick([20, 50, 100, 150, 250]);
    const correct = `C = ${r}n + ${f}`;
    return { type: 'mc',
      prompt: `"The <strong>cost</strong> is ${m('$' + r)} per person plus a fixed fee of ${m('$' + f)}." Which equation gives the cost C for n people?`,
      answer: correct,
      choices: mcChoices(correct, [`C = ${f}n + ${r}`, `C = ${r + f}n`, `C = ${r}n ${MINUS} ${f}`]),
      explain: `"Per person" is the rate (multiplies n); the fixed fee is added once: <strong>${correct}</strong>.` };
  }
  const sentences = {
    plus: [`y is equal to ${mv} times x plus ${b}`, linEq('y', mv, b, 'x')],
    minus: [`y is equal to ${mv} times x minus ${b}`, linEq('y', mv, -b, 'x')],
    less: [`y is ${b} less than ${mv} times x`, linEq('y', mv, -b, 'x')]
  };
  const [sentence, correct] = sentences[kind];
  const distractors = kind === 'plus'
    ? [linEq('y', b, mv, 'x'), linEq('y', mv, -b, 'x'), linEq('y', mv + 1, b, 'x')]
    : [linEq('y', mv, b, 'x'), linEq('y', b, kind === 'less' ? -mv : mv, 'x'), `y = ${b} ${MINUS} ${mv}x`];
  return { type: 'mc',
    prompt: `Write an equation: <em>"${sentence}."</em>`,
    answer: correct,
    choices: mcChoices(correct, distractors),
    explain: kind === 'less'
      ? `"${b} less than ${mv} times x" means START at ${mv}x and take away ${b}: <strong>${correct}</strong>. 💡 "Less than" reverses the order — it's not ${b} − ${mv}x!`
      : `Multiply x by ${mv}, then ${kind === 'plus' ? 'add' : 'subtract'} ${b}: <strong>${correct}</strong>.` };
}),
S('t138', 'Evaluate with decimal and fraction slopes', 'Linear relations', '🧮', () => {
  const spec = pick([
    { txt: '1.5', val: 1.5, mult: 2 }, { txt: '0.75', val: 0.75, mult: 4 },
    { txt: '2/3', val: 2 / 3, mult: 3 }, { txt: '5/2', val: 2.5, mult: 2 },
    { txt: '1/4', val: 0.25, mult: 4 }, { txt: '4/3', val: 4 / 3, mult: 3 }
  ]);
  const b = ri(-8, 8);
  const x = spec.mult * ri(1, 6) * pick([1, 1, 1, -1]);
  const y = Number((spec.val * x + b).toFixed(2));
  const eqTxt = `y = ${spec.txt === '1.5' || spec.txt === '0.75' || spec.txt === '2.5' || spec.txt === '0.25' ? spec.txt : `(${spec.txt})`}x ${b >= 0 ? '+' : MINUS} ${Math.abs(b)}`;
  if (pick([true, false]) || y === 0) {
    return { type: 'num',
      prompt: `Given ${m(eqTxt)}, what is the value of ${m('y')} when ${m(`x = ${fmtNum(x)}`)}?`,
      answer: y,
      explain: `Substitute: ${spec.txt} × (${fmtNum(x)}) ${b >= 0 ? '+' : MINUS} ${Math.abs(b)} = ${fmtNum(Number((spec.val * x).toFixed(2)))} ${b >= 0 ? '+' : MINUS} ${Math.abs(b)} = <strong>${fmtNum(y)}</strong>.` };
  }
  return { type: 'num',
    prompt: `Given ${m(eqTxt)}, what is the value of ${m('x')} when ${m(`y = ${fmtNum(y)}`)}?`,
    answer: x,
    explain: `Solve for x: ${fmtNum(y)} ${b >= 0 ? MINUS : '+'} ${Math.abs(b)} = ${fmtNum(Number((y - b).toFixed(2)))}, then ÷ ${spec.txt} → x = <strong>${fmtNum(x)}</strong>.` };
}),

/* ===== Chapter 6: Linear relations — 6.3 Graphing Linear Equations ===== */
S('t139', 'Equation from a table of values', 'Linear relations', '📋', () => {
  const mv = pick([-3, -2, 2, 3]);
  let b0 = ri(-8, 9); while (b0 === 0 || Math.abs(b0) === Math.abs(mv)) b0 = ri(-8, 9);
  const xs = pick([[0, 1, 2, 3], [-2, -1, 0, 1], [1, 3, 5, 7], [2, 4, 6, 8]]);
  const ys = xs.map(x => mv * x + b0);
  const correct = linEq('y', mv, b0, 'x');
  return { type: 'mc',
    prompt: `Which equation describes this table of values?${valTable(xs, ys)}`,
    answer: correct,
    choices: mcChoices(correct, [linEq('y', b0, mv, 'x'), linEq('y', -mv, b0, 'x'), linEq('y', mv, -b0, 'x')]),
    explain: `① Rate of change: Δy ÷ Δx = ${fmtNum(ys[1] - ys[0])} ÷ ${xs[1] - xs[0]} = ${fmtNum(mv)} → the multiplier.<br>
      ② Extend the table back to x = 0: y = ${fmtNum(b0)} → the intercept.<br>
      💡 Equation: y = (rate)x + (value at x = 0) → <strong>${correct}</strong>.` };
}),
S('t140', 'Fixed cost plus rate', 'Linear relations', '🚕', () => {
  const sc = pick([
    { text: 'A taxi charges a $2.50 pickup fee plus $0.75 per kilometre', C: 'C', unit: 'd', unitName: 'kilometres', f: 2.5, r: 0.75, money: true },
    { text: 'A car rental costs a flat $35.00 plus $0.45 per kilometre', C: 'C', unit: 'd', unitName: 'kilometres', f: 35, r: 0.45, money: true },
    { text: 'A gym charges a $25.00 sign-up fee plus $9.50 per month', C: 'C', unit: 'm', unitName: 'months', f: 25, r: 9.5, money: true },
    { text: 'Printing jerseys has a one-time setup fee of $20.00 plus $14.95 per jersey', C: 'C', unit: 'j', unitName: 'jerseys', f: 20, r: 14.95, money: true }
  ]);
  const kind = pick(['equation', 'cost', 'budget']);
  const fS = sc.f.toFixed(2), rS = sc.r.toFixed(2);
  if (kind === 'equation') {
    const correct = `${sc.C} = ${rS}${sc.unit} + ${fS}`;
    return { type: 'mc',
      prompt: `${sc.text}. Which equation models the cost ${m(sc.C)}?`,
      answer: correct,
      choices: mcChoices(correct, [`${sc.C} = ${fS}${sc.unit} + ${rS}`, `${sc.C} = ${rS}${sc.unit} ${MINUS} ${fS}`, `${sc.C} = ${(sc.f + sc.r).toFixed(2)}${sc.unit}`]),
      explain: `Rate per ${sc.unitName.slice(0, -1)} multiplies the variable; the one-time fee is added: <strong>${correct}</strong>.` };
  }
  if (kind === 'cost') {
    const n = ri(5, 30);
    const ans = Number((sc.f + sc.r * n).toFixed(2));
    return { type: 'num',
      prompt: `${sc.text}. What is the total cost (in dollars) for ${m(String(n))} ${sc.unitName}?`,
      answer: ans,
      explain: `${sc.C} = ${rS} × ${n} + ${fS} = ${(sc.r * n).toFixed(2)} + ${fS} = <strong>$${ans.toFixed(2)}</strong>.` };
  }
  // budget: build numbers so the answer is whole
  const n = ri(6, 30);
  const B = Number((sc.f + sc.r * n).toFixed(2));
  return { type: 'num',
    prompt: `${sc.text}. With ${m('$' + B.toFixed(2))}, how many ${sc.unitName} can you afford?`,
    answer: n,
    explain: `Solve ${B.toFixed(2)} = ${rS}${sc.unit} + ${fS}: subtract the fee → ${(B - sc.f).toFixed(2)}, then ÷ ${rS} → <strong>${n} ${sc.unitName}</strong>.<br>💡 Budget problems run the equation <em>backwards</em>!` };
})
];
