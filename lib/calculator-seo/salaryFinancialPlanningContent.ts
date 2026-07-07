import type { RichArticle } from "./types";

const HUB_HREF = "/finance/salary-income/salary-financial-planning";
const HUB_LABEL = "Finance · Advanced Financial Planning";
const SHELL =
  "Runs in your browser. Planning projections from salary—not personalized financial advice. Verify assumptions with a qualified advisor.";

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
        title: "Planning benchmarks",
        columnHeaders: ["Rule", "Guideline"],
        rows: [
          ["50/30/20", "50% needs, 30% wants, 20% savings"],
          ["FIRE (4% rule)", "FIRE number ≈ 25× annual expenses"],
          ["Savings rate", "20%+ of net for long-term goals"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Savings → corpus over time",
      caption: "Share URL preserves your inputs.",
      sparkValues: [0.15, 0.35, 0.55, 0.8, 1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const SALARY_FINANCIAL_PLANNING_ARTICLES: Record<string, RichArticle> = {
  "savings-from-salary-calculator": article(
    "savings-from-salary-calculator",
    "Savings from take-home pay",
    [
      "Monthly savings = net monthly salary × savings %. Annual savings = monthly × 12.",
      "Use your actual take-home (after tax and deductions), not gross CTC.",
    ],
    {
      question: "What savings rate should I target?",
      answer: "Financial planners often suggest 20% of net income minimum; FIRE pursuers may target 50%+.",
    },
    "Savings from Salary Calculator",
    "Calculate monthly and annual savings from net salary and savings percentage.",
    ["savings from salary calculator", "how much to save from salary"],
  ),
  "expense-vs-salary-calculator": article(
    "expense-vs-salary-calculator",
    "Surplus or deficit",
    [
      "Surplus = salary − expenses. Positive surplus is what you can save or invest each month.",
      "A negative surplus means expenses exceed income—budget review needed.",
    ],
    {
      question: "Should I use gross or net salary?",
      answer: "Use net (take-home) salary and include all recurring monthly expenses for an accurate picture.",
    },
    "Expense vs Salary Calculator",
    "Compare monthly salary with expenses to find surplus or deficit.",
    ["expense vs salary calculator", "salary surplus calculator"],
  ),
  "salary-budget-planner": article(
    "salary-budget-planner",
    "50/30/20 budget split",
    [
      "Allocate net monthly pay into needs (rent, groceries, EMIs), wants (dining, hobbies), and savings.",
      "Default 50/30/20 is a starting point—adjust percentages to your city and goals.",
    ],
    {
      question: "What counts as needs vs wants?",
      answer: "Needs are essentials you cannot skip (housing, utilities, minimum debt payments). Wants are discretionary.",
    },
    "Salary Budget Planner — 50/30/20 Rule",
    "Split take-home pay into needs, wants, and savings buckets.",
    ["salary budget planner", "50 30 20 budget calculator"],
  ),
  "salary-investment-calculator": article(
    "salary-investment-calculator",
    "Invest from salary",
    [
      "Projects corpus from monthly SIP out of salary compounded at expected annual return.",
      "Add starting balance if you already have investments.",
    ],
    {
      question: "What return rate should I use?",
      answer: "Equity long-term historical averages are often 10–12% nominal; use 7–8% for conservative planning.",
    },
    "Salary Investment Calculator — SIP Corpus Projection",
    "Project investment corpus from monthly salary contributions.",
    ["salary investment calculator", "invest from salary SIP"],
  ),
  "fire-calculator-financial-independence": article(
    "fire-calculator-financial-independence",
    "Financial independence (FIRE)",
    [
      "FIRE number = annual expenses ÷ (withdrawal rate % ÷ 100). At 4%, you need 25× annual expenses.",
      "Years to FIRE depends on current savings, monthly contributions, and investment return.",
    ],
    {
      question: "Is the 4% rule reliable?",
      answer: "It is a planning heuristic from US studies. Many planners use 3–4% depending on horizon and risk tolerance.",
    },
    "FIRE Calculator — Financial Independence",
    "Estimate FIRE number and years to financial independence.",
    ["FIRE calculator", "financial independence calculator"],
  ),
  "retirement-planning-calculator-salary-based": article(
    "retirement-planning-calculator-salary-based",
    "Retirement corpus from salary",
    [
      "Derives net pay from gross, applies savings %, and projects corpus at retirement with compound growth.",
      "Enter years to retirement and current corpus if you have existing retirement savings.",
    ],
    {
      question: "Does this include employer pension?",
      answer: "Add employer NPS/PF as part of current corpus or increase monthly savings to reflect employer match.",
    },
    "Retirement Planning Calculator (Salary-based)",
    "Project retirement corpus from gross salary, savings rate, and years to retirement.",
    ["retirement planning calculator salary", "retirement corpus from salary"],
  ),
};
