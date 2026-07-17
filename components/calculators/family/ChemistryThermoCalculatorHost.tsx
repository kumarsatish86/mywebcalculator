"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  CHEMISTRY_THERMO_URL,
  calorimetry,
  enthalpyChange,
  entropyChange,
  gibbsFreeEnergy,
  heatCapacity,
  heatEnergyChem,
  hessLaw,
} from "@/lib/calculators/chemistryThermo";

type ThermoSlug =
  | "heat-energy-calculator-chemistry"
  | "enthalpy-calculator"
  | "gibbs-free-energy-calculator-chemistry"
  | "entropy-calculator"
  | "calorimetry-calculator"
  | "heat-capacity-calculator"
  | "hess-law-calculator";

type Mode =
  | "heat"
  | "enthalpy"
  | "gibbs"
  | "entropy"
  | "calorimetry"
  | "heatCapacity"
  | "hess";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  wDefault: string;
};

const CONFIG: Record<ThermoSlug, Config> = {
  "heat-energy-calculator-chemistry": {
    title: "Heat energy (chemistry)",
    description: "q = m c ΔT for sensible heat with consistent units.",
    mode: "heat",
    aDefault: "100",
    bDefault: "4.184",
    cDefault: "10",
    rDefault: "",
    wDefault: "",
  },
  "enthalpy-calculator": {
    title: "Enthalpy change",
    description: "ΔH = Σ products − Σ reactants (enter coeff×ΔH_f as CSV).",
    mode: "enthalpy",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    rDefault: "-285.8",
    wDefault: "-241.8",
  },
  "gibbs-free-energy-calculator-chemistry": {
    title: "Gibbs free energy",
    description: "ΔG = ΔH − TΔS (keep units consistent, e.g. kJ and kJ/K).",
    mode: "gibbs",
    aDefault: "-100",
    bDefault: "298.15",
    cDefault: "-0.05",
    rDefault: "",
    wDefault: "",
  },
  "entropy-calculator": {
    title: "Entropy change",
    description: "ΔS = Σ products − Σ reactants (CSV of S° contributions).",
    mode: "entropy",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    rDefault: "70",
    wDefault: "188.7,130.7",
  },
  "calorimetry-calculator": {
    title: "Calorimetry",
    description: "q = m c ΔT for simple calorimeter estimates.",
    mode: "calorimetry",
    aDefault: "50",
    bDefault: "4.184",
    cDefault: "5",
    rDefault: "",
    wDefault: "",
  },
  "heat-capacity-calculator": {
    title: "Heat capacity",
    description: "C = q / ΔT for a sample.",
    mode: "heatCapacity",
    aDefault: "2092",
    bDefault: "10",
    cDefault: "",
    rDefault: "",
    wDefault: "",
  },
  "hess-law-calculator": {
    title: "Hess’s law",
    description: "ΔH_rxn = sum of step enthalpies (CSV).",
    mode: "hess",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    wDefault: "-100,50,-20",
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

export function ChemistryThermoCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as ThermoSlug] ?? CONFIG["heat-energy-calculator-chemistry"];
  const [a, setA] = useState(useLoanInitialInput(CHEMISTRY_THERMO_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CHEMISTRY_THERMO_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CHEMISTRY_THERMO_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(CHEMISTRY_THERMO_URL.R, config.rDefault));
  const [w, setW] = useState(useLoanInitialInput(CHEMISTRY_THERMO_URL.W, config.wDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    if (config.mode === "enthalpy" || config.mode === "entropy") {
      return {
        [CHEMISTRY_THERMO_URL.W]: w,
        [CHEMISTRY_THERMO_URL.R]: r,
      };
    }
    if (config.mode === "hess") {
      return { [CHEMISTRY_THERMO_URL.W]: w };
    }
    if (config.mode === "gibbs" || config.mode === "heat" || config.mode === "calorimetry") {
      return {
        [CHEMISTRY_THERMO_URL.A]: a,
        [CHEMISTRY_THERMO_URL.B]: b,
        [CHEMISTRY_THERMO_URL.C]: c,
      };
    }
    return {
      [CHEMISTRY_THERMO_URL.A]: a,
      [CHEMISTRY_THERMO_URL.B]: b,
    };
  }, [a, b, c, r, w, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, w]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "heat": {
        const massP = parsePositive(a, "Mass");
        const cP = parsePositive(b, "Specific heat c");
        const dTP = parseFiniteNumber(c, "ΔT");
        if (!massP.ok) return { error: massP.error };
        if (!cP.ok) return { error: cP.error };
        if (!dTP.ok) return { error: dTP.error };
        const computed = heatEnergyChem({
          mass: massP.value,
          c: cP.value,
          deltaT: dTP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.q)}`,
          primaryLabel: "Heat q",
          rows: [
            { label: "Mass", value: num(massP.value) },
            { label: "c", value: num(cP.value) },
            { label: "ΔT", value: num(dTP.value) },
          ],
        };
      }
      case "enthalpy": {
        const computed = enthalpyChange({ productsCsv: w, reactantsCsv: r });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.deltaH)}`,
          primaryLabel: "ΔH",
          rows: [
            { label: "Products CSV", value: w || "—" },
            { label: "Reactants CSV", value: r || "—" },
          ],
        };
      }
      case "gibbs": {
        const dHP = parseFiniteNumber(a, "ΔH");
        const tP = parsePositive(b, "T (K)");
        const dSP = parseFiniteNumber(c, "ΔS");
        if (!dHP.ok) return { error: dHP.error };
        if (!tP.ok) return { error: tP.error };
        if (!dSP.ok) return { error: dSP.error };
        const computed = gibbsFreeEnergy({
          deltaH: dHP.value,
          tK: tP.value,
          deltaS: dSP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.deltaG)}`,
          primaryLabel: "ΔG",
          rows: [
            { label: "ΔH", value: num(dHP.value) },
            { label: "T", value: `${num(tP.value)} K` },
            { label: "ΔS", value: num(dSP.value) },
          ],
        };
      }
      case "entropy": {
        const computed = entropyChange({ productsCsv: w, reactantsCsv: r });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.deltaS)}`,
          primaryLabel: "ΔS",
          rows: [
            { label: "Products CSV", value: w || "—" },
            { label: "Reactants CSV", value: r || "—" },
          ],
        };
      }
      case "calorimetry": {
        const massP = parsePositive(a, "Mass");
        const cP = parsePositive(b, "Specific heat c");
        const dTP = parseFiniteNumber(c, "ΔT");
        if (!massP.ok) return { error: massP.error };
        if (!cP.ok) return { error: cP.error };
        if (!dTP.ok) return { error: dTP.error };
        const computed = calorimetry({
          mass: massP.value,
          c: cP.value,
          deltaT: dTP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.q)}`,
          primaryLabel: "Heat q (calorimetry)",
          rows: [
            { label: "Mass", value: num(massP.value) },
            { label: "c", value: num(cP.value) },
            { label: "ΔT", value: num(dTP.value) },
          ],
        };
      }
      case "heatCapacity": {
        const qP = parseFiniteNumber(a, "q");
        const dTP = parseFiniteNumber(b, "ΔT");
        if (!qP.ok) return { error: qP.error };
        if (!dTP.ok) return { error: dTP.error };
        const computed = heatCapacity({ q: qP.value, deltaT: dTP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.C)}`,
          primaryLabel: "Heat capacity C",
          rows: [
            { label: "q", value: num(qP.value) },
            { label: "ΔT", value: num(dTP.value) },
          ],
        };
      }
      case "hess": {
        const computed = hessLaw({ stepsCsv: w });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.deltaH)}`,
          primaryLabel: "ΔH reaction",
          rows: [{ label: "Steps", value: `${computed.steps}` }],
        };
      }
    }
  }, [config.mode, a, b, c, r, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "heat" ? (
            <>
              <div>
                <FieldLabel htmlFor="ct-mass">Mass</FieldLabel>
                <FieldInput id="ct-mass" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ct-c">Specific heat c</FieldLabel>
                <FieldInput id="ct-c" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ct-dT">ΔT</FieldLabel>
                <FieldInput id="ct-dT" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "enthalpy" ? (
            <>
              <div>
                <FieldLabel htmlFor="ct-prod">Products (coeff×ΔH_f CSV)</FieldLabel>
                <FieldInput id="ct-prod" value={w} onChange={(ev) => setW(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="ct-reac">Reactants (coeff×ΔH_f CSV)</FieldLabel>
                <FieldInput id="ct-reac" value={r} onChange={(ev) => setR(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "gibbs" ? (
            <>
              <div>
                <FieldLabel htmlFor="ct-dH">ΔH</FieldLabel>
                <FieldInput id="ct-dH" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ct-T">T (K)</FieldLabel>
                <FieldInput id="ct-T" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ct-dS">ΔS</FieldLabel>
                <FieldInput id="ct-dS" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "entropy" ? (
            <>
              <div>
                <FieldLabel htmlFor="ct-sprod">Products (S° CSV)</FieldLabel>
                <FieldInput id="ct-sprod" value={w} onChange={(ev) => setW(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="ct-sreac">Reactants (S° CSV)</FieldLabel>
                <FieldInput id="ct-sreac" value={r} onChange={(ev) => setR(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "calorimetry" ? (
            <>
              <div>
                <FieldLabel htmlFor="ct-cmass">Mass</FieldLabel>
                <FieldInput id="ct-cmass" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ct-cc">Specific heat c</FieldLabel>
                <FieldInput id="ct-cc" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ct-cdT">ΔT</FieldLabel>
                <FieldInput id="ct-cdT" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "heatCapacity" ? (
            <>
              <div>
                <FieldLabel htmlFor="ct-q">Heat q</FieldLabel>
                <FieldInput id="ct-q" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ct-hdT">ΔT</FieldLabel>
                <FieldInput id="ct-hdT" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "hess" ? (
            <div>
              <FieldLabel htmlFor="ct-steps">Step ΔH values (CSV)</FieldLabel>
              <FieldInput id="ct-steps" value={w} onChange={(ev) => setW(ev.target.value)} />
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
