import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/biology-microbiology-cell";
const HUB_LABEL = "Education · Science · Biology Microbiology & Cell";
const SHELL =
  "Classroom microbiology and cell-culture arithmetic. Educational models only — not clinical or sterility certification.";

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
        title: "Microbiology tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Cell growth", "N = N₀ e^(μt)"],
          ["Bacterial growth rate", "μ = (ln N − ln N₀)/t"],
          ["Doubling time", "t_d = ln(2)/μ"],
          ["Optical density", "OD = log₁₀(I₀/I)"],
          ["CFU", "colonies × dilution / volume"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your microbiology inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Growth curve idea",
            caption: "Share URL preserves your microbiology inputs.",
            sparkValues: [0.12, 0.22, 0.4, 0.58, 0.75, 0.92],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BIOLOGY_MICROBIOLOGY_ARTICLES: Record<string, RichArticle> = {
  "cell-growth-calculator": article(
    "cell-growth-calculator",
    "Cell growth",
    [
      "Projects population with N = N₀ × e^(μ t) for exponential growth.",
      "μ and t must use the same time unit (for example both per hour).",
    ],
    {
      question: "Can μ be negative?",
      answer: "Yes — a negative μ models net decline; N₀ and time stay non-negative.",
    },
    "Cell Growth Calculator — N = N0 e^(μt)",
    "Calculate exponential cell growth from initial count, growth rate, and time.",
    ["cell growth calculator", "exponential growth biology", "N0 e mu t"],
    "sparkTrendDemo",
  ),
  "bacterial-growth-rate-calculator": article(
    "bacterial-growth-rate-calculator",
    "Bacterial growth rate",
    [
      "Estimates specific growth rate μ = (ln N − ln N₀) / t.",
      "Requires positive initial and final counts and positive time.",
    ],
    {
      question: "What if N equals N₀?",
      answer: "Then μ is zero — the culture neither grew nor declined over that interval.",
    },
    "Bacterial Growth Rate Calculator — Specific Growth Rate μ",
    "Calculate bacterial specific growth rate from two counts and elapsed time.",
    ["bacterial growth rate calculator", "specific growth rate", "mu bacteria"],
    "none",
  ),
  "doubling-time-calculator-biology": article(
    "doubling-time-calculator-biology",
    "Doubling time",
    [
      "Converts specific growth rate to doubling time with t_d = ln(2) / μ.",
      "μ must be positive for a finite doubling time.",
    ],
    {
      question: "Which time unit is t_d in?",
      answer: "The same unit as 1/μ — if μ is per hour, t_d is in hours.",
    },
    "Doubling Time Calculator Biology — ln(2)/μ",
    "Calculate microbial doubling time from specific growth rate μ.",
    ["doubling time calculator biology", "generation time", "ln2 / mu"],
    "sparkTrendDemo",
  ),
  "optical-density-od-calculator": article(
    "optical-density-od-calculator",
    "Optical density (OD)",
    [
      "Computes OD = log₁₀(I₀ / I) from incident and transmitted intensities.",
      "Transmitted I cannot exceed incident I₀.",
    ],
    {
      question: "Is OD the same as absorbance?",
      answer: "For this classroom tool, OD follows the same log₁₀(I₀/I) definition as absorbance.",
    },
    "Optical Density OD Calculator — log10(I0/I)",
    "Calculate optical density from incident and transmitted light intensities.",
    ["optical density calculator", "OD calculator", "absorbance biology"],
    "none",
  ),
  "colony-forming-unit-cfu-calculator": article(
    "colony-forming-unit-cfu-calculator",
    "Colony-forming units (CFU)",
    [
      "Estimates CFU/mL = colonies × dilution factor / volume plated (mL).",
      "Dilution factor is the reciprocal of the plated dilution (for example 1000 for 10⁻³).",
    ],
    {
      question: "Should volume be in mL?",
      answer: "Yes for this tool — plated volume is entered in millilitres.",
    },
    "CFU Calculator — Colony Forming Units per mL",
    "Calculate CFU/mL from colony count, dilution factor, and plated volume.",
    ["cfu calculator", "colony forming unit", "plate count biology"],
    "sparkTrendDemo",
  ),
};
