import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/physics-work-energy-power";
const HUB_LABEL = "Education · Physics · Work, Energy & Power";
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
        title: "Work & energy tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Work", "F d cos θ"],
          ["Kinetic energy", "½mv²"],
          ["Potential energy", "mgh"],
          ["Mechanical energy", "KE + PE"],
          ["Power", "W/t"],
          ["Efficiency", "useful/total"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your SI inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Energy scale demo",
            caption: "Share URL preserves your SI inputs.",
            sparkValues: [0.25, 0.4, 0.55, 0.7, 0.85, 1],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const PHYSICS_WORK_ENERGY_POWER_ARTICLES: Record<string, RichArticle> = {
  "work-calculator-physics": article(
    "work-calculator-physics",
    "Work calculator",
    [
      "Computes work W = F d cos θ for a constant force over a straight displacement.",
      "Angle is between force and displacement; 90° means zero work.",
    ],
    {
      question: "Can work be negative?",
      answer: "Yes — when force has a component opposite the displacement (θ > 90°).",
    },
    "Work Calculator — Physics (Fd cos θ)",
    "Calculate mechanical work from force, distance, and angle in joules.",
    ["work calculator physics", "Fd cos theta", "work in joules"],
    "sparkTrendDemo",
  ),
  "kinetic-energy-calculator": article(
    "kinetic-energy-calculator",
    "Kinetic energy",
    [
      "Uses KE = ½ m v² for a particle (or rigid body treated as a point mass).",
      "Velocity is squared, so direction does not change the kinetic energy.",
    ],
    {
      question: "Is mass allowed to be zero?",
      answer: "Mass may be zero mathematically, but real objects need non-negative mass.",
    },
    "Kinetic Energy Calculator — ½mv²",
    "Compute kinetic energy from mass and speed in SI units.",
    ["kinetic energy calculator", "1/2 mv2", "KE calculator"],
    "none",
  ),
  "potential-energy-calculator": article(
    "potential-energy-calculator",
    "Potential energy",
    [
      "Near-Earth gravitational PE ≈ m g h with g ≈ 9.80665 m/s².",
      "Choose a reference height where PE = 0 for your problem.",
    ],
    {
      question: "Is height absolute altitude?",
      answer: "Use height above your chosen zero of potential, not necessarily sea level.",
    },
    "Potential Energy Calculator — mgh",
    "Calculate gravitational potential energy from mass and height.",
    ["potential energy calculator", "mgh", "gravitational PE"],
    "sparkTrendDemo",
  ),
  "mechanical-energy-calculator": article(
    "mechanical-energy-calculator",
    "Mechanical energy",
    [
      "Sums KE + PE for a simple conservative-system total.",
      "Enter already-computed kinetic and potential energies in joules.",
    ],
    {
      question: "Does this include thermal losses?",
      answer: "No — it is the ideal mechanical sum only.",
    },
    "Mechanical Energy Calculator — KE + PE",
    "Add kinetic and potential energy for total mechanical energy.",
    ["mechanical energy calculator", "KE + PE", "total energy"],
    "none",
  ),
  "power-calculator-physics": article(
    "power-calculator-physics",
    "Power calculator",
    [
      "Average power P = W / t when work is done over a positive time interval.",
      "Result is in watts (J/s).",
    ],
    {
      question: "Is this instantaneous power?",
      answer: "It is average power over the interval you enter.",
    },
    "Power Calculator — Physics (W/t)",
    "Calculate average power from work and time in watts.",
    ["power calculator physics", "work over time", "watts calculator"],
    "sparkTrendDemo",
  ),
  "efficiency-calculator-physics": article(
    "efficiency-calculator-physics",
    "Efficiency",
    [
      "Efficiency η = useful output ÷ total input as a ratio and percent.",
      "Useful for machines, heaters, and energy-conversion textbook examples.",
    ],
    {
      question: "Can efficiency exceed 100%?",
      answer: "Not for a passive device; if useful > total, check your energy accounting.",
    },
    "Efficiency Calculator — Physics",
    "Compute efficiency percent from useful and total energy or work.",
    ["efficiency calculator physics", "useful over total", "energy efficiency"],
    "none",
  ),
};
