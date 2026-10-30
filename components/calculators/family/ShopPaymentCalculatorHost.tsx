"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { SHOP_URL } from "@/lib/calculators/shopHelpers";
import {
  computeShopPayment,
  type ShopPaymentInput,
  type ShopPaymentResult,
  type ShopPaymentSlug,
} from "@/lib/calculators/shopPayment";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "emi" | "noCostEmi" | "bnpl" | "installmentCompare" | "downPayment" | "deferredInterest";

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

const CONFIG: Record<ShopPaymentSlug, Config> = {
  "shop-emi-calculator": {
    title: "EMI",
    description: `Monthly EMI on reducing balance. ${DISCLAIMER}`,
    mode: "emi",
    ...EMPTY, aDefault: "12000", bDefault: "12", nDefault: "12",
  },
  "shop-no-cost-emi-comparison-calculator": {
    title: "No-cost EMI comparison",
    description: `No-cost EMI vs interest EMI. ${DISCLAIMER}`,
    mode: "noCostEmi",
    ...EMPTY, aDefault: "30000", nDefault: "6", bDefault: "299", cDefault: "12",
  },
  "shop-bnpl-total-cost-calculator": {
    title: "BNPL total cost",
    description: `Buy-now-pay-later total with fees. ${DISCLAIMER}`,
    mode: "bnpl",
    ...EMPTY, aDefault: "500", bDefault: "25", nDefault: "4",
  },
  "shop-installment-plan-comparison-calculator": {
    title: "Installment plan comparison",
    description: `Compare two installment plans. ${DISCLAIMER}`,
    mode: "installmentCompare",
    ...EMPTY, aDefault: "500", bDefault: "6", cDefault: "450", dDefault: "12",
  },
  "shop-down-payment-calculator": {
    title: "Down payment",
    description: `Down payment and financed amount. ${DISCLAIMER}`,
    mode: "downPayment",
    ...EMPTY, aDefault: "25000", bDefault: "20", cDefault: "",
  },
  "shop-interest-on-deferred-payment-calculator": {
    title: "Deferred payment interest",
    description: `Simple interest on deferred amount. ${DISCLAIMER}`,
    mode: "deferredInterest",
    ...EMPTY, aDefault: "5000", bDefault: "18", nDefault: "3",
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

function formatResult(res: ShopPaymentResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.emi !== undefined) rows.push({ label: "EMI / installment", value: num(res.emi, 2) });
  if (res.total !== undefined) rows.push({ label: "Total", value: num(res.total, 2) });
  if (res.interest !== undefined) rows.push({ label: "Interest", value: num(res.interest, 2) });
  if (res.down !== undefined) rows.push({ label: "Down payment", value: num(res.down, 2) });
  if (res.financed !== undefined) rows.push({ label: "Financed", value: num(res.financed, 2) });
  if (res.cheaper !== undefined) rows.push({ label: "Cheaper", value: res.cheaper });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.emi !== undefined ? num(res.emi, 2)
    : res.down !== undefined ? num(res.down, 2)
    : res.total !== undefined ? num(res.total, 2)
    : "—";
  const primaryLabel =
    res.down !== undefined ? "Down payment"
    : res.emi !== undefined ? "EMI"
    : "Total";
  return { primary, primaryLabel, rows };
}

export function ShopPaymentCalculatorHost({ slug }: { slug: string }) {
  const key = slug as ShopPaymentSlug;
  const config = CONFIG[key] ?? CONFIG["shop-emi-calculator"];
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
      case "emi":
      case "deferredInterest":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.N, n);
        break;
      case "noCostEmi":
        put(SHOP_URL.A, a); put(SHOP_URL.N, n); put(SHOP_URL.B, b); put(SHOP_URL.C, c);
        break;
      case "bnpl":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.N, n);
        break;
      case "installmentCompare":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b); put(SHOP_URL.C, c); put(SHOP_URL.D, d);
        break;
      case "downPayment":
        put(SHOP_URL.A, a); put(SHOP_URL.B, b);
        if (c.trim() !== "") put(SHOP_URL.C, c);
        break;
    }
    return out;
  }, [a, b, c, config.mode, d, n]);

  useLoanUrlSync(shareParams, [a, b, c, d, n]);

  const result = useMemo(() => {
    const input: ShopPaymentInput = {};
    switch (config.mode) {
      case "emi": {
        const P = parsePositive(a, "Principal");
        if (!P.ok) return { error: P.error };
        input.principal = P.value;
        const rate = optNonNeg(b, "APR %");
        if (rate && typeof rate === "object") return { error: rate.error };
        if (typeof rate === "number") input.annualRatePct = rate;
        const months = parsePositive(n, "Months");
        if (!months.ok) return { error: months.error };
        input.months = months.value;
        break;
      }
      case "noCostEmi": {
        const P = parsePositive(a, "Price");
        if (!P.ok) return { error: P.error };
        input.principal = P.value;
        const months = parsePositive(n, "Months");
        if (!months.ok) return { error: months.error };
        input.months = months.value;
        const fee = optNonNeg(b, "Processing fee");
        if (fee && typeof fee === "object") return { error: fee.error };
        if (typeof fee === "number") input.processingFee = fee;
        const rate = optNonNeg(c, "Compare APR %");
        if (rate && typeof rate === "object") return { error: rate.error };
        if (typeof rate === "number") input.annualRatePct = rate;
        break;
      }
      case "bnpl": {
        const P = parsePositive(a, "Purchase");
        if (!P.ok) return { error: P.error };
        input.principal = P.value;
        const fees = optNonNeg(b, "Fees");
        if (fees && typeof fees === "object") return { error: fees.error };
        if (typeof fees === "number") input.fees = fees;
        const months = parsePositive(n, "Installments");
        if (!months.ok) return { error: months.error };
        input.months = months.value;
        break;
      }
      case "installmentCompare": {
        const aM = parsePositive(a, "Plan A monthly");
        if (!aM.ok) return { error: aM.error };
        input.planAMonthly = aM.value;
        const aN = parsePositive(b, "Plan A months");
        if (!aN.ok) return { error: aN.error };
        input.planAMonths = aN.value;
        const bM = parsePositive(c, "Plan B monthly");
        if (!bM.ok) return { error: bM.error };
        input.planBMonthly = bM.value;
        const bN = parsePositive(d, "Plan B months");
        if (!bN.ok) return { error: bN.error };
        input.planBMonths = bN.value;
        break;
      }
      case "downPayment": {
        const P = parsePositive(a, "Price");
        if (!P.ok) return { error: P.error };
        input.principal = P.value;
        if (c.trim() !== "") {
          const amt = optNonNeg(c, "Down amount");
          if (amt && typeof amt === "object") return { error: amt.error };
          if (typeof amt === "number") input.downAmt = amt;
        } else {
          const pct = optNonNeg(b, "Down %");
          if (pct && typeof pct === "object") return { error: pct.error };
          if (typeof pct === "number") input.downPct = pct;
        }
        break;
      }
      case "deferredInterest": {
        const P = parsePositive(a, "Amount");
        if (!P.ok) return { error: P.error };
        input.principal = P.value;
        const rate = optNonNeg(b, "APR %");
        if (rate && typeof rate === "object") return { error: rate.error };
        if (typeof rate === "number") input.annualRatePct = rate;
        const months = parsePositive(n, "Months deferred");
        if (!months.ok) return { error: months.error };
        input.months = months.value;
        break;
      }
    }
    return formatResult(computeShopPayment(key in CONFIG ? key : "shop-emi-calculator", input), num);
  }, [a, b, c, config.mode, d, key, n]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {(config.mode === "emi" || config.mode === "deferredInterest") ? (
            <>
              <div><FieldLabel htmlFor="spay-a">{config.mode === "emi" ? "Principal" : "Amount"}</FieldLabel><FieldInput id="spay-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="spay-b">APR %</FieldLabel><FieldInput id="spay-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="spay-n">Months</FieldLabel><FieldInput id="spay-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "noCostEmi" ? (
            <>
              <div><FieldLabel htmlFor="spay-a">Price</FieldLabel><FieldInput id="spay-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="spay-n">Months</FieldLabel><FieldInput id="spay-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="spay-b">Processing fee</FieldLabel><FieldInput id="spay-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="spay-c">Compare APR %</FieldLabel><FieldInput id="spay-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "bnpl" ? (
            <>
              <div><FieldLabel htmlFor="spay-a">Purchase amount</FieldLabel><FieldInput id="spay-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="spay-b">Fees</FieldLabel><FieldInput id="spay-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="spay-n">Installments</FieldLabel><FieldInput id="spay-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "installmentCompare" ? (
            <>
              <div><FieldLabel htmlFor="spay-a">Plan A monthly</FieldLabel><FieldInput id="spay-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="spay-b">Plan A months</FieldLabel><FieldInput id="spay-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="spay-c">Plan B monthly</FieldLabel><FieldInput id="spay-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="spay-d">Plan B months</FieldLabel><FieldInput id="spay-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "downPayment" ? (
            <>
              <div><FieldLabel htmlFor="spay-a">Price</FieldLabel><FieldInput id="spay-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="spay-b">Down %</FieldLabel><FieldInput id="spay-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="spay-c">Or down amount (override)</FieldLabel><FieldInput id="spay-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
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
