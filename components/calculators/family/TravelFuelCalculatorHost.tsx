"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { TRAVEL_URL } from "@/lib/calculators/travelHelpers";
import {
  computeTravelFuel,
  type TravelFuelInput,
  type TravelFuelResult,
  type TravelFuelSlug,
} from "@/lib/calculators/travelFuel";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "fuelCost" | "mileage" | "mpg" | "ev" | "range" | "toll";

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

const CONFIG: Record<TravelFuelSlug, Config> = {
  "travel-fuel-cost-calculator": {
    title: "Fuel cost",
    description: `Trip fuel cost from distance, km/L, and price. ${DISCLAIMER}`,
    mode: "fuelCost",
    ...EMPTY, aDefault: "300", bDefault: "14", cDefault: "1.50",
  },
  "travel-mileage-calculator": {
    title: "Mileage",
    description: `Efficiency from distance and fuel used. ${DISCLAIMER}`,
    mode: "mileage",
    ...EMPTY, aDefault: "450", bDefault: "30",
  },
  "travel-mpg-calculator": {
    title: "MPG",
    description: `Miles per gallon from miles and gallons. ${DISCLAIMER}`,
    mode: "mpg",
    ...EMPTY, aDefault: "280", bDefault: "10",
  },
  "travel-km-per-liter-calculator": {
    title: "km per liter",
    description: `km/L from distance and liters used. ${DISCLAIMER}`,
    mode: "mileage",
    ...EMPTY, aDefault: "400", bDefault: "28",
  },
  "travel-gas-price-trip-calculator": {
    title: "Gas price trip",
    description: `Trip fuel spend from distance and pump price. ${DISCLAIMER}`,
    mode: "fuelCost",
    ...EMPTY, aDefault: "500", bDefault: "12", cDefault: "1.65",
  },
  "travel-ev-charging-cost-trip-calculator": {
    title: "EV charging cost",
    description: `EV trip cost from kWh/100km and rate. ${DISCLAIMER}`,
    mode: "ev",
    ...EMPTY, aDefault: "250", bDefault: "18", cDefault: "0.25",
  },
  "travel-range-estimator": {
    title: "Range estimator",
    description: `Driving range from tank size and efficiency. ${DISCLAIMER}`,
    mode: "range",
    ...EMPTY, aDefault: "50", bDefault: "14",
  },
  "travel-toll-cost-estimator": {
    title: "Toll cost",
    description: `Toll total from rate and plaza count. ${DISCLAIMER}`,
    mode: "toll",
    ...EMPTY, aDefault: "3.50", bDefault: "4",
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

function formatResult(res: TravelFuelResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.cost !== undefined) rows.push({ label: "Cost", value: num(res.cost, 2) });
  if (res.liters !== undefined) rows.push({ label: "Liters", value: num(res.liters, 2) });
  if (res.mpg !== undefined) rows.push({ label: "MPG", value: num(res.mpg, 2) });
  if (res.kmPerL !== undefined) rows.push({ label: "km/L", value: num(res.kmPerL, 2) });
  if (res.rangeKm !== undefined) rows.push({ label: "Range (km)", value: num(res.rangeKm, 1) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.cost !== undefined ? num(res.cost, 2)
    : res.mpg !== undefined ? num(res.mpg, 2)
    : res.kmPerL !== undefined ? num(res.kmPerL, 2)
    : res.rangeKm !== undefined ? num(res.rangeKm, 1)
    : res.liters !== undefined ? num(res.liters, 2)
    : "—";
  const primaryLabel =
    res.cost !== undefined ? "Cost"
    : res.mpg !== undefined ? "MPG"
    : res.kmPerL !== undefined ? "km/L"
    : res.rangeKm !== undefined ? "Range (km)"
    : "Result";
  return { primary, primaryLabel, rows };
}

export function TravelFuelCalculatorHost({ slug }: { slug: string }) {
  const key = slug as TravelFuelSlug;
  const config = CONFIG[key] ?? CONFIG["travel-fuel-cost-calculator"];
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
      case "fuelCost":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.B, b); put(TRAVEL_URL.C, c);
        break;
      case "mileage":
      case "mpg":
      case "range":
      case "toll":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.B, b);
        break;
      case "ev":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.B, b); put(TRAVEL_URL.C, c);
        break;
    }
    return out;
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, d, h, l, m, n, p, q, r, s, t, v, w]);

  const result = useMemo(() => {
    const input: TravelFuelInput = {};
    switch (config.mode) {
      case "fuelCost": {
        const dist = parsePositive(a, "Distance km");
        if (!dist.ok) return { error: dist.error };
        input.distanceKm = dist.value;
        const eff = parsePositive(b, "km/L");
        if (!eff.ok) return { error: eff.error };
        input.efficiency = eff.value;
        const price = parsePositive(c, "Price/L");
        if (!price.ok) return { error: price.error };
        input.pricePerLiter = price.value;
        break;
      }
      case "mileage": {
        const dist = parsePositive(a, "Distance");
        if (!dist.ok) return { error: dist.error };
        input.distanceKm = dist.value;
        const fuel = parsePositive(b, "Fuel used");
        if (!fuel.ok) return { error: fuel.error };
        input.efficiency = fuel.value;
        break;
      }
      case "mpg": {
        const miles = parsePositive(a, "Miles");
        if (!miles.ok) return { error: miles.error };
        input.miles = miles.value;
        const gal = parsePositive(b, "Gallons");
        if (!gal.ok) return { error: gal.error };
        input.gallons = gal.value;
        break;
      }
      case "ev": {
        const dist = parsePositive(a, "Distance km");
        if (!dist.ok) return { error: dist.error };
        input.distanceKm = dist.value;
        const kwh = parsePositive(b, "kWh/100km");
        if (!kwh.ok) return { error: kwh.error };
        input.kwhPer100km = kwh.value;
        const rate = parsePositive(c, "Price/kWh");
        if (!rate.ok) return { error: rate.error };
        input.pricePerKwh = rate.value;
        break;
      }
      case "range": {
        const tank = parsePositive(a, "Tank liters");
        if (!tank.ok) return { error: tank.error };
        input.tankLiters = tank.value;
        const eff = parsePositive(b, "km/L");
        if (!eff.ok) return { error: eff.error };
        input.efficiency = eff.value;
        break;
      }
      case "toll": {
        const per = optNonNeg(a, "Toll per plaza");
        if (per && typeof per === "object") return { error: per.error };
        if (typeof per === "number") input.tolls = per;
        else input.tolls = 0;
        const count = optPos(b, "Toll count");
        if (count && typeof count === "object") return { error: count.error };
        if (typeof count === "number") input.tollCount = count;
        break;
      }
    }
    return formatResult(
      computeTravelFuel(key in CONFIG ? key : "travel-fuel-cost-calculator", input),
      num,
    );
  }, [a, b, c, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "fuelCost" ? (
            <>
              <div><FieldLabel htmlFor="tf-a">Distance (km)</FieldLabel><FieldInput id="tf-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tf-b">Efficiency (km/L)</FieldLabel><FieldInput id="tf-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tf-c">Price per liter</FieldLabel><FieldInput id="tf-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "mileage" ? (
            <>
              <div><FieldLabel htmlFor="tf-a">Distance</FieldLabel><FieldInput id="tf-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tf-b">Fuel used</FieldLabel><FieldInput id="tf-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "mpg" ? (
            <>
              <div><FieldLabel htmlFor="tf-a">Miles</FieldLabel><FieldInput id="tf-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tf-b">Gallons</FieldLabel><FieldInput id="tf-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "ev" ? (
            <>
              <div><FieldLabel htmlFor="tf-a">Distance (km)</FieldLabel><FieldInput id="tf-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tf-b">kWh per 100 km</FieldLabel><FieldInput id="tf-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tf-c">Price per kWh</FieldLabel><FieldInput id="tf-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "range" ? (
            <>
              <div><FieldLabel htmlFor="tf-a">Tank liters</FieldLabel><FieldInput id="tf-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tf-b">Efficiency (km/L)</FieldLabel><FieldInput id="tf-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "toll" ? (
            <>
              <div><FieldLabel htmlFor="tf-a">Toll per plaza</FieldLabel><FieldInput id="tf-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tf-b">Toll count</FieldLabel><FieldInput id="tf-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
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
