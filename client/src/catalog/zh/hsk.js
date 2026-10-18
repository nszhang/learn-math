/* HSK vocabulary (HSK 2.0). HSK 1 and 2 are the complete lists; HSK 3–6 are
   selected core words. One row per word: "hanzi|pinyin (one syllable per character)|English". */
const parse = s => s.trim().split('\n').map(l => l.trim()).filter(Boolean).map(l => l.split('|'));

export const HSK = {
  1: parse(`
爱|ài|to love
八|bā|eight
爸爸|bà ba|dad
杯子|bēi zi|cup
北京|běi jīng|Beijing
本|běn|(measure word for books)
不|bù|not
不客气|bú kè qi|you're welcome
菜|cài|dish; vegetable
茶|chá|tea
吃|chī|to eat
出租车|chū zū chē|taxi
打电话|dǎ diàn huà|to make a phone call
大|dà|big
的|de|(possessive particle)
点|diǎn|o'clock
电脑|diàn nǎo|computer
电视|diàn shì|television
电影|diàn yǐng|movie
东西|dōng xi|thing
都|dōu|all; both
读|dú|to read
对不起|duì bu qǐ|sorry
多|duō|many; much
多少|duō shao|how many; how much
儿子|ér zi|son
二|èr|two
饭店|fàn diàn|restaurant; hotel
飞机|fēi jī|airplane
分钟|fēn zhōng|minute
高兴|gāo xìng|happy
个|gè|(general measure word)
工作|gōng zuò|to work; job
狗|gǒu|dog
汉语|hàn yǔ|Chinese language
好|hǎo|good
号|hào|day of the month
喝|hē|to drink
和|hé|and
很|hěn|very
后面|hòu mian|behind
回|huí|to return
会|huì|can; know how to
几|jǐ|how many (small number)
家|jiā|home; family
叫|jiào|to be called
今天|jīn tiān|today
九|jiǔ|nine
开|kāi|to open; to drive
看|kàn|to look; to watch
看见|kàn jiàn|to see
块|kuài|yuan (money, spoken)
来|lái|to come
老师|lǎo shī|teacher
了|le|(completed action)
冷|lěng|cold
里|lǐ|inside
六|liù|six
妈妈|mā ma|mom
吗|ma|(yes/no question particle)
买|mǎi|to buy
猫|māo|cat
没|méi|not (have)
没关系|méi guān xi|it doesn't matter
米饭|mǐ fàn|cooked rice
明天|míng tiān|tomorrow
名字|míng zi|name
哪|nǎ|which
那|nà|that
呢|ne|(and you? particle)
能|néng|can; be able to
你|nǐ|you
年|nián|year
女儿|nǚ ér|daughter
朋友|péng you|friend
漂亮|piào liang|pretty
苹果|píng guǒ|apple
七|qī|seven
前面|qián mian|in front
钱|qián|money
请|qǐng|please; to invite
去|qù|to go
热|rè|hot
人|rén|person
认识|rèn shi|to know (someone)
日|rì|day; sun
三|sān|three
商店|shāng diàn|store
上|shàng|up; on
上午|shàng wǔ|morning
少|shǎo|few; little
谁|shéi|who
什么|shén me|what
十|shí|ten
时候|shí hou|time; moment
是|shì|to be
书|shū|book
水|shuǐ|water
水果|shuǐ guǒ|fruit
睡觉|shuì jiào|to sleep
说话|shuō huà|to speak
四|sì|four
岁|suì|years old
他|tā|he
她|tā|she
太|tài|too; extremely
天气|tiān qì|weather
听|tīng|to listen
同学|tóng xué|classmate
喂|wéi|hello (on the phone)
我|wǒ|I; me
我们|wǒ men|we; us
五|wǔ|five
喜欢|xǐ huan|to like
下|xià|down; under
下午|xià wǔ|afternoon
下雨|xià yǔ|to rain
先生|xiān sheng|Mr.; sir
现在|xiàn zài|now
想|xiǎng|to want; to think
小|xiǎo|small
小姐|xiǎo jiě|Miss; young lady
些|xiē|some
写|xiě|to write
谢谢|xiè xie|thank you
星期|xīng qī|week
学生|xué sheng|student
学习|xué xí|to study
学校|xué xiào|school
一|yī|one
衣服|yī fu|clothes
医生|yī shēng|doctor
医院|yī yuàn|hospital
椅子|yǐ zi|chair
有|yǒu|to have; there is
月|yuè|month; moon
在|zài|at; in
再见|zài jiàn|goodbye
怎么|zěn me|how
怎么样|zěn me yàng|how about; how is it
这|zhè|this
中国|zhōng guó|China
中午|zhōng wǔ|noon
住|zhù|to live (somewhere)
桌子|zhuō zi|table; desk
字|zì|character; word
昨天|zuó tiān|yesterday
坐|zuò|to sit; to take (transport)
做|zuò|to do; to make`),
  2: parse(`
吧|ba|(suggestion particle)
白|bái|white
百|bǎi|hundred
帮助|bāng zhù|to help
报纸|bào zhǐ|newspaper
比|bǐ|compared with
别|bié|don't
宾馆|bīn guǎn|hotel
长|cháng|long
唱歌|chàng gē|to sing
出|chū|to go out
穿|chuān|to wear
次|cì|time (occurrence)
从|cóng|from
错|cuò|wrong
打篮球|dǎ lán qiú|to play basketball
大家|dà jiā|everyone
到|dào|to arrive
得|de|(complement particle)
等|děng|to wait
弟弟|dì di|younger brother
第一|dì yī|first
懂|dǒng|to understand
对|duì|correct; toward
房间|fáng jiān|room
非常|fēi cháng|very; extremely
服务员|fú wù yuán|waiter; attendant
高|gāo|tall; high
告诉|gào su|to tell
哥哥|gē ge|older brother
给|gěi|to give; for
公共汽车|gōng gòng qì chē|bus
公司|gōng sī|company
贵|guì|expensive
过|guo|(past experience)
还|hái|still; also
孩子|hái zi|child
好吃|hǎo chī|tasty
黑|hēi|black
红|hóng|red
欢迎|huān yíng|to welcome
回答|huí dá|to answer
机场|jī chǎng|airport
鸡蛋|jī dàn|egg
件|jiàn|(measure word for clothes, matters)
教室|jiào shì|classroom
姐姐|jiě jie|older sister
介绍|jiè shào|to introduce
进|jìn|to enter
近|jìn|near
就|jiù|then; just
觉得|jué de|to feel; to think
咖啡|kā fēi|coffee
开始|kāi shǐ|to begin
考试|kǎo shì|exam
可能|kě néng|maybe
可以|kě yǐ|can; may
课|kè|class; lesson
快|kuài|fast
快乐|kuài lè|happy
累|lèi|tired
离|lí|away from
两|liǎng|two (of something)
路|lù|road
旅游|lǚ yóu|to travel
卖|mài|to sell
慢|màn|slow
忙|máng|busy
每|měi|every
妹妹|mèi mei|younger sister
门|mén|door
面条|miàn tiáo|noodles
男|nán|male
您|nín|you (polite)
牛奶|niú nǎi|milk
女|nǚ|female
旁边|páng biān|beside
跑步|pǎo bù|to run; jog
便宜|pián yi|cheap
票|piào|ticket
妻子|qī zi|wife
起床|qǐ chuáng|to get up
千|qiān|thousand
晴|qíng|sunny
去年|qù nián|last year
让|ràng|to let; to make
上班|shàng bān|to go to work
身体|shēn tǐ|body; health
生病|shēng bìng|to get sick
生日|shēng rì|birthday
时间|shí jiān|time
事情|shì qing|matter; thing
手表|shǒu biǎo|watch
手机|shǒu jī|cell phone
送|sòng|to give (as a gift); to deliver
所以|suǒ yǐ|so; therefore
它|tā|it
踢足球|tī zú qiú|to play soccer
题|tí|question (on a test)
跳舞|tiào wǔ|to dance
外|wài|outside
完|wán|to finish
玩|wán|to play
晚上|wǎn shang|evening
为什么|wèi shén me|why
问|wèn|to ask
问题|wèn tí|question; problem
西瓜|xī guā|watermelon
希望|xī wàng|to hope
洗|xǐ|to wash
向|xiàng|toward
小时|xiǎo shí|hour
笑|xiào|to laugh; smile
新|xīn|new
姓|xìng|surname
休息|xiū xi|to rest
雪|xuě|snow
颜色|yán sè|colour
眼睛|yǎn jing|eye
羊肉|yáng ròu|lamb (meat)
药|yào|medicine
要|yào|to want; will
也|yě|also
已经|yǐ jīng|already
一起|yì qǐ|together
意思|yì si|meaning
阴|yīn|cloudy
因为|yīn wèi|because
游泳|yóu yǒng|to swim
右边|yòu biān|right side
鱼|yú|fish
远|yuǎn|far
运动|yùn dòng|sport; exercise
再|zài|again
早上|zǎo shang|morning
张|zhāng|(measure word for flat things)
丈夫|zhàng fu|husband
找|zhǎo|to look for
着|zhe|(ongoing state)
真|zhēn|really
正在|zhèng zài|in the middle of (doing)
知道|zhī dào|to know (a fact)
准备|zhǔn bèi|to prepare
自行车|zì xíng chē|bicycle
走|zǒu|to walk; to leave
最|zuì|most
左边|zuǒ biān|left side`),
  3: parse(`
阿姨|ā yí|aunt; auntie
矮|ǎi|short (height)
爱好|ài hào|hobby
安静|ān jìng|quiet
把|bǎ|(object marker); measure word for chairs, umbrellas
班|bān|class (group)
搬|bān|to move (things)
办法|bàn fǎ|way; method
办公室|bàn gōng shì|office
半|bàn|half
帮忙|bāng máng|to help
饱|bǎo|full (after eating)
北方|běi fāng|the north
被|bèi|by (passive marker)
鼻子|bí zi|nose
比较|bǐ jiào|relatively; to compare
比赛|bǐ sài|competition; match
必须|bì xū|must
变化|biàn huà|change
别人|bié rén|other people
冰箱|bīng xiāng|refrigerator
菜单|cài dān|menu
参加|cān jiā|to take part in
草|cǎo|grass
层|céng|floor; layer
超市|chāo shì|supermarket
衬衫|chèn shān|shirt
成绩|chéng jì|grades; results
城市|chéng shì|city
迟到|chí dào|to be late
出现|chū xiàn|to appear
除了|chú le|except; besides
厨房|chú fáng|kitchen
聪明|cōng ming|clever
打扫|dǎ sǎo|to clean
打算|dǎ suàn|to plan
带|dài|to bring; to take
担心|dān xīn|to worry
蛋糕|dàn gāo|cake
当然|dāng rán|of course
灯|dēng|lamp; light
地方|dì fang|place
地铁|dì tiě|subway
地图|dì tú|map
电梯|diàn tī|elevator
动物|dòng wù|animal
短|duǎn|short (length)
锻炼|duàn liàn|to exercise
饿|è|hungry
耳朵|ěr duo|ear
发烧|fā shāo|to have a fever
发现|fā xiàn|to discover
方便|fāng biàn|convenient
放心|fàng xīn|to be at ease
附近|fù jìn|nearby
复习|fù xí|to review
干净|gān jìng|clean
感冒|gǎn mào|to catch a cold
刚才|gāng cái|just now
个子|gè zi|height; build
跟|gēn|with; to follow
更|gèng|even more
公斤|gōng jīn|kilogram
公园|gōng yuán|park
故事|gù shi|story
刮风|guā fēng|to be windy
关|guān|to close; to turn off
关心|guān xīn|to care about
关于|guān yú|about
国家|guó jiā|country
果汁|guǒ zhī|juice
过去|guò qù|the past
还是|hái shi|or (in questions); still
害怕|hài pà|to be afraid
河|hé|river
黑板|hēi bǎn|blackboard
后来|hòu lái|afterwards
护照|hù zhào|passport
花|huā|flower; to spend
画|huà|to draw; painting
坏|huài|bad; broken
环境|huán jìng|environment
换|huàn|to change; exchange
或者|huò zhě|or
机会|jī huì|opportunity
记得|jì de|to remember
季节|jì jié|season
检查|jiǎn chá|to check
简单|jiǎn dān|simple
见面|jiàn miàn|to meet
健康|jiàn kāng|healthy
讲|jiǎng|to tell; to explain
教|jiāo|to teach
脚|jiǎo|foot
街道|jiē dào|street
结束|jié shù|to end
节日|jié rì|festival
解决|jiě jué|to solve
借|jiè|to borrow; to lend
经常|jīng cháng|often
经理|jīng lǐ|manager
旧|jiù|old (things)
句子|jù zi|sentence
决定|jué dìng|to decide
可爱|kě ài|cute
渴|kě|thirsty
客人|kè rén|guest
空调|kōng tiáo|air conditioner
哭|kū|to cry
裤子|kù zi|pants
筷子|kuài zi|chopsticks
蓝|lán|blue
老|lǎo|old
离开|lí kāi|to leave
礼物|lǐ wù|gift
历史|lì shǐ|history
脸|liǎn|face
练习|liàn xí|to practise
辆|liàng|(measure word for vehicles)
邻居|lín jū|neighbour
楼|lóu|building; floor
绿|lǜ|green
马上|mǎ shàng|right away
满意|mǎn yì|satisfied
帽子|mào zi|hat
明白|míng bai|to understand
拿|ná|to take; to hold
奶奶|nǎi nai|grandma (dad's mom)
难|nán|difficult
难过|nán guò|sad
年级|nián jí|grade (in school)
年轻|nián qīng|young
鸟|niǎo|bird
努力|nǔ lì|hard-working; to try hard
爬山|pá shān|to climb mountains
胖|pàng|fat; chubby
瓶子|píng zi|bottle
其实|qí shí|actually
奇怪|qí guài|strange
骑|qí|to ride
清楚|qīng chu|clear
秋|qiū|autumn
裙子|qún zi|skirt
然后|rán hòu|then; after that
热情|rè qíng|warm; enthusiastic
认为|rèn wéi|to think; to believe
认真|rèn zhēn|serious; careful
容易|róng yì|easy
如果|rú guǒ|if
伞|sǎn|umbrella
上网|shàng wǎng|to go online
生气|shēng qì|angry
声音|shēng yīn|sound; voice
世界|shì jiè|world
瘦|shòu|thin
叔叔|shū shu|uncle
舒服|shū fu|comfortable
树|shù|tree
数学|shù xué|math
刷牙|shuā yá|to brush teeth
双|shuāng|pair
水平|shuǐ píng|level; standard
司机|sī jī|driver
太阳|tài yáng|sun
特别|tè bié|especially; special
疼|téng|to hurt
提高|tí gāo|to improve
体育|tǐ yù|physical education; sports
甜|tián|sweet
条|tiáo|(measure word for long, thin things)
同意|tóng yì|to agree
头发|tóu fa|hair
突然|tū rán|suddenly
图书馆|tú shū guǎn|library
腿|tuǐ|leg
完成|wán chéng|to complete
碗|wǎn|bowl
万|wàn|ten thousand
忘记|wàng jì|to forget
文化|wén huà|culture
习惯|xí guàn|habit
洗澡|xǐ zǎo|to take a bath
夏|xià|summer
相信|xiāng xìn|to believe
香蕉|xiāng jiāo|banana
小心|xiǎo xīn|careful
新闻|xīn wén|news
新鲜|xīn xiān|fresh
兴趣|xìng qù|interest
熊猫|xióng māo|panda
需要|xū yào|to need
选择|xuǎn zé|to choose
一定|yí dìng|definitely
一共|yí gòng|altogether
一样|yí yàng|the same
以前|yǐ qián|before
音乐|yīn yuè|music
银行|yín háng|bank
应该|yīng gāi|should
影响|yǐng xiǎng|to influence
用|yòng|to use
游戏|yóu xì|game
有名|yǒu míng|famous
遇到|yù dào|to run into
愿意|yuàn yì|to be willing
月亮|yuè liang|moon
站|zhàn|to stand; station
着急|zháo jí|anxious
照顾|zhào gù|to take care of
照片|zhào piàn|photo
终于|zhōng yú|finally
重要|zhòng yào|important
周末|zhōu mò|weekend
注意|zhù yì|to pay attention
字典|zì diǎn|dictionary
自己|zì jǐ|oneself
总是|zǒng shì|always
最近|zuì jìn|recently
作业|zuò yè|homework`),
  4: parse(`
安排|ān pái|to arrange
安全|ān quán|safe
保护|bǎo hù|to protect
抱歉|bào qiàn|to be sorry
本来|běn lái|originally
笨|bèn|stupid; clumsy
比如|bǐ rú|for example
毕业|bì yè|to graduate
表扬|biǎo yáng|to praise
饼干|bǐng gān|cookie
不得不|bù dé bù|to have to
不管|bù guǎn|no matter
不仅|bù jǐn|not only
部分|bù fen|part
猜|cāi|to guess
参观|cān guān|to visit (a place)
差不多|chà bu duō|almost; about the same
尝|cháng|to taste
长城|cháng chéng|the Great Wall
超过|chāo guò|to exceed
成功|chéng gōng|success
诚实|chéng shí|honest
吃惊|chī jīng|to be surprised
出差|chū chāi|to go on a business trip
出发|chū fā|to set off
出生|chū shēng|to be born
窗户|chuāng hu|window
粗心|cū xīn|careless
答案|dá àn|answer
打扰|dǎ rǎo|to disturb
打折|dǎ zhé|to give a discount
大概|dà gài|probably; roughly
戴|dài|to wear (glasses, hats)
当时|dāng shí|at that time
导游|dǎo yóu|tour guide
到处|dào chù|everywhere
道歉|dào qiàn|to apologize
低|dī|low
地球|dì qiú|the Earth
地址|dì zhǐ|address
调查|diào chá|to investigate; survey
丢|diū|to lose
堵车|dǔ chē|traffic jam
肚子|dù zi|belly
对面|duì miàn|opposite
儿童|ér tóng|children
发生|fā shēng|to happen
发展|fā zhǎn|to develop
翻译|fān yì|to translate
烦恼|fán nǎo|worried; troubles
反对|fǎn duì|to oppose
方法|fāng fǎ|method
放弃|fàng qì|to give up
丰富|fēng fù|rich; abundant
否则|fǒu zé|otherwise
父亲|fù qīn|father
负责|fù zé|to be responsible for
复杂|fù zá|complicated
改变|gǎi biàn|to change
敢|gǎn|to dare
感动|gǎn dòng|to be moved
感觉|gǎn jué|feeling; to feel
感谢|gǎn xiè|to thank
工资|gōng zī|salary
够|gòu|enough
购物|gòu wù|to shop
鼓励|gǔ lì|to encourage
故意|gù yì|on purpose
顾客|gù kè|customer
挂|guà|to hang
关键|guān jiàn|key; crucial
观众|guān zhòng|audience
管理|guǎn lǐ|to manage
广告|guǎng gào|advertisement
逛|guàng|to stroll
规定|guī dìng|rule
国际|guó jì|international
过程|guò chéng|process
海洋|hǎi yáng|ocean
害羞|hài xiū|shy
寒假|hán jià|winter vacation
航班|háng bān|flight
好处|hǎo chu|benefit
好像|hǎo xiàng|to seem
号码|hào mǎ|number
合适|hé shì|suitable
后悔|hòu huǐ|to regret
互相|hù xiāng|each other
护士|hù shi|nurse
怀疑|huái yí|to doubt
回忆|huí yì|memory; to recall
活动|huó dòng|activity
获得|huò dé|to obtain
积极|jī jí|positive; active
基础|jī chǔ|foundation; basis
激动|jī dòng|excited; moved
及时|jí shí|in time
即使|jí shǐ|even if
计划|jì huà|plan
记者|jì zhě|reporter
技术|jì shù|technology
继续|jì xù|to continue
寄|jì|to mail
价格|jià gé|price
坚持|jiān chí|to persist
减肥|jiǎn féi|to lose weight
建议|jiàn yì|suggestion; to suggest
将来|jiāng lái|future
交流|jiāo liú|to communicate; exchange
交通|jiāo tōng|traffic
骄傲|jiāo ào|proud
教育|jiào yù|education
接受|jiē shòu|to accept
节约|jié yuē|to save (resources)
结果|jié guǒ|result
解释|jiě shì|to explain
紧张|jǐn zhāng|nervous
经验|jīng yàn|experience
精彩|jīng cǎi|wonderful
警察|jǐng chá|police officer
竞争|jìng zhēng|competition
镜子|jìng zi|mirror
举办|jǔ bàn|to hold (an event)
拒绝|jù jué|to refuse
距离|jù lí|distance
看法|kàn fǎ|opinion
考虑|kǎo lǜ|to consider
科学|kē xué|science
咳嗽|ké sou|to cough
可怜|kě lián|pitiful
可惜|kě xī|it's a pity
肯定|kěn dìng|certainly
空气|kōng qì|air
恐怕|kǒng pà|I'm afraid that
苦|kǔ|bitter
困|kùn|sleepy
困难|kùn nan|difficulty
辣|là|spicy
浪费|làng fèi|to waste
冷静|lěng jìng|calm
理解|lǐ jiě|to understand
理想|lǐ xiǎng|ideal; dream
礼貌|lǐ mào|polite
厉害|lì hai|amazing; fierce
联系|lián xì|to contact
凉快|liáng kuai|cool (weather)
流利|liú lì|fluent
流行|liú xíng|popular
留学|liú xué|to study abroad
旅行|lǚ xíng|to travel
律师|lǜ shī|lawyer
乱|luàn|messy
麻烦|má fan|trouble; troublesome
美丽|měi lì|beautiful
梦|mèng|dream
迷路|mí lù|to get lost
免费|miǎn fèi|free (of charge)
母亲|mǔ qīn|mother
耐心|nài xīn|patient
内容|nèi róng|content
能力|néng lì|ability
年龄|nián líng|age
农村|nóng cūn|countryside
暖和|nuǎn huo|warm
排队|pái duì|to line up
陪|péi|to accompany
批评|pī píng|to criticize
脾气|pí qi|temper
骗|piàn|to cheat; to lie to
乒乓球|pīng pāng qiú|table tennis
葡萄|pú tao|grape
普通话|pǔ tōng huà|Mandarin (standard Chinese)
气候|qì hòu|climate
签证|qiān zhèng|visa
桥|qiáo|bridge
巧克力|qiǎo kè lì|chocolate
亲戚|qīn qi|relative
轻松|qīng sōng|relaxed
情况|qíng kuàng|situation
穷|qióng|poor
区别|qū bié|difference
缺点|quē diǎn|shortcoming
热闹|rè nao|lively
任务|rèn wu|task
扔|rēng|to throw
日记|rì jì|diary
散步|sàn bù|to take a walk
森林|sēn lín|forest
商量|shāng liang|to talk over
伤心|shāng xīn|heartbroken
社会|shè huì|society
申请|shēn qǐng|to apply
深|shēn|deep
甚至|shèn zhì|even
生活|shēng huó|life
失败|shī bài|failure
失望|shī wàng|disappointed
适合|shì hé|to suit
收入|shōu rù|income
收拾|shōu shi|to tidy up
首都|shǒu dū|capital city
输|shū|to lose (a game)
熟悉|shú xī|familiar
帅|shuài|handsome
顺利|shùn lì|smoothly
速度|sù dù|speed
酸|suān|sour
随便|suí biàn|casual; as you like
态度|tài du|attitude
讨论|tǎo lùn|to discuss
讨厌|tǎo yàn|to dislike
特点|tè diǎn|characteristic
提醒|tí xǐng|to remind
条件|tiáo jiàn|condition
通知|tōng zhī|to notify
同情|tóng qíng|sympathy
完全|wán quán|completely
危险|wēi xiǎn|dangerous
味道|wèi dào|taste
温度|wēn dù|temperature
文章|wén zhāng|article
污染|wū rǎn|pollution
无聊|wú liáo|bored; boring
误会|wù huì|misunderstanding
吸引|xī yǐn|to attract
咸|xián|salty
羡慕|xiàn mù|to envy
相同|xiāng tóng|the same
香|xiāng|fragrant
详细|xiáng xì|detailed
消息|xiāo xi|news; message
小说|xiǎo shuō|novel
笑话|xiào hua|joke
效果|xiào guǒ|effect
心情|xīn qíng|mood
辛苦|xīn kǔ|hard; toilsome
信心|xìn xīn|confidence
兴奋|xīng fèn|excited
幸福|xìng fú|happiness
性格|xìng gé|personality
修理|xiū lǐ|to repair
压力|yā lì|pressure; stress
严格|yán gé|strict
研究|yán jiū|research
演员|yǎn yuán|actor
阳光|yáng guāng|sunshine
邀请|yāo qǐng|to invite
钥匙|yào shi|key
也许|yě xǔ|perhaps
艺术|yì shù|art
印象|yìn xiàng|impression
赢|yíng|to win
勇敢|yǒng gǎn|brave
优秀|yōu xiù|excellent
幽默|yōu mò|humorous
尤其|yóu qí|especially
邮局|yóu jú|post office
友谊|yǒu yì|friendship
有趣|yǒu qù|interesting
愉快|yú kuài|pleasant
语言|yǔ yán|language
原因|yuán yīn|reason
约会|yuē huì|date; appointment
阅读|yuè dú|to read
杂志|zá zhì|magazine
脏|zāng|dirty
责任|zé rèn|responsibility
增加|zēng jiā|to increase
整理|zhěng lǐ|to organize
正确|zhèng què|correct
支持|zhī chí|to support
知识|zhī shi|knowledge
值得|zhí de|to be worth
职业|zhí yè|profession
植物|zhí wù|plant
只好|zhǐ hǎo|to have no choice but
质量|zhì liàng|quality
重|zhòng|heavy
周围|zhōu wéi|surroundings
主意|zhǔ yi|idea
祝贺|zhù hè|to congratulate
著名|zhù míng|famous
专业|zhuān yè|major; specialty
赚|zhuàn|to earn
仔细|zǐ xì|careful
自信|zì xìn|confident
尊重|zūn zhòng|to respect
座位|zuò wèi|seat`),
  5: parse(`
爱护|ài hù|to take good care of
安慰|ān wèi|to comfort
安装|ān zhuāng|to install
把握|bǎ wò|to grasp; certainty
摆|bǎi|to put; to arrange
办理|bàn lǐ|to handle (paperwork)
傍晚|bàng wǎn|dusk
包裹|bāo guǒ|package
宝贵|bǎo guì|precious
保持|bǎo chí|to maintain
保存|bǎo cún|to save; preserve
报告|bào gào|report
悲观|bēi guān|pessimistic
背景|bèi jǐng|background
本领|běn lǐng|skill; ability
比例|bǐ lì|proportion
必要|bì yào|necessary
毕竟|bì jìng|after all
避免|bì miǎn|to avoid
表达|biǎo dá|to express
表现|biǎo xiàn|performance; to show
病毒|bìng dú|virus
玻璃|bō li|glass
博物馆|bó wù guǎn|museum
脖子|bó zi|neck
不断|bú duàn|continuously
补充|bǔ chōng|to add; supplement
不好意思|bù hǎo yì si|embarrassed; excuse me
不如|bù rú|not as good as
步骤|bù zhòu|step (of a procedure)
采访|cǎi fǎng|to interview
彩虹|cǎi hóng|rainbow
参考|cān kǎo|to consult; reference
操场|cāo chǎng|playground
曾经|céng jīng|once (in the past)
产品|chǎn pǐn|product
产生|chǎn shēng|to produce; to arise
常识|cháng shí|common sense
朝代|cháo dài|dynasty
吵架|chǎo jià|to quarrel
彻底|chè dǐ|thorough
沉默|chén mò|silent
称赞|chēng zàn|to praise
成就|chéng jiù|achievement
成语|chéng yǔ|idiom
成长|chéng zhǎng|to grow up
承认|chéng rèn|to admit
程度|chéng dù|degree; level
持续|chí xù|to continue
翅膀|chì bǎng|wing
充满|chōng mǎn|to be full of
重复|chóng fù|to repeat
宠物|chǒng wù|pet
抽屉|chōu ti|drawer
出版|chū bǎn|to publish
出色|chū sè|outstanding
处理|chǔ lǐ|to deal with
传统|chuán tǒng|tradition
创造|chuàng zào|to create
词汇|cí huì|vocabulary
从此|cóng cǐ|from then on
促进|cù jìn|to promote
存在|cún zài|to exist
错误|cuò wù|mistake
措施|cuò shī|measure (action)
答应|dā ying|to agree; to promise
达到|dá dào|to reach
打工|dǎ gōng|to work a part-time job
代表|dài biǎo|to represent
代替|dài tì|to replace
单纯|dān chún|simple; pure
单调|dān diào|monotonous
当地|dāng dì|local
导演|dǎo yǎn|director (film)
导致|dǎo zhì|to lead to
倒霉|dǎo méi|unlucky
道德|dào dé|morality
道理|dào lǐ|reason; principle
等待|děng dài|to wait
的确|dí què|indeed
地道|dì dao|authentic
地理|dì lǐ|geography
地震|dì zhèn|earthquake
点心|diǎn xin|snack; dim sum
电池|diàn chí|battery
动画片|dòng huà piàn|cartoon
豆腐|dòu fu|tofu
独立|dú lì|independent
独特|dú tè|unique
对比|duì bǐ|to contrast
对手|duì shǒu|opponent
多亏|duō kuī|thanks to
发表|fā biǎo|to publish; to express
发明|fā míng|to invent
反而|fǎn ér|on the contrary
反复|fǎn fù|repeatedly
反应|fǎn yìng|reaction
范围|fàn wéi|range; scope
方式|fāng shì|way; manner
分析|fēn xī|to analyze
风景|fēng jǐng|scenery
风俗|fēng sú|custom
风险|fēng xiǎn|risk
否认|fǒu rèn|to deny
服装|fú zhuāng|clothing
辅导|fǔ dǎo|to tutor
复制|fù zhì|to copy`),
  6: parse(`
爱不释手|ài bú shì shǒu|to love something so much you can't put it down
爱戴|ài dài|to love and respect
安宁|ān níng|peaceful
暗示|àn shì|to hint
昂贵|áng guì|expensive
奥秘|ào mì|mystery
拔苗助长|bá miáo zhù zhǎng|to spoil things by being too eager
摆脱|bǎi tuō|to break free from
拜访|bài fǎng|to pay a visit
拜年|bài nián|to give New Year's greetings
半途而废|bàn tú ér fèi|to give up halfway
扮演|bàn yǎn|to play the role of
榜样|bǎng yàng|role model
包装|bāo zhuāng|packaging
保密|bǎo mì|to keep secret
保障|bǎo zhàng|to guarantee
报答|bào dá|to repay (a kindness)
抱负|bào fù|ambition
暴露|bào lù|to expose
爆发|bào fā|to break out
悲惨|bēi cǎn|tragic
背诵|bèi sòng|to recite
被动|bèi dòng|passive
奔波|bēn bō|to rush about
本能|běn néng|instinct
本身|běn shēn|itself
崩溃|bēng kuì|to collapse
比喻|bǐ yù|metaphor
鄙视|bǐ shì|to despise
弊端|bì duān|drawback
边缘|biān yuán|edge
贬义|biǎn yì|negative meaning
便利|biàn lì|convenient
辨认|biàn rèn|to identify
标题|biāo tí|title; headline
表彰|biǎo zhāng|to commend
别墅|bié shù|villa
别扭|biè niu|awkward
濒临|bīn lín|to be on the verge of
冰雹|bīng báo|hail
并非|bìng fēi|not at all
波涛汹涌|bō tāo xiōng yǒng|turbulent waves
博大精深|bó dà jīng shēn|broad and profound
博览会|bó lǎn huì|exposition
薄弱|bó ruò|weak
补偿|bǔ cháng|to compensate
捕捉|bǔ zhuō|to catch
不惜|bù xī|not to spare
不可思议|bù kě sī yì|unbelievable
不言而喻|bù yán ér yù|it goes without saying
布局|bù jú|layout
步伐|bù fá|pace
部署|bù shǔ|to deploy
才干|cái gàn|ability; talent
财富|cái fù|wealth
裁判|cái pàn|referee
采纳|cǎi nà|to adopt (a suggestion)
彩票|cǎi piào|lottery ticket
残疾|cán jí|disability
残酷|cán kù|cruel
灿烂|càn làn|brilliant; splendid
仓促|cāng cù|hasty
仓库|cāng kù|warehouse
操作|cāo zuò|to operate
嘈杂|cáo zá|noisy
草率|cǎo shuài|careless; rash
测量|cè liáng|to measure
策划|cè huà|to plan; to plot
策略|cè lüè|strategy
层出不穷|céng chū bù qióng|to keep appearing
差别|chā bié|difference
诧异|chà yì|surprised
馋|chán|greedy (for food)
阐述|chǎn shù|to expound
颤抖|chàn dǒu|to tremble
尝试|cháng shì|to try
偿还|cháng huán|to repay
场合|chǎng hé|occasion
场所|chǎng suǒ|place; venue
畅销|chàng xiāo|best-selling
倡导|chàng dǎo|to advocate
超越|chāo yuè|to surpass
嘲笑|cháo xiào|to ridicule
潮流|cháo liú|trend
沉思|chén sī|to ponder
沉重|chén zhòng|heavy
陈述|chén shù|to state
称心如意|chèn xīn rú yì|perfectly satisfied
称号|chēng hào|title (honour)
成本|chéng běn|cost
呈现|chéng xiàn|to present; to appear
承诺|chéng nuò|promise
城堡|chéng bǎo|castle
惩罚|chéng fá|punishment
澄清|chéng qīng|to clarify
吃苦|chī kǔ|to bear hardships
迟疑|chí yí|to hesitate
赤道|chì dào|the equator
冲动|chōng dòng|impulse
冲突|chōng tū|conflict
充实|chōng shí|substantial; rich
崇拜|chóng bài|to worship; to admire
崇高|chóng gāo|lofty`)
};
