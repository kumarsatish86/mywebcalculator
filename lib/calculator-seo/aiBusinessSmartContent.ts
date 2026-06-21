import type { RichArticle } from "./types";

const HUB_HREF = "/ai/smart-tools/aist-business-professional";
const HUB_LABEL = "AI · Business & Professional Smart Tools";
const SHELL =
  "Rule-based logic in your browser—not a live LLM. Business planning aids only; not accounting, tax, or legal advice.";

function article(slug: string, heading: string, paragraph: string, seoTitle: string, seoDescription: string, keywords: string[]): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "ai",
    shellNote: SHELL,
    sections: [{ heading, paragraphs: [paragraph] }],
    tables: [{ title: "Quick tip", columnHeaders: ["Topic", "Note"], rows: [["Privacy", "Inputs stay on your device"], ["Decisions", "Verify with your accountant or advisor"]] }],
    chart: { kind: "sparkTrendDemo", title: "Analyze → optimize → track", caption: "Iterate as your numbers change.", sparkValues: [0.3, 0.55, 0.8, 1] },
    faq: [{ question: "Is this professional advice?", answer: "No—educational estimates and planning aids only." }],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const AI_BUSINESS_SMART_ARTICLES: Record<string, RichArticle> = {
  "aist-ai-profit-analyzer": article("aist-ai-profit-analyzer", "Profit Analyzer", "Gross and net margin with opex benchmarks.", "AI Profit Analyzer — Margin Calculator", "Analyze business profit margins and cost load.", ["profit analyzer", "net margin calculator"]),
  "aist-ai-roi-advisor": article("aist-ai-roi-advisor", "ROI Advisor", "ROI, payback, and annualized return scenarios.", "AI ROI Advisor — Investment Return", "Calculate ROI and payback on business investments.", ["roi calculator", "investment return"]),
  "aist-ai-business-cost-optimizer": article("aist-ai-business-cost-optimizer", "Cost Optimizer", "Fixed vs variable costs and savings potential.", "AI Business Cost Optimizer", "Optimize business fixed and variable costs.", ["cost optimizer", "business expenses"]),
  "aist-ai-pricing-strategy-calculator": article("aist-ai-pricing-strategy-calculator", "Pricing Strategy", "Cost-plus, competitive, and value pricing bands.", "AI Pricing Strategy Calculator", "Set pricing with margin and competitor guardrails.", ["pricing strategy", "price calculator"]),
  "aist-ai-ad-budget-optimizer": article("aist-ai-ad-budget-optimizer", "Ad Budget Optimizer", "ROAS-based optimal ad spend recommendation.", "AI Ad Budget Optimizer", "Optimize ad spend for target ROAS.", ["ad budget optimizer", "roas calculator"]),
  "aist-ai-roi-predictor-ads": article("aist-ai-roi-predictor-ads", "Ad ROI Predictor", "Ad ROAS, ROI percent, and profit milestones.", "AI ROI Predictor for Ads", "Predict ad campaign ROI and ROAS.", ["ad roi calculator", "roas predictor"]),
  "aist-ai-campaign-performance-analyzer": article("aist-ai-campaign-performance-analyzer", "Campaign Performance", "CTR, CPC, CVR, CPA funnel analysis.", "AI Campaign Performance Analyzer", "Analyze ad campaign CTR, CPC, and CPA.", ["campaign analyzer", "ctr cpc calculator"]),
  "aist-ai-workload-planner": article("aist-ai-workload-planner", "Workload Planner", "Daily task hours and utilization schedule.", "AI Workload Planner — Capacity", "Plan daily workload and hour allocation.", ["workload planner", "time blocking"]),
  "aist-ai-task-prioritizer": article("aist-ai-task-prioritizer", "Task Prioritizer", "Urgency-importance matrix task ranking.", "AI Task Prioritizer — Eisenhower Matrix", "Prioritize tasks by urgency and importance.", ["task prioritizer", "eisenhower matrix"]),
  "aist-ai-meeting-time-optimizer": article("aist-ai-meeting-time-optimizer", "Meeting Optimizer", "Meeting load vs focus time and hidden cost.", "AI Meeting Time Optimizer", "Reduce meeting load and protect focus time.", ["meeting optimizer", "focus time calculator"]),
};
