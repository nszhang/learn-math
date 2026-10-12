/* ============================================================
   MathAce — English (language arts), grades 1–5.
   Start-simple catalog: grammar, vocabulary and word skills.
   IDs are prefixed "eng".
   ============================================================ */
import { S, classify, pairs, ri, pick, shuffle } from './quiz.js';

const b = w => `<strong>${w}</strong>`;

export const ENGLISH_SKILLS = [
  /* ================= GRADE 1 ================= */
  S('engRHY1', 'Rhyming words', 1, 'Reading and phonics', '🎵', pairs({
    prompt: w => `Which word rhymes with ${b(w)}?`,
    items: [
      ['cat', 'hat'], ['dog', 'log'], ['sun', 'run'], ['bee', 'tree'], ['cake', 'lake'],
      ['star', 'car'], ['ball', 'wall'], ['king', 'ring'], ['boat', 'coat'], ['night', 'light'],
      ['fish', 'dish'], ['bear', 'chair']
    ].map(([w, a]) => [w, a, `${b(w)} and ${b(a)} end with the same sound, so they rhyme.`])
  })),
  S('engALP1', 'What comes next in the alphabet?', 1, 'Reading and phonics', '🔤', () => {
    const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const i = ri(0, 24);
    const ans = A[i + 1];
    const wrong = shuffle([...A].filter(c => c !== ans && c !== A[i])).slice(0, 3);
    return {
      type: 'mc',
      prompt: `Which letter comes right after ${b(A[i])} in the alphabet?`,
      answer: ans, choices: shuffle([ans, ...wrong]),
      explain: `A B C D … ${b(A[i])} is followed by ${b(ans)}.`
    };
  }),
  S('engNVB1', 'Nouns and verbs', 1, 'Grammar', '✏️', classify({
    categories: ['Noun', 'Verb'],
    prompt: w => `Is ${b(w)} a noun or a verb?`,
    items: [
      ['dog', 'Noun', 'A noun names a person, place or thing. A dog is a thing (an animal).'],
      ['jump', 'Verb', 'A verb is an action word. You can jump!'],
      ['teacher', 'Noun', 'A teacher is a person, so it is a noun.'],
      ['swim', 'Verb', 'Swimming is something you do, so it is a verb.'],
      ['table', 'Noun', 'A table is a thing, so it is a noun.'],
      ['eat', 'Verb', 'Eating is an action, so it is a verb.'],
      ['school', 'Noun', 'A school is a place, so it is a noun.'],
      ['sing', 'Verb', 'Singing is an action, so it is a verb.'],
      ['park', 'Noun', 'A park is a place, so it is a noun.'],
      ['clap', 'Verb', 'Clapping is an action, so it is a verb.'],
      ['book', 'Noun', 'A book is a thing, so it is a noun.'],
      ['hop', 'Verb', 'Hopping is an action, so it is a verb.']
    ]
  })),
  S('engPUN1', 'End marks: . ? !', 1, 'Grammar', '❓', classify({
    categories: ['Period .', 'Question mark ?', 'Exclamation mark !'],
    prompt: s => `Which end mark goes at the end? <em>${s}</em>`,
    items: [
      ['Where is my hat', 'Question mark ?', 'It asks something, so it ends with a question mark.'],
      ['I like pizza', 'Period .', 'It tells something, so it ends with a period.'],
      ['Wow, that is huge', 'Exclamation mark !', 'It shows strong feeling, so it ends with an exclamation mark.'],
      ['What is your name', 'Question mark ?', 'It asks something, so it ends with a question mark.'],
      ['The cat is sleeping', 'Period .', 'It tells something, so it ends with a period.'],
      ['Help, a bee is on me', 'Exclamation mark !', 'It shows strong feeling, so it ends with an exclamation mark.'],
      ['Can we play outside', 'Question mark ?', 'It asks something, so it ends with a question mark.'],
      ['We went to the zoo', 'Period .', 'It tells something, so it ends with a period.'],
      ['I won the game', 'Exclamation mark !', 'It shows excitement, so it ends with an exclamation mark.'],
      ['How old are you', 'Question mark ?', 'It asks something, so it ends with a question mark.']
    ]
  })),
  S('engOPP1', 'Opposites', 1, 'Vocabulary', '↔️', pairs({
    prompt: w => `Which word means the opposite of ${b(w)}?`,
    items: [
      ['hot', 'cold'], ['up', 'down'], ['big', 'small'], ['day', 'night'], ['happy', 'sad'],
      ['fast', 'slow'], ['open', 'closed'], ['wet', 'dry'], ['in', 'out'], ['full', 'empty'],
      ['old', 'new'], ['loud', 'quiet']
    ].map(([w, a]) => [w, a, `The opposite of ${b(w)} is ${b(a)}.`])
  })),
  S('engPLU1', 'Plural nouns', 1, 'Vocabulary', '👯', pairs({
    prompt: w => `What is the plural of ${b(w)}? (More than one)`,
    items: [
      ['cat', 'cats', 'Most words just add <strong>s</strong>.', ['cats', 'cates', 'cat', 'caties']],
      ['box', 'boxes', 'Words ending in x add <strong>es</strong>.', ['boxes', 'boxs', 'boxen', 'box']],
      ['child', 'children', 'Child is irregular — it changes to <strong>children</strong>.', ['children', 'childs', 'childes', 'childen']],
      ['foot', 'feet', 'Foot is irregular — it changes to <strong>feet</strong>.', ['feet', 'foots', 'feets', 'footes']],
      ['bus', 'buses', 'Words ending in s add <strong>es</strong>.', ['buses', 'buss', 'busen', 'bus']],
      ['baby', 'babies', 'Change the y to i and add <strong>es</strong>.', ['babies', 'babys', 'babyes', 'baby']],
      ['man', 'men', 'Man is irregular — it changes to <strong>men</strong>.', ['men', 'mans', 'manes', 'mens']],
      ['mouse', 'mice', 'Mouse is irregular — it changes to <strong>mice</strong>.', ['mice', 'mouses', 'mouse', 'meese']],
      ['dish', 'dishes', 'Words ending in sh add <strong>es</strong>.', ['dishes', 'dishs', 'dishen', 'dish']],
      ['tooth', 'teeth', 'Tooth is irregular — it changes to <strong>teeth</strong>.', ['teeth', 'tooths', 'toothes', 'teeths']]
    ]
  })),

  /* ================= GRADE 2 ================= */
  S('engSYN2', 'Synonyms', 2, 'Vocabulary', '🟰', pairs({
    prompt: w => `Which word means almost the same as ${b(w)}?`,
    items: [
      ['big', 'large'], ['happy', 'glad'], ['small', 'tiny'], ['fast', 'quick'], ['sad', 'unhappy'],
      ['begin', 'start'], ['pretty', 'beautiful'], ['smart', 'clever'], ['shout', 'yell'],
      ['rock', 'stone'], ['tired', 'sleepy'], ['jump', 'leap']
    ].map(([w, a]) => [w, a, `${b(w)} and ${b(a)} are synonyms — they mean almost the same thing.`])
  })),
  S('engCMP2', 'Compound words', 2, 'Vocabulary', '🧩', pairs({
    prompt: w => `Which two small words make the compound word ${b(w)}?`,
    items: [
      ['sunshine', 'sun + shine'], ['rainbow', 'rain + bow'], ['football', 'foot + ball'],
      ['butterfly', 'butter + fly'], ['cupcake', 'cup + cake'], ['notebook', 'note + book'],
      ['snowman', 'snow + man'], ['starfish', 'star + fish'], ['bedroom', 'bed + room'],
      ['popcorn', 'pop + corn']
    ].map(([w, a]) => [w, a, `${b(w)} = ${b(a)}.`])
  })),
  S('engCAP2', 'Capital letters', 2, 'Grammar', '🔠', pairs({
    prompt: () => 'Which sentence uses capital letters correctly?',
    items: [
      ['', 'My friend Sam lives in Toronto.', 'Names of people and places, and the first word of a sentence, start with a capital letter.',
        ['My friend Sam lives in Toronto.', 'my friend Sam lives in Toronto.', 'My friend sam lives in toronto.', 'My Friend Sam Lives In Toronto.']],
      ['', 'Today is Monday.', 'The first word and days of the week start with a capital letter.',
        ['Today is Monday.', 'today is monday.', 'Today is monday.', 'today is Monday.']],
      ['', 'We visited Paris in July.', 'Cities and months start with a capital letter.',
        ['We visited Paris in July.', 'We visited paris in july.', 'we visited Paris in July.', 'We Visited Paris In July.']],
      ['', 'Mrs. Lee reads to our class.', 'Titles and names start with a capital letter.',
        ['Mrs. Lee reads to our class.', 'mrs. lee reads to our class.', 'Mrs. lee reads to Our Class.', 'mrs. Lee reads to our class.']],
      ['', 'Emma and I play soccer.', 'The word I is always a capital letter, and so are names.',
        ['Emma and I play soccer.', 'Emma and i play soccer.', 'emma and I play soccer.', 'Emma And I Play Soccer.']],
      ['', 'The river is near Canada.', 'Only the first word and the country name need capitals here.',
        ['The river is near Canada.', 'The River is near canada.', 'the river is near Canada.', 'The river is near canada.']]
    ]
  })),
  S('engPST2', 'Past tense verbs', 2, 'Grammar', '⏪', pairs({
    prompt: s => s,
    items: [
      ['Yesterday we ___ to the park. (walk)', 'walked', 'Add <strong>ed</strong> to show it already happened.', ['walked', 'walk', 'walking', 'will walk']],
      ['Last night I ___ my dinner. (eat)', 'ate', 'Eat is irregular: eat → <strong>ate</strong>.', ['ate', 'eated', 'eat', 'eaten']],
      ['Yesterday the dog ___ in the yard. (run)', 'ran', 'Run is irregular: run → <strong>ran</strong>.', ['ran', 'runned', 'run', 'running']],
      ['Last week she ___ a big fish. (see)', 'saw', 'See is irregular: see → <strong>saw</strong>.', ['saw', 'seen', 'seed', 'see']],
      ['We ___ to school yesterday. (go)', 'went', 'Go is irregular: go → <strong>went</strong>.', ['went', 'goed', 'gone', 'go']],
      ['The kids ___ games after lunch. (play)', 'played', 'Add <strong>ed</strong> to show it already happened.', ['played', 'play', 'playing', 'plays']],
      ['Last summer he ___ in the lake. (swim)', 'swam', 'Swim is irregular: swim → <strong>swam</strong>.', ['swam', 'swimmed', 'swum', 'swim']],
      ['Tom ___ over the puddle. (jump)', 'jumped', 'Add <strong>ed</strong> to show it already happened.', ['jumped', 'jump', 'jumping', 'jumps']]
    ]
  })),
  S('engCON2', 'Contractions', 2, 'Grammar', '✂️', pairs({
    prompt: w => `Which contraction means ${b(w)}?`,
    items: [
      ['do not', "don't"], ['can not', "can't"], ['I am', "I'm"], ['it is', "it's"],
      ['we are', "we're"], ['they are', "they're"], ['is not', "isn't"], ['she is', "she's"],
      ['will not', "won't"], ['you are', "you're"]
    ].map(([w, a]) => [w, a, `${b(w)} shortens to ${b(a)} — the apostrophe replaces the missing letters.`])
  })),

  /* ================= GRADE 3 ================= */
  S('engADJ3', 'Identify adjectives', 3, 'Grammar', '🎨', pairs({
    prompt: s => `Which word is the adjective (describing word)?<br><em>${s}</em>`,
    items: [
      ['The tall boy ran home.', 'tall', 'Tall describes the boy.', ['tall', 'boy', 'ran', 'home']],
      ['She wore a red hat.', 'red', 'Red describes the hat.', ['red', 'wore', 'hat', 'She']],
      ['We saw a huge elephant.', 'huge', 'Huge describes the elephant.', ['huge', 'saw', 'elephant', 'We']],
      ['A noisy bird woke us up.', 'noisy', 'Noisy describes the bird.', ['noisy', 'bird', 'woke', 'up']],
      ['The soft blanket felt warm.', 'soft', 'Soft describes the blanket. (Warm does too!)', ['soft', 'blanket', 'felt', 'The']],
      ['He ate a juicy peach.', 'juicy', 'Juicy describes the peach.', ['juicy', 'ate', 'peach', 'He']],
      ['The little puppy barked.', 'little', 'Little describes the puppy.', ['little', 'puppy', 'barked', 'The']],
      ['I found a shiny coin.', 'shiny', 'Shiny describes the coin.', ['shiny', 'found', 'coin', 'I']]
    ]
  })),
  S('engHOM3', 'Homophones', 3, 'Vocabulary', '👂', pairs({
    prompt: s => `Choose the correct word:<br><em>${s}</em>`,
    items: [
      ['___ going to the park. (They are)', "They're", "They're = they are.", ["They're", 'There', 'Their', 'Thier']],
      ['I left my coat over ___.', 'there', 'There tells where something is.', ['there', "they're", 'their', 'thare']],
      ['The kids lost ___ toys.', 'their', 'Their shows that something belongs to them.', ['their', 'there', "they're", 'thier']],
      ['I have ___ apples. (the number 2)', 'two', 'Two is the number 2.', ['two', 'to', 'too', 'tu']],
      ['Can I come ___?', 'too', 'Too means also.', ['too', 'to', 'two', 'tew']],
      ['We walked ___ the store.', 'to', 'To shows direction.', ['to', 'too', 'two', 'tu']],
      ['I can ___ the bird singing.', 'hear', 'Hear is what you do with your ears.', ['hear', 'here', 'heer', 'hare']],
      ['Come over ___!', 'here', 'Here tells the place where you are.', ['here', 'hear', 'heer', 'hair']],
      ['The ___ is shining today.', 'sun', 'Sun is the star in our sky.', ['sun', 'son', 'sunn', 'sin']],
      ['I ___ a bird in the tree.', 'saw', 'Saw is the past of see.', ['saw', 'sore', 'sau', 'soar']]
    ]
  })),
  S('engPFX3', 'Prefixes', 3, 'Vocabulary', '🧱', pairs({
    prompt: w => `What does the word ${b(w)} mean?`,
    items: [
      ['unhappy', 'not happy', 'The prefix <strong>un-</strong> means "not".'],
      ['redo', 'do again', 'The prefix <strong>re-</strong> means "again".'],
      ['unfair', 'not fair', 'The prefix <strong>un-</strong> means "not".'],
      ['preview', 'see before', 'The prefix <strong>pre-</strong> means "before".'],
      ['disagree', 'not agree', 'The prefix <strong>dis-</strong> means "not".'],
      ['rewrite', 'write again', 'The prefix <strong>re-</strong> means "again".'],
      ['misspell', 'spell wrongly', 'The prefix <strong>mis-</strong> means "wrongly".'],
      ['prepay', 'pay before', 'The prefix <strong>pre-</strong> means "before".'],
      ['unsafe', 'not safe', 'The prefix <strong>un-</strong> means "not".'],
      ['dislike', 'not like', 'The prefix <strong>dis-</strong> means "not".']
    ]
  })),
  S('engPRO3', 'Pronouns', 3, 'Grammar', '👤', classify({
    categories: ['He', 'She', 'It', 'They', 'We'],
    prompt: w => `Which pronoun can replace ${b(w)}?`,
    items: [
      ['Maria', 'She'], ['my brother', 'He'], ['the dog', 'It'], ['the boys', 'They'],
      ['Tom and I', 'We'], ['Mr. Lee', 'He'], ['the table', 'It'], ['my sister', 'She'],
      ['Anna and Ben', 'They'], ['my mom and I', 'We'], ['the teacher (a woman)', 'She'], ['the books', 'They']
    ].map(([w, a]) => [w, a, `${b(w)} can be replaced with ${b(a)}.`])
  })),

  /* ================= GRADE 4 ================= */
  S('engSNT4', 'Types of sentences', 4, 'Grammar', '💬', classify({
    categories: ['Statement', 'Question', 'Command', 'Exclamation'],
    prompt: s => `What kind of sentence is this?<br><em>${s}</em>`,
    items: [
      ['The sky is blue.', 'Statement', 'It tells something and ends with a period.'],
      ['What time is it?', 'Question', 'It asks something and ends with a question mark.'],
      ['Please close the door.', 'Command', 'It tells someone to do something.'],
      ['What a great day this is!', 'Exclamation', 'It shows strong feeling and ends with an exclamation mark.'],
      ['I walk to school every day.', 'Statement', 'It tells something and ends with a period.'],
      ['Do you like soccer?', 'Question', 'It asks something and ends with a question mark.'],
      ['Wash your hands.', 'Command', 'It tells someone to do something.'],
      ['That was amazing!', 'Exclamation', 'It shows strong feeling and ends with an exclamation mark.'],
      ['Where did you put my book?', 'Question', 'It asks something and ends with a question mark.'],
      ['Turn off the lights.', 'Command', 'It tells someone to do something.']
    ]
  })),
  S('engAPO4', 'Apostrophes for possession', 4, 'Grammar', '’', pairs({
    prompt: s => `Choose the correct word:<br><em>${s}</em>`,
    items: [
      ['The ___ bone is under the bed. (one dog)', "dog's", 'One owner: add <strong>\'s</strong>.', ["dog's", 'dogs', "dogs'", "dogs's"]],
      ['The ___ lockers are in the hall. (many girls)', "girls'", 'Many owners ending in s: add just an apostrophe after the <strong>s</strong>.', ["girls'", "girl's", 'girls', "girls's"]],
      ['The ___ toys are on the floor. (many children)', "children's", 'Children is plural but does not end in s, so add <strong>\'s</strong>.', ["children's", "childrens'", 'childrens', "childs'"]],
      ['My ___ desk is neat. (one teacher)', "teacher's", 'One owner: add <strong>\'s</strong>.', ["teacher's", "teachers'", 'teachers', "teachers's"]],
      ['The ___ team won the game. (many boys)', "boys'", 'Many owners ending in s: add just an apostrophe after the <strong>s</strong>.', ["boys'", "boy's", 'boys', "boys's"]],
      ['That is my ___ jacket. (one sister)', "sister's", 'One owner: add <strong>\'s</strong>.', ["sister's", "sisters'", 'sisters', "sisters's"]],
      ['The ___ wings are green. (one parrot)', "parrot's", 'One owner: add <strong>\'s</strong>.', ["parrot's", "parrots'", 'parrots', "parrots's"]],
      ['The ___ coats hang by the door. (many men)', "men's", 'Men is plural but does not end in s, so add <strong>\'s</strong>.', ["men's", "mens'", 'mens', "men'"]]
    ]
  })),
  S('engFIG4', 'Similes and metaphors', 4, 'Vocabulary', '🌈', classify({
    categories: ['Simile', 'Metaphor'],
    prompt: s => `Is this a simile or a metaphor?<br><em>${s}</em>`,
    items: [
      ['She runs like the wind.', 'Simile', 'It compares using the word <strong>like</strong>.'],
      ['Her smile is sunshine.', 'Metaphor', 'It says one thing <strong>is</strong> another, without like or as.'],
      ['He is as brave as a lion.', 'Simile', 'It compares using the word <strong>as</strong>.'],
      ['The classroom was a zoo.', 'Metaphor', 'It says one thing <strong>was</strong> another, without like or as.'],
      ['Life is a journey.', 'Metaphor', 'It says one thing <strong>is</strong> another, without like or as.'],
      ['The snow was like a white blanket.', 'Simile', 'It compares using the word <strong>like</strong>.'],
      ['Time is a thief.', 'Metaphor', 'It says one thing <strong>is</strong> another, without like or as.'],
      ['He is as busy as a bee.', 'Simile', 'It compares using the word <strong>as</strong>.'],
      ['The moon was a silver coin.', 'Metaphor', 'It says one thing <strong>was</strong> another, without like or as.'],
      ['Her voice was like honey.', 'Simile', 'It compares using the word <strong>like</strong>.']
    ]
  })),
  S('engADV4', 'Identify adverbs', 4, 'Grammar', '🐢', pairs({
    prompt: s => `Which word is the adverb?<br><em>${s}</em>`,
    items: [
      ['The tired dog slowly walked home.', 'slowly', 'Slowly tells how the dog walked.', ['slowly', 'tired', 'dog', 'home']],
      ['She sings beautifully every day.', 'beautifully', 'Beautifully tells how she sings.', ['beautifully', 'sings', 'She', 'day']],
      ['The children quietly entered the room.', 'quietly', 'Quietly tells how they entered.', ['quietly', 'children', 'entered', 'room']],
      ['He carefully carried the glass.', 'carefully', 'Carefully tells how he carried it.', ['carefully', 'carried', 'glass', 'He']],
      ['The cheetah ran quickly across the field.', 'quickly', 'Quickly tells how the cheetah ran.', ['quickly', 'cheetah', 'ran', 'field']],
      ['We happily played in the snow.', 'happily', 'Happily tells how we played.', ['happily', 'played', 'snow', 'We']],
      ['The baby slept peacefully.', 'peacefully', 'Peacefully tells how the baby slept.', ['peacefully', 'baby', 'slept', 'The']],
      ['Mia answered the question correctly.', 'correctly', 'Correctly tells how Mia answered.', ['correctly', 'answered', 'question', 'Mia']]
    ]
  })),

  /* ================= GRADE 5 ================= */
  S('engCNJ5', 'Conjunctions', 5, 'Grammar', '🔗', pairs({
    prompt: s => `Choose the best conjunction:<br><em>${s}</em>`,
    items: [
      ['I wanted to play outside, ___ it was raining.', 'but', 'But joins two ideas that contrast.', ['but', 'so', 'and', 'because']],
      ['It was raining, ___ we stayed inside.', 'so', 'So shows a result.', ['so', 'but', 'or', 'although']],
      ['You can have tea ___ juice.', 'or', 'Or gives a choice.', ['or', 'but', 'so', 'because']],
      ['I stayed home ___ I felt sick.', 'because', 'Because gives the reason.', ['because', 'but', 'or', 'although']],
      ['She likes dogs ___ cats.', 'and', 'And adds one thing to another.', ['and', 'but', 'or', 'because']],
      ['___ it was cold, we went swimming.', 'Although', 'Although shows a surprising contrast.', ['Although', 'Because', 'So', 'Or']],
      ['Take an umbrella ___ it rains.', 'in case', 'In case shows a possibility to prepare for.', ['in case', 'but', 'although', 'and so']],
      ['We can walk ___ we can take the bus.', 'or', 'Or gives a choice.', ['or', 'because', 'but', 'so']]
    ]
  })),
  S('engIRR5', 'Irregular verbs', 5, 'Grammar', '🔀', pairs({
    prompt: s => s,
    items: [
      ['Yesterday she ___ a letter. (write)', 'wrote', 'Past tense of write is <strong>wrote</strong>.', ['wrote', 'written', 'writed', 'write']],
      ['I have ___ my lunch. (eat)', 'eaten', 'With "have", use the past participle: <strong>eaten</strong>.', ['eaten', 'ate', 'eated', 'eat']],
      ['He ___ the ball over the fence. (throw)', 'threw', 'Past tense of throw is <strong>threw</strong>.', ['threw', 'thrown', 'throwed', 'throw']],
      ['They have ___ to the beach. (go)', 'gone', 'With "have", use the past participle: <strong>gone</strong>.', ['gone', 'went', 'goed', 'go']],
      ['She ___ the answer on the board. (write)', 'wrote', 'Past tense of write is <strong>wrote</strong>.', ['wrote', 'written', 'writed', 'writes']],
      ['We ___ a great movie last night. (see)', 'saw', 'Past tense of see is <strong>saw</strong>.', ['saw', 'seen', 'seed', 'see']],
      ['The glass has ___ on the floor. (break)', 'broken', 'With "has", use the past participle: <strong>broken</strong>.', ['broken', 'broke', 'breaked', 'break']],
      ['He ___ a new bike last week. (buy)', 'bought', 'Past tense of buy is <strong>bought</strong>.', ['bought', 'buyed', 'boughten', 'buy']],
      ['I have ___ this song before. (hear)', 'heard', 'With "have", use the past participle: <strong>heard</strong>.', ['heard', 'hear', 'heared', 'hearn']]
    ]
  })),
  S('engIDM5', 'Idioms', 5, 'Vocabulary', '🗣️', pairs({
    prompt: w => `What does the idiom ${b(`"${w}"`)} mean?`,
    items: [
      ["It's raining cats and dogs", 'It is raining very hard'],
      ['A piece of cake', 'Very easy'],
      ['Break a leg', 'Good luck'],
      ['Under the weather', 'Feeling sick'],
      ['Spill the beans', 'Tell a secret'],
      ['Hit the books', 'Study hard'],
      ['Cost an arm and a leg', 'Very expensive'],
      ['Once in a blue moon', 'Very rarely'],
      ['Bite the bullet', 'Face something hard bravely'],
      ['The ball is in your court', 'It is your turn to decide']
    ].map(([w, a]) => [w, a, `An idiom doesn't mean its exact words. <em>${w}</em> means: <strong>${a}</strong>.`])
  })),
  S('engCNF5', 'Commonly confused words', 5, 'Vocabulary', '🤔', pairs({
    prompt: s => `Choose the correct word:<br><em>${s}</em>`,
    items: [
      ['The weather will ___ our plans. (change them)', 'affect', 'Affect is usually a verb: to change something.', ['affect', 'effect', 'afect', 'effects']],
      ['The medicine had a good ___.', 'effect', 'Effect is usually a noun: the result.', ['effect', 'affect', 'efect', 'affects']],
      ['She is taller ___ her brother.', 'than', 'Use than to compare.', ['than', 'then', 'that', 'thin']],
      ['First we eat, ___ we play.', 'then', 'Then shows what comes next.', ['then', 'than', 'that', 'them']],
      ['Everyone came ___ Jake.', 'except', 'Except means "not including".', ['except', 'accept', 'expect', 'excerpt']],
      ['Please ___ my invitation.', 'accept', 'Accept means to receive or agree to.', ['accept', 'except', 'expect', 'access']],
      ['The dog wagged ___ tail.', 'its', 'Its (no apostrophe) shows belonging.', ["its", "it's", 'its\'s', 'it is']],
      ['___ a sunny day today.', "It's", "It's = it is.", ["It's", 'Its', 'Its\'', 'Is']],
      ['Be careful not to ___ your keys.', 'lose', 'Lose (one o) means to misplace.', ['lose', 'loose', 'loss', 'loos']],
      ['My shoelace is ___.', 'loose', 'Loose (two o\'s) means not tight.', ['loose', 'lose', 'loss', 'loos']]
    ]
  }))
];
