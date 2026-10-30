/**
 * One-shot generator for Business → Marketing calculator family.
 * Run: node scripts/gen-mkt-calculators.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

function write(rel, contents) {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, contents.replace(/\r?\n/g, "\n"), "utf8");
  console.log("wrote", rel);
}

// ─── helpers ───────────────────────────────────────────────────────────────
write(
  "lib/calculators/mktHelpers.ts",
  `/** Shared marketing calculator helpers — teaching estimates. */

export const MKT_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  L: "l",
  W: "w",
  H: "h",
  D: "d",
  N: "n",
  P: "p",
  Q: "q",
  M: "m",
  V: "v",
  S: "s",
} as const;

export function parseMktSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(MKT_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function pos(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: \`\${label} must be positive.\` };
  return n;
}

export function nonNeg(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n < 0) return { error: \`\${label} must be ≥ 0.\` };
  return n;
}
`,
);

// ─── shared result shape used by all engines ───────────────────────────────
const RESULT_TYPE = `export type MktResult =
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
    };`;

const INPUT_TYPE = `export type MktCommonInput = {
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
};`;

function engineHeader(title) {
  return `/** ${title} — marketing teaching estimates. */
import { pos, nonNeg } from "./mktHelpers";

${INPUT_TYPE}

${RESULT_TYPE}
`;
}

function fail(label) {
  return `return { ok: false, error: ${JSON.stringify(label)} };`;
}

// Helper snippets inside engines
const P = (varName, field, label) =>
  `const ${varName} = pos(input.${field}, ${JSON.stringify(label)});\n  if (typeof ${varName} !== "number") return { ok: false, error: ${varName}.error };`;
const N = (varName, field, label) =>
  `const ${varName} = nonNeg(input.${field} ?? 0, ${JSON.stringify(label)});\n  if (typeof ${varName} !== "number") return { ok: false, error: ${varName}.error };`;

// ─── ADS ───────────────────────────────────────────────────────────────────
const ADS_SLUGS = [
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

write(
  "lib/calculators/mktAds.ts",
  engineHeader("Advertising & paid marketing") +
    `export type MktAdsSlug =\n${ADS_SLUGS.map((s) => `  | "${s}"`).join("\n")};\n\n` +
    `export const MKT_ADS_SLUGS: MktAdsSlug[] = [\n${ADS_SLUGS.map((s) => `  "${s}",`).join("\n")}\n];\n\n` +
    `export function computeMktAds(slug: MktAdsSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-cpm-calculator": {
      ${P("spend", "spend", "Spend")}
      ${P("impr", "impressions", "Impressions")}
      const cpm = spend / (impr / 1000);
      return { ok: true, value: cpm, cost: cpm, note: "CPM = spend ÷ (impressions ÷ 1000)." };
    }
    case "mkt-cpc-calculator": {
      ${P("spend", "spend", "Spend")}
      ${P("clicks", "clicks", "Clicks")}
      return { ok: true, value: spend / clicks, cost: spend / clicks, note: "CPC = spend ÷ clicks." };
    }
    case "mkt-cpa-calculator":
    case "mkt-cost-per-conversion-calculator": {
      ${P("spend", "spend", "Spend")}
      ${P("conv", "conversions", "Conversions")}
      return { ok: true, value: spend / conv, cost: spend / conv, note: "CPA = spend ÷ conversions." };
    }
    case "mkt-cpl-calculator": {
      ${P("spend", "spend", "Spend")}
      ${P("leads", "leads", "Leads")}
      return { ok: true, value: spend / leads, cost: spend / leads, note: "CPL = spend ÷ leads." };
    }
    case "mkt-cpi-calculator": {
      ${P("spend", "spend", "Spend")}
      ${P("inst", "installs", "Installs")}
      return { ok: true, value: spend / inst, cost: spend / inst, note: "CPI = spend ÷ installs." };
    }
    case "mkt-roas-calculator": {
      ${P("rev", "revenue", "Revenue")}
      ${P("spend", "spend", "Spend")}
      return { ok: true, value: rev / spend, ratio: rev / spend, revenue: rev, spend, note: "ROAS = revenue ÷ spend." };
    }
    case "mkt-ad-spend-efficiency-calculator": {
      ${P("rev", "revenue", "Revenue")}
      ${P("spend", "spend", "Spend")}
      const roas = rev / spend;
      const roi = ((rev - spend) / spend) * 100;
      return { ok: true, value: roas, ratio: roas, rate: roi, note: "Efficiency: ROAS and ROI% from revenue and spend." };
    }
    case "mkt-conversion-value-calculator": {
      ${P("rev", "revenue", "Revenue")}
      ${P("conv", "conversions", "Conversions")}
      return { ok: true, value: rev / conv, revenue: rev / conv, note: "Conversion value = revenue ÷ conversions." };
    }
    case "mkt-break-even-cpc-calculator": {
      ${P("aov", "aov", "AOV / order value")}
      ${P("margin", "marginPct", "Margin %")}
      ${P("cvr", "cvrPct", "CVR %")}
      const be = (aov * (margin / 100) * (cvr / 100));
      return { ok: true, value: be, cost: be, note: "Break-even CPC ≈ AOV × margin% × CVR%." };
    }
    case "mkt-ad-budget-calculator": {
      ${P("target", "conversions", "Target conversions")}
      ${P("cpa", "spend", "Target CPA")}
      return { ok: true, value: target * cpa, spend: target * cpa, note: "Budget ≈ target conversions × CPA." };
    }
    case "mkt-campaign-budget-planner": {
      ${P("daily", "budget", "Daily budget")}
      ${P("days", "days", "Campaign days")}
      return { ok: true, value: daily * days, spend: daily * days, note: "Campaign budget = daily × days." };
    }
    case "mkt-daily-ad-budget-calculator": {
      ${P("total", "budget", "Total budget")}
      ${P("days", "days", "Days")}
      return { ok: true, value: total / days, spend: total / days, note: "Daily budget = total ÷ days." };
    }
    case "mkt-marketing-spend-allocation-calculator": {
      ${P("total", "budget", "Total budget")}
      ${N("p1", "pct", "Channel A %")}
      ${N("p2", "pct2", "Channel B %")}
      const a = total * (p1 / 100);
      const b = total * (p2 / 100);
      const rest = total - a - b;
      return { ok: true, value: a, spend: total, count: rest, rate: p1, note: \`Alloc A=\${a.toFixed(2)}, B=\${b.toFixed(2)}, rest=\${rest.toFixed(2)}.\` };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
`,
);

// ─── CRO ───────────────────────────────────────────────────────────────────
const CRO_SLUGS = [
  "mkt-conversion-rate-calculator",
  "mkt-funnel-conversion-calculator",
  "mkt-landing-page-conversion-calculator",
  "mkt-sales-funnel-drop-off-calculator",
  "mkt-ab-test-significance-calculator",
  "mkt-click-to-conversion-rate-calculator",
];

write(
  "lib/calculators/mktCro.ts",
  engineHeader("Conversion rate optimization") +
    `export type MktCroSlug =\n${CRO_SLUGS.map((s) => `  | "${s}"`).join("\n")};\n\n` +
    `export const MKT_CRO_SLUGS: MktCroSlug[] = [\n${CRO_SLUGS.map((s) => `  "${s}",`).join("\n")}\n];\n\n` +
    `export function computeMktCro(slug: MktCroSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-conversion-rate-calculator":
    case "mkt-landing-page-conversion-calculator": {
      ${P("conv", "conversions", "Conversions")}
      ${P("vis", "visitors", "Visitors")}
      const rate = (conv / vis) * 100;
      return { ok: true, value: rate, rate, note: "CVR% = conversions ÷ visitors × 100." };
    }
    case "mkt-funnel-conversion-calculator": {
      ${P("s1", "stage1", "Stage 1")}
      ${P("s4", "stage4", "Final stage")}
      const rate = (s4 / s1) * 100;
      return { ok: true, value: rate, rate, count: s4, note: "Overall funnel CVR% = final ÷ top × 100." };
    }
    case "mkt-sales-funnel-drop-off-calculator": {
      ${P("s1", "stage1", "Stage A")}
      ${P("s2", "stage2", "Stage B")}
      const drop = ((s1 - s2) / s1) * 100;
      return { ok: true, value: drop, rate: drop, count: s1 - s2, note: "Drop-off% = (A − B) ÷ A × 100." };
    }
    case "mkt-ab-test-significance-calculator": {
      ${P("cConv", "controlConv", "Control conversions")}
      ${P("cVis", "controlVisitors", "Control visitors")}
      ${P("vConv", "variantConv", "Variant conversions")}
      ${P("vVis", "variantVisitors", "Variant visitors")}
      const p1 = cConv / cVis;
      const p2 = vConv / vVis;
      const p = (cConv + vConv) / (cVis + vVis);
      const se = Math.sqrt(p * (1 - p) * (1 / cVis + 1 / vVis));
      const z = se > 0 ? Math.abs(p2 - p1) / se : 0;
      const sig = z >= 1.96;
      return { ok: true, value: z, rate: (p2 - p1) * 100, ratio: z, note: sig ? \`z≈\${z.toFixed(2)} (≥1.96 → significant at ~95%).\` : \`z≈\${z.toFixed(2)} (not significant at ~95%).\` };
    }
    case "mkt-click-to-conversion-rate-calculator": {
      ${P("conv", "conversions", "Conversions")}
      ${P("clicks", "clicks", "Clicks")}
      const rate = (conv / clicks) * 100;
      return { ok: true, value: rate, rate, note: "Click→conversion% = conversions ÷ clicks × 100." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
`,
);

// ─── REVENUE ───────────────────────────────────────────────────────────────
const REV_SLUGS = [
  "mkt-cac-calculator",
  "mkt-clv-ltv-calculator",
  "mkt-ltv-cac-ratio-calculator",
  "mkt-marketing-roi-calculator",
  "mkt-gross-profit-from-campaign-calculator",
  "mkt-revenue-per-visitor-calculator",
  "mkt-average-order-value-calculator",
];

write(
  "lib/calculators/mktRevenue.ts",
  engineHeader("Revenue & profit marketing") +
    `export type MktRevenueSlug =\n${REV_SLUGS.map((s) => `  | "${s}"`).join("\n")};\n\n` +
    `export const MKT_REVENUE_SLUGS: MktRevenueSlug[] = [\n${REV_SLUGS.map((s) => `  "${s}",`).join("\n")}\n];\n\n` +
    `export function computeMktRevenue(slug: MktRevenueSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-cac-calculator": {
      ${P("spend", "spend", "Acquisition spend")}
      ${P("cust", "customers", "New customers")}
      return { ok: true, value: spend / cust, cost: spend / cust, note: "CAC = spend ÷ new customers." };
    }
    case "mkt-clv-ltv-calculator": {
      ${P("aov", "aov", "AOV")}
      ${P("freq", "count", "Purchases / year")}
      ${P("years", "months", "Lifespan (years)")}
      ${N("margin", "marginPct", "Margin %")}
      const ltv = aov * freq * years * (margin > 0 ? margin / 100 : 1);
      return { ok: true, value: ltv, revenue: ltv, note: margin > 0 ? "LTV ≈ AOV × frequency × years × margin%." : "LTV ≈ AOV × frequency × years." };
    }
    case "mkt-ltv-cac-ratio-calculator": {
      ${P("ltv", "ltv", "LTV")}
      ${P("cac", "cac", "CAC")}
      return { ok: true, value: ltv / cac, ratio: ltv / cac, note: "LTV:CAC = LTV ÷ CAC (healthy often ≥3)." };
    }
    case "mkt-marketing-roi-calculator": {
      ${P("rev", "revenue", "Revenue")}
      ${P("spend", "spend", "Spend")}
      const roi = ((rev - spend) / spend) * 100;
      return { ok: true, value: roi, rate: roi, revenue: rev, spend, note: "ROI% = (revenue − spend) ÷ spend × 100." };
    }
    case "mkt-gross-profit-from-campaign-calculator": {
      ${P("rev", "revenue", "Revenue")}
      ${P("spend", "spend", "Ad spend")}
      ${N("cogs", "amount", "COGS / variable cost")}
      const gp = rev - spend - cogs;
      return { ok: true, value: gp, revenue: rev, spend, note: "Gross profit ≈ revenue − ad spend − COGS." };
    }
    case "mkt-revenue-per-visitor-calculator": {
      ${P("rev", "revenue", "Revenue")}
      ${P("vis", "visitors", "Visitors")}
      return { ok: true, value: rev / vis, revenue: rev / vis, note: "RPV = revenue ÷ visitors." };
    }
    case "mkt-average-order-value-calculator": {
      ${P("rev", "revenue", "Revenue")}
      ${P("orders", "orders", "Orders")}
      return { ok: true, value: rev / orders, revenue: rev / orders, note: "AOV = revenue ÷ orders." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
`,
);

// ─── EMAIL ─────────────────────────────────────────────────────────────────
const EMAIL_SLUGS = [
  "mkt-email-open-rate-calculator",
  "mkt-email-ctr-calculator",
  "mkt-email-conversion-rate-calculator",
  "mkt-email-roi-calculator",
  "mkt-list-growth-rate-calculator",
  "mkt-email-bounce-rate-calculator",
  "mkt-unsubscribe-rate-calculator",
];

write(
  "lib/calculators/mktEmail.ts",
  engineHeader("Email marketing") +
    `export type MktEmailSlug =\n${EMAIL_SLUGS.map((s) => `  | "${s}"`).join("\n")};\n\n` +
    `export const MKT_EMAIL_SLUGS: MktEmailSlug[] = [\n${EMAIL_SLUGS.map((s) => `  "${s}",`).join("\n")}\n];\n\n` +
    `export function computeMktEmail(slug: MktEmailSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-email-open-rate-calculator": {
      ${P("opens", "opens", "Opens")}
      ${P("sent", "sent", "Delivered / sent")}
      return { ok: true, value: (opens / sent) * 100, rate: (opens / sent) * 100, note: "Open rate% = opens ÷ delivered × 100." };
    }
    case "mkt-email-ctr-calculator": {
      ${P("clicks", "clicks", "Clicks")}
      ${P("sent", "sent", "Delivered / sent")}
      return { ok: true, value: (clicks / sent) * 100, rate: (clicks / sent) * 100, note: "Email CTR% = clicks ÷ delivered × 100." };
    }
    case "mkt-email-conversion-rate-calculator": {
      ${P("conv", "conversions", "Conversions")}
      ${P("clicks", "clicks", "Clicks")}
      return { ok: true, value: (conv / clicks) * 100, rate: (conv / clicks) * 100, note: "Email CVR% = conversions ÷ clicks × 100." };
    }
    case "mkt-email-roi-calculator": {
      ${P("rev", "revenue", "Revenue")}
      ${P("spend", "spend", "Email cost")}
      const roi = ((rev - spend) / spend) * 100;
      return { ok: true, value: roi, rate: roi, revenue: rev, spend, note: "Email ROI% = (revenue − cost) ÷ cost × 100." };
    }
    case "mkt-list-growth-rate-calculator": {
      ${P("start", "startFollowers", "Starting list size")}
      ${N("end", "endFollowers", "Ending list size")}
      ${P("days", "periodDays", "Period days")}
      const growth = ((end - start) / start) * 100;
      return { ok: true, value: growth, rate: growth, note: "List growth% = (end − start) ÷ start × 100 over period." };
    }
    case "mkt-email-bounce-rate-calculator": {
      ${P("bounces", "bounces", "Bounces")}
      ${P("sent", "sent", "Sent")}
      return { ok: true, value: (bounces / sent) * 100, rate: (bounces / sent) * 100, note: "Bounce rate% = bounces ÷ sent × 100." };
    }
    case "mkt-unsubscribe-rate-calculator": {
      ${P("unsubs", "unsubs", "Unsubscribes")}
      ${P("sent", "sent", "Delivered")}
      return { ok: true, value: (unsubs / sent) * 100, rate: (unsubs / sent) * 100, note: "Unsubscribe rate% = unsubs ÷ delivered × 100." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
`,
);

// ─── SOCIAL ────────────────────────────────────────────────────────────────
const SOCIAL_SLUGS = [
  "mkt-engagement-rate-calculator",
  "mkt-instagram-engagement-rate-calculator",
  "mkt-youtube-engagement-calculator",
  "mkt-tiktok-engagement-calculator",
  "mkt-follower-growth-rate-calculator",
  "mkt-social-media-roi-calculator",
  "mkt-cost-per-engagement-calculator",
];

write(
  "lib/calculators/mktSocial.ts",
  engineHeader("Social media marketing") +
    `export type MktSocialSlug =\n${SOCIAL_SLUGS.map((s) => `  | "${s}"`).join("\n")};\n\n` +
    `export const MKT_SOCIAL_SLUGS: MktSocialSlug[] = [\n${SOCIAL_SLUGS.map((s) => `  "${s}",`).join("\n")}\n];\n\n` +
    `export function computeMktSocial(slug: MktSocialSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-engagement-rate-calculator":
    case "mkt-instagram-engagement-rate-calculator":
    case "mkt-tiktok-engagement-calculator": {
      ${N("likes", "likes", "Likes")}
      ${N("comments", "comments", "Comments")}
      ${N("shares", "shares", "Shares")}
      ${P("followers", "followers", "Followers / reach")}
      const eng = likes + comments + shares;
      const rate = (eng / followers) * 100;
      return { ok: true, value: rate, rate, count: eng, note: "Engagement rate% = (likes+comments+shares) ÷ followers × 100." };
    }
    case "mkt-youtube-engagement-calculator": {
      ${N("likes", "likes", "Likes")}
      ${N("comments", "comments", "Comments")}
      ${P("views", "views", "Views")}
      const eng = likes + comments;
      const rate = (eng / views) * 100;
      return { ok: true, value: rate, rate, count: eng, note: "YouTube engagement% ≈ (likes+comments) ÷ views × 100." };
    }
    case "mkt-follower-growth-rate-calculator": {
      ${P("start", "startFollowers", "Starting followers")}
      ${N("end", "endFollowers", "Ending followers")}
      const growth = ((end - start) / start) * 100;
      return { ok: true, value: growth, rate: growth, note: "Follower growth% = (end − start) ÷ start × 100." };
    }
    case "mkt-social-media-roi-calculator": {
      ${P("rev", "revenue", "Attributed revenue")}
      ${P("spend", "spend", "Social spend")}
      const roi = ((rev - spend) / spend) * 100;
      return { ok: true, value: roi, rate: roi, revenue: rev, spend, note: "Social ROI% = (revenue − spend) ÷ spend × 100." };
    }
    case "mkt-cost-per-engagement-calculator": {
      ${P("spend", "spend", "Spend")}
      ${P("eng", "engagements", "Engagements")}
      return { ok: true, value: spend / eng, cost: spend / eng, note: "CPE = spend ÷ engagements." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
`,
);

// ─── SEO ───────────────────────────────────────────────────────────────────
const SEO_SLUGS = [
  "mkt-keyword-roi-calculator",
  "mkt-organic-ctr-calculator",
  "mkt-seo-traffic-value-calculator",
  "mkt-keyword-difficulty-estimator",
  "mkt-ranking-improvement-impact-calculator",
  "mkt-backlink-value-calculator",
  "mkt-seo-revenue-calculator",
];

write(
  "lib/calculators/mktSeo.ts",
  engineHeader("SEO marketing") +
    `export type MktSeoSlug =\n${SEO_SLUGS.map((s) => `  | "${s}"`).join("\n")};\n\n` +
    `export const MKT_SEO_SLUGS: MktSeoSlug[] = [\n${SEO_SLUGS.map((s) => `  "${s}",`).join("\n")}\n];\n\n` +
    `export function computeMktSeo(slug: MktSeoSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-keyword-roi-calculator": {
      ${P("rev", "revenue", "Attributed revenue")}
      ${P("spend", "spend", "SEO / content cost")}
      const roi = ((rev - spend) / spend) * 100;
      return { ok: true, value: roi, rate: roi, note: "Keyword ROI% = (revenue − cost) ÷ cost × 100." };
    }
    case "mkt-organic-ctr-calculator": {
      ${P("clicks", "clicks", "Organic clicks")}
      ${P("impr", "impressions", "Impressions")}
      return { ok: true, value: (clicks / impr) * 100, rate: (clicks / impr) * 100, note: "Organic CTR% = clicks ÷ impressions × 100." };
    }
    case "mkt-seo-traffic-value-calculator": {
      ${P("traffic", "traffic", "Organic visits")}
      ${P("cpc", "cpcEquiv", "Equivalent CPC")}
      return { ok: true, value: traffic * cpc, revenue: traffic * cpc, note: "Traffic value ≈ organic visits × equivalent CPC." };
    }
    case "mkt-keyword-difficulty-estimator": {
      ${N("diff", "difficulty", "Competition score 0–100")}
      ${N("vol", "searchVol", "Search volume")}
      const score = Math.min(100, Math.max(0, diff * 0.7 + Math.min(vol / 1000, 30)));
      return { ok: true, value: score, rate: score, note: "Basic difficulty blend of competition + volume (teaching heuristic)." };
    }
    case "mkt-ranking-improvement-impact-calculator": {
      ${P("vol", "searchVol", "Monthly search volume")}
      ${N("ctrNow", "ctrPct", "Current CTR %")}
      ${P("ctrNew", "pct", "New CTR %")}
      const extra = vol * ((ctrNew - ctrNow) / 100);
      return { ok: true, value: extra, count: extra, note: "Extra visits ≈ volume × (new CTR% − current CTR%)." };
    }
    case "mkt-backlink-value-calculator": {
      ${P("links", "count", "Referring links")}
      ${P("val", "amount", "Value per link")}
      return { ok: true, value: links * val, revenue: links * val, note: "Backlink value ≈ links × value/link (proxy)." };
    }
    case "mkt-seo-revenue-calculator": {
      ${P("traffic", "traffic", "Organic visits")}
      ${P("cvr", "cvrPct", "CVR %")}
      ${P("aov", "aov", "AOV")}
      const rev = traffic * (cvr / 100) * aov;
      return { ok: true, value: rev, revenue: rev, note: "SEO revenue ≈ traffic × CVR% × AOV." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
`,
);

// ─── ECOM ──────────────────────────────────────────────────────────────────
const ECOM_SLUGS = [
  "mkt-cart-abandonment-rate-calculator",
  "mkt-checkout-conversion-rate-calculator",
  "mkt-revenue-loss-calculator",
  "mkt-discount-impact-calculator",
  "mkt-profit-margin-ecommerce-calculator",
  "mkt-upsell-revenue-calculator",
  "mkt-customer-retention-rate-calculator",
];

write(
  "lib/calculators/mktEcom.ts",
  engineHeader("E-commerce marketing") +
    `export type MktEcomSlug =\n${ECOM_SLUGS.map((s) => `  | "${s}"`).join("\n")};\n\n` +
    `export const MKT_ECOM_SLUGS: MktEcomSlug[] = [\n${ECOM_SLUGS.map((s) => `  "${s}",`).join("\n")}\n];\n\n` +
    `export function computeMktEcom(slug: MktEcomSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-cart-abandonment-rate-calculator": {
      ${P("starts", "cartStarts", "Carts started")}
      ${P("orders", "orders", "Completed orders")}
      const rate = ((starts - orders) / starts) * 100;
      return { ok: true, value: rate, rate, note: "Cart abandonment% = (starts − orders) ÷ starts × 100." };
    }
    case "mkt-checkout-conversion-rate-calculator": {
      ${P("orders", "orders", "Orders")}
      ${P("checkouts", "checkouts", "Checkout starts")}
      return { ok: true, value: (orders / checkouts) * 100, rate: (orders / checkouts) * 100, note: "Checkout CVR% = orders ÷ checkout starts × 100." };
    }
    case "mkt-revenue-loss-calculator": {
      ${P("abandoned", "abandoned", "Abandoned carts")}
      ${P("aov", "aov", "AOV")}
      return { ok: true, value: abandoned * aov, revenue: abandoned * aov, note: "Revenue at risk ≈ abandoned carts × AOV." };
    }
    case "mkt-discount-impact-calculator": {
      ${P("aov", "aov", "Pre-discount AOV")}
      ${P("disc", "discountPct", "Discount %")}
      ${P("orders", "orders", "Orders")}
      const after = aov * (1 - disc / 100);
      const impact = (aov - after) * orders;
      return { ok: true, value: impact, revenue: after * orders, cost: impact, note: "Discount impact ≈ (AOV − discounted AOV) × orders." };
    }
    case "mkt-profit-margin-ecommerce-calculator": {
      ${P("rev", "revenue", "Revenue")}
      ${P("cogs", "amount", "COGS")}
      const margin = ((rev - cogs) / rev) * 100;
      return { ok: true, value: margin, rate: margin, revenue: rev - cogs, note: "Gross margin% = (revenue − COGS) ÷ revenue × 100." };
    }
    case "mkt-upsell-revenue-calculator": {
      ${P("orders", "orders", "Orders")}
      ${P("rate", "upsellRatePct", "Upsell rate %")}
      ${P("upsellAov", "upsellAov", "Upsell AOV")}
      const rev = orders * (rate / 100) * upsellAov;
      return { ok: true, value: rev, revenue: rev, note: "Upsell revenue ≈ orders × upsell% × upsell AOV." };
    }
    case "mkt-customer-retention-rate-calculator": {
      ${P("start", "startCustomers", "Customers at start")}
      ${N("end", "endCustomers", "Customers at end")}
      ${N("neu", "newCustomers", "New customers in period")}
      const retained = end - neu;
      const rate = (retained / start) * 100;
      return { ok: true, value: rate, rate, count: retained, note: "Retention% = (end − new) ÷ start × 100." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
`,
);

// ─── CONTENT ───────────────────────────────────────────────────────────────
const CONTENT_SLUGS = [
  "mkt-content-roi-calculator",
  "mkt-blog-traffic-value-calculator",
  "mkt-cost-per-content-piece-calculator",
  "mkt-content-production-cost-calculator",
  "mkt-lead-generation-from-content-calculator",
  "mkt-content-engagement-rate-calculator",
];

write(
  "lib/calculators/mktContent.ts",
  engineHeader("Content marketing") +
    `export type MktContentSlug =\n${CONTENT_SLUGS.map((s) => `  | "${s}"`).join("\n")};\n\n` +
    `export const MKT_CONTENT_SLUGS: MktContentSlug[] = [\n${CONTENT_SLUGS.map((s) => `  "${s}",`).join("\n")}\n];\n\n` +
    `export function computeMktContent(slug: MktContentSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-content-roi-calculator": {
      ${P("rev", "revenue", "Attributed revenue")}
      ${P("spend", "spend", "Content cost")}
      const roi = ((rev - spend) / spend) * 100;
      return { ok: true, value: roi, rate: roi, note: "Content ROI% = (revenue − cost) ÷ cost × 100." };
    }
    case "mkt-blog-traffic-value-calculator": {
      ${P("traffic", "traffic", "Visits")}
      ${P("cpc", "cpcEquiv", "Equivalent CPC")}
      return { ok: true, value: traffic * cpc, revenue: traffic * cpc, note: "Blog traffic value ≈ visits × equivalent CPC." };
    }
    case "mkt-cost-per-content-piece-calculator": {
      ${P("cost", "prodCost", "Total production cost")}
      ${P("pieces", "pieces", "Pieces")}
      return { ok: true, value: cost / pieces, cost: cost / pieces, note: "Cost per piece = total cost ÷ pieces." };
    }
    case "mkt-content-production-cost-calculator": {
      ${N("a", "amount", "Writing / creative")}
      ${N("b", "amount2", "Design / edit")}
      ${N("c", "amount3", "Promotion / other")}
      const total = a + b + c;
      return { ok: true, value: total, cost: total, note: "Production cost = creative + design + other." };
    }
    case "mkt-lead-generation-from-content-calculator": {
      ${P("traffic", "traffic", "Content visits")}
      ${P("cvr", "cvrPct", "Lead CVR %")}
      const leads = traffic * (cvr / 100);
      return { ok: true, value: leads, count: leads, note: "Leads ≈ visits × lead CVR%." };
    }
    case "mkt-content-engagement-rate-calculator": {
      ${P("eng", "engagements", "Engagements")}
      ${P("views", "views", "Views / reach")}
      return { ok: true, value: (eng / views) * 100, rate: (eng / views) * 100, note: "Content engagement% = engagements ÷ views × 100." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
`,
);

// ─── LEADS ─────────────────────────────────────────────────────────────────
const LEADS_SLUGS = [
  "mkt-lead-conversion-rate-calculator",
  "mkt-cost-per-lead-calculator",
  "mkt-lead-value-calculator",
  "mkt-sql-calculator",
  "mkt-mql-calculator",
  "mkt-lead-to-customer-rate-calculator",
];

write(
  "lib/calculators/mktLeads.ts",
  engineHeader("Lead generation") +
    `export type MktLeadsSlug =\n${LEADS_SLUGS.map((s) => `  | "${s}"`).join("\n")};\n\n` +
    `export const MKT_LEADS_SLUGS: MktLeadsSlug[] = [\n${LEADS_SLUGS.map((s) => `  "${s}",`).join("\n")}\n];\n\n` +
    `export function computeMktLeads(slug: MktLeadsSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-lead-conversion-rate-calculator": {
      ${P("leads", "leads", "Leads")}
      ${P("vis", "visitors", "Visitors")}
      return { ok: true, value: (leads / vis) * 100, rate: (leads / vis) * 100, note: "Lead CVR% = leads ÷ visitors × 100." };
    }
    case "mkt-cost-per-lead-calculator": {
      ${P("spend", "spend", "Spend")}
      ${P("leads", "leads", "Leads")}
      return { ok: true, value: spend / leads, cost: spend / leads, note: "CPL = spend ÷ leads." };
    }
    case "mkt-lead-value-calculator": {
      ${P("aov", "aov", "Customer value / AOV")}
      ${P("cvr", "cvrPct", "Lead→customer %")}
      return { ok: true, value: aov * (cvr / 100), revenue: aov * (cvr / 100), note: "Lead value ≈ customer value × close rate%." };
    }
    case "mkt-sql-calculator": {
      ${P("leads", "leads", "Total leads")}
      ${P("pct", "pct", "SQL rate %")}
      const sql = leads * (pct / 100);
      return { ok: true, value: sql, count: sql, note: "SQLs ≈ leads × SQL rate%." };
    }
    case "mkt-mql-calculator": {
      ${P("leads", "leads", "Total leads")}
      ${P("pct", "pct", "MQL rate %")}
      const mql = leads * (pct / 100);
      return { ok: true, value: mql, count: mql, note: "MQLs ≈ leads × MQL rate%." };
    }
    case "mkt-lead-to-customer-rate-calculator": {
      ${P("cust", "customers", "Customers")}
      ${P("leads", "leads", "Leads")}
      return { ok: true, value: (cust / leads) * 100, rate: (cust / leads) * 100, note: "Lead→customer% = customers ÷ leads × 100." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
`,
);

// ─── AFFILIATE ─────────────────────────────────────────────────────────────
const AFF_SLUGS = [
  "mkt-affiliate-commission-calculator",
  "mkt-influencer-roi-calculator",
  "mkt-cost-per-influencer-post-calculator",
  "mkt-influencer-engagement-rate-calculator",
  "mkt-affiliate-earnings-calculator",
  "mkt-revenue-share-calculator",
];

write(
  "lib/calculators/mktAffiliate.ts",
  engineHeader("Affiliate & influencer marketing") +
    `export type MktAffiliateSlug =\n${AFF_SLUGS.map((s) => `  | "${s}"`).join("\n")};\n\n` +
    `export const MKT_AFFILIATE_SLUGS: MktAffiliateSlug[] = [\n${AFF_SLUGS.map((s) => `  "${s}",`).join("\n")}\n];\n\n` +
    `export function computeMktAffiliate(slug: MktAffiliateSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-affiliate-commission-calculator": {
      ${P("sales", "sales", "Sale amount")}
      ${P("pct", "commissionPct", "Commission %")}
      return { ok: true, value: sales * (pct / 100), cost: sales * (pct / 100), note: "Commission = sales × commission%." };
    }
    case "mkt-influencer-roi-calculator": {
      ${P("rev", "revenue", "Attributed revenue")}
      ${P("spend", "spend", "Influencer cost")}
      const roi = ((rev - spend) / spend) * 100;
      return { ok: true, value: roi, rate: roi, note: "Influencer ROI% = (revenue − cost) ÷ cost × 100." };
    }
    case "mkt-cost-per-influencer-post-calculator": {
      ${P("spend", "spend", "Total fee")}
      ${P("posts", "posts", "Posts")}
      return { ok: true, value: spend / posts, cost: spend / posts, note: "Cost per post = fee ÷ posts." };
    }
    case "mkt-influencer-engagement-rate-calculator": {
      ${N("likes", "likes", "Likes")}
      ${N("comments", "comments", "Comments")}
      ${P("followers", "followers", "Followers")}
      const eng = likes + comments;
      return { ok: true, value: (eng / followers) * 100, rate: (eng / followers) * 100, note: "Influencer ER% = (likes+comments) ÷ followers × 100." };
    }
    case "mkt-affiliate-earnings-calculator": {
      ${P("sales", "sales", "Sales volume")}
      ${P("pct", "commissionPct", "Commission %")}
      ${N("bonus", "amount", "Flat bonus")}
      const earn = sales * (pct / 100) + bonus;
      return { ok: true, value: earn, revenue: earn, note: "Earnings = sales × commission% + bonus." };
    }
    case "mkt-revenue-share-calculator": {
      ${P("rev", "revenue", "Revenue")}
      ${P("pct", "pct", "Partner share %")}
      return { ok: true, value: rev * (pct / 100), revenue: rev * (pct / 100), note: "Partner share = revenue × share%." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
`,
);

// ─── SAAS ──────────────────────────────────────────────────────────────────
const SAAS_SLUGS = [
  "mkt-mrr-calculator",
  "mkt-arr-calculator",
  "mkt-churn-rate-calculator",
  "mkt-customer-retention-calculator",
  "mkt-saas-growth-rate-calculator",
  "mkt-payback-period-calculator",
  "mkt-expansion-revenue-calculator",
];

write(
  "lib/calculators/mktSaas.ts",
  engineHeader("SaaS & growth marketing") +
    `export type MktSaasSlug =\n${SAAS_SLUGS.map((s) => `  | "${s}"`).join("\n")};\n\n` +
    `export const MKT_SAAS_SLUGS: MktSaasSlug[] = [\n${SAAS_SLUGS.map((s) => `  "${s}",`).join("\n")}\n];\n\n` +
    `export function computeMktSaas(slug: MktSaasSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-mrr-calculator": {
      ${P("cust", "customers", "Paying customers")}
      ${P("aov", "aov", "ARPU / monthly price")}
      return { ok: true, value: cust * aov, revenue: cust * aov, note: "MRR ≈ customers × ARPU." };
    }
    case "mkt-arr-calculator": {
      ${P("mrr", "mrr", "MRR")}
      return { ok: true, value: mrr * 12, revenue: mrr * 12, note: "ARR = MRR × 12." };
    }
    case "mkt-churn-rate-calculator": {
      ${P("churned", "churned", "Churned customers")}
      ${P("start", "startCustomers", "Customers at start")}
      return { ok: true, value: (churned / start) * 100, rate: (churned / start) * 100, note: "Churn% = churned ÷ starting customers × 100." };
    }
    case "mkt-customer-retention-calculator": {
      ${P("churnPct", "pct", "Churn %")}
      const ret = 100 - churnPct;
      return { ok: true, value: ret, rate: ret, note: "Retention% ≈ 100 − churn%." };
    }
    case "mkt-saas-growth-rate-calculator": {
      ${P("start", "amount", "Starting MRR")}
      ${P("end", "amount2", "Ending MRR")}
      const g = ((end - start) / start) * 100;
      return { ok: true, value: g, rate: g, note: "Growth% = (end − start) ÷ start × 100." };
    }
    case "mkt-payback-period-calculator": {
      ${P("cac", "cac", "CAC")}
      ${P("arpu", "aov", "Monthly gross margin $ / ARPU")}
      return { ok: true, value: cac / arpu, count: cac / arpu, note: "Payback months ≈ CAC ÷ monthly contribution." };
    }
    case "mkt-expansion-revenue-calculator": {
      ${N("exp", "expansion", "Expansion / upsell MRR")}
      ${P("base", "mrr", "Base MRR")}
      const rate = (exp / base) * 100;
      return { ok: true, value: exp, rate, revenue: exp, note: "Expansion revenue and % of base MRR." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
`,
);

// ─── ANALYTICS ─────────────────────────────────────────────────────────────
const ANALYTICS_SLUGS = [
  "mkt-virality-coefficient-calculator",
  "mkt-customer-growth-rate-calculator",
  "mkt-mer-calculator",
  "mkt-attribution-model-calculator",
  "mkt-cohort-retention-calculator",
  "mkt-traffic-source-roi-calculator",
];

write(
  "lib/calculators/mktAnalytics.ts",
  engineHeader("Advanced growth & analytics") +
    `export type MktAnalyticsSlug =\n${ANALYTICS_SLUGS.map((s) => `  | "${s}"`).join("\n")};\n\n` +
    `export const MKT_ANALYTICS_SLUGS: MktAnalyticsSlug[] = [\n${ANALYTICS_SLUGS.map((s) => `  "${s}",`).join("\n")}\n];\n\n` +
    `export function computeMktAnalytics(slug: MktAnalyticsSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-virality-coefficient-calculator": {
      ${P("invites", "invites", "Invites per user")}
      ${P("cvr", "cvrPct", "Invite conversion %")}
      const k = invites * (cvr / 100);
      return { ok: true, value: k, ratio: k, note: "k-factor ≈ invites/user × conversion%." };
    }
    case "mkt-customer-growth-rate-calculator": {
      ${P("start", "startCustomers", "Start customers")}
      ${P("end", "endCustomers", "End customers")}
      const g = ((end - start) / start) * 100;
      return { ok: true, value: g, rate: g, note: "Customer growth% = (end − start) ÷ start × 100." };
    }
    case "mkt-mer-calculator": {
      ${P("rev", "revenue", "Total revenue")}
      ${P("spend", "spend", "Total marketing spend")}
      return { ok: true, value: rev / spend, ratio: rev / spend, note: "MER = total revenue ÷ total marketing spend." };
    }
    case "mkt-attribution-model-calculator": {
      ${N("wa", "weightA", "Weight channel A")}
      ${N("wb", "weightB", "Weight channel B")}
      ${N("wc", "weightC", "Weight channel C")}
      ${P("rev", "revenue", "Conversion revenue")}
      const wsum = wa + wb + wc;
      if (wsum <= 0) return { ok: false, error: "Weights must sum to > 0." };
      const a = rev * (wa / wsum);
      return { ok: true, value: a, revenue: a, rate: (wa / wsum) * 100, note: \`Attributed A=\${a.toFixed(2)} (weight share).\` };
    }
    case "mkt-cohort-retention-calculator": {
      ${P("size", "cohortSize", "Cohort size")}
      ${P("ret", "retainedCohort", "Retained")}
      return { ok: true, value: (ret / size) * 100, rate: (ret / size) * 100, note: "Cohort retention% = retained ÷ cohort size × 100." };
    }
    case "mkt-traffic-source-roi-calculator": {
      ${P("rev", "channelRevenue", "Channel revenue")}
      ${P("spend", "channelSpend", "Channel spend")}
      const roi = ((rev - spend) / spend) * 100;
      return { ok: true, value: roi, rate: roi, note: "Channel ROI% = (revenue − spend) ÷ spend × 100." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
`,
);

// ─── VIRAL ─────────────────────────────────────────────────────────────────
const VIRAL_SLUGS = [
  "mkt-revenue-lost-without-seo-calculator",
  "mkt-instagram-account-worth-calculator",
  "mkt-youtube-channel-earnings-calculator",
  "mkt-startup-growth-projection-calculator",
  "mkt-ad-budget-vs-revenue-simulator",
];

write(
  "lib/calculators/mktViral.ts",
  engineHeader("High-intent & viral marketing") +
    `export type MktViralSlug =\n${VIRAL_SLUGS.map((s) => `  | "${s}"`).join("\n")};\n\n` +
    `export const MKT_VIRAL_SLUGS: MktViralSlug[] = [\n${VIRAL_SLUGS.map((s) => `  "${s}",`).join("\n")}\n];\n\n` +
    `export function computeMktViral(slug: MktViralSlug, input: MktCommonInput): MktResult {
  switch (slug) {
    case "mkt-revenue-lost-without-seo-calculator": {
      ${P("vol", "searchVol", "Addressable monthly searches")}
      ${P("ctr", "ctrPct", "Attainable CTR %")}
      ${P("cvr", "cvrPct", "CVR %")}
      ${P("aov", "aov", "AOV")}
      const lost = vol * (ctr / 100) * (cvr / 100) * aov;
      return { ok: true, value: lost, revenue: lost, note: "Opportunity ≈ searches × CTR% × CVR% × AOV." };
    }
    case "mkt-instagram-account-worth-calculator": {
      ${P("followers", "followers", "Followers")}
      ${P("wpf", "worthPerFollower", "Worth per follower")}
      return { ok: true, value: followers * wpf, revenue: followers * wpf, note: "Rough worth ≈ followers × $/follower (heuristic)." };
    }
    case "mkt-youtube-channel-earnings-calculator": {
      ${P("views", "views", "Monthly views")}
      ${P("rpm", "rpm", "RPM ($ per 1000 views)")}
      return { ok: true, value: (views / 1000) * rpm, revenue: (views / 1000) * rpm, note: "Earnings ≈ (views ÷ 1000) × RPM." };
    }
    case "mkt-startup-growth-projection-calculator": {
      ${P("start", "amount", "Starting users / MRR")}
      ${P("g", "growthPct", "Monthly growth %")}
      ${P("months", "months", "Months")}
      const end = start * Math.pow(1 + g / 100, months);
      return { ok: true, value: end, count: end, note: "Projected = start × (1 + g%)^months." };
    }
    case "mkt-ad-budget-vs-revenue-simulator": {
      ${P("spend", "spend", "Ad budget")}
      ${P("cpc", "cpc", "CPC")}
      ${P("cvr", "cvrPct", "CVR %")}
      ${P("aov", "aov", "AOV")}
      const clicks = spend / cpc;
      const conv = clicks * (cvr / 100);
      const rev = conv * aov;
      return { ok: true, value: rev, revenue: rev, spend, count: conv, ratio: spend > 0 ? rev / spend : 0, note: "Sim: clicks=budget÷CPC → conv→ revenue; ROAS=rev÷spend." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
`,
);

console.log("engines done");
