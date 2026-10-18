/* Chinese (Mandarin, Simplified characters + pinyin) — word data.
   Vocabulary rows: [hanzi, pinyin (one syllable per character, tone marks), English, emoji?]. */

export const VOCAB = {
  greetings: [
    ['你好', 'nǐ hǎo', 'hello', '👋'], ['谢谢', 'xiè xie', 'thank you', '🙏'], ['再见', 'zài jiàn', 'goodbye', '👋'],
    ['对不起', 'duì bu qǐ', 'sorry', '😔'], ['没关系', 'méi guān xi', "it's okay", '🙂'], ['不客气', 'bú kè qi', "you're welcome", '😊'],
    ['早上好', 'zǎo shang hǎo', 'good morning', '🌅'], ['老师好', 'lǎo shī hǎo', 'hello, teacher', '🧑‍🏫'], ['请', 'qǐng', 'please', '🙂']
  ],
  family: [
    ['爸爸', 'bà ba', 'dad', '👨'], ['妈妈', 'mā ma', 'mom', '👩'], ['哥哥', 'gē ge', 'older brother', '👦'], ['姐姐', 'jiě jie', 'older sister', '👧'],
    ['弟弟', 'dì di', 'younger brother', '👶'], ['妹妹', 'mèi mei', 'younger sister', '👶'], ['爷爷', 'yé ye', 'grandpa (dad\'s dad)', '👴'],
    ['奶奶', 'nǎi nai', 'grandma (dad\'s mom)', '👵'], ['我', 'wǒ', 'I / me', '🙋'], ['你', 'nǐ', 'you', '👉'], ['家', 'jiā', 'home / family', '🏠']
  ],
  colours: [
    ['红色', 'hóng sè', 'red', '🔴'], ['黄色', 'huáng sè', 'yellow', '🟡'], ['蓝色', 'lán sè', 'blue', '🔵'], ['绿色', 'lǜ sè', 'green', '🟢'],
    ['黑色', 'hēi sè', 'black', '⚫'], ['白色', 'bái sè', 'white', '⚪'], ['紫色', 'zǐ sè', 'purple', '🟣'], ['橙色', 'chéng sè', 'orange', '🟠']
  ],
  body: [
    ['头', 'tóu', 'head', '🙂'], ['眼睛', 'yǎn jing', 'eyes', '👀'], ['耳朵', 'ěr duo', 'ears', '👂'], ['鼻子', 'bí zi', 'nose', '👃'],
    ['嘴', 'zuǐ', 'mouth', '👄'], ['手', 'shǒu', 'hand', '✋'], ['脚', 'jiǎo', 'foot', '🦶'], ['牙', 'yá', 'tooth', '🦷']
  ],
  animals: [
    ['猫', 'māo', 'cat', '🐱'], ['狗', 'gǒu', 'dog', '🐶'], ['鱼', 'yú', 'fish', '🐟'], ['鸟', 'niǎo', 'bird', '🐦'], ['马', 'mǎ', 'horse', '🐴'],
    ['牛', 'niú', 'cow', '🐄'], ['羊', 'yáng', 'sheep', '🐑'], ['猪', 'zhū', 'pig', '🐷'], ['兔子', 'tù zi', 'rabbit', '🐰'], ['熊猫', 'xióng māo', 'panda', '🐼'],
    ['老虎', 'lǎo hǔ', 'tiger', '🐯'], ['大象', 'dà xiàng', 'elephant', '🐘'], ['猴子', 'hóu zi', 'monkey', '🐒']
  ],
  food: [
    ['米饭', 'mǐ fàn', 'rice', '🍚'], ['面条', 'miàn tiáo', 'noodles', '🍜'], ['饺子', 'jiǎo zi', 'dumplings', '🥟'], ['苹果', 'píng guǒ', 'apple', '🍎'],
    ['香蕉', 'xiāng jiāo', 'banana', '🍌'], ['西瓜', 'xī guā', 'watermelon', '🍉'], ['牛奶', 'niú nǎi', 'milk', '🥛'], ['水', 'shuǐ', 'water', '💧'],
    ['茶', 'chá', 'tea', '🍵'], ['鸡蛋', 'jī dàn', 'egg', '🥚'], ['面包', 'miàn bāo', 'bread', '🍞'], ['蛋糕', 'dàn gāo', 'cake', '🍰']
  ],
  school: [
    ['书', 'shū', 'book', '📖'], ['笔', 'bǐ', 'pen', '🖊️'], ['学校', 'xué xiào', 'school', '🏫'], ['老师', 'lǎo shī', 'teacher', '🧑‍🏫'],
    ['学生', 'xué sheng', 'student', '🧑‍🎓'], ['书包', 'shū bāo', 'schoolbag', '🎒'], ['朋友', 'péng you', 'friend', '🤝'], ['中文', 'zhōng wén', 'Chinese (language)', '🀄'],
    ['电脑', 'diàn nǎo', 'computer', '💻'], ['桌子', 'zhuō zi', 'table / desk', '🪑']
  ],
  verbs: [
    ['吃', 'chī', 'eat', '🍽️'], ['喝', 'hē', 'drink', '🥤'], ['看', 'kàn', 'look / watch', '👀'], ['听', 'tīng', 'listen', '👂'], ['说', 'shuō', 'speak', '🗣️'],
    ['写', 'xiě', 'write', '✍️'], ['读', 'dú', 'read (aloud)', '📖'], ['走', 'zǒu', 'walk', '🚶'], ['跑', 'pǎo', 'run', '🏃'], ['睡觉', 'shuì jiào', 'sleep', '😴'],
    ['去', 'qù', 'go', '➡️'], ['来', 'lái', 'come', '⬅️'], ['学习', 'xué xí', 'study', '📚'], ['喜欢', 'xǐ huan', 'like', '👍'], ['有', 'yǒu', 'have', '🤲']
  ],
  time: [
    ['今天', 'jīn tiān', 'today', '📅'], ['明天', 'míng tiān', 'tomorrow', '➡️'], ['昨天', 'zuó tiān', 'yesterday', '⬅️'], ['早上', 'zǎo shang', 'morning', '🌅'],
    ['晚上', 'wǎn shang', 'evening', '🌙'], ['星期', 'xīng qī', 'week', '🗓️'], ['月', 'yuè', 'month', '🗓️'], ['年', 'nián', 'year', '🎆']
  ],
  weather: [
    ['晴天', 'qíng tiān', 'sunny day', '☀️'], ['下雨', 'xià yǔ', 'to rain', '🌧️'], ['下雪', 'xià xuě', 'to snow', '❄️'], ['刮风', 'guā fēng', 'to be windy', '🌬️'],
    ['冷', 'lěng', 'cold', '🥶'], ['热', 'rè', 'hot', '🥵'], ['春天', 'chūn tiān', 'spring', '🌸'], ['夏天', 'xià tiān', 'summer', '🏖️'],
    ['秋天', 'qiū tiān', 'autumn', '🍂'], ['冬天', 'dōng tiān', 'winter', '⛄']
  ],
  places: [
    ['医院', 'yī yuàn', 'hospital', '🏥'], ['商店', 'shāng diàn', 'store', '🏪'], ['公园', 'gōng yuán', 'park', '🏞️'], ['图书馆', 'tú shū guǎn', 'library', '📚'],
    ['饭馆', 'fàn guǎn', 'restaurant', '🍽️'], ['超市', 'chāo shì', 'supermarket', '🛒'], ['银行', 'yín háng', 'bank', '🏦'], ['机场', 'jī chǎng', 'airport', '🛫']
  ],
  hobbies: [
    ['唱歌', 'chàng gē', 'sing', '🎤'], ['跳舞', 'tiào wǔ', 'dance', '💃'], ['画画', 'huà huà', 'draw / paint', '🎨'], ['游泳', 'yóu yǒng', 'swim', '🏊'],
    ['踢足球', 'tī zú qiú', 'play soccer', '⚽'], ['打篮球', 'dǎ lán qiú', 'play basketball', '🏀'], ['看书', 'kàn shū', 'read books', '📚'], ['听音乐', 'tīng yīn yuè', 'listen to music', '🎧']
  ],
  feelings: [
    ['高兴', 'gāo xìng', 'happy', '😊'], ['难过', 'nán guò', 'sad', '😢'], ['生气', 'shēng qì', 'angry', '😠'], ['累', 'lèi', 'tired', '😴'],
    ['饿', 'è', 'hungry', '🤤'], ['渴', 'kě', 'thirsty', '🥤'], ['害怕', 'hài pà', 'scared', '😨'], ['忙', 'máng', 'busy', '🏃']
  ],
  clothing: [
    ['衣服', 'yī fu', 'clothes', '👕'], ['裤子', 'kù zi', 'pants', '👖'], ['鞋', 'xié', 'shoes', '👟'], ['帽子', 'mào zi', 'hat', '🧢'],
    ['裙子', 'qún zi', 'skirt', '👗'], ['买', 'mǎi', 'buy', '🛍️'], ['卖', 'mài', 'sell', '🏷️'], ['钱', 'qián', 'money', '💰'],
    ['贵', 'guì', 'expensive', '💎'], ['便宜', 'pián yi', 'cheap', '🏷️']
  ],
  transport: [
    ['汽车', 'qì chē', 'car', '🚗'], ['公共汽车', 'gōng gòng qì chē', 'bus', '🚌'], ['飞机', 'fēi jī', 'airplane', '✈️'], ['火车', 'huǒ chē', 'train', '🚆'],
    ['自行车', 'zì xíng chē', 'bicycle', '🚲'], ['船', 'chuán', 'boat', '⛵'], ['地铁', 'dì tiě', 'subway', '🚇'], ['出租车', 'chū zū chē', 'taxi', '🚕']
  ]
};

// Single characters with their citation tone, for tone practice.
export const TONE_CHARS = [['妈', 'mā'], ['麻', 'má'], ['马', 'mǎ'], ['骂', 'mà'], ['书', 'shū'], ['八', 'bā'], ['茶', 'chá'], ['我', 'wǒ'], ['是', 'shì'], ['天', 'tiān'],
  ['人', 'rén'], ['好', 'hǎo'], ['大', 'dà'], ['中', 'zhōng'], ['学', 'xué'], ['水', 'shuǐ'], ['火', 'huǒ'], ['山', 'shān'], ['口', 'kǒu'], ['日', 'rì'],
  ['月', 'yuè'], ['木', 'mù'], ['手', 'shǒu'], ['鱼', 'yú'], ['猫', 'māo'], ['狗', 'gǒu'], ['牛', 'niú'], ['羊', 'yáng'], ['吃', 'chī'], ['喝', 'hē'],
  ['看', 'kàn'], ['去', 'qù'], ['来', 'lái'], ['有', 'yǒu'], ['红', 'hóng'], ['白', 'bái'], ['黑', 'hēi'], ['小', 'xiǎo'], ['多', 'duō'], ['高', 'gāo'],
  ['冷', 'lěng'], ['热', 'rè'], ['笔', 'bǐ'], ['家', 'jiā'], ['爱', 'ài'], ['雨', 'yǔ'], ['花', 'huā'], ['草', 'cǎo'], ['云', 'yún'], ['星', 'xīng'],
  ['门', 'mén'], ['车', 'chē'], ['船', 'chuán'], ['菜', 'cài'], ['饭', 'fàn']];

// [radical, meaning, characters that contain it, English for each]
export const RADICALS = [
  ['氵', 'water', [['河', 'river'], ['海', 'sea'], ['洗', 'wash'], ['汤', 'soup']]],
  ['木', 'tree / wood', [['林', 'woods'], ['树', 'tree'], ['桥', 'bridge'], ['椅', 'chair']]],
  ['口', 'mouth', [['吃', 'eat'], ['喝', 'drink'], ['叫', 'call'], ['唱', 'sing']]],
  ['扌', 'hand', [['打', 'hit / play'], ['拍', 'clap'], ['找', 'look for'], ['推', 'push']]],
  ['亻', 'person', [['你', 'you'], ['他', 'he'], ['们', '(plural)'], ['住', 'live']]],
  ['女', 'woman', [['妈', 'mom'], ['姐', 'older sister'], ['妹', 'younger sister'], ['奶', 'grandma']]],
  ['艹', 'grass / plant', [['花', 'flower'], ['草', 'grass'], ['茶', 'tea'], ['菜', 'vegetable']]],
  ['火', 'fire', [['灯', 'lamp'], ['烧', 'burn'], ['炒', 'stir-fry'], ['烤', 'roast']]],
  ['讠', 'speech', [['说', 'speak'], ['话', 'words'], ['语', 'language'], ['请', 'please']]],
  ['钅', 'metal', [['钱', 'money'], ['铁', 'iron'], ['钟', 'clock'], ['银', 'silver']]],
  ['犭', 'animal', [['狗', 'dog'], ['猫', 'cat'], ['猪', 'pig'], ['狮', 'lion']]],
  ['足', 'foot', [['跑', 'run'], ['跳', 'jump'], ['路', 'road'], ['踢', 'kick']]]
];

// Measure words: [measure word, pinyin, what it counts, example noun phrase (hanzi), English]
export const MEASURES = [
  ['本', 'běn', 'books and notebooks', '书', 'a book'], ['只', 'zhī', 'many animals', '猫', 'a cat'], ['只', 'zhī', 'many animals', '鸟', 'a bird'],
  ['张', 'zhāng', 'flat things (paper, photos, tickets)', '纸', 'a sheet of paper'], ['张', 'zhāng', 'flat things (paper, photos, tickets)', '票', 'a ticket'],
  ['杯', 'bēi', 'cups of a drink', '水', 'a cup of water'], ['杯', 'bēi', 'cups of a drink', '茶', 'a cup of tea'],
  ['条', 'tiáo', 'long, thin things (fish, rivers, roads)', '鱼', 'a fish'], ['条', 'tiáo', 'long, thin things (fish, rivers, roads)', '河', 'a river'],
  ['辆', 'liàng', 'vehicles', '汽车', 'a car'], ['辆', 'liàng', 'vehicles', '自行车', 'a bicycle'],
  ['件', 'jiàn', 'pieces of clothing (tops) and matters', '衣服', 'a piece of clothing'], ['双', 'shuāng', 'pairs', '鞋', 'a pair of shoes'],
  ['个', 'gè', 'people and many everyday things', '人', 'a person'], ['个', 'gè', 'people and many everyday things', '苹果', 'an apple'], ['支', 'zhī', 'pens and pencils', '笔', 'a pen']
];

export const WEEKDAYS = [['星期一', 'Monday'], ['星期二', 'Tuesday'], ['星期三', 'Wednesday'], ['星期四', 'Thursday'], ['星期五', 'Friday'], ['星期六', 'Saturday'], ['星期天', 'Sunday']];
export const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const OPPOSITES = [['大', '小', 'big', 'small'], ['多', '少', 'many', 'few'], ['高', '矮', 'tall', 'short'], ['长', '短', 'long', 'short'], ['快', '慢', 'fast', 'slow'],
  ['冷', '热', 'cold', 'hot'], ['上', '下', 'up', 'down'], ['左', '右', 'left', 'right'], ['前', '后', 'front', 'back'], ['里', '外', 'inside', 'outside'],
  ['买', '卖', 'buy', 'sell'], ['来', '去', 'come', 'go'], ['开', '关', 'open', 'close'], ['新', '旧', 'new', 'old'], ['好', '坏', 'good', 'bad'],
  ['早', '晚', 'early', 'late'], ['黑', '白', 'black', 'white'], ['贵', '便宜', 'expensive', 'cheap']];

// [idiom, pinyin, meaning]
export const CHENGYU = [
  ['一心一意', 'yī xīn yī yì', 'with all your heart; fully focused'], ['马马虎虎', 'mǎ mǎ hū hū', 'so-so; careless'],
  ['画蛇添足', 'huà shé tiān zú', 'to ruin something by adding what is not needed (drawing legs on a snake)'],
  ['守株待兔', 'shǒu zhū dài tù', 'to wait for luck instead of working (waiting by a tree stump for a rabbit)'],
  ['对牛弹琴', 'duì niú tán qín', 'to talk to someone who cannot understand (playing music to a cow)'],
  ['半途而废', 'bàn tú ér fèi', 'to give up halfway'], ['自言自语', 'zì yán zì yǔ', 'to talk to yourself'],
  ['井底之蛙', 'jǐng dǐ zhī wā', 'someone with a narrow view (a frog at the bottom of a well)'],
  ['亡羊补牢', 'wáng yáng bǔ láo', 'better late than never (fixing the pen after losing a sheep)'],
  ['熟能生巧', 'shú néng shēng qiǎo', 'practice makes perfect'], ['入乡随俗', 'rù xiāng suí sú', 'when in Rome, do as the Romans do'],
  ['七上八下', 'qī shàng bā xià', 'nervous and uneasy'], ['一举两得', 'yī jǔ liǎng dé', 'to get two benefits with one action'],
  ['千方百计', 'qiān fāng bǎi jì', 'to try every possible way']
];

export const ZODIAC = [['鼠', 'rat', '🐀'], ['牛', 'ox', '🐂'], ['虎', 'tiger', '🐅'], ['兔', 'rabbit', '🐇'], ['龙', 'dragon', '🐉'], ['蛇', 'snake', '🐍'],
  ['马', 'horse', '🐎'], ['羊', 'goat', '🐐'], ['猴', 'monkey', '🐒'], ['鸡', 'rooster', '🐓'], ['狗', 'dog', '🐕'], ['猪', 'pig', '🐖']];
