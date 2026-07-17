/** International exam score helpers (educational scaling — not official ETS/British Council scoring). */

export const EXAM_INTERNATIONAL_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  M: "m",
  W: "w",
} as const;

export function parseExamInternationalSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(EXAM_INTERNATIONAL_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/** Rough SAT total from section raws (illustrative linear scale to 400–1600). */
export function satScore(params: {
  readingWritingRaw: number;
  mathRaw: number;
  rwMax?: number;
  mathMax?: number;
}): {
  rwScaled: number;
  mathScaled: number;
  total: number;
  band: string;
} | { error: string } {
  const rwMax = params.rwMax ?? 54;
  const mathMax = params.mathMax ?? 44;
  if (params.readingWritingRaw < 0 || params.mathRaw < 0) {
    return { error: "Section scores cannot be negative." };
  }
  const rwScaled = Math.round(200 + 600 * clamp(params.readingWritingRaw / rwMax, 0, 1));
  const mathScaled = Math.round(200 + 600 * clamp(params.mathRaw / mathMax, 0, 1));
  const total = rwScaled + mathScaled;
  const band = total >= 1400 ? "Highly competitive" : total >= 1200 ? "Competitive" : total >= 1000 ? "Solid" : "Developing";
  return { rwScaled, mathScaled, total, band };
}

export function greScore(params: {
  verbalRaw: number;
  quantRaw: number;
  awa?: number;
  sectionMax?: number;
}): {
  verbalScaled: number;
  quantScaled: number;
  awa: number;
  combinedVQ: number;
} | { error: string } {
  const max = params.sectionMax ?? 40;
  if (params.verbalRaw < 0 || params.quantRaw < 0) return { error: "Scores cannot be negative." };
  const verbalScaled = Math.round(130 + 40 * clamp(params.verbalRaw / max, 0, 1));
  const quantScaled = Math.round(130 + 40 * clamp(params.quantRaw / max, 0, 1));
  const awa = clamp(params.awa ?? 3.5, 0, 6);
  return {
    verbalScaled,
    quantScaled,
    awa,
    combinedVQ: verbalScaled + quantScaled,
  };
}

export function gmatScore(params: {
  quantCorrect: number;
  verbalCorrect: number;
  quantTotal?: number;
  verbalTotal?: number;
}): {
  estimatedTotal: number;
  quantIndex: number;
  verbalIndex: number;
  band: string;
} | { error: string } {
  const qt = params.quantTotal ?? 31;
  const vt = params.verbalTotal ?? 36;
  if (params.quantCorrect < 0 || params.verbalCorrect < 0) {
    return { error: "Correct counts cannot be negative." };
  }
  const quantIndex = clamp(params.quantCorrect / qt, 0, 1);
  const verbalIndex = clamp(params.verbalCorrect / vt, 0, 1);
  // Illustrative map toward classic 200–800 scale
  const estimatedTotal = Math.round(200 + 600 * (0.55 * quantIndex + 0.45 * verbalIndex));
  const band =
    estimatedTotal >= 700 ? "Very strong" : estimatedTotal >= 650 ? "Competitive" : estimatedTotal >= 550 ? "Average+" : "Needs work";
  return { estimatedTotal, quantIndex: quantIndex * 100, verbalIndex: verbalIndex * 100, band };
}

/** IELTS overall band from four skills (0–9, 0.5 steps). */
export function ieltsBand(params: {
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
}): {
  average: number;
  overallBand: number;
  cefrHint: string;
} | { error: string } {
  const skills = [params.listening, params.reading, params.writing, params.speaking];
  if (skills.some((s) => s < 0 || s > 9)) return { error: "Each skill must be between 0 and 9." };
  const average = skills.reduce((a, b) => a + b, 0) / 4;
  // Official-style rounding to nearest 0.5
  const overallBand = Math.round(average * 2) / 2;
  const cefrHint =
    overallBand >= 8
      ? "C1–C2 range (illustrative)"
      : overallBand >= 6.5
        ? "B2–C1 range (illustrative)"
        : overallBand >= 5.5
          ? "B1–B2 range (illustrative)"
          : "A2–B1 range (illustrative)";
  return { average, overallBand, cefrHint };
}

export function toeflScore(params: {
  reading: number;
  listening: number;
  speaking: number;
  writing: number;
}): {
  total: number;
  band: string;
} | { error: string } {
  const sections = [params.reading, params.listening, params.speaking, params.writing];
  if (sections.some((s) => s < 0 || s > 30)) {
    return { error: "Each TOEFL section must be between 0 and 30." };
  }
  const total = sections.reduce((a, b) => a + b, 0);
  const band = total >= 100 ? "High" : total >= 80 ? "Competitive" : total >= 60 ? "Intermediate" : "Developing";
  return { total, band };
}
