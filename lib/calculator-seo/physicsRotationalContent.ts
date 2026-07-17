import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/physics-rotational-motion";
const HUB_LABEL = "Education · Physics · Rotational Motion";
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
        title: "Rotational tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Torque", "r F sin θ"],
          ["Angular acceleration", "τ / I"],
          ["Moment of inertia", "m r²"],
          ["Rotational KE", "½ I ω²"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your SI inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Rotation demo",
            caption: "Share URL preserves your SI inputs.",
            sparkValues: [0.2, 0.4, 0.55, 0.7, 0.85, 1],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const PHYSICS_ROTATIONAL_ARTICLES: Record<string, RichArticle> = {
  "torque-calculator": article(
    "torque-calculator",
    "Torque calculator",
    [
      "Computes torque τ = r F sin θ about a pivot for a single force.",
      "Angle is between the position vector and the force direction.",
    ],
    {
      question: "When is sin θ = 1?",
      answer: "When force is perpendicular to the lever arm (θ = 90°).",
    },
    "Torque Calculator — rF sin θ",
    "Calculate torque from lever arm, force, and angle in N·m.",
    ["torque calculator", "rF sin theta", "moment of force"],
    "sparkTrendDemo",
  ),
  "angular-acceleration-calculator": article(
    "angular-acceleration-calculator",
    "Angular acceleration",
    [
      "Uses α = τ / I when torque and moment of inertia are known.",
      "I must be positive for a physical rigid body.",
    ],
    {
      question: "Is this the same as linear a?",
      answer: "No — α is in rad/s²; related by a = r α at a rim point.",
    },
    "Angular Acceleration Calculator — τ/I",
    "Find angular acceleration from torque and moment of inertia.",
    ["angular acceleration calculator", "alpha = tau/I", "rotational dynamics"],
    "none",
  ),
  "moment-of-inertia-calculator": article(
    "moment-of-inertia-calculator",
    "Moment of inertia",
    [
      "Point-mass model I = m r² about the chosen axis.",
      "For extended bodies, use the appropriate shape formula instead.",
    ],
    {
      question: "Is this for a solid disk?",
      answer: "No — this host uses the point-mass mr² mode only.",
    },
    "Moment of Inertia Calculator — mr²",
    "Calculate point-mass moment of inertia I = m r².",
    ["moment of inertia calculator", "I = mr2", "rotational inertia"],
    "sparkTrendDemo",
  ),
  "rotational-kinetic-energy-calculator": article(
    "rotational-kinetic-energy-calculator",
    "Rotational kinetic energy",
    [
      "Computes KE_rot = ½ I ω² for rigid-body rotation about a fixed axis.",
      "Enter I in kg·m² and ω in rad/s.",
    ],
    {
      question: "Do I add translational KE?",
      answer: "For rolling without slipping, total KE is translational plus rotational.",
    },
    "Rotational Kinetic Energy Calculator — ½Iω²",
    "Calculate rotational kinetic energy from I and angular speed.",
    ["rotational kinetic energy", "1/2 I omega2", "spinning KE"],
    "none",
  ),
};
