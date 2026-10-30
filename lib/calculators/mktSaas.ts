/** SaaS & growth marketing — marketing teaching estimates. */
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
export type MktSaasSlug =
  | "mkt-mrr-calculator"
  | "mkt-arr-calculator"
  | "mkt-churn-rate-calculator"
  | "mkt-customer-retention-calculator"
  | "mkt-saas-growth-rate-calculator"
  | "mkt-payback-period-calculator"
  | "mkt-expansion-revenue-calculator";

export const MKT_SAAS_SLUGS: MktSaasSlug[] = [
  "mkt-mrr-calculator",
  "mkt-arr-calculator",
  "mkt-churn-rate-calculator",
  "mkt-customer-retention-calculator",
  "mkt-saas-growth-rate-calculator",
  "mkt-payback-period-calculator",
  "mkt-expansion-revenue-calculator",
];

export function computeMktSaas(slug: MktSaasSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-mrr-calculator": {
      const cust = pos(input.customers, "Paying customers");
  if (typeof cust !== "number") return { ok: false, error: cust.error };
      const aov = pos(input.aov, "ARPU / monthly price");
  if (typeof aov !== "number") return { ok: false, error: aov.error };
      return { ok: true, value: cust * aov, revenue: cust * aov, note: "MRR ≈ customers × ARPU." };
    }
    case "mkt-arr-calculator": {
      const mrr = pos(input.mrr, "MRR");
  if (typeof mrr !== "number") return { ok: false, error: mrr.error };
      return { ok: true, value: mrr * 12, revenue: mrr * 12, note: "ARR = MRR × 12." };
    }
    case "mkt-churn-rate-calculator": {
      const churned = pos(input.churned, "Churned customers");
  if (typeof churned !== "number") return { ok: false, error: churned.error };
      const start = pos(input.startCustomers, "Customers at start");
  if (typeof start !== "number") return { ok: false, error: start.error };
      return { ok: true, value: (churned / start) * 100, rate: (churned / start) * 100, note: "Churn% = churned ÷ starting customers × 100." };
    }
    case "mkt-customer-retention-calculator": {
      const churnPct = pos(input.pct, "Churn %");
  if (typeof churnPct !== "number") return { ok: false, error: churnPct.error };
      const ret = 100 - churnPct;
      return { ok: true, value: ret, rate: ret, note: "Retention% ≈ 100 − churn%." };
    }
    case "mkt-saas-growth-rate-calculator": {
      const start = pos(input.amount, "Starting MRR");
  if (typeof start !== "number") return { ok: false, error: start.error };
      const end = pos(input.amount2, "Ending MRR");
  if (typeof end !== "number") return { ok: false, error: end.error };
      const g = ((end - start) / start) * 100;
      return { ok: true, value: g, rate: g, note: "Growth% = (end − start) ÷ start × 100." };
    }
    case "mkt-payback-period-calculator": {
      const cac = pos(input.cac, "CAC");
  if (typeof cac !== "number") return { ok: false, error: cac.error };
      const arpu = pos(input.aov, "Monthly gross margin $ / ARPU");
  if (typeof arpu !== "number") return { ok: false, error: arpu.error };
      return { ok: true, value: cac / arpu, count: cac / arpu, note: "Payback months ≈ CAC ÷ monthly contribution." };
    }
    case "mkt-expansion-revenue-calculator": {
      const exp = nonNeg(input.expansion ?? 0, "Expansion / upsell MRR");
  if (typeof exp !== "number") return { ok: false, error: exp.error };
      const base = pos(input.mrr, "Base MRR");
  if (typeof base !== "number") return { ok: false, error: base.error };
      const rate = (exp / base) * 100;
      return { ok: true, value: exp, rate, revenue: exp, note: "Expansion revenue and % of base MRR." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
