import type { RichArticle } from "./types";

const HUB_HREF = "/finance/investment-wealth/advanced-pro-investment-calculators";
const HUB_LABEL = "Finance · Advanced and Pro Investment";
const SHELL =
  "Runs in your browser. Educational analytics for planning—not investment advice, a forecast guarantee, or a recommendation to buy or sell.";

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
        title: "Advanced metrics cheat sheet",
        columnHeaders: ["Tool", "Question it answers"],
        rows: [
          ["Monte Carlo", "What range of endings is plausible?"],
          ["TWR vs MWR", "Skill of the assets vs timing of cash flows"],
          ["Fee drag", "How much does the expense ratio steal?"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Outcome fan (illustrative)",
      caption: "Share URL preserves your inputs.",
      sparkValues: [0.4, 0.55, 0.5, 0.7, 0.65, 1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const ADVANCED_PRO_INVESTMENT_ARTICLES: Record<string, RichArticle> = {
  "monte-carlo-investment-simulator": article(
    "monte-carlo-investment-simulator",
    "Monte Carlo portfolio simulation",
    [
      "Draws many random monthly return paths from your assumed mean and volatility, then ranks ending values.",
      "P10 / P50 / P90 summarize a pessimistic, median, and optimistic band. Same seed repeats the same paths.",
    ],
    {
      question: "Is this a guarantee of future returns?",
      answer:
        "No. It only reflects the distribution you assumed. Fat tails, regime shifts, and sequence risk can differ from a simple normal model.",
    },
    "Monte Carlo Investment Simulator",
    "Simulate investment outcomes with mean return, volatility, and percentile ending values.",
    ["monte carlo investment simulator", "portfolio simulation", "P10 P50 P90 returns"],
  ),
  "dollar-cost-averaging-calculator": article(
    "dollar-cost-averaging-calculator",
    "Dollar-cost averaging",
    [
      "Buys a fixed amount at each price in your series—average cost is total invested ÷ units acquired.",
      "Useful for comparing systematic investing across a volatile price path.",
    ],
    {
      question: "Is DCA always better than lump sum?",
      answer:
        "Not always. In rising markets lump sum often wins on average; DCA can reduce regret and timing risk psychologically.",
    },
    "Dollar Cost Averaging Calculator",
    "Calculate average cost and ending value when investing fixed amounts across a price series.",
    ["dollar cost averaging calculator", "DCA calculator", "average cost investing"],
  ),
  "time-weighted-return-calculator": article(
    "time-weighted-return-calculator",
    "Time-weighted return (TWR)",
    [
      "Chains period returns: TWR = ∏(1 + rᵢ) − 1. Removes the distorting effect of large deposits/withdrawals.",
      "Annualize using periods-per-year when you want a comparable yearly rate.",
    ],
    {
      question: "When should I use TWR instead of IRR?",
      answer:
        "Use TWR to judge the strategy or manager. Use money-weighted IRR when cash-flow timing (your contributions) matters.",
    },
    "Time Weighted Return Calculator",
    "Chain period returns into a time-weighted and optional annualized return.",
    ["time weighted return calculator", "TWR calculator", "portfolio performance TWR"],
  ),
  "money-weighted-return-calculator": article(
    "money-weighted-return-calculator",
    "Money-weighted return (IRR)",
    [
      "Solves the discount rate that sets NPV of cash flows to zero—your personal money-weighted return.",
      "Simple mode uses one outflow at t=0 and the ending value at year n.",
    ],
    {
      question: "Why can MWR differ from TWR?",
      answer:
        "If you added money right before a rally (or withdrew before a crash), your personal IRR can beat (or lag) time-weighted performance.",
    },
    "Money Weighted Return Calculator",
    "Calculate money-weighted return (IRR) from initial investment, ending value, and years.",
    ["money weighted return calculator", "IRR investment", "personal rate of return"],
  ),
  "investment-fee-impact-calculator": article(
    "investment-fee-impact-calculator",
    "Fee drag over time",
    [
      "Compounds the same contributions at gross return vs return minus annual fee.",
      "Fee drag is the ending gap—often larger than investors expect over decades.",
    ],
    {
      question: "Are fees subtracted monthly?",
      answer:
        "This model spreads the annual fee into an effective monthly net return. Real funds may accrue differently; treat it as planning maths.",
    },
    "Investment Fee Impact Calculator",
    "See how expense ratios and annual fees reduce ending investment wealth.",
    ["investment fee impact calculator", "expense ratio cost", "fee drag"],
  ),
  "rebalancing-calculator": article(
    "rebalancing-calculator",
    "Portfolio rebalancing trades",
    [
      "Compares current sleeve values to target weight percentages and sizes buy/sell trades.",
      "Keeps total portfolio value constant—pure rebalance, no new cash assumed.",
    ],
    {
      question: "How often should I rebalance?",
      answer:
        "Common approaches: calendar (e.g. yearly) or band (rebalance when a sleeve drifts past a threshold). Taxes and costs matter.",
    },
    "Rebalancing Calculator",
    "Compute buy and sell amounts to restore target asset allocation weights.",
    ["rebalancing calculator", "portfolio rebalance", "asset allocation trades"],
  ),
  "net-worth-growth-calculator": article(
    "net-worth-growth-calculator",
    "Net worth trajectory",
    [
      "Starts from current net worth, adds annual savings, and compounds at your assumed return each year.",
      "Separates ending wealth into contributions vs growth from returns.",
    ],
    {
      question: "Does this include liabilities?",
      answer:
        "Enter net worth (assets − liabilities) as the starting point. Model debt paydown via higher savings or a rising net-worth path separately.",
    },
    "Net Worth Growth Calculator",
    "Project future net worth from savings rate and investment return over time.",
    ["net worth growth calculator", "net worth projection", "wealth trajectory"],
  ),
};
