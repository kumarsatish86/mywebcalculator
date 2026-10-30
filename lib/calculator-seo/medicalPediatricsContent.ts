import type { RichArticle } from "./types";

const HUB_HREF = "/health/medical/pediatrics-child-health";
const HUB_LABEL = "Health · Medical · Pediatrics & Child Health";
const SHELL =
  "Educational pediatrics arithmetic in your browser only. Not medical advice, growth diagnosis, dosing orders, or emergency care. Verify charts and protocols with qualified clinicians.";

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
        title: "Pediatrics tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Child BMI", "kg / m² number only"],
          ["Growth percentile", "Φ(z) from z-score"],
          ["Pediatric dosage", "weight × mg/kg"],
          ["Baby weight gain", "gain and g/day"],
          ["Head circumference", "z vs mean/SD"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your pediatric inputs. Educational teaching models only — not for clinical decisions.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Growth awareness",
            caption:
              "Share URL preserves your pediatric inputs. Educational teaching models only — not for clinical decisions.",
            sparkValues: [0.15, 0.3, 0.45, 0.6, 0.75, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MEDICAL_PEDIATRICS_ARTICLES: Record<string, RichArticle> = {
  "medical-child-bmi-calculator": article(
    "medical-child-bmi-calculator",
    "Child BMI number",
    [
      "Enter weight (kg) and height (cm) to compute BMI = kg / m².",
      "Pediatric interpretation needs age/sex percentile charts — this host returns the number only. Not medical advice.",
    ],
    {
      question: "Does this give a BMI percentile?",
      answer:
        "No. It computes the BMI value. Official CDC/WHO percentile tools require age and sex and are used clinically.",
    },
    "Child BMI Calculator — Weight and Height Teaching Tool",
    "Compute child BMI from kg and cm for education. Not a percentile chart or medical advice.",
    ["child BMI calculator", "pediatric BMI educational", "kids BMI kg cm"],
    "sparkTrendDemo",
  ),
  "medical-growth-percentile-calculator": article(
    "medical-growth-percentile-calculator",
    "Percentile from z-score",
    [
      "Converts a z-score (roughly −5 to 5) to an approximate percentile via a normal CDF approximation.",
      "Not a CDC/WHO chart lookup — educational statistics only.",
    ],
    {
      question: "Where do I get the z-score?",
      answer:
        "From a growth chart or LMS/z tool you already trust. This calculator only maps z → percentile for teaching.",
    },
    "Growth Percentile Calculator — Z-Score to Percentile",
    "Approximate growth percentile from a z-score with a normal CDF teaching map. Not medical advice.",
    ["growth percentile calculator", "z-score percentile", "pediatric growth educational"],
    "none",
  ),
  "medical-pediatric-dosage-calculator": article(
    "medical-pediatric-dosage-calculator",
    "Weight-based mg/kg dose",
    [
      "Multiplies weight (kg) by mg/kg for a per-dose amount; optional doses/day scales a daily total.",
      "Never overrides pharmacy labels, max doses, or clinician orders — educational arithmetic only.",
    ],
    {
      question: "Can I dose my child with this?",
      answer:
        "No. Pediatric dosing requires a clinician and product label. This tool only multiplies the numbers you enter.",
    },
    "Pediatric Dosage Calculator — mg/kg Educational Math",
    "Compute teaching mg/dose and daily totals from weight and mg/kg. Not a prescription or medical advice.",
    ["pediatric dosage calculator", "mg per kg kids", "pediatric dose educational"],
    "sparkTrendDemo",
  ),
  "medical-baby-weight-gain-calculator": article(
    "medical-baby-weight-gain-calculator",
    "Infant weight gain rates",
    [
      "Subtracts birth weight from current weight and divides by age in days for average g/day.",
      "Growth concerns need clinical evaluation — this is simple arithmetic for education.",
    ],
    {
      question: "What gain rate is normal?",
      answer:
        "Targets vary by age and feeding. Use clinician guidance and growth charts; this tool only reports your entered math.",
    },
    "Baby Weight Gain Calculator — kg Gain and g/day",
    "Estimate infant weight gain and average g/day from birth and current weights. Educational only.",
    ["baby weight gain calculator", "infant g per day", "newborn weight gain educational"],
    "none",
  ),
  "medical-head-circumference-calculator": article(
    "medical-head-circumference-calculator",
    "HC z-score vs reference",
    [
      "Computes z = (HC − mean) / SD using the reference mean and SD you provide in cm.",
      "Use official growth charts clinically — this is a teaching z-score formula only.",
    ],
    {
      question: "Which mean and SD should I use?",
      answer:
        "Values from the growth standard you are studying (e.g., WHO/CDC tables for age/sex). This host does not look them up.",
    },
    "Head Circumference Calculator — Z-Score Teaching Tool",
    "Compute head-circumference z-score from measured HC and reference mean/SD. Not medical advice.",
    ["head circumference calculator", "HC z-score", "pediatric head growth educational"],
    "sparkTrendDemo",
  ),
};
