import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/chemistry-equilibrium";
const HUB_LABEL = "Education · Science · Chemistry Equilibrium";
const SHELL =
  "Educational chemical-equilibrium arithmetic for classroom use. Simplified models only — not process control or lab method validation.";

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
        title: "Equilibrium tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Kc / Kp", "Kc = prod/react; Kp = Kc(RT)^Δn"],
          ["Q", "Q vs K shift direction"],
          ["ICE", "Solve x for ab or a2b"],
          ["Le Chatelier", "Keyword stress → shift"],
          ["Ksp", "fromS / fromKsp for AB, AB₂, A₂B"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your equilibrium inputs. Educational models only.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Approach to equilibrium",
            caption: "Share URL preserves your equilibrium inputs. Educational models only.",
            sparkValues: [0.1, 0.35, 0.55, 0.7, 0.82, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CHEMISTRY_EQUILIBRIUM_ARTICLES: Record<string, RichArticle> = {
  "equilibrium-constant-kc-kp-calculator": article(
    "equilibrium-constant-kc-kp-calculator",
    "Equilibrium constants Kc and Kp",
    [
      "Kc = (products quotient) / (reactants quotient) from concentration product fields you enter.",
      "If both Δn and T (K) are given, also Kp = Kc (RT)^Δn with R in L·atm/(mol·K).",
    ],
    {
      question: "What are the product/reactant fields?",
      answer: "Precomputed concentration products (e.g. [C]^c[D]^d) — the tool divides them to get Kc.",
    },
    "Equilibrium Constant Calculator — Kc and Kp",
    "Calculate Kc from concentration quotients and optional Kp from Δn and temperature.",
    ["equilibrium constant calculator", "Kc Kp calculator", "Kp = Kc(RT)^Δn"],
    "sparkTrendDemo",
  ),
  "reaction-quotient-q-calculator": article(
    "reaction-quotient-q-calculator",
    "Reaction quotient Q",
    [
      "Q uses the same products/reactants quotient form as Kc, but at any snapshot of concentrations.",
      "Optionally enter K to compare Q and K for net forward, reverse, or equilibrium.",
    ],
    {
      question: "What if Q = K?",
      answer: "The system is at equilibrium — no net shift in either direction.",
    },
    "Reaction Quotient Q Calculator — Compare Q and K",
    "Compute Q from concentration quotients and optionally compare Q to K for shift direction.",
    ["reaction quotient calculator", "Q vs K", "equilibrium shift Q"],
    "none",
  ),
  "ice-table-calculator": article(
    "ice-table-calculator",
    "Simple ICE table solve",
    [
      "Solves extent x from K and initial C₀ for A ⇌ B+C (mode ab) or A ⇌ 2B (mode a2b).",
      "Uses the exact quadratic form K = x²/(C₀−x) or K = 4x²/(C₀−x).",
    ],
    {
      question: "When does the solve fail?",
      answer: "If there is no physical root in (0, C₀) for the given K and C₀ pair.",
    },
    "ICE Table Calculator — Solve x from K and C0",
    "Solve ICE extent x for simple ab and a2b equilibria from K and initial concentration.",
    ["ice table calculator", "equilibrium x solve", "Kc ICE chemistry"],
    "sparkTrendDemo",
  ),
  "le-chatelier-prediction-tool": article(
    "le-chatelier-prediction-tool",
    "Le Chatelier qualitative shifts",
    [
      "Enter a stress keyword such as heatforward, heatreverse, pressure, product, reactant, or catalyst.",
      "Returns a teaching prediction — not a numerical equilibrium recalculation.",
    ],
    {
      question: "Does catalyst change K?",
      answer: "No — a catalyst speeds both directions; K is unchanged in this teaching model.",
    },
    "Le Chatelier Prediction Tool — Stress Keyword Shifts",
    "Predict qualitative equilibrium shifts from common Le Chatelier stress keywords.",
    ["le chatelier calculator", "equilibrium shift prediction", "pressure heat product stress"],
    "none",
  ),
  "solubility-product-ksp-calculator": article(
    "solubility-product-ksp-calculator",
    "Solubility product Ksp",
    [
      "mode fromS: AB → Ksp = s²; AB₂ or A₂B → Ksp = 4s³. mode fromKsp solves s from Ksp.",
      "Set type ab, ab2, or a2b and enter solubility s or Ksp in the value field.",
    ],
    {
      question: "Are activity corrections included?",
      answer: "No — this is an ideal dilute teaching model without ionic-strength corrections.",
    },
    "Solubility Product Ksp Calculator — from s or Ksp",
    "Convert between molar solubility and Ksp for AB, AB₂, and A₂B salts.",
    ["ksp calculator", "solubility product calculator", "molar solubility from ksp"],
    "sparkTrendDemo",
  ),
};
