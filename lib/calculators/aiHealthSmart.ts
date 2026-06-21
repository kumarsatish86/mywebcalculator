export const AI_HEALTH_URL = {
  AGE: "age",
  WEIGHT: "wt",
  HEIGHT: "ht",
  GOAL: "gl",
  DAYS: "dys",
  TARGET: "tgt",
  WEEKS: "wl",
  ACTIVITY: "act",
  DIET: "diet",
  CALORIES: "cal",
  MEALS: "mls",
  SEX: "sx",
  FOCUS: "fcs",
  DURATION: "dur",
  LEVEL: "lvl",
  EXPERIENCE: "exp",
  PROTEIN: "prt",
  SURPLUS: "sur",
  SPACE: "spc",
  EQUIP: "eqp",
  SPLIT: "spl",
  BED: "bed",
  WAKE: "wake",
  QUALITY: "qlt",
  SCREEN: "scr",
  S1: "s1",
  S2: "s2",
  S3: "s3",
  S4: "s4",
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  H1M: "h1m",
  H2M: "h2m",
  H3M: "h3m",
  H4M: "h4m",
} as const;

export function parseAiHealthSearchParams(sp: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(AI_HEALTH_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export type FitnessGoal = "lose" | "maintain" | "gain";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "athlete";
export type DietType = "veg" | "nonveg" | "custom";
export type WorkoutFocus = "full" | "upper" | "lower" | "cardio" | "core";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type HomeSpace = "small" | "medium" | "large";
export type HomeEquipment = "none" | "basic" | "full";
export type GymSplit = "full" | "upper-lower" | "push-pull-legs" | "bro";
export type Sex = "male" | "female";

export function parseFitnessGoal(raw: string): FitnessGoal {
  if (raw === "maintain" || raw === "gain") return raw;
  return "lose";
}

export function parseActivityLevel(raw: string): ActivityLevel {
  if (raw === "light" || raw === "moderate" || raw === "active" || raw === "athlete") return raw;
  return "sedentary";
}

export function parseDietType(raw: string): DietType {
  if (raw === "nonveg" || raw === "custom") return raw;
  return "veg";
}

export function parseWorkoutFocus(raw: string): WorkoutFocus {
  if (raw === "upper" || raw === "lower" || raw === "cardio" || raw === "core") return raw;
  return "full";
}

export function parseExperienceLevel(raw: string): ExperienceLevel {
  if (raw === "intermediate" || raw === "advanced") return raw;
  return "beginner";
}

export function parseHomeSpace(raw: string): HomeSpace {
  if (raw === "medium" || raw === "large") return raw;
  return "small";
}

export function parseHomeEquipment(raw: string): HomeEquipment {
  if (raw === "basic" || raw === "full") return raw;
  return "none";
}

export function parseGymSplit(raw: string): GymSplit {
  if (raw === "upper-lower" || raw === "push-pull-legs" || raw === "bro") return raw;
  return "full";
}

export function parseSex(raw: string): Sex {
  return raw === "female" ? "female" : "male";
}

const ACTIVITY_MULT: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

/** Mifflin–St Jeor BMR (kcal/day). */
export function bmrMifflin(params: { weightKg: number; heightCm: number; age: number; sex: Sex }): number {
  const base = 10 * params.weightKg + 6.25 * params.heightCm - 5 * params.age;
  return params.sex === "male" ? base + 5 : base - 161;
}

export function tdeeFromBmr(bmr: number, activity: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULT[activity]);
}
