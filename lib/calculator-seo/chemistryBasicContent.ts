import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/chemistry-basic";
const HUB_LABEL = "Education · Science · Chemistry Basics";
const SHELL =
  "Classroom mole and formula arithmetic with consistent mass units. Educational models only — not lab certification.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
  chartKind: "sparkTrendDemo" | "none" = "sparkTrendDemo",
): RichArticle {
  return {
    slug,
    vertical: "education-math",
    category: "education",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Chemistry basics tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Molar mass", "Σ (atomic mass × count)"],
          ["Atomic mass", "Weighted isotope average"],
          ["Number of moles", "n = m / M"],
          ["Mole ↔ mass", "m = n M"],
          ["Mole ↔ particles", "N = n N_A"],
          ["Empirical formula", "Smallest integer mole ratio"],
          ["Molecular formula", "M_mol / M_emp multiplier"],
          ["% composition", "(atoms × A) / M × 100"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your chemistry inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Mole quantity idea",
            caption: "Share URL preserves your chemistry inputs.",
            sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CHEMISTRY_BASIC_ARTICLES: Record<string, RichArticle> = {
  "molar-mass-calculator": article(
    "molar-mass-calculator",
    "Molar mass",
    [
      "Adds atomic mass × atom-count pairs from two matching CSV lists.",
      "Use g/mol-scale atomic masses and positive integer (or decimal) counts.",
    ],
    {
      question: "Must the CSV lengths match?",
      answer: "Yes — each mass needs a corresponding count in the same order.",
    },
    "Molar Mass Calculator — Σ Atomic Mass × Count",
    "Calculate molar mass from atomic masses and atom counts (CSV).",
    ["molar mass calculator", "molecular weight", "atomic mass times count"],
    "sparkTrendDemo",
  ),
  "atomic-mass-calculator": article(
    "atomic-mass-calculator",
    "Atomic mass",
    [
      "Computes the weighted average atomic mass from isotope masses and abundance percentages.",
      "Abundances are normalized by their sum, so relative % values are fine.",
    ],
    {
      question: "Do abundances need to sum to 100?",
      answer: "Not strictly — the tool divides by the total, so any positive relative weights work.",
    },
    "Atomic Mass Calculator — Isotope Weighted Average",
    "Find average atomic mass from isotope masses and abundances.",
    ["atomic mass calculator", "isotope abundance", "weighted atomic mass"],
    "none",
  ),
  "number-of-moles-calculator": article(
    "number-of-moles-calculator",
    "Number of moles",
    [
      "Converts sample mass to moles with n = m / M.",
      "Keep mass in grams when molar mass is in g/mol.",
    ],
    {
      question: "Can mass be zero?",
      answer: "Yes — zero mass gives zero moles; molar mass must stay positive.",
    },
    "Number of Moles Calculator — n = m/M",
    "Calculate moles from mass and molar mass for chemistry problems.",
    ["number of moles calculator", "n = m/M", "moles from mass"],
    "sparkTrendDemo",
  ),
  "mole-to-mass-calculator": article(
    "mole-to-mass-calculator",
    "Mole to mass",
    [
      "Converts moles to mass with m = n × M.",
      "Useful for weighing out reagents from a mole target.",
    ],
    {
      question: "What units come out?",
      answer: "If M is in g/mol and n in mol, mass is in grams.",
    },
    "Mole to Mass Calculator — m = nM",
    "Convert moles to grams using molar mass.",
    ["mole to mass calculator", "m = nM", "grams from moles"],
    "none",
  ),
  "mass-to-mole-calculator": article(
    "mass-to-mole-calculator",
    "Mass to mole",
    [
      "Converts mass to moles with n = m / M (same relation as number of moles).",
      "Enter sample mass and the compound’s molar mass.",
    ],
    {
      question: "Is this different from number of moles?",
      answer: "Same formula — this slug is the mass→mole wording for search.",
    },
    "Mass to Mole Calculator — n = m/M",
    "Convert grams to moles using molar mass.",
    ["mass to mole calculator", "grams to moles", "n = m/M"],
    "sparkTrendDemo",
  ),
  "mole-to-particle-calculator": article(
    "mole-to-particle-calculator",
    "Mole to particles",
    [
      "Multiplies moles by Avogadro’s number N_A ≈ 6.022×10²³.",
      "Counts atoms, molecules, or formula units depending on context.",
    ],
    {
      question: "Which N_A value is used?",
      answer: "The SI-defined constant 6.02214076×10²³ mol⁻¹.",
    },
    "Mole to Particle Calculator — N = n N_A",
    "Convert moles to particle count using Avogadro’s number.",
    ["mole to particle calculator", "Avogadro", "particles from moles"],
    "none",
  ),
  "particle-to-mole-calculator": article(
    "particle-to-mole-calculator",
    "Particles to moles",
    [
      "Divides particle count by N_A to get moles.",
      "Enter a raw count (scientific notation is fine).",
    ],
    {
      question: "Can I enter 6.022e23?",
      answer: "Yes — decimal or scientific notation both parse as numbers.",
    },
    "Particle to Mole Calculator — n = N/N_A",
    "Convert particle count to moles with Avogadro’s number.",
    ["particle to mole calculator", "Avogadro inverse", "moles from particles"],
    "sparkTrendDemo",
  ),
  "empirical-formula-calculator": article(
    "empirical-formula-calculator",
    "Empirical formula",
    [
      "Finds the smallest integer ratio from a CSV of element mole amounts.",
      "Divide each amount by the smallest, then scale toward integers.",
    ],
    {
      question: "Do I enter element symbols?",
      answer: "No — enter numeric mole amounts only; map the ratio to symbols yourself.",
    },
    "Empirical Formula Calculator — Mole Ratio",
    "Get the simplest whole-number mole ratio from element amounts.",
    ["empirical formula calculator", "mole ratio", "simplest formula"],
    "none",
  ),
  "molecular-formula-calculator": article(
    "molecular-formula-calculator",
    "Molecular formula",
    [
      "Computes the integer multiplier M_molecular / M_empirical for the molecular formula.",
      "When the ratio is near an integer, the tool notes the nearest multiplier.",
    ],
    {
      question: "What if the ratio is not near an integer?",
      answer: "Check experimental molar masses — the note flags non-integer multipliers.",
    },
    "Molecular Formula Calculator — Multiplier",
    "Find the molecular-formula multiplier from empirical and molecular molar masses.",
    ["molecular formula calculator", "empirical to molecular", "molar mass ratio"],
    "sparkTrendDemo",
  ),
  "percentage-composition-calculator": article(
    "percentage-composition-calculator",
    "Percentage composition",
    [
      "Computes one element’s mass percent: (atoms × atomic mass / M_compound) × 100.",
      "Repeat for each element to build a full composition table.",
    ],
    {
      question: "Should percents sum to 100?",
      answer: "For a complete set of elements they should (within rounding); this tool does one element at a time.",
    },
    "Percentage Composition Calculator — Mass %",
    "Calculate an element’s mass percent in a compound.",
    ["percentage composition calculator", "mass percent", "element composition"],
    "none",
  ),
};
