import { getBySubcategory, getCalculator } from "@/lib/registry";
import { journeyIdsForSlug, getJourney } from "@/lib/journeys/definitions";
import { stageNeighbors } from "@/lib/education/examSuccessCenter";

export type RelatedTool = {
  slug: string;
  title: string;
  reason: string;
};

const MANUAL_RELATED: Record<string, { slug: string; reason: string }[]> = {
  "body-bmi-calculator": [
    { slug: "diet-tdee-calculator", reason: "Estimate daily energy needs next" },
    { slug: "diet-daily-calorie-needs-calculator", reason: "Plan calorie targets" },
    { slug: "diet-daily-water-intake-calculator", reason: "Hydration alongside weight goals" },
    { slug: "diet-protein-intake-calculator", reason: "Protein targets for body composition" },
    { slug: "body-ideal-body-weight-calculator", reason: "Ideal weight reference" },
    { slug: "body-fat-percentage-calculator", reason: "Composition beyond BMI" },
    { slug: "aigen-workout-plan-generator", reason: "Draft a workout outline" },
  ],
  "loan-payment": [
    { slug: "loan-emi-calculator", reason: "Classic EMI view" },
    { slug: "loan-amortization-calculator", reason: "Full amortization schedule" },
    { slug: "down-payment-calculator", reason: "Cash needed upfront" },
    { slug: "home-loan-eligibility-calculator", reason: "Check affordability first" },
  ],
  "loan-emi-calculator": [
    { slug: "loan-payment", reason: "Payment + interest totals" },
    { slug: "loan-amortization-calculator", reason: "Schedule breakdown" },
    { slug: "home-loan-eligibility-calculator", reason: "Eligibility before EMI" },
    { slug: "home-loan-prepayment-calculator", reason: "See prepayment impact" },
  ],
  "exam-strategy-planner": [
    { slug: "question-attempt-strategy-calculator", reason: "Drill attempt order" },
    { slug: "time-allocation-calculator-per-section", reason: "Split minutes by section" },
    { slug: "optimal-attempt-calculator", reason: "Expected-value attempts" },
    { slug: "negative-marking-calculator", reason: "Penalty impact" },
    { slug: "speed-vs-accuracy-calculator", reason: "Pace vs precision" },
    { slug: "rank-predictor-calculator", reason: "Score to rank band" },
  ],
  "question-attempt-strategy-calculator": [
    { slug: "optimal-attempt-calculator", reason: "How many to attempt" },
    { slug: "time-allocation-calculator-per-section", reason: "Section timing" },
    { slug: "accuracy-calculator-correct-vs-wrong", reason: "Accuracy baseline" },
    { slug: "negative-marking-calculator", reason: "Penalty math" },
    { slug: "speed-vs-accuracy-calculator", reason: "Pace check" },
    { slug: "exam-strategy-planner", reason: "Full digital twin" },
  ],
  "time-allocation-calculator-per-section": [
    { slug: "speed-vs-accuracy-calculator", reason: "Pace after timing" },
    { slug: "question-attempt-strategy-calculator", reason: "Attempt order" },
    { slug: "time-efficiency-calculator", reason: "Efficiency check" },
    { slug: "exam-strategy-planner", reason: "Full timeline twin" },
  ],
  "optimal-attempt-calculator": [
    { slug: "negative-marking-calculator", reason: "Penalty scheme" },
    { slug: "attempt-accuracy-calculator", reason: "Attempt quality" },
    { slug: "question-attempt-strategy-calculator", reason: "Difficulty mix" },
    { slug: "exam-strategy-planner", reason: "Compare strategies" },
  ],
  "speed-vs-accuracy-calculator": [
    { slug: "time-allocation-calculator-per-section", reason: "Rebalance minutes" },
    { slug: "time-efficiency-calculator", reason: "Efficiency view" },
    { slug: "accuracy-calculator-correct-vs-wrong", reason: "Accuracy drill" },
    { slug: "exam-strategy-planner", reason: "Full planner" },
  ],
  "mock-test-performance-calculator": [
    { slug: "score-trend-calculator", reason: "Longer trend view" },
    { slug: "improvement-tracker-calculator", reason: "Gap to target" },
    { slug: "percentile-calculator-exam", reason: "Percentile band" },
    { slug: "rank-predictor-calculator", reason: "Rank estimate" },
  ],
  "negative-marking-calculator": [
    { slug: "optimal-attempt-calculator", reason: "Attempt threshold" },
    { slug: "attempt-accuracy-calculator", reason: "Accuracy vs attempts" },
    { slug: "question-attempt-strategy-calculator", reason: "What to skip" },
    { slug: "exam-strategy-planner", reason: "Safe vs aggressive" },
  ],
  "elec-lightning-protection-calculator": [
    { slug: "elec-earthing-resistance-calculator", reason: "Refine grounding R" },
    { slug: "elec-earthing-grounding-calculator", reason: "Earthing study math" },
    { slug: "elec-cable-size-calculator", reason: "Bonding conductor size" },
    { slug: "elec-voltage-drop-calculator", reason: "Long down-conductor drop" },
    { slug: "elec-short-circuit-current-calculator", reason: "Fault current context" },
    { slug: "elec-fuse-size-calculator", reason: "Protection device sizing" },
  ],
  "elec-earthing-resistance-calculator": [
    { slug: "elec-lightning-protection-calculator", reason: "LPS coverage twin" },
    { slug: "elec-earthing-grounding-calculator", reason: "Grounding companion" },
    { slug: "elec-cable-size-calculator", reason: "Earthing conductor size" },
    { slug: "elec-voltage-drop-calculator", reason: "Conductor drop" },
  ],
  "elec-earthing-grounding-calculator": [
    { slug: "elec-earthing-resistance-calculator", reason: "Rod resistance" },
    { slug: "elec-lightning-protection-calculator", reason: "Lightning workspace" },
    { slug: "elec-cable-size-calculator", reason: "Conductor sizing" },
  ],
  "daily-interest-calculator": [
    { slug: "loan-payment", reason: "Full payment + interest totals" },
    { slug: "loan-emi-calculator", reason: "Classic EMI view" },
    { slug: "outstanding-balance-calculator", reason: "Remaining balance after EMIs" },
    { slug: "loan-prepayment-savings-calculator", reason: "Deeper prepayment savings" },
    { slug: "loan-foreclosure-calculator", reason: "Foreclosure / closure sketch" },
    { slug: "monthly-interest-calculator", reason: "Monthly interest companion" },
    { slug: "emi-reduction-vs-tenure-reduction-calculator", reason: "EMI vs tenure tradeoff" },
  ],
  "outstanding-balance-calculator": [
    { slug: "daily-interest-calculator", reason: "Daily cost on remaining balance" },
    { slug: "loan-payment", reason: "Payment snapshot" },
    { slug: "loan-prepayment-savings-calculator", reason: "Prepay impact" },
  ],
  "loan-prepayment-savings-calculator": [
    { slug: "daily-interest-calculator", reason: "Daily interest Decision Center" },
    { slug: "loan-foreclosure-calculator", reason: "Foreclosure sketch" },
    { slug: "emi-reduction-vs-tenure-reduction-calculator", reason: "EMI vs tenure" },
  ],
};

/**
 * Deterministic related tools: manual maps → journey siblings → subcategory peers.
 */
export function relatedForSlug(slug: string, limit = 8): RelatedTool[] {
  const out: RelatedTool[] = [];
  const seen = new Set<string>([slug]);

  const push = (s: string, reason: string) => {
    if (seen.has(s) || out.length >= limit) return;
    const def = getCalculator(s);
    if (!def) return;
    seen.add(s);
    out.push({ slug: s, title: def.shortTitle || def.title, reason });
  };

  for (const row of MANUAL_RELATED[slug] ?? []) {
    push(row.slug, row.reason);
  }

  for (const jid of journeyIdsForSlug(slug)) {
    const journey = getJourney(jid);
    if (!journey) continue;
    for (const step of journey.steps) {
      push(step.slug, `Part of “${journey.title}” journey`);
    }
  }

  for (const neighbor of stageNeighbors(slug, 6)) {
    push(neighbor, "Same exam stage on the Success Center");
  }

  const self = getCalculator(slug);
  if (self) {
    const peers = getBySubcategory(self.category, self.subCategorySlug);
    for (const p of peers) {
      push(p.slug, `Same hub: ${self.subCategorySlug}`);
    }
  }

  return out.slice(0, limit);
}
