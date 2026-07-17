import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/chemistry-solutions-concentration";
const HUB_LABEL = "Education · Science · Chemistry Solutions";
const SHELL =
  "Classroom solution chemistry with consistent concentration units. Educational only — not lab certification or process control.";

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
        title: "Solutions tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Molarity", "M = mol / L"],
          ["Molality", "m = mol / kg solvent"],
          ["Normality", "N = eq / L"],
          ["Mass / volume %", "Parts per hundred"],
          ["PPM", "mg / kg dilute aqueous"],
          ["Dilution", "M₁V₁ = M₂V₂"],
          ["Mixing / conversion", "Blend or M ↔ mass%"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your concentration inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Concentration trend idea",
            caption: "Share URL preserves your concentration inputs.",
            sparkValues: [0.18, 0.32, 0.48, 0.6, 0.75, 0.88],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CHEMISTRY_SOLUTIONS_ARTICLES: Record<string, RichArticle> = {
  "molarity-calculator": article(
    "molarity-calculator",
    "Molarity calculator",
    [
      "Computes molarity M = moles of solute ÷ liters of solution.",
      "Use solution volume (not solvent alone) for standard classroom molarity.",
    ],
    {
      question: "Is 1 L of water always 1 kg?",
      answer: "Approximately for dilute aqueous solutions near room temperature, but molarity uses volume in litres, not mass.",
    },
    "Molarity Calculator — M = mol/L",
    "Calculate solution molarity from moles of solute and volume in litres.",
    ["molarity calculator", "mol per liter", "solution concentration"],
    "sparkTrendDemo",
  ),
  "molality-calculator": article(
    "molality-calculator",
    "Molality calculator",
    [
      "Computes molality m = moles of solute ÷ kilograms of solvent.",
      "Molality is temperature-independent because it uses solvent mass, not solution volume.",
    ],
    {
      question: "Is molality the same as molarity?",
      answer: "No — molarity uses solution volume; molality uses solvent mass. They converge only for dilute aqueous cases.",
    },
    "Molality Calculator — m = mol/kg",
    "Calculate molality from moles of solute and kilograms of solvent.",
    ["molality calculator", "mol per kg solvent", "chemistry concentration"],
    "none",
  ),
  "normality-calculator": article(
    "normality-calculator",
    "Normality calculator",
    [
      "Computes normality N = equivalents ÷ liters of solution.",
      "Equivalents depend on the reaction (acid–base, redox); enter the equivalent count your problem defines.",
    ],
    {
      question: "How do I get equivalents?",
      answer: "For acids/bases, equivalents ≈ moles × n-factor. This tool does not infer n-factor for you.",
    },
    "Normality Calculator — N = eq/L",
    "Calculate normality from equivalents and solution volume in litres.",
    ["normality calculator", "equivalents per liter", "solution normality"],
    "sparkTrendDemo",
  ),
  "mass-percent-calculator": article(
    "mass-percent-calculator",
    "Mass percent",
    [
      "Mass % = (mass solute / mass solution) × 100 with consistent mass units.",
      "Solution mass must be at least as large as solute mass.",
    ],
    {
      question: "Is this weight/weight %?",
      answer: "Yes — it is the common w/w percent used in many lab recipes and homework problems.",
    },
    "Mass Percent Calculator — Chemistry",
    "Calculate mass percent concentration from solute and solution masses.",
    ["mass percent calculator", "w/w percent", "solution mass percent"],
    "none",
  ),
  "volume-percent-calculator": article(
    "volume-percent-calculator",
    "Volume percent",
    [
      "Volume % = (volume solute / volume solution) × 100 with consistent volume units.",
      "Ideal for alcohol–water style textbook examples where volumes add approximately.",
    ],
    {
      question: "Do volumes always add?",
      answer: "Not exactly for real mixtures — this educational model uses the volumes you enter without excess volume corrections.",
    },
    "Volume Percent Calculator — Chemistry",
    "Calculate volume percent from solute and solution volumes.",
    ["volume percent calculator", "v/v percent", "solution volume percent"],
    "sparkTrendDemo",
  ),
  "ppm-calculator-parts-per-million": article(
    "ppm-calculator-parts-per-million",
    "PPM calculator",
    [
      "Approximates ppm as mg solute per kg solution — common for dilute aqueous estimates.",
      "For denser or non-aqueous systems, confirm the definition your course uses (mass/mass vs mass/volume).",
    ],
    {
      question: "Is 1 ppm always 1 mg/L?",
      answer: "Only when solution density ≈ 1 g/mL. This tool uses mg/kg mass/mass ppm.",
    },
    "PPM Calculator — Parts Per Million",
    "Estimate ppm from milligrams of solute and kilograms of solution.",
    ["ppm calculator", "parts per million", "mg per kg"],
    "none",
  ),
  "dilution-calculator-chemistry": article(
    "dilution-calculator-chemistry",
    "Dilution calculator",
    [
      "Solves M₁V₁ = M₂V₂ when any three of M1, V1, M2, V2 are known.",
      "Leave exactly one field blank so the unknown concentration or volume can be found.",
    ],
    {
      question: "Must volumes be in litres?",
      answer: "Any consistent volume unit works (mL with mL, L with L) because the ratio cancels units.",
    },
    "Dilution Calculator — M1V1 = M2V2",
    "Solve dilution problems by leaving one of M1, V1, M2, or V2 blank.",
    ["dilution calculator chemistry", "M1V1=M2V2", "solution dilution"],
    "sparkTrendDemo",
  ),
  "solution-mixing-calculator": article(
    "solution-mixing-calculator",
    "Solution mixing",
    [
      "Mixes two solutions of the same solute: C_f = (C₁V₁ + C₂V₂) / (V₁ + V₂).",
      "Assumes additive volumes and no reaction between the solutions.",
    ],
    {
      question: "Can concentrations use different units?",
      answer: "No — C1 and C2 must share the same concentration unit (both M, both %, etc.).",
    },
    "Solution Mixing Calculator — Chemistry",
    "Find final concentration when mixing two solutions of the same solute.",
    ["solution mixing calculator", "mix two concentrations", "final concentration"],
    "none",
  ),
  "concentration-conversion-calculator": article(
    "concentration-conversion-calculator",
    "Concentration conversion",
    [
      "Approximates mass percent and molality from molarity, molar mass, and solution density (g/mL).",
      "Useful for textbook conversions; real solutions may need tabulated density data.",
    ],
    {
      question: "Why might conversion fail?",
      answer: "If density is too low for the stated molarity, implied solvent mass becomes non-positive and the model rejects the inputs.",
    },
    "Concentration Conversion Calculator",
    "Convert molarity toward mass percent and approximate molality using density.",
    ["concentration conversion", "molarity to mass percent", "molality from molarity"],
    "sparkTrendDemo",
  ),
};
