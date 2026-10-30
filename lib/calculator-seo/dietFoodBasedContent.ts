import type { RichArticle } from "./types";

const HUB_HREF = "/health/diet-nutrition/food-based-calories";
const HUB_LABEL = "Health · Diet & Nutrition · Food-Based Calories";
const SHELL =
  "Wellness literacy tools that run in your browser. Food and recipe calorie arithmetic only — not medical advice or a substitute for labeled nutrition facts. Estimates depend on the numbers you enter.";

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
        title: "Food-based calorie tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Calories in food", "(g ÷ 100) × kcal/100 g"],
          ["Fast food", "Sum CSV item kcal"],
          ["Restaurant meal", "Entrée + side + drink"],
          ["Recipe nutrition", "Totals ÷ servings"],
          ["Ingredient", "Scale kcal + protein by grams"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your food calorie inputs. Wellness literacy only — not medical advice.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Logging awareness",
            caption:
              "Share URL preserves your food calorie inputs. Wellness literacy only — not medical advice.",
            sparkValues: [0.2, 0.4, 0.5, 0.65, 0.8, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const DIET_FOOD_BASED_ARTICLES: Record<string, RichArticle> = {
  "diet-calories-in-food-calculator": article(
    "diet-calories-in-food-calculator",
    "Scale food calories by weight",
    [
      "Computes kcal = (grams ÷ 100) × kcal per 100 g using values you provide from a label or database.",
      "Accuracy depends entirely on the density figure you enter.",
    ],
    {
      question: "Where do I find kcal per 100 g?",
      answer:
        "From the nutrition label or a trusted food database. This tool only multiplies the numbers you enter.",
    },
    "Calories in Food Calculator — Grams × Density",
    "Estimate food calories from grams and kcal per 100 g. Wellness literacy only.",
    ["calories in food calculator", "food calorie density", "grams to calories"],
    "sparkTrendDemo",
  ),
  "diet-fast-food-calorie-calculator": article(
    "diet-fast-food-calorie-calculator",
    "Sum fast-food item calories",
    [
      "Enter item calories as CSV numbers to sum a meal total and count items.",
      "Does not look up menu items — you supply each calorie figure.",
    ],
    {
      question: "Can it look up a burger by name?",
      answer:
        "No. Paste numeric calories from the restaurant’s published info or your own estimate.",
    },
    "Fast Food Calorie Calculator — CSV Item Sum",
    "Sum fast-food item calories from a CSV list. Not medical advice.",
    ["fast food calorie calculator", "menu calorie sum", "fast food kcal educational"],
    "none",
  ),
  "diet-restaurant-meal-calorie-calculator": article(
    "diet-restaurant-meal-calorie-calculator",
    "Entrée + side + drink",
    [
      "Adds three components — entrée, side, and drink — for a simple restaurant-meal total.",
      "Useful when you already have each piece’s kcal from a menu card.",
    ],
    {
      question: "What about sauces and extras?",
      answer:
        "Fold them into one of the three fields or raise the entrée estimate. The tool only sums three numbers.",
    },
    "Restaurant Meal Calorie Calculator — Three Parts",
    "Sum entrée, side, and drink calories for a restaurant meal. Wellness literacy only.",
    ["restaurant meal calorie calculator", "dining out calories", "meal calorie sum"],
    "sparkTrendDemo",
  ),
  "diet-recipe-nutrition-calculator": article(
    "diet-recipe-nutrition-calculator",
    "Per-serving recipe macros",
    [
      "Divides total recipe kcal, protein, carbs, and fat by the number of servings.",
      "You must supply accurate batch totals — the tool does not analyze ingredients.",
    ],
    {
      question: "Can it parse a recipe URL?",
      answer:
        "No. Enter batch totals yourself, then divide by servings for literacy.",
    },
    "Recipe Nutrition Calculator — Per Serving Split",
    "Divide recipe calories and macros by servings. Not medical advice.",
    ["recipe nutrition calculator", "per serving macros", "recipe calories educational"],
    "none",
  ),
  "diet-ingredient-nutrition-calculator": article(
    "diet-ingredient-nutrition-calculator",
    "Scale ingredient kcal and protein",
    [
      "Scales kcal and protein from per-100 g values by the grams you use in a recipe or plate.",
      "Educational portion math — not a full nutrient panel.",
    ],
    {
      question: "Why only protein besides calories?",
      answer:
        "This teaching helper focuses on energy and protein density. Add other nutrients separately if needed.",
    },
    "Ingredient Nutrition Calculator — Grams Scale",
    "Scale ingredient calories and protein from per-100 g values. Wellness literacy only.",
    ["ingredient nutrition calculator", "ingredient calories", "protein per 100g"],
    "sparkTrendDemo",
  ),
};
