/* Symbolic algebra for Grades 9–12: monomials, polynomials, factoring, exponent rules, radicals, quadratics,
   rational expressions and complex numbers. Polynomials are coefficient arrays, highest degree first. */
import { ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, dec, num, mc, yesNo, near, svg, C, NAMES, gcd, lcm, table, plane, MINUS } from '../h.js';
import { R } from '../engine.js';
import { S, P, nz, evalExpr } from './numsys.js';
import { stack, fs, simp } from './fractions.js';

/* ---------- polynomial helpers ---------- */
const sup = (v, e) => (e === 0 ? '' : e === 1 ? v : `${v}<sup>${e}</sup>`);
const termTxt = (c, e, v = 'x', first = true) => {
  if (c === 0) return '';
  const a = Math.abs(c), coef = e > 0 && a === 1 ? '' : String(a), body = coef + sup(v, e), sign = c < 0 ? (first ? MINUS : ` ${MINUS} `) : first ? '' : ' + ';
  return sign + (e === 0 && a === 1 ? '1' : body);
};
/** coefficients high→low, e.g. [2,-3,1] → 2x² − 3x + 1 */
const polyTxt = (co, v = 'x') => { let out = '', first = true; co.forEach((c, i) => { const e = co.length - 1 - i; if (c !== 0) { out += termTxt(c, e, v, first); first = false; } }); return out || '0'; };
const trim = co => { const a = co.slice(); while (a.length > 1 && a[0] === 0) a.shift(); return a; };
const padTo = (a, n) => Array(n - a.length).fill(0).concat(a);
const padd = (a, c) => { const n = Math.max(a.length, c.length), x = padTo(a, n), y = padTo(c, n); return trim(x.map((v_, i) => v_ + y[i])); };
const pneg = a => a.map(v_ => -v_);
const pmul = (a, c) => { const r = Array(a.length + c.length - 1).fill(0); a.forEach((x, i) => c.forEach((y, j) => { r[i + j] += x * y; })); return trim(r); };
const pEval = (co, x) => co.reduce((acc, c) => acc * x + c, 0);
const randPoly = (deg, lo = -6, hi = 6) => { const co = Array.from({ length: deg + 1 }, () => ri(lo, hi)); if (co[0] === 0) co[0] = nz(1, hi); return co; };
const wrongPolys = (ans, v = 'x') => uniq([polyTxt(ans.map((c, i) => (i === 0 ? c + 1 : c)), v), polyTxt(ans.map((c, i) => (i === ans.length - 1 ? c + 1 : c)), v), polyTxt(ans.map((c, i) => (i === Math.floor(ans.length / 2) ? -c : c)), v), polyTxt(ans.map(c => -c), v)]).filter(x => x !== polyTxt(ans, v));
const polyQ = (prompt, ans, expl, v = 'x') => mc(prompt, polyTxt(ans, v), wrongPolys(ans, v).slice(0, 3), expl.replace('%A', b(polyTxt(ans, v))), 4);
const binom = (a, c, v = 'x') => polyTxt([1, a === 0 ? 0 : a].length ? [1, a] : [1], v);          // x + a
const lin = (a, c, v = 'x') => polyTxt([a, c], v);

const PRIMES = [2, 3, 5, 7, 11, 13];
function simplifyRadical(n, index = 2) { let out = 1, inside = n; for (let k = Math.floor(Math.pow(n, 1 / index)); k >= 2; k--) { const p = k ** index; if (inside % p === 0) { out *= k; inside /= p; } } return [out, inside]; }
const radTxt = (out, inside, index = 2) => `${out === 1 ? '' : out}${index === 2 ? '√' : index === 3 ? '∛' : `<sup>${index}</sup>√`}${inside}`.replace(/√1$/, '') || '1';
const rad = (out, inside) => (inside === 1 ? String(out) : `${out === 1 ? '' : out}√${inside}`);

export const POLY_RULES = [
  /* ===== monomials ===== */
  R(/^Identify monomials$/, () => () => {
    const mono = [`${ri(2, 9)}x²`, `${ri(2, 9)}xy`, `${ri(2, 9)}a³b`, '−7', 'x⁴'], non = [`x + ${ri(2, 9)}`, `${ri(2, 9)}/x`, `${ri(2, 5)}x − y`, `√x`, `x^(−2)`];
    const good = pick(mono); return mc(`Which expression is a ${b('monomial')}?`, good, sample(non, 3), `A monomial is a single term: a number, a variable, or a product of them.`, 4);
  }),
  R(/^Multiply monomials(?: to find area)?$|^Multiply and divide monomials$|^Divide monomials$|^Powers of monomials$/, (mt, ctx) => () => {
    const t = ctx.title, a = nz(-6, 6), c = nz(-6, 6), e1 = ri(1, 5), e2 = ri(1, 5);
    if (/area/.test(t)) { const l = ri(2, 6), w = ri(2, 6), p = ri(1, 3), q = ri(1, 3); return mc(`A rectangle has length ${m(`${l}x${p > 1 ? '<sup>' + p + '</sup>' : ''}`)} and width ${m(`${w}x${q > 1 ? '<sup>' + q + '</sup>' : ''}`)}. What is its area?`, `${l * w}${sup('x', p + q)}`, [`${l + w}${sup('x', p + q)}`, `${l * w}${sup('x', p * q)}`, `${l * w}${sup('x', Math.abs(p - q) || 1)}`], `Multiply the coefficients and add the exponents: ${b(`${l * w}${sup('x', p + q)}`)}.`, 4); }
    if (/Powers/.test(t)) { const n = ri(2, 4); return mc(`Simplify ${m(`(${a === 1 ? '' : S(a)}x<sup>${e1}</sup>)<sup>${n}</sup>`)}.`, `${S(a ** n)}${sup('x', e1 * n)}`, [`${S(a * n)}${sup('x', e1 * n)}`, `${S(a ** n)}${sup('x', e1 + n)}`, `${S(a ** n)}${sup('x', e1)}`], `Raise the coefficient to the power and multiply exponents: ${b(`${S(a ** n)}${sup('x', e1 * n)}`)}.`, 4); }
    if (/^Divide/.test(t) || (/and divide/.test(t) && Math.random() < 0.5)) { const q = nz(-6, 6), x = q * c, ee = e1 + e2; return mc(`Simplify ${m(`${S(x)}x<sup>${ee}</sup> ÷ ${S(c)}x<sup>${e2}</sup>`)}.`, `${S(q)}${sup('x', e1)}`, [`${S(q)}${sup('x', ee + e2)}`, `${S(x * c)}${sup('x', e1)}`, `${S(q)}${sup('x', ee * e2)}`], `Divide coefficients and subtract exponents: ${b(`${S(q)}${sup('x', e1)}`)}.`, 4); }
    return mc(`Simplify ${m(`(${S(a)}x<sup>${e1}</sup>)(${S(c)}x<sup>${e2}</sup>)`)}.`, `${S(a * c)}${sup('x', e1 + e2)}`, [`${S(a + c)}${sup('x', e1 + e2)}`, `${S(a * c)}${sup('x', e1 * e2)}`, `${S(a * c)}${sup('x', e1 + e2 + 1)}`], `Multiply the coefficients and add exponents: ${b(`${S(a * c)}${sup('x', e1 + e2)}`)}.`, 4);
  }),
  R(/^Factor monomials$|^GCF of monomials$|^Factor out a monomial$/, (mt, ctx) => () => {
    const g = ri(2, 6), p = ri(1, 5), q = ri(1, 5), e = ri(1, 3), a = g * p, c = g * q; if (gcd(p, q) !== 1 || p === q) return null;
    if (/GCF/.test(ctx.title)) return mc(`What is the greatest common factor of ${m(`${a}x<sup>${e + 1}</sup>`)} and ${m(`${c}x<sup>${e}</sup>`)}?`, `${g}${sup('x', e)}`, [`${g}${sup('x', e + 1)}`, `${a}${sup('x', e)}`, `${g}`], `The GCF of the coefficients is ${g} and the smaller power of x is x^${e}: ${b(`${g}${sup('x', e)}`)}.`, 4);
    if (/Factor out/.test(ctx.title)) { const good = `${g}${sup('x', e)}(${coef_(p)}x + ${q})`; return mc(`Factor out the greatest common monomial: ${m(`${a}x<sup>${e + 1}</sup> + ${c}x<sup>${e}</sup>`)}`, good, [`${g}${sup('x', e + 1)}(${p} + ${q})`, `${g}(${p}x<sup>${e + 1}</sup> + ${q}x<sup>${e}</sup>)`, `${sup('x', e)}(${a}x + ${c})`], `Take out ${g}x^${e}: ${b(good)}.`, 4); }
    return num(`Factor ${m(`${a}x + ${c}`)} by taking out the greatest common factor. What is that factor?`, g, `The GCF of ${a} and ${c} is ${b(g)}.`);
  }),

  /* ===== exponents ===== */
  R(/^Powers with integer bases$/, () => () => {
    const base = nz(-6, 6), e = ri(2, 4), v_ = base ** e;
    return num(`${m(`(${S(base)})<sup>${e}</sup> = ?`)}`, v_, `${Array(e).fill(P(base)).join(' × ')} = ${b(S(v_))}.`);
  }),
  R(/^Negative exponents$/, () => () => {
    const base = ri(2, 6), e = ri(1, 3), kind = pick(['frac', 'eval']);
    return mc(`${m(`${base}<sup>${MINUS}${e}</sup> = ?`)}`, fs(1, base ** e), [fs(-1, base ** e).replace('-', MINUS), String(-(base ** e)), fs(1, base * e)], `A negative exponent means a reciprocal: 1/${base}^${e} = ${b(fs(1, base ** e))}.`, 4);
  }),
  R(/^(Multiplication|Division|Multiplication and division) with exponents(?: - integral bases| - variable bases)?$|^(?:Multiplication|Division|Multiplication and division) with exponents$/, (mt, ctx) => () => {
    const t = ctx.title, intBase = /integral/.test(t) || !/variable/.test(t) ? Math.random() < 0.6 : false, v_ = intBase ? String(ri(2, 5)) : pick(['x', 'a', 'n']), e1 = ri(2, 7), e2 = ri(2, 6), kind = /^Multiplication and division/.test(t) ? 'both' : /^Division/.test(t) ? 'div' : 'mul';
    if (kind === 'mul') return mc(`Simplify ${m(`${v_}<sup>${e1}</sup> × ${v_}<sup>${e2}</sup>`)}.`, `${v_}<sup>${e1 + e2}</sup>`, [`${v_}<sup>${e1 * e2}</sup>`, `${v_}<sup>${Math.abs(e1 - e2) || 1}</sup>`, `${intBase ? 2 * +v_ : '2' + v_}<sup>${e1 + e2}</sup>`], `Add the exponents: ${b(`${v_}^${e1 + e2}`)}.`, 4);
    if (kind === 'div') return mc(`Simplify ${m(`${v_}<sup>${e1 + e2}</sup> ÷ ${v_}<sup>${e2}</sup>`)}.`, `${v_}<sup>${e1}</sup>`, [`${v_}<sup>${(e1 + e2) / e2 | 0 || 1}</sup>`, `${v_}<sup>${e1 + 2 * e2}</sup>`, `${v_}<sup>${e1 * e2}</sup>`], `Subtract the exponents: ${b(`${v_}^${e1}`)}.`, 4);
    const e3 = ri(1, 4); return mc(`Simplify ${m(`${v_}<sup>${e1}</sup> × ${v_}<sup>${e2}</sup> ÷ ${v_}<sup>${e3}</sup>`)}.`, `${v_}<sup>${e1 + e2 - e3}</sup>`, [`${v_}<sup>${e1 + e2 + e3}</sup>`, `${v_}<sup>${e1 * e2 - e3}</sup>`, `${v_}<sup>${e1 - e2 - e3 || 1}</sup>`], `${e1} + ${e2} − ${e3} = ${b(e1 + e2 - e3)}.`, 4);
  }),
  R(/^Power rule(?: - integral bases| - variable bases| with rational exponents)?$/, (mt, ctx) => () => {
    const intB = /integral/.test(ctx.title), rational = /rational/.test(ctx.title), v_ = intB ? String(ri(2, 5)) : pick(['x', 'a', 'y']), e1 = ri(2, 5), e2 = ri(2, 4);
    if (rational) { const [n, d] = pick([[1, 2], [1, 3], [2, 3], [3, 2]]), k = pick([2, 3, 6]); const rn = n * k, rd = d; return mc(`Simplify ${m(`(${v_}<sup>${n}/${d}</sup>)<sup>${k}</sup>`)}.`, `${v_}<sup>${fs(...simp(n * k, d))}</sup>`.replace(/<sup>(\d+)\/1<\/sup>/, '<sup>$1</sup>'), [`${v_}<sup>${fs(n, d * k)}</sup>`, `${v_}<sup>${fs(n + k, d)}</sup>`, `${v_}<sup>${fs(n, d)}</sup>`], `Multiply the exponents: ${b(fs(...simp(n * k, d)))}.`, 4); }
    return mc(`Simplify ${m(`(${v_}<sup>${e1}</sup>)<sup>${e2}</sup>`)}.`, `${v_}<sup>${e1 * e2}</sup>`, [`${v_}<sup>${e1 + e2}</sup>`, `${v_}<sup>${e1}</sup>`, `${v_}<sup>${e1 ** e2}</sup>`], `Multiply the exponents: ${b(`${v_}^${e1 * e2}`)}.`, 4);
  }),
  R(/^Evaluate expressions using properties of exponents$/, () => () => {
    const a = ri(2, 4), e1 = ri(2, 4), e2 = ri(1, 3), val = a ** (e1 + e2);
    return num(`Evaluate ${m(`${a}<sup>${e1}</sup> × ${a}<sup>${e2}</sup>`)}.`, val, `${a}^${e1 + e2} = ${b(fmt(val))}.`);
  }),
  R(/^Identify equivalent expressions involving exponents$/, () => () => {
    const a = ri(2, 6), e1 = ri(2, 4), e2 = ri(2, 4);
    return mc(`Which expression is equivalent to ${m(`x<sup>${e1}</sup> · x<sup>${e2}</sup>`)}?`, `x<sup>${e1 + e2}</sup>`, [`x<sup>${e1 * e2}</sup>`, `(x<sup>${e1}</sup>)<sup>${e2}</sup>`, `2x<sup>${e1 + e2}</sup>`].filter(x => x !== `x<sup>${e1 * e2}</sup>` || e1 + e2 !== e1 * e2), `Add the exponents.`, 4);
  }),
  R(/^Evaluate rational exponents$|^Roots of integers$|^Roots of rational numbers$|^Nth roots$|^Find roots using a calculator$|^Cube roots$|^Square roots$|^Square roots of fractions and decimals$/, (mt, ctx) => () => {
    const t = ctx.title, n = ri(2, 4), base = ri(2, 9);
    if (/rational exponents/.test(t)) { const [p, q] = pick([[1, 2], [3, 2], [1, 3], [2, 3], [1, 4]]), root = ri(2, 5), arg = root ** q; const v_ = root ** p; return num(`Evaluate ${m(`${arg}<sup>${p}/${q}</sup>`)}.`, v_, `${arg}^(${p}/${q}) = (${q === 2 ? '√' : q === 3 ? '∛' : '⁴√'}${arg})^${p} = ${root}^${p} = ${b(v_)}.`); }
    if (/Square roots of fractions and decimals/.test(t)) return Math.random() < 0.5 ? num(`${m(`√${dec(base * base / 100, 2)}`)} = ?`, base / 10, `√${dec(base * base / 100, 2)} = ${b(base / 10)}.`) : mc(`${m(`√(${stack(base * base, (base + 1) ** 2)})`)} = ?`, fs(base, base + 1), [fs(base * base, base + 1), fs(base, (base + 1) ** 2), fs(base + 1, base)], `Take the root of the numerator and denominator: ${b(fs(base, base + 1))}.`, 4);
    if (/Cube/.test(t)) return num(`${m(`∛${base ** 3}`)} = ?`, base, `${base}³ = ${base ** 3}: ${b(base)}.`);
    if (/Nth/.test(t)) { const idx = pick([3, 4, 5]), bb = idx === 5 ? 2 : ri(2, 4), neg = idx % 2 === 1 && Math.random() < 0.4; return num(`${m(`<sup>${idx}</sup>√(${neg ? MINUS : ''}${bb ** idx})`)} = ?`, neg ? -bb : bb, `${bb}^${idx} = ${bb ** idx}: ${b(S(neg ? -bb : bb))}.`); }
    if (/rational numbers/.test(t)) return mc(`${m(`√(${stack(base * base, 36)})`)} = ?`, fs(...simp(base, 6)), [fs(base * base, 6), fs(base, 36), fs(...simp(base + 1, 6))], `√${base * base}/√36 = ${b(fs(...simp(base, 6)))}.`, 4);
    if (/calculator/.test(t)) { const x = ri(2, 40), r = Math.round(Math.sqrt(x) * 100) / 100; return num(`Use a calculator: ${m(`√${x}`)} ≈ ? (round to 2 decimals)`, r, `√${x} ≈ ${b(r)}.`); }
    return num(`${m(`√${base * base}`)} = ?`, base, `${base} × ${base} = ${base * base}: ${b(base)}.`);
  }),
  R(/^Operations with rational exponents$|^Multiplication with rational exponents$|^Division with rational exponents$|^Simplify expressions involving rational exponents(?: I| II)?$/, (mt, ctx) => () => {
    const [n1, d] = pick([[1, 2], [1, 3], [2, 3], [1, 4]]), n2 = ri(1, 3), v_ = pick(['x', 'a']), mulOp = !/Division/.test(ctx.title);
    const r1 = fs(n1, d), r2 = fs(n2, d), [sn, sd] = simp(mulOp ? n1 + n2 : Math.abs(n1 - n2) || 1, d), ans = sd === 1 ? String(sn) : fs(sn, sd);
    return mc(`Simplify ${m(`${v_}<sup>${r1}</sup> ${mulOp ? '·' : '÷'} ${v_}<sup>${r2}</sup>`)}.`, `${v_}<sup>${ans}</sup>`, [`${v_}<sup>${fs(n1 * n2, d)}</sup>`, `${v_}<sup>${fs(n1 + n2, d * 2)}</sup>`, `${v_}<sup>${fs(n1 + n2 + 1, d)}</sup>`], `${mulOp ? 'Add' : 'Subtract'} the exponents: ${b(ans)}.`, 4);
  }),
  R(/^Solve equations with rational exponents$/, () => () => {
    const [p, q] = pick([[1, 2], [3, 2], [2, 3]]), x = ri(2, 4) ** q;
    return num(`Solve ${m(`x<sup>${p}/${q}</sup> = ${fmt(Math.round(x ** (p / q)))}`)} for x.`, x, `Raise both sides to ${q}/${p}: x = ${b(x)}.`);
  }),
  R(/^Multiply numbers written in scientific notation$|^Divide numbers written in scientific notation$/, (mt, ctx) => () => {
    const mulOp = /Multiply/.test(ctx.title), a = ri(12, 49) / 10, c = ri(12, 49) / 10, e1 = ri(2, 7), e2 = ri(2, 6), r = mulOp ? a * c : a / c;
    let mant = fix(r, 3), ex = mulOp ? e1 + e2 : e1 - e2; while (mant >= 10) { mant = fix(mant / 10, 3); ex++; } while (mant < 1) { mant = fix(mant * 10, 3); ex--; }
    mant = fix(mant, 2); const ans = `${mant} × 10<sup>${S(ex)}</sup>`;
    return mc(`${m(`(${a} × 10<sup>${e1}</sup>) ${mulOp ? '×' : '÷'} (${c} × 10<sup>${e2}</sup>)`)} = ? (round the front number to 2 decimals)`, ans, uniq([`${mant} × 10<sup>${S(ex + 1)}</sup>`, `${mant} × 10<sup>${S(ex - 1)}</sup>`, `${fix(mant * 10, 2)} × 10<sup>${S(ex)}</sup>`]), `Combine the front numbers and the powers of 10 separately: ${b(ans)}.`, 4);
  }),

  /* ===== radicals ===== */
  R(/^Simplify radical expressions(?: with variables(?: I| II)?)?(?:: mixed review)?$|^Simplify square roots$/, (mt, ctx) => () => {
    const t = ctx.title, k = ri(2, 6), r = pick([2, 3, 5, 6, 7]), n = k * k * r;
    if (/variables/.test(t)) { const e = ri(2, 7), out = Math.floor(e / 2), rem = e % 2, ans = `${k}${sup('x', out)}${rem ? '√' + (r === 1 ? 'x' : r + 'x') : r > 1 ? '√' + r : ''}`; const inside = rem ? `${r}x` : `${r}`; return mc(`Simplify ${m(`√(${k * k * r}x<sup>${e}</sup>)`)}.`, `${k}${sup('x', out)}√${rem ? (r === 1 ? 'x' : r + 'x') : r}`.replace(/√1$/, ''), uniq([`${k}${sup('x', e)}√${r}`, `${k * k}${sup('x', out)}√${r}`, `${k}${sup('x', out + 1)}√${r}`]), `Pull out perfect squares: ${b(`${k}${sup('x', out)}√${rem ? (r === 1 ? 'x' : r + 'x') : r}`.replace(/√1$/, ''))}.`, 4); }
    return mc(`Simplify ${m(`√${n}`)}.`, rad(k, r), [rad(k * 2, r), rad(1, n), rad(r, k * k)].filter(x => x !== rad(k, r)), `√${n} = √${k * k} × √${r} = ${b(rad(k, r))}.`, 4);
  }),
  R(/^Simplify radical expressions by rationalizing the denominator$/, () => () => {
    const a = ri(1, 6), r = pick([2, 3, 5, 7]);
    return mc(`Rationalize the denominator: ${m(stack(a, `√${r}`))}`, `${a}√${r}/${r}`, [`${a}/${r}`, `${a}√${r}`, `√${r}/${a}`], `Multiply top and bottom by √${r}: ${b(`${a}√${r}/${r}`)}.`, 4);
  }),
  R(/^Multiply radical expressions$|^Divide radical expressions$/, (mt, ctx) => () => {
    const mulOp = /Multiply/.test(ctx.title), a = ri(2, 5), c = ri(2, 5), r = pick([2, 3, 5, 6, 7]), s = pick([2, 3, 5, 7]);
    if (mulOp) { const prod = r * s, [o, i] = simplifyRadical(prod); return mc(`${m(`${a}√${r} × ${c}√${s}`)} = ?`, rad(a * c * o, i), [rad(a + c, prod), rad(a * c, prod * prod), rad(a * c * o + 1, i)].filter(x => x !== rad(a * c * o, i)), `Multiply outside and inside: ${a * c}√${prod}${o > 1 ? ' = ' + rad(a * c * o, i) : ''}.`, 4); }
    const q = ri(2, 6); return mc(`${m(`√${q * q * r} ÷ √${r}`)} = ?`, String(q), [String(q * q), String(q + 1), `√${q}`], `√(${q * q * r}/${r}) = √${q * q} = ${b(q)}.`, 4);
  }),
  R(/^Add and subtract radical expressions$|^Simplify radical expressions using the distributive property$|^Simplify radical expressions using conjugates$/, (mt, ctx) => () => {
    const r = pick([2, 3, 5, 7]), a = ri(2, 7), c = ri(1, 7);
    if (/conjugates/.test(ctx.title)) { const k = ri(1, 6); return mc(`${m(`(${k} + √${r})(${k} − √${r})`)} = ?`, String(k * k - r), [String(k * k + r), String(k * k), `${k * k - r}√${r}`], `Difference of squares: ${k}² − ${r} = ${b(k * k - r)}.`, 4); }
    if (/distributive/.test(ctx.title)) { const s = pick([2, 3, 5]); return mc(`${m(`√${r}(${a} + √${s})`)} = ?`, `${a}√${r} + √${r * s}`, [`${a}√${r} + ${s}√${r}`, `${a}√${r * s}`, `${a + s}√${r}`], `Distribute: ${b(`${a}√${r} + √${r * s}`)}.`, 4); }
    const sub = Math.random() < 0.5; if (sub && a <= c) return null;
    return mc(`${m(`${a}√${r} ${sub ? '−' : '+'} ${c}√${r}`)} = ?`, `${sub ? a - c : a + c}√${r}`, [`${sub ? a + c : a - c}√${r}`, `${a * c}√${r}`, `${sub ? a - c : a + c}√${r * r}`], `Combine like radicals: ${b(`${sub ? a - c : a + c}√${r}`)}.`, 4);
  }),
  R(/^Domain and range of radical functions$/, () => () => {
    const h = ri(-5, 5), radicand = `x ${h < 0 ? '+' : MINUS} ${Math.abs(h)}`;
    return mc(`What is the domain of ${m(`f(x) = √(${radicand})`)}?`, `x ≥ ${S(h)}`, [`x ≥ ${S(-h)}`, `x > ${S(h)}`, 'all real numbers'].filter(v_ => v_ !== `x ≥ ${S(h)}`), `The radicand must be at least 0: ${radicand} ≥ 0 gives ${b(`x ≥ ${S(h)}`)}.`, 4);
  }),
  R(/^Solve radical equations$/, () => () => {
    const x = ri(2, 20), c = ri(1, 5), k = ri(2, 6); const rhs = Math.sqrt(x + k * 0); const r_ = ri(2, 7), val = r_ * r_ - c;
    return num(`Solve ${m(`√(x + ${c}) = ${r_}`)}.`, val, `Square both sides: x + ${c} = ${r_ * r_}, so x = ${b(val)}.`);
  }),

  /* ===== polynomials ===== */
  R(/^Polynomial vocabulary$|^Model polynomials with algebra tiles$/, (mt, ctx) => () => {
    const co = randPoly(ri(2, 4), -5, 5), txt = polyTxt(co), q = pick(['degree', 'terms', 'leading', 'constant']);
    if (/tiles/.test(ctx.title)) { const a = ri(1, 3), c = ri(1, 4), d = ri(1, 5); return mc(`${'🟦'.repeat(a)}${'🟩'.repeat(c)}${'🟨'.repeat(d)}<br>🟦 = x², 🟩 = x, 🟨 = 1. Which polynomial do the tiles show?`, polyTxt([a, c, d]), uniq([polyTxt([c, a, d]), polyTxt([a, d, c]), polyTxt([a, c, d + 1])]), `${a} x²-tiles, ${c} x-tiles and ${d} unit tiles: ${b(polyTxt([a, c, d]))}.`, 4); }
    if (q === 'degree') return num(`What is the ${b('degree')} of ${m(txt)}?`, co.length - 1, `The highest power of x is ${b(co.length - 1)}.`);
    if (q === 'leading') return num(`What is the ${b('leading coefficient')} of ${m(txt)}?`, co[0], `The coefficient of the highest-degree term is ${b(S(co[0]))}.`);
    if (q === 'constant') return num(`What is the ${b('constant term')} of ${m(txt)}?`, co[co.length - 1], `The term without x is ${b(S(co[co.length - 1]))}.`);
    return num(`How many ${b('terms')} does ${m(txt)} have?`, co.filter(c => c !== 0).length, `Count the non-zero terms: ${b(co.filter(c => c !== 0).length)}.`);
  }),
  R(/^Add and subtract polynomials(?: using algebra tiles)?$|^Add polynomials to find perimeter$/, (mt, ctx) => () => {
    const a = randPoly(2, -6, 6), c = randPoly(2, -6, 6), sub = /subtract/.test(ctx.title) && Math.random() < 0.5, res = sub ? padd(a, pneg(c)) : padd(a, c);
    if (/perimeter/.test(ctx.title)) { const p = randPoly(1, 1, 6), q = randPoly(1, 1, 6), per = pmul([2], padd(p, q)); return polyQ(`A rectangle has length ${m(polyTxt(p))} and width ${m(polyTxt(q))}. What is its perimeter?`, per, `P = 2(l + w) = %A.`); }
    return polyQ(`${m(`(${polyTxt(a)}) ${sub ? '−' : '+'} (${polyTxt(c)})`)} = ?`, res, `${sub ? 'Subtract' : 'Add'} like terms: %A.`);
  }),
  R(/^Multiply a polynomial by a monomial$|^Multiply polynomials to find area$/, (mt, ctx) => () => {
    const mono = [nz(-4, 5), ri(0, 2)], poly_ = randPoly(2, -5, 5), mTxt = polyTxt(Array(mono[1] + 1).fill(0).map((_, i) => (i === 0 ? mono[0] : 0))), prod = pmul(Array(mono[1] + 1).fill(0).map((_, i) => (i === 0 ? mono[0] : 0)), poly_);
    if (/area/.test(ctx.title)) { const l = randPoly(1, 1, 5), w = [ri(2, 4), 0]; return polyQ(`A rectangle has length ${m(polyTxt(l))} and width ${m(String(w[0]))}. What is its area?`, pmul(l, [w[0]]), `Distribute: %A.`); }
    return polyQ(`${m(`${mTxt}(${polyTxt(poly_)})`)} = ?`, prod, `Distribute the monomial: %A.`);
  }),
  R(/^Divide a polynomial by a monomial$/, () => () => {
    const d = nz(2, 5), co = [ri(1, 6) * d, ri(1, 6) * d, ri(1, 6) * d], q = co.map(x => x / d);
    return polyQ(`${m(`(${polyTxt(co)}) ÷ ${d}`)} = ?`, q, `Divide each term by ${d}: %A.`);
  }),
  R(/^Multiply two binomials$|^Multiply two binomials: special cases$|^Multiply two polynomials using algebra tiles$|^Multiply polynomials$|^Multiply binomials \(FOIL\)$/, (mt, ctx) => () => {
    const t = ctx.title, a = nz(-7, 7), c = nz(-7, 7), d = nz(-7, 7);
    if (/special/.test(t)) { const k = ri(1, 9), kind = pick(['sq', 'diff']); return kind === 'sq' ? polyQ(`${m(`(x + ${k})<sup>2</sup>`)} = ?`, [1, 2 * k, k * k], `(a + b)² = a² + 2ab + b²: %A.`) : polyQ(`${m(`(x + ${k})(x ${MINUS} ${k})`)} = ?`, [1, 0, -k * k], `Difference of squares: %A.`); }
    if (/^Multiply polynomials$/.test(t)) { const p = randPoly(2, -3, 4), q = randPoly(1, -3, 4); return polyQ(`${m(`(${polyTxt(p)})(${polyTxt(q)})`)} = ?`, pmul(p, q), `Multiply each term of the first by each term of the second and combine: %A.`); }
    const p1 = [ri(1, 3), a], p2 = [ri(1, 3), c]; return polyQ(`${m(`(${polyTxt(p1)})(${polyTxt(p2)})`)} = ?`, pmul(p1, p2), `FOIL: %A.`);
  }),
  R(/^Divide polynomials using long division$|^Divide polynomials using synthetic division$|^Divide polynomials$/, (mt, ctx) => () => {
    const r = nz(-5, 5), q = randPoly(1, 1, 4), dvd = pmul([1, -r], q);
    return polyQ(`${m(`(${polyTxt(dvd)}) ÷ (x ${r < 0 ? '+' : MINUS} ${Math.abs(r)})`)} = ?`, q, `Since ${polyTxt(dvd)} = (x ${r < 0 ? '+' : MINUS} ${Math.abs(r)})(${polyTxt(q)}), the quotient is %A.`);
  }),

  /* ===== factoring ===== */
  R(/^Factor quadratics(?: with leading coefficient 1)?$|^Factor quadratics: special cases$|^Factor using a quadratic pattern$|^Factor quadratics using algebra tiles$|^Factor quadratics with other leading coefficients$/, (mt, ctx) => () => {
    const t = ctx.title, p = nz(-8, 8), q = nz(-8, 8);
    const f = (a, c) => `(x ${a < 0 ? MINUS : '+'} ${Math.abs(a)})`;
    if (/special|pattern/.test(t)) { const k = ri(2, 9), kind = pick(['sq', 'diff']); return kind === 'sq' ? mc(`Factor ${m(polyTxt([1, 2 * k, k * k]))}.`, `(x + ${k})<sup>2</sup>`, [`(x + ${k})(x − ${k})`, `(x + ${2 * k})(x + ${k * k})`, `(x + ${k})(x + ${k + 1})`], `Perfect square trinomial: ${b(`(x + ${k})²`)}.`, 4) : mc(`Factor ${m(polyTxt([1, 0, -k * k]))}.`, `(x + ${k})(x − ${k})`, [`(x − ${k})<sup>2</sup>`, `(x + ${k})<sup>2</sup>`, `(x + ${k * k})(x − 1)`], `Difference of squares: ${b(`(x + ${k})(x − ${k})`)}.`, 4); }
    if (/other leading/.test(t)) { const a = ri(2, 4), c = ri(1, 4), r1 = nz(-4, 4), r2 = nz(-4, 4); if (gcd(a, Math.abs(r1)) !== 1 || gcd(c, Math.abs(r2)) !== 1 || a * c === 1) return null; const co = pmul([a, r1], [c, r2]); const good = `(${polyTxt([a, r1])})(${polyTxt([c, r2])})`; return mc(`Factor ${m(polyTxt(co))}.`, good, uniq([`(${polyTxt([a, -r1])})(${polyTxt([c, r2])})`, `(${polyTxt([a, r1])})(${polyTxt([c, -r2])})`, `(${polyTxt([a * c, r1])})(${polyTxt([1, r2])})`]).filter(v_ => v_ !== good), `Check by multiplying: ${b(good)}.`, 4); }
    const good = `${f(p)}${f(q)}`, co = pmul([1, p], [1, q]); const alt = uniq([`${f(-p)}${f(-q)}`, `${f(p)}${f(-q)}`, `${f(p + q)}${f(p * q)}`]).filter(v_ => v_ !== good && v_ !== `${f(q)}${f(p)}`);
    return mc(`Factor ${m(polyTxt(co))}.`, good, alt, `${p} + ${q} = ${p + q} and ${p} × ${q} = ${p * q}: ${b(good)}.`, 4);
  }),
  R(/^Factor by grouping$|^Factor polynomials$/, () => () => {
    const a = nz(2, 5), c = nz(1, 6), d = nz(1, 5), co = pmul([1, a], [1, 0, c]);   // (x + a)(x² + c)
    return mc(`Factor ${m(polyTxt(co))} by grouping.`, `(x + ${a})(x<sup>2</sup> + ${c})`, [`(x − ${a})(x<sup>2</sup> + ${c})`, `(x + ${a})(x<sup>2</sup> − ${c})`, `(x + ${c})(x<sup>2</sup> + ${a})`], `Group: x²(x + ${a}) + ${c}(x + ${a}) = ${b(`(x + ${a})(x² + ${c})`)}.`, 4);
  }),
  R(/^Factor sums and differences of cubes$|^Solve equations with sums and differences of cubes$/, (mt, ctx) => () => {
    const k = ri(1, 5), sum_ = Math.random() < 0.5, cube = k ** 3;
    if (/Solve/.test(ctx.title)) return num(`Solve ${m(`x³ ${sum_ ? '+' : MINUS} ${cube} = 0`)}. What is the real solution?`, sum_ ? -k : k, `x³ = ${sum_ ? MINUS : ''}${cube}, so x = ${b(S(sum_ ? -k : k))}.`);
    const ans = sum_ ? `(x + ${k})(x² − ${k}x + ${k * k})` : `(x − ${k})(x² + ${k}x + ${k * k})`;
    return mc(`Factor ${m(`x³ ${sum_ ? '+' : MINUS} ${cube}`)}.`, ans, uniq([sum_ ? `(x + ${k})(x² + ${k}x + ${k * k})` : `(x − ${k})(x² − ${k}x + ${k * k})`, sum_ ? `(x − ${k})(x² − ${k}x + ${k * k})` : `(x + ${k})(x² + ${k}x + ${k * k})`, `(x ${sum_ ? '+' : '−'} ${k})³`]), `${sum_ ? 'Sum' : 'Difference'} of cubes pattern: ${b(ans)}.`, 4);
  }),
  R(/^Solve equations using a quadratic pattern$/, () => () => {
    const k = ri(2, 9); return num(`Solve ${m(`x² + ${2 * k}x + ${k * k} = 0`)}.`, -k, `(x + ${k})² = 0, so x = ${b(S(-k))}.`);
  }),

  /* ===== quadratic equations & parabolas ===== */
  R(/^Solve a quadratic equation using square roots$/, () => () => {
    const k = ri(2, 12), c = ri(1, 9); return mc(`Solve ${m(`x² = ${k * k}`)}.`, `x = ±${k}`, [`x = ${k}`, `x = ±${k * k}`, `x = ±${k / 2}`.replace('.5', '½')], `Take the square root of both sides: ${b(`x = ±${k}`)}.`, 4);
  }),
  R(/^Solve a quadratic equation by factoring$|^Solve a quadratic equation using the zero product property$/, () => () => {
    const r1 = nz(-8, 8), r2 = nz(-8, 8); if (r1 === r2) return null; const co = pmul([1, -r1], [1, -r2]), ans = `x = ${S(Math.min(r1, r2))}, ${S(Math.max(r1, r2))}`;
    return mc(`Solve ${m(`${polyTxt(co)} = 0`)}.`, ans, uniq([`x = ${S(-Math.min(r1, r2))}, ${S(-Math.max(r1, r2))}`, `x = ${S(r1 + r2)}, ${S(r1 * r2)}`, `x = ${S(-r1)}, ${S(r2)}`]).filter(v_ => v_ !== ans), `Factor: (x ${r1 < 0 ? '+' : MINUS} ${Math.abs(r1)})(x ${r2 < 0 ? '+' : MINUS} ${Math.abs(r2)}) = 0, so ${b(ans)}.`, 4);
  }),
  R(/^Complete the square$|^Solve a quadratic equation by completing the square$/, (mt, ctx) => () => {
    const b_ = 2 * ri(1, 6), h = b_ / 2;
    if (/Solve/.test(ctx.title)) { const k = ri(1, 10), good = `x = ${S(-h)} ± √${k + h * h}`; return mc(`Solve ${m(`x² + ${b_}x = ${k}`)} by completing the square.`, good, uniq([`x = ${S(h)} ± √${k + h * h}`, `x = ${S(-b_)} ± √${k}`, `x = ${S(-h)} ± √${k}`]), `Add ${h * h} to both sides: (x + ${h})² = ${k + h * h}, so ${b(good)}.`, 4); }
    return num(`What number must be added to ${m(`x² + ${b_}x`)} to complete the square?`, h * h, `(${b_} ÷ 2)² = ${b(h * h)}.`);
  }),
  R(/^Solve a quadratic equation using the quadratic formula$|^Using the discriminant$/, (mt, ctx) => () => {
    const a = ri(1, 3), c0 = ri(-6, 6), b_ = ri(-8, 8), disc = b_ * b_ - 4 * a * c0;
    if (/discriminant/.test(ctx.title)) { const type = disc > 0 ? 'Two real solutions' : disc === 0 ? 'One real solution' : 'No real solutions'; return mc(`The equation ${m(`${polyTxt([a, b_, c0])} = 0`)} has discriminant ${b(disc)}. How many real solutions does it have?`, type, ['Two real solutions', 'One real solution', 'No real solutions'].filter(v_ => v_ !== type), `b² − 4ac = ${disc} ${disc > 0 ? '> 0' : disc === 0 ? '= 0' : '< 0'}.`, 3); }
    const r1 = nz(-6, 6), r2 = nz(-6, 6), A = a, B = -a * (r1 + r2), Cc = a * r1 * r2; const ans = `x = ${S(Math.min(r1, r2))}, ${S(Math.max(r1, r2))}`;
    return mc(`Use the quadratic formula to solve ${m(`${polyTxt([A, B, Cc])} = 0`)}.`, ans, uniq([`x = ${S(-Math.min(r1, r2))}, ${S(-Math.max(r1, r2))}`, `x = ${S(r1 + r2)}, ${S(r1 * r2)}`, `x = ${S(r1)}, ${S(-r2)}`]).filter(v_ => v_ !== ans), `x = (−b ± √(b² − 4ac)) / 2a gives ${b(ans)}.`, 4);
  }),
  R(/^Characteristics of quadratic functions$|^Find the maximum or minimum value of a quadratic function$|^Identify the direction a parabola opens$|^Find the vertex of a parabola$|^Find the axis of symmetry of a parabola$|^Find properties of parabolas$/, (mt, ctx) => () => {
    const a = nz(-3, 3), h = nz(-6, 6), k = nz(-8, 8), std = pmul([a], pmul([1, -h], [1, -h])).map((x, i, arr) => (i === arr.length - 1 ? x + k : x)), t = ctx.title;
    const f = `${polyTxt(std).replace(/^/, '')}`;
    if (/direction/.test(t)) return mc(`Which way does ${m(`y = ${polyTxt(std)}`)} open?`, a > 0 ? 'Upward' : 'Downward', [a > 0 ? 'Downward' : 'Upward'], `a = ${S(a)} is ${a > 0 ? 'positive' : 'negative'}, so it opens ${a > 0 ? 'upward' : 'downward'}.`, 2);
    if (/axis/.test(t)) return num(`What is the axis of symmetry of ${m(`y = ${polyTxt(std)}`)}? (x = ?)`, h, `x = −b/2a = ${b(S(h))}.`);
    if (/maximum or minimum/.test(t)) return num(`What is the ${a > 0 ? 'minimum' : 'maximum'} value of ${m(`y = ${polyTxt(std)}`)}?`, k, `The vertex is (${S(h)}, ${S(k)}), so the ${a > 0 ? 'minimum' : 'maximum'} value is ${b(S(k))}.`);
    if (/vertex/.test(t)) return mc(`What is the vertex of ${m(`y = ${a === 1 ? '' : S(a)}(x ${h < 0 ? '+' : MINUS} ${Math.abs(h)})² ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`)}?`, `(${S(h)}, ${S(k)})`, [`(${S(-h)}, ${S(k)})`, `(${S(h)}, ${S(-k)})`, `(${S(k)}, ${S(h)})`], `Vertex form y = a(x − h)² + k has vertex (h, k): ${b(`(${S(h)}, ${S(k)})`)}.`, 4);
    return mc(`For ${m(`y = ${polyTxt(std)}`)}, which statement is true?`, a > 0 ? 'The parabola opens upward and has a minimum' : 'The parabola opens downward and has a maximum', [a > 0 ? 'The parabola opens downward and has a maximum' : 'The parabola opens upward and has a minimum', 'The parabola is a straight line'], `The sign of a (${S(a)}) decides the direction.`, 3);
  }),
  R(/^Complete a function table: quadratic functions$|^Evaluate quadratic functions$/, () => () => {
    const a = nz(-3, 3), c = nz(-4, 4), d = nz(-5, 5), x = ri(-3, 4);
    return num(`${m(`f(x) = ${polyTxt([a, c, d])}`)}. Find ${m(`f(${S(x)})`)}.`, pEval([a, c, d], x), `f(${S(x)}) = ${b(S(pEval([a, c, d], x)))}.`);
  }),
  R(/^Write a quadratic function in standard form from its vertex and another point$|^Write equations of parabolas in vertex form(?: from graphs| using properties)?$/, (mt, ctx) => () => {
    const h = ri(-4, 4), k = ri(-5, 5), a = nz(-3, 3), x = h + nz(1, 3), y = a * (x - h) ** 2 + k;
    return num(`A parabola has vertex ${b(`(${S(h)}, ${S(k)})`)} and passes through ${b(`(${S(x)}, ${S(y)})`)}. In ${m(`y = a(x ${h < 0 ? '+' : MINUS} ${Math.abs(h)})² ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`)}, what is ${b('a')}?`, a, `${S(y)} = a(${S(x - h)})² ${k < 0 ? '−' : '+'} ${Math.abs(k)} gives a = ${b(S(a))}.`);
  }),
  R(/^Graph parabolas$|^Graph quadratic functions in vertex form$|^Graph quadratic functions in standard form$|^Graph a quadratic function$|^Match quadratic functions and graphs$/, (mt, ctx) => () => {
    const h = ri(-3, 3), k = ri(-3, 3), a = pick([1, -1]), vf = (aa, hh, kk) => `y = ${aa < 0 ? MINUS : ''}${hh === 0 ? 'x²' : `(x ${hh < 0 ? '+' : MINUS} ${Math.abs(hh)})²`} ${kk < 0 ? MINUS : '+'} ${Math.abs(kk)}`;
    const pts = [-2, -1, 0, 1, 2].map(d => ({ x: h + d, y: a * d * d + k, color: C.primary }));
    return mc(`${plane({ min: -8, max: 8, points: pts, labelEvery: 2, size: 300 })}Which function has this graph?`, vf(a, h, k), uniq([vf(-a, h, k), vf(a, -h || 1, k), vf(a, h, -k || 1)]).filter(v_ => v_ !== vf(a, h, k)), `The vertex is (${S(h)}, ${S(k)}) and it opens ${a > 0 ? 'upward' : 'downward'}: ${b(vf(a, h, k))}.`, 4);
  }),

  /* ===== rational expressions ===== */
  R(/^Rational functions: asymptotes and excluded values$/, () => () => {
    const a = nz(-6, 6), c = nz(-5, 5);
    return mc(`For ${m(`f(x) = ${stack(c === 1 ? 'x' : `${S(c)}`, `x ${a < 0 ? '+' : MINUS} ${Math.abs(a)}`)}`)}, what is the excluded value (vertical asymptote)?`, `x = ${S(a)}`, [`x = ${S(-a)}`, `x = ${S(c)}`, `x = 0`].filter(v_ => v_ !== `x = ${S(a)}`), `The denominator is zero when x = ${b(S(a))}.`, 4);
  }),
  R(/^Simplify rational expressions$|^Multiply and divide rational expressions$|^Add and subtract rational expressions$|^Simplify complex fractions$/, (mt, ctx) => () => {
    const a = ri(1, 6), c = ri(1, 6); if (a === c) return null; const t = ctx.title;
    if (/Simplify rational/.test(t)) return mc(`Simplify ${m(stack(`(x + ${a})(x ${MINUS} ${c})`, `(x + ${a})(x + ${c})`))}.`, `(x − ${c})/(x + ${c})`, [`(x + ${a})/(x + ${c})`, `(x − ${c})/(x + ${a})`, `−1`], `Cancel the common factor (x + ${a}): ${b(`(x − ${c})/(x + ${c})`)}.`, 4);
    if (/Multiply and divide/.test(t)) return mc(`${m(`${stack('x', `x + ${a}`)} × ${stack(`x + ${a}`, `x ${MINUS} ${c}`)}`)} = ?`, `x/(x − ${c})`, [`x/(x + ${a})`, `x(x + ${a})/(x − ${c})`, `(x + ${a})/(x − ${c})`], `Cancel (x + ${a}): ${b(`x/(x − ${c})`)}.`, 4);
    if (/complex/.test(t)) return mc(`Simplify the complex fraction ${m(stack(`1/${a}`, `1/${c}`))}.`, fs(c, a), [fs(a, c), fs(1, a * c), fs(a + c, 1)], `(1/${a}) ÷ (1/${c}) = ${c}/${a}.`, 4);
    const D = lcm(a, c); return mc(`${m(`${stack(1, `x`)} + ${stack(1, `${a}`)}`)} = ?`, `(${a} + x)/(${a}x)`, [`2/(x + ${a})`, `(1 + ${a})/x`, `1/(${a}x)`], `Common denominator ${a}x: ${b(`(${a} + x)/(${a}x)`)}.`, 4);
  }),
  R(/^Solve rational equations$/, () => () => {
    const a = ri(2, 6), q = nz(-6, 7), c = ri(1, 8), x = a * q, rhs = q + c;
    return num(`Solve ${m(`${stack('x', a)} + ${c} = ${S(rhs)}`)}. What is x?`, x, `Subtract ${c}: x/${a} = ${S(q)}, so x = ${b(S(x))}.`);
  }),
  R(/^Evaluate rational expressions I{1,2}$/, () => () => {
    const x = ri(2, 9), a = ri(1, 5), c = ri(1, 5); const num_ = x + a, den = x - c + 0 * 0 + 0; if (den === 0) return null; const [n, d] = simp(num_, den); return mc(`Evaluate ${m(stack(`x + ${a}`, `x ${MINUS} ${c}`))} when x = ${b(x)}.`, d === 1 ? String(n) : d < 0 ? fs(-n, -d) : fs(n, d), uniq([fs(num_, den + 1), fs(num_ + 1, den), fs(den, num_)]).filter(v_ => v_ !== fs(n, d)), `(${x} + ${a}) / (${x} − ${c}) = ${b(d === 1 ? n : fs(n, d))}.`, 4);
  }),

  /* ===== higher-degree polynomials (Grade 12) ===== */
  R(/^Find the roots of factored polynomials$|^Write a polynomial from its roots$/, (mt, ctx) => () => {
    const r = sample([-4, -3, -2, -1, 1, 2, 3, 4], 3).sort((a, c) => a - c);
    if (/Write/.test(ctx.title)) { const co = pmul(pmul([1, -r[0]], [1, -r[1]]), [1, -r[2]]); return polyQ(`Which polynomial has roots ${b(r.map(S).join(', '))}?`, co, `Multiply the factors (x − r): %A.`); }
    return mc(`Find the roots of ${m(`(x ${r[0] < 0 ? '+' : MINUS} ${Math.abs(r[0])})(x ${r[1] < 0 ? '+' : MINUS} ${Math.abs(r[1])})(x ${r[2] < 0 ? '+' : MINUS} ${Math.abs(r[2])}) = 0`)}.`, r.map(S).join(', '), uniq([r.map(x => S(-x)).join(', '), r.map(x => S(x + 1)).join(', '), r.map(x => S(x * 2)).join(', ')]), `Set each factor to zero: ${b(r.map(S).join(', '))}.`, 4);
  }),
  R(/^Rational root theorem$/, () => () => {
    const a0 = pick([4, 6, 8, 9, 10, 12]), lead = pick([2, 3, 4]), divs = n => range(1, n).filter(k => n % k === 0), p = pick(divs(a0)), q = pick(divs(lead)), good = q === 1 ? String(p) : fs(p, q);
    const bad = uniq([`${a0 + 1}/${lead}`, `${lead}/${a0 + 1}`, `${a0 + 5}`]).filter(v_ => v_ !== good);
    return mc(`For ${m(`${lead}x³ + x² + x + ${a0}`)}, which is a possible rational root according to the Rational Root Theorem?`, good, bad, `A possible root is (a factor of ${a0}) ÷ (a factor of ${lead}), such as ${b(good)}.`, 4);
  }),
  R(/^Descartes' Rule of Signs$/, () => () => {
    const co = [1, -nz(1, 5), nz(1, 5), -nz(1, 5)]; let changes = 0; for (let i = 1; i < co.length; i++) if (Math.sign(co[i]) !== Math.sign(co[i - 1])) changes++;
    return mc(`How many sign changes are in ${m(polyTxt(co))}? (This is the maximum number of positive real roots.)`, String(changes), [String(changes + 1), String(Math.max(0, changes - 1)), '0'].filter(v_ => v_ !== String(changes)), `Count sign changes between consecutive coefficients: ${b(changes)}.`, 4);
  }),
  R(/^Fundamental Theorem of Algebra$/, () => () => {
    const n = ri(3, 8); return num(`A polynomial of degree ${b(n)} has exactly how many complex roots (counting multiplicity)?`, n, `A degree-${n} polynomial has ${b(n)} complex roots.`);
  }),
  R(/^Complex conjugate theorem$|^Conjugate root theorems$/, () => () => {
    const a = ri(1, 5), c = ri(1, 4); return mc(`A polynomial with real coefficients has ${b(`${a} + ${c}i`)} as a root. Which must also be a root?`, `${a} − ${c}i`, [`${-a} + ${c}i`, `${-a} − ${c}i`, `${c} + ${a}i`], `Complex roots come in conjugate pairs: ${b(`${a} − ${c}i`)}.`, 4);
  }),
  R(/^Match polynomials and graphs$/, () => () => {
    const deg = ri(2, 5), lead = pick([1, -1]); const end = lead > 0 ? (deg % 2 ? 'falls to the left and rises to the right' : 'rises on both ends') : deg % 2 ? 'rises to the left and falls to the right' : 'falls on both ends';
    return mc(`Describe the end behaviour of ${m(`y = ${lead < 0 ? MINUS : ''}x<sup>${deg}</sup> + x`)}.`, end, ['falls to the left and rises to the right', 'rises on both ends', 'rises to the left and falls to the right', 'falls on both ends'].filter(v_ => v_ !== end), `Degree ${deg} (${deg % 2 ? 'odd' : 'even'}) with ${lead > 0 ? 'positive' : 'negative'} leading coefficient.`, 4);
  }),
  R(/^Even and odd functions$/, () => () => {
    const kind = pick(['even', 'odd', 'neither']), f = { even: `x<sup>4</sup> + x<sup>2</sup>`, odd: `x<sup>3</sup> − x`, neither: `x<sup>2</sup> + x` }[kind];
    return mc(`Is ${m(`f(x) = ${f}`)} even, odd or neither?`, kind, ['even', 'odd', 'neither'].filter(v_ => v_ !== kind), kind === 'even' ? 'f(−x) = f(x).' : kind === 'odd' ? 'f(−x) = −f(x).' : 'f(−x) is neither f(x) nor −f(x).', 3);
  }),
  R(/^Pascal's triangle$|^Pascal's triangle and the Binomial Theorem$/, () => () => {
    const n = ri(3, 7), k = ri(1, n - 1), C_ = (nn, kk) => { let r = 1; for (let i = 1; i <= kk; i++) r = (r * (nn - kk + i)) / i; return Math.round(r); };
    return num(`In row ${b(n)} of Pascal's triangle (starting at row 0), what is the entry in position ${b(k)} (starting at position 0)?`, C_(n, k), `${n} choose ${k} = ${b(C_(n, k))}.`);
  }),
  R(/^Binomial Theorem I{1,2}$/, () => () => {
    const n = ri(3, 5), a = ri(1, 3), C_ = (nn, kk) => { let r = 1; for (let i = 1; i <= kk; i++) r = (r * (nn - kk + i)) / i; return Math.round(r); }, k = ri(1, n - 1);
    return num(`What is the coefficient of ${m(`x<sup>${n - k}</sup>`)} in the expansion of ${m(`(x + ${a})<sup>${n}</sup>`)}?`, C_(n, k) * a ** k, `C(${n},${k}) × ${a}^${k} = ${b(C_(n, k) * a ** k)}.`);
  }),

  /* ===== complex numbers ===== */
  R(/^Introduction to complex numbers$|^Powers of i$|^Absolute values of complex numbers$|^Complex conjugates$/, (mt, ctx) => () => {
    const a = nz(-6, 6), c = nz(-6, 6), t = ctx.title, cx = (x, y) => `${S(x)}${y < 0 ? ` ${MINUS} ${Math.abs(y) === 1 ? '' : Math.abs(y)}i` : ` + ${y === 1 ? '' : y}i`}`;
    if (/Powers of i/.test(t)) { const e = ri(2, 30), r = [1, 'i', -1, '−i'][e % 4]; return mc(`${m(`i<sup>${e}</sup>`)} = ?`, String(r), ['1', 'i', '−1', '−i'].filter(v_ => v_ !== String(r)), `Powers of i repeat every 4: i^${e % 4} = ${b(r)}.`, 4); }
    if (/Absolute/.test(t)) { const [p, q] = pick([[3, 4], [5, 12], [6, 8], [8, 15]]); return num(`${m(`|${p} + ${q}i|`)} = ?`, Math.hypot(p, q), `√(${p}² + ${q}²) = ${b(Math.hypot(p, q))}.`); }
    if (/conjugates/.test(t)) return mc(`What is the conjugate of ${m(cx(a, c))}?`, cx(a, -c), [cx(-a, c), cx(-a, -c), cx(c, a)], `Change the sign of the imaginary part: ${b(cx(a, -c))}.`, 4);
    return mc(`What is ${m('i²')}?`, '−1', ['1', 'i', '−i'], `By definition i² = ${b('−1')}.`, 4);
  }),
  R(/^Add and subtract complex numbers$|^Multiply and divide complex numbers$|^Add, subtract, multiply and divide complex numbers$|^Add complex numbers$/, (mt, ctx) => () => {
    const a = nz(-6, 6), c = nz(-6, 6), d = nz(-6, 6), e = nz(-6, 6), cx = (x, y) => `${S(x)}${y < 0 ? ` ${MINUS} ${Math.abs(y)}i` : ` + ${y}i`}`, t = ctx.title;
    const op = /multiply and divide|Multiply and divide/.test(t) ? pick(['×']) : /Add and subtract|Add complex/.test(t) ? pick(['+', '−']) : pick(['+', '−', '×']);
    let rr, ri_; if (op === '+') { rr = a + d; ri_ = c + e; } else if (op === '−') { rr = a - d; ri_ = c - e; } else { rr = a * d - c * e; ri_ = a * e + c * d; }
    return mc(`${m(`(${cx(a, c)}) ${op} (${cx(d, e)})`)} = ?`, cx(rr, ri_), uniq([cx(rr, -ri_), cx(-rr, ri_), cx(rr + 1, ri_), cx(a + d, c + e)]).filter(v_ => v_ !== cx(rr, ri_)), `Combine${op === '×' ? ' with i² = −1' : ' like terms'}: ${b(cx(rr, ri_))}.`, 4);
  }),
  R(/^Introduction to the complex plane$|^Graph complex numbers$|^Graph complex conjugates$/, () => () => {
    const a = nz(-6, 6), c = nz(-6, 6); return mc(`${plane({ min: -8, max: 8, points: [{ x: a, y: c, label: 'z' }], labelEvery: 2, size: 280 })}Which complex number is graphed? (Real part on the horizontal axis, imaginary on the vertical axis.)`, `${a} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}i`.replace('-', MINUS), [`${c} ${a < 0 ? MINUS : '+'} ${Math.abs(a)}i`, `${-a} ${c < 0 ? MINUS : '+'} ${Math.abs(c)}i`, `${a} ${c < 0 ? '+' : MINUS} ${Math.abs(c)}i`].map(v_ => v_.replace('-', MINUS)), `Real part ${S(a)}, imaginary part ${S(c)}.`, 4);
  }),
  R(/^Addition in the complex plane$|^Subtraction in the complex plane$|^Midpoints in the complex plane$|^Distance in the complex plane$|^Absolute value in the complex plane$/, (mt, ctx) => () => {
    const a = ri(-5, 5), c = ri(-5, 5), d = ri(-5, 5), e = ri(-5, 5), t = ctx.title;
    if (/Midpoints/.test(t)) return num(`What is the real part of the midpoint of ${b(`${a} + ${c}i`)} and ${b(`${d} + ${e}i`)}?`, (a + d) / 2, `(${a} + ${d}) ÷ 2 = ${b((a + d) / 2)}.`);
    if (/Distance/.test(t)) { const [p, q] = pick([[3, 4], [6, 8], [5, 12]]); return num(`What is the distance between ${b('0')} and ${b(`${p} + ${q}i`)} in the complex plane?`, Math.hypot(p, q), `√(${p}² + ${q}²) = ${b(Math.hypot(p, q))}.`); }
    if (/Absolute/.test(t)) { const [p, q] = pick([[3, 4], [5, 12], [8, 15]]); return num(`Find ${m(`|${p} − ${q}i|`)} using the complex plane.`, Math.hypot(p, q), `√(${p}² + ${q}²) = ${b(Math.hypot(p, q))}.`); }
    const sub = /Subtraction/.test(t), re = sub ? a - d : a + d, im = sub ? c - e : c + e; return mc(`What is ${m(`(${a} + ${c}i) ${sub ? '−' : '+'} (${d} + ${e}i)`.replace(/\+ -/g, '+ ').replace(/-/g, MINUS))}?`, `${re} ${im < 0 ? MINUS : '+'} ${Math.abs(im)}i`.replace('-', MINUS), [`${re} ${im < 0 ? '+' : MINUS} ${Math.abs(im)}i`, `${-re} ${im < 0 ? MINUS : '+'} ${Math.abs(im)}i`, `${im} ${re < 0 ? MINUS : '+'} ${Math.abs(re)}i`].map(v_ => v_.replace('-', MINUS)), `Combine real and imaginary parts separately.`, 4);
  }),
  R(/^Find the modulus and argument of a complex number$|^Convert complex numbers (?:from )?(?:rectangular to polar|polar to rectangular|between rectangular and polar) form$|^Match polar equations and graphs$/, (mt, ctx) => () => {
    const [p, q] = pick([[3, 4], [5, 12], [8, 6]]), t = ctx.title, r = Math.hypot(p, q), th = Math.round((Math.atan2(q, p) * 180) / Math.PI);
    if (/modulus/.test(t)) return num(`What is the modulus of ${m(`${p} + ${q}i`)}?`, r, `√(${p}² + ${q}²) = ${b(r)}.`);
    if (/polar to rectangular/.test(t)) { const rr = ri(2, 8), ang = pick([0, 90, 180, 270]), x = Math.round(rr * Math.cos((ang * Math.PI) / 180)), y = Math.round(rr * Math.sin((ang * Math.PI) / 180)); return mc(`Convert ${m(`${rr}(cos ${ang}° + i sin ${ang}°)`)} to rectangular form.`, `${x} ${y < 0 ? MINUS : '+'} ${Math.abs(y)}i`.replace(/^-/, MINUS), uniq([`${y} ${x < 0 ? MINUS : '+'} ${Math.abs(x)}i`, `${-x} ${y < 0 ? '+' : MINUS} ${Math.abs(y)}i`, `${rr} + 0i`]).filter(v_ => v_ !== `${x} ${y < 0 ? MINUS : '+'} ${Math.abs(y)}i`), `Use x = r cos θ and y = r sin θ.`, 4); }
    if (/Match polar/.test(t)) { const rr = ri(2, 6); return mc(`Which shape does the polar equation ${m(`r = ${rr}`)} graph?`, `A circle of radius ${rr} centred at the origin`, ['A line through the origin', 'A spiral', `A circle of radius ${rr * 2}`], `Every point is ${rr} units from the origin.`, 4); }
    return num(`${m(`${p} + ${q}i`)} in polar form is r(cos θ + i sin θ). What is r? (modulus)`, r, `r = √(${p}² + ${q}²) = ${b(r)}.`);
  })
];
function coef_(p) { return p === 1 ? '' : String(p); }
export { polyTxt, pmul, padd, pEval, simplifyRadical, rad };
