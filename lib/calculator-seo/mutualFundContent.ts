import type { RichArticle } from "./types";

const HUB_HREF = "/finance/investment-wealth/mutual-fund-calculators";
const HUB_LABEL = "Finance · Mutual Fund Calculators";
const SHELL =
  "Runs in your browser. Illustrative mutual-fund math with fixed return assumptions—not advice. NAVs fluctuate; past performance does not guarantee future results.";

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
        title: "Mutual fund planning tips",
        columnHeaders: ["Tool", "Use when"],
        rows: [
          ["SIP vs lumpsum", "Comparing cash-flow styles"],
          ["SWP", "Planning retirement withdrawals"],
          ["Expense ratio", "Comparing fund costs"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Invest → compound → withdraw",
      caption: "Share URL preserves your inputs.",
      sparkValues: [0.3, 0.45, 0.65, 0.85, 1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const MUTUAL_FUND_ARTICLES: Record<string, RichArticle> = {
  "mutual-fund-returns-calculator": article(
    "mutual-fund-returns-calculator",
    "Mutual fund absolute return and CAGR",
    [
      "Absolute return = (current − invested) / invested. CAGR annualizes multi-year performance.",
      "Use folio invested cost and current market value from your AMC / platform statement.",
    ],
    {
      question: "Should I use purchase price or average cost?",
      answer: "Use total amount invested (including all SIPs and lumpsums) as the invested base for an overall return view.",
    },
    "Mutual Fund Returns Calculator — Absolute & CAGR",
    "Calculate absolute gain and CAGR for your mutual fund investment.",
    ["mutual fund returns calculator", "MF return calculator", "mutual fund CAGR"],
  ),
  "sip-vs-lumpsum-calculator": article(
    "sip-vs-lumpsum-calculator",
    "SIP versus lumpsum",
    [
      "Compares SIP future value to a lumpsum grown at the same expected annual return.",
      "Lumpsum often wins mathematically when fully invested from day one; SIP wins on cash-flow discipline and rupee-cost averaging in volatile markets.",
    ],
    {
      question: "Why does lumpsum often show higher maturity?",
      answer: "The full amount compounds for the entire tenure. SIP amounts enter later, so average capital deployed is lower.",
    },
    "SIP vs Lumpsum Calculator",
    "Compare mutual fund SIP maturity against a one-time lumpsum at the same return.",
    ["SIP vs lumpsum calculator", "SIP or lumpsum", "mutual fund SIP comparison"],
  ),
  "sip-step-up-calculator": article(
    "sip-step-up-calculator",
    "Step-up SIP",
    [
      "Increases monthly SIP by a fixed percentage each year while compounding monthly returns.",
      "Matches salary hikes—common 5–15% annual step-up assumptions.",
    ],
    {
      question: "When does step-up apply?",
      answer: "This model raises the SIP at the start of each new year (every 12 months) for the remaining tenure.",
    },
    "SIP Step-Up Calculator",
    "Estimate SIP maturity with an annual percentage increase in monthly investment.",
    ["SIP step up calculator", "step-up SIP", "increasing SIP calculator"],
  ),
  "swp-calculator": article(
    "swp-calculator",
    "Systematic Withdrawal Plan",
    [
      "Starts with a corpus earning returns, then withdraws a fixed amount each month.",
      "Shows ending corpus or the month the portfolio runs out if withdrawals are too high.",
    ],
    {
      question: "Is SWP tax-free?",
      answer: "No—SWP redemptions can trigger capital gains tax. This tool models cash flow only, not tax.",
    },
    "SWP Calculator — Systematic Withdrawal Plan",
    "Simulate monthly withdrawals from a mutual fund corpus and see remaining balance.",
    ["SWP calculator", "systematic withdrawal plan", "mutual fund SWP"],
  ),
  "stp-calculator": article(
    "stp-calculator",
    "Systematic Transfer Plan",
    [
      "Moves a fixed amount monthly from a source fund into a destination fund.",
      "Each pot compounds at its own expected return—useful for debt-to-equity STPs.",
    ],
    {
      question: "What rates should I assume?",
      answer: "Source (often liquid/debt) ~5–7%; destination (equity) often modeled at 10–12% for long horizons—keep assumptions conservative.",
    },
    "STP Calculator — Systematic Transfer Plan",
    "Model monthly STP transfers between source and destination mutual funds.",
    ["STP calculator", "systematic transfer plan", "debt to equity STP"],
  ),
  "mutual-fund-expense-ratio-impact-calculator": article(
    "mutual-fund-expense-ratio-impact-calculator",
    "Expense ratio impact",
    [
      "Compares SIP maturity at gross return vs net return after subtracting annual expense ratio.",
      "Even 0.5–1.5% ER compounds into a large gap over long tenures.",
    ],
    {
      question: "Is expense ratio the only cost?",
      answer: "Also consider exit loads, taxes, and tracking error. ER is the recurring drag this calculator isolates.",
    },
    "Mutual Fund Expense Ratio Impact Calculator",
    "See how expense ratio reduces SIP maturity versus gross returns.",
    ["expense ratio impact", "mutual fund expense ratio calculator", "TER calculator"],
  ),
  "cagr-calculator": article(
    "cagr-calculator",
    "CAGR for mutual funds",
    [
      "CAGR = (final / initial)^(1/years) − 1.",
      "Standard way to compare fund performance across different periods.",
    ],
    {
      question: "CAGR vs XIRR?",
      answer: "CAGR fits a single start and end value. Use XIRR when you have multiple SIPs or irregular cash flows.",
    },
    "CAGR Calculator — Mutual Fund Growth Rate",
    "Calculate compound annual growth rate between initial and final fund values.",
    ["CAGR calculator", "mutual fund CAGR", "compound annual growth rate"],
  ),
  "xirr-calculator": article(
    "xirr-calculator",
    "XIRR for SIP and lumpsum",
    [
      "Builds cash flows from initial investment, optional monthly SIP outflows, and a final redemption value.",
      "Solves for the annualized rate that makes NPV of all flows zero (XIRR).",
    ],
    {
      question: "Why is my XIRR different from the AMC app?",
      answer: "Date-level precision, dividends, and partial redemptions can differ. This is a planning estimate from monthly cadence.",
    },
    "XIRR Calculator — SIP & Lumpsum",
    "Estimate XIRR for mutual fund investments with lumpsum and/or monthly SIP cash flows.",
    ["XIRR calculator", "mutual fund XIRR", "SIP XIRR calculator"],
  ),
};
