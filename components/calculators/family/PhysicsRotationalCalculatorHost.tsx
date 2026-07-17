"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  PHYSICS_ROTATIONAL_URL,
  angularAcceleration,
  momentOfInertia,
  rotationalKe,
  torque,
} from "@/lib/calculators/physicsRotational";

type RotSlug =
  | "torque-calculator"
  | "angular-acceleration-calculator"
  | "moment-of-inertia-calculator"
  | "rotational-kinetic-energy-calculator";

type Mode = "torque" | "angularAcceleration" | "momentOfInertia" | "rotationalKe";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const CONFIG: Record<RotSlug, Config> = {
  "torque-calculator": {
    title: "Torque calculator",
    description: "τ = r F sin θ in N·m.",
    mode: "torque",
    aDefault: "0.5",
    bDefault: "20",
    cDefault: "90",
  },
  "angular-acceleration-calculator": {
    title: "Angular acceleration",
    description: "α = τ / I from torque and moment of inertia.",
    mode: "angularAcceleration",
    aDefault: "10",
    bDefault: "2",
    cDefault: "",
  },
  "moment-of-inertia-calculator": {
    title: "Moment of inertia",
    description: "Point mass: I = m r².",
    mode: "momentOfInertia",
    aDefault: "2",
    bDefault: "0.5",
    cDefault: "",
  },
  "rotational-kinetic-energy-calculator": {
    title: "Rotational KE",
    description: "KE_rot = ½ I ω².",
    mode: "rotationalKe",
    aDefault: "2",
    bDefault: "5",
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

export function PhysicsRotationalCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as RotSlug] ?? CONFIG["torque-calculator"];
  const [a, setA] = useState(useLoanInitialInput(PHYSICS_ROTATIONAL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(PHYSICS_ROTATIONAL_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(PHYSICS_ROTATIONAL_URL.C, config.cDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    const base = {
      [PHYSICS_ROTATIONAL_URL.A]: a,
      [PHYSICS_ROTATIONAL_URL.B]: b,
    };
    if (config.mode === "torque") {
      return { ...base, [PHYSICS_ROTATIONAL_URL.C]: c };
    }
    return base;
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "torque": {
        const rP = parseNonNegative(a, "Lever arm r (m)");
        const fP = parseFiniteNumber(b, "Force F (N)");
        const angP = parseFiniteNumber(c, "Angle (°)");
        if (!rP.ok) return { error: rP.error };
        if (!fP.ok) return { error: fP.error };
        if (!angP.ok) return { error: angP.error };
        const computed = torque({ r: rP.value, force: fP.value, angleDeg: angP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.torqueNm)} N·m`,
          primaryLabel: "Torque τ",
          rows: [
            { label: "r", value: `${num(rP.value)} m` },
            { label: "F", value: `${num(fP.value)} N` },
            { label: "Angle", value: `${num(angP.value)}°` },
          ],
        };
      }
      case "angularAcceleration": {
        const tauP = parseFiniteNumber(a, "Torque (N·m)");
        const iP = parsePositive(b, "Moment of inertia I (kg·m²)");
        if (!tauP.ok) return { error: tauP.error };
        if (!iP.ok) return { error: iP.error };
        const computed = angularAcceleration({
          mode: "fromTorque",
          torque: tauP.value,
          inertia: iP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.alpha)} rad/s²`,
          primaryLabel: "Angular acceleration α",
          rows: [
            { label: "Torque", value: `${num(tauP.value)} N·m` },
            { label: "I", value: `${num(iP.value)} kg·m²` },
          ],
        };
      }
      case "momentOfInertia": {
        const mP = parseNonNegative(a, "Mass (kg)");
        const rP = parseNonNegative(b, "Radius (m)");
        if (!mP.ok) return { error: mP.error };
        if (!rP.ok) return { error: rP.error };
        const computed = momentOfInertia({ mode: "mr2", mass: mP.value, radius: rP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.inertia)} kg·m²`,
          primaryLabel: "Moment of inertia I",
          rows: [
            { label: "Mass", value: `${num(mP.value)} kg` },
            { label: "Radius", value: `${num(rP.value)} m` },
          ],
        };
      }
      case "rotationalKe": {
        const iP = parseNonNegative(a, "Moment of inertia I (kg·m²)");
        const wP = parseFiniteNumber(b, "Angular speed ω (rad/s)");
        if (!iP.ok) return { error: iP.error };
        if (!wP.ok) return { error: wP.error };
        const computed = rotationalKe({ inertia: iP.value, omega: wP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.keJ)} J`,
          primaryLabel: "Rotational KE",
          rows: [
            { label: "I", value: `${num(iP.value)} kg·m²` },
            { label: "ω", value: `${num(wP.value)} rad/s` },
          ],
        };
      }
    }
  }, [config.mode, a, b, c]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "torque" ? (
            <>
              <div>
                <FieldLabel htmlFor="pr-r">Lever arm r (m)</FieldLabel>
                <FieldInput id="pr-r" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pr-f">Force F (N)</FieldLabel>
                <FieldInput id="pr-f" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pr-ang">Angle (°)</FieldLabel>
                <FieldInput id="pr-ang" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "angularAcceleration" ? (
            <>
              <div>
                <FieldLabel htmlFor="pr-tau">Torque τ (N·m)</FieldLabel>
                <FieldInput id="pr-tau" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pr-i">Moment of inertia I (kg·m²)</FieldLabel>
                <FieldInput id="pr-i" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "momentOfInertia" ? (
            <>
              <div>
                <FieldLabel htmlFor="pr-m">Mass m (kg)</FieldLabel>
                <FieldInput id="pr-m" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pr-rad">Radius r (m)</FieldLabel>
                <FieldInput id="pr-rad" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "rotationalKe" ? (
            <>
              <div>
                <FieldLabel htmlFor="pr-ki">Moment of inertia I (kg·m²)</FieldLabel>
                <FieldInput id="pr-ki" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pr-w">Angular speed ω (rad/s)</FieldLabel>
                <FieldInput id="pr-w" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
