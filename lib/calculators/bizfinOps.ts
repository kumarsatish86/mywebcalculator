/** Business finance — manufacturing & operations teaching estimates. */
import { pos, nonNeg } from "./bizfinHelpers";

export type BizfinOpsSlug =
  | "bizfin-production-capacity-calculator"
  | "bizfin-machine-efficiency-calculator"
  | "bizfin-labor-cost-calculator"
  | "bizfin-utilization-rate-calculator"
  | "bizfin-downtime-cost-calculator"
  | "bizfin-throughput-calculator";
export const BIZFIN_OPS_SLUGS: BizfinOpsSlug[] = [
  "bizfin-production-capacity-calculator",
  "bizfin-machine-efficiency-calculator",
  "bizfin-labor-cost-calculator",
  "bizfin-utilization-rate-calculator",
  "bizfin-downtime-cost-calculator",
  "bizfin-throughput-calculator",
];


export type BizfinOpsInput = {
  machines?: number;
  hours?: number;
  ratePerHour?: number;
  output?: number;
  capacity?: number;
  workers?: number;
  wage?: number;
  usedHours?: number;
  availableHours?: number;
  downtimeHours?: number;
  costPerHour?: number;
  units?: number;
  timeHours?: number;
};

export type BizfinOpsResult =
  | { ok: false; error: string }
  | {
      ok: true;
      value?: number;
      pct?: number;
      secondary?: number;
      tertiary?: number;
      note: string;
    };

export function computeBizfinOps(slug: BizfinOpsSlug, input: BizfinOpsInput): BizfinOpsResult {
  switch (slug) {
    case "bizfin-production-capacity-calculator": {
      const machines = pos(input.machines ?? 1, "Machines / lines");
      if (typeof machines !== "number") return { ok: false, error: machines.error };
      const hours = pos(input.hours ?? input.availableHours, "Hours");
      if (typeof hours !== "number") return { ok: false, error: hours.error };
      const rate = pos(input.ratePerHour, "Units per hour");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return { ok: true, value: machines * hours * rate, note: "Capacity = machines × hours × rate." };
    }
    case "bizfin-machine-efficiency-calculator": {
      const output = pos(input.output ?? input.units, "Actual output");
      if (typeof output !== "number") return { ok: false, error: output.error };
      const capacity = pos(input.capacity, "Capacity / standard output");
      if (typeof capacity !== "number") return { ok: false, error: capacity.error };
      return { ok: true, pct: (output / capacity) * 100, value: output / capacity, note: "Efficiency = output ÷ capacity." };
    }
    case "bizfin-labor-cost-calculator": {
      const workers = pos(input.workers ?? 1, "Workers");
      if (typeof workers !== "number") return { ok: false, error: workers.error };
      const hours = pos(input.hours, "Hours");
      if (typeof hours !== "number") return { ok: false, error: hours.error };
      const wage = pos(input.wage ?? input.ratePerHour, "Wage / hour");
      if (typeof wage !== "number") return { ok: false, error: wage.error };
      return { ok: true, value: workers * hours * wage, note: "Labor cost = workers × hours × wage." };
    }
    case "bizfin-utilization-rate-calculator": {
      const used = nonNeg(input.usedHours ?? input.hours, "Used hours");
      if (typeof used !== "number") return { ok: false, error: used.error };
      const avail = pos(input.availableHours ?? input.capacity, "Available hours");
      if (typeof avail !== "number") return { ok: false, error: avail.error };
      return { ok: true, pct: (used / avail) * 100, value: used / avail, note: "Utilization = used ÷ available." };
    }
    case "bizfin-downtime-cost-calculator": {
      const hours = pos(input.downtimeHours ?? input.hours, "Downtime hours");
      if (typeof hours !== "number") return { ok: false, error: hours.error };
      const cph = pos(input.costPerHour ?? input.ratePerHour, "Cost per hour");
      if (typeof cph !== "number") return { ok: false, error: cph.error };
      return { ok: true, value: hours * cph, note: "Downtime cost = hours × cost/hour." };
    }
    case "bizfin-throughput-calculator": {
      const units = pos(input.units ?? input.output, "Units");
      if (typeof units !== "number") return { ok: false, error: units.error };
      const time = pos(input.timeHours ?? input.hours, "Time (hours)");
      if (typeof time !== "number") return { ok: false, error: time.error };
      return { ok: true, value: units / time, note: "Throughput = units ÷ time." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
