import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/time-date/tdate-specialized-niche";
const HUB_LABEL = "Conversion · Specialized time tools";
const SHELL = "Technical timestamp and calendar tools run locally. Panchang and lunar data are approximate.";

function article(slug: string, heading: string, paragraph: string, seoTitle: string, seoDescription: string, keywords: string[]): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "conversion",
    shellNote: SHELL,
    sections: [{ heading, paragraphs: [paragraph] }],
    tables: [{ title: "Quick tip", columnHeaders: ["Topic", "Note"], rows: [["Unix", "13+ digits = milliseconds"], ["Cron", "5 fields: min hour dom month dow"]] }],
    chart: { kind: "sparkTrendDemo", title: "Convert → see all formats", caption: "Share URL preserves inputs.", sparkValues: [0.2, 0.45, 0.7, 1] },
    faq: [{ question: "Are panchang values official?", answer: "No — they are approximations for planning only." }],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const TIME_DATE_SPECIALIZED_ARTICLES: Record<string, RichArticle> = {
  "tdate-indian-panchang-calculator": article("tdate-indian-panchang-calculator", "Panchang", "Tithi, paksha, and nakshatra estimates.", "Indian Panchang Calculator", "Approximate Hindu panchang for a date.", ["panchang calculator"]),
  "tdate-islamic-date-converter": article("tdate-islamic-date-converter", "Islamic Date", "Gregorian to Hijri conversion.", "Islamic Date Converter", "Convert Gregorian dates to Hijri.", ["islamic date converter", "hijri converter"]),
  "tdate-julian-date-converter": article("tdate-julian-date-converter", "Julian Date", "Julian day number conversion.", "Julian Date Converter", "Convert dates to Julian day numbers.", ["julian date converter"]),
  "tdate-lunar-calendar-calculator": article("tdate-lunar-calendar-calculator", "Lunar Calendar", "Moon phase and lunar day.", "Lunar Calendar Calculator", "Moon phase for any date.", ["lunar calendar calculator"]),
  "tdate-unix-timestamp-converter": article("tdate-unix-timestamp-converter", "Unix Timestamp", "Unix time to human date.", "Unix Timestamp Converter", "Convert Unix timestamp to date.", ["unix timestamp converter"]),
  "tdate-epoch-time-converter": article("tdate-epoch-time-converter", "Epoch Time", "Milliseconds since Unix epoch.", "Epoch Time Converter", "Convert epoch milliseconds.", ["epoch time converter"]),
  "tdate-iso-date-converter": article("tdate-iso-date-converter", "ISO Date", "ISO-8601 parse and format.", "ISO Date Converter", "Convert dates to ISO-8601 format.", ["iso date converter"]),
  "tdate-time-format-12h-24h-converter": article("tdate-time-format-12h-24h-converter", "Time Format", "12-hour and 24-hour conversion.", "12h 24h Time Converter", "Convert 12-hour to 24-hour time.", ["12h 24h converter"]),
  "tdate-cron-expression-generator": article("tdate-cron-expression-generator", "Cron Generator", "Build cron expressions.", "Cron Expression Generator", "Generate cron schedule expressions.", ["cron expression generator"]),
  "tdate-cron-schedule-calculator": article("tdate-cron-schedule-calculator", "Cron Schedule", "Next runs from cron.", "Cron Schedule Calculator", "Calculate next cron run times.", ["cron schedule calculator"]),
  "tdate-log-timestamp-converter": article("tdate-log-timestamp-converter", "Log Timestamp", "Parse log file timestamps.", "Log Timestamp Converter", "Convert log timestamps to readable dates.", ["log timestamp converter"]),
};
