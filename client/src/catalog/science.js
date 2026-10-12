/* ============================================================
   MathAce — Science, grades 1–5.
   Start-simple catalog: life, earth and physical science.
   IDs are prefixed "sci".
   ============================================================ */
import { S, classify, pairs } from './quiz.js';

const b = w => `<strong>${w}</strong>`;

export const SCIENCE_SKILLS = [
  /* ================= GRADE 1 ================= */
  S('sciANI1', 'Animal groups', 1, 'Life science', '🐾', classify({
    categories: ['Mammal', 'Bird', 'Fish', 'Reptile', 'Insect'],
    prompt: a => `Which group does a ${b(a)} belong to?`,
    items: [
      ['cow', 'Mammal', 'Mammals have fur or hair and feed their babies milk.'],
      ['eagle', 'Bird', 'Birds have feathers and wings and lay eggs.'],
      ['salmon', 'Fish', 'Fish live in water and breathe with gills.'],
      ['snake', 'Reptile', 'Reptiles have dry, scaly skin.'],
      ['ant', 'Insect', 'Insects have six legs and three body parts.'],
      ['whale', 'Mammal', 'Whales live in water but breathe air and feed milk to their babies — they are mammals!'],
      ['penguin', 'Bird', 'Penguins cannot fly, but they have feathers and lay eggs — they are birds.'],
      ['turtle', 'Reptile', 'Turtles have scaly skin and lay eggs — they are reptiles.'],
      ['butterfly', 'Insect', 'Butterflies have six legs and three body parts.'],
      ['shark', 'Fish', 'Sharks breathe with gills — they are fish.'],
      ['bat', 'Mammal', 'Bats fly, but they have fur and feed their babies milk — they are mammals.'],
      ['lizard', 'Reptile', 'Lizards have scaly skin — they are reptiles.'],
      ['owl', 'Bird', 'Owls have feathers and wings — they are birds.'],
      ['bee', 'Insect', 'Bees have six legs and three body parts.'],
      ['dolphin', 'Mammal', 'Dolphins breathe air and feed their babies milk — they are mammals.'],
      ['goldfish', 'Fish', 'Goldfish breathe with gills — they are fish.']
    ]
  })),
  S('sciPLT1', 'Parts of a plant', 1, 'Life science', '🌱', pairs({
    items: [
      ['Which part of a plant takes in water from the soil?', 'Roots', 'Roots drink up water and hold the plant in place.'],
      ['Which part of a plant makes food using sunlight?', 'Leaves', 'Leaves use sunlight to make food for the plant.'],
      ['Which part of a plant holds it up and carries water?', 'Stem', 'The stem holds the plant up and carries water to the leaves.'],
      ['Which part of a plant makes seeds?', 'Flower', 'Flowers make the seeds that grow into new plants.'],
      ['Which part of a plant can grow into a new plant?', 'Seed', 'A seed holds a baby plant inside.'],
      ['Which part of a plant is usually underground?', 'Roots', 'Roots grow down into the soil.'],
      ['Which part of a plant is usually green and flat?', 'Leaves', 'Leaves are green because they hold chlorophyll.'],
      ['Which part of a plant has colourful petals?', 'Flower', 'Petals are part of the flower.']
    ]
  })),
  S('sciSNS1', 'The five senses', 1, 'Human body', '👀', classify({
    categories: ['Sight', 'Hearing', 'Smell', 'Taste', 'Touch'],
    prompt: s => `Which sense do you use?<br><em>${s}</em>`,
    items: [
      ['Looking at a rainbow', 'Sight', 'You see with your eyes.'],
      ['Listening to a bird sing', 'Hearing', 'You hear with your ears.'],
      ['Smelling fresh bread', 'Smell', 'You smell with your nose.'],
      ['Tasting ice cream', 'Taste', 'You taste with your tongue.'],
      ['Feeling a soft blanket', 'Touch', 'You feel with your skin.'],
      ['Hearing a drum', 'Hearing', 'You hear with your ears.'],
      ['Watching a movie', 'Sight', 'You see with your eyes.'],
      ['Sniffing a flower', 'Smell', 'You smell with your nose.'],
      ['Feeling something hot', 'Touch', 'You feel with your skin.'],
      ['Tasting a sour lemon', 'Taste', 'You taste with your tongue.']
    ]
  })),
  S('sciWTH1', 'Weather', 1, 'Earth science', '⛅', classify({
    categories: ['Sunny', 'Rainy', 'Snowy', 'Windy'],
    prompt: s => `What is the weather like?<br><em>${s}</em>`,
    items: [
      ['Kites fly high in the sky.', 'Windy'],
      ['You need an umbrella and rain boots.', 'Rainy'],
      ['You can build a snowman.', 'Snowy'],
      ['You wear sunglasses and sunscreen.', 'Sunny'],
      ['There are puddles on the ground.', 'Rainy'],
      ['Snowflakes fall from the clouds.', 'Snowy'],
      ['Leaves blow across the yard.', 'Windy'],
      ['The sky is clear and bright.', 'Sunny']
    ].map(([s, a]) => [s, a, `Those clues tell us it is <strong>${a.toLowerCase()}</strong>.`])
  })),

  /* ================= GRADE 2 ================= */
  S('sciHAB2', 'Animal habitats', 2, 'Life science', '🏜️', classify({
    categories: ['Ocean', 'Desert', 'Forest', 'Polar region'],
    prompt: a => `Where does a ${b(a)} live?`,
    items: [
      ['camel', 'Desert', 'Camels store fat in their humps and can go a long time without water.'],
      ['polar bear', 'Polar region', 'Polar bears have thick fur and fat to stay warm in the cold.'],
      ['clownfish', 'Ocean', 'Clownfish live in warm ocean reefs.'],
      ['deer', 'Forest', 'Deer live in forests where they find food and cover.'],
      ['penguin', 'Polar region', 'Penguins live in the cold polar south.'],
      ['cactus', 'Desert', 'Cacti store water, which helps them live in the desert.'],
      ['whale', 'Ocean', 'Whales live in the ocean.'],
      ['owl', 'Forest', 'Many owls live in forests and nest in trees.'],
      ['seal', 'Polar region', 'Seals have thick blubber to stay warm in icy water.'],
      ['scorpion', 'Desert', 'Scorpions are built for hot, dry places.']
    ]
  })),
  S('sciMAT2', 'Solid, liquid or gas?', 2, 'Physical science', '🧊', classify({
    categories: ['Solid', 'Liquid', 'Gas'],
    prompt: m => `Is ${b(m)} a solid, a liquid or a gas?`,
    items: [
      ['a rock', 'Solid', 'A solid keeps its own shape.'],
      ['milk', 'Liquid', 'A liquid flows and takes the shape of its container.'],
      ['steam', 'Gas', 'Steam is water as a gas.'],
      ['an ice cube', 'Solid', 'Ice is frozen water, a solid.'],
      ['orange juice', 'Liquid', 'A liquid flows and takes the shape of its container.'],
      ['the air in a balloon', 'Gas', 'A gas spreads out to fill the space it is in.'],
      ['a pencil', 'Solid', 'A solid keeps its own shape.'],
      ['rain', 'Liquid', 'Rain is liquid water.'],
      ['helium', 'Gas', 'Helium is the gas that makes balloons float.'],
      ['honey', 'Liquid', 'Honey is thick, but it still flows — it is a liquid.'],
      ['a wooden chair', 'Solid', 'A solid keeps its own shape.'],
      ['oxygen', 'Gas', 'Oxygen is a gas in the air we breathe.']
    ]
  })),
  S('sciLIF2', 'Life cycles', 2, 'Life science', '🐛', pairs({
    items: [
      ['A butterfly starts its life as an ___.', 'egg', 'Butterflies hatch from eggs.'],
      ['A caterpillar turns into a ___ before it becomes a butterfly.', 'chrysalis', 'Inside the chrysalis the caterpillar changes into a butterfly.'],
      ['A tadpole grows into a ___.', 'frog', 'Tadpoles lose their tails and grow legs to become frogs.'],
      ['A frog starts life as an egg, then becomes a ___.', 'tadpole', 'Frog eggs hatch into tadpoles.'],
      ['A chick hatches from an ___.', 'egg', 'Birds hatch from eggs.'],
      ['A seed grows into a small ___.', 'seedling', 'A seedling is a baby plant.'],
      ['A puppy grows up to be a ___.', 'dog', 'Puppies grow into adult dogs.'],
      ['A kitten grows up to be a ___.', 'cat', 'Kittens grow into adult cats.']
    ]
  })),
  S('sciMAG2', 'Magnets', 2, 'Physical science', '🧲', classify({
    categories: ['Attracted to a magnet', 'Not attracted'],
    prompt: o => `Will a magnet stick to ${b(o)}?`,
    items: [
      ['an iron nail', 'Attracted to a magnet', 'Iron is a magnetic metal.'],
      ['a steel paper clip', 'Attracted to a magnet', 'Steel contains iron, so magnets attract it.'],
      ['a plastic spoon', 'Not attracted', 'Plastic is not magnetic.'],
      ['a wooden pencil', 'Not attracted', 'Wood is not magnetic.'],
      ['a steel screw', 'Attracted to a magnet', 'Steel contains iron, so magnets attract it.'],
      ['aluminum foil', 'Not attracted', 'Aluminum is a metal, but it is not magnetic.'],
      ['a rubber band', 'Not attracted', 'Rubber is not magnetic.'],
      ['a glass marble', 'Not attracted', 'Glass is not magnetic.'],
      ['an iron frying pan', 'Attracted to a magnet', 'Iron is a magnetic metal.'],
      ['a cotton ball', 'Not attracted', 'Cotton is not magnetic.']
    ]
  })),

  /* ================= GRADE 3 ================= */
  S('sciFCH3', 'Food chains', 3, 'Life science', '🦊', classify({
    categories: ['Producer', 'Consumer', 'Decomposer'],
    prompt: o => `In a food chain, a ${b(o)} is a …`,
    items: [
      ['blade of grass', 'Producer', 'Producers, like plants, make their own food from sunlight.'],
      ['rabbit', 'Consumer', 'Consumers eat plants or other animals.'],
      ['mushroom', 'Decomposer', 'Decomposers break down dead plants and animals.'],
      ['oak tree', 'Producer', 'Producers, like plants, make their own food from sunlight.'],
      ['hawk', 'Consumer', 'Consumers eat plants or other animals.'],
      ['bread mold', 'Decomposer', 'Mold is a fungus that breaks down dead material.'],
      ['seaweed', 'Producer', 'Seaweed makes its own food from sunlight.'],
      ['fox', 'Consumer', 'Consumers eat plants or other animals.'],
      ['sunflower', 'Producer', 'Producers, like plants, make their own food from sunlight.'],
      ['deer', 'Consumer', 'Deer eat plants, so they are consumers.']
    ]
  })),
  S('sciSOL3', 'The solar system', 3, 'Earth science', '🪐', pairs({
    items: [
      ['Which planet is closest to the Sun?', 'Mercury', 'Mercury is the first planet from the Sun.'],
      ['Which is the largest planet?', 'Jupiter', 'Jupiter is the biggest planet in our solar system.'],
      ['Which planet is known as the Red Planet?', 'Mars', 'Mars looks red because of rusty iron in its soil.'],
      ['Which planet is famous for its bright rings?', 'Saturn', 'Saturn has the most spectacular rings.'],
      ['Which planet do we live on?', 'Earth', 'We live on Earth, the third planet from the Sun.'],
      ['Which planet is the hottest?', 'Venus', 'Venus is the hottest planet because its thick air traps heat.'],
      ['Which planet is farthest from the Sun?', 'Neptune', 'Neptune is the eighth and farthest planet.'],
      ['What is the star at the center of our solar system?', 'The Sun', 'Everything in the solar system orbits the Sun.']
    ]
  })),
  S('sciFRC3', 'Pushes and pulls', 3, 'Physical science', '🛒', classify({
    categories: ['Push', 'Pull'],
    prompt: a => `Is this a push or a pull?<br><em>${a}</em>`,
    items: [
      ['Kicking a soccer ball', 'Push'], ['Pulling a wagon', 'Pull'],
      ['Moving a shopping cart forward', 'Push'], ['Tugging a rope in tug-of-war', 'Pull'],
      ['Closing a drawer', 'Push'], ['Opening a drawer', 'Pull'],
      ['Throwing a ball', 'Push'], ['A magnet picking up a paper clip', 'Pull']
    ].map(([a, f]) => [a, f, `This is a <strong>${f.toLowerCase()}</strong> — a force that ${f === 'Push' ? 'moves something away from you' : 'moves something toward you'}.`])
  })),
  S('sciMCH3', 'Simple machines', 3, 'Physical science', '⚙️', classify({
    categories: ['Lever', 'Inclined plane', 'Wheel and axle', 'Pulley', 'Wedge'],
    prompt: a => `Which simple machine is ${b(a)}?`,
    items: [
      ['a seesaw', 'Lever'], ['a ramp', 'Inclined plane'], ['a knife blade', 'Wedge'],
      ['a bicycle wheel', 'Wheel and axle'], ['a rope on a flagpole', 'Pulley'], ['a crowbar', 'Lever'],
      ['a playground slide', 'Inclined plane'], ['an axe head', 'Wedge']
    ].map(([a, m]) => [a, m, `${a[0].toUpperCase() + a.slice(1)} is a <strong>${m.toLowerCase()}</strong>.`])
  })),

  /* ================= GRADE 4 ================= */
  S('sciENE4', 'Forms of energy', 4, 'Physical science', '⚡', classify({
    categories: ['Light energy', 'Heat energy', 'Sound energy', 'Motion energy'],
    prompt: a => `What kind of energy is shown?<br><em>${a}</em>`,
    items: [
      ['A speeding bicycle', 'Motion energy'], ['A hot stove', 'Heat energy'],
      ['A ringing bell', 'Sound energy'], ['The Sun shining through a window', 'Light energy'],
      ['A rolling ball', 'Motion energy'], ['Thunder', 'Sound energy'],
      ['A glowing light bulb', 'Light energy'], ['A cup of hot cocoa', 'Heat energy'],
      ['Someone clapping', 'Sound energy'], ['A falling rock', 'Motion energy']
    ].map(([a, e]) => [a, e, `${a} is an example of <strong>${e.toLowerCase()}</strong>.`])
  })),
  S('sciCND4', 'Conductors and insulators', 4, 'Physical science', '🔌', classify({
    categories: ['Conductor', 'Insulator'],
    prompt: m => `Is ${b(m)} a conductor or an insulator of electricity?`,
    items: [
      ['a copper wire', 'Conductor', 'Metals like copper let electricity flow easily.'],
      ['a rubber glove', 'Insulator', 'Rubber blocks electricity.'],
      ['aluminum foil', 'Conductor', 'Metals let electricity flow easily.'],
      ['a plastic bag', 'Insulator', 'Plastic blocks electricity.'],
      ['an iron nail', 'Conductor', 'Metals let electricity flow easily.'],
      ['a wooden spoon', 'Insulator', 'Wood blocks electricity.'],
      ['a glass cup', 'Insulator', 'Glass blocks electricity.'],
      ['a silver spoon', 'Conductor', 'Silver is one of the best conductors.'],
      ['a cotton shirt', 'Insulator', 'Cloth blocks electricity.'],
      ['steel scissors blades', 'Conductor', 'Steel is a metal, so it conducts electricity.']
    ]
  })),
  S('sciWTR4', 'The water cycle', 4, 'Earth science', '💧', pairs({
    items: [
      ['Liquid water heats up and turns into water vapor. What is this called?', 'Evaporation', 'The Sun\'s heat makes water evaporate into the air.'],
      ['Water vapor cools and forms tiny droplets in clouds. What is this called?', 'Condensation', 'Cooling turns water vapor back into liquid droplets.'],
      ['Rain, snow and hail fall from clouds. What is this called?', 'Precipitation', 'Water falling from clouds is precipitation.'],
      ['Water gathers in rivers, lakes and oceans. What is this called?', 'Collection', 'Collected water can then evaporate again.'],
      ['What process makes puddles disappear on a sunny day?', 'Evaporation', 'The Sun heats the puddle and the water goes into the air as vapor.'],
      ['What process forms the water drops on the outside of a cold glass?', 'Condensation', 'Water vapor in the air cools on the glass and turns into liquid.'],
      ['Snow falling on a mountain is an example of …', 'Precipitation', 'Snow is frozen precipitation.'],
      ['Water flowing from a stream into the ocean is part of …', 'Collection', 'Water collects in oceans, lakes and rivers.']
    ]
  })),
  S('sciBDY4', 'Body systems', 4, 'Human body', '🫀', pairs({
    items: [
      ['Which body system moves blood around the body?', 'Circulatory system', 'The heart and blood vessels make up the circulatory system.'],
      ['Which body system helps you breathe?', 'Respiratory system', 'Your lungs are part of the respiratory system.'],
      ['Which body system breaks down food?', 'Digestive system', 'The stomach and intestines are part of the digestive system.'],
      ['Which body system includes the brain?', 'Nervous system', 'The brain, spinal cord and nerves make up the nervous system.'],
      ['Which body system gives your body its frame?', 'Skeletal system', 'Your bones are the skeletal system.'],
      ['Which body system lets you move?', 'Muscular system', 'Muscles pull on bones to make you move.'],
      ['The heart is part of which system?', 'Circulatory system', 'The heart pumps blood.'],
      ['The stomach is part of which system?', 'Digestive system', 'The stomach helps break down food.']
    ]
  })),

  /* ================= GRADE 5 ================= */
  S('sciCHG5', 'Physical and chemical changes', 5, 'Physical science', '🔥', classify({
    categories: ['Physical change', 'Chemical change'],
    prompt: c => `Is this a physical or chemical change?<br><em>${c}</em>`,
    items: [
      ['Ice melting', 'Physical change', 'The water is still water — only its state changed.'],
      ['Wood burning', 'Chemical change', 'Burning makes new substances like ash and smoke.'],
      ['Cutting paper', 'Physical change', 'The paper is still paper, just in smaller pieces.'],
      ['Iron rusting', 'Chemical change', 'Iron and oxygen react to make a new substance: rust.'],
      ['Baking a cake', 'Chemical change', 'Heat causes the batter to react and become something new.'],
      ['Water boiling', 'Physical change', 'Liquid water becomes water vapor — still water.'],
      ['A cut apple turning brown', 'Chemical change', 'Oxygen reacts with the apple to make new substances.'],
      ['Crushing a can', 'Physical change', 'The can changes shape but is still the same metal.'],
      ['Milk turning sour', 'Chemical change', 'New substances form as the milk spoils.'],
      ['Sugar dissolving in water', 'Physical change', 'The sugar is still there — it is just mixed in.']
    ]
  })),
  S('sciCEL5', 'Plant and animal cells', 5, 'Life science', '🔬', classify({
    categories: ['Plant cells only', 'Animal cells only', 'Both plant and animal cells'],
    prompt: p => `Which cells have ${b(p)}?`,
    items: [
      ['a cell wall', 'Plant cells only', 'The stiff cell wall gives plant cells their shape.'],
      ['chloroplasts', 'Plant cells only', 'Chloroplasts capture sunlight to make food.'],
      ['a nucleus', 'Both plant and animal cells', 'The nucleus is the control center in both.'],
      ['a cell membrane', 'Both plant and animal cells', 'Every cell has a membrane around it.'],
      ['mitochondria', 'Both plant and animal cells', 'Mitochondria release energy in both.'],
      ['a large central vacuole', 'Plant cells only', 'Plant cells have a large vacuole that stores water.'],
      ['cytoplasm', 'Both plant and animal cells', 'Cytoplasm fills the inside of both kinds of cells.'],
      ['ribosomes', 'Both plant and animal cells', 'Ribosomes build proteins in both.']
    ]
  })),
  S('sciERT5', 'Layers of the Earth', 5, 'Earth science', '🌍', pairs({
    items: [
      ['Which layer of the Earth do we live on?', 'Crust', 'The crust is the thin, rocky outer layer.'],
      ['Which layer is the thickest and made of hot, slowly flowing rock?', 'Mantle', 'The mantle is the thickest layer.'],
      ['Which layer is made of liquid metal?', 'Outer core', 'The outer core is hot, liquid iron and nickel.'],
      ['Which layer is the solid, hottest center of the Earth?', 'Inner core', 'The inner core is solid because of the great pressure.'],
      ['Mountains and oceans are part of which layer?', 'Crust', 'Everything on the surface sits on the crust.'],
      ['Volcanic magma comes from which layer?', 'Mantle', 'Melted rock from the mantle rises as magma.'],
      ['Which layer is the thinnest?', 'Crust', 'The crust is thin compared to the other layers.'],
      ['Which layer is at the very center of the Earth?', 'Inner core', 'The inner core is at the center.']
    ]
  })),
  S('sciRCK5', 'Types of rocks', 5, 'Earth science', '🪨', classify({
    categories: ['Igneous', 'Sedimentary', 'Metamorphic'],
    prompt: r => `Which type of rock is ${b(r)}?`,
    items: [
      ['granite', 'Igneous', 'Igneous rocks form when melted rock cools and hardens.'],
      ['basalt', 'Igneous', 'Igneous rocks form when lava cools and hardens.'],
      ['obsidian', 'Igneous', 'Obsidian is volcanic glass that formed as lava cooled quickly.'],
      ['sandstone', 'Sedimentary', 'Sedimentary rocks form from layers of sand and mud pressed together.'],
      ['limestone', 'Sedimentary', 'Limestone forms from layers of shells and minerals.'],
      ['shale', 'Sedimentary', 'Shale forms from layers of mud pressed together.'],
      ['marble', 'Metamorphic', 'Metamorphic rocks are changed by heat and pressure. Marble comes from limestone.'],
      ['slate', 'Metamorphic', 'Slate is shale changed by heat and pressure.'],
      ['gneiss', 'Metamorphic', 'Gneiss forms deep underground from heat and pressure.'],
      ['pumice', 'Igneous', 'Pumice forms when frothy lava cools quickly.']
    ]
  }))
];
