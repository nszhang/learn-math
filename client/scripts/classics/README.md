# Classic reading passages

Builds `client/src/catalog/eng/rc/classics.js` — reading-comprehension passages from famous
public-domain books (all published before 1929), copied word-for-word from Project Gutenberg.

```bash
cd client/scripts/classics
bash fetch.sh                       # downloads the source books (*.txt, not committed) from a Gutenberg mirror
python3 build.py ../../src/catalog/eng/rc/classics.js
```

- `spec_a.py` (Grades 1–6), `spec_b.py` (Grades 7–12) and `spec_c.py` (nonfiction, essays, speeches) and `spec_d.py` (classic poems): each passage is a start and end phrase in
  the book plus its questions. The text itself is always extracted from the book, never typed in.
- `build.py` refuses to build if any quotation in an explanation is not found in its passage,
  if a passage is over 520 words, or if a question's options are malformed.

George Orwell died in 1950: his works are public domain in Canada and Australia but still in copyright in the
United States. Those three passages come from Project Gutenberg Australia.
