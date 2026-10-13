/* Grade 1–2 arithmetic specifics: pictures, strategies, "Adding k" fact drills, tens and ones. */
import { ri, pick, shuffle, sample, range, m, b, fmt, num, mc, yesNo, near, baseTen, tenFrame, numberLine, emojiRow, thing, C, big } from '../h.js';
import { R } from '../engine.js';
import { ARITH_KINDS as K, parseTitle, draw } from './arith.js';

const E = (re, kind, opts) => R(re, (mt, ctx) => K[kind](parseTitle(ctx.title, ctx.grade)), opts);

export const EARLY_RULES = [
  E(/^Add with cubes/, 'cubes'), E(/^Subtract with cubes/, 'cubes'),
  E(/^Add with pictures|^Subtract with pictures|^Addition with pictures|^Subtraction with pictures/, 'pictureSum'),
  E(/which model matches/, 'modelForSentence'),
  E(/what does the (?:model|cube train) show|^Write (?:addition|subtraction|addition or subtraction) sentences (?:for pictures|to describe pictures)/, 'sentenceForPicture'),
  E(/(?:Addition|Subtraction) sentences using number lines/, 'numberLineJump'),
  E(/^Turn words into an addition sentence/, 'wordToSentence'),
  E(/^(?:Add|Subtract) by counting (?:on|back)/, 'countOn'),
  E(/^Complete the addition sentence to make ten/, 'makeTen'),
  E(/^Make ten to add$/, 'makeTenAdd'),
  E(/^Add doubles|doubles plus one$|doubles minus one$|^Subtract doubles$|^Add three numbers - use doubles$/, 'doubles'),
  R(/^Add in any order$/, () => () => {
    const a = ri(1, 9), c = ri(1, 9);
    return num(`Add in any order. ${m(`${a} + ${c} = ${c} + ___`)}`, a, `Adding in a different order gives the same sum: ${a} + ${c} = ${c} + ${b(a)}.`);
  }),
  R(/^Adding (\d+)$/, mt => () => {
    const k = +mt[1], a = ri(0, 20 - k);
    return num(`${m(`${a} + ${k} = ?`)}`, a + k, `${a} + ${k} = ${b(a + k)}.`);
  }),
  R(/^Subtracting (\d+)$/, mt => () => {
    const k = +mt[1], a = ri(k, 20);
    return num(`${m(`${a} − ${k} = ?`)}`, a - k, `${a} − ${k} = ${b(a - k)}.`);
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
  R(/^Addition and subtraction terms$/, (mt, ctx) => K.terms()),
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
