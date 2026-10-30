import type { RichArticle } from "./types";

const HUB_HREF = "/health/diet-nutrition/condition-specific-diets";
const HUB_LABEL = "Health · Diet & Nutrition · Condition-Specific Diets";
const SHELL =
  "Wellness literacy tools that run in your browser. Condition-oriented teaching macros only — not medical advice, disease treatment, or a substitute for clinician or dietitian care. Always pair with professional guidance.";

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
        title: "Condition diet tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Diabetes", "Even-carb teaching macros"],
          ["Low sugar", "Intake vs limit (g)"],
          ["Cholesterol", "Fiber/unsat-fat framing + sat-fat %"],
          ["Blood pressure", "DASH-leaning + sodium cap"],
          ["Thyroid", "Balanced macros + micronutrient note"],
          ["PCOS", "Lower-GI carb teaching split"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your condition-diet inputs. Wellness literacy only — not medical advice.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Pattern awareness",
            caption:
              "Share URL preserves your condition-diet inputs. Wellness literacy only — not medical advice.",
            sparkValues: [0.2, 0.35, 0.5, 0.6, 0.75, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const DIET_CONDITION_ARTICLES: Record<string, RichArticle> = {
  "diet-diabetes-diet-calculator": article(
    "diet-diabetes-diet-calculator",
    "Diabetes teaching macros",
    [
      "Splits daily calories into a diabetes-oriented teaching macro mix with a note to spread carbs evenly.",
      "Not glycemic control, medication advice, or a clinical carbohydrate prescription.",
    ],
    {
      question: "Can I use this instead of seeing a dietitian?",
      answer:
        "No. Diabetes nutrition is individualized. This is educational macro arithmetic only.",
    },
    "Diabetes Diet Calculator — Teaching Macros",
    "Estimate diabetes-oriented teaching macros from calories. Not medical advice.",
    ["diabetes diet calculator", "diabetes macros", "carb split educational"],
    "sparkTrendDemo",
  ),
  "diet-low-sugar-intake-calculator": article(
    "diet-low-sugar-intake-calculator",
    "Sugar intake vs limit",
    [
      "Compare daily added-sugar grams to a teaching limit (default 25 g) and see whether you are within it.",
      "Not a diagnosis of metabolic disease or a medical sugar prescription.",
    ],
    {
      question: "Is 25 g the official limit for everyone?",
      answer:
        "Guidelines vary. This default is a common teaching figure — customize the limit field as needed.",
    },
    "Low Sugar Intake Calculator — Daily Limit Check",
    "Compare daily sugar grams to a teaching limit. Wellness literacy only.",
    ["low sugar calculator", "sugar intake limit", "added sugar educational"],
    "none",
  ),
  "diet-cholesterol-diet-calculator": article(
    "diet-cholesterol-diet-calculator",
    "Cholesterol-oriented teaching macros",
    [
      "Applies a heart-healthy teaching macro split and a saturated-fat % awareness cap.",
      "Not lipid therapy, statin decisions, or a clinical diet order.",
    ],
    {
      question: "Does this lower my cholesterol?",
      answer:
        "This tool only computes teaching macros. Lipid outcomes require clinical care and verified food choices.",
    },
    "Cholesterol Diet Calculator — Heart-Healthy Macros",
    "Estimate cholesterol-oriented teaching macros from calories. Not medical advice.",
    ["cholesterol diet calculator", "heart healthy macros", "sat fat awareness educational"],
    "sparkTrendDemo",
  ),
  "diet-blood-pressure-diet-calculator": article(
    "diet-blood-pressure-diet-calculator",
    "Blood-pressure teaching macros",
    [
      "DASH-leaning teaching macros plus a lower sodium awareness cap (1500 mg).",
      "Not hypertension treatment or medication advice.",
    ],
    {
      question: "Is this the same as the DASH calculator?",
      answer:
        "It uses a similar teaching frame. It does not generate a full DASH food plan or clinical targets.",
    },
    "Blood Pressure Diet Calculator — DASH-Leaning Macros",
    "Estimate blood-pressure-oriented teaching macros and a sodium cap. Wellness literacy only.",
    ["blood pressure diet calculator", "DASH blood pressure diet", "sodium awareness educational"],
    "none",
  ),
  "diet-thyroid-diet-calculator": article(
    "diet-thyroid-diet-calculator",
    "Thyroid-oriented teaching macros",
    [
      "Balanced teaching macros with a note that iodine/selenium dosing is a clinical topic not handled here.",
      "Not thyroid disease treatment or goitrogen/medication interaction advice.",
    ],
    {
      question: "Will this fix my thyroid?",
      answer:
        "No. Thyroid conditions need clinician care. This tool only shows educational macro grams.",
    },
    "Thyroid Diet Calculator — Balanced Teaching Macros",
    "Estimate thyroid-oriented teaching macros from calories. Not medical advice.",
    ["thyroid diet calculator", "thyroid macros educational", "thyroid nutrition literacy"],
    "sparkTrendDemo",
  ),
  "diet-pcos-diet-calculator": article(
    "diet-pcos-diet-calculator",
    "PCOS teaching macros",
    [
      "Uses a lower-GI carb emphasis teaching split from daily calories.",
      "Not PCOS diagnosis, fertility care, or a clinic meal prescription.",
    ],
    {
      question: "Is lower GI required for PCOS?",
      answer:
        "Approaches vary. This is one educational macro frame — individualize with a clinician or dietitian.",
    },
    "PCOS Diet Calculator — Lower-GI Teaching Macros",
    "Estimate PCOS-oriented teaching macros from calories. Wellness literacy only.",
    ["PCOS diet calculator", "PCOS macros", "PCOS nutrition educational"],
    "none",
  ),
};
