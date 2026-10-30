"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  MEDICAL_GERIATRICS_URL,
  cognitiveScore,
  fallRisk,
  lifeExpectancy,
} from "@/lib/calculators/medicalGeriatrics";

type GeriSlug =
  | "medical-life-expectancy-calculator"
  | "medical-fall-risk-calculator"
  | "medical-cognitive-score-calculator";

type Mode = "life" | "fall" | "cognitive";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
};

const DISCLAIMER =
  "Educational geriatrics awareness math only — not actuarial life expectancy, comprehensive geriatric assessment, diagnosis, or care planning. Consult qualified clinicians for personal decisions.";

const CONFIG: Record<GeriSlug, Config> = {
  "medical-life-expectancy-calculator": {
    title: "Life expectancy (toy model)",
    description: `Classroom remaining-years estimate. Sex: male or female (text). ${DISCLAIMER}`,
    mode: "life",
    aDefault: "70",
    bDefault: "male",
    cDefault: "0",
    rDefault: "1",
  },
  "medical-fall-risk-calculator": {
    title: "Fall risk score",
    description: `Sum Morse-like item points from a CSV. ${DISCLAIMER}`,
    mode: "fall",
    aDefault: "15,10,5",
    bDefault: "",
    cDefault: "",
    rDefault: "",
  },
  "medical-cognitive-score-calculator": {
    title: "Cognitive screening total",
    description: `Sum item scores (or a single total) against an optional max (default 30). ${DISCLAIMER}`,
    mode: "cognitive",
    aDefault: "26",
    bDefault: "30",
    cDefault: "",
    rDefault: "",
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

function parseFlag01(raw: string, label: string) {
  const p = parseFiniteNumber(raw, label);
  if (!p.ok) return p;
  if (p.value !== 0 && p.value !== 1) return { ok: false as const, error: `${label} must be 0 or 1.` };
  return { ok: true as const, value: p.value };
}

function parseSex(raw: string): { ok: true; value: "male" | "female" } | { ok: false; error: string } {
  const s = raw.trim().toLowerCase();
  if (s === "male" || s === "m") return { ok: true, value: "male" };
  if (s === "female" || s === "f") return { ok: true, value: "female" };
  return { ok: false, error: "Sex must be male or female." };
}

export function MedicalGeriatricsCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as GeriSlug] ?? CONFIG["medical-life-expectancy-calculator"];
  const [a, setA] = useState(useLoanInitialInput(MEDICAL_GERIATRICS_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(MEDICAL_GERIATRICS_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(MEDICAL_GERIATRICS_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(MEDICAL_GERIATRICS_URL.R, config.rDefault));

  const num = (n: number, d = 1) => {
    if (!Number.isFinite(n)) return "—";
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (key: string, val: string) => {
      if (val.trim() !== "") out[key] = val;
    };
    switch (config.mode) {
      case "life":
        put(MEDICAL_GERIATRICS_URL.A, a);
        put(MEDICAL_GERIATRICS_URL.B, b);
        put(MEDICAL_GERIATRICS_URL.C, c);
        put(MEDICAL_GERIATRICS_URL.R, r);
        break;
      case "fall":
        put(MEDICAL_GERIATRICS_URL.A, a);
        break;
      case "cognitive":
        put(MEDICAL_GERIATRICS_URL.A, a);
        put(MEDICAL_GERIATRICS_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, r, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "life": {
        const ageP = parseNonNegative(a, "Age");
        const sexP = parseSex(b);
        const smokeP = parseFlag01(c, "Smoke");
        const exP = parseFlag01(r, "Exercise");
        if (!ageP.ok) return { error: ageP.error };
        if (!sexP.ok) return { error: sexP.error };
        if (!smokeP.ok) return { error: smokeP.error };
        if (!exP.ok) return { error: exP.error };
        const computed = lifeExpectancy({
          age: ageP.value,
          sex: sexP.value,
          smoke: smokeP.value,
          exercise: exP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.estimateYears, 0)} years`,
          primaryLabel: "Remaining years (toy)",
          rows: [
            { label: "Sex", value: sexP.value },
            { label: "Age", value: num(ageP.value, 0) },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "fall": {
        if (a.trim() === "") return { error: "Scores CSV: required." };
        const computed = fallRisk({ scoresCsv: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.score),
          primaryLabel: "Fall-risk total",
          rows: [{ label: "Band", value: computed.band }],
        };
      }
      case "cognitive": {
        if (a.trim() === "") return { error: "Scores CSV: required." };
        let maxTotal: number | undefined;
        if (b.trim() !== "") {
          const maxP = parsePositive(b, "Max total");
          if (!maxP.ok) return { error: maxP.error };
          maxTotal = maxP.value;
        }
        const computed = cognitiveScore({ scoresCsv: a, maxTotal });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.total),
          primaryLabel: "Cognitive total",
          rows: [
            { label: "Band", value: computed.band },
            { label: "Max", value: maxTotal != null ? String(maxTotal) : "30" },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "life" ? (
            <>
              <div>
                <FieldLabel htmlFor="mg-age">Age (years)</FieldLabel>
                <FieldInput id="mg-age" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="mg-sex">Sex (male or female)</FieldLabel>
                <FieldInput id="mg-sex" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="mg-smoke">Smoke (0 or 1)</FieldLabel>
                <FieldInput id="mg-smoke" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="mg-ex">Exercise (0 or 1)</FieldLabel>
                <FieldInput id="mg-ex" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="numeric" />
              </div>
            </>
          ) : null}

          {config.mode === "fall" ? (
            <div>
              <FieldLabel htmlFor="mg-fall">Item scores CSV</FieldLabel>
              <FieldInput id="mg-fall" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "cognitive" ? (
            <>
              <div>
                <FieldLabel htmlFor="mg-cog">Item scores CSV (or single total)</FieldLabel>
                <FieldInput id="mg-cog" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="mg-max">Max total (optional, default 30)</FieldLabel>
                <FieldInput id="mg-max" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
