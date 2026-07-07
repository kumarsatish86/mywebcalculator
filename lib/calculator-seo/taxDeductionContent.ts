import type { RichArticle } from "./types";

const HUB_HREF = "/finance/salary-income/tax-deduction-calculators";
const HUB_LABEL = "Finance · Tax and Deduction Calculators";
const SHELL =
  "Runs in your browser. Uses a simplified flat-rate model for planning—verify against your country's tax rules and payslip.";

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
        title: "Planning tip",
        columnHeaders: ["Input", "Guidance"],
        rows: [
          ["Tax rate", "Use your effective (blended) rate for quick estimates"],
          ["Deductions", "Group exemptions and chapter deductions as your form allows"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Gross → taxable → net",
      caption: "Share URL preserves your inputs.",
      sparkValues: [1, 0.85, 0.7, 0.75],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const TAX_DEDUCTION_ARTICLES: Record<string, RichArticle> = {
  "income-tax-calculator-global": article(
    "income-tax-calculator-global",
    "How global income tax is estimated here",
    [
      "Taxable income = gross annual income − standard deduction − other deductions. Income tax = taxable income × tax rate%.",
      "Enter your effective tax rate (blended across brackets) for a quick estimate. For slab-wise calculation, use country-specific tools such as our India old vs new regime calculator.",
    ],
    {
      question: "Does this use progressive tax slabs?",
      answer: "No—enter a single effective rate. This keeps the tool useful across countries without hard-coding one jurisdiction.",
    },
    "Income Tax Calculator (Global) — Estimate Tax from Gross Income",
    "Estimate annual income tax from gross income, deductions, and an effective tax rate. Free browser-based planning tool.",
    ["income tax calculator global", "annual income tax estimate"],
  ),
  "after-tax-salary-calculator": article(
    "after-tax-salary-calculator",
    "After-tax (take-home) salary",
    [
      "Net monthly = gross monthly × (1 − tax% − other deductions%). Other deductions cover PF, insurance, and professional tax expressed as a percentage of gross.",
      "Use this when comparing offers or budgeting from a quoted gross salary.",
    ],
    {
      question: "How is this different from salary after tax?",
      answer: "Both estimate net pay. This tool takes monthly gross; the salary-after-tax calculator starts from annual gross.",
    },
    "After Tax Salary Calculator — Monthly Take-Home Pay",
    "Calculate monthly after-tax salary from gross pay, tax rate, and deduction percentage.",
    ["after tax salary calculator", "take home pay calculator"],
  ),
  "tax-refund-calculator": article(
    "tax-refund-calculator",
    "Refund vs balance due",
    [
      "Tax owed = taxable income × tax rate%. If tax already paid or withheld exceeds tax owed, you get a refund. If you paid less, you owe the difference.",
      "Useful at year-end when reconciling Form 16, W-2, or self-assessment figures.",
    ],
    {
      question: "What counts as tax already paid?",
      answer: "Enter total TDS, advance tax, or withholding credited for the year—not monthly amounts.",
    },
    "Tax Refund Calculator — Estimate Refund or Amount Due",
    "Compare tax owed with tax already paid to estimate your refund or balance due.",
    ["tax refund calculator", "tax balance due calculator"],
  ),
  "tds-calculator": article(
    "tds-calculator",
    "Monthly TDS (tax deducted at source)",
    [
      "Method 1: divide estimated annual tax by 12 for monthly TDS—common when employers project full-year liability.",
      "Method 2: apply a TDS percentage directly to monthly gross when a fixed rate applies to certain payments.",
    ],
    {
      question: "Is this specific to India?",
      answer: "TDS is widely used in India, but withholding tax works similarly elsewhere. Enter figures in your local currency.",
    },
    "TDS Calculator — Monthly Tax Deducted at Source",
    "Estimate monthly TDS from annual tax projection or a percentage on gross salary.",
    ["TDS calculator", "monthly TDS on salary"],
  ),
  "taxable-income-calculator": article(
    "taxable-income-calculator",
    "Finding taxable income",
    [
      "Taxable income = gross income − exemptions − deductions. Exemptions may include standard deduction; deductions cover 80C, HRA, or similar items depending on your regime.",
      "This is the base amount tax slabs or a flat rate are applied to.",
    ],
    {
      question: "What is the difference between exemptions and deductions?",
      answer: "Both reduce taxable income. Group them by how your tax form labels them—the math is the same here.",
    },
    "Taxable Income Calculator — Gross Minus Deductions",
    "Calculate taxable income from gross income, exemptions, and deductions.",
    ["taxable income calculator", "gross to taxable income"],
  ),
  "salary-after-tax-calculator": article(
    "salary-after-tax-calculator",
    "Annual salary after tax",
    [
      "Starts from gross annual salary. Applies tax% and other deductions% to derive net annual and equivalent monthly pay.",
      "Helpful when job offers quote annual CTC or package figures.",
    ],
    {
      question: "Should I enter CTC or gross?",
      answer: "Enter gross salary before employee-side deductions, not full CTC which includes employer costs.",
    },
    "Salary After Tax Calculator — Net Annual and Monthly Pay",
    "Convert gross annual salary to net annual and monthly pay after tax and deductions.",
    ["salary after tax calculator", "net annual salary"],
  ),
  "effective-tax-rate-calculator": article(
    "effective-tax-rate-calculator",
    "Effective vs marginal tax rate",
    [
      "Effective tax rate = (total tax paid ÷ gross income) × 100. It reflects your real tax burden after deductions and credits, not just the top slab rate.",
      "Use this to compare regimes, years, or job offers on an apples-to-apples basis.",
    ],
    {
      question: "Should gross income include pre-tax deductions?",
      answer: "Use total gross before income tax. Do not subtract 401(k) or PF from gross unless that is how your tax authority defines it.",
    },
    "Effective Tax Rate Calculator",
    "Calculate your effective tax rate from gross income and total tax paid.",
    ["effective tax rate calculator", "average tax rate"],
  ),
};
