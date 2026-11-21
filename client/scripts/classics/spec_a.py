# Passages for Grades 1–6: fables, famous children's books, early poems, middle-grade novels.
# Each: (key, file, start, end, title, author, year, questions[, poem, nth])
# question = (question, answer, [wrong, wrong, wrong], explanation)
A = []
def P(key, f, start, end, t, by, year, q, poem=False, nth=1, intro=None, endnth=1):
    # intro: an optional bracketed context note shown before the excerpt (our words, not the author's)
    A.append(dict(key=key, f=f, start=start, end=end, t=t, by=by, year=year, q=q, poem=poem, nth=nth, intro=intro, endnth=endnth))

# ---------------- Aesop (Townsend translation, 1867) — Grades 2–4 ----------------
P('ants', 'aesop', 'THE ANTS were spending a fine winter’s day', 'dance supperless to bed in the winter.”', 'The Ants and the Grasshopper', 'Aesop (translated by George Fyler Townsend)', 1867, [
  ('What were the Ants doing on a fine winter’s day?', 'Drying grain they had collected in the summer', ['Singing and dancing', 'Looking for the Grasshopper', 'Building a new home'], 'They were “drying grain collected in the summertime.”'),
  ('Why did the Grasshopper have no food?', 'He spent the summer singing instead of storing food', ['The Ants stole his food', 'A storm washed his food away', 'He gave his food to the Ants'], 'He says, “I passed the days in singing.”'),
  ('“A Grasshopper, perishing with famine” means the Grasshopper was …', 'dying of hunger', ['very cold', 'very tired', 'lost in the snow'], 'Famine means a terrible lack of food, so he was starving.'),
  ('What lesson does this fable teach?', 'Work and prepare today for what you will need later', ['Singing is a waste of time', 'Always share everything you have', 'Winter is the best season'], 'The Ants stored food in summer and had plenty; the Grasshopper did not, and went hungry.'),
])
P('hare', 'aesop', 'A HARE one day ridiculed the short feet', 'Slow but steady wins the race.', 'The Hare and the Tortoise', 'Aesop (translated by George Fyler Townsend)', 1867, [
  ('Who chose the course for the race?', 'The Fox', ['The Hare', 'The Tortoise', 'The Owl'], 'They agreed “that the Fox should choose the course and fix the goal.”'),
  ('Why did the Hare lose the race?', 'He lay down by the wayside and fell asleep', ['He hurt his foot', 'He took the wrong path', 'The Fox tricked him'], '“The Hare, lying down by the wayside, fell fast asleep.”'),
  ('In the first sentence, “ridiculed” means …', 'made fun of', ['praised', 'measured', 'raced against'], 'The Hare laughed at the Tortoise’s “short feet and slow pace.”'),
  ('How did the Tortoise win?', 'She never stopped and kept a slow, steady pace', ['She ran faster than the Hare', 'She took a shortcut', 'She woke up early'], '“The Tortoise never for a moment stopped, but went on with a slow but steady pace.”'),
])
P('dogshadow', 'aesop', 'A DOG, crossing a bridge over a stream', 'because the stream swept it away.', 'The Dog and the Shadow', 'Aesop (translated by George Fyler Townsend)', 1867, [
  ('What did the Dog see in the water?', 'His own reflection, which he thought was another dog', ['A fish with a piece of meat', 'His friend swimming', 'A bone at the bottom'], 'He “saw his own shadow in the water and took it for that of another Dog.”'),
  ('Why did the Dog let go of his meat?', 'He wanted the bigger piece he thought the other dog had', ['The meat was too heavy', 'He wanted to swim', 'He was not hungry'], 'The other dog seemed to have “a piece of meat double his own in size.”'),
  ('What happened at the end?', 'He lost both pieces of meat', ['He got the bigger piece', 'He shared the meat', 'He found more meat downstream'], '“He thus lost both.”'),
  ('What lesson does this fable teach?', 'Being greedy can make you lose what you already have', ['Always look before you cross a bridge', 'Dogs should not eat meat', 'Water is dangerous'], 'Wanting more, the Dog lost the meat he already had.'),
])
P('wolfsheep', 'aesop', 'ONCE UPON A TIME a Wolf resolved to disguise', 'Harm seek, harm find.', 'The Wolf in Sheep’s Clothing', 'Aesop (translated by George Fyler Townsend)', 1867, [
  ('Why did the Wolf dress in a sheep’s skin?', 'To get food more easily', ['To keep warm', 'To make friends with the sheep', 'To hide from hunters'], 'He wanted “to secure food more easily.”'),
  ('In the first sentence, “disguise his appearance” means …', 'change how he looked so no one would know him', ['wash himself', 'grow bigger', 'run faster'], 'He put on a sheep’s skin so he would look like a sheep.'),
  ('What happened to the Wolf?', 'The shepherd took him for a sheep and killed him', ['He ate all the sheep', 'He escaped into the forest', 'The sheep chased him away'], 'The shepherd “mistakenly caught up the Wolf instead of a sheep.”'),
  ('What does “Harm seek, harm find” mean?', 'If you try to hurt others, harm may come back to you', ['Always look for harm', 'Harm is easy to find', 'Sheep are harmless'], 'The Wolf planned to hurt the sheep, and his own trick got him killed.'),
])
P('cryingwolf', 'aesop', 'A SHEPHERD-BOY, who watched a flock of sheep', 'even when he speaks the truth.', 'The Shepherd’s Boy and the Wolf', 'Aesop (translated by George Fyler Townsend)', 1867, [
  ('What trick did the boy play on the villagers?', 'He cried “Wolf!” when there was no wolf', ['He hid the sheep', 'He pretended to be lost', 'He let the sheep run away'], 'He called them out by crying “Wolf! Wolf!” and then laughed at them.'),
  ('Why did nobody come when the Wolf really came?', 'They no longer believed the boy', ['They could not hear him', 'They were afraid of the Wolf', 'They were asleep'], 'He had fooled them before, so “no one paid any heed to his cries.”'),
  ('How did the boy feel when the Wolf really came?', 'Terrified', ['Proud', 'Bored', 'Amused'], 'He shouted “in an agony of terror.”'),
  ('What is the moral of the fable?', 'People will not believe a liar, even when he tells the truth', ['Wolves are always dangerous', 'Sheep need two shepherds', 'Villagers should not help others'], '“There is no believing a liar, even when he speaks the truth.”'),
])
P('crow', 'aesop', 'A CROW perishing with thirst saw a pitcher', 'Necessity is the mother of invention.', 'The Crow and the Pitcher', 'Aesop (translated by George Fyler Townsend)', 1867, [
  ('What was the Crow’s problem?', 'The water was too low in the pitcher to reach', ['The pitcher was broken', 'The water was dirty', 'Another bird took the pitcher'], 'It “contained so little water that he could not possibly get at it.”'),
  ('How did the Crow solve the problem?', 'He dropped stones in until the water rose', ['He tipped the pitcher over', 'He found a river', 'He waited for rain'], 'He “dropped them one by one with his beak into the pitcher.”'),
  ('“Necessity is the mother of invention” means …', 'when you really need something, you find clever ways to get it', ['mothers invent many things', 'crows are the smartest birds', 'you should never give up water'], 'The Crow needed water badly, so he invented a way to reach it.'),
  ('Which word best describes the Crow?', 'Clever', ['Lazy', 'Greedy', 'Unkind'], 'He thought of a smart way to bring the water up to his beak.'),
])
P('foxgrapes', 'aesop', 'A FAMISHED FOX saw some clusters of ripe black grapes', 'and not ripe as I thought.”', 'The Fox and the Grapes', 'Aesop (translated by George Fyler Townsend)', 1867, [
  ('Why couldn’t the Fox eat the grapes?', 'She could not reach them', ['They were sour', 'Another fox guarded them', 'She did not like grapes'], '“She could not reach them.”'),
  ('What did the Fox say as she walked away?', 'The grapes were sour and not ripe', ['The grapes were too sweet', 'She would come back tomorrow', 'She was not hungry'], 'She said, “The Grapes are sour, and not ripe as I thought.”'),
  ('Why did the Fox say the grapes were sour?', 'To hide her disappointment', ['Because she tasted them', 'To warn other animals', 'Because the farmer told her'], 'She turned away, “hiding her disappointment.”'),
  ('Today, people say “sour grapes” when someone …', 'pretends not to want something they could not get', ['eats fruit that is not ripe', 'is very hungry', 'shares food with friends'], 'Like the Fox, they act as if the thing was not worth having.'),
])
P('northwind', 'aesop', 'THE NORTH WIND and the Sun disputed', 'Persuasion is better than Force.', 'The North Wind and the Sun', 'Aesop (translated by George Fyler Townsend)', 1867, [
  ('What was the contest between the North Wind and the Sun?', 'Who could make a traveler take off his clothes', ['Who could blow the hardest', 'Who could make it rain', 'Who could stay up longest'], 'The winner would be the one who “could first strip a wayfaring man of his clothes.”'),
  ('What did the Traveler do when the Wind blew?', 'He wrapped his cloak more tightly around him', ['He took off his cloak', 'He ran home', 'He jumped in a stream'], '“The closer the Traveler wrapped his cloak around him.”'),
  ('Who won the contest?', 'The Sun', ['The North Wind', 'The Traveler', 'Nobody'], 'The warm Sun made the Traveler take off “one garment after another.”'),
  ('What does “Persuasion is better than Force” mean?', 'Gentle ways often work better than pushing hard', ['The strongest always wins', 'Wind is stronger than sun', 'Never wear a cloak'], 'The Wind’s force failed; the Sun’s gentle warmth worked.'),
])

# ---------------- Famous children's books — Grades 1–4 ----------------
P('peter', 'peterrabbit', 'Once upon a time there were four little Rabbits', 'squeezed under the gate!', 'The Tale of Peter Rabbit', 'Beatrix Potter', 1902, [
  ('What are the names of the four little Rabbits?', 'Flopsy, Mopsy, Cotton-tail, and Peter', ['Peter, Benjamin, Tom, and Jemima', 'Flopsy, Mopsy, Bunny, and Peter', 'Cotton-tail, Benjamin, Tom, and Peter'], 'The story names them: “Flopsy, Mopsy, Cotton-tail, and Peter.”'),
  ('Where did the Rabbits live?', 'In a sand-bank under a very big fir-tree', ['In Mr. McGregor’s garden', 'In a house in town', 'In a nest in a tree'], '“They lived with their Mother in a sand-bank, underneath the root of a very big fir-tree.”'),
  ('Why did Mrs. Rabbit say not to go into Mr. McGregor’s garden?', 'Their father had an accident there', ['The garden was too far away', 'There were no carrots there', 'It was going to rain'], 'She says, “your Father had an accident there.”'),
  ('What did Mrs. Rabbit buy at the baker’s?', 'A loaf of brown bread and five currant buns', ['Carrots and lettuce', 'A big chocolate cake', 'A basket of blackberries'], '“She bought a loaf of brown bread and five currant buns.”'),
  ('Which word best describes Peter?', 'Naughty', ['Careful', 'Sleepy', 'Shy'], '“But Peter, who was very naughty, ran straight away to Mr. McGregor’s garden.”'),
])
P('velveteen', 'velveteen', '"What is REAL?" asked the Rabbit', 'who don\'t understand."', 'The Velveteen Rabbit', 'Margery Williams', 1922, [
  ('Who explains to the Rabbit what Real means?', 'The Skin Horse', ['Nana', 'The Boy', 'A toy soldier'], 'The answers are given by the Skin Horse.'),
  ('According to the Skin Horse, how does a toy become Real?', 'A child loves it for a long, long time', ['It is wound up with a key', 'It is made with buzzing parts', 'It is kept very carefully'], '“When a child loves you for a long, long time, not just to play with, but REALLY loves you, then you become Real.”'),
  ('Does becoming Real happen all at once?', 'No, it takes a long time', ['Yes, in one night', 'Yes, when you are wound up', 'Nobody knows'], '“It doesn’t happen all at once,” said the Skin Horse. “You become. It takes a long time.”'),
  ('The Skin Horse “was always truthful.” Truthful means he …', 'always told the truth', ['was always funny', 'was always tired', 'always told stories'], 'Truthful means honest — telling the truth.'),
  ('How do toys look by the time they are Real?', 'Shabby, because they have been loved so much', ['Shiny and new', 'Bigger than before', 'Painted in bright colours'], '“Most of your hair has been loved off, and your eyes drop out and you get loose in the joints and very shabby.”'),
])
P('alice1', 'alice', 'Alice was beginning to get very tired', 'pop down a large rabbit-hole under the hedge.', 'Alice’s Adventures in Wonderland', 'Lewis Carroll', 1865, [
  ('Why did Alice think her sister’s book was not worth reading?', 'It had no pictures or conversations', ['It was too long', 'It was about rabbits', 'It was in another language'], '“It had no pictures or conversations in it.”'),
  ('Why did Alice feel sleepy?', 'It was a hot day', ['She had been running', 'She was reading', 'It was late at night'], '“The hot day made her feel very sleepy and stupid.”'),
  ('What made Alice jump to her feet?', 'The Rabbit took a watch out of its waistcoat-pocket', ['The Rabbit spoke to her', 'Her sister called her', 'She dropped her daisy-chain'], 'She had never seen a rabbit with “a waistcoat-pocket, or a watch to take out of it.”'),
  ('Which word best describes Alice at the end of the passage?', 'Curious', ['Frightened', 'Bored', 'Angry'], 'She was “burning with curiosity” and ran after the Rabbit.'),
  ('What did the Rabbit say to itself?', '“Oh dear! Oh dear! I shall be late!”', ['“Follow me down the hole!”', '“What a hot day it is!”', '“Where is my watch?”'], 'Alice heard the Rabbit say, “Oh dear! Oh dear! I shall be late!”'),
])
P('alice2', 'alice', '“Would you tell me, please, which way I ought to go from here?”', 'if you only walk long enough.”', 'Alice’s Adventures in Wonderland', 'Lewis Carroll', 1865, [
  ('What does Alice want to know?', 'Which way she ought to go', ['Where the Cat lives', 'What time it is', 'How to get home to her sister'], 'She asks, “which way I ought to go from here?”'),
  ('What does the Cat say the answer depends on?', 'Where Alice wants to get to', ['How fast Alice walks', 'What time of day it is', 'Who Alice is with'], '“That depends a good deal on where you want to get to,” said the Cat.'),
  ('Why does the Cat say it doesn’t matter which way Alice goes?', 'Alice says she doesn’t much care where she ends up', ['All the paths are blocked', 'The Cat will carry her', 'Every path leads home'], 'Alice says, “I don’t much care where—” so any way will do.'),
  ('What is funny about the Cat’s last answer?', 'It is true but not helpful at all', ['The Cat is being very kind', 'The Cat gives exact directions', 'The Cat is lying'], 'If you walk long enough you will get “somewhere” — but that tells Alice nothing.'),
  ('What lesson could a reader take from this conversation?', 'You need to know your goal before you can choose a path', ['Never talk to cats', 'Always walk as far as you can', 'Every road leads to the same place'], 'The way to go depends on where you want to get to.'),
])
P('oz', 'oz', 'Dorothy lived in the midst of the great Kansas prairies', 'as dull and gray as everything else.', 'The Wonderful Wizard of Oz', 'L. Frank Baum', 1900, [
  ('Who did Dorothy live with?', 'Uncle Henry and Aunt Em', ['Her mother and father', 'The Wizard', 'Her grandmother'], 'She lived “with Uncle Henry, who was a farmer, and Aunt Em.”'),
  ('How many rooms did the house have?', 'One', ['Two', 'Four', 'Six'], 'Four walls, a floor and a roof “made one room.”'),
  ('What was the cyclone cellar for?', 'A safe place to hide if a great whirlwind came', ['Storing food for winter', 'Keeping the animals', 'Dorothy’s bedroom'], 'The family “could go in case one of those great whirlwinds arose.”'),
  ('Which colour does the author repeat again and again?', 'Gray', ['Green', 'Red', 'Yellow'], 'The prairie, the land, the grass and the house are all gray.'),
  ('What feeling does the description of Kansas create?', 'Dull and lonely', ['Exciting and busy', 'Bright and cheerful', 'Scary and dark'], 'There is “nothing but the great gray prairie on every side.”'),
])
P('willows', 'willows', 'The Mole had been working very hard', '“This is better than whitewashing!”', 'The Wind in the Willows', 'Kenneth Grahame', 1908, [
  ('What was the Mole doing at the start of the story?', 'Spring-cleaning his little home', ['Digging a new tunnel', 'Swimming in the river', 'Sleeping in the meadow'], 'He “had been working very hard all the morning, spring-cleaning his little home.”'),
  ('Why did the Mole throw down his brush?', 'Spring was calling him outside', ['The brush broke', 'He heard a friend at the door', 'He finished cleaning'], '“Something up above was calling him imperiously.”'),
  ('Why does the author write “scraped and scratched and scrabbled and scrooged”?', 'To show how busily and hard the Mole dug his way up', ['To list the Mole’s friends', 'To show the Mole was hurt', 'To describe the weather'], 'The pile of digging words makes you feel the Mole’s busy paws working.'),
  ('Where did the Mole come out?', 'In the warm grass of a great meadow', ['On the bank of a river', 'In a dark forest', 'Inside a rabbit hole'], 'He found himself “rolling in the warm grass of a great meadow.”'),
  ('How does the Mole feel when he gets outside?', 'Happy and free', ['Tired and cross', 'Lost and scared', 'Sorry he left'], 'He says, “This is fine!” and “This is better than whitewashing!”'),
])
P('beauty', 'blackbeauty', '“I wish you to pay attention to what I am going to say to you.', 'as he did to his little children.', 'Black Beauty', 'Anna Sewell', 1877, [
  ('Who is telling this story?', 'A young horse', ['A farmer', 'The horse’s master', 'A little child'], 'The narrator remembers “my mother’s advice” — the mother is “a wise old horse.”'),
  ('What does the mother tell her colt never to do?', 'Bite or kick, even in play', ['Run in the field', 'Eat too much', 'Trot quickly'], 'She says, “never bite or kick even in play.”'),
  ('Why does she want him to behave better than the other colts?', 'He comes from a well-bred family', ['The other colts are older', 'The master will sell him', 'He is the smallest colt'], 'She tells him, “You have been well-bred and well-born.”'),
  ('What was the mother’s name?', 'Duchess', ['Beauty', 'Pet', 'Ginger'], '“Her name was Duchess, but he often called her Pet.”'),
  ('How did the master treat the horses?', 'Kindly, like his own children', ['Harshly', 'He ignored them', 'He made them race'], '“He spoke as kindly to us as he did to his little children.”'),
])

# ---------------- Early poems — Grades 1–4 ----------------
P('shadow', 'childsgarden', 'I have a little shadow that goes in and out with me', 'fast asleep in bed.', 'My Shadow', 'Robert Louis Stevenson', 1885, [
  ('What does the shadow do when the child jumps into bed?', 'It jumps before him', ['It stays on the floor', 'It goes out the door', 'It hides under the bed'], '“I see him jump before me, when I jump into my bed.”'),
  ('What is funny about the way the shadow grows?', 'It can shoot up tall or shrink to nothing', ['It grows very slowly', 'It never changes', 'It grows only at night'], '“He sometimes shoots up taller like an india-rubber ball.”'),
  ('Why does the child call the shadow a coward?', 'It always stays close behind him', ['It runs away from dogs', 'It is afraid of the dark', 'It cries a lot'], '“He stays so close behind me, he’s a coward you can see.”'),
  ('Why was there no shadow on the early morning in the last verse?', 'The sun was not up yet, so there was no shadow', ['The shadow ran away', 'The child was hiding', 'It was raining'], 'It was “before the sun was up” — shadows need light, so the poet jokes it was still asleep.'),
  ('The poet says the shadow grows “like an india-rubber ball.” Comparing two things using “like” is called a …', 'simile', ['rhyme', 'title', 'question'], 'A simile compares two things using “like” or “as.”'),
], poem=True)

# ---------------- Middle-grade novels — Grades 5–6 ----------------
P('anne', 'anne', '“Will you please call me Cordelia?” she said eagerly.', 'please call me Anne spelled with an E.”', 'Anne of Green Gables', 'L. M. Montgomery', 1908, [
  ('What does Anne ask Marilla to call her?', 'Cordelia', ['Geraldine', 'Annie', 'Ann'], '“Will you please call me Cordelia?” she said eagerly.'),
  ('Why does Anne prefer the name Cordelia?', 'She thinks it is elegant and romantic, and Anne is plain', ['It is her middle name', 'Her mother was called Cordelia', 'It is easier to spell'], 'She calls Cordelia “such a perfectly elegant name” and Anne “such an unromantic name.”'),
  ('What does Marilla think of the name Anne?', 'It is a good, plain, sensible name', ['It is too fancy', 'It is too long', 'It is a boy’s name'], 'Marilla says, “Anne is a real good plain sensible name.”'),
  ('If she must be called Anne, what does Anne insist on?', 'That it be spelled with an E', ['That it be shortened to Ann', 'That only Marilla use it', 'That it be said quietly'], '“If you call me Anne please call me Anne spelled with an E.”'),
  ('What does this passage show about Anne’s character?', 'She is imaginative and dramatic', ['She is shy and quiet', 'She is rude and mean', 'She is careless and lazy'], 'She has “always imagined” her name was Cordelia — and before that, Geraldine.'),
  ('The author calls Marilla “unsympathetic” here. This means Marilla …', 'does not share Anne’s feelings about the name', ['is very kind to Anne', 'is angry with Anne', 'cannot hear Anne'], 'Marilla answers “Unromantic fiddlesticks!” — she does not understand Anne’s wish.'),
])
P('tom', 'tomsawyer', '“What do you call work?”', 'I’d let _you_, if you was me, Tom.”', 'The Adventures of Tom Sawyer', 'Mark Twain', 1876, [
  ('What job is Tom doing in this scene?', 'Whitewashing (painting) a fence', ['Fetching water', 'Picking apples', 'Cleaning the house'], '“Tom resumed his whitewashing.”'),
  ('How does Tom make the job seem special?', 'He acts as if whitewashing is a rare privilege', ['He pays Ben to help', 'He complains loudly', 'He sings while he works'], '“Does a boy get a chance to whitewash a fence every day?”'),
  ('Why does Ben stop nibbling his apple?', 'He is getting interested in the whitewashing', ['He drops it', 'It is sour', 'Tom asks for it'], '“That put the thing in a new light. Ben stopped nibbling his apple.”'),
  ('Why does Tom at first refuse to let Ben help?', 'To make Ben want the job even more', ['Aunt Polly told him to', 'Ben is too young', 'He wants to finish it himself'], 'He claims “there ain’t one boy in a thousand, maybe two thousand, that can do it” — making the job sound even more special.'),
  ('Which word best describes Tom in this scene?', 'Clever', ['Honest', 'Lazy and bored', 'Frightened'], 'He tricks Ben into begging to do Tom’s chore.'),
])
P('littlewomen', 'littlewomen', '“Christmas won’t be Christmas without any presents,” grumbled Jo', 'we can make our little sacrifices, and ought to do it gladly.', 'Little Women', 'Louisa May Alcott', 1868, [
  ('Why are the girls unhappy at the start?', 'They will not have Christmas presents', ['They are sick', 'They lost their dog', 'They must move away'], '“Christmas won’t be Christmas without any presents,” grumbled Jo.'),
  ('Which sister looks on the bright side?', 'Beth', ['Jo', 'Meg', 'Amy'], 'Beth says contentedly, “We’ve got Father and Mother, and each other.”'),
  ('Where is their father?', 'Away, where there is fighting in a war', ['At work in the city', 'On a ship at sea', 'Visiting relatives'], 'They think of “Father far away, where the fighting was.”'),
  ('Why did Mother suggest no presents this Christmas?', 'Because of the hard winter and the soldiers suffering in the army', ['Because the girls behaved badly', 'Because the shops were closed', 'Because Father forgot'], 'Meg explains it is “going to be a hard winter for everyone” and the men are “suffering so in the army.”'),
  ('Amy speaks “with an injured sniff.” This shows she feels …', 'hurt and sorry for herself', ['proud', 'cheerful', 'sleepy'], 'She complains that it is not fair for “other girls” to have “nothing at all.”'),
])
P('peterpan', 'peterpan', 'All children, except one, grow up.', 'Two is the beginning of the end.', 'Peter Pan', 'J. M. Barrie', 1911, [
  ('Who is the “one” child in the first sentence who does not grow up?', 'Peter Pan', ['Wendy', 'Mrs. Darling', 'Tinker Bell'], 'The book is about Peter Pan, the boy who never grows up.'),
  ('What was Wendy doing when she learned she must grow up?', 'Playing in a garden and picking a flower', ['Reading a book', 'Eating her dinner', 'Getting ready for bed'], '“She was playing in a garden, and she plucked another flower and ran with it to her mother.”'),
  ('What did Mrs. Darling cry?', '“Oh, why can’t you remain like this for ever!”', ['“Go and play outside!”', '“What a lovely flower!”', '“You are growing so fast!”'], 'She “put her hand to her heart and cried, ‘Oh, why can’t you remain like this for ever!’”'),
  ('What does “Two is the beginning of the end” mean?', 'At two, children start to understand they will grow up', ['Two-year-olds are often sick', 'Wendy was two when the book ended', 'Children stop playing at two'], '“You always know after you are two.”'),
  ('How does the narrator sound in this opening?', 'Playful and a little wistful', ['Angry and harsh', 'Bored and flat', 'Scientific and serious'], 'He makes a light joke, but it carries a sad truth about growing up.'),
])
P('secretgarden', 'secretgarden', 'When Mary Lennox was sent to Misselthwaite Manor', 'she was kept out of the way also.', 'The Secret Garden', 'Frances Hodgson Burnett', 1911, [
  ('Where was Mary Lennox sent to live?', 'At Misselthwaite Manor, with her uncle', ['In India, with her Ayah', 'In London, with her parents', 'At a school for girls'], '“Mary Lennox was sent to Misselthwaite Manor to live with her uncle.”'),
  ('Why was Mary’s face yellow?', 'She had been born in India and was often ill', ['She ate too many lemons', 'She was painted for a party', 'She had been in the sun'], 'It was “because she had been born in India and had always been ill.”'),
  ('How did Mary’s mother feel about her?', 'She had not wanted a little girl at all', ['She loved her dearly', 'She took her to every party', 'She taught her every day'], '“She had not wanted a little girl at all.”'),
  ('What does the repeated phrase “kept out of the way” suggest about Mary’s childhood?', 'She was neglected and lonely', ['She was spoiled with attention', 'She was always in danger', 'She was very popular'], 'As a baby and a toddler, she “was kept out of the way.”'),
  ('Why might a reader feel sorry for Mary, even though she is called “disagreeable-looking”?', 'Nobody loved or cared for her', ['She was too beautiful', 'She was very rich', 'She had many friends'], 'Her parents ignored her and handed her to servants to keep “out of sight.”'),
])
P('treasure', 'treasure', 'Squire Trelawney, Dr. Livesey, and the rest of these gentlemen having', 'took up his lodging under our roof.', 'Treasure Island', 'Robert Louis Stevenson', 1883, [
  ('Who asked the narrator to write down the story?', 'Squire Trelawney, Dr. Livesey, and other gentlemen', ['His father', 'A pirate captain', 'The king'], 'They asked him “to write down the whole particulars about Treasure Island.”'),
  ('What is the narrator keeping secret?', 'The bearings (exact location) of the island', ['His own name', 'Who the pirates were', 'How the story ends'], 'He keeps back “the bearings of the island.”'),
  ('Why does he keep that secret?', 'There is still treasure on the island', ['He has forgotten them', 'The island sank', 'The gentlemen told him to lie'], '“There is still treasure not yet lifted.”'),
  ('Where does the story begin?', 'At the Admiral Benbow inn, run by the narrator’s father', ['On a pirate ship', 'On Treasure Island', 'In a big city'], 'He goes back “to the time when my father kept the Admiral Benbow inn.”'),
  ('What does this opening make the reader expect?', 'An adventure about hidden treasure', ['A quiet story about farming', 'A funny school story', 'A love story'], 'A mysterious seaman with a sabre cut and “treasure not yet lifted” promise adventure.'),
])
P('rikki', 'junglebook', 'This is the story of the great war that Rikki-tikki-tavi fought', 'Rikki-tikki did the real fighting.', 'Rikki-Tikki-Tavi (The Jungle Book)', 'Rudyard Kipling', 1894, [
  ('Who is the main character of this story?', 'Rikki-tikki-tavi', ['Darzee', 'Chuchundra', 'The bungalow'], '“This is the story of the great war that Rikki-tikki-tavi fought.”'),
  ('Where did the great war take place?', 'In a big bungalow (house) and its garden', ['On a ship', 'In a city street', 'In a desert'], 'He fought it “single-handed, through the bath-rooms of the big bungalow.”'),
  ('Who gave Rikki-tikki advice?', 'Darzee the Tailorbird and Chuchundra the muskrat', ['Mowgli and Baloo', 'The family dog', 'The other mongooses'], 'Darzee helped him and Chuchundra “gave him advice.”'),
  ('“Rikki-tikki did the real fighting” suggests that …', 'his helpers talked, but he faced the danger himself', ['he did not fight at all', 'the muskrat was the hero', 'the fight was only a game'], 'Others helped and advised, “but Rikki-tikki did the real fighting.”'),
])
