export const AI_BUSINESS_URL = {
  REVENUE: "rev",
  COGS: "cogs",
  OPEX: "opex",
  INVEST: "inv",
  RETURNS: "ret",
  MONTHS: "mo",
  FIXED: "fix",
  VARIABLE: "var",
  COST: "cost",
  MARGIN: "mar",
  COMPETITOR: "cmp",
  TARGET_ROAS: "roas",
  AD_SPEND: "ads",
  AD_REV: "adr",
  IMPRESSIONS: "imp",
  CLICKS: "clk",
  CONVERSIONS: "cnv",
  HOURS: "hrs",
  T1: "t1",
  T2: "t2",
  T3: "t3",
  T4: "t4",
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  U1: "u1",
  U2: "u2",
  U3: "u3",
  U4: "u4",
  I1: "i1",
  I2: "i2",
  I3: "i3",
  I4: "i4",
  MEETINGS: "mtg",
  MEET_DUR: "mdur",
  FOCUS: "fcs",
  TEAM: "team",
  GROWTH: "gr",
  ATTR: "attr",
  LTV: "ltv",
  RATE: "rate",
  UNITS: "units",
} as const;

export function parseAiBusinessSearchParams(sp: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(AI_BUSINESS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export type PricingModel = "cost-plus" | "competitive" | "value";
export type PriorityMatrix = "urgent" | "important" | "both" | "neither";

export function parsePricingModel(raw: string): PricingModel {
  if (raw === "competitive" || raw === "value") return raw;
  return "cost-plus";
}

export function parsePriority(raw: string): PriorityMatrix {
  if (raw === "important" || raw === "both" || raw === "neither") return raw;
  return "urgent";
}
