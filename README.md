# π MathAce

**A full K–12 math learning platform** — IXL-style skill practice organized by grade, an interactive Learn section with animated equation solving and a Desmos-style graphing playground, homework assignment and tracking for teachers, and a persistent reward system that keeps students coming back.

<div align="center">

**🌐 Live:** [math.pnpsolutions.ca/learn-math](https://math.pnpsolutions.ca/learn-math)

**256 skills · 95 sections · Grades 1–12 · 21 badges · 3 roles**

React 18 + Vite · Node.js + Express · PostgreSQL · JWT + bcrypt

</div>

---

## Table of contents

- [Why MathAce](#why-mathace)
- [Feature tour](#feature-tour)
- [Pedagogy](#pedagogy)
- [Content catalog](#content-catalog)
- [The Learn section](#the-learn-section)
- [Accounts, SmartScore & rewards](#accounts-smartscore--rewards)
- [Architecture](#architecture)
- [Repository structure](#repository-structure)
- [API reference](#api-reference)
- [Data model](#data-model)
- [Local development](#local-development)
- [Testing](#testing)
- [Deployment](#deployment)
- [The site family](#the-site-family)
- [Adding content: a practical guide](#adding-content-a-practical-guide)

---

## Why MathAce

MathAce was built as a family-friendly, self-hosted alternative to commercial
practice sites. It follows the proven **IXL organizational model**
(**Grade → Topic → Skill**, SmartScore 0–100, medals & badges) while doubling
down on what actually builds mathematicians: **understanding over rote
memorization**. Grade 9 content is aligned to the Canadian **MathLinks 9**
textbook chapter by chapter.

Everything runs on your own infrastructure: one small server, one PostgreSQL
database, no external services, no tracking.

---

## Feature tour

### 🎒 For students
- **Grade grid** — pick your grade, see every topic section (lettered IXL-style:
  A. Circle geometry, B. Data collection, …) and skill, each with its own
  SmartScore medallion (🥉 70 · 🥈 90 · 🥇 100)
- **Unlimited practice** — every question is generated fresh (numeric entry or
  multiple choice) with a **step-by-step explanation after every answer**,
  including wrong ones
- **Daily homework** — a new auto-generated exercise set every day (3 skills ×
  5 questions), resume-able, plus anything a teacher assigns; wrong answers
  still count as done, so finishing is always within reach
- **Rewards** — medals per skill, **21 badges**, stars, streaks, confetti, and
  an encouragement tone that never punishes effort
- **My Progress dashboard** — totals, accuracy, time practiced, per-grade
  skill breakdowns
- **🎓 Learn section** — animated step-by-step equation solving and graph
  playgrounds (below)

### 🍎 For teachers
- **Assign homework** — pick a student, a due date, any skills, questions per
  skill; assignments appear on the student's Homework page that day
- **Track progress** — per-student totals (SmartScore, mastered skills,
  accuracy, time, homework count, stars) with expandable grade breakdowns and
  per-assignment status: ⬜ not started → ⏳ 7/10 → ✅ done
- Teachers only ever see **their own rostered students** (assigned by an admin)

### ⚙️ For admins
- **No public signup** — accounts are created by an admin from the ⚙️ Admin
  console (username, display name, role, password)
- Manage users: create, reset passwords, delete, assign teacher rosters
- Bootstrap the very first admin with `server/scripts/create-admin.mjs`

---

## Pedagogy

Grade-school math is variations and combinations of **the four operations**,
the **inverse** idea, and the **three laws** (associative, commutative,
distributive). MathAce's catalog is written to make students *intuit* these:

- **Inverse operations everywhere** — number bonds (`7 + ___ = 10`), fact
  families, missing factors (`6 × ___ = 42`), square roots as undoing squares,
  "division undoes multiplication" questions, mean-of-a-missing-number, metric
  conversion by dividing, inverse functions
- **The three laws explicitly** — break-apart multiplication, regrouping
  puzzles, *"which equation shows the distributive law?"*, FOIL explained as
  the distributive law twice
- **Visual-intuition skills** — area by counting unit squares, arrays as
  multiplication, volume by layers, parallelogram-as-disguised-rectangle,
  Gauss's pairing trick, limits via "think of huge values"
- **Encouragement, not punishment** — wrong answers show the full worked
  explanation and a growth-mindset message; homework completion is based on
  questions answered, not correctness

---

## Content catalog

**256 skills across 95 sections in Grades 1–12.** Skill IDs are namespaced
(`el*` elementary, `sch*` school topics, `alg*` algebra, `exp*` exponent/log,
`t*` expansions) so the shared database never collides.

| Grade | Sections · Skills | Highlights |
|---|---|---|
| 1 | 7 · 20 | Skip counting, number bonds, fact families, make-a-ten, clocks, shapes |
| 2 | 7 · 19 | Place value, regrouping, money, tally charts, pattern rules |
| 3 | 8 · 21 | Times tables via arrays, missing factors (inverse), fractions on number lines, area by unit squares |
| 4 | 7 · 20 | 2×2-digit multiply, remainders, mixed numbers, symmetry, parallel/perpendicular |
| 5 | 8 · 20 | Decimals, order of operations, prime factorization, volume by cubes, triangle classification |
| 6 | 8 · 21 | Integer operations, ratios & rates, percents, mean with missing values, distributive with variables |
| 7 | 11 · 26 | Expressions, one/two-step equations, probability, powers, square & cube roots, **name-the-law**, consumer math |
| 8 | 7 · 21 | Multi-step & fractional equations, inequalities & their graphs, slope, scientific notation, Pythagorean, cylinders |
| **9** | **13 · 47** | **Aligned to MathLinks 9**: symmetry & surface area, rational numbers, powers & BEDMAS, scale factors & similarity, polynomial language & monomial ops, patterns→expressions, story graphs, data collection (bias/sampling), **circle geometry** (central/inscribed angles, Thales, tangents) |
| 10 | 6 · 14 | Quadratics (factoring, vertex form, Vieta), exponential equations & growth intuition |
| 11 | 6 · 14 | Logarithms, inverse & composite & piecewise functions, trigonometry, fractional exponents, Gauss series |
| 12 | 7 · 13 | Log rules, compound interest, geometric series, limits intuition, two-dice probability, permutations, complex numbers |

*Grade 9 section topics map 1:1 to the textbook chapters (1–9, 10, 11).*

---

## The Learn section

**11 interactive lessons** organized in a library of four subject groups
(Numbers & operations · Geometry & measurement · Data & chance · Algebra &
beyond), each opening full-screen from a card menu. In addition to the four
original tools below, seven new labs cover the expanded topic catalog:

1. **🧮 Linear equations** — animated balance-scale solver: operations appear on
   *both sides*, cancelled terms fade, with Play/Pause, single-Step, Back,
   and a speed control (🐢/🚶/🐇). Three levels including variables on both
   sides and one-step type selector (add/sub · multiply · divide)
2. **🔢 Exponential & log equations** — the same animator for `bˣ = v`,
   `bˣ⁺ᵏ = v`, `log_b(x) = m`, `log_b(x+k) = m` with log⇔exponential conversion frames
3. **📈 Lines** — `y = mx + b` playground with m/b steppers, slope triangle,
   y-intercept marker, and a 🎯 *Match the line* game
4. **📉 Curves** — `y = a·bˣ` and `y = a·log_b(x)` playground **plus a
   Desmos-style custom grapher**

**New topic labs:**
- **🍕 Fraction lab** — live fraction bars for two fractions: compare (with
  cross-multiplication shown), simplify, decimals/percents, and a visual
  common-denominator addition
- **▭ Area & perimeter explorer** — unit-square grids for rectangles and a
  dashed "twin" showing *why* triangle area is ½ × base × height
- **📊 Statistics lab** — adjustable dot plot with an animated mean
  balance-point marker, median dot, mode rings, and a range bracket
- **🎲 Probability lab** — coin / die / marble-bag simulator: run 1–1000
  trials and watch experimental probability converge on theory
  (law of large numbers)
- **📐 Pythagoras explorer** — live squares on all three sides of a right
  triangle; detects Pythagorean triples
- **🦘 Integer hopper** — an animated kangaroo hopping along the number line
  for signed addition/subtraction, with Play/Step controls
- **🧩 Factoring tiles** — algebra-tile area model for (x + a)(x + b) with a
  "factor it back" reverse mode (sum-and-product hunt)

**The custom grapher** accepts any expression in `x` (up to 6 at once, each in
its own color): operators `+ - * / ^` (right-associative), parentheses,
**implicit multiplication** (`2x`, `2(x+1)`, `x(x+1)`, `2sin(x)`), unary minus
with Desmos precedence (`-x^2 = -(x^2)`), functions `sin cos tan asin acos
atan sqrt abs ln log log2 exp floor ceil sign sinh cosh tanh`, constants `pi`
and `e`, and `y =` / `f(x) =` prefixes. Live parse errors, add/remove rows.

**Graph interactions (both playgrounds):** drag to pan, scroll to zoom
(unbounded, Desmos-style), ±buttons and Reset, **5 minor grid lines per major
square**, fully adaptive tick labels at every scale.

---

## Accounts, SmartScore & rewards

- **Auth**: JWT (30-day) + bcrypt; roles: `student`, `teacher`, `admin`;
  **no public signup** — an admin creates all accounts
- **SmartScore** (server-side, can't be forged): fast gains early, small gains
  and steep penalties in the Challenge Zone (90+), mastery at 100
  ```
  correct:  <60:+8..12  <75:+5..8  <85:+3..5  <90:+2..3  <96:+1..2  else +1
  wrong:    <60:−2..5   <75:−4..7  <85:−6..10 <90:−8..12 else −10..16
  ```
- **Medals**: 🥉 70 · 🥈 90 · 🥇 100 (skill-scoped)
- **Badges**: 21 (milestones, streaks, mastery counts, time, stars, homework)
- **Stars**: medal & badge grants + homework completions
- **Homework**: completes at exactly the assigned question count; progress is
  resume-able and stored server-side

---

## Architecture

```
┌─────────────────────────────── Browser ───────────────────────────────┐
│  React 18 SPA (Vite build, served by Express under /learn-math/)      │
│                                                                       │
│  pages: Skills(HW funnel) · Learn(4 tools) · Homework · Dashboard ·   │
│         Awards · Teacher(Students/Assign) · Admin · ChangePassword    │
│  engines: question generators · lesson animators · expr parser ·      │
│           daily-homework derivation (deterministic per date)          │
└──────────────────────────────┬────────────────────────────────────────┘
                               │ fetch (JWT Bearer) — all state lives server-side
┌──────────────────────────────▼────────────────────────────────────────┐
│  Express API (server/src)                                             │
│  auth · /api/answers (SmartScore+stats+medals+badges+homework in one  │
│  transaction-safe call) · homework · teacher rosters · admin          │
└──────────────────────────────┬────────────────────────────────────────┘
┌──────────────────────────────▼────────────────────────────────────────┐
│  PostgreSQL — learn_math                                              │
│  users · stats · skill_progress · awards · assignments ·              │
│  homework_progress · homework_completed · teacher_students             │
│  (schema auto-applied on boot; shared with two sister sites —         │
│   one login works across the whole family)                            │
└────────────────────────────────────────────────────────────────────────┘
```

Question generation happens client-side; **all scoring, progress, and reward
accounting is server-side**.

---

## Repository structure

```
learn-math/
├── client/                        # React 18 + Vite SPA
│   └── src/
│       ├── skills.js              # merges catalogs → GRADES (lettered sections)
│       ├── catalog/               # question-generator catalogs (the content!)
│       │   ├── elementary.js      #   grades 1–6 core (graded structure)
│       │   ├── school.js          #   school topics (arithmetic→statistics)
│       │   ├── algebra.js         #   17 algebra skills (from AlgebraAce)
│       │   ├── exponent.js        #   16 exponent/log skills (from ExponentAce)
│       │   ├── extra.js           #   49 understanding-first expansion skills
│       │   ├── extra2.js          #   103 more skills across all grades
│       │   └── grade9book.js      #   29 skills aligned to MathLinks 9 chapters
│       ├── learn/
│       │   ├── learnLinear.js     # linear-equation lesson engine (pure fns)
│       │   ├── learnExpLog.js     # exp/log lesson engine (pure fns)
│       │   └── parser.js          # Desmos-style expression parser/evaluator
│       ├── homework.js            # daily-set derivation + homework helpers
│       └── components/            # one file per page + learn/ tools
├── server/
│   ├── src/
│   │   ├── index.js               # entry: pg Pool, schema init, static serving
│   │   ├── app.js                 # Express routes (factory, test-injectable)
│   │   ├── db.js                  # data-access layer (all SQL lives here)
│   │   ├── schema.sql             # 8 tables (idempotent)
│   │   ├── scoring.js             # SmartScore engine + medal thresholds
│   │   └── awards.js              # 21 badge definitions + checks
│   ├── scripts/create-admin.mjs   # bootstrap the first admin
│   └── test/api.test.js           # 13 E2E API tests on pg-mem
├── deploy.sh                      # rsync → build on server → restart → health
├── Dockerfile                     # multi-stage: client build → server runtime
├── docker-compose.yml             # Postgres + full-stack app
└── package.json                   # root scripts (setup/db/dev:*/test/build)
```

---

## API reference

| Method & path | Auth | Purpose |
|---|---|---|
| `POST /api/auth/login` | — | JWT login (username + password) |
| `POST /api/auth/password` | user | change own password |
| `GET /api/meta/awards` | — | badge catalog for the awards page |
| `GET /api/health` | — | liveness + DB check (used by deploy & monitoring) |
| `GET /api/me` | user | profile, stats, all skill progress, earned awards |
| `POST /api/answers` | user | **the workhorse**: record one answer → SmartScore update, stats, medals, stars, homework progress/completion, newly earned badges |
| `POST /api/time` | user | accumulate practice time (clamped 600s) |
| `GET /api/homework` | student | teacher assignments (+per-item progress) + daily progress |
| `GET /api/students` | teacher | rostered students w/ stats, per-grade progress, assignment status |
| `POST /api/assignments` | teacher | create homework (student, due date, skills, count) |
| `GET /api/assignments` | teacher | own assignments with completion status |
| `DELETE /api/assignments/:id` | teacher | delete own assignment |
| `GET /api/admin/users` | admin | all users + roster pairs |
| `POST /api/admin/users` | admin | create account (returns password) |
| `POST /api/admin/users/:id/password` | admin | reset password |
| `DELETE /api/admin/users/:id` | admin | delete account |
| `PUT /api/admin/teachers/:id/students` | admin | replace a teacher's roster |

Answers posted with a foreign-site skill ID are rejected (`SKILL_IDS`
allow-list); cross-site assignments are filtered per site.

---

## Data model

| Table | Purpose |
|---|---|
| `users` | username (unique), display_name, bcrypt hash, role, stars |
| `stats` | totals: answered, correct, time_sec, best_streak, homework_done |
| `skill_progress` | per-skill SmartScore + answered/correct + medals (JSONB) |
| `awards` | earned badge IDs + timestamps |
| `assignments` | teacher→student homework: due date, items (JSONB) |
| `homework_progress` | per-skill counts inside an assignment (incl. daily sets) |
| `homework_completed` | completion records |
| `teacher_students` | admin-managed teacher rosters |

Schema is idempotent (`CREATE TABLE IF NOT EXISTS`) and applied on boot.

---

## Local development

```bash
npm run setup        # install client + server deps
npm run db           # start PostgreSQL via docker compose
npm run dev:server   # API on :3001 (DATABASE_URL, JWT_SECRET, PORT envs)
npm run dev:client   # Vite dev server on :5173 (proxies /api → :3001)
```

Bootstrap an admin (schema must exist; start the server once first):

```bash
cd server && DATABASE_URL=postgres://postgres:postgres@localhost:5432/learn_math \
  node scripts/create-admin.mjs myadmin [password]
```

Production mode: `npm run build && npm start` (Express serves the built
client on :3001). Client builds with `base: '/learn-math/'` for the nginx
subpath deployment — use `vite build --base=/` for root-hosted local runs.

---

## Testing

```bash
npm test             # 13 E2E API tests (pg-mem in-memory Postgres — no DB needed)
```

The API suite covers: auth & validation, no-public-signup enforcement,
roster isolation, SmartScore updates, medals/badges/stars, homework
completing at exactly N questions, daily-set tracking, time tracking,
password change/reset semantics, and authorization rules per role.

**Content validation** (run before every catalog change): every generator is
invoked thousands of times and checked for presence of fields, answer
in choices, choice uniqueness, numeric-answer finiteness, and formatting —
most recently **256 skills × 1,200 = 307,200 generated questions, zero
failures**. The lesson engines and expression parser have equivalent sweeps
(33+ parser eval cases including domain NaNs and error handling). Client↔server
skill-ID consistency is diff-checked.

---

## Deployment

**Production** runs at `math.pnpsolutions.ca/learn-math/` on
`webapp01.pnpsolutions.ca`:

| Piece | Detail |
|---|---|
| App dir | `/var/www/learn-math` (built on server) |
| Secrets | `/etc/learn-math.env` (root:600): `DATABASE_URL`, `JWT_SECRET`, `PORT=3006` |
| Service | systemd `learn-math.service` (127.0.0.1:3006) |
| Routing | nginx `math.pnpsolutions.ca.conf`: `/learn-math/` and `/learn-math/api/` → :3006 (prefix stripped) |
| Database | PostgreSQL `learn_math` (shared with the two sister sites) |
| Backups | Nightly 00:00 America/Edmonton via `website-backup.sh learn-math` → `/backup/learn-math/` (files tarball + gzipped `pg_dump`, 30-day retention, offsite sync) |
| Deploy | `./deploy.sh` — code-only rsync (`.env`/DB untouched) → build → restart → health check |

**Docker alternative:** `docker compose up --build app` → http://localhost:3001
(multi-stage Dockerfile; schema auto-applied on boot; set `DATABASE_URL`,
`JWT_SECRET`, `PGSSL=true` for managed Postgres).

---

## The site family

MathAce shares its user database with two earlier sister sites — **one login
works on all three**, and per-skill progress stays namespaced so nothing
collides:

| Site | URL | Repo |
|---|---|---|
| π **MathAce** (this repo — everything, Grades 1–12) | [/learn-math](https://math.pnpsolutions.ca/learn-math/) | `nszhang/learn-math` |
| ∑ **AlgebraAce** (algebra, 17 skills) | [/learning-algebra](https://math.pnpsolutions.ca/learning-algebra/) | `nszhang/learning-algebra` |
| xⁿ **ExponentAce** (exponents & logs, 16 skills) | [/learn-exponent-and-log](https://math.pnpsolutions.ca/learn-exponent-and-log/) | `nszhang/learn-exponent-and-log` |

All three run the same engine (auth/rosters/SmartScore/homework/awards) with
different content catalogs and per-site daily-homework prefixes.

---

## Adding content: a practical guide

1. **Write generators** in (or as a new) `client/src/catalog/*.js` file. A
   skill is `{ id, title, grade, section, icon, gen }` where `gen()` returns
   `{ prompt, type: 'num'|'mc', answer, choices?, explain }` — prompts are
   HTML (use the `m()` chip helper), answers must be exact, MC choices unique,
   and `explain` should *teach*, ideally with a 💡 insight.
2. **IDs** must be globally unique and added to `SKILL_IDS` in
   `server/src/app.js` (allow-list).
3. **Place it**: `grade` + `section` (matching an existing section name merges
   into it; sections letter/number automatically per grade).
4. **Validate**: run the generator sweep (all skills × ~1200 draws), the
   client/server ID diff, `npm test`, and `npm run build`.
5. Deploy with `./deploy.sh` and commit.

---

*Built with ❤️ for students learning math one skill at a time.*

## Subjects

The skill browser is subject-aware (`SUBJECTS` in `client/src/skills.js`): Math, English and Science, each with the same IXL-style Grade → Section → Skill layout.

**English** follows IXL's language-arts structure: Category (Reading Strategies, Writing Strategies, Vocabulary, Grammar and Mechanics) → lettered Section (A … Z, AA …) → Skill. `client/src/catalog/ixlEnglish.js` holds the section registry and expands each skill spec `{ k, t, s, g: [grades], gen }` into one skill per grade (id `eng<k><grade>`, so each grade keeps its own SmartScore). Content lives in `ixlEnglishReading.js`, `ixlEnglishVocab.js` and `ixlEnglishGrammar.js`; the original grade 1–5 skills are in `english.js`.

**Science** lives in `catalog/science.js` (grades 1–5) and `catalog/science612.js`.

Questions are built with the helpers in `catalog/quiz.js` (`classify`, `pairs`, `ok`, `passageQs`). The server accepts any `eng*`/`sci*` id of the right shape, and a server test checks that every client skill id is accepted.
