"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  CHEMISTRY_INDUSTRIAL_URL,
  conversionEfficiency,
  materialBalance,
  processYield,
  reactorVolume,
} from "@/lib/calculators/chemistryIndustrial";

type IndustrialSlug =
  | "chemical-process-yield-calculator"
  | "reactor-volume-calculator"
  | "conversion-efficiency-calculator"
  | "material-balance-calculator";

type Mode = "yield" | "reactor" | "conversion" | "material";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  wDefault: string;
};

const CONFIG: Record<IndustrialSlug, Config> = {
  "chemical-process-yield-calculator": {
    title: "Process yield",
    description: "Percent yield = (actual / theoretical) × 100. Educational process math.",
    mode: "yield",
    aDefault: "80",
    bDefault: "100",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    wDefault: "",
  },
  "reactor-volume-calculator": {
    title: "Reactor volume",
    description: "V = F × τ (mode tau) or V = F / SV (mode sv). Default mode: tau.",
    mode: "reactor",
    aDefault: "0.01",
    bDefault: "0.5",
    cDefault: "",
    rDefault: "tau",
    tDefault: "100",
    wDefault: "",
  },
  "conversion-efficiency-calculator": {
    title: "Conversion efficiency",
    description: "Conversion = reacted / fed. Educational reactor-conversion math.",
    mode: "conversion",
    aDefault: "40",
    bDefault: "50",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    wDefault: "",
  },
  "material-balance-calculator": {
    title: "Material balance",
    description: "Accumulation = in − out − consumed + generated. Educational steady-state check.",
    mode: "material",
    aDefault: "10",
    bDefault: "8",
    cDefault: "2",
    rDefault: "",
    tDefault: "",
    wDefault: "0",
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

function parseReactorMode(raw: string): "tau" | "sv" | { error: string } {
  const t = raw.trim().toLowerCase();
  if (t === "tau" || t === "sv") return t;
  return { error: "Mode: enter tau or sv." };
}

export function ChemistryIndustrialCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as IndustrialSlug] ?? CONFIG["chemical-process-yield-calculator"];
  const [a, setA] = useState(useLoanInitialInput(CHEMISTRY_INDUSTRIAL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CHEMISTRY_INDUSTRIAL_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CHEMISTRY_INDUSTRIAL_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(CHEMISTRY_INDUSTRIAL_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(CHEMISTRY_INDUSTRIAL_URL.T, config.tDefault));
  const [w, setW] = useState(useLoanInitialInput(CHEMISTRY_INDUSTRIAL_URL.W, config.wDefault));

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
      case "yield":
      case "conversion":
        put(CHEMISTRY_INDUSTRIAL_URL.A, a);
        put(CHEMISTRY_INDUSTRIAL_URL.B, b);
        break;
      case "reactor":
        put(CHEMISTRY_INDUSTRIAL_URL.A, a);
        put(CHEMISTRY_INDUSTRIAL_URL.B, b);
        put(CHEMISTRY_INDUSTRIAL_URL.R, r);
        put(CHEMISTRY_INDUSTRIAL_URL.T, t);
        break;
      case "material":
        put(CHEMISTRY_INDUSTRIAL_URL.A, a);
        put(CHEMISTRY_INDUSTRIAL_URL.B, b);
        put(CHEMISTRY_INDUSTRIAL_URL.C, c);
        put(CHEMISTRY_INDUSTRIAL_URL.W, w);
        break;
    }
    return out;
  }, [a, b, c, r, t, w, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t, w]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "yield": {
        const actual = parseNonNegative(a, "Actual amount");
        const theoretical = parsePositive(b, "Theoretical amount");
        if (!actual.ok) return { error: actual.error };
        if (!theoretical.ok) return { error: theoretical.error };
        const computed = processYield({ actual: actual.value, theoretical: theoretical.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.percent, 2)} %`,
          primaryLabel: "Process yield",
          rows: [
            { label: "Actual", value: num(actual.value) },
            { label: "Theoretical", value: num(theoretical.value) },
          ],
        };
      }
      case "reactor": {
        const mode = parseReactorMode(r || "tau");
        if (typeof mode === "object") return { error: mode.error };
        const flow = parseNonNegative(a, "Flow (m³/s)");
        if (!flow.ok) return { error: flow.error };
        if (mode === "tau") {
          const tau = parseNonNegative(t, "Residence time τ (s)");
          if (!tau.ok) return { error: tau.error };
          const computed = reactorVolume({ mode: "tau", flowM3s: flow.value, tauS: tau.value });
          if ("error" in computed) return { error: computed.error };
          return {
            primary: `${num(computed.volumeM3)} m³`,
            primaryLabel: "Reactor volume",
            rows: [
              { label: "Mode", value: "tau" },
              { label: "Flow", value: `${num(flow.value)} m³/s` },
              { label: "τ", value: `${num(tau.value)} s` },
            ],
          };
        }
        const sv = parsePositive(b, "Space velocity");
        if (!sv.ok) return { error: sv.error };
        const computed = reactorVolume({
          mode: "sv",
          flowM3s: flow.value,
          spaceVelocity: sv.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.volumeM3)} m³`,
          primaryLabel: "Reactor volume",
          rows: [
            { label: "Mode", value: "sv" },
            { label: "Flow", value: `${num(flow.value)} m³/s` },
            { label: "Space velocity", value: num(sv.value) },
          ],
        };
      }
      case "conversion": {
        const reacted = parseNonNegative(a, "Reacted");
        const fed = parsePositive(b, "Fed");
        if (!reacted.ok) return { error: reacted.error };
        if (!fed.ok) return { error: fed.error };
        const computed = conversionEfficiency({ reacted: reacted.value, fed: fed.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.percent, 2)} %`,
          primaryLabel: "Conversion",
          rows: [
            { label: "Fraction", value: num(computed.conversion, 4) },
            { label: "Reacted", value: num(reacted.value) },
            { label: "Fed", value: num(fed.value) },
          ],
        };
      }
      case "material": {
        const inlet = parseNonNegative(a, "Inlet");
        const outlet = parseNonNegative(b, "Outlet");
        const consumed = parseNonNegative(c, "Consumed");
        const generated = parseNonNegative(w, "Generated");
        if (!inlet.ok) return { error: inlet.error };
        if (!outlet.ok) return { error: outlet.error };
        if (!consumed.ok) return { error: consumed.error };
        if (!generated.ok) return { error: generated.error };
        const computed = materialBalance({
          inlet: inlet.value,
          outlet: outlet.value,
          consumed: consumed.value,
          generated: generated.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.accumulation),
          primaryLabel: "Accumulation",
          rows: [
            { label: "Closed balance?", value: computed.closed ? "Yes" : "No" },
            { label: "Inlet", value: num(inlet.value) },
            { label: "Outlet", value: num(outlet.value) },
            { label: "Consumed", value: num(consumed.value) },
            { label: "Generated", value: num(generated.value) },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, w]);

  const reactorMode = (r || "tau").trim().toLowerCase();

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "yield" ? (
            <>
              <div>
                <FieldLabel htmlFor="ci-a">Actual amount</FieldLabel>
                <FieldInput id="ci-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ci-b">Theoretical amount</FieldLabel>
                <FieldInput id="ci-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "reactor" ? (
            <>
              <div>
                <FieldLabel htmlFor="ci-r">Mode (tau / sv)</FieldLabel>
                <FieldInput id="ci-r" value={r} onChange={(ev) => setR(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="ci-a">Volumetric flow (m³/s)</FieldLabel>
                <FieldInput id="ci-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              {reactorMode === "sv" ? (
                <div>
                  <FieldLabel htmlFor="ci-b">Space velocity (1/s)</FieldLabel>
                  <FieldInput id="ci-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
                </div>
              ) : (
                <div>
                  <FieldLabel htmlFor="ci-t">Residence time τ (s)</FieldLabel>
                  <FieldInput id="ci-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
                </div>
              )}
            </>
          ) : null}

          {config.mode === "conversion" ? (
            <>
              <div>
                <FieldLabel htmlFor="ci-a">Reacted amount</FieldLabel>
                <FieldInput id="ci-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ci-b">Fed amount</FieldLabel>
                <FieldInput id="ci-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "material" ? (
            <>
              <div>
                <FieldLabel htmlFor="ci-a">Inlet</FieldLabel>
                <FieldInput id="ci-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ci-b">Outlet</FieldLabel>
                <FieldInput id="ci-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ci-c">Consumed</FieldLabel>
                <FieldInput id="ci-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ci-w">Generated</FieldLabel>
                <FieldInput id="ci-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" />
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
