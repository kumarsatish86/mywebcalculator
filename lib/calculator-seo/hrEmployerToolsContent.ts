import type { RichArticle } from "./types";

const HUB_HREF = "/finance/salary-income/hr-employer-tools";
const HUB_LABEL = "Finance · HR and Employer Tools";
const SHELL =
  "Runs in your browser. Planning estimates for payroll and compensation—verify rates and statutory rules with your payroll provider or HR advisor.";

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
        title: "Employer cost planning",
        columnHeaders: ["Component", "Typical range"],
        rows: [
          ["Employer benefits load", "12–25% of gross"],
          ["Overhead (desk, tools)", "8–15% of loaded cost"],
          ["Recruiter fee", "15–25% of first-year salary"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Gross → loaded cost",
      caption: "Share URL preserves your inputs.",
      sparkValues: [0.4, 0.55, 0.7, 0.85, 1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const HR_EMPLOYER_TOOLS_ARTICLES: Record<string, RichArticle> = {
  "payroll-calculator": article(
    "payroll-calculator",
    "Payroll net pay estimate",
    [
      "Net pay = gross − income tax − other deductions (PF, insurance, etc. as % of gross for planning).",
      "Total employer cost = gross + employer benefits contribution (PF, gratuity accrual, insurance).",
    ],
    {
      question: "Does this replace payroll software?",
      answer: "No—use this for quick estimates. Actual payroll uses slab-wise tax, statutory caps, and month-to-month adjustments.",
    },
    "Payroll Calculator — Net Pay and Employer Cost",
    "Estimate employee net pay and total employer payroll cost from gross salary and deduction rates.",
    ["payroll calculator", "salary payroll calculator", "net pay calculator"],
  ),
  "employee-cost-calculator": article(
    "employee-cost-calculator",
    "True cost of an employee",
    [
      "Loaded cost = gross salary + employer benefits + overhead (office, equipment, software).",
      "Use this when budgeting headcount or comparing contractor vs employee economics.",
    ],
    {
      question: "What counts as overhead?",
      answer: "Desk space, laptop, software licenses, admin support, and management time—often 8–15% on top of benefits.",
    },
    "Employee Cost Calculator — Total Loaded Cost",
    "Calculate the true monthly and annual cost of an employee including benefits and overhead.",
    ["employee cost calculator", "cost per employee", "loaded salary cost"],
  ),
  "salary-structure-builder": article(
    "salary-structure-builder",
    "CTC to salary components",
    [
      "Basic = CTC × basic %. HRA = basic × HRA %. Special allowance = CTC − basic − HRA − employer contribution.",
      "Typical India private-sector split: 40% basic, 50% HRA on basic, remainder as special allowance plus employer PF.",
    ],
    {
      question: "Why is basic important?",
      answer: "PF, gratuity, and bonus calculations are often tied to basic salary—higher basic increases statutory costs.",
    },
    "Salary Structure Builder — CTC Breakdown",
    "Split monthly CTC into basic, HRA, special allowance, and employer contribution.",
    ["salary structure builder", "CTC breakup calculator", "salary components calculator"],
  ),
  "compensation-planning-calculator": article(
    "compensation-planning-calculator",
    "Team compensation budget",
    [
      "Annual budget = headcount × average gross monthly × 12 × (1 + employer benefits %).",
      "Use when planning hiring waves, annual increments, or board-level compensation forecasts.",
    ],
    {
      question: "Should I include variable pay?",
      answer: "Add expected bonus or commission as a separate line—or raise the average gross to include target variable pay.",
    },
    "Compensation Planning Calculator — Team Budget",
    "Plan total team compensation budget from headcount, average salary, and employer benefit load.",
    ["compensation planning calculator", "payroll budget calculator", "headcount cost calculator"],
  ),
  "salary-benchmark-calculator": article(
    "salary-benchmark-calculator",
    "Offer vs market median",
    [
      "Difference % = (offer − market median) ÷ market median × 100.",
      "Use market data from salary surveys, Glassdoor, or industry reports for your role and location.",
    ],
    {
      question: "What if my offer is below market?",
      answer: "Negotiate base, equity, bonus, or benefits—or confirm the role level and location match the benchmark source.",
    },
    "Salary Benchmark Calculator — Offer Comparison",
    "Compare a job offer to market median salary and see the percentage difference.",
    ["salary benchmark calculator", "offer vs market salary", "salary comparison tool"],
  ),
  "cost-to-hire-calculator": article(
    "cost-to-hire-calculator",
    "Total hiring cost",
    [
      "Total = recruiter fee + signing bonus + onboarding + vacancy cost (daily salary × days vacant).",
      "Vacancy cost assumes salary ÷ 260 working days per year.",
    ],
    {
      question: "What recruiter fee should I use?",
      answer: "Agency fees are often 15–25% of first-year salary for permanent hires; retainers and in-house recruiting differ.",
    },
    "Cost to Hire Calculator — Recruitment Budget",
    "Estimate total hiring cost including recruiter fees, signing bonus, onboarding, and vacancy time.",
    ["cost to hire calculator", "recruitment cost calculator", "hiring cost estimate"],
  ),
};
