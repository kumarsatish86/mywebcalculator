/** Conversion rate optimization — marketing teaching estimates. */
import { pos, nonNeg } from "./mktHelpers";

export type MktCommonInput = {
  spend?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  leads?: number;
  installs?: number;
  revenue?: number;
  visitors?: number;
  customers?: number;
  orders?: number;
  aov?: number;
  marginPct?: number;
  cpc?: number;
  cpm?: number;
  cvrPct?: number;
  days?: number;
  budget?: number;
  pct?: number;
  pct2?: number;
  amount?: number;
  amount2?: number;
  amount3?: number;
  rate?: number;
  count?: number;
  count2?: number;
  count3?: number;
  opens?: number;
  sent?: number;
  unsubs?: number;
  bounces?: number;
  engagements?: number;
  followers?: number;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  newFollowers?: number;
  startFollowers?: number;
  endFollowers?: number;
  periodDays?: number;
  searchVol?: number;
  ctrPct?: number;
  position?: number;
  difficulty?: number;
  traffic?: number;
  cpcEquiv?: number;
  cartStarts?: number;
  checkouts?: number;
  abandoned?: number;
  discountPct?: number;
  upsellRatePct?: number;
  upsellAov?: number;
  retained?: number;
  startCustomers?: number;
  endCustomers?: number;
  newCustomers?: number;
  churned?: number;
  pieces?: number;
  prodCost?: number;
  mql?: number;
  sql?: number;
  commissionPct?: number;
  sales?: number;
  posts?: number;
  mrr?: number;
  arr?: number;
  expansion?: number;
  ltv?: number;
  cac?: number;
  invites?: number;
  invitees?: number;
  kFactor?: number;
  cohortSize?: number;
  retainedCohort?: number;
  channelRevenue?: number;
  channelSpend?: number;
  weightA?: number;
  weightB?: number;
  weightC?: number;
  revA?: number;
  revB?: number;
  revC?: number;
  controlConv?: number;
  controlVisitors?: number;
  variantConv?: number;
  variantVisitors?: number;
  stage1?: number;
  stage2?: number;
  stage3?: number;
  stage4?: number;
  months?: number;
  growthPct?: number;
  rpm?: number;
  worthPerFollower?: number;
};

export type MktResult =
  | { ok: false; error: string }
  | {
      ok: true;
      value?: number;
      rate?: number;
      ratio?: number;
      cost?: number;
      revenue?: number;
      spend?: number;
      count?: number;
      note: string;
    };
export type MktCroSlug =
  | "mkt-conversion-rate-calculator"
  | "mkt-funnel-conversion-calculator"
  | "mkt-landing-page-conversion-calculator"
  | "mkt-sales-funnel-drop-off-calculator"
  | "mkt-ab-test-significance-calculator"
  | "mkt-click-to-conversion-rate-calculator";

export const MKT_CRO_SLUGS: MktCroSlug[] = [
  "mkt-conversion-rate-calculator",
  "mkt-funnel-conversion-calculator",
  "mkt-landing-page-conversion-calculator",
  "mkt-sales-funnel-drop-off-calculator",
  "mkt-ab-test-significance-calculator",
  "mkt-click-to-conversion-rate-calculator",
];

export function computeMktCro(slug: MktCroSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-conversion-rate-calculator":
    case "mkt-landing-page-conversion-calculator": {
      const conv = pos(input.conversions, "Conversions");
  if (typeof conv !== "number") return { ok: false, error: conv.error };
      const vis = pos(input.visitors, "Visitors");
  if (typeof vis !== "number") return { ok: false, error: vis.error };
      const rate = (conv / vis) * 100;
      return { ok: true, value: rate, rate, note: "CVR% = conversions ÷ visitors × 100." };
    }
    case "mkt-funnel-conversion-calculator": {
      const s1 = pos(input.stage1, "Stage 1");
  if (typeof s1 !== "number") return { ok: false, error: s1.error };
      const s4 = pos(input.stage4, "Final stage");
  if (typeof s4 !== "number") return { ok: false, error: s4.error };
      const rate = (s4 / s1) * 100;
      return { ok: true, value: rate, rate, count: s4, note: "Overall funnel CVR% = final ÷ top × 100." };
    }
    case "mkt-sales-funnel-drop-off-calculator": {
      const s1 = pos(input.stage1, "Stage A");
  if (typeof s1 !== "number") return { ok: false, error: s1.error };
      const s2 = pos(input.stage2, "Stage B");
  if (typeof s2 !== "number") return { ok: false, error: s2.error };
      const drop = ((s1 - s2) / s1) * 100;
      return { ok: true, value: drop, rate: drop, count: s1 - s2, note: "Drop-off% = (A − B) ÷ A × 100." };
    }
    case "mkt-ab-test-significance-calculator": {
      const cConv = pos(input.controlConv, "Control conversions");
  if (typeof cConv !== "number") return { ok: false, error: cConv.error };
      const cVis = pos(input.controlVisitors, "Control visitors");
  if (typeof cVis !== "number") return { ok: false, error: cVis.error };
      const vConv = pos(input.variantConv, "Variant conversions");
  if (typeof vConv !== "number") return { ok: false, error: vConv.error };
      const vVis = pos(input.variantVisitors, "Variant visitors");
  if (typeof vVis !== "number") return { ok: false, error: vVis.error };
      const p1 = cConv / cVis;
      const p2 = vConv / vVis;
      const p = (cConv + vConv) / (cVis + vVis);
      const se = Math.sqrt(p * (1 - p) * (1 / cVis + 1 / vVis));
      const z = se > 0 ? Math.abs(p2 - p1) / se : 0;
      const sig = z >= 1.96;
      return { ok: true, value: z, rate: (p2 - p1) * 100, ratio: z, note: sig ? `z≈${z.toFixed(2)} (≥1.96 → significant at ~95%).` : `z≈${z.toFixed(2)} (not significant at ~95%).` };
    }
    case "mkt-click-to-conversion-rate-calculator": {
      const conv = pos(input.conversions, "Conversions");
  if (typeof conv !== "number") return { ok: false, error: conv.error };
      const clicks = pos(input.clicks, "Clicks");
  if (typeof clicks !== "number") return { ok: false, error: clicks.error };
      const rate = (conv / clicks) * 100;
      return { ok: true, value: rate, rate, note: "Click→conversion% = conversions ÷ clicks × 100." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
