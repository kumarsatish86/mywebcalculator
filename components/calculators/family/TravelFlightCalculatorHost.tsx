"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { TRAVEL_URL } from "@/lib/calculators/travelHelpers";
import {
  computeTravelFlight,
  type TravelFlightInput,
  type TravelFlightResult,
  type TravelFlightSlug,
} from "@/lib/calculators/travelFlight";
import { parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "perMile" | "bags" | "upgrade" | "milesValue" | "layover";

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

const CONFIG: Record<TravelFlightSlug, Config> = {
  "travel-airfare-per-mile-calculator": {
    title: "Airfare per mile",
    description: `Cost per mile from fare and distance. ${DISCLAIMER}`,
    mode: "perMile",
    ...EMPTY, aDefault: "320", mDefault: "1800",
  },
  "travel-baggage-fee-total-calculator": {
    title: "Baggage fee total",
    description: `Checked-bag fees × bag count. ${DISCLAIMER}`,
    mode: "bags",
    ...EMPTY, bDefault: "35", nDefault: "2",
  },
  "travel-seat-upgrade-value-calculator": {
    title: "Seat upgrade value",
    description: `Whether upgrade cost is worth comfort hours. ${DISCLAIMER}`,
    mode: "upgrade",
    ...EMPTY, aDefault: "75", hDefault: "4", vDefault: "20",
  },
  "travel-miles-to-dollar-value-calculator": {
    title: "Miles to dollar value",
    description: `Cash value of miles/points. ${DISCLAIMER}`,
    mode: "milesValue",
    ...EMPTY, mDefault: "25000", cDefault: "1.5",
  },
  "travel-layover-time-cost-calculator": {
    title: "Layover time cost",
    description: `Opportunity cost of layover hours. ${DISCLAIMER}`,
    mode: "layover",
    ...EMPTY, hDefault: "3", vDefault: "15",
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

function formatResult(res: TravelFlightResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.perMile !== undefined) rows.push({ label: "Per mile", value: num(res.perMile, 4) });
  if (res.total !== undefined) rows.push({ label: "Total", value: num(res.total, 2) });
  if (res.value !== undefined) rows.push({ label: "Value", value: num(res.value, 2) });
  if (res.worthIt !== undefined) rows.push({ label: "Worth it?", value: res.worthIt ? "Yes" : "No" });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.perMile !== undefined ? num(res.perMile, 4)
    : res.value !== undefined ? num(res.value, 2)
    : res.total !== undefined ? num(res.total, 2)
    : "—";
  const primaryLabel =
    res.perMile !== undefined ? "Per mile"
    : res.worthIt !== undefined ? "Comfort value"
    : res.value !== undefined ? "Value"
    : "Total";
  return { primary, primaryLabel, rows };
}

export function TravelFlightCalculatorHost({ slug }: { slug: string }) {
  const key = slug as TravelFlightSlug;
  const config = CONFIG[key] ?? CONFIG["travel-airfare-per-mile-calculator"];
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
      case "perMile":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.M, m);
        break;
      case "bags":
        put(TRAVEL_URL.B, b); put(TRAVEL_URL.N, n);
        break;
      case "upgrade":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.H, h); put(TRAVEL_URL.V, v);
        break;
      case "milesValue":
        put(TRAVEL_URL.M, m); put(TRAVEL_URL.C, c);
        break;
      case "layover":
        put(TRAVEL_URL.H, h); put(TRAVEL_URL.V, v);
        break;
    }
    return out;
  }, [a, b, c, config.mode, h, m, n, v]);

  useLoanUrlSync(shareParams, [a, b, c, d, h, l, m, n, p, q, r, s, t, v, w]);

  const result = useMemo(() => {
    const input: TravelFlightInput = {};
    switch (config.mode) {
      case "perMile": {
        const fare = parsePositive(a, "Fare");
        if (!fare.ok) return { error: fare.error };
        input.fare = fare.value;
        const miles = parsePositive(m, "Miles");
        if (!miles.ok) return { error: miles.error };
        input.miles = miles.value;
        break;
      }
      case "bags": {
        const fee = parsePositive(b, "Fee/bag");
        if (!fee.ok) return { error: fee.error };
        input.bagFee = fee.value;
        const bags = optPos(n, "Bags");
        if (bags && typeof bags === "object") return { error: bags.error };
        if (typeof bags === "number") input.bags = bags;
        break;
      }
      case "upgrade": {
        const cost = parsePositive(a, "Upgrade cost");
        if (!cost.ok) return { error: cost.error };
        input.upgradeCost = cost.value;
        const hrs = optPos(h, "Comfort hours");
        if (hrs && typeof hrs === "object") return { error: hrs.error };
        if (typeof hrs === "number") input.hoursGained = hrs;
        const hv = optPos(v, "$/hour value");
        if (hv && typeof hv === "object") return { error: hv.error };
        if (typeof hv === "number") input.hourlyValue = hv;
        break;
      }
      case "milesValue": {
        const pts = parsePositive(m, "Miles/points");
        if (!pts.ok) return { error: pts.error };
        input.points = pts.value;
        const cpp = optPos(c, "Cents per point");
        if (cpp && typeof cpp === "object") return { error: cpp.error };
        if (typeof cpp === "number") input.cpp = cpp;
        break;
      }
      case "layover": {
        const hrs = parsePositive(h, "Layover hours");
        if (!hrs.ok) return { error: hrs.error };
        input.layoverHours = hrs.value;
        const hv = optPos(v, "Hourly opportunity cost");
        if (hv && typeof hv === "object") return { error: hv.error };
        if (typeof hv === "number") input.hourlyValue = hv;
        break;
      }
    }
    return formatResult(
      computeTravelFlight(key in CONFIG ? key : "travel-airfare-per-mile-calculator", input),
      num,
    );
  }, [a, b, c, config.mode, h, key, m, n, v]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "perMile" ? (
            <>
              <div><FieldLabel htmlFor="tfl-a">Fare</FieldLabel><FieldInput id="tfl-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tfl-m">Miles</FieldLabel><FieldInput id="tfl-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "bags" ? (
            <>
              <div><FieldLabel htmlFor="tfl-b">Fee per bag</FieldLabel><FieldInput id="tfl-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tfl-n">Bags</FieldLabel><FieldInput id="tfl-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "upgrade" ? (
            <>
              <div><FieldLabel htmlFor="tfl-a">Upgrade cost</FieldLabel><FieldInput id="tfl-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tfl-h">Comfort hours</FieldLabel><FieldInput id="tfl-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tfl-v">$/hour value</FieldLabel><FieldInput id="tfl-v" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "milesValue" ? (
            <>
              <div><FieldLabel htmlFor="tfl-m">Miles / points</FieldLabel><FieldInput id="tfl-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tfl-c">Cents per point</FieldLabel><FieldInput id="tfl-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "layover" ? (
            <>
              <div><FieldLabel htmlFor="tfl-h">Layover hours</FieldLabel><FieldInput id="tfl-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tfl-v">Hourly opportunity cost</FieldLabel><FieldInput id="tfl-v" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="decimal" /></div>
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
