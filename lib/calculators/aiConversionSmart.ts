export const AI_CONV_URL = {
  VAL: "val",
  AMT: "amt",
  RATE: "rate",
  TREND: "trend",
  VOL: "vol",
  DAYS: "days",
  TZ1: "tz1",
  TZ2: "tz2",
  TZ3: "tz3",
  WORK_START: "ws",
  WORK_END: "we",
  MEET_DUR: "mdur",
  HRS: "hrs",
  T1: "t1",
  T2: "t2",
  T3: "t3",
  T4: "t4",
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  P1: "p1",
  P2: "p2",
  P3: "p3",
  P4: "p4",
  FOCUS: "fcs",
  INTR: "intr",
  DONE: "done",
  PLAN: "plan",
  DEEP: "deep",
  WAKE: "wake",
  SLEEP: "sleep",
  A1: "a1",
  A2: "a2",
  A3: "a3",
  A4: "a4",
  A5: "a5",
  D1: "d1",
  D2: "d2",
  D3: "d3",
  D4: "d4",
  D5: "d5",
  E1: "e1",
  E2: "e2",
  E3: "e3",
  E4: "e4",
  E5: "e5",
} as const;

export function parseAiConversionSearchParams(sp: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(AI_CONV_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  for (const k of ["from", "to", "base", "quote"] as const) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export type UnitKey =
  | "m" | "km" | "mi" | "ft" | "cm"
  | "kg" | "g" | "lb" | "oz"
  | "c" | "f"
  | "l" | "ml" | "gal";

export type EnergyLevel = "high" | "medium" | "low";

export function parseUnit(raw: string): UnitKey {
  const units: UnitKey[] = ["m", "km", "mi", "ft", "cm", "kg", "g", "lb", "oz", "c", "f", "l", "ml", "gal"];
  return units.includes(raw as UnitKey) ? (raw as UnitKey) : "m";
}

export function parseEnergy(raw: string): EnergyLevel {
  if (raw === "medium" || raw === "low") return raw;
  return "high";
}
