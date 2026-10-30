/** Advertising & paid marketing — marketing teaching estimates. */
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
export type MktAdsSlug =
  | "mkt-cpm-calculator"
  | "mkt-cpc-calculator"
  | "mkt-cpa-calculator"
  | "mkt-cpl-calculator"
  | "mkt-cpi-calculator"
  | "mkt-roas-calculator"
  | "mkt-ad-spend-efficiency-calculator"
  | "mkt-cost-per-conversion-calculator"
  | "mkt-conversion-value-calculator"
  | "mkt-break-even-cpc-calculator"
  | "mkt-ad-budget-calculator"
  | "mkt-campaign-budget-planner"
  | "mkt-daily-ad-budget-calculator"
  | "mkt-marketing-spend-allocation-calculator";

export const MKT_ADS_SLUGS: MktAdsSlug[] = [
  "mkt-cpm-calculator",
  "mkt-cpc-calculator",
  "mkt-cpa-calculator",
  "mkt-cpl-calculator",
  "mkt-cpi-calculator",
  "mkt-roas-calculator",
  "mkt-ad-spend-efficiency-calculator",
  "mkt-cost-per-conversion-calculator",
  "mkt-conversion-value-calculator",
  "mkt-break-even-cpc-calculator",
  "mkt-ad-budget-calculator",
  "mkt-campaign-budget-planner",
  "mkt-daily-ad-budget-calculator",
  "mkt-marketing-spend-allocation-calculator",
];

export function computeMktAds(slug: MktAdsSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-cpm-calculator": {
      const spend = pos(input.spend, "Spend");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const impr = pos(input.impressions, "Impressions");
  if (typeof impr !== "number") return { ok: false, error: impr.error };
      const cpm = spend / (impr / 1000);
      return { ok: true, value: cpm, cost: cpm, note: "CPM = spend ÷ (impressions ÷ 1000)." };
    }
    case "mkt-cpc-calculator": {
      const spend = pos(input.spend, "Spend");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const clicks = pos(input.clicks, "Clicks");
  if (typeof clicks !== "number") return { ok: false, error: clicks.error };
      return { ok: true, value: spend / clicks, cost: spend / clicks, note: "CPC = spend ÷ clicks." };
    }
    case "mkt-cpa-calculator":
    case "mkt-cost-per-conversion-calculator": {
      const spend = pos(input.spend, "Spend");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const conv = pos(input.conversions, "Conversions");
  if (typeof conv !== "number") return { ok: false, error: conv.error };
      return { ok: true, value: spend / conv, cost: spend / conv, note: "CPA = spend ÷ conversions." };
    }
    case "mkt-cpl-calculator": {
      const spend = pos(input.spend, "Spend");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const leads = pos(input.leads, "Leads");
  if (typeof leads !== "number") return { ok: false, error: leads.error };
      return { ok: true, value: spend / leads, cost: spend / leads, note: "CPL = spend ÷ leads." };
    }
    case "mkt-cpi-calculator": {
      const spend = pos(input.spend, "Spend");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const inst = pos(input.installs, "Installs");
  if (typeof inst !== "number") return { ok: false, error: inst.error };
      return { ok: true, value: spend / inst, cost: spend / inst, note: "CPI = spend ÷ installs." };
    }
    case "mkt-roas-calculator": {
      const rev = pos(input.revenue, "Revenue");
  if (typeof rev !== "number") return { ok: false, error: rev.error };
      const spend = pos(input.spend, "Spend");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      return { ok: true, value: rev / spend, ratio: rev / spend, revenue: rev, spend, note: "ROAS = revenue ÷ spend." };
    }
    case "mkt-ad-spend-efficiency-calculator": {
      const rev = pos(input.revenue, "Revenue");
  if (typeof rev !== "number") return { ok: false, error: rev.error };
      const spend = pos(input.spend, "Spend");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const roas = rev / spend;
      const roi = ((rev - spend) / spend) * 100;
      return { ok: true, value: roas, ratio: roas, rate: roi, note: "Efficiency: ROAS and ROI% from revenue and spend." };
    }
    case "mkt-conversion-value-calculator": {
      const rev = pos(input.revenue, "Revenue");
  if (typeof rev !== "number") return { ok: false, error: rev.error };
      const conv = pos(input.conversions, "Conversions");
  if (typeof conv !== "number") return { ok: false, error: conv.error };
      return { ok: true, value: rev / conv, revenue: rev / conv, note: "Conversion value = revenue ÷ conversions." };
    }
    case "mkt-break-even-cpc-calculator": {
      const aov = pos(input.aov, "AOV / order value");
  if (typeof aov !== "number") return { ok: false, error: aov.error };
      const margin = pos(input.marginPct, "Margin %");
  if (typeof margin !== "number") return { ok: false, error: margin.error };
      const cvr = pos(input.cvrPct, "CVR %");
  if (typeof cvr !== "number") return { ok: false, error: cvr.error };
      const be = (aov * (margin / 100) * (cvr / 100));
      return { ok: true, value: be, cost: be, note: "Break-even CPC ≈ AOV × margin% × CVR%." };
    }
    case "mkt-ad-budget-calculator": {
      const target = pos(input.conversions, "Target conversions");
  if (typeof target !== "number") return { ok: false, error: target.error };
      const cpa = pos(input.spend, "Target CPA");
  if (typeof cpa !== "number") return { ok: false, error: cpa.error };
      return { ok: true, value: target * cpa, spend: target * cpa, note: "Budget ≈ target conversions × CPA." };
    }
    case "mkt-campaign-budget-planner": {
      const daily = pos(input.budget, "Daily budget");
  if (typeof daily !== "number") return { ok: false, error: daily.error };
      const days = pos(input.days, "Campaign days");
  if (typeof days !== "number") return { ok: false, error: days.error };
      return { ok: true, value: daily * days, spend: daily * days, note: "Campaign budget = daily × days." };
    }
    case "mkt-daily-ad-budget-calculator": {
      const total = pos(input.budget, "Total budget");
  if (typeof total !== "number") return { ok: false, error: total.error };
      const days = pos(input.days, "Days");
  if (typeof days !== "number") return { ok: false, error: days.error };
      return { ok: true, value: total / days, spend: total / days, note: "Daily budget = total ÷ days." };
    }
    case "mkt-marketing-spend-allocation-calculator": {
      const total = pos(input.budget, "Total budget");
  if (typeof total !== "number") return { ok: false, error: total.error };
      const p1 = nonNeg(input.pct ?? 0, "Channel A %");
  if (typeof p1 !== "number") return { ok: false, error: p1.error };
      const p2 = nonNeg(input.pct2 ?? 0, "Channel B %");
  if (typeof p2 !== "number") return { ok: false, error: p2.error };
      const a = total * (p1 / 100);
      const b = total * (p2 / 100);
      const rest = total - a - b;
      return { ok: true, value: a, spend: total, count: rest, rate: p1, note: `Alloc A=${a.toFixed(2)}, B=${b.toFixed(2)}, rest=${rest.toFixed(2)}.` };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
