/** Curated Exam Success Center catalog — stages, goals, workflows (live slugs only). */

export type ExamId = "jee" | "neet" | "upsc" | "cat" | "ssc" | "gate" | "cuet" | "custom";
export type StageId = "before" | "during" | "after" | "ai";
export type DifficultyId = "beginner" | "intermediate" | "advanced";
export type GoalId =
  | "improve_marks"
  | "improve_speed"
  | "improve_accuracy"
  | "crack_competitive"
  | "reduce_negative"
  | "rank_prediction";

export type CenterToolMeta = {
  slug: string;
  title: string;
  stage: StageId;
  difficulty: DifficultyId;
  estMinutes: number;
  /** Curated 1–5 popularity for stars UI (not fake user counts). */
  popularity: 1 | 2 | 3 | 4 | 5;
  aiAssisted?: boolean;
  exams: ExamId[];
  goals: GoalId[];
};

export type CenterGoal = {
  id: GoalId;
  label: string;
  blurb: string;
};

export type CenterProblem = {
  id: string;
  label: string;
  phrases: string[];
  slugs: string[];
  reason: string;
};

export type CenterWorkflow = {
  id: string;
  title: string;
  blurb: string;
  journeyId: string;
  estMinutes: number;
  examTags: ExamId[];
};

export type CenterToolkit = {
  id: string;
  title: string;
  exam: ExamId;
  slugs: string[];
};

export type RoadmapStep = {
  id: string;
  title: string;
  slug: string;
  blurb: string;
};

export const CENTER_GOALS: CenterGoal[] = [
  { id: "improve_marks", label: "Improve Marks", blurb: "Raise expected score with smarter attempts." },
  { id: "improve_speed", label: "Improve Speed", blurb: "Finish more of the paper without chaos." },
  { id: "improve_accuracy", label: "Improve Accuracy", blurb: "Cut silly mistakes and wrong guesses." },
  { id: "crack_competitive", label: "Crack Competitive Exams", blurb: "JEE, NEET, CAT, UPSC-style workflows." },
  { id: "reduce_negative", label: "Reduce Negative Marks", blurb: "Know when to skip vs attempt." },
  { id: "rank_prediction", label: "Rank Prediction", blurb: "Map mocks to percentile and rank bands." },
];

export const CENTER_PROBLEMS: CenterProblem[] = [
  {
    id: "low_accuracy",
    label: "I have low accuracy",
    phrases: ["low accuracy", "wrong answers", "silly mistakes", "guessing wrong"],
    slugs: [
      "accuracy-calculator-correct-vs-wrong",
      "attempt-accuracy-calculator",
      "speed-vs-accuracy-calculator",
      "question-attempt-strategy-calculator",
      "optimal-attempt-calculator",
    ],
    reason: "Tighten attempt quality before raising pace.",
  },
  {
    id: "run_out_of_time",
    label: "I run out of time",
    phrases: ["run out of time", "finish only", "70% paper", "65% paper", "slow", "time management"],
    slugs: [
      "time-allocation-calculator-per-section",
      "speed-vs-accuracy-calculator",
      "time-efficiency-calculator",
      "question-attempt-strategy-calculator",
      "exam-strategy-planner",
    ],
    reason: "Allocate minutes and attempt order first.",
  },
  {
    id: "low_mocks",
    label: "I score less in mock tests",
    phrases: ["mock", "score low", "despite preparation", "not improving"],
    slugs: [
      "mock-test-performance-calculator",
      "score-trend-calculator",
      "improvement-tracker-calculator",
      "ai-score-improvement-planner",
      "weak-topic-analyzer",
    ],
    reason: "Diagnose trends, then rebuild the study plan.",
  },
  {
    id: "negative_marking",
    label: "I get negative marking",
    phrases: ["negative marking", "negative marks", "penalty", "guess"],
    slugs: [
      "negative-marking-calculator",
      "optimal-attempt-calculator",
      "attempt-accuracy-calculator",
      "question-attempt-strategy-calculator",
      "exam-strategy-planner",
    ],
    reason: "Model expected value before you guess.",
  },
  {
    id: "panic",
    label: "I panic during exams",
    phrases: ["panic", "nervous", "anxiety", "freeze"],
    slugs: [
      "question-attempt-strategy-calculator",
      "time-allocation-calculator-per-section",
      "exam-strategy-planner",
      "study-plan-generator",
      "revision-planner-calculator",
    ],
    reason: "A fixed order and timeline reduces in-exam panic.",
  },
  {
    id: "air_goal",
    label: "I want AIR under 1000",
    phrases: ["air", "rank", "topper", "1000", "percentile"],
    slugs: [
      "rank-predictor-calculator",
      "rank-predictor-jee-neet",
      "percentile-calculator-exam",
      "ai-rank-predictor",
      "cutoff-predictor-calculator",
      "exam-strategy-planner",
    ],
    reason: "Translate target rank into score and attempt strategy.",
  },
];

const ALL_EXAMS: ExamId[] = ["jee", "neet", "upsc", "cat", "ssc", "gate", "cuet", "custom"];

export const CENTER_TOOLS: CenterToolMeta[] = [
  {
    slug: "study-plan-generator",
    title: "Study Plan Generator",
    stage: "before",
    difficulty: "beginner",
    estMinutes: 5,
    popularity: 5,
    exams: ALL_EXAMS,
    goals: ["improve_marks", "crack_competitive"],
  },
  {
    slug: "revision-planner-calculator",
    title: "Revision Planner",
    stage: "before",
    difficulty: "beginner",
    estMinutes: 4,
    popularity: 4,
    exams: ALL_EXAMS,
    goals: ["improve_marks", "improve_accuracy"],
  },
  {
    slug: "days-to-complete-syllabus-calculator",
    title: "Syllabus Completion Calculator",
    stage: "before",
    difficulty: "beginner",
    estMinutes: 3,
    popularity: 4,
    exams: ["jee", "neet", "upsc", "cat", "gate", "cuet", "custom"],
    goals: ["crack_competitive", "improve_marks"],
  },
  {
    slug: "study-hours-calculator",
    title: "Study Hours Calculator",
    stage: "before",
    difficulty: "beginner",
    estMinutes: 3,
    popularity: 5,
    exams: ALL_EXAMS,
    goals: ["improve_marks", "crack_competitive"],
  },
  {
    slug: "exam-countdown-calculator",
    title: "Exam Countdown",
    stage: "before",
    difficulty: "beginner",
    estMinutes: 2,
    popularity: 3,
    exams: ALL_EXAMS,
    goals: ["crack_competitive"],
  },
  {
    slug: "exam-strategy-planner",
    title: "AI Exam Strategy Planner",
    stage: "during",
    difficulty: "intermediate",
    estMinutes: 8,
    popularity: 5,
    aiAssisted: true,
    exams: ALL_EXAMS,
    goals: [
      "improve_marks",
      "improve_speed",
      "improve_accuracy",
      "reduce_negative",
      "crack_competitive",
      "rank_prediction",
    ],
  },
  {
    slug: "question-attempt-strategy-calculator",
    title: "Question Attempt Strategy",
    stage: "during",
    difficulty: "beginner",
    estMinutes: 4,
    popularity: 5,
    exams: ["jee", "neet", "cat", "ssc", "gate", "cuet", "custom"],
    goals: ["improve_speed", "improve_accuracy", "reduce_negative"],
  },
  {
    slug: "time-allocation-calculator-per-section",
    title: "Time Allocation",
    stage: "during",
    difficulty: "beginner",
    estMinutes: 4,
    popularity: 5,
    exams: ALL_EXAMS,
    goals: ["improve_speed"],
  },
  {
    slug: "optimal-attempt-calculator",
    title: "Optimal Attempt",
    stage: "during",
    difficulty: "intermediate",
    estMinutes: 5,
    popularity: 4,
    exams: ["jee", "neet", "cat", "ssc", "gate", "cuet", "custom"],
    goals: ["reduce_negative", "improve_marks"],
  },
  {
    slug: "speed-vs-accuracy-calculator",
    title: "Speed vs Accuracy",
    stage: "during",
    difficulty: "intermediate",
    estMinutes: 4,
    popularity: 5,
    exams: ["jee", "neet", "cat", "ssc", "gate", "cuet", "custom"],
    goals: ["improve_speed", "improve_accuracy"],
  },
  {
    slug: "negative-marking-calculator",
    title: "Negative Marking",
    stage: "during",
    difficulty: "beginner",
    estMinutes: 3,
    popularity: 5,
    exams: ["jee", "neet", "cat", "ssc", "gate", "cuet", "custom"],
    goals: ["reduce_negative"],
  },
  {
    slug: "attempt-accuracy-calculator",
    title: "Attempt Accuracy",
    stage: "during",
    difficulty: "beginner",
    estMinutes: 3,
    popularity: 4,
    exams: ["jee", "neet", "cat", "ssc", "gate", "cuet", "custom"],
    goals: ["improve_accuracy", "reduce_negative"],
  },
  {
    slug: "time-efficiency-calculator",
    title: "Time Efficiency",
    stage: "during",
    difficulty: "intermediate",
    estMinutes: 4,
    popularity: 3,
    exams: ALL_EXAMS,
    goals: ["improve_speed"],
  },
  {
    slug: "mock-test-performance-calculator",
    title: "Mock Test Performance",
    stage: "after",
    difficulty: "beginner",
    estMinutes: 4,
    popularity: 5,
    exams: ALL_EXAMS,
    goals: ["improve_marks", "rank_prediction"],
  },
  {
    slug: "exam-score-estimator",
    title: "Score Predictor",
    stage: "after",
    difficulty: "beginner",
    estMinutes: 3,
    popularity: 4,
    exams: ["jee", "neet", "cat", "ssc", "gate", "cuet", "custom"],
    goals: ["improve_marks", "rank_prediction"],
  },
  {
    slug: "percentile-calculator-exam",
    title: "Percentile Predictor",
    stage: "after",
    difficulty: "intermediate",
    estMinutes: 3,
    popularity: 4,
    exams: ["jee", "neet", "cat", "gate", "cuet", "custom"],
    goals: ["rank_prediction"],
  },
  {
    slug: "rank-predictor-calculator",
    title: "Rank Predictor",
    stage: "after",
    difficulty: "intermediate",
    estMinutes: 4,
    popularity: 5,
    exams: ["jee", "neet", "cat", "ssc", "gate", "cuet", "custom"],
    goals: ["rank_prediction", "crack_competitive"],
  },
  {
    slug: "rank-predictor-jee-neet",
    title: "JEE/NEET Rank Predictor",
    stage: "after",
    difficulty: "intermediate",
    estMinutes: 4,
    popularity: 5,
    exams: ["jee", "neet"],
    goals: ["rank_prediction", "crack_competitive"],
  },
  {
    slug: "subject-wise-performance-analyzer",
    title: "Performance Analyzer",
    stage: "after",
    difficulty: "intermediate",
    estMinutes: 5,
    popularity: 4,
    exams: ["jee", "neet", "upsc", "cat", "gate", "cuet", "custom"],
    goals: ["improve_marks", "improve_accuracy"],
  },
  {
    slug: "improvement-tracker-calculator",
    title: "Improvement Calculator",
    stage: "after",
    difficulty: "beginner",
    estMinutes: 3,
    popularity: 4,
    exams: ALL_EXAMS,
    goals: ["improve_marks"],
  },
  {
    slug: "score-trend-calculator",
    title: "Score Trend",
    stage: "after",
    difficulty: "beginner",
    estMinutes: 3,
    popularity: 3,
    exams: ALL_EXAMS,
    goals: ["improve_marks"],
  },
  {
    slug: "cutoff-predictor-calculator",
    title: "Cut-off Predictor",
    stage: "after",
    difficulty: "intermediate",
    estMinutes: 3,
    popularity: 4,
    exams: ["jee", "neet", "ssc", "gate", "cuet", "custom"],
    goals: ["rank_prediction", "crack_competitive"],
  },
  {
    slug: "ai-study-strategy-generator",
    title: "Study Strategy Generator",
    stage: "ai",
    difficulty: "intermediate",
    estMinutes: 6,
    popularity: 4,
    aiAssisted: true,
    exams: ALL_EXAMS,
    goals: ["improve_marks", "crack_competitive"],
  },
  {
    slug: "ai-weakness-analyzer",
    title: "Weak Subject Finder",
    stage: "ai",
    difficulty: "intermediate",
    estMinutes: 5,
    popularity: 4,
    aiAssisted: true,
    exams: ["jee", "neet", "upsc", "cat", "gate", "cuet", "custom"],
    goals: ["improve_accuracy", "improve_marks"],
  },
  {
    slug: "weak-topic-analyzer",
    title: "Weak Topic Analyzer",
    stage: "ai",
    difficulty: "intermediate",
    estMinutes: 5,
    popularity: 3,
    exams: ["jee", "neet", "upsc", "cat", "gate", "cuet", "custom"],
    goals: ["improve_accuracy"],
  },
  {
    slug: "ai-score-improvement-planner",
    title: "Score Improvement Planner",
    stage: "ai",
    difficulty: "advanced",
    estMinutes: 6,
    popularity: 4,
    aiAssisted: true,
    exams: ALL_EXAMS,
    goals: ["improve_marks", "rank_prediction"],
  },
  {
    slug: "ai-rank-predictor",
    title: "AI Rank Predictor",
    stage: "ai",
    difficulty: "advanced",
    estMinutes: 5,
    popularity: 5,
    aiAssisted: true,
    exams: ["jee", "neet", "cat", "gate", "cuet", "custom"],
    goals: ["rank_prediction"],
  },
];

export const CENTER_STAGES: { id: StageId; title: string; blurb: string }[] = [
  { id: "before", title: "Before Exam", blurb: "Plan hours, syllabus, and revision cadence." },
  { id: "during", title: "During Exam", blurb: "Attempt order, timing, and negative-mark math." },
  { id: "after", title: "After Exam", blurb: "Mocks, percentiles, ranks, and improvement loops." },
  { id: "ai", title: "AI Insights", blurb: "Rules-based planners and weakness finders." },
];

export const CENTER_WORKFLOWS: CenterWorkflow[] = [
  {
    id: "crack-jee-90",
    title: "Crack JEE in 90 Days",
    blurb: "Hours → revision → mocks → timing → rank → improvement.",
    journeyId: "crack-jee-90-days",
    estMinutes: 15,
    examTags: ["jee"],
  },
  {
    id: "fix-nm",
    title: "Fix Negative Marking",
    blurb: "Accuracy → penalty math → attempt strategy → optimal attempts.",
    journeyId: "fix-negative-marks",
    estMinutes: 10,
    examTags: ["jee", "neet", "cat", "ssc", "gate", "cuet"],
  },
  {
    id: "mock-rank",
    title: "Mock Scores to Rank",
    blurb: "Mock trends → percentile → rank → improvement plan.",
    journeyId: "mock-to-rank",
    estMinutes: 12,
    examTags: ["jee", "neet", "cat", "gate", "cuet"],
  },
  {
    id: "exam-prep",
    title: "Full Exam Prep Loop",
    blurb: "Planner → accuracy → NM → study plan → revision → rank.",
    journeyId: "exam-prep",
    estMinutes: 18,
    examTags: ALL_EXAMS,
  },
];

export const CENTER_TOOLKITS: CenterToolkit[] = [
  {
    id: "jee",
    title: "JEE Toolkit",
    exam: "jee",
    slugs: CENTER_TOOLS.filter((t) => t.exams.includes("jee")).map((t) => t.slug),
  },
  {
    id: "neet",
    title: "NEET Toolkit",
    exam: "neet",
    slugs: CENTER_TOOLS.filter((t) => t.exams.includes("neet")).map((t) => t.slug),
  },
  {
    id: "cat",
    title: "CAT Toolkit",
    exam: "cat",
    slugs: CENTER_TOOLS.filter((t) => t.exams.includes("cat")).map((t) => t.slug),
  },
  {
    id: "upsc",
    title: "UPSC Toolkit",
    exam: "upsc",
    slugs: CENTER_TOOLS.filter((t) => t.exams.includes("upsc")).map((t) => t.slug),
  },
];

export const CENTER_ROADMAP: RoadmapStep[] = [
  { id: "start", title: "Start Here", slug: "exam-strategy-planner", blurb: "Build your attempt digital twin." },
  { id: "plan", title: "Study Planning", slug: "study-plan-generator", blurb: "Map the weeks ahead." },
  { id: "hours", title: "Daily Schedule", slug: "study-hours-calculator", blurb: "Set realistic daily hours." },
  { id: "mock", title: "Mock Test", slug: "mock-test-performance-calculator", blurb: "Track mock score trends." },
  { id: "perf", title: "Performance Analysis", slug: "subject-wise-performance-analyzer", blurb: "Find weak subjects." },
  { id: "attempt", title: "Attempt Strategy", slug: "question-attempt-strategy-calculator", blurb: "Easy → medium → hard." },
  { id: "rank", title: "Rank Prediction", slug: "rank-predictor-calculator", blurb: "Translate score to rank band." },
  { id: "revise", title: "Final Revision", slug: "revision-planner-calculator", blurb: "Close the loop before exam day." },
];

export const EXAM_TABS: { id: ExamId | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "jee", label: "JEE" },
  { id: "neet", label: "NEET" },
  { id: "upsc", label: "UPSC" },
  { id: "cat", label: "CAT" },
  { id: "ssc", label: "SSC" },
  { id: "gate", label: "GATE" },
  { id: "cuet", label: "CUET" },
  { id: "custom", label: "Custom" },
];

export function getToolMeta(slug: string): CenterToolMeta | undefined {
  return CENTER_TOOLS.find((t) => t.slug === slug);
}

export type CenterFilterState = {
  exam: ExamId | "all";
  difficulty: DifficultyId | "all";
  goal: GoalId | "all";
  stage: StageId | "all";
  q: string;
};

export function filterCenterTools(filters: CenterFilterState): CenterToolMeta[] {
  const q = filters.q.trim().toLowerCase();
  return CENTER_TOOLS.filter((t) => {
    if (filters.exam !== "all" && !t.exams.includes(filters.exam)) return false;
    if (filters.difficulty !== "all" && t.difficulty !== filters.difficulty) return false;
    if (filters.goal !== "all" && !t.goals.includes(filters.goal)) return false;
    if (filters.stage !== "all" && t.stage !== filters.stage) return false;
    if (q && !t.title.toLowerCase().includes(q) && !t.slug.includes(q.replace(/\s+/g, "-"))) {
      return false;
    }
    return true;
  });
}

/** Neighbor tools in the same stage (for related recommendations). */
export function stageNeighbors(slug: string, limit = 6): string[] {
  const meta = getToolMeta(slug);
  if (!meta) return [];
  return CENTER_TOOLS.filter((t) => t.stage === meta.stage && t.slug !== slug)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
    .map((t) => t.slug);
}
