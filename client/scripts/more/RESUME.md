# Resume: extra question banks (paused 2026-11-22)

Work stopped when the session usage limit was hit. Everything needed to continue is in this folder.

## Layout

- `work/bank_NN.json` (00–31): the inputs. Each file holds 25 skill banks (key, subject, title, section, grades, existing examples).
- `work/more_NN.json`: batches that are written but **not yet published** (22, 24, 25).
- `out/more_NN.json`: published batches. `python3 build.py` merges `out/` into `client/public/more/{english,science}.json`.
- `check.py`: the quality gate. Run `python3 check.py work/bank_NN.json <more file>`, and only publish a batch that shows 0 problems and 0 banks missing.
- `work/variety.mjs` → `variety.json`, `work/banks.mjs` → `banks.json`, `work/export.mjs` → `bank_NN.json`: the audit that picked these banks (skills with fewer than 12 distinct questions in 40 tries). **Re-running export.mjs overwrites the bank files.**

## Status (updated 2026-11-22)

| Batch | State |
|---|---|
| 00–24 | published; all pass check.py (no giveaways). `server/test/extra-banks.test.js` now enforces it |
| 25 | in progress, 10 of 25 banks done (`work/more_25.json`) |
| 26–28 | in progress (`work/more_NN.json`) |
| 29–31 | not started (all science). Use the write prompt |

Live: 13,751 extra questions (English 407 banks / 8,955; science 218 banks / 4,796).
check.py also rejects a right answer that alone carries a bracketed note, e.g. "slate (metamorphic)".

## How to run (at most 4 agents at a time, since 20 at once hit the usage limit)

1. Copy a batch into an agent's working folder, or point the agent at `work/`. Give it the **write prompt** with NN filled in.
2. When it finishes, run `check.py`, read a sample of the questions (check facts and look for ambiguous wrong answers), then copy the file to `out/`.
3. Run `python3 build.py`, run `npm test` in `server/` (the extra-banks test must pass), then commit, `git push` and `./deploy.sh`.
4. After 08–24 are fixed: add the length-giveaway rule from `check.py` to `server/test/extra-banks.test.js` so it can't come back.

### Write prompt
> Write 22 NEW multiple-choice questions for every bank in `bank_NN.json` (skip banks already in `more_NN.json`), in the style of its examples and at the right difficulty for its grades. Each question tests exactly the skill in the title and has genuinely varied content. There is one clear right answer and three plausible, clearly wrong, distinct answers of **similar form and length**: no filler ("Maybe", "Not sure"), no borderline wrong answers, and the right answer never stands out by length or wording. Content is scientifically accurate (if unsure, leave it out), in Canadian spelling with SI units, and text only (emoji where the examples use them). The only tags allowed are `<em> <strong> <br> <sup> <sub>`; a marked word uses `<strong>` with "the word in bold". Each question ends with a one-sentence explanation. Format: `[question, answer, [w1, w2, w3], explanation]` → `more_NN.json` as `{bankKey: [...]}`. Merge after every ~5 banks, then run check.py until it shows 0 problems and 0 banks missing.

### Fix prompt (answer-length giveaways)
> For every bank that `check.py` flags as "much longer or shorter than all the wrong answers", rewrite the questions so the four options are similar in length, detail and form. Usually this means turning the wrong answers into tempting, specific options that are still clearly wrong: too narrow (a detail, not the main idea), too broad, partly true, contradicting the text, true but irrelevant, or an opinion instead of evidence. Don't change what is tested or which option is right. Edit only the flagged banks, and save after each file.

## Remaining after the banks (IXL parity)
- About 416 low-variety **math** skills (down from 476; list them with `node work/mathlow.mjs`: skills giving < 12 distinct questions in 60 tries, grouped by rule) (`mth:` banks; generators such as skip-counting or coin values give only about 5 distinct questions). Improve the generators or add banks.
- About 25 audio/picture banks that were skipped by the export.
- **Skill plans** (mapping skills to provincial curriculum outcomes). IXL loads the outcome lists by script, so the mapping has to come from the curriculum documents themselves.
