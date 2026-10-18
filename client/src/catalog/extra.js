/* ============================================================
   LearnAce — expansion skills (Grades 1–12), flat list with
   grade/section inline. Emphasis: UNDERSTANDING over rote —
   inverse operations, fact families, number bonds, and the
   commutative / associative / distributive laws.
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
const MINUS = '−';
const fmtNum = n => String(n).replace('-', MINUS);
function mcChoices(correct, distractors) {
  const set = [correct];
  for (const d of distractors) if (!set.includes(d)) set.push(d);
  return shuffle(set);
}
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

export const EXTRA_SKILLS = [
  /* ================= GRADE 1 ================= */
  {
    id: 'elCNT2', title: 'Count forward and backward', grade: 1, section: 'Counting and patterns', icon: '🔢',
    gen() {
      const n = ri(2, 98), fwd = pick([true, false]);
      return {
        type: 'num',
        prompt: fwd ? `What number comes <strong>just after</strong> ${m(String(n))}?`
                    : `What number comes <strong>just before</strong> ${m(String(n))}?`,
        answer: fwd ? n + 1 : n - 1,
        explain: fwd ? `Counting forward one step: ${n} → <strong>${n + 1}</strong>.`
                     : `Counting backward one step: ${n} → <strong>${n - 1}</strong>.`
      };
    }
  },
  {
    id: 'elBND1', title: 'Number bonds to 10', grade: 1, section: 'Addition', icon: '➕',
    gen() {
      const a = ri(1, 9), ans = 10 - a;
      return {
        type: 'num',
        prompt: `${m(`${a} + ___ = 10`)} — what number fills the blank?`,
        answer: ans,
        explain: `Think of 10 as two parts: ${a} and ${ans} together make 10.<br>
          💡 <em>Inverse idea:</em> 10 − ${a} = <strong>${ans}</strong>.`
      };
    }
  },
  {
    id: 'elFAM1', title: 'Fact families (add & subtract)', grade: 1, section: 'Subtraction', icon: '➖',
    gen() {
      const b = ri(2, 9), c = ri(2, 9);
      const a = b + c;
      return {
        type: 'num',
        prompt: `If ${m(`${b} + ${c} = ${a}`)}, then ${m(`${a} − ${c} = ?`)}`,
        answer: b,
        explain: `Addition and subtraction are <em>inverse</em> operations — they undo each other!<br>
          ${b} + ${c} = ${a}, so ${a} − ${c} = <strong>${b}</strong>.`
      };
    }
  },
  {
    id: 'elSYM1', title: 'Compare with >, <, =', grade: 1, section: 'Comparing', icon: '⚖️',
    gen() {
      let a = ri(5, 99), b = ri(5, 99);
      if (pick([true, false]) && a !== b) [a, b] = [b, a];
      const correct = a > b ? '>' : a < b ? '<' : '=';
      return {
        type: 'mc',
        prompt: `${m(`${a} ___ ${b}`)} — which symbol belongs in the blank?`,
        answer: correct,
        choices: ['>', '<', '='],
        explain: `${a} is ${a > b ? 'greater than' : a < b ? 'less than' : 'equal to'} ${b}, so the answer is <strong>${correct}</strong>.
          The symbol always opens toward the bigger number!`
      };
    }
  },
  {
    id: 'elPLG1', title: 'Tens and ones', grade: 1, section: 'Place value', icon: '🧱',
    gen() {
      const t = ri(1, 9), o = ri(1, 9);
      return {
        type: 'num',
        prompt: `${m(`${t * 10 + o} = ___ tens and ${o} ones`)} — how many tens?`,
        answer: t,
        explain: `${t * 10 + o} = ${t} tens + ${o} ones = ${t * 10} + ${o}. The answer is <strong>${t}</strong>.`
      };
    }
  },

  /* ================= GRADE 2 ================= */
  {
    id: 'elEXP2', title: 'Expanded form', grade: 2, section: 'Place value', icon: '🧱',
    gen() {
      const n = ri(101, 999);
      const h = Math.floor(n / 100) * 100, t = Math.floor((n % 100) / 10) * 10, o = n % 10;
      const miss = pick([h, t, o]);
      const parts = [h, t, o].map(v => v === miss ? '___' : v);
      return {
        type: 'num',
        prompt: `${m(`${n} = ${parts[0]} + ${parts[1]} + ${parts[2]}`)} — fill in the blank.`,
        answer: miss,
        explain: `${n} = ${h} (hundreds) + ${t} (tens) + ${o} (ones). The missing part is <strong>${miss}</strong>.`
      };
    }
  },
  {
    id: 'elADD3', title: 'Add three numbers (make a ten!)', grade: 2, section: 'Addition and subtraction', icon: '➕',
    gen() {
      const a = pick([3, 4, 6, 7, 8, 9]);
      const b = 10 - a;                     // make a ten first
      const c = ri(2, 9);
      const nums = shuffle([a, b, c]);
      const ans = 10 + c;
      return {
        type: 'num',
        prompt: `${m(`${nums[0]} + ${nums[1]} + ${nums[2]} = ?`)}`,
        answer: ans,
        explain: `💡 Smart strategy: find the ten first! ${a} + ${b} = 10, then 10 + ${c} = <strong>${ans}</strong>.<br>
          Adding in any order gives the same answer (<em>commutative &amp; associative laws</em>).`
      };
    }
  },
  {
    id: 'elMIS2', title: 'Missing addend', grade: 2, section: 'Addition and subtraction', icon: '➕',
    gen() {
      const b = ri(11, 60), ans = ri(11, 39);
      const total = b + ans;
      return {
        type: 'num',
        prompt: `${m(`___ + ${b} = ${total}`)} — what number is missing?`,
        answer: ans,
        explain: `💡 Use the <em>inverse</em>: ${total} − ${b} = <strong>${ans}</strong>.<br>
          Check: ${ans} + ${b} = ${total} ✓`
      };
    }
  },
  {
    id: 'elEVN2', title: 'Even or odd', grade: 2, section: 'Patterns', icon: '🔁',
    gen() {
      const n = ri(2, 99);
      const correct = n % 2 === 0 ? 'even' : 'odd';
      return {
        type: 'mc',
        prompt: `Is ${m(String(n))} <strong>even</strong> or <strong>odd</strong>?`,
        answer: correct,
        choices: ['even', 'odd'],
        explain: `Look at the ones digit (${n % 10}): ${n % 2 === 0 ? 'it splits into equal pairs' : 'one is left over'} — ${n} is <strong>${correct}</strong>.`
      };
    }
  },
  {
    id: 'elWPB2', title: 'Addition & subtraction word problems', grade: 2, section: 'Word problems', icon: '🌍',
    gen() {
      const a = ri(15, 80), b = ri(8, a - 5);
      const give = pick([true, false]);
      return {
        type: 'num',
        prompt: give
          ? `Sam had ${m(String(a))} stickers and gave away ${m(String(b))}. How many stickers are left?`
          : `Mia has ${m(String(a))} stickers. She gets ${m(String(b))} more. How many does she have now?`,
        answer: give ? a - b : a + b,
        explain: give
          ? `"Gave away" means subtract: ${a} − ${b} = <strong>${a - b}</strong> stickers.`
          : `"Gets more" means add: ${a} + ${b} = <strong>${a + b}</strong> stickers.`
      };
    }
  },

  /* ================= GRADE 3 ================= */
  {
    id: 'elARR3', title: 'Multiplication with arrays', grade: 3, section: 'Multiplication', icon: '✖️',
    gen() {
      const r = ri(2, 6), c = ri(2, 6);
      return {
        type: 'num',
        prompt: `A row of desks is arranged in ${m(String(r))} rows with ${m(String(c))} desks in each row. How many desks in all?`,
        answer: r * c,
        explain: `An array with ${r} rows of ${c}: count row by row — ${Array(r).fill(c).join(' + ')} = <strong>${r * c}</strong>.<br>
          💡 Same answer as ${c} rows of ${r} — that's the <em>commutative law</em>: ${r} × ${c} = ${c} × ${r}!`
      };
    }
  },
  {
    id: 'elDIN3', title: 'Division undoes multiplication', grade: 3, section: 'Division', icon: '➗',
    gen() {
      const b = ri(2, 9), q = ri(2, 9);
      const a = b * q;
      const correct = `${b} × ${q} = ${a}`;
      return {
        type: 'mc',
        prompt: `${m(`${a} ÷ ${b} = ${q}`)} is true <strong>because</strong>…`,
        answer: correct,
        choices: mcChoices(correct, [`${a} × ${b} = ${q}`, `${a} − ${b} = ${q}`, `${b} + ${q} = ${a}`]),
        explain: `Division is the <em>inverse</em> of multiplication: it asks "what times ${b} makes ${a}?"<br>
          ${b} × ${q} = ${a}, so ${a} ÷ ${b} = ${q}.`
      };
    }
  },
  {
    id: 'elFCP3', title: 'Compare unit fractions', grade: 3, section: 'Fractions', icon: '🍕',
    gen() {
      let a = ri(2, 9), b = ri(2, 9);
      while (b === a) b = ri(2, 9);
      const correct = `1/${Math.min(a, b)}`;
      return {
        type: 'mc',
        prompt: `Which is <strong>bigger</strong>: ${m(`1/${a}`)} or ${m(`1/${b}`)} ?`,
        answer: correct,
        choices: [`1/${a}`, `1/${b}`],
        explain: `Both are one piece — but splitting into ${Math.min(a, b)} parts gives <em>bigger</em> pieces than ${Math.max(a, b)} parts.<br>
          Bigger denominator → smaller piece! So <strong>${correct}</strong> is bigger.`
      };
    }
  },
  {
    id: 'elPER3', title: 'Perimeter by adding sides', grade: 3, section: 'Geometry', icon: '📐',
    gen() {
      const sides = [ri(2, 9), ri(2, 9), ri(2, 9)];
      if (pick([true, false])) sides.push(ri(2, 9));
      const ans = sides.reduce((x, y) => x + y, 0);
      return {
        type: 'num',
        prompt: `A ${sides.length === 3 ? 'triangle' : 'four-sided shape'} has sides ${m(sides.join(' cm, ') + ' cm')}. What is its <strong>perimeter</strong>?`,
        answer: ans,
        explain: `Perimeter = distance around the outside = ${sides.join(' + ')} = <strong>${ans} cm</strong>.`
      };
    }
  },
  {
    id: 'elDIS3', title: 'Break apart to multiply', grade: 3, section: 'Number relationships', icon: '🔗',
    gen() {
      const a = ri(3, 9), b = ri(6, 9);
      const split = 5;
      const ans = b - split;
      return {
        type: 'num',
        prompt: `${m(`${a} × ${b} = ${a} × ${split} + ${a} × ___`)} — fill in the blank.`,
        answer: ans,
        explain: `💡 <em>Distributive law:</em> split ${b} into ${split} + ${ans}:
          ${a} × ${b} = ${a} × (${split} + ${ans}) = ${a * split} + ${a * ans} = <strong>${a * b}</strong>.`
      };
    }
  },

  /* ================= GRADE 4 ================= */
  {
    id: 'elARE4', title: 'Multiply with an area model', grade: 4, section: 'Multiplication and division', icon: '✖️',
    gen() {
      const a = ri(13, 49), b = ri(3, 9);
      const tens = Math.floor(a / 10) * 10, ones = a % 10;
      return {
        type: 'num',
        prompt: `${m(`${a} × ${b} = (${tens} × ${b}) + (${ones} × ${b}) = ?`)}`,
        answer: a * b,
        explain: `The rectangle ${a} × ${b} splits into two smaller ones (distributive law!):<br>
          ${tens} × ${b} = ${tens * b} and ${ones} × ${b} = ${ones * b}, so ${tens * b} + ${ones * b} = <strong>${a * b}</strong>.`
      };
    }
  },
  {
    id: 'elFCM4', title: 'Compare fractions', grade: 4, section: 'Fractions', icon: '🍕',
    gen() {
      if (pick([true, false])) {
        const d = pick([6, 8, 9, 10, 12]);
        let n1 = ri(1, d - 1), n2 = ri(1, d - 1);
        while (n2 === n1) n2 = ri(1, d - 1);
        const correct = `${Math.max(n1, n2)}/${d}`;
        return {
          type: 'mc',
          prompt: `Which is <strong>greater</strong>: ${m(`${n1}/${d}`)} or ${m(`${n2}/${d}`)} ?`,
          answer: correct,
          choices: [`${n1}/${d}`, `${n2}/${d}`],
          explain: `Same-size pieces (same denominator): more pieces wins. ${Math.max(n1, n2)} > ${Math.min(n1, n2)}, so <strong>${correct}</strong>.`
        };
      }
      const pair = pick([['1/2', '1/3'], ['1/2', '2/3'], ['1/4', '1/3'], ['2/5', '1/2']]);
      const [x, y] = shuffle(pair);
      const [xn, xd] = x.split('/').map(Number);
      const [yn, yd] = y.split('/').map(Number);
      const correct = (xn * yd > yn * xd) ? x : y;
      return {
        type: 'mc',
        prompt: `Which is <strong>greater</strong>: ${m(x)} or ${m(y)} ?`,
        answer: correct,
        choices: [x, y],
        explain: `Compare to ½ or use common pieces: <strong>${correct}</strong> is greater.`
      };
    }
  },
  {
    id: 'elFAC4', title: 'Find factors', grade: 4, section: 'Number theory', icon: '🧮',
    gen() {
      const n = pick([12, 18, 24, 30, 36, 40, 48]);
      const factors = Array.from({ length: n }, (_, i) => i + 1).filter(d => n % d === 0);
      const nonFactors = Array.from({ length: n - 1 }, (_, i) => i + 2).filter(d => n % d !== 0 && !factors.includes(d));
      const correct = String(pick(factors.filter(f => f > 1 && f < n)));
      return {
        type: 'mc',
        prompt: `Which of these is a <strong>factor</strong> of ${m(String(n))}?`,
        answer: correct,
        choices: mcChoices(correct, shuffle(nonFactors).slice(0, 3).map(String)),
        explain: `${correct} divides ${n} exactly: ${n} ÷ ${correct} = ${n / Number(correct)} — no remainder. So <strong>${correct}</strong> is a factor.`
      };
    }
  },
  {
    id: 'elANG4', title: 'Types of angles', grade: 4, section: 'Geometry', icon: '📐',
    gen() {
      const kinds = [
        ['acute', () => ri(10, 89), 'less than 90°'],
        ['right', () => 90, 'exactly 90°'],
        ['obtuse', () => ri(91, 179), 'between 90° and 180°']
      ];
      const [correct, genDeg, why] = pick(kinds);
      const deg = genDeg();
      return {
        type: 'mc',
        prompt: `An angle measures ${m(`${deg}°`)}. What kind of angle is it?`,
        answer: correct,
        choices: ['acute', 'right', 'obtuse'],
        explain: `${deg}° is ${why} — that makes it <strong>${correct}</strong>.`
      };
    }
  },

  /* ================= GRADE 5 ================= */
  {
    id: 'elDPV5', title: 'Decimal place value', grade: 5, section: 'Decimals', icon: '🔟',
    gen() {
      const n = ri(11, 99) / 10;   // 1.1–9.9
      const digit = Math.round((n * 10) % 10);
      return {
        type: 'num',
        prompt: `In ${m(n.toFixed(1))}, what is the value of the digit <strong>${digit}</strong> (the tenths place)?`,
        answer: Number((digit / 10).toFixed(1)),
        explain: `The tenths place counts tenths: ${digit} tenths = <strong>${(digit / 10).toFixed(1)}</strong>.`
      };
    }
  },
  {
    id: 'elFXW5', title: 'Multiply a fraction by a whole number', grade: 5, section: 'Fractions of numbers', icon: '🍕',
    gen() {
      const d = pick([3, 4, 5, 6, 8]);
      const whole = d * ri(1, 5);
      const n = ri(1, d - 1);
      const ans = n * (whole / d);
      return {
        type: 'num',
        prompt: `${m(`${n}/${d} × ${whole} = ?`)}`,
        answer: ans,
        explain: `${n}/${d} × ${whole} = (${n} × ${whole}) ÷ ${d} = ${n * whole} ÷ ${d} = <strong>${ans}</strong>.<br>
          💡 Same as "${n}/${d} of ${whole}"!`
      };
    }
  },
  {
    id: 'elDXW5', title: 'Multiply decimals by whole numbers', grade: 5, section: 'Decimals', icon: '🔟',
    gen() {
      const d = ri(11, 99) / 10, w = ri(2, 9);
      const ans = Number((d * w).toFixed(1));
      return {
        type: 'num',
        prompt: `${m(`${d.toFixed(1)} × ${w} = ?`)}`,
        answer: ans,
        explain: `Multiply like whole numbers, then place the decimal: ${Math.round(d * 10)} × ${w} = ${Math.round(d * 10) * w} → one decimal place → <strong>${fmtNum(ans)}</strong>.`
      };
    }
  },
  {
    id: 'elUNT5', title: 'Convert metric units', grade: 5, section: 'Measurement', icon: '📦',
    gen() {
      const t = pick([
        ['cm', 'm', 100], ['mm', 'cm', 10], ['m', 'km', 1000], ['g', 'kg', 1000], ['mL', 'L', 1000]
      ]);
      const [small, big, factor] = t;
      const whole = ri(2, 20);
      const val = whole * factor;
      return {
        type: 'num',
        prompt: `${m(`${val} ${small}`)} = how many ${m(big)}?`,
        answer: whole,
        explain: `${factor} ${small} make 1 ${big}. So ${val} ÷ ${factor} = <strong>${whole} ${big}</strong>.<br>
          💡 Converting to a bigger unit uses the <em>inverse</em>: divide!`
      };
    }
  },

  /* ================= GRADE 6 ================= */
  {
    id: 'elICO6', title: 'Compare integers', grade: 6, section: 'Integers', icon: '🌡️',
    gen() {
      let a = ri(-20, 20), b = ri(-20, 20);
      while (b === a) b = ri(-20, 20);
      const correct = fmtNum(Math.max(a, b));
      return {
        type: 'mc',
        prompt: `Which is <strong>greater</strong>: ${m(fmtNum(a))} or ${m(fmtNum(b))} ?`,
        answer: correct,
        choices: [fmtNum(a), fmtNum(b)],
        explain: `On the number line, greater means farther RIGHT. ${correct} is right of ${fmtNum(Math.min(a, b))}, so <strong>${correct}</strong>.<br>
          💡 Remember: ${MINUS}2 is greater than ${MINUS}9!`
      };
    }
  },
  {
    id: 'elABS6', title: 'Absolute value', grade: 6, section: 'Integers', icon: '🌡️',
    gen() {
      const n = ri(-20, 20) || -7;
      return {
        type: 'num',
        prompt: `${m(`|${fmtNum(n)}| = ?`)}`,
        answer: Math.abs(n),
        explain: `Absolute value = distance from zero. |${fmtNum(n)}| = <strong>${Math.abs(n)}</strong>.`
      };
    }
  },
  {
    id: 'elERQ6', title: 'Equivalent ratios', grade: 6, section: 'Ratios and rates', icon: '🚗',
    gen() {
      const a = ri(1, 9), b = ri(a + 1, 12);
      const k = ri(2, 5);
      return {
        type: 'num',
        prompt: `${m(`${a}:${b} = ___:${b * k}`)} — fill in the blank.`,
        answer: a * k,
        explain: `Both sides of the ratio grew by ×${k}: ${a} × ${k} = <strong>${a * k}</strong>.<br>
          💡 Equivalent ratios stay equivalent because we multiply both parts by the same number.`
      };
    }
  },
  {
    id: 'elMIS6', title: 'Mean: find the missing number', grade: 6, section: 'Statistics', icon: '📊',
    gen() {
      const mean = ri(4, 12);
      const nums = [ri(1, 15), ri(1, 15), ri(1, 15)];
      const missing = 4 * mean - nums.reduce((x, y) => x + y, 0);
      return {
        type: 'num',
        prompt: `The mean of ${m(`${nums.join(', ')}, ?`)} is ${m(String(mean))}. Find the missing number.`,
        answer: missing,
        explain: `💡 Undo the mean (inverse!): total = mean × count = ${mean} × 4 = ${4 * mean}.<br>
          Known numbers add to ${nums.reduce((x, y) => x + y, 0)}, so the missing one is ${4 * mean} − ${nums.reduce((x, y) => x + y, 0)} = <strong>${missing}</strong>.`
      };
    }
  },
  {
    id: 'elPRO6', title: 'Distributive property with variables', grade: 6, section: 'Expressions', icon: '🧮',
    gen() {
      const a = ri(2, 9), b = ri(1, 9);
      return {
        type: 'num',
        prompt: `${m(`${a}(x + ${b}) = ${a}x + ___`)} — fill in the blank.`,
        answer: a * b,
        explain: `💡 <em>Distributive law:</em> ${a} multiplies BOTH terms inside the brackets:
          ${a} × x = ${a}x and ${a} × ${b} = <strong>${a * b}</strong>.`
      };
    }
  },

  /* ================= GRADE 7 ================= */
  {
    id: 'elWRE7', title: 'Write expressions from words', grade: 7, section: 'Expressions', icon: '🧮',
    gen() {
      const a = ri(2, 6), b = ri(1, 9);
      const forms = [
        [`${b} more than ${a === 2 ? 'twice' : `${a} times`} a number`, `${a}x + ${b}`, [`${a}x − ${b}`, `${a}(x + ${b})`, `${b}x + ${a}`]],
        [`${b} less than ${a === 2 ? 'twice' : `${a} times`} a number`, `${a}x − ${b}`, [`${a}x + ${b}`, `${b} − ${a}x`, `${a}(x − ${b})`]]
      ];
      const [words, correct, wrong] = pick(forms);
      return {
        type: 'mc',
        prompt: `Write as an expression: "${m(words)}"`,
        answer: correct,
        choices: mcChoices(correct, wrong),
        explain: `"${words}" → ${a} × x ${words.includes('more') ? '+' : MINUS} ${b} = <strong>${correct}</strong>.`
      };
    }
  },
  {
    id: 'elSQR7', title: 'Square roots of perfect squares', grade: 7, section: 'Exponents', icon: '💪',
    gen() {
      const n = ri(2, 15);
      return {
        type: 'num',
        prompt: `${m(`√${n * n} = ?`)}`,
        answer: n,
        explain: `💡 Square root is the <em>inverse</em> of squaring: ${n}² = ${n * n}, so √${n * n} = <strong>${n}</strong>.`
      };
    }
  },
  {
    id: 'elLAW7', title: 'Name the law of operations', grade: 7, section: 'Number relationships', icon: '🔗',
    gen() {
      const laws = [
        ['commutative', `${ri(2, 9)} + ${ri(2, 9)} = ${ri(2, 9)} + ${ri(2, 9)}`, null],
        ['associative', `(2 + 3) + 4 = 2 + (3 + 4)`, 'regrouping'],
        ['distributive', `${ri(2, 5)} × (${ri(2, 9)} + ${ri(2, 9)}) = … × … + … × …`, 'spreading over both parts']
      ];
      const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9);
      const kind = pick(['commutative', 'associative', 'distributive']);
      const examples = {
        commutative: `${a} + ${b} = ${b} + ${a}`,
        associative: `(${a} + ${b}) + ${c} = ${a} + (${b} + ${c})`,
        distributive: `${a} × (${b} + ${c}) = ${a} × ${b} + ${a} × ${c}`
      };
      const whys = {
        commutative: 'the ORDER doesn\'t matter when adding or multiplying',
        associative: 'the GROUPING doesn\'t matter when adding or multiplying',
        distributive: 'multiplication SPREADS over addition — each part gets multiplied'
      };
      return {
        type: 'mc',
        prompt: `Which law does this show? ${m(examples[kind])}`,
        answer: kind,
        choices: mcChoices(kind, ['commutative', 'associative', 'distributive']),
        explain: `<strong>${kind[0].toUpperCase() + kind.slice(1)} law</strong>: ${whys[kind]}.`
      };
    }
  },
  {
    id: 'elPRP7', title: 'Solve proportions', grade: 7, section: 'Ratios and rates', icon: '🚗',
    gen() {
      const a = ri(1, 6), b = ri(a + 1, 9);
      const k = ri(2, 4);
      return {
        type: 'num',
        prompt: `${m(`x/${a} = ${b * k}/${a * k}`)} — what is x?`,
        answer: b,
        explain: `The two ratios are equal, so they must be equivalent: ${b * k}/${a * k} is just ${b}/${a} scaled by ${k}.<br>
          x = <strong>${b}</strong>. (Same ratio → same value!)`
      };
    }
  },

  /* ================= GRADE 8 ================= */
  {
    id: 'elDST8', title: 'Equations with the distributive property', grade: 8, section: 'Equations', icon: '🔀',
    gen() {
      const a = ri(2, 6), x = ri(1, 8), b = ri(1, 9);
      const c = a * (x + b);
      return {
        type: 'num',
        prompt: `Solve for x: ${m(`${a}(x + ${b}) = ${c}`)}`,
        answer: x,
        explain: `Distribute first: ${a}x + ${a * b} = ${c}.<br>
          Then undo: ${a}x = ${c - a * b} → x = <strong>${x}</strong>.<br>
          💡 Or divide both sides by ${a} first: x + ${b} = ${c / a} (inverse operations!).`
      };
    }
  },
  {
    id: 'elGRD8', title: 'Graph inequalities on a number line', grade: 8, section: 'Inequalities', icon: '⚖️',
    gen() {
      const n = ri(-5, 9);
      const forms = [
        [`x > ${fmtNum(n)}`, `open circle at ${fmtNum(n)}, shaded to the RIGHT`, 'greater than means everything right of the point; open circle because the point itself is NOT included'],
        [`x ≤ ${fmtNum(n)}`, `closed (filled) circle at ${fmtNum(n)}, shaded to the LEFT`, 'less than or equal: shade left, and the point IS included (closed circle)']
      ];
      const [ineq, correct, why] = pick(forms);
      return {
        type: 'mc',
        prompt: `Which number line shows ${m(ineq)} ?`,
        answer: correct,
        choices: mcChoices(correct, [
          `open circle at ${fmtNum(n)}, shaded to the LEFT`,
          `closed (filled) circle at ${fmtNum(n)}, shaded to the RIGHT`,
          `closed (filled) circle at ${fmtNum(n + 1)}, shaded to the RIGHT`
        ]),
        explain: `${ineq}: ${why}.`
      };
    }
  },
  {
    id: 'elSLE8', title: 'Slope from an equation', grade: 8, section: 'Linear relations', icon: '📈',
    gen() {
      const mVal = ri(-6, 6) || 3, b = ri(-9, 9);
      return {
        type: 'num',
        prompt: `What is the <strong>slope</strong> of the line ${m(`y = ${mVal === 1 ? 'x' : fmtNum(mVal) + 'x'} ${b >= 0 ? '+ ' + b : MINUS + ' ' + Math.abs(b)}`)} ?`,
        answer: mVal,
        explain: `In y = mx + b, the slope is m — the number multiplying x. Here m = <strong>${fmtNum(mVal)}</strong>.`
      };
    }
  },
  {
    id: 'elPYT8', title: 'Pythagorean theorem', grade: 8, section: 'Geometry', icon: '📐',
    gen() {
      const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25]]);
      return {
        type: 'num',
        prompt: `A right triangle has legs ${m(`${a} cm`)} and ${m(`${b} cm`)}. What is the <strong>hypotenuse</strong>?`,
        answer: c,
        explain: `a² + b² = c²: ${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c}, and √${c * c} = <strong>${c}</strong> cm.<br>
          💡 Square root undoes the square (inverse!).`
      };
    }
  },
  {
    id: 'elANR8', title: 'Complementary & supplementary angles', grade: 8, section: 'Geometry', icon: '📐',
    gen() {
      const comp = pick([true, false]);
      const target = comp ? 90 : 180;
      const a = ri(15, target - 15);
      const ans = target - a;
      return {
        type: 'num',
        prompt: comp
          ? `What angle is <strong>complementary</strong> to ${m(`${a}°`)}?`
          : `What angle is <strong>supplementary</strong> to ${m(`${a}°`)}?`,
        answer: ans,
        explain: `${comp ? 'Complementary angles add to 90°' : 'Supplementary angles add to 180°'}: ${target} − ${a} = <strong>${ans}°</strong>.`
      };
    }
  },

  /* ================= GRADE 9 ================= */
  {
    id: 'elPLY9', title: 'Add polynomials (like terms)', grade: 9, section: 'Polynomials', icon: '🧬',
    gen() {
      const a = ri(1, 6), b = ri(-6, 6) || 3, c = ri(1, 6), d = ri(-6, 6) || -2;
      const A = a + c, B = b + d;
      const correct = `${A}x² ${B >= 0 ? '+' : MINUS} ${Math.abs(B)}x`;
      return {
        type: 'mc',
        prompt: `Simplify: ${m(`(${a}x² ${b >= 0 ? '+' : MINUS} ${Math.abs(b)}x) + (${c}x² ${d >= 0 ? '+' : MINUS} ${Math.abs(d)}x)`)}`,
        answer: correct,
        choices: mcChoices(correct, [
          `${a + c}x² ${(B + 1) >= 0 ? '+' : MINUS} ${Math.abs(B + 1)}x`,
          `${Math.max(a + c + 1, a + c - 1)}x² ${B >= 0 ? '+' : MINUS} ${Math.abs(B)}x`,
          `${A}x² ${(B - 1) >= 0 ? '+' : MINUS} ${Math.abs(B - 1)}x`
        ]),
        explain: `Combine like terms: x²-terms: ${a} + ${c} = ${A}; x-terms: ${b} + (${d}) = ${B}.<br>
          💡 You can regroup freely — the commutative &amp; associative laws at work!`
      };
    }
  },
  {
    id: 'elMON9', title: 'Multiply monomials', grade: 9, section: 'Exponent rules', icon: '🧬',
    gen() {
      const a = ri(2, 6), b = ri(2, 6), p = ri(1, 4), q = ri(1, 4);
      return {
        type: 'num',
        prompt: `${m(`${a}x${sup(p)} · ${b}x${sup(q)} = ${a * b}x`)}${sup('?')} — what is the missing exponent?`,
        answer: p + q,
        explain: `Coefficients multiply (${a} × ${b} = ${a * b}); same-base powers ADD exponents: ${p} + ${q} = <strong>${p + q}</strong>.`
      };
    }
  },
  {
    id: 'elWLE9', title: 'Write y = mx + b from slope and intercept', grade: 9, section: 'Linear relations', icon: '📈',
    gen() {
      const mVal = ri(-5, 5) || 2, b = ri(-9, 9) || 3;
      const correct = `y = ${fmtNum(mVal)}x ${b >= 0 ? '+' : MINUS} ${Math.abs(b)}`;
      return {
        type: 'mc',
        prompt: `A line has slope ${m(fmtNum(mVal))} and y-intercept ${m(fmtNum(b))}. Its equation is…`,
        answer: correct,
        choices: mcChoices(correct, [
          `y = ${fmtNum(b)}x ${mVal >= 0 ? '+' : MINUS} ${Math.abs(mVal)}`,
          `y = ${fmtNum(mVal)}x ${b >= 0 ? MINUS : '+'} ${Math.abs(b)}`,
          `y = ${fmtNum(mVal + 1)}x ${b >= 0 ? '+' : MINUS} ${Math.abs(b)}`
        ]),
        explain: `y = mx + b: plug in m = ${fmtNum(mVal)} and b = ${fmtNum(b)} → <strong>${correct}</strong>.`
      };
    }
  },

  /* ================= GRADE 10 ================= */
  {
    id: 'elVIE10', title: 'Sum and product of roots', grade: 10, section: 'Quadratic equations', icon: '🎯',
    gen() {
      let p = ri(-7, 7), q = ri(-7, 7);
      while (q === p) q = ri(-7, 7);
      const b = -(p + q), c = p * q;
      const correct = `${fmtNum(-b)} and ${fmtNum(c)}`;
      return {
        type: 'mc',
        prompt: `The solutions of ${m(`x² ${b >= 0 ? '+' : MINUS} ${Math.abs(b)}x ${c >= 0 ? '+' : MINUS} ${Math.abs(c)} = 0`)} add to ___ and multiply to ___.`,
        answer: correct,
        choices: mcChoices(correct, [`${fmtNum(b)} and ${fmtNum(c)}`, `${fmtNum(-b)} and ${fmtNum(-c)}`, `${fmtNum(c)} and ${fmtNum(-b)}`]),
        explain: `For x² + bx + c = 0 the roots add to ${MINUS}b and multiply to c (Vieta's rules!):<br>
          add to <strong>${fmtNum(-b)}</strong>, multiply to <strong>${fmtNum(c)}</strong>.`
      };
    }
  },
  {
    id: 'elDIF10', title: 'Factor a difference of squares', grade: 10, section: 'Factoring', icon: '🧩',
    gen() {
      const n = ri(2, 12);
      const correct = `(x ${MINUS} ${n})(x + ${n})`;
      return {
        type: 'mc',
        prompt: `Factor: ${m(`x² ${MINUS} ${n * n}`)}`,
        answer: correct,
        choices: mcChoices(correct, [`(x + ${n})(x + ${n})`, `(x ${MINUS} ${n})(x ${MINUS} ${n})`, `(x ${MINUS} ${n * n})(x + 1)`]),
        explain: `x² ${MINUS} ${n * n} = x² ${MINUS} ${n}² — a difference of squares factors as (x ${MINUS} ${n})(x + ${n}).<br>
          💡 Check by distributing back: x² + ${n}x ${MINUS} ${n}x ${MINUS} ${n * n} — the middle terms cancel (inverse signs!).`
      };
    }
  },
  {
    id: 'elCMF10', title: 'Factor out a common factor', grade: 10, section: 'Factoring', icon: '🧩',
    gen() {
      const g = ri(2, 6), a = ri(1, 6), b = ri(1, 6);
      const correct = `${a}x + ${b}`;
      return {
        type: 'mc',
        prompt: `${m(`${g * a}x + ${g * b} = ${g}( ___)`)} — fill in the blank.`,
        answer: correct,
        choices: mcChoices(correct, [`${a}x ${MINUS} ${b}`, `${a + g}x + ${b}`, `${a}x + ${b + g}`]),
        explain: `💡 The distributive law in reverse! Divide each term by ${g}: ${g * a}x ÷ ${g} = ${a}x, ${g * b} ÷ ${g} = ${b}.<br>
          <strong>${g}(${a}x + ${b})</strong>.`
      };
    }
  },

  /* ================= GRADE 11 ================= */
  {
    id: 'elINV11', title: 'Inverse functions', grade: 11, section: 'Functions', icon: '🔁',
    gen() {
      const a = ri(2, 5), b = ri(-8, 8) || 3;
      const correct = `(x ${b >= 0 ? MINUS : '+'} ${Math.abs(b)}) ÷ ${a}`;
      return {
        type: 'mc',
        prompt: `If ${m(`f(x) = ${a}x ${b >= 0 ? '+' : MINUS} ${Math.abs(b)}`)}, what is the <strong>inverse</strong> f⁻¹(x)?`,
        answer: correct,
        choices: mcChoices(correct, [
          `(x ${b >= 0 ? '+' : MINUS} ${Math.abs(b)}) ÷ ${a}`,
          `${a}x ${b >= 0 ? MINUS : '+'} ${Math.abs(b)}`,
          `1 ÷ (${a}x ${b >= 0 ? '+' : MINUS} ${Math.abs(b)})`
        ]),
        explain: `💡 An inverse UNDOES the function, in reverse order: f first multiplies by ${a}, then ${b >= 0 ? 'adds' : 'subtracts'} ${Math.abs(b)}.<br>
          Undo: subtract ${Math.abs(b)}, then divide by ${a}: <strong>f⁻¹(x) = ${correct}</strong>.`
      };
    }
  },
  {
    id: 'elTRG11', title: 'Sine, cosine, tangent ratios', grade: 11, section: 'Trigonometry', icon: '📐',
    gen() {
      const [a, b, c] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]);
      const which = pick(['sin', 'cos', 'tan']);
      const correct = which === 'sin' ? `${a}/${c}` : which === 'cos' ? `${b}/${c}` : `${a}/${b}`;
      return {
        type: 'mc',
        prompt: `A right triangle has legs ${m(String(a))} (opposite to angle A) and ${m(String(b))} (adjacent), hypotenuse ${m(String(c))}. What is <strong>${which}(A)</strong>?`,
        answer: correct,
        choices: mcChoices(correct, [`${b}/${c}`, `${a}/${c}`, `${a}/${b}`, `${b}/${a}`]),
        explain: `SOH-CAH-TOA: ${which} = ${which === 'sin' ? 'opposite/hypotenuse' : which === 'cos' ? 'adjacent/hypotenuse' : 'opposite/adjacent'} = <strong>${correct}</strong>.`
      };
    }
  },
  {
    id: 'elSPA11', title: 'Special angles', grade: 11, section: 'Trigonometry', icon: '📐',
    gen() {
      const rows = [['sin 30°', '1/2'], ['cos 60°', '1/2'], ['sin 45°', '√2/2'], ['cos 45°', '√2/2'], ['tan 45°', '1'], ['sin 90°', '1'], ['cos 0°', '1']];
      const [q, correct] = pick(rows);
      return {
        type: 'mc',
        prompt: `${m(`${q} = ?`)}`,
        answer: correct,
        choices: mcChoices(correct, ['1/2', '√2/2', '1', '√3/2', '0']),
        explain: `${q} = <strong>${correct}</strong> — a special-angle value worth visualizing on the unit circle.`
      };
    }
  },

  /* ================= GRADE 12 ================= */
  {
    id: 'elCMP12', title: 'Compound interest', grade: 12, section: 'Financial math', icon: '💰',
    gen() {
      const r = pick([5, 10, 20]);
      const t = ri(2, 3);
      const P = pick([100, 500, 1000, 2000]);
      const ans = Number((P * Math.pow(1 + r / 100, t)).toFixed(2));
      return {
        type: 'num',
        prompt: `${m('$' + P)} is invested at ${m(`${r}% per year`)} (compounded yearly). What is it worth after ${m(`${t} years`)}? (Round to the nearest cent.)`,
        answer: ans,
        explain: `Each year the amount multiplies by ${1 + r / 100}: A = ${P} × ${1 + r / 100}${sup(t)} = <strong>$${ans}</strong>.<br>
          💡 Compounding IS exponentiation — growth on top of growth!`
      };
    }
  },
  {
    id: 'elARS12', title: 'Arithmetic sequences', grade: 12, section: 'Sequences', icon: '🔢',
    gen() {
      const a = ri(1, 10), d = ri(2, 9);
      const n = ri(5, 12);
      const ans = a + (n - 1) * d;
      return {
        type: 'num',
        prompt: `${m(`${a}, ${a + d}, ${a + 2 * d}, …`)} — what is the <strong>${n}th term</strong>?`,
        answer: ans,
        explain: `Each step adds ${d}. Term n = first + (n − 1) × d = ${a} + ${n - 1} × ${d} = <strong>${ans}</strong>.<br>
          💡 Repeated addition is multiplication — a pattern of patterns!`
      };
    }
  },
  {
    id: 'elGEO12', title: 'Geometric sequences', grade: 12, section: 'Sequences', icon: '🔢',
    gen() {
      const a = pick([1, 2, 3]), r = pick([2, 3]);
      const seq = [a, a * r, a * r * r, a * r * r * r];
      const ans = a * Math.pow(r, 4);
      return {
        type: 'num',
        prompt: `${m(seq.join(', ') + ', …')} — what comes next?`,
        answer: ans,
        explain: `Each term multiplies by ${r}: ${seq[3]} × ${r} = <strong>${ans}</strong>.<br>
          💡 Repeated multiplication is exponentiation — the same idea as compound interest!`
      };
    }
  }
];

function sup(n) { return `<sup>${n}</sup>`; }
