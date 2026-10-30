import type { RichArticle } from "./types";

const HUB_HREF = "/ai/generators/aigen-developer-tech";
const HUB_LABEL = "AI · Generators · Developer and tech";
const SHELL =
  "In-browser snippet and sample-data templates. Deterministic seeds are not CSPRNG. Never run unchecked SQL or ship demo secrets.";

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
        title: "Developer generators",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["JSON / API / SQL / regex", "Example templates"],
          ["Test data", "Seeded fixtures"],
          ["Password / key", "Deterministic teaching values"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption: "Share URL preserves seed and topic. Teaching templates — harden for production.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const SLUGS: [string, string][] = [
  ["aigen-json-generator", "JSON Generator"],
  ["aigen-api-request-generator", "API Request Generator"],
  ["aigen-regex-generator", "Regex Generator"],
  ["aigen-sql-query-generator", "SQL Query Generator"],
  ["aigen-test-data-generator", "Test Data Generator"],
  ["aigen-password-generator", "Password Generator"],
  ["aigen-encryption-key-generator", "Encryption Key Generator"],
  ["aigen-code-snippet-generator", "Code Snippet Generator"],
];

export const AIGEN_DEVELOPER_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  SLUGS.map(([slug, title]) => [
    slug,
    article(
      slug,
      title,
      [
        `${title} returns example templates or deterministic demo values from your inputs.`,
        "Review security and correctness before using anything in real systems.",
      ],
      {
        question: `Are passwords/keys from ${title} production-safe?`,
        answer:
          "No. Seeded generators are for teaching demos. Use OS or library CSPRNG for real secrets.",
      },
      `${title} — AI Developer Template`,
      `Generate a ${title.toLowerCase()} template in your browser. Teaching aid — harden for production.`,
      [title.toLowerCase(), "dev snippet generator", "test data generator"],
    ),
  ]),
);
