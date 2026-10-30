import type { RichArticle } from "./types";

const HUB_HREF = "/health/medical/orthopedic";
const HUB_LABEL = "Health · Medical · Orthopedic";
const SHELL =
  "Educational bone-health and ergonomics arithmetic for learning only — not a DXA report, licensed FRAX® result, diagnosis, fracture prediction, or treatment plan. Seek clinicians for imaging and care decisions.";

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
        title: "Orthopedic teaching tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Bone density", "T-score = (BMD − mean) / SD"],
          ["Fracture risk (FRAX-like)", "Age + 0/1 flags + T-score tally"],
          ["Ideal posture", "Desk/monitor height from stature"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption:
              "Share URL preserves your orthopedic inputs. Educational only — not FRAX® or medical advice.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Bone health idea",
            caption:
              "Share URL preserves your orthopedic inputs. Educational only — not FRAX® or medical advice.",
            sparkValues: [0.25, 0.4, 0.55, 0.65, 0.8, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MEDICAL_ORTHOPEDIC_ARTICLES: Record<string, RichArticle> = {
  "medical-bone-density-calculator": article(
    "medical-bone-density-calculator",
    "Bone density T-score",
    [
      "Teaching T-score = (measured BMD − young-adult mean) ÷ SD with WHO-style band labels.",
      "Not a DXA interpretation or diagnosis — educational BMD arithmetic only.",
    ],
    {
      question: "Do these bands diagnose osteoporosis?",
      answer:
        "No. Clinical diagnosis requires proper densitometry, history, and clinician judgment.",
    },
    "Bone Density Calculator — Educational T-score",
    "Compute a teaching T-score from BMD, young-adult mean, and SD — not a DXA report or diagnosis.",
    ["bone density calculator", "T-score calculator", "BMD teaching"],
    "sparkTrendDemo",
  ),
  "medical-fracture-risk-frax-calculator": article(
    "medical-fracture-risk-frax-calculator",
    "Fracture risk (FRAX-like teaching)",
    [
      "A simplified classroom tally from age, seven 0/1 clinical flags, and T-score — not the licensed FRAX® algorithm.",
      "Does not estimate absolute fracture probability or guide therapy. Defer fracture risk decisions to clinicians.",
    ],
    {
      question: "Is this the official FRAX® tool?",
      answer:
        "No. FRAX® is a licensed clinical instrument. This helper is a teaching risk-factor sum only.",
    },
    "Fracture Risk Calculator (FRAX-like) — Teaching Tally",
    "Explore a simplified fracture-risk factor tally with flags and T-score — not licensed FRAX® or medical advice.",
    ["fracture risk calculator", "FRAX teaching calculator", "osteoporosis risk flags"],
    "none",
  ),
  "medical-ideal-posture-calculator": article(
    "medical-ideal-posture-calculator",
    "Ideal posture desk heights",
    [
      "Starting desk and monitor height estimates from stature for ergonomics literacy.",
      "Adjust for comfort and professional guidance — not a medical prescription for posture disorders.",
    ],
    {
      question: "Will this fix back pain?",
      answer:
        "No. It offers starting height heuristics only. Persistent pain needs clinician or physiotherapist assessment.",
    },
    "Ideal Posture Calculator — Desk & Monitor Height",
    "Estimate starting desk and monitor heights from stature for educational ergonomics — not medical advice.",
    ["ideal posture calculator", "desk height calculator", "ergonomics stature"],
    "sparkTrendDemo",
  ),
};
