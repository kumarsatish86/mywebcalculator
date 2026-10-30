import type { RichArticle } from "./types";

const HUB_HREF = "/health/medical/clinical-risk-scores";
const HUB_LABEL = "Health · Medical · Clinical Risk Scores";
const SHELL =
  "Educational clinical-score arithmetic in your browser only. Not medical advice, diagnosis, triage, anticoagulation decisions, transplant listing, or emergency care. Verify current guidelines with qualified clinicians.";

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
        title: "Clinical risk score tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["CHA₂DS₂-VASc", "Binary risk flags (age≥75 / stroke = 2)"],
          ["Wells DVT/PE", "Mode pe|dvt + flags CSV"],
          ["MELD", "Bilirubin, INR, creatinine"],
          ["SOFA", "Six organ scores 0–4"],
          ["Child–Pugh", "Five components 1–3"],
          ["CURB-65", "Five binary pneumonia criteria"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your score inputs. Educational teaching models only — not for clinical decisions.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Score awareness",
            caption:
              "Share URL preserves your score inputs. Educational teaching models only — not for clinical decisions.",
            sparkValues: [0.15, 0.3, 0.45, 0.6, 0.75, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MEDICAL_CLINICAL_RISK_ARTICLES: Record<string, RichArticle> = {
  "medical-cha2ds2-vasc-score-calculator": article(
    "medical-cha2ds2-vasc-score-calculator",
    "CHA₂DS₂-VASc teaching tally",
    [
      "Enter binary 0/1 flags for CHF, hypertension, age≥75, diabetes, prior stroke/TIA, vascular disease, age 65–74, and female sex.",
      "Age≥75 and prior stroke/TIA contribute 2 points each. Use either age≥75 or age 65–74, not both. Not medical advice — anticoagulation decisions require a clinician.",
    ],
    {
      question: "Can I use this score to start anticoagulation?",
      answer:
        "No. This is an educational tally only. Treatment decisions depend on full clinical context, bleeding risk, and current guidelines reviewed with a clinician.",
    },
    "CHA2DS2-VASc Score Calculator — Educational Stroke Risk Flags",
    "Tally CHA₂DS₂-VASc teaching points from binary risk flags. Educational only — not medical advice.",
    ["CHA2DS2-VASc calculator", "stroke risk score", "atrial fibrillation score educational"],
    "sparkTrendDemo",
  ),
  "medical-wells-score-dvt-pe-calculator": article(
    "medical-wells-score-dvt-pe-calculator",
    "Wells score (DVT/PE)",
    [
      "Set mode to pe (7 weighted 0/1 flags) or dvt (3–12 binary items) and enter flags as CSV.",
      "Simplified teaching forms only — not a substitute for clinical probability assessment or diagnostic pathways.",
    ],
    {
      question: "Which Wells version is this?",
      answer:
        "A simplified educational PE (classic 7-item weights) or DVT-style binary sum. Local protocols and validated charts may differ.",
    },
    "Wells Score Calculator — DVT / PE Educational Tool",
    "Compute simplified Wells PE or DVT teaching scores from binary flags. Not medical advice.",
    ["Wells score calculator", "DVT Wells score", "PE Wells score educational"],
    "none",
  ),
  "medical-meld-score-calculator": article(
    "medical-meld-score-calculator",
    "Original MELD (teaching)",
    [
      "Uses bilirubin, INR, and creatinine with common teaching floors/caps (creatinine capped at 4; mins at 1).",
      "Original MELD form without sodium — not for transplant listing or care decisions.",
    ],
    {
      question: "Is this MELD-Na?",
      answer:
        "No. This educational tool uses the original bilirubin/INR/creatinine form and is not for listing or clinical decisions.",
    },
    "MELD Score Calculator — Educational Liver Severity Math",
    "Estimate original MELD from bilirubin, INR, and creatinine for teaching. Not medical advice.",
    ["MELD calculator", "MELD score educational", "bilirubin INR creatinine"],
    "sparkTrendDemo",
  ),
  "medical-sofa-score-calculator": article(
    "medical-sofa-score-calculator",
    "SOFA organ sum",
    [
      "Enter six organ scores (0–4 each) as CSV. The tool sums components and shows a teaching acuity band.",
      "Not for ICU triage, sepsis protocols, or bedside decisions — educational physiology math only.",
    ],
    {
      question: "Do I need exact organ tables?",
      answer:
        "Yes in real care — this host only sums the six integers you already coded. It does not interpret labs or vasopressors.",
    },
    "SOFA Score Calculator — Six Organ Components",
    "Sum six SOFA organ scores (0–4) for educational critical-care teaching. Not medical advice.",
    ["SOFA score calculator", "SOFA educational", "organ failure score"],
    "none",
  ),
  "medical-child-pugh-score-calculator": article(
    "medical-child-pugh-score-calculator",
    "Child–Pugh class",
    [
      "Enter five component scores (1–3 each) as CSV. Total maps to teaching class A/B/C bands.",
      "Not for cirrhosis staging or procedure risk decisions without clinician oversight.",
    ],
    {
      question: "What are the five components?",
      answer:
        "Typically bilirubin, albumin, INR/PT, ascites, and encephalopathy — each coded 1–3 per your local table before entering here.",
    },
    "Child-Pugh Score Calculator — Class A/B/C Teaching",
    "Sum five Child–Pugh components (1–3) and map to class A/B/C for education. Not medical advice.",
    ["Child-Pugh calculator", "Child Pugh class", "cirrhosis score educational"],
    "sparkTrendDemo",
  ),
  "medical-curb-65-score-calculator": article(
    "medical-curb-65-score-calculator",
    "CURB-65 criteria",
    [
      "Enter five binary criteria: confusion, urea, respiratory rate, blood pressure, and age≥65.",
      "Teaching severity bands only — pneumonia disposition and treatment require clinical judgment.",
    ],
    {
      question: "What thresholds define each criterion?",
      answer:
        "Use your course or guideline thresholds first, then enter 0 or 1. This tool only sums the five flags.",
    },
    "CURB-65 Score Calculator — Pneumonia Severity Teaching",
    "Tally CURB-65 binary criteria for educational pneumonia severity bands. Not medical advice.",
    ["CURB-65 calculator", "pneumonia severity score", "CURB65 educational"],
    "none",
  ),
};
