"""Build the large reading library: client/public/reading/{band}.json

For every book in library_books.py, pick well-formed passages spread through the book (copied
word-for-word) and generate close-reading questions that can be checked mechanically:
  cloze     — a word is blanked in the passage; which word did the author use?
  order     — which of these sentences comes first / last in the passage?
  detail    — which sentence actually appears in the passage?
  speaker   — who says this line? (from "…,” said Alice" dialogue tags)
  pov       — is the passage told in the first or the third person? (fiction, clear cases only)
Every answer is verified against the passage text, distractors are checked to be absent from it,
and passages with offensive period language are skipped.
"""
import json, os, random, re, sys
from collections import Counter, defaultdict
from library_books import B, GA

random.seed(20261121)   # deterministic builds
OUT = sys.argv[1] if len(sys.argv) > 1 else '../../public/reading'
ids = json.load(open('books/ids.json'))

WORDS = {'3_4': (70, 160), '5_6': (100, 210), '7_8': (120, 240), '9_10': (130, 260), '11_12': (140, 270)}
PER_BOOK = {'fic': 12, 'story': 14, 'nf': 12, 'essay': 12}
# period slurs and adult content: a passage containing any of these is skipped
BANNED = re.compile(r"\b(nigger|nigga|darkey|darky|darkies|negro|negroes|negress|mulatto|coon|squaw|injun|redskin|savages?|"
                    r"coolie|chink|jap|kike|wop|sambo|gypsy|gipsy|hottentot|whore|harlot|strumpet|bastard|rape|raped|"
                    r"breasts?|naked|lust|seduc\w*|mistress|opium|suicide|hanged himself|slit (his|her) throat)\b", re.I)
STOP = set('''about above after again against all almost alone along already also although always among another
any anyone anything around because been before being below between both cannot could does doing down during each
either enough even ever every from further have having here herself himself however into itself just least less
many might more most much must myself neither never nothing other others ought ourselves over perhaps quite rather
really said same seemed shall should since some something still such than that their theirs them themselves then
there these they thing things this those though through thus together toward towards under until upon very well
were what whatever when where whether which while whom whose will with within without would your yours yourself
little great going thought think know knew made make come came good like long time away back once again only
first last told tell look looked right left'''.split())
SPEECH = r'(said|cried|asked|replied|answered|exclaimed|whispered|shouted|added|continued|returned|observed|remarked|called|began|repeated|murmured|declared)'
TITLES = r'(?:(?:the|Mr\.|Mrs\.|Miss|Dr\.|Captain|Uncle|Aunt|Sir|Lady|Lord|Professor|Colonel|Madame|Monsieur) )?'

def load(path):
    t = open(path, encoding='utf-8-sig', errors='replace').read().replace('\r\n', '\n')
    a = re.search(r'\*\*\* ?START OF[^\n]*\n', t); b = re.search(r'\*\*\* ?END OF', t)
    return t[a.end() if a else 0: b.start() if b else len(t)]

def clean_para(p):
    p = re.sub(r'_([^_]+)_', r'<em>\1</em>', p).replace('_', '')
    p = re.sub(r'\[\d+\]|\{\d+\}', '', p)
    p = p.replace('--', '—')
    return re.sub(r'\s+', ' ', p).strip()

def good_para(raw, p):
    if not p or len(p) < 40: return False
    if re.search(r'\[|\]|\*|#|<(?!/?em>)|\bCHAPTER\b|\bChapter [IVXLC\d]+|Illustration|Gutenberg|http|www\.|\d{3,}\.?\s*$', p): return False
    if sum(c.isupper() for c in p) > 0.25 * sum(c.isalpha() for c in p): return False   # headings, shouting
    lines = [l for l in raw.split('\n') if l.strip()]
    if len(lines) > 1 and sum(len(l) < 45 for l in lines) > len(lines) / 2: return False   # verse, tables, lists
    if p.count('“') != p.count('”') or p.count('"') % 2: return False
    if not re.search(r'[.!?’”"]$', p): return False
    return True

def sentences(text):
    plain = re.sub(r'</?em>', '', text)
    parts = re.split(r'(?<=[.!?])(?:[”"’]+)?\s+(?=[“"A-Z])', plain)
    return [s.strip() for s in parts if s.strip()]

def passages_from(text, band, kind, n):
    lo, hi = WORDS[band]
    raws = [r for r in re.split(r'\n\s*\n', text)]
    paras = [(r, clean_para(r)) for r in raws]
    start, end = int(len(paras) * 0.04), int(len(paras) * 0.97)
    cands = []
    i = start
    while i < end:
        if not good_para(*paras[i]): i += 1; continue
        group, words, j = [], 0, i
        while j < end and good_para(*paras[j]) and words < lo:
            group.append(paras[j][1]); words += len(paras[j][1].split()); j += 1
        if lo <= words <= hi and not BANNED.search(' '.join(group)) and len(sentences(' '.join(group))) >= 4:
            cands.append((i, group))
            i = j + 6          # leave a gap so passages don't overlap
        else:
            i += 1
    if len(cands) <= n: return [g for _, g in cands]
    step = len(cands) / n          # spread evenly through the book
    return [cands[int(k * step)][1] for k in range(n)]

# ---------------- questions ----------------
def trim(s, n=18):
    w = s.split()
    return s if len(w) <= n else ' '.join(w[:n]).rstrip(',;:—') + ' …'

CLOZE_CLASSES = {'ing', 'ed', 'ly', 'ness', 'tion', 'ous', 'ful', 'est'}

def suffix_class(w):
    for suf in ('ing', 'ed', 'ly', 'ness', 'tion', 'ous', 'ful', 'es', 's', 'er', 'est'):
        if w.endswith(suf): return suf
    return ''

def q_cloze(group, vocab):
    text = ' '.join(group); plain = re.sub(r'</?em>', '', text)
    words = re.findall(r"(?<![’'\-\w])([a-z]{5,11})(?![’'\-\w])", plain)
    counts = Counter(w.lower() for w in re.findall(r'[A-Za-z]+', plain))
    # only words with a clear ending (-ed, -ing, -ly …), so all four options are the same kind of word
    cands = [w for w in words if w not in STOP and counts[w] == 1 and suffix_class(w) in CLOZE_CLASSES and vocab[suffix_class(w)]]
    random.shuffle(cands)
    for w in cands:
        pool = [v for v in vocab[suffix_class(w)] if v != w and counts[v] == 0 and abs(len(v) - len(w)) <= 2 and v[:4] != w[:4]]
        pool = list(dict.fromkeys(pool))
        if len(pool) < 3: continue
        wrong = random.sample(pool, 3)
        sent = next((s for s in sentences(text) if re.search(rf'\b{w}\b', s)), None)
        if not sent: continue
        return ['A word is missing from the passage (shown as ______). Which word did the author use?', w, wrong,
                f'The author wrote: “{trim(sent, 40)}” — <strong>{w}</strong> fits the meaning and the sentence.', w]
    return None

def q_order(group):
    ss = [s for s in sentences(' '.join(group)) if 6 <= len(s.split()) <= 40]
    if len(ss) < 4: return None
    picks = sorted(random.sample(range(len(ss)), 4))
    first = random.random() < 0.6
    ans = ss[picks[0]] if first else ss[picks[-1]]
    opts = [trim(ss[k], 14) for k in picks]
    if len(set(opts)) < 4: return None
    a = trim(ans, 14)
    return [f'Which of these comes <strong>{"first" if first else "last"}</strong> in the passage?', a, [o for o in opts if o != a],
            f'In the passage, “{a.replace(" …", "")}” comes {"before" if first else "after"} the other three.']

def q_detail(group, others):
    ss = [s for s in sentences(' '.join(group)) if 8 <= len(s.split()) <= 26]
    pool = [s for s in others if 8 <= len(s.split()) <= 26]
    if not ss or len(pool) < 3: return None
    a = random.choice(ss)
    text = re.sub(r'</?em>', '', ' '.join(group))
    wrong = [w for w in random.sample(pool, min(10, len(pool))) if w not in text][:3]
    if len(wrong) < 3: return None
    return ['Which of these sentences appears in the passage?', a, wrong,
            f'This sentence is in the passage: “{trim(a, 30)}” The others come from elsewhere in the book.']

def q_speaker(group, names):
    text = re.sub(r'</?em>', '', ' '.join(group))
    pat = re.compile(r'“([^”]{12,160}?)[,!?]?” ' + SPEECH + r' ' + TITLES + r'([A-Z][a-z]{2,})\b')
    pat2 = re.compile(r'“([^”]{12,160}?)[,!?]?” ' + TITLES + r'([A-Z][a-z]{2,}) ' + SPEECH + r'\b')
    hits = [(m.group(1), m.group(3), m.group(0)) for m in pat.finditer(text)] + [(m.group(1), m.group(2), m.group(0)) for m in pat2.finditer(text)]
    hits = [h for h in hits if h[1] in names]
    if not hits: return None
    quote, who, whole = random.choice(hits)
    others = [n for n in names if n != who and n not in text][:6]
    if len(others) < 3: return None
    tag = whole[whole.rfind('”') + 2:]
    return [f'Who says “{trim(quote, 22)}”?', who, random.sample(others, 3), f'The passage gives the speaker: “{tag}.”']

def q_pov(group):
    narr = re.sub(r'“[^”]*”|"[^"]*"', ' ', re.sub(r'</?em>', '', ' '.join(group)))
    first = len(re.findall(r'\b(I|me|my|myself|mine)\b', narr)); third = len(re.findall(r'\b(he|she|his|her|him|they|them|their)\b', narr, re.I))
    opts = ['first-person', 'second-person', 'third-person']
    if first >= 3 and first >= 0.4 * third:
        # quote a whole narration sentence (no dialogue in it) where the narrator says "I"
        sent = next((x for x in sentences(' '.join(group)) if re.search(r'\bI\b', x) and not re.search(r'[“”"]', x)), None)
        if not sent: return None
        snip = ' '.join(sent.split()[:12]).rstrip('.,;:')
        return ['From which point of view is this passage told?', 'first-person', ['second-person', 'third-person'],
                f'The narrator is a character who speaks as “I” — for example, “{snip}.”']
    if first == 0 and third >= 6:
        return ['From which point of view is this passage told?', 'third-person', ['first-person', 'second-person'],
                'The narrator never says “I” outside of dialogue; characters are called “he,” “she” or by name.']
    return None

def book_names(text):
    pat = re.compile(r'” ' + SPEECH + r' ' + TITLES + r'([A-Z][a-z]{2,})\b')
    pat2 = re.compile(r'” ' + TITLES + r'([A-Z][a-z]{2,}) ' + SPEECH + r'\b')
    c = Counter([m.group(2) for m in pat.finditer(text)] + [m.group(1) for m in pat2.finditer(text)])
    names = []
    for n, k in c.most_common(30):
        if k < 3 or n in ('The', 'This', 'That', 'There', 'She', 'His', 'Her', 'Then', 'And', 'But'): continue
        occ = re.findall(rf'\b{n}\b(\s+[A-Z][a-z]+)?', text)
        if sum(1 for o in occ if o) > 0.5 * len(occ): continue   # usually the first half of a two-word name ("Tin Woodman")
        if len(re.findall(rf'\b{n.lower()}\b', text)) > len(occ): continue   # an ordinary word ("lion", "aunt")
        names.append(n)
    return names

library = defaultdict(list)
report = []
for (title, author_q, disp, author, year, kind, bands) in B:
    gid = ids[title]; text = load(f'books/{gid}.txt')
    report.append(build := (disp, gid))
    for band in bands:
        groups = passages_from(text, band, kind, PER_BOOK[kind])
        allsent = [s for g in groups for s in sentences(' '.join(g))]
        vocab = defaultdict(list)
        for w in re.findall(r'(?<![\w’\'])([a-z]{5,11})(?![\w’\'])', re.sub(r'</?em>', '', text)[:400000]):
            if w not in STOP: vocab[suffix_class(w)].append(w)
        for k in vocab: vocab[k] = list(dict.fromkeys(vocab[k]))[:3000]
        names = book_names(text) if kind in ('fic', 'story') else []
        for g in groups:
            others = [s for s in allsent if s not in ' '.join(g)]
            qs = [q for q in (q_cloze(g, vocab), q_order(g), q_detail(g, others),
                              q_speaker(g, names) if names else None,
                              q_pov(g) if kind in ('fic', 'story') else None) if q]
            if len(qs) < 2: continue
            library[band].append({'t': f'From {disp} ({year})' if year > 999 else f'From {disp}', 'by': author, 'kind': kind, 'p': g, 'q': qs})

for (url, disp, author, year, kind, bands) in GA:
    text = load('books/ga_' + url.split('/')[-1])
    text = text[text.find('\n', text.find('Title:') + 1):] if 'Title:' in text else text
    for band in bands:
        groups = passages_from(text, band, kind, PER_BOOK[kind])
        allsent = [s for g in groups for s in sentences(' '.join(g))]
        vocab = defaultdict(list)
        for w in re.findall(r'(?<![\w’\'])([a-z]{5,11})(?![\w’\'])', text[:400000]):
            if w not in STOP: vocab[suffix_class(w)].append(w)
        for k in vocab: vocab[k] = list(dict.fromkeys(vocab[k]))[:3000]
        names = book_names(text) if kind == 'fic' else []
        for g in groups:
            others = [s for s in allsent if s not in ' '.join(g)]
            qs = [q for q in (q_cloze(g, vocab), q_order(g), q_detail(g, others), q_speaker(g, names) if names else None,
                              q_pov(g) if kind == 'fic' else None) if q]
            if len(qs) >= 2:
                library[band].append({'t': f'From {disp} ({year})', 'by': f'{author} (public domain in Canada)', 'kind': kind, 'p': g, 'q': qs})

# ---------------- validate: drop any question that fails a check ----------------
plain = lambda s: re.sub(r'\s+', ' ', re.sub(r'</?em>', '', s))
def valid(text, q):
    prompt, a, wrong, why = q[:4]
    need = 2 if 'point of view' in prompt else 3
    if a in wrong or len(set(wrong)) != need: return False
    if len(q) > 4 and (len(re.findall(rf'\b{re.escape(a)}\b', text)) != 1 or any(re.search(rf'\b{re.escape(w)}\b', text, re.I) for w in wrong)):
        return False
    for quote in re.findall(r'“([^”]+)”', why):
        for part in quote.split(' …'):
            part = part.strip().rstrip('.')
            if len(part.split()) >= 3 and part not in text: return False
    return True
dropped = 0
for band in library:
    kept = []
    for it in library[band]:
        text = plain(' '.join(it['p']))
        qs = [q for q in it['q'] if valid(text, q)]
        dropped += len(it['q']) - len(qs)
        if len(qs) >= 2: kept.append({**it, 'q': qs})
    library[band] = kept
print('questions dropped by validation:', dropped)

os.makedirs(OUT, exist_ok=True)
for band, items in sorted(library.items()):
    json.dump(items, open(f'{OUT}/{band}.json', 'w'), ensure_ascii=False, separators=(',', ':'))
    c = Counter(it['kind'] for it in items); nq = sum(len(it['q']) for it in items)
    print(f'{band:6} {len(items):4} passages {nq:5} questions  {dict(c)}  {os.path.getsize(f"{OUT}/{band}.json") // 1024} KB')
