import type { RichArticle } from "./types";

const HUB_HREF = "/ai/generators/aigen-creative-design";
const HUB_LABEL = "AI · Generators · Creative and design";
const SHELL =
  "In-browser palette, naming, and pairing ideas. Check trademarks, domains, and contrast before shipping brand assets.";

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
        title: "Creative generators",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Palette / gradient", "Seeded color ideas"],
          ["Logo / brand / slogan", "Naming concepts"],
          ["Font pairing", "Typography suggestions"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption: "Share URL preserves brand seed. Creative draft — verify legal and accessibility.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const SLUGS: [string, string][] = [
  ["aigen-color-palette-generator", "Color Palette Generator"],
  ["aigen-gradient-generator", "Gradient Generator"],
  ["aigen-logo-idea-generator", "Logo Idea Generator"],
  ["aigen-brand-name-generator", "Brand Name Generator"],
  ["aigen-slogan-generator", "Slogan Generator"],
  ["aigen-font-pairing-generator", "Font Pairing Generator"],
];

export const AIGEN_CREATIVE_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  SLUGS.map(([slug, title]) => [
    slug,
    article(
      slug,
      title,
      [
        `${title} offers quick creative sparks from a brand seed and tone.`,
        "Always check contrast, licensing, and name availability before committing.",
      ],
      {
        question: `Can I trademark names from ${title}?`,
        answer:
          "These are idea sparks only. Run proper trademark and domain checks before use.",
      },
      `${title} — AI Creative Draft Template`,
      `Explore ${title.toLowerCase()} ideas in your browser. Draft for inspiration — verify before shipping.`,
      [title.toLowerCase(), "brand generator", "design draft"],
    ),
  ]),
);
