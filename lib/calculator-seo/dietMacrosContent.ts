import type { RichArticle } from "./types";

const HUB_HREF = "/health/diet-nutrition/macronutrients";
const HUB_LABEL = "Health · Diet & Nutrition · Macronutrients";
const SHELL =
  "Wellness education tools that run in your browser. Not a medical device, meal prescription, or clinical nutrition advice. Macro splits are teaching heuristics — consult a qualified professional for personal targets.";

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
        title: "Macronutrient tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Macro split", "kcal × % → g (P/C/F)"],
          ["Protein intake", "kg × g/kg"],
          ["Carb / fat intake", "kcal × % ÷ 4 or 9"],
          ["Keto / low-carb / high-protein", "Preset % mixes"],
          ["Bodybuilding / lean bulk / cutting", "Sport-style presets"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your macro inputs. Wellness education only — not a medical device.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Macro balance idea",
            caption:
              "Share URL preserves your macro inputs. Wellness education only — not a medical device.",
            sparkValues: [0.3, 0.45, 0.55, 0.65, 0.8, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const DIET_MACROS_ARTICLES: Record<string, RichArticle> = {
  "diet-macronutrient-split-calculator": article(
    "diet-macronutrient-split-calculator",
    "Macronutrient split",
    [
      "Converts daily calories and protein/carb/fat percentages into grams (percentages are normalized by sum).",
      "Wellness teaching arithmetic — not a medical device or personalized diet plan.",
    ],
    {
      question: "Must percentages sum to 100?",
      answer:
        "They are scaled to 100% by their sum, so relative teaching mixes are fine.",
    },
    "Macronutrient Calculator — Protein Carbs Fat Split",
    "Split daily calories into protein, carb, and fat grams. Wellness education — not a medical device.",
    ["macronutrient calculator", "protein carbs fat split", "macro grams calculator"],
    "sparkTrendDemo",
  ),
  "diet-protein-intake-calculator": article(
    "diet-protein-intake-calculator",
    "Protein intake",
    [
      "Protein (g) = body weight (kg) × grams per kilogram.",
      "Common teaching ranges span roughly 0.8–2.2 g/kg — personal targets need professional context.",
    ],
    {
      question: "What g/kg should athletes use?",
      answer:
        "This tool multiplies only. Sport and clinical targets vary widely — ask a qualified professional for your situation.",
    },
    "Protein Intake Calculator — Weight × g/kg",
    "Estimate daily protein grams from weight and g/kg. Wellness education — not medical advice.",
    ["protein intake calculator", "protein g per kg", "daily protein estimate"],
  ),
  "diet-carbohydrate-intake-calculator": article(
    "diet-carbohydrate-intake-calculator",
    "Carbohydrate intake",
    [
      "Carb grams = (calories × carb% / 100) / 4.",
      "Educational percent-of-budget math — not glycemic or medical advice.",
    ],
    {
      question: "Does this account for fiber?",
      answer:
        "No. It converts calorie share to carbohydrate grams only. Fiber and net carbs are not modeled.",
    },
    "Carbohydrate Intake Calculator — Calories × Carb %",
    "Estimate carbohydrate grams from calorie budget and carb percent. Wellness education only.",
    ["carbohydrate intake calculator", "carb grams calculator", "carb percent calories"],
  ),
  "diet-fat-intake-calculator": article(
    "diet-fat-intake-calculator",
    "Fat intake",
    [
      "Fat grams = (calories × fat% / 100) / 9.",
      "Teaching energy math only — not cholesterol treatment or medical advice.",
    ],
    {
      question: "Is fat % the same as body fat?",
      answer:
        "No. This is dietary fat as a share of calorie intake, not body-fat percentage.",
    },
    "Fat Intake Calculator — Calories × Fat %",
    "Estimate dietary fat grams from calorie budget and fat percent. Wellness education — not a medical device.",
    ["fat intake calculator", "dietary fat grams", "fat percent calories"],
  ),
  "diet-keto-macro-calculator": article(
    "diet-keto-macro-calculator",
    "Keto macros",
    [
      "Applies a teaching keto mix ≈ 25% protein / 5% carbs / 70% fat to your calorie budget.",
      "Not a ketosis guarantee, medical ketogenic diet, or medical device.",
    ],
    {
      question: "Will this put me in ketosis?",
      answer:
        "No. It only splits calories into grams. Ketosis depends on many factors and may require clinical supervision for therapeutic diets.",
    },
    "Keto Macro Calculator — High-Fat Teaching Split",
    "Estimate keto-style macro grams from daily calories. Wellness education — not medical advice.",
    ["keto macro calculator", "keto macros", "ketogenic split calculator"],
  ),
  "diet-low-carb-calculator": article(
    "diet-low-carb-calculator",
    "Low-carb macros",
    [
      "Teaching low-carb split ≈ 30% protein / 20% carbs / 50% fat.",
      "Educational preset only — not a prescription for diabetes or any condition.",
    ],
    {
      question: "Is 20% carbs “low carb” for everyone?",
      answer:
        "Definitions vary. This host uses one teaching mix; personal carb targets need professional guidance.",
    },
    "Low-Carb Diet Calculator — Macro Preset",
    "Estimate low-carb style macro grams from calories. Wellness education — not a medical device.",
    ["low carb calculator", "low carb macros", "low carbohydrate diet calculator"],
  ),
  "diet-high-protein-calculator": article(
    "diet-high-protein-calculator",
    "High-protein macros",
    [
      "Teaching high-protein split ≈ 40% protein / 30% carbs / 30% fat.",
      "Not kidney-disease guidance or clinical protein dosing.",
    ],
    {
      question: "Is high protein safe for me?",
      answer:
        "This tool only converts calories to grams. Kidney, liver, or medical conditions need clinician advice before high-protein plans.",
    },
    "High-Protein Diet Calculator — Macro Preset",
    "Estimate high-protein macro grams from daily calories. Wellness education only.",
    ["high protein calculator", "high protein macros", "protein focused diet"],
  ),
  "diet-bodybuilding-macro-calculator": article(
    "diet-bodybuilding-macro-calculator",
    "Bodybuilding macros",
    [
      "Teaching bodybuilding-style split ≈ 35% protein / 40% carbs / 25% fat.",
      "Literacy for gym contexts — not coaching or a medical device.",
    ],
    {
      question: "Should contest prep use this split?",
      answer:
        "No single preset fits prep. Coaches and clinicians individualize macros; this is educational arithmetic only.",
    },
    "Bodybuilding Macro Calculator — Sport-Style Split",
    "Estimate bodybuilding-style macro grams from calories. Wellness education — not medical advice.",
    ["bodybuilding macro calculator", "bodybuilding macros", "gym macro split"],
  ),
  "diet-lean-bulk-macro-calculator": article(
    "diet-lean-bulk-macro-calculator",
    "Lean bulk macros",
    [
      "Teaching lean-bulk split ≈ 30% protein / 45% carbs / 25% fat.",
      "Pairs with a calorie surplus elsewhere — not a guarantee of lean gains.",
    ],
    {
      question: "Do I still need a surplus?",
      answer:
        "Macros here assume you already chose calories. Surplus planning is separate; this host only splits the budget you enter.",
    },
    "Lean Bulk Macro Calculator — Bulk Macro Preset",
    "Estimate lean-bulk macro grams from daily calories. Wellness education — not a medical device.",
    ["lean bulk macro calculator", "lean bulk macros", "bulk macro split"],
  ),
  "diet-cutting-diet-calculator": article(
    "diet-cutting-diet-calculator",
    "Cutting macros",
    [
      "Teaching cutting split ≈ 40% protein / 30% carbs / 30% fat.",
      "Educational only — not a fat-loss program or medical device.",
    ],
    {
      question: "Does higher protein guarantee muscle retention?",
      answer:
        "No. Protein share is one teaching lever. Training, total calories, and individual factors matter more than this preset alone.",
    },
    "Cutting Diet Calculator — Cut Macro Preset",
    "Estimate cutting-style macro grams from daily calories. Wellness education — not medical advice.",
    ["cutting diet calculator", "cutting macros", "cut macro split"],
  ),
};
