/** Banking and transfer fee calculators — teaching remittance estimates. */
import { nonNeg, pos } from "./curHelpers";

export type CurBankingSlug =
  | "cur-international-money-transfer-calculator"
  | "cur-remittance-calculator-india"
  | "cur-wire-transfer-fee-calculator"
  | "cur-paypal-fee-calculator"
  | "cur-stripe-fee-calculator"
  | "cur-currency-conversion-fee-calculator"
  | "cur-bank-exchange-rate-calculator";

export const ALL_CUR_BANKING_SLUGS: CurBankingSlug[] = [
  "cur-international-money-transfer-calculator",
  "cur-remittance-calculator-india",
  "cur-wire-transfer-fee-calculator",
  "cur-paypal-fee-calculator",
  "cur-stripe-fee-calculator",
  "cur-currency-conversion-fee-calculator",
  "cur-bank-exchange-rate-calculator",
];

export type CurBankingInput = {
  amount?: number;
  rate?: number;
  feePct?: number;
  fixedFee?: number;
  markupPct?: number;
};

export type CurBankingResult =
  | { ok: false; error: string }
  | {
      ok: true;
      received?: number;
      fee?: number;
      totalCharged?: number;
      effectiveRate?: number;
      bankRate?: number;
      note: string;
    };

export function computeCurBanking(slug: CurBankingSlug, input: CurBankingInput): CurBankingResult {
  switch (slug) {
    case "cur-international-money-transfer-calculator":
    case "cur-remittance-calculator-india": {
      const amt = pos(input.amount, "Send amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const rate = pos(input.rate, "FX rate");
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
        effectiveRate: (net * rate) / amt,
        note:
          slug === "cur-remittance-calculator-india"
            ? "India remittance teaching: received = (send − fees) × rate."
            : "Transfer received = (send − fees) × illustrative rate.",
      };
    }
    case "cur-wire-transfer-fee-calculator": {
      const amt = pos(input.amount, "Amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const feePct = nonNeg(input.feePct ?? 0, "Fee %");
      if (typeof feePct !== "number") return { ok: false, error: feePct.error };
      const fixed = nonNeg(input.fixedFee ?? 0, "Fixed fee");
      if (typeof fixed !== "number") return { ok: false, error: fixed.error };
      const fee = amt * (feePct / 100) + fixed;
      return {
        ok: true,
        fee,
        totalCharged: amt + fee,
        note: "Wire fee = % of amount + fixed; total charged = amount + fee.",
      };
    }
    case "cur-paypal-fee-calculator": {
      const amt = pos(input.amount, "Amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const feePct = nonNeg(input.feePct ?? 2.9, "Fee %");
      if (typeof feePct !== "number") return { ok: false, error: feePct.error };
      const fixed = nonNeg(input.fixedFee ?? 0.3, "Fixed fee");
      if (typeof fixed !== "number") return { ok: false, error: fixed.error };
      const fee = amt * (feePct / 100) + fixed;
      return {
        ok: true,
        fee,
        totalCharged: amt + fee,
        received: amt,
        note: "PayPal-style fee teaching defaults (e.g. 2.9% + 0.30). Verify live schedule.",
      };
    }
    case "cur-stripe-fee-calculator": {
      const amt = pos(input.amount, "Amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const feePct = nonNeg(input.feePct ?? 2.9, "Fee %");
      if (typeof feePct !== "number") return { ok: false, error: feePct.error };
      const fixed = nonNeg(input.fixedFee ?? 0.3, "Fixed fee");
      if (typeof fixed !== "number") return { ok: false, error: fixed.error };
      const fee = amt * (feePct / 100) + fixed;
      return {
        ok: true,
        fee,
        received: amt - fee,
        note: "Stripe-style net ≈ amount − (% + fixed). Teaching defaults only.",
      };
    }
    case "cur-currency-conversion-fee-calculator": {
      const amt = pos(input.amount, "Amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const markup = nonNeg(input.markupPct ?? input.feePct ?? 0, "Spread %");
      if (typeof markup !== "number") return { ok: false, error: markup.error };
      const fee = amt * (markup / 100);
      return {
        ok: true,
        fee,
        received: amt - fee,
        note: "Conversion spread cost ≈ amount × spread%.",
      };
    }
    case "cur-bank-exchange-rate-calculator": {
      const mid = pos(input.rate, "Mid-market rate");
      if (typeof mid !== "number") return { ok: false, error: mid.error };
      const markup = nonNeg(input.markupPct ?? 0, "Bank markup %");
      if (typeof markup !== "number") return { ok: false, error: markup.error };
      const amt = pos(input.amount ?? 1, "Amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const bankRate = mid * (1 - markup / 100);
      return {
        ok: true,
        bankRate,
        effectiveRate: bankRate,
        received: amt * bankRate,
        note: "Bank rate ≈ mid × (1 − markup%). Illustrative teaching form.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
