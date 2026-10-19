/* English — reading and writing strategy skills added to match IXL Grades 2–12. Short original
   passages; each item: [passage or prompt, question, answer, wrong answers, explanation]. */
import { pairs } from '../quiz.js';
import { b } from './words.js';

const sk = (k, t, s, g, gen) => ({ k, t, s, g, gen });
const G = (a, z) => Array.from({ length: z - a + 1 }, (_, i) => a + i);
const box = p => `<div class="passage">${p}</div>`;
// items: [passage|null, question, answer, wrongs, why]
const bank = items => pairs({ items: items.map(([p, q, a, w, why]) => [`${p ? box(p) + '<p style="margin-top:10px">' : ''}${q}${p ? '</p>' : ''}`, a, why, [a, ...w]]) });

const CAUSE_EFFECT_INFO = [
  ['In 1816, a volcano in Indonesia threw so much ash into the sky that it blocked sunlight around the world. As a result, summer temperatures dropped, and crops failed in Europe and North America.', 'What was one effect of the volcano?', 'Crops failed', ['The volcano stopped erupting', 'Summers became hotter', 'More sunlight reached Earth'], 'The ash blocked sunlight, so temperatures dropped and crops failed.'],
  ['Because beavers build dams, streams back up into ponds. These ponds create wetlands where frogs, ducks and fish can live.', 'What causes the ponds to form?', 'Beavers build dams', ['Frogs dig holes', 'Ducks need water', 'Fish swim upstream'], 'The dams back up the streams.'],
  ['When people stopped using a pesticide called DDT, populations of bald eagles began to recover. DDT had made the birds\' eggshells so thin that they broke.', 'Why had bald eagle populations dropped?', 'DDT made their eggshells too thin', ['They had no food', 'People hunted them', 'Their nests were too high'], 'The passage says DDT thinned the eggshells.'],
  ['Heavy rain soaked the hillside for a week. The soil became loose and heavy, and a mudslide closed the highway.', 'What caused the mudslide?', 'A week of heavy rain loosened the soil', ['The highway was too busy', 'An earthquake shook the hill', 'Trees were planted'], 'The rain made the soil loose and heavy.'],
  ['Many cities have added bike lanes. Since then, more people have started biking to work, and traffic on some streets has decreased.', 'What is one effect of adding bike lanes?', 'More people bike to work', ['Fewer people own bikes', 'Traffic increased everywhere', 'Bike lanes were removed'], 'The passage lists more cycling as a result.']
];
const COMPARE_INFO = [
  ['Frogs and toads are both amphibians. Frogs have smooth, wet skin and long legs for jumping. Toads have dry, bumpy skin and shorter legs, so they usually walk or hop short distances.', 'How are frogs and toads different?', 'Frogs have smooth skin; toads have bumpy skin', ['Only frogs are amphibians', 'Toads have longer legs', 'Frogs have dry skin'], 'The passage contrasts their skin and legs.'],
  ['Both alligators and crocodiles are large reptiles. Alligators have wide, U-shaped snouts, while crocodiles have narrow, V-shaped snouts.', 'How are alligators and crocodiles alike?', 'Both are large reptiles', ['Both have V-shaped snouts', 'Both have U-shaped snouts', 'Both are mammals'], '"Both … are large reptiles."'],
  ['Hurricanes and tornadoes are both spinning storms. Hurricanes form over warm ocean water and can be hundreds of kilometres wide. Tornadoes form over land and are usually less than one kilometre wide.', 'Which is a difference between hurricanes and tornadoes?', 'Hurricanes form over oceans; tornadoes form over land', ['Only tornadoes spin', 'Hurricanes are smaller', 'Tornadoes form over warm water'], 'The passage contrasts where they form and their size.'],
  ['Butterflies and moths both have scaly wings. Butterflies usually fly during the day and rest with their wings closed. Moths usually fly at night and rest with their wings spread flat.', 'When do moths usually fly?', 'At night', ['During the day', 'Only in winter', 'At noon'], 'The passage says moths usually fly at night.']
];
const ORDER_INFO = [
  ['To make a paper airplane, first fold a sheet of paper in half the long way. Next, fold the top corners down to the centre crease. Then fold the new edges to the centre again. Finally, fold the plane in half and fold down the wings.', 'What do you do right after folding the paper in half the long way?', 'Fold the top corners to the centre crease', ['Fold down the wings', 'Fold the plane in half', 'Throw the plane'], 'The word "Next" comes right after the first step.'],
  ['A caterpillar hatches from an egg. It eats leaves and grows. Then it forms a chrysalis. Inside, it changes, and finally it comes out as a butterfly.', 'What happens just before the caterpillar becomes a butterfly?', 'It forms a chrysalis', ['It hatches from an egg', 'It lays eggs', 'It eats flowers'], 'The chrysalis stage comes before the butterfly.'],
  ['In 1867, Canada became a country with four provinces. Manitoba joined in 1870, British Columbia in 1871 and Prince Edward Island in 1873.', 'Which province joined last in the passage?', 'Prince Edward Island', ['Manitoba', 'British Columbia', 'Ontario'], '1873 is the latest date given.']
];
const TEXT_STRUCTURE = [
  ['Sharks and dolphins both live in the ocean. However, sharks are fish, while dolphins are mammals that breathe air.', 'Compare and contrast', ['Sequence', 'Problem and solution', 'Cause and effect'], 'It tells how two things are alike and different.'],
  ['First, mix the flour and sugar. Next, add the eggs. Then pour the batter into a pan and bake for 30 minutes.', 'Sequence', ['Compare and contrast', 'Cause and effect', 'Problem and solution'], 'It gives steps in order.'],
  ['Our school\'s recycling bins were always overflowing. To fix this, students started a club that empties the bins twice a week.', 'Problem and solution', ['Sequence', 'Compare and contrast', 'Description'], 'It names a problem and how it was solved.'],
  ['Because the river flooded, many roads were closed. As a result, students could not get to school.', 'Cause and effect', ['Sequence', 'Compare and contrast', 'Problem and solution'], 'It explains why something happened and what followed.'],
  ['The giant panda has black-and-white fur, round ears and a large head. It weighs up to 120 kilograms and eats mostly bamboo.', 'Description', ['Cause and effect', 'Sequence', 'Problem and solution'], 'It describes the features of one thing.']
];
const TOPIC_EXPOSITORY = [
  ['___ They help make honey, and they carry pollen from flower to flower so plants can make seeds.', 'Bees are important insects.', ['I saw a bee yesterday.', 'Honey is sticky.', 'Flowers are pretty.'], 'The topic sentence states the main idea of the facts that follow.'],
  ['___ You should brush twice a day, floss once a day and visit the dentist twice a year.', 'There are several ways to keep your teeth healthy.', ['My dentist is nice.', 'Toothpaste tastes like mint.', 'I lost a tooth last year.'], 'It introduces the list of tips.'],
  ['___ It can be very hot during the day and freezing at night, and it may not rain for years.', 'Deserts are places with extreme weather.', ['I want to visit a desert.', 'Camels have humps.', 'Sand is yellow.'], 'It sums up the details about desert weather.']
];
const WRITERS_PURPOSE = [
  ['Which text was written to persuade?', 'Everyone should adopt a pet from a shelter — you will save a life!', ['Shelters care for dogs and cats until they are adopted.', 'Once upon a time, a puppy found a home.', 'Go to the shelter, then fill out a form.'], 'It tries to convince the reader.'],
  ['Which text was written to inform?', 'Sea turtles can live for more than 50 years.', ['Sea turtles are the coolest animals ever!', 'Tiny Turtle wanted to see the moon.', 'You should help save sea turtles today.'], 'It gives a fact.'],
  ['Which text was written to entertain?', 'The silly squirrel slipped on a banana peel and slid right into the pond!', ['Squirrels store nuts for the winter.', 'Please do not feed the squirrels.', 'Squirrels live in many parks.'], 'It tells a funny story.']
];
const FACT_OPINION_SENT = [
  ['Complete the sentence so it states a fact: "A week has ___ days."', 'seven', ['too many', 'boring', 'the best'], 'A fact can be proven true.'],
  ['Complete the sentence so it states an opinion: "Summer is the ___ season."', 'best', ['warmest in Canada', 'third', 'June to September'], 'An opinion tells what someone thinks or feels.'],
  ['Complete the sentence so it states a fact: "Water freezes at ___ degrees Celsius."', '0', ['very cold', 'the coolest', 'nice'], 'This can be checked.'],
  ['Complete the sentence so it states an opinion: "Broccoli is ___."', 'delicious', ['a vegetable', 'green', 'a plant'], '"Delicious" is a personal feeling.']
];
const OPINION_EXAMPLE = [
  ['Opinion: Our school should have a garden. Reason: A garden would help us learn about plants.', 'Which sentence is the best example to support the reason?', 'We could watch seeds sprout and measure how fast they grow.', ['Gardens are green.', 'I like pizza.', 'Our school has a gym.'], 'The example shows how students would learn about plants.'],
  ['Opinion: Dogs make great pets. Reason: Dogs are loyal.', 'Which sentence is the best example to support the reason?', 'My dog waits by the door every day until I come home.', ['Some dogs are big.', 'Cats like to nap.', 'Dogs need food.'], 'It gives a specific example of loyalty.'],
  ['Opinion: Everyone should learn to swim. Reason: Swimming keeps you safe near water.', 'Which sentence is the best example to support the reason?', 'If you fall into a lake, knowing how to swim can help you reach the shore.', ['Pools are fun.', 'Swimsuits come in many colours.', 'Fish can swim.'], 'It shows how swimming keeps you safe.']
];
const OPINION_REASON = [
  ['Opinion: Recess should be longer.', 'Which is the best reason to support the opinion?', 'Playing outside helps students focus better in class.', ['Recess is at 10:30.', 'The playground has a slide.', 'I wore my red shoes.'], 'A reason explains why the opinion is right.'],
  ['Opinion: Reading every night is a good habit.', 'Which is the best reason to support the opinion?', 'Reading helps you learn new words.', ['Books have pages.', 'The library closes at 5.', 'My book is blue.'], 'It explains a benefit of reading.'],
  ['Opinion: We should plant more trees in our town.', 'Which is the best reason to support the opinion?', 'Trees give shade and clean the air.', ['Trees have leaves.', 'Our town has a mayor.', 'It rained yesterday.'], 'It explains why more trees would help.']
];
const OPINION_TABLE = [
  ['Opinion: Soccer is the best sport. | Reason: It keeps you active. | Example: ___', 'Which example best completes the table?', 'In one game, players can run more than five kilometres.', ['Soccer balls are round.', 'Hockey is played on ice.', 'My team wears blue.'], 'It shows how soccer keeps you active.'],
  ['Opinion: Cats are good pets. | Reason: ___ | Example: My cat cleans itself and uses a litter box.', 'Which reason best completes the table?', 'Cats are easy to take care of.', ['Cats have whiskers.', 'Dogs bark.', 'Cats sleep a lot.'], 'The example shows cats are easy to care for.'],
  ['Opinion: ___ | Reason: Fruit has vitamins. | Example: Oranges have lots of vitamin C.', 'Which opinion best completes the table?', 'Kids should eat more fruit.', ['Oranges are orange.', 'Vitamins are tiny.', 'I had cereal today.'], 'The reason and example support eating fruit.']
];
const SENSORY_PICS = [['🍋', 'Which detail tells how the picture tastes?', 'sour', ['yellow', 'smooth', 'quiet']], ['🔔', 'Which detail tells how the picture sounds?', 'ringing', ['shiny', 'cold', 'sweet']],
  ['🌹', 'Which detail tells how the picture smells?', 'sweet and flowery', ['thorny', 'red', 'silent']], ['🧸', 'Which detail tells how the picture feels?', 'soft and fuzzy', ['brown', 'quiet', 'salty']],
  ['🌈', 'Which detail tells how the picture looks?', 'colourful', ['loud', 'sour', 'rough']]];
const DESCRIPTIVE = [['Which sentence has the most descriptive details?', 'The fluffy white puppy chased a bright red ball across the green grass.', ['The puppy chased a ball.', 'The dog ran.', 'There was a puppy and a ball.']],
  ['Which sentence has the most descriptive details?', 'Warm, cinnamon-scented muffins cooled on the kitchen counter.', ['Muffins were on the counter.', 'We had muffins.', 'The muffins were there.']],
  ['Which sentence has the most descriptive details?', 'Icy wind howled through the bare, crooked branches.', ['The wind blew.', 'It was windy.', 'There were branches and wind.']],
  ['Which sentence has the most descriptive details?', 'The tiny, shy kitten peeked out from under the dusty old couch.', ['The kitten hid.', 'A cat was under the couch.', 'The kitten was there.']]];
const MIXED_MEDIA = [['📋 A list of steps for building a birdhouse', 'To explain how to do something', ['To tell a funny story', 'To persuade', 'To describe a feeling']],
  ['📰 A poster that says "Vote for Ana for class president!"', 'To persuade', ['To explain how to do something', 'To entertain with a story', 'To give scientific facts']],
  ['📗 A comic about a talking cat who solves mysteries', 'To entertain', ['To persuade', 'To give directions', 'To report the news']],
  ['🗺️ A museum map with labels for each room', 'To inform', ['To entertain', 'To persuade', 'To express an opinion']]];
const TWO_TEXTS = [
  ['Text 1: Honeybees make honey and beeswax. Text 2: Bees pollinate many of the fruits and vegetables people eat.', 'Which sentence combines the main ideas of both texts?', 'Bees are useful because they make honey and wax and help grow our food.', ['Bees make honey.', 'Vegetables need water.', 'Bees can sting.'], 'It includes ideas from both texts.'],
  ['Text 1: The Rocky Mountains stretch from Canada to New Mexico. Text 2: Many animals, such as bighorn sheep and grizzly bears, live in the Rockies.', 'Which sentence combines the main ideas of both texts?', 'The Rocky Mountains are a long mountain range that is home to many animals.', ['Grizzly bears are big.', 'New Mexico is hot.', 'Mountains are tall.'], 'It joins the range\'s size and its wildlife.'],
  ['Text 1: Exercise makes your heart stronger. Text 2: Exercise can also improve your mood and help you sleep.', 'Which sentence combines the main ideas of both texts?', 'Exercise helps both your body and your mind.', ['Hearts pump blood.', 'Sleep is important.', 'Running is fast.'], 'It covers physical and mental benefits.']
];
const THEMES = [
  ['Leo wanted to win the race so badly that he skipped warm-ups. Halfway through, his leg cramped and he had to stop. The next week, he stretched carefully and finished strong.', 'What is the theme?', 'Preparation matters as much as effort', ['Running is boring', 'Never enter races', 'Winning is easy'], 'Leo learns to prepare.'],
  ['Ava found a wallet full of money on the bus. She thought about the new skates she wanted, but she turned it in to the driver. The next day, the owner thanked her with a handwritten note.', 'What is the theme?', 'Honesty is rewarding even when it is hard', ['Money brings happiness', 'Buses are dangerous', 'Skates are expensive'], 'Ava chooses honesty.'],
  ['The new student, Dev, sat alone for a week. Mia finally invited him to her lunch table. By June, Dev was her best friend.', 'What is the theme?', 'Small acts of kindness can change lives', ['Lunch is important', 'New students are shy', 'Friendship is impossible'], 'Mia\'s kindness leads to friendship.'],
  ['Kai was afraid of the deep end. Every day he swam a little farther. By the end of summer, he dove off the high board.', 'What is the theme?', 'Facing fears step by step builds courage', ['Swimming is dangerous', 'Summer is too short', 'High boards are scary'], 'Kai overcomes fear gradually.']
];
const QUOTE_THEMES = [['"I thought I needed to be the best. Now I know I just needed to keep trying."', 'Perseverance', ['Greed', 'Revenge', 'Jealousy'], 'The speaker values continued effort.'],
  ['"We may have lost the game, but we won something more — we became a team."', 'Teamwork', ['Betrayal', 'Loneliness', 'Pride'], 'The focus is on working together.'],
  ['"The more I got, the more I wanted, until I had nothing that mattered."', 'Greed', ['Courage', 'Friendship', 'Hope'], 'Wanting more leads to emptiness.'],
  ['"Even in the darkest winter, I knew spring would come."', 'Hope', ['Anger', 'Greed', 'Fear'], 'The speaker trusts things will improve.'],
  ['"I was afraid, but I spoke up anyway."', 'Courage', ['Greed', 'Laziness', 'Envy'], 'Acting despite fear is courage.']];
const AUTHOR_POV = [
  ['Libraries are more important than ever. They offer free books, computers and classes to everyone. Closing them would be a serious mistake.', 'What is the author\'s point of view?', 'Libraries are valuable and should stay open', ['Libraries should close', 'Libraries are outdated', 'The author has no opinion'], '"Closing them would be a serious mistake."'],
  ['Some people love winter sports, but I find the cold miserable. Give me a sunny beach any day.', 'What is the author\'s point of view about winter?', 'The author dislikes the cold of winter', ['The author loves winter sports', 'The author has never seen snow', 'The author prefers skiing'], '"I find the cold miserable."'],
  ['Video games can teach problem-solving and teamwork, as long as players also make time for other activities.', 'What is the author\'s point of view about video games?', 'They can be helpful in balance with other activities', ['They are always harmful', 'They should be banned', 'They are only for adults'], 'The author sees benefits with a condition.']
];
const POV_COMPARE = [
  ['Narrator 1: "I was nervous when the new dog came home. It barked at everything." Narrator 2: "I was so excited when we got our dog! He was just saying hello."', 'How do the two narrators view the new dog differently?', 'One is nervous about it; the other is excited', ['Both are scared of it', 'Both dislike it', 'Neither has met it'], 'Their feelings about the barking differ.'],
  ['Account 1: "The storm was terrifying — the wind shook our windows all night." Account 2: "The storm was amazing. I watched the lightning for hours."', 'How are the two accounts different?', 'One person was scared; the other was fascinated', ['Both were scared', 'Both slept through it', 'Neither saw lightning'], 'They react differently to the same storm.']
];
const FIG_CLASS = [['The snow was a white blanket.', 'Metaphor', ['Simile', 'Personification', 'Onomatopoeia']], ['She ran as fast as a cheetah.', 'Simile', ['Metaphor', 'Hyperbole', 'Alliteration']],
  ['The leaves danced in the wind.', 'Personification', ['Simile', 'Hyperbole', 'Onomatopoeia']], ['I\'m so hungry I could eat a horse!', 'Hyperbole', ['Simile', 'Metaphor', 'Personification']],
  ['Buzz! went the bee.', 'Onomatopoeia', ['Alliteration', 'Simile', 'Metaphor']], ['Peter Piper picked a peck of pickled peppers.', 'Alliteration', ['Onomatopoeia', 'Hyperbole', 'Simile']]];
const ALLUSIONS = [['"Don\'t open that Pandora\'s box," Mom warned when I asked about the old argument.', 'Something that will cause many unexpected problems', ['A treasure chest', 'A gift box', 'A locked diary'], 'In Greek myth, opening Pandora\'s box released troubles into the world.'],
  ['Their defence was strong, but the goalie\'s weak ankle was the team\'s Achilles\' heel.', 'A small but serious weakness', ['A great strength', 'A lucky charm', 'An injury that healed'], 'Achilles was invincible except for his heel.'],
  ['Selling the family farm felt like crossing the Rubicon.', 'Making a decision that cannot be undone', ['Taking a short trip', 'Building a bridge', 'Going for a swim'], 'Caesar\'s crossing of the Rubicon began a war with no turning back.'],
  ['He has the Midas touch — every business he starts succeeds.', 'An ability to make everything successful', ['Bad luck', 'A gentle touch', 'A golden ring'], 'King Midas turned everything he touched into gold.'],
  ['The village was quiet, but we sensed a Trojan horse in the stranger\'s generous offer.', 'A trick disguised as a gift', ['A real horse', 'A kind gesture', 'A wooden toy'], 'The Greeks hid soldiers inside a wooden horse given as a gift.']];
const INFER_SUPPORT = [
  ['Mila grabbed her umbrella, pulled on her boots and frowned at the grey sky.', 'What can you infer, and which detail supports it?', 'It is probably going to rain — she grabbed her umbrella', ['It is sunny — she frowned', 'It is snowing — she wore boots', 'It is night — the sky was grey'], 'The umbrella and grey sky suggest rain.'],
  ['When the bell rang, Omar raced out the door, shouting, "Finally! Summer!"', 'What can you infer, and which detail supports it?', 'It is the last day of school — he shouted "Finally! Summer!"', ['Omar is late — the bell rang', 'Omar is sad — he raced out', 'Omar forgot his bag — he shouted'], 'His shout shows school is over for summer.'],
  ['Grandpa squinted at the menu, held it farther away and then patted his shirt pocket.', 'What can you infer, and which detail supports it?', 'He needs his reading glasses — he squinted and patted his pocket', ['He is hungry — he read the menu', 'He is angry — he held the menu away', 'He is cold — he patted his shirt'], 'Squinting and searching his pocket suggest missing glasses.']
];
const CHAR_COMPARE = [
  ['Rosa read every instruction twice before starting the science project. Her partner, Jake, grabbed the materials and started building right away.', 'How are Rosa and Jake different?', 'Rosa is careful; Jake is impulsive', ['Both are careful', 'Both are lazy', 'Rosa is impulsive; Jake is careful'], 'Rosa reads twice; Jake jumps in.'],
  ['Both Tia and her brother love animals. Tia volunteers at the shelter every weekend, while her brother draws pictures of wildlife.', 'How are Tia and her brother alike?', 'They both love animals', ['They both volunteer', 'They both draw', 'They both dislike pets'], '"Both Tia and her brother love animals."']
];
const PLOT = [['Which part of the plot is this? "The tornado touched down just as Lena reached the cellar door."', 'Climax', ['Exposition', 'Resolution', 'Falling action'], 'This is the moment of greatest tension.'],
  ['Which part of the plot is this? "Once upon a time, in a small village by the sea, lived a fisherman named Tomas."', 'Exposition', ['Climax', 'Rising action', 'Resolution'], 'It introduces the setting and character.'],
  ['Which part of the plot is this? "After the storm, the neighbours helped rebuild the barn, and the town was closer than ever."', 'Resolution', ['Climax', 'Rising action', 'Exposition'], 'The conflict is settled.'],
  ['Which part of the plot is this? "First the river rose, then the bridge cracked, and the villagers began to worry."', 'Rising action', ['Resolution', 'Exposition', 'Falling action'], 'Problems build toward the climax.'],
  ['What is the conflict in this story? "Max wants to join the hockey team, but he cannot skate yet."', 'Max cannot skate but wants to play hockey', ['Max is on the team', 'Max lost his skates', 'The rink is closed'], 'The conflict is the problem the character faces.']];
const GENRES = [
  ['Poem: "The maple flares in autumn red, / a torch above the river\'s bed." Article: "Maple leaves turn red in fall because trees stop making green chlorophyll and produce red pigments."', 'How do the two texts treat the topic differently?', 'The poem uses imagery; the article explains the science', ['Both explain the science', 'Both use rhyme', 'The article is fiction'], 'Different genres serve different purposes.'],
  ['Story: "Grandma\'s kitchen smelled of bannock as she told us about her childhood." Recipe: "Mix 2 cups flour, 1 tbsp baking powder and 1 cup water. Bake at 200 °C for 20 minutes."', 'What is a key difference between the texts?', 'The story shares memories; the recipe gives instructions', ['Both give instructions', 'Both are poems', 'The recipe tells about Grandma'], 'One is narrative, one is procedural.']
];
const DETAILS_LIT = [
  ['Jada slammed her locker, stomped down the hall and refused to look at anyone.', 'Which detail best supports the idea that Jada is upset?', 'She slammed her locker', ['She walked down the hall', 'She has a locker', 'She was at school'], 'Slamming shows anger.'],
  ['The old house creaked in the wind. Dust covered every surface, and cobwebs hung from the ceiling.', 'Which detail best supports the idea that the house is abandoned?', 'Dust covered every surface', ['The wind was blowing', 'It was a house', 'The house had a ceiling'], 'Thick dust shows no one has lived there for a long time.'],
  ['Ben practised the piano every morning before school and every night after dinner.', 'Which detail best supports the idea that Ben is dedicated?', 'He practised every morning and every night', ['He went to school', 'He ate dinner', 'He has a piano'], 'Practising twice a day shows dedication.']
];
const DETAILS_INFO = [
  ['Cheetahs are the fastest land animals. They can reach 110 km/h in about three seconds, and their long tails help them balance in sharp turns.', 'Which detail best supports the idea that cheetahs are built for speed?', 'They can reach 110 km/h in about three seconds', ['They are animals', 'They have tails', 'They live on land'], 'This detail shows their speed.'],
  ['Recycling saves resources. Making cans from recycled aluminum uses about 95 percent less energy than making them from new metal.', 'Which detail best supports the main idea?', 'Recycled aluminum uses 95 percent less energy', ['Cans are made of metal', 'People drink from cans', 'Aluminum is shiny'], 'It shows how recycling saves resources.'],
  ['Sleep helps students learn. In one study, students who slept eight hours remembered more vocabulary than those who slept five.', 'Which detail best supports the main idea?', 'Students who slept eight hours remembered more', ['Students go to school', 'Vocabulary is important', 'Five is less than eight'], 'It links sleep to learning.']
];
const SUPPORT_EVIDENCE = [
  ['Claim: Urban trees improve public health.', 'Which sentence from a report best supports the claim?', '"Neighbourhoods with more tree cover had 12 percent fewer asthma-related hospital visits."', ['"Trees are a beautiful addition to any street."', '"The city planted maples and oaks last year."', '"Some residents prefer flowers to trees."'], 'It provides measurable health evidence.'],
  ['Claim: The four-day school week can harm student achievement.', 'Which sentence best supports the claim?', '"A multi-district study found math scores rose more slowly in four-day schools."', ['"Many students enjoy a longer weekend."', '"Four-day weeks began in rural areas."', '"Teachers have mixed opinions."'], 'It directly ties the schedule to achievement data.'],
  ['Claim: Social media can spread misinformation quickly.', 'Which sentence best supports the claim?', '"Researchers found false stories reached 1,500 people about six times faster than true ones."', ['"Billions of people use social media."', '"Social media apps are free."', '"Some posts include photos."'], 'It gives evidence about the speed of false information.']
];

export const STRATEGY2_SPECS = [
  sk('XCeInf', 'Match causes and effects in informational texts', 'Text structure', G(3, 8), bank(CAUSE_EFFECT_INFO)),
  sk('XCcInf', 'Compare and contrast in informational texts', 'Text structure', G(2, 8), bank(COMPARE_INFO)),
  sk('XOrdI', 'Determine the order of events in informational texts', 'Text structure', G(3, 5), bank(ORDER_INFO)),
  sk('XTxSt', 'Identify text structures', 'Text structure', G(3, 8), bank(TEXT_STRUCTURE.map(([p, a, w, why]) => [p, 'Which text structure does the passage use?', a, w, why]))),
  sk('XTpEx', 'Choose topic sentences for expository paragraphs', 'Topic sentences', [2, 3], bank(TOPIC_EXPOSITORY.map(([p, a, w, why]) => [p, 'Which topic sentence best fits the paragraph?', a, w, why]))),
  sk('XWrPu', "Choose the text that matches the writer's purpose", "Writer's purpose", [2, 3], bank(WRITERS_PURPOSE.map(([q, a, w]) => [null, q, a, w, 'Think about what the writer wants the reader to do or feel.']))),
  sk('XFoSn', 'Complete the fact and opinion sentences', 'Opinion writing', [2], bank(FACT_OPINION_SENT.map(([q, a, w, why]) => [null, q, a, w, why]))),
  sk('XOpEx', 'Complete the opinion passage with an example', 'Opinion writing', [2, 3], bank(OPINION_EXAMPLE)),
  sk('XOpRs', 'Complete the opinion passage with a reason', 'Opinion writing', [2, 3], bank(OPINION_REASON)),
  sk('XOpTb', 'Complete the opinion-reason-example table', 'Opinion writing', [2, 3], bank(OPINION_TABLE)),
  sk('XSnPc', 'Choose the sensory details that match the picture', 'Descriptive details', [2], bank(SENSORY_PICS.map(([e, q, a, w]) => [`<span style="font-size:2.6rem">${e}</span>`, q, a, w, `${b(a)} describes that sense.`]))),
  sk('XDesc', 'Add descriptive details to sentences', 'Descriptive details', [2, 3], bank(DESCRIPTIVE.map(([q, a, w]) => [null, q, a, w, 'Descriptive details help the reader picture the scene.']))),
  sk('XPuMm', "Identify the author's purpose: mixed media", "Author's purpose", [3], bank(MIXED_MEDIA.map(([p, a, w]) => [p, "What is the author's main purpose?", a, w, `${b(a)}.`]))),
  sk('XMnTw', 'Combine main ideas from two texts', 'Main idea', [4, 5], bank(TWO_TEXTS)),
  sk('XThSs', 'Determine the themes of short stories', 'Theme', G(4, 8), bank(THEMES)),
  sk('XQtTh', 'Match the quotations with their themes', 'Theme', G(6, 9), bank(QUOTE_THEMES.map(([qt, a, w, why]) => [qt, 'Which theme best matches the quotation?', a, w, why]))),
  sk('XAuPv', "Determine the author's point of view", 'Point of view', G(6, 8), bank(AUTHOR_POV)),
  sk('XPvCc', 'Compare and contrast points of view', 'Point of view', [5], bank(POV_COMPARE)),
  sk('XFgCl', 'Classify figures of speech', 'Literary devices', G(6, 8), bank(FIG_CLASS.map(([s, a, w]) => [null, `Which figure of speech is used?<br><em>${s}</em>`, a, w, `This is ${b(a.toLowerCase())}.`]))),
  sk('XAlMn', 'Interpret the meaning of an allusion from its source', 'Literary devices', G(7, 12), bank(ALLUSIONS.map(([s, a, w, why]) => [s, 'What does the allusion suggest?', a, w, why]))),
  sk('XInfSd', 'Draw inferences and identify supporting details', 'Inference', G(3, 5), bank(INFER_SUPPORT)),
  sk('XChCc', 'Compare and contrast characters', 'Inference', [4, 5], bank(CHAR_COMPARE)),
  sk('XPlot', 'Analyze plot elements', 'Story elements', [4, 5], bank(PLOT.map(([q, a, w, why]) => [null, q, a, w, why]))),
  sk('XCmpG', 'Compare two texts with different genres', 'Comparing texts', G(6, 8), bank(GENRES)),
  sk('XSdLit', 'Identify supporting details in literary texts', 'Developing and supporting arguments', G(4, 8), bank(DETAILS_LIT)),
  sk('XSdInf', 'Identify supporting details in informational texts', 'Developing and supporting arguments', G(4, 8), bank(DETAILS_INFO)),
  sk('XSupEv', 'Identify supporting evidence in a text', 'Developing and supporting arguments', G(9, 12), bank(SUPPORT_EVIDENCE))
];
