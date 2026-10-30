/** Lead generation — marketing teaching estimates. */
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
export type MktLeadsSlug =
  | "mkt-lead-conversion-rate-calculator"
  | "mkt-cost-per-lead-calculator"
  | "mkt-lead-value-calculator"
  | "mkt-sql-calculator"
  | "mkt-mql-calculator"
  | "mkt-lead-to-customer-rate-calculator";

export const MKT_LEADS_SLUGS: MktLeadsSlug[] = [
  "mkt-lead-conversion-rate-calculator",
  "mkt-cost-per-lead-calculator",
  "mkt-lead-value-calculator",
  "mkt-sql-calculator",
  "mkt-mql-calculator",
  "mkt-lead-to-customer-rate-calculator",
];

export function computeMktLeads(slug: MktLeadsSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-lead-conversion-rate-calculator": {
      const leads = pos(input.leads, "Leads");
  if (typeof leads !== "number") return { ok: false, error: leads.error };
      const vis = pos(input.visitors, "Visitors");
  if (typeof vis !== "number") return { ok: false, error: vis.error };
      return { ok: true, value: (leads / vis) * 100, rate: (leads / vis) * 100, note: "Lead CVR% = leads ÷ visitors × 100." };
    }
    case "mkt-cost-per-lead-calculator": {
      const spend = pos(input.spend, "Spend");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const leads = pos(input.leads, "Leads");
  if (typeof leads !== "number") return { ok: false, error: leads.error };
      return { ok: true, value: spend / leads, cost: spend / leads, note: "CPL = spend ÷ leads." };
    }
    case "mkt-lead-value-calculator": {
      const aov = pos(input.aov, "Customer value / AOV");
  if (typeof aov !== "number") return { ok: false, error: aov.error };
      const cvr = pos(input.cvrPct, "Lead→customer %");
  if (typeof cvr !== "number") return { ok: false, error: cvr.error };
      return { ok: true, value: aov * (cvr / 100), revenue: aov * (cvr / 100), note: "Lead value ≈ customer value × close rate%." };
    }
    case "mkt-sql-calculator": {
      const leads = pos(input.leads, "Total leads");
  if (typeof leads !== "number") return { ok: false, error: leads.error };
      const pct = pos(input.pct, "SQL rate %");
  if (typeof pct !== "number") return { ok: false, error: pct.error };
      const sql = leads * (pct / 100);
      return { ok: true, value: sql, count: sql, note: "SQLs ≈ leads × SQL rate%." };
    }
    case "mkt-mql-calculator": {
      const leads = pos(input.leads, "Total leads");
  if (typeof leads !== "number") return { ok: false, error: leads.error };
      const pct = pos(input.pct, "MQL rate %");
  if (typeof pct !== "number") return { ok: false, error: pct.error };
      const mql = leads * (pct / 100);
      return { ok: true, value: mql, count: mql, note: "MQLs ≈ leads × MQL rate%." };
    }
    case "mkt-lead-to-customer-rate-calculator": {
      const cust = pos(input.customers, "Customers");
  if (typeof cust !== "number") return { ok: false, error: cust.error };
      const leads = pos(input.leads, "Leads");
  if (typeof leads !== "number") return { ok: false, error: leads.error };
      return { ok: true, value: (cust / leads) * 100, rate: (cust / leads) * 100, note: "Lead→customer% = customers ÷ leads × 100." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
