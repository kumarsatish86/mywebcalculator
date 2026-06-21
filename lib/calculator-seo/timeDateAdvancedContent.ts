import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/time-date/tdate-advanced";
const HUB_LABEL = "Conversion · Advanced time & date";
const SHELL = "Runs in your browser with IANA time zones and calendar math. Not for legal contracts or travel bookings.";

function article(slug: string, heading: string, paragraph: string, seoTitle: string, seoDescription: string, keywords: string[]): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "conversion",
    shellNote: SHELL,
    sections: [{ heading, paragraphs: [paragraph] }],
    tables: [{ title: "Quick tip", columnHeaders: ["Topic", "Note"], rows: [["Business days", "Weekends only — no holiday list"], ["Time zones", "DST applied on selected date"]] }],
    chart: { kind: "sparkTrendDemo", title: "Adjust inputs → see result", caption: "Share URL preserves your inputs.", sparkValues: [0.2, 0.45, 0.7, 1] },
    faq: [{ question: "Are holidays excluded?", answer: "Business-day tools skip Sat–Sun only; public holidays are not subtracted." }],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const TIME_DATE_ADVANCED_ARTICLES: Record<string, RichArticle> = {
  "tdate-add-days-to-date-calculator": article("tdate-add-days-to-date-calculator", "Add Days to Date", "Shift any date forward by N calendar days.", "Add Days to Date Calculator", "Add days to a date and see the result weekday.", ["add days to date"]),
  "tdate-subtract-days-from-date-calculator": article("tdate-subtract-days-from-date-calculator", "Subtract Days", "Move backward N calendar days from a start date.", "Subtract Days from Date Calculator", "Subtract days from any date.", ["subtract days from date"]),
  "tdate-business-days-calculator": article("tdate-business-days-calculator", "Business Days", "Count Mon–Fri days between two dates.", "Business Days Calculator", "Calculate business days between dates.", ["business days calculator"]),
  "tdate-working-days-calculator": article("tdate-working-days-calculator", "Working Days", "Working-day share and weekend breakdown.", "Working Days Calculator", "Count working days in a date range.", ["working days calculator"]),
  "tdate-week-number-calculator": article("tdate-week-number-calculator", "Week Number", "ISO week number for any date.", "Week Number Calculator", "Find ISO-8601 week number of a date.", ["week number calculator"]),
  "tdate-time-zone-converter": article("tdate-time-zone-converter", "Time Zone Converter", "Convert times between IANA zones.", "Time Zone Converter", "Convert date and time between time zones.", ["time zone converter"]),
  "tdate-world-clock": article("tdate-world-clock", "World Clock", "Compare current time in three cities.", "World Clock", "See current time in multiple time zones.", ["world clock"]),
  "tdate-meeting-time-planner": article("tdate-meeting-time-planner", "Meeting Planner", "Three-zone meeting overlap checker.", "Meeting Time Planner", "Plan meetings across time zones.", ["meeting time planner"]),
  "tdate-time-zone-difference-calculator": article("tdate-time-zone-difference-calculator", "Time Zone Difference", "Hour offset between two zones.", "Time Zone Difference Calculator", "Calculate time difference between zones.", ["time zone difference"]),
  "tdate-countdown-timer-event": article("tdate-countdown-timer-event", "Event Countdown", "Time until or since an event.", "Event Countdown Timer", "Count down to an event date and time.", ["countdown timer"]),
  "tdate-time-until-calculator": article("tdate-time-until-calculator", "Time Until", "Days until a future date.", "Time Until Calculator", "Calculate days until a date.", ["time until calculator"]),
  "tdate-age-in-days-hours-calculator": article("tdate-age-in-days-hours-calculator", "Age in Days", "Total days and hours lived.", "Age in Days Hours Calculator", "Calculate age in days and hours.", ["age in days"]),
  "tdate-time-since-calculator": article("tdate-time-since-calculator", "Time Since", "Elapsed time since a past event.", "Time Since Calculator", "Calculate time elapsed since a date.", ["time since calculator"]),
};
