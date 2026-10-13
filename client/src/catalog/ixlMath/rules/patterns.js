/* Patterns & sequences (Grades 1–5): repeating, growing and number patterns. */
import { ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, num, mc, yesNo, near, big, gcd, NAMES, svg, C } from '../h.js';
import { R } from '../engine.js';

const COLORS = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠'];
const SHAPES = ['⭐', '🔷', '⬛', '🔺', '❤️', '🟩', '⚪', '🔶'];
const sized = (e, big_) => `<span style="font-size:${big_ ? 38 : 20}px;line-height:1">${e}</span>`;

const render = items => `<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:8px 0">${items.map(i => i.html).join('')}</div>`;
const seqOf = (unit, len) => Array.from({ length: len }, (_, i) => unit[i % unit.length]);

// choices are named ("red circle") so they can be shown as plain text.
const NAME = { '🔴': 'red circle', '🔵': 'blue circle', '🟢': 'green circle', '🟡': 'yellow circle', '🟣': 'purple circle', '🟠': 'orange circle', '⭐': 'star', '🔷': 'blue diamond', '⬛': 'black square', '🔺': 'red triangle', '❤️': 'heart', '🟩': 'green square', '⚪': 'white circle', '🔶': 'orange diamond' };
function patternQuestion(mode, kind) {
  return () => {
    let items, pool;
    if (kind === 'size') { const e = pick(['🔵', '⭐', '⬛', '❤️']), unit = pick([[1, 0], [1, 1, 0], [0, 1], [1, 0, 0]]); items = unit.map(v => ({ name: v ? `big ${NAME[e] || 'shape'}` : `small ${NAME[e] || 'shape'}`, html: sized(e, v) })); pool = items; }
    else { const src = kind === 'colour' ? COLORS : SHAPES, unit = sample(src, pick([2, 2, 3])); items = unit.map(e => ({ name: NAME[e], html: `<span style="font-size:30px;line-height:1.1">${e}</span>` })); pool = src.map(e => ({ name: NAME[e], html: `<span style="font-size:30px">${e}</span>` })); }
    const len = items.length * ri(2, 3) + ri(1, items.length - 1), full = seqOf(items, len);
    if (mode === 'next') {
      const nxt = items[len % items.length], others = uniq(pool.map(p => p.name)).filter(n => n !== nxt.name);
      return mc(`${render(full)}What comes ${b('next')} in the pattern?`, nxt.name, sample(others, 3), `The pattern repeats every ${items.length}. Next is the ${b(nxt.name)}.`);
    }
    if (mode === 'complete') {
      const k = ri(1, len - 2), nxt = full[k], others = uniq(pool.map(p => p.name)).filter(n => n !== nxt.name);
      const shown = full.map((x, i) => (i === k ? { html: '<span style="font-size:26px;border:2px dashed #94a3b8;border-radius:6px;padding:0 10px">?</span>' } : x));
      return mc(`${render(shown)}What goes in the ${b('?')} box?`, nxt.name, sample(others, 3), `Looking at the repeating unit, the missing item is the ${b(nxt.name)}.`);
    }
    // make: which row follows the rule?
    const unitNames = items.map(i => i.name), rule = unitNames.join(', ');
    const good = full, bad1 = shuffle(full).map(x => x), swapped = full.slice(); const j = ri(0, len - 1); swapped[j] = pool.map(p => p).find(p => p.name !== full[j].name) || swapped[j];
    const same = (a, c) => a.every((x, i) => (x.name || x.html) === (c[i].name || c[i].html));
    const wrongs = [swapped, shuffle(full), full.slice().reverse()].filter(w => !same(w, good)), vis = ws => `${render(ws)}`;
    const opts = [good, ...wrongs].slice(0, 4);
    const labels = opts.map((_, i) => 'Row ' + 'ABCD'[i]), order = shuffle(opts.map((o, i) => [o, i])), ans = labels[order.findIndex(x => x[1] === 0)];
    return mc(`The pattern is: ${b(rule)}, repeated. Which row shows this pattern?<br>${order.map((o, i) => `<div><b>Row ${'ABCD'[i]}</b>${render(o[0])}</div>`).join('')}`, ans, labels.filter(l => l !== ans), `Row ${ans.slice(-1)} repeats ${rule} each time.`, 4);
  };
}

function growing(title) {
  const asksNext = /next shape|next row|Extend/.test(title);
  return () => {
    const a = ri(1, 4), s = ri(1, 3), k = ri(3, 4), e = pick(['🟦', '⭐', '🔴', '🟩']), rows = range(0, k - 1).map(i => a + i * s), nxt = a + k * s;
    const pic = rows.map((n, i) => `<div style="font-size:20px;line-height:1.2"><span class="muted" style="font-size:12px;display:inline-block;width:48px">Row ${i + 1}</span>${e.repeat(n)}</div>`).join('');
    return num(`${pic}How many shapes are in the ${b('next')} row (row ${k + 1})?`, nxt, `Each row adds ${s} more. ${rows[rows.length - 1]} + ${s} = ${b(nxt)}.`);
  };
}

const term = (a, d, i) => a + d * i;
function listText(arr) { return arr.map(fmt).join(', '); }

export const PATTERN_RULES = [
  R(/^Colour patterns$/, () => patternQuestion('next', 'colour')),
  R(/^Size patterns$/, () => patternQuestion('next', 'size')),
  R(/^Shape patterns$/, () => patternQuestion('next', 'shape')),
  R(/^(?:Find the next shape in a (?:repeating )?pattern|Extend a repeating shape pattern|Continue a pattern)$/, () => patternQuestion('next', pick(['colour', 'shape', 'size']))),
  R(/^(?:Complete a (?:repeating )?pattern)$/, () => patternQuestion('complete', pick(['colour', 'shape', 'size']))),
  R(/^(?:Make a (?:repeating )?pattern)$/, () => patternQuestion('make', pick(['colour', 'shape']))),
  R(/^Repeating patterns$/, () => patternQuestion('next', pick(['colour', 'shape', 'size']))),
  R(/^Growing patterns$|^Find the next shape in a growing pattern$|^Find the next row in a growing pattern(?: of shapes)?$|^Extend a growing shape pattern$/, (mt, ctx) => growing(ctx.title)),

  /* ----- number patterns & sequences ----- */
  R(/^Use a rule to complete a number (?:pattern|sequence)$/, (mt, ctx) => () => {
    const op = ctx.grade >= 4 ? pick(['add', 'sub', 'mul']) : pick(['add', 'sub']), a = op === 'mul' ? ri(1, 5) : ri(op === 'sub' ? 30 : 1, op === 'sub' ? 60 : 20), d = op === 'mul' ? ri(2, 4) : ri(2, 9);
    const seq = [a]; for (let i = 0; i < 4; i++) seq.push(op === 'add' ? seq[i] + d : op === 'sub' ? seq[i] - d : seq[i] * d);
    const hole = ri(2, 4);
    return num(`Rule: ${b(op === 'add' ? `add ${d}` : op === 'sub' ? `subtract ${d}` : `multiply by ${d}`)}. Start: ${a}.<br>${m(seq.map((v, i) => (i === hole ? '___' : fmt(v))).join(', '))}`, seq[hole], `Apply the rule each step: the missing number is ${b(fmt(seq[hole]))}.`);
  }),
  R(/^What is true about the (?:given )?number pattern(?: made by the rule)?\?$/, (mt, ctx) => () => {
    const d = pick([2, 4, 5, 6, 10]), a = pick([d, 2 * d, 3 * d - d]), seq = range(0, 5).map(i => a + i * d);
    const truth = d % 2 === 0 && a % 2 === 0 ? 'All the numbers are even' : d === 5 ? 'The ones digits alternate between 0 and 5' : d === 10 ? 'Every number ends in the same digit' : `The numbers increase by ${d} each time`;
    const alts = [`The numbers increase by ${d + 1} each time`, 'All the numbers are odd', `Each number is ${d} times the one before`, 'The numbers decrease each time'];
    const ok = a % 2 === 0 && d % 2 === 0; if (ctx.title.includes('rule') && Math.random() < 0.5) return mc(`Rule: ${b(`start at ${a}, add ${d}`)}. Which is true about the pattern?`, `The numbers increase by ${d} each time`, alts.slice(0, 3), `Adding ${d} each time means the numbers increase by ${b(d)}.`);
    if (truth.startsWith('All') === false || ok) return mc(`${m(listText(seq) + ', …')}<br>Which is true about the pattern?`, truth, alts.filter(x => x !== truth && !(ok === false && /even/.test(x))).filter(x => !(x === 'All the numbers are odd' && ok)).slice(0, 3), `${truth}.`);
    return null;
  }),
  R(/^Compare number patterns$/, () => () => {
    const a1 = ri(1, 8), d1 = ri(2, 6), a2 = ri(1, 8), d2 = ri(2, 6), n = ri(4, 6), t1 = a1 + (n - 1) * d1, t2 = a2 + (n - 1) * d2; if (t1 === t2) return null;
    return mc(`Pattern A starts at ${a1} and adds ${d1} each time. Pattern B starts at ${a2} and adds ${d2} each time. Which pattern has the greater number in position ${n}?`, t1 > t2 ? 'Pattern A' : 'Pattern B', [t1 > t2 ? 'Pattern B' : 'Pattern A'], `Position ${n}: A is ${t1} and B is ${t2}.`, 2);
  }),
  R(/^Identify mistakes in number patterns$/, () => () => {
    const a = ri(1, 10), d = ri(2, 8), seq = range(0, 5).map(i => a + i * d), k = ri(1, 4), wrong = seq[k] + pick([-2, -1, 1, 2]), shown = seq.map((v, i) => (i === k ? wrong : v));
    return mc(`This pattern should ${b(`add ${d}`)} each time:<br>${m(listText(shown))}<br>Which number is a mistake?`, fmt(wrong), shown.filter((v, i) => i !== k).map(fmt), `Starting at ${a} and adding ${d}, position ${k + 1} should be ${seq[k]}, not ${wrong}.`);
  }),
  R(/^Complete an increasing number (?:pattern|sequence)$/, () => () => {
    const a = ri(1, 15), d = ri(2, 9), seq = range(0, 5).map(i => a + i * d), hole = ri(1, 4);
    const grow = Math.random() < 0.35;
    if (grow) { const g = [a]; for (let i = 1; i < 5; i++) g.push(g[i - 1] + i + ri(0, 0)); const h2 = ri(2, 4); return num(`The numbers grow by one more each step (+1, +2, +3 …).<br>${m(g.map((v, i) => (i === h2 ? '___' : fmt(v))).join(', '))}`, g[h2], `The jumps are +1, +2, +3, +4: the missing number is ${b(g[h2])}.`); }
    return num(`Complete the pattern.<br>${m(seq.map((v, i) => (i === hole ? '___' : fmt(v))).join(', '))}`, seq[hole], `The numbers go up by ${d} each time: ${b(fmt(seq[hole]))}.`);
  }),
  R(/^Complete a geometric number (?:pattern|sequence)$/, () => () => {
    const a = ri(1, 5), r = ri(2, 4), seq = range(0, 4).map(i => a * r ** i), hole = ri(1, 4);
    return num(`Each number is multiplied by the same amount.<br>${m(seq.map((v, i) => (i === hole ? '___' : fmt(v))).join(', '))}`, seq[hole], `Multiply by ${r} each time: the missing number is ${b(fmt(seq[hole]))}.`);
  }),
  R(/^Number (?:patterns|sequences): word problems$/, () => () => {
    const n = pick(NAMES), start = ri(5, 20), d = ri(2, 6), wk = ri(4, 8);
    return num(`${n} has $${start} and saves $${d} more each week. How much money does ${n} have after ${b(wk)} weeks?`, start + d * wk, `${start} + ${wk} × ${d} = ${b(start + d * wk)}.`);
  }),
  R(/^Number (?:patterns|sequences): mixed review$/, () => () => {
    const a = ri(2, 20), d = ri(3, 9), seq = range(0, 4).map(i => a + i * d);
    return num(`What is the next number? ${m(listText(seq) + ', ___')}`, a + 5 * d, `Add ${d} each time: ${b(a + 5 * d)}.`);
  }),
  R(/^Arithmetic sequences with fractions$/, () => () => {
    const den = pick([4, 5, 6, 8, 10]), step = ri(1, 2), start = ri(1, 3), seq = range(0, 3).map(i => start + i * step), nxt = start + 4 * step, f = n => (n % den === 0 ? String(n / den) : `${n}/${den}`);
    return mc(`What comes next? ${m(seq.map(f).join(', ') + ', ___')}`, f(nxt), uniq([f(nxt + step), f(nxt - step), f(nxt + 1)]).filter(x => x !== f(nxt)), `Add ${step}/${den} each time: ${b(f(nxt))}.`);
  }),
  R(/^Geometric sequences with fractions$/, () => () => {
    const a = pick([1, 2, 4, 8, 16]), seq = [a, a / 2, a / 4, a / 8], f = n => (Number.isInteger(n) ? String(n) : `${n * 8 / gcd(n * 8, 8)}/${8 / gcd(n * 8, 8)}`), nxt = a / 16, fr = n => { const num_ = Math.round(n * 16), g = gcd(num_, 16); return g === num_ ? (16 / g === 1 ? String(num_ / g) : `1/${16 / g}`) : `${num_ / g}/${16 / g}`; };
    return mc(`Each number is half of the one before.<br>${m(seq.map(fr).join(', ') + ', ___')}`, fr(nxt), uniq([fr(nxt * 2), fr(nxt / 2), fr(nxt * 3)]).filter(x => x !== fr(nxt)), `Half of ${fr(seq[3])} is ${b(fr(nxt))}.`);
  })
];
