/* ============================================================
   BEDMAS engine: tokenize an expression and evaluate it one
   operation at a time in the correct order, recording each step.
   Pure functions (exact fraction arithmetic) — testable in Node.
   B  Brackets (innermost first)
   E  Exponents (right to left: 2^3^2 = 2^9)
   DM Division / Multiplication, left to right
   AS Addition / Subtraction, left to right
   ============================================================ */

/* ---------- exact fractions ---------- */
const gcd = (a, b) => (b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b));
export function frac(n, d = 1n) {
  n = BigInt(n); d = BigInt(d);
  if (d === 0n) throw new Error('Division by zero');
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d) || 1n;
  return { n: n / g, d: d / g };
}
const OPS = {
  '+': (a, b) => frac(a.n * b.d + b.n * a.d, a.d * b.d),
  '−': (a, b) => frac(a.n * b.d - b.n * a.d, a.d * b.d),
  '×': (a, b) => frac(a.n * b.n, a.d * b.d),
  '÷': (a, b) => { if (b.n === 0n) throw new Error('You cannot divide by zero.'); return frac(a.n * b.d, a.d * b.n); },
  '^': (a, b) => {
    if (b.d !== 1n) throw new Error('Only whole-number exponents are supported.');
    if (b.n > 12n || b.n < -12n) throw new Error('That exponent is too big for this lab.');
    let r = frac(1n);
    for (let i = 0n; i < (b.n < 0n ? -b.n : b.n); i++) r = OPS['×'](r, a);
    return b.n < 0n ? OPS['÷'](frac(1n), r) : r;
  }
};
export const fmt = f => (f.d === 1n ? String(f.n) : `${f.n}/${f.d}`).replace('-', '−');

/* ---------- tokenizer ---------- */
// tokens: { t: 'num', v: frac } | { t: 'op', v: '+'|'−'|'×'|'÷'|'^' } | { t: '(' } | { t: ')' }
export function tokenize(src) {
  const s = String(src).replace(/\s+/g, '').replace(/[*xX·]/g, '×').replace(/[/:]/g, '÷').replace(/[-–]/g, '−')
    .replace(/[[{]/g, '(').replace(/[\]}]/g, ')').replace(/²/g, '^2').replace(/³/g, '^3');
  const out = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    const prev = out[out.length - 1];
    if (/[0-9.]/.test(c) || (c === '−' && prev && prev.t === '(' && /[0-9.]/.test(s[i + 1] || ''))) {
      let j = i + 1;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const text = s.slice(i, j).replace('−', '-');
      if (!/^-?(\d+\.?\d*|\.\d+)$/.test(text)) throw new Error(`"${text}" is not a number.`);
      const [w, f = ''] = text.replace('-', '').split('.');
      const v = frac(BigInt((w || '0') + f) * (text.startsWith('-') ? -1n : 1n), 10n ** BigInt(f.length));
      // implicit multiplication: 2(3) or )(  or )2
      if (prev && (prev.t === ')' || prev.t === 'num')) out.push({ t: 'op', v: '×' });
      out.push({ t: 'num', v });
      i = j; continue;
    }
    if ('+−×÷^'.includes(c)) {
      if (c === '−' && (!prev || prev.t === 'op')) throw new Error('Put negative numbers in brackets, like (−3).');
      out.push({ t: 'op', v: c }); i++; continue;
    }
    if (c === '(') { if (prev && (prev.t === ')' || prev.t === 'num')) out.push({ t: 'op', v: '×' }); out.push({ t: '(' }); i++; continue; }
    if (c === ')') { out.push({ t: ')' }); i++; continue; }
    throw new Error(`I don't understand "${c}". Use numbers, + − × ÷ ^ and brackets.`);
  }
  validate(out);
  return out;
}
function validate(tokens) {
  if (!tokens.length) throw new Error('Type an expression first.');
  let depth = 0, expectNum = true;
  for (const tk of tokens) {
    if (tk.t === '(') { if (!expectNum) throw new Error('Missing an operation before "(".'); depth++; continue; }
    if (tk.t === ')') { if (expectNum) throw new Error('Something is missing before ")".'); if (--depth < 0) throw new Error('There is an extra ")".'); continue; }
    if (tk.t === 'num') { if (!expectNum) throw new Error('Two numbers in a row need an operation between them.'); expectNum = false; continue; }
    if (expectNum) throw new Error('Two operations in a row — something is missing.');
    expectNum = true;
  }
  if (expectNum) throw new Error('The expression ends with an operation.');
  if (depth) throw new Error('A bracket "(" is never closed.');
}

/* ---------- choosing the next operation ---------- */
const RULE = { '^': 'E', '×': 'DM', '÷': 'DM', '+': 'AS', '−': 'AS' };
// why `chosen` is not the next operation (when `right` is) — for the practice mode
export function hintFor(tokens, chosen, right) {
  const g = innermostGroup(tokens);
  if (g.bracket && (chosen < g.start || chosen >= g.end)) return 'Brackets first — finish the work inside the brackets before anything outside them.';
  const rc = RULE[tokens[chosen].v], rr = RULE[tokens[right].v];
  if (rr === 'E' && rc !== 'E') return 'Exponents come before × ÷ + −. Find the power first.';
  if (rr === 'DM' && rc === 'AS') return 'Multiplication and division come before addition and subtraction.';
  if (rr === 'E') return 'Stacked exponents are worked from right to left.';
  return 'These have the same priority, so work from left to right — there is one further left to do first.';
}
// A bracket holding just one number, like (−3), is an operand — not a group to work on.
const loneAt = (tokens, i) => tokens[i]?.t === '(' && tokens[i + 1]?.t === 'num' && tokens[i + 2]?.t === ')';
// innermost bracket group that still has an operation in it (or the whole expression):
// [start, end) of the tokens inside it
function innermostGroup(tokens) {
  const stack = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].t === '(') stack.push(i);
    else if (tokens[i].t === ')') {
      const open = stack.pop();
      const inner = tokens.slice(open + 1, i);
      const hasOp = inner.some(t => t.t === 'op');
      const nestedWork = inner.some((t, k) => t.t === '(' && !loneAt(inner, k));
      if (hasOp && !nestedWork) return { start: open + 1, end: i, bracket: true };
    }
  }
  return { start: 0, end: tokens.length, bracket: false };
}
/** Index of the operator token to do next (within its group). */
export function nextOpIndex(tokens) {
  const g = innermostGroup(tokens);
  const ops = [];
  for (let i = g.start; i < g.end; i++) if (tokens[i].t === 'op') ops.push(i);
  if (!ops.length) return null;
  const exps = ops.filter(i => tokens[i].v === '^');
  if (exps.length) return exps[exps.length - 1];                  // right-associative
  const dm = ops.filter(i => RULE[tokens[i].v] === 'DM');
  if (dm.length) return dm[0];                                     // leftmost
  return ops[0];                                                   // leftmost + or −
}
// token span [from, to] of the operand just left/right of an operator
const leftSpan = (tokens, i) => (tokens[i - 1].t === ')' ? [i - 3, i - 1] : [i - 1, i - 1]);
const rightSpan = (tokens, i) => (tokens[i + 1].t === '(' ? [i + 1, i + 3] : [i + 1, i + 1]);
const valueIn = (tokens, [from, to]) => tokens[from === to ? from : from + 1].v;
/** Token span [from, to] covered by the operation at opIndex (operands included). */
export const opSpan = (tokens, opIndex) => [leftSpan(tokens, opIndex)[0], rightSpan(tokens, opIndex)[1]];
export const currentGroup = tokens => innermostGroup(tokens);
export { RULE };

// Explanation for a step, given its rule, whether it is inside brackets, and how many
// operations are left in that bracket (or the whole expression).
function why(rule, bracket, opsLeft) {
  if (bracket) {
    if (opsLeft === 1) return 'Brackets first — work out what is inside them.';
    return 'Brackets first. ' + {
      E: 'Inside them, the exponent comes first.',
      DM: 'Inside them, × and ÷ come before + and −, working left to right.',
      AS: 'Inside them, only + and − are left, so work left to right.'
    }[rule];
  }
  if (opsLeft === 1) return 'Only one operation is left.';
  return {
    E: 'No brackets are left, so exponents come next.',
    DM: 'No brackets or exponents left: do × and ÷ next — whichever comes first from left to right.',
    AS: 'Only + and − are left: they are equal partners, so work left to right.'
  }[rule];
}
const NAME = { '+': 'add', '−': 'subtract', '×': 'multiply', '÷': 'divide', '^': 'evaluate the power' };

/** Apply the operation at opIndex → { tokens, step } (also unwraps brackets around a lone number). */
export function applyAt(tokens, opIndex) {
  const L = leftSpan(tokens, opIndex), R = rightSpan(tokens, opIndex);
  const a = valueIn(tokens, L), b = valueIn(tokens, R), op = tokens[opIndex].v;
  const value = OPS[op](a, b);
  const g = innermostGroup(tokens);
  let from = L[0], to = R[1];
  // brackets that now hold only this result can go: (2 + 3) → 5
  let unwrapped = false;
  while (tokens[from - 1]?.t === '(' && tokens[to + 1]?.t === ')') { from--; to++; unwrapped = true; }
  // a negative result after an operator or before a power keeps brackets: 4 × (−3), (−6)²
  const needsParens = value.n < 0n && (tokens[from - 1]?.t === 'op' || tokens[to + 1]?.v === '^');
  const result = { t: 'num', v: value, fresh: true };
  const next = [...tokens.slice(0, from), ...(needsParens ? [{ t: '(' }, result, { t: ')' }] : [result]), ...tokens.slice(to + 1)];
  if (needsParens) unwrapped = false;
  const rule = RULE[op];
  return {
    tokens: next.map(t => (t.fresh ? { ...t } : { ...t, fresh: false })),
    step: {
      rule, inBrackets: g.bracket, op,
      text: `${a.n < 0n && op === '^' ? `(${fmt(a)})` : fmt(a)} ${op} ${b.n < 0n ? `(${fmt(b)})` : fmt(b)} = ${fmt(value)}`,
      why: why(rule, g.bracket, tokens.slice(g.start, g.end).filter(t => t.t === 'op').length) +
        (unwrapped ? ' The brackets now hold a single number, so they can go.' : ''),
      action: NAME[op]
    }
  };
}

/** Full worked solution: [{ tokens, opIndex, step }] plus the final value. */
export function solve(src) {
  let tokens = tokenize(src);
  const frames = [];
  for (let guard = 0; guard < 60; guard++) {
    const i = nextOpIndex(tokens);
    if (i === null) break;
    const { tokens: next, step } = applyAt(tokens, i);
    frames.push({ tokens, opIndex: i, step });
    tokens = next;
  }
  while (tokens.length === 3 && loneAt(tokens, 0)) tokens = [tokens[1]];   // e.g. just "(−3)"
  if (tokens.length !== 1 || tokens[0].t !== 'num') throw new Error('Could not simplify that expression.');
  return { frames, final: tokens, value: tokens[0].v };
}

export const tokensText = tokens => tokens.map(t => (t.t === 'num' ? fmt(t.v) : t.t === 'op' ? t.v : t.t)).join(' ').replace(/\( /g, '(').replace(/ \)/g, ')');

/* ---------- random practice expressions ---------- */
const ri = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = arr => arr[ri(0, arr.length - 1)];
const TEMPLATES = {
  1: ['a + b × c', 'a × b − c', 'a − b ÷ c', 'a + b × c − d', 'a × b + c × d'],
  2: ['(a + b) × c', 'a × (b − c)', '(a + b) ÷ c + d', 'a + (b − c) × d', 'a − b × (c + d)'],
  3: ['a + b ^ 2', '(a + b) ^ 2 − c', 'a × b ^ 2', 'a ^ 2 − b × c', '(a − b) ^ 2 ÷ c', 'a + b × (c − d) ^ 2'],
  4: ['a ÷ b × c', 'a − b + c', 'a ÷ b ÷ c', 'a × (b + (c − d))', '(a + b × c) ÷ d', 'a − (b − c) × d ^ 2']
};
/** A random expression whose every step stays a whole number from 0 to 999. */
export function randomExpression(level = 1) {
  for (let tries = 0; tries < 400; tries++) {
    const tpl = pick(TEMPLATES[level] || TEMPLATES[1]);
    const expr = tpl.replace(/[abcd]/g, () => String(ri(1, 12))).replace(/\^ \d+/g, '^ 2');
    try {
      const { frames, value } = solve(expr);
      const ok = frames.every(f => applyAt(f.tokens, f.opIndex).tokens.filter(t => t.t === 'num').every(t => t.v.d === 1n && t.v.n >= 0n && t.v.n < 1000n));
      if (ok && value.d === 1n && frames.length >= 2) return expr;
    } catch { /* try again */ }
  }
  return '3 + 4 × 2';
}

// Common mistakes worth seeing worked out
export const TRAPS = [
  { expr: '8 ÷ 2 × 4', note: '÷ and × are equal partners — go left to right. 8 ÷ 2 = 4 first, so the answer is 16, not 1.' },
  { expr: '10 − 4 + 3', note: '− and + are equal partners — left to right gives 9, not 3.' },
  { expr: '6 + 3 × 2', note: 'Multiply before adding: 6 + 6 = 12, not 18.' },
  { expr: '2 × 3 ^ 2', note: 'The exponent belongs only to the 3: 2 × 9 = 18, not 36.' },
  { expr: '(2 × 3) ^ 2', note: 'With brackets the whole product is squared: 6² = 36.' },
  { expr: '(−3) ^ 2', note: 'A negative number in brackets squared is positive: 9.' },
  { expr: '2 ^ 3 ^ 2', note: 'Stacked exponents go right to left: 3² = 9 first, then 2⁹ = 512.' },
  { expr: '12 ÷ (2 + 4) × 3', note: 'Brackets first (6), then left to right: 12 ÷ 6 × 3 = 6.' }
];
