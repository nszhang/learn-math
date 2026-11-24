/* Ratios, rates, proportions, percents, consumer math, financial literacy and metric units (Grades 6–12). */
import { ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, dec, num, mc, yesNo, near, svg, C, NAMES, gcd, table, money, moneyShort, MINUS, thing, shopItem, priceOf, aAn, cap } from '../h.js';
import { R } from '../engine.js';
import { stack, fs, simp } from './fractions.js';
import { strip } from './algebra.js';
import { S } from './numsys.js';

const dollars = x => '$' + (Math.round(x * 100) / 100).toFixed(2);
const wrongNum = (v, k = 3) => uniq([fix(v * 2, 2), fix(v + 1, 2), fix(v - 1, 2), fix(v / 2, 2), fix(v + 10, 2), fix(v * 10, 2)]).filter(x => x !== v && x > 0).slice(0, k);
const pctNice = [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 90];
const fmtPct = p => `${p}%`;

export const RATIO_RULES = [
  /* ===== ratios, rates, proportions ===== */
  R(/^Understanding ratios$/, () => () => {
    const a = ri(2, 9), c = ri(2, 9), [x, y] = sample(['boys', 'girls', 'cats', 'dogs', 'red pens', 'blue pens'], 2); if (a === c) return null;
    const q = pick([['part to part', `${a}:${c}`, `${x} to ${y}`], ['part to whole', `${a}:${a + c}`, `${x} to all`]]);
    return mc(`A group has ${a} ${x} and ${c} ${y}. What is the ratio of ${b(q[2])}?`, q[1], uniq([`${c}:${a}`, `${a}:${a + c}`, `${a + c}:${a}`, `${c}:${a + c}`]).filter(v_ => v_ !== q[1]), `${q[2]} is ${b(q[1])}.`, 4);
  }),
  R(/^Equivalent ratios: word problems$/, () => () => {
    const a = ri(2, 6), c = ri(2, 6), k = ri(2, 5), nm = pick(NAMES); if (a === c) return null;
    return num(`A recipe uses ${a} cups of flour for every ${c} cups of milk. ${nm} uses ${a * k} cups of flour. How many cups of milk does ${nm} need?`, c * k, `Scale up by ${k}: ${c} × ${k} = ${b(c * k)}.`);
  }),
  R(/^Use tape diagrams to solve ratio word problems$/, () => () => {
    const a = ri(1, 5), c = ri(1, 5), k = ri(2, 8); if (a === c) return null; const total = (a + c) * k;
    return num(`${strip([{ label: a + ' parts', v: a }, { label: c + ' parts', v: c }], total)}Red and blue marbles are in the ratio ${b(`${a}:${c}`)}. There are ${b(total)} marbles in all. How many are red?`, a * k, `${total} ÷ ${a + c} = ${k} per part, and ${a} × ${k} = ${b(a * k)}.`);
  }),
  R(/^Compare ratios: word problems$|^Compare rates: word problems$/, (mt, ctx) => () => {
    const [x, y] = sample(NAMES, 2), k1 = ri(2, 5), k2 = ri(2, 5), A = { dist: ri(2, 9) * k1 * 10, time: k1 }, B = { dist: ri(2, 9) * k2 * 10, time: k2 }, sa = A.dist / A.time, sb = B.dist / B.time; if (sa === sb) return null;
    return mc(`${x} travels ${A.dist} km in ${A.time} hours. ${y} travels ${B.dist} km in ${B.time} hours. Who is ${b('faster')}?`, sa > sb ? x : y, [sa > sb ? y : x, 'They are equally fast'], `${x}: ${sa} km/h. ${y}: ${sb} km/h.`, 3);
  }),
  R(/^Ratios and rates: word problems$/, () => () => {
    const n = ri(3, 9), per = ri(2, 12), nm = pick(NAMES), pr = pick(['km', 'items', 'pages']);
    return num(`${nm} reads at a rate of ${per} pages per ${pr === 'km' ? 'hour' : 'hour'}. How many pages does ${nm} read in ${n} hours?`, per * n, `${per} × ${n} = ${b(per * n)}.`);
  }),
  R(/^Ratios and rates: complete a table and make a graph$/, () => () => {
    const k = ri(2, 9), hole = ri(1, 3);
    return num(`${table(['Hours', 'Pages'], [1, 2, 3, 4].map((h, i) => [h, i === hole ? '?' : k * h]))}The rate is constant. What is the missing number?`, k * [1, 2, 3, 4][hole], `Pages = ${k} × hours: ${b(k * [1, 2, 3, 4][hole])}.`);
  }),
  R(/^Do the ratios form a proportion(?:: word problems)?\??$/, (mt, ctx) => () => {
    const a = ri(2, 9), c = ri(2, 9), k = ri(2, 5), prop = Math.random() < 0.5, d = prop ? c * k : c * k + pick([-1, 1, 2]); if (a === c) return null; const nm = pick(NAMES);
    if (/word/.test(ctx.title)) return yesNo(`${nm} mixes ${a} cups of juice with ${c} cups of water. Another mix uses ${a * k} cups of juice and ${d} cups of water. Do the two mixes have the same taste (are the ratios proportional)?`, d === c * k, d === c * k ? 'Both ratios simplify to the same value.' : `${a}:${c} is not equal to ${a * k}:${d}.`, ['Yes', 'No']);
    return yesNo(`Do the ratios ${b(`${a}:${c}`)} and ${b(`${a * k}:${d}`)} form a proportion?`, d === c * k, d === c * k ? `Both equal ${fs(...simp(a, c))}.` : `${a}/${c} ≠ ${a * k}/${d}.`, ['Yes', 'No']);
  }),
  R(/^Solve (?:the )?proportions?(?:: word problems)?$/, (mt, ctx) => () => {
    const a = ri(2, 9), c = ri(2, 9), k = ri(2, 6), x = c * k; if (a === c) return null;
    if (/word/.test(ctx.title)) { const nm = pick(NAMES); return num(`${nm} can type ${a * k} words in ${a} minutes. At the same rate, how many words can ${nm} type in ${c} minutes?`, c * k, `${a * k}/${a} = x/${c}, so x = ${b(c * k)}.`); }
    return num(`Solve the proportion. ${m(`${stack(a, c)} = ${stack(a * k, 'x')}`)}`, c * k, `Cross-multiply: ${a}x = ${a * k * c}, so x = ${b(c * k)}.`);
  }),
  R(/^Estimate population size using proportions$/, () => () => {
    const tagged = ri(2, 8) * 10, sample_ = ri(2, 6) * 10, recap = ri(2, 6), N = (tagged * sample_) / recap; if (!Number.isInteger(N)) return null;
    return num(`Biologists tag ${tagged} fish and release them. Later they catch ${sample_} fish and ${recap} of them are tagged. About how many fish are in the lake?`, N, `${tagged}/N = ${recap}/${sample_}, so N = ${b(N)}.`);
  }),
  R(/^Scale drawings: word problems$/, () => () => {
    const scale = pick([2, 5, 10, 20, 50]), d = ri(2, 9), unit = pick(['cm', 'cm']), toActual = Math.random() < 0.6;
    return toActual ? num(`On a map, ${b('1 cm')} represents ${b(scale + ' km')}. Two towns are ${b(d + ' cm')} apart on the map. How far apart are they in real life? (km)`, d * scale, `${d} × ${scale} = ${b(d * scale)} km.`) : num(`On a map, ${b('1 cm')} represents ${b(scale + ' km')}. Two towns are ${b(d * scale + ' km')} apart. How far apart are they on the map? (cm)`, d, `${d * scale} ÷ ${scale} = ${b(d)} cm.`);
  }),

  /* ===== percents ===== */
  R(/^Convert between percents, fractions and decimals: word problems$/, () => () => {
    const [n, d] = pick([[1, 4], [3, 4], [1, 5], [2, 5], [3, 10], [7, 20]]), p = (n * 100) / d, nm = pick(NAMES);
    return mc(`${nm} answered ${b(fs(n, d))} of the questions correctly. What percent is that?`, fmtPct(p), uniq([fmtPct(p + 10), fmtPct(100 - p), fmtPct(fix(100 / d, 1))]).filter(v_ => v_ !== fmtPct(p)), `${fs(n, d)} = ${b(fmtPct(p))}.`, 4);
  }),
  R(/^Compare percents to each other and to fractions(?: and decimals)?$|^Compare percents to fractions and decimals$|^Compare percents of numbers$/, (mt, ctx) => () => {
    if (/of numbers/.test(ctx.title)) { const a = pick(pctNice), c = pick(pctNice), x = pick([40, 60, 80, 100, 120, 200]), y = pick([40, 60, 80, 100, 120, 200]), va = (a * x) / 100, vc = (c * y) / 100, s = va === vc ? '=' : va > vc ? '>' : '<'; return mc(`Compare. ${m(`${a}% of ${x} ___ ${c}% of ${y}`)}`, s, ['<', '>', '='].filter(v_ => v_ !== s), `${va} ${s} ${vc}.`, 3); }
    const p = pick([20, 25, 40, 50, 60, 75, 80]), [n, d] = pick([[1, 2], [1, 4], [3, 4], [1, 5], [3, 5], [7, 10]]), dv = pick([0.2, 0.25, 0.4, 0.5, 0.6, 0.75]); const kind = pick(['frac', 'dec']);
    const v_ = kind === 'frac' ? n / d : dv, s = cmpSym2(p / 100, v_);
    return mc(`Compare. ${m(`${p}% ___ ${kind === 'frac' ? stack(n, d) : dv}`)}`, s, ['<', '>', '='].filter(x => x !== s), `${p}% = ${p / 100}; ${kind === 'frac' ? `${n}/${d} = ${fix(n / d, 3)}` : dv}.`, 3);
  }),
  R(/^Estimate percents of numbers$/, () => () => {
    const x = ri(21, 199), p = pick([10, 20, 25, 50, 15]), est = Math.round(x / 10) * 10;
    return num(`Estimate ${b(p + '%')} of ${b(x)}. (Round ${x} to the nearest 10 first.)`, (est * p) / 100, `${est} × ${p}% = ${b((est * p) / 100)}.`);
  }),
  R(/^Solve percent problems using (?:grid|strip) models$/, () => () => {
    const p = pick([10, 20, 25, 30, 40, 50, 60, 75]), x = pick([20, 40, 60, 80, 100, 200]);
    return num(`A bar representing ${b(x)} is split into 10 equal parts. ${b(p + '%')} of the bar is shaded. How much is shaded?`, (p * x) / 100, `${p}% of ${x} = ${b((p * x) / 100)}.`);
  }),
  R(/^Percents of numbers and money amounts$|^Percents of numbers: word problems$|^Percents of numbers$/, (mt, ctx) => () => {
    const p = pick(pctNice), x = pick([20, 40, 60, 80, 120, 200, 250, 400]), v_ = fix((p * x) / 100, 2), nm = pick(NAMES), money_ = /money/.test(ctx.title) || Math.random() < 0.4;
    if (/word/.test(ctx.title)) return num(`${nm} scored ${b(p + '%')} on a test with ${b(x)} marks. How many marks did ${nm} earn?`, v_, `${p}% × ${x} = ${b(v_)}.`);
    return num(`What is ${b(p + '%')} of ${b(money_ ? dollars(x) : x)}?${money_ ? ' (in dollars)' : ''}`, v_, `${p / 100} × ${x} = ${b(money_ ? dollars(v_) : v_)}.`);
  }),
  R(/^Find what percent one number is of another(?:: word problems)?$/, (mt, ctx) => () => {
    const p = pick([10, 20, 25, 40, 50, 60, 75, 80]), whole = pick([20, 40, 50, 80, 100, 200]), part = (p * whole) / 100, nm = pick(NAMES);
    return /word/.test(ctx.title) ? num(`${nm} read ${part} pages of a ${whole}-page book. What percent of the book did ${nm} read? (Answer without the % sign)`, p, `${part} ÷ ${whole} = ${p / 100} = ${b(p + '%')}.`) : num(`${b(part)} is what percent of ${b(whole)}? (Answer without the % sign)`, p, `${part} ÷ ${whole} = ${b(p + '%')}.`);
  }),
  R(/^Find the total given a part and a percent$/, () => () => {
    const p = pick([10, 20, 25, 40, 50, 75]), total = pick([40, 80, 100, 120, 200, 400]), part = (p * total) / 100;
    return num(`${b(part)} is ${b(p + '%')} of a number. What is the number?`, total, `${part} ÷ ${p / 100} = ${b(total)}.`);
  }),
  R(/^Solve percent problems$|^Solve percent word problems$|^Solve percent equations(?:: word problems)?$/, (mt, ctx) => () => {
    const p = pick([10, 20, 25, 30, 40, 50, 60, 75]), whole = pick([20, 40, 60, 80, 100, 120, 200]), part = (p * whole) / 100, which = pick(['part', 'percent', 'whole']), nm = pick(NAMES);
    if (/word/.test(ctx.title)) return which === 'whole' ? num(`${nm} saved ${part} dollars, which is ${p}% of the goal. What is the goal? ($)`, whole, `${part} ÷ ${p / 100} = ${b(whole)}.`) : num(`${nm}'s goal is $${whole}. ${nm} has reached ${p}% of it. How many dollars is that?`, part, `${p}% × ${whole} = ${b(part)}.`);
    if (which === 'part') return num(`${m(`x = ${p}% × ${whole}`)}. Find x.`, part, `${b(part)}.`);
    if (which === 'percent') return num(`${m(`${part} = x% × ${whole}`)}. Find x.`, p, `${part} ÷ ${whole} = ${b(p / 100)}, so x = ${b(p)}.`);
    return num(`${m(`${part} = ${p}% × x`)}. Find x.`, whole, `${part} ÷ ${p / 100} = ${b(whole)}.`);
  }),
  R(/^Percent of change(?:: word problems)?$/, (mt, ctx) => () => {
    const a = pick([20, 40, 50, 80, 100, 200]), pc = pick([10, 20, 25, 50]), up = Math.random() < 0.5, bnew = a + (up ? 1 : -1) * (a * pc) / 100, nm = pick(NAMES);
    if (/word/.test(ctx.title)) return num(`A game's price ${up ? 'rose' : 'dropped'} from ${moneyShort(a)} to ${moneyShort(bnew)}. What is the percent ${up ? 'increase' : 'decrease'}? (Answer without the % sign)`, pc, `Change = ${moneyShort(Math.abs(bnew - a))}; ${Math.abs(bnew - a)} ÷ ${a} = ${b(pc + '%')}.`);
    return num(`A value changes from ${b(a)} to ${b(bnew)}. What is the percent of change? (Answer without the % sign or the minus)`, pc, `|${bnew} − ${a}| ÷ ${a} = ${b(pc + '%')} ${up ? 'increase' : 'decrease'}.`);
  }),

  /* ===== consumer math ===== */
  R(/^Which is the better coupon\?$/, () => () => {
    const price = pick([40, 60, 80, 100, 120]), p = pick([10, 15, 20, 25]), off = pick([5, 8, 10, 12, 15]), a = (price * p) / 100; if (a === off) return null;
    return mc(`An item costs $${price}. Coupon A gives ${b(p + '% off')}. Coupon B gives ${b('$' + off + ' off')}. Which coupon saves more?`, a > off ? 'Coupon A' : 'Coupon B', [a > off ? 'Coupon B' : 'Coupon A', 'They save the same'], `A saves $${a} and B saves $${off}.`, 3);
  }),
  R(/^Unit prices(?: with fractions and decimals)?$|^Unit prices: find the total price$/, (mt, ctx) => () => {
    const item = shopItem(), n = ri(2, 12), up = priceOf(item), total = fix(n * up, 2), nm = item[1];
    if (/total price/.test(ctx.title)) return num(`${cap(nm)} cost ${b(dollars(up))} each. What is the total price of ${b(n)} ${nm}? ($)`, total, `${n} × ${dollars(up)} = ${b(dollars(total))}.`);
    const fr = /fractions/.test(ctx.title) && Math.random() < 0.5; if (fr) { const wholes = ri(2, 5); return num(`${wholes} ${nm} cost ${b(dollars(wholes * up))}. What is the price of one ${item[0]}? ($)`, up, `${dollars(wholes * up)} ÷ ${wholes} = ${b(dollars(up))}.`); }
    const [u1, u2] = [fix(up, 2), fix(up + ri(1, 4) / 10, 2)], q1 = ri(2, 6), q2 = ri(2, 6), p1 = fix(u1 * q1, 2), p2 = fix(u2 * q2, 2);
    if (q1 === q2) return null;
    return mc(`A ${q1}-pack of ${nm} costs ${dollars(p1)} and a ${q2}-pack costs ${dollars(p2)}. Which is the better buy (lower price per ${item[0]})?`, u1 < u2 ? `${q1}-pack` : `${q2}-pack`, [u1 < u2 ? `${q2}-pack` : `${q1}-pack`], `${dollars(u1)} per item vs ${dollars(u2)} per item.`, 2);
  }),
  R(/^Sale prices(?:: find the original price)?$|^Percent of a number: tax, discount and more$|^Find the percent: tax, discount and more$|^Percents - calculate tax, tip, mark-up and more$|^Multi-step problems with percents$/, (mt, ctx) => () => {
    const kind = pick(['discount', 'tax', 'tip', 'markup']), nm = pick(NAMES);
    // realistic rates: sales tax 5–15%, tips 10–20%, discounts and mark-ups up to 50%
    const p = kind === 'tax' ? pick([5, 10, 13, 15]) : kind === 'tip' ? pick([10, 15, 20]) : pick([10, 15, 20, 25, 30, 40, 50]);
    const price = kind === 'tip' ? pick([20, 40, 60, 80, 120]) : pick([20, 40, 50, 60, 80, 120, 200]), amt = fix((price * p) / 100, 2);
    const thingFor = pick(['jacket', 'backpack', 'pair of shoes', 'bike helmet', 'lamp', 'board game']);
    if (/original price/.test(ctx.title)) { const sale = price - amt; return num(`After a ${b(p + '% discount')}, a jacket costs ${b(dollars(sale))}. What was the original price? ($)`, price, `The sale price is ${100 - p}% of the original: ${sale} ÷ ${(100 - p) / 100} = ${b(dollars(price))}.`); }
    if (/Find the percent/.test(ctx.title)) return num(kind === 'tip'
      ? `A restaurant bill is ${b(dollars(price))} and ${nm} leaves a tip of ${b(dollars(amt))}. What percent tip is that? (Answer without the % sign)`
      : kind === 'markup' ? `A store buys a ${thingFor} for ${b(dollars(price))} and sells it for ${b(dollars(price + amt))}. What percent is the mark-up? (Answer without the % sign)`
      : `${cap(aAn(dollars(price)))} ${b(dollars(price))} ${thingFor} has ${kind === 'tax' ? 'sales tax' : 'a discount'} of ${b(dollars(amt))}. What percent is that? (Answer without the % sign)`, p, `${amt} ÷ ${price} = ${b(p + '%')}.`);
    if (/Multi-step/.test(ctx.title)) { const tax = pick([5, 10]), net = price - amt, total = fix(net * (1 + tax / 100), 2); return num(`${cap(aAn(dollars(price)))} ${b(dollars(price))} ${thingFor} is ${p}% off, and then ${tax}% sales tax is added to the sale price. What is the final price? ($)`, total, `Sale price ${dollars(net)}; adding ${tax}% gives ${b(dollars(total))}.`); }
    const fin = kind === 'discount' ? fix(price - amt, 2) : fix(price + amt, 2);
    const text = {
      discount: `${cap(aAn(dollars(price)))} ${b(dollars(price))} ${thingFor} is on sale for ${b(p + '% off')}. What is the sale price? ($)`,
      tax: `${cap(aAn(dollars(price)))} ${b(dollars(price))} ${thingFor} has ${b(p + '% sales tax')} added. What is the total cost? ($)`,
      tip: `${nm}'s restaurant bill is ${b(dollars(price))}. ${nm} adds a ${b(p + '% tip')}. What is the total? ($)`,
      markup: `A store pays ${b(dollars(price))} for a ${thingFor} and marks it up ${b(p + '%')}. What is the selling price? ($)`
    }[kind];
    return num(text, fin, `${dollars(price)} ${kind === 'discount' ? '−' : '+'} ${dollars(amt)} = ${b(dollars(fin))}.`);
  }),
  R(/^Estimate tips$/, () => () => {
    const bill = ri(20, 90), p = pick([10, 15, 20]), est = Math.round(bill / 10) * 10;
    return num(`Estimate a ${b(p + '%')} tip on a bill of ${b(dollars(bill))}. (Round the bill to the nearest $10 first.) ($)`, (est * p) / 100, `${est} × ${p}% = ${b(dollars((est * p) / 100))}.`);
  }),
  R(/^Simple interest$/, () => () => {
    const P0 = pick([200, 500, 800, 1000, 2000]), r = pick([2, 3, 4, 5, 6]), t = ri(2, 5), I = (P0 * r * t) / 100;
    return num(`How much simple interest is earned on ${b(dollars(P0))} at ${b(r + '%')} per year for ${b(t + ' years')}? ($)`, I, `I = Prt = ${P0} × ${r / 100} × ${t} = ${b(dollars(I))}.`);
  }),
  R(/^Compound interest$/, () => () => {
    const P0 = pick([1000, 2000, 500]), r = pick([5, 10]), t = ri(2, 3), A = fix(P0 * (1 + r / 100) ** t, 2);
    return num(`${b(dollars(P0))} is invested at ${b(r + '%')} interest compounded yearly. What is the balance after ${b(t + ' years')}? ($)`, A, `A = ${P0} × ${1 + r / 100}^${t} = ${b(dollars(A))}.`);
  }),
  R(/^Add, subtract, multiply and divide money amounts: word problems$|^Multiply money amounts by whole numbers$|^Multiply money amounts: word problems$|^Divide money amounts(?:: word problems)?$/, (mt, ctx) => () => {
    const item = shopItem(), up = priceOf(item), n = ri(2, 9), nm = pick(NAMES), t = ctx.title;
    if (/Divide/.test(t)) { const tot = fix(up * n, 2); return num(`${nm} pays ${b(dollars(tot))} for ${n} ${item[1]} that all cost the same. What does one ${item[0]} cost? ($)`, up, `${dollars(tot)} ÷ ${n} = ${b(dollars(up))}.`); }
    if (/Multiply/.test(t)) return num(`${nm} buys ${n} ${item[1]} that cost ${b(dollars(up))} each. What is the total? ($)`, fix(up * n, 2), `${n} × ${dollars(up)} = ${b(dollars(up * n))}.`);
    // build the story backwards so the money left over is always positive
    const first = shopItem(0, 10), firstPrice = priceOf(first), left = (ri(5, 300) * 5) / 100, start = fix(firstPrice + up * n + left, 2);
    return num(`${nm} has ${dollars(start)}. ${nm} buys ${aAn(first[0])} ${first[0]} for ${dollars(firstPrice)}, then buys ${n} ${item[1]} at ${dollars(up)} each. How much money is left? ($)`, left, `${dollars(start)} − ${dollars(firstPrice)} − ${n} × ${dollars(up)} = ${b(dollars(left))}.`);
  }),
  R(/^Financial institution vocabulary$/, () => () => {
    const T = [['A fee charged for borrowing money, shown as a percent', 'Interest rate'], ['Money you put into a bank account', 'Deposit'], ['Taking money out of an account', 'Withdrawal'], ['A bank account used for everyday spending', 'Chequing account'], ['A bank account that earns interest on money you keep', 'Savings account'],
      ['The amount of money that is in an account right now', 'Balance'], ['The original amount of money that is deposited or borrowed', 'Principal'], ['A card that takes money straight from your chequing account when you pay', 'Debit card'], ['A card that lets you borrow money now and pay it back later', 'Credit card'],
      ['Money that is borrowed and must be paid back, usually with interest', 'Loan'], ['A loan used to buy a home', 'Mortgage'], ['A record of the deposits, withdrawals and fees on an account', 'Bank statement'], ['A charge a bank takes for providing a service', 'Service fee'],
      ['Interest that is calculated only on the original amount', 'Simple interest'], ['Interest that is calculated on the original amount and on interest already earned', 'Compound interest'], ['A machine that lets you take out or deposit money without a teller', 'ATM'],
      ['Pay that goes straight into your bank account from an employer', 'Direct deposit'], ['A plan for how to spend and save money', 'Budget'], ['Spending more money than is in your account', 'Overdraft'], ['An investment that locks in money for a set time at a fixed interest rate', 'GIC (guaranteed investment certificate)']];
    const all = T.map(x => x[1]), q = pick(T);
    if (Math.random() < 0.35) { const wrong = sample(T.filter(x => x[1] !== q[1]), 3).map(x => x[0]); return mc(`What does ${b(q[1])} mean?`, q[0], wrong, `${q[1]}: ${q[0].toLowerCase()}.`, 4); }
    return mc(`Which term matches this? ${b(q[0])}`, q[1], sample(all, 3, [q[1]]), `${b(q[1])}.`, 4);
  }),
  R(/^Compare savings options$/, () => () => {
    const P0 = pick([500, 1000, 2000]), r1 = pick([2, 3, 4]), r2 = r1 + pick([-1, 1]), t = pick([2, 3, 4]), a = P0 * r1 * t / 100, c = P0 * r2 * t / 100;
    return mc(`Account A pays ${b(r1 + '%')} simple interest and Account B pays ${b(r2 + '%')}. Which earns more on ${dollars(P0)} over ${t} years?`, a > c ? 'Account A' : 'Account B', [a > c ? 'Account B' : 'Account A'], `A earns ${dollars(a)} and B earns ${dollars(c)}.`, 2);
  }),

  /* ===== metric units & measurement ===== */
  R(/^Estimate metric measurements$/, () => () => {
    const q = pick([['the height of a door', '2 m', ['2 cm', '20 m', '200 m']], ['the mass of an apple', '150 g', ['150 kg', '15 g', '1.5 kg']], ['the capacity of a mug', '250 mL', ['250 L', '25 mL', '2.5 L']], ['the length of a pencil', '18 cm', ['18 m', '1.8 cm', '180 cm']], ['the mass of a car', '1500 kg', ['15 kg', '150 g', '15 000 kg']], ['the length of a classroom', '9 m', ['9 cm', '90 m', '900 m']], ['the capacity of a bathtub', '200 L', ['200 mL', '20 L', '2 L']], ['the mass of a pencil', '5 g', ['5 kg', '50 g', '500 g']], ['the height of a 12-year-old', '150 cm', ['15 cm', '15 m', '1.5 cm']], ['the capacity of a water bottle', '500 mL', ['500 L', '50 mL', '5 L']], ['the distance from Calgary to Edmonton', '300 km', ['300 m', '30 km', '3000 km']], ['the mass of a bag of sugar', '2 kg', ['2 g', '20 kg', '200 g']], ['the thickness of a book', '3 cm', ['3 m', '30 cm', '3 mm']], ['the capacity of a spoonful of syrup', '15 mL', ['15 L', '150 mL', '1.5 mL']], ['the mass of an adult', '70 kg', ['7 kg', '700 kg', '70 g']], ['the length of a school bus', '12 m', ['12 cm', '120 m', '1.2 m']], ['the capacity of a kitchen sink', '20 L', ['200 mL', '2 L', '200 L']], ['the width of a thumbnail', '1 cm', ['1 m', '10 cm', '1 km']]]);
    return mc(`Which is the best estimate for ${b(q[0])}?`, q[1], q[2], `${q[0]} is about ${b(q[1])}.`, 4);
  }),
  R(/^(?:Convert and compare|Compare and convert) metric units$|^Convert rates and measurements: metric units$|^Mixed metric units$|^Multi-step problems with metric unit conversions$/, (mt, ctx) => () => {
    const t = ctx.title, pairs = [['km', 'm', 1000], ['m', 'cm', 100], ['cm', 'mm', 10], ['kg', 'g', 1000], ['g', 'mg', 1000], ['L', 'mL', 1000], ['t', 'kg', 1000]], [big_, small, f] = pick(pairs), n = ri(2, 9) + (Math.random() < 0.4 ? ri(1, 9) / 10 : 0);
    if (/Mixed/.test(t)) { const w = ri(2, 9), r = ri(1, 9); const [B, s, ff] = pick(pairs.slice(0, 6)); return num(`${m(`${w} ${B} ${r * (ff / 10)} ${s} = ___ ${s}`)}`, w * ff + r * (ff / 10), `${w} ${B} = ${fmt(w * ff)} ${s}, plus ${r * (ff / 10)} ${s} = ${b(fmt(w * ff + r * (ff / 10)))} ${s}.`); }
    if (/Multi-step/.test(t)) { const a = ri(2, 9), c = ri(100, 900); return num(`A ribbon is ${b(a + ' m')} long. ${b(c + ' cm')} is cut off. How many centimetres are left?`, a * 100 - c > 0 ? a * 100 - c : a * 100 + c, a * 100 - c > 0 ? `${a * 100} − ${c} = ${b(a * 100 - c)} cm.` : `${a * 100} + ${c} = ${b(a * 100 + c)} cm.`); }
    if (/rates/.test(t)) {
      const k = ri(2, 15), who = pick(NAMES), R3 = [
        [`A car travels ${b(k * 10 + ' km/h')}. How many metres per hour is that?`, k * 10000, `${k * 10} × 1000 = ${b(fmt(k * 10000))} m/h.`],
        [`${who} cycles at ${b(k * 6 + ' km/h')}. How many metres per minute is that?`, k * 100, `${k * 6} km/h = ${fmt(k * 6000)} m/h, and ${fmt(k * 6000)} ÷ 60 = ${b(k * 100)} m/min.`],
        [`A runner moves at ${b(k * 5 + ' m/s')}. How many metres per minute is that?`, k * 300, `${k * 5} × 60 = ${b(fmt(k * 300))} m/min.`],
        [`A fountain pumps ${b(k + ' L/min')}. How many millilitres per minute is that?`, k * 1000, `${k} × 1000 = ${b(fmt(k * 1000))} mL/min.`],
        [`A conveyor belt moves ${b(k * 5 + ' m/s')}. How many kilometres per hour is that?`, k * 18, `${k * 5} m/s × 3600 s/h ÷ 1000 = ${b(k * 18)} km/h.`],
        [`A train travels ${b(k * 18 + ' km/h')}. How many metres per second is that?`, k * 5, `${k * 18} × 1000 ÷ 3600 = ${b(k * 5)} m/s.`],
        [`A snail crawls ${b(k * 5 + ' cm/s')}. How many metres per minute is that?`, k * 3, `${k * 5} × 60 = ${fmt(k * 300)} cm/min, which is ${b(k * 3)} m/min.`],
        [`A factory uses ${b(k * 2 + ' kg/h')} of flour. How many grams per hour is that?`, k * 2000, `${k * 2} × 1000 = ${b(fmt(k * 2000))} g/h.`],
        [`A faucet drips ${b(k * 3 + ' mL/s')}. How many litres per minute is that?`, k * 0.18, `${k * 3} × 60 = ${fmt(k * 180)} mL/min = ${b(fix(k * 0.18, 2))} L/min.`]];
      const [q, a, e] = pick(R3); return num(q, a, e);
    }
    const P2 = [['km', 'cm', 100000], ['m', 'mm', 1000], ['kg', 'mg', 1000000], ['km', 'm', 1000], ['m', 'cm', 100], ['kg', 'g', 1000], ['L', 'mL', 1000], ['t', 'kg', 1000], ['g', 'mg', 1000], ['cm', 'mm', 10]], [B2, s2, f2] = pick(P2), who = pick(NAMES), n2 = pick([ri(2, 9), ri(11, 99) / 10, ri(2, 40) / 4, ri(2, 9) + ri(1, 9) / 10]), form = ri(0, 4);
    if (form === 1) { const v = fix(n2 * f2, 3); return num(`Convert. ${m(`${fmt(v)} ${s2} = ___ ${B2}`)}`, fix(n2, 3), `${fmt(v)} ÷ ${fmt(f2)} = ${b(fmt(fix(n2, 3)))} ${B2}.`); }
    if (form === 2) { const ctxt = { km: 'trail', m: 'rope', kg: 'bag of potatoes', L: 'jug', t: 'truck load', g: 'chocolate bar', cm: 'ribbon' }[B2] || 'item'; return num(`${who}'s ${ctxt} measures ${b(fmt(fix(n2, 3)) + ' ' + B2)}. How many ${s2} is that?`, fix(n2 * f2, 3), `${fmt(fix(n2, 3))} × ${fmt(f2)} = ${b(fmt(fix(n2 * f2, 3)))} ${s2}.`); }
    if (form === 3) { const v = fix(n2 * f2, 3), other = fix(v + pick([-1, 0, 1]) * f2 / 10, 3), sym = cmpSym2(v, other); return mc(`Compare. ${m(`${fmt(fix(n2, 3))} ${B2} ___ ${fmt(other)} ${s2}`)}`, sym, ['<', '>', '='].filter(v_ => v_ !== sym), `${fmt(fix(n2, 3))} ${B2} = ${fmt(v)} ${s2}.`, 3); }
    if (Math.random() < 0.6) return num(`Convert. ${m(`${n} ${big_} = ___ ${small}`)}`, fix(n * f, 3), `${n} × ${fmt(f)} = ${b(fmt(fix(n * f, 3)))} ${small}.`);
    const other = fix(n * f + pick([-1, 0, 1]) * f / 10, 3), sym = cmpSym2(fix(n * f, 3), other);
    return mc(`Compare. ${m(`${n} ${big_} ___ ${fmt(other)} ${small}`)}`, sym, ['<', '>', '='].filter(v_ => v_ !== sym), `${n} ${big_} = ${fmt(fix(n * f, 3))} ${small}.`, 3);
  }),
  R(/^Convert square and cubic units of length$|^Convert square units of length$/, () => () => {
    const sq = Math.random() < 0.6, [A, B, f] = pick([['m', 'cm', 100], ['cm', 'mm', 10], ['km', 'm', 1000]]), n = ri(2, 9);
    return num(`${sq ? `${n} ${A}² = ___ ${B}²` : `${n} ${A}³ = ___ ${B}³`}`, n * f ** (sq ? 2 : 3), `1 ${A} = ${f} ${B}, so 1 ${A}${sq ? '²' : '³'} = ${fmt(f ** (sq ? 2 : 3))} ${B}${sq ? '²' : '³'}. ${n} × ${fmt(f ** (sq ? 2 : 3))} = ${b(fmt(n * f ** (sq ? 2 : 3)))}.`);
  }),
  R(/^Convert between cubic metres and litres$|^Convert between cubic centimetres and millilitres$/, (mt, ctx) => () => {
    const big_ = /cubic metres/.test(ctx.title), f = ri(0, 3), who = pick(NAMES);
    if (big_) {
      const n = pick([ri(2, 9), ri(10, 60), ri(1, 9) / 10, ri(1, 99) / 10, ri(11, 99) / 20]);
      if (f === 1) { const k = ri(2, 60) * 100; return num(`${fmt(k * 10)} L = ___ m³`, k / 100, `1 m³ = 1000 L, so ${fmt(k * 10)} ÷ 1000 = ${b(fmt(k / 100))} m³.`); }
      if (f === 2) { const it = pick(['water tank', 'rain barrel', 'swimming pool', 'aquarium', 'storage bin']); return num(`${who}'s ${it} holds ${b(fmt(fix(n, 2)) + ' m³')} of water. How many litres is that?`, fix(n * 1000, 2), `${fmt(fix(n, 2))} × 1000 = ${b(fmt(fix(n * 1000, 2)))} L.`); }
      if (f === 3) { const k = ri(2, 40) * 1000; return num(`A pool holds ${b(fmt(k) + ' L')} of water. What is its volume in cubic metres?`, k / 1000, `1000 L = 1 m³, so ${fmt(k)} ÷ 1000 = ${b(k / 1000)} m³.`); }
      return num(`${fmt(fix(n, 2))} m³ = ___ L`, fix(n * 1000, 2), `1 m³ = 1000 L: ${fmt(fix(n, 2))} × 1000 = ${b(fmt(fix(n * 1000, 2)))}.`);
    }
    const n = pick([ri(2, 9) * 10, ri(11, 99), ri(100, 900), ri(10, 99) * 5]);
    if (f === 1) return num(`${fmt(n)} mL = ___ cm³`, n, `1 mL = 1 cm³, so ${fmt(n)} mL = ${b(fmt(n))} cm³.`);
    if (f === 2) { const it = pick(['syringe', 'measuring cup', 'juice box', 'water bottle', 'small box']); return num(`${who}'s ${it} holds ${b(fmt(n) + ' cm³')} of liquid. How many millilitres is that?`, n, `1 cm³ = 1 mL, so ${b(fmt(n))} mL.`); }
    if (f === 3) { const L = ri(2, 12); return num(`A cube-shaped container holds ${b(L + ' L')} of water. What is its volume in cm³?`, L * 1000, `1 L = 1000 mL = 1000 cm³, so ${L} L = ${b(fmt(L * 1000))} cm³.`); }
    return num(`${fmt(n)} cm³ = ___ mL`, n, `1 cm³ = 1 mL: ${b(fmt(n))}.`);
  }),
  R(/^Precision$/, () => () => {
    const x = ri(21, 99) / 10, ans = dec(x, 2).replace(/0$/, '') === dec(x, 1) ? dec(x + 0.01, 2) : dec(x, 2);
    return mc(`Which measurement is more precise: ${b(dec(x, 1) + ' cm')} or ${b(dec(x + 0.03, 2) + ' cm')}?`, dec(x + 0.03, 2) + ' cm', [dec(x, 1) + ' cm'], `More decimal places means a smaller unit of measurement, so ${b(dec(x + 0.03, 2) + ' cm')} is more precise.`, 2);
  }),
  R(/^Compare temperatures above and below zero$/, () => () => {
    const a = ri(-15, 15), c = ri(-15, 15); if (a === c) return null;
    return mc(`Which temperature is ${b('colder')}: ${b(S(a) + '°C')} or ${b(S(c) + '°C')}?`, S(Math.min(a, c)) + '°C', [S(Math.max(a, c)) + '°C'], `${S(Math.min(a, c))} is farther left on the number line.`, 2);
  }),
  R(/^Time units$|^Find start and end times$/, (mt, ctx) => () => {
    if (/Time units/.test(ctx.title)) { const [u, sm, f] = pick([['hour', 'minutes', 60], ['minute', 'seconds', 60], ['day', 'hours', 24], ['week', 'days', 7]]), n = ri(2, 9); return num(`${n} ${u}s = ___ ${sm}`, n * f, `${n} × ${f} = ${b(n * f)}.`); }
    const h = ri(6, 11), mi = pick([0, 15, 30, 45]), d = pick([45, 75, 90, 120, 150]), end = h * 60 + mi + d, fm = t => `${Math.floor(t / 60) % 12 || 12}:${String(t % 60).padStart(2, '0')}`;
    return mc(`A class starts at ${b(fm(h * 60 + mi) + (h < 12 ? ' a.m.' : ' p.m.'))} and lasts ${b(d + ' minutes')}. What time does it end?`, fm(end) + (end >= 720 ? ' p.m.' : ' a.m.'), uniq([fm(end + 15) + (end + 15 >= 720 ? ' p.m.' : ' a.m.'), fm(end - 15) + (end - 15 >= 720 ? ' p.m.' : ' a.m.'), fm(end + 60) + (end + 60 >= 720 ? ' p.m.' : ' a.m.')]).filter(v_ => v_ !== fm(end) + (end >= 720 ? ' p.m.' : ' a.m.')), `Add ${d} minutes.`, 4);
  })
];
function cmpSym2(a, c) { a = fix(a, 9); c = fix(c, 9); return a === c ? '=' : a > c ? '>' : '<'; }
