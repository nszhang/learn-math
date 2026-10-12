/* ============================================================
   MathAce — elementary catalog (Grades 1–6).
   Graded structure: each skill lives in a grade + section.
   Generators return: { prompt, type: 'num'|'mc', answer, choices?, explain }
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

export const ELEMENTARY = [
  {
    grade: 1,
    sections: [
      {
        name: 'Counting and patterns', icon: '🔢',
        skills: [
          {
            id: 'elCNT1', title: 'Skip-counting patterns',
            gen() {
              const step = pick([2, 5, 10]);
              const start = step * ri(0, 4);
              const seq = [start, start + step, start + 2 * step];
              const ans = start + 3 * step;
              return {
                type: 'num',
                prompt: `What comes next? ${m(`${seq.join(', ')}, ___`)}`,
                answer: ans,
                explain: `This pattern counts by ${step}s: ${seq[seq.length - 1]} + ${step} = <strong>${ans}</strong>.`
              };
            }
          }
        ]
      },
      {
        name: 'Addition', icon: '➕',
        skills: [
          {
            id: 'elADD1', title: 'Addition facts — sums to 20',
            gen() {
              const a = ri(1, 19), b = ri(1, 20 - a);
              return {
                type: 'num',
                prompt: `${m(`${a} + ${b} = ?`)}`,
                answer: a + b,
                explain: `Count on from ${a}: ${a} → … → <strong>${a + b}</strong>. ${a} + ${b} = <strong>${a + b}</strong>.`
              };
            }
          }
        ]
      },
      {
        name: 'Subtraction', icon: '➖',
        skills: [
          {
            id: 'elSUB1', title: 'Subtraction facts — numbers to 20',
            gen() {
              const a = ri(2, 20), b = ri(1, a - 1);
              return {
                type: 'num',
                prompt: `${m(`${a} − ${b} = ?`)}`,
                answer: a - b,
                explain: `Start at ${a} and count back ${b}: <strong>${a - b}</strong>.`
              };
            }
          }
        ]
      },
      {
        name: 'Comparing', icon: '⚖️',
        skills: [
          {
            id: 'elCMP1', title: 'Compare numbers to 100',
            gen() {
              let a = ri(10, 99), b = ri(10, 99);
              while (b === a) b = ri(10, 99);
              const correct = String(Math.max(a, b));
              return {
                type: 'mc',
                prompt: `Which number is <strong>greater</strong>: ${m(`${a} or ${b}`)} ?`,
                answer: correct,
                choices: [String(a), String(b)],
                explain: `Compare the tens first: ${correct} has more tens, so <strong>${correct}</strong> is greater.`
              };
            }
          }
        ]
      }
    ]
  },

  {
    grade: 2,
    sections: [
      {
        name: 'Place value', icon: '🧱',
        skills: [
          {
            id: 'elPLV1', title: 'Value of a digit',
            gen() {
              const n = ri(11, 99);
              const tens = Math.floor(n / 10), ones = n % 10;
              const askTens = pick([true, false]);
              return {
                type: 'num',
                prompt: `In the number ${m(String(n))}, what is the value of the digit <strong>${askTens ? tens : ones}</strong>?`,
                answer: askTens ? tens * 10 : ones,
                explain: askTens
                  ? `The ${tens} is in the tens place: ${tens} × 10 = <strong>${tens * 10}</strong>.`
                  : `The ${ones} is in the ones place, so its value is <strong>${ones}</strong>.`
              };
            }
          }
        ]
      },
      {
        name: 'Addition and subtraction', icon: '➕',
        skills: [
          {
            id: 'elADD2', title: 'Add two-digit numbers',
            gen() {
              const a = ri(11, 88), b = ri(11, 99 - a);
              return {
                type: 'num',
                prompt: `${m(`${a} + ${b} = ?`)}`,
                answer: a + b,
                explain: `Add the tens: ${Math.floor(a / 10) * 10} + ${Math.floor(b / 10) * 10} = ${Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10}.
                  Add the ones: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}.<br>
                  Total: <strong>${a + b}</strong>.`
              };
            }
          },
          {
            id: 'elSUB2', title: 'Subtract two-digit numbers',
            gen() {
              const b = ri(11, 60), a = ri(b + 5, 99);
              return {
                type: 'num',
                prompt: `${m(`${a} − ${b} = ?`)}`,
                answer: a - b,
                explain: `${a} − ${b}: subtract the tens (${Math.floor(b / 10) * 10}) then the ones (${b % 10}): <strong>${a - b}</strong>.`
              };
            }
          }
        ]
      },
      {
        name: 'Patterns', icon: '🔁',
        skills: [
          {
            id: 'elPAT2', title: 'Number patterns',
            gen() {
              const step = ri(2, 9), start = ri(1, 20);
              const seq = [start, start + step, start + 2 * step, start + 3 * step];
              return {
                type: 'num',
                prompt: `Complete the pattern: ${m(`${seq[0]}, ${seq[1]}, ${seq[2]}, ___, ${seq[3] + step}`)}`,
                answer: seq[3],
                explain: `Each number is ${step} more than the one before: ${seq[2]} + ${step} = <strong>${seq[3]}</strong>.`
              };
            }
          }
        ]
      }
    ]
  },

  {
    grade: 3,
    sections: [
      {
        name: 'Multiplication', icon: '✖️',
        skills: [
          {
            id: 'elMUL3', title: 'Multiplication facts to 10 × 10',
            gen() {
              const a = ri(2, 10), b = ri(2, 10);
              return {
                type: 'num',
                prompt: `${m(`${a} × ${b} = ?`)}`,
                answer: a * b,
                explain: `${a} × ${b} means ${a} groups of ${b}: ${Array(a).fill(b).join(' + ')} = <strong>${a * b}</strong>.`
              };
            }
          },
          {
            id: 'elWPM3', title: 'Multiplication word problems',
            gen() {
              const a = ri(2, 9), b = ri(2, 9);
              const [thing, box] = pick([['apples', 'bags'], ['pencils', 'boxes'], ['cookies', 'jars'], ['books', 'shelves']]);
              return {
                type: 'num',
                prompt: `There are ${m(String(b))} ${box}, and each ${box.slice(0, -1)} has ${m(String(a))} ${thing}. How many ${thing} in all?`,
                answer: a * b,
                explain: `${b} groups of ${a}: ${b} × ${a} = <strong>${a * b}</strong> ${thing}.`
              };
            }
          }
        ]
      },
      {
        name: 'Division', icon: '➗',
        skills: [
          {
            id: 'elDIV3', title: 'Division facts',
            gen() {
              const b = ri(2, 9), q = ri(2, 9);
              const a = b * q;
              return {
                type: 'num',
                prompt: `${m(`${a} ÷ ${b} = ?`)}`,
                answer: q,
                explain: `Think: ${b} × ? = ${a}. Since ${b} × ${q} = ${a}, the answer is <strong>${q}</strong>.`
              };
            }
          }
        ]
      },
      {
        name: 'Fractions', icon: '🍕',
        skills: [
          {
            id: 'elFRQ3', title: 'Fractions of a whole',
            gen() {
              const n = pick([2, 3, 4, 6, 8]);
              const k = ri(1, n - 1);
              const correct = `${k}/${n}`;
              return {
                type: 'mc',
                prompt: `A pizza is cut into ${m(String(n))} equal slices. You eat ${m(String(k))}. What <strong>fraction</strong> of the pizza did you eat?`,
                answer: correct,
                choices: mcChoices(correct, [`${n - k}/${n}`, `${k}/${n - k}`, `1/${n}`]),
                explain: `You ate ${k} of the ${n} equal slices: <strong>${correct}</strong>.`
              };
            }
          }
        ]
      },
      {
        name: 'Rounding', icon: '🎯',
        skills: [
          {
            id: 'elRND3', title: 'Round to the nearest ten',
            gen() {
              const n = ri(15, 995);
              const correct = String(Math.round(n / 10) * 10);
              const d1 = String(Math.floor(n / 10) * 10), d2 = String(Math.ceil(n / 10) * 10 + 10);
              return {
                type: 'mc',
                prompt: `Round ${m(String(n))} to the nearest <strong>ten</strong>.`,
                answer: correct,
                choices: mcChoices(correct, [d1, d2, String(Math.round(n / 100) * 100)]),
                explain: `Look at the ones digit (${n % 10}): ${n % 10 >= 5 ? '5 or more — round up' : 'less than 5 — round down'}.
                  ${n} rounds to <strong>${correct}</strong>.`
              };
            }
          }
        ]
      },
      {
        name: 'Geometry', icon: '📐',
        skills: [
          {
            id: 'elSHP3', title: 'Identify shapes',
            gen() {
              const SHAPES = [
                { name: 'triangle', clue: '3 sides and 3 angles' },
                { name: 'square', clue: '4 equal sides and 4 right angles' },
                { name: 'rectangle', clue: '4 right angles, but not all sides equal' },
                { name: 'pentagon', clue: 'exactly 5 sides' },
                { name: 'hexagon', clue: 'exactly 6 sides' },
                { name: 'octagon', clue: 'exactly 8 sides' },
                { name: 'circle', clue: 'no sides and no corners — perfectly round' }
              ];
              const s = pick(SHAPES);
              const others = shuffle(SHAPES.filter(x => x.name !== s.name)).slice(0, 3).map(x => x.name);
              return {
                type: 'mc',
                prompt: `I am a shape with ${s.clue}. <strong>What am I?</strong>`,
                answer: s.name,
                choices: shuffle([s.name, ...others]),
                explain: `A <strong>${s.name}</strong> has ${s.clue}.`
              };
            }
          }
        ]
      }
    ]
  },

  {
    grade: 4,
    sections: [
      {
        name: 'Multiplication and division', icon: '✖️',
        skills: [
          {
            id: 'elMUL4', title: 'Multiply 2-digit by 1-digit',
            gen() {
              const a = ri(12, 99), b = ri(2, 9);
              return {
                type: 'num',
                prompt: `${m(`${a} × ${b} = ?`)}`,
                answer: a * b,
                explain: `Break it up: ${a} × ${b} = (${Math.floor(a / 10) * 10} × ${b}) + (${a % 10} × ${b})
                  = ${Math.floor(a / 10) * 10 * b} + ${(a % 10) * b} = <strong>${a * b}</strong>.`
              };
            }
          },
          {
            id: 'elDIV4', title: 'Divide 3-digit by 1-digit',
            gen() {
              const b = ri(2, 9), q = ri(12, 99);
              const a = b * q;
              return {
                type: 'num',
                prompt: `${m(`${a} ÷ ${b} = ?`)}`,
                answer: q,
                explain: `Think multiplication: ${b} × <strong>${q}</strong> = ${a}.`
              };
            }
          }
        ]
      },
      {
        name: 'Fractions', icon: '🍕',
        skills: [
          {
            id: 'elEQF4', title: 'Equivalent fractions',
            gen() {
              const a = ri(1, 5), b = ri(a + 1, 9);
              const k = ri(2, 4);
              return {
                type: 'num',
                prompt: `${m(`${a}/${b} = ?/${b * k}`)} — what is the missing numerator?`,
                answer: a * k,
                explain: `The denominator was multiplied by ${k} (${b} × ${k} = ${b * k}), so multiply the numerator by ${k} too:
                  ${a} × ${k} = <strong>${a * k}</strong>.`
              };
            }
          }
        ]
      },
      {
        name: 'Number theory', icon: '🧮',
        skills: [
          {
            id: 'elGCF4', title: 'Greatest common factor',
            gen() {
              const g = pick([2, 3, 4, 6]);
              let m1 = ri(2, 8), m2 = ri(2, 8);
              while (gcd(m1, m2) !== 1) { m1 = ri(2, 8); m2 = ri(2, 8); }
              const a = g * m1, b = g * m2;
              return {
                type: 'num',
                prompt: `What is the <strong>greatest common factor</strong> (GCF) of ${m(`${a} and ${b}`)}?`,
                answer: g,
                explain: `${a} = ${g} × ${m1} and ${b} = ${g} × ${m2}, and ${m1} and ${m2} share no factor.
                  The GCF is <strong>${g}</strong>.`
              };
            }
          }
        ]
      },
      {
        name: 'Rounding', icon: '🎯',
        skills: [
          {
            id: 'elRND4', title: 'Round to the nearest hundred',
            gen() {
              const n = ri(150, 9950);
              const correct = String(Math.round(n / 100) * 100);
              return {
                type: 'mc',
                prompt: `Round ${m(String(n))} to the nearest <strong>hundred</strong>.`,
                answer: correct,
                choices: mcChoices(correct, [String(Math.floor(n / 100) * 100), String(Math.ceil(n / 100) * 100 + 100), String(Math.round(n / 10) * 10)]),
                explain: `Look at the tens digit: ${n} is closest to <strong>${correct}</strong>.`
              };
            }
          }
        ]
      }
    ]
  },

  {
    grade: 5,
    sections: [
      {
        name: 'Decimals', icon: '🔟',
        skills: [
          {
            id: 'elDEC5', title: 'Add and subtract decimals',
            gen() {
              const a = ri(11, 99) / 10, b = ri(11, 99) / 10;
              const add = pick([true, false]);
              const ans = Number((add ? a + b : a - b).toFixed(1));
              return {
                type: 'num',
                prompt: `${m(`${a.toFixed(1)} ${add ? '+' : MINUS} ${b.toFixed(1)} = ?`)}`,
                answer: ans,
                explain: `Line up the decimal points: ${a.toFixed(1)} ${add ? '+' : MINUS} ${b.toFixed(1)} = <strong>${fmtNum(ans)}</strong>.`
              };
            }
          }
        ]
      },
      {
        name: 'Fractions of numbers', icon: '🍕',
        skills: [
          {
            id: 'elFRC5', title: 'Fraction of a number',
            gen() {
              const n = pick([3, 4, 5, 6, 8]);
              const mult = ri(2, 8);
              const whole = n * mult;
              const k = ri(1, n - 1);
              const ans = k * mult;
              return {
                type: 'num',
                prompt: `What is ${m(`${k}/${n} of ${whole}`)} ?`,
                answer: ans,
                explain: `${whole} ÷ ${n} = ${mult}, then ${k} × ${mult} = <strong>${ans}</strong>.`
              };
            }
          }
        ]
      },
      {
        name: 'Number theory', icon: '🧮',
        skills: [
          {
            id: 'elPRM5', title: 'Prime or composite',
            gen() {
              const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
              const n = pick(pick([true, false]) ? primes : Array.from({ length: 45 }, (_, i) => i + 4).filter(x => !primes.includes(x)));
              const correct = primes.includes(n) ? 'prime' : 'composite';
              return {
                type: 'mc',
                prompt: `Is ${m(String(n))} <strong>prime</strong> or <strong>composite</strong>?`,
                answer: correct,
                choices: ['prime', 'composite'],
                explain: primes.includes(n)
                  ? `${n} has exactly two factors: 1 and ${n} — it is <strong>prime</strong>.`
                  : `${n} has factors other than 1 and itself — it is <strong>composite</strong>.`
              };
            }
          },
          {
            id: 'elLCM5', title: 'Least common multiple',
            gen() {
              let a = ri(2, 12), b = ri(2, 12);
              while (a === b || (a * b) / gcd(a, b) > 60) { a = ri(2, 12); b = ri(2, 12); }
              const ans = (a * b) / gcd(a, b);
              return {
                type: 'num',
                prompt: `What is the <strong>least common multiple</strong> (LCM) of ${m(`${a} and ${b}`)}?`,
                answer: ans,
                explain: `Multiples of ${a}: ${Array.from({ length: ans / a }, (_, i) => a * (i + 1)).slice(0, 6).join(', ')}…
                  Multiples of ${b}: ${Array.from({ length: ans / b }, (_, i) => b * (i + 1)).slice(0, 6).join(', ')}…<br>
                  The smallest shared multiple is <strong>${ans}</strong>.`
              };
            }
          }
        ]
      }
    ]
  },

  {
    grade: 6,
    sections: [
      {
        name: 'Integers', icon: '🌡️',
        skills: [
          {
            id: 'elINT6', title: 'Add and subtract integers',
            gen() {
              const a = ri(-9, 9), b = ri(-9, 9);
              const sub = pick([true, false]);
              const ans = sub ? a - b : a + b;
              const pb = b < 0 ? `(${fmtNum(b)})` : b;
              return {
                type: 'num',
                prompt: `${m(`${fmtNum(a)} ${sub ? MINUS : '+'} ${pb} = ?`)}`,
                answer: ans,
                explain: sub
                  ? `Subtracting ${pb}: ${fmtNum(a)} ${MINUS} ${pb} = <strong>${fmtNum(ans)}</strong>.${b < 0 ? ' (Subtracting a negative adds!)' : ''}`
                  : `${fmtNum(a)} + ${pb} = <strong>${fmtNum(ans)}</strong>.`
              };
            }
          }
        ]
      },
      {
        name: 'Ratios and rates', icon: '🚗',
        skills: [
          {
            id: 'elRAT6', title: 'Unit rates',
            gen() {
              const rate = ri(2, 90), t = ri(2, 9);
              const total = rate * t;
              const [unit, thing] = pick([['km per hour', 'km'], ['pages per day', 'pages'], ['$ per hour', 'dollars']]);
              return {
                type: 'num',
                prompt: `Alex travels ${m(`${total} ${thing}`)} in ${m(`${t} hours`)}. What is the <strong>unit rate</strong> (${unit})?`,
                answer: rate,
                explain: `Unit rate = total ÷ time = ${total} ÷ ${t} = <strong>${rate}</strong> ${unit}.`
              };
            }
          }
        ]
      },
      {
        name: 'Conversions', icon: '🔄',
        skills: [
          {
            id: 'elFDC6', title: 'Convert fractions, decimals, percents',
            gen() {
              const rows = [['1/2', 50], ['1/4', 25], ['3/4', 75], ['1/5', 20], ['2/5', 40], ['3/10', 30], ['1/10', 10]];
              const [frac, pct] = pick(rows);
              const correct = `${pct}%`;
              return {
                type: 'mc',
                prompt: `${m(frac)} as a <strong>percent</strong> is…`,
                answer: correct,
                choices: mcChoices(correct, [`${pct * 10}%`, `${pct / 10}%`, `${100 - pct}%`]),
                explain: `${frac} = ${pct / 100} = <strong>${correct}</strong>.`
              };
            }
          }
        ]
      }
    ]
  }
];
