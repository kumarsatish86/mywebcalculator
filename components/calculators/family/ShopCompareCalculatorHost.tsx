"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { SHOP_URL } from "@/lib/calculators/shopHelpers";
import {
  computeShopCompare,
  type ShopCompareInput,
  type ShopCompareResult,
  type ShopCompareSlug,
} from "@/lib/calculators/shopCompare";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "unitCompare" | "subVsOne" | "cheapest" | "vfm" | "inflation";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  dDefault: string;
  nDefault: string;
};

const EMPTY = { aDefault: "", bDefault: "", cDefault: "", dDefault: "", nDefault: "" };

const DISCLAIMER =
  "Daily-life shopping estimate only — offers, taxes, FX, and fees vary. Verify current terms before buying.";

const CONFIG: Record<ShopCompareSlug, Config> = {
  "shop-unit-price-comparison-calculator": {
    title: "Unit price comparison",
    description: `Compare per-unit cost of two options. ${DISCLAIMER}`,
    mode: "unitCompare",
    ...EMPTY, aDefault: "10", bDefault: "2", cDefault: "12", dDefault: "3",
  },
  "shop-pack-size-comparison-calculator": {
    title: "Pack size comparison",
    description: `Which pack has lower unit price. ${DISCLAIMER}`,
    mode: "unitCompare",
    ...EMPTY, aDefault: "8.99", bDefault: "500", cDefault: "14.99", dDefault: "1000",
  },
  "shop-bulk-vs-retail-comparison-calculator": {
    title: "Bulk vs retail",
    description: `Bulk vs single-unit pricing. ${DISCLAIMER}`,
    mode: "unitCompare",
    ...EMPTY, aDefault: "24", bDefault: "12", cDefault: "2.50", dDefault: "1",
  },
  "shop-subscription-vs-one-time-calculator": {
    title: "Subscription vs one-time",
    description: `Cash comparison over N months. ${DISCLAIMER}`,
    mode: "subVsOne",
    ...EMPTY, aDefault: "9.99", nDefault: "12", bDefault: "99",
  },
  "shop-cheapest-option-calculator": {
    title: "Cheapest option",
    description: `Pick lowest of up to three prices. ${DISCLAIMER}`,
    mode: "cheapest",
    ...EMPTY, aDefault: "45", bDefault: "42", cDefault: "48",
  },
  "shop-value-for-money-calculator": {
    title: "Value for money",
    description: `VFM = quality score ÷ price. ${DISCLAIMER}`,
    mode: "vfm",
    ...EMPTY, aDefault: "60", bDefault: "8",
  },
  "shop-inflation-adjusted-comparison-calculator": {
    title: "Inflation-adjusted comparison",
    description: `Historical price adjusted for inflation. ${DISCLAIMER}`,
    mode: "inflation",
    ...EMPTY, aDefault: "50", bDefault: "3", nDefault: "5", cDefault: "65",
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

function formatResult(res: ShopCompareResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.perUnitA !== undefined) rows.push({ label: "Per unit A", value: num(res.perUnitA, 4) });
  if (res.perUnitB !== undefined) rows.push({ label: "Per unit B", value: num(res.perUnitB, 4) });
  if (res.cheaper !== undefined) rows.push({ label: "Cheaper", value: res.cheaper });
  if (res.totalSub !== undefined) rows.push({ label: "Subscription total", value: num(res.totalSub, 2) });
  if (res.totalOne !== undefined) rows.push({ label: "One-time", value: num(res.totalOne, 2) });
  if (res.vfm !== undefined) rows.push({ label: "VFM score", value: num(res.vfm, 4) });
  if (res.adjusted !== undefined) rows.push({ label: "Inflation-adjusted", value: num(res.adjusted, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.cheaper !== undefined && res.perUnitA === undefined ? res.cheaper
    : res.vfm !== undefined ? num(res.vfm, 4)
    : res.adjusted !== undefined ? num(res.adjusted, 2)
    : res.perUnitA !== undefined ? num(res.perUnitA, 4)
    : res.totalSub !== undefined ? num(res.totalSub, 2)
    : "—";
  const primaryLabel =
    res.vfm !== undefined ? "VFM score"
    : res.adjusted !== undefined ? "Adjusted price"
    : res.cheaper !== undefined ? "Winner"
    : "Per unit A";
  return { primary, primaryLabel, rows };
}

export function ShopCompareCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ShopCompareSlug;
  const config = CONFIG[key] ?? CONFIG["shop-unit-price-comparison-calculator"];
  const [a, setA] = useState(useLoanInitialInput(SHOP_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(SHOP_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(SHOP_URL.C, config.cDefault));
  const [d, setD] = useState(useLoanInitialInput(SHOP_URL.D, config.dDefault));
  const [n, setN] = useState(useLoanInitialInput(SHOP_URL.N, config.nDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "unitCompare":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.C, c); put(SHOP_URL.D, d);
        break;
      case "subVsOne":
        put(SHOP_URL.A, a); put(SHOP_URL.N, n); put(SHOP_URL.B, b);
        break;
      case "cheapest":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.C, c);
        break;
      case "vfm":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b);
        break;
      case "inflation":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.N, n); put(SHOP_URL.C, c);
        break;
    }
    return out;
  }, [a, b, c, config.mode, d, n]);

  useLoanUrlSync(shareParams, [a, b, c, d, n]);

  const result = useMemo(() => {
    const input: ShopCompareInput = {};
    switch (config.mode) {
      case "unitCompare": {
        const pA = parsePositive(a, "Price A");
        if (!pA.ok) return { error: pA.error };
        input.priceA = pA.value;
        const uA = parsePositive(b, "Units A");
        if (!uA.ok) return { error: uA.error };
        input.unitsA = uA.value;
        const pB = parsePositive(c, "Price B");
        if (!pB.ok) return { error: pB.error };
        input.priceB = pB.value;
        const uB = parsePositive(d, "Units B");
        if (!uB.ok) return { error: uB.error };
        input.unitsB = uB.value;
        break;
      }
      case "subVsOne": {
        const sub = parsePositive(a, "Subscription/month");
        if (!sub.ok) return { error: sub.error };
        input.subMonthly = sub.value;
        const months = parsePositive(n, "Months");
        if (!months.ok) return { error: months.error };
        input.months = months.value;
        const one = parsePositive(b, "One-time price");
        if (!one.ok) return { error: one.error };
        input.oneTime = one.value;
        break;
      }
      case "cheapest": {
        const optA = parsePositive(a, "Option A");
        if (!optA.ok) return { error: optA.error };
        input.priceA = optA.value;
        const optB = parsePositive(b, "Option B");
        if (!optB.ok) return { error: optB.error };
        input.priceB = optB.value;
        const optC = optNonNeg(c, "Option C");
        if (optC && typeof optC === "object") return { error: optC.error };
        if (typeof optC === "number") input.priceC = optC;
        break;
      }
      case "vfm": {
        const price = parsePositive(a, "Price");
        if (!price.ok) return { error: price.error };
        input.priceA = price.value;
        const score = parsePositive(b, "Quality score");
        if (!score.ok) return { error: score.error };
        input.qualityScore = score.value;
        break;
      }
      case "inflation": {
        const old = parsePositive(a, "Old price");
        if (!old.ok) return { error: old.error };
        input.oldPrice = old.value;
        const infl = optNonNeg(b, "Inflation %/yr");
        if (infl && typeof infl === "object") return { error: infl.error };
        if (typeof infl === "number") input.inflationPct = infl;
        const years = parsePositive(n, "Years");
        if (!years.ok) return { error: years.error };
        input.years = years.value;
        const now = optNonNeg(c, "Current price B");
        if (now && typeof now === "object") return { error: now.error };
        if (typeof now === "number") input.priceB = now;
        break;
      }
    }
    return formatResult(computeShopCompare(key in CONFIG ? key : "shop-unit-price-comparison-calculator", input), num);
  }, [a, b, c, config.mode, d, key, n]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "unitCompare" ? (
            <>
              <div><FieldLabel htmlFor="sc-a">Price A</FieldLabel><FieldInput id="sc-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sc-b">Units A</FieldLabel><FieldInput id="sc-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sc-c">Price B</FieldLabel><FieldInput id="sc-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sc-d">Units B</FieldLabel><FieldInput id="sc-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "subVsOne" ? (
            <>
              <div><FieldLabel htmlFor="sc-a">Subscription / month</FieldLabel><FieldInput id="sc-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sc-n">Months</FieldLabel><FieldInput id="sc-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sc-b">One-time price</FieldLabel><FieldInput id="sc-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "cheapest" ? (
            <>
              <div><FieldLabel htmlFor="sc-a">Option A</FieldLabel><FieldInput id="sc-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sc-b">Option B</FieldLabel><FieldInput id="sc-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sc-c">Option C (optional)</FieldLabel><FieldInput id="sc-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "vfm" ? (
            <>
              <div><FieldLabel htmlFor="sc-a">Price</FieldLabel><FieldInput id="sc-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sc-b">Quality score</FieldLabel><FieldInput id="sc-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "inflation" ? (
            <>
              <div><FieldLabel htmlFor="sc-a">Old price</FieldLabel><FieldInput id="sc-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sc-b">Inflation % / year</FieldLabel><FieldInput id="sc-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sc-n">Years</FieldLabel><FieldInput id="sc-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="sc-c">Current price B (optional)</FieldLabel><FieldInput id="sc-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
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
