import type { RichArticle } from "./types";

const HUB_HREF = "/finance/salary-income/freelancer-gig-income-calculators";
const HUB_LABEL = "Finance · Freelancer and Gig Income Calculators";
const SHELL =
  "Runs in your browser. Freelance income and rate estimates—verify tax rules with a qualified advisor for your jurisdiction.";

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
        title: "Freelance planning tips",
        columnHeaders: ["Metric", "Typical range"],
        rows: [
          ["Billable hours/week", "25–35 (not 40)"],
          ["Utilization", "60–75% of work time"],
          ["Business expenses", "10–20% of gross"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Rate × hours → income",
      caption: "Share URL preserves your inputs.",
      sparkValues: [0.3, 0.5, 0.7, 0.9, 1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const FREELANCE_GIG_INCOME_ARTICLES: Record<string, RichArticle> = {
  "freelance-income-calculator": article(
    "freelance-income-calculator",
    "Freelance income from hourly rate",
    [
      "Annual income = hourly rate × billable hours per week × weeks per year.",
      "Use realistic billable hours (25–35/week), not total hours worked—admin and sales time is non-billable.",
    ],
    {
      question: "How many billable hours should I assume?",
      answer: "Most freelancers bill 60–75% of working hours. Start with 30 billable hours/week if you work 40 hours.",
    },
    "Freelance Income Calculator",
    "Estimate weekly, monthly, and annual freelance income from hourly rate and billable hours.",
    ["freelance income calculator", "freelancer earnings calculator"],
  ),
  "hourly-rate-calculator": article(
    "hourly-rate-calculator",
    "Required hourly rate",
    [
      "Required rate = target annual income ÷ (billable hours per week × weeks per year).",
      "Use this to price services when you know your income goal and available billable time.",
    ],
    {
      question: "Should I add a buffer for taxes?",
      answer: "Yes—either raise your target income by 25–40% before calculating rate, or use the freelancer tax calculator after.",
    },
    "Hourly Rate Calculator for Freelancers",
    "Find the hourly rate needed to reach your target annual freelance income.",
    ["hourly rate calculator freelancer", "freelance rate calculator"],
  ),
  "project-rate-calculator": article(
    "project-rate-calculator",
    "Project fee to hourly rate",
    [
      "Effective hourly rate = project fee ÷ estimated project hours.",
      "Compare the result to your target rate before accepting fixed-fee projects.",
    ],
    {
      question: "Should I include revisions in project hours?",
      answer: "Yes—add buffer hours for revisions, meetings, and scope creep when estimating.",
    },
    "Project Rate Calculator — Fee per Hour",
    "Calculate effective hourly and daily rate from a fixed project fee.",
    ["project rate calculator", "freelance project pricing"],
  ),
  "freelancer-tax-calculator": article(
    "freelancer-tax-calculator",
    "Freelancer net income",
    [
      "Net = gross − income tax − business expenses (as % of gross for planning).",
      "In India, freelancers may pay tax under presumptive or regular schemes—use an effective rate from your CA.",
    ],
    {
      question: "What counts as business expenses?",
      answer: "Software, equipment, internet, co-working, professional fees, and marketing—typically 10–20% of gross for planning.",
    },
    "Freelancer Tax Calculator — Net Income Estimate",
    "Estimate net freelance income after tax and business expense deductions.",
    ["freelancer tax calculator", "self employed tax calculator"],
  ),
  "contractor-pay-calculator": article(
    "contractor-pay-calculator",
    "Contract breakdown",
    [
      "Monthly pay = contract value ÷ contract months. Effective hourly = contract value ÷ total contract hours.",
      "Use when evaluating fixed-term contractor or retainer agreements.",
    ],
    {
      question: "Does this include benefits?",
      answer: "No—contractors typically receive no employer benefits. Factor that into your rate comparison vs full-time.",
    },
    "Contractor Pay Calculator",
    "Break down contract value into monthly, weekly, and hourly pay.",
    ["contractor pay calculator", "contract rate calculator"],
  ),
  "daily-rate-calculator": article(
    "daily-rate-calculator",
    "Day rate income",
    [
      "Weekly income = daily rate × billable days per week. Annual = weekly × weeks per year.",
      "Common for consultants and contractors quoted on a per-day basis.",
    ],
    {
      question: "How do I convert hourly to daily rate?",
      answer: "Multiply hourly rate by billable hours per day (often 6–8). Or use project rate calculator for fixed fees.",
    },
    "Daily Rate Calculator — Freelance Day Rate Income",
    "Convert a daily rate into weekly, monthly, and annual freelance income.",
    ["daily rate calculator", "consultant day rate calculator"],
  ),
};
