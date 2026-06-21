import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/time-date/tdate-business-productivity";
const HUB_LABEL = "Conversion · Business & productivity time";
const SHELL = "Payroll and SLA math runs in your browser. Confirm rates and rules with your employer or contract.";

function article(slug: string, heading: string, paragraph: string, seoTitle: string, seoDescription: string, keywords: string[]): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "conversion",
    shellNote: SHELL,
    sections: [{ heading, paragraphs: [paragraph] }],
    tables: [{ title: "Quick tip", columnHeaders: ["Topic", "Note"], rows: [["Overtime", "Threshold and multiplier vary by region"], ["SLA", "Uses calendar hours from receipt time"]] }],
    chart: { kind: "sparkTrendDemo", title: "Adjust shift → see totals", caption: "Share URL preserves your inputs.", sparkValues: [0.3, 0.55, 0.8, 1] },
    faq: [{ question: "Are holidays excluded?", answer: "Business-day tools skip weekends only; public holidays are not subtracted." }],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const TIME_DATE_BUSINESS_ARTICLES: Record<string, RichArticle> = {
  "tdate-timesheet-calculator": article("tdate-timesheet-calculator", "Timesheet", "Weekly hours from daily shift and days worked.", "Timesheet Calculator", "Calculate weekly hours from shift pattern.", ["timesheet calculator"]),
  "tdate-work-hours-calculator-business": article("tdate-work-hours-calculator-business", "Work Hours", "Period totals with optional pay estimate.", "Work Hours Calculator Business", "Calculate work hours over a period.", ["work hours calculator"]),
  "tdate-overtime-calculator": article("tdate-overtime-calculator", "Overtime", "Regular vs OT split with pay estimate.", "Overtime Calculator", "Calculate overtime hours and pay.", ["overtime calculator"]),
  "tdate-shift-duration-calculator": article("tdate-shift-duration-calculator", "Shift Duration", "Paid shift length including overnight.", "Shift Duration Calculator", "Calculate shift duration with breaks.", ["shift duration calculator"]),
  "tdate-payroll-hours-calculator": article("tdate-payroll-hours-calculator", "Payroll Hours", "Gross pay from regular and OT hours.", "Payroll Hours Calculator", "Calculate gross pay from hours worked.", ["payroll hours calculator"]),
  "tdate-project-duration-calculator": article("tdate-project-duration-calculator", "Project Duration", "Person-hours and FTE from project dates.", "Project Duration Calculator", "Estimate project effort in person-hours.", ["project duration calculator"]),
  "tdate-deadline-calculator": article("tdate-deadline-calculator", "Deadline", "Due date after business days.", "Deadline Calculator", "Calculate deadline after business days.", ["deadline calculator business days"]),
  "tdate-sla-time-calculator": article("tdate-sla-time-calculator", "SLA Time", "SLA deadline and breach check.", "SLA Time Calculator", "Track SLA remaining time and breaches.", ["sla calculator"]),
  "tdate-turnaround-time-calculator": article("tdate-turnaround-time-calculator", "Turnaround Time", "Calendar and business hours elapsed.", "Turnaround Time Calculator", "Measure turnaround time between timestamps.", ["turnaround time calculator"]),
};
