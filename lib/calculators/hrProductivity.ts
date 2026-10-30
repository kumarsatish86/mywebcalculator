/** HR productivity & performance — teaching estimates. */
import { nonNeg, pos, type HrResult } from "./hrHelpers";

export type HrProductivitySlug =
  | "hr-employee-productivity-calculator"
  | "hr-task-completion-rate-calculator"
  | "hr-efficiency-calculator"
  | "hr-output-per-hour-calculator"
  | "hr-team-efficiency-calculator"
  | "hr-workforce-productivity-calculator"
  | "hr-utilization-rate-calculator"
  | "hr-kpi-calculator"
  | "hr-performance-score-calculator"
  | "hr-target-achievement-calculator";

export const HR_PRODUCTIVITY_SLUGS: HrProductivitySlug[] = [
  "hr-employee-productivity-calculator",
  "hr-task-completion-rate-calculator",
  "hr-efficiency-calculator",
  "hr-output-per-hour-calculator",
  "hr-team-efficiency-calculator",
  "hr-workforce-productivity-calculator",
  "hr-utilization-rate-calculator",
  "hr-kpi-calculator",
  "hr-performance-score-calculator",
  "hr-target-achievement-calculator",
];

export type HrProductivityInput = {
  output?: number;
  hours?: number;
  completed?: number;
  totalTasks?: number;
  standardOutput?: number;
  actualOutput?: number;
  teamOutput?: number;
  teamHours?: number;
  headcount?: number;
  billableHours?: number;
  availableHours?: number;
  actual?: number;
  target?: number;
  weight1?: number;
  score1?: number;
  weight2?: number;
  score2?: number;
  weight3?: number;
  score3?: number;
};

export function computeHrProductivity(slug: HrProductivitySlug, input: HrProductivityInput): HrResult {
  switch (slug) {
    case "hr-employee-productivity-calculator":
    case "hr-output-per-hour-calculator": {
      const output = pos(input.output ?? input.actualOutput, "Output");
      if (typeof output !== "number") return { ok: false, error: output.error };
      const hours = pos(input.hours ?? input.teamHours, "Hours");
      if (typeof hours !== "number") return { ok: false, error: hours.error };
      return { ok: true, rate: output / hours, amount: output / hours, note: "Output per hour = output ÷ hours." };
    }
    case "hr-task-completion-rate-calculator": {
      const done = nonNeg(input.completed, "Completed");
      if (typeof done !== "number") return { ok: false, error: done.error };
      const total = pos(input.totalTasks, "Total tasks");
      if (typeof total !== "number") return { ok: false, error: total.error };
      return { ok: true, pct: (done / total) * 100, amount: done, count: total, note: "Completion % = completed ÷ total × 100." };
    }
    case "hr-efficiency-calculator": {
      const actual = pos(input.actualOutput ?? input.output, "Actual output");
      if (typeof actual !== "number") return { ok: false, error: actual.error };
      const standard = pos(input.standardOutput ?? input.target, "Standard output");
      if (typeof standard !== "number") return { ok: false, error: standard.error };
      return { ok: true, pct: (actual / standard) * 100, note: "Efficiency % = actual ÷ standard × 100." };
    }
    case "hr-team-efficiency-calculator":
    case "hr-workforce-productivity-calculator": {
      const output = pos(input.teamOutput ?? input.output, "Team output");
      if (typeof output !== "number") return { ok: false, error: output.error };
      const hours = pos(input.teamHours ?? input.hours, "Team hours");
      if (typeof hours !== "number") return { ok: false, error: hours.error };
      const hc = input.headcount && input.headcount > 0 ? input.headcount : 1;
      return { ok: true, rate: output / hours, amount: output / hc, pct: hc > 0 ? output / hc : 0, note: "Team productivity = output ÷ hours; per-head = output ÷ headcount." };
    }
    case "hr-utilization-rate-calculator": {
      const billable = nonNeg(input.billableHours ?? input.hours, "Billable hours");
      if (typeof billable !== "number") return { ok: false, error: billable.error };
      const available = pos(input.availableHours ?? input.hours, "Available hours");
      if (typeof available !== "number") return { ok: false, error: available.error };
      return { ok: true, pct: (billable / available) * 100, hours: billable, note: "Utilization % = billable ÷ available × 100." };
    }
    case "hr-kpi-calculator": {
      const actual = pos(input.actual ?? input.output, "Actual KPI");
      if (typeof actual !== "number") return { ok: false, error: actual.error };
      const target = pos(input.target, "Target KPI");
      if (typeof target !== "number") return { ok: false, error: target.error };
      return { ok: true, pct: (actual / target) * 100, amount: actual, amount2: target, note: "KPI achievement % = actual ÷ target × 100." };
    }
    case "hr-performance-score-calculator": {
      const w1 = nonNeg(input.weight1 ?? 1, "Weight 1");
      if (typeof w1 !== "number") return { ok: false, error: w1.error };
      const s1 = nonNeg(input.score1 ?? 0, "Score 1");
      if (typeof s1 !== "number") return { ok: false, error: s1.error };
      const w2 = nonNeg(input.weight2 ?? 0, "Weight 2");
      if (typeof w2 !== "number") return { ok: false, error: w2.error };
      const s2 = nonNeg(input.score2 ?? 0, "Score 2");
      if (typeof s2 !== "number") return { ok: false, error: s2.error };
      const w3 = nonNeg(input.weight3 ?? 0, "Weight 3");
      if (typeof w3 !== "number") return { ok: false, error: w3.error };
      const s3 = nonNeg(input.score3 ?? 0, "Score 3");
      if (typeof s3 !== "number") return { ok: false, error: s3.error };
      const tw = w1 + w2 + w3;
      if (tw <= 0) return { ok: false, error: "Total weight must be positive." };
      const score = (w1 * s1 + w2 * s2 + w3 * s3) / tw;
      return { ok: true, score, amount: score, note: "Weighted performance score." };
    }
    case "hr-target-achievement-calculator": {
      const actual = pos(input.actual ?? input.actualOutput ?? input.output, "Actual");
      if (typeof actual !== "number") return { ok: false, error: actual.error };
      const target = pos(input.target ?? input.standardOutput, "Target");
      if (typeof target !== "number") return { ok: false, error: target.error };
      return { ok: true, pct: (actual / target) * 100, amount: actual - target, note: "Achievement % and gap (actual − target)." };
    }
    default:
      return { ok: false, error: "Unknown productivity calculator." };
  }
}
