"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  BIOLOGY_MICRO_URL,
  bacterialGrowthRate,
  cellGrowth,
  cfu,
  doublingTime,
  opticalDensity,
} from "@/lib/calculators/biologyMicrobiology";

type MicroSlug =
  | "cell-growth-calculator"
  | "bacterial-growth-rate-calculator"
  | "doubling-time-calculator-biology"
  | "optical-density-od-calculator"
  | "colony-forming-unit-cfu-calculator";

type Mode = "cellGrowth" | "bacterialMu" | "doubling" | "od" | "cfu";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const CONFIG: Record<MicroSlug, Config> = {
  "cell-growth-calculator": {
    title: "Cell growth",
    description: "N = N₀ × e^(μ t).",
    mode: "cellGrowth",
    aDefault: "1000",
    bDefault: "0.5",
    cDefault: "2",
  },
  "bacterial-growth-rate-calculator": {
    title: "Bacterial growth rate",
    description: "μ = (ln N − ln N₀) / t.",
    mode: "bacterialMu",
    aDefault: "1000",
    bDefault: "8000",
    cDefault: "3",
  },
  "doubling-time-calculator-biology": {
    title: "Doubling time",
    description: "t_d = ln(2) / μ.",
    mode: "doubling",
    aDefault: "0.5",
    bDefault: "",
    cDefault: "",
  },
  "optical-density-od-calculator": {
    title: "Optical density (OD)",
    description: "OD = log₁₀(I₀ / I).",
    mode: "od",
    aDefault: "1",
    bDefault: "0.5",
    cDefault: "",
  },
  "colony-forming-unit-cfu-calculator": {
    title: "Colony-forming units (CFU)",
    description: "CFU/mL = colonies × dilution / volume plated.",
    mode: "cfu",
    aDefault: "150",
    bDefault: "1000",
    cDefault: "0.1",
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

export function BiologyMicrobiologyCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as MicroSlug] ?? CONFIG["cell-growth-calculator"];
  const [a, setA] = useState(useLoanInitialInput(BIOLOGY_MICRO_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(BIOLOGY_MICRO_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(BIOLOGY_MICRO_URL.C, config.cDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    if (config.mode === "doubling") {
      return { [BIOLOGY_MICRO_URL.A]: a };
    }
    if (config.mode === "od") {
      return { [BIOLOGY_MICRO_URL.A]: a, [BIOLOGY_MICRO_URL.B]: b };
    }
    return {
      [BIOLOGY_MICRO_URL.A]: a,
      [BIOLOGY_MICRO_URL.B]: b,
      [BIOLOGY_MICRO_URL.C]: c,
    };
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "cellGrowth": {
        const n0P = parseNonNegative(a, "N₀");
        const muP = parseFiniteNumber(b, "μ");
        const tP = parseNonNegative(c, "Time");
        if (!n0P.ok) return { error: n0P.error };
        if (!muP.ok) return { error: muP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = cellGrowth({ n0: n0P.value, mu: muP.value, t: tP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.n),
          primaryLabel: "N (cells)",
          rows: [
            { label: "N₀", value: num(n0P.value) },
            { label: "μ", value: num(muP.value) },
            { label: "t", value: num(tP.value) },
          ],
        };
      }
      case "bacterialMu": {
        const n0P = parsePositive(a, "N₀");
        const nP = parsePositive(b, "N");
        const tP = parsePositive(c, "Time");
        if (!n0P.ok) return { error: n0P.error };
        if (!nP.ok) return { error: nP.error };
        if (!tP.ok) return { error: tP.error };
        const computed = bacterialGrowthRate({ n0: n0P.value, n: nP.value, t: tP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.mu),
          primaryLabel: "Growth rate μ",
          rows: [
            { label: "N₀", value: num(n0P.value) },
            { label: "N", value: num(nP.value) },
            { label: "t", value: num(tP.value) },
          ],
        };
      }
      case "doubling": {
        const muP = parsePositive(a, "μ");
        if (!muP.ok) return { error: muP.error };
        const computed = doublingTime({ mu: muP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.td),
          primaryLabel: "Doubling time t_d",
          rows: [{ label: "μ", value: num(muP.value) }],
        };
      }
      case "od": {
        const i0P = parsePositive(a, "I₀");
        const iP = parsePositive(b, "I");
        if (!i0P.ok) return { error: i0P.error };
        if (!iP.ok) return { error: iP.error };
        const computed = opticalDensity({ i0: i0P.value, i: iP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.od),
          primaryLabel: "OD",
          rows: [
            { label: "I₀", value: num(i0P.value) },
            { label: "I", value: num(iP.value) },
          ],
        };
      }
      case "cfu": {
        const colP = parseNonNegative(a, "Colonies");
        const dilP = parsePositive(b, "Dilution factor");
        const volP = parsePositive(c, "Volume (mL)");
        if (!colP.ok) return { error: colP.error };
        if (!dilP.ok) return { error: dilP.error };
        if (!volP.ok) return { error: volP.error };
        const computed = cfu({
          colonies: colP.value,
          dilutionFactor: dilP.value,
          volumeMl: volP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.cfuPerMl)} CFU/mL`,
          primaryLabel: "CFU density",
          rows: [
            { label: "Colonies", value: num(colP.value) },
            { label: "Dilution", value: num(dilP.value) },
            { label: "Volume plated", value: `${num(volP.value)} mL` },
          ],
        };
      }
    }
  }, [config.mode, a, b, c]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "cellGrowth" ? (
            <>
              <div>
                <FieldLabel htmlFor="bm-n0">Initial count N₀</FieldLabel>
                <FieldInput id="bm-n0" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bm-mu">Growth rate μ</FieldLabel>
                <FieldInput id="bm-mu" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bm-t">Time t</FieldLabel>
                <FieldInput id="bm-t" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "bacterialMu" ? (
            <>
              <div>
                <FieldLabel htmlFor="bm-bn0">Initial count N₀</FieldLabel>
                <FieldInput id="bm-bn0" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bm-bn">Final count N</FieldLabel>
                <FieldInput id="bm-bn" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bm-bt">Time t</FieldLabel>
                <FieldInput id="bm-bt" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "doubling" ? (
            <div>
              <FieldLabel htmlFor="bm-dmu">Growth rate μ</FieldLabel>
              <FieldInput id="bm-dmu" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "od" ? (
            <>
              <div>
                <FieldLabel htmlFor="bm-i0">Incident intensity I₀</FieldLabel>
                <FieldInput id="bm-i0" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bm-i">Transmitted intensity I</FieldLabel>
                <FieldInput id="bm-i" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "cfu" ? (
            <>
              <div>
                <FieldLabel htmlFor="bm-col">Colony count</FieldLabel>
                <FieldInput id="bm-col" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bm-dil">Dilution factor</FieldLabel>
                <FieldInput id="bm-dil" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bm-vol">Volume plated (mL)</FieldLabel>
                <FieldInput id="bm-vol" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
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
