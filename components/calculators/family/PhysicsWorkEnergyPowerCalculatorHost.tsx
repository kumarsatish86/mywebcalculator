"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  PHYSICS_WEP_URL,
  efficiency,
  kineticEnergy,
  mechanicalEnergy,
  potentialEnergy,
  power,
  work,
} from "@/lib/calculators/physicsWorkEnergyPower";

type WepSlug =
  | "work-calculator-physics"
  | "kinetic-energy-calculator"
  | "potential-energy-calculator"
  | "mechanical-energy-calculator"
  | "power-calculator-physics"
  | "efficiency-calculator-physics";

type Mode = "work" | "kineticEnergy" | "potentialEnergy" | "mechanicalEnergy" | "power" | "efficiency";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const CONFIG: Record<WepSlug, Config> = {
  "work-calculator-physics": {
    title: "Work calculator",
    description: "W = F d cos θ in joules (SI).",
    mode: "work",
    aDefault: "50",
    bDefault: "2",
    cDefault: "0",
  },
  "kinetic-energy-calculator": {
    title: "Kinetic energy",
    description: "KE = ½ m v².",
    mode: "kineticEnergy",
    aDefault: "2",
    bDefault: "10",
    cDefault: "",
  },
  "potential-energy-calculator": {
    title: "Gravitational PE",
    description: "PE ≈ m g h with g ≈ 9.80665 m/s².",
    mode: "potentialEnergy",
    aDefault: "2",
    bDefault: "5",
    cDefault: "",
  },
  "mechanical-energy-calculator": {
    title: "Mechanical energy",
    description: "ME = KE + PE (conservative textbook sum).",
    mode: "mechanicalEnergy",
    aDefault: "100",
    bDefault: "50",
    cDefault: "",
  },
  "power-calculator-physics": {
    title: "Power",
    description: "P = W / t in watts.",
    mode: "power",
    aDefault: "200",
    bDefault: "4",
    cDefault: "",
  },
  "efficiency-calculator-physics": {
    title: "Efficiency",
    description: "η = useful / total (ratio and percent).",
    mode: "efficiency",
    aDefault: "80",
    bDefault: "100",
    cDefault: "",
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

export function PhysicsWorkEnergyPowerCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as WepSlug] ?? CONFIG["work-calculator-physics"];
  const [a, setA] = useState(useLoanInitialInput(PHYSICS_WEP_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(PHYSICS_WEP_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(PHYSICS_WEP_URL.C, config.cDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    const base = {
      [PHYSICS_WEP_URL.A]: a,
      [PHYSICS_WEP_URL.B]: b,
    };
    if (config.mode === "work") {
      return { ...base, [PHYSICS_WEP_URL.C]: c };
    }
    return base;
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "work": {
        const fP = parseFiniteNumber(a, "Force (N)");
        const dP = parseNonNegative(b, "Distance (m)");
        const angP = parseFiniteNumber(c, "Angle (°)");
        if (!fP.ok) return { error: fP.error };
        if (!dP.ok) return { error: dP.error };
        if (!angP.ok) return { error: angP.error };
        const computed = work({ force: fP.value, distance: dP.value, angleDeg: angP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.workJ)} J`,
          primaryLabel: "Work W",
          rows: [
            { label: "Force", value: `${num(fP.value)} N` },
            { label: "Distance", value: `${num(dP.value)} m` },
            { label: "Angle", value: `${num(angP.value)}°` },
          ],
        };
      }
      case "kineticEnergy": {
        const mP = parseNonNegative(a, "Mass (kg)");
        const vP = parseFiniteNumber(b, "Velocity (m/s)");
        if (!mP.ok) return { error: mP.error };
        if (!vP.ok) return { error: vP.error };
        const computed = kineticEnergy({ mass: mP.value, velocity: vP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.keJ)} J`,
          primaryLabel: "Kinetic energy",
          rows: [
            { label: "Mass", value: `${num(mP.value)} kg` },
            { label: "Velocity", value: `${num(vP.value)} m/s` },
          ],
        };
      }
      case "potentialEnergy": {
        const mP = parseNonNegative(a, "Mass (kg)");
        const hP = parseNonNegative(b, "Height (m)");
        if (!mP.ok) return { error: mP.error };
        if (!hP.ok) return { error: hP.error };
        const computed = potentialEnergy({ mass: mP.value, height: hP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.peJ)} J`,
          primaryLabel: "Potential energy",
          rows: [
            { label: "Mass", value: `${num(mP.value)} kg` },
            { label: "Height", value: `${num(hP.value)} m` },
            { label: "g", value: "9.80665 m/s²" },
          ],
        };
      }
      case "mechanicalEnergy": {
        const keP = parseNonNegative(a, "KE (J)");
        const peP = parseNonNegative(b, "PE (J)");
        if (!keP.ok) return { error: keP.error };
        if (!peP.ok) return { error: peP.error };
        const computed = mechanicalEnergy({ ke: keP.value, pe: peP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.meJ)} J`,
          primaryLabel: "Mechanical energy",
          rows: [
            { label: "KE", value: `${num(keP.value)} J` },
            { label: "PE", value: `${num(peP.value)} J` },
          ],
        };
      }
      case "power": {
        const wP = parseFiniteNumber(a, "Work (J)");
        const tP = parsePositive(b, "Time (s)");
        if (!wP.ok) return { error: wP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = power({ workJ: wP.value, time: tP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.powerW)} W`,
          primaryLabel: "Power P",
          rows: [
            { label: "Work", value: `${num(wP.value)} J` },
            { label: "Time", value: `${num(tP.value)} s` },
          ],
        };
      }
      case "efficiency": {
        const uP = parseNonNegative(a, "Useful energy");
        const tP = parsePositive(b, "Total energy");
        if (!uP.ok) return { error: uP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = efficiency({ useful: uP.value, total: tP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.percent)}%`,
          primaryLabel: "Efficiency",
          rows: [
            { label: "Ratio", value: num(computed.ratio) },
            { label: "Useful", value: num(uP.value) },
            { label: "Total", value: num(tP.value) },
          ],
        };
      }
    }
  }, [config.mode, a, b, c]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "work" ? (
            <>
              <div>
                <FieldLabel htmlFor="pw-f">Force F (N)</FieldLabel>
                <FieldInput id="pw-f" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pw-d">Distance d (m)</FieldLabel>
                <FieldInput id="pw-d" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pw-ang">Angle (°)</FieldLabel>
                <FieldInput id="pw-ang" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "kineticEnergy" ? (
            <>
              <div>
                <FieldLabel htmlFor="pw-km">Mass m (kg)</FieldLabel>
                <FieldInput id="pw-km" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pw-kv">Velocity v (m/s)</FieldLabel>
                <FieldInput id="pw-kv" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "potentialEnergy" ? (
            <>
              <div>
                <FieldLabel htmlFor="pw-pm">Mass m (kg)</FieldLabel>
                <FieldInput id="pw-pm" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pw-ph">Height h (m)</FieldLabel>
                <FieldInput id="pw-ph" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "mechanicalEnergy" ? (
            <>
              <div>
                <FieldLabel htmlFor="pw-ke">Kinetic energy KE (J)</FieldLabel>
                <FieldInput id="pw-ke" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pw-pe">Potential energy PE (J)</FieldLabel>
                <FieldInput id="pw-pe" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "power" ? (
            <>
              <div>
                <FieldLabel htmlFor="pw-w">Work W (J)</FieldLabel>
                <FieldInput id="pw-w" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pw-t">Time t (s)</FieldLabel>
                <FieldInput id="pw-t" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "efficiency" ? (
            <>
              <div>
                <FieldLabel htmlFor="pw-u">Useful energy / work</FieldLabel>
                <FieldInput id="pw-u" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pw-tot">Total input energy / work</FieldLabel>
                <FieldInput id="pw-tot" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
