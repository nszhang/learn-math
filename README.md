# π MathAce

A unified, IXL-inspired math learning platform covering grade-school topics —
arithmetic, geometry & shapes, probability, statistics — **plus** full algebra
and exponent/logarithm catalogs. Students climb an IXL-style SmartScore
(0–100) per skill, complete daily and teacher-assigned homework, and earn
medals, badges, and stars. Teachers assign exercises; admins manage accounts
and teacher rosters.

**Stack:** React 18 + Vite · Node.js + Express · PostgreSQL (JWT auth, bcrypt)

## Content — 50 skills in 11 topics

| Area | Topics |
|---|---|
| 🔢 Number sense | Order of operations, fractions, percents |
| 📐 Geometry & shapes | Area, perimeter, triangle angles, circles, volume, shape ID |
| 🎲 Probability | Simple probability, complement, dice & coins |
| 📊 Data & statistics | Mean, median, mode, range |
| ➕ Algebra (17) | Expressions → quadratics (full AlgebraAce catalog) |
| 🚀 Exponents & logs (16) | Powers, rules, exponential & log equations |

### 🎓 Learn section (4 interactive experiences)
- 🧮 **Linear equations** — animated balance solver (play/pause/back/speed)
- 🔢 **Exp & log equations** — animated step-by-step solver
- 📈 **Lines** — y = mx + b playground with zoom + match-the-line game
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
