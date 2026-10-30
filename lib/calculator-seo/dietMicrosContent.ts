import type { RichArticle } from "./types";

const HUB_HREF = "/health/diet-nutrition/micronutrients";
const HUB_LABEL = "Health · Diet & Nutrition · Micronutrients";
const SHELL =
  "Wellness literacy tools that run in your browser. Micronutrient % RDA and ratio math only — not medical advice, lab interpretation, deficiency diagnosis, or supplementation dosing. Consult a clinician for personal decisions.";

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
        title: "Micronutrient tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Vitamin intake", "Intake ÷ RDA → %"],
          ["Mineral intake", "Intake ÷ RDA → %"],
          ["Iron", "Sex-based teaching RDA"],
          ["Calcium", "Age-banded teaching RDA"],
          ["Vitamin D", "Age-based IU target"],
          ["Electrolytes", "Sodium:potassium ratio"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your micronutrient inputs. Wellness literacy only — not medical advice.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Intake awareness",
            caption:
              "Share URL preserves your micronutrient inputs. Wellness literacy only — not medical advice.",
            sparkValues: [0.25, 0.4, 0.55, 0.7, 0.85, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const DIET_MICROS_ARTICLES: Record<string, RichArticle> = {
  "diet-vitamin-intake-calculator": article(
    "diet-vitamin-intake-calculator",
    "Vitamin intake vs RDA",
    [
      "Enter your intake and a reference RDA in the same units to see percent of RDA, with an optional vitamin name.",
      "Teaching arithmetic only — not a diagnosis of deficiency or excess.",
    ],
    {
      question: "Which RDA should I use?",
      answer:
        "Use a value from a trusted reference for your life stage, or ask a clinician. This tool only divides the numbers you provide.",
    },
    "Vitamin Intake Calculator — % of RDA",
    "Compare vitamin intake to an RDA amount as a percentage. Wellness literacy only.",
    ["vitamin intake calculator", "vitamin RDA percent", "vitamin daily value educational"],
    "sparkTrendDemo",
  ),
  "diet-mineral-intake-calculator": article(
    "diet-mineral-intake-calculator",
    "Mineral intake vs RDA",
    [
      "Compare mineral intake (mg) to an RDA amount and view percent of RDA.",
      "Not lab interpretation or a supplement recommendation.",
    ],
    {
      question: "Can this replace a blood test?",
      answer:
        "No. Dietary intake math is not the same as body stores or clinical status.",
    },
    "Mineral Intake Calculator — % of RDA",
    "Compare mineral intake to an RDA in mg. Not medical advice.",
    ["mineral intake calculator", "mineral RDA", "daily mineral percent"],
    "none",
  ),
  "diet-iron-intake-calculator": article(
    "diet-iron-intake-calculator",
    "Iron vs sex-based teaching RDA",
    [
      "Compares iron intake (mg) to a common teaching RDA (≈18 mg female / ≈8 mg male).",
      "Does not assess anemia, absorption, or pregnancy needs — educational only.",
    ],
    {
      question: "Why different RDAs by sex?",
      answer:
        "Many teaching tables use higher iron targets for menstruating adults. Your clinician may use a different target.",
    },
    "Iron Intake Calculator — Sex-Based Teaching RDA",
    "Compare iron intake to a sex-based teaching RDA. Wellness literacy only.",
    ["iron intake calculator", "iron RDA calculator", "daily iron percent"],
    "sparkTrendDemo",
  ),
  "diet-calcium-intake-calculator": article(
    "diet-calcium-intake-calculator",
    "Calcium vs age-banded RDA",
    [
      "Compares calcium intake (mg) to a teaching RDA of 1000 mg (or 1200 mg at age ≥50).",
      "Not bone-density assessment or osteoporosis care.",
    ],
    {
      question: "Is the RDA the same for teens?",
      answer:
        "Official tables vary by age. This educational helper uses a simple adult banding only.",
    },
    "Calcium Intake Calculator — Age-Banded RDA",
    "Compare calcium intake to an age-banded teaching RDA. Not medical advice.",
    ["calcium intake calculator", "calcium RDA", "daily calcium percent"],
    "none",
  ),
  "diet-vitamin-d-requirement-calculator": article(
    "diet-vitamin-d-requirement-calculator",
    "Vitamin D IU teaching target",
    [
      "Suggests a common teaching IU target by age (600 or 800) and optional intake % of that target.",
      "Not sun-exposure advice, lab interpretation, or dosing for deficiency treatment.",
    ],
    {
      question: "Should I take a vitamin D supplement?",
      answer:
        "Ask a clinician. This tool only shows a teaching IU target and optional intake percent.",
    },
    "Vitamin D Requirement Calculator — IU Teaching Target",
    "Estimate a teaching vitamin D IU target by age and optional intake %. Wellness literacy only.",
    ["vitamin D calculator", "vitamin D IU", "vitamin D RDA educational"],
    "sparkTrendDemo",
  ),
  "diet-electrolyte-balance-calculator": article(
    "diet-electrolyte-balance-calculator",
    "Sodium:potassium teaching ratio",
    [
      "Computes Na:K from daily sodium and potassium (mg) and shows a simple teaching band.",
      "Not electrolyte panel interpretation, dehydration care, or a medical balance diagnosis.",
    ],
    {
      question: "What is a good Na:K ratio?",
      answer:
        "This tool uses a simple teaching rule (favor ratio under 1). Clinical targets differ — discuss with a clinician.",
    },
    "Electrolyte Balance Calculator — Sodium to Potassium",
    "Estimate a teaching sodium:potassium ratio from daily mg intakes. Not medical advice.",
    ["electrolyte balance calculator", "sodium potassium ratio", "Na K diet educational"],
    "none",
  ),
};
