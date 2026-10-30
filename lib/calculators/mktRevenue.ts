/** Revenue & profit marketing — marketing teaching estimates. */
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
export type MktRevenueSlug =
  | "mkt-cac-calculator"
  | "mkt-clv-ltv-calculator"
  | "mkt-ltv-cac-ratio-calculator"
  | "mkt-marketing-roi-calculator"
  | "mkt-gross-profit-from-campaign-calculator"
  | "mkt-revenue-per-visitor-calculator"
  | "mkt-average-order-value-calculator";

export const MKT_REVENUE_SLUGS: MktRevenueSlug[] = [
  "mkt-cac-calculator",
  "mkt-clv-ltv-calculator",
  "mkt-ltv-cac-ratio-calculator",
  "mkt-marketing-roi-calculator",
  "mkt-gross-profit-from-campaign-calculator",
  "mkt-revenue-per-visitor-calculator",
  "mkt-average-order-value-calculator",
];

export function computeMktRevenue(slug: MktRevenueSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-cac-calculator": {
      const spend = pos(input.spend, "Acquisition spend");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const cust = pos(input.customers, "New customers");
  if (typeof cust !== "number") return { ok: false, error: cust.error };
      return { ok: true, value: spend / cust, cost: spend / cust, note: "CAC = spend ÷ new customers." };
    }
    case "mkt-clv-ltv-calculator": {
      const aov = pos(input.aov, "AOV");
  if (typeof aov !== "number") return { ok: false, error: aov.error };
      const freq = pos(input.count, "Purchases / year");
  if (typeof freq !== "number") return { ok: false, error: freq.error };
      const years = pos(input.months, "Lifespan (years)");
  if (typeof years !== "number") return { ok: false, error: years.error };
      const margin = nonNeg(input.marginPct ?? 0, "Margin %");
  if (typeof margin !== "number") return { ok: false, error: margin.error };
      const ltv = aov * freq * years * (margin > 0 ? margin / 100 : 1);
      return { ok: true, value: ltv, revenue: ltv, note: margin > 0 ? "LTV ≈ AOV × frequency × years × margin%." : "LTV ≈ AOV × frequency × years." };
    }
    case "mkt-ltv-cac-ratio-calculator": {
      const ltv = pos(input.ltv, "LTV");
  if (typeof ltv !== "number") return { ok: false, error: ltv.error };
      const cac = pos(input.cac, "CAC");
  if (typeof cac !== "number") return { ok: false, error: cac.error };
      return { ok: true, value: ltv / cac, ratio: ltv / cac, note: "LTV:CAC = LTV ÷ CAC (healthy often ≥3)." };
    }
    case "mkt-marketing-roi-calculator": {
      const rev = pos(input.revenue, "Revenue");
  if (typeof rev !== "number") return { ok: false, error: rev.error };
      const spend = pos(input.spend, "Spend");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const roi = ((rev - spend) / spend) * 100;
      return { ok: true, value: roi, rate: roi, revenue: rev, spend, note: "ROI% = (revenue − spend) ÷ spend × 100." };
    }
    case "mkt-gross-profit-from-campaign-calculator": {
      const rev = pos(input.revenue, "Revenue");
  if (typeof rev !== "number") return { ok: false, error: rev.error };
      const spend = pos(input.spend, "Ad spend");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const cogs = nonNeg(input.amount ?? 0, "COGS / variable cost");
  if (typeof cogs !== "number") return { ok: false, error: cogs.error };
      const gp = rev - spend - cogs;
      return { ok: true, value: gp, revenue: rev, spend, note: "Gross profit ≈ revenue − ad spend − COGS." };
    }
    case "mkt-revenue-per-visitor-calculator": {
      const rev = pos(input.revenue, "Revenue");
  if (typeof rev !== "number") return { ok: false, error: rev.error };
      const vis = pos(input.visitors, "Visitors");
  if (typeof vis !== "number") return { ok: false, error: vis.error };
      return { ok: true, value: rev / vis, revenue: rev / vis, note: "RPV = revenue ÷ visitors." };
    }
    case "mkt-average-order-value-calculator": {
      const rev = pos(input.revenue, "Revenue");
  if (typeof rev !== "number") return { ok: false, error: rev.error };
      const orders = pos(input.orders, "Orders");
  if (typeof orders !== "number") return { ok: false, error: orders.error };
      return { ok: true, value: rev / orders, revenue: rev / orders, note: "AOV = revenue ÷ orders." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
