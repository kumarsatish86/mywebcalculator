/** HR workforce planning — teaching estimates. */
import { nonNeg, pos, type HrResult } from "./hrHelpers";

export type HrWorkforceSlug =
  | "hr-headcount-calculator"
  | "hr-workforce-planning-calculator"
  | "hr-staffing-needs-calculator"
  | "hr-workload-distribution-calculator";

export const HR_WORKFORCE_SLUGS: HrWorkforceSlug[] = [
  "hr-headcount-calculator",
  "hr-workforce-planning-calculator",
  "hr-staffing-needs-calculator",
  "hr-workload-distribution-calculator",
];

export type HrWorkforceInput = {
  currentHeadcount?: number;
  hires?: number;
  exits?: number;
  demandUnits?: number;
  productivityPerFte?: number;
  attritionPct?: number;
  growthPct?: number;
  totalWorkload?: number;
  capacityPerPerson?: number;
  teamSize?: number;
};

export function computeHrWorkforce(slug: HrWorkforceSlug, input: HrWorkforceInput): HrResult {
  switch (slug) {
    case "hr-headcount-calculator": {
      const current = nonNeg(input.currentHeadcount, "Current headcount");
      if (typeof current !== "number") return { ok: false, error: current.error };
      const hires = nonNeg(input.hires ?? 0, "Hires");
      if (typeof hires !== "number") return { ok: false, error: hires.error };
      const exits = nonNeg(input.exits ?? 0, "Exits");
      if (typeof exits !== "number") return { ok: false, error: exits.error };
      return { ok: true, count: current + hires - exits, amount: current + hires - exits, note: "Ending HC = current + hires − exits." };
    }
    case "hr-workforce-planning-calculator": {
      const current = pos(input.currentHeadcount, "Current headcount");
      if (typeof current !== "number") return { ok: false, error: current.error };
      const growth = nonNeg(input.growthPct ?? 0, "Growth %");
      if (typeof growth !== "number") return { ok: false, error: growth.error };
      const attrition = nonNeg(input.attritionPct ?? 0, "Attrition %");
      if (typeof attrition !== "number") return { ok: false, error: attrition.error };
      const needed = current * (1 + growth / 100);
      const replacements = current * (attrition / 100);
      const netHires = needed - current + replacements;
      return { ok: true, count: needed, amount: Math.max(0, netHires), amount2: replacements, note: "Plan HC with growth; net hires include attrition replacements." };
    }
    case "hr-staffing-needs-calculator": {
      const demand = pos(input.demandUnits ?? input.totalWorkload, "Demand / workload");
      if (typeof demand !== "number") return { ok: false, error: demand.error };
      const prod = pos(input.productivityPerFte ?? input.capacityPerPerson, "Output per FTE");
      if (typeof prod !== "number") return { ok: false, error: prod.error };
      const fte = demand / prod;
      return { ok: true, count: fte, amount: fte, note: "Staffing need (FTE) = demand ÷ productivity per FTE." };
    }
    case "hr-workload-distribution-calculator": {
      const workload = pos(input.totalWorkload ?? input.demandUnits, "Total workload");
      if (typeof workload !== "number") return { ok: false, error: workload.error };
      const team = pos(input.teamSize ?? input.currentHeadcount, "Team size");
      if (typeof team !== "number") return { ok: false, error: team.error };
      const capacity = input.capacityPerPerson && input.capacityPerPerson > 0 ? input.capacityPerPerson : undefined;
      const perPerson = workload / team;
      const util = capacity ? (perPerson / capacity) * 100 : undefined;
      return { ok: true, amount: perPerson, pct: util, count: team, note: "Per-person load = total ÷ team; utilization if capacity given." };
    }
    default:
      return { ok: false, error: "Unknown workforce calculator." };
  }
}
