/* Statistics, probability, data displays and scatter plots for Grades 6–12. */
import { ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, dec, num, mc, yesNo, near, svg, C, NAMES, gcd, table, plane, barGraph, lineGraph, thing, MINUS } from '../h.js';
import { R } from '../engine.js';
import { circleGraph, theme, median, modeOf } from './data.js';
import { fs, simp } from './fractions.js';
import { S } from './numsys.js';

const meanOf = a => sum(a) / a.length;
const sorted = a => a.slice().sort((x, y) => x - y);
const quartiles = a => { const s = sorted(a), n = s.length, half = Math.floor(n / 2), lower = s.slice(0, half), upper = s.slice(n % 2 ? half + 1 : half); return { q1: median(lower), q2: median(s), q3: median(upper) }; };
const dataset = (n = ri(5, 9), lo = 2, hi = 20) => Array.from({ length: n }, () => ri(lo, hi));
const histogram = (bins, { title = '', width = 360, height = 190 } = {}) => {
  const L = 36, B = 30, T = title ? 24 : 10, W = width - L - 8, H = height - B - T, top = Math.max(...bins.map(x => x[1])), st = top <= 10 ? 1 : top <= 20 ? 2 : 5, ymax = Math.ceil(top / st) * st, bw = W / bins.length;
  let inner = title ? `<text x="${width / 2}" y="14" font-size="13" font-weight="700" text-anchor="middle" fill="${C.ink}">${title}</text>` : '';
  for (let v = 0; v <= ymax; v += st) { const y = T + H - (v / ymax) * H; inner += `<line x1="${L}" y1="${y}" x2="${width - 8}" y2="${y}" stroke="#e2e8f0"/><text x="${L - 6}" y="${y + 4}" font-size="11" text-anchor="end" fill="${C.ink}">${v}</text>`; }
  bins.forEach(([lab, v], i) => { const h = (v / ymax) * H; inner += `<rect x="${L + i * bw}" y="${T + H - h}" width="${bw}" height="${h}" fill="${C.primary}" stroke="#fff" stroke-width="1.5"/><text x="${L + i * bw + bw / 2}" y="${height - 12}" font-size="11" text-anchor="middle" fill="${C.ink}">${lab}</text>`; });
  inner += `<line x1="${L}" y1="${T}" x2="${L}" y2="${T + H}" stroke="${C.ink}" stroke-width="2"/><line x1="${L}" y1="${T + H}" x2="${width - 8}" y2="${T + H}" stroke="${C.ink}" stroke-width="2"/>`;
  return svg(width, height, inner, 'aria-label="histogram"');
};
const makeBins = () => { const w = pick([5, 10]), lo = pick([0, 10, 20]); return range(0, 4).map(i => [`${lo + i * w}–${lo + (i + 1) * w - 1}`, ri(1, 12)]); };
const SAMPLE_SPACE = { 'a coin': 2, 'a die': 6, 'a spinner with 4 equal parts': 4, 'a spinner with 8 equal parts': 8 };

export const STATS6_RULES = [
  /* ===== data displays ===== */
  R(/^Interpret categorical data$/, () => () => {
    const { title, data } = theme(5, 3, 30, 1), tot = sum(data.map(d => d[1])), k = pick(data);
    return Math.random() < 0.5 ? num(`${table(['Category', 'Frequency'], data)}How many responses are there in all?`, tot, `Add the frequencies: ${b(tot)}.`) : num(`${table(['Category', 'Frequency'], data)}What percent of the responses were ${b(k[0])}? (rounded to the nearest percent)`, Math.round((k[1] / tot) * 100), `${k[1]} ÷ ${tot} ≈ ${b(Math.round((k[1] / tot) * 100))}%.`);
  }),
  R(/^Interpret tables$/, () => () => {
    const rows = ['Mon', 'Tue', 'Wed', 'Thu'].map(d => [d, ri(10, 60)]), [a, c] = sample(rows, 2);
    return num(`${table(['Day', 'Visitors'], rows)}How many more visitors came on ${b(a[0])} than on ${b(c[0])}? (Use the absolute difference)`, Math.abs(a[1] - c[1]), `|${a[1]} − ${c[1]}| = ${b(Math.abs(a[1] - c[1]))}.`);
  }),
  R(/^Interpret histograms$/, () => () => {
    const bins = makeBins(), i = ri(0, 4), tot = sum(bins.map(x => x[1])), kind = pick(['count', 'total', 'most']);
    if (kind === 'count') return num(`${histogram(bins, { title: 'Test scores' })}How many students scored in the ${b(bins[i][0])} interval?`, bins[i][1], `Read the bar for ${bins[i][0]}: ${b(bins[i][1])}.`);
    if (kind === 'total') return num(`${histogram(bins, { title: 'Test scores' })}How many students took the test?`, tot, `Add all bars: ${b(tot)}.`);
    const mx = Math.max(...bins.map(x => x[1])); if (bins.filter(x => x[1] === mx).length > 1) return null; const top = bins.find(x => x[1] === mx)[0];
    return mc(`${histogram(bins, { title: 'Test scores' })}Which interval has the most students?`, top, bins.map(x => x[0]).filter(v_ => v_ !== top).slice(0, 3), `The tallest bar is ${b(top)}.`, 4);
  }),
  R(/^Create histograms$/, () => () => {
    const w = pick([5, 10]), lo = pick([0, 10, 20]), vals = dataset(ri(10, 16), lo, lo + 5 * w - 1), k = ri(0, 4), a = lo + k * w, c = a + w - 1, cnt = vals.filter(v_ => v_ >= a && v_ <= c).length;
    return num(`Data: ${vals.join(', ')}<br>If you make a histogram with intervals of width ${w}, how tall is the bar for ${b(`${a}–${c}`)}?`, cnt, `Count the values from ${a} to ${c}: ${b(cnt)}.`);
  }),
  R(/^Interpret circle graphs$/, () => () => {
    const parts = pick([[['Soccer', 40], ['Hockey', 25], ['Swim', 20], ['Other', 15]], [['Math', 30], ['Art', 30], ['Gym', 25], ['Music', 15]]]), tot = pick([60, 80, 120, 200]), k = ri(0, 3);
    return num(`${circleGraph(parts)}${tot} students were surveyed. How many chose ${b(parts[k][0])}?`, (parts[k][1] * tot) / 100, `${parts[k][1]}% of ${tot} = ${b((parts[k][1] * tot) / 100)}.`);
  }),
  R(/^Interpret double line graphs$|^Create double line graphs$/, (mt, ctx) => () => {
    const labs = ['Jan', 'Feb', 'Mar', 'Apr'], a = labs.map(() => ri(4, 20)), c = labs.map(() => ri(4, 20)), i = ri(0, 3), W = 360, H = 190, L = 36, B = 28, T = 26, top = 20, X = k => L + (k / 3) * (W - L - 20), Y = v => T + (H - B - T) * (1 - v / top);
    let inner = ''; for (let v = 0; v <= top; v += 4) inner += `<line x1="${L}" y1="${Y(v)}" x2="${W - 10}" y2="${Y(v)}" stroke="#e2e8f0"/><text x="${L - 6}" y="${Y(v) + 4}" font-size="11" text-anchor="end" fill="${C.ink}">${v}</text>`;
    for (const [s_, col] of [[a, C.primary], [c, C.accent]]) { inner += `<polyline points="${s_.map((v, k) => `${X(k)},${Y(v)}`).join(' ')}" fill="none" stroke="${col}" stroke-width="2.5"/>`; s_.forEach((v, k) => { inner += `<circle cx="${X(k)}" cy="${Y(v)}" r="4" fill="${col}"/>`; }); }
    labs.forEach((l, k) => { inner += `<text x="${X(k)}" y="${H - 8}" font-size="11" text-anchor="middle" fill="${C.ink}">${l}</text>`; });
    inner += `<line x1="${L}" y1="${T}" x2="${L}" y2="${H - B}" stroke="${C.ink}" stroke-width="2"/><line x1="${L}" y1="${H - B}" x2="${W - 10}" y2="${H - B}" stroke="${C.ink}" stroke-width="2"/><circle cx="${W - 130}" cy="10" r="5" fill="${C.primary}"/><text x="${W - 120}" y="14" font-size="11" fill="${C.ink}">Team A</text><circle cx="${W - 66}" cy="10" r="5" fill="${C.accent}"/><text x="${W - 56}" y="14" font-size="11" fill="${C.ink}">Team B</text>`;
    return num(`${svg(W, H, inner)}How many more points did Team A score than Team B in ${b(labs[i])}? (Use the absolute difference)`, Math.abs(a[i] - c[i]), `|${a[i]} − ${c[i]}| = ${b(Math.abs(a[i] - c[i]))}.`);
  }),
  R(/^Create double bar graphs$/, () => () => {
    const labs = ['Mon', 'Tue', 'Wed'], a = labs.map(() => ri(2, 9)), c = labs.map(() => ri(2, 9)), i = ri(0, 2);
    return num(`${table(['Day', 'Class A', 'Class B'], labs.map((l, k) => [l, a[k], c[k]]))}In a double bar graph of this data, how tall is Class B's bar for ${b(labs[i])}?`, c[i], `Read the table: ${b(c[i])}.`);
  }),

  /* ===== statistics ===== */
  R(/^Calculate mean(?: and range)?$|^Interpret charts and graphs to find mean$|^Interpret charts to find mean and range$|^Mean and range: find the missing number$/, (mt, ctx) => () => {
    const t = ctx.title, n = ri(4, 7), mean = ri(5, 20), vals = Array.from({ length: n - 1 }, () => ri(Math.max(1, mean - 6), mean + 6)), last = mean * n - sum(vals); if (last < 1 || last > 40) return null;
    const all = shuffle([...vals, last]);
    if (/missing/.test(t)) return num(`The mean of ${n} numbers is ${b(mean)}. The first ${n - 1} numbers are ${vals.join(', ')}. What is the last number?`, last, `${n} × ${mean} = ${mean * n}; ${mean * n} − ${sum(vals)} = ${b(last)}.`);
    const pic = /charts/.test(t) ? table(['Value', 'Frequency'], uniq(all).sort((x, y) => x - y).map(v_ => [v_, all.filter(x => x === v_).length])) : `<div class="math">${all.join(', ')}</div>`;
    const rng = Math.max(...all) - Math.min(...all);
    return /range/.test(t) && Math.random() < 0.5 ? num(`${pic}What is the ${b('range')}?`, rng, `${Math.max(...all)} − ${Math.min(...all)} = ${b(rng)}.`) : num(`${pic}What is the ${b('mean')}?`, mean, `${sum(all)} ÷ ${n} = ${b(mean)}.`);
  }),
  R(/^Calculate mean, median, mode(?:,)? and range$|^Interpret charts(?: and graphs)? to find mean, median, mode(?:,)? and range$|^Mean, median, mode and range: find the missing number$/, (mt, ctx) => () => {
    const base = ri(3, 12), vals = shuffle([base, base, ri(1, 20), ri(1, 20), ri(1, 20), ri(1, 20)]), mo = modeOf(vals); if (mo === null) return null;
    const kind = pick(['mean', 'median', 'mode', 'range']), mean = meanOf(vals); if (kind === 'mean' && !Number.isInteger(mean * 2)) return null;
    if (/missing/.test(ctx.title)) { const n = vals.length, tgt = ri(6, 14), others = vals.slice(1), need = tgt * n - sum(others); if (need < 1 || need > 30) return null; return num(`The mean of ${n} numbers is ${b(tgt)}. ${n - 1} of the numbers are ${others.join(', ')}. What is the missing number?`, need, `${n} × ${tgt} − ${sum(others)} = ${b(need)}.`); }
    const v_ = { mean, median: median(vals), mode: mo, range: Math.max(...vals) - Math.min(...vals) }[kind], pic = /charts/.test(ctx.title) ? table(['Value', 'Frequency'], uniq(vals).sort((x, y) => x - y).map(x => [x, vals.filter(y => y === x).length])) : `<div class="math">${vals.join(', ')}</div>`;
    return num(`${pic}Find the ${b(kind)}.`, v_, kind === 'mean' ? `${sum(vals)} ÷ ${vals.length} = ${b(v_)}.` : kind === 'median' ? `In order: ${sorted(vals).join(', ')}. The middle is ${b(v_)}.` : kind === 'mode' ? `${mo} appears most often.` : `${Math.max(...vals)} − ${Math.min(...vals)} = ${b(v_)}.`);
  }),
  R(/^Changes in mean(?: and range)?$|^Changes in mean, median, mode and range$/, (mt, ctx) => () => {
    const vals = dataset(5, 4, 20), add = ri(2, 6), which = pick(['mean', 'range', 'median']), newVals = vals.map(x => x + add);
    const same = which === 'range', before = { mean: meanOf(vals), range: Math.max(...vals) - Math.min(...vals), median: median(vals) }[which];
    return mc(`Every number in a data set is increased by ${b(add)}. What happens to the ${b(which)}?`, same ? 'It stays the same' : `It increases by ${add}`, same ? [`It increases by ${add}`, `It is multiplied by ${add}`, 'It decreases'] : ['It stays the same', `It is multiplied by ${add}`, 'It decreases'], same ? 'The spread of the data does not change when every value shifts.' : `Every value shifts up by ${add}, so the ${which} does too.`, 4);
  }),
  R(/^Identify an outlier and describe the effect of removing it$/, () => () => {
    const base = dataset(5, 10, 20), out = ri(45, 80), vals = shuffle([...base, out]), mean1 = meanOf(vals), mean2 = meanOf(base);
    return mc(`Data: ${vals.join(', ')}<br>Which value is an outlier, and what happens to the mean if it is removed?`, `${out}; the mean decreases`, [`${out}; the mean increases`, `${Math.min(...vals)}; the mean decreases`, `${Math.min(...vals)}; the mean increases`], `${out} is far from the rest. Removing it lowers the mean from ${fix(mean1, 1)} to ${fix(mean2, 1)}.`, 4);
  }),
  R(/^Quartiles$/, () => () => {
    const vals = sorted(dataset(ri(7, 11), 2, 40)), q = quartiles(vals), which = pick(['q1', 'q3']);
    return num(`Data: ${vals.join(', ')}<br>What is the ${b(which === 'q1' ? 'first quartile (Q1)' : 'third quartile (Q3)')}?`, q[which], `The median is ${q.q2}. ${which === 'q1' ? 'Q1 is the median of the lower half' : 'Q3 is the median of the upper half'}: ${b(q[which])}.`);
  }),
  R(/^Identify representative(?:, random)? and biased samples$/, () => () => {
    const q = pick([['Ask every 10th student who enters the school', 'Representative'], ['Ask only members of the chess club about favourite lunches', 'Biased'], ['Ask 40 students chosen by a random number generator', 'Representative'], ['Survey only people leaving a gym about how much exercise people get', 'Biased'], ['Ask the first 5 students you meet in the hallway', 'Biased']]);
    return mc(`A school wants to know about all students. Sampling method: ${b(q[0])}. Is the sample representative or biased?`, q[1], [q[1] === 'Biased' ? 'Representative' : 'Biased'], q[1] === 'Biased' ? 'The sample leaves out part of the population.' : 'Every student has a fair chance of being chosen.', 2);
  }),
  R(/^Identify discrete and continuous data$/, () => () => {
    const q = pick([['The number of students in a class', 'Discrete'], ['The height of a plant', 'Continuous'], ['The number of goals scored', 'Discrete'], ['The time to run a race', 'Continuous'], ['The mass of a bag of flour', 'Continuous'], ['The number of pets a family has', 'Discrete']]);
    return mc(`Is this data discrete or continuous? ${b(q[0])}`, q[1], [q[1] === 'Discrete' ? 'Continuous' : 'Discrete'], q[1] === 'Discrete' ? 'It can only take separate whole-number values (counted).' : 'It can take any value in a range (measured).', 2);
  }),
  R(/^Make an estimate from sample data$/, () => () => {
    const pop = pick([400, 500, 800, 1000, 1200]), n = pick([20, 25, 40, 50]), yes = ri(2, n / 2) , est = Math.round((yes / n) * pop);
    return num(`In a random sample of ${b(n)} students, ${b(yes)} walk to school. About how many of the ${b(pop)} students in the school walk? (Round to the nearest whole number.)`, est, `${yes}/${n} × ${pop} ≈ ${b(est)}.`);
  }),

  /* ===== probability ===== */
  R(/^Probability of (?:one event|simple events)(?:: word problems)?$/, (mt, ctx) => () => {
    const r = ri(1, 6), g = ri(1, 6), bl = ri(1, 6), tot = r + g + bl, [col, k] = pick([['red', r], ['green', g], ['blue', bl]]), [sn, sd] = simp(k, tot), ans = sd === 1 ? '1' : fs(sn, sd), nm = pick(NAMES);
    return mc(`${/word/.test(ctx.title) ? `${nm} has a bag with ${r} red, ${g} green and ${bl} blue marbles. ${nm} picks one at random. ` : `A bag has ${r} red, ${g} green and ${bl} blue marbles. One is picked at random. `}What is the probability of picking a ${b(col)} marble?`, ans, uniq([fs(k, tot + 1), fs(tot - k, tot), fs(tot, k), fs(sn, sd + 1)]).filter(v_ => v_ !== ans && !v_.endsWith('/1')).slice(0, 3), `${k} out of ${tot}: ${b(ans)}.`, 4);
  }),
  R(/^Probability of opposite, mutually exclusive and overlapping events$/, () => () => {
    const tot = pick([10, 20, 12]), a = ri(2, tot / 2 + 2), kind = pick(['opp', 'excl', 'overlap']);
    if (kind === 'opp') { const [sn, sd] = simp(tot - a, tot); return mc(`The probability of rain is ${b(fs(...simp(a, tot)))}. What is the probability that it does ${b('not')} rain?`, sd === 1 ? '1' : fs(sn, sd), uniq([fs(...simp(a, tot)), fs(tot - a + 1, tot), fs(tot, tot - a)]).filter(v_ => v_ !== fs(sn, sd)), `1 − ${fs(...simp(a, tot))} = ${b(fs(sn, sd))}.`, 4); }
    if (kind === 'excl') { const x = ri(1, 4), y = ri(1, 4); return mc(`A spinner has 10 equal sections. ${x} are red and ${y} are blue. What is P(red or blue)?`, fs(...simp(x + y, 10)), uniq([fs(x * y, 10), fs(...simp(Math.max(x, y), 10)), fs(x + y, 20)]).filter(v_ => v_ !== fs(...simp(x + y, 10))), `Mutually exclusive events add: ${x}/10 + ${y}/10 = ${b(fs(...simp(x + y, 10)))}.`, 4); }
    const both = ri(1, 3), p1 = ri(3, 6), p2 = ri(3, 6); return mc(`In a class of 20, ${p1} play soccer, ${p2} play hockey and ${both} play both. How many play soccer or hockey (or both)?`, String(p1 + p2 - both), [String(p1 + p2), String(p1 + p2 + both), String(Math.max(p1, p2))], `${p1} + ${p2} − ${both} = ${b(p1 + p2 - both)}.`, 4);
  }),
  R(/^Make predictions using theoretical probability$|^Make predictions using experimental probability$/, (mt, ctx) => () => {
    const trials = pick([50, 100, 200, 300]), pnum = pick([[1, 2], [1, 4], [1, 5], [3, 5], [1, 10]]);
    if (/experimental/.test(ctx.title)) { const n = pick([20, 25, 50]), hit = ri(3, n / 2), big_ = pick([100, 200, 500]); return num(`A spinner landed on blue ${b(hit)} times in ${b(n)} spins. About how many times would you expect blue in ${b(big_)} spins?`, (hit / n) * big_, `${hit}/${n} × ${big_} = ${b((hit / n) * big_)}.`); }
    const ans = (trials * pnum[0]) / pnum[1]; if (!Number.isInteger(ans)) return null;
    return num(`The probability of winning a game is ${b(fs(...pnum))}. About how many wins are expected in ${b(trials)} games?`, ans, `${trials} × ${fs(...pnum)} = ${b(ans)}.`);
  }),
  R(/^Sample spaces for compound events$/, () => () => {
    const [a, c] = sample(Object.keys(SAMPLE_SPACE), 2), n = SAMPLE_SPACE[a] * SAMPLE_SPACE[c];
    return num(`You ${a === 'a coin' ? 'flip' : a === 'a die' ? 'roll' : 'spin'} ${b(a)} and then ${c === 'a coin' ? 'flip' : c === 'a die' ? 'roll' : 'spin'} ${b(c)}. How many outcomes are in the sample space?`, n, `${SAMPLE_SPACE[a]} × ${SAMPLE_SPACE[c]} = ${b(n)}.`);
  }),
  R(/^Compound events: find the number (?:of outcomes|of sums)$/, (mt, ctx) => () => {
    if (/sums/.test(ctx.title)) { const n = pick([4, 6, 8]), sums = new Set(); for (let i = 1; i <= n; i++) for (let j = 1; j <= n; j++) sums.add(i + j); return num(`Two ${n}-sided dice (numbered 1 to ${n}) are rolled and the numbers are added. How many different sums are possible?`, sums.size, `The sums go from 2 to ${2 * n}: ${b(sums.size)} different sums.`); }
    const a = ri(2, 5), c = ri(2, 6), d = ri(2, 4); return num(`A meal has a choice of ${b(a)} sandwiches, ${b(c)} drinks and ${b(d)} desserts. How many different meals can be made?`, a * c * d, `${a} × ${c} × ${d} = ${b(a * c * d)}.`);
  }),
  R(/^Counting principle$/, () => () => {
    const a = ri(2, 6), c = ri(2, 6), d = ri(2, 5), nm = pick(NAMES);
    return num(`${nm} has ${b(a)} shirts, ${b(c)} pairs of pants and ${b(d)} hats. How many different outfits (one of each) can ${nm} make?`, a * c * d, `${a} × ${c} × ${d} = ${b(a * c * d)}.`);
  }),
  R(/^Identify independent and dependent events$/, () => () => {
    const q = pick([['Flip a coin twice', 'Independent'], ['Draw a card, keep it, then draw another from the same deck', 'Dependent'], ['Roll a die and then spin a spinner', 'Independent'], ['Pick a marble, do not replace it, and pick again', 'Dependent'], ['Pick a marble, put it back, and pick again', 'Independent']]);
    return mc(`Are these events independent or dependent? ${b(q[0])}`, q[1], [q[1] === 'Independent' ? 'Dependent' : 'Independent'], q[1] === 'Independent' ? 'The first event does not change the chances of the second.' : 'The first event changes the chances of the second.', 2);
  }),
  R(/^Probability of independent events$|^Probability of independent and dependent events$/, (mt, ctx) => () => {
    const dep = /and dependent/.test(ctx.title) && Math.random() < 0.5, r = ri(2, 5), bl = ri(2, 5), tot = r + bl;
    if (dep) { const [n1, d1] = [r, tot], [n2, d2] = [r - 1, tot - 1], [sn, sd] = simp(n1 * n2, d1 * d2); if (n2 === 0) return null; return mc(`A bag has ${r} red and ${bl} blue marbles. Two marbles are drawn ${b('without replacement')}. What is the probability both are red?`, sd === 1 ? '1' : fs(sn, sd), uniq([fs(...simp(n1 * n1, d1 * d1)), fs(...simp(n1 * n2, d1 * d1)), fs(...simp(n1 + n2, d1 + d2))]).filter(v_ => v_ !== fs(sn, sd)), `${r}/${tot} × ${r - 1}/${tot - 1} = ${b(fs(sn, sd))}.`, 4); }
    const [n, d] = simp(1, ri(2, 6)), [n2, d2] = simp(1, ri(2, 6)), [sn, sd] = simp(n * n2, d * d2);
    return mc(`The probability of event A is ${b(fs(n, d))} and of independent event B is ${b(fs(n2, d2))}. What is P(A and B)?`, fs(sn, sd), uniq([fs(n + n2, d + d2), fs(...simp(n * d2 + n2 * d, d * d2)), fs(sn, sd + 1)]).filter(v_ => v_ !== fs(sn, sd)), `Multiply: ${fs(n, d)} × ${fs(n2, d2)} = ${b(fs(sn, sd))}.`, 4);
  }),

  /* ===== scatter plots ===== */
  R(/^Create scatter plots$|^Identify trends with scatter plots$|^Make predictions with scatter plots$|^Describe scatter plots$/, (mt, ctx) => () => {
    const kind = pick(['positive', 'negative', 'none']), pts = range(1, 8).map(x => ({ x, y: kind === 'positive' ? Math.max(1, Math.min(9, x + ri(-1, 1))) : kind === 'negative' ? Math.max(1, Math.min(9, 9 - x + ri(-1, 1))) : ri(1, 9), color: C.primary })), pic = plane({ min: 0, max: 10, points: pts, labelEvery: 2 });
    if (/Make predictions/.test(ctx.title)) { const x = ri(9, 10); return num(`${plane({ min: 0, max: 12, points: range(1, 8).map(k => ({ x: k, y: k, color: C.primary })), labelEvery: 2 })}The points follow the line y = x. Predict y when x = ${b(x)}.`, x, `y = x, so y = ${b(x)}.`); }
    if (/Create/.test(ctx.title)) { const k = ri(1, 8); return mc(`A data point has x = ${b(k)} and y = ${b(k + 1)}. Which ordered pair should be plotted?`, `(${k}, ${k + 1})`, [`(${k + 1}, ${k})`, `(${k}, ${k})`, `(${k + 1}, ${k + 1})`], `Plot x first, then y: ${b(`(${k}, ${k + 1})`)}.`, 4); }
    return mc(`${pic}Which describes the relationship shown?`, kind === 'none' ? 'No correlation' : kind === 'positive' ? 'Positive correlation' : 'Negative correlation', ['Positive correlation', 'Negative correlation', 'No correlation'].filter(v_ => v_ !== (kind === 'none' ? 'No correlation' : kind === 'positive' ? 'Positive correlation' : 'Negative correlation')), kind === 'positive' ? 'As x increases, y increases.' : kind === 'negative' ? 'As x increases, y decreases.' : 'There is no clear pattern.', 3);
  })
];
export { histogram, quartiles, meanOf };
