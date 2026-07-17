import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/chemistry-ai-smart";
const HUB_LABEL = "Education · Science · Chemistry AI & Smart Tools";
const SHELL =
  "Rule-based classroom chemistry helpers — not a live AI model. Safety notes are generic reminders only; always read the Safety Data Sheet (SDS) for your exact chemical. Educational use only.";

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
    vertical: "education-math",
    category: "education",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "AI & smart chemistry tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Equation balancer", "Reduce coefficient CSV"],
          ["Reaction predictor", "Preset teaching patterns"],
          ["Lab solution prep", "m = M × V × MM"],
          ["Safety advisor", "Keyword SDS reminders"],
          ["Compound structure", "Formula → atom counts"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your inputs. Rule-based helpers — not live AI. Check SDS for safety.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Reaction helper idea",
            caption: "Share URL preserves your inputs. Rule-based helpers — not live AI. Check SDS for safety.",
            sparkValues: [0.25, 0.4, 0.55, 0.7, 0.85, 1],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CHEMISTRY_AI_SMART_ARTICLES: Record<string, RichArticle> = {
  "chemical-equation-balancer-ai": article(
    "chemical-equation-balancer-ai",
    "Equation coefficient reducer",
    [
      "Reduces a CSV of positive coefficients to a smallest integer-like set via GCD scaling.",
      "Rule-based helper — not a live AI model. Verify atom balance yourself.",
    ],
    {
      question: "Does this balance atoms automatically?",
      answer: "No — it only reduces coefficients you supply. You must check elemental balance.",
    },
    "Chemical Equation Balancer (AI) — Rule-Based Coefficient Reducer",
    "Reduce equation coefficients with a rule-based helper — not a live AI model.",
    ["chemical equation balancer", "coefficient reducer", "stoichiometry helper"],
    "sparkTrendDemo",
  ),
  "reaction-predictor-chemistry": article(
    "reaction-predictor-chemistry",
    "Reaction predictor",
    [
      "Matches a few teaching presets (e.g. H2+O2, Na+Cl2, acid–base) to short product descriptions.",
      "Not a live AI predictor — unknown queries return a limited-coverage message.",
    ],
    {
      question: "Can it predict any reaction?",
      answer: "No — only a handful of classroom presets are covered. It is not a live AI model.",
    },
    "Reaction Predictor — Educational Preset Patterns",
    "Explore a few teaching reaction patterns with a rule-based helper — not live AI.",
    ["reaction predictor chemistry", "teaching reaction patterns", "chemistry AI education"],
    "none",
  ),
  "lab-solution-preparation-calculator": article(
    "lab-solution-preparation-calculator",
    "Lab solution preparation",
    [
      "Solute mass = molarity × volume (L) × molar mass.",
      "Classroom prep arithmetic — not a live AI tool and not a substitute for lab SOPs.",
    ],
    {
      question: "Does this include purity or hydration water?",
      answer: "No — enter an effective molar mass that already accounts for those corrections if needed.",
    },
    "Lab Solution Preparation Calculator — M × V × MM",
    "Calculate solute mass for solution prep from M, V, and molar mass — educational use.",
    ["lab solution preparation", "molarity mass calculator", "solution prep education"],
    "sparkTrendDemo",
  ),
  "chemical-safety-advisor": article(
    "chemical-safety-advisor",
    "Chemical safety advisor",
    [
      "Keyword reminders for classes like acid, base, solvent, and oxidizer.",
      "Not a live AI advisor and not a substitute for the Safety Data Sheet (SDS) of your exact reagent.",
    ],
    {
      question: "Is this enough for lab safety?",
      answer: "No — always read the SDS and follow your institution’s safety procedures.",
    },
    "Chemical Safety Advisor — Keyword SDS Reminders",
    "Get generic hazard-class reminders — always check the SDS; not a live AI advisor.",
    ["chemical safety advisor", "SDS reminder", "lab hazard keyword"],
    "none",
  ),
  "compound-structure-generator": article(
    "compound-structure-generator",
    "Compound formula atoms",
    [
      "Parses a simple molecular formula (e.g. H2O, C6H12O6) into element atom counts.",
      "Rule-based formula parser — not a live AI structure generator and not 3D modeling.",
    ],
    {
      question: "Does it handle parentheses or hydrates?",
      answer: "Only simple Element+count patterns are supported in this educational parser.",
    },
    "Compound Structure Generator — Formula Atom Counts",
    "Parse simple chemical formulas into atom counts with a rule-based helper — not live AI.",
    ["compound structure generator", "formula atom count", "molecular formula parser"],
    "sparkTrendDemo",
  ),
};
