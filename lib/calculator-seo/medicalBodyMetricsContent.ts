import type { RichArticle } from "./types";

const HUB_HREF = "/health/medical/medical-body-metrics";
const HUB_LABEL = "Health · Medical · Body Metrics";
const SHELL =
  "Educational anthropometric estimators in your browser only. Not medical advice, diagnosis, dosing, nutrition prescriptions, or fitness programming. Verify with qualified clinicians.";

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
        title: "Body metrics tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["BMI", "kg / m² with teaching bands"],
          ["BMR", "Mifflin–St Jeor"],
          ["Body fat %", "US Navy circumferences"],
          ["IBW", "Devine formula"],
          ["LBM", "Boer formula"],
          ["WHR", "Waist ÷ hip"],
          ["BSA", "Mosteller"],
          ["AjBW", "IBW + 0.4×(TBW−IBW)"],
          ["FFMI", "FFM / height²"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves weight, height, and related inputs. Educational anthropometrics only — not medical advice.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Metric awareness",
            caption:
              "Share URL preserves weight, height, and related inputs. Educational anthropometrics only — not medical advice.",
            sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MEDICAL_BODY_METRICS_ARTICLES: Record<string, RichArticle> = {
  "medical-bmi-calculator": article(
    "medical-bmi-calculator",
    "BMI teaching estimate",
    [
      "Enter weight (kg) and height (cm). BMI = weight / height(m)² with simple WHO-style bands.",
      "BMI does not measure body fat or health risk for individuals. Educational only — not medical advice.",
    ],
    {
      question: "Is BMI a diagnosis?",
      answer:
        "No. BMI is a population screening index. Clinical assessment needs more context from a qualified clinician.",
    },
    "BMI Calculator — Body Mass Index Educational Tool",
    "Compute BMI from weight and height with teaching bands. Educational only — not medical advice.",
    ["BMI calculator", "body mass index", "BMI educational"],
    "sparkTrendDemo",
  ),
  "medical-bmr-calculator": article(
    "medical-bmr-calculator",
    "Mifflin–St Jeor BMR",
    [
      "Estimate resting calories from weight, height, age, and sex (male|female) using Mifflin–St Jeor.",
      "Not a prescription for calorie targets or medical nutrition therapy.",
    ],
    {
      question: "Which BMR formula is used?",
      answer:
        "Mifflin–St Jeor teaching form. Other equations exist; clinicians may prefer measured REE or different models.",
    },
    "BMR Calculator — Mifflin-St Jeor Educational Estimate",
    "Estimate basal metabolic rate from weight, height, age, and sex. Not medical advice.",
    ["BMR calculator", "Mifflin St Jeor", "basal metabolic rate"],
    "none",
  ),
  "medical-body-fat-percentage-calculator": article(
    "medical-body-fat-percentage-calculator",
    "US Navy body-fat %",
    [
      "Uses height, waist, neck, and (for female) hip circumferences in centimeters.",
      "Circumference formulas can misclassify; not a DXA or clinical body-composition assessment.",
    ],
    {
      question: "Why is hip required for female?",
      answer:
        "The US Navy female equation includes hip circumference. Male formula uses waist and neck only.",
    },
    "Body Fat Percentage Calculator — US Navy Method",
    "Estimate body-fat % from Navy circumference formulas. Educational only — not medical advice.",
    ["body fat calculator", "US Navy body fat", "body fat percentage"],
    "sparkTrendDemo",
  ),
  "medical-ideal-body-weight-calculator": article(
    "medical-ideal-body-weight-calculator",
    "Devine ideal body weight",
    [
      "Devine IBW from height (≥152 cm) and sex. Common in dosing teaching contexts.",
      "IBW is not a personal weight goal and must not replace clinical judgment.",
    ],
    {
      question: "Can I use IBW as my goal weight?",
      answer:
        "No. Ideal body weight formulas are teaching/dosing constructs, not personalized targets. Ask a clinician for goals.",
    },
    "Ideal Body Weight Calculator — Devine Formula",
    "Estimate Devine ideal body weight from height and sex. Educational only — not medical advice.",
    ["ideal body weight calculator", "Devine IBW", "IBW calculator"],
    "none",
  ),
  "medical-lean-body-mass-calculator": article(
    "medical-lean-body-mass-calculator",
    "Boer lean body mass",
    [
      "Boer LBM from weight, height, and sex — an estimate of non-fat mass.",
      "Not a substitute for measured body composition or clinical assessment.",
    ],
    {
      question: "Is Boer the only LBM formula?",
      answer:
        "No. Several equations exist. This host uses Boer for classroom anthropometrics only.",
    },
    "Lean Body Mass Calculator — Boer Formula",
    "Estimate lean body mass with the Boer equation. Educational only — not medical advice.",
    ["lean body mass calculator", "Boer LBM", "LBM calculator"],
    "sparkTrendDemo",
  ),
  "medical-waist-to-hip-ratio-calculator": article(
    "medical-waist-to-hip-ratio-calculator",
    "Waist-to-hip ratio",
    [
      "WHR = waist ÷ hip with simple teaching bands. Measure consistently at the same landmarks.",
      "Bands are educational — cutoffs vary by sex, ethnicity, and guideline source.",
    ],
    {
      question: "Where should I measure waist and hip?",
      answer:
        "Use a consistent protocol (e.g., narrowest waist or umbilicus level; widest hip). This tool only divides the numbers you enter.",
    },
    "Waist-to-Hip Ratio Calculator — Educational WHR",
    "Compute waist-to-hip ratio with teaching bands. Not medical advice.",
    ["waist to hip ratio calculator", "WHR calculator", "waist hip ratio"],
    "none",
  ),
  "medical-bsa-calculator": article(
    "medical-bsa-calculator",
    "Mosteller body surface area",
    [
      "Mosteller BSA (m²) = √(height_cm × weight_kg / 3600).",
      "BSA is used in many dosing contexts — never override a prescribed regimen with this estimate.",
    ],
    {
      question: "Is Mosteller the same as Du Bois?",
      answer:
        "No. Different BSA equations exist. This educational tool uses Mosteller only.",
    },
    "BSA Calculator — Mosteller Body Surface Area",
    "Estimate Mosteller BSA from height and weight. Educational only — not medical advice.",
    ["BSA calculator", "Mosteller BSA", "body surface area"],
    "sparkTrendDemo",
  ),
  "medical-adjusted-body-weight-calculator": article(
    "medical-adjusted-body-weight-calculator",
    "Adjusted body weight",
    [
      "AjBW = IBW + 0.4 × (TBW − IBW) using Devine IBW from height and sex.",
      "Common in nutrition/dosing teaching — not a universal clinical rule and not medical advice.",
    ],
    {
      question: "When is adjusted body weight used?",
      answer:
        "Often in educational dosing/nutrition examples for people above IBW. Local protocols differ — clinicians decide.",
    },
    "Adjusted Body Weight Calculator — AjBW Teaching Tool",
    "Estimate adjusted body weight from TBW and Devine IBW. Not medical advice.",
    ["adjusted body weight calculator", "AjBW calculator", "IBW adjusted weight"],
    "none",
  ),
  "medical-ffmi-calculator": article(
    "medical-ffmi-calculator",
    "Fat-free mass index",
    [
      "FFMI = fat-free mass (kg) / height(m)², with FFM from weight and body-fat %.",
      "Body-fat % accuracy limits FFMI quality. Educational fitness literacy only.",
    ],
    {
      question: "Do I need a lab body-fat measurement?",
      answer:
        "Any consistent body-fat estimate can be entered for teaching math. Clinical body composition needs professional methods.",
    },
    "FFMI Calculator — Fat-Free Mass Index",
    "Compute FFMI from weight, height, and body-fat %. Educational only — not medical advice.",
    ["FFMI calculator", "fat free mass index", "FFMI educational"],
    "sparkTrendDemo",
  ),
};
