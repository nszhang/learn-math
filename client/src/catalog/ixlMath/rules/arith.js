/* ============================================================
   Arithmetic family (Grades 1–5): addition, subtraction, multiplication,
   division and mixes of them. One rule reads a skill's TITLE — operation,
   size ("sums up to 20", "three digits", "facts up to 12"), and style
   (compute, complete the sentence, balance, input/output, word problem,
   models, true/false, missing digits, estimate, inequality …) — and builds
   the generator. Rules before it in the list take precedence.
   ============================================================ */
import {
  ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, num, mc, yesNo, near, digits, fix, big,
  emojiRow, baseTen, tenFrame, numberLine, thing, NAMES, svg, C, words
} from '../h.js';
import { R } from '../engine.js';
import { STORIES, randomAddSubStory } from '../stories.js';

const SYM = { add: '+', sub: '−', mul: '×', div: '÷' };
const LIMIT_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };

/* ---------- title parsing ---------- */
export function parseTitle(title, grade) {
  const t = title.toLowerCase();
  const ops = [];
  const hasAdd = /\badd(ition|ing)?\b|\bsums?\b|\baddend/.test(t), hasSub = /subtract|\bdifferences?\b/.test(t);
  const hasMul = /multipl|\bproducts?\b/.test(t), hasDiv = /divis|divide|\bquotients?\b|\bdividing\b/.test(t);
  if (hasAdd) ops.push('add');
  if (hasSub) ops.push('sub');
  if (hasMul) ops.push('mul');
  if (hasDiv) ops.push('div');
  const P = { ops, title: t, grade };
  // digits ("up to three digits", "two-digit")
  const dm = [...t.matchAll(/(one|two|three|four|five|six)[- ]digits?/g)].map(x => LIMIT_WORDS[x[1]]);
  if (dm.length) { P.d = Math.max(...dm); if (new Set(dm).size > 1) P.oneDigitOperand = true; }
  // numeric limit ("sums up to 20", "up to 100", "to 1000")
  let n = t.match(/(?:sums?|facts|up) (?:to|up to) ([\d ]+)/) || t.match(/\bup to ([\d ]+)\b/) || t.match(/ to ([\d ]+)\b/);
  if (n && !P.d) P.lim = parseInt(n[1].replace(/\s/g, ''), 10);
  if (/facts for 2, 3 and 4/.test(t)) P.factors = [2, 3, 4];
  else if (/facts for 2, 5 and 10|for 2, 5 and 10/.test(t)) P.factors = [2, 5, 10];
  else if (/for 6, 7, 8 and 9/.test(t)) P.factors = [6, 7, 8, 9];
  else if (/for 2, 3, 4, 5 and 10/.test(t)) P.factors = [2, 3, 4, 5, 10];
  else if (/facts up to 5/.test(t)) P.factors = [1, 2, 3, 4, 5];
  else if (/facts up to 10|facts to 10/.test(t)) P.factors = range(1, 10);
  else if (/facts up to 12|facts to 12/.test(t)) P.factors = range(1, 12);
  if (/without regrouping/.test(t)) P.regroup = false;
  else if (/with regrouping/.test(t)) P.regroup = true;
  P.regroupOne = !!P.oneDigitOperand || /and a one-digit|a one-digit number from|a one-digit number to/.test(t);
  P.zeros = /ending in zeros|multiples? of (?:ten|10|100)|multiple of ten/.test(t);
  P.mixedGrade = grade;
  return P;
}

/* ---------- operand drawing ---------- */
const carries = (a, c) => { let carry = 0, any = false, x = a, y = c; while (x > 0 || y > 0) { const s = (x % 10) + (y % 10) + carry; carry = s >= 10 ? 1 : 0; if (carry) any = true; x = Math.floor(x / 10); y = Math.floor(y / 10); } return any; };
const borrows = (a, c) => { let x = a, y = c; while (y > 0) { if (x % 10 < y % 10) return true; x = Math.floor(x / 10); y = Math.floor(y / 10); } return false; };

function defaultLim(P) {
  if (P.lim) return P.lim;
  return P.grade <= 1 ? 20 : P.grade === 2 ? 100 : P.grade === 3 ? 1000 : P.grade === 4 ? 10000 : 100000;
}

/** returns {a, b, r, op, sym} for op in add|sub|mul|div */
export function draw(op, P) {
  for (let tries = 0; tries < 60; tries++) {
    let a, c, r;
    if (op === 'add') {
      if (P.d) {
        const dd = P.d, oneDigit = P.regroupOne;
        a = P.zeros ? ri(1, 9) * 10 ** (dd - 1) : digits(dd);
        c = oneDigit ? ri(1, 9) : P.zeros ? ri(1, 9) * 10 ** (dd - 1) : (dd > 2 && Math.random() < 0.25 ? digits(dd - 1) : digits(dd));
      } else {
        const lim = defaultLim(P);
        a = ri(P.grade <= 2 ? 0 : 1, lim - 1); c = ri(0, lim - a);
        if (lim <= 20 && !/zero|0/.test(P.title)) { a = ri(1, Math.max(1, lim - 1)); c = ri(1, Math.max(1, lim - a)); }
      }
      r = a + c;
      if (P.regroup === true && !carries(a, c)) continue;
      if (P.regroup === false && carries(a, c)) continue;
    } else if (op === 'sub') {
      if (P.d) {
        const dd = P.d, oneDigit = P.regroupOne;
        a = P.zeros ? ri(2, 9) * 10 ** (dd - 1) : digits(dd);
        c = oneDigit ? ri(1, 9) : P.zeros ? ri(1, a / 10 ** (dd - 1) - 1) * 10 ** (dd - 1) : ri(10 ** (dd - 1) * (dd > 1 ? 1 : 0) + 1, a);
        if (c > a) continue;
      } else {
        const lim = defaultLim(P);
        a = ri(1, lim); c = ri(0, a);
      }
      r = a - c;
      if (P.regroup === true && !borrows(a, c)) continue;
      if (P.regroup === false && borrows(a, c)) continue;
    } else if (op === 'mul') {
      const f = P.factors;
      if (P.zeros) { a = ri(2, 9) * 10 ** ri(1, 2); c = ri(2, 9) * 10 ** ri(0, 1); }
      else if (f) { a = pick(f); c = ri(P.factors.includes(1) ? 1 : 2, Math.max(...f) <= 5 ? 5 : Math.max(...f) === 12 ? 12 : 10); if (P.factors.length > 3 && P.factors.length < 10) c = ri(2, 10); }
      else if (P.d) { a = ri(2, 9); c = P.d === 1 ? ri(2, 9) : digits(P.d); }
      else { a = ri(2, 9); c = ri(2, 9); }
      r = a * c;
    } else {
      const f = P.factors;
      if (P.zeros) { c = ri(2, 9); const q = ri(2, 9) * 10 ** ri(0, 2); a = c * q; r = q; }
      else {
        c = f ? pick(f) : ri(2, 9);
        if (f && f.includes(1) && Math.random() < 0.15) c = 1;
        const maxq = f && Math.max(...f) <= 5 ? 5 : f && Math.max(...f) === 12 ? 12 : f ? 10 : 9;
        const q = P.d ? Math.max(2, Math.floor(digits(P.d) / c)) : ri(f && f.includes(1) ? 1 : 2, maxq);
        a = c * q; r = q;
      }
    }
    return { a, b: c, r, op, sym: SYM[op] };
  }
  return null;
}

const pickOp = P => pick(P.ops.length ? P.ops : ['add']);
const expr = ({ a, b: c, sym }) => `${fmt(a)} ${sym} ${fmt(c)}`;
const eq = d => `${expr(d)} = ${fmt(d.r)}`;
const w = s => m(s);

/* ---------- kinds ---------- */
const K = {};

K.compute = P => () => {
  const d = draw(pickOp(P), P); if (!d) return null;
  return num(`Solve. ${w(`${expr(d)} = ?`)}`, d.r, `${expr(d)} = ${b(fmt(d.r))}.`);
};

K.complete = P => () => {
  const d = draw(pickOp(P), P); if (!d) return null;
  const hide = pick(['a', 'b', 'r']), s = d.sym;
  const A = hide === 'a' ? '___' : fmt(d.a), B = hide === 'b' ? '___' : fmt(d.b), Rr = hide === 'r' ? '___' : fmt(d.r);
  const ans = hide === 'a' ? d.a : hide === 'b' ? d.b : d.r;
  return num(`Fill in the missing number. ${w(`${A} ${s} ${B} = ${Rr}`)}`, ans, `${eq(d)}, so the missing number is ${b(fmt(ans))}.`);
};

K.balance = P => () => {
  const op = pickOp(P); if (op !== 'add' && op !== 'sub') return null;
  const d = draw(op, P); if (!d) return null;
  if (op === 'add') {
    const c = ri(0, d.r), ans = d.r - c;
    return num(`Make both sides equal. ${w(`${expr(d)} = ${fmt(c)} + ___`)}`, ans, `${expr(d)} = ${fmt(d.r)}, and ${fmt(c)} + ${fmt(ans)} = ${fmt(d.r)}. The missing number is ${b(fmt(ans))}.`);
  }
  const c = d.r + ri(0, Math.max(1, Math.min(d.a, 30))), ans = c - d.r;
  return num(`Make both sides equal. ${w(`${expr(d)} = ${fmt(c)} − ___`)}`, ans, `${expr(d)} = ${fmt(d.r)}, and ${fmt(c)} − ${fmt(ans)} = ${fmt(d.r)}. The missing number is ${b(fmt(ans))}.`);
};

K.trueFalse = P => () => {
  const d = draw(pickOp(P), P); if (!d) return null;
  const truth = Math.random() < 0.5, shown = truth ? d.r : d.r + pick([-10, -1, 1, 2, 10, -2]) * (d.r > 12 ? 1 : 1);
  const val = Math.max(0, shown === d.r && !truth ? d.r + 1 : shown);
  const isTrue = val === d.r;
  return yesNo(`Is this number sentence true or false?<br>${w(`${expr(d)} = ${fmt(val)}`)}`, isTrue, `${expr(d)} = ${fmt(d.r)}, so the sentence is ${isTrue ? 'true' : 'false'}.`);
};

K.whichTrue = P => () => {
  const op = pickOp(P), d = draw(op, P); if (!d) return null;
  const wrong = near(d.r, 6, 4, { min: 0 }).filter(x => x !== d.r).slice(0, 3);
  return mc(`Which number sentence is true?`, eq(d).replace(/^/, ''), wrong.map(x => `${expr(d)} = ${fmt(x)}`), `${expr(d)} = ${b(fmt(d.r))}.`);
};

K.io = P => () => {
  const op = pickOp(P), rule = pick(range(2, op === 'mul' || op === 'div' ? 9 : P.lim && P.lim <= 20 ? 9 : P.grade >= 3 ? 99 : 20));
  let ins;
  if (op === 'add') ins = sample(range(1, Math.min(30, (P.lim || 100) - rule)), 4);
  else if (op === 'sub') ins = sample(range(rule + 1, rule + 30), 4);
  else if (op === 'mul') ins = sample(range(1, 12), 4);
  else ins = sample(range(1, 12), 4).map(x => x * rule);
  const f = x => (op === 'add' ? x + rule : op === 'sub' ? x - rule : op === 'mul' ? x * rule : x / rule);
  const label = { add: 'Add', sub: 'Subtract', mul: 'Multiply by', div: 'Divide by' }[op] + ' ' + rule;
  const rows = ins.map(x => `<tr><td style="border:1px solid #cbd5e1;padding:3px 14px;text-align:center">${fmt(x)}</td><td style="border:1px solid #cbd5e1;padding:3px 14px;text-align:center">${fmt(f(x))}</td></tr>`);
  const hdr = '<tr><th style="border:1px solid #cbd5e1;padding:3px 14px;background:#eef2ff">Input</th><th style="border:1px solid #cbd5e1;padding:3px 14px;background:#eef2ff">Output</th></tr>';
  if (/find the rule|rule for/.test(P.title)) {
    const rules = ['Add', 'Subtract', 'Multiply by', 'Divide by'].map(x => `${x} ${rule}`);
    const alt = [`Add ${rule + 1}`, `Subtract ${rule}`, `Add ${rule - 1 || 3}`];
    return mc(`<table style="border-collapse:collapse;margin:6px 0">${hdr}${rows.join('')}</table>What is the rule?`, label, op === 'add' ? ['Subtract ' + rule, 'Multiply by ' + rule, `Add ${rule + 1}`] : op === 'sub' ? ['Add ' + rule, `Subtract ${rule + 1}`, 'Divide by ' + rule] : op === 'mul' ? ['Add ' + rule, `Multiply by ${rule + 1}`, 'Divide by ' + rule] : ['Subtract ' + rule, `Divide by ${rule + 1}`, 'Multiply by ' + rule], `Compare input and output: the rule is ${b(label.toLowerCase())}.`);
  }
  const last = ins.length - 1, shown = rows.slice(0, last).concat([`<tr><td style="border:1px solid #cbd5e1;padding:3px 14px;text-align:center">${fmt(ins[last])}</td><td style="border:1px solid #cbd5e1;padding:3px 14px;text-align:center">?</td></tr>`]);
  return num(`The rule is ${b(label.toLowerCase())}.<table style="border-collapse:collapse;margin:6px 0">${hdr}${shown.join('')}</table>What is the missing output?`, f(ins[last]), `${fmt(ins[last])} ${SYM[op]} ${rule} = ${b(fmt(f(ins[last])))}.`);
};

K.fillDigits = P => () => {
  const op = pickOp(P); if (op !== 'add' && op !== 'sub') return null;
  const d = draw(op, { ...P, d: P.d || 3 }); if (!d) return null;
  const parts = [d.a, d.b, d.r].map(x => String(x));
  const which = ri(0, 2), s = parts[which], i = ri(0, s.length - 1);
  if (i === 0 && s.length > 1 && which === 2) { /* leading digit of result is fine */ }
  const ans = +s[i], shown = parts.map((p, k) => (k === which ? p.slice(0, i) + '?' + p.slice(i + 1) : p));
  const text = `${shown[0]}<br>${op === 'add' ? '+' : '−'} ${shown[1]}<br>= ${shown[2]}`;
  return num(`What digit does the ${b('?')} stand for?<br><div style="font-family:monospace;font-size:20px;line-height:1.4;margin:6px 0">${text}</div>`, ans, `Use the whole sentence ${eq(d)}. The missing digit is ${b(ans)}.`);
};

K.inequality = P => () => {
  const d = draw(pickOp(P), P); if (!d) return null;
  const c = Math.random() < 0.15 ? d.r : Math.max(0, d.r + pick([-12, -5, -2, -1, 1, 2, 5, 12]));
  const sym = d.r === c ? '=' : d.r > c ? '>' : '<';
  return mc(`Choose the symbol that makes the sentence true.<br>${w(`${expr(d)} ___ ${fmt(c)}`)}`, sym, ['<', '>', '='], `${expr(d)} = ${fmt(d.r)}, and ${fmt(d.r)} ${sym} ${fmt(c)}.`, 3);
};

K.estimate = P => () => {
  const op = pickOp(P), d = draw(op, { ...P, d: P.d || (P.grade >= 4 ? 4 : 3) }); if (!d) return null;
  const rnd = x => { const p = 10 ** Math.max(1, String(Math.floor(Math.abs(x))).length - 1); return Math.round(x / p) * p; };
  if (op === 'div') {
    const a = d.a + ri(1, d.b - 1), est = Math.round(a / d.b);
    return num(`Estimate. ${w(`${fmt(a)} ÷ ${fmt(d.b)}`)}<br><span class="muted">Use a nearby number you can divide easily.</span>`, Math.round(rnd(a) / d.b) === Math.round(a / d.b) ? est : Math.round(rnd(a) / d.b) || est, `${fmt(a)} is close to ${fmt(Math.round(a / d.b) * d.b)}, and ${fmt(Math.round(a / d.b) * d.b)} ÷ ${fmt(d.b)} = ${b(fmt(est))}.`);
  }
  const A = rnd(d.a), B = op === 'mul' ? rnd(d.b) : rnd(d.b);
  const ans = op === 'add' ? A + B : op === 'sub' ? A - B : A * B;
  return num(`Estimate by rounding each number. ${w(`${expr(d)}`)}`, ans, `Round: ${fmt(A)} ${d.sym} ${fmt(B)} = ${b(fmt(ans))}.`);
};

K.pattern = P => () => {
  const op = pickOp(P), a = ri(2, 9), c = ri(2, 9);
  const o = op === 'sub' ? 'sub' : op === 'mul' ? 'mul' : op === 'div' ? 'div' : 'add';
  const A = o === 'sub' ? Math.max(a, c) : a, B = o === 'sub' ? Math.min(a, c) : c;
  const val = (x, y) => (o === 'add' ? x + y : o === 'sub' ? x - y : o === 'mul' ? x * y : x / y);
  const s = SYM[o];
  if (o === 'div') { const q = ri(2, 9), dv = ri(2, 9); return num(`Look for the pattern. ${w(`${dv * q} ÷ ${dv} = ${q}`)}<br>${w(`${dv * q * 10} ÷ ${dv} = ${q * 10}`)}<br>${w(`${dv * q * 100} ÷ ${dv} = ?`)}`, q * 100, `Each extra zero in the dividend adds a zero to the quotient: ${b(q * 100)}.`); }
  if (o === 'mul') return num(`Look for the pattern. ${w(`${A} × ${B} = ${A * B}`)}<br>${w(`${A * 10} × ${B} = ${A * B * 10}`)}<br>${w(`${A * 100} × ${B} = ?`)}`, A * B * 100, `Each extra zero in the factor adds a zero to the product: ${b(fmt(A * B * 100))}.`);
  return num(`Look for the pattern. ${w(`${A} ${s} ${B} = ${val(A, B)}`)}<br>${w(`${A * 10} ${s} ${B * 10} = ${val(A, B) * 10}`)}<br>${w(`${A * 100} ${s} ${B * 100} = ?`)}`, val(A, B) * 100, `${A} ${s} ${B} = ${val(A, B)}. With hundreds: ${b(fmt(val(A, B) * 100))}.`);
};

K.multi = P => () => {
  const op = pickOp(P) === 'mul' ? 'mul' : 'add', n = /four/.test(P.title) ? ri(3, 4) : ri(3, 4);
  if (op === 'mul') { const xs = range(1, n).map(() => ri(2, 6)); return num(`Multiply. ${w(xs.join(' × ') + ' = ?')}`, xs.reduce((x, y) => x * y, 1), `${xs.join(' × ')} = ${b(xs.reduce((x, y) => x * y, 1))}.`); }
  const dd = P.d || (P.grade <= 1 ? 1 : P.grade === 2 ? 2 : P.grade === 3 ? 3 : 4), xs = range(1, n).map(() => (P.grade <= 1 ? ri(1, 6) : dd === 1 ? ri(1, 9) : digits(dd)));
  return num(`Add. ${w(xs.map(fmt).join(' + ') + ' = ?')}`, sum(xs), `${xs.map(fmt).join(' + ')} = ${b(fmt(sum(xs)))}.`);
};

K.terms = () => () => {
  const bank = [
    ['addend', '3 + 5 = 8', '3', ['sum', 'difference']], ['addend', '6 + 2 = 8', '2', ['sum', 'difference']], ['sum', '4 + 6 = 10', '10', ['addend', 'difference']],
    ['sum', '7 + 2 = 9', '9', ['addend', 'difference']], ['difference', '9 − 4 = 5', '5', ['sum', 'addend']], ['difference', '12 − 5 = 7', '7', ['sum', 'addend']],
    ['factor', '3 × 4 = 12', '3', ['product', 'quotient']], ['product', '3 × 4 = 12', '12', ['factor', 'quotient']], ['quotient', '12 ÷ 3 = 4', '4', ['product', 'factor']],
    ['dividend', '12 ÷ 3 = 4', '12', ['divisor', 'quotient']], ['divisor', '12 ÷ 3 = 4', '3', ['dividend', 'quotient']]
  ];
  const [ans, eqn, part, others] = pick(bank);
  return mc(`In the number sentence ${w(eqn)}, what is ${b(part)} called?`, ans, others, `In ${eqn}, ${part} is the ${b(ans)}.`, 3);
};
K.relatedFacts = P => () => {
  const op = P.ops.includes('mul') || P.ops.includes('div') ? pick(['mul', 'div']) : pick(['add', 'sub']);
  const x = ri(2, op === 'add' || op === 'sub' ? 10 : 9), y = ri(2, op === 'add' || op === 'sub' ? 9 : 9);
  if (op === 'add' || op === 'sub') return num(`${w(`${x} + ${y} = ${x + y}`)}<br>Use this fact to solve: ${w(`${x + y} − ${y} = ?`)}`, x, `If ${x} + ${y} = ${x + y}, then ${x + y} − ${y} = ${b(x)}.`);
  return num(`${w(`${x} × ${y} = ${x * y}`)}<br>Use this fact to solve: ${w(`${x * y} ÷ ${y} = ?`)}`, x, `If ${x} × ${y} = ${x * y}, then ${x * y} ÷ ${y} = ${b(x)}.`);
};

K.property = P => () => {
  const mulP = P.ops.includes('mul');
  if (!mulP) {
    const a = ri(2, 9), c = ri(2, 9), e = ri(2, 9);
    const t = pick([
      [`${a} + ${c} = ${c} + ${a}`, 'Commutative property (add in any order)'],
      [`(${a} + ${c}) + ${e} = ${a} + (${c} + ${e})`, 'Associative property (group differently)'],
      [`${a} + 0 = ${a}`, 'Identity property (adding zero)']
    ]);
    return mc(`Which property does this show?<br>${w(t[0])}`, t[1], ['Commutative property (add in any order)', 'Associative property (group differently)', 'Identity property (adding zero)'].filter(x => x !== t[1]), `${t[0]} uses the ${b(t[1].split(' (')[0].toLowerCase())}.`, 3);
  }
  const a = ri(2, 9), c = ri(2, 9), e = ri(2, 9);
  const t = pick([
    [`${a} × ${c} = ${c} × ${a}`, 'Commutative property'], [`(${a} × ${c}) × ${e} = ${a} × (${c} × ${e})`, 'Associative property'],
    [`${a} × 1 = ${a}`, 'Identity property'], [`${a} × 0 = 0`, 'Zero property'], [`${a} × (${c} + ${e}) = ${a} × ${c} + ${a} × ${e}`, 'Distributive property']
  ]);
  return mc(`Which property does this show?<br>${w(t[0])}`, t[1], ['Commutative property', 'Associative property', 'Identity property', 'Zero property', 'Distributive property'].filter(x => x !== t[1]), `This shows the ${b(t[1].toLowerCase())}.`);
};

K.useProperty = P => () => {
  if (P.ops.includes('mul')) {
    const a = ri(2, 9), c = ri(2, 5), e = ri(2, 5);
    return num(`Use a property to multiply. ${w(`${c} × ${a} × ${e}`)}<br><span class="muted">Try grouping to make an easy product first.</span>`, c * a * e, `${c} × ${a} × ${e} = ${b(c * a * e)}.`);
  }
  const x = ri(2, 9), y = ri(1, 9 - 1), z = 10 - x;
  return num(`Use a property to add. ${w(`${x} + ${y + 1} + ${z}`)}<br><span class="muted">Hint: look for numbers that make ten.</span>`, x + y + 1 + z, `${x} + ${z} = 10, and 10 + ${y + 1} = ${b(10 + y + 1)}.`);
};

K.choosePair = P => () => {
  const op = pickOp(P), d = draw(op, P); if (!d) return null;
  const label = { add: 'a sum', sub: 'a difference', mul: 'a product', div: 'a quotient' }[op];
  const wrongs = [];
  for (let i = 0; i < 40 && wrongs.length < 3; i++) { const w2 = draw(op, P); if (w2 && w2.r !== d.r && !wrongs.some(x => x.a === w2.a && x.b === w2.b)) wrongs.push(w2); }
  if (wrongs.length < 2) return null;
  return mc(`Which expression has ${label} of ${b(fmt(d.r))}?`, expr(d), wrongs.map(expr), `${expr(d)} = ${b(fmt(d.r))}.`);
};

K.ways = P => () => {
  const op = pickOp(P), n = ri(5, Math.min(defaultLim(P), 20)), good = [], bad = [];
  if (op === 'sub') {
    for (let i = 0; i < 3; i++) { const a = ri(n + 1, Math.min(n + 8, 20)), c = a - n; good.push(`${a} − ${c}`); }
    for (let i = 0; i < 4; i++) { const a = ri(n, Math.min(n + 8, 20)), off = pick([-3, -2, -1, 1, 2, 3]), c = a - n + off; if (c >= 0 && c <= a) bad.push(`${a} − ${c}`); }
  } else {
    for (let i = 0; i < 3; i++) { const a = ri(0, n); good.push(`${a} + ${n - a}`); }
    for (let i = 0; i < 4; i++) { const a = ri(0, n), off = pick([-3, -2, -1, 1, 2, 3]), c = n - a + off; if (c >= 0) bad.push(`${a} + ${c}`); }
  }
  const ans = pick(good), val = x => { const [p, o, q] = x.split(' '); return o === '+' ? +p + +q : +p - +q; };
  const wrong = bad.filter(x => val(x) !== n);
  if (wrong.length < 3) return null;
  return mc(`Which expression equals ${b(n)}?`, ans, wrong, `${ans} = ${b(n)}.`);
};

/* ---------- word problems ---------- */
const operandsFor = (op, P) => {
  const d = draw(op, P); if (!d) return null;
  return d;
};
K.wp = P => () => {
  const op = pickOp(P), d = operandsFor(op, P); if (!d) return null;
  const unknown = /change unknown|start unknown|addend unknown|one addend unknown/.test(P.title) ? (P.title.match(/change|start|one addend/) || [''])[0] : '';
  const pic = /pictures?|cube/.test(P.title);
  const A = d.a, B = d.b;
  let story;
  if (op === 'add') {
    if (unknown === 'change') story = STORIES.changeUnknown({ a: A, b: B });
    else if (unknown === 'start') story = STORIES.startUnknown({ a: A, b: B });
    else if (unknown === 'one addend') story = STORIES.addendUnknown({ a: A, b: B });
    else story = pick([STORIES.addJoin, STORIES.addTotal])({ a: A, b: B });
  } else if (op === 'sub') {
    if (unknown === 'change') story = STORIES.subChangeUnknown({ a: A, b: B });
    else if (unknown === 'start') story = STORIES.subStartUnknown({ a: A, b: B });
    else story = pick([STORIES.subTake, STORIES.subCompare])({ a: A, b: B });
  } else if (op === 'mul') {
    story = pick([STORIES.mulGroups, STORIES.mulArray, STORIES.mulCompare])({ a: A, b: B });
  } else {
    story = pick([STORIES.divShare, STORIES.divGroups])({ a: B, b: d.r });
  }
  return wpQuestion(P, story, pic);
};

function wpQuestion(P, s, pic) {
  const pre = pic && s.emoji ? '' : '';
  if (/sentences? for word problems|write .* sentences? for/.test(P.title)) {
    const [lhs] = s.eq.split(' = ');
    const full = s.eq.replace('?', fmt(s.ans));
    const alt = shuffle([full.replace('+', '−').replace('×', '÷'), s.eq.replace('?', fmt(s.ans + 1)), s.eq.replace('?', fmt(Math.max(0, s.ans - 1)))]);
    return mc(`${s.text}<br>Which number sentence matches the story?`, full, alt.filter(x => x !== full), `The story matches ${b(full)}.`);
  }
  const extra = pic && s.emoji && s.ans <= 20 ? `<div style="font-size:22px;margin:6px 0">${s.emoji.repeat(Math.min(20, s.ans))}</div>` : '';
  return num(`${s.text}`, s.ans, `${s.eq.replace('?', fmt(s.ans))}. The answer is ${b(fmt(s.ans))}.`);
}

/* ---------- models ---------- */
K.models = P => () => {
  const op = pickOp(P), dd = P.d || 2;
  const d = draw(op === 'sub' ? 'sub' : 'add', { ...P, d: dd });
  if (!d) return null;
  const hundreds = x => Math.floor(x / 100), tens = x => Math.floor(x / 10) % 10, ones = x => x % 10;
  const pic = x => baseTen(hundreds(x), tens(x), ones(x));
  return num(`${pic(d.a)}<div style="font-size:24px;font-weight:700">${op === 'sub' ? '−' : '+'}</div>${pic(d.b)}What is ${w(expr(d))}?`, d.r, `Count the blocks together: ${eq(d)}.`);
};

/* ---------- picture-based number sentences (Grade 1–2) ---------- */
const cubes = (n, color) => `<span style="color:${color};font-size:26px;letter-spacing:2px">${'■'.repeat(n)}</span>`;
K.cubes = P => () => {
  const op = pickOp(P) === 'sub' ? 'sub' : 'add', lim = P.lim || 10;
  if (op === 'add') {
    const a = ri(1, lim - 1), c = ri(1, lim - a);
    return num(`${cubes(a, C.blue)} ${cubes(c, C.accent)}<br>How many cubes are there in all?`, a + c, `${a} + ${c} = ${b(a + c)}.`);
  }
  const a = ri(2, lim), c = ri(1, a - 1);
  return num(`${cubes(a, C.blue)}<br>Take away ${b(c)}. How many are left?`, a - c, `${a} − ${c} = ${b(a - c)}.`);
};
K.pictureSum = P => () => {
  const op = pickOp(P) === 'sub' ? 'sub' : 'add', lim = P.lim || 10, [, , e] = thing(), [, , e2] = thing();
  if (op === 'add') { const a = ri(1, lim - 1), c = ri(1, lim - a); return num(`${emojiRow(e, a)}${emojiRow(e2 === e ? '🔶' : e2, c)}How many are there in all?`, a + c, `${a} + ${c} = ${b(a + c)}.`); }
  const a = ri(2, lim), c = ri(1, a - 1);
  return num(`${emojiRow(e, a)}${c} ${e} fly away. How many are left?`, a - c, `${a} − ${c} = ${b(a - c)}.`);
};
K.sentenceForPicture = P => () => {
  const op = pickOp(P) === 'sub' ? 'sub' : 'add', lim = P.lim || 10, [, , e] = thing();
  if (op === 'add') { const a = ri(1, lim - 1), c = ri(1, lim - a), full = `${a} + ${c} = ${a + c}`; return mc(`${cubes(a, C.blue)} ${cubes(c, C.accent)}<br>Which number sentence matches the picture?`, full, [`${a} + ${c} = ${a + c + 1}`, `${a + 1} + ${c} = ${a + c}`, `${a} − ${c} = ${Math.abs(a - c)}`], `${b(a)} blue cubes and ${b(c)} orange cubes: ${b(full)}.`); }
  const a = ri(2, lim), c = ri(1, a - 1), full = `${a} − ${c} = ${a - c}`;
  return mc(`${cubes(a - c, C.blue)}${cubes(c, '#cbd5e1')}<br>(${a} cubes, ${c} are crossed out.) Which number sentence matches?`, full, [`${a} − ${c} = ${a - c + 1}`, `${a} + ${c} = ${a + c}`, `${a - c} − ${c} = ${Math.max(0, a - 2 * c)}`], `${a} cubes take away ${c} leaves ${a - c}: ${b(full)}.`);
};
K.modelForSentence = P => () => {
  const lim = P.lim || 10, sub = pickOp(P) === 'sub';
  const a = sub ? ri(3, lim) : ri(1, lim - 1), c = sub ? ri(1, a - 1) : ri(1, lim - a);
  const total = sub ? a : a + c;
  const optsAdd = [[a, c], [a + 1, c], [a, c + 1], [a - 1 || 2, c]].map(x => `${'●'.repeat(x[0])} + ${'○'.repeat(x[1])}`);
  const optsSub = [[a, c], [a, c + 1], [a - 1, c], [a + 1, c]].map(x => `${'●'.repeat(x[0])} take away ${x[1]}`);
  const opts = sub ? optsSub : optsAdd;
  return mc(`Which model matches ${w(sub ? `${a} − ${c}` : `${a} + ${c}`)}?`, opts[0], opts.slice(1), `${sub ? `Start with ${a} and take away ${c}.` : `${a} counter${a === 1 ? '' : 's'} and ${c} more.`}`);
};
K.numberLineJump = P => () => {
  const sub = pickOp(P) === 'sub', lim = P.lim || 10;
  const a = sub ? ri(3, lim) : ri(1, lim - 2), c = sub ? ri(1, a - 1) : ri(1, lim - a), res = sub ? a - c : a + c;
  const marks = [{ v: a, label: String(a), color: C.blue }, { v: res, label: String(res), color: C.red }];
  const full = `${a} ${sub ? '−' : '+'} ${c} = ${res}`;
  return mc(`${numberLine({ min: 0, max: Math.max(lim, 10), marks, labelEvery: lim > 20 ? 5 : 1 })}Start at the blue point and ${sub ? 'jump back' : 'jump forward'} to the red point. Which number sentence matches?`, full, [`${a} ${sub ? '+' : '−'} ${c} = ${res}`, `${a} ${sub ? '−' : '+'} ${c + 1} = ${res}`, `${res} ${sub ? '−' : '+'} ${c} = ${a}`], `The jump is ${c}: ${b(full)}.`);
};
K.wordToSentence = P => () => {
  const sub = pickOp(P) === 'sub', lim = P.lim || 10;
  const a = sub ? ri(3, lim) : ri(1, lim - 1), c = sub ? ri(1, a - 1) : ri(1, lim - a);
  const s = sub ? STORIES.subTake({ a, b: c }) : STORIES.addJoin({ a, b: c });
  const full = s.eq.replace('?', s.ans);
  return mc(`${s.text}<br>Which number sentence matches?`, full, [s.eq.replace('?', s.ans + 1), sub ? `${a} + ${c} = ${a + c}` : `${a} − ${c} = ${Math.abs(a - c)}`, `${c} ${sub ? '−' : '+'} ${a} = ${sub ? Math.abs(c - a) : a + c}`].filter(x => x !== full), `${b(full)}.`);
};

/* ---------- Grade 1 strategies ---------- */
K.countOn = P => () => {
  const lim = P.lim || 10, sub = /subtract|count(?:ing)? back/.test(P.title) && !/counting on/.test(P.title), a = ri(2, lim - 1), c = ri(1, 3);
  if (/counting on/.test(P.title) && sub) { const x = ri(c + 2, lim), y = ri(1, x - 1); return num(`Subtract by counting on. ${w(`${x} − ${y}`)}<br>Count on from ${y} to ${x}. How many did you count?`, x - y, `${y} + ${x - y} = ${x}, so ${x} − ${y} = ${b(x - y)}.`); }
  if (sub) { const x = ri(3, lim), y = ri(1, 3); return num(`Count back ${b(y)} from ${b(x)}. ${w(`${x} − ${y} = ?`)}`, x - y, `Counting back ${y} from ${x} gives ${b(x - y)}.`); }
  const x = ri(5, lim - c);
  return num(`Count on ${b(c)} from ${b(x)}. ${w(`${x} + ${c} = ?`)}`, x + c, `Starting at ${x} and counting on ${c}: ${b(x + c)}.`);
};
K.makeTen = P => () => {
  const a = ri(1, 9);
  if (/models/.test(P.title)) return num(`${tenFrame(a)}${w(`${a} + ___ = 10`)}`, 10 - a, `${a} + ${10 - a} = 10.`);
  return num(`Complete the addition sentence to make ten. ${w(`${a} + ___ = 10`)}`, 10 - a, `${a} + ${10 - a} = 10.`);
};
K.makeTenAdd = () => () => {
  const a = ri(6, 9), c = ri(3, 9), need = 10 - a;
  if (c < need) return null;
  return num(`Make ten to add. ${w(`${a} + ${c}`)}<br>${a} + ${need} = 10, then 10 + ${c - need} = ?`, a + c, `${a} + ${c} = ${b(a + c)}.`);
};
K.doubles = P => () => {
  const x = ri(1, 10);
  if (/plus one/.test(P.title)) return num(`Use doubles plus one. ${w(`${x} + ${x + 1}`)}<br>${x} + ${x} = ${2 * x}. So ${x} + ${x + 1} = ?`, 2 * x + 1, `${2 * x} + 1 = ${b(2 * x + 1)}.`);
  if (/minus one/.test(P.title)) return num(`Use doubles minus one. ${w(`${x + 1} + ${x}`)}<br>${x + 1} + ${x + 1} = ${2 * x + 2}. So ${x + 1} + ${x} = ?`, 2 * x + 1, `${2 * x + 2} − 1 = ${b(2 * x + 1)}.`);
  if (/subtract/.test(P.title)) return num(`Subtract doubles. ${w(`${2 * x} − ${x}`)}`, x, `Half of ${2 * x} is ${b(x)}.`);
  if (/three numbers/.test(P.title)) { const y = ri(1, 7); return num(`Add three numbers using doubles. ${w(`${x} + ${x} + ${y}`)}`, 2 * x + y, `${x} + ${x} = ${2 * x}, then ${2 * x} + ${y} = ${b(2 * x + y)}.`); }
  return num(`Add doubles. ${w(`${x} + ${x} = ?`)}`, 2 * x, `${x} + ${x} = ${b(2 * x)}.`);
};

K.sort = P => () => {
  const op = pickOp(P), d = draw(op, P); if (!d) return null;
  const lim = op === 'add' ? 10 : op === 'sub' ? 5 : op === 'mul' ? 20 : 5;
  const bins = op === 'add' ? [`The sum is ${lim} or less`, `The sum is more than ${lim}`] : op === 'sub' ? [`The difference is ${lim} or less`, `The difference is more than ${lim}`] : op === 'mul' ? [`The product is ${lim} or less`, `The product is more than ${lim}`] : [`The quotient is ${lim} or less`, `The quotient is more than ${lim}`];
  return mc(`Sort this fact: ${w(expr(d))}<br>Which group does it belong to?`, d.r <= lim ? bins[0] : bins[1], [d.r <= lim ? bins[1] : bins[0]], `${eq(d)}, so ${d.r <= lim ? 'it is 10 or less'.replace('10', lim) : 'it is more than ' + lim}.`, 2);
};
K.selectMissing = P => () => {
  const op = pickOp(P), d = draw(op, P); if (!d) return null;
  const good = op === 'mul' ? `${fmt(d.a)} × ${fmt(d.b)}` : `${fmt(d.a)} ÷ ${fmt(d.b)}`;
  const bad = [];
  for (let i = 0; i < 8 && bad.length < 3; i++) { const o = draw(op, P); const t2 = op === 'mul' ? `${fmt(o.a)} × ${fmt(o.b)}` : `${fmt(o.a)} ÷ ${fmt(o.b)}`; if (o.r !== d.r && !bad.includes(t2)) bad.push(t2); }
  return mc(`Which fact has ${op === 'mul' ? 'a product' : 'a quotient'} of ${b(fmt(d.r))}?`, good, bad, `${good} = ${b(fmt(d.r))}.`);
};

/** the top-level classifier: title → kind */
function kindOf(P) {
  const t = P.title;
  if (/terms$/.test(t)) return 'terms';
  if (/word problems?|sentences? for word problems|write .* sentences? for .*word problems/.test(t)) {
    if (/sentences for word problems|model and write/.test(t) && !/solve/.test(t)) return 'wpSentence';
    return 'wp';
  }
  if (/\bsorting\b|^sort /.test(t)) return 'sort';
  if (/select the missing/.test(t)) return 'selectMissing';
  if (/input\/output/.test(t)) return 'io';
  if (/balance .*equations/.test(t)) return 'balance';
  if (/complete the .*(?:sentence|equation)/.test(t)) return 'complete';
  if (/true or false|:? ?which is true\?|which .*sentence is true|\(.*\)? true/.test(t)) return /which .*sentence is true|which is true/.test(t) ? 'whichTrue' : 'trueFalse';
  if (/fill in the missing digits/.test(t)) return 'fillDigits';
  if (/inequalit/.test(t)) return 'inequality';
  if (/estimate/.test(t)) return 'estimate';
  if (/patterns over increasing place values/.test(t)) return 'pattern';
  if (/choose numbers with a particular|identify .* expressions? with a particular|choose the multiples/.test(t)) return 'choosePair';
  if (/properties of|property/.test(t) && !/^use|^add using|^multiply using/.test(t)) return /^properties/.test(t) ? 'property' : 'compute';
  if (/^(?:add|multiply) using properties/.test(t)) return 'useProperty';
  if (/three or more|three numbers|four numbers|three or four/.test(t)) return 'multi';
  if (/ways to make a number|make a number using|take apart numbers/.test(t)) return 'ways';
  if (/^use models|models to/.test(t)) return 'models';
  return 'compute';
}

/** exported rule: arithmetic skills by title keywords. Place AFTER more specific rules. */
export const ARITH_RULE = R(/./, (mt, ctx) => {
  if (/fraction|decimal|mixed number|percent|ratio|\brates?\b|\bmoney\b|measure|\btime\b/i.test(ctx.title)) return null;   // handled by their own strands
  const P = parseTitle(ctx.title, ctx.grade);
  if (!P.ops.length) return null;
  const k = kindOf(P);
  if (k === 'wpSentence') return K.wp({ ...P, title: 'sentences for word problems ' + P.title });
  return K[k](P);
}, {});

export { K as ARITH_KINDS, wpQuestion };
