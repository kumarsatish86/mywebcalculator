import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/chemistry-bonus-micro";
const HUB_LABEL = "Education · Science · Chemistry Bonus Micro Tools";
const SHELL =
  "Classroom periodic-table and electron-structure helpers. Educational models only — not a substitute for a full periodic table reference or lab certification.";

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
        title: "Chemistry bonus micro tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Periodic lookup", "Z or symbol → mini table"],
          ["Valency finder", "Group → typical valency"],
          ["Oxidation state", "Charge-balance solve"],
          ["Electron config", "Aufbau Z = 1–36"],
          ["Orbital diagram", "Text ↑↓ boxes"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your chemistry inputs. Educational helpers only.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Electron shell idea",
            caption: "Share URL preserves your chemistry inputs. Educational helpers only.",
            sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CHEMISTRY_BONUS_MICRO_ARTICLES: Record<string, RichArticle> = {
  "periodic-table-interactive-tool": article(
    "periodic-table-interactive-tool",
    "Periodic table lookup",
    [
      "Look up common elements by atomic number or chemical symbol in a mini teaching table.",
      "Not a full periodic table — only frequently used classroom elements are included.",
    ],
    {
      question: "Why is my element missing?",
      answer: "This mini table covers common teaching elements only. Use a full periodic table for others.",
    },
    "Periodic Table Interactive Tool — Symbol & Z Lookup",
    "Look up common elements by atomic number or symbol in an educational mini table.",
    ["periodic table tool", "element lookup", "atomic number symbol"],
    "sparkTrendDemo",
  ),
  "valency-finder": article(
    "valency-finder",
    "Valency finder",
    [
      "Suggests a typical main-group valency from periodic group number (simplified heuristic).",
      "Transition metals vary — classroom defaults are not absolute rules.",
    ],
    {
      question: "Does group always equal valency?",
      answer: "No — this tool uses simplified teaching patterns, especially for main-group elements.",
    },
    "Valency Finder — Group to Typical Valency",
    "Estimate typical valency from periodic group for educational chemistry.",
    ["valency finder", "periodic group valency", "bonding capacity education"],
    "none",
  ),
  "oxidation-state-calculator": article(
    "oxidation-state-calculator",
    "Oxidation state",
    [
      "Solves an unknown oxidation number from known oxidation, atom counts, and total charge.",
      "Charge-balance classroom arithmetic for simple ionic/molecular teaching examples.",
    ],
    {
      question: "Does this handle polyatomic edge cases?",
      answer: "It solves the linear charge-balance equation you set up — verify your atom counts carefully.",
    },
    "Oxidation State Calculator — Charge Balance",
    "Solve unknown oxidation states from charge balance for educational chemistry.",
    ["oxidation state calculator", "oxidation number", "charge balance chemistry"],
    "sparkTrendDemo",
  ),
  "electron-configuration-calculator": article(
    "electron-configuration-calculator",
    "Electron configuration",
    [
      "Builds an Aufbau-style configuration for atomic numbers Z = 1–36.",
      "Educational orbital filling — exceptions (Cr, Cu, …) may be simplified.",
    ],
    {
      question: "Are Cr and Cu exceptions handled?",
      answer: "This teaching filler follows a simple orbital order; check your textbook for known exceptions.",
    },
    "Electron Configuration Calculator — Z 1 to 36",
    "Generate educational electron configurations for Z = 1–36.",
    ["electron configuration calculator", "Aufbau principle", "orbital filling education"],
    "none",
  ),
  "orbital-diagram-generator": article(
    "orbital-diagram-generator",
    "Orbital diagram",
    [
      "Turns the electron configuration into text orbital boxes with ↑↓ electron markers.",
      "Useful for classroom visualization of orbital occupancy (Z = 1–36).",
    ],
    {
      question: "Is this a full Hund-rule diagram?",
      answer: "It shows paired ↑↓ text boxes from occupancy counts — a simplified teaching view.",
    },
    "Orbital Diagram Generator — Text Electron Boxes",
    "Generate educational orbital diagrams from atomic number Z = 1–36.",
    ["orbital diagram generator", "electron orbital boxes", "Hund rule education"],
    "sparkTrendDemo",
  ),
};
