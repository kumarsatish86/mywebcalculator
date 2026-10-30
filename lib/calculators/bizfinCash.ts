/** Business finance — cash flow & liquidity teaching estimates. */
import { pos, nonNeg, finite } from "./bizfinHelpers";

export type BizfinCashSlug =
  | "bizfin-cash-flow-calculator"
  | "bizfin-free-cash-flow-calculator"
  | "bizfin-operating-cash-flow-calculator"
  | "bizfin-working-capital-calculator"
  | "bizfin-cash-conversion-cycle-calculator"
  | "bizfin-liquidity-ratio-calculator"
  | "bizfin-current-ratio-calculator"
  | "bizfin-quick-ratio-calculator";
export const BIZFIN_CASH_SLUGS: BizfinCashSlug[] = [
  "bizfin-cash-flow-calculator",
  "bizfin-free-cash-flow-calculator",
  "bizfin-operating-cash-flow-calculator",
  "bizfin-working-capital-calculator",
  "bizfin-cash-conversion-cycle-calculator",
  "bizfin-liquidity-ratio-calculator",
  "bizfin-current-ratio-calculator",
  "bizfin-quick-ratio-calculator",
];


export type BizfinCashInput = {
  inflows?: number;
  outflows?: number;
  ocf?: number;
  capex?: number;
  netIncome?: number;
  depreciation?: number;
  wcChange?: number;
  currentAssets?: number;
  currentLiabilities?: number;
  inventory?: number;
  dio?: number;
  dso?: number;
  dpo?: number;
};

export type BizfinCashResult =
  | { ok: false; error: string }
  | {
      ok: true;
      value?: number;
      pct?: number;
      secondary?: number;
      tertiary?: number;
      note: string;
    };

export function computeBizfinCash(slug: BizfinCashSlug, input: BizfinCashInput): BizfinCashResult {
  switch (slug) {
    case "bizfin-cash-flow-calculator": {
      const inn = finite(input.inflows, "Cash inflows");
      if (typeof inn !== "number") return { ok: false, error: inn.error };
      const out = nonNeg(input.outflows ?? 0, "Cash outflows");
      if (typeof out !== "number") return { ok: false, error: out.error };
      return { ok: true, value: inn - out, note: "Net cash flow = inflows − outflows." };
    }
    case "bizfin-free-cash-flow-calculator": {
      const ocf = finite(input.ocf ?? input.netIncome, "Operating cash flow");
      if (typeof ocf !== "number") return { ok: false, error: ocf.error };
      const capex = nonNeg(input.capex ?? 0, "CapEx");
      if (typeof capex !== "number") return { ok: false, error: capex.error };
      return { ok: true, value: ocf - capex, note: "FCF ≈ OCF − CapEx." };
    }
    case "bizfin-operating-cash-flow-calculator": {
      const ni = finite(input.netIncome, "Net income");
      if (typeof ni !== "number") return { ok: false, error: ni.error };
      const da = nonNeg(input.depreciation ?? 0, "Depreciation / non-cash");
      if (typeof da !== "number") return { ok: false, error: da.error };
      const wc = finite(input.wcChange ?? 0, "Δ Working capital");
      if (typeof wc !== "number") return { ok: false, error: wc.error };
      return { ok: true, value: ni + da - wc, note: "OCF ≈ NI + D&A − ΔNWC (teaching)." };
    }
    case "bizfin-working-capital-calculator": {
      const ca = nonNeg(input.currentAssets, "Current assets");
      if (typeof ca !== "number") return { ok: false, error: ca.error };
      const cl = nonNeg(input.currentLiabilities, "Current liabilities");
      if (typeof cl !== "number") return { ok: false, error: cl.error };
      return { ok: true, value: ca - cl, note: "Working capital = current assets − current liabilities." };
    }
    case "bizfin-cash-conversion-cycle-calculator": {
      const dio = nonNeg(input.dio, "Days inventory outstanding");
      if (typeof dio !== "number") return { ok: false, error: dio.error };
      const dso = nonNeg(input.dso, "Days sales outstanding");
      if (typeof dso !== "number") return { ok: false, error: dso.error };
      const dpo = nonNeg(input.dpo ?? 0, "Days payable outstanding");
      if (typeof dpo !== "number") return { ok: false, error: dpo.error };
      return { ok: true, value: dio + dso - dpo, note: "CCC = DIO + DSO − DPO." };
    }
    case "bizfin-liquidity-ratio-calculator":
    case "bizfin-current-ratio-calculator": {
      const ca = pos(input.currentAssets, "Current assets");
      if (typeof ca !== "number") return { ok: false, error: ca.error };
      const cl = pos(input.currentLiabilities, "Current liabilities");
      if (typeof cl !== "number") return { ok: false, error: cl.error };
      return { ok: true, value: ca / cl, note: "Current / liquidity ratio = CA ÷ CL." };
    }
    case "bizfin-quick-ratio-calculator": {
      const ca = pos(input.currentAssets, "Current assets");
      if (typeof ca !== "number") return { ok: false, error: ca.error };
      const inv = nonNeg(input.inventory ?? 0, "Inventory");
      if (typeof inv !== "number") return { ok: false, error: inv.error };
      const cl = pos(input.currentLiabilities, "Current liabilities");
      if (typeof cl !== "number") return { ok: false, error: cl.error };
      return { ok: true, value: (ca - inv) / cl, note: "Quick ratio = (CA − inventory) ÷ CL." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
