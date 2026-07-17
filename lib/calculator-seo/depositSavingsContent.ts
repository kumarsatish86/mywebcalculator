import type { RichArticle } from "./types";

const HUB_HREF = "/finance/banking-credit/deposit-savings-calculators";
const HUB_LABEL = "Finance · Deposit and Savings";
const SHELL =
  "Runs in your browser. Illustrative deposit and savings maths—not advice. Confirm current bank rates, TDS rules, and product terms before investing.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
  chartKind: "sparkTrendDemo" | "loanBalanceDemo" | "none" = "sparkTrendDemo",
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "finance",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Deposit products at a glance",
        columnHeaders: ["Product", "Typical use"],
        rows: [
          ["Savings account", "Daily liquidity + modest interest"],
          ["FD (cumulative)", "Lump-sum growth with compounding"],
          ["FD (non-cumulative)", "Regular interest payouts"],
          ["RD", "Disciplined monthly savings"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : chartKind === "loanBalanceDemo"
          ? {
              kind: "loanBalanceDemo",
              title: "Balance growth over time",
              caption: "Share URL preserves your inputs.",
            }
          : {
              kind: "sparkTrendDemo",
              title: "Savings accumulation trend",
              caption: "Share URL preserves your inputs.",
              sparkValues: [0.2, 0.35, 0.5, 0.68, 0.82, 1],
            },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const DEPOSIT_SAVINGS_ARTICLES: Record<string, RichArticle> = {
  "savings-account-interest-calculator": article(
    "savings-account-interest-calculator",
    "Savings account interest",
    [
      "Interest ≈ average balance × annual rate × days ÷ (365 × 100). Many banks credit interest quarterly on daily balance.",
      "Use average balance over the period you care about—especially if balances fluctuate before salary credit.",
    ],
    {
      question: "Is interest calculated on minimum balance?",
      answer:
        "Rules vary by bank and product. This tool uses an average balance you enter; check your bank's method (daily product, quarterly credit, etc.).",
    },
    "Savings Account Interest Calculator",
    "Estimate savings account interest from average balance, annual rate, and number of days.",
    ["savings account interest calculator", "savings interest estimate", "bank interest"],
    "sparkTrendDemo",
  ),
  "fd-interest-payout-calculator": article(
    "fd-interest-payout-calculator",
    "Non-cumulative FD payouts",
    [
      "Non-cumulative FDs pay interest each period; principal is returned at maturity without reinvestment.",
      "Payout per period = principal × annual rate ÷ periods per year.",
    ],
    {
      question: "Is TDS included?",
      answer: "No—this shows gross interest. Banks may deduct TDS above thresholds; verify with your PAN and Form 16A.",
    },
    "FD Interest Payout Calculator",
    "Calculate periodic interest payouts and total interest for a non-cumulative fixed deposit.",
    ["FD interest payout calculator", "non cumulative FD", "FD monthly interest"],
    "loanBalanceDemo",
  ),
  "fd-maturity-amount-calculator": article(
    "fd-maturity-amount-calculator",
    "Cumulative FD maturity",
    [
      "Cumulative FDs compound interest back into the deposit until maturity.",
      "Default compounding is quarterly (4× per year), matching many Indian bank FD conventions.",
    ],
    {
      question: "Why is effective yield higher than the nominal rate?",
      answer: "More frequent compounding earns interest on interest within the year, raising the effective annual yield.",
    },
    "FD Maturity Amount Calculator",
    "Estimate cumulative fixed deposit maturity value with custom compounding frequency.",
    ["FD maturity calculator", "fixed deposit calculator", "FD compound interest"],
    "sparkTrendDemo",
  ),
  "rd-maturity-calculator-with-monthly-breakdown": article(
    "rd-maturity-calculator-with-monthly-breakdown",
    "RD with monthly breakdown",
    [
      "Recurring deposits add a fixed amount each month; interest compounds monthly on the running balance.",
      "The schedule shows approximate balance progression—actual bank rounding may differ slightly.",
    ],
    {
      question: "Can I break an RD early?",
      answer:
        "Most banks allow premature closure with a penalty and reduced rate. This calculator assumes full tenure to maturity.",
    },
    "RD Maturity Calculator with Monthly Breakdown",
    "Project recurring deposit maturity and view month-by-month balance progression.",
    ["RD calculator", "recurring deposit maturity", "RD monthly breakdown"],
    "loanBalanceDemo",
  ),
  "savings-growth-calculator-with-regular-deposits": article(
    "savings-growth-calculator-with-regular-deposits",
    "Regular deposit growth",
    [
      "Combines an opening balance with equal monthly deposits and monthly compounding at the stated annual rate.",
      "Useful for estimating long-term savings plans outside formal RD products.",
    ],
    {
      question: "Does this model step-up SIPs?",
      answer: "No—deposits are fixed each month. For annual step-ups, use an investment SIP step-up calculator.",
    },
    "Savings Growth Calculator with Regular Deposits",
    "Project ending balance from starting savings plus monthly deposits at a given interest rate.",
    ["savings growth calculator", "monthly deposit savings", "regular savings plan"],
    "sparkTrendDemo",
  ),
  "goal-based-savings-calculator": article(
    "goal-based-savings-calculator",
    "Goal-based monthly savings",
    [
      "Works backward from a target amount: existing savings grow to a future value, then the shortfall is filled with level monthly deposits.",
      "Required deposit uses the standard annuity formula with monthly compounding.",
    ],
    {
      question: "What if I already have enough saved?",
      answer: "If projected growth of existing savings meets the goal, required monthly deposit shows as zero.",
    },
    "Goal-Based Savings Calculator",
    "Find the monthly deposit needed to reach a savings goal by a target date.",
    ["goal based savings calculator", "savings goal planner", "how much to save monthly"],
    "none",
  ),
};
