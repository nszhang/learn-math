/* ============================================================
   LearnAce — English grades 6–12 (language, rhetoric, literature).
   IDs are prefixed "eng". Appended to the grade 1–5 list in skills.js.
   ============================================================ */
import { S, classify, pairs } from './quiz.js';

const b = w => `<strong>${w}</strong>`;
const em = w => `<em>${w}</em>`;
// Build pairs() items for the common "choose the correct sentence/word" shape.
const choose = (a, wrong, note) => ['', a, note, [a, ...wrong]];

export const ENGLISH_6_12 = [
  /* ================= GRADE 6 ================= */
  S('engFIG6', 'Personification, hyperbole and alliteration', 6, 'Figurative language', '🎭', classify({
    categories: ['Personification', 'Hyperbole', 'Alliteration', 'Onomatopoeia'],
    prompt: s => `Which figure of speech is this?<br>${em(s)}`,
    items: [
      ['The wind whispered through the trees.', 'Personification', 'Wind cannot whisper — a human action is given to a non-human thing.'],
      ['I have told you a million times!', 'Hyperbole', 'It is an extreme exaggeration for effect.'],
      ['Peter Piper picked a peck of pickled peppers.', 'Alliteration', 'The same beginning sound (p) repeats.'],
      ['The bees buzzed and the bacon sizzled.', 'Onomatopoeia', 'Buzzed and sizzled sound like the noises they name.'],
      ['The sun smiled down on the picnic.', 'Personification', 'Suns do not smile — a human action is given to a non-human thing.'],
      ['I am so hungry I could eat a horse.', 'Hyperbole', 'It is an extreme exaggeration for effect.'],
      ['Sally sells seashells by the seashore.', 'Alliteration', 'The same beginning sound (s) repeats.'],
      ['The door creaked and the floorboards groaned.', 'Personification', 'Floorboards do not groan like people — a human action is given to an object.'],
      ['Crash! The tray hit the floor.', 'Onomatopoeia', 'Crash sounds like the noise it names.'],
      ['This backpack weighs a ton.', 'Hyperbole', 'It is an exaggeration for effect.']
    ]
  })),
  S('engROT6', 'Greek and Latin roots', 6, 'Vocabulary', '🏛️', pairs({
    prompt: r => r,
    items: [
      ['The root <strong>bio</strong> (as in biology) means …', 'life'],
      ['The root <strong>geo</strong> (as in geography) means …', 'earth'],
      ['The root <strong>aqua</strong> (as in aquarium) means …', 'water'],
      ['The root <strong>port</strong> (as in transport) means …', 'carry'],
      ['The root <strong>dict</strong> (as in dictate) means …', 'say'],
      ['The root <strong>scrib/script</strong> (as in manuscript) means …', 'write'],
      ['The root <strong>spect</strong> (as in spectator) means …', 'look'],
      ['The root <strong>tele</strong> (as in telephone) means …', 'far'],
      ['The root <strong>auto</strong> (as in automobile) means …', 'self'],
      ['The root <strong>chron</strong> (as in chronology) means …', 'time']
    ].map(([q, a]) => [q, a, `That root means ${b(a)}.`])
  })),
  S('engPCS6', 'Subject and object pronouns', 6, 'Grammar', '👥', pairs({
    prompt: s => `Choose the correct pronoun:<br>${em(s)}`,
    items: [
      ['Maria and ___ went to the store.', 'I', 'Use a subject pronoun (I) as the subject. Test: "I went to the store."', ['I', 'me', 'myself', 'mine']],
      ['The teacher gave the prize to Sam and ___.', 'me', 'Use an object pronoun (me) after "to". Test: "gave the prize to me."', ['me', 'I', 'myself', 'mine']],
      ['___ and Jake are on the same team.', 'She', 'Use a subject pronoun (she) as the subject.', ['She', 'Her', 'Hers', 'Herself']],
      ['The dog followed ___ home.', 'him', 'Use an object pronoun (him) after a verb.', ['him', 'he', 'his', 'himself']],
      ['Dad drove my brother and ___ to practice.', 'me', 'Use an object pronoun (me). Test: "Dad drove me."', ['me', 'I', 'myself', 'mine']],
      ['___ are going to the museum.', 'They', 'Use a subject pronoun (they) as the subject.', ['They', 'Them', 'Their', 'Theirs']],
      ['The prize was awarded to ___.', 'her', 'Use an object pronoun (her) after "to".', ['her', 'she', 'hers', 'herself']],
      ['It was ___ who called.', 'he', 'After "was", a subject pronoun (he) is traditionally correct.', ['he', 'him', 'his', 'himself']]
    ]
  })),
  S('engCMA6', 'Commas', 6, 'Punctuation', '✂️', pairs({
    prompt: () => 'Which sentence uses commas correctly?',
    items: [
      choose('We bought apples, pears, and bananas.', ['We bought apples pears, and bananas.', 'We bought, apples, pears and bananas.', 'We bought apples, pears, and, bananas.'], 'Commas separate items in a list.'),
      choose('After dinner, we watched a movie.', ['After dinner we, watched a movie.', 'After, dinner we watched a movie.', 'After dinner we watched, a movie.'], 'Use a comma after an introductory phrase.'),
      choose('I wanted to go, but it was raining.', ['I wanted to go but, it was raining.', 'I wanted, to go but it was raining.', 'I wanted to go but it was, raining.'], 'Use a comma before a conjunction (but) joining two complete sentences.'),
      choose('My sister, who is ten, loves soccer.', ['My sister who is ten, loves soccer.', 'My sister, who is ten loves soccer.', 'My, sister who is ten loves soccer.'], 'Commas set off extra information.'),
      choose('Yes, I will help you.', ['Yes I will, help you.', 'Yes I will help, you.', 'Yes, I will, help you.'], 'Use a comma after yes or no at the start of a sentence.'),
      choose('Please, Tom, close the door.', ['Please Tom, close the door.', 'Please, Tom close the door.', 'Please Tom close, the door.'], 'Commas set off a name used to address someone.'),
      choose('It was a long, cold winter.', ['It was a long cold, winter.', 'It was, a long cold winter.', 'It was a long, cold, winter.'], 'Use a comma between adjectives of equal rank.')
    ]
  })),
  S('engMNI6', 'Main idea of a passage', 6, 'Reading comprehension', '📖', pairs({
    prompt: p => `Read the passage.<br>${em(p)}<br><br>What is the main idea?`,
    items: [
      ['Honeybees live in colonies. The queen lays eggs, workers gather nectar and care for the young, and drones mate with the queen. Each bee has a job that helps the hive survive.', 'Honeybees work together in a colony, each with a job.', 'Every detail shows how bees share jobs to keep the hive alive.', ['Honeybees work together in a colony, each with a job.', 'Honeybees make honey.', 'Queens are the largest bees.', 'Drones never leave the hive.']],
      ['Recycling saves energy and resources. Making a can from recycled aluminum uses far less energy than making a new one. Recycling also keeps trash out of landfills.', 'Recycling is good for the environment.', 'The passage lists several benefits of recycling.', ['Recycling is good for the environment.', 'Aluminum cans are hard to make.', 'Landfills are full.', 'Everyone recycles.']],
      ['Sleep is important for students. A rested brain remembers more and pays better attention. Tired students often make more mistakes and feel grumpy.', 'Students need enough sleep to learn well.', 'The details all show why sleep helps learning.', ['Students need enough sleep to learn well.', 'Students are often grumpy.', 'Brains are complicated.', 'Mistakes are bad.']],
      ['Volcanoes form when melted rock, called magma, rises through cracks in the Earth. When pressure builds, the magma erupts as lava, ash and gas. Over time the lava cools and builds a mountain.', 'Volcanoes form when magma erupts and cools.', 'The passage explains how volcanoes are formed.', ['Volcanoes form when magma erupts and cools.', 'Lava is very hot.', 'Mountains are tall.', 'Ash is dangerous.']],
      ['Octopuses are clever animals. They can open jars, escape from tanks, and use shells as hiding places. Scientists have watched them solve puzzles to get food.', 'Octopuses are intelligent.', 'Each detail is an example of octopus intelligence.', ['Octopuses are intelligent.', 'Octopuses live in tanks.', 'Octopuses love shells.', 'Scientists study puzzles.']]
    ]
  })),

  /* ================= GRADE 7 ================= */
  S('engCLS7', 'Independent and dependent clauses', 7, 'Grammar', '🧱', classify({
    categories: ['Independent clause', 'Dependent clause'],
    prompt: s => `Is this group of words an independent or dependent clause?<br>${em(s)}`,
    items: [
      ['The dog barked loudly.', 'Independent clause', 'It has a subject and verb and is a complete thought.'],
      ['Because it was raining', 'Dependent clause', 'It has a subject and verb but does not express a complete thought.'],
      ['We went to the beach.', 'Independent clause', 'It is a complete thought.'],
      ['When the bell rang', 'Dependent clause', '"When" makes it incomplete — it needs a main clause.'],
      ['Although she was tired', 'Dependent clause', '"Although" makes it incomplete.'],
      ['Maya finished her homework.', 'Independent clause', 'It is a complete thought.'],
      ['If you study hard', 'Dependent clause', '"If" makes it incomplete.'],
      ['The movie starts at eight.', 'Independent clause', 'It is a complete thought.'],
      ['Since we missed the bus', 'Dependent clause', '"Since" makes it incomplete.']
    ]
  })),
  S('engSNT7', 'Simple, compound and complex sentences', 7, 'Grammar', '🏗️', classify({
    categories: ['Simple', 'Compound', 'Complex'],
    prompt: s => `What type of sentence is this?<br>${em(s)}`,
    items: [
      ['The cat slept on the sofa.', 'Simple', 'One independent clause, no dependent clauses.'],
      ['I like tea, but my brother likes coffee.', 'Compound', 'Two independent clauses joined by "but".'],
      ['Because it rained, we stayed inside.', 'Complex', 'One dependent clause (Because it rained) plus one independent clause.'],
      ['She sings and dances.', 'Simple', 'One subject with two verbs is still a simple sentence.'],
      ['We finished early, so we played outside.', 'Compound', 'Two independent clauses joined by "so".'],
      ['When the movie ended, everyone clapped.', 'Complex', 'Dependent clause (When the movie ended) plus an independent clause.'],
      ['The sun set; the stars appeared.', 'Compound', 'Two independent clauses joined by a semicolon.'],
      ['I will call you after I get home.', 'Complex', 'The dependent clause "after I get home" depends on the main clause.']
    ]
  })),
  S('engCON7', 'Connotation', 7, 'Vocabulary', '💭', classify({
    categories: ['Positive', 'Negative', 'Neutral'],
    prompt: w => `What is the connotation of ${b(w)} in “She is ___.”?`,
    items: [
      ['thrifty', 'Positive', 'Thrifty suggests wise with money.'],
      ['stingy', 'Negative', 'Stingy suggests unwilling to spend, in a bad way.'],
      ['cheap', 'Negative', 'Cheap carries a negative feeling when used about a person.'],
      ['confident', 'Positive', 'Confident suggests belief in oneself, in a good way.'],
      ['arrogant', 'Negative', 'Arrogant suggests too much pride.'],
      ['curious', 'Positive', 'Curious suggests eager to learn.'],
      ['nosy', 'Negative', 'Nosy suggests interfering in others\' business.'],
      ['tall', 'Neutral', 'Tall simply describes height.'],
      ['slender', 'Positive', 'Slender suggests graceful thinness.'],
      ['skinny', 'Negative', 'Skinny often suggests too thin.']
    ]
  })),
  S('engSMC7', 'Semicolons and colons', 7, 'Punctuation', '⁝', pairs({
    prompt: () => 'Which sentence is punctuated correctly?',
    items: [
      choose('I love pizza; my sister prefers pasta.', ['I love pizza, my sister prefers pasta.', 'I love pizza: my sister prefers pasta.', 'I love; pizza my sister prefers pasta.'], 'A semicolon joins two closely related independent clauses.'),
      choose('Pack these items: a towel, sunscreen, and water.', ['Pack these items; a towel, sunscreen, and water.', 'Pack: these items a towel, sunscreen, and water.', 'Pack these items, a towel; sunscreen, and water.'], 'A colon introduces a list after a complete sentence.'),
      choose('It was late; we went home.', ['It was late: we went; home.', 'It was late, we went home.', 'It was; late we went home.'], 'A semicolon can join two related sentences.'),
      choose('She had one goal: to win.', ['She had one goal; to win.', 'She had: one goal to win.', 'She had one goal, to win.'], 'A colon introduces an explanation after a complete sentence.'),
      choose('We visited Paris, France; Rome, Italy; and Madrid, Spain.', ['We visited Paris, France, Rome, Italy, and Madrid, Spain.', 'We visited Paris; France, Rome; Italy and Madrid, Spain.', 'We visited: Paris, France; Rome Italy; and Madrid Spain.'], 'Semicolons separate list items that already contain commas.')
    ]
  })),
  S('engANL7', 'Word analogies', 7, 'Vocabulary', '🔁', pairs({
    prompt: q => q,
    items: [
      ['Hot is to cold as up is to ___.', 'down', 'Both pairs are opposites.'],
      ['Puppy is to dog as kitten is to ___.', 'cat', 'A young animal and its adult.'],
      ['Pen is to write as knife is to ___.', 'cut', 'A tool and its purpose.'],
      ['Finger is to hand as toe is to ___.', 'foot', 'A part and its whole.'],
      ['Happy is to joyful as sad is to ___.', 'sorrowful', 'Both pairs are synonyms.'],
      ['Bird is to nest as bee is to ___.', 'hive', 'An animal and its home.'],
      ['Author is to book as composer is to ___.', 'symphony', 'A creator and what they create.'],
      ['Thermometer is to temperature as ruler is to ___.', 'length', 'A tool and what it measures.']
    ]
  })),

  /* ================= GRADE 8 ================= */
  S('engVCE8', 'Active and passive voice', 8, 'Grammar', '🔄', classify({
    categories: ['Active voice', 'Passive voice'],
    prompt: s => `Is this sentence in active or passive voice?<br>${em(s)}`,
    items: [
      ['The chef cooked the meal.', 'Active voice', 'The subject (chef) does the action.'],
      ['The meal was cooked by the chef.', 'Passive voice', 'The subject (meal) receives the action.'],
      ['The ball was thrown by Ana.', 'Passive voice', 'The subject (ball) receives the action.'],
      ['Ana threw the ball.', 'Active voice', 'The subject (Ana) does the action.'],
      ['The window was broken.', 'Passive voice', 'The subject receives the action; the doer is not named.'],
      ['Dogs chase cats.', 'Active voice', 'The subject (dogs) does the action.'],
      ['The report will be finished tomorrow.', 'Passive voice', 'The subject (report) receives the action.'],
      ['Our team won the championship.', 'Active voice', 'The subject (team) does the action.']
    ]
  })),
  S('engVBL8', 'Gerunds, participles and infinitives', 8, 'Grammar', '🔠', classify({
    categories: ['Gerund', 'Participle', 'Infinitive'],
    prompt: s => `What is the underlined verbal? ${em(s)}`,
    items: [
      ['<u>Swimming</u> is my favorite sport.', 'Gerund', 'A gerund is an -ing verb used as a noun (the subject here).'],
      ['She wants <u>to win</u> the race.', 'Infinitive', 'An infinitive is "to" + a verb.'],
      ['The <u>broken</u> vase lay on the floor.', 'Participle', 'A participle is a verb form used as an adjective.'],
      ['I enjoy <u>reading</u> before bed.', 'Gerund', 'An -ing verb acting as the object — a noun.'],
      ['<u>To learn</u> a language takes time.', 'Infinitive', 'An infinitive is "to" + a verb.'],
      ['The <u>laughing</u> children ran outside.', 'Participle', 'An -ing verb describing the children — an adjective.'],
      ['He hopes <u>to travel</u> this summer.', 'Infinitive', 'An infinitive is "to" + a verb.'],
      ['Her <u>amazing</u> performance won the prize.', 'Participle', 'It describes the performance — an adjective.']
    ]
  })),
  S('engPRL8', 'Parallel structure', 8, 'Grammar', '〰️', pairs({
    prompt: () => 'Which sentence uses parallel structure?',
    items: [
      choose('She likes hiking, swimming, and biking.', ['She likes hiking, swimming, and to bike.', 'She likes to hike, swimming, and biking.', 'She likes hiking, to swim, and biking.'], 'All items in the list should have the same form (-ing).'),
      choose('He is smart, funny, and kind.', ['He is smart, funny, and has kindness.', 'He is smart, makes jokes, and kind.', 'He is smart, funny, and a kindness.'], 'All items are adjectives.'),
      choose('To read is to learn.', ['To read is learning.', 'Reading is to learn.', 'To read is learned.'], 'Both parts use "to + verb".'),
      choose('We came, we saw, we conquered.', ['We came, seeing, and we conquered.', 'We came, we saw, conquering.', 'Coming, we saw, we conquered.'], 'Each part has the same grammatical form.'),
      choose('The coach told us to stretch, to run, and to rest.', ['The coach told us to stretch, running, and to rest.', 'The coach told us stretching, to run, and rest.', 'The coach told us to stretch, to run, and resting.'], 'All items use "to + verb".')
    ]
  })),
  S('engALU8', 'Allusions', 8, 'Figurative language', '🏺', pairs({
    prompt: a => `What does the allusion ${b(a)} suggest?`,
    items: [
      ['Pandora\'s box', 'An action that unleashes many unexpected troubles', 'Myth: Pandora opened a box and released evils into the world.'],
      ['Achilles\' heel', 'A weakness in an otherwise strong person', 'Myth: Achilles could only be wounded on his heel.'],
      ['A Herculean task', 'A job that takes great strength or effort', 'Hercules performed twelve extremely difficult labors.'],
      ['The Midas touch', 'The ability to make money from everything', 'Myth: King Midas turned everything he touched into gold.'],
      ['A Good Samaritan', 'A person who helps strangers in need', 'Bible parable of a kind stranger who helped an injured traveler.'],
      ['David and Goliath', 'A small underdog facing a much larger opponent', 'Bible story: young David defeated the giant Goliath.'],
      ['A Trojan horse', 'Something that looks harmless but hides danger', 'Myth: Greeks hid soldiers inside a wooden horse to enter Troy.'],
      ['Scrooge', 'A miserly, ungenerous person', 'A character from Dickens\' <em>A Christmas Carol</em>.']
    ]
  })),
  S('engMOD8', 'Misplaced and dangling modifiers', 8, 'Grammar', '🎯', pairs({
    prompt: () => 'Which sentence is written clearly, with the modifier next to the word it describes?',
    items: [
      choose('Walking to school, I saw a rainbow.', ['Walking to school, a rainbow appeared in the sky.', 'Walking to school, the rain stopped.'], 'The person walking (I) must follow the opening phrase.'),
      choose('After finishing the test, Mia handed it in.', ['After finishing the test, the paper was handed in.', 'After finishing the test, the bell rang.'], 'The person finishing (Mia) must follow the opening phrase.'),
      choose('Covered in chocolate, the strawberries were delicious.', ['Covered in chocolate, I ate the strawberries.', 'Covered in chocolate, Dad served us.'], '"Covered in chocolate" must describe the strawberries.'),
      choose('I found a wallet lying on the sidewalk.', ['Lying on the sidewalk, I found a wallet.', 'Lying on the sidewalk, a wallet found me.'], 'Put "lying on the sidewalk" next to the wallet.'),
      choose('Slipping on the ice, Tom dropped his books.', ['Slipping on the ice, the books fell.', 'Slipping on the ice, the sidewalk was dangerous to Tom.'], 'The person slipping (Tom) must follow the opening phrase.')
    ]
  })),

  /* ================= GRADE 9 ================= */
  S('engLTD9', 'Literary devices', 9, 'Literature', '📚', classify({
    categories: ['Irony', 'Foreshadowing', 'Symbolism', 'Imagery', 'Flashback'],
    prompt: s => `Which literary device is shown?<br>${em(s)}`,
    items: [
      ['A fire station burns down.', 'Irony', 'The opposite of what is expected happens.'],
      ['Dark clouds gathered as the family set off on the trip, and Mom frowned at the sky.', 'Foreshadowing', 'It hints at trouble to come.'],
      ['A white dove appears when the war ends.', 'Symbolism', 'The dove stands for peace.'],
      ['The crisp, golden leaves crunched underfoot and smelled of woodsmoke.', 'Imagery', 'It uses sensory details (sight, sound, smell).'],
      ['A chapter breaks to show the hero\'s childhood years earlier.', 'Flashback', 'The story jumps back in time.'],
      ['A pilot who is afraid of heights.', 'Irony', 'It is the opposite of what we would expect.'],
      ['A broken mirror appears before the character\'s troubles begin.', 'Foreshadowing', 'It hints at bad luck to come.'],
      ['A green light at the end of a dock stands for the hero\'s dreams.', 'Symbolism', 'An object represents an idea.'],
      ['The sweet scent of lilacs drifted through the warm, humming evening.', 'Imagery', 'It uses sensory details.']
    ]
  })),
  S('engAGR9', 'Subject-verb agreement', 9, 'Grammar', '🤝', pairs({
    prompt: s => `Choose the correct verb:<br>${em(s)}`,
    items: [
      ['The team of players ___ practicing.', 'is', 'The subject is the singular "team".', ['is', 'are', 'were', 'be']],
      ['Neither the teacher nor the students ___ ready.', 'are', 'The verb agrees with the nearer subject (students).', ['are', 'is', 'was', 'be']],
      ['Each of the boys ___ a bike.', 'has', '"Each" is singular.', ['has', 'have', 'having', 'are having']],
      ['The data ___ clear.', 'are', 'Data is plural in formal writing.', ['are', 'is', 'was', 'be']],
      ['Everyone ___ here.', 'is', '"Everyone" is singular.', ['is', 'are', 'were', 'be']],
      ['The books on the shelf ___ old.', 'are', 'The subject is the plural "books".', ['are', 'is', 'was', 'be']],
      ['Mathematics ___ my favorite subject.', 'is', 'Mathematics is singular despite the -s.', ['is', 'are', 'were', 'be']],
      ['Either the cat or the dogs ___ outside.', 'are', 'The verb agrees with the nearer subject (dogs).', ['are', 'is', 'was', 'be']],
      ['The jury ___ reached its verdict.', 'has', 'A jury acting as one unit takes a singular verb.', ['has', 'have', 'are', 'were']]
    ]
  })),
  S('engRHA9', 'Rhetorical appeals', 9, 'Rhetoric', '🗣️', classify({
    categories: ['Ethos (credibility)', 'Pathos (emotion)', 'Logos (logic)'],
    prompt: s => `Which appeal is used?<br>${em(s)}`,
    items: [
      ['As a doctor with 20 years of experience, I recommend this treatment.', 'Ethos (credibility)', 'It builds trust by citing the speaker\'s expertise.'],
      ['Imagine a child going to bed hungry tonight.', 'Pathos (emotion)', 'It stirs the audience\'s feelings.'],
      ['Studies show that 90% of users improved within a month.', 'Logos (logic)', 'It uses data and evidence.'],
      ['As a veteran, I know what our soldiers need.', 'Ethos (credibility)', 'It relies on the speaker\'s experience.'],
      ['Think of the heartbroken families who lost everything.', 'Pathos (emotion)', 'It appeals to sympathy.'],
      ['If prices rise 5% each year, they will double in about 14 years.', 'Logos (logic)', 'It uses reasoning and numbers.'],
      ['Our award-winning scientists have tested this for a decade.', 'Ethos (credibility)', 'It cites qualifications and track record.'],
      ['Don\'t let these adorable puppies suffer another night in the cold.', 'Pathos (emotion)', 'It appeals to feelings of compassion.']
    ]
  })),
  S('engSPL9', 'Commonly misspelled words', 9, 'Vocabulary', '✍️', pairs({
    prompt: () => 'Which word is spelled correctly?',
    items: [
      ['', 'definitely', 'There is “finite” in definitely.', ['definitely', 'definately', 'definitly', 'defanitely']],
      ['', 'separate', 'Remember: “a rat” in sepARATe.', ['separate', 'seperate', 'seprate', 'separete']],
      ['', 'receive', 'I before E except after C.', ['receive', 'recieve', 'receeve', 'recive']],
      ['', 'occurrence', 'Double c, double r.', ['occurrence', 'occurence', 'occurrance', 'ocurrence']],
      ['', 'embarrass', 'Double r, double s.', ['embarrass', 'embarass', 'embarras', 'embaress']],
      ['', 'necessary', 'One collar (c), two sleeves (s).', ['necessary', 'neccessary', 'necesary', 'neccesary']],
      ['', 'accommodate', 'Double c, double m.', ['accommodate', 'accomodate', 'acommodate', 'acomodate']],
      ['', 'rhythm', 'Rhythm Helps Your Two Hips Move.', ['rhythm', 'rythm', 'rhythem', 'rhytm']],
      ['', 'conscience', 'It contains “science”.', ['conscience', 'concience', 'consience', 'conshience']],
      ['', 'maintenance', 'It contains “maintain” + ance, with an e.', ['maintenance', 'maintainance', 'maintanance', 'maintenence']]
    ]
  })),
  S('engPOV9', 'Point of view', 9, 'Literature', '👁️', classify({
    categories: ['First person', 'Second person', 'Third person'],
    prompt: s => `What point of view is this?<br>${em(s)}`,
    items: [
      ['I walked into the room and felt my heart pound.', 'First person', 'The narrator uses I and my.'],
      ['You open the door and step into the dark hallway.', 'Second person', 'The narrator addresses the reader as you.'],
      ['She opened the door and stepped into the dark hallway.', 'Third person', 'The narrator uses she/he/they.'],
      ['We hiked up the hill and set up camp at sunset.', 'First person', 'The narrator uses we.'],
      ['They never knew what waited beyond the gate.', 'Third person', 'The narrator talks about others (they).'],
      ['You pick up the phone and hear a strange voice.', 'Second person', 'The narrator addresses you.'],
      ['My brother laughed, and I couldn\'t help joining in.', 'First person', 'The narrator uses my and I.']
    ]
  })),

  /* ================= GRADE 10 ================= */
  S('engFLC10', 'Logical fallacies', 10, 'Rhetoric', '⚠️', classify({
    categories: ['Ad hominem', 'Straw man', 'Bandwagon', 'False dilemma', 'Slippery slope'],
    prompt: s => `Which logical fallacy is this?<br>${em(s)}`,
    items: [
      ['You can\'t trust her opinion on climate — she dropped out of college.', 'Ad hominem', 'It attacks the person rather than the argument.'],
      ['Senator Lee wants a better road budget, so she must hate public transit.', 'Straw man', 'It misrepresents the opponent\'s position to make it easier to attack.'],
      ['Everyone is buying this phone, so it must be the best.', 'Bandwagon', 'It argues something is good because many people do it.'],
      ['Either we ban all cars or we accept a polluted planet.', 'False dilemma', 'It presents only two options when more exist.'],
      ['If we let students use calculators, soon they won\'t be able to add at all.', 'Slippery slope', 'It claims one step will lead to an extreme result without proof.'],
      ['Of course his plan is flawed — he\'s just a rookie.', 'Ad hominem', 'It attacks the person, not the plan.'],
      ['You\'re either with us or against us.', 'False dilemma', 'It ignores other possibilities.'],
      ['Millions of people believe in it, so it must be true.', 'Bandwagon', 'Popularity does not prove truth.']
    ]
  })),
  S('engWHM10', 'Who vs. whom', 10, 'Grammar', '🤔', pairs({
    prompt: s => `Choose the correct word:<br>${em(s)}`,
    items: [
      ['___ left their coat on the bus?', 'Who', '"He left" → who (subject).', ['Who', 'Whom', 'Whose', 'Which']],
      ['To ___ should I address the letter?', 'whom', '"Address it to him" → whom (object).', ['whom', 'who', 'whose', 'which']],
      ['The woman ___ called you is my aunt.', 'who', '"She called" → who (subject).', ['who', 'whom', 'whose', 'which']],
      ['___ did you invite to the party?', 'Whom', '"You invited him" → whom (object).', ['Whom', 'Who', 'Whose', 'Which']],
      ['He is the player ___ the coach praised.', 'whom', '"The coach praised him" → whom (object).', ['whom', 'who', 'whose', 'which']],
      ['I wonder ___ will win.', 'who', '"He will win" → who (subject).', ['who', 'whom', 'whose', 'which']],
      ['With ___ are you going?', 'whom', 'Object of the preposition "with".', ['whom', 'who', 'whose', 'which']]
    ]
  })),
  S('engPOE10', 'Poetry terms', 10, 'Literature', '🪶', pairs({
    prompt: q => q,
    items: [
      ['A poem with 14 lines is called a …', 'sonnet', 'Sonnets have 14 lines.'],
      ['A three-line Japanese poem with a 5-7-5 syllable pattern is a …', 'haiku', 'Haiku follow the 5-7-5 pattern.'],
      ['A group of lines in a poem, like a paragraph, is a …', 'stanza', 'A stanza is a group of lines.'],
      ['Poetry without a regular rhyme or meter is called …', 'free verse', 'Free verse has no set pattern.'],
      ['The repetition of vowel sounds in nearby words is …', 'assonance', 'Example: “the rain in Spain”.'],
      ['The pattern of stressed and unstressed syllables in a line is …', 'meter', 'Meter is the poem\'s rhythm pattern.'],
      ['A poem that tells a story, often sung, is a …', 'ballad', 'Ballads tell stories in verse.'],
      ['A poem of praise for a person, thing or event is an …', 'ode', 'Odes celebrate their subject.'],
      ['A line that continues into the next line without punctuation is …', 'enjambment', 'Enjambment carries the thought over the line break.']
    ]
  })),
  S('engVOC10', 'Vocabulary in context', 10, 'Vocabulary', '🧠', pairs({
    prompt: w => `Which word best completes the sentence?<br>${em(w)}`,
    items: [
      ['Her ___ speech convinced everyone in the room.', 'eloquent', 'Eloquent means fluent and persuasive.', ['eloquent', 'reluctant', 'frugal', 'meager']],
      ['He was ___ about spending money, saving every penny.', 'frugal', 'Frugal means careful with money.', ['frugal', 'lavish', 'gregarious', 'obsolete']],
      ['The ___ student never missed a deadline.', 'diligent', 'Diligent means hard-working and careful.', ['diligent', 'lethargic', 'arrogant', 'reckless']],
      ['The old phone is now ___; nobody uses it.', 'obsolete', 'Obsolete means no longer used.', ['obsolete', 'ambitious', 'prudent', 'vivid']],
      ['She gave a ___ reply, barely a word.', 'terse', 'Terse means brief and to the point.', ['terse', 'verbose', 'jovial', 'ardent']],
      ['His ___ nature made him the life of the party.', 'gregarious', 'Gregarious means sociable.', ['gregarious', 'reclusive', 'candid', 'austere']],
      ['The ___ details of the painting amazed us.', 'meticulous', 'Meticulous means extremely careful and precise.', ['meticulous', 'careless', 'vague', 'drab']],
      ['The politician\'s ___ praise was clearly insincere.', 'effusive', 'Effusive means overflowing with feeling (here, too much).', ['effusive', 'subdued', 'blunt', 'timid']]
    ]
  })),
  S('engRED10', 'Reading: author\'s purpose', 10, 'Reading comprehension', '🎯', classify({
    categories: ['To persuade', 'To inform', 'To entertain'],
    prompt: s => `What is the author's main purpose?<br>${em(s)}`,
    items: [
      ['Every citizen should vote — it is the best way to shape our future.', 'To persuade', 'It urges readers to take action.'],
      ['The heart has four chambers and pumps about five litres of blood per minute.', 'To inform', 'It states facts.'],
      ['The tiny dragon sneezed, setting the king\'s beard on fire — again.', 'To entertain', 'It tells a funny story.'],
      ['Buy our new sneakers today — you deserve the very best!', 'To persuade', 'It tries to convince readers to buy.'],
      ['The Great Wall of China is over 20,000 kilometres long.', 'To inform', 'It states facts.'],
      ['There once was a cat who thought she was a lion, and the mice laughed all day.', 'To entertain', 'It tells an amusing story.'],
      ['Schools must offer healthier lunches, because children deserve better.', 'To persuade', 'It argues for a change.']
    ]
  })),

  /* ================= GRADE 11 ================= */
  S('engRHD11', 'Rhetorical devices', 11, 'Rhetoric', '🎤', classify({
    categories: ['Anaphora', 'Antithesis', 'Oxymoron', 'Paradox', 'Rhetorical question'],
    prompt: s => `Which device is used?<br>${em(s)}`,
    items: [
      ['I have a dream… I have a dream… I have a dream…', 'Anaphora', 'The same opening words repeat in successive phrases.'],
      ['It was the best of times, it was the worst of times.', 'Antithesis', 'Opposite ideas are placed side by side.'],
      ['The silence was deafening.', 'Oxymoron', 'Contradictory words combined (silence/deafening).'],
      ['Less is more.', 'Paradox', 'It seems self-contradictory but reveals a truth.'],
      ['Can we really sit back and do nothing?', 'Rhetorical question', 'A question asked for effect, not for an answer.'],
      ['We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields.', 'Anaphora', 'The phrase “we shall fight” repeats at the start.'],
      ['Ask not what your country can do for you — ask what you can do for your country.', 'Antithesis', 'Contrasting ideas in parallel form.'],
      ['Jumbo shrimp', 'Oxymoron', 'Contradictory words together.']
    ]
  })),
  S('engAUT11', 'American literature: authors', 11, 'Literature', '🇺🇸', pairs({
    prompt: q => q,
    items: [
      ['Who wrote <em>The Great Gatsby</em>?', 'F. Scott Fitzgerald'],
      ['Who wrote <em>To Kill a Mockingbird</em>?', 'Harper Lee'],
      ['Who wrote <em>Adventures of Huckleberry Finn</em>?', 'Mark Twain'],
      ['Who wrote <em>The Scarlet Letter</em>?', 'Nathaniel Hawthorne'],
      ['Who wrote <em>Moby-Dick</em>?', 'Herman Melville'],
      ['Who wrote <em>The Grapes of Wrath</em>?', 'John Steinbeck'],
      ['Who wrote <em>The Catcher in the Rye</em>?', 'J. D. Salinger'],
      ['Who wrote “The Raven”?', 'Edgar Allan Poe'],
      ['Who wrote <em>Of Mice and Men</em>?', 'John Steinbeck'],
      ['Who wrote <em>The Crucible</em>?', 'Arthur Miller']
    ].map(([q, a]) => [q, a, `${b(a)} wrote it.`, ['F. Scott Fitzgerald', 'Harper Lee', 'Mark Twain', 'Nathaniel Hawthorne', 'Herman Melville', 'John Steinbeck', 'J. D. Salinger', 'Edgar Allan Poe', 'Arthur Miller']])
  })),
  S('engERR11', 'Fixing sentence errors', 11, 'Grammar', '🛠️', pairs({
    prompt: s => `Which is the best correction?<br>${em(s)}`,
    items: [
      ['Each of the students bring a lunch.', 'Each of the students brings a lunch.', '"Each" is singular, so the verb is brings.', ['Each of the students brings a lunch.', 'Each of the students bring lunches.', 'Each of the students are bringing a lunch.', 'Each of the students have brought a lunch.']],
      ['Its a beautiful day, isn\'t it?', 'It\'s a beautiful day, isn\'t it?', 'It\'s = it is.', ['It\'s a beautiful day, isn\'t it?', 'Its\' a beautiful day, isn\'t it?', 'Its a beautiful day isn\'t it.', 'Its a beautiful, day, isn\'t it?']],
      ['Me and her went to the game.', 'She and I went to the game.', 'Use subject pronouns as the subject.', ['She and I went to the game.', 'Her and I went to the game.', 'Me and she went to the game.', 'She and me went to the game.']],
      ['The decision was between he and I.', 'The decision was between him and me.', 'Use object pronouns after prepositions.', ['The decision was between him and me.', 'The decision was between he and me.', 'The decision was between him and I.', 'The decision was among he and I.']],
      ['Having finished the exam, the bell rang.', 'Having finished the exam, we heard the bell ring.', 'The opening phrase needs a logical subject (we).', ['Having finished the exam, we heard the bell ring.', 'Having finished the exam, the bell was rung.', 'The bell rang having finished the exam.', 'Finishing the exam, the bell rung.']],
      ['I could of won the race.', 'I could have won the race.', '“Could of” is a mishearing of “could have”.', ['I could have won the race.', 'I could of win the race.', 'I could\'ve of won the race.', 'I can of won the race.']]
    ]
  })),
  S('engPER11', 'American literary periods', 11, 'Literature', '🕰️', classify({
    categories: ['Romanticism', 'Realism', 'Modernism', 'Harlem Renaissance'],
    prompt: s => `Which literary movement is most associated with ${s}?`,
    items: [
      ['Edgar Allan Poe', 'Romanticism', 'Poe\'s dark, imaginative tales are Romantic.'],
      ['Mark Twain', 'Realism', 'Twain portrayed everyday life and dialect.'],
      ['F. Scott Fitzgerald', 'Modernism', 'Fitzgerald wrote in the Jazz-Age Modernist era.'],
      ['Langston Hughes', 'Harlem Renaissance', 'Hughes was a leading Harlem Renaissance poet.'],
      ['Ralph Waldo Emerson', 'Romanticism', 'Emerson\'s Transcendentalism grew from Romanticism.'],
      ['Henry James', 'Realism', 'James explored real social life in detail.'],
      ['Ernest Hemingway', 'Modernism', 'Hemingway\'s spare style is Modernist.'],
      ['Zora Neale Hurston', 'Harlem Renaissance', 'Hurston wrote <em>Their Eyes Were Watching God</em>.']
    ]
  })),

  /* ================= GRADE 12 ================= */
  S('engBRL12', 'British literature: authors and works', 12, 'Literature', '🇬🇧', pairs({
    prompt: q => q,
    items: [
      ['Who wrote <em>Pride and Prejudice</em>?', 'Jane Austen'],
      ['Who wrote <em>Great Expectations</em>?', 'Charles Dickens'],
      ['Who wrote <em>Jane Eyre</em>?', 'Charlotte Brontë'],
      ['Who wrote <em>Wuthering Heights</em>?', 'Emily Brontë'],
      ['Who wrote <em>Frankenstein</em>?', 'Mary Shelley'],
      ['Who wrote <em>1984</em>?', 'George Orwell'],
      ['Who wrote <em>Beowulf</em>?', 'Anonymous (unknown)'],
      ['Who wrote <em>The Canterbury Tales</em>?', 'Geoffrey Chaucer'],
      ['Who wrote <em>Paradise Lost</em>?', 'John Milton'],
      ['Who wrote <em>Heart of Darkness</em>?', 'Joseph Conrad']
    ].map(([q, a]) => [q, a, `${b(a)} is the author.`, ['Jane Austen', 'Charles Dickens', 'Charlotte Brontë', 'Emily Brontë', 'Mary Shelley', 'George Orwell', 'Anonymous (unknown)', 'Geoffrey Chaucer', 'John Milton', 'Joseph Conrad']])
  })),
  S('engSHK12', 'Shakespeare', 12, 'Literature', '🎭', pairs({
    prompt: q => q,
    items: [
      ['Which play features the characters Romeo and Juliet?', 'Romeo and Juliet'],
      ['In which play does the Prince of Denmark seek revenge on his uncle?', 'Hamlet'],
      ['In which play do three witches prophesy that a Scottish general will become king?', 'Macbeth'],
      ['In which play does Iago deceive his general into jealousy?', 'Othello'],
      ['In which play does a king divide his kingdom among his three daughters?', 'King Lear'],
      ['Which comedy features Puck, fairies and a magical forest?', 'A Midsummer Night\'s Dream'],
      ['In which play does a moneylender demand a “pound of flesh”?', 'The Merchant of Venice'],
      ['Which play begins with a shipwreck and a magician named Prospero?', 'The Tempest'],
      ['Which play contains the line “Et tu, Brute?”', 'Julius Caesar']
    ].map(([q, a]) => [q, a, `The answer is ${b(a)}.`, ['Romeo and Juliet', 'Hamlet', 'Macbeth', 'Othello', 'King Lear', 'A Midsummer Night\'s Dream', 'The Merchant of Venice', 'The Tempest', 'Julius Caesar']])
  })),
  S('engMVT12', 'Literary movements', 12, 'Literature', '🎨', classify({
    categories: ['Romanticism', 'Victorian', 'Modernism', 'Gothic', 'Renaissance'],
    prompt: s => `Which movement or period is ${s} most associated with?`,
    items: [
      ['William Wordsworth', 'Romanticism', 'Wordsworth was a key Romantic poet.'],
      ['Charles Dickens', 'Victorian', 'Dickens wrote during Queen Victoria\'s reign.'],
      ['Virginia Woolf', 'Modernism', 'Woolf pioneered stream of consciousness.'],
      ['Mary Shelley\'s <em>Frankenstein</em>', 'Gothic', 'It blends horror, mystery and the supernatural.'],
      ['William Shakespeare', 'Renaissance', 'Shakespeare wrote in the English Renaissance.'],
      ['Lord Byron', 'Romanticism', 'Byron was a Romantic poet.'],
      ['T. S. Eliot\'s <em>The Waste Land</em>', 'Modernism', 'It is a landmark Modernist poem.'],
      ['Bram Stoker\'s <em>Dracula</em>', 'Gothic', 'It is a classic Gothic horror novel.'],
      ['Christopher Marlowe', 'Renaissance', 'Marlowe wrote <em>Doctor Faustus</em> in the Renaissance.']
    ]
  })),
  S('engVOC12', 'Advanced vocabulary', 12, 'Vocabulary', '🎓', pairs({
    prompt: w => `What does ${b(w)} mean?`,
    items: [
      ['ubiquitous', 'present everywhere'], ['ephemeral', 'lasting a very short time'],
      ['pragmatic', 'practical and realistic'], ['ambivalent', 'having mixed feelings'],
      ['benevolent', 'kind and well-meaning'], ['cogent', 'clear and convincing'],
      ['equivocal', 'open to more than one meaning'], ['laconic', 'using very few words'],
      ['mitigate', 'make less severe'], ['pernicious', 'harmful in a gradual way'],
      ['quixotic', 'unrealistically idealistic'], ['superfluous', 'more than is needed']
    ].map(([w, a]) => [w, a, `${b(w)} means ${b(a)}.`])
  })),
  S('engCNV12', 'Writing conventions: pronoun reference', 12, 'Grammar', '✒️', pairs({
    prompt: () => 'Which sentence has a clear pronoun reference?',
    items: [
      choose('When Maria met Ana, Maria gave Ana a gift.', ['When Maria met Ana, she gave her a gift.', 'Maria met Ana, and she gave her one.'], 'In the other choices, "she" could mean either person. Repeating the names removes the confusion.'),
      choose('The manager told Lee, "I will approve your request."', ['The manager told Lee that he would approve his request.', 'The manager told Lee he would approve it for him.'], 'In the other choices, "he" and "his" could refer to either person. A direct quotation is clear.'),
      choose('The report says that sales fell.', ['They say in the report that sales fell.', 'In the report it says that sales fell.'], '"They" and "it" have no clear antecedent. Name the source instead.'),
      choose('Mia told Ana, "You are late."', ['Mia told Ana that she was late.', 'Mia told Ana she was late and so was she.'], 'In the other choices "she" could refer to either person. A direct quotation is clear.'),
      choose('Dr. Lee told the patient, "I will call you tomorrow."', ['Dr. Lee told the patient that she would call her tomorrow.', 'Dr. Lee told the patient she would call tomorrow.'], 'A direct quotation avoids confusion about who "she" is.')
    ]
  }))
];
