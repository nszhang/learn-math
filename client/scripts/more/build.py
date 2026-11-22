"""Merge the extra question banks (out/more_*.json: {bankKey: [[q, a, [w,w,w], why], ...]}) into
client/public/more/{english,science,...}.json, dropping anything malformed or duplicated."""
import glob, json, os, re, sys
OUT = sys.argv[1] if len(sys.argv) > 1 else '../../public/more'
SUBJ = lambda k: 'english' if k.startswith('eng') else 'science' if k.startswith('sci') else 'math' if k.startswith('mth') else 'chinese'
norm = lambda s: re.sub(r'[^a-z0-9]', '', str(s).lower())
FILLER = {'maybe', 'notsure', 'idontknow', 'cannottell', 'cantsay', 'noneoftheabove', 'alloftheabove'}
TAG_OK = re.compile(r'<(?!/?(em|strong|b|i|br|sup|sub)\b)')
data, dropped, total = {}, 0, 0
for f in sorted(glob.glob('out/more_*.json')):
    for key, qs in json.load(open(f)).items():
        bank = data.setdefault(SUBJ(key), {}).setdefault(key, [])
        seen = {norm(q[0] + q[1]) for q in bank}
        for q in qs:
            total += 1
            # filler options ("Maybe", "Not sure") are not real distractors — drop them (a Yes/No question keeps 1)
            if isinstance(q, list) and len(q) == 4 and isinstance(q[2], list):
                q = [q[0], q[1], [w for w in q[2] if norm(w) not in FILLER], q[3]]
            ok = (isinstance(q, list) and len(q) == 4 and isinstance(q[2], list) and 1 <= len(q[2]) <= 3 and len(set(q[2])) == len(q[2])
                  and q[1] not in q[2] and str(q[0]).strip() and str(q[1]).strip() and q[3] and not TAG_OK.search(q[0] + q[3])
                  and norm(q[0] + q[1]) not in seen)
            if not ok: dropped += 1; continue
            seen.add(norm(q[0] + q[1])); bank.append([q[0], str(q[1]), [str(w) for w in q[2]], q[3]])
os.makedirs(OUT, exist_ok=True)
for subj, banks in data.items():
    json.dump(banks, open(f'{OUT}/{subj}.json', 'w'), ensure_ascii=False, separators=(',', ':'))
    print(f'{subj}: {len(banks)} banks, {sum(map(len, banks.values()))} questions, {os.path.getsize(f"{OUT}/{subj}.json") // 1024} KB')
print(f'{total} read, {dropped} dropped')
