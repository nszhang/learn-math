/* Reading comprehension passages, Grades 1–6 (original texts).
   { t: title, p: [paragraphs], q: [[question, answer, [wrong, wrong, wrong], why]] } */

export const RC_LIT_1_2 = [
  { t: 'The Lost Mitten', p: [
    `Mia had two red mittens. One day, she lost one at the park. She looked under the slide. She looked by the swings. Then her dog, Pip, ran to her. Pip had the red mitten in his mouth! Mia gave Pip a big hug.`],
  q: [
    ['What did Mia lose?', 'A red mitten', ['A blue hat', 'Her dog', 'A ball'], 'The story says, "One day, she lost one at the park" — one of her red mittens.'],
    ['Where did Mia look first?', 'Under the slide', ['By the swings', 'In her house', 'At school'], 'First "She looked under the slide," then by the swings.'],
    ['Who found the mitten?', 'Pip the dog', ["Mia's mom", 'A friend at the park', 'Mia'], 'Pip ran to Mia with the mitten in his mouth.'],
    ['How did Mia feel at the end?', 'Happy', ['Sad', 'Angry', 'Scared'], 'She gave Pip a big hug, which shows she was happy.']
  ] },
  { t: "Sam's Garden", p: [
    `Sam planted three seeds in a pot. Every day, he gave them water. He put the pot in the sun. After one week, small green leaves came up. Sam smiled. "My plants are growing!" he said.`],
  q: [
    ['How many seeds did Sam plant?', 'Three', ['One', 'Five', 'Ten'], '"Sam planted three seeds in a pot."'],
    ['What did Sam do every day?', 'He gave the seeds water', ['He picked the leaves', 'He moved the pot inside', 'He painted the pot'], '"Every day, he gave them water."'],
    ['When did the leaves come up?', 'After one week', ['After one day', 'After one year', 'That night'], '"After one week, small green leaves came up."'],
    ['What does this story teach?', 'Plants need water and sun to grow', ['Seeds grow best in the dark', 'Plants do not need any care', 'Only pots can grow plants'], 'Sam gave the seeds water and sun, and then they grew.']
  ] },
  { t: 'The Big Race', p: [
    `Turtle and Rabbit had a race. Rabbit ran fast and got far ahead. He stopped to take a nap under a tree. Turtle walked slowly, but he did not stop. When Rabbit woke up, Turtle was at the finish line!`],
  q: [
    ['Who was faster at the start?', 'Rabbit', ['Turtle', 'They were the same', 'A bird'], '"Rabbit ran fast and got far ahead."'],
    ['Why did Rabbit lose the race?', 'He stopped to take a nap', ['He hurt his leg', 'He got lost', 'He forgot about the race'], 'Rabbit "stopped to take a nap under a tree."'],
    ['What did Turtle do?', 'He kept going and did not stop', ['He took a nap too', 'He ran very fast', 'He went home'], '"Turtle walked slowly, but he did not stop."'],
    ['What is the lesson of the story?', 'Slow and steady can win the race', ['Always run as fast as you can', 'Rabbits are never fast', 'Races are not fun'], 'Turtle won because he never stopped, even though he was slow.']
  ] }
];

export const RC_INFO_1_2 = [
  { t: 'Busy Bees', p: [
    `Bees are insects. They have six legs and four wings. Bees fly from flower to flower. They drink a sweet juice called nectar. Bees use nectar to make honey. Bees also help flowers make new seeds.`],
  q: [
    ['How many legs does a bee have?', 'Six', ['Four', 'Eight', 'Two'], '"They have six legs and four wings."'],
    ['What is nectar?', 'A sweet juice in flowers', ['A kind of insect', 'A bee house', 'A type of seed'], '"They drink a sweet juice called nectar."'],
    ['What do bees make from nectar?', 'Honey', ['Milk', 'Bread', 'Seeds'], '"Bees use nectar to make honey."'],
    ['What is this text mostly about?', 'Bees and what they do', ['How to grow flowers', 'Why insects are scary', 'Different kinds of birds'], 'Every sentence tells a fact about bees.']
  ] },
  { t: 'Penguins', p: [
    `Penguins are birds, but they cannot fly. They use their wings to swim. Penguins live where it is very cold. Thick feathers keep them warm. Penguins eat fish from the sea.`],
  q: [
    ['What do penguins use their wings for?', 'Swimming', ['Flying', 'Digging', 'Climbing trees'], '"They use their wings to swim."'],
    ['What keeps penguins warm?', 'Thick feathers', ['Long fur', 'Warm houses', 'The hot sun'], '"Thick feathers keep them warm."'],
    ['What do penguins eat?', 'Fish', ['Grass', 'Nuts', 'Berries'], '"Penguins eat fish from the sea."'],
    ['Where do penguins live?', 'In very cold places', ['In hot deserts', 'In tall trees', 'In big cities'], '"Penguins live where it is very cold."']
  ] },
  { t: 'Your Five Senses', p: [
    `You have five senses. You see with your eyes. You hear with your ears. You smell with your nose. You taste with your tongue. You touch with your skin. Your senses help you learn about the world.`],
  q: [
    ['What do you use to hear?', 'Your ears', ['Your eyes', 'Your nose', 'Your tongue'], '"You hear with your ears."'],
    ['Which body part helps you taste?', 'Your tongue', ['Your skin', 'Your ears', 'Your eyes'], '"You taste with your tongue."'],
    ['How many senses do you have?', 'Five', ['Three', 'Four', 'Six'], '"You have five senses."'],
    ['What do your senses help you do?', 'Learn about the world', ['Grow taller', 'Fall asleep', 'Run faster'], 'The last sentence says senses help you learn about the world.']
  ] }
];

export const RC_LIT_3_4 = [
  { t: 'The Science Fair', p: [
    `Priya had worked on her volcano for two weeks. On the morning of the science fair, she carried it carefully into the gym. Then, as she set it down, the cardboard cone cracked down one side.`,
    `Priya's stomach dropped. Her friend Leo hurried over. "We still have twenty minutes," he said. "Let's fix it." Leo found tape, and Priya found an old paper cup to patch the hole. Together, they rebuilt the side of the cone.`,
    `When the judges arrived, the volcano erupted with foamy red lava. It wasn't as neat as before, but it worked. Priya didn't win first prize, but she grinned at Leo. "I couldn't have done it without you," she said.`],
  q: [
    ['What problem did Priya have?', "Her volcano's cone cracked", ['She forgot her project at home', 'The judges were late', 'She had no lava'], 'Paragraph 1: "the cardboard cone cracked down one side."'],
    ['In paragraph 2, "Priya\'s stomach dropped" means that Priya …', 'suddenly felt worried', ['felt hungry', 'fell to the floor', 'felt excited'], 'Her project had just broken, so she suddenly felt worried.'],
    ['How did Leo help?', 'He helped her patch the volcano', ['He built her a new volcano', 'He asked the judges for more time', 'He gave her his prize'], 'Leo found tape, and together they rebuilt the cone.'],
    ['Which word best describes Leo?', 'Helpful', ['Selfish', 'Lazy', 'Shy'], 'Leo hurried over and offered to fix the volcano.'],
    ['What is the theme of the story?', 'Friends can help us solve problems', ['Winning is all that matters', 'Volcanoes are dangerous', 'Never do science projects'], 'Priya says, "I couldn\'t have done it without you."']
  ] },
  { t: "Grandpa's Lantern", p: [
    `Every summer, Eli visited his grandpa at the lake. The cabin had no electricity, so at night Grandpa lit an old brass lantern. Its warm glow made shadows dance on the walls.`,
    `One evening, a storm knocked a branch onto the roof. The wind howled, and Eli pulled his blanket over his head. Grandpa calmly set the lantern on the table. "Storms always pass," he said, and he began to tell stories about his own childhood at the lake.`,
    `Soon Eli was laughing so hard that he forgot about the wind. By morning, the sky was clear and blue. Before Eli went home, Grandpa handed him the lantern. "For the next storm," he said with a wink.`],
  q: [
    ['Why did Grandpa use a lantern?', 'The cabin had no electricity', ['He liked camping', 'The lights were broken by the storm', 'Eli asked him to'], 'Paragraph 1: "The cabin had no electricity."'],
    ['How did Eli feel when the storm began?', 'Frightened', ['Bored', 'Excited', 'Sleepy'], 'He pulled his blanket over his head when the wind howled.'],
    ['How did Grandpa help Eli feel better?', 'He stayed calm and told stories', ['He turned on the TV', 'He drove Eli home', 'He fixed the roof'], 'Grandpa calmly set down the lantern and told stories.'],
    ['What does the lantern most likely mean to Eli at the end?', "A reminder of Grandpa's comfort", ['A tool he will never use', 'Something broken', 'A gift he did not want'], 'Grandpa gives it "for the next storm," to help Eli feel brave like that night.'],
    ['Which event happened last?', 'Grandpa gave Eli the lantern', ['A branch fell on the roof', 'Eli pulled the blanket over his head', 'Grandpa told stories'], 'Grandpa handed him the lantern "before Eli went home."']
  ] },
  { t: 'The New Kid', p: [
    `On Marco's first day at his new school, he didn't know anyone. At recess, he stood by the fence and watched a group playing soccer. He was good at soccer, but he was too nervous to ask to join.`,
    `A girl named Ava kicked the ball, and it rolled right to Marco's feet. Without thinking, he dribbled past two players and passed it back to her. "Nice!" Ava called. "Want to play on our team?"`,
    `Marco nodded. By the end of recess, he had scored a goal and learned five new names. Walking back inside, he realized that the new school might not be so bad after all.`],
  q: [
    ["Why didn't Marco ask to play at first?", 'He was too nervous', ["He didn't like soccer", 'He was hurt', 'The teacher said no'], 'Paragraph 1: "he was too nervous to ask to join."'],
    ['What event changed things for Marco?', 'The ball rolled to his feet', ['Ava fell down', 'Recess ended early', 'His teacher introduced him'], 'When the ball reached him, he showed his skill and was invited to play.'],
    ['In paragraph 2, "dribbled" means …', 'moved the ball with small kicks', ['dropped water', 'threw the ball', 'ran away'], 'In soccer, you dribble by moving the ball along with your feet.'],
    ["How do Marco's feelings change?", 'From nervous to hopeful', ['From happy to sad', 'From angry to calm', 'From hopeful to nervous'], 'He starts too nervous to join and ends thinking the school "might not be so bad."'],
    ['What is the theme?', 'Taking a small chance can lead to new friendships', ['Soccer is the best sport', 'New schools are always scary', 'It is best to play alone'], 'Joining the game helped Marco learn five new names.']
  ] }
];

export const RC_INFO_3_4 = [
  { t: "Nature's Engineers", p: [
    `Beavers are known as nature's engineers. Using their strong front teeth, they cut down trees and gnaw branches into pieces. Then they drag the wood to a stream.`,
    `Beavers pile the branches across the stream and pack mud and stones between them. Slowly, the dam blocks the water and forms a pond. In the middle of the pond, beavers build a home called a lodge. Its entrance is underwater, which keeps out predators such as wolves.`,
    `Beaver ponds help other animals too. Fish, frogs, ducks and moose all use the wetlands that beavers create.`],
  q: [
    ['Why are beavers called "nature\'s engineers"?', 'They build things like dams', ['They are very large', 'They work in cities', 'They can swim fast'], 'Engineers design and build; beavers build dams and lodges.'],
    ['What do beavers pack between the branches?', 'Mud and stones', ['Leaves and grass', 'Sand and shells', 'Snow and ice'], 'Paragraph 2: they "pack mud and stones between them."'],
    ["Why is the lodge's entrance underwater?", 'To keep out predators', ['To keep the lodge cool', 'So fish can visit', 'To catch food'], 'The underwater entrance "keeps out predators such as wolves."'],
    ['What is the main idea of paragraph 3?', 'Beaver ponds help many other animals', ['Beavers eat fish and frogs', 'Moose build dams too', 'Wetlands are dangerous'], 'Paragraph 3 lists animals that use beaver wetlands.'],
    ['How is paragraph 2 mostly organized?', 'As steps in order', ['As a comparison', 'As a problem and solution', 'As a list of opinions'], 'It explains how a dam is built, step by step.']
  ] },
  { t: 'The Water Cycle', p: [
    `The water you drink may once have been part of a cloud, an ocean or even a dinosaur's puddle! That is because Earth's water moves in a never-ending loop called the water cycle.`,
    `First, the sun heats water in oceans, lakes and rivers. The water turns into an invisible gas called water vapour and rises into the air. This step is called evaporation. High in the sky, the air is cooler, so the vapour turns back into tiny drops of water. The drops gather to form clouds. This is called condensation.`,
    `When the drops in a cloud grow heavy, they fall as rain, snow, sleet or hail. This is precipitation. The water collects in oceans, lakes, rivers and underground, and the cycle begins again.`],
  q: [
    ['What causes evaporation?', 'The sun heating water', ['Cold air in the sky', 'Heavy clouds', 'Wind blowing on snow'], 'Paragraph 2: "the sun heats water" and it turns into vapour.'],
    ['What is condensation?', 'Water vapour turning into drops that form clouds', ['Rain falling from clouds', 'Water soaking into the ground', 'Ice melting in spring'], 'Paragraph 2 defines condensation.'],
    ['Which is an example of precipitation?', 'Snow falling from the sky', ['A puddle drying up', 'Clouds forming', 'Steam rising from a pot'], 'Precipitation is rain, snow, sleet or hail falling from clouds.'],
    ["Why does the author mention a dinosaur's puddle?", 'To show that water has been recycled for a very long time', ['To teach about dinosaurs', 'To warn that puddles are dangerous', 'To describe what rain looks like'], 'The same water keeps cycling through Earth for millions of years.'],
    ['"Never-ending" (paragraph 1) means …', 'continuing without stopping', ['very short', 'moving backward', 'happening once'], 'The cycle "begins again" each time, so it never ends.']
  ] },
  { t: 'The Monarch Journey', p: [
    `Each fall, millions of monarch butterflies leave Canada and the northern United States. They fly south as far as 4,000 kilometres to the mountains of central Mexico. No single butterfly has made the trip before, yet they find the same forests every year.`,
    `Monarchs cannot survive cold winters, so they spend the winter clustered together on fir trees in Mexico. In spring, they begin flying north. Along the way, they lay eggs on milkweed plants. The caterpillars that hatch eat only milkweed.`,
    `Scientists worry because monarch numbers have dropped. One reason is that much of the milkweed has disappeared. People can help by planting milkweed in their gardens.`],
  q: [
    ['Why do monarchs fly south?', 'They cannot survive cold winters', ['They are looking for new flowers', 'They follow the birds', 'They want to lay eggs in Mexico'], 'Paragraph 2: "Monarchs cannot survive cold winters."'],
    ['Why is milkweed important to monarchs?', 'Their caterpillars eat only milkweed', ['It keeps them warm', 'It shows them the way south', 'It grows only in Mexico'], 'Paragraph 2: "The caterpillars that hatch eat only milkweed."'],
    ['What fact in paragraph 1 is most surprising?', 'They find the same forests though no butterfly has made the trip before', ['Monarchs live in Canada', 'Monarchs have wings', 'Mexico has mountains'], 'Each butterfly makes the trip for the first time, yet they find the same place.'],
    ['How does the author suggest people can help?', 'By planting milkweed', ['By catching monarchs', 'By cutting down fir trees', 'By visiting Mexico'], 'The last sentence suggests planting milkweed in gardens.'],
    ['Which sentence best states the main idea?', 'Monarchs make a long journey and need milkweed to survive', ['Mexico has many fir trees', 'Butterflies are pretty insects', 'Scientists study gardens'], 'The text covers the migration and why milkweed matters.']
  ] }
];

export const RC_LIT_5_6 = [
  { t: 'The Map in the Attic', p: [
    `The rain had trapped Nadia and her younger brother, Omar, inside for three days. Restless, they climbed the narrow stairs to the attic, where dust floated in the grey light like tiny snowflakes.`,
    `Behind a stack of their mother's old schoolbooks, Omar found a rolled-up paper tied with string. It was a hand-drawn map of their neighbourhood, but some streets had different names, and in the corner was a small X beside the words "Our Secret Spot — A. & J."`,
    `"A is for Amira," Nadia whispered. "That's Mom." The siblings studied the map, tracing the route with their fingers. It led to the old oak tree behind the library.`,
    `When the rain finally stopped, they raced to the tree. Carved into its trunk, faded but still clear, were two sets of initials inside a heart. Nadia smiled. Some mysteries, she decided, were better solved together — and saved as a surprise for dinner conversation.`],
  q: [
    ['As used in paragraph 1, "restless" most nearly means …', 'unable to stay still or relax', ['very sleepy', 'angry', 'frightened'], 'Being stuck inside for three days made them fidgety and bored.'],
    ['Why do Nadia and Omar go to the attic?', 'They are bored after days of rain', ['Their mother sends them', 'They hear a noise', 'They are looking for the map'], 'Paragraph 1: the rain "had trapped" them inside, so they were restless.'],
    ['What can the reader infer about "J."?', 'J. was someone close to their mother when she was young', ['J. is their teacher', 'J. is Omar', 'J. drew the library'], 'The initials A. and J. appear together, and again inside a heart on the tree.'],
    ['From which point of view is the story told?', 'Third person', ['First person', 'Second person', 'From the mother\'s point of view'], 'The narrator uses "they" and "she," and is not a character.'],
    ['In paragraph 1, the dust is compared to …', 'tiny snowflakes', ['rain', 'grey light', 'old schoolbooks'], 'The simile is "like tiny snowflakes."'],
    ['What do the siblings most likely plan to do at dinner?', 'Surprise their mother by mentioning what they found', ['Tell her the attic is dusty', 'Ask to move house', 'Keep the map a secret forever'], 'Nadia decides the mystery is "a surprise for dinner conversation."']
  ] },
  { t: 'The Last Shot', p: [
    `With four seconds left and her team down by one point, Jada stood at the free-throw line. The gym roared. She had missed both of her free throws in the last game, and everyone knew it.`,
    `For three weeks after that game, she had stayed after practice, shooting one hundred free throws every day. At first she made only half of them. By last Friday, she was making eighty.`,
    `Now she bounced the ball twice, the way she always did in practice, and breathed out slowly. The noise of the crowd seemed to fade. She bent her knees and released the ball. It spun through the air and dropped through the net without touching the rim.`,
    `The second shot went in too. As her teammates mobbed her, Jada caught her coach's eye. He simply nodded, as if he had known all along.`],
  q: [
    ['Why is the moment in paragraph 1 so tense?', 'The game is close and Jada missed in the last game', ['Jada is hurt', 'The gym is empty', 'Her team is far ahead'], 'Her team is down by one, and she missed both free throws last time.'],
    ['What does paragraph 2 mainly show?', 'Jada practised hard to improve', ['Jada dislikes basketball', 'The coach was angry', 'Free throws are easy'], 'She shot one hundred free throws every day for three weeks.'],
    ['Why does the noise of the crowd "seem to fade"?', 'Jada is concentrating deeply', ['The crowd leaves', 'Jada covers her ears', 'The game is over'], 'She follows her practice routine and focuses only on the shot.'],
    ["What does the coach's nod suggest?", 'He trusted that her practice would pay off', ['He did not see the shot', 'He was disappointed', 'He wanted her to leave'], '"As if he had known all along" shows his confidence in her preparation.'],
    ['What is the theme of the story?', 'Hard work can help you overcome failure', ['Talent matters more than practice', 'Crowds make games fun', 'Winning is luck'], 'Her practice after a failure leads to success.']
  ] },
  { t: 'The Forgotten Line', p: [
    `Ben had rehearsed his lines for the school play so many times that his little sister could recite them too. He played the king, and his big moment came in the second act, when he had to give a speech to his "royal court."`,
    `On opening night, Ben walked to the centre of the stage, opened his mouth — and nothing came out. The words had vanished. Two hundred faces stared at him in the dark. He could hear someone's chair creak.`,
    `Then, from the side of the stage, he heard a tiny whisper: "Loyal friends …" It was Hana, the stage manager, holding the script. The words came flooding back. Ben lifted his chin and boomed, "Loyal friends, hear me!"`,
    `After the show, Ben found Hana packing up props. "You saved the whole play," he said. Hana shrugged. "That's my job," she said, but she was smiling.`],
  q: [
    ['What is the turning point (climax) of the story?', 'Ben forgets his lines on stage', ['Ben rehearses at home', 'Hana packs up props', 'The play is cast'], 'The tension peaks when "nothing came out."'],
    ['"The words came flooding back" means Ben …', 'suddenly remembered everything at once', ['started to cry', 'heard a lot of water', 'forgot even more'], 'Hana\'s whisper helped him remember the whole speech quickly.'],
    ['Which detail best shows how silent the theatre was?', "He could hear someone's chair creak", ['Two hundred faces stared at him', 'He played the king', 'His sister knew his lines'], 'Hearing a small creak shows the room was completely quiet.'],
    ['What role does Hana play in the story?', 'She prompts Ben when he forgets', ['She plays the queen', 'She is Ben\'s sister', 'She is in the audience'], 'As stage manager, she whispers the line from the script.'],
    ["How does Hana feel about Ben's thanks?", 'Pleased, though modest', ['Annoyed', 'Jealous', 'Confused'], 'She shrugs and says "That\'s my job," but she is smiling.']
  ] }
];

export const RC_INFO_5_6 = [
  { t: 'The Mystery of the Moving Rocks', p: [
    `In Death Valley, California, there is a dry lakebed called Racetrack Playa. Scattered across its flat surface are hundreds of rocks, some weighing more than 300 kilograms. Behind many of them stretch long trails, as if the rocks had slid across the ground on their own.`,
    `For decades, no one had ever seen the rocks move, and scientists proposed many explanations, from strong winds to ice to magnetic forces. The mystery was finally solved in 2014, when researchers placed GPS trackers in rocks and set up cameras.`,
    `They discovered that on rare winter days, a thin layer of rainwater covers the playa and freezes overnight. When the sun comes out, the ice breaks into large, thin sheets. Light winds push these sheets, and the floating ice shoves the rocks slowly across the slippery mud.`,
    `The answer shows how patience and new technology can solve puzzles that once seemed impossible.`],
  q: [
    ['What was the mystery?', 'How the rocks moved and left trails', ['Who put the rocks there', 'Why the lake dried up', 'How old the rocks were'], 'Paragraph 1 describes trails "as if the rocks had slid … on their own."'],
    ['How did researchers solve the mystery?', 'They used GPS trackers and cameras', ['They pushed the rocks themselves', 'They asked people who lived nearby', 'They studied magnets'], 'Paragraph 2: they "placed GPS trackers in rocks and set up cameras."'],
    ['What actually pushes the rocks?', 'Thin sheets of ice moved by light winds', ['Strong magnetic forces', 'Earthquakes', 'Animals'], 'Paragraph 3 explains the ice sheets and wind.'],
    ['Why had no one seen the rocks move before?', 'It happens only on rare winter days', ['The rocks move only at night', 'People are not allowed there', 'The rocks are too small to see'], 'The conditions occur "on rare winter days."'],
    ['How is the passage mainly organized?', 'Problem and solution', ['Compare and contrast', 'A story told in flashbacks', 'A list of opinions'], 'It presents a mystery and then explains how it was solved.']
  ] },
  { t: 'Why We Sleep', p: [
    `Scientists once thought sleep was simply a time when the body and brain switched off. Today we know the opposite is true: while you sleep, your brain is busy.`,
    `During deep sleep, your brain sorts through the day's experiences. It strengthens important memories and clears away information you do not need. Students who sleep well after studying usually remember more the next day than students who stay up late.`,
    `Sleep also helps the body. Growth hormones are released at night, muscles repair themselves, and the immune system builds defences against illness.`,
    `Experts recommend that children aged 6 to 12 get nine to twelve hours of sleep each night. Yet surveys show many get less, often because of screens. The light from phones and tablets can trick the brain into thinking it is still daytime, making it harder to fall asleep.`],
  q: [
    ['Which old idea does the author correct in paragraph 1?', 'That the brain switches off during sleep', ['That children need sleep', 'That screens are bright', 'That memories are important'], '"Today we know the opposite is true: while you sleep, your brain is busy."'],
    ['Which detail supports the idea that sleep helps memory?', 'Students who sleep well after studying remember more', ['Growth hormones are released at night', 'Screens give off light', 'Muscles repair themselves'], 'Paragraph 2 connects sleep with remembering more.'],
    ['Based on paragraph 3, the immune system most likely …', 'protects the body from illness', ['helps you grow taller', 'controls your dreams', 'makes your muscles move'], 'It "builds defences against illness."'],
    ['According to paragraph 4, why can screens make it hard to sleep?', 'Their light tricks the brain into thinking it is daytime', ['They are too loud', 'They make you hungry', 'They use too much electricity'], 'The last sentence explains the effect of screen light.'],
    ["What is the author's main purpose?", 'To inform readers about why sleep is important', ['To sell a new bed', 'To tell a story about a student', 'To argue that schools should start later'], 'The passage explains facts about sleep and the brain and body.']
  ] },
  { t: 'The Inuksuk', p: [
    `Across the Arctic stand stone figures called inuksuit (the singular is inuksuk). The word comes from Inuktitut and means "to act in the capacity of a human." For thousands of years, Inuit have built these stone structures for many purposes.`,
    `Some inuksuit mark a good place to fish or hunt. Others point the way home across the open tundra, where there are few trees or landmarks. Certain arrangements warned travellers of danger, such as thin ice. A few are sacred and are treated with great respect.`,
    `Building an inuksuk takes skill. Stones must be balanced carefully so the structure can stand for generations in fierce Arctic winds.`,
    `Today the inuksuk is a symbol of Canada and appears on the flag of Nunavut. For many people it represents leadership, cooperation and the importance of helping others find their way.`],
  q: [
    ['What does the word inuksuk mean?', 'To act in the capacity of a human', ['A stone house', 'A frozen lake', 'A hunting tool'], 'Paragraph 1 gives the meaning from Inuktitut.'],
    ['Why were inuksuit useful as direction markers?', 'The tundra has few trees or landmarks', ['They glow in the dark', 'They are very tall buildings', 'They are made of ice'], 'Paragraph 2: they point the way home "where there are few trees or landmarks."'],
    ['Which purpose is NOT mentioned in the passage?', 'Marking the border between two countries', ['Marking a good fishing spot', 'Warning of thin ice', 'Pointing the way home'], 'Borders are never mentioned; the others are in paragraph 2.'],
    ['As used in paragraph 3, "fierce" means …', 'very strong and violent', ['gentle', 'cold and wet', 'quiet'], 'The stones must withstand powerful Arctic winds.'],
    ['What does paragraph 4 mainly explain?', 'What the inuksuk represents today', ['How to build an inuksuk', 'Where Nunavut is', 'Why stones are heavy'], 'It describes the inuksuk as a symbol and what it represents.']
  ] }
];
