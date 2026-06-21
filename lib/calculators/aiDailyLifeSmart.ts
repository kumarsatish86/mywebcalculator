export const AI_DAILY_URL = {
  TOTAL: "tot",
  PEOPLE: "ppl",
  TIP: "tip",
  P1: "p1",
  P2: "p2",
  P3: "p3",
  P4: "p4",
  INCOME: "inc",
  B1N: "b1n",
  B1A: "b1a",
  B2N: "b2n",
  B2A: "b2a",
  B3N: "b3n",
  B3A: "b3a",
  B4N: "b4n",
  B4A: "b4a",
  RENT: "rent",
  FOOD: "food",
  TRANSPORT: "trn",
  SUBS: "sub",
  ENT: "ent",
  SAVE: "sv",
  PR1: "pr1",
  PR2: "pr2",
  PR3: "pr3",
  Q1: "q1",
  Q2: "q2",
  Q3: "q3",
  ORIG: "orig",
  DISC: "disc",
  COUPON: "cpn",
  CASHBACK: "cb",
  O1: "o1",
  O2: "o2",
  O3: "o3",
  S1: "s1",
  S2: "s2",
  S3: "s3",
  W1: "w1",
  W2: "w2",
  W3: "w3",
  DAYS: "dys",
  TRAVELERS: "trv",
  FLIGHT: "flt",
  HOTEL: "htl",
  FOOD_DAY: "fd",
  ACTIVITIES: "act",
  BUDGET: "bud",
  DIST: "dist",
  MILEAGE: "mpg",
  FUEL: "fuel",
  ROUND: "rnd",
} as const;

export function parseAiDailyLifeSearchParams(sp: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(AI_DAILY_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export type SplitMethod = "equal" | "weighted" | "custom";
export type TripStyle = "budget" | "comfort" | "luxury";

export function parseSplitMethod(raw: string): SplitMethod {
  if (raw === "weighted" || raw === "custom") return raw;
  return "equal";
}

export function parseTripStyle(raw: string): TripStyle {
  if (raw === "comfort" || raw === "luxury") return raw;
  return "budget";
}

export function parseRoundTrip(raw: string): boolean {
  return raw === "1" || raw === "true" || raw === "yes";
}
