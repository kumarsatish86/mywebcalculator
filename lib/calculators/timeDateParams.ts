export const TDATE_URL = {
  D1: "d1",
  D2: "d2",
  T1: "t1",
  T2: "t2",
  Y: "y",
  H: "h",
  M: "m",
  S: "s",
  BRK: "brk",
  OP: "op",
  N: "n",
  TZ: "tz",
  TZ2: "tz2",
  TZ3: "tz3",
  WS: "ws",
  WE: "we",
  MDUR: "mdur",
  OT: "ot",
  MULT: "mult",
  RATE: "rate",
  PDAY: "pday",
  TS: "ts",
  CRON: "cron",
  LOGFMT: "logfmt",
  DOW: "dow",
  JD: "jd",
} as const;

export function parseTimeDateSearchParams(sp: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(TDATE_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export type TimeOp = "add" | "sub";

export function parseTimeOp(raw: string): TimeOp {
  return raw === "sub" ? "sub" : "add";
}
