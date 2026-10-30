import type { RichArticle } from "./types";

const HUB_HREF = "/health/medical/medical-nutrition";
const HUB_LABEL = "Health · Medical · Nutrition";
const SHELL =
  "Educational nutrition arithmetic in your browser only. Not medical advice, diet prescriptions, clinical nutrition therapy, or eating-disorder care. Consult a clinician or registered dietitian.";

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
        title: "Nutrition tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Daily calories / TDEE", "BMR × activity factor"],
          ["Macros", "% split → grams"],
          ["Water", "kg × ml/kg"],
          ["Protein / carb / fat", "Intake from weight or calories"],
          ["Fiber", "g per 1000 kcal"],
          ["Sodium", "mg vs ~2300 teaching band"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your nutrition inputs. Educational estimates only — not medical advice.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Intake awareness",
            caption:
              "Share URL preserves your nutrition inputs. Educational estimates only — not medical advice.",
            sparkValues: [0.25, 0.4, 0.55, 0.7, 0.85, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MEDICAL_NUTRITION_MED_ARTICLES: Record<string, RichArticle> = {
  "medical-daily-calorie-needs-calculator": article(
    "medical-daily-calorie-needs-calculator",
    "Daily calorie needs from BMR",
    [
      "Multiply BMR by an activity factor (sedentary, light, moderate, active, or very).",
      "Outputs are teaching estimates — not personalized medical nutrition plans.",
    ],
    {
      question: "Where do I get BMR?",
      answer:
        "Use a BMR calculator or clinician estimate first, then enter it here with your activity label.",
    },
    "Daily Calorie Needs Calculator — BMR × Activity",
    "Estimate daily calories from BMR and activity factor. Educational only — not medical advice.",
    ["daily calorie calculator", "calorie needs calculator", "BMR activity factor"],
    "sparkTrendDemo",
  ),
  "medical-tdee-calculator": article(
    "medical-tdee-calculator",
    "Total daily energy expenditure",
    [
      "TDEE = BMR × activity factor using the same activity labels as daily calories.",
      "Not a prescription for weight loss or medical diets.",
    ],
    {
      question: "Is TDEE the same as daily calorie needs?",
      answer:
        "In this suite they use the same BMR × activity math; labels differ for teaching clarity.",
    },
    "TDEE Calculator — Total Daily Energy Expenditure",
    "Estimate TDEE from BMR and activity. Educational only — not medical advice.",
    ["TDEE calculator", "total daily energy expenditure", "TDEE educational"],
    "none",
  ),
  "medical-macronutrient-calculator": article(
    "medical-macronutrient-calculator",
    "Macronutrient gram split",
    [
      "Enter calories and protein/carb/fat percentages. Percents are normalized if they do not sum to 100.",
      "Educational macro math only — not a therapeutic diet plan.",
    ],
    {
      question: "What if my percentages do not add to 100?",
      answer:
        "The tool scales the mix proportionally. Prefer entering a coherent 100% split when possible.",
    },
    "Macronutrient Calculator — Protein Carbs Fat Grams",
    "Split calories into protein, carb, and fat grams from percentages. Not medical advice.",
    ["macronutrient calculator", "macro calculator", "protein carbs fat"],
    "sparkTrendDemo",
  ),
  "medical-water-intake-calculator": article(
    "medical-water-intake-calculator",
    "Water intake estimate",
    [
      "ml/day ≈ weight_kg × ml/kg (default 35). Climate, activity, and medical conditions change needs.",
      "Not a fluid prescription for kidney, heart, or other conditions.",
    ],
    {
      question: "Is 35 ml/kg always right?",
      answer:
        "No. It is a common teaching default. Your clinician may recommend a different fluid target.",
    },
    "Water Intake Calculator — ml per kg Estimate",
    "Estimate daily water from weight and ml/kg. Educational only — not medical advice.",
    ["water intake calculator", "daily water needs", "ml per kg water"],
    "none",
  ),
  "medical-protein-intake-calculator": article(
    "medical-protein-intake-calculator",
    "Protein from g/kg",
    [
      "Protein grams = weight_kg × g/kg. Common teaching ranges vary by goal and clinical status.",
      "Kidney disease and other conditions need clinician-guided protein targets.",
    ],
    {
      question: "What g/kg should I use?",
      answer:
        "Depends on goals and health status. This tool only multiplies the g/kg you choose — ask a clinician or dietitian.",
    },
    "Protein Intake Calculator — Grams per kg",
    "Estimate daily protein grams from weight and g/kg. Not medical advice.",
    ["protein intake calculator", "protein g per kg", "daily protein calculator"],
    "sparkTrendDemo",
  ),
  "medical-carb-intake-calculator": article(
    "medical-carb-intake-calculator",
    "Carbohydrate grams from calories",
    [
      "Carb grams = (calories × carb%) / 4. Enter calories and carb percentage.",
      "Not a diabetes meal plan or medical carbohydrate prescription.",
    ],
    {
      question: "Why divide by 4?",
      answer:
        "Dietary carbohydrate is commonly taught as ~4 kcal per gram. This is educational energy arithmetic.",
    },
    "Carb Intake Calculator — Grams from Calories",
    "Estimate carbohydrate grams from calories and carb %. Not medical advice.",
    ["carb intake calculator", "carbohydrate calculator", "carb grams calculator"],
    "none",
  ),
  "medical-fat-intake-calculator": article(
    "medical-fat-intake-calculator",
    "Fat grams from calories",
    [
      "Fat grams = (calories × fat%) / 9. Enter calories and fat percentage.",
      "Educational only — not lipid therapy or medical diet advice.",
    ],
    {
      question: "Why divide by 9?",
      answer:
        "Dietary fat is commonly taught as ~9 kcal per gram in energy-balance examples.",
    },
    "Fat Intake Calculator — Grams from Calories",
    "Estimate fat grams from calories and fat %. Educational only — not medical advice.",
    ["fat intake calculator", "dietary fat calculator", "fat grams calculator"],
    "sparkTrendDemo",
  ),
  "medical-fiber-intake-calculator": article(
    "medical-fiber-intake-calculator",
    "Fiber from calories",
    [
      "Fiber grams ≈ (calories / 1000) × g per 1000 kcal (default 14).",
      "Teaching heuristic only — not a GI or diabetes nutrition plan.",
    ],
    {
      question: "Is 14 g per 1000 kcal a requirement?",
      answer:
        "It is a common educational density rule of thumb. Personal targets should come from a clinician or dietitian.",
    },
    "Fiber Intake Calculator — g per 1000 kcal",
    "Estimate fiber grams from calories and a per-1000-kcal rule. Not medical advice.",
    ["fiber intake calculator", "daily fiber calculator", "fiber grams"],
    "none",
  ),
  "medical-sodium-intake-calculator": article(
    "medical-sodium-intake-calculator",
    "Sodium teaching band",
    [
      "Compare daily sodium (mg) to a common adult upper-limit teaching band around 2300 mg.",
      "Heart failure, kidney disease, and other conditions may need different limits — ask a clinician.",
    ],
    {
      question: "Is 2300 mg the right limit for everyone?",
      answer:
        "No. Guidelines and medical conditions differ. This tool only labels your entered milligrams for literacy.",
    },
    "Sodium Intake Calculator — Daily mg Teaching Band",
    "Compare daily sodium intake to a common teaching upper limit. Not medical advice.",
    ["sodium intake calculator", "daily sodium calculator", "sodium mg limit"],
    "sparkTrendDemo",
  ),
};
