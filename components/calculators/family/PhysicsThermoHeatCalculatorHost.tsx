"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  PHYSICS_THERMO_URL,
  boylesLaw,
  carnotEfficiency,
  charlesLaw,
  heatEnergy,
  idealGasLaw,
  latentHeat,
  pressureVolumeWork,
  specificHeat,
  thermoWorkIsobaric,
} from "@/lib/calculators/physicsThermoHeat";

type ThermoSlug =
  | "heat-energy-calculator-physics"
  | "specific-heat-calculator-physics"
  | "latent-heat-calculator-physics"
  | "ideal-gas-law-calculator-physics"
  | "boyles-law-calculator-physics"
  | "charles-law-calculator-physics"
  | "pressure-volume-calculator-physics"
  | "work-done-thermodynamics-calculator"
  | "carnot-efficiency-calculator";

type Mode =
  | "heat"
  | "specificHeat"
  | "latent"
  | "idealGas"
  | "boyle"
  | "charles"
  | "pvWork"
  | "isobaric"
  | "carnot";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  nDefault: string;
  pDefault: string;
};

const CONFIG: Record<ThermoSlug, Config> = {
  "heat-energy-calculator-physics": {
    title: "Heat energy (Q = mcΔT)",
    description: "Sensible heat from mass, specific heat, and temperature change.",
    mode: "heat",
    aDefault: "1",
    bDefault: "4186",
    cDefault: "10",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    pDefault: "",
  },
  "specific-heat-calculator-physics": {
    title: "Specific heat",
    description: "c = Q / (m ΔT) from heat, mass, and temperature change.",
    mode: "specificHeat",
    aDefault: "41860",
    bDefault: "1",
    cDefault: "10",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    pDefault: "",
  },
  "latent-heat-calculator-physics": {
    title: "Latent heat",
    description: "Q = m L for phase-change energy (SI).",
    mode: "latent",
    aDefault: "1",
    bDefault: "334000",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    pDefault: "",
  },
  "ideal-gas-law-calculator-physics": {
    title: "Ideal gas law",
    description: "PV = nRT — leave exactly one of P, V, n, T blank to solve.",
    mode: "idealGas",
    aDefault: "0.0224",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "273.15",
    nDefault: "1",
    pDefault: "101325",
  },
  "boyles-law-calculator-physics": {
    title: "Boyle’s law",
    description: "P₁V₁ = P₂V₂ — enter P1, V1, and either P2 or V2.",
    mode: "boyle",
    aDefault: "101325",
    bDefault: "0.001",
    cDefault: "",
    rDefault: "0.0005",
    tDefault: "",
    nDefault: "",
    pDefault: "",
  },
  "charles-law-calculator-physics": {
    title: "Charles’s law",
    description: "V/T constant — enter V1, T1 (K), and either V2 or T2.",
    mode: "charles",
    aDefault: "0.001",
    bDefault: "273.15",
    cDefault: "",
    rDefault: "373.15",
    tDefault: "",
    nDefault: "",
    pDefault: "",
  },
  "pressure-volume-calculator-physics": {
    title: "Pressure–volume work",
    description: "W = P (V₂ − V₁) for constant-pressure expansion/compression.",
    mode: "pvWork",
    aDefault: "101325",
    bDefault: "0.001",
    cDefault: "0.002",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    pDefault: "",
  },
  "work-done-thermodynamics-calculator": {
    title: "Isobaric work",
    description: "W = P ΔV for constant-pressure thermodynamic work.",
    mode: "isobaric",
    aDefault: "101325",
    bDefault: "0.001",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    pDefault: "",
  },
  "carnot-efficiency-calculator": {
    title: "Carnot efficiency",
    description: "η = 1 − Tc/Th for an ideal heat engine (temperatures in K).",
    mode: "carnot",
    aDefault: "600",
    bDefault: "300",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    nDefault: "",
    pDefault: "",
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

export function PhysicsThermoHeatCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as ThermoSlug] ?? CONFIG["heat-energy-calculator-physics"];
  const [a, setA] = useState(useLoanInitialInput(PHYSICS_THERMO_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(PHYSICS_THERMO_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(PHYSICS_THERMO_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(PHYSICS_THERMO_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(PHYSICS_THERMO_URL.T, config.tDefault));
  const [n, setN] = useState(useLoanInitialInput(PHYSICS_THERMO_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(PHYSICS_THERMO_URL.P, config.pDefault));

  const num = (nVal: number, d = 4) => {
    if (!Number.isFinite(nVal)) return "—";
    const abs = Math.abs(nVal);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return nVal.toExponential(4);
    return nVal.toFixed(d);
  };

  const shareParams = useCallback(() => {
    if (config.mode === "idealGas") {
      return {
        [PHYSICS_THERMO_URL.A]: a,
        [PHYSICS_THERMO_URL.N]: n,
        [PHYSICS_THERMO_URL.P]: p,
        [PHYSICS_THERMO_URL.T]: t,
      };
    }
    if (config.mode === "boyle" || config.mode === "charles") {
      return {
        [PHYSICS_THERMO_URL.A]: a,
        [PHYSICS_THERMO_URL.B]: b,
        [PHYSICS_THERMO_URL.C]: c,
        [PHYSICS_THERMO_URL.R]: r,
      };
    }
    if (config.mode === "heat" || config.mode === "specificHeat" || config.mode === "pvWork") {
      return {
        [PHYSICS_THERMO_URL.A]: a,
        [PHYSICS_THERMO_URL.B]: b,
        [PHYSICS_THERMO_URL.C]: c,
      };
    }
    return {
      [PHYSICS_THERMO_URL.A]: a,
      [PHYSICS_THERMO_URL.B]: b,
    };
  }, [a, b, c, r, t, n, p, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t, n, p]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "heat": {
        const mP = parsePositive(a, "Mass (kg)");
        const cP = parsePositive(b, "Specific heat c");
        const dTP = parseFiniteNumber(c, "ΔT (K)");
        if (!mP.ok) return { error: mP.error };
        if (!cP.ok) return { error: cP.error };
        if (!dTP.ok) return { error: dTP.error };
        const computed = heatEnergy({ massKg: mP.value, c: cP.value, deltaT: dTP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.qJ)} J`,
          primaryLabel: "Heat Q",
          rows: [
            { label: "Mass", value: `${num(mP.value)} kg` },
            { label: "c", value: `${num(cP.value)} J/(kg·K)` },
            { label: "ΔT", value: `${num(dTP.value)} K` },
          ],
        };
      }
      case "specificHeat": {
        const qP = parseFiniteNumber(a, "Heat Q (J)");
        const mP = parsePositive(b, "Mass (kg)");
        const dTP = parseFiniteNumber(c, "ΔT (K)");
        if (!qP.ok) return { error: qP.error };
        if (!mP.ok) return { error: mP.error };
        if (!dTP.ok) return { error: dTP.error };
        const computed = specificHeat({ qJ: qP.value, massKg: mP.value, deltaT: dTP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.c)} J/(kg·K)`,
          primaryLabel: "Specific heat c",
          rows: [
            { label: "Q", value: `${num(qP.value)} J` },
            { label: "Mass", value: `${num(mP.value)} kg` },
            { label: "ΔT", value: `${num(dTP.value)} K` },
          ],
        };
      }
      case "latent": {
        const mP = parsePositive(a, "Mass (kg)");
        const lP = parsePositive(b, "Latent heat L");
        if (!mP.ok) return { error: mP.error };
        if (!lP.ok) return { error: lP.error };
        const computed = latentHeat({ massKg: mP.value, lJkg: lP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.qJ)} J`,
          primaryLabel: "Heat Q",
          rows: [
            { label: "Mass", value: `${num(mP.value)} kg` },
            { label: "L", value: `${num(lP.value)} J/kg` },
          ],
        };
      }
      case "idealGas": {
        const vP = optionalPositive(a, "Volume V (m³)");
        const nP = optionalPositive(n, "Amount n (mol)");
        const pP = optionalPositive(p, "Pressure P (Pa)");
        const tP = optionalPositive(t, "Temperature T (K)");
        if (!vP.ok) return { error: vP.error };
        if (!nP.ok) return { error: nP.error };
        if (!pP.ok) return { error: pP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = idealGasLaw({
          pPa: pP.value,
          vM3: vP.value,
          nMol: nP.value,
          tK: tP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.pPa)} Pa`,
          primaryLabel: "Pressure P",
          rows: [
            { label: "V", value: `${num(computed.vM3)} m³` },
            { label: "n", value: `${num(computed.nMol)} mol` },
            { label: "T", value: `${num(computed.tK)} K` },
            { label: "R", value: "8.314 J/(mol·K)" },
          ],
        };
      }
      case "boyle": {
        const p1P = parsePositive(a, "P1 (Pa)");
        const v1P = parsePositive(b, "V1 (m³)");
        const p2P = optionalPositive(c, "P2 (Pa)");
        const v2P = optionalPositive(r, "V2 (m³)");
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
          primary: `${num(computed.p2)} Pa`,
          primaryLabel: "P2",
          rows: [
            { label: "V2", value: `${num(computed.v2)} m³` },
            { label: "P1 × V1", value: num(p1P.value * v1P.value) },
          ],
        };
      }
      case "charles": {
        const v1P = parsePositive(a, "V1 (m³)");
        const t1P = parsePositive(b, "T1 (K)");
        const v2P = optionalPositive(c, "V2 (m³)");
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
          primary: `${num(computed.v2)} m³`,
          primaryLabel: "V2",
          rows: [
            { label: "T2", value: `${num(computed.t2K)} K` },
            { label: "V1 / T1", value: num(v1P.value / t1P.value) },
          ],
        };
      }
      case "pvWork": {
        const pP = parseNonNegative(a, "Pressure P (Pa)");
        const v1P = parseNonNegative(b, "V1 (m³)");
        const v2P = parseNonNegative(c, "V2 (m³)");
        if (!pP.ok) return { error: pP.error };
        if (!v1P.ok) return { error: v1P.error };
        if (!v2P.ok) return { error: v2P.error };
        const computed = pressureVolumeWork({
          pPa: pP.value,
          v1: v1P.value,
          v2: v2P.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.workJ)} J`,
          primaryLabel: "Work W",
          rows: [
            { label: "P", value: `${num(pP.value)} Pa` },
            { label: "ΔV", value: `${num(v2P.value - v1P.value)} m³` },
          ],
        };
      }
      case "isobaric": {
        const pP = parseNonNegative(a, "Pressure P (Pa)");
        const dVP = parseFiniteNumber(b, "ΔV (m³)");
        if (!pP.ok) return { error: pP.error };
        if (!dVP.ok) return { error: dVP.error };
        const computed = thermoWorkIsobaric({ pPa: pP.value, deltaV: dVP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.workJ)} J`,
          primaryLabel: "Work W",
          rows: [
            { label: "P", value: `${num(pP.value)} Pa` },
            { label: "ΔV", value: `${num(dVP.value)} m³` },
          ],
        };
      }
      case "carnot": {
        const thP = parsePositive(a, "Th (K)");
        const tcP = parsePositive(b, "Tc (K)");
        if (!thP.ok) return { error: thP.error };
        if (!tcP.ok) return { error: tcP.error };
        const computed = carnotEfficiency({ thK: thP.value, tcK: tcP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.percent, 2)}%`,
          primaryLabel: "Carnot efficiency",
          rows: [
            { label: "η (fraction)", value: num(computed.efficiency, 6) },
            { label: "Th", value: `${num(thP.value)} K` },
            { label: "Tc", value: `${num(tcP.value)} K` },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, n, p]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "heat" ? (
            <>
              <div>
                <FieldLabel htmlFor="pt-m">Mass m (kg)</FieldLabel>
                <FieldInput id="pt-m" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-c">Specific heat c (J/(kg·K))</FieldLabel>
                <FieldInput id="pt-c" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-dt">ΔT (K)</FieldLabel>
                <FieldInput id="pt-dt" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "specificHeat" ? (
            <>
              <div>
                <FieldLabel htmlFor="pt-q">Heat Q (J)</FieldLabel>
                <FieldInput id="pt-q" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-sm">Mass m (kg)</FieldLabel>
                <FieldInput id="pt-sm" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-sdt">ΔT (K)</FieldLabel>
                <FieldInput id="pt-sdt" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "latent" ? (
            <>
              <div>
                <FieldLabel htmlFor="pt-lm">Mass m (kg)</FieldLabel>
                <FieldInput id="pt-lm" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-l">Latent heat L (J/kg)</FieldLabel>
                <FieldInput id="pt-l" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "idealGas" ? (
            <>
              <div>
                <FieldLabel htmlFor="pt-p">P (Pa, leave blank to solve)</FieldLabel>
                <FieldInput id="pt-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-v">V (m³, leave blank to solve)</FieldLabel>
                <FieldInput id="pt-v" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-n">n (mol, leave blank to solve)</FieldLabel>
                <FieldInput id="pt-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-t">T (K, leave blank to solve)</FieldLabel>
                <FieldInput id="pt-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "boyle" ? (
            <>
              <div>
                <FieldLabel htmlFor="pt-p1">P1 (Pa)</FieldLabel>
                <FieldInput id="pt-p1" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-v1">V1 (m³)</FieldLabel>
                <FieldInput id="pt-v1" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-p2">P2 (Pa, optional)</FieldLabel>
                <FieldInput id="pt-p2" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-v2">V2 (m³, optional)</FieldLabel>
                <FieldInput id="pt-v2" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "charles" ? (
            <>
              <div>
                <FieldLabel htmlFor="pt-cv1">V1 (m³)</FieldLabel>
                <FieldInput id="pt-cv1" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-ct1">T1 (K)</FieldLabel>
                <FieldInput id="pt-ct1" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-cv2">V2 (m³, optional)</FieldLabel>
                <FieldInput id="pt-cv2" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-ct2">T2 (K, optional)</FieldLabel>
                <FieldInput id="pt-ct2" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "pvWork" ? (
            <>
              <div>
                <FieldLabel htmlFor="pt-pvp">P (Pa)</FieldLabel>
                <FieldInput id="pt-pvp" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-pvv1">V1 (m³)</FieldLabel>
                <FieldInput id="pt-pvv1" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-pvv2">V2 (m³)</FieldLabel>
                <FieldInput id="pt-pvv2" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "isobaric" ? (
            <>
              <div>
                <FieldLabel htmlFor="pt-ip">P (Pa)</FieldLabel>
                <FieldInput id="pt-ip" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-idv">ΔV (m³)</FieldLabel>
                <FieldInput id="pt-idv" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "carnot" ? (
            <>
              <div>
                <FieldLabel htmlFor="pt-th">Hot reservoir Th (K)</FieldLabel>
                <FieldInput id="pt-th" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pt-tc">Cold reservoir Tc (K)</FieldLabel>
                <FieldInput id="pt-tc" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
