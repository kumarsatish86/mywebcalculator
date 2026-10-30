import type { RichArticle } from "./types";

const HUB_HREF = "/ai/generators/aigen-travel-lifestyle";
const HUB_LABEL = "AI · Generators · Travel and lifestyle";
const SHELL =
  "In-browser itinerary and packing drafts. Not travel insurance or booking advice. Confirm local conditions before you go.";

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
        title: "Travel generators",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Itinerary / daily plan", "Day scaffolds"],
          ["Packing list", "Checklist draft"],
          ["Trip budget", "Spend split sketch"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption: "Share URL preserves destination and days. Travel draft — verify bookings and safety.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const SLUGS: [string, string][] = [
  ["aigen-travel-itinerary-generator", "Travel Itinerary Generator"],
  ["aigen-packing-list-generator", "Packing List Generator"],
  ["aigen-trip-budget-generator", "Trip Budget Generator"],
  ["aigen-daily-travel-plan-generator", "Daily Travel Plan Generator"],
];

export const AIGEN_TRAVEL_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  SLUGS.map(([slug, title]) => [
    slug,
    article(
      slug,
      title,
      [
        `${title} drafts a short travel plan from destination, days, and budget inputs.`,
        "Conditions change — confirm opening hours, visas, and safety guidance independently.",
      ],
      {
        question: `Is the ${title} a booking tool?`,
        answer:
          "No. It only outlines ideas. Book and verify details with official sources and providers.",
      },
      `${title} — AI Travel Draft Template`,
      `Plan with a ${title.toLowerCase()} outline in your browser. Inspiration only — verify before travel.`,
      [title.toLowerCase(), "travel itinerary generator", "trip draft"],
    ),
  ]),
);
