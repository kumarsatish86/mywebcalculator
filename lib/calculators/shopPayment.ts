/** Shop payment & EMI — daily-life estimates. */
import { pos, nonNeg } from "./shopHelpers";

export type ShopPaymentSlug =
  | "shop-emi-calculator"
  | "shop-no-cost-emi-comparison-calculator"
  | "shop-bnpl-total-cost-calculator"
  | "shop-installment-plan-comparison-calculator"
  | "shop-down-payment-calculator"
  | "shop-interest-on-deferred-payment-calculator";

export type ShopPaymentInput = {
  principal?: number;
  annualRatePct?: number;
  months?: number;
  processingFee?: number;
  fees?: number;
  downPct?: number;
  downAmt?: number;
  planAMonthly?: number;
  planBMonthly?: number;
  planAMonths?: number;
  planBMonths?: number;
};

export type ShopPaymentResult =
  | { ok: false; error: string }
  | {
      ok: true;
      emi?: number;
      total?: number;
      interest?: number;
      down?: number;
      financed?: number;
      cheaper?: string;
      note: string;
    };

function reducingEmi(P: number, annualPct: number, n: number): number {
  if (n <= 0) return P;
  if (annualPct <= 0) return P / n;
  const r = annualPct / 100 / 12;
  return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function computeShopPayment(slug: ShopPaymentSlug, input: ShopPaymentInput): ShopPaymentResult {
  switch (slug) {
    case "shop-emi-calculator": {
      const P = pos(input.principal, "Principal");
      if (typeof P !== "number") return { ok: false, error: P.error };
      const rate = nonNeg(input.annualRatePct ?? 0, "APR %");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const n = pos(input.months, "Months");
      if (typeof n !== "number") return { ok: false, error: n.error };
      const emi = reducingEmi(P, rate, n);
      const total = emi * n;
      return { ok: true, emi, total, interest: total - P, note: "Reducing-balance EMI (monthly)." };
    }
    case "shop-no-cost-emi-comparison-calculator": {
      const P = pos(input.principal, "Price");
      if (typeof P !== "number") return { ok: false, error: P.error };
      const n = pos(input.months ?? 3, "Months");
      if (typeof n !== "number") return { ok: false, error: n.error };
      const fee = nonNeg(input.processingFee ?? input.fees ?? 0, "Fees");
      if (typeof fee !== "number") return { ok: false, error: fee.error };
      const noCostTotal = P + fee;
      const rate = input.annualRatePct ?? 12;
      const emi = reducingEmi(P, rate, n);
      const interestTotal = emi * n;
      return {
        ok: true,
        total: noCostTotal,
        emi: P / n,
        interest: interestTotal - P,
        cheaper: noCostTotal <= interestTotal ? "no-cost" : "interest-emi",
        note: `No-cost total ${noCostTotal} vs interest EMI total ${interestTotal.toFixed(2)}.`,
      };
    }
    case "shop-bnpl-total-cost-calculator": {
      const P = pos(input.principal, "Purchase");
      if (typeof P !== "number") return { ok: false, error: P.error };
      const fees = nonNeg(input.fees ?? input.processingFee ?? 0, "Fees");
      if (typeof fees !== "number") return { ok: false, error: fees.error };
      const n = pos(input.months ?? 4, "Installments");
      if (typeof n !== "number") return { ok: false, error: n.error };
      const total = P + fees;
      return { ok: true, total, emi: total / n, note: "BNPL total = price + fees; equal splits." };
    }
    case "shop-installment-plan-comparison-calculator": {
      const aM = pos(input.planAMonthly, "Plan A monthly");
      if (typeof aM !== "number") return { ok: false, error: aM.error };
      const aN = pos(input.planAMonths ?? input.months ?? 6, "Plan A months");
      if (typeof aN !== "number") return { ok: false, error: aN.error };
      const bM = pos(input.planBMonthly, "Plan B monthly");
      if (typeof bM !== "number") return { ok: false, error: bM.error };
      const bN = pos(input.planBMonths ?? 12, "Plan B months");
      if (typeof bN !== "number") return { ok: false, error: bN.error };
      const totA = aM * aN;
      const totB = bM * bN;
      return {
        ok: true,
        total: Math.min(totA, totB),
        cheaper: totA <= totB ? "A" : "B",
        note: `Plan A ${totA} vs Plan B ${totB}.`,
      };
    }
    case "shop-down-payment-calculator": {
      const P = pos(input.principal, "Price");
      if (typeof P !== "number") return { ok: false, error: P.error };
      let down: number;
      if (input.downAmt !== undefined && input.downAmt >= 0) down = input.downAmt;
      else {
        const pct = nonNeg(input.downPct ?? 10, "Down %");
        if (typeof pct !== "number") return { ok: false, error: pct.error };
        down = P * (pct / 100);
      }
      return { ok: true, down, financed: P - down, note: "Financed = price − down payment." };
    }
    case "shop-interest-on-deferred-payment-calculator": {
      const P = pos(input.principal, "Amount");
      if (typeof P !== "number") return { ok: false, error: P.error };
      const rate = nonNeg(input.annualRatePct ?? 0, "APR %");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      const n = pos(input.months, "Months deferred");
      if (typeof n !== "number") return { ok: false, error: n.error };
      const interest = P * (rate / 100) * (n / 12);
      return { ok: true, interest, total: P + interest, note: "Simple interest for deferred period." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
