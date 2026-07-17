import type { RichArticle } from "./types";

const HUB_HREF = "/education/science/chemistry-industrial";
const HUB_LABEL = "Education · Science · Chemistry Industrial & Applied";
const SHELL =
  "Educational industrial and process-chemistry arithmetic for classroom use. Simplified models only — not plant design, process safety certification, or operating advice.";

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
        title: "Industrial chemistry tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Process yield", "actual / theoretical × 100"],
          ["Reactor volume", "V = Fτ or F/SV"],
          ["Conversion", "reacted / fed"],
          ["Material balance", "in − out − cons + gen"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? {
            kind: "none",
            title: "Overview",
            caption: "Share URL preserves your process inputs. Educational models only.",
          }
        : {
            kind: "sparkTrendDemo",
            title: "Process yield idea",
            caption: "Share URL preserves your process inputs. Educational models only.",
            sparkValues: [0.3, 0.45, 0.6, 0.72, 0.85, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CHEMISTRY_INDUSTRIAL_ARTICLES: Record<string, RichArticle> = {
  "chemical-process-yield-calculator": article(
    "chemical-process-yield-calculator",
    "Process yield",
    [
      "Percent yield = (actual amount ÷ theoretical amount) × 100.",
      "Educational process metric — not a plant performance guarantee.",
    ],
    {
      question: "Can actual exceed theoretical?",
      answer: "The formula still computes a percentage; values over 100% usually signal measurement or basis errors.",
    },
    "Chemical Process Yield Calculator — Actual vs Theoretical",
    "Calculate percent process yield from actual and theoretical amounts for education.",
    ["process yield calculator", "percent yield chemistry", "actual theoretical yield"],
    "sparkTrendDemo",
  ),
  "reactor-volume-calculator": article(
    "reactor-volume-calculator",
    "Reactor volume",
    [
      "Default mode tau: V = volumetric flow × residence time.",
      "Mode sv: V = flow ÷ space velocity. Educational sizing arithmetic only.",
    ],
    {
      question: "What is the default mode?",
      answer: 'Enter "tau" (default) for residence-time sizing or "sv" for space-velocity sizing.',
    },
    "Reactor Volume Calculator — Flow × τ or Flow / SV",
    "Estimate reactor volume from flow and residence time or space velocity — educational use.",
    ["reactor volume calculator", "residence time reactor", "space velocity volume"],
    "none",
  ),
  "conversion-efficiency-calculator": article(
    "conversion-efficiency-calculator",
    "Conversion efficiency",
    [
      "Conversion = reacted ÷ fed (also shown as percent).",
      "Educational reactor-conversion math — reacted cannot exceed fed.",
    ],
    {
      question: "Is conversion the same as yield?",
      answer: "No — conversion tracks reactant consumed; yield compares product to theoretical product.",
    },
    "Conversion Efficiency Calculator — Reacted / Fed",
    "Calculate reactant conversion from reacted and fed amounts for educational process math.",
    ["conversion efficiency calculator", "reactor conversion", "reacted fed chemistry"],
    "sparkTrendDemo",
  ),
  "material-balance-calculator": article(
    "material-balance-calculator",
    "Material balance",
    [
      "Accumulation = inlet − outlet − consumed + generated.",
      "Flags a nearly closed balance when accumulation is ~0. Classroom steady-state check.",
    ],
    {
      question: "What does closed balance mean?",
      answer: "Accumulation near zero — the teaching streams roughly satisfy a steady-state balance.",
    },
    "Material Balance Calculator — In Out Consumed Generated",
    "Compute accumulation for a simple educational material balance.",
    ["material balance calculator", "process mass balance", "accumulation chemistry"],
    "none",
  ),
};
