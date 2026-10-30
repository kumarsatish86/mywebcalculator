import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/currency/cur-inflation-value";
const HUB_LABEL = "Conversion · Currency · Inflation and purchasing power calculators";
const SHELL =
  "Teaching currency conversion estimates that run in your browser. Illustrative FX rates and fees — not live market data. Verify amounts with your bank, exchange, or a live quote before transacting.";
const CHART = {
  kind: "none" as const,
  title: "Overview",
  caption: "Share URL preserves your inputs. Illustrative rates only — not live data.",
};

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "conversion",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Inflation and value tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Inflation", "Future nominal ≈ amount × (1+i)^t"],
          ["Purchasing power", "Real ≈ amount ÷ (1+i)^t"],
          ["COL compare", "Equivalent income across baskets"],
        ],
      },
    ],
    chart: CHART,
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CUR_INFLATION_ARTICLES: Record<string, RichArticle> = {
  "cur-inflation-calculator-currency-value": article(
    "cur-inflation-calculator-currency-value",
    "Inflation Calculator (Currency Value Over Time)",
    ["Future nominal ≈ amount × (1+i)^years.", "Compound inflation teaching form — constant rate assumption."],
    { question: "Is inflation constant?", answer: "Real economies vary yearly. Use average i for long sketches only." },
    "Inflation Calculator — Currency Value Over Time",
    "Project nominal future value with inflation % and years. Teaching estimate.",
    ["inflation calculator currency", "future value inflation"],
  ),
  "cur-purchasing-power-calculator": article(
    "cur-purchasing-power-calculator",
    "Purchasing Power Calculator",
    ["Real value ≈ amount ÷ (1+i)^years.", "Shows what today’s money “feels like” in past purchasing terms."],
    { question: "Nominal vs real?", answer: "Nominal is face value; real adjusts for inflation purchasing power." },
    "Purchasing Power Calculator — Real Value",
    "Compute inflation-adjusted purchasing power. Illustrative rate input.",
    ["purchasing power calculator", "real value inflation"],
  ),
  "cur-historical-currency-value-calculator": article(
    "cur-historical-currency-value-calculator",
    "Historical Currency Value Calculator",
    ["Scaled value ≈ amount × (past rate ÷ current rate).", "FX-based historical scaling — not CPI inflation."],
    { question: "Is this CPI inflation?", answer: "No — this scales by exchange-rate ratio you enter, not consumer prices." },
    "Historical Currency Value Calculator",
    "Scale amount by past vs current illustrative rates. Teaching FX history aid.",
    ["historical currency value", "past fx value calculator"],
  ),
  "cur-cost-of-living-comparison-tool": article(
    "cur-cost-of-living-comparison-tool",
    "Cost of Living Comparison Tool",
    ["Equivalent income in B ≈ incomeA × (basketB ÷ basketA).", "Compares baskets as price indexes you provide."],
    { question: "Where do basket values come from?", answer: "Enter representative monthly basket costs for each city — illustrative indexes." },
    "Cost of Living Comparison Tool",
    "Compare equivalent income across two basket indexes. Teaching COL estimate.",
    ["cost of living comparison", "col calculator currency"],
  ),
};
