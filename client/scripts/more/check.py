"""Check new questions for a bank batch:  python3 check.py bank_07.json more_07.json"""
import json, re, sys
banks = {b['key']: b for b in json.load(open(sys.argv[1]))}
out = json.load(open(sys.argv[2]))
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
errs, n = [], 0
for key, qs in out.items():
    if key not in banks: errs.append(f'{key}: unknown bank key'); continue
    old = {norm(e['question'] + e['answer']) for e in banks[key]['examples']}
    seen = set()
    if len(qs) < 20: errs.append(f'{key}: write at least 20 new questions (got {len(qs)})')
    for q in qs:
        n += 1
        if not (isinstance(q, list) and len(q) == 4 and isinstance(q[2], list)):
            errs.append(f'{key}: each question must be [question, answer, [w1, w2, w3], explanation]'); continue
        prompt, a, wrong, why = q
        if not prompt.strip() or not str(a).strip(): errs.append(f'{key}: empty question or answer')
        if len(wrong) != 3 or len(set(wrong)) != 3 or a in wrong: errs.append(f'{key}: need exactly 3 distinct wrong answers, none equal to the answer: {prompt[:50]}')
        if not why or len(why) < 15: errs.append(f'{key}: explanation missing or too short: {prompt[:50]}')
        k = norm(prompt + str(a))
        if k in old: errs.append(f'{key}: repeats an existing question: {prompt[:50]}')
        if k in seen: errs.append(f'{key}: duplicate question: {prompt[:50]}')
        seen.add(k)
        if re.search(r'<(?!/?(em|strong|b|i|br|sup|sub)\b)', prompt + why): errs.append(f'{key}: only <em>, <strong>, <br>, <sup>, <sub> tags allowed: {prompt[:50]}')
missing = [k for k in banks if k not in out]
print(f'{len(out)} of {len(banks)} banks done, {n} questions; {len(errs)} problems; {len(missing)} banks missing')
for e in errs[:40]: print('  ', e)
sys.exit(1 if errs or missing else 0)
