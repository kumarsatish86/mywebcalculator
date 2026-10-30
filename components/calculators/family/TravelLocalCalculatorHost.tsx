"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { TRAVEL_URL } from "@/lib/calculators/travelHelpers";
import {
  computeTravelLocal,
  type TravelLocalInput,
  type TravelLocalResult,
  type TravelLocalSlug,
} from "@/lib/calculators/travelLocal";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode =
  | "weight"
  | "linear"
  | "packing"
  | "passVsRide"
  | "commute"
  | "zones"
  | "multiDay"
  | "taxi"
  | "compare"
  | "surge";

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

const CONFIG: Record<TravelLocalSlug, Config> = {
  "travel-luggage-weight-allowance-calculator": {
    title: "Luggage weight allowance",
    description: `Check bag weight vs airline allowance. ${DISCLAIMER}`,
    mode: "weight",
    ...EMPTY, aDefault: "23", bDefault: "23",
  },
  "travel-linear-inches-bag-calculator": {
    title: "Linear inches bag",
    description: `Linear inches = L + W + H. ${DISCLAIMER}`,
    mode: "linear",
    ...EMPTY, lDefault: "22", wDefault: "14", hDefault: "9", mDefault: "45",
  },
  "travel-carry-on-compliance-estimator": {
    title: "Carry-on compliance",
    description: `Check carry-on against linear limit. ${DISCLAIMER}`,
    mode: "linear",
    ...EMPTY, lDefault: "21", wDefault: "14", hDefault: "8", mDefault: "45",
  },
  "travel-packing-list-cost-estimator": {
    title: "Packing list cost",
    description: `Estimate spend on packing items. ${DISCLAIMER}`,
    mode: "packing",
    ...EMPTY, aDefault: "12", nDefault: "8",
  },
  "travel-transit-pass-vs-pay-per-ride-calculator": {
    title: "Transit pass vs pay-per-ride",
    description: `Compare pass cost to pay-as-you-go. ${DISCLAIMER}`,
    mode: "passVsRide",
    ...EMPTY, aDefault: "35", nDefault: "20", bDefault: "2.50",
  },
  "travel-monthly-commute-cost-calculator": {
    title: "Monthly commute cost",
    description: `Monthly rides × fare. ${DISCLAIMER}`,
    mode: "commute",
    ...EMPTY, nDefault: "40", bDefault: "2.75",
  },
  "travel-zone-fare-estimator": {
    title: "Zone fare",
    description: `Fare from zones crossed × rate. ${DISCLAIMER}`,
    mode: "zones",
    ...EMPTY, nDefault: "3", bDefault: "1.80",
  },
  "travel-multi-day-transit-card-calculator": {
    title: "Multi-day transit card",
    description: `Card cost amortized per day. ${DISCLAIMER}`,
    mode: "multiDay",
    ...EMPTY, aDefault: "28", dDefault: "3",
  },
  "travel-taxi-fare-estimator": {
    title: "Taxi fare",
    description: `Taxi estimate: base + km×rate (+ tip). ${DISCLAIMER}`,
    mode: "taxi",
    ...EMPTY, aDefault: "3", bDefault: "1.50", dDefault: "12", pDefault: "10",
  },
  "travel-rideshare-cost-comparison-calculator": {
    title: "Rideshare comparison",
    description: `Compare two rideshare quotes. ${DISCLAIMER}`,
    mode: "compare",
    ...EMPTY, aDefault: "18", bDefault: "22",
  },
  "travel-surge-pricing-impact-calculator": {
    title: "Surge pricing impact",
    description: `Surged fare = base × multiplier. ${DISCLAIMER}`,
    mode: "surge",
    ...EMPTY, aDefault: "15", mDefault: "1.8",
  },
  "travel-airport-transfer-cost-calculator": {
    title: "Airport transfer cost",
    description: `Airport transfer from base + distance. ${DISCLAIMER}`,
    mode: "taxi",
    ...EMPTY, aDefault: "5", bDefault: "2", dDefault: "25", pDefault: "0",
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

function formatResult(res: TravelLocalResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.total !== undefined) rows.push({ label: "Total", value: num(res.total, 2) });
  if (res.linear !== undefined) rows.push({ label: "Linear", value: num(res.linear, 1) });
  if (res.overBy !== undefined) rows.push({ label: "Over by", value: num(res.overBy, 2) });
  if (res.compliant !== undefined) rows.push({ label: "Compliant", value: res.compliant ? "Yes" : "No" });
  if (res.cheaper !== undefined) rows.push({ label: "Cheaper", value: res.cheaper });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.total !== undefined ? num(res.total, 2)
    : res.linear !== undefined ? num(res.linear, 1)
    : res.overBy !== undefined ? num(res.overBy, 2)
    : res.cheaper !== undefined ? res.cheaper
    : "—";
  const primaryLabel =
    res.compliant !== undefined ? (res.compliant ? "Within limit" : "Over limit")
    : res.cheaper !== undefined ? "Cheaper option"
    : res.linear !== undefined ? "Linear inches"
    : "Total";
  return { primary, primaryLabel, rows };
}

export function TravelLocalCalculatorHost({ slug }: { slug: string }) {
  const key = slug as TravelLocalSlug;
  const config = CONFIG[key] ?? CONFIG["travel-luggage-weight-allowance-calculator"];
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
      case "weight":
      case "compare":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.B, b);
        break;
      case "linear":
        put(TRAVEL_URL.L, l); put(TRAVEL_URL.W, w); put(TRAVEL_URL.H, h); put(TRAVEL_URL.M, m);
        break;
      case "packing":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.N, n);
        break;
      case "passVsRide":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.N, n); put(TRAVEL_URL.B, b);
        break;
      case "commute":
      case "zones":
        put(TRAVEL_URL.N, n); put(TRAVEL_URL.B, b);
        break;
      case "multiDay":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.D, d);
        break;
      case "taxi":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.B, b); put(TRAVEL_URL.D, d); put(TRAVEL_URL.P, p);
        break;
      case "surge":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.M, m);
        break;
    }
    return out;
  }, [a, b, config.mode, d, h, l, m, n, p, w]);

  useLoanUrlSync(shareParams, [a, b, c, d, h, l, m, n, p, q, r, s, t, v, w]);

  const result = useMemo(() => {
    const input: TravelLocalInput = {};
    switch (config.mode) {
      case "weight": {
        const weight = parsePositive(a, "Bag weight");
        if (!weight.ok) return { error: weight.error };
        input.weightKg = weight.value;
        const lim = parsePositive(b, "Allowance");
        if (!lim.ok) return { error: lim.error };
        input.limitKg = lim.value;
        break;
      }
      case "linear": {
        const length = parsePositive(l, "Length");
        if (!length.ok) return { error: length.error };
        input.lengthIn = length.value;
        const width = parsePositive(w, "Width");
        if (!width.ok) return { error: width.error };
        input.widthIn = width.value;
        const height = parsePositive(h, "Height");
        if (!height.ok) return { error: height.error };
        input.heightIn = height.value;
        const max = optPos(m, "Max linear");
        if (max && typeof max === "object") return { error: max.error };
        if (typeof max === "number") input.maxLinear = max;
        break;
      }
      case "packing": {
        const cost = parsePositive(a, "Avg item cost");
        if (!cost.ok) return { error: cost.error };
        input.itemCost = cost.value;
        const items = parsePositive(n, "Items");
        if (!items.ok) return { error: items.error };
        input.items = items.value;
        break;
      }
      case "passVsRide": {
        const pass = parsePositive(a, "Pass cost");
        if (!pass.ok) return { error: pass.error };
        input.passCost = pass.value;
        const rides = parsePositive(n, "Rides");
        if (!rides.ok) return { error: rides.error };
        input.rides = rides.value;
        const fare = parsePositive(b, "Fare/ride");
        if (!fare.ok) return { error: fare.error };
        input.rideFare = fare.value;
        break;
      }
      case "commute": {
        const rides = optPos(n, "Rides/month");
        if (rides && typeof rides === "object") return { error: rides.error };
        if (typeof rides === "number") input.rides = rides;
        const fare = parsePositive(b, "Fare");
        if (!fare.ok) return { error: fare.error };
        input.rideFare = fare.value;
        break;
      }
      case "zones": {
        const zones = parsePositive(n, "Zones");
        if (!zones.ok) return { error: zones.error };
        input.zones = zones.value;
        const per = parsePositive(b, "Fare/zone");
        if (!per.ok) return { error: per.error };
        input.farePerZone = per.value;
        break;
      }
      case "multiDay": {
        const pass = parsePositive(a, "Card cost");
        if (!pass.ok) return { error: pass.error };
        input.passCost = pass.value;
        const days = parsePositive(d, "Days");
        if (!days.ok) return { error: days.error };
        input.days = days.value;
        break;
      }
      case "taxi": {
        const base = optNonNeg(a, "Base fare");
        if (base && typeof base === "object") return { error: base.error };
        if (typeof base === "number") input.baseFare = base;
        const perKm = parsePositive(b, "Per km");
        if (!perKm.ok) return { error: perKm.error };
        input.perKm = perKm.value;
        const dist = parsePositive(d, "Distance");
        if (!dist.ok) return { error: dist.error };
        input.distanceKm = dist.value;
        const tipPct = optNonNeg(p, "Tip %");
        if (tipPct && typeof tipPct === "object") return { error: tipPct.error };
        if (typeof tipPct === "number") input.tipPct = tipPct;
        break;
      }
      case "compare": {
        const optA = parsePositive(a, "Option A");
        if (!optA.ok) return { error: optA.error };
        input.optionA = optA.value;
        const optB = parsePositive(b, "Option B");
        if (!optB.ok) return { error: optB.error };
        input.optionB = optB.value;
        break;
      }
      case "surge": {
        const base = parsePositive(a, "Base fare");
        if (!base.ok) return { error: base.error };
        input.baseFare = base.value;
        const mult = optPos(m, "Surge multiplier");
        if (mult && typeof mult === "object") return { error: mult.error };
        if (typeof mult === "number") input.surgeMult = mult;
        break;
      }
    }
    return formatResult(
      computeTravelLocal(key in CONFIG ? key : "travel-luggage-weight-allowance-calculator", input),
      num,
    );
  }, [a, b, config.mode, d, h, key, l, m, n, p, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "weight" ? (
            <>
              <div><FieldLabel htmlFor="tl-a">Bag weight (kg)</FieldLabel><FieldInput id="tl-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tl-b">Allowance (kg)</FieldLabel><FieldInput id="tl-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "linear" ? (
            <>
              <div><FieldLabel htmlFor="tl-l">Length (in)</FieldLabel><FieldInput id="tl-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tl-w">Width (in)</FieldLabel><FieldInput id="tl-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tl-h">Height (in)</FieldLabel><FieldInput id="tl-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tl-m">Max linear (in)</FieldLabel><FieldInput id="tl-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "packing" ? (
            <>
              <div><FieldLabel htmlFor="tl-a">Avg item cost</FieldLabel><FieldInput id="tl-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tl-n">Items</FieldLabel><FieldInput id="tl-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "passVsRide" ? (
            <>
              <div><FieldLabel htmlFor="tl-a">Pass cost</FieldLabel><FieldInput id="tl-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tl-n">Rides</FieldLabel><FieldInput id="tl-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tl-b">Fare per ride</FieldLabel><FieldInput id="tl-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "commute" ? (
            <>
              <div><FieldLabel htmlFor="tl-n">Rides / month</FieldLabel><FieldInput id="tl-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tl-b">Fare</FieldLabel><FieldInput id="tl-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "zones" ? (
            <>
              <div><FieldLabel htmlFor="tl-n">Zones</FieldLabel><FieldInput id="tl-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tl-b">Fare per zone</FieldLabel><FieldInput id="tl-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "multiDay" ? (
            <>
              <div><FieldLabel htmlFor="tl-a">Card cost</FieldLabel><FieldInput id="tl-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tl-d">Days</FieldLabel><FieldInput id="tl-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "taxi" ? (
            <>
              <div><FieldLabel htmlFor="tl-a">Base fare</FieldLabel><FieldInput id="tl-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tl-b">Per km</FieldLabel><FieldInput id="tl-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tl-d">Distance (km)</FieldLabel><FieldInput id="tl-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tl-p">Tip %</FieldLabel><FieldInput id="tl-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "compare" ? (
            <>
              <div><FieldLabel htmlFor="tl-a">Option A</FieldLabel><FieldInput id="tl-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tl-b">Option B</FieldLabel><FieldInput id="tl-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "surge" ? (
            <>
              <div><FieldLabel htmlFor="tl-a">Base fare</FieldLabel><FieldInput id="tl-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tl-m">Surge multiplier</FieldLabel><FieldInput id="tl-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" /></div>
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
