"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  CHEMISTRY_EQ_URL,
  equilibriumConstant,
  iceTable,
  leChatelier,
  reactionQuotient,
  solubilityProduct,
} from "@/lib/calculators/chemistryEquilibrium";

type EqSlug =
  | "equilibrium-constant-kc-kp-calculator"
  | "reaction-quotient-q-calculator"
  | "ice-table-calculator"
  | "le-chatelier-prediction-tool"
  | "solubility-product-ksp-calculator";

type Mode = "kc" | "q" | "ice" | "leChat" | "ksp";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  kDefault: string;
  nDefault: string;
};

const CONFIG: Record<EqSlug, Config> = {
  "equilibrium-constant-kc-kp-calculator": {
    title: "Equilibrium constant Kc / Kp",
    description: "Kc = products / reactants. Optional Δn and T (K) also give Kp = Kc (RT)^Δn.",
    mode: "kc",
    aDefault: "0.04",
    bDefault: "0.01",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    kDefault: "",
    nDefault: "",
  },
  "reaction-quotient-q-calculator": {
    title: "Reaction quotient Q",
    description: "Q = products / reactants. Optional K compares Q to K for shift direction.",
    mode: "q",
    aDefault: "0.02",
    bDefault: "0.01",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    kDefault: "4",
    nDefault: "",
  },
  "ice-table-calculator": {
    title: "ICE table (simple)",
    description: "Solve x for A ⇌ B+C (mode ab) or A ⇌ 2B (mode a2b) from K and C₀.",
    mode: "ice",
    aDefault: "",
    bDefault: "",
    cDefault: "0.1",
    rDefault: "ab",
    tDefault: "",
    kDefault: "1e-4",
    nDefault: "",
  },
  "le-chatelier-prediction-tool": {
    title: "Le Chatelier prediction",
    description: "Keyword stress → qualitative shift (heatforward, pressure, product, …).",
    mode: "leChat",
    aDefault: "pressure",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    kDefault: "",
    nDefault: "",
  },
  "solubility-product-ksp-calculator": {
    title: "Solubility product Ksp",
    description: "mode fromS|fromKsp in r; salt type ab|ab2|a2b in a; s or Ksp in b.",
    mode: "ksp",
    aDefault: "ab",
    bDefault: "0.01",
    cDefault: "",
    rDefault: "fromS",
    tDefault: "",
    kDefault: "",
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

function optionalFinite(raw: string, label: string) {
  if (raw.trim() === "") return { ok: true as const, value: null as number | null };
  const p = parseFiniteNumber(raw, label);
  if (!p.ok) return p;
  return { ok: true as const, value: p.value as number | null };
}

export function ChemistryEquilibriumCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as EqSlug] ?? CONFIG["equilibrium-constant-kc-kp-calculator"];
  const [a, setA] = useState(useLoanInitialInput(CHEMISTRY_EQ_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CHEMISTRY_EQ_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CHEMISTRY_EQ_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(CHEMISTRY_EQ_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(CHEMISTRY_EQ_URL.T, config.tDefault));
  const [k, setK] = useState(useLoanInitialInput(CHEMISTRY_EQ_URL.K, config.kDefault));
  const [n, setN] = useState(useLoanInitialInput(CHEMISTRY_EQ_URL.N, config.nDefault));

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
      case "kc":
        put(CHEMISTRY_EQ_URL.A, a);
        put(CHEMISTRY_EQ_URL.B, b);
        put(CHEMISTRY_EQ_URL.N, n);
        put(CHEMISTRY_EQ_URL.T, t);
        break;
      case "q":
        put(CHEMISTRY_EQ_URL.A, a);
        put(CHEMISTRY_EQ_URL.B, b);
        put(CHEMISTRY_EQ_URL.K, k);
        break;
      case "ice":
        put(CHEMISTRY_EQ_URL.K, k);
        put(CHEMISTRY_EQ_URL.C, c);
        put(CHEMISTRY_EQ_URL.R, r);
        break;
      case "leChat":
        put(CHEMISTRY_EQ_URL.A, a);
        break;
      case "ksp":
        put(CHEMISTRY_EQ_URL.R, r);
        put(CHEMISTRY_EQ_URL.A, a);
        put(CHEMISTRY_EQ_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, r, t, k, n, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t, k, n]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "kc": {
        const prodP = parseNonNegative(a, "Products");
        const reactP = parsePositive(b, "Reactants");
        const dN = optionalFinite(n, "Δn");
        const tK = optionalFinite(t, "T");
        if (!prodP.ok) return { error: prodP.error };
        if (!reactP.ok) return { error: reactP.error };
        if (!dN.ok) return { error: dN.error };
        if (!tK.ok) return { error: tK.error };
        const computed = equilibriumConstant({
          products: prodP.value,
          reactants: reactP.value,
          deltaN: dN.value ?? undefined,
          tK: tK.value ?? undefined,
        });
        if ("error" in computed) return { error: computed.error };
        const rows = [
          { label: "Kc", value: num(computed.kc) },
          { label: "Products", value: num(prodP.value) },
          { label: "Reactants", value: num(reactP.value) },
        ];
        if (computed.kp != null) rows.unshift({ label: "Kp", value: num(computed.kp) });
        return {
          primary: computed.kp != null ? `Kc=${num(computed.kc)}, Kp=${num(computed.kp)}` : num(computed.kc),
          primaryLabel: computed.kp != null ? "Kc and Kp" : "Kc",
          rows,
        };
      }
      case "q": {
        const prodP = parseNonNegative(a, "Products");
        const reactP = parsePositive(b, "Reactants");
        const kP = optionalFinite(k, "K");
        if (!prodP.ok) return { error: prodP.error };
        if (!reactP.ok) return { error: reactP.error };
        if (!kP.ok) return { error: kP.error };
        const computed = reactionQuotient({
          products: prodP.value,
          reactants: reactP.value,
          k: kP.value ?? undefined,
        });
        if ("error" in computed) return { error: computed.error };
        const rows = [
          { label: "Q", value: num(computed.q) },
          { label: "Products", value: num(prodP.value) },
          { label: "Reactants", value: num(reactP.value) },
        ];
        if (computed.direction) rows.unshift({ label: "Direction", value: computed.direction });
        return {
          primary: num(computed.q),
          primaryLabel: "Q",
          rows,
        };
      }
      case "ice": {
        const kP = parsePositive(k, "K");
        const c0P = parsePositive(c, "C₀");
        if (!kP.ok) return { error: kP.error };
        if (!c0P.ok) return { error: c0P.error };
        const modeRaw = r.trim().toLowerCase();
        const mode = modeRaw === "a2b" ? "a2b" : modeRaw === "ab" || modeRaw === "" ? "ab" : null;
        if (!mode) return { error: "Mode must be ab or a2b." };
        const computed = iceTable({ k: kP.value, c0: c0P.value, mode });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.x),
          primaryLabel: "x (extent)",
          rows: [
            { label: "Equilibrium [A]", value: num(computed.equilibriumA) },
            { label: "Mode", value: mode },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "leChat": {
        const computed = leChatelier({ stress: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.prediction,
          primaryLabel: "Prediction",
          rows: [{ label: "Stress keyword", value: a.trim() || "—" }],
        };
      }
      case "ksp": {
        const modeRaw = r.trim().toLowerCase();
        if (modeRaw !== "froms" && modeRaw !== "fromksp") {
          return { error: "Mode (r) must be fromS or fromKsp." };
        }
        const mode = modeRaw === "froms" ? "fromS" : "fromKsp";
        const typeRaw = a.trim().toLowerCase();
        if (typeRaw !== "ab" && typeRaw !== "ab2" && typeRaw !== "a2b") {
          return { error: "Type (a) must be ab, ab2, or a2b." };
        }
        const valP =
          mode === "fromS" ? parseNonNegative(b, "s") : parseNonNegative(b, "Ksp");
        if (!valP.ok) return { error: valP.error };
        const computed = solubilityProduct({
          mode,
          type: typeRaw,
          s: mode === "fromS" ? valP.value : undefined,
          ksp: mode === "fromKsp" ? valP.value : undefined,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary:
            computed.ksp != null && computed.s != null
              ? `Ksp=${num(computed.ksp)}, s=${num(computed.s)}`
              : computed.ksp != null
                ? num(computed.ksp)
                : num(computed.s ?? NaN),
          primaryLabel: "Ksp / s",
          rows: [
            { label: "Ksp", value: computed.ksp != null ? num(computed.ksp) : "—" },
            { label: "s", value: computed.s != null ? num(computed.s) : "—" },
            { label: "Type", value: typeRaw },
            { label: "Mode", value: mode },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, k, n]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "kc" ? (
            <>
              <div>
                <FieldLabel htmlFor="eq-prod">Products quotient</FieldLabel>
                <FieldInput id="eq-prod" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="eq-react">Reactants quotient</FieldLabel>
                <FieldInput id="eq-react" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="eq-dn">Δn (optional, for Kp)</FieldLabel>
                <FieldInput id="eq-dn" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="eq-tk">T (K, optional, for Kp)</FieldLabel>
                <FieldInput id="eq-tk" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "q" ? (
            <>
              <div>
                <FieldLabel htmlFor="eq-qprod">Products quotient</FieldLabel>
                <FieldInput id="eq-qprod" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="eq-qreact">Reactants quotient</FieldLabel>
                <FieldInput id="eq-qreact" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="eq-k">K (optional, compare Q)</FieldLabel>
                <FieldInput id="eq-k" value={k} onChange={(ev) => setK(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "ice" ? (
            <>
              <div>
                <FieldLabel htmlFor="eq-ice-k">K</FieldLabel>
                <FieldInput id="eq-ice-k" value={k} onChange={(ev) => setK(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="eq-ice-c0">C₀</FieldLabel>
                <FieldInput id="eq-ice-c0" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="eq-ice-mode">Mode (ab or a2b)</FieldLabel>
                <FieldInput id="eq-ice-mode" value={r} onChange={(ev) => setR(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "leChat" ? (
            <div>
              <FieldLabel htmlFor="eq-stress">Stress keyword</FieldLabel>
              <FieldInput id="eq-stress" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "ksp" ? (
            <>
              <div>
                <FieldLabel htmlFor="eq-ksp-mode">Mode (fromS or fromKsp)</FieldLabel>
                <FieldInput id="eq-ksp-mode" value={r} onChange={(ev) => setR(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="eq-ksp-type">Salt type (ab, ab2, or a2b)</FieldLabel>
                <FieldInput id="eq-ksp-type" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="eq-ksp-val">s or Ksp (value in b)</FieldLabel>
                <FieldInput id="eq-ksp-val" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
