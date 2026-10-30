/** Home electricity & energy — daily-life estimates. */

export type HomeElectricitySlug =
  | "home-electricity-bill-calculator"
  | "home-unit-consumption-calculator"
  | "home-cost-per-unit-calculator"
  | "home-appliance-energy-consumption-calculator"
  | "home-monthly-electricity-cost-estimator"
  | "home-annual-energy-cost-calculator"
  | "home-power-usage-kwh-calculator"
  | "home-standby-power-consumption-calculator"
  | "home-solar-panel-cost-calculator"
  | "home-solar-savings-calculator"
  | "home-solar-panel-size-calculator"
  | "home-solar-roi-calculator"
  | "home-battery-backup-calculator"
  | "home-inverter-load-calculator"
  | "home-battery-backup-time-calculator"
  | "home-ups-calculator"
  | "home-generator-fuel-consumption-calculator";

export type HomeElectricityInput = {
  kwh?: number;
  ratePerKwh?: number;
  watts?: number;
  hoursPerDay?: number;
  days?: number;
  fixedCharge?: number;
  standbyWatts?: number;
  panelKw?: number;
  costPerWatt?: number;
  sunHours?: number;
  systemCost?: number;
  annualSavings?: number;
  ah?: number;
  voltage?: number;
  dod?: number;
  loadWatts?: number;
  efficiency?: number;
  fuelLPerHour?: number;
  runHours?: number;
  fuelPrice?: number;
};

export type HomeElectricityResult =
  | { ok: false; error: string }
  | {
      ok: true;
      kwh?: number;
      cost?: number;
      rate?: number;
      kw?: number;
      hours?: number;
      years?: number;
      note: string;
    };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeHomeElectricity(
  slug: HomeElectricitySlug,
  input: HomeElectricityInput,
): HomeElectricityResult {
  switch (slug) {
    case "home-electricity-bill-calculator":
    case "home-monthly-electricity-cost-estimator": {
      const kwh = p(input.kwh, "kWh");
      if (typeof kwh !== "number") return { ok: false, error: kwh.error };
      const rate = p(input.ratePerKwh, "Rate/kWh");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const fixed = input.fixedCharge && input.fixedCharge > 0 ? input.fixedCharge : 0;
      return { ok: true, kwh, cost: kwh * rate + fixed, note: "Bill ≈ units×rate + fixed charge." };
    }
    case "home-unit-consumption-calculator":
    case "home-power-usage-kwh-calculator":
    case "home-appliance-energy-consumption-calculator": {
      const w = p(input.watts, "Watts");
      if (typeof w !== "number") return { ok: false, error: w.error };
      const h = p(input.hoursPerDay ?? 1, "Hours/day");
      if (typeof h !== "number") return { ok: false, error: h.error };
      const d = p(input.days ?? 30, "Days");
      if (typeof d !== "number") return { ok: false, error: d.error };
      const kwh = (w * h * d) / 1000;
      const rate = input.ratePerKwh && input.ratePerKwh > 0 ? input.ratePerKwh : undefined;
      return {
        ok: true,
        kwh,
        cost: rate ? kwh * rate : undefined,
        note: "kWh = W×hours×days ÷ 1000.",
      };
    }
    case "home-cost-per-unit-calculator": {
      const bill = p(input.systemCost ?? input.fixedCharge ?? input.watts, "Bill amount");
      if (typeof bill !== "number") return { ok: false, error: bill.error };
      const unitCount = p(input.kwh, "Units consumed");
      if (typeof unitCount !== "number") return { ok: false, error: unitCount.error };
      return { ok: true, rate: bill / unitCount, cost: bill, kwh: unitCount, note: "Effective rate = bill ÷ units." };
    }
    case "home-annual-energy-cost-calculator": {
      const monthlyKwh = input.kwh;
      const monthlyCost = input.systemCost;
      if (monthlyCost && monthlyCost > 0) {
        return { ok: true, cost: monthlyCost * 12, note: "Annual = monthly cost × 12." };
      }
      const kwh = p(monthlyKwh, "Monthly kWh");
      if (typeof kwh !== "number") return { ok: false, error: kwh.error };
      const rate = p(input.ratePerKwh, "Rate/kWh");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return { ok: true, cost: kwh * rate * 12, kwh: kwh * 12, note: "Annual = monthly kWh × rate × 12." };
    }
    case "home-standby-power-consumption-calculator": {
      const w = p(input.standbyWatts ?? input.watts, "Standby watts");
      if (typeof w !== "number") return { ok: false, error: w.error };
      const d = input.days ?? 30;
      const kwh = (w * 24 * d) / 1000;
      const rate = input.ratePerKwh ?? 0;
      return { ok: true, kwh, cost: rate > 0 ? kwh * rate : undefined, note: "Vampire load ≈ W×24×days ÷ 1000." };
    }
    case "home-solar-panel-cost-calculator": {
      const kw = p(input.panelKw, "System kW");
      if (typeof kw !== "number") return { ok: false, error: kw.error };
      const cpw = p(input.costPerWatt ?? 50, "Cost per watt");
      if (typeof cpw !== "number") return { ok: false, error: cpw.error };
      return { ok: true, kw, cost: kw * 1000 * cpw, note: "System cost ≈ kW × 1000 × $/W (installed)." };
    }
    case "home-solar-panel-size-calculator": {
      const kwh = p(input.kwh, "Daily kWh need");
      if (typeof kwh !== "number") return { ok: false, error: kwh.error };
      const sun = p(input.sunHours ?? 4, "Peak sun hours");
      if (typeof sun !== "number") return { ok: false, error: sun.error };
      return { ok: true, kw: kwh / sun, note: "Array kW ≈ daily kWh ÷ peak sun hours." };
    }
    case "home-solar-savings-calculator": {
      const gen = p(input.kwh, "Monthly solar kWh");
      if (typeof gen !== "number") return { ok: false, error: gen.error };
      const rate = p(input.ratePerKwh, "Tariff");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return { ok: true, cost: gen * rate, kwh: gen, note: "Monthly savings ≈ generation × tariff." };
    }
    case "home-solar-roi-calculator": {
      const cost = p(input.systemCost ?? input.kwh, "System cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const save = p(input.annualSavings ?? input.ratePerKwh, "Annual savings");
      if (typeof save !== "number") return { ok: false, error: save.error };
      return { ok: true, years: cost / save, cost, note: "Simple payback years = cost ÷ annual savings." };
    }
    case "home-battery-backup-calculator":
    case "home-battery-backup-time-calculator": {
      const ah = p(input.ah, "Battery Ah");
      if (typeof ah !== "number") return { ok: false, error: ah.error };
      const v = p(input.voltage ?? 12, "Voltage");
      if (typeof v !== "number") return { ok: false, error: v.error };
      const load = p(input.loadWatts, "Load watts");
      if (typeof load !== "number") return { ok: false, error: load.error };
      const dod = input.dod && input.dod > 0 && input.dod <= 1 ? input.dod : 0.5;
      const eff = input.efficiency && input.efficiency > 0 ? input.efficiency : 0.85;
      const hours = (ah * v * dod * eff) / load;
      return { ok: true, hours, note: `Backup hours ≈ Ah×V×DoD×η ÷ load (DoD=${dod}, η=${eff}).` };
    }
    case "home-inverter-load-calculator":
    case "home-ups-calculator": {
      const load = p(input.loadWatts, "Load watts");
      if (typeof load !== "number") return { ok: false, error: load.error };
      const pf = input.efficiency && input.efficiency > 0 ? input.efficiency : 0.8;
      const va = load / pf;
      return { ok: true, kw: va / 1000, note: `Inverter/UPS size ≈ load ÷ PF (${pf}) → ${va.toFixed(0)} VA.` };
    }
    case "home-generator-fuel-consumption-calculator": {
      const lph = p(input.fuelLPerHour, "Fuel L/h");
      if (typeof lph !== "number") return { ok: false, error: lph.error };
      const hrs = p(input.runHours ?? 1, "Hours");
      if (typeof hrs !== "number") return { ok: false, error: hrs.error };
      const price = input.fuelPrice ?? 0;
      const liters = lph * hrs;
      return {
        ok: true,
        cost: price > 0 ? liters * price : undefined,
        hours: hrs,
        note: "Fuel used = L/h × hours.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
