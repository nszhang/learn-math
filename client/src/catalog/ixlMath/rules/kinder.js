/* Junior Kindergarten and Kindergarten: counting, ten frames, comparing, positions, sorting, simple shapes and coins. */
import { ri, pick, shuffle, sample, range, uniq, m, b, fmt, num, mc, yesNo, near, svg, C, thing, NAMES, emojiRow, big, tenFrame, words, shapeSvg, SHAPES_2D, SIDES } from '../h.js';
import { R } from '../engine.js';
import { coinBadge, centsText } from './measure.js';
import { solidSvg as solidPic, tint, REAL } from './geometry.js';

const upTo = (t, d = 10) => { const r = t.match(/up to (\d+)/); return r ? +r[1] : d; };
const countN = (lim, lo = 1) => ri(lo, Math.max(lo, lim));
const dots = n => `<div style="font-size:26px;line-height:1.3;letter-spacing:4px">${'⚫'.repeat(n)}</div>`;
const letterPics = (pics, correct) => { const order = shuffle(pics.map((p, i) => [p, i])), L = 'ABCD'[order.findIndex(x => x[1] === correct)]; return { html: `<div style="display:flex;gap:18px;flex-wrap:wrap;align-items:flex-end">${order.map((o, i) => `<div><b>${'ABCD'[i]}</b>${o[0]}</div>`).join('')}</div>`, L, letters: 'ABCD'.slice(0, pics.length).split('') }; };
const cnt = n => (n === 1 ? '1' : String(n));
const SHAPE_EMOJI = ['🔴', '🟦', '🔺', '⭐', '🟩', '🟡'];
const SHAPES_PLAIN = ['circle', 'square', 'triangle', 'rectangle', 'hexagon'];
const COLOURS = [['red', '🔴'], ['blue', '🔵'], ['green', '🟢'], ['yellow', '🟡'], ['purple', '🟣'], ['orange', '🟠']];

export const KINDER_RULES = [
  /* ===== numbers & counting ===== */
  R(/^(?:Choose the number that you hear|Identify numbers|Names of numbers|Write the number you hear)(?: - up to \d+)?$/, (mt, ctx) => () => {
    const lim = upTo(ctx.title, 10), n = countN(lim), ws = words(n), [, , em] = thing(), f3 = ri(0, 2);
    if (/Names/.test(ctx.title) && f3 === 1) return mc(`${emojiRow(em, n, 10)}How do you write the number of pictures in words?`, ws, uniq([words(n === lim ? n - 1 : n + 1), words(Math.max(0, n - 1)), words(ri(0, lim))]).filter(x => x !== ws).slice(0, 3), `There are ${n}: ${b(ws)}.`, 4);
    if (/Names/.test(ctx.title) && f3 === 2) return mc(`Which number is ${b(ws)}?`, String(n), uniq([n + 1, Math.max(0, n - 1), ri(0, lim)].map(String)).filter(x => x !== String(n)).slice(0, 3), `${ws} is written ${b(n)}.`, 4);
    if (!/Names|Write/.test(ctx.title) && f3 === 1) return mc(`${emojiRow(em, n, 10)}Choose the number that matches the pictures.`, String(n), uniq([n + 1, Math.max(0, n - 1), ri(0, lim)].map(String)).filter(x => x !== String(n)).slice(0, 3), `There are ${b(n)}.`, 4);
    return /Names/.test(ctx.title) ? mc(`Which is the number name for ${b(n)}?`, ws, uniq([words(n === lim ? n - 1 : n + 1), words(Math.max(0, n - 1)), words(ri(0, lim))]).filter(x => x !== ws).slice(0, 3), `${n} is ${b(ws)}.`, 4) : /Write/.test(ctx.title) ? num(`Write the number: ${b(ws)}`, n, `${ws} is ${b(n)}.`) : mc(`Choose the number: ${b(ws)}`, String(n), uniq([n + 1, Math.max(0, n - 1), ri(0, lim)].map(String)).filter(x => x !== String(n)).slice(0, 3), `${ws} is written ${b(n)}.`, 4);
  }),
  R(/^Learn to count(?: to \d+| - up to \d+)$|^Count (?:objects|pictures|shapes|out stickers|dots)(?: - up to \d+)?$|^Count pictures in arrays and circles - up to \d+$/, (mt, ctx) => () => {
    const lim = upTo(ctx.title, 10) || +(ctx.title.match(/to (\d+)/) || [0, 10])[1], n = countN(lim), [, , e] = thing(), t = ctx.title;
    const pic = /dots/.test(t) ? dots(n) : /shapes/.test(t) ? emojiRow(pick(SHAPE_EMOJI), n, 10) : /arrays/.test(t) ? emojiRow(e, n, 5) : emojiRow(e, n, 10);
    return num(`${pic}How many are there?`, n, `Count each one: ${b(n)}.`);
  }),
  R(/^Count on ten frames - up to \d+$|^Count on ten frames$/, (mt, ctx) => () => {
    const lim = upTo(ctx.title, 10), n = countN(lim); return num(`${tenFrame(n)}How many counters are there?`, n, `Count the counters: ${b(n)}.`);
  }),
  R(/^Show numbers on ten frames - up to \d+$/, (mt, ctx) => () => {
    const lim = Math.min(upTo(ctx.title, 10), 20), n = countN(lim, 2), opts = uniq([n, Math.max(1, n - 1), Math.min(lim, n + 1), Math.max(1, n - 2)]).slice(0, 3), { html, L, letters } = letterPics(opts.map(k => tenFrame(k)), opts.indexOf(n));
    return mc(`Which ten frame shows ${b(n)}?${html}`, L, letters.filter(x => x !== L), `Picture ${b(L)} has ${n} counters.`, 4);
  }),
  R(/^Represent numbers - up to \d+$/, (mt, ctx) => () => {
    const lim = upTo(ctx.title, 10), n = countN(lim, 2), [, , e] = thing(), opts = uniq([n, Math.max(1, n - 1), Math.min(lim, n + 1)]).slice(0, 3), { html, L, letters } = letterPics(opts.map(k => emojiRow(e, k, 10)), opts.indexOf(n));
    return mc(`Which picture shows ${b(n)}?${html}`, L, letters.filter(x => x !== L), `Picture ${b(L)} has ${n}.`, 4);
  }),
  R(/^What number comes next\? - up to \d+$|^Count up and down to find the next number - up to \d+$|^Count forward - up to \d+$|^Count forward and backward - up to \d+$|^Complete a sequence - up to \d+$|^Before, after and between - up to \d+$/, (mt, ctx) => () => {
    const lim = upTo(ctx.title, 10), t = ctx.title, n = countN(lim - 1, 1);
    if (/Before, after/.test(t)) { const k = ri(1, lim - 1), kind = pick(['before', 'after', 'between']); return kind === 'between' ? num(`What number is between ${b(k)} and ${b(k + 2)}?`, k + 1, `${k}, ${b(k + 1)}, ${k + 2}.`) : num(`What number comes ${b(kind)} ${b(kind === 'before' ? k + 1 : k)}?`, kind === 'before' ? k : k + 1, `${kind === 'before' ? k : k + 1}.`); }
    if (/Complete a sequence/.test(t)) { const s = ri(1, lim - 3), hole = ri(1, 2), seq = [s, s + 1, s + 2, s + 3]; return num(`${m(seq.map((v, i) => (i === hole ? '___' : v)).join(', '))}`, seq[hole], `The numbers count up by 1: ${b(seq[hole])}.`); }
    if (/forward and backward/.test(t)) { const back = Math.random() < 0.5, k = back ? ri(2, lim) : ri(1, lim - 1); return num(`${b(back ? 'Count backward' : 'Count forward')} from ${b(k)}. What number comes next?`, back ? k - 1 : k + 1, `${back ? k - 1 : k + 1}.`); }
    const up = /forward|comes next/.test(t) ? Math.random() < 0.75 : Math.random() < 0.7, len = ri(2, 4), s = up ? ri(1, lim - len) : ri(len + 1, lim); const seq = Array.from({ length: len }, (_, i) => s + (up ? i : -i)), nx = s + (up ? len : -len);
    const stem = pick(['What number comes next?', 'Keep counting. What number comes next?', `${pick(NAMES)} is counting ${up ? 'up' : 'down'}. What number comes next?`, 'Which number is missing at the end?']);
    return num(`${stem}<br>${m(seq.join(', ') + ', ___')}`, nx, `The numbers go ${up ? 'up' : 'down'} by 1: ${b(nx)}.`);
  }),
  R(/^Take away cubes - numbers up to \d+$/, (mt, ctx) => () => {
    const lim = upTo(ctx.title, 10), a = ri(2, lim), c = ri(1, a - 1), who = pick(NAMES), [, , e] = thing(), form = ri(0, 2);
    if (form === 1) return num(`${emojiRow(e, a, 10)}${who} has ${b(a)} ${e}. ${who} gives away ${b(c)}. How many ${e} does ${who} have left?`, a - c, `${a} − ${c} = ${b(a - c)}.`);
    if (form === 2) return num(`${who} builds a tower with ${b(a)} cubes. Then ${who} takes ${b(c)} cubes off the top.<br>How many cubes are still in the tower?`, a - c, `${a} − ${c} = ${b(a - c)}.`);
    return num(`<span style="color:#4f46e5;font-size:26px;letter-spacing:2px">${'■'.repeat(a - c)}</span><span style="color:#cbd5e1;font-size:26px;letter-spacing:2px">${'■'.repeat(c)}</span><br>There are ${b(a)} cubes. The ${b(c)} grey cubes are taken away. How many cubes are left?`, a - c, `${a} − ${c} = ${b(a - c)}.`);
  }),
  R(/^Count to fill a ten frame$/, () => () => {
    const n = ri(1, 9), form = ri(0, 3), who = pick(NAMES), [, , e] = thing();
    if (form === 1) return num(`${tenFrame(n)}How many empty spaces are there on the ten frame?`, 10 - n, `${n} + ${10 - n} = 10: ${b(10 - n)} empty spaces.`);
    if (form === 2) return num(`${who} has ${b(n)} ${e}. A box holds ${b(10)}. How many more ${e} fill the box?`, 10 - n, `${n} + ${10 - n} = 10: ${b(10 - n)} more.`);
    if (form === 3) return num(`${tenFrame(n)}${m(`${n} + ___ = 10`)}<br>What number goes in the blank?`, 10 - n, `${n} + ${10 - n} = 10: ${b(10 - n)}.`);
    return num(`${tenFrame(n)}How many more counters fill the ten frame?`, 10 - n, `${n} + ${10 - n} = 10: ${b(10 - n)} more.`);
  }),
  R(/^One (?:more|less) (?:with pictures|on frames) - up to \d+$|^One more and one less (?:with pictures|on frames) - up to \d+$/, (mt, ctx) => () => {
    const lim = upTo(ctx.title, 10), t = ctx.title, both = /and one less/.test(t), more = both ? Math.random() < 0.5 : /more/.test(t), n = more ? ri(1, lim - 1) : ri(2, lim), [, , e] = thing(), pic = /frames/.test(t) ? tenFrame(n) : emojiRow(e, n, 10);
    return num(`${pic}What number is ${b(more ? 'one more' : 'one less')} than ${b(n)}?`, more ? n + 1 : n - 1, `${n} ${more ? '+' : '−'} 1 = ${b(more ? n + 1 : n - 1)}.`);
  }),
  R(/^Tally marks - up to \d+$/, (mt, ctx) => () => {
    const lim = upTo(ctx.title, 10), tal = k => `<span style="font-family:monospace;font-size:24px;letter-spacing:3px">${'𝍸 '.repeat(Math.floor(k / 5))}${'|'.repeat(k % 5)}</span>`, form = ri(0, 3), who = pick(NAMES), [, , e] = thing();
    const n = countN(lim), g = Math.floor(n / 5), r = n % 5;
    if (form === 1) { const opts = uniq([n, Math.max(1, n - 1), Math.min(lim, n + 1), Math.max(1, n - 2)]).slice(0, 3), { html, L, letters } = letterPics(opts.map(tal), opts.indexOf(n)); return mc(`Which tally marks show the number ${b(n)}?${html}`, L, letters.filter(x => x !== L), `Picture ${b(L)} shows ${n}.`, 4); }
    if (form === 2 && lim >= 6) { const a = ri(1, lim - 2), c = ri(1, lim - a); return num(`${tal(a)}<br>${who} makes ${b(a)} tally marks for the ${e} ${who} sees. Then ${who} sees ${b(c)} more ${e} and makes a tally mark for each. How many tally marks are there now?`, a + c, `${a} + ${c} = ${b(a + c)}.`); }
    if (form === 3) return num(`${tal(n)}<br>${who} counted ${e} and made these tally marks. How many ${e} did ${who} count?`, n, `${g ? `${g} group${g === 1 ? '' : 's'} of 5` : ''}${g && r ? ' and ' : ''}${r ? `${r} more` : ''}: ${b(n)}.`);
    return num(`${tal(n)}<br>How many tally marks are there?`, n, `${g} group${g === 1 ? '' : 's'} of 5 and ${r} more: ${b(n)}.`);
  }),
  R(/^(?:Count|Understand) tens and ones - up to \d+$/, (mt, ctx) => () => {
    const lim = upTo(ctx.title, 20), n = ri(11, lim), t = Math.floor(n / 10), o = n % 10, [c1, c2] = sample(['🟦', '🟥', '🟪', '🟧', '⬛'], 1).concat(sample(['🟩', '🟨', '🔵', '🟢', '🟡'], 1)), form = ri(0, 3);
    if (form === 1) return num(`${t} ten${t > 1 ? 's' : ''} and ${o} one${o === 1 ? '' : 's'}. What number is this?`, n, `${t} ten${t > 1 ? 's' : ''} and ${o} one${o === 1 ? '' : 's'} = ${b(n)}.`);
    const tx = k => `${k} ${k === 1 ? 'ten' : 'tens'}`, ox = k => `${k} ${k === 1 ? 'one' : 'ones'}`;
    if (form === 2) return num(`${m(`${n} = ${t} ${t === 1 ? 'ten' : 'tens'} + ___ ones`)}<br>What number goes in the blank?`, o, `${n} is ${t} ten and ${b(o)} ones.`);
    if (form === 3) return mc(`Which is the same as ${b(n)}?`, `${tx(t)} and ${ox(o)}`, uniq([`${tx(t)} and ${ox((o + 1) % 10)}`, `${tx(o)} and ${ox(t)}`, `${tx(t)} and ${ox(Math.max(0, o - 2))}`, `${tx(t + 1)} and ${ox(o)}`]).filter(x => x !== `${tx(t)} and ${ox(o)}`), `${n} is ${b(`${tx(t)} and ${ox(o)}`)}.`, 4);
    return num(`${(c1.repeat(10) + ' ').repeat(t)}${c2.repeat(o)}<br>Each group of 10 ${c1} is 1 ten. How many are there in all?`, n, `${t} ten${t > 1 ? 's' : ''} and ${o} one${o === 1 ? '' : 's'} = ${b(n)}.`);
  }),
  R(/^Count pictures - up to 100$/, () => () => { const n = ri(21, 100), [, , e] = thing(); return num(`${emojiRow(e, n, 10)}How many are there?`, n, `Count by tens, then ones: ${b(n)}.`); }),
  R(/^Learn to skip-count by (twos|fives|tens|twos, fives and tens)$|^Skip-count by twos on ten frames$|^Count groups of ten$/, (mt, ctx) => () => {
    const t = ctx.title; if (/groups of ten/.test(t)) {
      const g = ri(2, 10), who = pick(NAMES), [sg, pl, em] = thing(), f = ri(0, 3);
      if (f === 1) return num(`${who} puts 10 ${pl} in each bag. ${who} has ${b(g)} bags. How many ${pl} are there in all?`, g * 10, `${g} groups of ten = ${b(g * 10)}.`);
      if (f === 2) return num(`${m(Array.from({ length: Math.min(g, 3) }, (_, i) => (i + 1) * 10).join(', ') + ', ___')}<br>Count by tens. What number comes next?`, Math.min(g, 3) * 10 + 10, `Add 10 each time: ${b(Math.min(g, 3) * 10 + 10)}.`);
      if (f === 3) return num(`There are ${b(g * 10)} ${pl}. They are put in groups of ten. How many groups of ten are there?`, g, `${g * 10} is ${b(g)} tens.`);
      return num(`${Array.from({ length: g }, () => '🔟').join(' ')}<br>Each 🔟 is a group of ten. How many in all?`, g * 10, `${g} tens = ${b(g * 10)}.`); }
    if (/ten frames/.test(t)) { const f = ri(2, 5); return num(`${tenFrame(f * 2)}Count by twos. How many counters are there?`, f * 2, `2, 4, 6 … ${b(f * 2)}.`); }
    const s = /twos, fives/.test(t) ? pick([2, 5, 10]) : { twos: 2, fives: 5, tens: 10 }[mt[1]], st = ri(0, 3) * s, seq = [0, 1, 2].map(i => st + i * s); return num(`Count by ${b(s)}s: ${m(seq.join(', ') + ', ___')}`, st + 3 * s, `Add ${s} each time: ${b(st + 3 * s)}.`);
  }),
  R(/^Count on the hundred chart$/, () => () => { const v = ri(11, 99); return num(`On a hundred chart, what number comes right after ${b(v)}?`, v + 1, `${v} + 1 = ${b(v + 1)}.`); }),

  /* ===== comparing ===== */
  R(/^Are there enough\?$/, () => () => {
    const a = ri(2, 8), c = ri(2, 8), [, , e1] = thing(); let [, , e2] = thing(); if (e1 === e2) e2 = '🥤';
    return mc(`${emojiRow(e1, a, 10)}${emojiRow(e2, c, 10)}Is there one ${e2} for each ${e1}?`, a === c ? 'Just enough' : a > c ? 'Not enough' : 'More than enough', ['Just enough', 'Not enough', 'More than enough'].filter(x => x !== (a === c ? 'Just enough' : a > c ? 'Not enough' : 'More than enough')), `${a} vs ${c}.`, 3);
  }),
  R(/^More$|^Fewer$|^Fewer and more - compare by (?:counting|matching)$|^Fewer and more - compare in a mixed group$|^Compare in a mixed group$|^Fewer, more and same$/, (mt, ctx) => () => {
    const t = ctx.title, a = ri(1, 9), c = ri(1, 9); const same = /same/.test(t) && Math.random() < 0.3, A = a, B = same ? a : c; if (!same && A === B) return null; const [, , e1] = thing(); let [, , e2] = thing(); if (e1 === e2) e2 = '🔶';
    const askMore = /More$/.test(t) || (!/Fewer$/.test(t) && Math.random() < 0.5);
    if (/same/.test(t)) return mc(`${emojiRow(e1, A, 10)}${emojiRow(e2, B, 10)}Which group has more?`, A === B ? 'Both groups have the same' : A > B ? 'The first group' : 'The second group', ['The first group', 'The second group', 'Both groups have the same'].filter(x => x !== (A === B ? 'Both groups have the same' : A > B ? 'The first group' : 'The second group')), `${A} and ${B}.`, 3);
    const ans = askMore ? (A > B ? 'The first group' : 'The second group') : (A < B ? 'The first group' : 'The second group');
    return mc(`${emojiRow(e1, A, 10)}${emojiRow(e2, B, 10)}Which group has ${b(askMore ? 'more' : 'fewer')}?`, ans, ['The first group', 'The second group'].filter(x => x !== ans), `${A} and ${B}: ${ans.toLowerCase()} has ${askMore ? 'more' : 'fewer'}.`, 2);
  }),
  R(/^Compare two numbers - up to 10$|^Compare three numbers - up to 10$/, (mt, ctx) => () => {
    const three = /three/.test(ctx.title), xs = sample(range(1, 10), three ? 3 : 2), big_ = Math.random() < 0.5, ans = big_ ? Math.max(...xs) : Math.min(...xs);
    return mc(`Which number is the ${b(big_ ? 'greatest' : 'least')}? ${m(xs.join(', '))}`, String(ans), xs.filter(x => x !== ans).map(String), `${ans} is the ${big_ ? 'greatest' : 'least'}.`, 3);
  }),

  /* ===== positions ===== */
  R(/^Inside and outside$/, () => () => {
    const inside = Math.random() < 0.5, [, , e] = thing(); return mc(`${big(`<span style="border:3px solid #4f46e5;border-radius:10px;padding:6px 14px;display:inline-block">${inside ? e : ''}</span> ${inside ? '' : e}`)}Is the ${e} inside or outside the box?`, inside ? 'Inside' : 'Outside', [inside ? 'Outside' : 'Inside'], inside ? 'It is in the box.' : 'It is next to the box, not in it.', 2);
  }),
  R(/^Left and right$/, () => () => {
    const [a, c] = sample(['🐶', '🐱', '🐰', '🐸'], 2), side = pick(['left', 'right']); return mc(`${big(`${a}  ${c}`)}Which animal is on the ${b(side)}?`, side === 'left' ? a : c, [side === 'left' ? c : a], `The ${side} one is ${side === 'left' ? a : c}.`, 2);
  }),
  R(/^Top and bottom$/, () => () => {
    const [a, c] = sample(['🐶', '🐱', '🐰', '🐸'], 2), side = pick(['top', 'bottom']); return mc(`${big(`${a}<br>${c}`)}Which animal is at the ${b(side)}?`, side === 'top' ? a : c, [side === 'top' ? c : a], `The ${side} one is ${side === 'top' ? a : c}.`, 2);
  }),

  /* ===== sorting & classifying ===== */
  R(/^Same$|^Different$|^Same and different$/, (mt, ctx) => () => {
    const a = pick(SHAPE_EMOJI), same = Math.random() < 0.5, c = same ? a : pick(SHAPE_EMOJI.filter(x => x !== a)), askSame = /Same$/.test(ctx.title) || (/and/.test(ctx.title) && Math.random() < 0.5);
    return mc(`${big(`${a} ${c}`)}Are these two pictures the ${b('same')} or ${b('different')}?`, same ? 'The same' : 'Different', [same ? 'Different' : 'The same'], same ? 'They match.' : 'They do not match.', 2);
  }),
  R(/^Classify shapes by colour$|^Classify and sort by colour$|^Classify and sort by shape$|^Classify and sort$|^Sort, count and compare$/, (mt, ctx) => () => {
    const byShape = /shape$/.test(ctx.title) && !/colour/.test(ctx.title), items = byShape ? ['🔺', '🔺', '🟦', '🟦', '🔴'] : ['🔴', '🔴', '🔵', '🔵', '🟢'], target = pick(items), cnt_ = items.filter(x => x === target).length;
    return num(`${big(shuffle(items).join(' '))}How many are ${byShape ? 'the same shape as' : 'the same colour as'} ${target}? (Count ${target} too.)`, cnt_, `There are ${b(cnt_)}.`);
  }),
  R(/^Count shapes in a Venn diagram$|^Sort shapes into a Venn diagram$/, () => () => {
    const a = ri(1, 5), c = ri(1, 5); return num(`Circle A has ${a} ${pick(SHAPE_EMOJI)} and circle B has ${c} ${pick(SHAPE_EMOJI)}. They do not overlap. How many shapes are there in all?`, a + c, `${a} + ${c} = ${b(a + c)}.`);
  }),
  R(/^What comes next\?$/, () => () => {
    const unit = sample(COLOURS, 2), seq = [0, 1, 0, 1, 0].map(i => unit[i]); return mc(`${big(seq.map(x => x[1]).join(' '))}What comes next?`, unit[1][0], [unit[0][0], 'green', 'yellow'].filter((x, i, arr) => x !== unit[1][0] && arr.indexOf(x) === i), 'The pattern repeats: ' + unit.map(x => x[0]).join(', ') + '.', 3);
  }),
  R(/^Wide and narrow$/, () => () => {
    const wide = Math.random() < 0.5; return mc(`Which is ${b(wide ? 'wider' : 'narrower')}: a road or a path?`, wide ? 'road' : 'path', [wide ? 'path' : 'road'], `A road is wider than a path.`, 2);
  }),

  /* ===== money ===== */
  R(/^Coin values - (?:nickel and dime|quarter, loonie and toonie|all coins)$/, (mt, ctx) => () => {
    const pool = /nickel and dime/.test(ctx.title) ? [5, 10] : /quarter/.test(ctx.title) ? [25, 100, 200] : [5, 10, 25, 100, 200], c = pick(pool), all = [5, 10, 25, 100, 200];
    return mc(`${coinBadge(c)}<br>How much is this coin worth?`, centsText(c), all.filter(x => x !== c).map(centsText).slice(0, 3), `This coin is worth ${b(centsText(c))}.`, 4);
  }),
  R(/^Count money - (?:nickels only|dimes only|nickels and dimes)$/, (mt, ctx) => () => {
    const t = ctx.title, nk = /dimes only/.test(t) ? 0 : ri(1, 4), dm = /nickels only/.test(t) ? 0 : ri(1, 4); if (!nk && !dm) return null;
    const list = shuffle([...Array(nk).fill(5), ...Array(dm).fill(10)]);
    return num(`<div>${list.map(coinBadge).join('')}</div>How many cents is this? (¢)`, nk * 5 + dm * 10, `${nk} nickels = ${nk * 5}¢, ${dm} dimes = ${dm * 10}¢. Total ${b(nk * 5 + dm * 10)}¢.`);
  }),
  R(/^Exchanging groups of coins$|^Compare two groups of coins$/, (mt, ctx) => () => {
    if (/Exchanging/.test(ctx.title)) { const k = pick([[2, 5, 10], [5, 5, 25], [2, 25, 50]]); return num(`How many ${k[1] === 5 ? 'nickels' : 'quarters'} equal ${b(centsText(k[1] === 5 ? k[0] * k[1] : k[0] * k[1]))}?`, k[0], `${centsText(k[0] * k[1])} ÷ ${centsText(k[1])} = ${b(k[0])}.`); }
    const a = ri(1, 4) * 5, c = ri(1, 4) * 5; if (a === c) return null; return mc(`Group A has coins worth ${b(a + '¢')}. Group B has coins worth ${b(c + '¢')}. Which group has more money?`, a > c ? 'Group A' : 'Group B', [a > c ? 'Group B' : 'Group A'], `${a}¢ and ${c}¢.`, 2);
  }),

  /* ===== shapes ===== */
  R(/^Name the shape$|^Circles$|^Squares$|^Triangles$|^Rectangles$|^Hexagons$|^Squares and rectangles$|^Circles, squares and triangles$/, (mt, ctx) => () => {
    const t = ctx.title, pool = /Squares and rectangles/.test(t) ? ['square', 'rectangle'] : /Circles, squares and triangles/.test(t) ? ['circle', 'square', 'triangle'] : /Name/.test(t) ? ['circle', 'square', 'triangle', 'rectangle'] : [t.replace(/s$/, '').toLowerCase()], s0 = pick(pool), want = /Name|and/.test(t) ? null : s0;
    if (want) { const others = sample(['circle', 'square', 'triangle', 'rectangle', 'hexagon'].filter(x => x !== s0), 3), pics = shuffle([s0, ...others.slice(0, 2)]), L = 'ABC'[pics.indexOf(s0)]; return mc(`Which picture shows a ${b(s0)}?<div style="display:flex;gap:16px;flex-wrap:wrap">${pics.map((p, i) => `<span><b>${'ABC'[i]}</b>${shapeSvg(p, 70)}</span>`).join('')}</div>`, L, 'ABC'.split('').filter(x => x !== L), `Picture ${b(L)} is a ${s0}.`, 3); }
    return mc(`${shapeSvg(s0, 90)}What is the name of this shape?`, s0, ['circle', 'square', 'triangle', 'rectangle', 'hexagon'].filter(x => x !== s0).slice(0, 3), `It is a ${b(s0)}.`, 4);
  }),
  R(/^Curved parts$|^Count sides and corners$|^Compare sides and corners$/, (mt, ctx) => () => {
    const POOL = ['triangle', 'square', 'rectangle', 'hexagon', 'circle', 'pentagon', 'octagon', 'rhombus', 'trapezoid', 'parallelogram', 'oval'], s0 = pick(POOL), t = ctx.title, sh = (k, z = 90) => tint(shapeSvg(k, z));
    const curved = k => k === 'circle' || k === 'oval';
    if (/Curved/.test(t)) {
      const f = ri(0, 3);
      if (f === 2 || f === 3) { const want = f === 2, ok = POOL.filter(k => curved(k) === want), s1 = pick(ok), pool = shuffle(sample(POOL.filter(k => curved(k) !== want), 3).concat(s1)), L = 'ABCD'[pool.indexOf(s1)]; return mc(`Which shape ${want ? 'has a curved part' : 'has only straight sides'}?<div style="display:flex;gap:12px;flex-wrap:wrap">${pool.map((p, i) => `<span><b>${'ABCD'[i]}</b>${sh(p, 70)}</span>`).join('')}</div>`, L, 'ABCD'.split('').filter(x => x !== L), `Picture ${b(L)} is a ${s1}.`, 4); }
      if (f === 1) return yesNo(`Does a ${b(s0)} have a curved part?`, curved(s0), curved(s0) ? `A ${s0} is all curved.` : 'It has only straight sides.', ['Yes', 'No']);
      return yesNo(`${sh(s0)}Does this shape have a curved part?`, curved(s0), curved(s0) ? `A ${s0} is all curved.` : 'It has only straight sides.', ['Yes', 'No']);
    }
    if (/Compare/.test(t)) { const [a, c] = sample(['triangle', 'square', 'hexagon', 'rectangle', 'pentagon', 'octagon', 'rhombus', 'trapezoid'], 2); if (SIDES[a] === SIDES[c]) return null; const w = pick(['sides', 'corners']), mo = Math.random() < 0.5, ans = (SIDES[a] > SIDES[c]) === mo ? a : c; return mc(`Which shape has ${mo ? 'more' : 'fewer'} ${w}: a ${b(a)} or a ${b(c)}?`, ans, [ans === a ? c : a], `A ${a} has ${SIDES[a]} ${w} and a ${c} has ${SIDES[c]}.`, 2); }
    if (curved(s0)) return null; return num(`${sh(s0)}How many ${Math.random() < 0.5 ? 'sides' : 'corners'} does this shape have?`, SIDES[s0], `A ${s0} has ${b(SIDES[s0])}.`);
  }),
  R(/^Introduction to symmetry$|^Identify pictures with symmetry$/, () => () => {
    const sym = Math.random() < 0.5; return yesNo(`Look at a ${sym ? 'butterfly 🦋' : 'letter F'}. Can you fold it so both halves match?`, sym, sym ? 'A butterfly is symmetrical.' : 'The halves of an F do not match.', ['Yes', 'No']);
  }),
  R(/^Flat and solid shapes$/, () => () => {
    const FL = ['circle', 'square', 'triangle', 'rectangle'], SO = ['sphere', 'cube', 'cone', 'cylinder'], flat = Math.random() < 0.5, nm = flat ? pick(FL) : pick(SO), f = ri(0, 3);
    if (f === 1) return mc(`${flat ? tint(shapeSvg(nm, 90)) : solidPic(nm)}Is this a flat shape or a solid shape?`, flat ? 'Flat shape' : 'Solid shape', [flat ? 'Solid shape' : 'Flat shape'], `This ${nm} is ${flat ? 'flat' : 'a solid'}.`, 2);
    if (f === 2) { const want = pick(['flat', 'solid']), ans = pick(want === 'flat' ? FL : SO); return mc(`Which of these is a ${b(want + ' shape')}?`, ans, sample(want === 'flat' ? SO : FL, 3), `A ${ans} is ${want === 'flat' ? 'flat' : 'a solid'}.`, 4); }
    if (f === 3) { const want = pick(['flat', 'solid']), nm2 = pick(want === 'flat' ? FL : SO), pool = shuffle(sample(want === 'flat' ? SO : FL, 2).concat(nm2)), L = 'ABC'[pool.indexOf(nm2)]; return mc(`Which picture shows a ${b(want + ' shape')}?<div style="display:flex;gap:12px;flex-wrap:wrap">${pool.map((p, i) => `<span><b>${'ABC'[i]}</b>${SO.includes(p) ? solidPic(p) : tint(shapeSvg(p, 70))}</span>`).join('')}</div>`, L, 'ABC'.split('').filter(x => x !== L), `Picture ${b(L)} is a ${nm2}, which is ${want === 'flat' ? 'flat' : 'a solid'}.`, 3); }
    return mc(`Is a ${b(nm)} a flat shape or a solid shape?`, flat ? 'Flat shape' : 'Solid shape', [flat ? 'Solid shape' : 'Flat shape'], `A ${nm} is ${flat ? 'flat' : 'a solid'}.`, 2);
  }),
  R(/^Name the solid shape$|^Select solid shapes$|^Spheres$|^Cubes$|^Cones$|^Cylinders$/, (mt, ctx) => () => {
    const t = ctx.title, names = ['sphere', 'cube', 'cone', 'cylinder'], s0 = /Name|Select/.test(t) ? pick(names) : { Spheres: 'sphere', Cubes: 'cube', Cones: 'cone', Cylinders: 'cylinder' }[t];
    if (/Select/.test(t) || !/Name/.test(t)) { const pics = shuffle([s0, ...sample(names.filter(x => x !== s0), 2)]), L = 'ABC'[pics.indexOf(s0)]; return mc(`Which picture shows a ${b(s0)}?<div style="display:flex;gap:12px;flex-wrap:wrap">${pics.map((p, i) => `<span><b>${'ABC'[i]}</b>${solidPic(p)}</span>`).join('')}</div>`, L, 'ABC'.split('').filter(x => x !== L), `Picture ${b(L)} is a ${s0}.`, 3); }
    return mc(`${solidPic(s0)}What is the name of this solid shape?`, s0, names.filter(x => x !== s0), `It is a ${b(s0)}.`, 4);
  }),
  R(/^Describe three-dimensional shapes$/, () => () => {
    const q = [['It can roll and has no corners or edges', 'sphere'], ['It has 6 square faces', 'cube'], ['It has a round base and one pointy tip', 'cone'], ['It has two circle faces and rolls', 'cylinder']], [d, a] = pick(q); return mc(`Which shape is described? ${b(d)}`, a, ['sphere', 'cube', 'cone', 'cylinder'].filter(x => x !== a), `It is a ${b(a)}.`, 4);
  }),
  R(/^Build and take apart three-dimensional shapes$/, () => () => {
    const k = ri(2, 9), who = pick(NAMES), f = ri(0, 3);
    if (f === 1) return num(`You build a tower with ${b(k)} cubes. How many cubes are in the tower if you take ${b('one cube')} off the top?`, k - 1, `${k} − 1 = ${b(k - 1)}.`);
    if (f === 2) { const j = ri(1, 10 - k > 0 ? Math.min(3, 10 - k) : 1); return num(`${who} builds a tower with ${b(k)} cubes and then adds ${b(j)} more cubes. How many cubes are in the tower now?`, k + j, `${k} + ${j} = ${b(k + j)}.`); }
    if (f === 3) { const j = ri(1, k - 1); return num(`${who}'s tower has ${b(k)} cubes. ${who} takes the tower apart and puts ${b(j)} cubes in a bin. How many cubes are still in the tower?`, k - j, `${k} − ${j} = ${b(k - j)}.`); }
    return num(`You build a tower with ${b(k)} cubes. How many cubes do you need to make the tower ${b('one cube taller')}?`, k + 1, `${k} + 1 = ${b(k + 1)}.`);
  }),
  R(/^Three-dimensional shapes - (?:above and below|beside and next to)$/, (mt, ctx) => () => {
    const [a, c] = sample(['🎲', '⚽', '🥫', '🍦'], 2), above = /above/.test(ctx.title); return mc(`${big(above ? `${a}<br>${c}` : `${a} ${c}`)}Which object is ${b(above ? 'above' : 'on the left (beside)')} the other?`, a, [c], above ? `${a} is higher up.` : `${a} is on the left.`, 2);
  }),
  R(/^Make pictographs$/, () => () => {
    const a = ri(1, 5), c = ri(1, 5), [, , e1] = thing(); let [, , e2] = thing(); if (e1 === e2) e2 = '🐟'; return num(`Each picture stands for 1. ${e1}: ${a}, ${e2}: ${c}. How many pictures go in the row for ${e1}?`, a, `${b(a)}.`);
  }),
  R(/^More or less likely$/, () => () => {
    const a = ri(1, 6), c = ri(1, 6); if (a === c) return null; return mc(`A bag has ${a} 🔴 and ${c} 🔵 balls. Which colour are you more likely to pick?`, a > c ? 'red 🔴' : 'blue 🔵', [a > c ? 'blue 🔵' : 'red 🔴'], `There are more ${a > c ? 'red' : 'blue'} balls.`, 2);
  }),
  R(/^Three-dimensional shapes in the real world I{1,2}$|^Two-dimensional shapes in the real world$|^Two-dimensional shapes in real-world objects$/, (mt, ctx) => () => {
    if (/Two/.test(ctx.title)) {
      const T = [['a clock face', 'circle'], ['a window', 'rectangle'], ['a slice of pizza', 'triangle'], ['a loonie coin', 'circle'], ['a door', 'rectangle'], ['a slice of cheese', 'square'], ['a dinner plate', 'circle'], ['a book cover', 'rectangle'], ['a tile on the floor', 'square'], ['a wheel', 'circle'], ['a nacho chip', 'triangle'], ['a picture frame', 'rectangle'], ['a pennant flag', 'triangle'], ['a stop sign', 'octagon'], ['a cracker', 'square'], ['the top of a drum', 'circle']];
      const q = pick(T); return mc(pick([`What shape is ${b(q[0])}?`, `Which shape does ${b(q[0])} look like?`]), q[1], ['circle', 'rectangle', 'triangle', 'square', 'octagon'].filter(x => x !== q[1]), `${q[0][0].toUpperCase() + q[0].slice(1)} is a ${b(q[1])}.`, 4);
    }
    const keys = Object.keys(REAL), s = pick(keys), obj = pick(REAL[s]);
    return mc(pick([`What shape is ${b(obj)} like?`, `${obj[0].toUpperCase() + obj.slice(1)} is like which solid shape?`]), s, sample(keys, 3, [s]), `${obj[0].toUpperCase() + obj.slice(1)} is like a ${b(s)}.`, 4);
  })
];
