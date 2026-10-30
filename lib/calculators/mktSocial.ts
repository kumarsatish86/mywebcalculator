/** Social media marketing — marketing teaching estimates. */
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
export type MktSocialSlug =
  | "mkt-engagement-rate-calculator"
  | "mkt-instagram-engagement-rate-calculator"
  | "mkt-youtube-engagement-calculator"
  | "mkt-tiktok-engagement-calculator"
  | "mkt-follower-growth-rate-calculator"
  | "mkt-social-media-roi-calculator"
  | "mkt-cost-per-engagement-calculator";

export const MKT_SOCIAL_SLUGS: MktSocialSlug[] = [
  "mkt-engagement-rate-calculator",
  "mkt-instagram-engagement-rate-calculator",
  "mkt-youtube-engagement-calculator",
  "mkt-tiktok-engagement-calculator",
  "mkt-follower-growth-rate-calculator",
  "mkt-social-media-roi-calculator",
  "mkt-cost-per-engagement-calculator",
];

export function computeMktSocial(slug: MktSocialSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-engagement-rate-calculator":
    case "mkt-instagram-engagement-rate-calculator":
    case "mkt-tiktok-engagement-calculator": {
      const likes = nonNeg(input.likes ?? 0, "Likes");
  if (typeof likes !== "number") return { ok: false, error: likes.error };
      const comments = nonNeg(input.comments ?? 0, "Comments");
  if (typeof comments !== "number") return { ok: false, error: comments.error };
      const shares = nonNeg(input.shares ?? 0, "Shares");
  if (typeof shares !== "number") return { ok: false, error: shares.error };
      const followers = pos(input.followers, "Followers / reach");
  if (typeof followers !== "number") return { ok: false, error: followers.error };
      const eng = likes + comments + shares;
      const rate = (eng / followers) * 100;
      return { ok: true, value: rate, rate, count: eng, note: "Engagement rate% = (likes+comments+shares) ÷ followers × 100." };
    }
    case "mkt-youtube-engagement-calculator": {
      const likes = nonNeg(input.likes ?? 0, "Likes");
  if (typeof likes !== "number") return { ok: false, error: likes.error };
      const comments = nonNeg(input.comments ?? 0, "Comments");
  if (typeof comments !== "number") return { ok: false, error: comments.error };
      const views = pos(input.views, "Views");
  if (typeof views !== "number") return { ok: false, error: views.error };
      const eng = likes + comments;
      const rate = (eng / views) * 100;
      return { ok: true, value: rate, rate, count: eng, note: "YouTube engagement% ≈ (likes+comments) ÷ views × 100." };
    }
    case "mkt-follower-growth-rate-calculator": {
      const start = pos(input.startFollowers, "Starting followers");
  if (typeof start !== "number") return { ok: false, error: start.error };
      const end = nonNeg(input.endFollowers ?? 0, "Ending followers");
  if (typeof end !== "number") return { ok: false, error: end.error };
      const growth = ((end - start) / start) * 100;
      return { ok: true, value: growth, rate: growth, note: "Follower growth% = (end − start) ÷ start × 100." };
    }
    case "mkt-social-media-roi-calculator": {
      const rev = pos(input.revenue, "Attributed revenue");
  if (typeof rev !== "number") return { ok: false, error: rev.error };
      const spend = pos(input.spend, "Social spend");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const roi = ((rev - spend) / spend) * 100;
      return { ok: true, value: roi, rate: roi, revenue: rev, spend, note: "Social ROI% = (revenue − spend) ÷ spend × 100." };
    }
    case "mkt-cost-per-engagement-calculator": {
      const spend = pos(input.spend, "Spend");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const eng = pos(input.engagements, "Engagements");
  if (typeof eng !== "number") return { ok: false, error: eng.error };
      return { ok: true, value: spend / eng, cost: spend / eng, note: "CPE = spend ÷ engagements." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
