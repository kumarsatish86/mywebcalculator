import type { RichArticle } from "./types";

const HUB_HREF = "/finance/investment-wealth/risk-portfolio-analysis";
const HUB_LABEL = "Finance · Risk and Portfolio Analysis";
const SHELL =
  "Runs in your browser. Educational risk and allocation metrics—not investment advice or a recommendation to buy or sell.";

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
    category: "finance",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Risk metrics cheat sheet",
        columnHeaders: ["Metric", "Idea"],
        rows: [
          ["Sharpe", "Excess return per unit of volatility"],
          ["Beta", "Sensitivity vs the market"],
          ["Max drawdown", "Worst peak-to-trough drop"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Risk vs reward over time",
      caption: "Share URL preserves your inputs.",
      sparkValues: [0.5, 0.35, 0.55, 0.4, 0.7, 1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const RISK_PORTFOLIO_ANALYSIS_ARTICLES: Record<string, RichArticle> = {
  "asset-allocation-calculator": article(
    "asset-allocation-calculator",
    "Age- and profile-based allocation",
    [
      "Starts from the rule-of-thumb equity share (≈ 100 − age), then blends toward a conservative / moderate / aggressive profile mix.",
      "Optional portfolio value converts percentages into rupee (or other currency) amounts.",
    ],
    {
      question: "Is 100 minus age still valid?",
      answer: "It is a rough heuristic. Longer horizons and higher risk capacity often justify more equity than age alone suggests.",
    },
    "Asset Allocation Calculator",
    "Suggest equity, debt, gold, and cash allocation from age and risk profile.",
    ["asset allocation calculator", "portfolio allocation", "equity debt mix"],
  ),
  "portfolio-diversification-calculator": article(
    "portfolio-diversification-calculator",
    "Concentration via HHI",
    [
      "Herfindahl–Hirschman Index = Σ (weight²). Higher HHI means more concentration.",
      "Effective number of holdings ≈ 1 / HHI.",
    ],
    {
      question: "What HHI is diversified?",
      answer: "As a rough guide, HHI ≤ 0.25 looks relatively diversified; ≥ 0.40 is concentrated. Context still matters.",
    },
    "Portfolio Diversification Calculator",
    "Measure portfolio concentration with HHI from holding weights.",
    ["portfolio diversification calculator", "HHI portfolio", "concentration risk"],
  ),
  "risk-tolerance-calculator": article(
    "risk-tolerance-calculator",
    "Risk tolerance score",
    [
      "Scores capacity from age, years to goal, income stability (1–5), and max loss comfort.",
      "Maps to conservative / moderate / aggressive and a suggested equity percentage.",
    ],
    {
      question: "Is this a full suitability questionnaire?",
      answer: "No—it is a short educational scorecard. Advisors use longer regulated questionnaires.",
    },
    "Risk Tolerance Calculator",
    "Score investor risk tolerance and get a suggested equity allocation band.",
    ["risk tolerance calculator", "investor risk profile", "risk capacity score"],
  ),
  "sharpe-ratio-calculator": article(
    "sharpe-ratio-calculator",
    "Sharpe ratio",
    [
      "Sharpe = (portfolio return − risk-free rate) ÷ volatility.",
      "Higher Sharpe means more excess return per unit of assumed risk.",
    ],
    {
      question: "What is a good Sharpe?",
      answer: "Above 1 is often called strong; 0.5–1 decent. Depends on the period and asset class—compare peers carefully.",
    },
    "Sharpe Ratio Calculator",
    "Calculate Sharpe ratio from return, risk-free rate, and volatility.",
    ["Sharpe ratio calculator", "risk adjusted return", "portfolio Sharpe"],
  ),
  "beta-calculator": article(
    "beta-calculator",
    "Beta estimate",
    [
      "Beta ≈ (σ_asset / σ_market) × correlation.",
      "Beta > 1 tends to amplify market moves; beta < 1 dampens them.",
    ],
    {
      question: "Is this the same as regression beta?",
      answer: "It is an approximation. True beta usually comes from regressing asset excess returns on market excess returns.",
    },
    "Beta Calculator",
    "Estimate security or portfolio beta from volatilities and correlation.",
    ["beta calculator", "stock beta", "market sensitivity"],
  ),
  "volatility-calculator": article(
    "volatility-calculator",
    "Return volatility",
    [
      "Uses sample standard deviation of period returns.",
      "Annualize with √(periods per year)—e.g. monthly returns × √12.",
    ],
    {
      question: "How many returns do I need?",
      answer: "At least 2 mathematically; more periods give a stabler estimate. Use consistent period lengths.",
    },
    "Volatility Calculator",
    "Calculate period and annualized volatility from a list of returns.",
    ["volatility calculator", "standard deviation returns", "portfolio volatility"],
  ),
  "drawdown-calculator": article(
    "drawdown-calculator",
    "Maximum drawdown",
    [
      "Tracks running peak and measures the worst percentage drop to a later trough.",
      "Also shows the percentage gain needed from the trough to recover the peak.",
    ],
    {
      question: "Why does recovery need more than the drawdown %?",
      answer: "A 25% drop requires a 33.3% gain to get back: 90 → 120 needs +33.3%, while the drop was 25%.",
    },
    "Drawdown Calculator",
    "Find maximum drawdown and recovery needed from a portfolio value series.",
    ["drawdown calculator", "max drawdown", "peak to trough loss"],
  ),
};
