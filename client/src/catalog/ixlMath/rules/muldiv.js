/* Understanding multiplication & division (groups, arrays, number lines, area models, partial products, remainders),
   plus divisibility, LCM, powers-of-ten with exponents and a few mental-math skills (Grades 1–5). */
import {
  ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, num, mc, yesNo, near, svg, C, NAMES, thing, gcd, lcm, emojiRow, big, table, numberLine, arrayPic, digits
} from '../h.js';
import { R } from '../engine.js';
import { ARITH_KINDS as K, parseTitle } from './arith.js';

const sup = (a, e) => `${a}<sup>${e}</sup>`;
const groupsPic = (g, per, e) => `<div style="margin:6px 0">${Array.from({ length: g }, () => `<span style="display:inline-block;border:2px solid #94a3b8;border-radius:8px;padding:4px 8px;margin:4px;font-size:22px">${e.repeat(per)}</span>`).join('')}</div>`;
const wrongProd = (g, per) => uniq([`${g} + ${per}`, `${g} × ${g}`, `${per} × ${per}`, `${g} − ${per}`, `${g + 1} × ${per + 1}`]).filter(x => x !== `${g} × ${per}`);
const wrongEq = (g, per) => uniq([`${g} × ${per} = ${g + per}`, `${g} + ${per} = ${g * per}`, `${g} × ${per} = ${g * per + g}`, `${g} × ${per} = ${g * per - 1}`]).filter(x => x !== `${g} × ${per} = ${g * per}`);

/** area model rectangle split into parts: top = column widths (numbers), left = height */
function areaModel(h, parts, { showProducts = false } = {}) {
  const tot = sum(parts), W = 280, H = 70; let x = 40, inner = '';
  parts.forEach((p, i) => { const w = Math.max(48, (p / tot) * W); inner += `<rect x="${x}" y="22" width="${w}" height="${H}" fill="${i % 2 ? '#fde68a' : '#c7d2fe'}" stroke="${C.ink}" stroke-width="2"/><text x="${x + w / 2}" y="16" font-size="13" text-anchor="middle" font-weight="700" fill="${C.red}">${fmt(p)}</text><text x="${x + w / 2}" y="${22 + H / 2 + 5}" font-size="14" text-anchor="middle" fill="${C.ink}">${showProducts ? fmt(p * h) : '?'}</text>`; x += w; });
  inner += `<text x="30" y="${22 + H / 2 + 5}" font-size="13" text-anchor="end" font-weight="700" fill="${C.red}">${h}</text>`;
  return svg(x + 10, H + 34, inner, 'aria-label="area model"');
}
const expand = n => String(n).split('').map((d, i, a) => +d * 10 ** (a.length - 1 - i)).filter(Boolean);
const remText = (q, r) => `${fmt(q)} R ${r}`;
const divRem = (maxDiv, dd) => { const d = ri(2, maxDiv), q = digits(Math.max(1, dd - 1)) , r = ri(1, d - 1), a = d * q + r; return { a, d, q, r }; };

export const MULDIV_RULES = [
  /* ===== G1–G2 picture/sentence skills ===== */
  R(/^Ways to subtract from a number - subtraction sentences$|^Write addition and subtraction sentences$/, (mt, ctx) => K.ways(parseTitle('ways to make a number using subtraction up to 10', ctx.grade))),
  R(/^Match addition sentences and models - sums to 10$/, (mt, ctx) => K.modelForSentence(parseTitle('addition sums up to 10', ctx.grade))),
  R(/^Identify repeated addition for arrays - sums to 25$|^Write addition sentences for arrays - sums to 25$/, (mt, ctx) => () => {
    const r = ri(2, 5), c = ri(2, 5), [, , e] = thing(), repeated = Array(r).fill(c).join(' + '), full = `${repeated} = ${r * c}`, ident = /Identify/.test(ctx.title), ans = ident ? repeated : full;
    const wrong = ident ? [Array(c).fill(r).join(' + ') === repeated ? `${r} + ${c}` : Array(c).fill(r).join(' + '), `${r} + ${c}`, Array(r + 1).fill(c).join(' + ')] : [`${Array(c).fill(r).join(' + ')} = ${r * c}`, `${repeated} = ${r * c + 1}`, `${r} + ${c} = ${r * c}`];
    return mc(`${arrayPic(r, c, e)}This array has ${b(r)} rows with ${b(c)} in each row. ${ident ? 'Which repeated addition matches?' : 'Which addition sentence matches?'}`, ans, uniq(wrong).filter(x => x !== ans), `${r} rows of ${c}: ${b(ans)}.`, 4);
  }),
  R(/^Write stories involving repeated addition - sums to 25$/, () => () => {
    const g = ri(2, 5), per = ri(2, 5), nm = pick(NAMES), t = thing()[1], rep = Array(g).fill(per).join(' + '), ans = `${rep} = ${g * per}`;
    return mc(`${nm} has ${g} bags with ${per} ${t} in each bag. Which addition sentence tells how many ${t} there are in all?`, ans, [`${g} + ${per} = ${g + per}`, `${rep} = ${g * per + 1}`, `${Array(g + 1).fill(per).join(' + ')} = ${(g + 1) * per}`], `${g} bags of ${per}: ${b(ans)}.`, 4);
  }),

  /* ===== understanding multiplication ===== */
  R(/^Identify multiplication expressions for (equal groups|arrays)$/, mt => () => {
    const g = ri(2, 6), per = ri(2, 6); if (g === per) return null; const [, , e] = thing();
    return mc(`${mt[1] === 'arrays' ? arrayPic(g, per, e) + `There are ${b(g)} rows with ${b(per)} in each row. ` : groupsPic(g, per, e) + `There are ${b(g)} equal groups with ${b(per)} in each group. `}Which multiplication expression shows the total?`, `${g} × ${per}`, wrongProd(g, per).slice(0, 3), `${g} groups of ${per} is ${b(`${g} × ${per}`)}.`, 4);
  }),
  R(/^Write multiplication sentences for (equal groups|arrays|number lines)$/, mt => () => {
    const g = ri(2, 6), per = ri(2, 6); if (g === per) return null; const [, , e] = thing();
    const pic = mt[1] === 'arrays' ? arrayPic(g, per, e) + `${g} rows of ${per}. ` : mt[1] === 'number lines' ? numberLine({ min: 0, max: g * per, step: per, labelEvery: 1, marks: [{ v: g * per, label: String(g * per), color: C.red }], width: 460 }) + `The number line shows ${g} jumps of ${per}. ` : groupsPic(g, per, e) + `${g} groups of ${per}. `;
    return mc(`${pic}Which multiplication sentence matches?`, `${g} × ${per} = ${g * per}`, wrongEq(g, per).slice(0, 3), `${b(`${g} × ${per} = ${g * per}`)}.`, 4);
  }),
  R(/^Relate addition and multiplication(?: for equal groups)?$/, () => () => {
    const g = ri(2, 6), per = ri(2, 9), rep = Array(g).fill(per).join(' + ');
    return num(`${m(`${rep} = ${g} × ___`)}`, per, `${g} groups of ${per}: ${b(per)}.`);
  }),
  R(/^Multiply by 0 or 1 with equal groups$/, () => () => {
    const z = Math.random() < 0.5, g = ri(2, 9), [, , e] = thing();
    return z ? num(`There are ${b(g)} boxes with ${b(0)} ${e} in each box. How many ${e} are there in all?`, 0, `${g} × 0 = ${b(0)}.`) : num(`There ${b('1')} box of ${e} contains ${b(g)} ${e}. How many ${e} are there in all?`.replace('There 1', 'There is 1'), g, `1 × ${g} = ${b(g)}.`);
  }),
  R(/^Make arrays to model (multiplication|division)$/, mt => () => {
    const r = ri(2, 5), c = ri(2, 6); if (r === c) return null; const [, , e] = thing();
    const opts = shuffle(uniq([[r, c], [c, r + 1], [r + 1, c], [r, c + 1]].map(x => x.join('x'))).map(s => s.split('x').map(Number))), L = 'ABCD'[opts.findIndex(o => o[0] === r && o[1] === c)];
    const prompt = mt[1] === 'multiplication' ? `Which array shows ${b(`${r} × ${c}`)}? (${r} rows of ${c})` : `Which array shows ${b(`${r * c} ÷ ${c}`)}? (${r * c} objects in rows of ${c})`;
    const picks = opts.map((o, i) => `<div><b>${'ABCD'[i]}</b>${mt[1] === 'multiplication' ? arrayPic(o[0], o[1], e) : arrayPic(o[0], o[1], e)}</div>`).join('');
    return mc(`${prompt}<div style="display:flex;gap:18px;flex-wrap:wrap">${picks}</div>`, L, 'ABCD'.slice(0, opts.length).split('').filter(x => x !== L), mt[1] === 'multiplication' ? `${r} rows of ${c}: array ${b(L)}.` : `${r * c} objects in rows of ${c} makes ${r} rows: array ${b(L)}.`, 4);
  }),
  R(/^Multiply using number lines$/, () => () => {
    const g = ri(2, 6), per = ri(2, 5);
    return num(`${numberLine({ min: 0, max: g * per, step: per, labelEvery: 1, width: 460, marks: [{ v: g * per, label: '?', color: C.red }] })}The number line shows ${b(g)} jumps of ${b(per)}. What is ${m(`${g} × ${per}`)}?`, g * per, `${g} jumps of ${per} land on ${b(g * per)}.`);
  }),
  R(/^Compare numbers using multiplication(?:: word problems)?$/, (mt, ctx) => () => {
    const k = ri(2, 9), base = ri(2, 12), nm = pick(NAMES), nm2 = pick(NAMES.filter(x => x !== nm)), t = thing()[1];
    return /word/.test(ctx.title) ? num(`${nm} has ${base} ${t}. ${nm2} has ${k} times as many ${t}. How many ${t} does ${nm2} have?`, k * base, `${k} × ${base} = ${b(k * base)}.`) : num(`${m(`${k * base} = ${k} × ___`)} How many times as large is ${k * base} as ${base}? (That is, ${k * base} = ___ × ${base})`, k, `${k * base} ÷ ${base} = ${b(k)}.`);
  }),

  /* ===== understanding division ===== */
  R(/^Divide by counting equal groups$/, () => () => {
    const g = ri(2, 6), per = ri(2, 6), [, , e] = thing();
    return num(`${groupsPic(g, per, e)}There are ${b(g * per)} ${e} shared into ${b(g)} equal groups. How many are in each group?`, per, `${g * per} ÷ ${g} = ${b(per)}.`);
  }),
  R(/^Write division sentences for (groups|arrays)$/, mt => () => {
    const g = ri(2, 6), per = ri(2, 6), [, , e] = thing(); if (g === per) return null;
    const ans = `${g * per} ÷ ${g} = ${per}`;
    return mc(`${mt[1] === 'arrays' ? arrayPic(g, per, e) : groupsPic(g, per, e)}${g * per} ${e} are in ${g} equal ${mt[1] === 'arrays' ? 'rows' : 'groups'}. Which division sentence matches?`, ans, [`${g * per} ÷ ${per} = ${g + 1}`, `${g} ÷ ${g * per} = ${per}`, `${g * per} ÷ ${g} = ${per + 1}`], `${b(ans)}.`, 4);
  }),
  R(/^Relate multiplication and division(?: for (?:groups|arrays))?$/, () => () => {
    const a = ri(2, 9), c = ri(2, 9);
    return num(`${m(`${a} × ${c} = ${a * c}`)}<br>Use it to solve ${m(`${a * c} ÷ ${c} = ___`)}`, a, `Since ${a} × ${c} = ${a * c}, ${a * c} ÷ ${c} = ${b(a)}.`);
  }),
  R(/^Divide using number lines$/, () => () => {
    const g = ri(2, 6), per = ri(2, 5), tot = g * per;
    return num(`${numberLine({ min: 0, max: tot, step: per, labelEvery: 1, width: 460, marks: [{ v: tot, label: String(tot), color: C.red }] })}Count the jumps of ${b(per)} from 0 to ${tot}. What is ${m(`${tot} ÷ ${per}`)}?`, g, `There are ${g} jumps: ${b(g)}.`);
  }),
  R(/^Divide using repeated subtraction$/, () => () => {
    const d = ri(2, 9), q = ri(3, 8), a = d * q;
    return num(`${a} − ${d} − ${d} − … until you reach 0. How many times do you subtract ${b(d)}? (${m(`${a} ÷ ${d}`)})`, q, `You subtract ${d} exactly ${b(q)} times.`);
  }),
  R(/^Divide using arrays$/, () => () => {
    const r = ri(2, 6), c = ri(2, 7), [, , e] = thing();
    return num(`${arrayPic(r, c, e)}This array has ${b(r * c)} objects in ${b(r)} rows. How many objects are in each row?`, c, `${r * c} ÷ ${r} = ${b(c)}.`);
  }),
  R(/^Divide using area models$|^Divide using the distributive property$/, () => () => {
    const d = ri(2, 6), q1 = ri(2, 9) * 10, q2 = ri(2, 9), a = d * (q1 + q2);
    return num(`${m(`${a} ÷ ${d} = (${d * q1} ÷ ${d}) + (${d * q2} ÷ ${d})`)}<br>What is ${m(`${a} ÷ ${d}`)}?`, q1 + q2, `${d * q1} ÷ ${d} = ${q1} and ${d * q2} ÷ ${d} = ${q2}. ${q1} + ${q2} = ${b(q1 + q2)}.`);
  }),
  R(/^Divide (?:two|three)-digit numbers using area models$/, (mt, ctx) => () => {
    const three = /three/.test(ctx.title), d = ri(2, 6), q = three ? ri(11, 99) : ri(11, 29), a = d * q, hi = Math.floor(q / 10) * 10, lo = q - hi;
    return num(`${areaModel(d, [hi, lo], { showProducts: true })}${a} is split into ${fmt(d * hi)} and ${fmt(d * lo)}. What is ${m(`${a} ÷ ${d}`)}?`, q, `${fmt(d * hi)} ÷ ${d} = ${hi} and ${fmt(d * lo)} ÷ ${d} = ${lo}: ${b(q)}.`);
  }),
  R(/^Divide (?:two-digit numbers with remainders using arrays|\d-digit numbers with remainders|\d-digit numbers and interpret remainders|two-digit numbers with remainders|three-digit numbers with remainders)$|^Divide (?:2|3)-digit numbers (?:with remainders|and interpret remainders)$|^Divide by 1-digit numbers: interpret remainders$/, (mt, ctx) => () => {
    const dd = /3-digit|three/.test(ctx.title) ? 3 : 2, { a, d, q, r } = divRem(9, dd); if (a < 10) return null; const nm = pick(NAMES), t = thing()[1];
    if (/interpret/.test(ctx.title)) { const kind = pick(['extra', 'left']); return kind === 'extra' ? num(`${nm} has ${a} ${t} to pack in boxes of ${d}. How many boxes are needed to pack ${b('all')} the ${t}?`, q + 1, `${a} ÷ ${d} = ${q} R ${r}. The ${r} left over need one more box: ${b(q + 1)}.`) : num(`${nm} shares ${a} ${t} equally among ${d} friends. How many ${t} are ${b('left over')}?`, r, `${a} ÷ ${d} = ${q} R ${r}: ${b(r)} left over.`); }
    const ans = remText(q, r);
    return mc(`${m(`${fmt(a)} ÷ ${d}`)}`, ans, uniq([remText(q, (r + 1) % d || 1), remText(q + 1, r), remText(q - 1 || 2, r)]).filter(x => x !== ans), `${d} × ${q} = ${d * q}, and ${a} − ${d * q} = ${r}: ${b(ans)}.`, 4);
  }),
  R(/^Complete the division table: divide 3-digit numbers$/, () => () => {
    const d = ri(2, 6), h = ri(1, 4), t = ri(1, 9), o = ri(0, 9), q = h * 100 + t * 10 + o, a = d * q;
    return num(`${table(['Step', 'Work'], [['Divide the hundreds', `${d * h * 100} ÷ ${d} = ${h * 100}`], ['Divide the tens', `${d * t * 10} ÷ ${d} = ?`], ['Divide the ones', `${d * o} ÷ ${d} = ${o}`]])}${m(`${a} ÷ ${d}`)}. What is the missing quotient part?`, t * 10, `${d * t * 10} ÷ ${d} = ${b(t * 10)}.`);
  }),

  R(/^Divide (?:\d-digit and \d-digit |\d-digit )?numbers by (?:two|2)-digit numbers(?:: word problems)?$|^Divide by (?:two|2)-digit numbers(?: using partial (?:quotients|products))?(?:: word problems)?$|^Estimate quotients: two-digit divisors$/, (mt, ctx) => () => {
    const t = ctx.title, d = ri(11, 49), qd = /4-digit/.test(t) ? 2 : ri(1, 2), q = ri(2, 10 ** qd), a = d * q, nm = pick(NAMES), thing_ = pick(['stickers', 'pencils', 'marbles', 'cards']);
    if (/Estimate/.test(t)) { const est = Math.round(a / (Math.round(d / 10) * 10)); return num(`Estimate ${m(`${fmt(a)} ÷ ${d}`)} by rounding ${d} to the nearest ten.`, est === 0 ? 1 : est, `${fmt(a)} ÷ ${Math.round(d / 10) * 10} ≈ ${b(est)}.`); }
    if (/word/.test(t)) return num(`${nm} packs ${fmt(a)} ${thing_} into boxes of ${d}. How many boxes are filled?`, q, `${fmt(a)} ÷ ${d} = ${b(q)}.`);
    if (/partial/.test(t)) { const hi = Math.floor(q / 10) * 10 || q; return num(`${m(`${fmt(a)} ÷ ${d}`)}<br>First partial quotient: ${d} × ${hi} = ${fmt(d * hi)}. What is the full quotient?`, q, `${hi} + ${q - hi} = ${b(q)}.`); }
    return num(`${m(`${fmt(a)} ÷ ${d} = ?`)}`, q, `${d} × ${q} = ${fmt(a)}, so the quotient is ${b(q)}.`);
  }),
  /* ===== multiplication strategies ===== */
  R(/^Multiply 1-digit numbers by (?:2|3)-digit numbers: choose the area model$|^Multiply one-digit numbers by (?:two|three)-digit numbers: choose the area model$|^Multiply 2-digit numbers by 2-digit numbers: choose the area model$/, (mt, ctx) => () => {
    const two2 = /2-digit numbers by 2-digit/.test(ctx.title), three = /3-digit|three/.test(ctx.title), a = two2 ? ri(12, 49) : ri(2, 9), n = two2 ? ri(12, 49) : three ? digits(3) : digits(2);
    const parts = expand(n), good = parts.map(p => `${a} × ${fmt(p)}`).join(' + ');
    if (!two2 && parts.length < 2) return null;
    if (two2) { const ap = expand(a), np = expand(n), good2 = ap.flatMap(x => np.map(y => `${x} × ${y}`)).join(' + '); return mc(`Which expression shows the partial products for ${m(`${a} × ${n}`)}?`, good2, [ap.flatMap(x => np.map(y => `${x} × ${y + 1}`)).join(' + '), `${a} × ${np[0]} + ${a}`, `${ap[0]} × ${np[0]} + ${ap[1] || 1} × ${np[1] || 1}`].filter(x => x !== good2), `Split both numbers: ${b(good2)}.`, 4); }
    return mc(`Which expression shows the partial products for ${m(`${a} × ${n}`)}?`, good, [parts.map(p => `${a} × ${fmt(p / 10 || p)}`).join(' + '), `${a} × ${fmt(parts[0])} + ${a}`, parts.map(p => `${a + 1} × ${fmt(p)}`).join(' + ')].filter(x => x !== good), `Split ${n} into ${parts.map(fmt).join(' + ')}: ${b(good)}.`, 4);
  }),
  R(/^Multiply (?:1-digit|one-digit) numbers by (?:2|3|two|three)-digit numbers using area models$|^Multiply 2-digit numbers by 2-digit numbers using area models$|^Multiply 1-digit numbers by teen numbers using grids$|^Box multiplication$|^Lattice multiplication$/, (mt, ctx) => () => {
    const two2 = /2-digit numbers by 2-digit|Box|Lattice/.test(ctx.title), teen = /teen/.test(ctx.title), three = /3-digit|three/.test(ctx.title), a = two2 ? ri(12, 49) : ri(2, 9), n = teen ? ri(11, 19) : two2 ? ri(12, 49) : three ? digits(3) : digits(2);
    if (two2) { const ap = expand(a), np = expand(n), prods = ap.flatMap(x => np.map(y => x * y)); return num(`${table(['', ...np.map(fmt)], ap.map(x => [fmt(x), ...np.map(y => fmt(x * y))]))}The box shows the partial products of ${m(`${a} × ${n}`)}. What is the product?`, a * n, `${prods.map(fmt).join(' + ')} = ${b(fmt(a * n))}.`); }
    const parts = expand(n);
    return num(`${areaModel(a, parts, { showProducts: true })}The area model shows ${m(`${a} × ${n}`)}. What is the product?`, a * n, `${parts.map(p => fmt(a * p)).join(' + ')} = ${b(fmt(a * n))}.`);
  }),
  R(/^Multiply 1-digit numbers by 3-digit numbers using expanded form$|^Multiply 1-digit numbers by multi-digit numbers using partial products$/, () => () => {
    const a = ri(2, 9), n = digits(ri(3, 4)), parts = expand(n);
    return num(`${m(`${a} × ${fmt(n)} = ${parts.map(p => `(${a} × ${fmt(p)})`).join(' + ')}`)}<br>What is ${m(`${a} × ${fmt(n)}`)}?`, a * n, `${parts.map(p => fmt(a * p)).join(' + ')} = ${b(fmt(a * n))}.`);
  }),
  R(/^Multiply using the distributive property$/, () => () => {
    const a = ri(3, 9), t = ri(1, 9) * 10, o = ri(2, 9);
    return num(`${m(`${a} × ${t + o} = (${a} × ${t}) + (${a} × ${o})`)}<br>What is ${m(`${a} × ${t + o}`)}?`, a * (t + o), `${a * t} + ${a * o} = ${b(a * (t + o))}.`);
  }),
  R(/^Use one multiplication fact to complete another$/, () => () => {
    const a = ri(3, 9), c = ri(3, 9), k = pick([1, -1]), r = a * c;
    return num(`${m(`${a} × ${c} = ${r}`)}<br>Use it to find ${m(`${a} × ${c + k} = ___`)}`, a * (c + k), `${r} ${k > 0 ? '+' : '−'} ${a} = ${b(a * (c + k))}.`);
  }),
  R(/^Multiply 2-digit numbers by 2-digit numbers: complete the missing steps$/, () => () => {
    const a = ri(12, 59), n = ri(12, 59), ones = n % 10, tens = n - ones;
    return num(`${table(['Step', 'Work'], [[`${a} × ${ones}`, fmt(a * ones)], [`${a} × ${tens}`, '?'], ['Add', fmt(a * n)]])}What is the missing partial product?`, a * tens, `${a} × ${tens} = ${b(fmt(a * tens))}.`);
  }),
  R(/^Divide by 2-digit numbers using (?:models|partial products)$/, () => () => {
    const d = ri(11, 25), q = ri(11, 40), a = d * q, hi = Math.floor(q / 10) * 10;
    return num(`${m(`${fmt(a)} ÷ ${d}`)}<br>Partial quotients: ${d} × ${hi} = ${fmt(d * hi)}, and ${fmt(a - d * hi)} is left. What is ${m(`${fmt(a)} ÷ ${d}`)}?`, q, `${hi} + ${q - hi} = ${b(q)}.`);
  }),
  R(/^Adjust quotients$/, () => () => {
    const d = ri(12, 49), q = ri(3, 9), a = d * q + ri(0, d - 1), guess = pick([q - 1, q, q + 1]) , prod = d * guess, verdict = prod > a ? 'Too high' : a - prod >= d ? 'Too low' : 'Just right';
    return mc(`To find ${m(`${a} ÷ ${d}`)}, Sam tries ${b(guess)} as the quotient. Since ${d} × ${guess} = ${prod}, is ${guess} too high, too low or just right?`, verdict, ['Too high', 'Too low', 'Just right'].filter(x => x !== verdict), prod > a ? `${prod} is more than ${a}, so ${guess} is too high.` : a - prod >= d ? `The remainder ${a - prod} is at least ${d}, so ${guess} is too low.` : `${prod} fits and the remainder is less than ${d}.`, 3);
  }),

  /* ===== number sense & mental math ===== */
  R(/^Divisibility rules(?: for [\d, and]+)?$/, (mt, ctx) => () => {
    const ks = /2, 5 and 10/.test(ctx.title) ? [2, 5, 10] : /3, 6 and 9/.test(ctx.title) ? [3, 6, 9] : /4 and 8/.test(ctx.title) ? [4, 8] : [2, 3, 4, 5, 6, 8, 9, 10], k = pick(ks), n = Math.random() < 0.5 ? k * ri(2, 60) : ri(20, 500);
    const tip = { 2: 'ends in 0, 2, 4, 6 or 8', 3: 'has digits that add to a multiple of 3', 4: 'ends in two digits divisible by 4', 5: 'ends in 0 or 5', 6: 'is even and divisible by 3', 8: 'ends in three digits divisible by 8', 9: 'has digits that add to a multiple of 9', 10: 'ends in 0' }[k];
    return yesNo(`Is ${b(fmt(n))} divisible by ${b(k)}?`, n % k === 0, `A number is divisible by ${k} if it ${tip}. ${fmt(n)} ${n % k === 0 ? 'is' : 'is not'}.`, ['Yes', 'No']);
  }),
  R(/^Least common multiple$/, () => () => {
    const a = pick([2, 3, 4, 5, 6, 8, 9, 10]), c = pick([2, 3, 4, 5, 6, 8, 9, 10]); if (a === c) return null;
    return num(`What is the least common multiple of ${b(a)} and ${b(c)}?`, lcm(a, c), `The smallest number both ${a} and ${c} divide into is ${b(lcm(a, c))}.`);
  }),
  R(/^Write multiplication expressions using exponents$/, () => () => {
    const base = ri(2, 9), e = ri(2, 5), exp = Array(e).fill(base).join(' × ');
    return mc(`Write ${m(exp)} using an exponent.`, `${base}^${e}`, [`${e}^${base}`, `${base} × ${e}`, `${base}^${e + 1}`], `${base} is multiplied ${e} times: ${b(`${base}^${e}`)}.`, 4);
  }),
  R(/^(?:Multiply and divide|Divide) by a power of ten: with exponents$/, (mt, ctx) => () => {
    const e = ri(1, 4), n = ri(2, 99) * 10 ** ri(0, 2), mul = /Multiply and divide/.test(ctx.title) ? Math.random() < 0.5 : false, big_ = n * 10 ** e;
    return mul ? num(`${m(`${fmt(n)} × ${sup(10, e)} = ?`)}`, big_, `Move the decimal point ${e} place${e > 1 ? 's' : ''} right: ${b(fmt(big_))}.`) : num(`${m(`${fmt(big_)} ÷ ${sup(10, e)} = ?`)}`, n, `Divide by 10 ${e} time${e > 1 ? 's' : ''}: ${b(fmt(n))}.`);
  }),
  R(/^Mentally add and subtract numbers ending in zeros$/, () => () => {
    const p = pick([10, 100, 1000]), a = ri(2, 9) * p, c = ri(1, 8) * p, add = Math.random() < 0.5; if (!add && c >= a) return null;
    return num(`${m(`${fmt(a)} ${add ? '+' : '−'} ${fmt(c)} = ?`)}`, add ? a + c : a - c, `Think ${a / p} ${add ? '+' : '−'} ${c / p} = ${add ? a / p + c / p : a / p - c / p}, then add the zeros: ${b(fmt(add ? a + c : a - c))}.`);
  }),
  R(/^Find two numbers based on sum and difference$|^Find two numbers based on sum, difference, product and quotient$/, (mt, ctx) => () => {
    const x = ri(3, 20), y = ri(1, x - 1), op = /product/.test(ctx.title) ? pick(['sum and difference', 'sum and product']) : 'sum and difference';
    if (op === 'sum and product') { const a = ri(2, 9), c = ri(2, 9); if (a === c) return null; return num(`Two numbers have a sum of ${b(a + c)} and a product of ${b(a * c)}. What is the larger number?`, Math.max(a, c), `${Math.max(a, c)} + ${Math.min(a, c)} = ${a + c} and ${Math.max(a, c)} × ${Math.min(a, c)} = ${a * c}.`); }
    return num(`Two numbers have a sum of ${b(x + y)} and a difference of ${b(x - y)}. What is the larger number?`, x, `Try ${x} and ${y}: ${x} + ${y} = ${x + y} and ${x} − ${y} = ${x - y}. The larger is ${b(x)}.`);
  }),
  R(/^Even or odd: addition and subtraction patterns$/, () => () => {
    const a = pick(['even', 'odd']), c = pick(['even', 'odd']), op = pick(['+', '−']), res = a === c ? 'even' : 'odd';
    return mc(`Is ${b(`${a} ${op} ${c}`)} even or odd?`, res, [res === 'even' ? 'odd' : 'even'], `Try examples: ${a === 'even' ? 4 : 5} ${op} ${c === 'even' ? 2 : 3} = ${op === '+' ? (a === 'even' ? 4 : 5) + (c === 'even' ? 2 : 3) : (a === 'even' ? 4 : 5) - (c === 'even' ? 2 : 3)}, which is ${res}.`, 2);
  }),
  R(/^Add and subtract data from tables$/, () => () => {
    const items = sample(['apples', 'pears', 'plums', 'grapes'], 3).map(n => [n, ri(120, 480)]), [x, y] = sample(items, 2), add = Math.random() < 0.5;
    const [hi, lo] = x[1] >= y[1] ? [x, y] : [y, x];
    return num(`${table(['Fruit', 'Number sold'], items)}${add ? `How many ${x[0]} and ${y[0]} were sold in all?` : `How many more ${hi[0]} than ${lo[0]} were sold?`}`, add ? x[1] + y[1] : hi[1] - lo[1], add ? `${x[1]} + ${y[1]} = ${b(x[1] + y[1])}.` : `${hi[1]} − ${lo[1]} = ${b(hi[1] - lo[1])}.`);
  }),
  R(/^Make the largest possible quotient$/, () => () => {
    const ds = sample([2, 3, 4, 5, 6, 7, 8, 9], 3);
    const cands = ds.flatMap((d, i) => { const rest = ds.filter((_, j) => j !== i); return [(rest[0] * 10 + rest[1]) / d, (rest[1] * 10 + rest[0]) / d]; }), best = Math.floor(Math.max(...cands));
    return num(`Use the digits ${b(ds.join(', '))}, each once. Make a 2-digit number and divide it by the remaining digit. What is the largest quotient you can get? (Give the whole-number part.)`, best, `The biggest two-digit number divided by the smallest digit gives the largest quotient: ${b(best)}.`);
  }),
  R(/^Multiplication and division: real-world patterns$/, () => () => {
    const per = ri(2, 9), nm = pick(['egg cartons', 'bags of apples', 'packs of pens', 'boxes of crayons']), k = ri(6, 12);
    return num(`${table(['Number of ' + nm, 1, 2, 3], [['Total items', per, per * 2, per * 3]])}Each of the ${nm} holds the same amount. How many items are in ${b(k)} ${nm}?`, per * k, `One holds ${per}, so ${k} hold ${k} × ${per} = ${b(per * k)}.`);
  }),
  R(/^Solve (addition and subtraction|multiplication and division) equations with whole numbers$/, mt => () => {
    const x = ri(2, 15), a = ri(2, 12), kind = mt[1].startsWith('add') ? pick(['+', '−']) : pick(['×', '÷']); let eq_, ans = x;
    if (kind === '+') eq_ = `x + ${a} = ${x + a}`; else if (kind === '−') eq_ = `x − ${a} = ${x - a}`; else if (kind === '×') eq_ = `${a}x = ${a * x}`; else { eq_ = `x ÷ ${a} = ${x}`; ans = x * a; }
    if (kind === '−' && x - a < 0) return null;
    return num(`Solve for ${b('x')}. ${m(eq_)}`, ans, `Use the inverse operation: x = ${b(ans)}.`);
  })
];
