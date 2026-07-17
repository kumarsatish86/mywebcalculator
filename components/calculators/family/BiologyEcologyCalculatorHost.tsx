"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  BIOLOGY_ECOLOGY_URL,
  biodiversityIndex,
  carbonFootprintBiology,
  carryingCapacity,
  ecologicalFootprint,
  populationGrowth,
} from "@/lib/calculators/biologyEcology";

type EcologySlug =
  | "population-growth-calculator"
  | "carrying-capacity-calculator"
  | "biodiversity-index-calculator"
  | "carbon-footprint-calculator-biology"
  | "ecological-footprint-calculator";

type Mode = "popGrowth" | "carrying" | "biodiversity" | "carbon" | "ecoFootprint";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  rDefault: string;
  tDefault: string;
  kDefault: string;
};

const CONFIG: Record<EcologySlug, Config> = {
  "population-growth-calculator": {
    title: "Population growth",
    description: "Exponential growth N = N₀ e^(rt). Educational ecology model — not a forecast.",
    mode: "popGrowth",
    aDefault: "100",
    bDefault: "",
    rDefault: "0.1",
    tDefault: "5",
    kDefault: "",
  },
  "carrying-capacity-calculator": {
    title: "Carrying capacity (logistic)",
    description: "Logistic N = K / (1 + ((K−N₀)/N₀) e^(−rt)). Classroom model only.",
    mode: "carrying",
    aDefault: "50",
    bDefault: "",
    rDefault: "0.2",
    tDefault: "10",
    kDefault: "500",
  },
  "biodiversity-index-calculator": {
    title: "Biodiversity index (Shannon)",
    description: "Shannon H′ from comma-separated species abundances. Educational diversity math.",
    mode: "biodiversity",
    aDefault: "40,25,20,15",
    bDefault: "",
    rDefault: "",
    tDefault: "",
    kDefault: "",
  },
  "carbon-footprint-calculator-biology": {
    title: "Carbon footprint (biology)",
    description: "Rough CO₂e from km driven + kWh using teaching factors — not a certified inventory.",
    mode: "carbon",
    aDefault: "100",
    bDefault: "200",
    rDefault: "",
    tDefault: "",
    kDefault: "",
  },
  "ecological-footprint-calculator": {
    title: "Ecological footprint",
    description: "Toy hectares from diet + travel scores (1–5). Classroom discussion only — not GFN methodology.",
    mode: "ecoFootprint",
    aDefault: "3",
    bDefault: "2",
    rDefault: "",
    tDefault: "",
    kDefault: "",
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

export function BiologyEcologyCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as EcologySlug] ?? CONFIG["population-growth-calculator"];
  const [a, setA] = useState(useLoanInitialInput(BIOLOGY_ECOLOGY_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(BIOLOGY_ECOLOGY_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(BIOLOGY_ECOLOGY_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(BIOLOGY_ECOLOGY_URL.T, config.tDefault));
  const [k, setK] = useState(useLoanInitialInput(BIOLOGY_ECOLOGY_URL.K, config.kDefault));

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
      case "popGrowth":
        put(BIOLOGY_ECOLOGY_URL.A, a);
        put(BIOLOGY_ECOLOGY_URL.R, r);
        put(BIOLOGY_ECOLOGY_URL.T, t);
        break;
      case "carrying":
        put(BIOLOGY_ECOLOGY_URL.A, a);
        put(BIOLOGY_ECOLOGY_URL.K, k);
        put(BIOLOGY_ECOLOGY_URL.R, r);
        put(BIOLOGY_ECOLOGY_URL.T, t);
        break;
      case "biodiversity":
        put(BIOLOGY_ECOLOGY_URL.A, a);
        break;
      case "carbon":
      case "ecoFootprint":
        put(BIOLOGY_ECOLOGY_URL.A, a);
        put(BIOLOGY_ECOLOGY_URL.B, b);
        break;
    }
    return out;
  }, [a, b, r, t, k, config.mode]);

  useLoanUrlSync(shareParams, [a, b, r, t, k]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "popGrowth": {
        const n0 = parsePositive(a, "N₀");
        const rate = parseFiniteNumber(r, "r");
        const time = parseNonNegative(t, "t");
        if (!n0.ok) return { error: n0.error };
        if (!rate.ok) return { error: rate.error };
        if (!time.ok) return { error: time.error };
        const computed = populationGrowth({ n0: n0.value, r: rate.value, t: time.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.n, 2),
          primaryLabel: "Population N",
          rows: [
            { label: "N₀", value: num(n0.value, 2) },
            { label: "r", value: num(rate.value, 4) },
            { label: "t", value: num(time.value, 2) },
          ],
        };
      }
      case "carrying": {
        const n0 = parsePositive(a, "N₀");
        const cap = parsePositive(k, "K");
        const rate = parseFiniteNumber(r, "r");
        const time = parseNonNegative(t, "t");
        if (!n0.ok) return { error: n0.error };
        if (!cap.ok) return { error: cap.error };
        if (!rate.ok) return { error: rate.error };
        if (!time.ok) return { error: time.error };
        const computed = carryingCapacity({
          n0: n0.value,
          k: cap.value,
          r: rate.value,
          t: time.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.n, 2),
          primaryLabel: "Population N",
          rows: [
            { label: "Remaining to K", value: num(computed.remaining, 2) },
            { label: "K", value: num(cap.value, 2) },
            { label: "N₀", value: num(n0.value, 2) },
            { label: "r", value: num(rate.value, 4) },
            { label: "t", value: num(time.value, 2) },
          ],
        };
      }
      case "biodiversity": {
        const computed = biodiversityIndex({ abundancesCsv: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.h, 4),
          primaryLabel: "Shannon H′",
          rows: [
            { label: "Richness (S)", value: num(computed.richness, 0) },
            { label: "Evenness (J′)", value: num(computed.evenness, 4) },
          ],
        };
      }
      case "carbon": {
        const km = parseNonNegative(a, "km");
        const kwh = parseNonNegative(b, "kWh");
        if (!km.ok) return { error: km.error };
        if (!kwh.ok) return { error: kwh.error };
        const computed = carbonFootprintBiology({ km: km.value, kwh: kwh.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.kgCo2e, 2)} kg CO₂e`,
          primaryLabel: "Estimated footprint",
          rows: [
            { label: "km driven", value: num(km.value, 1) },
            { label: "kWh", value: num(kwh.value, 1) },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "ecoFootprint": {
        const diet = parseFiniteNumber(a, "Diet score");
        const travel = parseFiniteNumber(b, "Travel score");
        if (!diet.ok) return { error: diet.error };
        if (!travel.ok) return { error: travel.error };
        const computed = ecologicalFootprint({
          dietScore: diet.value,
          travelScore: travel.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.hectares, 2)} ha`,
          primaryLabel: "Toy footprint",
          rows: [
            { label: "Diet score", value: num(diet.value, 0) },
            { label: "Travel score", value: num(travel.value, 0) },
            { label: "Note", value: computed.note },
          ],
        };
      }
    }
  }, [config.mode, a, b, r, t, k]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "popGrowth" ? (
            <>
              <div>
                <FieldLabel htmlFor="be-n0">N₀ (initial population)</FieldLabel>
                <FieldInput id="be-n0" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="be-r">Growth rate r</FieldLabel>
                <FieldInput id="be-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="be-t">Time t</FieldLabel>
                <FieldInput id="be-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "carrying" ? (
            <>
              <div>
                <FieldLabel htmlFor="be-n0c">N₀ (initial population)</FieldLabel>
                <FieldInput id="be-n0c" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="be-k">Carrying capacity K</FieldLabel>
                <FieldInput id="be-k" value={k} onChange={(ev) => setK(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="be-rc">Growth rate r</FieldLabel>
                <FieldInput id="be-rc" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="be-tc">Time t</FieldLabel>
                <FieldInput id="be-tc" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "biodiversity" ? (
            <div>
              <FieldLabel htmlFor="be-ab">Abundances (CSV)</FieldLabel>
              <FieldInput id="be-ab" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "carbon" ? (
            <>
              <div>
                <FieldLabel htmlFor="be-km">km driven</FieldLabel>
                <FieldInput id="be-km" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="be-kwh">Electricity (kWh)</FieldLabel>
                <FieldInput id="be-kwh" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "ecoFootprint" ? (
            <>
              <div>
                <FieldLabel htmlFor="be-diet">Diet score (1–5)</FieldLabel>
                <FieldInput id="be-diet" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="be-travel">Travel score (1–5)</FieldLabel>
                <FieldInput id="be-travel" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
