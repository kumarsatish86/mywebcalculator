import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/currency/cur-basic-core";
const HUB_LABEL = "Conversion · Currency · Basic currency converters";
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
        title: "Basic currency tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Global converter", "Amount × illustrative rate"],
          ["Pair converters", "USD/INR, EUR/USD, and more"],
          ["Crypto to fiat", "Units × example price"],
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

export const CUR_BASIC_ARTICLES: Record<string, RichArticle> = {
  "cur-currency-converter-global": article(
    "cur-currency-converter-global",
    "Currency Converter (Global)",
    [
      "Multiply any amount by an illustrative FX rate you enter — a teaching proxy for everyday conversions.",
      "Default rates are examples only; swap in your bank quote or a live feed before spending or sending money.",
    ],
    {
      question: "Are these live exchange rates?",
      answer: "No. Defaults are illustrative teaching examples. Always verify with your bank or a live quote.",
    },
    "Currency Converter (Global) — Illustrative FX Estimate",
    "Teaching global currency conversion with example rates. Not live market data — verify before transacting.",
    ["cur-currency-converter-global", "currency converter", "global fx calculator"],
  ),
  "cur-usd-to-inr-converter": article(
    "cur-usd-to-inr-converter",
    "USD to INR Converter",
    [
      "Converts USD to INR using an illustrative USD/INR rate you can edit.",
      "Useful for remittance planning sketches — confirm the live rate with your provider before sending.",
    ],
    {
      question: "What USD/INR rate should I use?",
      answer: "Use your bank or remittance app quote. The default here is an illustrative teaching example only.",
    },
    "USD to INR Converter — Illustrative Rate",
    "Convert USD to INR with an editable example rate. Teaching estimate — not a live quote.",
    ["usd to inr converter", "dollar to rupee calculator"],
  ),
  "cur-inr-to-usd-converter": article(
    "cur-inr-to-usd-converter",
    "INR to USD Converter",
    [
      "Converts INR to USD by multiplying by an illustrative INR/USD rate (inverse of USD/INR).",
      "Helpful for understanding how much foreign currency INR buys in a teaching scenario.",
    ],
    {
      question: "Is INR/USD the same as 1 ÷ USD/INR?",
      answer: "Yes for a direct pair. Banks may add spreads, so live received amounts can differ.",
    },
    "INR to USD Converter — Illustrative Rate",
    "Convert INR to USD with an example rate. Teaching FX estimate — verify live quotes.",
    ["inr to usd converter", "rupee to dollar calculator"],
  ),
  "cur-eur-to-usd-converter": article(
    "cur-eur-to-usd-converter",
    "EUR to USD Converter",
    [
      "Multiplies EUR amount by an illustrative EUR/USD example rate.",
      "Common for travel and invoice sketches when you already know a rough cross rate.",
    ],
    {
      question: "Why use an example EUR/USD?",
      answer: "This tool teaches the math. Replace the default with your card or bank quote for real purchases.",
    },
    "EUR to USD Converter — Illustrative Rate",
    "Convert EUR to USD with an editable example rate. Not live market data.",
    ["eur to usd converter", "euro dollar calculator"],
  ),
  "cur-gbp-to-inr-converter": article(
    "cur-gbp-to-inr-converter",
    "GBP to INR Converter",
    [
      "Converts British pounds to Indian rupees using an illustrative GBP/INR rate.",
      "Handy for UK–India remittance and tuition fee planning estimates.",
    ],
    {
      question: "Do UK banks use the same GBP/INR?",
      answer: "No — each provider adds markup. Enter your quote in the rate field for a closer plan.",
    },
    "GBP to INR Converter — Illustrative Rate",
    "Convert GBP to INR with an example rate. Teaching estimate only.",
    ["gbp to inr converter", "pound rupee calculator"],
  ),
  "cur-aed-to-inr-converter": article(
    "cur-aed-to-inr-converter",
    "AED to INR Converter",
    [
      "Converts UAE dirhams to Indian rupees with an illustrative AED/INR rate.",
      "Popular for Gulf remittance teaching scenarios.",
    ],
    {
      question: "Is the AED pegged to USD?",
      answer: "Yes — AED is pegged near 3.67 per USD, but INR crosses still move with USD/INR.",
    },
    "AED to INR Converter — Illustrative Rate",
    "Convert AED to INR with an example rate. Verify live remittance quotes.",
    ["aed to inr converter", "dirham rupee calculator"],
  ),
  "cur-sgd-to-inr-converter": article(
    "cur-sgd-to-inr-converter",
    "SGD to INR Converter",
    [
      "Converts Singapore dollars to INR using an illustrative SGD/INR rate.",
      "Useful for Singapore–India transfers and expense planning sketches.",
    ],
    {
      question: "Should I use mid-market or bank rate?",
      answer: "For planning, use the rate your provider quotes. Mid-market is a reference, not what you receive.",
    },
    "SGD to INR Converter — Illustrative Rate",
    "Convert SGD to INR with an example rate. Teaching FX estimate.",
    ["sgd to inr converter", "singapore dollar rupee"],
  ),
  "cur-cad-to-inr-converter": article(
    "cur-cad-to-inr-converter",
    "CAD to INR Converter",
    [
      "Converts Canadian dollars to INR with an illustrative CAD/INR rate.",
      "Helpful for students and workers comparing CAD remittance scenarios.",
    ],
    {
      question: "Why does CAD/INR differ from USD/INR?",
      answer: "CAD/USD moves independently. Use a CAD/INR quote, not USD/INR alone.",
    },
    "CAD to INR Converter — Illustrative Rate",
    "Convert CAD to INR with an example rate. Not live data.",
    ["cad to inr converter", "canadian dollar rupee"],
  ),
  "cur-aud-to-inr-converter": article(
    "cur-aud-to-inr-converter",
    "AUD to INR Converter",
    [
      "Converts Australian dollars to INR using an illustrative AUD/INR rate.",
      "Common for Australia–India remittance teaching estimates.",
    ],
    {
      question: "Are weekend rates different?",
      answer: "Many providers freeze or widen spreads on weekends. Confirm when your transfer executes.",
    },
    "AUD to INR Converter — Illustrative Rate",
    "Convert AUD to INR with an example rate. Verify with your provider.",
    ["aud to inr converter", "australian dollar rupee"],
  ),
  "cur-crypto-to-fiat-converter": article(
    "cur-crypto-to-fiat-converter",
    "Crypto to Fiat Converter",
    [
      "Multiplies crypto units by an illustrative fiat price you enter.",
      "Teaches unit conversion — not portfolio valuation or tax reporting.",
    ],
    {
      question: "Is this a live crypto price?",
      answer: "No. Enter an example price or paste a recent quote. Exchanges vary by second.",
    },
    "Crypto to Fiat Converter — Illustrative Price",
    "Convert crypto units to fiat with an example price. Not live market data.",
    ["crypto to fiat converter", "bitcoin fiat calculator"],
  ),
};
