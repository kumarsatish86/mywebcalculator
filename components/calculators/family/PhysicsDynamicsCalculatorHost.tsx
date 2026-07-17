"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  PHYSICS_DYNAMICS_URL,
  accelerationFromForce,
  angularVelocity,
  centripetalAcceleration,
  centripetalForce,
  coefficientOfFriction,
  forceFma,
  frictionForce,
  massFromForce,
  netForce,
} from "@/lib/calculators/physicsDynamics";

type DynamicsSlug =
  | "force-calculator-f-ma"
  | "mass-calculator-physics"
  | "acceleration-from-force-calculator"
  | "net-force-calculator"
  | "friction-force-calculator"
  | "coefficient-of-friction-calculator"
  | "centripetal-force-calculator"
  | "centripetal-acceleration-calculator"
  | "angular-velocity-calculator";

type Mode =
  | "forceFma"
  | "massFromForce"
  | "accelerationFromForce"
  | "netForce"
  | "frictionForce"
  | "coefficientOfFriction"
  | "centripetalForce"
  | "centripetalAcceleration"
  | "angularVelocity";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  wDefault: string;
};

const CONFIG: Record<DynamicsSlug, Config> = {
  "force-calculator-f-ma": {
    title: "Force F = ma",
    description: "Newton’s second law: F = m a in SI (N).",
    mode: "forceFma",
    aDefault: "10",
    bDefault: "2",
    cDefault: "",
    wDefault: "",
  },
  "mass-calculator-physics": {
    title: "Mass from force",
    description: "m = F / a from net force and acceleration.",
    mode: "massFromForce",
    aDefault: "20",
    bDefault: "2",
    cDefault: "",
    wDefault: "",
  },
  "acceleration-from-force-calculator": {
    title: "Acceleration from force",
    description: "a = F / m for a single net force.",
    mode: "accelerationFromForce",
    aDefault: "20",
    bDefault: "5",
    cDefault: "",
    wDefault: "",
  },
  "net-force-calculator": {
    title: "Net force",
    description: "Sum signed 1D forces (comma-separated).",
    mode: "netForce",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    wDefault: "10, -3, 5",
  },
  "friction-force-calculator": {
    title: "Friction force",
    description: "f = μ N (kinetic/static magnitude model).",
    mode: "frictionForce",
    aDefault: "0.3",
    bDefault: "100",
    cDefault: "",
    wDefault: "",
  },
  "coefficient-of-friction-calculator": {
    title: "Coefficient of friction",
    description: "μ = f / N from friction and normal force.",
    mode: "coefficientOfFriction",
    aDefault: "30",
    bDefault: "100",
    cDefault: "",
    wDefault: "",
  },
  "centripetal-force-calculator": {
    title: "Centripetal force",
    description: "F_c = m v² / r for uniform circular motion.",
    mode: "centripetalForce",
    aDefault: "2",
    bDefault: "10",
    cDefault: "5",
    wDefault: "",
  },
  "centripetal-acceleration-calculator": {
    title: "Centripetal acceleration",
    description: "a_c = v² / r.",
    mode: "centripetalAcceleration",
    aDefault: "10",
    bDefault: "5",
    cDefault: "",
    wDefault: "",
  },
  "angular-velocity-calculator": {
    title: "Angular velocity",
    description: "ω = v / r (from tangential speed).",
    mode: "angularVelocity",
    aDefault: "10",
    bDefault: "2",
    cDefault: "",
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

export function PhysicsDynamicsCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as DynamicsSlug] ?? CONFIG["force-calculator-f-ma"];
  const [a, setA] = useState(useLoanInitialInput(PHYSICS_DYNAMICS_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(PHYSICS_DYNAMICS_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(PHYSICS_DYNAMICS_URL.C, config.cDefault));
  const [w, setW] = useState(useLoanInitialInput(PHYSICS_DYNAMICS_URL.W, config.wDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    if (config.mode === "netForce") {
      return { [PHYSICS_DYNAMICS_URL.W]: w };
    }
    const base = {
      [PHYSICS_DYNAMICS_URL.A]: a,
      [PHYSICS_DYNAMICS_URL.B]: b,
    };
    if (config.mode === "centripetalForce") {
      return { ...base, [PHYSICS_DYNAMICS_URL.C]: c };
    }
    return base;
  }, [a, b, c, w, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, w]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "forceFma": {
        const mP = parseNonNegative(a, "Mass (kg)");
        const aP = parseFiniteNumber(b, "Acceleration (m/s²)");
        if (!mP.ok) return { error: mP.error };
        if (!aP.ok) return { error: aP.error };
        const computed = forceFma({ m: mP.value, a: aP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.f)} N`,
          primaryLabel: "Force F",
          rows: [
            { label: "Mass", value: `${num(mP.value)} kg` },
            { label: "Acceleration", value: `${num(aP.value)} m/s²` },
          ],
        };
      }
      case "massFromForce": {
        const fP = parseFiniteNumber(a, "Force (N)");
        const aP = parseFiniteNumber(b, "Acceleration (m/s²)");
        if (!fP.ok) return { error: fP.error };
        if (!aP.ok) return { error: aP.error };
        const computed = massFromForce({ f: fP.value, a: aP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.m)} kg`,
          primaryLabel: "Mass m",
          rows: [
            { label: "Force", value: `${num(fP.value)} N` },
            { label: "Acceleration", value: `${num(aP.value)} m/s²` },
          ],
        };
      }
      case "accelerationFromForce": {
        const fP = parseFiniteNumber(a, "Force (N)");
        const mP = parsePositive(b, "Mass (kg)");
        if (!fP.ok) return { error: fP.error };
        if (!mP.ok) return { error: mP.error };
        const computed = accelerationFromForce({ f: fP.value, m: mP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.a)} m/s²`,
          primaryLabel: "Acceleration a",
          rows: [
            { label: "Force", value: `${num(fP.value)} N` },
            { label: "Mass", value: `${num(mP.value)} kg` },
          ],
        };
      }
      case "netForce": {
        if (w.trim() === "") return { error: "Enter at least one force (signed, comma-separated)." };
        const computed = netForce({ forcesCsv: w });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.net)} N`,
          primaryLabel: "Net force",
          rows: [{ label: "Forces counted", value: String(computed.count) }],
        };
      }
      case "frictionForce": {
        const muP = parseNonNegative(a, "μ");
        const nP = parseNonNegative(b, "Normal force N (N)");
        if (!muP.ok) return { error: muP.error };
        if (!nP.ok) return { error: nP.error };
        const computed = frictionForce({ mu: muP.value, normal: nP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.friction)} N`,
          primaryLabel: "Friction force",
          rows: [
            { label: "μ", value: num(muP.value) },
            { label: "Normal", value: `${num(nP.value)} N` },
          ],
        };
      }
      case "coefficientOfFriction": {
        const fP = parseNonNegative(a, "Friction (N)");
        const nP = parsePositive(b, "Normal force N (N)");
        if (!fP.ok) return { error: fP.error };
        if (!nP.ok) return { error: nP.error };
        const computed = coefficientOfFriction({ friction: fP.value, normal: nP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.mu),
          primaryLabel: "Coefficient μ",
          rows: [
            { label: "Friction", value: `${num(fP.value)} N` },
            { label: "Normal", value: `${num(nP.value)} N` },
          ],
        };
      }
      case "centripetalForce": {
        const mP = parseNonNegative(a, "Mass (kg)");
        const vP = parseFiniteNumber(b, "Speed v (m/s)");
        const rP = parsePositive(c, "Radius r (m)");
        if (!mP.ok) return { error: mP.error };
        if (!vP.ok) return { error: vP.error };
        if (!rP.ok) return { error: rP.error };
        const computed = centripetalForce({ m: mP.value, v: vP.value, r: rP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.f)} N`,
          primaryLabel: "Centripetal force",
          rows: [
            { label: "Mass", value: `${num(mP.value)} kg` },
            { label: "Speed", value: `${num(vP.value)} m/s` },
            { label: "Radius", value: `${num(rP.value)} m` },
          ],
        };
      }
      case "centripetalAcceleration": {
        const vP = parseFiniteNumber(a, "Speed v (m/s)");
        const rP = parsePositive(b, "Radius r (m)");
        if (!vP.ok) return { error: vP.error };
        if (!rP.ok) return { error: rP.error };
        const computed = centripetalAcceleration({ v: vP.value, r: rP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.a)} m/s²`,
          primaryLabel: "Centripetal acceleration",
          rows: [
            { label: "Speed", value: `${num(vP.value)} m/s` },
            { label: "Radius", value: `${num(rP.value)} m` },
          ],
        };
      }
      case "angularVelocity": {
        const vP = parseFiniteNumber(a, "Tangential speed v (m/s)");
        const rP = parsePositive(b, "Radius r (m)");
        if (!vP.ok) return { error: vP.error };
        if (!rP.ok) return { error: rP.error };
        const computed = angularVelocity({ mode: "fromV", v: vP.value, r: rP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.omega)} rad/s`,
          primaryLabel: "Angular velocity ω",
          rows: [
            { label: "v", value: `${num(vP.value)} m/s` },
            { label: "r", value: `${num(rP.value)} m` },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "forceFma" ? (
            <>
              <div>
                <FieldLabel htmlFor="pd-m">Mass m (kg)</FieldLabel>
                <FieldInput id="pd-m" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pd-a">Acceleration a (m/s²)</FieldLabel>
                <FieldInput id="pd-a" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "massFromForce" ? (
            <>
              <div>
                <FieldLabel htmlFor="pd-f">Force F (N)</FieldLabel>
                <FieldInput id="pd-f" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pd-ma">Acceleration a (m/s²)</FieldLabel>
                <FieldInput id="pd-ma" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "accelerationFromForce" ? (
            <>
              <div>
                <FieldLabel htmlFor="pd-af">Force F (N)</FieldLabel>
                <FieldInput id="pd-af" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pd-am">Mass m (kg)</FieldLabel>
                <FieldInput id="pd-am" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "netForce" ? (
            <div>
              <FieldLabel htmlFor="pd-forces">Forces (N, CSV signed)</FieldLabel>
              <FieldInput id="pd-forces" value={w} onChange={(ev) => setW(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "frictionForce" ? (
            <>
              <div>
                <FieldLabel htmlFor="pd-mu">μ (coefficient)</FieldLabel>
                <FieldInput id="pd-mu" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pd-n">Normal force N (N)</FieldLabel>
                <FieldInput id="pd-n" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "coefficientOfFriction" ? (
            <>
              <div>
                <FieldLabel htmlFor="pd-ff">Friction force (N)</FieldLabel>
                <FieldInput id="pd-ff" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pd-fn">Normal force N (N)</FieldLabel>
                <FieldInput id="pd-fn" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "centripetalForce" ? (
            <>
              <div>
                <FieldLabel htmlFor="pd-cm">Mass m (kg)</FieldLabel>
                <FieldInput id="pd-cm" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pd-cv">Speed v (m/s)</FieldLabel>
                <FieldInput id="pd-cv" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pd-cr">Radius r (m)</FieldLabel>
                <FieldInput id="pd-cr" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "centripetalAcceleration" ? (
            <>
              <div>
                <FieldLabel htmlFor="pd-cav">Speed v (m/s)</FieldLabel>
                <FieldInput id="pd-cav" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pd-car">Radius r (m)</FieldLabel>
                <FieldInput id="pd-car" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "angularVelocity" ? (
            <>
              <div>
                <FieldLabel htmlFor="pd-av">Tangential speed v (m/s)</FieldLabel>
                <FieldInput id="pd-av" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pd-ar">Radius r (m)</FieldLabel>
                <FieldInput id="pd-ar" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
