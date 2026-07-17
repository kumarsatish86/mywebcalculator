import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/biology-plants";
const HUB_LABEL = "Education · Science · Biology Plants";
const SHELL =
  "Classroom plant-physiology arithmetic with consistent area and time units. Educational models only — not agronomic certification.";

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
        title: "Plant biology tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Photosynthesis rate", "CO₂ / (area × time)"],
          ["Transpiration rate", "Water / (area × time)"],
          ["Leaf area index", "Leaf area / ground area"],
          ["Crop yield", "Harvest / hectare"],
          ["Plant growth rate", "(ln W₂ − ln W₁) / Δt"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your plant biology inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Growth idea",
            caption: "Share URL preserves your plant biology inputs.",
            sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BIOLOGY_PLANTS_ARTICLES: Record<string, RichArticle> = {
  "photosynthesis-rate-calculator": article(
    "photosynthesis-rate-calculator",
    "Photosynthesis rate",
    [
      "Estimates net photosynthesis rate as CO₂ assimilated divided by leaf area and time.",
      "Keep CO₂, area, and time in matching classroom units (μmol, m², s).",
    ],
    {
      question: "What units does the rate use?",
      answer: "With μmol CO₂, m² leaf area, and seconds, the rate is in μmol·m⁻²·s⁻¹.",
    },
    "Photosynthesis Rate Calculator — CO₂ / (Area × Time)",
    "Calculate photosynthesis rate from CO₂ assimilation, leaf area, and time.",
    ["photosynthesis rate calculator", "CO2 assimilation", "leaf area time"],
    "sparkTrendDemo",
  ),
  "transpiration-rate-calculator": article(
    "transpiration-rate-calculator",
    "Transpiration rate",
    [
      "Computes water-loss rate as mass lost divided by leaf area and time.",
      "Useful for comparing stomatal water loss across simple lab setups.",
    ],
    {
      question: "Can water mass be zero?",
      answer: "Yes — zero water lost gives a zero rate; area and time must stay positive.",
    },
    "Transpiration Rate Calculator — Water / (Area × Time)",
    "Calculate plant transpiration rate from water loss, leaf area, and time.",
    ["transpiration rate calculator", "plant water loss", "leaf transpiration"],
    "none",
  ),
  "leaf-area-index-calculator": article(
    "leaf-area-index-calculator",
    "Leaf area index",
    [
      "LAI = total one-sided leaf area divided by ground area under the canopy.",
      "Dimensionless LAI helps compare canopy density across plots.",
    ],
    {
      question: "Can LAI be greater than 1?",
      answer: "Yes — layered canopies often have LAI well above 1.",
    },
    "Leaf Area Index Calculator — LAI = Leaf / Ground",
    "Calculate leaf area index from total leaf area and ground area.",
    ["leaf area index calculator", "LAI calculator", "canopy leaf area"],
    "sparkTrendDemo",
  ),
  "crop-yield-calculator": article(
    "crop-yield-calculator",
    "Crop yield",
    [
      "Yield = harvested mass divided by area in hectares (kg/ha).",
      "Enter total harvest mass and the field area that produced it.",
    ],
    {
      question: "Do I need dry or fresh mass?",
      answer: "Use whatever mass basis your problem states — keep it consistent across comparisons.",
    },
    "Crop Yield Calculator — kg per Hectare",
    "Calculate crop yield from harvest mass and field area in hectares.",
    ["crop yield calculator", "kg per hectare", "harvest yield"],
    "none",
  ),
  "plant-growth-rate-calculator": article(
    "plant-growth-rate-calculator",
    "Plant growth rate",
    [
      "Relative growth rate RGR ≈ (ln W₂ − ln W₁) / Δt for positive masses.",
      "Classic classroom estimator for exponential-phase biomass growth.",
    ],
    {
      question: "Why use natural logs?",
      answer: "ln W linearizes exponential growth so RGR is roughly constant over short intervals.",
    },
    "Plant Growth Rate Calculator — Relative Growth Rate RGR",
    "Calculate relative plant growth rate from two masses and elapsed days.",
    ["plant growth rate calculator", "relative growth rate", "RGR biology"],
    "sparkTrendDemo",
  ),
};
