"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  CHEMISTRY_ELECTRO_URL,
  cellPotential,
  electrolysis,
  faradaysLaw,
  nernstEquation,
  redoxElectrons,
} from "@/lib/calculators/chemistryElectrochemistry";

type ElectroSlug =
  | "nernst-equation-calculator"
  | "cell-potential-calculator"
  | "electrolysis-calculator"
  | "faradays-law-calculator"
  | "redox-reaction-calculator";

type Mode = "nernst" | "cell" | "electrolysis" | "faraday" | "redox";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  nDefault: string;
  qDefault: string;
  tDefault: string;
  iDefault: string;
  mDefault: string;
};

const CONFIG: Record<ElectroSlug, Config> = {
  "nernst-equation-calculator": {
    title: "Nernst equation",
    description: "E = E° − (RT/nF) ln(Q). Optional T in Kelvin (default 298.15 K).",
    mode: "nernst",
    aDefault: "1.1",
    bDefault: "",
    cDefault: "",
    nDefault: "2",
    qDefault: "1",
    tDefault: "298.15",
    iDefault: "",
    mDefault: "",
  },
  "cell-potential-calculator": {
    title: "Cell potential",
    description: "E_cell = E_cathode − E_anode using reduction potentials.",
    mode: "cell",
    aDefault: "0.34",
    bDefault: "-0.76",
    cDefault: "",
    nDefault: "",
    qDefault: "",
    tDefault: "",
    iDefault: "",
    mDefault: "",
  },
  "electrolysis-calculator": {
    title: "Electrolysis (Faraday)",
    description: "m = (I t M) / (n F) — current, time, electrons n, and molar mass required.",
    mode: "electrolysis",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    nDefault: "2",
    qDefault: "",
    tDefault: "3600",
    iDefault: "1",
    mDefault: "63.55",
  },
  "faradays-law-calculator": {
    title: "Faraday’s law",
    description: "Moles = I t / (n F). Optional molar mass M yields deposited mass.",
    mode: "faraday",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    nDefault: "2",
    qDefault: "",
    tDefault: "3600",
    iDefault: "1",
    mDefault: "",
  },
  "redox-reaction-calculator": {
    title: "Redox electrons",
    description: "Electrons transferred = |ΔON| × atoms from oxidation-number change.",
    mode: "redox",
    aDefault: "0",
    bDefault: "2",
    cDefault: "1",
    nDefault: "",
    qDefault: "",
    tDefault: "",
    iDefault: "",
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

function optionalFinite(raw: string, label: string) {
  if (raw.trim() === "") return { ok: true as const, value: null as number | null };
  const p = parseFiniteNumber(raw, label);
  if (!p.ok) return p;
  return { ok: true as const, value: p.value as number | null };
}

export function ChemistryElectrochemistryCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as ElectroSlug] ?? CONFIG["nernst-equation-calculator"];
  const [a, setA] = useState(useLoanInitialInput(CHEMISTRY_ELECTRO_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CHEMISTRY_ELECTRO_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CHEMISTRY_ELECTRO_URL.C, config.cDefault));
  const [n, setN] = useState(useLoanInitialInput(CHEMISTRY_ELECTRO_URL.N, config.nDefault));
  const [q, setQ] = useState(useLoanInitialInput(CHEMISTRY_ELECTRO_URL.Q, config.qDefault));
  const [t, setT] = useState(useLoanInitialInput(CHEMISTRY_ELECTRO_URL.T, config.tDefault));
  const [i, setI] = useState(useLoanInitialInput(CHEMISTRY_ELECTRO_URL.I, config.iDefault));
  const [m, setM] = useState(useLoanInitialInput(CHEMISTRY_ELECTRO_URL.M, config.mDefault));

  const num = (val: number, d = 4) => {
    if (!Number.isFinite(val)) return "—";
    const abs = Math.abs(val);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return val.toExponential(4);
    return val.toFixed(d);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (key: string, val: string) => {
      if (val.trim() !== "") out[key] = val;
    };
    switch (config.mode) {
      case "nernst":
        put(CHEMISTRY_ELECTRO_URL.A, a);
        put(CHEMISTRY_ELECTRO_URL.N, n);
        put(CHEMISTRY_ELECTRO_URL.Q, q);
        put(CHEMISTRY_ELECTRO_URL.T, t);
        break;
      case "cell":
        put(CHEMISTRY_ELECTRO_URL.A, a);
        put(CHEMISTRY_ELECTRO_URL.B, b);
        break;
      case "electrolysis":
      case "faraday":
        put(CHEMISTRY_ELECTRO_URL.I, i);
        put(CHEMISTRY_ELECTRO_URL.T, t);
        put(CHEMISTRY_ELECTRO_URL.N, n);
        put(CHEMISTRY_ELECTRO_URL.M, m);
        break;
      case "redox":
        put(CHEMISTRY_ELECTRO_URL.A, a);
        put(CHEMISTRY_ELECTRO_URL.B, b);
        put(CHEMISTRY_ELECTRO_URL.C, c);
        break;
    }
    return out;
  }, [a, b, c, n, q, t, i, m, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, n, q, t, i, m]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "nernst": {
        const e0P = parseFiniteNumber(a, "E°");
        const nP = parsePositive(n, "n");
        const qP = parsePositive(q, "Q");
        const tP = optionalFinite(t, "T");
        if (!e0P.ok) return { error: e0P.error };
        if (!nP.ok) return { error: nP.error };
        if (!qP.ok) return { error: qP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = nernstEquation({
          e0: e0P.value,
          n: nP.value,
          q: qP.value,
          tK: tP.value ?? undefined,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.e),
          primaryLabel: "E (V)",
          rows: [
            { label: "E°", value: num(e0P.value) },
            { label: "n", value: num(nP.value) },
            { label: "Q", value: num(qP.value) },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "cell": {
        const cathP = parseFiniteNumber(a, "E_cathode");
        const anP = parseFiniteNumber(b, "E_anode");
        if (!cathP.ok) return { error: cathP.error };
        if (!anP.ok) return { error: anP.error };
        const computed = cellPotential({ eCathode: cathP.value, eAnode: anP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.eCell),
          primaryLabel: "E_cell (V)",
          rows: [
            { label: "E_cathode", value: num(cathP.value) },
            { label: "E_anode", value: num(anP.value) },
          ],
        };
      }
      case "electrolysis": {
        const iP = parseNonNegative(i, "I");
        const tP = parsePositive(t, "t");
        const nP = parsePositive(n, "n");
        const mP = parsePositive(m, "M");
        if (!iP.ok) return { error: iP.error };
        if (!tP.ok) return { error: tP.error };
        if (!nP.ok) return { error: nP.error };
        if (!mP.ok) return { error: mP.error };
        const computed = electrolysis({
          currentA: iP.value,
          timeS: tP.value,
          n: nP.value,
          molarMass: mP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.massG),
          primaryLabel: "Mass (g)",
          rows: [
            { label: "Moles", value: num(computed.moles) },
            { label: "I (A)", value: num(iP.value) },
            { label: "t (s)", value: num(tP.value) },
            { label: "n", value: num(nP.value) },
          ],
        };
      }
      case "faraday": {
        const iP = parseNonNegative(i, "I");
        const tP = parsePositive(t, "t");
        const nP = parsePositive(n, "n");
        const mP = optionalFinite(m, "M");
        if (!iP.ok) return { error: iP.error };
        if (!tP.ok) return { error: tP.error };
        if (!nP.ok) return { error: nP.error };
        if (!mP.ok) return { error: mP.error };
        const computed = faradaysLaw({
          currentA: iP.value,
          timeS: tP.value,
          n: nP.value,
          molarMass: mP.value ?? undefined,
        });
        if ("error" in computed) return { error: computed.error };
        const rows = [
          { label: "Moles", value: num(computed.moles) },
          { label: "I (A)", value: num(iP.value) },
          { label: "t (s)", value: num(tP.value) },
          { label: "n", value: num(nP.value) },
        ];
        if (computed.massG != null) {
          rows.unshift({ label: "Mass (g)", value: num(computed.massG) });
        }
        return {
          primary: computed.massG != null ? num(computed.massG) : num(computed.moles),
          primaryLabel: computed.massG != null ? "Mass (g)" : "Moles",
          rows,
        };
      }
      case "redox": {
        const onInitP = parseFiniteNumber(a, "ON initial");
        const onFinalP = parseFiniteNumber(b, "ON final");
        const atomsP = optionalFinite(c, "Atoms");
        if (!onInitP.ok) return { error: onInitP.error };
        if (!onFinalP.ok) return { error: onFinalP.error };
        if (!atomsP.ok) return { error: atomsP.error };
        const computed = redoxElectrons({
          onInitial: onInitP.value,
          onFinal: onFinalP.value,
          atoms: atomsP.value ?? undefined,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.electrons, 0),
          primaryLabel: "Electrons transferred",
          rows: [
            { label: "Direction", value: computed.direction },
            { label: "ON initial", value: num(onInitP.value) },
            { label: "ON final", value: num(onFinalP.value) },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, n, q, t, i, m]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "nernst" ? (
            <>
              <div>
                <FieldLabel htmlFor="el-e0">E° (V)</FieldLabel>
                <FieldInput id="el-e0" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="el-n">n (electrons)</FieldLabel>
                <FieldInput id="el-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="el-q">Q (reaction quotient)</FieldLabel>
                <FieldInput id="el-q" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="el-tk">T (K, optional)</FieldLabel>
                <FieldInput id="el-tk" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "cell" ? (
            <>
              <div>
                <FieldLabel htmlFor="el-cath">E_cathode (reduction, V)</FieldLabel>
                <FieldInput id="el-cath" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="el-an">E_anode (reduction, V)</FieldLabel>
                <FieldInput id="el-an" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "electrolysis" || config.mode === "faraday" ? (
            <>
              <div>
                <FieldLabel htmlFor="el-i">I (amperes)</FieldLabel>
                <FieldInput id="el-i" value={i} onChange={(ev) => setI(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="el-t">t (seconds)</FieldLabel>
                <FieldInput id="el-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="el-ne">n (electrons)</FieldLabel>
                <FieldInput id="el-ne" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="el-m">
                  M (g/mol{config.mode === "faraday" ? ", optional" : ""})
                </FieldLabel>
                <FieldInput id="el-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "redox" ? (
            <>
              <div>
                <FieldLabel htmlFor="el-oni">Oxidation number (initial)</FieldLabel>
                <FieldInput id="el-oni" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="el-onf">Oxidation number (final)</FieldLabel>
                <FieldInput id="el-onf" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="el-atoms">Atoms (optional, default 1)</FieldLabel>
                <FieldInput id="el-atoms" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
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
