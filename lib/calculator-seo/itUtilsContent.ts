import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/it-dev/it-dev-utilities";
const HUB_LABEL = "Engineering · IT/Dev · Developer utilities";
const SHELL =
  "IT and developer education tools that run in your browser. Not a substitute for production security review, certified capacity planning, or vendor documentation. Stack assumptions and defaults are simplified — validate with your team before deploying.";

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
    vertical: "engineering-electrical",
    category: "engineering",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Developer utility tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["UUID generator", "RFC 4122 unique identifiers"],
          ["Random number", "Bounded integer/float draws"],
          ["Random string", "Charset-configurable tokens"],
          ["Slug generator", "URL-safe titles"],
          ["Case converter", "UPPER, lower, snake, camel"],
          ["Text diff", "Line or word change view"],
          ["Line count", "Lines in text or code"],
          ["Character count", "Chars, words, bytes"],
          ["Regex tester", "Pattern match & capture groups"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your utility inputs where supported. Educational IT aid only — use vetted libraries for production IDs and validation.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const IT_UTILS_ARTICLES: Record<string, RichArticle> = {
  "it-uuid-generator": article(
    "it-uuid-generator",
    "UUID generator",
    [
      "Creates RFC 4122 UUIDs (v4 random) for teaching primary keys, correlation IDs, and distributed ID patterns.",
      "Use cryptographically secure RNG in production services — browser demos are fine for local dev fixtures.",
    ],
    {
      question: "UUID v4 vs ULID — which to use?",
      answer:
        "v4 is random and ubiquitous. ULIDs are time-sortable and URL-safe — pick based on index locality and sort needs.",
    },
    "UUID Generator — RFC 4122 Unique IDs",
    "Generate UUID v4 identifiers in your browser. Educational dev aid — use secure RNG in production APIs.",
    ["uuid generator", "guid generator", "rfc 4122 uuid v4"],
  ),
  "it-random-number-generator": article(
    "it-random-number-generator",
    "Random number generator",
    [
      "Draws random integers or floats within configurable min/max bounds for testing and simulation literacy.",
      "Math.random() is not crypto-grade — use crypto.getRandomValues for secrets, tokens, and lottery fairness.",
    ],
    {
      question: "When is Math.random enough?",
      answer:
        "UI demos, load-test data, and non-security simulations. Never for passwords, session IDs, or cryptographic keys.",
    },
    "Random Number Generator — Bounded Integer & Float",
    "Generate random numbers in a range for testing literacy. Educational tool — use CSPRNG for secrets.",
    ["random number generator", "random int in range", "developer random number"],
  ),
  "it-random-string-generator": article(
    "it-random-string-generator",
    "Random string generator",
    [
      "Builds random strings from selected character sets for mock API keys, test fixtures, and placeholder data.",
      "Entropy scales with length and charset size — short alphanumeric strings guess quickly if exposed.",
    ],
    {
      question: "How long for a secure token?",
      answer:
        "128+ bits of entropy is a common target — e.g. 22+ chars from base64 or 32 hex chars from secure random bytes.",
    },
    "Random String Generator — Configurable Charset Tokens",
    "Generate random strings for test data and token literacy. Not for production secrets without CSPRNG.",
    ["random string generator", "random alphanumeric string", "test token generator"],
  ),
  "it-slug-generator": article(
    "it-slug-generator",
    "Slug generator",
    [
      "Converts titles to URL-safe slugs (lowercase, hyphenated, stripped punctuation) for CMS and routing literacy.",
      "Collision handling and unicode transliteration rules vary — slugify libraries differ on non-Latin titles.",
    ],
    {
      question: "Can two titles share one slug?",
      answer:
        "Yes if titles normalize the same. Production CMS apps append suffixes or IDs to guarantee unique paths.",
    },
    "Slug Generator — URL-Safe Title Paths",
    "Create URL slugs from titles for routing and SEO literacy. Educational aid — enforce uniqueness in CMS.",
    ["slug generator", "url slug from title", "seo friendly slug"],
  ),
  "it-case-converter-upper-lower-snake-camel": article(
    "it-case-converter-upper-lower-snake-camel",
    "Case converter (UPPER/lower/snake/camel)",
    [
      "Transforms identifiers among UPPER, lower, snake_case, camelCase, and PascalCase for refactors and API mapping.",
      "Acronyms (HTTP, URL) split inconsistently across languages — pick one convention per codebase.",
    ],
    {
      question: "snake_case vs camelCase in JSON?",
      answer:
        "JSON has no standard — teams pick one and enforce with linters. JavaScript often uses camelCase; Python APIs often snake_case.",
    },
    "Case Converter — UPPER, lower, snake & camelCase",
    "Convert naming cases for code and API mapping literacy. Educational dev tool — document team convention.",
    ["case converter", "snake case to camelCase", "identifier case transform"],
  ),
  "it-text-diff-checker": article(
    "it-text-diff-checker",
    "Text diff checker",
    [
      "Highlights added, removed, and changed lines between two text blocks for config and document review.",
      "Semantic diff for JSON/XML and binary files needs specialized tools — line diff is for plain text literacy.",
    ],
    {
      question: "Why do line endings affect diffs?",
      answer:
        "CRLF vs LF shows whole-line changes. Normalize line endings in git with .gitattributes for cleaner reviews.",
    },
    "Text Diff Checker — Compare Two Text Blocks",
    "Diff two text inputs for code and config review literacy. Educational aid — use VCS diff in production workflow.",
    ["text diff checker", "compare two texts", "line diff tool"],
  ),
  "it-line-count-tool": article(
    "it-line-count-tool",
    "Line count tool",
    [
      "Counts lines in pasted text or code snippets for estimation, billing discussions, and documentation metrics.",
      "Blank vs code vs comment lines need cloc-style rules for meaningful LOC — raw line count includes empties.",
    ],
    {
      question: "Does line count equal code size?",
      answer:
        "No. Complexity and dependencies matter more than LOC. Use line counts as a rough signal, not quality metric.",
    },
    "Line Count Tool — Lines in Text or Code",
    "Count lines in pasted content for estimation literacy. Educational tool — use cloc for repo metrics.",
    ["line count tool", "count lines of text", "loc counter paste"],
  ),
  "it-character-count-tool": article(
    "it-character-count-tool",
    "Character count tool",
    [
      "Reports characters, words, and byte length for meta descriptions, tweets, SMS segments, and API limits.",
      "Unicode graphemes can be multiple code points — social platforms count characters differently than UTF-16 length.",
    ],
    {
      question: "Why is emoji length confusing?",
      answer:
        "Some emoji use multiple code points (ZWJ sequences). Platforms count grapheme clusters, not JavaScript string.length alone.",
    },
    "Character Count Tool — Chars, Words & Bytes",
    "Count characters and words for limit literacy. Educational aid — test on target platform APIs.",
    ["character count tool", "word count online", "string length calculator"],
  ),
  "it-regex-tester": article(
    "it-regex-tester",
    "Regex tester",
    [
      "Matches patterns against sample text showing captures and flags for learning regular expression syntax.",
      "ReDoS catastrophic backtracking is a real risk — avoid naive regex on untrusted input in server code.",
    ],
    {
      question: "Why does my regex not match?",
      answer:
        "Check flags (i, m, s), escaping, greedy vs lazy quantifiers, and anchor ^$. Test edge cases and empty strings.",
    },
    "Regex Tester — Pattern Match & Capture Groups",
    "Test regular expressions against sample strings. Educational dev aid — audit regex on untrusted input.",
    ["regex tester", "regular expression test", "regex match online"],
  ),
};
