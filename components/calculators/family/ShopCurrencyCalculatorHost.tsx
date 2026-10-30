"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { SHOP_URL } from "@/lib/calculators/shopHelpers";
import {
  computeShopCurrency,
  type ShopCurrencyInput,
  type ShopCurrencyResult,
  type ShopCurrencySlug,
} from "@/lib/calculators/shopCurrency";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "convert" | "duty" | "landed" | "taxRefund" | "intlShip";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  dDefault: string;
  tDefault: string;
};

const EMPTY = { aDefault: "", bDefault: "", cDefault: "", dDefault: "", tDefault: "" };

const DISCLAIMER =
  "Daily-life shopping estimate only — offers, taxes, FX, and fees vary. Verify current terms before buying.";

const CONFIG: Record<ShopCurrencySlug, Config> = {
  "shop-currency-converter-purchase-calculator": {
    title: "Currency converter",
    description: `Converted = amount × FX rate. ${DISCLAIMER}`,
    mode: "convert",
    ...EMPTY, aDefault: "100", bDefault: "83",
  },
  "shop-import-duty-estimator": {
    title: "Import duty",
    description: `Duty ≈ customs value × duty%. ${DISCLAIMER}`,
    mode: "duty",
    ...EMPTY, aDefault: "500", bDefault: "10",
  },
  "shop-landed-cost-calculator": {
    title: "Landed cost",
    description: `Product + duty + tax + shipping + fees. ${DISCLAIMER}`,
    mode: "landed",
    ...EMPTY, aDefault: "200", bDefault: "12", cDefault: "18", dDefault: "25", tDefault: "15",
  },
  "shop-tax-refund-tourist-calculator": {
    title: "Tourist tax refund",
    description: `VAT refund estimate (inclusive). ${DISCLAIMER}`,
    mode: "taxRefund",
    ...EMPTY, aDefault: "300", bDefault: "20",
  },
  "shop-international-shipping-total-calculator": {
    title: "International shipping total",
    description: `Product + ship + fees + duty. ${DISCLAIMER}`,
    mode: "intlShip",
    ...EMPTY, aDefault: "150", bDefault: "35", cDefault: "10", dDefault: "8",
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

function formatResult(res: ShopCurrencyResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.converted !== undefined) rows.push({ label: "Converted", value: num(res.converted, 2) });
  if (res.duty !== undefined) rows.push({ label: "Duty", value: num(res.duty, 2) });
  if (res.tax !== undefined) rows.push({ label: "Tax", value: num(res.tax, 2) });
  if (res.landed !== undefined) rows.push({ label: "Landed cost", value: num(res.landed, 2) });
  if (res.refund !== undefined) rows.push({ label: "Refund", value: num(res.refund, 2) });
  if (res.total !== undefined) rows.push({ label: "Total", value: num(res.total, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.landed !== undefined ? num(res.landed, 2)
    : res.total !== undefined ? num(res.total, 2)
    : res.converted !== undefined ? num(res.converted, 2)
    : res.refund !== undefined ? num(res.refund, 2)
    : res.duty !== undefined ? num(res.duty, 2)
    : "—";
  const primaryLabel =
    res.landed !== undefined ? "Landed cost"
    : res.refund !== undefined ? "Refund"
    : res.converted !== undefined ? "Converted"
    : "Total";
  return { primary, primaryLabel, rows };
}

export function ShopCurrencyCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ShopCurrencySlug;
  const config = CONFIG[key] ?? CONFIG["shop-currency-converter-purchase-calculator"];
  const [a, setA] = useState(useLoanInitialInput(SHOP_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(SHOP_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(SHOP_URL.C, config.cDefault));
  const [d, setD] = useState(useLoanInitialInput(SHOP_URL.D, config.dDefault));
  const [t, setT] = useState(useLoanInitialInput(SHOP_URL.T, config.tDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "convert":
      case "duty":
      case "taxRefund":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b);
        break;
      case "landed":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.C, c); put(SHOP_URL.D, d); put(SHOP_URL.T, t);
        break;
      case "intlShip":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.C, c); put(SHOP_URL.D, d);
        break;
    }
    return out;
  }, [a, b, c, config.mode, d, t]);

  useLoanUrlSync(shareParams, [a, b, c, d, t]);

  const result = useMemo(() => {
    const input: ShopCurrencyInput = {};
    switch (config.mode) {
      case "convert": {
        const amt = parsePositive(a, "Amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const rate = parsePositive(b, "FX rate");
        if (!rate.ok) return { error: rate.error };
        input.rate = rate.value;
        break;
      }
      case "duty": {
        const amt = parsePositive(a, "Customs value");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const pct = optNonNeg(b, "Duty %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.dutyPct = pct;
        break;
      }
      case "landed": {
        const amt = parsePositive(a, "Product");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const dutyPct = optNonNeg(b, "Duty %");
        if (dutyPct && typeof dutyPct === "object") return { error: dutyPct.error };
        if (typeof dutyPct === "number") input.dutyPct = dutyPct;
        const taxPct = optNonNeg(c, "Tax %");
        if (taxPct && typeof taxPct === "object") return { error: taxPct.error };
        if (typeof taxPct === "number") input.taxPct = taxPct;
        const ship = optNonNeg(d, "Shipping");
        if (ship && typeof ship === "object") return { error: ship.error };
        if (typeof ship === "number") input.shipping = ship;
        const fees = optNonNeg(t, "Fees");
        if (fees && typeof fees === "object") return { error: fees.error };
        if (typeof fees === "number") input.fees = fees;
        break;
      }
      case "taxRefund": {
        const amt = parsePositive(a, "Purchase");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const pct = optNonNeg(b, "Refundable tax %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.refundPct = pct;
        break;
      }
      case "intlShip": {
        const amt = parsePositive(a, "Product");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const ship = parsePositive(b, "Shipping");
        if (!ship.ok) return { error: ship.error };
        input.shipping = ship.value;
        const fees = optNonNeg(c, "Fees");
        if (fees && typeof fees === "object") return { error: fees.error };
        if (typeof fees === "number") input.fees = fees;
        const dutyPct = optNonNeg(d, "Duty %");
        if (dutyPct && typeof dutyPct === "object") return { error: dutyPct.error };
        if (typeof dutyPct === "number") input.dutyPct = dutyPct;
        break;
      }
    }
    return formatResult(computeShopCurrency(key in CONFIG ? key : "shop-currency-converter-purchase-calculator", input), num);
  }, [a, b, c, config.mode, d, key, t]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {(config.mode === "convert" || config.mode === "duty" || config.mode === "taxRefund") ? (
            <>
              <div><FieldLabel htmlFor="scur-a">Amount</FieldLabel><FieldInput id="scur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="scur-b">{config.mode === "convert" ? "FX rate" : config.mode === "duty" ? "Duty %" : "Refundable tax %"}</FieldLabel><FieldInput id="scur-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "landed" ? (
            <>
              <div><FieldLabel htmlFor="scur-a">Product</FieldLabel><FieldInput id="scur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="scur-b">Duty %</FieldLabel><FieldInput id="scur-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="scur-c">Tax %</FieldLabel><FieldInput id="scur-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="scur-d">Shipping</FieldLabel><FieldInput id="scur-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="scur-t">Fees</FieldLabel><FieldInput id="scur-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "intlShip" ? (
            <>
              <div><FieldLabel htmlFor="scur-a">Product</FieldLabel><FieldInput id="scur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="scur-b">Shipping</FieldLabel><FieldInput id="scur-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="scur-c">Fees</FieldLabel><FieldInput id="scur-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="scur-d">Duty %</FieldLabel><FieldInput id="scur-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
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
