import type { RichArticle } from "./types";

const HUB_HREF = "/finance/salary-income/work-time-pay-calculators";
const HUB_LABEL = "Finance · Work Time and Pay Calculators";
const SHELL =
  "Runs in your browser. Hourly, overtime, and shift pay estimates—verify multipliers and rules with your employer or local labour law.";

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
        title: "Common pay multipliers",
        columnHeaders: ["Type", "Typical multiplier"],
        rows: [
          ["Overtime", "1.5× hourly rate"],
          ["Holiday / double time", "2× hourly rate"],
          ["Night shift allowance", "10–25% on base rate"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Hours × rate → pay",
      caption: "Share URL preserves your inputs.",
      sparkValues: [0.25, 0.5, 0.75, 1],
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const WORK_TIME_PAY_ARTICLES: Record<string, RichArticle> = {
  "hourly-wage-calculator": article(
    "hourly-wage-calculator",
    "Hourly wage conversions",
    [
      "Convert hourly rate to weekly, monthly, and annual pay using your hours per week and weeks per year.",
      "Or enter annual salary to derive an equivalent hourly rate for comparison across job offers.",
    ],
    {
      question: "How many weeks per year should I use?",
      answer: "52 is standard. Use 50–52 if you account for unpaid leave; some planners use 48 for conservative estimates.",
    },
    "Hourly Wage Calculator — Rate to Annual Pay",
    "Convert hourly wage to weekly, monthly, and annual pay—or annual salary to hourly rate.",
    ["hourly wage calculator", "hourly to annual salary"],
  ),
  "overtime-pay-calculator": article(
    "overtime-pay-calculator",
    "Overtime pay",
    [
      "Regular pay = regular hours × hourly rate. Overtime pay = overtime hours × hourly rate × multiplier (often 1.5×).",
      "Rules vary by country and employer—adjust the multiplier to match your contract or statute.",
    ],
    {
      question: "What is the standard overtime rate?",
      answer: "In the US and many countries, 1.5× (time-and-a-half) is common after 40 hours/week. India Factories Act uses 2× for overtime in many cases—check your applicable law.",
    },
    "Overtime Pay Calculator — Time and a Half",
    "Calculate regular and overtime pay with a configurable multiplier.",
    ["overtime pay calculator", "time and a half calculator"],
  ),
  "double-pay-holiday-pay-calculator": article(
    "double-pay-holiday-pay-calculator",
    "Double pay and holiday premium",
    [
      "Total pay = holiday hours × hourly rate × multiplier. Premium = total − base pay at 1×.",
      "Use multiplier 2 for double time, or enter your employer's holiday premium factor.",
    ],
    {
      question: "Is holiday pay mandatory?",
      answer: "Depends on jurisdiction and employer policy. This tool models pay math only—not legal entitlement.",
    },
    "Double Pay / Holiday Pay Calculator",
    "Estimate holiday or premium pay when hours earn a multiple of the normal hourly rate.",
    ["double pay calculator", "holiday pay calculator"],
  ),
  "work-hours-calculator": article(
    "work-hours-calculator",
    "Total hours worked",
    [
      "Weekly hours = hours per day × days per week. Annual hours = weekly × weeks per year.",
      "Useful for FTE planning, part-time schedules, and comparing contracted hours to actual time.",
    ],
    {
      question: "Should I subtract break time?",
      answer: "Enter net working hours per day after unpaid breaks if that matches how your employer counts time.",
    },
    "Work Hours Calculator — Weekly and Annual Hours",
    "Convert daily hours and days per week into weekly, monthly, and annual hours.",
    ["work hours calculator", "annual hours worked"],
  ),
  "timesheet-calculator": article(
    "timesheet-calculator",
    "Timesheet total pay",
    [
      "Combines regular and overtime hours for a pay period into one total payout.",
      "Same math as the overtime calculator—oriented toward weekly or bi-weekly timesheet totals.",
    ],
    {
      question: "Can I use this for bi-weekly pay?",
      answer: "Yes—enter total regular and OT hours for the period. The result is total gross pay for that timesheet.",
    },
    "Timesheet Calculator — Regular + Overtime Pay",
    "Total pay from hourly rate, regular hours, overtime hours, and OT multiplier.",
    ["timesheet calculator", "timesheet pay calculator"],
  ),
  "shift-pay-calculator": article(
    "shift-pay-calculator",
    "Shift differential pay",
    [
      "Shift pay = base hours pay + differential (base × differential %). Common for evening or weekend shifts.",
      "Effective hourly = base rate × (1 + differential % ÷ 100).",
    ],
    {
      question: "What is a typical shift differential?",
      answer: "10–15% for evening shifts and 15–20% for night or weekend shifts are common in manufacturing and healthcare—your policy may differ.",
    },
    "Shift Pay Calculator — Shift Differential",
    "Calculate shift pay with a percentage differential on base hourly rate.",
    ["shift pay calculator", "shift differential calculator"],
  ),
  "night-shift-allowance-calculator": article(
    "night-shift-allowance-calculator",
    "Night shift allowance",
    [
      "Night pay = base pay + allowance (base × allowance %). Models extra pay for hours worked in defined night windows.",
      "Some employers use a flat allowance per hour instead of a percentage—convert to an equivalent % if needed.",
    ],
    {
      question: "What hours count as night shift in India?",
      answer: "Often 10 PM–6 AM under labour rules, but company policy varies. Enter hours and allowance per your contract.",
    },
    "Night Shift Allowance Calculator",
    "Estimate night shift pay with an extra allowance percentage on base hourly rate.",
    ["night shift allowance calculator", "night shift pay calculator"],
  ),
};
