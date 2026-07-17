"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  CHEMISTRY_ANALYTICAL_URL,
  absorbance,
  beerLambert,
  concentrationFromAbsorbance,
  titration,
} from "@/lib/calculators/chemistryAnalytical";

type AnalyticalSlug =
  | "titration-calculator-analytical"
  | "beer-lambert-law-calculator"
  | "absorbance-calculator"
  | "concentration-from-absorbance-calculator";

type Mode = "titration" | "beer" | "absorbance" | "concFromA";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  mDefault: string;
  vDefault: string;
};

const CONFIG: Record<AnalyticalSlug, Config> = {
  "titration-calculator-analytical": {
    title: "Titration (M₁V₁ = M₂V₂)",
    description: "1:1 acid–base equivalence — leave exactly one of M1, V1, M2, V2 blank to solve.",
    mode: "titration",
    aDefault: "",
    bDefault: "20",
    cDefault: "",
    rDefault: "",
    mDefault: "0.1",
    vDefault: "25",
  },
  "beer-lambert-law-calculator": {
    title: "Beer–Lambert law",
    description: "A = ε c l — leave exactly one of A, ε, c, path blank to solve.",
    mode: "beer",
    aDefault: "",
    bDefault: "1000",
    cDefault: "0.0005",
    rDefault: "1",
    mDefault: "",
    vDefault: "",
  },
  "absorbance-calculator": {
    title: "Absorbance",
    description: "A = −log₁₀(I / I₀) from incident and transmitted intensity.",
    mode: "absorbance",
    aDefault: "100",
    bDefault: "10",
    cDefault: "",
    rDefault: "",
    mDefault: "",
    vDefault: "",
  },
  "concentration-from-absorbance-calculator": {
    title: "Concentration from absorbance",
    description: "c = A / (ε × path) from Beer–Lambert with known A, ε, and path.",
    mode: "concFromA",
    aDefault: "0.5",
    bDefault: "1000",
    cDefault: "1",
    rDefault: "",
    mDefault: "",
    vDefault: "",
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

export function ChemistryAnalyticalCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as AnalyticalSlug] ?? CONFIG["titration-calculator-analytical"];
  const [a, setA] = useState(useLoanInitialInput(CHEMISTRY_ANALYTICAL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CHEMISTRY_ANALYTICAL_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CHEMISTRY_ANALYTICAL_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(CHEMISTRY_ANALYTICAL_URL.R, config.rDefault));
  const [m, setM] = useState(useLoanInitialInput(CHEMISTRY_ANALYTICAL_URL.M, config.mDefault));
  const [v, setV] = useState(useLoanInitialInput(CHEMISTRY_ANALYTICAL_URL.V, config.vDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (key: string, val: string) => {
      if (val.trim() !== "") out[key] = val;
    };
    switch (config.mode) {
      case "titration":
        put(CHEMISTRY_ANALYTICAL_URL.M, m);
        put(CHEMISTRY_ANALYTICAL_URL.V, v);
        put(CHEMISTRY_ANALYTICAL_URL.A, a);
        put(CHEMISTRY_ANALYTICAL_URL.B, b);
        break;
      case "beer":
        put(CHEMISTRY_ANALYTICAL_URL.A, a);
        put(CHEMISTRY_ANALYTICAL_URL.B, b);
        put(CHEMISTRY_ANALYTICAL_URL.C, c);
        put(CHEMISTRY_ANALYTICAL_URL.R, r);
        break;
      case "absorbance":
        put(CHEMISTRY_ANALYTICAL_URL.A, a);
        put(CHEMISTRY_ANALYTICAL_URL.B, b);
        break;
      case "concFromA":
        put(CHEMISTRY_ANALYTICAL_URL.A, a);
        put(CHEMISTRY_ANALYTICAL_URL.B, b);
        put(CHEMISTRY_ANALYTICAL_URL.C, c);
        break;
    }
    return out;
  }, [a, b, c, r, m, v, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, m, v]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "titration": {
        const m1P = optionalFinite(m, "M1");
        const v1P = optionalFinite(v, "V1");
        const m2P = optionalFinite(a, "M2");
        const v2P = optionalFinite(b, "V2");
        if (!m1P.ok) return { error: m1P.error };
        if (!v1P.ok) return { error: v1P.error };
        if (!m2P.ok) return { error: m2P.error };
        if (!v2P.ok) return { error: v2P.error };
        const computed = titration({
          m1: m1P.value,
          v1: v1P.value,
          m2: m2P.value,
          v2: v2P.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `M1=${num(computed.m1)}, V1=${num(computed.v1)}, M2=${num(computed.m2)}, V2=${num(computed.v2)}`,
          primaryLabel: "Titration result",
          rows: [
            { label: "M1", value: num(computed.m1) },
            { label: "V1", value: num(computed.v1) },
            { label: "M2", value: num(computed.m2) },
            { label: "V2", value: num(computed.v2) },
          ],
        };
      }
      case "beer": {
        const aP = optionalFinite(a, "A");
        const epsP = optionalFinite(b, "ε");
        const cP = optionalFinite(c, "c");
        const pathP = optionalFinite(r, "Path");
        if (!aP.ok) return { error: aP.error };
        if (!epsP.ok) return { error: epsP.error };
        if (!cP.ok) return { error: cP.error };
        if (!pathP.ok) return { error: pathP.error };
        const computed = beerLambert({
          a: aP.value,
          epsilon: epsP.value,
          c: cP.value,
          path: pathP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `A=${num(computed.a)}, ε=${num(computed.epsilon)}, c=${num(computed.c)}, l=${num(computed.path)}`,
          primaryLabel: "Beer–Lambert result",
          rows: [
            { label: "A", value: num(computed.a) },
            { label: "ε", value: num(computed.epsilon) },
            { label: "c", value: num(computed.c) },
            { label: "Path", value: num(computed.path) },
          ],
        };
      }
      case "absorbance": {
        const i0P = parsePositive(a, "I₀");
        const iP = parsePositive(b, "I");
        if (!i0P.ok) return { error: i0P.error };
        if (!iP.ok) return { error: iP.error };
        const computed = absorbance({ i0: i0P.value, i: iP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.a),
          primaryLabel: "Absorbance A",
          rows: [
            { label: "Transmittance", value: num(computed.transmittance, 4) },
            { label: "I₀", value: num(i0P.value) },
            { label: "I", value: num(iP.value) },
          ],
        };
      }
      case "concFromA": {
        const aP = parseNonNegative(a, "Absorbance A");
        const epsP = parsePositive(b, "ε");
        const pathP = parsePositive(c, "Path");
        if (!aP.ok) return { error: aP.error };
        if (!epsP.ok) return { error: epsP.error };
        if (!pathP.ok) return { error: pathP.error };
        const computed = concentrationFromAbsorbance({
          a: aP.value,
          epsilon: epsP.value,
          path: pathP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.c),
          primaryLabel: "Concentration c",
          rows: [
            { label: "A", value: num(aP.value) },
            { label: "ε", value: num(epsP.value) },
            { label: "Path", value: num(pathP.value) },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, m, v]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "titration" ? (
            <>
              <div>
                <FieldLabel htmlFor="ca-m1">M1 (leave blank to solve)</FieldLabel>
                <FieldInput id="ca-m1" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-v1">V1 (leave blank to solve)</FieldLabel>
                <FieldInput id="ca-v1" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-m2">M2 (leave blank to solve)</FieldLabel>
                <FieldInput id="ca-m2" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-v2">V2 (leave blank to solve)</FieldLabel>
                <FieldInput id="ca-v2" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "beer" ? (
            <>
              <div>
                <FieldLabel htmlFor="ca-a">A (leave blank to solve)</FieldLabel>
                <FieldInput id="ca-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-eps">ε (leave blank to solve)</FieldLabel>
                <FieldInput id="ca-eps" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-c">c (leave blank to solve)</FieldLabel>
                <FieldInput id="ca-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-path">Path length (leave blank to solve)</FieldLabel>
                <FieldInput id="ca-path" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "absorbance" ? (
            <>
              <div>
                <FieldLabel htmlFor="ca-i0">I₀ (incident)</FieldLabel>
                <FieldInput id="ca-i0" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-i">I (transmitted)</FieldLabel>
                <FieldInput id="ca-i" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "concFromA" ? (
            <>
              <div>
                <FieldLabel htmlFor="ca-abs">Absorbance A</FieldLabel>
                <FieldInput id="ca-abs" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-eps2">ε</FieldLabel>
                <FieldInput id="ca-eps2" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ca-path2">Path length</FieldLabel>
                <FieldInput id="ca-path2" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
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
