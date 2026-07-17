"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  PHYSICS_MAGNETISM_URL,
  inducedEmf,
  lorentzForce,
  magneticFieldWire,
  magneticForceWire,
} from "@/lib/calculators/physicsMagnetism";

type MagSlug =
  | "magnetic-force-calculator"
  | "magnetic-field-calculator"
  | "lorentz-force-calculator"
  | "induced-emf-calculator";

type Mode = "forceWire" | "fieldWire" | "lorentz" | "emf";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  emfMode?: "motional" | "flux";
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
};

const CONFIG: Record<MagSlug, Config> = {
  "magnetic-force-calculator": {
    title: "Magnetic force on a wire",
    description: "F = I L B sinθ for a straight current-carrying wire.",
    mode: "forceWire",
    aDefault: "2",
    bDefault: "0.5",
    cDefault: "0.1",
    rDefault: "90",
  },
  "magnetic-field-calculator": {
    title: "Magnetic field of a wire",
    description: "B = μ₀ I / (2π r) for a long straight wire.",
    mode: "fieldWire",
    aDefault: "10",
    bDefault: "0.05",
    cDefault: "",
    rDefault: "",
  },
  "lorentz-force-calculator": {
    title: "Lorentz force",
    description: "F = q v B sinθ on a moving charge in a magnetic field.",
    mode: "lorentz",
    aDefault: "1.6e-19",
    bDefault: "1e6",
    cDefault: "0.05",
    rDefault: "90",
  },
  "induced-emf-calculator": {
    title: "Induced EMF (motional)",
    description: "ε = B ℓ v for a conductor moving in a uniform B field.",
    mode: "emf",
    emfMode: "motional",
    aDefault: "0.2",
    bDefault: "0.15",
    cDefault: "4",
    rDefault: "",
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

export function PhysicsMagnetismCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as MagSlug] ?? CONFIG["magnetic-force-calculator"];
  const [a, setA] = useState(useLoanInitialInput(PHYSICS_MAGNETISM_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(PHYSICS_MAGNETISM_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(PHYSICS_MAGNETISM_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(PHYSICS_MAGNETISM_URL.R, config.rDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    const base = {
      [PHYSICS_MAGNETISM_URL.A]: a,
      [PHYSICS_MAGNETISM_URL.B]: b,
    };
    if (config.mode === "fieldWire") return base;
    if (config.mode === "emf") {
      return { ...base, [PHYSICS_MAGNETISM_URL.C]: c };
    }
    return { ...base, [PHYSICS_MAGNETISM_URL.C]: c, [PHYSICS_MAGNETISM_URL.R]: r };
  }, [a, b, c, r, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "forceWire": {
        const iP = parseFiniteNumber(a, "Current I");
        const lP = parseNonNegative(b, "Length L");
        const bP = parseNonNegative(c, "B field");
        const thP = parseFiniteNumber(r, "Angle θ");
        if (!iP.ok) return { error: iP.error };
        if (!lP.ok) return { error: lP.error };
        if (!bP.ok) return { error: bP.error };
        if (!thP.ok) return { error: thP.error };
        const computed = magneticForceWire({
          currentA: iP.value,
          lengthM: lP.value,
          bTesla: bP.value,
          thetaDeg: thP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.forceN)} N`,
          primaryLabel: "Force F",
          rows: [
            { label: "I", value: `${num(iP.value)} A` },
            { label: "L", value: `${num(lP.value)} m` },
            { label: "B", value: `${num(bP.value)} T` },
            { label: "θ", value: `${num(thP.value)}°` },
          ],
        };
      }
      case "fieldWire": {
        const iP = parseFiniteNumber(a, "Current I");
        const dP = parsePositive(b, "Distance r");
        if (!iP.ok) return { error: iP.error };
        if (!dP.ok) return { error: dP.error };
        const computed = magneticFieldWire({ currentA: iP.value, distanceM: dP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.bTesla)} T`,
          primaryLabel: "Magnetic field B",
          rows: [
            { label: "I", value: `${num(iP.value)} A` },
            { label: "r", value: `${num(dP.value)} m` },
            { label: "μ₀", value: "1.2566×10⁻⁶ T·m/A" },
          ],
        };
      }
      case "lorentz": {
        const qP = parseFiniteNumber(a, "Charge q");
        const vP = parseNonNegative(b, "Speed v");
        const bP = parseNonNegative(c, "B field");
        const thP = parseFiniteNumber(r, "Angle θ");
        if (!qP.ok) return { error: qP.error };
        if (!vP.ok) return { error: vP.error };
        if (!bP.ok) return { error: bP.error };
        if (!thP.ok) return { error: thP.error };
        const computed = lorentzForce({
          chargeC: qP.value,
          velocityMs: vP.value,
          bTesla: bP.value,
          thetaDeg: thP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.forceN)} N`,
          primaryLabel: "Lorentz force F",
          rows: [
            { label: "q", value: `${num(qP.value)} C` },
            { label: "v", value: `${num(vP.value)} m/s` },
            { label: "B", value: `${num(bP.value)} T` },
            { label: "θ", value: `${num(thP.value)}°` },
          ],
        };
      }
      case "emf": {
        const emfMode = config.emfMode ?? "motional";
        if (emfMode === "flux") {
          const nP = parseNonNegative(a, "Turns N");
          const dPhiP = parseFiniteNumber(b, "ΔΦ");
          const dtP = parsePositive(c, "Δt");
          if (!nP.ok) return { error: nP.error };
          if (!dPhiP.ok) return { error: dPhiP.error };
          if (!dtP.ok) return { error: dtP.error };
          const computed = inducedEmf({
            mode: "flux",
            turns: nP.value,
            deltaFlux: dPhiP.value,
            deltaT: dtP.value,
          });
          if ("error" in computed) return { error: computed.error };
          return {
            primary: `${num(computed.emfV)} V`,
            primaryLabel: "Induced EMF",
            rows: [{ label: "Formula", value: computed.formula }],
          };
        }
        const bP = parseNonNegative(a, "B field");
        const lP = parseNonNegative(b, "Length ℓ");
        const vP = parseNonNegative(c, "Speed v");
        if (!bP.ok) return { error: bP.error };
        if (!lP.ok) return { error: lP.error };
        if (!vP.ok) return { error: vP.error };
        const computed = inducedEmf({
          mode: "motional",
          bTesla: bP.value,
          lengthM: lP.value,
          velocityMs: vP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.emfV)} V`,
          primaryLabel: "Induced EMF",
          rows: [
            { label: "Formula", value: computed.formula },
            { label: "B", value: `${num(bP.value)} T` },
            { label: "ℓ", value: `${num(lP.value)} m` },
            { label: "v", value: `${num(vP.value)} m/s` },
          ],
        };
      }
    }
  }, [config.mode, config.emfMode, a, b, c, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "forceWire" ? (
            <>
              <div>
                <FieldLabel htmlFor="pm-i">Current I (A)</FieldLabel>
                <FieldInput id="pm-i" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pm-l">Length L (m)</FieldLabel>
                <FieldInput id="pm-l" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pm-b">B field (T)</FieldLabel>
                <FieldInput id="pm-b" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pm-th">Angle θ (degrees)</FieldLabel>
                <FieldInput id="pm-th" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "fieldWire" ? (
            <>
              <div>
                <FieldLabel htmlFor="pm-fi">Current I (A)</FieldLabel>
                <FieldInput id="pm-fi" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pm-r">Distance r (m)</FieldLabel>
                <FieldInput id="pm-r" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "lorentz" ? (
            <>
              <div>
                <FieldLabel htmlFor="pm-q">Charge q (C)</FieldLabel>
                <FieldInput id="pm-q" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pm-v">Speed v (m/s)</FieldLabel>
                <FieldInput id="pm-v" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pm-lb">B field (T)</FieldLabel>
                <FieldInput id="pm-lb" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pm-lth">Angle θ (degrees)</FieldLabel>
                <FieldInput id="pm-lth" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "emf" && (config.emfMode ?? "motional") === "motional" ? (
            <>
              <div>
                <FieldLabel htmlFor="pm-eb">B field (T)</FieldLabel>
                <FieldInput id="pm-eb" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pm-el">Length ℓ (m)</FieldLabel>
                <FieldInput id="pm-el" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pm-ev">Speed v (m/s)</FieldLabel>
                <FieldInput id="pm-ev" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "emf" && config.emfMode === "flux" ? (
            <>
              <div>
                <FieldLabel htmlFor="pm-n">Turns N</FieldLabel>
                <FieldInput id="pm-n" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pm-dphi">ΔΦ (Wb)</FieldLabel>
                <FieldInput id="pm-dphi" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pm-dt">Δt (s)</FieldLabel>
                <FieldInput id="pm-dt" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
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
