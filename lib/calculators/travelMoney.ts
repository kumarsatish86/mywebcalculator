/** Travel currency + food — daily-life estimates. */
import { pos, nonNeg } from "./travelHelpers";

export type TravelMoneySlug =
  | "travel-currency-exchange-budget-calculator"
  | "travel-atm-fee-adjusted-rate-calculator"
  | "travel-tipping-abroad-calculator"
  | "travel-purchasing-power-comparison-calculator"
  | "travel-meal-per-diem-calculator"
  | "travel-restaurant-bill-split-travel-calculator"
  | "travel-all-inclusive-value-calculator"
  | "travel-street-food-budget-calculator";

export type TravelMoneyInput = {
  amount?: number;
  rate?: number;
  feePct?: number;
  fixedFee?: number;
  bill?: number;
  tipPct?: number;
  people?: number;
  priceHome?: number;
  priceAbroad?: number;
  perDiem?: number;
  days?: number;
  inclusiveCost?: number;
  mealsValue?: number;
  dailyStreet?: number;
};

export type TravelMoneyResult =
  | { ok: false; error: string }
  | {
      ok: true;
      converted?: number;
      effectiveRate?: number;
      tip?: number;
      total?: number;
      perPerson?: number;
      pppRatio?: number;
      note: string;
    };

export function computeTravelMoney(slug: TravelMoneySlug, input: TravelMoneyInput): TravelMoneyResult {
  switch (slug) {
    case "travel-currency-exchange-budget-calculator": {
      const amt = pos(input.amount, "Home amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const rate = pos(input.rate, "FX rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return { ok: true, converted: amt * rate, note: "Local budget = amount × FX rate." };
    }
    case "travel-atm-fee-adjusted-rate-calculator": {
      const amt = pos(input.amount, "Withdraw");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const rate = pos(input.rate, "Mid-market rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const feePct = nonNeg(input.feePct ?? 0, "Fee %");
      if (typeof feePct !== "number") return { ok: false, error: feePct.error };
      const fixed = input.fixedFee ?? 0;
      const net = amt - amt * (feePct / 100) - fixed;
      return { ok: true, converted: net * rate, effectiveRate: (net * rate) / amt, note: "Fee-adjusted FX." };
    }
    case "travel-tipping-abroad-calculator": {
      const bill = pos(input.bill ?? input.amount, "Bill");
      if (typeof bill !== "number") return { ok: false, error: bill.error };
      const tipPct = nonNeg(input.tipPct ?? 10, "Tip %");
      if (typeof tipPct !== "number") return { ok: false, error: tipPct.error };
      const tip = bill * (tipPct / 100);
      return { ok: true, tip, total: bill + tip, note: "Tip = bill × tip%." };
    }
    case "travel-purchasing-power-comparison-calculator": {
      const home = pos(input.priceHome, "Home price");
      if (typeof home !== "number") return { ok: false, error: home.error };
      const abroad = pos(input.priceAbroad, "Abroad price");
      if (typeof abroad !== "number") return { ok: false, error: abroad.error };
      return { ok: true, pppRatio: home / abroad, note: "PPP ratio = home ÷ abroad (same basket)." };
    }
    case "travel-meal-per-diem-calculator":
    case "travel-street-food-budget-calculator": {
      const daily = pos(input.perDiem ?? input.dailyStreet ?? input.amount, "Daily meal budget");
      if (typeof daily !== "number") return { ok: false, error: daily.error };
      const days = pos(input.days ?? 1, "Days");
      if (typeof days !== "number") return { ok: false, error: days.error };
      const people = input.people && input.people > 0 ? input.people : 1;
      return { ok: true, total: daily * days * people, note: "Meals = daily × days × people." };
    }
    case "travel-restaurant-bill-split-travel-calculator": {
      const bill = pos(input.bill ?? input.amount, "Bill");
      if (typeof bill !== "number") return { ok: false, error: bill.error };
      const tipPct = nonNeg(input.tipPct ?? 0, "Tip %");
      if (typeof tipPct !== "number") return { ok: false, error: tipPct.error };
      const people = pos(input.people ?? 1, "People");
      if (typeof people !== "number") return { ok: false, error: people.error };
      const total = bill * (1 + tipPct / 100);
      return { ok: true, total, perPerson: total / people, tip: total - bill, note: "Equal split with tip." };
    }
    case "travel-all-inclusive-value-calculator": {
      const incl = pos(input.inclusiveCost, "All-inclusive cost");
      if (typeof incl !== "number") return { ok: false, error: incl.error };
      const meals = pos(input.mealsValue ?? input.amount, "Estimated meal value");
      if (typeof meals !== "number") return { ok: false, error: meals.error };
      return {
        ok: true,
        total: incl - meals,
        note: incl <= meals ? "AI looks like good value vs meals." : "Meals alone may be cheaper — check extras.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
