import type { RichArticle } from "./types";

const HUB_HREF = "/business/hr-productivity/hr-leave-vacation";
const HUB_LABEL = "Business · HR & productivity · Leave and vacation";
const SHELL =
  "Leave and PTO teaching estimates in your browser. Not legal advice. Accrual, encashment, and carry rules are policy-specific.";

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
    category: "business",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Leave tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["Accrual", "Months × rate"],
          ["Annual / vacation", "Entitlement + carry − used"],
          ["Sick / PTO", "Balance after usage"],
          ["Encashment", "(Basic+DA)/30 × days"],
        ],
      },
    ],
    chart: { kind: "none", title: "Overview", caption: "Share URL preserves leave inputs. Policy estimate only." },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const items: [string, string, string[], string, string, string, string, string[]][] = [
  ["hr-leave-accrual-calculator", "Leave accrual", ["Accrues leave as months worked × days per month.", "Pro-rata joining mid-month is employer-specific."], "What accrual rate is common?", "Many India policies use ~1.5 earned leave days per month as a teaching example.", "Leave Accrual Calculator", "Estimate accrued leave from months and rate.", ["leave accrual"]],
  ["hr-annual-leave-calculator", "Annual leave", ["Available = entitlement + carry − used.", "Lapse rules are not modeled."], "Does unused leave carry?", "Only if you enter carried days; otherwise assume no carry.", "Annual Leave Calculator", "Track annual leave availability.", ["annual leave calculator"]],
  ["hr-sick-leave-calculator", "Sick leave", ["Sick balance = entitlement − used.", "Medical certificate rules are out of scope."], "Is sick leave encashable?", "Usually not — check your handbook.", "Sick Leave Calculator", "Calculate remaining sick leave.", ["sick leave calculator"]],
  ["hr-pto-calculator", "PTO", ["PTO days from hours worked × accrual rate minus used days.", "US-style PTO banks differ from India EL/CL/SL."], "What accrual rate?", "Example: 0.05 days per hour ≈ ~1 day per 20 hours.", "PTO Calculator — Paid Time Off", "Estimate PTO balance from hours and accrual.", ["PTO calculator"]],
  ["hr-vacation-balance-calculator", "Vacation balance", ["Vacation bank + carry − taken.", "Blackout dates are not enforced here."], "Vacation vs annual leave?", "Same math; naming differs by region/policy.", "Vacation Balance Calculator", "Find remaining vacation days.", ["vacation balance"]],
  ["hr-leave-encashment-calculator", "Leave encashment", ["Illustrative encashment = (basic+DA)/30 × leave days.", "Tax treatment and eligibility vary.",], "Why divide by 30?", "Common teaching daily rate; some policies use 26.", "Leave Encashment Calculator", "Estimate leave encashment amount.", ["leave encashment"]],
];

export const HR_LEAVE_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  items.map(([slug, heading, paragraphs, q, a, seoTitle, seoDescription, keywords]) => [
    slug,
    article(slug, heading, paragraphs, { question: q, answer: a }, seoTitle, seoDescription, keywords),
  ]),
);
