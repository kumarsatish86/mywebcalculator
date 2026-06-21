import type { RichArticle } from "./types";

const HUB_HREF = "/ai/smart-tools/aist-conversion-utility";
const HUB_LABEL = "AI · Conversion & Utility Smart Tools";
const SHELL =
  "Rule-based logic in your browser—not a live LLM. Conversion and planning aids only; not financial, legal, or medical advice.";

function article(slug: string, heading: string, paragraph: string, seoTitle: string, seoDescription: string, keywords: string[]): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "ai",
    shellNote: SHELL,
    sections: [{ heading, paragraphs: [paragraph] }],
    tables: [{ title: "Quick tip", columnHeaders: ["Topic", "Note"], rows: [["Privacy", "Inputs stay on your device"], ["Decisions", "Verify critical conversions independently"]] }],
    chart: { kind: "sparkTrendDemo", title: "Convert → plan → optimize", caption: "Re-run as inputs change.", sparkValues: [0.3, 0.55, 0.8, 1] },
    faq: [{ question: "Are FX forecasts guaranteed?", answer: "No—scenario bands for planning only, not trading advice." }],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const AI_CONVERSION_SMART_ARTICLES: Record<string, RichArticle> = {
  "aist-ai-unit-conversion-advisor": article("aist-ai-unit-conversion-advisor", "Unit Conversion Advisor", "Length, weight, temperature, and volume with precision guidance.", "AI Unit Conversion Advisor", "Convert units with related equivalents and precision tips.", ["unit converter", "metric conversion"]),
  "aist-ai-currency-trend-predictor": article("aist-ai-currency-trend-predictor", "Currency Trend Predictor", "Spot FX conversion with trend-based scenario bands.", "AI Currency Trend Predictor", "Estimate currency conversion with volatility scenarios.", ["currency forecast", "exchange rate calculator"]),
  "aist-ai-time-zone-planner": article("aist-ai-time-zone-planner", "Time Zone Planner", "Multi-zone overlap and best meeting slot finder.", "AI Time Zone Planner", "Plan meetings across time zones with overlap analysis.", ["time zone planner", "meeting scheduler"]),
  "aist-ai-time-management-planner": article("aist-ai-time-management-planner", "Time Management Planner", "Priority-ranked day blocks with buffer and utilization.", "AI Time Management Planner", "Plan daily tasks with priority scheduling.", ["time management planner", "daily schedule"]),
  "aist-ai-productivity-score-calculator": article("aist-ai-productivity-score-calculator", "Productivity Score", "Focus, deep work, and interruption scoring.", "AI Productivity Score Calculator", "Calculate productivity score with improvement levers.", ["productivity score", "focus time calculator"]),
  "aist-ai-daily-routine-optimizer": article("aist-ai-daily-routine-optimizer", "Daily Routine Optimizer", "Energy-curve activity scheduling for your day.", "AI Daily Routine Optimizer", "Optimize daily routine by energy levels.", ["daily routine optimizer", "habit scheduler"]),
};
