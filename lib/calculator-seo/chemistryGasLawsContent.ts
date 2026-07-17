import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/chemistry-gas-laws";
const HUB_LABEL = "Education · Science · Chemistry Gas Laws";
const SHELL =
  "Ideal-gas classroom models with SI-consistent units (R = 8.314 J·mol⁻¹·K⁻¹). Educational only — not lab certification.";

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
        title: "Gas law tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Ideal gas", "PV = nRT"],
          ["Boyle", "P₁V₁ = P₂V₂"],
          ["Charles", "V/T constant"],
          ["Gay-Lussac", "P/T constant"],
          ["Combined", "P₁V₁/T₁ = P₂V₂/T₂"],
          ["Dalton", "P_total = Σ P_i"],
          ["Density / RMS", "ρ = PM/RT, v_rms"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your gas-law inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "P–V trend idea",
            caption: "Share URL preserves your gas-law inputs.",
            sparkValues: [0.9, 0.75, 0.6, 0.48, 0.35, 0.22],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CHEMISTRY_GAS_LAWS_ARTICLES: Record<string, RichArticle> = {
  "ideal-gas-law-calculator-chemistry": article(
    "ideal-gas-law-calculator-chemistry",
    "Ideal gas law",
    [
      "Solves PV = nRT with R = 8.314462618 J·mol⁻¹·K⁻¹ when any three of P, V, n, T are known.",
      "Use pascals, cubic metres, moles, and kelvin for SI consistency (URL keys p, a, n, t).",
    ],
    {
      question: "How do I leave a blank?",
      answer: "Clear exactly one of P, V, n, or T so the tool can solve that unknown.",
    },
    "Ideal Gas Law Calculator — Chemistry (PV = nRT)",
    "Solve the ideal gas law for P, V, n, or T with SI units.",
    ["ideal gas law calculator", "PV=nRT chemistry", "gas law SI"],
    "sparkTrendDemo",
  ),
  "boyles-law-calculator-chemistry": article(
    "boyles-law-calculator-chemistry",
    "Boyle’s law",
    [
      "Applies P₁V₁ = P₂V₂ at constant temperature and amount of gas.",
      "Enter P1 and V1, then leave exactly one of P2 or V2 blank.",
    ],
    {
      question: "Must temperature be constant?",
      answer: "Yes for Boyle’s law — if T changes, use the combined gas law instead.",
    },
    "Boyle’s Law Calculator — Chemistry",
    "Solve Boyle’s law for P2 or V2 from P1 and V1.",
    ["boyles law calculator", "P1V1=P2V2", "gas pressure volume"],
    "none",
  ),
  "charles-law-calculator-chemistry": article(
    "charles-law-calculator-chemistry",
    "Charles’s law",
    [
      "Uses V/T constant (temperatures in kelvin) at constant pressure.",
      "Enter V1 and T1, then leave exactly one of V2 or T2 blank.",
    ],
    {
      question: "Can I use Celsius?",
      answer: "Convert to kelvin first (T_K = t_°C + 273.15). Absolute temperature is required.",
    },
    "Charles’s Law Calculator — Chemistry",
    "Solve Charles’s law for V2 or T2 with kelvin temperatures.",
    ["charles law calculator", "V/T constant", "gas volume temperature"],
    "sparkTrendDemo",
  ),
  "gay-lussacs-law-calculator": article(
    "gay-lussacs-law-calculator",
    "Gay-Lussac’s law",
    [
      "Uses P/T constant at constant volume with temperatures in kelvin.",
      "Enter P1 and T1, then leave exactly one of P2 or T2 blank.",
    ],
    {
      question: "Is volume held fixed?",
      answer: "Yes — Gay-Lussac’s law assumes constant volume and amount of gas.",
    },
    "Gay-Lussac’s Law Calculator — P/T",
    "Solve Gay-Lussac’s law for P2 or T2 at constant volume.",
    ["gay lussac law calculator", "P/T constant", "pressure temperature gas"],
    "none",
  ),
  "combined-gas-law-calculator": article(
    "combined-gas-law-calculator",
    "Combined gas law",
    [
      "Applies P₁V₁/T₁ = P₂V₂/T₂ when amount of gas is fixed.",
      "Enter P1, V1, T1 and any two of P2, V2, T2 — leave exactly one of the final three blank.",
    ],
    {
      question: "What if n also changes?",
      answer: "Then use the ideal gas law with moles included; the combined law assumes n is constant.",
    },
    "Combined Gas Law Calculator",
    "Solve the combined gas law for one of P2, V2, or T2.",
    ["combined gas law calculator", "P1V1/T1", "gas law combined"],
    "sparkTrendDemo",
  ),
  "daltons-law-partial-pressure-calculator": article(
    "daltons-law-partial-pressure-calculator",
    "Dalton’s law",
    [
      "Sums partial pressures from a CSV list to get total pressure of an ideal mixture.",
      "Partial pressures must use the same unit; negatives are rejected.",
    ],
    {
      question: "Do mole fractions appear?",
      answer: "Not in this tool — enter the partial pressures directly (P_i = x_i P_total if you already know them).",
    },
    "Dalton’s Law Calculator — Partial Pressures",
    "Add partial pressures to find total pressure of a gas mixture.",
    ["daltons law calculator", "partial pressure sum", "total gas pressure"],
    "none",
  ),
  "gas-density-calculator": article(
    "gas-density-calculator",
    "Gas density",
    [
      "Computes ρ = P M / (R T) for an ideal gas with P in pascals and T in kelvin.",
      "Enter molar mass in the mass-per-mole unit consistent with R (kg/mol for SI density in kg/m³).",
    ],
    {
      question: "What molar mass should I use for air?",
      answer: "About 0.02897 kg/mol (≈ 28.97 g/mol) for dry air near STP in SI calculations.",
    },
    "Gas Density Calculator — ρ = PM/RT",
    "Calculate ideal-gas density from pressure, molar mass, and temperature.",
    ["gas density calculator", "PM/RT", "ideal gas density"],
    "sparkTrendDemo",
  ),
  "rms-speed-calculator": article(
    "rms-speed-calculator",
    "RMS speed",
    [
      "Computes root-mean-square molecular speed v_rms = √(3RT/M) with M in kg/mol.",
      "A kinetic-theory estimate for an ideal gas — not a macroscopic wind speed.",
    ],
    {
      question: "Why kg/mol not g/mol?",
      answer: "SI requires kg/mol with R in J·mol⁻¹·K⁻¹ so speed comes out in m/s (e.g. 0.032 for O₂).",
    },
    "RMS Speed Calculator — Molecular Speed",
    "Calculate RMS molecular speed from temperature and molar mass in kg/mol.",
    ["rms speed calculator", "molecular speed", "kinetic theory gas"],
    "none",
  ),
};
