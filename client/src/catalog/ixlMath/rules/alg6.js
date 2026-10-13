/* Algebra for Grades 6–12: expressions, equivalent expressions, equations, inequalities, two-variable relationships,
   linear functions, proportional relationships and sequences. */
import { ri, pick, shuffle, sample, range, uniq, sum, m, b, fmt, fix, dec, num, mc, yesNo, near, svg, C, NAMES, gcd, table, plane, MINUS } from '../h.js';
import { R } from '../engine.js';
import { evalExpr, S, P, nz } from './numsys.js';
import { stack, fs, simp } from './fractions.js';
import { ineqLine } from './algebra.js';

const coef = (a, v = 'x') => (a === 1 ? v : a === -1 ? MINUS + v : S(a) + v);
/** linear expression  a x + c  as text */
const lin = (a, c, v = 'x') => (a === 0 ? S(c) : `${coef(a, v)}${c === 0 ? '' : c > 0 ? ` + ${c}` : ` ${MINUS} ${-c}`}`);
const eqn = (l, r) => `${l} = ${r}`;
const distinct = (...xs) => uniq(xs.map(String));
const ineqSym = rel => rel;
const flip = rel => ({ '>': '<', '<': '>', '≥': '≤', '≤': '≥' }[rel]);

export const ALG6_RULES = [
  /* ===== evaluating & describing expressions ===== */
  R(/^Evaluate (?:simple |linear |linear one-variable |one-variable |multi-variable |nonlinear |absolute value |radical |rational )?(?:variable )?expressions?(?: with (?:whole numbers|decimals))?$/, (mt, ctx) => () => {
    const t = ctx.title, x = ctx.grade <= 6 && !/decimals/.test(t) ? ri(2, 9) : nz(-6, 9), y = ri(2, 8), a = ri(2, 6), c = ri(1, 9);
    let ex, val, vars = `x = ${S(x)}`;
    if (/multi-variable/.test(t)) { ex = pick([`${a}x + ${c}y`, `x² + y`, `${a}xy − ${c}`, `x(y + ${c})`]); val = evalExpr(ex.replace(/x²/g, `(${x})**2`).replace(/xy/g, `*${x}*${y}`).replace(/([0-9])x/g, `$1*${P(x)}`).replace(/x\(/g, `${P(x)}*(`).replace(/x/g, `(${x})`).replace(/([0-9)])y/g, `$1*${y}`).replace(/y/g, `${y}`)); vars = `x = ${S(x)}, y = ${y}`; ex = ex; }
    else if (/absolute value/.test(t)) { ex = pick([`|x − ${c}| + ${a}`, `${a}|x| − ${c}`, `|${a}x + ${c}|`]); val = evalExpr(ex.replace(/\|([^|]+)\|/g, (_, g) => `Math.abs(${g})`).replace(/([0-9])x/g, `$1*(${x})`).replace(/x/g, `(${x})`)); }
    else if (/radical/.test(t)) { const k = ri(2, 9); const xx = k * k - c; ex = `√(x + ${c})`; val = k; vars = `x = ${xx}`; }
    else if (/rational/.test(t)) { const q = ri(2, 6); const xx = q * a - c; ex = `(x + ${c}) ÷ ${a}`; val = q; vars = `x = ${xx}`; }
    else if (/nonlinear/.test(t)) { ex = pick([`x² + ${a}x`, `${a}x² − ${c}`, `x³ − ${c}`]); val = evalExpr(ex.replace(/x²/g, `(${x})**2`).replace(/x³/g, `(${x})**3`).replace(/([0-9])x/g, `$1*(${x})`).replace(/x/g, `(${x})`)); }
    else if (/decimals/.test(t)) { const xd = ri(11, 49) / 10; ex = pick([`${a}x + ${c}`, `x ${MINUS} 0.5`, `${a}x`]); val = fix(evalExpr(ex.replace(/−/g, '-').replace(/([0-9])x/g, `$1*${xd}`).replace(/x/g, `${xd}`)), 4); vars = `x = ${dec(xd, 1)}`; }
    else { ex = pick([`${a}x + ${c}`, `${a}x ${MINUS} ${c}`, `${c} + ${a}x`, `${a}(x + ${c})`, `x ÷ ${1} + ${c}`.replace(' ÷ 1', '')]); val = evalExpr(ex.replace(/−/g, '-').replace(/([0-9])x/g, `$1*(${x})`).replace(/\)\(/g, ')*(').replace(/([0-9])\(/g, `$1*(`).replace(/x/g, `(${x})`)); }
    if (!Number.isFinite(val)) return null;
    return num(`Evaluate ${m(ex)} when ${b(vars)}.`, val, `Substitute and simplify: ${b(S(val))}.`);
  }),
  R(/^Evaluate variable expressions for number sequences$/, () => () => {
    const a = ri(2, 6), c = ri(1, 9), n = ri(3, 10);
    return num(`The ${b('n')}th term of a sequence is ${m(`${a}n + ${c}`)}. What is the ${b(n + 'th')} term?`, a * n + c, `${a} × ${n} + ${c} = ${b(a * n + c)}.`);
  }),
  R(/^Identify terms and coefficients$/, () => () => {
    const a = ri(2, 9), c = ri(2, 9), d = ri(1, 9), ex = `${a}x + ${c}y ${MINUS} ${d}`, q = pick(['terms', 'coeffx', 'coeffy', 'const']);
    if (q === 'terms') return num(`How many terms are in ${m(ex)}?`, 3, `The terms are ${a}x, ${c}y and ${MINUS}${d}: ${b(3)}.`);
    if (q === 'coeffx') return num(`What is the coefficient of ${b('x')} in ${m(ex)}?`, a, `The number multiplying x is ${b(a)}.`);
    if (q === 'coeffy') return num(`What is the coefficient of ${b('y')} in ${m(ex)}?`, c, `The number multiplying y is ${b(c)}.`);
    return num(`What is the constant term in ${m(ex)}?`, -d, `The term without a variable is ${b(S(-d))}.`);
  }),
  R(/^Sort factors of expressions$|^Factors of linear expressions$/, (mt, ctx) => () => {
    const g = ri(2, 6), p = ri(1, 5), q = ri(1, 5); if (gcd(p, q) !== 1) return null;
    if (/Sort/.test(ctx.title)) return mc(`Which of these is a factor of ${m(`${g * p}x + ${g * q}`)}?`, String(g), distinct(g + 1, g * p + 1, p + q + g).filter(v_ => v_ !== String(g)), `Both ${g * p} and ${g * q} are divisible by ${g}.`, 4);
    return mc(`Factor ${m(`${g * p}x + ${g * q}`)}.`, `${g}(${coef(p)} + ${q})`, [`${g}(${coef(p * g)} + ${q})`, `${g + 1}(${coef(p)} + ${q})`, `${p}(${coef(g)} + ${q})`].filter(v_ => v_ !== `${g}(${coef(p)} + ${q})`), `Take out the greatest common factor ${g}: ${b(`${g}(${coef(p)} + ${q})`)}.`, 4);
  }),
  R(/^Write variable expressions from diagrams$/, () => () => {
    const a = ri(2, 9);
    return mc(`A bar is split into two parts: one part is ${b('x')} and the other is ${b(a)}. Which expression gives the total length?`, `x + ${a}`, [`x − ${a}`, `${a}x`, `x ÷ ${a}`], `Add the two parts: ${b(`x + ${a}`)}.`, 4);
  }),

  /* ===== equivalent expressions ===== */
  R(/^Identify equivalent expressions(?: using strip models)?$|^Identify equivalent linear expressions(?: using algebra tiles|: word problems)?$/, (mt, ctx) => () => {
    const a = ri(2, 5), c = ri(1, 6), good = `${a}x + ${a * c}`, e = `${a}(x + ${c})`;
    return mc(`Which expression is equivalent to ${m(e)}?`, good, [`${a}x + ${c}`, `${a + c}x`, `x + ${a * c}`].filter(v_ => v_ !== good), `Distribute the ${a}: ${a}x + ${a * c}.`, 4);
  }),
  R(/^Simplify linear expressions$|^Simplify variable expressions using properties$|^Write equivalent expressions using properties$/, (mt, ctx) => () => {
    const a = ri(2, 5), c = ri(1, 6), d = ri(1, 5), e = nz(-6, 6), ex = `${a}(x + ${c}) + ${d}x ${e < 0 ? MINUS : '+'} ${Math.abs(e)}`, A = a + d, Cc = a * c + e;
    const ans = lin(A, Cc); return mc(`Simplify ${m(ex)}.`, ans, uniq([lin(A, a * c - e), lin(a * d, Cc), lin(A, c + e)]).filter(v_ => v_ !== ans), `Distribute and combine like terms: ${b(ans)}.`, 4);
  }),
  R(/^Add and subtract like terms$|^Add and subtract like terms with exponents$|^Combine like terms$/, (mt, ctx) => () => {
    const a = nz(-8, 8), c = nz(-8, 8), d = nz(-5, 5), e = pick(/exponents/.test(ctx.title) ? ['x²', 'x³', 'y²'] : ['x', 'y', 'n']), sumC = a + c;
    if (sumC === 0) return null;
    const tail = k => ` ${k < 0 ? MINUS : '+'} ${Math.abs(k)}`, ex = `${coef(a, e)} ${c < 0 ? MINUS : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}${e}${tail(d)}`, ans = coef(sumC, e) + tail(d);
    return mc(`Simplify ${m(ex)}.`, ans, uniq([coef(a - c, e) + tail(d), coef(sumC + 1, e) + tail(d), coef(sumC, e) + tail(-d)]).filter(v_ => v_ !== ans), `Add the ${e}-terms (${S(a)} + ${S(c)} = ${S(sumC)}): ${b(ans)}.`, 4);
  }),
  R(/^Multiply using the distributive property(?:: area models)?$/, (mt, ctx) => () => {
    const a = ri(2, 9), c = ri(2, 9), d = ri(1, 9);
    return mc(`Use the distributive property: ${m(`${a}(${coef(c)} + ${d})`)} = ?`, `${coef(a * c)} + ${a * d}`, [`${coef(a * c)} + ${d}`, `${coef(a + c)} + ${a * d}`, `${coef(a * c)} + ${a + d}`].filter(v_ => v_ !== `${coef(a * c)} + ${a * d}`), `${a} × ${coef(c)} = ${coef(a * c)} and ${a} × ${d} = ${a * d}.`, 4);
  }),
  R(/^Factor linear expressions: area models$/, () => () => {
    const g = ri(2, 6), p = ri(1, 5), q = ri(1, 6);
    return mc(`An area model has total area ${m(`${g * p}x + ${g * q}`)} and one side of length ${b(g)}. What is the other side?`, `${coef(p)} + ${q}`, [`${coef(g * p)} + ${q}`, `${coef(p)} + ${g * q}`, `${coef(p + 1)} + ${q}`].filter(v_ => v_ !== `${coef(p)} + ${q}`), `Divide each term by ${g}: ${b(`${coef(p)} + ${q}`)}.`, 4);
  }),
  R(/^Solve equations using properties$|^Properties of equality$/, () => () => {
    const x = ri(2, 12), a = ri(2, 9), step = pick(['add', 'sub', 'mul']), eq_ = step === 'add' ? `x − ${a} = ${x - a}` : step === 'sub' ? `x + ${a} = ${x + a}` : `x ÷ ${a} = ${x}`;
    const op = step === 'add' ? `Add ${a} to both sides` : step === 'sub' ? `Subtract ${a} from both sides` : `Multiply both sides by ${a}`;
    return mc(`What is the first step to solve ${m(eq_)}?`, op, [`Subtract ${a} from both sides`, `Add ${a} to both sides`, `Multiply both sides by ${a}`, `Divide both sides by ${a}`].filter(v_ => v_ !== op), `To undo the operation on x: ${b(op.toLowerCase())}.`, 4);
  }),
  R(/^Solve for a variable using properties of multiplication$/, () => () => {
    const a = ri(2, 9), x = ri(2, 12);
    return num(`${m(`${a} × x = ${a * x}`)}. What is x?`, x, `${a * x} ÷ ${a} = ${b(x)}.`);
  }),

  /* ===== one-variable equations ===== */
  R(/^Which x satisfies an equation\?$/, () => () => {
    const x = nz(-9, 12), a = ri(2, 6), c = ri(1, 9), eq_ = `${coef(a)} + ${c} = ${a * x + c}`; return mc(`Which value of x makes ${m(eq_)} true?`, S(x), distinct(S(x + 1), S(x - 1), S(-x)).filter(v_ => v_ !== S(x) && v_ !== '0'), `Substitute x = ${S(x)}: ${a}(${S(x)}) + ${c} = ${a * x + c}.`, 4);
  }),
  R(/^Solve one-step equations(?: with (?:whole numbers|decimals))?$|^Solve one-step equations: word problems$/, (mt, ctx) => () => {
    const t = ctx.title, kind = pick(['+', '−', '×', '÷']), dec_ = /decimals/.test(t), x = dec_ ? ri(11, 99) / 10 : ctx.grade >= 7 ? nz(-12, 15) : ri(2, 15), a = dec_ ? ri(11, 49) / 10 : ri(2, 12);
    let eq_, ans = x; const f = v_ => (dec_ ? dec(v_, 1) : S(v_));
    if (kind === '+') eq_ = `x + ${f(a)} = ${f(fix(x + a, 2))}`; else if (kind === '−') eq_ = `x − ${f(a)} = ${f(fix(x - a, 2))}`; else if (kind === '×' && !dec_) eq_ = `${a}x = ${S(a * x)}`; else if (!dec_) { eq_ = `x ÷ ${a} = ${S(x)}`; ans = x * a; } else { eq_ = `x + ${f(a)} = ${f(fix(x + a, 2))}`; }
    if (/word/.test(t)) { const nm = pick(NAMES), y = ri(3, 20), z = ri(2, 15); return num(`${nm} had some money. After spending $${z}, ${nm} has $${y}. How much did ${nm} have at first? ($)`, y + z, `x − ${z} = ${y}, so x = ${b(y + z)}.`); }
    return num(`Solve for ${b('x')}. ${m(eq_)}`, ans, `Use the inverse operation: x = ${b(dec_ ? dec(ans, 1) : S(ans))}.`);
  }),
  R(/^Solve two-step equations$|^Solve one and two-step equations with decimals$|^Solve two-step equations: word problems$|^Solve one- and two-step equations: word problems$/, (mt, ctx) => () => {
    const t = ctx.title, x = nz(-9, 12), a = nz(2, 7), c = nz(-12, 12);
    if (/word/.test(t)) { const nm = pick(NAMES), per = ri(2, 9), fee = ri(3, 15), n = ri(2, 10); return num(`${nm} pays a $${fee} fee plus $${per} for each game. The total was $${fee + per * n}. How many games did ${nm} play?`, n, `${per}g + ${fee} = ${fee + per * n}, so g = ${b(n)}.`); }
    if (/decimals/.test(t)) { const xd = ri(11, 49) / 10, ad = ri(2, 6), cd = ri(1, 9) / 10; return num(`Solve ${m(`${ad}x + ${dec(cd, 1)} = ${dec(fix(ad * xd + cd, 2), 2).replace(/0+$/, '')}`)}.`, xd, `x = ${b(dec(xd, 1))}.`); }
    const rhs = a * x + c;
    return num(`Solve for ${b('x')}. ${m(eqn(lin(a, c), S(rhs)))}`, x, `Subtract ${S(c)}, then divide by ${a}: x = ${b(S(x))}.`);
  }),
  R(/^Solve equations involving like terms$/, () => () => {
    const x = nz(-8, 9), a = ri(2, 6), c = ri(2, 6), d = nz(-9, 9), rhs = (a + c) * x + d;
    return num(`Solve for ${b('x')}. ${m(`${a}x + ${c}x ${d < 0 ? MINUS : '+'} ${Math.abs(d)} = ${S(rhs)}`)}`, x, `Combine like terms: ${a + c}x ${d < 0 ? '−' : '+'} ${Math.abs(d)} = ${S(rhs)}, so x = ${b(S(x))}.`);
  }),
  R(/^Solve equations with variables on both sides$/, () => () => {
    const x = nz(-8, 9), a = ri(3, 9), c = ri(1, a - 1), d = nz(-9, 9), e = (a - c) * x + d;       // a·x + d = c·x + e
    return num(`Solve for ${b('x')}. ${m(`${lin(a, d)} = ${lin(c, e)}`)}`, x, `Subtract ${coef(c)} from both sides: ${lin(a - c, d)} = ${S(e)}, so x = ${b(S(x))}.`);
  }),
  R(/^Solve equations: complete the solution$/, () => () => {
    const x = nz(-8, 10), a = ri(2, 7), c = ri(1, 12), rhs = a * x + c;
    return num(`Complete the solution.<br>${m(`${a}x + ${c} = ${S(rhs)}`)}<br>${m(`${a}x = ___`)}`, rhs - c, `Subtract ${c} from both sides: ${S(rhs)} − ${c} = ${b(S(rhs - c))}.`);
  }),
  R(/^Solve multi-step equations$/, () => () => {
    const x = nz(-8, 9), a = ri(2, 5), c = ri(1, 6), d = ri(1, 5), rhs = a * (x + c) + d * x;
    return num(`Solve for ${b('x')}. ${m(`${a}(x + ${c}) + ${d}x = ${S(rhs)}`)}`, x, `Distribute: ${a + d}x + ${a * c} = ${S(rhs)}, so x = ${b(S(x))}.`);
  }),
  R(/^Solve equations: word problems$|^Solve one-step equations: word problems$/, () => () => {
    const x = ri(3, 15), a = ri(2, 6), nm = pick(NAMES);
    return num(`${nm} buys ${a} identical books and pays $${a * x}. What is the price of one book? ($)`, x, `${a}x = ${a * x}, so x = ${b(x)}.`);
  }),
  R(/^Rearrange multi-variable equations$/, () => () => {
    const a = ri(2, 6), c = ri(1, 9), good = `y = ${c} ${MINUS} ${coef(a)}`;
    return mc(`Solve ${m(`${coef(a)} + y = ${c}`)} for ${b('y')}.`, good, [`y = ${c} + ${coef(a)}`, `y = ${coef(a)} ${MINUS} ${c}`, `y = ${coef(c)} ${MINUS} ${a}`], `Subtract ${coef(a)} from both sides: ${b(good)}.`, 4);
  }),
  /* ===== inequalities ===== */
  R(/^Solve two-step inequalities$|^Solve multi-step inequalities$/, (mt, ctx) => () => {
    const x = nz(-8, 9), a = nz(-6, 6), c = nz(-9, 9), rel = pick(['>', '<', '≥', '≤']); if (a === 0) return null;
    const rhs = a * x + c, final = a < 0 ? flip(rel) : rel, ans = `x ${final} ${S(x)}`;
    return mc(`Solve ${m(`${lin(a, c)} ${rel} ${S(rhs)}`)}.`, ans, uniq([`x ${rel} ${S(x)}`, `x ${final} ${S(-x)}`, `x ${flip(final)} ${S(x)}`]).filter(v_ => v_ !== ans), a < 0 ? `Dividing by a negative number flips the inequality: ${b(ans)}.` : `${b(ans)}.`, 4);
  }),
  R(/^Graph solutions to (?:two-step|multi-step) inequalities$/, () => () => {
    const x = ri(-3, 8), a = ri(2, 5), c = nz(-9, 9), rel = pick(['>', '<', '≥', '≤']), rhs = a * x + c, dir = rel === '>' || rel === '≥' ? 'right' : 'left', closed = rel === '≥' || rel === '≤';
    return mc(`${ineqLine({ val: x, dir, closed, lo: -5, hi: 10 })}Which inequality does the graph show?`, `x ${rel} ${S(x)}`, uniq([`x ${flip(rel)} ${S(x)}`, `x ${rel} ${S(rhs)}`, `x ${rel === '>' ? '≥' : rel === '<' ? '≤' : rel === '≥' ? '>' : '<'} ${S(x)}`]).filter(v_ => v_ !== `x ${rel} ${S(x)}`), `The graph shows ${b(`x ${rel} ${S(x)}`)}.`, 4);
  }),
  R(/^One-step inequalities: word problems$|^Write and graph inequalities: word problems$/, () => () => {
    const n = ri(5, 30), q = pick([['at least', '≥'], ['more than', '>'], ['at most', '≤'], ['fewer than', '<']]), nm = pick(NAMES);
    return mc(`${nm} needs ${b(q[0] + ' ' + n)} points to win. Let p be ${nm}'s points. Which inequality represents this?`, `p ${q[1]} ${n}`, ['≥', '>', '≤', '<'].filter(s => s !== q[1]).map(s => `p ${s} ${n}`), `"${q[0]}" means ${b(q[1])}.`, 4);
  }),

  /* ===== two-variable relationships & linear functions ===== */
  R(/^Does \(x, y\) satisfy (?:an|the) (?:linear function|equation)\?$/, () => () => {
    const a = ri(1, 5), c = nz(-6, 6), x = ri(-4, 6), sat = Math.random() < 0.5, y = a * x + c + (sat ? 0 : pick([-2, -1, 1, 2]));
    return yesNo(`Does the point ${b(`(${S(x)}, ${S(y)})`)} satisfy ${m(`y = ${lin(a, c)}`)}?`, sat, sat ? `y = ${a}(${S(x)}) + ${S(c)} = ${S(a * x + c)} ✓.` : `When x = ${S(x)}, y should be ${S(a * x + c)}, not ${S(y)}.`, ['Yes', 'No']);
  }),
  R(/^Identify independent and dependent variables$/, () => () => {
    const q = pick([['The cost C of buying n pencils', 'n', 'C'], ['The distance d travelled in t hours', 't', 'd'], ['The amount A earned from working h hours', 'h', 'A'], ['The height H of a plant after w weeks', 'w', 'H']]);
    return mc(`${q[0]}. Which variable is the ${b('independent')} variable?`, q[1], [q[2]], `The independent variable (${q[1]}) is the one you choose; ${q[2]} depends on it.`, 2);
  }),
  R(/^Complete a table for a (?:two-variable relationship|linear function)$|^Find a value using two-variable equations(?:: word problems)?$|^Solve word problems involving two-variable equations$/, (mt, ctx) => () => {
    const a = ri(2, 6), c = nz(-5, 9), xs = [0, 1, 2, 3, 4].slice(0, 4), hole = ri(1, 3);
    if (/word/.test(ctx.title)) { const nm = pick(NAMES), n = ri(2, 8), per = ri(2, 9), fee = ri(2, 9); return num(`${nm}'s total cost is ${m(`C = ${per}n + ${fee}`)}, where n is the number of items. What is C when n = ${n}?`, per * n + fee, `${per} × ${n} + ${fee} = ${b(per * n + fee)}.`); }
    return num(`${table(['x', 'y'], xs.map((x, i) => [x, i === hole ? '?' : a * x + c]))}The rule is ${m(`y = ${lin(a, c)}`)}. What is the missing y-value?`, a * xs[hole] + c, `${a}(${xs[hole]}) + ${S(c)} = ${b(S(a * xs[hole] + c))}.`);
  }),
  R(/^Write a (?:two-variable equation|linear function from a table)$|^Write an equation from a graph using a table$|^Write linear functions: word problems$/, (mt, ctx) => () => {
    const a = ri(2, 6), c = nz(-4, 8), xs = [0, 1, 2, 3];
    if (/word/.test(ctx.title)) { const nm = pick(NAMES); return mc(`${nm} saves $${c > 0 ? c : 5} at the start and then $${a} each week. Which equation gives the total savings y after x weeks?`, `y = ${a}x + ${c > 0 ? c : 5}`, [`y = ${(c > 0 ? c : 5)}x + ${a}`, `y = ${a}x ${MINUS} ${c > 0 ? c : 5}`, `y = ${a + (c > 0 ? c : 5)}x`], `Start amount + ${a} per week: ${b(`y = ${a}x + ${c > 0 ? c : 5}`)}.`, 4); }
    const good = `y = ${lin(a, c)}`;
    return mc(`${table(['x', 'y'], xs.map(x => [x, a * x + c]))}Which equation matches the table?`, good, uniq([`y = ${lin(a + 1, c)}`, `y = ${lin(a, -c || 1)}`, `y = ${lin(c || 2, a)}`]).filter(v_ => v_ !== good), `The y-values go up by ${a} each step and y = ${S(c)} when x = 0: ${b(good)}.`, 4);
  }),
  R(/^Identify the graph of an equation$/, () => () => {
    const a = ri(1, 3), c = ri(0, 4), pts = [0, 1, 2, 3].map(x => ({ x, y: a * x + c, color: C.primary }));
    return mc(`${plane({ min: 0, max: 10, points: pts, lines: [[0, c, 4, a * 4 + c]] })}Which equation does the graph show?`, `y = ${lin(a, c)}`, uniq([`y = ${lin(a + 1, c)}`, `y = ${lin(a, c + 2)}`, `y = ${lin(c || 2, a)}`]).filter(v_ => v_ !== `y = ${lin(a, c)}`), `The line crosses the y-axis at ${c} and rises ${a} per step: ${b(`y = ${lin(a, c)}`)}.`, 4);
  }),
  R(/^Complete a table from a graph$|^Graph patterns using rules$|^Complete a table and graph (?:a two-variable equation|a linear function)$|^Graph a (?:two-variable equation|line from an equation)$|^Interpret a graph: word problems$|^Interpret the graph of a linear function: word problems$/, (mt, ctx) => () => {
    const a = ri(1, 3), c = ri(0, 4), x = ri(1, 4), pts = [0, 1, 2, 3, 4].map(k => ({ x: k, y: a * k + c, color: C.primary }));
    return num(`${plane({ min: 0, max: 14, points: pts, labelEvery: 2, lines: [[0, c, 4, 4 * a + c]] })}Use the graph. What is the y-value when x = ${b(x)}?`, a * x + c, `Read up from x = ${x} to the line: y = ${b(a * x + c)}.`);
  }),
  R(/^(?:Constant )?[Rr]ate of change: (?:tables|graphs)$/, (mt, ctx) => () => {
    const a = nz(-5, 6), c = nz(-4, 8), xs = [0, 2, 4, 6];
    if (/graphs/.test(ctx.title)) { const aa = ri(1, 4), cc = ri(0, 3); return num(`${plane({ min: 0, max: 14, points: [0, 1, 2, 3].map(k => ({ x: k, y: aa * k + cc, color: C.primary })), lines: [[0, cc, 4, 4 * aa + cc]], labelEvery: 2 })}What is the rate of change (the slope) of the line?`, aa, `The line rises ${aa} for every 1 across: slope = ${b(aa)}.`); }
    return num(`${table(['x', 'y'], xs.map(x => [x, a * x + c]))}What is the rate of change (change in y ÷ change in x)?`, a, `${S(a * 2)} ÷ 2 = ${b(S(a))}.`);
  }),

  /* ===== proportional relationships ===== */
  R(/^Find the constant of proportionality from a (?:table|graph)$|^Write equations for proportional relationships from (?:tables|graphs)$|^Write and solve equations for proportional relationships$|^Identify proportional relationships(?: by graphing| from graphs and equations| from tables)?$|^Interpret graphs of proportional relationships$|^Graph proportional relationships$|^Complete a table and graph a proportional relationship$/, (mt, ctx) => () => {
    const k = ri(2, 9), xs = [1, 2, 3, 4], t = ctx.title;
    if (/Identify/.test(t)) { const prop = Math.random() < 0.5, c0 = prop ? 0 : ri(1, 5); return yesNo(`${table(['x', 'y'], xs.map(x => [x, k * x + c0]))}Is the relationship between x and y proportional?`, prop, prop ? `y ÷ x is always ${k}: proportional.` : `y ÷ x changes (${fix((k + c0) / 1, 2)}, ${fix((2 * k + c0) / 2, 2)}, …): not proportional.`, ['Yes', 'No']); }
    if (/graph|Graph/.test(t)) { const pts = [0, 1, 2, 3].map(x => ({ x, y: k * x, color: C.primary })); if (k * 3 > 20) return null; return num(`${plane({ min: 0, max: Math.max(10, k * 3 + 1), points: pts, labelEvery: 2 })}The points lie on a straight line through the origin. What is the constant of proportionality (y ÷ x)?`, k, `y ÷ x = ${k} for every point: ${b(k)}.`); }
    if (/Write equations/.test(t)) return mc(`${table(['x', 'y'], xs.map(x => [x, k * x]))}Which equation matches the table?`, `y = ${k}x`, [`y = x + ${k}`, `y = ${k + 1}x`, `y = x ÷ ${k}`], `y ÷ x = ${k}, so ${b(`y = ${k}x`)}.`, 4);
    if (/solve/.test(t)) { const x = ri(2, 9); return num(`${m(`y = ${k}x`)}. Find x when y = ${b(k * x)}.`, x, `${k * x} ÷ ${k} = ${b(x)}.`); }
    return num(`${table(['x', 'y'], xs.map(x => [x, k * x]))}What is the constant of proportionality?`, k, `${k * 2} ÷ 2 = ${b(k)}.`);
  }),

  /* ===== sequences ===== */
  R(/^Identify arithmetic and geometric sequences$/, () => () => {
    const geo = Math.random() < 0.5, a = ri(2, 6), r = ri(2, 4), seq = range(0, 4).map(i => (geo ? a * r ** i : a + i * r * 2));
    return mc(`Is this sequence arithmetic or geometric?<br>${m(seq.join(', ') + ', …')}`, geo ? 'Geometric' : 'Arithmetic', [geo ? 'Arithmetic' : 'Geometric', 'Neither'], geo ? `Each term is multiplied by ${r}.` : `Each term adds ${r * 2}.`, 3);
  }),
  R(/^Arithmetic sequences$|^Write variable expressions for arithmetic sequences$|^Complete an arithmetic number sequence$/, (mt, ctx) => () => {
    const a = nz(-5, 12), d = nz(-6, 7), n = ri(5, 12), seq = range(0, 3).map(i => a + i * d);
    if (/Write variable/.test(ctx.title)) { const good = lin(d, a - d, 'n'); return mc(`${m(seq.map(S).join(', ') + ', …')} is an arithmetic sequence. Which expression gives the nth term?`, good, uniq([lin(d, a, 'n'), lin(a, d, 'n'), lin(d, a + d, 'n')]).filter(v_ => v_ !== good), `The nth term is a + (n − 1)d = ${good}.`, 4); }
    if (/Complete/.test(ctx.title)) return num(`Fill in the blank: ${m(`${S(seq[0])}, ${S(seq[1])}, ___, ${S(seq[3])}`)}`, seq[2], `The common difference is ${S(d)}: the missing term is ${b(S(seq[2]))}.`);
    return num(`${m(seq.map(S).join(', ') + ', …')} is an arithmetic sequence. What is the ${b(n + 'th')} term?`, a + (n - 1) * d, `a + (n − 1)d = ${S(a)} + ${n - 1}(${S(d)}) = ${b(S(a + (n - 1) * d))}.`);
  }),
  R(/^Geometric sequences$/, () => () => {
    const a = ri(1, 5), r = pick([2, 3, -2]), n = ri(4, 6), seq = range(0, 3).map(i => a * r ** i);
    return num(`${m(seq.map(S).join(', ') + ', …')} is a geometric sequence. What is the ${b(n + 'th')} term?`, a * r ** (n - 1), `${a} × ${P(r)}^${n - 1} = ${b(S(a * r ** (n - 1)))}.`);
  }),
  R(/^Extend a shape pattern$/, () => () => {
    const a = ri(1, 4), s = ri(1, 3), rows = range(0, 2).map(i => a + i * s);
    return num(`Row 1 has ${rows[0]} squares, row 2 has ${rows[1]} and row 3 has ${rows[2]}. If the pattern continues, how many squares are in row 5?`, a + 4 * s, `Each row adds ${s}: ${a} + 4 × ${s} = ${b(a + 4 * s)}.`);
  })
];
