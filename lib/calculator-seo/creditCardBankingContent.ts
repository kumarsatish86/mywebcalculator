import type { RichArticle } from "./types";

const HUB_HREF = "/finance/banking-credit/credit-card-calculators";
const HUB_LABEL = "Finance · Credit Cards";
const SHELL =
  "Runs in your browser. Educational credit-card maths—not financial advice. APR, fees, and reward rules vary by issuer; verify your card agreement.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
  chartKind: "sparkTrendDemo" | "loanBalanceDemo" | "none" = "loanBalanceDemo",
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "finance",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Credit card planning tips",
        columnHeaders: ["Topic", "Idea"],
        rows: [
          ["Minimum due", "Covers little principal at high APR"],
          ["Payoff plan", "Fixed payment above interest clears debt faster"],
          ["Rewards", "Only valuable if you avoid revolving interest"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : chartKind === "sparkTrendDemo"
          ? {
              kind: "sparkTrendDemo",
              title: "Balance payoff trend",
              caption: "Share URL preserves your inputs.",
              sparkValues: [1, 0.85, 0.7, 0.55, 0.4, 0.25, 0.1],
            }
          : {
              kind: "loanBalanceDemo",
              title: "Revolving balance cost",
              caption: "Share URL preserves your inputs.",
            },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const CREDIT_CARD_BANKING_ARTICLES: Record<string, RichArticle> = {
  "minimum-payment-calculator": article(
    "minimum-payment-calculator",
    "Minimum payment due",
    [
      "Minimum due is typically the greater of a percentage of balance and a flat floor, capped at the full balance.",
      "Paying only the minimum keeps most of the balance revolving and accrues high interest.",
    ],
    {
      question: "Why is my bank minimum different?",
      answer: "Issuers add fees, GST, or EMI components to the statement minimum. This tool models the core % + floor rule only.",
    },
    "Minimum Payment Calculator",
    "Estimate credit card minimum amount due from balance, minimum %, and floor.",
    ["minimum payment calculator", "credit card minimum due", "min payment"],
    "loanBalanceDemo",
  ),
  "credit-card-payoff-calculator": article(
    "credit-card-payoff-calculator",
    "Credit card payoff time",
    [
      "Simulates month-by-month interest and payments until the balance clears or payment is too low.",
      "If payment does not exceed monthly interest, the balance never pays off—raise payment or consider balance transfer.",
    ],
    {
      question: "Does this include new purchases?",
      answer: "No—assumes a fixed balance with no new spending. Add purchases separately for a fuller plan.",
    },
    "Credit Card Payoff Calculator",
    "See months to clear a credit card balance at a fixed monthly payment and APR.",
    ["credit card payoff calculator", "pay off credit card", "card debt timeline"],
    "sparkTrendDemo",
  ),
  "credit-card-debt-reduction-planner": article(
    "credit-card-debt-reduction-planner",
    "Extra payment impact",
    [
      "Compares payoff at calculated minimum due (with ₹100 floor in the engine) vs minimum plus a fixed extra amount.",
      "Even modest extra payments can save months and substantial interest at typical card APRs.",
    ],
    {
      question: "What minimum rule is used?",
      answer: "The planner uses your minimum % with a ₹100 floor built into the debt-reduction engine—adjust extra payment to match your statement.",
    },
    "Credit Card Debt Reduction Planner",
    "Compare payoff time at minimum due vs adding extra monthly payment.",
    ["credit card debt reduction", "extra payment calculator", "pay off card faster"],
    "sparkTrendDemo",
  ),
  "balance-transfer-savings-calculator": article(
    "balance-transfer-savings-calculator",
    "Balance transfer savings",
    [
      "Compares simple interest on current APR vs promotional transfer APR over the promo window.",
      "Subtracts a one-time transfer fee (percentage of balance) for net savings.",
    ],
    {
      question: "What happens after the promo ends?",
      answer: "Rates often revert higher. Plan to pay off or transfer again before promo expiry—this tool covers only the promo period.",
    },
    "Balance Transfer Savings Calculator",
    "Estimate net savings from a credit card balance transfer vs staying on current APR.",
    ["balance transfer calculator", "BT savings", "0 APR transfer"],
    "loanBalanceDemo",
  ),
  "credit-card-late-payment-fee-calculator": article(
    "credit-card-late-payment-fee-calculator",
    "Late payment fees",
    [
      "Many issuers charge the greater of a flat late fee or a percentage of the outstanding balance.",
      "Late payments can also trigger penalty APR and credit score damage beyond the fee itself.",
    ],
    {
      question: "Are RBI caps included?",
      answer: "Enter your issuer's current flat fee and % rule. Regulatory caps change—verify the latest circular for your card type.",
    },
    "Credit Card Late Payment Fee Calculator",
    "Estimate late payment fee from balance, flat charge, and percentage rule.",
    ["late payment fee calculator", "credit card late fee", "missed payment penalty"],
    "none",
  ),
  "interest-free-period-calculator": article(
    "interest-free-period-calculator",
    "Interest-free grace period",
    [
      "Uses a simplified ~30-day cycle: days from purchase to next statement plus days from statement to due date.",
      "Pay the full statement balance by the due date to avoid interest on purchases (cash advances usually excluded).",
    ],
    {
      question: "Why doesn't this match my bank exactly?",
      answer: "Weekends, holidays, and purchase timing (before/after statement cut) change exact days. Use as an educational estimate.",
    },
    "Interest-Free Period Calculator",
    "Estimate credit card interest-free grace days from statement, due, and purchase dates.",
    ["interest free period calculator", "credit card grace period", "days to pay"],
    "none",
  ),
  "credit-card-rewards-calculator": article(
    "credit-card-rewards-calculator",
    "Reward points value",
    [
      "Total points = monthly spend × earn rate × months. Value = points × redemption value per point.",
      "Accelerated category bonuses are not modeled—enter an effective blended earn rate.",
    ],
    {
      question: "Should I include annual fee?",
      answer: "Use the annual fee value calculator to net rewards against fees. This tool shows gross rewards only.",
    },
    "Credit Card Rewards Calculator",
    "Project reward points and rupee value from monthly spend and earn rate.",
    ["credit card rewards calculator", "reward points value", "card points calculator"],
    "sparkTrendDemo",
  ),
  "cashback-calculator": article(
    "cashback-calculator",
    "Cashback earned",
    [
      "Cashback = spend × rate, optionally capped at a maximum per period.",
      "Effective rate shows actual return after the cap is applied.",
    ],
    {
      question: "What about category caps?",
      answer: "Enter total eligible spend and an overall cap if your card limits cashback per statement or quarter.",
    },
    "Cashback Calculator",
    "Compute cashback earned with optional cap on total rewards.",
    ["cashback calculator", "credit card cashback", "cash back estimate"],
    "sparkTrendDemo",
  ),
  "credit-card-annual-fee-value-calculator": article(
    "credit-card-annual-fee-value-calculator",
    "Annual fee vs benefits",
    [
      "Net cost = annual fee − (rewards value + other benefits you assign a rupee value to).",
      "Break-even when total benefits meet or exceed the fee.",
    ],
    {
      question: "How do I value lounge access or insurance?",
      answer: "Use a conservative rupee estimate based on how often you'd pay for those benefits without the card.",
    },
    "Credit Card Annual Fee Value Calculator",
    "See if rewards and benefits outweigh the credit card annual fee.",
    ["annual fee calculator", "is premium card worth it", "credit card value"],
    "none",
  ),
  "revolving-credit-cost-calculator": article(
    "revolving-credit-cost-calculator",
    "Cost of revolving balance",
    [
      "Simple interest cost if you pay only interest and never reduce principal—illustrates how expensive revolving can be.",
      "Real statements also include minimum principal; use the payoff calculator for a repayment plan.",
    ],
    {
      question: "Is this compound interest?",
      answer: "This uses a simple APR × time model for illustration. Actual card interest compounds daily on many products.",
    },
    "Revolving Credit Cost Calculator",
    "Estimate interest cost of revolving a credit card balance without paying down principal.",
    ["revolving credit cost", "credit card interest cost", "revolving balance"],
    "loanBalanceDemo",
  ),
};
