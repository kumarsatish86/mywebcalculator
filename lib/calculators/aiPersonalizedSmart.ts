export const AI_PERS_URL = {
  EXP: "exp",
  CURR: "curr",
  TARGET: "target",
  EDU: "edu",
  SKILLS: "skills",
  S1: "s1",
  S2: "s2",
  S3: "s3",
  S4: "s4",
  T1: "t1",
  T2: "t2",
  T3: "t3",
  T4: "t4",
  HRS: "hrs",
  CAP: "cap",
  RISK: "risk",
  INT1: "int1",
  INT2: "int2",
  BUD: "bud",
  MKT: "mkt",
  COMP: "comp",
  INC: "inc",
  GOAL: "goal",
  SAVE: "save",
  INVEST: "inv",
  MO: "mo",
} as const;

export function parseAiPersonalizedSearchParams(sp: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(AI_PERS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  for (const k of ["field", "role"] as const) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export type CareerField = "tech" | "finance" | "health" | "creative" | "business";
export type RiskLevel = "low" | "medium" | "high";
export type EducationLevel = "highschool" | "bachelor" | "master" | "phd";

export function parseCareerField(raw: string): CareerField {
  if (raw === "finance" || raw === "health" || raw === "creative" || raw === "business") return raw;
  return "tech";
}

export function parseRisk(raw: string): RiskLevel {
  if (raw === "medium" || raw === "high") return raw;
  return "low";
}

export function parseEducation(raw: string): EducationLevel {
  if (raw === "bachelor" || raw === "master" || raw === "phd") return raw;
  return "highschool";
}
