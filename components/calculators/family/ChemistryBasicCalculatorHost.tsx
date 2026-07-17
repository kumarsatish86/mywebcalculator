"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  CHEMISTRY_BASIC_URL,
  atomicMass,
  empiricalFormula,
  massToMole,
  molarMass,
  moleToMass,
  moleToParticle,
  molecularFormula,
  numberOfMoles,
  particleToMole,
  percentageComposition,
} from "@/lib/calculators/chemistryBasic";

type BasicSlug =
  | "molar-mass-calculator"
  | "atomic-mass-calculator"
  | "number-of-moles-calculator"
  | "mole-to-mass-calculator"
  | "mass-to-mole-calculator"
  | "mole-to-particle-calculator"
  | "particle-to-mole-calculator"
  | "empirical-formula-calculator"
  | "molecular-formula-calculator"
  | "percentage-composition-calculator";

type Mode =
  | "molarMass"
  | "atomicMass"
  | "numberOfMoles"
  | "moleToMass"
  | "massToMole"
  | "moleToParticle"
  | "particleToMole"
  | "empirical"
  | "molecular"
  | "percentComp";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  wDefault: string;
  mDefault: string;
};

const CONFIG: Record<BasicSlug, Config> = {
  "molar-mass-calculator": {
    title: "Molar mass",
    description: "Sum atomic mass × atom count pairs from matching CSVs.",
    mode: "molarMass",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    wDefault: "12.01,1.008",
    mDefault: "1,4",
  },
  "atomic-mass-calculator": {
    title: "Atomic mass",
    description: "Weighted average from isotope masses and abundance % CSVs.",
    mode: "atomicMass",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    wDefault: "10.012,11.009",
    mDefault: "19.9,80.1",
  },
  "number-of-moles-calculator": {
    title: "Number of moles",
    description: "n = m / M from mass and molar mass.",
    mode: "numberOfMoles",
    aDefault: "18",
    bDefault: "18.015",
    cDefault: "",
    wDefault: "",
    mDefault: "",
  },
  "mole-to-mass-calculator": {
    title: "Mole to mass",
    description: "m = n × M.",
    mode: "moleToMass",
    aDefault: "2",
    bDefault: "18.015",
    cDefault: "",
    wDefault: "",
    mDefault: "",
  },
  "mass-to-mole-calculator": {
    title: "Mass to mole",
    description: "n = m / M.",
    mode: "massToMole",
    aDefault: "36",
    bDefault: "18.015",
    cDefault: "",
    wDefault: "",
    mDefault: "",
  },
  "mole-to-particle-calculator": {
    title: "Mole to particles",
    description: "N = n × N_A (Avogadro).",
    mode: "moleToParticle",
    aDefault: "1",
    bDefault: "",
    cDefault: "",
    wDefault: "",
    mDefault: "",
  },
  "particle-to-mole-calculator": {
    title: "Particles to moles",
    description: "n = N / N_A.",
    mode: "particleToMole",
    aDefault: "6.022e23",
    bDefault: "",
    cDefault: "",
    wDefault: "",
    mDefault: "",
  },
  "empirical-formula-calculator": {
    title: "Empirical formula",
    description: "Smallest integer ratio from element mole amounts (CSV).",
    mode: "empirical",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    wDefault: "1.5,1,3",
    mDefault: "",
  },
  "molecular-formula-calculator": {
    title: "Molecular formula",
    description: "Multiplier = M_molecular / M_empirical.",
    mode: "molecular",
    aDefault: "30",
    bDefault: "180",
    cDefault: "",
    wDefault: "",
    mDefault: "",
  },
  "percentage-composition-calculator": {
    title: "Percentage composition",
    description: "% = (atoms × atomic mass / M_compound) × 100.",
    mode: "percentComp",
    aDefault: "12.01",
    bDefault: "2",
    cDefault: "46.07",
    wDefault: "",
    mDefault: "",
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

export function ChemistryBasicCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as BasicSlug] ?? CONFIG["molar-mass-calculator"];
  const [a, setA] = useState(useLoanInitialInput(CHEMISTRY_BASIC_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CHEMISTRY_BASIC_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CHEMISTRY_BASIC_URL.C, config.cDefault));
  const [w, setW] = useState(useLoanInitialInput(CHEMISTRY_BASIC_URL.W, config.wDefault));
  const [m, setM] = useState(useLoanInitialInput(CHEMISTRY_BASIC_URL.M, config.mDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    if (config.mode === "molarMass" || config.mode === "atomicMass") {
      return {
        [CHEMISTRY_BASIC_URL.W]: w,
        [CHEMISTRY_BASIC_URL.M]: m,
      };
    }
    if (config.mode === "empirical") {
      return { [CHEMISTRY_BASIC_URL.W]: w };
    }
    if (config.mode === "moleToParticle" || config.mode === "particleToMole") {
      return { [CHEMISTRY_BASIC_URL.A]: a };
    }
    if (config.mode === "percentComp") {
      return {
        [CHEMISTRY_BASIC_URL.A]: a,
        [CHEMISTRY_BASIC_URL.B]: b,
        [CHEMISTRY_BASIC_URL.C]: c,
      };
    }
    return {
      [CHEMISTRY_BASIC_URL.A]: a,
      [CHEMISTRY_BASIC_URL.B]: b,
    };
  }, [a, b, c, w, m, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, w, m]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "molarMass": {
        const computed = molarMass({ atomicMassesCsv: w, countsCsv: m });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.molarMass)} g/mol`,
          primaryLabel: "Molar mass",
          rows: [
            { label: "Atoms (sum)", value: `${computed.atoms}` },
            { label: "Masses CSV", value: w || "—" },
            { label: "Counts CSV", value: m || "—" },
          ],
        };
      }
      case "atomicMass": {
        const computed = atomicMass({ massesCsv: w, abundancesCsv: m });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.atomicMass)} u`,
          primaryLabel: "Atomic mass",
          rows: [
            { label: "Masses CSV", value: w || "—" },
            { label: "Abundances CSV", value: m || "—" },
          ],
        };
      }
      case "numberOfMoles": {
        const massP = parseNonNegative(a, "Mass (g)");
        const mmP = parsePositive(b, "Molar mass");
        if (!massP.ok) return { error: massP.error };
        if (!mmP.ok) return { error: mmP.error };
        const computed = numberOfMoles({ massG: massP.value, molarMass: mmP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.moles)} mol`,
          primaryLabel: "Moles n",
          rows: [
            { label: "Mass", value: `${num(massP.value)} g` },
            { label: "Molar mass", value: `${num(mmP.value)} g/mol` },
          ],
        };
      }
      case "moleToMass": {
        const nP = parseNonNegative(a, "Moles");
        const mmP = parsePositive(b, "Molar mass");
        if (!nP.ok) return { error: nP.error };
        if (!mmP.ok) return { error: mmP.error };
        const computed = moleToMass({ moles: nP.value, molarMass: mmP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.massG)} g`,
          primaryLabel: "Mass",
          rows: [
            { label: "Moles", value: `${num(nP.value)} mol` },
            { label: "Molar mass", value: `${num(mmP.value)} g/mol` },
          ],
        };
      }
      case "massToMole": {
        const massP = parseNonNegative(a, "Mass (g)");
        const mmP = parsePositive(b, "Molar mass");
        if (!massP.ok) return { error: massP.error };
        if (!mmP.ok) return { error: mmP.error };
        const computed = massToMole({ massG: massP.value, molarMass: mmP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.moles)} mol`,
          primaryLabel: "Moles n",
          rows: [
            { label: "Mass", value: `${num(massP.value)} g` },
            { label: "Molar mass", value: `${num(mmP.value)} g/mol` },
          ],
        };
      }
      case "moleToParticle": {
        const nP = parseNonNegative(a, "Moles");
        if (!nP.ok) return { error: nP.error };
        const computed = moleToParticle({ moles: nP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.particles, 6)}`,
          primaryLabel: "Particles",
          rows: [{ label: "Moles", value: `${num(nP.value)} mol` }],
        };
      }
      case "particleToMole": {
        const pP = parseNonNegative(a, "Particles");
        if (!pP.ok) return { error: pP.error };
        const computed = particleToMole({ particles: pP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.moles, 6)} mol`,
          primaryLabel: "Moles n",
          rows: [{ label: "Particles", value: num(pP.value, 6) }],
        };
      }
      case "empirical": {
        const computed = empiricalFormula({ molesCsv: w });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.label,
          primaryLabel: "Empirical ratio",
          rows: [
            { label: "Ratios", value: computed.ratios.join(", ") },
            { label: "Moles CSV", value: w || "—" },
          ],
        };
      }
      case "molecular": {
        const empP = parsePositive(a, "Empirical molar mass");
        const molP = parsePositive(b, "Molecular molar mass");
        if (!empP.ok) return { error: empP.error };
        if (!molP.ok) return { error: molP.error };
        const computed = molecularFormula({
          empiricalMolarMass: empP.value,
          molecularMolarMass: molP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.multiplier)}`,
          primaryLabel: "Multiplier",
          rows: [
            { label: "Note", value: computed.note },
            { label: "M_emp", value: `${num(empP.value)} g/mol` },
            { label: "M_mol", value: `${num(molP.value)} g/mol` },
          ],
        };
      }
      case "percentComp": {
        const amP = parsePositive(a, "Element atomic mass");
        const nP = parsePositive(b, "Atom count");
        const mmP = parsePositive(c, "Compound molar mass");
        if (!amP.ok) return { error: amP.error };
        if (!nP.ok) return { error: nP.error };
        if (!mmP.ok) return { error: mmP.error };
        const computed = percentageComposition({
          elementAtomicMass: amP.value,
          atomCount: nP.value,
          compoundMolarMass: mmP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.percent)} %`,
          primaryLabel: "Mass percent",
          rows: [
            { label: "Atomic mass", value: num(amP.value) },
            { label: "Atoms", value: num(nP.value) },
            { label: "M_compound", value: `${num(mmP.value)} g/mol` },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, w, m]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "molarMass" ? (
            <>
              <div>
                <FieldLabel htmlFor="cb-masses">Atomic masses (CSV)</FieldLabel>
                <FieldInput id="cb-masses" value={w} onChange={(ev) => setW(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="cb-counts">Atom counts (CSV)</FieldLabel>
                <FieldInput id="cb-counts" value={m} onChange={(ev) => setM(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "atomicMass" ? (
            <>
              <div>
                <FieldLabel htmlFor="cb-iso">Isotope masses (CSV)</FieldLabel>
                <FieldInput id="cb-iso" value={w} onChange={(ev) => setW(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="cb-ab">Abundances % (CSV)</FieldLabel>
                <FieldInput id="cb-ab" value={m} onChange={(ev) => setM(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "numberOfMoles" || config.mode === "massToMole" ? (
            <>
              <div>
                <FieldLabel htmlFor="cb-mass">Mass (g)</FieldLabel>
                <FieldInput id="cb-mass" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cb-mm">Molar mass (g/mol)</FieldLabel>
                <FieldInput id="cb-mm" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "moleToMass" ? (
            <>
              <div>
                <FieldLabel htmlFor="cb-moles">Moles</FieldLabel>
                <FieldInput id="cb-moles" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cb-mm2">Molar mass (g/mol)</FieldLabel>
                <FieldInput id="cb-mm2" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "moleToParticle" ? (
            <div>
              <FieldLabel htmlFor="cb-n">Moles</FieldLabel>
              <FieldInput id="cb-n" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "particleToMole" ? (
            <div>
              <FieldLabel htmlFor="cb-p">Particles</FieldLabel>
              <FieldInput id="cb-p" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "empirical" ? (
            <div>
              <FieldLabel htmlFor="cb-emp">Mole amounts per element (CSV)</FieldLabel>
              <FieldInput id="cb-emp" value={w} onChange={(ev) => setW(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "molecular" ? (
            <>
              <div>
                <FieldLabel htmlFor="cb-empmm">Empirical molar mass (g/mol)</FieldLabel>
                <FieldInput id="cb-empmm" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cb-molmm">Molecular molar mass (g/mol)</FieldLabel>
                <FieldInput id="cb-molmm" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "percentComp" ? (
            <>
              <div>
                <FieldLabel htmlFor="cb-elam">Element atomic mass</FieldLabel>
                <FieldInput id="cb-elam" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cb-atoms">Atom count</FieldLabel>
                <FieldInput id="cb-atoms" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cb-compmm">Compound molar mass (g/mol)</FieldLabel>
                <FieldInput id="cb-compmm" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
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
