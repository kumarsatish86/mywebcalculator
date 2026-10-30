"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { HOME_URL } from "@/lib/calculators/homeHelpers";
import {
  computeHomeAppliance,
  type HomeApplianceInput,
  type HomeApplianceResult,
  type HomeApplianceSlug,
} from "@/lib/calculators/homeAppliance";
import { parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "energy" | "tonnage" | "washer";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  cDefault: string;
  hDefault: string;
  dDefault: string;
  rDefault: string;
  lDefault: string;
  tDefault: string;
  nDefault: string;
  pDefault: string;
  aDefault: string;
};

const DISCLAIMER =
  "Daily-life planning estimate only — tariffs, taxes, and local rules vary. Verify current rates before budgeting.";

const CONFIG: Record<HomeApplianceSlug, Config> = {
  "home-ac-power-consumption-calculator": {
    title: "AC power consumption",
    description: `AC energy from watts or daily kWh. ${DISCLAIMER}`,
    mode: "energy", cDefault: "1500", hDefault: "8", dDefault: "30", rDefault: "0.12",
    lDefault: "", tDefault: "", nDefault: "", pDefault: "", aDefault: "",
  },
  "home-ac-tonnage-calculator": {
    title: "AC tonnage",
    description: `Rough tonnage from room area. ${DISCLAIMER}`,
    mode: "tonnage", cDefault: "", hDefault: "", dDefault: "", rDefault: "",
    lDefault: "150", tDefault: "", nDefault: "", pDefault: "", aDefault: "",
  },
  "home-heater-electricity-cost-calculator": {
    title: "Heater electricity cost",
    description: `Heater energy and cost estimate. ${DISCLAIMER}`,
    mode: "energy", cDefault: "2000", hDefault: "4", dDefault: "30", rDefault: "0.12",
    lDefault: "", tDefault: "", nDefault: "", pDefault: "", aDefault: "",
  },
  "home-refrigerator-energy-calculator": {
    title: "Refrigerator energy",
    description: `Fridge kWh from rating or daily use. ${DISCLAIMER}`,
    mode: "energy", cDefault: "", hDefault: "", dDefault: "30", rDefault: "0.12",
    lDefault: "", tDefault: "", nDefault: "", pDefault: "", aDefault: "1.5",
  },
  "home-washing-machine-cost-calculator": {
    title: "Washing machine cost",
    description: `Washer energy from cycles × kWh/cycle. ${DISCLAIMER}`,
    mode: "washer", cDefault: "", hDefault: "", dDefault: "", rDefault: "0.12",
    lDefault: "", tDefault: "1", nDefault: "12", pDefault: "", aDefault: "",
  },
  "home-tv-power-consumption-calculator": {
    title: "TV power consumption",
    description: `TV energy from watts and viewing hours. ${DISCLAIMER}`,
    mode: "energy", cDefault: "120", hDefault: "5", dDefault: "30", rDefault: "0.12",
    lDefault: "", tDefault: "", nDefault: "", pDefault: "", aDefault: "",
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

function formatResult(res: HomeApplianceResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.kwh !== undefined) rows.push({ label: "kWh", value: num(res.kwh, 2) });
  if (res.cost !== undefined) rows.push({ label: "Cost", value: num(res.cost, 2) });
  if (res.tons !== undefined) rows.push({ label: "Tons", value: num(res.tons, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.cost !== undefined ? num(res.cost, 2)
    : res.kwh !== undefined ? num(res.kwh, 2)
    : res.tons !== undefined ? num(res.tons, 2)
    : "—";
  const primaryLabel =
    res.cost !== undefined ? "Cost"
    : res.tons !== undefined ? "Tons"
    : "kWh";
  return { primary, primaryLabel, rows };
}

export function HomeApplianceCalculatorHost({ slug }: { slug: string }) {
  const key = slug as HomeApplianceSlug;
  const config = CONFIG[key] ?? CONFIG["home-ac-power-consumption-calculator"];
  const [c, setC] = useState(useLoanInitialInput(HOME_URL.C, config.cDefault));
  const [h, setH] = useState(useLoanInitialInput(HOME_URL.H, config.hDefault));
  const [d, setD] = useState(useLoanInitialInput(HOME_URL.D, config.dDefault));
  const [r, setR] = useState(useLoanInitialInput(HOME_URL.R, config.rDefault));
  const [l, setL] = useState(useLoanInitialInput(HOME_URL.L, config.lDefault));
  const [t, setT] = useState(useLoanInitialInput(HOME_URL.T, config.tDefault));
  const [n, setN] = useState(useLoanInitialInput(HOME_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(HOME_URL.P, config.pDefault));
  const [a, setA] = useState(useLoanInitialInput(HOME_URL.A, config.aDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "energy":
        put(HOME_URL.C, c); put(HOME_URL.H, h); put(HOME_URL.D, d); put(HOME_URL.R, r); put(HOME_URL.A, a);
        break;
      case "tonnage":
        put(HOME_URL.L, l); put(HOME_URL.T, t);
        break;
      case "washer":
        put(HOME_URL.N, n); put(HOME_URL.T, t); put(HOME_URL.R, r);
        break;
    }
    return out;
  }, [a, c, config.mode, d, h, l, n, r, t]);

  useLoanUrlSync(shareParams, [a, c, d, h, l, n, p, r, t]);

  const result = useMemo(() => {
    const input: HomeApplianceInput = {};
    switch (config.mode) {
      case "energy": {
        if (a.trim() !== "") {
          const kpd = parsePositive(a, "Daily kWh");
          if (!kpd.ok) return { error: kpd.error };
          input.kwhPerDay = kpd.value;
        } else {
          const watts = parsePositive(c, "Watts");
          if (!watts.ok) return { error: watts.error };
          input.watts = watts.value;
          const hrs = optPos(h, "Hours/day");
          if (hrs && typeof hrs === "object") return { error: hrs.error };
          if (typeof hrs === "number") input.hoursPerDay = hrs;
        }
        const days = optPos(d, "Days");
        if (days && typeof days === "object") return { error: days.error };
        if (typeof days === "number") input.days = days;
        const rate = optPos(r, "Rate/kWh");
        if (rate && typeof rate === "object") return { error: rate.error };
        if (typeof rate === "number") input.ratePerKwh = rate;
        break;
      }
      case "tonnage": {
        const area = parsePositive(l, "Area sqft");
        if (!area.ok) return { error: area.error };
        input.areaSqft = area.value;
        const per = optPos(t, "Tons per sqft");
        if (per && typeof per === "object") return { error: per.error };
        if (typeof per === "number") input.tonsPerSqft = per;
        break;
      }
      case "washer": {
        const cycles = parsePositive(n, "Cycles/month");
        if (!cycles.ok) return { error: cycles.error };
        input.cycles = cycles.value;
        const kpc = parsePositive(t, "kWh/cycle");
        if (!kpc.ok) return { error: kpc.error };
        input.kwhPerCycle = kpc.value;
        const rate = optPos(r, "Rate/kWh");
        if (rate && typeof rate === "object") return { error: rate.error };
        if (typeof rate === "number") input.ratePerKwh = rate;
        break;
      }
    }
    return formatResult(
      computeHomeAppliance(key in CONFIG ? key : "home-ac-power-consumption-calculator", input),
      num,
    );
  }, [a, c, config.mode, d, h, key, l, n, r, t]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "energy" ? (
            <>
              <div><FieldLabel htmlFor="ha-c">Watts</FieldLabel><FieldInput id="ha-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ha-a">Or daily kWh (override)</FieldLabel><FieldInput id="ha-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ha-h">Hours per day</FieldLabel><FieldInput id="ha-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ha-d">Days</FieldLabel><FieldInput id="ha-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ha-r">Rate per kWh (optional)</FieldLabel><FieldInput id="ha-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "tonnage" ? (
            <>
              <div><FieldLabel htmlFor="ha-l">Area (sqft)</FieldLabel><FieldInput id="ha-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ha-t">Tons per sqft (optional)</FieldLabel><FieldInput id="ha-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "washer" ? (
            <>
              <div><FieldLabel htmlFor="ha-n">Cycles per month</FieldLabel><FieldInput id="ha-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ha-t">kWh per cycle</FieldLabel><FieldInput id="ha-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="ha-r">Rate per kWh (optional)</FieldLabel><FieldInput id="ha-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
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
