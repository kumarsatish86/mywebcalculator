/** Home kitchen & cooking — daily-life estimates. */

export type HomeKitchenSlug =
  | "home-gas-consumption-calculator"
  | "home-cooking-cost-calculator"
  | "home-induction-vs-gas-cost-calculator"
  | "home-grocery-budget-calculator"
  | "home-monthly-food-expense-calculator";

export type HomeKitchenInput = {
  hours?: number;
  kgPerHour?: number;
  pricePerKg?: number;
  inductionKwh?: number;
  gasKg?: number;
  elecRate?: number;
  groceryWeekly?: number;
  people?: number;
  perPersonDaily?: number;
  mealsOut?: number;
};

export type HomeKitchenResult =
  | { ok: false; error: string }
  | { ok: true; amount?: number; cost?: number; cheaper?: string; note: string };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeHomeKitchen(slug: HomeKitchenSlug, input: HomeKitchenInput): HomeKitchenResult {
  switch (slug) {
    case "home-gas-consumption-calculator": {
      const hrs = p(input.hours, "Burner hours");
      if (typeof hrs !== "number") return { ok: false, error: hrs.error };
      const rate = p(input.kgPerHour ?? 0.15, "kg/hour");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const kg = hrs * rate;
      const price = input.pricePerKg ?? 0;
      return { ok: true, amount: kg, cost: price > 0 ? kg * price : undefined, note: "Gas kg ≈ hours × kg/h." };
    }
    case "home-cooking-cost-calculator": {
      const kg = p(input.gasKg ?? input.kgPerHour, "Fuel amount");
      if (typeof kg !== "number") return { ok: false, error: kg.error };
      const price = p(input.pricePerKg, "Price/unit");
      if (typeof price !== "number") return { ok: false, error: price.error };
      return { ok: true, cost: kg * price, note: "Cooking fuel cost = amount × unit price." };
    }
    case "home-induction-vs-gas-cost-calculator": {
      const ikwh = p(input.inductionKwh, "Induction kWh");
      if (typeof ikwh !== "number") return { ok: false, error: ikwh.error };
      const er = p(input.elecRate, "Electricity rate");
      if (typeof er !== "number") return { ok: false, error: er.error };
      const gkg = p(input.gasKg, "Gas kg");
      if (typeof gkg !== "number") return { ok: false, error: gkg.error };
      const gp = p(input.pricePerKg, "Gas price/kg");
      if (typeof gp !== "number") return { ok: false, error: gp.error };
      const elec = ikwh * er;
      const gas = gkg * gp;
      return {
        ok: true,
        cost: Math.min(elec, gas),
        cheaper: elec <= gas ? "induction" : "gas",
        note: `Induction ${elec.toFixed(2)} vs gas ${gas.toFixed(2)}.`,
      };
    }
    case "home-grocery-budget-calculator": {
      const weekly = p(input.groceryWeekly, "Weekly grocery");
      if (typeof weekly !== "number") return { ok: false, error: weekly.error };
      return { ok: true, cost: weekly * (52 / 12), amount: weekly * 52, note: "Monthly ≈ weekly × 4.33; annual ×52." };
    }
    case "home-monthly-food-expense-calculator": {
      const people = p(input.people ?? 1, "People");
      if (typeof people !== "number") return { ok: false, error: people.error };
      const daily = p(input.perPersonDaily, "Per-person daily food");
      if (typeof daily !== "number") return { ok: false, error: daily.error };
      const out = input.mealsOut && input.mealsOut > 0 ? input.mealsOut : 0;
      return {
        ok: true,
        cost: people * daily * 30 + out,
        note: "Food ≈ people × daily × 30 + eating-out.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
