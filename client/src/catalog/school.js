/* ============================================================
   MathAce — school topics: arithmetic, geometry, probability, statistics
   Each generator returns:
   { prompt, type: 'num'|'mc', answer, choices?, explain }
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

export const SCHOOL_TOPICS = [
  {
    id: 'number', icon: '🔢', name: 'Number sense',
    skills: [
      {
        id: 'N1', code: 'N.1', title: 'Order of operations',
        gen() {
          const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9);
          const t = ri(1, 3);
          if (t === 1) return {
            type: 'num',
            prompt: `Evaluate: ${m(`${a} + ${b} × ${c}`)}`,
            answer: a + b * c,
            explain: `Multiply <em>before</em> adding (PEMDAS):<br>
              ${b} × ${c} = ${b * c}, then ${a} + ${b * c} = <strong>${a + b * c}</strong>.`
          };
          if (t === 2) return {
            type: 'num',
            prompt: `Evaluate: ${m(`(${a} + ${b}) × ${c}`)}`,
            answer: (a + b) * c,
            explain: `Parentheses first: ${a} + ${b} = ${a + b}.<br>
              Then multiply: ${a + b} × ${c} = <strong>${(a + b) * c}</strong>.`
          };
          return {
            type: 'num',
            prompt: `Evaluate: ${m(`${a} × ${b} − ${c}`)}`,
            answer: a * b - c,
            explain: `Multiply first: ${a} × ${b} = ${a * b}.<br>
              Then subtract: ${a * b} − ${c} = <strong>${a * b - c}</strong>.`
          };
        }
      },
      {
        id: 'N2', code: 'N.2', title: 'Add & subtract fractions',
        gen() {
          const d = pick([5, 6, 7, 8, 9, 10, 12]);
          const add = pick([true, false]);
          if (add) {
            const n1 = ri(1, d - 2), n2 = ri(1, d - 1 - n1);
            const correct = `${n1 + n2}/${d}`;
            return {
              type: 'mc',
              prompt: `${m(`${n1}/${d} + ${n2}/${d} = ?`)}`,
              answer: correct,
              choices: mcChoices(correct, [`${n1 + n2}/${2 * d}`, `${n1 + n2 + 1}/${d}`, `${Math.abs(n1 - n2)}/${d}`]),
              explain: `Same denominator — just add the numerators:<br>
                ${n1}/${d} + ${n2}/${d} = (${n1} + ${n2})/${d} = <strong>${correct}</strong>.`
            };
          }
          const n1 = ri(2, d - 1), n2 = ri(1, n1 - 1);
          const correct = `${n1 - n2}/${d}`;
          return {
            type: 'mc',
            prompt: `${m(`${n1}/${d} − ${n2}/${d} = ?`)}`,
            answer: correct,
            choices: mcChoices(correct, [`${n1 + n2}/${d}`, `${n1 - n2}/${2 * d}`, `${d - n1 + n2}/${d}`]),
            explain: `Same denominator — subtract the numerators:<br>
              ${n1}/${d} − ${n2}/${d} = (${n1} − ${n2})/${d} = <strong>${correct}</strong>.`
          };
        }
      },
      {
        id: 'N3', code: 'N.3', title: 'Percent of a number',
        gen() {
          const p = pick([10, 20, 25, 50, 75]);
          const mult = p === 25 || p === 75 ? 4 : p === 50 ? 2 : 5;
          const n = mult * ri(2, 12);
          const ans = n * p / 100;
          return {
            type: 'num',
            prompt: `What is ${m(`${p}% of ${n}`)} ?`,
            answer: ans,
            explain: `${p}% means ${p}/100${p === 50 ? ' (one half)' : p === 25 ? ' (one quarter)' : ''}.<br>
              ${n} × ${p} ÷ 100 = <strong>${ans}</strong>.`
          };
        }
      }
    ]
  },

  {
    id: 'geometry', icon: '📐', name: 'Geometry & shapes',
    skills: [
      {
        id: 'G1', code: 'G.1', title: 'Area of rectangles',
        gen() {
          const l = ri(2, 12), w = ri(2, 12);
          return {
            type: 'num',
            prompt: `A rectangle is ${m(`${l} cm`)} long and ${m(`${w} cm`)} wide. What is its <strong>area</strong> (in cm²)?`,
            answer: l * w,
            explain: `Area = length × width = ${l} × ${w} = <strong>${l * w} cm²</strong>.`
          };
        }
      },
      {
        id: 'G2', code: 'G.2', title: 'Perimeter of rectangles',
        gen() {
          const l = ri(2, 12), w = ri(2, 12);
          const ans = 2 * (l + w);
          return {
            type: 'num',
            prompt: `A rectangle is ${m(`${l} m`)} by ${m(`${w} m`)}. What is its <strong>perimeter</strong> (in m)?`,
            answer: ans,
            explain: `Perimeter = 2 × (length + width) = 2 × (${l} + ${w}) = 2 × ${l + w} = <strong>${ans} m</strong>.`
          };
        }
      },
      {
        id: 'G3', code: 'G.3', title: 'Area of triangles',
        gen() {
          const b = ri(2, 14), h = 2 * ri(1, 7); // even height keeps the area an integer
          const ans = b * h / 2;
          return {
            type: 'num',
            prompt: `A triangle has base ${m(`${b} cm`)} and height ${m(`${h} cm`)}. What is its <strong>area</strong> (in cm²)?`,
            answer: ans,
            explain: `Area = ½ × base × height = ½ × ${b} × ${h} = ½ × ${b * h} = <strong>${ans} cm²</strong>.`
          };
        }
      },
      {
        id: 'G4', code: 'G.4', title: 'Angles in a triangle',
        gen() {
          const a = ri(25, 100), b = ri(25, 155 - a - 25);
          const c = 180 - a - b;
          return {
            type: 'num',
            prompt: `Two angles of a triangle measure ${m(`${a}°`)} and ${m(`${b}°`)}. What is the <strong>third angle</strong> (in degrees)?`,
            answer: c,
            explain: `The angles of a triangle add to 180°.<br>
              180 − ${a} − ${b} = <strong>${c}°</strong>.`
          };
        }
      },
      {
        id: 'G5', code: 'G.5', title: 'Circles: circumference & area',
        gen() {
          const r = ri(2, 9);
          const area = pick([true, false]);
          const ans = area ? Number((3.14 * r * r).toFixed(2)) : Number((2 * 3.14 * r).toFixed(2));
          return {
            type: 'num',
            prompt: area
              ? `A circle has radius ${m(`${r} cm`)}. Using π ≈ 3.14, find its <strong>area</strong> (in cm²).`
              : `A circle has radius ${m(`${r} cm`)}. Using π ≈ 3.14, find its <strong>circumference</strong> (in cm).`,
            answer: ans,
            explain: area
              ? `Area = πr² ≈ 3.14 × ${r}² = 3.14 × ${r * r} = <strong>${ans} cm²</strong>.`
              : `Circumference = 2πr ≈ 2 × 3.14 × ${r} = <strong>${ans} cm</strong>.`
          };
        }
      },
      {
        id: 'G6', code: 'G.6', title: 'Volume of a rectangular prism',
        gen() {
          const l = ri(2, 8), w = ri(2, 8), h = ri(2, 8);
          const ans = l * w * h;
          return {
            type: 'num',
            prompt: `A box is ${m(`${l} cm`)} × ${m(`${w} cm`)} × ${m(`${h} cm`)}. What is its <strong>volume</strong> (in cm³)?`,
            answer: ans,
            explain: `Volume = length × width × height = ${l} × ${w} × ${h} = <strong>${ans} cm³</strong>.`
          };
        }
      }
    ]
  },

  {
    id: 'probability', icon: '🎲', name: 'Probability',
    skills: [
      {
        id: 'P1', code: 'P.1', title: 'Simple probability',
        gen() {
          const r = ri(1, 6), b = ri(1, 6);
          const total = r + b;
          const correct = `${r}/${total}`;
          return {
            type: 'mc',
            prompt: `A bag has ${m(`${r} red`)} and ${m(`${b} blue`)} marbles. You pick one at random. What is <strong>P(red)</strong>?`,
            answer: correct,
            choices: mcChoices(correct, [`${b}/${total}`, `${r}/${b}`, `1/${r}`, `${total}/${r}`, '1/2', `${r}/${r}`]),
            explain: `P(red) = red marbles ÷ total marbles = ${r} ÷ ${total} = <strong>${correct}</strong>.`
          };
        }
      },
      {
        id: 'P2', code: 'P.2', title: 'Probability of the complement',
        gen() {
          const r = ri(1, 6), b = ri(1, 6);
          const total = r + b;
          const correct = `${b}/${total}`;
          return {
            type: 'mc',
            prompt: `A bag has ${m(`${r} red`)} and ${m(`${b} blue`)} marbles. What is <strong>P(NOT red)</strong>?`,
            answer: correct,
            choices: mcChoices(correct, [`${r}/${total}`, '1', `1/${total}`, '1/2', `${b}/${r}`, `${total}/${b}`]),
            explain: `P(not red) = 1 − P(red) = 1 − ${r}/${total} = <strong>${correct}</strong>.<br>
              (Same as picking blue: ${b}/${total}.)`
          };
        }
      },
      {
        id: 'P3', code: 'P.3', title: 'Dice & coins',
        gen() {
          const t = ri(1, 4);
          if (t === 1) return {
            type: 'mc',
            prompt: `You roll a fair die. What is <strong>P(even)</strong>?`,
            answer: '1/2',
            choices: mcChoices('1/2', ['1/6', '1/3', '2/3']),
            explain: `Even numbers on a die: 2, 4, 6 — that's 3 out of 6 = <strong>1/2</strong>.`
          };
          if (t === 2) return {
            type: 'mc',
            prompt: `You roll a fair die. What is <strong>P(more than 4)</strong>?`,
            answer: '1/3',
            choices: mcChoices('1/3', ['1/6', '1/2', '2/3']),
            explain: `More than 4 means 5 or 6 — that's 2 out of 6 = <strong>1/3</strong>.`
          };
          if (t === 3) return {
            type: 'mc',
            prompt: `You flip two coins. What is <strong>P(both heads)</strong>?`,
            answer: '1/4',
            choices: mcChoices('1/4', ['1/2', '1/3', '3/4']),
            explain: `Outcomes: HH, HT, TH, TT. Only 1 of 4 is both heads = <strong>1/4</strong>.`
          };
          return {
            type: 'mc',
            prompt: `You roll a fair die. What is <strong>P(prime)</strong>?`,
            answer: '1/2',
            choices: mcChoices('1/2', ['1/6', '1/3', '2/3']),
            explain: `Primes on a die: 2, 3, 5 — that's 3 out of 6 = <strong>1/2</strong>. (1 is not prime!)`
          };
        }
      }
    ]
  },

  {
    id: 'statistics', icon: '📊', name: 'Data & statistics',
    skills: [
      {
        id: 'S1', code: 'S.1', title: 'Mean (average)',
        gen() {
          const mean = ri(3, 12);
          const a = ri(1, 10), b = ri(1, 10), c = ri(1, 10);
          const d = 4 * mean - a - b - c;
          const nums = shuffle([a, b, c, d]);
          return {
            type: 'num',
            prompt: `Find the <strong>mean</strong> of: ${m(nums.join(', '))}`,
            answer: mean,
            explain: `Mean = sum ÷ count = (${nums.join(' + ')}) ÷ 4 = ${4 * mean} ÷ 4 = <strong>${mean}</strong>.`
          };
        }
      },
      {
        id: 'S2', code: 'S.2', title: 'Median',
        gen() {
          const med = ri(3, 15);
          const nums = shuffle([med, med - ri(1, 2), med + ri(1, 2), med - ri(3, 5), med + ri(3, 5)]);
          const sorted = nums.slice().sort((x, y) => x - y);
          return {
            type: 'num',
            prompt: `Find the <strong>median</strong> of: ${m(nums.join(', '))}`,
            answer: med,
            explain: `Order the numbers: ${sorted.join(', ')}.<br>
              The middle one is <strong>${med}</strong>.`
          };
        }
      },
      {
        id: 'S3', code: 'S.3', title: 'Mode',
        gen() {
          const mode = ri(2, 12);
          const others = new Set();
          while (others.size < 3) others.add(ri(1, 15));
          const rest = [...others].filter(o => o !== mode).slice(0, 3);
          const nums = shuffle([mode, mode, mode, ...rest.slice(0, 3)]);
          return {
            type: 'mc',
            prompt: `Find the <strong>mode</strong> of: ${m(nums.join(', '))}`,
            answer: String(mode),
            choices: mcChoices(String(mode), rest.slice(0, 3).map(String)),
            explain: `The mode is the number that appears most often.<br>
              ${mode} appears 3 times — more than any other — so the mode is <strong>${mode}</strong>.`
          };
        }
      },
      {
        id: 'S4', code: 'S.4', title: 'Range',
        gen() {
          const lo = ri(1, 10), hi = lo + ri(5, 20);
          const mids = [ri(lo, hi), ri(lo, hi), ri(lo, hi)];
          const nums = shuffle([lo, hi, ...mids]);
          return {
            type: 'num',
            prompt: `Find the <strong>range</strong> of: ${m(nums.join(', '))}`,
            answer: hi - lo,
            explain: `Range = greatest − least = ${hi} − ${lo} = <strong>${hi - lo}</strong>.`
          };
        }
      }
    ]
  }
];
