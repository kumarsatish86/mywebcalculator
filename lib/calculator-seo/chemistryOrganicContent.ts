import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/chemistry-organic";
const HUB_LABEL = "Education · Science · Chemistry Organic";
const SHELL =
  "Educational organic-chemistry helpers for classroom drills. Teaching models only — not full IUPAC naming, structure elucidation, or live AI reaction prediction.";

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
        title: "Organic chemistry tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Hydrocarbon formula", "CnH2n+2 / CnH2n / CnH2n−2"],
          ["Degree of unsaturation", "DU = (2C+2+N−H−X)/2"],
          ["IUPAC teaching name", "Unbranched stems n=1–10"],
          ["Functional group", "Keyword → teaching label"],
          ["Reaction patterns", "Rule-based presets"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your organic inputs. Educational models only.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Carbon-chain idea",
            caption: "Share URL preserves your organic inputs. Educational models only.",
            sparkValues: [1, 2, 3, 4, 5, 6, 8],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CHEMISTRY_ORGANIC_ARTICLES: Record<string, RichArticle> = {
  "hydrocarbon-formula-calculator": article(
    "hydrocarbon-formula-calculator",
    "Hydrocarbon molecular formula",
    [
      "Enter carbon count n and kind alkane, alkene, or alkyne for open-chain general formulas.",
      "Alkane CnH2n+2, alkene CnH2n (n≥2), alkyne CnH2n−2 (n≥2).",
    ],
    {
      question: "Does this include cycloalkanes?",
      answer: "No — this teaching tool uses open-chain general formulas only.",
    },
    "Hydrocarbon Formula Calculator — Alkane Alkene Alkyne",
    "Find Cn hydrocarbon formulas for alkanes, alkenes, and alkynes from carbon count n.",
    ["hydrocarbon formula calculator", "CnH2n+2", "alkane alkene alkyne formula"],
    "sparkTrendDemo",
  ),
  "degree-of-unsaturation-calculator": article(
    "degree-of-unsaturation-calculator",
    "Degree of unsaturation (DU)",
    [
      "DU = (2C + 2 + N − H − X) / 2 from atom counts C, H, N, and halogens X.",
      "Each ring or π bond contributes one unit of unsaturation in this teaching model.",
    ],
    {
      question: "How are oxygen atoms treated?",
      answer: "Oxygen does not appear in the DU formula; omit O from the atom counts.",
    },
    "Degree of Unsaturation Calculator — DU from Atom Counts",
    "Calculate degree of unsaturation from C, H, N, and halogen atom counts.",
    ["degree of unsaturation calculator", "DBE calculator", "rings and double bonds"],
    "none",
  ),
  "iupac-name-generator-advanced-tool": article(
    "iupac-name-generator-advanced-tool",
    "IUPAC teaching name helper",
    [
      "Maps unbranched Cn hydrocarbons (n = 1–10) to alkane/alkene/alkyne stem names.",
      "Not a full IUPAC name generator — no locants, branches, or stereodescriptors.",
    ],
    {
      question: "Why limited to n ≤ 10?",
      answer: "This classroom helper uses a fixed stem list through decane for teaching drills.",
    },
    "IUPAC Name Generator Teaching Tool — Unbranched Cn",
    "Get teaching hydrocarbon stems for alkanes, alkenes, and alkynes (n = 1–10).",
    ["iupac name generator", "alkane naming", "hydrocarbon stem names"],
    "sparkTrendDemo",
  ),
  "functional-group-identifier": article(
    "functional-group-identifier",
    "Functional group keyword match",
    [
      "Enter a keyword such as OH, alcohol, COOH, aldehyde, ketone, amine, ether, ester, or amide.",
      "Returns a short teaching description — not structure recognition from drawings.",
    ],
    {
      question: "What if nothing matches?",
      answer: "Try a simpler keyword from the preset list; unmatched text returns a help hint.",
    },
    "Functional Group Identifier — Organic Chemistry Keywords",
    "Identify common organic functional groups from keywords for classroom chemistry.",
    ["functional group identifier", "organic functional groups", "alcohol ketone carboxylic acid"],
    "none",
  ),
  "organic-reaction-predictor-ai-future": article(
    "organic-reaction-predictor-ai-future",
    "Organic reaction teaching patterns",
    [
      "Rule-based presets for common teaching reactions (e.g. alkene+H2, esterification, SN2).",
      "Not a live AI predictor — educational pattern matching only.",
    ],
    {
      question: "Which queries work?",
      answer: "Try alkene+H2, alkane+Br2, alcohol+oxid, esterification, or SN2.",
    },
    "Organic Reaction Predictor — Teaching Pattern Tool",
    "Match short reaction hints to rule-based organic chemistry teaching patterns.",
    ["organic reaction predictor", "alkene hydrogenation", "esterification teaching"],
    "sparkTrendDemo",
  ),
};
