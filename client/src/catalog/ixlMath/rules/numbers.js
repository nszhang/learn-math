/* Counting, number names, place value, comparing, ordering, rounding (Grades 1–5). */
import {
  ri, pick, shuffle, sample, range, uniq, m, b, fmt, words, ordinal, ordSuffix, num, mc, yesNo, near, limitOf, digits, PLACES,
  emojiRow, tenFrame, baseTen, numberLine, svg, C, thing, NAMES, fix, big, sum
} from '../h.js';
import { R } from '../engine.js';

const roman = n => {
  const t = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let s = ''; for (const [v, r] of t) while (n >= v) { s += r; n -= v; } return s;
};
const unroman = s => { const v = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }; let n = 0; for (let i = 0; i < s.length; i++) n += v[s[i]] < (v[s[i + 1]] || 0) ? -v[s[i]] : v[s[i]]; return n; };

/** random number appropriate for a "up to N" limit */
const upto = lim => ri(Math.max(1, Math.floor(lim / 10)), lim);

/** hundred chart with a few blanks */
function hundredChart(blank, hi = 100) {
  let t = '<table style="border-collapse:collapse;margin:6px 0;font-size:12px">';
  for (let r = 0; r < hi / 10; r++) {
    t += '<tr>';
    for (let c = 1; c <= 10; c++) {
      const v = r * 10 + c;
      t += `<td style="border:1px solid #cbd5e1;width:26px;height:22px;text-align:center;${blank.includes(v) ? 'background:#fde68a;font-weight:700' : ''}">${blank.includes(v) ? '?' : v}</td>`;
    }
    t += '</tr>';
  }
  return t + '</table>';
}

const countPic = (n, e) => emojiRow(e, n, 10);

export const NUMBER_RULES = [
  /* ---------- counting (G1) ---------- */
  R(/^Counting review - up to (\d+)$/, mt => () => {
    const n = ri(2, +mt[1]), [, , e] = thing();
    return num(`${countPic(n, e)}How many are there?`, n, `Count each one. There are ${b(n)}.`);
  }),
  R(/^Count to fill a ten frame$/, () => () => {
    const n = ri(1, 9);
    return num(`${tenFrame(n)}How many more counters fill the ten frame?`, 10 - n, `${n} + ${10 - n} = 10, so ${b(10 - n)} more.`);
  }),
  R(/^Count on ten frames - up to 40$/, () => () => {
    const n = ri(11, 40);
    return num(`${tenFrame(n)}How many counters are there?`, n, `Count the full frames by tens, then count on: ${b(n)}.`);
  }),
  R(/^Write the number you hear - up to 100$/, () => () => {
    const n = ri(11, 100);
    return num(`Write the number: ${b(words(n))}`, n, `${words(n)} is written ${b(n)}.`);
  }),
  R(/^Count objects to 100$/, () => () => {
    const n = ri(21, 100), [, , e] = thing();
    return num(`${countPic(n, e)}How many are there?`, n, `Count by tens (each row is 10), then count on: ${b(n)}.`);
  }),
  R(/^Estimate to the nearest ten$/, () => () => {
    const n = ri(11, 99), r = Math.round(n / 10) * 10;
    return num(`About how many tens? Round ${b(n)} to the nearest ten.`, r, `${n} is closer to ${b(r)} than to the other ten.`);
  }, { grades: [1, 2] }),
  R(/^Count forward - up to 100$/, () => () => {
    const n = ri(1, 98);
    return num(`Count forward. What comes right after ${b(n)}?`, n + 1, `${n} + 1 = ${b(n + 1)}.`);
  }),
  R(/^Count backward - up to 100$/, () => () => {
    const n = ri(2, 100);
    return num(`Count backward. What comes right before ${b(n)}?`, n - 1, `${n} − 1 = ${b(n - 1)}.`);
  }),
  R(/^Count forward and backward - up to 1000$/, () => () => {
    const n = ri(12, 988), f = Math.random() < 0.5;
    return num(`What number comes right ${f ? 'after' : 'before'} ${b(n)}?`, f ? n + 1 : n - 1, `${n} ${f ? '+' : '−'} 1 = ${b(f ? n + 1 : n - 1)}.`);
  }),
  R(/^Number lines$/, () => () => {
    const lo = ri(0, 8) * 10, hi = lo + 10, v = ri(lo + 1, hi - 1);
    return num(`${numberLine({ min: lo, max: hi, marks: [{ v, label: '?' }] })}What number is the point at?`, v, `Count the tick marks from ${lo}: the point is at ${b(v)}.`);
  }, { grades: [1] }),
  R(/^Number lines(?: - up to (\d+)|: up to (\d+))$/, mt => () => {
    const base = +(mt[1] || mt[2]) <= 100 ? 0 : ri(0, 9) * 100, v = base + ri(1, 9) * 10;
    return mc(`${numberLine({ min: base, max: base + 100, step: 10, labelEvery: 5, marks: [{ v, label: '?' }] })}What number is the point at?`, v, near(v, 5, 3, { step: 10 }), `Each tick is 10. The point is at ${b(v)}.`);
  }),
  R(/^Place numbers on number lines(?: - |: )up to (\d+)$/, mt => () => {
    const base = +mt[1] <= 100 ? 0 : ri(0, 9) * 100, vals = sample(range(1, 9).map(i => base + i * 10), 4);
    const letters = ['A', 'B', 'C', 'D'], target = ri(0, 3);
    const marks = vals.map((v, i) => ({ v, label: letters[i], color: i === target ? C.red : C.blue }));
    return mc(`${numberLine({ min: base, max: base + 100, step: 10, labelEvery: 5, marks })}Which point shows ${b(fmt(vals[target]))}?`, letters[target], letters.filter((_, i) => i !== target), `Count the ticks (each is 10) to find ${fmt(vals[target])}: point ${b(letters[target])}.`);
  }),
  R(/^(?:Count on the )?[Hh]undred chart$/, () => () => {
    const v = ri(11, 99), blank = [v];
    return num(`${hundredChart(blank)}What number goes in the yellow box?`, v, `The number to the left is ${v - 1} and the one above is ${v - 10}, so the box is ${b(v)}.`);
  }),
  R(/^Ordinal numbers(?: up to (\d+)(?:st|nd|rd|th))?$/, mt => () => {
    const lim = +(mt[1] || 10);
    if (lim <= 10) {
      const n = ri(1, 10), things = Array.from({ length: 10 }, (_, i) => (i + 1 === n ? '🟥' : '⬜'));
      return mc(`${big(things.join(''))}Which position is the red square, counting from the left?`, ordinal(n), sample(range(1, 10).map(ordinal), 5, [ordinal(n)]), `It is number ${n} from the left: ${b(ordinal(n))}.`);
    }
    const n = ri(11, lim);
    return num(`What number is ${b(ordinal(n))}? (Write the number, like 21 for twenty-first)`, n, `${ordinal(n)} = ${b(n + ordSuffix(n))}.`);
  }),
  R(/^Writing numbers in words - convert words to digits$/, () => () => { const n = ri(21, 99); return num(`Write ${b(words(n))} as a number.`, n, `${words(n)} = ${b(n)}.`); }),
  R(/^Writing numbers in words - convert digits to words$/, () => () => { const n = ri(21, 99), w = words(n); return mc(`Write ${b(n)} in words.`, w, [words(n + 10 > 99 ? n - 10 : n + 10), words(+String(n).split('').reverse().join('') || n + 1), words(n + 1)], `${n} is ${b(w)}.`); }),
  R(/^Spell word names for numbers up to (\d[\d ]*)$/, mt => () => {
    const lim = parseInt(mt[1].replace(/\s/g, ''), 10), n = lim <= 20 ? ri(1, 20) : upto(lim), w = words(n);
    const wrong = [w.replace(/ty/, 'tie'), w.replace(/e(?=[a-z]*$)/, 'ee'), w.replace(/o/, 'u'), w.replace(/n/, 'nn'), w.replace(/t/, 'tt'), w.replace(/i/, 'e')].filter(x => x !== w);
    return mc(`Which is the correct spelling of ${b(fmt(n))}?`, w, wrong, `${fmt(n)} is spelled ${b(w)}.`);
  }),
  R(/^Write numbers up to (\d[\d ]*) in words - convert words to digits$/, mt => () => { const lim = parseInt(mt[1].replace(/\s/g, ''), 10), n = upto(lim); return num(`Write ${b(words(n))} as a number.`, n, `${words(n)} = ${b(fmt(n))}.`); }),
  R(/^Write numbers up to (\d[\d ]*) in words - convert digits to words$/, mt => () => { const lim = parseInt(mt[1].replace(/\s/g, ''), 10), n = upto(lim); return mc(`Write ${b(fmt(n))} in words.`, words(n), [words(n + 10), words(n - 1), words(Math.floor(n / 10) * 10 + (n % 10 === 0 ? 5 : 0) + 100)], `${fmt(n)} is ${b(words(n))}.`); }),
  R(/^Write numbers in words: up to (\d[\d ]*)$/, mt => () => { const lim = parseInt(mt[1].replace(/\s/g, ''), 10), n = upto(lim); return mc(`Write ${b(fmt(n))} in words.`, words(n), [words(n + 100), words(n - 10), words(n + 1000)], `${fmt(n)} is ${b(words(n))}.`); }),
  R(/^Word names for numbers(?: up to (\d[\d ]*))?$/, mt => () => { const lim = mt[1] ? parseInt(mt[1].replace(/\s/g, ''), 10) : 1e6, n = upto(lim); return mc(`Which is the word name for ${b(fmt(n))}?`, words(n), [words(n + 100), words(n - 10), words(n + 1000)], `${fmt(n)} is ${b(words(n))}.`); }),
  R(/^Roman numerals(?: I, V, X, L(?:, C, D, M)?)?$/, (mt, ctx) => () => {
    const symbols = /L, C, D, M/.test(ctx.title) || ctx.grade >= 4 ? 399 : /I, V, X, L/.test(ctx.title) ? 89 : 39;
    const n = ri(1, symbols), r = roman(n);
    return Math.random() < 0.5
      ? mc(`Which Roman numeral is ${b(n)}?`, r, [roman(n + 1), roman(Math.max(1, n - 1)), roman(n + 5), roman(n + 10)], `${n} = ${b(r)}.`)
      : num(`What number is the Roman numeral ${b(r)}?`, unroman(r), `${r} = ${b(unroman(r))}.`);
  }),
  R(/^Even or odd(?:: arithmetic rules)?$/, (mt, ctx) => () => {
    if (/arithmetic/.test(ctx.title)) {
      const a = pick(['even', 'odd']), c = pick(['even', 'odd']), op = pick(['+', '−', '×']);
      let res; if (op === '×') res = a === 'odd' && c === 'odd' ? 'odd' : 'even'; else res = a === c ? 'even' : 'odd';
      return mc(`Is the result ${b(`${a} ${op} ${c}`)} even or odd?`, res, [res === 'even' ? 'odd' : 'even'], `Try examples: ${a === 'even' ? '2' : '3'} ${op} ${c === 'even' ? '4' : '5'} = ${op === '+' ? (a === 'even' ? 2 : 3) + (c === 'even' ? 4 : 5) : op === '−' ? (a === 'even' ? 6 : 7) - (c === 'even' ? 4 : 5) : (a === 'even' ? 2 : 3) * (c === 'even' ? 4 : 5)}, which is ${res}.`, 2);
    }
    const n = ri(10, 9999); return mc(`Is ${b(fmt(n))} even or odd?`, n % 2 ? 'odd' : 'even', [n % 2 ? 'even' : 'odd'], `Look at the ones digit (${n % 10}): ${n % 2 ? 'odd' : 'even'}.`, 2);
  }, { grades: [3, 4, 5] }),
  R(/^Guess the number$/, () => () => {
    const n = ri(100, 999), t = Math.floor(n / 10) % 10, h = Math.floor(n / 100), o = n % 10;
    return num(`I am a 3-digit number. My hundreds digit is ${h}, my tens digit is ${t}, and my ones digit is ${o}. What number am I?`, n, `${h} hundreds + ${t} tens + ${o} ones = ${b(n)}.`);
  }),
  R(/^Understanding integers$/, () => () => {
    const n = ri(1, 15), up = Math.random() < 0.5;
    return mc(`A temperature is ${b(`${n} degrees ${up ? 'above' : 'below'} zero`)}. Which integer shows this?`, (up ? '' : '−') + n, [(up ? '−' : '') + n, String(n + 1), '−' + (n + 1)], `${up ? 'Above' : 'Below'} zero is ${up ? 'positive' : 'negative'}: ${b((up ? '' : '−') + n)}.`);
  }),

  /* ---------- skip counting & sequences ---------- */
  R(/^Skip-count by (twos|fives|tens)$/, mt => () => {
    const s = { twos: 2, fives: 5, tens: 10 }[mt[1]], st = ri(0, 4) * s, seq = [0, 1, 2, 3].map(i => st + i * s);
    return num(`Skip-count by ${s}s: ${m(seq.join(', ') + ', ___')}`, st + 4 * s, `Add ${s} each time: ${seq[3]} + ${s} = ${b(st + 4 * s)}.`);
  }),
  R(/^(?:Skip-count|Count) by ((?:twos|fives|tens|hundreds)(?:(?:,| and) (?:twos|fives|tens|hundreds))*)$/, mt => () => {
    const opts = mt[1].split(/, | and /).map(w => ({ twos: 2, fives: 5, tens: 10, hundreds: 100 }[w]));
    const s = pick(opts), st = ri(0, 5) * s, seq = [0, 1, 2, 3].map(i => st + i * s);
    return num(`What comes next? ${m(seq.join(', ') + ', ___')}`, st + 4 * s, `The numbers go up by ${s} each time: ${b(st + 4 * s)}.`);
  }),
  R(/^Skip-count by (?:twos|fives|tens), (?:twos|fives|tens|hundreds)|^Skip-count by fives and tens|^Skip-count by twos, fives and tens$/, () => () => {
    const s = pick([2, 5, 10]), st = ri(0, 4) * s, seq = [0, 1, 2, 3].map(i => st + i * s);
    return num(`What comes next? ${m(seq.join(', ') + ', ___')}`, st + 4 * s, `Count by ${s}s: ${b(st + 4 * s)}.`);
  }),
  R(/^Skip-counting patterns with tables$/, () => () => {
    const s = pick([2, 5, 10]), rows = [1, 2, 3, 4].map(i => [i, i * s]);
    return num(`Each jump is the same size.<br>${m(rows.map(r => `${r[0]} jump${r[0] > 1 ? 's' : ''} → ${r[1]}`).join('<br>'))}<br>What is 5 jumps?`, 5 * s, `Add ${s} each jump: ${b(5 * s)}.`);
  }),
  R(/^Sequences - count up and down by 1, 2, 5 and 10$/, () => () => {
    const s = pick([1, 2, 5, 10]), down = Math.random() < 0.5, st = down ? ri(6, 12) * s : ri(0, 5) * s;
    const seq = [0, 1, 2, 3].map(i => st + (down ? -1 : 1) * i * s);
    return num(`${down ? 'Count down' : 'Count up'}: ${m(seq.join(', ') + ', ___')}`, st + (down ? -4 : 4) * s, `${down ? 'Subtract' : 'Add'} ${s} each time: ${b(st + (down ? -4 : 4) * s)}.`);
  }),
  R(/^Skip-counting (?:sequences|stories|puzzles)(?: with [a-z, ]+)?$|^Count forward by twos, fives and tens - up to 100$|^Count forward and backward by (?:fives and tens|twos, fives and tens)$|^Counting patterns - up to \d+$|^Skip-counting sequences$|^Number sequences$/, (mt, ctx) => () => {
    const big = /1000|hundreds/.test(ctx.title) || ctx.grade >= 4;
    const s = pick(big ? [10, 100, 25, 50] : [2, 5, 10]), down = /backward|puzzle/.test(ctx.title) && Math.random() < 0.5;
    const st = down ? ri(8, 14) * s : ri(0, 6) * s, seq = range(0, 4).map(i => st + (down ? -i : i) * s);
    const hole = ri(1, 3), ans = seq[hole];
    return num(`Fill in the missing number: ${m(seq.map((v, i) => (i === hole ? '___' : fmt(v))).join(', '))}`, ans, `The numbers go ${down ? 'down' : 'up'} by ${s} each time, so the missing number is ${b(fmt(ans))}.`);
  }),

  /* ---------- place value ---------- */
  R(/^Make teen numbers on ten frames: words$|^Take apart teen numbers on ten frames: words$/, () => () => {
    const n = ri(11, 19);
    return mc(`${tenFrame(n)}How many is this? Choose the number name.`, words(n), near(n, 3, 3, { min: 11 }).map(words), `One full ten frame and ${n - 10} more is ${b(words(n))}.`);
  }),
  R(/teen numbers on ten frames: addition sentences/, () => () => {
    const n = ri(11, 19);
    return mc(`${tenFrame(n)}Which addition sentence matches the ten frames?`, `10 + ${n - 10} = ${n}`, [`10 + ${n - 9} = ${n + 1}`, `${n} + ${n - 10} = ${2 * n - 10}`, `1 + ${n - 1} = ${n}`], `A full ten frame is 10, plus ${n - 10} more: ${b(`10 + ${n - 10} = ${n}`)}.`);
  }),
  R(/^Count tens and ones - up to (\d+)$/, mt => () => {
    const lim = +mt[1], n = lim <= 20 ? ri(11, 20) : ri(20, 99), t = Math.floor(n / 10), o = n % 10;
    return num(`${baseTen(0, t, o)}What number do the blocks show?`, n, `${t} tens and ${o} ones = ${b(n)}.`);
  }),
  R(/^Place value models(?: for two-digit numbers| up to (?:20|hundreds|thousands)| - (?:tens and ones|up to (?:hundreds|thousands)))?$|^Place value models$/, (mt, ctx) => () => {
    const hi = /thousands/.test(ctx.title) ? 3 : /hundreds/.test(ctx.title) || ctx.grade >= 3 ? 2 : 1;
    if (hi === 3) {
      const th = ri(1, 4), h = ri(0, 5), t = ri(0, 5), o = ri(0, 5);
      return num(`A <b>thousand cube</b> is shown as 🟦. ${'🟦'.repeat(th)} + ${baseTen(h, t, o)}What number is shown?`, th * 1000 + h * 100 + t * 10 + o, `${th} thousands, ${h} hundreds, ${t} tens, ${o} ones = ${b(fmt(th * 1000 + h * 100 + t * 10 + o))}.`);
    }
    const h = hi === 2 ? ri(1, 5) : 0, t = ri(1, 7), o = ri(0, 8);
    return num(`${baseTen(h, t, o)}What number do the blocks show?`, h * 100 + t * 10 + o, `${h ? h + ' hundreds, ' : ''}${t} tens and ${o} ones = ${b(h * 100 + t * 10 + o)}.`);
  }),
  R(/^Ways to make a number: tens and ones$|^Ways to make a number - tens and ones$|^Regroup tens and ones(?: - ways to make a number)?$/, () => () => {
    const n = ri(25, 99), t = Math.floor(n / 10) - ri(1, Math.floor(n / 10)), blank = ri(0, 1);
    const tens = t, ones = n - t * 10;
    return num(`${n} = ${tens} tens and ___ ones`, ones, `${tens} tens is ${tens * 10}. ${n} − ${tens * 10} = ${b(ones)} ones.`);
  }),
  R(/^Regroup hundreds, tens and ones - ways to make a number$/, () => () => {
    const n = ri(120, 990), h = Math.floor(n / 100) - ri(0, Math.floor(n / 100) - 1), tens = Math.floor((n - h * 100) / 10) - ri(0, 2);
    const t = Math.max(0, tens), o = n - h * 100 - t * 10;
    return num(`${n} = ${h} hundreds, ${t} tens and ___ ones`, o, `${h} hundreds + ${t} tens = ${h * 100 + t * 10}. ${n} − ${h * 100 + t * 10} = ${b(o)}.`);
  }),
  R(/^(?:Place value names|Place value) up to (\w[\w ]*)$|^Place value names$|^Place value up to (\d[\d ]*)$/, (mt, ctx) => () => {
    const lim = /1 000 000/.test(ctx.title) ? 6 : /100 000/.test(ctx.title) ? 5 : /ten thousands/.test(ctx.title) ? 5 : /thousands/.test(ctx.title) ? 4 : /hundreds/.test(ctx.title) ? 3 : ctx.grade >= 5 ? 6 : ctx.grade === 4 ? 6 : 3;
    const d = ri(Math.max(3, lim - 1), lim), n = digits(d), dig = ri(1, d) - 1, s = String(n), idx = d - 1 - dig;
    const place = PLACES[idx], digit = s[dig];
    return mc(`In ${b(fmt(n))}, which place is the digit ${b(digit)} in?`, place, sample(PLACES.slice(0, d), 4, [place]), `Counting from the right, the ${digit} is in the ${b(place)} place.`);
  }),
  R(/^Identify a digit - tens and ones$|^Identify a digit up to the hundreds place$/, () => () => {
    const n = ri(100, 999), place = pick(['ones', 'tens', 'hundreds']), v = String(n)[2 - ['ones', 'tens', 'hundreds'].indexOf(place)];
    return num(`What digit is in the ${b(place)} place of ${b(n)}?`, +v, `The ${place} digit of ${n} is ${b(v)}.`);
  }),
  R(/^Value of a digit(?: - | ?: )?(?:tens and ones|up to (?:hundreds|thousands|ten thousands))?$|^Value of a digit$/, (mt, ctx) => () => {
    const d = /ten thousands/.test(ctx.title) ? 5 : /thousands/.test(ctx.title) ? 4 : /hundreds/.test(ctx.title) ? 3 : /tens and ones/.test(ctx.title) ? 2 : ctx.grade >= 4 ? ri(4, 6) : 3;
    const n = digits(d), s = String(n), i = ri(0, d - 1), dd = s[i];
    if (dd === '0' || s.split(dd).length - 1 > 1) return null;          // zero or ambiguous repeated digit
    const val = +dd * 10 ** (d - 1 - i);
    const others = range(0, d - 1).map(k => +dd * 10 ** k).filter(v => v !== val);
    return mc(`What is the value of the digit ${b(dd)} in ${b(fmt(n))}?`, fmt(val), others.map(fmt), `The ${dd} is in the ${PLACES[d - 1 - i]} place, so its value is ${b(fmt(val))}.`);
  }),
  R(/^Relationship between place values$/, () => () => {
    const i = ri(1, 5), p = PLACES[i], q = PLACES[i - 1];
    return num(`How many ${q} make one ${p.replace(/s$/, '')}?`, 10, `Each place is worth 10 times the place to its right: ${b(10)}.`);
  }),
  R(/^Convert between place values(?:: up to (?:hundreds|ten thousands))?$|^Convert between place values - up to hundreds$/, (mt, ctx) => () => {
    const t = ri(2, 9) * 10, ask = pick(['tens']);
    const h = ri(2, 9);
    if (Math.random() < 0.5) return num(`${h} hundreds = ___ tens`, h * 10, `1 hundred = 10 tens, so ${h} hundreds = ${b(h * 10)} tens.`);
    return num(`${h * 10} tens = ___ hundreds`, h, `10 tens = 1 hundred, so ${h * 10} tens = ${b(h)} hundreds.`);
  }),
  R(/^Convert to\/from a number(?: - | ?: )?(?:tens and ones|up to (?:hundreds|thousands|ten thousands))$/, (mt, ctx) => () => {
    const d = /ten thousands/.test(ctx.title) ? 5 : /thousands/.test(ctx.title) ? 4 : /hundreds/.test(ctx.title) ? 3 : 2;
    const n = digits(d), s = String(n), names = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands'];
    const parts = []; for (let i = 0; i < d; i++) parts.push(`${s[i]} ${names[d - 1 - i]}`);
    return num(`${parts.join(', ')}. What number is this?`, n, `Put the digits in order: ${b(fmt(n))}.`);
  }),
  R(/^Convert between standard and expanded form(?: ?: | - )?(?:up to (?:hundreds|thousands|ten thousands))?$|^Convert from expanded form(?: - | ?: )?(?:tens and ones|up to (?:hundreds|thousands|ten thousands))?$|^Expanded form up to (\d[\d ]*)$/, (mt, ctx) => () => {
    const d = /1 000 000/.test(ctx.title) ? 6 : /100 000/.test(ctx.title) ? 5 : /ten thousands/.test(ctx.title) ? 5 : /thousands/.test(ctx.title) ? 4 : /hundreds/.test(ctx.title) ? 3 : /tens and ones/.test(ctx.title) ? 2 : ri(4, 6);
    const n = digits(d), s = String(n);
    const exp = s.split('').map((c, i) => (c === '0' ? null : fmt(+c * 10 ** (d - 1 - i)))).filter(Boolean).join(' + ');
    const wrong = () => { const t = s.split(''); const i = ri(0, d - 2); [t[i], t[i + 1]] = [t[i + 1], t[i]]; const n2 = t.join(''); return n2 === s ? null : n2; };
    const alts = uniq([wrong(), wrong(), String(n + 10), String(n - 100)].filter(Boolean)).map(x => +x).filter(x => x !== n && x > 0).map(x => x.toString().split('').map((c, i, a) => (c === '0' ? null : fmt(+c * 10 ** (a.length - 1 - i)))).filter(Boolean).join(' + '));
    return Math.random() < 0.5
      ? mc(`Which is the expanded form of ${b(fmt(n))}?`, exp, alts, `Write each digit with its place value: ${b(exp)}.`)
      : mc(`Which number is ${b(exp)}?`, fmt(n), uniq([wrong(), String(n + 10), String(n - 100)].filter(Boolean)).map(x => fmt(+x)), `Add the place values: ${b(fmt(n))}.`);
  }),
  R(/^Place value word problems(?:: up to (?:hundreds|ten thousands))?$/, (mt, ctx) => () => {
    const d = /ten thousands/.test(ctx.title) ? 5 : ctx.grade >= 4 ? 5 : 3, n = digits(d), s = String(n), nm = pick(NAMES);
    const i = ri(0, d - 1), place = PLACES[d - 1 - i];
    return mc(`${nm}'s ticket number is ${b(fmt(n))}. Which digit is in the ${b(place)} place?`, s[i], sample(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], 5, [s[i]]), `Look at the ${place} place of ${fmt(n)}: ${b(s[i])}.`);
  }),
  R(/^Place value review$/, () => () => {
    const n = digits(6), s = String(n), i = ri(0, 5);
    if (s[i] === '0') return null;
    return mc(`In ${b(fmt(n))}, what is the value of the digit ${b(s[i])} in the ${PLACES[5 - i]} place?`, fmt(+s[i] * 10 ** (5 - i)), [fmt(+s[i] * 10 ** Math.max(0, 4 - i)), fmt(+s[i]), fmt(+s[i] * 10 ** Math.min(6, 6 - i))], `${s[i]} × ${fmt(10 ** (5 - i))} = ${b(fmt(+s[i] * 10 ** (5 - i)))}.`);
  }),

  /* ---------- comparing & ordering ---------- */
  R(/^Compare numbers up to 10 with pictures$/, () => () => {
    const a = ri(1, 9), c = ri(1, 9), [, , e1] = thing(), [, , e2] = thing();
    return mc(`${emojiRow(e1, a, 10)}${emojiRow(e2, c, 10)}Which group has more?`, a === c ? 'They are equal' : a > c ? 'The first group' : 'The second group', ['The first group', 'The second group', 'They are equal'], `${a} vs ${c}.`, 3);
  }),
  R(/^Compare numbers up to 10 - word problems$/, () => () => {
    const [x, y] = sample(NAMES, 2), a = ri(1, 9), c = ri(1, 9);
    return mc(`${x} has ${a} stickers. ${y} has ${c} stickers. Who has more?`, a === c ? 'The same' : a > c ? x : y, [x, y, 'The same'], `${a} and ${c}: the bigger number has more.`, 3);
  }),
  R(/^Compare numbers using number lines(?:: | - )up to (\d+)$/, mt => () => {
    const base = +mt[1] <= 100 ? 0 : ri(0, 8) * 100, a = base + ri(1, 9) * 10, c = base + ri(1, 9) * 10;
    return mc(`${numberLine({ min: base, max: base + 100, step: 10, labelEvery: 5, marks: [{ v: a, label: 'A', color: C.red }, { v: c, label: 'B', color: C.blue }] })}Which is true?`, a === c ? 'A = B' : a > c ? 'A > B' : 'A < B', ['A > B', 'A < B', 'A = B'], `Numbers farther right are greater.`, 3);
  }),
  R(/^Compare numbers(?:: | - )?up to (\d[\d ]*)$|^Compare numbers up to (\d[\d ]*)$|^Compare numbers$|^Compare numbers up to \d+$/, (mt, ctx) => () => {
    const lim = limitOf(ctx.title, ctx.grade >= 5 ? 1e6 : ctx.grade === 4 ? 1e6 : 1000);
    const a = ri(Math.max(1, Math.floor(lim / 20)), lim), c = Math.random() < 0.12 ? a : Math.random() < 0.5 ? a + ri(-9, 9) : ri(Math.max(1, Math.floor(lim / 20)), lim);
    const cc = Math.max(1, c);
    const sym = a === cc ? '=' : a > cc ? '>' : '<';
    return mc(`Compare. ${m(`${fmt(a)} ___ ${fmt(cc)}`)}`, sym, ['<', '>', '='], `${fmt(a)} is ${sym === '=' ? 'equal to' : sym === '>' ? 'greater than' : 'less than'} ${fmt(cc)}.`, 3);
  }),
  R(/^Greatest and least word problems(?: - |: )up to (\d[\d ]*)$/, mt => () => {
    const lim = parseInt(mt[1].replace(/\s/g, ''), 10), [x, y, z] = sample(NAMES, 3), v = uniq([ri(10, lim), ri(10, lim), ri(10, lim)]);
    if (v.length < 3) return null;
    const most = Math.random() < 0.5, nms = [x, y, z], t = pick(['points', 'stickers', 'marbles', 'cards']);
    const target = most ? Math.max(...v) : Math.min(...v);
    return mc(`${x} has ${fmt(v[0])} ${t}. ${y} has ${fmt(v[1])}. ${z} has ${fmt(v[2])}. Who has the ${most ? 'most' : 'fewest'}?`, nms[v.indexOf(target)], nms.filter(n => n !== nms[v.indexOf(target)]), `${fmt(target)} is the ${most ? 'greatest' : 'least'}.`, 3);
  }),
  R(/^Put numbers in order(?: - |: )?(?:up to (\d[\d ]*))?$|^Put numbers up to (\d+) in order$|^Order numbers(?:: | )?(?:up to (\d[\d ]*))?$|^Put numbers in order using number lines(?: - |: )up to (\d+)$|^Put numbers up to \d+ in order using number lines$|^Put numbers in order - up to \d+$/, (mt, ctx) => () => {
    const lim = limitOf(ctx.title, ctx.grade >= 4 ? 1e6 : 100), cnt = lim <= 20 ? 3 : 4;
    const arr = uniq(range(0, 6).map(() => ri(Math.max(1, Math.floor(lim / 20)), lim))).slice(0, cnt);
    if (arr.length < cnt) return null;
    const asc = Math.random() < 0.5, sorted = arr.slice().sort((x, y) => (asc ? x - y : y - x));
    const key = a => a.map(fmt).join(', ');
    const wrong = [shuffle(sorted), shuffle(sorted), arr.slice().sort((x, y) => (asc ? y - x : x - y))].map(key).filter(k => k !== key(sorted));
    return mc(`Order these numbers from ${b(asc ? 'least to greatest' : 'greatest to least')}:<br>${m(arr.map(fmt).join(', '))}`, key(sorted), wrong, `${asc ? 'Smallest' : 'Largest'} first: ${b(key(sorted))}.`);
  }),
  R(/^Ordering puzzles$/, (mt, ctx) => () => {
    const lim = ctx.grade >= 4 ? 100000 : 1000, lo = ri(Math.floor(lim / 10), Math.floor(lim / 2)), hi = lo + ri(Math.floor(lim / 50), Math.floor(lim / 10));
    const inside = ri(lo + 1, hi - 1), outs = [lo - ri(1, 9), hi + ri(1, 9), lo - ri(10, 30), hi + ri(10, 30)];
    return mc(`Which number is greater than ${b(fmt(lo))} and less than ${b(fmt(hi))}?`, fmt(inside), outs.map(fmt), `${fmt(lo)} < ${fmt(inside)} < ${fmt(hi)}.`);
  }),
  R(/^Make the largest or smallest number possible$/, () => () => {
    const ds = sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 4), big_ = Math.random() < 0.5;
    const s = ds.slice().sort((x, y) => (big_ ? y - x : x - y)).join('');
    return num(`Use each digit once: ${b(ds.join(', '))}. What is the ${big_ ? 'largest' : 'smallest'} 4-digit number you can make?`, +s, `${big_ ? 'Put the biggest digits in the biggest places' : 'Put the smallest digits in the biggest places'}: ${b(s)}.`);
  }),

  /* ---------- rounding & estimation ---------- */
  R(/^Estimate to the nearest 10$|^Round to the nearest (?:ten|10)$|^Estimate to the nearest ten$/, () => () => {
    const n = ri(11, 999), r = Math.round(n / 10) * 10;
    return num(`Round ${b(n)} to the nearest ten.`, r, `Look at the ones digit: ${n % 10 >= 5 ? 'round up' : 'round down'}. ${b(r)}.`);
  }),
  R(/^Round to the nearest ten or hundred$|^Round to the nearest 10 or 100$|^Round to the nearest ten, hundred or thousand$|^Round to the nearest 10 000$|^Rounding$|^Rounding puzzles$|^Rounding input\/output tables$/, (mt, ctx) => () => {
    const places = /thousand/.test(ctx.title) || /10 000/.test(ctx.title) || ctx.grade >= 4 ? [10, 100, 1000, 10000] : [10, 100];
    const p = pick(/10 000/.test(ctx.title) ? [10000] : places), n = ri(p, p * (ctx.grade >= 4 ? 99 : 9)), r = Math.round(n / p) * p;
    return num(`Round ${b(fmt(n))} to the nearest ${fmt(p)}.`, r, `Look at the digit to the right of the ${PLACES[Math.log10(p)]} place: ${b(fmt(r))}.`);
  }),
  R(/^Round money amounts$/, () => () => {
    const c = ri(101, 9999) / 100, p = pick([1, 10]), r = Math.round(c / p) * p;
    return num(`Round $${c.toFixed(2)} to the nearest ${p === 1 ? 'dollar' : 'ten dollars'}. (Answer in dollars)`, r, `Round: ${b('$' + r)}.`);
  }),
];
