/* Word data for the generated grammar and vocabulary skills (grades 1–5). */

// [singular, plural, rule]
export const NOUNS = [
  ['cat', 'cats', 's'], ['dog', 'dogs', 's'], ['book', 'books', 's'], ['tree', 'trees', 's'], ['car', 'cars', 's'], ['apple', 'apples', 's'], ['girl', 'girls', 's'], ['hat', 'hats', 's'], ['bird', 'birds', 's'], ['shoe', 'shoes', 's'],
  ['box', 'boxes', 'es'], ['bus', 'buses', 'es'], ['dish', 'dishes', 'es'], ['fox', 'foxes', 'es'], ['glass', 'glasses', 'es'], ['lunch', 'lunches', 'es'], ['bench', 'benches', 'es'], ['brush', 'brushes', 'es'], ['wish', 'wishes', 'es'], ['watch', 'watches', 'es'],
  ['baby', 'babies', 'ies'], ['city', 'cities', 'ies'], ['party', 'parties', 'ies'], ['puppy', 'puppies', 'ies'], ['story', 'stories', 'ies'], ['cherry', 'cherries', 'ies'], ['family', 'families', 'ies'], ['berry', 'berries', 'ies'],
  ['boy', 'boys', 's'], ['day', 'days', 's'], ['key', 'keys', 's'], ['toy', 'toys', 's'],
  ['leaf', 'leaves', 'ves'], ['wolf', 'wolves', 'ves'], ['knife', 'knives', 'ves'], ['shelf', 'shelves', 'ves'], ['half', 'halves', 'ves'], ['loaf', 'loaves', 'ves'], ['calf', 'calves', 'ves'], ['life', 'lives', 'ves'],
  ['roof', 'roofs', 's'], ['chief', 'chiefs', 's'], ['potato', 'potatoes', 'oes'], ['tomato', 'tomatoes', 'oes'], ['hero', 'heroes', 'oes'], ['echo', 'echoes', 'oes'], ['piano', 'pianos', 's'], ['photo', 'photos', 's'],
  ['child', 'children', 'irr'], ['man', 'men', 'irr'], ['woman', 'women', 'irr'], ['foot', 'feet', 'irr'], ['tooth', 'teeth', 'irr'], ['mouse', 'mice', 'irr'], ['goose', 'geese', 'irr'], ['person', 'people', 'irr'], ['ox', 'oxen', 'irr'], ['fish', 'fish', 'irr'], ['sheep', 'sheep', 'irr'], ['deer', 'deer', 'irr'], ['moose', 'moose', 'irr']
];
export function wrongPlurals(sg, pl) {
  const out = new Set([sg + 's', sg + 'es', sg.replace(/y$/, 'ies'), sg.replace(/fe?$/, 'ves'), sg + 'en', sg.replace(/oo/, 'ee'), sg + 'ies']);
  out.delete(pl); out.delete(sg);
  return [...out];
}

// [base, past, past participle, object/adverb phrase]
export const IRREGULAR = [
  ['go', 'went', 'gone', 'to the park'], ['eat', 'ate', 'eaten', 'a sandwich'], ['see', 'saw', 'seen', 'a rainbow'], ['run', 'ran', 'run', 'around the track'], ['come', 'came', 'come', 'home early'],
  ['sing', 'sang', 'sung', 'a song'], ['swim', 'swam', 'swum', 'in the lake'], ['drink', 'drank', 'drunk', 'some water'], ['give', 'gave', 'given', 'a gift'], ['take', 'took', 'taken', 'the bus'],
  ['write', 'wrote', 'written', 'a letter'], ['ride', 'rode', 'ridden', 'a bike'], ['draw', 'drew', 'drawn', 'a picture'], ['fly', 'flew', 'flown', 'a kite'], ['throw', 'threw', 'thrown', 'the ball'],
  ['grow', 'grew', 'grown', 'tall'], ['know', 'knew', 'known', 'the answer'], ['break', 'broke', 'broken', 'a plate'], ['speak', 'spoke', 'spoken', 'to the class'], ['wear', 'wore', 'worn', 'a hat'],
  ['bring', 'brought', 'brought', 'a snack'], ['buy', 'bought', 'bought', 'some milk'], ['think', 'thought', 'thought', 'about it'], ['catch', 'caught', 'caught', 'a fish'], ['teach', 'taught', 'taught', 'a lesson'],
  ['make', 'made', 'made', 'a cake'], ['tell', 'told', 'told', 'a story'], ['sell', 'sold', 'sold', 'lemonade'], ['find', 'found', 'found', 'a coin'], ['hold', 'held', 'held', 'the baby'],
  ['sleep', 'slept', 'slept', 'all night'], ['keep', 'kept', 'kept', 'a secret'], ['feel', 'felt', 'felt', 'happy'], ['leave', 'left', 'left', 'early'], ['meet', 'met', 'met', 'a friend'],
  ['sit', 'sat', 'sat', 'on the bench'], ['stand', 'stood', 'stood', 'in line'], ['win', 'won', 'won', 'the game'], ['dig', 'dug', 'dug', 'a hole'], ['hide', 'hid', 'hidden', 'the key'],
  ['fall', 'fell', 'fallen', 'asleep'], ['get', 'got', 'gotten', 'a letter'], ['begin', 'began', 'begun', 'the test'], ['blow', 'blew', 'blown', 'out the candles'], ['shake', 'shook', 'shaken', 'the jar']
];
// [base, past] regular verbs grouped by spelling rule
export const REGULAR = [
  ['walk', 'walked'], ['jump', 'jumped'], ['play', 'played'], ['talk', 'talked'], ['help', 'helped'], ['cook', 'cooked'], ['kick', 'kicked'], ['pull', 'pulled'], ['call', 'called'], ['stay', 'stayed'],
  ['bake', 'baked'], ['smile', 'smiled'], ['dance', 'danced'], ['like', 'liked'], ['hope', 'hoped'], ['close', 'closed'], ['skate', 'skated'],
  ['stop', 'stopped'], ['hop', 'hopped'], ['clap', 'clapped'], ['drop', 'dropped'], ['plan', 'planned'], ['skip', 'skipped'], ['hug', 'hugged'], ['grab', 'grabbed'],
  ['cry', 'cried'], ['try', 'tried'], ['carry', 'carried'], ['hurry', 'hurried'], ['study', 'studied'], ['dry', 'dried'], ['copy', 'copied']
];
export function wrongPast(base, past) {
  const out = new Set([base + 'ed', base + 'd', base + base.slice(-1) + 'ed', base.replace(/y$/, 'ied'), base.replace(/e$/, '') + 'ed', base + 's', base + 'ing']);
  out.delete(past);
  return [...out];
}

// subjects for agreement: [text, person/number key]
export const SUBJECTS = [
  ['I', 'I'], ['You', 'you'], ['He', '3s'], ['She', '3s'], ['It', '3s'], ['We', 'pl'], ['They', 'pl'],
  ['The dog', '3s'], ['My sister', '3s'], ['The teacher', '3s'], ['Grandpa', '3s'], ['The kids', 'pl'], ['My friends', 'pl'], ['The birds', 'pl'], ['Mom and Dad', 'pl']
];
// [base, 3rd-person -s form, rest of sentence]
export const PRESENT_VERBS = [
  ['run', 'runs', 'fast'], ['walk', 'walks', 'to school'], ['eat', 'eats', 'lunch at noon'], ['play', 'plays', 'outside'], ['read', 'reads', 'every night'],
  ['watch', 'watches', 'the birds'], ['wash', 'washes', 'the dishes'], ['fly', 'flies', 'kites in spring'], ['go', 'goes', 'to bed early'], ['sing', 'sings', 'in the car'],
  ['jump', 'jumps', 'rope'], ['catch', 'catches', 'the ball'], ['ride', 'rides', 'the bus'], ['fix', 'fixes', 'the bike'], ['try', 'tries', 'new foods']
];

// [word, contraction]
export const CONTRACTIONS_PRONOUN = [['I am', "I'm"], ['you are', "you're"], ['he is', "he's"], ['she is', "she's"], ['it is', "it's"], ['we are', "we're"], ['they are', "they're"], ['I will', "I'll"], ['you will', "you'll"], ['we will', "we'll"], ['they will', "they'll"], ['I have', "I've"], ['we have', "we've"], ['they have', "they've"], ['I would', "I'd"], ['she will', "she'll"]];
export const CONTRACTIONS_NOT = [['do not', "don't"], ['does not', "doesn't"], ['did not', "didn't"], ['is not', "isn't"], ['are not', "aren't"], ['was not', "wasn't"], ['were not', "weren't"], ['can not', "can't"], ['could not', "couldn't"], ['would not', "wouldn't"], ['should not', "shouldn't"], ['have not', "haven't"], ['has not', "hasn't"], ['will not', "won't"]];

// a/an nouns: [noun, article]
export const ARTICLE_NOUNS = [['apple', 'an'], ['egg', 'an'], ['owl', 'an'], ['umbrella', 'an'], ['igloo', 'an'], ['elephant', 'an'], ['ant', 'an'], ['orange', 'an'], ['octopus', 'an'], ['astronaut', 'an'], ['hour', 'an'], ['honest answer', 'an'],
  ['banana', 'a'], ['dog', 'a'], ['cat', 'a'], ['house', 'a'], ['book', 'a'], ['zebra', 'a'], ['kite', 'a'], ['lemon', 'a'], ['unicorn', 'a'], ['uniform', 'a'], ['one-way street', 'a'], ['horse', 'a'], ['ukulele', 'a'], ['map', 'a']];

// [adjective, comparative, superlative, noun]
export const ADJ_COMPARE = [
  ['big', 'bigger', 'biggest', 'box'], ['small', 'smaller', 'smallest', 'cup'], ['tall', 'taller', 'tallest', 'tree'], ['fast', 'faster', 'fastest', 'car'], ['hot', 'hotter', 'hottest', 'day'],
  ['happy', 'happier', 'happiest', 'puppy'], ['sad', 'sadder', 'saddest', 'song'], ['funny', 'funnier', 'funniest', 'joke'], ['large', 'larger', 'largest', 'room'], ['nice', 'nicer', 'nicest', 'gift'],
  ['old', 'older', 'oldest', 'house'], ['loud', 'louder', 'loudest', 'drum'], ['cold', 'colder', 'coldest', 'drink'], ['wet', 'wetter', 'wettest', 'towel'], ['busy', 'busier', 'busiest', 'street'],
  ['good', 'better', 'best', 'book'], ['bad', 'worse', 'worst', 'storm'], ['beautiful', 'more beautiful', 'most beautiful', 'flower'], ['careful', 'more careful', 'most careful', 'driver'],
  ['colourful', 'more colourful', 'most colourful', 'kite'], ['delicious', 'more delicious', 'most delicious', 'cake'], ['expensive', 'more expensive', 'most expensive', 'watch']
];
export function wrongCompare(adj, form) {
  const base = adj.replace(/y$/, 'i');
  return [adj + 'er', adj + 'est', adj + adj.slice(-1) + 'er', adj + adj.slice(-1) + 'est', base + 'er', base + 'est', 'more ' + adj, 'most ' + adj, 'more ' + adj + 'er', adj + 'ier'].filter(x => x !== form);
}

// adverbs: [adverb, how|when|where, sentence]
export const ADVERBS = [
  ['quickly', 'how', 'The rabbit ran quickly.'], ['slowly', 'how', 'The turtle walked slowly.'], ['loudly', 'how', 'The baby cried loudly.'], ['softly', 'how', 'She whispered softly.'], ['carefully', 'how', 'He carried the eggs carefully.'], ['happily', 'how', 'The kids played happily.'],
  ['yesterday', 'when', 'We went to the zoo yesterday.'], ['today', 'when', 'I have a test today.'], ['soon', 'when', 'The bus will come soon.'], ['later', 'when', 'We will eat later.'], ['now', 'when', 'Please sit down now.'], ['tomorrow', 'when', 'It will snow tomorrow.'],
  ['outside', 'where', 'The dog sleeps outside.'], ['here', 'where', 'Put the box here.'], ['upstairs', 'where', 'My room is upstairs.'], ['nearby', 'where', 'A bird sang nearby.'], ['everywhere', 'where', 'We looked everywhere.'], ['there', 'where', 'Sit over there.']
];
export const ADJ_ADV = [['quick', 'quickly'], ['slow', 'slowly'], ['loud', 'loudly'], ['soft', 'softly'], ['careful', 'carefully'], ['happy', 'happily'], ['sad', 'sadly'], ['brave', 'bravely'], ['quiet', 'quietly'], ['kind', 'kindly'], ['easy', 'easily'], ['neat', 'neatly'], ['proud', 'proudly'], ['gentle', 'gently']];

/* ---------- vocabulary ---------- */
export const SYNONYMS = [['big', 'large'], ['small', 'little'], ['happy', 'glad'], ['fast', 'quick'], ['sad', 'unhappy'], ['begin', 'start'], ['shout', 'yell'], ['rock', 'stone'], ['smart', 'clever'], ['tired', 'sleepy'], ['jump', 'leap'], ['look', 'see'], ['close', 'shut'], ['end', 'finish'], ['gift', 'present'], ['scared', 'afraid'], ['pretty', 'lovely'], ['quiet', 'silent'], ['grab', 'take'], ['angry', 'mad'], ['easy', 'simple'], ['funny', 'silly'], ['laugh', 'giggle'], ['story', 'tale'], ['road', 'street']];
export const ANTONYMS = [['hot', 'cold'], ['up', 'down'], ['big', 'small'], ['day', 'night'], ['happy', 'sad'], ['fast', 'slow'], ['open', 'closed'], ['wet', 'dry'], ['in', 'out'], ['full', 'empty'], ['old', 'new'], ['loud', 'quiet'], ['early', 'late'], ['hard', 'soft'], ['light', 'dark'], ['win', 'lose'], ['push', 'pull'], ['top', 'bottom'], ['first', 'last'], ['give', 'take'], ['clean', 'dirty'], ['tall', 'short'], ['strong', 'weak'], ['above', 'below'], ['always', 'never']];
export const CATEGORIES = {
  fruits: ['apple', 'banana', 'grape', 'pear', 'cherry', 'orange', 'lemon', 'mango'],
  animals: ['lion', 'horse', 'rabbit', 'tiger', 'cow', 'zebra', 'bear', 'goat'],
  colours: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown'],
  clothes: ['shirt', 'sock', 'jacket', 'scarf', 'dress', 'hat', 'glove', 'boot'],
  vehicles: ['car', 'bus', 'truck', 'train', 'boat', 'plane', 'bike', 'van'],
  'body parts': ['arm', 'leg', 'nose', 'ear', 'hand', 'knee', 'elbow', 'toe'],
  shapes: ['circle', 'square', 'triangle', 'oval', 'rectangle', 'star', 'diamond', 'hexagon'],
  'weather words': ['rain', 'snow', 'wind', 'sun', 'fog', 'hail', 'storm', 'cloud'],
  'musical instruments': ['drum', 'piano', 'flute', 'guitar', 'violin', 'trumpet', 'harp', 'cello'],
  furniture: ['chair', 'table', 'sofa', 'bed', 'desk', 'shelf', 'stool', 'dresser'],
  feelings: ['happy', 'angry', 'scared', 'proud', 'lonely', 'excited', 'nervous', 'calm'],
  'school supplies': ['pencil', 'eraser', 'ruler', 'crayon', 'marker', 'notebook', 'glue', 'scissors']
};
export const COMPOUNDS = [['sun', 'flower'], ['rain', 'bow'], ['foot', 'ball'], ['butter', 'fly'], ['cup', 'cake'], ['note', 'book'], ['snow', 'man'], ['star', 'fish'], ['bed', 'room'], ['pop', 'corn'], ['tooth', 'brush'], ['back', 'pack'], ['fire', 'truck'], ['class', 'room'], ['air', 'plane'], ['jelly', 'fish'], ['sail', 'boat'], ['gold', 'fish'], ['play', 'ground'], ['home', 'work'], ['rain', 'coat'], ['bath', 'tub'], ['mail', 'box'], ['sun', 'set'], ['door', 'bell'], ['hand', 'shake'], ['moon', 'light'], ['sea', 'shell']];
// [word, base, affix, meaning]
export const AFFIX_WORDS = [
  ['preheat', 'heat', 'pre-', 'heat before'], ['preview', 'view', 'pre-', 'view before'], ['prepay', 'pay', 'pre-', 'pay before'], ['pretest', 'test', 'pre-', 'test before'],
  ['replay', 'play', 're-', 'play again'], ['redo', 'do', 're-', 'do again'], ['rewrite', 'write', 're-', 'write again'], ['reread', 'read', 're-', 'read again'], ['refill', 'fill', 're-', 'fill again'],
  ['misspell', 'spell', 'mis-', 'spell wrongly'], ['misread', 'read', 'mis-', 'read wrongly'], ['mislead', 'lead', 'mis-', 'lead wrongly'], ['misplace', 'place', 'mis-', 'place wrongly'],
  ['unhappy', 'happy', 'un-', 'not happy'], ['unkind', 'kind', 'un-', 'not kind'], ['unsafe', 'safe', 'un-', 'not safe'], ['unlock', 'lock', 'un-', 'the opposite of lock'],
  ['dislike', 'like', 'dis-', 'not like'], ['disagree', 'agree', 'dis-', 'not agree'], ['dishonest', 'honest', 'dis-', 'not honest'],
  ['impossible', 'possible', 'im-', 'not possible'], ['incorrect', 'correct', 'in-', 'not correct'], ['nonstop', 'stop', 'non-', 'without stopping'],
  ['hopeful', 'hope', '-ful', 'full of hope'], ['careful', 'care', '-ful', 'full of care'], ['joyful', 'joy', '-ful', 'full of joy'], ['helpful', 'help', '-ful', 'full of help'], ['colourful', 'colour', '-ful', 'full of colour'],
  ['fearless', 'fear', '-less', 'without fear'], ['helpless', 'help', '-less', 'without help'], ['careless', 'care', '-less', 'without care'], ['endless', 'end', '-less', 'without an end'], ['spotless', 'spot', '-less', 'without a spot'],
  ['quickly', 'quick', '-ly', 'in a quick way'], ['softly', 'soft', '-ly', 'in a soft way'], ['bravely', 'brave', '-ly', 'in a brave way'], ['kindly', 'kind', '-ly', 'in a kind way'],
  ['kindness', 'kind', '-ness', 'the state of being kind'], ['darkness', 'dark', '-ness', 'the state of being dark'], ['sadness', 'sad', '-ness', 'the state of being sad'], ['softness', 'soft', '-ness', 'the state of being soft'],
  ['readable', 'read', '-able', 'able to be read'], ['washable', 'wash', '-able', 'able to be washed'], ['breakable', 'break', '-able', 'able to be broken'], ['enjoyable', 'enjoy', '-able', 'able to be enjoyed'],
  ['payment', 'pay', '-ment', 'the act of paying'], ['movement', 'move', '-ment', 'the act of moving'], ['enjoyment', 'enjoy', '-ment', 'the act of enjoying'], ['agreement', 'agree', '-ment', 'the act of agreeing']
];
// [word1, word2, sentence for word1 with ___, sentence for word2 with ___]
export const HOMOPHONES = [
  ['sea', 'see', 'We swam in the ___.', 'I can ___ the moon.'], ['son', 'sun', 'Their ___ is five years old.', 'The ___ is shining.'], ['eight', 'ate', 'A spider has ___ legs.', 'I ___ my lunch.'],
  ['flower', 'flour', 'She picked a ___.', 'Bread is made with ___.'], ['tail', 'tale', 'The dog wagged its ___.', 'Grandpa told a funny ___.'], ['pair', 'pear', 'I have a new ___ of shoes.', 'The ___ was ripe.'],
  ['night', 'knight', 'The stars shine at ___.', 'The ___ rode a horse.'], ['blue', 'blew', 'The sky is ___.', 'The wind ___ hard.'], ['hear', 'here', 'Did you ___ that noise?', 'Come over ___.'],
  ['meet', 'meat', 'Nice to ___ you!', 'The ___ was cooked on the grill.'], ['week', 'weak', 'There are seven days in a ___.', 'He felt ___ after the flu.'], ['road', 'rode', 'Look both ways before crossing the ___.', 'She ___ her bike.'],
  ['bee', 'be', 'A ___ buzzed by.', 'I will ___ on time.'], ['one', 'won', 'I have ___ brother.', 'Our team ___ the game.'], ['dear', 'deer', 'You are a ___ friend.', 'A ___ ran into the woods.'],
  ['write', 'right', 'Please ___ your name.', 'Turn ___ at the corner.'], ['hole', 'whole', 'The mouse hid in a ___.', 'I ate the ___ pizza.'], ['mail', 'male', 'The ___ came today.', 'A ___ lion has a mane.']
];
// [word, sentence, correct meaning, other meaning]
export const MULTI = [
  ['bat', 'The <u>bat</u> flew out of the cave.', 'a flying animal', 'a stick used to hit a ball'], ['bat', 'He swung the <u>bat</u> and hit a home run.', 'a stick used to hit a ball', 'a flying animal'],
  ['bark', 'The dog\'s <u>bark</u> was loud.', 'the sound a dog makes', 'the outer covering of a tree'], ['bark', 'The tree\'s <u>bark</u> was rough.', 'the outer covering of a tree', 'the sound a dog makes'],
  ['ring', 'She wore a gold <u>ring</u>.', 'jewellery worn on a finger', 'to make a bell sound'], ['ring', 'Did you hear the phone <u>ring</u>?', 'to make a bell sound', 'jewellery worn on a finger'],
  ['fly', 'A <u>fly</u> landed on my sandwich.', 'a small insect', 'to move through the air'], ['fly', 'Birds <u>fly</u> south in winter.', 'to move through the air', 'a small insect'],
  ['watch', 'I got a new <u>watch</u> for my birthday.', 'a small clock worn on the wrist', 'to look at'], ['watch', 'Let\'s <u>watch</u> a movie.', 'to look at', 'a small clock worn on the wrist'],
  ['light', 'This box is very <u>light</u>.', 'not heavy', 'brightness from the sun or a lamp'], ['light', 'Turn on the <u>light</u>, please.', 'brightness from the sun or a lamp', 'not heavy'],
  ['park', 'We played at the <u>park</u>.', 'a green area for play', 'to leave a car in a spot'], ['park', 'Dad will <u>park</u> the car.', 'to leave a car in a spot', 'a green area for play'],
  ['wave', 'A big <u>wave</u> crashed on the beach.', 'a moving ridge of water', 'to move your hand to say hello'], ['wave', 'Don\'t forget to <u>wave</u> goodbye.', 'to move your hand to say hello', 'a moving ridge of water'],
  ['kind', 'She is a very <u>kind</u> person.', 'nice and caring', 'a type or sort'], ['kind', 'What <u>kind</u> of pizza do you want?', 'a type or sort', 'nice and caring'],
  ['spring', 'Flowers bloom in the <u>spring</u>.', 'the season after winter', 'a coil of metal that bounces'], ['spring', 'The toy has a <u>spring</u> inside.', 'a coil of metal that bounces', 'the season after winter']
];
// related words, weakest → strongest
export const SHADES = [['cool', 'cold', 'freezing'], ['warm', 'hot', 'boiling'], ['whisper', 'talk', 'shout'], ['walk', 'jog', 'sprint'], ['nibble', 'eat', 'gobble'], ['good', 'great', 'amazing'],
  ['sad', 'upset', 'miserable'], ['like', 'love', 'adore'], ['glance', 'look', 'stare'], ['damp', 'wet', 'soaked'], ['big', 'huge', 'enormous'], ['smile', 'grin', 'laugh'], ['tap', 'hit', 'smash'], ['tired', 'sleepy', 'exhausted'], ['small', 'tiny', 'microscopic']];
