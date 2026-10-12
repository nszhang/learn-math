/* ============================================================
   MathAce — expansion batch 2 (ids t1..t103): more sections and
   skills per grade, modeled on IXL topic areas.
   Emphasis: intuition for operations, inverses, and the three laws.
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
const MINUS = '−';
const fmtNum = n => String(n).replace('-', MINUS);
function mcChoices(correct, distractors) {
  const set = [correct];
  for (const d of distractors) if (!set.includes(d)) set.push(d);
  return shuffle(set);
}
const S = (id, title, grade, section, icon, gen) => ({ id, title, grade, section, icon, gen });

export const EXTRA2_SKILLS = [
  /* ================= GRADE 1 ================= */
  S('t1', 'Count to 100', 1, 'Counting and patterns', '🔢', () => {
    const n = pick([19, 29, 39, 49, 59, 69, 79, 89]);
    return { type: 'num', prompt: `What number comes <strong>just after</strong> ${m(String(n))}?`,
      answer: n + 1,
      explain: `After ${n} comes <strong>${n + 1}</strong> — the ones roll over to a new ten!` };
  }),
  S('t2', 'Ten more, ten less', 1, 'Counting and patterns', '🔢', () => {
    const n = ri(11, 89), more = pick([true, false]);
    return { type: 'num', prompt: `What is ${m(`10 ${more ? 'more' : 'less'} than ${n}`)} ?`,
      answer: more ? n + 10 : n - 10,
      explain: `Only the tens digit changes: ${n} ${more ? '+' : MINUS} 10 = <strong>${more ? n + 10 : n - 10}</strong>.` };
  }),
  S('t3', 'Adding zero', 1, 'Addition', '➕', () => {
    const n = ri(1, 15);
    return { type: 'num', prompt: `${m(`${n} + 0 = ?`)}`,
      answer: n,
      explain: `💡 Adding 0 changes nothing — 0 is the <em>identity</em> for addition! ${n} + 0 = <strong>${n}</strong>.` };
  }),
  S('t4', 'Doubles facts', 1, 'Addition', '➕', () => {
    const n = ri(1, 10);
    return { type: 'num', prompt: `${m(`${n} + ${n} = ?`)}`,
      answer: 2 * n,
      explain: `Doubles are easy to picture: ${n} + ${n} = <strong>${2 * n}</strong>. Knowing doubles helps with every other fact!` };
  }),
  S('t5', 'Addition word problems', 1, 'Addition', '➕', () => {
    const a = ri(2, 9), b = ri(1, 9);
    return { type: 'num',
      prompt: `${m(String(a))} birds sit on a branch. ${m(String(b))} more birds land. How many birds now?`,
      answer: a + b,
      explain: `"More land" means add: ${a} + ${b} = <strong>${a + b}</strong> birds.` };
  }),
  S('t6', 'Subtracting zero and subtracting all', 1, 'Subtraction', '➖', () => {
    const n = ri(1, 15), all = pick([true, false]);
    return { type: 'num', prompt: `${m(`${n} − ${all ? n : 0} = ?`)}`,
      answer: all ? 0 : n,
      explain: all ? `Taking away EVERYTHING leaves 0: ${n} − ${n} = <strong>0</strong>.`
                   : `💡 Taking away 0 changes nothing: ${n} − 0 = <strong>${n}</strong>.` };
  }),
  S('t7', 'Subtraction word problems', 1, 'Subtraction', '➖', () => {
    const a = ri(5, 15), b = ri(1, a - 1);
    return { type: 'num',
      prompt: `${m(String(a))} balloons float in the air. ${m(String(b))} fly away. How many are left?`,
      answer: a - b,
      explain: `"Fly away" means subtract: ${a} − ${b} = <strong>${a - b}</strong> balloons.` };
  }),
  S('t8', 'Order three numbers', 1, 'Comparing', '⚖️', () => {
    const nums = shuffle([ri(10, 39), ri(40, 69), ri(70, 99)]);
    const correct = String(Math.min(...nums));
    return { type: 'mc', prompt: `Which number is the <strong>smallest</strong>: ${m(nums.join(', '))} ?`,
      answer: correct, choices: nums.map(String),
      explain: `Compare the tens first: <strong>${correct}</strong> has the fewest tens.` };
  }),
  S('t9', 'Build numbers from tens and ones', 1, 'Place value', '🧱', () => {
    const t = ri(1, 9), o = ri(0, 9);
    return { type: 'num', prompt: `${m(`${t} tens and ${o} ones`)} make the number ___.`,
      answer: t * 10 + o,
      explain: `${t} tens = ${t * 10}, plus ${o} ones: ${t * 10} + ${o} = <strong>${t * 10 + o}</strong>.` };
  }),
  S('t10', 'Read a clock — on the hour', 1, 'Measurement', '⏰', () => {
    const h = ri(1, 12);
    const correct = `${h}:00`;
    return { type: 'mc',
      prompt: `The short hand points to ${m(String(h))} and the long hand points to 12. What time is it?`,
      answer: correct, choices: mcChoices(correct, [`${h}:30`, `12:00`, `${h % 12 + 1}:00`]),
      explain: `Long hand on 12 means "o'clock" — so it is exactly <strong>${correct}</strong>.` };
  }),
  S('t11', 'Count sides of shapes', 1, 'Geometry', '📐', () => {
    const [name, n] = pick([['triangle', 3], ['rectangle', 4], ['pentagon', 5], ['hexagon', 6]]);
    return { type: 'num', prompt: `How many <strong>sides</strong> does a ${m(name)} have?`,
      answer: n, explain: `A ${name} has <strong>${n}</strong> sides.` };
  }),

  /* ================= GRADE 2 ================= */
  S('t12', 'Expanded form in reverse', 2, 'Place value', '🧱', () => {
    const h = ri(1, 9) * 100, t = ri(0, 9) * 10, o = ri(0, 9);
    return { type: 'num', prompt: `${m(`${h} + ${t} + ${o} = ?`)}`,
      answer: h + t + o,
      explain: `Stack the place values: ${h} + ${t} + ${o} = <strong>${h + t + o}</strong>.` };
  }),
  S('t13', 'Compare 3-digit numbers', 2, 'Place value', '🧱', () => {
    let a = ri(100, 999), b = ri(100, 999);
    while (b === a) b = ri(100, 999);
    const correct = String(Math.max(a, b));
    return { type: 'mc', prompt: `Which is <strong>greater</strong>: ${m(`${a} or ${b}`)} ?`,
      answer: correct, choices: [String(a), String(b)],
      explain: `Compare hundreds first, then tens, then ones: <strong>${correct}</strong> is greater.` };
  }),
  S('t14', 'Hundreds place value', 2, 'Place value', '🧱', () => {
    const h = ri(1, 9), n = h * 100 + ri(11, 99);
    return { type: 'num', prompt: `In ${m(String(n))}, what is the value of the digit <strong>${h}</strong>?`,
      answer: h * 100,
      explain: `The ${h} sits in the hundreds place: ${h} × 100 = <strong>${h * 100}</strong>.` };
  }),
  S('t15', 'Add with regrouping', 2, 'Addition and subtraction', '➕', () => {
    const a = ri(15, 60), b = ri(15, 99 - a);
    const ones = (a % 10) + (b % 10);
    return { type: 'num', prompt: `${m(`${a} + ${b} = ?`)}`,
      answer: a + b,
      explain: `Ones: ${a % 10} + ${b % 10} = ${ones}${ones >= 10 ? ` — regroup into 1 ten + ${ones % 10}` : ''}.
        Tens: ${Math.floor(a / 10)} + ${Math.floor(b / 10)}${ones >= 10 ? ' + 1 carried' : ''}.<br>Total: <strong>${a + b}</strong>.` };
  }),
  S('t16', 'Subtract with regrouping', 2, 'Addition and subtraction', '➕', () => {
    const onesA = ri(0, 7), onesB = ri(onesA + 1, 9);
    const tensA = ri(3, 9), tensB = ri(1, tensA - 1);
    const a = tensA * 10 + onesA, b = tensB * 10 + onesB;
    return { type: 'num', prompt: `${m(`${a} − ${b} = ?`)}`,
      answer: a - b,
      explain: `Ones: ${onesA} < ${onesB} — so regroup! Break one ten into 10 ones: ${onesA + 10} − ${onesB} = ${onesA + 10 - onesB},
        and the tens become ${tensA - 1} − ${tensB}. Answer: <strong>${a - b}</strong>.` };
  }),
  S('t17', 'What is the pattern rule?', 2, 'Patterns', '🔁', () => {
    const d = ri(2, 9), a = ri(1, 20);
    const correct = `add ${d}`;
    return { type: 'mc',
      prompt: `${m(`${a}, ${a + d}, ${a + 2 * d}, ${a + 3 * d}, …`)} — what is the rule?`,
      answer: correct,
      choices: mcChoices(correct, [`add ${d + 1}`, `subtract ${d}`, `multiply by ${d}`]),
      explain: `Each number grows by ${d}: the rule is "<strong>add ${d}</strong>".` };
  }),
  S('t18', 'Count coins', 2, 'Measurement', '💰', () => {
    const q = ri(1, 3), d = ri(1, 4), n = ri(0, 4);
    const total = q * 25 + d * 10 + n * 5;
    return { type: 'num',
      prompt: `${m(`${q} quarter${q > 1 ? 's' : ''}, ${d} dime${d > 1 ? 's' : ''}, and ${n} nickel${n === 1 ? '' : 's'}`)} — how many cents in all?`,
      answer: total,
      explain: `Quarters: ${q} × 25 = ${q * 25}; dimes: ${d} × 10 = ${d * 10}; nickels: ${n} × 5 = ${n * 5}.
        Total: <strong>${total}¢</strong>.` };
  }),
  S('t19', 'Choose the right unit', 2, 'Measurement', '📏', () => {
    const [thing, correct, wrong] = pick([
      ['a pencil', 'cm', 'm'], ['a classroom', 'm', 'cm'], ['your finger', 'cm', 'km'], ['a road trip', 'km', 'm']
    ]);
    return { type: 'mc', prompt: `Which unit makes sense for the length of ${m(thing)}?`,
      answer: correct, choices: [correct, wrong],
      explain: `${thing[0].toUpperCase() + thing.slice(1)} is best measured in <strong>${correct}</strong>.` };
  }),
  S('t20', 'Count corners (vertices)', 2, 'Geometry', '📐', () => {
    const [name, n] = pick([['triangle', 3], ['square', 4], ['pentagon', 5], ['hexagon', 6]]);
    return { type: 'num', prompt: `How many <strong>corners (vertices)</strong> does a ${m(name)} have?`,
      answer: n, explain: `A ${name} has ${n} sides AND ${n} corners — <strong>${n}</strong>.` };
  }),
  S('t21', 'Read tally marks', 2, 'Data', '📊', () => {
    const fives = ri(1, 3), ones = ri(0, 4);
    const total = fives * 5 + ones;
    const tally = Array(fives).fill('卌').join(' ') + (ones ? ' ' + '|'.repeat(ones) : '');
    return { type: 'num', prompt: `A tally chart shows ${m(tally)} for "voted for pizza". How many votes?`,
      answer: total,
      explain: `Each 卌 is a group of 5: ${fives} × 5 = ${fives * 5}, plus ${ones} more → <strong>${total}</strong>.` };
  }),

  /* ================= GRADE 3 ================= */
  S('t22', 'Multiply by 0, 1, or 10', 3, 'Multiplication', '✖️', () => {
    const n = ri(2, 15), k = pick([0, 1, 10]);
    const ans = n * k;
    const why = { 0: 'Any number × 0 = 0 — zero groups is nothing at all!',
                  1: '× 1 keeps the number — 1 is the <em>identity</em> for multiplication!',
                  10: '× 10 just adds a zero (shifts the place value).' }[k];
    return { type: 'num', prompt: `${m(`${n} × ${k} = ?`)}`, answer: ans,
      explain: `💡 ${why} So ${n} × ${k} = <strong>${ans}</strong>.` };
  }),
  S('t23', 'Missing factor', 3, 'Multiplication', '✖️', () => {
    const a = ri(2, 9), b = ri(2, 9);
    return { type: 'num', prompt: `${m(`${a} × ___ = ${a * b}`)} — what number is missing?`,
      answer: b,
      explain: `💡 Use the <em>inverse</em>: ${a * b} ÷ ${a} = <strong>${b}</strong>. Multiplication and division undo each other!` };
  }),
  S('t24', 'Divide by 1 or by itself', 3, 'Division', '➗', () => {
    const n = ri(2, 20), self = pick([true, false]);
    return { type: 'num', prompt: `${m(`${n} ÷ ${self ? n : 1} = ?`)}`,
      answer: self ? 1 : n,
      explain: self ? `Anything ÷ itself = <strong>1</strong> (it fits exactly once!).`
                    : `÷ 1 changes nothing: ${n} ÷ 1 = <strong>${n}</strong>.` };
  }),
  S('t25', 'Missing divisor', 3, 'Division', '➗', () => {
    const b = ri(2, 9), q = ri(2, 9);
    return { type: 'num', prompt: `${m(`${b * q} ÷ ___ = ${q}`)} — what number is missing?`,
      answer: b,
      explain: `💡 Think inversely: ${b} × ${q} = ${b * q}, so the missing divisor is <strong>${b}</strong>.` };
  }),
  S('t26', 'Fractions on a number line', 3, 'Fractions', '🍕', () => {
    const [correct, wrongs] = pick([
      ['1/2', ['1/3', '2/1', '1/4']], ['1/4', ['1/2', '3/4', '4/1']], ['3/4', ['1/4', '1/2', '4/3']]
    ]);
    const label = { '1/2': 'halfway between 0 and 1', '1/4': 'halfway between 0 and 1/2', '3/4': 'halfway between 1/2 and 1' }[correct];
    return { type: 'mc', prompt: `On a number line, a point sits <strong>${label}</strong>. What fraction is it?`,
      answer: correct, choices: mcChoices(correct, wrongs),
      explain: `Halfway marks equal pieces: the point is <strong>${correct}</strong>.` };
  }),
  S('t27', 'Fraction of a set', 3, 'Fractions', '🍕', () => {
    const d = pick([3, 4, 6]), n = ri(1, d - 1);
    const whole = d * ri(2, 5);
    return { type: 'num', prompt: `What is ${m(`${n}/${d} of ${whole}`)} apples?`,
      answer: n * (whole / d),
      explain: `Split ${whole} into ${d} equal groups (${whole} ÷ ${d} = ${whole / d}), then take ${n} groups: <strong>${n * (whole / d)}</strong>.` };
  }),
  S('t28', 'Area by counting unit squares', 3, 'Geometry', '📐', () => {
    const l = ri(2, 8), w = ri(2, 8);
    return { type: 'num',
      prompt: `A rectangle is covered by ${m(String(l))} rows of ${m(String(w))} unit squares. What is its <strong>area</strong> (square units)?`,
      answer: l * w,
      explain: `💡 Rows of squares ARE multiplication: ${l} × ${w} = <strong>${l * w}</strong> square units. Area = length × width!` };
  }),
  S('t29', 'Regrouping multiplication', 3, 'Number relationships', '🔗', () => {
    const a = ri(2, 5), b = ri(2, 5), c = ri(2, 5);
    return { type: 'num',
      prompt: `${m(`(${a} × ${b}) × ${c} = ${a} × (${b} × ___)`)} — fill in the blank.`,
      answer: c,
      explain: `💡 <em>Associative law:</em> multiplication works no matter how you group. The missing number is <strong>${c}</strong>.` };
  }),
  S('t30', 'Elapsed time — whole hours', 3, 'Measurement', '⏰', () => {
    const a = ri(1, 9), b = a + ri(1, 3);
    return { type: 'num', prompt: `A movie runs from ${m(`${a}:00`)} to ${m(`${b}:00`)}. How many hours long is it?`,
      answer: b - a, explain: `${b} − ${a} = <strong>${b - a}</strong> hour${b - a > 1 ? 's' : ''}.` };
  }),
  S('t31', 'Read a bar graph', 3, 'Data', '📊', () => {
    const a = ri(2, 9), b = ri(2, 9);
    return { type: 'num',
      prompt: `A bar graph shows: Monday ${m(String(a))} books read, Tuesday ${m(String(b))} books. How many books in total?`,
      answer: a + b,
      explain: `Read the two bars and add: ${a} + ${b} = <strong>${a + b}</strong>.` };
  }),

  /* ================= GRADE 4 ================= */
  S('t32', 'Multiply 2-digit by 2-digit', 4, 'Multiplication and division', '✖️', () => {
    const a = ri(12, 39), b = ri(12, 25);
    const tens = Math.floor(a / 10) * 10, ones = a % 10;
    return { type: 'num', prompt: `${m(`${a} × ${b} = ?`)}`,
      answer: a * b,
      explain: `Split with the distributive law: ${a} × ${b} = (${tens} × ${b}) + (${ones} × ${b}) = ${tens * b} + ${ones * b} = <strong>${a * b}</strong>.` };
  }),
  S('t33', 'Division with remainders', 4, 'Multiplication and division', '✖️', () => {
    const b = ri(2, 9), q = ri(2, 9), r = ri(1, b - 1);
    const a = b * q + r;
    const correct = `${q} R${r}`;
    return { type: 'mc', prompt: `${m(`${a} ÷ ${b} = ?`)}`,
      answer: correct,
      choices: mcChoices(correct, [`${q} R${b - r}`, `${q + 1} R${r}`, `${q} R${r + 1}`]),
      explain: `${b} × ${q} = ${b * q}, and ${a} − ${b * q} = ${r} left over → <strong>${q} R${r}</strong>.
        💡 Check inversely: ${b} × ${q} + ${r} = ${a} ✓` };
  }),
  S('t34', 'Improper fractions to mixed numbers', 4, 'Fractions', '🍕', () => {
    const d = pick([2, 3, 4, 5]), w = ri(1, 4), r = ri(1, d - 1);
    const n = w * d + r;
    const correct = `${w} ${r}/${d}`;
    return { type: 'mc', prompt: `Write ${m(`${n}/${d}`)} as a <strong>mixed number</strong>.`,
      answer: correct,
      choices: mcChoices(correct, [`${w + 1} ${r}/${d}`, `${w} ${d - r}/${d}`, `${w} ${r}/${d + 1}`]),
      explain: `${n} ÷ ${d} = ${w} with remainder ${r}: <strong>${w} ${r}/${d}</strong>.` };
  }),
  S('t35', 'List multiples', 4, 'Number theory', '🧮', () => {
    const n = ri(3, 12);
    return { type: 'num', prompt: `The multiples of ${m(String(n))} start ${m(`${n}, ${2 * n}, ${3 * n}, ___`)}…`,
      answer: 4 * n,
      explain: `Multiples are just ${n} × 1, × 2, × 3, × 4: next is <strong>${4 * n}</strong>.` };
  }),
  S('t36', 'Round to the nearest thousand', 4, 'Rounding', '🎯', () => {
    const n = ri(1500, 9950);
    const correct = String(Math.round(n / 1000) * 1000);
    return { type: 'mc', prompt: `Round ${m(String(n))} to the nearest <strong>thousand</strong>.`,
      answer: correct,
      choices: mcChoices(correct, [String(Math.floor(n / 1000) * 1000), String(Math.ceil(n / 1000) * 1000 + 1000), String(Math.round(n / 100) * 100)]),
      explain: `Look at the hundreds digit: ${n} is closest to <strong>${correct}</strong>.` };
  }),
  S('t37', 'Parallel, perpendicular, intersecting', 4, 'Geometry', '📐', () => {
    const [clue, correct] = pick([
      ['Railroad tracks that never meet', 'parallel'],
      ['Two roads crossing at a right angle (90°)', 'perpendicular'],
      ['Two lines crossing at any angle', 'intersecting']
    ]);
    return { type: 'mc', prompt: `${m(clue)} are…`,
      answer: correct, choices: ['parallel', 'perpendicular', 'intersecting'],
      explain: `<strong>${correct[0].toUpperCase() + correct.slice(1)}</strong> lines — ${clue.toLowerCase()}.` };
  }),
  S('t38', 'Lines of symmetry', 4, 'Geometry', '📐', () => {
    const [name, n] = pick([['square', 4], ['rectangle (not a square)', 2], ['equilateral triangle', 3]]);
    return { type: 'num', prompt: `How many <strong>lines of symmetry</strong> does a ${m(name)} have?`,
      answer: n, explain: `A ${name} can be folded onto itself in <strong>${n}</strong> different ways.` };
  }),
  S('t39', 'Convert cm and mm', 4, 'Measurement', '📏', () => {
    const n = ri(2, 30), dir = pick([true, false]);
    return dir
      ? { type: 'num', prompt: `${m(`${n} cm`)} = how many mm?`, answer: n * 10,
          explain: `1 cm = 10 mm, so ${n} cm = ${n} × 10 = <strong>${n * 10} mm</strong>.` }
      : { type: 'num', prompt: `${m(`${n * 10} mm`)} = how many cm?`, answer: n,
          explain: `💡 Inverse: ${n * 10} ÷ 10 = <strong>${n} cm</strong>.` };
  }),
  S('t40', 'Input/output rules', 4, 'Patterns', '🔁', () => {
    const k = ri(2, 9), x = ri(2, 9), add = pick([true, false]);
    const rule = add ? x : x;
    const ins = [2, 3, 4], outs = ins.map(v => add ? v + rule : v * rule);
    const ask = ri(5, 9);
    return { type: 'num',
      prompt: `A machine follows a rule: ${m(ins.map((v, i) => `${v} → ${outs[i]}`).join(', '))}. What does ${m(String(ask))} become?`,
      answer: add ? ask + rule : ask * rule,
      explain: `The rule is "${add ? 'add' : 'multiply by'} ${rule}": ${ask} ${add ? '+' : '×'} ${rule} = <strong>${add ? ask + rule : ask * rule}</strong>.` };
  }),

  /* ================= GRADE 5 ================= */
  S('t41', 'Divide decimals by whole numbers', 5, 'Decimals', '🔟', () => {
    const w = ri(2, 9), q = ri(11, 99) / 10;
    const a = Number((q * w).toFixed(2));
    return { type: 'num', prompt: `${m(`${a.toFixed(2).replace(/0$/, '')} ÷ ${w} = ?`)}`,
      answer: q,
      explain: `Think inversely: ${w} × ${q.toFixed(1)} = ${a}. So the quotient is <strong>${q.toFixed(1)}</strong>.` };
  }),
  S('t42', 'Compare decimals', 5, 'Decimals', '🔟', () => {
    let a = ri(1, 99) / 10, b = ri(1, 99) / 10;
    while (b === a) b = ri(1, 99) / 10;
    const correct = Math.max(a, b).toFixed(1);
    return { type: 'mc', prompt: `Which is <strong>greater</strong>: ${m(`${a.toFixed(1)} or ${b.toFixed(1)}`)} ?`,
      answer: correct, choices: [a.toFixed(1), b.toFixed(1)],
      explain: `Compare tenths digit by digit: <strong>${correct}</strong> is greater.` };
  }),
  S('t43', 'Decimals to fractions', 5, 'Decimals', '🔟', () => {
    const [dec, frac] = pick([['0.5', '1/2'], ['0.25', '1/4'], ['0.75', '3/4'], ['0.2', '1/5'], ['0.1', '1/10']]);
    return { type: 'mc', prompt: `${m(dec)} as a <strong>fraction</strong> is…`,
      answer: frac, choices: mcChoices(frac, ['1/2', '1/4', '3/4', '1/5', '1/10'].filter(f => f !== frac).slice(0, 3)),
      explain: `${dec} = <strong>${frac}</strong>.` };
  }),
  S('t44', 'Prime factorization', 5, 'Number theory', '🧮', () => {
    const [n, correct] = pick([[12, '2 × 2 × 3'], [18, '2 × 3 × 3'], [20, '2 × 2 × 5'], [24, '2 × 2 × 2 × 3'], [30, '2 × 3 × 5'], [36, '2 × 2 × 3 × 3']]);
    return { type: 'mc', prompt: `What is the <strong>prime factorization</strong> of ${m(String(n))}?`,
      answer: correct,
      choices: mcChoices(correct, [`2 × 3 × ${n / 6 | 0}`, `${n / 2} × 2`, `2 × ${n / 2}`]),
      explain: `Break ${n} into primes only: ${correct} = <strong>${n}</strong> ✓` };
  }),
  S('t45', 'Order of operations with exponents', 5, 'Order of operations', '🧮', () => {
    const a = ri(2, 9), b = ri(2, 4);
    return { type: 'num', prompt: `${m(`${a} + ${b}² = ?`)}`,
      answer: a + b * b,
      explain: `Exponents BEFORE addition: ${b}² = ${b * b}, then ${a} + ${b * b} = <strong>${a + b * b}</strong>.` };
  }),
  S('t46', 'Volume by counting unit cubes', 5, 'Measurement', '📦', () => {
    const l = ri(2, 5), w = ri(2, 5), h = ri(2, 4);
    return { type: 'num',
      prompt: `A box is filled with ${m(String(l))} × ${m(String(w))} × ${m(String(h))} unit cubes. What is its <strong>volume</strong> (cubic units)?`,
      answer: l * w * h,
      explain: `Each layer has ${l} × ${w} = ${l * w} cubes, and there are ${h} layers: ${l * w} × ${h} = <strong>${l * w * h}</strong>.` };
  }),
  S('t47', 'Classify triangles by angles', 5, 'Geometry', '📐', () => {
    const [kind, angles] = pick([
      ['acute', [50, 60, 70]], ['right', [90, 40, 50]], ['obtuse', [120, 30, 30]]
    ]);
    return { type: 'mc', prompt: `A triangle's angles are ${m(angles.map(a => a + '°').join(', '))}. Classify it:`,
      answer: kind, choices: ['acute', 'right', 'obtuse'],
      explain: `${kind === 'acute' ? 'All angles are under 90°' : kind === 'right' ? 'It has a 90° angle' : 'It has an angle over 90°'} → <strong>${kind}</strong>.` };
  }),
  S('t48', 'Pattern rules with multiplication', 5, 'Patterns', '🔁', () => {
    const k = pick([2, 3]), a = ri(1, 5);
    const correct = `multiply by ${k}`;
    return { type: 'mc',
      prompt: `${m(`${a}, ${a * k}, ${a * k * k}, ${a * k * k * k}, …`)} — what is the rule?`,
      answer: correct,
      choices: mcChoices(correct, [`add ${k}`, `multiply by ${k + 1}`, `add ${a}`]),
      explain: `Each term is the previous × ${k} — a <em>geometric</em> pattern (multiplication, not addition!).` };
  }),

  /* ================= GRADE 6 ================= */
  S('t49', 'Integer word problems', 6, 'Integers', '🌡️', () => {
    const a = ri(-10, -1), b = ri(2, 15);
    return { type: 'num',
      prompt: `The temperature is ${m(fmtNum(a) + '°C')} and rises by ${m(`${b}°C`)}. What is the new temperature?`,
      answer: a + b,
      explain: `Rising means adding: ${fmtNum(a)} + ${b} = <strong>${fmtNum(a + b)}°C</strong>.` };
  }),
  S('t50', 'Multiply integers', 6, 'Integers', '🌡️', () => {
    const a = ri(-9, 9) || -3, b = ri(-9, 9) || 4;
    const ans = a * b;
    return { type: 'num', prompt: `${m(`(${fmtNum(a)}) × (${fmtNum(b)}) = ?`)}`,
      answer: ans,
      explain: `💡 Signs: ${(a < 0) === (b < 0) ? 'same signs → positive' : 'different signs → negative'}.
        |${a}| × |${b}| = ${Math.abs(ans)}, so the answer is <strong>${fmtNum(ans)}</strong>.` };
  }),
  S('t51', 'Ratio word problems', 6, 'Ratios and rates', '🚗', () => {
    const a = ri(1, 5), b = ri(a + 1, 8), k = ri(2, 5);
    return { type: 'num',
      prompt: `The ratio of boys to girls is ${m(`${a}:${b}`)}. There are ${m(String(a * k))} boys. How many girls?`,
      answer: b * k,
      explain: `${a * k} boys is ×${k} the ratio part, so girls = ${b} × ${k} = <strong>${b * k}</strong>.` };
  }),
  S('t52', 'Percents to decimals', 6, 'Conversions', '🔄', () => {
    const p = pick([5, 15, 45, 60, 80, 95, 120]);
    return { type: 'num', prompt: `${m(`${p}%`)} as a <strong>decimal</strong> is…`,
      answer: p / 100,
      explain: `Percent means "per hundred": ${p}% = ${p} ÷ 100 = <strong>${fmtNum(p / 100)}</strong>.` };
  }),
  S('t53', 'Discount prices', 6, 'Percents', '💯', () => {
    const p = pick([10, 20, 25, 50]), price = (p === 25 ? 4 : 5) * ri(2, 12);
    const ans = price * (100 - p) / 100;
    return { type: 'num', prompt: `A ${m('$' + price)} game is ${m(`${p}% off`)}. What is the sale price?`,
      answer: ans,
      explain: `${p}% off means you pay ${100 - p}%: $${price} × ${(100 - p) / 100} = <strong>$${ans}</strong>.` };
  }),
  S('t54', 'Evaluate simple expressions', 6, 'Expressions', '🧮', () => {
    const n = ri(1, 12), c = ri(1, 9);
    return { type: 'num', prompt: `Evaluate ${m(`n + ${c}`)} when ${m(`n = ${n}`)}.`,
      answer: n + c,
      explain: `Substitute: ${n} + ${c} = <strong>${n + c}</strong>.` };
  }),
  S('t55', 'Divisibility rules', 6, 'Number theory', '🧮', () => {
    const divisible = pick([true, false]);
    const n = divisible ? 3 * ri(10, 99) : 3 * ri(10, 99) + pick([1, 2]);
    const sum = String(n).split('').reduce((s, d) => s + Number(d), 0);
    const correct = divisible ? 'yes' : 'no';
    return { type: 'mc', prompt: `Is ${m(String(n))} divisible by <strong>3</strong>?`,
      answer: correct, choices: ['yes', 'no'],
      explain: `💡 Trick: digit sum ${String(n).split('').join(' + ')} = ${sum}, and ${sum} ${sum % 3 === 0 ? 'IS' : 'is NOT'} divisible by 3 → <strong>${correct}</strong>.` };
  }),
  S('t56', 'Area of parallelograms', 6, 'Geometry', '📐', () => {
    const b = ri(3, 12), h = ri(2, 9);
    return { type: 'num', prompt: `A parallelogram has base ${m(`${b} cm`)} and height ${m(`${h} cm`)}. What is its <strong>area</strong>?`,
      answer: b * h,
      explain: `💡 Slide the triangle end over — a parallelogram is just a rectangle in disguise! Area = base × height = <strong>${b * h} cm²</strong>.` };
  }),

  /* ================= GRADE 7 ================= */
  S('t57', 'Circle radius and diameter', 7, 'Geometry', '📐', () => {
    const r = ri(2, 12), toD = pick([true, false]);
    return toD
      ? { type: 'num', prompt: `A circle's radius is ${m(`${r} cm`)}. What is its <strong>diameter</strong>?`, answer: 2 * r,
          explain: `Diameter = 2 × radius = <strong>${2 * r} cm</strong>.` }
      : { type: 'num', prompt: `A circle's diameter is ${m(`${2 * r} cm`)}. What is its <strong>radius</strong>?`, answer: r,
          explain: `💡 Inverse: radius = diameter ÷ 2 = <strong>${r} cm</strong>.` };
  }),
  S('t58', 'Counting principle', 7, 'Probability', '🎲', () => {
    const a = ri(2, 5), b = ri(2, 5);
    return { type: 'num', prompt: `${m(String(a))} shirts and ${m(String(b))} pants — how many different outfits?`,
      answer: a * b,
      explain: `💡 Each shirt pairs with every pair of pants: ${a} × ${b} = <strong>${a * b}</strong> outfits (multiplication counts combinations!).` };
  }),
  S('t59', 'Simplify with the distributive property', 7, 'Expressions', '🧮', () => {
    const a = ri(2, 5), b = ri(1, 9);
    const correct = `${a - 1}x + ${a * b}`;
    return { type: 'mc', prompt: `Simplify: ${m(`${a}(x + ${b}) − x`)}`,
      answer: correct,
      choices: mcChoices(correct, [`${a}x + ${a * b}`, `${a - 1}x + ${b}`, `${a + 1}x + ${a * b}`]),
      explain: `Distribute: ${a}x + ${a * b} − x. Combine like terms: (${a} − 1)x + ${a * b} = <strong>${correct}</strong>.` };
  }),
  S('t60', 'Cube roots', 7, 'Exponents', '💪', () => {
    const n = ri(2, 6);
    return { type: 'num', prompt: `${m(`∛${n * n * n} = ?`)}`,
      answer: n,
      explain: `💡 Cube root undoes cubing: ${n}³ = ${n * n * n}, so ∛${n * n * n} = <strong>${n}</strong>.` };
  }),
  S('t61', 'Percent proportions', 7, 'Percents', '💯', () => {
    const whole = pick([20, 40, 50, 80, 200]);
    const pct = pick([10, 20, 25, 50, 75]);
    const part = whole * pct / 100;
    return { type: 'num', prompt: `${m(`${part} is ___% of ${whole}`)} — what percent?`,
      answer: pct,
      explain: `${part} ÷ ${whole} = ${fmtNum(part / whole)} = <strong>${pct}%</strong>. (Part ÷ whole = the rate!)` };
  }),
  S('t62', 'Multiply two negatives', 7, 'Integers', '🌡️', () => {
    const a = ri(2, 9), b = ri(2, 9);
    return { type: 'num', prompt: `${m(`(${MINUS}${a}) × (${MINUS}${b}) = ?`)}`,
      answer: a * b,
      explain: `💡 Two negatives make a positive! (Think: the negative of a negative flips back.) <strong>${a * b}</strong>.` };
  }),
  S('t63', 'Arithmetic patterns', 7, 'Sequences', '🔢', () => {
    const a = ri(1, 15), d = ri(2, 9);
    return { type: 'num', prompt: `${m(`${a}, ${a + d}, ${a + 2 * d}, ___`)} — what comes next?`,
      answer: a + 3 * d,
      explain: `Add ${d} each time: ${a + 2 * d} + ${d} = <strong>${a + 3 * d}</strong>.` };
  }),
  S('t64', 'Sale prices with percent', 7, 'Consumer math', '💰', () => {
    const p = pick([10, 20, 25, 50]), price = (p === 25 ? 4 : 5) * ri(2, 12);
    const ans = price * (100 - p) / 100;
    return { type: 'num', prompt: `Shoes cost ${m('$' + price)} and are ${m(`${p}% off`)}. What do you pay?`,
      answer: ans,
      explain: `Discount = $${price} × ${p / 100} = $${price * p / 100}, so you pay $${price} − $${price * p / 100} = <strong>$${ans}</strong>.` };
  }),
  S('t65', 'Which equation shows the law?', 7, 'Number relationships', '🔗', () => {
    const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9);
    const correct = `${a} × (${b} + ${c}) = ${a} × ${b} + ${a} × ${c}`;
    return { type: 'mc', prompt: `Which equation shows the <strong>distributive law</strong>?`,
      answer: correct,
      choices: mcChoices(correct, [`${a} + ${b} = ${b} + ${a}`, `(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})`, `${a} × ${b} = ${b} × ${a}`]),
      explain: `Distributive = multiplication <em>spreads over</em> addition: <strong>${correct}</strong>.` };
  }),
  S('t66', 'Check if x is a solution', 7, 'One-variable equations', '➕', () => {
    const a = ri(2, 6), x = ri(1, 8), b = ri(1, 9);
    const c = a * x + b;
    const correct = pick([true, false]) ? 'yes' : 'no';
    const test = correct === 'yes' ? x : x + pick([1, 2]);
    return { type: 'mc', prompt: `Is ${m(`x = ${test}`)} a solution of ${m(`${a}x + ${b} = ${c}`)} ?`,
      answer: correct, choices: ['yes', 'no'],
      explain: `Substitute: ${a}(${test}) + ${b} = ${a * test + b}. ${a * test + b === c ? 'It equals' : 'It does NOT equal'} ${c} → <strong>${correct}</strong>.` };
  }),

  /* ================= GRADE 8 ================= */
  S('t67', 'Equations with fractions', 8, 'Equations', '🔀', () => {
    const d = ri(2, 6), b = ri(1, 9), x = ri(1, 9);
    const c = x + b;
    return { type: 'num', prompt: `Solve for x: ${m(`x/${d} + ${b} = ${c}`)}`,
      answer: x * d,
      explain: `Subtract ${b}: x/${d} = ${c - b}. Multiply both sides by ${d} (inverse!): x = <strong>${x * d}</strong>.` };
  }),
  S('t68', 'Rate of change from a table', 8, 'Linear relations', '📈', () => {
    const slope = ri(2, 6), b = ri(-4, 8);
    return { type: 'num',
      prompt: `A table shows: ${m(`(0, ${fmtNum(b)}), (1, ${fmtNum(b + slope)}), (2, ${fmtNum(b + 2 * slope)})`)}. What is the <strong>rate of change (slope)</strong>?`,
      answer: slope,
      explain: `Each step right by 1, y grows by ${slope}: slope = <strong>${slope}</strong>.` };
  }),
  S('t69', 'Scientific notation — small numbers', 8, 'Exponents', '💪', () => {
    const digits = pick(['1.2', '4.5', '7.8', '3.6']);
    const n = ri(3, 6);
    const zeros = '0'.repeat(n - 1);
    return { type: 'num', prompt: `${m(`0.${zeros}${digits.replace('.', '')} = ${digits} × 10`)}${sup('?')} — what is the exponent?`,
      answer: -n,
      explain: `The decimal moved ${n} places left → exponent <strong>${MINUS}${n}</strong>. 💡 Small numbers need <em>negative</em> exponents.` };
  }),
  S('t70', 'Scientific notation — large numbers', 8, 'Exponents', '💪', () => {
    const digits = pick(['1.2', '4.5', '7.8', '3.6', '9.1']);
    const n = ri(3, 7);
    const zeros = '0'.repeat(n - 1);
    return { type: 'num', prompt: `${m(`${digits.replace('.', '')}${zeros} = ${digits} × 10`)}${sup('?')} — what is the exponent?`,
      answer: n,
      explain: `The decimal moved ${n} places right → exponent <strong>${n}</strong>.` };
  }),
  S('t71', 'Volume of a cylinder', 8, 'Geometry', '📐', () => {
    const r = ri(2, 6), h = ri(2, 9);
    const ans = Number((3.14 * r * r * h).toFixed(2));
    return { type: 'num', prompt: `A cylinder has radius ${m(`${r} cm`)} and height ${m(`${h} cm`)}. Using π ≈ 3.14, find its <strong>volume</strong>.`,
      answer: ans,
      explain: `V = πr²h ≈ 3.14 × ${r}² × ${h} = 3.14 × ${r * r} × ${h} = <strong>${ans} cm³</strong>.` };
  }),
  S('t72', 'Translations on the coordinate plane', 8, 'Transformations', '🔀', () => {
    const x = ri(-5, 3), y = ri(-5, 3), dx = ri(2, 6), dy = ri(1, 5);
    const correct = `(${x + dx}, ${y + dy})`;
    return { type: 'mc', prompt: `Point ${m(`(${x}, ${y})`)} is translated ${m(String(dx))} right and ${m(String(dy))} up. Where does it land?`,
      answer: correct,
      choices: mcChoices(correct, [`(${x + dx}, ${y - dy})`, `(${x - dx}, ${y + dy})`, `(${x + dy}, ${y + dx})`]),
      explain: `Right adds to x, up adds to y: (${x} + ${dx}, ${y} + ${dy}) = <strong>${correct}</strong>.` };
  }),
  S('t73', 'Scatter plot trends', 8, 'Data', '📊', () => {
    const [clue, correct] = pick([
      ['points climb upward from left to right', 'positive'],
      ['points fall downward from left to right', 'negative'],
      ['points are scattered everywhere with no pattern', 'no association']
    ]);
    return { type: 'mc', prompt: `A scatter plot's ${m(clue)}. What association does it show?`,
      answer: correct, choices: ['positive', 'negative', 'no association'],
      explain: `That pattern shows a <strong>${correct}</strong> association.` };
  }),
  S('t74', 'Angle pairs with transversals', 8, 'Geometry', '📐', () => {
    const [kind, rel] = pick([['corresponding', 'equal'], ['alternate interior', 'equal'], ['co-interior (same-side)', 'supplementary (add to 180°)']]);
    return { type: 'mc', prompt: `When parallel lines are cut by a transversal, ${m(kind)} angles are…`,
      answer: rel, choices: mcChoices(rel, ['equal', 'supplementary (add to 180°)', 'complementary (add to 90°)']),
      explain: `<strong>${kind[0].toUpperCase() + kind.slice(1)}</strong> angles are ${rel}.` };
  }),

  /* ================= GRADE 9 ================= */
  S('t75', 'Is (x, y) a solution of the system?', 9, 'Systems of equations', '🤝', () => {
    const x = ri(-4, 4), y = ri(-4, 4);
    const s = x + y, d = x - y;
    const test = pick([true, false]) ? [x, y] : [x + 1, y];
    const correct = (test[0] + test[1] === s && test[0] - test[1] === d) ? 'yes' : 'no';
    return { type: 'mc', prompt: `Is ${m(`(${test[0]}, ${fmtNum(test[1])})`)} a solution of ${m(`x + y = ${fmtNum(s)}`)} and ${m(`x − y = ${fmtNum(d)}`)} ?`,
      answer: correct, choices: ['yes', 'no'],
      explain: `Substitute into BOTH equations: ${test[0]} + ${fmtNum(test[1])} = ${test[0] + test[1]} ${test[0] + test[1] === s ? '✓' : '✗'} and ${test[0]} − ${fmtNum(test[1])} = ${test[0] - test[1]} ${test[0] - test[1] === d ? '✓' : '✗'} → <strong>${correct}</strong>.` };
  }),
  S('t76', 'Subtract polynomials', 9, 'Polynomials', '🧬', () => {
    const a = ri(2, 7), b = ri(1, 7), c = ri(1, a - 1), d = ri(1, b);
    const A = a - c, B = b - d;
    const correct = `${A}x² + ${B}x`;
    return { type: 'mc', prompt: `Simplify: ${m(`(${a}x² + ${b}x) − (${c}x² + ${d}x)`)}`,
      answer: correct,
      choices: mcChoices(correct, [`${A}x² − ${B}x`, `${a + c}x² + ${b + d}x`, `${A}x² + ${B + 1}x`]),
      explain: `💡 Subtracting distributes the minus! x²: ${a} − ${c} = ${A}; x: ${b} − ${d} = ${B} → <strong>${correct}</strong>.` };
  }),
  S('t77', 'Multiply binomials (FOIL)', 9, 'Polynomials', '🧬', () => {
    const a = ri(1, 6), b = ri(1, 6);
    return { type: 'num', prompt: `${m(`(x + ${a})(x + ${b}) = x² + ?x + ${a * b}`)} — what is the missing coefficient?`,
      answer: a + b,
      explain: `FOIL: x² + ${b}x + ${a}x + ${a * b} = x² + (${a} + ${b})x + ${a * b}. Coefficient = <strong>${a + b}</strong>.
        💡 FOIL is just the distributive law twice!` };
  }),
  S('t78', 'Find the x-intercept', 9, 'Linear relations', '📈', () => {
    const mv = ri(1, 5), x0 = ri(-6, 8);
    const b = -mv * x0;
    return { type: 'num', prompt: `What is the <strong>x-intercept</strong> of ${m(`y = ${mv}x ${b >= 0 ? '+' : MINUS} ${Math.abs(b)}`)} ?`,
      answer: x0,
      explain: `x-intercept is where y = 0: 0 = ${mv}x ${b >= 0 ? '+' : MINUS} ${Math.abs(b)} → x = <strong>${fmtNum(x0)}</strong>.` };
  }),
  S('t79', 'Rational or irrational?', 9, 'Number sense', '🔢', () => {
    const [expr, correct] = pick([
      ['√9', 'rational'], ['√5', 'irrational'], ['√16', 'rational'], ['√2', 'irrational'],
      ['0.75', 'rational'], ['π', 'irrational'], ['√7', 'irrational'], ['1/3', 'rational']
    ]);
    return { type: 'mc', prompt: `Is ${m(expr)} <strong>rational</strong> or <strong>irrational</strong>?`,
      answer: correct, choices: ['rational', 'irrational'],
      explain: `${expr} ${correct === 'rational' ? 'can be written as a fraction of integers' : 'cannot be written as a fraction — its decimal never repeats'} → <strong>${correct}</strong>.` };
  }),
  S('t80', 'Surface area of a prism', 9, 'Measurement', '📦', () => {
    const l = ri(2, 6), w = ri(2, 6), h = ri(2, 6);
    const ans = 2 * (l * w + w * h + l * h);
    return { type: 'num', prompt: `A box is ${m(`${l} × ${w} × ${h}`)} cm. What is its <strong>surface area</strong>?`,
      answer: ans,
      explain: `Three face pairs: 2(${l * w} + ${w * h} + ${l * h}) = 2 × ${l * w + w * h + l * h} = <strong>${ans} cm²</strong>.` };
  }),
  S('t81', 'Evaluate y from a line', 9, 'Linear relations', '📈', () => {
    const mv = ri(-5, 5) || 2, b = ri(-8, 8), x = ri(-4, 4);
    return { type: 'num', prompt: `For ${m(`y = ${fmtNum(mv)}x ${b >= 0 ? '+' : MINUS} ${Math.abs(b)}`)}, find y when ${m(`x = ${fmtNum(x)}`)}.`,
      answer: mv * x + b,
      explain: `Substitute: ${mv}(${fmtNum(x)}) ${b >= 0 ? '+' : MINUS} ${Math.abs(b)} = <strong>${fmtNum(mv * x + b)}</strong>.` };
  }),

  /* ================= GRADE 10 ================= */
  S('t82', 'Solve by square roots', 10, 'Quadratic equations', '🎯', () => {
    const x = ri(2, 15);
    return { type: 'num', prompt: `Solve ${m(`x² = ${x * x}`)}. Enter the <strong>positive</strong> solution.`,
      answer: x,
      explain: `💡 Square root is the inverse: x = ±√${x * x} = ±${x}. Positive solution: <strong>${x}</strong>.` };
  }),
  S('t83', 'Vertex form of a parabola', 10, 'Quadratic equations', '🎯', () => {
    const h = pick([-6, -4, -3, -2, -1, 1, 2, 3, 4, 6]);
    const k = pick([-6, -4, -3, -2, -1, 1, 2, 3, 4, 6]);
    const correct = `(${fmtNum(h)}, ${fmtNum(k)})`;
    return { type: 'mc', prompt: `What is the <strong>vertex</strong> of ${m(`y = (x ${h >= 0 ? MINUS : '+'} ${Math.abs(h)})² ${k >= 0 ? '+' : MINUS} ${Math.abs(k)}`)} ?`,
      answer: correct,
      choices: mcChoices(correct, [`(${fmtNum(-h)}, ${fmtNum(k)})`, `(${fmtNum(h)}, ${fmtNum(-k)})`, `(${fmtNum(k)}, ${fmtNum(h)})`]),
      explain: `Vertex form y = (x − h)² + k has vertex (h, k) = <strong>${correct}</strong>. (Watch the sign of h!)` };
  }),
  S('t84', 'Factor trinomials — pick the factors', 10, 'Factoring', '🧩', () => {
    const p = ri(1, 7), q = ri(1, 7);
    const correct = `(x + ${p})(x + ${q})`;
    return { type: 'mc', prompt: `Factor: ${m(`x² + ${p + q}x + ${p * q}`)}`,
      answer: correct,
      choices: mcChoices(correct, [`(x + ${p + q})(x + ${p * q})`, `(x + ${p})(x ${MINUS} ${q})`, `(x + ${p + 1})(x + ${q - 1 || 1})`]),
      explain: `Find two numbers that add to ${p + q} and multiply to ${p * q}: ${p} and ${q} → <strong>${correct}</strong>.` };
  }),
  S('t85', 'Simplify square roots', 10, 'Radicals', '📐', () => {
    const [n, a, b] = pick([[50, 5, 2], [72, 6, 2], [18, 3, 2], [45, 3, 5], [48, 4, 3]]);
    const correct = `${a}√${b}`;
    return { type: 'mc', prompt: `Simplify: ${m(`√${n}`)}`,
      answer: correct,
      choices: mcChoices(correct, [`${b}√${a}`, `${a}√${a}`, `${a * b}√2`]),
      explain: `√${n} = √(${a * a} × ${b}) = √${a * a} × √${b} = <strong>${a}√${b}</strong>. (Pull out the perfect square!)` };
  }),
  S('t86', 'Evaluate quadratic functions', 10, 'Functions', '🔁', () => {
    const a = ri(1, 4), c = ri(-5, 5), x = ri(-4, 4);
    return { type: 'num', prompt: `If ${m(`f(x) = ${a}x² ${c >= 0 ? '+' : MINUS} ${Math.abs(c)}`)}, find ${m(`f(${fmtNum(x)})`)}.`,
      answer: a * x * x + c,
      explain: `Substitute: ${a}(${fmtNum(x)})² ${c >= 0 ? '+' : MINUS} ${Math.abs(c)} = ${a}(${x * x}) ${c >= 0 ? '+' : MINUS} ${Math.abs(c)} = <strong>${fmtNum(a * x * x + c)}</strong>.` };
  }),
  S('t87', 'Elimination method idea', 10, 'Systems of equations', '🤝', () => {
    const x = ri(-5, 5), y = ri(-5, 5);
    return { type: 'num',
      prompt: `${m(`x + y = ${fmtNum(x + y)}`)} and ${m(`x − y = ${fmtNum(x - y)}`)}. If we ADD the equations, the y's cancel. What is x?`,
      answer: x,
      explain: `Adding: 2x = ${2 * x} → x = <strong>${fmtNum(x)}</strong>. 💡 Elimination works because equals + equals stay equal!` };
  }),
  S('t88', 'Exponential growth intuition', 10, 'Exponential equations', '📈', () => {
    const hours = ri(3, 5), start = pick([50, 100, 200]);
    const ans = start * Math.pow(2, hours);
    return { type: 'num', prompt: `A colony of ${m(String(start))} bacteria <strong>doubles</strong> every hour. How many after ${m(`${hours} hours`)}?`,
      answer: ans,
      explain: `Double each hour: ${start} × 2${sup(hours)} = ${start} × ${Math.pow(2, hours)} = <strong>${ans}</strong>. 💡 Growth on growth = exponentiation!` };
  }),

  /* ================= GRADE 11 ================= */
  S('t89', 'Composite functions', 11, 'Functions', '🔁', () => {
    const a = ri(2, 4), b = ri(1, 6), x = ri(1, 6);
    return { type: 'num', prompt: `If ${m(`f(x) = ${a}x`)} and ${m(`g(x) = x + ${b}`)}, find ${m(`f(g(${x}))`)}.`,
      answer: a * (x + b),
      explain: `Inside-out: g(${x}) = ${x} + ${b} = ${x + b}, then f(${x + b}) = ${a} × ${x + b} = <strong>${a * (x + b)}</strong>.` };
  }),
  S('t90', 'Evaluate piecewise functions', 11, 'Functions', '🔁', () => {
    const cut = ri(2, 5), x = ri(cut + 1, cut + 5);
    const k = ri(2, 4);
    return { type: 'mc',
      prompt: `${m(`f(x) = x² if x < ${cut}, and f(x) = ${k}x if x ≥ ${cut}`)}. What is ${m(`f(${x})`)} ?`,
      answer: String(k * x),
      choices: mcChoices(String(k * x), [String(x * x), String(k * x + cut), String(x + cut)]),
      explain: `${x} ≥ ${cut}, so use the second rule: ${k} × ${x} = <strong>${k * x}</strong>.` };
  }),
  S('t91', 'Find the missing side (trig triangles)', 11, 'Trigonometry', '📐', () => {
    const [a, b, c] = pick([[6, 8, 10], [9, 12, 15], [10, 24, 26]]);
    return { type: 'num', prompt: `A right triangle has legs ${m(String(a))} and ${m(String(b))}. Find the hypotenuse.`,
      answer: c,
      explain: `a² + b² = c²: ${a * a} + ${b * b} = ${c * c} → c = <strong>${c}</strong>. (This is the 3-4-5 family, scaled!)` };
  }),
  S('t92', 'Degrees and radians', 11, 'Trigonometry', '📐', () => {
    const [deg, correct] = pick([['180°', 'π'], ['360°', '2π'], ['90°', 'π/2'], ['270°', '3π/2'], ['60°', 'π/3'], ['45°', 'π/4']]);
    return { type: 'mc', prompt: `${m(deg)} in <strong>radians</strong> is…`,
      answer: correct,
      choices: mcChoices(correct, ['π', '2π', 'π/2', 'π/3', 'π/4', '3π/2'].filter(r => r !== correct).slice(0, 3)),
      explain: `180° = π radians, so ${deg} = <strong>${correct}</strong>.` };
  }),
  S('t93', 'Fractional exponents', 11, 'Exponents', '💪', () => {
    const [b, p, q, ans] = pick([[8, 2, 3, 4], [27, 2, 3, 9], [4, 3, 2, 8], [9, 3, 2, 27], [16, 3, 4, 8], [25, 3, 2, 125]]);
    return { type: 'num', prompt: `Evaluate: ${m(`${b}${sup(`${p}/${q}`)}`)}`,
      answer: ans,
      explain: `${b}${sup(`${p}/${q}`)} = (√${sup(q)}${b})${sup(p)} = ${Math.round(Math.pow(b, 1 / q))}${sup(p)} = <strong>${ans}</strong>.
        💡 The denominator roots, the numerator powers!` };
  }),
  S('t94', 'Sum of an arithmetic series', 11, 'Sequences and series', '🔢', () => {
    const n = pick([5, 6, 8, 10]);
    const ans = n * (n + 1) / 2;
    return { type: 'num', prompt: `${m(`1 + 2 + 3 + … + ${n} = ?`)}`,
      answer: ans,
      explain: `💡 Gauss's trick: pair ends (${1 + n}) + (${2 + n - 1}) + … = ${n + 1} each, with ${n / 2} pairs: ${n + 1} × ${n / 2} = <strong>${ans}</strong>.` };
  }),
  S('t95', 'Divide polynomials', 11, 'Polynomials', '🧬', () => {
    const p = ri(1, 5), q = ri(1, 5);
    const correct = `x + ${p}`;
    return { type: 'mc', prompt: `${m(`(x² + ${p + q}x + ${p * q}) ÷ (x + ${q}) = ?`)}`,
      answer: correct,
      choices: mcChoices(correct, [`x + ${q}`, `x ${MINUS} ${p}`, `x² + ${p}`]),
      explain: `Factor first: x² + ${p + q}x + ${p * q} = (x + ${p})(x + ${q}), then cancel (x + ${q}) → <strong>x + ${p}</strong>.` };
  }),

  /* ================= GRADE 12 ================= */
  S('t96', 'Expand logarithms', 12, 'Logarithms', '🔢', () => {
    const a = ri(2, 4);
    const correct = `${a} log x + log y`;
    return { type: 'mc', prompt: `Expand: ${m(`log(x${sup(a)}y)`)}`,
      answer: correct,
      choices: mcChoices(correct, [`${a} log x − log y`, `log x + ${a} log y`, `${a}(log x + log y)`]),
      explain: `Product rule then power rule: log(x${sup(a)}) + log(y) = <strong>${a} log x + log y</strong>.` };
  }),
  S('t97', 'Simple vs compound interest', 12, 'Financial math', '💰', () => {
    const r = pick([5, 10]), t = ri(2, 3);
    const P = 1000;
    const simple = P + P * r / 100 * t;
    const compound = Number((P * Math.pow(1 + r / 100, t)).toFixed(2));
    return { type: 'mc',
      prompt: `${m('$1000')} at ${m(`${r}%/year`)} for ${m(`${t} years`)}: simple interest gives $${simple}, compound gives $${compound}. Which earns more?`,
      answer: 'compound interest',
      choices: ['compound interest', 'simple interest', 'they are equal'],
      explain: `Compound adds interest ON TOP of interest: $${compound} > $${simple}. 💡 The gap grows exponentially over time!` };
  }),
  S('t98', 'Sum of a geometric series', 12, 'Sequences', '🔢', () => {
    const r = 2, n = ri(4, 6);
    const terms = Array.from({ length: n }, (_, i) => Math.pow(r, i));
    const ans = terms.reduce((a, b) => a + b, 0);
    return { type: 'num', prompt: `${m(terms.join(' + ') + ' = ?')}`,
      answer: ans,
      explain: `Doubling series sum trick: total = last × 2 − 1 = ${terms[n - 1]} × 2 − 1 = <strong>${ans}</strong>.` };
  }),
  S('t99', 'Limits intuition', 12, 'Limits', '∞', () => {
    const [expr, correct] = pick([
      ['1/x as x grows huge', '0'],
      ['(2x + 1)/x as x grows huge', '2'],
      ['1/x² as x grows huge', '0']
    ]);
    return { type: 'mc', prompt: `What does ${m(expr)} approach?`,
      answer: correct, choices: mcChoices(correct, ['0', '1', '2', '∞']),
      explain: `Think of big values: at x = 1 000 000 the value is essentially <strong>${correct}</strong>.` };
  }),
  S('t100', 'Probability with two dice', 12, 'Probability', '🎲', () => {
    const [sum, count] = pick([[7, 6], [6, 5], [8, 5], [11, 2], [12, 1], [2, 1]]);
    const correct = `${count}/36`;
    return { type: 'mc', prompt: `Two fair dice are rolled. What is <strong>P(sum = ${sum})</strong>?`,
      answer: correct,
      choices: mcChoices(correct, [`${count + 1}/36`, `${count}/12`, `1/${sum}`]),
      explain: `There are 36 equally likely outcomes, and ${count} give a sum of ${sum} → <strong>${count}/36</strong>.` };
  }),
  S('t101', 'Permutations', 12, 'Counting', '🔢', () => {
    const n = ri(3, 5);
    const ans = [1, 1, 2, 6, 24, 120][n];
    return { type: 'num', prompt: `In how many ways can ${m(String(n))} students line up in a row?`,
      answer: ans,
      explain: `First spot: ${n} choices, next: ${n - 1}, … → ${n}! = ${Array.from({ length: n }, (_, i) => n - i).join(' × ')} = <strong>${ans}</strong>.` };
  }),
  S('t102', 'The imaginary unit i', 12, 'Complex numbers', '✨', () => {
    return { type: 'mc', prompt: `${m('i² = ?')}`,
      answer: MINUS + '1',
      choices: mcChoices(MINUS + '1', ['1', 'i', MINUS + 'i']),
      explain: `i is <em>defined</em> as the square root of ${MINUS}1, so i² = <strong>${MINUS}1</strong>.` };
  }),
  S('t103', 'Add complex numbers', 12, 'Complex numbers', '✨', () => {
    const a = ri(1, 6), b = ri(1, 6), c = ri(1, 6), d = ri(1, 6);
    const correct = `${a + c} + ${b + d}i`;
    return { type: 'mc', prompt: `${m(`(${a} + ${b}i) + (${c} + ${d}i) = ?`)}`,
      answer: correct,
      choices: mcChoices(correct, [`${a + c} + ${b * d}i`, `${a + c + 1} + ${b + d}i`, `${a + c} + ${b + d + 1}i`]),
      explain: `Add real parts and imaginary parts separately (like combining like terms!): <strong>${correct}</strong>.` };
  })
];
