"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  MEDICAL_ORTHO_URL,
  boneDensity,
  fractureRiskFrax,
  idealPosture,
} from "@/lib/calculators/medicalOrthopedic";

type OrthoSlug =
  | "medical-bone-density-calculator"
  | "medical-fracture-risk-frax-calculator"
  | "medical-ideal-posture-calculator";

type Mode = "bmd" | "frax" | "posture";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  tDefault: string;
};

const DISCLAIMER =
  "Educational bone-health and ergonomics math only — not a DXA report, FRAX® result, diagnosis, or treatment plan. Imaging and fracture decisions belong with clinicians.";

const CONFIG: Record<OrthoSlug, Config> = {
  "medical-bone-density-calculator": {
    title: "Bone density T-score",
    description: `T-score ≈ (BMD − young-adult mean) / SD with WHO-style teaching bands. ${DISCLAIMER}`,
    mode: "bmd",
    aDefault: "0.8",
    bDefault: "1.0",
    cDefault: "0.1",
    tDefault: "",
  },
  "medical-fracture-risk-frax-calculator": {
    title: "Fracture risk (FRAX-like teaching)",
    description: `Simplified risk-factor tally with 0/1 flags + T-score — not the licensed FRAX® algorithm. ${DISCLAIMER}`,
    mode: "frax",
    aDefault: "65",
    bDefault: "0,0,0,0,0,0,0",
    cDefault: "",
    tDefault: "-1.5",
  },
  "medical-ideal-posture-calculator": {
    title: "Ideal posture desk heights",
    description: `Starting desk/monitor height heuristics from stature. ${DISCLAIMER}`,
    mode: "posture",
    aDefault: "170",
    bDefault: "",
    cDefault: "",
    tDefault: "",
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

function splitFlags(raw: string): string[] {
  const parts = raw.split(/[,;\s]+/).filter((x) => x !== "");
  while (parts.length < 7) parts.push("0");
  return parts.slice(0, 7);
}

export function MedicalOrthopedicCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as OrthoSlug] ?? CONFIG["medical-bone-density-calculator"];
  const bInit = useLoanInitialInput(MEDICAL_ORTHO_URL.B, config.bDefault);
  const flagParts = splitFlags(bInit);

  const [a, setA] = useState(useLoanInitialInput(MEDICAL_ORTHO_URL.A, config.aDefault));
  const [b, setB] = useState(bInit);
  const [c, setC] = useState(useLoanInitialInput(MEDICAL_ORTHO_URL.C, config.cDefault));
  const [t, setT] = useState(useLoanInitialInput(MEDICAL_ORTHO_URL.T, config.tDefault));

  const [prior, setPrior] = useState(flagParts[0] ?? "0");
  const [parentHip, setParentHip] = useState(flagParts[1] ?? "0");
  const [smoke, setSmoke] = useState(flagParts[2] ?? "0");
  const [steroids, setSteroids] = useState(flagParts[3] ?? "0");
  const [ra, setRa] = useState(flagParts[4] ?? "0");
  const [secondary, setSecondary] = useState(flagParts[5] ?? "0");
  const [alcohol, setAlcohol] = useState(flagParts[6] ?? "0");

  const num = (n: number, d = 2) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const flagsCsv = [prior, parentHip, smoke, steroids, ra, secondary, alcohol].join(",");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (key: string, val: string) => {
      if (val.trim() !== "") out[key] = val;
    };
    switch (config.mode) {
      case "bmd":
        put(MEDICAL_ORTHO_URL.A, a);
        put(MEDICAL_ORTHO_URL.B, b);
        put(MEDICAL_ORTHO_URL.C, c);
        break;
      case "frax":
        put(MEDICAL_ORTHO_URL.A, a);
        put(MEDICAL_ORTHO_URL.B, flagsCsv);
        put(MEDICAL_ORTHO_URL.T, t);
        break;
      case "posture":
        put(MEDICAL_ORTHO_URL.A, a);
        break;
    }
    return out;
  }, [a, b, c, t, flagsCsv, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, t, flagsCsv]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "bmd": {
        const bmdP = parseFiniteNumber(a, "BMD");
        const meanP = parseFiniteNumber(b, "Young-adult mean");
        const sdP = parsePositive(c, "SD");
        if (!bmdP.ok) return { error: bmdP.error };
        if (!meanP.ok) return { error: meanP.error };
        if (!sdP.ok) return { error: sdP.error };
        const computed = boneDensity({ bmd: bmdP.value, youngMean: meanP.value, sd: sdP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.tScore),
          primaryLabel: "T-score",
          rows: [
            { label: "Band", value: computed.band },
            { label: "BMD", value: num(bmdP.value, 3) },
            { label: "Young mean", value: num(meanP.value, 3) },
            { label: "SD", value: num(sdP.value, 3) },
          ],
        };
      }
      case "frax": {
        const ageP = parsePositive(a, "Age");
        const tP = parseFiniteNumber(t, "T-score");
        const priorP = parseFlag01(prior, "Prior fracture");
        const parentP = parseFlag01(parentHip, "Parent hip fracture");
        const smokeP = parseFlag01(smoke, "Smoking");
        const sterP = parseFlag01(steroids, "Steroids");
        const raP = parseFlag01(ra, "RA");
        const secP = parseFlag01(secondary, "Secondary osteoporosis");
        const alcP = parseFlag01(alcohol, "Alcohol");
        if (!ageP.ok) return { error: ageP.error };
        if (!tP.ok) return { error: tP.error };
        if (!priorP.ok) return { error: priorP.error };
        if (!parentP.ok) return { error: parentP.error };
        if (!smokeP.ok) return { error: smokeP.error };
        if (!sterP.ok) return { error: sterP.error };
        if (!raP.ok) return { error: raP.error };
        if (!secP.ok) return { error: secP.error };
        if (!alcP.ok) return { error: alcP.error };
        const computed = fractureRiskFrax({
          age: ageP.value,
          priorFracture: priorP.value,
          parentHip: parentP.value,
          smoke: smokeP.value,
          steroids: sterP.value,
          ra: raP.value,
          secondary: secP.value,
          alcohol: alcP.value,
          tScore: tP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.points),
          primaryLabel: "Teaching points",
          rows: [
            { label: "Band", value: computed.band },
            { label: "T-score", value: num(tP.value) },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "posture": {
        const htP = parsePositive(a, "Height");
        if (!htP.ok) return { error: htP.error };
        const computed = idealPosture({ heightCm: htP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.deskCm)} cm`,
          primaryLabel: "Desk height estimate",
          rows: [
            { label: "Monitor height", value: `${num(computed.monitorCm)} cm` },
            { label: "Stature", value: `${num(htP.value, 0)} cm` },
            { label: "Note", value: computed.note },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, t, prior, parentHip, smoke, steroids, ra, secondary, alcohol]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "bmd" ? (
            <>
              <div>
                <FieldLabel htmlFor="orth-bmd">BMD</FieldLabel>
                <FieldInput id="orth-bmd" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="orth-mean">Young-adult mean BMD</FieldLabel>
                <FieldInput id="orth-mean" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="orth-sd">SD</FieldLabel>
                <FieldInput id="orth-sd" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "frax" ? (
            <>
              <div>
                <FieldLabel htmlFor="orth-age">Age (40–90)</FieldLabel>
                <FieldInput id="orth-age" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="orth-tscore">T-score</FieldLabel>
                <FieldInput id="orth-tscore" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="orth-prior">Prior fracture (0 or 1)</FieldLabel>
                <FieldInput id="orth-prior" value={prior} onChange={(ev) => setPrior(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="orth-parent">Parent hip fracture (0 or 1)</FieldLabel>
                <FieldInput
                  id="orth-parent"
                  value={parentHip}
                  onChange={(ev) => setParentHip(ev.target.value)}
                  inputMode="numeric"
                />
              </div>
              <div>
                <FieldLabel htmlFor="orth-smoke">Smoking (0 or 1)</FieldLabel>
                <FieldInput id="orth-smoke" value={smoke} onChange={(ev) => setSmoke(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="orth-ster">Steroids (0 or 1)</FieldLabel>
                <FieldInput
                  id="orth-ster"
                  value={steroids}
                  onChange={(ev) => setSteroids(ev.target.value)}
                  inputMode="numeric"
                />
              </div>
              <div>
                <FieldLabel htmlFor="orth-ra">RA (0 or 1)</FieldLabel>
                <FieldInput id="orth-ra" value={ra} onChange={(ev) => setRa(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="orth-sec">Secondary osteoporosis (0 or 1)</FieldLabel>
                <FieldInput
                  id="orth-sec"
                  value={secondary}
                  onChange={(ev) => setSecondary(ev.target.value)}
                  inputMode="numeric"
                />
              </div>
              <div>
                <FieldLabel htmlFor="orth-alc">Alcohol (0 or 1)</FieldLabel>
                <FieldInput
                  id="orth-alc"
                  value={alcohol}
                  onChange={(ev) => setAlcohol(ev.target.value)}
                  inputMode="numeric"
                />
              </div>
            </>
          ) : null}

          {config.mode === "posture" ? (
            <div>
              <FieldLabel htmlFor="orth-ht">Height (cm)</FieldLabel>
              <FieldInput id="orth-ht" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
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
