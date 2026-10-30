"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { TRAVEL_URL } from "@/lib/calculators/travelHelpers";
import {
  computeTravelTrip,
  type TravelTripInput,
  type TravelTripResult,
  type TravelTripSlug,
} from "@/lib/calculators/travelTrip";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode =
  | "categories"
  | "daily"
  | "multiCity"
  | "contingency"
  | "duration"
  | "cruise"
  | "peakOff"
  | "surcharge";

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

const CONFIG: Record<TravelTripSlug, Config> = {
  "travel-trip-budget-calculator": {
    title: "Trip budget",
    description: `Roll up lodging, food, transport, and activities. ${DISCLAIMER}`,
    mode: "categories",
    ...EMPTY, aDefault: "600", bDefault: "300", cDefault: "200", rDefault: "150", nDefault: "2",
  },
  "travel-daily-travel-budget-calculator": {
    title: "Daily travel budget",
    description: `Total from daily spend × days × people. ${DISCLAIMER}`,
    mode: "daily",
    ...EMPTY, aDefault: "80", dDefault: "7", nDefault: "2",
  },
  "travel-multi-city-cost-estimator": {
    title: "Multi-city cost",
    description: `Sum of per-city leg budgets. ${DISCLAIMER}`,
    mode: "multiCity",
    ...EMPTY, aDefault: "400", bDefault: "350", cDefault: "500",
  },
  "travel-contingency-fund-calculator": {
    title: "Contingency fund",
    description: `Buffer from base budget and contingency %. ${DISCLAIMER}`,
    mode: "contingency",
    ...EMPTY, aDefault: "2000", pDefault: "10",
  },
  "travel-trip-duration-cost-calculator": {
    title: "Trip duration cost",
    description: `Total from cost/day × days. ${DISCLAIMER}`,
    mode: "duration",
    ...EMPTY, aDefault: "120", dDefault: "10",
  },
  "travel-family-vacation-budget-calculator": {
    title: "Family vacation budget",
    description: `Family trip total from category costs. ${DISCLAIMER}`,
    mode: "categories",
    ...EMPTY, aDefault: "1200", bDefault: "600", cDefault: "400", rDefault: "300", nDefault: "4",
  },
  "travel-cruise-package-comparison-calculator": {
    title: "Cruise package comparison",
    description: `Compare two cruise package prices. ${DISCLAIMER}`,
    mode: "cruise",
    ...EMPTY, aDefault: "1800", bDefault: "1650",
  },
  "travel-peak-vs-off-season-savings-calculator": {
    title: "Peak vs off-season",
    description: `Savings from traveling off-season. ${DISCLAIMER}`,
    mode: "peakOff",
    ...EMPTY, aDefault: "2500", bDefault: "1800",
  },
  "travel-holiday-surcharge-estimator": {
    title: "Holiday surcharge",
    description: `Holiday premium on a base trip cost. ${DISCLAIMER}`,
    mode: "surcharge",
    ...EMPTY, aDefault: "1500", pDefault: "15",
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

function formatResult(res: TravelTripResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.total !== undefined) rows.push({ label: "Total", value: num(res.total, 2) });
  if (res.perDay !== undefined) rows.push({ label: "Per day", value: num(res.perDay, 2) });
  if (res.perPerson !== undefined) rows.push({ label: "Per person", value: num(res.perPerson, 2) });
  if (res.buffer !== undefined) rows.push({ label: "Buffer / surcharge", value: num(res.buffer, 2) });
  if (res.savings !== undefined) rows.push({ label: "Savings", value: num(res.savings, 2) });
  if (res.cheaper !== undefined) rows.push({ label: "Cheaper", value: res.cheaper });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.savings !== undefined ? num(res.savings, 2)
    : res.total !== undefined ? num(res.total, 2)
    : res.buffer !== undefined ? num(res.buffer, 2)
    : res.perPerson !== undefined ? num(res.perPerson, 2)
    : "—";
  const primaryLabel =
    res.savings !== undefined ? "Savings"
    : res.cheaper !== undefined ? "Cheaper option"
    : res.buffer !== undefined && res.total === undefined ? "Buffer"
    : "Total";
  return { primary, primaryLabel, rows };
}

export function TravelTripCalculatorHost({ slug }: { slug: string }) {
  const key = slug as TravelTripSlug;
  const config = CONFIG[key] ?? CONFIG["travel-trip-budget-calculator"];
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
      case "categories":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.B, b); put(TRAVEL_URL.C, c); put(TRAVEL_URL.R, r); put(TRAVEL_URL.N, n);
        break;
      case "daily":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.D, d); put(TRAVEL_URL.N, n);
        break;
      case "multiCity":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.B, b); put(TRAVEL_URL.C, c);
        break;
      case "contingency":
      case "surcharge":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.P, p);
        break;
      case "duration":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.D, d);
        break;
      case "cruise":
      case "peakOff":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, config.mode, d, n, p, r]);

  useLoanUrlSync(shareParams, [a, b, c, d, h, l, m, n, p, q, r, s, t, v, w]);

  const result = useMemo(() => {
    const input: TravelTripInput = {};
    switch (config.mode) {
      case "categories": {
        const lodging = optNonNeg(a, "Lodging");
        if (lodging && typeof lodging === "object") return { error: lodging.error };
        if (typeof lodging === "number") input.lodging = lodging;
        const food = optNonNeg(b, "Food");
        if (food && typeof food === "object") return { error: food.error };
        if (typeof food === "number") input.food = food;
        const transport = optNonNeg(c, "Transport");
        if (transport && typeof transport === "object") return { error: transport.error };
        if (typeof transport === "number") input.transport = transport;
        const activities = optNonNeg(r, "Activities");
        if (activities && typeof activities === "object") return { error: activities.error };
        if (typeof activities === "number") input.activities = activities;
        const people = optPos(n, "People");
        if (people && typeof people === "object") return { error: people.error };
        if (typeof people === "number") input.people = people;
        break;
      }
      case "daily": {
        const daily = parsePositive(a, "Daily budget");
        if (!daily.ok) return { error: daily.error };
        input.dailyBudget = daily.value;
        const days = parsePositive(d, "Days");
        if (!days.ok) return { error: days.error };
        input.days = days.value;
        const people = optPos(n, "People");
        if (people && typeof people === "object") return { error: people.error };
        if (typeof people === "number") input.people = people;
        break;
      }
      case "multiCity": {
        const cityA = optNonNeg(a, "City A");
        if (cityA && typeof cityA === "object") return { error: cityA.error };
        if (typeof cityA === "number") input.cityA = cityA;
        const cityB = optNonNeg(b, "City B");
        if (cityB && typeof cityB === "object") return { error: cityB.error };
        if (typeof cityB === "number") input.cityB = cityB;
        const cityC = optNonNeg(c, "City C");
        if (cityC && typeof cityC === "object") return { error: cityC.error };
        if (typeof cityC === "number") input.cityC = cityC;
        break;
      }
      case "contingency": {
        const base = parsePositive(a, "Base budget");
        if (!base.ok) return { error: base.error };
        input.baseBudget = base.value;
        const pct = optNonNeg(p, "Contingency %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.contingencyPct = pct;
        break;
      }
      case "duration": {
        const daily = parsePositive(a, "Cost/day");
        if (!daily.ok) return { error: daily.error };
        input.dailyBudget = daily.value;
        const days = parsePositive(d, "Days");
        if (!days.ok) return { error: days.error };
        input.days = days.value;
        break;
      }
      case "cruise": {
        const cruiseA = parsePositive(a, "Package A");
        if (!cruiseA.ok) return { error: cruiseA.error };
        input.cruiseA = cruiseA.value;
        const cruiseB = parsePositive(b, "Package B");
        if (!cruiseB.ok) return { error: cruiseB.error };
        input.cruiseB = cruiseB.value;
        break;
      }
      case "peakOff": {
        const peak = parsePositive(a, "Peak price");
        if (!peak.ok) return { error: peak.error };
        input.peakPrice = peak.value;
        const off = parsePositive(b, "Off-season price");
        if (!off.ok) return { error: off.error };
        input.offPrice = off.value;
        break;
      }
      case "surcharge": {
        const base = parsePositive(a, "Base");
        if (!base.ok) return { error: base.error };
        input.baseBudget = base.value;
        const pct = optNonNeg(p, "Surcharge %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.surchargePct = pct;
        break;
      }
    }
    return formatResult(
      computeTravelTrip(key in CONFIG ? key : "travel-trip-budget-calculator", input),
      num,
    );
  }, [a, b, c, config.mode, d, key, n, p, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "categories" ? (
            <>
              <div><FieldLabel htmlFor="tt-a">Lodging</FieldLabel><FieldInput id="tt-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tt-b">Food</FieldLabel><FieldInput id="tt-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tt-c">Transport</FieldLabel><FieldInput id="tt-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tt-r">Activities</FieldLabel><FieldInput id="tt-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tt-n">People</FieldLabel><FieldInput id="tt-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "daily" ? (
            <>
              <div><FieldLabel htmlFor="tt-a">Daily budget</FieldLabel><FieldInput id="tt-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tt-d">Days</FieldLabel><FieldInput id="tt-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tt-n">People</FieldLabel><FieldInput id="tt-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "multiCity" ? (
            <>
              <div><FieldLabel htmlFor="tt-a">City A cost</FieldLabel><FieldInput id="tt-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tt-b">City B cost</FieldLabel><FieldInput id="tt-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tt-c">City C cost</FieldLabel><FieldInput id="tt-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "contingency" ? (
            <>
              <div><FieldLabel htmlFor="tt-a">Base budget</FieldLabel><FieldInput id="tt-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tt-p">Contingency %</FieldLabel><FieldInput id="tt-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "duration" ? (
            <>
              <div><FieldLabel htmlFor="tt-a">Cost per day</FieldLabel><FieldInput id="tt-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tt-d">Days</FieldLabel><FieldInput id="tt-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "cruise" ? (
            <>
              <div><FieldLabel htmlFor="tt-a">Package A</FieldLabel><FieldInput id="tt-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tt-b">Package B</FieldLabel><FieldInput id="tt-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "peakOff" ? (
            <>
              <div><FieldLabel htmlFor="tt-a">Peak price</FieldLabel><FieldInput id="tt-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tt-b">Off-season price</FieldLabel><FieldInput id="tt-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "surcharge" ? (
            <>
              <div><FieldLabel htmlFor="tt-a">Base cost</FieldLabel><FieldInput id="tt-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tt-p">Surcharge %</FieldLabel><FieldInput id="tt-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
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
