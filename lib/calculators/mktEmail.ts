/** Email marketing — marketing teaching estimates. */
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
export type MktEmailSlug =
  | "mkt-email-open-rate-calculator"
  | "mkt-email-ctr-calculator"
  | "mkt-email-conversion-rate-calculator"
  | "mkt-email-roi-calculator"
  | "mkt-list-growth-rate-calculator"
  | "mkt-email-bounce-rate-calculator"
  | "mkt-unsubscribe-rate-calculator";

export const MKT_EMAIL_SLUGS: MktEmailSlug[] = [
  "mkt-email-open-rate-calculator",
  "mkt-email-ctr-calculator",
  "mkt-email-conversion-rate-calculator",
  "mkt-email-roi-calculator",
  "mkt-list-growth-rate-calculator",
  "mkt-email-bounce-rate-calculator",
  "mkt-unsubscribe-rate-calculator",
];

export function computeMktEmail(slug: MktEmailSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-email-open-rate-calculator": {
      const opens = pos(input.opens, "Opens");
  if (typeof opens !== "number") return { ok: false, error: opens.error };
      const sent = pos(input.sent, "Delivered / sent");
  if (typeof sent !== "number") return { ok: false, error: sent.error };
      return { ok: true, value: (opens / sent) * 100, rate: (opens / sent) * 100, note: "Open rate% = opens ÷ delivered × 100." };
    }
    case "mkt-email-ctr-calculator": {
      const clicks = pos(input.clicks, "Clicks");
  if (typeof clicks !== "number") return { ok: false, error: clicks.error };
      const sent = pos(input.sent, "Delivered / sent");
  if (typeof sent !== "number") return { ok: false, error: sent.error };
      return { ok: true, value: (clicks / sent) * 100, rate: (clicks / sent) * 100, note: "Email CTR% = clicks ÷ delivered × 100." };
    }
    case "mkt-email-conversion-rate-calculator": {
      const conv = pos(input.conversions, "Conversions");
  if (typeof conv !== "number") return { ok: false, error: conv.error };
      const clicks = pos(input.clicks, "Clicks");
  if (typeof clicks !== "number") return { ok: false, error: clicks.error };
      return { ok: true, value: (conv / clicks) * 100, rate: (conv / clicks) * 100, note: "Email CVR% = conversions ÷ clicks × 100." };
    }
    case "mkt-email-roi-calculator": {
      const rev = pos(input.revenue, "Revenue");
  if (typeof rev !== "number") return { ok: false, error: rev.error };
      const spend = pos(input.spend, "Email cost");
  if (typeof spend !== "number") return { ok: false, error: spend.error };
      const roi = ((rev - spend) / spend) * 100;
      return { ok: true, value: roi, rate: roi, revenue: rev, spend, note: "Email ROI% = (revenue − cost) ÷ cost × 100." };
    }
    case "mkt-list-growth-rate-calculator": {
      const start = pos(input.startFollowers, "Starting list size");
  if (typeof start !== "number") return { ok: false, error: start.error };
      const end = nonNeg(input.endFollowers ?? 0, "Ending list size");
  if (typeof end !== "number") return { ok: false, error: end.error };
      const days = pos(input.periodDays, "Period days");
  if (typeof days !== "number") return { ok: false, error: days.error };
      const growth = ((end - start) / start) * 100;
      return { ok: true, value: growth, rate: growth, note: "List growth% = (end − start) ÷ start × 100 over period." };
    }
    case "mkt-email-bounce-rate-calculator": {
      const bounces = pos(input.bounces, "Bounces");
  if (typeof bounces !== "number") return { ok: false, error: bounces.error };
      const sent = pos(input.sent, "Sent");
  if (typeof sent !== "number") return { ok: false, error: sent.error };
      return { ok: true, value: (bounces / sent) * 100, rate: (bounces / sent) * 100, note: "Bounce rate% = bounces ÷ sent × 100." };
    }
    case "mkt-unsubscribe-rate-calculator": {
      const unsubs = pos(input.unsubs, "Unsubscribes");
  if (typeof unsubs !== "number") return { ok: false, error: unsubs.error };
      const sent = pos(input.sent, "Delivered");
  if (typeof sent !== "number") return { ok: false, error: sent.error };
      return { ok: true, value: (unsubs / sent) * 100, rate: (unsubs / sent) * 100, note: "Unsubscribe rate% = unsubs ÷ delivered × 100." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
