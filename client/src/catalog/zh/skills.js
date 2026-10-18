/* Chinese (Mandarin, Simplified + pinyin), organised by HSK level 1–6.
   Specs { k, t, s, g, gen } expand into one skill per HSK level in g (id "chiH" + level + k).
   A question with listen: true is heard, not read: its `say` text is played and hidden. */
import { VOCAB, TONE_CHARS, RADICALS, MEASURES, WEEKDAYS, MONTHS_EN, OPPOSITES, CHENGYU, ZODIAC } from './data.js';
import { HSK } from './hsk.js';

const ri = (a, z) => Math.floor(Math.random() * (z - a + 1)) + a;
const pick = arr => arr[ri(0, arr.length - 1)];
const shuffle = arr => { const x = arr.slice(); for (let i = x.length - 1; i > 0; i--) { const j = ri(0, i); [x[i], x[j]] = [x[j], x[i]]; } return x; };
const sample = (arr, n, not = []) => shuffle(arr.filter(x => !not.includes(x))).slice(0, n);
const uniq = a => [...new Set(a)];
const b = s => `<strong>${s}</strong>`;
const sk = (k, t, s, g, gen) => ({ k, t, s, g, gen });
const R = (a, z) => Array.from({ length: z - a + 1 }, (_, i) => a + i);

/* ---------- display ---------- */
export const zh = hz => `<span class="zh">${hz}</span>`;
// characters with pinyin above each one (ruby text)
export const ruby = (hz, py) => {
  const chars = [...hz], syl = py.split(' ');
  if (chars.length !== syl.length) return `${zh(hz)} <span class="muted">(${py})</span>`;
  return `<span class="zh">${chars.map((c, i) => `<ruby>${c}<rt>${syl[i]}</rt></ruby>`).join('')}</span>`;
};
const mc = (prompt, answer, wrong, explain, say = null, n = 4) => {
  const others = shuffle(uniq(wrong).filter(w => w !== answer)).slice(0, n - 1);
  return { type: 'mc', prompt, answer, choices: shuffle([answer, ...others]), explain, ...(say ? { say } : {}) };
};

/* ---------- tones ---------- */
const MARKS = { a: 'āáǎà', e: 'ēéěè', i: 'īíǐì', o: 'ōóǒò', u: 'ūúǔù', ü: 'ǖǘǚǜ' };
export function toneOf(syl) {
  for (const [, m] of Object.entries(MARKS)) for (let t = 0; t < 4; t++) if (syl.includes(m[t])) return t + 1;
  return 5; // neutral
}
function toneVariants(syl) {
  for (const [v, m] of Object.entries(MARKS)) for (let t = 0; t < 4; t++) {
    if (syl.includes(m[t])) return [0, 1, 2, 3].filter(x => x !== t).map(x => syl.replace(m[t], m[x])).concat(syl.replace(m[t], v));
  }
  return [];
}
// wrong pinyin for a word: same syllables with one tone changed
const pinyinWrongs = py => { const s = py.split(' '); const out = []; s.forEach((syl, i) => toneVariants(syl).forEach(v => out.push([...s.slice(0, i), v, ...s.slice(i + 1)].join(' ')))); return out; };
const TONE_NAMES = ['1st tone (high and flat ¯)', '2nd tone (rising ´)', '3rd tone (dip then rise ˇ)', '4th tone (falling `)'];

/* ---------- numbers ---------- */
const DIG = '零一二三四五六七八九';
export function toZh(n) {
  if (n < 10) return DIG[n];
  const units = ['千', '百', '十', ''], ds = String(n).padStart(4, '0').split('').map(Number);
  let out = '', zero = false;
  ds.forEach((d, i) => {
    if (d === 0) { if (out) zero = true; return; }
    if (zero) { out += '零'; zero = false; }
    out += DIG[d] + units[i];
  });
  return n >= 10 && n < 20 ? out.replace(/^一十/, '十') : out;
}
const numWrongs = n => uniq([n + 1, n - 1, n + 10, n - 10, Number(String(n).split('').reverse().join('')), n * 10, Math.floor(n / 10) || n + 2].filter(x => x > 0 && x !== n));
const clock = (h, m) => (h === 2 ? '两' : toZh(h)) + '点' + (m === 0 ? '' : m === 30 ? '半' : toZh(m) + '分');

/* ---------- vocabulary skills (four kinds per theme) ---------- */
function vocabSpecs(key, section, words, grades, { pinyinShown = true } = {}) {
  const say = w => w[0];
  const shown = w => (pinyinShown ? ruby(w[0], w[1]) : zh(w[0]));
  const specs = [
    sk(key + 'Mn', 'What does it mean?', section, grades, () => {
      const w = pick(words);
      return mc(`What does ${shown(w)} mean?`, w[2], words.map(x => x[2]), `${zh(w[0])} (${w[1]}) means ${b(w[2])}.`, say(w));
    }),
    sk(key + 'Ch', 'Choose the Chinese word', section, grades, () => {
      const w = pick(words);
      return mc(`Which word means ${b(w[2])}?`, w[0], words.map(x => x[0]), `${b(w[2])} is ${zh(w[0])} (${w[1]}).`, say(w));
    }),
    sk(key + 'Py', 'Choose the correct pinyin', section, grades, () => {
      const w = pick(words.filter(x => toneVariants(x[1].split(' ')[0]).length || x[1].split(' ').length > 1));
      return mc(`What is the pinyin for ${zh(w[0])} (${w[2]})?`, w[1], [...pinyinWrongs(w[1]), ...words.map(x => x[1])], `${zh(w[0])} is pronounced ${b(w[1])}.`, say(w));
    })
  ];
  if (words.filter(w => w[3]).length >= 4) specs.push(sk(key + 'Pc', 'Match the picture', section, grades, () => {
    const w = pick(words.filter(x => x[3]));
    return mc(`<span style="font-size:2.6rem">${w[3]}</span><br>Which word matches the picture?`, w[0], words.filter(x => x[3] !== w[3]).map(x => x[0]), `The picture shows ${zh(w[0])} (${w[1]}) — ${w[2]}.`, say(w));
  }));
  return specs;
}

/* ---------- grammar banks ---------- */
const SENTENCES = [ // [tokens in order, English, wrong orders]
  [['我', '是', '学生'], 'I am a student.', ['是我学生', '学生是我', '我学生是']],
  [['我', '喜欢', '吃', '苹果'], 'I like to eat apples.', ['我吃喜欢苹果', '喜欢我吃苹果', '我喜欢苹果吃']],
  [['他', '是', '我的', '朋友'], 'He is my friend.', ['我的是他朋友', '他朋友是我的', '是他我的朋友']],
  [['我们', '去', '学校'], 'We go to school.', ['去我们学校', '我们学校去了吗', '学校去我们']],
  [['我', '有', '一个', '哥哥'], 'I have an older brother.', ['我一个有哥哥', '有我一个哥哥', '我有哥哥一个']],
  [['你', '叫', '什么', '名字'], 'What is your name?', ['你什么叫名字', '什么你叫名字', '你叫名字什么']],
  [['妈妈', '在', '家'], 'Mom is at home.', ['在妈妈家', '家妈妈在', '妈妈家在']],
  [['我', '在', '学校', '学习', '中文'], 'I study Chinese at school.', ['我学习中文在学校', '在学校我中文学习', '我学校在学习中文']],
  [['他', '比', '我', '高'], 'He is taller than me.', ['他高比我', '比他我高', '他比高我']],
  [['我', '昨天', '买了', '一本书'], 'I bought a book yesterday.', ['我买了昨天一本书', '我一本书买了昨天', '买了我昨天一本书']],
  [['小猫', '在', '桌子', '下面'], 'The kitten is under the table.', ['在小猫桌子下面', '小猫下面在桌子', '桌子下面在小猫']],
  [['我', '每天', '七点', '起床'], 'I get up at seven every day.', ['我起床每天七点', '我七点起床每天', '起床我每天七点']]
];
const QUESTION_WORDS = [ // [sentence, answer, wrongs, English]
  ['你叫___名字？', '什么', ['谁', '哪儿', '几'], 'What is your name?'], ['他是___？', '谁', ['什么', '哪儿', '几'], 'Who is he?'],
  ['你去___？', '哪儿', ['谁', '几', '什么'], 'Where are you going?'], ['你___岁？', '几', ['什么', '谁', '哪儿'], 'How old are you?'],
  ['这个___钱？', '多少', ['谁', '哪儿', '什么'], 'How much is this?'], ['你___不来？', '为什么', ['什么', '谁', '哪儿'], 'Why aren\'t you coming?'],
  ['这个字___写？', '怎么', ['谁', '哪儿', '几'], 'How do you write this character?'], ['你___去中国？', '什么时候', ['什么', '谁', '几'], 'When are you going to China?']
];
const SHI_YOU_ZAI = [['我___学生。', '是', 'I am a student.'], ['我___一只猫。', '有', 'I have a cat.'], ['妈妈___家里。', '在', 'Mom is at home.'],
  ['他___中国人。', '是', 'He is Chinese.'], ['我们___三本书。', '有', 'We have three books.'], ['书___桌子上。', '在', 'The book is on the table.'],
  ['她___我的姐姐。', '是', 'She is my older sister.'], ['你___笔吗？', '有', 'Do you have a pen?'], ['老师___教室里。', '在', 'The teacher is in the classroom.']];
const PARTICLES = [['你好___？', '吗', 'How are you?', '吗 turns a statement into a yes/no question.'], ['我很好，你___？', '呢', "I'm fine, and you?", '呢 asks "and you?" / "what about…?"'],
  ['你是学生___？', '吗', 'Are you a student?', '吗 makes a yes/no question.'], ['这是我___书。', '的', 'This is my book.', '的 shows belonging, like "\'s".'],
  ['那是老师___笔。', '的', "That is the teacher's pen.", '的 shows belonging.'], ['我已经吃___饭。', '了', 'I have already eaten.', '了 shows a completed action.'],
  ['你喜欢喝茶___？', '吗', 'Do you like to drink tea?', '吗 makes a yes/no question.'], ['我叫小明，你___？', '呢', "I'm Xiaoming, and you?", '呢 asks "and you?"'],
  ['她昨天买___一本书。', '了', 'She bought a book yesterday.', '了 shows a completed action.'], ['这是谁___包？', '的', 'Whose bag is this?', '的 shows belonging.']];
const ASPECT = [['我吃了饭。', 'A completed action'], ['我们看了一个电影。', 'A completed action'], ['我写了一封信。', 'A completed action'],
  ['我吃过北京烤鸭。', 'A past experience'], ['他去过日本。', 'A past experience'], ['我没见过熊猫。', 'A past experience'],
  ['门开着。', 'An ongoing state'], ['她穿着红衣服。', 'An ongoing state'], ['他坐着看书。', 'An ongoing state']];
const TRANSLATE = [ // [English, correct, wrongs]
  ['I have three books.', '我有三本书。', ['我有三个书。', '我三本书有。', '我有书三本。']],
  ['She is taller than me.', '她比我高。', ['她比我很高。', '她高比我。', '我比她高。']],
  ['Where are you going?', '你去哪儿？', ['哪儿你去？', '你去什么？', '你去哪儿吗？']],
  ["I didn't go to school yesterday.", '我昨天没去学校。', ['我昨天没去了学校。', '我没昨天去学校。', '昨天我不去学校。']],
  ['Do you like to eat dumplings?', '你喜欢吃饺子吗？', ['你吗喜欢吃饺子？', '你喜欢饺子吃吗？', '你喜欢吃饺子呢？']],
  ['There is a cat under the table.', '桌子下面有一只猫。', ['有一只猫桌子下面。', '桌子下面有一本猫。', '一只猫有桌子下面。']],
  ['My dad is a doctor.', '我爸爸是医生。', ['我爸爸有医生。', '我爸爸是一医生。', '我是爸爸医生。']],
  ['It is very cold today.', '今天很冷。', ['今天是很冷。', '很冷今天是。', '今天冷很。']],
  ['I have been to Beijing.', '我去过北京。', ['我去北京过。', '我去了过北京。', '我过去了北京了。']],
  ['We study Chinese every day.', '我们每天学习中文。', ['我们学习中文每天。', '每天学习我们中文。', '我们每天中文学习了吗。']]
];
const COMPARE_ADJ = [['高', 'taller'], ['快', 'faster'], ['忙', 'busier'], ['累', 'more tired'], ['大', 'older'], ['胖', 'heavier']];
const KID_NAMES = [['小明', 'Xiaoming'], ['小红', 'Xiaohong'], ['小华', 'Xiaohua'], ['小丽', 'Xiaoli'], ['大伟', 'Dawei']];

/* ---------- reading ---------- */
const READING = {
  A: [ // [passage, pinyin?, question, answer, wrongs]
    ['我叫小明。我今年九岁。我有一个姐姐。我喜欢踢足球。', 'How old is Xiaoming?', '9', ['7', '10', '19']],
    ['我叫小明。我今年九岁。我有一个姐姐。我喜欢踢足球。', 'What does Xiaoming like to do?', 'Play soccer', ['Swim', 'Sing', 'Read books']],
    ['今天是星期六。天气很好。我和妈妈去公园。公园里有很多花。', 'What day is it?', 'Saturday', ['Sunday', 'Monday', 'Friday']],
    ['今天是星期六。天气很好。我和妈妈去公园。公园里有很多花。', 'Where do they go?', 'The park', ['School', 'The store', 'The library']],
    ['小红早上七点起床。她喝牛奶，吃面包。八点她去学校。', 'What time does Xiaohong get up?', '7:00', ['8:00', '6:00', '9:00']],
    ['小红早上七点起床。她喝牛奶，吃面包。八点她去学校。', 'What does she eat?', 'Bread', ['Rice', 'Noodles', 'An apple']],
    ['我家有四口人：爸爸、妈妈、弟弟和我。我们有一只猫。猫是白色的。', 'How many people are in the family?', '4', ['3', '5', '2']],
    ['我家有四口人：爸爸、妈妈、弟弟和我。我们有一只猫。猫是白色的。', 'What colour is the cat?', 'White', ['Black', 'Red', 'Yellow']]
  ],
  B: [
    ['上个周末，我和朋友去了图书馆。我们看了很多书，然后去饭馆吃了饺子。', 'Where did they go first?', 'The library', ['A restaurant', 'The park', 'School']],
    ['上个周末，我和朋友去了图书馆。我们看了很多书，然后去饭馆吃了饺子。', 'What did they eat?', 'Dumplings', ['Noodles', 'Rice', 'Cake']],
    ['李老师是我们的中文老师。她很高，戴眼镜。她上课很有意思，所以学生们都很喜欢她。', 'What does Ms. Li teach?', 'Chinese', ['Math', 'Music', 'Science']],
    ['李老师是我们的中文老师。她很高，戴眼镜。她上课很有意思，所以学生们都很喜欢她。', 'Why do the students like her?', 'Her classes are interesting', ['She is tall', 'She gives no homework', 'She wears glasses']],
    ['这件衣服一百块，那件衣服八十块。这件比那件贵二十块。', 'Which piece of clothing is more expensive?', 'This one, by 20 yuan', ['That one, by 20 yuan', 'This one, by 80 yuan', 'They cost the same']],
    ['冬天很冷，常常下雪。下雪的时候，我喜欢和弟弟在外面堆雪人。', 'What does the writer like to do when it snows?', 'Build a snowman with their brother', ['Stay inside and read', 'Go swimming', 'Play basketball']]
  ],
  C: [
    ['春节是中国最重要的节日。春节的时候，家人会一起吃年夜饭，孩子们会收到红包。很多人还会放鞭炮。', 'What do children receive at Spring Festival?', 'Red envelopes', ['Mooncakes', 'New shoes only', 'Books']],
    ['春节是中国最重要的节日。春节的时候，家人会一起吃年夜饭，孩子们会收到红包。很多人还会放鞭炮。', 'According to the passage, which is the most important Chinese festival?', 'Spring Festival', ['Mid-Autumn Festival', 'Dragon Boat Festival', 'Lantern Festival']],
    ['熊猫生活在中国的四川。它们最喜欢吃竹子，每天要吃很长时间。现在熊猫的数量比以前多了。', 'What do pandas like to eat most?', 'Bamboo', ['Fish', 'Apples', 'Rice']],
    ['熊猫生活在中国的四川。它们最喜欢吃竹子，每天要吃很长时间。现在熊猫的数量比以前多了。', 'How has the number of pandas changed?', 'There are more than before', ['There are fewer than before', 'It has not changed', 'Pandas are extinct']],
    ['小华学了三年中文。刚开始的时候，他觉得汉字很难。可是他每天练习，现在他已经能看懂简单的故事了。', 'How did Xiaohua get better at Chinese?', 'He practised every day', ['He moved to China', 'He stopped reading', 'He only studied pinyin']],
    ['小华学了三年中文。刚开始的时候，他觉得汉字很难。可是他每天练习，现在他已经能看懂简单的故事了。', 'How long has Xiaohua studied Chinese?', 'Three years', ['Three months', 'One year', 'Ten years']]
  ]
};
/* ---------- culture ---------- */
const FESTIVALS = [ // [question, answer, wrongs]
  ['What do children receive at Spring Festival (春节)?', 'Red envelopes (红包)', ['Mooncakes (月饼)', 'Zongzi (粽子)', 'Lanterns (灯笼)']],
  ['What do people eat at the Mid-Autumn Festival (中秋节)?', 'Mooncakes (月饼)', ['Zongzi (粽子)', 'Sweet rice balls (汤圆)', 'Birthday cake']],
  ['What do people eat at the Dragon Boat Festival (端午节)?', 'Zongzi — rice wrapped in leaves (粽子)', ['Mooncakes (月饼)', 'Sweet rice balls (汤圆)', 'Popcorn']],
  ['What do people enjoy at the Lantern Festival (元宵节)?', 'Lanterns and sweet rice balls (汤圆)', ['Mooncakes (月饼)', 'Dragon boat races', 'Snowball fights']],
  ['Which festival celebrates the Lunar New Year?', 'Spring Festival (春节)', ['Mid-Autumn Festival (中秋节)', 'Dragon Boat Festival (端午节)', 'Lantern Festival (元宵节)']],
  ['Which festival is about admiring the full moon with family?', 'Mid-Autumn Festival (中秋节)', ['Spring Festival (春节)', 'Dragon Boat Festival (端午节)', 'Lantern Festival (元宵节)']],
  ['Which festival has dragon boat races?', 'Dragon Boat Festival (端午节)', ['Spring Festival (春节)', 'Mid-Autumn Festival (中秋节)', 'Lantern Festival (元宵节)']]];
const CULTURE = [['What do people in China often use to eat?', 'Chopsticks (筷子)', ['Forks only', 'Their hands only', 'Spoons only']],
  ['What is the capital of China?', 'Beijing (北京)', ['Shanghai (上海)', 'Hong Kong (香港)', 'Xi\'an (西安)']],
  ['Which colour stands for good luck and happiness in Chinese culture?', 'Red', ['Black', 'White', 'Grey']],
  ['Which number is considered very lucky because it sounds like "getting rich"?', '8', ['4', '7', '1']],
  ['Why do some people avoid the number 4?', 'It sounds like the word for "death" (死)', ['It is too small', 'It is an odd number', 'It looks like a chair']],
  ['What is the very long ancient wall in northern China called?', 'The Great Wall (长城)', ['The Forbidden Wall', 'The River Wall', 'The Silk Wall']],
  ['Which drink has been enjoyed in China for thousands of years?', 'Tea (茶)', ['Coffee', 'Lemonade', 'Cola']],
  ['How many animals are in the Chinese zodiac?', '12', ['10', '8', '24']]];

/* ---------- HSK vocabulary units ---------- */
const UNIT = 25;
// a level's words in units of about 25, in list order
const units = level => { const w = HSK[level], n = Math.ceil(w.length / UNIT), size = Math.ceil(w.length / n); return Array.from({ length: n }, (_, i) => w.slice(i * size, (i + 1) * size)); };
const LISTEN = '🎧 <strong>Listen</strong>';
// words that sound the same (他/她 tā, 做/坐 zuò …) can't be told apart by ear
const sameSound = (a, b) => a[1].replace(/ /g, '') === b[1].replace(/ /g, '');
const soundsDifferent = (w, list) => list.filter(x => !sameSound(x, w));
const listenQ = (prompt, answer, wrong, explain, say, n = 4) => ({ ...mc(`${LISTEN}, then ${prompt}`, answer, wrong, explain, say, n), listen: true });

// a writing question: trace each character stroke by stroke (components/WriteCharacters.jsx)
const writeQ = (w, withPy) => ({
  type: 'write', answer: w[0], word: w[0], say: w[0], outline: withPy, choices: [],
  prompt: `✍️ Write the word for ${b(w[2])}${withPy ? ` — ${b(w[1])}` : ''}`,
  explain: `${ruby(w[0], w[1])} means ${b(w[2])}. Press ▶️ Show strokes to watch the stroke order.`
});

// One question about an HSK word, of the given kind. `word` tags it for the review deck.
function wordQuestion(kind, w, words, withPy) {
  const show = withPy ? ruby(w[0], w[1]) : zh(w[0]);
  const q = kind === 'Mn' ? mc(`What does ${show} mean?`, w[2], words.map(x => x[2]), `${ruby(w[0], w[1])} means ${b(w[2])}.`, w[0])
    : kind === 'Ch' ? mc(`Which word means ${b(w[2])}?`, w[0], words.map(x => x[0]), `${b(w[2])} is ${ruby(w[0], w[1])}.`, w[0])
    : kind === 'Py' ? mc(`What is the pinyin for ${zh(w[0])} (${w[2]})?`, w[1], [...pinyinWrongs(w[1]), ...words.map(x => x[1])], `${zh(w[0])} is pronounced ${b(w[1])}.`, w[0])
    : kind === 'Wr' ? writeQ(w, withPy)
    : withPy
      ? listenQ('choose what the word means.', w[2], soundsDifferent(w, words).map(x => x[2]), `You heard ${ruby(w[0], w[1])} — ${b(w[2])}.`, w[0])
      : listenQ('choose the word you heard.', w[0], soundsDifferent(w, words).map(x => x[0]), `You heard ${ruby(w[0], w[1])} — ${w[2]}.`, w[0]);
  return { ...q, word: w[0] };
}

function hskUnitSpecs(level) {
  const withPy = level <= 2; // pinyin over the characters at HSK 1–2
  const unitsOf = units(level), size = unitsOf[0].length;
  return unitsOf.flatMap((words, i) => {
    const s = `Words ${i * size + 1}–${i * size + words.length}`, k = 'V' + (i + 1);
    const spec = (kind, title, pool = words) => sk(k + kind, title, s, [level], () => wordQuestion(kind, pick(pool), words, withPy));
    return [
      spec('Mn', 'What does it mean?'),
      spec('Ch', 'Choose the Chinese word'),
      spec('Py', 'Choose the correct pinyin', words.filter(x => pinyinWrongs(x[1]).length)),
      spec('Ls', '🎧 Listen and choose the meaning'),
      spec('Wr', '✍️ Write the characters')
    ];
  });
}

/* ---------- review deck ---------- */
// every HSK word by its characters: hanzi → { w: row, level }
export const HSK_WORD = new Map(Object.entries(HSK).flatMap(([level, rows]) => rows.map(w => [w[0], { w, level: Number(level) }])));
// A review question for a word: meaning, characters, listening or (now and then) writing.
export function reviewQuestion(hanzi) {
  const e = HSK_WORD.get(hanzi);
  if (!e) return null;
  const words = HSK[e.level], withPy = e.level <= 2;
  const kinds = ['Mn', 'Ch', 'Ls', 'Mn', 'Ch', 'Ls', ...(pinyinWrongs(e.w[1]).length ? ['Py'] : []), ...(hanzi.length <= 2 ? ['Wr'] : [])];
  return wordQuestion(pick(kinds), e.w, words, withPy);
}

/* ---------- listening for tones ---------- */
// Characters whose reading depends on the word they are in — speech would be ambiguous on its own.
const POLY = new Set('得还长着了地的都只要为便好觉差重行朝倒处更和教空乐难少数相应中种背调发干假降角结累量传当分将看只');
const syls = py => py.split(' ');
const has33 = py => syls(py).some((x, i, a) => i && toneOf(a[i - 1]) === 3 && toneOf(x) === 3);
// a word is safe to hear and judge by tone when no sandhi or polyphony can change how it sounds
const toneSafe = ([hz, py]) => !/[一不]/.test(hz) && !has33(py) && !(hz.length === 1 && POLY.has(hz)) && pinyinWrongs(py).length;
// wrong pinyin that sounds different: one tone changed, never to neutral, never making a 3-3 pair
const heardWrongs = py => pinyinWrongs(py).filter(v => syls(v).every(x => toneOf(x) !== 5 || syls(py).includes(x)) && !has33(v));

const TONE_SANDHI = [ // [word, written pinyin, spoken pinyin, rule]
  ...[['你好', 'nǐ hǎo'], ['很好', 'hěn hǎo'], ['水果', 'shuǐ guǒ'], ['可以', 'kě yǐ'], ['老虎', 'lǎo hǔ'], ['洗澡', 'xǐ zǎo'], ['手表', 'shǒu biǎo'], ['所以', 'suǒ yǐ'], ['也许', 'yě xǔ'], ['雨伞', 'yǔ sǎn']]
    .map(([w, py]) => [w, py, py.replace(/[ǎěǐǒǔǚ]/, c => 'áéíóúǘ'['ǎěǐǒǔǚ'.indexOf(c)]), 'Two 3rd tones in a row: the first one is said as a 2nd tone.']),
  ...[['不是', 'bú shì'], ['不去', 'bú qù'], ['不对', 'bú duì'], ['不要', 'bú yào'], ['不会', 'bú huì'], ['不看', 'bú kàn']].map(([w, py]) => [w, '不 bù', py.split(' ')[0], '不 before a 4th tone is said bú (2nd tone).']),
  ...[['不来', 'bù lái'], ['不好', 'bù hǎo'], ['不吃', 'bù chī'], ['不忙', 'bù máng'], ['不喝', 'bù hē']].map(([w, py]) => [w, '不 bù', py.split(' ')[0], '不 keeps its 4th tone (bù) before tones 1, 2 and 3.']),
  ...[['一个', 'yí gè'], ['一样', 'yí yàng'], ['一定', 'yí dìng'], ['一共', 'yí gòng']].map(([w, py]) => [w, '一 yī', py.split(' ')[0], '一 before a 4th tone is said yí (2nd tone).']),
  ...[['一天', 'yì tiān'], ['一年', 'yì nián'], ['一起', 'yì qǐ'], ['一本', 'yì běn']].map(([w, py]) => [w, '一 yī', py.split(' ')[0], '一 before tones 1, 2 and 3 is said yì (4th tone).']),
  ...[['第一', 'dì yī'], ['十一', 'shí yī']].map(([w, py]) => [w, '一 yī', py.split(' ')[1], '一 keeps its 1st tone (yī) when counting, at the end of a word, or as "first".'])
];

/* ---------- grammar by HSK level: [sentence with ___, answer, wrongs, English, why] ---------- */
const GRAMMAR = {
  1: [
    ['我___是老师。', '不', ['没', '很', '都'], "I'm not a teacher.", '不 negates 是, wishes and habits; 没 negates 有 and past actions.'],
    ['我昨天___去学校。', '没', ['不', '很', '吗'], "I didn't go to school yesterday.", '没 negates something that did not happen.'],
    ['他___有哥哥。', '没', ['不', '是', '吗'], "He doesn't have an older brother.", '有 is always negated with 没: 没有.'],
    ['今天___冷了！', '太', ['不', '没', '吗'], "It's too cold today!", '太…了 means "too / so …!"'],
    ['我们___是学生。', '都', ['没', '吗', '呢'], 'We are all students.', '都 (all) goes before the verb.'],
    ['我是中国人，他___是中国人。', '也', ['都', '没', '吗'], "I'm Chinese, and he is Chinese too.", '也 (also) goes before the verb.'],
    ['我___喝茶。', '想', ['没', '吗', '的'], 'I would like to drink tea.', '想 + verb = would like to.'],
    ['你___说汉语吗？', '会', ['是', '有', '的'], 'Can you speak Chinese?', '会 + verb = know how to.']
  ],
  2: [
    ['我___看电视呢。', '正在', ['已经', '别', '再'], 'I am watching TV.', '正在 + verb (+ 呢) = in the middle of doing it.'],
    ['火车快___开了。', '要', ['在', '过', '得'], 'The train is about to leave.', '快要 … 了 = about to happen.'],
    ['他跑___很快。', '得', ['的', '着', '过'], 'He runs fast.', 'verb + 得 + description says how well or how fast something is done.'],
    ['我去___中国。', '过', ['着', '得', '在'], 'I have been to China.', 'verb + 过 = have done it before (an experience).'],
    ['门开___。', '着', ['过', '得', '吧'], 'The door is open.', 'verb + 着 = an ongoing state.'],
    ['今天___昨天冷。', '比', ['跟', '从', '离'], 'Today is colder than yesterday.', 'A 比 B + adjective = A is more … than B.'],
    ['我___八点到十二点上课。', '从', ['比', '离', '给'], 'I have class from eight to twelve.', '从 … 到 … = from … to …'],
    ['学校___我家很近。', '离', ['从', '比', '给'], 'The school is close to my home.', 'A 离 B 近/远 = A is near/far from B.'],
    ['请___我打电话。', '给', ['比', '离', '从'], 'Please call me.', '给 + person + verb = do it for/to someone.'],
    ['你___哭了。', '别', ['没', '很', '都'], "Don't cry.", '别 + verb = don\'t …!'],
    ['我们一起去___。', '吧', ['的', '得', '着'], "Let's go together.", '吧 at the end makes a suggestion.'],
    ['我去过北京两___。', '次', ['个', '本', '件'], 'I have been to Beijing twice.', '次 counts how many times.'],
    ['我___吃饭了。', '已经', ['正在', '再', '别'], 'I have already eaten.', '已经 … 了 = already.'],
    ['___下雨，所以我们没去公园。', '因为', ['可是', '虽然', '还是'], "Because it rained, we didn't go to the park.", '因为 … 所以 … = because … so …']
  ],
  3: [
    ['请___门关上。', '把', ['被', '给', '比'], 'Please close the door.', '把 + object + verb: what you do to something.'],
    ['我的蛋糕___弟弟吃了。', '被', ['把', '比', '从'], 'My cake was eaten by my younger brother.', '被 marks the passive: thing + 被 + doer + verb.'],
    ['天气___冷了。', '越来越', ['一边', '虽然', '或者'], 'The weather is getting colder and colder.', '越来越 + adjective = more and more …'],
    ['他一边吃饭，___看电视。', '一边', ['然后', '或者', '还是'], 'He watches TV while he eats.', '一边 A 一边 B = doing A and B at the same time.'],
    ['___今天很冷，但是我们还是去爬山了。', '虽然', ['因为', '如果', '除了'], 'Although it was cold today, we still went hiking.', '虽然 … 但是 … = although …, (still) …'],
    ['___明天下雨，我们就不去公园了。', '如果', ['虽然', '除了', '一边'], "If it rains tomorrow, we won't go to the park.", '如果 … 就 … = if …, then …'],
    ['___数学以外，我还喜欢音乐。', '除了', ['如果', '虽然', '因为'], 'Besides math, I also like music.', '除了 … 以外，还 … = besides …, also …'],
    ['我先洗澡，___睡觉。', '然后', ['虽然', '如果', '除了'], 'First I take a bath, then I go to sleep.', '先 … 然后 … = first …, then …'],
    ['这个苹果又大___甜。', '又', ['很', '都', '就'], 'This apple is both big and sweet.', '又 A 又 B = both A and B.'],
    ['你喝茶___喝咖啡？', '还是', ['或者', '和', '跟'], 'Do you drink tea or coffee?', '还是 means "or" in questions; 或者 means "or" in statements.'],
    ['周末我去爬山___游泳。', '或者', ['还是', '但是', '所以'], 'On the weekend I go hiking or swimming.', '或者 means "or" in statements; 还是 is for questions.'],
    ['他九点___起床，太晚了。', '才', ['就', '都', '被'], 'He only got up at nine — too late.', '才 = later than expected; 就 = earlier than expected.'],
    ['作业我已经写___了。', '完', ['见', '给', '过'], 'I have already finished my homework.', 'verb + 完 = finish doing it.'],
    ['我听___有人在唱歌。', '见', ['完', '给', '被'], 'I hear someone singing.', '听见 / 看见: the result of listening / looking.']
  ],
  4: [
    ['她不仅会说汉语，___会说日语。', '而且', ['但是', '所以', '因为'], 'She can speak not only Chinese but also Japanese.', '不仅 … 而且 … = not only … but also …'],
    ['___下雨，比赛也会继续。', '即使', ['因为', '所以', '只有'], 'Even if it rains, the game will go on.', '即使 … 也 … = even if …'],
    ['___天气怎么样，他都去跑步。', '不管', ['虽然', '因为', '如果'], 'Whatever the weather, he goes running.', '不管 + question … 都 … = no matter …'],
    ['___你努力，就一定能成功。', '只要', ['只有', '虽然', '不管'], 'As long as you work hard, you will succeed.', '只要 … 就 … = as long as …'],
    ['___多练习，才能说得流利。', '只有', ['只要', '不管', '即使'], 'Only by practising a lot can you speak fluently.', '只有 … 才 … = only if …'],
    ['___你不舒服，就早点儿休息吧。', '既然', ['虽然', '不管', '即使'], "Since you don't feel well, rest early.", '既然 … 就 … = since … (then) …'],
    ['他忙得连饭___没吃。', '都', ['就', '才', '而且'], "He was so busy he didn't even eat.", '连 … 都/也 … = even …'],
    ['天黑了，___我们回家了。', '于是', ['虽然', '即使', '只要'], 'It got dark, so we went home.', '于是 = and so (what happened next).'],
    ['快点儿走吧，___会迟到的。', '否则', ['所以', '因为', '而且'], "Hurry up, or we'll be late.", '否则 = otherwise.'],
    ['___很累，他还是完成了作业。', '尽管', ['因为', '只要', '既然'], 'Although he was tired, he still finished his homework.', '尽管 … 还是 … = even though …'],
    ['___天气不好，航班取消了。', '由于', ['虽然', '即使', '不管'], 'Because of the bad weather, the flight was cancelled.', '由于 = due to / because of (formal).'],
    ['他很喜欢中国菜，___每天都吃。', '甚至', ['虽然', '既然', '即使'], 'He loves Chinese food — he even eats it every day.', '甚至 = even (going further).']
  ],
  5: [
    ['___在家看电视，不如出去走走。', '与其', ['宁可', '虽然', '即使'], 'Rather than watch TV at home, better to go out for a walk.', '与其 A，不如 B = B is better than A.'],
    ['我宁可走路，___不坐那么挤的公共汽车。', '也', ['才', '就', '而'], "I'd rather walk than take such a crowded bus.", '宁可 A 也不 B = would rather A than B.'],
    ['这个问题老师都不会，___学生呢？', '何况', ['因此', '于是', '只要'], "Even the teacher can't answer this, let alone the students.", '何况 = let alone / not to mention.'],
    ['出门多穿点儿衣服，___感冒。', '以免', ['以便', '因此', '何况'], 'Wear more clothes when you go out, so you don\'t catch a cold.', '以免 = so as to avoid.'],
    ['雨不但没停，___越下越大了。', '反而', ['因此', '以免', '何况'], "The rain didn't stop — instead it got heavier.", '不但不/没 … 反而 … = not only not …, but on the contrary …'],
    ['别生他的气了，他___还是个孩子。', '毕竟', ['反而', '何况', '以免'], "Don't be angry with him — after all, he's still a child.", '毕竟 = after all.'],
    ['___你不知道今天考试吗？', '难道', ['何况', '毕竟', '反而'], "Don't tell me you didn't know there's a test today?", '难道 … 吗？ is a rhetorical question: surely not …?'],
    ['他每天锻炼，___身体很健康。', '因此', ['何况', '难道', '以免'], 'He exercises every day, so he is very healthy.', '因此 = therefore.'],
    ['___下雨了，你就打车回家。', '万一', ['何况', '毕竟', '因此'], 'If by any chance it rains, take a taxi home.', '万一 = in case / if by any chance.']
  ],
  6: [
    ['这家公司___顾客为中心。', '以', ['被', '把', '对'], 'This company puts customers at its centre.', '以 A 为 B = take A as B.'],
    ['他之所以成功，___因为他从不放弃。', '是', ['就', '才', '都'], 'The reason he succeeded is that he never gave up.', '之所以 … 是因为 … = the reason … is that …'],
    ['他只是有点儿感冒，___住院吧。', '不至于', ['不得不', '何况', '与其'], "He just has a cold — surely not bad enough to go to hospital.", '不至于 = not to the point of.'],
    ['与其说他聪明，___说他努力。', '不如', ['何况', '而且', '并且'], "He's not so much clever as hard-working.", '与其说 A，不如说 B = it is more B than A.'],
    ['___养成了坏习惯，就很难改掉。', '一旦', ['何况', '与其', '以免'], 'Once a bad habit forms, it is hard to break.', '一旦 … 就 … = once …'],
    ['___天气原因，航班取消了。', '鉴于', ['何况', '以免', '宁可'], 'In view of the weather, the flight was cancelled.', '鉴于 = in view of (formal).'],
    ['这个办法___好，但成本太高。', '固然', ['何况', '以免', '鉴于'], 'This method is good, admittedly, but it costs too much.', '固然 … 但 … = admittedly …, but …'],
    ['这么晚了，___还下着雨，你别走了。', '况且', ['与其', '宁可', '以免'], "It's so late, and besides it's raining — don't leave.", '况且 = besides / moreover.'],
    ['贵的东西___都好。', '未必', ['必须', '何况', '以免'], 'Expensive things are not necessarily all good.', '未必 = not necessarily.']
  ]
};
const grammarSpec = level => sk('Gram', `HSK ${level} grammar: fill in the blank`, 'Grammar patterns', [level], () => {
  const [s, a, w, en, why] = pick(GRAMMAR[level]), full = s.replace('___', a);
  return mc(`Complete: ${zh(s)}<br><small class="muted">(${en})</small>`, a, w, `${why} ${zh(full)}`, full);
});

/* ---------- listening sentences (completed grammar sentences + level banks) ---------- */
const SENTENCE_BANK = {
  1: [...SHI_YOU_ZAI.map(([s, a, en]) => [s.replace('___', a), en]), ...QUESTION_WORDS.slice(0, 5).map(([s, a, , en]) => [s.replace('___', a), en]),
    ...PARTICLES.map(([s, a, en]) => [s.replace('___', a), en]), ...GRAMMAR[1].map(([s, a, , en]) => [s.replace('___', a), en])],
  ...Object.fromEntries([2, 3, 4, 5, 6].map(l => [l, GRAMMAR[l].map(([s, a, , en]) => [s.replace('___', a), en])]))
};
SENTENCE_BANK[2].push(...TRANSLATE.map(([en, hz]) => [hz, en]));
const listenSentenceSpec = level => sk('LsS', '🎧 Listen to a sentence: what does it mean?', 'Listening', [level], () => {
  const bank = SENTENCE_BANK[level], [hz, en] = pick(bank);
  return listenQ('choose what the sentence means.', en, bank.map(x => x[1]), `You heard ${zh(hz)} — ${en}`, hz);
});
const listenToneSpec = level => sk('LsPy', '🎧 Listen for the tones: which pinyin did you hear?', 'Listening', [level], () => {
  const w = pick(HSK[level].filter(toneSafe).filter(x => heardWrongs(x[1]).length >= 2));
  return listenQ(`choose the pinyin you heard${level <= 2 ? '' : ` for ${zh(w[0])}`}.`, w[1], heardWrongs(w[1]), `${ruby(w[0], w[1])} (${w[2]}) is ${b(w[1])}. Listen again and follow the pitch of each syllable.`, w[0]);
});
const listenWordSpec = level => sk('LsW', '🎧 Listen and choose the word: all HSK ' + level + ' words', 'Listening', [level], () => {
  const all = HSK[level], w = pick(all), others = soundsDifferent(w, all);
  // prefer words of the same length so the choices can't be told apart just by length
  const near = shuffle(others.filter(x => x[0].length === w[0].length)).concat(shuffle(others)).slice(0, 12);
  return listenQ('choose the word you heard.', w[0], near.map(x => x[0]), `You heard ${ruby(w[0], w[1])} — ${w[2]}.`, w[0]);
});

/* ---------- more reading ---------- */
READING.D = [
  ['随着科技的发展，越来越多的人选择在网上购物。网上购物不仅方便，而且价格往往比商店便宜。但是，也有人担心商品的质量没有保障。', 'Why do more and more people shop online?', 'It is convenient and often cheaper', ['It is always faster to deliver', 'Stores are closed', 'Products are better quality']],
  ['随着科技的发展，越来越多的人选择在网上购物。网上购物不仅方便，而且价格往往比商店便宜。但是，也有人担心商品的质量没有保障。', 'What do some people worry about?', 'That the quality of goods is not guaranteed', ['That prices are too high', 'That stores will close', 'That delivery is too slow']],
  ['王师傅在这条街上开了二十年的饺子馆。他的饺子皮薄馅大，味道地道，所以虽然店面很小，每天还是有很多顾客排队。', 'How long has Master Wang run his dumpling shop?', 'Twenty years', ['Two years', 'Twelve years', 'Ten years']],
  ['王师傅在这条街上开了二十年的饺子馆。他的饺子皮薄馅大，味道地道，所以虽然店面很小，每天还是有很多顾客排队。', 'Why do customers line up every day?', 'The dumplings are generous and taste authentic', ['The shop is very big', 'The dumplings are free', 'The shop is next to a school']],
  ['有人认为孩子应该从小学习外语，因为年龄越小，学语言越容易。也有人认为，孩子先要把母语学好，然后再学外语也不晚。', 'Why do some people think children should learn a foreign language early?', 'The younger you are, the easier languages are to learn', ['Foreign languages are required at school', 'Children have more free time', 'Their parents speak many languages']],
  ['有人认为孩子应该从小学习外语，因为年龄越小，学语言越容易。也有人认为，孩子先要把母语学好，然后再学外语也不晚。', 'What does the other opinion say?', 'Learn your mother tongue well first; a foreign language later is not too late', ['Never learn a foreign language', 'Only learn foreign languages as an adult', 'Learn three languages at once']]
];
const readingLevel = (level, pools) => sk('Read', `Read HSK ${level} passages`, 'Reading comprehension', [level], () => {
  const [p, q, a, w] = pick(pools.flatMap(k => READING[k]));
  return mc(`<div class="passage zh-passage">${zh(p)}</div><p style="margin-top:10px">${q}</p>`, a, w, `The passage says: ${zh(p)}`, p);
});

export const CHINESE_SPECS = [
  /* ================= Pronunciation and tones ================= */
  sk('TnNo', 'Identify the tone', 'Tones', [1], () => {
    const [hz, py] = pick(TONE_CHARS), t = toneOf(py);
    return mc(`Which tone does ${ruby(hz, py)} have?`, TONE_NAMES[t - 1], TONE_NAMES, `The mark on ${b(py)} shows the ${TONE_NAMES[t - 1]}.`, hz);
  }),
  sk('TnLs', '🎧 Listen: which tone is it?', 'Tones', [1, 2], () => {
    const [hz, py] = pick(TONE_CHARS.filter(c => !POLY.has(c[0]))), t = toneOf(py);
    return listenQ('choose the tone you heard.', TONE_NAMES[t - 1], TONE_NAMES, `${ruby(hz, py)} has the ${b(TONE_NAMES[t - 1])}.`, hz);
  }),
  sk('TnPy', 'Choose the pinyin with the correct tone', 'Tones', [1], () => {
    const [hz, py] = pick(TONE_CHARS);
    return mc(`Which pinyin is correct for ${zh(hz)}?`, py, toneVariants(py), `${zh(hz)} is ${b(py)} (${TONE_NAMES[toneOf(py) - 1]}).`, hz);
  }),
  sk('TnSm', 'Which character has the same tone?', 'Tones', [1], () => {
    const [hz, py] = pick(TONE_CHARS), t = toneOf(py);
    const same = pick(TONE_CHARS.filter(c => c[0] !== hz && toneOf(c[1]) === t));
    const others = sample(TONE_CHARS.filter(c => toneOf(c[1]) !== t), 3);
    return mc(`${ruby(hz, py)} has the ${TONE_NAMES[t - 1].split(' (')[0]}. Which character has the same tone?`, `${same[0]} (${same[1]})`, others.map(c => `${c[0]} (${c[1]})`), `${same[0]} (${same[1]}) also has the ${TONE_NAMES[t - 1]}.`);
  }),
  sk('TnSd', 'Tone changes: 3rd + 3rd, 不 and 一', 'Tones', [2], () => {
    const [w, written, spoken, rule] = pick(TONE_SANDHI);
    if (!/^[不一] /.test(written)) { // 3rd + 3rd: the whole word changes
      const wrong = [written, written.replace(/ (\S+)$/, (m, x) => ' ' + toneVariants(x)[1]), toneVariants(written.split(' ')[0])[0] + ' ' + written.split(' ')[1]];
      return mc(`${zh(w)} is written ${b(written)}. How is it actually said?`, spoken, wrong.filter(x => x !== spoken), `${rule} ${zh(w)} → ${b(spoken)}.`, w);
    }
    const ch = written[0];
    return mc(`How is ${zh(ch)} pronounced in ${zh(w)}?`, spoken, ch === '不' ? ['bù', 'bú', 'bǔ'] : ['yī', 'yí', 'yì'], `${rule} ${zh(w)} → ${b(spoken)}.`, w);
  }),

  /* ================= HSK words ================= */
  ...[1, 2, 3, 4, 5, 6].flatMap(hskUnitSpecs),
  sk('Pc', 'Picture words', 'Picture words', [1], () => {
    const all = Object.values(VOCAB).flat().filter(x => x[3] && x[0].length <= 2);
    const w = pick(all);
    return mc(`<span style="font-size:2.6rem">${w[3]}</span><br>Which word matches the picture?`, w[0], all.filter(x => x[3] !== w[3]).map(x => x[0]), `The picture shows ${ruby(w[0], w[1])} — ${w[2]}.`, w[0]);
  }),

  /* ================= Listening ================= */
  ...[1, 2, 3, 4, 5, 6].flatMap(l => [listenToneSpec(l), listenWordSpec(l), listenSentenceSpec(l)]),

  /* ================= Numbers, time and dates ================= */
  sk('N10', 'Numbers 1 to 10', 'Numbers', [1], () => {
    const n = ri(1, 10);
    return Math.random() < 0.5
      ? mc(`Which character is the number ${b(n)}?`, toZh(n), R(1, 10).map(toZh), `${n} is ${zh(toZh(n))}.`, toZh(n))
      : mc(`What number is ${zh(toZh(n))}?`, String(n), R(1, 10).map(String), `${zh(toZh(n))} is ${b(n)}.`, toZh(n));
  }),
  sk('N99', 'Numbers 11 to 99', 'Numbers', [1], () => {
    const n = ri(11, 99);
    return Math.random() < 0.5
      ? mc(`How do you write ${b(n)} in Chinese?`, toZh(n), numWrongs(n).filter(x => x < 100).map(toZh).concat([toZh(Number(String(n)[1] + String(n)[0]) || n + 1)]), `${n} = ${zh(toZh(n))}: tens digit + 十 + ones digit.`, toZh(n))
      : mc(`What number is ${zh(toZh(n))}?`, String(n), numWrongs(n).filter(x => x < 100).map(String), `${zh(toZh(n))} = ${b(n)}.`, toZh(n));
  }),
  sk('NLs', '🎧 Listen: which number?', 'Numbers', [1, 2], () => {
    const n = ri(1, 99);
    return listenQ('choose the number you heard.', String(n), numWrongs(n).filter(x => x < 100).map(String), `You heard ${zh(toZh(n))} = ${b(n)}.`, toZh(n));
  }),
  sk('N999', 'Numbers 100 to 999', 'Numbers', [2], () => {
    let n; do { n = ri(100, 999); } while (String(n)[0] === '2'); // 二百 vs 两百 are both used — skip to keep one right answer
    return Math.random() < 0.5
      ? mc(`How do you write ${b(n)} in Chinese?`, toZh(n), numWrongs(n).filter(x => x >= 100 && x < 1000 && String(x)[0] !== '2').map(toZh), `${n} = ${zh(toZh(n))}. A zero in the middle is read as 零.`, toZh(n))
      : mc(`What number is ${zh(toZh(n))}?`, String(n), numWrongs(n).map(String), `${zh(toZh(n))} = ${b(n)}.`, toZh(n));
  }),
  sk('N9999', 'Numbers up to 9,999', 'Numbers', [3], () => {
    let n; do { n = ri(1000, 9999); } while (String(n)[0] === '2' || String(n)[1] === '2');
    return mc(`What number is ${zh(toZh(n))}?`, String(n), numWrongs(n).filter(x => x >= 1000).map(String), `${zh(toZh(n))} = ${b(n)} (千 = thousand, 百 = hundred, 十 = ten, 零 = zero placeholder).`, toZh(n));
  }),
  sk('Wk', 'Days of the week', 'Time and dates', [1], () => {
    const [hz, en] = pick(WEEKDAYS);
    return Math.random() < 0.5
      ? mc(`What day is ${zh(hz)}?`, en, WEEKDAYS.map(d => d[1]), `${zh(hz)} is ${b(en)}. 星期 + number (1 = Monday); Sunday is 星期天.`, hz)
      : mc(`How do you say ${b(en)} in Chinese?`, hz, WEEKDAYS.map(d => d[0]), `${b(en)} is ${zh(hz)}.`, hz);
  }),
  sk('Mo', 'Months of the year', 'Time and dates', [1], () => {
    const m = ri(1, 12), hz = toZh(m) + '月';
    return mc(`Which month is ${zh(hz)}?`, MONTHS_EN[m - 1], MONTHS_EN, `${zh(hz)} is month ${m}: ${b(MONTHS_EN[m - 1])}.`, hz);
  }),
  sk('Clk', 'Tell time in Chinese', 'Time and dates', [1, 2], () => {
    const h = ri(1, 12), m = pick([0, 30, 15, 45, 10, 20]);
    const txt = clock(h, m), digital = `${h}:${String(m).padStart(2, '0')}`;
    const wrong = [clock(h === 12 ? 1 : h + 1, m), clock(h, m === 30 ? 0 : 30), clock(h, m === 15 ? 45 : 15), clock((h + 5) % 12 + 1, m)].filter(x => x !== txt);
    return mc(`How do you say ${b(digital)} in Chinese?`, txt, wrong, `${digital} is ${zh(txt)}. (点 = o'clock, 半 = half past, 分 = minutes; 2 o'clock is 两点.)`, txt);
  }),
  sk('Dt', 'Read dates in Chinese', 'Time and dates', [1, 2], () => {
    const m = ri(1, 12), d = ri(1, 28), hz = `${toZh(m)}月${toZh(d)}号`;
    const wrong = [`${toZh(d > 12 ? m : d)}月${toZh(d > 12 ? d === 28 ? 27 : d + 1 : m)}号`, `${toZh(m === 12 ? 1 : m + 1)}月${toZh(d)}号`, `${toZh(m)}月${toZh(d === 28 ? 1 : d + 1)}号`];
    return mc(`Which is ${b(`${MONTHS_EN[m - 1]} ${d}`)}?`, hz, wrong, `Chinese dates go month (月) then day (号, or 日 in writing): ${zh(hz)}.`, hz);
  }),

  /* ================= Grammar ================= */
  sk('MW', 'Measure words', 'Measure words', [1, 2], () => {
    const [mw, py, use, noun, en] = pick(MEASURES);
    return mc(`Complete: ${zh(`一___${noun}`)} (${en})`, mw, uniq(MEASURES.map(x => x[0])), `${zh(mw)} (${py}) is used for ${use}: ${zh(`一${mw}${noun}`)}.`, `一${mw}${noun}`);
  }),
  sk('SYZ', 'Use 是, 有 and 在', 'Sentence building', [1], () => {
    const [s, a, en] = pick(SHI_YOU_ZAI);
    return mc(`Complete: ${zh(s)}<br><small class="muted">(${en})</small>`, a, ['是', '有', '在'], `${zh(a)}: 是 = to be, 有 = to have, 在 = to be at (a place). ${zh(s.replace('___', a))}`, s.replace('___', a), 3);
  }),
  sk('QW', 'Question words', 'Question words', [1, 2], () => {
    const [s, a, w, en] = pick(QUESTION_WORDS);
    return mc(`Complete the question: ${zh(s)}<br><small class="muted">(${en})</small>`, a, w, `${zh(s.replace('___', a))} — ${en}`, s.replace('___', a));
  }),
  sk('Ptc', 'Particles: 吗, 呢, 的 and 了', 'Particles', [1], () => {
    const [s, a, en, why] = pick(PARTICLES);
    return mc(`Complete: ${zh(s)}<br><small class="muted">(${en})</small>`, a, ['吗', '呢', '的', '了'], `${why} ${zh(s.replace('___', a))}`, s.replace('___', a));
  }),
  ...[[1, SENTENCES.slice(0, 8)], [2, SENTENCES.slice(8)]].map(([l, bank]) => sk('Ord', 'Put the words in order', 'Sentence building', [l], () => {
    const [toks, en, wrong] = pick(bank);
    return mc(`Put the words in order: ${zh(shuffle(toks).join(' / '))}<br><small class="muted">(${en})</small>`, toks.join(''), wrong, `${zh(toks.join(''))} — ${en} Chinese order is usually: who + when + where + action + what.`, toks.join(''));
  })),
  sk('Cmp', 'Comparisons with 比', 'Comparisons', [2], () => {
    const [[a, ae], [c, ce]] = sample(KID_NAMES, 2), [adj, en] = pick(COMPARE_ADJ);
    const right = `${a}比${c}${adj}。`;
    return mc(`Which sentence means "${ae} is ${en} than ${ce}"?`, right, [`${c}比${a}${adj}。`, `${a}比${c}很${adj}。`, `${a}${adj}比${c}。`], `Pattern: A 比 B + adjective (no 很): ${zh(right)}`, right);
  }),
  sk('Asp', 'Aspect: 了, 过 and 着', 'Particles', [2, 3], () => {
    const [s, kind] = pick(ASPECT);
    return mc(`What does this sentence describe?<br>${zh(s)}`, kind, ['A completed action', 'A past experience', 'An ongoing state'], `${kind}: 了 = completed, 过 = experienced before, 着 = an ongoing state.`, s, 3);
  }),
  ...[1, 2, 3, 4, 5, 6].map(grammarSpec),
  sk('Tsl', 'Choose the correct translation', 'Sentence building', [2, 3], () => {
    const [en, right, wrong] = pick(TRANSLATE);
    return mc(`Which is the correct Chinese for: ${b(en)}`, right, wrong, `${zh(right)} — ${en}`, right);
  }),
  sk('Opp', 'Opposites', 'Opposites', [2, 3], () => {
    const [x, y, xe, ye] = pick(OPPOSITES); const flip = Math.random() < 0.5; const [q, a, qe, ae] = flip ? [y, x, ye, xe] : [x, y, xe, ye];
    return mc(`What is the opposite of ${zh(q)} (${qe})?`, a, OPPOSITES.flatMap(o => [o[0], o[1]]).filter(z => z !== q), `${zh(q)} (${qe}) ↔ ${zh(a)} (${ae}).`, q);
  }),

  /* ================= Characters ================= */
  sk('RdMn', 'What does the radical mean?', 'Radicals', [2], () => {
    const [r, m, ex] = pick(RADICALS);
    return mc(`The radical ${zh(r)} (found in ${ex.slice(0, 2).map(e => e[0]).join(', ')}) means …`, m, RADICALS.map(x => x[1]), `${zh(r)} means ${b(m)}: ${ex.map(e => `${e[0]} (${e[1]})`).join(', ')}.`);
  }),
  sk('RdFd', 'Which character has this radical?', 'Radicals', [3], () => {
    const [r, m, ex] = pick(RADICALS), right = pick(ex);
    const wrong = sample(RADICALS.filter(x => x[0] !== r), 3).map(x => pick(x[2])[0]);
    return mc(`Which character has the ${b(m)} radical ${zh(r)}?`, right[0], wrong, `${zh(right[0])} (${right[1]}) contains ${zh(r)}.`);
  }),
  sk('RdGs', 'Use the radical to guess the meaning', 'Radicals', [4], () => {
    const [r, m, ex] = pick(RADICALS), right = pick(ex);
    const wrong = sample(RADICALS.filter(x => x[0] !== r), 3).map(x => pick(x[2])[1]);
    return mc(`${zh(right[0])} has the radical ${zh(r)} (${m}). Which meaning is most likely?`, right[1], wrong, `${zh(r)} hints at ${m}: ${zh(right[0])} means ${b(right[1])}.`);
  }),
  ...[['Cy1', 'Idioms (chengyu): set 1', 0, [5]], ['Cy2', 'Idioms (chengyu): set 2', 1, [6]]].map(([k, t, half, g]) => sk(k, t, 'Idioms (chengyu)', g, () => {
    const pool = CHENGYU.filter((_, i) => i % 2 === half), [cy, py, m] = pick(pool);
    return mc(`What does the idiom ${ruby(cy, py)} mean?`, m, CHENGYU.map(c => c[2]), `${zh(cy)} (${py}) means: ${b(m)}.`, cy);
  })),

  /* ================= Reading ================= */
  readingLevel(1, ['A']), readingLevel(2, ['B']), readingLevel(3, ['B', 'C']), readingLevel(4, ['C']), readingLevel(5, ['C', 'D']), readingLevel(6, ['D']),

  /* ================= Culture ================= */
  sk('Fest', 'Chinese festivals', 'Festivals and culture', [1, 2], () => {
    const [q, a, w] = pick(FESTIVALS);
    return mc(q, a, w, `${b(a)}.`);
  }),
  sk('Zod', 'The Chinese zodiac', 'Festivals and culture', [2], () => {
    const i = ri(0, 11), [hz, en, e] = ZODIAC[i];
    const kind = pick(['meaning', 'next', 'year']);
    if (kind === 'meaning') return mc(`Which zodiac animal is ${zh(hz)}?`, `${e} ${en}`, ZODIAC.map(z => `${z[2]} ${z[1]}`), `${zh(hz)} is the ${b(en)}.`, hz);
    if (kind === 'next') { const [nh, ne, nemo] = ZODIAC[(i + 1) % 12]; return mc(`In the zodiac order, which animal comes right after the ${en} ${e}?`, `${nemo} ${ne}`, ZODIAC.map(z => `${z[2]} ${z[1]}`), `Order: ${ZODIAC.map(z => z[1]).join(', ')}. After the ${en} comes the ${b(ne)} (${nh}).`); }
    const year = 2020 + i; return mc(`The Chinese year that begins in ${b(year)} is the year of the …`, `${e} ${en}`, ZODIAC.map(z => `${z[2]} ${z[1]}`), `2020 was the rat, and the animals repeat every 12 years: ${year} is the ${b(en)}.`);
  }),
  sk('Cult', 'Chinese culture', 'Festivals and culture', [3], () => {
    const [q, a, w] = pick(CULTURE);
    return mc(q, a, w, `${b(a)}.`);
  })
];
