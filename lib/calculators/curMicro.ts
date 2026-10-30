/** High-intent India micro currency tools — illustrative teaching rates. */
import { ILLUSTRATIVE, nonNeg, pos } from "./curHelpers";

export type CurMicroSlug =
  | "cur-usd-to-inr-today-calculator"
  | "cur-best-exchange-rate-india-calculator"
  | "cur-send-money-abroad-india-calculator"
  | "cur-dollar-rate-india-calculator"
  | "cur-rupee-depreciation-calculator"
  | "cur-currency-converter-offline-logic-tool";

export const ALL_CUR_MICRO_SLUGS: CurMicroSlug[] = [
  "cur-usd-to-inr-today-calculator",
  "cur-best-exchange-rate-india-calculator",
  "cur-send-money-abroad-india-calculator",
  "cur-dollar-rate-india-calculator",
  "cur-rupee-depreciation-calculator",
  "cur-currency-converter-offline-logic-tool",
];

export type CurMicroInput = {
  amount?: number;
  rate?: number;
  rateB?: number;
  feePct?: number;
  fixedFee?: number;
  oldRate?: number;
  newRate?: number;
};

export type CurMicroResult =
  | { ok: false; error: string }
  | {
      ok: true;
      converted?: number;
      rateUsed?: number;
      betterLabel?: string;
      savings?: number;
      received?: number;
      fee?: number;
      depreciationPct?: number;
      note: string;
    };

export function computeCurMicro(slug: CurMicroSlug, input: CurMicroInput): CurMicroResult {
  switch (slug) {
    case "cur-usd-to-inr-today-calculator":
    case "cur-dollar-rate-india-calculator":
    case "cur-currency-converter-offline-logic-tool": {
      const amt = pos(input.amount ?? 1, "Amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const rate = pos(input.rate ?? ILLUSTRATIVE.USD_INR, "USD/INR");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const notes: Record<string, string> = {
        "cur-usd-to-inr-today-calculator":
          "Illustrative “today” USD→INR (example 83). Not a live quote.",
        "cur-dollar-rate-india-calculator":
          "Dollar rate India teaching: amount × illustrative USD/INR.",
        "cur-currency-converter-offline-logic-tool":
          "Offline logic = amount × stored illustrative rate (no network).",
      };
      return {
        ok: true,
        converted: amt * rate,
        rateUsed: rate,
        note: notes[slug],
      };
    }
    case "cur-best-exchange-rate-india-calculator": {
      const amt = pos(input.amount ?? 1, "Amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const a = pos(input.rate, "Provider A rate");
      if (typeof a !== "number") return { ok: false, error: a.error };
      const b = pos(input.rateB, "Provider B rate");
      if (typeof b !== "number") return { ok: false, error: b.error };
      const better = a >= b ? "Provider A" : "Provider B";
      return {
        ok: true,
        betterLabel: better,
        savings: Math.abs(amt * a - amt * b),
        converted: amt * Math.max(a, b),
        note: `${better} is better for INR received in this comparison.`,
      };
    }
    case "cur-send-money-abroad-india-calculator": {
      const amt = pos(input.amount, "Send amount (INR)");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const rate = pos(input.rate, "INR→foreign rate");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const feePct = nonNeg(input.feePct ?? 0, "Fee %");
      if (typeof feePct !== "number") return { ok: false, error: feePct.error };
      const fixed = nonNeg(input.fixedFee ?? 0, "Fixed fee");
      if (typeof fixed !== "number") return { ok: false, error: fixed.error };
      const fee = amt * (feePct / 100) + fixed;
      const net = amt - fee;
      if (net <= 0) return { ok: false, error: "Fees exceed send amount." };
      return {
        ok: true,
        fee,
        received: net * rate,
        note: "Abroad received = (INR send − fees) × illustrative rate.",
      };
    }
    case "cur-rupee-depreciation-calculator": {
      const oldR = pos(input.oldRate, "Earlier USD/INR");
      if (typeof oldR !== "number") return { ok: false, error: oldR.error };
      const newR = pos(input.newRate, "Later USD/INR");
      if (typeof newR !== "number") return { ok: false, error: newR.error };
      // Higher USD/INR means rupee weaker
      return {
        ok: true,
        depreciationPct: ((newR - oldR) / oldR) * 100,
        note: "INR depreciation% vs USD ≈ (new − old) ÷ old × 100 when rate is USD/INR.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
