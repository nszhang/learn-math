# Extra question banks

Skills whose own question banks were small (under ~15 different questions) get 20+ more each,
written per bank (one bank = one skill across the grades it appears in).

- `out/more_NN.json` — `{bankKey: [[question, answer, [wrong ×3], explanation], ...]}`
- `check.py work/bank_NN.json out/more_NN.json` — checks a batch (format, repeats, answer-length giveaways)
- **`RESUME.md` — where this work stopped and how to continue**
- `python3 build.py` — merges everything into `client/public/more/{subject}.json` (loaded on demand)
