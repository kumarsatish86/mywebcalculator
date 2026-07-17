import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/chemistry-electrochemistry";
const HUB_LABEL = "Education · Science · Chemistry Electrochemistry";
const SHELL =
  "Educational electrochemistry arithmetic for classroom use. Simplified models only — not battery design, industrial electrolysis control, or lab certification.";

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
        title: "Electrochemistry tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Nernst", "E = E° − (RT/nF) ln(Q)"],
          ["Cell potential", "E = E_cathode − E_anode"],
          ["Electrolysis", "m = I t M / (n F)"],
          ["Faraday’s law", "moles = I t / (n F)"],
          ["Redox e⁻", "|ΔON| × atoms"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your electrochemistry inputs. Educational models only.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Cell potential idea",
            caption: "Share URL preserves your electrochemistry inputs. Educational models only.",
            sparkValues: [0.2, 0.5, 0.8, 1.1, 1.4, 1.7],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CHEMISTRY_ELECTROCHEMISTRY_ARTICLES: Record<string, RichArticle> = {
  "nernst-equation-calculator": article(
    "nernst-equation-calculator",
    "Nernst equation",
    [
      "E = E° − (RT/nF) ln(Q) with gas constant R and Faraday constant F.",
      "Enter E°, electron count n, and Q. Optional T in Kelvin defaults to 298.15 K.",
    ],
    {
      question: "Is Q the same as K?",
      answer: "Q is the instantaneous reaction quotient; at equilibrium Q = K and E = 0 for the cell form.",
    },
    "Nernst Equation Calculator — E from E°, n, Q",
    "Calculate cell potential with the Nernst equation E = E° − (RT/nF) ln(Q).",
    ["nernst equation calculator", "nernst E", "reaction quotient Q electrochemistry"],
    "sparkTrendDemo",
  ),
  "cell-potential-calculator": article(
    "cell-potential-calculator",
    "Standard cell potential",
    [
      "E_cell = E_cathode − E_anode using standard reduction potentials for both electrodes.",
      "Positive E_cell indicates a spontaneous cell under standard conditions (teaching model).",
    ],
    {
      question: "Should I flip the anode sign myself?",
      answer: "No — enter both as reduction potentials; the tool subtracts E_anode.",
    },
    "Cell Potential Calculator — E_cathode − E_anode",
    "Compute galvanic cell potential from cathode and anode reduction potentials.",
    ["cell potential calculator", "E cell calculator", "reduction potential difference"],
    "none",
  ),
  "electrolysis-calculator": article(
    "electrolysis-calculator",
    "Electrolysis mass from Faraday’s law",
    [
      "m = (I × t × M) / (n × F) with current in amperes, time in seconds, and molar mass M.",
      "Requires I, t, n, and M. Educational Faraday electrolysis arithmetic.",
    ],
    {
      question: "What is F?",
      answer: "Faraday’s constant ≈ 96485 C/mol of electrons in this model.",
    },
    "Electrolysis Calculator — Mass from I, t, n, M",
    "Estimate deposited mass in electrolysis using Faraday’s law for classroom chemistry.",
    ["electrolysis calculator", "faraday mass", "I t M n F"],
    "sparkTrendDemo",
  ),
  "faradays-law-calculator": article(
    "faradays-law-calculator",
    "Faraday’s law of electrolysis",
    [
      "Moles of substance = I t / (n F). Optionally enter molar mass M to get mass in grams.",
      "Same constants as the electrolysis tool; M is optional here.",
    ],
    {
      question: "What units for time?",
      answer: "Use seconds so that ampere·second = coulomb matches F.",
    },
    "Faraday’s Law Calculator — Moles and Mass",
    "Calculate moles (and optional mass) from current, time, and electron count n.",
    ["faradays law calculator", "electrolysis moles", "faraday constant chemistry"],
    "none",
  ),
  "redox-reaction-calculator": article(
    "redox-reaction-calculator",
    "Redox electron count",
    [
      "Electrons transferred = |ON_final − ON_initial| × atom count for the element tracked.",
      "Also labels oxidation vs reduction from the sign of the oxidation-number change.",
    ],
    {
      question: "What if multiple atoms change?",
      answer: "Set the atoms field to the count of that element in the formula unit being balanced.",
    },
    "Redox Reaction Calculator — Electrons from Oxidation Numbers",
    "Count electrons transferred from oxidation-number change for educational redox balancing.",
    ["redox reaction calculator", "oxidation number electrons", "redox electron count"],
    "sparkTrendDemo",
  ),
};
