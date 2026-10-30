import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/currency/cur-business-ecommerce";
const HUB_LABEL = "Conversion · Currency · Business and e-commerce currency tools";
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
        title: "Business currency tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Import landed", "Goods×FX + duty + freight"],
          ["Pricing", "Cost×FX × (1 + margin%)"],
          ["Margin", "(sell − cost×FX) ÷ sell"],
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

export const CUR_BUSINESS_ARTICLES: Record<string, RichArticle> = {
  "cur-import-export-cost-calculator": article(
    "cur-import-export-cost-calculator",
    "Import/Export Cost Calculator",
    ["Landed ≈ goods×FX + duty + freight.", "Teaching import cost stack before margin."],
    { question: "Are duties always percent of local value?", answer: "Rules vary by HS code and country. Enter your duty % as an example." },
    "Import Export Cost Calculator — Landed Cost",
    "Estimate landed import cost with FX, duty, and freight. Illustrative rates.",
    ["import export cost calculator", "landed cost fx"],
  ),
  "cur-currency-pricing-calculator": article(
    "cur-currency-pricing-calculator",
    "Currency Pricing Calculator",
    ["Price = cost×FX × (1 + margin%).", "Cross-border cost-plus pricing sketch."],
    { question: "Should margin be on cost or price?", answer: "This form applies margin on converted cost. Markup-on-price differs." },
    "Currency Pricing Calculator — Margin on Cost",
    "Price foreign cost with FX and margin %. Teaching business estimate.",
    ["currency pricing calculator", "fx pricing tool"],
  ),
  "cur-cross-border-pricing-calculator": article(
    "cur-cross-border-pricing-calculator",
    "Cross-border Pricing Calculator",
    ["Home list ≈ (local ÷ FX) × (1 + markup%).", "Translates local shelf price to home currency list."],
    { question: "Which FX direction?", answer: "Enter home per local unit as documented in the tool — consistent with your invoice flow." },
    "Cross-border Pricing Calculator",
    "Convert local price to home list with FX and markup. Example rates only.",
    ["cross border pricing calculator", "international list price"],
  ),
  "cur-shopify-currency-converter-tool": article(
    "cur-shopify-currency-converter-tool",
    "Shopify Currency Converter Tool",
    ["Storefront display ≈ price × illustrative FX.", "Models multi-currency display rounding separately in Shopify admin."],
    { question: "Does Shopify use mid-market?", answer: "Shopify Payments FX policies vary. This is a manual teaching multiplier." },
    "Shopify Currency Converter — Display Price",
    "Estimate storefront converted price with example FX. Not Shopify live rates.",
    ["shopify currency converter", "ecommerce fx display"],
  ),
  "cur-international-pricing-margin-calculator": article(
    "cur-international-pricing-margin-calculator",
    "International Pricing Margin Calculator",
    ["Margin% = (sell − cost×FX) ÷ sell × 100.", "Shows margin after FX conversion of foreign cost."],
    { question: "Gross or net margin?", answer: "This is gross before operating expenses and tax." },
    "International Pricing Margin Calculator",
    "Compute margin after converting foreign cost with example FX.",
    ["international pricing margin", "cross border margin calculator"],
  ),
};
