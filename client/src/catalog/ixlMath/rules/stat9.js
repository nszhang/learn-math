/* Probability, counting, distributions and statistics for Grades 9–12. */
import { ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, dec, num, mc, yesNo, near, svg, C, NAMES, gcd, table, plane, barGraph, lineGraph, MINUS } from '../h.js';
import { R } from '../engine.js';
import { S, P, nz } from './numsys.js';
import { stack, fs, simp } from './fractions.js';
import { median, theme } from './data.js';
import { histogram, quartiles, meanOf } from './stats6.js';

const fact = n => (n <= 1 ? 1 : n * fact(n - 1));
const nPr = (n, r) => fact(n) / fact(n - r), nCr = (n, r) => fact(n) / (fact(r) * fact(n - r));
const frac = (n, d) => { const [a, c] = simp(n, d); return c === 1 ? String(a) : `${a}/${c}`; };
const fracWrong = (n, d, k = 3) => uniq([frac(n + 1, d), frac(Math.max(1, n - 1), d), frac(n, d + 1), frac(d - n || 1, d), frac(n * 2, d)]).filter(v_ => v_ !== frac(n, d)).slice(0, k);
const sd = a => Math.sqrt(sum(a.map(x => (x - meanOf(a)) ** 2)) / a.length);
const vals = (n = 7, lo = 2, hi = 20) => Array.from({ length: n }, () => ri(lo, hi));
const TABLE_Z = { '-2': 0.0228, '-1.5': 0.0668, '-1': 0.1587, '-0.5': 0.3085, 0: 0.5, 0.5: 0.6915, 1: 0.8413, 1.5: 0.9332, 2: 0.9772, 2.5: 0.9938 };

function boxPlot(min, q1, med, q3, max, scaleMin, scaleMax) {
  const W = 400, pad = 20, X = v_ => pad + ((v_ - scaleMin) / (scaleMax - scaleMin)) * (W - 2 * pad), y = 40;
  let inner = `<line x1="${X(min)}" y1="${y}" x2="${X(q1)}" y2="${y}" stroke="${C.ink}" stroke-width="2"/><line x1="${X(q3)}" y1="${y}" x2="${X(max)}" y2="${y}" stroke="${C.ink}" stroke-width="2"/><rect x="${X(q1)}" y="${y - 18}" width="${X(q3) - X(q1)}" height="36" fill="#c7d2fe" stroke="${C.primary}" stroke-width="2.5"/><line x1="${X(med)}" y1="${y - 18}" x2="${X(med)}" y2="${y + 18}" stroke="${C.primary}" stroke-width="3.5"/><line x1="${X(min)}" y1="${y - 10}" x2="${X(min)}" y2="${y + 10}" stroke="${C.ink}" stroke-width="2"/><line x1="${X(max)}" y1="${y - 10}" x2="${X(max)}" y2="${y + 10}" stroke="${C.ink}" stroke-width="2"/>`;
  inner += `<line x1="${pad}" y1="85" x2="${W - pad}" y2="85" stroke="${C.ink}" stroke-width="1.5"/>`;
  for (let v_ = scaleMin; v_ <= scaleMax; v_ += (scaleMax - scaleMin) / 10) inner += `<line x1="${X(v_)}" y1="81" x2="${X(v_)}" y2="89" stroke="${C.ink}"/><text x="${X(v_)}" y="103" font-size="11" text-anchor="middle" fill="${C.ink}">${Math.round(v_)}</text>`;
  return svg(W, 112, inner, 'aria-label="box plot"');
}
function scatter(pts, line) {
  const lines = line ? [[0, line.b, 10, line.m * 10 + line.b]] : [];
  return plane({ min: 0, max: 10, points: pts.map(p => ({ x: p[0], y: p[1], color: C.primary })), lines, labelEvery: 2, size: 280 });
}
function regress(pts) {
  const n = pts.length, mx = meanOf(pts.map(p => p[0])), my = meanOf(pts.map(p => p[1])), sxy = sum(pts.map(p => (p[0] - mx) * (p[1] - my))), sxx = sum(pts.map(p => (p[0] - mx) ** 2)), syy = sum(pts.map(p => (p[1] - my) ** 2)), mm = sxy / sxx, bb = my - mm * mx;
  return { m: mm, b: bb, r: sxy / Math.sqrt(sxx * syy) };
}
const pts5 = () => { const mm = pick([0.5, 1, 1.5, -1, 2]), bb = mm < 0 ? ri(7, 9) : ri(0, 2); return range(1, 6).map(x => [x, Math.max(0, Math.min(10, Math.round(mm * x + bb + ri(-1, 1))))]); };

export const STAT9_RULES = [
  /* ===== probability ===== */
  R(/^Introduction to probability$|^Calculate probabilities of events$|^Theoretical probability$|^Theoretical and experimental probability$/, (mt, ctx) => () => {
    const r = ri(1, 6), g = ri(1, 6), bl = ri(1, 6), tot = r + g + bl, col = pick([['red', r], ['green', g], ['blue', bl]]);
    if (/experimental/.test(ctx.title) && Math.random() < 0.5) { const n = pick([20, 40, 50, 100]), k = ri(2, n / 2); return mc(`A coin-flip game wins ${b(k)} times in ${b(n)} trials. What is the experimental probability of winning?`, frac(k, n), fracWrong(k, n), `${k}/${n} = ${b(frac(k, n))}.`, 4); }
    const kind = pick(['single', 'notc', 'dice']);
    if (kind === 'dice') { const t = ri(2, 12), ways = 6 - Math.abs(t - 7); return mc(`Two fair dice are rolled. What is the probability that the sum is ${b(t)}?`, frac(ways, 36), fracWrong(ways, 36), `${ways} of the 36 outcomes give a sum of ${t}: ${b(frac(ways, 36))}.`, 4); }
    if (kind === 'notc') return mc(`A bag has ${r} red, ${g} green and ${bl} blue marbles. One is drawn at random. What is the probability it is ${b('not ' + col[0])}?`, frac(tot - col[1], tot), fracWrong(tot - col[1], tot), `1 − ${col[1]}/${tot} = ${b(frac(tot - col[1], tot))}.`, 4);
    return mc(`A bag has ${r} red, ${g} green and ${bl} blue marbles. One is drawn at random. What is the probability it is ${b(col[0])}?`, frac(col[1], tot), fracWrong(col[1], tot), `${col[1]} out of ${tot}: ${b(frac(col[1], tot))}.`, 4);
  }),
  R(/^Factorials$/, () => () => { const n = ri(3, 8); return num(`Evaluate ${m(`${n}!`)}.`, fact(n), `${Array.from({ length: n }, (_, i) => n - i).join(' × ')} = ${b(fmt(fact(n)))}.`); }),
  R(/^Permutations$|^Combinations and permutations$|^Permutation and combination notation$/, (mt, ctx) => () => {
    const n = ri(5, 9), r = ri(2, 4), perm = Math.random() < 0.5;
    return /notation/.test(ctx.title) ? num(`Evaluate ${m(`<sub>${n}</sub>${perm ? 'P' : 'C'}<sub>${r}</sub>`)}.`, perm ? nPr(n, r) : nCr(n, r), `${perm ? 'n!/(n−r)!' : 'n!/(r!(n−r)!)'} = ${b(perm ? nPr(n, r) : nCr(n, r))}.`) : perm ? num(`In how many ways can ${b(r)} of ${b(n)} runners finish first, second and so on (order matters)?`, nPr(n, r), `P(${n},${r}) = ${b(nPr(n, r))}.`) : num(`In how many ways can a committee of ${b(r)} be chosen from ${b(n)} people?`, nCr(n, r), `C(${n},${r}) = ${b(nCr(n, r))}.`);
  }),
  R(/^Find probabilities using (?:permutations and combinations|combinations and permutations)$/, () => () => {
    const a = ri(3, 6), c = ri(3, 6), pick_ = 2, tot = nCr(a + c, pick_), good = nCr(a, pick_);
    return mc(`A bag has ${b(a)} red and ${b(c)} blue marbles. Two are drawn at once. What is the probability both are red?`, frac(good, tot), fracWrong(good, tot), `C(${a},2) ÷ C(${a + c},2) = ${good}/${tot} = ${b(frac(good, tot))}.`, 4);
  }),
  R(/^Find probabilities using two-way frequency tables$|^Find conditional probabilities using two-way frequency tables$|^Find conditional probabilities$|^Independence and conditional probability$/, (mt, ctx) => () => {
    const a = ri(10, 30), c = ri(10, 30), d = ri(10, 30), e = ri(10, 30), tot = a + c + d + e;
    const tbl = table(['', 'Likes pizza', 'Dislikes pizza', 'Total'], [['Grade 9', a, c, a + c], ['Grade 10', d, e, d + e], ['Total', a + d, c + e, tot]]);
    if (/conditional/.test(ctx.title) && !/Independence/.test(ctx.title)) return mc(`${tbl}Given that a student is in Grade 9, what is the probability they like pizza?`, frac(a, a + c), fracWrong(a, a + c), `P(likes | Grade 9) = ${a}/${a + c} = ${b(frac(a, a + c))}.`, 4);
    if (/Independence/.test(ctx.title)) { const indep = Math.random() < 0.5, x = ri(2, 6), y = ri(2, 6); const A = x * y, B_ = x * (y + 1), C_ = (x + 1) * y, D_ = (x + 1) * (y + 1); const tt = indep ? [A, B_, C_, D_] : [A, B_ + 4, C_, D_]; return yesNo(`${table(['', 'Event B', 'Not B', 'Total'], [['Event A', tt[0], tt[1], tt[0] + tt[1]], ['Not A', tt[2], tt[3], tt[2] + tt[3]]])}Are events A and B independent? (Check whether P(B | A) = P(B).)`, indep || Math.abs((tt[0] / (tt[0] + tt[1])) - ((tt[0] + tt[2]) / (tt[0] + tt[1] + tt[2] + tt[3]))) < 1e-9, indep ? 'P(B|A) equals P(B).' : 'P(B|A) differs from P(B).', ['Yes', 'No']); }
    return mc(`${tbl}A student is chosen at random. What is the probability the student is in Grade 10 ${b('and')} dislikes pizza?`, frac(e, tot), fracWrong(e, tot), `${e} of ${tot}: ${b(frac(e, tot))}.`, 4);
  }),
  R(/^Identify independent events$|^Independent and dependent events$/, () => () => {
    const q = [['Rolling a die twice', 'Independent'], ['Drawing two cards without replacement', 'Dependent'], ['Flipping a coin and then rolling a die', 'Independent'], ['Picking two students for different jobs from the same group, with no repeats', 'Dependent']]; const [d, a] = pick(q);
    return mc(`Are these events independent or dependent? ${b(d)}`, a, [a === 'Independent' ? 'Dependent' : 'Independent'], a === 'Independent' ? 'The first outcome does not affect the second.' : 'The first outcome changes the second.', 2);
  }),
  R(/^Find probabilities using the addition rule$/, () => () => {
    const pa = ri(2, 6) / 10, pb = ri(2, 6) / 10, pab = ri(1, Math.floor(Math.min(pa, pb) * 10)) / 10;
    return num(`P(A) = ${b(pa)}, P(B) = ${b(pb)} and P(A and B) = ${b(pab)}. What is P(A or B)?`, fix(pa + pb - pab, 2), `${pa} + ${pb} − ${pab} = ${b(fix(pa + pb - pab, 2))}.`);
  }),
  R(/^Geometric probability$/, () => () => {
    const R_ = ri(3, 8), r = ri(1, R_ - 1); return mc(`A dart lands at random on a circular board of radius ${b(R_)}. What is the probability it lands inside the central circle of radius ${b(r)}?`, frac(r * r, R_ * R_), fracWrong(r * r, R_ * R_), `Area ratio = ${r}²/${R_}² = ${b(frac(r * r, R_ * R_))}.`, 4);
  }),
  R(/^Expected values of random variables$|^Expected values for a game of chance$|^Choose the better bet$|^Write the probability distribution for a game of chance$|^Write a discrete probability distribution$|^Graph a discrete probability distribution$/, (mt, ctx) => () => {
    const t = ctx.title, xs = [0, 1, 2, 3], ps = [0.1, 0.2, 0.3, 0.4], ev = sum(xs.map((x, i) => x * ps[i]));
    if (/Choose the better bet/.test(t)) { const w1 = ri(4, 10), p1 = ri(2, 4) / 10, w2 = ri(2, 6), p2 = ri(3, 6) / 10, e1 = w1 * p1 - 2 * (1 - p1), e2 = w2 * p2 - 2 * (1 - p2); if (fix(e1, 3) === fix(e2, 3)) return null; return mc(`Bet A: win $${w1} with probability ${p1}, otherwise lose $2. Bet B: win $${w2} with probability ${p2}, otherwise lose $2. Which bet has the greater expected value?`, e1 > e2 ? 'Bet A' : 'Bet B', [e1 > e2 ? 'Bet B' : 'Bet A', 'They are equal'], `A: ${fix(e1, 2)}; B: ${fix(e2, 2)}.`, 3); }
    if (/game of chance/.test(t) && /Expected/.test(t)) { const win = ri(5, 20), p = ri(1, 4) / 10, cost = ri(1, 4), e = win * p - cost * (1 - p); return num(`A game pays $${win} with probability ${b(p)} and otherwise you lose $${cost}. What is the expected value of one play? ($)`, fix(e, 2), `${win}(${p}) − ${cost}(${fix(1 - p, 2)}) = ${b(fix(e, 2))}.`); }
    if (/Write the probability distribution/.test(t)) { const n = ri(2, 4), outs = range(1, n); return mc(`A fair spinner has ${b(n)} equal sections numbered 1 to ${n}. What is P(X = 2)?`, frac(1, n), fracWrong(1, n), `Each outcome has probability 1/${n}.`, 4); }
    if (/Write a discrete/.test(t)) { const f = [2, 3, 5]; const tot = sum(f); return mc(`A random variable takes the values 1, 2, 3 with frequencies ${f.join(', ')}. What is P(X = 3)?`, frac(5, tot), fracWrong(5, tot), `5/${tot} = ${b(frac(5, tot))}.`, 4); }
    if (/Graph a discrete/.test(t)) { const p0 = 0.1, pm = ri(2, 4) / 10, pp = fix(1 - p0 - pm, 1); return mc(`${barGraph([['0', p0 * 10], ['1', pm * 10], ['2', pp * 10]], { title: 'P(X = x) × 10', max: 10, step: 2 })}The bars show probabilities scaled by 10. What is P(X = 2)?`, String(pp), [String(p0), String(pm), String(fix(pp + 0.1, 1))].filter(v_ => v_ !== String(pp)), `The heights sum to 10: P(X = 2) = ${b(pp)}.`, 4); }
    return num(`${table(['x', 0, 1, 2, 3], [['P(X = x)', ...ps]])}What is the expected value E(X)?`, fix(ev, 2), `Σ x·P(x) = ${b(fix(ev, 2))}.`);
  }),
  R(/^Identify discrete and continuous random variables$/, () => () => {
    const q = [['The number of heads in 10 coin flips', 'Discrete'], ['The time it takes to run a race', 'Continuous'], ['The number of cars passing in a minute', 'Discrete'], ['The height of a randomly chosen adult', 'Continuous']]; const [d, a] = pick(q);
    return mc(`Is this random variable discrete or continuous? ${b(d)}`, a, [a === 'Discrete' ? 'Continuous' : 'Discrete'], a === 'Discrete' ? 'It takes countable values.' : 'It can take any value in an interval.', 2);
  }),
  R(/^Variance of random variables$|^Standard deviation of random variables$/, (mt, ctx) => () => {
    const xs = [0, 1, 2], ps = [0.25, 0.5, 0.25], mu = sum(xs.map((x, i) => x * ps[i])), v_ = sum(xs.map((x, i) => ps[i] * (x - mu) ** 2));
    return /Variance/.test(ctx.title) ? num(`${table(['x', 0, 1, 2], [['P(X = x)', ...ps]])}Find the variance of X.`, fix(v_, 3), `μ = ${mu}; Σ P(x)(x − μ)² = ${b(fix(v_, 3))}.`) : num(`${table(['x', 0, 1, 2], [['P(X = x)', ...ps]])}Find the standard deviation of X. (round to 3 decimals)`, fix(Math.sqrt(v_), 3), `√${fix(v_, 3)} ≈ ${b(fix(Math.sqrt(v_), 3))}.`);
  }),
  R(/^Find probabilities using the binomial distribution$|^Mean, variance and standard deviation of binomial distributions$/, (mt, ctx) => () => {
    const n = ri(3, 6), p = pick([0.5, 0.25, 0.2, 0.4]), k = ri(0, n);
    if (/Mean/.test(ctx.title)) { const w = pick(['mean', 'variance', 'standard deviation']); const val = w === 'mean' ? n * p : w === 'variance' ? n * p * (1 - p) : Math.sqrt(n * p * (1 - p)); return num(`A binomial distribution has n = ${b(n)} and p = ${b(p)}. What is the ${b(w)}? (round to 3 decimals)`, fix(val, 3), `${w === 'mean' ? 'np' : w === 'variance' ? 'np(1 − p)' : '√(np(1 − p))'} = ${b(fix(val, 3))}.`); }
    const pr = nCr(n, k) * p ** k * (1 - p) ** (n - k); return num(`A binomial experiment has ${b(n)} trials with success probability ${b(p)}. Find P(X = ${b(k)}). (round to 4 decimals)`, fix(pr, 4), `C(${n},${k}) ${p}^${k} ${fix(1 - p, 2)}^${n - k} = ${b(fix(pr, 4))}.`);
  }),
  R(/^Find z-values$|^Find values of normal variables$|^Find probabilities using the normal distribution(?: I| II)?$|^Use normal distributions to approximate binomial distributions$|^Distributions of sample means$|^The Central Limit Theorem$/, (mt, ctx) => () => {
    const t = ctx.title, mu = ri(50, 100), sg = ri(4, 12), z = pick([-2, -1, -0.5, 0.5, 1, 1.5, 2]), x = fix(mu + z * sg, 2);
    if (/Find z-values/.test(t)) return num(`A normal variable has mean ${b(mu)} and standard deviation ${b(sg)}. Find the z-value for x = ${b(x)}.`, z, `z = (${x} − ${mu}) ÷ ${sg} = ${b(z)}.`);
    if (/Find values/.test(t)) return num(`A normal variable has mean ${b(mu)} and standard deviation ${b(sg)}. What value of x has a z-score of ${b(z)}?`, x, `x = ${mu} + ${z}(${sg}) = ${b(x)}.`);
    if (/Distributions of sample means|Central Limit/.test(t)) { const n = pick([4, 9, 16, 25, 36]); return /Central/.test(t) ? mc('According to the Central Limit Theorem, as the sample size grows, the distribution of sample means becomes…', 'approximately normal', ['skewed', 'uniform', 'binomial'], 'The sampling distribution of the mean approaches normal.', 4) : num(`A population has mean ${b(mu)} and standard deviation ${b(sg * 3)}. For samples of size ${b(n)}, what is the standard deviation of the sample mean? (round to 2 decimals)`, fix((sg * 3) / Math.sqrt(n), 2), `σ/√n = ${sg * 3}/${Math.sqrt(n)} = ${b(fix((sg * 3) / Math.sqrt(n), 2))}.`); }
    if (/approximate binomial/.test(t)) { const n = pick([20, 40, 100]), p = 0.5; return num(`A binomial distribution has n = ${b(n)} and p = ${b(p)}. What mean should the approximating normal distribution have?`, n * p, `μ = np = ${b(n * p)}.`); }
    if (/II/.test(t) || /Find probabilities using the normal distribution$/.test(t)) { const key = pick(Object.keys(TABLE_Z)); return num(`For a standard normal variable Z, find P(Z < ${b(key)}). (Use a z-table; 4 decimals)`, TABLE_Z[key], `From the z-table, P(Z < ${key}) = ${b(TABLE_Z[key])}.`); }
    const k = pick([[1, 0.68], [2, 0.95], [3, 0.997]]); return num(`In a normal distribution, what proportion of values lie within ${b(k[0])} standard deviation${k[0] > 1 ? 's' : ''} of the mean? (empirical rule)`, k[1], `The empirical rule says ${b(k[1])}.`);
  }),

  /* ===== statistics ===== */
  R(/^Mean, median, mode and range$/, () => () => {
    const a = vals(7, 2, 15), kind = pick(['mean', 'median', 'range']); const mean = meanOf(a); if (kind === 'mean' && !Number.isInteger(mean * 10)) return null;
    return num(`${m(a.join(', '))}<br>Find the ${b(kind)}.`, kind === 'mean' ? fix(mean, 1) : kind === 'median' ? median(a) : Math.max(...a) - Math.min(...a), `${kind === 'mean' ? `${sum(a)} ÷ ${a.length}` : kind === 'median' ? `Sorted: ${a.slice().sort((x, y) => x - y).join(', ')}` : `${Math.max(...a)} − ${Math.min(...a)}`} = ${b(kind === 'mean' ? fix(mean, 1) : kind === 'median' ? median(a) : Math.max(...a) - Math.min(...a))}.`);
  }),
  R(/^Box plots$/, () => () => {
    const lo = ri(0, 10), q1 = lo + ri(3, 8), med = q1 + ri(3, 8), q3 = med + ri(3, 8), hi = q3 + ri(3, 8), sMin = Math.floor(lo / 10) * 10, sMax = Math.ceil(hi / 10) * 10, ask = pick(['median', 'IQR', 'range']);
    const ans = ask === 'median' ? med : ask === 'IQR' ? q3 - q1 : hi - lo;
    return num(`${boxPlot(lo, q1, med, q3, hi, sMin, sMax)}Five-number summary: min ${lo}, Q1 ${q1}, median ${med}, Q3 ${q3}, max ${hi}. What is the ${b(ask)}?`, ans, `${ask === 'median' ? 'The median is the line in the box' : ask === 'IQR' ? `Q3 − Q1 = ${q3} − ${q1}` : `max − min = ${hi} − ${lo}`}: ${b(ans)}.`);
  }),
  R(/^Identify an outlier$/, () => () => {
    const base = vals(7, 10, 20).sort((a, c) => a - c), out_ = pick([ri(40, 70), ri(-30, -10)]), all = shuffle([...base, out_]); const q = quartiles(all.slice().sort((a, c) => a - c)), iqr = q.q3 - q.q1;
    const isOut = x => x < q.q1 - 1.5 * iqr || x > q.q3 + 1.5 * iqr; if (!isOut(out_)) return null;
    return mc(`Data: ${all.join(', ')}<br>Which value is an outlier (using the 1.5 × IQR rule)?`, String(out_), base.slice(0, 3).filter(v_ => v_ !== out_).map(String), `The fences are ${fix(q.q1 - 1.5 * iqr, 1)} and ${fix(q.q3 + 1.5 * iqr, 1)}; ${out_} is outside.`, 4);
  }),
  R(/^Interpret bar graphs, line graphs and histograms$|^Create bar graphs, line graphs and histograms$/, (mt, ctx) => () => {
    const kind = pick(['bar', 'line', 'hist']);
    if (kind === 'hist') { const bins = range(0, 4).map(i => [`${i * 10}–${i * 10 + 9}`, ri(2, 14)]), i = ri(0, 4); return num(`${histogram(bins, { title: 'Scores' })}How many values are in the ${b(bins[i][0])} interval?`, bins[i][1], `Read the bar: ${b(bins[i][1])}.`); }
    if (kind === 'line') { const labs = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], v_ = labs.map(() => ri(2, 18)), i = ri(0, 4); return num(`${lineGraph(labs.map((l, k) => [l, v_[k]]), { max: 20, step: 2 })}What value is shown for ${b(labs[i])}?`, v_[i], `Read the point above ${labs[i]}: ${b(v_[i])}.`); }
    const { title, data } = theme(4, 2, 16); const k = pick(data); return num(`${barGraph(data, { title })}How many chose ${b(k[0])}?`, k[1], `Read the bar: ${b(k[1])}.`);
  }),
  R(/^Interpret a scatter plot$|^Outliers in scatter plots$|^Scatter plots: line of best fit$/, (mt, ctx) => () => {
    const t = ctx.title, pts = pts5(), { m: mm, b: bb, r } = regress(pts);
    if (/Outliers/.test(t)) {
      const base = pts5(), k = ri(0, 4), ox = base[k][0], oy = base[k][1] > 5 ? 0 : 10, all = base.map((p_, i) => (i === k ? [ox, oy] : p_)), labs = ['A', 'B', 'C', 'D', 'E'];
      return mc(`${plane({ min: 0, max: 10, points: all.map((p_, i) => ({ x: p_[0], y: p_[1], label: labs[i], color: C.primary })), labelEvery: 2, size: 280 })}Which point is an outlier?`, labs[k], labs.filter((_, i) => i !== k), `Point ${b(labs[k])} lies far from the trend of the others.`, 4);
    }
    if (/line of best fit/.test(t)) { const x = ri(6, 9), line = { m: fix(mm, 1), b: fix(bb, 1) }; return num(`${scatter(pts, line)}A line of best fit is y = ${line.m}x + ${line.b}. Predict y when x = ${b(x)}. (round to 1 decimal)`, fix(line.m * x + line.b, 1), `${line.m}(${x}) + ${line.b} = ${b(fix(line.m * x + line.b, 1))}.`); }
    return mc(`${scatter(pts)}Which describes the association between x and y?`, mm > 0 ? 'Positive' : 'Negative', [mm > 0 ? 'Negative' : 'Positive', 'None'], `As x increases, y ${mm > 0 ? 'increases' : 'decreases'}.`, 3);
  }),
  R(/^Match correlation coefficients to scatter plots$|^Calculate correlation coefficients$/, (mt, ctx) => () => {
    const pts = pts5(), { r } = regress(pts);
    if (/Calculate/.test(ctx.title)) return num(`${table(['x', ...pts.map(p => p[0])], [['y', ...pts.map(p => p[1])]])}Calculate the correlation coefficient r. (round to 2 decimals)`, fix(r, 2), `r ≈ ${b(fix(r, 2))}.`);
    const q = pick([['a strong positive linear trend', 'r ≈ 0.95'], ['a strong negative linear trend', 'r ≈ −0.95'], ['no linear trend', 'r ≈ 0']]); return mc(`Which correlation coefficient matches ${b(q[0])}?`, q[1], ['r ≈ 0.95', 'r ≈ −0.95', 'r ≈ 0'].filter(v_ => v_ !== q[1]), `${q[1]} fits.`, 3);
  }),
  R(/^Find the equation of a regression line$|^Interpret regression lines$|^Analyze a regression line(?: of a data set| using statistics of a data set)$/, (mt, ctx) => () => {
    const pts = pts5(), { m: mm, b: bb } = regress(pts), t = ctx.title;
    if (/Find the equation/.test(t)) return num(`${table(['x', ...pts.map(p => p[0])], [['y', ...pts.map(p => p[1])]])}The least-squares line is y = mx + b. What is the slope m? (round to 2 decimals)`, fix(mm, 2), `m = Sxy / Sxx ≈ ${b(fix(mm, 2))}.`);
    if (/Interpret/.test(t)) { const sl = ri(2, 9), ic = ri(10, 50); return mc(`A regression line predicts test score = ${sl}(hours studied) + ${ic}. What does the slope ${b(sl)} mean?`, `Each extra hour of study is associated with ${sl} more points`, [`A student who studies 0 hours scores ${sl}`, `The average score is ${sl}`, `Each point is worth ${sl} hours`], 'The slope is the predicted change in y per unit of x.', 4); }
    return num(`${table(['x', ...pts.map(p => p[0])], [['y', ...pts.map(p => p[1])]])}Using the least-squares line, predict y when x = ${b(7)}. (round to 1 decimal)`, fix(mm * 7 + bb, 1), `y = ${fix(mm, 2)}(7) + ${fix(bb, 2)} ≈ ${b(fix(mm * 7 + bb, 1))}.`);
  }),
  R(/^Mean absolute deviation$/, () => () => {
    const a = vals(5, 2, 12), mean = meanOf(a), mad = meanOf(a.map(x => Math.abs(x - mean)));
    return num(`${m(a.join(', '))}<br>Find the mean absolute deviation. (round to 2 decimals)`, fix(mad, 2), `Mean = ${fix(mean, 2)}; average of |x − mean| = ${b(fix(mad, 2))}.`);
  }),
  R(/^Variance and standard deviation$/, () => () => {
    const a = vals(5, 2, 12), v_ = sum(a.map(x => (x - meanOf(a)) ** 2)) / a.length;
    return num(`${m(a.join(', '))}<br>Find the population standard deviation. (round to 2 decimals)`, fix(Math.sqrt(v_), 2), `σ² = ${fix(v_, 3)}, so σ ≈ ${b(fix(Math.sqrt(v_), 2))}.`);
  }),
  R(/^Find confidence intervals for population means$|^Find confidence intervals for population proportions$|^Interpret confidence intervals for population means$/, (mt, ctx) => () => {
    const t = ctx.title, z = pick([1.645, 1.96, 2.576]), lvl = z === 1.645 ? 90 : z === 1.96 ? 95 : 99;
    if (/Interpret/.test(t)) return mc(`A ${lvl}% confidence interval for a population mean is (48, 56). Which statement is correct?`, `We are ${lvl}% confident the true mean is between 48 and 56`, [`${lvl}% of the data lie between 48 and 56`, `The sample mean is somewhere between 48 and 56 with probability ${lvl}%`, `The true mean equals 52 exactly`], 'It is a statement about the population mean.', 4);
    if (/proportions/.test(t)) { const n = pick([100, 400, 900]), p = pick([0.3, 0.4, 0.5, 0.6]), me = z * Math.sqrt((p * (1 - p)) / n); return num(`In a sample of ${b(n)}, the sample proportion is ${b(p)}. What is the margin of error for a ${b(lvl + '%')} confidence interval (z = ${z})? (round to 3 decimals)`, fix(me, 3), `z√(p(1−p)/n) ≈ ${b(fix(me, 3))}.`); }
    const n = pick([16, 25, 36, 100]), sg = pick([5, 10, 15]), me = z * sg / Math.sqrt(n); return num(`A sample of ${b(n)} has σ = ${b(sg)}. What is the margin of error for a ${b(lvl + '%')} confidence interval for the mean (z = ${z})? (round to 2 decimals)`, fix(me, 2), `z·σ/√n = ${z} × ${sg}/${Math.sqrt(n)} ≈ ${b(fix(me, 2))}.`);
  }),

  /* ===== sets ===== */
  R(/^Sets, subsets and complements$|^Set-builder notation$|^Unions and intersections of sets$/, (mt, ctx) => () => {
    const U = range(1, 10), A = sample(U, ri(3, 5)).sort((x, y) => x - y), B_ = sample(U, ri(3, 5)).sort((x, y) => x - y), t = ctx.title, set_ = a => `{${a.join(', ')}}`;
    if (/Set-builder/.test(t)) { const k = ri(2, 6); const els = range(1, 12).filter(x => x > k && x < k + 5); return mc(`Which is the set ${b(set_(els))} written in set-builder notation?`, `{x | x is an integer, ${k} < x < ${k + 5}}`, [`{x | x is an integer, ${k} ≤ x ≤ ${k + 5}}`, `{x | x > ${k}}`, `{x | x < ${k + 5}}`], `The integers strictly between ${k} and ${k + 5}.`, 4); }
    if (/Unions/.test(t)) { const un = uniq([...A, ...B_]).sort((x, y) => x - y), it = A.filter(x => B_.includes(x)), which = pick(['union', 'intersection']), ans = which === 'union' ? un : it; if (un.length === it.length || un.length === A.length || un.length === B_.length || !it.length) return null; return mc(`A = ${set_(A)} and B = ${set_(B_)}. Find the ${b(which)} of A and B${which === 'union' ? ' (A ∪ B)' : ' (A ∩ B)'}.`, ans.length ? set_(ans) : '∅ (empty set)', [which === 'union' ? set_(it) : set_(un), set_(A), set_(B_)].filter(v_ => v_ !== set_(ans)), `${which === 'union' ? 'All elements in A or B' : 'Elements in both A and B'}.`, 4); }
    const comp = U.filter(x => !A.includes(x)); return mc(`The universal set is U = {1, …, 10} and A = ${set_(A)}. What is the complement A′?`, set_(comp), [set_(A), set_(comp.slice(1)), set_([...comp, 0])], `A′ contains the elements of U not in A.`, 4);
  })
];
