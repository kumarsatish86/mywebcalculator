/** Basic currency converters — illustrative FX teaching estimates. */
import { ILLUSTRATIVE, pos } from "./curHelpers";

export type CurBasicSlug =
  | "cur-currency-converter-global"
  | "cur-usd-to-inr-converter"
  | "cur-inr-to-usd-converter"
  | "cur-eur-to-usd-converter"
  | "cur-gbp-to-inr-converter"
  | "cur-aed-to-inr-converter"
  | "cur-sgd-to-inr-converter"
  | "cur-cad-to-inr-converter"
  | "cur-aud-to-inr-converter"
  | "cur-crypto-to-fiat-converter";

export const ALL_CUR_BASIC_SLUGS: CurBasicSlug[] = [
  "cur-currency-converter-global",
  "cur-usd-to-inr-converter",
  "cur-inr-to-usd-converter",
  "cur-eur-to-usd-converter",
  "cur-gbp-to-inr-converter",
  "cur-aed-to-inr-converter",
  "cur-sgd-to-inr-converter",
  "cur-cad-to-inr-converter",
  "cur-aud-to-inr-converter",
  "cur-crypto-to-fiat-converter",
];

export type CurBasicInput = {
  amount?: number;
  rate?: number;
};

export type CurBasicResult =
  | { ok: false; error: string }
  | {
      ok: true;
      converted: number;
      rateUsed: number;
      note: string;
    };

const PAIR_DEFAULT: Partial<Record<CurBasicSlug, { rate: number; note: string }>> = {
  "cur-usd-to-inr-converter": {
    rate: ILLUSTRATIVE.USD_INR,
    note: "Illustrative USD→INR (example 83). Not live market data.",
  },
  "cur-inr-to-usd-converter": {
    rate: 1 / ILLUSTRATIVE.USD_INR,
    note: "Illustrative INR→USD (1÷83). Not live market data.",
  },
  "cur-eur-to-usd-converter": {
    rate: ILLUSTRATIVE.EUR_USD,
    note: "Illustrative EUR→USD (example 1.08). Not live market data.",
  },
  "cur-gbp-to-inr-converter": {
    rate: ILLUSTRATIVE.GBP_INR,
    note: "Illustrative GBP→INR (example 105). Not live market data.",
  },
  "cur-aed-to-inr-converter": {
    rate: ILLUSTRATIVE.AED_INR,
    note: "Illustrative AED→INR (example 22.6). Not live market data.",
  },
  "cur-sgd-to-inr-converter": {
    rate: ILLUSTRATIVE.SGD_INR,
    note: "Illustrative SGD→INR (example 62). Not live market data.",
  },
  "cur-cad-to-inr-converter": {
    rate: ILLUSTRATIVE.CAD_INR,
    note: "Illustrative CAD→INR (example 61). Not live market data.",
  },
  "cur-aud-to-inr-converter": {
    rate: ILLUSTRATIVE.AUD_INR,
    note: "Illustrative AUD→INR (example 54). Not live market data.",
  },
};

export function computeCurBasic(slug: CurBasicSlug, input: CurBasicInput): CurBasicResult {
  const amt = pos(input.amount, "Amount");
  if (typeof amt !== "number") return { ok: false, error: amt.error };

  if (slug === "cur-currency-converter-global" || slug === "cur-crypto-to-fiat-converter") {
    const rate = pos(input.rate, "Rate");
    if (typeof rate !== "number") return { ok: false, error: rate.error };
    const note =
      slug === "cur-crypto-to-fiat-converter"
        ? "Crypto→fiat = units × illustrative price. Teaching estimate only."
        : "Converted = amount × rate. Enter an illustrative mid-market example — not live quotes.";
    return { ok: true, converted: amt * rate, rateUsed: rate, note };
  }

  const pair = PAIR_DEFAULT[slug];
  if (!pair) return { ok: false, error: "Unknown calculator." };
  const rate = input.rate !== undefined && Number.isFinite(input.rate) && input.rate > 0
    ? input.rate
    : pair.rate;
  return { ok: true, converted: amt * rate, rateUsed: rate, note: pair.note };
}
