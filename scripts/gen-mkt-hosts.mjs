/**
 * Generate marketing hosts, SEO content, router, and smoke tests.
 * Run after gen-mkt-calculators.mjs: node scripts/gen-mkt-hosts.mjs
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

const DISCLAIMER =
  "Marketing teaching estimate only — platforms, attribution, and costs vary. Not financial advice.";

/** @typedef {{ slug: string, title: string, fields: [string, string, string][], defaults: string[] }} CalcDef */
/** field: [urlLetter, label, inputKey] */

const SECTIONS = [
  {
    id: "Ads",
    file: "mktAds",
    compute: "computeMktAds",
    type: "MktAdsSlug",
    hub: "mkt-advertising-paid",
    hubLabel: "Business · Marketing · Advertising and paid marketing calculators",
    exportArticles: "MKT_ADS_ARTICLES",
    seoFile: "mktAdsContent",
    host: "MktAdsCalculatorHost",
    tableTitle: "Advertising & paid tools",
    calcs: [
      { slug: "mkt-cpm-calculator", title: "CPM", fields: [["a","Ad spend","spend"],["b","Impressions","impressions"]], defaults: ["1000","500000"] },
      { slug: "mkt-cpc-calculator", title: "CPC", fields: [["a","Ad spend","spend"],["b","Clicks","clicks"]], defaults: ["500","250"] },
      { slug: "mkt-cpa-calculator", title: "CPA", fields: [["a","Ad spend","spend"],["b","Conversions","conversions"]], defaults: ["1000","40"] },
      { slug: "mkt-cpl-calculator", title: "CPL", fields: [["a","Ad spend","spend"],["b","Leads","leads"]], defaults: ["800","50"] },
      { slug: "mkt-cpi-calculator", title: "CPI", fields: [["a","Ad spend","spend"],["b","Installs","installs"]], defaults: ["2000","400"] },
      { slug: "mkt-roas-calculator", title: "ROAS", fields: [["a","Revenue","revenue"],["b","Ad spend","spend"]], defaults: ["5000","1000"] },
      { slug: "mkt-ad-spend-efficiency-calculator", title: "Ad spend efficiency", fields: [["a","Revenue","revenue"],["b","Ad spend","spend"]], defaults: ["4000","1000"] },
      { slug: "mkt-cost-per-conversion-calculator", title: "Cost per conversion", fields: [["a","Ad spend","spend"],["b","Conversions","conversions"]], defaults: ["1200","60"] },
      { slug: "mkt-conversion-value-calculator", title: "Conversion value", fields: [["a","Revenue","revenue"],["b","Conversions","conversions"]], defaults: ["6000","120"] },
      { slug: "mkt-break-even-cpc-calculator", title: "Break-even CPC", fields: [["a","AOV / order value","aov"],["b","Margin %","marginPct"],["c","CVR %","cvrPct"]], defaults: ["80","40","2"] },
      { slug: "mkt-ad-budget-calculator", title: "Ad budget", fields: [["a","Target conversions","conversions"],["b","Target CPA","spend"]], defaults: ["100","25"] },
      { slug: "mkt-campaign-budget-planner", title: "Campaign budget planner", fields: [["a","Daily budget","budget"],["b","Campaign days","days"]], defaults: ["50","30"] },
      { slug: "mkt-daily-ad-budget-calculator", title: "Daily ad budget", fields: [["a","Total budget","budget"],["b","Days","days"]], defaults: ["1500","30"] },
      { slug: "mkt-marketing-spend-allocation-calculator", title: "Spend allocation", fields: [["a","Total budget","budget"],["b","Channel A %","pct"],["c","Channel B %","pct2"]], defaults: ["10000","40","35"] },
    ],
  },
  {
    id: "Cro",
    file: "mktCro",
    compute: "computeMktCro",
    type: "MktCroSlug",
    hub: "mkt-conversion-optimization",
    hubLabel: "Business · Marketing · Conversion rate optimization calculators",
    exportArticles: "MKT_CRO_ARTICLES",
    seoFile: "mktCroContent",
    host: "MktCroCalculatorHost",
    tableTitle: "CRO tools",
    calcs: [
      { slug: "mkt-conversion-rate-calculator", title: "Conversion rate", fields: [["a","Conversions","conversions"],["b","Visitors","visitors"]], defaults: ["50","2000"] },
      { slug: "mkt-funnel-conversion-calculator", title: "Funnel conversion", fields: [["a","Top of funnel","stage1"],["b","Final stage","stage4"]], defaults: ["10000","250"] },
      { slug: "mkt-landing-page-conversion-calculator", title: "Landing page conversion", fields: [["a","Conversions","conversions"],["b","Visitors","visitors"]], defaults: ["80","4000"] },
      { slug: "mkt-sales-funnel-drop-off-calculator", title: "Funnel drop-off", fields: [["a","Stage A","stage1"],["b","Stage B","stage2"]], defaults: ["1000","650"] },
      { slug: "mkt-ab-test-significance-calculator", title: "A/B significance", fields: [["a","Control conversions","controlConv"],["b","Control visitors","controlVisitors"],["c","Variant conversions","variantConv"],["d","Variant visitors","variantVisitors"]], defaults: ["80","2000","110","2100"] },
      { slug: "mkt-click-to-conversion-rate-calculator", title: "Click-to-conversion", fields: [["a","Conversions","conversions"],["b","Clicks","clicks"]], defaults: ["40","800"] },
    ],
  },
  {
    id: "Revenue",
    file: "mktRevenue",
    compute: "computeMktRevenue",
    type: "MktRevenueSlug",
    hub: "mkt-revenue-profit",
    hubLabel: "Business · Marketing · Revenue and profit marketing calculators",
    exportArticles: "MKT_REVENUE_ARTICLES",
    seoFile: "mktRevenueContent",
    host: "MktRevenueCalculatorHost",
    tableTitle: "Revenue & profit tools",
    calcs: [
      { slug: "mkt-cac-calculator", title: "CAC", fields: [["a","Acquisition spend","spend"],["b","New customers","customers"]], defaults: ["5000","200"] },
      { slug: "mkt-clv-ltv-calculator", title: "CLV / LTV", fields: [["a","AOV","aov"],["b","Purchases / year","count"],["c","Lifespan (years)","months"],["d","Margin % (optional)","marginPct"]], defaults: ["60","4","3","40"] },
      { slug: "mkt-ltv-cac-ratio-calculator", title: "LTV:CAC ratio", fields: [["a","LTV","ltv"],["b","CAC","cac"]], defaults: ["360","90"] },
      { slug: "mkt-marketing-roi-calculator", title: "Marketing ROI", fields: [["a","Revenue","revenue"],["b","Spend","spend"]], defaults: ["12000","3000"] },
      { slug: "mkt-gross-profit-from-campaign-calculator", title: "Campaign gross profit", fields: [["a","Revenue","revenue"],["b","Ad spend","spend"],["c","COGS","amount"]], defaults: ["10000","2500","3000"] },
      { slug: "mkt-revenue-per-visitor-calculator", title: "Revenue per visitor", fields: [["a","Revenue","revenue"],["b","Visitors","visitors"]], defaults: ["8000","20000"] },
      { slug: "mkt-average-order-value-calculator", title: "AOV", fields: [["a","Revenue","revenue"],["b","Orders","orders"]], defaults: ["25000","500"] },
    ],
  },
  {
    id: "Email",
    file: "mktEmail",
    compute: "computeMktEmail",
    type: "MktEmailSlug",
    hub: "mkt-email",
    hubLabel: "Business · Marketing · Email marketing calculators",
    exportArticles: "MKT_EMAIL_ARTICLES",
    seoFile: "mktEmailContent",
    host: "MktEmailCalculatorHost",
    tableTitle: "Email marketing tools",
    calcs: [
      { slug: "mkt-email-open-rate-calculator", title: "Email open rate", fields: [["a","Opens","opens"],["b","Delivered","sent"]], defaults: ["4200","20000"] },
      { slug: "mkt-email-ctr-calculator", title: "Email CTR", fields: [["a","Clicks","clicks"],["b","Delivered","sent"]], defaults: ["800","20000"] },
      { slug: "mkt-email-conversion-rate-calculator", title: "Email conversion rate", fields: [["a","Conversions","conversions"],["b","Clicks","clicks"]], defaults: ["60","800"] },
      { slug: "mkt-email-roi-calculator", title: "Email ROI", fields: [["a","Revenue","revenue"],["b","Email cost","spend"]], defaults: ["5000","400"] },
      { slug: "mkt-list-growth-rate-calculator", title: "List growth rate", fields: [["a","Starting size","startFollowers"],["b","Ending size","endFollowers"],["c","Period days","periodDays"]], defaults: ["10000","11200","30"] },
      { slug: "mkt-email-bounce-rate-calculator", title: "Email bounce rate", fields: [["a","Bounces","bounces"],["b","Sent","sent"]], defaults: ["150","10000"] },
      { slug: "mkt-unsubscribe-rate-calculator", title: "Unsubscribe rate", fields: [["a","Unsubscribes","unsubs"],["b","Delivered","sent"]], defaults: ["40","10000"] },
    ],
  },
  {
    id: "Social",
    file: "mktSocial",
    compute: "computeMktSocial",
    type: "MktSocialSlug",
    hub: "mkt-social-media",
    hubLabel: "Business · Marketing · Social media marketing calculators",
    exportArticles: "MKT_SOCIAL_ARTICLES",
    seoFile: "mktSocialContent",
    host: "MktSocialCalculatorHost",
    tableTitle: "Social media tools",
    calcs: [
      { slug: "mkt-engagement-rate-calculator", title: "Engagement rate", fields: [["a","Likes","likes"],["b","Comments","comments"],["c","Shares","shares"],["d","Followers / reach","followers"]], defaults: ["500","40","20","10000"] },
      { slug: "mkt-instagram-engagement-rate-calculator", title: "Instagram engagement", fields: [["a","Likes","likes"],["b","Comments","comments"],["c","Shares / saves","shares"],["d","Followers","followers"]], defaults: ["1200","80","60","25000"] },
      { slug: "mkt-youtube-engagement-calculator", title: "YouTube engagement", fields: [["a","Likes","likes"],["b","Comments","comments"],["c","Views","views"]], defaults: ["800","90","20000"] },
      { slug: "mkt-tiktok-engagement-calculator", title: "TikTok engagement", fields: [["a","Likes","likes"],["b","Comments","comments"],["c","Shares","shares"],["d","Followers / views","followers"]], defaults: ["5000","200","400","100000"] },
      { slug: "mkt-follower-growth-rate-calculator", title: "Follower growth", fields: [["a","Starting followers","startFollowers"],["b","Ending followers","endFollowers"]], defaults: ["8000","9200"] },
      { slug: "mkt-social-media-roi-calculator", title: "Social ROI", fields: [["a","Attributed revenue","revenue"],["b","Social spend","spend"]], defaults: ["8000","1500"] },
      { slug: "mkt-cost-per-engagement-calculator", title: "Cost per engagement", fields: [["a","Spend","spend"],["b","Engagements","engagements"]], defaults: ["300","1500"] },
    ],
  },
  {
    id: "Seo",
    file: "mktSeo",
    compute: "computeMktSeo",
    type: "MktSeoSlug",
    hub: "mkt-seo",
    hubLabel: "Business · Marketing · SEO calculators",
    exportArticles: "MKT_SEO_ARTICLES",
    seoFile: "mktSeoContent",
    host: "MktSeoCalculatorHost",
    tableTitle: "SEO tools",
    calcs: [
      { slug: "mkt-keyword-roi-calculator", title: "Keyword ROI", fields: [["a","Attributed revenue","revenue"],["b","SEO / content cost","spend"]], defaults: ["12000","2000"] },
      { slug: "mkt-organic-ctr-calculator", title: "Organic CTR", fields: [["a","Organic clicks","clicks"],["b","Impressions","impressions"]], defaults: ["450","10000"] },
      { slug: "mkt-seo-traffic-value-calculator", title: "SEO traffic value", fields: [["a","Organic visits","traffic"],["b","Equivalent CPC","cpcEquiv"]], defaults: ["5000","1.2"] },
      { slug: "mkt-keyword-difficulty-estimator", title: "Keyword difficulty", fields: [["a","Competition 0–100","difficulty"],["b","Search volume","searchVol"]], defaults: ["55","8000"] },
      { slug: "mkt-ranking-improvement-impact-calculator", title: "Ranking impact", fields: [["a","Monthly search volume","searchVol"],["b","Current CTR %","ctrPct"],["c","New CTR %","pct"]], defaults: ["10000","2","8"] },
      { slug: "mkt-backlink-value-calculator", title: "Backlink value", fields: [["a","Referring links","count"],["b","Value per link","amount"]], defaults: ["25","150"] },
      { slug: "mkt-seo-revenue-calculator", title: "SEO revenue", fields: [["a","Organic visits","traffic"],["b","CVR %","cvrPct"],["c","AOV","aov"]], defaults: ["20000","2","75"] },
    ],
  },
  {
    id: "Ecom",
    file: "mktEcom",
    compute: "computeMktEcom",
    type: "MktEcomSlug",
    hub: "mkt-ecommerce",
    hubLabel: "Business · Marketing · E-commerce marketing calculators",
    exportArticles: "MKT_ECOM_ARTICLES",
    seoFile: "mktEcomContent",
    host: "MktEcomCalculatorHost",
    tableTitle: "E-commerce marketing tools",
    calcs: [
      { slug: "mkt-cart-abandonment-rate-calculator", title: "Cart abandonment", fields: [["a","Carts started","cartStarts"],["b","Completed orders","orders"]], defaults: ["1000","280"] },
      { slug: "mkt-checkout-conversion-rate-calculator", title: "Checkout conversion", fields: [["a","Orders","orders"],["b","Checkout starts","checkouts"]], defaults: ["280","400"] },
      { slug: "mkt-revenue-loss-calculator", title: "Revenue loss", fields: [["a","Abandoned carts","abandoned"],["b","AOV","aov"]], defaults: ["720","65"] },
      { slug: "mkt-discount-impact-calculator", title: "Discount impact", fields: [["a","Pre-discount AOV","aov"],["b","Discount %","discountPct"],["c","Orders","orders"]], defaults: ["80","15","500"] },
      { slug: "mkt-profit-margin-ecommerce-calculator", title: "Ecommerce margin", fields: [["a","Revenue","revenue"],["b","COGS","amount"]], defaults: ["50000","28000"] },
      { slug: "mkt-upsell-revenue-calculator", title: "Upsell revenue", fields: [["a","Orders","orders"],["b","Upsell rate %","upsellRatePct"],["c","Upsell AOV","upsellAov"]], defaults: ["1000","12","35"] },
      { slug: "mkt-customer-retention-rate-calculator", title: "Customer retention", fields: [["a","Customers at start","startCustomers"],["b","Customers at end","endCustomers"],["c","New customers","newCustomers"]], defaults: ["1000","1100","200"] },
    ],
  },
  {
    id: "Content",
    file: "mktContent",
    compute: "computeMktContent",
    type: "MktContentSlug",
    hub: "mkt-content",
    hubLabel: "Business · Marketing · Content marketing calculators",
    exportArticles: "MKT_CONTENT_ARTICLES",
    seoFile: "mktContentContent",
    host: "MktContentCalculatorHost",
    tableTitle: "Content marketing tools",
    calcs: [
      { slug: "mkt-content-roi-calculator", title: "Content ROI", fields: [["a","Attributed revenue","revenue"],["b","Content cost","spend"]], defaults: ["9000","1800"] },
      { slug: "mkt-blog-traffic-value-calculator", title: "Blog traffic value", fields: [["a","Visits","traffic"],["b","Equivalent CPC","cpcEquiv"]], defaults: ["12000","0.9"] },
      { slug: "mkt-cost-per-content-piece-calculator", title: "Cost per piece", fields: [["a","Total production cost","prodCost"],["b","Pieces","pieces"]], defaults: ["4800","12"] },
      { slug: "mkt-content-production-cost-calculator", title: "Production cost", fields: [["a","Writing / creative","amount"],["b","Design / edit","amount2"],["c","Promotion / other","amount3"]], defaults: ["2000","800","500"] },
      { slug: "mkt-lead-generation-from-content-calculator", title: "Leads from content", fields: [["a","Content visits","traffic"],["b","Lead CVR %","cvrPct"]], defaults: ["15000","3"] },
      { slug: "mkt-content-engagement-rate-calculator", title: "Content engagement", fields: [["a","Engagements","engagements"],["b","Views / reach","views"]], defaults: ["900","15000"] },
    ],
  },
  {
    id: "Leads",
    file: "mktLeads",
    compute: "computeMktLeads",
    type: "MktLeadsSlug",
    hub: "mkt-lead-generation",
    hubLabel: "Business · Marketing · Lead generation calculators",
    exportArticles: "MKT_LEADS_ARTICLES",
    seoFile: "mktLeadsContent",
    host: "MktLeadsCalculatorHost",
    tableTitle: "Lead generation tools",
    calcs: [
      { slug: "mkt-lead-conversion-rate-calculator", title: "Lead conversion rate", fields: [["a","Leads","leads"],["b","Visitors","visitors"]], defaults: ["120","4000"] },
      { slug: "mkt-cost-per-lead-calculator", title: "Cost per lead", fields: [["a","Spend","spend"],["b","Leads","leads"]], defaults: ["2400","120"] },
      { slug: "mkt-lead-value-calculator", title: "Lead value", fields: [["a","Customer value / AOV","aov"],["b","Lead→customer %","cvrPct"]], defaults: ["500","8"] },
      { slug: "mkt-sql-calculator", title: "SQL", fields: [["a","Total leads","leads"],["b","SQL rate %","pct"]], defaults: ["500","20"] },
      { slug: "mkt-mql-calculator", title: "MQL", fields: [["a","Total leads","leads"],["b","MQL rate %","pct"]], defaults: ["500","40"] },
      { slug: "mkt-lead-to-customer-rate-calculator", title: "Lead-to-customer", fields: [["a","Customers","customers"],["b","Leads","leads"]], defaults: ["40","500"] },
    ],
  },
  {
    id: "Affiliate",
    file: "mktAffiliate",
    compute: "computeMktAffiliate",
    type: "MktAffiliateSlug",
    hub: "mkt-affiliate-influencer",
    hubLabel: "Business · Marketing · Affiliate and influencer marketing calculators",
    exportArticles: "MKT_AFFILIATE_ARTICLES",
    seoFile: "mktAffiliateContent",
    host: "MktAffiliateCalculatorHost",
    tableTitle: "Affiliate & influencer tools",
    calcs: [
      { slug: "mkt-affiliate-commission-calculator", title: "Affiliate commission", fields: [["a","Sale amount","sales"],["b","Commission %","commissionPct"]], defaults: ["250","15"] },
      { slug: "mkt-influencer-roi-calculator", title: "Influencer ROI", fields: [["a","Attributed revenue","revenue"],["b","Influencer cost","spend"]], defaults: ["6000","1500"] },
      { slug: "mkt-cost-per-influencer-post-calculator", title: "Cost per post", fields: [["a","Total fee","spend"],["b","Posts","posts"]], defaults: ["3000","4"] },
      { slug: "mkt-influencer-engagement-rate-calculator", title: "Influencer engagement", fields: [["a","Likes","likes"],["b","Comments","comments"],["c","Followers","followers"]], defaults: ["8000","400","200000"] },
      { slug: "mkt-affiliate-earnings-calculator", title: "Affiliate earnings", fields: [["a","Sales volume","sales"],["b","Commission %","commissionPct"],["c","Flat bonus","amount"]], defaults: ["10000","12","100"] },
      { slug: "mkt-revenue-share-calculator", title: "Revenue share", fields: [["a","Revenue","revenue"],["b","Partner share %","pct"]], defaults: ["50000","25"] },
    ],
  },
  {
    id: "Saas",
    file: "mktSaas",
    compute: "computeMktSaas",
    type: "MktSaasSlug",
    hub: "mkt-saas-growth",
    hubLabel: "Business · Marketing · SaaS and growth marketing calculators",
    exportArticles: "MKT_SAAS_ARTICLES",
    seoFile: "mktSaasContent",
    host: "MktSaasCalculatorHost",
    tableTitle: "SaaS & growth tools",
    calcs: [
      { slug: "mkt-mrr-calculator", title: "MRR", fields: [["a","Paying customers","customers"],["b","ARPU / monthly price","aov"]], defaults: ["400","49"] },
      { slug: "mkt-arr-calculator", title: "ARR", fields: [["a","MRR","mrr"]], defaults: ["19600"] },
      { slug: "mkt-churn-rate-calculator", title: "Churn rate", fields: [["a","Churned customers","churned"],["b","Customers at start","startCustomers"]], defaults: ["25","500"] },
      { slug: "mkt-customer-retention-calculator", title: "Customer retention", fields: [["a","Churn %","pct"]], defaults: ["5"] },
      { slug: "mkt-saas-growth-rate-calculator", title: "SaaS growth rate", fields: [["a","Starting MRR","amount"],["b","Ending MRR","amount2"]], defaults: ["10000","11500"] },
      { slug: "mkt-payback-period-calculator", title: "Payback period", fields: [["a","CAC","cac"],["b","Monthly contribution / ARPU","aov"]], defaults: ["360","40"] },
      { slug: "mkt-expansion-revenue-calculator", title: "Expansion revenue", fields: [["a","Expansion / upsell MRR","expansion"],["b","Base MRR","mrr"]], defaults: ["1200","10000"] },
    ],
  },
  {
    id: "Analytics",
    file: "mktAnalytics",
    compute: "computeMktAnalytics",
    type: "MktAnalyticsSlug",
    hub: "mkt-advanced-growth-analytics",
    hubLabel: "Business · Marketing · Advanced growth and analytics calculators",
    exportArticles: "MKT_ANALYTICS_ARTICLES",
    seoFile: "mktAnalyticsContent",
    host: "MktAnalyticsCalculatorHost",
    tableTitle: "Growth & analytics tools",
    calcs: [
      { slug: "mkt-virality-coefficient-calculator", title: "Virality coefficient", fields: [["a","Invites per user","invites"],["b","Invite conversion %","cvrPct"]], defaults: ["3","20"] },
      { slug: "mkt-customer-growth-rate-calculator", title: "Customer growth", fields: [["a","Start customers","startCustomers"],["b","End customers","endCustomers"]], defaults: ["1000","1180"] },
      { slug: "mkt-mer-calculator", title: "MER", fields: [["a","Total revenue","revenue"],["b","Total marketing spend","spend"]], defaults: ["250000","50000"] },
      { slug: "mkt-attribution-model-calculator", title: "Attribution model", fields: [["a","Weight A","weightA"],["b","Weight B","weightB"],["c","Weight C","weightC"],["d","Conversion revenue","revenue"]], defaults: ["40","35","25","1000"] },
      { slug: "mkt-cohort-retention-calculator", title: "Cohort retention", fields: [["a","Cohort size","cohortSize"],["b","Retained","retainedCohort"]], defaults: ["500","310"] },
      { slug: "mkt-traffic-source-roi-calculator", title: "Traffic source ROI", fields: [["a","Channel revenue","channelRevenue"],["b","Channel spend","channelSpend"]], defaults: ["18000","4500"] },
    ],
  },
  {
    id: "Viral",
    file: "mktViral",
    compute: "computeMktViral",
    type: "MktViralSlug",
    hub: "mkt-bonus-viral",
    hubLabel: "Business · Marketing · High-intent and viral marketing calculators",
    exportArticles: "MKT_VIRAL_ARTICLES",
    seoFile: "mktViralContent",
    host: "MktViralCalculatorHost",
    tableTitle: "Viral & high-intent tools",
    calcs: [
      { slug: "mkt-revenue-lost-without-seo-calculator", title: "Revenue lost without SEO", fields: [["a","Addressable monthly searches","searchVol"],["b","Attainable CTR %","ctrPct"],["c","CVR %","cvrPct"],["d","AOV","aov"]], defaults: ["50000","5","2","80"] },
      { slug: "mkt-instagram-account-worth-calculator", title: "Instagram account worth", fields: [["a","Followers","followers"],["b","Worth per follower","worthPerFollower"]], defaults: ["50000","0.05"] },
      { slug: "mkt-youtube-channel-earnings-calculator", title: "YouTube earnings", fields: [["a","Monthly views","views"],["b","RPM ($ / 1000 views)","rpm"]], defaults: ["200000","4"] },
      { slug: "mkt-startup-growth-projection-calculator", title: "Startup growth projection", fields: [["a","Starting users / MRR","amount"],["b","Monthly growth %","growthPct"],["c","Months","months"]], defaults: ["1000","8","12"] },
      { slug: "mkt-ad-budget-vs-revenue-simulator", title: "Ad budget vs revenue", fields: [["a","Ad budget","spend"],["b","CPC","cpc"],["c","CVR %","cvrPct"],["d","AOV","aov"]], defaults: ["2000","1.5","3","70"] },
    ],
  },
];

const LETTERS = ["a","b","c","d","n","p","q","m","v","s","r","t","l","w","h"];
const URL_MAP = Object.fromEntries(LETTERS.map((l) => [l, l.toUpperCase()]));

function hostSource(sec) {
  const slugUnion = sec.type;
  const fallback = sec.calcs[0].slug;
  const configEntries = sec.calcs
    .map((c) => {
      const fieldLines = c.fields
        .map((f, i) => `      { key: "${f[0]}", label: ${JSON.stringify(f[1])}, prop: ${JSON.stringify(f[2])} as const },`)
        .join("\n");
      const defaults = c.fields
        .map((f, i) => `    ${f[0]}Default: ${JSON.stringify(c.defaults[i] ?? "")},`)
        .join("\n");
      return `  "${c.slug}": {
    title: ${JSON.stringify(c.title)},
    description: \`${c.title} calculator. ${DISCLAIMER}\`,
    fields: [
${fieldLines}
    ],
${defaults}
  },`;
    })
    .join("\n");

  return `"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { MKT_URL } from "@/lib/calculators/mktHelpers";
import {
  ${sec.compute},
  type MktCommonInput,
  type MktResult,
  type ${slugUnion},
} from "@/lib/calculators/${sec.file}";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type FieldDef = { key: string; label: string; prop: keyof MktCommonInput };

type Config = {
  title: string;
  description: string;
  fields: FieldDef[];
  aDefault?: string;
  bDefault?: string;
  cDefault?: string;
  dDefault?: string;
  nDefault?: string;
  pDefault?: string;
  qDefault?: string;
  mDefault?: string;
  vDefault?: string;
  sDefault?: string;
  rDefault?: string;
  tDefault?: string;
  lDefault?: string;
  wDefault?: string;
  hDefault?: string;
};

const CONFIG: Record<${slugUnion}, Config> = {
${configEntries}
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function formatResult(res: MktResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.value !== undefined) rows.push({ label: "Primary", value: num(res.value, 4) });
  if (res.rate !== undefined) rows.push({ label: "Rate %", value: num(res.rate, 2) });
  if (res.ratio !== undefined) rows.push({ label: "Ratio", value: num(res.ratio, 4) });
  if (res.cost !== undefined) rows.push({ label: "Cost", value: num(res.cost, 4) });
  if (res.revenue !== undefined) rows.push({ label: "Revenue", value: num(res.revenue, 2) });
  if (res.spend !== undefined) rows.push({ label: "Spend", value: num(res.spend, 2) });
  if (res.count !== undefined) rows.push({ label: "Count", value: num(res.count, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.value !== undefined ? num(res.value, 4)
    : res.rate !== undefined ? num(res.rate, 2)
    : "—";
  return { primary, primaryLabel: "Result", rows };
}

export function ${sec.host}({ slug }: { slug: string }) {
  const key = slug as ${slugUnion};
  const config = CONFIG[key] ?? CONFIG["${fallback}"];
  const [a, setA] = useState(useLoanInitialInput(MKT_URL.A, config.aDefault ?? ""));
  const [b, setB] = useState(useLoanInitialInput(MKT_URL.B, config.bDefault ?? ""));
  const [c, setC] = useState(useLoanInitialInput(MKT_URL.C, config.cDefault ?? ""));
  const [d, setD] = useState(useLoanInitialInput(MKT_URL.D, config.dDefault ?? ""));
  const [n, setN] = useState(useLoanInitialInput(MKT_URL.N, config.nDefault ?? ""));
  const [p, setP] = useState(useLoanInitialInput(MKT_URL.P, config.pDefault ?? ""));
  const [q, setQ] = useState(useLoanInitialInput(MKT_URL.Q, config.qDefault ?? ""));
  const [m, setM] = useState(useLoanInitialInput(MKT_URL.M, config.mDefault ?? ""));
  const [v, setV] = useState(useLoanInitialInput(MKT_URL.V, config.vDefault ?? ""));
  const [s, setS] = useState(useLoanInitialInput(MKT_URL.S, config.sDefault ?? ""));
  const [r, setR] = useState(useLoanInitialInput(MKT_URL.R, config.rDefault ?? ""));
  const [t, setT] = useState(useLoanInitialInput(MKT_URL.T, config.tDefault ?? ""));
  const [l, setL] = useState(useLoanInitialInput(MKT_URL.L, config.lDefault ?? ""));
  const [w, setW] = useState(useLoanInitialInput(MKT_URL.W, config.wDefault ?? ""));
  const [h, setH] = useState(useLoanInitialInput(MKT_URL.H, config.hDefault ?? ""));

  const getters: Record<string, string> = { a, b, c, d, n, p, q, m, v, s, r, t, l, w, h };
  const setters: Record<string, (v: string) => void> = {
    a: setA, b: setB, c: setC, d: setD, n: setN, p: setP, q: setQ, m: setM,
    v: setV, s: setS, r: setR, t: setT, l: setL, w: setW, h: setH,
  };

  const num = (nVal: number, dec = 2) => {
    if (!Number.isFinite(nVal)) return "—";
    const abs = Math.abs(nVal);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return nVal.toExponential(4);
    return nVal.toFixed(dec);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    for (const f of config.fields) {
      const val = getters[f.key] ?? "";
      if (val.trim() !== "") out[MKT_URL[f.key.toUpperCase() as keyof typeof MKT_URL]] = val;
    }
    return out;
  }, [config.fields, a, b, c, d, n, p, q, m, v, s, r, t, l, w, h]);

  useLoanUrlSync(shareParams, [a, b, c, d, n, p, q, m, v, s, r, t, l, w, h]);

  const result = useMemo(() => {
    const input: MktCommonInput = {};
    for (const f of config.fields) {
      const raw = getters[f.key] ?? "";
      if (raw.trim() === "") continue;
      const parsed = parseNonNegative(raw, f.label);
      if (!parsed.ok) return { error: parsed.error };
      (input as Record<string, number>)[f.prop] = parsed.value;
    }
    // Require first field positive when present
    if (config.fields[0]) {
      const raw = getters[config.fields[0].key] ?? "";
      const parsed = parsePositive(raw, config.fields[0].label);
      if (!parsed.ok) return { error: parsed.error };
      (input as Record<string, number>)[config.fields[0].prop] = parsed.value;
    }
    return formatResult(
      ${sec.compute}(key in CONFIG ? key : "${fallback}", input),
      num,
    );
  }, [a, b, c, d, n, p, q, m, v, s, r, t, l, w, h, config, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.fields.map((f) => (
            <div key={f.key}>
              <FieldLabel htmlFor={\`mkt-\${f.key}\`}>{f.label}</FieldLabel>
              <FieldInput
                id={\`mkt-\${f.key}\`}
                value={getters[f.key] ?? ""}
                onChange={(ev) => setters[f.key]?.(ev.target.value)}
                inputMode="decimal"
              />
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          {"error" in result ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--muted)]">{result.primaryLabel}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{result.primary}</p>
              </div>
              <div className="space-y-2 text-sm">
                {result.rows.map((row) => (
                  <Row key={row.label} label={row.label} value={row.value} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
`;
}

function seoSource(sec) {
  const rows = sec.calcs
    .map((c) => `          [${JSON.stringify(c.title)}, "Teaching metric from inputs"],`)
    .join("\n");
  const articles = sec.calcs
    .map((c) => {
      const kw = c.title.toLowerCase();
      return `  "${c.slug}": article(
    "${c.slug}",
    ${JSON.stringify(c.title)},
    [
      ${JSON.stringify(`${c.title} teaching calculator for marketers. Enter campaign metrics to estimate the result in your browser.`)},
      "Platform attribution windows, view-through credit, and fees differ — treat output as a planning aid and verify in your ad or analytics console.",
    ],
    {
      question: ${JSON.stringify(`What does the ${c.title} calculator estimate?`)},
      answer:
        "It applies a standard marketing formula to your inputs for teaching and planning. Real campaigns may use different attribution and cost definitions.",
    },
    ${JSON.stringify(`${c.title} Calculator — Marketing Teaching Estimate`)},
    ${JSON.stringify(`Estimate ${kw} from campaign inputs. Business marketing aid — platforms and costs vary.`)},
    [${JSON.stringify(kw + " calculator")}, "marketing metric", "campaign calculator"],
  ),`;
    })
    .join("\n");

  return `import type { RichArticle } from "./types";

const HUB_HREF = "/business/marketing/${sec.hub}";
const HUB_LABEL = ${JSON.stringify(sec.hubLabel)};
const SHELL =
  "Business marketing estimation tools that run in your browser. Not financial, legal, or tax advice. Ad platforms, attribution models, and fees vary — verify figures in your analytics and billing consoles.";

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "business",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: ${JSON.stringify(sec.tableTitle)},
        columnHeaders: ["Tool", "Core idea"],
        rows: [
${rows}
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your marketing inputs. Planning estimate only — platforms, attribution, and costs vary.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const ${sec.exportArticles}: Record<string, RichArticle> = {
${articles}
};
`;
}

// Generate hosts + SEO
for (const sec of SECTIONS) {
  write(`components/calculators/family/${sec.host}.tsx`, hostSource(sec));
  write(`lib/calculator-seo/${sec.seoFile}.ts`, seoSource(sec));
}

// Router
const routerImports = SECTIONS.map(
  (s) =>
    `import type { ${s.type} } from "@/lib/calculators/${s.file}";\nimport { ${s.host} } from "./${s.host}";`,
).join("\n");

const sets = SECTIONS.map((s) => {
  const list = s.calcs.map((c) => `  "${c.slug}",`).join("\n");
  return `const ${s.id.toUpperCase()} = new Set<string>([\n${list}\n] satisfies ${s.type}[]);`;
}).join("\n\n");

const ifs = SECTIONS.map(
  (s) => `  if (${s.id.toUpperCase()}.has(slug)) return <${s.host} slug={slug} />;`,
).join("\n");

write(
  "components/calculators/family/MktCalculatorRouter.tsx",
  `"use client";

${routerImports}

${sets}

export function MktCalculatorRouter({ slug }: { slug: string }) {
${ifs}
  return <${SECTIONS[0].host} slug={slug} />;
}
`,
);

// Smoke test covering all 91
const allSlugExports = SECTIONS.map((s) => {
  const arrName = `MKT_${s.id.toUpperCase()}_SLUGS`;
  // engines already export MKT_ADS_SLUGS etc - need matching names
  const map = {
    Ads: "MKT_ADS_SLUGS",
    Cro: "MKT_CRO_SLUGS",
    Revenue: "MKT_REVENUE_SLUGS",
    Email: "MKT_EMAIL_SLUGS",
    Social: "MKT_SOCIAL_SLUGS",
    Seo: "MKT_SEO_SLUGS",
    Ecom: "MKT_ECOM_SLUGS",
    Content: "MKT_CONTENT_SLUGS",
    Leads: "MKT_LEADS_SLUGS",
    Affiliate: "MKT_AFFILIATE_SLUGS",
    Saas: "MKT_SAAS_SLUGS",
    Analytics: "MKT_ANALYTICS_SLUGS",
    Viral: "MKT_VIRAL_SLUGS",
  };
  return { import: `import { ${s.compute}, ${map[s.id]} } from "./${s.file}";`, arr: map[s.id], compute: s.compute };
});

const smokeInput = `{
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
    }`;

write(
  "lib/calculators/mktEngines.test.ts",
  `import { describe, expect, it } from "vitest";
${allSlugExports.map((x) => x.import).join("\n")}

const ALL = [
${allSlugExports.map((x) => `  ...${x.arr},`).join("\n")}
] as const;

describe("marketing engines smoke", () => {
  it("covers every slug", () => {
    expect(ALL.length).toBe(91);
    const input = ${smokeInput};
    for (const slug of ALL) {
      let r;
      if (${allSlugExports[0].arr}.includes(slug as never)) r = ${allSlugExports[0].compute}(slug as never, input);
${allSlugExports
  .slice(1)
  .map(
    (x) =>
      `      else if (${x.arr}.includes(slug as never)) r = ${x.compute}(slug as never, input);`,
  )
  .join("\n")}
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
`,
);

const total = SECTIONS.reduce((n, s) => n + s.calcs.length, 0);
console.log("total calcs", total);
if (total !== 91) {
  console.error("Expected 91, got", total);
  process.exit(1);
}
