"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CUR_URL } from "@/lib/calculators/curHelpers";
import {
  computeCurBanking,
  type CurBankingInput,
  type CurBankingResult,
  type CurBankingSlug,
} from "@/lib/calculators/curBanking";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "transfer" | "wire" | "paypal" | "stripe" | "spread" | "bankRate";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  rDefault: string;
  pDefault: string;
  cDefault: string;
  mDefault: string;
};

const EMPTY = { aDefault: "", rDefault: "", pDefault: "", cDefault: "", mDefault: "" };

const DISCLAIMER =
  "Teaching remittance estimate only — illustrative rates and fees, not live bank quotes.";

const CONFIG: Record<CurBankingSlug, Config> = {
  "cur-international-money-transfer-calculator": {
    title: "International money transfer",
    description: `Received = (send − fees) × illustrative rate. ${DISCLAIMER}`,
    mode: "transfer",
    ...EMPTY, aDefault: "1000", rDefault: "83", pDefault: "1", cDefault: "5",
  },
  "cur-remittance-calculator-india": {
    title: "Remittance (India)",
    description: `India remittance teaching estimate. ${DISCLAIMER}`,
    mode: "transfer",
    ...EMPTY, aDefault: "50000", rDefault: "83", pDefault: "0.5", cDefault: "250",
  },
  "cur-wire-transfer-fee-calculator": {
    title: "Wire transfer fee",
    description: `Fee = % + fixed; total = amount + fee. ${DISCLAIMER}`,
    mode: "wire",
    ...EMPTY, aDefault: "5000", pDefault: "0.5", cDefault: "25",
  },
  "cur-paypal-fee-calculator": {
    title: "PayPal fee",
    description: `PayPal-style defaults (e.g. 2.9% + 0.30). ${DISCLAIMER}`,
    mode: "paypal",
    ...EMPTY, aDefault: "100", pDefault: "2.9", cDefault: "0.3",
  },
  "cur-stripe-fee-calculator": {
    title: "Stripe fee",
    description: `Net ≈ amount − (% + fixed). ${DISCLAIMER}`,
    mode: "stripe",
    ...EMPTY, aDefault: "100", pDefault: "2.9", cDefault: "0.3",
  },
  "cur-currency-conversion-fee-calculator": {
    title: "Conversion spread",
    description: `Spread cost ≈ amount × spread%. ${DISCLAIMER}`,
    mode: "spread",
    ...EMPTY, aDefault: "1000", mDefault: "2",
  },
  "cur-bank-exchange-rate-calculator": {
    title: "Bank exchange rate",
    description: `Bank rate ≈ mid × (1 − markup%). ${DISCLAIMER}`,
    mode: "bankRate",
    ...EMPTY, aDefault: "1000", rDefault: "83", mDefault: "2",
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

function formatResult(res: CurBankingResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.received !== undefined) rows.push({ label: "Received", value: num(res.received, 2) });
  if (res.fee !== undefined) rows.push({ label: "Fee", value: num(res.fee, 2) });
  if (res.totalCharged !== undefined) rows.push({ label: "Total charged", value: num(res.totalCharged, 2) });
  if (res.effectiveRate !== undefined) rows.push({ label: "Effective rate", value: num(res.effectiveRate, 4) });
  if (res.bankRate !== undefined) rows.push({ label: "Bank rate", value: num(res.bankRate, 4) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.received !== undefined ? num(res.received, 2)
    : res.totalCharged !== undefined ? num(res.totalCharged, 2)
    : res.fee !== undefined ? num(res.fee, 2)
    : res.bankRate !== undefined ? num(res.bankRate, 4)
    : "—";
  const primaryLabel =
    res.received !== undefined ? "Received"
    : res.totalCharged !== undefined ? "Total charged"
    : res.bankRate !== undefined ? "Bank rate"
    : "Fee";
  return { primary, primaryLabel, rows };
}

export function CurBankingCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CurBankingSlug;
  const config = CONFIG[key] ?? CONFIG["cur-international-money-transfer-calculator"];
  const [a, setA] = useState(useLoanInitialInput(CUR_URL.A, config.aDefault));
  const [r, setR] = useState(useLoanInitialInput(CUR_URL.R, config.rDefault));
  const [p, setP] = useState(useLoanInitialInput(CUR_URL.P, config.pDefault));
  const [c, setC] = useState(useLoanInitialInput(CUR_URL.C, config.cDefault));
  const [m, setM] = useState(useLoanInitialInput(CUR_URL.M, config.mDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "transfer":
        put(CUR_URL.A, a); put(CUR_URL.R, r); put(CUR_URL.P, p); put(CUR_URL.C, c);
        break;
      case "wire":
      case "paypal":
      case "stripe":
        put(CUR_URL.A, a); put(CUR_URL.P, p); put(CUR_URL.C, c);
        break;
      case "spread":
        put(CUR_URL.A, a); put(CUR_URL.M, m);
        break;
      case "bankRate":
        put(CUR_URL.A, a); put(CUR_URL.R, r); put(CUR_URL.M, m);
        break;
    }
    return out;
  }, [a, c, config.mode, m, p, r]);

  useLoanUrlSync(shareParams, [a, c, m, p, r]);

  const result = useMemo(() => {
    const input: CurBankingInput = {};
    switch (config.mode) {
      case "transfer": {
        const amt = parsePositive(a, "Send amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const rate = parsePositive(r, "FX rate");
        if (!rate.ok) return { error: rate.error };
        input.rate = rate.value;
        const feePct = optNonNeg(p, "Fee %");
        if (feePct && typeof feePct === "object") return { error: feePct.error };
        if (typeof feePct === "number") input.feePct = feePct;
        const fixed = optNonNeg(c, "Fixed fee");
        if (fixed && typeof fixed === "object") return { error: fixed.error };
        if (typeof fixed === "number") input.fixedFee = fixed;
        break;
      }
      case "wire":
      case "paypal":
      case "stripe": {
        const amt = parsePositive(a, "Amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const feePct = optNonNeg(p, "Fee %");
        if (feePct && typeof feePct === "object") return { error: feePct.error };
        if (typeof feePct === "number") input.feePct = feePct;
        const fixed = optNonNeg(c, "Fixed fee");
        if (fixed && typeof fixed === "object") return { error: fixed.error };
        if (typeof fixed === "number") input.fixedFee = fixed;
        break;
      }
      case "spread": {
        const amt = parsePositive(a, "Amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const markup = optNonNeg(m, "Spread %");
        if (markup && typeof markup === "object") return { error: markup.error };
        if (typeof markup === "number") input.markupPct = markup;
        break;
      }
      case "bankRate": {
        const mid = parsePositive(r, "Mid-market rate");
        if (!mid.ok) return { error: mid.error };
        input.rate = mid.value;
        const markup = optNonNeg(m, "Bank markup %");
        if (markup && typeof markup === "object") return { error: markup.error };
        if (typeof markup === "number") input.markupPct = markup;
        const amt = parsePositive(a, "Amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        break;
      }
    }
    return formatResult(
      computeCurBanking(key in CONFIG ? key : "cur-international-money-transfer-calculator", input),
      num,
    );
  }, [a, c, config.mode, key, m, p, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {(config.mode === "transfer" || config.mode === "wire" || config.mode === "paypal" || config.mode === "stripe" || config.mode === "spread" || config.mode === "bankRate") ? (
            <div>
              <FieldLabel htmlFor="cur-a">Amount</FieldLabel>
              <FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}
          {(config.mode === "transfer" || config.mode === "bankRate") ? (
            <div>
              <FieldLabel htmlFor="cur-r">{config.mode === "bankRate" ? "Mid-market rate (example)" : "FX rate (example)"}</FieldLabel>
              <FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}
          {(config.mode === "transfer" || config.mode === "wire" || config.mode === "paypal" || config.mode === "stripe") ? (
            <>
              <div><FieldLabel htmlFor="cur-p">Fee %</FieldLabel><FieldInput id="cur-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-c">Fixed fee</FieldLabel><FieldInput id="cur-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {(config.mode === "spread" || config.mode === "bankRate") ? (
            <div>
              <FieldLabel htmlFor="cur-m">{config.mode === "bankRate" ? "Bank markup %" : "Spread %"}</FieldLabel>
              <FieldInput id="cur-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
            </div>
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
