/* ============================================================
   LearnAce — Grade 9 expansion aligned to the MathLinks 9
   textbook (Canadian Grade 9). Sections mirror the textbook
   chapters; ids continue the t-series (t104..t140).
   ============================================================ */

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
    return { type: 'mc', prompt: `${m(scenario)}. Is this sample <strong>biased</strong> or not?`,
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
  const [obj, v] = pick([['toothpicks', 't'], ['tiles', 's'], ['circles', 'c'], ['dots', 'd'], ['sticks', 'k']]);
  const mv = ri(2, 6);
  const b0 = ri(Math.max(-3, 3 - mv), 8);   // intercept, keeping figure 1 positive
  const start = mv + b0;                     // figure 1 count
  const correct = linEq(v, mv, b0);
  return { type: 'mc',
    prompt: `In a pattern, Figure 1 uses ${m(String(start))} ${obj}, and each new figure adds ${m(String(mv))} more. Which equation relates the number of ${obj} ${m(v)} to the figure number ${m('n')}?`,
    answer: correct,
    choices: mcChoices(correct, [linEq(v, mv, start), linEq(v, start, mv), linEq(v, mv + 1, b0)]),
    explain: `The amount <em>added each time</em> is the multiplier: ${v} = ${mv}n + k.<br>
      Use Figure 1 to find k: ${start} = ${mv}(1) + k → k = ${fmtNum(b0)}.<br>
      💡 Slope comes from the pattern's growth; the intercept is NOT just the first figure — it's the value at figure 0!` };
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
    prompt: `A graph shows ${m(desc)}. You use the graph to estimate the value at ${m(`${val} ${unit}`)}. This is an example of…`,
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
    prompt: `${m(scenario)}. Is this <strong>reasonable</strong>?`,
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
    prompt: `Write an equation: <em>"${m(sentence)}."</em>`,
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
    const correct = `${sc.C} = ${sc.r}${sc.unit} + ${fS}`;
    return { type: 'mc',
      prompt: `${m(sc.text)}. Which equation models the cost ${m(sc.C)}?`,
      answer: correct,
      choices: mcChoices(correct, [`${sc.C} = ${fS}${sc.unit} + ${sc.r}`, `${sc.C} = ${sc.r}${sc.unit} ${MINUS} ${fS}`, `${sc.C} = ${(sc.f + sc.r).toFixed(2)}${sc.unit}`]),
      explain: `Rate per ${sc.unitName.slice(0, -1)} multiplies the variable; the one-time fee is added: <strong>${correct}</strong>.` };
  }
  if (kind === 'cost') {
    const n = ri(5, 30);
    const ans = Number((sc.f + sc.r * n).toFixed(2));
    return { type: 'num',
      prompt: `${m(sc.text)}. What is the total cost (in dollars) for ${m(`${n} ${sc.unitName}`)}?`,
      answer: ans,
      explain: `${sc.C} = ${rS} × ${n} + ${fS} = ${(sc.r * n).toFixed(2)} + ${fS} = <strong>$${ans.toFixed(2)}</strong>.` };
  }
  // budget: build numbers so the answer is whole
  const n = ri(6, 30);
  const B = Number((sc.f + sc.r * n).toFixed(2));
  return { type: 'num',
    prompt: `${m(sc.text)}. With ${m('$' + B.toFixed(2))}, how many ${m(sc.unitName)} can you afford?`,
    answer: n,
    explain: `Solve ${B.toFixed(2)} = ${rS}${sc.unit} + ${fS}: subtract the fee → ${(B - sc.f).toFixed(2)}, then ÷ ${rS} → <strong>${n} ${sc.unitName}</strong>.<br>💡 Budget problems run the equation <em>backwards</em>!` };
})
];
