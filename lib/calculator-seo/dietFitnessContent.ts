import type { RichArticle } from "./types";

const HUB_HREF = "/health/diet-nutrition/fitness-nutrition";
const HUB_LABEL = "Health · Diet & Nutrition · Fitness Nutrition";
const SHELL =
  "Wellness literacy tools that run in your browser. Fitness fueling and calorie-target math only — not medical advice, sports nutrition prescriptions, or coaching. Consult a qualified professional for personal plans.";

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
    vertical: "health-body",
    category: "health",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Fitness nutrition tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Pre-workout", "~15% of session burn as carbs"],
          ["Post-workout", "0.3 g/kg protein + 0.5 g/kg carbs"],
          ["Muscle gain", "TDEE + 300 + macros"],
          ["Fat loss", "TDEE − 500 + higher protein"],
          ["Bulking calories", "TDEE + surplus"],
          ["Cutting calories", "TDEE − deficit (floor 1200)"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your fitness-nutrition inputs. Wellness literacy only — not medical advice.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Fueling awareness",
            caption:
              "Share URL preserves your fitness-nutrition inputs. Wellness literacy only — not medical advice.",
            sparkValues: [0.3, 0.45, 0.55, 0.7, 0.8, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const DIET_FITNESS_ARTICLES: Record<string, RichArticle> = {
  "diet-pre-workout-nutrition-calculator": article(
    "diet-pre-workout-nutrition-calculator",
    "Pre-workout carb suggestion",
    [
      "Suggests carbohydrate grams ≈ 15% of your estimated session burn, with a floor for very light sessions.",
      "Teaching heuristic only — not a personalized sports-nutrition plan.",
    ],
    {
      question: "Do I need carbs before every workout?",
      answer:
        "Depends on duration, intensity, and goals. This tool only applies a simple teaching percentage.",
    },
    "Pre-Workout Nutrition Calculator — Carb Suggestion",
    "Estimate pre-workout carbs from session burn kcal. Wellness literacy only.",
    ["pre workout nutrition calculator", "pre workout carbs", "workout fueling educational"],
    "sparkTrendDemo",
  ),
  "diet-post-workout-nutrition-calculator": article(
    "diet-post-workout-nutrition-calculator",
    "Post-workout protein and carbs",
    [
      "Uses 0.3 g/kg protein and 0.5 g/kg carbs as common teaching recovery targets from body weight.",
      "Not medical advice or a guarantee of hypertrophy outcomes.",
    ],
    {
      question: "Is the anabolic window real?",
      answer:
        "This tool does not model timing windows — it only scales grams by body weight for literacy.",
    },
    "Post-Workout Nutrition Calculator — Protein & Carbs",
    "Estimate post-workout protein and carbs from body weight. Not medical advice.",
    ["post workout nutrition calculator", "post workout protein", "recovery macros educational"],
    "none",
  ),
  "diet-muscle-gain-diet-calculator": article(
    "diet-muscle-gain-diet-calculator",
    "Muscle-gain calories and macros",
    [
      "Adds ~300 kcal to TDEE and applies a muscle-gain teaching macro split.",
      "Educational surplus math only — not a coach program or medical advice.",
    ],
    {
      question: "Is +300 kcal always right?",
      answer:
        "No. Surplus size depends on training, body size, and progress. This is a fixed teaching default.",
    },
    "Muscle Gain Diet Calculator — Surplus Macros",
    "Estimate muscle-gain calories and macros from TDEE. Wellness literacy only.",
    ["muscle gain diet calculator", "bulking macros", "muscle gain calories"],
    "sparkTrendDemo",
  ),
  "diet-fat-loss-diet-calculator": article(
    "diet-fat-loss-diet-calculator",
    "Fat-loss calories and macros",
    [
      "Subtracts ~500 kcal from TDEE (floor 1200) and uses a higher-protein teaching split.",
      "Not a prescription for rapid weight loss or eating-disorder care.",
    ],
    {
      question: "Why is there a 1200 kcal floor?",
      answer:
        "It is a common educational safeguard in simple calculators. Individual needs can be higher or lower — ask a professional.",
    },
    "Fat Loss Diet Calculator — Deficit Macros",
    "Estimate fat-loss calories and macros from TDEE. Not medical advice.",
    ["fat loss diet calculator", "cutting macros", "fat loss calories educational"],
    "none",
  ),
  "diet-bulking-calories-calculator": article(
    "diet-bulking-calories-calculator",
    "Bulking calorie target",
    [
      "Adds a surplus (default 400 kcal) to TDEE for a simple bulking teaching target.",
      "Does not build a meal plan or training program.",
    ],
    {
      question: "Can I change the surplus?",
      answer:
        "Yes — enter a custom surplus kcal. Defaults are for education, not coaching.",
    },
    "Bulking Calories Calculator — TDEE + Surplus",
    "Estimate bulking calories from TDEE and an optional surplus. Wellness literacy only.",
    ["bulking calories calculator", "bulk calorie surplus", "muscle bulk calories"],
    "sparkTrendDemo",
  ),
  "diet-cutting-calories-calculator": article(
    "diet-cutting-calories-calculator",
    "Cutting calorie target",
    [
      "Subtracts a deficit (default 500 kcal) from TDEE with a 1200 kcal teaching floor.",
      "Not medical advice for aggressive cuts or contest prep.",
    ],
    {
      question: "What deficit should I use?",
      answer:
        "This tool accepts a custom deficit for literacy. Safer pacing depends on your health and should be reviewed with a professional.",
    },
    "Cutting Calories Calculator — TDEE − Deficit",
    "Estimate cutting calories from TDEE and an optional deficit. Not medical advice.",
    ["cutting calories calculator", "cut calorie deficit", "cutting diet calories"],
    "none",
  ),
};
