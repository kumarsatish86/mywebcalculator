import type { RichArticle } from "./types";

const HUB_HREF = "/health/diet-nutrition/age-gender-nutrition";
const HUB_LABEL = "Health · Diet & Nutrition · Age & Gender Nutrition";
const SHELL =
  "Wellness literacy tools that run in your browser. Life-stage energy estimates only — not medical advice, pediatric/obstetric care, or personalized meal prescriptions. Consult a clinician or dietitian for personal decisions.";

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
        title: "Life-stage nutrition tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Child", "Rough age × energy teaching estimate"],
          ["Teen", "Mifflin TDEE ages 13–19"],
          ["Adult", "Mifflin TDEE"],
          ["Senior", "TDEE age ≥60 + protein note"],
          ["Pregnancy", "TDEE + trimester bonus"],
          ["Breastfeeding", "TDEE + ~450 kcal"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your life-stage inputs. Wellness literacy only — not medical advice.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Life-stage awareness",
            caption:
              "Share URL preserves your life-stage inputs. Wellness literacy only — not medical advice.",
            sparkValues: [0.25, 0.4, 0.55, 0.65, 0.8, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const DIET_AGE_GENDER_ARTICLES: Record<string, RichArticle> = {
  "diet-child-nutrition-calculator": article(
    "diet-child-nutrition-calculator",
    "Child energy teaching estimate",
    [
      "Uses a rough pediatric teaching formula from age (1–12) and weight — not growth-chart clinical dosing.",
      "Always pair with pediatric guidance and growth monitoring for real care.",
    ],
    {
      question: "Is this enough for my child?",
      answer:
        "Only a clinician or pediatric dietitian can answer that. This is a classroom-style energy estimate.",
    },
    "Child Nutrition Calculator — Pediatric Energy Estimate",
    "Estimate rough childhood calorie needs from age and weight. Wellness literacy only.",
    ["child nutrition calculator", "kids calorie needs", "pediatric diet educational"],
    "sparkTrendDemo",
  ),
  "diet-teen-nutrition-calculator": article(
    "diet-teen-nutrition-calculator",
    "Teen TDEE teaching estimate",
    [
      "Applies Mifflin-style BMR × activity for ages 13–19 with sex and activity inputs.",
      "Not adolescent medical nutrition therapy or sports-performance coaching.",
    ],
    {
      question: "Why ages 13–19 only?",
      answer:
        "This helper is scoped to a teen teaching band. Younger or older ages use other tools in this family.",
    },
    "Teen Nutrition Calculator — Ages 13–19 TDEE",
    "Estimate teen calorie needs with Mifflin-style TDEE math. Not medical advice.",
    ["teen nutrition calculator", "teenager calories", "adolescent TDEE educational"],
    "none",
  ),
  "diet-adult-nutrition-calculator": article(
    "diet-adult-nutrition-calculator",
    "Adult TDEE teaching estimate",
    [
      "Estimates adult daily calories from weight, height, age, sex, and activity using Mifflin × activity factor.",
      "Educational energy math only — not a weight-loss prescription.",
    ],
    {
      question: "Which activity level should I pick?",
      answer:
        "Use sedentary, light, moderate, active, or very based on typical weekly movement. When unsure, start conservative and verify with a professional.",
    },
    "Adult Nutrition Calculator — Mifflin TDEE",
    "Estimate adult calorie needs from Mifflin-style TDEE. Wellness literacy only.",
    ["adult nutrition calculator", "adult TDEE", "daily calorie needs adults"],
    "sparkTrendDemo",
  ),
  "diet-senior-citizen-diet-calculator": article(
    "diet-senior-citizen-diet-calculator",
    "Senior TDEE + protein note",
    [
      "For age ≥60, estimates TDEE and applies a slightly higher protein % teaching split.",
      "Not geriatric medical nutrition or sarcopenia treatment.",
    ],
    {
      question: "Why higher protein %?",
      answer:
        "Many teaching materials emphasize protein in older adults. Your clinician may set a different target.",
    },
    "Senior Citizen Diet Calculator — TDEE & Protein",
    "Estimate senior calorie and macro teaching targets (age ≥60). Not medical advice.",
    ["senior nutrition calculator", "elderly calorie needs", "senior diet educational"],
    "none",
  ),
  "diet-pregnancy-nutrition-calculator": article(
    "diet-pregnancy-nutrition-calculator",
    "Pregnancy calorie teaching bonus",
    [
      "Starts from female Mifflin TDEE and adds a common trimester teaching bonus (≈0 / 340 / 450 kcal).",
      "Not prenatal care, gestational diabetes management, or a clinical meal plan.",
    ],
    {
      question: "Do I always need extra calories in trimester 1?",
      answer:
        "Many teaching tables use little or no surplus early on. Follow your obstetric clinician’s guidance.",
    },
    "Pregnancy Nutrition Calculator — Trimester Energy",
    "Estimate pregnancy calorie needs with trimester teaching bonuses. Wellness literacy only.",
    ["pregnancy nutrition calculator", "pregnancy calories", "trimester calorie needs"],
    "sparkTrendDemo",
  ),
  "diet-breastfeeding-nutrition-calculator": article(
    "diet-breastfeeding-nutrition-calculator",
    "Lactation calorie teaching bonus",
    [
      "Adds a common ~450 kcal lactation teaching bonus to female Mifflin TDEE.",
      "Not lactation consulting, infant feeding advice, or postpartum medical care.",
    ],
    {
      question: "Is +450 kcal always correct while breastfeeding?",
      answer:
        "Needs vary with milk volume and maternal status. This is a fixed educational bonus only.",
    },
    "Breastfeeding Nutrition Calculator — Lactation Energy",
    "Estimate breastfeeding calorie needs with a teaching lactation bonus. Not medical advice.",
    ["breastfeeding nutrition calculator", "lactation calories", "nursing diet educational"],
    "none",
  ),
};
