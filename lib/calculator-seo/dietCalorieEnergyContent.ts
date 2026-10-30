import type { RichArticle } from "./types";

const HUB_HREF = "/health/diet-nutrition/calorie-energy";
const HUB_LABEL = "Health · Diet & Nutrition · Calorie & Energy";
const SHELL =
  "Wellness education tools that run in your browser. Not a medical device, nutrition prescription, or clinical advice. Individual calorie needs vary — consult a qualified professional before changing diet or exercise.";

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
        title: "Calorie & energy tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Daily needs / TDEE", "Mifflin BMR × activity"],
          ["Maintenance", "TDEE as maintenance kcal"],
          ["Loss / gain targets", "TDEE ± deficit/surplus"],
          ["Activity / exercise burn", "MET × kg × time"],
          ["Steps → calories", "steps × kcal/step"],
          ["Deficit / surplus", "TDEE vs intake"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your calorie inputs. Wellness education only — not a medical device.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Energy balance idea",
            caption:
              "Share URL preserves your calorie inputs. Wellness education only — not a medical device.",
            sparkValues: [0.25, 0.4, 0.55, 0.65, 0.8, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const DIET_CALORIE_ENERGY_ARTICLES: Record<string, RichArticle> = {
  "diet-daily-calorie-needs-calculator": article(
    "diet-daily-calorie-needs-calculator",
    "Daily calorie needs (TDEE)",
    [
      "Estimates total daily energy expenditure from Mifflin–St Jeor BMR and an activity factor (sedentary → very).",
      "Wellness teaching math only — not a medical device or personalized prescription.",
    ],
    {
      question: "Is this my exact calorie requirement?",
      answer:
        "No. It is an educational estimate. Real needs depend on body composition, health conditions, and measured progress with professional guidance.",
    },
    "Daily Calorie Needs Calculator — TDEE Wellness Estimate",
    "Estimate daily calorie needs from weight, height, age, sex, and activity. Wellness education — not a medical device.",
    ["daily calorie needs calculator", "TDEE calculator", "calorie needs wellness"],
  ),
  "diet-maintenance-calories-calculator": article(
    "diet-maintenance-calories-calculator",
    "Maintenance calories",
    [
      "Maintenance intake is framed as TDEE: BMR × activity factor.",
      "Use as a starting literacy estimate — not clinical advice.",
    ],
    {
      question: "Should I eat exactly maintenance every day?",
      answer:
        "This tool only estimates TDEE. Weekly averages, preferences, and professional advice matter more than a single number.",
    },
    "Maintenance Calories Calculator — TDEE Estimate",
    "Estimate maintenance calories from Mifflin–St Jeor TDEE. Educational wellness tool — not medical advice.",
    ["maintenance calories calculator", "maintenance TDEE", "calorie maintenance"],
  ),
  "diet-weight-loss-calorie-calculator": article(
    "diet-weight-loss-calorie-calculator",
    "Weight-loss calorie target",
    [
      "Subtracts a daily deficit (default 500 kcal) from TDEE and floors the target at 1200 kcal for teaching.",
      "Not a weight-loss program or medical device — aggressive deficits can be unsafe.",
    ],
    {
      question: "Is a 500 kcal deficit always safe?",
      answer:
        "No. Safe pacing depends on starting weight, health status, and clinician or dietitian guidance. This is educational arithmetic only.",
    },
    "Weight Loss Calorie Calculator — Deficit from TDEE",
    "Estimate a weight-loss calorie target from TDEE minus a deficit. Wellness education — not a medical device.",
    ["weight loss calorie calculator", "calorie deficit target", "weight loss TDEE"],
  ),
  "diet-weight-gain-calorie-calculator": article(
    "diet-weight-gain-calorie-calculator",
    "Weight-gain calorie target",
    [
      "Adds a daily surplus (default 300 kcal) to TDEE for a teaching gain target.",
      "Educational only — not sports nutrition coaching or medical advice.",
    ],
    {
      question: "Will this guarantee muscle gain?",
      answer:
        "No. Surplus estimates energy intake only. Training, protein, and individual response determine outcomes — seek professional coaching when needed.",
    },
    "Weight Gain Calorie Calculator — Surplus from TDEE",
    "Estimate a weight-gain calorie target from TDEE plus a surplus. Wellness education only.",
    ["weight gain calorie calculator", "calorie surplus", "bulking calories estimate"],
  ),
  "diet-tdee-calculator": article(
    "diet-tdee-calculator",
    "TDEE calculator",
    [
      "Total daily energy expenditure ≈ Mifflin BMR × activity factor.",
      "Activity labels: sedentary, light, moderate, active, very — teaching multipliers only.",
    ],
    {
      question: "Which activity level should I pick?",
      answer:
        "Choose the closest lifestyle label. When unsure, start conservative and adjust with measured weight trends under professional guidance.",
    },
    "TDEE Calculator — Total Daily Energy Expenditure",
    "Compute TDEE from Mifflin–St Jeor BMR and activity. Educational wellness estimate — not a medical device.",
    ["TDEE calculator", "total daily energy expenditure", "BMR activity factor"],
  ),
  "diet-activity-calorie-burn-calculator": article(
    "diet-activity-calorie-burn-calculator",
    "Activity calorie burn",
    [
      "Uses kcal ≈ MET × weight(kg) × hours for a teaching burn estimate.",
      "MET tables vary by source — this is literacy math, not a fitness tracker.",
    ],
    {
      question: "Where do MET values come from?",
      answer:
        "Enter a MET from a published activity table. This host multiplies MET × kg × hours only — it does not look up activities for you.",
    },
    "Activity Calorie Burn Calculator — MET × Weight × Hours",
    "Estimate activity calories from MET, body weight, and hours. Wellness education — not medical advice.",
    ["activity calorie burn calculator", "MET calorie calculator", "exercise MET kcal"],
    "sparkTrendDemo",
  ),
  "diet-steps-to-calories-calculator": article(
    "diet-steps-to-calories-calculator",
    "Steps to calories",
    [
      "Converts steps to calories with a simple kcal/step factor (default 0.04).",
      "Stride length and body size change real burn — educational heuristic only.",
    ],
    {
      question: "Is 0.04 kcal per step accurate?",
      answer:
        "It is a common teaching default, not a personal measurement. Adjust the factor if you have a better estimate from a wearable or professional.",
    },
    "Steps to Calories Calculator — Step Count × kcal/Step",
    "Convert steps to estimated calories with an adjustable kcal/step factor. Wellness education only.",
    ["steps to calories calculator", "step calorie converter", "walking calories estimate"],
  ),
  "diet-exercise-calorie-calculator": article(
    "diet-exercise-calorie-calculator",
    "Exercise calories",
    [
      "kcal ≈ MET × weight(kg) × (minutes / 60).",
      "Useful for short workout literacy — not a VO₂ or lab measurement.",
    ],
    {
      question: "Does this include afterburn?",
      answer:
        "No. It is a simple MET × time model during the session only. EPOC and recovery are not modeled.",
    },
    "Exercise Calorie Calculator — MET × Minutes",
    "Estimate exercise calories from MET, weight, and minutes. Educational wellness tool — not a medical device.",
    ["exercise calorie calculator", "workout calories MET", "exercise burn estimate"],
  ),
  "diet-calorie-deficit-calculator": article(
    "diet-calorie-deficit-calculator",
    "Calorie deficit",
    [
      "Deficit = TDEE − intake. Weekly kg estimate uses ~7700 kcal per kg as a teaching constant.",
      "Real weight change is not linear — not a medical device or diet plan.",
    ],
    {
      question: "Why 7700 kcal per kg?",
      answer:
        "It is a common classroom approximation for energy stored in ~1 kg of body mass. Individual composition and water shifts make real results differ.",
    },
    "Calorie Deficit Calculator — TDEE Minus Intake",
    "Compute daily calorie deficit and a rough weekly kg estimate. Wellness education — not medical advice.",
    ["calorie deficit calculator", "deficit to weight loss", "TDEE intake deficit"],
  ),
  "diet-calorie-surplus-calculator": article(
    "diet-calorie-surplus-calculator",
    "Calorie surplus",
    [
      "Surplus = intake − TDEE, with a rough weekly gain estimate from ~7700 kcal/kg.",
      "Educational energy-balance math only — not bulk coaching or medical advice.",
    ],
    {
      question: "Will surplus always become fat?",
      answer:
        "No. Training, protein, and genetics affect how surplus is stored. This tool only subtracts intake and TDEE for literacy.",
    },
    "Calorie Surplus Calculator — Intake Minus TDEE",
    "Compute daily calorie surplus and a rough weekly kg estimate. Wellness education — not a medical device.",
    ["calorie surplus calculator", "surplus weight gain", "intake vs TDEE"],
  ),
};
