/* ============================================================
   BEDMAS practice, Grades 3–9 — built on the same step engine as the
   Learn lesson (learn/bedmas.js), so answers and worked steps always match it.
   Difficulty by grade:
     3: + − × with simple brackets         4: adds ÷
     5: three or four operations            6: adds exponents
     7: nested brackets with exponents      8–9: negative numbers
   ============================================================ */
import { solve, tokenize, nextOpIndex, opSpan, tokensText, fmt } from '../learn/bedmas.js';

export const BEDMAS_SECTION = 'BEDMAS: order of operations';
const ri = (a, z) => Math.floor(Math.random() * (z - a + 1)) + a;
const pick = arr => arr[ri(0, arr.length - 1)];
const shuffle = arr => { const x = arr.slice(); for (let i = x.length - 1; i > 0; i--) { const j = ri(0, i); [x[i], x[j]] = [x[j], x[i]]; } return x; };
const b = s => `<strong>${s}</strong>`;
const math = s => `<span class="math">${s}</span>`;
const NAMES = ['Ava', 'Ben', 'Maya', 'Leo', 'Zoe', 'Omar', 'Lily', 'Noah', 'Aria', 'Sam'];

// letters: a–d numbers in the grade's range, p = base to square (2–9), q = base to cube (2–4), n = negative number in brackets
const LEVELS = {
  3: { lo: 1, hi: 10, max: 100, neg: false, t: ['a + b × c', 'a × b + c', 'a × b − c', 'a + b − c', '(a + b) × c', 'a × (b + c)', '(a − b) × c', 'a − b + c'] },
  4: { lo: 1, hi: 12, max: 150, neg: false, t: ['a + b × c', 'a ÷ b + c', 'a + b ÷ c', '(a + b) ÷ c', 'a × b − c × d', 'a ÷ b × c', 'a + b × c − d', '(a − b) × c + d'] },
  5: { lo: 1, hi: 15, max: 250, neg: false, t: ['a + b × (c − d)', '(a + b) × (c − d)', 'a × b ÷ c + d', 'a − b ÷ c × d', '(a × b − c) ÷ d', 'a + (b + c) × d', 'a ÷ (b − c) + d', 'a × b − c + d'] },
  6: { lo: 1, hi: 12, max: 300, neg: false, t: ['a + p ^ 2', 'p ^ 2 × a − b', '(a + b) ^ 2', 'a × (b − c) ^ 2', 'q ^ 3 − a × b', '(p ^ 2 + a) ÷ b', 'p ^ 2 − a × b + c', 'a + b × q ^ 3'] },
  7: { lo: 1, hi: 15, max: 400, neg: false, t: ['a × (b + (c − d))', '(a + b × c) ÷ d', 'p ^ 2 + a × (b − c)', '(p ^ 2 − a) × (b + c)', 'a − (b − c) × d + p ^ 2', '(a + b) ^ 2 ÷ (c + d)', 'q ^ 3 − (a + b × c)', 'a × (b + c) ^ 2 − d'] },
  8: { lo: 1, hi: 12, max: 400, neg: true, t: ['n + a × b', 'a × n − b', '(a − b) ^ 2 − c', 'n ^ 2 − a × b', '(n + a) × (b − c)', 'a − b × c', 'n × (a − b) ^ 2', '(a − b × c) ÷ d'] },
  9: { lo: 1, hi: 15, max: 600, neg: true, t: ['n ^ 3 + a × (b − c)', '(a − b × c) ÷ d', 'n × (a + n) ^ 2', '(a − (b − c) ^ 2) × d', 'n ^ 2 − (a − b) ^ 3', '(n × a + b) ÷ c', 'a − b ^ 2 × (c − d)', '(n − a) × (n + b) − c ^ 2'] }
};

function fill(tpl, L) {
  return tpl.replace(/\b[a-dnpq]\b/g, ch => ({ p: ri(2, 9), q: ri(2, 4), n: `(−${ri(1, 9)})` }[ch] ?? ri(L.lo, L.hi)));
}
/** A random expression for the grade whose every step stays a whole number within the grade's range. */
export function gradeExpression(grade, tpls = null) {
  const L = LEVELS[grade];
  for (let tries = 0; tries < 500; tries++) {
    const expr = fill(pick(tpls || L.t), L);
    try {
      const { frames, value } = solve(expr);
      let ok = value.d === 1n && frames.length >= 2 && !/[×÷^] 1(?!\d)|÷ 1\b/.test(expr);
      for (const f of frames) {
        // every intermediate result: whole, in range, and (before grade 8) never negative
        const r = Number(f.step.text.split('= ').pop().replace('−', '-'));
        if (!Number.isInteger(r) || r === 0 || Math.abs(r) > L.max || (!L.neg && r < 0)) { ok = false; break; }
      }
      if (ok) return { expr: tokensText(tokenize(expr)), frames, value: Number(value.n) };
    } catch { /* division by zero or not exact — try again */ }
  }
  return { expr: '3 + 4 × 2', frames: solve('3 + 4 × 2').frames, value: 11 };
}

const stepsText = frames => frames.map(f => f.step.text).join(' → ');
const explainSteps = (frames, value) => `Work it in BEDMAS order: ${stepsText(frames)}. The answer is ${b(fmt({ n: BigInt(value), d: 1n }))}.`;

// Evaluate an expression strictly left to right (respecting only brackets) — the classic mistake.
function leftToRight(text) {
  const s = text.replace(/−/g, '-').replace(/\s+/g, '');
  let i = 0;
  const base = () => {
    if (s[i] === '(') { i++; const v = seq(); i++; return v; }
    let j = i; if (s[j] === '-') j++; while (/[\d.]/.test(s[j] || '')) j++;
    const v = Number(s.slice(i, j)); i = j; return v;
  };
  // the usual mistake is going left to right through + − × ÷; powers still stick to their base
  const atom = () => { let v = base(); while (s[i] === '^') { i++; v = v ** base(); } return v; };
  const seq = () => {
    let v = atom();
    while (i < s.length && s[i] !== ')') {
      const op = s[i++], w = atom();
      v = op === '+' ? v + w : op === '-' ? v - w : op === '×' ? v * w : v / w;
    }
    return v;
  };
  return seq();
}

const mc = (prompt, answer, wrong, explain) => {
  const choices = shuffle([answer, ...[...new Set(wrong)].filter(w => w !== answer)].slice(0, 4));
  return { type: 'mc', prompt, answer, choices, explain };
};

/* ---------- the four question types ---------- */
const evaluate = grade => () => {
  const { expr, frames, value } = gradeExpression(grade);
  return { type: 'num', prompt: `Use BEDMAS to evaluate:<br>${math(expr)}`, answer: value, explain: explainSteps(frames, value) };
};

const firstStep = grade => () => {
  for (let t = 0; t < 50; t++) {
    const { expr, frames } = gradeExpression(grade);
    const tokens = frames[0].tokens;
    const pieceAt = i => { const [from, to] = opSpan(tokens, i); return tokensText(tokens.slice(from, to + 1)); };
    const lone = (i, dir) => (dir < 0 ? tokens[i - 1]?.t === ')' && tokens[i - 2]?.t === 'num' && tokens[i - 3]?.t === '(' : tokens[i + 1]?.t === '(' && tokens[i + 2]?.t === 'num' && tokens[i + 3]?.t === ')');
    const simple = i => (tokens[i - 1]?.t === 'num' || lone(i, -1)) && (tokens[i + 1]?.t === 'num' || lone(i, 1));
    // a "piece" that borrows the exponent of a power (the 3 in 3^3 − 2) is not a real choice
    const ops = tokens.map((tk, i) => (tk.t === 'op' ? i : -1)).filter(i => i >= 0 && simple(i) && tokens[i - 2]?.v !== '^');
    const right = nextOpIndex(tokens);
    if (!ops.includes(right)) continue;
    // any bracket that is ready to work on is a fine place to start: never offer one as a "wrong" answer
    const okFirst = new Set([right]);
    const stack = [];
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].t === '(') stack.push(i);
      else if (tokens[i].t === ')') {
        const open = stack.pop(), inner = tokens.slice(open + 1, i);
        // a bracket is ready when it has an operation and only plain numbers or bracketed negatives inside
        const ready = inner.some(t => t.t === 'op') && inner.every((t, k) => t.t !== '(' || (inner[k + 1]?.t === 'num' && inner[k + 2]?.t === ')'));
        if (ready) { const k = nextOpIndex(inner); if (k !== null) okFirst.add(open + 1 + k); }
      }
    }
    const answer = pieceAt(right);
    const wrong = ops.filter(i => !okFirst.has(i)).map(pieceAt).filter(w => w !== answer);
    if (!wrong.length) continue;
    if (wrong.length < 1) continue;
    return mc(`In ${math(expr)}, which part do you work out ${b('first')}?`, answer, wrong,
      `${frames[0].step.why} So start with ${b(frames[0].step.text.split(' =')[0])}.`);
  }
  return evaluate(grade)();
};

const whoIsRight = grade => () => {
  for (let t = 0; t < 80; t++) {
    const { expr, frames, value } = gradeExpression(grade);
    const naive = leftToRight(expr);
    if (!Number.isFinite(naive) || !Number.isInteger(naive) || naive === value || Math.abs(naive) > LEVELS[grade].max * 2) continue;
    const [p1, p2] = shuffle(NAMES).slice(0, 2);
    const correctFirst = Math.random() < 0.5;
    const [n1, v1, n2, v2] = correctFirst ? [p1, value, p2, naive] : [p1, naive, p2, value];
    const right = correctFirst ? p1 : p2;
    return mc(`${b(n1)} says ${math(`${expr} = ${fmt({ n: BigInt(v1), d: 1n })}`)}.<br>${b(n2)} says ${math(`${expr} = ${fmt({ n: BigInt(v2), d: 1n })}`)}.<br>Who is right?`,
      right, [n1, n2, 'Neither of them'],
      `${right} is right. ${correctFirst ? p2 : p1} worked from left to right and ignored the order of operations. ${explainSteps(frames, value)}`);
  }
  return evaluate(grade)();
};

const placeBrackets = grade => () => {
  const L = LEVELS[grade];
  const ops = grade >= 6 ? [['+', '×'], ['−', '×'], ['+', '÷'], ['×', '+'], ['−', '÷']] : [['+', '×'], ['−', '×'], ['×', '+'], ['+', '÷']];
  for (let t = 0; t < 200; t++) {
    const [o1, o2] = pick(ops), [x, y, z] = [ri(L.lo, L.hi), ri(L.lo, L.hi), ri(L.lo, L.hi)];
    const plain = `${x} ${o1} ${y} ${o2} ${z}`, left = `(${x} ${o1} ${y}) ${o2} ${z}`, rightB = `${x} ${o1} (${y} ${o2} ${z})`;
    try {
      const vp = solve(plain).value, vl = solve(left).value, vr = solve(rightB).value;
      if ([vp, vl, vr].some(v => v.d !== 1n || v.n < 0n || v.n > BigInt(L.max))) continue;
      const pickLeft = vl.n !== vp.n ? true : vr.n !== vp.n ? false : null;
      if (pickLeft === null) continue;
      const target = pickLeft ? vl : vr, answer = pickLeft ? left : rightB;
      return mc(`Where do the brackets go so that this is true?<br>${math(`${plain} = ${fmt(target)}`)}`,
        answer, [left, rightB, `No brackets are needed: ${plain}`],
        `${answer}: ${stepsText(solve(answer).frames)}. Without brackets, BEDMAS gives ${fmt(vp)} instead.`);
    } catch { /* try again */ }
  }
  return evaluate(grade)();
};

const SPECS = [
  ['Bev', 'Evaluate expressions using BEDMAS', evaluate, [3, 4, 5, 6, 7, 8, 9]],
  ['Bfs', 'Which operation comes first?', firstStep, [3, 4, 5, 6, 7, 8, 9]],
  ['Bwr', 'Who is right? Spot the order-of-operations mistake', whoIsRight, [4, 5, 6, 7, 8, 9]],
  ['Bbr', 'Place the brackets to make it true', placeBrackets, [5, 6, 7, 8, 9]]
];

/** Skills { id, title, grade, section, icon, gen, learn } for grades 3–9. */
export const BEDMAS_SKILLS = SPECS.flatMap(([k, title, make, grades]) =>
  grades.map(grade => ({ id: `mth${k}${grade}`, title, grade, section: BEDMAS_SECTION, icon: '🧮', gen: make(grade), learn: 'bedmas' })));
