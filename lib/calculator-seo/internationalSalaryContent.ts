import type { RichArticle } from "./types";

const HUB_HREF = "/finance/salary-income/international-salary-calculators";
const HUB_LABEL = "Finance · International Salary Calculators";
const SHELL =
  "Runs in your browser. Uses simplified planning tax rates per country—not a substitute for payroll software or tax advice.";

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
        title: "Planning defaults (editable)",
        columnHeaders: ["Country", "Currency", "Typical tax %", "Deductions %"],
        rows: [
          ["USA", "USD", "22", "7.65"],
          ["UK", "GBP", "20", "12"],
          ["Canada", "CAD", "25", "7"],
          ["Australia", "AUD", "30", "5"],
          ["UAE", "AED", "0", "0"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Gross → net by country",
      caption: "Share URL preserves your inputs.",
      sparkValues: [1, 0.85, 0.72, 0.68],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const INTERNATIONAL_SALARY_ARTICLES: Record<string, RichArticle> = {
  "salary-calculator-usa": article(
    "salary-calculator-usa",
    "Salary calculator USA",
    [
      "Estimates monthly and annual take-home from gross salary using editable federal/state-style tax % and payroll deduction %.",
      "Default deduction % approximates FICA (Social Security + Medicare). Adjust for your state and filing status.",
    ],
    {
      question: "Does this include state income tax?",
      answer: "Enter a combined effective tax % that includes federal and state. High-tax states may need 28–35%+ effective rates on upper incomes.",
    },
    "Salary Calculator USA — Gross to Net Pay",
    "Estimate US take-home salary from gross pay with planning tax and FICA-style deductions.",
    ["salary calculator USA", "US take home pay calculator"],
  ),
  "salary-calculator-uk": article(
    "salary-calculator-uk",
    "Salary calculator UK",
    [
      "Models gross-to-net with income tax and National Insurance-style deduction % on monthly gross.",
      "Use your P60 or tax code to refine the tax % for your band.",
    ],
    {
      question: "What about Scottish tax rates?",
      answer: "Scottish income tax bands differ—use an effective tax % that matches your payslip.",
    },
    "Salary Calculator UK — Take Home Pay",
    "Estimate UK net salary from gross monthly or annual pay.",
    ["salary calculator UK", "UK take home pay"],
  ),
  "salary-calculator-canada": article(
    "salary-calculator-canada",
    "Salary calculator Canada",
    [
      "Converts gross salary to net using planning federal/provincial tax % and CPP/EI-style deductions.",
      "Provincial rates vary widely—tune the tax % to your province and income level.",
    ],
    {
      question: "Is RRSP included?",
      answer: "Optional RRSP contributions are not modeled unless you add them to the deduction % field.",
    },
    "Salary Calculator Canada — Net Pay Estimate",
    "Estimate Canadian take-home pay from gross salary.",
    ["salary calculator Canada", "Canada net salary"],
  ),
  "salary-calculator-australia": article(
    "salary-calculator-australia",
    "Salary calculator Australia",
    [
      "Estimates net pay from gross with income tax and Medicare/super-style deduction %.",
      "Superannuation guarantee is often employer-paid—employee sacrifice can be added to deductions %.",
    ],
    {
      question: "Does this use PAYG withholding tables?",
      answer: "No—use an effective tax % from your payslip or ATO calculator for closer results.",
    },
    "Salary Calculator Australia — Take Home Pay",
    "Estimate Australian net salary from gross pay.",
    ["salary calculator Australia", "Australia take home pay"],
  ),
  "salary-calculator-uae": article(
    "salary-calculator-uae",
    "Salary calculator UAE",
    [
      "UAE has no personal income tax for most employees—defaults are 0% tax and 0% statutory deductions.",
      "Net pay often equals gross minus any voluntary deductions (housing loan, etc.) you enter.",
    ],
    {
      question: "Are there any UAE salary deductions?",
      answer: "Some employers deduct pension for GCC nationals or voluntary schemes. Add those as deduction %.",
    },
    "Salary Calculator UAE — Tax-Free Salary Estimate",
    "Estimate UAE take-home salary—typically equal to gross with no income tax.",
    ["salary calculator UAE", "Dubai salary calculator"],
  ),
  "salary-after-tax-country-wise": article(
    "salary-after-tax-country-wise",
    "Compare after-tax salary by country",
    [
      "Select a country and enter gross pay to see net monthly and annual using that country's planning defaults.",
      "Switch countries with the same gross to compare take-home across locations.",
    ],
    {
      question: "Can I compare two countries side by side?",
      answer: "Run the tool twice with different country selections, or use two browser tabs with shared gross inputs.",
    },
    "Salary After Tax Country-wise Calculator",
    "Compare take-home pay across USA, UK, Canada, Australia, and UAE.",
    ["salary after tax by country", "international salary comparison"],
  ),
  "cost-of-living-adjusted-salary-calculator": article(
    "cost-of-living-adjusted-salary-calculator",
    "Cost of living adjusted salary",
    [
      "Equivalent salary = current salary × (destination COL index ÷ origin COL index).",
      "Use indices from Numbeo, Mercer, or your employer's relocation tables—higher index means higher cost of living.",
    ],
    {
      question: "What COL index should I use?",
      answer: "Use the same source for both cities so the ratio is meaningful. Example planning set: NYC 100, London 95, Dubai 75.",
    },
    "Cost of Living Adjusted Salary Calculator",
    "Convert salary to an equivalent amount in another city using COL indices.",
    ["cost of living salary calculator", "COL adjusted salary"],
  ),
};
