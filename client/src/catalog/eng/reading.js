/* English — Reading Strategies and Writing Strategies for grades 1–5. */
import { classify, pairs, passageQs } from '../quiz.js';
import { pick, shuffle, sample, b, em, mc, big } from './words.js';

const sk = (k, t, s, g, gen) => ({ k, t, s, g, gen });

/* ---------- fables (paraphrased, public domain) ---------- */
const FABLES = [
  ['A hare laughed at a slow tortoise and challenged him to a race. The hare raced ahead, then took a nap. The tortoise kept walking steadily and crossed the finish line first.', 'Slow and steady wins the race.'],
  ['A shepherd boy shouted "Wolf!" to trick the villagers, and they came running. He did it again and again. When a real wolf came, nobody believed him.', 'People will not believe someone who often lies.'],
  ['All summer, the ants stored food while the grasshopper sang and played. When winter came, the ants had plenty to eat, but the grasshopper was hungry.', 'It is wise to prepare for the future.'],
  ['A lion let a tiny mouse go free. Later, the lion was caught in a hunter\'s net. The mouse chewed through the ropes and set the lion free.', 'Even small friends can be a big help.'],
  ['A fox tried again and again to reach some grapes hanging high on a vine. When he could not reach them, he walked away saying, "They were probably sour anyway."', 'People sometimes pretend not to want what they cannot have.'],
  ['A thirsty crow found a pitcher with only a little water at the bottom. She dropped pebbles in, one by one, until the water rose high enough to drink.', 'Clever thinking and patience can solve problems.'],
  ['A farmer\'s goose laid one golden egg each day. Wanting all the gold at once, he cut the goose open — and found nothing inside.', 'Being greedy can make you lose what you have.'],
  ['The Wind and the Sun argued about who was stronger. The Wind blew hard, but the traveller held his coat tighter. The Sun shone warmly, and the traveller took off his coat.', 'Kindness and gentleness work better than force.'],
  ['A dog carrying a bone saw his reflection in a river. Thinking it was another dog with a bigger bone, he barked — and his own bone fell into the water.', 'Being greedy can make you lose what you have.'],
  ['A town mouse visited his country cousin and laughed at the plain food. In the city, they ate fine food but were chased by cats. The country mouse went home happily.', 'A simple, safe life is better than a rich, fearful one.']
];
const THEMES = [...new Set(FABLES.map(f => f[1]))];

/* ---------- short passages ---------- */
const CHARACTER_PASSAGES = [
  ['Lily stomped her feet and crossed her arms. "It\'s not fair!" she shouted.', 'How does Lily feel?', 'angry', ['angry', 'sleepy', 'proud', 'calm']],
  ['Omar grinned from ear to ear and hugged his new puppy tightly.', 'How does Omar feel?', 'happy', ['happy', 'scared', 'bored', 'angry']],
  ['Ava\'s hands shook as she walked onto the stage. She whispered, "What if I forget my lines?"', 'How does Ava feel?', 'nervous', ['nervous', 'bored', 'angry', 'sleepy']],
  ['Ben yawned, rubbed his eyes and put his head on the desk.', 'How does Ben feel?', 'tired', ['tired', 'excited', 'angry', 'proud']],
  ['Zoe shared her lunch with a new student who had forgotten his.', 'What is Zoe like?', 'kind', ['kind', 'selfish', 'lazy', 'rude']],
  ['Noah practised the piano every day, even when it was hard, until he could play the whole song.', 'What is Noah like?', 'hard-working', ['hard-working', 'lazy', 'mean', 'shy']],
  ['Maya looked at the empty plate, then at the dog licking its lips. "Max!" she groaned.', 'What can you tell about Maya?', 'She thinks the dog ate the food.', ['She thinks the dog ate the food.', 'She is hungry for more.', 'She is proud of the dog.', 'She cooked the dog\'s dinner.']],
  ['Leo jumped up and down. "We\'re going to the beach! I can\'t wait!"', 'How does Leo feel?', 'excited', ['excited', 'sad', 'worried', 'tired']]
];
const PREDICT = [
  ['Dark clouds filled the sky. Thunder rumbled. Sam looked up and opened his umbrella.', 'What will most likely happen next?', 'It will rain.', ['It will rain.', 'It will snow candy.', 'The sun will get hotter.', 'Sam will go swimming.']],
  ['Mia put the cake batter in the pan and slid it into the hot oven.', 'What will most likely happen next?', 'The cake will bake.', ['The cake will bake.', 'The cake will melt.', 'Mia will plant a tree.', 'The oven will fly away.']],
  ['The puppy saw a squirrel and pulled hard on its leash.', 'What will most likely happen next?', 'The puppy will chase the squirrel.', ['The puppy will chase the squirrel.', 'The puppy will fall asleep.', 'The squirrel will bark.', 'The puppy will read a book.']],
  ['Ava stacked block after block. The tower wobbled more and more.', 'What will most likely happen next?', 'The tower will fall.', ['The tower will fall.', 'The tower will grow wings.', 'Ava will eat the blocks.', 'The blocks will turn to gold.']],
  ['Leo forgot his lunch at home. At noon, his stomach growled.', 'What will most likely happen next?', 'Leo will look for something to eat.', ['Leo will look for something to eat.', 'Leo will take a nap on the roof.', 'Leo will buy a car.', 'Leo will stop being hungry forever.']],
  ['The ice cream cone sat in the hot sun for a long time.', 'What will most likely happen next?', 'The ice cream will melt.', ['The ice cream will melt.', 'The ice cream will freeze harder.', 'The cone will turn into a flower.', 'The sun will go away.']]
];
const MAIN_IDEA_E = [
  ['Penguins cannot fly, but they are excellent swimmers. They use their wings like flippers and can dive deep to catch fish.', 'Penguins are strong swimmers even though they cannot fly.', ['Penguins live in hot places.', 'Fish are hard to catch.', 'Wings are only for flying.']],
  ['Bees help plants grow. As they visit flowers for nectar, pollen sticks to their bodies and is carried to other flowers.', 'Bees help flowers by carrying pollen.', ['Bees make loud noises.', 'Flowers are colourful.', 'Nectar is sweet.']],
  ['Recycling is easy. Rinse your bottles, flatten your boxes and put them in the blue bin. Every bit helps keep our planet clean.', 'Recycling is a simple way to help the planet.', ['Boxes are flat.', 'Bins are blue.', 'Bottles are made of glass.']],
  ['Owls hunt at night. Their big eyes see well in the dark, and their soft feathers let them fly silently.', 'Owls have special features for hunting at night.', ['Owls sleep all night.', 'Feathers are soft.', 'The dark is scary.']],
  ['Long ago, people wrote with feather pens dipped in ink. Later came pencils, then typewriters, and now computers.', 'Writing tools have changed over time.', ['Feathers make good pens.', 'Computers are fast.', 'Ink is messy.']],
  ['Drinking water keeps your body healthy. It helps you think clearly, keeps you cool, and gives you energy to play.', 'Water is important for your body.', ['Playing is fun.', 'Water is wet.', 'You should not think too much.']]
];
const SEQUENCES = [
  ['Ana got out of bed.', 'She brushed her teeth.', 'She ate breakfast.', 'She walked to school.'],
  ['We mixed the flour and eggs.', 'We poured the batter into a pan.', 'We baked the cake.', 'We ate a slice.'],
  ['The seed was planted in the soil.', 'A tiny sprout appeared.', 'The plant grew tall.', 'A flower bloomed.'],
  ['Leo put on his helmet.', 'He climbed onto his bike.', 'He pedalled down the street.', 'He parked the bike at the park.'],
  ['The caterpillar hatched from an egg.', 'It ate many leaves.', 'It made a chrysalis.', 'It came out as a butterfly.']
];

export const READING_E_SPECS = [
  /* ---------- Reading strategies (grade 1–2 picture skills) ---------- */
  sk('RlMk', 'Which could happen in real life?', 'Reality vs. fiction', [1], classify({
    categories: ['Could happen in real life', 'Make-believe'],
    prompt: s => `${em(s)}`,
    items: [['A dog chases a ball.', 'Could happen in real life'], ['A girl rides her bike to school.', 'Could happen in real life'], ['It snows in winter.', 'Could happen in real life'], ['A baby bird learns to fly.', 'Could happen in real life'], ['Dad bakes bread.', 'Could happen in real life'], ['A cat sleeps in the sun.', 'Could happen in real life'],
      ['A pig drives a bus.', 'Make-believe'], ['A dragon reads a book to the class.', 'Make-believe'], ['The moon eats a sandwich.', 'Make-believe'], ['A frog wears a crown and talks.', 'Make-believe'], ['A tree walks to the store.', 'Make-believe'], ['A teapot sings a song.', 'Make-believe']]
      .map(([s, c]) => [s, c, c === 'Make-believe' ? 'This could only happen in a story.' : 'This could really happen.'])
  })),
  sk('PcAb', 'What is the picture about?', 'Main idea', [1], pairs({
    prompt: e => `${big(e)}<br>What is the picture about?`,
    items: [['🏖️ ☀️ 🏊', 'a day at the beach'], ['🎂 🎈 🎁', 'a birthday party'], ['⛄ ❄️ 🧤', 'a snowy winter day'], ['🍎 🥕 🥦', 'healthy foods'], ['🚒 🔥 👩‍🚒', 'firefighters at work'], ['🐄 🐖 🐔', 'animals on a farm'], ['🌱 🌷 🌻', 'plants growing in a garden'], ['📚 ✏️ 🏫', 'going to school']]
      .map(([e, a]) => [e, a, `The pictures together show ${b(a)}.`])
  })),
  sk('FlPc', 'Which feeling matches the picture?', 'Inference and analysis', [1], pairs({
    prompt: e => `${big(e)}<br>Which feeling matches the picture?`,
    items: [['😀', 'happy'], ['😢', 'sad'], ['😠', 'angry'], ['😨', 'scared'], ['😴', 'sleepy'], ['😲', 'surprised'], ['🤢', 'sick'], ['😎', 'cool and confident']].map(([e, a]) => [e, a, `This face looks ${b(a)}.`])
  })),
  sk('WhAm', 'What am I?', 'Inference and analysis', [1, 2], pairs({
    prompt: q => `Read the riddle. What am I?<br>${em(q)}`,
    items: [
      ['I have four legs and a tail. I bark and wag my tail when I am happy.', 'a dog 🐶'], ['I am yellow and long. Monkeys love to eat me.', 'a banana 🍌'],
      ['I shine in the sky during the day. I keep you warm.', 'the sun ☀️'], ['I have pages and words. You read me.', 'a book 📖'],
      ['I am cold and white. I fall from the sky in winter.', 'snow ❄️'], ['I have wheels and pedals. You ride me.', 'a bike 🚲'],
      ['I hop and say "ribbit". I live near ponds.', 'a frog 🐸'], ['I have hands but cannot clap. I tell you the time.', 'a clock 🕰️']
    ].map(([q, a]) => [q, a, `The clues describe ${b(a)}.`])
  })),
  sk('ChAD', 'Use actions and dialogue to understand characters', 'Inference and analysis', [1, 2, 3, 4, 5], passageQs({
    title: 'Read the text.',
    items: CHARACTER_PASSAGES.map(([p, q, a, w]) => [p, q, a, w.filter(x => x !== a), 'The character\'s words and actions are clues.'])
  })),
  sk('Prdc', 'Make predictions about a story', 'Inference and analysis', [1, 2, 3, 4], passageQs({
    title: 'Read the text.',
    items: PREDICT.map(([p, q, a, w]) => [p, q, a, w.filter(x => x !== a), 'Use the clues in the text to predict.'])
  })),
  sk('FbTh', 'Determine the themes of myths, fables and folktales', 'Theme', [2, 3, 4, 5], () => {
    const [story, theme] = pick(FABLES);
    return mc(`<div class="passage"><small class="muted">Read the fable.</small><br>${story}</div><p style="margin-top:10px">What is the theme (lesson) of this fable?</p>`, theme, THEMES, `The lesson is: ${b(theme)}`);
  }),
  sk('MnIE', 'Determine the main idea of a passage', 'Main idea', [3, 4, 5, 6], passageQs({
    items: MAIN_IDEA_E.map(([p, a, w]) => [p, 'What is the main idea?', a, w, 'The main idea is what the whole passage is mostly about.'])
  })),
  sk('KyDt', 'Use key details to determine the main idea', 'Main idea', [3, 4, 5], pairs({
    prompt: q => `Read the details. What is the main idea?<br>${q}`,
    items: [
      ['• Frogs lay eggs in water.<br>• Tadpoles hatch from the eggs.<br>• Tadpoles grow legs and become frogs.', 'Frogs change as they grow.', '', ['Frogs change as they grow.', 'Frogs like water.', 'Tadpoles have tails.']],
      ['• Wear a helmet.<br>• Use hand signals.<br>• Ride on the right side of the road.', 'There are ways to stay safe on a bike.', '', ['There are ways to stay safe on a bike.', 'Helmets are colourful.', 'Roads are long.']],
      ['• Cats sleep up to 16 hours a day.<br>• They can jump six times their height.<br>• They use whiskers to feel their way.', 'Cats have many amazing abilities.', '', ['Cats have many amazing abilities.', 'Cats are lazy.', 'Whiskers are long.']],
      ['• The library has books.<br>• It lends movies.<br>• It hosts story time for kids.', 'The library offers many things.', '', ['The library offers many things.', 'Books are heavy.', 'Movies are fun.']],
      ['• Volcanoes can form islands.<br>• Lava cools into new rock.<br>• Ash makes soil rich.', 'Volcanoes change the land.', '', ['Volcanoes change the land.', 'Lava is hot.', 'Islands are in oceans.']]
    ].map(([q, a, , w]) => [q, a, 'The main idea ties all the details together.', w])
  })),
  sk('OrEv', 'Order events in a story', 'Sequence', [2, 3], () => {
    const seq = pick(SEQUENCES); const which = pick(['first', 'last']);
    const ans = which === 'first' ? seq[0] : seq[seq.length - 1];
    return mc(`<div class="passage">${shuffle(seq).map(s => '• ' + s).join('<br>')}</div><p style="margin-top:10px">Which event happened ${b(which)}?</p>`, ans, seq, `In order: ${seq.join(' → ')}`);
  }),
  sk('CsEf', 'Match causes and effects', 'Cause and effect', [2, 3, 4, 5], pairs({
    prompt: q => q,
    items: [
      ['Cause: <em>It rained all night.</em> What is the effect?', 'The ground was wet in the morning.'],
      ['Cause: <em>Mia forgot to water her plant.</em> What is the effect?', 'The plant wilted.'],
      ['Cause: <em>Leo studied hard for the test.</em> What is the effect?', 'Leo got a good grade.'],
      ['Cause: <em>The dog ate too much.</em> What is the effect?', 'The dog had a stomach ache.'],
      ['Cause: <em>The power went out.</em> What is the effect?', 'The lights turned off.'],
      ['Effect: <em>The ice cream melted.</em> What was the cause?', 'It was a hot day.'],
      ['Effect: <em>Sam was late for school.</em> What was the cause?', 'He missed the bus.'],
      ['Effect: <em>The kids cheered.</em> What was the cause?', 'Their team scored a goal.']
    ].map(([q, a]) => [q, a, 'A cause is why something happens; the effect is what happens.'])
  })),
  sk('PrSl', 'Match problems with their solutions', 'Text structure', [3, 4, 5], pairs({
    prompt: q => `Problem: ${em(q)}<br>What is the best solution?`,
    items: [
      ['The classroom is too noisy to read.', 'Use quiet voices during reading time.'], ['The garden plants are drying out.', 'Water the plants every morning.'],
      ['The park is full of litter.', 'Organize a clean-up day.'], ['Students forget their homework.', 'Write assignments in a planner.'],
      ['The bike tire is flat.', 'Pump air into the tire or patch it.'], ['The dog is bored and chews shoes.', 'Take the dog for more walks and give it toys.'],
      ['The town has too much traffic.', 'Add more buses and bike lanes.'], ['A puppy is lost.', 'Put up posters and check with the animal shelter.']
    ].map(([q, a]) => [q, a, 'The solution fixes the problem.'])
  })),
  sk('SnDt', 'Sort sensory details', 'Sensory details', [3, 4, 5], classify({
    categories: ['Sight', 'Sound', 'Smell', 'Taste', 'Touch'],
    prompt: s => `Which sense does this detail describe?<br>${em(s)}`,
    items: [['the bright orange sunset', 'Sight'], ['a rainbow of balloons', 'Sight'], ['the crunch of leaves underfoot', 'Sound'], ['the buzz of a bee', 'Sound'],
      ['the scent of fresh bread', 'Smell'], ['the stink of old socks', 'Smell'], ['the sour lemon on my tongue', 'Taste'], ['the salty popcorn', 'Taste'],
      ['the scratchy wool sweater', 'Touch'], ['the cold, smooth ice', 'Touch'], ['the roar of the waterfall', 'Sound'], ['the sweet, sticky honey', 'Taste']]
      .map(([s, c]) => [s, c, `This detail appeals to ${c.toLowerCase()}.`])
  })),
  sk('SmMn', 'Determine the meanings of similes', 'Literary devices', [3, 4, 5], pairs({
    prompt: s => `What does the simile mean?<br>${em(s)}`,
    items: [
      ['Sam is as busy as a bee.', 'Sam is very busy.'], ['The baby\'s skin was as soft as silk.', 'The baby\'s skin was very soft.'], ['Mia ran like the wind.', 'Mia ran very fast.'],
      ['The snow was like a white blanket.', 'The snow covered everything.'], ['He is as brave as a lion.', 'He is very brave.'], ['The room was as quiet as a mouse.', 'The room was very quiet.'],
      ['Her eyes sparkled like diamonds.', 'Her eyes were shiny and bright.'], ['The water was as cold as ice.', 'The water was very cold.']
    ].map(([s, a]) => [s, a, 'A simile compares two things using "like" or "as".'])
  })),
  sk('SmMt', 'Identify similes and metaphors', 'Literary devices', [5], classify({
    categories: ['Simile', 'Metaphor'],
    prompt: s => `Is this a simile or a metaphor?<br>${em(s)}`,
    items: [['The stars were diamonds in the sky.', 'Metaphor'], ['The stars shone like diamonds.', 'Simile'], ['My brother is a couch potato.', 'Metaphor'], ['He eats like a pig.', 'Simile'],
      ['The classroom was a zoo.', 'Metaphor'], ['She is as sweet as candy.', 'Simile'], ['Life is a highway.', 'Metaphor'], ['The pillow was as soft as a cloud.', 'Simile']]
      .map(([s, c]) => [s, c, c === 'Simile' ? 'It compares using "like" or "as".' : 'It says one thing is another.'])
  })),
  sk('PvDs', 'Distinguish points of view', 'Point of view', [3, 4, 5], classify({
    categories: ['First person', 'Third person'],
    prompt: s => `What point of view is used?<br>${em(s)}`,
    items: [['I ran to the park with my dog.', 'First person'], ['We baked cookies for our neighbours.', 'First person'], ['My heart pounded as I opened the door.', 'First person'], ['I could not believe my eyes!', 'First person'],
      ['She ran to the park with her dog.', 'Third person'], ['They baked cookies for their neighbours.', 'Third person'], ['His heart pounded as he opened the door.', 'Third person'], ['The fox crept toward the henhouse.', 'Third person']]
      .map(([s, c]) => [s, c, c === 'First person' ? 'The narrator uses I, me, my or we.' : 'The narrator uses he, she, they or names.'])
  })),
  sk('InfE', 'Draw inferences from a text', 'Inference and analysis', [3, 4, 5], passageQs({
    title: 'Read the text.',
    items: [
      ['Grandpa put on his thick coat, wrapped a scarf around his neck and pulled on his boots before stepping outside.', 'What can you infer?', 'It is cold outside.', ['It is hot outside.', 'Grandpa is going swimming.', 'It is night time.'], 'Warm clothes are a clue.'],
      ['The crowd groaned as the ball sailed over the goalpost and the clock ran out.', 'What can you infer?', 'The team missed the winning kick.', ['The team scored and won.', 'The game was just starting.', 'The crowd was asleep.'], 'Groans and the clock are clues.'],
      ['Mom found muddy paw prints on the clean kitchen floor and a half-eaten sandwich on the rug.', 'What can you infer?', 'The dog took the sandwich.', ['Mom ate the sandwich.', 'It rained inside.', 'A bird cleaned the floor.'], 'Paw prints are a clue.'],
      ['Maya held her report card and danced around the room, waving it in the air.', 'What can you infer?', 'Maya got good grades.', ['Maya lost her report card.', 'Maya is sad.', 'Maya has a sore foot.'], 'Dancing shows happiness.'],
      ['The streets were wet, puddles filled the sidewalk, and people were closing their umbrellas.', 'What can you infer?', 'It just stopped raining.', ['It is snowing.', 'It has not rained in weeks.', 'It is about to start raining.'], 'Closing umbrellas suggests the rain ended.']
    ]
  })),
  sk('PrpE', 'Identify the purpose of a text', 'Audience, purpose and tone', [2, 3, 4, 5], classify({
    categories: ['To inform', 'To persuade', 'To entertain'],
    prompt: s => `Why did the author write this?<br>${em(s)}`,
    items: [['Sharks have been on Earth for over 400 million years.', 'To inform'], ['A panda has a thumb-like bone to hold bamboo.', 'To inform'], ['The Moon goes around Earth about once a month.', 'To inform'],
      ['You should join the reading club — it is the best club in school!', 'To persuade'], ['Buy fresh lemonade at our stand. It is the tastiest in town!', 'To persuade'], ['Everyone should wear a helmet when biking.', 'To persuade'],
      ['The silly goat tried to dance but tripped over his own beard.', 'To entertain'], ['Once upon a time, a dragon was afraid of the dark.', 'To entertain'], ['The penguin put on sunglasses and went surfing.', 'To entertain']]
      .map(([s, c]) => [s, c, { 'To inform': 'It gives facts.', 'To persuade': 'It tries to convince you.', 'To entertain': 'It tells a fun story.' }[c]])
  })),
  sk('StEl', 'Identify story elements', 'Story elements', [3, 4, 5], classify({
    categories: ['Character', 'Setting', 'Plot event'],
    prompt: s => `In a story, what is this?<br>${em(s)}`,
    items: [['a brave girl named Rosa', 'Character'], ['a talking owl who gives advice', 'Character'], ['the grumpy old king', 'Character'],
      ['a dark forest at midnight', 'Setting'], ['a busy city in the year 3000', 'Setting'], ['a small farm in the summer', 'Setting'],
      ['Rosa finds a hidden map.', 'Plot event'], ['The bridge collapses during the storm.', 'Plot event'], ['The friends finally find the treasure.', 'Plot event']]
      .map(([s, c]) => [s, c, { Character: 'A character is a person or animal in the story.', Setting: 'The setting is where and when the story happens.', 'Plot event': 'A plot event is something that happens.' }[c]])
  })),

  /* ---------- Writing strategies ---------- */
  sk('SnOr', 'Put the sentences in order', 'Organizing writing', [2, 3, 4, 5], () => {
    const seq = pick(SEQUENCES); const labels = ['A', 'B', 'C', 'D'];
    const shuffled = shuffle(seq);
    const ans = seq.map(s => labels[shuffled.indexOf(s)]).join(', ');
    const wrong = new Set();
    while (wrong.size < 3) { const w = shuffle(labels).join(', '); if (w !== ans) wrong.add(w); }
    return mc(`<div class="passage">${shuffled.map((s, i) => `${b(labels[i])}. ${s}`).join('<br>')}</div><p style="margin-top:10px">What is the correct order?</p>`, ans, [...wrong], `The order is ${b(ans)}: ${seq.join(' → ')}`);
  }),
  sk('TmId', 'Identify time-order words', 'Linking words', [1, 2, 3, 4], pairs({
    prompt: s => `Which word is a time-order word?<br>${em(s)}`,
    items: [['First, we packed our bags.', 'First'], ['Next, we drove to the lake.', 'Next'], ['Then we set up the tent.', 'Then'], ['Finally, we roasted marshmallows.', 'Finally'],
      ['After lunch, we went hiking.', 'After'], ['Before bed, I brush my teeth.', 'Before'], ['Later, we watched a movie.', 'Later'], ['Last, put the cherry on top.', 'Last']]
      .map(([s, a]) => [s, a, `${b(a)} tells when something happens.`, [a, ...s.replace(/[.,]/g, '').split(' ').filter(w => w !== a && w.length > 2).slice(0, 3)]])
  })),
  sk('TmUs', 'Use time-order words', 'Linking words', [2, 3], () => {
    const seq = pick(SEQUENCES); const pos = pick([0, 3]);
    const word = pos === 0 ? 'First' : 'Finally';
    return mc(`Which time-order word best begins this sentence?<br>${em(`___, ${seq[pos][0].toLowerCase() + seq[pos].slice(1)}`)}`, word, ['First', 'Finally', 'Next', 'Before'].filter(w => w !== word).concat(word), `This is the ${pos === 0 ? 'first' : 'last'} step, so use ${b(word)}.`);
  }),
  sk('SbCj', 'Use subordinating conjunctions', 'Linking words', [2, 3, 4, 5], pairs({
    prompt: s => `Choose the best word to complete the sentence.<br>${em(s)}`,
    items: [['We stayed inside ___ it was raining.', 'because'], ['___ it was cold, we went swimming.', 'Although'], ['I will call you ___ I get home.', 'when'], ['You can play ___ you finish your homework.', 'after'],
      ['We can go to the park ___ it stops raining.', 'if'], ['Wait here ___ I come back.', 'until'], ['___ the bell rang, everyone lined up.', 'When'], ['She smiled ___ she was nervous.', 'although']]
      .map(([s, a]) => [s, a, `${b(a)} connects the two ideas correctly.`, [a, ...['because', 'although', 'when', 'until', 'if', 'after'].filter(x => x !== a.toLowerCase()).map(x => /^[A-Z]/.test(a) ? x[0].toUpperCase() + x.slice(1) : x).slice(0, 3)]])
  })),
  sk('TrBs', 'Choose the best transition', 'Linking words', [3, 4, 5], pairs({
    prompt: s => `Choose the best transition.<br>${em(s)}`,
    items: [['I love fruit. ___, apples and pears are my favourites.', 'For example'], ['It was raining. ___, the game was cancelled.', 'As a result'], ['Cats are cuddly. ___, they can be independent.', 'However'],
      ['Exercise keeps you strong. ___, it helps you sleep.', 'Also'], ['First, mix the paint. ___, dip your brush.', 'Next'], ['Dogs need walks. ___, cats can use a litter box.', 'On the other hand']]
      .map(([s, a]) => [s, a, `${b(a)} shows how the ideas connect.`, [a, 'For example', 'As a result', 'However', 'Also', 'Next']])
  })),
  sk('TpSE', 'Choose the best topic sentence', 'Topic sentences', [2, 3, 4, 5], pairs({
    prompt: q => `Which topic sentence best fits this paragraph?<br><div class="passage">${q}</div>`,
    items: [
      ['… They have strong legs for jumping. Their sticky tongues catch flies. Their skin helps them breathe underwater.', 'Frogs have bodies that help them survive.', ['Frogs have bodies that help them survive.', 'Flies are annoying.', 'I like to swim.']],
      ['… First we visited the aquarium. Then we ate pizza by the water. At night we watched fireworks.', 'Our trip to the city was full of fun.', ['Our trip to the city was full of fun.', 'Pizza is my favourite food.', 'Fireworks are loud.']],
      ['… Recess lets us run and play. It gives our brains a break. We come back ready to learn.', 'Recess is important for students.', ['Recess is important for students.', 'Running is fast.', 'Brains are in our heads.']],
      ['… Mix flour, sugar and eggs. Pour the batter into a pan. Bake it for thirty minutes.', 'Making a cake is easy if you follow these steps.', ['Making a cake is easy if you follow these steps.', 'Eggs come from chickens.', 'Ovens are hot.']],
      ['… Snakes smell with their tongues. They feel vibrations through the ground. Some can even sense heat from their prey.', 'Snakes have special ways of sensing the world.', ['Snakes have special ways of sensing the world.', 'Snakes are long.', 'Heat comes from the sun.']],
      ['… On Saturday we cleaned the beach. We picked up bottles and bags. By noon, the sand was spotless.', 'Our beach clean-up made a big difference.', ['Our beach clean-up made a big difference.', 'Sand is made of rock.', 'Bottles are made of glass.']],
      ['… Wear a warm coat. Put on mittens and a hat. Stay dry so you do not get chilled.', 'There are several ways to stay warm in winter.', ['There are several ways to stay warm in winter.', 'Hats come in many colours.', 'Winter has short days.']]
    ].map(([q, a, w]) => [q, a, 'The topic sentence tells what the whole paragraph is about.', w])
  })),
  sk('ClSE', 'Choose the best concluding sentence', 'Topic sentences', [4, 5], pairs({
    prompt: q => `Which concluding sentence best ends this paragraph?<br><div class="passage">${q}</div>`,
    items: [
      ['Dogs make wonderful pets. They are loyal and loving. They keep you active with walks. …', 'For all these reasons, a dog can be a great friend.', ['For all these reasons, a dog can be a great friend.', 'Cats like to climb.', 'Some dogs are brown.']],
      ['Our class garden was a huge project. We planted seeds, watered them daily and pulled weeds. …', 'In the end, our hard work gave us a beautiful garden.', ['In the end, our hard work gave us a beautiful garden.', 'Weeds are plants.', 'Seeds are small.']],
      ['Reading every day helps you learn new words. It improves your imagination. It is also relaxing. …', 'That is why reading every day is a great habit.', ['That is why reading every day is a great habit.', 'Some books are long.', 'Libraries close at night.']],
      ['Bicycles are a great way to travel. They do not pollute the air. Riding one is good exercise. …', 'Clearly, biking is good for you and for the planet.', ['Clearly, biking is good for you and for the planet.', 'Bikes have two wheels.', 'Some bikes are red.']],
      ['Our field trip to the farm was amazing. We milked a cow, fed the goats and picked apples. …', 'It was a day on the farm we will never forget.', ['It was a day on the farm we will never forget.', 'Cows say moo.', 'Apples grow on trees.']],
      ['Volunteering helps people in need. It also makes volunteers feel good. It builds stronger neighbourhoods. …', 'Volunteering truly helps everyone involved.', ['Volunteering truly helps everyone involved.', 'Some volunteers are young.', 'Neighbourhoods have streets.']]
    ].map(([q, a, w]) => [q, a, 'A concluding sentence wraps up the main idea.', w])
  })),
  sk('OpSt', 'Identify an author\'s statement of opinion', 'Opinion writing', [3, 4, 5], pairs({
    prompt: () => 'Which sentence states an opinion?',
    items: [
      ['', 'Summer is the best season of the year.', 'It is a personal belief.', ['Summer is the best season of the year.', 'Summer comes after spring.', 'Days are longer in summer.', 'Many schools close in summer.']],
      ['', 'Soccer is more fun than basketball.', 'It cannot be proven.', ['Soccer is more fun than basketball.', 'A soccer team has eleven players.', 'Basketball uses a hoop.', 'Both sports use a ball.']],
      ['', 'Everyone should try painting.', '"Should" shows an opinion.', ['Everyone should try painting.', 'Paint can be mixed to make new colours.', 'Brushes come in many sizes.', 'Some paints are water-based.']],
      ['', 'Our town has the prettiest park in the country.', '"Prettiest" is a judgment.', ['Our town has the prettiest park in the country.', 'The park has a pond.', 'The park opens at 7 a.m.', 'The park was built in 1950.']],
      ['', 'Pizza is the most delicious food ever made.', '"Most delicious" is a personal judgment.', ['Pizza is the most delicious food ever made.', 'Pizza is baked in an oven.', 'Pizza often has cheese on it.', 'Pizza was first made in Italy.']],
      ['', 'Homework on weekends is unfair.', '"Unfair" shows a feeling.', ['Homework on weekends is unfair.', 'Some teachers give weekend homework.', 'Weekends are Saturday and Sunday.', 'Homework can take an hour.']],
      ['', 'Spiders are the creepiest animals.', '"Creepiest" is a feeling, not a fact.', ['Spiders are the creepiest animals.', 'Spiders have eight legs.', 'Many spiders spin webs.', 'Spiders eat insects.']]
    ]
  })),
  sk('OpRs', 'Choose reasons to support an opinion', 'Opinion writing', [3, 4, 5], pairs({
    prompt: q => `Opinion: ${em(q)}<br>Which reason best supports this opinion?`,
    items: [
      ['Our school should have a longer recess.', 'Playing outside helps students focus in class.', ['Playing outside helps students focus in class.', 'Recess happens at noon.', 'Some students like math.']],
      ['Everyone should learn to swim.', 'Swimming can keep you safe near water.', ['Swimming can keep you safe near water.', 'Pools are blue.', 'Swimsuits come in many colours.']],
      ['Dogs are great pets.', 'Dogs are loyal and love to play.', ['Dogs are loyal and love to play.', 'Dogs have four legs.', 'Some dogs are small.']],
      ['Kids should eat more vegetables.', 'Vegetables have vitamins that keep you healthy.', ['Vegetables have vitamins that keep you healthy.', 'Carrots are orange.', 'Vegetables grow in gardens.']],
      ['Our town needs a new library.', 'The old library is too small for all the people who use it.', ['The old library is too small for all the people who use it.', 'Libraries have books.', 'Our town has a mayor.']],
      ['Students should learn to cook.', 'Cooking helps you make healthy meals for yourself.', ['Cooking helps you make healthy meals for yourself.', 'Kitchens have ovens.', 'Some foods are sweet.']],
      ['Kids should play outside every day.', 'Fresh air and exercise keep kids healthy.', ['Fresh air and exercise keep kids healthy.', 'The sky is blue.', 'Parks have benches.']]
    ].map(([q, a, w]) => [q, a, 'A good reason explains why the opinion makes sense.', w])
  })),
  sk('StVb', 'Revise the sentence using a stronger verb', 'Descriptive details', [2, 3, 4, 5], pairs({
    prompt: s => `Which verb is stronger than the underlined verb?<br>${s}`,
    items: [['The lion <u>went</u> across the field.', 'prowled', ['prowled', 'was', 'had', 'did']], ['She <u>said</u>, "Help!"', 'shrieked', ['shrieked', 'told', 'had', 'did']],
      ['He <u>ate</u> the pizza.', 'devoured', ['devoured', 'had', 'got', 'did']], ['The door <u>closed</u>.', 'slammed', ['slammed', 'was', 'went', 'did']],
      ['The kids <u>ran</u> into the pool.', 'dashed', ['dashed', 'were', 'got', 'did']], ['The baby <u>cried</u>.', 'wailed', ['wailed', 'was', 'had', 'did']],
      ['The cat <u>looked</u> at the bird.', 'stared', ['stared', 'saw', 'was', 'did']], ['The wind <u>moved</u> the trees.', 'shook', ['shook', 'had', 'was', 'got']]]
      .map(([s, a, w]) => [s, a, `${b(a)} paints a clearer picture.`, w])
  })),
  sk('ShEm', 'Show character emotions and traits', 'Descriptive details', [3, 4, 5], pairs({
    prompt: q => `Which sentence best ${q}`,
    items: [['shows that Ava is nervous?', 'Ava chewed her pencil and tapped her foot as the test began.', ['Ava chewed her pencil and tapped her foot as the test began.', 'Ava was nervous.', 'Ava took a test.', 'Ava has a pencil.']],
      ['shows that Leo is generous?', 'Leo split his allowance with his little sister.', ['Leo split his allowance with his little sister.', 'Leo is generous.', 'Leo has a sister.', 'Leo gets an allowance.']],
      ['shows that the puppy is excited?', 'The puppy wiggled, yipped and spun in circles by the door.', ['The puppy wiggled, yipped and spun in circles by the door.', 'The puppy was excited.', 'The puppy is brown.', 'The puppy has a door.']],
      ['shows that Grandma is tired?', 'Grandma yawned and sank slowly into her armchair.', ['Grandma yawned and sank slowly into her armchair.', 'Grandma was tired.', 'Grandma has a chair.', 'Grandma is old.']],
      ['shows that Omar is proud?', 'Omar held up his trophy and grinned at everyone in the room.', ['Omar held up his trophy and grinned at everyone in the room.', 'Omar was proud.', 'Omar has a trophy.', 'Omar is in a room.']],
      ['shows that Zoe is scared?', 'Zoe froze, her heart pounding, as the floorboards creaked behind her.', ['Zoe froze, her heart pounding, as the floorboards creaked behind her.', 'Zoe was scared.', 'Zoe has a house.', 'The floor is wooden.']],
      ['shows that Ben is curious?', 'Ben pressed his nose to the glass and asked question after question about the fish.', ['Ben pressed his nose to the glass and asked question after question about the fish.', 'Ben was curious.', 'Ben likes fish.', 'The tank is glass.']]]
      .map(([q, a, w]) => [q, a, 'Showing uses actions instead of just naming the feeling.', w])
  })),
  sk('RmSn', 'Remove the sentence that does not belong', 'Organizing writing', [4, 5], pairs({
    prompt: q => `Which sentence does not belong in the paragraph?<br><div class="passage">${q}</div>`,
    items: [
      ['Whales are huge sea mammals. They breathe air through blowholes. My cousin has a red bike. Baby whales drink their mothers\' milk.', 'My cousin has a red bike.', ['My cousin has a red bike.', 'They breathe air through blowholes.', 'Whales are huge sea mammals.', 'Baby whales drink their mothers\' milk.']],
      ['Our class went to the science museum. We saw a dinosaur skeleton. Pizza is my favourite food. We also visited the space room.', 'Pizza is my favourite food.', ['Pizza is my favourite food.', 'We saw a dinosaur skeleton.', 'We also visited the space room.', 'Our class went to the science museum.']],
      ['To plant a seed, dig a small hole. Drop the seed in. My dog likes to play fetch. Cover it with soil and water it.', 'My dog likes to play fetch.', ['My dog likes to play fetch.', 'Drop the seed in.', 'Cover it with soil and water it.', 'To plant a seed, dig a small hole.']],
      ['Bats are amazing animals. They use sound to find food in the dark. Bananas are a yellow fruit. Some bats eat thousands of insects each night.', 'Bananas are a yellow fruit.', ['Bananas are a yellow fruit.', 'They use sound to find food in the dark.', 'Bats are amazing animals.', 'Some bats eat thousands of insects each night.']],
      ['Winter can be a lot of fun. You can build a snowman or go sledding. I got a new pair of sandals. Skating on a frozen pond is exciting too.', 'I got a new pair of sandals.', ['I got a new pair of sandals.', 'You can build a snowman or go sledding.', 'Skating on a frozen pond is exciting too.', 'Winter can be a lot of fun.']],
      ['Our class pet is a hamster named Pip. Pip runs on his wheel all night. My uncle drives a truck. We take turns feeding Pip.', 'My uncle drives a truck.', ['My uncle drives a truck.', 'Pip runs on his wheel all night.', 'We take turns feeding Pip.', 'Our class pet is a hamster named Pip.']]
    ].map(([q, a, w]) => [q, a, 'Every sentence in a paragraph should support the main idea.', w])
  }))
];
