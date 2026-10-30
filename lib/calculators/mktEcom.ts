/** E-commerce marketing — marketing teaching estimates. */
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
export type MktEcomSlug =
  | "mkt-cart-abandonment-rate-calculator"
  | "mkt-checkout-conversion-rate-calculator"
  | "mkt-revenue-loss-calculator"
  | "mkt-discount-impact-calculator"
  | "mkt-profit-margin-ecommerce-calculator"
  | "mkt-upsell-revenue-calculator"
  | "mkt-customer-retention-rate-calculator";

export const MKT_ECOM_SLUGS: MktEcomSlug[] = [
  "mkt-cart-abandonment-rate-calculator",
  "mkt-checkout-conversion-rate-calculator",
  "mkt-revenue-loss-calculator",
  "mkt-discount-impact-calculator",
  "mkt-profit-margin-ecommerce-calculator",
  "mkt-upsell-revenue-calculator",
  "mkt-customer-retention-rate-calculator",
];

export function computeMktEcom(slug: MktEcomSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-cart-abandonment-rate-calculator": {
      const starts = pos(input.cartStarts, "Carts started");
  if (typeof starts !== "number") return { ok: false, error: starts.error };
      const orders = pos(input.orders, "Completed orders");
  if (typeof orders !== "number") return { ok: false, error: orders.error };
      const rate = ((starts - orders) / starts) * 100;
      return { ok: true, value: rate, rate, note: "Cart abandonment% = (starts − orders) ÷ starts × 100." };
    }
    case "mkt-checkout-conversion-rate-calculator": {
      const orders = pos(input.orders, "Orders");
  if (typeof orders !== "number") return { ok: false, error: orders.error };
      const checkouts = pos(input.checkouts, "Checkout starts");
  if (typeof checkouts !== "number") return { ok: false, error: checkouts.error };
      return { ok: true, value: (orders / checkouts) * 100, rate: (orders / checkouts) * 100, note: "Checkout CVR% = orders ÷ checkout starts × 100." };
    }
    case "mkt-revenue-loss-calculator": {
      const abandoned = pos(input.abandoned, "Abandoned carts");
  if (typeof abandoned !== "number") return { ok: false, error: abandoned.error };
      const aov = pos(input.aov, "AOV");
  if (typeof aov !== "number") return { ok: false, error: aov.error };
      return { ok: true, value: abandoned * aov, revenue: abandoned * aov, note: "Revenue at risk ≈ abandoned carts × AOV." };
    }
    case "mkt-discount-impact-calculator": {
      const aov = pos(input.aov, "Pre-discount AOV");
  if (typeof aov !== "number") return { ok: false, error: aov.error };
      const disc = pos(input.discountPct, "Discount %");
  if (typeof disc !== "number") return { ok: false, error: disc.error };
      const orders = pos(input.orders, "Orders");
  if (typeof orders !== "number") return { ok: false, error: orders.error };
      const after = aov * (1 - disc / 100);
      const impact = (aov - after) * orders;
      return { ok: true, value: impact, revenue: after * orders, cost: impact, note: "Discount impact ≈ (AOV − discounted AOV) × orders." };
    }
    case "mkt-profit-margin-ecommerce-calculator": {
      const rev = pos(input.revenue, "Revenue");
  if (typeof rev !== "number") return { ok: false, error: rev.error };
      const cogs = pos(input.amount, "COGS");
  if (typeof cogs !== "number") return { ok: false, error: cogs.error };
      const margin = ((rev - cogs) / rev) * 100;
      return { ok: true, value: margin, rate: margin, revenue: rev - cogs, note: "Gross margin% = (revenue − COGS) ÷ revenue × 100." };
    }
    case "mkt-upsell-revenue-calculator": {
      const orders = pos(input.orders, "Orders");
  if (typeof orders !== "number") return { ok: false, error: orders.error };
      const rate = pos(input.upsellRatePct, "Upsell rate %");
  if (typeof rate !== "number") return { ok: false, error: rate.error };
      const upsellAov = pos(input.upsellAov, "Upsell AOV");
  if (typeof upsellAov !== "number") return { ok: false, error: upsellAov.error };
      const rev = orders * (rate / 100) * upsellAov;
      return { ok: true, value: rev, revenue: rev, note: "Upsell revenue ≈ orders × upsell% × upsell AOV." };
    }
    case "mkt-customer-retention-rate-calculator": {
      const start = pos(input.startCustomers, "Customers at start");
  if (typeof start !== "number") return { ok: false, error: start.error };
      const end = nonNeg(input.endCustomers ?? 0, "Customers at end");
  if (typeof end !== "number") return { ok: false, error: end.error };
      const neu = nonNeg(input.newCustomers ?? 0, "New customers in period");
  if (typeof neu !== "number") return { ok: false, error: neu.error };
      const retained = end - neu;
      const rate = (retained / start) * 100;
      return { ok: true, value: rate, rate, count: retained, note: "Retention% = (end − new) ÷ start × 100." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
