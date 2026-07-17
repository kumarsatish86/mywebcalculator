import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/biology-lab-research";
const HUB_LABEL = "Education · Science · Biology Lab & Research";
const SHELL =
  "Educational lab-bench math for classroom and training use only — not a substitute for validated SOPs, GLP documentation, or clinical lab practice.";

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
        title: "Lab & research tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Serial dilution", "C / DF^steps"],
          ["Centrifuge RCF/RPM", "RCF ∝ r × RPM²"],
          ["DNA concentration", "A260 × 50 × dilution"],
          ["PCR", "N₀ × 2^cycles"],
          ["Gel electrophoresis", "Rf = migration / dye front"],
          ["Lab solution", "C1V1 or mass = M×V×MW"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your inputs. Educational lab math only.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Dilution / amplification idea",
            caption: "Share URL preserves your inputs. Educational lab math only.",
            sparkValues: [1, 0.7, 0.45, 0.3, 0.2, 0.12],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BIOLOGY_LAB_RESEARCH_ARTICLES: Record<string, RichArticle> = {
  "serial-dilution-calculator": article(
    "serial-dilution-calculator",
    "Serial dilution",
    [
      "Computes C_final = C_initial / DF^steps for equal-factor serial dilutions.",
      "Bench teaching arithmetic — verify volumes and sterile technique in real protocols.",
    ],
    {
      question: "Must DF be greater than 1?",
      answer: "Yes — dilution factor must be > 1 and steps ≥ 1 for this helper.",
    },
    "Serial Dilution Calculator — C / DF^steps",
    "Calculate final concentration after serial dilution steps — educational lab math.",
    ["serial dilution calculator", "dilution factor steps", "lab concentration education"],
    "sparkTrendDemo",
  ),
  "centrifuge-rcf-rpm-calculator": article(
    "centrifuge-rcf-rpm-calculator",
    "Centrifuge RCF ↔ RPM",
    [
      "Converts between RPM and relative centrifugal force using RCF = 1.118×10⁻⁵ × r(mm) × RPM².",
      "Enter radius and either RPM or RCF (leave the other blank). Educational rotor math only.",
    ],
    {
      question: "What if both RPM and RCF are filled?",
      answer: "RPM is used to compute RCF when both are present; leave one blank to solve the other.",
    },
    "Centrifuge RCF RPM Calculator — Radius Conversion",
    "Convert centrifuge RPM and RCF from rotor radius in mm — educational lab tool.",
    ["centrifuge rcf rpm calculator", "relative centrifugal force", "rotor radius mm"],
    "none",
  ),
  "dna-concentration-calculator": article(
    "dna-concentration-calculator",
    "DNA concentration",
    [
      "Estimates dsDNA ng/µL ≈ A260 × 50 × dilution factor (Beer–Lambert teaching constant).",
      "Spectrophotometry classroom math — not a substitute for calibrated lab workflows.",
    ],
    {
      question: "Does this work for RNA or ssDNA?",
      answer: "This helper uses the common dsDNA factor of 50; other nucleic acids use different constants.",
    },
    "DNA Concentration Calculator — A260 × 50 × Dilution",
    "Estimate dsDNA concentration from A260 and dilution — educational spectrophotometry.",
    ["dna concentration calculator", "A260 ng per ul", "spectrophotometry education"],
    "sparkTrendDemo",
  ),
  "pcr-calculator": article(
    "pcr-calculator",
    "PCR copies",
    [
      "Computes ideal theoretical amplicon copies = N₀ × 2^cycles.",
      "Assumes 100% efficiency — real PCR yields vary; educational only.",
    ],
    {
      question: "What cycle range is allowed?",
      answer: "Cycles should be between 0 and 60 for this classroom helper.",
    },
    "PCR Calculator — Theoretical Copies N₀ × 2^cycles",
    "Calculate ideal PCR amplicon copies from starting template and cycles.",
    ["pcr calculator", "2 to the cycles", "amplicon copies education"],
    "none",
  ),
  "gel-electrophoresis-calculator": article(
    "gel-electrophoresis-calculator",
    "Gel electrophoresis Rf",
    [
      "Computes relative mobility Rf = band migration / dye-front distance.",
      "Educational gel arithmetic — measure distances carefully on your actual gel image.",
    ],
    {
      question: "Can migration exceed the dye front?",
      answer: "No — this helper rejects migration greater than dye-front distance.",
    },
    "Gel Electrophoresis Calculator — Rf Relative Mobility",
    "Calculate gel electrophoresis Rf from migration and dye-front distances.",
    ["gel electrophoresis calculator", "Rf relative mobility", "dye front education"],
    "sparkTrendDemo",
  ),
  "lab-solution-calculator-biology": article(
    "lab-solution-calculator-biology",
    "Lab solution (biology)",
    [
      "Mode c1v1 solves stock volume V1 from C1, C2, and V2. Mode mass computes grams = M × V(L) × MW.",
      "Set mode in URL param r to c1v1 or mass. Classroom prep math — follow lab SOPs for safety.",
    ],
    {
      question: "Which fields does each mode use?",
      answer: "c1v1 uses C1, C2, and V2. mass uses molarity M, volume L, and molar mass (g/mol).",
    },
    "Lab Solution Calculator Biology — C1V1 or Mass Prep",
    "Prepare dilutions (C1V1) or solute mass from M, V, and MW — educational lab math.",
    ["lab solution calculator biology", "C1V1 dilution", "molar mass prep education"],
    "none",
  ),
};
