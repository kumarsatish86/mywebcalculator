"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { SHOP_URL } from "@/lib/calculators/shopHelpers";
import {
  computeShopMargin,
  type ShopMarginInput,
  type ShopMarginResult,
  type ShopMarginSlug,
} from "@/lib/calculators/shopMargin";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode =
  | "grossMargin"
  | "netProfit"
  | "profitMarginPct"
  | "breakEvenUnits"
  | "breakEvenRevenue"
  | "markupFromCost"
  | "targetMarginPrice"
  | "discountedMargin";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const EMPTY = { aDefault: "", bDefault: "", cDefault: "" };

const DISCLAIMER =
  "Daily-life shopping estimate only — offers, taxes, FX, and fees vary. Verify current terms before buying.";

const CONFIG: Record<ShopMarginSlug, Config> = {
  "shop-gross-margin-calculator": {
    title: "Gross margin",
    description: `Gross margin = revenue − COGS. ${DISCLAIMER}`,
    mode: "grossMargin",
    ...EMPTY, aDefault: "100", bDefault: "40",
  },
  "shop-net-profit-calculator": {
    title: "Net profit",
    description: `Net = revenue − COGS − expenses. ${DISCLAIMER}`,
    mode: "netProfit",
    ...EMPTY, aDefault: "5000", bDefault: "2000", cDefault: "1500",
  },
  "shop-profit-margin-percent-calculator": {
    title: "Profit margin %",
    description: `Profit margin % = profit ÷ revenue. ${DISCLAIMER}`,
    mode: "profitMarginPct",
    ...EMPTY, aDefault: "250", bDefault: "100",
  },
  "shop-break-even-units-calculator": {
    title: "Break-even units",
    description: `Units to cover fixed costs. ${DISCLAIMER}`,
    mode: "breakEvenUnits",
    ...EMPTY, aDefault: "5000", bDefault: "50", cDefault: "30",
  },
  "shop-break-even-revenue-calculator": {
    title: "Break-even revenue",
    description: `Revenue to cover fixed costs at CM%. ${DISCLAIMER}`,
    mode: "breakEvenRevenue",
    ...EMPTY, aDefault: "10000", bDefault: "40",
  },
  "shop-markup-from-cost-calculator": {
    title: "Markup from cost",
    description: `Markup % = (price − cost) ÷ cost. ${DISCLAIMER}`,
    mode: "markupFromCost",
    ...EMPTY, aDefault: "20", bDefault: "35",
  },
  "shop-target-margin-price-calculator": {
    title: "Target margin price",
    description: `Price = cost ÷ (1 − margin%). ${DISCLAIMER}`,
    mode: "targetMarginPrice",
    ...EMPTY, aDefault: "25", bDefault: "35",
  },
  "shop-discounted-margin-calculator": {
    title: "Discounted margin",
    description: `Margin after list-price discount. ${DISCLAIMER}`,
    mode: "discountedMargin",
    ...EMPTY, aDefault: "100", bDefault: "55", cDefault: "20",
  },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function optNonNeg(raw: string, label: string): number | undefined | { error: string } {
  if (raw.trim() === "") return undefined;
  const p = parseNonNegative(raw, label);
  if (!p.ok) return { error: p.error };
  return p.value;
}

function formatResult(res: ShopMarginResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.margin !== undefined) rows.push({ label: "Margin / profit", value: num(res.margin, 2) });
  if (res.pct !== undefined) rows.push({ label: "Margin %", value: num(res.pct, 1) });
  if (res.units !== undefined) rows.push({ label: "Break-even units", value: num(res.units, 1) });
  if (res.revenue !== undefined) rows.push({ label: "Break-even revenue", value: num(res.revenue, 2) });
  if (res.price !== undefined) rows.push({ label: "Price", value: num(res.price, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.units !== undefined ? num(res.units, 1)
    : res.revenue !== undefined ? num(res.revenue, 2)
    : res.price !== undefined ? num(res.price, 2)
    : res.pct !== undefined && res.margin === undefined ? num(res.pct, 1)
    : res.margin !== undefined ? num(res.margin, 2)
    : "—";
  const primaryLabel =
    res.units !== undefined ? "Break-even units"
    : res.revenue !== undefined ? "Break-even revenue"
    : res.price !== undefined ? "Target price"
    : res.pct !== undefined ? "Margin %"
    : "Margin";
  return { primary, primaryLabel, rows };
}

export function ShopMarginCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ShopMarginSlug;
  const config = CONFIG[key] ?? CONFIG["shop-gross-margin-calculator"];
  const [a, setA] = useState(useLoanInitialInput(SHOP_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(SHOP_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(SHOP_URL.C, config.cDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "grossMargin":
      case "profitMarginPct":
      case "markupFromCost":
      case "breakEvenRevenue":
      case "targetMarginPrice":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b);
        break;
      case "netProfit":
      case "breakEvenUnits":
      case "discountedMargin":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.C, c);
        break;
    }
    return out;
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    const input: ShopMarginInput = {};
    switch (config.mode) {
      case "grossMargin": {
        const rev = parsePositive(a, "Revenue");
        if (!rev.ok) return { error: rev.error };
        input.revenue = rev.value;
        const cogs = optNonNeg(b, "COGS");
        if (cogs && typeof cogs === "object") return { error: cogs.error };
        if (typeof cogs === "number") input.cogs = cogs;
        break;
      }
      case "netProfit": {
        const rev = parsePositive(a, "Revenue");
        if (!rev.ok) return { error: rev.error };
        input.revenue = rev.value;
        const cogs = optNonNeg(b, "COGS");
        if (cogs && typeof cogs === "object") return { error: cogs.error };
        if (typeof cogs === "number") input.cogs = cogs;
        const exp = optNonNeg(c, "Expenses");
        if (exp && typeof exp === "object") return { error: exp.error };
        if (typeof exp === "number") input.expenses = exp;
        break;
      }
      case "profitMarginPct": {
        const rev = parsePositive(a, "Revenue");
        if (!rev.ok) return { error: rev.error };
        input.revenue = rev.value;
        const cogs = optNonNeg(b, "COGS");
        if (cogs && typeof cogs === "object") return { error: cogs.error };
        if (typeof cogs === "number") input.cogs = cogs;
        break;
      }
      case "breakEvenUnits": {
        const fixed = parsePositive(a, "Fixed costs");
        if (!fixed.ok) return { error: fixed.error };
        input.fixedCosts = fixed.value;
        const price = parsePositive(b, "Price");
        if (!price.ok) return { error: price.error };
        input.price = price.value;
        const cost = parsePositive(c, "Cost");
        if (!cost.ok) return { error: cost.error };
        input.cost = cost.value;
        break;
      }
      case "breakEvenRevenue": {
        const fixed = parsePositive(a, "Fixed costs");
        if (!fixed.ok) return { error: fixed.error };
        input.fixedCosts = fixed.value;
        const m = parsePositive(b, "Contribution margin %");
        if (!m.ok) return { error: m.error };
        input.marginPct = m.value;
        break;
      }
      case "markupFromCost": {
        const cost = parsePositive(a, "Cost");
        if (!cost.ok) return { error: cost.error };
        input.cost = cost.value;
        const price = parsePositive(b, "Price");
        if (!price.ok) return { error: price.error };
        input.price = price.value;
        break;
      }
      case "targetMarginPrice": {
        const cost = parsePositive(a, "Cost");
        if (!cost.ok) return { error: cost.error };
        input.cost = cost.value;
        const m = parsePositive(b, "Target margin %");
        if (!m.ok) return { error: m.error };
        input.marginPct = m.value;
        break;
      }
      case "discountedMargin": {
        const price = parsePositive(a, "List price");
        if (!price.ok) return { error: price.error };
        input.price = price.value;
        const cost = parsePositive(b, "Cost");
        if (!cost.ok) return { error: cost.error };
        input.cost = cost.value;
        const disc = optNonNeg(c, "Discount %");
        if (disc && typeof disc === "object") return { error: disc.error };
        if (typeof disc === "number") input.discountPct = disc;
        break;
      }
    }
    return formatResult(computeShopMargin(key in CONFIG ? key : "shop-gross-margin-calculator", input), num);
  }, [a, b, c, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {(config.mode === "grossMargin" || config.mode === "profitMarginPct") ? (
            <>
              <div><FieldLabel htmlFor="sm-a">Revenue</FieldLabel><FieldInput id="sm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sm-b">COGS</FieldLabel><FieldInput id="sm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "netProfit" ? (
            <>
              <div><FieldLabel htmlFor="sm-a">Revenue</FieldLabel><FieldInput id="sm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sm-b">COGS</FieldLabel><FieldInput id="sm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sm-c">Expenses</FieldLabel><FieldInput id="sm-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "breakEvenUnits" ? (
            <>
              <div><FieldLabel htmlFor="sm-a">Fixed costs</FieldLabel><FieldInput id="sm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sm-b">Price</FieldLabel><FieldInput id="sm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sm-c">Cost per unit</FieldLabel><FieldInput id="sm-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "breakEvenRevenue" ? (
            <>
              <div><FieldLabel htmlFor="sm-a">Fixed costs</FieldLabel><FieldInput id="sm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sm-b">Contribution margin %</FieldLabel><FieldInput id="sm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "markupFromCost" ? (
            <>
              <div><FieldLabel htmlFor="sm-a">Cost</FieldLabel><FieldInput id="sm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sm-b">Price</FieldLabel><FieldInput id="sm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "targetMarginPrice" ? (
            <>
              <div><FieldLabel htmlFor="sm-a">Cost</FieldLabel><FieldInput id="sm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sm-b">Target margin %</FieldLabel><FieldInput id="sm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "discountedMargin" ? (
            <>
              <div><FieldLabel htmlFor="sm-a">List price</FieldLabel><FieldInput id="sm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sm-b">Cost</FieldLabel><FieldInput id="sm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sm-c">Discount %</FieldLabel><FieldInput id="sm-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          {"error" in result ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--muted)]">{result.primaryLabel}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{result.primary}</p>
              </div>
              <div className="space-y-2 text-sm">
                {result.rows.map((row) => (<Row key={row.label} label={row.label} value={row.value} />))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
