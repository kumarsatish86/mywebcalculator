import type { RichArticle } from "./types";

const HUB_HREF = "/education/exam-score/exam-basic-score-percentage";
const HUB_LABEL = "Education · Basic Score & Percentage";
const SHELL =
  "Runs in your browser. Score maths for planning — not official board or university results. Confirm grading rules with your exam authority.";

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
        title: "Basic score tools",
        columnHeaders: ["Tool", "Use when"],
        rows: [
          ["Marks %", "Obtained vs total on one paper"],
          ["Total marks", "Sum subject marks"],
          ["Subject-wise %", "Same max across subjects"],
          ["Weighted %", "Theory/practical weight mix"],
          ["Grade", "Letter grade from percentage"],
          ["Average / best-of", "Aggregate or best N subjects"],
          ["Pass / improve", "Pass margin or score delta"],
          ["Required to pass", "Marks still needed overall"],
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
            sparkValues: [0.3, 0.45, 0.5, 0.62, 0.78, 0.9],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const EXAM_BASIC_SCORE_ARTICLES: Record<string, RichArticle> = {
  "marks-percentage-calculator": article(
    "marks-percentage-calculator",
    "Marks percentage calculator",
    [
      "Divides obtained marks by total marks and multiplies by 100 for a clear percentage.",
      "Also shows how many marks remain unmarked on that paper.",
    ],
    {
      question: "Can obtained exceed total?",
      answer: "No — the tool returns an error if obtained is greater than total.",
    },
    "Marks Percentage Calculator",
    "Convert obtained and total marks into a percentage instantly.",
    ["marks percentage calculator", "obtained marks percentage", "exam percentage"],
    "sparkTrendDemo",
  ),
  "total-marks-calculator": article(
    "total-marks-calculator",
    "Total marks calculator",
    [
      "Sums comma-separated subject or section marks into one total.",
      "Shows subject count and simple average for a quick aggregate view.",
    ],
    {
      question: "What format should I use?",
      answer: "Comma-separated numbers like 72,85,68,90 — spaces or semicolons also work.",
    },
    "Total Marks Calculator",
    "Add subject marks and see total and average in one step.",
    ["total marks calculator", "sum exam marks", "subject marks total"],
    "none",
  ),
  "subject-wise-percentage-calculator": article(
    "subject-wise-percentage-calculator",
    "Subject-wise percentage",
    [
      "Converts each mark to a percentage against a shared maximum per subject.",
      "Useful when every paper is out of the same total (e.g. 100).",
    ],
    {
      question: "What if subjects have different maxima?",
      answer: "Use the weighted percentage tool or convert each subject separately with its own total.",
    },
    "Subject-Wise Percentage Calculator",
    "See percentage for each subject when papers share the same maximum marks.",
    ["subject wise percentage", "per subject percentage", "exam subject marks"],
    "sparkTrendDemo",
  ),
  "weighted-percentage-calculator": article(
    "weighted-percentage-calculator",
    "Weighted percentage",
    [
      "Blends scores with matching weights — e.g. 70% theory and 30% practical.",
      "Scores and weights lists must have the same length.",
    ],
    {
      question: "Do weights need to sum to 100?",
      answer: "No — they are normalized by their sum, so 50,30,20 works the same as percentages.",
    },
    "Weighted Percentage Calculator",
    "Calculate a weighted overall percentage from scores and weights.",
    ["weighted percentage calculator", "weighted exam score", "theory practical weight"],
    "sparkTrendDemo",
  ),
  "grade-percentage-calculator": article(
    "grade-percentage-calculator",
    "Grade from percentage",
    [
      "Maps a percentage to a simple letter grade (A+ through F) and a performance band.",
      "Bands are illustrative — your board may use different cut-offs.",
    ],
    {
      question: "Is A+ always 90%+?",
      answer: "In this tool yes — confirm your institution’s official grade table.",
    },
    "Grade Percentage Calculator",
    "Convert exam percentage to letter grade and performance band.",
    ["grade from percentage", "percentage to grade", "exam letter grade"],
    "none",
  ),
  "score-average-calculator": article(
    "score-average-calculator",
    "Score average calculator",
    [
      "Averages comma-separated scores and reports count, minimum, and maximum.",
      "Handy for mock series or multi-paper aggregates.",
    ],
    {
      question: "Are zeros allowed?",
      answer: "Yes — zeros count toward the average; negative scores are rejected.",
    },
    "Score Average Calculator",
    "Find average, min, and max from a list of exam scores.",
    ["score average calculator", "average exam marks", "mean test score"],
    "sparkTrendDemo",
  ),
  "best-of-n-subjects-calculator": article(
    "best-of-n-subjects-calculator",
    "Best of N subjects",
    [
      "Keeps the top N marks from your list and totals them — common in some board schemes.",
      "Also shows the average of the selected subjects.",
    ],
    {
      question: "What if N is larger than subjects?",
      answer: "N must be between 1 and the number of marks you entered.",
    },
    "Best of N Subjects Calculator",
    "Select top N subject marks and total them for board-style aggregates.",
    ["best of n subjects", "best of 5 marks", "board best subjects"],
    "none",
  ),
  "pass-fail-calculator": article(
    "pass-fail-calculator",
    "Pass / fail calculator",
    [
      "Compares your marks to a pass mark and reports Pass or Fail.",
      "Margin shows how far above or below the threshold you are.",
    ],
    {
      question: "Is pass mark always 40%?",
      answer: "No — enter the absolute pass mark (or convert % to marks first).",
    },
    "Pass Fail Calculator",
    "Check pass or fail against a pass mark and see the margin.",
    ["pass fail calculator", "exam pass mark", "pass margin"],
    "sparkTrendDemo",
  ),
  "score-improvement-calculator": article(
    "score-improvement-calculator",
    "Score improvement",
    [
      "Shows the point delta and percent change from a previous score to the current one.",
      "Useful after mocks, revisions, or re-exams.",
    ],
    {
      question: "What if previous score is zero?",
      answer: "Any positive current score is treated as a 100% improvement; both zero stays 0%.",
    },
    "Score Improvement Calculator",
    "Measure score delta and percent change between two attempts.",
    ["score improvement calculator", "marks improvement", "mock score delta"],
    "sparkTrendDemo",
  ),
  "required-marks-to-pass-calculator": article(
    "required-marks-to-pass-calculator",
    "Required marks to pass",
    [
      "Uses marks so far, max so far, remaining max, and pass % to find marks still needed.",
      "Flags when you already meet the overall pass target.",
    ],
    {
      question: "What if remaining marks are not enough?",
      answer: "The tool explains that the required marks exceed the remaining maximum.",
    },
    "Required Marks to Pass Calculator",
    "Find how many marks you still need on remaining papers to pass overall.",
    ["required marks to pass", "marks needed to pass", "pass percentage remaining"],
    "none",
  ),
};
