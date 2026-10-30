"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { TRAVEL_URL } from "@/lib/calculators/travelHelpers";
import {
  computeTravelMoney,
  type TravelMoneyInput,
  type TravelMoneyResult,
  type TravelMoneySlug,
} from "@/lib/calculators/travelMoney";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "fx" | "atm" | "tip" | "ppp" | "meals" | "split" | "inclusive";

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

const CONFIG: Record<TravelMoneySlug, Config> = {
  "travel-currency-exchange-budget-calculator": {
    title: "Currency exchange budget",
    description: `Local budget from home amount × FX rate. ${DISCLAIMER}`,
    mode: "fx",
    ...EMPTY, aDefault: "1000", rDefault: "0.92",
  },
  "travel-atm-fee-adjusted-rate-calculator": {
    title: "ATM fee-adjusted rate",
    description: `Withdrawal after % and fixed ATM fees. ${DISCLAIMER}`,
    mode: "atm",
    ...EMPTY, aDefault: "200", rDefault: "1.1", pDefault: "2", cDefault: "3",
  },
  "travel-tipping-abroad-calculator": {
    title: "Tipping abroad",
    description: `Tip and total from bill and tip %. ${DISCLAIMER}`,
    mode: "tip",
    ...EMPTY, aDefault: "45", pDefault: "10",
  },
  "travel-purchasing-power-comparison-calculator": {
    title: "Purchasing power",
    description: `PPP ratio from home vs abroad basket price. ${DISCLAIMER}`,
    mode: "ppp",
    ...EMPTY, aDefault: "4", bDefault: "2.50",
  },
  "travel-meal-per-diem-calculator": {
    title: "Meal per diem",
    description: `Meal budget = daily × days × people. ${DISCLAIMER}`,
    mode: "meals",
    ...EMPTY, aDefault: "55", dDefault: "7", nDefault: "2",
  },
  "travel-restaurant-bill-split-travel-calculator": {
    title: "Restaurant bill split",
    description: `Equal split of bill with tip. ${DISCLAIMER}`,
    mode: "split",
    ...EMPTY, aDefault: "120", pDefault: "15", nDefault: "3",
  },
  "travel-all-inclusive-value-calculator": {
    title: "All-inclusive value",
    description: `Compare all-inclusive cost vs meal value. ${DISCLAIMER}`,
    mode: "inclusive",
    ...EMPTY, aDefault: "900", bDefault: "700",
  },
  "travel-street-food-budget-calculator": {
    title: "Street food budget",
    description: `Street-food spend over the trip. ${DISCLAIMER}`,
    mode: "meals",
    ...EMPTY, aDefault: "20", dDefault: "10", nDefault: "1",
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

function optPos(raw: string, label: string): number | undefined | { error: string } {
  if (raw.trim() === "") return undefined;
  const p = parsePositive(raw, label);
  if (!p.ok) return { error: p.error };
  return p.value;
}

function formatResult(res: TravelMoneyResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.converted !== undefined) rows.push({ label: "Converted", value: num(res.converted, 2) });
  if (res.effectiveRate !== undefined) rows.push({ label: "Effective rate", value: num(res.effectiveRate, 4) });
  if (res.tip !== undefined) rows.push({ label: "Tip", value: num(res.tip, 2) });
  if (res.total !== undefined) rows.push({ label: "Total", value: num(res.total, 2) });
  if (res.perPerson !== undefined) rows.push({ label: "Per person", value: num(res.perPerson, 2) });
  if (res.pppRatio !== undefined) rows.push({ label: "PPP ratio", value: num(res.pppRatio, 3) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.pppRatio !== undefined ? num(res.pppRatio, 3)
    : res.converted !== undefined ? num(res.converted, 2)
    : res.perPerson !== undefined ? num(res.perPerson, 2)
    : res.total !== undefined ? num(res.total, 2)
    : res.tip !== undefined ? num(res.tip, 2)
    : "—";
  const primaryLabel =
    res.pppRatio !== undefined ? "PPP ratio"
    : res.converted !== undefined ? "Converted"
    : res.perPerson !== undefined ? "Per person"
    : "Total";
  return { primary, primaryLabel, rows };
}

export function TravelMoneyCalculatorHost({ slug }: { slug: string }) {
  const key = slug as TravelMoneySlug;
  const config = CONFIG[key] ?? CONFIG["travel-currency-exchange-budget-calculator"];
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
      case "fx":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.R, r);
        break;
      case "atm":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.R, r); put(TRAVEL_URL.P, p); put(TRAVEL_URL.C, c);
        break;
      case "tip":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.P, p);
        break;
      case "ppp":
      case "inclusive":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.B, b);
        break;
      case "meals":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.D, d); put(TRAVEL_URL.N, n);
        break;
      case "split":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.P, p); put(TRAVEL_URL.N, n);
        break;
    }
    return out;
  }, [a, b, c, config.mode, d, n, p, r]);

  useLoanUrlSync(shareParams, [a, b, c, d, h, l, m, n, p, q, r, s, t, v, w]);

  const result = useMemo(() => {
    const input: TravelMoneyInput = {};
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
      case "atm": {
        const amt = parsePositive(a, "Withdraw");
        if (!amt.ok) return { error: amt.error };
        input.amount = amt.value;
        const rate = parsePositive(r, "Mid-market rate");
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
      case "tip": {
        const bill = parsePositive(a, "Bill");
        if (!bill.ok) return { error: bill.error };
        input.bill = bill.value;
        const tipPct = optNonNeg(p, "Tip %");
        if (tipPct && typeof tipPct === "object") return { error: tipPct.error };
        if (typeof tipPct === "number") input.tipPct = tipPct;
        break;
      }
      case "ppp": {
        const home = parsePositive(a, "Home price");
        if (!home.ok) return { error: home.error };
        input.priceHome = home.value;
        const abroad = parsePositive(b, "Abroad price");
        if (!abroad.ok) return { error: abroad.error };
        input.priceAbroad = abroad.value;
        break;
      }
      case "meals": {
        const daily = parsePositive(a, "Daily meal budget");
        if (!daily.ok) return { error: daily.error };
        input.perDiem = daily.value;
        input.dailyStreet = daily.value;
        const days = optPos(d, "Days");
        if (days && typeof days === "object") return { error: days.error };
        if (typeof days === "number") input.days = days;
        const people = optPos(n, "People");
        if (people && typeof people === "object") return { error: people.error };
        if (typeof people === "number") input.people = people;
        break;
      }
      case "split": {
        const bill = parsePositive(a, "Bill");
        if (!bill.ok) return { error: bill.error };
        input.bill = bill.value;
        const tipPct = optNonNeg(p, "Tip %");
        if (tipPct && typeof tipPct === "object") return { error: tipPct.error };
        if (typeof tipPct === "number") input.tipPct = tipPct;
        const people = optPos(n, "People");
        if (people && typeof people === "object") return { error: people.error };
        if (typeof people === "number") input.people = people;
        break;
      }
      case "inclusive": {
        const incl = parsePositive(a, "All-inclusive cost");
        if (!incl.ok) return { error: incl.error };
        input.inclusiveCost = incl.value;
        const meals = parsePositive(b, "Estimated meal value");
        if (!meals.ok) return { error: meals.error };
        input.mealsValue = meals.value;
        break;
      }
    }
    return formatResult(
      computeTravelMoney(key in CONFIG ? key : "travel-currency-exchange-budget-calculator", input),
      num,
    );
  }, [a, b, c, config.mode, d, key, n, p, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "fx" ? (
            <>
              <div><FieldLabel htmlFor="tm-a">Home amount</FieldLabel><FieldInput id="tm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tm-r">FX rate</FieldLabel><FieldInput id="tm-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "atm" ? (
            <>
              <div><FieldLabel htmlFor="tm-a">Withdraw amount</FieldLabel><FieldInput id="tm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tm-r">Mid-market rate</FieldLabel><FieldInput id="tm-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tm-p">Fee %</FieldLabel><FieldInput id="tm-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tm-c">Fixed fee</FieldLabel><FieldInput id="tm-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "tip" ? (
            <>
              <div><FieldLabel htmlFor="tm-a">Bill</FieldLabel><FieldInput id="tm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tm-p">Tip %</FieldLabel><FieldInput id="tm-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "ppp" ? (
            <>
              <div><FieldLabel htmlFor="tm-a">Home price</FieldLabel><FieldInput id="tm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tm-b">Abroad price</FieldLabel><FieldInput id="tm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "meals" ? (
            <>
              <div><FieldLabel htmlFor="tm-a">Daily meal budget</FieldLabel><FieldInput id="tm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tm-d">Days</FieldLabel><FieldInput id="tm-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tm-n">People</FieldLabel><FieldInput id="tm-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "split" ? (
            <>
              <div><FieldLabel htmlFor="tm-a">Bill</FieldLabel><FieldInput id="tm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tm-p">Tip %</FieldLabel><FieldInput id="tm-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tm-n">People</FieldLabel><FieldInput id="tm-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "inclusive" ? (
            <>
              <div><FieldLabel htmlFor="tm-a">All-inclusive cost</FieldLabel><FieldInput id="tm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tm-b">Estimated meal value</FieldLabel><FieldInput id="tm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
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
