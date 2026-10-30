/** HR scheduling & shift planning — teaching estimates. */
import { nonNeg, pos, type HrResult } from "./hrHelpers";

export type HrSchedulingSlug =
  | "hr-shift-planning-calculator"
  | "hr-rotational-shift-calculator"
  | "hr-staffing-coverage-calculator"
  | "hr-shift-differential-pay-calculator";

export const HR_SCHEDULING_SLUGS: HrSchedulingSlug[] = [
  "hr-shift-planning-calculator",
  "hr-rotational-shift-calculator",
  "hr-staffing-coverage-calculator",
  "hr-shift-differential-pay-calculator",
];

export type HrSchedulingInput = {
  hoursCoverageNeeded?: number;
  shiftLengthHours?: number;
  peoplePerShift?: number;
  shiftsPerDay?: number;
  daysInCycle?: number;
  peopleInRoster?: number;
  seatsNeeded?: number;
  staffAvailable?: number;
  baseHourly?: number;
  differentialPct?: number;
  shiftHours?: number;
  rotationTeams?: number;
};

export function computeHrScheduling(slug: HrSchedulingSlug, input: HrSchedulingInput): HrResult {
  switch (slug) {
    case "hr-shift-planning-calculator": {
      const coverage = pos(input.hoursCoverageNeeded ?? 24, "Coverage hours");
      if (typeof coverage !== "number") return { ok: false, error: coverage.error };
      const length = pos(input.shiftLengthHours ?? 8, "Shift length");
      if (typeof length !== "number") return { ok: false, error: length.error };
      const people = pos(input.peoplePerShift ?? 1, "People per shift");
      if (typeof people !== "number") return { ok: false, error: people.error };
      const shifts = coverage / length;
      const headcount = shifts * people;
      return { ok: true, count: headcount, amount: shifts, hours: coverage, note: "Shifts = coverage ÷ length; HC ≈ shifts × people/shift." };
    }
    case "hr-rotational-shift-calculator": {
      const days = pos(input.daysInCycle ?? 21, "Days in cycle");
      if (typeof days !== "number") return { ok: false, error: days.error };
      const teams = pos(input.rotationTeams ?? input.peopleInRoster ?? 3, "Teams / roster size");
      if (typeof teams !== "number") return { ok: false, error: teams.error };
      const shiftsPerDay = pos(input.shiftsPerDay ?? 3, "Shifts per day");
      if (typeof shiftsPerDay !== "number") return { ok: false, error: shiftsPerDay.error };
      const daysOn = days / teams;
      return { ok: true, days: daysOn, count: teams, amount: shiftsPerDay, note: "Rotation: days on ≈ cycle ÷ teams (illustrative roster)." };
    }
    case "hr-staffing-coverage-calculator": {
      const needed = pos(input.seatsNeeded ?? input.peoplePerShift, "Seats / roles needed");
      if (typeof needed !== "number") return { ok: false, error: needed.error };
      const available = pos(input.staffAvailable ?? input.peopleInRoster, "Staff available");
      if (typeof available !== "number") return { ok: false, error: available.error };
      const pct = (available / needed) * 100;
      return { ok: true, pct, count: available - needed, amount: Math.max(0, needed - available), note: "Coverage % = available ÷ needed; gap = shortfall." };
    }
    case "hr-shift-differential-pay-calculator": {
      const base = pos(input.baseHourly, "Base hourly");
      if (typeof base !== "number") return { ok: false, error: base.error };
      const diff = nonNeg(input.differentialPct ?? 10, "Differential %");
      if (typeof diff !== "number") return { ok: false, error: diff.error };
      const hours = pos(input.shiftHours ?? 8, "Shift hours");
      if (typeof hours !== "number") return { ok: false, error: hours.error };
      const rate = base * (1 + diff / 100);
      return { ok: true, rate, amount: rate * hours, hours, note: "Differential rate = base × (1 + %); pay = rate × hours." };
    }
    default:
      return { ok: false, error: "Unknown scheduling calculator." };
  }
}
