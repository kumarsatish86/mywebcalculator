/** Guided calculator journeys (collections). */

export type JourneyStep = {
  slug: string;
  title: string;
  blurb: string;
};

export type JourneyDefinition = {
  id: string;
  title: string;
  description: string;
  steps: JourneyStep[];
};

export const JOURNEY_DEFINITIONS: JourneyDefinition[] = [
  {
    id: "buying-home",
    title: "Buying a home",
    description:
      "From eligibility to EMI, down payment, tax context, and a budget check—linked tools you can run in order.",
    steps: [
      {
        slug: "home-loan-eligibility-calculator",
        title: "Loan eligibility",
        blurb: "See how much loan your income may support.",
      },
      {
        slug: "loan-emi-calculator",
        title: "EMI",
        blurb: "Estimate monthly EMI for the loan amount.",
      },
      {
        slug: "loan-payment",
        title: "Payment breakdown",
        blurb: "Payment, interest, and total cost snapshot.",
      },
      {
        slug: "down-payment-calculator",
        title: "Down payment",
        blurb: "Plan the cash you need upfront.",
      },
      {
        slug: "gst-plus-loan-calculator-india",
        title: "GST / tax context",
        blurb: "India under-construction GST + loan teaching aid.",
      },
      {
        slug: "home-loan-emi-calculator-india",
        title: "Home loan EMI (India)",
        blurb: "Region-focused EMI estimate.",
      },
      {
        slug: "salary-budget-planner",
        title: "Budget planner",
        blurb: "Fit EMI and expenses into monthly cashflow.",
      },
    ],
  },
  {
    id: "exam-prep",
    title: "Full exam prep loop",
    description:
      "Planner → accuracy → negative marking → study plan → revision → time → rank — a complete prep loop.",
    steps: [
      {
        slug: "exam-strategy-planner",
        title: "Strategy planner",
        blurb: "Build your attempt digital twin.",
      },
      {
        slug: "attempt-accuracy-calculator",
        title: "Attempt accuracy",
        blurb: "Measure correct vs attempted quality.",
      },
      {
        slug: "negative-marking-calculator",
        title: "Negative marking",
        blurb: "See how penalties change net score.",
      },
      {
        slug: "study-plan-generator",
        title: "Study plan",
        blurb: "Map the weeks ahead.",
      },
      {
        slug: "revision-planner-calculator",
        title: "Revision planner",
        blurb: "Schedule revision passes.",
      },
      {
        slug: "time-efficiency-calculator",
        title: "Time efficiency",
        blurb: "Check pacing after mocks.",
      },
      {
        slug: "rank-predictor-calculator",
        title: "Rank predictor",
        blurb: "Translate score to a rank band.",
      },
    ],
  },
  {
    id: "crack-jee-90-days",
    title: "Crack JEE in 90 days",
    description: "Hours → revision → mocks → timing → rank → improvement for a focused JEE push.",
    steps: [
      {
        slug: "study-hours-calculator",
        title: "Study hours",
        blurb: "Set a realistic daily load.",
      },
      {
        slug: "revision-planner-calculator",
        title: "Revision",
        blurb: "Plan revision cycles.",
      },
      {
        slug: "mock-test-performance-calculator",
        title: "Mock analyzer",
        blurb: "Track mock score trends.",
      },
      {
        slug: "time-allocation-calculator-per-section",
        title: "Time allocation",
        blurb: "Split exam minutes by section.",
      },
      {
        slug: "rank-predictor-jee-neet",
        title: "JEE rank predictor",
        blurb: "Estimate rank from score.",
      },
      {
        slug: "improvement-tracker-calculator",
        title: "Improvement plan",
        blurb: "Measure progress between mocks.",
      },
    ],
  },
  {
    id: "fix-negative-marks",
    title: "Fix negative marking",
    description: "Accuracy → penalty math → attempt strategy → optimal attempts.",
    steps: [
      {
        slug: "accuracy-calculator-correct-vs-wrong",
        title: "Accuracy",
        blurb: "Correct vs wrong baseline.",
      },
      {
        slug: "negative-marking-calculator",
        title: "Negative marking",
        blurb: "Penalty impact on net score.",
      },
      {
        slug: "question-attempt-strategy-calculator",
        title: "Attempt strategy",
        blurb: "Easy → medium → hard order.",
      },
      {
        slug: "optimal-attempt-calculator",
        title: "Optimal attempts",
        blurb: "How many to attempt at your accuracy.",
      },
    ],
  },
  {
    id: "mock-to-rank",
    title: "Mock scores to rank",
    description: "Mock trends → percentile → rank → improvement plan.",
    steps: [
      {
        slug: "mock-test-performance-calculator",
        title: "Mock performance",
        blurb: "Average, best, worst, trend.",
      },
      {
        slug: "percentile-calculator-exam",
        title: "Percentile",
        blurb: "Map score to percentile band.",
      },
      {
        slug: "rank-predictor-calculator",
        title: "Rank",
        blurb: "Estimate rank from score.",
      },
      {
        slug: "improvement-tracker-calculator",
        title: "Improvement",
        blurb: "Close the gap to target.",
      },
    ],
  },
  {
    id: "electrical-protection",
    title: "Electrical protection toolkit",
    description:
      "Lightning study estimate → earthing → cable size → voltage drop → short-circuit context.",
    steps: [
      {
        slug: "elec-lightning-protection-calculator",
        title: "Lightning protection",
        blurb: "Protection radius, coverage, and earthing ballpark.",
      },
      {
        slug: "elec-earthing-resistance-calculator",
        title: "Earthing resistance",
        blurb: "Single-rod resistance estimate.",
      },
      {
        slug: "elec-earthing-grounding-calculator",
        title: "Earthing / grounding",
        blurb: "Grounding study math.",
      },
      {
        slug: "elec-cable-size-calculator",
        title: "Cable size",
        blurb: "Size conductors on bonding paths.",
      },
      {
        slug: "elec-voltage-drop-calculator",
        title: "Voltage drop",
        blurb: "Check drop on long runs.",
      },
      {
        slug: "elec-short-circuit-current-calculator",
        title: "Short-circuit current",
        blurb: "Fault current context.",
      },
    ],
  },
  {
    id: "loan-daily-interest",
    title: "Loan interest toolkit",
    description:
      "Eligibility → affordability → EMI → outstanding → daily interest → prepayment → foreclosure → EMI vs tenure.",
    steps: [
      {
        slug: "home-loan-eligibility-calculator",
        title: "Eligibility",
        blurb: "See how much loan your income may support.",
      },
      {
        slug: "loan-affordability-calculator",
        title: "Affordability",
        blurb: "Check what EMI fits your budget.",
      },
      {
        slug: "loan-payment",
        title: "EMI / payment",
        blurb: "Payment, interest, and total cost snapshot.",
      },
      {
        slug: "outstanding-balance-calculator",
        title: "Outstanding balance",
        blurb: "Estimate remaining principal after EMIs.",
      },
      {
        slug: "daily-interest-calculator",
        title: "Daily interest",
        blurb: "Daily cost, delay, and prepay Decision Center.",
      },
      {
        slug: "loan-prepayment-savings-calculator",
        title: "Prepayment savings",
        blurb: "Deeper prepayment interest savings.",
      },
      {
        slug: "loan-foreclosure-calculator",
        title: "Foreclosure",
        blurb: "Closure / foreclosure sketch.",
      },
      {
        slug: "emi-reduction-vs-tenure-reduction-calculator",
        title: "EMI vs tenure",
        blurb: "Trade EMI cut against shorter tenure.",
      },
    ],
  },
];

export function getJourney(id: string): JourneyDefinition | undefined {
  return JOURNEY_DEFINITIONS.find((j) => j.id === id);
}

export function journeyIdsForSlug(slug: string): string[] {
  return JOURNEY_DEFINITIONS.filter((j) => j.steps.some((s) => s.slug === slug)).map((j) => j.id);
}
