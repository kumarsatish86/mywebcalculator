"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { TRAVEL_URL } from "@/lib/calculators/travelHelpers";
import {
  computeTravelStay,
  type TravelStayInput,
  type TravelStayResult,
  type TravelStaySlug,
} from "@/lib/calculators/travelStay";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "stay" | "resort" | "discount" | "cleaning";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  lDefault: string;
  wDefault: string;
  hDefault: string;
  dDefault: string;
  nDefault: string;
  pDefault: string;
  qDefault: string;
  mDefault: string;
  vDefault: string;
  sDefault: string;
};

const EMPTY = {
  aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "",
  lDefault: "", wDefault: "", hDefault: "", dDefault: "", nDefault: "",
  pDefault: "", qDefault: "", mDefault: "", vDefault: "", sDefault: "",
};

const DISCLAIMER =
  "Daily-life travel planning estimate only — rates, fees, and policies vary. Verify with carriers and providers.";

const CONFIG: Record<TravelStaySlug, Config> = {
  "travel-hotel-stay-cost-calculator": {
    title: "Hotel stay cost",
    description: `Stay total with tax, resort fee, and cleaning. ${DISCLAIMER}`,
    mode: "stay",
    ...EMPTY, aDefault: "120", nDefault: "4", tDefault: "12", rDefault: "25", cDefault: "50",
  },
  "travel-nightly-rate-with-fees-calculator": {
    title: "Nightly rate with fees",
    description: `Effective nightly after fees and tax. ${DISCLAIMER}`,
    mode: "stay",
    ...EMPTY, aDefault: "95", nDefault: "3", tDefault: "10", rDefault: "20", cDefault: "40",
  },
  "travel-resort-fee-total-calculator": {
    title: "Resort fee total",
    description: `Resort fees across the stay. ${DISCLAIMER}`,
    mode: "resort",
    ...EMPTY, rDefault: "35", nDefault: "5",
  },
  "travel-extended-stay-discount-calculator": {
    title: "Extended stay discount",
    description: `Long-stay total after discount %. ${DISCLAIMER}`,
    mode: "discount",
    ...EMPTY, aDefault: "100", nDefault: "14", pDefault: "15",
  },
  "travel-cleaning-fee-amortization-calculator": {
    title: "Cleaning fee amortization",
    description: `Cleaning fee spread per night. ${DISCLAIMER}`,
    mode: "cleaning",
    ...EMPTY, cDefault: "80", nDefault: "4",
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

function formatResult(res: TravelStayResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.total !== undefined) rows.push({ label: "Total", value: num(res.total, 2) });
  if (res.effectiveNightly !== undefined) rows.push({ label: "Effective nightly", value: num(res.effectiveNightly, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.total !== undefined ? num(res.total, 2)
    : res.effectiveNightly !== undefined ? num(res.effectiveNightly, 2)
    : "—";
  const primaryLabel =
    res.effectiveNightly !== undefined && res.total === undefined ? "Per night"
    : "Total";
  return { primary, primaryLabel, rows };
}

export function TravelStayCalculatorHost({ slug }: { slug: string }) {
  const key = slug as TravelStaySlug;
  const config = CONFIG[key] ?? CONFIG["travel-hotel-stay-cost-calculator"];
  const [a, setA] = useState(useLoanInitialInput(TRAVEL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(TRAVEL_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(TRAVEL_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(TRAVEL_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(TRAVEL_URL.T, config.tDefault));
  const [l, setL] = useState(useLoanInitialInput(TRAVEL_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(TRAVEL_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(TRAVEL_URL.H, config.hDefault));
  const [d, setD] = useState(useLoanInitialInput(TRAVEL_URL.D, config.dDefault));
  const [n, setN] = useState(useLoanInitialInput(TRAVEL_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(TRAVEL_URL.P, config.pDefault));
  const [q, setQ] = useState(useLoanInitialInput(TRAVEL_URL.Q, config.qDefault));
  const [m, setM] = useState(useLoanInitialInput(TRAVEL_URL.M, config.mDefault));
  const [v, setV] = useState(useLoanInitialInput(TRAVEL_URL.V, config.vDefault));
  const [s, setS] = useState(useLoanInitialInput(TRAVEL_URL.S, config.sDefault));

  const num = (nVal: number, dec = 2) => {
    if (!Number.isFinite(nVal)) return "—";
    const abs = Math.abs(nVal);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return nVal.toExponential(4);
    return nVal.toFixed(dec);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "stay":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.N, n); put(TRAVEL_URL.T, t); put(TRAVEL_URL.R, r); put(TRAVEL_URL.C, c);
        break;
      case "resort":
        put(TRAVEL_URL.R, r); put(TRAVEL_URL.N, n);
        break;
      case "discount":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.N, n); put(TRAVEL_URL.P, p);
        break;
      case "cleaning":
        put(TRAVEL_URL.C, c); put(TRAVEL_URL.N, n);
        break;
    }
    return out;
  }, [a, c, config.mode, n, p, r, t]);

  useLoanUrlSync(shareParams, [a, b, c, d, h, l, m, n, p, q, r, s, t, v, w]);

  const result = useMemo(() => {
    const input: TravelStayInput = {};
    switch (config.mode) {
      case "stay": {
        const nightly = parsePositive(a, "Nightly rate");
        if (!nightly.ok) return { error: nightly.error };
        input.nightly = nightly.value;
        const nights = parsePositive(n, "Nights");
        if (!nights.ok) return { error: nights.error };
        input.nights = nights.value;
        const tax = optNonNeg(t, "Tax %");
        if (tax && typeof tax === "object") return { error: tax.error };
        if (typeof tax === "number") input.taxPct = tax;
        const resort = optNonNeg(r, "Resort fee/night");
        if (resort && typeof resort === "object") return { error: resort.error };
        if (typeof resort === "number") input.resortFeePerNight = resort;
        const clean = optNonNeg(c, "Cleaning fee");
        if (clean && typeof clean === "object") return { error: clean.error };
        if (typeof clean === "number") input.cleaningFee = clean;
        break;
      }
      case "resort": {
        const fee = parsePositive(r, "Resort fee/night");
        if (!fee.ok) return { error: fee.error };
        input.resortFeePerNight = fee.value;
        const nights = parsePositive(n, "Nights");
        if (!nights.ok) return { error: nights.error };
        input.nights = nights.value;
        break;
      }
      case "discount": {
        const nightly = parsePositive(a, "Nightly");
        if (!nightly.ok) return { error: nightly.error };
        input.nightly = nightly.value;
        const nights = parsePositive(n, "Nights");
        if (!nights.ok) return { error: nights.error };
        input.nights = nights.value;
        const disc = optNonNeg(p, "Discount %");
        if (disc && typeof disc === "object") return { error: disc.error };
        if (typeof disc === "number") input.discountPct = disc;
        break;
      }
      case "cleaning": {
        const clean = parsePositive(c, "Cleaning fee");
        if (!clean.ok) return { error: clean.error };
        input.cleaningFee = clean.value;
        const nights = parsePositive(n, "Nights");
        if (!nights.ok) return { error: nights.error };
        input.nights = nights.value;
        break;
      }
    }
    return formatResult(
      computeTravelStay(key in CONFIG ? key : "travel-hotel-stay-cost-calculator", input),
      num,
    );
  }, [a, c, config.mode, key, n, p, r, t]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "stay" ? (
            <>
              <div><FieldLabel htmlFor="ts-a">Nightly rate</FieldLabel><FieldInput id="ts-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ts-n">Nights</FieldLabel><FieldInput id="ts-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ts-t">Tax %</FieldLabel><FieldInput id="ts-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ts-r">Resort fee / night</FieldLabel><FieldInput id="ts-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ts-c">Cleaning fee</FieldLabel><FieldInput id="ts-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "resort" ? (
            <>
              <div><FieldLabel htmlFor="ts-r">Resort fee / night</FieldLabel><FieldInput id="ts-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ts-n">Nights</FieldLabel><FieldInput id="ts-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "discount" ? (
            <>
              <div><FieldLabel htmlFor="ts-a">Nightly rate</FieldLabel><FieldInput id="ts-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ts-n">Nights</FieldLabel><FieldInput id="ts-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ts-p">Discount %</FieldLabel><FieldInput id="ts-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "cleaning" ? (
            <>
              <div><FieldLabel htmlFor="ts-c">Cleaning fee</FieldLabel><FieldInput id="ts-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ts-n">Nights</FieldLabel><FieldInput id="ts-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
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
