import type { RichArticle } from "./types";

const HUB_HREF = "/ai/smart-tools/aist-education";
const HUB_LABEL = "AI · Education Smart Tools";
const SHELL =
  "Rule-based logic in your browser—not a live LLM. Educational brainstorming only; not a substitute for teachers or tutors.";

function article(
  slug: string,
  heading: string,
  paragraph: string,
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
): RichArticle {
  return {
    slug,
    vertical: "education-math",
    category: "ai",
    shellNote: SHELL,
    sections: [{ heading, paragraphs: [paragraph] }],
    tables: [{ title: "Quick tip", columnHeaders: ["Topic", "Note"], rows: [["Privacy", "Inputs stay on your device"], ["Accuracy", "Verify with your syllabus and teacher"]] }],
    chart: { kind: "sparkTrendDemo", title: "Plan → practise → review", caption: "Iterate inputs as your exam approaches.", sparkValues: [0.3, 0.5, 0.75, 1] },
    faq: [{ question: "Is this a live AI chatbot?", answer: "No—fixed formulas and curated study paths only." }],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const AI_EDUCATION_SMART_ARTICLES: Record<string, RichArticle> = {
  "aist-ai-study-planner": article("aist-ai-study-planner", "AI Study Planner", "Weighted multi-subject hour allocation with readiness score and timeline insights.", "AI Study Planner — Exam Timeline Calculator", "Plan study hours by subject weight and days to exam.", ["ai study planner", "exam study schedule"]),
  "aist-ai-timetable-generator": article("aist-ai-timetable-generator", "AI Timetable Generator", "Daily wake-to-sleep blocks with school, study, and break slots.", "AI Timetable Generator — Daily Study Blocks", "Generate a structured daily timetable for school and self-study.", ["timetable generator", "study schedule maker"]),
  "aist-ai-exam-preparation-strategy-tool": article("aist-ai-exam-preparation-strategy-tool", "Exam Prep Strategy", "Foundation, revision, and mock phases tuned to preparedness levels.", "AI Exam Preparation Strategy Tool", "Phased exam prep plan from preparedness scores and exam type.", ["exam preparation strategy", "revision plan"]),
  "aist-ai-daily-learning-schedule-generator": article("aist-ai-daily-learning-schedule-generator", "Daily Learning Schedule", "Energy-aware hourly plan prioritising hard subjects at peak focus.", "AI Daily Learning Schedule Generator", "Build today's study schedule by energy peak and priorities.", ["daily study schedule", "learning planner"]),
  "aist-ai-marks-analyzer": article("aist-ai-marks-analyzer", "Marks Analyzer", "Subject performance breakdown with grade band and benchmark compare.", "AI Marks Analyzer — Subject Performance", "Analyze marks across subjects with weak-area flags.", ["marks analyzer", "grade calculator"]),
  "aist-ai-weak-area-detector": article("aist-ai-weak-area-detector", "Weak Area Detector", "Gap analysis vs benchmark with ranked improvement priorities.", "AI Weak Area Detector — Study Gaps", "Detect weak subjects and gap vs target benchmark.", ["weak area detector", "study gap analysis"]),
  "aist-ai-rank-predictor": article("aist-ai-rank-predictor", "Rank Predictor", "Heuristic percentile and rank band from score and cohort size.", "AI Rank Predictor — Percentile Estimate", "Estimate exam rank band from score and difficulty.", ["rank predictor", "percentile calculator"]),
  "aist-ai-performance-improvement-plan-generator": article("aist-ai-performance-improvement-plan-generator", "Improvement Plan", "Weekly gain targets and daily minute budget to reach target average.", "AI Performance Improvement Plan Generator", "Plan weekly score improvement path to a target average.", ["performance improvement plan", "grade improvement"]),
  "aist-ai-concept-explainer": article("aist-ai-concept-explainer", "Concept Explainer", "Step-by-step curated study paths for common syllabus topics.", "AI Concept Explainer — Step-by-Step Paths", "Structured concept study paths for math, science, and more.", ["concept explainer", "study steps"]),
  "aist-ai-formula-generator": article("aist-ai-formula-generator", "Formula Generator", "Topic formula packs with usage notes for revision.", "AI Formula Generator — Revision Formulas", "Generate formula sheets by subject and topic.", ["formula generator", "formula sheet"]),
  "aist-ai-question-solver-step-by-step": article("aist-ai-question-solver-step-by-step", "Question Solver", "Rule-based step solver for linear, quadratic, and geometry problems.", "AI Question Solver — Step by Step", "Solve basic math problems with shown working steps.", ["step by step solver", "math problem solver"]),
  "aist-ai-notes-generator": article("aist-ai-notes-generator", "Notes Generator", "Structured note outlines at brief, standard, or detailed depth.", "AI Notes Generator — Study Outlines", "Generate Cornell-style note outlines by topic.", ["notes generator", "study notes outline"]),
};
