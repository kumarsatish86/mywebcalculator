/** Content marketing — marketing teaching estimates. */
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
export type MktContentSlug =
  | "mkt-content-roi-calculator"
  | "mkt-blog-traffic-value-calculator"
  | "mkt-cost-per-content-piece-calculator"
  | "mkt-content-production-cost-calculator"
  | "mkt-lead-generation-from-content-calculator"
  | "mkt-content-engagement-rate-calculator";

export const MKT_CONTENT_SLUGS: MktContentSlug[] = [
  "mkt-content-roi-calculator",
  "mkt-blog-traffic-value-calculator",
  "mkt-cost-per-content-piece-calculator",
  "mkt-content-production-cost-calculator",
  "mkt-lead-generation-from-content-calculator",
  "mkt-content-engagement-rate-calculator",
];

export function computeMktContent(slug: MktContentSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-content-roi-calculator": {
      const rev = pos(input.revenue, "Attributed revenue");
  if (typeof rev !== "number") return { ok: false, error: rev.error };
      const spend = pos(input.spend, "Content cost");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const roi = ((rev - spend) / spend) * 100;
      return { ok: true, value: roi, rate: roi, note: "Content ROI% = (revenue − cost) ÷ cost × 100." };
    }
    case "mkt-blog-traffic-value-calculator": {
      const traffic = pos(input.traffic, "Visits");
  if (typeof traffic !== "number") return { ok: false, error: traffic.error };
      const cpc = pos(input.cpcEquiv, "Equivalent CPC");
  if (typeof cpc !== "number") return { ok: false, error: cpc.error };
      return { ok: true, value: traffic * cpc, revenue: traffic * cpc, note: "Blog traffic value ≈ visits × equivalent CPC." };
    }
    case "mkt-cost-per-content-piece-calculator": {
      const cost = pos(input.prodCost, "Total production cost");
  if (typeof cost !== "number") return { ok: false, error: cost.error };
      const pieces = pos(input.pieces, "Pieces");
  if (typeof pieces !== "number") return { ok: false, error: pieces.error };
      return { ok: true, value: cost / pieces, cost: cost / pieces, note: "Cost per piece = total cost ÷ pieces." };
    }
    case "mkt-content-production-cost-calculator": {
      const a = nonNeg(input.amount ?? 0, "Writing / creative");
  if (typeof a !== "number") return { ok: false, error: a.error };
      const b = nonNeg(input.amount2 ?? 0, "Design / edit");
  if (typeof b !== "number") return { ok: false, error: b.error };
      const c = nonNeg(input.amount3 ?? 0, "Promotion / other");
  if (typeof c !== "number") return { ok: false, error: c.error };
      const total = a + b + c;
      return { ok: true, value: total, cost: total, note: "Production cost = creative + design + other." };
    }
    case "mkt-lead-generation-from-content-calculator": {
      const traffic = pos(input.traffic, "Content visits");
  if (typeof traffic !== "number") return { ok: false, error: traffic.error };
      const cvr = pos(input.cvrPct, "Lead CVR %");
  if (typeof cvr !== "number") return { ok: false, error: cvr.error };
      const leads = traffic * (cvr / 100);
      return { ok: true, value: leads, count: leads, note: "Leads ≈ visits × lead CVR%." };
    }
    case "mkt-content-engagement-rate-calculator": {
      const eng = pos(input.engagements, "Engagements");
  if (typeof eng !== "number") return { ok: false, error: eng.error };
      const views = pos(input.views, "Views / reach");
  if (typeof views !== "number") return { ok: false, error: views.error };
      return { ok: true, value: (eng / views) * 100, rate: (eng / views) * 100, note: "Content engagement% = engagements ÷ views × 100." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
