"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  PHYSICS_ELECTRICITY_URL,
  capacitorQV,
  currentFromVR,
  electricalPower,
  energyConsumption,
  ohmsLaw,
  parallelResistance,
  resistanceFromVI,
  seriesResistance,
  voltageFromIR,
} from "@/lib/calculators/physicsElectricity";

type ElecSlug =
  | "ohms-law-calculator"
  | "voltage-calculator"
  | "current-calculator"
  | "resistance-calculator"
  | "electrical-power-calculator"
  | "energy-consumption-calculator"
  | "series-resistance-calculator"
  | "parallel-resistance-calculator"
  | "capacitor-calculator-physics";

type Mode =
  | "ohms"
  | "voltage"
  | "current"
  | "resistance"
  | "power"
  | "energy"
  | "series"
  | "parallel"
  | "capacitor";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  vDefault: string;
  iDefault: string;
  rDefault: string;
  wDefault: string;
};

const CONFIG: Record<ElecSlug, Config> = {
  "ohms-law-calculator": {
    title: "Ohm’s law",
    description: "V = I R — leave exactly one of V, I, R blank to solve.",
    mode: "ohms",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    vDefault: "12",
    iDefault: "2",
    rDefault: "",
    wDefault: "",
  },
  "voltage-calculator": {
    title: "Voltage from I × R",
    description: "V = I R for a simple resistive circuit.",
    mode: "voltage",
    aDefault: "2",
    bDefault: "6",
    cDefault: "",
    vDefault: "",
    iDefault: "",
    rDefault: "",
    wDefault: "",
  },
  "current-calculator": {
    title: "Current from V / R",
    description: "I = V / R for a simple resistive circuit.",
    mode: "current",
    aDefault: "12",
    bDefault: "6",
    cDefault: "",
    vDefault: "",
    iDefault: "",
    rDefault: "",
    wDefault: "",
  },
  "resistance-calculator": {
    title: "Resistance from V / I",
    description: "R = V / I for a simple resistive circuit.",
    mode: "resistance",
    aDefault: "12",
    bDefault: "2",
    cDefault: "",
    vDefault: "",
    iDefault: "",
    rDefault: "",
    wDefault: "",
  },
  "electrical-power-calculator": {
    title: "Electrical power",
    description: "P from V&I, I&R, or V&R — enter any two of V, I, R.",
    mode: "power",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    vDefault: "12",
    iDefault: "2",
    rDefault: "",
    wDefault: "",
  },
  "energy-consumption-calculator": {
    title: "Energy consumption",
    description: "Energy from average power and hours of use.",
    mode: "energy",
    aDefault: "100",
    bDefault: "5",
    cDefault: "",
    vDefault: "",
    iDefault: "",
    rDefault: "",
    wDefault: "",
  },
  "series-resistance-calculator": {
    title: "Series resistance",
    description: "Total resistance for resistors in series (comma-separated Ω).",
    mode: "series",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    vDefault: "",
    iDefault: "",
    rDefault: "",
    wDefault: "10,20,30",
  },
  "parallel-resistance-calculator": {
    title: "Parallel resistance",
    description: "Equivalent resistance for resistors in parallel (comma-separated Ω).",
    mode: "parallel",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    vDefault: "",
    iDefault: "",
    rDefault: "",
    wDefault: "10,20,30",
  },
  "capacitor-calculator-physics": {
    title: "Capacitor Q = C V",
    description: "Leave exactly one of Q, V, C blank to solve the third.",
    mode: "capacitor",
    aDefault: "",
    bDefault: "5",
    cDefault: "0.0001",
    vDefault: "",
    iDefault: "",
    rDefault: "",
    wDefault: "",
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

function optionalPositive(raw: string, label: string) {
  if (raw.trim() === "") return { ok: true as const, value: null as number | null };
  const p = parsePositive(raw, label);
  if (!p.ok) return p;
  return { ok: true as const, value: p.value as number | null };
}

export function PhysicsElectricityCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as ElecSlug] ?? CONFIG["ohms-law-calculator"];
  const [a, setA] = useState(useLoanInitialInput(PHYSICS_ELECTRICITY_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(PHYSICS_ELECTRICITY_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(PHYSICS_ELECTRICITY_URL.C, config.cDefault));
  const [v, setV] = useState(useLoanInitialInput(PHYSICS_ELECTRICITY_URL.V, config.vDefault));
  const [i, setI] = useState(useLoanInitialInput(PHYSICS_ELECTRICITY_URL.I, config.iDefault));
  const [r, setR] = useState(useLoanInitialInput(PHYSICS_ELECTRICITY_URL.R, config.rDefault));
  const [w, setW] = useState(useLoanInitialInput(PHYSICS_ELECTRICITY_URL.W, config.wDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    if (config.mode === "ohms" || config.mode === "power") {
      return {
        [PHYSICS_ELECTRICITY_URL.V]: v,
        [PHYSICS_ELECTRICITY_URL.I]: i,
        [PHYSICS_ELECTRICITY_URL.R]: r,
      };
    }
    if (config.mode === "series" || config.mode === "parallel") {
      return { [PHYSICS_ELECTRICITY_URL.W]: w };
    }
    if (config.mode === "capacitor") {
      return {
        [PHYSICS_ELECTRICITY_URL.A]: a,
        [PHYSICS_ELECTRICITY_URL.B]: b,
        [PHYSICS_ELECTRICITY_URL.C]: c,
      };
    }
    return {
      [PHYSICS_ELECTRICITY_URL.A]: a,
      [PHYSICS_ELECTRICITY_URL.B]: b,
    };
  }, [a, b, c, v, i, r, w, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, v, i, r, w]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "ohms": {
        const vP = optionalPositive(v, "Voltage V");
        const iP = optionalPositive(i, "Current I");
        const rP = optionalPositive(r, "Resistance R");
        if (!vP.ok) return { error: vP.error };
        if (!iP.ok) return { error: iP.error };
        if (!rP.ok) return { error: rP.error };
        const computed = ohmsLaw({ v: vP.value, i: iP.value, r: rP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `Solved ${computed.solved}`,
          primaryLabel: "Ohm’s law",
          rows: [
            { label: "V", value: `${num(computed.v)} V` },
            { label: "I", value: `${num(computed.i)} A` },
            { label: "R", value: `${num(computed.r)} Ω` },
          ],
        };
      }
      case "voltage": {
        const iP = parseNonNegative(a, "Current I");
        const rP = parseNonNegative(b, "Resistance R");
        if (!iP.ok) return { error: iP.error };
        if (!rP.ok) return { error: rP.error };
        const computed = voltageFromIR({ i: iP.value, r: rP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.v)} V`,
          primaryLabel: "Voltage V",
          rows: [
            { label: "I", value: `${num(iP.value)} A` },
            { label: "R", value: `${num(rP.value)} Ω` },
          ],
        };
      }
      case "current": {
        const vP = parseNonNegative(a, "Voltage V");
        const rP = parsePositive(b, "Resistance R");
        if (!vP.ok) return { error: vP.error };
        if (!rP.ok) return { error: rP.error };
        const computed = currentFromVR({ v: vP.value, r: rP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.i)} A`,
          primaryLabel: "Current I",
          rows: [
            { label: "V", value: `${num(vP.value)} V` },
            { label: "R", value: `${num(rP.value)} Ω` },
          ],
        };
      }
      case "resistance": {
        const vP = parseNonNegative(a, "Voltage V");
        const iP = parsePositive(b, "Current I");
        if (!vP.ok) return { error: vP.error };
        if (!iP.ok) return { error: iP.error };
        const computed = resistanceFromVI({ v: vP.value, i: iP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.r)} Ω`,
          primaryLabel: "Resistance R",
          rows: [
            { label: "V", value: `${num(vP.value)} V` },
            { label: "I", value: `${num(iP.value)} A` },
          ],
        };
      }
      case "power": {
        const vP = optionalPositive(v, "Voltage V");
        const iP = optionalPositive(i, "Current I");
        const rP = optionalPositive(r, "Resistance R");
        if (!vP.ok) return { error: vP.error };
        if (!iP.ok) return { error: iP.error };
        if (!rP.ok) return { error: rP.error };
        const computed = electricalPower({ v: vP.value, i: iP.value, r: rP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.pW)} W`,
          primaryLabel: "Power P",
          rows: [{ label: "Formula", value: computed.mode }],
        };
      }
      case "energy": {
        const pP = parseNonNegative(a, "Power (W)");
        const hP = parseNonNegative(b, "Hours");
        if (!pP.ok) return { error: pP.error };
        if (!hP.ok) return { error: hP.error };
        const computed = energyConsumption({ powerW: pP.value, hours: hP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.energyKwh, 3)} kWh`,
          primaryLabel: "Energy",
          rows: [
            { label: "Wh", value: num(computed.energyWh, 2) },
            { label: "Joules", value: num(computed.energyJ, 2) },
          ],
        };
      }
      case "series": {
        if (!w.trim()) return { error: "Enter at least one resistance (Ω)." };
        const computed = seriesResistance({ ohmsCsv: w });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.totalOhm)} Ω`,
          primaryLabel: "Series total R",
          rows: [{ label: "Resistors", value: String(computed.count) }],
        };
      }
      case "parallel": {
        if (!w.trim()) return { error: "Enter at least one resistance (Ω)." };
        const computed = parallelResistance({ ohmsCsv: w });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.totalOhm)} Ω`,
          primaryLabel: "Parallel Req",
          rows: [{ label: "Resistors", value: String(computed.count) }],
        };
      }
      case "capacitor": {
        const qP = optionalPositive(a, "Charge Q");
        const vP = optionalPositive(b, "Voltage V");
        const cP = optionalPositive(c, "Capacitance C");
        if (!qP.ok) return { error: qP.error };
        if (!vP.ok) return { error: vP.error };
        if (!cP.ok) return { error: cP.error };
        const computed = capacitorQV({ qC: qP.value, v: vP.value, cF: cP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `Solved ${computed.solved}`,
          primaryLabel: "Capacitor Q = CV",
          rows: [
            { label: "Q", value: `${num(computed.qC)} C` },
            { label: "V", value: `${num(computed.v)} V` },
            { label: "C", value: `${num(computed.cF)} F` },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, v, i, r, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "ohms" || config.mode === "power" ? (
            <>
              <div>
                <FieldLabel htmlFor="pe-v">Voltage V (leave blank if unknown)</FieldLabel>
                <FieldInput id="pe-v" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pe-i">Current I (leave blank if unknown)</FieldLabel>
                <FieldInput id="pe-i" value={i} onChange={(ev) => setI(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pe-r">Resistance R (leave blank if unknown)</FieldLabel>
                <FieldInput id="pe-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "voltage" ? (
            <>
              <div>
                <FieldLabel htmlFor="pe-vi">Current I (A)</FieldLabel>
                <FieldInput id="pe-vi" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pe-vr">Resistance R (Ω)</FieldLabel>
                <FieldInput id="pe-vr" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "current" ? (
            <>
              <div>
                <FieldLabel htmlFor="pe-cv">Voltage V (V)</FieldLabel>
                <FieldInput id="pe-cv" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pe-cr">Resistance R (Ω)</FieldLabel>
                <FieldInput id="pe-cr" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "resistance" ? (
            <>
              <div>
                <FieldLabel htmlFor="pe-rv">Voltage V (V)</FieldLabel>
                <FieldInput id="pe-rv" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pe-ri">Current I (A)</FieldLabel>
                <FieldInput id="pe-ri" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "energy" ? (
            <>
              <div>
                <FieldLabel htmlFor="pe-pw">Power (W)</FieldLabel>
                <FieldInput id="pe-pw" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pe-hr">Hours</FieldLabel>
                <FieldInput id="pe-hr" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "series" || config.mode === "parallel" ? (
            <div>
              <FieldLabel htmlFor="pe-csv">Resistances (Ω, CSV)</FieldLabel>
              <FieldInput id="pe-csv" value={w} onChange={(ev) => setW(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "capacitor" ? (
            <>
              <div>
                <FieldLabel htmlFor="pe-q">Charge Q (C, leave blank to solve)</FieldLabel>
                <FieldInput id="pe-q" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pe-capv">Voltage V (leave blank to solve)</FieldLabel>
                <FieldInput id="pe-capv" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pe-capc">Capacitance C (F, leave blank to solve)</FieldLabel>
                <FieldInput id="pe-capc" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
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
                {result.rows.map((row) => (
                  <Row key={row.label} label={row.label} value={row.value} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
