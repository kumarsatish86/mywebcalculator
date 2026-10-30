import { describe, expect, it } from "vitest";
import { computeMktAds, MKT_ADS_SLUGS } from "./mktAds";
import { computeMktCro, MKT_CRO_SLUGS } from "./mktCro";
import { computeMktRevenue, MKT_REVENUE_SLUGS } from "./mktRevenue";
import { computeMktEmail, MKT_EMAIL_SLUGS } from "./mktEmail";
import { computeMktSocial, MKT_SOCIAL_SLUGS } from "./mktSocial";
import { computeMktSeo, MKT_SEO_SLUGS } from "./mktSeo";
import { computeMktEcom, MKT_ECOM_SLUGS } from "./mktEcom";
import { computeMktContent, MKT_CONTENT_SLUGS } from "./mktContent";
import { computeMktLeads, MKT_LEADS_SLUGS } from "./mktLeads";
import { computeMktAffiliate, MKT_AFFILIATE_SLUGS } from "./mktAffiliate";
import { computeMktSaas, MKT_SAAS_SLUGS } from "./mktSaas";
import { computeMktAnalytics, MKT_ANALYTICS_SLUGS } from "./mktAnalytics";
import { computeMktViral, MKT_VIRAL_SLUGS } from "./mktViral";

const ALL = [
  ...MKT_ADS_SLUGS,
  ...MKT_CRO_SLUGS,
  ...MKT_REVENUE_SLUGS,
  ...MKT_EMAIL_SLUGS,
  ...MKT_SOCIAL_SLUGS,
  ...MKT_SEO_SLUGS,
  ...MKT_ECOM_SLUGS,
  ...MKT_CONTENT_SLUGS,
  ...MKT_LEADS_SLUGS,
  ...MKT_AFFILIATE_SLUGS,
  ...MKT_SAAS_SLUGS,
  ...MKT_ANALYTICS_SLUGS,
  ...MKT_VIRAL_SLUGS,
] as const;

describe("marketing engines smoke", () => {
  it("covers every slug", () => {
    expect(ALL.length).toBe(91);
    const input = {
      spend: 1000, impressions: 100000, clicks: 500, conversions: 50, leads: 40, installs: 80,
      revenue: 5000, visitors: 2000, customers: 100, orders: 80, aov: 60, marginPct: 40,
      cpc: 1.5, cpm: 10, cvrPct: 2, days: 30, budget: 1500, pct: 20, pct2: 15,
      amount: 500, amount2: 600, amount3: 100, rate: 5, count: 4, count2: 2, count3: 1,
      opens: 400, sent: 2000, unsubs: 10, bounces: 20, engagements: 300, followers: 10000,
      views: 20000, likes: 500, comments: 40, shares: 20, newFollowers: 100,
      startFollowers: 8000, endFollowers: 9000, periodDays: 30, searchVol: 10000, ctrPct: 3,
      position: 5, difficulty: 50, traffic: 5000, cpcEquiv: 1.2, cartStarts: 1000,
      checkouts: 400, abandoned: 700, discountPct: 10, upsellRatePct: 10, upsellAov: 30,
      retained: 800, startCustomers: 1000, endCustomers: 1100, newCustomers: 200, churned: 50,
      pieces: 10, prodCost: 2000, mql: 100, sql: 40, commissionPct: 15, sales: 5000, posts: 4,
      mrr: 10000, arr: 120000, expansion: 800, ltv: 400, cac: 100, invites: 3, invitees: 100,
      kFactor: 0.5, cohortSize: 500, retainedCohort: 300, channelRevenue: 8000, channelSpend: 2000,
      weightA: 40, weightB: 35, weightC: 25, revA: 100, revB: 100, revC: 100,
      controlConv: 80, controlVisitors: 2000, variantConv: 100, variantVisitors: 2000,
      stage1: 1000, stage2: 600, stage3: 300, stage4: 100, months: 3, growthPct: 8,
      rpm: 4, worthPerFollower: 0.05,
    };
    for (const slug of ALL) {
      let r;
      if (MKT_ADS_SLUGS.includes(slug as never)) r = computeMktAds(slug as never, input);
      else if (MKT_CRO_SLUGS.includes(slug as never)) r = computeMktCro(slug as never, input);
      else if (MKT_REVENUE_SLUGS.includes(slug as never)) r = computeMktRevenue(slug as never, input);
      else if (MKT_EMAIL_SLUGS.includes(slug as never)) r = computeMktEmail(slug as never, input);
      else if (MKT_SOCIAL_SLUGS.includes(slug as never)) r = computeMktSocial(slug as never, input);
      else if (MKT_SEO_SLUGS.includes(slug as never)) r = computeMktSeo(slug as never, input);
      else if (MKT_ECOM_SLUGS.includes(slug as never)) r = computeMktEcom(slug as never, input);
      else if (MKT_CONTENT_SLUGS.includes(slug as never)) r = computeMktContent(slug as never, input);
      else if (MKT_LEADS_SLUGS.includes(slug as never)) r = computeMktLeads(slug as never, input);
      else if (MKT_AFFILIATE_SLUGS.includes(slug as never)) r = computeMktAffiliate(slug as never, input);
      else if (MKT_SAAS_SLUGS.includes(slug as never)) r = computeMktSaas(slug as never, input);
      else if (MKT_ANALYTICS_SLUGS.includes(slug as never)) r = computeMktAnalytics(slug as never, input);
      else if (MKT_VIRAL_SLUGS.includes(slug as never)) r = computeMktViral(slug as never, input);
      else throw new Error("unmapped " + slug);
      expect(r!.ok, String(slug)).toBe(true);
    }
  });

  it("CPM formula", () => {
    const r = computeMktAds("mkt-cpm-calculator", { spend: 100, impressions: 50000 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBeCloseTo(2);
  });

  it("ROAS formula", () => {
    const r = computeMktAds("mkt-roas-calculator", { revenue: 500, spend: 100 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.ratio).toBe(5);
  });

  it("CVR formula", () => {
    const r = computeMktCro("mkt-conversion-rate-calculator", { conversions: 25, visitors: 1000 });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.rate).toBe(2.5);
  });
});
