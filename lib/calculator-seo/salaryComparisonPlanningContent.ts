import type { RichArticle } from "./types";

const HUB_HREF = "/finance/salary-income/salary-comparison-planning-calculators";
const HUB_LABEL = "Finance · Comparison and Planning Calculators";
const SHELL =
  "Runs in your browser. Planning comparisons and projections—verify offers and COL data with your employer or relocation advisor.";

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
        title: "When to use",
        columnHeaders: ["Tool", "Use case"],
        rows: [
          ["Salary comparison", "Two pay figures side by side"],
          ["Offer comparison", "Job offers with bonus and COL"],
          ["Salary growth", "Career projection over years"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Salary trajectory",
      caption: "Share URL preserves your inputs.",
      sparkValues: [0.4, 0.55, 0.7, 0.85, 1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const SALARY_COMPARISON_PLANNING_ARTICLES: Record<string, RichArticle> = {
  "salary-comparison-calculator": article(
    "salary-comparison-calculator",
    "Compare two salaries",
    [
      "Enter salary A and salary B (monthly or annual) to see the difference in amount and percentage.",
      "Useful when comparing current pay with a counter-offer or two internal role bands.",
    ],
    {
      question: "Should I compare gross or net?",
      answer: "This tool compares gross figures. For take-home comparison, use our in-hand or after-tax calculators first.",
    },
    "Salary Comparison Calculator",
    "Compare two salaries and see the difference in amount and percentage.",
    ["salary comparison calculator", "compare two salaries"],
  ),
  "offer-comparison-calculator": article(
    "offer-comparison-calculator",
    "Compare job offers",
    [
      "Total offer = base × (1 + bonus %). Optionally adjust offer B to offer A's cost of living using COL indices.",
      "COL-adjusted comparison helps when offers are in different cities.",
    ],
    {
      question: "What COL indices should I use?",
      answer: "Use the same source for both cities (e.g. Numbeo, Mercer). Higher index = higher cost of living.",
    },
    "Offer Comparison Calculator — Base, Bonus, COL",
    "Compare two job offers including bonus and optional cost-of-living adjustment.",
    ["offer comparison calculator", "job offer comparison"],
  ),
  "cost-of-living-comparison-calculator": article(
    "cost-of-living-comparison-calculator",
    "Purchasing power across cities",
    [
      "B equivalent in A's COL = salary B × (COL A ÷ COL B). Compare this to salary A for purchasing power.",
      "Shows which location gives more real spending power for the quoted salaries.",
    ],
    {
      question: "Is a higher salary always better?",
      answer: "Not if the higher salary is in a much more expensive city. COL adjustment reveals true purchasing power.",
    },
    "Cost of Living Comparison Calculator",
    "Compare purchasing power of two salaries in different cities using COL indices.",
    ["cost of living comparison", "salary purchasing power"],
  ),
  "salary-growth-calculator": article(
    "salary-growth-calculator",
    "Project salary growth",
    [
      "Future salary = current × (1 + growth %)^years. Assumes the same percentage raise each year.",
      "Use conservative growth rates (5–8%) for planning; historical averages vary by industry.",
    ],
    {
      question: "Does this include inflation?",
      answer: "No—this is nominal salary growth. Real purchasing power depends on inflation too.",
    },
    "Salary Growth Calculator — Project Future Pay",
    "Project future salary with a fixed annual growth rate over several years.",
    ["salary growth calculator", "salary projection"],
  ),
  "promotion-salary-calculator": article(
    "promotion-salary-calculator",
    "Salary after promotion",
    [
      "New salary = current salary × (1 + increase %). Enter your expected or offered promotion raise.",
      "Shows annual increase amount and equivalent monthly pay.",
    ],
    {
      question: "What is a typical promotion raise?",
      answer: "Often 10–20% for role promotions in private sector; varies widely by company and level.",
    },
    "Promotion Salary Calculator",
    "Calculate new salary after a promotion percentage increase.",
    ["promotion salary calculator", "raise after promotion"],
  ),
  "increment-calculator": article(
    "increment-calculator",
    "Annual increment",
    [
      "New salary = current × (1 + increment %). Shows annual and monthly increment amounts.",
      "Use for annual appraisal cycles where increment is quoted as a percentage of current CTC.",
    ],
    {
      question: "Is increment the same as promotion?",
      answer: "Increment is usually an annual cost-of-living or performance adjustment; promotion often includes a larger role change and bigger raise.",
    },
    "Increment Calculator — New Salary from Raise %",
    "Calculate new salary and monthly increment from an annual increment percentage.",
    ["increment calculator", "salary increment calculator"],
  ),
};
