import type { CalculatorCategory } from "@/lib/types";
import type { CalculatorFaqItem } from "@/lib/types";

export type RichArticleVertical =
  | "engineering-electrical"
  | "health-body"
  | "education-math"
  | "finance-loan";

export type RichProseSection = {
  heading: string;
  paragraphs: string[];
};

export type RichDataTable = {
  title: string;
  columnHeaders: string[];
  rows: string[][];
};

export type RichChartKind = "loanBalanceDemo" | "sparkTrendDemo" | "none";

export type RichArticleChart = {
  kind: RichChartKind;
  title: string;
  caption: string;
  /** For sparkTrendDemo: y values 0..1 normalized trend */
  sparkValues?: number[];
};

export type RichArticleMeta = {
  /** Overrides page <title> when set */
  seoTitle?: string;
  /** Overrides meta description */
  seoDescription?: string;
  /** Extra keywords merged with registry */
  keywords?: string[];
};

export type RichArticle = {
  slug: string;
  vertical: RichArticleVertical;
  category: CalculatorCategory;
  /** Ultra-short non-prose shell (privacy / browser-only) */
  shellNote?: string;
  sections: RichProseSection[];
  tables: RichDataTable[];
  chart: RichArticleChart;
  /** Slug-specific FAQs (merged ahead of registry FAQs on the page) */
  faq: CalculatorFaqItem[];
  meta: RichArticleMeta;
  /** Hub path for contextual crawl links */
  hubHref: string;
  hubLabel: string;
};
