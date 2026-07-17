"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  CHEMISTRY_ORGANIC_URL,
  degreeOfUnsaturation,
  functionalGroupIdentifier,
  hydrocarbonFormula,
  iupacNameTeaching,
  organicReactionPredictor,
  type HydrocarbonKind,
} from "@/lib/calculators/chemistryOrganic";

type OrganicSlug =
  | "hydrocarbon-formula-calculator"
  | "degree-of-unsaturation-calculator"
  | "iupac-name-generator-advanced-tool"
  | "functional-group-identifier"
  | "organic-reaction-predictor-ai-future";

type Mode = "formula" | "du" | "iupac" | "functional" | "reaction";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  nDefault: string;
  xDefault: string;
};

const CONFIG: Record<OrganicSlug, Config> = {
  "hydrocarbon-formula-calculator": {
    title: "Hydrocarbon formula",
    description: "Cn general formulas for open-chain alkanes, alkenes, and alkynes.",
    mode: "formula",
    aDefault: "4",
    bDefault: "alkane",
    cDefault: "",
    rDefault: "",
    nDefault: "",
    xDefault: "",
  },
  "degree-of-unsaturation-calculator": {
    title: "Degree of unsaturation",
    description: "DU = (2C + 2 + N − H − X) / 2 from atom counts.",
    mode: "du",
    aDefault: "6",
    bDefault: "6",
    cDefault: "0",
    rDefault: "0",
    nDefault: "0",
    xDefault: "0",
  },
  "iupac-name-generator-advanced-tool": {
    title: "IUPAC teaching name",
    description: "Unbranched Cn hydrocarbon stems (n = 1–10) — not a full IUPAC engine.",
    mode: "iupac",
    aDefault: "4",
    bDefault: "alkane",
    cDefault: "",
    rDefault: "",
    nDefault: "",
    xDefault: "",
  },
  "functional-group-identifier": {
    title: "Functional group identifier",
    description: "Match a keyword (OH, ketone, COOH, …) to a teaching description.",
    mode: "functional",
    aDefault: "OH",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    nDefault: "",
    xDefault: "",
  },
  "organic-reaction-predictor-ai-future": {
    title: "Organic reaction patterns",
    description: "Rule-based teaching presets (e.g. alkene+H2) — not a live AI predictor.",
    mode: "reaction",
    aDefault: "alkene+H2",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    nDefault: "",
    xDefault: "",
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

function parseKind(raw: string): HydrocarbonKind | null {
  const k = raw.trim().toLowerCase();
  if (k === "alkane" || k === "alkene" || k === "alkyne") return k;
  return null;
}

export function ChemistryOrganicCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as OrganicSlug] ?? CONFIG["hydrocarbon-formula-calculator"];
  const [a, setA] = useState(useLoanInitialInput(CHEMISTRY_ORGANIC_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CHEMISTRY_ORGANIC_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CHEMISTRY_ORGANIC_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(CHEMISTRY_ORGANIC_URL.R, config.rDefault));
  const [n, setN] = useState(useLoanInitialInput(CHEMISTRY_ORGANIC_URL.N, config.nDefault));
  const [x, setX] = useState(useLoanInitialInput(CHEMISTRY_ORGANIC_URL.X, config.xDefault));

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
      case "formula":
      case "iupac":
        put(CHEMISTRY_ORGANIC_URL.A, a);
        put(CHEMISTRY_ORGANIC_URL.B, b);
        break;
      case "du":
        put(CHEMISTRY_ORGANIC_URL.A, a);
        put(CHEMISTRY_ORGANIC_URL.B, b);
        put(CHEMISTRY_ORGANIC_URL.C, c);
        put(CHEMISTRY_ORGANIC_URL.N, n);
        put(CHEMISTRY_ORGANIC_URL.X, x);
        put(CHEMISTRY_ORGANIC_URL.R, r);
        break;
      case "functional":
      case "reaction":
        put(CHEMISTRY_ORGANIC_URL.A, a);
        break;
    }
    return out;
  }, [a, b, c, r, n, x, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, n, x]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "formula": {
        const nP = parsePositive(a, "n (carbons)");
        if (!nP.ok) return { error: nP.error };
        const kind = parseKind(b);
        if (!kind) return { error: "Kind must be alkane, alkene, or alkyne." };
        const computed = hydrocarbonFormula({ n: nP.value, kind });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.formula,
          primaryLabel: "Molecular formula",
          rows: [
            { label: "General", value: computed.general },
            { label: "Kind", value: kind },
            { label: "n", value: String(Math.round(nP.value)) },
          ],
        };
      }
      case "du": {
        const cP = parseNonNegative(a, "C");
        const hP = parseNonNegative(b, "H");
        const nField = n.trim() !== "" ? n : c;
        const xField = x.trim() !== "" ? x : r;
        const nParsed = parseNonNegative(nField === "" ? "0" : nField, "N");
        const xParsed = parseNonNegative(xField === "" ? "0" : xField, "X");
        if (!cP.ok) return { error: cP.error };
        if (!hP.ok) return { error: hP.error };
        if (!nParsed.ok) return { error: nParsed.error };
        if (!xParsed.ok) return { error: xParsed.error };
        const computed = degreeOfUnsaturation({
          c: cP.value,
          h: hP.value,
          n: nParsed.value,
          x: xParsed.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.du, 2),
          primaryLabel: "Degree of unsaturation (DU)",
          rows: [
            { label: "C", value: String(Math.round(cP.value)) },
            { label: "H", value: String(Math.round(hP.value)) },
            { label: "N", value: String(Math.round(nParsed.value)) },
            { label: "X", value: String(Math.round(xParsed.value)) },
          ],
        };
      }
      case "iupac": {
        const nP = parsePositive(a, "n (carbons)");
        if (!nP.ok) return { error: nP.error };
        const kind = parseKind(b);
        if (!kind) return { error: "Kind must be alkane, alkene, or alkyne." };
        const computed = iupacNameTeaching({ n: nP.value, kind });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.name,
          primaryLabel: "Teaching name",
          rows: [
            { label: "Note", value: computed.note },
            { label: "Kind", value: kind },
            { label: "n", value: String(Math.round(nP.value)) },
          ],
        };
      }
      case "functional": {
        const computed = functionalGroupIdentifier({ keyword: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.group,
          primaryLabel: "Functional group",
          rows: [{ label: "Keyword", value: a.trim() || "—" }],
        };
      }
      case "reaction": {
        const computed = organicReactionPredictor({ query: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.prediction,
          primaryLabel: "Teaching prediction",
          rows: [{ label: "Query", value: a.trim() || "—" }],
        };
      }
    }
  }, [config.mode, a, b, c, r, n, x]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "formula" || config.mode === "iupac" ? (
            <>
              <div>
                <FieldLabel htmlFor="org-n">Carbon count n</FieldLabel>
                <FieldInput id="org-n" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="org-kind">Kind (alkane / alkene / alkyne)</FieldLabel>
                <FieldInput id="org-kind" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "du" ? (
            <>
              <div>
                <FieldLabel htmlFor="org-c">Carbon atoms (C)</FieldLabel>
                <FieldInput id="org-c" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="org-h">Hydrogen atoms (H)</FieldLabel>
                <FieldInput id="org-h" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="org-n-atoms">Nitrogen atoms (N)</FieldLabel>
                <FieldInput
                  id="org-n-atoms"
                  value={n.trim() !== "" ? n : c}
                  onChange={(ev) => {
                    setN(ev.target.value);
                    setC(ev.target.value);
                  }}
                  inputMode="numeric"
                />
              </div>
              <div>
                <FieldLabel htmlFor="org-x">Halogen atoms (X)</FieldLabel>
                <FieldInput
                  id="org-x"
                  value={x.trim() !== "" ? x : r}
                  onChange={(ev) => {
                    setX(ev.target.value);
                    setR(ev.target.value);
                  }}
                  inputMode="numeric"
                />
              </div>
            </>
          ) : null}

          {config.mode === "functional" ? (
            <div>
              <FieldLabel htmlFor="org-fg">Keyword (OH, ketone, COOH, …)</FieldLabel>
              <FieldInput id="org-fg" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "reaction" ? (
            <div>
              <FieldLabel htmlFor="org-rxn">Reaction hint (e.g. alkene+H2, esterification)</FieldLabel>
              <FieldInput id="org-rxn" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
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
