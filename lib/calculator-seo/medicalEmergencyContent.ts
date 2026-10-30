import type { RichArticle } from "./types";

const HUB_HREF = "/health/medical/emergency-critical-care";
const HUB_LABEL = "Health · Medical · Emergency & Critical Care";
const SHELL =
  "Educational emergency and critical-care arithmetic only. Not medical advice, triage, resuscitation protocols, or bedside decision support. Call emergency services for acute illness.";

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
        title: "Emergency & critical-care tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["APGAR", "Five components 0–2"],
          ["Shock index", "HR ÷ SBP"],
          ["Oxygenation index", "(FIO₂ × MAP × 100) / PaO₂"],
          ["Trauma score", "Three coded categories 0–4"],
          ["NEWS", "Seven component scores 0–3"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your emergency-score inputs. Training math only — not for bedside care.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Acuity awareness",
            caption:
              "Share URL preserves your emergency-score inputs. Training math only — not for bedside care.",
            sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MEDICAL_EMERGENCY_ARTICLES: Record<string, RichArticle> = {
  "medical-apgar-score-calculator": article(
    "medical-apgar-score-calculator",
    "APGAR components",
    [
      "Enter five integers 0–2 (Appearance, Pulse, Grimace, Activity, Respiration) as CSV.",
      "Teaching bands only — newborn assessment and resuscitation follow clinical protocols, not this calculator.",
    ],
    {
      question: "When is APGAR measured?",
      answer:
        "Typically at 1 and 5 minutes of life (and later if needed). This tool only sums the five component scores you enter.",
    },
    "APGAR Score Calculator — Five Component Teaching Sum",
    "Sum five APGAR components (0–2 each) for educational newborn scoring. Not medical advice.",
    ["APGAR calculator", "APGAR score", "newborn APGAR educational"],
    "sparkTrendDemo",
  ),
  "medical-shock-index-calculator": article(
    "medical-shock-index-calculator",
    "Shock index",
    [
      "Shock index = heart rate ÷ systolic blood pressure. Teaching bands illustrate lower/intermediate/elevated ranges.",
      "Not a substitute for clinical shock assessment, monitoring, or emergency treatment.",
    ],
    {
      question: "What units should I use?",
      answer:
        "Use bpm for heart rate and mmHg for systolic BP so the ratio is dimensionless and comparable to teaching cutoffs.",
    },
    "Shock Index Calculator — HR ÷ SBP",
    "Compute shock index from heart rate and systolic BP for educational use. Not medical advice.",
    ["shock index calculator", "HR SBP ratio", "shock index educational"],
    "none",
  ),
  "medical-oxygenation-index-calculator": article(
    "medical-oxygenation-index-calculator",
    "Oxygenation index",
    [
      "OI = (FIO₂ × MAP × 100) / PaO₂ with FIO₂ as a fraction between 0 and 1.",
      "Teaching severity bands only — ventilator management requires critical-care clinicians.",
    ],
    {
      question: "Is FIO₂ entered as a percent?",
      answer: "No — enter FIO₂ as a fraction (e.g. 0.4 for 40% oxygen), then MAP and PaO₂ as positive values.",
    },
    "Oxygenation Index Calculator — FIO₂ MAP PaO₂",
    "Calculate oxygenation index from FIO₂, MAP, and PaO₂ for teaching. Not medical advice.",
    ["oxygenation index calculator", "OI calculator", "FIO2 MAP PaO2"],
    "sparkTrendDemo",
  ),
  "medical-trauma-score-calculator": article(
    "medical-trauma-score-calculator",
    "Coded trauma score",
    [
      "Enter three coded category values (GCS, SBP, RR style codes 0–4) as CSV; the tool sums them.",
      "Simplified teaching form — not a full Revised Trauma Score workflow or triage protocol.",
    ],
    {
      question: "Where do the 0–4 codes come from?",
      answer:
        "Code GCS, SBP, and RR categories using your course or trauma table first, then enter the three integers here.",
    },
    "Trauma Score Calculator — Coded GCS/SBP/RR Sum",
    "Sum three coded trauma categories (0–4) for educational acuity teaching. Not medical advice.",
    ["trauma score calculator", "revised trauma score teaching", "GCS SBP RR score"],
    "none",
  ),
  "medical-news-score-calculator": article(
    "medical-news-score-calculator",
    "NEWS aggregate",
    [
      "Enter seven NEWS-style vital-sign component scores (0–3 each) as CSV and sum for a teaching band.",
      "Not NEWS2 charting, escalation policy, or ward triage — educational vital-sign math only.",
    ],
    {
      question: "Does this include oxygen or AVPU coding?",
      answer:
        "You must code each component yourself using your NEWS chart, then paste seven integers. The host only sums them.",
    },
    "NEWS Score Calculator — Seven Component Sum",
    "Sum seven NEWS component scores (0–3) for educational early-warning teaching. Not medical advice.",
    ["NEWS score calculator", "NEWS2 educational", "early warning score"],
    "sparkTrendDemo",
  ),
};
