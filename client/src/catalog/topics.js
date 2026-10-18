/* ============================================================
   Topic headings for the skills page. IXL groups its English sections under
   topic headings; this does the same for Math and Science. A topic is looked up
   from a section's name (and, for Calculus, its grade) and decides both the
   heading shown above the section and the order sections appear in.
   ============================================================ */

/* ---------- Math ---------- */
export const MATH_TOPICS = [
  'Numbers and counting', 'Addition and subtraction', 'Multiplication and division', 'Number theory and exponents',
  'Fractions', 'Decimals', 'Integers and rational numbers', 'Ratios, rates and percents', 'Money and financial literacy',
  'Measurement', 'Problem solving', 'Patterns and sequences', 'Expressions, equations and inequalities', 'Functions and graphs',
  'Polynomials, quadratics and radicals', 'Advanced algebra and precalculus', 'Geometry', 'Trigonometry',
  'Data, statistics and probability', 'Logic and sets', 'Limits and continuity', 'Derivatives and their applications',
  'Integration and differential equations'
];

// First matching rule wins. Tested against the section name.
const MATH_RULES = [
  [/^BEDMAS/i, 'Expressions, equations and inequalities'],
  // ---- Calculus (handled by name; "Rational functions" is a limits topic only in Calculus, see mathTopic) ----
  [/limits|continuity|L'Hospital/i, 'Limits and continuity'],
  [/integra|Fundamental Theorem|Antiderivatives|^Definite integrals$|Differential equations/i, 'Integration and differential equations'],
  [/derivative|^Rates of change$|^Optimization$|^Linear approximation$|^Analyze functions/i, 'Derivatives and their applications'],

  // ---- Trigonometry, advanced algebra ----
  [/^Trigonometry$|^Trigonometric|^Right triangles$|^Angle measures$/i, 'Trigonometry'],
  [/^Matrices$|^Complex|^Polar form$|vectors$|^Conic sections$|^Systems of inequalities$|^Nonlinear inequalities$|^Circles in the coordinate plane$|^Families of functions$|^Rational functions|^Exponential(?: and logarithmic)? functions$|^Logarithms$/i, 'Advanced algebra and precalculus'],
  [/^Sequences and series$/i, 'Patterns and sequences'],
  [/^Probability distributions$/i, 'Data, statistics and probability'],
  [/^Logic$|^Sets$/i, 'Logic and sets'],

  // ---- Polynomials and quadratics ----
  [/^Monomials$|^Polynomials$|^Factoring$|^Quadratic|^Parabolas$|^Radical expressions$|^Radical functions|^Roots and rational exponents$|^Rational exponents$/i, 'Polynomials, quadratics and radicals'],

  // ---- Functions and graphs ----
  [/^Linear functions$|^Relations and functions$|^Functions$|^Functions: linear, quadratic, exponential$|^Two-variable equations$|^Systems of (?:linear )?equations$|^Direct variation$|^Direct and inverse variation$|^Proportional relationships$|^Transformations of functions$/i, 'Functions and graphs'],

  // ---- Data, statistics and probability ----
  [/^Data|statistics$|^Statistics$|^Probability|^Venn diagrams$/i, 'Data, statistics and probability'],

  // ---- Algebra: expressions, equations, inequalities ----
  [/expressions?$|equations?$|inequalities$|^Equations and variables$|^Solve equations$|^Variable expressions|^Equivalent expresssions$|^Numerical expressions$|^Properties$|^Addition properties$|^Equations$|^Inequalities$|^True or false equations$/i, 'Expressions, equations and inequalities'],

  // ---- Money ----
  [/^Money$|^Consumer math$|^Financial literacy$/i, 'Money and financial literacy'],

  // ---- Measurement ----
  [/^Time$|^Days, months and seasons$|^Units of measurement$|^Measurement$|^Size$/i, 'Measurement'],

  // ---- Problem solving ----
  [/^Problem solving|Multi-step word problems$|^Mixed operations: word problems$/i, 'Problem solving'],

  // ---- Geometry (incl. coordinates, area, volume) ----
  [/shapes?$|^Positions$|^Spatial sense$|^Classify$|^Classifying and sorting$|^Same and different$|^Shapes in the real world$|^Two-dimensional|^Three-dimensional|^Triangles|^Congruent figures$|^Similarity$|^Symmetry|^Transformations|^Constructions$|^Pythagorean theorem$|^Circles$|^Geometry$|^Lines and angles$|^Coordinate plane$|area|volume|^Area$|^Perimeter|^Triangles and quadrilaterals$/i, 'Geometry'],

  // ---- Patterns and sequences ----
  [/^Patterns|^Sequences$|^Number sequences$|^Skip-counting/i, 'Patterns and sequences'],

  // ---- Ratios, rates and percents ----
  [/^Ratios|^Percents|^Scale/i, 'Ratios, rates and percents'],

  // ---- Integers and rational numbers ----
  [/^Integers$|integers$|^Rational numbers$|rational numbers$/i, 'Integers and rational numbers'],

  // ---- Fractions ----
  [/fraction|^Mixed operations: fractions$|^Divide fractions$|^Multiply fractions$|^Understand fractions|^Equivalent fractions$|^Compare (?:and order )?fractions|^Order fractions$|^Relate fractions and decimals$/i, 'Fractions'],

  // ---- Decimals ----
  [/decimal|^Convert between decimals and fractions$|^Compare decimals|^Order decimals$/i, 'Decimals'],

  // ---- Number theory and exponents ----
  [/^Exponents|^Roots$|^Scientific notation$|^Number theory$|^Factors and multiples$/i, 'Number theory and exponents'],

  // ---- Multiplication and division ----
  [/^Multipl|^Divi|^Understand (?:multiplication|division)|Multiplicative|multiplication and division$|^Mixed operations: multiplication and division$/i, 'Multiplication and division'],

  // ---- Addition and subtraction ----
  [/^Add|^Subtract|^Understand (?:addition|subtraction)|^Take apart|^Mixed operations|addition and subtraction|^Addition and subtraction|subtraction/i, 'Addition and subtraction'],

  // ---- Numbers and counting (fallback for number-sense sections) ----
  [/^Count|^Numbers|^Names of numbers|^One more|^Comparing|^Place value|^Whole numbers|^Rounding|^Estimation|^Even and odd|^Operations$|^Decimal place/i, 'Numbers and counting']
];

export function mathTopic(gradeNum, name) {
  if (gradeNum === 13) {
    if (/^Rational functions$/.test(name)) return 'Limits and continuity';
    if (/^(?:Functions|Families of functions|Trigonometric functions|Exponential and logarithmic functions)$/.test(name)) return 'Advanced algebra and precalculus';
    if (/^Transformations$/.test(name)) return 'Advanced algebra and precalculus';
  }
  if (gradeNum >= 9 && gradeNum <= 12) {
    if (/^Equations$|^Inequalities$|^Solve equations$|^Single-variable inequalities$/.test(name)) return 'Expressions, equations and inequalities';
    if (/^Operations$|^Numbers$|^Geometry$|^Properties$/.test(name) && gradeNum === 9) return { Operations: 'Integers and rational numbers', Numbers: 'Integers and rational numbers', Geometry: 'Geometry', Properties: 'Expressions, equations and inequalities' }[name];
  }
  if (/^Exponents$/.test(name) && gradeNum >= 9) return 'Number theory and exponents';
  if (/^Numbers$/.test(name) && gradeNum >= 10) return 'Number theory and exponents';
  for (const [re, topic] of MATH_RULES) if (re.test(name)) return topic;
  return null;
}

/* ---------- Science ---------- */
export const SCIENCE_TOPICS = ['Science and engineering practices', 'Physical science', 'Life science', 'Earth and space science'];
const SCIENCE_MAP = {
  'Science practices and tools': 0, 'Designing experiments': 0, 'Engineering practices': 0, 'Units and measurement': 0,
  Materials: 1, 'States of matter': 1, 'Properties of matter': 1, 'Heat and thermal energy': 1, 'Physical and chemical change': 1, 'Particle motion and energy': 1,
  'Atomic structure': 1, 'Chemical bonding': 1, Nomenclature: 1, 'Chemical reactions': 1, 'The mole and stoichiometry': 1, Solutions: 1, 'Energy changes': 1,
  'Force and motion': 1, 'Speed, distance and time': 1, 'Motion in one dimension': 1, 'Forces and laws of motion': 1, 'Work, energy and power': 1,
  Energy: 1, Magnets: 1, 'Electricity and magnetism': 1, 'Light and sound': 1, Waves: 1,
  Classification: 2, Animals: 2, Plants: 2, 'Adaptations and natural selection': 2, Cells: 2, 'Cell growth and division': 2, 'DNA and protein synthesis': 2, Genetics: 2,
  'Anatomy and physiology': 2, Photosynthesis: 2, Ecosystems: 2,
  "Earth's resources": 3, 'Rocks and minerals': 3, Fossils: 3, 'Earth events': 3, 'Plate tectonics': 3, 'Water cycle': 3, Weather: 3, 'Weather and climate': 3,
  'The atmosphere': 3, 'Natural resources and human impacts': 3, Astronomy: 3
};
export const scienceTopic = (_grade, name) => (name in SCIENCE_MAP ? SCIENCE_TOPICS[SCIENCE_MAP[name]] : null);
