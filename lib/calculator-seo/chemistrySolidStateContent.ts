import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/chemistry-solid-state";
const HUB_LABEL = "Education · Science · Chemistry Solid State";
const SHELL =
  "Educational solid-state and crystal arithmetic for classroom use. Ideal hard-sphere / cubic-cell models only — not materials design or metallurgy advice.";

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
        title: "Solid-state tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Density", "ρ = ZM / (N_A a³)"],
          ["Unit cell", "V = a³ or a from ρ"],
          ["Packing", "sc / bcc / fcc %"],
          ["Crystal", "Z, NN, packing"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your solid-state inputs. Educational models only.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Packing idea",
            caption: "Share URL preserves your solid-state inputs. Educational models only.",
            sparkValues: [0.52, 0.68, 0.74, 0.74, 0.68, 0.52],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CHEMISTRY_SOLID_STATE_ARTICLES: Record<string, RichArticle> = {
  "density-calculator-solid-state": article(
    "density-calculator-solid-state",
    "Solid-state density",
    [
      "ρ = (Z × M) / (N_A × a³) with edge length a in cm and molar mass M in g/mol → g/cm³.",
      "Educational cubic-cell density — convert Å to cm (×10⁻⁸) before entering a.",
    ],
    {
      question: "What is Z?",
      answer: "Number of formula units (or atoms for elemental metals) per unit cell — e.g. 4 for FCC.",
    },
    "Density Calculator — Solid State Unit Cell",
    "Calculate crystal density from Z, molar mass, and cubic edge length for education.",
    ["solid state density calculator", "unit cell density", "ZM/NAa3"],
    "sparkTrendDemo",
  ),
  "unit-cell-calculator": article(
    "unit-cell-calculator",
    "Unit cell",
    [
      "Default mode volume: V = a³ from edge length.",
      "Mode edgeFromDensity solves a = ∛(ZM / (N_A ρ)) and reports volume.",
    ],
    {
      question: "What is the default mode?",
      answer: 'Enter "volume" (default) or "edgeFromDensity" to back-calculate the edge from density.',
    },
    "Unit Cell Calculator — Volume or Edge from Density",
    "Compute cubic unit-cell volume or edge length from density for solid-state chemistry.",
    ["unit cell calculator", "edge from density", "unit cell volume"],
    "none",
  ),
  "packing-efficiency-calculator": article(
    "packing-efficiency-calculator",
    "Packing efficiency",
    [
      "Ideal hard-sphere packing percentages for simple cubic, BCC, and FCC lattices.",
      "Enter type as sc, bcc, or fcc in the text field (default example: fcc ≈ 74%).",
    ],
    {
      question: "How do I choose the type?",
      answer: 'Type "sc", "bcc", or "fcc" (case-insensitive) in the lattice-type field.',
    },
    "Packing Efficiency Calculator — SC BCC FCC",
    "Look up ideal packing efficiency for sc, bcc, or fcc crystal lattices.",
    ["packing efficiency calculator", "fcc packing percentage", "bcc sc packing"],
    "sparkTrendDemo",
  ),
  "crystal-structure-calculator": article(
    "crystal-structure-calculator",
    "Crystal structure",
    [
      "For sc / bcc / fcc with edge a: reports Z (atoms per cell), nearest-neighbor distance, and packing %.",
      "Nearest neighbor uses a, (√3/2)a, or (√2/2)a for sc, bcc, and fcc respectively.",
    ],
    {
      question: "Is this for ionic compounds?",
      answer: "This is the elemental cubic hard-sphere teaching model; ionic radii packings need a different treatment.",
    },
    "Crystal Structure Calculator — SC BCC FCC Metrics",
    "Compute Z, nearest-neighbor distance, and packing % for cubic crystal types.",
    ["crystal structure calculator", "nearest neighbor fcc", "atoms per unit cell"],
    "none",
  ),
};
