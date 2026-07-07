import type { RichArticle } from "./types";

const HUB_HREF = "/finance/salary-income/benefits-contributions";
const HUB_LABEL = "Finance · Benefits and Contributions";
const SHELL =
  "Runs in your browser. Uses India statutory PF, EPS, NPS, superannuation, and ESIC rules for planning—verify against your employer and EPFO/ESIC notices.";

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
        title: "Statutory reference (India)",
        columnHeaders: ["Scheme", "Typical rate"],
        rows: [
          ["EPF (employee)", "12% of PF wages"],
          ["EPF (employer)", "3.67% to EPF + 8.33% to EPS"],
          ["ESIC", "0.75% employee + 3.25% employer (if eligible)"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Contributions → corpus over time",
      caption: "Share URL preserves your inputs.",
      sparkValues: [0.2, 0.35, 0.55, 0.75, 1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const BENEFITS_CONTRIBUTIONS_ARTICLES: Record<string, RichArticle> = {
  "pf-provident-fund-calculator": article(
    "pf-provident-fund-calculator",
    "Provident Fund contributions and corpus",
    [
      "Employee PF is 12% of PF wages (basic + DA, capped at ₹15,000/month unless opted for higher wages). Employer matches 12%, split between EPF and EPS.",
      "This calculator projects your EPF corpus from monthly employee + employer EPF contributions compounded at the EPF interest rate you enter.",
    ],
    {
      question: "Is employer PF part of my take-home?",
      answer: "No—employer PF is deposited to your EPF/EPS accounts, not paid as cash. It is part of CTC and retirement savings.",
    },
    "PF Calculator India — Employee & Employer Contributions",
    "Calculate PF contributions and project EPF corpus under India wage ceiling rules.",
    ["PF calculator", "provident fund calculator India"],
  ),
  "epf-contribution-calculator": article(
    "epf-contribution-calculator",
    "EPF account contributions",
    [
      "The EPF account receives 12% from the employee plus the employer's 3.67% share. The employer's 8.33% goes to EPS (pension), not the EPF balance.",
      "Use this to see how much lands in your EPF account each month and year.",
    ],
    {
      question: "Why is employer EPF less than 12%?",
      answer: "Of the employer's 12%, up to 8.33% (max ₹1,250/month) is allocated to EPS pension; the remainder goes to EPF.",
    },
    "EPF Contribution Calculator — Employee & Employer EPF",
    "Calculate monthly and annual EPF contributions for employee and employer.",
    ["EPF contribution calculator", "EPF calculator India"],
  ),
  "employer-pf-contribution-calculator": article(
    "employer-pf-contribution-calculator",
    "Employer PF split: EPF vs EPS",
    [
      "Employer PF = employer EPF (3.67% of PF wages) + employer EPS (8.33%, capped at ₹1,250/month).",
      "Understanding the split helps reconcile payslip deductions with your EPFO passbook.",
    ],
    {
      question: "Does employer EPS appear in my EPF balance?",
      answer: "No—EPS is a separate pension scheme. Only employee PF and employer EPF (3.67%) credit to your EPF passbook.",
    },
    "Employer PF Contribution Calculator — EPF & EPS Split",
    "Break down employer PF into EPF and EPS components under EPFO rules.",
    ["employer PF calculator", "employer EPF contribution"],
  ),
  "pension-calculator-eps": article(
    "pension-calculator-eps",
    "EPS monthly pension estimate",
    [
      "Monthly pension ≈ (pensionable salary × years of eligible service) ÷ 70. Pensionable salary is capped at ₹15,000/month.",
      "Minimum 10 years of eligible service is required for monthly EPS pension under standard rules.",
    ],
    {
      question: "Can I withdraw EPS instead of pension?",
      answer: "Rules vary by service length and scheme options. This tool estimates pension only—check EPFO for withdrawal vs pension choices.",
    },
    "EPS Pension Calculator — Employees' Pension Scheme",
    "Estimate monthly EPS pension from pensionable salary and years of service.",
    ["EPS pension calculator", "pension calculator India"],
  ),
  "nps-calculator-india": article(
    "nps-calculator-india",
    "NPS corpus projection",
    [
      "National Pension System contributions from employee and employer (often 10% + 10% of basic for government, or as per company policy) accumulate until retirement.",
      "Enter your basic, contribution percentages, years, and expected return to project corpus. Employer NPS under 80CCD(2) may reduce taxable income.",
    ],
    {
      question: "Is NPS the same as EPF?",
      answer: "No—NPS is a separate defined-contribution pension with market-linked returns. EPF is mandatory for most organized-sector employees.",
    },
    "NPS Calculator India — Project National Pension System Corpus",
    "Project NPS corpus from employee and employer contributions on basic salary.",
    ["NPS calculator India", "national pension system calculator"],
  ),
  "superannuation-calculator": article(
    "superannuation-calculator",
    "Employer superannuation fund",
    [
      "Some employers offer a superannuation fund—typically 15% of basic from the employer—separate from EPF. It is part of CTC but not cash in-hand.",
      "Project the corpus from employer contributions and an assumed annual return.",
    ],
    {
      question: "Who gets superannuation?",
      answer: "Usually offered by larger private employers and MNCs. Not all companies provide it—check your offer letter or HR policy.",
    },
    "Superannuation Calculator — Employer Fund Projection",
    "Estimate employer superannuation contributions and projected corpus.",
    ["superannuation calculator", "superannuation fund India"],
  ),
  "esic-calculator": article(
    "esic-calculator",
    "ESIC contributions",
    [
      "ESIC applies when gross monthly wages are ₹21,000 or below. Employee contributes 0.75%; employer contributes 3.25%.",
      "Above the ceiling, ESIC does not apply—this calculator shows zero contributions when ineligible.",
    ],
    {
      question: "What benefits does ESIC provide?",
      answer: "Medical and cash benefits for eligible employees and dependents. Contribution rates and ceilings are set by ESIC and may change.",
    },
    "ESIC Calculator — Employee & Employer ESIC Contributions",
    "Calculate ESIC contributions when gross salary is within the wage ceiling.",
    ["ESIC calculator", "ESIC contribution calculator"],
  ),
};
