"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { HOME_URL } from "@/lib/calculators/homeHelpers";
import {
  computeHomeMaintenance,
  type HomeMaintenanceInput,
  type HomeMaintenanceResult,
  type HomeMaintenanceSlug,
} from "@/lib/calculators/homeMaintenance";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "areaRate" | "maid" | "rooms" | "repair";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  lDefault: string;
  rDefault: string;
  nDefault: string;
  pDefault: string;
  dDefault: string;
  aDefault: string;
  bDefault: string;
};

const DISCLAIMER =
  "Daily-life planning estimate only — tariffs, taxes, and local rules vary. Verify current rates before budgeting.";

const CONFIG: Record<HomeMaintenanceSlug, Config> = {
  "home-cleaning-cost-calculator": {
    title: "Cleaning cost",
    description: `Cost from area × rate/sqft. ${DISCLAIMER}`,
    mode: "areaRate", lDefault: "1200", rDefault: "0.5", nDefault: "", pDefault: "", dDefault: "", aDefault: "", bDefault: "",
  },
  "home-maid-salary-calculator": {
    title: "Maid salary",
    description: `Monthly from days × daily wage. ${DISCLAIMER}`,
    mode: "maid", lDefault: "", rDefault: "", nDefault: "", pDefault: "400", dDefault: "26", aDefault: "", bDefault: "",
  },
  "home-deep-cleaning-cost-estimator": {
    title: "Deep cleaning",
    description: `Cost from rooms × rate/room. ${DISCLAIMER}`,
    mode: "rooms", lDefault: "", rDefault: "150", nDefault: "4", pDefault: "", dDefault: "", aDefault: "", bDefault: "",
  },
  "home-repair-cost-calculator": {
    title: "Repair cost",
    description: `Labor plus materials. ${DISCLAIMER}`,
    mode: "repair", lDefault: "", rDefault: "", nDefault: "", pDefault: "", dDefault: "", aDefault: "500", bDefault: "300",
  },
  "home-painting-cost-calculator": {
    title: "Painting cost",
    description: `Paint job from area × rate. ${DISCLAIMER}`,
    mode: "areaRate", lDefault: "900", rDefault: "2", nDefault: "", pDefault: "", dDefault: "", aDefault: "", bDefault: "",
  },
  "home-renovation-cost-calculator": {
    title: "Renovation cost",
    description: `Renovation estimate from area × rate. ${DISCLAIMER}`,
    mode: "areaRate", lDefault: "1000", rDefault: "25", nDefault: "", pDefault: "", dDefault: "", aDefault: "", bDefault: "",
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

function formatResult(res: HomeMaintenanceResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.total !== undefined) rows.push({ label: "Total", value: num(res.total, 0) });
  rows.push({ label: "Note", value: res.note });
  return {
    primary: res.total !== undefined ? num(res.total, 0) : "—",
    primaryLabel: "Total",
    rows,
  };
}

export function HomeMaintenanceCalculatorHost({ slug }: { slug: string }) {
  const key = slug as HomeMaintenanceSlug;
  const config = CONFIG[key] ?? CONFIG["home-cleaning-cost-calculator"];
  const [l, setL] = useState(useLoanInitialInput(HOME_URL.L, config.lDefault));
  const [r, setR] = useState(useLoanInitialInput(HOME_URL.R, config.rDefault));
  const [n, setN] = useState(useLoanInitialInput(HOME_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(HOME_URL.P, config.pDefault));
  const [d, setD] = useState(useLoanInitialInput(HOME_URL.D, config.dDefault));
  const [a, setA] = useState(useLoanInitialInput(HOME_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(HOME_URL.B, config.bDefault));

  const num = (nVal: number, dec = 0) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "areaRate":
        put(HOME_URL.L, l); put(HOME_URL.R, r);
        break;
      case "maid":
        put(HOME_URL.D, d); put(HOME_URL.P, p);
        break;
      case "rooms":
        put(HOME_URL.N, n); put(HOME_URL.R, r);
        break;
      case "repair":
        put(HOME_URL.A, a); put(HOME_URL.B, b);
        break;
    }
    return out;
  }, [a, b, config.mode, d, l, n, p, r]);

  useLoanUrlSync(shareParams, [a, b, d, l, n, p, r]);

  const result = useMemo(() => {
    const input: HomeMaintenanceInput = {};
    switch (config.mode) {
      case "areaRate": {
        const area = parsePositive(l, "Area sqft");
        if (!area.ok) return { error: area.error };
        input.areaSqft = area.value;
        const rate = parsePositive(r, "Rate/sqft");
        if (!rate.ok) return { error: rate.error };
        input.ratePerSqft = rate.value;
        break;
      }
      case "maid": {
        const days = optNonNeg(d, "Days/month");
        if (days && typeof days === "object") return { error: days.error };
        if (typeof days === "number") input.daysPerMonth = days;
        const wage = parsePositive(p, "Wage/day");
        if (!wage.ok) return { error: wage.error };
        input.wagePerDay = wage.value;
        break;
      }
      case "rooms": {
        const rooms = parsePositive(n, "Rooms");
        if (!rooms.ok) return { error: rooms.error };
        input.rooms = rooms.value;
        const rate = parsePositive(r, "Rate/room");
        if (!rate.ok) return { error: rate.error };
        input.ratePerRoom = rate.value;
        break;
      }
      case "repair": {
        const labor = optNonNeg(a, "Labor");
        if (labor && typeof labor === "object") return { error: labor.error };
        if (typeof labor === "number") input.labor = labor;
        const mat = optNonNeg(b, "Materials");
        if (mat && typeof mat === "object") return { error: mat.error };
        if (typeof mat === "number") input.materials = mat;
        break;
      }
    }
    return formatResult(
      computeHomeMaintenance(key in CONFIG ? key : "home-cleaning-cost-calculator", input),
      num,
    );
  }, [a, b, config.mode, d, key, l, n, p, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "areaRate" ? (
            <>
              <div><FieldLabel htmlFor="hm-l">Area (sqft)</FieldLabel><FieldInput id="hm-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hm-r">Rate per sqft</FieldLabel><FieldInput id="hm-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "maid" ? (
            <>
              <div><FieldLabel htmlFor="hm-d">Days per month</FieldLabel><FieldInput id="hm-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hm-p">Wage per day</FieldLabel><FieldInput id="hm-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "rooms" ? (
            <>
              <div><FieldLabel htmlFor="hm-n">Rooms</FieldLabel><FieldInput id="hm-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hm-r">Rate per room</FieldLabel><FieldInput id="hm-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "repair" ? (
            <>
              <div><FieldLabel htmlFor="hm-a">Labor</FieldLabel><FieldInput id="hm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hm-b">Materials</FieldLabel><FieldInput id="hm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
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
