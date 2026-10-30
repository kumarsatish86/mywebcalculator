/** Finance & money template generators — in-browser drafts, not live LLMs. */
import { draftOk, money, numOr, str, type AigenInput, type AigenResult } from "./aigenHelpers";

export type AigenFinanceSlug =
  | "aigen-budget-planner-generator"
  | "aigen-expense-breakdown-generator"
  | "aigen-savings-plan-generator"
  | "aigen-loan-repayment-plan-generator"
  | "aigen-debt-payoff-strategy-generator"
  | "aigen-investment-portfolio-generator"
  | "aigen-retirement-plan-generator"
  | "aigen-emi-breakdown-generator"
  | "aigen-passive-income-plan-generator";

export const AIGEN_FINANCE_SLUGS: AigenFinanceSlug[] = [
  "aigen-budget-planner-generator",
  "aigen-expense-breakdown-generator",
  "aigen-savings-plan-generator",
  "aigen-loan-repayment-plan-generator",
  "aigen-debt-payoff-strategy-generator",
  "aigen-investment-portfolio-generator",
  "aigen-retirement-plan-generator",
  "aigen-emi-breakdown-generator",
  "aigen-passive-income-plan-generator",
];

export function computeAigenFinance(slug: AigenFinanceSlug, input: AigenInput): AigenResult {
  const topic = str(input.topic, "household");
  const income = numOr(input.amount, 50000);
  const expenses = numOr(input.amount2, Math.round(income * 0.7));
  const rate = numOr(input.rate, 10);
  const months = Math.max(1, Math.round(numOr(input.days, 36)));
  const budget = numOr(input.budget, income);
  const goal = str(input.goal, "build a cash cushion");

  switch (slug) {
    case "aigen-budget-planner-generator": {
      const needs = Math.round(budget * 0.5);
      const wants = Math.round(budget * 0.3);
      const save = budget - needs - wants;
      return draftOk(
        [
          `Budget plan — ${topic}`,
          `Monthly budget base: ₹${money(budget)}`,
          `Needs (~50%): ₹${money(needs)} — rent, food, utilities, transport`,
          `Wants (~30%): ₹${money(wants)} — lifestyle, dining, hobbies`,
          `Save/invest (~20%): ₹${money(save)} — emergency + goals`,
          `Goal focus: ${goal}`,
          "Weekly check: track 3 categories that usually overspend.",
          "Review day: last Sunday of each month.",
        ],
        { primary: save },
      );
    }
    case "aigen-expense-breakdown-generator": {
      const housing = Math.round(expenses * 0.35);
      const food = Math.round(expenses * 0.2);
      const transport = Math.round(expenses * 0.12);
      const other = expenses - housing - food - transport;
      return draftOk(
        [
          `Expense breakdown — ${topic}`,
          `Total monthly expenses: ₹${money(expenses)}`,
          `Housing / EMI: ₹${money(housing)} (~35%)`,
          `Food & groceries: ₹${money(food)} (~20%)`,
          `Transport: ₹${money(transport)} (~12%)`,
          `Other (subs, health, misc): ₹${money(other)}`,
          `Income context: ₹${money(income)} → surplus ≈ ₹${money(Math.max(0, income - expenses))}`,
          "Action: pick one category to cut 5–10% this month.",
        ],
        { primary: expenses },
      );
    }
    case "aigen-savings-plan-generator": {
      const target = numOr(input.amount2, 200000);
      const monthly = Math.max(1, Math.round(numOr(input.amount, 10000)));
      const monthsNeeded = Math.ceil(target / monthly);
      return draftOk(
        [
          `Savings plan — ${goal}`,
          `Target: ₹${money(target)}`,
          `Monthly save: ₹${money(monthly)}`,
          `Rough timeline: ~${monthsNeeded} months (ignoring interest)`,
          "Bucket 1: Emergency fund (3–6 months expenses)",
          "Bucket 2: Near-term goal (travel / gadget)",
          "Bucket 3: Long-term invest (SIP / index)",
          `Auto-transfer on payday for ${topic}.`,
        ],
        { primary: monthsNeeded },
      );
    }
    case "aigen-loan-repayment-plan-generator": {
      const principal = numOr(input.amount, 500000);
      const r = rate / 100 / 12;
      const emi =
        r === 0
          ? principal / months
          : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      return draftOk(
        [
          `Loan repayment plan — ${topic}`,
          `Principal: ₹${money(principal)} · Rate: ${rate}% p.a. · Tenure: ${months} mo`,
          `Illustrative EMI: ₹${money(Math.round(emi))}`,
          "Month 1–3: Confirm autopay + extra ₹ toward principal if surplus",
          "Mid tenure: Refinance check if rates drop >1%",
          "Prepay rule: dump bonuses into principal, keep EMI buffer",
          "Track: outstanding balance quarterly",
        ],
        { primary: Math.round(emi) },
      );
    }
    case "aigen-debt-payoff-strategy-generator": {
      const debt = numOr(input.amount, 300000);
      const extra = numOr(input.amount2, 5000);
      return draftOk(
        [
          `Debt payoff strategy — ${topic}`,
          `Total debt context: ₹${money(debt)} · Extra monthly: ₹${money(extra)}`,
          "List debts: balance, rate, minimum due",
          "Method A (Avalanche): highest rate first — less interest",
          "Method B (Snowball): smallest balance first — momentum",
          `Apply ₹${money(extra)} above minimums to the priority debt`,
          "Freeze new revolving credit until plan is on track",
          `Celebrate milestones every ₹${money(Math.round(debt / 4))} cleared`,
        ],
        { primary: debt },
      );
    }
    case "aigen-investment-portfolio-generator": {
      const ageProxy = numOr(input.count, 35);
      const equity = Math.min(90, Math.max(20, 100 - ageProxy));
      const debtPct = 100 - equity - 10;
      return draftOk(
        [
          `Portfolio sketch — ${topic}`,
          `Age/horizon proxy: ${ageProxy} → equity bias ~${equity}%`,
          `Equity / growth: ${equity}% (index + diversified funds)`,
          `Debt / fixed income: ${Math.max(0, debtPct)}%`,
          "Gold / alternatives: ~10%",
          `Monthly invest from surplus toward: ${goal}`,
          "Rebalance yearly; avoid concentration in one stock",
        ],
        { primary: equity, score: equity },
      );
    }
    case "aigen-retirement-plan-generator": {
      const years = numOr(input.days, 25);
      const monthly = numOr(input.amount, 15000);
      const corpus = monthly * 12 * years * 1.2;
      return draftOk(
        [
          `Retirement draft — ${topic}`,
          `Horizon: ~${years} years · Monthly invest: ₹${money(monthly)}`,
          `Rough teaching corpus (simple): ~₹${money(Math.round(corpus))}`,
          "Pillars: EPF/NPS + equity SIP + emergency fund",
          "Replace income target: 60–80% of current spend",
          `Goal note: ${goal}`,
          "Review asset mix every 3–5 years as you age",
        ],
        { primary: Math.round(corpus) },
      );
    }
    case "aigen-emi-breakdown-generator": {
      const principal = numOr(input.amount, 1000000);
      const r = rate / 100 / 12;
      const emi =
        r === 0
          ? principal / months
          : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      const firstInterest = principal * r;
      const firstPrincipal = emi - firstInterest;
      return draftOk(
        [
          `EMI breakdown — ${topic}`,
          `Loan: ₹${money(principal)} @ ${rate}% for ${months} months`,
          `EMI: ₹${money(Math.round(emi))}`,
          `Month-1 interest (approx): ₹${money(Math.round(firstInterest))}`,
          `Month-1 principal (approx): ₹${money(Math.round(firstPrincipal))}`,
          "Early years: interest share is higher",
          "Later years: principal share rises",
          "Use bank amortization schedule for exacts",
        ],
        { primary: Math.round(emi) },
      );
    }
    case "aigen-passive-income-plan-generator": {
      const targetMonthly = numOr(input.amount, 20000);
      const yieldPct = numOr(input.rate, 6);
      const corpusNeeded = (targetMonthly * 12) / (yieldPct / 100);
      return draftOk(
        [
          `Passive income plan — ${topic}`,
          `Target monthly: ₹${money(targetMonthly)} at ~${yieldPct}% yield`,
          `Illustrative corpus needed: ₹${money(Math.round(corpusNeeded))}`,
          "Streams to explore: dividends, rental, interest, royalties, digital products",
          "Phase 1: Build emergency fund + clear high-interest debt",
          "Phase 2: Automate investments toward corpus",
          `Phase 3: Diversify streams tied to ${goal}`,
          "Tax and risk vary — verify with a qualified advisor",
        ],
        { primary: Math.round(corpusNeeded) },
      );
    }
    default:
      return { ok: false, error: "Unknown finance generator." };
  }
}
