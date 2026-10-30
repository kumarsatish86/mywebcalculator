/** Home rent & housing — daily-life estimates. */

export type HomeRentSlug =
  | "home-rent-affordability-calculator"
  | "home-rent-split-roommates-calculator"
  | "home-rent-vs-buy-calculator"
  | "home-lease-cost-calculator"
  | "home-property-maintenance-cost-calculator"
  | "home-ownership-cost-calculator"
  | "home-society-charges-calculator";

export type HomeRentInput = {
  income?: number;
  rentPct?: number;
  rent?: number;
  roommates?: number;
  buyMonthly?: number;
  years?: number;
  depositMonths?: number;
  maintenancePct?: number;
  propertyValue?: number;
  taxInsurance?: number;
  societyPerSqft?: number;
  areaSqft?: number;
};

export type HomeRentResult =
  | { ok: false; error: string }
  | {
      ok: true;
      affordableRent?: number;
      perPerson?: number;
      total?: number;
      better?: string;
      note: string;
    };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeHomeRent(slug: HomeRentSlug, input: HomeRentInput): HomeRentResult {
  switch (slug) {
    case "home-rent-affordability-calculator": {
      const income = p(input.income, "Monthly income");
      if (typeof income !== "number") return { ok: false, error: income.error };
      const pct = input.rentPct && input.rentPct > 0 ? input.rentPct / 100 : 0.3;
      return { ok: true, affordableRent: income * pct, note: `Rule of thumb: ~${pct * 100}% of income toward rent.` };
    }
    case "home-rent-split-roommates-calculator": {
      const rent = p(input.rent, "Total rent");
      if (typeof rent !== "number") return { ok: false, error: rent.error };
      const n = p(input.roommates ?? 2, "Roommates");
      if (typeof n !== "number") return { ok: false, error: n.error };
      return { ok: true, perPerson: rent / n, total: rent, note: "Equal split = rent ÷ people." };
    }
    case "home-rent-vs-buy-calculator": {
      const rent = p(input.rent, "Monthly rent");
      if (typeof rent !== "number") return { ok: false, error: rent.error };
      const buy = p(input.buyMonthly, "Buy monthly (EMI+costs)");
      if (typeof buy !== "number") return { ok: false, error: buy.error };
      const years = input.years ?? 5;
      const rentTot = rent * 12 * years;
      const buyTot = buy * 12 * years;
      return {
        ok: true,
        total: Math.min(rentTot, buyTot),
        better: rentTot < buyTot ? "rent" : "buy",
        note: `${years}-year cash outflow: rent ${rentTot.toFixed(0)} vs buy ${buyTot.toFixed(0)} (ignores equity).`,
      };
    }
    case "home-lease-cost-calculator": {
      const rent = p(input.rent, "Monthly rent");
      if (typeof rent !== "number") return { ok: false, error: rent.error };
      const years = p(input.years ?? 1, "Lease years");
      if (typeof years !== "number") return { ok: false, error: years.error };
      const dep = input.depositMonths && input.depositMonths > 0 ? input.depositMonths : 0;
      return {
        ok: true,
        total: rent * 12 * years + rent * dep,
        note: "Lease cash ≈ rent×12×years + deposit (months×rent).",
      };
    }
    case "home-property-maintenance-cost-calculator": {
      const value = p(input.propertyValue, "Property value");
      if (typeof value !== "number") return { ok: false, error: value.error };
      const pct = input.maintenancePct && input.maintenancePct > 0 ? input.maintenancePct / 100 : 0.01;
      return { ok: true, total: value * pct, note: `Annual maintenance ≈ ${pct * 100}% of property value.` };
    }
    case "home-ownership-cost-calculator": {
      const buy = p(input.buyMonthly ?? input.rent, "Monthly ownership cost");
      if (typeof buy !== "number") return { ok: false, error: buy.error };
      const tax = input.taxInsurance && input.taxInsurance > 0 ? input.taxInsurance : 0;
      return { ok: true, total: buy * 12 + tax, note: "Annual ownership ≈ monthly×12 + tax/insurance." };
    }
    case "home-society-charges-calculator": {
      const rate = p(input.societyPerSqft, "Charge per sqft");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const area = p(input.areaSqft, "Area sqft");
      if (typeof area !== "number") return { ok: false, error: area.error };
      return { ok: true, total: rate * area, note: "Society charges = rate × area." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
