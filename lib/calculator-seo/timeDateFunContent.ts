import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/time-date/tdate-fun-viral";
const HUB_LABEL = "Conversion · Fun & viral time";
const SHELL = "Lighthearted date tools for sharing and planning fun — not medical or legal advice.";

function article(slug: string, heading: string, paragraph: string, seoTitle: string, seoDescription: string, keywords: string[]): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "conversion",
    shellNote: SHELL,
    sections: [{ heading, paragraphs: [paragraph] }],
    tables: [{ title: "Quick tip", columnHeaders: ["Topic", "Note"], rows: [["Sleep", "90-min cycles + 15 min buffer"], ["Weekend", "Counts until Saturday"]] }],
    chart: { kind: "sparkTrendDemo", title: "Pick a date → see countdown", caption: "Share URL preserves inputs.", sparkValues: [0.3, 0.5, 0.8, 1] },
    faq: [{ question: "Are heartbeat stats real?", answer: "No — they are rough estimates for fun." }],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const TIME_DATE_FUN_ARTICLES: Record<string, RichArticle> = {
  "tdate-days-until-weekend-calculator": article("tdate-days-until-weekend-calculator", "Days Until Weekend", "Countdown to Saturday.", "Days Until Weekend Calculator", "How many days until the weekend?", ["days until weekend"]),
  "tdate-days-until-new-year-calculator": article("tdate-days-until-new-year-calculator", "New Year Countdown", "Days until January 1.", "Days Until New Year Calculator", "Countdown to new year.", ["days until new year"]),
  "tdate-how-many-days-alive-calculator": article("tdate-how-many-days-alive-calculator", "Days Alive", "Total days you've been alive.", "How Many Days Alive Calculator", "Calculate days alive since birth.", ["days alive calculator"]),
  "tdate-sleep-calculator-best-time": article("tdate-sleep-calculator-best-time", "Sleep Calculator", "Best bedtimes from wake time.", "Sleep Calculator Best Time", "Calculate ideal sleep times.", ["sleep calculator"]),
  "tdate-love-duration-calculator": article("tdate-love-duration-calculator", "Love Duration", "Time together since your date.", "Love Duration Calculator", "Calculate relationship duration.", ["love duration calculator"]),
};
