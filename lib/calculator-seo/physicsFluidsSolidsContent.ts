import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/physics-fluids-solids";
const HUB_LABEL = "Education · Physics · Fluids & Solids";
const SHELL =
  "SI units, educational textbook models only. Runs in your browser — not a lab instrument substitute.";

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
        title: "Fluids & solids tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Density", "ρ = m / V"],
          ["Pressure", "P = F / A"],
          ["Hydrostatic", "P = ρ g h"],
          ["Buoyancy", "Fᵦ = ρ V g"],
          ["Pascal", "F/A equal in fluid"],
          ["Bernoulli ΔP", "Steady incompressible flow"],
          ["Flow rate", "Q = A v"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your SI inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Pressure vs depth idea",
            caption: "Share URL preserves your SI inputs.",
            sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const PHYSICS_FLUIDS_SOLIDS_ARTICLES: Record<string, RichArticle> = {
  "density-calculator-physics": article(
    "density-calculator-physics",
    "Density calculator",
    [
      "Computes mass density ρ = m / V in kilograms per cubic metre.",
      "Use consistent SI units so textbook problems match lab estimates.",
    ],
    {
      question: "What if volume is in litres?",
      answer: "Convert to m³ first (1 L = 0.001 m³) before entering volume.",
    },
    "Density Calculator — Physics (ρ = m/V)",
    "Calculate density from mass and volume in SI units for physics problems.",
    ["density calculator physics", "mass volume density", "ρ = m/V"],
    "sparkTrendDemo",
  ),
  "pressure-calculator-physics": article(
    "pressure-calculator-physics",
    "Pressure calculator",
    [
      "Finds average pressure P = F / A when force is spread over an area.",
      "Result is in pascals (N/m²) for introductory mechanics and fluids.",
    ],
    {
      question: "Is this absolute or gauge pressure?",
      answer: "It is the simple force/area ratio — not atmospheric gauge conversion.",
    },
    "Pressure Calculator — Physics (P = F/A)",
    "Compute pressure from force and area in pascals for physics homework.",
    ["pressure calculator physics", "force over area", "pascals calculator"],
    "none",
  ),
  "hydrostatic-pressure-calculator": article(
    "hydrostatic-pressure-calculator",
    "Hydrostatic pressure",
    [
      "Uses P = ρ g h with standard g ≈ 9.80665 m/s² for depth in a fluid.",
      "Ideal for water-column and diving textbook examples (incompressible fluid).",
    ],
    {
      question: "Does this include atmospheric pressure?",
      answer: "No — it returns the gauge contribution from the fluid column only.",
    },
    "Hydrostatic Pressure Calculator — ρgh",
    "Calculate hydrostatic pressure from fluid density and depth (SI).",
    ["hydrostatic pressure calculator", "ρgh calculator", "fluid depth pressure"],
    "sparkTrendDemo",
  ),
  "buoyant-force-calculator": article(
    "buoyant-force-calculator",
    "Buoyant force",
    [
      "Applies Archimedes’ principle: Fᵦ = ρ_fluid × V_displaced × g.",
      "Enter the density of the surrounding fluid and the submerged volume.",
    ],
    {
      question: "Is the object density needed?",
      answer: "Not for buoyant force alone — only fluid density and displaced volume.",
    },
    "Buoyant Force Calculator — Archimedes",
    "Estimate buoyant force from fluid density and displaced volume.",
    ["buoyant force calculator", "archimedes principle", "displaced volume"],
    "none",
  ),
  "pascals-law-calculator": article(
    "pascals-law-calculator",
    "Pascal’s law",
    [
      "Solves hydraulic press relations where F₁/A₁ = F₂/A₂.",
      "Enter any three of F1, A1, F2, A2 and leave the unknown blank.",
    ],
    {
      question: "How many blanks are allowed?",
      answer: "Leave exactly one value blank so the fourth unknown can be solved.",
    },
    "Pascal’s Law Calculator — Hydraulic Force",
    "Solve Pascal’s law for force or area in a simple hydraulic system.",
    ["pascals law calculator", "hydraulic press calculator", "F/A equal"],
    "sparkTrendDemo",
  ),
  "bernoulli-equation-calculator": article(
    "bernoulli-equation-calculator",
    "Bernoulli ΔP",
    [
      "Estimates pressure difference between two points from density, speeds, and heights.",
      "Assumes steady, incompressible flow along a streamline (textbook idealization).",
    ],
    {
      question: "What does a positive ΔP mean?",
      answer: "Positive means P1 > P2 under the simplified Bernoulli rearrangement used here.",
    },
    "Bernoulli Equation Calculator — ΔP",
    "Compute simplified Bernoulli pressure difference between two flow points.",
    ["bernoulli equation calculator", "fluid flow pressure difference", "bernoulli ΔP"],
    "none",
  ),
  "flow-rate-calculator": article(
    "flow-rate-calculator",
    "Flow rate",
    [
      "Computes volumetric flow rate Q = A v for uniform cross-section speed.",
      "Useful for pipe continuity estimates when density is constant.",
    ],
    {
      question: "Is this mass flow rate?",
      answer: "No — this returns volume per second (m³/s). Multiply by density for mass flow.",
    },
    "Flow Rate Calculator — Q = A v",
    "Calculate volumetric flow rate from cross-sectional area and velocity.",
    ["flow rate calculator", "volume flow rate", "Q = Av"],
    "sparkTrendDemo",
  ),
};
