import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/currency/cur-forex-trading";
const HUB_LABEL = "Conversion · Currency · Forex and trading calculators";
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
        title: "Forex trading tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Profit / lots", "P/L from entry, exit, size"],
          ["Pip / margin", "Pip value and required margin"],
          ["Risk", "R:R, stop, position size"],
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

export const CUR_FOREX_ARTICLES: Record<string, RichArticle> = {
  "cur-forex-profit-calculator": article(
    "cur-forex-profit-calculator",
    "Forex Profit Calculator",
    ["Estimates P/L from entry, exit, lots, and contract size.", "Teaching form only — real P/L includes spread, swap, and slippage."],
    { question: "Is this live trading P/L?", answer: "No. Illustrative contract math for learning — not a broker statement." },
    "Forex Profit Calculator — Teaching P/L",
    "Estimate FX profit from entry, exit, and lot size. Illustrative — not live trading data.",
    ["forex profit calculator", "fx pnl calculator"],
  ),
  "cur-forex-lot-size-calculator": article(
    "cur-forex-lot-size-calculator",
    "Forex Lot Size Calculator",
    ["Lots ≈ risk ÷ (stop pips × pip value per lot).", "Core risk-management teaching formula for position sizing."],
    { question: "What pip value should I use?", answer: "Depends on pair and account currency. Enter your broker’s pip value per lot." },
    "Forex Lot Size Calculator — Risk-Based",
    "Size lots from risk amount, stop pips, and pip value. Teaching estimate.",
    ["forex lot size calculator", "position lot calculator"],
  ),
  "cur-pip-value-calculator": article(
    "cur-pip-value-calculator",
    "Pip Value Calculator",
    ["Pip value ≈ lots × contract × pip size.", "Helps translate pip moves into account currency for study."],
    { question: "What is pip size?", answer: "Often 0.0001 for most pairs, 0.01 for JPY quotes — confirm your broker convention." },
    "Pip Value Calculator — Teaching Form",
    "Compute pip value from lots, contract, and pip size. Illustrative FX study aid.",
    ["pip value calculator", "forex pip calculator"],
  ),
  "cur-margin-calculator-forex": article(
    "cur-margin-calculator-forex",
    "Margin Calculator (Forex)",
    ["Margin ≈ (lots × contract × price) ÷ leverage.", "Shows collateral needed for a leveraged FX notionally."],
    { question: "Does margin equal max loss?", answer: "No — margin is collateral. Losses can exceed margin on volatile moves without stops." },
    "Forex Margin Calculator — Collateral Estimate",
    "Estimate required margin from lots, price, and leverage. Teaching only.",
    ["forex margin calculator", "fx margin requirement"],
  ),
  "cur-leverage-calculator": article(
    "cur-leverage-calculator",
    "Leverage Calculator",
    ["Leverage ≈ notional ÷ margin.", "Expresses how much exposure you control per unit of collateral."],
    { question: "Is higher leverage safer?", answer: "No — higher leverage magnifies both gains and losses. This tool only computes the ratio." },
    "Leverage Calculator — Notional ÷ Margin",
    "Compute leverage from notional and margin. Educational FX estimate.",
    ["leverage calculator forex", "fx leverage ratio"],
  ),
  "cur-risk-reward-ratio-calculator": article(
    "cur-risk-reward-ratio-calculator",
    "Risk/Reward Ratio Calculator",
    ["R:R = reward ÷ risk.", "Compares potential gain to planned loss for a trade sketch."],
    { question: "What R:R is “good”?", answer: "Context-dependent. Many traders seek R:R above 1 with positive win rate — not advice here." },
    "Risk Reward Ratio Calculator — FX Study",
    "Compute reward-to-risk ratio for a trade plan. Teaching tool only.",
    ["risk reward ratio calculator", "forex rr calculator"],
  ),
  "cur-stop-loss-calculator": article(
    "cur-stop-loss-calculator",
    "Stop Loss Calculator",
    ["Stop = entry − direction × stop distance.", "Long default (direction +1) places stop below entry."],
    { question: "Can I use pips instead of price distance?", answer: "Enter stop distance in the same price units as entry for this teaching form." },
    "Stop Loss Calculator — Price Level",
    "Compute stop price from entry and distance. Illustrative FX teaching aid.",
    ["stop loss calculator forex", "fx stop price"],
  ),
  "cur-swap-calculator": article(
    "cur-swap-calculator",
    "Swap Calculator",
    ["Swap ≈ lots × swap per lot per night × nights.", "Models rollover carry cost or credit over held nights."],
    { question: "Are swap rates fixed?", answer: "Brokers update swaps daily. Enter the rate your platform shows." },
    "Swap Calculator — Rollover Estimate",
    "Estimate FX swap over nights held. Illustrative broker-style math.",
    ["forex swap calculator", "rollover calculator"],
  ),
  "cur-position-size-calculator": article(
    "cur-position-size-calculator",
    "Position Size Calculator",
    ["Size ≈ (account × risk%) ÷ (stop × pip value).", "Links account risk budget to units/lots for a teaching plan."],
    { question: "Should risk % be 1%?", answer: "Many educators cite 1–2% per trade as a study guideline — adjust to your plan." },
    "Position Size Calculator — Account Risk",
    "Size positions from account, risk %, stop, and pip value. Teaching estimate.",
    ["position size calculator forex", "fx position sizing"],
  ),
};
