/** Travel and expense currency tools — trip budget teaching estimates. */
import { pos } from "./curHelpers";

export type CurTravelSlug =
  | "cur-travel-currency-calculator"
  | "cur-foreign-trip-budget-calculator"
  | "cur-airport-vs-bank-exchange-calculator"
  | "cur-travel-expense-split-calculator"
  | "cur-daily-travel-budget-calculator";

export const ALL_CUR_TRAVEL_SLUGS: CurTravelSlug[] = [
  "cur-travel-currency-calculator",
  "cur-foreign-trip-budget-calculator",
  "cur-airport-vs-bank-exchange-calculator",
  "cur-travel-expense-split-calculator",
  "cur-daily-travel-budget-calculator",
];

export type CurTravelInput = {
  amount?: number;
  rate?: number;
  rateB?: number;
  daily?: number;
  days?: number;
  people?: number;
  total?: number;
};

export type CurTravelResult =
  | { ok: false; error: string }
  | {
      ok: true;
      converted?: number;
      airport?: number;
      bank?: number;
      betterLabel?: string;
      savings?: number;
      perPerson?: number;
      total?: number;
      note: string;
    };

export function computeCurTravel(slug: CurTravelSlug, input: CurTravelInput): CurTravelResult {
  switch (slug) {
    case "cur-travel-currency-calculator": {
      const amt = pos(input.amount, "Home amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const rate = pos(input.rate, "FX rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return { ok: true, converted: amt * rate, note: "Local cash ≈ amount × illustrative FX." };
    }
    case "cur-foreign-trip-budget-calculator": {
      const daily = pos(input.daily ?? input.amount, "Daily spend (home)");
      if (typeof daily !== "number") return { ok: false, error: daily.error };
      const days = pos(input.days ?? 1, "Days");
      if (typeof days !== "number") return { ok: false, error: days.error };
      const rate = pos(input.rate ?? 1, "FX rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const people = input.people && input.people > 0 ? input.people : 1;
      const home = daily * days * people;
      return {
        ok: true,
        total: home,
        converted: home * rate,
        note: "Trip budget = daily × days × people; local = × FX.",
      };
    }
    case "cur-airport-vs-bank-exchange-calculator": {
      const amt = pos(input.amount, "Amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const airportRate = pos(input.rate, "Airport rate");
      if (typeof airportRate !== "number") return { ok: false, error: airportRate.error };
      const bankRate = pos(input.rateB, "Bank rate");
      if (typeof bankRate !== "number") return { ok: false, error: bankRate.error };
      const airport = amt * airportRate;
      const bank = amt * bankRate;
      const better = bank >= airport ? "Bank" : "Airport";
      return {
        ok: true,
        airport,
        bank,
        betterLabel: better,
        savings: Math.abs(bank - airport),
        note: `${better} yields more destination currency in this example.`,
      };
    }
    case "cur-travel-expense-split-calculator": {
      const total = pos(input.total ?? input.amount, "Total expense");
      if (typeof total !== "number") return { ok: false, error: total.error };
      const people = pos(input.people ?? 1, "People");
      if (typeof people !== "number") return { ok: false, error: people.error };
      return {
        ok: true,
        total,
        perPerson: total / people,
        note: "Equal split = total ÷ people.",
      };
    }
    case "cur-daily-travel-budget-calculator": {
      const daily = pos(input.daily ?? input.amount, "Daily budget");
      if (typeof daily !== "number") return { ok: false, error: daily.error };
      const days = pos(input.days ?? 1, "Days");
      if (typeof days !== "number") return { ok: false, error: days.error };
      return {
        ok: true,
        total: daily * days,
        note: "Trip total = daily budget × days.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
