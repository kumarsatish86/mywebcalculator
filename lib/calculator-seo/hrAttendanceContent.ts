import type { RichArticle } from "./types";

const HUB_HREF = "/business/hr-productivity/hr-work-time-attendance";
const HUB_LABEL = "Business · HR & productivity · Work time and attendance";
const SHELL =
  "Attendance and time tools that run in your browser. Not legal or labor-law advice. Shift, OT, and leave rules vary by employer and jurisdiction.";

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
        title: "Attendance tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Work hours", "Shift span − break"],
          ["Timesheet", "Sum daily hours"],
          ["Weekly / monthly hours", "Hours × days"],
          ["Attendance %", "Present ÷ working days"],
          ["Leave balance", "Entitled − used"],
          ["Absence impact", "Daily cost × days"],
          ["OT hours", "Actual − scheduled"],
          ["Day/night shift", "Premium differential"],
          ["Break / time loss", "Idle vs productive"],
        ],
      },
    ],
    chart: { kind: "none", title: "Overview", caption: "Share URL preserves attendance inputs. Planning estimate only." },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const items: [string, string, string[], string, string, string, string, string[]][] = [
  ["hr-work-hours-calculator", "Work hours", ["Net work hours from start, end, and break minutes.", "Overnight shifts wrap past midnight in this model."], "How are overnight shifts handled?", "If end hour is earlier than start, the span adds 24 hours.", "Work Hours Calculator — Shift Minus Break", "Calculate net work hours from shift times and break.", ["work hours calculator", "shift hours"]],
  ["hr-timesheet-calculator", "Timesheet", ["Sums Mon–Sun daily hours into a weekly total.", "Use for contractor or employee weekly time review."], "Can I leave weekend blank?", "Enter 0 for days not worked.", "Timesheet Calculator — Weekly Hours Sum", "Sum daily timesheet hours for the week.", ["timesheet calculator", "weekly timesheet"]],
  ["hr-weekly-hours-calculator", "Weekly hours", ["Hours per day × days per week.", "Useful for FTE and capacity planning."], "Is lunch included?", "Use net productive hours if your policy excludes breaks.", "Weekly Hours Calculator", "Estimate weekly work hours from hours/day and days.", ["weekly hours calculator"]],
  ["hr-monthly-work-hours-calculator", "Monthly work hours", ["Hours/day × working days in the month.", "Public holidays reduce working days — adjust input."], "How many working days?", "Often ~22 in India; use your calendar.", "Monthly Work Hours Calculator", "Estimate monthly work hours from days and hours/day.", ["monthly work hours"]],
  ["hr-attendance-percentage-calculator", "Attendance percentage", ["Present days ÷ working days × 100.", "Partial days may need your policy's rounding rules."], "Do leaves count as present?", "Usually no — enter only days marked present.", "Attendance Percentage Calculator", "Calculate attendance % from present and working days.", ["attendance percentage"]],
  ["hr-leave-balance-calculator", "Leave balance", ["Entitled leave minus used leave.", "Carry-forward rules are not automatic here."], "What about carry forward?", "Add carried days into entitlement manually if needed.", "Leave Balance Calculator", "Find remaining leave balance.", ["leave balance calculator"]],
  ["hr-absence-impact-calculator", "Absence impact", ["Daily cost × absent days for a rough productivity/cost impact.", "Does not include overtime cover or quality loss."], "What daily cost should I use?", "Fully loaded daily employee cost is a common teaching input.", "Absence Impact Calculator", "Estimate cost impact of absences.", ["absence cost calculator"]],
  ["hr-overtime-hours-calculator", "Overtime hours", ["OT hours = max(0, actual − scheduled).", "Pay rates are handled in the overtime pay tool."], "Comp-off instead of OT?", "Policy-dependent; this tool only measures hours.", "Overtime Hours Calculator", "Find OT hours from actual vs scheduled.", ["overtime hours calculator"]],
  ["hr-shift-calculator-day-night", "Shift day/night", ["Compares day pay vs night pay with a premium percentage.", "Night differential policies vary widely."], "Is premium on whole shift?", "This model applies premium to the entered shift hours.", "Shift Calculator — Day vs Night Pay", "Compare day and night shift pay with premium.", ["night shift differential"]],
  ["hr-break-time-calculator", "Break time", ["Shows break hours and remaining productive span.", "Statutory break rules differ by hours worked."], "Is break paid?", "Depends on policy — this tool only measures time.", "Break Time Calculator", "Calculate break hours within a shift.", ["break time calculator"]],
  ["hr-productivity-time-loss-calculator", "Productivity time loss", ["Idle minutes converted to hours and % of productive schedule.", "Use for process improvement, not discipline."], "What counts as idle?", "Meetings, waiting, or system downtime — define consistently.", "Productivity Time Loss Calculator", "Estimate productive time lost to idle minutes.", ["productivity time loss"]],
];

export const HR_ATTENDANCE_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  items.map(([slug, heading, paragraphs, q, a, seoTitle, seoDescription, keywords]) => [
    slug,
    article(slug, heading, paragraphs, { question: q, answer: a }, seoTitle, seoDescription, keywords),
  ]),
);
