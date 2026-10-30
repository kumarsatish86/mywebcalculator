import type { RichArticle } from "./types";

const HUB_HREF = "/health/medical/lab-values-clinical";
const HUB_LABEL = "Health · Medical · Lab Values & Clinical Chemistry";
const SHELL =
  "Educational lab-chemistry arithmetic in your browser only. Not medical advice, diagnosis, electrolyte protocols, or emergency care. Verify units and formulas with qualified clinicians and your laboratory.";

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
        title: "Lab value tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Hb altitude", "Hb × (1 + 0.03 × km)"],
          ["Serum osm", "2×Na + glu/18 + BUN/2.8"],
          ["Albumin AG", "AG + 2.5 × (4 − alb)"],
          ["Na correction", "1.6 × hyperglycemia factor"],
          ["K deficit", "(ΔK) × 0.4 × weight"],
          ["Ca correction", "Payne albumin adjust"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your lab inputs. Educational teaching models only — not for clinical decisions.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Lab awareness",
            caption:
              "Share URL preserves your lab inputs. Educational teaching models only — not for clinical decisions.",
            sparkValues: [0.25, 0.4, 0.55, 0.65, 0.8, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MEDICAL_LAB_VALUES_ARTICLES: Record<string, RichArticle> = {
  "medical-hemoglobin-correction-calculator": article(
    "medical-hemoglobin-correction-calculator",
    "Illustrative altitude Hb scaling",
    [
      "Applies Hb_corr ≈ Hb × (1 + 0.03 × altitude_km) as a simple teaching scale.",
      "Not a WHO anemia cut-off table or altitude medicine protocol — educational only.",
    ],
    {
      question: "Is this an official WHO correction?",
      answer:
        "No. It is an illustrative scaling for study. Use published tables and clinician guidance for real cut-offs.",
    },
    "Hemoglobin Correction Calculator — Altitude Teaching Scale",
    "Illustrative hemoglobin altitude correction for education. Not medical advice or WHO cut-offs.",
    ["hemoglobin correction calculator", "altitude hemoglobin", "Hb altitude educational"],
    "sparkTrendDemo",
  ),
  "medical-serum-osmolality-calculator": article(
    "medical-serum-osmolality-calculator",
    "Calculated serum osmolality",
    [
      "Uses 2×Na + glucose/18 + BUN/2.8 with glucose and BUN in mg/dL teaching units.",
      "Measured osm and osmolar gap interpretation require clinical labs — not this formula alone.",
    ],
    {
      question: "Can I use mmol/L glucose/BUN?",
      answer:
        "This educational form expects mg/dL for glucose and BUN. Convert units before entering.",
    },
    "Serum Osmolality Calculator — 2Na Glucose BUN Teaching",
    "Calculate teaching serum osmolality from Na, glucose, and BUN. Educational only — not medical advice.",
    ["serum osmolality calculator", "calculated osm", "Na glucose BUN educational"],
    "none",
  ),
  "medical-albumin-correction-calculator": article(
    "medical-albumin-correction-calculator",
    "Albumin-corrected anion gap",
    [
      "Corrects anion gap for low albumin: AG + 2.5 × (4 − albumin g/dL).",
      "Acid–base decisions need full electrolytes and clinical context — teaching correction only.",
    ],
    {
      question: "Is this calcium correction?",
      answer:
        "No. This slug uses albumin correction for anion gap (AG). Calcium correction is a separate calculator.",
    },
    "Albumin Correction Calculator — Anion Gap Teaching Adjust",
    "Correct anion gap for albumin with the 2.5×(4−alb) teaching formula. Not medical advice.",
    ["albumin correction calculator", "corrected anion gap", "hypoalbuminemia AG educational"],
    "sparkTrendDemo",
  ),
  "medical-sodium-correction-calculator": article(
    "medical-sodium-correction-calculator",
    "Sodium correction for hyperglycemia",
    [
      "Applies Na + 1.6 × ((glucose − 100) / 100) with glucose in mg/dL.",
      "Correction factors vary by source — this is one common teaching form, not a treatment protocol.",
    ],
    {
      question: "Why correct sodium for glucose?",
      answer:
        "Hyperglycemia can dilute measured sodium. Teaching formulas adjust Na for study; clinicians choose the factor and action.",
    },
    "Sodium Correction Calculator — Hyperglycemia Teaching Factor",
    "Estimate corrected sodium for hyperglycemia with a 1.6 factor teaching formula. Not medical advice.",
    ["sodium correction calculator", "corrected sodium hyperglycemia", "pseudohyponatremia educational"],
    "none",
  ),
  "medical-potassium-deficit-calculator": article(
    "medical-potassium-deficit-calculator",
    "Rough ECF potassium deficit",
    [
      "Uses (target − current) × 0.4 × weight_kg as a rough extracellular teaching estimate in mmol.",
      "Not a repletion protocol — potassium replacement requires monitoring and clinical orders.",
    ],
    {
      question: "Why must target exceed current?",
      answer:
        "This helper estimates a deficit only when target K is higher than current K. Other scenarios need different clinical tools.",
    },
    "Potassium Deficit Calculator — Teaching ECF Estimate",
    "Estimate a rough potassium deficit from current/target K and weight. Educational only — not a repletion protocol.",
    ["potassium deficit calculator", "K deficit mmol", "hypokalemia educational"],
    "sparkTrendDemo",
  ),
  "medical-calcium-correction-calculator": article(
    "medical-calcium-correction-calculator",
    "Payne corrected calcium",
    [
      "Corrected Ca = measured + 0.8 × (4 − albumin) using mg/dL and g/dL teaching units.",
      "Ionized calcium may be preferred clinically — educational albumin adjustment only.",
    ],
    {
      question: "Same as the drug-dosage calcium tool?",
      answer:
        "Yes in formula — both use the common Payne teaching adjustment. Always verify units and clinical need.",
    },
    "Calcium Correction Calculator — Albumin Payne Teaching",
    "Correct calcium for albumin with the Payne teaching formula. Educational only — not medical advice.",
    ["calcium correction calculator", "corrected calcium albumin", "Payne formula educational"],
    "none",
  ),
};
