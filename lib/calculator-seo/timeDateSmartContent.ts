import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/time-date/tdate-super-advanced";
const HUB_LABEL = "Conversion · Smart time analytics";
const SHELL = "Analytics-style scores are heuristic experiments — not HR, medical, or clinical assessments.";

function article(slug: string, heading: string, paragraph: string, seoTitle: string, seoDescription: string, keywords: string[]): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "conversion",
    shellNote: SHELL,
    sections: [{ heading, paragraphs: [paragraph] }],
    tables: [{ title: "Quick tip", columnHeaders: ["Topic", "Note"], rows: [["Scores", "Heuristic guides only"], ["24h budget", "Leave buffer time"]] }],
    chart: { kind: "sparkTrendDemo", title: "Adjust inputs → see score", caption: "Share URL preserves inputs.", sparkValues: [0.35, 0.55, 0.75, 1] },
    faq: [{ question: "Are scores official?", answer: "No — they are rough planning aids for personal experiments." }],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const TIME_DATE_SMART_ARTICLES: Record<string, RichArticle> = {
  "tdate-ai-meeting-scheduler": article("tdate-ai-meeting-scheduler", "AI Meeting Scheduler", "Score multi-zone meeting slots.", "AI Meeting Scheduler", "Find fair meeting times across time zones.", ["ai meeting scheduler"]),
  "tdate-smart-time-planner": article("tdate-smart-time-planner", "Smart Time Planner", "Block tasks into a workday.", "Smart Time Planner Calculator", "Plan your day with task blocks.", ["time planner"]),
  "tdate-productivity-time-analyzer": article("tdate-productivity-time-analyzer", "Productivity Analyzer", "Score focus vs meeting load.", "Productivity Time Analyzer", "Analyze daily productivity mix.", ["productivity analyzer"]),
  "tdate-time-tracking-dashboard": article("tdate-time-tracking-dashboard", "Time Dashboard", "Category breakdown of your day.", "Time Tracking Dashboard", "Visualize time by category.", ["time tracking dashboard"]),
  "tdate-daily-time-usage-calculator": article("tdate-daily-time-usage-calculator", "Daily Time Usage", "24-hour life budget.", "Daily Time Usage Calculator", "Budget your 24-hour day.", ["daily time usage"]),
  "tdate-habit-time-analyzer": article("tdate-habit-time-analyzer", "Habit Analyzer", "Habit consistency score.", "Habit Time Analyzer", "Track habit time and streaks.", ["habit time analyzer"]),
};
