import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/biology-ecology-environment";
const HUB_LABEL = "Education · Science · Biology Ecology & Environment";
const SHELL =
  "Educational ecology and environment math for classroom use only — not environmental consulting, certified carbon accounting, or policy advice.";

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
        title: "Ecology & environment tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Population growth", "N = N₀ e^(rt)"],
          ["Carrying capacity", "Logistic toward K"],
          ["Biodiversity index", "Shannon H′ from abundances"],
          ["Carbon footprint", "km + kWh teaching factors"],
          ["Ecological footprint", "Diet + travel scores → ha"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your inputs. Educational ecology math only.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Population / impact idea",
            caption: "Share URL preserves your inputs. Educational ecology math only.",
            sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BIOLOGY_ECOLOGY_ARTICLES: Record<string, RichArticle> = {
  "population-growth-calculator": article(
    "population-growth-calculator",
    "Population growth",
    [
      "Computes exponential population size N = N₀ e^(rt) from initial size, rate, and time.",
      "Idealized teaching model — real populations face limits, stochasticity, and structure.",
    ],
    {
      question: "Can r be negative?",
      answer: "Yes — a negative r models exponential decline in this classroom formula.",
    },
    "Population Growth Calculator — Exponential N₀ e^(rt)",
    "Calculate exponential population growth N = N₀ e^(rt) for educational ecology.",
    ["population growth calculator", "exponential growth biology", "N0 e rt"],
    "sparkTrendDemo",
  ),
  "carrying-capacity-calculator": article(
    "carrying-capacity-calculator",
    "Carrying capacity (logistic)",
    [
      "Uses the logistic model N = K / (1 + ((K−N₀)/N₀) e^(−rt)) and reports remaining room to K.",
      "Educational carrying-capacity arithmetic — not a wildlife management forecast.",
    ],
    {
      question: "What is K?",
      answer: "K is carrying capacity — the asymptotic population the toy model approaches.",
    },
    "Carrying Capacity Calculator — Logistic Population Growth",
    "Estimate logistic population size toward carrying capacity K — educational only.",
    ["carrying capacity calculator", "logistic growth", "population K biology"],
    "none",
  ),
  "biodiversity-index-calculator": article(
    "biodiversity-index-calculator",
    "Biodiversity index (Shannon)",
    [
      "Computes Shannon diversity H′, species richness, and evenness from comma-separated abundances.",
      "Classroom diversity index — not a substitute for ecological survey protocol.",
    ],
    {
      question: "How many abundances do I need?",
      answer: "Enter at least two positive abundances (comma, semicolon, or space separated).",
    },
    "Biodiversity Index Calculator — Shannon H′ Diversity",
    "Calculate Shannon biodiversity index from species abundances for education.",
    ["biodiversity index calculator", "Shannon diversity", "species richness education"],
    "sparkTrendDemo",
  ),
  "carbon-footprint-calculator-biology": article(
    "carbon-footprint-calculator-biology",
    "Carbon footprint (biology)",
    [
      "Estimates kg CO₂e ≈ km × 0.21 + kWh × 0.4 with fixed teaching emission factors.",
      "Not a certified carbon inventory or offset tool — classroom scale only.",
    ],
    {
      question: "Are the emission factors accurate for my country?",
      answer: "No — they are simplified teaching constants. Real factors vary by grid and vehicle.",
    },
    "Carbon Footprint Calculator Biology — km + kWh Estimate",
    "Estimate teaching CO₂e from driving km and electricity kWh — educational only.",
    ["carbon footprint calculator biology", "CO2e km kWh", "education carbon estimate"],
    "none",
  ),
  "ecological-footprint-calculator": article(
    "ecological-footprint-calculator",
    "Ecological footprint",
    [
      "Maps diet and travel scores (1–5) to a toy hectare estimate with a linear classroom model.",
      "Not Global Footprint Network methodology — discussion aid only.",
    ],
    {
      question: "What do scores 1–5 mean?",
      answer: "1 is low impact and 5 is high impact for that lifestyle category in this toy model.",
    },
    "Ecological Footprint Calculator — Diet & Travel Scores",
    "Estimate a toy ecological footprint in hectares from diet and travel scores.",
    ["ecological footprint calculator", "diet travel footprint", "hectares education"],
    "sparkTrendDemo",
  ),
};
