/** Affiliate & influencer marketing — marketing teaching estimates. */
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
export type MktAffiliateSlug =
  | "mkt-affiliate-commission-calculator"
  | "mkt-influencer-roi-calculator"
  | "mkt-cost-per-influencer-post-calculator"
  | "mkt-influencer-engagement-rate-calculator"
  | "mkt-affiliate-earnings-calculator"
  | "mkt-revenue-share-calculator";

export const MKT_AFFILIATE_SLUGS: MktAffiliateSlug[] = [
  "mkt-affiliate-commission-calculator",
  "mkt-influencer-roi-calculator",
  "mkt-cost-per-influencer-post-calculator",
  "mkt-influencer-engagement-rate-calculator",
  "mkt-affiliate-earnings-calculator",
  "mkt-revenue-share-calculator",
];

export function computeMktAffiliate(slug: MktAffiliateSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-affiliate-commission-calculator": {
      const sales = pos(input.sales, "Sale amount");
  if (typeof sales !== "number") return { ok: false, error: sales.error };
      const pct = pos(input.commissionPct, "Commission %");
  if (typeof pct !== "number") return { ok: false, error: pct.error };
      return { ok: true, value: sales * (pct / 100), cost: sales * (pct / 100), note: "Commission = sales × commission%." };
    }
    case "mkt-influencer-roi-calculator": {
      const rev = pos(input.revenue, "Attributed revenue");
  if (typeof rev !== "number") return { ok: false, error: rev.error };
      const spend = pos(input.spend, "Influencer cost");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const roi = ((rev - spend) / spend) * 100;
      return { ok: true, value: roi, rate: roi, note: "Influencer ROI% = (revenue − cost) ÷ cost × 100." };
    }
    case "mkt-cost-per-influencer-post-calculator": {
      const spend = pos(input.spend, "Total fee");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const posts = pos(input.posts, "Posts");
  if (typeof posts !== "number") return { ok: false, error: posts.error };
      return { ok: true, value: spend / posts, cost: spend / posts, note: "Cost per post = fee ÷ posts." };
    }
    case "mkt-influencer-engagement-rate-calculator": {
      const likes = nonNeg(input.likes ?? 0, "Likes");
  if (typeof likes !== "number") return { ok: false, error: likes.error };
      const comments = nonNeg(input.comments ?? 0, "Comments");
  if (typeof comments !== "number") return { ok: false, error: comments.error };
      const followers = pos(input.followers, "Followers");
  if (typeof followers !== "number") return { ok: false, error: followers.error };
      const eng = likes + comments;
      return { ok: true, value: (eng / followers) * 100, rate: (eng / followers) * 100, note: "Influencer ER% = (likes+comments) ÷ followers × 100." };
    }
    case "mkt-affiliate-earnings-calculator": {
      const sales = pos(input.sales, "Sales volume");
  if (typeof sales !== "number") return { ok: false, error: sales.error };
      const pct = pos(input.commissionPct, "Commission %");
  if (typeof pct !== "number") return { ok: false, error: pct.error };
      const bonus = nonNeg(input.amount ?? 0, "Flat bonus");
  if (typeof bonus !== "number") return { ok: false, error: bonus.error };
      const earn = sales * (pct / 100) + bonus;
      return { ok: true, value: earn, revenue: earn, note: "Earnings = sales × commission% + bonus." };
    }
    case "mkt-revenue-share-calculator": {
      const rev = pos(input.revenue, "Revenue");
  if (typeof rev !== "number") return { ok: false, error: rev.error };
      const pct = pos(input.pct, "Partner share %");
  if (typeof pct !== "number") return { ok: false, error: pct.error };
      return { ok: true, value: rev * (pct / 100), revenue: rev * (pct / 100), note: "Partner share = revenue × share%." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
