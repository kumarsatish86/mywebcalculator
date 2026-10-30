import type { RichArticle } from "./types";

const HUB_HREF = "/health/medical/neurology-mental-health";
const HUB_LABEL = "Health · Medical · Neurology & Mental Health";
const SHELL =
  "Educational neurology and mental-health screening math only. Not medical advice, diagnosis, therapy, or stroke care. Seek emergency care for acute stroke symptoms; consult clinicians for concerning scores.";

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
        title: "Neurology & mental-health tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["GCS", "Eye + Verbal + Motor"],
          ["PHQ-9", "Nine items 0–3 or total"],
          ["GAD-7", "Seven items 0–3 or total"],
          ["Stroke risk points", "Age + binary risk flags"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your neurology inputs. Screening/teaching math only — not diagnosis.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Screening awareness",
            caption:
              "Share URL preserves your neurology inputs. Screening/teaching math only — not diagnosis.",
            sparkValues: [0.2, 0.35, 0.5, 0.6, 0.75, 0.85],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MEDICAL_NEUROLOGY_ARTICLES: Record<string, RichArticle> = {
  "medical-glasgow-coma-scale-calculator": article(
    "medical-glasgow-coma-scale-calculator",
    "Glasgow Coma Scale",
    [
      "GCS = Eye opening (1–4) + Verbal (1–5) + Motor (1–6). Enter the three integer components.",
      "Teaching mild/moderate/severe bands only — not a substitute for neurological examination or emergency care.",
    ],
    {
      question: "What if the patient is intubated?",
      answer:
        "Clinical GCS documentation may annotate verbal scores differently. This educational tool only adds the three integers you enter.",
    },
    "Glasgow Coma Scale Calculator — E + V + M",
    "Calculate GCS from eye, verbal, and motor scores for educational use. Not medical advice.",
    ["GCS calculator", "Glasgow Coma Scale", "eye verbal motor score"],
    "sparkTrendDemo",
  ),
  "medical-phq-9-depression-score-calculator": article(
    "medical-phq-9-depression-score-calculator",
    "PHQ-9 screening sum",
    [
      "Enter nine item scores 0–3 as CSV, or one total from 0–27. Teaching severity bands are for literacy only.",
      "Not a depression diagnosis or treatment plan — discuss concerning scores with a qualified clinician or crisis service.",
    ],
    {
      question: "Is a high PHQ-9 an emergency?",
      answer:
        "Any thoughts of self-harm or crisis need immediate professional help. This calculator does not assess safety or replace clinical care.",
    },
    "PHQ-9 Depression Score Calculator — Educational Screening",
    "Sum PHQ-9 items or a total score for educational screening bands. Not medical advice.",
    ["PHQ-9 calculator", "depression score calculator", "PHQ9 educational"],
    "none",
  ),
  "medical-gad-7-anxiety-score-calculator": article(
    "medical-gad-7-anxiety-score-calculator",
    "GAD-7 screening sum",
    [
      "Enter seven item scores 0–3 as CSV, or one total from 0–21. Teaching bands illustrate common cutoffs.",
      "Not an anxiety diagnosis — clinical evaluation is required for personal mental-health care.",
    ],
    {
      question: "How often should GAD-7 be repeated?",
      answer:
        "Clinicians decide monitoring intervals. This tool only totals the scores you enter for educational practice.",
    },
    "GAD-7 Anxiety Score Calculator — Educational Screening",
    "Sum GAD-7 items or a total score for educational anxiety screening bands. Not medical advice.",
    ["GAD-7 calculator", "anxiety score calculator", "GAD7 educational"],
    "sparkTrendDemo",
  ),
  "medical-stroke-risk-calculator": article(
    "medical-stroke-risk-calculator",
    "Simplified stroke risk points",
    [
      "Awareness tally from age plus binary flags for hypertension, diabetes, smoking, AFib, and prior stroke.",
      "Not CHA₂DS₂-VASc or any validated stroke model — educational relative points only. Call emergency services for stroke symptoms.",
    ],
    {
      question: "Is this the same as CHA₂DS₂-VASc?",
      answer:
        "No. Use the dedicated CHA₂DS₂-VASc calculator for that teaching tally. This tool is a separate simplified awareness score.",
    },
    "Stroke Risk Calculator — Simplified Teaching Points",
    "Estimate simplified relative stroke-risk points from age and binary flags. Not medical advice.",
    ["stroke risk calculator", "stroke risk points educational", "AFib stroke awareness"],
    "none",
  ),
};
