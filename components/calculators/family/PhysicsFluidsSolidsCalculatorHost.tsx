"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  PHYSICS_FLUIDS_URL,
  bernoulliDeltaP,
  buoyantForce,
  density,
  flowRate,
  hydrostaticPressure,
  pascalsLaw,
  pressure,
} from "@/lib/calculators/physicsFluidsSolids";

type FluidsSlug =
  | "density-calculator-physics"
  | "pressure-calculator-physics"
  | "hydrostatic-pressure-calculator"
  | "buoyant-force-calculator"
  | "pascals-law-calculator"
  | "bernoulli-equation-calculator"
  | "flow-rate-calculator";

type Mode =
  | "density"
  | "pressure"
  | "hydrostatic"
  | "buoyant"
  | "pascal"
  | "bernoulli"
  | "flowRate";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
};

const CONFIG: Record<FluidsSlug, Config> = {
  "density-calculator-physics": {
    title: "Density calculator",
    description: "ρ = m / V in SI (kg/m³).",
    mode: "density",
    aDefault: "1000",
    bDefault: "1",
    cDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "pressure-calculator-physics": {
    title: "Pressure calculator",
    description: "P = F / A in SI (Pa).",
    mode: "pressure",
    aDefault: "100",
    bDefault: "0.01",
    cDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "hydrostatic-pressure-calculator": {
    title: "Hydrostatic pressure",
    description: "P = ρ g h with g ≈ 9.80665 m/s².",
    mode: "hydrostatic",
    aDefault: "1000",
    bDefault: "10",
    cDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "buoyant-force-calculator": {
    title: "Buoyant force",
    description: "Fᵦ = ρ_fluid V_displaced g (Archimedes).",
    mode: "buoyant",
    aDefault: "1000",
    bDefault: "0.002",
    cDefault: "",
    rDefault: "",
    tDefault: "",
  },
  "pascals-law-calculator": {
    title: "Pascal’s law",
    description: "F₁/A₁ = F₂/A₂ — leave exactly one field blank to solve.",
    mode: "pascal",
    aDefault: "100",
    bDefault: "0.01",
    cDefault: "",
    rDefault: "0.05",
    tDefault: "",
  },
  "bernoulli-equation-calculator": {
    title: "Bernoulli ΔP",
    description: "Simplified ΔP = P₁ − P₂ from density, speeds, and heights.",
    mode: "bernoulli",
    aDefault: "1000",
    bDefault: "2",
    cDefault: "4",
    rDefault: "0",
    tDefault: "1",
  },
  "flow-rate-calculator": {
    title: "Flow rate",
    description: "Q = A v (volumetric, m³/s).",
    mode: "flowRate",
    aDefault: "0.01",
    bDefault: "2",
    cDefault: "",
    rDefault: "",
    tDefault: "",
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

export function PhysicsFluidsSolidsCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as FluidsSlug] ?? CONFIG["density-calculator-physics"];
  const [a, setA] = useState(useLoanInitialInput(PHYSICS_FLUIDS_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(PHYSICS_FLUIDS_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(PHYSICS_FLUIDS_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(PHYSICS_FLUIDS_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(PHYSICS_FLUIDS_URL.T, config.tDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    const base = {
      [PHYSICS_FLUIDS_URL.A]: a,
      [PHYSICS_FLUIDS_URL.B]: b,
    };
    if (config.mode === "pascal") {
      return { ...base, [PHYSICS_FLUIDS_URL.C]: c, [PHYSICS_FLUIDS_URL.R]: r };
    }
    if (config.mode === "bernoulli") {
      return {
        ...base,
        [PHYSICS_FLUIDS_URL.C]: c,
        [PHYSICS_FLUIDS_URL.R]: r,
        [PHYSICS_FLUIDS_URL.T]: t,
      };
    }
    return base;
  }, [a, b, c, r, t, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "density": {
        const massP = parseNonNegative(a, "Mass (kg)");
        const volP = parsePositive(b, "Volume (m³)");
        if (!massP.ok) return { error: massP.error };
        if (!volP.ok) return { error: volP.error };
        const computed = density({ massKg: massP.value, volumeM3: volP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.density)} kg/m³`,
          primaryLabel: "Density ρ",
          rows: [
            { label: "Mass", value: `${num(massP.value)} kg` },
            { label: "Volume", value: `${num(volP.value)} m³` },
          ],
        };
      }
      case "pressure": {
        const forceP = parseNonNegative(a, "Force (N)");
        const areaP = parsePositive(b, "Area (m²)");
        if (!forceP.ok) return { error: forceP.error };
        if (!areaP.ok) return { error: areaP.error };
        const computed = pressure({ forceN: forceP.value, areaM2: areaP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.pressurePa)} Pa`,
          primaryLabel: "Pressure",
          rows: [
            { label: "Force", value: `${num(forceP.value)} N` },
            { label: "Area", value: `${num(areaP.value)} m²` },
          ],
        };
      }
      case "hydrostatic": {
        const densP = parsePositive(a, "Density (kg/m³)");
        const depthP = parseNonNegative(b, "Depth (m)");
        if (!densP.ok) return { error: densP.error };
        if (!depthP.ok) return { error: depthP.error };
        const computed = hydrostaticPressure({
          densityKgM3: densP.value,
          depthM: depthP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.pressurePa)} Pa`,
          primaryLabel: "Hydrostatic pressure",
          rows: [
            { label: "Density", value: `${num(densP.value)} kg/m³` },
            { label: "Depth", value: `${num(depthP.value)} m` },
            { label: "g", value: "9.80665 m/s²" },
          ],
        };
      }
      case "buoyant": {
        const densP = parsePositive(a, "Fluid density (kg/m³)");
        const volP = parsePositive(b, "Displaced volume (m³)");
        if (!densP.ok) return { error: densP.error };
        if (!volP.ok) return { error: volP.error };
        const computed = buoyantForce({
          fluidDensityKgM3: densP.value,
          displacedVolumeM3: volP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.forceN)} N`,
          primaryLabel: "Buoyant force",
          rows: [
            { label: "Fluid density", value: `${num(densP.value)} kg/m³` },
            { label: "Displaced volume", value: `${num(volP.value)} m³` },
          ],
        };
      }
      case "pascal": {
        const f1P = optionalPositive(a, "F1 (N)");
        const a1P = optionalPositive(b, "A1 (m²)");
        const f2P = optionalPositive(c, "F2 (N)");
        const a2P = optionalPositive(r, "A2 (m²)");
        if (!f1P.ok) return { error: f1P.error };
        if (!a1P.ok) return { error: a1P.error };
        if (!f2P.ok) return { error: f2P.error };
        if (!a2P.ok) return { error: a2P.error };
        const computed = pascalsLaw({
          f1: f1P.value,
          a1: a1P.value,
          f2: f2P.value,
          a2: a2P.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.pressurePa)} Pa`,
          primaryLabel: "Pressure (F/A)",
          rows: [
            { label: "F1", value: `${num(computed.f1)} N` },
            { label: "A1", value: `${num(computed.a1)} m²` },
            { label: "F2", value: `${num(computed.f2)} N` },
            { label: "A2", value: `${num(computed.a2)} m²` },
          ],
        };
      }
      case "bernoulli": {
        const densP = parsePositive(a, "Density (kg/m³)");
        const v1P = parseNonNegative(b, "v1 (m/s)");
        const v2P = parseNonNegative(c, "v2 (m/s)");
        const h1P = parseFiniteNumber(r, "h1 (m)");
        const h2P = parseFiniteNumber(t, "h2 (m)");
        if (!densP.ok) return { error: densP.error };
        if (!v1P.ok) return { error: v1P.error };
        if (!v2P.ok) return { error: v2P.error };
        if (!h1P.ok) return { error: h1P.error };
        if (!h2P.ok) return { error: h2P.error };
        const computed = bernoulliDeltaP({
          densityKgM3: densP.value,
          v1: v1P.value,
          v2: v2P.value,
          h1: h1P.value,
          h2: h2P.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.deltaP)} Pa`,
          primaryLabel: "ΔP (P1 − P2)",
          rows: [
            { label: "Note", value: computed.note },
            { label: "v1 → v2", value: `${num(v1P.value)} → ${num(v2P.value)} m/s` },
            { label: "h1 → h2", value: `${num(h1P.value)} → ${num(h2P.value)} m` },
          ],
        };
      }
      case "flowRate": {
        const areaP = parsePositive(a, "Area (m²)");
        const velP = parseNonNegative(b, "Velocity (m/s)");
        if (!areaP.ok) return { error: areaP.error };
        if (!velP.ok) return { error: velP.error };
        const computed = flowRate({ areaM2: areaP.value, velocityMs: velP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.qM3s)} m³/s`,
          primaryLabel: "Volume flow rate Q",
          rows: [
            { label: "Area", value: `${num(areaP.value)} m²` },
            { label: "Velocity", value: `${num(velP.value)} m/s` },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "density" ? (
            <>
              <div>
                <FieldLabel htmlFor="pf-mass">Mass (kg)</FieldLabel>
                <FieldInput id="pf-mass" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pf-vol">Volume (m³)</FieldLabel>
                <FieldInput id="pf-vol" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "pressure" ? (
            <>
              <div>
                <FieldLabel htmlFor="pf-force">Force (N)</FieldLabel>
                <FieldInput id="pf-force" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pf-area">Area (m²)</FieldLabel>
                <FieldInput id="pf-area" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "hydrostatic" ? (
            <>
              <div>
                <FieldLabel htmlFor="pf-dens">Density (kg/m³)</FieldLabel>
                <FieldInput id="pf-dens" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pf-depth">Depth (m)</FieldLabel>
                <FieldInput id="pf-depth" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "buoyant" ? (
            <>
              <div>
                <FieldLabel htmlFor="pf-fdens">Fluid density (kg/m³)</FieldLabel>
                <FieldInput id="pf-fdens" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pf-dvol">Displaced volume (m³)</FieldLabel>
                <FieldInput id="pf-dvol" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "pascal" ? (
            <>
              <div>
                <FieldLabel htmlFor="pf-f1">F1 (N, leave blank to solve)</FieldLabel>
                <FieldInput id="pf-f1" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pf-a1">A1 (m², leave blank to solve)</FieldLabel>
                <FieldInput id="pf-a1" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pf-f2">F2 (N, leave blank to solve)</FieldLabel>
                <FieldInput id="pf-f2" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pf-a2">A2 (m², leave blank to solve)</FieldLabel>
                <FieldInput id="pf-a2" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "bernoulli" ? (
            <>
              <div>
                <FieldLabel htmlFor="pf-bdens">Density (kg/m³)</FieldLabel>
                <FieldInput id="pf-bdens" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pf-v1">v1 (m/s)</FieldLabel>
                <FieldInput id="pf-v1" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pf-v2">v2 (m/s)</FieldLabel>
                <FieldInput id="pf-v2" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pf-h1">h1 (m)</FieldLabel>
                <FieldInput id="pf-h1" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pf-h2">h2 (m)</FieldLabel>
                <FieldInput id="pf-h2" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "flowRate" ? (
            <>
              <div>
                <FieldLabel htmlFor="pf-fare">Area (m²)</FieldLabel>
                <FieldInput id="pf-fare" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pf-vel">Velocity (m/s)</FieldLabel>
                <FieldInput id="pf-vel" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
