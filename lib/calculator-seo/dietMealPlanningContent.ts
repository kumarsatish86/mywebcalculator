import type { RichArticle } from "./types";

const HUB_HREF = "/health/diet-nutrition/meal-diet-planning";
const HUB_LABEL = "Health · Diet & Nutrition · Meal & Diet Planning";
const SHELL =
  "Wellness education tools that run in your browser. Not a medical device, fasting prescription, or clinical meal plan. Timing and portions are teaching math — seek professional guidance for personal protocols.";

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
        title: "Meal planning tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Meal-plan calories", "Daily kcal ÷ meals"],
          ["Daily meal planner", "Even split + B/L/D mix"],
          ["Portion size", "Grams ÷ servings"],
          ["Meal frequency", "kcal per preferred meals"],
          ["Intermittent fasting", "24 − fasting hours"],
          ["Eating window", "Start–end hours"],
          ["Cheat meal impact", "Overage vs target"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your meal-planning inputs. Wellness education only — not a medical device.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Meal timing idea",
            caption:
              "Share URL preserves your meal-planning inputs. Wellness education only — not a medical device.",
            sparkValues: [0.25, 0.4, 0.55, 0.7, 0.8, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const DIET_MEAL_PLANNING_ARTICLES: Record<string, RichArticle> = {
  "diet-meal-plan-calorie-calculator": article(
    "diet-meal-plan-calorie-calculator",
    "Meal-plan calories",
    [
      "Splits a daily calorie budget evenly across the number of meals.",
      "Teaching portioning only — not a clinical meal prescription or medical device.",
    ],
    {
      question: "Should every meal be equal?",
      answer:
        "Even splits are a simple default. Many people prefer uneven meals; this host only divides total calories by meal count.",
    },
    "Meal Plan Calorie Calculator — kcal per Meal",
    "Divide daily calories by meal count for an even per-meal target. Wellness education — not medical advice.",
    ["meal plan calorie calculator", "calories per meal", "meal calorie split"],
  ),
  "diet-daily-meal-planner-calculator": article(
    "diet-daily-meal-planner-calculator",
    "Daily meal planner",
    [
      "Shows even kcal/meal plus a simple breakfast/lunch/dinner teaching mix (30% / 35% / 35% of the even meal).",
      "Illustrative only — not a menu or medical plan.",
    ],
    {
      question: "Why breakfast/lunch/dinner mix?",
      answer:
        "It is a literacy illustration layered on the even split. Customize real meals with preferences and professional guidance.",
    },
    "Daily Meal Planner Calculator — Split & Meal Mix",
    "Plan per-meal calories with an even split and simple B/L/D mix. Wellness education — not a medical device.",
    ["daily meal planner calculator", "meal planner calories", "breakfast lunch dinner calories"],
    "sparkTrendDemo",
  ),
  "diet-portion-size-calculator": article(
    "diet-portion-size-calculator",
    "Portion size",
    [
      "Grams per serving = total food grams ÷ number of servings.",
      "Kitchen math for teaching — not nutrient analysis.",
    ],
    {
      question: "Does this calculate calories?",
      answer:
        "No. It only divides mass into servings. Pair with a calorie or recipe tool if you need energy estimates.",
    },
    "Portion Size Calculator — Grams per Serving",
    "Compute grams per serving from food weight and servings. Wellness education only.",
    ["portion size calculator", "grams per serving", "serving size calculator"],
  ),
  "diet-meal-frequency-calculator": article(
    "diet-meal-frequency-calculator",
    "Meal frequency",
    [
      "Per-meal calories from daily budget ÷ preferred meal count (same math as meal-plan calories).",
      "Frequency preference literacy — not metabolic magic.",
    ],
    {
      question: "Is eating more often better for fat loss?",
      answer:
        "This tool does not model metabolism. It only divides calories by how many meals you prefer.",
    },
    "Meal Frequency Calculator — Calories by Meal Count",
    "Estimate calories per meal from daily budget and preferred frequency. Wellness education — not medical advice.",
    ["meal frequency calculator", "how many meals calories", "meal count calories"],
  ),
  "diet-intermittent-fasting-calculator": article(
    "diet-intermittent-fasting-calculator",
    "Intermittent fasting window",
    [
      "Eating window hours = 24 − fasting hours (fasting must be 0–23).",
      "Schedule arithmetic only — not a medical fasting protocol or medical device.",
    ],
    {
      question: "Is 16:8 right for me?",
      answer:
        "This host only converts fasting hours to an eating window. Fasting can be unsuitable in some medical contexts — ask a clinician first.",
    },
    "Intermittent Fasting Calculator — Eating Window Hours",
    "Convert fasting hours into an eating window. Wellness education — not a medical device.",
    ["intermittent fasting calculator", "fasting window calculator", "IF eating window"],
  ),
  "diet-eating-window-calculator": article(
    "diet-eating-window-calculator",
    "Eating window from clock hours",
    [
      "Computes window length from start and end hours (0–23), wrapping past midnight when needed.",
      "Clock math for IF literacy — not clinical advice.",
    ],
    {
      question: "What if my window crosses midnight?",
      answer:
        "If end ≤ start, the tool adds 24 hours so overnight windows work (for example 20 → 12).",
    },
    "Eating Window Calculator — Start to End Hours",
    "Find eating and fasting hours from a start and end clock hour. Wellness education only.",
    ["eating window calculator", "IF start end hours", "feeding window calculator"],
  ),
  "diet-cheat-meal-impact-calculator": article(
    "diet-cheat-meal-impact-calculator",
    "Cheat-meal impact",
    [
      "Shows how far a cheat meal is over (or under) a daily target and spreads the overage across 7 days as a teaching average.",
      "Not permission or prohibition — educational energy accounting only.",
    ],
    {
      question: "Does one cheat meal ruin progress?",
      answer:
        "This tool only does arithmetic. Weekly averages and adherence patterns matter more than a single meal — talk with a professional for personal plans.",
    },
    "Cheat Meal Impact Calculator — Overage vs Target",
    "Estimate how a cheat meal compares to a daily calorie target. Wellness education — not a medical device.",
    ["cheat meal impact calculator", "cheat meal calories", "calorie overage weekly"],
  ),
};
