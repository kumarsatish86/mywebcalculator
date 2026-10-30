import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/currency/cur-bonus-micro-niche";
const HUB_LABEL = "Conversion · Currency · High-intent currency micro-tools";
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
        title: "India micro currency tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["USD/INR today", "Amount × example USD/INR"],
          ["Best rate India", "Compare provider A vs B"],
          ["Send abroad", "(INR − fees) × rate"],
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

export const CUR_MICRO_ARTICLES: Record<string, RichArticle> = {
  "cur-usd-to-inr-today-calculator": article(
    "cur-usd-to-inr-today-calculator",
    "USD to INR Today Calculator",
    ["Illustrative “today” USD→INR (example ~83).", "High-intent India lookup teaching form — not live ticker."],
    { question: "Why “today” if not live?", answer: "The label reflects search intent. Replace default with today’s quote from your source." },
    "USD to INR Today Calculator — Example Rate",
    "Convert USD to INR with editable example rate. Not a live quote.",
    ["usd to inr today", "dollar rate today india"],
  ),
  "cur-best-exchange-rate-india-calculator": article(
    "cur-best-exchange-rate-india-calculator",
    "Best Exchange Rate Calculator India",
    ["Compares two provider illustrative rates for INR received.", "Shop remittance apps and banks with real quotes."],
    { question: "Which provider is best?", answer: "Depends on amount, speed, and fees. Compare all-in received INR." },
    "Best Exchange Rate Calculator India",
    "Compare two example INR rates for the same amount. Illustrative comparison.",
    ["best exchange rate india", "inr rate comparison"],
  ),
  "cur-send-money-abroad-india-calculator": article(
    "cur-send-money-abroad-india-calculator",
    "Send Money Abroad Calculator India",
    ["Abroad received = (INR send − fees) × illustrative rate.", "Outbound from India teaching remittance sketch."],
    { question: "LRS limits?", answer: "India LRS rules apply separately. This tool only models amount, fees, and rate." },
    "Send Money Abroad Calculator India",
    "Estimate foreign received from INR send with fees and example rate.",
    ["send money abroad india calculator", "lrs remittance estimate"],
  ),
  "cur-dollar-rate-india-calculator": article(
    "cur-dollar-rate-india-calculator",
    "Dollar Rate in India Calculator",
    ["Amount × illustrative USD/INR.", "Popular search helper for dollar–rupee teaching estimates."],
    { question: "Interbank vs retail?", answer: "Retail rates include spread. Enter the rate your channel offers." },
    "Dollar Rate in India Calculator",
    "Convert dollars to rupees with example USD/INR. Not live data.",
    ["dollar rate india", "usd inr india calculator"],
  ),
  "cur-rupee-depreciation-calculator": article(
    "cur-rupee-depreciation-calculator",
    "Rupee Depreciation Calculator",
    ["INR depreciation% vs USD ≈ (new − old) ÷ old × 100 on USD/INR.", "Higher USD/INR means weaker rupee in this convention."],
    { question: "Is depreciation always bad?", answer: "Depends on imports vs exports and your holdings — economics, not covered here." },
    "Rupee Depreciation Calculator — USD/INR Move",
    "Compute rupee depreciation % from earlier and later USD/INR. Teaching metric.",
    ["rupee depreciation calculator", "inr depreciation vs dollar"],
  ),
  "cur-currency-converter-offline-logic-tool": article(
    "cur-currency-converter-offline-logic-tool",
    "Currency Converter Without Internet (Offline Logic Tool)",
    ["Offline logic = amount × stored illustrative rate.", "No network — you maintain the rate manually."],
    { question: "How often update offline rate?", answer: "When you last synced a quote. Stale rates mislead — refresh when online." },
    "Offline Currency Converter Logic Tool",
    "Convert using a stored example rate without live feeds. Teaching offline math.",
    ["offline currency converter", "currency converter without internet"],
  ),
};
