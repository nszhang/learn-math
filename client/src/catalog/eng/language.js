/* English — Grammar, Mechanics and Vocabulary for grades 1–5, mostly generated from langData.js. */
import { classify, pairs } from '../quiz.js';
import { ri, pick, shuffle, sample, uniq, b, em, mc, misspell, ABC_WORDS } from './words.js';
import {
  NOUNS, wrongPlurals, IRREGULAR, REGULAR, wrongPast, SUBJECTS, PRESENT_VERBS, CONTRACTIONS_PRONOUN, CONTRACTIONS_NOT,
  ARTICLE_NOUNS, ADJ_COMPARE, wrongCompare, ADVERBS, ADJ_ADV, SYNONYMS, ANTONYMS, CATEGORIES, COMPOUNDS, AFFIX_WORDS,
  HOMOPHONES, MULTI, SHADES
} from './langData.js';

const sk = (k, t, s, g, gen) => ({ k, t, s, g, gen });
// action-verb sentences read naturally only with people as subjects ("The dog reads every night" does not)
const PEOPLE = SUBJECTS.filter(s => !/^(It|The dog|The birds)$/.test(s[0]));
const R = (a, z) => Array.from({ length: z - a + 1 }, (_, i) => a + i);
const cap = s => s[0].toUpperCase() + s.slice(1);
const lower = s => (/^(I|Grandpa|Mom and Dad)\b/.test(s) ? s : s[0].toLowerCase() + s.slice(1));

/* pick a word in a sentence: items [sentence, target, …] → which word is the X? */
const findWord = (label, items, why) => pairs({
  prompt: s => `Which word is ${label}?<br>${em(s)}`,
  items: items.map(([s, a]) => {
    const words = uniq(s.replace(/[.,!?]/g, '').split(' ').filter(w => w !== a && w.length > 1 && !/^(the|a|an|The|A|An)$/.test(w)));
    return [s, a, why(a), [a, ...words]];
  })
});

/* ---------- sentence banks ---------- */
const KIND_BANK = [
  ['The cat is asleep.', 'statement'], ['We went to the zoo.', 'statement'], ['My shoes are red.', 'statement'], ['It is raining today.', 'statement'],
  ['Where is my hat?', 'question'], ['Do you like pizza?', 'question'], ['Can we go outside?', 'question'], ['What time is it?', 'question'],
  ['Please close the door.', 'command'], ['Sit down.', 'command'], ['Wash your hands.', 'command'], ['Pass me the salt.', 'command'],
  ['Wow, what a big dog!', 'exclamation'], ['That was amazing!', 'exclamation'], ['I can\'t believe we won!', 'exclamation'], ['Oh no, the cake is burning!', 'exclamation']
];
const SUBJ_PRED = [
  ['My little brother', 'plays soccer.'], ['The old oak tree', 'fell in the storm.'], ['Our teacher', 'read us a story.'], ['A big brown bear', 'caught a fish.'],
  ['The children', 'laughed at the clown.'], ['Grandma', 'baked fresh bread.'], ['The red balloon', 'floated away.'], ['Six hungry ducks', 'swam across the pond.'],
  ['The girl in the yellow coat', 'waved to us.'], ['Our class', 'planted a garden.'], ['The noisy crowd', 'cheered for the team.'], ['My best friend', 'lives next door.']
];
const SIMPLE_SP = [ // [sentence, simple subject, simple predicate]
  ['The tall girl ran to the bus.', 'girl', 'ran'], ['My old dog sleeps all day.', 'dog', 'sleeps'], ['A loud storm shook the house.', 'storm', 'shook'], ['The young students painted a mural.', 'students', 'painted'],
  ['Our new teacher smiled at us.', 'teacher', 'smiled'], ['The tiny kitten climbed the tree.', 'kitten', 'climbed'], ['Two brave firefighters saved the cat.', 'firefighters', 'saved'], ['The happy baby clapped her hands.', 'baby', 'clapped']
];
const NOUN_BANK = [['The dog chased the ball.', 'dog'], ['My sister likes to swim.', 'sister'], ['We ate pizza for dinner.', 'pizza'], ['The bird sang a song.', 'bird'], ['I lost my red mitten.', 'mitten'],
  ['A frog jumped into the pond.', 'frog'], ['Dad fixed the old bike.', 'bike'], ['The teacher smiled at us.', 'teacher'], ['Our school has a big garden.', 'school'], ['She read a funny book.', 'book']];
const VERB_BANK = [['The dog barked loudly.', 'barked'], ['Maya kicked the ball.', 'kicked'], ['We swim in the lake.', 'swim'], ['The baby laughed.', 'laughed'], ['Tom painted a picture.', 'painted'],
  ['Birds fly south.', 'fly'], ['She jumps over the puddle.', 'jumps'], ['The chef chopped the onions.', 'chopped'], ['I hugged my grandma.', 'hugged'], ['The kids danced at the party.', 'danced']];
const ADJ_BANK = [['The red car is fast.', 'red'], ['I have a fluffy cat.', 'fluffy'], ['We saw a huge whale.', 'huge'], ['She wore a pretty dress.', 'pretty'], ['The soup is hot.', 'hot'],
  ['He found three shells.', 'three'], ['The tiny ant carried a crumb.', 'tiny'], ['It was a cold morning.', 'cold'], ['They live in a big house.', 'big'], ['A shiny coin fell out.', 'shiny']];
const ADV_BANK = ADVERBS.map(([a, , s]) => [s, a]);
const PREP_BANK = [
  ['The cat is hiding ___ the bed.', 'under', ['under', 'eat', 'happy', 'slowly']], ['We walked ___ the bridge.', 'across', ['across', 'jumped', 'green', 'loudly']],
  ['Put the milk ___ the fridge.', 'in', ['in', 'run', 'tall', 'quickly']], ['The bird flew ___ the clouds.', 'above', ['above', 'sing', 'blue', 'softly']],
  ['I sat ___ my two friends.', 'between', ['between', 'sat', 'funny', 'now']], ['The ball rolled ___ the hill.', 'down', ['down', 'kick', 'round', 'yesterday']],
  ['We ate lunch ___ noon.', 'at', ['at', 'eat', 'hungry', 'soon']], ['The book is ___ the shelf.', 'on', ['on', 'read', 'thick', 'here']],
  ['She walked ___ the door.', 'through', ['through', 'walked', 'wooden', 'later']], ['The dog sat ___ the fire.', 'near', ['near', 'sat', 'warm', 'gently']]
];
const PREP_ID = [['The kitten slept under the table.', 'under'], ['We swam across the lake.', 'across'], ['The plane flew above the clouds.', 'above'], ['She sat beside her brother.', 'beside'],
  ['I found my keys behind the sofa.', 'behind'], ['We walked through the forest.', 'through'], ['The book fell off the shelf.', 'off'], ['The cookies are inside the jar.', 'inside']];
const CONJ_BANK = [
  ['I like apples ___ bananas.', 'and', 'And joins two things.'], ['I wanted to play, ___ it was raining.', 'but', 'But shows a contrast.'],
  ['Do you want milk ___ juice?', 'or', 'Or gives a choice.'], ['It was cold, ___ I wore a coat.', 'so', 'So shows a result.'],
  ['We stayed inside ___ it was raining.', 'because', 'Because gives a reason.'], ['She is tired, ___ she keeps working.', 'but', 'But shows a contrast.'],
  ['You can draw ___ paint.', 'or', 'Or gives a choice.'], ['The dog was hungry, ___ we fed it.', 'so', 'So shows a result.'],
  ['I wore boots ___ the ground was muddy.', 'because', 'Because gives a reason.'], ['Sam ___ Ana went to the park.', 'and', 'And joins two people.']
];
const MODALS = [
  ['You ___ wear a helmet when you ride a bike. (it is necessary)', 'must'], ['___ I borrow your pencil? (asking permission)', 'May'],
  ['It ___ rain later; the sky is grey. (it is possible)', 'might'], ['I ___ swim across the pool. (I am able to)', 'can'],
  ['You ___ eat more vegetables. (it is a good idea)', 'should'], ['___ you help me carry this box? (polite request)', 'Could'],
  ['We ___ leave now or we will be late. (it is necessary)', 'must'], ['She ___ be at home; her car is in the driveway. (very likely)', 'must']
];
const HELP_BANK = [['She is running to school.', 'is', 'running'], ['They have finished their work.', 'have', 'finished'], ['We were laughing at the joke.', 'were', 'laughing'], ['I will visit my aunt.', 'will', 'visit'],
  ['He has eaten his lunch.', 'has', 'eaten'], ['The kids are playing outside.', 'are', 'playing'], ['You can ride my bike.', 'can', 'ride'], ['The birds were singing.', 'were', 'singing'], ['Mom was cooking dinner.', 'was', 'cooking'], ['I am reading a book.', 'am', 'reading']];

/* ---------- capitalization data ---------- */
const NAMES = ['Maya', 'Leo', 'Ava', 'Sam', 'Noah', 'Zoe', 'Omar', 'Lily', 'Ben', 'Aria'];
const PETS = ['Max', 'Bella', 'Coco', 'Rex', 'Luna', 'Buddy'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const HOLIDAYS = ['Canada Day', 'Thanksgiving', 'Halloween', 'New Year\'s Day', 'Valentine\'s Day', 'Earth Day'];
const PLACES = ['Toronto', 'Lake Ontario', 'the Rocky Mountains', 'Paris', 'the Pacific Ocean', 'Vancouver', 'the Nile River', 'Main Street', 'Ottawa', 'Mount Everest'];
const lowerProper = s => s.replace(/\b([A-Z])/g, (m, c, i) => (i === 0 && s.startsWith('the') ? m : c.toLowerCase()));

export const LANGUAGE_SPECS = [
  /* ================= Sentences ================= */
  sk('SnKd', 'Is the sentence a statement, question, command or exclamation?', 'Sentences, fragments and run-ons', [1, 2, 3], classify({
    categories: ['Statement', 'Question', 'Command', 'Exclamation'],
    prompt: s => `What kind of sentence is this?<br>${em(s)}`,
    items: KIND_BANK.map(([s, k]) => [s, cap(k), { statement: 'It tells something.', question: 'It asks something.', command: 'It tells someone to do something.', exclamation: 'It shows strong feeling.' }[k]])
  })),
  sk('SnDc', 'Is the sentence declarative, interrogative, imperative or exclamatory?', 'Sentences, fragments and run-ons', [4, 5], classify({
    categories: ['Declarative', 'Interrogative', 'Imperative', 'Exclamatory'],
    prompt: s => `What kind of sentence is this?<br>${em(s)}`,
    items: KIND_BANK.map(([s, k]) => [s, { statement: 'Declarative', question: 'Interrogative', command: 'Imperative', exclamation: 'Exclamatory' }[k],
      { statement: 'A declarative sentence makes a statement.', question: 'An interrogative sentence asks a question.', command: 'An imperative sentence gives a command.', exclamation: 'An exclamatory sentence shows strong feeling.' }[k]])
  })),
  sk('SbPd', 'Identify the complete subject or complete predicate of a sentence', 'Sentences, fragments and run-ons', [2, 3, 4, 5], () => {
    const [s, p] = pick(SUBJ_PRED); const askSubj = Math.random() < 0.5;
    const words = (s + ' ' + p).replace('.', '').split(' ');
    const cut = ri(1, words.length - 2);
    const wrong = [askSubj ? p.replace('.', '') : s, words.slice(0, cut === s.split(' ').length ? cut + 1 : cut).join(' '), words.slice(-2).join(' ')];
    return mc(`What is the complete ${askSubj ? 'subject' : 'predicate'} of this sentence?<br>${em(s + ' ' + p)}`, askSubj ? s : p.replace('.', ''), wrong,
      askSubj ? `The subject tells who or what the sentence is about: ${b(s)}.` : `The predicate tells what the subject does: ${b(p.replace('.', ''))}.`);
  }),
  sk('SmSP', 'Identify the simple subject or simple predicate of a sentence', 'Sentences, fragments and run-ons', [3, 4, 5], () => {
    const [s, subj, verb] = pick(SIMPLE_SP); const askSubj = Math.random() < 0.5;
    const words = uniq(s.replace('.', '').split(' ').filter(w => !/^(The|the|A|a|My|Our|to|at|all)$/.test(w)));
    return mc(`What is the simple ${askSubj ? 'subject' : 'predicate'}?<br>${em(s)}`, askSubj ? subj : verb, words,
      askSubj ? `The simple subject is the main noun: ${b(subj)}.` : `The simple predicate is the main verb: ${b(verb)}.`);
  }),
  sk('Unsc', 'Unscramble the words to make a complete sentence', 'Sentences, fragments and run-ons', [1, 2, 3, 4, 5], () => {
    const s = pick(SUBJ_PRED.map(([a, p]) => a + ' ' + p).concat(KIND_BANK.slice(0, 4).map(x => x[0])));
    const words = s.replace(/[.!?]$/, '').split(' ');
    const wrong = new Set();
    while (wrong.size < 3) { const w = shuffle(words).join(' '); if (w !== words.join(' ')) wrong.add(cap(w.toLowerCase()) + '.'); }
    return mc('Which group of words makes a complete sentence in the right order?', s, [...wrong], `The correct order is: ${b(s)}`);
  }),
  sk('SmCp', 'Is the sentence simple or compound?', 'Sentences, fragments and run-ons', [3, 4, 5], classify({
    categories: ['Simple', 'Compound'],
    prompt: s => `Is this sentence simple or compound?<br>${em(s)}`,
    items: [
      ['The dog barked at the mail carrier.', 'Simple', 'One complete thought.'], ['The dog barked, and the cat hid.', 'Compound', 'Two complete thoughts joined by "and".'],
      ['We went to the beach.', 'Simple', 'One complete thought.'], ['We went to the beach, but it rained.', 'Compound', 'Two complete thoughts joined by "but".'],
      ['Maya and Leo played chess.', 'Simple', 'One complete thought with two subjects.'], ['Maya played chess, and Leo watched.', 'Compound', 'Two complete thoughts.'],
      ['I can draw a cat or a dog.', 'Simple', 'One complete thought.'], ['You can draw, or you can paint.', 'Compound', 'Two complete thoughts joined by "or".'],
      ['It was cold, so we wore mittens.', 'Compound', 'Two complete thoughts joined by "so".'], ['The tall man ran and jumped.', 'Simple', 'One subject with two verbs.']
    ]
  })),

  /* ================= Nouns ================= */
  sk('NnKd', 'Is the noun a person, animal, place or thing?', 'Nouns', [1, 2], classify({
    categories: ['Person', 'Animal', 'Place', 'Thing'],
    prompt: w => `Is ${b(w)} a person, animal, place or thing?`,
    items: [['teacher', 'Person'], ['doctor', 'Person'], ['baby', 'Person'], ['farmer', 'Person'], ['sister', 'Person'], ['horse', 'Animal'], ['frog', 'Animal'], ['owl', 'Animal'], ['shark', 'Animal'], ['puppy', 'Animal'],
      ['school', 'Place'], ['park', 'Place'], ['beach', 'Place'], ['library', 'Place'], ['kitchen', 'Place'], ['pencil', 'Thing'], ['ball', 'Thing'], ['chair', 'Thing'], ['cup', 'Thing'], ['kite', 'Thing']]
      .map(([w, c]) => [w, c, `A ${w} is a ${c.toLowerCase()}.`])
  })),
  sk('NnSl', 'Identify nouns in a sentence', 'Nouns', [1, 2, 3], findWord('a noun', NOUN_BANK, a => `${b(a)} names a person, place, animal or thing.`)),
  sk('NnCP', 'Sort common and proper nouns', 'Nouns', [1, 2, 3, 4, 5], classify({
    categories: ['Common noun', 'Proper noun'],
    prompt: w => `Is ${b(w)} a common noun or a proper noun?`,
    items: [['city', 'Common noun'], ['Toronto', 'Proper noun'], ['dog', 'Common noun'], ['Max', 'Proper noun'], ['day', 'Common noun'], ['Monday', 'Proper noun'], ['river', 'Common noun'], ['Amazon River', 'Proper noun'],
      ['teacher', 'Common noun'], ['Mrs. Patel', 'Proper noun'], ['country', 'Common noun'], ['Canada', 'Proper noun'], ['month', 'Common noun'], ['July', 'Proper noun'], ['holiday', 'Common noun'], ['Halloween', 'Proper noun']]
      .map(([w, c]) => [w, c, c === 'Proper noun' ? 'A proper noun names a specific person, place or thing and starts with a capital letter.' : 'A common noun names any person, place or thing.'])
  })),
  sk('NnAb', 'Identify nouns – with abstract nouns', 'Nouns', [3, 4, 5], classify({
    categories: ['Concrete noun', 'Abstract noun'],
    prompt: w => `Is ${b(w)} a concrete noun or an abstract noun?`,
    items: [['happiness', 'Abstract noun'], ['courage', 'Abstract noun'], ['friendship', 'Abstract noun'], ['love', 'Abstract noun'], ['freedom', 'Abstract noun'], ['honesty', 'Abstract noun'], ['fear', 'Abstract noun'], ['idea', 'Abstract noun'],
      ['table', 'Concrete noun'], ['apple', 'Concrete noun'], ['river', 'Concrete noun'], ['teacher', 'Concrete noun'], ['pillow', 'Concrete noun'], ['music box', 'Concrete noun'], ['rock', 'Concrete noun'], ['puppy', 'Concrete noun']]
      .map(([w, c]) => [w, c, c === 'Abstract noun' ? 'An abstract noun names an idea or feeling you cannot touch.' : 'A concrete noun names something you can see or touch.'])
  })),
  ...[['PlS', 'Form regular plurals with -s and -es', ['s', 'es'], [1, 2]], ['PlI', 'Form regular plurals with -s, -es and -ies', ['s', 'es', 'ies'], [3]],
    ['PlV', 'Form regular plurals with -s, -es, -ies and -ves', ['s', 'es', 'ies', 'ves'], [4]], ['PlF', 'Form plurals of nouns ending in f, fe, o and y', ['ies', 'ves', 'oes', 's'], [5]],
    ['PlR', 'Form and use irregular plurals', ['irr'], [2, 3, 4, 5]]].map(([k, t, rules, g]) =>
    sk(k, t, 'Nouns', g, () => {
      const [sg, pl, rule] = pick(NOUNS.filter(n => rules.includes(n[2])));
      const tip = { s: 'Most nouns just add -s.', es: 'Nouns ending in s, x, sh or ch add -es.', ies: 'Change the y to i and add -es.', ves: 'Change the f or fe to v and add -es.', oes: 'Some nouns ending in o add -es.', irr: 'This is an irregular plural — it does not follow the usual rules.' }[rule];
      return mc(`What is the plural of ${b(sg)}?`, pl, wrongPlurals(sg, pl), `${tip} ${b(sg)} → ${b(pl)}.`);
    })),
  sk('NnSP', 'Is the noun singular or plural?', 'Nouns', [2, 3, 4], () => {
    const [sg, pl] = pick(NOUNS.filter(n => n[0] !== n[1])); const plural = Math.random() < 0.5;
    return mc(`Is ${b(plural ? pl : sg)} singular or plural?`, plural ? 'Plural' : 'Singular', ['Singular', 'Plural'], plural ? 'It names more than one.' : 'It names only one.', 2);
  }),
  sk('NnPs', 'Form the singular or plural possessive', 'Nouns', R(2, 8), () => {
    const [sg, pl] = pick(NOUNS.filter(n => /^(cat|dog|girl|bird|baby|puppy|child|man|woman|teacher|fox|boy|mouse|goose|person)$/.test(n[0])).concat([['teacher', 'teachers', 's']]));
    const plural = Math.random() < 0.5;
    const answer = plural ? (pl.endsWith('s') ? pl + "'" : pl + "'s") : sg + "'s";
    const wrong = uniq([sg + "'", sg + "s'", pl + "'s", pl + "'", pl + "s'", pl, sg + 's']).filter(x => x !== answer);
    return mc(`Which shows that something belongs to ${plural ? `more than one ${b(sg)} (${pl})` : `one ${b(sg)}`}?<br>the ___ toys`, answer, wrong,
      plural ? (pl.endsWith('s') ? `Plural nouns ending in s just add an apostrophe: ${b(answer)}.` : `Plural nouns not ending in s add 's: ${b(answer)}.`) : `Singular nouns add 's: ${b(answer)}.`);
  }),
  sk('NnPi', 'Identify plurals, singular possessives and plural possessives', 'Nouns', R(2, 8), () => {
    const [sg, pl] = pick(NOUNS.filter(n => n[2] === 's' && n[0] !== n[1]));
    const forms = [[pl, 'Plural'], [sg + "'s", 'Singular possessive'], [pl + "'", 'Plural possessive']];
    const [w, kind] = pick(forms);
    return mc(`Is ${b(w)} a plural, a singular possessive or a plural possessive?`, kind, ['Plural', 'Singular possessive', 'Plural possessive'],
      { Plural: 'It means more than one, with no ownership.', 'Singular possessive': 'One owner: \'s.', 'Plural possessive': 'Many owners: s\'.' }[kind], 3);
  }),

  /* ================= Pronouns ================= */
  sk('PrRp', 'Replace the noun with a personal pronoun', 'Pronouns', [1, 2, 3, 4, 5], () => {
    const [n, p] = pick([['Mom', 'She'], ['Dad', 'He'], ['My grandpa', 'He'], ['My aunt', 'She'], ['The boys', 'They'], ['The dog', 'It'], ['The cars', 'They'], ['Leo and I', 'We'], ['The girls', 'They'], ['The kite', 'It'], ['My brother', 'He'], ['The queen', 'She'], ['The trees', 'They'], ['My friends and I', 'We']]);
    const v = /^(They|We)$/.test(p) ? 'are' : 'is';
    return mc(`Which pronoun can replace the underlined words?<br><u>${n}</u> ${v} outside.`, p, ['He', 'She', 'It', 'They', 'We'], `${b(n)} can be replaced by ${b(p)}.`);
  }),
  sk('PrSO', 'Choose between subject and object personal pronouns', 'Pronouns', [1, 2, 3, 4, 5, 6], () => {
    const [s, o] = pick([['I', 'me'], ['he', 'him'], ['she', 'her'], ['we', 'us'], ['they', 'them']]);
    const asSubj = Math.random() < 0.5;
    const sent = asSubj ? pick([`___ went to the park.`, `___ like to read.`, `___ can swim fast.`]) : pick([`Grandma hugged ___.`, `The coach called ___.`, `Please wait for ___.`]);
    const ans = asSubj ? cap(s) : o;
    return mc(`Complete the sentence.<br>${em(sent)}`, ans, asSubj ? [cap(o)] : [s === 'I' ? 'I' : s], asSubj ? `Use a subject pronoun before the verb: ${b(ans)}.` : `Use an object pronoun after the verb or preposition: ${b(ans)}.`, 2);
  }),
  sk('PrIm', 'Compound subjects and objects with "I" and "me"', 'Pronouns', R(2, 6), () => {
    const name = pick(NAMES); const subj = Math.random() < 0.5;
    const sent = subj ? `${name} and ___ ${pick(['built a fort.', 'went to the library.', 'played tag.'])}` : `${pick(['Dad drove', 'Grandpa called', 'The teacher thanked'])} ${name} and ___.`;
    return mc(`Complete the sentence.<br>${em(sent)}`, subj ? 'I' : 'me', ['I', 'me'], subj ? 'Use "I" as part of the subject. Test: "I built a fort."' : 'Use "me" after the verb. Test: "Dad drove me."', 2);
  }),
  sk('PrPs', 'Use possessive pronouns', 'Pronouns', [1, 2, 3, 4, 5], () => {
    const [who, adj, pro] = pick([['I', 'my', 'mine'], ['you', 'your', 'yours'], ['he', 'his', 'his'], ['she', 'her', 'hers'], ['we', 'our', 'ours'], ['they', 'their', 'theirs']]);
    const before = Math.random() < 0.5;
    const subj = cap(who === 'I' ? 'I' : who);
    const sent = before ? `${subj} lost ___ backpack.` : `That backpack belongs to ${who === 'I' ? 'me' : { you: 'you', he: 'him', she: 'her', we: 'us', they: 'them' }[who]}. It is ___.`;
    return mc(`Complete the sentence.<br>${em(sent)}`, before ? adj : pro, ['my', 'mine', 'your', 'yours', 'his', 'her', 'hers', 'our', 'ours', 'their', 'theirs'].filter(x => x !== (before ? adj : pro)).slice(0, 10),
      `${b(before ? adj : pro)} shows who owns it.`);
  }),
  sk('PrRf', 'Use reflexive pronouns', 'Pronouns', R(2, 6), () => {
    const [s, r] = pick([['I', 'myself'], ['You', 'yourself'], ['He', 'himself'], ['She', 'herself'], ['We', 'ourselves'], ['They', 'themselves']]);
    return mc(`Complete the sentence.<br>${em(`${s} made the card ___.`)}`, r, ['myself', 'yourself', 'himself', 'herself', 'ourselves', 'themselves', 'hisself', 'theirselves'], `${b(s)} goes with ${b(r)}.`);
  }),

  /* ================= Verbs ================= */
  sk('VbAc', 'Identify action verbs', 'Verb types', [1, 2, 3], findWord('the action verb', VERB_BANK, a => `${b(a)} tells what someone or something does.`)),
  sk('VbHp', 'Identify main verbs and helping verbs', 'Verb types', [2, 3, 4, 5], () => {
    const [s, help, main] = pick(HELP_BANK); const askHelp = Math.random() < 0.5;
    const words = uniq(s.replace('.', '').split(' '));
    return mc(`What is the ${askHelp ? 'helping' : 'main'} verb?<br>${em(s)}`, askHelp ? help : main, words, `${b(help)} helps the main verb ${b(main)}.`);
  }),
  sk('VbMd', 'Use the correct modal verb', 'Verb types', [4, 5], pairs({
    prompt: s => `Choose the best modal verb.<br>${em(s)}`,
    items: MODALS.map(([s, a]) => [s, a, `${b(a)} matches the meaning in parentheses.`, [a, ...['must', 'might', 'can', 'should', 'may'].filter(x => x !== a.toLowerCase()).map(x => (/^[A-Z]/.test(a) ? cap(x) : x))]])
  })),

  /* ================= Subject-verb agreement ================= */
  sk('SvUs', 'Use the correct subject or verb', 'Subject-verb agreement', [1, 2, 3, 4, 5], () => {
    const [subj, key] = pick(PEOPLE.filter(s => s[1] !== 'I' && s[1] !== 'you'));
    const [base, s3, rest] = pick(PRESENT_VERBS);
    const ans = key === '3s' ? s3 : base;
    return mc(`Complete the sentence.<br>${em(`${subj} ___ ${rest}.`)}`, ans, [base, s3], key === '3s' ? `One person or thing: add -s → ${b(s3)}.` : `More than one: no -s → ${b(base)}.`, 2);
  }),
  sk('SvBe', 'To be: use the correct form', 'Subject-verb agreement', [1, 2, 3, 4], () => {
    const [subj, key] = pick(SUBJECTS); const past = Math.random() < 0.5;
    const ans = past ? (key === 'I' || key === '3s' ? 'was' : 'were') : { I: 'am', you: 'are', '3s': 'is', pl: 'are' }[key];
    const sent = past ? `Yesterday, ${lower(subj)} ___ very tired.`.replace('Yesterday, i ', 'Yesterday, I ') : `${subj} ___ happy today.`;
    return mc(`Complete the sentence.<br>${em(sent)}`, ans, past ? ['was', 'were'] : ['am', 'is', 'are'], `${b(subj)} goes with ${b(ans)}.`, past ? 2 : 3);
  }),
  sk('SvHv', 'To have: use the correct form', 'Subject-verb agreement', [1, 2, 3, 4], () => {
    const [subj, key] = pick(PEOPLE);
    const ans = key === '3s' ? 'has' : 'have';
    return mc(`Complete the sentence.<br>${em(`${subj} ___ a red umbrella.`)}`, ans, ['has', 'have'], `${b(subj)} goes with ${b(ans)}.`, 2);
  }),

  /* ================= Verb tense ================= */
  sk('TnRg', 'Form and use the regular past tense', 'Verb tense', [1, 2, 3, 4, 5], () => {
    const [base, past] = pick(REGULAR);
    return mc(`What is the past tense of ${b(base)}?<br>${em(`Yesterday, we ___.`)}`, past, wrongPast(base, past), `${b(base)} → ${b(past)}.`);
  }),
  ...[0, 1, 2, 3].map(set => sk('TnI' + (set + 1), `Form and use the irregular past tense: set ${set + 1}`, 'Verb tense', [2, 3, 4, 5], () => {
    const pool = IRREGULAR.slice(set * 11, set * 11 + 12);
    const [base, past, , obj] = pick(pool);
    const subj = pick(['Yesterday, I', 'Last week, Maya', 'Last night, we', 'On Saturday, the kids']);
    return mc(`Complete the sentence with the past tense of ${b(base)}.<br>${em(`${subj} ___ ${obj}.`)}`, past, uniq([base + 'ed', base, base + 's', pick(IRREGULAR)[1], pick(IRREGULAR)[1]]), `${b(base)} is irregular: the past tense is ${b(past)}.`);
  })),
  sk('TnPP', 'Choose between the past tense and past participle', 'Verb tense', [4, 5], () => {
    const [base, past, pp, obj] = pick(IRREGULAR.filter(v => v[1] !== v[2]));
    const usePP = Math.random() < 0.5;
    const sent = usePP ? `Maya has ___ ${obj}.` : `Yesterday, Maya ___ ${obj}.`;
    return mc(`Complete the sentence.<br>${em(sent)}`, usePP ? pp : past, [past, pp], usePP ? `After "has" or "have", use the past participle: ${b(pp)}.` : `For a finished action in the past, use the past tense: ${b(past)}.`, 2);
  }),
  sk('TnPF', 'Is the sentence in the past, present or future tense?', 'Verb tense', [1, 2, 3, 4, 5], () => {
    const [subj, key] = pick(PEOPLE.filter(s => s[1] === '3s' || s[1] === 'pl'));
    const [base, s3, rest] = pick(PRESENT_VERBS);
    const irr = IRREGULAR.find(v => v[0] === base); const reg = REGULAR.find(v => v[0] === base);
    const past = irr ? irr[1] : reg ? reg[1] : base + 'ed';
    const t = pick(['Past', 'Present', 'Future']);
    const sent = t === 'Past' ? `${subj} ${past} ${rest} yesterday.` : t === 'Present' ? `${subj} ${key === '3s' ? s3 : base} ${rest} every day.` : `${subj} will ${base} ${rest} tomorrow.`;
    return mc(`Is this sentence in the past, present or future tense?<br>${em(sent)}`, t, ['Past', 'Present', 'Future'], { Past: 'It already happened.', Present: 'It happens now or regularly.', Future: '"Will" shows it has not happened yet.' }[t], 3);
  }),
  sk('TnFt', 'Change the sentence to future tense', 'Verb tense', [2, 3, 4], () => {
    const [subj, key] = pick(PEOPLE.filter(s => s[1] === '3s' || s[1] === 'pl'));
    const [base, s3, rest] = pick(PRESENT_VERBS);
    const now = `${subj} ${key === '3s' ? s3 : base} ${rest}.`;
    const ans = `${subj} will ${base} ${rest}.`;
    return mc(`Which sentence is in the future tense?<br><small class="muted">${em(now)}</small>`, ans, [`${subj} will ${s3} ${rest}.`, `${subj} willed ${base} ${rest}.`, `${subj} ${key === '3s' ? s3 : base} ${rest} will.`], `Future tense = will + base verb: ${b(ans)}`);
  }),

  /* ================= Articles ================= */
  sk('ArAn', 'Use the correct article: a or an', 'Articles', [1, 2, 3, 4], () => {
    const [n, art] = pick(ARTICLE_NOUNS);
    return mc(`Which article goes before ${b(n)}?`, art, ['a', 'an'], art === 'an' ? `Use ${b('an')} before a vowel sound.` : `Use ${b('a')} before a consonant sound${/^u|^one/.test(n) ? ' — "u" here sounds like "you"/"w"' : ''}.`, 2);
  }),
  sk('ArId', 'Identify articles', 'Articles', [1, 2, 3, 4], () => {
    const [n, art] = pick(ARTICLE_NOUNS.filter(x => !/ /.test(x[0])));
    const s = `I saw ${art} ${n} at the market.`;
    return mc(`Which word is an article?<br>${em(s)}`, art, ['saw', n, 'market', 'at'], `${b(art)} is an article (a, an, the).`);
  }),

  /* ================= Adjectives and adverbs ================= */
  sk('AdKd', 'Does the adjective tell you what kind or how many?', 'Adjectives and adverbs', [1, 2, 3, 4], classify({
    categories: ['What kind', 'How many'],
    prompt: s => `Does the underlined adjective tell what kind or how many?<br>${s}`,
    items: [['I have <u>three</u> pets.', 'How many'], ['She found <u>five</u> shells.', 'How many'], ['We saw <u>many</u> stars.', 'How many'], ['There are <u>two</u> cookies left.', 'How many'], ['<u>Several</u> kids came.', 'How many'], ['He ate <u>ten</u> grapes.', 'How many'],
      ['I have a <u>fluffy</u> cat.', 'What kind'], ['She wore a <u>red</u> scarf.', 'What kind'], ['It was a <u>sunny</u> day.', 'What kind'], ['He told a <u>funny</u> joke.', 'What kind'], ['We climbed a <u>tall</u> tree.', 'What kind'], ['The soup was <u>hot</u>.', 'What kind']]
      .map(([s, c]) => [s, c, c === 'How many' ? 'It tells a number or amount.' : 'It describes what the noun is like.'])
  })),
  sk('AdIdE', 'Identify adjectives', 'Adjectives and adverbs', [1, 2, 3, 4, 5], findWord('an adjective', ADJ_BANK, a => `${b(a)} describes a noun.`)),
  sk('AdCm', 'Use adjectives to compare', 'Adjectives and adverbs', [1, 2, 3, 4, 5], () => {
    const [adj, comp, sup, noun] = pick(ADJ_COMPARE); const two = Math.random() < 0.5;
    const s = two ? `This ${noun} is ___ than that one.` : `This is the ___ ${noun} of all.`;
    return mc(`Complete the sentence using ${b(adj)}.<br>${em(s)}`, two ? comp : sup, [comp, sup, ...wrongCompare(adj, two ? comp : sup)].slice(0, 6),
      two ? `Comparing two: ${b(comp)}.` : `Comparing three or more: ${b(sup)}.`);
  }),
  sk('AdSpE', 'Spell adjectives that compare', 'Adjectives and adverbs', [3, 4, 5], () => {
    const [adj, comp, sup] = pick(ADJ_COMPARE.filter(a => !a[1].startsWith('more') && !['good', 'bad'].includes(a[0])));
    const sup2 = Math.random() < 0.5;
    return mc(`Which is the correct spelling of the ${sup2 ? 'superlative' : 'comparative'} form of ${b(adj)}?`, sup2 ? sup : comp, wrongCompare(adj, sup2 ? sup : comp).filter(x => sup2 ? /est$|most/.test(x) : /er$|more/.test(x)),
      `${b(adj)} → ${b(comp)} → ${b(sup)}.`);
  }),
  sk('AvHw', 'Does the adverb tell you how, when or where?', 'Adjectives and adverbs', [2, 3, 4, 5], () => {
    const [adv, kind, s] = pick(ADVERBS);
    return mc(`Does the adverb ${b(adv)} tell how, when or where?<br>${em(s)}`, cap(kind), ['How', 'When', 'Where'], `${b(adv)} tells ${kind}.`, 3);
  }),
  sk('AvIdE', 'Identify adverbs', 'Adjectives and adverbs', [2, 3, 4, 5], findWord('an adverb', ADV_BANK, a => `${b(a)} tells how, when or where.`)),
  sk('AjOr', 'Is the word an adjective or adverb?', 'Adjectives and adverbs', [2, 3, 4, 5], () => {
    const [adj, adv] = pick(ADJ_ADV); const isAdv = Math.random() < 0.5;
    return mc(`Is ${b(isAdv ? adv : adj)} an adjective or an adverb?`, isAdv ? 'Adverb' : 'Adjective', ['Adjective', 'Adverb'], isAdv ? `${b(adv)} describes a verb (how something is done).` : `${b(adj)} describes a noun.`, 2);
  }),

  /* ================= Prepositions / conjunctions ================= */
  sk('PpBs', 'Select the best preposition to complete the sentence', 'Prepositions', [1, 2, 3], pairs({
    prompt: s => `Choose the preposition that best completes the sentence.<br>${em(s)}`,
    items: PREP_BANK.map(([s, a, w]) => [s, a, `${b(a)} tells where or when.`, w])
  })),
  sk('PpId', 'Identify prepositions', 'Prepositions', [3, 4, 5], findWord('a preposition', PREP_ID, a => `${b(a)} shows how a noun relates to another word.`)),
  sk('CjUs', 'Use conjunctions', 'Conjunctions', [1, 2, 3], pairs({
    prompt: s => `Choose the conjunction that best completes the sentence.<br>${em(s)}`,
    items: CONJ_BANK.map(([s, a, n]) => [s, a, n, ['and', 'but', 'or', 'so', 'because']])
  })),
  sk('CjId', 'Identify coordinating and subordinating conjunctions', 'Conjunctions', [3, 4, 5], classify({
    categories: ['Coordinating conjunction', 'Subordinating conjunction'],
    prompt: w => `What kind of conjunction is ${b(w)}?`,
    items: [['and', 'Coordinating conjunction'], ['but', 'Coordinating conjunction'], ['or', 'Coordinating conjunction'], ['so', 'Coordinating conjunction'], ['yet', 'Coordinating conjunction'], ['for', 'Coordinating conjunction'], ['nor', 'Coordinating conjunction'],
      ['because', 'Subordinating conjunction'], ['although', 'Subordinating conjunction'], ['when', 'Subordinating conjunction'], ['unless', 'Subordinating conjunction'], ['since', 'Subordinating conjunction'], ['while', 'Subordinating conjunction'], ['if', 'Subordinating conjunction']]
      .map(([w, c]) => [w, c, c.startsWith('Coord') ? 'Coordinating conjunctions (FANBOYS) join equal parts.' : 'Subordinating conjunctions begin a dependent clause.'])
  })),
  sk('CjCr', 'Use the correct pair of correlative conjunctions', 'Conjunctions', R(5, 8), pairs({
    prompt: s => `Choose the correct pair.<br>${em(s)}`,
    items: [
      ['___ Maya ___ Leo can come.', 'Both … and', 'Both … and joins two things.', ['Both … and', 'Either … nor', 'Neither … or', 'Not only … or']],
      ['You can have ___ soup ___ salad.', 'either … or', 'Either … or gives a choice.', ['either … or', 'neither … or', 'both … or', 'whether … and']],
      ['___ the cat ___ the dog was hungry.', 'Neither … nor', 'Neither … nor means not one and not the other.', ['Neither … nor', 'Either … nor', 'Both … or', 'Whether … nor']],
      ['She is ___ smart ___ kind.', 'not only … but also', 'Not only … but also adds emphasis.', ['not only … but also', 'either … and', 'neither … or', 'both … or']],
      ['I don\'t know ___ to laugh ___ cry.', 'whether … or', 'Whether … or shows two possibilities.', ['whether … or', 'both … and', 'neither … or', 'either … nor']],
      ['___ my brother ___ my sister likes broccoli.', 'Neither … nor', 'Neither … nor: not one and not the other.', ['Neither … nor', 'Both … nor', 'Either … and', 'Not only … or']]
    ]
  })),

  /* ================= Contractions ================= */
  sk('CtPv', 'Form pronoun-verb contractions', 'Contractions', [1, 2, 3, 4, 5], () => {
    const [full, c] = pick(CONTRACTIONS_PRONOUN);
    return mc(`What is the contraction for ${b(full)}?`, c, CONTRACTIONS_PRONOUN.map(x => x[1]).concat([full.replace(' ', '') , full.split(' ')[0] + "'" + full.split(' ')[1]]), `${b(full)} → ${b(c)}. The apostrophe takes the place of missing letters.`);
  }),
  sk('CtNt', 'Form contractions with "not"', 'Contractions', [1, 2, 3, 4, 5], () => {
    const [full, c] = pick(CONTRACTIONS_NOT);
    const [w] = full.split(' ');
    return mc(`What is the contraction for ${b(full)}?`, c, [w + "n't", w + "'nt", w + 'nt', w + "no't", ...CONTRACTIONS_NOT.map(x => x[1])].filter(x => x !== c), `${b(full)} → ${b(c)}.`);
  }),

  /* ================= Commas ================= */
  sk('CmDt', 'Commas with dates', 'Commas', [2, 3, 4], () => {
    const m = pick(MONTHS), d = ri(1, 28), y = ri(1990, 2030);
    const ok = `${m} ${d}, ${y}`;
    return mc('Which date is written correctly?', ok, [`${m}, ${d} ${y}`, `${m} ${d} ${y}`, `${m}, ${d}, ${y}`, `${m} ${d}${y}`], `Put a comma between the day and the year: ${b(ok)}.`);
  }),
  sk('CmDA', 'Commas with direct addresses and after introductory words', 'Commas', [3, 4, 5], () => {
    const n = pick(NAMES);
    const variants = pick([
      [`${n}, please pass the salt.`, [`${n} please pass the salt.`, `${n} please, pass the salt.`, `${n}, please pass, the salt.`], 'Use a comma after a name when you speak to someone.'],
      [`Thank you, ${n}.`, [`Thank you ${n}.`, `Thank, you ${n}.`, `Thank you ${n},.`], 'Use a comma before a name at the end when you speak to someone.'],
      [`Yes, I can help.`, [`Yes I can help.`, `Yes I, can help.`, `Yes I can, help.`], 'Use a comma after an introductory word like yes or no.'],
      [`Well, that was fun.`, [`Well that was fun.`, `Well that, was fun.`, `Well that was, fun.`], 'Use a comma after an introductory word like well.'],
      [`No, thank you.`, [`No thank you.`, `No thank, you.`, `No, thank, you.`], 'Use a comma after "no" at the start of a sentence.'],
      [`Do you want to play, ${n}?`, [`Do you want to play ${n}?`, `Do you, want to play ${n}?`, `Do you want, to play ${n}?`], 'Use a comma before a name at the end when you speak to someone.']
    ]);
    return mc('Which sentence uses commas correctly?', variants[0], variants[1], variants[2]);
  }),
  sk('CmSrE', 'Commas in a series', 'Commas', [2, 3, 4, 5], () => {
    const items = sample(['apples', 'pears', 'grapes', 'plums', 'carrots', 'peas', 'corn', 'beans'], 3);
    const ok = `We bought ${items[0]}, ${items[1]}, and ${items[2]}.`;
    return mc('Which sentence uses commas correctly?', ok, [`We bought ${items[0]} ${items[1]} and ${items[2]}.`, `We bought, ${items[0]}, ${items[1]}, and ${items[2]}.`, `We bought ${items[0]}, ${items[1]}, and, ${items[2]}.`], 'Use commas to separate items in a list.');
  }),

  /* ================= Capitalization ================= */
  sk('CpNP', 'Capitalize the names of people and pets', 'Capitalization', [1, 2, 3], () => {
    const n = pick(NAMES), p = pick(PETS);
    const ok = `${n} has a dog named ${p}.`;
    return mc('Which sentence is capitalized correctly?', ok, [`${n.toLowerCase()} has a dog named ${p}.`, `${n} has a dog named ${p.toLowerCase()}.`, `${n} has a Dog named ${p}.`], 'Names of people and pets begin with capital letters.');
  }),
  sk('CpDM', 'Capitalize days, months and holidays', 'Capitalization', [1, 2, 3, 4], () => {
    const d = pick(DAYS), m = pick(MONTHS), h = pick(HOLIDAYS);
    const v = pick([
      [`My party is on ${d}.`, [`My party is on ${d.toLowerCase()}.`, `My Party is on ${d.toLowerCase()}.`, `my party is on ${d}.`]],
      [`School starts in ${m}.`, [`School starts in ${m.toLowerCase()}.`, `school starts in ${m}.`, `School Starts in ${m.toLowerCase()}.`]],
      [`We love ${h}.`, [`We love ${h.toLowerCase()}.`, `we love ${h}.`, `We Love ${h.toLowerCase()}.`]]
    ]);
    return mc('Which sentence is capitalized correctly?', v[0], v[1], 'Days, months and holidays begin with capital letters.');
  }),
  sk('CpPG', 'Capitalize the names of places and geographic features', 'Capitalization', [2, 3, 4], () => {
    const p = pick(PLACES);
    const ok = `We visited ${p} last summer.`;
    return mc('Which sentence is capitalized correctly?', ok, [`We visited ${lowerProper(p)} last summer.`, `we visited ${p} last summer.`, `We visited ${p} last Summer.`], 'Names of specific places begin with capital letters.');
  }),
  sk('CpSI', 'Capitalize sentences and the pronoun "I"', 'Capitalization', [1], () => {
    const s = pick(['I like to swim.', 'Mom and I baked cookies.', 'Can I play too?', 'Today I saw a fox.', 'My friend and I ran fast.']);
    return mc('Which sentence is capitalized correctly?', s, [s.replace(/\bI\b/g, 'i'), s[0].toLowerCase() + s.slice(1), s.replace(/\bI\b/g, 'i').replace(/^./, c => c.toLowerCase())].filter(x => x !== s), 'Start every sentence with a capital letter, and always write "I" as a capital.');
  }),
  sk('CpHN', 'Capitalize historical events, nationalities and languages', 'Capitalization', [4, 5], () => {
    const [ok, w] = pick([
      ['She speaks French and Spanish.', ['She speaks french and spanish.', 'She speaks French and spanish.', 'she speaks French and Spanish.']],
      ['My grandfather is Italian.', ['My grandfather is italian.', 'My Grandfather is italian.', 'my grandfather is Italian.']],
      ['We studied the Second World War.', ['We studied the second world war.', 'We studied the Second world war.', 'We Studied the second World War.']],
      ['The Middle Ages lasted for centuries.', ['The middle ages lasted for centuries.', 'The Middle ages lasted for centuries.', 'the middle Ages lasted for centuries.']],
      ['They signed the Declaration of Independence.', ['They signed the declaration of independence.', 'They signed the Declaration of independence.', 'They Signed the declaration of Independence.']],
      ['I love Mexican food.', ['I love mexican food.', 'I love Mexican Food.', 'i love mexican food.']]
    ]);
    return mc('Which sentence is capitalized correctly?', ok, w, 'Historical events, documents, nationalities and languages are capitalized.');
  }),
  sk('FmGC', 'Greetings and closings of letters', 'Formatting', [2, 3, 4], () => {
    const greet = Math.random() < 0.5;
    if (greet) {
      const n = pick(['Grandma', 'Uncle Joe', 'Ms. Lee', 'Sam', 'Aunt Rosa']);
      return mc('Which greeting is written correctly?', `Dear ${n},`, [`dear ${n},`, `Dear ${n}`, `Dear ${n.toLowerCase()},`, `Dear ${n}.`], 'Capitalize the first word and the name, and end with a comma.');
    }
    const c = pick(['Your friend', 'Love', 'Sincerely', 'Best wishes', 'Your grandson']);
    const wrong = [c + '.', c.toLowerCase() + ',', c.split(' ').map(cap).join(' ') + ','].filter(x => x !== c + ',');
    return mc('Which closing is written correctly?', c + ',', wrong, 'Capitalize only the first word of a closing and end it with a comma.');
  }),

  /* ================= Vocabulary ================= */
  sk('BsWd', 'Identify base words, prefixes and suffixes', 'Prefixes and suffixes', [2, 3, 4], () => {
    const [w, base, affix] = pick(AFFIX_WORDS); const askBase = Math.random() < 0.6;
    const others = sample(AFFIX_WORDS.map(x => askBase ? x[1] : x[2]), 6, [askBase ? base : affix]);
    return mc(askBase ? `What is the base word of ${b(w)}?` : `What is the ${affix.startsWith('-') ? 'suffix' : 'prefix'} in ${b(w)}?`, askBase ? base : affix, others,
      `${b(w)} = ${affix.startsWith('-') ? base + ' + ' + affix : affix + ' + ' + base}.`);
  }),
  ...[['PxPRM', 'Determine the meaning of a word with pre-, re- or mis-', ['pre-', 're-', 'mis-'], [2, 3, 4, 5]],
    ['PxFL', 'Determine the meaning of a word with -ful or -less', ['-ful', '-less'], [2, 3, 4, 5]],
    ['PxLN', 'Determine the meaning of a word with -ly or -ness', ['-ly', '-ness'], [3, 4]],
    ['PxAM', 'Determine the meaning of a word with -able or -ment', ['-able', '-ment'], [3, 4, 5]],
    ['PxUD', 'Words with un-, dis-, in-, im- and non-', ['un-', 'dis-', 'in-', 'im-', 'non-'], [4, 5]]].map(([k, t, affixes, g]) =>
    sk(k, t, 'Prefixes and suffixes', g, () => {
      const pool = AFFIX_WORDS.filter(x => affixes.includes(x[2]));
      const [w, , affix, meaning] = pick(pool);
      return mc(`What does ${b(w)} mean?`, meaning, sample(AFFIX_WORDS.map(x => x[3]), 6, [meaning]), `The ${affix.startsWith('-') ? 'suffix' : 'prefix'} ${b(affix)} helps: ${b(w)} means "${meaning}".`);
    })),
  sk('CmpW', 'Form compound words', 'Compound words', [1, 2, 3, 4], () => {
    const [x, y] = pick(COMPOUNDS);
    const wrong = sample(COMPOUNDS.map(c => c[1]), 5, [y]);
    return mc(`Which word can you add to ${b(x)} to make a compound word?<br>${b(x)} + ___`, y, wrong, `${x} + ${y} = ${b(x + y)}.`);
  }),
  sk('CtMb', 'Select the members of a group', 'Categories', [1, 2, 3, 4, 5], () => {
    const cats = Object.keys(CATEGORIES); const c = pick(cats);
    const a = pick(CATEGORIES[c]);
    const wrong = sample(cats.filter(x => x !== c).map(x => pick(CATEGORIES[x])).filter(x => !CATEGORIES[c].includes(x)), 3);
    return mc(`Which word belongs in the group ${b(c)}?`, a, wrong, `${b(a)} is one of the ${c}.`);
  }),
  sk('CtOd', 'Which word is not like the others?', 'Categories', [1, 2, 3, 4, 5], () => {
    const cats = Object.keys(CATEGORIES); const c = pick(cats);
    const three = sample(CATEGORIES[c], 3);
    const odd = pick(CATEGORIES[pick(cats.filter(x => x !== c))].filter(x => !CATEGORIES[c].includes(x)));
    return mc(`Which word does not belong?<br>${shuffle([...three, odd]).join(' · ')}`, odd, three, `${three.join(', ')} are all ${c}. ${b(odd)} is not.`);
  }),
  sk('SyCh', 'Choose the synonym', 'Synonyms and antonyms', [1, 2, 3, 4, 5], () => {
    const [w, s] = pick(SYNONYMS); const flip = Math.random() < 0.5;
    const [q, a] = flip ? [s, w] : [w, s];
    return mc(`Which word means almost the same as ${b(q)}?`, a, [...sample(SYNONYMS.flat(), 4, [q, a]), ...ANTONYMS.filter(x => x.includes(q)).map(x => x.find(y => y !== q))], `${b(q)} and ${b(a)} are synonyms.`);
  }),
  sk('AnCh', 'Choose the antonym', 'Synonyms and antonyms', [1, 2, 3, 4, 5], () => {
    const [w, o] = pick(ANTONYMS); const flip = Math.random() < 0.5;
    const [q, a] = flip ? [o, w] : [w, o];
    return mc(`Which word means the opposite of ${b(q)}?`, a, [...sample(ANTONYMS.flat(), 4, [q, a]), ...SYNONYMS.filter(x => x.includes(q)).map(x => x.find(y => y !== q))], `${b(q)} and ${b(a)} are antonyms.`);
  }),
  sk('HmCr', 'Use the correct homophone', 'Homophones', [2, 3, 4, 5], () => {
    const [w1, w2, s1, s2] = pick(HOMOPHONES); const first = Math.random() < 0.5;
    return mc(`Choose the correct word.<br>${em(first ? s1 : s2)}`, first ? w1 : w2, [w1, w2], `${b(w1)} and ${b(w2)} sound the same but mean different things.`, 2);
  }),
  sk('HmId', 'Identify homophones', 'Homophones', [2, 3, 4], () => {
    const [w1, w2] = pick(HOMOPHONES);
    return mc(`Which word sounds the same as ${b(w1)} but has a different meaning?`, w2, sample(HOMOPHONES.flatMap(h => [h[0], h[1]]), 5, [w1, w2]), `${b(w1)} and ${b(w2)} are homophones.`);
  }),
  sk('MlMn', 'Which definition matches the sentence?', 'Multiple-meaning words', [2, 3, 4, 5], () => {
    const [w, s, right, other] = pick(MULTI);
    return mc(`${s}<br>Which meaning of ${b(w)} is used?`, right, [other], `Here ${b(w)} means "${right}".`, 2);
  }),
  sk('ShOr', 'Order related words based on meaning', 'Shades of meaning', [1, 2, 3], () => {
    const t = pick(SHADES);
    const ok = t.join(' → ');
    const wrong = uniq([[t[1], t[0], t[2]], [t[0], t[2], t[1]], [t[2], t[1], t[0]], [t[2], t[0], t[1]]].map(x => x.join(' → ')));
    return mc('Which list goes from weakest to strongest?', ok, wrong, `${b(t[0])} is the mildest and ${b(t[2])} is the strongest.`);
  }),
  sk('ShSt', 'Describe the difference between related words', 'Shades of meaning', [1, 2, 3, 4, 5], () => {
    const t = pick(SHADES); const strong = Math.random() < 0.5;
    return mc(`Which word is ${strong ? 'the strongest' : 'the mildest'}?`, strong ? t[2] : t[0], t, `In order: ${t.join(', ')}.`, 3);
  }),
  sk('ShPN', 'Positive and negative connotation', 'Shades of meaning', [3, 4, 5], () => {
    // [more positive, more negative]
    const [pos, neg] = pick([['curious', 'nosy'], ['thrifty', 'cheap'], ['slim', 'skinny'], ['relaxed', 'lazy'], ['determined', 'stubborn'], ['unique', 'weird'],
      ['aroma', 'stench'], ['youthful', 'childish'], ['cautious', 'cowardly'], ['energetic', 'hyper'], ['confident', 'bossy'], ['chuckle', 'snicker'], ['firm', 'harsh'], ['talkative', 'mouthy']]);
    const wantPos = Math.random() < 0.5;
    return mc(`Which word has a more ${b(wantPos ? 'positive' : 'negative')} connotation?`, wantPos ? pos : neg, [pos, neg],
      `${b(pos)} sounds kinder; ${b(neg)} sounds more critical, even though they mean similar things.`, 2);
  }),
  ...[['IdA1', 'Identify the meaning of idioms and adages: set 1', 0], ['IdA2', 'Identify the meaning of idioms and adages: set 2', 1]].map(([k, t, set]) =>
    sk(k, t, 'Idioms and adages', [3, 4, 5], () => {
      const all = [
        ['It\'s raining cats and dogs.', 'It is raining very hard.'], ['That test was a piece of cake.', 'The test was very easy.'], ['I\'m feeling under the weather.', 'I feel sick.'],
        ['Don\'t spill the beans!', 'Don\'t tell the secret!'], ['She has cold feet about the show.', 'She is nervous about the show.'], ['He let the cat out of the bag.', 'He told a secret.'],
        ['We only go there once in a blue moon.', 'We go there very rarely.'], ['I\'m on cloud nine!', 'I am extremely happy.'], ['Hold your horses!', 'Wait and be patient.'],
        ['Actions speak louder than words.', 'What you do matters more than what you say.'], ['The early bird catches the worm.', 'People who start early succeed.'], ['Don\'t judge a book by its cover.', 'Don\'t judge something only by how it looks.'],
        ['Practice makes perfect.', 'Doing something often makes you better at it.'], ['Two heads are better than one.', 'Working together helps solve problems.'], ['Look before you leap.', 'Think before you act.'],
        ['When pigs fly!', 'That will never happen.'], ['It costs an arm and a leg.', 'It is very expensive.'], ['Break a leg!', 'Good luck!']
      ];
      const pool = all.filter((_, i) => i % 2 === set);
      const [q, a] = pick(pool);
      return mc(`What does this mean?<br>${em(q)}`, a, sample(all.map(x => x[1]), 5, [a]), `An idiom or adage means more than its words: ${b(a)}`);
    })),
  sk('AbcF', 'Order alphabetically based on the first letter', 'Reference skills', [1, 2, 3], () => {
    const byFirst = {};
    for (const w of ABC_WORDS) (byFirst[w[0]] = byFirst[w[0]] || []).push(w);
    const letters = sample(Object.keys(byFirst), 4);
    const words = letters.map(l => pick(byFirst[l]));
    const first = [...words].sort()[0];
    return mc(`Which word comes first in ABC order?<br>${words.join(' · ')}`, first, words, `${b(first)} starts with "${first[0]}", which comes first in the alphabet.`);
  }),
  ...[['Abc2', 'Order alphabetically based on the first two letters', 1, [2, 3, 4, 5]], ['Abc3', 'Order alphabetically based on the first three letters', 2, [2, 3, 4, 5]]].map(([k, t, shared, g]) =>
    sk(k, t, 'Reference skills', g, () => {
      const groups = {};
      for (const w of ABC_WORDS) if (w.length > shared) (groups[w.slice(0, shared)] = groups[w.slice(0, shared)] || []).push(w);
      const keys = Object.keys(groups).filter(k => uniq(groups[k].map(w => w[shared])).length >= 3);
      const grp = groups[pick(keys)];
      const byNext = {};
      for (const w of grp) (byNext[w[shared]] = byNext[w[shared]] || []).push(w);
      const words = sample(Object.keys(byNext), Math.min(4, Object.keys(byNext).length)).map(c => pick(byNext[c]));
      const first = [...words].sort()[0];
      return mc(`Which word comes first in ABC order?<br>${words.join(' · ')}`, first, words, `They all start with "${grp[0].slice(0, shared)}", so look at letter ${shared + 1}: ${b(first)} comes first.`);
    })),
  sk('GdWd', 'Use guide words', 'Reference skills', [2, 3, 4, 5], () => {
    const sorted = [...ABC_WORDS].sort();
    const i = ri(0, sorted.length - 8), j = i + ri(3, 6);
    const a = sorted[i], z = sorted[j];
    const inside = sorted[ri(i + 1, j - 1)];
    const outside = sample(sorted.filter((w, k) => k < i || k > j), 3);
    return mc(`A dictionary page has the guide words ${b(a)} and ${b(z)}. Which word would you find on that page?`, inside, outside, `${b(inside)} comes between ${a} and ${z} in ABC order.`);
  })
];
