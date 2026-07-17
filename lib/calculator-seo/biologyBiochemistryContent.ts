import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/biology-biochemistry";
const HUB_LABEL = "Education · Science · Biology Biochemistry";
const SHELL =
  "Classroom biochemistry arithmetic with consistent concentration units. Educational models only — not clinical or lab certification.";

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
        title: "Biochemistry tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["pH from [H⁺]", "pH = −log₁₀[H⁺]"],
          ["Buffer pH", "Henderson–Hasselbalch"],
          ["Michaelis–Menten", "v = Vmax [S] / (Km+[S])"],
          ["Gibbs ΔG", "ΔG = ΔH − TΔS"],
          ["Molarity / dilution", "M = n/V ; M₁V₁=M₂V₂"],
          ["Protein concentration", "Beer–Lambert c = A/(εl)"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your biochemistry inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Kinetics idea",
            caption: "Share URL preserves your biochemistry inputs.",
            sparkValues: [0.15, 0.3, 0.48, 0.62, 0.78, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BIOLOGY_BIOCHEMISTRY_ARTICLES: Record<string, RichArticle> = {
  "ph-calculator-biology": article(
    "ph-calculator-biology",
    "pH from [H⁺]",
    [
      "Computes pH = −log₁₀ of hydrogen-ion molarity for dilute aqueous problems.",
      "Enter [H⁺] in mol/L (scientific notation is fine).",
    ],
    {
      question: "What [H⁺] gives pH 7?",
      answer: "About 1×10⁻⁷ M at the usual classroom 25 °C idealization.",
    },
    "pH Calculator Biology — pH = −log[H⁺]",
    "Calculate pH from hydrogen ion concentration for biology and chemistry classwork.",
    ["ph calculator biology", "hydrogen ion concentration", "pH from H+"],
    "sparkTrendDemo",
  ),
  "buffer-solution-calculator-biology": article(
    "buffer-solution-calculator-biology",
    "Buffer solution pH",
    [
      "Applies Henderson–Hasselbalch: pH = pKa + log([A⁻]/[HA]).",
      "Salt and acid concentrations must both be positive.",
    ],
    {
      question: "Do units of [A⁻] and [HA] matter?",
      answer: "Only their ratio matters — keep both in the same concentration units.",
    },
    "Buffer Solution Calculator Biology — Henderson–Hasselbalch",
    "Calculate buffer pH from pKa and conjugate acid/base concentrations.",
    ["buffer solution calculator biology", "Henderson Hasselbalch", "buffer pH"],
    "none",
  ),
  "enzyme-kinetics-michaelis-menten-calculator": article(
    "enzyme-kinetics-michaelis-menten-calculator",
    "Michaelis–Menten kinetics",
    [
      "Computes initial velocity v = Vmax [S] / (Km + [S]).",
      "Classic single-substrate enzyme model for classroom kinetics.",
    ],
    {
      question: "What happens when [S] ≫ Km?",
      answer: "Velocity approaches Vmax — the enzyme is nearly saturated.",
    },
    "Michaelis Menten Calculator — Enzyme Kinetics",
    "Calculate Michaelis–Menten velocity from Vmax, Km, and substrate concentration.",
    ["michaelis menten calculator", "enzyme kinetics", "Km Vmax"],
    "sparkTrendDemo",
  ),
  "gibbs-free-energy-calculator-biology": article(
    "gibbs-free-energy-calculator-biology",
    "Gibbs free energy",
    [
      "Computes ΔG = ΔH − T ΔS with temperature in kelvin.",
      "Sign of ΔG indicates spontaneity under the stated educational assumptions.",
    ],
    {
      question: "Can ΔH or ΔS be negative?",
      answer: "Yes — enter signed values; only temperature must stay positive.",
    },
    "Gibbs Free Energy Calculator Biology — ΔG = ΔH − TΔS",
    "Calculate biological Gibbs free energy from enthalpy, temperature, and entropy.",
    ["gibbs free energy calculator biology", "delta G", "thermodynamics biology"],
    "none",
  ),
  "molarity-calculator-biology": article(
    "molarity-calculator-biology",
    "Molarity (biology)",
    [
      "Computes molarity M = moles of solute ÷ liters of solution.",
      "Use solution volume for standard classroom molarity.",
    ],
    {
      question: "Can moles be zero?",
      answer: "Yes — zero moles gives 0 M; volume must remain positive.",
    },
    "Molarity Calculator Biology — M = mol/L",
    "Calculate solution molarity for biology lab math from moles and volume.",
    ["molarity calculator biology", "mol per liter", "solution concentration biology"],
    "sparkTrendDemo",
  ),
  "dilution-calculator-biology": article(
    "dilution-calculator-biology",
    "Dilution (M₁V₁ = M₂V₂)",
    [
      "Solves M₁V₁ = M₂V₂ when any three of M1, V1, M2, V2 are known.",
      "Leave exactly one field blank to solve for that unknown.",
    ],
    {
      question: "What if I fill all four fields?",
      answer: "Enter any three known values and leave the unknown blank so the tool can solve.",
    },
    "Dilution Calculator Biology — M1V1 = M2V2",
    "Solve biology dilution problems by leaving one of M1, V1, M2, V2 blank.",
    ["dilution calculator biology", "M1V1=M2V2", "serial dilution"],
    "none",
  ),
  "protein-concentration-calculator": article(
    "protein-concentration-calculator",
    "Protein concentration",
    [
      "Beer–Lambert: concentration = absorbance / (ε × path length).",
      "Use matching units for ε and path (typically cm⁻¹ concentration⁻¹ and cm).",
    ],
    {
      question: "Is absorbance allowed to be zero?",
      answer: "Yes — zero absorbance gives zero concentration; ε and path must stay positive.",
    },
    "Protein Concentration Calculator — Beer–Lambert",
    "Calculate protein concentration from absorbance, extinction coefficient, and path length.",
    ["protein concentration calculator", "Beer Lambert", "absorbance concentration"],
    "sparkTrendDemo",
  ),
};
