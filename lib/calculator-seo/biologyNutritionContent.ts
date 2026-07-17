import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/biology-nutrition-diet";
const HUB_LABEL = "Education · Science · Biology Nutrition & Diet";
const SHELL =
  "Educational nutrition and diet math for classroom use only — not medical advice, a meal prescription, or treatment for any condition. Consult a qualified professional for personal nutrition decisions.";

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
        title: "Nutrition & diet tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Macronutrient split", "kcal → protein/carb/fat g"],
          ["Protein intake", "kg × g/kg"],
          ["Water intake", "~35 mL/kg heuristic"],
          ["Deficit / surplus", "intake − TDEE"],
          ["TDEE", "BMR × activity"],
          ["Meal planner", "kcal ÷ meals"],
          ["Glycemic load", "(GI × carbs) / 100"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your inputs. Educational diet math only — not medical advice.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Nutrition balance idea",
            caption: "Share URL preserves your inputs. Educational diet math only — not medical advice.",
            sparkValues: [0.3, 0.45, 0.55, 0.65, 0.8, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BIOLOGY_NUTRITION_ARTICLES: Record<string, RichArticle> = {
  "macronutrient-calculator": article(
    "macronutrient-calculator",
    "Macronutrient split",
    [
      "Splits daily calories into protein, carbohydrate, and fat grams from percentage targets (normalized if they do not sum to 100).",
      "Educational macro arithmetic — not medical advice or a personalized diet plan.",
    ],
    {
      question: "Must the percentages sum to 100?",
      answer: "They are scaled to 100% by sum, so relative teaching mixes are fine.",
    },
    "Macronutrient Calculator — Protein Carbs Fat Split",
    "Split daily calories into macro grams for educational use — not medical advice.",
    ["macronutrient calculator", "protein carbs fat split", "macro grams education"],
    "sparkTrendDemo",
  ),
  "protein-intake-calculator": article(
    "protein-intake-calculator",
    "Protein intake",
    [
      "Protein (g) = body weight (kg) × grams per kilogram.",
      "Classroom heuristic only — not medical advice for athletes or clinical needs.",
    ],
    {
      question: "What g/kg should I use?",
      answer: "Teaching examples often use about 0.8–2.0 g/kg. Personal targets need professional guidance.",
    },
    "Protein Intake Calculator — Weight × g/kg",
    "Estimate daily protein grams from weight and g/kg — educational only.",
    ["protein intake calculator", "protein g per kg", "protein education"],
    "none",
  ),
  "water-intake-calculator": article(
    "water-intake-calculator",
    "Water intake",
    [
      "Educational fluid heuristic ≈ mL/kg × weight (default ~35 mL/kg).",
      "Not medical advice for dehydration, illness, or athletic hydration plans.",
    ],
    {
      question: "Is 35 mL/kg a clinical rule?",
      answer: "No — it is a simplified classroom default you can override.",
    },
    "Water Intake Calculator — Educational mL/kg Estimate",
    "Estimate daily water from body weight using an educational mL/kg heuristic.",
    ["water intake calculator", "mL per kg water", "hydration education"],
    "sparkTrendDemo",
  ),
  "calorie-deficit-surplus-calculator": article(
    "calorie-deficit-surplus-calculator",
    "Calorie deficit / surplus",
    [
      "Compares intake to TDEE and labels deficit, surplus, or near-maintenance.",
      "Educational energy-balance math — not medical advice for weight change.",
    ],
    {
      question: "Does a deficit guarantee weight loss?",
      answer: "No — real outcomes depend on many factors. This tool only subtracts teaching numbers.",
    },
    "Calorie Deficit Surplus Calculator — Intake vs TDEE",
    "Compare calorie intake to TDEE for educational energy-balance math — not medical advice.",
    ["calorie deficit calculator", "calorie surplus", "TDEE intake education"],
    "none",
  ),
  "tdee-calculator": article(
    "tdee-calculator",
    "TDEE from BMR",
    [
      "TDEE ≈ BMR × activity factor.",
      "Educational daily-energy estimate — not medical advice or a diet prescription.",
    ],
    {
      question: "Where do I get BMR?",
      answer: "Use a BMR estimate from another educational tool or a teaching example value.",
    },
    "TDEE Calculator — BMR × Activity Factor",
    "Estimate TDEE from BMR and activity factor — educational only, not medical advice.",
    ["TDEE calculator", "BMR activity factor", "total daily energy education"],
    "sparkTrendDemo",
  ),
  "meal-planner-calculator": article(
    "meal-planner-calculator",
    "Meal planner",
    [
      "Splits daily calories evenly across N meals.",
      "Simple educational planning aid — not medical advice or a nutrition therapy plan.",
    ],
    {
      question: "Can meals have unequal calories?",
      answer: "This tool uses equal splits only for classroom simplicity.",
    },
    "Meal Planner Calculator — Calories per Meal",
    "Split daily calories evenly across meals for educational planning — not medical advice.",
    ["meal planner calculator", "calories per meal", "meal split education"],
    "none",
  ),
  "glycemic-index-calculator": article(
    "glycemic-index-calculator",
    "Glycemic load",
    [
      "Glycemic load ≈ (GI × carbohydrate grams) / 100 with low/medium/high educational bands.",
      "Food-math for class — not medical advice for blood-glucose management.",
    ],
    {
      question: "Is glycemic load a diabetes treatment tool?",
      answer: "No — discuss carbohydrate choices with a qualified clinician or dietitian.",
    },
    "Glycemic Index Calculator — Educational Glycemic Load",
    "Calculate glycemic load from GI and carbs — educational only, not medical advice.",
    ["glycemic index calculator", "glycemic load", "GI carbs education"],
    "sparkTrendDemo",
  ),
};
