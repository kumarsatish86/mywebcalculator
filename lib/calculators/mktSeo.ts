/** SEO marketing — marketing teaching estimates. */
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
export type MktSeoSlug =
  | "mkt-keyword-roi-calculator"
  | "mkt-organic-ctr-calculator"
  | "mkt-seo-traffic-value-calculator"
  | "mkt-keyword-difficulty-estimator"
  | "mkt-ranking-improvement-impact-calculator"
  | "mkt-backlink-value-calculator"
  | "mkt-seo-revenue-calculator";

export const MKT_SEO_SLUGS: MktSeoSlug[] = [
  "mkt-keyword-roi-calculator",
  "mkt-organic-ctr-calculator",
  "mkt-seo-traffic-value-calculator",
  "mkt-keyword-difficulty-estimator",
  "mkt-ranking-improvement-impact-calculator",
  "mkt-backlink-value-calculator",
  "mkt-seo-revenue-calculator",
];

export function computeMktSeo(slug: MktSeoSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-keyword-roi-calculator": {
      const rev = pos(input.revenue, "Attributed revenue");
  if (typeof rev !== "number") return { ok: false, error: rev.error };
      const spend = pos(input.spend, "SEO / content cost");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const roi = ((rev - spend) / spend) * 100;
      return { ok: true, value: roi, rate: roi, note: "Keyword ROI% = (revenue − cost) ÷ cost × 100." };
    }
    case "mkt-organic-ctr-calculator": {
      const clicks = pos(input.clicks, "Organic clicks");
  if (typeof clicks !== "number") return { ok: false, error: clicks.error };
      const impr = pos(input.impressions, "Impressions");
  if (typeof impr !== "number") return { ok: false, error: impr.error };
      return { ok: true, value: (clicks / impr) * 100, rate: (clicks / impr) * 100, note: "Organic CTR% = clicks ÷ impressions × 100." };
    }
    case "mkt-seo-traffic-value-calculator": {
      const traffic = pos(input.traffic, "Organic visits");
  if (typeof traffic !== "number") return { ok: false, error: traffic.error };
      const cpc = pos(input.cpcEquiv, "Equivalent CPC");
  if (typeof cpc !== "number") return { ok: false, error: cpc.error };
      return { ok: true, value: traffic * cpc, revenue: traffic * cpc, note: "Traffic value ≈ organic visits × equivalent CPC." };
    }
    case "mkt-keyword-difficulty-estimator": {
      const diff = nonNeg(input.difficulty ?? 0, "Competition score 0–100");
  if (typeof diff !== "number") return { ok: false, error: diff.error };
      const vol = nonNeg(input.searchVol ?? 0, "Search volume");
  if (typeof vol !== "number") return { ok: false, error: vol.error };
      const score = Math.min(100, Math.max(0, diff * 0.7 + Math.min(vol / 1000, 30)));
      return { ok: true, value: score, rate: score, note: "Basic difficulty blend of competition + volume (teaching heuristic)." };
    }
    case "mkt-ranking-improvement-impact-calculator": {
      const vol = pos(input.searchVol, "Monthly search volume");
  if (typeof vol !== "number") return { ok: false, error: vol.error };
      const ctrNow = nonNeg(input.ctrPct ?? 0, "Current CTR %");
  if (typeof ctrNow !== "number") return { ok: false, error: ctrNow.error };
      const ctrNew = pos(input.pct, "New CTR %");
  if (typeof ctrNew !== "number") return { ok: false, error: ctrNew.error };
      const extra = vol * ((ctrNew - ctrNow) / 100);
      return { ok: true, value: extra, count: extra, note: "Extra visits ≈ volume × (new CTR% − current CTR%)." };
    }
    case "mkt-backlink-value-calculator": {
      const links = pos(input.count, "Referring links");
  if (typeof links !== "number") return { ok: false, error: links.error };
      const val = pos(input.amount, "Value per link");
  if (typeof val !== "number") return { ok: false, error: val.error };
      return { ok: true, value: links * val, revenue: links * val, note: "Backlink value ≈ links × value/link (proxy)." };
    }
    case "mkt-seo-revenue-calculator": {
      const traffic = pos(input.traffic, "Organic visits");
  if (typeof traffic !== "number") return { ok: false, error: traffic.error };
      const cvr = pos(input.cvrPct, "CVR %");
  if (typeof cvr !== "number") return { ok: false, error: cvr.error };
      const aov = pos(input.aov, "AOV");
  if (typeof aov !== "number") return { ok: false, error: aov.error };
      const rev = traffic * (cvr / 100) * aov;
      return { ok: true, value: rev, revenue: rev, note: "SEO revenue ≈ traffic × CVR% × AOV." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
