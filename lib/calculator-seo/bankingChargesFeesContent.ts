import type { RichArticle } from "./types";

const HUB_HREF = "/finance/banking-credit/banking-charges-fees-calculators";
const HUB_LABEL = "Finance · Banking Charges and Fees";
const SHELL =
  "Runs in your browser. Illustrative fee maths—not advice. Confirm current bank schedules, GST, and waiver rules before paying or switching accounts.";

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
        title: "Common banking fees",
        columnHeaders: ["Fee type", "Typical trigger"],
        rows: [
          ["ATM excess", "Withdrawals above free monthly limit"],
          ["Overdraft", "Negative balance for N days"],
          ["Maintenance", "Low balance or inactive account"],
          ["Processing", "Loan disbursal / renewal"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : chartKind === "loanBalanceDemo"
          ? {
              kind: "loanBalanceDemo",
              title: "Fee accumulation over time",
              caption: "Share URL preserves your inputs.",
            }
          : {
              kind: "sparkTrendDemo",
              title: "Annual fee impact",
              caption: "Share URL preserves your inputs.",
              sparkValues: [0.15, 0.28, 0.42, 0.55, 0.7, 0.88],
            },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BANKING_CHARGES_FEES_ARTICLES: Record<string, RichArticle> = {
  "bank-charges-calculator": article(
    "bank-charges-calculator",
    "Total annual bank charges",
    [
      "Adds monthly account fees, annual card/package fees, and other yearly charges into one annual total.",
      "Monthly equivalent divides annual total by 12 for budgeting.",
    ],
    {
      question: "Are waived months included?",
      answer: "Enter only fees you actually expect to pay. Use the maintenance-fee calculator if you need waiver months.",
    },
    "Bank Charges Calculator",
    "Estimate total annual banking charges from monthly, annual, and other fees.",
    ["bank charges calculator", "annual banking fees", "account fee total"],
    "sparkTrendDemo",
  ),
  "atm-withdrawal-fee-calculator": article(
    "atm-withdrawal-fee-calculator",
    "ATM withdrawal fees",
    [
      "Counts withdrawals above your bank's free limit and multiplies by the per-transaction fee.",
      "Useful when comparing salary accounts or premium tiers with different free limits.",
    ],
    {
      question: "Do own-bank ATMs count?",
      answer: "Enter total withdrawals you expect to be charged for—rules differ by bank and card type.",
    },
    "ATM Withdrawal Fee Calculator",
    "Calculate ATM fees when withdrawals exceed your free monthly limit.",
    ["ATM fee calculator", "ATM withdrawal charges", "excess ATM fee"],
    "none",
  ),
  "overdraft-interest-calculator": article(
    "overdraft-interest-calculator",
    "Overdraft interest",
    [
      "Simple daily interest: overdraft amount × annual rate × days ÷ (365 × 100).",
      "Actual bank methods may use tiered rates or compound daily—confirm with your statement.",
    ],
    {
      question: "Is overdraft interest tax-deductible?",
      answer: "Depends on use (personal vs business). This tool only estimates interest amount.",
    },
    "Overdraft Interest Calculator",
    "Estimate overdraft interest from amount, annual rate, and number of days.",
    ["overdraft interest calculator", "overdraft charges", "OD interest"],
    "loanBalanceDemo",
  ),
  "penalty-calculator-minimum-balance-late-fee": article(
    "penalty-calculator-minimum-balance-late-fee",
    "Minimum balance & late fees",
    [
      "Toggle between minimum-balance shortfall penalty (flat or % of shortfall) and late-payment fees (flat + daily % on balance).",
      "Penalties vary widely—enter values from your bank's fee schedule.",
    ],
    {
      question: "Which penalty applies first?",
      answer: "Banks apply product-specific rules. Model each scenario separately with the mode toggle.",
    },
    "Penalty Calculator — Minimum Balance & Late Fee",
    "Estimate minimum balance penalties or late payment fees with a mode toggle.",
    ["minimum balance penalty calculator", "late fee calculator", "bank penalty"],
    "none",
  ),
  "account-maintenance-fee-calculator": article(
    "account-maintenance-fee-calculator",
    "Account maintenance fees",
    [
      "Multiplies monthly maintenance fee by charged months after waivers.",
      "Useful for multi-year cost comparison when opening secondary accounts.",
    ],
    {
      question: "Can maintenance be waived?",
      answer: "Many banks waive fees above a balance threshold or with salary credit—reduce charged months accordingly.",
    },
    "Account Maintenance Fee Calculator",
    "Calculate total maintenance fees over a period with optional waiver months.",
    ["account maintenance fee calculator", "monthly account charge", "bank maintenance"],
    "sparkTrendDemo",
  ),
  "loan-processing-fee-calculator": article(
    "loan-processing-fee-calculator",
    "Loan processing fee",
    [
      "Processing fee = loan amount × fee % + flat fee; GST applied on the base fee when entered.",
      "Net disbursal = loan amount minus total fee including GST.",
    ],
    {
      question: "Is GST always 18%?",
      answer: "Enter the GST % your lender quotes—rates and inclusion rules vary by product and region.",
    },
    "Loan Processing Fee Calculator",
    "Estimate loan processing fees, GST, and net disbursal after deductions.",
    ["loan processing fee calculator", "processing charges", "loan fee GST"],
    "loanBalanceDemo",
  ),
};
