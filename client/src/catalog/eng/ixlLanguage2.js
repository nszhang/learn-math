/* English — grammar, mechanics and vocabulary skills added to match IXL Grades 1–12.
   Generated from the word data in langData.js / words.js, plus small hand-written banks. */
import { pairs, classify } from '../quiz.js';
import { ri, pick, shuffle, sample, uniq, big, b, mc } from './words.js';
import {
  NOUNS, wrongPlurals, IRREGULAR, REGULAR, wrongPast, SUBJECTS, PRESENT_VERBS, CONTRACTIONS_PRONOUN, CONTRACTIONS_NOT,
  ADJ_COMPARE, SYNONYMS, ANTONYMS, COMPOUNDS, AFFIX_WORDS, HOMOPHONES, MULTI
} from './langData.js';

const sk = (k, t, s, g, gen) => ({ k, t, s, g, gen });
const G = (a, z) => Array.from({ length: z - a + 1 }, (_, i) => a + i);
const cap = s => s[0].toUpperCase() + s.slice(1);
const u = s => `<u>${s}</u>`;
const fill = (s, a) => s.replace('___', b(a));
// pairs() from [sentence-with-blank, answer, wrongs, note?]
const blanks = (items, lead = 'Complete the sentence.') => pairs({ items: items.map(([s, a, w, n]) => [`${lead}<br><em>${s}</em>`, a, n || fill(s, a), [a, ...w]]) });
// pairs() from [question, answer, wrongs, note]
const qa = items => pairs({ items: items.map(([q, a, w, n]) => [q, a, n, [a, ...w]]) });

/* ---------- Grade 1–2 sentences ---------- */
const STATEMENTS = ['The dog is brown.', 'We go to school.', 'I like apples.', 'The sun is hot.', 'My cat sleeps a lot.', 'Ben has a red bike.'];
const QUESTIONS = ['Where is my hat?', 'Can you swim?', 'What is your name?', 'Do you like pizza?', 'Is it raining?', 'Who ate the cake?'];
const EXCLAIMS = ['Wow, that is huge!', 'I won the race!', 'Look out!', 'What a great day!', 'Ouch, that hurts!', 'Hooray, it snowed!'];
const COMMANDS = ['Close the door.', 'Please sit down.', 'Wash your hands.', 'Pass me the salt.', 'Turn off the light.', 'Feed the fish.'];
const KIND = { statement: STATEMENTS, question: QUESTIONS, exclamation: EXCLAIMS, command: COMMANDS };
const isKind = kind => () => {
  const yes = Math.random() < 0.5;
  const s = yes ? pick(KIND[kind]) : pick(Object.entries(KIND).filter(([k]) => k !== kind).flatMap(([, v]) => v));
  return mc(`Is this sentence a ${kind}?<br><em>${s}</em>`, yes ? 'Yes' : 'No', ['Yes', 'No'], yes ? `Yes — it is a ${kind}.` : `No — it is not a ${kind}.`, 2);
};
const PICTURE_NOUNS = [['🐶', 'dog', 'The ___ wags its tail.'], ['🐟', 'fish', 'A ___ swims in the tank.'], ['🍎', 'apple', 'I ate a red ___.'], ['🚌', 'bus', 'We ride the ___ to school.'],
  ['🎈', 'balloon', 'The ___ floated up high.'], ['📚', 'book', 'Mia reads a ___.'], ['🌳', 'tree', 'A bird sits in the ___.'], ['🍰', 'cake', 'We ate ___ at the party.'], ['⚽', 'ball', 'Kick the ___!'], ['🐸', 'frog', 'The ___ hops into the pond.']];
const ACTION_PICS = [['🏃', 'runs', 'Sam ___ fast.'], ['🏊', 'swims', 'Ana ___ in the pool.'], ['😴', 'sleeps', 'The baby ___ in the crib.'], ['🍽️', 'eats', 'Dad ___ his dinner.'],
  ['📖', 'reads', 'Liam ___ a book.'], ['🎤', 'sings', 'Grandma ___ a song.'], ['🚴', 'rides', 'Mom ___ her bike.'], ['💃', 'dances', 'Zoe ___ to the music.'], ['✍️', 'writes', 'Ken ___ a letter.'], ['🧗', 'climbs', 'Ali ___ the wall.']];
const ACTION_VERBS = [['The baby ___ in her bed.', 'sleeps', ['blue', 'happy', 'table']], ['Tom ___ the ball to me.', 'kicks', ['soft', 'green', 'chair']], ['The bird ___ in the sky.', 'flies', ['tall', 'pencil', 'sweet']],
  ['We ___ our lunch at noon.', 'eat', ['yellow', 'quiet', 'window']], ['Mom ___ a cake.', 'bakes', ['cold', 'shoe', 'fast']], ['The frog ___ over the log.', 'jumps', ['wet', 'grass', 'big']],
  ['Kim ___ a picture.', 'draws', ['pink', 'paper', 'tiny']], ['The kids ___ on the swings.', 'play', ['fun', 'park', 'red']]];

/* ---------- nouns ---------- */
const PROPER = [['Canada', 'country'], ['Toronto', 'city'], ['Monday', 'day'], ['Maria', 'girl'], ['July', 'month'], ['Lake Ontario', 'lake'], ['Dr. Lee', 'doctor'], ['Halloween', 'holiday'], ['Rex', 'dog'], ['Pacific Ocean', 'ocean']];
const POSSESS_PICS = [['🐶🦴', "the dog's bone", ['the dogs bone', 'the bone dog', "the dogs' bones"]], ['👧🎀', "the girl's bow", ['the girls bow', 'the bow girl', "the girl bow's"]],
  ['🐱🧶', "the cat's yarn", ['the cats yarn', 'the yarn cat', "the cat yarn's"]], ['👨‍🍳🍕', "the chef's pizza", ['the chefs pizza', 'the pizza chef', "the chef pizza's"]],
  ['🐦🪺', "the bird's nest", ['the birds nest', 'the nest bird', "the bird nest's"]], ['👑🏰', "the king's castle", ['the kings castle', 'the castle king', "the king castle's"]]];

/* ---------- pronouns ---------- */
const PRONOUN_CHOICE = [['Sam is my friend. ___ likes to play tag.', 'He', ['She', 'They', 'It']], ['Lily has a dog. ___ walks it every day.', 'She', ['He', 'We', 'They']],
  ['The cookies are hot. Don\'t touch ___ yet.', 'them', ['it', 'him', 'her']], ['Dad and I made a fort. ___ worked all day.', 'We', ['They', 'Us', 'I']],
  ['The kite flew high. ___ was red and yellow.', 'It', ['They', 'He', 'She']], ['Ask Mrs. Cho. ___ knows the answer.', 'She', ['He', 'It', 'They']],
  ['My brothers like soccer. ___ play every Saturday.', 'They', ['He', 'We', 'It']], ['Please give the book to ___ — it is mine.', 'me', ['I', 'he', 'they']]];
const POSSESSIVE_CHOICE = [['This is Mia\'s hat. It is ___ hat.', 'her', ['his', 'their', 'its']], ['That bike belongs to Tom. It is ___ bike.', 'his', ['her', 'our', 'my']],
  ['The cat licked ___ paw.', 'its', ['it\'s', 'their', 'his']], ['We cleaned ___ room.', 'our', ['their', 'my', 'its']], ['The twins lost ___ ball.', 'their', ['there', 'his', 'our']],
  ['I brushed ___ teeth.', 'my', ['mine', 'your', 'his']], ['Is this ___ coat, Ben?', 'your', ['you\'re', 'yours', 'mine']]];
const REFLEXIVE = [['Maya taught ___ to knit.', 'herself', ['her', 'she', 'hers']], ['The boys made ___ sandwiches.', 'themselves', ['them', 'they', 'their']],
  ['I can tie my shoes by ___.', 'myself', ['me', 'I', 'mine']], ['Please help ___ to some cookies.', 'yourself', ['you', 'your', 'yours']],
  ['Grandpa gave ___ a pat on the back.', 'himself', ['him', 'he', 'his']], ['Can you pass the bread to ___?', 'me', ['myself', 'I', 'mine']],
  ['Ana smiled at ___ in the mirror.', 'herself', ['her', 'she', 'hers']], ['Mom made dinner for ___ — all five of us.', 'us', ['ourselves', 'we', 'our']]];
const WHO_WHOM = [['The girl ___ won the race is my cousin.', 'who', ['whom'], 'Use who as a subject: she won the race.'], ['The man ___ we met yesterday is a pilot.', 'whom', ['who'], 'Use whom as an object: we met him.'],
  ['To ___ should I give this letter?', 'whom', ['who'], 'After a preposition, use whom.'], ['___ is coming to the party?', 'Who', ['Whom'], 'Who is the subject of the question.'],
  ['The author ___ I admire wrote this book.', 'whom', ['who'], 'Whom is the object of admire.'], ['The students ___ finished early may leave.', 'who', ['whom'], 'Who is the subject of finished.'],
  ['She is the coach ___ everyone respects.', 'whom', ['who'], 'Whom is the object of respects.'], ['___ did you call last night?', 'Whom', ['Who'], 'Whom is the object of call.']];
const ANTECEDENT = [['Maya lost <u>her</u> backpack.', 'Maya', ['backpack', 'lost', 'her']], ['The dogs wagged <u>their</u> tails.', 'dogs', ['tails', 'wagged', 'the']],
  ['When Leo called, <u>he</u> sounded tired.', 'Leo', ['called', 'tired', 'sounded']], ['The school opened <u>its</u> new gym.', 'school', ['gym', 'opened', 'new']],
  ['Ana and Rosa finished <u>their</u> project.', 'Ana and Rosa', ['project', 'finished', 'Rosa only']], ['The tree dropped <u>its</u> leaves in October.', 'tree', ['leaves', 'October', 'dropped']]];
const AGREE = [['Each student must bring ___ own lunch.', 'his or her', ['their', 'its', 'our']], ['The team celebrated ___ victory.', 'its', ['their', 'it\'s', 'his']],
  ['Neither of the girls brought ___ umbrella.', 'her', ['their', 'its', 'our']], ['Both of the boys forgot ___ homework.', 'their', ['his', 'its', 'her']],
  ['The cat licked ___ fur.', 'its', ['their', 'it\'s', 'her']], ['Everyone should do ___ best.', 'his or her', ['their', 'its', 'our']]];
const PN_REVIEW = [['Which sentence is correct?', 'Sam and I went to the game.', ['Sam and me went to the game.', 'Me and Sam went to the game.', 'Sam and myself went to the game.']],
  ['Which sentence is correct?', 'The coach gave Ali and me a ride.', ['The coach gave Ali and I a ride.', 'The coach gave I and Ali a ride.', 'The coach gave Ali and myself a ride.']],
  ['Which sentence is correct?', 'Between you and me, the plan won\'t work.', ['Between you and I, the plan won\'t work.', 'Between I and you, the plan won\'t work.', 'Between yourself and me, the plan won\'t work.']],
  ['Which sentence is correct?', 'She is taller than he.', ['She is taller than him is.', 'Her is taller than he.', 'She is taller than himself.']],
  ['Which sentence is correct?', 'It was they who called.', ['It was them who called.', 'It was their who called.', 'It was themselves who called.']],
  ['Which sentence is correct?', 'We students organized the event.', ['Us students organized the event.', 'Ourselves students organized the event.', 'Our students organized the event ourselves.']]];

/* ---------- verbs ---------- */
const BE_PRESENT = [['I ___ happy today.', 'am', ['is', 'are']], ['The dog ___ hungry.', 'is', ['am', 'are']], ['We ___ in the same class.', 'are', ['is', 'am']], ['They ___ my friends.', 'are', ['is', 'am']], ['She ___ at home.', 'is', ['are', 'am']], ['You ___ very kind.', 'are', ['is', 'am']]];
const BE_PAST = [['I ___ tired last night.', 'was', ['were']], ['The kids ___ at the park.', 'were', ['was']], ['It ___ cold yesterday.', 'was', ['were']], ['We ___ late for school.', 'were', ['was']], ['He ___ in Grade 1 last year.', 'was', ['were']], ['You ___ right!', 'were', ['was']]];
const MODALS = [['You <u>must</u> wear a helmet.', 'Something is required', ['Something is possible', 'Something is allowed', 'Something is a choice']],
  ['It <u>might</u> rain later.', 'Something is possible', ['Something is required', 'Something is allowed', 'Someone is able']],
  ['You <u>may</u> leave early today.', 'Something is allowed', ['Something is required', 'Something is impossible', 'Someone is unable']],
  ['Birds <u>can</u> fly.', 'Someone is able', ['Something is required', 'Something is allowed', 'Something is unlikely']],
  ['You <u>should</u> drink more water.', 'Something is a good idea', ['Something is required', 'Something is impossible', 'Someone is unable']],
  ['We <u>could</u> go to the beach.', 'Something is possible', ['Something is required', 'Something is forbidden', 'Someone is unable']]];
const SV_COMPOUND = [['Tom and Ana ___ to school.', 'walk', ['walks'], 'Two subjects joined by and are plural.'], ['Either the cat or the dog ___ the food.', 'eats', ['eat'], 'With or/nor, the verb agrees with the closer subject (dog).'],
  ['Neither the boys nor their sister ___ the answer.', 'knows', ['know'], 'The closer subject, sister, is singular.'], ['My mom and dad ___ pancakes on Sunday.', 'make', ['makes'], 'And makes the subject plural.'],
  ['Either my sisters or my brother ___ me home.', 'drives', ['drive'], 'The closer subject, brother, is singular.'], ['Neither the teacher nor the students ___ ready.', 'are', ['is'], 'The closer subject, students, is plural.']];
const PROGRESSIVE_USE = [['Right now, we ___ dinner.', 'are eating', ['ate', 'will eat', 'eat']], ['At 8 p.m. last night, I ___ a movie.', 'was watching', ['watch', 'am watching', 'will watch']],
  ['This time tomorrow, they ___ to Paris.', 'will be flying', ['flew', 'are flying', 'fly']], ['Shh! The baby ___.', 'is sleeping', ['slept', 'sleeps', 'will sleep']],
  ['When the phone rang, she ___ a shower.', 'was taking', ['takes', 'is taking', 'will take']], ['Next week, we ___ at the cabin.', 'will be staying', ['stayed', 'were staying', 'stay']]];
const PERFECT_USE = [['I ___ my homework already.', 'have finished', ['finish', 'will have finished', 'finishing']], ['By the time we arrived, the movie ___.', 'had started', ['starts', 'has started', 'will start']],
  ['By June, she ___ the whole book.', 'will have read', ['reads', 'had read', 'has read']], ['They ___ in Halifax since 2015.', 'have lived', ['live', 'will have lived', 'had lived']],
  ['He ___ the cake before the guests came.', 'had baked', ['bakes', 'has baked', 'will have baked']], ['We ___ to Japan twice.', 'have been', ['are', 'had been', 'will have been']]];
const SIMPLE_TENSES = [['Yesterday, I ___ to the store. (walk)', 'walked', ['walk', 'will walk']], ['Tomorrow, we ___ pizza. (eat)', 'will eat', ['ate', 'eat']],
  ['Every day, she ___ the bus. (take)', 'takes', ['took', 'will take']], ['Last week, they ___ a movie. (see)', 'saw', ['see', 'will see']],
  ['Next year, I ___ Grade 6. (start)', 'will start', ['started', 'start']], ['Right now, he ___ in Grade 5. (be)', 'is', ['was', 'will be']]];
const TIMELINE = [['Yesterday I played soccer.', 'Past'], ['Tomorrow I will play soccer.', 'Future'], ['I play soccer now.', 'Present'], ['Last night we baked bread.', 'Past'],
  ['Next week we will visit Grandma.', 'Future'], ['Today she reads a book.', 'Present'], ['He walked the dog this morning.', 'Past'], ['We will swim later.', 'Future']];
const TIMELINE_IRR = [['Yesterday I ran to school.', 'Past'], ['Tomorrow I will run to school.', 'Future'], ['I run to school every day.', 'Present'], ['Last week we ate tacos.', 'Past'],
  ['We eat tacos on Fridays.', 'Present'], ['Next week we will eat tacos.', 'Future'], ['She sang in the choir last year.', 'Past'], ['She will sing tomorrow.', 'Future']];
const ED_ING = [['🏊', 'He is swimming in the pool.', 'He swam in the pool yesterday.'], ['🎨', 'She is painting a picture.', 'She painted a picture last week.'],
  ['🍳', 'Dad is cooking eggs.', 'Dad cooked eggs this morning.'], ['🧹', 'Mia is sweeping the floor.', 'Mia swept the floor yesterday.'], ['⚽', 'They are kicking the ball.', 'They kicked the ball an hour ago.']];

/* ---------- adjectives, adverbs, prepositions, conjunctions ---------- */
const SENSE = [['The music is loud.', 'hearing'], ['The lemon tastes sour.', 'taste'], ['The kitten feels soft.', 'touch'], ['The flowers smell sweet.', 'smell'], ['The sky looks blue.', 'sight'],
  ['The ice is cold.', 'touch'], ['The bell rings loudly.', 'hearing'], ['The cookies smell yummy.', 'smell'], ['The candy is sweet.', 'taste'], ['The sun looks bright.', 'sight']];
const COMPARE_PICS = [['🐘', '🐭', 'The elephant is ___ than the mouse.', 'bigger', ['big', 'biggest']], ['🐢', '🐇', 'The rabbit is ___ than the turtle.', 'faster', ['fast', 'fastest']],
  ['🦒', '🐕', 'The giraffe is ___ than the dog.', 'taller', ['tall', 'tallest']], ['🔥', '🧊', 'The fire is ___ than the ice.', 'hotter', ['hot', 'hottest']],
  ['🐜', '🐈', 'The ant is ___ than the cat.', 'smaller', ['small', 'smallest']]];
const ADJ_TWO = [['This box is <u>bigger</u> than that one.', 'Two'], ['She is the <u>tallest</u> girl in class.', 'More than two'], ['My dog is <u>faster</u> than yours.', 'Two'],
  ['That was the <u>funniest</u> movie of all.', 'More than two'], ['Today is <u>colder</u> than yesterday.', 'Two'], ['This is the <u>smallest</u> of the three cups.', 'More than two']];
const ADJ_ORDER = [['She wore a ___ dress.', 'beautiful long red', ['red long beautiful', 'long red beautiful', 'red beautiful long']], ['We saw a ___ dog.', 'big brown', ['brown big', 'big, brown, and', 'brownly big']],
  ['He bought ___ apples.', 'three fresh green', ['green fresh three', 'fresh three green', 'three green fresh']], ['I found an ___ box.', 'old wooden', ['wooden old', 'old and wooden and', 'wooden, old']],
  ['They live in a ___ house.', 'lovely little white', ['white little lovely', 'little lovely white', 'white lovely little']], ['It was a ___ day.', 'cold windy', ['windy cold', 'cold, and windy,', 'windily cold']]];
const RELATIVE_ADV = [['That is the house ___ I grew up.', 'where', ['when', 'why']], ['I remember the day ___ we met.', 'when', ['where', 'why']], ['Do you know the reason ___ she left?', 'why', ['when', 'where']],
  ['Summer is the season ___ we swim.', 'when', ['where', 'why']], ['This is the park ___ we play.', 'where', ['why', 'when']], ['Tell me the reason ___ you are late.', 'why', ['where', 'when']]];
const MORE_MOST = [['This is the ___ painting in the museum.', 'most beautiful', ['beautifulest', 'more beautiful', 'beautifuler']], ['Math is ___ than art for me.', 'more difficult', ['difficulter', 'most difficult', 'more difficulter']],
  ['She is the ___ driver I know.', 'most careful', ['carefullest', 'more careful', 'most carefuller']], ['This book is ___ than that one.', 'more interesting', ['interestinger', 'most interesting', 'more interestinger']],
  ['That was the ___ meal ever!', 'most delicious', ['deliciousest', 'more delicious', 'deliciouser']]];
const PREP_PICS = [['🐱⬆️📦', 'The cat is ___ the box.', 'on', ['under', 'in', 'behind']], ['🐶⬇️🛏️', 'The dog is ___ the bed.', 'under', ['on', 'above', 'in']], ['🐟🫙', 'The fish is ___ the jar.', 'in', ['on', 'under', 'beside']],
  ['🐦☁️', 'The bird flies ___ the clouds.', 'above', ['under', 'in', 'beside']], ['🧸➡️🛋️', 'The bear is ___ the sofa.', 'beside', ['on', 'above', 'under']]];
const PREP_OBJ = [['The cat hid <u>under the bed</u>.', 'bed', ['cat', 'under', 'hid']], ['We walked <u>across the bridge</u>.', 'bridge', ['walked', 'across', 'we']],
  ['She sat <u>beside her brother</u>.', 'brother', ['sat', 'beside', 'she']], ['The book is <u>on the shelf</u>.', 'shelf', ['book', 'on', 'is']],
  ['He swam <u>in the lake</u>.', 'lake', ['swam', 'in', 'he']], ['They played <u>after school</u>.', 'school', ['played', 'after', 'they']]];
const PREP_WORDS = [['The bird flew <u>over</u> the house.', 'Preposition'], ['The bird flew <u>away</u>.', 'Not a preposition'], ['We ate lunch <u>before</u> the game.', 'Preposition'],
  ['She <u>quickly</u> ran home.', 'Not a preposition'], ['The ball rolled <u>under</u> the car.', 'Preposition'], ['He is <u>happy</u> today.', 'Not a preposition'], ['I walked <u>through</u> the park.', 'Preposition']];
const COORD = [['I like apples, <u>but</u> I don\'t like pears.', 'Yes'], ['We stayed inside <u>because</u> it rained.', 'No'], ['She can sing, <u>and</u> she can dance.', 'Yes'],
  ['You can have juice <u>or</u> milk.', 'Yes'], ['<u>Although</u> it was late, we kept reading.', 'No'], ['He was tired, <u>so</u> he went to bed.', 'Yes'], ['We waited <u>until</u> the bus came.', 'No']];
const CORR = [['___ Ana nor Ben was late.', 'Neither', ['Either', 'Both', 'Not only']], ['You can ___ walk or take the bus.', 'either', ['neither', 'both', 'whether']],
  ['___ the cat and the dog are asleep.', 'Both', ['Either', 'Neither', 'Whether']], ['She is not only smart ___ kind.', 'but also', ['or', 'nor', 'and also not']],
  ['I can\'t decide ___ to read or to draw.', 'whether', ['either', 'neither', 'both']], ['___ he studies or he fails.', 'Either', ['Neither', 'Both', 'Not only']]];

/* ---------- vocabulary ---------- */
const CONTEXT_EASY = [['The puppy was so <u>tiny</u> that it fit in my hand.', 'very small', ['very loud', 'very old', 'very fast']], ['I was <u>thirsty</u>, so I drank a glass of water.', 'needing a drink', ['sleepy', 'happy', 'cold']],
  ['The cake smelled <u>delicious</u>, and we ate it all.', 'very tasty', ['very hot', 'very old', 'very big']], ['The kitten was <u>frightened</u> and hid under the bed.', 'scared', ['hungry', 'silly', 'tall']],
  ['It was so <u>chilly</u> that I wore a coat and mittens.', 'cold', ['sunny', 'wet', 'loud']], ['Dad was <u>exhausted</u> after the long hike and fell asleep.', 'very tired', ['very fast', 'very happy', 'very hungry']]];
const SYN_CONTEXT = [['The <u>enormous</u> whale was bigger than the boat.', 'huge', ['tiny', 'quiet', 'quick']], ['She was <u>glad</u> that her friend came to visit.', 'happy', ['angry', 'tired', 'afraid']],
  ['The thief <u>grabbed</u> the bag and ran.', 'snatched', ['dropped', 'opened', 'carried']], ['Please <u>shut</u> the window; it\'s cold.', 'close', ['open', 'clean', 'break']],
  ['The test was <u>simple</u>, so everyone finished early.', 'easy', ['hard', 'long', 'boring']], ['The <u>clever</u> fox found a way across the river.', 'smart', ['slow', 'sleepy', 'silly']]];
const ANT_CONTEXT = [['The soup was hot, but the salad was <u>cold</u>.', 'hot', ['fresh', 'tasty', 'green']], ['The first hill was steep; the second was <u>gentle</u>.', 'steep', ['tall', 'grassy', 'rocky']],
  ['Ali is shy, but his sister is <u>outgoing</u>.', 'shy', ['tall', 'kind', 'funny']], ['The old bridge was weak, but the new one is <u>sturdy</u>.', 'weak', ['long', 'new', 'wide']],
  ['Some days are calm; others are <u>stormy</u>.', 'calm', ['sunny', 'short', 'cool']], ['He arrived early, but she was <u>late</u>.', 'early', ['tired', 'happy', 'ready']]];
const SAME_MEANING = [['The cat is <u>tiny</u>.', 'The cat is small.', ['The cat is huge.', 'The cat is loud.', 'The cat is fast.']], ['Mom is <u>glad</u> to see us.', 'Mom is happy to see us.', ['Mom is sad to see us.', 'Mom is angry to see us.', 'Mom is sleepy to see us.']],
  ['Please <u>shut</u> the door.', 'Please close the door.', ['Please open the door.', 'Please paint the door.', 'Please knock on the door.']], ['The race will <u>begin</u> soon.', 'The race will start soon.', ['The race will end soon.', 'The race will stop soon.', 'The race will be cancelled.']]];
const IDIOM_PICS = [['It\'s raining cats and dogs.', '🌧️🌧️ (It is raining very hard.)', ['🐱🐶 (Pets are falling.)', '☀️ (It is sunny.)', '❄️ (It is snowing.)']],
  ['She has a frog in her throat.', '🗣️😣 (Her voice is hoarse.)', ['🐸 (She ate a frog.)', '😄 (She is laughing.)', '🎤 (She is singing well.)']],
  ['He has butterflies in his stomach.', '😬 (He feels nervous.)', ['🦋 (He ate butterflies.)', '😴 (He is sleepy.)', '🤢 (He is sick.)']],
  ['It\'s a piece of cake.', '👍 (It is very easy.)', ['🍰 (It is dessert.)', '😓 (It is very hard.)', '🎂 (It is a birthday.)']],
  ['Hold your horses!', '✋ (Wait and be patient.)', ['🐎 (Ride a horse.)', '🏃 (Hurry up!)', '🧲 (Hold on tight.)']]];
const IDIOMS2 = [['Break the ice', 'start a conversation in an awkward situation', ['break something frozen', 'make a mistake', 'stop talking']], ['Hit the books', 'study hard', ['punch a book', 'throw books away', 'read for fun']],
  ['Cost an arm and a leg', 'be very expensive', ['cause an injury', 'be free', 'be cheap']], ['Under the weather', 'feeling sick', ['standing outside', 'very happy', 'in a storm']],
  ['Spill the beans', 'tell a secret', ['make a mess', 'cook dinner', 'tell a lie']], ['Once in a blue moon', 'very rarely', ['every night', 'at midnight', 'during a full moon']],
  ['The early bird catches the worm', 'people who act early succeed', ['birds eat worms', 'wake up late', 'be patient']], ['Actions speak louder than words', 'what you do matters more than what you say', ['shout to be heard', 'talk a lot', 'be quiet']]];
const IDIOM_CONTEXT = [['I was nervous on my first day, so the teacher told a joke to <u>break the ice</u>.', 'make people feel more relaxed', ['crack the frozen pond', 'start a fight', 'end the class']],
  ['Ben has a test tomorrow, so he needs to <u>hit the books</u> tonight.', 'study hard', ['throw his books', 'go to the library to play', 'sleep early']],
  ['That new phone <u>costs an arm and a leg</u>.', 'is very expensive', ['is broken', 'is free', 'is easy to use']], ['Maya stayed home because she felt <u>under the weather</u>.', 'sick', ['happy', 'busy', 'cold']],
  ['Don\'t <u>spill the beans</u> about the surprise party!', 'tell the secret', ['drop the food', 'be late', 'forget']], ['We only see my uncle <u>once in a blue moon</u>.', 'very rarely', ['every week', 'at night', 'in summer']]];
const IDIOM_CONTEXT2 = [['After failing twice, she decided to <u>throw in the towel</u>.', 'give up', ['do laundry', 'try harder', 'go swimming']], ['The answer was <u>on the tip of my tongue</u>.', 'almost remembered', ['tasty', 'hurt', 'forgotten forever']],
  ['Let\'s <u>call it a day</u> and finish tomorrow.', 'stop working for now', ['make a phone call', 'name the day', 'work all night']], ['Winning the trip was <u>a dream come true</u>.', 'something wished for that happened', ['a nightmare', 'a sleepy feeling', 'a mistake']],
  ['He <u>let the cat out of the bag</u> about the gift.', 'revealed the secret', ['freed a pet', 'lost the gift', 'wrapped the gift']], ['You\'re <u>pulling my leg</u>!', 'joking with me', ['hurting me', 'helping me walk', 'ignoring me']]];
const DICTIONARY = [
  ['<strong>bank</strong> (noun) 1. land along the side of a river 2. a place that keeps money', 'We had a picnic on the <u>bank</u> of the river.', 'Definition 1', ['Definition 2']],
  ['<strong>bank</strong> (noun) 1. land along the side of a river 2. a place that keeps money', 'Mom put her paycheque in the <u>bank</u>.', 'Definition 2', ['Definition 1']],
  ['<strong>pitch</strong> 1. (verb) to throw a ball 2. (noun) how high or low a sound is', 'The singer hit a very high <u>pitch</u>.', 'Definition 2', ['Definition 1']],
  ['<strong>pitch</strong> 1. (verb) to throw a ball 2. (noun) how high or low a sound is', 'Can you <u>pitch</u> the ball to me?', 'Definition 1', ['Definition 2']],
  ['<strong>scale</strong> (noun) 1. a tool for weighing 2. a thin plate covering a fish', 'The fish shed a shiny <u>scale</u>.', 'Definition 2', ['Definition 1']],
  ['<strong>scale</strong> (noun) 1. a tool for weighing 2. a thin plate covering a fish', 'Put the apples on the <u>scale</u>.', 'Definition 1', ['Definition 2']],
  ['<strong>file</strong> 1. (noun) a folder for papers 2. (verb) to walk in a line', 'The students <u>file</u> into the gym.', 'Definition 2', ['Definition 1']]];
const THESAURUS = [['<strong>walk</strong>: stroll, march, stride, tiptoe', 'The soldiers ___ in a straight line.', 'marched', ['strolled', 'tiptoed', 'strode']],
  ['<strong>walk</strong>: stroll, march, stride, tiptoe', 'We ___ past the sleeping baby.', 'tiptoed', ['marched', 'strode', 'strolled']],
  ['<strong>say</strong>: whisper, shout, mumble, announce', 'The principal will ___ the winners at the assembly.', 'announce', ['whisper', 'mumble', 'shout']],
  ['<strong>say</strong>: whisper, shout, mumble, announce', 'Please ___ so you don\'t wake the baby.', 'whisper', ['shout', 'announce', 'mumble']],
  ['<strong>happy</strong>: content, thrilled, cheerful, relieved', 'She was ___ that the test was finally over.', 'relieved', ['thrilled', 'cheerful', 'content']],
  ['<strong>happy</strong>: content, thrilled, cheerful, relieved', 'He was ___ to win the championship!', 'thrilled', ['content', 'relieved', 'cheerful']]];
const DOMAIN_PICS = [['🧲', 'magnet', 'an object that attracts iron', ['a tool for measuring', 'a kind of battery', 'a type of rock']], ['🌋', 'volcano', 'a mountain that can erupt lava', ['a deep ocean trench', 'a desert storm', 'a frozen river']],
  ['🔭', 'telescope', 'a tool for seeing faraway objects', ['a tool for seeing tiny things', 'a weather tool', 'a sound recorder']], ['🧭', 'compass', 'a tool that shows direction', ['a tool for weighing', 'a clock', 'a ruler']],
  ['🦴', 'skeleton', 'the frame of bones in a body', ['a type of muscle', 'a body organ', 'a blood vessel']], ['🌡️', 'thermometer', 'a tool that measures temperature', ['a tool that measures distance', 'a tool that measures weight', 'a tool that tells time']],
  ['🧫', 'bacteria', 'tiny living things seen with a microscope', ['large animals', 'kinds of rocks', 'types of weather']], ['⚖️', 'balance', 'a tool for comparing weights', ['a tool for measuring length', 'a tool for heating', 'a map']]];
const FIND_WORD = [['A <u>___</u> is a person who writes books.', 'author', ['actor', 'artist', 'athlete']], ['We use a <u>___</u> to look at tiny cells.', 'microscope', ['telescope', 'periscope', 'stethoscope']],
  ['The <u>___</u> of the story is where it takes place.', 'setting', ['plot', 'theme', 'character']], ['A baby frog is called a <u>___</u>.', 'tadpole', ['cub', 'kitten', 'calf']],
  ['The doctor listened to my heart with a <u>___</u>.', 'stethoscope', ['microscope', 'telescope', 'thermometer']], ['Water turning into vapour is called <u>___</u>.', 'evaporation', ['condensation', 'precipitation', 'erosion']]];
const ROOTS2 = [['spectator, inspect, spectacles', 'spect', 'look', ['carry', 'write', 'hear']], ['transport, portable, export', 'port', 'carry', ['look', 'break', 'build']],
  ['autograph, paragraph, graphic', 'graph', 'write', ['see', 'carry', 'measure']], ['audience, audible, audio', 'aud', 'hear', ['see', 'speak', 'move']],
  ['dictate, predict, dictionary', 'dict', 'say', ['write', 'hear', 'pull']], ['construct, structure, instruct', 'struct', 'build', ['break', 'look', 'say']],
  ['telephone, symphony, phonics', 'phon', 'sound', ['light', 'water', 'earth']], ['biology, biography, antibiotic', 'bio', 'life', ['water', 'earth', 'star']],
  ['rupture, erupt, interrupt', 'rupt', 'break', ['build', 'carry', 'see']], ['tractor, attract, subtract', 'tract', 'pull', ['push', 'write', 'look']]];
const WORDS_WITH = (affix, items) => qa(items.map(([w, m, wrong]) => [`What does the word ${b(w)} mean?`, m, wrong, `${b(affix)} ${affix.endsWith('-') ? 'at the start' : 'at the end'} helps: ${b(w)} means ${m}.`]));
const CONFUSED_ERR = [['Which sentence uses the correct word?', 'The rain had a big effect on the game.', ['The rain had a big affect on the game.', 'The rain had a big effeck on the game.', 'The rain had a big afect on the game.'], 'Effect is usually a noun (a result); affect is usually a verb.'],
  ['Which sentence uses the correct word?', 'I would rather eat pasta than pizza.', ['I would rather eat pasta then pizza.', 'I would rather eat pasta thon pizza.', 'I would rather eat pasta that pizza.'], 'Than compares; then tells when.'],
  ['Which sentence uses the correct word?', 'Please lie down and rest.', ['Please lay down and rest.', 'Please lays down and rest.', 'Please laid down and rest.'], 'Lie means to recline; lay means to put something down.'],
  ['Which sentence uses the correct word?', 'We have fewer apples than last week.', ['We have less apples than last week.', 'We have lesser apples than last week.', 'We have fewest apples than last week.'], 'Use fewer for things you can count.'],
  ['Which sentence uses the correct word?', 'The principal spoke to the whole school.', ['The principle spoke to the whole school.', 'The principel spoke to the whole school.', 'The principall spoke to the whole school.'], 'Principal is the head of a school; principle is a rule or belief.'],
  ['Which sentence uses the correct word?', 'Her quiet manner complemented his energy.', ['Her quiet manner complimented his energy.', 'Her quiet manner complementted his energy.', 'Her quiet manner compliment his energy.'], 'Complement means to complete; compliment means to praise.'],
  ['Which sentence uses the correct word?', 'From the clues, I inferred that the butler did it.', ['From the clues, I implied that the butler did it.', 'From the clues, I infered that the butler did it.', 'From the clues, I imply that the butler did it.'], 'The reader infers; the speaker implies.'],
  ['Which sentence uses the correct word?', 'Please ensure that the door is locked.', ['Please insure that the door is locked.', 'Please ensurre that the door is locked.', 'Please assure that the door is locked.'], 'Ensure means to make certain.']];
const SIGNS = [['🏪 Sign: "Apple\'s for sale — 3 for $1"', 'Apples for sale — 3 for $1', ['Apple\'s for sale — 3 for $1', 'Apples\' for sale — 3 for $1', 'Apple for sales — 3 for $1'], 'Plural nouns do not need an apostrophe.'],
  ['🚧 Sign: "Your welcome to park here after 6 p.m."', 'You\'re welcome to park here after 6 p.m.', ['Your welcome to park here after 6 p.m.', 'Youre welcome to park here after 6 p.m.', 'You welcome to park here after 6 p.m.'], 'You\'re = you are.'],
  ['🐕 Sign: "Please keep you\'re dog on a leash."', 'Please keep your dog on a leash.', ['Please keep you\'re dog on a leash.', 'Please keep yours dog on a leash.', 'Please keep youre dog on a leash.'], 'Your shows ownership.'],
  ['🛒 Sign: "10 items or less"', '10 items or fewer', ['10 items or less', '10 item or less', '10 items or lesser'], 'Use fewer for things you can count.'],
  ['🍕 Sign: "Its the best pizza in town!"', 'It\'s the best pizza in town!', ['Its the best pizza in town!', 'Its\' the best pizza in town!', 'It the best pizza in town!'], 'It\'s = it is.'],
  ['🏊 Sign: "No diving aloud."', 'No diving allowed.', ['No diving aloud.', 'No diving alowed.', 'No diving a loud.'], 'Allowed means permitted; aloud means out loud.']];
const PARALLEL_USE = [['She likes hiking, swimming and ___.', 'biking', ['to bike', 'she bikes', 'bike rides are fun']], ['The coach told us to stretch, to drink water and ___.', 'to rest', ['resting', 'we should rest', 'rested']],
  ['The job requires patience, skill and ___.', 'creativity', ['being creative', 'to create', 'creatively']], ['He was tired, hungry and ___.', 'cold', ['feeling cold', 'he was cold', 'to be cold']],
  ['We can travel by car, by train or ___.', 'by bus', ['bus', 'taking the bus', 'to ride a bus']], ['Reading improves vocabulary, builds focus and ___.', 'sparks imagination', ['imagination', 'to spark imagination', 'it sparks imagination']]];
const ACTIVE = [['The ball was thrown by Ana.', 'Ana threw the ball.', ['Ana was thrown by the ball.', 'The ball threw Ana.', 'Thrown was the ball by Ana.']],
  ['The cake was eaten by the children.', 'The children ate the cake.', ['The cake ate the children.', 'The children were eaten by the cake.', 'Eaten was the cake by the children.']],
  ['The letter was written by Grandpa.', 'Grandpa wrote the letter.', ['The letter wrote Grandpa.', 'Grandpa was written by the letter.', 'Written was the letter by Grandpa.']],
  ['The window was broken by the storm.', 'The storm broke the window.', ['The window broke the storm.', 'The storm was broken by the window.', 'Broke the window, the storm did.']],
  ['The project will be presented by our team.', 'Our team will present the project.', ['The project will present our team.', 'Our team will be presented by the project.', 'Presented the project our team will.']],
  ['The award was given to Mia by the principal.', 'The principal gave the award to Mia.', ['Mia gave the award to the principal.', 'The award gave the principal to Mia.', 'The principal was given the award by Mia.']]];
const HEADLINES = [['Which headline is the most neutral (least biased)?', 'City Council Votes 6–3 to Build New Park', ['Greedy Council Wastes Money on Useless Park', 'Heroic Council Finally Gives Kids a Park!', 'Shocking Park Plan Will Ruin Our City']],
  ['Which headline is the most neutral?', 'School Board Approves Later Start Time', ['School Board Caves to Lazy Teens', 'Brilliant Board Saves Students\' Sleep', 'Disastrous Decision Shakes Families']],
  ['Which headline shows bias against the subject?', 'Clueless Mayor Botches Snow Clean-up Again', ['Mayor Announces New Snow Clean-up Plan', 'Snow Clean-up Delayed by Equipment Problems', 'City Reviews Snow Clean-up After Storm']],
  ['Which headline uses loaded language?', 'Reckless Teens Take Over Mall', ['Teens Gather at Mall on Saturday', 'Mall Extends Weekend Hours', 'Mall Reports Busy Weekend']]];
const WORKS_PARTS = [['In this entry, what is <u>Science Weekly</u>? <br>Smith, Alex. "Ocean Plastics." <em>Science Weekly</em>, vol. 12, no. 3, 2021, pp. 14–19.', 'The container (the publication)', ['The author', 'The title of the article', 'The publisher\'s city']],
  ['In this entry, what is <u>"Ocean Plastics"</u>? <br>Smith, Alex. "Ocean Plastics." <em>Science Weekly</em>, vol. 12, no. 3, 2021, pp. 14–19.', 'The title of the source', ['The container', 'The author', 'The volume']],
  ['In this entry, what does <u>pp. 14–19</u> show? <br>Smith, Alex. "Ocean Plastics." <em>Science Weekly</em>, vol. 12, no. 3, 2021, pp. 14–19.', 'The page numbers', ['The date', 'The issue number', 'The edition']],
  ['In this entry, what is <u>Penguin</u>? <br>Lee, Jordan. <em>The Quiet Coast</em>. Penguin, 2019.', 'The publisher', ['The author', 'The title', 'The container']],
  ['In this entry, what is <u>2019</u>? <br>Lee, Jordan. <em>The Quiet Coast</em>. Penguin, 2019.', 'The publication date', ['The page count', 'The edition', 'The volume']]];
const PERSONIFY = [['Which sentence uses personification?', 'The wind whispered through the trees.', ['The wind was strong.', 'The wind blew at 50 km/h.', 'It was a windy day.']],
  ['Which sentence uses personification?', 'The old car groaned up the hill.', ['The old car was slow.', 'The car drove up the hill.', 'The car was red.']],
  ['Which sentence uses personification?', 'The sun smiled down on the picnic.', ['The sun was bright.', 'It was sunny at the picnic.', 'The picnic was in the sun.']],
  ['Which sentence uses personification?', 'My alarm clock screamed at 6 a.m.', ['My alarm clock rang at 6 a.m.', 'My alarm clock is loud.', 'I woke up at 6 a.m.']],
  ['Which sentence uses personification?', 'The flowers danced in the breeze.', ['The flowers moved in the breeze.', 'The flowers were pink.', 'There was a breeze.']]];
const EMOTIONS = [['Which sentence best shows that Ella is nervous?', 'Ella bit her nails and kept checking the clock.', ['Ella was nervous.', 'Ella went to school.', 'Ella had a test.']],
  ['Which sentence best shows that Max is proud?', 'Max held up his trophy and grinned at everyone.', ['Max was proud.', 'Max won a trophy.', 'Max went home.']],
  ['Which sentence best shows that Lin is angry?', 'Lin slammed the door and stomped up the stairs.', ['Lin was angry.', 'Lin went upstairs.', 'Lin closed the door.']],
  ['Which sentence best shows that the boy is kind?', 'The boy shared his umbrella with a stranger in the rain.', ['The boy was kind.', 'It was raining.', 'The boy had an umbrella.']],
  ['Which sentence best shows that Mom is tired?', 'Mom yawned and rubbed her eyes as she sank into the couch.', ['Mom was tired.', 'Mom sat on the couch.', 'Mom came home.']]];
const MISPLACED_PICS = [['Which sentence is correct?', '🐕 Wagging its tail, the dog greeted us.', ['🐕 Wagging its tail, we were greeted by the dog.', '🐕 We were greeted, wagging its tail, by the dog.', '🐕 The dog greeted us wagging our tails.'], 'The dog — not "we" — is wagging its tail.'],
  ['Which sentence is correct?', '🍕 I ate the pizza that was covered in cheese.', ['🍕 I ate the pizza covered in cheese myself.', '🍕 Covered in cheese, I ate the pizza.', '🍕 I, covered in cheese, ate the pizza.'], 'The pizza, not the speaker, is covered in cheese.'],
  ['Which sentence is correct?', '🚌 While waiting for the bus, I read a book.', ['🚌 While waiting for the bus, my book was read.', '🚌 My book, while waiting for the bus, was read.', '🚌 Waiting for the bus, the book was read by me.'], 'The person waiting must be the subject.'],
  ['Which sentence is correct?', '🐟 We saw a fish swimming in the tank.', ['🐟 Swimming in the tank, we saw a fish.', '🐟 We, swimming in the tank, saw a fish.', '🐟 Swimming, the tank had a fish we saw.'], 'The fish, not "we", is swimming.']];

export const LANGUAGE2_SPECS = [
  /* ---------- Grade 1 vocabulary ---------- */
  sk('XNnPc', 'Complete the sentence with a noun to match the picture', 'Nouns and adjectives', [1], pairs({ items: PICTURE_NOUNS.map(([e, n, s]) => [`${big(e)}<br>${s}`, n, fill(s, n), [n, ...sample(PICTURE_NOUNS.map(x => x[1]).filter(x => x !== n), 3)]]) })),
  sk('XAdPc', 'Compare pictures using adjectives', 'Nouns and adjectives', [1], pairs({ items: COMPARE_PICS.map(([a, c, s, ans, w]) => [`${big(a + ' ' + c)}<br>${s}`, ans, fill(s, ans), [ans, ...w]]) })),
  sk('XNumW', 'Use number words', 'Nouns and adjectives', [1], () => {
    const n = ri(1, 10), names = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'], e = pick(['🍎', '⭐', '🐟', '🎈', '🌸']);
    return mc(`${big(e.repeat(n))}<br>How many are there?`, names[n - 1], sample(names.filter((_, i) => i !== n - 1), 3), `There are ${b(names[n - 1])}.`);
  }),
  sk('XMmPc', 'Multiple-meaning words with pictures', 'Multiple-meaning words', [1, 2], pairs({ items: [
    ['The <u>bat</u> flew out of the cave.', '🦇', null, ['🦇', '🏏']], ['He swung the <u>bat</u> at the ball.', '🏏', null, ['🏏', '🦇']], ['She wore a gold <u>ring</u>.', '💍', null, ['💍', '🔔']],
    ['A <u>fly</u> landed on the cake.', '🪰', null, ['🪰', '✈️']], ['I wear a <u>watch</u> on my wrist.', '⌚', null, ['⌚', '👀']], ['The tree has rough <u>bark</u>.', '🌳', null, ['🌳', '🐕']],
    ['The dog let out a loud <u>bark</u>.', '🐕', null, ['🐕', '🌳']], ['A big <u>wave</u> hit the beach.', '🌊', null, ['🌊', '👋']]].map(([s, a, , w]) => [`Which picture matches the underlined word?<br>${s}`, a, `The word means ${a} here.`, w]) })),
  sk('XAfUs', 'Use words with prefixes and suffixes', 'Prefixes and suffixes', [1], blanks([['I have to ___ my messy drawing. (draw again)', 'redraw', ['undraw', 'drawful', 'drawless']],
    ['Be ___ with the glass vase. (full of care)', 'careful', ['careless', 'recare', 'uncare']], ['The broken toy made Sam ___. (not happy)', 'unhappy', ['happyful', 'rehappy', 'happyless']],
    ['Please ___ the box. (opposite of tie)', 'untie', ['retie', 'tieful', 'tieless']], ['The ___ helped us with our homework. (one who teaches)', 'teacher', ['teachful', 'reteach', 'unteach']]])),
  sk('XAfUn', 'Understand words with prefixes and suffixes', 'Prefixes and suffixes', [1], qa([['What does <strong>unhappy</strong> mean?', 'not happy', ['very happy', 'happy again', 'full of happy'], 'Un- means not.'],
    ['What does <strong>replay</strong> mean?', 'play again', ['not play', 'play before', 'one who plays'], 'Re- means again.'], ['What does <strong>helpful</strong> mean?', 'full of help', ['without help', 'help again', 'not help'], '-ful means full of.'],
    ['What does <strong>painter</strong> mean?', 'a person who paints', ['paint again', 'not paint', 'full of paint'], '-er can mean a person who does something.'], ['What does <strong>unlock</strong> mean?', 'the opposite of lock', ['lock again', 'full of locks', 'a person who locks'], 'Un- can mean the opposite of.']])),
  sk('XCxEz', 'Use context to identify the meaning of a word', 'Context clues', [1, 2], qa(CONTEXT_EASY.map(([s, a, w]) => [`What does the underlined word mean?<br><em>${s}</em>`, a, w, `The other words in the sentence are clues: it means ${b(a)}.`]))),
  sk('XAbcL', 'Put the letters in ABC order', 'Reference skills', [1], () => {
    const start = ri(0, 21), letters = Array.from({ length: 3 }, (_, i) => String.fromCharCode(97 + start + i * ri(1, 2))).filter(c => c <= 'z');
    const right = letters.join(', '), wrong = uniq([shuffle(letters).join(', '), [...letters].reverse().join(', '), shuffle(letters).join(', '), [letters[1], letters[0], letters[2]].join(', ')]).filter(x => x !== right);
    return mc('Which letters are in ABC order?', right, wrong.length ? wrong : ['c, b, a'], `${b(right)} follows the alphabet.`);
  }),
  /* ---------- Grade 1 sentences ---------- */
  sk('XIdSt', 'Identify statements', 'Sentences', [1], isKind('statement')),
  sk('XIdQu', 'Identify questions', 'Sentences', [1], isKind('question')),
  sk('XIdEx', 'Identify exclamations', 'Sentences', [1], isKind('exclamation')),
  sk('XIdCm', 'Identify commands', 'Sentences', [1], isKind('command')),
  sk('XWh5', 'Who, what, when, where or why?', 'Sentences', [1], qa([['Which question word asks about a person?', 'Who', ['What', 'When', 'Where'], 'Who asks about a person.'], ['Which question word asks about a place?', 'Where', ['Who', 'When', 'Why'], 'Where asks about a place.'],
    ['Which question word asks about a time?', 'When', ['Where', 'What', 'Who'], 'When asks about time.'], ['Which question word asks for a reason?', 'Why', ['Who', 'Where', 'What'], 'Why asks for a reason.'],
    ['___ is your name?', 'What', ['Who', 'When', 'Where'], 'What asks about a thing.'], ['___ is at the door? It is Grandma!', 'Who', ['What', 'Where', 'Why'], 'The answer is a person.'],
    ['___ do you live? In Calgary.', 'Where', ['When', 'Why', 'Who'], 'The answer is a place.'], ['___ is lunch? At noon.', 'When', ['Where', 'Who', 'What'], 'The answer is a time.']])),
  sk('XNmAc', 'Is it the naming or action part of the sentence?', 'Sentences', [1], () => {
    const S = [['The dog', 'barks loudly'], ['My sister', 'rides a bike'], ['The bird', 'sings a song'], ['Grandpa', 'reads the paper'], ['The kids', 'play tag'], ['A frog', 'jumps in the pond']];
    const [n, a] = pick(S), naming = Math.random() < 0.5, part = naming ? n : a;
    return mc(`${n} ${a}.<br>Is the underlined part the naming part or the action part?<br>${u(part)}`, naming ? 'Naming part' : 'Action part', ['Naming part', 'Action part'], naming ? `${b(n)} tells who or what.` : `${b(a)} tells what someone does.`, 2);
  }),
  sk('XCmpS', 'Find the complete sentences', 'Sentences', [1], qa([['Which is a complete sentence?', 'The cat sleeps on the bed.', ['The cat on the bed.', 'Sleeps on the bed.', 'On the bed.'], 'A complete sentence has a naming part and an action part.'],
    ['Which is a complete sentence?', 'We ate lunch.', ['Ate lunch.', 'We lunch.', 'After lunch.'], 'It tells who and what they did.'], ['Which is a complete sentence?', 'My dad drives a truck.', ['My dad a truck.', 'Drives a truck.', 'A big truck.'], 'It has a naming part and an action part.'],
    ['Which is a complete sentence?', 'The bird sings.', ['The bird.', 'Sings.', 'In the tree.'], 'It tells who and what.']])),
  sk('XCmpW', 'Complete the sentence', 'Sentences', [1], blanks([['The ___ barks.', 'dog', ['run', 'big', 'happy']], ['I ___ a book.', 'read', ['red', 'book', 'tall']], ['We ___ to the park.', 'go', ['green', 'park', 'soft']], ['The sun is ___.', 'hot', ['run', 'jumps', 'sun']], ['She ___ a song.', 'sings', ['song', 'sweet', 'loud']]])),
  /* ---------- nouns ---------- */
  sk('XNnSel', 'Select the nouns', 'Nouns', [1, 2], () => { const n = pick(['dog', 'school', 'apple', 'teacher', 'park', 'ball', 'river', 'pencil']); return mc('Which word is a noun?', n, sample(['run', 'happy', 'blue', 'quickly', 'jump', 'soft', 'sing', 'tall'], 3), `${b(n)} names a person, place, animal or thing.`); }),
  sk('XNnWh', 'Which word is a noun?', 'Nouns', G(2, 4), () => { const n = pick(['kitchen', 'friend', 'garden', 'bicycle', 'idea', 'city', 'turtle', 'window']); return mc('Which word is a noun?', n, sample(['laugh', 'brave', 'slowly', 'swim', 'bright', 'under', 'think', 'quiet'], 3), `${b(n)} is a noun.`); }),
  sk('XPrpN', 'Identify proper nouns', 'Nouns', [1], () => { const [p, c] = pick(PROPER); return mc('Which word is a proper noun?', p, sample(PROPER.map(x => x[1]).concat(['school', 'girl', 'river']), 3), `${b(p)} names a specific ${c}, so it is a proper noun.`); }),
  sk('XCpN', 'Identify common and proper nouns', 'Nouns', G(2, 6), () => {
    const proper = Math.random() < 0.5, [p, c] = pick(PROPER), w = proper ? p : c;
    return mc(`Is ${b(w)} a common noun or a proper noun?`, proper ? 'Proper noun' : 'Common noun', ['Common noun', 'Proper noun'], proper ? `${b(w)} names a specific ${c} and starts with a capital letter.` : `${b(w)} is a general word, not a specific name.`, 2);
  }),
  sk('XPlPc', 'Regular plurals: select the word that matches the picture', 'Nouns', [1], () => {
    const P = [['🐱', 'cat'], ['🐶', 'dog'], ['🍎', 'apple'], ['⭐', 'star'], ['🚗', 'car'], ['🎈', 'balloon'], ['🦆', 'duck'], ['📦', 'box']];
    const [e, w] = pick(P), many = Math.random() < 0.6, pl = w === 'box' ? 'boxes' : w + 's';
    return mc(`${big(many ? e.repeat(3) : e)}<br>Which word matches the picture?`, many ? pl : w, [many ? w : pl], many ? `There is more than one, so use ${b(pl)}.` : `There is only one ${b(w)}.`, 2);
  }),
  sk('XIpPc', 'Irregular plurals: select the word that matches the picture', 'Nouns', [1], () => {
    const P = [['🐭', 'mouse', 'mice'], ['🦶', 'foot', 'feet'], ['🦷', 'tooth', 'teeth'], ['🧒', 'child', 'children'], ['🪿', 'goose', 'geese'], ['👨', 'man', 'men']];
    const [e, s, p] = pick(P), many = Math.random() < 0.6;
    return mc(`${big(many ? e.repeat(3) : e)}<br>Which word matches the picture?`, many ? p : s, many ? [s, s + 's', s + 'es'] : [p, s + 's'], `One ${s}, many ${p}.`);
  }),
  sk('XSgPl', 'Use singular and plural nouns', 'Nouns', [1, 2], () => {
    const [sg, pl] = pick(NOUNS.filter(n => n[2] === 's' || n[2] === 'es')), many = Math.random() < 0.5, n = many ? pick(['two', 'three', 'five', 'many']) : pick(['one', 'a']);
    return mc(`Complete the sentence.<br><em>I see ${n} ___.</em>`, many ? pl : sg, [many ? sg : pl], `With ${b(n)}, use ${b(many ? pl : sg)}.`, 2);
  }),
  sk('XPsPc', 'Select the possessive noun that matches the picture', 'Nouns', [1], pairs({ items: POSSESS_PICS.map(([e, a, w]) => [`${big(e)}<br>Which words match the picture?`, a, `Use an apostrophe and s to show who owns something: ${b(a)}.`, [a, ...w]]) })),
  sk('XPsSg', 'Form the singular possessive', 'Nouns', [1], () => {
    const owner = pick(['dog', 'girl', 'teacher', 'cat', 'boy', 'baby']), thing = pick(['ball', 'book', 'hat', 'bed', 'toy']);
    return mc(`Complete: the ${thing} that belongs to the ${owner} = the ___ ${thing}`, `${owner}'s`, [`${owner}s`, `${owner}s'`, owner], `Add 's: ${b(owner + "'s")}.`);
  }),
  sk('XPlUs', 'Use regular plurals with -s and -es', 'Nouns', [2], () => { const [s, p] = pick(NOUNS.filter(n => ['s', 'es'].includes(n[2]))); return mc(`Complete the sentence.<br><em>I have three ___. (${s})</em>`, p, wrongPlurals(s, p), `The plural of ${s} is ${b(p)}.`); }),
  sk('XPlUi', 'Use regular plurals with -s, -es and -ies', 'Nouns', [3, 4], () => { const [s, p] = pick(NOUNS.filter(n => ['s', 'es', 'ies'].includes(n[2]))); return mc(`Complete the sentence.<br><em>We saw many ___. (${s})</em>`, p, wrongPlurals(s, p), `The plural of ${s} is ${b(p)}.`); }),
  sk('XPlUv', 'Use regular plurals with -s, -es, -ies and -ves', 'Nouns', [4], () => { const [s, p] = pick(NOUNS.filter(n => ['s', 'es', 'ies', 'ves'].includes(n[2]))); return mc(`Complete the sentence.<br><em>There were two ___ on the table. (${s})</em>`, p, wrongPlurals(s, p), `The plural of ${s} is ${b(p)}.`); }),
  sk('XPlFu', 'Form and use plurals of nouns ending in f, fe, o and y', 'Nouns', [5, 6], () => { const [s, p] = pick(NOUNS.filter(n => /(f|fe|o|y)$/.test(n[0]) && n[2] !== 'irr')); return mc(`Complete the sentence.<br><em>We need more ___ for the party. (${s})</em>`, p, wrongPlurals(s, p), `The plural of ${s} is ${b(p)}.`); }),
  sk('XPlRv', 'Form plurals: review', 'Nouns', [5, 6], () => { const [s, p] = pick(NOUNS); return mc(`What is the plural of ${b(s)}?`, p, wrongPlurals(s, p), `The plural of ${s} is ${b(p)}.`); }),
  sk('XPlRu', 'Form and use plurals: review', 'Nouns', G(5, 10), () => { const [s, p] = pick(NOUNS); return mc(`Complete the sentence.<br><em>The museum displayed several ___. (${s})</em>`, p, wrongPlurals(s, p), `The plural of ${s} is ${b(p)}.`); }),
  sk('XPlCm', 'Form and use plurals of compound nouns', 'Nouns', G(7, 10), qa([['What is the plural of <strong>mother-in-law</strong>?', 'mothers-in-law', ['mother-in-laws', 'mothers-in-laws', 'mother-ins-law'], 'Pluralize the main word: mothers-in-law.'],
    ['What is the plural of <strong>passer-by</strong>?', 'passers-by', ['passer-bys', 'passers-bys', 'passer-by\'s'], 'Pluralize the main word: passers.'], ['What is the plural of <strong>toothbrush</strong>?', 'toothbrushes', ['teethbrushes', 'toothbrushs', 'teethbrush'], 'Closed compounds take the ending at the end.'],
    ['What is the plural of <strong>attorney general</strong>?', 'attorneys general', ['attorney generals', 'attorneys generals', 'attorney\'s general'], 'The main noun, attorney, is pluralized.'], ['What is the plural of <strong>cupful</strong>?', 'cupfuls', ['cupsful', 'cupfulls', 'cupful\'s'], 'Words ending in -ful add -s at the end.'],
    ['What is the plural of <strong>runner-up</strong>?', 'runners-up', ['runner-ups', 'runners-ups', 'runner\'s-up'], 'Pluralize the main word: runners.']])),
  /* ---------- pronouns ---------- */
  sk('XPrCh', 'Choose the correct personal pronoun', 'Pronouns', [1, 2], blanks(PRONOUN_CHOICE)),
  sk('XPrCs', 'Complete the sentence with the correct personal pronoun', 'Pronouns', [1], blanks(PRONOUN_CHOICE.slice().reverse())),
  sk('XPpCh', 'Choose the correct possessive pronoun', 'Pronouns', [1], blanks(POSSESSIVE_CHOICE)),
  sk('XPrId', 'Identify personal pronouns', 'Pronouns', G(2, 5), () => { const p = pick(['she', 'they', 'we', 'him', 'it', 'I', 'us', 'them']); return mc('Which word is a personal pronoun?', p, sample(['dog', 'run', 'happy', 'school', 'quickly', 'tree', 'blue'], 3), `${b(p)} takes the place of a noun.`); }),
  sk('XPrRpl', 'Replace the plural noun with a personal pronoun', 'Pronouns', [2], blanks([['<u>The kids</u> played tag. → ___ played tag.', 'They', ['He', 'She', 'It']], ['I gave the cookies to <u>my friends</u>. → I gave the cookies to ___.', 'them', ['they', 'him', 'it']],
    ['<u>Dad and I</u> went fishing. → ___ went fishing.', 'We', ['They', 'Us', 'He']], ['Mom thanked <u>Sam and me</u>. → Mom thanked ___.', 'us', ['we', 'them', 'they']], ['<u>The birds</u> sang. → ___ sang.', 'They', ['It', 'Them', 'We']]], 'Replace the underlined words with a pronoun.')),
  sk('XPpId', 'Identify possessive pronouns', 'Pronouns', G(2, 4), () => { const p = pick(['mine', 'his', 'hers', 'ours', 'theirs', 'yours', 'my', 'their']); return mc('Which word is a possessive pronoun?', p, sample(['me', 'they', 'she', 'we', 'him', 'us', 'it'], 3), `${b(p)} shows ownership.`); }),
  sk('XPrRe', 'Choose between personal and reflexive pronouns', 'Pronouns', G(2, 8), blanks(REFLEXIVE)),
  sk('XPrCo', 'Compound subjects and objects with personal pronouns', 'Pronouns', G(5, 8), blanks([['Ana and ___ went to the store.', 'I', ['me', 'myself', 'mine']], ['The teacher gave Ben and ___ a prize.', 'her', ['she', 'herself', 'hers']],
    ['___ and his brother built a fort.', 'He', ['Him', 'His', 'Himself']], ['Grandma called my sister and ___.', 'me', ['I', 'myself', 'mine']], ['They and ___ will meet at noon.', 'we', ['us', 'ourselves', 'our']], ['The dog followed Lily and ___.', 'him', ['he', 'himself', 'his']]])),
  sk('XRlId', 'Identify relative pronouns', 'Pronouns', G(4, 6), () => { const S = [['The girl <u>who</u> won is my cousin.', 'who'], ['The book <u>that</u> I read was great.', 'that'], ['The car, <u>which</u> is red, is new.', 'which'], ['The boy <u>whose</u> dog barked apologized.', 'whose'], ['The man <u>whom</u> we met is a chef.', 'whom']];
    const [s, w] = pick(S); return mc(`Which word in the sentence is a relative pronoun?<br><em>${s.replace(/<\/?u>/g, '')}</em>`, w, s.replace(/<[^>]+>/g, '').replace(/[.,]/g, '').split(' ').filter(x => x.toLowerCase() !== w).slice(0, 5), `${b(w)} begins a clause that describes a noun.`); }),
  sk('XWhom', 'Use relative pronouns: who and whom', 'Pronouns', G(4, 12), pairs({ items: WHO_WHOM.map(([s, a, w, n]) => [`Complete the sentence.<br><em>${s}</em>`, a, n, [a, ...w]]) })),
  sk('XAnte', 'Identify pronouns and their antecedents', 'Pronouns and antecedents', G(6, 8), qa(ANTECEDENT.map(([s, a, w]) => [`What is the antecedent of the underlined pronoun?<br><em>${s}</em>`, a, w, `The pronoun refers back to ${b(a)}.`]))),
  sk('XAgre', 'Use the pronoun that agrees with the antecedent', 'Pronouns and antecedents', G(6, 8), blanks(AGREE)),
  sk('XPnRv', 'Subject and object pronouns review', 'Pronouns', G(9, 12), qa(PN_REVIEW.map(([q, a, w]) => [q, a, w, `${b(a)} uses the correct subject or object pronoun.`]))),
  /* ---------- verbs ---------- */
  sk('XAvPc', 'Complete the sentence with an action verb to match the picture', 'Verbs', [1], pairs({ items: ACTION_PICS.map(([e, v, s]) => [`${big(e)}<br>${s}`, v, fill(s, v), [v, ...sample(ACTION_PICS.map(x => x[1]).filter(x => x !== v), 3)]]) })),
  sk('XAvUs', 'Use action verbs', 'Verb types', G(1, 4), blanks(ACTION_VERBS)),
  sk('XHelp', 'Identify helping verbs', 'Verb types', [2], () => { const S = [['She <u>is</u> running fast.', 'is'], ['We <u>will</u> go home.', 'will'], ['They <u>have</u> eaten lunch.', 'have'], ['He <u>can</u> swim well.', 'can'], ['I <u>was</u> reading a book.', 'was'], ['You <u>should</u> rest.', 'should']];
    const [s, h] = pick(S); return mc(`Which word is the helping verb?<br><em>${s.replace(/<\/?u>/g, '')}</em>`, h, s.replace(/<[^>]+>/g, '').replace('.', '').split(' ').filter(x => x !== h), `${b(h)} helps the main verb.`); }),
  sk('XModS', 'What does the modal verb show?', 'Verb types', G(4, 6), qa(MODALS.map(([s, a, w]) => [`What does the underlined modal verb show?<br><em>${s}</em>`, a, w, `${b(a)}.`]))),
  sk('XOneM', 'One or more than one?', 'Subject-verb agreement', [1, 2], () => {
    const [sub, key] = pick(SUBJECTS.filter(s => s[1] === '3s' || s[1] === 'pl').filter(s => !/^(He|She|It|We|They)$/.test(s[0])));
    return mc(`Is the subject one or more than one?<br><em>${sub} …</em>`, key === '3s' ? 'One' : 'More than one', ['One', 'More than one'], key === '3s' ? `${b(sub)} names one.` : `${b(sub)} names more than one.`, 2);
  }),
  sk('XBsSb', 'Complete the sentence with the best subject', 'Subject-verb agreement', [1], () => {
    const [base, s, rest] = pick(PRESENT_VERBS), sing = Math.random() < 0.5;
    const subj = sing ? pick(['The dog', 'My sister', 'The teacher', 'Grandpa']) : pick(['The kids', 'My friends', 'The birds', 'Mom and Dad']);
    const wrong = sing ? ['The kids', 'My friends', 'The birds'] : ['The dog', 'My sister', 'Grandpa'];
    return mc(`Complete the sentence.<br><em>___ ${sing ? s : base} ${rest}.</em>`, subj, wrong, `${b(sing ? s : base)} goes with ${sing ? 'one' : 'more than one'}.`);
  }),
  sk('XPvV', 'Pronoun-verb agreement: Complete the sentence with the best verb', 'Subject-verb agreement', [1], () => {
    const [p, key] = pick(SUBJECTS.slice(0, 7)), [base, s, rest] = pick(PRESENT_VERBS), v = key === '3s' ? s : base;
    return mc(`Complete the sentence.<br><em>${p} ___ ${rest}.</em>`, v, [v === s ? base : s], `${b(p)} goes with ${b(v)}.`, 2);
  }),
  sk('XPvS', 'Pronoun-verb agreement: Complete the sentence with the best subject', 'Subject-verb agreement', [1], () => {
    const [base, s, rest] = pick(PRESENT_VERBS), sing = Math.random() < 0.5, p = sing ? pick(['He', 'She', 'It']) : pick(['We', 'They', 'I', 'You']);
    return mc(`Complete the sentence.<br><em>___ ${sing ? s : base} ${rest}.</em>`, p, sing ? ['We', 'They', 'I'] : ['He', 'She', 'It'], `${b(p)} matches ${b(sing ? s : base)}.`);
  }),
  sk('XPvA', 'Pronoun-verb agreement', 'Subject-verb agreement', G(2, 4), () => {
    const [p, key] = pick(SUBJECTS.slice(0, 7)), [base, s, rest] = pick(PRESENT_VERBS), v = key === '3s' ? s : base;
    return mc(`Which verb completes the sentence?<br><em>${p} ___ ${rest}.</em>`, v, [v === s ? base : s, base + 'ing'], `${b(p)} goes with ${b(v)}.`);
  }),
  sk('XSbSP', 'Is the subject singular or plural?', 'Subject-verb agreement', [3, 4], () => {
    const [sub, key] = pick(SUBJECTS.filter(s => s[1] === '3s' || s[1] === 'pl'));
    return mc(`Is the subject singular or plural?<br><em>${sub} went to the fair.</em>`, key === '3s' ? 'Singular' : 'Plural', ['Singular', 'Plural'], `${b(sub)} is ${key === '3s' ? 'singular' : 'plural'}.`, 2);
  }),
  sk('XSvCs', 'Use the correct subject or verb – with compound subjects', 'Subject-verb agreement', G(4, 8), pairs({ items: SV_COMPOUND.map(([s, a, w, n]) => [`Complete the sentence.<br><em>${s}</em>`, a, n, [a, ...w]]) })),
  sk('XTlPr', 'Select the sentence that tells about the present', 'Verb tense', [1], () => { const P = TIMELINE.filter(x => x[1] === 'Present'); const s = pick(P)[0]; return mc('Which sentence tells about the present?', s, sample(TIMELINE.filter(x => x[1] !== 'Present').map(x => x[0]), 2), `${b(s)} tells about now.`, 3); }),
  sk('XTlPa', 'Select the sentence that tells about the past', 'Verb tense', [1], () => { const s = pick(TIMELINE.filter(x => x[1] === 'Past'))[0]; return mc('Which sentence tells about the past?', s, sample(TIMELINE.filter(x => x[1] !== 'Past').map(x => x[0]), 2), `${b(s)} already happened.`, 3); }),
  sk('XTlFu', 'Select the sentence that tells about the future', 'Verb tense', [1], () => { const s = pick(TIMELINE.filter(x => x[1] === 'Future'))[0]; return mc('Which sentence tells about the future?', s, sample(TIMELINE.filter(x => x[1] !== 'Future').map(x => x[0]), 2), `${b(s)} has not happened yet.`, 3); }),
  sk('XTmLn', 'Place sentences on a timeline', 'Verb tense', [1], classify({ categories: ['Past', 'Present', 'Future'], items: TIMELINE, prompt: s => `Where does this sentence go on the timeline?<br><em>${s}</em>` })),
  sk('XTmIr', 'Place sentences with irregular verbs on a timeline', 'Verb tense', [1, 2], classify({ categories: ['Past', 'Present', 'Future'], items: TIMELINE_IRR, prompt: s => `Where does this sentence go on the timeline?<br><em>${s}</em>` })),
  sk('XEdIng', 'Match the -ed and -ing sentences to the pictures', 'Verb tense', [1, 2], () => {
    const [e, ing, ed] = pick(ED_ING), now = Math.random() < 0.5;
    return mc(`${big(e)}<br>Which sentence tells about something happening ${now ? 'now' : 'in the past'}?`, now ? ing : ed, [now ? ed : ing], now ? 'The -ing verb with is/are shows it is happening now.' : 'The past tense verb shows it already happened.', 2);
  }),
  sk('XBePr', 'To be: use the correct present tense form', 'Verb tense', [1, 2], blanks(BE_PRESENT)),
  sk('XBePa', 'To be: use the correct past tense form', 'Verb tense', [1, 2], blanks(BE_PAST)),
  sk('XIrId', 'Identify the irregular past tense', 'Verb tense', [1, 4], () => { const [base, past] = pick(IRREGULAR); return mc(`Which word is the past tense of ${b(base)}?`, past, wrongPast(base, past).slice(0, 3), `The past tense of ${base} is ${b(past)}.`); }),
  sk('XIr1', 'Identify the irregular past tense I', 'Verb tense', [2, 3], () => { const [base, past] = pick(IRREGULAR.slice(0, 22)); return mc(`Which word is the past tense of ${b(base)}?`, past, wrongPast(base, past).slice(0, 3), `${b(past)}.`); }),
  sk('XIr2', 'Identify the irregular past tense II', 'Verb tense', [2, 3], () => { const [base, past] = pick(IRREGULAR.slice(22)); return mc(`Which word is the past tense of ${b(base)}?`, past, wrongPast(base, past).slice(0, 3), `${b(past)}.`); }),
  sk('XRgSn', 'Which sentence is in the regular past tense?', 'Verb tense', G(2, 4), () => {
    const [base, past] = pick(REGULAR), sub = pick(['We', 'Sam', 'The kids', 'I']);
    return mc('Which sentence is in the past tense?', `${sub} ${past} yesterday.`, [`${sub} ${base === 'walk' ? 'will walk' : 'will ' + base} tomorrow.`, `${sub} ${base}${sub === 'Sam' ? 's' : ''} every day.`], `${b(past)} tells about the past.`, 3);
  }),
  sk('XRgId', 'Identify verbs in the regular past tense', 'Verb tense', G(2, 4), () => { const [base, past] = pick(REGULAR); return mc('Which verb is in the past tense?', past, [base, base + 'ing', base + 's'], `${b(past)} ends in -ed.`); }),
  ...[5].map(n => sk(`XTi${n}`, `Form and use the irregular past tense: set ${n}`, 'Verb tense', n === 5 ? [3] : G(2, 4), () => {
    const set = IRREGULAR.slice((n - 1) * 9, n * 9 + 1), [base, past, , obj] = pick(set.length ? set : IRREGULAR);
    return mc(`Complete the sentence with the past tense of ${b(base)}.<br><em>Yesterday, we ___ ${obj}.</em>`, past, wrongPast(base, past).slice(0, 3), `The past tense of ${base} is ${b(past)}.`);
  })),
  sk('XTnSm', 'Form and use the simple past, present and future tense', 'Verb tense', G(5, 8), blanks(SIMPLE_TENSES)),
  sk('XPrgU', 'Use the progressive verb tenses', 'Verb tense', G(4, 6), blanks(PROGRESSIVE_USE)),
  sk('XPrfU', 'Use the perfect verb tenses', 'Verb tense', G(4, 6), blanks(PERFECT_USE)),
  /* ---------- adjectives, adverbs, prepositions, conjunctions ---------- */
  sk('XSense', 'Use sense words', 'Adjectives', [1, 2], classify({ categories: ['sight', 'hearing', 'smell', 'taste', 'touch'], items: SENSE, prompt: s => `Which sense does this sentence tell about?<br><em>${s}</em>` })),
  sk('XAdCs', 'Compare pictures using comparative and superlative adjectives', 'Adjectives', [1], () => {
    const [adj, comp, sup] = pick(ADJ_COMPARE.slice(0, 10)), two = Math.random() < 0.5, e = pick(['🌳', '🐟', '📦', '🎈']);
    return mc(`${big(two ? e + ' ' + e : e + ' ' + e + ' ' + e)}<br>${two ? `This one is ___ than that one. (${adj})` : `This one is the ___ of all. (${adj})`}`, two ? comp : sup, [adj, two ? sup : comp], two ? `Comparing two: ${b(comp)}.` : `Comparing more than two: ${b(sup)}.`, 3);
  }),
  sk('XAdTw', 'Does the adjective compare two or more than two?', 'Adjectives', [1], classify({ categories: ['Two', 'More than two'], items: ADJ_TWO, prompt: s => `Does the underlined adjective compare two things or more than two?<br><em>${s}</em>`, explain: (s, c) => (c === 'Two' ? '-er compares two things.' : '-est compares more than two.') })),
  sk('XAdIc', 'Identify comparative and superlative adjectives', 'Adjectives', [1, 2], () => {
    const [adj, comp, sup] = pick(ADJ_COMPARE.filter(a => !a[1].startsWith('more'))), which = Math.random() < 0.5 ? 'comparative' : 'superlative';
    return mc(`Which word is the ${which} form of ${b(adj)}?`, which === 'comparative' ? comp : sup, [adj, which === 'comparative' ? sup : comp], which === 'comparative' ? `${b(comp)} compares two.` : `${b(sup)} compares three or more.`, 3);
  }),
  sk('XAdDn', 'Identify the adjective that describes the noun', 'Adjectives and adverbs', G(2, 4), () => {
    const S = [['The fluffy kitten slept.', 'kitten', 'fluffy'], ['We climbed a tall mountain.', 'mountain', 'tall'], ['She wore a red scarf.', 'scarf', 'red'], ['A loud alarm rang.', 'alarm', 'loud'], ['I ate a juicy peach.', 'peach', 'juicy']];
    const [s, n, a] = pick(S); return mc(`Which adjective describes the noun ${b(n)}?<br><em>${s}</em>`, a, s.replace('.', '').split(' ').filter(x => x !== a && x !== n).slice(0, 3), `${b(a)} describes the ${n}.`);
  }),
  sk('XAdOr', 'Order adjectives', 'Adjectives and adverbs', G(4, 8), pairs({ items: ADJ_ORDER.map(([s, a, w]) => [`Which words complete the sentence in the correct order?<br><em>${s}</em>`, a, `Adjectives usually go in this order: opinion, size, age, shape, colour, origin, material. ${fill(s, a)}`, [a, ...w]]) })),
  sk('XRlAv', 'Use relative adverbs', 'Adjectives and adverbs', G(4, 6), blanks(RELATIVE_ADV)),
  sk('XMoMo', 'Use adjectives with more and most', 'Adjectives and adverbs', [4, 5], blanks(MORE_MOST)),
  sk('XPpPc', 'Select the best preposition to match the picture', 'Prepositions', [1, 2], pairs({ items: PREP_PICS.map(([e, s, a, w]) => [`${big(e)}<br>${s}`, a, fill(s, a), [a, ...w]]) })),
  sk('XPpOb', 'Identify prepositions and their objects', 'Prepositions', G(3, 6), qa(PREP_OBJ.map(([s, a, w]) => [`What is the object of the preposition in the underlined phrase?<br><em>${s}</em>`, a, w, `The object of the preposition is ${b(a)}.`]))),
  sk('XPpRv', 'Prepositions: review', 'Prepositions', G(3, 6), classify({ categories: ['Preposition', 'Not a preposition'], items: PREP_WORDS, prompt: s => `Is the underlined word a preposition?<br><em>${s}</em>`, explain: (s, c) => (c === 'Preposition' ? 'It links a noun to the rest of the sentence.' : 'It is not followed by an object.') })),
  sk('XCoId', 'Identify coordinating conjunctions', 'Conjunctions', G(3, 6), classify({ categories: ['Yes', 'No'], items: COORD, prompt: s => `Is the underlined word a coordinating conjunction?<br><em>${s}</em>`, explain: (s, c) => (c === 'Yes' ? 'Coordinating conjunctions: for, and, nor, but, or, yet, so (FANBOYS).' : 'It is a subordinating conjunction, not one of the FANBOYS.') })),
  sk('XSuId', 'Identify subordinating conjunctions', 'Conjunctions', G(3, 6), () => {
    const S = [['We stayed inside <u>because</u> it rained.', 'because'], ['<u>Although</u> I was tired, I finished.', 'Although'], ['Call me <u>when</u> you arrive.', 'when'], ['<u>If</u> it snows, we will ski.', 'If'], ['Wait here <u>until</u> I return.', 'until'], ['She smiled <u>while</u> she worked.', 'while']];
    const [s, c] = pick(S); return mc(`Which word is the subordinating conjunction?<br><em>${s.replace(/<\/?u>/g, '')}</em>`, c, s.replace(/<[^>]+>/g, '').replace(/[.,]/g, '').split(' ').filter(x => x !== c).slice(0, 3), `${b(c)} begins a dependent clause.`);
  }),
  sk('XCrFl', 'Fill in the missing correlative conjunction', 'Conjunctions', [5, 6], blanks(CORR)),
  /* ---------- contractions & capitalization ---------- */
  sk('XCtMt', 'Match the contractions', 'Contractions', [1], () => { const [full, c] = pick([...CONTRACTIONS_PRONOUN, ...CONTRACTIONS_NOT].slice(0, 20)); return mc(`Which two words make ${b(c)}?`, full, sample([...CONTRACTIONS_PRONOUN, ...CONTRACTIONS_NOT].map(x => x[0]).filter(x => x !== full), 3), `${b(c)} = ${full}.`); }),
  sk('XCtSn', 'Complete the sentence with the correct contraction', 'Contractions', [1], blanks([['I ___ want to go to bed yet. (do not)', "don't", ["doesn't", "didn't", "isn't"]], ['___ going to the park. (We are)', "We're", ["Were", "We'll", "We've"]],
    ['She ___ find her shoe. (can not)', "can't", ["couldn't", "won't", "isn't"]], ['___ a sunny day! (It is)', "It's", ["Its", "It'll", "Is"]], ['They ___ coming today. (are not)', "aren't", ["isn't", "weren't", "don't"]]])),
  sk('XCtUp', 'Use pronoun-verb contractions', 'Contractions', [2], () => { const [full, c] = pick(CONTRACTIONS_PRONOUN); return mc(`Which contraction can replace the underlined words?<br><em>${u(cap(full))} ready to go.</em>`, c, sample(CONTRACTIONS_PRONOUN.map(x => x[1]).filter(x => x !== c), 3), `${cap(full)} = ${b(c)}.`); }),
  sk('XCtUn', 'Use contractions with "not"', 'Contractions', [2], () => { const [full, c] = pick(CONTRACTIONS_NOT); return mc(`Which contraction can replace the underlined words?<br><em>We ${u(full)} go there.</em>`, c, sample(CONTRACTIONS_NOT.map(x => x[1]).filter(x => x !== c), 3), `${full} = ${b(c)}.`); }),
  sk('XCtUs', 'Use contractions in a sentence', 'Contractions', [2], blanks([['___ my best friend. (She is)', "She's", ["Shes", "She'll", "She'd"]], ['I ___ like spinach. (do not)', "don't", ["dont", "didn't", "doesn't"]],
    ['___ go to the beach tomorrow. (We will)', "We'll", ["Well", "We're", "We'd"]], ['He ___ finished yet. (has not)', "hasn't", ["haven't", "hadn't", "isn't"]], ['___ been waiting a long time. (They have)', "They've", ["Theyve", "They're", "They'll"]]])),
  sk('XCpTr', 'Capitalizing the names of people and pets and titles of respect', 'Capitalization', [3, 4], qa([['Which is capitalized correctly?', 'Dr. Patel', ['dr. Patel', 'Dr. patel', 'dr. patel'], 'Capitalize titles of respect and names.'],
    ['Which is capitalized correctly?', 'Mrs. Gomez', ['mrs. Gomez', 'Mrs. gomez', 'MRS. gomez'], 'Capitalize the title and the name.'], ['Which is capitalized correctly?', 'my dog, Biscuit', ['my dog, biscuit', 'My Dog, biscuit', 'my Dog, Biscuit'], 'Capitalize a pet\'s name.'],
    ['Which is capitalized correctly?', 'Uncle Ray', ['uncle Ray', 'uncle ray', 'Uncle ray'], 'Capitalize a family title used before a name.'], ['Which is capitalized correctly?', 'Captain Morgan', ['captain Morgan', 'Captain morgan', 'captain morgan'], 'Capitalize titles before names.']])),
  sk('XCpNl', 'Capitalizing proper adjectives, nationalities and languages', 'Capitalization', [4], qa([['Which is capitalized correctly?', 'We ate Italian food.', ['We ate italian food.', 'We ate Italian Food.', 'we ate italian food.'], 'Proper adjectives from places are capitalized.'],
    ['Which is capitalized correctly?', 'She speaks French and Spanish.', ['She speaks french and spanish.', 'She speaks French and spanish.', 'she speaks French and Spanish.'], 'Languages are capitalized.'],
    ['Which is capitalized correctly?', 'My friend is Canadian.', ['My friend is canadian.', 'my friend is canadian.', 'My Friend is Canadian.'], 'Nationalities are capitalized.'],
    ['Which is capitalized correctly?', 'He loves Japanese art.', ['He loves japanese art.', 'He loves Japanese Art.', 'he loves japanese art.'], 'Japanese is a proper adjective.']])),
  sk('XFtCp', 'Formatting and capitalizing titles', 'Formatting', G(3, 9), qa([['Which book title is written correctly?', '<em>Charlotte\'s Web</em>', ['"charlotte\'s web"', '<em>charlotte\'s web</em>', 'Charlotte\'s web'], 'Italicize book titles and capitalize the important words.'],
    ['Which song title is written correctly?', '"The Wheels on the Bus"', ['<em>the wheels on the bus</em>', '"The wheels On The Bus"', 'The Wheels on the bus'], 'Put song titles in quotation marks.'],
    ['Which movie title is written correctly?', '<em>The Lion King</em>', ['"the lion king"', '<em>The lion King</em>', 'the Lion king'], 'Italicize movie titles.'],
    ['Which poem title is written correctly?', '"The Road Not Taken"', ['<em>The road not taken</em>', '"the Road not Taken"', 'The Road Not taken'], 'Put poem titles in quotation marks and capitalize important words.'],
    ['Which magazine title is written correctly?', '<em>National Geographic</em>', ['"national geographic"', 'National geographic', '<em>national Geographic</em>'], 'Italicize magazine titles.']])),
  /* ---------- sentences ---------- */
  sk('XSubj', 'Identify the subject of a sentence', 'Sentences, fragments and run-ons', [2], () => { const [s, p] = pick([['The dog', 'chased the ball.'], ['My mom', 'baked bread.'], ['The bus', 'was late.'], ['Two birds', 'sang outside.'], ['Our teacher', 'read a story.']]); return mc(`What is the subject of the sentence?<br><em>${s} ${p}</em>`, s, [p, s.split(' ').pop(), p.split(' ')[0]], `${b(s)} tells who or what the sentence is about.`); }),
  sk('XPred', 'Identify the predicate of a sentence', 'Sentences, fragments and run-ons', [2], () => { const [s, p] = pick([['The dog', 'chased the ball.'], ['My mom', 'baked bread.'], ['The bus', 'was late.'], ['Two birds', 'sang outside.'], ['Our teacher', 'read a story.']]); return mc(`What is the predicate of the sentence?<br><em>${s} ${p}</em>`, p, [s, s.split(' ').pop(), p.split(' ').slice(-1)[0]], `${b(p)} tells what the subject does or is.`); }),
  sk('XCsub', 'Identify the complete subject of a sentence', 'Sentences, fragments and run-ons', [3, 4], () => { const [s, p] = pick([['The tall girl in the red coat', 'waved to us.'], ['My little brother', 'loves trucks.'], ['The old wooden bridge', 'creaked.'], ['All of the students', 'clapped loudly.'], ['A family of ducks', 'crossed the road.']]); return mc(`What is the complete subject?<br><em>${s} ${p}</em>`, s, [s.split(' ').slice(-2).join(' '), p, s.split(' ').slice(0, 2).join(' ')], `The complete subject is ${b(s)}.`); }),
  sk('XCprd', 'Identify the complete predicate of a sentence', 'Sentences, fragments and run-ons', [3, 4], () => { const [s, p] = pick([['The tall girl', 'waved to us from the bus.'], ['My little brother', 'loves big red trucks.'], ['The bridge', 'creaked in the wind.'], ['The students', 'clapped loudly at the end.'], ['A family of ducks', 'crossed the busy road.']]); return mc(`What is the complete predicate?<br><em>${s} ${p}</em>`, p, [s, p.split(' ')[0], p.split(' ').slice(-2).join(' ')], `The complete predicate is ${b(p)}.`); }),
  sk('XCmpSP', 'Identify the compound subject or compound predicate of a sentence', 'Sentences, fragments and run-ons', G(6, 8), qa([['What is the compound subject?<br><em>Maya and her brother built a snow fort.</em>', 'Maya and her brother', ['built a snow fort', 'Maya', 'snow fort'], 'Two subjects share one verb.'],
    ['What is the compound predicate?<br><em>The dog barked and wagged its tail.</em>', 'barked and wagged its tail', ['The dog', 'barked', 'wagged its tail'], 'One subject does two actions.'],
    ['What is the compound subject?<br><em>Rain, sleet and snow fell all night.</em>', 'Rain, sleet and snow', ['fell all night', 'Rain', 'all night'], 'Three subjects share the verb fell.'],
    ['What is the compound predicate?<br><em>We swam in the lake and hiked up the hill.</em>', 'swam in the lake and hiked up the hill', ['We', 'swam in the lake', 'hiked up the hill'], 'One subject, two predicates.']])),
  sk('XSnSc', 'Is the sentence simple, compound or complex?', 'Sentences, fragments and run-ons', [5, 6], classify({ categories: ['Simple', 'Compound', 'Complex'], items: [
    ['The dog barked at the mail carrier.', 'Simple'], ['I wanted pizza, but we had tacos.', 'Compound'], ['Because it rained, the game was cancelled.', 'Complex'], ['We can swim, or we can hike.', 'Compound'],
    ['When the bell rang, everyone cheered.', 'Complex'], ['My cousin from Regina visited last summer.', 'Simple'], ['She studied hard, so she passed.', 'Compound'], ['I will call you after I finish dinner.', 'Complex']],
    prompt: s => `Is this sentence simple, compound or complex?<br><em>${s}</em>`, explain: (s, c) => ({ Simple: 'One independent clause.', Compound: 'Two independent clauses joined by a conjunction.', Complex: 'An independent clause plus a dependent clause.' })[c] })),
  sk('XMmPic', 'Misplaced modifiers with pictures', 'Misplaced modifiers', G(7, 12), qa(MISPLACED_PICS)),
  /* ---------- vocabulary ---------- */
  sk('XCsRv', 'Match each cause to its effect', 'Cause and effect', [2], qa([['Cause: It rained all day. What was the effect?', 'The field was muddy.', ['The sun came out.', 'We ate lunch.', 'The dog barked.'], 'Rain made the field muddy.'],
    ['Cause: Ben forgot his lunch. What was the effect?', 'He was hungry at school.', ['He ran fast.', 'He sang a song.', 'He read a book.'], 'Without lunch, he was hungry.'],
    ['Cause: The ice cream sat in the sun. What was the effect?', 'It melted.', ['It froze.', 'It grew.', 'It turned blue.'], 'Heat melts ice cream.'],
    ['Cause: Mia practised every day. What was the effect?', 'She got better at piano.', ['She lost her book.', 'She forgot the song.', 'She went to bed.'], 'Practice helped her improve.']])),
  sk('XPxUs', 'Use the prefixes pre-, re- and mis-', 'Prefixes and suffixes', G(2, 4), blanks([['Oops, I ___ the word "cat." (spelled wrongly)', 'misspelled', ['respelled', 'prespelled', 'unspelled']], ['Please ___ the oven before baking. (heat before)', 'preheat', ['reheat', 'misheat', 'unheat']],
    ['Can you ___ the story? (tell again)', 'retell', ['pretell', 'mistell', 'untell']], ['I ___ my keys again. (placed wrongly)', 'misplaced', ['replaced', 'preplaced', 'unplaced']], ['We watched a ___ of the movie. (view before)', 'preview', ['review', 'misview', 'unview']]])),
  sk('XAfRv', 'Prefixes and suffixes: review', 'Prefixes and suffixes', [2], () => { const [w, , aff, m] = pick(AFFIX_WORDS.filter(a => ['pre-', 're-', 'mis-', 'un-', '-ful', '-less'].includes(a[2]))); return mc(`What does ${b(w)} mean?`, m, sample(AFFIX_WORDS.map(a => a[3]).filter(x => x !== m), 3), `${b(aff)} helps: ${w} means ${m}.`); }),
  sk('XSfRv', 'Determine the meaning of a word with a suffix: review', 'Prefixes and suffixes', [3, 4], () => { const [w, , aff, m] = pick(AFFIX_WORDS.filter(a => a[2].startsWith('-'))); return mc(`What does ${b(w)} mean?`, m, sample(AFFIX_WORDS.filter(a => a[2].startsWith('-')).map(a => a[3]).filter(x => x !== m), 3), `The suffix ${b(aff)} helps: ${w} means ${m}.`); }),
  sk('XAfRv2', 'Determine the meanings of words with prefixes and suffixes: review', 'Prefixes and suffixes', [3, 4], () => { const [w, , aff, m] = pick(AFFIX_WORDS); return mc(`What does ${b(w)} mean?`, m, sample(AFFIX_WORDS.map(a => a[3]).filter(x => x !== m), 3), `${b(aff)} helps: ${w} means ${m}.`); }),
  sk('XCmpU', 'Form and use compound words', 'Compound words', G(2, 4), blanks([['We saw a ___ after the rain.', 'rainbow', ['raincoat', 'snowman', 'sunset']],
    ['I keep my homework in a ___.', 'notebook', ['bookcase', 'mailbox', 'backpack']], ['A ___ landed on the flower.', 'butterfly', ['firefly', 'starfish', 'goldfish']],
    ['We built a ___ in the yard.', 'snowman', ['snowball', 'sunflower', 'doorbell']], ['We ate ___ at the movie.', 'popcorn', ['cupcake', 'pancake', 'football']],
    ['I sleep in my ___.', 'bedroom', ['classroom', 'bathtub', 'playground']], ['The kids slid down the slide at the ___.', 'playground', ['bedroom', 'mailbox', 'airplane']]], 'Which compound word completes the sentence?')),
  sk('XSyCx', 'Find synonyms in context', 'Synonyms and antonyms', G(2, 6), qa(SYN_CONTEXT.map(([s, a, w]) => [`Which word is a synonym for the underlined word?<br><em>${s}</em>`, a, w, `${b(a)} means almost the same thing.`]))),
  sk('XAnCx', 'Find antonyms in context', 'Synonyms and antonyms', G(2, 6), qa(ANT_CONTEXT.map(([s, a, w]) => [`Which word in the sentence is an antonym of the underlined word?<br><em>${s}</em>`, a, w, `${b(a)} means the opposite.`]))),
  sk('XAnSn', 'Which sentence uses an antonym?', 'Synonyms and antonyms', G(2, 4), qa([
    ['Which sentence uses an antonym of <strong>hot</strong>?', 'The soup was hot, but the ice cream was cold.', ['The soup was hot and steamy.', 'The soup was very, very hot.', 'The hot soup was warm.'], 'Cold is the opposite of hot.'],
    ['Which sentence uses an antonym of <strong>early</strong>?', 'Sam came early, but Kim came late.', ['Sam came early in the day.', 'Sam came very early.', 'Sam came early and quickly.'], 'Late is the opposite of early.'],
    ['Which sentence uses an antonym of <strong>full</strong>?', 'My cup was full, but now it is empty.', ['My cup was full of juice.', 'My cup was very full.', 'My full cup was heavy.'], 'Empty is the opposite of full.'],
    ['Which sentence uses an antonym of <strong>loud</strong>?', 'The drum is loud, but the flute is quiet.', ['The drum is very loud.', 'The loud drum boomed.', 'The drum is loud and big.'], 'Quiet is the opposite of loud.'],
    ['Which sentence uses an antonym of <strong>open</strong>?', 'The door was open, but now it is closed.', ['The door was wide open.', 'The open door creaked.', 'Please leave the door open.'], 'Closed is the opposite of open.']])),
  sk('XSmMn', 'Which sentence has the same meaning?', 'Synonyms and antonyms', G(2, 4), qa(SAME_MEANING.map(([s, a, w]) => [`Which sentence has the same meaning?<br><em>${s}</em>`, a, w, `${b(a)} uses a synonym.`]))),
  sk('XHmPc', 'Homophones with pictures', 'Homophones', G(2, 4), pairs({ items: [['🌊', 'sea', ['see']], ['👀', 'see', ['sea']], ['☀️', 'sun', ['son']], ['🌸', 'flower', ['flour']], ['🍐', 'pear', ['pair']], ['🦌', 'deer', ['dear']], ['🐝', 'bee', ['be']], ['8️⃣', 'eight', ['ate']], ['🌙', 'night', ['knight']], ['🐕', 'tail', ['tale']]]
    .map(([e, a, w]) => [`${big(e)}<br>Which word matches the picture?`, a, `The picture shows ${b(a)}.`, [a, ...w]]) })),
  sk('XIdPc', 'Choose the picture that matches the idiomatic expression', 'Idioms', [2, 3], pairs({ items: IDIOM_PICS.map(([s, a, w]) => [`What does this idiom mean?<br><em>${s}</em>`, a, `${s} means ${a}.`, [a, ...w]]) })),
  sk('XIdA2', 'Identify the meaning of idioms and adages: set 2', 'Idioms and adages', G(4, 6), qa(IDIOMS2.map(([i, m, w]) => [`What does the idiom or adage mean?<br><em>${i}</em>`, m, w, `"${i}" means ${b(m)}.`]))),
  sk('XIdC1', 'Determine the meaning of idioms from context: set 1', 'Idioms and adages', G(4, 6), qa(IDIOM_CONTEXT.map(([s, m, w]) => [`What does the underlined idiom mean?<br><em>${s}</em>`, m, w, `Here it means ${b(m)}.`]))),
  sk('XIdC2', 'Determine the meaning of idioms from context: set 2', 'Idioms and adages', G(4, 6), qa(IDIOM_CONTEXT2.map(([s, m, w]) => [`What does the underlined idiom mean?<br><em>${s}</em>`, m, w, `Here it means ${b(m)}.`]))),
  sk('XMlRv', 'Which sentence matches the definition?', 'Multiple-meaning words', G(3, 8), () => {
    const [w, s, m] = pick(MULTI), other = MULTI.find(x => x[0] === w && x[2] !== m);
    return mc(`Which sentence uses ${b(w)} to mean ${b(m)}?`, s.replace(/<\/?u>/g, ''), [other ? other[1].replace(/<\/?u>/g, '') : `The ${w} is here.`], `In that sentence, ${w} means ${m}.`, 2);
  }),
  sk('XDict', 'Use dictionary entries', 'Reference skills', G(2, 10), pairs({ items: DICTIONARY.map(([e, s, a, w]) => [`${e}<br><br>Which definition matches the underlined word?<br><em>${s}</em>`, a, `The sentence uses ${a.toLowerCase()}.`, [a, ...w]]), choicesPer: 2 })),
  sk('XDdef', 'Use dictionary definitions', 'Reference skills', G(3, 10), qa([['<strong>gigantic</strong> (adj.): extremely large. Which sentence uses gigantic correctly?', 'A gigantic wave crashed onto the shore.', ['The ant was gigantic and hard to see.', 'She whispered a gigantic secret.', 'He ate a gigantic crumb.'], 'Gigantic means extremely large.'],
    ['<strong>timid</strong> (adj.): shy and easily frightened. Which sentence uses timid correctly?', 'The timid kitten hid behind the couch.', ['The timid lion roared at the crowd.', 'She gave a timid, booming speech.', 'The timid storm destroyed the town.'], 'A timid animal would hide.'],
    ['<strong>ancient</strong> (adj.): very old. Which sentence uses ancient correctly?', 'We studied ancient Egyptian pyramids.', ['I bought an ancient phone yesterday.', 'The ancient baby cried.', 'She wore her ancient new shoes.'], 'Pyramids are very old.'],
    ['<strong>reluctant</strong> (adj.): unwilling. Which sentence uses reluctant correctly?', 'He was reluctant to jump into the cold lake.', ['She was reluctant to eat her favourite cake.', 'They were reluctant and eager to start.', 'The reluctant puppy raced to greet us.'], 'Reluctant means unwilling.']])),
  sk('XThes', 'Use thesaurus entries', 'Reference skills', G(4, 10), pairs({ items: THESAURUS.map(([e, s, a, w]) => [`${e}<br><br>Which word best completes the sentence?<br><em>${s}</em>`, a, fill(s, a), [a, ...w]]) })),
  sk('XAbcC', 'Order alphabetically: challenge', 'Reference skills', G(3, 5), () => {
    const W = ['ladder', 'lady', 'ladle', 'lagoon', 'laugh', 'launch', 'lantern', 'lamp', 'lane', 'landing'];
    const set = sample(W, 4), right = [...set].sort().join(', ');
    return mc('Which list is in ABC order?', right, uniq([shuffle(set).join(', '), [...set].sort().reverse().join(', '), shuffle(set).join(', ')]).filter(x => x !== right), `In ABC order: ${b(right)}.`);
  }),
  sk('XFwCx', 'Find words using context', 'Context clues', G(4, 8), blanks(FIND_WORD, 'Which word completes the sentence?')),
  sk('XDomP', 'Determine the meaning of domain-specific words with pictures', 'Context clues', G(4, 8), qa(DOMAIN_PICS.map(([e, w, m, wr]) => [`${big(e)}<br>What is a ${b(w)}?`, m, wr, `A ${w} is ${m}.`]))),
  sk('XRtMw', 'Use the meanings of words as clues to the meanings of Greek and Latin roots', 'Greek and Latin roots', G(4, 6), qa(ROOTS2.map(([ws, r, m, w]) => [`Look at these words: ${b(ws)}. What does the root ${b(r)} most likely mean?`, m, w, `The root ${r} means ${b(m)}.`]))),
  sk('XRtWc', 'Use words as clues to the meanings of Greek and Latin roots', 'Greek and Latin roots', G(5, 12), qa(ROOTS2.map(([ws, r, m, w]) => [`Each word contains the root ${b(r)}: ${ws}. What does ${b(r)} mean?`, m, w, `${r} means ${b(m)}.`]))),
  sk('XRtMt', 'Match words with Greek and Latin roots to their meanings', 'Greek and Latin roots', [4, 5], qa([['What does <strong>autograph</strong> mean?', 'a person\'s own signature', ['a moving car', 'a type of graph', 'a self-driving robot'], 'auto = self, graph = write.'],
    ['What does <strong>telescope</strong> mean?', 'a tool for seeing far away', ['a tool for hearing', 'a tiny picture', 'a long phone call'], 'tele = far, scope = see.'], ['What does <strong>biology</strong> mean?', 'the study of living things', ['the study of rocks', 'a life story', 'the study of stars'], 'bio = life, logy = study.'],
    ['What does <strong>microscope</strong> mean?', 'a tool for seeing tiny things', ['a tool for measuring heat', 'a small phone', 'a tiny map'], 'micro = small, scope = see.'], ['What does <strong>transport</strong> mean?', 'to carry across', ['to break apart', 'to write down', 'to look closely'], 'trans = across, port = carry.']])),
  ...[['XWPre', 'pre-', [['preheat', 'heat beforehand', ['heat again', 'not heat', 'heat badly']], ['prehistoric', 'before recorded history', ['after history', 'very historic', 'against history']], ['precaution', 'a step taken beforehand to prevent harm', ['a careless act', 'a later warning', 'an accident']], ['preview', 'a look ahead of time', ['a second look', 'a bad review', 'no view']]]],
    ['XWRe', 're-', [['rebuild', 'build again', ['build before', 'not build', 'build badly']], ['recycle', 'use again', ['throw away', 'use first', 'break apart']], ['reconsider', 'think about again', ['refuse to think', 'think before', 'forget']], ['reappear', 'appear again', ['disappear', 'appear first', 'never appear']]]],
    ['XWSub', 'sub-', [['submarine', 'a ship that travels under the sea', ['a ship above the sea', 'a fast car', 'a sea animal']], ['subway', 'an underground train', ['a train above ground', 'a sidewalk', 'a bridge']], ['subzero', 'below zero', ['above zero', 'exactly zero', 'very hot']], ['substandard', 'below the usual standard', ['above average', 'perfect', 'standard']]]],
    ['XWMis', 'mis-', [['misjudge', 'judge wrongly', ['judge again', 'judge before', 'not judge']], ['misunderstand', 'understand incorrectly', ['understand fully', 'understand again', 'refuse to listen']], ['mislead', 'lead in the wrong direction', ['lead well', 'lead again', 'follow']], ['misprint', 'a mistake in printing', ['a perfect copy', 'a reprint', 'a printer']]]],
    ['XWFul', '-ful', [['graceful', 'full of grace', ['without grace', 'not graceful', 'grace again']], ['plentiful', 'more than enough', ['not enough', 'empty', 'a little']], ['resentful', 'full of bitterness', ['forgiving', 'cheerful', 'calm']], ['boastful', 'full of bragging', ['humble', 'quiet', 'shy']]]],
    ['XWLess', '-less', [['fearless', 'without fear', ['full of fear', 'fear again', 'a little fear']], ['restless', 'unable to rest', ['well rested', 'sleepy', 'calm']], ['countless', 'too many to count', ['very few', 'counted', 'exactly one']], ['flawless', 'without flaws', ['full of flaws', 'broken', 'damaged']]]],
    ['XWAble', '-able and -ible', [['readable', 'able to be read', ['not readable', 'one who reads', 'read again']], ['visible', 'able to be seen', ['invisible', 'very bright', 'hidden']], ['flexible', 'able to bend', ['stiff', 'broken', 'heavy']], ['predictable', 'able to be predicted', ['surprising', 'unknown', 'random']]]]]
    .map(([k, aff, items]) => sk(k, `Words with ${aff}`, 'Prefixes and suffixes', G(5, 10), WORDS_WITH(aff.split(' ')[0], items))),
  /* ---------- editing, writing, research ---------- */
  sk('XCfEr', 'Correct errors with frequently confused words', 'Editing and revising', G(5, 12), qa(CONFUSED_ERR)),
  sk('XSigns', 'Correct errors with signs', 'Editing and revising', G(6, 12), qa(SIGNS.map(([s, a, w, n]) => [`${s}<br>Which is the correct version?`, a, w, n]))),
  sk('XPrlU', 'Use parallel structure', 'Writing clearly and concisely', G(7, 12), blanks(PARALLEL_USE, 'Which choice keeps the sentence parallel?')),
  sk('XActW', 'Rewrite the sentence in active voice', 'Active and passive voice', G(8, 10), qa(ACTIVE.map(([s, a, w]) => [`Which sentence is the active-voice version?<br><em>${s}</em>`, a, w, `In active voice, the doer comes first: ${b(a)}`]))),
  sk('XWcPr', 'Recognize the parts of a Works Cited entry (MLA 8th edition)', 'Research skills', G(9, 12), qa(WORKS_PARTS.map(([q, a, w]) => [q, a, w, `MLA order: Author. Title. Container, other contributors, version, number, publisher, date, location.`]))),
  sk('XBias', 'Evaluate newspaper headlines for bias', 'Research skills', G(6, 8), qa(HEADLINES.map(([q, a, w]) => [q, a, w, `${b(a)} — look for loaded words that show opinion.`]))),
  sk('XPers', 'Use personification', 'Creative techniques', G(6, 10), qa(PERSONIFY.map(([q, a, w]) => [q, a, w, `${b(a)} gives a human quality to something that is not human.`]))),
  sk('XArThe', 'Use the correct article: a, an or the', 'Articles', [3, 4], blanks([['I saw ___ owl in the tree.', 'an', ['a', 'the']], ['Please pass me ___ salt that is on the table.', 'the', ['a', 'an']],
    ['She has ___ new bike.', 'a', ['an', 'the']], ['___ sun is very bright today.', 'The', ['A', 'An']], ['He ate ___ orange for a snack.', 'an', ['a', 'the']], ['We visited ___ CN Tower in Toronto.', 'the', ['a', 'an']]]))
];
