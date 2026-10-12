# π MathAce

A unified, IXL-inspired math learning platform covering grade-school topics —
arithmetic, geometry & shapes, probability, statistics — **plus** full algebra
and exponent/logarithm catalogs. Students climb an IXL-style SmartScore
(0–100) per skill, complete daily and teacher-assigned homework, and earn
medals, badges, and stars. Teachers assign exercises; admins manage accounts
and teacher rosters.

**Stack:** React 18 + Vite · Node.js + Express · PostgreSQL (JWT auth, bcrypt)

## Content — IXL-style organization (modeled on ca.ixl.com)

**249 skills organized by Grade 1–12** — each grade has lettered sections
(A. Division, B. Fractions, …) with numbered skills, exactly like IXL's
Math pages. The Skills home shows a grade grid with per-grade progress.

| Grade | Highlights |
|---|---|
| 1–2 | Skip counting, add/subtract facts, place value, patterns |
| 3–4 | Times tables, division, fractions of a whole, rounding, shapes, GCF, equivalent fractions, area & perimeter |
| 5–6 | Decimals, order of operations, fractions, prime/composite, LCM, integers, unit rates, percents, statistics |
| 1–2 | + clocks & time, money/coins, units, tally & bar graphs, vertices, pattern rules, regrouping |
| 3–4 | + missing factors/divisors (inverse), fractions on number lines, area by unit squares, 2×2-digit multiply, remainders, mixed numbers, symmetry, parallel/perpendicular |
| 5–6 | + decimal compare/divide, prime factorization, volume by cubes, triangle classification, integer multiply, ratio problems, discounts, divisibility rules, parallelogram area |
| 7 | 11 sections: + circle parts, counting principle, cube roots, percent proportions, sequences, consumer math, equation checking |
| 8 | + fractional equations, rate of change, scientific notation, cylinder volume, translations, scatter trends, transversal angle pairs |
| 9 | + polynomial subtract/FOIL, x-intercepts, rational vs irrational, surface area |
| 10 | + vertex form, trinomial factoring, radical simplification, function evaluation, elimination, exponential growth |
| 11 | + composite/piecewise functions, trig missing sides, radians, fractional exponents, Gauss series, polynomial division |
| 12 | + log expansion, simple-vs-compound, geometric series, limits intuition, two-dice probability, permutations, complex numbers |

**Pedagogy:** emphasis on *understanding*, not rote — number bonds, fact
families, "division undoes multiplication", break-apart strategies, mean as an
inverse operation, inverse functions, and explicit commutative / associative /
distributive law skills throughout.
| 8 | Multi-step equations, inequalities, linear relations, negative exponents |
| 9 | Exponent rules, systems of equations |
| 10 | Quadratics, exponential equations |
| 9 (textbook-aligned) | 12 sections mirroring MathLinks 9: symmetry (line & rotation), surface area (triangular prisms, open boxes), rational numbers (compare, negative ops, square roots of rationals), powers of 10 & BEDMAS, scale factors & similarity (scale diagrams, similar triangles/polygons), polynomial language & monomial ×/÷, patterns→expressions, interpreting graphs, data collection (bias, sampling) |
| 11–12 | Logarithms, natural log & e |

### 🎓 Learn section (4 interactive experiences)
- 🧮 **Linear equations** — animated balance solver (play/pause/back/speed)
- 🔢 **Exp & log equations** — animated step-by-step solver
- 📈 **Lines** — y = mx + b playground with zoom, panning, and the match-the-line game
- 📉 **Curves** — y = a·bˣ and y = a·log_b(x) playground with zoom, plus a
  **Desmos-style custom grapher**: type any expression in x (up to 6 at once,
  each in its own color) — supports `+ - * / ^`, parentheses, implicit
  multiplication (`2x`, `2(x+1)`), `sin cos tan asin acos atan sqrt abs ln log
  log2 exp floor ceil sign sinh cosh tanh`, and constants `pi` & `e`

## Quick start

```bash
npm run setup && npm run db     # deps + PostgreSQL (docker compose)
npm run dev:server              # API on :3001
npm run dev:client              # React dev server on :5173
```

No public signup — bootstrap an admin:
`node server/scripts/create-admin.mjs [username] [password]`

## Tests

```bash
npm test    # 13 E2E API tests (pg-mem)
```

Plus: 100,000 generated questions validated across all 50 skills, both lesson
engines verified, 19 jsdom interaction tests for the Learn section.

## Deployment

Production: https://math.pnpsolutions.ca/learn-math/ — see `deploy.sh`
(code-only rsync → build on server → restart → health check).
