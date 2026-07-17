import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/chemistry-nuclear";
const HUB_LABEL = "Education · Science · Chemistry Nuclear";
const SHELL =
  "Educational nuclear-chemistry arithmetic for classroom use. Simplified models only — not radiation safety, medical dosimetry, or reactor operations.";

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
        title: "Nuclear chemistry tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Half-life", "t½ = ln2 / λ"],
          ["Decay", "N = N₀ e^(−λt)"],
          ["Binding energy", "Δm × 931.494 MeV/u"],
          ["Mass defect", "Σ nucleons − atom mass"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your nuclear-chemistry inputs. Educational models only.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Decay idea",
            caption: "Share URL preserves your nuclear-chemistry inputs. Educational models only.",
            sparkValues: [1, 0.5, 0.25, 0.125, 0.0625, 0.03125],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CHEMISTRY_NUCLEAR_ARTICLES: Record<string, RichArticle> = {
  "half-life-calculator-nuclear-chemistry": article(
    "half-life-calculator-nuclear-chemistry",
    "Nuclear half-life",
    [
      "Default mode fromLambda: t½ = ln2 / λ from the decay constant.",
      "Mode fromRemaining estimates t½ from N₀, remaining N, and elapsed time.",
    ],
    {
      question: "What is the default mode?",
      answer: 'Enter "fromLambda" (default) or "fromRemaining" for N₀/N/t inputs.',
    },
    "Half-Life Calculator — Nuclear Chemistry (λ or Remaining)",
    "Calculate nuclear half-life from decay constant or remaining amount vs time.",
    ["nuclear half life calculator", "decay constant half life", "t1/2 nuclear chemistry"],
    "sparkTrendDemo",
  ),
  "radioactive-decay-calculator-chemistry": article(
    "radioactive-decay-calculator-chemistry",
    "Radioactive decay",
    [
      "Uses N = N₀ e^(−λt) with λ = ln2 / t½ to find remaining amount.",
      "Also reports λ and the fraction left. Classroom exponential decay only.",
    ],
    {
      question: "Is activity included?",
      answer: "This tool tracks amount N; activity A = λN is a separate step if needed.",
    },
    "Radioactive Decay Calculator — Chemistry N₀ e^(−λt)",
    "Compute remaining nuclei or amount after time using half-life for education.",
    ["radioactive decay calculator", "exponential decay chemistry", "N0 e^-lambda t"],
    "none",
  ),
  "nuclear-binding-energy-calculator": article(
    "nuclear-binding-energy-calculator",
    "Nuclear binding energy",
    [
      "Converts mass defect Δm in atomic mass units to binding energy: BE (MeV) = Δm × 931.494.",
      "Also reports an equivalent energy in joules via E = mc². Educational conversion.",
    ],
    {
      question: "Where does Δm come from?",
      answer: "Use the mass-defect calculator (or a table value) and paste Δm in u here.",
    },
    "Nuclear Binding Energy Calculator — Δm to MeV",
    "Convert mass defect in u to nuclear binding energy in MeV and joules.",
    ["nuclear binding energy calculator", "mass defect MeV", "931.494 calculator"],
    "sparkTrendDemo",
  ),
  "mass-defect-calculator": article(
    "mass-defect-calculator",
    "Mass defect",
    [
      "Δm = Z m_p + (A − Z) m_n − atomic mass (u), with default nucleon masses.",
      "Also multiplies by 931.494 MeV/u for a binding-energy estimate.",
    ],
    {
      question: "Are electron masses included?",
      answer: "This classroom model uses common proton/neutron/atomic-mass bookkeeping; fine-structure corrections are omitted.",
    },
    "Mass Defect Calculator — Nuclear Chemistry",
    "Estimate nuclear mass defect and binding energy from A, Z, and atomic mass.",
    ["mass defect calculator", "nuclear mass defect", "binding energy from A Z"],
    "none",
  ),
};
