import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/physics-optics";
const HUB_LABEL = "Education · Science · Physics Optics";
const SHELL =
  "SI educational shell for geometric optics. Textbook sign conventions — not optical-engineering design.";

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
        title: "Optics tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Snell’s law", "n₁ sin θ₁ = n₂ sin θ₂"],
          ["Refractive index", "n = c / v"],
          ["Mirror formula", "1/f = 1/v + 1/u"],
          ["Lens formula", "1/f = 1/v + 1/u"],
          ["Magnification", "m = −v / u"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your SI optics inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Ray geometry idea",
            caption: "Share URL preserves your SI optics inputs.",
            sparkValues: [0.18, 0.32, 0.48, 0.62, 0.78, 0.92],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const PHYSICS_OPTICS_ARTICLES: Record<string, RichArticle> = {
  "snells-law-calculator": article(
    "snells-law-calculator",
    "Snell’s law",
    [
      "Solves n₁ sin θ₁ = n₂ sin θ₂ for the missing angle in degrees.",
      "Enter both indices and leave exactly one angle blank.",
    ],
    {
      question: "What if there is no real angle?",
      answer: "That is the total-internal-reflection regime; the tool reports an error (and critical-angle hint when applicable).",
    },
    "Snell’s Law Calculator — Refraction Angles",
    "Solve Snell’s law for θ₁ or θ₂ with refractive indices n₁ and n₂.",
    ["snells law calculator", "refraction", "n1 sin theta1"],
    "sparkTrendDemo",
  ),
  "refractive-index-calculator": article(
    "refractive-index-calculator",
    "Refractive index",
    [
      "Computes n = c / v from the speed of light in the medium (SI m/s).",
      "Speed must be positive and cannot exceed c in vacuum.",
    ],
    {
      question: "Is this relative to air or vacuum?",
      answer: "This form uses vacuum speed c — standard for absolute refractive index.",
    },
    "Refractive Index Calculator — n = c/v",
    "Calculate refractive index from light speed in a medium.",
    ["refractive index calculator", "n = c/v", "speed of light medium"],
    "none",
  ),
  "mirror-formula-calculator": article(
    "mirror-formula-calculator",
    "Mirror formula",
    [
      "Solves 1/f = 1/v + 1/u for the missing focal length, object, or image distance.",
      "Leave exactly one of f, u, v blank; use Cartesian classroom sign convention.",
    ],
    {
      question: "Why can u be negative?",
      answer: "Under the Cartesian convention, real objects for mirrors often have negative object distance.",
    },
    "Mirror Formula Calculator — 1/f = 1/v + 1/u",
    "Solve the mirror equation for f, u, or v in SI/classroom units.",
    ["mirror formula calculator", "1/f = 1/v + 1/u", "spherical mirror"],
    "sparkTrendDemo",
  ),
  "lens-formula-calculator": article(
    "lens-formula-calculator",
    "Lens formula",
    [
      "Same thin-lens / Cartesian relation 1/f = 1/v + 1/u as the mirror tool.",
      "Enter any two of f, u, v and leave the third blank.",
    ],
    {
      question: "Does this include thick lenses?",
      answer: "No — it is the thin-lens idealization for homework problems.",
    },
    "Lens Formula Calculator — Thin Lens Equation",
    "Solve the thin-lens equation for focal length or distances.",
    ["lens formula calculator", "thin lens", "1/f = 1/v + 1/u"],
    "none",
  ),
  "magnification-calculator-optics": article(
    "magnification-calculator-optics",
    "Magnification (optics)",
    [
      "Computes lateral magnification m = −v / u from object and image distances.",
      "Negative m means an inverted image under the usual sign convention.",
    ],
    {
      question: "Can I use heights instead?",
      answer: "This page uses the from-UV mode (m = −v/u). Height-based m = hᵢ/hₒ is the same magnitude idea with different inputs.",
    },
    "Optics Magnification Calculator — m = −v/u",
    "Calculate optical magnification from object and image distances.",
    ["magnification calculator optics", "m = -v/u", "lateral magnification"],
    "sparkTrendDemo",
  ),
};
