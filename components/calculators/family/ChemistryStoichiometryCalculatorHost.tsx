"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  CHEMISTRY_STOICH_URL,
  actualYield,
  balanceCoefficients,
  limitingReagent,
  percentYield,
  reactionRatio,
  stoichiometry,
  theoreticalYield,
} from "@/lib/calculators/chemistryStoichiometry";

type StoichSlug =
  | "stoichiometry-calculator"
  | "limiting-reagent-calculator"
  | "theoretical-yield-calculator"
  | "percent-yield-calculator"
  | "actual-yield-calculator"
  | "reaction-ratio-calculator"
  | "balanced-equation-calculator-auto-balancer";

type Mode =
  | "stoichiometry"
  | "limiting"
  | "theoretical"
  | "percent"
  | "actual"
  | "ratio"
  | "balance";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  wDefault: string;
};

const CONFIG: Record<StoichSlug, Config> = {
  "stoichiometry-calculator": {
    title: "Stoichiometry calculator",
    description: "Product moles from reactant moles via coefficient ratio.",
    mode: "stoichiometry",
    aDefault: "2",
    bDefault: "2",
    cDefault: "1",
    rDefault: "",
    wDefault: "",
  },
  "limiting-reagent-calculator": {
    title: "Limiting reagent",
    description: "Compare extents moles/coeff to find the limiting reactant.",
    mode: "limiting",
    aDefault: "4",
    bDefault: "2",
    cDefault: "3",
    rDefault: "1",
    wDefault: "",
  },
  "theoretical-yield-calculator": {
    title: "Theoretical yield",
    description: "Mass of product from limiting moles and molar mass.",
    mode: "theoretical",
    aDefault: "1",
    bDefault: "1",
    cDefault: "1",
    rDefault: "18",
    wDefault: "",
  },
  "percent-yield-calculator": {
    title: "Percent yield",
    description: "% yield = (actual / theoretical) × 100.",
    mode: "percent",
    aDefault: "8.5",
    bDefault: "10",
    cDefault: "",
    rDefault: "",
    wDefault: "",
  },
  "actual-yield-calculator": {
    title: "Actual yield",
    description: "Actual = (% yield / 100) × theoretical.",
    mode: "actual",
    aDefault: "85",
    bDefault: "10",
    cDefault: "",
    rDefault: "",
    wDefault: "",
  },
  "reaction-ratio-calculator": {
    title: "Reaction ratio",
    description: "Mole ratio A:B and a simplified integer form.",
    mode: "ratio",
    aDefault: "2",
    bDefault: "1",
    cDefault: "",
    rDefault: "",
    wDefault: "",
  },
  "balanced-equation-calculator-auto-balancer": {
    title: "Balance coefficients",
    description: "Reduce a CSV of positive coefficients to smallest integers.",
    mode: "balance",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    wDefault: "2,1,2",
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

export function ChemistryStoichiometryCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as StoichSlug] ?? CONFIG["stoichiometry-calculator"];
  const [a, setA] = useState(useLoanInitialInput(CHEMISTRY_STOICH_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CHEMISTRY_STOICH_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CHEMISTRY_STOICH_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(CHEMISTRY_STOICH_URL.R, config.rDefault));
  const [w, setW] = useState(useLoanInitialInput(CHEMISTRY_STOICH_URL.W, config.wDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    if (config.mode === "balance") {
      return { [CHEMISTRY_STOICH_URL.W]: w };
    }
    if (config.mode === "stoichiometry") {
      return {
        [CHEMISTRY_STOICH_URL.A]: a,
        [CHEMISTRY_STOICH_URL.B]: b,
        [CHEMISTRY_STOICH_URL.C]: c,
      };
    }
    if (config.mode === "limiting" || config.mode === "theoretical") {
      return {
        [CHEMISTRY_STOICH_URL.A]: a,
        [CHEMISTRY_STOICH_URL.B]: b,
        [CHEMISTRY_STOICH_URL.C]: c,
        [CHEMISTRY_STOICH_URL.R]: r,
      };
    }
    return {
      [CHEMISTRY_STOICH_URL.A]: a,
      [CHEMISTRY_STOICH_URL.B]: b,
    };
  }, [a, b, c, r, w, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, w]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "stoichiometry": {
        const molesP = parseNonNegative(a, "Moles reactant");
        const coeffRP = parsePositive(b, "Coeff reactant");
        const coeffPP = parsePositive(c, "Coeff product");
        if (!molesP.ok) return { error: molesP.error };
        if (!coeffRP.ok) return { error: coeffRP.error };
        if (!coeffPP.ok) return { error: coeffPP.error };
        const computed = stoichiometry({
          molesReactant: molesP.value,
          coeffReactant: coeffRP.value,
          coeffProduct: coeffPP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.molesProduct)} mol`,
          primaryLabel: "Moles product",
          rows: [
            { label: "Moles reactant", value: `${num(molesP.value)} mol` },
            { label: "Ratio", value: `${num(coeffRP.value)} → ${num(coeffPP.value)}` },
          ],
        };
      }
      case "limiting": {
        const molesAP = parseNonNegative(a, "Moles A");
        const coeffAP = parsePositive(b, "Coeff A");
        const molesBP = parseNonNegative(c, "Moles B");
        const coeffBP = parsePositive(r, "Coeff B");
        if (!molesAP.ok) return { error: molesAP.error };
        if (!coeffAP.ok) return { error: coeffAP.error };
        if (!molesBP.ok) return { error: molesBP.error };
        if (!coeffBP.ok) return { error: coeffBP.error };
        const computed = limitingReagent({
          molesA: molesAP.value,
          coeffA: coeffAP.value,
          molesB: molesBP.value,
          coeffB: coeffBP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.limiting === "equal" ? "Equal (neither)" : `Reactant ${computed.limiting}`,
          primaryLabel: "Limiting reagent",
          rows: [
            { label: "Extent", value: `${num(computed.extent)}` },
            { label: "A moles / coeff", value: `${num(molesAP.value / coeffAP.value)}` },
            { label: "B moles / coeff", value: `${num(molesBP.value / coeffBP.value)}` },
          ],
        };
      }
      case "theoretical": {
        const molesP = parseNonNegative(a, "Moles limiting");
        const coeffLP = parsePositive(b, "Coeff limiting");
        const coeffPP = parsePositive(c, "Coeff product");
        const mmP = parsePositive(r, "Molar mass product");
        if (!molesP.ok) return { error: molesP.error };
        if (!coeffLP.ok) return { error: coeffLP.error };
        if (!coeffPP.ok) return { error: coeffPP.error };
        if (!mmP.ok) return { error: mmP.error };
        const computed = theoreticalYield({
          molesLimiting: molesP.value,
          coeffLimiting: coeffLP.value,
          coeffProduct: coeffPP.value,
          molarMassProduct: mmP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.massG)} g`,
          primaryLabel: "Theoretical mass",
          rows: [
            { label: "Moles product", value: `${num(computed.molesProduct)} mol` },
            { label: "Molar mass", value: `${num(mmP.value)} g/mol` },
          ],
        };
      }
      case "percent": {
        const actualP = parseNonNegative(a, "Actual yield");
        const theoP = parsePositive(b, "Theoretical yield");
        if (!actualP.ok) return { error: actualP.error };
        if (!theoP.ok) return { error: theoP.error };
        const computed = percentYield({ actual: actualP.value, theoretical: theoP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.percent, 2)} %`,
          primaryLabel: "Percent yield",
          rows: [
            { label: "Actual", value: `${num(actualP.value)}` },
            { label: "Theoretical", value: `${num(theoP.value)}` },
          ],
        };
      }
      case "actual": {
        const pctP = parseNonNegative(a, "Percent yield");
        const theoP = parseNonNegative(b, "Theoretical yield");
        if (!pctP.ok) return { error: pctP.error };
        if (!theoP.ok) return { error: theoP.error };
        const computed = actualYield({ percent: pctP.value, theoretical: theoP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.actual)}`,
          primaryLabel: "Actual yield",
          rows: [
            { label: "Percent", value: `${num(pctP.value)} %` },
            { label: "Theoretical", value: `${num(theoP.value)}` },
          ],
        };
      }
      case "ratio": {
        const molesAP = parsePositive(a, "Moles A");
        const molesBP = parsePositive(b, "Moles B");
        if (!molesAP.ok) return { error: molesAP.error };
        if (!molesBP.ok) return { error: molesBP.error };
        const computed = reactionRatio({ molesA: molesAP.value, molesB: molesBP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.simplified,
          primaryLabel: "Simplified A : B",
          rows: [
            { label: "Ratio A/B", value: num(computed.ratioAB) },
            { label: "Moles A", value: `${num(molesAP.value)} mol` },
            { label: "Moles B", value: `${num(molesBP.value)} mol` },
          ],
        };
      }
      case "balance": {
        const computed = balanceCoefficients({ coeffsCsv: w });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.coeffs.join(" : "),
          primaryLabel: "Reduced coefficients",
          rows: [
            { label: "Count", value: `${computed.coeffs.length}` },
            { label: "GCD scale", value: `${computed.gcd}` },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "stoichiometry" ? (
            <>
              <div>
                <FieldLabel htmlFor="cs-moles-r">Moles reactant</FieldLabel>
                <FieldInput id="cs-moles-r" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cs-coeff-r">Coeff reactant</FieldLabel>
                <FieldInput id="cs-coeff-r" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cs-coeff-p">Coeff product</FieldLabel>
                <FieldInput id="cs-coeff-p" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "limiting" ? (
            <>
              <div>
                <FieldLabel htmlFor="cs-moles-a">Moles A</FieldLabel>
                <FieldInput id="cs-moles-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cs-coeff-a">Coeff A</FieldLabel>
                <FieldInput id="cs-coeff-a" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cs-moles-b">Moles B</FieldLabel>
                <FieldInput id="cs-moles-b" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cs-coeff-b">Coeff B</FieldLabel>
                <FieldInput id="cs-coeff-b" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "theoretical" ? (
            <>
              <div>
                <FieldLabel htmlFor="cs-moles-lim">Moles limiting</FieldLabel>
                <FieldInput id="cs-moles-lim" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cs-coeff-lim">Coeff limiting</FieldLabel>
                <FieldInput id="cs-coeff-lim" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cs-coeff-prod">Coeff product</FieldLabel>
                <FieldInput id="cs-coeff-prod" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cs-mm-prod">Molar mass product (g/mol)</FieldLabel>
                <FieldInput id="cs-mm-prod" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "percent" ? (
            <>
              <div>
                <FieldLabel htmlFor="cs-actual">Actual yield</FieldLabel>
                <FieldInput id="cs-actual" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cs-theo">Theoretical yield</FieldLabel>
                <FieldInput id="cs-theo" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "actual" ? (
            <>
              <div>
                <FieldLabel htmlFor="cs-pct">Percent yield (%)</FieldLabel>
                <FieldInput id="cs-pct" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cs-theo2">Theoretical yield</FieldLabel>
                <FieldInput id="cs-theo2" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "ratio" ? (
            <>
              <div>
                <FieldLabel htmlFor="cs-ra">Moles A</FieldLabel>
                <FieldInput id="cs-ra" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cs-rb">Moles B</FieldLabel>
                <FieldInput id="cs-rb" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "balance" ? (
            <div>
              <FieldLabel htmlFor="cs-coeffs">Coefficients (CSV)</FieldLabel>
              <FieldInput id="cs-coeffs" value={w} onChange={(ev) => setW(ev.target.value)} />
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
