import type { RichArticle } from "./types";

const HUB_HREF = "/business/hr-productivity/hr-scheduling-shift";
const HUB_LABEL = "Business · HR & productivity · Scheduling and shift planning";
const SHELL =
  "Shift and coverage planning estimates in your browser. Not labor-law advice. Fatigue, rest days, and local rules still apply.";

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
        title: "Scheduling tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Shift planning", "Coverage ÷ length × people"],
          ["Rotation", "Cycle ÷ teams"],
          ["Coverage", "Available ÷ needed"],
          ["Differential pay", "Base × (1+% )"],
        ],
      },
    ],
    chart: { kind: "none", title: "Overview", caption: "Share URL preserves scheduling inputs." },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const items: [string, string, string[], string, string, string, string, string[]][] = [
  ["hr-shift-planning-calculator", "Shift planning", ["Estimates shifts and headcount from coverage hours, shift length, and people per shift.", "Relief/float staff not automatic."], "24×7 coverage?", "Enter 24 coverage hours and your shift length.", "Shift Planning Calculator", "Plan shifts and headcount for coverage.", ["shift planning"]],
  ["hr-rotational-shift-calculator", "Rotational shift", ["Illustrative days-on from cycle length and number of teams.", "Does not enforce legal rest intervals."], "Common 3-team roster?", "Many plants use 3 teams on 21-day cycles as a teaching pattern.", "Rotational Shift Calculator", "Estimate rotation days on per team.", ["rotational shift"]],
  ["hr-staffing-coverage-calculator", "Staffing coverage", ["Coverage % = available ÷ needed; gap shows shortfall.", "Skills matching is not modeled."], "Include absentees?", "Reduce available for planned leave/absence.", "Staffing Coverage Calculator", "Measure staffing coverage percentage.", ["staffing coverage"]],
  ["hr-shift-differential-pay-calculator", "Shift differential pay", ["Applies differential % to base hourly for shift hours.", "Flat ₹ differentials can be converted to % first."], "Is differential taxable?", "Usually yes as salary — confirm with payroll.", "Shift Differential Pay Calculator", "Calculate shift differential pay.", ["shift differential"]],
];

export const HR_SCHEDULING_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  items.map(([slug, heading, paragraphs, q, a, seoTitle, seoDescription, keywords]) => [
    slug,
    article(slug, heading, paragraphs, { question: q, answer: a }, seoTitle, seoDescription, keywords),
  ]),
);
