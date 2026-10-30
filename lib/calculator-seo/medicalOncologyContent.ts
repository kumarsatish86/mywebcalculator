import type { RichArticle } from "./types";

const HUB_HREF = "/health/medical/oncology-risk";
const HUB_LABEL = "Health · Medical · Oncology & Risk";
const SHELL =
  "Educational oncology-adjacent arithmetic for learning only — not cancer screening, diagnosis, prognosis, or chemotherapy prescribing. Always defer care and dosing to oncology teams and pharmacists.";

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
        title: "Oncology teaching tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Cancer risk (basic)", "Age + binary lifestyle index"],
          ["Tumor growth", "V = V₀ × 2^(t/Td)"],
          ["Chemo dosage", "mg/m² × Mosteller BSA"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your oncology teaching inputs. Not medical advice — defer to oncology teams.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Oncology metrics idea",
            caption:
              "Share URL preserves your oncology teaching inputs. Not medical advice — defer to oncology teams.",
            sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MEDICAL_ONCOLOGY_ARTICLES: Record<string, RichArticle> = {
  "medical-cancer-risk-calculator-basic": article(
    "medical-cancer-risk-calculator-basic",
    "Cancer risk index (basic)",
    [
      "A simplified relative index from age and binary flags (smoke, family history, obesity) for classroom awareness.",
      "Not a validated risk model, screening tool, or medical advice — discuss personal risk with clinicians.",
    ],
    {
      question: "Is this like a clinical cancer risk score?",
      answer:
        "No. It is awareness arithmetic only and must not replace validated models or professional screening guidance.",
    },
    "Cancer Risk Calculator (Basic) — Educational Index",
    "Explore a basic relative cancer-risk teaching index from age and lifestyle flags — not medical advice.",
    ["cancer risk calculator", "basic cancer risk index", "oncology risk teaching"],
    "sparkTrendDemo",
  ),
  "medical-tumor-growth-calculator": article(
    "medical-tumor-growth-calculator",
    "Tumor growth (doubling model)",
    [
      "Idealized exponential growth: volume = V₀ × 2^(t / doubling time).",
      "Real tumors are heterogeneous — educational model only, not prognosis or treatment planning.",
    ],
    {
      question: "Can doubling time predict outcomes?",
      answer:
        "Not with this toy model. Clinical imaging, histology, and oncology judgment determine real care paths.",
    },
    "Tumor Growth Calculator — Doubling Time Model",
    "Estimate idealized tumor volume from doubling time for educational oncology math — not prognosis.",
    ["tumor growth calculator", "tumor doubling time", "oncology volume model"],
    "none",
  ),
  "medical-chemotherapy-dosage-calculator": article(
    "medical-chemotherapy-dosage-calculator",
    "Chemotherapy dosage (BSA)",
    [
      "Teaching dose = mg/m² × Mosteller BSA from weight and height.",
      "Never overrides protocol, pharmacy verification, or oncology prescribing — educational arithmetic only.",
    ],
    {
      question: "Is this safe for real chemo dosing?",
      answer:
        "No. Actual doses require protocol, organ function, prior toxicity, and pharmacist/oncologist approval.",
    },
    "Chemotherapy Dosage Calculator — mg/m² × BSA",
    "Compute teaching BSA-based chemo dose with Mosteller formula — not a prescribing tool.",
    ["chemotherapy dosage calculator", "BSA chemo dose", "Mosteller oncology"],
    "sparkTrendDemo",
  ),
};
