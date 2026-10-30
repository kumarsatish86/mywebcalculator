"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { CUR_URL } from "@/lib/calculators/curHelpers";
import {
  computeCurTravel,
  type CurTravelInput,
  type CurTravelResult,
  type CurTravelSlug,
} from "@/lib/calculators/curTravel";
import { parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "fx" | "trip" | "compare" | "split" | "daily";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  rDefault: string;
  dDefault: string;
  nDefault: string;
};

const EMPTY = { aDefault: "", bDefault: "", rDefault: "", dDefault: "", nDefault: "" };

const DISCLAIMER =
  "Travel FX teaching estimate only — illustrative rates, not live quotes.";

const CONFIG: Record<CurTravelSlug, Config> = {
  "cur-travel-currency-calculator": {
    title: "Travel currency",
    description: `Local cash ≈ amount × illustrative FX. ${DISCLAIMER}`,
    mode: "fx",
    ...EMPTY, aDefault: "1000", rDefault: "0.92",
  },
  "cur-foreign-trip-budget-calculator": {
    title: "Foreign trip budget",
    description: `Trip = daily × days × people; local = × FX. ${DISCLAIMER}`,
    mode: "trip",
    ...EMPTY, aDefault: "100", dDefault: "7", rDefault: "0.92", nDefault: "2",
  },
  "cur-airport-vs-bank-exchange-calculator": {
    title: "Airport vs bank exchange",
    description: `Compare two illustrative FX quotes. ${DISCLAIMER}`,
    mode: "compare",
    ...EMPTY, aDefault: "1000", rDefault: "0.85", bDefault: "0.92",
  },
  "cur-travel-expense-split-calculator": {
    title: "Travel expense split",
    description: `Equal split = total ÷ people. ${DISCLAIMER}`,
    mode: "split",
    ...EMPTY, aDefault: "450", nDefault: "3",
  },
  "cur-daily-travel-budget-calculator": {
    title: "Daily travel budget",
    description: `Trip total = daily budget × days. ${DISCLAIMER}`,
    mode: "daily",
    ...EMPTY, aDefault: "75", dDefault: "10",
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

function formatResult(res: CurTravelResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.converted !== undefined) rows.push({ label: "Converted", value: num(res.converted, 2) });
  if (res.total !== undefined) rows.push({ label: "Total", value: num(res.total, 2) });
  if (res.airport !== undefined) rows.push({ label: "Airport", value: num(res.airport, 2) });
  if (res.bank !== undefined) rows.push({ label: "Bank", value: num(res.bank, 2) });
  if (res.betterLabel !== undefined) rows.push({ label: "Better", value: res.betterLabel });
  if (res.savings !== undefined) rows.push({ label: "Difference", value: num(res.savings, 2) });
  if (res.perPerson !== undefined) rows.push({ label: "Per person", value: num(res.perPerson, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.perPerson !== undefined ? num(res.perPerson, 2)
    : res.converted !== undefined ? num(res.converted, 2)
    : res.total !== undefined ? num(res.total, 2)
    : res.savings !== undefined ? num(res.savings, 2)
    : "—";
  const primaryLabel =
    res.perPerson !== undefined ? "Per person"
    : res.converted !== undefined ? "Converted"
    : res.total !== undefined ? "Total"
    : "Difference";
  return { primary, primaryLabel, rows };
}

export function CurTravelCalculatorHost({ slug }: { slug: string }) {
  const key = slug as CurTravelSlug;
  const config = CONFIG[key] ?? CONFIG["cur-travel-currency-calculator"];
  const [a, setA] = useState(useLoanInitialInput(CUR_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CUR_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(CUR_URL.R, config.rDefault));
  const [d, setD] = useState(useLoanInitialInput(CUR_URL.D, config.dDefault));
  const [n, setN] = useState(useLoanInitialInput(CUR_URL.N, config.nDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "fx":
        put(CUR_URL.A, a); put(CUR_URL.R, r);
        break;
      case "trip":
        put(CUR_URL.A, a); put(CUR_URL.D, d); put(CUR_URL.R, r); put(CUR_URL.N, n);
        break;
      case "compare":
        put(CUR_URL.A, a); put(CUR_URL.R, r); put(CUR_URL.B, b);
        break;
      case "split":
        put(CUR_URL.A, a); put(CUR_URL.N, n);
        break;
      case "daily":
        put(CUR_URL.A, a); put(CUR_URL.D, d);
        break;
    }
    return out;
  }, [a, b, config.mode, d, n, r]);

  useLoanUrlSync(shareParams, [a, b, d, n, r]);

  const result = useMemo(() => {
    const input: CurTravelInput = {};
    switch (config.mode) {
      case "fx": {
        const amt = parsePositive(a, "Home amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const rate = parsePositive(r, "FX rate");
        if (!rate.ok) return { error: rate.error };
        input.rate = rate.value;
        break;
      }
      case "trip": {
        const daily = parsePositive(a, "Daily spend");
        if (!daily.ok) return { error: daily.error };
        input.daily = daily.value;
        const days = parsePositive(d, "Days");
        if (!days.ok) return { error: days.error };
        input.days = days.value;
        const rate = parsePositive(r, "FX rate");
        if (!rate.ok) return { error: rate.error };
        input.rate = rate.value;
        const people = parsePositive(n, "People");
        if (!people.ok) return { error: people.error };
        input.people = people.value;
        break;
      }
      case "compare": {
        const amt = parsePositive(a, "Amount");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const airport = parsePositive(r, "Airport rate");
        if (!airport.ok) return { error: airport.error };
        input.rate = airport.value;
        const bank = parsePositive(b, "Bank rate");
        if (!bank.ok) return { error: bank.error };
        input.rateB = bank.value;
        break;
      }
      case "split": {
        const total = parsePositive(a, "Total expense");
        if (!total.ok) return { error: total.error };
        input.total = total.value;
        const people = parsePositive(n, "People");
        if (!people.ok) return { error: people.error };
        input.people = people.value;
        break;
      }
      case "daily": {
        const daily = parsePositive(a, "Daily budget");
        if (!daily.ok) return { error: daily.error };
        input.daily = daily.value;
        const days = parsePositive(d, "Days");
        if (!days.ok) return { error: days.error };
        input.days = days.value;
        break;
      }
    }
    return formatResult(
      computeCurTravel(key in CONFIG ? key : "cur-travel-currency-calculator", input),
      num,
    );
  }, [a, b, config.mode, d, key, n, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "fx" ? (
            <>
              <div><FieldLabel htmlFor="cur-a">Home amount</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-r">FX rate (example)</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "trip" ? (
            <>
              <div><FieldLabel htmlFor="cur-a">Daily spend (home)</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-d">Days</FieldLabel><FieldInput id="cur-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-r">FX rate (example)</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-n">People</FieldLabel><FieldInput id="cur-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "compare" ? (
            <>
              <div><FieldLabel htmlFor="cur-a">Amount</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-r">Airport rate (example)</FieldLabel><FieldInput id="cur-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-b">Bank rate (example)</FieldLabel><FieldInput id="cur-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "split" ? (
            <>
              <div><FieldLabel htmlFor="cur-a">Total expense</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-n">People</FieldLabel><FieldInput id="cur-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "daily" ? (
            <>
              <div><FieldLabel htmlFor="cur-a">Daily budget</FieldLabel><FieldInput id="cur-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="cur-d">Days</FieldLabel><FieldInput id="cur-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
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
