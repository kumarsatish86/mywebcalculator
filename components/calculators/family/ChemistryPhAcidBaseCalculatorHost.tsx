"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  CHEMISTRY_PH_URL,
  acidBaseDissociation,
  hendersonHasselbalch,
  pKa,
  phFromConcentration,
  pohFromConcentration,
  titrationChemistry,
} from "@/lib/calculators/chemistryPhAcidBase";

type PhSlug =
  | "ph-calculator-chemistry"
  | "poh-calculator"
  | "pka-calculator"
  | "buffer-solution-calculator-chemistry"
  | "henderson-hasselbalch-calculator"
  | "acid-base-dissociation-calculator"
  | "titration-calculator-chemistry";

type Mode = "ph" | "poh" | "pka" | "buffer" | "dissociation" | "titration";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  mDefault: string;
  vDefault: string;
};

const CONFIG: Record<PhSlug, Config> = {
  "ph-calculator-chemistry": {
    title: "pH from [H⁺] or pOH",
    description: "pH = −log₁₀[H⁺], or pH = 14 − pOH. Enter [H⁺] or pOH (leave the other blank).",
    mode: "ph",
    aDefault: "1e-7",
    bDefault: "",
    cDefault: "",
    mDefault: "",
    vDefault: "",
  },
  "poh-calculator": {
    title: "pOH from [OH⁻] or pH",
    description: "pOH = −log₁₀[OH⁻], or pOH = 14 − pH. Enter [OH⁻] or pH (leave the other blank).",
    mode: "poh",
    aDefault: "1e-7",
    bDefault: "",
    cDefault: "",
    mDefault: "",
    vDefault: "",
  },
  "pka-calculator": {
    title: "pKa ↔ Ka",
    description: "pKa = −log₁₀(Ka). Enter Ka or pKa (leave the other blank).",
    mode: "pka",
    aDefault: "1.8e-5",
    bDefault: "",
    cDefault: "",
    mDefault: "",
    vDefault: "",
  },
  "buffer-solution-calculator-chemistry": {
    title: "Buffer (Henderson–Hasselbalch)",
    description: "pH = pKa + log₁₀([A⁻]/[HA]) for a weak acid / conjugate base buffer.",
    mode: "buffer",
    aDefault: "4.76",
    bDefault: "0.1",
    cDefault: "0.1",
    mDefault: "",
    vDefault: "",
  },
  "henderson-hasselbalch-calculator": {
    title: "Henderson–Hasselbalch",
    description: "pH = pKa + log₁₀([A⁻]/[HA]). Same engine as the buffer tool.",
    mode: "buffer",
    aDefault: "4.76",
    bDefault: "0.1",
    cDefault: "0.1",
    mDefault: "",
    vDefault: "",
  },
  "acid-base-dissociation-calculator": {
    title: "Weak acid dissociation",
    description: "Approximate [H⁺] ≈ √(Ka × C₀) when x ≪ C₀; also reports pH and α.",
    mode: "dissociation",
    aDefault: "1.8e-5",
    bDefault: "0.1",
    cDefault: "",
    mDefault: "",
    vDefault: "",
  },
  "titration-calculator-chemistry": {
    title: "Titration (M₁V₁ = M₂V₂)",
    description: "1:1 acid–base equivalence — leave exactly one of M1, V1, M2, V2 blank to solve.",
    mode: "titration",
    aDefault: "",
    bDefault: "20",
    cDefault: "",
    mDefault: "0.1",
    vDefault: "25",
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

export function ChemistryPhAcidBaseCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as PhSlug] ?? CONFIG["ph-calculator-chemistry"];
  const [a, setA] = useState(useLoanInitialInput(CHEMISTRY_PH_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CHEMISTRY_PH_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CHEMISTRY_PH_URL.C, config.cDefault));
  const [m, setM] = useState(useLoanInitialInput(CHEMISTRY_PH_URL.M, config.mDefault));
  const [v, setV] = useState(useLoanInitialInput(CHEMISTRY_PH_URL.V, config.vDefault));

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
      case "ph":
      case "poh":
      case "pka":
      case "dissociation":
        put(CHEMISTRY_PH_URL.A, a);
        put(CHEMISTRY_PH_URL.B, b);
        break;
      case "buffer":
        put(CHEMISTRY_PH_URL.A, a);
        put(CHEMISTRY_PH_URL.B, b);
        put(CHEMISTRY_PH_URL.C, c);
        break;
      case "titration":
        put(CHEMISTRY_PH_URL.M, m);
        put(CHEMISTRY_PH_URL.V, v);
        put(CHEMISTRY_PH_URL.A, a);
        put(CHEMISTRY_PH_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, m, v, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, m, v]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "ph": {
        const hP = optionalFinite(a, "[H⁺]");
        const pOhP = optionalFinite(b, "pOH");
        if (!hP.ok) return { error: hP.error };
        if (!pOhP.ok) return { error: pOhP.error };
        const computed = phFromConcentration({ hPlus: hP.value, pOh: pOhP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.ph),
          primaryLabel: "pH",
          rows: [
            { label: "[H⁺]", value: num(computed.hPlus) },
            { label: "pOH", value: num(computed.pOh) },
          ],
        };
      }
      case "poh": {
        const ohP = optionalFinite(a, "[OH⁻]");
        const phP = optionalFinite(b, "pH");
        if (!ohP.ok) return { error: ohP.error };
        if (!phP.ok) return { error: phP.error };
        const computed = pohFromConcentration({ ohMinus: ohP.value, ph: phP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.pOh),
          primaryLabel: "pOH",
          rows: [
            { label: "[OH⁻]", value: num(computed.ohMinus) },
            { label: "pH", value: num(computed.ph) },
          ],
        };
      }
      case "pka": {
        const kaP = optionalFinite(a, "Ka");
        const pkaP = optionalFinite(b, "pKa");
        if (!kaP.ok) return { error: kaP.error };
        if (!pkaP.ok) return { error: pkaP.error };
        const computed = pKa({ ka: kaP.value, pka: pkaP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.pka),
          primaryLabel: "pKa",
          rows: [
            { label: "Ka", value: num(computed.ka) },
            { label: "pKa", value: num(computed.pka) },
          ],
        };
      }
      case "buffer": {
        const pkaP = parseFiniteNumber(a, "pKa");
        const saltP = parsePositive(b, "[A⁻]");
        const acidP = parsePositive(c, "[HA]");
        if (!pkaP.ok) return { error: pkaP.error };
        if (!saltP.ok) return { error: saltP.error };
        if (!acidP.ok) return { error: acidP.error };
        const computed = hendersonHasselbalch({
          pka: pkaP.value,
          salt: saltP.value,
          acid: acidP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.ph),
          primaryLabel: "Buffer pH",
          rows: [
            { label: "pKa", value: num(pkaP.value) },
            { label: "[A⁻]/[HA]", value: num(computed.ratio) },
          ],
        };
      }
      case "dissociation": {
        const kaP = parsePositive(a, "Ka");
        const c0P = parsePositive(b, "C₀");
        if (!kaP.ok) return { error: kaP.error };
        if (!c0P.ok) return { error: c0P.error };
        const computed = acidBaseDissociation({ ka: kaP.value, c0: c0P.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.ph),
          primaryLabel: "pH (approx)",
          rows: [
            { label: "[H⁺]", value: num(computed.hPlus) },
            { label: "α", value: num(computed.alpha) },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "titration": {
        const m1P = optionalFinite(m, "M1");
        const v1P = optionalFinite(v, "V1");
        const m2P = optionalFinite(a, "M2");
        const v2P = optionalFinite(b, "V2");
        if (!m1P.ok) return { error: m1P.error };
        if (!v1P.ok) return { error: v1P.error };
        if (!m2P.ok) return { error: m2P.error };
        if (!v2P.ok) return { error: v2P.error };
        const computed = titrationChemistry({
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
    }
  }, [config.mode, a, b, c, m, v]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "ph" ? (
            <>
              <div>
                <FieldLabel htmlFor="ph-h">[H⁺] (mol/L; leave blank if using pOH)</FieldLabel>
                <FieldInput id="ph-h" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ph-poh">pOH (optional)</FieldLabel>
                <FieldInput id="ph-poh" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "poh" ? (
            <>
              <div>
                <FieldLabel htmlFor="poh-oh">[OH⁻] (mol/L; leave blank if using pH)</FieldLabel>
                <FieldInput id="poh-oh" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="poh-ph">pH (optional)</FieldLabel>
                <FieldInput id="poh-ph" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "pka" ? (
            <>
              <div>
                <FieldLabel htmlFor="pka-ka">Ka (leave blank if using pKa)</FieldLabel>
                <FieldInput id="pka-ka" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pka-pka">pKa (optional)</FieldLabel>
                <FieldInput id="pka-pka" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "buffer" ? (
            <>
              <div>
                <FieldLabel htmlFor="buf-pka">pKa</FieldLabel>
                <FieldInput id="buf-pka" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="buf-salt">[A⁻] (salt / conjugate base)</FieldLabel>
                <FieldInput id="buf-salt" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="buf-acid">[HA] (acid)</FieldLabel>
                <FieldInput id="buf-acid" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "dissociation" ? (
            <>
              <div>
                <FieldLabel htmlFor="diss-ka">Ka</FieldLabel>
                <FieldInput id="diss-ka" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="diss-c0">C₀ (mol/L)</FieldLabel>
                <FieldInput id="diss-c0" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "titration" ? (
            <>
              <div>
                <FieldLabel htmlFor="tit-m1">M1 (leave blank to solve)</FieldLabel>
                <FieldInput id="tit-m1" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="tit-v1">V1 (leave blank to solve)</FieldLabel>
                <FieldInput id="tit-v1" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="tit-m2">M2 (leave blank to solve)</FieldLabel>
                <FieldInput id="tit-m2" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="tit-v2">V2 (leave blank to solve)</FieldLabel>
                <FieldInput id="tit-v2" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
