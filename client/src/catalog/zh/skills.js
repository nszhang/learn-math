/* Chinese (Mandarin, Simplified + pinyin), Grades 1–12, as a second language.
   Specs { k, t, s, g, gen } expand into one skill per grade (id "chi" + k + grade). */
import { VOCAB, TONE_CHARS, RADICALS, MEASURES, WEEKDAYS, MONTHS_EN, OPPOSITES, CHENGYU, ZODIAC } from './data.js';

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
const readingSpec = (k, t, level, grades) => sk(k, t, 'Reading comprehension', grades, () => {
  const [p, q, a, w] = pick(READING[level]);
  return mc(`<div class="passage zh-passage">${zh(p)}</div><p style="margin-top:10px">${q}</p>`, a, w, `The passage says: ${zh(p)}`, p);
});

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

export const CHINESE_SPECS = [
  /* ================= Pinyin and tones ================= */
  sk('TnNo', 'Identify the tone', 'Tones', [1, 2], () => {
    const [hz, py] = pick(TONE_CHARS), t = toneOf(py);
    return mc(`Which tone does ${ruby(hz, py)} have?`, TONE_NAMES[t - 1], TONE_NAMES, `The mark on ${b(py)} shows the ${TONE_NAMES[t - 1]}.`, hz);
  }),
  sk('TnPy', 'Choose the pinyin with the correct tone', 'Tones', [1, 2, 3], () => {
    const [hz, py] = pick(TONE_CHARS);
    return mc(`Which pinyin is correct for ${zh(hz)}?`, py, toneVariants(py), `${zh(hz)} is ${b(py)} (${TONE_NAMES[toneOf(py) - 1]}).`, hz);
  }),
  sk('TnSm', 'Which character has the same tone?', 'Tones', [2, 3], () => {
    const [hz, py] = pick(TONE_CHARS), t = toneOf(py);
    const same = pick(TONE_CHARS.filter(c => c[0] !== hz && toneOf(c[1]) === t));
    const others = sample(TONE_CHARS.filter(c => toneOf(c[1]) !== t), 3);
    return mc(`${ruby(hz, py)} has the ${TONE_NAMES[t - 1].split(' (')[0]}. Which character has the same tone?`, `${same[0]} (${same[1]})`, others.map(c => `${c[0]} (${c[1]})`), `${same[0]} (${same[1]}) also has the ${TONE_NAMES[t - 1]}.`);
  }),

  /* ================= Characters and radicals ================= */
  sk('RdMn', 'What does the radical mean?', 'Radicals', [2, 3, 4], () => {
    const [r, m, ex] = pick(RADICALS);
    return mc(`The radical ${zh(r)} (found in ${ex.slice(0, 2).map(e => e[0]).join(', ')}) means …`, m, RADICALS.map(x => x[1]), `${zh(r)} means ${b(m)}: ${ex.map(e => `${e[0]} (${e[1]})`).join(', ')}.`);
  }),
  sk('RdFd', 'Which character has this radical?', 'Radicals', R(3, 8), () => {
    const [r, m, ex] = pick(RADICALS), right = pick(ex);
    const wrong = sample(RADICALS.filter(x => x[0] !== r), 3).map(x => pick(x[2])[0]);
    return mc(`Which character has the ${b(m)} radical ${zh(r)}?`, right[0], wrong, `${zh(right[0])} (${right[1]}) contains ${zh(r)}.`);
  }),
  sk('RdGs', 'Use the radical to guess the meaning', 'Radicals', R(4, 10), () => {
    const [r, m, ex] = pick(RADICALS), right = pick(ex);
    const wrong = sample(RADICALS.filter(x => x[0] !== r), 3).map(x => pick(x[2])[1]);
    return mc(`${zh(right[0])} has the radical ${zh(r)} (${m}). Which meaning is most likely?`, right[1], wrong, `${zh(r)} hints at ${m}: ${zh(right[0])} means ${b(right[1])}.`);
  }),

  /* ================= Vocabulary themes ================= */
  ...vocabSpecs('Gr', 'Greetings', VOCAB.greetings, [1, 2]),
  ...vocabSpecs('Fm', 'Family', VOCAB.family, [1, 2]),
  ...vocabSpecs('Cl', 'Colours', VOCAB.colours, [1, 2]),
  ...vocabSpecs('Bd', 'Body', VOCAB.body, [1, 2]),
  ...vocabSpecs('An', 'Animals', VOCAB.animals, [2, 3]),
  ...vocabSpecs('Fd', 'Food and drink', VOCAB.food, [2, 3]),
  ...vocabSpecs('Sc', 'School', VOCAB.school, [2, 3]),
  ...vocabSpecs('Vb', 'Action words', VOCAB.verbs, [3, 4]),
  ...vocabSpecs('Tm', 'Time and dates', VOCAB.time, [3, 4]),
  ...vocabSpecs('Wx', 'Weather and seasons', VOCAB.weather, [3, 4]),
  ...vocabSpecs('Pl', 'Places', VOCAB.places, [4, 5]),
  ...vocabSpecs('Hb', 'Hobbies', VOCAB.hobbies, [4, 5]),
  ...vocabSpecs('Fl', 'Feelings', VOCAB.feelings, [4, 5]),
  ...vocabSpecs('Ct', 'Clothing and shopping', VOCAB.clothing, [5, 6]),
  ...vocabSpecs('Tr', 'Transportation', VOCAB.transport, [5, 6]),
  // Grades 6–12: themes grouped into units, characters shown without pinyin
  ...[['UE', 'Everyday words', [...VOCAB.greetings, ...VOCAB.family, ...VOCAB.colours, ...VOCAB.body]],
    ['UF', 'Food, animals and school', [...VOCAB.food, ...VOCAB.animals, ...VOCAB.school]],
    ['UD', 'Daily life', [...VOCAB.verbs, ...VOCAB.time, ...VOCAB.weather]],
    ['UT', 'Around town', [...VOCAB.places, ...VOCAB.hobbies, ...VOCAB.feelings]],
    ['US', 'Shopping and travel', [...VOCAB.clothing, ...VOCAB.transport]]]
    .flatMap(([k, section, words]) => vocabSpecs(k, section, words, R(6, 12), { pinyinShown: false }).filter(x => !x.k.endsWith('Pc'))),
  // review without pinyin: read the characters on their own
  sk('Rv', 'Read characters without pinyin: review', 'Character meanings', R(6, 12), () => {
    const all = Object.values(VOCAB).flat(), w = pick(all);
    return mc(`What does ${zh(w[0])} mean?`, w[2], all.map(x => x[2]), `${zh(w[0])} (${w[1]}) means ${b(w[2])}.`, w[0]);
  }),

  /* ================= Numbers ================= */
  sk('N10', 'Numbers 1 to 10', 'Numbers', [1], () => {
    const n = ri(1, 10);
    return Math.random() < 0.5
      ? mc(`Which character is the number ${b(n)}?`, toZh(n), R(1, 10).map(toZh), `${n} is ${zh(toZh(n))}.`, toZh(n))
      : mc(`What number is ${zh(toZh(n))}?`, String(n), R(1, 10).map(String), `${zh(toZh(n))} is ${b(n)}.`, toZh(n));
  }),
  sk('N99', 'Numbers 11 to 99', 'Numbers', [2, 3], () => {
    const n = ri(11, 99);
    return Math.random() < 0.5
      ? mc(`How do you write ${b(n)} in Chinese?`, toZh(n), numWrongs(n).filter(x => x < 100).map(toZh).concat([toZh(Number(String(n)[1] + String(n)[0]) || n + 1)]), `${n} = ${zh(toZh(n))}: tens digit + 十 + ones digit.`, toZh(n))
      : mc(`What number is ${zh(toZh(n))}?`, String(n), numWrongs(n).filter(x => x < 100).map(String), `${zh(toZh(n))} = ${b(n)}.`, toZh(n));
  }),
  sk('N999', 'Numbers 100 to 999', 'Numbers', [3, 4], () => {
    let n; do { n = ri(100, 999); } while (String(n)[0] === '2'); // 二百 vs 两百 are both used — skip to keep one right answer
    return Math.random() < 0.5
      ? mc(`How do you write ${b(n)} in Chinese?`, toZh(n), numWrongs(n).filter(x => x >= 100 && x < 1000 && String(x)[0] !== '2').map(toZh), `${n} = ${zh(toZh(n))}. A zero in the middle is read as 零.`, toZh(n))
      : mc(`What number is ${zh(toZh(n))}?`, String(n), numWrongs(n).map(String), `${zh(toZh(n))} = ${b(n)}.`, toZh(n));
  }),
  sk('N9999', 'Numbers up to 9,999', 'Numbers', R(4, 8), () => {
    let n; do { n = ri(1000, 9999); } while (String(n)[0] === '2' || String(n)[1] === '2');
    return mc(`What number is ${zh(toZh(n))}?`, String(n), numWrongs(n).filter(x => x >= 1000).map(String), `${zh(toZh(n))} = ${b(n)} (千 = thousand, 百 = hundred, 十 = ten, 零 = zero placeholder).`, toZh(n));
  }),

  /* ================= Time and dates ================= */
  sk('Wk', 'Days of the week', 'Time and dates', [2, 3], () => {
    const [hz, en] = pick(WEEKDAYS);
    return Math.random() < 0.5
      ? mc(`What day is ${zh(hz)}?`, en, WEEKDAYS.map(d => d[1]), `${zh(hz)} is ${b(en)}. 星期 + number (1 = Monday); Sunday is 星期天.`, hz)
      : mc(`How do you say ${b(en)} in Chinese?`, hz, WEEKDAYS.map(d => d[0]), `${b(en)} is ${zh(hz)}.`, hz);
  }),
  sk('Mo', 'Months of the year', 'Time and dates', [2, 3], () => {
    const m = ri(1, 12), hz = toZh(m) + '月';
    return mc(`Which month is ${zh(hz)}?`, MONTHS_EN[m - 1], MONTHS_EN, `${zh(hz)} is month ${m}: ${b(MONTHS_EN[m - 1])}.`, hz);
  }),
  sk('Clk', 'Tell time in Chinese', 'Time and dates', R(3, 7), () => {
    const h = ri(1, 12), m = pick([0, 30, 15, 45, 10, 20]);
    const txt = clock(h, m), digital = `${h}:${String(m).padStart(2, '0')}`;
    const wrong = [clock(h === 12 ? 1 : h + 1, m), clock(h, m === 30 ? 0 : 30), clock(h, m === 15 ? 45 : 15), clock((h + 5) % 12 + 1, m)].filter(x => x !== txt);
    return mc(`How do you say ${b(digital)} in Chinese?`, txt, wrong, `${digital} is ${zh(txt)}. (点 = o'clock, 半 = half past, 分 = minutes; 2 o'clock is 两点.)`, txt);
  }),
  sk('Dt', 'Read dates in Chinese', 'Time and dates', R(3, 8), () => {
    const m = ri(1, 12), d = ri(1, 28), hz = `${toZh(m)}月${toZh(d)}日`;
    const wrong = [`${toZh(d > 12 ? m : d)}月${toZh(d > 12 ? d === 28 ? 27 : d + 1 : m)}日`, `${toZh(m === 12 ? 1 : m + 1)}月${toZh(d)}日`, `${toZh(m)}月${toZh(d === 28 ? 1 : d + 1)}日`];
    return mc(`Which is ${b(`${MONTHS_EN[m - 1]} ${d}`)}?`, hz, wrong, `Chinese dates go month (月) then day (日): ${zh(hz)}.`, hz);
  }),

  /* ================= Grammar ================= */
  sk('MW', 'Measure words', 'Measure words', R(2, 8), () => {
    const [mw, py, use, noun, en] = pick(MEASURES);
    return mc(`Complete: ${zh(`一___${noun}`)} (${en})`, mw, uniq(MEASURES.map(x => x[0])), `${zh(mw)} (${py}) is used for ${use}: ${zh(`一${mw}${noun}`)}.`, `一${mw}${noun}`);
  }),
  sk('SYZ', 'Use 是, 有 and 在', 'Sentence building', [2, 3], () => {
    const [s, a, en] = pick(SHI_YOU_ZAI);
    return mc(`Complete: ${zh(s)}<br><small class="muted">(${en})</small>`, a, ['是', '有', '在'], `${zh(a)}: 是 = to be, 有 = to have, 在 = to be at (a place). ${zh(s.replace('___', a))}`, s.replace('___', a), 3);
  }),
  sk('QW', 'Question words', 'Question words', R(3, 8), () => {
    const [s, a, w, en] = pick(QUESTION_WORDS);
    return mc(`Complete the question: ${zh(s)}<br><small class="muted">(${en})</small>`, a, w, `${zh(s.replace('___', a))} — ${en}`, s.replace('___', a));
  }),
  sk('Ptc', 'Particles: 吗, 呢, 的 and 了', 'Particles', R(3, 9), () => {
    const [s, a, en, why] = pick(PARTICLES);
    return mc(`Complete: ${zh(s)}<br><small class="muted">(${en})</small>`, a, ['吗', '呢', '的', '了'], `${why} ${zh(s.replace('___', a))}`, s.replace('___', a));
  }),
  sk('Ord', 'Put the words in order', 'Sentence building', R(3, 9), () => {
    const [toks, en, wrong] = pick(SENTENCES);
    return mc(`Put the words in order: ${zh(shuffle(toks).join(' / '))}<br><small class="muted">(${en})</small>`, toks.join(''), wrong, `${zh(toks.join(''))} — ${en} Chinese order is usually: who + when + where + action + what.`, toks.join(''));
  }),
  sk('Cmp', 'Comparisons with 比', 'Comparisons', R(5, 10), () => {
    const [[a, ae], [c, ce]] = sample(KID_NAMES, 2), [adj, en] = pick(COMPARE_ADJ);
    const right = `${a}比${c}${adj}。`;
    return mc(`Which sentence means "${ae} is ${en} than ${ce}"?`, right, [`${c}比${a}${adj}。`, `${a}比${c}很${adj}。`, `${a}${adj}比${c}。`], `Pattern: A 比 B + adjective (no 很): ${zh(right)}`, right);
  }),
  sk('Asp', 'Aspect: 了, 过 and 着', 'Particles', R(7, 12), () => {
    const [s, kind] = pick(ASPECT);
    return mc(`What does this sentence describe?<br>${zh(s)}`, kind, ['A completed action', 'A past experience', 'An ongoing state'], `${kind}: 了 = completed, 过 = experienced before, 着 = an ongoing state.`, s, 3);
  }),
  sk('Tsl', 'Choose the correct translation', 'Sentence building', R(7, 12), () => {
    const [en, right, wrong] = pick(TRANSLATE);
    return mc(`Which is the correct Chinese for: ${b(en)}`, right, wrong, `${zh(right)} — ${en}`, right);
  }),
  sk('Opp', 'Opposites', 'Opposites', R(3, 8), () => {
    const [x, y, xe, ye] = pick(OPPOSITES); const flip = Math.random() < 0.5; const [q, a, qe, ae] = flip ? [y, x, ye, xe] : [x, y, xe, ye];
    return mc(`What is the opposite of ${zh(q)} (${qe})?`, a, OPPOSITES.flatMap(o => [o[0], o[1]]).filter(z => z !== q), `${zh(q)} (${qe}) ↔ ${zh(a)} (${ae}).`, q);
  }),

  /* ================= Idioms ================= */
  ...[['Cy1', 'Idioms (chengyu): set 1', 0, R(6, 8)], ['Cy2', 'Idioms (chengyu): set 2', 1, R(9, 12)]].map(([k, t, half, g]) => sk(k, t, 'Idioms (chengyu)', g, () => {
    const pool = CHENGYU.filter((_, i) => i % 2 === half), [cy, py, m] = pick(pool);
    return mc(`What does the idiom ${ruby(cy, py)} mean?`, m, CHENGYU.map(c => c[2]), `${zh(cy)} (${py}) means: ${b(m)}.`, cy);
  })),

  /* ================= Reading ================= */
  readingSpec('RdA', 'Read short passages', 'A', [4, 5, 6]),
  readingSpec('RdB', 'Read passages: everyday life', 'B', [7, 8, 9]),
  readingSpec('RdC', 'Read passages: culture and nature', 'C', [10, 11, 12]),

  /* ================= Culture ================= */
  sk('Fest', 'Chinese festivals', 'Festivals and culture', R(2, 8), () => {
    const [q, a, w] = pick(FESTIVALS);
    return mc(q, a, w, `${b(a)}.`);
  }),
  sk('Zod', 'The Chinese zodiac', 'Festivals and culture', R(3, 8), () => {
    const i = ri(0, 11), [hz, en, e] = ZODIAC[i];
    const kind = pick(['meaning', 'next', 'year']);
    if (kind === 'meaning') return mc(`Which zodiac animal is ${zh(hz)}?`, `${e} ${en}`, ZODIAC.map(z => `${z[2]} ${z[1]}`), `${zh(hz)} is the ${b(en)}.`, hz);
    if (kind === 'next') { const [nh, ne, nemo] = ZODIAC[(i + 1) % 12]; return mc(`In the zodiac order, which animal comes right after the ${en} ${e}?`, `${nemo} ${ne}`, ZODIAC.map(z => `${z[2]} ${z[1]}`), `Order: ${ZODIAC.map(z => z[1]).join(', ')}. After the ${en} comes the ${b(ne)} (${nh}).`); }
    const year = 2020 + i; return mc(`The Chinese year that begins in ${b(year)} is the year of the …`, `${e} ${en}`, ZODIAC.map(z => `${z[2]} ${z[1]}`), `2020 was the rat, and the animals repeat every 12 years: ${year} is the ${b(en)}.`);
  }),
  sk('Cult', 'Chinese culture', 'Festivals and culture', R(6, 12), () => {
    const [q, a, w] = pick(CULTURE);
    return mc(q, a, w, `${b(a)}.`);
  })
];
