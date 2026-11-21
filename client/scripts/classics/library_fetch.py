"""Resolve each library book to a Gutenberg id via GUTINDEX.ALL and download it to books/ (not committed)."""
import os, re, subprocess, sys, json
from library_books import B, GA, IDS
MIRROR = 'https://gutenberg.pglaf.org'
os.makedirs('books', exist_ok=True)
if not os.path.exists('GUTINDEX.ALL'):
    subprocess.run(['curl', '-sSL', '-m', '300', '-o', 'GUTINDEX.ALL', f'{MIRROR}/GUTINDEX.ALL'], check=True)
index = open('GUTINDEX.ALL', encoding='utf-8', errors='replace').read().split('\n')
ids = {}
norm = lambda s: re.sub(r'[^a-z0-9]', '', s.lower())
for title, author, *_ in B:
    want = norm(title)
    hits = []
    for i, line in enumerate(index):
        m = re.match(r'^(.+?)\s{2,}(\d+)\s*$', line)
        if not m: continue
        t, gid = m.group(1), int(m.group(2))
        # author may be on the same line ("Title, by Author") or the next one
        full = t + ' ' + index[i + 1] if i + 1 < len(index) else t
        if norm(t).startswith(want) and author.lower() in full.lower() and not re.search(r'audio|spanish|french|german|italian|dutch|finnish|portuguese', full, re.I):
            hits.append(gid)
    ids[title] = IDS.get(title) or (min(hits) if hits else None)   # lowest id = the original edition, usually
def path(gid): d = '/'.join(str(gid)[:-1]) or '0'; return f'{MIRROR}/{d}/{gid}'
def get(gid, out):
    if os.path.exists(out) and os.path.getsize(out) > 5000: return True
    for f in (f'{gid}-0.txt', f'{gid}.txt', f'{gid}-8.txt'):
        r = subprocess.run(['curl', '-sSL', '-m', '90', '-o', out, '-w', '%{http_code}', f'{path(gid)}/{f}'], capture_output=True, text=True)
        if r.stdout == '200' and os.path.getsize(out) > 5000: return True
    return False
missing = []
for title, *_ in B:
    gid = ids[title]
    if not gid or not get(gid, f'books/{gid}.txt'): missing.append((title, gid)); continue
for url, title, *_ in GA:
    out = 'books/ga_' + url.split('/')[-1]
    if not os.path.exists(out): subprocess.run(['curl', '-sSL', '-m', '90', '-o', out, f'http://gutenberg.net.au/{url}'])
json.dump(ids, open('books/ids.json', 'w'), indent=1)
print(len(B) - len(missing), 'of', len(B), 'books downloaded'); print('MISSING:', missing)
