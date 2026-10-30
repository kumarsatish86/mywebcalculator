/** Home smart & sustainability — daily-life estimates. */

export type HomeSmartSlug =
  | "home-smart-home-cost-calculator"
  | "home-iot-device-cost-calculator"
  | "home-energy-efficiency-savings-calculator"
  | "home-carbon-footprint-calculator"
  | "home-energy-saving-calculator"
  | "home-green-home-cost-calculator";

export type HomeSmartInput = {
  devices?: number;
  priceEach?: number;
  install?: number;
  beforeKwh?: number;
  afterKwh?: number;
  ratePerKwh?: number;
  kwh?: number;
  kgCo2PerKwh?: number;
  upgradeCost?: number;
  annualSavings?: number;
};

export type HomeSmartResult =
  | { ok: false; error: string }
  | {
      ok: true;
      total?: number;
      savings?: number;
      kgCo2?: number;
      years?: number;
      note: string;
    };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeHomeSmart(slug: HomeSmartSlug, input: HomeSmartInput): HomeSmartResult {
  switch (slug) {
    case "home-smart-home-cost-calculator":
    case "home-iot-device-cost-calculator":
    case "home-green-home-cost-calculator": {
      const n = p(input.devices ?? 1, "Devices / items");
      if (typeof n !== "number") return { ok: false, error: n.error };
      const price = p(input.priceEach ?? input.upgradeCost, "Unit price");
      if (typeof price !== "number") return { ok: false, error: price.error };
      const install = input.install && input.install > 0 ? input.install : 0;
      return { ok: true, total: n * price + install, note: "Cost = count × price + install." };
    }
    case "home-energy-efficiency-savings-calculator":
    case "home-energy-saving-calculator": {
      const before = p(input.beforeKwh, "Before kWh");
      if (typeof before !== "number") return { ok: false, error: before.error };
      const after = input.afterKwh;
      if (after === undefined || !Number.isFinite(after) || after < 0) {
        return { ok: false, error: "After kWh must be ≥ 0." };
      }
      const rate = input.ratePerKwh ?? 0;
      const saved = before - after;
      return {
        ok: true,
        savings: rate > 0 ? saved * rate : saved,
        note: rate > 0 ? "Savings = (before−after)×rate." : "kWh saved = before−after.",
      };
    }
    case "home-carbon-footprint-calculator": {
      const kwh = p(input.kwh, "kWh");
      if (typeof kwh !== "number") return { ok: false, error: kwh.error };
      const f = input.kgCo2PerKwh && input.kgCo2PerKwh > 0 ? input.kgCo2PerKwh : 0.7;
      return { ok: true, kgCo2: kwh * f, note: `CO₂ ≈ kWh × ${f} kg/kWh (grid factor varies).` };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
