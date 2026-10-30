import type { RichArticle } from "./types";

const HUB_HREF = "/ai/generators/aigen-marketing-seo";
const HUB_LABEL = "AI · Generators · Marketing and SEO";
const SHELL =
  "In-browser SEO and copy drafts. Not a live AI writer or ranking guarantee. Edit and verify before publishing.";

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
    category: "ai",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Marketing generators",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["SEO title / meta / keywords", "Search copy ideas"],
          ["Blog topics / ads", "Campaign sparks"],
          ["Landing / product copy", "Page section drafts"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption: "Share URL preserves topic and tone. Marketing draft only — rankings and ads vary.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const SLUGS: [string, string][] = [
  ["aigen-seo-title-generator", "SEO Title Generator"],
  ["aigen-meta-description-generator", "Meta Description Generator"],
  ["aigen-keyword-idea-generator", "Keyword Idea Generator"],
  ["aigen-blog-topic-generator", "Blog Topic Generator"],
  ["aigen-ad-copy-generator", "Ad Copy Generator"],
  ["aigen-landing-page-copy-generator", "Landing Page Copy Generator"],
  ["aigen-product-description-generator", "Product Description Generator"],
];

export const AIGEN_MARKETING_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  SLUGS.map(([slug, title]) => [
    slug,
    article(
      slug,
      title,
      [
        `${title} suggests structured marketing copy ideas from topic, tone, and audience.`,
        "Test messaging with real analytics. Templates do not guarantee SEO or ad performance.",
      ],
      {
        question: `Will ${title} improve rankings?`,
        answer:
          "It only drafts copy ideas. Rankings depend on many factors — treat output as a starting point to edit.",
      },
      `${title} — AI Marketing Draft Template`,
      `Create ${title.toLowerCase()} ideas in your browser. Teaching draft — verify before publishing.`,
      [title.toLowerCase(), "seo copy generator", "marketing draft"],
    ),
  ]),
);
