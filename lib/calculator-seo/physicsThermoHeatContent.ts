import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/physics-thermodynamics-heat";
const HUB_LABEL = "Education · Physics · Thermodynamics & Heat";
const SHELL =
  "SI units, educational textbook models only. Ideal-gas and Carnot assumptions — not engineering design data.";

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
        title: "Thermo & heat tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Heat energy", "Q = m c ΔT"],
          ["Specific heat", "c = Q / (m ΔT)"],
          ["Latent heat", "Q = m L"],
          ["Ideal gas", "PV = nRT"],
          ["Boyle / Charles", "P–V and V–T laws"],
          ["PV work", "W = P ΔV"],
          ["Carnot", "η = 1 − Tc/Th"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your SI inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Heat transfer trend",
            caption: "Share URL preserves your SI inputs.",
            sparkValues: [0.15, 0.3, 0.45, 0.6, 0.78, 0.92],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const PHYSICS_THERMO_HEAT_ARTICLES: Record<string, RichArticle> = {
  "heat-energy-calculator-physics": article(
    "heat-energy-calculator-physics",
    "Heat energy",
    [
      "Computes sensible heat Q = m c ΔT for temperature change without phase change.",
      "ΔT may be negative for cooling; result is energy transferred in joules.",
    ],
    {
      question: "What units for c?",
      answer: "Use J/(kg·K) — e.g. about 4186 for liquid water near room temperature.",
    },
    "Heat Energy Calculator — Q = mcΔT",
    "Calculate heat energy from mass, specific heat, and temperature change.",
    ["heat energy calculator", "Q = mcΔT", "sensible heat physics"],
    "sparkTrendDemo",
  ),
  "specific-heat-calculator-physics": article(
    "specific-heat-calculator-physics",
    "Specific heat",
    [
      "Rearranges Q = m c ΔT to solve for specific heat capacity c.",
      "Requires a non-zero temperature change so the denominator is valid.",
    ],
    {
      question: "Can ΔT be zero?",
      answer: "No — specific heat is undefined when temperature does not change.",
    },
    "Specific Heat Calculator — Physics",
    "Find specific heat capacity from heat, mass, and ΔT in SI units.",
    ["specific heat calculator", "heat capacity physics", "c = Q/mΔT"],
    "none",
  ),
  "latent-heat-calculator-physics": article(
    "latent-heat-calculator-physics",
    "Latent heat",
    [
      "Computes phase-change energy Q = m L at constant temperature.",
      "Use latent heat of fusion or vaporization matching your substance table.",
    ],
    {
      question: "Does temperature change during latent heat?",
      answer: "In the ideal model, phase change occurs at constant T while Q = mL is absorbed or released.",
    },
    "Latent Heat Calculator — Q = mL",
    "Calculate latent heat energy for melting or boiling problems.",
    ["latent heat calculator", "phase change energy", "Q = mL"],
    "sparkTrendDemo",
  ),
  "ideal-gas-law-calculator-physics": article(
    "ideal-gas-law-calculator-physics",
    "Ideal gas law",
    [
      "Solves PV = nRT for one unknown among P, V, n, and T (kelvin).",
      "Leave exactly one field blank; R = 8.314 J/(mol·K) is built in.",
    ],
    {
      question: "Must temperature be in kelvin?",
      answer: "Yes — convert °C to K by adding 273.15 before entering T.",
    },
    "Ideal Gas Law Calculator — PV = nRT",
    "Solve the ideal gas law for pressure, volume, moles, or temperature.",
    ["ideal gas law calculator", "PV = nRT", "gas law physics"],
    "none",
  ),
  "boyles-law-calculator-physics": article(
    "boyles-law-calculator-physics",
    "Boyle’s law",
    [
      "Uses P₁V₁ = P₂V₂ at constant temperature for an ideal gas.",
      "Enter P1 and V1, then either P2 or V2 (leave the other blank).",
    ],
    {
      question: "Can I enter both P2 and V2?",
      answer: "No — leave exactly one of P2 or V2 blank so the tool can solve it.",
    },
    "Boyle’s Law Calculator — P1V1 = P2V2",
    "Solve Boyle’s law for final pressure or volume at constant temperature.",
    ["boyles law calculator", "P1V1 = P2V2", "gas pressure volume"],
    "sparkTrendDemo",
  ),
  "charles-law-calculator-physics": article(
    "charles-law-calculator-physics",
    "Charles’s law",
    [
      "Uses V/T constant (kelvin) at constant pressure for an ideal gas.",
      "Enter V1 and T1, then either V2 or T2 (leave the other blank).",
    ],
    {
      question: "Why kelvin only?",
      answer: "Charles’s law ratios require absolute temperature; °C would break the proportion.",
    },
    "Charles’s Law Calculator — V/T Constant",
    "Solve Charles’s law for final volume or temperature in kelvin.",
    ["charles law calculator", "volume temperature gas", "V/T constant"],
    "none",
  ),
  "pressure-volume-calculator-physics": article(
    "pressure-volume-calculator-physics",
    "Pressure–volume work",
    [
      "Computes isobaric work W = P (V₂ − V₁) between two volumes.",
      "Expansion (V₂ > V₁) gives positive work by the system in this convention.",
    ],
    {
      question: "Is pressure constant?",
      answer: "Yes — this is the constant-pressure (isobaric) textbook model.",
    },
    "Pressure Volume Work Calculator — Physics",
    "Calculate thermodynamic work from constant pressure and volume change.",
    ["pressure volume work", "PV work calculator", "isobaric work"],
    "sparkTrendDemo",
  ),
  "work-done-thermodynamics-calculator": article(
    "work-done-thermodynamics-calculator",
    "Isobaric thermodynamic work",
    [
      "Direct W = P ΔV form when you already know the volume change.",
      "ΔV may be negative for compression work against the system.",
    ],
    {
      question: "How does this differ from the V1–V2 tool?",
      answer: "Same physics — enter ΔV directly instead of separate initial and final volumes.",
    },
    "Work Done Thermodynamics Calculator",
    "Compute isobaric work done from pressure and change in volume.",
    ["work done thermodynamics", "W = PΔV", "thermo work calculator"],
    "none",
  ),
  "carnot-efficiency-calculator": article(
    "carnot-efficiency-calculator",
    "Carnot efficiency",
    [
      "Finds the ideal heat-engine limit η = 1 − Tc/Th with kelvin reservoirs.",
      "Real engines are lower; this is the textbook upper bound only.",
    ],
    {
      question: "Why must Tc < Th?",
      answer: "Heat engines need a hot and a colder sink; equal temperatures give zero Carnot efficiency.",
    },
    "Carnot Efficiency Calculator",
    "Calculate maximum Carnot efficiency from hot and cold reservoir temperatures.",
    ["carnot efficiency calculator", "heat engine efficiency", "1 - Tc/Th"],
    "sparkTrendDemo",
  ),
};
