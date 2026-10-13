/* ============================================================
   Word-problem stories shared by every grade. story(kind, p) returns
   { text, eq, ans, a, b, c } where `eq` is the matching number sentence
   (with ? for the unknown) and `ans` the numeric answer.
   ============================================================ */
import { ri, pick, sample, thing, NAMES, fmt, cap } from './h.js';

const nm = () => pick(NAMES);
const two = () => sample(NAMES, 2);
const unit = (n, t) => (n === 1 ? t[0] : t[1]);

const PLACES_ = ['in the box', 'on the shelf', 'in the basket', 'on the table', 'in the bag'];
const PRICE_ITEMS = [['notebook', '📓'], ['toy', '🧸'], ['book', '📘'], ['kite', '🪁'], ['puzzle', '🧩'], ['hat', '🧢']];

/** one draw of the requested kind. p = { a, b } operands already chosen by the caller (c is derived). */
export const STORIES = {
  /* ----- addition / subtraction ----- */
  addJoin: ({ a, b }) => {
    const [n1, n2] = two(), t = thing();
    return { text: `${n1} has ${fmt(a)} ${unit(a, t)}. ${n2} gives ${n1} ${fmt(b)} more. How many ${t[1]} does ${n1} have now?`, eq: `${a} + ${b} = ?`, ans: a + b, emoji: t[2] };
  },
  addTotal: ({ a, b }) => {
    const t = thing(), col = sample(['red', 'blue', 'green', 'yellow', 'purple'], 2);
    return { text: `There are ${fmt(a)} ${col[0]} ${t[1]} and ${fmt(b)} ${col[1]} ${t[1]}. How many ${t[1]} are there in all?`, eq: `${a} + ${b} = ?`, ans: a + b, emoji: t[2] };
  },
  subTake: ({ a, b }) => {
    const [n1, n2] = two(), t = thing();
    return { text: `${n1} has ${fmt(a)} ${unit(a, t)}. ${n1} gives ${fmt(b)} to ${n2}. How many ${t[1]} does ${n1} have left?`, eq: `${a} − ${b} = ?`, ans: a - b, emoji: t[2] };
  },
  subCompare: ({ a, b }) => {
    const [n1, n2] = two(), t = thing();
    return { text: `${n1} has ${fmt(a)} ${t[1]}. ${n2} has ${fmt(b)} ${t[1]}. How many more ${t[1]} does ${n1} have than ${n2}?`, eq: `${a} − ${b} = ?`, ans: a - b, emoji: t[2] };
  },
  changeUnknown: ({ a, b }) => {            // a + ? = a+b
    const n = nm(), t = thing();
    return { text: `${n} had ${fmt(a)} ${t[1]}. Then ${n} found some more. Now ${n} has ${fmt(a + b)} ${t[1]}. How many did ${n} find?`, eq: `${a} + ? = ${a + b}`, ans: b, emoji: t[2] };
  },
  startUnknown: ({ a, b }) => {             // ? + b = a+b
    const n = nm(), t = thing();
    return { text: `${n} had some ${t[1]}. Then ${n} got ${fmt(b)} more. Now ${n} has ${fmt(a + b)} ${t[1]}. How many did ${n} have at the start?`, eq: `? + ${b} = ${a + b}`, ans: a, emoji: t[2] };
  },
  addendUnknown: ({ a, b }) => {            // a + ? = total
    const t = thing(), [p1, p2] = sample(PLACES_, 2);
    return { text: `There are ${fmt(a + b)} ${t[1]} in all. ${fmt(a)} are ${p1}. The rest are ${p2}. How many are ${p2}?`, eq: `${a} + ? = ${a + b}`, ans: b, emoji: t[2] };
  },
  subChangeUnknown: ({ a, b }) => {         // a − ? = a−b   (a > b)
    const n = nm(), t = thing();
    return { text: `${n} had ${fmt(a)} ${t[1]}. ${n} gave some away. Now ${n} has ${fmt(a - b)} ${t[1]}. How many did ${n} give away?`, eq: `${a} − ? = ${a - b}`, ans: b, emoji: t[2] };
  },
  subStartUnknown: ({ a, b }) => {          // ? − b = a−b
    const n = nm(), t = thing();
    return { text: `${n} had some ${t[1]}. ${n} gave away ${fmt(b)}. Now ${n} has ${fmt(a - b)} ${t[1]}. How many did ${n} have at the start?`, eq: `? − ${b} = ${a - b}`, ans: a, emoji: t[2] };
  },

  /* ----- multiplication / division ----- */
  mulGroups: ({ a, b }) => {                // a groups of b
    const n = nm(), t = thing(), c = pick(['bags', 'boxes', 'plates', 'baskets', 'jars']);
    return { text: `${n} has ${fmt(a)} ${c}. Each one has ${fmt(b)} ${t[1]}. How many ${t[1]} are there in all?`, eq: `${a} × ${b} = ?`, ans: a * b, emoji: t[2] };
  },
  mulArray: ({ a, b }) => {
    const t = thing(), row = pick(['rows', 'lines']);
    return { text: `A garden has ${fmt(a)} ${row} of ${t[1]}. There are ${fmt(b)} ${t[1]} in each row. How many ${t[1]} are there?`, eq: `${a} × ${b} = ?`, ans: a * b, emoji: t[2] };
  },
  mulCompare: ({ a, b }) => {               // a times as many as b
    const [n1, n2] = two(), t = thing();
    return { text: `${n1} has ${fmt(b)} ${t[1]}. ${n2} has ${fmt(a)} times as many. How many ${t[1]} does ${n2} have?`, eq: `${a} × ${b} = ?`, ans: a * b, emoji: t[2] };
  },
  mulPrice: ({ a, b }) => {
    const [it] = [pick(PRICE_ITEMS)], n = nm();
    return { text: `${n} buys ${fmt(a)} ${it[0]}s. Each ${it[0]} costs $${fmt(b)}. How much does ${n} spend in all?`, eq: `${a} × ${b} = ?`, ans: a * b, emoji: it[1] };
  },
  mulMissingFactor: ({ a, b }) => {         // a × ? = a*b
    const t = thing(), c = pick(['bags', 'boxes', 'plates', 'baskets']);
    return { text: `There are ${fmt(a)} ${c} with the same number of ${t[1]} in each. There are ${fmt(a * b)} ${t[1]} in all. How many ${t[1]} are in each?`, eq: `${a} × ? = ${a * b}`, ans: b, emoji: t[2] };
  },
  divShare: ({ a, b }) => {                 // (a*b) ÷ a  → b each
    const t = thing(), n = sample(NAMES, 1)[0];
    return { text: `${n} shares ${fmt(a * b)} ${t[1]} equally among ${fmt(a)} friends. How many ${t[1]} does each friend get?`, eq: `${a * b} ÷ ${a} = ?`, ans: b, emoji: t[2] };
  },
  divGroups: ({ a, b }) => {                // (a*b) ÷ b → a groups
    const t = thing(), c = pick(['bags', 'boxes', 'baskets', 'plates']);
    return { text: `${fmt(a * b)} ${t[1]} are put into ${c} with ${fmt(b)} in each. How many ${c} are needed?`, eq: `${a * b} ÷ ${b} = ?`, ans: a, emoji: t[2] };
  },
  divRemainder: ({ a, b, r }) => {          // a ÷ b with remainder r (a = b*q + r)
    const t = thing(), c = pick(['bags', 'boxes', 'baskets']);
    return { text: `${fmt(a)} ${t[1]} are put into ${c} with ${fmt(b)} in each. How many ${t[1]} are left over?`, eq: `${a} ÷ ${b}`, ans: r, emoji: t[2] };
  }
};

export const storyOf = (kind, p) => STORIES[kind](p);
export const randomAddSubStory = ({ a, b }, withUnknowns = false) => {
  const kinds = withUnknowns
    ? ['addJoin', 'addTotal', 'changeUnknown', 'startUnknown', 'addendUnknown']
    : ['addJoin', 'addTotal'];
  return STORIES[pick(kinds)]({ a, b });
};
