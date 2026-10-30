/** Advanced growth & analytics — marketing teaching estimates. */
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
export type MktAnalyticsSlug =
  | "mkt-virality-coefficient-calculator"
  | "mkt-customer-growth-rate-calculator"
  | "mkt-mer-calculator"
  | "mkt-attribution-model-calculator"
  | "mkt-cohort-retention-calculator"
  | "mkt-traffic-source-roi-calculator";

export const MKT_ANALYTICS_SLUGS: MktAnalyticsSlug[] = [
  "mkt-virality-coefficient-calculator",
  "mkt-customer-growth-rate-calculator",
  "mkt-mer-calculator",
  "mkt-attribution-model-calculator",
  "mkt-cohort-retention-calculator",
  "mkt-traffic-source-roi-calculator",
];

export function computeMktAnalytics(slug: MktAnalyticsSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-virality-coefficient-calculator": {
      const invites = pos(input.invites, "Invites per user");
  if (typeof invites !== "number") return { ok: false, error: invites.error };
      const cvr = pos(input.cvrPct, "Invite conversion %");
  if (typeof cvr !== "number") return { ok: false, error: cvr.error };
      const k = invites * (cvr / 100);
      return { ok: true, value: k, ratio: k, note: "k-factor ≈ invites/user × conversion%." };
    }
    case "mkt-customer-growth-rate-calculator": {
      const start = pos(input.startCustomers, "Start customers");
  if (typeof start !== "number") return { ok: false, error: start.error };
      const end = pos(input.endCustomers, "End customers");
  if (typeof end !== "number") return { ok: false, error: end.error };
      const g = ((end - start) / start) * 100;
      return { ok: true, value: g, rate: g, note: "Customer growth% = (end − start) ÷ start × 100." };
    }
    case "mkt-mer-calculator": {
      const rev = pos(input.revenue, "Total revenue");
  if (typeof rev !== "number") return { ok: false, error: rev.error };
      const spend = pos(input.spend, "Total marketing spend");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      return { ok: true, value: rev / spend, ratio: rev / spend, note: "MER = total revenue ÷ total marketing spend." };
    }
    case "mkt-attribution-model-calculator": {
      const wa = nonNeg(input.weightA ?? 0, "Weight channel A");
  if (typeof wa !== "number") return { ok: false, error: wa.error };
      const wb = nonNeg(input.weightB ?? 0, "Weight channel B");
  if (typeof wb !== "number") return { ok: false, error: wb.error };
      const wc = nonNeg(input.weightC ?? 0, "Weight channel C");
  if (typeof wc !== "number") return { ok: false, error: wc.error };
      const rev = pos(input.revenue, "Conversion revenue");
  if (typeof rev !== "number") return { ok: false, error: rev.error };
      const wsum = wa + wb + wc;
      if (wsum <= 0) return { ok: false, error: "Weights must sum to > 0." };
      const a = rev * (wa / wsum);
      return { ok: true, value: a, revenue: a, rate: (wa / wsum) * 100, note: `Attributed A=${a.toFixed(2)} (weight share).` };
    }
    case "mkt-cohort-retention-calculator": {
      const size = pos(input.cohortSize, "Cohort size");
  if (typeof size !== "number") return { ok: false, error: size.error };
      const ret = pos(input.retainedCohort, "Retained");
  if (typeof ret !== "number") return { ok: false, error: ret.error };
      return { ok: true, value: (ret / size) * 100, rate: (ret / size) * 100, note: "Cohort retention% = retained ÷ cohort size × 100." };
    }
    case "mkt-traffic-source-roi-calculator": {
      const rev = pos(input.channelRevenue, "Channel revenue");
  if (typeof rev !== "number") return { ok: false, error: rev.error };
      const spend = pos(input.channelSpend, "Channel spend");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const roi = ((rev - spend) / spend) * 100;
      return { ok: true, value: roi, rate: roi, note: "Channel ROI% = (revenue − spend) ÷ spend × 100." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
