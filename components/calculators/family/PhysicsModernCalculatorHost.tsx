"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  PHYSICS_MODERN_URL,
  deBroglieWavelength,
  halfLife,
  photonEnergy,
  radioactiveDecay,
} from "@/lib/calculators/physicsModern";

type ModernSlug =
  | "photon-energy-calculator"
  | "de-broglie-wavelength-calculator"
  | "radioactive-decay-calculator-physics"
  | "half-life-calculator-physics";

type Mode = "photon" | "deBroglie" | "decay" | "halfLife";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  photonMode?: "fromWavelength" | "fromFreq";
  halfLifeMode?: "fromLambda" | "fromRemaining";
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const CONFIG: Record<ModernSlug, Config> = {
  "photon-energy-calculator": {
    title: "Photon energy",
    description: "E = hc / λ (default) or E = h f — SI joules and eV.",
    mode: "photon",
    photonMode: "fromWavelength",
    aDefault: "5e-7",
    bDefault: "",
    cDefault: "",
  },
  "de-broglie-wavelength-calculator": {
    title: "de Broglie wavelength",
    description: "λ = h / (m v) for a massive particle.",
    mode: "deBroglie",
    aDefault: "9.109e-31",
    bDefault: "1e6",
    cDefault: "",
  },
  "radioactive-decay-calculator-physics": {
    title: "Radioactive decay",
    description: "N = N₀ e^(−λt) with λ = ln 2 / t½.",
    mode: "decay",
    aDefault: "1000",
    bDefault: "10",
    cDefault: "20",
  },
  "half-life-calculator-physics": {
    title: "Half-life",
    description: "t½ = ln 2 / λ from the decay constant.",
    mode: "halfLife",
    halfLifeMode: "fromLambda",
    aDefault: "0.0693",
    bDefault: "",
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

export function PhysicsModernCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as ModernSlug] ?? CONFIG["photon-energy-calculator"];
  const [a, setA] = useState(useLoanInitialInput(PHYSICS_MODERN_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(PHYSICS_MODERN_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(PHYSICS_MODERN_URL.C, config.cDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    if (config.mode === "decay") {
      return {
        [PHYSICS_MODERN_URL.A]: a,
        [PHYSICS_MODERN_URL.B]: b,
        [PHYSICS_MODERN_URL.C]: c,
      };
    }
    if (config.mode === "photon" || config.mode === "halfLife") {
      return { [PHYSICS_MODERN_URL.A]: a };
    }
    return {
      [PHYSICS_MODERN_URL.A]: a,
      [PHYSICS_MODERN_URL.B]: b,
    };
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "photon": {
        const photonMode = config.photonMode ?? "fromWavelength";
        if (photonMode === "fromFreq") {
          const fP = parsePositive(a, "Frequency (Hz)");
          if (!fP.ok) return { error: fP.error };
          const computed = photonEnergy({ mode: "fromFreq", frequencyHz: fP.value });
          if ("error" in computed) return { error: computed.error };
          return {
            primary: `${num(computed.energyJ, 6)} J`,
            primaryLabel: "Photon energy",
            rows: [
              { label: "Energy", value: `${num(computed.energyEv, 6)} eV` },
              { label: "Frequency", value: `${num(fP.value)} Hz` },
            ],
          };
        }
        const lP = parsePositive(a, "Wavelength (m)");
        if (!lP.ok) return { error: lP.error };
        const computed = photonEnergy({ mode: "fromWavelength", wavelengthM: lP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.energyJ, 6)} J`,
          primaryLabel: "Photon energy",
          rows: [
            { label: "Energy", value: `${num(computed.energyEv, 6)} eV` },
            { label: "Wavelength", value: `${num(lP.value)} m` },
          ],
        };
      }
      case "deBroglie": {
        const mP = parsePositive(a, "Mass (kg)");
        const vP = parsePositive(b, "Velocity (m/s)");
        if (!mP.ok) return { error: mP.error };
        if (!vP.ok) return { error: vP.error };
        const computed = deBroglieWavelength({ massKg: mP.value, velocityMs: vP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.wavelengthM, 6)} m`,
          primaryLabel: "de Broglie λ",
          rows: [
            { label: "Mass", value: `${num(mP.value)} kg` },
            { label: "Velocity", value: `${num(vP.value)} m/s` },
          ],
        };
      }
      case "decay": {
        const n0P = parseNonNegative(a, "N₀");
        const hlP = parsePositive(b, "Half-life");
        const tP = parseNonNegative(c, "Time t");
        if (!n0P.ok) return { error: n0P.error };
        if (!hlP.ok) return { error: hlP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = radioactiveDecay({
          n0: n0P.value,
          halfLife: hlP.value,
          t: tP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.n)}`,
          primaryLabel: "Remaining N",
          rows: [
            { label: "Fraction left", value: num(computed.fractionLeft, 6) },
            { label: "λ", value: num(computed.lambda, 6) },
            { label: "N₀", value: num(n0P.value) },
            { label: "t½", value: num(hlP.value) },
            { label: "t", value: num(tP.value) },
          ],
        };
      }
      case "halfLife": {
        const lamP = parsePositive(a, "Decay constant λ");
        if (!lamP.ok) return { error: lamP.error };
        const computed = halfLife({
          mode: config.halfLifeMode ?? "fromLambda",
          lambda: lamP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.halfLife)}`,
          primaryLabel: "Half-life t½",
          rows: [{ label: "λ", value: num(lamP.value, 6) }],
        };
      }
    }
  }, [config.mode, config.photonMode, config.halfLifeMode, a, b, c]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "photon" ? (
            <div>
              <FieldLabel htmlFor="pm-a">
                {(config.photonMode ?? "fromWavelength") === "fromFreq"
                  ? "Frequency (Hz)"
                  : "Wavelength (m)"}
              </FieldLabel>
              <FieldInput id="pm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "deBroglie" ? (
            <>
              <div>
                <FieldLabel htmlFor="pm-mass">Mass (kg)</FieldLabel>
                <FieldInput id="pm-mass" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pm-v">Velocity (m/s)</FieldLabel>
                <FieldInput id="pm-v" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "decay" ? (
            <>
              <div>
                <FieldLabel htmlFor="pm-n0">N₀ (initial amount)</FieldLabel>
                <FieldInput id="pm-n0" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pm-hl">Half-life t½</FieldLabel>
                <FieldInput id="pm-hl" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pm-t">Time t</FieldLabel>
                <FieldInput id="pm-t" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "halfLife" ? (
            <div>
              <FieldLabel htmlFor="pm-lam">Decay constant λ</FieldLabel>
              <FieldInput id="pm-lam" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
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
