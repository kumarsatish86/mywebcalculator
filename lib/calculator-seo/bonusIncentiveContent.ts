import type { RichArticle } from "./types";

const HUB_HREF = "/finance/salary-income/bonus-incentive-calculators";
const HUB_LABEL = "Finance · Bonus and Incentive Calculators";
const SHELL =
  "Runs in your browser. Planning estimates for bonus, commission, and variable pay—verify against your employer's actual policy.";

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
        title: "Quick reference",
        columnHeaders: ["Term", "Meaning"],
        rows: [
          ["Fixed pay", "Guaranteed base salary"],
          ["Variable pay", "Performance-linked component"],
          ["Commission", "Payout tied to sales or revenue"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Base → variable → total pay",
      caption: "Share URL preserves your inputs.",
      sparkValues: [0.6, 0.75, 0.9, 1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BONUS_INCENTIVE_ARTICLES: Record<string, RichArticle> = {
  "annual-bonus-calculator": article(
    "annual-bonus-calculator",
    "Annual bonus from salary",
    [
      "Annual bonus = annual base salary × bonus %. Monthly bonus = annual bonus ÷ 12.",
      "Use when your employer quotes bonus as a percentage of salary (e.g. 15% annual bonus on ₹12 LPA = ₹1.8 lakh).",
    ],
    {
      question: "Is bonus taxed separately?",
      answer: "In most countries bonus is taxable income like salary. This tool shows gross bonus before tax.",
    },
    "Annual Bonus Calculator — Estimate Bonus from Salary",
    "Calculate annual and monthly bonus from base salary and bonus percentage.",
    ["annual bonus calculator", "bonus percentage calculator"],
  ),
  "performance-bonus-calculator": article(
    "performance-bonus-calculator",
    "Performance-linked bonus",
    [
      "Earned bonus = target bonus × (performance score ÷ 100). Target bonus = salary × target bonus %.",
      "Enter your performance rating as 0–100% to see prorated payout.",
    ],
    {
      question: "Can performance score exceed 100%?",
      answer: "Some companies allow over-achievement multipliers. This calculator caps at 100% unless you model over-target separately.",
    },
    "Performance Bonus Calculator — Prorated by Score",
    "Estimate performance bonus from target bonus percentage and achievement score.",
    ["performance bonus calculator", "bonus proration calculator"],
  ),
  "sales-commission-calculator": article(
    "sales-commission-calculator",
    "Sales commission payout",
    [
      "Commission = sales amount × commission rate %. Total payout = commission + optional base salary.",
      "Use for quota-based or revenue-share commission structures with a flat rate.",
    ],
    {
      question: "Does this support tiered commission?",
      answer: "This version uses a single rate. For tiered slabs, run separate calculations per tier or use a weighted average rate.",
    },
    "Sales Commission Calculator",
    "Calculate commission from sales volume and rate, with optional base salary.",
    ["sales commission calculator", "commission rate calculator"],
  ),
  "incentive-calculator": article(
    "incentive-calculator",
    "Target vs achievement incentive",
    [
      "Payout = incentive at 100% × min(achieved ÷ target, 1). Achievement above 100% is capped unless your plan allows accelerators.",
      "Works for sales targets, KPI incentives, or project milestone bonuses.",
    ],
    {
      question: "What if I exceed target?",
      answer: "By default payout caps at the 100% incentive amount. Check your plan for over-achievement multipliers.",
    },
    "Incentive Calculator — Target Achievement Payout",
    "Estimate incentive payout from target, achieved amount, and incentive at full achievement.",
    ["incentive calculator", "target achievement bonus"],
  ),
  "profit-sharing-calculator": article(
    "profit-sharing-calculator",
    "Employee profit share",
    [
      "Profit share = company profit × your allocation %. Some plans use salary-weighted pools—enter the effective % your HR provides.",
      "Shows annual share and monthly equivalent for budgeting.",
    ],
    {
      question: "How is profit share % determined?",
      answer: "Plans vary: flat % of profit, % of salary pool, or tenure-weighted. Use the % from your company policy.",
    },
    "Profit Sharing Calculator — Employee Profit Share",
    "Estimate annual profit share from company profit and your allocation percentage.",
    ["profit sharing calculator", "employee profit share"],
  ),
  "variable-pay-calculator": article(
    "variable-pay-calculator",
    "Fixed + variable total compensation",
    [
      "Variable at 100% = fixed annual × variable %. Variable earned = variable at 100% × (achievement % ÷ 100). Total = fixed + variable earned.",
      "Models common CTC structures where 70–80% is fixed and 20–30% is variable.",
    ],
    {
      question: "Is variable pay guaranteed?",
      answer: "No—variable pay depends on company and individual performance. This tool shows earned amount at your achievement %.",
    },
    "Variable Pay Calculator — Fixed + Variable Total",
    "Calculate total annual and monthly pay from fixed salary, variable %, and achievement.",
    ["variable pay calculator", "fixed plus variable salary"],
  ),
};
