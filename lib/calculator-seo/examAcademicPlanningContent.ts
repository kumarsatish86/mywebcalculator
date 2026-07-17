import type { RichArticle } from "./types";

const HUB_HREF = "/education/exam-score/exam-academic-planning";
const HUB_LABEL = "Education · Academic Planning";
const SHELL =
  "Runs in your browser. Planning estimates only—adjust for your pace, school hours, and mock schedule. Share URL preserves your inputs.";

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
        title: "Planning toolkit",
        columnHeaders: ["Tool", "Output"],
        rows: [
          ["Study hours", "Total + daily load"],
          ["Study plan", "Hours per subject + outline"],
          ["Syllabus days", "Base + buffered timeline"],
          ["Revision", "Reviews per day"],
          ["Countdown", "Days/weeks to exam"],
        ],
      },
    ],
    chart:
      chartKind === "none"
        ? { kind: "none", title: "Overview", caption: "Share URL preserves your inputs." }
        : {
            kind: "sparkTrendDemo",
            title: "Syllabus completion curve",
            caption: "Share URL preserves your inputs.",
            sparkValues: [0.1, 0.25, 0.45, 0.6, 0.78, 0.95],
          },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const EXAM_ACADEMIC_PLANNING_ARTICLES: Record<string, RichArticle> = {
  "study-hours-calculator": article(
    "study-hours-calculator",
    "Study hours calculator",
    [
      "Multiplies chapters by hours per chapter for total study time, then spreads across available days.",
      "Flags when daily load exceeds 8 hours as a feasibility warning.",
    ],
    {
      question: "Should I include revision time?",
      answer: "Add revision as extra chapters or use the revision planner for dedicated passes.",
    },
    "Study Hours Calculator",
    "Calculate total study hours and daily load to cover chapters before your exam.",
    ["study hours calculator", "exam study time", "hours per day study"],
    "sparkTrendDemo",
  ),
  "study-plan-generator": article(
    "study-plan-generator",
    "Study plan generator",
    [
      "Divides total study budget across subjects and suggests rotation cadence.",
      "Outline bullets summarize weekly quiz habit and subject rotation.",
    ],
    {
      question: "How many subjects should I enter?",
      answer: "Count distinct papers you must prepare — combine sub-parts if you study them together.",
    },
    "Study Plan Generator",
    "Generate a multi-subject study plan with hours per subject and rotation outline.",
    ["study plan generator", "exam timetable", "subject rotation plan"],
    "sparkTrendDemo",
  ),
  "days-to-complete-syllabus-calculator": article(
    "days-to-complete-syllabus-calculator",
    "Days to complete syllabus",
    [
      "Divides total topics by topics per day and adds an optional buffer percent for delays.",
      "Buffered days convert to weeks for calendar planning.",
    ],
    {
      question: "What buffer % is realistic?",
      answer: "15% is the default — increase if you have school exams or holidays in the window.",
    },
    "Days to Complete Syllabus Calculator",
    "Estimate base and buffered days to finish syllabus topics at your daily pace.",
    ["syllabus completion calculator", "days to finish syllabus", "topic pacing"],
    "sparkTrendDemo",
  ),
  "revision-planner-calculator": article(
    "revision-planner-calculator",
    "Revision planner",
    [
      "Spreads topics × revision passes across days until exam for a daily review count.",
      "Cycle days approximate how long one full revision pass should take.",
    ],
    {
      question: "How many revision passes?",
      answer: "Two to three full passes are common — add more only if time allows before mocks.",
    },
    "Revision Planner Calculator",
    "Plan revision passes with topic-reviews per day and cycle length before exam.",
    ["revision planner", "exam revision schedule", "topic revision calculator"],
    "none",
  ),
  "exam-countdown-calculator": article(
    "exam-countdown-calculator",
    "Exam countdown",
    [
      "Counts days from today (UTC date) to your exam date entered as YYYY-MM-DD.",
      "Shows weeks left and whether the date is upcoming, today, or in the past.",
    ],
    {
      question: "Which timezone is used?",
      answer: "Dates are parsed at UTC midnight — for local exam day, pick the calendar date you sit the test.",
    },
    "Exam Countdown Calculator",
    "Count days and weeks left until your exam date.",
    ["exam countdown", "days until exam", "exam date calculator"],
    "none",
  ),
};
