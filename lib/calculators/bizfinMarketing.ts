/** Business finance — marketing & sales performance teaching estimates. */
import { pos, nonNeg, finite } from "./bizfinHelpers";

export type BizfinMarketingSlug =
  | "bizfin-conversion-rate-calculator"
  | "bizfin-cpl-calculator"
  | "bizfin-cpa-calculator"
  | "bizfin-cpm-calculator"
  | "bizfin-cpc-calculator"
  | "bizfin-sales-growth-calculator"
  | "bizfin-revenue-growth-calculator";
export const BIZFIN_MARKETING_SLUGS: BizfinMarketingSlug[] = [
  "bizfin-conversion-rate-calculator",
  "bizfin-cpl-calculator",
  "bizfin-cpa-calculator",
  "bizfin-cpm-calculator",
  "bizfin-cpc-calculator",
  "bizfin-sales-growth-calculator",
  "bizfin-revenue-growth-calculator",
];


export type BizfinMarketingInput = {
  conversions?: number;
  visitors?: number;
  spend?: number;
  leads?: number;
  acquisitions?: number;
  impressions?: number;
  clicks?: number;
  startValue?: number;
  endValue?: number;
};

export type BizfinMarketingResult =
  | { ok: false; error: string }
  | {
      ok: true;
      value?: number;
      pct?: number;
      secondary?: number;
      tertiary?: number;
      note: string;
    };

export function computeBizfinMarketing(slug: BizfinMarketingSlug, input: BizfinMarketingInput): BizfinMarketingResult {
  switch (slug) {
    case "bizfin-conversion-rate-calculator": {
      const conv = nonNeg(input.conversions, "Conversions");
      if (typeof conv !== "number") return { ok: false, error: conv.error };
      const visitors = pos(input.visitors ?? input.clicks, "Visitors / clicks");
      if (typeof visitors !== "number") return { ok: false, error: visitors.error };
      return { ok: true, pct: (conv / visitors) * 100, value: conv / visitors, note: "Conversion rate = conversions ÷ visitors." };
    }
    case "bizfin-cpl-calculator": {
      const spend = pos(input.spend, "Spend");
      if (typeof spend !== "number") return { ok: false, error: spend.error };
      const leads = pos(input.leads, "Leads");
      if (typeof leads !== "number") return { ok: false, error: leads.error };
      return { ok: true, value: spend / leads, note: "CPL = spend ÷ leads." };
    }
    case "bizfin-cpa-calculator": {
      const spend = pos(input.spend, "Spend");
      if (typeof spend !== "number") return { ok: false, error: spend.error };
      const acq = pos(input.acquisitions ?? input.conversions, "Acquisitions");
      if (typeof acq !== "number") return { ok: false, error: acq.error };
      return { ok: true, value: spend / acq, note: "CPA = spend ÷ acquisitions." };
    }
    case "bizfin-cpm-calculator": {
      const spend = pos(input.spend, "Spend");
      if (typeof spend !== "number") return { ok: false, error: spend.error };
      const impressions = pos(input.impressions, "Impressions");
      if (typeof impressions !== "number") return { ok: false, error: impressions.error };
      return { ok: true, value: (spend / impressions) * 1000, note: "CPM = (spend ÷ impressions) × 1000." };
    }
    case "bizfin-cpc-calculator": {
      const spend = pos(input.spend, "Spend");
      if (typeof spend !== "number") return { ok: false, error: spend.error };
      const clicks = pos(input.clicks, "Clicks");
      if (typeof clicks !== "number") return { ok: false, error: clicks.error };
      return { ok: true, value: spend / clicks, note: "CPC = spend ÷ clicks." };
    }
    case "bizfin-sales-growth-calculator":
    case "bizfin-revenue-growth-calculator": {
      const start = finite(input.startValue, "Starting value");
      if (typeof start !== "number") return { ok: false, error: start.error };
      if (start === 0) return { ok: false, error: "Starting value cannot be zero." };
      const end = finite(input.endValue, "Ending value");
      if (typeof end !== "number") return { ok: false, error: end.error };
      return { ok: true, pct: ((end - start) / Math.abs(start)) * 100, value: end - start, note: "Growth % = (end − start) ÷ |start|." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
