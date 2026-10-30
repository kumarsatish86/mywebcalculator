"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { HOME_URL } from "@/lib/calculators/homeHelpers";
import {
  computeHomeBills,
  type HomeBillsInput,
  type HomeBillsResult,
  type HomeBillsSlug,
} from "@/lib/calculators/homeBills";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "sum" | "budget" | "ott" | "fee" | "gas" | "lpg";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  dDefault: string;
  rDefault: string;
  nDefault: string;
  pDefault: string;
  tDefault: string;
  qDefault: string;
};

const DISCLAIMER =
  "Daily-life planning estimate only — tariffs, taxes, and local rules vary. Verify current rates before budgeting.";

const CONFIG: Record<HomeBillsSlug, Config> = {
  "home-monthly-expense-calculator": {
    title: "Monthly expenses",
    description: `Sum of expense categories. ${DISCLAIMER}`,
    mode: "sum", aDefault: "1200", bDefault: "400", cDefault: "150", dDefault: "80",
    rDefault: "", nDefault: "", pDefault: "", tDefault: "", qDefault: "",
  },
  "home-household-budget-calculator": {
    title: "Household budget",
    description: `Remaining budget after expenses. ${DISCLAIMER}`,
    mode: "budget", aDefault: "800", bDefault: "300", cDefault: "200", dDefault: "100",
    rDefault: "5000", nDefault: "", pDefault: "", tDefault: "", qDefault: "",
  },
  "home-cost-of-living-calculator": {
    title: "Cost of living",
    description: `Total monthly living costs. ${DISCLAIMER}`,
    mode: "sum", aDefault: "1500", bDefault: "500", cDefault: "250", dDefault: "120",
    rDefault: "", nDefault: "", pDefault: "", tDefault: "", qDefault: "",
  },
  "home-ott-subscription-cost-calculator": {
    title: "OTT subscriptions",
    description: `Streaming cost from count × price. ${DISCLAIMER}`,
    mode: "ott", aDefault: "15", bDefault: "", cDefault: "", dDefault: "",
    rDefault: "", nDefault: "3", pDefault: "", tDefault: "", qDefault: "",
  },
  "home-internet-bill-calculator": {
    title: "Internet bill",
    description: `Monthly or multi-month internet cost. ${DISCLAIMER}`,
    mode: "fee", aDefault: "60", bDefault: "", cDefault: "", dDefault: "",
    rDefault: "", nDefault: "12", pDefault: "", tDefault: "", qDefault: "",
  },
  "home-mobile-recharge-cost-calculator": {
    title: "Mobile recharge",
    description: `Recharge cost over multiple months. ${DISCLAIMER}`,
    mode: "fee", aDefault: "25", bDefault: "", cDefault: "", dDefault: "",
    rDefault: "", nDefault: "12", pDefault: "", tDefault: "", qDefault: "",
  },
  "home-gas-bill-calculator": {
    title: "Gas bill",
    description: `Gas bill from usage × rate. ${DISCLAIMER}`,
    mode: "gas", aDefault: "45", bDefault: "1.2", cDefault: "", dDefault: "",
    rDefault: "", nDefault: "", pDefault: "", tDefault: "", qDefault: "",
  },
  "home-lpg-usage-calculator": {
    title: "LPG usage",
    description: `Cylinders per month from usage pattern. ${DISCLAIMER}`,
    mode: "lpg", aDefault: "900", bDefault: "", cDefault: "", dDefault: "",
    rDefault: "", nDefault: "1", pDefault: "30", tDefault: "", qDefault: "",
  },
  "home-garbage-utility-fee-calculator": {
    title: "Garbage utility fee",
    description: `Waste collection fee over periods. ${DISCLAIMER}`,
    mode: "fee", aDefault: "20", bDefault: "", cDefault: "", dDefault: "",
    rDefault: "", nDefault: "12", pDefault: "", tDefault: "", qDefault: "",
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

function formatResult(res: HomeBillsResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.total !== undefined) rows.push({ label: "Total", value: num(res.total, 0) });
  if (res.remaining !== undefined) rows.push({ label: "Remaining", value: num(res.remaining, 0) });
  if (res.perMonth !== undefined) rows.push({ label: "Per month", value: num(res.perMonth, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.remaining !== undefined ? num(res.remaining, 0)
    : res.perMonth !== undefined ? num(res.perMonth, 2)
    : res.total !== undefined ? num(res.total, 0)
    : "—";
  const primaryLabel =
    res.remaining !== undefined ? "Remaining"
    : res.perMonth !== undefined ? "Per month"
    : "Total";
  return { primary, primaryLabel, rows };
}

export function HomeBillsCalculatorHost({ slug }: { slug: string }) {
  const key = slug as HomeBillsSlug;
  const config = CONFIG[key] ?? CONFIG["home-monthly-expense-calculator"];
  const [a, setA] = useState(useLoanInitialInput(HOME_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(HOME_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(HOME_URL.C, config.cDefault));
  const [d, setD] = useState(useLoanInitialInput(HOME_URL.D, config.dDefault));
  const [r, setR] = useState(useLoanInitialInput(HOME_URL.R, config.rDefault));
  const [n, setN] = useState(useLoanInitialInput(HOME_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(HOME_URL.P, config.pDefault));
  const [t, setT] = useState(useLoanInitialInput(HOME_URL.T, config.tDefault));
  const [q, setQ] = useState(useLoanInitialInput(HOME_URL.Q, config.qDefault));

  const num = (nVal: number, dec = 0) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "sum":
        put(HOME_URL.A, a); put(HOME_URL.B, b); put(HOME_URL.C, c); put(HOME_URL.D, d);
        break;
      case "budget":
        put(HOME_URL.R, r); put(HOME_URL.A, a); put(HOME_URL.B, b); put(HOME_URL.C, c); put(HOME_URL.D, d);
        break;
      case "ott":
        put(HOME_URL.N, n); put(HOME_URL.A, a);
        break;
      case "fee":
        put(HOME_URL.A, a); put(HOME_URL.N, n);
        break;
      case "gas":
        put(HOME_URL.A, a); put(HOME_URL.B, b);
        break;
      case "lpg":
        put(HOME_URL.N, n); put(HOME_URL.P, p); put(HOME_URL.A, a);
        break;
    }
    return out;
  }, [a, b, c, config.mode, d, n, p, r]);

  useLoanUrlSync(shareParams, [a, b, c, d, n, p, q, r, t]);

  const result = useMemo(() => {
    const input: HomeBillsInput = {};
    switch (config.mode) {
      case "sum":
      case "budget": {
        const va = optNonNeg(a, "Expense A");
        if (va && typeof va === "object") return { error: va.error };
        if (typeof va === "number") input.a = va;
        const vb = optNonNeg(b, "Expense B");
        if (vb && typeof vb === "object") return { error: vb.error };
        if (typeof vb === "number") input.b = vb;
        const vc = optNonNeg(c, "Expense C");
        if (vc && typeof vc === "object") return { error: vc.error };
        if (typeof vc === "number") input.c = vc;
        const vd = optNonNeg(d, "Expense D");
        if (vd && typeof vd === "object") return { error: vd.error };
        if (typeof vd === "number") input.d = vd;
        if (config.mode === "budget") {
          const income = parsePositive(r, "Income");
          if (!income.ok) return { error: income.error };
          input.income = income.value;
        }
        break;
      }
      case "ott": {
        const count = parsePositive(n, "Subscriptions");
        if (!count.ok) return { error: count.error };
        input.count = count.value;
        const price = parsePositive(a, "Price each");
        if (!price.ok) return { error: price.error };
        input.priceEach = price.value;
        break;
      }
      case "fee": {
        const fee = parsePositive(a, "Bill/fee");
        if (!fee.ok) return { error: fee.error };
        input.fee = fee.value;
        const months = optNonNeg(n, "Months");
        if (months && typeof months === "object") return { error: months.error };
        if (typeof months === "number") input.count = months;
        break;
      }
      case "gas": {
        const units = parsePositive(a, "Usage");
        if (!units.ok) return { error: units.error };
        input.a = units.value;
        const rate = parsePositive(b, "Rate");
        if (!rate.ok) return { error: rate.error };
        input.b = rate.value;
        break;
      }
      case "lpg": {
        const cyl = optNonNeg(n, "Cylinders");
        if (cyl && typeof cyl === "object") return { error: cyl.error };
        if (typeof cyl === "number") input.cylinders = cyl;
        const days = optNonNeg(p, "Days per cylinder");
        if (days && typeof days === "object") return { error: days.error };
        if (typeof days === "number") input.daysPerCylinder = days;
        const price = optNonNeg(a, "Price per cylinder");
        if (price && typeof price === "object") return { error: price.error };
        if (typeof price === "number") input.pricePerCylinder = price;
        break;
      }
    }
    return formatResult(
      computeHomeBills(key in CONFIG ? key : "home-monthly-expense-calculator", input),
      num,
    );
  }, [a, b, c, config.mode, d, key, n, p, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "sum" || config.mode === "budget" ? (
            <>
              {config.mode === "budget" ? (
                <div><FieldLabel htmlFor="hb-r">Income</FieldLabel><FieldInput id="hb-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              ) : null}
              <div><FieldLabel htmlFor="hb-a">Expense A</FieldLabel><FieldInput id="hb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hb-b">Expense B</FieldLabel><FieldInput id="hb-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hb-c">Expense C</FieldLabel><FieldInput id="hb-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hb-d">Expense D</FieldLabel><FieldInput id="hb-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "ott" ? (
            <>
              <div><FieldLabel htmlFor="hb-n">Subscriptions</FieldLabel><FieldInput id="hb-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hb-a">Price each</FieldLabel><FieldInput id="hb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "fee" ? (
            <>
              <div><FieldLabel htmlFor="hb-a">Bill/fee amount</FieldLabel><FieldInput id="hb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hb-n">Months (optional)</FieldLabel><FieldInput id="hb-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "gas" ? (
            <>
              <div><FieldLabel htmlFor="hb-a">Usage</FieldLabel><FieldInput id="hb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hb-b">Rate</FieldLabel><FieldInput id="hb-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "lpg" ? (
            <>
              <div><FieldLabel htmlFor="hb-n">Cylinders</FieldLabel><FieldInput id="hb-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hb-p">Days per cylinder</FieldLabel><FieldInput id="hb-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hb-a">Price per cylinder (optional)</FieldLabel><FieldInput id="hb-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
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
