/* English — more reading, writing and vocabulary questions for skills whose banks were small.
   bank items: [passage | null, question, answer, wrong answers, why]
   qa items:   [question, answer, wrong answers, why]
   MORE_READING[key] = gen(grade); these mix with each skill's original bank. */
import { pairs } from '../quiz.js';
import { pick, sample, shuffle, uniq, b, mc } from './words.js';

const box = p => `<div class="passage">${p}</div>`;
const bank = items => pairs({ items: items.map(([p, q, a, w, why]) => [`${p ? box(p) + '<p style="margin-top:10px">' : ''}${q}${p ? '</p>' : ''}`, a, why, [a, ...w]]) });
const qa = items => pairs({ items: items.map(([q, a, w, n]) => [q, a, n, [a, ...w]]) });

/* ---------- writing: details, purpose, topic sentences, opinions ---------- */
const DESC = [
  ['The dog ran.', 'The shaggy brown dog raced across the muddy field.', ['A dog ran fast.', 'The dog was running.', 'It ran.']],
  ['The cake was good.', 'The warm chocolate cake melted on my tongue.', ['The cake was very good.', 'I ate cake.', 'It was a cake.']],
  ['A bird sang.', 'A tiny red cardinal sang a cheerful song from the maple tree.', ['A bird was singing.', 'Birds sing.', 'The bird sang a song.']],
  ['The house was old.', 'The creaky old farmhouse had peeling blue paint and a sagging porch.', ['The house was really old.', 'It was an old house.', 'The house was there.']],
  ['We went to the beach.', 'We splashed in the cool, salty waves at the sandy beach.', ['We went to a beach.', 'The beach was fun.', 'We were at the beach.']],
  ['The storm was loud.', 'Booming thunder rattled the windows during the wild storm.', ['There was a loud storm.', 'It stormed.', 'The storm was very loud.']],
  ['My hat is nice.', 'My fuzzy green hat has a bright orange pompom on top.', ['I have a nice hat.', 'My hat is very nice.', 'It is a hat.']],
  ['The soup was hot.', 'Steam curled up from the bowl of spicy tomato soup.', ['The soup was very hot.', 'I had soup.', 'It was soup.']]
];
const WRITER_PURPOSE = [
  ['to inform', 'Bats are mammals that can fly. Most bats eat insects, and some eat fruit.'], ['to persuade', 'Our school needs a garden! Fresh vegetables would make our lunches healthier, so please vote yes.'],
  ['to entertain', 'Once there was a penguin who wanted to fly. Every morning he flapped and flapped, until one day a seagull offered him a ride.'], ['to inform', 'To make lemonade, squeeze four lemons, add sugar and stir in cold water.'],
  ['to persuade', 'You should read "Charlotte\'s Web." It is the best book about friendship ever written!'], ['to entertain', 'The giant sneezed so hard that the clouds blew all the way to the next town.'],
  ['to inform', 'The CN Tower in Toronto is 553 metres tall and was finished in 1976.'], ['to persuade', 'Everyone should turn off the lights when they leave a room. It saves energy and money!'],
  ['to entertain', 'Milo the mouse tiptoed into the kitchen, only to find the cat wearing his favourite hat.']
];
const TOPIC_EXP = [
  ['They have long trunks for drinking and big ears that help them stay cool. They can weigh as much as a small truck.', 'Elephants are amazing animals.', ['I saw a zoo once.', 'Trucks are heavy.', 'My ears are small.']],
  ['First, the caterpillar hatches from an egg. Then it forms a chrysalis. Finally, a butterfly comes out.', 'A butterfly changes a lot as it grows.', ['Eggs are small.', 'I like the colour orange.', 'Moths fly at night.']],
  ['Maple syrup comes from the sap of maple trees. Farmers collect the sap in early spring and boil it until it is thick and sweet.', 'Maple syrup is made from tree sap.', ['Pancakes are tasty.', 'Spring is my favourite season.', 'Some trees lose their leaves.']],
  ['Bees carry pollen from flower to flower. This helps plants make seeds and fruit.', 'Bees help plants grow.', ['Bees can sting.', 'Flowers are pretty.', 'I eat fruit every day.']],
  ['You need a helmet, a bike that fits you and lights if you ride at night. Always ride on the right side of the road.', 'There are rules to stay safe on a bike.', ['Bikes have two wheels.', 'I got a bike for my birthday.', 'Cars are faster than bikes.']],
  ['Beavers cut down trees with their strong teeth. They use the logs and mud to build dams and lodges.', 'Beavers are skilled builders.', ['Mud is wet.', 'Some teeth are white.', 'Logs float.']],
  ['Volunteers pick up litter, plant trees and clean the shoreline every spring.', 'Volunteers help keep our park clean.', ['Spring is warm.', 'Trees are tall.', 'Litter is bad.']]
];
const OPINION_REASON = [
  ['Our class should have a pet fish.', 'Taking care of a fish would teach us responsibility.', ['Fish live in water.', 'My cousin has a dog.', 'Some fish are orange.']],
  ['Recess should be longer.', 'Playing outside helps us focus better in class.', ['Recess is at 10 o\'clock.', 'The playground has swings.', 'It rained on Monday.']],
  ['Everyone should learn to swim.', 'Swimming can keep you safe near water.', ['Pools are blue.', 'Some people swim on Saturdays.', 'Water is wet.']],
  ['Our library should stay open later.', 'Families who work late could still borrow books.', ['The library has many books.', 'Books have pages.', 'The library is on Main Street.']],
  ['Kids should help with chores at home.', 'Chores teach skills you will need when you grow up.', ['Some houses are big.', 'My mom likes soup.', 'Dishes are made of glass.']],
  ['Our town should build a skate park.', 'It would give teens a safe place to have fun.', ['Skateboards have wheels.', 'The town has a mayor.', 'Concrete is grey.']],
  ['Students should walk or bike to school.', 'It is good exercise and keeps the air cleaner.', ['School starts at 8:30.', 'Some students have red bikes.', 'Buses are yellow.']]
];
const OPINION_EXAMPLE = [
  ['Dogs make great pets.', 'They are loyal.', 'My dog waits by the door every day when I come home.', ['Dogs have four legs.', 'Cats like to sleep.', 'Some dogs are brown.']],
  ['Winter is the best season.', 'There are lots of fun things to do.', 'Last weekend we went tobogganing and built a snow fort.', ['Winter is cold.', 'Summer is hot.', 'Snow is white.']],
  ['Reading is fun.', 'Books take you to new places.', 'In my favourite book, I travelled to a castle on the moon.', ['Books have covers.', 'The library is quiet.', 'Pencils are yellow.']],
  ['We should recycle.', 'It keeps garbage out of landfills.', 'Our class recycled 200 cans this month instead of throwing them away.', ['Cans are made of metal.', 'Trucks pick up garbage.', 'Paper is flat.']],
  ['Gardens are great for schools.', 'Students learn where food comes from.', 'Our class grew carrots and ate them at lunch.', ['Carrots are orange.', 'Gardens need water.', 'Lunch is at noon.']],
  ['Music class is important.', 'It helps students work together.', 'Our band practised for weeks to play one song together at the concert.', ['Drums are loud.', 'Music is in Room 4.', 'Some songs are long.']],
  ['Field trips are worth it.', 'Students see things they read about.', 'At the science centre we touched a real meteorite.', ['Buses are big.', 'Lunch was at noon.', 'The trip was in May.']]
];
const FACT_OP = [
  ['Opinion', 'Recess is ___.', 'the best part of the day', ['15 minutes long', 'after math class', 'outside on sunny days']], ['Fact', 'A spider has ___.', 'eight legs', ['the scariest face', 'the coolest web', 'too many legs']],
  ['Opinion', 'Pizza is ___.', 'the tastiest food', ['made with dough', 'baked in an oven', 'often round']], ['Fact', 'Water freezes at ___.', '0 °C', ['the most beautiful temperature', 'a boring temperature', 'the best time of year']],
  ['Opinion', 'Soccer is ___.', 'more fun than hockey', ['played with a ball', 'played on a field', 'played by two teams']], ['Fact', 'Ottawa is ___.', 'the capital of Canada', ['the nicest city', 'too cold in winter', 'more fun than Toronto']],
  ['Opinion', 'Blue is ___.', 'the prettiest colour', ['a colour', 'the colour of the sky on a clear day', 'one colour of the rainbow']], ['Fact', 'A year has ___.', '12 months', ['too many school days', 'the best summer', 'boring months']],
  ['Opinion', 'Cats are ___.', 'better pets than dogs', ['mammals', 'animals with whiskers', 'able to climb trees']]
];
const CAUSE_MATCH = [
  ['I forgot my umbrella.', 'I got wet in the rain.', ['I ate breakfast.', 'The sun came out.', 'I found my hat.']], ['The ice cream sat in the sun.', 'It melted.', ['It froze.', 'It turned blue.', 'It got bigger.']],
  ['Maya practised piano every day.', 'She played well at the recital.', ['She forgot the song.', 'Her piano broke.', 'She stopped playing.']], ['The wind blew very hard.', 'Our kite flew high.', ['Our kite stayed on the ground.', 'It started to snow.', 'The sun set.']],
  ['Liam did not water the plant.', 'The plant wilted.', ['The plant grew flowers.', 'The plant got taller.', 'The plant turned purple.']], ['The puppy chewed my shoe.', 'My shoe has holes in it.', ['My shoe is new.', 'The puppy fell asleep.', 'I bought a hat.']],
  ['It snowed all night.', 'School was cancelled.', ['We went swimming.', 'The grass grew.', 'It was very hot.']], ['I stayed up too late.', 'I felt tired in the morning.', ['I felt full of energy.', 'I woke up early.', 'I ate lunch.']]
];

/* ---------- reading: informational and literary ---------- */
const MAIN_TWO = [
  ['Text 1: Maple trees make sap in the spring. Text 2: People boil maple sap to make syrup.', 'Maple trees make spring sap that people boil into syrup.', ['Syrup is sweet.', 'Trees are tall.', 'Spring is warm.']],
  ['Text 1: Polar bears hunt seals on sea ice. Text 2: As the Arctic warms, sea ice melts earlier each year.', 'Melting sea ice makes it harder for polar bears to hunt.', ['Seals live in the ocean.', 'The Arctic is cold.', 'Polar bears are white.']],
  ['Text 1: The Canadian Shield has many lakes. Text 2: Glaciers scraped the land and left holes that filled with water.', 'Glaciers shaped the Canadian Shield and formed its many lakes.', ['Lakes are full of fish.', 'Glaciers are cold.', 'Canada is big.']],
  ['Text 1: Exercise makes your heart stronger. Text 2: Exercise also helps you sleep and feel calmer.', 'Exercise is good for both your body and your mind.', ['Hearts pump blood.', 'Sleep is important.', 'Some people run.']],
  ['Text 1: Inuit hunters built igloos from blocks of snow. Text 2: Snow traps air, which keeps the inside of an igloo warm.', 'Inuit built igloos from snow, which insulates well.', ['Snow is white.', 'Hunters are brave.', 'Air is invisible.']],
  ['Text 1: Wolves were removed from Yellowstone Park in the 1920s. Text 2: When wolves returned in 1995, elk herds shrank and plants along rivers grew back.', 'Bringing wolves back to Yellowstone changed the whole ecosystem.', ['Elk eat grass.', 'Yellowstone is a park.', 'Wolves howl.']],
  ['Text 1: Solar panels turn sunlight into electricity. Text 2: Many homes in Alberta now use solar panels to lower their power bills.', 'Solar panels make electricity from sunlight and help families save money.', ['Alberta is sunny.', 'Electricity is useful.', 'Panels are flat.']]
];
const CHAR_CMP = [
  ['Kai loves to try new foods, while his sister Lena eats only pasta. Both of them love to cook with their dad on Sundays.', 'How are Kai and Lena alike?', 'They both enjoy cooking with their dad', ['They both try new foods', 'They both eat only pasta', 'Neither likes to cook']],
  ['Rosa raced ahead on the trail, shouting with excitement. Her friend Ben walked slowly, stopping to sketch every bird he saw.', 'How are Rosa and Ben different?', 'Rosa hurries along excitedly; Ben takes his time and notices details', ['Both walk slowly', 'Both sketch birds', 'Ben hurries; Rosa sketches']],
  ['Grandpa tells long stories about growing up on a farm. Grandma prefers to show old photos without saying much. Both of them smile whenever they remember the farm.', 'What do Grandpa and Grandma have in common?', 'They both have happy memories of the farm', ['They both tell long stories', 'They both dislike photos', 'Neither remembers the farm']],
  ['Ahmed practises his lines every night and worries about forgetting them. Zoe never practises but feels calm and confident on stage.', 'Which describes a difference between them?', 'Ahmed is nervous and prepared; Zoe is relaxed and unprepared', ['Both are nervous', 'Both practise every night', 'Zoe is nervous; Ahmed is relaxed']],
  ['The fox in the story is clever and tricks the other animals. The turtle is slow but honest, and the animals trust him.', 'How is the turtle different from the fox?', 'The turtle is honest, while the fox is tricky', ['The turtle is faster', 'The turtle tricks the animals', 'Both are dishonest']],
  ['Nia and her cousin Sam both want to win the science fair. Nia builds a solar oven; Sam studies how plants grow in different light.', 'How are Nia and Sam alike?', 'They both want to win the science fair', ['They both build solar ovens', 'They both study plants', 'Neither enters the fair']],
  ['Max shares his lunch with anyone who forgets theirs. His twin, Mia, is shy but always helps classmates with their math.', 'What trait do the twins share?', 'They are both kind and helpful', ['They are both shy', 'They both forget their lunch', 'They are both unfriendly']],
  ['Iris wakes before sunrise to feed the chickens. Her brother Tom sleeps until noon but stays up late fixing broken radios.', 'How are Iris and Tom different?', 'Iris is an early riser; Tom works late at night', ['Both wake before sunrise', 'Both feed the chickens', 'Tom wakes early; Iris stays up late']],
  ['Both Raj and his grandmother love music. Raj plays electric guitar in a band, while his grandmother sings old folk songs while she cooks.', 'What do Raj and his grandmother share?', 'A love of music', ['They both play guitar', 'They both sing folk songs', 'Neither likes music']]
];
const CC_INFO = [
  ['Rabbits and hares look alike, but hares are bigger and have longer ears. Rabbits are born without fur, while hares are born with fur and their eyes open.', 'How are baby hares different from baby rabbits?', 'Baby hares are born with fur and open eyes', ['Baby hares are born without fur', 'Baby hares are smaller', 'Baby hares have shorter ears'], 'The text says hares are born with fur and their eyes open.'],
  ['Both Canada and Australia were once British colonies and are now independent countries. Canada has very cold winters, while much of Australia is hot and dry.', 'How are Canada and Australia alike?', 'Both were once British colonies', ['Both have cold winters', 'Both are hot and dry', 'Neither is independent'], 'The text says both were British colonies.'],
  ['Turtles and tortoises are both reptiles with shells. Turtles spend most of their time in water and have flatter shells. Tortoises live on land and have dome-shaped shells.', 'What is one difference between turtles and tortoises?', 'Turtles live mostly in water; tortoises live on land', ['Only tortoises have shells', 'Turtles have dome-shaped shells', 'Tortoises are not reptiles'], 'The text contrasts where they live.'],
  ['E-books and printed books can tell the same stories. E-books are light and you can carry hundreds at once. Printed books don\'t need batteries and many people enjoy turning real pages.', 'Which is a benefit of printed books named in the text?', 'They don\'t need batteries', ['They are lighter', 'You can carry hundreds at once', 'They cost nothing'], 'The text says printed books don\'t need batteries.'],
  ['Solar power and wind power are both renewable. Solar panels work best on sunny days, while wind turbines need steady wind and can run at night.', 'How are solar and wind power alike?', 'Both are renewable', ['Both work only at night', 'Both need sunny days', 'Both burn fuel'], 'The text says both are renewable.'],
  ['Crocodiles and alligators are both large reptiles. Crocodiles can live in salt water, but alligators usually live in fresh water.', 'Where do alligators usually live, according to the text?', 'In fresh water', ['In salt water', 'In deserts', 'In trees'], 'The text contrasts salt water (crocodiles) with fresh water (alligators).'],
  ['Hockey and ringette are both played on ice with sticks. Hockey uses a puck, while ringette uses a rubber ring. In ringette, players cannot carry the ring across the blue line.', 'What is a difference between hockey and ringette?', 'Hockey uses a puck; ringette uses a ring', ['Only hockey is played on ice', 'Ringette uses a puck', 'Hockey uses a ring'], 'The equipment is different.'],
  ['Comets and asteroids both orbit the Sun. Comets are made of ice and dust and grow glowing tails near the Sun. Asteroids are rocky or metal and have no tails.', 'How are comets different from asteroids?', 'Comets are icy and grow tails; asteroids are rocky with no tails', ['Asteroids grow tails', 'Only asteroids orbit the Sun', 'Comets are made of metal'], 'The text describes what each is made of and the tails.']
];
const PV_CMP = [
  ['Narrator 1: "Moving to a new city was scary. I didn\'t know anyone." Narrator 2: "Moving was an adventure! I couldn\'t wait to explore."', 'How do the narrators feel differently about moving?', 'One feels scared; the other feels excited', ['Both feel scared', 'Both feel excited', 'Neither has moved']],
  ['Narrator 1: "The storm knocked out our power, and I hated the dark." Narrator 2: "When the power went out, we lit candles and told stories. It was the best night!"', 'How are their views of the power outage different?', 'One disliked it; the other enjoyed it', ['Both enjoyed it', 'Both hated it', 'Neither noticed it']],
  ['Narrator 1: "Soccer practice is boring because we just run drills." Narrator 2: "Drills make us better, so I love practice."', 'How do the narrators view soccer practice?', 'One finds it boring; the other loves it', ['Both find it boring', 'Both love it', 'Neither plays soccer']],
  ['Narrator 1: "Grandma\'s old house is creepy and full of dust." Narrator 2: "Grandma\'s house is full of treasures and stories."', 'How do the narrators see Grandma\'s house?', 'One sees it as creepy; the other as full of treasures', ['Both think it is creepy', 'Both love the dust', 'Neither visits it']],
  ['Narrator 1: "Our new teacher is strict, and I miss Ms. Lee." Narrator 2: "Our new teacher is strict, but she makes learning fun."', 'What do both narrators agree on?', 'The new teacher is strict', ['The new teacher is fun', 'They both miss Ms. Lee', 'The teacher is not strict']],
  ['Narrator 1: "The camping trip was ruined by rain." Narrator 2: "The rain gave us a reason to play cards in the tent all afternoon."', 'How do the narrators view the rain?', 'One thinks it ruined the trip; the other found a way to enjoy it', ['Both enjoyed the rain', 'Both stayed home', 'Neither saw rain']],
  ['Narrator 1: "Our puppy chews everything — he\'s a nightmare." Narrator 2: "Our puppy is just curious and learning about the world."', 'How do the narrators view the puppy\'s chewing?', 'One is annoyed; the other is understanding', ['Both are annoyed', 'Both are understanding', 'Neither has a puppy']],
  ['Narrator 1: "The new library is too quiet — I miss the old noisy one." Narrator 2: "Finally, a calm place where I can actually think!"', 'How do the narrators feel about the quiet library?', 'One dislikes the quiet; the other appreciates it', ['Both dislike it', 'Both love it', 'Neither has visited it']],
  ['Narrator 1: "Snow days are the best — sledding all day!" Narrator 2: "Snow days mean shovelling the driveway before breakfast."', 'How do the narrators view snow days?', 'One sees fun; the other sees chores', ['Both see only fun', 'Both shovel', 'Neither likes snow']]
];
const ILL_HIST = [
  ['A painting of Confederation shows the Fathers of Confederation in fine suits around a table. A modern illustration shows the same scene with Indigenous leaders watching from outside the window.', 'What does the modern illustration add?', 'It draws attention to people who were left out of the decision', ['It shows the same thing exactly', 'It removes the table', 'It shows a hockey game']],
  ['One illustration of Robin Hood shows him as a smiling hero giving gold to the poor. Another shows him as a sneaky thief hiding in the forest.', 'How do the illustrations portray Robin Hood differently?', 'One shows him as a hero; the other as a thief', ['Both show him as a thief', 'Both show him as a king', 'Neither shows Robin Hood']],
  ['An 1800s drawing shows the Klondike Gold Rush with happy miners holding nuggets. A photo from the same time shows exhausted people climbing a snowy mountain pass with heavy packs.', 'What does the photo show that the drawing leaves out?', 'How hard and dangerous the journey was', ['How much gold people found', 'How warm the weather was', 'How easy travel was']],
  ['One illustration of Odysseus shows him as a strong warrior fighting a monster. Another shows him alone on a raft, looking tired and homesick.', 'How do the illustrations show Odysseus differently?', 'One shows his strength; the other shows his loneliness and struggle', ['Both show him fighting', 'Both show him at home', 'Neither shows Odysseus']],
  ['A poster from 1914 shows soldiers marching proudly with flags. A painting made after the war shows soldiers in muddy trenches.', 'How do the two images present the war differently?', 'The poster makes war look glorious; the painting shows its harsh reality', ['Both make war look glorious', 'Both show trenches', 'Neither shows soldiers']],
  ['One illustration of Cinderella shows her in a sparkling gown at the ball. Another shows her scrubbing floors in rags.', 'What does each illustration focus on?', 'One shows her transformation; the other her hard life', ['Both show the ball', 'Both show her cleaning', 'Neither shows Cinderella']],
  ['A textbook drawing of Jacques Cartier shows him planting a cross while sailors cheer. A Haudenosaunee artist\'s version shows Chief Donnacona looking on with concern.', 'Whose perspective does the second illustration add?', 'The Indigenous people who already lived there', ['The sailors\' families in France', 'The king of France', 'Cartier\'s ship builders']]
];
const MYTH_ILL = [
  ['Illustration A shows Icarus flying close to the Sun with wax dripping from his wings. Illustration B shows Icarus\'s father, Daedalus, warning him before they take off.', 'What part of the myth does Illustration B show?', 'The warning before the flight', ['Icarus falling into the sea', 'The wings melting', 'The Sun rising']],
  ['Illustration A shows Pandora opening a jar as dark shapes fly out. Illustration B shows a small light — Hope — left at the bottom of the jar.', 'What do both illustrations include?', 'Pandora\'s jar', ['Dark shapes', 'The light of Hope', 'A dragon']],
  ['Illustration A shows Sky Woman falling from the sky. Illustration B shows animals placing earth on the back of a great turtle to make land for her.', 'What part of the story does Illustration B show?', 'Animals creating land on the turtle\'s back', ['Sky Woman falling', 'The turtle swimming away', 'A storm']],
  ['Illustration A shows Thor swinging his hammer at giants. Illustration B shows Thor fishing with a giant in a small boat.', 'What do both illustrations show?', 'Thor with giants', ['Thor fishing', 'A battle at sea', 'Thor sleeping']],
  ['Illustration A shows Persephone picking flowers in a meadow. Illustration B shows her in the dark underworld eating pomegranate seeds.', 'How are the settings different?', 'A is a sunny meadow; B is the dark underworld', ['Both are meadows', 'Both are underground', 'A is a castle; B is a forest']],
  ['Illustration A shows Raven stealing the Sun from a box. Illustration B shows the Sun shining over the world after Raven releases it.', 'What does Illustration B show?', 'What happens after Raven frees the Sun', ['Raven stealing the box', 'Raven sleeping', 'The world in darkness']],
  ['Illustration A shows Midas turning a rose to gold and smiling. Illustration B shows Midas crying as his daughter turns to gold.', 'How does Midas feel in each illustration?', 'Happy in A; sad in B', ['Sad in both', 'Happy in both', 'Angry in A; happy in B']]
];
const GENRE_CMP = [
  ['Poem: "The geese write V\'s across the sky, / goodbye, goodbye, they seem to cry." Article: "Canada geese migrate south in V-formation to save energy."', 'What is a key difference between the texts?', 'The poem expresses feeling; the article explains a fact', ['Both are poems', 'The article rhymes', 'The poem gives scientific data']],
  ['Diary: "Dear Diary, today I saw my first moose! My heart pounded." Encyclopedia: "The moose (Alces alces) is the largest member of the deer family."', 'How do the texts differ in purpose?', 'The diary shares a personal experience; the encyclopedia informs', ['Both share personal feelings', 'Both are fictional', 'The encyclopedia tells a story']],
  ['Fable: "The ant worked all summer while the grasshopper played. In winter, the grasshopper went hungry." Science text: "Ants store food in their nests for the winter."', 'What does the fable have that the science text does not?', 'A lesson about hard work', ['Facts about ants', 'Scientific vocabulary', 'A diagram']],
  ['Speech: "Friends, our river is dying, and we must act now!" Report: "Water samples showed lead levels of 15 parts per billion."', 'How is the speech different from the report?', 'The speech uses emotion to persuade; the report gives data', ['Both give only data', 'The report is emotional', 'The speech is a poem']],
  ['Play script: "MAYA (whispering): Did you hear that?" Short story: "Maya whispered, asking if anyone else had heard the noise."', 'How do the genres present dialogue differently?', 'The script uses a speaker label and stage direction; the story uses narration', ['Both use stage directions', 'The story uses speaker labels', 'Neither has dialogue']],
  ['Recipe: "Mix 2 cups flour with 1 cup milk." Memoir: "My grandmother never measured flour; she just knew by feel."', 'What is a key difference?', 'The recipe gives exact steps; the memoir shares a memory', ['Both give exact steps', 'Both are poems', 'The memoir lists ingredients']],
  ['News article: "A blizzard closed Highway 1 on Tuesday." Poem: "White silence buries the road, / and the world holds its breath."', 'How do the texts describe the storm differently?', 'The article states facts; the poem uses imagery', ['Both state facts only', 'The article uses imagery', 'Neither mentions snow']],
  ['Myth: "Raven brought light to the world by stealing the Sun from a box." Science article: "The Sun formed about 4.6 billion years ago from a cloud of gas and dust."', 'How do the texts explain the Sun differently?', 'The myth tells a traditional story; the article gives scientific facts', ['Both give scientific facts', 'Both are myths', 'The article tells about Raven']],
  ['Letter: "Dear Ms. Patel, thank you for the wonderful field trip!" Advertisement: "Book your class trip today and save 20%!"', 'What is a key difference in purpose?', 'The letter thanks someone; the ad tries to sell something', ['Both thank someone', 'Both sell trips', 'The letter tries to sell']]
];
const AUTH_PV = [
  ['Some people say homework is a waste of time, but I believe practice at home builds skills that class time alone cannot.', 'What is the author\'s point of view about homework?', 'Homework is valuable', ['Homework is a waste of time', 'Homework should be banned', 'The author has no opinion']],
  ['City life is noisy and crowded. I would trade every skyscraper for a quiet cabin by a lake.', 'What does the author prefer?', 'Quiet country life', ['Busy city life', 'Skyscrapers', 'Crowds']],
  ['Video games often get blamed for everything, yet many teach teamwork, problem-solving and patience.', 'How does the author view video games?', 'They have real benefits', ['They are harmful', 'They are boring', 'They should be banned']],
  ['Plastic straws may seem small, but millions end up in our oceans each year. It is time to switch to paper or metal.', 'What is the author\'s position?', 'We should stop using plastic straws', ['Plastic straws are harmless', 'Oceans are clean', 'Metal straws are dangerous']],
  ['Uniforms take away students\' chance to express who they are.', 'How does the author feel about school uniforms?', 'Against them', ['In favour of them', 'Neutral', 'Unsure']],
  ['Public libraries are more important than ever: they offer free internet, classes and a safe place for everyone.', 'What is the author\'s view of public libraries?', 'They are very important', ['They are outdated', 'They should charge fees', 'They are only for books']],
  ['Four-day school weeks sound fun, but younger students would lose valuable learning time.', 'What does the author think of four-day school weeks?', 'They would hurt younger students\' learning', ['They are a great idea', 'They would help learning', 'The author has no view']]
];
const ORDER_INFO = [
  ['First, a seed is planted in soil. Next, roots grow down and a shoot pushes up. Then leaves open in the sunlight. Finally, the plant grows flowers.', ['a seed is planted', 'roots grow down', 'leaves open', 'the plant grows flowers']],
  ['In 1867, four provinces joined to form Canada. Manitoba joined in 1870, British Columbia in 1871, and Newfoundland and Labrador did not join until 1949.', ['four provinces form Canada', 'Manitoba joins', 'British Columbia joins', 'Newfoundland and Labrador joins']],
  ['Before a volcano erupts, the ground often shakes. Then gas and steam escape. Next, lava pours out. Afterward, the lava cools into rock.', ['the ground shakes', 'gas and steam escape', 'lava pours out', 'lava cools into rock']],
  ['To make paper, workers first cut down trees. They then grind the wood into pulp. Next, the pulp is pressed flat. Last, it is dried into sheets.', ['trees are cut down', 'wood is ground into pulp', 'pulp is pressed flat', 'it is dried into sheets']],
  ['A salmon hatches in a river. It swims to the ocean, where it grows for several years. Later, it returns to the river where it was born. There, it lays eggs.', ['a salmon hatches', 'it swims to the ocean', 'it returns to its river', 'it lays eggs']],
  ['The Wright brothers first built gliders. After many tests, they added an engine. In 1903 they made the first powered flight. Soon, airplanes carried mail and passengers.', ['they built gliders', 'they added an engine', 'they made the first powered flight', 'airplanes carried mail and passengers']]
];
function orderInfo() {
  const [p, steps] = pick(ORDER_INFO), i = Math.floor(Math.random() * 3), kind = pick(['after', 'first', 'last']);
  if (kind === 'first') return mc(`${box(p)}<p>Which event happened ${b('first')}?</p>`, steps[0], steps.slice(1), `The passage begins with: ${b(steps[0])}.`);
  if (kind === 'last') return mc(`${box(p)}<p>Which event happened ${b('last')}?</p>`, steps[3], steps.slice(0, 3), `The passage ends with: ${b(steps[3])}.`);
  return mc(`${box(p)}<p>What happened right after ${b(steps[i])}?</p>`, steps[i + 1], steps.filter((_, j) => j !== i + 1), `Order: ${steps.join(' → ')}.`);
}
const THEMES = [
  ['Tess wanted to win the race so badly that she pushed past her friend Jo, who fell. Tess won, but standing alone on the podium, she felt empty. The next day she apologized, and Jo forgave her.', 'Friendship matters more than winning', ['Always try to win', 'Races are dangerous', 'Podiums are tall']],
  ['Every day the old man planted a tree, though he knew he would never sit in its shade. "These are for my grandchildren," he said.', 'We should do good things for the future, even if we don\'t benefit', ['Trees grow fast', 'Old people like gardening', 'Shade is important']],
  ['Leo was afraid to sing in front of others. When his little sister got lost at the fair, he sang her favourite song as loud as he could until she found him.', 'Love can help us overcome our fears', ['Fairs are noisy', 'Singing is easy', 'Little sisters get lost']],
  ['The fox told the crow her voice was beautiful. When the crow opened her beak to sing, the cheese fell out, and the fox ate it.', 'Be careful of people who flatter you', ['Crows like cheese', 'Foxes are fast', 'Singing is fun']],
  ['Anya laughed at the new boy\'s accent. Later she moved to a new country herself and understood how it felt to be different.', 'It is important to show empathy toward others', ['Moving is fun', 'Accents are funny', 'New countries are big']],
  ['The rabbit bragged about his speed and took a nap during the race. The slow tortoise kept going and crossed the finish line first.', 'Slow and steady effort can beat careless talent', ['Rabbits are fast', 'Naps are good', 'Races are long']],
  ['Kofi found a wallet full of money. Though he needed new shoes, he returned it to its owner, who thanked him with a smile.', 'Honesty is the right choice even when it is hard', ['Shoes are expensive', 'Wallets are easy to lose', 'Money buys happiness']]
];
const INFER = [
  ['Mara grabbed her umbrella, pulled on her boots and frowned at the grey sky.', 'What can you infer about the weather?', 'It is probably going to rain', ['It is sunny and hot', 'It is snowing heavily', 'It is a clear night']],
  ['The stadium roared. Jamal\'s teammates lifted him onto their shoulders as the clock hit zero.', 'What can you infer?', 'Jamal\'s team won, probably because of him', ['The game was cancelled', 'Jamal got hurt', 'The team lost badly']],
  ['Ellie yawned, rubbed her eyes and kept reading the last chapter under her blanket with a flashlight.', 'What can you infer about Ellie?', 'She is staying up late because she can\'t stop reading', ['She is scared of the dark', 'She is at school', 'She dislikes the book']],
  ['The kitchen smelled like smoke, and Dad was fanning the smoke alarm with a towel.', 'What probably happened?', 'Something burned while cooking', ['Dad was baking perfectly', 'The power went out', 'The house was cold']],
  ['Sam\'s hands shook as he walked to the front of the class with his notes.', 'How does Sam most likely feel?', 'Nervous about speaking', ['Bored', 'Angry at his friends', 'Sleepy']],
  ['The bird feeder was empty, seeds were scattered on the ground and a striped tail disappeared up the tree.', 'What most likely emptied the feeder?', 'A raccoon or squirrel', ['The wind', 'A fish', 'A cow']],
  ['Grandma set out six plates, put on her best apron and kept checking the window.', 'What can you infer?', 'She is expecting guests', ['She is going to sleep', 'She is moving away', 'She is alone for the day']]
];
const SUPPORT_INFO = [
  ['Sea otters help kelp forests survive. They eat sea urchins, which would otherwise chew through the kelp.', 'Which detail supports the idea that sea otters help kelp forests?', 'They eat sea urchins that chew through kelp', ['Sea otters are furry', 'Kelp is green', 'Urchins are spiny']],
  ['Recess helps students learn. Studies show that children who take breaks pay more attention in class afterward.', 'Which detail supports the main idea?', 'Children who take breaks pay more attention afterward', ['Recess is outside', 'Children like games', 'Studies are long']],
  ['The Trans-Canada Highway connects the country. It runs about 7 800 km from St. John\'s to Victoria and passes through all ten provinces.', 'Which detail supports the idea that the highway connects Canada?', 'It passes through all ten provinces', ['It is paved', 'Cars drive on it', 'It has gas stations']],
  ['Honeybees communicate with dances. A bee that finds flowers performs a "waggle dance" that shows other bees the direction to the food.', 'Which detail supports the main idea?', 'The waggle dance shows the direction to food', ['Bees make honey', 'Flowers are colourful', 'Bees live in hives']],
  ['Walking is great exercise. It strengthens the heart, needs no equipment and can be done almost anywhere.', 'Which detail supports the idea that walking is great exercise?', 'It strengthens the heart', ['Shoes come in many colours', 'Some people walk dogs', 'Sidewalks are grey']],
  ['Canada has many official symbols. The beaver, the maple leaf and the Canadian horse have all been named national symbols.', 'Which detail supports the main idea?', 'The beaver and maple leaf are national symbols', ['Beavers build dams', 'Maple trees turn red', 'Horses are fast']],
  ['Plastic is a problem for oceans. Each year, millions of tonnes of plastic wash into the sea, where animals can mistake it for food.', 'Which detail supports the main idea?', 'Animals can mistake plastic for food', ['Plastic is light', 'Oceans are salty', 'Some bottles are blue']]
];
const SUPPORT_LIT = [
  ['Omar was the kindest boy in the class. He shared his crayons, helped the new student find her locker and always said thank you.', 'Which detail supports the idea that Omar is kind?', 'He helped the new student find her locker', ['He was in the class', 'He had crayons', 'He had a locker']],
  ['The house felt spooky. The floorboards creaked, a door slammed by itself and cold air brushed Lily\'s neck.', 'Which detail best supports the idea that the house is spooky?', 'A door slammed by itself', ['Lily had a neck', 'The house had floors', 'The house had doors']],
  ['Nell was determined to finish the marathon. Even when her legs cramped, she kept running, step by painful step.', 'Which detail shows Nell is determined?', 'She kept running even when her legs cramped', ['She ran a marathon', 'She had legs', 'She was named Nell']],
  ['The old dog was loyal. Every evening at six, he waited by the gate for his owner to come home.', 'Which detail supports that the dog is loyal?', 'He waited by the gate every evening', ['He was old', 'It was six o\'clock', 'The gate was wooden']],
  ['Pedro felt nervous about the test. He tapped his pencil, checked the clock again and again, and could not stop his knee from bouncing.', 'Which detail shows Pedro\'s nervousness?', 'His knee kept bouncing', ['He had a pencil', 'There was a clock', 'He took a test']],
  ['Aunt Rita was generous. She knitted mittens for every child on the street and never asked for anything in return.', 'Which detail supports that Aunt Rita is generous?', 'She knitted mittens for every child and asked for nothing', ['She lived on a street', 'She owned yarn', 'Mittens keep hands warm']],
  ['The village was celebrating. Lanterns lit the streets, music played and children danced around the square.', 'Which detail supports that the village is celebrating?', 'Children danced while music played', ['The village had streets', 'There was a square', 'It was night']]
];
const SUPPORT_EVIDENCE = [
  ['Claim: Four-day school weeks can improve attendance.', 'Which evidence best supports the claim?', 'A district that switched to four days saw absences fall by 15%.', ['Many students like Fridays off.', 'Teachers work hard.', 'Some schools have five-day weeks.']],
  ['Claim: Urban trees reduce summer temperatures.', 'Which evidence best supports the claim?', 'Streets with full tree cover measured up to 5 °C cooler than treeless streets.', ['Trees are beautiful.', 'Many cities plant trees.', 'Summer is hot.']],
  ['Claim: Reading for pleasure improves vocabulary.', 'Which evidence best supports the claim?', 'Students who read 20 minutes a day knew far more words on vocabulary tests than those who did not.', ['Libraries have many books.', 'Some books are long.', 'Reading is relaxing.']],
  ['Claim: Social media can harm teenagers\' sleep.', 'Which evidence best supports the claim?', 'Teens who used phones after 10 p.m. slept an hour less on average.', ['Phones are expensive.', 'Many teens use social media.', 'Sleep is important.']],
  ['Claim: Bike lanes make streets safer.', 'Which evidence best supports the claim?', 'After protected bike lanes were added, cyclist injuries on the street dropped by 40%.', ['Bikes are cheaper than cars.', 'Cycling is fun.', 'Some streets are wide.']],
  ['Claim: Learning a second language benefits the brain.', 'Which evidence best supports the claim?', 'Brain scans show bilingual people have stronger activity in areas used for attention.', ['French is a beautiful language.', 'Many Canadians speak two languages.', 'Languages have grammar.']],
  ['Claim: School gardens improve students\' eating habits.', 'Which evidence best supports the claim?', 'Students in a garden program ate 40% more vegetables at lunch.', ['Gardens need water.', 'Vegetables are healthy.', 'Some schools have no garden.']]
];
const BIAS = [
  ['Which headline shows bias against the new park?', 'Council Wastes Millions on Useless Park', ['Council Approves New Park', 'New Park to Open in June', 'Park Plan Costs $3 Million']],
  ['Which headline is the most neutral?', 'School Board Votes 5–4 to Change Start Time', ['Reckless Board Ruins Mornings', 'Brilliant Board Fixes Schedule', 'Board Forces Kids Out of Bed']],
  ['Which headline shows bias in favour of the mayor?', 'Visionary Mayor Delivers Bold New Transit Plan', ['Mayor Announces Transit Plan', 'Transit Plan Released Monday', 'Mayor to Present Plan to Council']],
  ['Which headline uses loaded language?', 'Greedy Developers Bulldoze Beloved Forest', ['Developers Clear Forest for Housing', 'Housing Project Begins on Former Woodland', 'Construction Starts on Elm Street']],
  ['Which headline is the most neutral?', 'Temperatures Reach 35 °C in Vancouver', ['Killer Heat Wave Terrorizes City', 'Glorious Sunshine Blesses City', 'Heat Ruins Summer Plans']],
  ['Which headline shows bias against the team?', 'Hopeless Hawks Stumble to Another Loss', ['Hawks Lose 3–1 to Bears', 'Bears Defeat Hawks on Saturday', 'Hawks Fall in Close Game']],
  ['Which headline is the most neutral?', 'New Phone Goes on Sale Friday', ['Amazing Phone Will Change Your Life', 'Overpriced Phone Disappoints Fans', 'Must-Have Phone Sells Out Instantly']]
];
const PURPOSE_MEDIA = [
  ['A cereal box shows a cartoon tiger and the words "Grrreat taste! Kids love it!"', 'What is the main purpose of the box design?', 'To persuade people to buy the cereal', ['To teach about tigers', 'To tell a story', 'To give nutrition facts only']],
  ['A video shows step-by-step how to fold a paper airplane.', 'What is the author\'s purpose?', 'To explain how to do something', ['To persuade you to buy paper', 'To entertain with a story', 'To share an opinion']],
  ['A poster says "Turn off the tap! Save water!" with a picture of a sad fish.', 'What is the purpose of the poster?', 'To persuade people to save water', ['To explain how fish swim', 'To tell a funny joke', 'To list facts about taps']],
  ['A comic strip shows a cat trying to catch a laser dot and crashing into a wall.', 'What is the main purpose of the comic?', 'To entertain', ['To inform about lasers', 'To persuade you to buy a cat', 'To give instructions']],
  ['A map of the zoo shows where each animal lives and where the washrooms are.', 'What is the purpose of the map?', 'To inform visitors', ['To persuade people to buy tickets', 'To entertain with a story', 'To share the author\'s feelings']],
  ['A radio ad says, "Hurry to Joe\'s Shoes — everything is half price this weekend only!"', 'What is the purpose of the ad?', 'To persuade listeners to shop', ['To explain how shoes are made', 'To tell a story about Joe', 'To report the news']],
  ['A slideshow about the water cycle shows labelled diagrams of evaporation and rain.', 'What is the purpose of the slideshow?', 'To inform', ['To persuade', 'To entertain', 'To sell umbrellas']]
];
const SAME_MEANING = [
  ['The test was a piece of cake.', 'The test was very easy.', ['The test was about cake.', 'The test was hard.', 'There was cake after the test.']], ['Maya was over the moon about her new puppy.', 'Maya was very happy about her new puppy.', ['Maya flew to the moon.', 'Maya was upset about her puppy.', 'Maya\'s puppy jumped over the moon.']],
  ['It is raining cats and dogs.', 'It is raining very hard.', ['Animals are falling from the sky.', 'It is a little sprinkly.', 'Cats and dogs like rain.']], ['Liam hit the books before the exam.', 'Liam studied hard before the exam.', ['Liam punched his books.', 'Liam threw his books away.', 'Liam forgot to study.']],
  ['Dad was feeling under the weather.', 'Dad was feeling sick.', ['Dad was standing in the rain.', 'Dad was very happy.', 'Dad checked the weather report.']], ['The puppy was as quiet as a mouse.', 'The puppy was very quiet.', ['The puppy was a mouse.', 'The puppy was noisy.', 'The puppy chased a mouse.']],
  ['We missed the boat on the concert tickets.', 'We were too late to get concert tickets.', ['We missed a real boat.', 'We got the best tickets.', 'The concert was on a boat.']], ['Chen let the cat out of the bag about the party.', 'Chen told the secret about the party.', ['Chen freed a cat.', 'Chen kept the secret.', 'Chen bought a bag.']]
];

/* ---------- vocabulary (generated from word lists) ---------- */
// [word, part of speech, definition, sentence using it correctly, wrong uses]
const DICT = [
  ['fragile', 'adj.', 'easily broken', 'Pack the fragile glasses in bubble wrap.', ['The fragile truck carried heavy steel.', 'He lifted the fragile boulder easily.', 'The fragile wall stopped the flood.']],
  ['reluctant', 'adj.', 'unwilling or hesitant', 'Sam was reluctant to jump into the cold lake.', ['Sam was reluctant and jumped in eagerly.', 'The reluctant sun shone brightly.', 'She reluctantly cheered with joy.']],
  ['abundant', 'adj.', 'more than enough; plentiful', 'Blueberries are abundant in August.', ['Water was abundant in the empty desert.', 'He had abundant nothing.', 'The abundant crumb was all we had.']],
  ['scarce', 'adj.', 'in short supply', 'Fresh water was scarce during the drought.', ['Snow is scarce in an Arctic winter.', 'The scarce crowd filled the stadium.', 'Leaves were scarce in the thick forest.']],
  ['vivid', 'adj.', 'bright and clear; full of detail', 'She had a vivid memory of her first day of school.', ['The vivid fog hid everything.', 'He gave a vivid, blurry description.', 'The room was vivid and dark.']],
  ['cautious', 'adj.', 'careful to avoid danger', 'The cautious driver slowed down on the icy road.', ['The cautious driver sped through the red light.', 'He was cautious and took wild risks.', 'The cautious cat leapt without looking.']],
  ['persuade', 'verb', 'to convince someone to do or believe something', 'Mia tried to persuade her parents to get a dog.', ['The rock persuaded down the hill.', 'He persuaded his sandwich for lunch.', 'The persuade was very long.']],
  ['ancient', 'adj.', 'very old; from long ago', 'We visited the ruins of an ancient city.', ['I bought an ancient phone yesterday that was just released.', 'The ancient baby was born today.', 'This ancient idea came to me this morning.']],
  ['observe', 'verb', 'to watch carefully', 'Scientists observe the birds through binoculars.', ['She observed the soup with a spoon.', 'He observed loudly at the crowd.', 'The observe was red.']],
  ['enormous', 'adj.', 'very large', 'An enormous whale swam beside the boat.', ['The enormous ant fit on my fingertip.', 'She wore an enormous tiny ring.', 'The enormous crumb was invisible.']],
  ['tedious', 'adj.', 'long, slow and boring', 'Sorting thousands of buttons was tedious work.', ['The tedious roller coaster was thrilling.', 'The tedious joke made everyone laugh wildly.', 'It was a quick, tedious second.']],
  ['generous', 'adj.', 'happy to give or share', 'The generous neighbour shoveled everyone\'s driveway.', ['The generous boy refused to share.', 'He was generous and kept everything.', 'The generous thief stole the money.']]
];
const DICT_SYN = { fragile: 'delicate', reluctant: 'unwilling', abundant: 'plentiful', scarce: 'rare', vivid: 'clear', cautious: 'careful', persuade: 'convince', ancient: 'very old', observe: 'watch', enormous: 'huge', tedious: 'boring', generous: 'giving' };
function dictDef() {
  const [w, pos, def, ok, wrong] = pick(DICT);
  if (Math.random() < 0.5) return mc(`${b(w)} (${pos}): ${def}.<br>Which sentence uses ${b(w)} correctly?`, ok, wrong, `${b(w)} means ${def}: "${ok}"`);
  const syn = DICT_SYN[w];
  return mc(`Read the dictionary entry: ${b(w)} (${pos}) — ${def}.<br>Which word could replace ${b(w)} in "${ok}"?`, syn, sample(Object.values(DICT_SYN).filter(x => x !== syn), 3), `The entry says ${b(w)} means ${def}.`);
}
// [sentence with target word, word, meaning, wrongs, clue type]
const CONTEXT = [
  ['Unlike her <b>gregarious</b> brother, who loved parties, Ana preferred to stay home alone.', 'gregarious', 'sociable; liking company', ['shy and quiet', 'angry', 'tired'], 'antonym'], ['The rescue team was <b>meticulous</b>; they were extremely careful to check every detail.', 'meticulous', 'very careful and precise', ['careless', 'fast', 'noisy'], 'synonym'],
  ['The once <b>barren</b> field, empty of plants, was now lush and green.', 'barren', 'empty; unable to grow plants', ['crowded', 'muddy', 'beautiful'], 'synonym'], ['Rather than being <b>frugal</b>, the king spent money wildly on parties.', 'frugal', 'careful with money', ['wasteful', 'wealthy', 'royal'], 'antonym'],
  ['Her answer was <b>ambiguous</b> — in other words, it could be understood in more than one way.', 'ambiguous', 'unclear; having more than one meaning', ['obvious', 'rude', 'short'], 'synonym'], ['The speaker was <b>eloquent</b>, but his opponent stumbled over every word.', 'eloquent', 'speaking clearly and persuasively', ['nervous', 'quiet', 'confused'], 'antonym'],
  ['The <b>arid</b> desert, or dry land, gets almost no rain.', 'arid', 'very dry', ['wet', 'cold', 'sandy'], 'synonym'], ['Though the puppy was <b>docile</b> at home, it became wild and unruly at the park.', 'docile', 'calm and easy to control', ['wild', 'hungry', 'small'], 'antonym'],
  ['The meal was <b>delectable</b>; in fact, it was the most delicious food I\'d ever tasted.', 'delectable', 'delicious', ['awful', 'cold', 'expensive'], 'synonym'], ['Instead of being <b>candid</b>, the witness hid the truth.', 'candid', 'honest and open', ['secretive', 'brave', 'nervous'], 'antonym'],
  ['The news caused widespread <b>jubilation</b>; people celebrated with great joy in the streets.', 'jubilation', 'great joy', ['sadness', 'fear', 'confusion'], 'synonym'], ['The first draft was <b>verbose</b>, but the final version was short and to the point.', 'verbose', 'using too many words', ['brief', 'funny', 'careful'], 'antonym']
];
const ctx = type => grade => {
  if (grade < 7) return null;   // these words are for older students; younger grades keep their own bank
  const pool = type ? CONTEXT.filter(c => c[4] === type) : CONTEXT, [s, w, mn, wrong] = pick(pool); return mc(`${s}<br>What does ${b(w)} mean?`, mn, wrong, `${type === 'antonym' ? 'The sentence contrasts the word with its opposite' : type === 'synonym' ? 'The sentence restates the word with a synonym' : 'Use the clues around the word'}: ${b(w)} means ${mn}.`); };
const SUFFIX_ADV = [['-ology', 'the study of', ['geology', 'zoology', 'climatology']], ['-cracy', 'rule or government by', ['democracy', 'autocracy', 'bureaucracy']], ['-phobia', 'an extreme fear of', ['claustrophobia', 'arachnophobia', 'acrophobia']], ['-cide', 'the killing of', ['pesticide', 'herbicide', 'insecticide']], ['-ism', 'a belief or practice', ['optimism', 'realism', 'heroism']], ['-ify', 'to make or cause to become', ['simplify', 'clarify', 'intensify']], ['-ence', 'the state or quality of', ['independence', 'patience', 'persistence']], ['-ist', 'a person who does or believes', ['scientist', 'pianist', 'activist']]];
const suffixAdv = () => { const [suf, mn, words] = pick(SUFFIX_ADV), w = pick(words), others = sample(SUFFIX_ADV.filter(x => x[0] !== suf).map(x => x[1]), 3); return mc(`The word ${b(w)} ends with the suffix ${b(suf)}. What does ${b(suf)} mean?`, mn, others, `${b(suf)} means "${mn}" — as in ${words.join(', ')}.`); };
const LEVELS = [['Science', 'Biology', 'Zoology', 'The study of wolves'], ['Sports', 'Team sports', 'Hockey', 'The Montreal Canadiens'], ['Literature', 'Poetry', 'Sonnets', 'Shakespeare\'s Sonnet 18'], ['Canada', 'Ontario', 'Toronto', 'The CN Tower'], ['History', 'World wars', 'The Second World War', 'D-Day'], ['Music', 'Classical music', 'Symphonies', 'Beethoven\'s Ninth Symphony'], ['Food', 'Desserts', 'Pies', 'Saskatoon berry pie'], ['Technology', 'Computers', 'Laptops', 'Battery life of laptops'], ['Health', 'Nutrition', 'Vitamins', 'Vitamin D in winter'], ['The arts', 'Painting', 'Landscape painting', 'The Group of Seven']];
const broadNarrow = () => {
  const L = pick(LEVELS), k = Math.random();
  if (k < 0.4) { const ans = L.join('; '); return mc('Which list is in order from broadest to narrowest?', ans, [L.slice().reverse().join('; '), [L[1], L[0], L[2], L[3]].join('; '), [L[0], L[2], L[1], L[3]].join('; ')], `Each topic fits inside the one before it: ${ans}.`); }
  if (k < 0.7) return mc(`Which topic is the ${b('narrowest')}?`, L[3], L.slice(0, 3), `${b(L[3])} is the most specific.`);
  const i = Math.random() < 0.5 ? 0 : 1;
  return mc(`Which topic is narrower than "${L[i]}" but broader than "${L[i + 2]}"?`, L[i + 1], L.filter((_, j) => j !== i + 1), `Order: ${L.join(' → ')}.`);
};

/* ---------- tone, formality, standard usage, audience ---------- */
const SUBJ_OBJ = [
  ['Passage A: "The bridge is 450 metres long and opened in 1997." Passage B: "The bridge is a breathtaking masterpiece that everyone must see."', 'Which passage is objective?', 'Passage A', ['Passage B', 'Both', 'Neither'], 'Passage A states measurable facts; B gives opinions.'],
  ['Passage A: "This hilarious movie is the best of the year." Passage B: "The movie, released in March, runs 112 minutes."', 'Which passage is subjective?', 'Passage A', ['Passage B', 'Both', 'Neither'], 'Words like "hilarious" and "best" show opinion.'],
  ['Passage A: "Unemployment fell to 5.8% in June, according to Statistics Canada." Passage B: "Finally, the struggling economy is showing wonderful signs of life!"', 'Which passage is objective?', 'Passage A', ['Passage B', 'Both', 'Neither'], 'A reports data with a source.'],
  ['Passage A: "The senator\'s ridiculous plan will ruin our schools." Passage B: "The senator\'s plan would cut school funding by 3%."', 'Which passage uses a subjective tone?', 'Passage A', ['Passage B', 'Both', 'Neither'], '"Ridiculous" and "ruin" are loaded words.'],
  ['Passage A: "The novel is set in 1920s Montreal and follows two sisters." Passage B: "The novel\'s gorgeous prose will break your heart."', 'Which passage is objective?', 'Passage A', ['Passage B', 'Both', 'Neither'], 'A summarizes facts about setting and plot.'],
  ['Passage A: "Many residents attended the meeting, which lasted three hours." Passage B: "Outraged residents packed the chaotic meeting for three exhausting hours."', 'Which passage is subjective?', 'Passage B', ['Passage A', 'Both', 'Neither'], '"Outraged," "chaotic" and "exhausting" show the writer\'s feelings.'],
  ['Passage A: "The team\'s pathetic defence collapsed again." Passage B: "The team allowed four goals in the third period."', 'Which passage is objective?', 'Passage B', ['Passage A', 'Both', 'Neither'], 'B states what happened without judging it.']
];
const FORMAL = [
  ['Which text is most formal?', 'We regret to inform you that the event has been postponed.', ['Bad news — the event\'s off for now.', 'Sorry guys, no event this week lol.', 'Event? Nope. Not happening.']],
  ['Which text is most formal?', 'Applicants must submit their résumés by Friday, March 3.', ['Send us your résumé by Friday, OK?', 'Get your stuff in by Friday!', 'Résumés due Fri — don\'t be late!!']],
  ['Which text is most formal?', 'I would appreciate the opportunity to discuss my grade with you.', ['Can we talk about my mark?', 'Hey, my grade is kinda unfair.', 'What\'s up with my grade?']],
  ['Which text is most formal?', 'The committee has reviewed your proposal and will respond within ten business days.', ['We looked at your idea and will get back to you soon.', 'Cool idea! We\'ll let you know.', 'Got your proposal. Stay tuned!']],
  ['Which text is most formal?', 'Please refrain from using mobile devices during the examination.', ['No phones during the test, please.', 'Put your phones away, folks!', 'Phones = zero on the test, got it?']],
  ['Which text is most formal?', 'Thank you for your prompt reply; your assistance is greatly appreciated.', ['Thanks for getting back so fast!', 'Thx, you\'re the best!', 'Awesome, thanks a bunch!']],
  ['Which text is most formal?', 'Residents are advised to remain indoors until the warning is lifted.', ['Stay inside till the warning\'s over.', 'Don\'t go out, it\'s nasty out there!', 'Seriously, stay home, people.']]
];
const EVERYDAY = [
  ['Which sentence uses standard English correctly?', 'I could have finished sooner.', ['I could of finished sooner.', 'I could\'ve of finished sooner.', 'I coulda finished sooner.'], '"Could have," not "could of."'],
  ['Which sentence uses standard English correctly?', 'Each student should bring his or her own lunch.', ['Each student should bring their own lunches all.', 'Each student should brings his own lunch.', 'Each students should bring there own lunch.'], 'Subject and pronoun agree; spelling is standard.'],
  ['Which sentence uses standard English correctly?', 'The data suggest a clear trend.', ['The data suggests a clear trend, irregardless.', 'The datas suggest a clear trend.', 'The data suggestes a clear trend.'], '"Data" is plural in formal usage, and "irregardless" is nonstandard.'],
  ['Which sentence uses standard English correctly?', 'She did well on the test.', ['She did good on the test.', 'She done well on the test.', 'She did gooder on the test.'], '"Well" is the adverb.'],
  ['Which sentence uses standard English correctly?', 'We should have gone earlier.', ['We should have went earlier.', 'We should of gone earlier.', 'We should have goed earlier.'], 'The past participle is "gone."'],
  ['Which sentence uses standard English correctly?', 'Fewer people attended this year.', ['Less people attended this year.', 'Lesser people attended this year.', 'Fewest people attended this year.'], 'Use "fewer" with countable nouns.'],
  ['Which sentence uses standard English correctly?', 'Supposedly, the store opens at nine.', ['Supposably, the store opens at nine.', 'Supposedably, the store opens at nine.', 'Suppose, the store opens at nine.'], '"Supposedly" is the standard form.'],
  ['Which sentence uses standard English correctly?', 'The reason is that the bus was late.', ['The reason is because the bus was late.', 'The reason why is because the bus was late.', 'The reason being is the bus was late.'], 'Avoid the redundant "reason is because."']
];
const AUDIENCE = [
  ['A pamphlet explains how to read a medication label, using large print and simple steps.', 'Who is the most likely audience?', 'Patients, including older adults', ['Pharmacy researchers', 'Toddlers', 'Professional athletes']],
  ['A report full of statistics recommends changes to provincial tax policy.', 'Who is the most likely audience?', 'Government decision-makers', ['Kindergarten students', 'Tourists', 'Pet owners']],
  ['A bright flyer says "Join the Junior Robotics Club! No experience needed — snacks provided!"', 'What is the purpose of the flyer?', 'To persuade students to join the club', ['To explain how robots are built', 'To report a news event', 'To criticize robotics']],
  ['An email from a principal lists the snow-day procedures for buses and pickups.', 'What is the purpose of the email?', 'To inform families about procedures', ['To entertain with a story', 'To sell bus passes', 'To persuade students to skip school']],
  ['A blog post written in casual language reviews the best budget headphones for students.', 'Who is the intended audience?', 'Students shopping for headphones', ['Audio engineers', 'Professional musicians only', 'Retired teachers']],
  ['A speech at a city council meeting urges members to save a heritage building from demolition.', 'What is the speaker\'s purpose?', 'To persuade council to protect the building', ['To describe the building\'s colour', 'To entertain the audience', 'To sell tickets']],
  ['A scientific article describes a new method for measuring glacier melt, with equations and citations.', 'Who is the intended audience?', 'Other scientists', ['Young children', 'Car buyers', 'Chefs']]
];
const MAIN_IDEA_ADV = [
  ['Libraries are no longer just places to borrow books. Many now lend tools, offer 3D printers, host coding classes and provide free internet to people who cannot afford it.', 'Libraries have become community centres offering much more than books.', ['Libraries lend tools.', '3D printers are expensive.', 'Internet access is free everywhere.']],
  ['For centuries, maps reflected the beliefs of their makers. European maps often placed Europe at the centre and drew it larger than it really is, shaping how people saw the world.', 'Maps can reflect the biases of the people who make them.', ['Europe is in the centre of the world.', 'Maps are always accurate.', 'People like maps.']],
  ['Urban beekeeping is growing. City rooftops offer flowers from parks and gardens, and city bees often produce more honey than country bees, which face pesticides on farms.', 'Cities can be surprisingly good places to keep bees.', ['Farm pesticides are illegal.', 'Rooftops are flat.', 'Honey is sweet.']],
  ['Although the Group of Seven is famous for painting Canada\'s wilderness, critics note that their empty landscapes erased the Indigenous peoples who lived there.', 'The Group of Seven\'s celebrated paintings also left out Indigenous presence.', ['The Group of Seven had seven members.', 'Wilderness is empty.', 'Critics dislike painting.']],
  ['Sleep is not wasted time. During sleep the brain stores memories, clears waste and repairs itself, which is why sleep-deprived students often struggle on tests.', 'Sleep performs essential work for the brain.', ['Students take tests.', 'The brain stores memories only at school.', 'Tests are hard.']],
  ['Fast fashion lets people buy trendy clothes cheaply, but the industry produces huge amounts of waste and often relies on poorly paid workers.', 'Cheap trendy clothing comes with serious hidden costs.', ['Clothes are cheap.', 'Fashion changes quickly.', 'Workers make clothes.']],
  ['Once dismissed as noise, the songs of humpback whales are now known to change over time and spread from group to group, much like human music trends.', 'Humpback whale songs evolve and spread in ways similar to human culture.', ['Whales are noisy.', 'Humpback whales are large.', 'Music is popular.']],
  ['Canada\'s Arctic is warming nearly four times faster than the global average. Thawing permafrost is cracking roads and buildings, and shrinking sea ice is changing how northern communities hunt and travel.', 'Rapid Arctic warming is reshaping daily life and infrastructure in the North.', ['Permafrost is frozen ground.', 'The Arctic is cold.', 'Sea ice is used for hunting.']],
  ['Handwriting may seem old-fashioned, yet studies show students who take notes by hand remember lectures better than those who type, because writing forces them to summarize instead of copying word for word.', 'Taking notes by hand can improve learning.', ['Typing is faster.', 'Lectures are long.', 'Handwriting is old-fashioned.']]
];
const MISPLACED = [
  ['Which sentence is correct?', 'Covered in mud, the dog ran into the kitchen.', ['The dog ran into the kitchen covered in mud, which was spotless.', 'Covered in mud, the kitchen had a dog run into it.', 'The kitchen ran into the dog covered in mud.'], 'The modifier "Covered in mud" must sit next to "the dog."'],
  ['Which sentence is correct?', 'Wearing a tiny hat, the cat posed for a photo.', ['The photo posed for the cat wearing a tiny hat.', 'Wearing a tiny hat, the photo showed the cat.', 'The cat posed for a photo, the tiny hat wearing.'], 'The cat is wearing the hat.'],
  ['Which sentence is correct?', 'I saw a deer with huge antlers while driving to work.', ['While driving to work, a deer with huge antlers was seen.', 'Driving to work, the deer had huge antlers.', 'I saw a deer driving to work with huge antlers.'], 'Place "while driving to work" so it describes "I," not the deer.'],
  ['Which sentence is correct?', 'The boy in the red jacket fed the ducks.', ['The boy fed the ducks in the red jacket.', 'In the red jacket, the ducks were fed by the boy.', 'The ducks in the red jacket fed the boy.'], 'The boy, not the ducks, wears the jacket.'],
  ['Which sentence is correct?', 'Hungry after the long hike, we ate every sandwich.', ['Hungry after the long hike, every sandwich was eaten.', 'Every sandwich was hungry after the long hike.', 'We ate every sandwich hungry after the long hike in the basket.'], '"Hungry after the long hike" must describe "we."'],
  ['Which sentence is correct?', 'She served cake on paper plates to the children.', ['She served cake to the children on paper plates.', 'On paper plates, the children were served cake by her.', 'She served the children on paper plates cake.'], 'Keep "on paper plates" next to "cake" so the children aren\'t on the plates.'],
  ['Which sentence is correct?', 'Barking loudly, the puppy chased the mail carrier.', ['Barking loudly, the mail carrier was chased by the puppy.', 'The mail carrier, barking loudly, was chased.', 'The puppy chased the mail carrier barking loudly at him from his truck.'], 'The puppy is barking.']
];

export const MORE_READING = {
  XDesc: qa(DESC.map(([plain, rich, w]) => [`Which sentence adds the most descriptive details to "${plain}"?`, rich, w, `It tells what kind, how and where: ${b(rich)}`])),
  XWrPu: () => { const [p, t] = pick(WRITER_PURPOSE), purposes = ['to inform', 'to persuade', 'to entertain']; return mc(`${box(t)}<p>Why did the writer write this text?</p>`, p, purposes.filter(x => x !== p), `${p === 'to inform' ? 'It gives facts or instructions' : p === 'to persuade' ? 'It tries to convince the reader' : 'It tells a fun story'}: ${b(p)}.`); },
  XTpEx: qa(TOPIC_EXP.map(([p, a, w]) => [`${box('___ ' + p)}<p>Which topic sentence best fits the paragraph?</p>`, a, w, `${b(a)} states what the whole paragraph is about.`])),
  XFoSn: qa(FACT_OP.map(([kind, stem, a, w]) => [`Complete the sentence so it states ${kind === 'Fact' ? 'a fact' : 'an opinion'}: "${stem}"`, a, w, kind === 'Fact' ? 'A fact can be proven true.' : 'An opinion tells what someone thinks or feels.'])),
  XOpRs: qa(OPINION_REASON.map(([op, a, w]) => [`Opinion: ${op}<br>Which is the best reason to support the opinion?`, a, w, `A good reason explains ${b('why')} the opinion makes sense.`])),
  XOpEx: qa(OPINION_EXAMPLE.map(([op, rs, ex, w]) => [`Opinion: ${op} Reason: ${rs}<br>Which example best supports the reason?`, ex, w, `An example gives a specific case that shows the reason is true.`])),
  XOpTb: qa(OPINION_EXAMPLE.map(([op, rs, ex, w]) => [`Opinion: ${op} | Reason: ___ | Example: ${ex}<br>Which reason best completes the table?`, rs, w, `The reason connects the opinion to the example.`])),
  XCsRv: qa(CAUSE_MATCH.map(([c, e, w]) => [`Cause: ${c}<br>What is the effect?`, e, w, `${c} → ${b(e)}`])),
  XMnTw: qa(MAIN_TWO.map(([t, a, w]) => [`${box(t)}<p>Which sentence combines the main ideas of both texts?</p>`, a, w, 'It includes the key idea from each text.'])),
  XChCc: bank(CHAR_CMP.map(([p, q, a, w]) => [p, q, a, w, 'Use details about what each character says and does.'])),
  XCcInf: bank(CC_INFO),
  XPvCc: bank(PV_CMP.map(([p, q, a, w]) => [p, q, a, w, 'Compare how each narrator feels about the same thing.'])),
  XLhIl: bank(ILL_HIST.map(([p, q, a, w]) => [p, q, a, w, 'Notice what each illustration includes or leaves out.'])),
  XMyIl: bank(MYTH_ILL.map(([p, q, a, w]) => [p, q, a, w, 'Compare the details in the two illustrations.'])),
  XCmpG: bank(GENRE_CMP.map(([p, q, a, w]) => [p, q, a, w, 'Each genre has its own purpose and features.'])),
  XAuPv: bank(AUTH_PV.map(([p, q, a, w]) => [p, q, a, w, 'Look for words that show what the author believes.'])),
  XOrdI: orderInfo,
  XThSs: bank(THEMES.map(([p, a, w]) => [p, 'What is the theme of the story?', a, w, 'The theme is the lesson the story teaches.'])),
  XInfSd: bank(INFER.map(([p, q, a, w]) => [p, q, a, w, 'Combine clues from the text with what you already know.'])),
  XSdInf: bank(SUPPORT_INFO.map(([p, q, a, w]) => [p, q, a, w, 'A supporting detail gives evidence for the main idea.'])),
  XSdLit: bank(SUPPORT_LIT.map(([p, q, a, w]) => [p, q, a, w, 'Choose the detail that shows the trait in action.'])),
  XSupEv: bank(SUPPORT_EVIDENCE.map(([p, q, a, w]) => [p, q, a, w, 'Strong evidence is specific and directly backs up the claim.'])),
  XBias: qa(BIAS.map(([q, a, w]) => [q, a, w, `${b(a)} — look for loaded words that show opinion (or none, if neutral).`])),
  XPuMm: bank(PURPOSE_MEDIA.map(([p, q, a, w]) => [p, q, a, w, 'Think about what the creator wants the audience to do, learn or feel.'])),
  XSmMn: qa(SAME_MEANING.map(([s, a, w]) => [`Which sentence has the same meaning as "${s}"?`, a, w, `The idiom means: ${b(a)}`])),
  XMmPic: qa(MISPLACED),
  XDdef: dictDef,
  CxSy: ctx('synonym'), CxAn: ctx('antonym'), CxMn: ctx(null),
  Sfx: suffixAdv, BrNr: broadNarrow,
  SbOb: bank(SUBJ_OBJ),
  Frml: qa(FORMAL.map(([q, a, w]) => [q, a, w, 'Formal writing avoids slang and contractions and uses complete, polite sentences.'])),
  EvRs: qa(EVERYDAY),
  AuPu: bank(AUDIENCE.map(([p, q, a, w]) => [p, q, a, w, 'Consider the language, content and format to identify audience and purpose.'])),
  MnId: bank(MAIN_IDEA_ADV.map(([p, a, w]) => [p, 'What is the main idea of the passage?', a, w, 'The main idea covers the whole passage, not just one detail.']))
};
