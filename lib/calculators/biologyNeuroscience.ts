/** Neuroscience / psychology bio helpers (educational, not clinical). */

export const BIOLOGY_NEURO_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
} as const;

export function parseBiologyNeuroSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BIOLOGY_NEURO_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** Mean reaction time (ms) from CSV samples. */
export function reactionTime(params: {
  samplesCsv: string;
}): { meanMs: number; n: number; minMs: number; maxMs: number } | { error: string } {
  const vals = params.samplesCsv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0);
  if (vals.length < 1) return { error: "Enter at least one positive reaction time (ms)." };
  const meanMs = vals.reduce((s, v) => s + v, 0) / vals.length;
  return {
    meanMs,
    n: vals.length,
    minMs: Math.min(...vals),
    maxMs: Math.max(...vals),
  };
}

/** Simple cognitive-load index = (tasks × difficulty) / capacity. */
export function cognitiveLoad(params: {
  tasks: number;
  difficulty: number;
  capacity: number;
}): { load: number; band: string } | { error: string } {
  if (params.tasks <= 0 || params.difficulty <= 0 || params.capacity <= 0) {
    return { error: "Tasks, difficulty, and capacity must be positive." };
  }
  const load = (params.tasks * params.difficulty) / params.capacity;
  let band: string;
  if (load < 0.7) band = "Low — spare capacity";
  else if (load <= 1.1) band = "Moderate — near capacity";
  else band = "High — overload risk (educational index only)";
  return { load, band };
}

/** 90-minute sleep-cycle wake suggestions from bedtime (HH:MM, 24h). */
export function sleepCycle(params: {
  bedtime: string;
  cycles?: number;
}): { wakeTimes: string[]; note: string } | { error: string } {
  const m = /^(\d{1,2}):(\d{2})$/.exec(params.bedtime.trim());
  if (!m) return { error: "Bedtime as HH:MM (24-hour)." };
  let h = Number(m[1]);
  let min = Number(m[2]);
  if (h > 23 || min > 59) return { error: "Invalid bedtime." };
  const cycles = params.cycles ?? 5;
  if (cycles < 1 || cycles > 8) return { error: "Cycles must be 1–8." };
  // Fall-asleep buffer 15 min
  let totalMin = h * 60 + min + 15;
  const wakeTimes: string[] = [];
  for (let i = 1; i <= cycles; i++) {
    totalMin += 90;
    const wh = Math.floor(totalMin / 60) % 24;
    const wm = totalMin % 60;
    wakeTimes.push(`${String(wh).padStart(2, "0")}:${String(wm).padStart(2, "0")}`);
  }
  return {
    wakeTimes,
    note: "Assumes ~15 min to fall asleep and 90 min cycles — not medical advice.",
  };
}

/** Suggested bedtime from wake time minus target sleep hours. */
export function circadianRhythm(params: {
  wakeTime: string;
  sleepHours: number;
}): { bedtime: string; note: string } | { error: string } {
  const m = /^(\d{1,2}):(\d{2})$/.exec(params.wakeTime.trim());
  if (!m) return { error: "Wake time as HH:MM (24-hour)." };
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return { error: "Invalid wake time." };
  if (params.sleepHours < 4 || params.sleepHours > 12) {
    return { error: "Sleep hours should be between 4 and 12 for this helper." };
  }
  let total = h * 60 + min - Math.round(params.sleepHours * 60) - 15;
  while (total < 0) total += 24 * 60;
  const bh = Math.floor(total / 60) % 24;
  const bm = total % 60;
  return {
    bedtime: `${String(bh).padStart(2, "0")}:${String(bm).padStart(2, "0")}`,
    note: "Includes a 15 min wind-down buffer — educational chronotype helper only.",
  };
}
