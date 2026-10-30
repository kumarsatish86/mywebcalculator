import type { RichArticle } from "./types";

const HUB_HREF = "/ai/generators/aigen-content-writing";
const HUB_LABEL = "AI · Generators · Content and writing";
const SHELL =
  "In-browser template drafts for writing and email. Not a live AI model. Verify before use — not professional or legal advice.";

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
        title: "Content generators",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Paragraph / essay / story", "Structured outlines"],
          ["Resume / cover / SOP", "Career document scaffolds"],
          ["Social / email", "Post and message drafts"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption: "Share URL preserves topic and tone inputs. Draft for inspiration — verify before publishing.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const SLUGS: [string, string][] = [
  ["aigen-paragraph-generator", "Paragraph Generator"],
  ["aigen-essay-generator", "Essay Generator"],
  ["aigen-story-generator", "Story Generator"],
  ["aigen-article-generator", "Article Generator"],
  ["aigen-blog-post-generator", "Blog Post Generator"],
  ["aigen-sentence-rewriter", "Sentence Rewriter"],
  ["aigen-resume-bullet-generator", "Resume Bullet Generator"],
  ["aigen-cover-letter-generator", "Cover Letter Generator"],
  ["aigen-sop-generator", "SOP Generator"],
  ["aigen-linkedin-summary-generator", "LinkedIn Summary Generator"],
  ["aigen-bio-generator", "Bio Generator"],
  ["aigen-personal-statement-generator", "Personal Statement Generator"],
  ["aigen-linkedin-post-generator", "LinkedIn Post Generator"],
  ["aigen-twitter-thread-generator", "Twitter Thread Generator"],
  ["aigen-instagram-caption-generator", "Instagram Caption Generator"],
  ["aigen-youtube-description-generator", "YouTube Description Generator"],
  ["aigen-hashtag-generator", "Hashtag Generator"],
  ["aigen-viral-hook-generator", "Viral Hook Generator"],
  ["aigen-email-reply-generator", "Email Reply Generator"],
  ["aigen-cold-email-generator", "Cold Email Generator"],
  ["aigen-follow-up-email-generator", "Follow-up Email Generator"],
  ["aigen-apology-email-generator", "Apology Email Generator"],
  ["aigen-professional-email-generator", "Professional Email Generator"],
];

export const AIGEN_CONTENT_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  SLUGS.map(([slug, title]) => [
    slug,
    article(
      slug,
      title,
      [
        `${title} builds a short in-browser outline from your topic, tone, and audience. It is a template tool — not a live language model.`,
        "Treat the draft as inspiration. Edit for accuracy, voice, and policy requirements before you send or publish.",
      ],
      {
        question: `What does the ${title} produce?`,
        answer:
          "A structured draft outline or bullet plan based on your inputs. Always verify facts and tone before use; it is not professional writing or legal advice.",
      },
      `${title} — AI Writing Draft Template`,
      `Create a ${title.toLowerCase()} outline in your browser. Teaching draft only — verify before use.`,
      [title.toLowerCase(), "ai writing generator", "draft template"],
    ),
  ]),
);
