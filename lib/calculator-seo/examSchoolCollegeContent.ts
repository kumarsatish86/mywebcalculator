import type { RichArticle } from "./types";

const HUB_HREF = "/education/exam-score/exam-school-college-specific";
const HUB_LABEL = "Education · School & College";
const SHELL =
  "Runs in your browser. Board-style percentage and GPA maths for planning — confirm grading rules with your institution.";

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
        title: "School & college tools",
        columnHeaders: ["Tool", "Use when"],
        rows: [
          ["Board %", "Subject marks to aggregate %"],
          ["University GPA", "Grade points × credits"],
          ["Engineering CGPA", "Semester GPA rollup"],
          ["Medical entrance", "Correct/wrong marking"],
          ["Semester marks", "Per-subject semester view"],
          ["Internal + external", "Weighted combined %"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Academic progress",
            caption: "Share URL preserves your inputs.",
            sparkValues: [0.22, 0.38, 0.48, 0.6, 0.74, 0.86],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const EXAM_SCHOOL_COLLEGE_ARTICLES: Record<string, RichArticle> = {
  "cbse-percentage-calculator": article(
    "cbse-percentage-calculator",
    "CBSE percentage",
    [
      "Sums comma-separated subject marks and divides by total max for an aggregate percentage.",
      "Educational board-style math only — official CBSE results may use best-of or grace rules.",
    ],
    {
      question: "Is this the official CBSE formula?",
      answer: "No — simple average of entered subject marks; verify with your school or board circular.",
    },
    "CBSE Percentage Calculator",
    "Calculate board-style aggregate percentage from CBSE subject marks.",
    ["cbse percentage calculator", "cbse marks percentage", "cbse aggregate"],
    "sparkTrendDemo",
  ),
  "icse-percentage-calculator": article(
    "icse-percentage-calculator",
    "ICSE percentage",
    [
      "Same marks-CSV UX as CBSE — aggregate % from subject marks and max per subject.",
      "Use when you want a quick percentage before official ICSE processing.",
    ],
    {
      question: "Does ICSE include internal assessment?",
      answer: "Enter only the marks you want in the aggregate — combine components first if needed.",
    },
    "ICSE Percentage Calculator",
    "Calculate board-style aggregate percentage from ICSE subject marks.",
    ["icse percentage calculator", "icse marks percentage", "icse aggregate"],
    "none",
  ),
  "state-board-percentage-calculator": article(
    "state-board-percentage-calculator",
    "State board percentage",
    [
      "Identical UX to CBSE/ICSE — comma-separated marks and optional max per subject.",
      "Adjust max if your state board uses a different subject cap.",
    ],
    {
      question: "What max per subject should I use?",
      answer: "100 is default; change if your board uses 70, 80, or other caps.",
    },
    "State Board Percentage Calculator",
    "Calculate board-style aggregate percentage from state board subject marks.",
    ["state board percentage", "board marks calculator", "state exam percentage"],
    "sparkTrendDemo",
  ),
  "university-gpa-calculator": article(
    "university-gpa-calculator",
    "University GPA",
    [
      "Weighted average of grade points using optional credit CSV (equal weight if omitted).",
      "Credits count must match grade-point count when provided.",
    ],
    {
      question: "What grade scale?",
      answer: "Enter points on your university scale (often 4 or 10) — the tool averages what you enter.",
    },
    "University GPA Calculator",
    "Compute weighted GPA from grade points and optional credits.",
    ["university gpa calculator", "weighted gpa", "grade point average"],
    "sparkTrendDemo",
  ),
  "engineering-cgpa-calculator": article(
    "engineering-cgpa-calculator",
    "Engineering CGPA",
    [
      "Rolls up semester GPAs with optional semester credit weights.",
      "Same engine as university GPA — semester GPAs act as grade points.",
    ],
    {
      question: "Should I include all semesters?",
      answer: "List completed semesters only; add future ones when grades are finalized.",
    },
    "Engineering CGPA Calculator",
    "Calculate CGPA from semester GPAs and optional credit weights.",
    ["engineering cgpa calculator", "semester cgpa", "college cgpa"],
    "none",
  ),
  "medical-entrance-score-calculator": article(
    "medical-entrance-score-calculator",
    "Medical entrance score",
    [
      "Net score = correct × (+marks) − wrong × |−marks| for NEET-style marking.",
      "Enter your exam’s per-question marking if different from +4/−1.",
    ],
    {
      question: "Are unattempted counted?",
      answer: "This tool uses correct and wrong only — unattempted do not change the net score here.",
    },
    "Medical Entrance Score Calculator",
    "Calculate net medical entrance score from correct, wrong, and marking scheme.",
    ["medical entrance score", "neet score calculator", "entrance net marks"],
    "sparkTrendDemo",
  ),
  "semester-wise-marks-calculator": article(
    "semester-wise-marks-calculator",
    "Semester-wise marks",
    [
      "Lists each subject’s percent and the semester average from a marks CSV.",
      "Set max per subject if not 100.",
    ],
    {
      question: "How is average computed?",
      answer: "Mean of per-subject percentages, not total marks ÷ total max.",
    },
    "Semester-wise Marks Calculator",
    "Per-subject percent and semester average from marks CSV.",
    ["semester marks calculator", "subject wise percent", "semester average"],
    "sparkTrendDemo",
  ),
  "internal-external-marks-calculator": article(
    "internal-external-marks-calculator",
    "Internal + external marks",
    [
      "Converts internal and external raw marks to percents, then blends by internal weight %.",
      "Default internal weight is 30% if you leave it blank.",
    ],
    {
      question: "What weight should I use?",
      answer: "Check your college or board scheme — common splits are 20/80, 30/70, or 40/60.",
    },
    "Internal + External Marks Calculator",
    "Combined percentage from internal and external marks with weight split.",
    ["internal external marks", "combined percentage calculator", "internal assessment weight"],
    "none",
  ),
};
