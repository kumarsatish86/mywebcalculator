"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  BIOLOGY_LAB_URL,
  centrifugeRcfRpm,
  dnaConcentration,
  gelElectrophoresis,
  labSolutionBiology,
  pcrCalculator,
  serialDilution,
} from "@/lib/calculators/biologyLabResearch";

type LabSlug =
  | "serial-dilution-calculator"
  | "centrifuge-rcf-rpm-calculator"
  | "dna-concentration-calculator"
  | "pcr-calculator"
  | "gel-electrophoresis-calculator"
  | "lab-solution-calculator-biology";

type Mode = "serial" | "centrifuge" | "dna" | "pcr" | "gel" | "solution";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  nDefault: string;
  vDefault: string;
  mDefault: string;
};

const CONFIG: Record<LabSlug, Config> = {
  "serial-dilution-calculator": {
    title: "Serial dilution",
    description: "C_final = C_initial / DF^steps. Educational bench math.",
    mode: "serial",
    aDefault: "1",
    bDefault: "10",
    cDefault: "",
    rDefault: "",
    nDefault: "3",
    vDefault: "",
    mDefault: "",
  },
  "centrifuge-rcf-rpm-calculator": {
    title: "Centrifuge RCF ↔ RPM",
    description: "RCF = 1.118×10⁻⁵ × r_mm × RPM². Enter RPM or RCF (leave one blank).",
    mode: "centrifuge",
    aDefault: "100",
    bDefault: "10000",
    cDefault: "",
    rDefault: "",
    nDefault: "",
    vDefault: "",
    mDefault: "",
  },
  "dna-concentration-calculator": {
    title: "DNA concentration",
    description: "dsDNA ng/µL ≈ A260 × 50 × dilution factor. Educational spectrophotometry math.",
    mode: "dna",
    aDefault: "0.5",
    bDefault: "1",
    cDefault: "",
    rDefault: "",
    nDefault: "",
    vDefault: "",
    mDefault: "",
  },
  "pcr-calculator": {
    title: "PCR copies",
    description: "Theoretical amplicon copies = N₀ × 2^cycles (ideal). Classroom PCR math.",
    mode: "pcr",
    aDefault: "1",
    bDefault: "30",
    cDefault: "",
    rDefault: "",
    nDefault: "",
    vDefault: "",
    mDefault: "",
  },
  "gel-electrophoresis-calculator": {
    title: "Gel electrophoresis Rf",
    description: "Rf = migration / dye-front distance. Educational gel math.",
    mode: "gel",
    aDefault: "35",
    bDefault: "80",
    cDefault: "",
    rDefault: "",
    nDefault: "",
    vDefault: "",
    mDefault: "",
  },
  "lab-solution-calculator-biology": {
    title: "Lab solution (biology)",
    description: "Mode c1v1 (dilution V1) or mass (M × V × MW). Enter mode in r: c1v1 | mass.",
    mode: "solution",
    aDefault: "1",
    bDefault: "0.1",
    cDefault: "",
    rDefault: "c1v1",
    nDefault: "",
    vDefault: "0.1",
    mDefault: "0.5",
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

function optionalFinite(raw: string, label: string) {
  if (raw.trim() === "") return { ok: true as const, value: null as number | null };
  const p = parseFiniteNumber(raw, label);
  if (!p.ok) return p;
  return { ok: true as const, value: p.value as number | null };
}

function parseSolutionMode(raw: string): "c1v1" | "mass" | { error: string } {
  const t = raw.trim().toLowerCase();
  if (t === "" || t === "c1v1") return "c1v1";
  if (t === "mass") return "mass";
  return { error: "Mode must be c1v1 or mass." };
}

export function BiologyLabResearchCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as LabSlug] ?? CONFIG["serial-dilution-calculator"];
  const [a, setA] = useState(useLoanInitialInput(BIOLOGY_LAB_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(BIOLOGY_LAB_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(BIOLOGY_LAB_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(BIOLOGY_LAB_URL.R, config.rDefault));
  const [n, setN] = useState(useLoanInitialInput(BIOLOGY_LAB_URL.N, config.nDefault));
  const [v, setV] = useState(useLoanInitialInput(BIOLOGY_LAB_URL.V, config.vDefault));
  const [m, setM] = useState(useLoanInitialInput(BIOLOGY_LAB_URL.M, config.mDefault));

  const num = (val: number, d = 4) => {
    if (!Number.isFinite(val)) return "—";
    const abs = Math.abs(val);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return val.toExponential(4);
    return val.toFixed(d);
  };

  const solutionMode = parseSolutionMode(r);

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (key: string, val: string) => {
      if (val.trim() !== "") out[key] = val;
    };
    switch (config.mode) {
      case "serial":
        put(BIOLOGY_LAB_URL.A, a);
        put(BIOLOGY_LAB_URL.B, b);
        put(BIOLOGY_LAB_URL.N, n);
        break;
      case "centrifuge":
        put(BIOLOGY_LAB_URL.A, a);
        put(BIOLOGY_LAB_URL.B, b);
        put(BIOLOGY_LAB_URL.C, c);
        break;
      case "dna":
      case "pcr":
      case "gel":
        put(BIOLOGY_LAB_URL.A, a);
        put(BIOLOGY_LAB_URL.B, b);
        break;
      case "solution":
        put(BIOLOGY_LAB_URL.R, r);
        if (typeof solutionMode === "string" && solutionMode === "mass") {
          put(BIOLOGY_LAB_URL.M, m);
          put(BIOLOGY_LAB_URL.V, v);
          put(BIOLOGY_LAB_URL.A, a);
        } else {
          put(BIOLOGY_LAB_URL.A, a);
          put(BIOLOGY_LAB_URL.B, b);
          put(BIOLOGY_LAB_URL.V, v);
        }
        break;
    }
    return out;
  }, [a, b, c, r, n, v, m, config.mode, solutionMode]);

  useLoanUrlSync(shareParams, [a, b, c, r, n, v, m]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "serial": {
        const cInit = parsePositive(a, "C initial");
        const df = parsePositive(b, "Dilution factor");
        const steps = parsePositive(n, "Steps");
        if (!cInit.ok) return { error: cInit.error };
        if (!df.ok) return { error: df.error };
        if (!steps.ok) return { error: steps.error };
        const computed = serialDilution({
          cInitial: cInit.value,
          dilutionFactor: df.value,
          steps: steps.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.cFinal),
          primaryLabel: "Final concentration",
          rows: [
            { label: "C initial", value: num(cInit.value) },
            { label: "DF", value: num(df.value, 2) },
            { label: "Steps", value: num(steps.value, 0) },
          ],
        };
      }
      case "centrifuge": {
        const radius = parsePositive(a, "Radius (mm)");
        const rpmP = optionalFinite(b, "RPM");
        const rcfP = optionalFinite(c, "RCF");
        if (!radius.ok) return { error: radius.error };
        if (!rpmP.ok) return { error: rpmP.error };
        if (!rcfP.ok) return { error: rcfP.error };
        const computed = centrifugeRcfRpm({
          radiusMm: radius.value,
          rpm: rpmP.value,
          rcf: rcfP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.rpm, 1)} RPM · ${num(computed.rcf, 1)} × g`,
          primaryLabel: "Centrifuge result",
          rows: [
            { label: "Radius", value: `${num(radius.value, 2)} mm` },
            { label: "RPM", value: num(computed.rpm, 1) },
            { label: "RCF", value: `${num(computed.rcf, 1)} × g` },
          ],
        };
      }
      case "dna": {
        const a260 = parseNonNegative(a, "A260");
        const dilution = parsePositive(b, "Dilution factor");
        if (!a260.ok) return { error: a260.error };
        if (!dilution.ok) return { error: dilution.error };
        const computed = dnaConcentration({ a260: a260.value, dilution: dilution.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.ngPerUl, 2)} ng/µL`,
          primaryLabel: "dsDNA concentration",
          rows: [
            { label: "A260", value: num(a260.value, 3) },
            { label: "Dilution", value: num(dilution.value, 2) },
          ],
        };
      }
      case "pcr": {
        const n0 = parsePositive(a, "N₀");
        const cycles = parseNonNegative(b, "Cycles");
        if (!n0.ok) return { error: n0.error };
        if (!cycles.ok) return { error: cycles.error };
        const computed = pcrCalculator({ n0: n0.value, cycles: cycles.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.copies, 2),
          primaryLabel: "Theoretical copies",
          rows: [
            { label: "N₀", value: num(n0.value, 2) },
            { label: "Cycles", value: num(cycles.value, 0) },
          ],
        };
      }
      case "gel": {
        const migration = parseNonNegative(a, "Migration (mm)");
        const dyeFront = parsePositive(b, "Dye front (mm)");
        if (!migration.ok) return { error: migration.error };
        if (!dyeFront.ok) return { error: dyeFront.error };
        const computed = gelElectrophoresis({
          migrationMm: migration.value,
          dyeFrontMm: dyeFront.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.rf, 4),
          primaryLabel: "Rf",
          rows: [
            { label: "Migration", value: `${num(migration.value, 2)} mm` },
            { label: "Dye front", value: `${num(dyeFront.value, 2)} mm` },
          ],
        };
      }
      case "solution": {
        const mode = parseSolutionMode(r);
        if (typeof mode === "object") return { error: mode.error };
        if (mode === "c1v1") {
          const c1 = parsePositive(a, "C1");
          const c2 = parsePositive(b, "C2");
          const v2 = parsePositive(v, "V2");
          if (!c1.ok) return { error: c1.error };
          if (!c2.ok) return { error: c2.error };
          if (!v2.ok) return { error: v2.error };
          const computed = labSolutionBiology({
            mode: "c1v1",
            c1: c1.value,
            c2: c2.value,
            v2: v2.value,
          });
          if ("error" in computed) return { error: computed.error };
          return {
            primary: `${num(computed.v1!)} (same units as V2)`,
            primaryLabel: "V1 stock volume",
            rows: [
              { label: "C1", value: num(c1.value) },
              { label: "C2", value: num(c2.value) },
              { label: "V2", value: num(v2.value) },
            ],
          };
        }
        const molarity = parseNonNegative(m, "Molarity");
        const volumeL = parsePositive(v, "Volume (L)");
        const molarMass = parsePositive(a, "Molar mass");
        if (!molarity.ok) return { error: molarity.error };
        if (!volumeL.ok) return { error: volumeL.error };
        if (!molarMass.ok) return { error: molarMass.error };
        const computed = labSolutionBiology({
          mode: "mass",
          molarity: molarity.value,
          volumeL: volumeL.value,
          molarMass: molarMass.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.massG!, 3)} g`,
          primaryLabel: "Solute mass",
          rows: [
            { label: "Molarity", value: `${num(molarity.value, 3)} M` },
            { label: "Volume", value: `${num(volumeL.value, 3)} L` },
            { label: "Molar mass", value: `${num(molarMass.value, 3)} g/mol` },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, n, v, m]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "serial" ? (
            <>
              <div>
                <FieldLabel htmlFor="bl-ci">C initial</FieldLabel>
                <FieldInput id="bl-ci" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bl-df">Dilution factor (DF)</FieldLabel>
                <FieldInput id="bl-df" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bl-steps">Steps</FieldLabel>
                <FieldInput id="bl-steps" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "centrifuge" ? (
            <>
              <div>
                <FieldLabel htmlFor="bl-radius">Radius (mm)</FieldLabel>
                <FieldInput id="bl-radius" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bl-rpm">RPM (leave blank if solving from RCF)</FieldLabel>
                <FieldInput id="bl-rpm" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bl-rcf">RCF × g (leave blank if solving from RPM)</FieldLabel>
                <FieldInput id="bl-rcf" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "dna" ? (
            <>
              <div>
                <FieldLabel htmlFor="bl-a260">A260</FieldLabel>
                <FieldInput id="bl-a260" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bl-dil">Dilution factor</FieldLabel>
                <FieldInput id="bl-dil" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "pcr" ? (
            <>
              <div>
                <FieldLabel htmlFor="bl-n0">N₀ (starting copies)</FieldLabel>
                <FieldInput id="bl-n0" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bl-cycles">Cycles</FieldLabel>
                <FieldInput id="bl-cycles" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "gel" ? (
            <>
              <div>
                <FieldLabel htmlFor="bl-mig">Band migration (mm)</FieldLabel>
                <FieldInput id="bl-mig" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bl-dye">Dye-front distance (mm)</FieldLabel>
                <FieldInput id="bl-dye" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "solution" ? (
            <>
              <div>
                <FieldLabel htmlFor="bl-mode">Mode (c1v1 / mass)</FieldLabel>
                <FieldInput id="bl-mode" value={r} onChange={(ev) => setR(ev.target.value)} />
              </div>
              {typeof solutionMode === "string" && solutionMode === "mass" ? (
                <>
                  <div>
                    <FieldLabel htmlFor="bl-m">Molarity (M)</FieldLabel>
                    <FieldInput id="bl-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="bl-vl">Volume (L)</FieldLabel>
                    <FieldInput id="bl-vl" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="bl-mw">Molar mass (g/mol)</FieldLabel>
                    <FieldInput id="bl-mw" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <FieldLabel htmlFor="bl-c1">C1 (stock)</FieldLabel>
                    <FieldInput id="bl-c1" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="bl-c2">C2 (desired)</FieldLabel>
                    <FieldInput id="bl-c2" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="bl-v2">V2 (final volume)</FieldLabel>
                    <FieldInput id="bl-v2" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="decimal" />
                  </div>
                </>
              )}
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
