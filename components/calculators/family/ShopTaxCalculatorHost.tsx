"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { SHOP_URL } from "@/lib/calculators/shopHelpers";
import {
  computeShopTax,
  type ShopTaxInput,
  type ShopTaxResult,
  type ShopTaxSlug,
} from "@/lib/calculators/shopTax";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode =
  | "taxExclusive"
  | "taxInclusive"
  | "multiRate"
  | "invoice"
  | "lineDiscount"
  | "service"
  | "tipSplit"
  | "rounding";

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

const CONFIG: Record<ShopTaxSlug, Config> = {
  "shop-sales-tax-calculator": {
    title: "Sales tax",
    description: `Tax and total on exclusive amount. ${DISCLAIMER}`,
    mode: "taxExclusive",
    ...EMPTY, aDefault: "100", bDefault: "8.25",
  },
  "shop-gst-calculator": {
    title: "GST",
    description: `GST on pre-tax amount. ${DISCLAIMER}`,
    mode: "taxExclusive",
    ...EMPTY, aDefault: "1000", bDefault: "18",
  },
  "shop-vat-calculator": {
    title: "VAT",
    description: `VAT on exclusive price. ${DISCLAIMER}`,
    mode: "taxExclusive",
    ...EMPTY, aDefault: "500", bDefault: "20",
  },
  "shop-tax-inclusive-price-calculator": {
    title: "Tax-inclusive price",
    description: `Extract base and tax from inclusive total. ${DISCLAIMER}`,
    mode: "taxInclusive",
    ...EMPTY, aDefault: "118", bDefault: "18",
  },
  "shop-tax-exclusive-price-calculator": {
    title: "Tax-exclusive price",
    description: `Add tax to base amount. ${DISCLAIMER}`,
    mode: "taxExclusive",
    ...EMPTY, aDefault: "200", bDefault: "10",
  },
  "shop-reverse-tax-calculator": {
    title: "Reverse tax",
    description: `Base amount from tax-inclusive price. ${DISCLAIMER}`,
    mode: "taxInclusive",
    ...EMPTY, aDefault: "112", bDefault: "12",
  },
  "shop-multi-rate-tax-calculator": {
    title: "Multi-rate tax",
    description: `Sum taxes on two line amounts. ${DISCLAIMER}`,
    mode: "multiRate",
    ...EMPTY, aDefault: "100", bDefault: "5", cDefault: "50", dDefault: "18",
  },
  "shop-invoice-total-calculator": {
    title: "Invoice total",
    description: `Subtotal − discount + tax + service. ${DISCLAIMER}`,
    mode: "invoice",
    ...EMPTY, aDefault: "250", bDefault: "10", cDefault: "5", dDefault: "15",
  },
  "shop-line-item-discount-calculator": {
    title: "Line item discount",
    description: `Line total after discount %. ${DISCLAIMER}`,
    mode: "lineDiscount",
    ...EMPTY, aDefault: "45", bDefault: "20",
  },
  "shop-service-charge-calculator": {
    title: "Service charge",
    description: `Service fee added to bill. ${DISCLAIMER}`,
    mode: "service",
    ...EMPTY, aDefault: "80", bDefault: "10",
  },
  "shop-tip-calculator-bill-split": {
    title: "Tip & bill split",
    description: `Tip and equal split per person. ${DISCLAIMER}`,
    mode: "tipSplit",
    ...EMPTY, aDefault: "120", bDefault: "15", nDefault: "4",
  },
  "shop-rounding-adjustment-calculator": {
    title: "Rounding adjustment",
    description: `Round amount to nearest step. ${DISCLAIMER}`,
    mode: "rounding",
    ...EMPTY, aDefault: "47.83", nDefault: "1",
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

function formatResult(res: ShopTaxResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.base !== undefined) rows.push({ label: "Base", value: num(res.base, 2) });
  if (res.tax !== undefined) rows.push({ label: "Tax / tip / adj", value: num(res.tax, 2) });
  if (res.total !== undefined) rows.push({ label: "Total", value: num(res.total, 2) });
  if (res.perPerson !== undefined) rows.push({ label: "Per person", value: num(res.perPerson, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.perPerson !== undefined ? num(res.perPerson, 2)
    : res.total !== undefined ? num(res.total, 2)
    : res.base !== undefined ? num(res.base, 2)
    : "—";
  const primaryLabel =
    res.perPerson !== undefined ? "Per person"
    : res.total !== undefined ? "Total"
    : "Base amount";
  return { primary, primaryLabel, rows };
}

export function ShopTaxCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ShopTaxSlug;
  const config = CONFIG[key] ?? CONFIG["shop-sales-tax-calculator"];
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
      case "taxExclusive":
      case "taxInclusive":
      case "lineDiscount":
      case "service":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b);
        break;
      case "multiRate":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.C, c); put(SHOP_URL.D, d);
        break;
      case "invoice":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.C, c); put(SHOP_URL.D, d);
        break;
      case "tipSplit":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.N, n);
        break;
      case "rounding":
        put(SHOP_URL.A, a); put(SHOP_URL.N, n);
        break;
    }
    return out;
  }, [a, b, c, config.mode, d, n]);

  useLoanUrlSync(shareParams, [a, b, c, d, n]);

  const result = useMemo(() => {
    const input: ShopTaxInput = {};
    switch (config.mode) {
      case "taxExclusive":
      case "lineDiscount": {
        const amount = parsePositive(a, "Amount");
        if (!amount.ok) return { error: amount.error };
        input.amount = amount.value;
        const pct = optNonNeg(b, config.mode === "lineDiscount" ? "Discount %" : "Tax %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") {
          if (config.mode === "lineDiscount") input.discountPct = pct;
          else input.taxPct = pct;
        }
        break;
      }
      case "taxInclusive": {
        const amount = parsePositive(a, "Inclusive amount");
        if (!amount.ok) return { error: amount.error };
        input.amount = amount.value;
        const pct = optNonNeg(b, "Tax %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.taxPct = pct;
        break;
      }
      case "multiRate": {
        const a1 = parsePositive(a, "Amount 1");
        if (!a1.ok) return { error: a1.error };
        input.amount = a1.value;
        const p1 = optNonNeg(b, "Rate 1 %");
        if (p1 && typeof p1 === "object") return { error: p1.error };
        if (typeof p1 === "number") input.taxPct = p1;
        const a2 = optNonNeg(c, "Amount 2");
        if (a2 && typeof a2 === "object") return { error: a2.error };
        if (typeof a2 === "number") input.amount2 = a2;
        const p2 = optNonNeg(d, "Rate 2 %");
        if (p2 && typeof p2 === "object") return { error: p2.error };
        if (typeof p2 === "number") input.taxPct2 = p2;
        break;
      }
      case "invoice": {
        const base = parsePositive(a, "Subtotal");
        if (!base.ok) return { error: base.error };
        input.amount = base.value;
        const taxPct = optNonNeg(b, "Tax %");
        if (taxPct && typeof taxPct === "object") return { error: taxPct.error };
        if (typeof taxPct === "number") input.taxPct = taxPct;
        const svc = optNonNeg(c, "Service %");
        if (svc && typeof svc === "object") return { error: svc.error };
        if (typeof svc === "number") input.servicePct = svc;
        const disc = optNonNeg(d, "Discount %");
        if (disc && typeof disc === "object") return { error: disc.error };
        if (typeof disc === "number") input.discountPct = disc;
        break;
      }
      case "service": {
        const amount = parsePositive(a, "Bill");
        if (!amount.ok) return { error: amount.error };
        input.amount = amount.value;
        const pct = optNonNeg(b, "Service %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.servicePct = pct;
        break;
      }
      case "tipSplit": {
        const amount = parsePositive(a, "Bill");
        if (!amount.ok) return { error: amount.error };
        input.amount = amount.value;
        const tip = optNonNeg(b, "Tip %");
        if (tip && typeof tip === "object") return { error: tip.error };
        if (typeof tip === "number") input.tipPct = tip;
        const people = parsePositive(n, "People");
        if (!people.ok) return { error: people.error };
        input.people = people.value;
        break;
      }
      case "rounding": {
        const amount = parsePositive(a, "Amount");
        if (!amount.ok) return { error: amount.error };
        input.amount = amount.value;
        const step = parsePositive(n, "Round step");
        if (!step.ok) return { error: step.error };
        input.roundTo = step.value;
        break;
      }
    }
    return formatResult(computeShopTax(key in CONFIG ? key : "shop-sales-tax-calculator", input), num);
  }, [a, b, c, config.mode, d, key, n]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {(config.mode === "taxExclusive" || config.mode === "taxInclusive" || config.mode === "lineDiscount" || config.mode === "service") ? (
            <>
              <div><FieldLabel htmlFor="st-a">Amount</FieldLabel><FieldInput id="st-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="st-b">{config.mode === "lineDiscount" ? "Discount %" : config.mode === "service" ? "Service %" : "Tax %"}</FieldLabel><FieldInput id="st-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "multiRate" ? (
            <>
              <div><FieldLabel htmlFor="st-a">Amount 1</FieldLabel><FieldInput id="st-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="st-b">Rate 1 %</FieldLabel><FieldInput id="st-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="st-c">Amount 2</FieldLabel><FieldInput id="st-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="st-d">Rate 2 %</FieldLabel><FieldInput id="st-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "invoice" ? (
            <>
              <div><FieldLabel htmlFor="st-a">Subtotal</FieldLabel><FieldInput id="st-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="st-b">Tax %</FieldLabel><FieldInput id="st-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="st-c">Service %</FieldLabel><FieldInput id="st-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="st-d">Discount %</FieldLabel><FieldInput id="st-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "tipSplit" ? (
            <>
              <div><FieldLabel htmlFor="st-a">Bill amount</FieldLabel><FieldInput id="st-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="st-b">Tip %</FieldLabel><FieldInput id="st-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="st-n">People</FieldLabel><FieldInput id="st-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "rounding" ? (
            <>
              <div><FieldLabel htmlFor="st-a">Amount</FieldLabel><FieldInput id="st-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="st-n">Round to nearest</FieldLabel><FieldInput id="st-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
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
