/* ============================================================
   MathAce — math expression parser & evaluator (Desmos-style).
   Supports: + - * / ^ (right-assoc), parentheses, unary minus
   (-x^2 = -(x^2)), implicit multiplication (2x, 2(x+1), x(x+1),
   2sin(x)), the variable x, constants pi & e, and functions:
   sin cos tan asin acos atan sqrt abs ln log exp floor ceil sign.
   parse(expr) → { fn, error } — fn(x) → number (NaN outside domain).
   ============================================================ */

const FUNCS = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan,
  asin: Math.asin, acos: Math.acos, atan: Math.atan,
  sqrt: x => (x < 0 ? NaN : Math.sqrt(x)),
  abs: Math.abs,
  ln: x => (x <= 0 ? NaN : Math.log(x)),
  log: x => (x <= 0 ? NaN : Math.log10(x)),
  log10: x => (x <= 0 ? NaN : Math.log10(x)),
  log2: x => (x <= 0 ? NaN : Math.log2(x)),
  exp: Math.exp,
  floor: Math.floor, ceil: Math.ceil,
  sign: Math.sign,
  sinh: Math.sinh, cosh: Math.cosh, tanh: Math.tanh
};
const CONSTS = { pi: Math.PI, e: Math.E };

// ---------- tokenizer ----------
function tokenize(src) {
  const tokens = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === ' ') { i++; continue; }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9.]/.test(src[j])) j++;
      const text = src.slice(i, j);
      const value = Number(text);
      if (isNaN(value)) throw new Error(`Bad number "${text}"`);
      tokens.push({ t: 'num', value });
      i = j; continue;
    }
    if (/[a-zA-Z]/.test(c)) {
      let j = i;
      while (j < src.length && /[a-zA-Z0-9]/.test(src[j])) j++;
      tokens.push({ t: 'name', name: src.slice(i, j).toLowerCase() });
      i = j; continue;
    }
    if ('+-*/^()'.includes(c)) {
      tokens.push({ t: c });
      i++; continue;
    }
    throw new Error(`Unexpected character "${c}"`);
  }
  return tokens;
}

// ---------- recursive descent parser → AST ----------
// expr   := term (('+'|'-') term)*
// term   := factor (('*'|'/'| implicit) factor)*
// factor := '-' factor | power            (unary minus binds below ^)
// power  := primary ('^' factor)?         (right associative)
// primary:= num | const | x | fn(expr) | '(' expr ')'
function parseTokens(tokens) {
  let pos = 0;
  const peek = () => tokens[pos];
  const next = () => tokens[pos++];

  function parseExpr() {
    let node = parseTerm();
    while (peek() && (peek().t === '+' || peek().t === '-')) {
      const op = next().t;
      node = { op, l: node, r: parseTerm() };
    }
    return node;
  }

  const startsPrimary = tok =>
    tok && (tok.t === 'num' || tok.t === 'name' || tok.t === '(');

  function parseTerm() {
    let node = parseFactor();
    while (peek() && (peek().t === '*' || peek().t === '/' || startsPrimary(peek()))) {
      const op = (peek().t === '*' || peek().t === '/') ? next().t : '*'; // implicit ×
      node = { op, l: node, r: parseFactor() };
    }
    return node;
  }

  function parseFactor() {
    if (peek() && peek().t === '-') { next(); return { op: 'neg', arg: parseFactor() }; }
    if (peek() && peek().t === '+') { next(); return parseFactor(); }
    return parsePower();
  }

  function parsePower() {
    const base = parsePrimary();
    if (peek() && peek().t === '^') {
      next();
      return { op: '^', l: base, r: parseFactor() }; // right assoc: x^y^z = x^(y^z)
    }
    return base;
  }

  function parsePrimary() {
    const tok = next();
    if (!tok) throw new Error('Unexpected end of expression');
    if (tok.t === 'num') return { op: 'num', value: tok.value };
    if (tok.t === '(') {
      const node = parseExpr();
      if (!peek() || peek().t !== ')') throw new Error('Missing closing parenthesis');
      next();
      return node;
    }
    if (tok.t === 'name') {
      if (tok.name === 'x') return { op: 'var' };
      if (tok.name in CONSTS) return { op: 'num', value: CONSTS[tok.name] };
      if (tok.name in FUNCS) {
        if (!peek() || peek().t !== '(') throw new Error(`"${tok.name}" needs parentheses, e.g. ${tok.name}(x)`);
        next();
        const arg = parseExpr();
        if (!peek() || peek().t !== ')') throw new Error(`Missing ")" after ${tok.name}(...`);
        next();
        return { op: 'call', fn: FUNCS[tok.name], arg, name: tok.name };
      }
      throw new Error(`Unknown name "${tok.name}"`);
    }
    throw new Error(`Unexpected "${tok.t}"`);
  }

  const ast = parseExpr();
  if (pos < tokens.length) throw new Error(`Unexpected "${tokens[pos].t}" after the expression`);
  return ast;
}

// ---------- evaluator ----------
function evalNode(node, x) {
  switch (node.op) {
    case 'num': return node.value;
    case 'var': return x;
    case 'neg': return -evalNode(node.arg, x);
    case 'call': return node.fn(evalNode(node.arg, x));
    case '+': return evalNode(node.l, x) + evalNode(node.r, x);
    case '-': return evalNode(node.l, x) - evalNode(node.r, x);
    case '*': return evalNode(node.l, x) * evalNode(node.r, x);
    case '/': {
      const d = evalNode(node.r, x);
      return d === 0 ? NaN : evalNode(node.l, x) / d;
    }
    case '^': return Math.pow(evalNode(node.l, x), evalNode(node.r, x));
    default: return NaN;
  }
}

// ---------- public API ----------
export function parse(input) {
  let src = String(input || '').trim();
  if (!src) return { fn: null, error: null };
  // allow "y = ..." / "f(x) = ..." prefixes like Desmos
  src = src.replace(/^\s*(y|f\s*\(\s*x\s*\))\s*=\s*/, '');
  try {
    const ast = parseTokens(tokenize(src));
    return { fn: x => evalNode(ast, x), error: null };
  } catch (e) {
    return { fn: null, error: e.message };
  }
}
