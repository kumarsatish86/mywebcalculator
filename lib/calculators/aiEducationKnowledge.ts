export type EduSubject = "math" | "physics" | "chemistry" | "biology" | "english" | "computer";

export type EduTopic = string;

export const EDU_SUBJECTS: { id: EduSubject; label: string }[] = [
  { id: "math", label: "Mathematics" },
  { id: "physics", label: "Physics" },
  { id: "chemistry", label: "Chemistry" },
  { id: "biology", label: "Biology" },
  { id: "english", label: "English" },
  { id: "computer", label: "Computer science" },
];

export const EDU_TOPICS: Record<EduSubject, { id: string; label: string }[]> = {
  math: [
    { id: "algebra", label: "Algebra" },
    { id: "trigonometry", label: "Trigonometry" },
    { id: "geometry", label: "Geometry" },
    { id: "calculus", label: "Calculus basics" },
  ],
  physics: [
    { id: "mechanics", label: "Mechanics" },
    { id: "electricity", label: "Electricity" },
    { id: "optics", label: "Optics" },
    { id: "thermodynamics", label: "Thermodynamics" },
  ],
  chemistry: [
    { id: "mole", label: "Mole concept" },
    { id: "acids", label: "Acids & bases" },
    { id: "organic", label: "Organic basics" },
    { id: "periodic", label: "Periodic table" },
  ],
  biology: [
    { id: "cell", label: "Cell biology" },
    { id: "genetics", label: "Genetics" },
    { id: "human", label: "Human physiology" },
    { id: "ecology", label: "Ecology" },
  ],
  english: [
    { id: "grammar", label: "Grammar" },
    { id: "essay", label: "Essay writing" },
    { id: "comprehension", label: "Comprehension" },
    { id: "vocabulary", label: "Vocabulary" },
  ],
  computer: [
    { id: "programming", label: "Programming basics" },
    { id: "datastructures", label: "Data structures" },
    { id: "networks", label: "Networks" },
    { id: "databases", label: "Databases" },
  ],
};

export const CONCEPT_STEPS: Record<string, { title: string; steps: string[] }> = {
  "math-algebra": {
    title: "Algebra fundamentals",
    steps: [
      "Identify variables and constants in the expression.",
      "Apply inverse operations to isolate the unknown on one side.",
      "Combine like terms before solving.",
      "Substitute the solution back to verify both sides match.",
    ],
  },
  "math-trigonometry": {
    title: "Trigonometry ratios",
    steps: [
      "Label opposite, adjacent, and hypotenuse relative to the angle.",
      "Pick sin, cos, or tan based on which sides are known.",
      "Set up the ratio equation and cross-multiply.",
      "Check whether the angle is acute or obtuse for validity.",
    ],
  },
  "physics-mechanics": {
    title: "Mechanics problem flow",
    steps: [
      "Draw a free-body diagram with all forces.",
      "Choose sign convention (+ direction) before writing equations.",
      "Apply Newton's laws or energy conservation as appropriate.",
      "Solve for the unknown and check units (N, m/s², J).",
    ],
  },
  "physics-electricity": {
    title: "Electric circuits",
    steps: [
      "Identify series vs parallel segments.",
      "Apply Ohm's law V = IR per resistor.",
      "Use Kirchhoff's rules for junctions and loops if needed.",
      "Verify power P = VI for consistency.",
    ],
  },
  "chemistry-mole": {
    title: "Mole concept",
    steps: [
      "Convert mass to moles using molar mass (g/mol).",
      "Use mole ratio from balanced equation for stoichiometry.",
      "Track limiting reagent if two reactants are given.",
      "Report final amount with correct significant figures.",
    ],
  },
  "biology-cell": {
    title: "Cell structure & function",
    steps: [
      "Identify organelle from the function described.",
      "Link structure to function (e.g., mitochondria → ATP).",
      "Compare plant vs animal cell differences.",
      "Use labeled diagrams to recall spatial relationships.",
    ],
  },
  "english-essay": {
    title: "Essay structure",
    steps: [
      "Thesis: one clear claim in the introduction.",
      "Body: one idea per paragraph with evidence + analysis.",
      "Transitions: connect paragraphs logically.",
      "Conclusion: restate thesis without copying intro verbatim.",
    ],
  },
  "computer-programming": {
    title: "Programming problem solving",
    steps: [
      "Restate input → process → output in plain language.",
      "Choose data structures (array, map, stack) for the task.",
      "Write pseudocode before code.",
      "Test edge cases: empty input, single element, max size.",
    ],
  },
};

export const FORMULA_PACKS: Record<string, { name: string; expression: string; note: string }[]> = {
  "math-algebra": [
    { name: "Quadratic formula", expression: "x = (−b ± √(b²−4ac)) / 2a", note: "For ax² + bx + c = 0" },
    { name: "Difference of squares", expression: "a² − b² = (a+b)(a−b)", note: "Factorisation shortcut" },
    { name: "Linear slope", expression: "m = (y₂−y₁)/(x₂−x₁)", note: "Two-point form" },
  ],
  "math-trigonometry": [
    { name: "sin θ", expression: "sin θ = opposite / hypotenuse", note: "Right triangle" },
    { name: "cos θ", expression: "cos θ = adjacent / hypotenuse", note: "Right triangle" },
    { name: "tan θ", expression: "tan θ = opposite / adjacent", note: "Right triangle" },
    { name: "Identity", expression: "sin²θ + cos²θ = 1", note: "Pythagorean identity" },
  ],
  "math-geometry": [
    { name: "Circle area", expression: "A = πr²", note: "r = radius" },
    { name: "Circle circumference", expression: "C = 2πr", note: "" },
    { name: "Pythagoras", expression: "a² + b² = c²", note: "Right triangle" },
  ],
  "physics-mechanics": [
    { name: "Newton's 2nd law", expression: "F = ma", note: "Net force" },
    { name: "Kinetic energy", expression: "KE = ½mv²", note: "" },
    { name: "Work", expression: "W = Fd cos θ", note: "θ = angle to displacement" },
  ],
  "physics-electricity": [
    { name: "Ohm's law", expression: "V = IR", note: "" },
    { name: "Power", expression: "P = VI = I²R", note: "" },
    { name: "Series resistance", expression: "R_total = R₁ + R₂ + …", note: "" },
  ],
  "chemistry-mole": [
    { name: "Moles from mass", expression: "n = mass / molar mass", note: "" },
    { name: "Molarity", expression: "M = moles / volume (L)", note: "" },
    { name: "Ideal gas", expression: "PV = nRT", note: "R ≈ 8.314 J/(mol·K)" },
  ],
};

export const NOTES_OUTLINES: Record<string, { sections: { title: string; bullets: string[] }[] }> = {
  "math-algebra": {
    sections: [
      { title: "Key definitions", bullets: ["Variable", "Coefficient", "Like terms", "Identity vs equation"] },
      { title: "Techniques", bullets: ["Transposition", "Factorisation", "Completing the square", "Quadratic formula"] },
      { title: "Common mistakes", bullets: ["Sign errors when expanding", "Forgetting ± in quadratics", "Dividing by zero"] },
    ],
  },
  "physics-mechanics": {
    sections: [
      { title: "Core laws", bullets: ["Inertia", "F = ma", "Action-reaction pairs"] },
      { title: "Problem checklist", bullets: ["FBD first", "Units check", "Energy vs force method"] },
      { title: "Formulas to recall", bullets: ["v = u + at", "s = ut + ½at²", "KE = ½mv²"] },
    ],
  },
  "chemistry-mole": {
    sections: [
      { title: "Conversions", bullets: ["Mass ↔ moles", "Moles ↔ particles (Avogadro)", "Moles ↔ gas volume at STP"] },
      { title: "Stoichiometry", bullets: ["Balance equation", "Mole ratio", "Limiting reagent"] },
      { title: "Exam tips", bullets: ["Show working", "Sig figs", "Unit labels on every line"] },
    ],
  },
  "english-essay": {
    sections: [
      { title: "Structure", bullets: ["Hook", "Thesis", "3 body paragraphs", "Conclusion"] },
      { title: "PEEL method", bullets: ["Point", "Evidence", "Explanation", "Link back"] },
      { title: "Revision", bullets: ["Timed practice", "Peer review", "Vocabulary bank"] },
    ],
  },
};

export function topicKey(subject: EduSubject, topic: string): string {
  return `${subject}-${topic}`;
}

export function fallbackConcept(subject: EduSubject, topic: string) {
  return {
    title: `${topic} study path`,
    steps: [
      `Review textbook chapter on ${topic} in ${subject}.`,
      "List definitions and formulas on one page.",
      "Solve 5 easy → 5 medium → 2 hard problems.",
      "Explain one solved example aloud without notes.",
    ],
  };
}
