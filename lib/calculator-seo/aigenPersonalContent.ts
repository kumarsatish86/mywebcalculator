import type { RichArticle } from "./types";

const HUB_HREF = "/ai/generators/aigen-personal-life";
const HUB_LABEL = "AI · Generators · Personal life";
const SHELL =
  "In-browser names, gifts, and event outlines. Compatibility scores are entertainment only. Not counseling or legal advice.";

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
        title: "Personal generators",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Names / usernames / nicknames", "Naming sparks"],
          ["Compatibility", "Playful score"],
          ["Wedding / gifts", "Event idea drafts"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption: "Share URL preserves personal inputs. Light drafts — verify names and plans yourself.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const SLUGS: [string, string][] = [
  ["aigen-name-generator-baby-business-domain", "Name Generator (Baby, Business, Domain)"],
  ["aigen-username-generator", "Username Generator"],
  ["aigen-nickname-generator", "Nickname Generator"],
  ["aigen-love-compatibility-generator", "Love Compatibility Generator"],
  ["aigen-wedding-plan-generator", "Wedding Plan Generator"],
  ["aigen-gift-idea-generator", "Gift Idea Generator"],
];

export const AIGEN_PERSONAL_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  SLUGS.map(([slug, title]) => [
    slug,
    article(
      slug,
      title,
      [
        `${title} creates light personal-life drafts from simple inputs.`,
        "Be thoughtful with nicknames and compatibility tools — they are for fun, not expert guidance.",
      ],
      {
        question: `Should I trust ${title} for important decisions?`,
        answer:
          "No. Use outputs as playful inspiration only. Important personal decisions need human judgment and professionals when relevant.",
      },
      `${title} — AI Personal Draft Template`,
      `Try the ${title.toLowerCase()} in your browser. Inspiration only — verify before use.`,
      [title.toLowerCase(), "name generator", "personal draft"],
    ),
  ]),
);
