import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/currency/cur-time-based";
const HUB_LABEL = "Conversion · Currency · Time-based currency tools";
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
        title: "Time-based currency tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["History snapshot", "Start/end/high/low average"],
          ["Trend", "Change% over period"],
          ["Volatility", "(high − low) ÷ mid"],
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

export const CUR_TIME_ARTICLES: Record<string, RichArticle> = {
  "cur-currency-rate-history-chart": article(
    "cur-currency-rate-history-chart",
    "Currency Rate History Chart",
    ["Snapshot from start, end, high, and low rates you enter.", "Teaching summary — not a fetched time series."],
    { question: "Does this chart live data?", answer: "No chart fetch — you supply four illustrative rate points." },
    "Currency Rate History Chart — Snapshot",
    "Summarize start/end/high/low FX snapshot. Illustrative teaching data.",
    ["currency rate history", "fx history chart calculator"],
  ),
  "cur-currency-trend-analyzer": article(
    "cur-currency-trend-analyzer",
    "Currency Trend Analyzer",
    ["Change% = (end − start) ÷ start × 100.", "Simple directional move over your chosen window."],
    { question: "Is positive change always good?", answer: "Depends which currency you hold and need. Direction is pair-specific." },
    "Currency Trend Analyzer — Change Percent",
    "Compute FX percent change from start to end rates. Example inputs only.",
    ["currency trend analyzer", "fx trend calculator"],
  ),
  "cur-best-time-to-exchange-calculator": article(
    "cur-best-time-to-exchange-calculator",
    "Best Time to Exchange Currency Calculator",
    ["Compares two illustrative rates for the same amount.", "Labels which option yields more destination currency."],
    { question: "Can I time the market?", answer: "FX is uncertain. This compares two quotes you enter — not a timing signal." },
    "Best Time to Exchange Calculator",
    "Compare two example FX rates for the same amount. Teaching comparison.",
    ["best time to exchange currency", "fx timing calculator"],
  ),
  "cur-currency-volatility-calculator": article(
    "cur-currency-volatility-calculator",
    "Currency Volatility Calculator",
    ["Range vol% ≈ (high − low) ÷ mid × 100.", "Simple range-based volatility proxy."],
    { question: "Is this standard deviation?", answer: "No — this uses high-low range over mid, not statistical σ." },
    "Currency Volatility Calculator — Range Method",
    "Estimate range volatility from high and low rates. Teaching metric.",
    ["currency volatility calculator", "fx volatility range"],
  ),
};
