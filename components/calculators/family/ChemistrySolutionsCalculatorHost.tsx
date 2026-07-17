"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  CHEMISTRY_SOLUTIONS_URL,
  concentrationConversion,
  dilution,
  massPercent,
  molality,
  molarity,
  normality,
  ppm,
  solutionMixing,
  volumePercent,
} from "@/lib/calculators/chemistrySolutions";

type SolutionsSlug =
  | "molarity-calculator"
  | "molality-calculator"
  | "normality-calculator"
  | "mass-percent-calculator"
  | "volume-percent-calculator"
  | "ppm-calculator-parts-per-million"
  | "dilution-calculator-chemistry"
  | "solution-mixing-calculator"
  | "concentration-conversion-calculator";

type Mode =
  | "molarity"
  | "molality"
  | "normality"
  | "massPercent"
  | "volumePercent"
  | "ppm"
  | "dilution"
  | "mixing"
  | "conversion";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
};

const CONFIG: Record<SolutionsSlug, Config> = {
  "molarity-calculator": {
    title: "Molarity calculator",
    description: "M = moles solute / liters solution.",
    mode: "molarity",
    aDefault: "0.5",
    bDefault: "1",
    cDefault: "",
    rDefault: "",
  },
  "molality-calculator": {
    title: "Molality calculator",
    description: "m = moles solute / kg solvent.",
    mode: "molality",
    aDefault: "0.5",
    bDefault: "1",
    cDefault: "",
    rDefault: "",
  },
  "normality-calculator": {
    title: "Normality calculator",
    description: "N = equivalents / liters solution.",
    mode: "normality",
    aDefault: "1",
    bDefault: "1",
    cDefault: "",
    rDefault: "",
  },
  "mass-percent-calculator": {
    title: "Mass percent",
    description: "Mass % = (mass solute / mass solution) × 100.",
    mode: "massPercent",
    aDefault: "10",
    bDefault: "100",
    cDefault: "",
    rDefault: "",
  },
  "volume-percent-calculator": {
    title: "Volume percent",
    description: "Volume % = (vol solute / vol solution) × 100.",
    mode: "volumePercent",
    aDefault: "25",
    bDefault: "100",
    cDefault: "",
    rDefault: "",
  },
  "ppm-calculator-parts-per-million": {
    title: "PPM calculator",
    description: "Approx. ppm = mg solute / kg solution (dilute aqueous).",
    mode: "ppm",
    aDefault: "5",
    bDefault: "1",
    cDefault: "",
    rDefault: "",
  },
  "dilution-calculator-chemistry": {
    title: "Dilution (M₁V₁ = M₂V₂)",
    description: "Leave exactly one of M1, V1, M2, V2 blank to solve.",
    mode: "dilution",
    aDefault: "2",
    bDefault: "0.1",
    cDefault: "0.5",
    rDefault: "",
  },
  "solution-mixing-calculator": {
    title: "Solution mixing",
    description: "Final concentration from two same-solute solutions.",
    mode: "mixing",
    aDefault: "1",
    bDefault: "0.5",
    cDefault: "0.2",
    rDefault: "0.5",
  },
  "concentration-conversion-calculator": {
    title: "Concentration conversion",
    description: "Approximate mass % and molality from M, MM, and density.",
    mode: "conversion",
    aDefault: "1",
    bDefault: "58.44",
    cDefault: "1.05",
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

function optionalPositive(raw: string, label: string) {
  if (raw.trim() === "") return { ok: true as const, value: null as number | null };
  const p = parsePositive(raw, label);
  if (!p.ok) return p;
  return { ok: true as const, value: p.value as number | null };
}

export function ChemistrySolutionsCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as SolutionsSlug] ?? CONFIG["molarity-calculator"];
  const [a, setA] = useState(useLoanInitialInput(CHEMISTRY_SOLUTIONS_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CHEMISTRY_SOLUTIONS_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CHEMISTRY_SOLUTIONS_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(CHEMISTRY_SOLUTIONS_URL.R, config.rDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    const base = {
      [CHEMISTRY_SOLUTIONS_URL.A]: a,
      [CHEMISTRY_SOLUTIONS_URL.B]: b,
    };
    if (config.mode === "dilution" || config.mode === "mixing") {
      return { ...base, [CHEMISTRY_SOLUTIONS_URL.C]: c, [CHEMISTRY_SOLUTIONS_URL.R]: r };
    }
    if (config.mode === "conversion") {
      return { ...base, [CHEMISTRY_SOLUTIONS_URL.C]: c };
    }
    return base;
  }, [a, b, c, r, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "molarity": {
        const molesP = parseNonNegative(a, "Moles");
        const litersP = parsePositive(b, "Liters");
        if (!molesP.ok) return { error: molesP.error };
        if (!litersP.ok) return { error: litersP.error };
        const computed = molarity({ moles: molesP.value, liters: litersP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.M)} M`,
          primaryLabel: "Molarity",
          rows: [
            { label: "Moles", value: `${num(molesP.value)} mol` },
            { label: "Volume", value: `${num(litersP.value)} L` },
          ],
        };
      }
      case "molality": {
        const molesP = parseNonNegative(a, "Moles");
        const kgP = parsePositive(b, "Kg solvent");
        if (!molesP.ok) return { error: molesP.error };
        if (!kgP.ok) return { error: kgP.error };
        const computed = molality({ moles: molesP.value, kgSolvent: kgP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.m)} m`,
          primaryLabel: "Molality",
          rows: [
            { label: "Moles", value: `${num(molesP.value)} mol` },
            { label: "Solvent", value: `${num(kgP.value)} kg` },
          ],
        };
      }
      case "normality": {
        const eqP = parseNonNegative(a, "Equivalents");
        const litersP = parsePositive(b, "Liters");
        if (!eqP.ok) return { error: eqP.error };
        if (!litersP.ok) return { error: litersP.error };
        const computed = normality({ equivalents: eqP.value, liters: litersP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.N)} N`,
          primaryLabel: "Normality",
          rows: [
            { label: "Equivalents", value: `${num(eqP.value)}` },
            { label: "Volume", value: `${num(litersP.value)} L` },
          ],
        };
      }
      case "massPercent": {
        const soluteP = parseNonNegative(a, "Mass solute");
        const solnP = parsePositive(b, "Mass solution");
        if (!soluteP.ok) return { error: soluteP.error };
        if (!solnP.ok) return { error: solnP.error };
        const computed = massPercent({ massSolute: soluteP.value, massSolution: solnP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.percent, 2)} %`,
          primaryLabel: "Mass percent",
          rows: [
            { label: "Solute", value: `${num(soluteP.value)}` },
            { label: "Solution", value: `${num(solnP.value)}` },
          ],
        };
      }
      case "volumePercent": {
        const soluteP = parseNonNegative(a, "Vol solute");
        const solnP = parsePositive(b, "Vol solution");
        if (!soluteP.ok) return { error: soluteP.error };
        if (!solnP.ok) return { error: solnP.error };
        const computed = volumePercent({ volSolute: soluteP.value, volSolution: solnP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.percent, 2)} %`,
          primaryLabel: "Volume percent",
          rows: [
            { label: "Solute vol", value: `${num(soluteP.value)}` },
            { label: "Solution vol", value: `${num(solnP.value)}` },
          ],
        };
      }
      case "ppm": {
        const mgP = parseNonNegative(a, "Mass solute (mg)");
        const kgP = parsePositive(b, "Mass solution (kg)");
        if (!mgP.ok) return { error: mgP.error };
        if (!kgP.ok) return { error: kgP.error };
        const computed = ppm({ massSoluteMg: mgP.value, massSolutionKg: kgP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.ppm)} ppm`,
          primaryLabel: "Parts per million",
          rows: [
            { label: "Solute", value: `${num(mgP.value)} mg` },
            { label: "Solution", value: `${num(kgP.value)} kg` },
          ],
        };
      }
      case "dilution": {
        const m1P = optionalPositive(a, "M1");
        const v1P = optionalPositive(b, "V1");
        const m2P = optionalPositive(c, "M2");
        const v2P = optionalPositive(r, "V2");
        if (!m1P.ok) return { error: m1P.error };
        if (!v1P.ok) return { error: v1P.error };
        if (!m2P.ok) return { error: m2P.error };
        if (!v2P.ok) return { error: v2P.error };
        const computed = dilution({
          m1: m1P.value,
          v1: v1P.value,
          m2: m2P.value,
          v2: v2P.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `M1=${num(computed.m1)}, V1=${num(computed.v1)}, M2=${num(computed.m2)}, V2=${num(computed.v2)}`,
          primaryLabel: "Dilution result",
          rows: [
            { label: "M1", value: num(computed.m1) },
            { label: "V1", value: num(computed.v1) },
            { label: "M2", value: num(computed.m2) },
            { label: "V2", value: num(computed.v2) },
          ],
        };
      }
      case "mixing": {
        const c1P = parseNonNegative(a, "C1");
        const v1P = parseNonNegative(b, "V1");
        const c2P = parseNonNegative(c, "C2");
        const v2P = parseNonNegative(r, "V2");
        if (!c1P.ok) return { error: c1P.error };
        if (!v1P.ok) return { error: v1P.error };
        if (!c2P.ok) return { error: c2P.error };
        if (!v2P.ok) return { error: v2P.error };
        const computed = solutionMixing({
          c1: c1P.value,
          v1: v1P.value,
          c2: c2P.value,
          v2: v2P.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.cFinal)}`,
          primaryLabel: "Final concentration",
          rows: [
            { label: "Final volume", value: `${num(computed.vFinal)}` },
            { label: "C1·V1 + C2·V2", value: "same solute assumed" },
          ],
        };
      }
      case "conversion": {
        const mP = parseNonNegative(a, "Molarity");
        const mmP = parsePositive(b, "Molar mass");
        const dP = parsePositive(c, "Density (g/mL)");
        if (!mP.ok) return { error: mP.error };
        if (!mmP.ok) return { error: mmP.error };
        if (!dP.ok) return { error: dP.error };
        const computed = concentrationConversion({
          molarity: mP.value,
          molarMass: mmP.value,
          densityGml: dP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.massPercent, 2)} %`,
          primaryLabel: "Approx. mass percent",
          rows: [
            { label: "Approx. molality", value: `${num(computed.molalityApprox)} m` },
            { label: "Molarity", value: `${num(mP.value)} M` },
            { label: "Density", value: `${num(dP.value)} g/mL` },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "molarity" ? (
            <>
              <div>
                <FieldLabel htmlFor="csol-moles">Moles solute</FieldLabel>
                <FieldInput id="csol-moles" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csol-L">Volume (L)</FieldLabel>
                <FieldInput id="csol-L" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "molality" ? (
            <>
              <div>
                <FieldLabel htmlFor="csol-moles-m">Moles solute</FieldLabel>
                <FieldInput id="csol-moles-m" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csol-kg">Solvent mass (kg)</FieldLabel>
                <FieldInput id="csol-kg" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "normality" ? (
            <>
              <div>
                <FieldLabel htmlFor="csol-eq">Equivalents</FieldLabel>
                <FieldInput id="csol-eq" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csol-Ln">Volume (L)</FieldLabel>
                <FieldInput id="csol-Ln" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "massPercent" ? (
            <>
              <div>
                <FieldLabel htmlFor="csol-ms">Mass solute</FieldLabel>
                <FieldInput id="csol-ms" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csol-msn">Mass solution</FieldLabel>
                <FieldInput id="csol-msn" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "volumePercent" ? (
            <>
              <div>
                <FieldLabel htmlFor="csol-vs">Volume solute</FieldLabel>
                <FieldInput id="csol-vs" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csol-vsn">Volume solution</FieldLabel>
                <FieldInput id="csol-vsn" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "ppm" ? (
            <>
              <div>
                <FieldLabel htmlFor="csol-mg">Mass solute (mg)</FieldLabel>
                <FieldInput id="csol-mg" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csol-kgp">Mass solution (kg)</FieldLabel>
                <FieldInput id="csol-kgp" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "dilution" ? (
            <>
              <div>
                <FieldLabel htmlFor="csol-m1">M1 (leave blank to solve)</FieldLabel>
                <FieldInput id="csol-m1" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csol-v1">V1 (leave blank to solve)</FieldLabel>
                <FieldInput id="csol-v1" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csol-m2">M2 (leave blank to solve)</FieldLabel>
                <FieldInput id="csol-m2" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csol-v2">V2 (leave blank to solve)</FieldLabel>
                <FieldInput id="csol-v2" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "mixing" ? (
            <>
              <div>
                <FieldLabel htmlFor="csol-c1">C1</FieldLabel>
                <FieldInput id="csol-c1" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csol-mv1">V1</FieldLabel>
                <FieldInput id="csol-mv1" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csol-c2">C2</FieldLabel>
                <FieldInput id="csol-c2" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csol-mv2">V2</FieldLabel>
                <FieldInput id="csol-mv2" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "conversion" ? (
            <>
              <div>
                <FieldLabel htmlFor="csol-M">Molarity (M)</FieldLabel>
                <FieldInput id="csol-M" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csol-mm">Molar mass (g/mol)</FieldLabel>
                <FieldInput id="csol-mm" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="csol-d">Density (g/mL)</FieldLabel>
                <FieldInput id="csol-d" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
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
