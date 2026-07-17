import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/physics-dynamics";
const HUB_LABEL = "Education · Physics · Dynamics";
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
        title: "Dynamics tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["F = ma", "Newton II"],
          ["Net force", "ΣF (1D)"],
          ["Friction", "f = μN"],
          ["Centripetal", "mv²/r, v²/r"],
          ["Angular ω", "v/r"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your SI inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Force–motion demo",
            caption: "Share URL preserves your SI inputs.",
            sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const PHYSICS_DYNAMICS_ARTICLES: Record<string, RichArticle> = {
  "force-calculator-f-ma": article(
    "force-calculator-f-ma",
    "Force F = ma",
    [
      "Computes net force from mass and acceleration using Newton’s second law.",
      "Result is in newtons (kg·m/s²) for introductory dynamics.",
    ],
    {
      question: "Is this one force or net force?",
      answer: "F = ma relates the net force on the object to its acceleration.",
    },
    "Force Calculator — F = ma",
    "Calculate force from mass and acceleration in SI units.",
    ["force calculator", "F = ma", "newton second law"],
    "sparkTrendDemo",
  ),
  "mass-calculator-physics": article(
    "mass-calculator-physics",
    "Mass from force",
    [
      "Solves m = F / a when acceleration is nonzero.",
      "Use consistent SI force and acceleration for textbook problems.",
    ],
    {
      question: "Why can’t acceleration be zero?",
      answer: "Division by zero — with a = 0, mass is not determined by F alone.",
    },
    "Mass Calculator — Physics (F/a)",
    "Find mass from force and acceleration using m = F/a.",
    ["mass calculator physics", "m = F/a", "newton mass"],
    "none",
  ),
  "acceleration-from-force-calculator": article(
    "acceleration-from-force-calculator",
    "Acceleration from force",
    [
      "Computes a = F / m for a positive mass under a net force.",
      "Useful when you know force and inertia but not the resulting acceleration.",
    ],
    {
      question: "Can force be negative?",
      answer: "Yes — a signed force means acceleration opposite your positive axis.",
    },
    "Acceleration from Force Calculator — F/m",
    "Calculate acceleration from net force and mass (SI).",
    ["acceleration from force", "a = F/m", "dynamics calculator"],
    "sparkTrendDemo",
  ),
  "net-force-calculator": article(
    "net-force-calculator",
    "Net force",
    [
      "Sums signed 1D forces entered as a comma-separated list.",
      "Positive and negative values represent opposite directions on a line.",
    ],
    {
      question: "How many forces can I enter?",
      answer: "Enter one or more finite numbers separated by commas, spaces, or semicolons.",
    },
    "Net Force Calculator — ΣF",
    "Sum signed forces to find net force in one dimension.",
    ["net force calculator", "sum of forces", "resultant force 1D"],
    "none",
  ),
  "friction-force-calculator": article(
    "friction-force-calculator",
    "Friction force",
    [
      "Magnitude model f = μ N with non-negative μ and normal force.",
      "Does not distinguish static vs kinetic beyond the μ you supply.",
    ],
    {
      question: "Is direction included?",
      answer: "This returns magnitude; oppose relative slip along your free-body diagram.",
    },
    "Friction Force Calculator — μN",
    "Calculate friction force from coefficient μ and normal force.",
    ["friction force calculator", "mu N", "coefficient friction force"],
    "sparkTrendDemo",
  ),
  "coefficient-of-friction-calculator": article(
    "coefficient-of-friction-calculator",
    "Coefficient of friction",
    [
      "Finds μ = f / N from measured friction and normal force.",
      "Normal force must be positive for a defined ratio.",
    ],
    {
      question: "Is this μ_s or μ_k?",
      answer: "It is the ratio you imply — use limiting friction for static μ estimates.",
    },
    "Coefficient of Friction Calculator — f/N",
    "Compute μ from friction force and normal force.",
    ["coefficient of friction calculator", "mu = f/N", "friction ratio"],
    "none",
  ),
  "centripetal-force-calculator": article(
    "centripetal-force-calculator",
    "Centripetal force",
    [
      "Uses F_c = m v² / r for uniform circular motion.",
      "Enter mass, tangential speed, and orbit radius in SI.",
    ],
    {
      question: "Is this a new force of nature?",
      answer: "No — it is the net inward force requirement (tension, gravity, etc.).",
    },
    "Centripetal Force Calculator — mv²/r",
    "Calculate centripetal force for circular motion in SI units.",
    ["centripetal force calculator", "mv2/r", "circular motion force"],
    "sparkTrendDemo",
  ),
  "centripetal-acceleration-calculator": article(
    "centripetal-acceleration-calculator",
    "Centripetal acceleration",
    [
      "Computes a_c = v² / r toward the centre of a circular path.",
      "Radius must be positive; speed may be signed but is squared.",
    ],
    {
      question: "How does this relate to force?",
      answer: "Multiply by mass for the required centripetal force F = m a_c.",
    },
    "Centripetal Acceleration Calculator — v²/r",
    "Find centripetal acceleration from speed and radius.",
    ["centripetal acceleration", "v2/r", "circular acceleration"],
    "none",
  ),
  "angular-velocity-calculator": article(
    "angular-velocity-calculator",
    "Angular velocity",
    [
      "Converts tangential speed to angular speed: ω = v / r.",
      "Result is in radians per second for educational SI problems.",
    ],
    {
      question: "Can I enter frequency instead?",
      answer: "This host uses the from-speed mode (v and r). Frequency mode is available in the library API.",
    },
    "Angular Velocity Calculator — v/r",
    "Calculate angular velocity from tangential speed and radius.",
    ["angular velocity calculator", "omega = v/r", "rad/s"],
    "sparkTrendDemo",
  ),
};
