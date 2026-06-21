export const PROFIT_BENCHMARKS = { grossMin: 40, netMin: 15, opexMax: 35 };

export const ROAS_BENCHMARKS = { good: 4, ok: 2.5, weak: 1.5 };

export const FUNNEL_BENCHMARKS = { ctr: 2, cvr: 3, cpaRatio: 0.25 };

export const COST_LEVERS = [
  { id: "saas", label: "SaaS & subscriptions", typicalSave: 0.12 },
  { id: "vendor", label: "Vendor contracts", typicalSave: 0.08 },
  { id: "automation", label: "Manual process automation", typicalSave: 0.06 },
  { id: "cloud", label: "Cloud / infra right-sizing", typicalSave: 0.1 },
];

export const MEETING_TIPS = [
  "Batch meetings on two days; protect deep-work blocks on others.",
  "Default 25-min meetings instead of 30 to reduce context-switch cost.",
  "Decline optional meetings without agenda — ask async update instead.",
  "Replace status meetings with shared dashboards updated async.",
];

export const PRICING_TIPS = [
  "Anchor price against competitor, justify with value metrics.",
  "Test +5–10% on new customers before rolling to all.",
  "Bundle high-margin add-ons instead of discounting core price.",
  "Offer annual prepay at 15–20% discount to improve cash flow.",
];

export const WORKLOAD_TIPS = [
  "Schedule hardest task in first 90 min of focus window.",
  "Cap WIP at 3 active tasks — finish before starting new.",
  "Friday PM: plan next week top 3 only.",
  "Leave 15% buffer for interrupts — do not plan 100% utilization.",
];

export const ROI_DECISION_STEPS = [
  "Confirm payback ≤ 18 months vs your cost of capital.",
  "Stress-test returns at −20% before committing.",
  "Track monthly actual vs projected from month 1.",
];

export const AD_SCALE_STEPS = [
  "Hold CPA steady for 2 weeks before +15% budget.",
  "Refresh creative every 3–4 weeks to avoid fatigue.",
  "Split brand vs performance budget 20/80 early stage.",
];
