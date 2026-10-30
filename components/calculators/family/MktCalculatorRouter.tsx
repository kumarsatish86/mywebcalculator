"use client";

import type { MktAdsSlug } from "@/lib/calculators/mktAds";
import { MktAdsCalculatorHost } from "./MktAdsCalculatorHost";
import type { MktCroSlug } from "@/lib/calculators/mktCro";
import { MktCroCalculatorHost } from "./MktCroCalculatorHost";
import type { MktRevenueSlug } from "@/lib/calculators/mktRevenue";
import { MktRevenueCalculatorHost } from "./MktRevenueCalculatorHost";
import type { MktEmailSlug } from "@/lib/calculators/mktEmail";
import { MktEmailCalculatorHost } from "./MktEmailCalculatorHost";
import type { MktSocialSlug } from "@/lib/calculators/mktSocial";
import { MktSocialCalculatorHost } from "./MktSocialCalculatorHost";
import type { MktSeoSlug } from "@/lib/calculators/mktSeo";
import { MktSeoCalculatorHost } from "./MktSeoCalculatorHost";
import type { MktEcomSlug } from "@/lib/calculators/mktEcom";
import { MktEcomCalculatorHost } from "./MktEcomCalculatorHost";
import type { MktContentSlug } from "@/lib/calculators/mktContent";
import { MktContentCalculatorHost } from "./MktContentCalculatorHost";
import type { MktLeadsSlug } from "@/lib/calculators/mktLeads";
import { MktLeadsCalculatorHost } from "./MktLeadsCalculatorHost";
import type { MktAffiliateSlug } from "@/lib/calculators/mktAffiliate";
import { MktAffiliateCalculatorHost } from "./MktAffiliateCalculatorHost";
import type { MktSaasSlug } from "@/lib/calculators/mktSaas";
import { MktSaasCalculatorHost } from "./MktSaasCalculatorHost";
import type { MktAnalyticsSlug } from "@/lib/calculators/mktAnalytics";
import { MktAnalyticsCalculatorHost } from "./MktAnalyticsCalculatorHost";
import type { MktViralSlug } from "@/lib/calculators/mktViral";
import { MktViralCalculatorHost } from "./MktViralCalculatorHost";

const ADS = new Set<string>([
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
] satisfies MktAdsSlug[]);

const CRO = new Set<string>([
  "mkt-conversion-rate-calculator",
  "mkt-funnel-conversion-calculator",
  "mkt-landing-page-conversion-calculator",
  "mkt-sales-funnel-drop-off-calculator",
  "mkt-ab-test-significance-calculator",
  "mkt-click-to-conversion-rate-calculator",
] satisfies MktCroSlug[]);

const REVENUE = new Set<string>([
  "mkt-cac-calculator",
  "mkt-clv-ltv-calculator",
  "mkt-ltv-cac-ratio-calculator",
  "mkt-marketing-roi-calculator",
  "mkt-gross-profit-from-campaign-calculator",
  "mkt-revenue-per-visitor-calculator",
  "mkt-average-order-value-calculator",
] satisfies MktRevenueSlug[]);

const EMAIL = new Set<string>([
  "mkt-email-open-rate-calculator",
  "mkt-email-ctr-calculator",
  "mkt-email-conversion-rate-calculator",
  "mkt-email-roi-calculator",
  "mkt-list-growth-rate-calculator",
  "mkt-email-bounce-rate-calculator",
  "mkt-unsubscribe-rate-calculator",
] satisfies MktEmailSlug[]);

const SOCIAL = new Set<string>([
  "mkt-engagement-rate-calculator",
  "mkt-instagram-engagement-rate-calculator",
  "mkt-youtube-engagement-calculator",
  "mkt-tiktok-engagement-calculator",
  "mkt-follower-growth-rate-calculator",
  "mkt-social-media-roi-calculator",
  "mkt-cost-per-engagement-calculator",
] satisfies MktSocialSlug[]);

const SEO = new Set<string>([
  "mkt-keyword-roi-calculator",
  "mkt-organic-ctr-calculator",
  "mkt-seo-traffic-value-calculator",
  "mkt-keyword-difficulty-estimator",
  "mkt-ranking-improvement-impact-calculator",
  "mkt-backlink-value-calculator",
  "mkt-seo-revenue-calculator",
] satisfies MktSeoSlug[]);

const ECOM = new Set<string>([
  "mkt-cart-abandonment-rate-calculator",
  "mkt-checkout-conversion-rate-calculator",
  "mkt-revenue-loss-calculator",
  "mkt-discount-impact-calculator",
  "mkt-profit-margin-ecommerce-calculator",
  "mkt-upsell-revenue-calculator",
  "mkt-customer-retention-rate-calculator",
] satisfies MktEcomSlug[]);

const CONTENT = new Set<string>([
  "mkt-content-roi-calculator",
  "mkt-blog-traffic-value-calculator",
  "mkt-cost-per-content-piece-calculator",
  "mkt-content-production-cost-calculator",
  "mkt-lead-generation-from-content-calculator",
  "mkt-content-engagement-rate-calculator",
] satisfies MktContentSlug[]);

const LEADS = new Set<string>([
  "mkt-lead-conversion-rate-calculator",
  "mkt-cost-per-lead-calculator",
  "mkt-lead-value-calculator",
  "mkt-sql-calculator",
  "mkt-mql-calculator",
  "mkt-lead-to-customer-rate-calculator",
] satisfies MktLeadsSlug[]);

const AFFILIATE = new Set<string>([
  "mkt-affiliate-commission-calculator",
  "mkt-influencer-roi-calculator",
  "mkt-cost-per-influencer-post-calculator",
  "mkt-influencer-engagement-rate-calculator",
  "mkt-affiliate-earnings-calculator",
  "mkt-revenue-share-calculator",
] satisfies MktAffiliateSlug[]);

const SAAS = new Set<string>([
  "mkt-mrr-calculator",
  "mkt-arr-calculator",
  "mkt-churn-rate-calculator",
  "mkt-customer-retention-calculator",
  "mkt-saas-growth-rate-calculator",
  "mkt-payback-period-calculator",
  "mkt-expansion-revenue-calculator",
] satisfies MktSaasSlug[]);

const ANALYTICS = new Set<string>([
  "mkt-virality-coefficient-calculator",
  "mkt-customer-growth-rate-calculator",
  "mkt-mer-calculator",
  "mkt-attribution-model-calculator",
  "mkt-cohort-retention-calculator",
  "mkt-traffic-source-roi-calculator",
] satisfies MktAnalyticsSlug[]);

const VIRAL = new Set<string>([
  "mkt-revenue-lost-without-seo-calculator",
  "mkt-instagram-account-worth-calculator",
  "mkt-youtube-channel-earnings-calculator",
  "mkt-startup-growth-projection-calculator",
  "mkt-ad-budget-vs-revenue-simulator",
] satisfies MktViralSlug[]);

export function MktCalculatorRouter({ slug }: { slug: string }) {
  if (ADS.has(slug)) return <MktAdsCalculatorHost slug={slug} />;
  if (CRO.has(slug)) return <MktCroCalculatorHost slug={slug} />;
  if (REVENUE.has(slug)) return <MktRevenueCalculatorHost slug={slug} />;
  if (EMAIL.has(slug)) return <MktEmailCalculatorHost slug={slug} />;
  if (SOCIAL.has(slug)) return <MktSocialCalculatorHost slug={slug} />;
  if (SEO.has(slug)) return <MktSeoCalculatorHost slug={slug} />;
  if (ECOM.has(slug)) return <MktEcomCalculatorHost slug={slug} />;
  if (CONTENT.has(slug)) return <MktContentCalculatorHost slug={slug} />;
  if (LEADS.has(slug)) return <MktLeadsCalculatorHost slug={slug} />;
  if (AFFILIATE.has(slug)) return <MktAffiliateCalculatorHost slug={slug} />;
  if (SAAS.has(slug)) return <MktSaasCalculatorHost slug={slug} />;
  if (ANALYTICS.has(slug)) return <MktAnalyticsCalculatorHost slug={slug} />;
  if (VIRAL.has(slug)) return <MktViralCalculatorHost slug={slug} />;
  return <MktAdsCalculatorHost slug={slug} />;
}
