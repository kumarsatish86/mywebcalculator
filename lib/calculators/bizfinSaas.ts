/** Business finance — startup & SaaS teaching estimates. */
import { pos, nonNeg, finite } from "./bizfinHelpers";

export type BizfinSaasSlug =
  | "bizfin-burn-rate-calculator"
  | "bizfin-runway-calculator"
  | "bizfin-cac-calculator"
  | "bizfin-ltv-calculator"
  | "bizfin-ltv-cac-ratio-calculator"
  | "bizfin-mrr-calculator"
  | "bizfin-arr-calculator"
  | "bizfin-churn-rate-calculator"
  | "bizfin-saas-growth-rate-calculator";
export const BIZFIN_SAAS_SLUGS: BizfinSaasSlug[] = [
  "bizfin-burn-rate-calculator",
  "bizfin-runway-calculator",
  "bizfin-cac-calculator",
  "bizfin-ltv-calculator",
  "bizfin-ltv-cac-ratio-calculator",
  "bizfin-mrr-calculator",
  "bizfin-arr-calculator",
  "bizfin-churn-rate-calculator",
  "bizfin-saas-growth-rate-calculator",
];


export type BizfinSaasInput = {
  expenses?: number;
  revenue?: number;
  cash?: number;
  burn?: number;
  salesMarketing?: number;
  newCustomers?: number;
  arpu?: number;
  grossMarginPct?: number;
  churnPct?: number;
  ltv?: number;
  cac?: number;
  customers?: number;
  mrr?: number;
  lostCustomers?: number;
  startCustomers?: number;
  startValue?: number;
  endValue?: number;
};

export type BizfinSaasResult =
  | { ok: false; error: string }
  | {
      ok: true;
      value?: number;
      pct?: number;
      secondary?: number;
      tertiary?: number;
      note: string;
    };

export function computeBizfinSaas(slug: BizfinSaasSlug, input: BizfinSaasInput): BizfinSaasResult {
  switch (slug) {
    case "bizfin-burn-rate-calculator": {
      const exp = pos(input.expenses, "Monthly expenses");
      if (typeof exp !== "number") return { ok: false, error: exp.error };
      const rev = nonNeg(input.revenue ?? 0, "Monthly revenue");
      if (typeof rev !== "number") return { ok: false, error: rev.error };
      return { ok: true, value: exp - rev, note: "Net burn = expenses − revenue (monthly)." };
    }
    case "bizfin-runway-calculator": {
      const cash = pos(input.cash, "Cash on hand");
      if (typeof cash !== "number") return { ok: false, error: cash.error };
      let burn = input.burn;
      if (burn === undefined) {
        const exp = pos(input.expenses, "Monthly expenses");
        if (typeof exp !== "number") return { ok: false, error: exp.error };
        const rev = nonNeg(input.revenue ?? 0, "Monthly revenue");
        if (typeof rev !== "number") return { ok: false, error: rev.error };
        burn = exp - rev;
      }
      if (burn <= 0) return { ok: true, value: Infinity, note: "Burn ≤ 0 — runway effectively unlimited at this burn." };
      return { ok: true, value: cash / burn, note: "Runway (months) = cash ÷ monthly burn." };
    }
    case "bizfin-cac-calculator": {
      const spend = pos(input.salesMarketing, "Sales & marketing spend");
      if (typeof spend !== "number") return { ok: false, error: spend.error };
      const n = pos(input.newCustomers, "New customers");
      if (typeof n !== "number") return { ok: false, error: n.error };
      return { ok: true, value: spend / n, note: "CAC = S&M spend ÷ new customers." };
    }
    case "bizfin-ltv-calculator": {
      const arpu = pos(input.arpu ?? input.mrr, "ARPU / monthly revenue per customer");
      if (typeof arpu !== "number") return { ok: false, error: arpu.error };
      const gm = nonNeg(input.grossMarginPct ?? 100, "Gross margin %");
      if (typeof gm !== "number") return { ok: false, error: gm.error };
      const churn = pos(input.churnPct, "Monthly churn %");
      if (typeof churn !== "number") return { ok: false, error: churn.error };
      if (churn >= 100) return { ok: false, error: "Churn % must be < 100." };
      const ltv = (arpu * (gm / 100)) / (churn / 100);
      return { ok: true, value: ltv, note: "LTV ≈ ARPU × GM% ÷ monthly churn%." };
    }
    case "bizfin-ltv-cac-ratio-calculator": {
      const ltv = pos(input.ltv, "LTV");
      if (typeof ltv !== "number") return { ok: false, error: ltv.error };
      const cac = pos(input.cac, "CAC");
      if (typeof cac !== "number") return { ok: false, error: cac.error };
      return { ok: true, value: ltv / cac, note: "LTV:CAC = LTV ÷ CAC." };
    }
    case "bizfin-mrr-calculator": {
      const customers = pos(input.customers ?? input.newCustomers, "Customers");
      if (typeof customers !== "number") return { ok: false, error: customers.error };
      const arpu = pos(input.arpu, "ARPU");
      if (typeof arpu !== "number") return { ok: false, error: arpu.error };
      return { ok: true, value: customers * arpu, note: "MRR = customers × ARPU." };
    }
    case "bizfin-arr-calculator": {
      if (input.mrr !== undefined) {
        const mrr = pos(input.mrr, "MRR");
        if (typeof mrr !== "number") return { ok: false, error: mrr.error };
        return { ok: true, value: mrr * 12, note: "ARR = MRR × 12." };
      }
      const customers = pos(input.customers, "Customers");
      if (typeof customers !== "number") return { ok: false, error: customers.error };
      const arpu = pos(input.arpu, "Monthly ARPU");
      if (typeof arpu !== "number") return { ok: false, error: arpu.error };
      return { ok: true, value: customers * arpu * 12, note: "ARR = customers × ARPU × 12." };
    }
    case "bizfin-churn-rate-calculator": {
      const lost = nonNeg(input.lostCustomers, "Lost customers");
      if (typeof lost !== "number") return { ok: false, error: lost.error };
      const start = pos(input.startCustomers ?? input.customers, "Starting customers");
      if (typeof start !== "number") return { ok: false, error: start.error };
      return { ok: true, pct: (lost / start) * 100, value: lost / start, note: "Churn = lost ÷ starting customers." };
    }
    case "bizfin-saas-growth-rate-calculator": {
      const start = finite(input.startValue ?? input.startCustomers, "Starting value");
      if (typeof start !== "number") return { ok: false, error: start.error };
      if (start === 0) return { ok: false, error: "Starting value cannot be zero." };
      const end = finite(input.endValue ?? input.mrr ?? input.customers, "Ending value");
      if (typeof end !== "number") return { ok: false, error: end.error };
      return { ok: true, pct: ((end - start) / Math.abs(start)) * 100, note: "Growth % = (end − start) ÷ |start|." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
