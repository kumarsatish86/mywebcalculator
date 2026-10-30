import type { RichArticle } from "./types";

const HUB_HREF = "/business/hr-productivity/hr-workforce-planning";
const HUB_LABEL = "Business · HR & productivity · Workforce planning";
const SHELL =
  "Workforce planning estimates in your browser. Not legal advice. Validate demand and productivity assumptions with operations.";

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
        title: "Workforce tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Headcount", "Current + hires − exits"],
          ["Planning", "Growth + attrition hires"],
          ["Staffing needs", "Demand ÷ productivity"],
          ["Workload", "Load per person"],
        ],
      },
    ],
    chart: { kind: "none", title: "Overview", caption: "Share URL preserves workforce inputs." },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const items: [string, string, string[], string, string, string, string, string[]][] = [
  ["hr-headcount-calculator", "Headcount", ["Ending headcount = current + hires − exits.", "Transfers between teams may need netting."], "Contractors included?", "Only if you treat them as HC in your model.", "Headcount Calculator", "Project ending headcount.", ["headcount calculator"]],
  ["hr-workforce-planning-calculator", "Workforce planning", ["Applies growth to current HC and adds attrition replacements for net hire estimate.", "Ignores hiring lag and productivity ramp."], "Net hires can be fractional?", "Yes — round per your hiring batch rules.", "Workforce Planning Calculator", "Plan headcount with growth and attrition.", ["workforce planning"]],
  ["hr-staffing-needs-calculator", "Staffing needs", ["FTE need = demand units ÷ productivity per FTE.", "Demand must use the same unit as productivity."], "What is a demand unit?", "Calls, tickets, patients, store visits — whatever you measure.", "Staffing Needs Calculator", "Estimate FTE staffing need from demand.", ["staffing needs"]],
  ["hr-workload-distribution-calculator", "Workload distribution", ["Per-person workload and optional utilization vs capacity.", "Uneven skill mixes need manual weighting."], "Over 100% utilization?", "Signals overload or underestimated capacity.", "Workload Distribution Calculator", "Distribute workload across a team.", ["workload distribution"]],
];

export const HR_WORKFORCE_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  items.map(([slug, heading, paragraphs, q, a, seoTitle, seoDescription, keywords]) => [
    slug,
    article(slug, heading, paragraphs, { question: q, answer: a }, seoTitle, seoDescription, keywords),
  ]),
);
