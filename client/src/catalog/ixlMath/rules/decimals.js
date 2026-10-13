/* Decimals (Grades 3–5): place value, comparing, rounding, conversions, operations, powers of ten. */
import {
  ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, dec, num, mc, yesNo, near, svg, C, NAMES, thing, gcd, words, numberLine, fracGrid, big, PLACES
} from '../h.js';
import { R } from '../engine.js';
import { stack, fs, simp, cmpSym, mixedStr } from './fractions.js';

/* ---------- number formatting ---------- */
const DEC_PLACES = ['tenths', 'hundredths', 'thousandths'];
/** a decimal with exactly `p` places (p = 1..3), last digit non-zero, optional whole part */
const rd = (p, { whole = ri(0, 9), allowZeroWhole = true } = {}) => {
  let frac = ri(1, 10 ** p - 1); while (frac % 10 === 0) frac = ri(1, 10 ** p - 1);
  const x = fix(whole + frac / 10 ** p, p); return x;
};
const dfmt = (x, p) => dec(x, p);
const placesOf = title => (/thousandths/.test(title) ? 3 : /hundredths/.test(title) ? 2 : /tenths/.test(title) ? 1 : null);
const defaultPlaces = (grade, title) => placesOf(title) ?? (grade <= 3 ? pick([1, 2]) : grade === 4 ? pick([1, 2]) : pick([2, 3]));
const decWords = x => { const [i, f] = dfmt(x, String(x).split('.')[1]?.length || 1).split('.'), p = f.length, n = parseInt(f, 10); return `${+i ? words(+i) + ' and ' : ''}${words(n)} ${DEC_PLACES[p - 1]}`; };
const placeName = (x, i) => DEC_PLACES[i];
const decPlaces = x => (String(x).split('.')[1] || '').length;

/* ---------- pictures ---------- */
const decGrid = x => {            // 10×10 grid with 100x squares shaded (x ≤ 1)
  const filled = Math.round(x * 100); let inner = '';
  for (let i = 0; i < 100; i++) { const col = Math.floor(i / 10), row = i % 10; inner += `<rect x="${2 + col * 14}" y="${2 + row * 14}" width="14" height="14" fill="${i < filled ? C.primary : '#fff'}" stroke="${C.grey}" stroke-width="1"/>`; }
  return svg(144, 144, inner, 'aria-label="hundredths grid"');
};
const tenthsBar = x => { const k = Math.round(x * 10); let inner = ''; for (let i = 0; i < 10; i++) inner += `<rect x="${2 + i * 28}" y="2" width="28" height="30" fill="${i < k ? C.primary : '#fff'}" stroke="${C.ink}" stroke-width="2"/>`; return svg(284, 34, inner, 'aria-label="tenths bar"'); };
const decLine = ({ lo = 0, hi = 1, step = 0.1, marks = [], width = 460 }) => numberLine({ min: lo, max: hi, step, labelEvery: step === 0.01 ? 10 : 1, marks, width, fmtLabel: x => fix(x, 3).toString() });

/* ---------- operations helpers ---------- */
const randDecPair = (p, { sumMax = null } = {}) => { const a = rd(p, { whole: ri(0, 9) }), c = rd(p, { whole: ri(0, 9) }); return [a, c]; };
const opText = (a, c, sym, p) => `${dfmt(a, p)} ${sym} ${dfmt(c, p)}`;
const needP = (a, c) => Math.max(decPlaces(a), decPlaces(c));

export const DECIMAL_RULES = [
  /* ===== place value ===== */
  R(/^What decimal number is illustrated\?$|^Model decimals and fractions(?:: up to (?:tenths|hundredths))?$/, (mt, ctx) => () => {
    const p = defaultPlaces(ctx.grade, ctx.title), x = p === 1 ? ri(1, 9) / 10 : ri(1, 99) / 100, fracStr = p === 1 ? fs(Math.round(x * 10), 10) : fs(Math.round(x * 100), 100);
    if (/Model decimals and fractions/.test(ctx.title)) return mc(`${p === 1 ? tenthsBar(x) : decGrid(x)}Which pair of a fraction and a decimal matches the shaded part?`, `${fracStr} and ${dfmt(x, p)}`, [`${fracStr} and ${dfmt(x / 10, p + 1)}`, `${fs(10 - Math.round(x * 10), 10)} and ${dfmt(1 - x, p)}`, `${fracStr} and ${dfmt(x * 10 % 10 || 0.5, p)}`].filter(v => v !== `${fracStr} and ${dfmt(x, p)}`), `The shaded part is ${fracStr} = ${b(dfmt(x, p))}.`, 4);
    return mc(`${p === 1 ? tenthsBar(x) : decGrid(x)}What decimal number does the shaded part show?`, dfmt(x, p), uniq([dfmt(x / 10, p + 1).replace(/0+$/, ''), dfmt(1 - x, p), dfmt(x * 10, p)].filter(v => +v < 1.001)).filter(v => v !== dfmt(x, p)).concat(['0.5', '0.25']).filter(v => v !== dfmt(x, p)).slice(0, 3), `${p === 1 ? Math.round(x * 10) + ' of 10' : Math.round(x * 100) + ' of 100'} parts are shaded: ${b(dfmt(x, p))}.`, 4);
  }),
  R(/^Understanding decimals expressed in words(?:: up to (?:tenths|hundredths|thousandths))?$/, (mt, ctx) => () => {
    const p = defaultPlaces(ctx.grade, ctx.title), x = rd(p, { whole: ri(0, 9) }), w = decWords(x), alts = [rd(p), rd(p), fix(x * 10, p)].map(v => dfmt(v, p)).filter(v => v !== dfmt(x, p));
    return Math.random() < 0.5 ? mc(`Which decimal is ${b(w)}?`, dfmt(x, p), alts, `${w} = ${b(dfmt(x, p))}.`) : mc(`Write ${b(dfmt(x, p))} in words.`, w, uniq([decWords(rd(p)), decWords(rd(p, { whole: 0 })), decWords(fix(x + 1, p))]).filter(v => v !== w), `${dfmt(x, p)} is ${b(w)}.`);
  }),
  R(/^Place values in decimal numbers(?:: up to (?:tenths|hundredths|thousandths)| up to (?:hundredths|thousandths))?$/, (mt, ctx) => () => {
    const p = defaultPlaces(ctx.grade, ctx.title), x = rd(p, { whole: ri(1, 9) }), s = dfmt(x, p), frac = s.split('.')[1], k = ri(0, p - 1), digit = frac[k];
    if (frac.split(digit).length - 1 > 1 || s.split('.')[0] === digit) return null;
    return mc(`In ${b(s)}, which place is the digit ${b(digit)} in?`, DEC_PLACES[k], DEC_PLACES.slice(0, Math.max(p, 2)).concat(['ones']).filter(v => v !== DEC_PLACES[k]).slice(0, 3), `The ${digit} is ${k + 1} place${k ? 's' : ''} after the decimal point: the ${b(DEC_PLACES[k])} place.`, 4);
  }),
  R(/^Relationship between decimal place values$/, () => () => {
    const [big_, small] = pick([['ones', 'tenths'], ['tenths', 'hundredths'], ['hundredths', 'thousandths']]);
    return num(`How many ${small} make 1 ${big_.replace(/s$/, '')}?`, 10, `Each place is 10 times the place to its right: ${b(10)}.`);
  }),
  R(/^Expanded form of decimals(?: up to (?:hundredths|thousandths))?$/, (mt, ctx) => () => {
    const p = defaultPlaces(ctx.grade, ctx.title), x = rd(p, { whole: ri(1, 9) }), s = dfmt(x, p), [i, f] = s.split('.');
    const parts = [`${i}`, ...f.split('').map((d, k) => (d === '0' ? null : fmt(fix(+d / 10 ** (k + 1), k + 1)).replace(/^/, '')))].filter(Boolean);
    const exp = [i, ...f.split('').map((d, k) => (d === '0' ? null : dfmt(+d / 10 ** (k + 1), k + 1)))].filter(Boolean).join(' + ');
    const wrong = [[i, ...f.split('').reverse().map((d, k) => (d === '0' ? null : dfmt(+d / 10 ** (k + 1), k + 1)))].filter(Boolean).join(' + '), [i, ...f.split('').map((d, k) => (d === '0' ? null : dfmt(+d / 10 ** k, Math.max(k, 1))))].filter(Boolean).join(' + ')].filter(v => v !== exp);
    return mc(`Which is the expanded form of ${b(s)}?`, exp, uniq(wrong.concat([`${i} + ${dfmt(+('0.' + f) + 0.1, p)}`])), `Each digit keeps its place value: ${b(exp)}.`);
  }),
  R(/^Convert decimals between standard and expanded form using fractions(?:: up to (?:tenths|hundredths|thousandths))?$/, (mt, ctx) => () => {
    const p = defaultPlaces(ctx.grade, ctx.title), x = rd(p, { whole: ri(1, 9) }), s = dfmt(x, p), [i, f] = s.split('.');
    const exp = [i, ...f.split('').map((d, k) => (d === '0' ? null : fs(+d, 10 ** (k + 1))))].filter(Boolean).join(' + ');
    const alt1 = [i, ...f.split('').map((d, k) => (d === '0' ? null : fs(+d, 10 ** k || 1)))].filter(Boolean).join(' + ');
    const alt2 = [i, ...f.split('').map((d, k) => (d === '0' ? null : fs(+d, 10 ** (k + 2))))].filter(Boolean).join(' + ');
    return mc(`Write ${b(s)} in expanded form using fractions.`, exp, uniq([alt1, alt2, [i, ...f.split('').reverse().map((d, k) => (d === '0' ? null : fs(+d, 10 ** (k + 1))))].filter(Boolean).join(' + ')]).filter(v => v !== exp), `${exp} = ${b(s)}.`);
  }),
  R(/^Compose and decompose decimals in multiple ways$/, () => () => {
    const x = rd(2, { whole: ri(1, 5) }), [i, f] = dfmt(x, 2).split('.'), tens = +f[0], hund = +f[1];
    return num(`${m(`${dfmt(x, 2)} = ${i} + ${tens} tenths + ___ hundredths`)}`, hund, `${f} hundredths = ${tens} tenths and ${hund} hundredths: ${b(hund)}.`);
  }),
  R(/^One-tenth or one-hundredth more or less$/, () => () => {
    const p = pick([1, 2]), x = rd(2, { whole: ri(1, 9) }), step = p === 1 ? 0.1 : 0.01, more = Math.random() < 0.5, ans = fix(x + (more ? step : -step), 2);
    return num(`What is ${b(p === 1 ? 'one tenth' : 'one hundredth')} ${more ? 'more' : 'less'} than ${b(dfmt(x, 2))}?`, ans, `${dfmt(x, 2)} ${more ? '+' : '−'} ${step} = ${b(dfmt(ans, 2))}.`);
  }),

  /* ===== equivalent, compare, order, round ===== */
  R(/^Equivalent decimals(?:: up to (?:hundredths)| up to (?:hundredths|thousandths))?$/, (mt, ctx) => () => {
    const p = ctx.grade <= 4 ? (placesOf(ctx.title) || 2) : (placesOf(ctx.title) || 3), base = rd(Math.max(1, p - 1), { whole: ri(0, 9) });
    const z = dfmt(base, p), same = Math.random() < 0.5, shown = same ? z : dfmt(fix(base + pick([0.01, 0.1, -0.01]), p), p);
    return yesNo(`Are ${b(dfmt(base, decPlaces(base)))} and ${b(shown)} equal?`, same || +shown === base, same ? `Adding zeros at the end does not change the value: ${dfmt(base, decPlaces(base))} = ${z}.` : `${dfmt(base, decPlaces(base))} and ${shown} are different numbers.`, ['Yes', 'No']);
  }),
  R(/^Compare decimals using (?:grids|models)(?:: up to hundredths)?$/, (mt, ctx) => () => {
    const hund = /hundredths/.test(ctx.title) || /grids/.test(ctx.title) || ctx.grade >= 4, a = hund ? ri(5, 95) / 100 : ri(1, 9) / 10, c = hund ? ri(5, 95) / 100 : ri(1, 9) / 10; if (a === c) return null;
    const p = hund ? 2 : 1, pic = x => (hund ? decGrid(x) : tenthsBar(x));
    return mc(`<div style="display:flex;gap:16px;flex-wrap:wrap"><div><b>A</b>${pic(a)}</div><div><b>B</b>${pic(c)}</div></div>Compare. ${m(`${dfmt(a, p)} ___ ${dfmt(c, p)}`)}`, cmpSym(a, c), ['<', '>', '='].filter(v => v !== cmpSym(a, c)), `${dfmt(a, p)} ${cmpSym(a, c)} ${dfmt(c, p)}.`, 3);
  }),
  R(/^Compare decimals on number lines(?:: up to (?:tenths|hundredths))?$/, (mt, ctx) => () => {
    const p = ctx.grade <= 3 ? 1 : (placesOf(ctx.title) || pick([1, 2])), step = p === 1 ? 0.1 : 0.01, lo = p === 1 ? ri(0, 5) : ri(0, 5) / 10, hi = fix(lo + (p === 1 ? 1 : 0.1), 2);
    const a = fix(lo + step * ri(1, 9), 3), c = fix(lo + step * ri(1, 9), 3); if (a === c) return null;
    return mc(`${decLine({ lo, hi, step: p === 1 ? 0.1 : 0.01, marks: [{ v: a, label: 'A', color: C.red }, { v: c, label: 'B', color: C.blue }] })}Which is true?`, `A ${cmpSym(a, c)} B`, ['A > B', 'A < B', 'A = B'].filter(v => v !== `A ${cmpSym(a, c)} B`), `${dfmt(a, p + (hi < 1 ? 1 : 0))} vs ${dfmt(c, p + (hi < 1 ? 1 : 0))}: A ${cmpSym(a, c)} B.`, 3);
  }),
  R(/^Compare decimal numbers(?:: up to (?:tenths|hundredths|thousandths)| up to (?:hundredths|thousandths))?$/, (mt, ctx) => () => {
    const p = defaultPlaces(ctx.grade, ctx.title), a = rd(p, { whole: ri(0, 9) }); let c = Math.random() < 0.5 ? fix(a + pick([-0.1, 0.1, 0.01, -0.01, 0.001, -0.001]) * (p === 1 ? 10 : 1), p) : rd(p, { whole: ri(0, 9) }); if (c < 0) return null;
    if (Math.random() < 0.15) c = a; const pp = Math.max(decPlaces(a), decPlaces(c), p), sym = cmpSym(a, c);
    return mc(`Compare. ${m(`${dfmt(a, pp)} ___ ${dfmt(c, pp)}`)}`, sym, ['<', '>', '='].filter(v => v !== sym), `Compare digit by digit from the left: ${dfmt(a, pp)} ${sym} ${dfmt(c, pp)}.`, 3);
  }),
  R(/^Put decimal numbers(?: up to hundredths)? in order(?: I| II)?(?:: up to (?:tenths|hundredths))?$|^Put decimals in order(?:: up to (?:hundredths|thousandths))?$/, (mt, ctx) => () => {
    const p = defaultPlaces(ctx.grade, ctx.title), vals = uniq(Array.from({ length: 4 }, () => rd(p, { whole: ri(0, 3) }))); if (vals.length < 4) return null;
    const asc = Math.random() < 0.5, sorted = vals.slice().sort((x, y) => (asc ? x - y : y - x)), key = a => a.map(v => dfmt(v, p)).join(', ');
    const wrongs = uniq([shuffle(sorted), shuffle(sorted), sorted.slice().reverse()].map(key)).filter(v => v !== key(sorted));
    return mc(`Order from ${b(asc ? 'least to greatest' : 'greatest to least')}:<br>${m(key(vals))}`, key(sorted), wrongs, `${b(key(sorted))}.`);
  }),
  R(/^Put assorted decimals and fractions in order(?:: up to (?:hundredths|thousandths))?$/, (mt, ctx) => () => {
    const items = [], used = new Set(); const mk = () => { if (Math.random() < 0.5) { const d = pick([2, 4, 5, 10, 20, 25]), n = ri(1, d - 1); return { s: fs(n, d), v: n / d }; } const x = ri(1, 99) / 100; return { s: dfmt(x, 2), v: x }; };
    while (items.length < 3) { const it = mk(); if (!used.has(it.v)) { used.add(it.v); items.push(it); } }
    const sorted = items.slice().sort((x, y) => x.v - y.v), key = a => a.map(i => i.s).join(', ');
    return mc(`Order from ${b('least to greatest')}:<br>${m(items.map(i => i.s).join(', '))}`, key(sorted), uniq([shuffle(sorted), shuffle(sorted), sorted.slice().reverse()].map(key)).filter(v => v !== key(sorted)), `As decimals: ${sorted.map(i => `${i.s} = ${fix(i.v, 3)}`).join(', ')}. Order: ${b(key(sorted))}.`);
  }),
  R(/^Round decimals(?: to the nearest whole number(?: or tenth|, tenth or hundredth))?(?:: up to hundredths)?$/, (mt, ctx) => () => {
    const lvl = /hundredth/.test(ctx.title) ? pick(['whole number', 'tenth', 'hundredth']) : /tenth/.test(ctx.title) ? pick(['whole number', 'tenth']) : ctx.grade >= 4 ? pick(['whole number', 'tenth']) : 'whole number';
    const p = lvl === 'hundredth' ? 3 : lvl === 'tenth' ? 2 : pick([1, 2]), x = rd(p, { whole: ri(1, 99) }), dp = lvl === 'whole number' ? 0 : lvl === 'tenth' ? 1 : 2, ans = fix(Math.round(x * 10 ** dp) / 10 ** dp, dp);
    return num(`Round ${b(dfmt(x, p))} to the nearest ${b(lvl)}.`, ans, `Look at the digit to the right of the ${lvl} place: ${b(dfmt(ans, dp))}.`);
  }),
  R(/^Compare, order and round decimals: word problems$/, () => () => {
    const [x, y, z] = sample(NAMES, 3), v = uniq([rd(2, { whole: ri(5, 12) }), rd(2, { whole: ri(5, 12) }), rd(2, { whole: ri(5, 12) })]); if (v.length < 3) return null;
    const mx = Math.max(...v), nms = [x, y, z];
    return mc(`${x} ran ${dfmt(v[0], 2)} km, ${y} ran ${dfmt(v[1], 2)} km and ${z} ran ${dfmt(v[2], 2)} km. Who ran the farthest?`, nms[v.indexOf(mx)], nms.filter(n => n !== nms[v.indexOf(mx)]), `${dfmt(mx, 2)} is the greatest.`, 3);
  }),
  R(/^Number sequences involving decimals(?:: up to (?:tenths|hundredths))?$/, (mt, ctx) => () => {
    const p = placesOf(ctx.title) || pick([1, 2]), step = p === 1 ? pick([0.1, 0.2, 0.3, 0.5]) : pick([0.01, 0.02, 0.05, 0.25]), start = rd(p, { whole: ri(0, 5) }), seq = range(0, 3).map(i => fix(start + i * step, 2)), nxt = fix(start + 4 * step, 2), pp = Math.max(p, decPlaces(step));
    return num(`What comes next? ${m(seq.map(v => dfmt(v, pp)).join(', ') + ', ___')}`, nxt, `Add ${dfmt(step, pp)} each time: ${b(dfmt(nxt, pp))}.`);
  }),

  /* ===== number lines & conversions ===== */
  R(/^Decimal number lines(?:: up to (?:tenths|hundredths))?$|^Graph decimals on number lines(?:: up to (?:tenths|hundredths))?$/, (mt, ctx) => () => {
    const p = ctx.grade <= 3 ? 1 : (placesOf(ctx.title) || pick([1, 2])), x = p === 1 ? ri(1, 9) / 10 : ri(1, 9) / 10 + ri(1, 9) / 100;
    if (p === 2) { const lo = Math.floor(x * 10) / 10, hi = fix(lo + 0.1, 1), letters = ['A', 'B', 'C', 'D'], vals = sample(range(1, 9).map(k => fix(lo + k / 100, 2)), 4), k = ri(0, 3); return mc(`${decLine({ lo, hi, step: 0.01, marks: vals.map((v, i) => ({ v, label: letters[i], color: C.blue })) })}Which point shows ${b(dfmt(vals[k], 2))}?`, letters[k], letters.filter((_, i) => i !== k), `Count the small ticks: ${b(letters[k])}.`, 4); }
    const vals = sample(range(1, 9).map(v => v / 10), 4), letters = ['A', 'B', 'C', 'D'], k = ri(0, 3);
    if (/Graph/.test(ctx.title)) return mc(`${decLine({ lo: 0, hi: 1, step: 0.1, marks: vals.map((v, i) => ({ v, label: letters[i], color: C.blue })) })}Which point shows ${b(dfmt(vals[k], 1))}?`, letters[k], letters.filter((_, i) => i !== k), `Count the ticks from 0: point ${b(letters[k])}.`, 4);
    return mc(`${decLine({ lo: 0, hi: 1, step: 0.1, marks: [{ v: vals[k], label: '●' }] })}What decimal does the point show?`, dfmt(vals[k], 1), near(vals[k] * 10, 5, 3, { min: 1 }).filter(v => v < 10).map(v => dfmt(v / 10, 1)), `The point is at ${b(dfmt(vals[k], 1))}.`, 4);
  }),
  R(/^Graph fractions as decimals on number lines(?:: up to (?:tenths|hundredths))?$/, (mt, ctx) => () => {
    const p = placesOf(ctx.title) || (ctx.grade <= 3 ? 1 : pick([1, 2])), d = p === 1 ? 10 : pick([4, 5, 20, 25, 50]), n = ri(1, d - 1), x = n / d;
    const letters = ['A', 'B', 'C', 'D'], vals = uniq([x, ...sample(range(1, 9).map(v => v / 10), 5)]).slice(0, 4), k = vals.indexOf(x);
    const decs = vals.map(v => dfmt(v, 2).replace(/0$/, '')), ans = letters[k];
    return mc(`${decLine({ lo: 0, hi: 1, step: 0.1, marks: vals.map((v, i) => ({ v, label: letters[i], color: C.blue })) })}Which point shows the decimal equal to ${m(stack(n, d))}?`, ans, letters.slice(0, vals.length).filter(v => v !== ans), `${fs(n, d)} = ${b(fix(x, 3))}: point ${b(ans)}.`, 4);
  }),
  R(/^Convert fractions to decimals(?:: (?:denominators of 10 and 100|up to (?:tenths|hundredths|thousandths)))?$/, (mt, ctx) => () => {
    const t = ctx.title, p = /tenths/.test(t) ? 1 : /thousandths/.test(t) ? 3 : /hundredths|10 and 100/.test(t) ? 2 : pick([1, 2]), d = 10 ** p, n = ri(1, d - 1), x = n / d;
    return mc(`Write ${m(stack(n, d))} as a decimal.`, dfmt(x, p), uniq([dfmt(n / (d * 10), p + 1), dfmt(n / (d / 10 || 1), p), dfmt(1 - x, p)]).filter(v => v !== dfmt(x, p) && +v >= 0), `${n}/${d} = ${b(dfmt(x, p))}.`);
  }),
  R(/^Convert decimals to fractions(?:: up to (?:tenths|hundredths|thousandths))?$/, (mt, ctx) => () => {
    const t = ctx.title, p = /tenths/.test(t) ? 1 : /thousandths/.test(t) ? 3 : /hundredths/.test(t) ? 2 : pick([1, 2]), d = 10 ** p, n = ri(1, d - 1), x = n / d;
    return mc(`Write ${b(dfmt(x, p))} as a fraction (not simplified).`, fs(n, d), uniq([fs(n, d * 10), fs(n, d / 10 || 10), fs(n + 1, d)]).filter(v => v !== fs(n, d)), `${dfmt(x, p)} = ${b(fs(n, d))}.`);
  }),
  R(/^Convert between decimals and fractions$/, (mt, ctx) => () => {
    const d = pick([2, 4, 5, 10, 20, 25, 50, 100]), n = ri(1, d - 1), x = n / d, [sn, sd] = simp(n, d);
    return Math.random() < 0.5 ? mc(`Write ${m(stack(n, d))} as a decimal.`, String(fix(x, 4)), uniq([String(fix(n / (d * 10), 5)), String(fix(1 - x, 4)), String(fix(x * 10, 4))]).filter(v => v !== String(fix(x, 4))), `${n} ÷ ${d} = ${b(fix(x, 4))}.`) : mc(`Write ${b(String(fix(x, 4)))} as a fraction in lowest terms.`, fs(sn, sd), uniq([fs(n + 1, d), fs(n, d * 10), fs(sd, sn)]).filter(v => v !== fs(sn, sd)), `${fix(x, 4)} = ${b(fs(sn, sd))}.`);
  }),
  R(/^Compare decimals and fractions(?: on number lines)?(?:: up to (?:tenths|hundredths|thousandths))?$/, (mt, ctx) => () => {
    const d = pick([2, 4, 5, 8, 10, 20, 25]), n = ri(1, d - 1), x = n / d, y = rd(placesOf(ctx.title) || 2, { whole: 0 }); if (fix(x, 6) === y && Math.random() < 0.7) return null;
    const s = cmpSym(fix(x, 6), fix(y, 6));
    return mc(`Compare. ${m(`${stack(n, d)} ___ ${dfmt(y, decPlaces(y))}`)}`, s, ['<', '>', '='].filter(v => v !== s), `${fs(n, d)} = ${fix(x, 4)}, and ${fix(x, 4)} ${s} ${dfmt(y, decPlaces(y))}.`, 3);
  }),

  /* ===== add & subtract decimals ===== */
  R(/^(?:Add|Subtract|Add and subtract) decimal numbers(?:: | )?(?:up to (?:tenths|hundredths|thousandths))?(?: using blocks)?$|^Add and subtract decimals(?: up to (?:tenths|hundredths|thousandths))?$|^Add three or more decimals?(?: numbers)?(?:: up to (?:tenths|hundredths))?$|^Use properties to add three decimals up to hundredths$|^Use compensation to add and subtract decimals up to hundredths$/, (mt, ctx) => () => {
    const t = ctx.title, p = defaultPlaces(ctx.grade, t), three = /three/.test(t), sub = /^Subtract/.test(t) || (/and subtract/.test(t) && Math.random() < 0.5);
    if (three) { const xs = [rd(p, { whole: ri(0, 9) }), rd(p, { whole: ri(0, 9) }), rd(p, { whole: ri(0, 9) })], tot = fix(sum(xs), p); return num(`${m(xs.map(v => dfmt(v, p)).join(' + ') + ' = ?')}`, tot, `Line up the decimal points and add: ${b(dfmt(tot, p))}.`); }
    let [a, c] = [rd(p, { whole: ri(1, 12) }), rd(p, { whole: ri(0, 10) })]; if (sub && c > a) [a, c] = [c, a];
    const r = fix(sub ? a - c : a + c, p);
    return num(`${m(`${dfmt(a, p)} ${sub ? '−' : '+'} ${dfmt(c, p)} = ?`)}`, r, `Line up the decimal points: ${dfmt(a, p)} ${sub ? '−' : '+'} ${dfmt(c, p)} = ${b(dfmt(r, p))}.`);
  }),
  R(/^Add decimal numbers(?: up to hundredths)? using blocks$/, () => () => {
    const a = ri(11, 99) / 100, c = ri(11, 99) / 100, r = fix(a + c, 2); return num(`Using hundredths blocks: ${dfmt(a, 2)} + ${dfmt(c, 2)} = ?`, r, `${Math.round(a * 100)} + ${Math.round(c * 100)} hundredths = ${b(dfmt(r, 2))}.`);
  }),
  R(/^Add and subtract decimals(?: up to (?:tenths|hundredths|thousandths))?: word problems$|^Add and subtract decimals - word problems$|^Add three or more decimals(?: up to (?:tenths|hundredths))?: word problems$|^Add, subtract, multiply and divide decimals(?:: (?:multi-step )?word problems)?$/, (mt, ctx) => () => {
    const t = ctx.title, p = defaultPlaces(ctx.grade, t), nm = pick(NAMES), mixed = /multiply and divide/.test(t);
    const k = mixed ? pick(['add', 'sub', 'mul', 'div']) : /three/.test(t) ? 'add3' : pick(['add', 'sub']);
    if (!/word|multi-step/.test(t) && mixed) { const a = rd(1, { whole: ri(1, 9) }), c = ri(2, 9), op = pick(['+', '−', '×', '÷']), r = op === '+' ? a + c : op === '−' ? a - c : op === '×' ? a * c : a / c; if (op === '÷' && !Number.isInteger(fix(r * 10, 6))) return null; return num(`${m(`${dfmt(a, 1)} ${op} ${c} = ?`)}`, fix(r, 4), `${dfmt(a, 1)} ${op} ${c} = ${b(fix(r, 4))}.`); }
    if (k === 'add3') { const xs = [rd(p, { whole: ri(1, 5) }), rd(p, { whole: ri(1, 5) }), rd(p, { whole: ri(1, 5) })], tot = fix(sum(xs), p); return num(`${nm} buys items that cost $${xs.map(v => dfmt(v, p)).join(', $')}. What is the total cost? ($)`, tot, `${xs.map(v => dfmt(v, p)).join(' + ')} = ${b(dfmt(tot, p))}.`); }
    if (k === 'mul') { const a = rd(2, { whole: ri(1, 5) }), c = ri(2, 9), r = fix(a * c, 2); return num(`${nm} walks ${dfmt(a, 2)} km each day for ${c} days. How far does ${nm} walk in all? (km)`, r, `${dfmt(a, 2)} × ${c} = ${b(dfmt(r, 2))}.`); }
    if (k === 'div') { const c = ri(2, 9), a = rd(2, { whole: ri(1, 5) }), tot = fix(a * c, 2); return num(`${nm} pours ${dfmt(tot, 2)} L of juice equally into ${c} glasses. How much is in each glass? (L)`, a, `${dfmt(tot, 2)} ÷ ${c} = ${b(dfmt(a, 2))}.`); }
    let a = rd(p, { whole: ri(2, 12) }), c = rd(p, { whole: ri(0, 9) }); if (k === 'sub' && c > a) [a, c] = [c, a];
    const r = fix(k === 'add' ? a + c : a - c, p);
    return num(k === 'add' ? `${nm} ran ${dfmt(a, p)} km on Monday and ${dfmt(c, p)} km on Tuesday. How far did ${nm} run in all? (km)` : `A board is ${dfmt(a, p)} m long. ${nm} cuts off ${dfmt(c, p)} m. How long is the board now? (m)`, r, `${dfmt(a, p)} ${k === 'add' ? '+' : '−'} ${dfmt(c, p)} = ${b(dfmt(r, p))}.`);
  }),
  R(/^Choose decimals with a particular sum or difference(?:: up to (?:tenths|hundredths|thousandths))?$|^Identify fraction expressions with a particular sum: denominators of 10 and 100$/, (mt, ctx) => () => {
    const p = defaultPlaces(ctx.grade, ctx.title), sub = Math.random() < 0.4; let a = rd(p, { whole: ri(1, 9) }), c = rd(p, { whole: ri(0, 8) }); if (sub && c > a) [a, c] = [c, a]; const r = fix(sub ? a - c : a + c, p), bad = [];
    for (let i = 0; i < 6 && bad.length < 3; i++) { let x = rd(p, { whole: ri(1, 9) }), y = rd(p, { whole: ri(0, 8) }); if (sub && y > x) [x, y] = [y, x]; if (fix(sub ? x - y : x + y, p) !== r) bad.push(`${dfmt(x, p)} ${sub ? '−' : '+'} ${dfmt(y, p)}`); }
    return mc(`Which expression has a ${sub ? 'difference' : 'sum'} of ${b(dfmt(r, p))}?`, `${dfmt(a, p)} ${sub ? '−' : '+'} ${dfmt(c, p)}`, bad, `${dfmt(a, p)} ${sub ? '−' : '+'} ${dfmt(c, p)} = ${b(dfmt(r, p))}.`, 4);
  }),
  R(/^Complete the (?:decimal )?addition or subtraction sentence(?:: up to (?:tenths|hundredths|thousandths))?$/, (mt, ctx) => () => {
    const p = defaultPlaces(ctx.grade, ctx.title), sub = Math.random() < 0.5; let a = rd(p, { whole: ri(1, 9) }), c = rd(p, { whole: ri(0, 8) }); if (sub && c > a) [a, c] = [c, a];
    const r = fix(sub ? a - c : a + c, p), hide = pick(['b', 'r']);
    return hide === 'r' ? num(`${m(`${dfmt(a, p)} ${sub ? '−' : '+'} ${dfmt(c, p)} = ___`)}`, r, `${b(dfmt(r, p))}.`) : num(`${m(`${dfmt(a, p)} ${sub ? '−' : '+'} ___ = ${dfmt(r, p)}`)}`, c, `${sub ? `${dfmt(a, p)} − ${dfmt(r, p)}` : `${dfmt(r, p)} − ${dfmt(a, p)}`} = ${b(dfmt(c, p))}.`);
  }),
  R(/^Inequalities with (?:decimal )?(?:addition and subtraction|decimal addition and subtraction|multiplication)(?:: up to (?:tenths|hundredths|thousandths))?$|^Inequalities with decimal addition and subtraction(?:: up to (?:tenths|hundredths|thousandths))?$|^Inequalities with decimal multiplication$/, (mt, ctx) => () => {
    const p = defaultPlaces(ctx.grade, ctx.title), mul = /multiplication/.test(ctx.title);
    let a, c, r; if (mul) { a = rd(1, { whole: ri(1, 9) }); c = pick([0.5, 1.5, 2, 3, 0.1, 0.2]); r = fix(a * c, 3); } else { a = rd(p, { whole: ri(1, 9) }); c = rd(p, { whole: ri(0, 5) }); r = fix(a + c, p); }
    const cmpTo = fix(r + pick([-1, -0.1, 0.1, 1, 0]) , 3), s = cmpSym(r, cmpTo), pp = Math.max(decPlaces(cmpTo), decPlaces(r), p);
    return mc(`Choose the symbol that makes the sentence true.<br>${m(`${dfmt(a, decPlaces(a) || 1)} ${mul ? '×' : '+'} ${dfmt(c, decPlaces(c) || 1)} ___ ${dfmt(cmpTo, pp)}`)}`, s, ['<', '>', '='].filter(v => v !== s), `${dfmt(a, decPlaces(a) || 1)} ${mul ? '×' : '+'} ${dfmt(c, decPlaces(c) || 1)} = ${fix(r, 4)}, and ${fix(r, 4)} ${s} ${dfmt(cmpTo, pp)}.`, 3);
  }),
  R(/^Estimate sums and differences of decimals(?: using (?:rounding|benchmarks))?(?:: up to (?:tenths|hundredths|thousandths))?$/, (mt, ctx) => () => {
    const p = defaultPlaces(ctx.grade, ctx.title), sub = Math.random() < 0.5; let a = rd(p, { whole: ri(2, 30) }), c = rd(p, { whole: ri(1, 20) }); if (sub && c > a) [a, c] = [c, a];
    const A = Math.round(a), C_ = Math.round(c);
    return num(`Estimate by rounding each number to the nearest whole number. ${m(`${dfmt(a, p)} ${sub ? '−' : '+'} ${dfmt(c, p)}`)}`, sub ? A - C_ : A + C_, `${A} ${sub ? '−' : '+'} ${C_} = ${b(sub ? A - C_ : A + C_)}.`);
  }),
  R(/^Solve decimal problems using diagrams(?:: up to tenths)?$/, () => () => {
    const a = rd(1, { whole: ri(1, 6) }), c = rd(1, { whole: ri(1, 5) }), tot = fix(a + c, 1), nm = pick(NAMES);
    return num(`${nm}'s two ribbons are ${dfmt(a, 1)} m and ${dfmt(c, 1)} m long. A bar model shows the total as the two parts joined. How long are they in all? (m)`, tot, `${dfmt(a, 1)} + ${dfmt(c, 1)} = ${b(dfmt(tot, 1))}.`);
  }),

  /* ===== multiply & divide decimals ===== */
  R(/^Multiply a (?:whole number|decimal) by (?:a power of ten|0\.1 or 0\.01)(?:: with exponents)?$|^Multiply a decimal by a power of ten(?:: with exponents)?$|^Multiply a whole number by 0\.1 or 0\.01$|^Multiply by a power of ten with decimals: find the missing number$/, (mt, ctx) => () => {
    const t = ctx.title, x = rd(pick([1, 2]), { whole: ri(1, 9) }), k = pick([10, 100, 1000]), exp = Math.log10(k);
    if (/0\.1 or 0\.01/.test(t)) { const n = ri(2, 99) * 10, f = pick([0.1, 0.01]); return num(`${m(`${n} × ${f} = ?`)}`, fix(n * f, 4), `Multiplying by ${f} moves the decimal point ${f === 0.1 ? 1 : 2} place${f === 0.1 ? '' : 's'} left: ${b(fix(n * f, 4))}.`); }
    if (/missing/.test(t)) return num(`${m(`${dfmt(x, decPlaces(x))} × ___ = ${fix(x * k, 4)}`)}`, k, `The decimal point moved ${exp} place${exp > 1 ? 's' : ''} right, so multiply by ${b(fmt(k))}.`);
    const showK = /exponents/.test(t) ? `10<sup>${exp}</sup>` : fmt(k);
    return num(`${m(`${dfmt(x, decPlaces(x))} × ${showK} = ?`)}`, fix(x * k, 5), `Move the decimal point ${exp} place${exp > 1 ? 's' : ''} to the right: ${b(fix(x * k, 5))}.`);
  }),
  R(/^Divide by (?:a )?powers? of ten(?: with decimals: find the missing number)?$|^Divide by a power of ten with decimals: find the missing number$/, (mt, ctx) => () => {
    const x = pick([rd(1, { whole: ri(10, 99) }), ri(10, 999)]), k = pick([10, 100, 1000]), exp = Math.log10(k);
    if (/missing/.test(ctx.title)) return num(`${m(`${fix(x, 3)} ÷ ___ = ${fix(x / k, 6)}`)}`, k, `The decimal point moved ${exp} place${exp > 1 ? 's' : ''} left: divide by ${b(fmt(k))}.`);
    return num(`${m(`${fix(x, 3)} ÷ ${fmt(k)} = ?`)}`, fix(x / k, 6), `Move the decimal point ${exp} place${exp > 1 ? 's' : ''} to the left: ${b(fix(x / k, 6))}.`);
  }),
  R(/^Decimal division patterns over increasing place values$/, () => () => {
    const a = ri(2, 9), d = pick([2, 4, 5]), q = fix(a / d, 3); if (!Number.isFinite(q)) return null;
    return num(`Look for the pattern.<br>${m(`${a * 10} ÷ ${d * 10} = ${fix(a / d, 3)}`)}<br>${m(`${a * 100} ÷ ${d * 100} = ${fix(a / d, 3)}`)}<br>${m(`${a} ÷ ${d} = ?`)}`, q, `Dividing both numbers by 10 doesn't change the quotient: ${b(q)}.`);
  }),
  R(/^Multiply a decimal by a (?:1|2)-digit whole number(?: using (?:blocks|the distributive property|area models))?$/, (mt, ctx) => () => {
    const two = /2-digit/.test(ctx.title), p = pick([1, 2]), x = rd(p, { whole: ri(0, 9) }), n = two ? ri(11, 49) : ri(2, 9), r = fix(x * n, 5);
    if (/distributive/.test(ctx.title)) { const whole = Math.floor(x), f = fix(x - whole, p); return num(`${m(`${dfmt(x, p)} × ${n} = (${whole} × ${n}) + (${f} × ${n})`)} = ___ + ___ . What is ${m(`${dfmt(x, p)} × ${n}`)}?`, r, `${whole} × ${n} = ${whole * n} and ${f} × ${n} = ${fix(f * n, 4)}. Total ${b(r)}.`); }
    return num(`${m(`${dfmt(x, p)} × ${n} = ?`)}`, r, `Multiply as whole numbers, then place the decimal: ${b(r)}.`);
  }),
  R(/^Multiply decimals and whole numbers: word problems$/, () => () => {
    const x = rd(2, { whole: ri(1, 9) }), n = ri(2, 12), nm = pick(NAMES), r = fix(x * n, 4);
    return num(`${nm} buys ${n} notebooks that each cost $${dfmt(x, 2)}. How much do they cost in all? ($)`, r, `${n} × ${dfmt(x, 2)} = ${b(dfmt(r, 2))}.`);
  }),
  R(/^Estimate products of decimals$/, () => () => {
    const a = rd(1, { whole: ri(2, 9) }), c = rd(1, { whole: ri(2, 9) }), A = Math.round(a), Cc = Math.round(c);
    return num(`Estimate ${m(`${dfmt(a, 1)} × ${dfmt(c, 1)}`)} by rounding each number to the nearest whole number.`, A * Cc, `${A} × ${Cc} = ${b(A * Cc)}.`);
  }),
  R(/^Multiply decimals (?:less than one )?using grids$/, () => () => {
    const a = ri(2, 9) / 10, c = ri(2, 9) / 10, r = fix(a * c, 2);
    return num(`${m(`${dfmt(a, 1)} × ${dfmt(c, 1)}`)} = ? (Think: ${Math.round(a * 10)} × ${Math.round(c * 10)} hundredths)`, r, `${Math.round(a * 10)} × ${Math.round(c * 10)} = ${Math.round(a * 10) * Math.round(c * 10)} hundredths = ${b(dfmt(r, 2))}.`);
  }),
  R(/^Multiply two decimals(?:: where does the decimal point go\?)?$/, (mt, ctx) => () => {
    const a = rd(1, { whole: ri(0, 9) }), c = rd(1, { whole: ri(0, 5) }), r = fix(a * c, 3);
    if (/where/.test(ctx.title)) { const digits = String(Math.round(a * 10) * Math.round(c * 10)); return mc(`${m(`${dfmt(a, 1)} × ${dfmt(c, 1)}`)}. The digits of the product are ${b(digits)}. Where does the decimal point go?`, dfmt(r, 2), uniq([digits, dfmt(+digits / 10, 1), dfmt(+digits / 1000, 3)]).filter(v => v !== dfmt(r, 2)), `Each factor has 1 decimal place, so the product has 2: ${b(dfmt(r, 2))}.`); }
    return num(`${m(`${dfmt(a, 1)} × ${dfmt(c, 1)} = ?`)}`, r, `${Math.round(a * 10)} × ${Math.round(c * 10)} = ${Math.round(a * 10) * Math.round(c * 10)}; two decimal places in total: ${b(dfmt(r, 2))}.`);
  }),
  R(/^Divide decimals(?: by whole numbers)?(?:: word problems)?$|^Divide decimals using (?:blocks|area models): complete the equation$|^Division with decimal quotients and rounding$|^Estimate decimal quotients$|^Divide 4-digit numbers by 2-digit numbers: remainders as decimals$/, (mt, ctx) => () => {
    const t = ctx.title;
    if (/Estimate/.test(t)) { const d = ri(2, 9), q = ri(2, 9), a = d * q + ri(-2, 2) * 0.1; return num(`Estimate ${m(`${fix(d * q + 0.7, 2)} ÷ ${d}`)} to the nearest whole number.`, Math.round((d * q + 0.7) / d), `${fix(d * q + 0.7, 2)} is close to ${d * q + 1}, and ${d * q + 1} ÷ ${d}... about ${b(Math.round((d * q + 0.7) / d))}.`.replace(/ and .* about/, ', so it is about')); }
    if (/rounding/.test(t)) { const a = ri(10, 99), d = pick([3, 6, 7]), q = fix(a / d, 6); return num(`${m(`${a} ÷ ${d}`)} Round the quotient to the nearest ${b('tenth')}.`, fix(Math.round(q * 10) / 10, 1), `${a} ÷ ${d} ≈ ${fix(q, 4)}, which rounds to ${b(fix(Math.round(q * 10) / 10, 1))}.`); }
    if (/remainders as decimals/.test(t)) { const d = pick([12, 16, 20, 24, 25, 32]), a = ri(1000, 9999), q = a / d; if (!Number.isFinite(q) || String(q).split('.')[1]?.length > 3) return null; return num(`${m(`${a} ÷ ${d}`)} Write the answer as a decimal.`, fix(q, 3), `${a} ÷ ${d} = ${b(fix(q, 3))}.`); }
    const d = ri(2, 9), q = rd(pick([1, 2]), { whole: ri(0, 9) }), a = fix(q * d, 4);
    if (/word problems/.test(t)) { const nm = pick(NAMES); return num(`${nm} shares ${dfmt(a, decPlaces(a) || 1)} kg of rice equally among ${d} bags. How much rice is in each bag? (kg)`, q, `${dfmt(a, decPlaces(a) || 1)} ÷ ${d} = ${b(dfmt(q, decPlaces(q) || 1))}.`); }
    return num(`${m(`${dfmt(a, decPlaces(a) || 1)} ÷ ${d} = ?`)}`, q, `${dfmt(a, decPlaces(a) || 1)} ÷ ${d} = ${b(dfmt(q, decPlaces(q) || 1))}.`);
  })
];
export { dfmt, rd, decWords, decGrid, tenthsBar, decLine, decPlaces };
