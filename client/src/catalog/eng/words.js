/* Shared word data and small helpers for the generated English skills (grades 1–5). */
import { ri, pick, shuffle } from '../quiz.js';
export { ri, pick, shuffle };

export const sample = (arr, n, exclude = []) => shuffle(arr.filter(x => !exclude.includes(x))).slice(0, n);
export const uniq = arr => [...new Set(arr)];
export const big = e => `<span style="font-size:2.6rem;line-height:1.2">${e}</span>`;
export const b = s => `<strong>${s}</strong>`;
export const em = s => `<em>${s}</em>`;
// multiple-choice question
export const mc = (prompt, answer, wrong, explain, n = 4) => {
  const others = shuffle(uniq(wrong).filter(w => w !== answer)).slice(0, n - 1);
  return { type: 'mc', prompt, answer, choices: shuffle([answer, ...others]), explain };
};

/* ---------- picture words (emoji stand in for IXL's pictures) ---------- */
export const SHORT = {
  a: [['cat', '🐱'], ['hat', '🎩'], ['bat', '🦇'], ['map', '🗺️'], ['van', '🚐'], ['bag', '👜'], ['pan', '🍳'], ['ram', '🐏'], ['cap', '🧢'], ['ant', '🐜'], ['crab', '🦀'], ['flag', '🚩']],
  e: [['bed', '🛏️'], ['hen', '🐔'], ['pen', '🖊️'], ['net', '🥅'], ['web', '🕸️'], ['egg', '🥚'], ['ten', '🔟'], ['jet', '✈️'], ['leg', '🦵'], ['bell', '🔔'], ['sled', '🛷'], ['tent', '⛺']],
  i: [['pig', '🐷'], ['fish', '🐟'], ['six', '6️⃣'], ['lips', '👄'], ['pin', '📌'], ['milk', '🥛'], ['gift', '🎁'], ['ship', '🚢'], ['chick', '🐥'], ['bricks', '🧱'], ['mitt', '🧤']],
  o: [['dog', '🐶'], ['fox', '🦊'], ['box', '📦'], ['sock', '🧦'], ['pot', '🍲'], ['log', '🪵'], ['frog', '🐸'], ['lock', '🔒'], ['rock', '🪨'], ['clock', '🕰️'], ['mop', '🧹']],
  u: [['bus', '🚌'], ['sun', '☀️'], ['cup', '🥤'], ['bug', '🐛'], ['duck', '🦆'], ['drum', '🥁'], ['nut', '🥜'], ['truck', '🚚'], ['plug', '🔌'], ['mug', '☕'], ['skunk', '🦨'], ['tub', '🛁']]
};
export const LONG = {
  a: [['cake', '🎂'], ['game', '🎮'], ['rain', '🌧️'], ['train', '🚆'], ['snail', '🐌'], ['skate', '⛸️'], ['plane', '✈️'], ['whale', '🐋'], ['grapes', '🍇'], ['hay', '🌾'], ['paint', '🎨']],
  e: [['tree', '🌳'], ['bee', '🐝'], ['sheep', '🐑'], ['leaf', '🍃'], ['seal', '🦭'], ['feet', '🦶'], ['cheese', '🧀'], ['queen', '👸'], ['wheel', '🛞'], ['teeth', '🦷'], ['peach', '🍑'], ['three', '3️⃣']],
  i: [['kite', '🪁'], ['bike', '🚲'], ['five', '5️⃣'], ['nine', '9️⃣'], ['pie', '🥧'], ['tie', '👔'], ['light', '💡'], ['dice', '🎲'], ['mice', '🐁'], ['fly', '🪰'], ['smile', '😊']],
  o: [['rose', '🌹'], ['bone', '🦴'], ['nose', '👃'], ['boat', '⛵'], ['goat', '🐐'], ['coat', '🧥'], ['road', '🛣️'], ['soap', '🧼'], ['bowl', '🥣'], ['globe', '🌐'], ['phone', '📱'], ['snow', '❄️']],
  u: [['moon', '🌙'], ['spoon', '🥄'], ['boot', '👢'], ['tooth', '🦷'], ['cube', '🧊'], ['juice', '🧃'], ['fruit', '🍎'], ['screw', '🔩'], ['tube', '🧪']]
};
export const SILENT_E = [['cake', '🎂'], ['kite', '🪁'], ['bike', '🚲'], ['rose', '🌹'], ['bone', '🦴'], ['nose', '👃'], ['five', '5️⃣'], ['nine', '9️⃣'], ['game', '🎮'], ['skate', '⛸️'], ['plane', '✈️'], ['whale', '🐋'], ['dice', '🎲'], ['cube', '🧊'], ['globe', '🌐'], ['smile', '😊'], ['phone', '📱'], ['tube', '🧪']];
export const VOWEL_TEAM = [['rain', '🌧️', 'ai'], ['train', '🚆', 'ai'], ['snail', '🐌', 'ai'], ['paint', '🎨', 'ai'], ['hay', '🌾', 'ay'], ['tree', '🌳', 'ee'], ['bee', '🐝', 'ee'], ['sheep', '🐑', 'ee'], ['feet', '🦶', 'ee'], ['leaf', '🍃', 'ea'], ['seal', '🦭', 'ea'], ['peach', '🍑', 'ea'], ['boat', '⛵', 'oa'], ['goat', '🐐', 'oa'], ['coat', '🧥', 'oa'], ['soap', '🧼', 'oa'], ['road', '🛣️', 'oa'], ['bowl', '🥣', 'ow'], ['snow', '❄️', 'ow'], ['pie', '🥧', 'ie'], ['tie', '👔', 'ie'], ['moon', '🌙', 'oo'], ['spoon', '🥄', 'oo'], ['boot', '👢', 'oo'], ['screw', '🔩', 'ew'], ['light', '💡', 'igh']];
export const R_CTRL = [['car', '🚗', 'ar'], ['star', '⭐', 'ar'], ['shark', '🦈', 'ar'], ['jar', '🫙', 'ar'], ['bird', '🐦', 'ir'], ['girl', '👧', 'ir'], ['shirt', '👕', 'ir'], ['fork', '🍴', 'or'], ['corn', '🌽', 'or'], ['horse', '🐴', 'or'], ['horn', '📯', 'or'], ['storm', '⛈️', 'or'], ['purse', '👛', 'ur'], ['turtle', '🐢', 'ur'], ['church', '⛪', 'ur'], ['burger', '🍔', 'ur'], ['fern', '🌿', 'er'], ['letter', '✉️', 'er']];
export const DIPH = [['coin', '🪙', 'oi'], ['oil', '🛢️', 'oi'], ['boy', '👦', 'oy'], ['toy', '🧸', 'oy'], ['cow', '🐄', 'ow'], ['owl', '🦉', 'ow'], ['crown', '👑', 'ow'], ['flower', '🌸', 'ow'], ['house', '🏠', 'ou'], ['mouse', '🐭', 'ou'], ['cloud', '☁️', 'ou'], ['mouth', '👄', 'ou']];
export const DIGRAPH_START = [['ship', '🚢', 'sh'], ['shell', '🐚', 'sh'], ['shoe', '👟', 'sh'], ['sheep', '🐑', 'sh'], ['shark', '🦈', 'sh'], ['shirt', '👕', 'sh'], ['chick', '🐥', 'ch'], ['cheese', '🧀', 'ch'], ['chair', '🪑', 'ch'], ['cherry', '🍒', 'ch'], ['church', '⛪', 'ch'], ['thumb', '👍', 'th'], ['three', '3️⃣', 'th'], ['whale', '🐋', 'wh'], ['wheel', '🛞', 'wh'], ['phone', '📱', 'ph'], ['photo', '📷', 'ph'], ['queen', '👸', 'qu']];
export const DIGRAPH_END = [['fish', '🐟', 'sh'], ['brush', '🖌️', 'sh'], ['dish', '🍽️', 'sh'], ['peach', '🍑', 'ch'], ['watch', '⌚', 'ch'], ['bath', '🛁', 'th'], ['teeth', '🦷', 'th'], ['mouth', '👄', 'th'], ['duck', '🦆', 'ck'], ['sock', '🧦', 'ck'], ['clock', '🕰️', 'ck'], ['ring', '💍', 'ng'], ['king', '🤴', 'ng']];
export const BLEND_START = [['frog', '🐸', 'fr'], ['flag', '🚩', 'fl'], ['flower', '🌸', 'fl'], ['drum', '🥁', 'dr'], ['dress', '👗', 'dr'], ['dragon', '🐉', 'dr'], ['crab', '🦀', 'cr'], ['crown', '👑', 'cr'], ['crayon', '🖍️', 'cr'], ['clock', '🕰️', 'cl'], ['cloud', '☁️', 'cl'], ['clown', '🤡', 'cl'], ['sled', '🛷', 'sl'], ['star', '⭐', 'st'], ['snake', '🐍', 'sn'], ['snail', '🐌', 'sn'], ['plant', '🪴', 'pl'], ['plane', '✈️', 'pl'], ['bread', '🍞', 'br'], ['brush', '🖌️', 'br'], ['grapes', '🍇', 'gr'], ['tree', '🌳', 'tr'], ['truck', '🚚', 'tr'], ['train', '🚆', 'tr'], ['glove', '🧤', 'gl'], ['globe', '🌐', 'gl'], ['swan', '🦢', 'sw'], ['skunk', '🦨', 'sk'], ['spoon', '🥄', 'sp'], ['spider', '🕷️', 'sp']];
export const BLEND_END = [['hand', '✋', 'nd'], ['tent', '⛺', 'nt'], ['plant', '🪴', 'nt'], ['vest', '🦺', 'st'], ['ghost', '👻', 'st'], ['gift', '🎁', 'ft'], ['mask', '🎭', 'sk'], ['milk', '🥛', 'lk'], ['skunk', '🦨', 'nk'], ['sink', '🚰', 'nk']];

/* ---------- syllables ---------- */
export const SYLLABLES = {
  1: ['cat', 'dog', 'tree', 'house', 'bird', 'sun', 'fish', 'book', 'chair', 'plant', 'train', 'cloud', 'shoe', 'bread', 'night'],
  2: ['rabbit', 'pencil', 'apple', 'tiger', 'monkey', 'garden', 'window', 'basket', 'candle', 'doctor', 'table', 'music', 'happy', 'jacket', 'pizza', 'paper', 'water', 'turtle'],
  3: ['banana', 'elephant', 'dinosaur', 'butterfly', 'computer', 'tomato', 'potato', 'octopus', 'kangaroo', 'umbrella', 'family', 'animal', 'bicycle', 'library'],
  4: ['watermelon', 'caterpillar', 'alligator', 'helicopter', 'calculator', 'television', 'avocado', 'macaroni', 'information', 'everybody']
};

/* ---------- rhymes ---------- */
export const RHYMES = {
  at: ['cat', 'hat', 'bat', 'mat', 'rat', 'flat'], an: ['can', 'fan', 'man', 'pan', 'van', 'ran'],
  ig: ['big', 'dig', 'pig', 'wig', 'fig'], op: ['hop', 'mop', 'top', 'pop', 'stop', 'shop'],
  ug: ['bug', 'hug', 'mug', 'rug', 'jug'], ake: ['cake', 'lake', 'make', 'rake', 'bake', 'snake'],
  ight: ['light', 'night', 'right', 'bright', 'sight', 'fight'], ell: ['bell', 'well', 'shell', 'smell', 'tell', 'yell'],
  ing: ['king', 'ring', 'sing', 'wing', 'thing', 'swing'], ock: ['clock', 'lock', 'rock', 'sock', 'block'],
  ee: ['bee', 'tree', 'see', 'free', 'three', 'knee'], ain: ['rain', 'train', 'chain', 'brain', 'main'],
  oat: ['boat', 'coat', 'goat', 'float'], un: ['bun', 'fun', 'run', 'sun'], ed: ['bed', 'red', 'fed', 'sled', 'shed'],
  ay: ['day', 'play', 'say', 'stay', 'way', 'gray'], ook: ['book', 'cook', 'look', 'hook', 'took']
};

/* ---------- sight words ---------- */
export const SIGHT_WORDS = ['again', 'each', 'from', 'may', 'stop', 'than', 'when', 'after', 'best', 'gave', 'has', 'once', 'them', 'were', 'as', 'by', 'four', 'her', 'more', 'some', 'think', 'way', 'every', 'could', 'how', 'over', 'put', 'there', 'who', 'ask', 'five', 'just', 'long', 'read', 'then', 'want', 'any', 'give', 'his', 'new', 'open', 'sleep', 'wish', 'also', 'fly', 'know', 'live', 'old', 'soon', 'why', 'because', 'before', 'which', 'would', 'their', 'many', 'where', 'always', 'around', 'does'];

/* ---------- ABC order word list ---------- */
export const ABC_WORDS = ['ball', 'bank', 'bark', 'bat', 'bed', 'bell', 'bench', 'bird', 'bike', 'black', 'blue', 'boat', 'book', 'box', 'bread', 'brick', 'brush', 'bug', 'bus',
  'cake', 'can', 'cap', 'car', 'cat', 'chair', 'cheese', 'chick', 'clock', 'cloud', 'coat', 'cow', 'crab', 'cup',
  'dance', 'desk', 'dog', 'doll', 'door', 'dot', 'drum', 'duck', 'fan', 'farm', 'fast', 'fish', 'flag', 'fox', 'frog', 'fun',
  'game', 'gate', 'gift', 'girl', 'glass', 'goat', 'gold', 'grape', 'green', 'hand', 'hat', 'hen', 'hill', 'hop', 'horse', 'house', 'hug',
  'lamp', 'leaf', 'leg', 'lip', 'log', 'look', 'lunch', 'man', 'map', 'mat', 'milk', 'mom', 'moon', 'mop', 'mud', 'nap', 'nest', 'net', 'nose', 'nut',
  'pan', 'park', 'pen', 'pet', 'pig', 'pin', 'plan', 'pot', 'pup', 'rain', 'ran', 'rat', 'red', 'ring', 'rock', 'rug', 'run',
  'sand', 'sat', 'seal', 'see', 'ship', 'shop', 'sock', 'sun', 'swim', 'table', 'tag', 'ten', 'tent', 'tin', 'top', 'toy', 'tree', 'tub',
  'water', 'web', 'well', 'whale', 'wing', 'wolf', 'yard', 'yarn', 'zebra', 'zoo', 'apple', 'ant', 'arm', 'egg', 'elf', 'ink', 'owl', 'ox', 'up'];

/* ---------- misspellings ---------- */
const VOWEL_SWAPS = [['ai', 'ay'], ['ay', 'ai'], ['ee', 'ea'], ['ea', 'ee'], ['oa', 'ow'], ['ow', 'oa'], ['igh', 'ie'], ['ie', 'y'], ['oo', 'ew'], ['ew', 'oo'], ['ue', 'oo'], ['ou', 'ow'], ['oi', 'oy'], ['oy', 'oi'], ['ar', 'or'], ['or', 'ar'], ['ir', 'ur'], ['ur', 'er'], ['er', 'ir'], ['ck', 'k'], ['ph', 'f'], ['ch', 'sh'], ['sh', 'ch'], ['th', 'f']];
/** Plausible misspellings of a word (never equal to the word). */
export function misspell(word, n = 3) {
  const out = new Set();
  for (const [a, c] of VOWEL_SWAPS) if (word.includes(a)) out.add(word.replace(a, c));
  if (/[^aeiou]e$/.test(word)) out.add(word.slice(0, -1));                     // drop silent e
  if (/[^aeiou]$/.test(word) && word.length <= 5) out.add(word + 'e');           // add stray e
  for (let i = 0; i < word.length - 1; i++) {                                     // swap neighbours
    if (word[i] !== word[i + 1]) out.add(word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2));
  }
  word.replace(/[aeiou]/g, (v, i) => { for (const r of 'aeiou') if (r !== v) out.add(word.slice(0, i) + r + word.slice(i + 1)); return v; });
  const doubled = word.match(/([b-df-hj-np-tv-z])\1/);
  if (doubled) out.add(word.replace(doubled[0], doubled[1]));
  out.delete(word);
  // prefer the "smart" misspellings (first ones added) but keep variety
  return shuffle([...out].slice(0, 8)).slice(0, n);
}
