/* English — Kindergarten skills (IXL Canada ELA Kindergarten) plus a few Grade 1–8 additions:
   letters, word recognition, early phonics, sight words (spoken), early vocabulary and grammar,
   and "compare illustrations" skills (the illustrations are described in words). */
import { pairs } from '../quiz.js';
import { ri, pick, shuffle, sample, uniq, big, b, mc } from './words.js';
import { SHORT, LONG, BLEND_START, BLEND_END } from './words.js';

const sk = (k, t, s, g, gen) => ({ k, t, s, g, gen });
const G = (a, z) => Array.from({ length: z - a + 1 }, (_, i) => a + i);
const listen = (q, say) => ({ ...q, say, lang: 'en-US', listen: true });
const qa = items => pairs({ items: items.map(([q, a, w, n]) => [q, a, n, [a, ...w]]) });
const ABC = 'abcdefghijklmnopqrstuvwxyz'.split('');
const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const L = s => `<span style="font-size:2rem;font-weight:800">${s}</span>`;

/* ---------- letters ---------- */
const findLetter = upper => () => {
  const c = pick(ABC), show = upper ? c.toUpperCase() : c;
  return mc(`Find the letter ${L(show)}`, show, sample(ABC.filter(x => x !== c), 3).map(x => (upper ? x.toUpperCase() : x)), `That is the letter ${b(show)}.`);
};
const hearLetter = upper => () => {
  const c = pick(ABC), show = upper ? c.toUpperCase() : c;
  return listen(mc('🎧 <strong>Listen</strong>, then choose the letter you hear.', show, sample(ABC.filter(x => x !== c), 3).map(x => (upper ? x.toUpperCase() : x)), `You heard the letter ${b(show)}.`), c.toUpperCase());
};
const CONFUSED = [['b', 'd', 'p', 'q'], ['m', 'n', 'u', 'w'], ['i', 'l', 'j', 't'], ['E', 'F', 'P', 'R']];
const matchCase = (letters, toLower) => () => {
  const c = pick(letters), from = toLower ? c.toUpperCase() : c.toLowerCase(), to = toLower ? c.toLowerCase() : c.toUpperCase();
  const pool = ABC.map(x => (toLower ? x : x.toUpperCase())).filter(x => x !== to);
  return mc(`Which ${toLower ? 'lowercase' : 'uppercase'} letter matches ${L(from)}?`, to, sample(pool, 3), `${from} and ${to} are the same letter.`);
};
const findAllCase = lower => () => {
  const pickSet = n => sample(ABC, n);
  const good = pickSet(3).map(x => (lower ? x : x.toUpperCase())).join(' ');
  const wrong = Array.from({ length: 3 }, () => { const s = pickSet(3); const i = ri(0, 2); return s.map((x, j) => ((j === i) === lower ? x.toUpperCase() : x)).join(' '); });
  return mc(`Which group has only ${lower ? 'lowercase' : 'uppercase'} letters?`, good, wrong, `${b(good)} are all ${lower ? 'lowercase' : 'uppercase'}.`);
};

/* ---------- words ---------- */
const CVC = Object.values(SHORT).flat().filter(([w]) => /^[a-z]{3}$/.test(w));
const KWORDS = ['cat', 'dog', 'sun', 'map', 'pig', 'bed', 'box', 'hat', 'cup', 'fan', 'red', 'big', 'run', 'top', 'net', 'mud'];
const SPACED = [['I like my dog.', ['Ilike my dog.', 'I likemy dog.', 'I like mydog.']], ['We can run fast.', ['Wecan run fast.', 'We canrun fast.', 'We can runfast.']],
  ['The cat is big.', ['Thecat is big.', 'The catis big.', 'The cat isbig.']], ['Mom has a red hat.', ['Momhas a red hat.', 'Mom has ared hat.', 'Mom has a redhat.']]];
const ONSET = [['c', 'at', 'cat'], ['h', 'at', 'hat'], ['d', 'og', 'dog'], ['f', 'og', 'fog'], ['s', 'un', 'sun'], ['r', 'un', 'run'], ['p', 'ig', 'pig'], ['b', 'ig', 'big'], ['b', 'ed', 'bed'], ['r', 'ed', 'red'], ['m', 'op', 'mop'], ['t', 'op', 'top']];
const PIC_WORDS = [['bee', '🐝'], ['ball', '⚽'], ['bus', '🚌'], ['dog', '🐶'], ['duck', '🦆'], ['jam', '🍓'], ['jet', '✈️'], ['kite', '🪁'], ['key', '🔑'], ['pig', '🐷'], ['pen', '🖊️'],
  ['top', '🔝'], ['tent', '⛺'], ['van', '🚐'], ['vest', '🦺'], ['zoo', '🦓'], ['zip', '🤐'], ['fish', '🐟'], ['fan', '🪭'], ['leaf', '🍃'], ['lion', '🦁'], ['moon', '🌙'], ['map', '🗺️'],
  ['nest', '🪺'], ['nut', '🥜'], ['rain', '🌧️'], ['ring', '💍'], ['sun', '☀️'], ['sock', '🧦'], ['cat', '🐱'], ['cake', '🎂'], ['goat', '🐐'], ['gift', '🎁'], ['hat', '🎩'], ['horse', '🐴'], ['web', '🕸️'], ['watch', '⌚']];
const consonantSound = letters => () => {
  const [w, e] = pick(PIC_WORDS.filter(x => letters.includes(x[0][0]))), c = w[0];
  return listen(mc(`${big(e)}<br>🎧 Which letter makes the first sound in ${b(w)}?`, c, sample(ABC.filter(x => !VOWELS.includes(x) && x !== c), 3), `${b(w)} starts with the ${b(c)} sound.`), w);
};
const K_SIGHT = [['ate', 'he', 'of', 'that', 'was'], ['are', 'green', 'on', 'please', 'they'], ['be', 'have', 'or', 'pretty', 'this'], ['all', 'but', 'ride', 'saw', 'what'], ['about', 'like', 'she', 'under', 'we'],
  ['black', 'into', 'made', 'ran', 'white'], ['am', 'did', 'get', 'now', 'well'], ['fast', 'good', 'him', 'take', 'will'], ['came', 'going', 'say', 'too', 'with'], ['brown', 'does', 'eat', 'must', 'went']];
const sightListen = words => () => { const w = pick(words); return listen(mc('🎧 <strong>Listen</strong>, then choose the word you hear.', w, sample(words.filter(x => x !== w), 3), `The word was ${b(w)}.`), w); };
const G1_SIGHT = [['again', 'each', 'from', 'may', 'stop', 'than', 'when'], ['after', 'best', 'gave', 'has', 'once', 'them', 'were'], ['as', 'by', 'four', 'her', 'more', 'some', 'think', 'way'],
  ['every', 'could', 'how', 'over', 'put', 'there', 'who'], ['ask', 'five', 'just', 'long', 'read', 'then', 'want'], ['any', 'give', 'his', 'new', 'open', 'sleep', 'wish'], ['also', 'fly', 'know', 'live', 'old', 'soon', 'why']];
const SHORT_SENT = {
  a: [['🐱', 'The cat sat on a mat.'], ['🎩', 'Dad has a hat.'], ['🗺️', 'I can read a map.'], ['🦇', 'A bat can fly.'], ['🍳', 'The pan is hot.']],
  e: [['🛏️', 'I sleep in my bed.'], ['🐔', 'The hen sat on an egg.'], ['🥅', 'The ball is in the net.'], ['🖊️', 'I have a red pen.'], ['⛺', 'We slept in a tent.']],
  i: [['🐷', 'The pig is in the mud.'], ['🐟', 'A fish can swim.'], ['📌', 'I see a pin.'], ['🎁', 'Kim has a gift.'], ['🚢', 'The ship is big.']],
  o: [['🐶', 'The dog can hop.'], ['🦊', 'The fox is in the box.'], ['🧦', 'I lost my sock.'], ['🐸', 'The frog sat on a log.'], ['🕰️', 'Look at the clock.']],
  u: [['🚌', 'We ride the bus.'], ['☀️', 'The sun is up.'], ['🐛', 'A bug is on the rug.'], ['🦆', 'The duck is in the tub.'], ['🥁', 'I can hit the drum.']]
};
const shortSentence = v => () => {
  const [e, s] = pick(SHORT_SENT[v]);
  return mc(`${big(e)}<br>Which sentence matches the picture?`, s, sample(SHORT_SENT[v].filter(x => x[1] !== s).map(x => x[1]), 3), `The picture matches: ${b(s)}`);
};
const findVowelWord = (lists, v, kind) => () => {
  const w = pick(lists[v])[0];
  const others = sample(VOWELS.filter(x => x !== v).flatMap(x => (kind === 'short' ? SHORT : LONG)[x].map(y => y[0])), 3);
  return mc(`Which word has the ${kind} ${b(v)} sound?`, w, others, `${b(w)} has the ${kind} ${v} sound.`);
};
const COLOURS = [['🍎', 'red'], ['🍌', 'yellow'], ['🌳', 'green'], ['🫐', 'blue'], ['🍊', 'orange'], ['🍇', 'purple'], ['🐷', 'pink'], ['🐻', 'brown'], ['⚫', 'black'], ['⛄', 'white']];
const ACTION_PIC = [['🏃', 'run'], ['🏊', 'swim'], ['😴', 'sleep'], ['🍽️', 'eat'], ['📖', 'read'], ['🎤', 'sing'], ['💃', 'dance'], ['🧗', 'climb'], ['✍️', 'write'], ['🤸', 'jump']];

/* ---------- compare illustrations (described in words) ---------- */
const MYTH_ILL = [
  ['Illustration A shows Icarus soaring high, his wax wings dripping in the bright sun. Illustration B shows Icarus falling toward the sea as feathers scatter.', 'How are the illustrations different?', 'A shows Icarus flying; B shows him falling', ['Both show him flying', 'Both show him falling', 'A shows the sea; B shows a forest'], 'They show two different moments of the myth.'],
  ['Illustration A shows Pandora smiling as she lifts the lid of a box. Illustration B shows dark, winged creatures flying out while Pandora covers her face.', 'What does Illustration B show that A does not?', 'The troubles escaping from the box', ['Pandora smiling', 'A closed box', 'Pandora opening the lid'], 'B shows the consequence of opening the box.'],
  ['Illustration A shows the tortoise plodding steadily along a road. Illustration B shows the hare asleep under a tree while the tortoise passes him.', 'What do both illustrations include?', 'The tortoise', ['The hare asleep', 'A tree', 'A finish line'], 'The tortoise appears in both.'],
  ['Illustration A shows King Midas joyfully turning a rose to gold. Illustration B shows Midas weeping as his daughter turns to gold in his arms.', 'How does the mood change from A to B?', 'From joyful to sorrowful', ['From sad to happy', 'From angry to calm', 'It stays the same'], 'His gift becomes a curse.']
];
const LIT_HIST_ILL = [
  ['Two illustrations show Laura Secord\'s 1813 walk to warn British troops. One shows her alone in a dark forest, looking afraid; the other shows her proudly delivering the message to an officer.', 'What does the first illustration emphasize that the second does not?', 'The danger and fear of her journey', ['Her success', 'The British officer', 'A celebration'], 'The dark forest and her fear stress danger.'],
  ['One illustration of the Last Spike (1885) shows crowds cheering; another shows exhausted workers resting beside the tracks.', 'How do the illustrations present the event differently?', 'One celebrates the achievement; the other shows the workers\' hardship', ['Both show celebrations', 'Both show only workers', 'Neither shows the railway'], 'Each artist chose a different focus.'],
  ['In one illustration of Romeo and Juliet\'s balcony scene, Juliet is lit by moonlight while Romeo hides in shadow below. In another, both stand together in a bright garden.', 'What effect does the shadow in the first illustration create?', 'It suggests secrecy and danger', ['It shows that it is noon', 'It makes the scene cheerful', 'It shows the two are related'], 'Shadow suggests their love must be hidden.']
];

export const KINDER_SPECS = [
  sk('XLtUp', 'Find the letter in the alphabet: uppercase', 'Letter identification', [0], findLetter(true)),
  sk('XLtLo', 'Find the letter in the alphabet: lowercase', 'Letter identification', [0], findLetter(false)),
  sk('XLtHU', 'Choose the letter that you hear: uppercase', 'Letter identification', [0], hearLetter(true)),
  sk('XLtHL', 'Choose the letter that you hear: lowercase', 'Letter identification', [0], hearLetter(false)),
  sk('XLtCf', 'Frequently confused letters: find the letter', 'Letter identification', [0], () => { const set = pick(CONFUSED), c = pick(set); return mc(`Find the letter ${L(c)}`, c, set.filter(x => x !== c), `That is ${b(c)}.`); }),
  sk('XLtCa', 'Frequently confused letters: find all the letters', 'Letter identification', [0], () => { const set = pick(CONFUSED), c = pick(set), o = set.filter(x => x !== c);
    return mc(`Which group shows only the letter ${L(c)}?`, `${c} ${c} ${c}`, [`${c} ${o[0]} ${c}`, `${o[1]} ${c} ${c}`, `${c} ${c} ${o[2]}`], `Only ${b(c + ' ' + c + ' ' + c)} has all ${c}'s.`); }),
  sk('XLcA', 'Choose the lowercase letter that matches: c, k, o, p, s, u, v, w, x, z', 'Lowercase and uppercase letters', [0], matchCase('ckopsuvwxz'.split(''), true)),
  sk('XLcB', 'Choose the lowercase letter that matches: f, i, j, l, m, t, y', 'Lowercase and uppercase letters', [0], matchCase('fijlmty'.split(''), true)),
  sk('XLcC', 'Choose the lowercase letter that matches: a, b, d, e, g, h, n, q, r', 'Lowercase and uppercase letters', [0], matchCase('abdeghnqr'.split(''), true)),
  sk('XLcR', 'Choose the lowercase letter that matches: review', 'Lowercase and uppercase letters', [0], matchCase(ABC, true)),
  sk('XLcAll', 'Find all the lowercase letters', 'Lowercase and uppercase letters', [0], findAllCase(true)),
  sk('XUcA', 'Choose the uppercase letter that matches: C, K, O, P, S, U, V, W, X, Z', 'Lowercase and uppercase letters', [0], matchCase('ckopsuvwxz'.split(''), false)),
  sk('XUcB', 'Choose the uppercase letter that matches: F, I, J, L, M, T, Y', 'Lowercase and uppercase letters', [0], matchCase('fijlmty'.split(''), false)),
  sk('XUcC', 'Choose the uppercase letter that matches: A, B, D, E, G, H, N, Q, R', 'Lowercase and uppercase letters', [0], matchCase('abdeghnqr'.split(''), false)),
  sk('XUcR', 'Choose the uppercase letter that matches: review', 'Lowercase and uppercase letters', [0], matchCase(ABC, false)),
  sk('XUcAll', 'Find all the uppercase letters', 'Lowercase and uppercase letters', [0], findAllCase(false)),
  sk('XSame2', 'Choose the two words that are the same', 'Word recognition', [0], () => { const [w, x, y] = sample(KWORDS, 3); return mc('Which two words are the same?', `${w} ${w}`, [`${w} ${x}`, `${x} ${y}`, `${y} ${w}`], `${b(w)} and ${b(w)} are the same.`); }),
  sk('XSpace', 'Choose the sentence that is spaced correctly', 'Word recognition', [0], () => { const [s, w] = pick(SPACED); return mc('Which sentence is spaced correctly?', s, w, `Leave a space between words: ${b(s)}`); }),
  sk('XFindW', 'Find a word in a sentence', 'Word recognition', [0], () => { const S = ['The cat ran to the box.', 'I can see a big red bus.', 'We play in the sun.', 'My dog has a hat.']; const s = pick(S), words = s.replace('.', '').split(' '), w = pick(words.filter(x => x.length > 2));
    return mc(`Find the word ${b(w)} in the sentence.<br><em>${s}</em>`, w, sample(uniq(words.filter(x => x !== w)), 3), `${b(w)} is in the sentence.`); }),
  sk('XMoreS', 'Which word has more syllables?', 'Syllables', [0], () => { const P = [['rabbit', 'cat'], ['pencil', 'pen'], ['banana', 'bun'], ['butterfly', 'bug'], ['tiger', 'tree'], ['basket', 'box'], ['elephant', 'egg'], ['apple', 'ant']]; const [m, l] = pick(P);
    return mc('Which word has more syllables?', m, [l], `${b(m)} has more syllables (clap it out!).`, 2); }),
  sk('XSameE', 'Which word has the same ending?', 'Rhyming', [0], () => { const F = [['cat', 'hat', 'bat'], ['dog', 'log', 'frog'], ['bee', 'tree', 'see'], ['cake', 'lake', 'snake'], ['sun', 'run', 'fun'], ['pig', 'wig', 'dig']]; const f = pick(F), [a, c] = sample(f, 2);
    return mc(`Which word has the same ending as ${b(a)}?`, c, sample(F.filter(x => x !== f).flat(), 3), `${b(a)} and ${b(c)} end the same way.`); }),
  sk('XSameE2', 'Which two words have the same ending?', 'Rhyming', [0], () => { const F = [['cat', 'hat'], ['dog', 'log'], ['bee', 'tree'], ['cake', 'lake'], ['sun', 'run'], ['pig', 'wig']]; const p = pick(F), o = sample(F.filter(x => x !== p), 3);
    return mc('Which two words have the same ending?', `${p[0]} and ${p[1]}`, o.map((x, i) => `${x[0]} and ${o[(i + 1) % 3][1]}`), `${b(p[0])} and ${b(p[1])} rhyme.`); }),
  sk('XOnset', 'Blend onset and rime together to make a word', 'Blending and segmenting', [0], () => { const [o, r, w] = pick(ONSET); return mc(`Blend ${b('/' + o + '/')} + ${b('-' + r)}. What word do they make?`, w, sample(ONSET.map(x => x[2]).filter(x => x !== w), 3), `${o} + ${r} = ${b(w)}.`); }),
  sk('XEndS', 'Which word ends with the same sound?', 'Beginning and ending sounds', [0], () => { const w = pick(KWORDS), same = pick(KWORDS.filter(x => x !== w && x.slice(-1) === w.slice(-1))) || 'mat';
    return mc(`Which word ends with the same sound as ${b(w)}?`, same, sample(KWORDS.filter(x => x.slice(-1) !== w.slice(-1)), 3), `${b(w)} and ${b(same)} both end with ${b(w.slice(-1))}.`); }),
  sk('XBegS', 'Find the words that begin with a given sound', 'Letter-sound associations', [0], () => { const [w, e] = pick(PIC_WORDS), c = w[0];
    return mc(`Which word begins with the ${b('/' + c + '/')} sound?`, w, sample(PIC_WORDS.filter(x => x[0][0] !== c).map(x => x[0]), 3), `${b(w)} begins with ${c}.`); }),
  sk('XCs1', 'Choose the letter that matches the consonant sound: b, d, j, k, p, t, v, z', 'Letter-sound associations', [0], consonantSound('bdjkptvz')),
  sk('XCs2', 'Choose the letter that matches the consonant sound: f, l, m, n, r, s', 'Letter-sound associations', [0], consonantSound('flmnrs')),
  sk('XCs3', 'Choose the letter that matches the consonant sound: c, g, h, w', 'Letter-sound associations', [0], consonantSound('cghw')),
  sk('XCsR', 'Choose the letter that matches the consonant sound: review', 'Letter-sound associations', [0], consonantSound('bdjkptvzflmnrscghw')),
  sk('XWBlS', 'Which consonant blend does the word start with?', 'Consonant blends and digraphs', [0], () => { const [w, e, bl] = pick(BLEND_START); return mc(`${big(e)}<br>Which blend does ${b(w)} start with?`, bl, sample(uniq(BLEND_START.map(x => x[2])).filter(x => x !== bl), 3), `${b(w)} starts with ${b(bl)}.`); }),
  sk('XWBlE', 'Which consonant blend does the word end with?', 'Consonant blends and digraphs', [0], () => { const [w, e, bl] = pick(BLEND_END); return mc(`${big(e)}<br>Which blend does ${b(w)} end with?`, bl, sample(uniq(BLEND_END.map(x => x[2])).filter(x => x !== bl), 3), `${b(w)} ends with ${b(bl)}.`); }),
  sk('XDblW', 'Choose the word that matches the picture: -ss, -ll, -ff, -zz, -ck', 'Consonant blends and digraphs', [0], () => { const P = [['bell', '🔔'], ['ball', '⚽'], ['dress', '👗'], ['grass', '🌱'], ['duck', '🦆'], ['sock', '🧦'], ['clock', '🕰️'], ['shell', '🐚'], ['buzz', '🐝'], ['truck', '🚚']]; const [w, e] = pick(P);
    return mc(`${big(e)}<br>Which word matches the picture?`, w, sample(P.filter(x => x[0] !== w).map(x => x[0]), 3), `The picture shows ${b(w)}.`); }),
  ...VOWELS.map(v => sk(`XFS${v}`, `Find the short ${v} word`, `Short ${v}`, [0], findVowelWord(SHORT, v, 'short'))),
  ...VOWELS.map(v => sk(`XSS${v}`, `Choose the short ${v} sentence that matches the picture`, `Short ${v}`, [0, 1], shortSentence(v))),
  ...VOWELS.map(v => sk(`XFL${v}`, `Find the long ${v} word`, 'Long vowels', [0], findVowelWord(LONG, v, 'long'))),
  sk('XRQs', 'Read questions with short vowel words', 'Short vowels', [0], qa([['Can a cat sit on a mat?', 'Yes', ['No'], 'A cat can sit on a mat.'], ['Can a pig fly?', 'No', ['Yes'], 'Pigs cannot fly.'], ['Is the sun hot?', 'Yes', ['No'], 'The sun is hot.'],
    ['Can a bug sit in a cup?', 'Yes', ['No'], 'A small bug can fit in a cup.'], ['Can a dog get on a bus?', 'Yes', ['No'], 'A dog can ride a bus.'], ['Is a hen as big as a bus?', 'No', ['Yes'], 'A hen is much smaller.']])),
  sk('XSw2s', 'Choose the two sight words that are the same', 'Sight words', [0], () => { const [w, x, y] = sample(K_SIGHT.flat(), 3); return mc('Which two sight words are the same?', `${w} ${w}`, [`${w} ${x}`, `${x} ${y}`, `${y} ${w}`], `${b(w)} and ${b(w)} match.`); }),
  ...K_SIGHT.map((set, i) => sk(`XKs${i + 1}`, `Read sight words set ${i + 1}: ${set.join(', ')}`, 'Sight words', [0], sightListen(set))),
  sk('XKsR1', 'Read sight words: review sets 1, 2, 3', 'Sight words', [0], sightListen(K_SIGHT.slice(0, 3).flat())),
  sk('XKsR2', 'Read sight words: review sets 4, 5, 6', 'Sight words', [0], sightListen(K_SIGHT.slice(3, 6).flat())),
  sk('XKsR3', 'Read sight words: review sets 7, 8, 9, 10', 'Sight words', [0], sightListen(K_SIGHT.slice(6).flat())),
  sk('XKsR4', 'Read sight words: review sets 1–10', 'Sight words', [0], sightListen(K_SIGHT.flat())),
  ...G1_SIGHT.map((set, i) => sk(`XGs${i + 1}`, `Read sight words set ${i + 1}: ${set.join(', ')}`, 'Sight words', [1], sightListen(set))),
  sk('XBook', 'Identify book parts and features', 'Text features', [0], qa([['Which part of a book shows the title and the author?', 'The cover', ['The last page', 'The spine only', 'The middle'], 'The cover shows the title and author.'],
    ['Who writes the words in a book?', 'The author', ['The illustrator', 'The reader', 'The publisher'], 'The author writes the words.'], ['Who draws the pictures in a book?', 'The illustrator', ['The author', 'The reader', 'The librarian'], 'The illustrator makes the pictures.'],
    ['What is the name of a book called?', 'The title', ['The author', 'The page', 'The picture'], 'The title is the book\'s name.'], ['Where do you start reading a book?', 'At the front', ['At the back', 'In the middle', 'On the spine'], 'Books start at the front.']])),
  sk('XColW', 'Use colour words', 'Colour and number words', [0], () => { const [e, c] = pick(COLOURS); return mc(`${big(e)}<br>What colour is it?`, c, sample(COLOURS.map(x => x[1]).filter(x => x !== c), 3), `It is ${b(c)}.`); }),
  sk('XVbPic', 'Find the picture that matches the action verb', 'Adjectives and verbs', [0], () => { const [e, v] = pick(ACTION_PIC); return mc(`Which picture shows ${b(v)}?`, e, sample(ACTION_PIC.filter(x => x[1] !== v).map(x => x[0]), 3), `${e} shows someone who can ${v}.`); }),
  sk('XAvImg', 'Find the action verb with images', 'Verbs', [0], () => { const [e, v] = pick(ACTION_PIC); return mc(`${big(e)}<br>Which word is the action?`, v, sample(['happy', 'red', 'big', 'dog', 'tree', 'soft'], 3), `${b(v)} is an action verb.`); }),
  sk('XLoc1', 'Inside and outside, above and below, next to and beside', 'Location words', [0], qa([['🐟 in 🫙 — The fish is ___ the jar.', 'inside', ['outside', 'above', 'below'], 'The fish is in the jar.'], ['🐦 over 🏠 — The bird is ___ the house.', 'above', ['below', 'inside', 'beside'], 'The bird is over the house.'],
    ['🐶 under 🛏️ — The dog is ___ the bed.', 'below', ['above', 'inside', 'next to'], 'Under means below.'], ['🧸 🛋️ — The bear sits ___ the sofa.', 'next to', ['inside', 'above', 'below'], 'Beside means next to.'], ['⛄ 🏠 — The snowman is ___ the house.', 'outside', ['inside', 'below', 'above'], 'Snowmen are outside.']])),
  sk('XSynM', 'Match synonyms', 'Synonyms and antonyms', [0], () => { const S = [['big', 'large'], ['small', 'little'], ['happy', 'glad'], ['fast', 'quick'], ['shut', 'close'], ['jump', 'hop']]; const [a, c] = pick(S);
    return mc(`Which word means the same as ${b(a)}?`, c, sample(S.filter(x => x[0] !== a).map(x => x[1]), 3), `${b(a)} and ${b(c)} are synonyms.`); }),
  sk('XAntP', 'Match antonyms to pictures', 'Synonyms and antonyms', [0], () => { const A = [['hot', '🔥', 'cold', '🧊'], ['day', '☀️', 'night', '🌙'], ['happy', '😀', 'sad', '😢'], ['big', '🐘', 'small', '🐭'], ['up', '⬆️', 'down', '⬇️']]; const [w, e, o, oe] = pick(A);
    return mc(`${big(e)} is ${b(w)}. Which picture shows the opposite?`, oe, sample(A.filter(x => x[0] !== w).map(x => x[3]), 3), `The opposite of ${w} is ${b(o)} ${oe}.`); }),
  sk('XTell', 'Is it a telling sentence or an asking sentence?', 'Sentences', [0], () => { const T = ['The dog is brown.', 'I like apples.', 'We go to school.', 'It is cold.']; const A = ['Is the dog brown?', 'Do you like apples?', 'Can we go now?', 'Is it cold?'];
    const tell = Math.random() < 0.5, s = pick(tell ? T : A); return mc(`<em>${s}</em><br>Is it a telling sentence or an asking sentence?`, tell ? 'Telling sentence' : 'Asking sentence', ['Telling sentence', 'Asking sentence'], tell ? 'It tells something and ends with a period.' : 'It asks something and ends with a question mark.', 2); }),
  sk('XCapF', 'Capitalize the first letter of a sentence', 'Capitalization', [0], () => { const S = ['the cat is big.', 'we like to play.', 'my mom is nice.', 'it is a sunny day.']; const s = pick(S), good = s[0].toUpperCase() + s.slice(1);
    return mc('Which sentence is written correctly?', good, [s, s.toUpperCase(), s.slice(0, -1) + s.slice(-1).toUpperCase()], `A sentence starts with a capital letter: ${b(good)}`); }),
  sk('XCapI', 'Capitalize the pronoun "I"', 'Capitalization', [0], () => { const S = ['I like cake.', 'Mom and I went home.', 'Can I play?', 'I see a bird.']; const s = pick(S);
    return mc('Which sentence is written correctly?', s, [s.replace(/\bI\b/, 'i'), s.toLowerCase(), s.replace(/\bI\b/, 'eye')], 'The word "I" is always a capital letter.'); }),
  sk('XMyIl', 'Compare mythological illustrations', 'Visual elements', G(3, 5), pairs({ items: MYTH_ILL.map(([p, q, a, w, n]) => [`<div class="passage">${p}</div><p style="margin-top:10px">${q}</p>`, a, n, [a, ...w]]) })),
  sk('XLhIl', 'Compare illustrations of literary and historical subjects', 'Visual elements', G(6, 8), pairs({ items: LIT_HIST_ILL.map(([p, q, a, w, n]) => [`<div class="passage">${p}</div><p style="margin-top:10px">${q}</p>`, a, n, [a, ...w]]) }))
];
