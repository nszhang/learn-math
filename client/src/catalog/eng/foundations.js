/* English — Reading Foundations (phonics), grades 1–3. Generated from word lists in words.js. */
import { classify, pairs } from '../quiz.js';
import {
  ri, pick, shuffle, sample, uniq, big, b, mc, misspell,
  SHORT, LONG, SILENT_E, VOWEL_TEAM, R_CTRL, DIPH, DIGRAPH_START, DIGRAPH_END, BLEND_START, BLEND_END,
  SYLLABLES, RHYMES, SIGHT_WORDS
} from './words.js';

const sk = (k, t, s, g, gen) => ({ k, t, s, g, gen });
const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const firstVowel = w => w.search(/[aeiou]/);

/* "Which word matches the picture?" — choices from the same word family */
const matchPicture = list => () => {
  const [w, e] = pick(list);
  return mc(`${big(e)}<br>Which word matches the picture?`, w, sample(list.map(x => x[0]), 6, [w]), `The picture shows a ${b(w)}.`);
};
/* "Complete the word" — blank out a letter group, choose it */
const completeWord = (list, options, cut) => () => {
  const [w, e, part] = pick(list);
  const at = cut ? cut(w, part) : w.indexOf(part);
  const shown = w.slice(0, at) + '_'.repeat(part.length) + w.slice(at + part.length);
  return mc(`${big(e)}<br>Complete the word: ${b(shown)}`, part, options, `${b(w)} is spelled with ${b(part)}.`);
};
/* "Spell the word" — picture → correct spelling among misspellings */
const spellWord = list => () => {
  const [w, e] = pick(list);
  return mc(`${big(e)}<br>Which is the correct spelling?`, w, misspell(w, 3), `It is spelled ${b(w)}.`);
};
const withVowel = (list, v) => list.map(([w, e]) => [w, e, v]);
const ALL_SHORT = VOWELS.flatMap(v => withVowel(SHORT[v], v));
const ALL_LONG = VOWELS.flatMap(v => withVowel(LONG[v], v));

export const FOUNDATION_SPECS = [
  /* ---------- Consonants and vowels ---------- */
  sk('CnVw', 'Sort consonants and vowels', 'Consonants and vowels', [1], () => {
    const L = String.fromCharCode(97 + ri(0, 25));
    const vowel = VOWELS.includes(L);
    return mc(`Is the letter ${b(L)} a consonant or a vowel?`, vowel ? 'Vowel' : 'Consonant', ['Vowel', 'Consonant'], `The vowels are a, e, i, o and u. ${b(L)} is ${vowel ? 'a vowel' : 'a consonant'}.`, 2);
  }),
  sk('FnVw', 'Find the vowel in a word', 'Consonants and vowels', [1], () => {
    const [w, e] = pick(ALL_SHORT);
    const v = w[firstVowel(w)];
    return mc(`${big(e)} ${b(w)}<br>Which letter in the word is a vowel?`, v, uniq(w.split('').filter(c => !VOWELS.includes(c))).concat(['b', 't', 'm']), `In ${b(w)}, the vowel is ${b(v)}.`);
  }),

  /* ---------- Syllables ---------- */
  sk('Syl', 'How many syllables does the word have?', 'Syllables', [1, 2], () => {
    const n = ri(1, 4), w = pick(SYLLABLES[n]);
    return mc(`How many syllables are in ${b(w)}?<br><small class="muted">Tip: clap as you say the word.</small>`, String(n), ['1', '2', '3', '4'], `${b(w)} has ${n} syllable${n > 1 ? 's' : ''}.`);
  }),
  sk('SylS', 'Sort by the number of syllables', 'Syllables', [1, 2], () => {
    const n = ri(1, 3), w = pick(SYLLABLES[n]);
    const others = [1, 2, 3, 4].filter(x => x !== n).map(x => pick(SYLLABLES[x]));
    return mc(`Which word has ${b(n)} syllable${n > 1 ? 's' : ''}?`, w, others, `${b(w)} has ${n} syllable${n > 1 ? 's' : ''}.`);
  }),

  /* ---------- Rhyming ---------- */
  sk('RhNt', 'Which word does not rhyme?', 'Rhyming', [1, 2], () => {
    const fams = Object.keys(RHYMES);
    const f = pick(fams), odd = pick(RHYMES[pick(fams.filter(x => x !== f))]);
    const three = sample(RHYMES[f], 3);
    return mc(`Which word does ${b('not')} rhyme with the others?<br>${shuffle([...three, odd]).join(' · ')}`, odd, three, `${three.join(', ')} all end in "-${f}". ${b(odd)} does not.`);
  }),
  sk('RhCp', 'Complete the rhyme', 'Rhyming', [1, 2], () => {
    const fams = Object.keys(RHYMES);
    const f = pick(fams); const [w, a] = sample(RHYMES[f], 2);
    const wrong = fams.filter(x => x !== f).map(x => pick(RHYMES[x]));
    return mc(`Which word rhymes with ${b(w)}?`, a, wrong, `${b(w)} and ${b(a)} both end in "-${f}".`);
  }),

  /* ---------- Consonant sounds ---------- */
  sk('BgSn', 'Which letter does the word start with?', 'Consonant sounds and letters', [1], () => {
    const [w, e] = pick(ALL_SHORT.concat(ALL_LONG).filter(([w]) => !/^(sh|ch|th|wh|ph|qu|kn)/.test(w)));
    return mc(`${big(e)}<br>${b('_' + w.slice(1))} — which letter does the word start with?`, w[0], sample('bcdfghjklmnprstvwz'.split(''), 6, [w[0]]), `${b(w)} starts with ${b(w[0])}.`);
  }),
  sk('EnSn', 'Which letter does the word end with?', 'Consonant sounds and letters', [1], () => {
    const [w, e] = pick(ALL_SHORT.filter(([w]) => /[bdgklmnprstx]$/.test(w) && !/(ck|ss|ll)$/.test(w)));
    const last = w[w.length - 1];
    return mc(`${big(e)}<br>${b(w.slice(0, -1) + '_')} — which letter does the word end with?`, last, sample('bdgklmnprstx'.split(''), 6, [last]), `${b(w)} ends with ${b(last)}.`);
  }),

  /* ---------- Consonant blends and digraphs ---------- */
  sk('BlSt', 'Complete the word with the right initial consonant blend', 'Consonant blends and digraphs', [1, 2, 3], completeWord(BLEND_START, uniq(BLEND_START.map(x => x[2])), () => 0)),
  sk('BlEn', 'Complete the word with the right final consonant blend', 'Consonant blends and digraphs', [1, 2], completeWord(BLEND_END, uniq(BLEND_END.map(x => x[2])), (w, p) => w.length - p.length)),
  sk('DgSt', 'Complete the word with the right digraph', 'Consonant blends and digraphs', [1, 2], completeWord(DIGRAPH_START, ['sh', 'ch', 'th', 'wh', 'ph', 'qu'], () => 0)),
  sk('DgEn', 'Complete the word with the right ending digraph', 'Consonant blends and digraphs', [1, 2], completeWord(DIGRAPH_END, ['sh', 'ch', 'th', 'ck', 'ng'], (w, p) => w.length - p.length)),
  sk('DgSp', 'Spell the digraph word', 'Consonant blends and digraphs', [1, 2], spellWord(DIGRAPH_START.concat(DIGRAPH_END))),
  sk('SlLt', 'Complete the words with silent letters', 'Consonant blends and digraphs', [2, 3], pairs({
    prompt: q => `Complete the word.<br>${q}`,
    items: [
      ['Cut the bread with a <strong>__ife</strong>.', 'kn', '"Knife" starts with a silent k.', ['kn', 'n', 'k', 'gn']],
      ['Please <strong>__ock</strong> on the door.', 'kn', '"Knock" starts with a silent k.', ['kn', 'n', 'k', 'wr']],
      ['I tied a <strong>__ot</strong> in the rope.', 'kn', '"Knot" starts with a silent k.', ['kn', 'n', 'wr', 'gn']],
      ['Please <strong>__ite</strong> your name.', 'wr', '"Write" starts with a silent w.', ['wr', 'r', 'w', 'kn']],
      ['She wore a watch on her <strong>__ist</strong>.', 'wr', '"Wrist" starts with a silent w.', ['wr', 'r', 'w', 'kn']],
      ['Give me a <strong>thu__</strong>s up!', 'mb', '"Thumb" ends with a silent b.', ['mb', 'm', 'b', 'mm']],
      ['The baby <strong>la__</strong> followed its mother.', 'mb', '"Lamb" ends with a silent b.', ['mb', 'm', 'mm', 'b']],
      ['A tiny <strong>__ome</strong> sat in the garden.', 'gn', '"Gnome" starts with a silent g.', ['gn', 'n', 'kn', 'g']],
      ['I <strong>__ow</strong> the answer!', 'kn', '"Know" starts with a silent k.', ['kn', 'n', 'gn', 'wr']],
      ['Use a <strong>co__</strong> to fix your hair.', 'mb', '"Comb" ends with a silent b.', ['mb', 'm', 'mm', 'b']]
    ]
  })),
  sk('BlSo', 'Sort by initial consonant blend or digraph', 'Consonant blends and digraphs', [1, 2], () => {
    const [w, e, part] = pick(BLEND_START.concat(DIGRAPH_START));
    const isDg = DIGRAPH_START.some(x => x[0] === w);
    return mc(`${big(e)} ${b(w)}<br>Does this word start with a consonant blend or a digraph?`, isDg ? 'Digraph' : 'Consonant blend', ['Digraph', 'Consonant blend'],
      isDg ? `"${part}" makes one new sound — a digraph.` : `In "${part}" you can hear both letters — a blend.`, 2);
  }),

  /* ---------- Short vowels (one skill per vowel, like IXL) ---------- */
  ...VOWELS.flatMap(v => [
    sk('Sh' + v.toUpperCase() + 'm', `Short ${v}: choose the word that matches the picture`, 'Short vowels', [1], matchPicture(SHORT[v])),
    sk('Sh' + v.toUpperCase() + 'c', `Short ${v}: complete the word`, 'Short vowels', [1], () => {
      const [w, e] = pick(SHORT[v]); const at = firstVowel(w);
      return mc(`${big(e)}<br>Complete the word: ${b(w.slice(0, at) + '_' + w.slice(at + 1))}`, v, VOWELS, `${b(w)} has the short ${b(v)} sound.`, 5);
    })
  ]),
  sk('ShId', 'Identify the short vowel sound in a word', 'Short vowels', [1, 2], () => {
    const [w, e, v] = pick(ALL_SHORT);
    return mc(`${big(e)} ${b(w)}<br>Which short vowel sound do you hear?`, `short ${v}`, VOWELS.map(x => `short ${x}`), `${b(w)} has the short ${v} sound.`, 5);
  }),
  sk('ShSp', 'Spell the short vowel word', 'Short vowels', [1, 2], spellWord(ALL_SHORT)),

  /* ---------- Short and long vowels ---------- */
  sk('SLSo', 'Sort short and long vowel words', 'Short and long vowels', [1, 2, 3], () => {
    const long = Math.random() < 0.5;
    const [w, e, v] = pick(long ? ALL_LONG : ALL_SHORT);
    return mc(`${big(e)} ${b(w)}<br>Does this word have a short or long vowel sound?`, long ? 'Long vowel' : 'Short vowel', ['Long vowel', 'Short vowel'],
      long ? `The vowel says its name in ${b(w)}: long ${v}.` : `${b(w)} has a short ${v} sound.`, 2);
  }),
  sk('SLSm', 'Find the word with the same vowel sound', 'Short and long vowels', [1, 2], () => {
    const long = Math.random() < 0.5, v = pick(VOWELS);
    const pool = (long ? LONG : SHORT)[v].map(x => x[0]);
    const [w, a] = sample(pool, 2);
    const wrong = [
      ...sample((long ? SHORT : LONG)[v].map(x => x[0]), 2),
      ...sample((long ? LONG : SHORT)[pick(VOWELS.filter(x => x !== v))].map(x => x[0]), 2)
    ];
    return mc(`Which word has the same vowel sound as ${b(w)}?`, a, wrong, `${b(w)} and ${b(a)} both have the ${long ? 'long' : 'short'} ${v} sound.`);
  }),

  /* ---------- Silent e ---------- */
  sk('SeMt', 'Choose the silent e word that matches the picture', 'Silent e', [1, 2], matchPicture(SILENT_E)),
  sk('SeCp', 'Complete the silent e word', 'Silent e', [1, 2], () => {
    const [w, e] = pick(SILENT_E); const at = firstVowel(w);
    return mc(`${big(e)}<br>Complete the word: ${b(w.slice(0, at) + '_' + w.slice(at + 1))}`, w[at], VOWELS, `${b(w)}: the silent e makes the ${w[at]} say its name.`, 5);
  }),
  sk('SeSp', 'Spell the silent e word', 'Silent e', [1, 2, 3], spellWord(SILENT_E)),

  /* ---------- Vowel teams ---------- */
  sk('VtMt', 'Choose the vowel team word that matches the picture', 'Vowel teams', [1, 2], matchPicture(VOWEL_TEAM)),
  sk('VtCp', 'Complete the word with the right vowel team', 'Vowel teams', [1, 2], completeWord(VOWEL_TEAM, ['ai', 'ay', 'ee', 'ea', 'oa', 'ow', 'ie', 'oo', 'ew', 'igh'])),
  sk('VtSp', 'Spell the long vowel word', 'Vowel teams', [2, 3], spellWord(VOWEL_TEAM.concat(SILENT_E))),

  /* ---------- R-controlled vowels ---------- */
  sk('RcMt', 'Choose the r-controlled word that matches the picture', 'R-controlled vowels', [1, 2], matchPicture(R_CTRL)),
  sk('RcCp', 'Complete the word with the right r-controlled vowel: ar, er, ir, or, ur', 'R-controlled vowels', [1, 2, 3], completeWord(R_CTRL, ['ar', 'er', 'ir', 'or', 'ur'])),

  /* ---------- Diphthongs ---------- */
  sk('DpMt', 'Choose the diphthong word that matches the picture', 'Diphthongs: oi, oy, ou, ow', [1, 2], matchPicture(DIPH)),
  sk('DpCp', 'Complete the word with the right diphthong: oi, oy, ou, ow', 'Diphthongs: oi, oy, ou, ow', [1, 2, 3], completeWord(DIPH, ['oi', 'oy', 'ou', 'ow'])),

  /* ---------- Soft g and c / consonant-l-e / syllables ---------- */
  sk('SoftGC', 'Sort soft and hard g and c words', 'Two-syllable and multisyllable words', [2], classify({
    categories: ['Soft c (like s)', 'Hard c (like k)', 'Soft g (like j)', 'Hard g (like goat)'],
    prompt: s => `What sound does ${s} make?`,
    items: [
      ['city', 'c', 'Soft c (like s)'], ['cent', 'c', 'Soft c (like s)'], ['circle', 'c', 'Soft c (like s)'], ['ice', 'c', 'Soft c (like s)'], ['face', 'c', 'Soft c (like s)'],
      ['cat', 'c', 'Hard c (like k)'], ['cup', 'c', 'Hard c (like k)'], ['cake', 'c', 'Hard c (like k)'], ['corn', 'c', 'Hard c (like k)'],
      ['gem', 'g', 'Soft g (like j)'], ['giant', 'g', 'Soft g (like j)'], ['giraffe', 'g', 'Soft g (like j)'], ['page', 'g', 'Soft g (like j)'], ['cage', 'g', 'Soft g (like j)'],
      ['goat', 'g', 'Hard g (like goat)'], ['game', 'g', 'Hard g (like goat)'], ['gum', 'g', 'Hard g (like goat)'], ['bag', 'g', 'Hard g (like goat)']
    ].map(([w, l, c]) => [`the <strong>${l}</strong> in <strong>${w}</strong>`, c, `Before e, i or y, c and g are usually soft. In ${b(w)} the ${l} is ${c.split(' (')[0].toLowerCase()}.`])
  })),
  sk('TwoSyl', 'Put two syllables together to create a word', 'Two-syllable and multisyllable words', [1, 2], () => {
    const [x, y] = pick([['rab', 'bit'], ['pen', 'cil'], ['ti', 'ger'], ['mon', 'key'], ['gar', 'den'], ['win', 'dow'], ['bas', 'ket'], ['can', 'dle'], ['doc', 'tor'], ['ta', 'ble'], ['mu', 'sic'], ['hap', 'py'], ['jack', 'et'], ['pic', 'nic'], ['sun', 'set'], ['cup', 'cake'], ['nap', 'kin'], ['muf', 'fin'], ['kit', 'ten'], ['pup', 'py'], ['zip', 'per'], ['rob', 'in'], ['lem', 'on'], ['wag', 'on']]);
    const w = x + y;
    return mc(`Put the syllables together: ${b(x)} + ${b(y)} = ?`, w, misspell(w, 3), `${x} + ${y} = ${b(w)}.`);
  }),
  sk('ClE', 'Choose the correct spelling of the consonant-l-e word', 'Two-syllable and multisyllable words', [2, 3], () => {
    const w = pick(['table', 'apple', 'bottle', 'candle', 'turtle', 'puzzle', 'bubble', 'little', 'purple', 'circle', 'jungle', 'eagle', 'pickle', 'uncle', 'giggle', 'needle', 'middle', 'simple']);
    const stem = w.slice(0, -2);
    return mc(`Which is the correct spelling?`, w, [stem + 'el', stem + 'ul', stem + 'al', stem.slice(0, -1) + 'le'], `Words like ${b(w)} end in consonant + -le.`);
  }),
  sk('OpCl', 'Is the syllable open or closed?', 'Two-syllable and multisyllable words', [2, 3], classify({
    categories: ['Open syllable', 'Closed syllable'],
    prompt: s => `Is the first syllable of ${s} open or closed?`,
    items: [
      ['<strong>ba</strong>·by', 'Open syllable'], ['<strong>ti</strong>·ger', 'Open syllable'], ['<strong>ro</strong>·bot', 'Open syllable'], ['<strong>mu</strong>·sic', 'Open syllable'], ['<strong>pa</strong>·per', 'Open syllable'], ['<strong>e</strong>·ven', 'Open syllable'],
      ['<strong>rab</strong>·bit', 'Closed syllable'], ['<strong>nap</strong>·kin', 'Closed syllable'], ['<strong>bas</strong>·ket', 'Closed syllable'], ['<strong>mag</strong>·net', 'Closed syllable'], ['<strong>pic</strong>·nic', 'Closed syllable'], ['<strong>hel</strong>·met', 'Closed syllable']
    ].map(([w, c]) => [w, c, c === 'Open syllable' ? 'An open syllable ends with a vowel, so the vowel is long.' : 'A closed syllable ends with a consonant, so the vowel is short.'])
  })),

  /* ---------- Sight words ---------- */
  sk('SwSn', 'Complete the sentence with the correct sight word', 'Sight words', [1, 2], pairs({
    prompt: s => `Complete the sentence.<br><em>${s}</em>`,
    items: [
      ['Can you read it ___?', 'again', ['again', 'from', 'were', 'gave']],
      ['I got a letter ___ my aunt.', 'from', ['from', 'once', 'were', 'again']],
      ['___ will we eat lunch?', 'When', ['When', 'Them', 'From', 'Gave']],
      ['We had cake ___ dinner.', 'after', ['after', 'them', 'were', 'gave']],
      ['She ___ me a big hug.', 'gave', ['gave', 'from', 'when', 'them']],
      ['A chair has ___ legs.', 'four', ['four', 'from', 'when', 'were']],
      ['My mom ___ a red car.', 'has', ['has', 'from', 'when', 'them']],
      ['___ is your coat?', 'Where', ['Where', 'Gave', 'From', 'Them']],
      ['I will ___ my teacher for help.', 'ask', ['ask', 'from', 'were', 'them']],
      ['Do you ___ how to swim?', 'know', ['know', 'from', 'were', 'again']],
      ['Birds can ___ high in the sky.', 'fly', ['fly', 'from', 'were', 'them']],
      ['I will see you ___!', 'soon', ['soon', 'from', 'gave', 'were']],
      ['___ is the sky blue?', 'Why', ['Why', 'Gave', 'From', 'Them']],
      ['They ___ happy to see us.', 'were', ['were', 'from', 'gave', 'once']],
      ['I ___ to play outside.', 'want', ['want', 'from', 'were', 'them']],
      ['___ day I walk to school.', 'Every', ['Every', 'From', 'Were', 'Gave']],
      ['Can you ___ me the ball?', 'give', ['give', 'from', 'were', 'them']],
      ['___ upon a time, there was a king.', 'Once', ['Once', 'From', 'Were', 'Gave']],
      ['I could not find ___ anywhere.', 'them', ['them', 'from', 'were', 'gave']],
      ['The cow jumped ___ the moon.', 'over', ['over', 'gave', 'were', 'them']]
    ].map(([s, a, w]) => [s, a, `The sentence makes sense with ${b(a)}.`, w])
  })),
  sk('SwSp', 'Spell the sight word', 'Sight words', [1, 2, 3], () => {
    const w = pick(SIGHT_WORDS.filter(x => x.length >= 3));
    return mc(`Which sight word is spelled correctly?`, w, misspell(w, 3), `It is spelled ${b(w)}.`);
  })
];
