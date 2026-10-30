import type { RichArticle } from "./types";

const HUB_HREF = "/health/medical/heart-cardiovascular";
const HUB_LABEL = "Health · Medical · Heart & Cardiovascular";
const SHELL =
  "Educational cardiovascular math in your browser only. Not medical advice, diagnosis, emergency care, or treatment decisions. Seek urgent care for chest pain or stroke signs; verify risk tools with clinicians.";

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
        title: "Heart & cardiovascular tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Max HR", "220 − age"],
          ["Target HR", "Karvonen reserve zones"],
          ["BP category", "ACC/AHA-style teaching bands"],
          ["MAP", "DBP + (SBP−DBP)/3"],
          ["Pulse pressure", "SBP − DBP"],
          ["Cardiac output", "HR × SV / 1000"],
          ["ASCVD / Framingham", "Simplified teaching tallies"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your cardiovascular inputs. Educational teaching models only — not for clinical decisions.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Heart metric awareness",
            caption:
              "Share URL preserves your cardiovascular inputs. Educational teaching models only — not for clinical decisions.",
            sparkValues: [0.2, 0.35, 0.5, 0.6, 0.75, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MEDICAL_HEART_ARTICLES: Record<string, RichArticle> = {
  "medical-heart-rate-calculator": article(
    "medical-heart-rate-calculator",
    "Maximum heart rate estimate",
    [
      "Teaching estimate: max HR ≈ 220 − age. Individual max HR varies widely.",
      "Not for diagnosing arrhythmias or clearing exercise without clinician input.",
    ],
    {
      question: "Is 220 − age accurate?",
      answer:
        "It is a rough classroom rule. Measured max HR and clinician guidance are more reliable for training plans.",
    },
    "Heart Rate Calculator — Max HR 220 Minus Age",
    "Estimate maximum heart rate with the 220−age teaching rule. Not medical advice.",
    ["heart rate calculator", "max heart rate", "220 minus age"],
    "sparkTrendDemo",
  ),
  "medical-target-heart-rate-calculator": article(
    "medical-target-heart-rate-calculator",
    "Karvonen target zones",
    [
      "Uses age and resting HR to estimate a reserve-based training zone (default 50–85%).",
      "Educational exercise literacy — not a cardiac rehab prescription.",
    ],
    {
      question: "Can I change the intensity fractions?",
      answer:
        "Yes — optional low/high fractions default to 0.5 and 0.85. Follow clinician or coach guidance for real training.",
    },
    "Target Heart Rate Calculator — Karvonen Zones",
    "Estimate Karvonen target heart-rate zones from age and resting HR. Not medical advice.",
    ["target heart rate calculator", "Karvonen formula", "training heart rate"],
    "none",
  ),
  "medical-blood-pressure-category-calculator": article(
    "medical-blood-pressure-category-calculator",
    "Blood pressure teaching bands",
    [
      "Maps systolic and diastolic values to ACC/AHA-style educational categories.",
      "Home readings need proper technique; diagnosis and treatment require a clinician.",
    ],
    {
      question: "Is one reading enough to diagnose hypertension?",
      answer:
        "No. Diagnosis uses repeated measurements and clinical context. This tool only labels the pair you enter.",
    },
    "Blood Pressure Category Calculator — Teaching Bands",
    "Classify BP readings into ACC/AHA-style teaching bands. Not medical advice.",
    ["blood pressure category calculator", "BP category", "hypertension bands educational"],
    "sparkTrendDemo",
  ),
  "medical-map-calculator": article(
    "medical-map-calculator",
    "Mean arterial pressure",
    [
      "MAP ≈ diastolic + (systolic − diastolic) / 3 from cuff-style inputs.",
      "Critical-care MAP targets are clinical decisions — not determined by this tool.",
    ],
    {
      question: "Is this the same as invasive MAP?",
      answer:
        "No. This is a simple teaching approximation from systolic and diastolic numbers you provide.",
    },
    "MAP Calculator — Mean Arterial Pressure",
    "Estimate mean arterial pressure from systolic and diastolic BP. Not medical advice.",
    ["MAP calculator", "mean arterial pressure", "MAP educational"],
    "none",
  ),
  "medical-pulse-pressure-calculator": article(
    "medical-pulse-pressure-calculator",
    "Pulse pressure",
    [
      "Pulse pressure = systolic − diastolic. Wide or narrow values need clinical interpretation.",
      "Educational arithmetic only — not a vascular diagnosis.",
    ],
    {
      question: "What is a normal pulse pressure?",
      answer:
        "Common teaching examples cite roughly 40 mmHg, but interpretation depends on context. See a clinician for personal meaning.",
    },
    "Pulse Pressure Calculator — SBP Minus DBP",
    "Compute pulse pressure from systolic and diastolic BP. Educational only — not medical advice.",
    ["pulse pressure calculator", "SBP DBP difference", "pulse pressure educational"],
    "sparkTrendDemo",
  ),
  "medical-cardiac-output-calculator": article(
    "medical-cardiac-output-calculator",
    "Cardiac output from HR × SV",
    [
      "CO (L/min) = heart rate × stroke volume (mL) / 1000.",
      "Stroke volume is rarely known outside clinical measurement — teaching physiology only.",
    ],
    {
      question: "Where do I get stroke volume?",
      answer:
        "Typically from clinical imaging or estimates in coursework. This host only multiplies the values you enter.",
    },
    "Cardiac Output Calculator — HR × Stroke Volume",
    "Estimate cardiac output from heart rate and stroke volume. Not medical advice.",
    ["cardiac output calculator", "CO calculator", "stroke volume HR"],
    "none",
  ),
  "medical-ascvd-risk-calculator": article(
    "medical-ascvd-risk-calculator",
    "ASCVD-style teaching tally",
    [
      "Simplified classroom points from age, cholesterol, HDL, SBP, and binary smoke/diabetes/treated-BP flags.",
      "Not the ACC/AHA Pooled Cohort Equations and not for treatment decisions.",
    ],
    {
      question: "Is this the official ASCVD risk calculator?",
      answer:
        "No. It is a simplified teaching tally for literacy demos. Use validated clinical tools with a clinician.",
    },
    "ASCVD Risk Calculator — Educational Points Tally",
    "Simplified ASCVD-style risk-factor points for teaching. Not the PCE — not medical advice.",
    ["ASCVD risk calculator", "ASCVD educational", "cardiovascular risk points"],
    "sparkTrendDemo",
  ),
  "medical-framingham-risk-score-calculator": article(
    "medical-framingham-risk-score-calculator",
    "Framingham-style teaching tally",
    [
      "Simplified Framingham-like points from age, lipids, SBP, and smoking flag.",
      "Not a validated Framingham equation — classroom comparison only.",
    ],
    {
      question: "Can I use this score for statin decisions?",
      answer:
        "No. Treatment decisions require validated risk tools and clinician judgment, not this teaching tally.",
    },
    "Framingham Risk Score Calculator — Teaching Points",
    "Simplified Framingham-style risk points for education. Not a validated score — not medical advice.",
    ["Framingham risk calculator", "Framingham score educational", "CVD risk points"],
    "none",
  ),
};
