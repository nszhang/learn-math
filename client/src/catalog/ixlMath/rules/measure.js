/* Measurement strand (Grades 1–5): units, thermometers & rulers, clocks & elapsed time, calendars, Canadian money. */
import {
  ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, num, mc, yesNo, near, svg, C, thing, NAMES, emojiRow, big, clock, digital, table, money, moneyShort, cap, shopItem, priceOf, aAn
} from '../h.js';
import { R } from '../engine.js';

const pad = n => String(n).padStart(2, '0');
const t12 = (H, mi) => `${H % 12 || 12}:${pad(mi)} ${H >= 12 ? 'p.m.' : 'a.m.'}`;
const t24 = (H, mi) => `${pad(H)}:${pad(mi)}`;
const hm = (h, mi) => `${h} h${mi ? ' ' + mi + ' min' : ''}`;
const dur = mins => { const h = Math.floor(mins / 60), r = mins % 60; return h && r ? `${h} h ${r} min` : h ? `${h} h` : `${r} min`; };
const nextHour = h => (h % 12) + 1;
function timeWords(h, mi) {
  const H = h % 12 || 12;
  if (mi === 0) return `${H} o'clock`;
  if (mi === 30) return `half past ${H}`;
  if (mi === 15) return `quarter past ${H}`;
  if (mi === 45) return `quarter to ${nextHour(H)}`;
  return mi < 30 ? `${mi} minutes past ${H}` : `${60 - mi} minutes to ${nextHour(H)}`;
}

/* ---------- Canadian money ---------- */
const COINS = [['nickel', 5, '#cbd5e1', 38], ['dime', 10, '#e2e8f0', 32], ['quarter', 25, '#d1d5db', 42], ['loonie', 100, '#fcd34d', 46], ['toonie', 200, '#fbbf24', 50]];
const coinName = c => (c === 100 ? 'loonie' : c === 200 ? 'toonie' : c === 25 ? 'quarter' : c === 10 ? 'dime' : 'nickel');
const coinBadge = v => {
  const [, , col, size] = COINS.find(c => c[1] === v) || [0, 0, '#e2e8f0', 36];
  const label = v >= 100 ? '$' + v / 100 : v + '¢';
  return `<span style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:50%;background:${col};border:2px solid #64748b;font-size:12px;font-weight:700;margin:2px;color:#334155">${label}</span>`;
};
const billBadge = v => `<span style="display:inline-flex;align-items:center;justify-content:center;width:62px;height:30px;border-radius:4px;background:${{ 5: '#bfdbfe', 10: '#e9d5ff', 20: '#bbf7d0', 50: '#fecaca', 100: '#fde68a' }[v]};border:2px solid #64748b;font-size:13px;font-weight:700;margin:2px;color:#334155">$${v}</span>`;
const centsText = c => (c >= 100 ? '$' + (c / 100).toFixed(2) : c + '¢');
function coinSet(cents, kinds) {   // random set of coins totalling `cents`, using only `kinds` (descending greedy with randomness)
  const out = []; let left = cents;
  const ks = kinds.slice().sort((a, b2) => b2 - a);
  while (left > 0) {
    const ok = ks.filter(k => k <= left);
    if (!ok.length) return null;
    const k = Math.random() < 0.6 ? ok[0] : pick(ok);
    out.push(k); left -= k;
  }
  return out;
}
const coinsHtml = list => `<div style="margin:6px 0">${list.map(c => (c > 200 ? billBadge(c / 100) : coinBadge(c))).join('')}</div>`;
const ans$ = (cents) => cents / 100;

/* ---------- thermometer & ruler pictures ---------- */
function thermometer(temp, lo = -20, hi = 40) {
  const H = 170, x = 40, top = 14, bot = H - 24, Y = t => bot - ((t - lo) / (hi - lo)) * (bot - top);
  let inner = `<rect x="${x - 6}" y="${top - 6}" width="12" height="${bot - top + 14}" rx="6" fill="#fff" stroke="${C.ink}" stroke-width="2"/><circle cx="${x}" cy="${bot + 12}" r="11" fill="${C.red}" stroke="${C.ink}" stroke-width="2"/>`;
  inner += `<rect x="${x - 3}" y="${Y(temp)}" width="6" height="${bot + 6 - Y(temp)}" fill="${C.red}"/>`;
  for (let t = lo; t <= hi; t += 5) inner += `<line x1="${x + 8}" y1="${Y(t)}" x2="${x + (t % 10 === 0 ? 20 : 14)}" y2="${Y(t)}" stroke="${C.ink}"/>${t % 10 === 0 ? `<text x="${x + 24}" y="${Y(t) + 4}" font-size="11" fill="${C.ink}">${fmt(t)}</text>` : ''}`;
  return svg(110, H + 10, inner, 'aria-label="thermometer"');
}
function ruler(lenCm, { objectEmoji = '✏️', max = 15 } = {}) {
  const W = 40 + max * 28, inner = `<rect x="10" y="38" width="${max * 28 + 20}" height="34" fill="#fef3c7" stroke="${C.ink}" stroke-width="1.5"/>` +
    range(0, max).map(i => `<line x1="${20 + i * 28}" y1="38" x2="${20 + i * 28}" y2="${38 + 16}" stroke="${C.ink}"/><text x="${20 + i * 28}" y="67" font-size="11" text-anchor="middle" fill="${C.ink}">${i}</text>`).join('') +
    `<rect x="20" y="10" width="${lenCm * 28}" height="20" fill="#c7d2fe" stroke="${C.primary}" stroke-width="2" rx="3"/><text x="${20 + (lenCm * 28) / 2}" y="25" font-size="13" text-anchor="middle" fill="${C.ink}">${objectEmoji}</text>`;
  return svg(W, 80, inner, 'aria-label="ruler"');
}

/* ---------- units ---------- */
const OBJECTS = {
  length: [['a pencil', 'cm', 'a pencil is about 15 cm long'], ['a classroom door', 'm', 'a door is about 2 m tall'], ['the distance between two cities', 'km', 'cities are far apart, so use km'], ['a grain of rice', 'mm', 'a grain of rice is a few mm'], ['a bicycle', 'm', 'a bicycle is about 2 m long'], ['your thumb', 'cm', 'a thumb is about 6 cm'], ['a hockey rink', 'm', 'a hockey rink is about 60 m long'], ['an ant', 'mm', 'an ant is a few mm'], ['a road trip', 'km', 'long trips are measured in km']],
  mass: [['an apple', 'g', 'an apple is about 150 g'], ['a bag of potatoes', 'kg', 'a bag of potatoes is about 5 kg'], ['a paper clip', 'g', 'a paper clip weighs about 1 g'], ['a dog', 'kg', 'a dog weighs about 20 kg'], ['a pencil', 'g', 'a pencil weighs about 5 g'], ['a student', 'kg', 'a student weighs about 35 kg'], ['a slice of bread', 'g', 'a slice weighs about 30 g'], ['a car', 'kg', 'a car weighs about 1500 kg']],
  volume: [['a bathtub of water', 'L', 'a bathtub holds about 200 L'], ['a spoonful of medicine', 'mL', 'a spoonful is about 5 mL'], ['a bottle of juice', 'L', 'a juice bottle holds about 1 L'], ['an eyedropper of water', 'mL', 'an eyedropper holds about 1 mL'], ['a fish tank', 'L', 'a fish tank holds about 40 L'], ['a cup of tea', 'mL', 'a cup holds about 250 mL'], ['a swimming pool', 'L', 'a pool holds thousands of litres']]
};
const UNITS = {
  length: [['km', 1000000], ['m', 1000], ['cm', 10], ['mm', 1]],      // factor to mm
  mass: [['kg', 1000], ['g', 1]],
  volume: [['L', 1000], ['mL', 1]]
};
const UNIT_FULL = { mm: 'millimetres', cm: 'centimetres', m: 'metres', km: 'kilometres', g: 'grams', kg: 'kilograms', mL: 'millilitres', L: 'litres' };
const kindFromTitle = t => (/mass|weigh/i.test(t) ? 'mass' : /volume|capacity|liquid/i.test(t) ? 'volume' : 'length');

const CONVERT_PAIRS = {
  length: [['m', 'cm', 100], ['cm', 'mm', 10], ['km', 'm', 1000], ['m', 'mm', 1000]],
  mass: [['kg', 'g', 1000]],
  volume: [['L', 'mL', 1000]]
};

function converter(kind, grade) {
  return () => {
    const pairs = grade <= 3 ? CONVERT_PAIRS[kind].filter(p => p[2] <= 100 || kind !== 'length') : CONVERT_PAIRS[kind];
    const [big_, small, f] = pick(pairs.length ? pairs : CONVERT_PAIRS[kind]);
    const n = ri(2, 9) * (Math.random() < 0.3 ? 5 : 1);
    return Math.random() < 0.6
      ? num(`Convert. ${m(`${n} ${big_} = ___ ${small}`)}`, n * f, `1 ${big_} = ${fmt(f)} ${small}, so ${n} ${big_} = ${b(fmt(n * f))} ${small}.`)
      : num(`Convert. ${m(`${fmt(n * f)} ${small} = ___ ${big_}`)}`, n, `${fmt(f)} ${small} = 1 ${big_}, so ${fmt(n * f)} ${small} = ${b(n)} ${big_}.`);
  };
}

/* ---------- clock questions ---------- */
function clockTime(minStep) {
  const h = ri(1, 12), mi = pick(minStep === 'hour' ? [0] : minStep === 'half' ? [0, 30] : minStep === 'quarter' ? [0, 15, 30, 45] : minStep === 'five' ? range(0, 55, 5) : range(0, 59));
  return [h, mi];
}
const minStepFor = (title, grade) => (/o'clock, half, quarter/.test(title) ? 'quarter' : grade <= 1 ? (Math.random() < 0.5 ? 'hour' : 'half') : grade === 2 ? 'five' : grade === 3 ? 'five' : 'any');
const timeDistractors = (h, mi, fmtf) => uniq([fmtf(h, mi + 5 >= 60 ? 0 : mi + 5), fmtf(h % 12 + 1, mi), fmtf(h, mi === 0 ? 30 : 0), fmtf(mi / 5 || 12, h * 5 % 60)]).filter(x => x !== fmtf(h, mi));
const fm12 = (h, mi) => `${h}:${pad(mi)}`;

/* ---------- calendar ---------- */
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const SEASON_OF = m0 => (m0 === 11 || m0 <= 1 ? 'winter' : m0 <= 4 ? 'spring' : m0 <= 7 ? 'summer' : 'autumn');
function calendarHtml(mon, startDay, blank = []) {
  const days = MDAYS[mon];
  let t = `<table style="border-collapse:collapse;margin:6px 0;font-size:13px"><caption style="font-weight:700;text-align:left">${MONTHS[mon]}</caption><tr>${DAYS.map(d => `<th style="border:1px solid #cbd5e1;padding:2px 6px;background:#eef2ff">${d.slice(0, 3)}</th>`).join('')}</tr><tr>`;
  let col = 0;
  for (let i = 0; i < startDay; i++) { t += '<td style="border:1px solid #cbd5e1"></td>'; col++; }
  for (let d = 1; d <= days; d++) {
    t += `<td style="border:1px solid #cbd5e1;padding:2px 8px;text-align:center;${blank.includes(d) ? 'background:#fde68a;font-weight:700' : ''}">${blank.includes(d) ? '?' : d}</td>`;
    col++; if (col === 7 && d < days) { t += '</tr><tr>'; col = 0; }
  }
  return t + '</tr></table>';
}

/* ============================================================ */
export const MEASURE_RULES = [
  /* ===== G1–2 comparing & measuring with objects ===== */
  R(/^(Long and short|Tall and short)$/, (mt, ctx) => () => {
    const tall = /Tall/.test(ctx.title), items = tall ? [['tree', 5], ['flower', 1], ['giraffe', 6], ['cat', 1], ['house', 4], ['mouse', 1]] : [['snake', 5], ['worm', 2], ['rope', 4], ['pencil', 3], ['ribbon', 4], ['crayon', 2]];
    const [a, c] = sample(items, 2); if (a[1] === c[1]) return null;
    const longer = a[1] > c[1] ? a[0] : c[0];
    const askLong = Math.random() < 0.5, ans = askLong ? longer : (a[1] > c[1] ? c[0] : a[0]);
    return mc(`Which is ${askLong ? (tall ? 'taller' : 'longer') : (tall ? 'shorter' : 'shorter')}: a ${b(a[0])} or a ${b(c[0])}?`, ans, [askLong ? (a[0] === ans ? c[0] : a[0]) : (a[0] === ans ? c[0] : a[0])], `A ${ans} is ${askLong ? (tall ? 'taller' : 'longer') : 'shorter'}.`, 2);
  }),
  R(/^Order objects: length and height$/, () => () => {
    const lens = sample([1, 2, 3, 4, 5, 6, 7, 8], 3), bar = n => `<div style="height:14px;width:${n * 30}px;background:#a5b4fc;border:2px solid ${C.primary};border-radius:4px;margin:4px 0"></div>`;
    const names = ['A', 'B', 'C'], order = names.map((n, i) => [n, lens[i]]).sort((x, y) => x[1] - y[1]).map(x => x[0]).join(', ');
    const perms = [['A', 'B', 'C'], ['A', 'C', 'B'], ['B', 'A', 'C'], ['B', 'C', 'A'], ['C', 'A', 'B'], ['C', 'B', 'A']].map(p => p.join(', ')).filter(p => p !== order);
    return mc(`${names.map((n, i) => `<div style="display:flex;align-items:center;gap:8px"><b>${n}</b>${bar(lens[i])}</div>`).join('')}Order from ${b('shortest to longest')}.`, order, sample(perms, 3), `Shortest first: ${b(order)}.`);
  }),
  R(/^Indirect comparison$/, () => () => {
    const [a, c, d] = sample(['pencil', 'crayon', 'ribbon', 'stick', 'rope'], 3);
    return mc(`The ${a} is longer than the ${c}. The ${c} is longer than the ${d}. Which is the longest?`, a, [c, d], `${a} > ${c} > ${d}, so the ${b(a)} is longest.`, 3);
  }),
  R(/^Light and heavy$/, () => () => {
    const heavy = ['elephant', 'car', 'bus', 'horse', 'piano', 'truck'], light = ['feather', 'leaf', 'paper clip', 'pencil', 'balloon', 'button'];
    const h = pick(heavy), l = pick(light), wantHeavy = Math.random() < 0.5;
    return mc(`Which is ${wantHeavy ? 'heavier' : 'lighter'}?`, wantHeavy ? h : l, [wantHeavy ? l : h], `A ${wantHeavy ? h : l} is ${wantHeavy ? 'heavier' : 'lighter'}.`, 2);
  }),
  R(/^Holds more or less$/, () => () => {
    const big_ = ['bathtub', 'bucket', 'pool', 'jug', 'barrel'], small = ['teaspoon', 'cup', 'thimble', 'eyedropper', 'spoon'];
    const a = pick(big_), c = pick(small), more = Math.random() < 0.5;
    return mc(`Which holds ${more ? 'more' : 'less'}: a ${b(a)} or a ${b(c)}?`, more ? a : c, [more ? c : a], `A ${a} holds more than a ${c}.`, 2);
  }),
  R(/^Covers more or less$/, () => () => {
    const [[a, sa], [c, sc]] = sample([['a postage stamp', 1], ['a book cover', 4], ['a table top', 8], ['a classroom floor', 20], ['a coin', 0.5]], 2), more = Math.random() < 0.5;
    return mc(`Which covers ${more ? 'more' : 'less'} space: ${b(a)} or ${b(c)}?`, (sa > sc) === more ? a : c, [(sa > sc) === more ? c : a], `${(sa > sc) ? a : c} covers more space.`, 2);
  }),
  R(/^Compare size, weight and capacity$/, () => () => {
    const q = pick([['Which is heavier?', 'a bowling ball', 'a balloon', 'a bowling ball is heavier'], ['Which holds more?', 'a bucket', 'a spoon', 'a bucket holds more'], ['Which is longer?', 'a bus', 'a toy car', 'a bus is longer'], ['Which is lighter?', 'a feather', 'a rock', 'a feather is lighter'], ['Which holds less?', 'a cup', 'a bathtub', 'a cup holds less']]);
    return mc(q[0], q[3].match(/^a \w+( \w+)?/)[0], [q[1] === q[3].match(/^a \w+( \w+)?/)[0] ? q[2] : q[1]], `${q[3][0].toUpperCase() + q[3].slice(1)}.`, 2);
  }),
  R(/^Should you measure size, weight or capacity\?$/, () => () => {
    const q = pick([['how much water a bottle holds', 'capacity'], ['how long a worm is', 'size'], ['how heavy a watermelon is', 'weight'], ['how tall a tree is', 'size'], ['how much juice fits in a jug', 'capacity'], ['how heavy a backpack is', 'weight']]);
    return mc(`You want to find ${b(q[0])}. What should you measure?`, q[1], ['size', 'weight', 'capacity'].filter(x => x !== q[1]), `To find ${q[0]}, measure ${b(q[1])}.`, 3);
  }),
  R(/^Measure length with objects$/, () => () => {
    const n = ri(2, 12), [, , e] = pick([['paper clip', '', '📎'], ['cube', '', '🟦'], ['button', '', '🔘']]), name = e === '📎' ? 'paper clips' : e === '🟦' ? 'cubes' : 'buttons';
    return num(`${emojiRow(e, n, 12)}The line of ${name} is as long as the object. How many ${name} long is it?`, n, `Count the ${name}: ${b(n)}.`);
  }),
  R(/^Build cube trains to measure (?:length|height)$/, () => () => {
    const n = ri(3, 12);
    return num(`A pencil is as long as ${b(n)} cubes in a row. How many cubes do you need to build a cube train as long as the pencil?`, n, `You need ${b(n)} cubes.`);
  }),
  R(/^Measure using a centimetre ruler$/, () => () => {
    const n = ri(2, 14);
    return num(`${ruler(n)}How long is the bar? (in centimetres)`, n, `The bar starts at 0 and ends at ${b(n)} cm.`);
  }),
  R(/^Which metric unit of (length|mass|volume|capacity) is appropriate\?$/, (mt, ctx) => () => {
    const kind = mt[1] === 'length' ? 'length' : mt[1] === 'mass' ? 'mass' : 'volume';
    const bank = OBJECTS[kind].filter(o => (ctx.grade <= 2 ? ['cm', 'm', 'g', 'kg', 'mL', 'L'].includes(o[1]) : true));
    const [what, unit, why] = pick(bank), all = UNITS[kind].map(u => u[0]);
    return mc(`Which unit would you use to measure ${b(what)}?`, unit, all.filter(u => u !== unit), `${why[0].toUpperCase() + why.slice(1)}. Use ${b(unit)}.`, all.length);
  }),
  R(/^Metric units of length: word problems$/, () => () => {
    const a = ri(5, 40), c = ri(2, 30), n = pick(NAMES), op = Math.random() < 0.5;
    return num(op ? `${n}'s ribbon is ${a} cm long. Another ribbon is ${c} cm long. How long are they together? (cm)` : `${n} has a ${a + c} cm rope and cuts off ${c} cm. How long is the rope now? (cm)`, op ? a + c : a, `${op ? `${a} + ${c}` : `${a + c} − ${c}`} = ${b(op ? a + c : a)} cm.`);
  }),
  R(/^Read a thermometer$/, () => () => {
    const t = ri(-10, 35); return num(`${thermometer(t)}What temperature does the thermometer show? (°C)`, t, `The liquid reaches ${b(fmt(t))}°C.`);
  }),
  R(/^(?:Reasonable temperature|Choose the more reasonable temperature)$/, () => () => {
    const q = pick([['a hot summer day', 30, [-5, 5]], ['a snowy winter day', -10, [25, 15]], ['a cup of hot cocoa', 60, [5, 20]], ['an ice cube', 0, [30, 60]], ['a spring day', 15, [-10, 45]], ['a bowl of ice cream', -5, [40, 60]]]);
    return mc(`Which temperature is most reasonable for ${b(q[0])}?`, `${fmt(q[1])}°C`, q[2].map(x => `${fmt(x)}°C`), `${fmt(q[1])}°C fits ${q[0]}.`, 3);
  }),
  R(/^Estimate lengths with centimetres and metres$/, () => () => {
    const q = pick([['a pencil', '15 cm', ['15 m', '150 cm', '1 cm']], ['a classroom', '8 m', ['8 cm', '80 m', '800 m']], ['a book', '25 cm', ['25 m', '2 cm', '250 cm']], ['a bus', '12 m', ['12 cm', '120 m', '1 m']], ['your hand', '15 cm', ['15 m', '150 cm', '1 cm']]]);
    return mc(`Which is the best estimate for the length of ${b(q[0])}?`, q[1], q[2], `${q[0]} is about ${b(q[1])}.`);
  }),
  R(/^Choose the appropriate measuring tool$/, () => () => {
    const q = pick([['how long a desk is', 'a ruler'], ['how much a bag of flour weighs', 'a scale'], ['the temperature outside', 'a thermometer'], ['how much water is in a jug', 'a measuring cup'], ['how long a hallway is', 'a metre stick']]);
    return mc(`Which tool would you use to find ${b(q[0])}?`, q[1], ['a ruler', 'a scale', 'a thermometer', 'a measuring cup', 'a metre stick'].filter(x => x !== q[1]), `Use ${b(q[1])}.`);
  }),
  R(/^(?:Compare|Convert) metric units of (length|mass|volume|capacity)$|^Convert metric units of (length|mass|volume|capacity)$|^Compare units of volume$/, (mt, ctx) => {
    const kind = kindFromTitle(ctx.title), convert = /Convert/.test(ctx.title);
    if (convert) return converter(kind, ctx.grade);
    return () => {
      const [big_, small, f] = pick(CONVERT_PAIRS[kind]), n = ri(2, 9), other = n * f + pick([-1, 1, 0]) * ri(1, 9) * (f >= 100 ? 10 : 1);
      const sym = n * f === other ? '=' : n * f > other ? '>' : '<';
      return mc(`Compare. ${m(`${n} ${big_} ___ ${fmt(other)} ${small}`)}`, sym, ['<', '>', '='], `${n} ${big_} = ${fmt(n * f)} ${small}, which is ${sym === '=' ? 'equal to' : sym === '>' ? 'greater than' : 'less than'} ${fmt(other)} ${small}.`, 3);
    };
  }),
  R(/^Compare and convert metric units of (length|mass|capacity)$/, (mt, ctx) => {
    const kind = kindFromTitle(ctx.title), conv = converter(kind, 5);
    return () => {
      if (Math.random() < 0.5) return conv();
      const [big_, small, f] = pick(CONVERT_PAIRS[kind]), n = ri(2, 9), other = n * f + pick([-1, 1, 0]) * ri(1, 9) * (f >= 100 ? 10 : 1), sym = n * f === other ? '=' : n * f > other ? '>' : '<';
      return mc(`Compare. ${m(`${n} ${big_} ___ ${fmt(other)} ${small}`)}`, sym, ['<', '>', '='].filter(x => x !== sym), `${n} ${big_} = ${fmt(n * f)} ${small}, which is ${sym === '=' ? 'equal to' : sym === '>' ? 'greater than' : 'less than'} ${fmt(other)} ${small}.`, 3);
    };
  }),
  R(/^Measure liquid volumes - metric units$/, () => () => {
    const n = ri(1, 9) * 100;
    return num(`A beaker is filled to the ${b(n + ' mL')} line. How many mL of liquid are in the beaker?`, n, `The level is at ${b(n)} mL.`);
  }),

  /* ===== clocks & time ===== */
  R(/^Match digital clocks and times$/, (mt, ctx) => () => {
    const [h, mi] = clockTime(minStepFor(ctx.title, ctx.grade)), words = timeWords(h, mi);
    const alts = uniq([timeWords(h, mi === 0 ? 30 : 0), timeWords(nextHour(h), mi), timeWords(h, mi === 30 ? 0 : 30)]).filter(x => x !== words);
    return mc(`${digital(h, mi)}<br>Which time is shown?`, words, alts, `${h}:${pad(mi)} is ${b(words)}.`);
  }),
  R(/^Match analogue clocks and times with words$/, (mt, ctx) => () => {
    const [h, mi] = clockTime(minStepFor(ctx.title, ctx.grade)), words = timeWords(h, mi);
    const alts = uniq([timeWords(h, mi === 0 ? 30 : 0), timeWords(nextHour(h), mi), timeWords(h % 12 + 2, mi)]).filter(x => x !== words);
    return mc(`${clock(h, mi)}What time does the clock show?`, words, alts, `The clock shows ${b(words)}.`);
  }),
  R(/^Match analogue clocks and times$|^Read clocks and write times$|^Match analogue and digital clocks$|^Match clocks and times$/, (mt, ctx) => () => {
    const [h, mi] = clockTime(minStepFor(ctx.title, ctx.grade)), ans = fm12(h, mi);
    const alts = timeDistractors(h, mi, fm12).filter(x => x !== ans);
    return mc(`${clock(h, mi)}What time does the clock show?`, ans, alts, `The hour hand is near ${h} and the minute hand shows ${mi} minutes: ${b(ans)}.`);
  }),
  R(/^Identify times written in words$/, () => () => {
    const [h, mi] = clockTime('quarter'), words = timeWords(h, mi), ans = fm12(h, mi);
    return mc(`Which time is the same as ${b(words)}?`, ans, timeDistractors(h, mi, fm12).filter(x => x !== ans), `${words} is ${b(ans)}.`);
  }),
  R(/^Time words: o'clock, half, quarter$/, () => () => {
    const [h, mi] = clockTime('quarter'), words = timeWords(h, mi);
    return mc(`${clock(h, mi)}Which time words describe the clock?`, words, uniq([timeWords(h, mi === 0 ? 15 : 0), timeWords(h, mi === 30 ? 45 : 30), timeWords(nextHour(h), mi)]).filter(x => x !== words), `The clock shows ${b(words)}.`);
  }),
  R(/^A\.M\. or P\.M\.$/, () => () => {
    const ev = pick([['eating breakfast', 7, 'a.m.'], ['waking up', 6, 'a.m.'], ['eating dinner', 6, 'p.m.'], ['going to bed', 9, 'p.m.'], ['eating lunch', 12, 'p.m.'], ['starting school', 9, 'a.m.'], ['watching the sunset', 8, 'p.m.'], ['recess in the morning', 10, 'a.m.']]);
    const mi = pick([0, 15, 30, 45]);
    return mc(`${cap(ev[0])} at ${b(`${ev[1]}:${pad(mi)}`)}. Is it a.m. or p.m.?`, ev[2], [ev[2] === 'a.m.' ? 'p.m.' : 'a.m.'], `${cap(ev[0])} is usually in the ${ev[2] === 'a.m.' ? 'morning' : 'afternoon or evening'}: ${b(ev[2])}.`, 2);
  }),
  R(/^Times of everyday events$/, () => () => {
    const ev = pick([['eat breakfast', '7:30 a.m.', ['7:30 p.m.', '3:00 a.m.']], ['go to bed', '9:00 p.m.', ['9:00 a.m.', '2:00 p.m.']], ['eat lunch', '12:00 p.m.', ['12:00 a.m.', '5:00 p.m.']], ['start school', '8:45 a.m.', ['8:45 p.m.', '1:00 a.m.']], ['eat dinner', '6:00 p.m.', ['6:00 a.m.', '3:00 a.m.']]]);
    return mc(`At what time would you most likely ${b(ev[0])}?`, ev[1], ev[2], `${ev[1]} is the most reasonable time.`, 3);
  }),
  R(/^Compare clocks$/, () => () => {
    const [h1, m1] = clockTime('five'), [h2, m2] = clockTime('five');
    const a = h1 * 60 + m1, c = h2 * 60 + m2; if (a === c) return null;
    const later = a > c ? 'Clock A' : 'Clock B'; // treats both within a 12-hour window
    return mc(`<div style="display:flex;gap:20px"><div><b>Clock A</b>${clock(h1, m1, 110)}</div><div><b>Clock B</b>${clock(h2, m2, 110)}</div></div>Which clock shows the later time? (Both are in the same morning.)`, later, ['Clock A', 'Clock B'].filter(x => x !== later), `Clock A is ${h1}:${pad(m1)} and Clock B is ${h2}:${pad(m2)}. ${later} is later.`, 2);
  }),
  R(/^Time and clocks: word problems$/, () => () => {
    const n = pick(NAMES), h = ri(1, 11), add = ri(1, 4);
    return mc(`${n}'s lesson starts at ${b(h + ":00")}. It lasts ${add} hour${add > 1 ? 's' : ''}. What time does it end?`, `${h + add > 12 ? h + add - 12 : h + add}:00`, [`${h + add + 1 > 12 ? h + add - 11 : h + add + 1}:00`, `${h - add > 0 ? h - add : h - add + 12}:00`, `${h + add}:30`.replace(/^(\d+):30$/, (_, x) => `${+x > 12 ? +x - 12 : x}:30`)], `${h}:00 + ${add} hour${add > 1 ? 's' : ''} = ${b((h + add > 12 ? h + add - 12 : h + add) + ':00')}.`);
  }),
  R(/^Elapsed time(?: I| II| word problems)?$|^Elapsed time$/, (mt, ctx) => () => {
    const sH = ri(6, 14), sM = pick(ctx.grade <= 3 ? [0, 30] : [0, 15, 30, 45]), dm = pick(ctx.grade <= 2 ? [60, 120, 180] : ctx.grade <= 3 ? [30, 60, 90, 120, 150, 180] : range(15, 240, 15)), end = sH * 60 + sM + dm, eH = Math.floor(end / 60), eM = end % 60;
    if (eH > 23) return null;
    const ans = dur(dm), alts = uniq([dur(dm + 30), dur(Math.max(15, dm - 30)), dur(dm + 60)]).filter(x => x !== ans);
    return mc(`How much time passes from ${b(t12(sH, sM))} to ${b(t12(eH, eM))}?`, ans, alts, `From ${t12(sH, sM)} to ${t12(eH, eM)} is ${b(ans)}.`);
  }),
  R(/^Find (?:the )?(?:start|end) time(?:s)?(?:: word problems| or the elapsed time: word problems|, the end time or the elapsed time: word problems| and end times: (?:multi-step )?word problems)$|^Find the start time, the end time or the elapsed time: word problems$|^Find start and end times: (?:multi-step )?word problems$|^Find the (?:end|start|elapsed) time: word problems$|^Find the (?:start|end|elapsed) time(?: or the (?:end|elapsed) time)*: word problems$/, (mt, ctx) => () => {
    const sH = ri(6, 13), sM = pick([0, 15, 30, 45]), dm = pick(range(15, 180, 15)), end = sH * 60 + sM + dm, eH = Math.floor(end / 60), eM = end % 60;
    const kind = /end time/.test(ctx.title) && !/start time, the end/.test(ctx.title) ? 'end' : /start time/.test(ctx.title) && !/start time, the end/.test(ctx.title) ? 'start' : /elapsed/.test(ctx.title) && !/start time, the end/.test(ctx.title) ? 'elapsed' : pick(['end', 'start', 'elapsed']);
    const ev = pick(['A movie', 'A soccer practice', 'A swim lesson', 'A school play', 'Art class']);
    if (kind === 'end') return mc(`${ev} starts at ${b(t12(sH, sM))} and lasts ${b(dur(dm))}. What time does it end?`, t12(eH, eM), uniq([t12(eH, eM + 15 < 60 ? eM + 15 : 0), t12(eH + 1, eM), t12(eH - 1, eM)]).filter(x => x !== t12(eH, eM)), `${t12(sH, sM)} + ${dur(dm)} = ${b(t12(eH, eM))}.`);
    if (kind === 'start') return mc(`${ev} ends at ${b(t12(eH, eM))} and lasts ${b(dur(dm))}. What time did it start?`, t12(sH, sM), uniq([t12(sH, sM + 15 < 60 ? sM + 15 : 0), t12(sH + 1, sM), t12(sH - 1, sM)]).filter(x => x !== t12(sH, sM)), `${t12(eH, eM)} − ${dur(dm)} = ${b(t12(sH, sM))}.`);
    return mc(`${ev} starts at ${b(t12(sH, sM))} and ends at ${b(t12(eH, eM))}. How long does it last?`, dur(dm), uniq([dur(dm + 15), dur(Math.max(15, dm - 15)), dur(dm + 30)]).filter(x => x !== dur(dm)), `From ${t12(sH, sM)} to ${t12(eH, eM)} is ${b(dur(dm))}.`);
  }),
  R(/^Convert time units$|^Relate time units$|^Convert between seconds, minutes and hours$/, (mt, ctx) => () => {
    const pairs = [['minute', 'seconds', 60], ['hour', 'minutes', 60], ['day', 'hours', 24], ['week', 'days', 7], ['year', 'months', 12], ['year', 'weeks', 52]];
    const [u, sm, f] = ctx.grade <= 3 && /Relate|seconds/.test(ctx.title) ? pick(pairs.slice(0, 4)) : pick(pairs.slice(0, 5)), n = ri(2, 9);
    return Math.random() < 0.65
      ? num(`Convert. ${m(`${n} ${u}s = ___ ${sm}`)}`, n * f, `1 ${u} = ${f} ${sm}, so ${n} ${u}s = ${b(n * f)} ${sm}.`)
      : num(`Convert. ${m(`${n * f} ${sm} = ___ ${u}s`)}`, n, `${f} ${sm} = 1 ${u}, so ${n * f} ${sm} = ${b(n)} ${u}s.`);
  }),
  R(/^Convert between hours and fractions of hours$|^Fractions of time units$/, () => () => {
    const f = pick([[1, 2, 30], [1, 4, 15], [3, 4, 45], [1, 3, 20], [2, 3, 40], [1, 6, 10]]);
    return num(`How many minutes are in ${b(`${f[0]}/${f[1]}`)} of an hour?`, f[2], `${f[0]}/${f[1]} × 60 = ${b(f[2])} minutes.`);
  }),
  R(/^Add and subtract mixed time units$/, () => () => {
    const h1 = ri(1, 5), m1 = ri(10, 50), h2 = ri(1, 4), m2 = ri(10, 50), add = Math.random() < 0.6;
    if (add) { const tot = h1 * 60 + m1 + h2 * 60 + m2; return mc(`${m(`${h1} h ${m1} min + ${h2} h ${m2} min`)}`, dur(tot), uniq([dur(tot + 10), dur(tot - 10), dur(tot + 60)]).filter(x => x !== dur(tot)), `Add hours and minutes, then regroup 60 minutes as 1 hour: ${b(dur(tot))}.`); }
    const A = h1 * 60 + m1 + h2 * 60 + m2, B = h2 * 60 + m2, diff = A - B;
    return mc(`${m(`${Math.floor(A / 60)} h ${A % 60} min − ${h2} h ${m2} min`)}`, dur(diff), uniq([dur(diff + 10), dur(diff - 10), dur(diff + 60)]).filter(x => x !== dur(diff)), `${dur(A)} − ${dur(B)} = ${b(dur(diff))}.`);
  }),
  R(/^Convert between 12-hour and 24-hour time$/, () => () => {
    const H = ri(0, 23), mi = pick([0, 15, 30, 45, 5, 20, 40]);
    return Math.random() < 0.5
      ? mc(`Write ${b(t12(H, mi))} as 24-hour time.`, t24(H, mi), uniq([t24((H + 12) % 24, mi), t24(H, (mi + 30) % 60), t24((H + 1) % 24, mi)]).filter(x => x !== t24(H, mi)), `${t12(H, mi)} is ${b(t24(H, mi))} in 24-hour time.`)
      : mc(`Write ${b(t24(H, mi))} in 12-hour time.`, t12(H, mi), uniq([t12((H + 12) % 24, mi), t12(H, (mi + 30) % 60), t12((H + 1) % 24, mi)]).filter(x => x !== t12(H, mi)), `${t24(H, mi)} is ${b(t12(H, mi))}.`);
  }),
  R(/^Time zones(?::| -) (12|24)-hour time$/, mt => () => {
    const city = pick([['Toronto', 'Vancouver', 3], ['Halifax', 'Toronto', 1], ['Winnipeg', 'Vancouver', 2], ['Toronto', 'Calgary', 2], ['Halifax', 'Vancouver', 4]]);
    const H = ri(8, 17), mi = pick([0, 15, 30, 45]), behind = city[2], other = H - behind, f = mt[1] === '12' ? t12 : t24;
    return mc(`It is ${b(f(H, mi))} in ${city[0]}. ${city[1]} is ${behind} hour${behind > 1 ? 's' : ''} behind ${city[0]}. What time is it in ${city[1]}?`, f(other, mi), uniq([f(other + 2 * behind, mi), f(other - 1, mi), f(H + behind, mi)]).filter(x => x !== f(other, mi)), `${behind} hour${behind > 1 ? 's' : ''} earlier than ${f(H, mi)} is ${b(f(other, mi))}.`);
  }),
  R(/^(?:Reading schedules|Schedules|Schedules and timelines|Transportation schedules)(?: -|:)? ?(12|24)-hour time$/, mt => () => {
    const f = mt[1] === '12' ? t12 : t24, start = ri(7, 10), evs = ['Math', 'Reading', 'Recess', 'Science', 'Lunch', 'Art'], rows = []; let cur = start * 60;
    for (const e of sample(evs, 4)) { const d = pick([30, 45, 60]); rows.push([e, f(Math.floor(cur / 60), cur % 60), f(Math.floor((cur + d) / 60), (cur + d) % 60), d]); cur += d; }
    const k = ri(0, 3);
    return mc(`${table(['Activity', 'Start', 'End'], rows.map(r => r.slice(0, 3)))}How long does ${b(rows[k][0])} last?`, dur(rows[k][3]), uniq([dur(rows[k][3] + 15), dur(Math.max(15, rows[k][3] - 15)), dur(rows[k][3] + 30)]).filter(x => x !== dur(rows[k][3])), `From ${rows[k][1]} to ${rows[k][2]} is ${b(dur(rows[k][3]))}.`);
  }),
  R(/^Timelines$/, () => () => {
    const y = ri(1950, 2005), ev = [['Born', y], ['Started school', y + 5], ['Moved', y + ri(7, 12)], ['Graduated', y + 18]], [a, c] = sample(ev, 2).sort((x, z) => x[1] - z[1]);
    return num(`${table(['Event', 'Year'], ev)}How many years passed between "${a[0]}" and "${c[0]}"?`, c[1] - a[1], `${c[1]} − ${a[1]} = ${b(c[1] - a[1])} years.`);
  }),
  R(/^Time patterns$/, () => () => {
    const step = pick([5, 10, 15, 30]), sH = ri(1, 8), sM = pick([0, 15, 30]), seq = range(0, 3).map(i => { const t = sH * 60 + sM + i * step; return `${Math.floor(t / 60)}:${pad(t % 60)}`; });
    const t = sH * 60 + sM + 4 * step;
    return mc(`What comes next? ${m(seq.join(', ') + ', ___')}`, `${Math.floor(t / 60)}:${pad(t % 60)}`, [`${Math.floor((t + step) / 60)}:${pad((t + step) % 60)}`, `${Math.floor((t - step) / 60)}:${pad((t - step) % 60)}`, `${Math.floor((t + 5) / 60)}:${pad((t + 5) % 60)}`], `The time goes up by ${step} minutes each time.`);
  }),

  /* ===== calendar ===== */
  R(/^Days of the week$/, () => () => {
    const i = ri(0, 6), after = Math.random() < 0.5;
    return mc(`Which day comes ${after ? 'after' : 'before'} ${b(DAYS[i])}?`, DAYS[(i + (after ? 1 : 6)) % 7], sample(DAYS, 4, [DAYS[(i + (after ? 1 : 6)) % 7], DAYS[i]]), `${after ? 'After' : 'Before'} ${DAYS[i]} is ${b(DAYS[(i + (after ? 1 : 6)) % 7])}.`);
  }),
  R(/^Months of the year$/, () => () => {
    const i = ri(0, 11), after = Math.random() < 0.5, ans = MONTHS[(i + (after ? 1 : 11)) % 12];
    return mc(`Which month comes ${after ? 'after' : 'before'} ${b(MONTHS[i])}?`, ans, sample(MONTHS, 4, [ans, MONTHS[i]]), `${after ? 'After' : 'Before'} ${MONTHS[i]} is ${b(ans)}.`);
  }),
  R(/^Seasons(?: of the year)?$/, () => () => {
    const i = ri(0, 11);
    return mc(`In Canada, which season is ${b(MONTHS[i])} in?`, SEASON_OF(i), ['spring', 'summer', 'autumn', 'winter'].filter(x => x !== SEASON_OF(i)), `${MONTHS[i]} is in ${b(SEASON_OF(i))}.`);
  }),
  R(/^Read a calendar$/, () => () => {
    const mon = ri(0, 11), start = ri(0, 6), days = MDAYS[mon];
    if (Math.random() < 0.5) { const d = ri(1, days), dow = DAYS[(start + d - 1) % 7]; return mc(`${calendarHtml(mon, start)}What day of the week is ${b(MONTHS[mon] + ' ' + d)}?`, dow, sample(DAYS, 4, [dow]), `Count along the calendar: ${b(dow)}.`); }
    const dowI = ri(0, 6); let cnt = 0; for (let d = 1; d <= days; d++) if ((start + d - 1) % 7 === dowI) cnt++;
    return num(`${calendarHtml(mon, start)}How many ${b(DAYS[dowI] + 's')} are in ${MONTHS[mon]}?`, cnt, `Count the ${DAYS[dowI]}s on the calendar: ${b(cnt)}.`);
  }),
  R(/^Number of days in each month$/, () => () => {
    const i = ri(0, 11), d = MDAYS[i];
    return mc(`How many days are in ${b(MONTHS[i])}? (Not a leap year.)`, String(d), ['28', '30', '31'].filter(x => x !== String(d)), `${MONTHS[i]} has ${b(d)} days.`, 3);
  }),

  /* ===== money ===== */
  R(/^Coin values$/, () => () => {
    const c = pick([5, 10, 25, 100, 200]);
    return mc(`${coinBadge(c)}<br>How much is this coin worth?`, centsText(c), [5, 10, 25, 100, 200].filter(x => x !== c).map(centsText), `A ${coinName(c)} is worth ${b(centsText(c))}.`, 4);
  }),
  R(/^Count nickels and dimes$/, () => () => {
    const n = ri(1, 4), d = ri(1, 5), list = shuffle([...Array(n).fill(5), ...Array(d).fill(10)]);
    return num(`${coinsHtml(list)}How many cents is this? (¢)`, n * 5 + d * 10, `${n} nickels = ${n * 5}¢ and ${d} dimes = ${d * 10}¢. Total ${b(n * 5 + d * 10)}¢.`);
  }),
  R(/^Count groups of coins$|^Count money - up to \$(1|2|100)$|^Count coins and bills(?:: | )up to \$(?:5 bill|20 bill|100)$/, (mt, ctx) => () => {
    const cap_ = /\$100/.test(ctx.title) ? 10000 : /\$20/.test(ctx.title) ? 2000 : /\$5/.test(ctx.title) ? 500 : /\$2/.test(ctx.title) ? 200 : 100;
    const kinds = cap_ >= 2000 ? [5, 10, 25, 100, 200, 500, 1000, 2000] : cap_ >= 500 ? [5, 10, 25, 100, 200, 500] : cap_ >= 200 ? [5, 10, 25, 100] : [5, 10, 25];
    const total = pick(range(1, cap_ / 5)) * 5, list = coinSet(total, kinds.filter(k => k <= Math.max(total, 5)));
    if (!list || list.length > 12) return null;
    return num(`${coinsHtml(list)}How much money is this? ${cap_ >= 200 ? '(in dollars, like 1.35)' : '(in cents)'}`, cap_ >= 200 ? ans$(total) : total, `Add the values: ${b(centsText(total))}.`);
  }),
  R(/^Equivalent groups of coins$|^Equivalent amounts of money(?: - up to \$1)?$/, () => () => {
    const total = pick([25, 30, 35, 40, 50, 60, 75]), list = coinSet(total, [5, 10, 25]);
    if (!list) return null;
    const bad = [total + 5, total - 5, total + 10].map(t => coinSet(t, [5, 10, 25])).filter(x => x);
    const mk = l => l.map(coinName).join(' + ');
    const ans = mk(list);
    const opts = bad.map(mk).filter(x => x !== ans);
    return mc(`Which group of coins is worth ${b(centsText(total))}?`, ans, opts, `${ans} = ${b(centsText(total))}.`);
  }),
  R(/^Exchanging coins(?: - up to \$[12])?$/, () => () => {
    const [big_, n] = pick([[25, 5], [10, 2], [100, 4], [25, 2], [100, 10]]), small = big_ === 25 && n === 5 ? 5 : big_ === 10 ? 5 : big_ === 100 && n === 4 ? 25 : big_ === 25 ? 5 : 10;
    const cnt = big_ / small;
    return num(`How many ${coinName(small)}s equal one ${coinName(big_)}?`, cnt, `${centsText(big_)} ÷ ${centsText(small)} = ${b(cnt)}.`);
  }),
  R(/^Comparing groups of coins$|^Which picture shows more(?: - up to \$1|\?)?(?:: up to \$(?:5 bill|20 bill))?$|^Which picture shows more\?: up to \$(?:5|20) bill$/, () => () => {
    const a = pick(range(2, 20)) * 5, c = pick(range(2, 20)) * 5; if (a === c) return null;
    const la = coinSet(a, [5, 10, 25]), lc = coinSet(c, [5, 10, 25]); if (!la || !lc || la.length > 10 || lc.length > 10) return null;
    return mc(`<b>Group A</b>${coinsHtml(la)}<b>Group B</b>${coinsHtml(lc)}Which group has more money?`, a > c ? 'Group A' : 'Group B', [a > c ? 'Group B' : 'Group A'], `Group A is ${centsText(a)} and Group B is ${centsText(c)}.`, 2);
  }),
  R(/^Least number of coins$/, () => () => {
    const total = pick([35, 45, 60, 65, 80, 90]), list = coinSet(total, [5, 10, 25]), ans = list.length;
    return num(`What is the fewest number of coins (nickels, dimes, quarters) that make ${b(centsText(total))}?`, ans, `Use the biggest coins first: ${list.map(coinName).join(', ')}. That is ${b(ans)} coins.`);
  }),
  R(/^Purchases(?: - |: )do you have enough money(?: - |: )up to \$(1|2|10|50)$|^Do you have enough money(?:: | - )up to \$(10|50)$/, (mt, ctx) => () => {
    const max = +(mt[1] || mt[2]), price = max <= 2 ? ri(10, max * 100 - 5) / (max === 1 ? 1 : 1) : ri(2, max - 1), have = max <= 2 ? price + pick([-15, -5, 5, 10, 20]) : price + pick([-3, -1, 1, 2, 5]);
    if (have <= 0) return null;
    const unitf = max <= 2 ? centsText : v => '$' + v;
    return yesNo(`A toy costs ${b(unitf(price))}. You have ${b(unitf(have))}. Do you have enough money?`, have >= price, `${unitf(have)} is ${have >= price ? 'at least' : 'less than'} ${unitf(price)}.`, ['Yes', 'No']);
  }),
  R(/^How much more to make a dollar\?$/, () => () => {
    const c = pick(range(1, 19)) * 5; return num(`You have ${b(centsText(c))}. How many more cents do you need to make $1.00?`, 100 - c, `100 − ${c} = ${b(100 - c)}¢.`);
  }),
  R(/^Correct amount of change$|^Making change(?:: up to \$(?:10|50))?$|^Making change(?: - up to \$(?:10|50))?$/, (mt, ctx) => () => {
    const dollars = /\$50/.test(ctx.title) ? 50 : /\$10/.test(ctx.title) ? 10 : ctx.grade >= 4 ? 20 : 1;
    const paid = dollars * 100, price = dollars === 1 ? pick(range(1, 18)) * 5 : ri(50, paid - 25), price5 = Math.round(price / 5) * 5, change = paid - price5;
    return mc(`A toy costs ${b(centsText(price5))}. You pay ${b('$' + dollars)}. How much change do you get?`, centsText(change), uniq([change + 10, change - 10, change + 5, change + 25].map(centsText)).filter(x => x !== centsText(change)), `${'$' + dollars} − ${centsText(price5)} = ${b(centsText(change))}.`);
  }),
  R(/^Add and subtract money(?: - | amounts)?(?: up to \$1)?$|^Add and subtract money - up to \$1$|^Add and subtract money amounts$|^Add money amounts: word problems$|^Add and subtract money(?: amounts)?(?:: | - )word problems(?: - up to \$1)?$|^Add and subtract money - word problems - up to \$1$/, (mt, ctx) => () => {
    const wp = /word problems/.test(ctx.title), small = /\$1/.test(ctx.title) || ctx.grade <= 2, a = small ? ri(5, 60) * 1 : ri(150, 2999), c = small ? ri(5, 99 - 0) : ri(100, 1999), add = /Add money/.test(ctx.title) || Math.random() < 0.5;
    const A = Math.max(a, c), B = Math.min(a, c), tot = add ? a + c : A - B;
    if (small && add && tot > 100) return null;
    if (!add && A === B) return null;   // "has 40¢ and spends 40¢" is not a real question
    const fm = small ? centsText : x => '$' + (x / 100).toFixed(2), nm = pick(NAMES), ans = small ? tot : tot / 100;
    if (wp) {
      // realistic items: small amounts are things that cost cents; bigger ones use believable shop prices
      const [i1, i2] = small ? sample([['sticker'], ['eraser'], ['pencil'], ['bookmark'], ['gumball'], ['balloon']], 2)
        : (() => { const x = shopItem(2); let y = shopItem(); while (y[0] === x[0]) y = shopItem(); return [x, y]; })();
      const p1 = small ? a : Math.round(priceOf(i1) * 100), p2 = small ? c : Math.round(priceOf(i2) * 100);
      if (add) { const t2 = p1 + p2; if (small && t2 > 100) return null; return num(`${nm} buys ${aAn(i1[0])} ${i1[0]} for ${fm(p1)} and ${aAn(i2[0])} ${i2[0]} for ${fm(p2)}. How much does ${nm} spend in all? ${small ? '(in cents)' : '(in dollars)'}`, small ? t2 : t2 / 100, `${fm(p1)} + ${fm(p2)} = ${b(fm(t2))}.`); }
      return num(`${nm} has ${fm(A)} and spends ${fm(B)}. How much is left? ${small ? '(in cents)' : '(in dollars)'}`, ans, `${fm(A)} − ${fm(B)} = ${b(fm(tot))}.`);
    }
    return num(`${add ? m(`${fm(a)} + ${fm(c)}`) : m(`${fm(A)} − ${fm(B)}`)} = ? ${small ? '(in cents)' : '(in dollars)'}`, ans, `${add ? `${fm(a)} + ${fm(c)}` : `${fm(A)} − ${fm(B)}`} = ${b(fm(tot))}.`);
  }),
  R(/^Compare money amounts$|^Inequalities with money$/, () => () => {
    const a = ri(100, 9999) / 100, c = Math.random() < 0.15 ? a : Math.max(0.05, fix(a + pick([-1, 1, -0.1, 0.1, 0.5, -0.5, 2]))), sym = a === c ? '=' : a > c ? '>' : '<';
    return mc(`Compare. ${m(`${money(a)} ___ ${money(c)}`)}`, sym, ['<', '>', '='], `${money(a)} ${sym} ${money(c)}.`, 3);
  }),
  R(/^Put money amounts in order$/, () => () => {
    const vals = sample(range(100, 2000).map(v => v / 100), 4), asc = Math.random() < 0.5, sorted = vals.slice().sort((x, y) => (asc ? x - y : y - x)), key = a => a.map(money).join(', ');
    return mc(`Order from ${b(asc ? 'least to greatest' : 'greatest to least')}:<br>${m(key(vals))}`, key(sorted), [shuffle(sorted), shuffle(sorted)].map(key).filter(k => k !== key(sorted)).concat([key(sorted.slice().reverse())]).filter(k => k !== key(sorted)), `${b(key(sorted))}.`);
  }),
  R(/^Price lists$|^Price lists with addition and subtraction$/, () => () => {
    const items = sample([['apple', 0.75], ['sandwich', 4.5], ['juice box', 2.25], ['cookie', 1.25], ['salad', 5.5], ['carton of milk', 1.75], ['muffin', 2.5]], 3), [a, c] = items;
    const total = fix(a[1] + c[1]);
    return num(`${table(['Item', 'Price'], items.map(x => [x[0], money(x[1])]))}How much do ${aAn(a[0])} ${b(a[0])} and ${aAn(c[0])} ${b(c[0])} cost together? (in dollars)`, total, `${money(a[1])} + ${money(c[1])} = ${b(money(total))}.`);
  }),
  R(/^Find the change, price or amount paid$/, () => () => {
    const price = ri(150, 1800) / 100, paid = Math.ceil(price / 5) * 5, change = fix(paid - price), ask = pick(['change', 'price', 'paid']);
    if (ask === 'change') return num(`An item costs ${money(price)}. You pay ${money(paid)}. How much change? (dollars)`, change, `${money(paid)} − ${money(price)} = ${b(money(change))}.`);
    if (ask === 'price') return num(`You pay ${money(paid)} and get ${money(change)} change. What was the price? (dollars)`, price, `${money(paid)} − ${money(change)} = ${b(money(price))}.`);
    return num(`An item costs ${money(price)} and you get ${money(change)} change. How much did you pay? (dollars)`, paid, `${money(price)} + ${money(change)} = ${b(money(paid))}.`);
  }),
  R(/^(?:Multiply and divide money amounts: word problems|Multiply money amounts with decimals(?:: word problems)?|Divide money amounts with decimals(?:: word problems)?)$/, (mt, ctx) => () => {
    const mulOp = /Multiply/.test(ctx.title) && !(/Multiply and divide/.test(ctx.title) && Math.random() < 0.5), nm = pick(NAMES), item = shopItem(0, 10), unitP = priceOf(item), n = ri(2, 9);
    if (mulOp) return num(`${nm} buys ${n} ${item[1]} that cost ${b(money(unitP))} each. How much do they cost altogether? (dollars)`, fix(unitP * n), `${n} × ${money(unitP)} = ${b(money(unitP * n))}.`);
    const tot = fix(unitP * n); return num(`${nm} pays ${b(money(tot))} for ${n} ${item[1]} that all cost the same. How much does one ${item[0]} cost? (dollars)`, unitP, `${money(tot)} ÷ ${n} = ${b(money(unitP))}.`);
  })
];
export { t12, t24, dur, timeWords, coinBadge, centsText, thermometer, ruler, calendarHtml, MONTHS, DAYS };
