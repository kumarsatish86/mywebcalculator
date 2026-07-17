import type { RichArticle } from "./types";

const HUB_HREF = "/education/exam-score/exam-performance-analysis";
const HUB_LABEL = "Education · Exam Performance Analysis";
const SHELL =
  "Runs in your browser. Performance maths from your inputs — not official score reports. Use alongside mock analysis from your coaching or portal.";

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
        title: "Analysis tools",
        columnHeaders: ["Tool", "Use when"],
        rows: [
          ["Subject mix", "Compare scores across subjects"],
          ["Accuracy", "Correct vs wrong vs skipped"],
          ["Time efficiency", "Pace vs target per question"],
          ["Weak topics", "Prioritize low-scoring areas"],
          ["Score trend", "Track mock progression"],
          ["Improvement", "Baseline vs latest gain"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Performance trend",
            caption: "Share URL preserves your inputs.",
            sparkValues: [0.3, 0.42, 0.5, 0.62, 0.75, 0.88],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const EXAM_PERFORMANCE_ANALYSIS_ARTICLES: Record<string, RichArticle> = {
  "subject-wise-performance-analyzer": article(
    "subject-wise-performance-analyzer",
    "Subject-wise performance",
    [
      "Parses comma-separated subject scores (Name:score or plain numbers) and computes average percent.",
      "Highlights strongest and weakest subjects for revision planning.",
    ],
    {
      question: "What score format works?",
      answer: "Math:72,Physics:55 or 72,55,68 — set max per subject if not 100.",
    },
    "Subject-wise Performance Analyzer",
    "Compare subject scores, average percent, and strongest vs weakest areas.",
    ["subject wise performance", "exam subject analysis", "weakest subject"],
    "sparkTrendDemo",
  ),
  "accuracy-calculator-correct-vs-wrong": article(
    "accuracy-calculator-correct-vs-wrong",
    "Accuracy — correct vs wrong",
    [
      "Accuracy is correct divided by attempted (correct + wrong).",
      "Attempt rate shows how much of the paper you tried when unattempted is entered.",
    ],
    {
      question: "Should I include unattempted?",
      answer: "Optional — it only affects attempt rate, not accuracy on attempted questions.",
    },
    "Accuracy Calculator — Correct vs Wrong",
    "Calculate accuracy and attempt rate from correct, wrong, and unattempted counts.",
    ["exam accuracy calculator", "correct vs wrong", "attempt rate"],
    "none",
  ),
  "time-efficiency-calculator": article(
    "time-efficiency-calculator",
    "Time efficiency",
    [
      "Derives seconds per question and questions per minute from a timed block.",
      "Compares pace against a target minutes-per-question you set.",
    ],
    {
      question: "What target should I use?",
      answer: "Divide section time by question count — e.g. 90 min / 60 Q ≈ 1.5 min per question.",
    },
    "Time Efficiency Calculator",
    "Measure exam pacing: seconds per question vs your target.",
    ["time efficiency exam", "seconds per question", "exam pacing"],
    "sparkTrendDemo",
  ),
  "weak-topic-analyzer": article(
    "weak-topic-analyzer",
    "Weak topic analyzer",
    [
      "Tags each topic weak (&lt;50), ok (50–70), or strong (&gt;70) from Name:score pairs.",
      "Focus list shows the three lowest-scoring topics.",
    ],
    {
      question: "Must scores be out of 100?",
      answer: "Tags use fixed bands — treat scores as comparable percents or normalized marks.",
    },
    "Weak Topic Analyzer",
    "Identify weak topics and a focus list from Name:score pairs.",
    ["weak topic analyzer", "exam weak areas", "topic score tags"],
    "sparkTrendDemo",
  ),
  "score-trend-calculator": article(
    "score-trend-calculator",
    "Score trend",
    [
      "Computes average and slope between first and last score in your history.",
      "Trend is improving, declining, or stable based on slope thresholds.",
    ],
    {
      question: "How many scores do I need?",
      answer: "At least two comma-separated values — order matters for slope and trend.",
    },
    "Score Trend Calculator",
    "Track improving, declining, or stable trends from score history.",
    ["score trend calculator", "mock score slope", "exam improvement trend"],
    "none",
  ),
  "improvement-tracker-calculator": article(
    "improvement-tracker-calculator",
    "Improvement tracker",
    [
      "Absolute gain is latest minus baseline; percent gain is relative to max score.",
      "Relative improvement percent compares gain to your starting score.",
    ],
    {
      question: "What if baseline is zero?",
      answer: "Relative improvement shows 0% when baseline is 0 — focus on absolute gain instead.",
    },
    "Improvement Tracker Calculator",
    "Measure absolute and relative score improvement from baseline to latest.",
    ["improvement tracker exam", "score gain calculator", "baseline vs latest"],
    "sparkTrendDemo",
  ),
};
