"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import {
  CHEMISTRY_GAS_URL,
  boylesLaw,
  charlesLaw,
  combinedGasLaw,
  daltonsLaw,
  gasDensity,
  gayLussacsLaw,
  idealGasLaw,
  rmsSpeed,
} from "@/lib/calculators/chemistryGasLaws";

type GasSlug =
  | "ideal-gas-law-calculator-chemistry"
  | "boyles-law-calculator-chemistry"
  | "charles-law-calculator-chemistry"
  | "gay-lussacs-law-calculator"
  | "combined-gas-law-calculator"
  | "daltons-law-partial-pressure-calculator"
  | "gas-density-calculator"
  | "rms-speed-calculator";

type Mode =
  | "ideal"
  | "boyle"
  | "charles"
  | "gayLussac"
  | "combined"
  | "dalton"
  | "density"
  | "rms";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  pDefault: string;
  nDefault: string;
  wDefault: string;
};

const CONFIG: Record<GasSlug, Config> = {
  "ideal-gas-law-calculator-chemistry": {
    title: "Ideal gas law",
    description: "PV = nRT (R = 8.314 J·mol⁻¹·K⁻¹) — leave one of P, V, n, T blank.",
    mode: "ideal",
    aDefault: "0.0224",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "273.15",
    pDefault: "101325",
    nDefault: "1",
    wDefault: "",
  },
  "boyles-law-calculator-chemistry": {
    title: "Boyle’s law",
    description: "P₁V₁ = P₂V₂ — leave exactly one of P2 or V2 blank.",
    mode: "boyle",
    aDefault: "101325",
    bDefault: "0.001",
    cDefault: "",
    rDefault: "0.0005",
    tDefault: "",
    pDefault: "",
    nDefault: "",
    wDefault: "",
  },
  "charles-law-calculator-chemistry": {
    title: "Charles’s law",
    description: "V/T constant — leave exactly one of V2 or T2 blank.",
    mode: "charles",
    aDefault: "0.001",
    bDefault: "273.15",
    cDefault: "",
    rDefault: "373.15",
    tDefault: "",
    pDefault: "",
    nDefault: "",
    wDefault: "",
  },
  "gay-lussacs-law-calculator": {
    title: "Gay-Lussac’s law",
    description: "P/T constant — leave exactly one of P2 or T2 blank.",
    mode: "gayLussac",
    aDefault: "101325",
    bDefault: "273.15",
    cDefault: "",
    rDefault: "373.15",
    tDefault: "",
    pDefault: "",
    nDefault: "",
    wDefault: "",
  },
  "combined-gas-law-calculator": {
    title: "Combined gas law",
    description: "P₁V₁/T₁ = P₂V₂/T₂ — leave exactly one of P2, V2, T2 blank.",
    mode: "combined",
    aDefault: "101325",
    bDefault: "0.001",
    cDefault: "273.15",
    rDefault: "",
    tDefault: "0.002",
    pDefault: "",
    nDefault: "",
    wDefault: "300",
  },
  "daltons-law-partial-pressure-calculator": {
    title: "Dalton’s law",
    description: "Total pressure = sum of partial pressures (CSV).",
    mode: "dalton",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    pDefault: "",
    nDefault: "",
    wDefault: "20000,30000,50000",
  },
  "gas-density-calculator": {
    title: "Gas density",
    description: "ρ = P M / (R T) with P in Pa and M in g/mol (as kg/kmol scale).",
    mode: "density",
    aDefault: "101325",
    bDefault: "0.02897",
    cDefault: "273.15",
    rDefault: "",
    tDefault: "",
    pDefault: "",
    nDefault: "",
    wDefault: "",
  },
  "rms-speed-calculator": {
    title: "RMS speed",
    description: "v_rms = √(3RT/M) with M in kg/mol.",
    mode: "rms",
    aDefault: "298.15",
    bDefault: "0.02897",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    pDefault: "",
    nDefault: "",
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

function optionalPositive(raw: string, label: string) {
  if (raw.trim() === "") return { ok: true as const, value: null as number | null };
  const p = parsePositive(raw, label);
  if (!p.ok) return p;
  return { ok: true as const, value: p.value as number | null };
}

export function ChemistryGasLawsCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as GasSlug] ?? CONFIG["ideal-gas-law-calculator-chemistry"];
  const [a, setA] = useState(useLoanInitialInput(CHEMISTRY_GAS_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CHEMISTRY_GAS_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CHEMISTRY_GAS_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(CHEMISTRY_GAS_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(CHEMISTRY_GAS_URL.T, config.tDefault));
  const [p, setP] = useState(useLoanInitialInput(CHEMISTRY_GAS_URL.P, config.pDefault));
  const [n, setN] = useState(useLoanInitialInput(CHEMISTRY_GAS_URL.N, config.nDefault));
  const [w, setW] = useState(useLoanInitialInput(CHEMISTRY_GAS_URL.W, config.wDefault));

  const num = (nVal: number, d = 4) => {
    if (!Number.isFinite(nVal)) return "—";
    const abs = Math.abs(nVal);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return nVal.toExponential(4);
    return nVal.toFixed(d);
  };

  const shareParams = useCallback(() => {
    if (config.mode === "ideal") {
      return {
        [CHEMISTRY_GAS_URL.P]: p,
        [CHEMISTRY_GAS_URL.A]: a,
        [CHEMISTRY_GAS_URL.N]: n,
        [CHEMISTRY_GAS_URL.T]: t,
      };
    }
    if (config.mode === "boyle" || config.mode === "charles" || config.mode === "gayLussac") {
      return {
        [CHEMISTRY_GAS_URL.A]: a,
        [CHEMISTRY_GAS_URL.B]: b,
        [CHEMISTRY_GAS_URL.C]: c,
        [CHEMISTRY_GAS_URL.R]: r,
      };
    }
    if (config.mode === "combined") {
      return {
        [CHEMISTRY_GAS_URL.A]: a,
        [CHEMISTRY_GAS_URL.B]: b,
        [CHEMISTRY_GAS_URL.C]: c,
        [CHEMISTRY_GAS_URL.R]: r,
        [CHEMISTRY_GAS_URL.T]: t,
        [CHEMISTRY_GAS_URL.W]: w,
      };
    }
    if (config.mode === "dalton") {
      return { [CHEMISTRY_GAS_URL.W]: w };
    }
    if (config.mode === "density") {
      return {
        [CHEMISTRY_GAS_URL.A]: a,
        [CHEMISTRY_GAS_URL.B]: b,
        [CHEMISTRY_GAS_URL.C]: c,
      };
    }
    return {
      [CHEMISTRY_GAS_URL.A]: a,
      [CHEMISTRY_GAS_URL.B]: b,
    };
  }, [a, b, c, r, t, p, n, w, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t, p, n, w]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "ideal": {
        const pP = optionalPositive(p, "P (Pa)");
        const vP = optionalPositive(a, "V (m³)");
        const nP = optionalPositive(n, "n (mol)");
        const tP = optionalPositive(t, "T (K)");
        if (!pP.ok) return { error: pP.error };
        if (!vP.ok) return { error: vP.error };
        if (!nP.ok) return { error: nP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = idealGasLaw({
          pPa: pP.value,
          vM3: vP.value,
          nMol: nP.value,
          tK: tP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `P=${num(computed.pPa)} Pa`,
          primaryLabel: "Ideal gas state",
          rows: [
            { label: "V", value: `${num(computed.vM3)} m³` },
            { label: "n", value: `${num(computed.nMol)} mol` },
            { label: "T", value: `${num(computed.tK)} K` },
            { label: "R", value: "8.314462618 J·mol⁻¹·K⁻¹" },
          ],
        };
      }
      case "boyle": {
        const p1P = parsePositive(a, "P1");
        const v1P = parsePositive(b, "V1");
        const p2P = optionalPositive(c, "P2");
        const v2P = optionalPositive(r, "V2");
        if (!p1P.ok) return { error: p1P.error };
        if (!v1P.ok) return { error: v1P.error };
        if (!p2P.ok) return { error: p2P.error };
        if (!v2P.ok) return { error: v2P.error };
        const computed = boylesLaw({
          p1: p1P.value,
          v1: v1P.value,
          p2: p2P.value,
          v2: v2P.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `P2=${num(computed.p2)}, V2=${num(computed.v2)}`,
          primaryLabel: "Boyle result",
          rows: [
            { label: "P2", value: num(computed.p2) },
            { label: "V2", value: num(computed.v2) },
          ],
        };
      }
      case "charles": {
        const v1P = parsePositive(a, "V1");
        const t1P = parsePositive(b, "T1 (K)");
        const v2P = optionalPositive(c, "V2");
        const t2P = optionalPositive(r, "T2 (K)");
        if (!v1P.ok) return { error: v1P.error };
        if (!t1P.ok) return { error: t1P.error };
        if (!v2P.ok) return { error: v2P.error };
        if (!t2P.ok) return { error: t2P.error };
        const computed = charlesLaw({
          v1: v1P.value,
          t1K: t1P.value,
          v2: v2P.value,
          t2K: t2P.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `V2=${num(computed.v2)}, T2=${num(computed.t2K)} K`,
          primaryLabel: "Charles result",
          rows: [
            { label: "V2", value: num(computed.v2) },
            { label: "T2", value: `${num(computed.t2K)} K` },
          ],
        };
      }
      case "gayLussac": {
        const p1P = parsePositive(a, "P1");
        const t1P = parsePositive(b, "T1 (K)");
        const p2P = optionalPositive(c, "P2");
        const t2P = optionalPositive(r, "T2 (K)");
        if (!p1P.ok) return { error: p1P.error };
        if (!t1P.ok) return { error: t1P.error };
        if (!p2P.ok) return { error: p2P.error };
        if (!t2P.ok) return { error: t2P.error };
        const computed = gayLussacsLaw({
          p1: p1P.value,
          t1K: t1P.value,
          p2: p2P.value,
          t2K: t2P.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `P2=${num(computed.p2)}, T2=${num(computed.t2K)} K`,
          primaryLabel: "Gay-Lussac result",
          rows: [
            { label: "P2", value: num(computed.p2) },
            { label: "T2", value: `${num(computed.t2K)} K` },
          ],
        };
      }
      case "combined": {
        const p1P = parsePositive(a, "P1");
        const v1P = parsePositive(b, "V1");
        const t1P = parsePositive(c, "T1 (K)");
        const p2P = optionalPositive(r, "P2");
        const v2P = optionalPositive(t, "V2");
        const t2P = optionalPositive(w, "T2 (K)");
        if (!p1P.ok) return { error: p1P.error };
        if (!v1P.ok) return { error: v1P.error };
        if (!t1P.ok) return { error: t1P.error };
        if (!p2P.ok) return { error: p2P.error };
        if (!v2P.ok) return { error: v2P.error };
        if (!t2P.ok) return { error: t2P.error };
        const computed = combinedGasLaw({
          p1: p1P.value,
          v1: v1P.value,
          t1K: t1P.value,
          p2: p2P.value,
          v2: v2P.value,
          t2K: t2P.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `P2=${num(computed.p2)}, V2=${num(computed.v2)}, T2=${num(computed.t2K)} K`,
          primaryLabel: "Combined gas law",
          rows: [
            { label: "P2", value: num(computed.p2) },
            { label: "V2", value: num(computed.v2) },
            { label: "T2", value: `${num(computed.t2K)} K` },
          ],
        };
      }
      case "dalton": {
        const computed = daltonsLaw({ partialsCsv: w });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.totalP)}`,
          primaryLabel: "Total pressure",
          rows: [{ label: "Components", value: `${computed.count}` }],
        };
      }
      case "density": {
        const pP = parsePositive(a, "P (Pa)");
        const mmP = parsePositive(b, "Molar mass");
        const tP = parsePositive(c, "T (K)");
        if (!pP.ok) return { error: pP.error };
        if (!mmP.ok) return { error: mmP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = gasDensity({
          pPa: pP.value,
          molarMass: mmP.value,
          tK: tP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.density)}`,
          primaryLabel: "Density ρ = PM/RT",
          rows: [
            { label: "P", value: `${num(pP.value)} Pa` },
            { label: "M", value: `${num(mmP.value)}` },
            { label: "T", value: `${num(tP.value)} K` },
          ],
        };
      }
      case "rms": {
        const tP = parsePositive(a, "T (K)");
        const mmP = parsePositive(b, "Molar mass (kg/mol)");
        if (!tP.ok) return { error: tP.error };
        if (!mmP.ok) return { error: mmP.error };
        const computed = rmsSpeed({ tK: tP.value, molarMassKg: mmP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.vRms)} m/s`,
          primaryLabel: "RMS molecular speed",
          rows: [
            { label: "T", value: `${num(tP.value)} K` },
            { label: "M", value: `${num(mmP.value)} kg/mol` },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, p, n, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "ideal" ? (
            <>
              <div>
                <FieldLabel htmlFor="cg-p">P (Pa, leave blank to solve)</FieldLabel>
                <FieldInput id="cg-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-v">V (m³, leave blank to solve)</FieldLabel>
                <FieldInput id="cg-v" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-n">n (mol, leave blank to solve)</FieldLabel>
                <FieldInput id="cg-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-t">T (K, leave blank to solve)</FieldLabel>
                <FieldInput id="cg-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "boyle" ? (
            <>
              <div>
                <FieldLabel htmlFor="cg-p1">P1</FieldLabel>
                <FieldInput id="cg-p1" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-v1">V1</FieldLabel>
                <FieldInput id="cg-v1" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-p2">P2 (optional)</FieldLabel>
                <FieldInput id="cg-p2" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-v2">V2 (optional)</FieldLabel>
                <FieldInput id="cg-v2" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "charles" ? (
            <>
              <div>
                <FieldLabel htmlFor="cg-cv1">V1</FieldLabel>
                <FieldInput id="cg-cv1" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-ct1">T1 (K)</FieldLabel>
                <FieldInput id="cg-ct1" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-cv2">V2 (optional)</FieldLabel>
                <FieldInput id="cg-cv2" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-ct2">T2 (K, optional)</FieldLabel>
                <FieldInput id="cg-ct2" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "gayLussac" ? (
            <>
              <div>
                <FieldLabel htmlFor="cg-gp1">P1</FieldLabel>
                <FieldInput id="cg-gp1" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-gt1">T1 (K)</FieldLabel>
                <FieldInput id="cg-gt1" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-gp2">P2 (optional)</FieldLabel>
                <FieldInput id="cg-gp2" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-gt2">T2 (K, optional)</FieldLabel>
                <FieldInput id="cg-gt2" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "combined" ? (
            <>
              <div>
                <FieldLabel htmlFor="cg-cp1">P1</FieldLabel>
                <FieldInput id="cg-cp1" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-cv1c">V1</FieldLabel>
                <FieldInput id="cg-cv1c" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-ct1c">T1 (K)</FieldLabel>
                <FieldInput id="cg-ct1c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-cp2">P2 (leave blank to solve)</FieldLabel>
                <FieldInput id="cg-cp2" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-cv2c">V2 (leave blank to solve)</FieldLabel>
                <FieldInput id="cg-cv2c" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-ct2c">T2 (K, leave blank to solve)</FieldLabel>
                <FieldInput id="cg-ct2c" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "dalton" ? (
            <div>
              <FieldLabel htmlFor="cg-partials">Partial pressures (CSV)</FieldLabel>
              <FieldInput id="cg-partials" value={w} onChange={(ev) => setW(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "density" ? (
            <>
              <div>
                <FieldLabel htmlFor="cg-dp">P (Pa)</FieldLabel>
                <FieldInput id="cg-dp" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-mm">Molar mass (kg/mol for SI ρ)</FieldLabel>
                <FieldInput id="cg-mm" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-dt">T (K)</FieldLabel>
                <FieldInput id="cg-dt" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "rms" ? (
            <>
              <div>
                <FieldLabel htmlFor="cg-rt">T (K)</FieldLabel>
                <FieldInput id="cg-rt" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cg-rmm">Molar mass (kg/mol)</FieldLabel>
                <FieldInput id="cg-rmm" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
