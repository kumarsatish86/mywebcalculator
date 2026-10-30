import type { RichArticle } from "./types";

const HUB_HREF = "/health/medical/diabetes-glucose";
const HUB_LABEL = "Health · Medical · Diabetes & Glucose";
const SHELL =
  "Educational glucose and insulin arithmetic in your browser only. Not medical advice, diagnosis, or a substitute for prescribed insulin protocols. Never change insulin without your clinician.";

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
        title: "Diabetes & glucose tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Unit converter", "mg/dL ↔ mmol/L (×/÷ 18)"],
          ["HbA1c from eAG", "(eAG + 46.7) / 28.7"],
          ["eAG from A1c", "28.7 × A1c − 46.7"],
          ["Insulin dose", "Correction + carb bolus"],
          ["ISF", "Rule-of-1800 / TDD"],
          ["Carb coverage", "Carbs ÷ I:C"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your glucose inputs. Educational math only — never replace prescribed insulin protocols.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Glucose literacy",
            caption:
              "Share URL preserves your glucose inputs. Educational math only — never replace prescribed insulin protocols.",
            sparkValues: [0.3, 0.45, 0.55, 0.65, 0.8, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MEDICAL_DIABETES_ARTICLES: Record<string, RichArticle> = {
  "medical-blood-sugar-converter-mgdl-mmol": article(
    "medical-blood-sugar-converter-mgdl-mmol",
    "Glucose unit conversion",
    [
      "Convert between mg/dL and mmol/L using factor 18. Set from unit to mgdl or mmol.",
      "Conversion only — not interpretation of whether a reading is safe for you.",
    ],
    {
      question: "Which unit should I use?",
      answer:
        "Use the unit your meter or lab reports. Enter that as the from unit so both results display correctly.",
    },
    "Blood Sugar Converter — mg/dL ↔ mmol/L",
    "Convert glucose between mg/dL and mmol/L. Educational only — not medical advice.",
    ["blood sugar converter", "mg/dL to mmol/L", "glucose unit converter"],
    "sparkTrendDemo",
  ),
  "medical-hba1c-calculator": article(
    "medical-hba1c-calculator",
    "HbA1c from estimated average glucose",
    [
      "NGSP teaching relation: A1c = (eAG_mg/dL + 46.7) / 28.7.",
      "Lab HbA1c remains the clinical reference; this is reverse literacy math from eAG.",
    ],
    {
      question: "Is this the same as a lab A1c?",
      answer:
        "No. It estimates A1c from an eAG value using a common teaching equation. Use lab results for care decisions.",
    },
    "HbA1c Calculator — From eAG (Educational)",
    "Estimate HbA1c % from eAG mg/dL. Educational only — not medical advice.",
    ["HbA1c calculator", "A1c from eAG", "hemoglobin A1c educational"],
    "none",
  ),
  "medical-eag-calculator": article(
    "medical-eag-calculator",
    "Estimated average glucose from A1c",
    [
      "eAG mg/dL = 28.7 × A1c − 46.7, also shown in mmol/L.",
      "Helps relate A1c to average glucose for literacy — not a substitute for SMBG/CGM plans.",
    ],
    {
      question: "Why does eAG differ from my meter average?",
      answer:
        "Equations estimate population average glucose from A1c. Individual meter/CGM averages can differ.",
    },
    "eAG Calculator — Estimated Average Glucose from A1c",
    "Convert HbA1c to estimated average glucose (mg/dL and mmol/L). Not medical advice.",
    ["eAG calculator", "estimated average glucose", "A1c to eAG"],
    "sparkTrendDemo",
  ),
  "medical-insulin-dose-calculator": article(
    "medical-insulin-dose-calculator",
    "Correction + carb bolus (teaching)",
    [
      "Teaching bolus = correction ((current − target) / ISF, floored at 0) + carbs / I:C.",
      "Never replace your prescribed insulin protocol. Confirm every dose with your care plan.",
    ],
    {
      question: "Can I bolus from this calculator alone?",
      answer:
        "No. Insulin dosing requires your clinician’s ratios, active insulin rules, illness factors, and safety checks.",
    },
    "Insulin Dose Calculator — Educational Bolus Math",
    "Practice correction + carb bolus arithmetic. Not a prescription — not medical advice.",
    ["insulin dose calculator", "correction bolus", "carb bolus educational"],
    "none",
  ),
  "medical-insulin-sensitivity-factor-calculator": article(
    "medical-insulin-sensitivity-factor-calculator",
    "Rule-of-1800 ISF estimate",
    [
      "ISF ≈ rule / total daily dose (default rule 1800) as mg/dL drop per unit.",
      "Starting heuristic only — personal ISF must be clinician-guided and tested safely.",
    ],
    {
      question: "Should I change my ISF based on this?",
      answer:
        "No. Use this for classroom understanding. Adjustments belong with your diabetes care team.",
    },
    "Insulin Sensitivity Factor Calculator — Rule of 1800",
    "Estimate ISF from TDD with the rule-of-1800 teaching method. Not medical advice.",
    ["insulin sensitivity factor calculator", "rule of 1800", "ISF calculator"],
    "sparkTrendDemo",
  ),
  "medical-carbohydrate-coverage-calculator": article(
    "medical-carbohydrate-coverage-calculator",
    "Carb coverage units",
    [
      "Units = carbohydrates (g) ÷ insulin-to-carb ratio.",
      "Does not include correction insulin, active insulin, or illness adjustments.",
    ],
    {
      question: "What is an I:C ratio?",
      answer:
        "Grams of carbohydrate covered by one unit of insulin, set by your clinician. This tool only divides carbs by that ratio.",
    },
    "Carbohydrate Coverage Calculator — Carbs ÷ I:C",
    "Estimate carb-coverage insulin units from carbs and I:C ratio. Not medical advice.",
    ["carbohydrate coverage calculator", "I:C ratio calculator", "carb bolus units"],
    "none",
  ),
};
