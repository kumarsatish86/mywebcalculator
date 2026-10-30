import type { RichArticle } from "./types";

const HUB_HREF = "/business/hr-productivity/hr-advanced-ai";
const HUB_LABEL = "Business · HR & productivity · Advanced and AI-powered HR";
const SHELL =
  "Heuristic HR optimization helpers in your browser. Not AI hiring decisions or market survey data. Verify against policy, law, and real benchmarks.";

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
        title: "Advanced HR tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Salary benchmark", "Offer vs median band"],
          ["Workforce optimize", "Demand, idle, OT FTE"],
          ["Productivity analyzer", "Rate vs peer"],
          ["Hiring score", "Weighted factors"],
        ],
      },
    ],
    chart: { kind: "none", title: "Overview", caption: "Share URL preserves advanced HR inputs. Heuristic only." },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const items: [string, string, string[], string, string, string, string, string[]][] = [
  ["hr-ai-salary-benchmark-calculator", "AI salary benchmark", ["Compares an offer to median and optional P25/P75 bands with a heuristic label.", "Not a live salary survey."], "Where do medians come from?", "You supply them from your market data source.", "AI Salary Benchmark Calculator", "Heuristic offer vs market median band.", ["salary benchmark"]],
  ["hr-ai-workforce-optimization-tool", "AI workforce optimization", ["Suggests FTE adjustments from demand gap, idle %, and OT pressure.", "Operations must validate safety and service levels."], "Is this auto-scheduling?", "No — it is a capacity heuristic only.", "AI Workforce Optimization Tool", "Heuristic FTE optimization from demand and OT.", ["workforce optimization"]],
  ["hr-ai-productivity-analyzer", "AI productivity analyzer", ["Compares individual output/hour to a peer benchmark rate.", "Avoid using alone for performance actions."], "Fair peer set?", "Match role, tools, and work mix.", "AI Productivity Analyzer", "Compare productivity vs peer benchmark.", ["productivity analyzer"]],
  ["hr-ai-hiring-decision-score-tool", "AI hiring decision score", ["Weighted score across skill, culture, experience, and compensation fit.", "Not an automated hire/no-hire system."], "Can weights change?", "Yes — defaults are illustrative; adjust in process docs.", "AI Hiring Decision Score Tool", "Weighted hiring score from scored factors.", ["hiring decision score"]],
];

export const HR_AI_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  items.map(([slug, heading, paragraphs, q, a, seoTitle, seoDescription, keywords]) => [
    slug,
    article(slug, heading, paragraphs, { question: q, answer: a }, seoTitle, seoDescription, keywords),
  ]),
);
