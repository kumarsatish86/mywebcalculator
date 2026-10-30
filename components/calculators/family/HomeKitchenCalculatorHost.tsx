"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { HOME_URL } from "@/lib/calculators/homeHelpers";
import {
  computeHomeKitchen,
  type HomeKitchenInput,
  type HomeKitchenResult,
  type HomeKitchenSlug,
} from "@/lib/calculators/homeKitchen";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "gasUse" | "cookCost" | "inductionVsGas" | "grocery" | "foodExpense";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  hDefault: string;
  pDefault: string;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  nDefault: string;
  tDefault: string;
  qDefault: string;
};

const DISCLAIMER =
  "Daily-life planning estimate only — tariffs, taxes, and local rules vary. Verify current rates before budgeting.";

const CONFIG: Record<HomeKitchenSlug, Config> = {
  "home-gas-consumption-calculator": {
    title: "Gas consumption",
    description: `Gas kg from burner hours. ${DISCLAIMER}`,
    mode: "gasUse", hDefault: "2", pDefault: "0.15", aDefault: "80", bDefault: "", cDefault: "",
    rDefault: "", nDefault: "", tDefault: "", qDefault: "",
  },
  "home-cooking-cost-calculator": {
    title: "Cooking cost",
    description: `Fuel cost from amount × price. ${DISCLAIMER}`,
    mode: "cookCost", hDefault: "", pDefault: "85", aDefault: "5", bDefault: "", cDefault: "",
    rDefault: "", nDefault: "", tDefault: "", qDefault: "",
  },
  "home-induction-vs-gas-cost-calculator": {
    title: "Induction vs gas",
    description: `Compare induction electricity vs gas cost. ${DISCLAIMER}`,
    mode: "inductionVsGas", hDefault: "", pDefault: "90", aDefault: "2", bDefault: "0.12", cDefault: "0.5",
    rDefault: "", nDefault: "", tDefault: "", qDefault: "",
  },
  "home-grocery-budget-calculator": {
    title: "Grocery budget",
    description: `Monthly and annual from weekly spend. ${DISCLAIMER}`,
    mode: "grocery", hDefault: "", pDefault: "", aDefault: "150", bDefault: "", cDefault: "",
    rDefault: "", nDefault: "", tDefault: "", qDefault: "",
  },
  "home-monthly-food-expense-calculator": {
    title: "Monthly food expense",
    description: `Food budget from people × daily spend. ${DISCLAIMER}`,
    mode: "foodExpense", hDefault: "", pDefault: "12", aDefault: "", bDefault: "200", cDefault: "",
    rDefault: "", nDefault: "4", tDefault: "", qDefault: "",
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

function optPos(raw: string, label: string): number | undefined | { error: string } {
  if (raw.trim() === "") return undefined;
  const p = parsePositive(raw, label);
  if (!p.ok) return { error: p.error };
  return p.value;
}

function optNonNeg(raw: string, label: string): number | undefined | { error: string } {
  if (raw.trim() === "") return undefined;
  const p = parseNonNegative(raw, label);
  if (!p.ok) return { error: p.error };
  return p.value;
}

function formatResult(res: HomeKitchenResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.amount !== undefined) rows.push({ label: "Amount", value: num(res.amount, 2) });
  if (res.cost !== undefined) rows.push({ label: "Cost", value: num(res.cost, 2) });
  if (res.cheaper) rows.push({ label: "Cheaper", value: res.cheaper });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.cost !== undefined ? num(res.cost, 2)
    : res.amount !== undefined ? num(res.amount, 2)
    : res.cheaper ?? "—";
  const primaryLabel =
    res.cheaper ? "Cheaper option"
    : res.cost !== undefined ? "Cost"
    : "Amount";
  return { primary, primaryLabel, rows };
}

export function HomeKitchenCalculatorHost({ slug }: { slug: string }) {
  const key = slug as HomeKitchenSlug;
  const config = CONFIG[key] ?? CONFIG["home-gas-consumption-calculator"];
  const [h, setH] = useState(useLoanInitialInput(HOME_URL.H, config.hDefault));
  const [p, setP] = useState(useLoanInitialInput(HOME_URL.P, config.pDefault));
  const [a, setA] = useState(useLoanInitialInput(HOME_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(HOME_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(HOME_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(HOME_URL.R, config.rDefault));
  const [n, setN] = useState(useLoanInitialInput(HOME_URL.N, config.nDefault));
  const [t, setT] = useState(useLoanInitialInput(HOME_URL.T, config.tDefault));
  const [q, setQ] = useState(useLoanInitialInput(HOME_URL.Q, config.qDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "gasUse":
        put(HOME_URL.H, h); put(HOME_URL.P, p); put(HOME_URL.A, a);
        break;
      case "cookCost":
        put(HOME_URL.A, a); put(HOME_URL.P, p);
        break;
      case "inductionVsGas":
        put(HOME_URL.A, a); put(HOME_URL.B, b); put(HOME_URL.C, c); put(HOME_URL.P, p);
        break;
      case "grocery":
        put(HOME_URL.A, a);
        break;
      case "foodExpense":
        put(HOME_URL.N, n); put(HOME_URL.P, p); put(HOME_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, config.mode, h, n, p]);

  useLoanUrlSync(shareParams, [a, b, c, h, n, p, q, r, t]);

  const result = useMemo(() => {
    const input: HomeKitchenInput = {};
    switch (config.mode) {
      case "gasUse": {
        const hrs = parsePositive(h, "Burner hours");
        if (!hrs.ok) return { error: hrs.error };
        input.hours = hrs.value;
        const rate = optPos(p, "kg/hour");
        if (rate && typeof rate === "object") return { error: rate.error };
        if (typeof rate === "number") input.kgPerHour = rate;
        const price = optNonNeg(a, "Price/kg");
        if (price && typeof price === "object") return { error: price.error };
        if (typeof price === "number") input.pricePerKg = price;
        break;
      }
      case "cookCost": {
        const kg = parsePositive(a, "Fuel amount");
        if (!kg.ok) return { error: kg.error };
        input.gasKg = kg.value;
        const price = parsePositive(p, "Price/unit");
        if (!price.ok) return { error: price.error };
        input.pricePerKg = price.value;
        break;
      }
      case "inductionVsGas": {
        const ikwh = parsePositive(a, "Induction kWh");
        if (!ikwh.ok) return { error: ikwh.error };
        input.inductionKwh = ikwh.value;
        const er = parsePositive(b, "Electricity rate");
        if (!er.ok) return { error: er.error };
        input.elecRate = er.value;
        const gkg = parsePositive(c, "Gas kg");
        if (!gkg.ok) return { error: gkg.error };
        input.gasKg = gkg.value;
        const gp = parsePositive(p, "Gas price/kg");
        if (!gp.ok) return { error: gp.error };
        input.pricePerKg = gp.value;
        break;
      }
      case "grocery": {
        const weekly = parsePositive(a, "Weekly grocery");
        if (!weekly.ok) return { error: weekly.error };
        input.groceryWeekly = weekly.value;
        break;
      }
      case "foodExpense": {
        const people = optPos(n, "People");
        if (people && typeof people === "object") return { error: people.error };
        if (typeof people === "number") input.people = people;
        const daily = parsePositive(p, "Per-person daily food");
        if (!daily.ok) return { error: daily.error };
        input.perPersonDaily = daily.value;
        const out = optNonNeg(b, "Eating out/month");
        if (out && typeof out === "object") return { error: out.error };
        if (typeof out === "number") input.mealsOut = out;
        break;
      }
    }
    return formatResult(
      computeHomeKitchen(key in CONFIG ? key : "home-gas-consumption-calculator", input),
      num,
    );
  }, [a, b, c, config.mode, h, key, n, p]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "gasUse" ? (
            <>
              <div><FieldLabel htmlFor="hk-h">Burner hours</FieldLabel><FieldInput id="hk-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hk-p">kg per hour</FieldLabel><FieldInput id="hk-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hk-a">Price per kg (optional)</FieldLabel><FieldInput id="hk-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "cookCost" ? (
            <>
              <div><FieldLabel htmlFor="hk-a">Fuel amount</FieldLabel><FieldInput id="hk-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hk-p">Price per unit</FieldLabel><FieldInput id="hk-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "inductionVsGas" ? (
            <>
              <div><FieldLabel htmlFor="hk-a">Induction kWh</FieldLabel><FieldInput id="hk-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hk-b">Electricity rate</FieldLabel><FieldInput id="hk-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hk-c">Gas kg</FieldLabel><FieldInput id="hk-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hk-p">Gas price/kg</FieldLabel><FieldInput id="hk-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "grocery" ? (
            <div><FieldLabel htmlFor="hk-a">Weekly grocery spend</FieldLabel><FieldInput id="hk-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "foodExpense" ? (
            <>
              <div><FieldLabel htmlFor="hk-n">People</FieldLabel><FieldInput id="hk-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hk-p">Per-person daily food</FieldLabel><FieldInput id="hk-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hk-b">Eating out per month (optional)</FieldLabel><FieldInput id="hk-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
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
