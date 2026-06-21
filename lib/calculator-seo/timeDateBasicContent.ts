import type { RichArticle } from "./types";

const HUB_HREF = "/conversion/time-date/tdate-basic-core";
const HUB_LABEL = "Conversion · Basic time & date";
const SHELL = "Runs in your browser with calendar date math. Not for legal, medical, or contractual deadlines.";

function article(slug: string, heading: string, paragraph: string, seoTitle: string, seoDescription: string, keywords: string[]): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "conversion",
    shellNote: SHELL,
    sections: [{ heading, paragraphs: [paragraph] }],
    tables: [{ title: "Quick tip", columnHeaders: ["Topic", "Note"], rows: [["Dates", "Noon anchor reduces DST quirks"], ["Months", "Calendar months, not 30-day blocks"]] }],
    chart: { kind: "sparkTrendDemo", title: "Pick dates → see span", caption: "Share URL preserves your inputs.", sparkValues: [0.25, 0.5, 0.75, 1] },
    faq: [{ question: "Are months exact?", answer: "Months use calendar math; approximate month lengths vary." }],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const TIME_DATE_BASIC_ARTICLES: Record<string, RichArticle> = {
  "tdate-age-calculator": article("tdate-age-calculator", "Age Calculator", "Years, months, days, and total days lived.", "Age Calculator — Exact Age", "Calculate exact age from birth date.", ["age calculator", "how old am i"]),
  "tdate-date-difference-calculator": article("tdate-date-difference-calculator", "Date Difference", "Full calendar difference between two dates.", "Date Difference Calculator", "Find the difference between two dates.", ["date difference", "days between"]),
  "tdate-days-between-dates-calculator": article("tdate-days-between-dates-calculator", "Days Between", "Count calendar days between dates.", "Days Between Dates Calculator", "Count days between two dates.", ["days between dates"]),
  "tdate-weeks-between-dates-calculator": article("tdate-weeks-between-dates-calculator", "Weeks Between", "Weeks and remainder days.", "Weeks Between Dates Calculator", "Calculate weeks between dates.", ["weeks between dates"]),
  "tdate-months-between-dates-calculator": article("tdate-months-between-dates-calculator", "Months Between", "Calendar months between dates.", "Months Between Dates Calculator", "Calculate months between two dates.", ["months between dates"]),
  "tdate-years-between-dates-calculator": article("tdate-years-between-dates-calculator", "Years Between", "Years, months, and days between dates.", "Years Between Dates Calculator", "Calculate years between dates.", ["years between dates"]),
  "tdate-time-difference-calculator": article("tdate-time-difference-calculator", "Time Difference", "Hours and minutes between clock times.", "Time Difference Calculator", "Calculate time difference between two times.", ["time difference calculator"]),
  "tdate-time-duration-calculator": article("tdate-time-duration-calculator", "Time Duration", "Total duration from h/m/s parts.", "Time Duration Calculator", "Add hours, minutes, and seconds.", ["time duration"]),
  "tdate-add-subtract-time-calculator": article("tdate-add-subtract-time-calculator", "Add Subtract Time", "Add or subtract time from a datetime.", "Add Subtract Time Calculator", "Add or subtract hours from a date and time.", ["add time to date"]),
  "tdate-work-hours-calculator": article("tdate-work-hours-calculator", "Work Hours", "Paid hours with break deduction.", "Work Hours Calculator", "Calculate work hours from clock in and out.", ["work hours calculator"]),
  "tdate-minutes-to-hours-calculator": article("tdate-minutes-to-hours-calculator", "Minutes to Hours", "Convert minutes to hours.", "Minutes to Hours Calculator", "Convert minutes to hours and minutes.", ["minutes to hours"]),
  "tdate-seconds-to-minutes-calculator": article("tdate-seconds-to-minutes-calculator", "Seconds to Minutes", "Convert seconds to minutes.", "Seconds to Minutes Calculator", "Convert seconds to minutes and seconds.", ["seconds to minutes"]),
  "tdate-day-of-week-calculator": article("tdate-day-of-week-calculator", "Day of Week", "Weekday for any date.", "Day of the Week Calculator", "Find what day of the week a date falls on.", ["day of week calculator"]),
  "tdate-what-day-was-i-born-calculator": article("tdate-what-day-was-i-born-calculator", "Born Day", "Weekday of your birth date.", "What Day Was I Born Calculator", "Find what day of the week you were born.", ["what day was i born"]),
  "tdate-next-birthday-calculator": article("tdate-next-birthday-calculator", "Next Birthday", "Days until next birthday.", "Next Birthday Calculator", "Countdown to your next birthday.", ["next birthday calculator"]),
  "tdate-leap-year-calculator": article("tdate-leap-year-calculator", "Leap Year", "Check leap years and next leap.", "Leap Year Calculator", "Check if a year is a leap year.", ["leap year calculator"]),
};
