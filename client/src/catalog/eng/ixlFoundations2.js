/* English — Reading foundations skills added to match IXL Grades 1–3 (phonics, spelling
   patterns, sight words). Emoji stand in for pictures; listening questions are spoken aloud. */
import { pairs } from '../quiz.js';
import {
  ri, pick, shuffle, sample, uniq, big, b, mc, misspell,
  SHORT, LONG, VOWEL_TEAM, R_CTRL, DIPH, DIGRAPH_START, DIGRAPH_END, BLEND_START, BLEND_END
} from './words.js';

const sk = (k, t, s, g, gen) => ({ k, t, s, g, gen });
const VOWELS = ['a', 'e', 'i', 'o', 'u'];
// a spoken English question: the word/sentence in `say` is read aloud and hidden
const listen = (q, say) => ({ ...q, say, lang: 'en-US', listen: true });
const pic = (list, w) => list.find(x => x[0] === w)?.[1] || '';

/* ---------- shared builders ---------- */
const completeAt = (list, options, prompt = 'Complete the word') => () => {
  const [w, e, part] = pick(list);
  const at = w.indexOf(part);
  const shown = w.slice(0, at) + '_'.repeat(part.length) + w.slice(at + part.length);
  return mc(`${e ? big(e) + '<br>' : ''}${prompt}: ${b(shown)}`, part, options, `${b(w)} is spelled with ${b(part)}.`);
};
const spell = list => () => {
  const [w, e] = pick(list);
  return mc(`${e ? big(e) + '<br>' : ''}Which is the correct spelling?`, w, misspell(w, 3), `It is spelled ${b(w)}.`);
};
const pictureFor = list => () => {
  const [w, e] = pick(list);
  return mc(`Which picture matches the word ${b(w)}?`, e, sample(list.filter(x => x[1] !== e).map(x => x[1]), 3), `${e} is a ${b(w)}.`);
};
const SENT_FRAMES = ['I can see a {w}.', 'Look at the big {w}.', 'Here is a {w}.', 'Mom has a {w}.', 'The {w} is red.', 'Kim drew a {w}.'];
const sentenceForPicture = list => () => {
  const [w, e] = pick(list);
  const frame = pick(SENT_FRAMES);
  const others = sample(list.filter(x => x[0] !== w).map(x => x[0]), 3);
  return mc(`${big(e)}<br>Which sentence matches the picture?`, frame.replace('{w}', w), others.map(o => frame.replace('{w}', o)), `The picture shows a ${b(w)}.`);
};

/* ---------- word banks ---------- */
const CVC = Object.values(SHORT).flat().filter(([w]) => /^[a-z]{3}$/.test(w) && !/x|ck/.test(w));
const ALL_SHORT = VOWELS.flatMap(v => SHORT[v].map(([w, e]) => [w, e, v]));
const RHYME_PICS = [
  ['cat', '🐱', 'at'], ['hat', '🎩', 'at'], ['bat', '🦇', 'at'], ['rat', '🐀', 'at'], ['dog', '🐶', 'og'], ['frog', '🐸', 'og'], ['log', '🪵', 'og'],
  ['bee', '🐝', 'ee'], ['tree', '🌳', 'ee'], ['three', '3️⃣', 'ee'], ['star', '⭐', 'ar'], ['car', '🚗', 'ar'], ['jar', '🫙', 'ar'],
  ['moon', '🌙', 'oon'], ['spoon', '🥄', 'oon'], ['balloon', '🎈', 'oon'], ['cake', '🎂', 'ake'], ['snake', '🐍', 'ake'],
  ['bear', '🐻', 'air'], ['pear', '🍐', 'air'], ['chair', '🪑', 'air'], ['house', '🏠', 'ouse'], ['mouse', '🐭', 'ouse'],
  ['goat', '🐐', 'oat'], ['boat', '⛵', 'oat'], ['coat', '🧥', 'oat'], ['fish', '🐟', 'ish'], ['dish', '🍽️', 'ish'],
  ['king', '🤴', 'ing'], ['ring', '💍', 'ing'], ['clock', '🕰️', 'ock'], ['sock', '🧦', 'ock'], ['lock', '🔒', 'ock'],
  ['bug', '🐛', 'ug'], ['mug', '☕', 'ug'], ['hen', '🐔', 'en'], ['ten', '🔟', 'en'], ['pen', '🖊️', 'en']
];
const DOUBLE_END = [['bell', '🔔', 'll'], ['ball', '⚽', 'll'], ['doll', '🪆', 'll'], ['shell', '🐚', 'll'], ['hill', '⛰️', 'll'], ['dress', '👗', 'ss'], ['grass', '🌱', 'ss'],
  ['glass', '🥛', 'ss'], ['kiss', '💋', 'ss'], ['buzz', '🐝', 'zz'], ['fizz', '🥤', 'zz'], ['cliff', '🧗', 'ff'], ['puff', '💨', 'ff'], ['duck', '🦆', 'ck'],
  ['sock', '🧦', 'ck'], ['clock', '🕰️', 'ck'], ['truck', '🚚', 'ck'], ['rock', '🪨', 'ck'], ['lock', '🔒', 'ck']];
const TWO_SYL = [['rab', 'bit', '🐰'], ['pen', 'cil', '✏️'], ['kit', 'ten', '🐱'], ['mag', 'net', '🧲'], ['bas', 'ket', '🧺'], ['muf', 'fin', '🧁'], ['sun', 'set', '🌅'],
  ['ham', 'mer', '🔨'], ['but', 'ton', '🔘'], ['lem', 'on', '🍋'], ['rob', 'in', '🐦'], ['tur', 'tle', '🐢'], ['pump', 'kin', '🎃'], ['pen', 'guin', '🐧'],
  ['tea', 'pot', '🫖'], ['rain', 'bow', '🌈'], ['ro', 'bot', '🤖'], ['ti', 'ger', '🐯'], ['spi', 'der', '🕷️'], ['tu', 'lip', '🌷'], ['wa', 'ter', '💧'],
  ['mon', 'key', '🐒'], ['pan', 'da', '🐼'], ['zeb', 'ra', '🦓'], ['pea', 'nut', '🥜'], ['cup', 'cake', '🧁'], ['pop', 'corn', '🍿']];
const TWO_SYL_SENT = [['The ___ hops across the grass.', 'rabbit'], ['I write with a sharp ___.', 'pencil'], ['A ___ can pick up paper clips.', 'magnet'],
  ['We carved a ___ for Halloween.', 'pumpkin'], ['A ___ swims in the cold sea.', 'penguin'], ['The ___ has black and white stripes.', 'zebra'],
  ['After the rain, we saw a ___.', 'rainbow'], ['The ___ spun a web.', 'spider'], ['Please sew the ___ on my coat.', 'button'], ['The ___ climbed the tree.', 'monkey']];
const SIGHT_SETS = [
  ['again', 'each', 'from', 'may', 'stop', 'than', 'when'], ['after', 'best', 'gave', 'has', 'once', 'them', 'were'],
  ['as', 'by', 'four', 'her', 'more', 'some', 'think', 'way'], ['every', 'could', 'how', 'over', 'put', 'there', 'who'],
  ['ask', 'five', 'just', 'long', 'read', 'then', 'want'], ['any', 'give', 'his', 'new', 'open', 'sleep', 'wish'],
  ['also', 'fly', 'know', 'live', 'old', 'soon', 'why']];
const SIGHT_SENT = {
  again: 'Can you read the story ___?', each: 'We got one apple ___.', from: 'I got a card ___ Grandma.', may: '___ I have a drink, please?', stop: 'The car must ___ at the red light.',
  than: 'A horse is bigger ___ a dog.', when: '___ will the bus come?', after: 'We play ___ lunch.', best: 'She is my ___ friend.', gave: 'Dad ___ me a hug.',
  has: 'The cat ___ a long tail.', once: 'I went to the zoo ___.', them: 'I helped ___ clean up.', were: 'We ___ at the park yesterday.', as: 'He is as tall ___ his dad.',
  by: 'The bike is ___ the door.', four: 'A dog has ___ legs.', her: 'This is ___ hat.', more: 'Can I have ___ juice?', some: 'I want ___ grapes.',
  think: 'I ___ it will rain.', way: 'Which ___ is the park?', every: 'I brush my teeth ___ day.', could: 'She ___ not find her shoe.', how: '___ old are you?',
  over: 'The bird flew ___ the house.', put: 'Please ___ the book away.', there: 'Look over ___!', who: '___ is at the door?', ask: 'You can ___ the teacher.',
  five: 'I have ___ fingers on one hand.', just: 'I ___ ate lunch.', long: 'The snake is very ___.', read: 'I like to ___ books.', then: 'First we eat, ___ we play.',
  want: 'I ___ a new ball.', any: 'Do you have ___ pets?', give: 'Please ___ me the cup.', his: 'Sam lost ___ hat.', new: 'I got ___ shoes.',
  open: 'Please ___ the window.', sleep: 'I ___ in my bed.', wish: 'I ___ I could fly.', also: 'I like cats, and I ___ like dogs.', fly: 'Birds can ___.',
  know: 'I ___ the answer!', live: 'Fish ___ in water.', old: 'My bike is very ___.', soon: 'We will be home ___.', why: '___ is the sky blue?'
};
const sightSentenceGen = words => () => {
  const w = pick(words.filter(x => SIGHT_SENT[x]));
  const s = SIGHT_SENT[w], cap = s.startsWith('___');
  const fix = x => (cap ? x[0].toUpperCase() + x.slice(1) : x);
  return mc(`Complete the sentence.<br><em>${s}</em>`, fix(w), sample(words.filter(x => x !== w), 3).map(fix), `${s.replace('___', b(fix(w)))}`);
};
const sightListenGen = words => () => {
  const w = pick(words);
  return listen(mc('🎧 <strong>Listen</strong>, then choose the word you hear.', w, sample(words.filter(x => x !== w), 3), `The word was ${b(w)}.`), w);
};
const THREE_BLEND = [['string', '🧵', 'str'], ['straw', '🥤', 'str'], ['strawberry', '🍓', 'str'], ['street', '🛣️', 'str'], ['scroll', '📜', 'scr'], ['screw', '🔩', 'scr'],
  ['scream', '😱', 'scr'], ['splash', '💦', 'spl'], ['squirrel', '🐿️', 'squ'], ['square', '⬛', 'squ'], ['squid', '🦑', 'squ'], ['three', '3️⃣', 'thr'],
  ['throw', '🤾', 'thr'], ['shrimp', '🦐', 'shr'], ['spring', '🌸', 'spr'], ['spray', '🧴', 'spr'], ['sprout', '🌱', 'spr']];
const THREE_SENT = [['The ___ ran up the tree.', 'squirrel'], ['I drink juice with a ___.', 'straw'], ['We heard a loud ___.', 'scream'], ['Flowers bloom in the ___.', 'spring'],
  ['She tied the box with ___.', 'string'], ['The kids ___ in the puddle.', 'splash'], ['Can you ___ the ball to me?', 'throw'], ['A ___ has eight arms.', 'squid']];
const OPEN_CLOSED = ['robot', 'tiger', 'music', 'paper', 'baby', 'hotel', 'napkin', 'rabbit', 'basket', 'picnic', 'begin', 'silent', 'frozen', 'tulip', 'muffin', 'sunset', 'pilot', 'lemon'];
const ILD = [['It is very ___ outside, so wear a coat.', 'cold', ['colt', 'cost', 'kind']], ['Please be ___ to the new student.', 'kind', ['kilt', 'cold', 'find']],
  ['The little ___ held her mom\'s hand.', 'child', ['chilled', 'mild', 'mind']], ['Can you help me ___ my glove?', 'find', ['fold', 'wild', 'most']],
  ['A baby horse is called a ___.', 'colt', ['cold', 'cost', 'child']], ['A lion is a ___ animal.', 'wild', ['mild', 'wind', 'bold']],
  ['The pirate found a chest of ___.', 'gold', ['gild', 'bolt', 'post']], ['I ate ___ of the pizza.', 'most', ['mold', 'mild', 'mind']],
  ['Dad will ___ the laundry.', 'fold', ['find', 'felt', 'host']], ['We mail letters at the ___ office.', 'post', ['pole', 'pint', 'fold']]];
const LONG_SPELL = {
  a: [['cake', '🎂'], ['game', '🎮'], ['rain', '🌧️'], ['train', '🚆'], ['snail', '🐌'], ['hay', '🌾'], ['tray', '🍽️'], ['plate', '🍽️'], ['paint', '🎨'], ['play', '🎭']],
  e: [['tree', '🌳'], ['bee', '🐝'], ['sheep', '🐑'], ['leaf', '🍃'], ['seal', '🦭'], ['peach', '🍑'], ['feet', '🦶'], ['beach', '🏖️'], ['teeth', '🦷']],
  i: [['kite', '🪁'], ['bike', '🚲'], ['pie', '🥧'], ['tie', '👔'], ['fly', '🪰'], ['sky', '🌌'], ['five', '5️⃣'], ['dime', '🪙'], ['cry', '😢']],
  o: [['rose', '🌹'], ['bone', '🦴'], ['boat', '⛵'], ['goat', '🐐'], ['coat', '🧥'], ['snow', '❄️'], ['bowl', '🥣'], ['note', '🎵'], ['toad', '🐸']],
  u: [['cube', '🧊'], ['mule', '🫏'], ['glue', '🧴'], ['blue', '🔵'], ['moon', '🌙'], ['spoon', '🥄'], ['screw', '🔩'], ['flute', '🪈'], ['boot', '👢']]
};
const LONG_SPELL3 = {
  a: [...LONG_SPELL.a, ['steak', '🥩'], ['eight', '8️⃣'], ['weigh', '⚖️'], ['they', '👫'], ['grey', '🩶'], ['sleigh', '🛷']],
  e: [...LONG_SPELL.e, ['chief', '🪶'], ['field', '🌾'], ['these', '👉'], ['thief', '🦹'], ['shield', '🛡️']],
  i: [...LONG_SPELL.i, ['light', '💡'], ['night', '🌙'], ['kind', '😊'], ['child', '🧒'], ['wild', '🐅'], ['find', '🔍']],
  o: [...LONG_SPELL.o, ['cold', '🥶'], ['gold', '🥇'], ['most', '🔝'], ['post', '📮'], ['bolt', '🔩'], ['colt', '🐴']],
  u: [...LONG_SPELL.u, ['fruit', '🍎'], ['suit', '👔'], ['new', '🆕'], ['juice', '🧃'], ['cruise', '🛳️']]
};
const VARIANT = [['saw', '🪚', 'aw'], ['paw', '🐾', 'aw'], ['straw', '🥤', 'aw'], ['hawk', '🦅', 'aw'], ['sauce', '🥫', 'au'], ['haul', '🚚', 'au'], ['book', '📚', 'oo'],
  ['foot', '🦶', 'oo'], ['wood', '🪵', 'oo'], ['hook', '🪝', 'oo'], ['ball', '⚽', 'al'], ['wall', '🧱', 'al'], ['salt', '🧂', 'al']];
const VARIANT_GROUPS = [['saw', 'paw', 'hawk', 'sauce', 'ball'], ['book', 'foot', 'wood', 'hook', 'look'], ['moon', 'spoon', 'boot', 'food', 'pool']];
const SOFT = [['giraffe', '🦒'], ['gem', '💎'], ['page', '📄'], ['orange', '🍊'], ['city', '🏙️'], ['circle', '⭕'], ['mice', '🐭'], ['ice', '🧊'], ['rice', '🍚'], ['pencil', '✏️'], ['face', '🙂'], ['giant', '🧌']];
const HARD = [['goat', '🐐'], ['game', '🎮'], ['cat', '🐱'], ['cup', '🥤'], ['cake', '🎂'], ['cow', '🐄'], ['gift', '🎁'], ['corn', '🌽'], ['gate', '🚪'], ['car', '🚗']];
const CLE = [['apple', '🍎', 'ple'], ['candle', '🕯️', 'dle'], ['turtle', '🐢', 'tle'], ['bottle', '🍼', 'tle'], ['puzzle', '🧩', 'zle'], ['eagle', '🦅', 'gle'],
  ['bubble', '🫧', 'ble'], ['castle', '🏰', 'tle'], ['needle', '🪡', 'dle'], ['pickle', '🥒', 'kle'], ['beetle', '🪲', 'tle'], ['circle', '⭕', 'cle'], ['table', '🍽️', 'ble'], ['jungle', '🌴', 'gle']];
const RIDDLES = [['It rhymes with cat. You wear it on your head.', 'hat'], ['It rhymes with log. It barks.', 'dog'], ['It rhymes with tree. It buzzes.', 'bee'],
  ['It rhymes with fish. You eat food from it.', 'dish'], ['It rhymes with clock. You wear it on your foot.', 'sock'], ['It rhymes with moon. You eat soup with it.', 'spoon'],
  ['It rhymes with star. You ride in it.', 'car'], ['It rhymes with boat. It keeps you warm.', 'coat'], ['It rhymes with cake. It slithers.', 'snake'],
  ['It rhymes with house. It squeaks.', 'mouse'], ['It rhymes with ring. He wears a crown.', 'king'], ['It rhymes with pen. It lays eggs.', 'hen']];
const POEM_RHYMES = [['I saw a bee<br>Up in a ___.', 'tree', ['bush', 'nest', 'sky']], ['The cat sat<br>On a soft ___.', 'mat', ['rug', 'bed', 'chair']],
  ['A little mouse<br>Ran in the ___.', 'house', ['barn', 'yard', 'room']], ['The sun is hot,<br>I like it a ___.', 'lot', ['bit', 'ton', 'day']],
  ['My dog can run<br>And have some ___.', 'fun', ['food', 'toys', 'naps']], ['I see the moon,<br>I\'ll sleep very ___.', 'soon', ['late', 'well', 'fast']],
  ['The frog can hop<br>And never ___.', 'stop', ['go', 'rest', 'sit']], ['A big red truck<br>Is stuck in the ___.', 'muck', ['mud', 'snow', 'sand']],
  ['I like to play<br>Outside all ___.', 'day', ['night', 'week', 'time']], ['The rain came down,<br>All over ___.', 'town', ['the city', 'here', 'us']]];
const SENTENCE_SHORT = [['The ___ is on the mat.', 'cat', '🐱'], ['I sleep in my ___.', 'bed', '🛏️'], ['The ___ says oink.', 'pig', '🐷'], ['The ___ jumps on a log.', 'frog', '🐸'],
  ['We ride the ___ to school.', 'bus', '🚌'], ['The ___ is in the sky.', 'sun', '☀️'], ['Mom put a ___ on her head.', 'hat', '🎩'], ['The ___ laid an egg.', 'hen', '🐔'],
  ['A ___ swims in the pond.', 'fish', '🐟'], ['Put the toys in the ___.', 'box', '📦'], ['The ___ is in the mud.', 'duck', '🦆'], ['I drink from a ___.', 'cup', '🥤']];
const VT_STORIES = [
  { s: 'Jay and his dog went out to play. It began to rain, so they ran home. Jay put on a coat. Then they read a book by the heat of the fire.',
    q: [['Why did Jay and his dog run home?', 'It began to rain', ['It was night', 'They were hungry', 'The dog was tired']], ['What did Jay put on?', 'A coat', ['A hat', 'Boots', 'A scarf']]] },
  { s: 'A little goat lives by the sea. Each day the goat eats green leaves and plays on the beach. At night, the goat sleeps under a tree.',
    q: [['Where does the goat live?', 'By the sea', ['In a barn', 'In the city', 'On a boat']], ['Where does the goat sleep?', 'Under a tree', ['In a cave', 'On the beach', 'In a boat']]] },
  { s: 'Kate has a green kite. She flies it high in the sky on a windy day. When the wind stops, the kite floats down to her feet.',
    q: [['What colour is the kite?', 'Green', ['Red', 'Blue', 'Yellow']], ['What happens when the wind stops?', 'The kite floats down', ['The kite flies away', 'Kate goes home', 'It starts to rain']]] }
];
const storyGen = stories => () => {
  const st = pick(stories), [q, a, w] = pick(st.q);
  return mc(`<div class="passage">${st.s}</div><p style="margin-top:10px">${q}</p>`, a, w, `The story says so.`);
};
const same = (words, pos) => () => {
  const by = {};
  words.forEach(w => { const k = pos === 'start' ? w[0] : w.slice(-1); (by[k] = by[k] || []).push(w); });
  const keys = Object.keys(by).filter(k => by[k].length >= 2);
  const k = pick(keys), [a1, a2] = sample(by[k], 2);
  const wrong = [];
  while (wrong.length < 3) {
    const [x, y] = sample(words, 2);
    const kx = pos === 'start' ? x[0] : x.slice(-1), ky = pos === 'start' ? y[0] : y.slice(-1);
    if (kx !== ky && !wrong.includes(`${x} and ${y}`)) wrong.push(`${x} and ${y}`);
  }
  return mc(`Which two words ${pos === 'start' ? 'start' : 'end'} with the same sound?`, `${a1} and ${a2}`, wrong, `${b(a1)} and ${b(a2)} both ${pos === 'start' ? 'start' : 'end'} with the ${b(k)} sound.`);
};
const CVC_WORDS = CVC.map(x => x[0]).concat(['sit', 'sat', 'mud', 'mop', 'map', 'run', 'rug', 'bag', 'big', 'bus', 'top', 'tan', 'hop', 'had', 'dig', 'den', 'lip', 'log', 'nap', 'nut']);

export const FOUNDATION2_SPECS = [
  sk('XRhPc', 'Choose the picture that rhymes with the word', 'Rhyming', [1, 2], () => {
    const fams = uniq(RHYME_PICS.map(x => x[2])), f = pick(fams);
    const [a, c] = sample(RHYME_PICS.filter(x => x[2] === f), 2);
    return mc(`Which picture rhymes with ${b(a[0])}?`, c[1], sample(RHYME_PICS.filter(x => x[2] !== f).map(x => x[1]), 3), `${b(a[0])} and ${b(c[0])} ${c[1]} rhyme.`);
  }),
  sk('XRhPo', 'Complete the poem with a word that rhymes', 'Rhyming', [1, 2], pairs({ items: POEM_RHYMES.map(([q, a, w]) => [`Complete the poem.<br><em>${q}</em>`, a, `${b(a)} rhymes with the end of the first line.`, [a, ...w]]) })),
  sk('XBlnd', 'Blend each sound in a word together', 'Blending and segmenting', [1], () => {
    const w = pick(CVC_WORDS);
    return mc(`Blend the sounds: ${b([...w].map(c => `/${c}/`).join(' '))}<br>Which word do they make?`, w, sample(CVC_WORDS.filter(x => x !== w && x[1] === w[1]).concat(CVC_WORDS.filter(x => x !== w)), 3), `${[...w].map(c => `/${c}/`).join(' ')} blends to ${b(w)}.`);
  }),
  sk('XSeg', 'Identify each sound in a word', 'Blending and segmenting', [1], () => {
    const w = pick(CVC_WORDS), pos = ri(0, 2), names = ['first', 'middle', 'last'];
    return mc(`What is the ${names[pos]} sound in ${b(w)}?`, `/${w[pos]}/`, uniq([...w].map(c => `/${c}/`).concat(['/s/', '/m/', '/o/', '/e/'])), `In ${b(w)}, the ${names[pos]} sound is ${b('/' + w[pos] + '/')}.`);
  }),
  sk('XSnOr', 'Put the sounds in order', 'Blending and segmenting', [1], () => {
    const w = pick(CVC_WORDS), s = [...w];
    const fmt = a => a.map(c => `/${c}/`).join(' ');
    const wrong = uniq([fmt([s[2], s[1], s[0]]), fmt([s[1], s[0], s[2]]), fmt([s[0], s[2], s[1]]), fmt([s[2], s[0], s[1]])]).filter(x => x !== fmt(s));
    return mc(`Which shows the sounds in ${b(w)} in order?`, fmt(s), wrong, `${b(w)} = ${fmt(s)}.`);
  }),
  sk('XSmSt', 'Which two words start with the same sound?', 'Consonant sounds and letters', [1], same(CVC_WORDS, 'start')),
  sk('XSmEn', 'Which two words end with the same sound?', 'Consonant sounds and letters', [1], same(CVC_WORDS, 'end')),
  sk('XBlYs', 'Does the word start with a consonant blend?', 'Consonant blends and digraphs', [1], () => {
    const yes = Math.random() < 0.5, [w, e] = yes ? pick(BLEND_START) : pick(CVC);
    return mc(`${big(e)}<br>Does ${b(w)} start with a consonant blend?`, yes ? 'Yes' : 'No', ['Yes', 'No'], yes ? `${b(w)} starts with the blend ${b(w.slice(0, 2))}.` : `${b(w)} starts with a single consonant sound.`, 2);
  }),
  sk('XBlYe', 'Does the word end with a consonant blend?', 'Consonant blends and digraphs', [1], () => {
    const yes = Math.random() < 0.5, [w, e] = yes ? pick(BLEND_END) : pick(CVC);
    return mc(`${big(e)}<br>Does ${b(w)} end with a consonant blend?`, yes ? 'Yes' : 'No', ['Yes', 'No'], yes ? `${b(w)} ends with the blend ${b(w.slice(-2))}.` : `${b(w)} ends with a single consonant sound.`, 2);
  }),
  sk('XBlFl', 'Fill in the missing consonant blend', 'Consonant blends and digraphs', [1], completeAt([...BLEND_START, ...BLEND_END], uniq([...BLEND_START, ...BLEND_END].map(x => x[2])), 'Fill in the missing blend')),
  sk('XDblE', 'Complete the word to match the picture: -ss, -ll, -ff, -zz, -ck', 'Consonant blends and digraphs', [1], completeAt(DOUBLE_END, ['ss', 'll', 'ff', 'zz', 'ck'])),
  sk('XShCp', 'Complete the word with the right short vowel', 'Short vowels', [1, 2], () => {
    const [w, e, v] = pick(ALL_SHORT.filter(x => x[0].includes(x[2])));
    const at = w.indexOf(v);
    return mc(`${big(e)}<br>Complete the word: ${b(w.slice(0, at) + '_' + w.slice(at + 1))}`, v, VOWELS, `${b(w)} has a short ${b(v)}.`);
  }),
  sk('XShSn', 'Complete the sentence with the correct short vowel word', 'Short vowels', [1], pairs({ items: SENTENCE_SHORT.map(([s, a, e]) => [`${big(e)}<br>${s}`, a, `${s.replace('___', b(a))}`, [a, ...sample(SENTENCE_SHORT.map(x => x[1]).filter(x => x !== a), 3)]]) })),
  sk('XSmVw', 'Which two words have the same vowel sound?', 'Short and long vowels', [1], () => {
    const v = pick(VOWELS), [a, c] = sample(SHORT[v], 2).map(x => x[0]);
    const wrong = [];
    while (wrong.length < 3) { const [v1, v2] = sample(VOWELS, 2); const p = `${pick(SHORT[v1])[0]} and ${pick(SHORT[v2])[0]}`; if (!wrong.includes(p)) wrong.push(p); }
    return mc('Which two words have the same vowel sound?', `${a} and ${c}`, wrong, `${b(a)} and ${b(c)} both have the short ${b(v)} sound.`);
  }),
  sk('XSeSn', 'Choose the silent e sentence that matches the picture', 'Silent e', [1], sentenceForPicture([['cake', '🎂'], ['kite', '🪁'], ['bike', '🚲'], ['rose', '🌹'], ['bone', '🦴'], ['nose', '👃'], ['plane', '✈️'], ['whale', '🐋'], ['globe', '🌐'], ['cube', '🧊']])),
  sk('XVtPc', 'Choose the picture that matches the vowel team word', 'Vowel teams', [1, 2], pictureFor(VOWEL_TEAM)),
  sk('XVtSn', 'Choose the vowel team sentence that matches the picture', 'Vowel teams', [1, 2], sentenceForPicture(VOWEL_TEAM)),
  sk('XVtCw', 'Complete the word with the correct vowel team', 'Vowel teams', [1, 2], () => {
    const [w, e, part] = pick(VOWEL_TEAM);
    const at = w.indexOf(part);
    return mc(`${big(e)}<br>Which vowel team completes the word? ${b(w.slice(0, at) + '__' + w.slice(at + part.length))}`, part, uniq(VOWEL_TEAM.map(x => x[2])), `${b(w)} uses ${b(part)}.`);
  }),
  sk('XVtSt', 'Read vowel team stories', 'Vowel teams', [1], storyGen(VT_STORIES)),
  sk('XLvSt', 'Read long vowel stories', 'Vowel teams', [2], storyGen(VT_STORIES)),
  ...VOWELS.map(v => sk('XSL' + v, `Match the short ${v} and long ${v} words to pictures`, 'Short and long vowel patterns', v === 'i' || v === 'o' || v === 'u' ? [1, 2] : [1, 2], () => {
    const list = [...SHORT[v], ...LONG[v]], [w, e] = pick(list);
    return mc(`${big(e)}<br>Which word matches the picture?`, w, sample(list.filter(x => x[0] !== w).map(x => x[0]), 3), `The picture shows ${b(w)}, which has a ${SHORT[v].some(x => x[0] === w) ? 'short' : 'long'} ${b(v)}.`);
  })),
  sk('XSpPt', 'Use spelling patterns to sort long and short vowel words', 'Short and long vowel patterns', [1, 2, 3], () => {
    const long = Math.random() < 0.5, v = pick(VOWELS), [w] = pick((long ? LONG : SHORT)[v]);
    return mc(`Does the word ${b(w)} have a short or long vowel sound?`, long ? 'Long vowel' : 'Short vowel', ['Short vowel', 'Long vowel'], long ? `${b(w)} has a long-vowel spelling pattern (vowel team or silent e).` : `${b(w)} has one vowel closed in by consonants, so it is short.`, 2);
  }),
  sk('XTs2', 'Put two syllables together to create a word: harder', 'Two-syllable words', [1, 2], () => {
    const [a, c, e] = pick(TWO_SYL);
    return mc(`${big(e)}<br>${b(a)} + ? = the picture word. Which syllable completes it?`, c, sample(uniq(TWO_SYL.map(x => x[1])).filter(x => x !== c), 3), `${a} + ${c} = ${b(a + c)}.`);
  }),
  sk('XTsCp', 'Complete the two-syllable words', 'Two-syllable words', [1, 2], () => {
    const [a, c, e] = pick(TWO_SYL);
    return mc(`${big(e)}<br>Complete the word: ${b(a + '___')}`, c, sample(uniq(TWO_SYL.map(x => x[1])).filter(x => x !== c), 3), `It is ${b(a + c)}.`);
  }),
  sk('XTsSn', 'Complete the sentence with a two-syllable word', 'Two-syllable words', [1, 2], pairs({ items: TWO_SYL_SENT.map(([s, a]) => [`Complete the sentence.<br><em>${s}</em>`, a, s.replace('___', b(a)), [a, ...sample(TWO_SYL_SENT.map(x => x[1]).filter(x => x !== a), 3)]]) })),
  ...SIGHT_SETS.map((set, i) => sk(`XSw${i + 1}`, `Read sight words set ${i + 1}`, 'Sight words', [1], sightListenGen(set))),
  sk('XSwR1', 'Read sight words: review sets 1, 2, 3', 'Sight words', [1], sightListenGen(SIGHT_SETS.slice(0, 3).flat())),
  sk('XSwR2', 'Read sight words: review sets 4, 5, 6, 7', 'Sight words', [1], sightListenGen(SIGHT_SETS.slice(3).flat())),
  sk('XSwR3', 'Read sight words: review sets 1–7', 'Sight words', [1], sightListenGen(SIGHT_SETS.flat())),
  sk('XSwS1', 'Complete the sentence with the correct sight word: sets 1, 2, 3', 'Sight words', [1], sightSentenceGen(SIGHT_SETS.slice(0, 3).flat())),
  sk('XSwS2', 'Complete the sentence with the correct sight word: sets 4, 5, 6, 7', 'Sight words', [1], sightSentenceGen(SIGHT_SETS.slice(3).flat())),
  sk('XSwS3', 'Complete the sentence with the correct sight word: review sets 1–7', 'Sight words', [1], sightSentenceGen(SIGHT_SETS.flat())),
  sk('XSwHr', 'Choose the sight word that you hear', 'Sight words', [2], sightListenGen(SIGHT_SETS.flat().concat(['because', 'before', 'which', 'would', 'their', 'many', 'where', 'always', 'around', 'does']))),
  sk('XRhRd', 'Spell rhyming words to answer riddles', 'Rhyming', [2, 3], () => {
    const [q, a] = pick(RIDDLES);
    return mc(`${q}<br>What is it?`, a, misspell(a, 3), `The answer is ${b(a)}.`);
  }),
  sk('XBlSp', 'Spell the word with a consonant blend', 'Consonant blends and digraphs', [2], spell(BLEND_START)),
  sk('XDg1', 'Complete the word with the correct digraph: ch, sh, th', 'Consonant blends and digraphs', [2], completeAt([...DIGRAPH_START, ...DIGRAPH_END].filter(x => ['ch', 'sh', 'th'].includes(x[2])), ['ch', 'sh', 'th'])),
  sk('XDg2', 'Complete the word with the correct digraph: ph, qu, wh', 'Consonant blends and digraphs', [2], completeAt([...DIGRAPH_START, ['wheat', '🌾', 'wh'], ['quilt', '🛏️', 'qu'], ['dolphin', '🐬', 'ph'], ['whisk', '🥄', 'wh']].filter(x => ['ph', 'qu', 'wh'].includes(x[2])), ['ph', 'qu', 'wh'])),
  sk('XDgS1', 'Spell the digraph word: ch, sh, th', 'Consonant blends and digraphs', [2], spell([...DIGRAPH_START, ...DIGRAPH_END].filter(x => ['ch', 'sh', 'th'].includes(x[2])))),
  sk('XDgS2', 'Spell the digraph word: ph, qu, wh', 'Consonant blends and digraphs', [2], spell([...DIGRAPH_START, ['wheat', '🌾', 'wh'], ['quilt', '🛏️', 'qu'], ['dolphin', '🐬', 'ph']].filter(x => ['ph', 'qu', 'wh'].includes(x[2])))),
  sk('XB3', 'Complete the word with a three-letter consonant blend', 'Consonant blends and digraphs', [2, 3], completeAt(THREE_BLEND, ['str', 'scr', 'spl', 'squ', 'thr', 'shr', 'spr'])),
  sk('XB3S', 'Complete the sentence with a three-letter consonant blend word', 'Consonant blends and digraphs', [2], pairs({ items: THREE_SENT.map(([s, a]) => [`Complete the sentence.<br><em>${s}</em>`, a, s.replace('___', b(a)), [a, ...sample(THREE_SENT.map(x => x[1]).filter(x => x !== a), 3)]]) })),
  ...VOWELS.map(v => sk(`XSp${v.toUpperCase()}`, `Spell the short ${v} word`, 'Short vowels', [2], spell(SHORT[v]))),
  sk('XOcSp', 'Spell words with open and closed syllables', 'Short and long vowel patterns', [2, 3], () => { const w = pick(OPEN_CLOSED); return mc('Which word is spelled correctly?', w, misspell(w, 3), `It is spelled ${b(w)}.`); }),
  sk('XIld', 'Complete the sentence with the correct -ild, -ind, -old, -olt or -ost word', 'Short and long vowel patterns', [2], pairs({ items: ILD.map(([s, a, w]) => [`Complete the sentence.<br><em>${s}</em>`, a, s.replace('___', b(a)), [a, ...w]]) })),
  sk('XLvCh', 'Choose the words with a given long vowel', 'Long vowel patterns', [2], () => {
    const v = pick(VOWELS), [w] = pick(LONG[v]);
    return mc(`Which word has a long ${b(v)} sound?`, w, sample(VOWELS.filter(x => x !== v).flatMap(x => SHORT[x].map(y => y[0])).concat(SHORT[v].map(y => y[0])), 3), `${b(w)} has a long ${b(v)}.`);
  }),
  ...[['a', 'silent e, ai, ay'], ['e', 'ee, ea'], ['i', 'silent e, ie, y'], ['o', 'silent e, oa, ow'], ['u', 'silent e, ue, oo, ew']].map(([v, pat]) =>
    sk(`XL${v}2`, `Spell the long ${v} word: ${pat}`, 'Long vowel patterns', [2], spell(LONG_SPELL[v]))),
  ...[['a', 'silent e, ai, ay, ea, ey, eigh'], ['e', 'silent e, ee, ea, ie'], ['i', 'silent e, ie, y, igh, ind, ild'], ['o', 'silent e, oa, ow, old, ost, olt'], ['u', 'silent e, ue, oo, ew, ui']].map(([v, pat]) =>
    sk(`XL${v}3`, `Spell the long ${v} word: ${pat}`, 'Short and long vowels', [3], spell(LONG_SPELL3[v]))),
  sk('XRc3', 'Complete the word with the correct r-controlled vowel: er, ir, ur', 'R-controlled vowels', [2], completeAt(R_CTRL.filter(x => ['er', 'ir', 'ur'].includes(x[2])), ['er', 'ir', 'ur'])),
  sk('XRcSn', 'Choose the r-control sentence that matches the picture', 'R-controlled vowels', [2], sentenceForPicture(R_CTRL)),
  sk('XDpSn', 'Choose the diphthong sentence that matches the picture', 'Diphthongs: oi, oy, ou, ow', [2], sentenceForPicture(DIPH)),
  sk('XVv', 'Complete words with variant vowels', 'Variant vowels', [2], completeAt(VARIANT, ['aw', 'au', 'oo', 'al'])),
  sk('XVvD', 'Which word has a different vowel sound?', 'Variant vowels', [2], () => {
    const [g1, g2] = sample(VARIANT_GROUPS, 2), three = sample(g1, 3), odd = pick(g2);
    return mc(`Which word has a different vowel sound? ${shuffle([...three, odd]).map(b).join(', ')}`, odd, three, `${b(odd)} has a different vowel sound from ${three.join(', ')}.`);
  }),
  sk('XSgPc', 'Pick the soft g or soft c word that matches the picture', 'Soft g and c', [2], () => {
    const [w, e] = pick(SOFT);
    return mc(`${big(e)}<br>Which word matches the picture?`, w, sample([...SOFT, ...HARD].filter(x => x[0] !== w).map(x => x[0]), 3), `${b(w)} has a soft ${b(/g[eiy]/.test(w) ? 'g' : 'c')}.`);
  }),
  sk('XSgSn', 'Choose the soft g or soft c sentence that matches the picture', 'Soft g and c', [2], sentenceForPicture(SOFT)),
  sk('XSgSp', 'Spell the soft g or soft c word', 'Soft g and c', [2], spell(SOFT)),
  sk('XClC', 'Complete the consonant-l-e words', 'Consonant-l-e', [2], completeAt(CLE, uniq(CLE.map(x => x[2])))),
  sk('XClSp', 'Spell the consonant-l-e word', 'Consonant-l-e', [2, 3], spell(CLE)),
  sk('XDpSp', 'Spell words with vowel diphthong patterns', 'Diphthongs and r vowel patterns', [3], spell(DIPH)),
  sk('XRcSp', 'Spell words with r vowel patterns', 'Diphthongs and r vowel patterns', [3], spell(R_CTRL)),
  sk('XRelW', 'Find the words with related meanings', 'Shades of meaning', [1, 2], () => {
    const G2 = [['happy', 'glad', 'joyful'], ['big', 'large', 'huge'], ['small', 'tiny', 'little'], ['run', 'jog', 'dash'], ['look', 'see', 'stare'], ['cold', 'chilly', 'icy'], ['hot', 'warm', 'boiling'], ['talk', 'say', 'tell'], ['eat', 'munch', 'chew'], ['jump', 'hop', 'leap']];
    const grp = pick(G2), [w, a] = sample(grp, 2);
    return mc(`Which word has a meaning related to ${b(w)}?`, a, sample(G2.filter(g => g !== grp).flat(), 3), `${b(w)} and ${b(a)} have related meanings.`);
  }),
  sk('XEndH', 'Complete the verb with the ending that you hear', 'Verb tense', [1], () => {
    const base = pick(['jump', 'play', 'kick', 'walk', 'help', 'look', 'pick', 'pull', 'rest', 'call']), end = pick(['s', 'ed', 'ing']);
    const word = base + end;
    return listen(mc(`🎧 <strong>Listen</strong> to the word. Complete it: ${b(base + '___')}`, '-' + end, ['-s', '-ed', '-ing'], `You heard ${b(word)}.`, 3), word);
  }),
  sk('XEndH2', 'Complete the word with the ending that you hear', 'Prefixes and suffixes', [2], () => {
    const W = [['help', 'ful'], ['help', 'er'], ['help', 'ing'], ['play', 'ful'], ['play', 'er'], ['paint', 'er'], ['paint', 'ing'], ['teach', 'er'], ['read', 'er'], ['read', 'ing'],
      ['quick', 'ly'], ['quick', 'est'], ['soft', 'ly'], ['soft', 'er'], ['kind', 'ly'], ['kind', 'est'], ['hope', 'ful'], ['care', 'ful'], ['care', 'less'], ['hope', 'less']];
    const [base, end] = pick(W), word = base + end;
    return listen(mc(`🎧 <strong>Listen</strong> to the word. Which ending do you hear on ${b(base)}?`, '-' + end, ['-ful', '-er', '-ing', '-ly', '-est', '-less'], `You heard ${b(word)}.`), word);
  })
];
