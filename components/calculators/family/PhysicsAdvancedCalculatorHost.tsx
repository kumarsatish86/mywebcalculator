"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  PHYSICS_ADVANCED_URL,
  capacitanceAdvanced,
  electricField,
  electricPotential,
  gaussLaw,
  inductance,
} from "@/lib/calculators/physicsAdvanced";

type AdvSlug =
  | "electric-field-calculator"
  | "electric-potential-calculator"
  | "gauss-law-calculator"
  | "capacitance-calculator-advanced"
  | "inductance-calculator";

type Mode = "efield" | "epotential" | "gauss" | "capacitance" | "inductance";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  fieldMode?: "point" | "force";
  gaussMode?: "flux" | "field";
  capMode?: "qv" | "parallelPlate";
  indMode?: "flux" | "solenoid";
  aDefault: string;
  bDefault: string;
};

const CONFIG: Record<AdvSlug, Config> = {
  "electric-field-calculator": {
    title: "Electric field",
    description: "Point charge: E = k |q| / r² (SI).",
    mode: "efield",
    fieldMode: "point",
    aDefault: "1e-6",
    bDefault: "0.1",
  },
  "electric-potential-calculator": {
    title: "Electric potential",
    description: "V = k q / r for a point charge (SI).",
    mode: "epotential",
    aDefault: "1e-6",
    bDefault: "0.1",
  },
  "gauss-law-calculator": {
    title: "Gauss’s law",
    description: "Φ_E = Q_enc / ε₀ for total electric flux.",
    mode: "gauss",
    gaussMode: "flux",
    aDefault: "1e-9",
    bDefault: "",
  },
  "capacitance-calculator-advanced": {
    title: "Capacitance (advanced)",
    description: "C = Q / V from charge and voltage.",
    mode: "capacitance",
    capMode: "qv",
    aDefault: "1e-6",
    bDefault: "12",
  },
  "inductance-calculator": {
    title: "Inductance",
    description: "L = Φ_B / I from flux linkage and current.",
    mode: "inductance",
    indMode: "flux",
    aDefault: "0.5",
    bDefault: "2",
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

export function PhysicsAdvancedCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as AdvSlug] ?? CONFIG["electric-field-calculator"];
  const [a, setA] = useState(useLoanInitialInput(PHYSICS_ADVANCED_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(PHYSICS_ADVANCED_URL.B, config.bDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    if (config.mode === "gauss") {
      return { [PHYSICS_ADVANCED_URL.A]: a };
    }
    return {
      [PHYSICS_ADVANCED_URL.A]: a,
      [PHYSICS_ADVANCED_URL.B]: b,
    };
  }, [a, b, config.mode]);

  useLoanUrlSync(shareParams, [a, b]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "efield": {
        const qP = parseFiniteNumber(a, "Charge q (C)");
        const rP = parsePositive(b, "Distance r (m)");
        if (!qP.ok) return { error: qP.error };
        if (!rP.ok) return { error: rP.error };
        const computed = electricField({
          mode: config.fieldMode ?? "point",
          qC: qP.value,
          rM: rP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.eNic)} N/C`,
          primaryLabel: "Electric field E",
          rows: [
            { label: "q", value: `${num(qP.value)} C` },
            { label: "r", value: `${num(rP.value)} m` },
          ],
        };
      }
      case "epotential": {
        const qP = parseFiniteNumber(a, "Charge q (C)");
        const rP = parsePositive(b, "Distance r (m)");
        if (!qP.ok) return { error: qP.error };
        if (!rP.ok) return { error: rP.error };
        const computed = electricPotential({ qC: qP.value, rM: rP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.vVolt)} V`,
          primaryLabel: "Potential V",
          rows: [
            { label: "q", value: `${num(qP.value)} C` },
            { label: "r", value: `${num(rP.value)} m` },
          ],
        };
      }
      case "gauss": {
        const qP = parseFiniteNumber(a, "Enclosed charge Q_enc (C)");
        if (!qP.ok) return { error: qP.error };
        const computed = gaussLaw({
          mode: config.gaussMode ?? "flux",
          qEncC: qP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.flux)} N·m²/C`,
          primaryLabel: "Electric flux Φ_E",
          rows: [{ label: "Q_enc", value: `${num(qP.value)} C` }],
        };
      }
      case "capacitance": {
        const qP = parseFiniteNumber(a, "Charge Q (C)");
        const vP = parseFiniteNumber(b, "Voltage V");
        if (!qP.ok) return { error: qP.error };
        if (!vP.ok) return { error: vP.error };
        const computed = capacitanceAdvanced({
          mode: config.capMode ?? "qv",
          qC: qP.value,
          vVolt: vP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.cFarad)} F`,
          primaryLabel: "Capacitance C",
          rows: [
            { label: "Q", value: `${num(qP.value)} C` },
            { label: "V", value: `${num(vP.value)} V` },
          ],
        };
      }
      case "inductance": {
        const fluxP = parseFiniteNumber(a, "Flux Φ_B (Wb)");
        const iP = parseFiniteNumber(b, "Current I (A)");
        if (!fluxP.ok) return { error: fluxP.error };
        if (!iP.ok) return { error: iP.error };
        const computed = inductance({
          mode: config.indMode ?? "flux",
          fluxWb: fluxP.value,
          currentA: iP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.lHenry)} H`,
          primaryLabel: "Inductance L",
          rows: [
            { label: "Φ_B", value: `${num(fluxP.value)} Wb` },
            { label: "I", value: `${num(iP.value)} A` },
          ],
        };
      }
    }
  }, [config.mode, config.fieldMode, config.gaussMode, config.capMode, config.indMode, a, b]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "efield" ? (
            <>
              <div>
                <FieldLabel htmlFor="pa-q">Charge q (C)</FieldLabel>
                <FieldInput id="pa-q" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pa-r">Distance r (m)</FieldLabel>
                <FieldInput id="pa-r" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "epotential" ? (
            <>
              <div>
                <FieldLabel htmlFor="pa-pq">Charge q (C)</FieldLabel>
                <FieldInput id="pa-pq" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pa-pr">Distance r (m)</FieldLabel>
                <FieldInput id="pa-pr" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "gauss" ? (
            <div>
              <FieldLabel htmlFor="pa-qenc">Enclosed charge Q_enc (C)</FieldLabel>
              <FieldInput id="pa-qenc" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "capacitance" ? (
            <>
              <div>
                <FieldLabel htmlFor="pa-cq">Charge Q (C)</FieldLabel>
                <FieldInput id="pa-cq" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pa-cv">Voltage V</FieldLabel>
                <FieldInput id="pa-cv" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "inductance" ? (
            <>
              <div>
                <FieldLabel htmlFor="pa-flux">Flux Φ_B (Wb)</FieldLabel>
                <FieldInput id="pa-flux" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pa-i">Current I (A)</FieldLabel>
                <FieldInput id="pa-i" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
