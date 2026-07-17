import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/physics-magnetism";
const HUB_LABEL = "Education · Physics · Magnetism";
const SHELL =
  "SI units, educational textbook models only. Ideal wire/charge formulas — not electromagnetic design software.";

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
        title: "Magnetism tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Wire force", "F = I L B sinθ"],
          ["Wire field", "B = μ₀ I / (2π r)"],
          ["Lorentz", "F = q v B sinθ"],
          ["Induced EMF", "ε = B ℓ v (motional)"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your SI inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Field / force demo",
            caption: "Share URL preserves your SI inputs.",
            sparkValues: [0.2, 0.38, 0.52, 0.68, 0.84, 0.98],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const PHYSICS_MAGNETISM_ARTICLES: Record<string, RichArticle> = {
  "magnetic-force-calculator": article(
    "magnetic-force-calculator",
    "Magnetic force on a wire",
    [
      "Computes F = I L B sinθ for a straight wire in a uniform magnetic field.",
      "Angle is between current direction and B; 90° gives maximum force.",
    ],
    {
      question: "What unit is B?",
      answer: "Tesla (T). Earth’s field is ~10⁻⁴–10⁻⁵ T — lab magnets are larger.",
    },
    "Magnetic Force Calculator — Wire in B Field",
    "Calculate magnetic force on a current-carrying wire (F = ILB sinθ).",
    ["magnetic force calculator", "ILB sinθ", "force on wire"],
    "sparkTrendDemo",
  ),
  "magnetic-field-calculator": article(
    "magnetic-field-calculator",
    "Magnetic field of a wire",
    [
      "Uses B = μ₀ I / (2π r) for the field around a long straight wire.",
      "Distance r is the perpendicular distance from the wire axis.",
    ],
    {
      question: "Is μ₀ included?",
      answer: "Yes — the vacuum permeability constant is built into the formula.",
    },
    "Magnetic Field Calculator — Straight Wire",
    "Estimate B-field from current and distance for a long straight wire.",
    ["magnetic field calculator", "B field wire", "μ0 I / 2πr"],
    "none",
  ),
  "lorentz-force-calculator": article(
    "lorentz-force-calculator",
    "Lorentz force",
    [
      "Computes magnetic force magnitude F = |q| v B sinθ on a moving charge.",
      "Enter charge in coulombs (e.g. 1.6e-19 for an electron magnitude).",
    ],
    {
      question: "Does this include electric fields?",
      answer: "No — this host uses the magnetic part F = q v B sinθ only.",
    },
    "Lorentz Force Calculator — qvB",
    "Calculate Lorentz magnetic force on a charge moving in a B field.",
    ["lorentz force calculator", "qvB sinθ", "force on charge"],
    "sparkTrendDemo",
  ),
  "induced-emf-calculator": article(
    "induced-emf-calculator",
    "Induced EMF (motional)",
    [
      "Primary mode uses motional EMF ε = B ℓ v for a rod moving in uniform B.",
      "Textbook Faraday flux form (N ΔΦ/Δt) is available via config.mode = flux.",
    ],
    {
      question: "When is motional EMF used?",
      answer: "When a conductor of length ℓ moves at speed v perpendicular to B in the simple rail model.",
    },
    "Induced EMF Calculator — Motional ε = Bℓv",
    "Calculate motional induced EMF from magnetic field, length, and speed.",
    ["induced emf calculator", "motional emf", "Bℓv calculator"],
    "none",
  ),
};
