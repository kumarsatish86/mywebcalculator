import type { RichArticle } from "./types";

const HUB_HREF = "/finance/investment-wealth/core-investment-calculators";
const HUB_LABEL = "Finance · Core Investment Calculators";
const SHELL =
  "Runs in your browser. Illustrative investment math with fixed rate assumptions—not advice. Markets can lose money; past returns do not guarantee future results.";

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
        title: "Core investment math",
        columnHeaders: ["Concept", "Idea"],
        rows: [
          ["SIP", "Monthly contributions compounded"],
          ["Lumpsum", "One-time amount grown over time"],
          ["Real return", "Nominal return after inflation"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Growth over time",
      caption: "Share URL preserves your inputs.",
      sparkValues: [0.25, 0.4, 0.55, 0.75, 1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CORE_INVESTMENT_ARTICLES: Record<string, RichArticle> = {
  "sip-calculator": article(
    "sip-calculator",
    "SIP future value",
    [
      "Monthly SIP accumulates with monthly compounding: FV = P × [((1+r)^n − 1) / r] × (1+r), where r is monthly rate.",
      "Total invested is monthly amount × number of months; gains = maturity value − invested.",
    ],
    {
      question: "What return rate should I use?",
      answer: "Equity mutual funds are often modeled at 10–12% for long horizons; debt funds lower. Use a conservative estimate and rerun scenarios.",
    },
    "SIP Calculator — Systematic Investment Plan Returns",
    "Estimate SIP maturity value from monthly investment, expected return, and tenure.",
    ["SIP calculator", "systematic investment plan calculator", "monthly SIP returns"],
  ),
  "lumpsum-investment-calculator": article(
    "lumpsum-investment-calculator",
    "Lumpsum growth",
    [
      "Lumpsum future value = principal × (1 + annual return)^years with annual compounding.",
      "Useful for comparing a one-time investment against a SIP of similar total outlay.",
    ],
    {
      question: "SIP or lumpsum—which is better?",
      answer: "Depends on market timing and cash flow. SIPs average cost over time; lumpsums can win in rising markets. Use both calculators to compare.",
    },
    "Lumpsum Investment Calculator",
    "Project the future value of a one-time investment at a fixed annual return.",
    ["lumpsum calculator", "lump sum investment calculator", "one time investment returns"],
  ),
  "compound-interest-calculator": article(
    "compound-interest-calculator",
    "Compound interest",
    [
      "FV = P × (1 + r/n)^(n×t) where n is compounds per year.",
      "More frequent compounding increases effective annual yield for the same nominal rate.",
    ],
    {
      question: "How do compounds per year work?",
      answer: "Annual = 1, quarterly = 4, monthly = 12, daily ≈ 365. Banks and savings products specify the compounding frequency.",
    },
    "Compound Interest Calculator",
    "Calculate future value and interest earned with custom compounding frequency.",
    ["compound interest calculator", "compound growth calculator"],
  ),
  "investment-growth-calculator": article(
    "investment-growth-calculator",
    "Combined investment growth",
    [
      "Grows an initial balance with monthly compounding, then adds the SIP-style monthly contribution stream.",
      "Total invested = initial + monthly × months; gains = projected value − invested.",
    ],
    {
      question: "When should I use this vs SIP?",
      answer: "Use this when you already have a corpus and will also add monthly amounts—common for portfolio restarts or job bonuses parked upfront.",
    },
    "Investment Growth Calculator",
    "Project portfolio growth from an initial lumpsum plus monthly contributions.",
    ["investment growth calculator", "portfolio growth calculator"],
  ),
  "future-value-calculator": article(
    "future-value-calculator",
    "Future value of money",
    [
      "Future value answers: what will today’s money be worth after earning compound interest for t years?",
      "Same mathematics as compound interest; useful when thinking in present-vs-future framing.",
    ],
    {
      question: "Is future value guaranteed?",
      answer: "No—fixed-rate math for education. Market returns vary and can be negative.",
    },
    "Future Value Calculator",
    "Find the future value of a present amount after compounding for a set period.",
    ["future value calculator", "FV calculator", "time value of money"],
  ),
  "present-value-calculator": article(
    "present-value-calculator",
    "Present value",
    [
      "PV = FV / (1 + r/n)^(n×t)—discount future cash back to today.",
      "Use when comparing a promised future payout to cash in hand now.",
    ],
    {
      question: "What discount rate should I pick?",
      answer: "Match opportunity cost—e.g., expected portfolio return, loan rate, or inflation plus risk premium.",
    },
    "Present Value Calculator",
    "Discount a future amount to today’s present value at a chosen rate.",
    ["present value calculator", "PV calculator", "discounted cash value"],
  ),
  "rate-of-return-calculator": article(
    "rate-of-return-calculator",
    "Absolute and annualized return",
    [
      "Absolute return = (final − initial) / initial. Annualized uses CAGR when years are provided.",
      "Helps compare different investments held for different periods.",
    ],
    {
      question: "Absolute vs annualized—which matters?",
      answer: "Absolute shows total gain; annualized (CAGR) makes multi-year holdings comparable on a yearly basis.",
    },
    "Rate of Return Calculator",
    "Calculate absolute and annualized portfolio returns from initial and final values.",
    ["rate of return calculator", "investment return calculator", "ROI calculator"],
  ),
  "annual-return-calculator": article(
    "annual-return-calculator",
    "CAGR / annualized return",
    [
      "CAGR = (final / initial)^(1/years) − 1.",
      "Smooths multi-year performance into a single compounded yearly rate.",
    ],
    {
      question: "Is CAGR the same as average yearly return?",
      answer: "No—CAGR is the constant rate that compounds to the final value. Simple average of yearly returns can differ when volatility is high.",
    },
    "Annual Return Calculator — CAGR",
    "Calculate compound annual growth rate (CAGR) over a holding period.",
    ["annual return calculator", "CAGR calculator", "compound annual growth rate"],
  ),
  "inflation-adjusted-return-calculator": article(
    "inflation-adjusted-return-calculator",
    "Real return after inflation",
    [
      "Real return ≈ ((1 + nominal) / (1 + inflation)) − 1.",
      "Shows purchasing-power growth after prices rise—critical for long-term goals.",
    ],
    {
      question: "Why does inflation matter?",
      answer: "A 12% nominal return with 5% inflation leaves roughly 6.7% real growth. Goal planning should use real returns when costs rise over time.",
    },
    "Inflation Adjusted Return Calculator",
    "Convert nominal investment return into real return after inflation.",
    ["inflation adjusted return", "real return calculator", "inflation return calculator"],
  ),
};
