import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/currency/cur-advanced-tools";
const HUB_LABEL = "Conversion · Currency · Advanced currency conversion tools";
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
        title: "Advanced currency tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Multi-currency", "One amount × several rates"],
          ["Bulk / reverse", "Rows or target ÷ rate"],
          ["Fees / compare", "Net after spread and fees"],
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

export const CUR_ADVANCED_ARTICLES: Record<string, RichArticle> = {
  "cur-multi-currency-converter": article(
    "cur-multi-currency-converter",
    "Multi-Currency Converter",
    [
      "Shows one home amount converted through three illustrative rates at once.",
      "Useful for comparing how the same sum lands in different destination currencies in a teaching scenario.",
    ],
    {
      question: "Can I use live rates for all three?",
      answer: "Yes — replace each example rate with quotes from your sources. Defaults are illustrative only.",
    },
    "Multi-Currency Converter — Illustrative FX",
    "Convert one amount through three example rates. Teaching estimate — not live data.",
    ["multi currency converter", "fx comparison calculator"],
  ),
  "cur-bulk-currency-converter-csv": article(
    "cur-bulk-currency-converter-csv",
    "Bulk Currency Converter (Upload CSV)",
    [
      "Teaching proxy: per-row amount × rate × row count for bulk conversion sketches.",
      "Real CSV upload workflows need your own file — this browser tool models the math.",
    ],
    {
      question: "Does this upload my CSV?",
      answer: "No file upload in this teaching form — enter per-row amount, rate, and row count manually.",
    },
    "Bulk Currency Converter — Teaching Estimate",
    "Model bulk FX conversion with rows × amount × rate. Illustrative rates only.",
    ["bulk currency converter", "csv fx calculator"],
  ),
  "cur-reverse-currency-calculator": article(
    "cur-reverse-currency-calculator",
    "Reverse Currency Calculator",
    [
      "Finds source amount needed: target ÷ illustrative rate.",
      "Helpful when you know how much destination currency you need but not the home-currency send amount.",
    ],
    {
      question: "Does this include fees?",
      answer: "Not in the basic reverse form. Use the conversion-with-fees tool for net-after-fee estimates.",
    },
    "Reverse Currency Calculator — Source Amount",
    "Compute source needed from target and example rate. Teaching FX estimate.",
    ["reverse currency calculator", "backwards fx calculator"],
  ),
  "cur-currency-rate-comparison-tool": article(
    "cur-currency-rate-comparison-tool",
    "Currency Rate Comparison Tool",
    [
      "Compares two illustrative quotes for the same amount and highlights the better outcome.",
      "Models shopping between providers — always confirm live quotes before transferring.",
    ],
    {
      question: "Which quote is “better”?",
      answer: "The one that yields more destination currency for the same source amount in this comparison.",
    },
    "Currency Rate Comparison — Two Quotes",
    "Compare two example FX quotes for the same amount. Illustrative teaching tool.",
    ["currency rate comparison", "best fx quote calculator"],
  ),
  "cur-currency-conversion-with-fees": article(
    "cur-currency-conversion-with-fees",
    "Currency Conversion Calculator with Fees",
    [
      "Applies percent and fixed fees before multiplying by an illustrative rate.",
      "Shows how fees shrink the effective amount converted — a common remittance teaching point.",
    ],
    {
      question: "Are fees always percent plus fixed?",
      answer: "Providers differ. Enter the fee structure your bank or app discloses.",
    },
    "Currency Conversion with Fees — Net FX",
    "Convert after % and fixed fees with an example rate. Not live data.",
    ["currency conversion fees", "fx fee calculator"],
  ),
  "cur-currency-converter-historical-rates": article(
    "cur-currency-converter-historical-rates",
    "Currency Converter with Historical Rates",
    [
      "Multiplies amount by a past illustrative rate you enter manually.",
      "Useful for understanding what a historical rate would have produced — not for backtesting investments.",
    ],
    {
      question: "Where do historical rates come from?",
      answer: "You enter them. This tool does not fetch archives — it applies the rate you provide.",
    },
    "Historical Rates Currency Converter",
    "Convert with a past example rate you enter. Teaching estimate only.",
    ["historical currency converter", "past fx rate calculator"],
  ),
};
