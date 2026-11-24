/* Grade 1–2 arithmetic specifics: pictures, strategies, "Adding k" fact drills, tens and ones. */
import { ri, pick, shuffle, sample, range, m, b, fmt, num, mc, yesNo, near, baseTen, tenFrame, numberLine, emojiRow, thing, C, big, NAMES } from '../h.js';
import { R } from '../engine.js';
import { ARITH_KINDS as K, parseTitle, draw } from './arith.js';

const E = (re, kind, opts) => R(re, (mt, ctx) => K[kind](parseTitle(ctx.title, ctx.grade)), opts);

/* cube pictures: vary the colours; counter models: vary the symbols */
const HUES = [['#3b82f6', 'blue'], ['#f59e0b', 'orange'], ['#10b981', 'green'], ['#ef4444', 'red'], ['#ec4899', 'pink'], ['#8b5cf6', 'purple'], ['#0ea5e9', 'sky blue']];
const SYMS = [['●', '○'], ['★', '☆'], ['■', '□'], ['▲', '△'], ['♥', '♡'], ['◆', '◇']];
const dress = (re, kind) => R(re, (mt, ctx) => {
  const g = K[kind](parseTitle(ctx.title, ctx.grade));
  return () => {
    const q = g(); if (!q) return q;
    const [h1, h2] = sample(HUES, 2), [f, o] = pick(SYMS);
    const sw = s => (typeof s !== 'string' ? s : s.replace(/#3b82f6|#f59e0b|\bblue\b|\borange\b|●|○/g, t => ({ '#3b82f6': h1[0], '#f59e0b': h2[0], blue: h1[1], orange: h2[1], '●': f, '○': o }[t])));
    q.prompt = sw(q.prompt); q.answer = sw(q.answer); q.explain = sw(q.explain); if (q.choices) q.choices = q.choices.map(sw);
    return q;
  };
});
const nm = () => pick(NAMES);

export const EARLY_RULES = [
  dress(/^Add with cubes/, 'cubes'), dress(/^Subtract with cubes/, 'cubes'),
  E(/^Add with pictures|^Subtract with pictures|^Addition with pictures|^Subtraction with pictures/, 'pictureSum'),
  dress(/which model matches/, 'modelForSentence'),
  dress(/what does the (?:model|cube train) show|^Write (?:addition|subtraction|addition or subtraction) sentences (?:for pictures|to describe pictures)/, 'sentenceForPicture'),
  E(/(?:Addition|Subtraction) sentences using number lines/, 'numberLineJump'),
  E(/^Turn words into an addition sentence/, 'wordToSentence'),
  R(/^(?:Add|Subtract) by counting (?:on|back)/, (mt, ctx) => () => {
    const lim = /20/.test(ctx.title) ? 20 : 10, t = ctx.title;
    if (/^Add/.test(t)) {
      const c = ri(1, 3), x = ri(1, lim - c), n = nm();
      return pick([
        () => num(`Count on ${b(c)} from ${b(x)}. ${m(`${x} + ${c} = ?`)}`, x + c, `Start at ${x} and count on ${c}: ${b(x + c)}.`),
        () => num(`Start at ${b(x)} and count on ${b(c)} more. What number do you land on?`, x + c, `${x} + ${c} = ${b(x + c)}.`),
        () => num(`${n} has ${b(x)} stickers and gets ${b(c)} more. Count on to find how many ${n} has now.`, x + c, `Count on ${c} from ${x}: ${b(x + c)}.`),
        () => num(`Count on to add. ${m(`${c} + ${x} = ?`)}<br>Start with the bigger number.`, x + c, `Start at ${Math.max(x, c)} and count on ${Math.min(x, c)}: ${b(x + c)}.`)
      ])();
    }
    if (/counting on/.test(t)) {
      const x = ri(3, lim), y = ri(Math.max(1, x - 5), x - 1);
      return pick([
        () => num(`Subtract by counting on. ${m(`${x} − ${y}`)}<br>Count on from ${y} to ${x}. How many did you count?`, x - y, `${y} + ${x - y} = ${x}, so ${x} − ${y} = ${b(x - y)}.`),
        () => num(`${m(`${y} + ___ = ${x}`)}<br>Count on from ${y} to ${x}. What is the missing number?`, x - y, `${y} + ${x - y} = ${x}, so the missing number is ${b(x - y)}.`),
        () => num(`${nm()} has ${b(y)} coins and wants ${b(x)}. Count on to find how many more are needed.`, x - y, `${y} + ${x - y} = ${x}: ${b(x - y)} more.`)
      ])();
    }
    const x = ri(3, lim), y = ri(1, Math.min(3, x - 1));
    return pick([
      () => num(`Count back ${b(y)} from ${b(x)}. ${m(`${x} − ${y} = ?`)}`, x - y, `Counting back ${y} from ${x} gives ${b(x - y)}.`),
      () => num(`Start at ${b(x)} and count back ${b(y)}. What number do you land on?`, x - y, `${x} − ${y} = ${b(x - y)}.`),
      () => num(`${nm()} has ${b(x)} grapes and eats ${b(y)}. Count back to find how many are left.`, x - y, `Count back ${y} from ${x}: ${b(x - y)}.`)
    ])();
  }),
  R(/^Complete the addition sentence to make ten/, (mt, ctx) => () => {
    const a = ri(1, 9), models = /models/.test(ctx.title);
    const f = pick([`${a} + ___ = 10`, `___ + ${a} = 10`, `10 = ${a} + ___`, `10 = ___ + ${a}`]);
    if (models) return num(`${tenFrame(a)}${m(f)}`, 10 - a, `${a} + ${10 - a} = 10.`);
    return pick([
      () => num(`Complete the addition sentence to make ten. ${m(f)}`, 10 - a, `${a} + ${10 - a} = 10.`),
      () => num(`${nm()} has ${b(a)} ${pick(['marbles', 'stickers', 'cards', 'blocks', 'beads'])}. How many more make ${b(10)}? ${m(f)}`, 10 - a, `${a} + ${10 - a} = 10.`)
    ])();
  }),
  E(/^Make ten to add$/, 'makeTenAdd'),
  R(/^Add doubles|doubles plus one$|doubles minus one$|^Subtract doubles$|^Add three numbers - use doubles$/, (mt, ctx) => () => {
    const t = ctx.title, x = ctx.grade >= 2 ? ri(2, 20) : ri(1, 10), n = nm(), [, pl] = thing();
    if (/plus one/.test(t)) { const [p, q] = Math.random() < 0.5 ? [x, x + 1] : [x + 1, x]; return pick([
      () => num(`Use doubles plus one. ${m(`${p} + ${q}`)}<br>${x} + ${x} = ${2 * x}. So ${p} + ${q} = ?`, 2 * x + 1, `${2 * x} + 1 = ${b(2 * x + 1)}.`),
      () => num(`Use doubles plus one. ${n} has ${b(x)} ${pl} and ${nm()} has ${b(x + 1)}. How many ${pl} in all?`, 2 * x + 1, `${x} + ${x} = ${2 * x}, plus 1 more is ${b(2 * x + 1)}.`)])(); }
    if (/minus one/.test(t)) { const [p, q] = Math.random() < 0.5 ? [x, x + 1] : [x + 1, x]; return pick([
      () => num(`Use doubles minus one. ${m(`${p} + ${q}`)}<br>${x + 1} + ${x + 1} = ${2 * x + 2}. So ${p} + ${q} = ?`, 2 * x + 1, `${2 * x + 2} − 1 = ${b(2 * x + 1)}.`),
      () => num(`Use doubles minus one. ${n} has ${b(x)} ${pl} and ${nm()} has ${b(x + 1)}. How many ${pl} in all?`, 2 * x + 1, `${x + 1} + ${x + 1} = ${2 * x + 2}, minus 1 is ${b(2 * x + 1)}.`)])(); }
    if (/Subtract/.test(t)) return pick([
      () => num(`Subtract doubles. ${m(`${2 * x} − ${x}`)}`, x, `Half of ${2 * x} is ${b(x)}.`),
      () => num(`Subtract doubles. ${m(`${2 * x} − ___ = ${x}`)}`, x, `${x} + ${x} = ${2 * x}, so the missing number is ${b(x)}.`),
      () => num(`${n} has ${b(2 * x)} ${pl}. ${nm()} takes ${b(x)} of them. How many ${pl} are left?`, x, `${2 * x} − ${x} = ${b(x)}.`)])();
    if (/three numbers/.test(t)) { const y = ri(1, 9), [p, q, r] = pick([[x, x, y], [x, y, x], [y, x, x]]); return num(`Add three numbers using doubles. ${m(`${p} + ${q} + ${r}`)}`, 2 * x + y, `${x} + ${x} = ${2 * x}, then ${2 * x} + ${y} = ${b(2 * x + y)}.`); }
    return pick([
      () => num(`Add doubles. ${m(`${x} + ${x} = ?`)}`, 2 * x, `${x} + ${x} = ${b(2 * x)}.`),
      () => num(`Add doubles. ${m(`${x} + ___ = ${2 * x}`)}`, x, `${x} + ${x} = ${2 * x}, so the missing number is ${b(x)}.`),
      () => num(`Add doubles. ${m(`___ + ${x} = ${2 * x}`)}`, x, `${x} + ${x} = ${2 * x}, so the missing number is ${b(x)}.`),
      () => num(`What is double ${b(x)}?`, 2 * x, `${x} + ${x} = ${b(2 * x)}.`),
      () => num(`${n} has ${b(x)} ${pl}. ${nm()} has the same number. How many ${pl} do they have in all?`, 2 * x, `${x} + ${x} = ${b(2 * x)}.`)])();
  }),
  R(/^Add in any order$/, () => () => {
    const a = ri(1, 9), c = ri(1, 9);
    return num(`Add in any order. ${m(`${a} + ${c} = ${c} + ___`)}`, a, `Adding in a different order gives the same sum: ${a} + ${c} = ${c} + ${b(a)}.`);
  }),
  R(/^Adding (\d+)$/, mt => () => {
    const k = +mt[1], a = ri(0, 20 - k), n = nm();
    return pick([
      () => num(`${m(`${a} + ${k} = ?`)}`, a + k, `${a} + ${k} = ${b(a + k)}.`),
      () => num(`${m(`${k} + ${a} = ?`)}`, a + k, `${k} + ${a} = ${b(a + k)}.`),
      () => num(`${m(`${a} + ___ = ${a + k}`)}`, k, `${a} + ${k} = ${a + k}, so the missing number is ${b(k)}.`),
      () => num(`${m(`___ + ${k} = ${a + k}`)}`, a, `${a} + ${k} = ${a + k}, so the missing number is ${b(a)}.`),
      () => num(`${n} has ${b(a)} ${pick(['stickers', 'marbles', 'cards', 'coins', 'books'])}. ${n} gets ${b(k)} more. How many now?`, a + k, `${a} + ${k} = ${b(a + k)}.`)
    ])();
  }),
  R(/^Subtracting (\d+)$/, mt => () => {
    const k = +mt[1], a = ri(k, 20), n = nm();
    return pick([
      () => num(`${m(`${a} − ${k} = ?`)}`, a - k, `${a} − ${k} = ${b(a - k)}.`),
      () => num(`${m(`${a} − ___ = ${a - k}`)}`, k, `${a} − ${k} = ${a - k}, so the missing number is ${b(k)}.`),
      () => num(`${m(`___ − ${k} = ${a - k}`)}`, a, `${a} − ${k} = ${a - k}, so the missing number is ${b(a)}.`),
      () => num(`${n} has ${b(a)} ${pick(['stickers', 'marbles', 'cards', 'coins', 'books'])}. ${n} gives away ${b(k)}. How many are left?`, a - k, `${a} − ${k} = ${b(a - k)}.`)
    ])();
  }),
  R(/^Subtract zero and all$|^Add zero$/, (mt, ctx) => () => {
    const a = ri(1, 20), z = Math.random() < 0.5;
    if (/Add zero/.test(ctx.title)) return num(`${m(`${a} + 0 = ?`)}`, a, `Adding zero changes nothing: ${b(a)}.`);
    return z ? num(`${m(`${a} − 0 = ?`)}`, a, `Taking away zero leaves ${b(a)}.`) : num(`${m(`${a} − ${a} = ?`)}`, 0, `Taking away all ${a} leaves ${b(0)}.`);
  }),
  R(/^Related (?:addition|subtraction) facts$|^Related facts with models - numbers up to 10$/, (mt, ctx) => () => {
    const a = ri(1, 9), c = ri(1, 10 - (ctx.title.includes('20') ? 0 : a)) , sub = /subtraction/.test(ctx.title);
    const x = ri(2, 10), y = ri(2, 10);
    if (sub) return num(`${m(`${x + y} − ${x} = ${y}`)}<br>Which number makes this related fact true? ${m(`${x + y} − ${y} = ___`)}`, x, `If ${x} + ${y} = ${x + y}, then ${x + y} − ${y} = ${b(x)}.`);
    return num(`${m(`${x} + ${y} = ${x + y}`)}<br>${m(`${y} + ${x} = ___`)}`, x + y, `Adding in a different order gives the same sum: ${b(x + y)}.`);
  }),
  R(/^Fact families(?: - up to 10)?$/, (mt, ctx) => () => {
    const mul = ctx.grade >= 2 && /Fact families$/.test(ctx.title) && false;
    const x = ri(2, 9), y = ri(2, 9), z = x + y, t = shuffle([x, y, z]);
    const facts = [`${x} + ${y} = ${z}`, `${y} + ${x} = ${z}`, `${z} − ${x} = ${y}`, `${z} − ${y} = ${x}`];
    const ans = pick(facts);
    return mc(`Which number sentence is in the same fact family as ${b(x)}, ${b(y)} and ${b(z)}?`, ans, [`${x} + ${y} = ${z + 1}`, `${x} − ${y} = ${z}`, `${z} + ${x} = ${y}`], `The fact family uses ${x}, ${y} and ${z}: ${b(ans)}.`);
  }),
  R(/^Relate addition and subtraction sentences - up to (?:10|20)$/, (mt, ctx) => () => {
    const lim = /20/.test(ctx.title) ? 20 : 10, z = ri(4, lim), x = ri(1, z - 1), y = z - x;
    return num(`${m(`${x} + ${y} = ${z}`)}<br>Use it to solve: ${m(`${z} − ${x} = ___`)}`, y, `${x} + ${y} = ${z}, so ${z} − ${x} = ${b(y)}.`);
  }),
  R(/^Use addition to subtract - up to (?:10|20)$/, (mt, ctx) => () => {
    const lim = /20/.test(ctx.title) ? 20 : 10, z = ri(4, lim), x = ri(1, z - 1);
    return num(`Think addition: ${m(`${x} + ___ = ${z}`)}<br>So ${m(`${z} − ${x} = ?`)}`, z - x, `${x} + ${z - x} = ${z}, so ${z} − ${x} = ${b(z - x)}.`);
  }),
  R(/^Use ten frames to (?:add|subtract)$|^Use ten to subtract$/, (mt, ctx) => () => {
    if (/add/.test(ctx.title)) { const a = ri(6, 9), c = ri(2, 9); return num(`${tenFrame(a)}Add ${b(c)} more. ${m(`${a} + ${c} = ?`)}`, a + c, `Fill the frame to 10, then add the rest: ${b(a + c)}.`); }
    const a = ri(11, 18), c = ri(2, 9); return num(`Use ten to subtract. ${m(`${a} − ${c}`)}<br>${a} − ${a - 10} = 10, then 10 − ${c - (a - 10) > 0 ? c - (a - 10) : 0} = ?`, a - c, `${a} − ${c} = ${b(a - c)}.`);
  }),
  R(/^Add three numbers - make ten$/, () => () => {
    const x = ri(1, 9), z = 10 - x, y = ri(1, 9);
    return num(`Add. Look for a pair that makes ten. ${m(`${x} + ${y} + ${z}`)}`, 10 + y, `${x} + ${z} = 10, then 10 + ${y} = ${b(10 + y)}.`);
  }),
  R(/^Add three numbers$/, () => () => {
    const x = ri(1, 9), y = ri(1, 9), z = ri(1, 9);
    return num(`${m(`${x} + ${y} + ${z} = ?`)}`, x + y + z, `${x} + ${y} + ${z} = ${b(x + y + z)}.`);
  }),
  R(/^Addition and subtraction terms$/, () => () => {
    const x = ri(1, 9), y = ri(1, 9); if (x === y) return null;
    const s = x + y;
    if (Math.random() < 0.5) {
      const eq = pick([`${x} + ${y} = ${s}`, `${s} = ${x} + ${y}`]), [val, ans, others] = pick([[x, 'addend', ['sum', 'difference']], [y, 'addend', ['sum', 'difference']], [s, 'sum', ['addend', 'difference']]]);
      return mc(`In the number sentence ${m(eq)}, what is ${b(val)} called?`, ans, others, `In ${eq}, ${val} is ${ans === 'addend' ? 'an' : 'the'} ${b(ans)}.`, 3);
    }
    const eq = `${s} − ${x} = ${y}`, [val, ans, others] = pick([[y, 'difference', ['sum', 'addend']], [s, 'number you subtract from', ['difference', 'sum']], [x, 'number you subtract', ['difference', 'sum']]]);
    return mc(`In the number sentence ${m(eq)}, what is ${b(val)} called?`, ans === 'difference' ? 'difference' : ans, others, `In ${eq}, ${val} is ${ans === 'difference' ? 'the' : 'the'} ${b(ans)}.`, 3);
  }),
  R(/^Which sign makes the number sentence true\?$/, () => () => {
    const a = ri(2, 12), c = ri(1, 8), add = Math.random() < 0.5, r = add ? a + c : a - c;
    return mc(`Which sign makes the number sentence true? ${m(`${a} ___ ${c} = ${r}`)}`, add ? '+' : '−', [add ? '−' : '+'], `${a} ${add ? '+' : '−'} ${c} = ${r}.`, 2);
  }),
  R(/^Addition and subtraction sentences to 10: which is true\?$|^(?:Addition|Subtraction) sentences: true or false\?$/, (mt, ctx) => () => {
    const sub = /Subtraction/.test(ctx.title) || (/Addition and subtraction/.test(ctx.title) && Math.random() < 0.5);
    const a = ri(2, 10), c = ri(1, a), truth = Math.random() < 0.5, r = sub ? a - c : Math.min(10, a) + 0;
    const x = sub ? a : ri(1, 9), y = sub ? c : ri(1, 10 - x), res = sub ? x - y : x + y, shown = truth ? res : res + pick([1, -1, 2]);
    return yesNo(`Is this true or false? ${m(`${x} ${sub ? '−' : '+'} ${y} = ${Math.max(0, shown)}`)}`, Math.max(0, shown) === res, `${x} ${sub ? '−' : '+'} ${y} = ${res}.`);
  }),
  R(/^Ten more or less$/, () => () => {
    const n = ri(10, 90), more = Math.random() < 0.5;
    return num(`What is ${b(more ? 'ten more' : 'ten less')} than ${b(n)}?`, more ? n + 10 : n - 10, `${n} ${more ? '+' : '−'} 10 = ${b(more ? n + 10 : n - 10)}.`);
  }),
  R(/^(Add|Subtract) multiples of ten$|^Add or subtract a multiple of ten$/, (mt, ctx) => () => {
    const sub = /Subtract/.test(ctx.title) || (/Add or subtract/.test(ctx.title) && Math.random() < 0.5), a = ri(2, 9) * 10, c = ri(1, a / 10 - 1 || 1) * 10;
    return num(`${m(`${sub ? a : a - c || 10} ${sub ? '−' : '+'} ${c} = ?`)}`, sub ? a - c : (a - c || 10) + c, `Think in tens: ${b(sub ? a - c : (a - c || 10) + c)}.`);
  }),
  R(/^Use models to (add|subtract) a multiple of ten and a (?:one|two)-digit number$|^Add a multiple of ten and a (?:one|two)-digit number$/, (mt, ctx) => () => {
    const tens = ri(1, 7) * 10, other = /two-digit/.test(ctx.title) ? ri(11, 29) : ri(1, 9);
    const th = Math.floor(tens / 10), ot = Math.floor(other / 10), oo = other % 10, tot = tens + other;
    return num(`${baseTen(0, th, 0)}<div style="font-size:24px;font-weight:700">+</div>${baseTen(0, ot, oo)}What is ${m(`${tens} + ${other}`)}?`, tot, `${tens} + ${other} = ${b(tot)}.`);
  }),
  R(/^Subtract a multiple of ten from a two-digit number$/, () => () => {
    const a = ri(25, 99), t = ri(1, Math.floor(a / 10) - 1) * 10;
    return num(`${m(`${a} − ${t} = ?`)}`, a - t, `Subtract the tens: ${a} − ${t} = ${b(a - t)}.`);
  }),
];
