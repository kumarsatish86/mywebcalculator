"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  EXAM_INTERNATIONAL_URL,
  gmatScore,
  greScore,
  ieltsBand,
  satScore,
  toeflScore,
} from "@/lib/calculators/examInternational";

type IntlSlug =
  | "sat-score-calculator"
  | "gre-score-calculator"
  | "gmat-score-calculator"
  | "ielts-band-calculator"
  | "toefl-score-calculator";

type Mode = "sat" | "gre" | "gmat" | "ielts" | "toefl";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
};

const CONFIG: Record<IntlSlug, Config> = {
  "sat-score-calculator": {
    title: "SAT score calculator",
    description: "Illustrative scaled total from Reading & Writing and Math raw scores.",
    mode: "sat",
    aDefault: "40",
    bDefault: "32",
    cDefault: "0",
    rDefault: "54",
    tDefault: "44",
  },
  "gre-score-calculator": {
    title: "GRE score calculator",
    description: "Educational Verbal, Quant, and AWA scaling — not official ETS scoring.",
    mode: "gre",
    aDefault: "30",
    bDefault: "28",
    cDefault: "4",
    rDefault: "40",
    tDefault: "0",
  },
  "gmat-score-calculator": {
    title: "GMAT score calculator",
    description: "Estimated total from Quant and Verbal correct counts.",
    mode: "gmat",
    aDefault: "20",
    bDefault: "28",
    cDefault: "0",
    rDefault: "31",
    tDefault: "36",
  },
  "ielts-band-calculator": {
    title: "IELTS band calculator",
    description: "Overall band from four skill scores with official-style 0.5 rounding.",
    mode: "ielts",
    aDefault: "7",
    bDefault: "7",
    cDefault: "6.5",
    rDefault: "7",
    tDefault: "0",
  },
  "toefl-score-calculator": {
    title: "TOEFL score calculator",
    description: "Total from four section scores (0–30 each).",
    mode: "toefl",
    aDefault: "25",
    bDefault: "24",
    cDefault: "23",
    rDefault: "22",
    tDefault: "0",
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

export function ExamInternationalCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as IntlSlug] ?? CONFIG["sat-score-calculator"];
  const [a, setA] = useState(useLoanInitialInput(EXAM_INTERNATIONAL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(EXAM_INTERNATIONAL_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(EXAM_INTERNATIONAL_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(EXAM_INTERNATIONAL_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(EXAM_INTERNATIONAL_URL.T, config.tDefault));

  const num = (n: number, d = 0) => (d === 0 ? String(Math.round(n)) : n.toFixed(d));

  const shareParams = useCallback(
    () => ({
      [EXAM_INTERNATIONAL_URL.A]: a,
      [EXAM_INTERNATIONAL_URL.B]: b,
      [EXAM_INTERNATIONAL_URL.C]: c,
      [EXAM_INTERNATIONAL_URL.R]: r,
      [EXAM_INTERNATIONAL_URL.T]: t,
    }),
    [a, b, c, r, t],
  );

  useLoanUrlSync(shareParams, [a, b, c, r, t]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "sat": {
        const rwP = parseNonNegative(a, "R&W raw");
        const mathP = parseNonNegative(b, "Math raw");
        const rwMaxP = parsePositive(r, "R&W max");
        const mathMaxP = parsePositive(t, "Math max");
        if (!rwP.ok) return { error: rwP.error };
        if (!mathP.ok) return { error: mathP.error };
        if (!rwMaxP.ok) return { error: rwMaxP.error };
        if (!mathMaxP.ok) return { error: mathMaxP.error };
        const computed = satScore({
          readingWritingRaw: rwP.value,
          mathRaw: mathP.value,
          rwMax: rwMaxP.value,
          mathMax: mathMaxP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.total),
          primaryLabel: "SAT total (illustrative)",
          rows: [
            { label: "R&W scaled", value: num(computed.rwScaled) },
            { label: "Math scaled", value: num(computed.mathScaled) },
            { label: "Band", value: computed.band },
          ],
        };
      }
      case "gre": {
        const vP = parseNonNegative(a, "Verbal raw");
        const qP = parseNonNegative(b, "Quant raw");
        const awaP = parseAprPercent(c, "AWA");
        const maxP = parsePositive(r, "Section max");
        if (!vP.ok) return { error: vP.error };
        if (!qP.ok) return { error: qP.error };
        if (!awaP.ok) return { error: awaP.error };
        if (!maxP.ok) return { error: maxP.error };
        const computed = greScore({
          verbalRaw: vP.value,
          quantRaw: qP.value,
          awa: awaP.value,
          sectionMax: maxP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.combinedVQ),
          primaryLabel: "Verbal + Quant",
          rows: [
            { label: "Verbal scaled", value: num(computed.verbalScaled) },
            { label: "Quant scaled", value: num(computed.quantScaled) },
            { label: "AWA", value: num(computed.awa, 1) },
          ],
        };
      }
      case "gmat": {
        const qP = parseNonNegative(a, "Quant correct");
        const vP = parseNonNegative(b, "Verbal correct");
        const qtP = parsePositive(r, "Quant total");
        const vtP = parsePositive(t, "Verbal total");
        if (!qP.ok) return { error: qP.error };
        if (!vP.ok) return { error: vP.error };
        if (!qtP.ok) return { error: qtP.error };
        if (!vtP.ok) return { error: vtP.error };
        const computed = gmatScore({
          quantCorrect: qP.value,
          verbalCorrect: vP.value,
          quantTotal: qtP.value,
          verbalTotal: vtP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.estimatedTotal),
          primaryLabel: "Estimated GMAT total",
          rows: [
            { label: "Quant index %", value: `${num(computed.quantIndex, 1)}%` },
            { label: "Verbal index %", value: `${num(computed.verbalIndex, 1)}%` },
            { label: "Band", value: computed.band },
          ],
        };
      }
      case "ielts": {
        const lP = parseAprPercent(a, "Listening");
        const rdP = parseAprPercent(b, "Reading");
        const wP = parseAprPercent(c, "Writing");
        const sP = parseAprPercent(r, "Speaking");
        if (!lP.ok) return { error: lP.error };
        if (!rdP.ok) return { error: rdP.error };
        if (!wP.ok) return { error: wP.error };
        if (!sP.ok) return { error: sP.error };
        if ([lP.value, rdP.value, wP.value, sP.value].some((v) => v > 9)) {
          return { error: "Each skill must be between 0 and 9." };
        }
        const computed = ieltsBand({
          listening: lP.value,
          reading: rdP.value,
          writing: wP.value,
          speaking: sP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.overallBand, 1),
          primaryLabel: "Overall band",
          rows: [
            { label: "Average", value: num(computed.average, 2) },
            { label: "CEFR hint", value: computed.cefrHint },
          ],
        };
      }
      case "toefl": {
        const rdP = parseNonNegative(a, "Reading");
        const lP = parseNonNegative(b, "Listening");
        const spP = parseNonNegative(c, "Speaking");
        const wrP = parseNonNegative(r, "Writing");
        if (!rdP.ok) return { error: rdP.error };
        if (!lP.ok) return { error: lP.error };
        if (!spP.ok) return { error: spP.error };
        if (!wrP.ok) return { error: wrP.error };
        if ([rdP.value, lP.value, spP.value, wrP.value].some((v) => v > 30)) {
          return { error: "Each section must be between 0 and 30." };
        }
        const computed = toeflScore({
          reading: rdP.value,
          listening: lP.value,
          speaking: spP.value,
          writing: wrP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.total),
          primaryLabel: "TOEFL total",
          rows: [{ label: "Band", value: computed.band }],
        };
      }
    }
  }, [config.mode, a, b, c, r, t]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "sat" ? (
            <>
              <div>
                <FieldLabel htmlFor="ei-rw">Reading & Writing raw</FieldLabel>
                <FieldInput id="ei-rw" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ei-math">Math raw</FieldLabel>
                <FieldInput id="ei-math" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ei-rwmax">R&W max (optional)</FieldLabel>
                <FieldInput id="ei-rwmax" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ei-mmax">Math max (optional)</FieldLabel>
                <FieldInput id="ei-mmax" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "gre" ? (
            <>
              <div>
                <FieldLabel htmlFor="ei-verbal">Verbal raw</FieldLabel>
                <FieldInput id="ei-verbal" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ei-quant">Quant raw</FieldLabel>
                <FieldInput id="ei-quant" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ei-awa">AWA (0–6)</FieldLabel>
                <FieldInput id="ei-awa" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ei-gremax">Section max (optional)</FieldLabel>
                <FieldInput id="ei-gremax" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "gmat" ? (
            <>
              <div>
                <FieldLabel htmlFor="ei-gq">Quant correct</FieldLabel>
                <FieldInput id="ei-gq" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ei-gv">Verbal correct</FieldLabel>
                <FieldInput id="ei-gv" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ei-gqt">Quant total (optional)</FieldLabel>
                <FieldInput id="ei-gqt" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ei-gvt">Verbal total (optional)</FieldLabel>
                <FieldInput id="ei-gvt" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "ielts" ? (
            <>
              <div>
                <FieldLabel htmlFor="ei-listen">Listening (0–9)</FieldLabel>
                <FieldInput id="ei-listen" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ei-read">Reading (0–9)</FieldLabel>
                <FieldInput id="ei-read" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ei-write">Writing (0–9)</FieldLabel>
                <FieldInput id="ei-write" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ei-speak">Speaking (0–9)</FieldLabel>
                <FieldInput id="ei-speak" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "toefl" ? (
            <>
              <div>
                <FieldLabel htmlFor="ei-tread">Reading (0–30)</FieldLabel>
                <FieldInput id="ei-tread" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ei-tlisten">Listening (0–30)</FieldLabel>
                <FieldInput id="ei-tlisten" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ei-tspeak">Speaking (0–30)</FieldLabel>
                <FieldInput id="ei-tspeak" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ei-twrite">Writing (0–30)</FieldLabel>
                <FieldInput id="ei-twrite" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
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
