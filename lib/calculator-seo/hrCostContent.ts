import type { RichArticle } from "./types";

const HUB_HREF = "/business/hr-productivity/hr-cost-budget";
const HUB_LABEL = "Business · HR & productivity · HR cost and budget";
const SHELL =
  "HR cost and recruiting budget estimates in your browser. Not financial or hiring legal advice. Costs vary by market and process.";

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
        title: "HR cost tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: [
          ["CTC / employee cost", "Gross + loads"],
          ["Hiring / cost per hire", "Spend ÷ hires"],
          ["Turnover cost", "Salary × multiplier"],
          ["Time to hire", "Avg days to fill"],
          ["Offer accept / ROI", "Rates and return"],
        ],
      },
    ],
    chart: { kind: "none", title: "Overview", caption: "Share URL preserves HR cost inputs." },
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: HUB_HREF,
    hubLabel: HUB_LABEL,
  };
}

const items: [string, string, string[], string, string, string, string, string[]][] = [
  ["hr-ctc-calculator", "CTC", ["Monthly/annual CTC from gross, employer PF, and benefits %.", "Structures differ — verify with compensation."], "Is PF inside CTC?", "Often yes for employer share; this tool adds it explicitly.", "CTC Calculator — Cost to Company", "Estimate CTC from gross and employer loads.", ["CTC calculator"]],
  ["hr-employee-cost-calculator", "Employee cost", ["Fully loaded cost with benefits and overhead percentages.", "Facilities and software may sit in overhead."], "Benefits vs overhead?", "Benefits are people costs; overhead is shared ops load.", "Employee Cost Calculator", "Estimate true employee cost.", ["employee cost"]],
  ["hr-hiring-cost-calculator", "Hiring cost", ["Sums agency, ads, and recruiter costs.", "Internal interviewer time can be added into recruiter cost."], "Include referral bonuses?", "Yes — add them into agency or recruiter fields.", "Hiring Cost Calculator", "Total recruiting spend estimate.", ["hiring cost"]],
  ["hr-cost-per-hire-calculator", "Cost per hire", ["Total recruiting spend ÷ number of hires.", "SHRM-style CPH definitions may include more buckets."], "Internal transfers count?", "Usually exclude; count external hires only.", "Cost per Hire Calculator", "Calculate cost per hire.", ["cost per hire"]],
  ["hr-employee-turnover-cost-calculator", "Turnover cost", ["Annual salary × replacement multiplier (e.g. 0.5–2×).", "Multiplier depends on role seniority."], "What multiplier should I use?", "Entry roles often ~0.3–0.5×; specialized roles higher.", "Employee Turnover Cost Calculator", "Estimate turnover replacement cost.", ["turnover cost"]],
  ["hr-time-to-hire-calculator", "Time to hire", ["Average days-to-fill = sum of opening-days ÷ openings.", "Define start (req open) and end (accept) consistently."], "Time to fill vs time to hire?", "Definitions differ; pick one and stick to it.", "Time to Hire Calculator", "Average time to hire across openings.", ["time to hire"]],
  ["hr-offer-acceptance-rate-calculator", "Offer acceptance rate", ["Accepted offers ÷ offers made × 100.", "Declines after accept are a separate metric."], "Verbal offers count?", "Count only formal written offers for consistency.", "Offer Acceptance Rate Calculator", "Measure offer acceptance percentage.", ["offer acceptance rate"]],
  ["hr-recruitment-roi-calculator", "Recruitment ROI", ["(Value from hires − spend) ÷ spend × 100.", "Value is a planning proxy (e.g. first-year contribution)."], "How to estimate value?", "Use gross margin contribution or avoided contractor cost.", "Recruitment ROI Calculator", "Estimate recruiting return on investment.", ["recruitment ROI"]],
];

export const HR_COST_ARTICLES: Record<string, RichArticle> = Object.fromEntries(
  items.map(([slug, heading, paragraphs, q, a, seoTitle, seoDescription, keywords]) => [
    slug,
    article(slug, heading, paragraphs, { question: q, answer: a }, seoTitle, seoDescription, keywords),
  ]),
);
