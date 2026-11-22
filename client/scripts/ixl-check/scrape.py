import json, re, subprocess, time, html
pages = {'math': ['jr-kindergarten', 'kindergarten'] + [f'grade-{g}' for g in range(1, 13)] + ['calculus'],
         'ela': ['jr-kindergarten', 'kindergarten'] + [f'grade-{g}' for g in range(1, 13)],
         'science': ['kindergarten'] + [f'grade-{g}' for g in range(1, 11)]}
num = lambda p: {'jr-kindergarten': -1, 'kindergarten': 0, 'calculus': 13}.get(p) if not p.startswith('grade-') else int(p[6:])
out = {}
for subj, ps in pages.items():
    out[subj] = {}
    for p in ps:
        s = subprocess.run(['curl', '-sSL', '-m', '60', '-A', 'Mozilla/5.0', f'https://ca.ixl.com/{subj}/{p}'], capture_output=True, text=True).stdout
        rows, sec = [], None
        for m in re.finditer(r'category-name">([^<]*)<|skill-tree-skill-name">([^<]*)<', s):
            if m.group(1) is not None: sec = html.unescape(m.group(1)).strip()
            else: rows.append([sec, html.unescape(m.group(2)).strip()])
        out[subj][num(p)] = rows
        print(subj, p, len(rows), flush=True)
        time.sleep(1)
json.dump(out, open('ixl_current.json', 'w'), ensure_ascii=False, indent=0)
