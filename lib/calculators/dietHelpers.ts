/** Shared diet/nutrition teaching math — educational only. */

export const DIET_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
  H: "h",
  S: "s",
  P: "p",
  F: "f",
  N: "n",
  K: "k",
} as const;

export function parseDietSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(DIET_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const ACTIVITY: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very: 1.9,
};

export function activityFactor(activity: string): number | { error: string } {
  const key = activity.trim().toLowerCase();
  const hit = Object.entries(ACTIVITY).find(([k]) => key.includes(k));
  if (!hit) return { error: "Activity: sedentary, light, moderate, active, or very." };
  return hit[1];
}

export function mifflinBmr(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: "male" | "female",
): number | { error: string } {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) {
    return { error: "Weight, height, and age must be positive." };
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
}

export function tdeeFromBmr(bmr: number, activity: string): { tdee: number; factor: number } | { error: string } {
  if (bmr <= 0) return { error: "BMR must be positive." };
  const factor = activityFactor(activity);
  if (typeof factor === "object") return factor;
  return { tdee: bmr * factor, factor };
}

export function macroSplit(
  calories: number,
  proteinPct: number,
  carbPct: number,
  fatPct: number,
): { proteinG: number; carbG: number; fatG: number } | { error: string } {
  if (calories <= 0) return { error: "Calories must be positive." };
  const sum = proteinPct + carbPct + fatPct;
  if (sum <= 0) return { error: "Macro % mix must be positive." };
  const s = 100 / sum;
  return {
    proteinG: (calories * ((proteinPct * s) / 100)) / 4,
    carbG: (calories * ((carbPct * s) / 100)) / 4,
    fatG: (calories * ((fatPct * s) / 100)) / 9,
  };
}

export function parseSex(raw: string): "male" | "female" | { error: string } {
  const t = raw.trim().toLowerCase();
  if (t === "male" || t === "m") return "male";
  if (t === "female" || t === "f") return "female";
  return { error: "Sex: enter male or female." };
}
