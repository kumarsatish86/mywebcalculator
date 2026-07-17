"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  CHEMISTRY_NUCLEAR_URL,
  halfLifeNuclear,
  massDefect,
  nuclearBindingEnergy,
  radioactiveDecayChem,
} from "@/lib/calculators/chemistryNuclear";

type NuclearSlug =
  | "half-life-calculator-nuclear-chemistry"
  | "radioactive-decay-calculator-chemistry"
  | "nuclear-binding-energy-calculator"
  | "mass-defect-calculator";

type Mode = "halfLife" | "decay" | "binding" | "defect";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  rDefault: string;
  tDefault: string;
  mDefault: string;
  zDefault: string;
  nDefault: string;
};

const CONFIG: Record<NuclearSlug, Config> = {
  "half-life-calculator-nuclear-chemistry": {
    title: "Nuclear half-life",
    description: "Default mode fromLambda: t½ = ln2 / λ. Mode fromRemaining uses N₀, N, t.",
    mode: "halfLife",
    aDefault: "0.0693",
    bDefault: "",
    rDefault: "fromLambda",
    tDefault: "",
    mDefault: "",
    zDefault: "",
    nDefault: "",
  },
  "radioactive-decay-calculator-chemistry": {
    title: "Radioactive decay",
    description: "N = N₀ e^(−λt) with λ = ln2 / t½. Educational decay arithmetic.",
    mode: "decay",
    aDefault: "1000",
    bDefault: "5",
    rDefault: "",
    tDefault: "5",
    mDefault: "",
    zDefault: "",
    nDefault: "",
  },
  "nuclear-binding-energy-calculator": {
    title: "Nuclear binding energy",
    description: "Binding energy from mass defect Δm (u): BE (MeV) = Δm × 931.494.",
    mode: "binding",
    aDefault: "0.0304",
    bDefault: "",
    rDefault: "",
    tDefault: "",
    mDefault: "",
    zDefault: "",
    nDefault: "",
  },
  "mass-defect-calculator": {
    title: "Mass defect",
    description: "Δm = Z m_p + (A−Z) m_n − atomic mass (u). Also reports BE in MeV.",
    mode: "defect",
    aDefault: "4",
    bDefault: "",
    rDefault: "",
    tDefault: "",
    mDefault: "4.0026",
    zDefault: "2",
    nDefault: "",
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

function parseHalfLifeMode(raw: string): "fromLambda" | "fromRemaining" | { error: string } {
  const t = raw.trim().toLowerCase();
  if (t === "" || t === "fromlambda") return "fromLambda";
  if (t === "fromremaining") return "fromRemaining";
  return { error: "Mode: enter fromLambda or fromRemaining." };
}

export function ChemistryNuclearCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as NuclearSlug] ?? CONFIG["half-life-calculator-nuclear-chemistry"];
  const [a, setA] = useState(useLoanInitialInput(CHEMISTRY_NUCLEAR_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CHEMISTRY_NUCLEAR_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(CHEMISTRY_NUCLEAR_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(CHEMISTRY_NUCLEAR_URL.T, config.tDefault));
  const [m, setM] = useState(useLoanInitialInput(CHEMISTRY_NUCLEAR_URL.M, config.mDefault));
  const [z, setZ] = useState(useLoanInitialInput(CHEMISTRY_NUCLEAR_URL.Z, config.zDefault));
  const [n, setN] = useState(useLoanInitialInput(CHEMISTRY_NUCLEAR_URL.N, config.nDefault));

  const num = (nVal: number, d = 4) => {
    if (!Number.isFinite(nVal)) return "—";
    const abs = Math.abs(nVal);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return nVal.toExponential(4);
    return nVal.toFixed(d);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (key: string, val: string) => {
      if (val.trim() !== "") out[key] = val;
    };
    switch (config.mode) {
      case "halfLife":
        put(CHEMISTRY_NUCLEAR_URL.R, r);
        put(CHEMISTRY_NUCLEAR_URL.A, a);
        put(CHEMISTRY_NUCLEAR_URL.N, n);
        put(CHEMISTRY_NUCLEAR_URL.B, b);
        put(CHEMISTRY_NUCLEAR_URL.T, t);
        break;
      case "decay":
        put(CHEMISTRY_NUCLEAR_URL.A, a);
        put(CHEMISTRY_NUCLEAR_URL.B, b);
        put(CHEMISTRY_NUCLEAR_URL.T, t);
        break;
      case "binding":
        put(CHEMISTRY_NUCLEAR_URL.A, a);
        break;
      case "defect":
        put(CHEMISTRY_NUCLEAR_URL.A, a);
        put(CHEMISTRY_NUCLEAR_URL.Z, z);
        put(CHEMISTRY_NUCLEAR_URL.M, m);
        break;
    }
    return out;
  }, [a, b, r, t, m, z, n, config.mode]);

  useLoanUrlSync(shareParams, [a, b, r, t, m, z, n]);

  const hlMode = parseHalfLifeMode(r || "fromLambda");

  const result = useMemo(() => {
    switch (config.mode) {
      case "halfLife": {
        const mode = parseHalfLifeMode(r || "fromLambda");
        if (typeof mode === "object") return { error: mode.error };
        if (mode === "fromLambda") {
          const lam = parsePositive(a, "Decay constant λ");
          if (!lam.ok) return { error: lam.error };
          const computed = halfLifeNuclear({ mode: "fromLambda", lambda: lam.value });
          if ("error" in computed) return { error: computed.error };
          return {
            primary: num(computed.halfLife),
            primaryLabel: "Half-life t½",
            rows: [
              { label: "Mode", value: "fromLambda" },
              { label: "λ", value: num(lam.value) },
            ],
          };
        }
        const n0 = parsePositive(n, "N₀");
        const nLeft = parsePositive(b, "N");
        const time = parsePositive(t, "t");
        if (!n0.ok) return { error: n0.error };
        if (!nLeft.ok) return { error: nLeft.error };
        if (!time.ok) return { error: time.error };
        const computed = halfLifeNuclear({
          mode: "fromRemaining",
          n0: n0.value,
          n: nLeft.value,
          t: time.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.halfLife),
          primaryLabel: "Half-life t½",
          rows: [
            { label: "Mode", value: "fromRemaining" },
            { label: "N₀", value: num(n0.value) },
            { label: "N", value: num(nLeft.value) },
            { label: "t", value: num(time.value) },
          ],
        };
      }
      case "decay": {
        const n0 = parseNonNegative(a, "N₀");
        const halfLife = parsePositive(b, "Half-life");
        const time = parseNonNegative(t, "t");
        if (!n0.ok) return { error: n0.error };
        if (!halfLife.ok) return { error: halfLife.error };
        if (!time.ok) return { error: time.error };
        const computed = radioactiveDecayChem({
          n0: n0.value,
          halfLife: halfLife.value,
          t: time.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.n),
          primaryLabel: "Remaining N",
          rows: [
            { label: "λ", value: num(computed.lambda) },
            { label: "Fraction left", value: num(computed.fractionLeft, 4) },
            { label: "N₀", value: num(n0.value) },
            { label: "t½", value: num(halfLife.value) },
            { label: "t", value: num(time.value) },
          ],
        };
      }
      case "binding": {
        const defect = parseFiniteNumber(a, "Mass defect (u)");
        if (!defect.ok) return { error: defect.error };
        const computed = nuclearBindingEnergy({ defectU: defect.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.bindingMev)} MeV`,
          primaryLabel: "Binding energy",
          rows: [
            { label: "Δm (u)", value: num(defect.value) },
            { label: "BE (J)", value: num(computed.bindingJ) },
          ],
        };
      }
      case "defect": {
        const massNumber = parsePositive(a, "Mass number A");
        const atomicNumber = parsePositive(z, "Atomic number Z");
        const atomicMass = parsePositive(m, "Atomic mass (u)");
        if (!massNumber.ok) return { error: massNumber.error };
        if (!atomicNumber.ok) return { error: atomicNumber.error };
        if (!atomicMass.ok) return { error: atomicMass.error };
        const computed = massDefect({
          massNumber: massNumber.value,
          atomicNumber: atomicNumber.value,
          atomicMassU: atomicMass.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.defectU)} u`,
          primaryLabel: "Mass defect Δm",
          rows: [
            { label: "BE", value: `${num(computed.bindingMev)} MeV` },
            { label: "A", value: num(massNumber.value, 0) },
            { label: "Z", value: num(atomicNumber.value, 0) },
            { label: "Atomic mass", value: `${num(atomicMass.value)} u` },
          ],
        };
      }
    }
  }, [config.mode, a, b, r, t, m, z, n]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "halfLife" ? (
            <>
              <div>
                <FieldLabel htmlFor="cn-hl-mode">Mode (fromLambda / fromRemaining)</FieldLabel>
                <FieldInput id="cn-hl-mode" value={r} onChange={(ev) => setR(ev.target.value)} />
              </div>
              {typeof hlMode === "string" && hlMode === "fromRemaining" ? (
                <>
                  <div>
                    <FieldLabel htmlFor="cn-n0">N₀</FieldLabel>
                    <FieldInput id="cn-n0" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="cn-n">N (remaining)</FieldLabel>
                    <FieldInput id="cn-n" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="cn-t">Time t</FieldLabel>
                    <FieldInput id="cn-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
                  </div>
                </>
              ) : (
                <div>
                  <FieldLabel htmlFor="cn-lambda">Decay constant λ</FieldLabel>
                  <FieldInput
                    id="cn-lambda"
                    value={a}
                    onChange={(ev) => setA(ev.target.value)}
                    inputMode="decimal"
                  />
                </div>
              )}
            </>
          ) : null}

          {config.mode === "decay" ? (
            <>
              <div>
                <FieldLabel htmlFor="cn-decay-n0">N₀</FieldLabel>
                <FieldInput id="cn-decay-n0" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cn-decay-hl">Half-life t½</FieldLabel>
                <FieldInput id="cn-decay-hl" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cn-decay-t">Time t</FieldLabel>
                <FieldInput id="cn-decay-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "binding" ? (
            <div>
              <FieldLabel htmlFor="cn-defect">Mass defect Δm (u)</FieldLabel>
              <FieldInput id="cn-defect" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "defect" ? (
            <>
              <div>
                <FieldLabel htmlFor="cn-a">Mass number A</FieldLabel>
                <FieldInput id="cn-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cn-z">Atomic number Z</FieldLabel>
                <FieldInput id="cn-z" value={z} onChange={(ev) => setZ(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cn-m">Atomic mass (u)</FieldLabel>
                <FieldInput id="cn-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
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
