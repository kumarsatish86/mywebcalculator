"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { HOME_URL } from "@/lib/calculators/homeHelpers";
import {
  computeHomeParking,
  type HomeParkingInput,
  type HomeParkingResult,
  type HomeParkingSlug,
} from "@/lib/calculators/homeParking";
import { parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "space" | "ev";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  lDefault: string;
  wDefault: string;
  nDefault: string;
  aDefault: string;
  rDefault: string;
  cDefault: string;
};

const DISCLAIMER =
  "Daily-life planning estimate only — tariffs, taxes, and local rules vary. Verify current rates before budgeting.";

const CONFIG: Record<HomeParkingSlug, Config> = {
  "home-parking-space-calculator": {
    title: "Parking space",
    description: `Stall area from L×W×cars. ${DISCLAIMER}`,
    mode: "space", lDefault: "5", wDefault: "2.5", nDefault: "1", aDefault: "", rDefault: "", cDefault: "",
  },
  "home-garage-size-calculator": {
    title: "Garage size",
    description: `Garage floor area estimate. ${DISCLAIMER}`,
    mode: "space", lDefault: "6", wDefault: "3.5", nDefault: "1", aDefault: "", rDefault: "", cDefault: "",
  },
  "home-ev-charging-cost-calculator": {
    title: "EV charging cost",
    description: `Charge cost from kWh × rate × sessions. ${DISCLAIMER}`,
    mode: "ev", lDefault: "", wDefault: "", nDefault: "8", aDefault: "40", rDefault: "0.15", cDefault: "",
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

function formatResult(res: HomeParkingResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.areaM2 !== undefined) rows.push({ label: "Area (m²)", value: num(res.areaM2, 2) });
  if (res.cost !== undefined) rows.push({ label: "Cost", value: num(res.cost, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.cost !== undefined ? num(res.cost, 2)
    : res.areaM2 !== undefined ? num(res.areaM2, 2)
    : "—";
  const primaryLabel = res.cost !== undefined ? "Cost" : "Area (m²)";
  return { primary, primaryLabel, rows };
}

export function HomeParkingCalculatorHost({ slug }: { slug: string }) {
  const key = slug as HomeParkingSlug;
  const config = CONFIG[key] ?? CONFIG["home-parking-space-calculator"];
  const [l, setL] = useState(useLoanInitialInput(HOME_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(HOME_URL.W, config.wDefault));
  const [n, setN] = useState(useLoanInitialInput(HOME_URL.N, config.nDefault));
  const [a, setA] = useState(useLoanInitialInput(HOME_URL.A, config.aDefault));
  const [r, setR] = useState(useLoanInitialInput(HOME_URL.R, config.rDefault));
  const [c, setC] = useState(useLoanInitialInput(HOME_URL.C, config.cDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "space":
        put(HOME_URL.L, l); put(HOME_URL.W, w); put(HOME_URL.N, n);
        break;
      case "ev":
        put(HOME_URL.A, a); put(HOME_URL.R, r); put(HOME_URL.N, n);
        break;
    }
    return out;
  }, [a, config.mode, l, n, r, w]);

  useLoanUrlSync(shareParams, [a, c, l, n, r, w]);

  const result = useMemo(() => {
    const input: HomeParkingInput = {};
    switch (config.mode) {
      case "space": {
        const L = optPos(l, "Length (m)");
        if (L && typeof L === "object") return { error: L.error };
        if (typeof L === "number") input.lengthM = L;
        const W = optPos(w, "Width (m)");
        if (W && typeof W === "object") return { error: W.error };
        if (typeof W === "number") input.widthM = W;
        const cars = optPos(n, "Cars");
        if (cars && typeof cars === "object") return { error: cars.error };
        if (typeof cars === "number") input.cars = cars;
        break;
      }
      case "ev": {
        const kwh = parsePositive(a, "kWh per charge");
        if (!kwh.ok) return { error: kwh.error };
        input.kwhPerCharge = kwh.value;
        const rate = parsePositive(r, "Rate/kWh");
        if (!rate.ok) return { error: rate.error };
        input.ratePerKwh = rate.value;
        const charges = optPos(n, "Charges per month");
        if (charges && typeof charges === "object") return { error: charges.error };
        if (typeof charges === "number") input.chargesPerMonth = charges;
        break;
      }
    }
    return formatResult(
      computeHomeParking(key in CONFIG ? key : "home-parking-space-calculator", input),
      num,
    );
  }, [a, config.mode, key, l, n, r, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "space" ? (
            <>
              <div><FieldLabel htmlFor="hpk-l">Length (m)</FieldLabel><FieldInput id="hpk-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hpk-w">Width (m)</FieldLabel><FieldInput id="hpk-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hpk-n">Cars</FieldLabel><FieldInput id="hpk-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "ev" ? (
            <>
              <div><FieldLabel htmlFor="hpk-a">kWh per charge</FieldLabel><FieldInput id="hpk-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hpk-r">Rate per kWh</FieldLabel><FieldInput id="hpk-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hpk-n">Charges per month</FieldLabel><FieldInput id="hpk-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
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
