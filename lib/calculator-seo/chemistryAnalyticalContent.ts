import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/chemistry-analytical";
const HUB_LABEL = "Education · Science · Chemistry Analytical";
const SHELL =
  "Educational analytical-chemistry arithmetic for classroom use. Simplified models only — not lab method validation, instrument calibration, or clinical/assay advice.";

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
        title: "Analytical chemistry tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Titration", "M₁V₁ = M₂V₂ (1:1)"],
          ["Beer–Lambert", "A = ε c l"],
          ["Absorbance", "A = −log₁₀(I/I₀)"],
          ["c from A", "c = A / (ε l)"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your analytical inputs. Educational models only.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Absorbance idea",
            caption: "Share URL preserves your analytical inputs. Educational models only.",
            sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CHEMISTRY_ANALYTICAL_ARTICLES: Record<string, RichArticle> = {
  "titration-calculator-analytical": article(
    "titration-calculator-analytical",
    "Titration equivalence",
    [
      "For 1:1 acid–base stoichiometry, M₁V₁ = M₂V₂ at the equivalence point.",
      "Leave exactly one of M1, V1, M2, or V2 blank to solve. Classroom arithmetic only.",
    ],
    {
      question: "What if the reaction is not 1:1?",
      answer: "Scale by stoichiometric coefficients first; this tool assumes a 1:1 equivalence relation.",
    },
    "Titration Calculator — M1V1 = M2V2 Analytical Chemistry",
    "Solve acid–base titration equivalence with M₁V₁ = M₂V₂ for educational analytical chemistry.",
    ["titration calculator", "M1V1=M2V2", "analytical chemistry titration"],
    "sparkTrendDemo",
  ),
  "beer-lambert-law-calculator": article(
    "beer-lambert-law-calculator",
    "Beer–Lambert law",
    [
      "A = ε × c × path length — leave any one of A, ε, c, or path blank to solve.",
      "Educational spectrophotometry relation — not instrument calibration.",
    ],
    {
      question: "What units should I use?",
      answer: "Keep ε, c, and path mutually consistent (e.g. L·mol⁻¹·cm⁻¹, mol/L, cm).",
    },
    "Beer–Lambert Law Calculator — A = εcl",
    "Solve absorbance, molar absorptivity, concentration, or path length with Beer–Lambert.",
    ["beer lambert calculator", "A=εcl", "spectrophotometry calculator"],
    "none",
  ),
  "absorbance-calculator": article(
    "absorbance-calculator",
    "Absorbance from intensity",
    [
      "A = −log₁₀(I / I₀) where I₀ is incident and I is transmitted intensity.",
      "Also reports transmittance T = I/I₀. Educational optics/chem lab math.",
    ],
    {
      question: "Can I exceed I₀?",
      answer: "No — transmitted intensity cannot exceed incident intensity in this model.",
    },
    "Absorbance Calculator — From I and I₀",
    "Calculate absorbance and transmittance from incident and transmitted intensity.",
    ["absorbance calculator", "transmittance absorbance", "A=-log(I/I0)"],
    "sparkTrendDemo",
  ),
  "concentration-from-absorbance-calculator": article(
    "concentration-from-absorbance-calculator",
    "Concentration from absorbance",
    [
      "Rearranges Beer–Lambert: c = A / (ε × path) when A, ε, and path are known.",
      "Useful for dilute solutions in the linear Beer–Lambert range — educational use.",
    ],
    {
      question: "Why might real assays disagree?",
      answer: "Non-linearity, stray light, and blank corrections are outside this simplified model.",
    },
    "Concentration from Absorbance Calculator — c = A/(εl)",
    "Find concentration from absorbance, molar absorptivity, and path length.",
    ["concentration from absorbance", "beer lambert concentration", "ε path calculator"],
    "none",
  ),
};
