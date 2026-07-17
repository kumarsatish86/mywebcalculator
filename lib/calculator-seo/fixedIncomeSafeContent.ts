import type { RichArticle } from "./types";

const HUB_HREF = "/finance/investment-wealth/fixed-income-safe-investment";
const HUB_LABEL = "Finance · Fixed Income and Safe Investment";
const SHELL =
  "Runs in your browser. Illustrative fixed-income math with editable rates—not advice. Confirm current scheme rates, tax rules, and eligibility before investing.";

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
        title: "Safe investment planning",
        columnHeaders: ["Product", "Typical use"],
        rows: [
          ["FD / RD", "Short–medium term goals"],
          ["PPF / SSY / EPF", "Long-term tax-efficient savings"],
          ["NPS / SCSS", "Retirement income"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Deposit → interest → maturity",
      caption: "Share URL preserves your inputs.",
      sparkValues: [0.35, 0.5, 0.65, 0.82, 1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const FIXED_INCOME_SAFE_ARTICLES: Record<string, RichArticle> = {
  "fixed-deposit-fd-calculator": article(
    "fixed-deposit-fd-calculator",
    "Fixed deposit maturity",
    [
      "FD maturity compounds principal at the stated rate. Many Indian banks use quarterly compounding.",
      "Effective annual yield is higher than the nominal rate when compounding is more than once a year.",
    ],
    {
      question: "Does this include TDS?",
      answer: "No—this shows gross maturity. Banks may deduct TDS on interest above thresholds; check Form 16A and your PAN status.",
    },
    "Fixed Deposit (FD) Calculator",
    "Estimate FD maturity value and interest with quarterly or custom compounding.",
    ["FD calculator", "fixed deposit calculator", "FD maturity calculator"],
  ),
  "recurring-deposit-rd-calculator": article(
    "recurring-deposit-rd-calculator",
    "Recurring deposit maturity",
    [
      "RD builds with equal monthly deposits. Maturity ≈ R × [(1+i)^n − 1] / i with monthly rate i.",
      "Useful for disciplined short-term saving without market risk.",
    ],
    {
      question: "When is RD interest credited?",
      answer: "Bank practice varies (often quarterly). This model uses a monthly compounding approximation for planning.",
    },
    "Recurring Deposit (RD) Calculator",
    "Project RD maturity from monthly deposits and bank interest rate.",
    ["RD calculator", "recurring deposit calculator", "RD maturity"],
  ),
  "ppf-calculator": article(
    "ppf-calculator",
    "Public Provident Fund",
    [
      "Models annual deposits with yearly compounding. Default tenure is 15 years (extendable in blocks of 5).",
      "Interest rate is notified quarterly by the government—edit the rate field to match the current notification.",
    ],
    {
      question: "What is the yearly deposit limit?",
      answer: "PPF allows ₹500–₹1.5 lakh per financial year (subject to current rules). Excess deposits typically do not earn interest.",
    },
    "PPF Calculator — Public Provident Fund",
    "Estimate PPF maturity from annual deposits and notified interest rate.",
    ["PPF calculator", "public provident fund calculator", "PPF maturity"],
  ),
  "epf-calculator": article(
    "epf-calculator",
    "Employees' Provident Fund projection",
    [
      "Projects corpus from total monthly EPF contribution (employee + employer EPF share) at the EPFO rate.",
      "Use combined contribution from your payslip; EPS pension allocation is outside this corpus view.",
    ],
    {
      question: "Is EPF interest taxable?",
      answer: "Interest is generally EEE for salary employees within statutory conditions—verify current Income Tax Act rules for your case.",
    },
    "EPF Calculator — Employees Provident Fund",
    "Project EPF corpus from monthly contributions and EPFO interest rate.",
    ["EPF calculator", "provident fund calculator", "EPF corpus"],
  ),
  "nps-calculator": article(
    "nps-calculator",
    "National Pension System",
    [
      "Grows monthly contributions to a retirement corpus, then splits 60% lump sum and 40% annuity (illustrative).",
      "Monthly pension ≈ annuity corpus × assumed annuity rate ÷ 12—not a market annuity quote.",
    ],
    {
      question: "Is 40% annuity mandatory?",
      answer: "At retirement, current rules generally require a minimum annuity purchase—percentage can change; treat this split as a planning default.",
    },
    "NPS Calculator — National Pension System",
    "Estimate NPS retirement corpus, lump sum, and indicative monthly pension.",
    ["NPS calculator", "national pension system calculator", "NPS pension"],
  ),
  "sukanya-samriddhi-yojana-calculator": article(
    "sukanya-samriddhi-yojana-calculator",
    "Sukanya Samriddhi Yojana",
    [
      "Deposits for up to 15 years; account typically matures at 21 years from opening.",
      "Rate is government-notified—edit to match the latest SSY rate.",
    ],
    {
      question: "Who can open an SSY account?",
      answer: "A guardian for a girl child under 10 (rules apply). Confirm eligibility and deposit caps with India Post / bank.",
    },
    "Sukanya Samriddhi Yojana Calculator",
    "Project SSY maturity with up to 15 years of deposits and 21-year account growth.",
    ["SSY calculator", "Sukanya Samriddhi calculator", "sukanya yojana calculator"],
  ),
  "senior-citizen-savings-scheme-calculator": article(
    "senior-citizen-savings-scheme-calculator",
    "Senior Citizen Savings Scheme",
    [
      "Interest is typically paid out quarterly; principal is returned at the end of the tenure (usually 5 years).",
      "This calculator does not compound unpaid interest into principal.",
    ],
    {
      question: "Who is eligible for SCSS?",
      answer: "Generally age 60+ (with some exceptions for retired under specific rules). Deposit caps and TDS rules apply.",
    },
    "Senior Citizen Savings Scheme Calculator",
    "Estimate SCSS quarterly interest payouts and total interest over the tenure.",
    ["SCSS calculator", "senior citizen savings scheme", "senior citizen FD interest"],
  ),
  "post-office-savings-calculator": article(
    "post-office-savings-calculator",
    "Post office savings interest",
    [
      "Simple-interest illustration: Interest = P × R × T ÷ 100.",
      "Actual post office products (SB, TD, MIS, etc.) have product-specific rules—use this for a quick educational estimate.",
    ],
    {
      question: "Is this the same as Post Office TD?",
      answer: "No—time deposits use different tenures and compounding. Adjust rate and compare with India Post notifications.",
    },
    "Post Office Savings Calculator",
    "Estimate simple interest on a post office savings-style balance.",
    ["post office savings calculator", "India Post savings interest", "POSB calculator"],
  ),
  "treasury-bill-bond-calculator": article(
    "treasury-bill-bond-calculator",
    "Treasury bill and bond returns",
    [
      "T-bills (coupon 0): bought at discount, redeemed at face—YTM from (face/price)^(1/t) − 1.",
      "Coupon bonds: approximate YTM using the average-price formula with annual coupons.",
    ],
    {
      question: "Is this a full bond pricing model?",
      answer: "It is an educational approximation. Exact YTM solves a cash-flow IRR; use a detailed bond calculator for trading decisions.",
    },
    "Treasury Bill / Bond Calculator — YTM",
    "Estimate discount, absolute return, and approximate YTM for T-bills or coupon bonds.",
    ["treasury bill calculator", "bond YTM calculator", "T-bill return calculator"],
  ),
};
