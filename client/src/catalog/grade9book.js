/* ============================================================
   LearnAce — Grade 9 expansion aligned to the MathLinks 9
   textbook (Canadian Grade 9). Sections mirror the textbook
   chapters; ids continue the t-series (t104..t125).
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
})
];
