import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/chemistry-stoichiometry";
const HUB_LABEL = "Education · Science · Chemistry Stoichiometry";
const SHELL =
  "Classroom chemistry with consistent mole units. Educational models only — not lab certification or process control.";

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
        title: "Stoichiometry tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Stoichiometry", "Mole ratio from coefficients"],
          ["Limiting reagent", "Smallest moles/coeff extent"],
          ["Theoretical yield", "Product mass from limiting"],
          ["Percent / actual yield", "Efficiency of reaction"],
          ["Reaction ratio", "A:B mole ratio"],
          ["Balance coeffs", "Reduce CSV to integers"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your stoichiometry inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Yield trend idea",
            caption: "Share URL preserves your stoichiometry inputs.",
            sparkValues: [0.2, 0.35, 0.5, 0.62, 0.78, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CHEMISTRY_STOICHIOMETRY_ARTICLES: Record<string, RichArticle> = {
  "stoichiometry-calculator": article(
    "stoichiometry-calculator",
    "Stoichiometry calculator",
    [
      "Converts reactant moles to product moles using the balanced equation ratio coeff_product / coeff_reactant.",
      "Keep coefficients from a balanced equation so textbook mole maps match homework keys.",
    ],
    {
      question: "Do I need molar masses?",
      answer: "Not for mole-to-mole stoichiometry — only moles and coefficients. Use the theoretical yield tool for grams.",
    },
    "Stoichiometry Calculator — Mole Ratios",
    "Calculate product moles from reactant moles and equation coefficients.",
    ["stoichiometry calculator", "mole ratio calculator", "chemistry moles"],
    "sparkTrendDemo",
  ),
  "limiting-reagent-calculator": article(
    "limiting-reagent-calculator",
    "Limiting reagent",
    [
      "Compares reaction extents (moles ÷ coefficient) for two reactants and reports which runs out first.",
      "Equal extents mean both reactants are present in stoichiometric proportions.",
    ],
    {
      question: "What is extent?",
      answer: "Extent is moles divided by the stoichiometric coefficient — the smaller extent limits the reaction.",
    },
    "Limiting Reagent Calculator — Chemistry",
    "Find the limiting reactant from moles and coefficients of two reagents.",
    ["limiting reagent calculator", "limiting reactant", "stoichiometry limiting"],
    "none",
  ),
  "theoretical-yield-calculator": article(
    "theoretical-yield-calculator",
    "Theoretical yield",
    [
      "Finds maximum product moles from limiting-reactant moles, then multiplies by product molar mass for grams.",
      "Assumes complete conversion with no side reactions — an ideal classroom upper bound.",
    ],
    {
      question: "Is this percent yield?",
      answer: "No — this is the 100% theoretical mass. Compare to actual mass with the percent yield calculator.",
    },
    "Theoretical Yield Calculator — Chemistry",
    "Compute theoretical product mass from limiting moles and molar mass.",
    ["theoretical yield calculator", "product mass stoichiometry", "limiting moles"],
    "sparkTrendDemo",
  ),
  "percent-yield-calculator": article(
    "percent-yield-calculator",
    "Percent yield",
    [
      "Computes % yield = (actual / theoretical) × 100 for the same mass or mole units.",
      "Values above 100% usually mean measurement error or an inconsistent theoretical basis.",
    ],
    {
      question: "Can units differ?",
      answer: "No — actual and theoretical must use the same unit (both grams or both moles).",
    },
    "Percent Yield Calculator — Chemistry",
    "Calculate percent yield from actual and theoretical amounts.",
    ["percent yield calculator", "actual vs theoretical yield", "reaction efficiency"],
    "none",
  ),
  "actual-yield-calculator": article(
    "actual-yield-calculator",
    "Actual yield",
    [
      "Back-calculates actual amount from a known percent yield and theoretical amount.",
      "Useful when a lab report gives % yield but you need the recovered mass or moles.",
    ],
    {
      question: "Is percent entered as 85 or 0.85?",
      answer: "Enter 85 for 85% — the tool divides by 100 internally.",
    },
    "Actual Yield Calculator — Chemistry",
    "Find actual yield from percent yield and theoretical amount.",
    ["actual yield calculator", "percent yield to actual", "chemistry yield"],
    "sparkTrendDemo",
  ),
  "reaction-ratio-calculator": article(
    "reaction-ratio-calculator",
    "Reaction ratio",
    [
      "Reports the mole ratio A/B and a simplified integer ratio for comparing measured amounts.",
      "Helpful for checking whether experimental moles match a balanced equation.",
    ],
    {
      question: "Why is the simplified ratio scaled?",
      answer: "Inputs are scaled to integers before reducing by GCD so decimal mole amounts still simplify cleanly.",
    },
    "Reaction Ratio Calculator — Mole Ratio",
    "Simplify the mole ratio between two substances in a reaction mixture.",
    ["reaction ratio calculator", "mole ratio A:B", "chemistry ratio"],
    "none",
  ),
  "balanced-equation-calculator-auto-balancer": article(
    "balanced-equation-calculator-auto-balancer",
    "Balance coefficients",
    [
      "Reduces a comma-separated list of positive coefficients to the smallest integer set (GCD helper).",
      "This is not a full formula balancer — paste already-found coefficients to tidy them for homework.",
    ],
    {
      question: "Can I enter chemical formulas?",
      answer: "No — enter numeric coefficients only (e.g. 2,1,2). Formula balancing is a separate step.",
    },
    "Balanced Equation Coefficient Reducer",
    "Reduce stoich coefficients to the smallest integers from a CSV list.",
    ["balance coefficients calculator", "stoichiometry gcd", "equation coefficients"],
    "sparkTrendDemo",
  ),
};
