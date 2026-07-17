"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  BIOLOGY_BIOCHEM_URL,
  bufferSolution,
  dilutionBiology,
  gibbsBiology,
  michaelisMenten,
  molarityBiology,
  phFromH,
  proteinConcentration,
} from "@/lib/calculators/biologyBiochemistry";

type BiochemSlug =
  | "ph-calculator-biology"
  | "buffer-solution-calculator-biology"
  | "enzyme-kinetics-michaelis-menten-calculator"
  | "gibbs-free-energy-calculator-biology"
  | "molarity-calculator-biology"
  | "dilution-calculator-biology"
  | "protein-concentration-calculator";

type Mode = "ph" | "buffer" | "michaelis" | "gibbs" | "molarity" | "dilution" | "protein";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
};

const CONFIG: Record<BiochemSlug, Config> = {
  "ph-calculator-biology": {
    title: "pH from [H⁺]",
    description: "pH = −log₁₀[H⁺] (molar).",
    mode: "ph",
    aDefault: "1e-7",
    bDefault: "",
    cDefault: "",
    rDefault: "",
  },
  "buffer-solution-calculator-biology": {
    title: "Buffer pH (Henderson–Hasselbalch)",
    description: "pH = pKa + log([A⁻]/[HA]).",
    mode: "buffer",
    aDefault: "4.76",
    bDefault: "0.1",
    cDefault: "0.1",
    rDefault: "",
  },
  "enzyme-kinetics-michaelis-menten-calculator": {
    title: "Michaelis–Menten kinetics",
    description: "v = Vmax [S] / (Km + [S]).",
    mode: "michaelis",
    aDefault: "100",
    bDefault: "5",
    cDefault: "10",
    rDefault: "",
  },
  "gibbs-free-energy-calculator-biology": {
    title: "Gibbs free energy",
    description: "ΔG = ΔH − T ΔS (educational).",
    mode: "gibbs",
    aDefault: "-50",
    bDefault: "298",
    cDefault: "-0.1",
    rDefault: "",
  },
  "molarity-calculator-biology": {
    title: "Molarity (biology)",
    description: "M = moles / liters.",
    mode: "molarity",
    aDefault: "0.5",
    bDefault: "1",
    cDefault: "",
    rDefault: "",
  },
  "dilution-calculator-biology": {
    title: "Dilution (M₁V₁ = M₂V₂)",
    description: "Leave exactly one of M1, V1, M2, V2 blank to solve.",
    mode: "dilution",
    aDefault: "2",
    bDefault: "0.1",
    cDefault: "0.5",
    rDefault: "",
  },
  "protein-concentration-calculator": {
    title: "Protein concentration (Beer–Lambert)",
    description: "c = A / (ε × path).",
    mode: "protein",
    aDefault: "0.8",
    bDefault: "1",
    cDefault: "1",
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

export function BiologyBiochemistryCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as BiochemSlug] ?? CONFIG["ph-calculator-biology"];
  const [a, setA] = useState(useLoanInitialInput(BIOLOGY_BIOCHEM_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(BIOLOGY_BIOCHEM_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(BIOLOGY_BIOCHEM_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(BIOLOGY_BIOCHEM_URL.R, config.rDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    if (config.mode === "ph") {
      return { [BIOLOGY_BIOCHEM_URL.A]: a };
    }
    if (config.mode === "molarity") {
      return { [BIOLOGY_BIOCHEM_URL.A]: a, [BIOLOGY_BIOCHEM_URL.B]: b };
    }
    if (config.mode === "dilution") {
      return {
        [BIOLOGY_BIOCHEM_URL.A]: a,
        [BIOLOGY_BIOCHEM_URL.B]: b,
        [BIOLOGY_BIOCHEM_URL.C]: c,
        [BIOLOGY_BIOCHEM_URL.R]: r,
      };
    }
    return {
      [BIOLOGY_BIOCHEM_URL.A]: a,
      [BIOLOGY_BIOCHEM_URL.B]: b,
      [BIOLOGY_BIOCHEM_URL.C]: c,
    };
  }, [a, b, c, r, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "ph": {
        const hP = parsePositive(a, "[H⁺] (M)");
        if (!hP.ok) return { error: hP.error };
        const computed = phFromH({ hMolar: hP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.ph),
          primaryLabel: "pH",
          rows: [{ label: "[H⁺]", value: `${num(hP.value, 6)} M` }],
        };
      }
      case "buffer": {
        const pKaP = parseFiniteNumber(a, "pKa");
        const saltP = parsePositive(b, "Salt [A⁻]");
        const acidP = parsePositive(c, "Acid [HA]");
        if (!pKaP.ok) return { error: pKaP.error };
        if (!saltP.ok) return { error: saltP.error };
        if (!acidP.ok) return { error: acidP.error };
        const computed = bufferSolution({
          pKa: pKaP.value,
          saltConc: saltP.value,
          acidConc: acidP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.ph),
          primaryLabel: "Buffer pH",
          rows: [
            { label: "pKa", value: num(pKaP.value) },
            { label: "[A⁻]", value: num(saltP.value) },
            { label: "[HA]", value: num(acidP.value) },
          ],
        };
      }
      case "michaelis": {
        const vmaxP = parseNonNegative(a, "Vmax");
        const kmP = parseNonNegative(b, "Km");
        const sP = parseNonNegative(c, "[S]");
        if (!vmaxP.ok) return { error: vmaxP.error };
        if (!kmP.ok) return { error: kmP.error };
        if (!sP.ok) return { error: sP.error };
        const computed = michaelisMenten({
          vmax: vmaxP.value,
          km: kmP.value,
          s: sP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.v),
          primaryLabel: "Velocity v",
          rows: [
            { label: "Vmax", value: num(vmaxP.value) },
            { label: "Km", value: num(kmP.value) },
            { label: "[S]", value: num(sP.value) },
          ],
        };
      }
      case "gibbs": {
        const dHP = parseFiniteNumber(a, "ΔH");
        const tP = parsePositive(b, "Temperature (K)");
        const dSP = parseFiniteNumber(c, "ΔS");
        if (!dHP.ok) return { error: dHP.error };
        if (!tP.ok) return { error: tP.error };
        if (!dSP.ok) return { error: dSP.error };
        const computed = gibbsBiology({
          deltaH: dHP.value,
          tK: tP.value,
          deltaS: dSP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.deltaG),
          primaryLabel: "ΔG",
          rows: [
            { label: "ΔH", value: num(dHP.value) },
            { label: "T", value: `${num(tP.value)} K` },
            { label: "ΔS", value: num(dSP.value) },
          ],
        };
      }
      case "molarity": {
        const molesP = parseNonNegative(a, "Moles");
        const litersP = parsePositive(b, "Volume (L)");
        if (!molesP.ok) return { error: molesP.error };
        if (!litersP.ok) return { error: litersP.error };
        const computed = molarityBiology({ moles: molesP.value, liters: litersP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.M)} M`,
          primaryLabel: "Molarity",
          rows: [
            { label: "Moles", value: num(molesP.value) },
            { label: "Volume", value: `${num(litersP.value)} L` },
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
        const computed = dilutionBiology({
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
      case "protein": {
        const absP = parseNonNegative(a, "Absorbance");
        const epsP = parsePositive(b, "ε");
        const pathP = parsePositive(c, "Path (cm)");
        if (!absP.ok) return { error: absP.error };
        if (!epsP.ok) return { error: epsP.error };
        if (!pathP.ok) return { error: pathP.error };
        const computed = proteinConcentration({
          absorbance: absP.value,
          epsilon: epsP.value,
          pathCm: pathP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.concentration),
          primaryLabel: "Concentration",
          rows: [
            { label: "A", value: num(absP.value) },
            { label: "ε", value: num(epsP.value) },
            { label: "Path", value: `${num(pathP.value)} cm` },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "ph" ? (
            <div>
              <FieldLabel htmlFor="bb-h">[H⁺] (M)</FieldLabel>
              <FieldInput id="bb-h" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "buffer" ? (
            <>
              <div>
                <FieldLabel htmlFor="bb-pka">pKa</FieldLabel>
                <FieldInput id="bb-pka" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bb-salt">Salt [A⁻]</FieldLabel>
                <FieldInput id="bb-salt" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bb-acid">Acid [HA]</FieldLabel>
                <FieldInput id="bb-acid" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "michaelis" ? (
            <>
              <div>
                <FieldLabel htmlFor="bb-vmax">Vmax</FieldLabel>
                <FieldInput id="bb-vmax" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bb-km">Km</FieldLabel>
                <FieldInput id="bb-km" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bb-s">[S]</FieldLabel>
                <FieldInput id="bb-s" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "gibbs" ? (
            <>
              <div>
                <FieldLabel htmlFor="bb-dh">ΔH</FieldLabel>
                <FieldInput id="bb-dh" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bb-tk">Temperature (K)</FieldLabel>
                <FieldInput id="bb-tk" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bb-ds">ΔS</FieldLabel>
                <FieldInput id="bb-ds" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "molarity" ? (
            <>
              <div>
                <FieldLabel htmlFor="bb-moles">Moles</FieldLabel>
                <FieldInput id="bb-moles" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bb-liters">Volume (L)</FieldLabel>
                <FieldInput id="bb-liters" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "dilution" ? (
            <>
              <div>
                <FieldLabel htmlFor="bb-m1">M1 (leave blank to solve)</FieldLabel>
                <FieldInput id="bb-m1" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bb-v1">V1 (leave blank to solve)</FieldLabel>
                <FieldInput id="bb-v1" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bb-m2">M2 (leave blank to solve)</FieldLabel>
                <FieldInput id="bb-m2" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bb-v2">V2 (leave blank to solve)</FieldLabel>
                <FieldInput id="bb-v2" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "protein" ? (
            <>
              <div>
                <FieldLabel htmlFor="bb-abs">Absorbance A</FieldLabel>
                <FieldInput id="bb-abs" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bb-eps">ε (extinction)</FieldLabel>
                <FieldInput id="bb-eps" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bb-path">Path length (cm)</FieldLabel>
                <FieldInput id="bb-path" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
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
