import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/physics-gravitation";
const HUB_LABEL = "Education · Physics · Gravitation";
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
        title: "Gravitation tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Gravitational force", "G m₁ m₂ / r²"],
          ["Escape velocity", "√(2GM/R)"],
          ["Orbital velocity", "√(GM/R)"],
          ["Surface PE", "m g h"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your SI inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Gravity scale demo",
            caption: "Share URL preserves your SI inputs.",
            sparkValues: [1, 0.7, 0.5, 0.35, 0.25, 0.15],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const PHYSICS_GRAVITATION_ARTICLES: Record<string, RichArticle> = {
  "gravitational-force-calculator": article(
    "gravitational-force-calculator",
    "Gravitational force",
    [
      "Applies Newton’s law F = G m₁ m₂ / r² with G = 6.6743×10⁻¹¹ N·m²/kg².",
      "Separation r is centre-to-centre distance for spherical masses.",
    ],
    {
      question: "Are Earth defaults required?",
      answer: "No — enter any two masses and separation in kilograms and metres.",
    },
    "Gravitational Force Calculator — Newton’s Law",
    "Calculate gravitational attraction between two masses in SI units.",
    ["gravitational force calculator", "Newton gravity", "G m1 m2 / r2"],
    "sparkTrendDemo",
  ),
  "escape-velocity-calculator": article(
    "escape-velocity-calculator",
    "Escape velocity",
    [
      "Surface escape speed v_esc = √(2 G M / R) ignoring atmosphere and rotation.",
      "Enter central mass and radius of the spherical body.",
    ],
    {
      question: "Is this the speed to reach orbit?",
      answer: "No — escape speed leaves to infinity; circular orbit is lower (√(GM/R)).",
    },
    "Escape Velocity Calculator — √(2GM/R)",
    "Compute escape velocity from central mass and radius.",
    ["escape velocity calculator", "escape speed", "2GM/R"],
    "none",
  ),
  "orbital-velocity-calculator": article(
    "orbital-velocity-calculator",
    "Orbital velocity",
    [
      "Circular-orbit speed v_orb = √(G M / R) about a fixed central mass.",
      "R is the orbit radius from the centre, not altitude alone.",
    ],
    {
      question: "How do I use altitude?",
      answer: "Add planetary radius to altitude to get the orbit radius R.",
    },
    "Orbital Velocity Calculator — √(GM/R)",
    "Calculate circular orbital velocity from mass and orbit radius.",
    ["orbital velocity calculator", "circular orbit speed", "GM/R"],
    "sparkTrendDemo",
  ),
  "gravitational-potential-energy-calculator": article(
    "gravitational-potential-energy-calculator",
    "Gravitational potential energy",
    [
      "Near-surface model U ≈ m g h with g ≈ 9.80665 m/s².",
      "Choose a zero of potential at your reference height.",
    ],
    {
      question: "Is this the orbital −GMm/r form?",
      answer: "This host uses the surface mgh mode; orbital PE is available in the library API.",
    },
    "Gravitational Potential Energy Calculator — mgh",
    "Estimate near-surface gravitational PE from mass and height.",
    ["gravitational potential energy", "mgh calculator", "GPE physics"],
    "none",
  ),
};
