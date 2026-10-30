import type { RichArticle } from "./types";

const HUB_HREF = "/business/hr-productivity/hr-productivity-performance";
const HUB_LABEL = "Business · HR & productivity · Productivity and performance";
const SHELL =
  "Productivity and KPI teaching tools in your browser. Not performance-management legal advice. Define output units consistently.";

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
        title: "Productivity tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Productivity / OPH", "Output ÷ hours"],
          ["Completion / efficiency", "Done ÷ total or standard"],
          ["Team / workforce", "Output per hours and head"],
          ["Utilization", "Billable ÷ available"],
          ["KPI / target / score", "Achievement and weighted scores"],
        ],
      },
    ],
    chart: { kind: "none", title: "Overview", caption: "Share URL preserves productivity inputs." },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const items: [string, string, string[], string, string, string, string, string[]][] = [
  ["hr-employee-productivity-calculator", "Employee productivity", ["Output per hour for an individual contributor.", "Choose a stable output unit (tickets, units, revenue)."], "Quality vs quantity?", "This tool measures volume only.", "Employee Productivity Calculator", "Calculate output per hour.", ["employee productivity"]],
  ["hr-task-completion-rate-calculator", "Task completion rate", ["Completed tasks ÷ total tasks × 100.", "Partial completion needs your scoring rule."], "Count cancelled tasks?", "Usually exclude from denominator if never started.", "Task Completion Rate Calculator", "Measure task completion percentage.", ["task completion rate"]],
  ["hr-efficiency-calculator", "Efficiency", ["Actual output ÷ standard output × 100.", "Standards should match similar work conditions."], "Over 100% possible?", "Yes when actual exceeds the standard.", "Efficiency Calculator — Actual vs Standard", "Calculate efficiency percentage.", ["efficiency calculator"]],
  ["hr-output-per-hour-calculator", "Output per hour", ["Simple throughput = output ÷ hours.", "Use for line or desk work baselines."], "Include overtime hours?", "Yes if measuring total period throughput.", "Output per Hour Calculator", "Find output per hour.", ["output per hour"]],
  ["hr-team-efficiency-calculator", "Team efficiency", ["Team output per hour and per headcount.", "Shared services may need allocation keys."], "How to count contractors?", "Include in headcount if they produce measured output.", "Team Efficiency Calculator", "Measure team output efficiency.", ["team efficiency"]],
  ["hr-workforce-productivity-calculator", "Workforce productivity", ["Workforce-level output rate and per-person share.", "Pair with utilization for a fuller view."], "Same as team efficiency?", "Same math; framed for larger workforce planning.", "Workforce Productivity Calculator", "Estimate workforce productivity.", ["workforce productivity"]],
  ["hr-utilization-rate-calculator", "Utilization rate", ["Billable (or productive) hours ÷ available hours.", "Target utilization varies by role."], "What are available hours?", "Paid hours minus PTO/holidays in many models.", "Utilization Rate Calculator", "Calculate utilization percentage.", ["utilization rate"]],
  ["hr-kpi-calculator", "KPI", ["Achievement % = actual ÷ target.", "Supports any numeric KPI unit."], "Multiple KPIs?", "Use the performance score tool for weighted mixes.", "KPI Calculator — Actual vs Target", "Calculate KPI achievement.", ["KPI calculator"]],
  ["hr-performance-score-calculator", "Performance score", ["Weighted average of up to three scored factors.", "Weights should sum meaningfully (any positive total)."], "Scores on what scale?", "Use a consistent 0–100 (or 1–5 scaled) system.", "Performance Score Calculator", "Compute weighted performance score.", ["performance score"]],
  ["hr-target-achievement-calculator", "Target achievement", ["Shows achievement % and absolute gap.", "Gap is actual − target (can be negative)."], "Is gap always good when positive?", "Only if higher-is-better KPIs.", "Target Achievement Calculator", "Measure target achievement and gap.", ["target achievement"]],
];

export const HR_PRODUCTIVITY_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  items.map(([slug, heading, paragraphs, q, a, seoTitle, seoDescription, keywords]) => [
    slug,
    article(slug, heading, paragraphs, { question: q, answer: a }, seoTitle, seoDescription, keywords),
  ]),
);
