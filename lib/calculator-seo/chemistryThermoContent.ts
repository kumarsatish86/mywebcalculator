import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/chemistry-thermodynamics";
const HUB_LABEL = "Education · Science · Chemistry Thermodynamics";
const SHELL =
  "Classroom thermochemistry with consistent energy units. Educational models only — not lab certification or process design.";

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
        title: "Thermo tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Heat energy", "q = m c ΔT"],
          ["Enthalpy", "ΔH = Σ prod − Σ reac"],
          ["Gibbs", "ΔG = ΔH − TΔS"],
          ["Entropy", "ΔS = Σ prod − Σ reac"],
          ["Calorimetry", "q from m, c, ΔT"],
          ["Heat capacity", "C = q / ΔT"],
          ["Hess’s law", "Σ step ΔH"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your thermochemistry inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Energy trend idea",
            caption: "Share URL preserves your thermochemistry inputs.",
            sparkValues: [0.15, 0.28, 0.42, 0.58, 0.72, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CHEMISTRY_THERMO_ARTICLES: Record<string, RichArticle> = {
  "heat-energy-calculator-chemistry": article(
    "heat-energy-calculator-chemistry",
    "Heat energy",
    [
      "Computes sensible heat q = m c ΔT when temperature changes without a phase change.",
      "Keep mass, specific heat, and ΔT in a consistent unit system (e.g. g, J·g⁻¹·°C⁻¹, °C).",
    ],
    {
      question: "Does this include latent heat?",
      answer: "No — phase-change energy needs a separate latent-heat term; this is q = mcΔT only.",
    },
    "Heat Energy Calculator — Chemistry (q = mcΔT)",
    "Calculate heat energy from mass, specific heat, and temperature change.",
    ["heat energy calculator chemistry", "q=mcΔT", "specific heat heat"],
    "sparkTrendDemo",
  ),
  "enthalpy-calculator": article(
    "enthalpy-calculator",
    "Enthalpy change",
    [
      "Estimates ΔH = Σ (products) − Σ (reactants) from CSV lists of coeff×ΔH_f contributions.",
      "Paste already-multiplied formation enthalpies; the tool sums each side and subtracts.",
    ],
    {
      question: "What goes in the CSV?",
      answer: "Numbers only — e.g. products −241.8 and reactants −285.8 for a simple water example (units must match).",
    },
    "Enthalpy Calculator — ΔH Reaction",
    "Compute reaction enthalpy from product and reactant CSV contributions.",
    ["enthalpy calculator", "delta H reaction", "formation enthalpy sum"],
    "none",
  ),
  "gibbs-free-energy-calculator-chemistry": article(
    "gibbs-free-energy-calculator-chemistry",
    "Gibbs free energy",
    [
      "Computes ΔG = ΔH − TΔS with temperature in kelvin.",
      "Keep ΔH and ΔS unit-compatible (e.g. kJ and kJ/K, or J and J/K).",
    ],
    {
      question: "What does negative ΔG mean?",
      answer: "Under the textbook sign convention, ΔG < 0 suggests a spontaneous process in the forward direction at constant T and P.",
    },
    "Gibbs Free Energy Calculator — Chemistry",
    "Calculate ΔG from ΔH, temperature, and ΔS for chemistry problems.",
    ["gibbs free energy calculator", "delta G", "ΔH − TΔS"],
    "sparkTrendDemo",
  ),
  "entropy-calculator": article(
    "entropy-calculator",
    "Entropy change",
    [
      "Estimates ΔS = Σ (products) − Σ (reactants) from CSV lists of entropy contributions.",
      "Use standard molar entropies already multiplied by stoichiometric coefficients when required.",
    ],
    {
      question: "Are units checked?",
      answer: "No — enter consistent S° units on both sides; the tool only performs the arithmetic sum.",
    },
    "Entropy Calculator — ΔS Reaction",
    "Compute reaction entropy change from product and reactant CSV values.",
    ["entropy calculator", "delta S reaction", "standard entropy sum"],
    "none",
  ),
  "calorimetry-calculator": article(
    "calorimetry-calculator",
    "Calorimetry",
    [
      "Applies q = m c ΔT for simple calorimeter estimates of heat absorbed or released.",
      "Ideal for coffee-cup style homework; ignores heat loss to surroundings unless you fold it into c.",
    ],
    {
      question: "Is the sign of ΔT important?",
      answer: "Yes — a temperature rise makes q positive for the substance gaining heat under the usual convention.",
    },
    "Calorimetry Calculator — q = mcΔT",
    "Estimate calorimetry heat from mass, specific heat, and ΔT.",
    ["calorimetry calculator", "coffee cup calorimeter", "heat absorbed"],
    "sparkTrendDemo",
  ),
  "heat-capacity-calculator": article(
    "heat-capacity-calculator",
    "Heat capacity",
    [
      "Finds heat capacity C = q / ΔT for a sample or calorimeter assembly.",
      "ΔT cannot be zero; use consistent energy and temperature units.",
    ],
    {
      question: "Is this specific heat?",
      answer: "No — C is extensive (energy per kelvin). Specific heat is C per unit mass.",
    },
    "Heat Capacity Calculator — C = q/ΔT",
    "Calculate heat capacity from heat transferred and temperature change.",
    ["heat capacity calculator", "C = q/ΔT", "sample heat capacity"],
    "none",
  ),
  "hess-law-calculator": article(
    "hess-law-calculator",
    "Hess’s law",
    [
      "Sums step enthalpies from a CSV to get overall ΔH_rxn (Hess’s law pathway sum).",
      "Reverse a step by entering its negative ΔH; multiply by coefficients before pasting if needed.",
    ],
    {
      question: "Do I enter reactions as text?",
      answer: "No — enter numeric step ΔH values only, separated by commas.",
    },
    "Hess’s Law Calculator — Sum of Steps",
    "Add pathway step enthalpies to find the overall reaction ΔH.",
    ["hess law calculator", "sum of enthalpies", "thermochemistry pathway"],
    "sparkTrendDemo",
  ),
};
