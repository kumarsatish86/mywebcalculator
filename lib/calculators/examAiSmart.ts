/** Rule-based “AI-style” exam planners — transparent heuristics, not a live model. */

export const EXAM_AI_SMART_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  P: "p",
  W: "w",
} as const;

export function parseExamAiSmartSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(EXAM_AI_SMART_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function aiRankPredictor(params: {
  marks: number;
  maxMarks: number;
  lastYearCutoffMarks: number;
  candidates?: number;
}): {
  vsCutoff: number;
  estimatedPercentile: number;
  estimatedRank: number;
  outlook: string;
} | { error: string } {
  if (params.maxMarks <= 0) return { error: "Max marks must be positive." };
  if (params.marks < 0 || params.lastYearCutoffMarks < 0) {
    return { error: "Marks cannot be negative." };
  }
  const ratio = Math.min(1, params.marks / params.maxMarks);
  const estimatedPercentile = Math.min(99.9, 100 * (1 - Math.pow(1 - ratio, 2)));
  const pool = params.candidates ?? 1_000_000;
  const estimatedRank = Math.max(1, Math.round(pool * (1 - estimatedPercentile / 100)));
  const vsCutoff = params.marks - params.lastYearCutoffMarks;
  const outlook =
    vsCutoff >= 20
      ? "Comfortably above last year’s cut-off (past trend only)."
      : vsCutoff >= 0
        ? "Near last year’s cut-off — trends shift yearly."
        : "Below last year’s cut-off — focus on high-yield topics.";
  return { vsCutoff, estimatedPercentile, estimatedRank, outlook };
}

export function aiScoreImprovementPlanner(params: {
  currentPercent: number;
  targetPercent: number;
  weeksLeft: number;
  hoursPerWeek: number;
}): {
  gapPoints: number;
  hoursTotal: number;
  pointsPerWeekNeeded: number;
  focusPlan: string[];
} | { error: string } {
  if (params.weeksLeft <= 0) return { error: "Weeks left must be positive." };
  if (params.hoursPerWeek < 0) return { error: "Hours cannot be negative." };
  const gapPoints = params.targetPercent - params.currentPercent;
  const hoursTotal = params.weeksLeft * params.hoursPerWeek;
  const pointsPerWeekNeeded = gapPoints / params.weeksLeft;
  const focusPlan = [
    `Close ~${pointsPerWeekNeeded.toFixed(1)} percentage points per week.`,
    hoursTotal >= 40
      ? "Split time: 50% weak topics, 30% mocks, 20% revision."
      : "Prioritize weak chapters first; one timed mock every weekend.",
    gapPoints > 15
      ? "Target is ambitious — add daily error-log review."
      : "Incremental drills + past papers should suffice.",
  ];
  return { gapPoints, hoursTotal, pointsPerWeekNeeded, focusPlan };
}

/** Subject scores CSV like "Math:60,Physics:45,Chem:70" or "60,45,70". */
export function aiWeaknessAnalyzer(params: {
  scoresCsv: string;
  maxPerSubject?: number;
}): {
  subjects: { name: string; score: number; percent: number; tag: string }[];
  weakest: string;
  strongest: string;
  advice: string[];
} | { error: string } {
  const max = params.maxPerSubject ?? 100;
  const parts = params.scoresCsv
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length < 2) return { error: "Enter at least 2 subject scores (comma-separated)." };
  const subjects = parts.map((part, i) => {
    const m = part.match(/^([^:]+):\s*([0-9.]+)$/);
    const name = m ? m[1]!.trim() : `Subject ${i + 1}`;
    const score = m ? Number(m[2]) : Number(part);
    if (!Number.isFinite(score) || score < 0) {
      return { name, score: NaN, percent: NaN, tag: "invalid" };
    }
    const percent = (score / max) * 100;
    const tag = percent < 50 ? "weak" : percent < 70 ? "ok" : "strong";
    return { name, score, percent, tag };
  });
  if (subjects.some((s) => !Number.isFinite(s.score))) {
    return { error: "Could not parse one or more scores." };
  }
  const sorted = [...subjects].sort((a, b) => a.percent - b.percent);
  const weakest = sorted[0]!.name;
  const strongest = sorted[sorted.length - 1]!.name;
  return {
    subjects,
    weakest,
    strongest,
    advice: [
      `Prioritize ${weakest} with daily short drills.`,
      `Use ${strongest} as a confidence builder in mocks — don’t over-invest there.`,
      "After each test, log mistakes by topic for one week.",
    ],
  };
}

export function aiStudyStrategyGenerator(params: {
  daysUntilExam: number;
  subjectsCount: number;
  dailyHours: number;
  style: "balanced" | "weakness-first" | "mock-heavy";
}): {
  dailyPlan: string;
  weeklyMocks: number;
  revisionBlocks: number;
  strategyBullets: string[];
} | { error: string } {
  if (params.daysUntilExam <= 0) return { error: "Days until exam must be positive." };
  if (params.subjectsCount <= 0) return { error: "Subjects count must be positive." };
  if (params.dailyHours <= 0) return { error: "Daily hours must be positive." };
  const hoursPerSubject = params.dailyHours / params.subjectsCount;
  const weeklyMocks =
    params.style === "mock-heavy" ? 3 : params.style === "balanced" ? 2 : 1;
  const revisionBlocks = Math.max(1, Math.floor(params.daysUntilExam / 7));
  const dailyPlan =
    params.style === "weakness-first"
      ? `${(params.dailyHours * 0.6).toFixed(1)}h weak topics · ${(params.dailyHours * 0.3).toFixed(1)}h practice · ${(params.dailyHours * 0.1).toFixed(1)}h review`
      : params.style === "mock-heavy"
        ? `${(params.dailyHours * 0.4).toFixed(1)}h timed sets · ${(params.dailyHours * 0.4).toFixed(1)}h analysis · ${(params.dailyHours * 0.2).toFixed(1)}h notes`
        : `~${hoursPerSubject.toFixed(1)}h per subject across ${params.subjectsCount} subjects`;
  return {
    dailyPlan,
    weeklyMocks,
    revisionBlocks,
    strategyBullets: [
      `Horizon: ${params.daysUntilExam} days with ~${params.dailyHours}h/day.`,
      `Schedule ${weeklyMocks} mock(s) per week.`,
      `Plan ${revisionBlocks} full revision cycle(s) before the exam.`,
      "Sleep and short breaks beat marathon cramming the night before.",
    ],
  };
}
