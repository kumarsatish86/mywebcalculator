import type { RichArticle } from "./types";

const HUB_HREF = "/education/exam-score/exam-strategy";
const HUB_LABEL = "Education · Exam Strategy";
const SHELL =
  "Runs in your browser. Strategy maths for planning — not official exam rules. Confirm timing and marking with your test authority.";

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
        title: "Strategy tools",
        columnHeaders: ["Tool", "Use when"],
        rows: [
          ["Time per section", "Split minutes by section weight"],
          ["Attempt mix", "Plan easy/medium/hard attempts"],
          ["Optimal attempts", "Accuracy vs negative marking"],
          ["Speed vs accuracy", "Pace check after a section"],
          ["Mock trend", "Track mock score progression"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Strategy momentum",
            caption: "Share URL preserves your inputs.",
            sparkValues: [0.25, 0.4, 0.55, 0.68, 0.82, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const EXAM_STRATEGY_ARTICLES: Record<string, RichArticle> = {
  "time-allocation-calculator-per-section": article(
    "time-allocation-calculator-per-section",
    "Time allocation per section",
    [
      "Divides total exam minutes across sections proportionally to the weights you enter.",
      "Use equal weights if every section carries the same mark share.",
    ],
    {
      question: "What weight format works?",
      answer: "Comma-separated numbers like 40,35,25 — they are normalized to your total time.",
    },
    "Time Allocation Calculator per Section",
    "Split exam minutes across sections by weight for balanced pacing.",
    ["time allocation exam", "section timing calculator", "exam strategy"],
    "sparkTrendDemo",
  ),
  "question-attempt-strategy-calculator": article(
    "question-attempt-strategy-calculator",
    "Question attempt strategy",
    [
      "Converts an easy/medium/hard percentage mix into approximate question counts.",
      "Suggests attempting easier items first, then medium, then hard with a review pass.",
    ],
    {
      question: "Do percentages need to sum to 100?",
      answer: "They are scaled to your total question count — any positive mix works.",
    },
    "Question Attempt Strategy Calculator",
    "Plan how many easy, medium, and hard questions to attempt and in what order.",
    ["question attempt strategy", "exam attempt plan", "easy medium hard"],
    "none",
  ),
  "optimal-attempt-calculator": article(
    "optimal-attempt-calculator",
    "Optimal attempt calculator",
    [
      "Estimates expected score from accuracy and per-question marking (+correct, −wrong).",
      "Flags when aggressive guessing may hurt more than selective attempts.",
    ],
    {
      question: "How is optimal attempts chosen?",
      answer: "When expected value per question is positive, attempting all is suggested; otherwise a conservative count.",
    },
    "Optimal Attempt Calculator",
    "Find expected score and attempt count given accuracy and marking scheme.",
    ["optimal attempt calculator", "expected score exam", "negative marking strategy"],
    "sparkTrendDemo",
  ),
  "speed-vs-accuracy-calculator": article(
    "speed-vs-accuracy-calculator",
    "Speed vs accuracy balance",
    [
      "Computes accuracy, questions per minute, and seconds per question from a timed sample.",
      "Balance tip nudges you toward pace or precision based on thresholds.",
    ],
    {
      question: "What is a good questions-per-minute rate?",
      answer: "Varies by exam — compare against your target minutes-per-question instead of a universal number.",
    },
    "Speed vs Accuracy Calculator",
    "Check pacing and accuracy balance after a timed practice section.",
    ["speed vs accuracy exam", "exam pacing calculator", "questions per minute"],
    "sparkTrendDemo",
  ),
  "mock-test-performance-calculator": article(
    "mock-test-performance-calculator",
    "Mock test performance",
    [
      "Summarizes average, best, worst, and up/down/flat trend from comma-separated mock scores.",
      "Enter at least two scores to see movement between first and last mock.",
    ],
    {
      question: "How is trend decided?",
      answer: "First vs last score: more than 1 point up is up, more than 1 down is down, else flat.",
    },
    "Mock Test Performance Calculator",
    "Track average, best, worst, and trend across mock test scores.",
    ["mock test performance", "mock score trend", "exam mock analysis"],
    "none",
  ),
  "exam-strategy-planner": {
    slug: "exam-strategy-planner",
    vertical: "education-math",
    category: "education",
    shellNote: SHELL,
    sections: [
      {
        heading: "How the strategy is calculated",
        paragraphs: [
          "The planner combines attempt mix, expected-value optimal attempts, and section time weights into one digital twin: expected / best / worst score bands plus Aggressive, Balanced, and Safe attempt rates.",
          "Accuracy and confidence thresholds drive risk labels and coach tips. Negative marking uses your preset’s +/− scheme (or Custom overrides).",
        ],
      },
      {
        heading: "Negative marking and time management",
        paragraphs: [
          "When expected marks per question turn negative at your accuracy, the Safe strategy reduces attempts. The timeline allocates Easy → Medium → Hard → Review windows from total minutes.",
          "JEE, NEET, CAT, UPSC, GATE, SSC, and CUET presets supply teaching defaults—always confirm official rules for your session.",
        ],
      },
      {
        heading: "Common mistakes",
        paragraphs: [
          "Guessing every leftover question under −1 marking, spending equal time on every item, and skipping a final review window are the most common score leaks this tool highlights.",
        ],
      },
    ],
    tables: [
      {
        title: "Strategy modes",
        columnHeaders: ["Mode", "Typical attempt share", "When to use"],
        rows: [
          ["Aggressive", "~90%+", "High accuracy, low penalty fear"],
          ["Balanced", "~80%", "Default for most competitive papers"],
          ["Safe", "~65%", "Accuracy still building or heavy penalties"],
        ],
      },
    ],
    chart: {
      kind: "sparkTrendDemo",
      title: "Readiness momentum",
      caption: "Share URL preserves exam, mix, and accuracy inputs.",
      sparkValues: [0.3, 0.45, 0.55, 0.7, 0.82, 0.9],
    },
    faq: [
      {
        question: "Is this official rank prediction?",
        answer:
          "No. Score bands are educational estimates from your inputs. Rank tools on the Exam Success Center use separate heuristics and still need official keys and cut-offs.",
      },
      {
        question: "Can I share my plan?",
        answer: "Yes — inputs sync into the URL so you can bookmark or send a link.",
      },
    ],
    meta: {
      seoTitle: "AI Exam Strategy Planner | Score bands, timing & study plan",
      seoDescription:
        "Rules-based exam digital twin: expected score, attempt strategies, time timeline, and a 7-day study plan for JEE, NEET, CAT, and more.",
      keywords: [
        "exam strategy planner",
        "jee attempt strategy",
        "negative marking strategy",
        "exam time management",
        "mock to rank",
      ],
    },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  },
};
