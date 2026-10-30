/** High-intent & viral marketing — marketing teaching estimates. */
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
export type MktViralSlug =
  | "mkt-revenue-lost-without-seo-calculator"
  | "mkt-instagram-account-worth-calculator"
  | "mkt-youtube-channel-earnings-calculator"
  | "mkt-startup-growth-projection-calculator"
  | "mkt-ad-budget-vs-revenue-simulator";

export const MKT_VIRAL_SLUGS: MktViralSlug[] = [
  "mkt-revenue-lost-without-seo-calculator",
  "mkt-instagram-account-worth-calculator",
  "mkt-youtube-channel-earnings-calculator",
  "mkt-startup-growth-projection-calculator",
  "mkt-ad-budget-vs-revenue-simulator",
];

export function computeMktViral(slug: MktViralSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-revenue-lost-without-seo-calculator": {
      const vol = pos(input.searchVol, "Addressable monthly searches");
  if (typeof vol !== "number") return { ok: false, error: vol.error };
      const ctr = pos(input.ctrPct, "Attainable CTR %");
  if (typeof ctr !== "number") return { ok: false, error: ctr.error };
      const cvr = pos(input.cvrPct, "CVR %");
  if (typeof cvr !== "number") return { ok: false, error: cvr.error };
      const aov = pos(input.aov, "AOV");
  if (typeof aov !== "number") return { ok: false, error: aov.error };
      const lost = vol * (ctr / 100) * (cvr / 100) * aov;
      return { ok: true, value: lost, revenue: lost, note: "Opportunity ≈ searches × CTR% × CVR% × AOV." };
    }
    case "mkt-instagram-account-worth-calculator": {
      const followers = pos(input.followers, "Followers");
  if (typeof followers !== "number") return { ok: false, error: followers.error };
      const wpf = pos(input.worthPerFollower, "Worth per follower");
  if (typeof wpf !== "number") return { ok: false, error: wpf.error };
      return { ok: true, value: followers * wpf, revenue: followers * wpf, note: "Rough worth ≈ followers × $/follower (heuristic)." };
    }
    case "mkt-youtube-channel-earnings-calculator": {
      const views = pos(input.views, "Monthly views");
  if (typeof views !== "number") return { ok: false, error: views.error };
      const rpm = pos(input.rpm, "RPM ($ per 1000 views)");
  if (typeof rpm !== "number") return { ok: false, error: rpm.error };
      return { ok: true, value: (views / 1000) * rpm, revenue: (views / 1000) * rpm, note: "Earnings ≈ (views ÷ 1000) × RPM." };
    }
    case "mkt-startup-growth-projection-calculator": {
      const start = pos(input.amount, "Starting users / MRR");
  if (typeof start !== "number") return { ok: false, error: start.error };
      const g = pos(input.growthPct, "Monthly growth %");
  if (typeof g !== "number") return { ok: false, error: g.error };
      const months = pos(input.months, "Months");
  if (typeof months !== "number") return { ok: false, error: months.error };
      const end = start * Math.pow(1 + g / 100, months);
      return { ok: true, value: end, count: end, note: "Projected = start × (1 + g%)^months." };
    }
    case "mkt-ad-budget-vs-revenue-simulator": {
      const spend = pos(input.spend, "Ad budget");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const cpc = pos(input.cpc, "CPC");
  if (typeof cpc !== "number") return { ok: false, error: cpc.error };
      const cvr = pos(input.cvrPct, "CVR %");
  if (typeof cvr !== "number") return { ok: false, error: cvr.error };
      const aov = pos(input.aov, "AOV");
  if (typeof aov !== "number") return { ok: false, error: aov.error };
      const clicks = spend / cpc;
      const conv = clicks * (cvr / 100);
      const rev = conv * aov;
      return { ok: true, value: rev, revenue: rev, spend, count: conv, ratio: spend > 0 ? rev / spend : 0, note: "Sim: clicks=budget÷CPC → conv→ revenue; ROAS=rev÷spend." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
