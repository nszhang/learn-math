/* ============================================================
   Generated replacements for older stand-alone skills (extra2.js,
   grade9book.js, school.js) that only had a few fixed questions.
   skills.js swaps these generators in by skill id.
   ============================================================ */
import { ri, pick, shuffle, sample, range, uniq, m, b, fmt, fix, num, mc, yesNo, svg, C, gcd } from './ixlMath/h.js';
import { findGen } from './ixlMath/engine.js';
import { VARIETY_RULES } from './ixlMath/rules/variety.js';
import { VARIETY3_RULES } from './ixlMath/rules/variety3.js';

const MINUS = '−';
const S = n => (n < 0 ? MINUS + Math.abs(n) : String(n));
const r1 = x => fix(x, 1), r2 = x => fix(x, 2);
const byTitle = (rules, title, grade) => findGen(rules, { title, grade, section: '', id: '' });
const frac = (n, d) => { const g = gcd(n, d); return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`; };
const LET = 'ABCDEFGHJKLMNPQRSTUVWXYZ'.split('');

/* number line with tick marks every 1/d and a dot at n/d */
function fracLine(n, d, maxWhole) {
  const W = 300, x0 = 20, x1 = W - 20, X = v => x0 + ((x1 - x0) * v) / maxWhole;
  let s = `<line x1="${x0}" y1="30" x2="${x1}" y2="30" stroke="${C.ink}" stroke-width="2"/>`;
  for (let i = 0; i <= maxWhole * d; i++) { const v = i / d, whole = i % d === 0; s += `<line x1="${X(v)}" y1="${whole ? 20 : 24}" x2="${X(v)}" y2="${whole ? 40 : 36}" stroke="${C.ink}" stroke-width="${whole ? 2 : 1.5}"/>`; if (whole) s += `<text x="${X(v)}" y="56" font-size="13" text-anchor="middle">${v}</text>`; }
  s += `<circle cx="${X(n / d)}" cy="30" r="6" fill="${C.red}"/>`;
  return svg(W, 64, s, 'aria-label="number line"');
}

const RAW = {
  t11: byTitle(VARIETY_RULES, 'Count sides of shapes', 1),
  t20: byTitle(VARIETY_RULES, 'Count corners (vertices)', 2),
  t73: byTitle(VARIETY3_RULES, 'Scatter plot trends', 8),
  t96: byTitle(VARIETY3_RULES, 'Expand logarithms', 12),
  t101: byTitle(VARIETY3_RULES, 'Permutations', 12),
  t102: byTitle(VARIETY3_RULES, 'The imaginary unit i', 12),

  t19: () => {
    const [thing, unit] = pick([['a pencil', 'cm'], ['a classroom', 'm'], ['your finger', 'cm'], ['a road trip', 'km'], ['a soccer field', 'm'], ['an ant', 'mm'], ['a book', 'cm'], ['the distance to another city', 'km'], ['a swimming pool', 'm'], ['a ladybug', 'mm'], ['a door', 'm'], ['a crayon', 'cm'], ['a river', 'km'], ['a grain of rice', 'mm'], ['a school hallway', 'm'], ['a shoe', 'cm']]);
    return mc(`Which unit makes the most sense for the length of ${m(thing)}?`, unit, ['mm', 'cm', 'm', 'km'].filter(x => x !== unit), `${thing[0].toUpperCase() + thing.slice(1)} is best measured in ${b(unit)}.`, 4);
  },
  t26: () => {
    const d = pick([2, 3, 4, 5, 6, 8]), max = pick([1, 1, 2]), n = ri(1, max * d - 1); if (n % d === 0) return null;
    const ans = `${n}/${d}`;
    return mc(`${fracLine(n, d, max)}Each whole is split into ${d} equal parts. What fraction is at the red dot?`, ans, uniq([`${n + 1}/${d}`, `${Math.max(1, n - 1)}/${d}`, `${d}/${n}`, `${n}/${d + 1}`]).filter(x => x !== ans), `Count ${n} jumps of 1/${d} from 0: ${b(ans)}.`, 4);
  },
  t37: () => {
    if (Math.random() < 0.5) {
      const kind = pick(['parallel', 'perpendicular', 'intersecting']), a = ri(-25, 25), rad = a * Math.PI / 180, L = 80, cx = 110, cy = 60;
      const seg = (ang, dx, dy, col) => { const r = ang * Math.PI / 180; return `<line x1="${cx + dx - L * Math.cos(r)}" y1="${cy + dy - L * Math.sin(r)}" x2="${cx + dx + L * Math.cos(r)}" y2="${cy + dy + L * Math.sin(r)}" stroke="${col}" stroke-width="3"/>`; };
      const s2 = kind === 'parallel' ? seg(a, 0, ri(-35, -25), C.ink) + seg(a, 0, ri(25, 35), C.primary) : kind === 'perpendicular' ? seg(a, 0, 0, C.ink) + seg(a + 90, 0, 0, C.primary) : seg(a, 0, 0, C.ink) + seg(a + pick([35, 50, 125, 140]), 0, 0, C.primary);
      return mc(`${svg(220, 120, s2)}How are these two lines related?`, kind, ['parallel', 'perpendicular', 'intersecting'].filter(x => x !== kind), kind === 'parallel' ? 'They never meet.' : kind === 'perpendicular' ? 'They cross at a right angle.' : 'They cross, but not at a right angle.', 3);
    }
    const [clue, kind] = pick([['railroad tracks', 'parallel'], ['the corner where a wall meets the floor', 'perpendicular'], ['the hands of a clock at 3:00', 'perpendicular'], ['the hands of a clock at 2:00', 'intersecting'], ['the lines on notebook paper', 'parallel'], ['the two parts of the letter X', 'intersecting'], ['the two strokes of a plus sign +', 'perpendicular'], ['the opposite edges of a ruler', 'parallel'], ['two roads crossing at a slant', 'intersecting'], ['the rungs of a ladder', 'parallel'], ['the edges at the corner of a page', 'perpendicular']]);
    return mc(`Think about ${b(clue)}. Are the lines parallel, perpendicular, or intersecting (but not perpendicular)?`, kind, ['parallel', 'perpendicular', 'intersecting'].filter(x => x !== kind), `${clue[0].toUpperCase() + clue.slice(1)}: ${b(kind)}.`, 3);
  },
  t38: () => {
    const [name, n] = pick([['square', 4], ['rectangle (not a square)', 2], ['equilateral triangle', 3], ['regular pentagon', 5], ['regular hexagon', 6], ['regular octagon', 8], ['isosceles triangle (not equilateral)', 1], ['scalene triangle', 0], ['rhombus (not a square)', 2], ['parallelogram (not a rectangle)', 0], ['isosceles trapezoid', 1], ['kite', 1], ['regular decagon', 10], ['the letter A', 1], ['the letter H', 2], ['the letter F', 0]]);
    return num(`How many ${b('lines of symmetry')} does ${/^the /.test(name) ? '' : 'a '}${m(name)} have?`, n, `It can be folded onto itself in ${b(n)} way${n === 1 ? '' : 's'}.`);
  },
  t47: () => {
    for (let t = 0; t < 50; t++) {
      const kind = pick(['acute', 'right', 'obtuse']);
      const a = kind === 'right' ? 90 : kind === 'obtuse' ? ri(95, 160) : ri(40, 85), rest = 180 - a, bb = ri(Math.max(5, kind === 'acute' ? rest - 85 : 5), Math.min(kind === 'acute' ? 85 : rest - 5, rest - 5)), c = rest - bb;
      if (bb <= 0 || c <= 0 || (kind === 'acute' && (bb >= 90 || c >= 90))) continue;
      const angles = shuffle([a, bb, c]);
      return mc(`A triangle's angles are ${m(angles.map(x => x + '°').join(', '))}. Classify it by its angles.`, kind, ['acute', 'right', 'obtuse'].filter(x => x !== kind), `${kind === 'acute' ? 'All angles are less than 90°' : kind === 'right' ? 'One angle is exactly 90°' : `One angle (${a}°) is greater than 90°`}: ${b(kind)}.`, 3);
    }
    return null;
  },
  t74: () => {
    const x = ri(35, 145), kind = pick(['corresponding', 'alternate interior', 'alternate exterior', 'co-interior (same-side interior)', 'vertical']);
    const same = kind !== 'co-interior (same-side interior)';
    return num(`Two parallel lines are cut by a transversal. One angle measures ${b(x + '°')}. What is the measure of its ${b(kind)} angle? (degrees)`, same ? x : 180 - x, same ? `${kind[0].toUpperCase() + kind.slice(1)} angles are equal: ${b(x)}°.` : `Co-interior angles add to 180°: 180 − ${x} = ${b(180 - x)}°.`);
  },
  t91: () => {
    const a = ri(3, 20), c = ri(3, 20), k = ri(0, 2);
    if (k === 0) return num(`A right triangle has legs ${m(String(a))} and ${m(String(c))}. Find the hypotenuse. (round to 1 decimal)`, r1(Math.hypot(a, c)), `√(${a}² + ${c}²) = √${a * a + c * c} ≈ ${b(r1(Math.hypot(a, c)))}.`);
    const h = Math.max(a, c) + ri(1, 8), leg = Math.min(a, c);
    if (k === 1) return num(`A right triangle has hypotenuse ${m(String(h))} and one leg ${m(String(leg))}. Find the other leg. (round to 1 decimal)`, r1(Math.sqrt(h * h - leg * leg)), `√(${h}² − ${leg}²) = √${h * h - leg * leg} ≈ ${b(r1(Math.sqrt(h * h - leg * leg)))}.`);
    const A = ri(20, 70); return num(`A right triangle has hypotenuse ${m(String(h))} and an angle of ${m(A + '°')}. Find the side opposite that angle. (round to 1 decimal)`, r1(h * Math.sin(A * Math.PI / 180)), `opposite = ${h} × sin ${A}° ≈ ${b(r1(h * Math.sin(A * Math.PI / 180)))}.`);
  },
  t94: () => {
    const a1 = ri(-10, 20), d = ri(-5, 9) || 2, n = ri(5, 30), an = a1 + (n - 1) * d, sum = (n * (a1 + an)) / 2;
    if (Math.random() < 0.4) { const N = ri(5, 100); return num(`${m(`1 + 2 + 3 + … + ${N} = ?`)}`, (N * (N + 1)) / 2, `n(n + 1)/2 = ${N} × ${N + 1} ÷ 2 = ${b(fmt((N * (N + 1)) / 2))}.`); }
    return num(`Find the sum of the first ${b(n)} terms of the arithmetic series ${m(`${S(a1)} + ${S(a1 + d)} + ${S(a1 + 2 * d)} + …`)}`, sum, `aₙ = ${S(a1)} + ${n - 1}(${S(d)}) = ${S(an)}; Sₙ = n(a₁ + aₙ)/2 = ${n}(${S(a1)} + ${S(an)})/2 = ${b(fmt(sum))}.`);
  },
  t97: () => {
    const P = ri(5, 50) * 100, r = ri(2, 9), t = ri(2, 10), simple = P * (1 + (r * t) / 100), comp = P * (1 + r / 100) ** t, k = ri(0, 2);
    if (k === 0) return num(`$${fmt(P)} earns ${r}% ${b('simple')} interest per year for ${t} years. What is the final amount? ($)`, r2(simple), `A = P(1 + rt) = ${fmt(P)}(1 + ${r / 100} × ${t}) = ${b('$' + fmt(r2(simple)))}.`);
    if (k === 1) return num(`$${fmt(P)} earns ${r}% interest ${b('compounded annually')} for ${t} years. What is the final amount? (round to the nearest cent)`, r2(comp), `A = P(1 + r)ᵗ = ${fmt(P)}(1.${String(r).padStart(2, '0')})<sup>${t}</sup> ≈ ${b('$' + fmt(r2(comp)))}.`);
    return num(`$${fmt(P)} is invested at ${r}% per year for ${t} years. How much more does ${b('compound')} interest (annually) earn than ${b('simple')} interest? (round to the nearest cent)`, r2(comp - simple), `${r2(comp)} − ${r2(simple)} = ${b('$' + r2(comp - simple))}.`);
  },
  t98: () => {
    const a = ri(1, 9), r = pick([2, 3, -2, 0.5]), n = ri(4, 8), S_ = r === 1 ? a * n : (a * (1 - r ** n)) / (1 - r);
    const terms = range(0, 2).map(i => fix(a * r ** i, 4));
    if (r === 0.5 && Math.random() < 0.5) return num(`Find the sum of the infinite geometric series ${m(`${a} + ${fix(a / 2, 3)} + ${fix(a / 4, 4)} + …`)}`, 2 * a, `S = a/(1 − r) = ${a}/(1 − 0.5) = ${b(2 * a)}.`);
    return num(`Find the sum of the first ${b(n)} terms of the geometric series ${m(`${terms.map(S).join(' + ')} + …`)}${r === 0.5 ? ' (round to 3 decimals)' : ''}`, fix(S_, 3), `Sₙ = a(1 − rⁿ)/(1 − r) = ${a}(1 − (${S(r)})<sup>${n}</sup>)/(1 − ${S(r)}) = ${b(fmt(fix(S_, 3)))}.`);
  },
  t99: () => {
    const kind = ri(0, 3), a = ri(1, 9), c = ri(1, 9), d = ri(-9, 9);
    if (kind === 0) { const ans = frac(a, c); return mc(`What does ${m(`(${a}x + ${Math.abs(d)}) / (${c}x ${d < 0 ? '+' : MINUS} 1)`)} approach as x grows very large?`, ans, uniq(['0', '∞', `${c}/${a}`, String(a), `${Math.abs(d)}`]).filter(x => x !== ans), `For large x only the leading terms matter: ${a}x/${c}x → ${b(ans)}.`, 4); }
    if (kind === 1) return mc(`What does ${m(`${a}/x${c > 4 ? '²' : ''}`)} approach as x grows very large?`, '0', ['∞', String(a), '1'], `The denominator grows without bound, so the fraction → ${b('0')}.`, 4);
    if (kind === 2) { const x0 = ri(-4, 4); return num(`Find ${m(`lim<sub>x→${S(x0)}</sub> (x² − ${x0 * x0}) / (x ${x0 < 0 ? '+' : MINUS} ${Math.abs(x0)})`)}.`.replace('(x − 0)', 'x').replace('(x² − 0)', 'x²'), 2 * x0, `Factor: (x − ${S(x0)})(x + ${S(x0)}) / (x − ${S(x0)}) = x + ${S(x0)} → ${b(S(2 * x0))}.`); }
    const x0 = ri(-3, 5); return num(`Find ${m(`lim<sub>x→${S(x0)}</sub> (${a}x ${d < 0 ? MINUS : '+'} ${Math.abs(d)})`)}.`, a * x0 + d, `A polynomial is continuous, so substitute: ${a}(${S(x0)}) ${d < 0 ? MINUS : '+'} ${Math.abs(d)} = ${b(S(a * x0 + d))}.`);
  },
  t105: () => {
    const [shape, order] = pick([['square', 4], ['regular pentagon', 5], ['regular hexagon', 6], ['equilateral triangle', 3], ['regular octagon', 8], ['rectangle (not a square)', 2], ['rhombus (not a square)', 2], ['parallelogram', 2], ['regular decagon', 10], ['the letter S', 2], ['the letter Z', 2], ['a 4-bladed fan', 4], ['a 5-pointed star', 5], ['a 3-bladed propeller', 3]]);
    if (Math.random() < 0.5) return num(`What is the ${b('order of rotation')} of ${/^(a|the) /.test(shape) ? '' : 'a '}${m(shape)} (how many times it matches itself in one full turn)?`, order, `It matches itself ${b(order)} times in 360°.`);
    return num(`What is the smallest ${b('angle of rotation')} (in degrees) that maps ${/^(a|the) /.test(shape) ? '' : 'a '}${m(shape)} onto itself?`, 360 / order, `360° ÷ ${order} = ${b(fix(360 / order, 2))}°.`);
  },
  t123: () => {
    const [scenario, biased, why] = pick([
      ['A sausage company asks only customers who already buy its sausages whether they like them.', true, 'Only people who already favour the product were asked.'],
      ['A school surveys every 10th student who walks in the door about cafeteria food.', false, 'Systematic selection from the whole school is fair.'],
      ['A skateboarding company asks skaters at a skate park whether skateboarding should be an Olympic sport.', true, 'Skaters are likely to favour skateboarding.'],
      ['A city randomly calls 500 phone numbers from the whole city to ask about transit.', false, 'A random sample from the whole city is representative.'],
      ['A radio host asks listeners to phone in with their opinion about a new law.', true, 'Only people who listen and choose to call are included (self-selected).'],
      ['A principal draws 50 student names at random from all grades to ask about the timetable.', false, 'Every student had an equal chance of being picked.'],
      ['A survey asks, "Don\'t you agree that our wonderful park needs more money?"', true, 'The question is worded to lead people to agree.'],
      ['A gym asks its members how often people in the city exercise.', true, 'Gym members exercise more than the average person.'],
      ['A grocery store surveys every 20th shopper leaving the store on different days of the week.', false, 'Systematic sampling on different days reaches many kinds of shoppers.'],
      ['A team asks only its own fans which team is the best in the league.', true, 'Fans favour their own team.'],
      ['A town mails a survey to a random sample of households from the full address list.', false, 'Random selection from the whole population.'],
      ['A website posts a poll that anyone can answer as many times as they like.', true, 'Some people can vote many times, and only site visitors respond.']
    ]);
    return mc(`${scenario}<br>Is this sample or survey ${b('biased')}?`, biased ? 'biased' : 'not biased', [biased ? 'not biased' : 'biased'], why, 2);
  },
  t124: () => {
    const kind = ri(0, 1);
    if (kind === 0) {
      const [scenario, ans] = pick([['every student in a school is asked about the lunch menu', 'census'], ['200 randomly chosen students are asked about the lunch menu', 'sample'], ['every person in Canada is counted every five years', 'census'], ['a factory tests 50 light bulbs out of 10 000', 'sample'], ['all 28 students in a class are asked their favourite sport', 'census'], ['a pollster phones 1 000 voters across the province', 'sample'], ['a doctor tests a drop of a patient\'s blood', 'sample'], ['a teacher records the test score of every student in her class', 'census']]);
      return mc(`Is this a ${b('census')} or a ${b('sample')}?<br>${scenario[0].toUpperCase() + scenario.slice(1)}.`, ans, [ans === 'census' ? 'sample' : 'census'], ans === 'census' ? 'Every member of the population is included.' : 'Only part of the population is included.', 2);
    }
    const [study, pop] = pick([['A town wants to know how residents feel about a new library.', 'all residents of the town'], ['A company tests the battery life of the phones it made this year.', 'all phones the company made this year'], ['A school board studies how long Grade 9 students in the district sleep.', 'all Grade 9 students in the district'], ['A biologist measures the length of trout in a lake.', 'all trout in the lake'], ['A store wants to know how satisfied its customers are.', 'all of the store\'s customers']]);
    return mc(`${study}<br>What is the ${b('population')}?`, pop, ['only the people who answer the survey', 'everyone in the world', 'a random sample of 10 people'], `The population is the whole group being studied: ${b(pop)}.`, 4);
  },
  t129: () => {
    const [p, q, h] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25], [9, 12, 15]]), k = ri(1, 3), kind = ri(0, 1), [A, B, Cc] = sample(LET, 3);
    if (kind === 0) { const a = ri(15, 75); return num(`△${A}${B}${Cc} is inscribed in a circle with diameter ${A}${B}. If ∠${A} = ${a}°, what is ∠${B}? (degrees)`, 90 - a, `The angle at ${Cc} is 90° (angle in a semicircle), so ∠${B} = 90 − ${a} = ${b(90 - a)}°.`); }
    return num(`△${A}${B}${Cc} is inscribed in a circle with diameter ${A}${B} = ${h * k} cm. If ${A}${Cc} = ${p * k} cm, how long is ${B}${Cc}? (cm)`, q * k, `∠${Cc} = 90°, so ${B}${Cc} = √(${h * k}² − ${p * k}²) = ${b(q * k)} cm.`);
  },
  t130: () => {
    const [p, q, h] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [7, 24, 25]]), k = ri(1, 2), kind = ri(0, 2);
    if (kind === 0) return num(`A circle has radius ${h * k} cm. A chord is ${p * k} cm from the centre. How long is the chord? (cm)`, 2 * q * k, `The perpendicular from the centre bisects the chord: half-chord = √(${h * k}² − ${p * k}²) = ${q * k}, so the chord is ${b(2 * q * k)} cm.`);
    if (kind === 1) return num(`A chord of length ${2 * q * k} cm is in a circle of radius ${h * k} cm. How far is the chord from the centre? (cm)`, p * k, `Half-chord = ${q * k}; distance = √(${h * k}² − ${q * k}²) = ${b(p * k)} cm.`);
    return num(`A chord of length ${2 * q * k} cm is ${p * k} cm from the centre of a circle. What is the radius? (cm)`, h * k, `Radius = √(${q * k}² + ${p * k}²) = ${b(h * k)} cm.`);
  },
  t131: () => {
    const [p, q, h] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [7, 24, 25], [20, 21, 29]]), k = ri(1, 2), kind = ri(0, 2);
    if (kind === 0) return num(`A tangent from point P touches a circle of radius ${p * k} cm at T. P is ${h * k} cm from the centre. How long is the tangent segment PT? (cm)`, q * k, `The radius is perpendicular to the tangent: PT = √(${h * k}² − ${p * k}²) = ${b(q * k)} cm.`);
    if (kind === 1) return num(`Tangent segment PT = ${q * k} cm and the radius is ${p * k} cm. How far is P from the centre O? (cm)`, h * k, `△OTP is right-angled at T: OP = √(${q * k}² + ${p * k}²) = ${b(h * k)} cm.`);
    const a = ri(20, 70); return num(`A tangent at T and a line from T to the centre O form △OTP with ∠TOP = ${a}°. What is ∠OPT? (degrees)`, 90 - a, `∠OTP = 90° (tangent ⟂ radius), so ∠OPT = 90 − ${a} = ${b(90 - a)}°.`);
  },
  t132: () => {
    const [p, q, h] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15]]), k = ri(1, 2);
    if (Math.random() < 0.5) return num(`Two chords in a circle of radius ${h * k} cm are each ${p * k} cm from the centre. One chord is ${2 * q * k} cm long. How long is the other chord? (cm)`, 2 * q * k, `Chords the same distance from the centre are congruent: ${b(2 * q * k)} cm.`);
    const c1 = ri(4, 20); return num(`Two chords of a circle are congruent; each is ${c1} cm long. One chord is ${p * k} cm from the centre. How far is the other chord from the centre? (cm)`, p * k, `Congruent chords are equidistant from the centre: ${b(p * k)} cm.`);
  },
  schP3: () => {
    const kind = ri(0, 3);
    if (kind === 0) { const sides = pick([6, 8, 10, 12]), [desc, test] = pick([['an even number', x => x % 2 === 0], ['a number greater than 4', x => x > 4], ['a multiple of 3', x => x % 3 === 0], ['a prime number', x => [2, 3, 5, 7, 11].includes(x)], ['a number less than 3', x => x < 3], ['an odd number', x => x % 2 === 1]]), k = range(1, sides).filter(test).length; return mc(`You roll a fair ${sides}-sided die numbered 1 to ${sides}. What is P(${desc})?`, frac(k, sides), uniq([frac(k + 1, sides), frac(Math.max(1, k - 1), sides), frac(sides - k || 1, sides), `1/${sides}`]).filter(x => x !== frac(k, sides)), `${k} of the ${sides} outcomes: ${b(frac(k, sides))}.`, 4); }
    if (kind === 1) { const n = ri(2, 4), h = ri(0, n), real = { '2,1': 2, '3,1': 3, '3,2': 3, '4,1': 4, '4,2': 6, '4,3': 4 }[`${n},${h}`] || 1; return mc(`You flip ${n} fair coins. What is P(exactly ${h} heads)?`, frac(real, 2 ** n), uniq([frac(1, 2 ** n), frac(1, n), frac(h || 1, n + 1), frac(real + 1, 2 ** n)]).filter(x => x !== frac(real, 2 ** n)), `${real} of the ${2 ** n} equally likely outcomes: ${b(frac(real, 2 ** n))}.`, 4); }
    if (kind === 2) { const s = ri(2, 12), k = 6 - Math.abs(7 - s); return mc(`You roll two fair dice. What is P(sum = ${s})?`, frac(k, 36), uniq([frac(k + 1, 36), frac(Math.max(1, k - 1), 36), `1/${s}`, '1/6']).filter(x => x !== frac(k, 36)), `${k} of the 36 outcomes give ${s}: ${b(frac(k, 36))}.`, 4); }
    const v = ri(1, 6); return mc(`You roll a die and flip a coin. What is P(${v} and heads)?`, '1/12', ['1/6', '1/2', '1/8'], `1/6 × 1/2 = ${b('1/12')}.`, 4);
  }
};

// a generator may return null to ask for a fresh draw
const retry = gen => () => { for (let i = 0; i < 40; i++) { const q = gen(); if (q) return q; } throw new Error('generator failed'); };
export const EXTRA_VARIETY = Object.fromEntries(Object.entries(RAW).map(([id, g]) => [id, retry(g)]));
