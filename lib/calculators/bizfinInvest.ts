/** Business finance — investment & return teaching estimates. */
import { pos, nonNeg, finite } from "./bizfinHelpers";

export type BizfinInvestSlug =
  | "bizfin-roi-calculator"
  | "bizfin-annualized-roi-calculator"
  | "bizfin-irr-calculator"
  | "bizfin-npv-calculator"
  | "bizfin-payback-period-calculator"
  | "bizfin-discounted-payback-period-calculator"
  | "bizfin-capital-gain-calculator"
  | "bizfin-business-valuation-calculator"
  | "bizfin-equity-value-calculator"
  | "bizfin-enterprise-value-calculator";
export const BIZFIN_INVEST_SLUGS: BizfinInvestSlug[] = [
  "bizfin-roi-calculator",
  "bizfin-annualized-roi-calculator",
  "bizfin-irr-calculator",
  "bizfin-npv-calculator",
  "bizfin-payback-period-calculator",
  "bizfin-discounted-payback-period-calculator",
  "bizfin-capital-gain-calculator",
  "bizfin-business-valuation-calculator",
  "bizfin-equity-value-calculator",
  "bizfin-enterprise-value-calculator",
];


export type BizfinInvestInput = {
  cost?: number;
  gain?: number;
  years?: number;
  ratePct?: number;
  cf0?: number;
  cf1?: number;
  cf2?: number;
  cf3?: number;
  investment?: number;
  annualCf?: number;
  buy?: number;
  sell?: number;
  ebitda?: number;
  multiple?: number;
  equityValue?: number;
  netDebt?: number;
  cash?: number;
  debt?: number;
  marketCap?: number;
};

export type BizfinInvestResult =
  | { ok: false; error: string }
  | {
      ok: true;
      value?: number;
      pct?: number;
      secondary?: number;
      tertiary?: number;
      note: string;
    };

function npvOf(rate: number, cfs: number[]): number {
  return cfs.reduce((sum, cf, t) => sum + cf / Math.pow(1 + rate, t), 0);
}

function irrSimple(cfs: number[]): number | null {
  let r = 0.1;
  for (let i = 0; i < 40; i++) {
    let f = 0;
    let df = 0;
    for (let t = 0; t < cfs.length; t++) {
      const den = Math.pow(1 + r, t);
      f += cfs[t] / den;
      if (t > 0) df -= (t * cfs[t]) / Math.pow(1 + r, t + 1);
    }
    if (Math.abs(df) < 1e-12) break;
    const next = r - f / df;
    if (!Number.isFinite(next)) break;
    if (Math.abs(next - r) < 1e-8) return next;
    r = next;
  }
  return Number.isFinite(r) ? r : null;
}

export function computeBizfinInvest(slug: BizfinInvestSlug, input: BizfinInvestInput): BizfinInvestResult {
  switch (slug) {
    case "bizfin-roi-calculator": {
      const cost = pos(input.cost ?? input.investment, "Cost / investment");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const gain = finite(input.gain ?? input.sell, "Gain / final value");
      if (typeof gain !== "number") return { ok: false, error: gain.error };
      const roi = (gain - cost) / cost;
      return { ok: true, value: gain - cost, pct: roi * 100, note: "ROI = (gain − cost) ÷ cost." };
    }
    case "bizfin-annualized-roi-calculator": {
      const cost = pos(input.cost ?? input.investment, "Cost");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const gain = pos(input.gain ?? input.sell, "Final value");
      if (typeof gain !== "number") return { ok: false, error: gain.error };
      const years = pos(input.years, "Years");
      if (typeof years !== "number") return { ok: false, error: years.error };
      const ann = Math.pow(gain / cost, 1 / years) - 1;
      return { ok: true, pct: ann * 100, note: "Annualized ROI = (final÷cost)^(1/years) − 1." };
    }
    case "bizfin-irr-calculator": {
      const cf0 = finite(input.cf0 ?? (input.investment !== undefined ? -Math.abs(input.investment) : undefined), "CF0");
      if (typeof cf0 !== "number") return { ok: false, error: cf0.error };
      const cf1 = finite(input.cf1 ?? input.annualCf, "CF1");
      if (typeof cf1 !== "number") return { ok: false, error: cf1.error };
      const cfs = [cf0, cf1];
      if (input.cf2 !== undefined && Number.isFinite(input.cf2)) cfs.push(input.cf2);
      if (input.cf3 !== undefined && Number.isFinite(input.cf3)) cfs.push(input.cf3);
      const irr = irrSimple(cfs);
      if (irr === null) return { ok: false, error: "Could not converge on IRR." };
      return { ok: true, pct: irr * 100, note: "IRR via Newton on discrete annual cash flows." };
    }
    case "bizfin-npv-calculator": {
      const ratePct = nonNeg(input.ratePct ?? 0, "Discount rate %");
      if (typeof ratePct !== "number") return { ok: false, error: ratePct.error };
      const cf0 = finite(input.cf0 ?? (input.investment !== undefined ? -Math.abs(input.investment) : undefined), "CF0");
      if (typeof cf0 !== "number") return { ok: false, error: cf0.error };
      const cf1 = finite(input.cf1 ?? input.annualCf, "CF1");
      if (typeof cf1 !== "number") return { ok: false, error: cf1.error };
      const cfs = [cf0, cf1];
      if (input.cf2 !== undefined && Number.isFinite(input.cf2)) cfs.push(input.cf2);
      if (input.cf3 !== undefined && Number.isFinite(input.cf3)) cfs.push(input.cf3);
      return { ok: true, value: npvOf(ratePct / 100, cfs), note: "NPV = Σ CF_t / (1+r)^t." };
    }
    case "bizfin-payback-period-calculator": {
      const inv = pos(input.investment ?? input.cost, "Investment");
      if (typeof inv !== "number") return { ok: false, error: inv.error };
      const annual = pos(input.annualCf ?? input.cf1, "Annual cash flow");
      if (typeof annual !== "number") return { ok: false, error: annual.error };
      return { ok: true, value: inv / annual, note: "Simple payback (years) = investment ÷ annual CF." };
    }
    case "bizfin-discounted-payback-period-calculator": {
      const inv = pos(input.investment ?? input.cost, "Investment");
      if (typeof inv !== "number") return { ok: false, error: inv.error };
      const annual = pos(input.annualCf ?? input.cf1, "Annual cash flow");
      if (typeof annual !== "number") return { ok: false, error: annual.error };
      const ratePct = nonNeg(input.ratePct ?? 0, "Discount rate %");
      if (typeof ratePct !== "number") return { ok: false, error: ratePct.error };
      const r = ratePct / 100;
      let cum = 0;
      for (let t = 1; t <= 100; t++) {
        const pv = annual / Math.pow(1 + r, t);
        const prev = cum;
        cum += pv;
        if (cum >= inv) {
          const frac = (inv - prev) / pv;
          return { ok: true, value: t - 1 + frac, note: "Discounted payback interpolates PV recovery." };
        }
      }
      return { ok: false, error: "Payback exceeds 100 years at this rate." };
    }
    case "bizfin-capital-gain-calculator": {
      const buy = pos(input.buy ?? input.cost, "Buy / cost basis");
      if (typeof buy !== "number") return { ok: false, error: buy.error };
      const sell = finite(input.sell ?? input.gain, "Sell price");
      if (typeof sell !== "number") return { ok: false, error: sell.error };
      const gain = sell - buy;
      return { ok: true, value: gain, pct: (gain / buy) * 100, note: "Capital gain = sell − buy." };
    }
    case "bizfin-business-valuation-calculator": {
      const ebitda = pos(input.ebitda, "EBITDA");
      if (typeof ebitda !== "number") return { ok: false, error: ebitda.error };
      const multiple = pos(input.multiple, "Valuation multiple");
      if (typeof multiple !== "number") return { ok: false, error: multiple.error };
      return { ok: true, value: ebitda * multiple, note: "Teaching EV ≈ EBITDA × multiple." };
    }
    case "bizfin-equity-value-calculator": {
      const ev = pos(input.equityValue ?? input.marketCap, "Enterprise value");
      if (typeof ev !== "number") return { ok: false, error: ev.error };
      const netDebt = finite(input.netDebt ?? (input.debt ?? 0) - (input.cash ?? 0), "Net debt");
      if (typeof netDebt !== "number") return { ok: false, error: netDebt.error };
      return { ok: true, value: ev - netDebt, secondary: ev, note: "Equity value ≈ EV − net debt." };
    }
    case "bizfin-enterprise-value-calculator": {
      const equity = pos(input.equityValue ?? input.marketCap, "Equity / market cap");
      if (typeof equity !== "number") return { ok: false, error: equity.error };
      const debt = nonNeg(input.debt ?? 0, "Debt");
      if (typeof debt !== "number") return { ok: false, error: debt.error };
      const cash = nonNeg(input.cash ?? 0, "Cash");
      if (typeof cash !== "number") return { ok: false, error: cash.error };
      return { ok: true, value: equity + debt - cash, note: "EV = equity + debt − cash." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
