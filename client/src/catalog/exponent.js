/* ============================================================
   ExponentAce — skills & question generators (ES module)
   Each generator returns:
   { prompt, type: 'num'|'mc', answer, choices?, explain }
   ============================================================ */

// ---------- helpers ----------
export const ri = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const pick = arr => arr[ri(0, arr.length - 1)];
const rnz = (min, max) => { let n = 0; while (n === 0) n = ri(min, max); return n; };
const shuffle = arr => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = ri(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const m = s => `<span class="math">${s}</span>`;          // inline math chip
const sup = n => `<sup>${n}</sup>`;
const sub = n => `<sub>${n}</sub>`;
const MINUS = '−';                                        // U+2212 for display
export const fmtNum = n => String(n).replace('-', MINUS);

// unicode super/subscripts for plain-text multiple-choice options
const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
const SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
const uniSup = n => String(n).split('').map(c => SUP[c] || c).join('');
const uniSub = n => String(n).split('').map(c => SUB[c] || c).join('');

// unique string choices including `correct`
function mcChoices(correct, distractors) {
  const set = [correct];
  for (const d of distractors) if (!set.includes(d)) set.push(d);
  return shuffle(set);
}

/* ============================================================
   TOPICS & SKILLS
   ============================================================ */
export const EXPONENT_TOPICS = [
  {
    id: 'powers', icon: '🚀', name: 'Powers & bases',
    skills: [
      {
        id: 'A1', code: 'A.1', title: 'Evaluate powers',
        gen() {
          const b = ri(2, 5), n = ri(2, b <= 3 ? 5 : 4);
          const val = Math.pow(b, n);
          return {
            type: 'num',
            prompt: `Evaluate: ${m(`${b}${sup(n)}`)}`,
            answer: val,
            explain: `${b}${sup(n)} means ${b} multiplied by itself ${n} times:<br>
              ${Array(n).fill(b).join(' × ')} = <strong>${val}</strong>.`
          };
        }
      },
      {
        id: 'A2', code: 'A.2', title: 'Powers with negative bases',
        gen() {
          const b = ri(2, 5), n = ri(2, 4);
          const mag = Math.pow(b, n);
          const paren = pick([true, false]);
          const correct = (!paren || n % 2 === 1) ? MINUS + mag : String(mag);
          const choices = mcChoices(correct,
            [String(mag), MINUS + mag, String(mag * n), MINUS + String(mag * n)]);
          return {
            type: 'mc',
            prompt: paren
              ? `Evaluate: ${m(`(${MINUS}${b})${sup(n)}`)}`
              : `Evaluate: ${m(`${MINUS}${b}${sup(n)}`)}`,
            answer: correct, choices,
            explain: paren
              ? `The base is ${MINUS}${b} (parentheses!). ${n % 2 === 0
                  ? `An even power makes it positive: (${MINUS}${b})${sup(n)} = <strong>${mag}</strong>.`
                  : `An odd power keeps it negative: (${MINUS}${b})${sup(n)} = <strong>${MINUS}${mag}</strong>.`}`
              : `No parentheses — the exponent applies first, then the minus sign:<br>
                 ${MINUS}${b}${sup(n)} = ${MINUS}(${b}${sup(n)}) = <strong>${MINUS}${mag}</strong>.`
          };
        }
      },
      {
        id: 'A3', code: 'A.3', title: 'Zero and negative exponents',
        gen() {
          const b = ri(2, 5);
          if (pick([true, false])) {
            const correct = '1';
            return {
              type: 'mc',
              prompt: `Evaluate: ${m(`${b}${sup(0)}`)}`,
              answer: correct,
              choices: mcChoices(correct, ['0', String(b), MINUS + '1']),
              explain: `Anything (except 0) to the power 0 is <strong>1</strong>. So ${b}${sup(0)} = 1.`
            };
          }
          const n = ri(1, 3), val = Math.pow(b, n);
          const correct = `1/${val}`;
          return {
            type: 'mc',
            prompt: `Evaluate: ${m(`${b}${sup(MINUS + String(n))}`)}`,
            answer: correct,
            choices: mcChoices(correct, [`${MINUS}${val}`, String(val), `${MINUS}1/${val}`]),
            explain: `A negative exponent means a reciprocal:<br>
              ${b}${sup(MINUS + String(n))} = 1 ÷ ${b}${sup(n)} = 1 ÷ ${val} = <strong>${correct}</strong>.`
          };
        }
      }
    ]
  },

  {
    id: 'rules', icon: '🧬', name: 'Exponent rules',
    skills: [
      {
        id: 'B1', code: 'B.1', title: 'Product rule',
        gen() {
          const a = ri(2, 9), b = ri(2, 9);
          return {
            type: 'num',
            prompt: `${m(`x${sup(a)} · x${sup(b)} = x${sup('?')}`)} — what is the missing exponent?`,
            answer: a + b,
            explain: `Multiplying powers with the same base: <em>add</em> the exponents.<br>
              ${a} + ${b} = <strong>${a + b}</strong>, so x${sup(a)} · x${sup(b)} = x${sup(a + b)}.`
          };
        }
      },
      {
        id: 'B2', code: 'B.2', title: 'Quotient rule',
        gen() {
          const a = ri(1, 9), b = ri(1, 9);
          const ans = a - b;
          return {
            type: 'num',
            prompt: `${m(`x${sup(a)} ÷ x${sup(b)} = x${sup('?')}`)} — what is the missing exponent?`,
            answer: ans,
            explain: `Dividing powers with the same base: <em>subtract</em> the exponents.<br>
              ${a} − ${b} = <strong>${fmtNum(ans)}</strong>${ans < 0 ? `, so the result is x${sup(ans)} = 1/x${sup(-ans)}` : ''}.`
          };
        }
      },
      {
        id: 'B3', code: 'B.3', title: 'Power of a power',
        gen() {
          const a = ri(2, 6), b = ri(2, 5);
          return {
            type: 'num',
            prompt: `${m(`(x${sup(a)})${sup(b)} = x${sup('?')}`)} — what is the missing exponent?`,
            answer: a * b,
            explain: `A power raised to a power: <em>multiply</em> the exponents.<br>
              ${a} × ${b} = <strong>${a * b}</strong>.`
          };
        }
      },
      {
        id: 'B4', code: 'B.4', title: 'Mixed exponent rules',
        gen() {
          const a = ri(2, 8), b = ri(2, 8), c = ri(1, 6);
          const ans = a + b - c;
          return {
            type: 'num',
            prompt: `${m(`x${sup(a)} · x${sup(b)} ÷ x${sup(c)} = x${sup('?')}`)} — what is the missing exponent?`,
            answer: ans,
            explain: `Combine the rules left to right: multiply → add, divide → subtract.<br>
              ${a} + ${b} − ${c} = <strong>${fmtNum(ans)}</strong>.`
          };
        }
      }
    ]
  },

  {
    id: 'expeq', icon: '📈', name: 'Exponential equations',
    skills: [
      {
        id: 'C1', code: 'C.1', title: 'Solve bˣ = v',
        gen() {
          const b = pick([2, 3, 5]);
          const x = ri(2, b === 5 ? 3 : 5);
          const v = Math.pow(b, x);
          return {
            type: 'num',
            prompt: `Solve for x: ${m(`${b}${sup('x')} = ${v}`)}`,
            answer: x,
            explain: `Rewrite ${v} as a power of ${b}: ${v} = ${b}${sup(x)}.<br>
              Same base → equal exponents: x = <strong>${x}</strong>.`
          };
        }
      },
      {
        id: 'C2', code: 'C.2', title: 'Solve bˣ⁺ᵏ = v',
        gen() {
          const b = pick([2, 3]);
          const k = ri(1, 3);
          const x = ri(1, 4);
          const mExp = x + k;
          const v = Math.pow(b, mExp);
          return {
            type: 'num',
            prompt: `Solve for x: ${m(`${b}${sup(`x + ${k}`)} = ${v}`)}`,
            answer: x,
            explain: `Rewrite: ${v} = ${b}${sup(mExp)}, so ${b}${sup(`x + ${k}`)} = ${b}${sup(mExp)}.<br>
              Equal bases → x + ${k} = ${mExp} → x = ${mExp} − ${k} = <strong>${x}</strong>.`
          };
        }
      },
      {
        id: 'C3', code: 'C.3', title: 'Solve bᵃˣ = v',
        gen() {
          const b = pick([2, 3, 5]);
          const a = pick([2, 3]);
          const x = ri(1, b === 5 ? 2 : 3);
          const v = Math.pow(b, a * x);
          return {
            type: 'num',
            prompt: `Solve for x: ${m(`${b}${sup(`${a}x`)} = ${v}`)}`,
            answer: x,
            explain: `Rewrite: ${v} = ${b}${sup(a * x)}, so ${a}x = ${a * x} → x = ${a * x} ÷ ${a} = <strong>${x}</strong>.`
          };
        }
      }
    ]
  },

  {
    id: 'logs', icon: '🔢', name: 'Logarithms',
    skills: [
      {
        id: 'D1', code: 'D.1', title: 'Evaluate logarithms',
        gen() {
          const b = pick([2, 3, 5, 10]);
          const ans = ri(2, b >= 5 ? 3 : 4);
          const v = Math.pow(b, ans);
          return {
            type: 'num',
            prompt: `Evaluate: ${m(`log${sub(b)}(${v})`)}`,
            answer: ans,
            explain: `log${sub(b)}(${v}) asks: "${b} to what power gives ${v}?"<br>
              ${b}${sup(ans)} = ${v}, so the answer is <strong>${ans}</strong>.`
          };
        }
      },
      {
        id: 'D2', code: 'D.2', title: 'Convert between log and exponential form',
        gen() {
          const b = pick([2, 3, 5, 10]);
          const y = ri(2, 3);
          const v = Math.pow(b, y);
          const correct = `${b}${uniSup(y)} = ${v}`;
          return {
            type: 'mc',
            prompt: `${m(`log${sub(b)}(${v}) = ${y}`)} means the same as…`,
            answer: correct,
            choices: mcChoices(correct, [
              `${m}${uniSup(b)} = ${v}`,
              `${b}${uniSup(v)} = ${y}`,
              `${v}${uniSup(y)} = ${b}`
            ]),
            explain: `log${sub(b)}(${v}) = ${y} reads "${b} to the power ${y} equals ${v}".<br>
              In exponential form: <strong>${b}${sup(y)} = ${v}</strong>.`
          };
        }
      },
      {
        id: 'D3', code: 'D.3', title: 'Solve log_b(x) = m',
        gen() {
          const b = pick([2, 3, 5]);
          const mExp = ri(2, 4);
          const x = Math.pow(b, mExp);
          return {
            type: 'num',
            prompt: `Solve for x: ${m(`log${sub(b)}(x) = ${mExp}`)}`,
            answer: x,
            explain: `Convert to exponential form: x = ${b}${sup(mExp)} = <strong>${x}</strong>.`
          };
        }
      },
      {
        id: 'D4', code: 'D.4', title: 'Solve log_b(x + k) = m',
        gen() {
          const b = pick([2, 3]);
          const mExp = ri(2, 3);
          const v = Math.pow(b, mExp);
          const k = ri(1, v - 1);
          const x = v - k;
          return {
            type: 'num',
            prompt: `Solve for x: ${m(`log${sub(b)}(x + ${k}) = ${mExp}`)}`,
            answer: x,
            explain: `Convert: x + ${k} = ${b}${sup(mExp)} = ${v}.<br>
              Subtract ${k}: x = ${v} − ${k} = <strong>${x}</strong>.`
          };
        }
      },
      {
        id: 'D5', code: 'D.5', title: 'Combine logarithms',
        gen() {
          const b = pick([2, 3]);
          const p = ri(1, 4), q = ri(1, 4);
          const A = Math.pow(b, p), B = Math.pow(b, q);
          const add = pick([true, false]);
          const ans = add ? p + q : p - q;
          return {
            type: 'num',
            prompt: add
              ? `Evaluate: ${m(`log${sub(b)}(${A}) + log${sub(b)}(${B})`)}`
              : `Evaluate: ${m(`log${sub(b)}(${A}) − log${sub(b)}(${B})`)}`,
            answer: ans,
            explain: add
              ? `Product rule: log${sub(b)}(${A}) + log${sub(b)}(${B}) = log${sub(b)}(${A * B}) = log${sub(b)}(${b}${sup(p + q)}) = <strong>${p + q}</strong>.`
              : `Quotient rule: log${sub(b)}(${A}) − log${sub(b)}(${B}) = log${sub(b)}(${A}/${B}) = log${sub(b)}(${b}${sup(p - q)}) = <strong>${fmtNum(p - q)}</strong>.`
          };
        }
      },
      {
        id: 'D6', code: 'D.6', title: 'Natural logarithms and e',
        gen() {
          const form = ri(1, 4);
          if (form === 1) {
            const n = ri(2, 6);
            const correct = String(n);
            return {
              type: 'mc',
              prompt: `Evaluate: ${m(`ln(e${sup(n)})`)}`,
              answer: correct,
              choices: mcChoices(correct, [String(n + 1), String(n - 1), `e${uniSup(n)}`, '1']),
              explain: `ln means log${sub('e')}. Since e${sup(n)} = e${sup(n)}, ln(e${sup(n)}) = <strong>${n}</strong>.`
            };
          }
          if (form === 2) {
            const k = ri(2, 12);
            const correct = String(k);
            return {
              type: 'mc',
              prompt: `Evaluate: ${m(`e${sup(`ln(${k})`)}`)}`,
              answer: correct,
              choices: mcChoices(correct, [String(k + 1), String(k - 1), `ln(${k})`, `e${uniSup(k)}`]),
              explain: `e and ln undo each other — they are inverse functions.<br>
                e${sup(`ln(${k})`)} = <strong>${k}</strong>.`
            };
          }
          if (form === 3) {
            const correct = '0';
            return {
              type: 'mc',
              prompt: `Evaluate: ${m('ln(1)')}`,
              answer: correct,
              choices: mcChoices(correct, ['1', 'e', MINUS + '1']),
              explain: `e${sup(0)} = 1, so ln(1) = <strong>0</strong>. (Any base: log of 1 is always 0.)`
            };
          }
          const correct = MINUS + '1';
          return {
            type: 'mc',
            prompt: `Evaluate: ${m('ln(1/e)')}`,
            answer: correct,
            choices: mcChoices(correct, ['1', 'e', MINUS + 'e']),
            explain: `1/e = e${sup(MINUS + '1')}, and ln undoes the exponential:<br>
              ln(e${sup(MINUS + '1')}) = <strong>${MINUS}1</strong>.`
          };
        }
      }
    ]
  }
];

// flat lookup: skill id -> { topic, skill }


export const ALL_SKILLS = EXPONENT_TOPICS.flatMap(t => t.skills);

/* ============================================================
   PRAISE & ENCOURAGEMENT
   ============================================================ */
export const PRAISE = [
  'Correct! 🎉', 'Nice work! 👏', 'You got it! ✅', 'Brilliant! 💡',
  'Exactly right! 🌟', 'Super! 🙌', 'Way to go! 🚀', 'Outstanding! 🏆'
];
export const PRAISE_CHALLENGE = [
  'Amazing — that was a Challenge Zone question! 🔥',
  'Wow! Challenge Zone conquered! ⚡',
  'Incredible focus in the Challenge Zone! 🧠'
];
export const ENCOURAGE = [
  'Good effort! Mistakes help your brain grow. 🌱',
  'Not quite — but you\'re closer than you think! 💪',
  'Keep going! Every expert was once a beginner. 🐣',
  'Almost! Read the explanation and try the next one. 📖',
  'Don\'t give up — you\'re building real skills! 🧗'
];
export const MASTERY_MSGS = [
  'You mastered this skill — SmartScore 100! 🥇',
  'MASTERY! You\'re officially an ace at this skill! 🏆',
  'PERFECT SCORE! Take a bow! 🎊'
];
