"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  PHYSICS_GRAVITATION_URL,
  escapeVelocity,
  gravitationalForce,
  gravitationalPe,
  orbitalVelocity,
} from "@/lib/calculators/physicsGravitation";

type GravSlug =
  | "gravitational-force-calculator"
  | "escape-velocity-calculator"
  | "orbital-velocity-calculator"
  | "gravitational-potential-energy-calculator";

type Mode = "gravitationalForce" | "escapeVelocity" | "orbitalVelocity" | "gravitationalPe";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const CONFIG: Record<GravSlug, Config> = {
  "gravitational-force-calculator": {
    title: "Gravitational force",
    description: "F = G m₁ m₂ / r² (Newton’s law of gravitation).",
    mode: "gravitationalForce",
    aDefault: "5.972e24",
    bDefault: "1000",
    cDefault: "6.371e6",
  },
  "escape-velocity-calculator": {
    title: "Escape velocity",
    description: "v_esc = √(2 G M / R) from a spherical body surface.",
    mode: "escapeVelocity",
    aDefault: "5.972e24",
    bDefault: "6.371e6",
    cDefault: "",
  },
  "orbital-velocity-calculator": {
    title: "Orbital velocity",
    description: "v_orb = √(G M / R) for a circular orbit.",
    mode: "orbitalVelocity",
    aDefault: "5.972e24",
    bDefault: "6.671e6",
    cDefault: "",
  },
  "gravitational-potential-energy-calculator": {
    title: "Gravitational PE",
    description: "Near-surface U ≈ m g h (g ≈ 9.80665 m/s²).",
    mode: "gravitationalPe",
    aDefault: "2",
    bDefault: "10",
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

export function PhysicsGravitationCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as GravSlug] ?? CONFIG["gravitational-force-calculator"];
  const [a, setA] = useState(useLoanInitialInput(PHYSICS_GRAVITATION_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(PHYSICS_GRAVITATION_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(PHYSICS_GRAVITATION_URL.C, config.cDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    const base = {
      [PHYSICS_GRAVITATION_URL.A]: a,
      [PHYSICS_GRAVITATION_URL.B]: b,
    };
    if (config.mode === "gravitationalForce") {
      return { ...base, [PHYSICS_GRAVITATION_URL.C]: c };
    }
    return base;
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "gravitationalForce": {
        const m1P = parseNonNegative(a, "Mass m1 (kg)");
        const m2P = parseNonNegative(b, "Mass m2 (kg)");
        const rP = parsePositive(c, "Separation r (m)");
        if (!m1P.ok) return { error: m1P.error };
        if (!m2P.ok) return { error: m2P.error };
        if (!rP.ok) return { error: rP.error };
        const computed = gravitationalForce({ m1: m1P.value, m2: m2P.value, r: rP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.forceN)} N`,
          primaryLabel: "Gravitational force",
          rows: [
            { label: "m1", value: `${num(m1P.value)} kg` },
            { label: "m2", value: `${num(m2P.value)} kg` },
            { label: "r", value: `${num(rP.value)} m` },
            { label: "G", value: "6.6743×10⁻¹¹ N·m²/kg²" },
          ],
        };
      }
      case "escapeVelocity": {
        const mP = parsePositive(a, "Central mass M (kg)");
        const rP = parsePositive(b, "Radius R (m)");
        if (!mP.ok) return { error: mP.error };
        if (!rP.ok) return { error: rP.error };
        const computed = escapeVelocity({ massCentral: mP.value, radius: rP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.vEsc)} m/s`,
          primaryLabel: "Escape velocity",
          rows: [
            { label: "M", value: `${num(mP.value)} kg` },
            { label: "R", value: `${num(rP.value)} m` },
          ],
        };
      }
      case "orbitalVelocity": {
        const mP = parsePositive(a, "Central mass M (kg)");
        const rP = parsePositive(b, "Orbit radius R (m)");
        if (!mP.ok) return { error: mP.error };
        if (!rP.ok) return { error: rP.error };
        const computed = orbitalVelocity({ massCentral: mP.value, radius: rP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.vOrb)} m/s`,
          primaryLabel: "Orbital velocity",
          rows: [
            { label: "M", value: `${num(mP.value)} kg` },
            { label: "R", value: `${num(rP.value)} m` },
          ],
        };
      }
      case "gravitationalPe": {
        const mP = parseNonNegative(a, "Mass m (kg)");
        const hP = parseNonNegative(b, "Height h (m)");
        if (!mP.ok) return { error: mP.error };
        if (!hP.ok) return { error: hP.error };
        const computed = gravitationalPe({ mode: "surface", mass: mP.value, height: hP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.peJ)} J`,
          primaryLabel: "Potential energy",
          rows: [
            { label: "Formula", value: computed.formula },
            { label: "Mass", value: `${num(mP.value)} kg` },
            { label: "Height", value: `${num(hP.value)} m` },
            { label: "g", value: "9.80665 m/s²" },
          ],
        };
      }
    }
  }, [config.mode, a, b, c]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "gravitationalForce" ? (
            <>
              <div>
                <FieldLabel htmlFor="pg-m1">Mass m1 (kg)</FieldLabel>
                <FieldInput id="pg-m1" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pg-m2">Mass m2 (kg)</FieldLabel>
                <FieldInput id="pg-m2" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pg-r">Separation r (m)</FieldLabel>
                <FieldInput id="pg-r" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "escapeVelocity" || config.mode === "orbitalVelocity" ? (
            <>
              <div>
                <FieldLabel htmlFor="pg-M">Central mass M (kg)</FieldLabel>
                <FieldInput id="pg-M" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pg-R">
                  {config.mode === "orbitalVelocity" ? "Orbit radius R (m)" : "Radius R (m)"}
                </FieldLabel>
                <FieldInput id="pg-R" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "gravitationalPe" ? (
            <>
              <div>
                <FieldLabel htmlFor="pg-m">Mass m (kg)</FieldLabel>
                <FieldInput id="pg-m" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pg-h">Height h (m)</FieldLabel>
                <FieldInput id="pg-h" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
