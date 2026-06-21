export const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const DATE_TIPS = [
  "We anchor dates at local noon to reduce daylight-saving edge cases.",
  "Months and years between dates use calendar math, not fixed 30-day blocks.",
  "For legal deadlines, confirm with an official timezone-aware source.",
];

export const AGE_TIPS = [
  "Age in months/days is calendar-based — not the same as 365.25-day averages.",
  "Leap day birthdays: some systems count Feb 28 or Mar 1 in non-leap years.",
];

export const LEAP_FACTS = [
  "Leap years are divisible by 4, except century years unless divisible by 400.",
  "A leap year has 366 days — Feb 29 is the extra day.",
];

export const COMMON_TIMEZONES = [
  { id: "UTC", label: "UTC" },
  { id: "America/New_York", label: "New York (ET)" },
  { id: "America/Chicago", label: "Chicago (CT)" },
  { id: "America/Denver", label: "Denver (MT)" },
  { id: "America/Los_Angeles", label: "Los Angeles (PT)" },
  { id: "Europe/London", label: "London" },
  { id: "Europe/Paris", label: "Paris" },
  { id: "Europe/Berlin", label: "Berlin" },
  { id: "Asia/Kolkata", label: "India (IST)" },
  { id: "Asia/Dubai", label: "Dubai" },
  { id: "Asia/Singapore", label: "Singapore" },
  { id: "Asia/Tokyo", label: "Tokyo" },
  { id: "Australia/Sydney", label: "Sydney" },
] as const;

export const BUSINESS_TIPS = [
  "Business days exclude Saturday and Sunday only — public holidays are not subtracted.",
  "Adding business days skips weekends automatically.",
  "Confirm contractual deadlines with your jurisdiction's holiday calendar.",
];

export const TZ_TIPS = [
  "Offsets use IANA zones and respect daylight saving on the selected date.",
  "For flights and contracts, always confirm the official timezone abbreviation.",
  "World clock times refresh when you recalculate — they are not live-updating.",
];

export const EVENT_TIPS = [
  "Countdowns use your browser clock at calculation time.",
  "Past events show elapsed time; future events show time remaining.",
];

export const PRODUCTIVITY_TIPS = [
  "Payroll and SLA math here is illustrative — follow your employer or contract rules.",
  "Overtime multipliers vary by region (1.5× daily, 2× holiday is common in some locales).",
  "Business-day deadlines skip weekends only; holidays are not excluded.",
];

export const PERSONAL_TIPS = [
  "Pregnancy and ovulation tools are for rough planning only — not medical advice.",
  "Confirm due dates and fertility timing with a healthcare provider.",
  "Zodiac and numerology results are for fun and cultural interest.",
];

export const SPECIALIZED_TIPS = [
  "Panchang and lunar data here are approximate — use official almanacs for rituals.",
  "Cron parsing supports common 5-field patterns; exotic syntax may not parse.",
  "Unix timestamps are interpreted as seconds unless 13+ digits (milliseconds).",
];

export const FUN_TIPS = [
  "Sleep times use 90-minute cycles plus a short fall-asleep buffer — not medical advice.",
  "Weekend countdown uses calendar Saturday; your work week may differ.",
  "Fun stats like heartbeats are rough estimates for entertainment.",
];

export const SMART_TIPS = [
  "Scores are heuristic guides for experiments — not performance reviews or clinical metrics.",
  "Meeting scheduler scores favor fair overlap across zones, not your personal peak hours.",
  "Time budgets should leave buffer; a packed 24h plan ignores context switching.",
];
