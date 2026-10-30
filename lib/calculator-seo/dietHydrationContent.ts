import type { RichArticle } from "./types";

const HUB_HREF = "/health/diet-nutrition/hydration-water";
const HUB_LABEL = "Health · Diet & Nutrition · Hydration & Water";
const SHELL =
  "Wellness education tools that run in your browser. Not a medical device, dehydration diagnosis, or clinical fluid prescription. Illness, heat illness, and extreme conditions need professional care.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
  chartKind: "sparkTrendDemo" | "none" = "none",
): RichArticle {
  return {
    slug,
    vertical: "health-body",
    category: "health",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Hydration tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Daily water", "kg × ml/kg (default 35)"],
          ["Water by weight", "33 ml/kg heuristic"],
          ["Climate hydration", "Base + climate bonus"],
          ["Exercise hydration", "Base + min × ml/min"],
          ["Dehydration risk", "Intake ÷ need band"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your hydration inputs. Wellness education only — not a medical device.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Fluid balance idea",
            caption:
              "Share URL preserves your hydration inputs. Wellness education only — not a medical device.",
            sparkValues: [0.35, 0.5, 0.6, 0.7, 0.85, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const DIET_HYDRATION_ARTICLES: Record<string, RichArticle> = {
  "diet-daily-water-intake-calculator": article(
    "diet-daily-water-intake-calculator",
    "Daily water intake",
    [
      "ml/day ≈ weight(kg) × ml/kg with a default of 35 ml/kg.",
      "A common teaching heuristic — not a medical fluid order or medical device.",
    ],
    {
      question: "Is 35 ml/kg a clinical rule?",
      answer:
        "No. It is a popular wellness heuristic. Kidney disease, heat, pregnancy, and illness change needs — ask a clinician when relevant.",
    },
    "Daily Water Intake Calculator — ml per kg",
    "Estimate daily water from body weight and ml/kg. Wellness education — not a medical device.",
    ["daily water intake calculator", "water ml per kg", "hydration calculator"],
    "sparkTrendDemo",
  ),
  "diet-water-intake-by-weight-calculator": article(
    "diet-water-intake-by-weight-calculator",
    "Water by weight",
    [
      "Uses a fixed 33 ml/kg teaching rate for a quick fluid estimate.",
      "Educational only — not sports or medical hydration guidance.",
    ],
    {
      question: "Why 33 instead of 35?",
      answer:
        "Different literacy sources use slightly different ml/kg rules. Both are heuristics, not individualized prescriptions.",
    },
    "Water Intake by Weight Calculator — 33 ml/kg",
    "Estimate water intake at 33 ml per kg of body weight. Wellness education — not medical advice.",
    ["water intake by weight", "water by kg calculator", "fluid by weight"],
  ),
  "diet-hydration-climate-calculator": article(
    "diet-hydration-climate-calculator",
    "Climate-based hydration",
    [
      "Starts from 35 ml/kg, then adds a teaching bonus for hot/humid or a small reduction for cold climates.",
      "Heuristic climate tags only — not heat-illness triage.",
    ],
    {
      question: "Which climates are supported?",
      answer:
        "Enter temperate, hot, humid, or cold (or mild). Unknown labels return an error so you can correct the input.",
    },
    "Hydration Calculator — Climate-Based Fluid Estimate",
    "Adjust a weight-based water estimate for climate tags. Wellness education — not a medical device.",
    ["climate hydration calculator", "hot weather water intake", "hydration climate"],
  ),
  "diet-exercise-hydration-calculator": article(
    "diet-exercise-hydration-calculator",
    "Exercise hydration",
    [
      "Adds exercise minutes × ml/min (default 7) to a base daily fluid amount.",
      "Does not model sweat rate testing — literacy math only.",
    ],
    {
      question: "Should I drink the full add during the workout?",
      answer:
        "This tool only sums volumes. Timing, electrolytes, and safety for long/hot sessions need sport or medical guidance.",
    },
    "Exercise Hydration Calculator — Base + Exercise Add",
    "Estimate total fluid from a base amount plus exercise minutes. Wellness education — not medical advice.",
    ["exercise hydration calculator", "workout water intake", "hydration exercise ml"],
  ),
  "diet-dehydration-risk-calculator": article(
    "diet-dehydration-risk-calculator",
    "Dehydration risk band",
    [
      "Compares intake to stated need as a percent and maps to low / moderate / higher teaching bands.",
      "Not a diagnosis, emergency tool, or medical device — seek care for symptoms of dehydration.",
    ],
    {
      question: "Can this detect dehydration?",
      answer:
        "No. It only ratios two numbers you enter. Clinical dehydration assessment uses signs, history, and professional judgment.",
    },
    "Dehydration Risk Calculator — Intake vs Need",
    "Compare fluid intake to need with a teaching risk band. Wellness education — not a medical device.",
    ["dehydration risk calculator", "hydration percent of need", "fluid intake vs need"],
  ),
};
