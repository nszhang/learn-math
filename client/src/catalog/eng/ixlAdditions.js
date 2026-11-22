/* English — skills IXL Canada added since the catalog was built (checked 2026-11-21):
   Junior Kindergarten (first sounds, consonant sounds, short vowels in upper/lowercase, sight words,
   number and location words), animal fantasy (K–1), vowel-team and long-vowel stories by sound
   (Grades 1–2), and "Identify the author's purpose and message" (Grades 4–5). */
import { pick, sample, shuffle, big, b, mc, SHORT } from './words.js';
import { renderPassage, nextPassage } from './comprehension.js';
import { CL_BOOKS_1_2 } from './rc/classics.js';

const sk = (k, t, s, g, gen) => ({ k, t, s, g, gen });
const listen = (q, say) => ({ ...q, say, lang: 'en-US', listen: true });
const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const CONSONANTS = 'bcdfghjklmnpqrstvwxyz'.split('');
const L = s => `<span style="font-size:2rem;font-weight:800">${s}</span>`;
const up = (w, upper) => (upper ? w.toUpperCase() : w);

/* ---------- first sounds (pictures of words that start with a clear consonant sound) ---------- */
const PICS = [['ball', '⚽'], ['bee', '🐝'], ['bus', '🚌'], ['cat', '🐱'], ['cake', '🎂'], ['car', '🚗'], ['dog', '🐶'], ['duck', '🦆'],
  ['fish', '🐟'], ['fox', '🦊'], ['gift', '🎁'], ['goat', '🐐'], ['hat', '🎩'], ['horse', '🐴'], ['jet', '✈️'], ['jam', '🍓'],
  ['kite', '🪁'], ['key', '🔑'], ['leaf', '🍃'], ['lion', '🦁'], ['moon', '🌙'], ['mouse', '🐭'], ['nest', '🪺'], ['nose', '👃'],
  ['pig', '🐷'], ['pen', '🖊️'], ['rain', '🌧️'], ['ring', '💍'], ['sun', '☀️'], ['sock', '🧦'], ['tent', '⛺'], ['tree', '🌳'],
  ['van', '🚐'], ['vest', '🦺'], ['web', '🕸️'], ['worm', '🪱'], ['yo-yo', '🪀'], ['zebra', '🦓'], ['zip', '🤐']];
const firstSound = () => {
  const [w, e] = pick(PICS), c = w[0];
  return listen(mc(`${big(e)}<br>🎧 What is the first sound in ${b(w)}?`, `/${c}/`, sample(CONSONANTS.filter(x => x !== c && x !== 'q' && x !== 'x'), 3).map(x => `/${x}/`),
    `${b(w)} starts with the ${b('/' + c + '/')} sound.`), w);
};
const beginsWith = () => {
  const [w, e] = pick(PICS), c = w[0];
  const others = sample(PICS.filter(x => x[0][0] !== c), 3);
  return listen(mc(`🎧 Which word begins with the ${b('/' + c + '/')} sound?`, `${e} ${w}`, others.map(([x, f]) => `${f} ${x}`),
    `${b(w)} begins with ${b(c)}.`), `${c}`);
};
const consonantReview = upper => () => {
  const [w, e] = pick(PICS), c = w[0];
  return listen(mc(`${big(e)}<br>🎧 Which ${upper ? 'uppercase' : 'lowercase'} letter makes the first sound in ${b(w)}?`, up(c, upper),
    sample(CONSONANTS.filter(x => x !== c), 3).map(x => up(x, upper)), `${b(w)} starts with ${b(c.toUpperCase() + ' ' + c)}.`), w);
};

/* ---------- short vowels: picture ↔ word, in uppercase or lowercase ---------- */
const shortWordForPicture = (v, upper) => () => {
  const [w, e] = pick(SHORT[v]);
  return mc(`${big(e)}<br>Which word matches the picture?`, up(w, upper), sample(SHORT[v].filter(x => x[0] !== w), 3).map(x => up(x[0], upper)),
    `The picture shows ${b(up(w, upper))} — it has the short ${b(v)} sound.`);
};
const pictureForShortWord = (v, upper) => () => {
  const [w, e] = pick(SHORT[v]);
  return mc(`Which picture matches the word ${L(up(w, upper))}?`, e, sample(SHORT[v].filter(x => x[0] !== w), 3).map(x => x[1]),
    `${b(up(w, upper))} is ${e}.`);
};

/* ---------- Junior Kindergarten sight words (the words are in each skill's title) ---------- */
const JK_SIGHT = [['a', 'in', 'run', 'the', 'you'], ['and', 'had', 'is', 'let', 'to'], ['at', 'for', 'I', 'one', 'said'], ['can', 'it', 'not', 'up', 'yes'],
  ['an', 'do', 'jump', 'look', 'make'], ['down', 'go', 'out', 'so', 'two'], ['find', 'my', 'no', 'red', 'see'], ['come', 'funny', 'little', 'me', 'sit'],
  ['big', 'help', 'play', 'three', 'yellow'], ['away', 'blue', 'here', 'us', 'where']];
const sightListen = words => () => { const w = pick(words); return listen(mc('🎧 <strong>Listen</strong>, then choose the word you hear.', w, sample(words.filter(x => x !== w), 3), `The word was ${b(w)}.`), w); };

/* ---------- number words ---------- */
const NUM = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const numberWords = (lo, hi) => () => {
  const n = lo + Math.floor(Math.random() * (hi - lo + 1)), e = pick(['🍎', '⭐', '🐟', '🎈', '🌸', '🐞', '🍪']);
  const pool = NUM.slice(Math.max(0, lo - 2), hi + 1).filter(x => x !== NUM[n - 1]);
  return mc(`${big(e.repeat(n))}<br>How many are there?`, NUM[n - 1], sample(pool, 3), `Count them: there are ${b(NUM[n - 1])}.`);
};

/* ---------- location words, shown with a simple picture ---------- */
const scene = inner => `<svg viewBox="0 0 220 150" width="220" height="150" style="max-width:100%;height:auto;display:block;margin:6px 0" role="img">${inner}</svg>`;
const BOX = '<rect x="80" y="60" width="70" height="60" fill="#fde68a" stroke="#92400e" stroke-width="3"/><line x1="80" y1="60" x2="150" y2="60" stroke="#92400e" stroke-width="5"/>';
const ball = (x, y) => `<circle cx="${x}" cy="${y}" r="13" fill="#ef4444" stroke="#7f1d1d" stroke-width="2"/>`;
const insideOutside = () => {
  const inside = Math.random() < 0.5;
  return mc(`${scene(BOX + (inside ? ball(115, 98) : ball(pick([40, 185]), 107)))}Where is the ball?`, inside ? 'inside the box' : 'outside the box',
    [inside ? 'outside the box' : 'inside the box'], inside ? 'The ball is in the box: it is <strong>inside</strong>.' : 'The ball is not in the box: it is <strong>outside</strong>.', 2);
};
const aboveBelow = () => {
  const above = Math.random() < 0.5, shelf = '<rect x="40" y="72" width="140" height="10" fill="#92400e"/>';
  return mc(`${scene(shelf + ball(110, above ? 45 : 110))}Is the ball above or below the shelf?`, above ? 'above' : 'below', [above ? 'below' : 'above'],
    above ? 'The ball is higher than the shelf: <strong>above</strong>.' : 'The ball is lower than the shelf: <strong>below</strong>.', 2);
};
const nextTo = () => {
  const where = pick(['next to', 'above', 'below']);
  const pos = { 'next to': [185, 98], above: [115, 32], below: [115, 138] }[where];
  return mc(`${scene(BOX.replace('y="60" width="70" height="60"', 'y="70" width="70" height="50"').replace('y1="60" x2="150" y2="60"', 'y1="70" x2="150" y2="70"') + ball(...pos))}Where is the ball?`,
    `${where} the box`, ['next to', 'above', 'below'].filter(x => x !== where).map(x => `${x} the box`),
    where === 'next to' ? 'The ball is right beside the box: <strong>next to</strong> it. (“Next to” and “beside” mean the same thing.)' : `The ball is <strong>${where}</strong> the box.`, 3);
};

/* ---------- animal fantasy (Kindergarten–Grade 1) ---------- */
const FANTASY = [
  { t: 'Bear Bakes a Cake', p: ['Bear wanted to make a cake for Duck. He put in honey, eggs and flour. Oops! He put in too much honey. The cake was very, very sweet.', 'Duck took one bite. "Yum!" said Duck. "I love sweet things!" Bear smiled a big smile.'],
    q: [['Who did Bear make the cake for?', 'Duck', ['Fox', 'His mom', 'Himself'], 'Bear wanted to make a cake for Duck.'], ['What did Bear put too much of in the cake?', 'Honey', ['Eggs', 'Flour', 'Salt'], 'He put in too much honey.'],
      ['How do you know this story is make-believe?', 'A bear bakes a cake and a duck talks', ['Ducks like cake', 'Cakes are sweet', 'Bears eat honey'], 'Real bears do not bake, and real ducks do not talk.']] },
  { t: 'The Brave Little Mouse', p: ['Mia Mouse lived under the big red barn. One night the lights went out. "I am scared of the dark," said Pig.', 'Mia got her tiny lamp. "Follow me!" she said. She led Pig all the way home.'],
    q: [['Where did Mia Mouse live?', 'Under the big red barn', ['In a tree', 'In a house', 'Under the sea'], 'She lived under the big red barn.'], ['Who was scared of the dark?', 'Pig', ['Mia', 'Cow', 'Hen'], 'Pig said, "I am scared of the dark."'],
      ['Which word tells about Mia?', 'Brave', ['Sleepy', 'Mean', 'Scared'], 'She led Pig home in the dark.']] },
  { t: 'Frog Goes to School', p: ['Frog put on his blue backpack. It was his first day of school. "What if no one plays with me?" he said.', 'At school, Turtle sat next to him. They played tag and ate lunch together. Frog hopped home happy.'],
    q: [['What colour was Frog\'s backpack?', 'Blue', ['Green', 'Red', 'Yellow'], 'He put on his blue backpack.'], ['Who sat next to Frog?', 'Turtle', ['Bear', 'Duck', 'Fish'], 'Turtle sat next to him.'],
      ['How did Frog feel at the end?', 'Happy', ['Sad', 'Scared', 'Angry'], 'Frog hopped home happy.']] },
  { t: 'Owl Cannot Sleep', p: ['It was day, and Owl wanted to sleep. But Crow sang loudly. Squirrel cracked nuts. Dog barked at the cat.', 'Owl put on a hat over her ears. "Ahh," she said. At last it was quiet, and Owl fell asleep.'],
    q: [['Why could Owl not sleep?', 'The other animals were noisy', ['She was hungry', 'It was too cold', 'She was sick'], 'Crow sang, Squirrel cracked nuts and Dog barked.'], ['What did Owl put over her ears?', 'A hat', ['A pillow', 'A leaf', 'Her wings'], 'She put on a hat over her ears.'],
      ['When does Owl like to sleep?', 'In the day', ['At night', 'Never', 'Only in winter'], 'It was day, and Owl wanted to sleep.']] },
  { t: 'Rabbit\'s Garden', p: ['Rabbit planted carrot seeds. Every day she gave them water. Every day she looked. Nothing!', 'Then one morning, green tops popped up. Rabbit pulled one out. It was a big orange carrot. "Good things take time," said Rabbit.'],
    q: [['What did Rabbit plant?', 'Carrot seeds', ['Apple trees', 'Flowers', 'Peas'], 'Rabbit planted carrot seeds.'], ['What did Rabbit do every day?', 'Gave the seeds water', ['Dug them up', 'Sang to them', 'Moved them'], 'Every day she gave them water.'],
      ['What lesson does Rabbit learn?', 'Good things take time', ['Never plant seeds', 'Carrots are orange', 'Gardens are easy'], 'Rabbit says, "Good things take time."']] }
].map(ps => ({ ...ps, by: null }));
const FANTASY_POOL = [...FANTASY, CL_BOOKS_1_2[0]];   // plus The Tale of Peter Rabbit
const passageQ = pool => () => {
  const ps = nextPassage(pool), [q, a, w, why] = pick(ps.q);
  return { type: 'mc', prompt: `${renderPassage(ps)}<p class="rc-q">${q}</p>`, answer: a, choices: shuffle([a, ...w]), explain: why };
};

/* ---------- stories for each vowel team / long vowel (Grades 1–2) ---------- */
const story = (t, text, q) => ({ t, by: null, p: [text], q });
const VT = {
  'ee, ea': [
    story('The Seal and the Bee', 'A seal sat in the sea. A bee came to see him. "Can I eat with you?" asked the bee. The seal gave the bee a green leaf to eat. They had a treat by the beach.',
      [['Where did the seal sit?', 'In the sea', ['In a tree', 'On a boat', 'In a nest'], 'A seal sat in the sea.'], ['What did the seal give the bee?', 'A green leaf', ['A peach', 'A seed', 'A bean'], 'The seal gave the bee a green leaf.']]),
    story('Jean Cleans Up', 'Jean had a big mess in her room. She swept the floor and made it neat and clean. Then she had a treat: a sweet peach. Jean likes a clean room.',
      [['What did Jean do first?', 'Swept the floor', ['Ate a peach', 'Went to sleep', 'Read a book'], 'She swept the floor and made it neat and clean.'], ['What was Jean\'s treat?', 'A sweet peach', ['Ice cream', 'A cookie', 'A green bean'], 'Then she had a treat: a sweet peach.']])
  ],
  'oa, ow': [
    story('The Goat and the Boat', 'A goat had a red boat. He rowed the boat on the lake. The wind began to blow. The goat put on his coat and rowed home slowly.',
      [['What did the goat have?', 'A red boat', ['A red coat', 'A toad', 'A bowl'], 'A goat had a red boat.'], ['What did the goat put on when the wind blew?', 'His coat', ['His hat', 'His boots', 'A bow'], 'The goat put on his coat.']]),
    story('Snow on the Road', 'Snow fell on the road. Joan put on her coat and went to throw snowballs. Her dog rolled in the snow. They made a snowman with a bow.',
      [['What fell on the road?', 'Snow', ['Rain', 'Leaves', 'Toast'], 'Snow fell on the road.'], ['What did they put on the snowman?', 'A bow', ['A boat', 'A hat', 'A coat'], 'They made a snowman with a bow.']])
  ],
  'ai, ay': [
    story('A Day in the Rain', 'It was a gray day. Rain fell all day. Jay and Gail did not stay inside. They put on rain boots and played in the rain. They made a sail for a little paper boat.',
      [['What was the day like?', 'Gray and rainy', ['Hot and sunny', 'Snowy', 'Windy and dry'], 'It was a gray day. Rain fell all day.'], ['What did Jay and Gail make?', 'A sail for a paper boat', ['A cake', 'A kite', 'A snail'], 'They made a sail for a little paper boat.']]),
    story('The Snail on the Trail', 'A snail went down a trail. It was slow, but it did not stop. At the end of the trail, it found hay to play in. "Hooray!" said the snail.',
      [['Where did the snail go?', 'Down a trail', ['Up a tree', 'Into a pail', 'On a train'], 'A snail went down a trail.'], ['What did the snail find at the end?', 'Hay to play in', ['A pail', 'Rain', 'A train'], 'It found hay to play in.']])
  ]
};
const LV = {
  'long a, e, o': [
    story('Pete and the Cake', 'Pete made a cake for his mom. He gave it a rose on top. "We can eat it at home," he said. Mom said, "This cake is the best!"',
      [['What did Pete make?', 'A cake', ['A rose', 'A boat', 'A game'], 'Pete made a cake for his mom.'], ['What was on top of the cake?', 'A rose', ['A note', 'A cone', 'A bee'], 'He gave it a rose on top.']]),
    story('Rose Plays a Game', 'Rose and Steve played a game in the shade. Rose hid a stone. Steve had to find it. He found it in a hole near the gate.',
      [['Where did they play?', 'In the shade', ['At the lake', 'At home', 'In a cave'], 'They played a game in the shade.'], ['Where was the stone?', 'In a hole near the gate', ['Under a cone', 'On a plate', 'In a tree'], 'He found it in a hole near the gate.']])
  ],
  'long i, u': [
    story('Mike Rides a Bike', 'Mike likes to ride his bike. He rides it five times a day. Today he rode to see his friend June. June gave him a cube of ice to eat.',
      [['How many times a day does Mike ride his bike?', 'Five', ['Nine', 'Two', 'Ten'], 'He rides it five times a day.'], ['What did June give Mike?', 'A cube of ice', ['A kite', 'A mule', 'A tube'], 'June gave him a cube of ice to eat.']]),
    story('The Cute Mule', 'June has a cute mule. The mule likes to smile. At night, the mule hums a tune. June thinks her mule is the best pet in the whole wide world.',
      [['What pet does June have?', 'A mule', ['A cat', 'A kite', 'A bike'], 'June has a cute mule.'], ['What does the mule do at night?', 'Hums a tune', ['Rides a bike', 'Flies a kite', 'Eats rice'], 'At night, the mule hums a tune.']])
  ]
};

/* ---------- author's purpose and message (Grades 4–5) ---------- */
const PURPOSE = [
  ['Bees do much more than make honey. As they fly from flower to flower, they carry pollen that helps plants make fruit. Without bees, many of the foods we eat would disappear.', 'To inform readers that bees are important to our food', ['To entertain readers with a funny bee story', 'To persuade readers to buy honey', 'To explain how to keep bees as pets']],
  ['Every student should bring a reusable water bottle to school. Plastic bottles fill our landfills, and refilling a bottle saves money too. Make the switch today!', 'To persuade readers to use reusable water bottles', ['To inform readers how plastic is made', 'To entertain readers with a story about a bottle', 'To describe what a landfill looks like']],
  ['Maple the puppy chased her tail until she was dizzy. Then she flopped onto her bed, sighed and fell fast asleep — still holding her tail in her mouth.', 'To entertain readers with a funny scene', ['To inform readers how to train a puppy', 'To persuade readers to adopt a dog', 'To explain why dogs sleep so much']],
  ['Terry Fox ran 5,373 kilometres across Canada on one real leg to raise money for cancer research. He never finished, but his run inspired millions of people.', 'To inform readers about Terry Fox and show how one person can inspire others', ['To persuade readers to start running', 'To entertain readers with a made-up adventure', 'To describe the roads across Canada']],
  ['Our town should build a skate park. Right now, skaters use parking lots, which is unsafe. A park would give kids a safe, fun place to be active.', 'To persuade readers that the town needs a skate park', ['To inform readers about the history of skateboarding', 'To entertain readers with a skateboarding story', 'To explain how to build a ramp']],
  ['When Lin forgot her lines in the play, her friend whispered them from the side of the stage. Lin finished the scene with a big smile. She learned that good friends help you shine.', 'To entertain readers and share the message that friends help each other', ['To persuade readers to try out for a play', 'To inform readers how plays are written', 'To explain how to remember lines']],
  ['Recycling one aluminum can saves enough energy to run a television for three hours. Cans can be recycled again and again without wearing out.', 'To inform readers about the benefits of recycling cans', ['To entertain readers with a story about a can', 'To persuade readers to watch less television', 'To describe how televisions work']],
  ['Turn off the tap while you brush your teeth! You can save up to eight litres of water each time. Small changes add up to a big difference for our planet.', 'To persuade readers to save water', ['To inform readers how teeth are cleaned', 'To entertain readers with a joke about water', 'To describe a bathroom']],
  ['The old oak tree had seen a hundred winters. Birds nested in its branches and children climbed its trunk. When a storm finally knocked it down, the whole street gathered to plant a new one.', 'To entertain readers and share the message that a community cares for nature together', ['To inform readers how to grow an oak tree', 'To persuade readers to cut down old trees', 'To explain what causes storms']],
  ['Octopuses have three hearts and blue blood. They can change colour in less than a second to hide from enemies.', 'To inform readers about surprising facts about octopuses', ['To persuade readers to keep an octopus', 'To entertain readers with an octopus adventure', 'To explain how to cook seafood']]
];
const purposeQ = () => {
  const [text, a, w] = pick(PURPOSE);
  return mc(`<div class="passage">${text}</div><p class="rc-q">What is the author's purpose and message?</p>`, a, w,
    `Ask what the author wants you to do or feel: ${b(a.charAt(0).toLowerCase() + a.slice(1))}.`);
};

export const ADDITIONS_SPECS = [
  // Junior Kindergarten
  sk('XJkFs', 'Identify the first sound in a word', 'Blending and segmenting', [-1], firstSound),
  sk('XJkCsU', 'Choose the uppercase letter that matches the consonant sound: review', 'Letter-sound associations: uppercase', [-1], consonantReview(true)),
  sk('XJkBw', 'Find the word that begins with a given sound', 'Letter-sound associations: lowercase', [-1], beginsWith),
  sk('XJkCsL', 'Choose the lowercase letter that matches the consonant sound: review', 'Letter-sound associations: lowercase', [-1], consonantReview(false)),
  ...VOWELS.flatMap(v => [true, false].map(upper => (['e', 'u'].includes(v)
    ? sk(`XJkSp${v}${upper ? 'U' : 'L'}`, `Choose the picture that matches the short ${v} word: ${upper ? 'uppercase' : 'lowercase'}`, `Short ${v}`, [-1], pictureForShortWord(v, upper))
    : sk(`XJkSw${v}${upper ? 'U' : 'L'}`, `Choose the short ${v} word that matches the picture: ${upper ? 'uppercase' : 'lowercase'}`, `Short ${v}`, [-1], shortWordForPicture(v, upper))))),
  ...JK_SIGHT.map((set, i) => sk(`XJkSw${i + 1}`, `Read sight words set ${i + 1}: ${set.join(', ')}`, 'Sight words', [-1], sightListen(set))),
  sk('XJkNw5', 'Use number words: one to five', 'Colour and number words', [-1], numberWords(1, 5)),
  sk('XJkNw10', 'Use number words: six to ten', 'Colour and number words', [-1], numberWords(6, 10)),
  sk('XJkIo', 'Inside and outside', 'Location words', [-1], insideOutside),
  sk('XJkAb', 'Above and below', 'Location words', [-1], aboveBelow),
  sk('XJkNt', 'Next to and beside', 'Location words', [-1], nextTo),
  // Kindergarten–Grade 1
  sk('XAnFan', 'Read animal fantasy', 'Reality vs. fiction', [0, 1], passageQ(FANTASY_POOL)),
  // Grades 1–2: stories for each sound
  ...Object.entries(VT).map(([teams, list]) => sk(`XVt${teams.replace(/\W/g, '')}`, `Read vowel team stories: ${teams}`, 'Vowel teams', [1], passageQ(list))),
  ...Object.entries(LV).map(([sounds, list]) => sk(`XLv${sounds.replace(/\W/g, '')}`, `Read long vowel stories: ${sounds}`, 'Vowel teams', [2], passageQ(list))),
  // Grades 4–5
  sk('XAuPM', "Identify the author's purpose and message", "Author's purpose", [4, 5], purposeQ)
];
