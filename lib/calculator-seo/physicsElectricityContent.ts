import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/physics-electricity";
const HUB_LABEL = "Education · Physics · Electricity";
const SHELL =
  "SI units, educational textbook models only. DC Ohm’s-law idealizations — not a wiring or safety guide.";

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
        title: "Electricity tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Ohm’s law", "V = I R"],
          ["Voltage / current / R", "Direct rearrangements"],
          ["Power", "VI, I²R, or V²/R"],
          ["Energy use", "P × time"],
          ["Series / parallel", "ΣR or 1/Σ(1/R)"],
          ["Capacitor", "Q = C V"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your SI inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Circuit relationship demo",
            caption: "Share URL preserves your SI inputs.",
            sparkValues: [0.25, 0.4, 0.55, 0.7, 0.85, 1],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const PHYSICS_ELECTRICITY_ARTICLES: Record<string, RichArticle> = {
  "ohms-law-calculator": article(
    "ohms-law-calculator",
    "Ohm’s law",
    [
      "Solves for voltage, current, or resistance from V = I R.",
      "Enter any two positive values and leave the unknown blank.",
    ],
    {
      question: "Do values have to be positive?",
      answer: "Yes for this solver — enter magnitudes for simple resistive DC problems.",
    },
    "Ohm’s Law Calculator — V = IR",
    "Solve Ohm’s law for voltage, current, or resistance in SI units.",
    ["ohms law calculator", "V = IR", "voltage current resistance"],
    "sparkTrendDemo",
  ),
  "voltage-calculator": article(
    "voltage-calculator",
    "Voltage calculator",
    [
      "Computes V = I × R for a single resistor (or equivalent resistance).",
      "Useful when you already know current and resistance.",
    ],
    {
      question: "Is this RMS or DC?",
      answer: "It is the algebraic product — treat inputs as DC magnitudes for class problems.",
    },
    "Voltage Calculator — From Current and Resistance",
    "Calculate voltage from current and resistance using V = IR.",
    ["voltage calculator", "V = IR calculator", "electrical voltage"],
    "none",
  ),
  "current-calculator": article(
    "current-calculator",
    "Current calculator",
    [
      "Computes I = V / R for a resistive load.",
      "Resistance must be positive so current is defined.",
    ],
    {
      question: "What if R is zero?",
      answer: "Division by zero is rejected — a short-circuit idealization needs a different model.",
    },
    "Current Calculator — From Voltage and Resistance",
    "Calculate electric current from voltage and resistance.",
    ["current calculator", "I = V/R", "amperage calculator"],
    "sparkTrendDemo",
  ),
  "resistance-calculator": article(
    "resistance-calculator",
    "Resistance calculator",
    [
      "Computes R = V / I from measured or given voltage and current.",
      "Current must be positive for a finite resistance result.",
    ],
    {
      question: "Can this find equivalent resistance of a network?",
      answer: "Only if V and I are for the whole network — otherwise use series/parallel tools.",
    },
    "Resistance Calculator — From V and I",
    "Calculate resistance from voltage and current using Ohm’s law.",
    ["resistance calculator", "R = V/I", "ohm calculator"],
    "none",
  ),
  "electrical-power-calculator": article(
    "electrical-power-calculator",
    "Electrical power",
    [
      "Finds power from V&I, I&R, or V&R using the matching textbook formula.",
      "Enter any two of V, I, and R; leave the unused field blank.",
    ],
    {
      question: "Which formula is used?",
      answer: "Priority is P = VI, then I²R, then V²/R depending on which pair you provide.",
    },
    "Electrical Power Calculator — Watts",
    "Calculate electric power from voltage, current, and/or resistance.",
    ["electrical power calculator", "watts calculator", "P = VI"],
    "sparkTrendDemo",
  ),
  "energy-consumption-calculator": article(
    "energy-consumption-calculator",
    "Energy consumption",
    [
      "Converts average power and operating hours into Wh, kWh, and joules.",
      "Helpful for simple appliance energy estimates in physics units.",
    ],
    {
      question: "Is this electricity bill cost?",
      answer: "No — it reports energy only. Multiply kWh by your tariff for cost.",
    },
    "Energy Consumption Calculator — kWh",
    "Estimate electrical energy from power in watts and hours of use.",
    ["energy consumption calculator", "kWh calculator", "power × time"],
    "none",
  ),
  "series-resistance-calculator": article(
    "series-resistance-calculator",
    "Series resistance",
    [
      "Sums comma-separated resistances for a series chain: R_total = Σ Rᵢ.",
      "Enter values in ohms separated by commas or spaces.",
    ],
    {
      question: "How many resistors can I enter?",
      answer: "Any positive count — at least one finite ohm value is required.",
    },
    "Series Resistance Calculator",
    "Add resistors in series from a comma-separated list of ohms.",
    ["series resistance calculator", "resistors in series", "total resistance"],
    "sparkTrendDemo",
  ),
  "parallel-resistance-calculator": article(
    "parallel-resistance-calculator",
    "Parallel resistance",
    [
      "Computes 1/R_eq = Σ (1/Rᵢ) for parallel branches.",
      "Each resistance must be positive so the reciprocal sum is defined.",
    ],
    {
      question: "Why is the result smaller than each R?",
      answer: "Parallel paths increase conductance, so equivalent resistance drops.",
    },
    "Parallel Resistance Calculator",
    "Find equivalent resistance for parallel resistors from a CSV list.",
    ["parallel resistance calculator", "resistors in parallel", "Req calculator"],
    "none",
  ),
  "capacitor-calculator-physics": article(
    "capacitor-calculator-physics",
    "Capacitor Q = C V",
    [
      "Solves capacitance relations among charge Q, voltage V, and capacitance C.",
      "Enter any two positive values and leave the third blank.",
    ],
    {
      question: "Are farads required?",
      answer: "Yes in SI — convert µF or nF to farads (e.g. 100 µF = 0.0001 F).",
    },
    "Capacitor Calculator — Q = CV",
    "Solve capacitor charge, voltage, or capacitance with Q = CV.",
    ["capacitor calculator physics", "Q = CV", "capacitance calculator"],
    "sparkTrendDemo",
  ),
};
