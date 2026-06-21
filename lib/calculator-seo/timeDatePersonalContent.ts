import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/time-date/tdate-personal-events";
const HUB_LABEL = "Conversion · Personal life & events";
const SHELL = "Personal date tools run in your browser. Pregnancy and health timing are for planning only — not medical advice.";

function article(slug: string, heading: string, paragraph: string, seoTitle: string, seoDescription: string, keywords: string[]): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "conversion",
    shellNote: SHELL,
    sections: [{ heading, paragraphs: [paragraph] }],
    tables: [{ title: "Quick tip", columnHeaders: ["Topic", "Note"], rows: [["Pregnancy", "Confirm due dates with a clinician"], ["Zodiac", "Tropical calendar-based signs"]] }],
    chart: { kind: "sparkTrendDemo", title: "Enter dates → see milestones", caption: "Share URL preserves your inputs.", sparkValues: [0.25, 0.5, 0.75, 1] },
    faq: [{ question: "Is this medical advice?", answer: "No — these tools are for education and rough planning only." }],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const TIME_DATE_PERSONAL_ARTICLES: Record<string, RichArticle> = {
  "tdate-exact-age-calculator": article("tdate-exact-age-calculator", "Exact Age", "Age to the second with birth time.", "Exact Age Calculator", "Calculate exact age in years months days seconds.", ["exact age calculator"]),
  "tdate-birthday-countdown": article("tdate-birthday-countdown", "Birthday Countdown", "Time until your next birthday.", "Birthday Countdown Calculator", "Count down to your next birthday.", ["birthday countdown"]),
  "tdate-zodiac-sign-calculator": article("tdate-zodiac-sign-calculator", "Zodiac Sign", "Sun sign from birth date.", "Zodiac Sign Calculator", "Find your zodiac sign by birth date.", ["zodiac sign calculator"]),
  "tdate-life-path-number-calculator": article("tdate-life-path-number-calculator", "Life Path Number", "Numerology from birth date.", "Life Path Number Calculator", "Calculate numerology life path number.", ["life path number calculator"]),
  "tdate-pregnancy-due-date-calculator": article("tdate-pregnancy-due-date-calculator", "Due Date", "Estimated due date from LMP.", "Pregnancy Due Date Calculator", "Estimate pregnancy due date from last period.", ["pregnancy due date calculator"]),
  "tdate-ovulation-calculator": article("tdate-ovulation-calculator", "Ovulation", "Fertile window estimate.", "Ovulation Calculator", "Estimate ovulation and fertile window.", ["ovulation calculator"]),
  "tdate-baby-age-calculator": article("tdate-baby-age-calculator", "Baby Age", "Infant age in weeks and days.", "Baby Age Calculator", "Calculate baby age in weeks and months.", ["baby age calculator"]),
  "tdate-anniversary-calculator": article("tdate-anniversary-calculator", "Anniversary", "Years together and next anniversary.", "Anniversary Calculator", "Calculate anniversary years and countdown.", ["anniversary calculator"]),
};
