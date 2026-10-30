"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CUR_URL, ILLUSTRATIVE } from "@/lib/calculators/curHelpers";
import {
  computeCurBasic,
  type CurBasicInput,
  type CurBasicResult,
  type CurBasicSlug,
} from "@/lib/calculators/curBasic";
import { parsePositive } from "@/lib/calculators/loanInputParse";

type Config = {
  title: string;
  description: string;
  aDefault: string;
  rDefault: string;
  aLabel: string;
  rLabel: string;
};

const DISCLAIMER =
  "Teaching FX estimate only — illustrative example rates, not live market data. Verify with your bank or a live quote.";

const CONFIG: Record<CurBasicSlug, Config> = {
  "cur-currency-converter-global": {
    title: "Currency converter (global)",
    description: `Amount × any illustrative rate. ${DISCLAIMER}`,
    aDefault: "100",
    rDefault: String(ILLUSTRATIVE.USD_INR),
    aLabel: "Amount",
    rLabel: "FX rate (example)",
  },
  "cur-usd-to-inr-converter": {
    title: "USD to INR",
    description: `Convert USD to INR with an illustrative rate (default ${ILLUSTRATIVE.USD_INR}). ${DISCLAIMER}`,
    aDefault: "100",
    rDefault: String(ILLUSTRATIVE.USD_INR),
    aLabel: "USD amount",
    rLabel: "USD/INR (example)",
  },
  "cur-inr-to-usd-converter": {
    title: "INR to USD",
    description: `Convert INR to USD (default 1÷${ILLUSTRATIVE.USD_INR}). ${DISCLAIMER}`,
    aDefault: "8300",
    rDefault: (1 / ILLUSTRATIVE.USD_INR).toFixed(6),
    aLabel: "INR amount",
    rLabel: "INR/USD (example)",
  },
  "cur-eur-to-usd-converter": {
    title: "EUR to USD",
    description: `Convert EUR to USD (default ${ILLUSTRATIVE.EUR_USD}). ${DISCLAIMER}`,
    aDefault: "100",
    rDefault: String(ILLUSTRATIVE.EUR_USD),
    aLabel: "EUR amount",
    rLabel: "EUR/USD (example)",
  },
  "cur-gbp-to-inr-converter": {
    title: "GBP to INR",
    description: `Convert GBP to INR (default ${ILLUSTRATIVE.GBP_INR}). ${DISCLAIMER}`,
    aDefault: "100",
    rDefault: String(ILLUSTRATIVE.GBP_INR),
    aLabel: "GBP amount",
    rLabel: "GBP/INR (example)",
  },
  "cur-aed-to-inr-converter": {
    title: "AED to INR",
    description: `Convert AED to INR (default ${ILLUSTRATIVE.AED_INR}). ${DISCLAIMER}`,
    aDefault: "100",
    rDefault: String(ILLUSTRATIVE.AED_INR),
    aLabel: "AED amount",
    rLabel: "AED/INR (example)",
  },
  "cur-sgd-to-inr-converter": {
    title: "SGD to INR",
    description: `Convert SGD to INR (default ${ILLUSTRATIVE.SGD_INR}). ${DISCLAIMER}`,
    aDefault: "100",
    rDefault: String(ILLUSTRATIVE.SGD_INR),
    aLabel: "SGD amount",
    rLabel: "SGD/INR (example)",
  },
  "cur-cad-to-inr-converter": {
    title: "CAD to INR",
    description: `Convert CAD to INR (default ${ILLUSTRATIVE.CAD_INR}). ${DISCLAIMER}`,
    aDefault: "100",
    rDefault: String(ILLUSTRATIVE.CAD_INR),
    aLabel: "CAD amount",
    rLabel: "CAD/INR (example)",
  },
  "cur-aud-to-inr-converter": {
    title: "AUD to INR",
    description: `Convert AUD to INR (default ${ILLUSTRATIVE.AUD_INR}). ${DISCLAIMER}`,
    aDefault: "100",
    rDefault: String(ILLUSTRATIVE.AUD_INR),
    aLabel: "AUD amount",
    rLabel: "AUD/INR (example)",
  },
  "cur-crypto-to-fiat-converter": {
    title: "Crypto to fiat",
    description: `Units × illustrative crypto price. ${DISCLAIMER}`,
    aDefault: "0.5",
    rDefault: "65000",
    aLabel: "Crypto units",
    rLabel: "Price in fiat (example)",
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

function formatResult(res: CurBasicResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  return {
    primary: num(res.converted, 4),
    primaryLabel: "Converted",
    rows: [
      { label: "Converted", value: num(res.converted, 4) },
      { label: "Rate used", value: num(res.rateUsed, 6) },
      { label: "Note", value: res.note },
    ],
  };
}

export function CurBasicCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CurBasicSlug;
  const config = CONFIG[key] ?? CONFIG["cur-currency-converter-global"];
  const [a, setA] = useState(useLoanInitialInput(CUR_URL.A, config.aDefault));
  const [r, setR] = useState(useLoanInitialInput(CUR_URL.R, config.rDefault));

  const num = (nVal: number, dec = 2) => {
    if (!Number.isFinite(nVal)) return "—";
    const abs = Math.abs(nVal);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-4)) return nVal.toExponential(4);
    return nVal.toFixed(dec);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    if (a.trim() !== "") out[CUR_URL.A] = a;
    if (r.trim() !== "") out[CUR_URL.R] = r;
    return out;
  }, [a, r]);

  useLoanUrlSync(shareParams, [a, r]);

  const result = useMemo(() => {
    const input: CurBasicInput = {};
    const amt = parsePositive(a, "Amount");
    if (!amt.ok) return { error: amt.error };
    input.amount = amt.value;
    const rate = parsePositive(r, "Rate");
    if (!rate.ok) return { error: rate.error };
    input.rate = rate.value;
    return formatResult(computeCurBasic(key in CONFIG ? key : "cur-currency-converter-global", input), num);
  }, [a, key, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="cur-a">{config.aLabel}</FieldLabel>
            <FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
          </div>
          <div>
            <FieldLabel htmlFor="cur-r">{config.rLabel}</FieldLabel>
            <FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
          </div>
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
                {result.rows.map((row) => (
                  <Row key={row.label} label={row.label} value={row.value} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
