/* Data & graphs, probability, statistics, Venn diagrams, financial literacy (Grades 1–5). */
import {
  ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, num, mc, yesNo, near, svg, C, thing, NAMES, emojiRow, big,
  barGraph, pictograph, table, tally, linePlot, lineGraph, money, gcd, dec
} from '../h.js';
import { R } from '../engine.js';

const THEMES = [
  ['Favourite fruit', ['Apple', 'Banana', 'Grapes', 'Orange', 'Pear', 'Plum'], '🍎'],
  ['Favourite pet', ['Dog', 'Cat', 'Fish', 'Bird', 'Rabbit', 'Hamster'], '🐶'],
  ['Favourite sport', ['Soccer', 'Hockey', 'Tennis', 'Swimming', 'Baseball', 'Skating'], '⚽'],
  ['Favourite colour', ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'], '🎨'],
  ['Favourite season', ['Spring', 'Summer', 'Autumn', 'Winter'], '🍂'],
  ['Books read', ['Mia', 'Noah', 'Ava', 'Liam', 'Zoe', 'Ben'], '📚'],
  ['Weather in a month', ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Windy'], '⛅']
];
const theme = (n, lo = 1, hi = 10, step = 1) => {
  const [title, labels, emoji] = pick(THEMES);
  const ls = sample(labels, Math.min(n, labels.length));
  return { title, data: ls.map(l => [l, ri(Math.ceil(lo / step), Math.floor(hi / step)) * step]), emoji };
};
const biggest = d => d.reduce((x, y) => (y[1] > x[1] ? y : x));
const smallest = d => d.reduce((x, y) => (y[1] < x[1] ? y : x));
const uniqueExtremes = d => new Set(d.map(x => x[1])).size === d.length;

/** the standard family of questions about a categorical data set. showFn renders the picture. */
function categoryQuestion(d, { multi = false, unit = 'students' } = {}) {
  const [x, y] = sample(d, 2), total = sum(d.map(v => v[1]));
  const kinds = multi ? ['diff', 'total', 'twoSum', 'most', 'least'] : ['count', 'most', 'least', 'diff', 'total'];
  const k = pick(kinds);
  if (k === 'count') return { q: `How many ${unit} chose ${b(x[0])}?`, a: x[1], e: `The ${x[0]} category shows ${b(x[1])}.` };
  if (k === 'most' && uniqueExtremes(d)) return { q: 'Which category has the most?', mcAns: biggest(d)[0], choices: d.map(v => v[0]), e: `${biggest(d)[0]} has the most (${biggest(d)[1]}).` };
  if (k === 'least' && uniqueExtremes(d)) return { q: 'Which category has the fewest?', mcAns: smallest(d)[0], choices: d.map(v => v[0]), e: `${smallest(d)[0]} has the fewest (${smallest(d)[1]}).` };
  if (k === 'twoSum') return { q: `How many ${unit} chose ${b(x[0])} or ${b(y[0])}?`, a: x[1] + y[1], e: `${x[1]} + ${y[1]} = ${b(x[1] + y[1])}.` };
  if (k === 'diff' && x[1] !== y[1]) { const [hi, lo] = x[1] > y[1] ? [x, y] : [y, x]; return { q: `How many more ${unit} chose ${b(hi[0])} than ${b(lo[0])}?`, a: hi[1] - lo[1], e: `${hi[1]} − ${lo[1]} = ${b(hi[1] - lo[1])}.` }; }
  return { q: `How many ${unit} answered in all?`, a: total, e: `Add all the values: ${b(total)}.` };
}
const askCat = (pic, qd, extra = '') => qd.mcAns ? mc(`${pic}${qd.q}${extra}`, qd.mcAns, qd.choices.filter(c => c !== qd.mcAns), qd.e, 4) : num(`${pic}${qd.q}${extra}`, qd.a, qd.e);

function circleGraph(parts, size = 190) {      // parts: [[label, pct]]
  const cx = size / 2, cy = size / 2, r = size / 2 - 8, cols = [C.primary, C.accent, C.green, C.pink, C.blue, C.red];
  let a0 = -Math.PI / 2, inner = '';
  parts.forEach(([l, p], i) => {
    const a1 = a0 + (p / 100) * 2 * Math.PI, mid = (a0 + a1) / 2, pt = a => `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    inner += `<path d="M${cx},${cy} L${pt(a0)} A${r},${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${pt(a1)} Z" fill="${cols[i % 6]}" stroke="#fff" stroke-width="2"/>`;
    inner += `<text x="${cx + r * 0.62 * Math.cos(mid)}" y="${cy + r * 0.62 * Math.sin(mid) + 4}" font-size="13" font-weight="700" text-anchor="middle" fill="#fff">${p}%</text>`;
    a0 = a1;
  });
  const legend = parts.map(([l], i) => `<span style="display:inline-block;margin-right:12px"><span style="display:inline-block;width:12px;height:12px;background:${cols[i % 6]};border-radius:2px;margin-right:4px"></span>${l}</span>`).join('');
  return svg(size, size, inner, 'aria-label="circle graph"') + `<div style="font-size:14px">${legend}</div>`;
}

function stemLeaf(values) {
  const sorted = values.slice().sort((x, y) => x - y), stems = {};
  for (const v of sorted) (stems[Math.floor(v / 10)] ||= []).push(v % 10);
  return `<table style="border-collapse:collapse;margin:6px 0;font-family:monospace"><tr><th style="border-right:2px solid #334155;padding:2px 10px">Stem</th><th style="padding:2px 10px;text-align:left">Leaf</th></tr>${Object.keys(stems).map(s => `<tr><td style="border-right:2px solid #334155;padding:2px 10px;text-align:right">${s}</td><td style="padding:2px 10px">${stems[s].join(' ')}</td></tr>`).join('')}</table><div class="muted" style="font-size:13px">Key: 3 | 4 means 34</div>`;
}

function vennSvg(aLabel, bLabel, onlyA, both, onlyB, outside = null) {
  const inner = `<circle cx="110" cy="85" r="68" fill="#c7d2fe" fill-opacity=".6" stroke="${C.primary}" stroke-width="2"/><circle cx="190" cy="85" r="68" fill="#fde68a" fill-opacity=".6" stroke="${C.accent}" stroke-width="2"/>` +
    `<text x="80" y="14" font-size="13" font-weight="700" fill="${C.ink}">${aLabel}</text><text x="190" y="14" font-size="13" font-weight="700" fill="${C.ink}">${bLabel}</text>` +
    `<text x="80" y="90" font-size="20" text-anchor="middle" fill="${C.ink}">${onlyA}</text><text x="150" y="90" font-size="20" text-anchor="middle" fill="${C.ink}">${both}</text><text x="220" y="90" font-size="20" text-anchor="middle" fill="${C.ink}">${onlyB}</text>` +
    (outside != null ? `<text x="20" y="165" font-size="14" fill="${C.ink}">Neither: ${outside}</text>` : '');
  return svg(300, 172, inner, 'aria-label="Venn diagram"');
}

const median = a => { const s = a.slice().sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const modeOf = a => { const c = {}; a.forEach(v => (c[v] = (c[v] || 0) + 1)); const mx = Math.max(...Object.values(c)); const ms = Object.keys(c).filter(k => c[k] === mx); return ms.length === 1 ? +ms[0] : null; };

const graphKind = t => (/pictograph/.test(t) ? 'picto' : /tally/.test(t) ? 'tally' : /bar graph/.test(t) ? 'bar' : /line plot/.test(t) ? 'plot' : /line graph/.test(t) ? 'line' : /frequency/.test(t) ? 'freq' : /stem-and-leaf/.test(t) ? 'stem' : /circle graph/.test(t) ? 'circle' : /table/.test(t) ? 'table' : 'bar');

export const DATA_RULES = [
  /* ===== categorical graphs ===== */
  R(/^Interpret pictographs(?: I| II)?$/, (mt, ctx) => () => {
    const each = pick(ctx.grade <= 1 ? [1] : ctx.grade === 2 ? [1, 2] : /II$/.test(ctx.title) || ctx.grade >= 4 ? [2, 5, 10] : [1, 2, 5]);
    const { title, data, emoji } = theme(4, 1, 8, 1), d = data.map(([l, v]) => [l, v * each]);
    return askCat(pictograph(d, { symbol: emoji, each, title }), categoryQuestion(d), '');
  }),
  R(/^Interpret tally charts$/, () => () => {
    const { title, data } = theme(4, 1, 14), pic = `<table style="border-collapse:collapse;margin:6px 0"><caption style="font-weight:700;text-align:left">${title}</caption>${data.map(([l, v]) => `<tr><td style="padding:3px 12px 3px 0;font-weight:600">${l}</td><td>${tally(v)}</td></tr>`).join('')}</table>`;
    return askCat(pic, categoryQuestion(data));
  }),
  R(/^Interpret data in tables$|^Read a table$/, () => () => {
    const { title, data } = theme(4, 2, 20);
    return askCat(table([title.replace('Favourite ', ''), 'Number'], data), categoryQuestion(data));
  }),
  R(/^Interpret bar graphs(?:: multi-step problems)?$/, (mt, ctx) => () => {
    const multi = /multi/.test(ctx.title) || ctx.grade >= 4, hi = ctx.grade <= 1 ? 8 : ctx.grade === 2 ? 12 : 20, step = ctx.grade >= 3 && Math.random() < 0.4 ? 5 : 1;
    const { title, data } = theme(ri(4, 5), 1, hi, step);
    return askCat(barGraph(data, { title }), categoryQuestion(data, { multi }));
  }),
  R(/^Use bar graphs to solve problems$/, () => () => {
    const { title, data } = theme(5, 4, 40, 2); return askCat(barGraph(data, { title }), categoryQuestion(data, { multi: true }));
  }),
  R(/^Interpret double bar graphs$/, () => () => {
    const labels = sample(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], 4), s1 = labels.map(() => ri(2, 9) * 2), s2 = labels.map(() => ri(2, 9) * 2);
    const W = 360, H = 200, L = 36, B = 28, T = 26, top = 20, bw = (W - L - 10) / labels.length;
    let inner = '';
    for (let v = 0; v <= top; v += 4) { const y = T + (H - B - T) * (1 - v / top); inner += `<line x1="${L}" y1="${y}" x2="${W - 8}" y2="${y}" stroke="#e2e8f0"/><text x="${L - 6}" y="${y + 4}" font-size="11" text-anchor="end" fill="${C.ink}">${v}</text>`; }
    labels.forEach((l, i) => {
      for (const [k, s, col] of [[0, s1, C.primary], [1, s2, C.accent]]) { const h = (s[i] / top) * (H - B - T); inner += `<rect x="${L + i * bw + bw * 0.12 + k * bw * 0.38}" y="${H - B - h}" width="${bw * 0.36}" height="${h}" fill="${col}"/>`; }
      inner += `<text x="${L + i * bw + bw / 2}" y="${H - 10}" font-size="11" text-anchor="middle" fill="${C.ink}">${l}</text>`;
    });
    inner += `<line x1="${L}" y1="${T}" x2="${L}" y2="${H - B}" stroke="${C.ink}" stroke-width="2"/><line x1="${L}" y1="${H - B}" x2="${W - 8}" y2="${H - B}" stroke="${C.ink}" stroke-width="2"/><rect x="${W - 130}" y="4" width="10" height="10" fill="${C.primary}"/><text x="${W - 116}" y="13" font-size="11" fill="${C.ink}">Class A</text><rect x="${W - 66}" y="4" width="10" height="10" fill="${C.accent}"/><text x="${W - 52}" y="13" font-size="11" fill="${C.ink}">Class B</text>`;
    const i = ri(0, 3), askA = Math.random() < 0.5;
    if (Math.random() < 0.5) return num(`${svg(W, H, inner)}How many ${askA ? 'Class A' : 'Class B'} students came on ${b(labels[i])}?`, askA ? s1[i] : s2[i], `Read the ${askA ? 'blue' : 'orange'} bar for ${labels[i]}: ${b(askA ? s1[i] : s2[i])}.`);
    return num(`${svg(W, H, inner)}How many students came on ${b(labels[i])} in all (both classes)?`, s1[i] + s2[i], `${s1[i]} + ${s2[i]} = ${b(s1[i] + s2[i])}.`);
  }),
  R(/^Complete (?:double )?bar graphs$|^Create bar graphs$/, () => () => {
    const { title, data } = theme(4, 2, 16), k = ri(0, 3), shown = data.map((d, i) => (i === k ? [d[0], 0] : d));
    return num(`${table(['Category', 'Number'], data)}${barGraph(shown, { title, max: 16, step: 2 })}The bar for ${b(data[k][0])} is missing. How tall should it be?`, data[k][1], `The table says ${data[k][0]} is ${b(data[k][1])}.`);
  }),
  R(/^Create pictographs(?: I| II)?$|^Make pictographs with (?:pictures|symbols)$/, () => () => {
    const each = pick([2, 5, 10]), { title, data, emoji } = theme(4, 1, 5), d = data.map(([l, v]) => [l, v * each]), k = ri(0, 3);
    return num(`${table(['Category', 'Number'], d)}Each ${emoji} stands for ${b(each)}. How many ${emoji} should be drawn for ${b(d[k][0])}?`, d[k][1] / each, `${d[k][1]} ÷ ${each} = ${b(d[k][1] / each)} symbols.`);
  }),
  R(/^Which pictograph is correct\?$|^Which tally chart is correct\?$|^Which bar graph is correct\?$|^Show data in different ways$|^Record data in tables$/, (mt, ctx) => () => {
    const { title, data, emoji } = theme(3, 1, 9), k = ri(0, 2), correct = Math.random() < 0.5, shownData = data.map((d, i) => (i === k && !correct ? [d[0], d[1] + pick([-1, 1, 2]) || d[1] + 1] : d));
    const bad = shownData[k][1] <= 0 ? null : 1; if (!bad) return null;
    const kind = /pictograph/.test(ctx.title) ? 'p' : /tally/.test(ctx.title) ? 't' : /bar/.test(ctx.title) ? 'b' : pick(['p', 't', 'b']);
    const pic = kind === 'p' ? pictograph(shownData, { symbol: emoji, each: 1 }) : kind === 't' ? `<table>${shownData.map(([l, v]) => `<tr><td style="padding:3px 12px 3px 0;font-weight:600">${l}</td><td>${tally(v)}</td></tr>`).join('')}</table>` : barGraph(shownData, { max: 10, step: 1 });
    return yesNo(`Data: ${data.map(d => `${d[0]} ${d[1]}`).join(', ')}.${pic}Does the ${kind === 'p' ? 'pictograph' : kind === 't' ? 'tally chart' : 'bar graph'} match the data?`, correct, correct ? 'Every row matches the data.' : `The ${data[k][0]} row should show ${data[k][1]}, not ${shownData[k][1]}.`, ['Yes', 'No']);
  }),
  R(/^Interpret frequency tables(?:: one-step problems| : multi-step problems|: multi-step problems)?$/, (mt, ctx) => () => {
    const labels = sample(['2', '3', '4', '5', '6', '7'], 4), freq = labels.map(() => ri(2, 12)), multi = /multi/.test(ctx.title), who = pick(['books', 'goals', 'pets', 'siblings']);
    const tbl = table([`Number of ${who}`, 'Frequency'], labels.map((l, i) => [l, freq[i]])), i = ri(0, 3);
    if (!multi || Math.random() < 0.4) return num(`${tbl}How many students had ${b(labels[i])} ${who}?`, freq[i], `The frequency for ${labels[i]} is ${b(freq[i])}.`);
    return num(`${tbl}How many students were surveyed in all?`, sum(freq), `Add the frequencies: ${b(sum(freq))}.`);
  }),
  R(/^Create frequency tables$|^Create relative frequency tables$/, (mt, ctx) => () => {
    const vals = Array.from({ length: ri(8, 14) }, () => ri(1, 5)), n = ri(1, 5), cnt = vals.filter(v => v === n).length;
    if (/relative/.test(ctx.title)) { const pct = Math.round((cnt / vals.length) * 1000) / 10; return num(`Data: ${vals.join(', ')}<br>What percent of the data values are ${b(n)}? (round to the nearest percent)`, Math.round((cnt / vals.length) * 100), `${cnt} of ${vals.length} values is about ${b(Math.round((cnt / vals.length) * 100))}%.`); }
    return num(`Data: ${vals.join(', ')}<br>What frequency belongs in the table for the value ${b(n)}?`, cnt, `Count how many times ${n} appears: ${b(cnt)}.`);
  }),
  R(/^Interpret line plots$/, () => () => {
    const n = ri(8, 14), vals = Array.from({ length: n }, () => ri(1, 7)), k = ri(1, 7), cnt = vals.filter(v => v === k).length;
    return Math.random() < 0.5
      ? num(`${linePlot(vals, { min: 1, max: 7, label: 'Number of books read' })}How many students read ${b(k)} books?`, cnt, `Count the ✕ above ${k}: ${b(cnt)}.`)
      : num(`${linePlot(vals, { min: 1, max: 7, label: 'Number of books read' })}How many students are shown in all?`, n, `Count all the ✕ marks: ${b(n)}.`);
  }),
  R(/^Create line plots$/, () => () => {
    const vals = Array.from({ length: ri(6, 12) }, () => ri(1, 6)), k = ri(1, 6), cnt = vals.filter(v => v === k).length;
    return num(`Data: ${vals.join(', ')}<br>If you make a line plot, how many ✕ marks go above ${b(k)}?`, cnt, `Count how many times ${k} appears: ${b(cnt)}.`);
  }),
  R(/^Interpret line graphs$/, () => () => {
    const labs = ['Jan', 'Feb', 'Mar', 'Apr', 'May'], vals = labs.map(() => ri(2, 18)), i = ri(0, 4);
    const g = lineGraph(labs.map((l, k) => [l, vals[k]]), { title: 'Snow days', max: 20, step: 2 });
    return Math.random() < 0.5 ? num(`${g}How many snow days were there in ${b(labs[i])}?`, vals[i], `Read the point above ${labs[i]}: ${b(vals[i])}.`) : (() => { const mx = Math.max(...vals); if (vals.filter(v => v === mx).length > 1) return null; return mc(`${g}Which month had the most snow days?`, labs[vals.indexOf(mx)], labs.filter(l => l !== labs[vals.indexOf(mx)]), `The highest point is ${labs[vals.indexOf(mx)]}.`); })();
  }),
  R(/^Create line graphs$/, () => () => {
    const labs = ['Mon', 'Tue', 'Wed', 'Thu'], vals = labs.map(() => ri(2, 18)), k = ri(0, 3);
    return num(`${table(['Day', 'Value'], labs.map((l, i) => [l, vals[i]]))}On a line graph, the point for ${b(labs[k])} goes at what height?`, vals[k], `Use the table: ${b(vals[k])}.`);
  }),
  R(/^Interpret stem-and-leaf plots$|^Create stem-and-leaf plots$/, (mt, ctx) => () => {
    const vals = Array.from({ length: ri(8, 12) }, () => ri(10, 59)), sorted = vals.slice().sort((x, y) => x - y);
    if (/Create/.test(ctx.title)) { const v = pick(vals); return mc(`Data: ${vals.join(', ')}<br>In a stem-and-leaf plot, which stem and leaf show ${b(v)}?`, `${Math.floor(v / 10)} | ${v % 10}`, uniq([`${v % 10} | ${Math.floor(v / 10)}`, `${Math.floor(v / 10) + 1} | ${v % 10}`, `${Math.floor(v / 10)} | ${(v % 10 + 1) % 10}`]).filter(x => x !== `${Math.floor(v / 10)} | ${v % 10}`), `${v} has stem ${Math.floor(v / 10)} and leaf ${v % 10}.`); }
    const kind = pick(['count', 'max', 'min', 'range']);
    const pic = stemLeaf(vals);
    if (kind === 'count') return num(`${pic}How many values are in the plot?`, vals.length, `Count all the leaves: ${b(vals.length)}.`);
    if (kind === 'max') return num(`${pic}What is the greatest value?`, sorted[sorted.length - 1], `The last stem and its largest leaf give ${b(sorted[sorted.length - 1])}.`);
    if (kind === 'min') return num(`${pic}What is the least value?`, sorted[0], `The first stem and its smallest leaf give ${b(sorted[0])}.`);
    return num(`${pic}What is the difference between the greatest and least values?`, sorted[sorted.length - 1] - sorted[0], `${sorted[sorted.length - 1]} − ${sorted[0]} = ${b(sorted[sorted.length - 1] - sorted[0])}.`);
  }),
  R(/^Circle graphs$/, () => () => {
    const sets = [[['Soccer', 50], ['Hockey', 25], ['Swim', 25]], [['Red', 40], ['Blue', 30], ['Green', 20], ['Yellow', 10]], [['Pizza', 50], ['Pasta', 30], ['Salad', 20]], [['Apples', 25], ['Pears', 25], ['Plums', 50]]], parts = pick(sets), tot = pick([20, 40, 60, 100]);
    const k = ri(0, parts.length - 1);
    return Math.random() < 0.5
      ? num(`${circleGraph(parts)}${tot} students were surveyed. How many chose ${b(parts[k][0])}?`, (parts[k][1] / 100) * tot, `${parts[k][1]}% of ${tot} = ${b((parts[k][1] / 100) * tot)}.`)
      : (() => { const mx = Math.max(...parts.map(p => p[1])); if (parts.filter(p => p[1] === mx).length > 1) return null; const top = parts.find(p => p[1] === mx)[0]; return mc(`${circleGraph(parts)}Which choice is the most popular?`, top, parts.map(p => p[0]).filter(x => x !== top), `The biggest slice is ${top} (${mx}%).`); })();
  }),
  R(/^Choose the best type of graph$/, () => () => {
    const q = pick([['compare the number of students who chose different pets', 'bar graph', 'a bar graph compares categories'], ['show how the temperature changed over a week', 'line graph', 'a line graph shows change over time'], ['show what part of a class likes each sport', 'circle graph', 'a circle graph shows parts of a whole'], ['show how many of each item using small pictures', 'pictograph', 'a pictograph uses symbols']]);
    return mc(`Which graph is best to ${b(q[0])}?`, q[1], ['bar graph', 'line graph', 'circle graph', 'pictograph'].filter(x => x !== q[1]), `${q[2][0].toUpperCase() + q[2].slice(1)}: ${b(q[1])}.`);
  }),
  R(/^Sort shapes into a Venn diagram$|^Count shapes in a Venn diagram$|^Use Venn diagrams to solve problems$/, (mt, ctx) => () => {
    const onlyA = ri(1, 9), both = ri(1, 7), onlyB = ri(1, 9), outside = /solve/.test(ctx.title) ? ri(0, 6) : null;
    const labels = pick([['Red', 'Circles'], ['Big', 'Triangles'], ['Plays soccer', 'Plays hockey'], ['Has a pet', 'Has a sibling']]), pic = vennSvg(labels[0], labels[1], onlyA, both, onlyB, outside);
    const k = pick(['A', 'both', 'total', 'onlyA', 'onlyB']);
    if (k === 'A') return num(`${pic}How many are ${b(labels[0])} in all? (Count both parts of that circle.)`, onlyA + both, `${onlyA} + ${both} = ${b(onlyA + both)}.`);
    if (k === 'both') return num(`${pic}How many are in ${b('both')} circles?`, both, `The overlap shows ${b(both)}.`);
    if (k === 'onlyA') return num(`${pic}How many are ${b(labels[0])} but not ${b(labels[1])}?`, onlyA, `Only the left part: ${b(onlyA)}.`);
    if (k === 'onlyB') return num(`${pic}How many are ${b(labels[1])} but not ${b(labels[0])}?`, onlyB, `Only the right part: ${b(onlyB)}.`);
    return num(`${pic}How many are there in all?`, onlyA + both + onlyB + (outside || 0), `Add every region: ${b(onlyA + both + onlyB + (outside || 0))}.`);
  }),

  /* ===== even / odd (G1–2) ===== */
  R(/^Even or odd number of shapes - up to 20$|^Even or odd number of shapes$/, () => () => {
    const n = ri(2, 20), [, , e] = thing();
    return mc(`${emojiRow(e, n, 10)}Is the number of ${e} even or odd?`, n % 2 ? 'odd' : 'even', [n % 2 ? 'even' : 'odd'], `${n} ${n % 2 ? 'cannot be split into pairs with none left over, so it is odd' : 'can be split into pairs, so it is even'}.`, 2);
  }),
  R(/^Identify even and odd numbers(?: - up to 100)?$/, () => () => {
    const n = ri(2, 100); return mc(`Is ${b(n)} even or odd?`, n % 2 ? 'odd' : 'even', [n % 2 ? 'even' : 'odd'], `Check the ones digit (${n % 10}): ${n % 2 ? 'odd' : 'even'}.`, 2);
  }),
  R(/^Select even and odd numbers$/, () => () => {
    const wantEven = Math.random() < 0.5, nums = sample(range(11, 99), 4).map((x, i) => (i === 0 ? (wantEven ? x - (x % 2) : x - (x % 2) + 1) : (wantEven ? x - (x % 2) + 1 : x - (x % 2)))), ans = nums[0];
    return mc(`Which number is ${b(wantEven ? 'even' : 'odd')}?`, ans, nums.slice(1), `${ans} ends in ${ans % 10}, so it is ${wantEven ? 'even' : 'odd'}.`);
  }),
  R(/^Even or odd numbers on number lines$/, () => () => {
    const lo = ri(0, 8) * 10, v = lo + ri(0, 10);
    return mc(`A point is at ${b(v)} on a number line. Is ${v} even or odd?`, v % 2 ? 'odd' : 'even', [v % 2 ? 'even' : 'odd'], `Even numbers are every second number. ${v} is ${v % 2 ? 'odd' : 'even'}.`, 2);
  }),
  R(/^Which even or odd number comes before or after\?$/, () => () => {
    const n = ri(3, 98), even = Math.random() < 0.5, after = Math.random() < 0.5;
    const base = even ? n - (n % 2) : n - (n % 2) + 1, ans = base + (after ? 2 : -2);
    return num(`What is the ${b(even ? 'even' : 'odd')} number ${after ? 'after' : 'before'} ${b(base)}?`, ans, `Even/odd numbers are 2 apart: ${base} ${after ? '+' : '−'} 2 = ${b(ans)}.`);
  }),

  /* ===== probability ===== */
  R(/^More, less and equally likely$/, () => () => {
    const a = ri(1, 6), c = ri(1, 6), ca = '🔴', cb = '🔵';
    return mc(`A bag has these marbles:<br>${big(ca.repeat(a) + cb.repeat(c))}You pick one without looking. Which is true?`, a === c ? 'Red and blue are equally likely' : a > c ? 'Red is more likely' : 'Blue is more likely', ['Red is more likely', 'Blue is more likely', 'Red and blue are equally likely'].filter(x => x !== (a === c ? 'Red and blue are equally likely' : a > c ? 'Red is more likely' : 'Blue is more likely')), `There are ${a} red and ${c} blue marbles.`, 3);
  }),
  R(/^Certain, probable, unlikely and impossible$/, () => () => {
    const q = pick([['The sun will rise tomorrow.', 'certain'], ['You roll a 7 on a regular die.', 'impossible'], ['You pick a red marble from a bag with 9 red and 1 blue.', 'probable'], ['You pick a blue marble from a bag with 9 red and 1 blue.', 'unlikely'], ['A cat will bark like a dog.', 'impossible'], ['It will snow in Winnipeg in January.', 'probable'], ['You flip a coin and get heads or tails.', 'certain'], ['You win a lottery with one ticket.', 'unlikely']]);
    return mc(`How likely is this? ${b(q[0])}`, q[1], ['certain', 'probable', 'unlikely', 'impossible'].filter(x => x !== q[1]), `This event is ${b(q[1])}.`);
  }),
  R(/^Understanding probability$/, () => () => {
    const a = ri(1, 5), c = ri(1, 5), tot = a + c;
    const f = (n, d) => { const g = gcd(n, d); return `${n / g}/${d / g}`; };
    const ans = f(a, tot);
    return mc(`A bag has ${a} red and ${c} blue marbles. What is the probability of picking a ${b('red')} marble?`, ans, uniq([f(c, tot), f(a, c) === ans ? '1/1' : f(a, c), `${a}/${tot + 1}`, f(tot, a)]).filter(x => x !== ans), `${a} red out of ${tot} marbles: ${b(ans)}.`);
  }),
  R(/^Sample spaces of simple events$/, () => () => {
    const q = pick([['flip a coin', 2, 'heads, tails'], ['roll a regular die', 6, '1, 2, 3, 4, 5, 6'], ['spin a spinner with 8 equal sections', 8, '8 sections'], ['pick a letter from the word "MATH"', 4, 'M, A, T, H']]);
    return num(`How many possible outcomes are there when you ${b(q[0])}?`, q[1], `The possible outcomes are ${q[2]}: ${b(q[1])}.`);
  }),
  R(/^Find the probability$/, (mt, ctx) => () => {
    const r = ri(1, 5), bl = ri(1, 5), g = ri(0, 4), tot = r + bl + g, col = pick([['red', r], ['blue', bl]]), f = (n, d) => { const gg = gcd(n, d); return `${n / gg}/${d / gg}`; };
    const ans = f(col[1], tot);
    return mc(`A bag has ${r} red, ${bl} blue${g ? ` and ${g} green` : ''} marbles. You pick one at random. What is the probability of picking ${b(col[0])}?`, ans, uniq([f(tot - col[1], tot), `1/${tot}`, f(col[1], tot + 1), f(tot, col[1])]).filter(x => x !== ans), `${col[1]} out of ${tot}: ${b(ans)}.`);
  }),
  R(/^Make predictions$/, () => () => {
    const n = pick([20, 30, 40, 50, 100]), p = pick([[1, 2], [1, 4], [1, 5], [3, 4]]), ans = (n * p[0]) / p[1];
    if (!Number.isInteger(ans)) return null;
    return num(`The probability of rain on a day is ${b(`${p[0]}/${p[1]}`)}. About how many rainy days are expected in ${b(n)} days?`, ans, `${n} × ${p[0]}/${p[1]} = ${b(ans)}.`);
  }),
  R(/^Experimental probability$/, () => () => {
    const trials = pick([10, 20, 25, 50]), hits = ri(1, trials - 1), g = gcd(hits, trials);
    return mc(`A spinner is spun ${b(trials)} times and lands on blue ${b(hits)} times. What is the experimental probability of blue?`, `${hits / g}/${trials / g}`, uniq([`${(trials - hits) / gcd(trials - hits, trials)}/${trials / gcd(trials - hits, trials)}`, `${hits}/${trials + 1}`, `${trials / g}/${hits / g}`]).filter(x => x !== `${hits / g}/${trials / g}`), `${hits}/${trials} = ${b(`${hits / g}/${trials / g}`)}.`);
  }),

  /* ===== statistics ===== */
  R(/^Find the mode$|^Interpret charts to find the mode$|^Interpret line plots to find the mode$/, (mt, ctx) => () => {
    const vals = Array.from({ length: ri(6, 10) }, () => ri(1, 9)), mo = modeOf(vals); if (mo === null) return null;
    const pic = /line plots/.test(ctx.title) ? linePlot(vals, { min: 1, max: 9 }) : /charts/.test(ctx.title) ? table(['Value', 'Frequency'], uniq(vals).sort((x, y) => x - y).map(v => [v, vals.filter(x => x === v).length])) : `<div class="math">${vals.join(', ')}</div>`;
    return num(`${pic}What is the ${b('mode')}? (the value that appears most often)`, mo, `${mo} appears most often: ${b(mo)}.`);
  }),
  R(/^Find the mean$|^Interpret charts and graphs to find the mean$|^Interpret charts to find mean and mode$|^Interpret line plots to find the mean$|^Mean: find the missing number$/, (mt, ctx) => () => {
    const n = ri(3, 6), mean = ri(3, 12), vals = Array.from({ length: n - 1 }, () => ri(Math.max(1, mean - 4), mean + 4)), last = mean * n - sum(vals);
    if (last < 1 || last > 25) return null;
    if (/missing/.test(ctx.title)) return num(`The mean of ${n} numbers is ${b(mean)}. Four... the numbers so far are ${vals.join(', ')}. What is the missing number?`.replace('Four... the', 'The'), last, `${n} × ${mean} = ${mean * n}, and ${mean * n} − ${sum(vals)} = ${b(last)}.`);
    const all = shuffle([...vals, last]), pic = /line plot/.test(ctx.title) ? linePlot(all, { min: Math.min(...all), max: Math.max(...all) }) : /charts/.test(ctx.title) ? table(['Value', 'Frequency'], uniq(all).sort((x, y) => x - y).map(v => [v, all.filter(x => x === v).length])) : `<div class="math">${all.join(', ')}</div>`;
    return num(`${pic}Find the ${b('mean')}.`, mean, `Add: ${all.join(' + ')} = ${mean * n}. Divide by ${n}: ${b(mean)}.`);
  }),
  R(/^Find the median$|^Interpret line plots to find the median$/, (mt, ctx) => () => {
    const n = pick([5, 7, 9]), vals = Array.from({ length: n }, () => ri(1, 20)), md = median(vals);
    const pic = /line plots/.test(ctx.title) ? linePlot(vals.map(v => Math.min(10, v % 10 + 1)), { min: 1, max: 10 }) : `<div class="math">${vals.join(', ')}</div>`;
    const used = /line plots/.test(ctx.title) ? vals.map(v => Math.min(10, v % 10 + 1)) : vals;
    return num(`${pic}Find the ${b('median')}. (the middle number when the values are in order)`, median(used), `In order: ${used.slice().sort((x, y) => x - y).join(', ')}. The middle is ${b(median(used))}.`);
  }),
  R(/^Calculate mean, median and mode$|^Mean, median and mode: find the missing number$|^Interpret charts to find mean, median and mode$/, (mt, ctx) => () => {
    const base = ri(2, 9), vals = shuffle([base, base, ri(1, 12), ri(1, 12), ri(1, 12)]), mo = modeOf(vals); if (mo === null) return null;
    const kind = pick(['mean', 'median', 'mode']), mean = sum(vals) / vals.length;
    if (kind === 'mean' && !Number.isInteger(mean)) return null;
    const v = { mean, median: median(vals), mode: mo }[kind];
    return num(`<div class="math">${vals.join(', ')}</div>Find the ${b(kind)}.`, v, kind === 'mean' ? `${sum(vals)} ÷ ${vals.length} = ${b(mean)}.` : kind === 'median' ? `In order: ${vals.slice().sort((x, y) => x - y).join(', ')}; the middle is ${b(v)}.` : `${mo} appears most often.`);
  }),
  R(/^Identify biased samples$/, () => () => {
    const q = pick([['Asking only basketball players what their favourite sport is', 'biased'], ['Asking 50 students chosen at random from the school list', 'not biased'], ['Asking only people at a pizza restaurant about their favourite food', 'biased'], ['Asking every fifth person who walks in a mall entrance', 'not biased'], ['Asking only your friends who like music which band is best', 'biased']]);
    return mc(`A survey is done by: ${b(q[0])}. Is the sample biased?`, q[1] === 'biased' ? 'Biased' : 'Not biased', [q[1] === 'biased' ? 'Not biased' : 'Biased'], q[1] === 'biased' ? 'The sample does not fairly represent everyone.' : 'The sample is chosen fairly.', 2);
  }),

  /* ===== financial literacy (G5) ===== */
  R(/^Identify advantages and disadvantages of payment methods$/, () => () => {
    const q = pick([['Cash', 'You cannot overspend what you do not have', 'advantage'], ['Credit card', 'You may owe interest if you do not pay the full bill', 'disadvantage'], ['Debit card', 'Money comes straight out of your bank account', 'fact'], ['Cash', 'It can be lost or stolen and is hard to replace', 'disadvantage'], ['Credit card', 'You can buy now and pay later', 'advantage']]);
    return mc(`Which best describes this about paying with ${q[0] === 'Cash' ? '' : 'a '}${b(q[0].toLowerCase())}?<br>${b(q[1])}`, q[2] === 'advantage' ? 'An advantage' : q[2] === 'disadvantage' ? 'A disadvantage' : 'A fact about how it works', ['An advantage', 'A disadvantage', 'A fact about how it works'].filter(x => x !== (q[2] === 'advantage' ? 'An advantage' : q[2] === 'disadvantage' ? 'A disadvantage' : 'A fact about how it works')), `${q[1]} — that is ${q[2] === 'fact' ? 'how it works' : 'an ' + q[2]}.`.replace('an disadvantage', 'a disadvantage'), 3);
  }),
  R(/^Evaluate payment methods$/, () => () => {
    const q = pick([['You want to buy a $3 snack and have $10 in your wallet.', 'Cash'], ['You are buying a big item online and want to pay straight from your bank account.', 'Debit card'], ['You want to build a credit history and can pay the full bill every month.', 'Credit card']]);
    return mc(`Which payment method is best? ${b(q[0])}`, q[1], ['Cash', 'Debit card', 'Credit card'].filter(x => x !== q[1]), `${q[1]} fits this situation best.`, 3);
  }),
  R(/^Debit cards and credit cards$/, () => () => {
    const q = pick([['Which card uses money you already have in your bank account?', 'Debit card'], ['Which card lets you borrow money that you must repay?', 'Credit card'], ['Which card can charge you interest on unpaid balances?', 'Credit card'], ['Which card takes money directly from your chequing account?', 'Debit card']]);
    return mc(q[0], q[1], ['Debit card', 'Credit card'].filter(x => x !== q[1]), `${q[1]}.`, 2);
  }),
  R(/^Reading financial records$|^Keeping financial records$/, (mt, ctx) => () => {
    const start = ri(100, 300), rows = [['Deposit', ri(20, 80)], ['Purchase', -ri(10, 60)], ['Deposit', ri(10, 60)], ['Purchase', -ri(10, 50)]];
    let bal = start; const tbl = rows.map(([t, a]) => { bal += a; return [t, (a < 0 ? '−$' : '$') + Math.abs(a), '$' + bal]; });
    return num(`${table(['Transaction', 'Amount', 'Balance'], [['Starting balance', '', '$' + start], ...tbl])}What is the final balance? (in dollars)`, bal, `Add deposits and subtract purchases: ${b('$' + bal)}.`);
  }),
  R(/^Balance a budget$|^Adjust a budget$/, (mt, ctx) => () => {
    const adjust = /Adjust/.test(ctx.title), a = ri(2, 6) * 10, c = ri(3, 8) * 10, f = ri(2, 6) * 10, spent = a + c + f, k = ri(1, 4) * 10;
    const income = adjust ? spent - k : spent + k, rows = table(['Item', 'Planned'], [['Savings', '$' + a], ['Food', '$' + c], ['Fun', '$' + f]]);
    return adjust
      ? num(`${rows}Income: $${income}. The plan costs more than the income. How many dollars must be cut?`, k, `${spent} − ${income} = ${b(k)}.`)
      : num(`${rows}Income: $${income}. How many dollars are left after the planned spending?`, k, `${income} − ${spent} = ${b(k)}.`);
  })
];
export { circleGraph, stemLeaf, vennSvg, theme, median, modeOf };
