import sys, re, json
def load(name):
    t = open(name + '.txt', encoding='utf-8-sig').read().replace('\r\n', '\n')
    a = re.search(r'\*\*\* ?START OF', t); b = re.search(r'\*\*\* ?END OF', t)
    return t[t.find('\n', a.start()) + 1 if a else 0: b.start() if b else len(t)]
def paras(text, poem=False):
    text = re.sub(r'_([^_\n]+(?:\n[^_\n]+)*)_', r'<em>\1</em>', text)   # Gutenberg _italics_
    text = text.replace('_', '')   # an italic marker opened before the excerpt starts
    text = re.sub(r'\[\d+\]', '', text)   # editors' footnote markers
    if poem:  # keep line breaks within stanzas, strip indentation
        keep = lambda l: l.strip() and not re.fullmatch(r'\[Illustration[^\]]*\]', l.strip())
        stanzas = ['\n'.join(l.strip() for l in s.split('\n') if keep(l)) for s in re.split(r'\n\s*\n', text)]
        return [st for st in stanzas if st]
    return [q for q in (re.sub(r'\s+', ' ', p).strip() for p in re.split(r'\n\s*\n', text)) if q and not re.fullmatch(r'\[Illustration[^\]]*\]', q)]
def ex(name, start, end, poem=False, nth=1, endnth=1):
    t = load(name)
    pat = lambda s: re.compile(r'\s+'.join(re.escape(w) for w in s.split()))
    ms = list(pat(start).finditer(t))
    if len(ms) < nth: raise SystemExit(f'NOT FOUND start in {name}: {start!r}')
    i = ms[nth - 1].start()
    m = None; pos = i
    for _ in range(endnth):
        m = pat(end).search(t, pos)
        if not m: break
        pos = m.end()
    if not m: raise SystemExit(f'NOT FOUND end in {name}: {end!r}')
    return paras(t[i:m.end()], poem)
if __name__ == '__main__':
    spec = json.loads(sys.argv[1])
    for p in ex(**spec): print(p); print('---')
