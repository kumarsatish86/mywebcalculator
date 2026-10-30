"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { HOME_URL } from "@/lib/calculators/homeHelpers";
import {
  computeHomeSmart,
  type HomeSmartInput,
  type HomeSmartResult,
  type HomeSmartSlug,
} from "@/lib/calculators/homeSmart";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "deviceCost" | "savings" | "carbon";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  nDefault: string;
  pDefault: string;
  tDefault: string;
  aDefault: string;
  bDefault: string;
  rDefault: string;
  cDefault: string;
  mDefault: string;
};

const DISCLAIMER =
  "Daily-life planning estimate only — tariffs, taxes, and local rules vary. Verify current rates before budgeting.";

const CONFIG: Record<HomeSmartSlug, Config> = {
  "home-smart-home-cost-calculator": {
    title: "Smart home cost",
    description: `Devices × price + install. ${DISCLAIMER}`,
    mode: "deviceCost", nDefault: "5", pDefault: "50", tDefault: "200", aDefault: "", bDefault: "",
    rDefault: "", cDefault: "", mDefault: "",
  },
  "home-iot-device-cost-calculator": {
    title: "IoT device cost",
    description: `IoT rollout cost estimate. ${DISCLAIMER}`,
    mode: "deviceCost", nDefault: "10", pDefault: "35", tDefault: "0", aDefault: "", bDefault: "",
    rDefault: "", cDefault: "", mDefault: "",
  },
  "home-energy-efficiency-savings-calculator": {
    title: "Energy efficiency savings",
    description: `Savings from before vs after kWh. ${DISCLAIMER}`,
    mode: "savings", nDefault: "", pDefault: "", tDefault: "", aDefault: "500", bDefault: "350",
    rDefault: "0.12", cDefault: "", mDefault: "",
  },
  "home-carbon-footprint-calculator": {
    title: "Carbon footprint",
    description: `CO₂ from kWh × grid factor. ${DISCLAIMER}`,
    mode: "carbon", nDefault: "", pDefault: "", tDefault: "", aDefault: "400", bDefault: "",
    rDefault: "", cDefault: "0.7", mDefault: "",
  },
  "home-energy-saving-calculator": {
    title: "Energy saving",
    description: `kWh or cost saved after upgrade. ${DISCLAIMER}`,
    mode: "savings", nDefault: "", pDefault: "", tDefault: "", aDefault: "600", bDefault: "420",
    rDefault: "0.11", cDefault: "", mDefault: "",
  },
  "home-green-home-cost-calculator": {
    title: "Green home cost",
    description: `Green upgrade package cost. ${DISCLAIMER}`,
    mode: "deviceCost", nDefault: "3", pDefault: "1200", tDefault: "500", aDefault: "", bDefault: "",
    rDefault: "", cDefault: "", mDefault: "",
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

function formatResult(res: HomeSmartResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.total !== undefined) rows.push({ label: "Total", value: num(res.total, 0) });
  if (res.savings !== undefined) rows.push({ label: "Savings", value: num(res.savings, 2) });
  if (res.kgCo2 !== undefined) rows.push({ label: "CO₂ (kg)", value: num(res.kgCo2, 1) });
  if (res.years !== undefined) rows.push({ label: "Payback (years)", value: num(res.years, 1) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.total !== undefined ? num(res.total, 0)
    : res.savings !== undefined ? num(res.savings, 2)
    : res.kgCo2 !== undefined ? num(res.kgCo2, 1)
    : res.years !== undefined ? num(res.years, 1)
    : "—";
  const primaryLabel =
    res.total !== undefined ? "Total"
    : res.savings !== undefined ? "Savings"
    : res.kgCo2 !== undefined ? "CO₂ (kg)"
    : "Payback";
  return { primary, primaryLabel, rows };
}

export function HomeSmartCalculatorHost({ slug }: { slug: string }) {
  const key = slug as HomeSmartSlug;
  const config = CONFIG[key] ?? CONFIG["home-smart-home-cost-calculator"];
  const [n, setN] = useState(useLoanInitialInput(HOME_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(HOME_URL.P, config.pDefault));
  const [t, setT] = useState(useLoanInitialInput(HOME_URL.T, config.tDefault));
  const [a, setA] = useState(useLoanInitialInput(HOME_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(HOME_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(HOME_URL.R, config.rDefault));
  const [c, setC] = useState(useLoanInitialInput(HOME_URL.C, config.cDefault));
  const [m, setM] = useState(useLoanInitialInput(HOME_URL.M, config.mDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "deviceCost":
        put(HOME_URL.N, n); put(HOME_URL.P, p); put(HOME_URL.T, t);
        break;
      case "savings":
        put(HOME_URL.A, a); put(HOME_URL.B, b); put(HOME_URL.R, r);
        break;
      case "carbon":
        put(HOME_URL.A, a); put(HOME_URL.C, c);
        break;
    }
    return out;
  }, [a, b, c, config.mode, n, p, r, t]);

  useLoanUrlSync(shareParams, [a, b, c, m, n, p, r, t]);

  const result = useMemo(() => {
    const input: HomeSmartInput = {};
    switch (config.mode) {
      case "deviceCost": {
        const devices = parsePositive(n, "Devices");
        if (!devices.ok) return { error: devices.error };
        input.devices = devices.value;
        const price = parsePositive(p, "Price each");
        if (!price.ok) return { error: price.error };
        input.priceEach = price.value;
        const install = optNonNeg(t, "Install cost");
        if (install && typeof install === "object") return { error: install.error };
        if (typeof install === "number") input.install = install;
        break;
      }
      case "savings": {
        const before = parsePositive(a, "Before kWh");
        if (!before.ok) return { error: before.error };
        input.beforeKwh = before.value;
        const after = parseNonNegative(b, "After kWh");
        if (!after.ok) return { error: after.error };
        input.afterKwh = after.value;
        const rate = optNonNeg(r, "Rate/kWh");
        if (rate && typeof rate === "object") return { error: rate.error };
        if (typeof rate === "number") input.ratePerKwh = rate;
        break;
      }
      case "carbon": {
        const kwh = parsePositive(a, "kWh");
        if (!kwh.ok) return { error: kwh.error };
        input.kwh = kwh.value;
        const factor = optNonNeg(c, "kg CO₂/kWh");
        if (factor && typeof factor === "object") return { error: factor.error };
        if (typeof factor === "number") input.kgCo2PerKwh = factor;
        break;
      }
    }
    return formatResult(
      computeHomeSmart(key in CONFIG ? key : "home-smart-home-cost-calculator", input),
      num,
    );
  }, [a, b, c, config.mode, key, n, p, r, t]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "deviceCost" ? (
            <>
              <div><FieldLabel htmlFor="hsm-n">Devices / items</FieldLabel><FieldInput id="hsm-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hsm-p">Price each</FieldLabel><FieldInput id="hsm-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hsm-t">Install cost (optional)</FieldLabel><FieldInput id="hsm-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "savings" ? (
            <>
              <div><FieldLabel htmlFor="hsm-a">Before kWh</FieldLabel><FieldInput id="hsm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hsm-b">After kWh</FieldLabel><FieldInput id="hsm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hsm-r">Rate per kWh (optional)</FieldLabel><FieldInput id="hsm-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "carbon" ? (
            <>
              <div><FieldLabel htmlFor="hsm-a">kWh</FieldLabel><FieldInput id="hsm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hsm-c">Grid factor kg CO₂/kWh</FieldLabel><FieldInput id="hsm-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
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
