/** Target-score back-solvers: pass, distinction, finals, cut-off, scholarship, rank. */

export const EXAM_TARGET_SCORE_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
} as const;

export function parseExamTargetScoreSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(EXAM_TARGET_SCORE_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function requiredOnRemaining(params: {
  marksSoFar: number;
  maxSoFar: number;
  remainingMax: number;
  targetPercent: number;
}): { required: number; overallTarget: number; alreadyMet: boolean } | { error: string } {
  if (params.marksSoFar < 0 || params.maxSoFar < 0 || params.remainingMax < 0) {
    return { error: "Values cannot be negative." };
  }
  if (params.targetPercent <= 0 || params.targetPercent > 100) {
    return { error: "Target % must be between 0 and 100." };
  }
  if (params.marksSoFar > params.maxSoFar) {
    return { error: "Marks so far cannot exceed max so far." };
  }
  const overallMax = params.maxSoFar + params.remainingMax;
  if (overallMax <= 0) return { error: "Overall max must be positive." };
  const overallTarget = (params.targetPercent / 100) * overallMax;
  const required = overallTarget - params.marksSoFar;
  if (required <= 0) return { required: 0, overallTarget, alreadyMet: true };
  if (required > params.remainingMax) {
    return {
      error: `Need ${required.toFixed(1)} more, but only ${params.remainingMax} marks remain.`,
    };
  }
  return { required, overallTarget, alreadyMet: false };
}

/** Coursework + final weighted to hit target overall %. */
export function requiredMarksFinalExam(params: {
  courseworkPercent: number;
  courseworkWeightPercent: number;
  finalWeightPercent: number;
  targetOverallPercent: number;
  finalMaxMarks: number;
}): { requiredFinalMarks: number; requiredFinalPercent: number } | { error: string } {
  if (
    params.courseworkPercent < 0 ||
    params.courseworkPercent > 100 ||
    params.targetOverallPercent < 0 ||
    params.targetOverallPercent > 100
  ) {
    return { error: "Percentages must be 0–100." };
  }
  if (params.finalMaxMarks <= 0) return { error: "Final max marks must be positive." };
  const cw = params.courseworkWeightPercent;
  const fw = params.finalWeightPercent;
  if (cw < 0 || fw < 0 || cw + fw <= 0) {
    return { error: "Weights must be non-negative and sum positive." };
  }
  const scale = 100 / (cw + fw);
  const cwW = cw * scale;
  const fwW = fw * scale;
  const neededFinalPercent =
    (params.targetOverallPercent - params.courseworkPercent * (cwW / 100)) / (fwW / 100);
  if (!Number.isFinite(neededFinalPercent)) {
    return { error: "Final weight must be positive." };
  }
  if (neededFinalPercent > 100) {
    return {
      error: `Need ${neededFinalPercent.toFixed(1)}% on final — above 100% with current coursework.`,
    };
  }
  const requiredFinalPercent = Math.max(0, neededFinalPercent);
  return {
    requiredFinalPercent,
    requiredFinalMarks: (requiredFinalPercent / 100) * params.finalMaxMarks,
  };
}

export function requiredScoreGap(params: {
  currentScore: number;
  targetScore: number;
}): { gap: number; alreadyMet: boolean } | { error: string } {
  if (params.currentScore < 0 || params.targetScore < 0) {
    return { error: "Scores cannot be negative." };
  }
  const gap = params.targetScore - params.currentScore;
  return { gap: Math.max(0, gap), alreadyMet: gap <= 0 };
}
