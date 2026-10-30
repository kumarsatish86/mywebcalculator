import type { RichArticle } from "./types";

const HUB_HREF = "/health/diet-nutrition/weight-management-diet";
const HUB_LABEL = "Health · Diet & Nutrition · Weight Management";
const SHELL =
  "Wellness education tools that run in your browser. Not a medical device, weight-loss program, or clinical advice. Safe pacing and targets need professional guidance.";

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
        title: "Weight management diet tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Ideal weight", "Devine IBW from height + sex"],
          ["Target weight", "Current vs target delta"],
          ["Loss timeline", "Δkg ÷ kg/week"],
          ["BMI-based diet", "BMI + TDEE adjust"],
          ["Body-fat-based diet", "FFM + teaching cut"],
          ["Weekly loss / gain planner", "Deficit or surplus pacing"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your weight-management inputs. Wellness education only — not a medical device.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Pacing idea",
            caption:
              "Share URL preserves your weight-management inputs. Wellness education only — not a medical device.",
            sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const DIET_WEIGHT_MGMT_ARTICLES: Record<string, RichArticle> = {
  "diet-ideal-weight-calculator": article(
    "diet-ideal-weight-calculator",
    "Ideal body weight (Devine)",
    [
      "Devine IBW from height ≥152 cm and sex (male/female).",
      "A population teaching formula — not a personal health goal or medical device.",
    ],
    {
      question: "Should I aim exactly for IBW?",
      answer:
        "No. Ideal-weight formulas are educational references. Healthy weight ranges depend on many factors discussed with a clinician.",
    },
    "Ideal Weight Calculator — Devine IBW Estimate",
    "Estimate Devine ideal body weight from height and sex. Wellness education — not a medical device.",
    ["ideal weight calculator", "Devine IBW", "ideal body weight"],
  ),
  "diet-target-weight-calculator": article(
    "diet-target-weight-calculator",
    "Target weight delta",
    [
      "Shows the kilogram difference and whether the direction is loss, gain, or maintain.",
      "Simple arithmetic for planning literacy — not a prescription.",
    ],
    {
      question: "Does this set a safe target?",
      answer:
        "No. It only subtracts two weights. Choose targets with professional guidance when health is involved.",
    },
    "Target Weight Calculator — Current vs Goal",
    "Compute the delta between current and target weight. Wellness education — not medical advice.",
    ["target weight calculator", "weight goal delta", "current vs target weight"],
  ),
  "diet-weight-loss-timeline-calculator": article(
    "diet-weight-loss-timeline-calculator",
    "Weight-loss timeline",
    [
      "Weeks ≈ (current − target) ÷ kg per week when target is below current.",
      "Assumes a constant pace — real progress is non-linear. Not a medical device.",
    ],
    {
      question: "What pace is safe?",
      answer:
        "Many guidelines discuss modest weekly rates, but personal safety depends on health status. This tool does not validate your pace — ask a professional.",
    },
    "Weight Loss Timeline Calculator — Weeks to Goal",
    "Estimate weeks to a lower target weight at a chosen kg/week pace. Wellness education only.",
    ["weight loss timeline calculator", "weeks to goal weight", "weight loss pace"],
    "sparkTrendDemo",
  ),
  "diet-bmi-based-diet-calculator": article(
    "diet-bmi-based-diet-calculator",
    "BMI-based calorie target",
    [
      "Computes BMI and TDEE, then applies a simple −500 / +300 / 0 kcal teaching adjustment by BMI band.",
      "Heuristic only — BMI misclassifies many people; not a medical device.",
    ],
    {
      question: "Why adjust by BMI bands?",
      answer:
        "For classroom-style energy literacy. Real plans need composition, history, and clinician or dietitian judgment.",
    },
    "BMI-Based Diet Calculator — TDEE Adjustment",
    "Estimate a calorie target from BMI and TDEE with a simple band heuristic. Wellness education — not medical advice.",
    ["BMI based diet calculator", "BMI calorie target", "BMI TDEE diet"],
  ),
  "diet-body-fat-based-diet-calculator": article(
    "diet-body-fat-based-diet-calculator",
    "Body-fat-based calorie target",
    [
      "Estimates fat-free mass and applies a teaching calorie cut from body-fat % and TDEE.",
      "Body-fat inputs are assumed accurate — not DXA or clinical assessment.",
    ],
    {
      question: "How accurate is the FFM cut?",
      answer:
        "It is a simple teaching rule (stronger cut when body fat > 20%). Not individualized clinical nutrition.",
    },
    "Body Fat-Based Diet Calculator — FFM & Target Calories",
    "Estimate FFM and a teaching calorie target from body-fat % and TDEE. Wellness education only.",
    ["body fat diet calculator", "FFM calorie target", "body fat based calories"],
  ),
  "diet-weekly-weight-loss-calculator": article(
    "diet-weekly-weight-loss-calculator",
    "Weekly weight loss from deficit",
    [
      "kg/week ≈ (daily deficit × 7) / 7700 using a common energy constant.",
      "Water, glycogen, and adherence make real weekly change differ — educational only.",
    ],
    {
      question: "Is 7700 kcal per kg exact?",
      answer:
        "No. It is a teaching approximation. Composition of weight lost varies; treat results as literacy math.",
    },
    "Weekly Weight Loss Calculator — Deficit to kg/Week",
    "Convert a daily calorie deficit into an estimated kg per week. Wellness education — not a medical device.",
    ["weekly weight loss calculator", "deficit to kg week", "calorie deficit weight"],
  ),
  "diet-weight-gain-planner-calculator": article(
    "diet-weight-gain-planner-calculator",
    "Weight-gain planner",
    [
      "Target calories = TDEE + surplus (default 300) with a rough kg/week estimate.",
      "Educational surplus pacing — not sports medicine advice.",
    ],
    {
      question: "Will this ensure lean mass?",
      answer:
        "No. Surplus sets energy intake only. Training and protein strategies determine composition outcomes.",
    },
    "Weight Gain Planner Calculator — Surplus Target",
    "Plan a weight-gain calorie target from TDEE plus surplus. Wellness education — not medical advice.",
    ["weight gain planner", "calorie surplus planner", "gain calories TDEE"],
  ),
};
