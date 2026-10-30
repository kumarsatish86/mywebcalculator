import type { RichArticle } from "./types";

const HUB_HREF = "/engineering/it-dev/it-time-productivity";
const HUB_LABEL = "Engineering · IT/Dev · Time and developer productivity calculators";
const SHELL =
  "IT and developer education tools that run in your browser. Not a substitute for production security review, certified capacity planning, or vendor documentation. Stack assumptions and defaults are simplified — validate with your team before deploying.";

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
    vertical: "engineering-electrical",
    category: "engineering",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Time and productivity tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Unix timestamp", "Seconds since 1970-01-01 UTC"],
          ["Cron expression", "Schedule syntax generator"],
          ["Time zone converter", "Instant across IANA zones"],
          ["Working hours", "Business time between dates"],
          ["Sprint velocity", "Done points ÷ sprints"],
          ["Story points", "Relative sizing rollup"],
          ["Deadline calculator", "End date from start + duration"],
        ],
      },
    ],
    chart: {
      kind: "none",
      title: "Overview",
      caption:
        "Share URL preserves your time and planning inputs. Educational IT aid only — confirm schedules with team calendars and DST rules.",
    },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

export const IT_TIME_ARTICLES: Record<string, RichArticle> = {
  "it-unix-timestamp-converter": article(
    "it-unix-timestamp-converter",
    "Unix timestamp converter",
    [
      "Converts Unix epoch seconds (or milliseconds) to human-readable UTC/local datetime for log and API debugging.",
      "Millisecond vs second precision and signed 32-bit overflow (Year 2038) trip parsers — know your field format.",
    ],
    {
      question: "Seconds or milliseconds?",
      answer:
        "Unix time is traditionally seconds since 1970-01-01 UTC. JavaScript Date.now() uses milliseconds — divide or multiply accordingly.",
    },
    "Unix Timestamp Converter — Epoch to Date & Time",
    "Convert Unix timestamps to dates and back for API debugging. Educational tool — watch ms vs s precision.",
    ["unix timestamp converter", "epoch to date", "timestamp to datetime"],
  ),
  "it-cron-expression-generator": article(
    "it-cron-expression-generator",
    "Cron expression generator",
    [
      "Builds cron schedule strings from minute, hour, day, month, and weekday selections for job scheduler literacy.",
      "Linux cron, Quartz, and cloud schedulers use different fields (seconds, year) — match your platform dialect.",
    ],
    {
      question: "What does 0 0 * * * mean?",
      answer:
        "Classic five-field cron: minute 0, hour 0, every day of month, every month, every weekday — daily at midnight server time.",
    },
    "Cron Expression Generator — Job Schedule Syntax",
    "Generate cron expressions for scheduled jobs. Educational DevOps aid — confirm timezone and dialect.",
    ["cron expression generator", "cron schedule builder", "crontab generator"],
  ),
  "it-time-zone-converter": article(
    "it-time-zone-converter",
    "Time zone converter",
    [
      "Translates an instant among IANA time zones for release windows, on-call handoffs, and meeting planning.",
      "DST shifts and ambiguous local times require timezone database rules — never fixed UTC offsets alone for recurring events.",
    ],
    {
      question: "Why did my meeting shift after DST?",
      answer:
        "Local wall-clock times move when DST starts/ends. Store UTC instants; convert to local only for display.",
    },
    "Time Zone Converter — IANA Zones & DST",
    "Convert times across time zones for global team planning. Educational aid — store UTC in systems.",
    ["time zone converter", "utc to local time", "iana timezone calculator"],
  ),
  "it-working-hours-calculator": article(
    "it-working-hours-calculator",
    "Working hours calculator",
    [
      "Counts business hours or days between two dates excluding weekends and optional holidays for SLA math.",
      "Holiday calendars differ by country and company — customize exclusion lists for accurate support SLAs.",
    ],
    {
      question: "Calendar days vs business days?",
      answer:
        "SLAs often use business days/hours. A 48-hour business SLA spans more wall time over a weekend.",
    },
    "Working Hours Calculator — Business Time Between Dates",
    "Calculate business hours between dates for SLA literacy. Planning aid — maintain holiday calendars.",
    ["working hours calculator", "business days between dates", "sla business hours"],
  ),
  "it-sprint-velocity-calculator": article(
    "it-sprint-velocity-calculator",
    "Sprint velocity calculator",
    [
      "Averages completed story points over recent sprints for forecasting capacity in agile planning.",
      "Velocity is team-specific and changes with scope definition — use ranges, not single-point promises.",
    ],
    {
      question: "Can velocity compare teams?",
      answer:
        "No. Point scales differ per team. Velocity forecasts work only within the same team and consistent estimation.",
    },
    "Sprint Velocity Calculator — Agile Capacity Forecast",
    "Calculate average sprint velocity from completed points. Educational agile aid — forecast with ranges.",
    ["sprint velocity calculator", "agile velocity average", "scrum capacity forecast"],
  ),
  "it-story-points-calculator": article(
    "it-story-points-calculator",
    "Story points calculator",
    [
      "Rolls up story point estimates across backlog items for sprint commitment and release burndown literacy.",
      "Points measure relative effort, not hours — mixing teams or re-baselining mid-project skews trends.",
    ],
    {
      question: "How are story points assigned?",
      answer:
        "Teams compare unknown work to a reference story. Fibonacci scales (1,2,3,5,8…) discourage false precision.",
    },
    "Story Points Calculator — Backlog Effort Rollup",
    "Sum story points for sprint planning literacy. Educational agile tool — keep estimation consistent.",
    ["story points calculator", "backlog points sum", "scrum story point total"],
  ),
  "it-deadline-calculator": article(
    "it-deadline-calculator",
    "Deadline calculator",
    [
      "Adds duration (days, weeks, business days) to a start date to project milestone or release deadlines.",
      "Dependencies, review cycles, and buffer for unknowns belong in real plans — arithmetic dates are a baseline.",
    ],
    {
      question: "Should deadlines use business days?",
      answer:
        "Use business days when work pauses on weekends. Communicate whether deadlines are calendar or business based.",
    },
    "Deadline Calculator — Start Date + Duration",
    "Project deadlines from start date and duration assumptions. Planning aid — add buffer for risk.",
    ["deadline calculator", "add days to date", "project deadline estimate"],
  ),
};
