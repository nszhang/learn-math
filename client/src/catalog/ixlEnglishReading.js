/* English — Reading Strategies and Writing Strategies (grades 6–12). See ixlEnglish.js. */
import { classify, pairs, passageQs, ok } from './quiz.js';

const G = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const sk = (k, t, s, g, gen) => ({ k, t, s, g, gen });
const em = s => `<em>${s}</em>`;
const b = s => `<strong>${s}</strong>`;

export const READING_SPECS = [
  /* ================= Main idea ================= */
  sk('MnId', 'Determine the main idea of a passage', 'Main idea', G(7, 12), passageQs({
    items: [
      ['Coral reefs cover less than one percent of the ocean floor, yet they shelter about a quarter of all marine species. Their loss would ripple through food webs and coastal economies alike.', 'What is the main idea?', 'Coral reefs are small in area but vital to ocean life.', ['Coral reefs cover most of the ocean floor.', 'Coastal economies depend only on fishing.', 'Marine species live only in reefs.'], 'The details show how much life depends on a tiny area.'],
      ['When the printing press arrived in Europe, books became cheaper and more common. Literacy rose, ideas spread faster, and new schools opened across the continent.', 'What is the main idea?', 'The printing press changed society by spreading books and learning.', ['Books were always cheap in Europe.', 'Schools were invented before printing.', 'Literacy fell after the printing press.'], 'Each detail is an effect of the printing press.'],
      ['Many people think sleep is wasted time, but research shows that sleeping strengthens memory, repairs tissue and regulates mood. A tired brain simply works less well.', 'What is the main idea?', 'Sleep is essential for the brain and body.', ['Sleep is wasted time.', 'Research on sleep is unreliable.', 'Tired people never make mistakes.'], 'The passage argues against the "wasted time" belief.'],
      ['The city replaced its parking lot with a community garden. Neighbours now grow vegetables together, children learn where food comes from, and the block has become friendlier.', 'What is the main idea?', 'A community garden brought benefits to the neighbourhood.', ['Parking lots are always bad.', 'Children dislike vegetables.', 'The city plans to build more roads.'], 'All the details are benefits of the garden.'],
      ['Early explorers relied on the stars to cross open water. A sailor who could read the sky could find latitude, hold a course and return home safely.', 'What is the main idea?', 'Sailors once used the stars to navigate.', ['Explorers avoided open water.', 'Stars are only visible at sea.', 'Sailors never returned home.'], 'The passage explains how stars guided travel.'],
      ['Though often seen as a nuisance, earthworms enrich soil by breaking down dead leaves and mixing nutrients downward. Gardeners who welcome them see healthier plants.', 'What is the main idea?', 'Earthworms are beneficial to soil and plants.', ['Earthworms are a gardener\'s worst enemy.', 'Dead leaves harm plants.', 'Soil does not need nutrients.'], 'The word "though" signals a contrast with a common view.'],
      ['The new library offers more than books. It lends tools, hosts job-skills classes, and provides quiet rooms for students without a place to study at home.', 'What is the main idea?', 'The library serves many community needs beyond lending books.', ['The library has too many books.', 'Students prefer studying at home.', 'Tools are better than books.'], 'The details list extra services.'],
      ['Antibiotics have saved millions of lives, but overusing them lets bacteria evolve resistance. Doctors now urge patients to take them only when truly needed.', 'What is the main idea?', 'Antibiotics are valuable but must be used carefully.', ['Antibiotics should never be used.', 'Bacteria cannot change.', 'Doctors prescribe antibiotics for every illness.'], 'The passage balances a benefit and a risk.']
    ]
  })),

  /* ================= Audience, purpose and tone ================= */
  sk('Frml', 'Which text is most formal?', 'Audience, purpose and tone', G(7, 12), pairs({
    prompt: () => 'Which sentence is the most formal?',
    items: [
      ok('We regret to inform you that your application was unsuccessful.', ['Sorry, but you didn\'t get in.', 'Bad news — they said no to your form.', 'Tough luck, your application didn\'t make it.'], 'Formal writing avoids slang and contractions and uses precise wording.'),
      ok('The committee will convene at nine o\'clock to discuss the proposal.', ['The gang\'s meeting at nine to chat about the idea.', 'We\'re all getting together at nine to hash it out.', 'Come at nine and we\'ll talk it over, okay?'], 'Formal writing uses words like "convene" and "proposal".'),
      ok('I would appreciate your prompt response to this inquiry.', ['Write back ASAP, ok?', 'Hit me up when you can.', 'Let me know whenever, no biggie.'], 'Formal writing is polite and precise.'),
      ok('The experiment yielded results consistent with the hypothesis.', ['The test came out just like we guessed.', 'Turns out we were right, which is cool.', 'Our guess worked out, so yay.'], 'Scientific writing is formal and objective.'),
      ok('Customers are advised that the store will close early on holidays.', ['Heads up — we shut early on holidays!', 'Just so you know, we\'re out by noon on holidays.', 'FYI we close early holidays.'], 'Formal notices avoid slang and abbreviations.'),
      ok('It is essential that every participant complete the form in full.', ['Make sure you fill in the whole form, guys.', 'Don\'t forget to do the entire form, please.', 'You gotta finish the form.'], 'Formal writing avoids "gotta", "guys" and direct chatty commands.'),
      ok('The author contends that technology has reshaped communication.', ['The writer says tech totally changed how we talk.', 'This guy thinks tech has changed everything.', 'According to the writer, tech is huge.'], '"Contends" and "reshaped" are formal word choices.'),
      ok('Please accept our sincere apologies for the inconvenience.', ['Sorry about the hassle!', 'Our bad for the trouble.', 'Oops, sorry about that.'], 'Formal apologies are polite and complete.')
    ]
  })),
  sk('SbOb', 'Compare passages for subjective and objective tone', 'Audience, purpose and tone', G(7, 12), classify({
    categories: ['Objective', 'Subjective'],
    prompt: s => `Is the tone objective or subjective?<br>${em(s)}`,
    items: [
      ['The museum opens at 9 a.m. and closes at 5 p.m.', 'Objective', 'It states facts without personal feeling.'],
      ['The museum is the most breathtaking place in the city.', 'Subjective', '"Most breathtaking" is a personal judgment.'],
      ['The study surveyed 1,200 students across six schools.', 'Objective', 'It reports a fact.'],
      ['Honestly, the survey questions were awful.', 'Subjective', '"Awful" and "honestly" show opinion.'],
      ['Water boils at 100 degrees Celsius at sea level.', 'Objective', 'It states a measurable fact.'],
      ['I think summer is far better than winter.', 'Subjective', '"I think" and "better" show opinion.'],
      ['The novel was published in 1925 and has 218 pages.', 'Objective', 'These are verifiable facts.'],
      ['The novel\'s ending is deeply moving and unforgettable.', 'Subjective', 'The words express feelings.'],
      ['The council voted 7 to 2 to approve the budget.', 'Objective', 'It reports a result without comment.'],
      ['Sadly, the council foolishly wasted our money.', 'Subjective', '"Sadly" and "foolishly" are judgments.']
    ]
  })),
  sk('AuPu', 'Identify audience and purpose', 'Audience, purpose and tone', G(8, 12), classify({
    categories: ['To persuade', 'To inform', 'To entertain', 'To explain how to do something'],
    prompt: s => `What is the author's main purpose?<br>${em(s)}`,
    items: [
      ['First, preheat the oven to 180°C. Next, mix the flour and sugar in a large bowl.', 'To explain how to do something', 'It gives steps in order.'],
      ['Voters should reject this proposal; it will raise taxes and help no one.', 'To persuade', 'It tries to change the reader\'s opinion.'],
      ['Honeybees communicate the location of flowers by performing a waggle dance.', 'To inform', 'It states facts about bees.'],
      ['The goat wore my hat, ate my homework, and then demanded an apology.', 'To entertain', 'It is a humorous story.'],
      ['Ladies and gentlemen, you owe it to yourselves to visit this remarkable island!', 'To persuade', 'It urges the audience to act.'],
      ['To change a flat tire, loosen the lug nuts, raise the car with a jack, and then remove the wheel.', 'To explain how to do something', 'It gives instructions.'],
      ['The Amazon River discharges more water than any other river on Earth.', 'To inform', 'It presents a fact.'],
      ['Once upon a time, a dragon was too shy to breathe fire in public.', 'To entertain', 'It is a story meant to amuse.']
    ]
  })),
  sk('TnCp', 'Identify the tone of a passage', 'Audience, purpose and tone', G(8, 12), classify({
    categories: ['Sarcastic', 'Nostalgic', 'Optimistic', 'Somber', 'Humorous'],
    prompt: s => `Which word best describes the tone?<br>${em(s)}`,
    items: [
      ['Oh, wonderful — another meeting that could have been an email.', 'Sarcastic', 'The speaker says the opposite of what they mean.'],
      ['I still remember the smell of grandma\'s kitchen and the way summer evenings seemed to last forever.', 'Nostalgic', 'It longs for the past.'],
      ['Tomorrow is a new day, and I know that with effort, we will rebuild stronger than before.', 'Optimistic', 'It expects a good outcome.'],
      ['The village lay silent beneath grey skies, mourning those who would never return.', 'Somber', 'It is serious and sorrowful.'],
      ['My dog thinks the vacuum is a monster, which is odd for an animal who eats socks.', 'Humorous', 'It is meant to amuse.'],
      ['Sure, because nothing says "relaxing" like a three-hour wait at the airport.', 'Sarcastic', 'The words mean the opposite of the speaker\'s feeling.'],
      ['Those were the days — long walks home, laughing with friends, and no worries at all.', 'Nostalgic', 'It looks back fondly.'],
      ['Though the road is long, I am confident that brighter days are ahead.', 'Optimistic', 'It is hopeful.'],
      ['The funeral procession moved slowly, and not a word was spoken.', 'Somber', 'It is grave and quiet.'],
      ['I tried yoga once; the instructor said my downward dog looked more like a confused flamingo.', 'Humorous', 'It is playful and funny.']
    ]
  })),

  /* ================= Literary devices ================= */
  sk('AlSr', 'Recall the source of an allusion', 'Literary devices', G(8, 12), classify({
    categories: ['Greek or Roman mythology', 'The Bible', 'Shakespeare', 'Fairy tales and folklore'],
    prompt: a => `Where does the allusion ${b(a)} come from?`,
    items: [
      ['Achilles\' heel', 'Greek or Roman mythology', 'Achilles was vulnerable only at his heel.'],
      ['Pandora\'s box', 'Greek or Roman mythology', 'Pandora opened a jar that released troubles into the world.'],
      ['the Midas touch', 'Greek or Roman mythology', 'King Midas turned everything he touched to gold.'],
      ['a Trojan horse', 'Greek or Roman mythology', 'Greek soldiers hid inside a wooden horse to enter Troy.'],
      ['the Prodigal Son', 'The Bible', 'A parable of a son who wasted his inheritance and returned home.'],
      ['the Good Samaritan', 'The Bible', 'A parable of a stranger who helped an injured traveler.'],
      ['David and Goliath', 'The Bible', 'A young shepherd defeated a giant warrior.'],
      ['Noah\'s ark', 'The Bible', 'Noah built a boat to save animals from a flood.'],
      ['"To be, or not to be"', 'Shakespeare', 'The famous line from <em>Hamlet</em>.'],
      ['a Romeo', 'Shakespeare', 'Romeo is the romantic hero of <em>Romeo and Juliet</em>.'],
      ['Cinderella story', 'Fairy tales and folklore', 'Cinderella rises from hardship to fortune.'],
      ['the big bad wolf', 'Fairy tales and folklore', 'The villain of <em>The Three Little Pigs</em> and <em>Little Red Riding Hood</em>.']
    ]
  })),
  sk('FgSp', 'Interpret the figure of speech', 'Literary devices', G(7, 12), pairs({
    prompt: s => `What does this mean?<br>${em(s)}`,
    items: [
      ['The classroom was a zoo.', 'The classroom was loud and chaotic.', 'A metaphor comparing the room to a zoo.'],
      ['Her words were daggers.', 'Her words were hurtful.', 'A metaphor: words that wound like blades.'],
      ['He has a heart of stone.', 'He is unfeeling.', 'A metaphor for lack of compassion.'],
      ['Time is a thief.', 'Time takes things from us without notice.', 'A metaphor comparing time to a thief.'],
      ['The city never sleeps.', 'The city is busy at all hours.', 'Personification of the city.'],
      ['I\'ve told you a million times.', 'I have told you many times.', 'Hyperbole: an exaggeration for effect.'],
      ['The news was music to her ears.', 'She was delighted by the news.', 'A metaphor for welcome news.'],
      ['Life is a rollercoaster.', 'Life has many ups and downs.', 'A metaphor for life\'s changes.'],
      ['He was boiling with anger.', 'He was extremely angry.', 'A metaphor for intense anger.'],
      ['Her smile lit up the room.', 'Her smile made everyone feel happier.', 'A metaphor: her smile is like a light.']
    ]
  })),
  sk('FgEh', 'Classify the figure of speech: euphemism, hyperbole, oxymoron, paradox', 'Literary devices', G(9, 12), classify({
    categories: ['Euphemism', 'Hyperbole', 'Oxymoron', 'Paradox'],
    prompt: s => `Which figure of speech is this?<br>${em(s)}`,
    items: [
      ['Our dog passed away last night.', 'Euphemism', 'A gentler way to say "died".'],
      ['I\'m so hungry I could eat the entire cafeteria.', 'Hyperbole', 'An extreme exaggeration.'],
      ['It was a deafening silence.', 'Oxymoron', 'Two contradictory words side by side.'],
      ['The more you learn, the less you know.', 'Paradox', 'It seems contradictory but holds a truth.'],
      ['He is between jobs right now.', 'Euphemism', 'A softer way of saying "unemployed".'],
      ['This bag weighs a ton.', 'Hyperbole', 'An exaggeration.'],
      ['The movie was awfully good.', 'Oxymoron', '"Awfully good" combines opposites.'],
      ['I can resist everything except temptation.', 'Paradox', 'A seeming contradiction that is playfully true.'],
      ['The company is downsizing its workforce.', 'Euphemism', 'A mild term for laying people off.'],
      ['I have a million things to do today.', 'Hyperbole', 'An exaggeration for emphasis.'],
      ['Jumbo shrimp', 'Oxymoron', 'Large and small together.'],
      ['Wise fools speak only the truth.', 'Paradox', 'A contradiction that reveals a deeper idea.']
    ]
  })),
  sk('FgAn', 'Classify the figure of speech: anaphora, antithesis, apostrophe, assonance, chiasmus, understatement', 'Literary devices', G(10, 12), classify({
    categories: ['Anaphora', 'Antithesis', 'Apostrophe', 'Assonance', 'Chiasmus', 'Understatement'],
    prompt: s => `Which figure of speech is this?<br>${em(s)}`,
    items: [
      ['We will not tire, we will not falter, we will not fail.', 'Anaphora', 'The phrase "we will not" repeats at the start of each clause.'],
      ['That\'s one small step for man, one giant leap for mankind.', 'Antithesis', 'It contrasts "small step" with "giant leap".'],
      ['Oh, Death, where is thy sting?', 'Apostrophe', 'The speaker addresses an abstract idea as if it could hear.'],
      ['The rain in Spain stays mainly in the plain.', 'Assonance', 'The long "a" vowel sound repeats.'],
      ['Never let a fool kiss you, or a kiss fool you.', 'Chiasmus', 'The word order is reversed: fool-kiss / kiss-fool.'],
      ['"It\'s just a scratch," said the knight whose arm had been cut off.', 'Understatement', 'It makes something serious seem minor.'],
      ['Every day, every night, every hour, I think of you.', 'Anaphora', '"Every" repeats at the start of each phrase.'],
      ['To err is human; to forgive, divine.', 'Antithesis', 'Contrasting ideas in parallel form.'],
      ['Rise, O sun, and warm my weary bones!', 'Apostrophe', 'The speaker addresses the sun directly.'],
      ['Fair is foul, and foul is fair.', 'Chiasmus', 'The pair of words is reversed in the second half.'],
      ['The Sahara is a bit dry.', 'Understatement', 'The desert is extremely dry.'],
      ['Try to light the fire at night.', 'Assonance', 'The long "i" vowel sound repeats in light, fire, night.']
    ]
  })),
  sk('FgRv', 'Classify the figure of speech: review', 'Literary devices', G(10, 12), classify({
    categories: ['Euphemism', 'Hyperbole', 'Oxymoron', 'Paradox', 'Anaphora', 'Antithesis', 'Apostrophe', 'Understatement'],
    prompt: s => `Which figure of speech is this?<br>${em(s)}`,
    items: [
      ['He\'s gone to a better place.', 'Euphemism', 'A gentle way to say someone died.'],
      ['I\'ve read this book a thousand times.', 'Hyperbole', 'An exaggeration.'],
      ['Bittersweet memories', 'Oxymoron', 'Opposite words combined.'],
      ['Nobody goes to that restaurant anymore — it\'s too crowded.', 'Paradox', 'It seems contradictory yet makes a point.'],
      ['Let us work together, let us build together, let us win together.', 'Anaphora', '"Let us" repeats at the start of each clause.'],
      ['We are here to heal, not to harm.', 'Antithesis', 'Contrasting ideas side by side.'],
      ['O Captain! my Captain!, hear the bells.', 'Apostrophe', 'Addresses someone who is not present.'],
      ['The hurricane caused some minor inconvenience to the town it flattened.', 'Understatement', 'It downplays a major disaster.']
    ]
  })),
  sk('FgEf', 'Analyze the effects of figures of speech on meaning and tone', 'Literary devices', G(8, 12), pairs({
    prompt: q => q,
    items: [
      ['<em>"The silence in the room was deafening."</em> What effect does the oxymoron create?', 'It emphasizes how intense and uncomfortable the quiet is.', 'Combining silence and deafening stresses the tension.', ['It emphasizes how intense and uncomfortable the quiet is.', 'It shows the room was full of noise.', 'It shows that the speaker is joking.', 'It explains how sound travels.']],
      ['<em>"The wind howled and clawed at the shutters."</em> What effect does the personification create?', 'It makes the storm seem menacing and alive.', 'Giving the wind animal actions builds a threatening mood.', ['It makes the storm seem menacing and alive.', 'It shows the wind is calm.', 'It lists facts about wind speed.', 'It makes the tone humorous.']],
      ['<em>"I\'ve been waiting here for centuries."</em> What effect does the hyperbole create?', 'It stresses the speaker\'s impatience.', 'Exaggeration emphasizes how long the wait felt.', ['It stresses the speaker\'s impatience.', 'It gives the exact time spent waiting.', 'It shows that the speaker is very old.', 'It creates a calm tone.']],
      ['<em>"We shall fight on the beaches, we shall fight on the hills."</em> What effect does the repetition create?', 'It builds determination and rhythm.', 'Anaphora creates a powerful, rousing tone.', ['It builds determination and rhythm.', 'It confuses the audience.', 'It shows the speaker is unsure.', 'It lists locations for a map.']],
      ['<em>"It\'s only a flesh wound," said the knight, bleeding heavily.</em> What effect does the understatement create?', 'It adds humour by downplaying a serious injury.', 'The gap between words and reality is funny.', ['It adds humour by downplaying a serious injury.', 'It shows the injury is minor.', 'It makes the tone tragic.', 'It explains first aid.']],
      ['<em>"Her laugh was sunshine after rain."</em> What effect does the metaphor create?', 'It conveys warmth and relief.', 'The comparison suggests brightness and comfort.', ['It conveys warmth and relief.', 'It describes the weather.', 'It shows that she is angry.', 'It suggests the laugh was loud and harsh.']],
      ['<em>"The company is rightsizing."</em> What effect does the euphemism create?', 'It softens an unpleasant truth about layoffs.', 'A mild word hides the harsher reality.', ['It softens an unpleasant truth about layoffs.', 'It makes the news sound more shocking.', 'It shows that the company is growing.', 'It uses exact numbers.']],
      ['<em>"O Fortune, why do you torment me?"</em> What effect does the apostrophe create?', 'It shows the speaker\'s intense emotion.', 'Speaking to an abstract idea dramatizes feeling.', ['It shows the speaker\'s intense emotion.', 'It proves Fortune is a real person.', 'It signals a calm, factual tone.', 'It describes a setting.']]
    ]
  })),

  /* ================= Analyzing literature / informational texts ================= */
  sk('ShS1', 'Analyze short stories: set 1', 'Analyzing literature', G(9, 12), passageQs({
    title: 'Read the story excerpt.',
    items: [
      ['Marisol had practised the violin for months. As she stepped onto the stage, her hands trembled, but she remembered her teacher\'s words: <em>"Play for the music, not the crowd."</em> She breathed, raised her bow, and the first note rang clear.', 'What is the best theme of this excerpt?', 'Preparation and focus can overcome nervousness.', ['Music is more important than people.', 'Teachers give bad advice.', 'Stage fright cannot be beaten.'], 'Her practice and her teacher\'s advice help her play despite fear.'],
      ['Every morning, old Mr. Tran fed the pigeons in the square, though the city had posted a sign forbidding it. Children crowded around him, laughing. The day the sign was removed, the square seemed strangely empty without his scolding glare.', 'What can be inferred about Mr. Tran?', 'He is a kind person people have come to value.', ['He is a bitter man who hates children.', 'He wrote the sign.', 'He dislikes pigeons.'], 'The children gather around him, and the square feels empty when he is gone.'],
      ['The storm had knocked out the power for three days. At first the family argued over the dead phones. By the third night they were sitting on the porch, sharing stories under the stars, and no one wanted the lights to come back.', 'How does the family change in the story?', 'They grow closer once distractions are gone.', ['They become angry at one another.', 'They move to a new house.', 'They fear the dark more.'], 'They move from arguing to sharing stories.'],
      ['Dev had always laughed at his sister\'s clumsy drawings. When he found them framed on the wall of her art school, each one signed with a confident flourish, he felt something shift. He stood quietly for a long time.', 'What does Dev most likely feel at the end?', 'Surprised and a little ashamed', ['Surprised and a little ashamed', 'Angry and jealous', 'Bored and unimpressed', 'Proud of his own art'], 'Staring quietly suggests he is reconsidering his past mockery.'],
      ['The village believed the old lighthouse was haunted, so no one visited. Lena climbed it one night and found only a tangle of nests and a window with a view of every star. She came down changed, eager to tell the others.', 'How does the author create the setting\'s mood?', 'By contrasting fear with wonder', ['By contrasting fear with wonder', 'By listing facts about lighthouses', 'By describing a busy harbour', 'By using humour throughout'], 'The haunted rumour gives way to a peaceful, wondrous discovery.'],
      ['"I\'m fine," Tomás said, for the third time, as he rubbed his sore ankle and tried to hide his limp. The coach raised an eyebrow, but the whistle blew and he jogged back onto the field.', 'What does the repetition of "I\'m fine" suggest?', 'Tomás is hiding his pain.', ['Tomás is confident he can win.', 'The coach is angry at him.', 'The game is almost over.'], 'The limp contradicts the words.']
    ]
  })),
  sk('ShS2', 'Analyze short stories: set 2', 'Analyzing literature', G(9, 12), passageQs({
    title: 'Read the story excerpt.',
    items: [
      ['The two brothers divided the farm down the middle, each building a high fence. Years later, a flood washed the fences away, and the brothers worked side by side to rebuild the fields. This time, they left the land open.', 'What theme is developed?', 'Cooperation matters more than division.', ['Floods are unavoidable.', 'Fences keep farms safe.', 'Farming is hard work.'], 'They leave the land open after working together.'],
      ['Ines tucked the letter into her pocket without reading it. All morning her thoughts drifted back to the envelope; she checked it twice during math and once more at lunch. By afternoon she had still not opened it.', 'Which detail best reveals Ines\'s feelings?', 'She keeps checking the letter but cannot open it.', ['She tucks the letter into her pocket.', 'She has math class in the morning.', 'She eats lunch.'], 'Her repeated checking shows anxiety.'],
      ['Grandfather\'s watch had not worked in years, yet he wound it each night. "It keeps the right time for one thing," he would say, and tap his chest. Maya never understood until the night he gave it to her.', 'What does the watch symbolize?', 'Memories and love that last beyond time', ['The need to be on time', 'Poor craftsmanship', 'The cost of old objects'], 'He taps his chest, tying the watch to his heart and memory.'],
      ['The new student sat alone, hugging her lunch bag. Jonas almost walked past, but remembered his own first day. He carried his tray over and said, "Is this seat taken?"', 'What motivates Jonas to act?', 'His own memory of feeling lonely', ['A teacher\'s order', 'A wish to be popular', 'Hunger'], 'He remembers his own first day.'],
      ['The desert stretched on, white and silent. Rafi counted his steps to keep from thinking about thirst. When he finally saw the green smudge of the oasis, he laughed aloud, a cracked and wondering sound.', 'How does the conflict in the passage fit the type of conflict?', 'Person versus nature', ['Person versus person', 'Person versus society', 'Person versus technology'], 'Rafi struggles against the desert environment.'],
      ['Mara baked bread for the whole street, though no one ever thanked her. One winter morning, a basket appeared on her doorstep, filled with jam, wool socks and a note: <em>"For the baker."</em>', 'What is the effect of the ending?', 'It shows that kindness is eventually returned.', ['It shows that Mara is poor.', 'It reveals a mystery to solve.', 'It proves winters are cold.'], 'The gifts are a thank-you for her kindness.']
    ]
  })),
  sk('InfD1', 'Analyze the development of informational passages: set 1', 'Analyzing informational texts', G(9, 12), classify({
    categories: ['Cause and effect', 'Compare and contrast', 'Problem and solution', 'Chronological order', 'Description'],
    prompt: s => `What text structure does this passage mainly use?<br>${em(s)}`,
    items: [
      ['Because the river flooded, crops were destroyed. As a result, food prices rose throughout the region.', 'Cause and effect', 'It links a cause to its effects.'],
      ['Unlike the arctic fox, which has thick white fur, the fennec fox has thin sandy fur and enormous ears.', 'Compare and contrast', 'It shows differences between two animals.'],
      ['The town faced a severe shortage of clean water. To solve it, engineers built a new well and a filtration plant.', 'Problem and solution', 'It names a problem and its fix.'],
      ['In 1903 the Wright brothers made their first flight. By 1927 Lindbergh had crossed the Atlantic, and by 1969 humans were on the Moon.', 'Chronological order', 'Events are told in time order.'],
      ['The cottage sat at the end of a gravel path, its blue shutters faded, its garden crowded with lavender and bees.', 'Description', 'It paints a picture with details.'],
      ['Both bats and birds can fly, but bats are mammals with leathery wings, while birds have feathers.', 'Compare and contrast', 'It shows similarities and differences.'],
      ['Many students struggled to focus. The school responded by starting later and adding a mid-morning break.', 'Problem and solution', 'A problem is followed by a solution.'],
      ['Heavy smoking can damage the lungs, which leads to breathing problems and an increased risk of cancer.', 'Cause and effect', 'Smoking (cause) leads to health problems (effects).']
    ]
  })),
  sk('InfD2', 'Analyze the development of informational passages: set 2', 'Analyzing informational texts', G(10, 12), passageQs({
    title: 'Read the passage.',
    items: [
      ['Honeybees are in decline. Pesticides weaken them, habitat loss reduces their food, and diseases spread rapidly through crowded hives. Scientists recommend planting wildflowers and limiting harmful chemicals.', 'How does the last sentence function in the passage?', 'It offers solutions to the problems described.', ['It introduces a new problem.', 'It gives a historical example.', 'It describes a setting.'], 'The last sentence recommends actions to address the problems.'],
      ['Some critics say electric cars are not truly green because their batteries require mining. However, studies show that over their lifetimes, electric cars produce far fewer emissions than gas cars.', 'What is the purpose of the word "However"?', 'It introduces a response to a criticism.', ['It shows a cause and effect.', 'It repeats the claim.', 'It adds an example.'], '"However" signals contrast with the critics\' claim.'],
      ['The Roman aqueducts carried water over valleys using arches. This design spread the weight evenly. As a result, many structures still stand after two thousand years.', 'What does the phrase "As a result" show?', 'The durability is an effect of the design.', ['It begins a new topic.', 'It compares two designs.', 'It gives a personal opinion.'], '"As a result" signals an effect.'],
      ['Glaciers are retreating worldwide. In Alaska, some have shrunk by miles; in the Alps, ski resorts are moving higher up the mountains.', 'What is the function of the second sentence?', 'It supplies examples supporting the first sentence.', ['It contradicts the first sentence.', 'It introduces a counterclaim.', 'It defines a term.'], 'The Alaska and Alps details back up the claim.'],
      ['Cities are warming faster than the countryside. Pavement and buildings absorb heat all day and release it at night, a phenomenon known as the urban heat island effect.', 'What does the second sentence do?', 'It explains the cause of the phenomenon in the first sentence.', ['It explains the cause of the phenomenon in the first sentence.', 'It introduces an unrelated topic.', 'It states the author\'s opinion.', 'It compares two cities.']],
      ['Many believe the Great Wall can be seen from space. In fact, astronauts report that it is almost invisible to the naked eye from orbit.', 'What is the purpose of "In fact"?', 'It introduces a correction of a common belief.', ['It introduces a correction of a common belief.', 'It adds another example.', 'It signals a conclusion.', 'It marks a change in time.']],
      ['First, the settlers cleared the forest. Next, they planted wheat. Finally, they built a mill by the river.', 'How is the passage organized?', 'In chronological order', ['In chronological order', 'By comparison and contrast', 'By cause and effect', 'By problem and solution']],
      ['Rising rents are forcing families out of the city. In response, the council has capped annual rent increases and funded new affordable housing.', 'How does the second sentence relate to the first?', 'It describes actions taken to address the problem.', ['It describes actions taken to address the problem.', 'It repeats the problem.', 'It contrasts two cities.', 'It gives a definition.']]
    ]
  })),
  sk('ArgT', 'Trace an argument', 'Analyzing informational texts', G(9, 12), classify({
    categories: ['Claim', 'Reason', 'Evidence', 'Counterclaim'],
    prompt: s => `In an argument about school start times, what role does this sentence play?<br>${em(s)}`,
    items: [
      ['Schools should start later in the morning.', 'Claim', 'It states the main position.'],
      ['Teenagers need more sleep because their body clocks shift later.', 'Reason', 'It explains why the claim is true.'],
      ['A study of 9,000 students found that those starting after 8:30 a.m. had higher grades.', 'Evidence', 'It cites data supporting the reason.'],
      ['Some argue that later start times would interfere with after-school sports.', 'Counterclaim', 'It presents an opposing view.'],
      ['School start times should be moved later to protect students\' health.', 'Claim', 'It states the position.'],
      ['Sleep-deprived students are more likely to be involved in car accidents.', 'Reason', 'It gives a reason in favour of the claim.'],
      ['According to the American Academy of Pediatrics, adolescents need 8–10 hours of sleep.', 'Evidence', 'It cites an authority.'],
      ['Critics worry that bus schedules would be difficult to change.', 'Counterclaim', 'It raises an objection.']
    ]
  })),
  sk('RhHs', 'Analyze rhetorical strategies in historical texts', 'Analyzing informational texts', G(10, 12), pairs({
    prompt: q => q,
    items: [
      ['<em>"…government of the people, by the people, for the people, shall not perish from the earth."</em> (Lincoln) Which strategy is used?', 'Parallel structure and repetition', 'Repeating the "of/by/for the people" pattern builds rhythm and emphasis.', ['Parallel structure and repetition', 'A statistic', 'A personal anecdote', 'A rhetorical question']],
      ['<em>"I have a dream today!"</em> (King) repeated at the start of successive sentences is an example of …', 'Anaphora', 'Repetition at the start of sentences creates rhythm and emphasis.', ['Anaphora', 'Understatement', 'Euphemism', 'Allusion']],
      ['<em>"Ask not what your country can do for you — ask what you can do for your country."</em> (Kennedy) uses …', 'Antithesis (contrasting ideas)', 'It contrasts what the country does with what citizens do.', ['Antithesis (contrasting ideas)', 'Hyperbole', 'Apostrophe', 'Onomatopoeia']],
      ['<em>"The only thing we have to fear is fear itself."</em> (Roosevelt) mainly appeals to …', 'Pathos by calming fear', 'It addresses the audience\'s emotions to inspire confidence.', ['Pathos by calming fear', 'Logos using statistics', 'Ethos using credentials', 'Humour']],
      ['A speaker opens, <em>"Fellow citizens, as a veteran of three wars, I have seen what hardship can do."</em> This is mainly an appeal to …', 'Ethos', 'The speaker establishes credibility through experience.', ['Ethos', 'Pathos', 'Logos', 'Irony']],
      ['A speaker asks, <em>"Can we truly call ourselves free while any among us remains in chains?"</em> This is …', 'A rhetorical question', 'It is asked for effect, not for an answer.', ['A rhetorical question', 'A statistic', 'A definition', 'A flashback']],
      ['A writer states, <em>"Unemployment has fallen from 9% to 5% in four years."</em> This is mainly an appeal to …', 'Logos', 'Numbers are logical evidence.', ['Logos', 'Pathos', 'Ethos', 'Satire']],
      ['A speaker compares a struggling country to a ship in a storm. This is an …', 'Extended metaphor (analogy)', 'It explains one idea by comparing it to another.', ['Extended metaphor (analogy)', 'Euphemism', 'Oxymoron', 'Understatement']]
    ]
  })),

  /* ================= Organizing writing ================= */
  sk('BrNr', 'Order topics from broadest to narrowest', 'Organizing writing', G(7, 12), pairs({
    prompt: () => 'Which list is in order from broadest to narrowest?',
    items: [
      ok('Animals; mammals; dogs; beagles', ['Beagles; dogs; mammals; animals', 'Dogs; animals; beagles; mammals', 'Mammals; animals; beagles; dogs'], 'Each topic is a more specific part of the one before.'),
      ok('Sports; ball games; basketball; free throws', ['Free throws; basketball; ball games; sports', 'Basketball; sports; free throws; ball games', 'Ball games; free throws; sports; basketball'], 'Start with the biggest category.'),
      ok('Literature; novels; mystery novels; Sherlock Holmes stories', ['Sherlock Holmes stories; mystery novels; novels; literature', 'Novels; literature; Sherlock Holmes stories; mystery novels', 'Mystery novels; Sherlock Holmes stories; literature; novels'], 'Each item is narrower than the last.'),
      ok('Science; biology; botany; photosynthesis', ['Photosynthesis; botany; biology; science', 'Biology; science; photosynthesis; botany', 'Botany; photosynthesis; science; biology'], 'Science contains biology, which contains botany.'),
      ok('Transportation; cars; electric cars; battery life', ['Battery life; electric cars; cars; transportation', 'Cars; transportation; battery life; electric cars', 'Electric cars; battery life; transportation; cars'], 'The broadest is transportation.'),
      ok('Music; string instruments; violins; vibrato', ['Vibrato; violins; string instruments; music', 'Violins; music; vibrato; string instruments', 'String instruments; vibrato; music; violins'], 'Each topic narrows the focus.'),
      ok('Geography; Canada; Ontario; Toronto', ['Toronto; Ontario; Canada; geography', 'Canada; geography; Toronto; Ontario', 'Ontario; Toronto; geography; Canada'], 'City is narrower than province, country, field.'),
      ok('Health; nutrition; vitamins; vitamin C', ['Vitamin C; vitamins; nutrition; health', 'Nutrition; health; vitamin C; vitamins', 'Vitamins; vitamin C; health; nutrition'], 'Health is the broadest.')
    ]
  })),
  sk('OrgT', 'Organize information by topic', 'Organizing writing', G(7, 12), pairs({
    prompt: q => q,
    items: [
      ['An essay on exercise has the sections <em>Physical benefits</em>, <em>Mental benefits</em> and <em>Getting started</em>. Under which section does "Regular exercise lowers stress and improves mood" belong?', 'Mental benefits', 'It describes an effect on the mind.', ['Mental benefits', 'Physical benefits', 'Getting started']],
      ['An essay on exercise has the sections <em>Physical benefits</em>, <em>Mental benefits</em> and <em>Getting started</em>. Under which section does "Strengthens the heart and bones" belong?', 'Physical benefits', 'It describes effects on the body.', ['Physical benefits', 'Mental benefits', 'Getting started']],
      ['An essay on exercise has the sections <em>Physical benefits</em>, <em>Mental benefits</em> and <em>Getting started</em>. Under which section does "Begin with ten-minute walks" belong?', 'Getting started', 'It is advice for beginners.', ['Getting started', 'Physical benefits', 'Mental benefits']],
      ['A report on volcanoes has the sections <em>Causes</em>, <em>Types</em> and <em>Safety</em>. Where does "Shield, cinder cone and composite volcanoes differ in shape" belong?', 'Types', 'It describes kinds of volcanoes.', ['Types', 'Causes', 'Safety']],
      ['A report on volcanoes has the sections <em>Causes</em>, <em>Types</em> and <em>Safety</em>. Where does "Magma rises when tectonic plates move" belong?', 'Causes', 'It explains how eruptions begin.', ['Causes', 'Types', 'Safety']],
      ['A report on volcanoes has the sections <em>Causes</em>, <em>Types</em> and <em>Safety</em>. Where does "Residents should know their evacuation routes" belong?', 'Safety', 'It is about protecting people.', ['Safety', 'Causes', 'Types']],
      ['A travel brochure has the sections <em>Food</em>, <em>Sights</em> and <em>Getting around</em>. Where does "The subway runs every five minutes" belong?', 'Getting around', 'It is about transportation.', ['Getting around', 'Food', 'Sights']],
      ['A travel brochure has the sections <em>Food</em>, <em>Sights</em> and <em>Getting around</em>. Where does "The old castle overlooks the harbour" belong?', 'Sights', 'It describes something to see.', ['Sights', 'Food', 'Getting around']]
    ]
  })),

  /* ================= Topic sentences and thesis statements ================= */
  sk('TpSn', 'Choose the topic sentence that best captures the main idea', 'Topic sentences and thesis statements', G(7, 12), pairs({
    prompt: q => `Which topic sentence best introduces this paragraph?<br><div class="passage">${q}</div>`,
    items: [
      ['…Dogs can sniff out explosives. They guide people who are blind. Some even detect illnesses before doctors can.', 'Dogs perform many important jobs for people.', 'It covers all the examples.', ['Dogs perform many important jobs for people.', 'Dogs are the best pets.', 'Some dogs are afraid of loud noises.', 'People should adopt shelter animals.']],
      ['…It reduces stress, improves focus, and gives students a break from screens. Many schools now schedule it daily.', 'Outdoor recess benefits students in several ways.', 'It matches the listed benefits.', ['Outdoor recess benefits students in several ways.', 'Recess should be shortened.', 'Screens are harmful.', 'Schools have many schedules.']],
      ['…Cutting emissions, protecting forests, and investing in clean energy can slow climate change. Each step helps.', 'There are practical ways to combat climate change.', 'It sums up the actions listed.', ['There are practical ways to combat climate change.', 'Forests grow very slowly.', 'Climate change is a myth.', 'Clean energy costs too much.']],
      ['…The Nile provided fertile soil, a water supply, and a route for trade. Cities grew along its banks.', 'The Nile River was essential to ancient Egyptian civilization.', 'It captures the paragraph\'s focus.', ['The Nile River was essential to ancient Egyptian civilization.', 'Egypt is a hot country.', 'Rivers flow into the sea.', 'Trade is important today.']],
      ['…Volunteers shelve books, run reading nights, and help neighbours learn computer skills.', 'Volunteers keep the library running and serving the community.', 'It generalizes the examples.', ['Volunteers keep the library running and serving the community.', 'Libraries have too many books.', 'Computers are expensive.', 'Reading is boring.']],
      ['…Dark chocolate contains antioxidants, may lower blood pressure, and can improve mood when eaten in moderation.', 'Eaten in moderation, dark chocolate offers some health benefits.', 'It sums up the supporting details.', ['Eaten in moderation, dark chocolate offers some health benefits.', 'Chocolate is sweet.', 'Candy bars should be banned.', 'Mood is hard to measure.']]
    ]
  })),
  sk('ThSt', 'Identify thesis statements', 'Topic sentences and thesis statements', G(8, 12), pairs({
    prompt: () => 'Which sentence is the strongest thesis statement for an essay?',
    items: [
      ok('Cities should invest in public transit because it reduces pollution, saves money and eases traffic.', ['This essay is about public transit.', 'Public transit exists in many cities.', 'What are the problems with public transit?'], 'A thesis states an arguable position and previews reasons.'),
      ok('Schools should teach financial literacy because it prepares students for adult life.', ['Financial literacy is a topic in some schools.', 'In this paper I will talk about money.', 'Many students have bank accounts.'], 'A thesis makes a debatable claim.'),
      ok('Social media has weakened face-to-face communication among teenagers.', ['Social media was invented in the 2000s.', 'I will discuss social media today.', 'Is social media good or bad?'], 'It takes a position that can be argued.'),
      ok('Zoos play a vital role in protecting endangered species and educating the public.', ['Zoos are places where animals live.', 'The zoo opens at nine.', 'Some people like zoos and some do not.'], 'It takes a stand with reasons.'),
      ok('Homework should be limited because excessive assignments harm students\' health and family time.', ['Homework is assigned in most schools.', 'This essay will examine homework.', 'How much homework do students get?'], 'A thesis is a clear arguable claim.'),
      ok('The novel\'s setting shapes its characters\' choices and ultimately drives its tragic ending.', ['The novel is set in a village.', 'The first chapter introduces the setting.', 'Settings are important in many novels.'], 'A literary thesis makes an interpretive claim.'),
      ok('Renewable energy is the most practical solution to the energy crisis.', ['Energy is used in houses.', 'Wind turbines are tall.', 'Many countries have power plants.'], 'It makes a debatable claim.'),
      ok('Standardized testing should be reformed because it fails to measure creativity and critical thinking.', ['Standardized tests are taken in spring.', 'My topic is testing.', 'Tests have questions.'], 'A strong thesis takes a position and gives a reason.')
    ]
  })),

  /* ================= Developing and supporting arguments ================= */
  sk('FcOp', 'Distinguish facts from opinions', 'Developing and supporting arguments', G(7, 12), classify({
    categories: ['Fact', 'Opinion'],
    prompt: s => `Is this a fact or an opinion?<br>${em(s)}`,
    items: [
      ['Canada has ten provinces and three territories.', 'Fact', 'It can be verified.'],
      ['Canada is the most beautiful country in the world.', 'Opinion', '"Most beautiful" is a personal judgment.'],
      ['The human heart has four chambers.', 'Fact', 'It can be verified.'],
      ['Mathematics is the most boring subject.', 'Opinion', 'It expresses a feeling.'],
      ['Water freezes at 0 degrees Celsius.', 'Fact', 'It can be tested.'],
      ['Cats make better pets than dogs.', 'Opinion', 'It cannot be proven.'],
      ['The Pacific is the largest ocean on Earth.', 'Fact', 'It can be verified.'],
      ['Everyone should learn a second language.', 'Opinion', '"Should" signals a belief.'],
      ['The Great Wall of China is thousands of kilometres long.', 'Fact', 'It can be measured.'],
      ['Winter is the worst season.', 'Opinion', '"Worst" is a judgment.'],
      ['The Moon orbits Earth about once every 27 days.', 'Fact', 'It can be observed.'],
      ['Reality shows are a waste of time.', 'Opinion', 'It expresses a viewpoint.']
    ]
  })),
  sk('EvSw', 'Identify stronger and weaker evidence to support a claim', 'Developing and supporting arguments', G(8, 12), pairs({
    prompt: q => q,
    items: [
      ['Claim: <em>School libraries improve reading scores.</em> Which evidence is strongest?', 'A study of 500 schools found higher scores where libraries were staffed.', 'Research data is stronger than anecdotes.', ['A study of 500 schools found higher scores where libraries were staffed.', 'My cousin likes her school library.', 'Libraries are quiet places.', 'Some books are very long.']],
      ['Claim: <em>Recycling reduces landfill waste.</em> Which evidence is strongest?', 'City records show landfill volume fell 30% after recycling began.', 'Specific data from official records is strong evidence.', ['City records show landfill volume fell 30% after recycling began.', 'I always recycle my cans.', 'Recycling bins are blue.', 'Many people say recycling is good.']],
      ['Claim: <em>Exercise improves mood.</em> Which evidence is weakest?', 'A friend says she feels happier after jogging.', 'One person\'s experience is weak evidence.', ['A friend says she feels happier after jogging.', 'A trial with 2,000 adults showed lower anxiety after exercise.', 'A review of 30 studies found the same result.', 'A hospital study measured lower stress hormones.']],
      ['Claim: <em>Electric buses cut pollution.</em> Which evidence is strongest?', 'Air-quality monitors recorded cleaner air on routes using electric buses.', 'Measured data directly supports the claim.', ['Air-quality monitors recorded cleaner air on routes using electric buses.', 'Electric buses look modern.', 'The driver likes the quiet engine.', 'Buses carry many people.']],
      ['Claim: <em>Later school start times help teenagers.</em> Which evidence is weakest?', 'Some teens say they like sleeping in.', 'Casual opinions are weaker than studies.', ['Some teens say they like sleeping in.', 'Researchers found improved attendance after the change.', 'A district study showed fewer car crashes involving teens.', 'Sleep scientists link later starts to better attention.']],
      ['Claim: <em>Reading aloud helps young children learn language.</em> Which evidence is strongest?', 'Researchers found children read to daily knew more words at age five.', 'A research finding is stronger than a personal belief.', ['Researchers found children read to daily knew more words at age five.', 'Parents enjoy reading aloud.', 'Picture books are colourful.', 'Reading takes time.']]
    ]
  })),
  sk('EvBt', 'Choose the best evidence to support a claim', 'Developing and supporting arguments', G(8, 12), pairs({
    prompt: q => q,
    items: [
      ['Claim: <em>Electric cars are becoming more popular.</em>', 'Sales of electric cars doubled in the past three years.', 'Sales figures directly show popularity.', ['Sales of electric cars doubled in the past three years.', 'Cars have four wheels.', 'Gas prices were high in 1990.', 'My neighbour bought a truck.']],
      ['Claim: <em>Teens spend too much time on phones.</em>', 'A survey found the average teen spends over seven hours a day on screens.', 'The survey gives specific data.', ['A survey found the average teen spends over seven hours a day on screens.', 'Phones were invented in the 1800s.', 'I do not own a phone.', 'Some phones are black.']],
      ['Claim: <em>The city needs more bike lanes.</em>', 'Cyclist injuries fell 40% on streets where bike lanes were added.', 'It shows the benefit of bike lanes.', ['Cyclist injuries fell 40% on streets where bike lanes were added.', 'Bicycles have two wheels.', 'Many people like parks.', 'Roads can be crowded.']],
      ['Claim: <em>Volunteering benefits the volunteer.</em>', 'Studies link volunteering to lower stress and a greater sense of purpose.', 'It supports the claim with research.', ['Studies link volunteering to lower stress and a greater sense of purpose.', 'Volunteers wear name tags.', 'Charities need funding.', 'Some people prefer to work alone.']],
      ['Claim: <em>Ancient Rome was well engineered.</em>', 'Roman roads and aqueducts have remained usable for nearly two thousand years.', 'Their durability is evidence of good engineering.', ['Roman roads and aqueducts have remained usable for nearly two thousand years.', 'Rome is in Italy.', 'Latin is no longer spoken.', 'The Colosseum is popular with tourists.']],
      ['Claim: <em>Eating breakfast improves school performance.</em>', 'Students who ate breakfast scored higher on attention tests than those who skipped it.', 'It shows a measured difference.', ['Students who ate breakfast scored higher on attention tests than those who skipped it.', 'Breakfast is eaten in the morning.', 'Cereal comes in many flavours.', 'Some schools have cafeterias.']]
    ]
  })),
  sk('CtCl', 'Evaluate counterclaims', 'Developing and supporting arguments', G(9, 12), pairs({
    prompt: q => q,
    items: [
      ['Claim: <em>Cities should ban plastic bags.</em> Which is a counterclaim?', 'Reusable bags can be costly for low-income families.', 'A counterclaim presents an opposing concern.', ['Reusable bags can be costly for low-income families.', 'Plastic bags pollute oceans.', 'Many stores already offer paper bags.', 'Plastic bags take centuries to decompose.']],
      ['Claim: <em>School uniforms should be required.</em> Which is a counterclaim?', 'Uniforms limit students\' self-expression.', 'It opposes the claim.', ['Uniforms limit students\' self-expression.', 'Uniforms reduce peer pressure.', 'Uniforms save time in the morning.', 'Many schools have dress codes.']],
      ['Claim: <em>Space exploration is worth the cost.</em> Which is a counterclaim?', 'The money could be used to solve urgent problems on Earth.', 'It opposes the claim.', ['The money could be used to solve urgent problems on Earth.', 'Space research led to new technologies.', 'Satellites help forecast weather.', 'Exploration inspires young scientists.']],
      ['Claim: <em>Students should have less homework.</em> Which is a response that rebuts a counterclaim?', 'Although homework builds habits, excessive amounts lead to burnout and less actual learning.', 'It acknowledges and answers the opposing view.', ['Although homework builds habits, excessive amounts lead to burnout and less actual learning.', 'Homework is assigned every night.', 'Teachers decide how much homework to give.', 'Homework builds habits.']],
      ['Claim: <em>Zoos should be closed.</em> Which is a counterclaim?', 'Zoos help breed endangered species and educate the public.', 'It opposes the claim.', ['Zoos help breed endangered species and educate the public.', 'Animals in zoos have limited space.', 'Some zoos are very old.', 'Wild animals can roam freely in nature.']],
      ['Claim: <em>Voting should be mandatory.</em> Which is a counterclaim?', 'Forcing citizens to vote infringes on personal freedom.', 'It opposes the claim.', ['Forcing citizens to vote infringes on personal freedom.', 'Higher turnout makes governments more representative.', 'Several countries already require voting.', 'Voting is a civic duty.']]
    ]
  })),
  sk('EvLk', 'Choose the analysis that logically connects the evidence to the claim', 'Developing and supporting arguments', G(10, 12), pairs({
    prompt: q => q,
    items: [
      ['Claim: <em>Cycling to work benefits cities.</em> Evidence: <em>Cities with more cyclists report fewer traffic jams.</em> Which analysis best connects them?', 'Fewer cars on the road means less congestion, so cycling improves the flow of the whole city.', 'It explains how the evidence supports the claim.', ['Fewer cars on the road means less congestion, so cycling improves the flow of the whole city.', 'Cycling is a hobby many people enjoy.', 'Traffic jams are annoying.', 'Cities are large places with many people.']],
      ['Claim: <em>Reading fiction builds empathy.</em> Evidence: <em>Readers of novels score higher on tests of understanding others\' emotions.</em> Which analysis best connects them?', 'Imagining characters\' thoughts practises seeing the world through others\' eyes.', 'It explains why the evidence supports the claim.', ['Imagining characters\' thoughts practises seeing the world through others\' eyes.', 'Novels are usually long.', 'Tests are given in schools.', 'Libraries have many fiction books.']],
      ['Claim: <em>Urban gardens strengthen communities.</em> Evidence: <em>Neighbours who garden together report more friendships on their street.</em> Which analysis best connects them?', 'Shared work and shared space give neighbours regular chances to connect.', 'It links the evidence to the claim.', ['Shared work and shared space give neighbours regular chances to connect.', 'Vegetables are healthy.', 'Streets are paved with asphalt.', 'Gardens need water.']],
      ['Claim: <em>Sleep improves memory.</em> Evidence: <em>Students who slept after studying recalled more facts than those who stayed awake.</em> Which analysis best connects them?', 'Sleep gives the brain time to store new information, so rested students remember more.', 'It explains the link between sleep and memory.', ['Sleep gives the brain time to store new information, so rested students remember more.', 'Studying is hard work.', 'Facts are useful in school.', 'Most students sleep at night.']],
      ['Claim: <em>Public libraries are essential.</em> Evidence: <em>Many families use library computers for job applications.</em> Which analysis best connects them?', 'Libraries provide free access that people could not otherwise afford, opening doors to employment.', 'It connects the evidence to the claim.', ['Libraries provide free access that people could not otherwise afford, opening doors to employment.', 'Computers have keyboards.', 'Jobs are posted online.', 'Books are on shelves.']]
    ]
  })),
  sk('TrnA', 'Transition logically between claims, evidence, analysis and counterclaims', 'Developing and supporting arguments', G(10, 12), pairs({
    prompt: s => `Choose the best transition.<br>${em(s)}`,
    items: [
      ['Public transit reduces traffic. ___, it lowers emissions.', 'In addition', 'It adds another benefit.', ['In addition', 'However', 'Instead', 'Meanwhile']],
      ['Some argue that remote work lowers productivity. ___, studies show the opposite.', 'However', 'It introduces a contrast.', ['However', 'Similarly', 'For example', 'Therefore']],
      ['Many cities have added bike lanes. ___, Copenhagen now has more bikes than cars.', 'For example', 'It introduces an example.', ['For example', 'On the contrary', 'Nevertheless', 'Otherwise']],
      ['The experiment was repeated five times with the same result. ___, the finding is reliable.', 'Therefore', 'It shows a conclusion drawn from evidence.', ['Therefore', 'In contrast', 'Meanwhile', 'Likewise']],
      ['Critics say the plan is too expensive. ___, it will save money over ten years.', 'On the other hand', 'It introduces a contrasting view.', ['On the other hand', 'As a result', 'In addition', 'For instance']],
      ['The first factory closed in 1990. ___, thousands of workers lost their jobs.', 'As a result', 'It shows an effect.', ['As a result', 'Instead', 'However', 'In contrast']],
      ['Solar power is clean. ___, wind power produces no direct emissions.', 'Similarly', 'It shows a similarity.', ['Similarly', 'Nevertheless', 'Otherwise', 'In contrast']],
      ['Students need rest. ___, schools should rethink early start times.', 'Consequently', 'It introduces a conclusion.', ['Consequently', 'Although', 'In contrast', 'For example']]
    ]
  })),

  /* ================= Persuasive strategies ================= */
  sk('PsAd', 'Identify appeals to ethos, pathos and logos in advertisements', 'Persuasive strategies', G(8, 12), classify({
    categories: ['Ethos (credibility)', 'Pathos (emotion)', 'Logos (logic)'],
    prompt: s => `Which appeal does this advertisement use?<br>${em(s)}`,
    items: [
      ['"Four out of five dentists recommend our toothpaste."', 'Ethos (credibility)', 'It relies on expert authority.'],
      ['"Every purchase feeds a hungry child. Be their hero today."', 'Pathos (emotion)', 'It appeals to compassion.'],
      ['"Our battery lasts 40% longer than the leading brand — see the test results."', 'Logos (logic)', 'It uses data and comparison.'],
      ['"Trusted by Olympic athletes for over twenty years."', 'Ethos (credibility)', 'It relies on reputation.'],
      ['"Don\'t let your family face another cold winter without protection."', 'Pathos (emotion)', 'It stirs worry and care for family.'],
      ['"Save $240 a year: our plan costs $20 less per month."', 'Logos (logic)', 'It uses figures and reasoning.'],
      ['"Doctor-approved formula for sensitive skin."', 'Ethos (credibility)', 'It cites professional approval.'],
      ['"Remember the joy of family dinners. Bring everyone back to the table."', 'Pathos (emotion)', 'It evokes warm feelings.']
    ]
  })),
  sk('PsUs', 'Use appeals to ethos, pathos and logos in persuasive writing', 'Persuasive strategies', G(9, 12), pairs({
    prompt: q => q,
    items: [
      ['You are writing an op-ed urging a city to plant trees. Which sentence uses logos?', 'Neighbourhoods with more trees are up to 5 degrees cooler in summer.', 'A statistic is an appeal to logic.', ['Neighbourhoods with more trees are up to 5 degrees cooler in summer.', 'Picture a child resting in the shade of a great oak.', 'As a forester for twenty years, I have seen it all.', 'Trees are lovely and everyone loves them.']],
      ['You are writing an op-ed urging a city to plant trees. Which sentence uses pathos?', 'Picture a child resting in the shade of a great oak on a scorching day.', 'It creates an emotional image.', ['Picture a child resting in the shade of a great oak on a scorching day.', 'Trees absorb carbon dioxide.', 'The city has 400 acres of parkland.', 'I have a degree in forestry.']],
      ['You are writing an op-ed urging a city to plant trees. Which sentence uses ethos?', 'As a certified arborist with two decades of experience, I know what cities need.', 'It builds the writer\'s credibility.', ['As a certified arborist with two decades of experience, I know what cities need.', 'Shade can cool a street by 5 degrees.', 'Imagine the heartbreak of losing an ancient forest.', 'Trees are green.']],
      ['You are arguing for a longer school library schedule. Which sentence uses logos?', 'Schools with longer library hours reported a 12% rise in reading scores.', 'It uses a statistic.', ['Schools with longer library hours reported a 12% rise in reading scores.', 'Think of the joy of a child finding a favourite book.', 'I am a librarian who loves books.', 'Everyone should be able to read.']],
      ['You are arguing for a longer school library schedule. Which sentence uses pathos?', 'Think of the child who has no quiet place to read at home, waiting for the library doors to open.', 'It appeals to feelings.', ['Think of the child who has no quiet place to read at home, waiting for the library doors to open.', 'Studies show that reading improves vocabulary.', 'I have taught for thirty years.', 'The library has 3,000 books.']],
      ['You are arguing for a longer school library schedule. Which sentence uses ethos?', 'As a teacher who has watched hundreds of students learn to read, I speak from experience.', 'It establishes credibility.', ['As a teacher who has watched hundreds of students learn to read, I speak from experience.', 'Imagine a child curled up with a story.', 'Reading scores rose 12%.', 'Libraries have shelves.']]
    ]
  })),

  /* ================= Writing clearly and concisely ================= */
  sk('CjAv', 'Transitions with conjunctive adverbs', 'Writing clearly and concisely', G(8, 12), pairs({
    prompt: s => `Choose the best conjunctive adverb.<br>${em(s)}`,
    items: [
      ['The team practised for months; ___, they won the championship.', 'consequently', 'It shows a result.', ['consequently', 'however', 'otherwise', 'meanwhile']],
      ['The recipe looked simple; ___, it took three hours to prepare.', 'however', 'It shows contrast.', ['however', 'therefore', 'likewise', 'furthermore']],
      ['She loves hiking; ___, she spends every weekend on the trails.', 'in fact', 'It adds emphasis.', ['in fact', 'nevertheless', 'otherwise', 'instead']],
      ['Study tonight; ___, you will be unprepared tomorrow.', 'otherwise', 'It shows what happens if the first action does not happen.', ['otherwise', 'moreover', 'therefore', 'similarly']],
      ['The bus was late; ___, we missed the first act.', 'therefore', 'It shows a result.', ['therefore', 'however', 'instead', 'meanwhile']],
      ['He enjoys painting; ___, his sister prefers sculpture.', 'meanwhile', 'It shows what is happening at the same time or in contrast.', ['meanwhile', 'consequently', 'furthermore', 'otherwise']],
      ['The report is thorough; ___, it includes helpful charts.', 'moreover', 'It adds another point.', ['moreover', 'however', 'nevertheless', 'instead']],
      ['We expected rain; ___, the day turned out sunny.', 'nevertheless', 'It shows surprising contrast.', ['nevertheless', 'therefore', 'moreover', 'likewise']]
    ]
  })),
  sk('CmpP', 'Avoid double, illogical and unclear comparisons', 'Writing clearly and concisely', G(9, 12), pairs({
    prompt: () => 'Which sentence is correct and clear?',
    items: [
      ok('This soup is better than that soup.', ['This soup is more better than that soup.', 'This soup is better than that.', 'This soup is gooder than that soup.'], 'Avoid double comparatives such as "more better".'),
      ok('The weather in Vancouver is milder than the weather in Winnipeg.', ['The weather in Vancouver is milder than Winnipeg.', 'The weather in Vancouver is more milder than Winnipeg.', 'Vancouver weather is milder than Winnipeg.'], 'Compare weather with weather, not weather with a city.'),
      ok('She is the tallest player on the team.', ['She is the most tallest player on the team.', 'She is the taller player on the team.', 'She is taller than all the players on the team.'], 'Avoid double superlatives such as "most tallest"; use "taller than any other" when comparing with a group that includes her.'),
      ok('His essay is longer than mine.', ['His essay is longer than me.', 'His essay is more longer than mine.', 'His essay is long than mine.'], 'Use "mine" to compare essays with essays.'),
      ok('Alex runs faster than any other student in the class.', ['Alex runs faster than any student in the class.', 'Alex runs the most fastest in the class.', 'Alex runs more faster than the class.'], 'Use "any other" so Alex is not compared with himself.'),
      ok('The new model is more reliable than the old one.', ['The new model is more reliabler than the old one.', 'The new model is reliable than the old one.', 'The new model is more reliable the old one.'], 'Use "more reliable" rather than adding -er to a long adjective.'),
      ok('Her speech was more persuasive than his.', ['Her speech was more persuasive than him.', 'Her speech was persuasive than his.', 'Her speech was most persuasive than his.'], 'Complete the comparison with "his".'),
      ok('Of the two options, this one is cheaper.', ['Of the two options, this one is cheapest.', 'Of the two options, this one is most cheap.', 'Of the two options, this one is more cheapest.'], 'Use the comparative for two things, the superlative for three or more.')
    ]
  })),
  sk('Prl', 'Identify sentences with parallel structure', 'Writing clearly and concisely', G(9, 12), pairs({
    prompt: () => 'Which sentence has parallel structure?',
    items: [
      ok('The coach asked us to run, to stretch and to hydrate.', ['The coach asked us to run, stretching and to hydrate.', 'The coach asked us to run, to stretch and hydration.', 'The coach asked us running, to stretch and to hydrate.'], 'All three items use "to + verb".'),
      ok('She enjoys reading, painting and hiking.', ['She enjoys reading, painting and to hike.', 'She enjoys to read, painting and hiking.', 'She enjoys reading, to paint and hiking.'], 'All three items use -ing verbs.'),
      ok('The job requires patience, creativity and persistence.', ['The job requires patience, being creative and persistent.', 'The job requires being patient, creativity and persistence.', 'The job requires patience, creativity and to persist.'], 'All three items are nouns.'),
      ok('He is tall, strong and fast.', ['He is tall, strong and runs quickly.', 'He is tall, strength and fast.', 'He is tall, being strong and fast.'], 'All three items are adjectives.'),
      ok('Not only did she write the report, but she also presented it.', ['Not only did she write the report, but also presenting it.', 'Not only writing the report, she also presented it.', 'Not only did she write the report, but presenting it too.'], 'Both parts of the correlative pair have the same form.'),
      ok('We want a leader who listens, who learns and who leads.', ['We want a leader who listens, learning and who leads.', 'We want a leader who listens, who learns and leading.', 'We want a leader who listens, to learn and leads.'], 'Each clause begins with "who" + verb.'),
      ok('The speech was informative, entertaining and brief.', ['The speech was informative, entertaining and it was a short one.', 'The speech was informing, entertaining and brief.', 'The speech was informative, entertained and brief.'], 'All three items are adjectives.'),
      ok('You can take the bus, ride your bike or walk.', ['You can take the bus, riding your bike or walk.', 'You can take the bus, ride your bike or walking.', 'You can taking the bus, ride your bike or walk.'], 'All three items use the base verb.')
    ]
  })),
  sk('Rdn', 'Remove redundant words or phrases', 'Writing clearly and concisely', G(8, 12), pairs({
    prompt: () => 'Which sentence is the most concise, with no redundant words?',
    items: [
      ok('The meeting begins at 3 p.m.', ['The meeting begins at 3 p.m. in the afternoon.', 'The meeting starts and begins at 3 p.m.', 'The meeting begins at exactly 3 p.m. sharp.'], '"p.m." already means afternoon.'),
      ok('The sunset was beautiful.', ['The sunset was very beautiful and lovely.', 'The sunset was beautiful in appearance.', 'The sunset was a beautiful, pretty sight.'], 'Avoid repeating the same meaning.'),
      ok('She returned the book.', ['She returned back the book.', 'She returned the book back again.', 'She went and returned the book back.'], '"Returned" already means "gave back".'),
      ok('We must plan for the future.', ['We must plan ahead for the future.', 'We must plan in advance for the future ahead.', 'We must make future plans for the future.'], 'Plans are always for the future.'),
      ok('The reason is that he was late.', ['The reason is because he was late.', 'The reason why is because he was late.', 'The reason for it is due to the fact that he was late.'], '"Reason" and "because" repeat the same idea.'),
      ok('The two friends shared the cake.', ['Both of the two friends shared the cake together.', 'The two friends shared the cake with each other.', 'The two friends equally shared the cake together.'], 'Cut repeated words like "both of the two" and "together".'),
      ok('The group voted unanimously.', ['The group voted unanimously as one.', 'The group all voted unanimously together.', 'The group voted completely and unanimously.'], '"Unanimously" already means by everyone.'),
      ok('The final outcome surprised us.', ['The final end outcome surprised us all.', 'The outcome in the end surprised us.', 'The final result outcome surprised us.'], 'Choose one word: "outcome" or "result".')
    ]
  })),

  /* ================= Editing and revising ================= */
  sk('CfWd', 'Use the correct frequently confused word', 'Editing and revising', G(6, 12), pairs({
    prompt: s => `Choose the correct word.<br>${em(s)}`,
    items: [
      ['The new law will ___ many families.', 'affect', 'Affect is a verb meaning to influence.', ['affect', 'effect']],
      ['The ___ of the medicine was immediate.', 'effect', 'Effect is a noun meaning result.', ['effect', 'affect']],
      ['Please ___ my apology.', 'accept', 'Accept means to receive.', ['accept', 'except']],
      ['Everyone ___ Jess went to the concert.', 'except', 'Except means excluding.', ['except', 'accept']],
      ['The class is smaller ___ last year\'s.', 'than', 'Use than to compare.', ['than', 'then']],
      ['She ate dinner and ___ went for a walk.', 'then', 'Then shows time order.', ['then', 'than']],
      ['Try not to ___ your keys.', 'lose', 'Lose means to misplace.', ['lose', 'loose']],
      ['The screw came ___ over time.', 'loose', 'Loose means not tight.', ['loose', 'lose']],
      ['The principal gave us good ___.', 'advice', 'Advice is a noun.', ['advice', 'advise']],
      ['I ___ you to apply early.', 'advise', 'Advise is a verb.', ['advise', 'advice']],
      ['Her ___ was impressive: a calm presence.', 'composure', 'Composure means calmness.', ['composure', 'composer']],
      ['A person\'s moral rule is a ___.', 'principle', 'Principle is a rule or belief; principal means main or a school head.', ['principle', 'principal']]
    ]
  })),
  sk('CfPr', 'Frequently confused pronouns and contractions', 'Editing and revising', G(7, 12), pairs({
    prompt: s => `Choose the correct word.<br>${em(s)}`,
    items: [
      ['___ going to be late for practice.', 'We\'re', 'We\'re = we are.', ['We\'re', 'Were', 'Where', 'Wear']],
      ['The dog wagged ___ tail.', 'its', '"Its" shows possession.', ['its', 'it\'s', 'its\'', 'is']],
      ['___ a long way home.', 'It\'s', 'It\'s = it is.', ['It\'s', 'Its', 'Its\'', 'Is']],
      ['Is this ___ coat?', 'your', '"Your" shows possession.', ['your', 'you\'re', 'you', 'yore']],
      ['___ welcome to join us.', 'You\'re', 'You\'re = you are.', ['You\'re', 'Your', 'Youre', 'Yore']],
      ['___ turn is it?', 'Whose', 'Whose shows possession.', ['Whose', 'Who\'s', 'Whos', 'Who is']],
      ['___ coming to the party?', 'Who\'s', 'Who\'s = who is.', ['Who\'s', 'Whose', 'Whos', 'Who']],
      ['The players forgot ___ equipment.', 'their', '"Their" shows possession.', ['their', 'there', 'they\'re', 'thier']],
      ['Put the box over ___.', 'there', '"There" tells where.', ['there', 'their', 'they\'re', 'thare']],
      ['I hope ___ not too late.', 'they\'re', 'They\'re = they are.', ['they\'re', 'their', 'there', 'theyre']]
    ]
  })),
  sk('MsSp', 'Correct errors with commonly misspelled words', 'Editing and revising', G(7, 12), pairs({
    prompt: () => 'Which word is spelled correctly?',
    items: [
      ['', 'privilege', 'Remember: privi-lege (no "d").', ['privilege', 'priviledge', 'privelege', 'privlege']],
      ['', 'government', 'Say "govern-ment" — there is an n.', ['government', 'goverment', 'govermment', 'governmint']],
      ['', 'restaurant', 'Restau-rant: au before rant.', ['restaurant', 'restarant', 'resturant', 'restaraunt']],
      ['', 'questionnaire', 'Two n\'s in questionnaire.', ['questionnaire', 'questionaire', 'questionnare', 'questionair']],
      ['', 'millennium', 'Two l\'s and two n\'s.', ['millennium', 'millenium', 'milennium', 'millenneum']],
      ['', 'pronunciation', 'Pro-NUN-ciation: no "ou".', ['pronunciation', 'pronounciation', 'pronuncation', 'pronounsiation']],
      ['', 'unnecessary', 'un + necessary = two n\'s.', ['unnecessary', 'unecessary', 'unnecesary', 'unneccesary']],
      ['', 'commitment', 'Two m\'s, one t.', ['commitment', 'comittment', 'commitmant', 'comitment']],
      ['', 'embarrassment', 'Double r and double s.', ['embarrassment', 'embarassment', 'embarrasment', 'embarrassmint']],
      ['', 'mischievous', 'Three syllables: mis-chie-vous.', ['mischievous', 'mischievious', 'mischevious', 'mischivous']]
    ]
  })),
  sk('EvRs', 'Correct errors in everyday use', 'Editing and revising', G(7, 12), pairs({
    prompt: () => 'Which sentence uses standard English correctly?',
    items: [
      ok('There are fewer cars on the road today.', ['There are less cars on the road today.', 'There is fewer cars on the road today.', 'There are lesser cars on the road today.'], 'Use "fewer" with things you can count.'),
      ok('I will go regardless of the weather.', ['I will go irregardless of the weather.', 'I will go regardlessly of the weather.', 'I will goes regardless of the weather.'], '"Irregardless" is nonstandard; use "regardless".'),
      ok('She should have called.', ['She should of called.', 'She should have call.', 'She should of call.'], 'Write "should have", not "should of".'),
      ok('He did well on the test.', ['He did good on the test.', 'He done well on the test.', 'He did goodly on the test.'], 'Use the adverb "well" to describe how he did.'),
      ok('Between you and me, I am worried.', ['Between you and I, I am worried.', 'Between you and myself, I am worried.', 'Between yourself and me, I am worried.'], 'Use object pronouns after prepositions.'),
      ok('I could hardly see the road.', ['I couldn\'t hardly see the road.', 'I could not hardly see the road.', 'I couldn\'t barely see the road.'], 'Avoid double negatives such as "couldn\'t hardly".'),
      ok('Lay the book on the table.', ['Lie the book on the table.', 'Laid the book on the table now.', 'Lays the book on the table now.'], '"Lay" takes an object (the book).'),
      ok('She is the person who called.', ['She is the person whom called.', 'She is the person which called.', 'She is the person whose called.'], 'Use "who" as the subject of "called".')
    ]
  })),
  sk('RvSg', 'Suggest appropriate revisions', 'Editing and revising', G(8, 12), pairs({
    prompt: s => `Which revision is the clearest?<br>${em(s)}`,
    items: [
      ['The thing about the plan is that it has problems that are kind of big.', 'The plan has serious problems.', 'Precise words replace vague ones.', ['The plan has serious problems.', 'The plan has some things going on.', 'The plan is thing-wise not good.', 'The plan kind of has problems.']],
      ['There are many reasons why people exercise, and one of the reasons is health.', 'People exercise for many reasons, including health.', 'It removes repetition.', ['People exercise for many reasons, including health.', 'Exercise, there are many reasons, is health.', 'People exercise reasons health.', 'Health is one reason of many reasons for reasons.']],
      ['Running down the street, the bus was missed by Dana.', 'Running down the street, Dana missed the bus.', 'The doer (Dana) should follow the opening phrase.', ['Running down the street, Dana missed the bus.', 'Running down the street, the bus missed Dana.', 'The bus, running down the street, missed Dana.', 'Down the street, was the bus missed running.']],
      ['The book was read by me and it was liked by me.', 'I read the book and liked it.', 'Active voice is more direct.', ['I read the book and liked it.', 'The book was read and liked by me.', 'Me read and liked the book.', 'It was the book read and liked.']],
      ['In my opinion, I think that school should start later.', 'I think school should start later.', 'Remove the redundant opening.', ['I think school should start later.', 'In my opinion I think that I believe school should start later.', 'School, I think, in my opinion, later.', 'Opinion school later start.']],
      ['She is a woman who is very, very smart and intelligent.', 'She is brilliant.', 'A strong word replaces a wordy phrase.', ['She is brilliant.', 'She is very, very smart and also intelligent.', 'She is smart and also very intelligent.', 'She is a woman smart.']]
    ]
  })),

  /* ================= Research skills ================= */
  sk('WcPt', 'Understand the parts of a Works Cited entry', 'Research skills', G(9, 12), pairs({
    prompt: q => q,
    items: [
      ['Entry: <em>Austen, Jane. Pride and Prejudice. Penguin, 2003.</em> Who is the author?', 'Jane Austen', 'MLA lists the author as Last, First.', ['Jane Austen', 'Penguin', 'Pride Prejudice', '2003']],
      ['Entry: <em>Austen, Jane. Pride and Prejudice. Penguin, 2003.</em> What is the title of the work?', 'Pride and Prejudice', 'The title follows the author.', ['Pride and Prejudice', 'Jane Austen', 'Penguin', '2003']],
      ['Entry: <em>Austen, Jane. Pride and Prejudice. Penguin, 2003.</em> Who is the publisher?', 'Penguin', 'The publisher comes after the title.', ['Penguin', 'Austen', 'Pride and Prejudice', '2003']],
      ['Entry: <em>Austen, Jane. Pride and Prejudice. Penguin, 2003.</em> What is the publication year?', '2003', 'The year follows the publisher.', ['2003', '1813', 'Penguin', 'Jane']],
      ['In an MLA Works Cited list, the entries are arranged …', 'alphabetically by the first word of each entry', 'MLA lists entries alphabetically.', ['alphabetically by the first word of each entry', 'by publication date', 'by the length of the title', 'in the order they were used']],
      ['In MLA format, which belongs in italics in a Works Cited entry?', 'The title of a book', 'Titles of books are italicized.', ['The title of a book', 'The author\'s name', 'The year', 'The publisher\'s name']],
      ['Entry: <em>Smith, Alex. "Ocean Plastics." Science Weekly, vol. 12, no. 3, 2021, pp. 14–19.</em> What is the title of the article?', 'Ocean Plastics', 'Article titles go in quotation marks.', ['Ocean Plastics', 'Science Weekly', 'Alex Smith', 'vol. 12']],
      ['Entry: <em>Smith, Alex. "Ocean Plastics." Science Weekly, vol. 12, no. 3, 2021, pp. 14–19.</em> What is the title of the container (the magazine)?', 'Science Weekly', 'The container follows the article title.', ['Science Weekly', 'Ocean Plastics', 'Alex Smith', 'pp. 14–19']]
    ]
  })),
  sk('InTx', 'Use in-text citations', 'Research skills', G(9, 12), pairs({
    prompt: q => q,
    items: [
      ['You quote page 45 of a book by Morrison. Which MLA in-text citation is correct?', '(Morrison 45)', 'MLA uses the author\'s last name and page number, with no comma.', ['(Morrison 45)', '(Morrison, 45)', '(Morrison p. 45.)', '(45 Morrison)']],
      ['You quote page 12 of a book by Chen and Rivera. Which MLA in-text citation is correct?', '(Chen and Rivera 12)', 'For two authors, use both last names.', ['(Chen and Rivera 12)', '(Chen, Rivera 12)', '(Chen 12)', '(Chen & Rivera p. 12)']],
      ['The author is named in your sentence: <em>According to Okafor, …</em> What goes in the parentheses?', '(88)', 'If the author is named, only the page is needed.', ['(88)', '(Okafor 88)', '(Okafor)', '(p. Okafor)']],
      ['A web article has no page numbers and the author is Lee. Which citation is correct?', '(Lee)', 'Without page numbers, cite just the author.', ['(Lee)', '(Lee n.p.)', '(Lee 1)', '(page Lee)']],
      ['A source has no author. The title is <em>"Climate Trends"</em>. Which citation is correct?', '("Climate Trends")', 'Use a shortened title when there is no author.', ['("Climate Trends")', '(Anonymous)', '(Unknown)', '(Climate)']],
      ['Where does the in-text citation go in a sentence?', 'Before the final period', 'MLA places the citation before the period.', ['Before the final period', 'After the final period', 'At the start of the paragraph', 'In the title']]
    ]
  })),
  sk('PlgR', 'Identify plagiarism', 'Research skills', G(7, 12), classify({
    categories: ['Plagiarism', 'Acceptable use'],
    prompt: s => `Is this plagiarism or acceptable use?<br>${em(s)}`,
    items: [
      ['A student copies two paragraphs from a website and hands them in as their own.', 'Plagiarism', 'Copying without credit is plagiarism.'],
      ['A student summarizes an article in their own words and cites it.', 'Acceptable use', 'Paraphrasing with a citation is acceptable.'],
      ['A student changes a few words in a copied paragraph and does not cite the source.', 'Plagiarism', 'Slightly changed text still needs credit.'],
      ['A student quotes a sentence in quotation marks with a citation.', 'Acceptable use', 'A cited, quoted sentence is acceptable.'],
      ['A student buys an essay online and submits it as their work.', 'Plagiarism', 'Submitting someone else\'s work is plagiarism.'],
      ['A student uses a graph from a report and credits the report below the graph.', 'Acceptable use', 'Credit is given.'],
      ['A student reuses their own essay from another class without permission.', 'Plagiarism', 'Reusing your own work can count as self-plagiarism.'],
      ['A student uses a well-known fact (water boils at 100°C) without citing.', 'Acceptable use', 'Common knowledge does not need a citation.']
    ]
  }))
];
