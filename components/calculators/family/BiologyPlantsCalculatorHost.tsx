"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  BIOLOGY_PLANTS_URL,
  cropYield,
  leafAreaIndex,
  photosynthesisRate,
  plantGrowthRate,
  transpirationRate,
} from "@/lib/calculators/biologyPlants";

type PlantsSlug =
  | "photosynthesis-rate-calculator"
  | "transpiration-rate-calculator"
  | "leaf-area-index-calculator"
  | "crop-yield-calculator"
  | "plant-growth-rate-calculator";

type Mode = "photosynthesis" | "transpiration" | "lai" | "yield" | "growth";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const CONFIG: Record<PlantsSlug, Config> = {
  "photosynthesis-rate-calculator": {
    title: "Photosynthesis rate",
    description: "Rate ≈ CO₂ assimilated / (leaf area × time).",
    mode: "photosynthesis",
    aDefault: "100",
    bDefault: "0.01",
    cDefault: "60",
  },
  "transpiration-rate-calculator": {
    title: "Transpiration rate",
    description: "Rate = water mass lost / (leaf area × time).",
    mode: "transpiration",
    aDefault: "0.05",
    bDefault: "0.01",
    cDefault: "3600",
  },
  "leaf-area-index-calculator": {
    title: "Leaf area index (LAI)",
    description: "LAI = total leaf area / ground area.",
    mode: "lai",
    aDefault: "4",
    bDefault: "1",
    cDefault: "",
  },
  "crop-yield-calculator": {
    title: "Crop yield",
    description: "Yield = harvest mass / area (kg/ha).",
    mode: "yield",
    aDefault: "5000",
    bDefault: "1",
    cDefault: "",
  },
  "plant-growth-rate-calculator": {
    title: "Plant growth rate (RGR)",
    description: "RGR ≈ (ln W₂ − ln W₁) / Δt.",
    mode: "growth",
    aDefault: "10",
    bDefault: "25",
    cDefault: "14",
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

export function BiologyPlantsCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as PlantsSlug] ?? CONFIG["photosynthesis-rate-calculator"];
  const [a, setA] = useState(useLoanInitialInput(BIOLOGY_PLANTS_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(BIOLOGY_PLANTS_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(BIOLOGY_PLANTS_URL.C, config.cDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    if (config.mode === "lai" || config.mode === "yield") {
      return { [BIOLOGY_PLANTS_URL.A]: a, [BIOLOGY_PLANTS_URL.B]: b };
    }
    return {
      [BIOLOGY_PLANTS_URL.A]: a,
      [BIOLOGY_PLANTS_URL.B]: b,
      [BIOLOGY_PLANTS_URL.C]: c,
    };
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "photosynthesis": {
        const co2P = parseNonNegative(a, "CO₂ (μmol)");
        const areaP = parsePositive(b, "Leaf area (m²)");
        const timeP = parsePositive(c, "Time (s)");
        if (!co2P.ok) return { error: co2P.error };
        if (!areaP.ok) return { error: areaP.error };
        if (!timeP.ok) return { error: timeP.error };
        const computed = photosynthesisRate({
          co2Umol: co2P.value,
          leafAreaM2: areaP.value,
          timeS: timeP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.rate)} μmol·m⁻²·s⁻¹`,
          primaryLabel: "Photosynthesis rate",
          rows: [
            { label: "CO₂", value: `${num(co2P.value)} μmol` },
            { label: "Leaf area", value: `${num(areaP.value)} m²` },
            { label: "Time", value: `${num(timeP.value)} s` },
          ],
        };
      }
      case "transpiration": {
        const waterP = parseNonNegative(a, "Water (kg)");
        const areaP = parsePositive(b, "Leaf area (m²)");
        const timeP = parsePositive(c, "Time (s)");
        if (!waterP.ok) return { error: waterP.error };
        if (!areaP.ok) return { error: areaP.error };
        if (!timeP.ok) return { error: timeP.error };
        const computed = transpirationRate({
          waterKg: waterP.value,
          leafAreaM2: areaP.value,
          timeS: timeP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.rate)} kg·m⁻²·s⁻¹`,
          primaryLabel: "Transpiration rate",
          rows: [
            { label: "Water lost", value: `${num(waterP.value)} kg` },
            { label: "Leaf area", value: `${num(areaP.value)} m²` },
            { label: "Time", value: `${num(timeP.value)} s` },
          ],
        };
      }
      case "lai": {
        const leafP = parseNonNegative(a, "Leaf area (m²)");
        const groundP = parsePositive(b, "Ground area (m²)");
        if (!leafP.ok) return { error: leafP.error };
        if (!groundP.ok) return { error: groundP.error };
        const computed = leafAreaIndex({
          leafAreaM2: leafP.value,
          groundAreaM2: groundP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.lai),
          primaryLabel: "LAI",
          rows: [
            { label: "Leaf area", value: `${num(leafP.value)} m²` },
            { label: "Ground area", value: `${num(groundP.value)} m²` },
          ],
        };
      }
      case "yield": {
        const harvestP = parseNonNegative(a, "Harvest (kg)");
        const areaP = parsePositive(b, "Area (ha)");
        if (!harvestP.ok) return { error: harvestP.error };
        if (!areaP.ok) return { error: areaP.error };
        const computed = cropYield({ harvestKg: harvestP.value, areaHa: areaP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.yieldKgHa)} kg/ha`,
          primaryLabel: "Yield",
          rows: [
            { label: "Harvest", value: `${num(harvestP.value)} kg` },
            { label: "Area", value: `${num(areaP.value)} ha` },
          ],
        };
      }
      case "growth": {
        const m1P = parsePositive(a, "Mass W₁");
        const m2P = parsePositive(b, "Mass W₂");
        const tP = parsePositive(c, "Time (days)");
        if (!m1P.ok) return { error: m1P.error };
        if (!m2P.ok) return { error: m2P.error };
        if (!tP.ok) return { error: tP.error };
        const computed = plantGrowthRate({
          mass1: m1P.value,
          mass2: m2P.value,
          timeDays: tP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.rgr)} day⁻¹`,
          primaryLabel: "Relative growth rate",
          rows: [
            { label: "W₁", value: num(m1P.value) },
            { label: "W₂", value: num(m2P.value) },
            { label: "Δt", value: `${num(tP.value)} days` },
          ],
        };
      }
    }
  }, [config.mode, a, b, c]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "photosynthesis" ? (
            <>
              <div>
                <FieldLabel htmlFor="bp-co2">CO₂ assimilated (μmol)</FieldLabel>
                <FieldInput id="bp-co2" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bp-area">Leaf area (m²)</FieldLabel>
                <FieldInput id="bp-area" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bp-time">Time (s)</FieldLabel>
                <FieldInput id="bp-time" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "transpiration" ? (
            <>
              <div>
                <FieldLabel htmlFor="bp-water">Water lost (kg)</FieldLabel>
                <FieldInput id="bp-water" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bp-tarea">Leaf area (m²)</FieldLabel>
                <FieldInput id="bp-tarea" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bp-ttime">Time (s)</FieldLabel>
                <FieldInput id="bp-ttime" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "lai" ? (
            <>
              <div>
                <FieldLabel htmlFor="bp-leaf">Total leaf area (m²)</FieldLabel>
                <FieldInput id="bp-leaf" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bp-ground">Ground area (m²)</FieldLabel>
                <FieldInput id="bp-ground" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "yield" ? (
            <>
              <div>
                <FieldLabel htmlFor="bp-harvest">Harvest mass (kg)</FieldLabel>
                <FieldInput id="bp-harvest" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bp-ha">Area (ha)</FieldLabel>
                <FieldInput id="bp-ha" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "growth" ? (
            <>
              <div>
                <FieldLabel htmlFor="bp-w1">Initial mass W₁</FieldLabel>
                <FieldInput id="bp-w1" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bp-w2">Final mass W₂</FieldLabel>
                <FieldInput id="bp-w2" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bp-days">Time (days)</FieldLabel>
                <FieldInput id="bp-days" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
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
