"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { HOME_URL } from "@/lib/calculators/homeHelpers";
import {
  computeHomeBonus,
  type HomeBonusInput,
  type HomeBonusResult,
  type HomeBonusSlug,
} from "@/lib/calculators/homeBonus";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "split" | "appliance" | "peak" | "dailyMonthly" | "cityCompare" | "rentUtil";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  nDefault: string;
  pDefault: string;
  qDefault: string;
  mDefault: string;
};

const DISCLAIMER =
  "Daily-life planning estimate only — tariffs, taxes, and local rules vary. Verify current rates before budgeting.";

const CONFIG: Record<HomeBonusSlug, Config> = {
  "home-electricity-bill-split-roommates-calculator": {
    title: "Bill split (roommates)",
    description: `Equal electricity bill split. ${DISCLAIMER}`,
    mode: "split", aDefault: "120", bDefault: "", cDefault: "", rDefault: "", tDefault: "",
    nDefault: "3", pDefault: "", qDefault: "", mDefault: "",
  },
  "home-cost-per-appliance-usage-calculator": {
    title: "Appliance usage cost",
    description: `Single-use cost from W×h×rate. ${DISCLAIMER}`,
    mode: "appliance", aDefault: "1500", bDefault: "2", cDefault: "", rDefault: "0.12", tDefault: "",
    nDefault: "", pDefault: "", qDefault: "", mDefault: "",
  },
  "home-peak-hour-electricity-cost-calculator": {
    title: "Peak-hour electricity",
    description: `Time-of-use cost from peak/off-peak. ${DISCLAIMER}`,
    mode: "peak", aDefault: "150", bDefault: "0.18", cDefault: "200", rDefault: "0.10", tDefault: "",
    nDefault: "", pDefault: "", qDefault: "", mDefault: "",
  },
  "home-daily-vs-monthly-utility-analyzer": {
    title: "Daily vs monthly utility",
    description: `Scale daily cost to monthly/annual. ${DISCLAIMER}`,
    mode: "dailyMonthly", aDefault: "4.5", bDefault: "", cDefault: "", rDefault: "", tDefault: "",
    nDefault: "", pDefault: "", qDefault: "", mDefault: "",
  },
  "home-utility-comparison-city-wise-calculator": {
    title: "City utility comparison",
    description: `Compare bills between two cities. ${DISCLAIMER}`,
    mode: "cityCompare", aDefault: "85", bDefault: "110", cDefault: "", rDefault: "", tDefault: "",
    nDefault: "", pDefault: "", qDefault: "", mDefault: "",
  },
  "home-rent-plus-utility-combined-calculator": {
    title: "Rent + utilities",
    description: `Combined housing cash outflow. ${DISCLAIMER}`,
    mode: "rentUtil", aDefault: "1500", bDefault: "250", cDefault: "", rDefault: "", tDefault: "",
    nDefault: "", pDefault: "", qDefault: "", mDefault: "",
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

function formatResult(res: HomeBonusResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.perPerson !== undefined) rows.push({ label: "Per person", value: num(res.perPerson, 2) });
  if (res.cost !== undefined) rows.push({ label: "Cost", value: num(res.cost, 2) });
  if (res.monthly !== undefined) rows.push({ label: "Monthly", value: num(res.monthly, 2) });
  if (res.total !== undefined) rows.push({ label: "Total", value: num(res.total, 2) });
  if (res.cheaperCity) rows.push({ label: "Cheaper city", value: res.cheaperCity });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.perPerson !== undefined ? num(res.perPerson, 2)
    : res.total !== undefined ? num(res.total, 2)
    : res.monthly !== undefined ? num(res.monthly, 2)
    : res.cost !== undefined ? num(res.cost, 2)
    : res.cheaperCity ?? "—";
  const primaryLabel =
    res.perPerson !== undefined ? "Per person"
    : res.cheaperCity ? "Cheaper city"
    : res.monthly !== undefined ? "Monthly"
    : res.total !== undefined ? "Total"
    : "Cost";
  return { primary, primaryLabel, rows };
}

export function HomeBonusCalculatorHost({ slug }: { slug: string }) {
  const key = slug as HomeBonusSlug;
  const config = CONFIG[key] ?? CONFIG["home-electricity-bill-split-roommates-calculator"];
  const [a, setA] = useState(useLoanInitialInput(HOME_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(HOME_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(HOME_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(HOME_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(HOME_URL.T, config.tDefault));
  const [n, setN] = useState(useLoanInitialInput(HOME_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(HOME_URL.P, config.pDefault));
  const [q, setQ] = useState(useLoanInitialInput(HOME_URL.Q, config.qDefault));
  const [m, setM] = useState(useLoanInitialInput(HOME_URL.M, config.mDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "split":
        put(HOME_URL.A, a); put(HOME_URL.N, n);
        break;
      case "appliance":
        put(HOME_URL.A, a); put(HOME_URL.B, b); put(HOME_URL.R, r);
        break;
      case "peak":
        put(HOME_URL.A, a); put(HOME_URL.B, b); put(HOME_URL.C, c); put(HOME_URL.R, r);
        break;
      case "dailyMonthly":
        put(HOME_URL.A, a);
        break;
      case "cityCompare":
        put(HOME_URL.A, a); put(HOME_URL.B, b);
        break;
      case "rentUtil":
        put(HOME_URL.A, a); put(HOME_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, config.mode, n, r]);

  useLoanUrlSync(shareParams, [a, b, c, m, n, p, q, r, t]);

  const result = useMemo(() => {
    const input: HomeBonusInput = {};
    switch (config.mode) {
      case "split": {
        const bill = parsePositive(a, "Bill");
        if (!bill.ok) return { error: bill.error };
        input.bill = bill.value;
        const roommates = optPos(n, "Roommates");
        if (roommates && typeof roommates === "object") return { error: roommates.error };
        if (typeof roommates === "number") input.roommates = roommates;
        break;
      }
      case "appliance": {
        const watts = parsePositive(a, "Watts");
        if (!watts.ok) return { error: watts.error };
        input.watts = watts.value;
        const hrs = parsePositive(b, "Hours");
        if (!hrs.ok) return { error: hrs.error };
        input.hours = hrs.value;
        const rate = parsePositive(r, "Rate/kWh");
        if (!rate.ok) return { error: rate.error };
        input.ratePerKwh = rate.value;
        break;
      }
      case "peak": {
        const pk = parsePositive(a, "Peak kWh");
        if (!pk.ok) return { error: pk.error };
        input.peakKwh = pk.value;
        const pr = parsePositive(b, "Peak rate");
        if (!pr.ok) return { error: pr.error };
        input.peakRate = pr.value;
        const okWh = optNonNeg(c, "Off-peak kWh");
        if (okWh && typeof okWh === "object") return { error: okWh.error };
        if (typeof okWh === "number") input.offKwh = okWh;
        const or = optNonNeg(r, "Off-peak rate");
        if (or && typeof or === "object") return { error: or.error };
        if (typeof or === "number") input.offRate = or;
        break;
      }
      case "dailyMonthly": {
        const daily = parsePositive(a, "Daily cost");
        if (!daily.ok) return { error: daily.error };
        input.dailyCost = daily.value;
        break;
      }
      case "cityCompare": {
        const cityA = parsePositive(a, "City A bill");
        if (!cityA.ok) return { error: cityA.error };
        input.cityA = cityA.value;
        const cityB = parsePositive(b, "City B bill");
        if (!cityB.ok) return { error: cityB.error };
        input.cityB = cityB.value;
        break;
      }
      case "rentUtil": {
        const rent = parsePositive(a, "Rent");
        if (!rent.ok) return { error: rent.error };
        input.rent = rent.value;
        const util = optNonNeg(b, "Utilities");
        if (util && typeof util === "object") return { error: util.error };
        if (typeof util === "number") input.utilities = util;
        break;
      }
    }
    return formatResult(
      computeHomeBonus(key in CONFIG ? key : "home-electricity-bill-split-roommates-calculator", input),
      num,
    );
  }, [a, b, c, config.mode, key, n, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "split" ? (
            <>
              <div><FieldLabel htmlFor="hbn-a">Bill amount</FieldLabel><FieldInput id="hbn-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hbn-n">Roommates</FieldLabel><FieldInput id="hbn-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "appliance" ? (
            <>
              <div><FieldLabel htmlFor="hbn-a">Watts</FieldLabel><FieldInput id="hbn-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hbn-b">Hours</FieldLabel><FieldInput id="hbn-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hbn-r">Rate per kWh</FieldLabel><FieldInput id="hbn-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "peak" ? (
            <>
              <div><FieldLabel htmlFor="hbn-a">Peak kWh</FieldLabel><FieldInput id="hbn-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hbn-b">Peak rate</FieldLabel><FieldInput id="hbn-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hbn-c">Off-peak kWh</FieldLabel><FieldInput id="hbn-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hbn-r">Off-peak rate</FieldLabel><FieldInput id="hbn-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "dailyMonthly" ? (
            <div><FieldLabel htmlFor="hbn-a">Daily cost</FieldLabel><FieldInput id="hbn-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "cityCompare" ? (
            <>
              <div><FieldLabel htmlFor="hbn-a">City A bill</FieldLabel><FieldInput id="hbn-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hbn-b">City B bill</FieldLabel><FieldInput id="hbn-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "rentUtil" ? (
            <>
              <div><FieldLabel htmlFor="hbn-a">Rent</FieldLabel><FieldInput id="hbn-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hbn-b">Utilities</FieldLabel><FieldInput id="hbn-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
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
