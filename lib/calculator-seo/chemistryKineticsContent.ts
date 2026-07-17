import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/chemistry-kinetics";
const HUB_LABEL = "Education · Science · Chemistry Kinetics";
const SHELL =
  "Educational chemical-kinetics arithmetic for classroom use. Simplified models only — not reactor design, safety certification, or process advice.";

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
        title: "Kinetics tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Reaction rate", "|Δ[A]/Δt|"],
          ["Rate constant", "1st / 2nd order k"],
          ["Half-life", "ln2/k or 1/(k[A]₀)"],
          ["Arrhenius", "k = A e^(−Ea/RT)"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your kinetics inputs. Educational models only.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Rate idea",
            caption: "Share URL preserves your kinetics inputs. Educational models only.",
            sparkValues: [1, 0.82, 0.67, 0.55, 0.45, 0.37],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CHEMISTRY_KINETICS_ARTICLES: Record<string, RichArticle> = {
  "reaction-rate-calculator": article(
    "reaction-rate-calculator",
    "Average reaction rate",
    [
      "Computes the magnitude of the average rate |([A]₂ − [A]₁) / (t₂ − t₁)|.",
      "Educational two-point estimate — not a differential rate law fit.",
    ],
    {
      question: "Does the sign matter?",
      answer: "This tool reports the absolute value so disappearing reactant still yields a positive rate.",
    },
    "Reaction Rate Calculator — Average |Δ[A]/Δt|",
    "Estimate average reaction rate from two concentration–time points for education.",
    ["reaction rate calculator", "average rate chemistry", "delta concentration time"],
    "sparkTrendDemo",
  ),
  "rate-constant-calculator": article(
    "rate-constant-calculator",
    "Rate constant k",
    [
      "First-order: k = ln([A]₀/[A])/t. Second-order: k = (1/[A] − 1/[A]₀)/t.",
      "Default order is 1. Enter 1 or 2 in the order field.",
    ],
    {
      question: "What is the default order?",
      answer: "Order defaults to 1 (first-order integrated rate law).",
    },
    "Rate Constant Calculator — First and Second Order",
    "Calculate first- or second-order rate constants from concentrations and time.",
    ["rate constant calculator", "first order k", "second order rate constant"],
    "none",
  ),
  "half-life-reaction-kinetics-calculator": article(
    "half-life-reaction-kinetics-calculator",
    "Reaction half-life",
    [
      "First-order: t½ = ln2 / k. Second-order: t½ = 1 / (k [A]₀).",
      "Default order is 1; second-order mode needs a positive initial concentration.",
    ],
    {
      question: "Is nuclear half-life the same?",
      answer: "Same ln2/λ idea for first-order decay, but nuclear tools live in the nuclear-chemistry family.",
    },
    "Half-Life Reaction Kinetics Calculator — t½ from k",
    "Compute first- or second-order reaction half-life from the rate constant.",
    ["half life kinetics calculator", "reaction half life", "t1/2 rate constant"],
    "sparkTrendDemo",
  ),
  "arrhenius-equation-calculator": article(
    "arrhenius-equation-calculator",
    "Arrhenius equation",
    [
      "Default mode forward: k = A e^(−Ea/RT) with Ea in J/mol and T in kelvin.",
      "Mode ea solves activation energy from two (T, k) pairs.",
    ],
    {
      question: "What is the default mode?",
      answer: 'Enter "forward" (default) for k from A, Ea, T, or "ea" to solve Ea from two points.',
    },
    "Arrhenius Equation Calculator — k or Ea",
    "Compute Arrhenius rate constant or activation energy for educational kinetics.",
    ["arrhenius calculator", "activation energy calculator", "A e^(-Ea/RT)"],
    "none",
  ),
};
