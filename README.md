# A+ LearnAce

*Formerly **MathAce**: renamed once the site grew beyond math.*

**A K–12 learning platform for Math, English, Science and Chinese (HSK 1–6)** — IXL-style skill practice organized by grade, an interactive Learn section with animated equation solving and a Desmos-style graphing playground, homework assignment and tracking for teachers, and a persistent reward system that keeps students coming back.

<div align="center">

**🌐 Live:** [math.pnpsolutions.ca/learn-math](https://math.pnpsolutions.ca/learn-math)

**4,713 skills · 523 sections · Junior Kindergarten–Calculus · 21 badges · 3 roles**

React 18 + Vite · Node.js + Express · PostgreSQL · JWT + bcrypt

</div>

---

## Table of contents

- [Why LearnAce](#why-learnace)
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

## Why LearnAce

LearnAce was built as a family-friendly, self-hosted alternative to commercial
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
distributive). LearnAce's math catalog is written to make students *intuit* these:

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

**4,713 skills across 523 sections, Junior Kindergarten through Calculus.** Every grade (4,457 IXL-style skills
plus the 256 skills that existed before) follow IXL's grade pages section for section — see
`client/src/catalog/ixlMath/` (`manifest.js` lists every section and skill with a permanent
`mth…` id; `rules/*.js` attach a generator to each skill by title; `check.mjs` is the dev
harness). Skill IDs are namespaced (`mth*` IXL-style JK–Calculus, `el*` elementary, `sch*` school
topics, `alg*` algebra, `exp*` exponent/log, `t*` expansions) so the shared database never collides.
The original skills now live inside the matching IXL sections.

**Topic headings.** On every grade's skills page the lettered sections are grouped under topic
headings (Math: Fractions, Decimals, Geometry, …; Science: Physical / Life / Earth and space
science; English: IXL's own categories), like IXL's English page. Topics come from
`client/src/catalog/topics.js` (name-based rules); sections keep their IXL order inside a topic and
are lettered A, B, C … after grouping. Skill ids never change, so saved progress is unaffected.

| Grade | Sections · Skills | Highlights |
|---|---|---|
| JK | 12 · 76 | Counting to 20 with pictures, comparing, positions, sorting, patterns, coins, flat and solid shapes |
| K | 43 · 228 | Counting and ten frames, one more/one less, addition and subtraction to 10 with cubes, time, money, 2-D and 3-D shapes |
| 1 | 41 · 309 | Counting and ten frames, addition/subtraction to 20 with pictures, strategies, place value, clocks, money, graphs, shapes |
| 2 | 34 · 321 | Two- and three-digit add/subtract with models, skip-counting, place value, money, elapsed time, arrays, intro to fractions |
| 3 | 43 · 469 | Multiplication/division facts and fluency, area models, fractions on number lines, decimals, perimeter/area, graphs |
| 4 | 46 · 428 | Multi-digit multiply/divide, remainders, factors, equivalent fractions, decimals to hundredths, angles, symmetry |
| 5 | 54 · 479 | Fraction and decimal operations, exponents, order of operations, ratios, percents, integers, coordinate plane, volume |
| 6 | 41 · 399 | Integers and rational numbers, ratios & rates, percents, fraction/decimal operations, equations, area & volume, probability, statistics, transformations |
| 7 | 36 · 384 | Integer and rational operations, proportional relationships, equations & inequalities, circles, angles, similarity & congruence, probability, consumer math |
| 8 | 34 · 342 | Linear functions, Pythagorean theorem, scientific notation, roots, similarity, scatter plots, compound interest |
| 9 | 25 · 266 | Rational numbers, exponent rules, similarity & solids, **circle theorems** (the original MathLinks 9 skills), linear functions, systems, monomials & polynomials, probability & statistics |
| 10 | 34 · 322 | Radicals, factoring, quadratics & parabolas, systems, exponential functions, trigonometry basics, congruence & similarity, proofs & logic |
| 11 | 25 · 257 | Functions & inequalities, polynomials, rational & radical expressions, exponentials, logarithms (in Grade 12), trigonometry, sequences & series, probability |
| 12 | 28 · 284 | Logarithms, matrices, complex numbers, conics, vectors, trig functions & identities, distributions, regression & confidence intervals |
| Calculus | 27 · 149 | Limits and continuity, derivative rules and applications, optimization, integration, differential equations, areas and volumes |

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
- **🧭 Complex numbers** — drag points on the complex plane: a + bi as "a right,
  b up"; i as a quarter turn (i² = −1 as two turns); addition as walking one
  number then the other; multiplication as stretch + turn (lengths multiply,
  angles add), with the unit square showing how the whole plane moves
- **∫ Fundamental Theorem of Calculus** — pick a curve (or type your own) and
  explore three linked views: a secant closing in on the tangent (the
  derivative), the accumulated area A(x) whose tangent slope equals f(x)
  (FTC part 1, with a ▶ sweep), and ∫ₐᵇ f = F(b) − F(a) with a movable +C
  (FTC part 2). Every graph zooms and pans together (mouse wheel, drag,
  pinch, ＋/− buttons or keyboard) and re-fits its height to what's on screen

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
│       ├── skills.js              # merges catalogs → GRADES (topic-grouped, lettered sections)
│       ├── catalog/               # question-generator catalogs (the content!)
│       │   ├── topics.js          #   topic headings for Math and Science sections
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
failures** (plus `server/test/ixlmath.test.js`, which runs every IXL-style generator and checks
the question shape on each `npm test`). The lesson engines and expression parser have equivalent sweeps
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

LearnAce shares its user database with two earlier sister sites — **one login
works on all three**, and per-skill progress stays namespaced so nothing
collides:

| Site | URL | Repo |
|---|---|---|
| A+ **LearnAce** (this repo, formerly MathAce — Math, English, Science, Chinese) | [/learn-math](https://math.pnpsolutions.ca/learn-math/) | `nszhang/learn-math` |
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

**Science** follows IXL's science structure (Grade → lettered Section → Skill). `client/src/catalog/ixlScience.js` holds the section registry and expands specs from `catalog/sci/physical.js`, `life.js`, `earth.js` and `chemphys.js`; the original skills in `science.js` / `science612.js` are placed into sections there.

English grades 1–5 are mostly generated from word lists (`catalog/eng/`), with emoji standing in for IXL's pictures.

Questions are built with the helpers in `catalog/quiz.js` (`classify`, `pairs`, `ok`, `passageQs`). The server accepts any `eng*`/`sci*` id of the right shape, and a server test checks that every client skill id is accepted.

## Student grades

Each student can have a grade (`users.grade`: −1 = JK, 0 = K, 1–12; Calculus counts as grade 12). Admins set it on the Admin page (on create or in the accounts table); teachers set it for students in their roster (Students or Assign page) via `PUT /api/students/:id/grade`.

- Students' skill pages open on their grade, mark it "⭐ Your grade", and label higher grades "🚀 Above your grade" — exploring ahead is always allowed.
- Daily practice is three skills from one subject at the student's grade; the subject rotates day by day (Math → English → Science).
- The Assign page shows the student's grade by default, can suggest their weakest unmastered skills at that grade, flags above-grade skills, and asks the teacher to confirm before assigning them.

## BEDMAS

- **Lesson:** Learn → Numbers & operations → BEDMAS (`components/learn/BedmasLab.jsx`, step engine `learn/bedmas.js`).
- **Practice / homework:** Math grades 3–9 each have a "BEDMAS: order of operations" section (`catalog/bedmasSkills.js`, ids `mthB…<grade>`), built on the same engine: evaluate (3–9), which operation comes first (3–9), who is right (4–9), place the brackets (5–9). Difficulty grows by grade: + − × (3), ÷ (4), longer expressions (5), exponents (6), nested brackets (7), negative numbers (8–9).
- Practice questions have a "🎓 Learn it" button that opens the lesson; the lesson has a "Practise BEDMAS" button for the student's grade.

## Messages and challenges

- **💬 Messages** (the icon next to the stars) let users chat:
  - **Who can message whom:**
    - Students: classmates (students who share a teacher) and their own teachers.
    - Teachers: students in their roster.
    - Admins: anyone.
  - **Limits:** text only, up to 500 characters, at most 20 messages a minute.
  - A conversation is marked read when it's opened. The top bar badge is polled every 30 s.
- **⚔️ Challenges** let a student race a classmate:
  - **Setting one up:** in a conversation, a student picks one of their homework sets (or today's daily practice), or up to 5 skills from any subject, each with a number of *correct* answers needed.
  - The invitation appears as a card in the chat, where the opponent can **Accept** or **Decline**. The challenger can **Cancel** while it's pending.
  - **The race:** both players do the same skills, and wrong answers don't count toward finishing. The first to complete every skill wins 🏆 (+3 ⭐), and the result is posted in the conversation.
  - While racing, the practice page shows both players' progress bars live, polled every 8 s.
  - **The Challenges page** shows open challenges, wins and losses, a head-to-head record per classmate, and the full history: each player's progress, accuracy and time from first answer to finish.
  - **Limits:** at most 10 open challenges per student. Answers still count toward each skill's SmartScore.
- **Emoji, pictures and calls in chat:**
  - **Emoji:** a 😊 picker with kid-friendly groups. Messages of only 1–3 emoji show up big.
  - **Pictures:** 🖼️ button, paste, or drag and drop.
    - The browser shrinks each picture to at most 1280 px and re-saves it as JPEG before upload. This also removes hidden EXIF/GPS data.
    - The server checks the file really is a picture, allows up to 2 MB and 50 pictures a day, and stores it in the database (`message_images`).
    - Only the two people in the conversation (and admins) can open a picture (`GET /api/images/:id`).
  - **Calls:** 📞 voice and 🎥 video calls, browser to browser over WebRTC (`components/Calls.jsx`), between the same people who can message each other.
    - Incoming calls ring on any page, with mute, camera on/off and hang-up controls.
    - Unanswered calls stop after 35 s, and a second caller gets "busy".
    - The caller's side writes the call into the conversation, e.g. "📞 Voice call · 2:13" or "— missed".
    - Calls use public STUN servers. Without a TURN relay, some strict networks (some mobile carriers, school firewalls) may fail to connect.
  - **Live updates:** `GET /api/events` (Server-Sent Events, `server/src/realtime.js`) delivers new messages instantly and relays call set-up (`POST /api/calls/signal`, `POST /api/calls/log`).
- **Server:** `server/src/social.js`, tables `messages`, `challenges`, `challenge_progress` and `challenge_finishes`.
  - API: `GET /api/contacts`, `GET/POST /api/messages[/:userId]`, `GET /api/inbox`, `GET/POST /api/challenges`, `POST /api/challenges/:id/{accept,decline,cancel}`.
  - Challenge answers go through `POST /api/answers` with `challengeId`.

## Chinese (HSK 1–6)

Mandarin with Simplified characters and pinyin, organised by **HSK level 1–6** instead of school grade (`catalog/ixlChinese.js`, content in `catalog/zh/`). Layout is HSK level → Category → Section → Skill; ids are `chiH<level><key>`. A skill's `grade` field holds its HSK level.

- **Words** (`catalog/zh/hsk.js`): the complete HSK 1 and 2 lists and core HSK 3–6 words, in units of about 25. Each unit has four skills: meaning, choose the characters, pinyin/tones and 🎧 listening. HSK 1–2 show pinyin over the characters.
- **Pronunciation and listening**:
  - tone drills, including 🎧 *Listen: which tone?*
  - tone changes (3rd + 3rd, 不 and 一)
  - per level: *Listen for the tones*, *Listen and choose the word* and *Listen to a sentence*
- **Grammar, reading and culture**:
  - each level's grammar patterns, such as 是/有/在 and 吗/呢 (HSK 1), 比/过/着 (HSK 2), 把/被 (HSK 3), 不仅…而且 (HSK 4), 与其…不如 (HSK 5) and 以…为 (HSK 6)
  - numbers, time and measure words
  - reading passages, idioms and festivals
- **Listening questions** (`listen: true`) play automatically and hide the text until answered. They have 🔊 Play again and 🐢 Slowly buttons. Homophones (他/她, 做/坐) are never offered against each other. Other Chinese questions have a 🔊 Listen button. Speech comes from the browser (`zh-CN` voice; `client/src/speech.js`).
- **Learn → 🀄 Mandarin tones** (`components/learn/ToneLab.jsx`) has:
  - pitch contours on the 5-level scale with playable syllable families (mā má mǎ mà …)
  - tone pairs and tone changes
  - an ear-training game
  - 🎙️ *Say it*, which tracks the learner's pitch from the microphone (autocorrelation) and draws it over the target tone
- **✍️ Writing**: every HSK word unit has a *Write the characters* skill (`components/WriteCharacters.jsx`, built on [Hanzi Writer](https://hanziwriter.org)).
  - Students can watch the stroke order, then trace each character with a finger or mouse; hints appear after 3 misses on a stroke.
  - A character passes with at most 3 wrong strokes.
  - Stroke data comes from `hanzi-writer-data` (Arphic Public License). `scripts/copy-hanzi.mjs` copies the data for the course's ~1,000 characters into `public/hanzi/` before each build or dev run.
- **🔁 Review deck (spaced repetition)**: every HSK word a student answers in practice joins their deck (`word_reviews` table, `server/src/srs.js`).
  - *Review words* on the Chinese page asks up to 20 due words, mixing meaning, characters, listening, pinyin and writing.
  - Each correct review moves a word up a box: next review in 1, 3, 7, 14, 30, then 60 days. A miss starts it over and asks it again later in the same session.
  - A word counts as "known" once it reaches box 3, meaning it was remembered across a 3-day gap. The Chinese page shows "You know X of Y HSK n words", and teachers see 🧠 words known per student.
  - API: `GET /api/review`, `POST /api/review { word, correct, today, mode: 'seen' | 'review' }`.
- **Progress is independent of grade.** Each student has `users.hsk_level` (default 1).
  - A student can move up from the Chinese page whenever they like (`PUT /api/me/hsk-level`). It is suggested once 70% of the level's skills reach 🥉 70.
  - Teachers set it per student in the roster (`PUT /api/students/:id/hsk-level`) and admins via `PUT /api/admin/users/:id/hsk-level`.
  - Suggestions, "above level" warnings and the Chinese day of the daily-practice rotation use the HSK level, not the school grade.
