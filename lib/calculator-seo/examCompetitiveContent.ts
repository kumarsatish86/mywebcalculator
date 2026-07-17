import type { RichArticle } from "./types";

const HUB_HREF = "/education/exam-score/exam-competitive-exams";
const HUB_LABEL = "Education · Competitive Exams";
const SHELL =
  "Runs in your browser. Rank, percentile, and cut-off maths are illustrative — not official counseling or NTA results.";

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
        title: "Competitive tools",
        columnHeaders: ["Tool", "Use when"],
        rows: [
          ["Cut-off", "Score vs adjusted last-year line"],
          ["Rank", "Marks to percentile/rank band"],
          ["Percentile", "Z-score from mean/std"],
          ["Normalization", "Session to target scale"],
          ["Marks vs rank", "Rank from top score ratio"],
          ["Scaling", "Linear raw-to-scale map"],
          ["Negative marking", "Net score with −wrong"],
          ["Attempt accuracy", "Correct vs wrong share"],
          ["Score estimator", "Expected score at accuracy"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Score curve",
            caption: "Share URL preserves your inputs.",
            sparkValues: [0.15, 0.28, 0.45, 0.58, 0.72, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const EXAM_COMPETITIVE_ARTICLES: Record<string, RichArticle> = {
  "cutoff-predictor-calculator": article(
    "cutoff-predictor-calculator",
    "Cut-off predictor",
    [
      "Adjusts last year’s cut-off by a difficulty factor and compares your score.",
      "Margin shows how far above or below the adjusted line you sit.",
    ],
    {
      question: "What difficulty factor should I use?",
      answer: "Above 1 if the paper was harder than last year; below 1 if easier — educational guess only.",
    },
    "Cut-off Predictor Calculator",
    "Predict whether your score clears an adjusted last-year cut-off.",
    ["cutoff predictor", "exam cutoff calculator", "competitive cutoff"],
    "sparkTrendDemo",
  ),
  "rank-predictor-calculator": article(
    "rank-predictor-calculator",
    "Rank predictor",
    [
      "Maps marks to an illustrative percentile using a soft curve, then to rank via candidate pool.",
      "Override candidates if you know the approximate exam pool size.",
    ],
    {
      question: "Is this official?",
      answer: "No — heuristic only. Real ranks depend on paper difficulty and the year’s distribution.",
    },
    "Rank Predictor Calculator",
    "Estimate illustrative percentile and rank from marks and candidate pool.",
    ["rank predictor calculator", "exam rank estimate", "percentile rank"],
    "sparkTrendDemo",
  ),
  "percentile-calculator-exam": article(
    "percentile-calculator-exam",
    "Percentile calculator",
    [
      "Computes z-score from your score, cohort mean, and standard deviation.",
      "Percentile uses a logistic-style approximation for educational use.",
    ],
    {
      question: "Where do mean and std come from?",
      answer: "Use mock analysis, coaching data, or prior-year summaries — not guaranteed for your session.",
    },
    "Percentile Calculator — Exam",
    "Estimate exam percentile from score, mean, and standard deviation.",
    ["percentile calculator exam", "z score percentile", "exam percentile"],
    "none",
  ),
  "normalization-score-calculator": article(
    "normalization-score-calculator",
    "Normalization score",
    [
      "Standardizes your raw score within a session, then rescales to a target mean and std.",
      "Common pattern for multi-shift exam normalization (simplified).",
    ],
    {
      question: "Does every exam normalize this way?",
      answer: "Bodies use varied formulas — this is a linear z-score remap for learning.",
    },
    "Normalization Score Calculator",
    "Map raw score from one session distribution to a target mean and std.",
    ["normalization score calculator", "exam normalization", "z score scaling"],
    "sparkTrendDemo",
  ),
  "marks-vs-rank-calculator": article(
    "marks-vs-rank-calculator",
    "Marks vs rank",
    [
      "Estimates rank from your marks relative to the top score and total candidates.",
      "Uses a power curve — rough band only.",
    ],
    {
      question: "Why use top marks?",
      answer: "Ratio to the highest score proxies how far you are from the peak of the distribution.",
    },
    "Marks vs Rank Calculator",
    "Rough rank estimate from marks, top score, and candidate count.",
    ["marks vs rank", "rank from marks", "competitive rank calculator"],
    "sparkTrendDemo",
  ),
  "score-scaling-calculator": article(
    "score-scaling-calculator",
    "Score scaling",
    [
      "Linearly maps a raw score from [rawMin, rawMax] to [scaleMin, scaleMax].",
      "Useful when converting section raw marks to a published scale.",
    ],
    {
      question: "What if raw is outside min–max?",
      answer: "The formula still runs — clamp mentally if your board caps scaled scores.",
    },
    "Score Scaling Calculator",
    "Linear map raw exam scores to a scaled min–max range.",
    ["score scaling calculator", "raw to scaled score", "exam score conversion"],
    "none",
  ),
  "negative-marking-calculator": article(
    "negative-marking-calculator",
    "Negative marking",
    [
      "Net score = correct × (+marks) − wrong × |−marks|.",
      "Also reports accuracy on attempted questions.",
    ],
    {
      question: "Are unattempted included?",
      answer: "This tool uses correct and wrong only — add unattempted separately if needed.",
    },
    "Negative Marking Calculator",
    "Calculate net score with positive and negative marking per question.",
    ["negative marking calculator", "exam negative marks", "net score exam"],
    "sparkTrendDemo",
  ),
  "attempt-accuracy-calculator": article(
    "attempt-accuracy-calculator",
    "Attempt accuracy",
    [
      "Accuracy is correct ÷ (correct + wrong); wrong share is the complement on attempts.",
      "Quick check after a section or full mock.",
    ],
    {
      question: "Does skipping affect accuracy?",
      answer: "No — only attempted questions count toward accuracy here.",
    },
    "Attempt Accuracy Calculator",
    "Accuracy and wrong share from correct and wrong counts.",
    ["attempt accuracy calculator", "exam accuracy", "correct wrong ratio"],
    "none",
  ),
  "exam-score-estimator": article(
    "exam-score-estimator",
    "Exam score estimator",
    [
      "Splits attempted questions into expected correct/wrong at your accuracy %.",
      "Applies marking scheme to estimate total score before the real result.",
    ],
    {
      question: "What accuracy should I enter?",
      answer: "Use recent mock accuracy or a conservative target for planning.",
    },
    "Exam Score Estimator",
    "Estimate expected score from attempts, accuracy, and marking scheme.",
    ["exam score estimator", "expected score calculator", "accuracy score estimate"],
    "sparkTrendDemo",
  ),
};
