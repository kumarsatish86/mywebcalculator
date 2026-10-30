"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CUR_URL } from "@/lib/calculators/curHelpers";
import {
  computeCurBusiness,
  type CurBusinessInput,
  type CurBusinessResult,
  type CurBusinessSlug,
} from "@/lib/calculators/curBusiness";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "import" | "pricing" | "crossBorder" | "shopify" | "margin";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  rDefault: string;
  pDefault: string;
  cDefault: string;
  mDefault: string;
};

const EMPTY = { aDefault: "", bDefault: "", rDefault: "", pDefault: "", cDefault: "", mDefault: "" };

const DISCLAIMER =
  "Business FX teaching estimate only — illustrative rates, not live quotes.";

const CONFIG: Record<CurBusinessSlug, Config> = {
  "cur-import-export-cost-calculator": {
    title: "Import/export cost",
    description: `Landed ≈ goods×FX + duty + freight. ${DISCLAIMER}`,
    mode: "import",
    ...EMPTY, aDefault: "1000", rDefault: "83", pDefault: "10", cDefault: "500",
  },
  "cur-currency-pricing-calculator": {
    title: "Currency pricing",
    description: `Price = cost×FX × (1 + margin%). ${DISCLAIMER}`,
    mode: "pricing",
    ...EMPTY, aDefault: "100", rDefault: "83", pDefault: "20",
  },
  "cur-cross-border-pricing-calculator": {
    title: "Cross-border pricing",
    description: `Home list ≈ (local ÷ FX) × (1 + markup%). ${DISCLAIMER}`,
    mode: "crossBorder",
    ...EMPTY, aDefault: "999", rDefault: "83", mDefault: "15",
  },
  "cur-shopify-currency-converter-tool": {
    title: "Shopify currency converter",
    description: `Storefront display ≈ price × illustrative FX. ${DISCLAIMER}`,
    mode: "shopify",
    ...EMPTY, aDefault: "49.99", rDefault: "83",
  },
  "cur-international-pricing-margin-calculator": {
    title: "International pricing margin",
    description: `Margin% = (sell − cost×FX) ÷ sell × 100. ${DISCLAIMER}`,
    mode: "margin",
    ...EMPTY, aDefault: "15000", cDefault: "120", rDefault: "83",
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

function formatResult(res: CurBusinessResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.landed !== undefined) rows.push({ label: "Landed cost", value: num(res.landed, 2) });
  if (res.price !== undefined) rows.push({ label: "Price", value: num(res.price, 2) });
  if (res.converted !== undefined) rows.push({ label: "Converted", value: num(res.converted, 2) });
  if (res.marginPct !== undefined) rows.push({ label: "Margin %", value: num(res.marginPct, 2) });
  if (res.profit !== undefined) rows.push({ label: "Profit", value: num(res.profit, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.landed !== undefined ? num(res.landed, 2)
    : res.price !== undefined ? num(res.price, 2)
    : res.marginPct !== undefined ? num(res.marginPct, 2)
    : res.converted !== undefined ? num(res.converted, 2)
    : "—";
  const primaryLabel =
    res.landed !== undefined ? "Landed cost"
    : res.price !== undefined ? "Price"
    : res.marginPct !== undefined ? "Margin %"
    : "Converted";
  return { primary, primaryLabel, rows };
}

export function CurBusinessCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CurBusinessSlug;
  const config = CONFIG[key] ?? CONFIG["cur-import-export-cost-calculator"];
  const [a, setA] = useState(useLoanInitialInput(CUR_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CUR_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(CUR_URL.R, config.rDefault));
  const [p, setP] = useState(useLoanInitialInput(CUR_URL.P, config.pDefault));
  const [c, setC] = useState(useLoanInitialInput(CUR_URL.C, config.cDefault));
  const [m, setM] = useState(useLoanInitialInput(CUR_URL.M, config.mDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "import":
        put(CUR_URL.A, a); put(CUR_URL.R, r); put(CUR_URL.P, p); put(CUR_URL.C, c);
        break;
      case "pricing":
        put(CUR_URL.A, a); put(CUR_URL.R, r); put(CUR_URL.P, p);
        break;
      case "crossBorder":
        put(CUR_URL.A, a); put(CUR_URL.R, r); put(CUR_URL.M, m);
        break;
      case "shopify":
        put(CUR_URL.A, a); put(CUR_URL.R, r);
        break;
      case "margin":
        put(CUR_URL.A, a); put(CUR_URL.C, c); put(CUR_URL.R, r);
        break;
    }
    return out;
  }, [a, c, config.mode, m, p, r]);

  useLoanUrlSync(shareParams, [a, b, c, m, p, r]);

  const result = useMemo(() => {
    const input: CurBusinessInput = {};
    switch (config.mode) {
      case "import": {
        const amt = parsePositive(a, "Goods cost");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const rate = parsePositive(r, "FX rate");
        if (!rate.ok) return { error: rate.error };
        input.rate = rate.value;
        const duty = optNonNeg(p, "Duty %");
        if (duty && typeof duty === "object") return { error: duty.error };
        if (typeof duty === "number") input.dutyPct = duty;
        const freight = optNonNeg(c, "Freight");
        if (freight && typeof freight === "object") return { error: freight.error };
        if (typeof freight === "number") input.freight = freight;
        break;
      }
      case "pricing": {
        const cost = parsePositive(a, "Cost");
        if (!cost.ok) return { error: cost.error };
        input.cost = cost.value;
        const rate = parsePositive(r, "FX rate");
        if (!rate.ok) return { error: rate.error };
        input.rate = rate.value;
        const margin = optNonNeg(p, "Margin %");
        if (margin && typeof margin === "object") return { error: margin.error };
        if (typeof margin === "number") input.marginPct = margin;
        break;
      }
      case "crossBorder": {
        const local = parsePositive(a, "Local price");
        if (!local.ok) return { error: local.error };
        input.amount = local.value;
        const rate = parsePositive(r, "FX rate");
        if (!rate.ok) return { error: rate.error };
        input.rate = rate.value;
        const markup = optNonNeg(m, "Markup %");
        if (markup && typeof markup === "object") return { error: markup.error };
        if (typeof markup === "number") input.markupPct = markup;
        break;
      }
      case "shopify": {
        const amt = parsePositive(a, "Store price");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const rate = parsePositive(r, "FX rate");
        if (!rate.ok) return { error: rate.error };
        input.rate = rate.value;
        break;
      }
      case "margin": {
        const sell = parsePositive(a, "Sell price (home)");
        if (!sell.ok) return { error: sell.error };
        input.sellPrice = sell.value;
        const cost = parsePositive(c, "Cost (foreign)");
        if (!cost.ok) return { error: cost.error };
        input.cost = cost.value;
        const rate = parsePositive(r, "FX rate");
        if (!rate.ok) return { error: rate.error };
        input.rate = rate.value;
        break;
      }
    }
    return formatResult(
      computeCurBusiness(key in CONFIG ? key : "cur-import-export-cost-calculator", input),
      num,
    );
  }, [a, c, config.mode, key, m, p, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {(config.mode === "import" || config.mode === "pricing" || config.mode === "crossBorder" || config.mode === "shopify" || config.mode === "margin") ? (
            <div>
              <FieldLabel htmlFor="cur-a">
                {config.mode === "import" ? "Goods cost"
                  : config.mode === "pricing" ? "Cost"
                  : config.mode === "crossBorder" ? "Local price"
                  : config.mode === "margin" ? "Sell price (home)"
                  : "Store price"}
              </FieldLabel>
              <FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}
          {config.mode === "margin" ? (
            <div><FieldLabel htmlFor="cur-c">Cost (foreign)</FieldLabel><FieldInput id="cur-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {(config.mode === "import" || config.mode === "pricing" || config.mode === "crossBorder" || config.mode === "shopify" || config.mode === "margin") ? (
            <div><FieldLabel htmlFor="cur-r">FX rate (example)</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "import" ? (
            <>
              <div><FieldLabel htmlFor="cur-p">Duty %</FieldLabel><FieldInput id="cur-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-c">Freight</FieldLabel><FieldInput id="cur-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "pricing" ? (
            <div><FieldLabel htmlFor="cur-p">Margin %</FieldLabel><FieldInput id="cur-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "crossBorder" ? (
            <div><FieldLabel htmlFor="cur-m">Markup %</FieldLabel><FieldInput id="cur-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" /></div>
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
