import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/physics-advanced-competitive";
const HUB_LABEL = "Education · Science · Physics Advanced";
const SHELL =
  "SI educational shell for electrostatics and circuit fundamentals. Idealized textbook models — not device design.";

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
        title: "Advanced physics tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Electric field", "E = k|q|/r²"],
          ["Electric potential", "V = kq/r"],
          ["Gauss’s law", "Φ_E = Q_enc/ε₀"],
          ["Capacitance", "C = Q/V"],
          ["Inductance", "L = Φ_B/I"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your SI advanced-physics inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Field / circuit idea",
            caption: "Share URL preserves your SI advanced-physics inputs.",
            sparkValues: [0.22, 0.38, 0.52, 0.68, 0.82, 0.96],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const PHYSICS_ADVANCED_ARTICLES: Record<string, RichArticle> = {
  "electric-field-calculator": article(
    "electric-field-calculator",
    "Electric field",
    [
      "Point-charge magnitude E = k |q| / r² with SI coulomb and metre inputs.",
      "Distance must be positive; charge may be signed (magnitude used in E).",
    ],
    {
      question: "Is the field a vector?",
      answer: "This tool returns magnitude. Direction is radially out from a positive source charge.",
    },
    "Electric Field Calculator — E = kq/r²",
    "Calculate point-charge electric field magnitude in N/C.",
    ["electric field calculator", "E = kq/r2", "point charge field"],
    "sparkTrendDemo",
  ),
  "electric-potential-calculator": article(
    "electric-potential-calculator",
    "Electric potential",
    [
      "Computes V = k q / r for a point charge relative to infinity.",
      "Signed charge yields signed potential; distance must be positive.",
    ],
    {
      question: "Zero of potential?",
      answer: "The textbook convention V(∞) = 0 is assumed.",
    },
    "Electric Potential Calculator — V = kq/r",
    "Calculate electric potential of a point charge in volts.",
    ["electric potential calculator", "V = kq/r", "point charge potential"],
    "none",
  ),
  "gauss-law-calculator": article(
    "gauss-law-calculator",
    "Gauss’s law",
    [
      "Finds total electric flux Φ_E = Q_enc / ε₀ through a closed surface.",
      "Enter enclosed charge in coulombs; result in N·m²/C.",
    ],
    {
      question: "Does shape matter?",
      answer: "For total flux through a closed surface, only the enclosed charge matters (Gauss’s law).",
    },
    "Gauss’s Law Calculator — Φ = Q/ε₀",
    "Calculate electric flux from enclosed charge using Gauss’s law.",
    ["gauss law calculator", "electric flux", "Q enc / epsilon0"],
    "sparkTrendDemo",
  ),
  "capacitance-calculator-advanced": article(
    "capacitance-calculator-advanced",
    "Capacitance (advanced)",
    [
      "Computes C = Q / V from stored charge and voltage.",
      "Voltage cannot be zero; capacitance comes out in farads.",
    ],
    {
      question: "How is this different from a basic capacitor tool?",
      answer: "Same definition C = Q/V — this advanced family slug pairs with competitive/electrostatics hubs.",
    },
    "Capacitance Calculator Advanced — C = Q/V",
    "Calculate capacitance from charge and voltage in SI units.",
    ["capacitance calculator advanced", "C = Q/V", "farad calculator"],
    "none",
  ),
  "inductance-calculator": article(
    "inductance-calculator",
    "Inductance",
    [
      "Uses the definition L = Φ_B / I (flux linkage over current).",
      "Current cannot be zero; inductance is reported in henries.",
    ],
    {
      question: "Is Φ_B total flux linkage?",
      answer: "Yes for this definition — enter NΦ if you already multiplied by turns.",
    },
    "Inductance Calculator — L = Φ/I",
    "Calculate inductance from magnetic flux and current.",
    ["inductance calculator", "L = flux/current", "henry calculator"],
    "sparkTrendDemo",
  ),
};
