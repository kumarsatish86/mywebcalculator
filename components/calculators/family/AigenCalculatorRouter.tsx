"use client";

import type { AigenContentSlug } from "@/lib/calculators/aigenContent";
import { AigenContentCalculatorHost } from "./AigenContentCalculatorHost";
import type { AigenFinanceSlug } from "@/lib/calculators/aigenFinance";
import { AigenFinanceCalculatorHost } from "./AigenFinanceCalculatorHost";
import type { AigenEducationSlug } from "@/lib/calculators/aigenEducation";
import { AigenEducationCalculatorHost } from "./AigenEducationCalculatorHost";
import type { AigenHealthSlug } from "@/lib/calculators/aigenHealth";
import { AigenHealthCalculatorHost } from "./AigenHealthCalculatorHost";
import type { AigenBusinessSlug } from "@/lib/calculators/aigenBusiness";
import { AigenBusinessCalculatorHost } from "./AigenBusinessCalculatorHost";
import type { AigenMarketingSlug } from "@/lib/calculators/aigenMarketing";
import { AigenMarketingCalculatorHost } from "./AigenMarketingCalculatorHost";
import type { AigenDeveloperSlug } from "@/lib/calculators/aigenDeveloper";
import { AigenDeveloperCalculatorHost } from "./AigenDeveloperCalculatorHost";
import type { AigenCreativeSlug } from "@/lib/calculators/aigenCreative";
import { AigenCreativeCalculatorHost } from "./AigenCreativeCalculatorHost";
import type { AigenTravelSlug } from "@/lib/calculators/aigenTravel";
import { AigenTravelCalculatorHost } from "./AigenTravelCalculatorHost";
import type { AigenPersonalSlug } from "@/lib/calculators/aigenPersonal";
import { AigenPersonalCalculatorHost } from "./AigenPersonalCalculatorHost";
import type { AigenSmartSlug } from "@/lib/calculators/aigenSmart";
import { AigenSmartCalculatorHost } from "./AigenSmartCalculatorHost";
import type { AigenAdvancedSlug } from "@/lib/calculators/aigenAdvanced";
import { AigenAdvancedCalculatorHost } from "./AigenAdvancedCalculatorHost";

const CONTENT = new Set<string>([
  "aigen-paragraph-generator",
  "aigen-essay-generator",
  "aigen-story-generator",
  "aigen-article-generator",
  "aigen-blog-post-generator",
  "aigen-sentence-rewriter",
  "aigen-resume-bullet-generator",
  "aigen-cover-letter-generator",
  "aigen-sop-generator",
  "aigen-linkedin-summary-generator",
  "aigen-bio-generator",
  "aigen-personal-statement-generator",
  "aigen-linkedin-post-generator",
  "aigen-twitter-thread-generator",
  "aigen-instagram-caption-generator",
  "aigen-youtube-description-generator",
  "aigen-hashtag-generator",
  "aigen-viral-hook-generator",
  "aigen-email-reply-generator",
  "aigen-cold-email-generator",
  "aigen-follow-up-email-generator",
  "aigen-apology-email-generator",
  "aigen-professional-email-generator",
] satisfies AigenContentSlug[]);

const FINANCE = new Set<string>([
  "aigen-budget-planner-generator",
  "aigen-expense-breakdown-generator",
  "aigen-savings-plan-generator",
  "aigen-loan-repayment-plan-generator",
  "aigen-debt-payoff-strategy-generator",
  "aigen-investment-portfolio-generator",
  "aigen-retirement-plan-generator",
  "aigen-emi-breakdown-generator",
  "aigen-passive-income-plan-generator",
] satisfies AigenFinanceSlug[]);

const EDUCATION = new Set<string>([
  "aigen-study-plan-generator",
  "aigen-timetable-generator",
  "aigen-revision-plan-generator",
  "aigen-exam-strategy-generator",
  "aigen-notes-generator",
  "aigen-flashcards-generator",
  "aigen-quiz-generator",
  "aigen-mcq-generator",
  "aigen-practice-question-generator",
  "aigen-concept-explanation-generator",
] satisfies AigenEducationSlug[]);

const HEALTH = new Set<string>([
  "aigen-workout-plan-generator",
  "aigen-home-workout-generator",
  "aigen-gym-routine-generator",
  "aigen-weight-loss-plan-generator",
  "aigen-diet-plan-generator",
  "aigen-meal-plan-generator",
  "aigen-calorie-intake-plan-generator",
  "aigen-keto-vegetarian-diet-generator",
  "aigen-sleep-schedule-generator",
  "aigen-meditation-plan-generator",
  "aigen-daily-routine-generator",
] satisfies AigenHealthSlug[]);

const BUSINESS = new Set<string>([
  "aigen-business-plan-generator",
  "aigen-startup-idea-generator",
  "aigen-pitch-deck-content-generator",
  "aigen-swot-analysis-generator",
  "aigen-daily-planner-generator",
  "aigen-weekly-planner-generator",
  "aigen-goal-breakdown-generator",
  "aigen-habit-tracker-generator",
  "aigen-to-do-list-generator",
] satisfies AigenBusinessSlug[]);

const MARKETING = new Set<string>([
  "aigen-seo-title-generator",
  "aigen-meta-description-generator",
  "aigen-keyword-idea-generator",
  "aigen-blog-topic-generator",
  "aigen-ad-copy-generator",
  "aigen-landing-page-copy-generator",
  "aigen-product-description-generator",
] satisfies AigenMarketingSlug[]);

const DEVELOPER = new Set<string>([
  "aigen-json-generator",
  "aigen-api-request-generator",
  "aigen-regex-generator",
  "aigen-sql-query-generator",
  "aigen-test-data-generator",
  "aigen-password-generator",
  "aigen-encryption-key-generator",
  "aigen-code-snippet-generator",
] satisfies AigenDeveloperSlug[]);

const CREATIVE = new Set<string>([
  "aigen-color-palette-generator",
  "aigen-gradient-generator",
  "aigen-logo-idea-generator",
  "aigen-brand-name-generator",
  "aigen-slogan-generator",
  "aigen-font-pairing-generator",
] satisfies AigenCreativeSlug[]);

const TRAVEL = new Set<string>([
  "aigen-travel-itinerary-generator",
  "aigen-packing-list-generator",
  "aigen-trip-budget-generator",
  "aigen-daily-travel-plan-generator",
] satisfies AigenTravelSlug[]);

const PERSONAL = new Set<string>([
  "aigen-name-generator-baby-business-domain",
  "aigen-username-generator",
  "aigen-nickname-generator",
  "aigen-love-compatibility-generator",
  "aigen-wedding-plan-generator",
  "aigen-gift-idea-generator",
] satisfies AigenPersonalSlug[]);

const SMART = new Set<string>([
  "aigen-ai-career-path-generator",
  "aigen-ai-skill-gap-analyzer",
  "aigen-ai-resume-score-calculator",
  "aigen-ai-investment-advisor",
  "aigen-ai-budget-optimizer",
  "aigen-ai-learning-path-generator",
  "aigen-ai-productivity-analyzer",
] satisfies AigenSmartSlug[]);

const ADVANCED = new Set<string>([
  "aigen-salary-to-financial-plan-generator",
  "aigen-goal-to-roadmap-generator",
  "aigen-resume-to-improvement-plan-generator",
  "aigen-expenses-to-savings-strategy-generator",
  "aigen-marks-to-study-strategy-generator",
] satisfies AigenAdvancedSlug[]);

export function AigenCalculatorRouter({ slug }: { slug: string }) {
  if (CONTENT.has(slug)) return <AigenContentCalculatorHost slug={slug} />;
  if (FINANCE.has(slug)) return <AigenFinanceCalculatorHost slug={slug} />;
  if (EDUCATION.has(slug)) return <AigenEducationCalculatorHost slug={slug} />;
  if (HEALTH.has(slug)) return <AigenHealthCalculatorHost slug={slug} />;
  if (BUSINESS.has(slug)) return <AigenBusinessCalculatorHost slug={slug} />;
  if (MARKETING.has(slug)) return <AigenMarketingCalculatorHost slug={slug} />;
  if (DEVELOPER.has(slug)) return <AigenDeveloperCalculatorHost slug={slug} />;
  if (CREATIVE.has(slug)) return <AigenCreativeCalculatorHost slug={slug} />;
  if (TRAVEL.has(slug)) return <AigenTravelCalculatorHost slug={slug} />;
  if (PERSONAL.has(slug)) return <AigenPersonalCalculatorHost slug={slug} />;
  if (SMART.has(slug)) return <AigenSmartCalculatorHost slug={slug} />;
  if (ADVANCED.has(slug)) return <AigenAdvancedCalculatorHost slug={slug} />;
  return <AigenContentCalculatorHost slug={slug} />;
}
