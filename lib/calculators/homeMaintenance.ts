/** Home maintenance & cleaning — daily-life estimates. */

export type HomeMaintenanceSlug =
  | "home-cleaning-cost-calculator"
  | "home-maid-salary-calculator"
  | "home-deep-cleaning-cost-estimator"
  | "home-repair-cost-calculator"
  | "home-painting-cost-calculator"
  | "home-renovation-cost-calculator";

export type HomeMaintenanceInput = {
  areaSqft?: number;
  ratePerSqft?: number;
  daysPerMonth?: number;
  wagePerDay?: number;
  rooms?: number;
  ratePerRoom?: number;
  labor?: number;
  materials?: number;
};

export type HomeMaintenanceResult =
  | { ok: false; error: string }
  | { ok: true; total?: number; note: string };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeHomeMaintenance(
  slug: HomeMaintenanceSlug,
  input: HomeMaintenanceInput,
): HomeMaintenanceResult {
  switch (slug) {
    case "home-cleaning-cost-calculator":
    case "home-painting-cost-calculator":
    case "home-renovation-cost-calculator": {
      const area = p(input.areaSqft, "Area sqft");
      if (typeof area !== "number") return { ok: false, error: area.error };
      const rate = p(input.ratePerSqft, "Rate/sqft");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return { ok: true, total: area * rate, note: "Cost = area × rate/sqft." };
    }
    case "home-maid-salary-calculator": {
      const days = p(input.daysPerMonth ?? 30, "Days/month");
      if (typeof days !== "number") return { ok: false, error: days.error };
      const wage = p(input.wagePerDay, "Wage/day");
      if (typeof wage !== "number") return { ok: false, error: wage.error };
      return { ok: true, total: days * wage, note: "Monthly = days × daily wage." };
    }
    case "home-deep-cleaning-cost-estimator": {
      const rooms = p(input.rooms, "Rooms");
      if (typeof rooms !== "number") return { ok: false, error: rooms.error };
      const rate = p(input.ratePerRoom ?? input.ratePerSqft, "Rate/room");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return { ok: true, total: rooms * rate, note: "Deep clean ≈ rooms × rate." };
    }
    case "home-repair-cost-calculator": {
      const labor = input.labor ?? 0;
      const mat = input.materials ?? 0;
      if (labor < 0 || mat < 0 || (!labor && !mat)) return { ok: false, error: "Provide labor and/or materials." };
      return { ok: true, total: labor + mat, note: "Repair = labor + materials." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
