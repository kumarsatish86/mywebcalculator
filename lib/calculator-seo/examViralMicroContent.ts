import type { RichArticle } from "./types";

const HUB_HREF = "/education/exam-score/exam-viral-micro-tools";
const HUB_LABEL = "Education · Exam Viral Micro Tools";
const SHELL =
  "Runs in your browser. Illustrative pass/rank maths—not official cut-offs or counseling. Confirm rules with your board or college.";

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
        title: "Quick checks",
        columnHeaders: ["Tool", "Use when"],
        rows: [
          ["Pass needed", "One section left — how many marks?"],
          ["Can I pass?", "You have a score and pass %"],
          ["What-if", "Simulate adding a new paper"],
          ["Rank band", "Rough JEE/NEET percentile"],
          ["CGPA gate", "Placement eligibility target"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Score momentum",
            caption: "Share URL preserves your inputs.",
            sparkValues: [0.2, 0.35, 0.5, 0.65, 0.8, 0.92],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const EXAM_VIRAL_MICRO_ARTICLES: Record<string, RichArticle> = {
  "how-much-should-i-score-to-pass": article(
    "how-much-should-i-score-to-pass",
    "Marks needed to pass",
    [
      "Computes the overall pass threshold, subtracts marks you already have, and shows what you still need on remaining papers.",
      "Percent needed on the remainder divides required marks by remaining max marks.",
    ],
    {
      question: "What if I cannot pass mathematically?",
      answer: "The tool flags when required marks exceed remaining max — you may need a re-exam or grace rules.",
    },
    "How Much Should I Score to Pass?",
    "Find marks still needed on remaining papers to hit your pass percentage.",
    ["how much to pass", "pass marks calculator", "exam pass threshold"],
    "sparkTrendDemo",
  ),
  "can-i-pass-with-this-score": article(
    "can-i-pass-with-this-score",
    "Can I pass with this score?",
    [
      "Compares your scored marks against max marks and the pass percentage you enter.",
      "Margin shows how many marks above or below the pass line you are.",
    ],
    {
      question: "Is pass % always 40?",
      answer: "No — enter the pass rule for your exam (often 33–40% but varies by board and subject).",
    },
    "Can I Pass With This Score?",
    "Check pass or fail from scored marks, max marks, and pass percentage.",
    ["can I pass exam", "pass fail calculator", "exam pass checker"],
    "none",
  ),
  "what-if-i-get-x-marks-simulator": article(
    "what-if-i-get-x-marks-simulator",
    "What-if marks simulator",
    [
      "Adds a hypothetical section to your current total and recalculates overall percentage.",
      "Useful before a mock or re-test to see impact on aggregate score.",
    ],
    {
      question: "Can I simulate multiple sections?",
      answer: "Combine current totals first, then add the next hypothetical block in a second run.",
    },
    "What If I Get X Marks — Simulator",
    "Simulate how new marks change your overall exam percentage.",
    ["what if marks", "exam score simulator", "percentage calculator"],
    "sparkTrendDemo",
  ),
  "rank-predictor-jee-neet": article(
    "rank-predictor-jee-neet",
    "JEE / NEET rank band",
    [
      "Maps marks to an illustrative percentile and rank using a soft curve — not official NTA data.",
      "Select JEE or NEET to use a default candidate pool; override pool size if you wish.",
    ],
    {
      question: "Is this an official rank predictor?",
      answer: "No — heuristic only. Real ranks depend on paper difficulty and the year’s score distribution.",
    },
    "Rank Predictor — JEE / NEET",
    "Estimate illustrative percentile and rank band from marks for JEE or NEET.",
    ["jee rank predictor", "neet rank calculator", "exam percentile"],
    "sparkTrendDemo",
  ),
  "cgpa-needed-for-placement-eligibility": article(
    "cgpa-needed-for-placement-eligibility",
    "CGPA for placement eligibility",
    [
      "Solves for the GPA you need on remaining credits to reach a target CGPA.",
      "Flags when the target is mathematically out of reach on a 10-point scale.",
    ],
    {
      question: "Do placements use only CGPA?",
      answer: "Many companies add backlogs, branch, and skill filters — this tool models CGPA math only.",
    },
    "CGPA Needed for Placement Eligibility",
    "Calculate GPA required on remaining credits to hit a placement CGPA cut-off.",
    ["cgpa placement calculator", "placement eligibility cgpa", "college cgpa target"],
    "none",
  ),
};
