// Lesson engine for exponential & logarithmic equations.
// Each lesson is a sequence of frames: { left: [chips], right: [chips], note }.
// Pure functions — unit-testable without a browser.
import { ri, pick } from './skills.js';

const MINUS = '−';
const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', 'x': 'ˣ', '+': '⁺' };
const SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
export const sup = s => String(s).split('').map(c => SUP[c] || c).join('');
export const sub = s => String(s).split('').map(c => SUB[c] || c).join('');
export const fmtNum = n => String(n).replace('-', MINUS);
const sgn = n => (n < 0 ? `${MINUS} ${-n}` : `+ ${n}`);

export const LESSON_KINDS = [
  { id: 'exp1', label: 'bˣ = v',        name: 'Basic exponential equation' },
  { id: 'exp2', label: 'bˣ⁺ᵏ = v',      name: 'Exponential with shifted exponent' },
  { id: 'log1', label: 'log_b(x) = m',  name: 'Basic logarithm equation' },
  { id: 'log2', label: 'log_b(x+k) = m', name: 'Logarithm with an offset' }
];

export function generateLesson(kind) {
  if (kind === 'exp1') {
    const b = pick([2, 3, 5]);
    const x = ri(2, b === 5 ? 3 : 5);
    const v = Math.pow(b, x);
    return {
      title: 'Solve ' + b + sup('x') + ' = ' + v,
      solution: x,
      frames: [
        { left: [b + sup('x')], right: [String(v)], note: `Goal: get the same base on both sides so we can compare exponents.` },
        { left: [b + sup('x')], right: [b + sup(x)], note: `Rewrite ${v} as a power of ${b}: &nbsp;${v} = ${b}${sup(x)}.` },
        { left: ['x'], right: [String(x)], note: `Same base, equal values → the exponents must be equal: x = ${x}.` }
      ],
      check: `Check: ${b}${sup(x)} = ${v} ✓`
    };
  }
  if (kind === 'exp2') {
    const b = pick([2, 3]);
    const k = ri(1, 3);
    const x = ri(1, 4);
    const mExp = x + k;
    const v = Math.pow(b, mExp);
    return {
      title: 'Solve ' + b + sup('x+' + k) + ' = ' + v,
      solution: x,
      frames: [
        { left: [b + sup(`x+${k}`)], right: [String(v)], note: 'Goal: same base on both sides.' },
        { left: [b + sup(`x+${k}`)], right: [b + sup(mExp)], note: `Rewrite ${v} as a power of ${b}: &nbsp;${v} = ${b}${sup(mExp)}.` },
        { left: ['x', `+ ${k}`], right: [String(mExp)], note: `Equal bases → exponents equal: x + ${k} = ${mExp}.` },
        { left: ['x'], right: [String(x)], note: `Subtract ${k} from both sides: x = ${mExp} − ${k} = ${x}.` }
      ],
      check: `Check: ${x} + ${k} = ${mExp}, and ${b}${sup(mExp)} = ${v} ✓`
    };
  }
  if (kind === 'log1') {
    const b = pick([2, 3, 5]);
    const mExp = ri(2, b === 5 ? 3 : 4);
    const x = Math.pow(b, mExp);
    return {
      title: 'Solve log' + sub(b) + '(x) = ' + mExp,
      solution: x,
      frames: [
        { left: [`log${sub(b)}(x)`], right: [String(mExp)], note: `A logarithm asks: "${b} to what power gives x?"` },
        { left: ['x'], right: [`${b}${sup(mExp)}`], note: `Convert to exponential form: log${sub(b)}(x) = ${mExp} means x = ${b}${sup(mExp)}.` },
        { left: ['x'], right: [String(x)], note: `Evaluate the power: ${b}${sup(mExp)} = ${x}.` }
      ],
      check: `Check: log${sub(b)}(${x}) = ${mExp} because ${b}${sup(mExp)} = ${x} ✓`
    };
  }
  // log2
  const b = pick([2, 3]);
  const mExp = ri(2, 3);
  const v = Math.pow(b, mExp);
  const k = ri(1, v - 1);
  const x = v - k;
  return {
    title: `Solve log${sub(b)}(x + ${k}) = ${mExp}`,
    solution: x,
    frames: [
      { left: [`log${sub(b)}(x`, `+ ${k})`], right: [String(mExp)], note: 'The whole expression inside the log is what the power produces.' },
      { left: ['x', `+ ${k}`], right: [`${b}${sup(mExp)}`], note: `Convert to exponential form: x + ${k} = ${b}${sup(mExp)}.` },
      { left: ['x', `+ ${k}`], right: [String(v)], note: `Evaluate the power: ${b}${sup(mExp)} = ${v}.` },
      { left: ['x'], right: [String(x)], note: `Subtract ${k} from both sides: x = ${v} − ${k} = ${x}.` }
    ],
    check: `Check: ${x} + ${k} = ${v}, and log${sub(b)}(${v}) = ${mExp} ✓`
  };
}

export { sgn };
