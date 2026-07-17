"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  CHEMISTRY_AI_URL,
  chemicalSafetyAdvisor,
  compoundStructure,
  equationBalancerAi,
  labSolutionPrep,
  reactionPredictor,
} from "@/lib/calculators/chemistryAiSmart";

type AiSlug =
  | "chemical-equation-balancer-ai"
  | "reaction-predictor-chemistry"
  | "lab-solution-preparation-calculator"
  | "chemical-safety-advisor"
  | "compound-structure-generator";

type Mode = "balancer" | "reaction" | "lab" | "safety" | "structure";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  mDefault: string;
  vDefault: string;
  wDefault: string;
};

const CONFIG: Record<AiSlug, Config> = {
  "chemical-equation-balancer-ai": {
    title: "Equation coefficient reducer",
    description: "Rule-based coefficient reducer — not a live AI model. Verify atom balance yourself.",
    mode: "balancer",
    aDefault: "2,4,2",
    mDefault: "",
    vDefault: "",
    wDefault: "",
  },
  "reaction-predictor-chemistry": {
    title: "Reaction predictor",
    description: "Preset teaching patterns only — not a live AI predictor.",
    mode: "reaction",
    aDefault: "H2+O2",
    mDefault: "",
    vDefault: "",
    wDefault: "",
  },
  "lab-solution-preparation-calculator": {
    title: "Lab solution preparation",
    description: "mass = M × V × molar mass. Classroom prep math — not a live AI tool.",
    mode: "lab",
    aDefault: "",
    mDefault: "1",
    vDefault: "0.5",
    wDefault: "58.44",
  },
  "chemical-safety-advisor": {
    title: "Chemical safety advisor",
    description: "Keyword hazard reminders only — always check the SDS. Not a live AI advisor.",
    mode: "safety",
    aDefault: "acid",
    mDefault: "",
    vDefault: "",
    wDefault: "",
  },
  "compound-structure-generator": {
    title: "Compound formula atoms",
    description: "Parse a simple formula into atom counts. Rule-based helper — not a live AI model.",
    mode: "structure",
    aDefault: "H2O",
    mDefault: "",
    vDefault: "",
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

export function ChemistryAiSmartCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as AiSlug] ?? CONFIG["chemical-equation-balancer-ai"];
  const [a, setA] = useState(useLoanInitialInput(CHEMISTRY_AI_URL.A, config.aDefault));
  const [m, setM] = useState(useLoanInitialInput(CHEMISTRY_AI_URL.M, config.mDefault));
  const [v, setV] = useState(useLoanInitialInput(CHEMISTRY_AI_URL.V, config.vDefault));
  const [w, setW] = useState(useLoanInitialInput(CHEMISTRY_AI_URL.W, config.wDefault));

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
      case "balancer":
      case "reaction":
      case "safety":
      case "structure":
        put(CHEMISTRY_AI_URL.A, a);
        break;
      case "lab":
        put(CHEMISTRY_AI_URL.M, m);
        put(CHEMISTRY_AI_URL.V, v);
        put(CHEMISTRY_AI_URL.W, w);
        break;
    }
    return out;
  }, [a, m, v, w, config.mode]);

  useLoanUrlSync(shareParams, [a, m, v, w]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "balancer": {
        const computed = equationBalancerAi({ coeffsCsv: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.coeffs.join(", "),
          primaryLabel: "Reduced coefficients",
          rows: [{ label: "Note", value: computed.note }],
        };
      }
      case "reaction": {
        const computed = reactionPredictor({ query: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.prediction,
          primaryLabel: "Prediction",
          rows: [{ label: "Query", value: a.trim() || "—" }],
        };
      }
      case "lab": {
        const molarity = parseNonNegative(m, "Molarity");
        const volume = parsePositive(v, "Volume (L)");
        const molarMass = parsePositive(w, "Molar mass");
        if (!molarity.ok) return { error: molarity.error };
        if (!volume.ok) return { error: volume.error };
        if (!molarMass.ok) return { error: molarMass.error };
        const computed = labSolutionPrep({
          molarity: molarity.value,
          volumeL: volume.value,
          molarMass: molarMass.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.massG, 3)} g`,
          primaryLabel: "Solute mass",
          rows: [
            { label: "Molarity", value: `${num(molarity.value, 3)} M` },
            { label: "Volume", value: `${num(volume.value, 3)} L` },
            { label: "Molar mass", value: `${num(molarMass.value, 3)} g/mol` },
          ],
        };
      }
      case "safety": {
        const computed = chemicalSafetyAdvisor({ keyword: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.advice,
          primaryLabel: "Safety note",
          rows: [
            { label: "Keyword", value: a.trim() || "—" },
            { label: "Reminder", value: "Always read the SDS for your exact chemical." },
          ],
        };
      }
      case "structure": {
        const computed = compoundStructure({ formula: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.summary,
          primaryLabel: "Atom counts",
          rows: Object.entries(computed.atoms).map(([el, count]) => ({
            label: el,
            value: `${count}`,
          })),
        };
      }
    }
  }, [config.mode, a, m, v, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "balancer" ? (
            <div>
              <FieldLabel htmlFor="cai-a">Coefficients CSV</FieldLabel>
              <FieldInput id="cai-a" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "reaction" ? (
            <div>
              <FieldLabel htmlFor="cai-a">Reaction hint (e.g. H2+O2)</FieldLabel>
              <FieldInput id="cai-a" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "lab" ? (
            <>
              <div>
                <FieldLabel htmlFor="cai-m">Molarity (M)</FieldLabel>
                <FieldInput id="cai-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cai-v">Volume (L)</FieldLabel>
                <FieldInput id="cai-v" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cai-w">Molar mass (g/mol)</FieldLabel>
                <FieldInput id="cai-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "safety" ? (
            <div>
              <FieldLabel htmlFor="cai-a">Hazard keyword (acid, base, solvent, oxidizer)</FieldLabel>
              <FieldInput id="cai-a" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "structure" ? (
            <div>
              <FieldLabel htmlFor="cai-a">Formula (e.g. H2O, C6H12O6)</FieldLabel>
              <FieldInput id="cai-a" value={a} onChange={(ev) => setA(ev.target.value)} />
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
