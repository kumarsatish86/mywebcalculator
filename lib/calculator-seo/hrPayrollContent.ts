import type { RichArticle } from "./types";

const HUB_HREF = "/business/hr-productivity/hr-payroll-salary";
const HUB_LABEL = "Business · HR & productivity · Payroll and salary";
const SHELL =
  "HR and payroll teaching estimates that run in your browser. Not legal, tax, or payroll advice. PF, ESI, PT, TDS, and income-tax rules vary by statute, state, and employer policy — verify with a qualified payroll professional.";

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
    category: "business",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Payroll and salary tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Salary convert", "Annual ↔ monthly ↔ hourly"],
          ["In-hand / net", "Gross − PF − tax − other"],
          ["Gross", "Basic + HRA + allowances"],
          ["Breakdown", "Illustrative CTC component split"],
          ["Payroll / payslip", "Net + employer cost estimate"],
          ["Payroll tax", "Simplified annual tax ÷ 12"],
          ["Overtime / holiday", "Rate × hours/days × premium"],
          ["Income tax", "Illustrative new-regime slabs"],
          ["PF", "12% on wages (ceiling teaching)"],
          ["ESI", "0.75% + 3.25% under ceiling"],
          ["Professional tax", "State slab estimate"],
          ["TDS", "Monthly withholding estimate"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption: "Share URL preserves inputs. Teaching estimate only — not legal payroll advice.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const HR_PAYROLL_ARTICLES: Record<string, RichArticle> = {
  "hr-salary-annual-monthly-hourly-calculator": article(
    "hr-salary-annual-monthly-hourly-calculator",
    "Salary annual ↔ monthly ↔ hourly",
    [
      "Converts compensation across annual, monthly, and hourly views using your hours-per-week and weeks-per-year assumptions.",
      "Contracted hours, paid leave, and overtime policies change effective hourly rates — use your offer letter for exact figures.",
    ],
    {
      question: "Which input should I fill?",
      answer: "Enter any one of annual, monthly, or hourly; leave the others blank. The tool derives the rest from weeks and hours settings.",
    },
    "Salary Calculator — Annual, Monthly, Hourly Convert",
    "Convert salary between annual, monthly, and hourly. HR teaching estimate — verify with your offer.",
    ["salary calculator", "annual to monthly salary", "hourly rate from CTC"],
  ),
  "hr-in-hand-salary-calculator": article(
    "hr-in-hand-salary-calculator",
    "In-hand salary",
    [
      "Estimates take-home pay by subtracting PF%, tax%, and other deductions from gross monthly salary.",
      "Real in-hand depends on tax regime, exemptions, and statutory ceilings — treat results as planning only.",
    ],
    {
      question: "Is PF always 12% of gross?",
      answer: "No. EPF is typically on basic (often with a wage ceiling). Enter the effective % that matches your payslip.",
    },
    "In-hand Salary Calculator — Take-home from Gross",
    "Estimate in-hand salary after PF, tax, and other deductions. Not payroll advice.",
    ["in hand salary calculator", "take home salary India", "net from gross"],
  ),
  "hr-net-salary-calculator": article(
    "hr-net-salary-calculator",
    "Net salary",
    [
      "Computes net monthly pay after configurable deduction percentages and fixed other amounts.",
      "Use alongside CTC and statutory tools for a fuller employer-vs-employee cost picture.",
    ],
    {
      question: "Net vs in-hand?",
      answer: "They are often used interchangeably for take-home. This tool uses the same gross-minus-deductions model.",
    },
    "Net Salary Calculator — After Deductions",
    "Calculate net salary from gross and deduction rates. HR estimate only.",
    ["net salary calculator", "salary after deductions", "take home pay"],
  ),
  "hr-gross-salary-calculator": article(
    "hr-gross-salary-calculator",
    "Gross salary",
    [
      "Adds basic, HRA, and allowances into a gross figure used by many payroll workflows.",
      "Some employers include employer PF inside CTC but not gross — check your salary structure notes.",
    ],
    {
      question: "Is CTC the same as gross?",
      answer: "Usually no. CTC often includes employer contributions that are not paid as employee gross.",
    },
    "Gross Salary Calculator — Basic + HRA + Allowances",
    "Sum salary components into gross pay. Business HR teaching aid.",
    ["gross salary calculator", "basic hra allowance", "salary components"],
  ),
  "hr-salary-breakdown-calculator": article(
    "hr-salary-breakdown-calculator",
    "Salary breakdown",
    [
      "Splits monthly CTC into an illustrative basic, HRA, and special allowance structure with employer PF estimate.",
      "Actual structures (flexible benefits, LTA, specials) are employer-specific.",
    ],
    {
      question: "Why is basic often ~40%?",
      answer: "Many India offers use ~40% basic of CTC as a teaching default; your policy may differ.",
    },
    "Salary Breakdown Calculator — CTC Components",
    "Illustrative CTC split into basic, HRA, and special allowance. Not legal advice.",
    ["salary breakdown calculator", "CTC structure", "basic HRA split"],
  ),
  "hr-payroll-calculator": article(
    "hr-payroll-calculator",
    "Payroll calculator",
    [
      "Builds a payslip-style net, deduction total, and illustrative employer cost from gross and rates.",
      "Useful for small-team planning before running formal payroll software.",
    ],
    {
      question: "Does this replace payroll software?",
      answer: "No. It is a teaching estimate for education and rough budgeting only.",
    },
    "Payroll Calculator — Net and Employer Cost",
    "Estimate employee net and employer payroll cost. HR planning aid.",
    ["payroll calculator", "employer payroll cost", "payslip estimate"],
  ),
  "hr-payslip-generator-tool": article(
    "hr-payslip-generator-tool",
    "Payslip generator",
    [
      "Produces a teaching payslip-style breakdown of net pay and deductions for review or download workflows on the page.",
      "Official payslips must follow employer templates and statutory formats.",
    ],
    {
      question: "Can I use this as an official payslip?",
      answer: "No. Use your employer's payroll system for official documents.",
    },
    "Payslip Generator — Teaching Breakdown",
    "Generate a teaching payslip-style salary breakdown. Not an official payslip.",
    ["payslip generator", "salary slip calculator", "payslip breakdown"],
  ),
  "hr-payroll-tax-calculator": article(
    "hr-payroll-tax-calculator",
    "Payroll tax",
    [
      "Estimates monthly payroll income tax by applying simplified annual teaching slabs and dividing by 12.",
      "Surcharge, cess, and regime choice are simplified — verify with a tax professional.",
    ],
    {
      question: "Which tax regime is used?",
      answer: "An illustrative new-regime style slab set for teaching. Enter your advisor's figures for real filing.",
    },
    "Payroll Tax Calculator — Monthly Tax Estimate",
    "Estimate monthly payroll tax from simplified annual slabs. Not tax advice.",
    ["payroll tax calculator", "monthly income tax estimate", "salary tax"],
  ),
  "hr-overtime-pay-calculator": article(
    "hr-overtime-pay-calculator",
    "Overtime pay",
    [
      "Multiplies hourly rate by OT hours and a premium multiplier (for example 1.5×).",
      "Factory Act / state rules and exempt roles can change eligibility — check policy.",
    ],
    {
      question: "Is 1.5× always required?",
      answer: "Not always. Multipliers and eligibility depend on law and employment contract.",
    },
    "Overtime Pay Calculator — Hours × Rate × Premium",
    "Calculate overtime pay from hourly rate, hours, and multiplier.",
    ["overtime pay calculator", "OT wages", "time and a half"],
  ),
  "hr-holiday-pay-calculator": article(
    "hr-holiday-pay-calculator",
    "Holiday pay",
    [
      "Estimates holiday compensation from daily rate, holiday days, and optional premium multiplier.",
      "Public holiday and weekly-off policies differ by establishment.",
    ],
    {
      question: "Daily rate from monthly?",
      answer: "Common teaching shortcuts use monthly ÷ 26 or ÷ 30. Use the divisor your policy states.",
    },
    "Holiday Pay Calculator — Daily Rate × Days",
    "Estimate holiday pay from daily rate and days. HR teaching tool.",
    ["holiday pay calculator", "public holiday wages", "festival pay"],
  ),
  "hr-income-tax-calculator": article(
    "hr-income-tax-calculator",
    "Income tax (illustrative)",
    [
      "Applies simplified progressive teaching slabs to annual income for classroom-style estimates.",
      "Not a substitute for the Income Tax Department utilities or a CA.",
    ],
    {
      question: "Are slabs current?",
      answer: "They are illustrative teaching bands. Always confirm the latest Finance Act slabs.",
    },
    "Income Tax Calculator — Illustrative Annual Tax",
    "Illustrative income tax from simplified slabs. Not legal tax advice.",
    ["income tax calculator", "salary tax India", "new regime estimate"],
  ),
  "hr-pf-provident-fund-calculator": article(
    "hr-pf-provident-fund-calculator",
    "PF (Provident Fund)",
    [
      "Estimates employee and employer EPF at a configurable rate, optionally capped at the illustrative ₹15,000 wage ceiling.",
      "EPS split and actual EPFO rules can differ — label outputs as estimates only.",
    ],
    {
      question: "Should I use the wage ceiling?",
      answer: "Many establishments still use the statutory wage ceiling for contributions; some contribute on full basic. Toggle to match policy.",
    },
    "PF Calculator — Provident Fund Estimate",
    "Estimate EPF employee and employer contributions with optional wage ceiling. Not legal advice.",
    ["PF calculator", "EPF contribution", "provident fund India"],
  ),
  "hr-esi-calculator": article(
    "hr-esi-calculator",
    "ESI",
    [
      "Estimates ESIC employee (0.75%) and employer (3.25%) contributions when wages are under the illustrative monthly ceiling.",
      "Coverage thresholds and rates can change — confirm with ESIC / payroll.",
    ],
    {
      question: "What if wages exceed the ceiling?",
      answer: "This teaching tool returns zero ESI when above the illustrative ceiling; verify current coverage rules for your unit.",
    },
    "ESI Calculator — Employee and Employer Share",
    "Estimate ESI contributions under wage ceiling. Teaching estimate only.",
    ["ESI calculator", "ESIC contribution", "employee state insurance"],
  ),
  "hr-professional-tax-calculator": article(
    "hr-professional-tax-calculator",
    "Professional tax",
    [
      "Applies an illustrative state-style PT slab (or your override amount) to monthly salary.",
      "Professional tax is state-specific with different slabs and caps.",
    ],
    {
      question: "Is PT the same in every state?",
      answer: "No. Enter your state's monthly PT or use the override field for accuracy.",
    },
    "Professional Tax Calculator — State PT Estimate",
    "Estimate professional tax from illustrative slabs or an override amount.",
    ["professional tax calculator", "PT salary", "state professional tax"],
  ),
  "hr-tds-calculator": article(
    "hr-tds-calculator",
    "TDS",
    [
      "Estimates monthly TDS from a flat rate or by spreading an estimated annual tax across 12 months.",
      "Employer Form 16 / tax computation is authoritative.",
    ],
    {
      question: "Flat % or annual tax ÷ 12?",
      answer: "Use flat % when payroll applies a fixed withholding. Otherwise leave % blank and supply annual tax or let the tool estimate.",
    },
    "TDS Calculator — Monthly Withholding Estimate",
    "Estimate monthly TDS from rate or annual tax. Not tax advice.",
    ["TDS calculator", "salary TDS", "tax deducted at source"],
  ),
};
