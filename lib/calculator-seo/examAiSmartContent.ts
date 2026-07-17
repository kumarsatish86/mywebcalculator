import type { RichArticle } from "./types";

const HUB_HREF = "/education/exam-score/exam-ai-smart-tools";
const HUB_LABEL = "Education · Exam AI Smart Tools";
const SHELL =
  "Rule-based heuristics in your browser—not a live AI model. Educational planning only; verify targets with teachers and official cut-offs.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
  chartKind: "sparkTrendDemo" | "none" = "sparkTrendDemo",
): RichArticle {
  return {
    slug,
    vertical: "education-math",
    category: "education",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "How it works",
        columnHeaders: ["Feature", "Method"],
        rows: [
          ["Rank band", "Percentile curve vs cut-off"],
          ["Improvement", "Gap ÷ weeks + hour budget"],
          ["Weakness", "Parse CSV subject scores"],
          ["Strategy", "Style-weighted daily split"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Study progress path",
            caption: "Share URL preserves your inputs.",
            sparkValues: [0.25, 0.4, 0.55, 0.7, 0.85, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const EXAM_AI_SMART_ARTICLES: Record<string, RichArticle> = {
  "ai-rank-predictor": article(
    "ai-rank-predictor",
    "AI rank predictor",
    [
      "Estimates percentile and rank from your marks vs max marks, compared to last year’s cut-off.",
      "Outlook text flags whether you are above, near, or below the reference cut-off.",
    ],
    {
      question: "Is this a live AI model?",
      answer: "No — fixed formulas and transparent heuristics only, not a chatbot or LLM.",
    },
    "AI Rank Predictor — Exam Percentile",
    "Estimate exam rank and percentile with rule-based heuristics vs last year’s cut-off.",
    ["ai rank predictor", "exam percentile calculator", "rank estimate"],
    "sparkTrendDemo",
  ),
  "ai-score-improvement-planner": article(
    "ai-score-improvement-planner",
    "Score improvement planner",
    [
      "Computes the percentage-point gap and divides it across weeks remaining.",
      "Suggests focus splits based on your weekly hour budget.",
    ],
    {
      question: "How accurate is the weekly target?",
      answer: "It is a linear heuristic — real gains depend on starting level and topic difficulty.",
    },
    "AI Score Improvement Planner",
    "Plan weekly score gains from current %, target %, and hours available.",
    ["score improvement plan", "exam study planner", "grade improvement calculator"],
    "sparkTrendDemo",
  ),
  "ai-weakness-analyzer": article(
    "ai-weakness-analyzer",
    "Weakness analyzer",
    [
      "Parses comma-separated subject scores (with optional names) and tags weak, ok, or strong bands.",
      "Ranks weakest and strongest subjects with drill advice.",
    ],
    {
      question: "What CSV format works?",
      answer: 'Use "Math:60,Physics:45" or plain "60,45,70" — at least two scores required.',
    },
    "AI Weakness Analyzer — Subject Gaps",
    "Analyze comma-separated subject scores to find weak areas and study priorities.",
    ["weakness analyzer", "subject score analysis", "exam weak areas"],
    "none",
  ),
  "ai-study-strategy-generator": article(
    "ai-study-strategy-generator",
    "Study strategy generator",
    [
      "Builds a daily hour split by style: balanced, weakness-first, or mock-heavy.",
      "Sets weekly mock count and revision block cadence from days until exam.",
    ],
    {
      question: "Which style should I pick?",
      answer: "Weakness-first if far from target; mock-heavy when close to exam date; balanced otherwise.",
    },
    "AI Study Strategy Generator",
    "Generate daily study plan, mock cadence, and revision blocks by study style.",
    ["study strategy generator", "exam study plan", "revision schedule"],
    "sparkTrendDemo",
  ),
};
