/** Home appliance & HVAC — daily-life estimates. */

export type HomeApplianceSlug =
  | "home-ac-power-consumption-calculator"
  | "home-ac-tonnage-calculator"
  | "home-heater-electricity-cost-calculator"
  | "home-refrigerator-energy-calculator"
  | "home-washing-machine-cost-calculator"
  | "home-tv-power-consumption-calculator";

export type HomeApplianceInput = {
  watts?: number;
  hoursPerDay?: number;
  days?: number;
  ratePerKwh?: number;
  areaSqft?: number;
  tonsPerSqft?: number;
  kwhPerDay?: number;
  cycles?: number;
  kwhPerCycle?: number;
};

export type HomeApplianceResult =
  | { ok: false; error: string }
  | { ok: true; kwh?: number; cost?: number; tons?: number; note: string };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeHomeAppliance(
  slug: HomeApplianceSlug,
  input: HomeApplianceInput,
): HomeApplianceResult {
  const energyFromWatts = () => {
    const w = p(input.watts, "Watts");
    if (typeof w !== "number") return w;
    const h = p(input.hoursPerDay ?? 1, "Hours/day");
    if (typeof h !== "number") return h;
    const d = p(input.days ?? 30, "Days");
    if (typeof d !== "number") return d;
    return (w * h * d) / 1000;
  };

  switch (slug) {
    case "home-ac-power-consumption-calculator":
    case "home-heater-electricity-cost-calculator":
    case "home-tv-power-consumption-calculator":
    case "home-refrigerator-energy-calculator": {
      let kwh: number;
      if (input.kwhPerDay && input.kwhPerDay > 0) {
        const d = input.days ?? 30;
        kwh = input.kwhPerDay * d;
      } else {
        const e = energyFromWatts();
        if (typeof e !== "number") return { ok: false, error: e.error };
        kwh = e;
      }
      const rate = input.ratePerKwh ?? 0;
      return { ok: true, kwh, cost: rate > 0 ? kwh * rate : undefined, note: "Energy cost from watts×time or daily kWh." };
    }
    case "home-ac-tonnage-calculator": {
      const area = p(input.areaSqft, "Area sqft");
      if (typeof area !== "number") return { ok: false, error: area.error };
      const per = input.tonsPerSqft && input.tonsPerSqft > 0 ? input.tonsPerSqft : 1 / 150;
      return { ok: true, tons: area * per, note: `Rough tonnage ≈ area × ${per} ton/sqft (climate varies).` };
    }
    case "home-washing-machine-cost-calculator": {
      const cycles = p(input.cycles ?? 12, "Cycles/month");
      if (typeof cycles !== "number") return { ok: false, error: cycles.error };
      const kpc = p(input.kwhPerCycle ?? 1, "kWh/cycle");
      if (typeof kpc !== "number") return { ok: false, error: kpc.error };
      const kwh = cycles * kpc;
      const rate = input.ratePerKwh ?? 0;
      return { ok: true, kwh, cost: rate > 0 ? kwh * rate : undefined, note: "Washer energy = cycles × kWh/cycle." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
