import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/physics-modern";
const HUB_LABEL = "Education · Science · Physics Modern";
const SHELL =
  "SI educational shell for photons, matter waves, and simple radioactive decay. Textbook constants — not nuclear engineering.";

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
        title: "Modern physics tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Photon energy", "E = hc/λ or hf"],
          ["de Broglie", "λ = h/(mv)"],
          ["Radioactive decay", "N = N₀ e^(−λt)"],
          ["Half-life", "t½ = ln 2 / λ"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your SI modern-physics inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Decay / energy idea",
            caption: "Share URL preserves your SI modern-physics inputs.",
            sparkValues: [1, 0.85, 0.7, 0.55, 0.4, 0.25],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const PHYSICS_MODERN_ARTICLES: Record<string, RichArticle> = {
  "photon-energy-calculator": article(
    "photon-energy-calculator",
    "Photon energy",
    [
      "Computes photon energy from wavelength by default: E = hc / λ (joules and eV).",
      "Frequency mode uses E = h f when configured that way.",
    ],
    {
      question: "What wavelength unit?",
      answer: "Metres (SI). Convert nm → m by multiplying by 10⁻⁹ before entering.",
    },
    "Photon Energy Calculator — E = hc/λ",
    "Calculate photon energy in joules and eV from wavelength or frequency.",
    ["photon energy calculator", "E = hc/lambda", "Planck energy"],
    "sparkTrendDemo",
  ),
  "de-broglie-wavelength-calculator": article(
    "de-broglie-wavelength-calculator",
    "de Broglie wavelength",
    [
      "Finds λ = h / (m v) for a particle with mass and speed.",
      "Mass in kg and velocity in m/s; result wavelength in metres.",
    ],
    {
      question: "Is relativity included?",
      answer: "No — this is the non-relativistic classroom form p = mv.",
    },
    "de Broglie Wavelength Calculator — λ = h/mv",
    "Calculate the de Broglie wavelength from mass and velocity.",
    ["de broglie wavelength calculator", "matter wave", "h/mv"],
    "none",
  ),
  "radioactive-decay-calculator-physics": article(
    "radioactive-decay-calculator-physics",
    "Radioactive decay",
    [
      "Computes remaining amount N = N₀ e^(−λt) with λ = ln 2 / t½.",
      "Keep N₀, half-life, and time in a consistent unit system.",
    ],
    {
      question: "Is N₀ atoms or moles?",
      answer: "Either — the exponential only needs a consistent quantity scale.",
    },
    "Radioactive Decay Calculator — N = N₀ e^(−λt)",
    "Estimate remaining radioactive nuclei from half-life and time.",
    ["radioactive decay calculator", "half life decay", "exponential decay"],
    "sparkTrendDemo",
  ),
  "half-life-calculator-physics": article(
    "half-life-calculator-physics",
    "Half-life",
    [
      "Converts decay constant to half-life with t½ = ln 2 / λ.",
      "λ must be positive and share the reciprocal time unit of t½.",
    ],
    {
      question: "What if I know remaining fraction instead?",
      answer: "This page defaults to from-λ mode; remaining-amount mode needs N₀, N, and t.",
    },
    "Half-Life Calculator — t½ = ln2/λ",
    "Calculate radioactive half-life from the decay constant.",
    ["half life calculator physics", "decay constant", "ln2 / lambda"],
    "none",
  ),
};
