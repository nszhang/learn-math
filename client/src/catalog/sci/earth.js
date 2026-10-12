/* Science — Earth and space science (grades 1–12). Specs: { k, t, s, g, gen }. */
import { classify, pairs } from '../quiz.js';
import { ri, pick, sample, b, em, big, mc } from '../eng/words.js';

const sk = (k, t, s, g, gen) => ({ k, t, s, g, gen });
const G = (a, z) => Array.from({ length: z - a + 1 }, (_, i) => a + i);
const num = (prompt, answer, explain) => ({ type: 'num', prompt, answer, explain });
const cls = (categories, prompt, items) => classify({ categories, prompt, items });
const facts = (items, note) => pairs({ prompt: q => q, items: items.map(([q, a]) => [q, a, note ? note(a) : `The answer is ${b(a)}.`]) });

// [question, answer, [hand-picked wrong answers]]
const fx = items => pairs({ prompt: q => q, items: items.map(([q, a, w]) => [q, a, `The answer is ${b(a)}.`, [a, ...w]]) });

const MOON = ['New moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full moon', 'Waning gibbous', 'Third quarter', 'Waning crescent'];

export const EARTH_SPECS = [
  /* ================= Earth's resources and materials ================= */
  sk('EarthMat', 'Earth materials: water, rocks and soil', "Earth's resources", [1, 2], cls(['Water', 'Rocks', 'Soil'], s => `Which Earth material is described?<br>${em(s)}`, [
    ['It flows in rivers and fills the oceans.', 'Water'], ['We drink it and plants need it.', 'Water'], ['It falls from clouds as rain.', 'Water'],
    ['It is hard and can be used to build walls.', 'Rocks'], ['Mountains are made of it.', 'Rocks'], ['Pebbles and boulders are pieces of it.', 'Rocks'],
    ['Plants grow in it.', 'Soil'], ['Worms dig through it.', 'Soil'], ['It is made of tiny bits of rock and dead plants.', 'Soil']
  ].map(([s, c]) => [s, c, `This describes ${c.toLowerCase()}.`]))),
  sk('Water', 'Bodies of water', "Earth's resources", [1, 2, 3], facts([
    ['What is a huge body of salt water called?', 'An ocean'], ['What is a body of water surrounded by land called?', 'A lake'], ['What is a stream of water that flows to a lake or ocean called?', 'A river'],
    ['What is a small, still body of fresh water called?', 'A pond'], ['What is a slow-moving river of ice called?', 'A glacier'], ['What is a small, narrow river called?', 'A stream']
  ])),
  sk('NatRes', 'Natural resources', "Earth's resources", [1, 2, 3], facts([
    ['What natural resource do we get from trees to make paper?', 'Wood'], ['What natural resource do we drink?', 'Water'], ['What natural resource gives us light and heat during the day?', 'Sunlight'],
    ['What natural resource do plants grow in?', 'Soil'], ['What natural resource do we breathe?', 'Air'], ['Which natural resource is burned in many power plants?', 'Coal']
  ])),
  sk('Recycle', 'Reduce, reuse, recycle', 'Natural resources and human impacts', [1, 2, 3], cls(['Reduce', 'Reuse', 'Recycle'], s => `Is this an example of reduce, reuse or recycle?<br>${em(s)}`, [
    ['Turning off the tap while brushing your teeth.', 'Reduce'], ['Buying less packaging.', 'Reduce'], ['Walking instead of driving.', 'Reduce'],
    ['Using a jar to hold pencils.', 'Reuse'], ['Giving old clothes to a friend.', 'Reuse'], ['Packing lunch in a reusable box.', 'Reuse'],
    ['Putting cans in the blue bin.', 'Recycle'], ['Turning old bottles into new ones.', 'Recycle'], ['Composting food scraps.', 'Recycle']
  ].map(([s, c]) => [s, c, { Reduce: 'Reduce means use less.', Reuse: 'Reuse means use again.', Recycle: 'Recycle means turn into something new.' }[c]]))),
  sk('RenNon', 'Renewable and nonrenewable resources', 'Natural resources and human impacts', G(3, 10), cls(['Renewable', 'Nonrenewable'], s => `Is ${b(s)} renewable or nonrenewable?`, [
    ['sunlight', 'Renewable'], ['wind', 'Renewable'], ['trees (if replanted)', 'Renewable'], ['flowing water', 'Renewable'], ['geothermal heat', 'Renewable'],
    ['coal', 'Nonrenewable'], ['oil', 'Nonrenewable'], ['natural gas', 'Nonrenewable'], ['uranium', 'Nonrenewable'], ['copper ore', 'Nonrenewable']
  ].map(([s, c]) => [s, c, c === 'Renewable' ? 'It is replaced naturally in a human lifetime.' : 'It takes millions of years to form, so it can run out.']))),
  sk('Petrol', 'Petroleum formation and fossil fuels', 'Natural resources and human impacts', G(5, 10), fx([
    ['Oil and natural gas formed mostly from the remains of …', 'tiny ancient sea organisms', ['dinosaur bones only', 'volcanic lava', 'modern trees']],
    ['Coal formed mostly from the remains of …', 'ancient swamp plants', ['sea shells', 'sand dunes', 'glaciers']],
    ['About how long did fossil fuels take to form?', 'Millions of years', ['A few days', 'About 100 years', 'About 1,000 years']],
    ['Burning fossil fuels releases which greenhouse gas?', 'Carbon dioxide', ['Oxygen', 'Helium', 'Nitrogen']],
    ['Why are fossil fuels nonrenewable?', 'They form far more slowly than we use them.', ['They are found everywhere.', 'They are made in factories.', 'They regrow every year.']],
    ['Pumping groundwater faster than it refills can cause …', 'wells and springs to dry up', ['more rain to fall', 'oceans to freeze', 'rocks to melt']]
  ])),
  /* ================= Rocks, fossils and Earth's surface ================= */
  sk('RockMin', 'Identify rocks and minerals', 'Rocks and minerals', G(1, 5), fx([
    ['A naturally formed solid with a crystal structure is a …', 'mineral', ['fossil', 'plant', 'liquid']],
    ['A solid made of one or more minerals is a …', 'rock', ['gas', 'cloud', 'shell']],
    ['Which mineral is the hardest?', 'Diamond', ['Talc', 'Gypsum', 'Halite']],
    ['Which mineral is table salt?', 'Halite', ['Quartz', 'Diamond', 'Talc']],
    ['How can you test a mineral\'s hardness?', 'Try to scratch it.', ['Smell it.', 'Weigh it.', 'Listen to it.']],
    ['Which property describes how a mineral reflects light?', 'Lustre', ['Hardness', 'Streak', 'Mass']]
  ])),
  sk('RockTyp', 'Classify rocks as igneous, sedimentary or metamorphic', 'Rocks and minerals', [4, 5, 6, 7, 8], cls(['Igneous', 'Sedimentary', 'Metamorphic'], s => `What type of rock is described?<br>${em(s)}`, [
    ['It forms when lava cools and hardens.', 'Igneous'], ['Granite and basalt are examples.', 'Igneous'], ['It may have glassy texture or gas bubbles.', 'Igneous'],
    ['It forms from layers of sand, mud or shells pressed together.', 'Sedimentary'], ['It often contains fossils.', 'Sedimentary'], ['Sandstone and limestone are examples.', 'Sedimentary'],
    ['It forms when heat and pressure change other rocks.', 'Metamorphic'], ['Marble and slate are examples.', 'Metamorphic'], ['It may have bands of minerals.', 'Metamorphic']
  ].map(([s, c]) => [s, c, `This describes ${c.toLowerCase()} rock.`]))),
  sk('RockCyc', 'The rock cycle', 'Rocks and minerals', G(5, 8), facts([
    ['Melted rock below Earth\'s surface is called …', 'Magma'], ['What process breaks rock into small pieces?', 'Weathering'], ['What carries weathered sediments away?', 'Erosion'],
    ['Sediments become sedimentary rock through compaction and …', 'Cementation'], ['Heat and pressure turn rock into …', 'Metamorphic rock'], ['Magma that cools turns into …', 'Igneous rock']
  ])),
  sk('Fossil', 'Fossils and rock layers', 'Fossils', G(3, 8), fx([
    ['What is a fossil?', 'The preserved remains or traces of an ancient organism', ['A shiny mineral crystal', 'A rock made by a volcano', 'A living animal that is very old']],
    ['Fossils are most often found in which type of rock?', 'Sedimentary rock', ['Igneous rock', 'Metamorphic rock', 'Lava']],
    ['In undisturbed rock layers, where is the oldest layer?', 'At the bottom', ['At the top', 'In the middle', 'It is random']],
    ['A fish fossil found on a mountaintop suggests the area was once …', 'covered by water', ['a desert', 'covered in ice', 'a forest fire']],
    ['A dinosaur footprint in stone is a … fossil.', 'trace', ['body', 'mineral', 'living']],
    ['A palm-tree fossil found in a cold place suggests the climate there was once …', 'warmer', ['colder', 'the same as today', 'underwater ice']]
  ])),
  sk('SurfCh', 'Fast and slow changes to Earth\'s surface', 'Earth events', [2, 3, 4], cls(['Fast change', 'Slow change'], s => `Is this a fast or slow change to Earth's surface?<br>${em(s)}`, [
    ['A volcano erupts.', 'Fast change'], ['An earthquake cracks the ground.', 'Fast change'], ['A landslide slides down a hill.', 'Fast change'], ['A flood washes away a riverbank.', 'Fast change'],
    ['A river carves a canyon.', 'Slow change'], ['Wind wears down a rock.', 'Slow change'], ['A glacier moves through a valley.', 'Slow change'], ['Waves shape a beach.', 'Slow change']
  ].map(([s, c]) => [s, c, c === 'Fast change' ? 'It happens in minutes or days.' : 'It happens over many years.']))),
  sk('Erosion', 'Weathering, erosion and deposition', 'Earth events', G(3, 6), cls(['Weathering', 'Erosion', 'Deposition'], s => `Which process is this?<br>${em(s)}`, [
    ['Ice in a crack splits a rock apart.', 'Weathering'], ['Tree roots break a sidewalk.', 'Weathering'], ['Acid rain dissolves a statue.', 'Weathering'],
    ['A river carries sand downstream.', 'Erosion'], ['Wind blows soil off a field.', 'Erosion'], ['A glacier drags rocks across a valley.', 'Erosion'],
    ['A river drops sand at its mouth, forming a delta.', 'Deposition'], ['Wind piles sand into dunes.', 'Deposition'], ['A glacier melts and leaves boulders behind.', 'Deposition']
  ].map(([s, c]) => [s, c, { Weathering: 'Weathering breaks rock down.', Erosion: 'Erosion moves the pieces.', Deposition: 'Deposition drops the pieces in a new place.' }[c]]))),
  sk('Layers', 'Label Earth layers', 'Plate tectonics', [4, 6, 7, 8], facts([
    ['Which layer of Earth do we live on?', 'Crust'], ['Which is the thickest layer?', 'Mantle'], ['Which layer is liquid iron and nickel?', 'Outer core'], ['Which layer is the solid centre?', 'Inner core'],
    ['Which layer is the thinnest?', 'Crust'], ['Where does magma mostly come from?', 'Mantle']
  ])),
  sk('Plates', 'Tectonic plate boundaries', 'Plate tectonics', G(6, 10), cls(['Convergent', 'Divergent', 'Transform'], s => `Which type of plate boundary is described?<br>${em(s)}`, [
    ['Plates collide and form mountains such as the Himalayas.', 'Convergent'], ['An ocean plate sinks under a continental plate, forming a trench.', 'Convergent'], ['A chain of volcanoes forms where one plate sinks under another.', 'Convergent'],
    ['Plates move apart at the Mid-Atlantic Ridge.', 'Divergent'], ['New ocean floor forms as magma rises.', 'Divergent'], ['A rift valley opens in East Africa.', 'Divergent'],
    ['Plates slide past each other along the San Andreas Fault.', 'Transform'], ['Crust is neither made nor destroyed, but earthquakes are common.', 'Transform']
  ].map(([s, c]) => [s, c, { Convergent: 'Convergent plates move toward each other.', Divergent: 'Divergent plates move apart.', Transform: 'Transform plates slide past each other.' }[c]]))),
  sk('Drift', 'Evidence of continental drift and plate tectonics', 'Plate tectonics', G(7, 10), fx([
    ['The coastlines of South America and Africa …', 'fit together like puzzle pieces', ['are exactly the same length', 'are made of ice', 'never moved']],
    ['Fossils of the reptile Mesosaurus are found in both …', 'South America and Africa', ['Canada and Australia', 'Europe and Antarctica only', 'Asia and North America']],
    ['Who first proposed the idea of continental drift?', 'Alfred Wegener', ['Charles Darwin', 'Isaac Newton', 'Galileo Galilei']],
    ['The supercontinent that existed about 250 million years ago is called …', 'Pangaea', ['Atlantis', 'Gondwana Ocean', 'Laurasia Sea']],
    ['Sea-floor rocks get older …', 'farther from mid-ocean ridges', ['closer to mid-ocean ridges', 'near the surface only', 'at random']],
    ['What is thought to drive plate motion?', 'Convection currents in the mantle', ['Ocean tides', 'Wind', 'The Moon\'s light']]
  ])),
  /* ================= Water, weather and climate ================= */
  sk('WaterCyc', 'The water cycle', 'Water cycle', [5, 7, 8], () => {
    const steps = [['Evaporation', 'Liquid water is heated and turns into water vapour.'], ['Condensation', 'Water vapour cools and forms clouds.'], ['Precipitation', 'Water falls from clouds as rain, snow or hail.'],
      ['Collection (runoff)', 'Water gathers in oceans, lakes and rivers.'], ['Transpiration', 'Plants release water vapour from their leaves.'], ['Infiltration', 'Water soaks into the ground.']];
    const [name, desc] = pick(steps);
    return mc(`Which part of the water cycle is this?<br>${em(desc)}`, name, steps.map(s => s[0]), `${desc} → ${b(name)}.`);
  }),
  sk('Precip', 'Types of precipitation', 'Weather', [1, 2], facts([
    ['What is liquid water falling from clouds called?', 'Rain 🌧️'], ['What are ice crystals falling as flakes called?', 'Snow ❄️'],
    ['What are balls of ice that fall during thunderstorms called?', 'Hail 🧊'], ['What is rain that freezes into ice pellets before landing called?', 'Sleet'], ['What is very light, fine rain called?', 'Drizzle'], ['What is rain that freezes when it hits cold ground called?', 'Freezing rain']
  ])),
  sk('Severe', 'Severe weather', 'Weather', [1, 2, 3], cls(['Blizzard', 'Tornado', 'Hurricane', 'Thunderstorm'], s => `Which kind of severe weather is described?<br>${em(s)}`, [
    ['Heavy snow and strong winds make it hard to see.', 'Blizzard'], ['A spinning funnel cloud touches the ground.', 'Tornado'], ['A huge storm forms over warm ocean water with very strong winds.', 'Hurricane'],
    ['Lightning flashes and thunder booms.', 'Thunderstorm'], ['Snow drifts pile up and roads close.', 'Blizzard'], ['It brings storm surges that flood coasts.', 'Hurricane']
  ].map(([s, c]) => [s, c, `This describes a ${c.toLowerCase()}.`]))),
  sk('Thermo', 'Read a thermometer and temperature data', 'Weather', [2, 3, 4], () => {
    const t = ri(-20, 35);
    const d = t <= 0 ? 'Freezing — wear a warm coat' : t < 15 ? 'Cool — bring a jacket' : t < 25 ? 'Warm — a T-shirt is fine' : 'Hot — wear sunscreen and drink water';
    return mc(`The thermometer reads ${b(t + ' °C')}. Which description fits best?`, d, ['Freezing — wear a warm coat', 'Cool — bring a jacket', 'Warm — a T-shirt is fine', 'Hot — wear sunscreen and drink water'], `Water freezes at 0 °C; ${t} °C is ${d.split(' —')[0].toLowerCase()}.`);
  }),
  sk('WxClim', 'What\'s the difference between weather and climate?', 'Weather and climate', G(3, 7), cls(['Weather', 'Climate'], s => `Is this about weather or climate?<br>${em(s)}`, [
    ['It is raining in Toronto right now.', 'Weather'], ['Tomorrow will be windy and cold.', 'Weather'], ['A thunderstorm hit this afternoon.', 'Weather'], ['It snowed 10 cm last night.', 'Weather'],
    ['The Sahara gets very little rain each year.', 'Climate'], ['Vancouver has mild, wet winters.', 'Climate'], ['The Arctic is cold most of the year.', 'Climate'], ['Rainforests are hot and humid all year.', 'Climate']
  ].map(([s, c]) => [s, c, c === 'Weather' ? 'Weather is short-term conditions.' : 'Climate is the long-term pattern over many years.']))),
  sk('ClimFac', 'Factors affecting climate', 'Weather and climate', G(6, 10), fx([
    ['Places near the equator are usually warmer because of their …', 'latitude', ['longitude', 'time zone', 'population']],
    ['Mountain tops are colder than nearby valleys because of their …', 'altitude', ['latitude', 'longitude', 'soil type']],
    ['Coastal cities often have milder temperatures than inland cities because water …', 'heats and cools slowly', ['heats and cools quickly', 'blocks the sun', 'creates wind only']],
    ['A warm ocean current flowing past a coast makes the nearby land …', 'warmer', ['colder', 'drier', 'windless']],
    ['The side of a mountain facing moist ocean winds is usually …', 'wetter', ['drier', 'colder than the top', 'windless']],
    ['Places far from the equator receive sunlight …', 'at a lower angle', ['more directly', 'for 24 hours every day', 'only in winter']]
  ])),
  sk('AirMass', 'Identify and compare air masses', 'The atmosphere', G(6, 10), cls(['Maritime tropical', 'Continental tropical', 'Maritime polar', 'Continental polar'], s => `Which air mass forms here?<br>${em(s)}`, [
    ['Over the warm Gulf of Mexico — warm and humid.', 'Maritime tropical'], ['Over the hot deserts of Mexico — warm and dry.', 'Continental tropical'],
    ['Over the cold North Pacific — cold and humid.', 'Maritime polar'], ['Over frozen northern Canada — cold and dry.', 'Continental polar'],
    ['An air mass that brings hot, humid summer days to eastern North America.', 'Maritime tropical'], ['An air mass that brings bitter, dry cold snaps to the prairies in winter.', 'Continental polar'],
    ['An air mass that brings cool, damp, cloudy weather to the west coast.', 'Maritime polar'], ['An air mass that brings hot, dry heat waves to the southwest.', 'Continental tropical']
  ].map(([s, c]) => [s, c, 'Maritime = over water (humid); continental = over land (dry); tropical = warm; polar = cold.']))),
  sk('Greenh', 'The greenhouse effect', 'The atmosphere', G(6, 10), fx([
    ['Which gas is the main human-added greenhouse gas?', 'Carbon dioxide', ['Oxygen', 'Nitrogen', 'Argon']],
    ['Greenhouse gases warm Earth by …', 'trapping heat in the atmosphere', ['blocking all sunlight', 'making more oxygen', 'cooling the oceans']],
    ['Which human activity adds the most carbon dioxide to the air?', 'Burning fossil fuels', ['Planting trees', 'Recycling paper', 'Riding bikes']],
    ['Which gas released by cattle and landfills is a strong greenhouse gas?', 'Methane', ['Oxygen', 'Helium', 'Neon']],
    ['Without any greenhouse effect, Earth would be …', 'much colder', ['much hotter', 'exactly the same', 'underwater']],
    ['Cutting down forests can increase carbon dioxide because trees …', 'absorb carbon dioxide', ['release oxygen only at night', 'make carbon dioxide', 'block wind']]
  ])),
  sk('AtmLay', 'Layers of the atmosphere', 'The atmosphere', [6, 8], facts([
    ['In which layer does weather happen?', 'Troposphere'], ['Which layer contains the ozone layer?', 'Stratosphere'], ['In which layer do meteors burn up?', 'Mesosphere'], ['Where do auroras happen?', 'Thermosphere'], ['Which is the outermost layer?', 'Exosphere'], ['In which layer do most airliners fly?', 'Troposphere (upper part)']
  ])),

  /* ================= Astronomy ================= */
  sk('Sky', 'The daytime and night sky', 'Astronomy', [1, 2], cls(['Daytime sky', 'Night sky'], s => `When would you usually see this?<br>${big(s.split('|')[0])} ${em(s.split('|')[1])}`, [
    ['☀️|the Sun', 'Daytime sky'], ['🌈|a rainbow', 'Daytime sky'], ['🦅|birds flying high', 'Daytime sky'], ['⭐|many stars', 'Night sky'], ['🌌|the Milky Way', 'Night sky'], ['🌠|a shooting star', 'Night sky']
  ].map(([s, c]) => [s, c, c === 'Night sky' ? 'You see this when the Sun is not up.' : 'You see this when the Sun is up.']))),
  sk('DayNt', 'Earth\'s rotation and orbit', 'Astronomy', G(4, 8), fx([
    ['What causes day and night?', 'Earth spinning on its axis', ['Earth orbiting the Sun', 'The Moon blocking the Sun', 'Clouds covering the sky']],
    ['About how long does Earth take to rotate once?', '24 hours', ['1 hour', '7 days', '365 days']],
    ['About how long does Earth take to orbit the Sun?', '365 days', ['24 hours', '30 days', '10 years']],
    ['Why does the Sun seem to rise in the east?', 'Earth rotates toward the east.', ['The Sun orbits Earth.', 'The Moon pushes the Sun.', 'The east is closer to the Sun.']],
    ['What is Earth\'s path around the Sun called?', 'Its orbit', ['Its axis', 'Its equator', 'Its rotation']],
    ['About how long does the Moon take to orbit Earth?', '27 days', ['24 hours', '7 days', '365 days']]
  ])),
  sk('Seasons', 'What causes the seasons on Earth?', 'Astronomy', G(5, 10), fx([
    ['What causes Earth\'s seasons?', 'The tilt of Earth\'s axis', ['Earth\'s distance from the Sun', 'The Moon\'s phases', 'Clouds']],
    ['When the Northern Hemisphere tilts toward the Sun, it is …', 'summer in the Northern Hemisphere', ['winter in the Northern Hemisphere', 'night everywhere', 'spring everywhere']],
    ['When it is summer in Canada, what season is it in Australia?', 'Winter', ['Summer', 'Spring', 'Autumn']],
    ['On the summer solstice, the Northern Hemisphere has …', 'its longest day', ['its shortest day', 'equal day and night', 'no daylight']],
    ['In summer, sunlight strikes the ground …', 'more directly', ['at a lower angle', 'not at all', 'only at noon']],
    ['Is summer caused by Earth being closer to the Sun?', 'No — it is caused by Earth\'s tilt.', ['Yes, Earth is closest in summer.', 'Yes, the Sun gets bigger in summer.', 'No — it is caused by the Moon.']]
  ])),
  sk('Moon', 'Identify phases of the Moon', 'Astronomy', G(3, 8), () => {
    const i = ri(0, 7);
    return Math.random() < 0.5
      ? mc(`Which phase comes right after the ${b(MOON[i].toLowerCase())}?`, MOON[(i + 1) % 8], MOON, `The order is ${MOON.join(' → ')}.`)
      : mc(`Which phase is described?<br>${em(['We cannot see the lit side of the Moon.', 'A thin sliver is lit on the right and growing.', 'The right half is lit.', 'More than half is lit and growing.', 'The whole face is lit.', 'More than half is lit and shrinking.', 'The left half is lit.', 'A thin sliver is lit on the left and shrinking.'][i])}`, MOON[i], MOON, `This is the ${b(MOON[i].toLowerCase())} (as seen from the Northern Hemisphere).`);
  }),
  sk('Eclipse', 'Solar and lunar eclipses', 'Astronomy', G(5, 8), fx([
    ['In a solar eclipse, which body blocks the Sun?', 'The Moon', ['Earth', 'Mars', 'A cloud']],
    ['In a lunar eclipse, whose shadow falls on the Moon?', 'Earth\'s', ['The Sun\'s', 'Mars\'s', 'The Moon\'s own']],
    ['During a solar eclipse, the order is …', 'Sun – Moon – Earth', ['Sun – Earth – Moon', 'Earth – Sun – Moon', 'Moon – Sun – Earth']],
    ['During a lunar eclipse, the order is …', 'Sun – Earth – Moon', ['Sun – Moon – Earth', 'Moon – Sun – Earth', 'Earth – Sun – Moon']],
    ['A lunar eclipse can only happen during which Moon phase?', 'Full moon', ['New moon', 'First quarter', 'Waning crescent']],
    ['A solar eclipse can only happen during which Moon phase?', 'New moon', ['Full moon', 'Third quarter', 'Waxing gibbous']]
  ])),
  sk('Planets', 'Identify the planets in the solar system', 'Astronomy', [4, 5, 6, 8], () => {
    const p = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
    const clues = { Mercury: 'the closest planet to the Sun', Venus: 'the hottest planet', Earth: 'the only planet known to have life', Mars: 'the red planet', Jupiter: 'the largest planet', Saturn: 'the planet with the most famous rings', Uranus: 'the planet that spins on its side', Neptune: 'the farthest planet from the Sun' };
    const i = ri(0, 7);
    return Math.random() < 0.5
      ? mc(`Which planet is ${b(clues[p[i]])}?`, p[i], p, `${p[i]} is ${clues[p[i]]}.`)
      : mc(`Which planet is number ${b(i + 1)} from the Sun?`, p[i], p, `Order: ${p.join(', ')}.`);
  }),
  sk('Stars', 'Stars, constellations and the universe', 'Astronomy', [5, 6, 9, 10], fx([
    ['What is the closest star to Earth?', 'The Sun', ['Polaris', 'Sirius', 'The Moon']],
    ['Why does the Sun look brighter than other stars?', 'It is much closer to us.', ['It is the biggest star in the universe.', 'It is the only star.', 'Other stars are turned off in the day.']],
    ['A pattern of stars in the sky is a …', 'constellation', ['galaxy', 'planet', 'comet']],
    ['Why do we see different constellations in different seasons?', 'Earth moves around the Sun.', ['Stars move every night.', 'The Moon blocks some stars.', 'Constellations change colour.']],
    ['What is the name of our galaxy?', 'The Milky Way', ['Andromeda', 'The Big Dipper', 'Orion']],
    ['What powers the Sun?', 'Nuclear fusion', ['Burning coal', 'Electricity', 'Chemical batteries']],
    ['A galaxy shaped like a pinwheel with arms is a … galaxy.', 'spiral', ['elliptical', 'irregular', 'square']],
    ['The theory that the universe began from a hot, dense state is the …', 'Big Bang theory', ['Steady Sun theory', 'Plate tectonics theory', 'Cell theory']]
  ])),
];
