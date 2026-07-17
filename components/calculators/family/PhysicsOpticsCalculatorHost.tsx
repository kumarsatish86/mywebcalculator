"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  PHYSICS_OPTICS_URL,
  magnificationOptics,
  mirrorOrLensFormula,
  refractiveIndex,
  snellsLaw,
} from "@/lib/calculators/physicsOptics";

type OpticsSlug =
  | "snells-law-calculator"
  | "refractive-index-calculator"
  | "mirror-formula-calculator"
  | "lens-formula-calculator"
  | "magnification-calculator-optics";

type Mode = "snell" | "refractive" | "mirrorLens" | "magnification";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  refractiveMode?: "fromSpeed" | "fromAngles";
  magMode?: "fromUV" | "fromHeights";
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
};

const CONFIG: Record<OpticsSlug, Config> = {
  "snells-law-calculator": {
    title: "Snell’s law",
    description: "n₁ sin θ₁ = n₂ sin θ₂ — leave exactly one angle blank to solve.",
    mode: "snell",
    aDefault: "1",
    bDefault: "30",
    cDefault: "1.5",
    rDefault: "",
  },
  "refractive-index-calculator": {
    title: "Refractive index",
    description: "n = c / v from speed of light in the medium (SI).",
    mode: "refractive",
    refractiveMode: "fromSpeed",
    aDefault: "2e8",
    bDefault: "",
    cDefault: "",
    rDefault: "",
  },
  "mirror-formula-calculator": {
    title: "Mirror formula",
    description: "1/f = 1/v + 1/u — leave one of f, u, v blank (Cartesian signs).",
    mode: "mirrorLens",
    aDefault: "10",
    bDefault: "-30",
    cDefault: "",
    rDefault: "",
  },
  "lens-formula-calculator": {
    title: "Lens formula",
    description: "1/f = 1/v + 1/u — leave one of f, u, v blank (Cartesian signs).",
    mode: "mirrorLens",
    aDefault: "20",
    bDefault: "-40",
    cDefault: "",
    rDefault: "",
  },
  "magnification-calculator-optics": {
    title: "Magnification (optics)",
    description: "m = −v / u from object and image distances.",
    mode: "magnification",
    magMode: "fromUV",
    aDefault: "-30",
    bDefault: "60",
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

function optionalFinite(raw: string, label: string) {
  if (raw.trim() === "") return { ok: true as const, value: null as number | null };
  const p = parseFiniteNumber(raw, label);
  if (!p.ok) return p;
  return { ok: true as const, value: p.value as number | null };
}

export function PhysicsOpticsCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as OpticsSlug] ?? CONFIG["snells-law-calculator"];
  const [a, setA] = useState(useLoanInitialInput(PHYSICS_OPTICS_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(PHYSICS_OPTICS_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(PHYSICS_OPTICS_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(PHYSICS_OPTICS_URL.R, config.rDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    if (config.mode === "snell") {
      return {
        [PHYSICS_OPTICS_URL.A]: a,
        [PHYSICS_OPTICS_URL.B]: b,
        [PHYSICS_OPTICS_URL.C]: c,
        [PHYSICS_OPTICS_URL.R]: r,
      };
    }
    if (config.mode === "mirrorLens") {
      return {
        [PHYSICS_OPTICS_URL.A]: a,
        [PHYSICS_OPTICS_URL.B]: b,
        [PHYSICS_OPTICS_URL.C]: c,
      };
    }
    if (config.mode === "refractive") {
      return { [PHYSICS_OPTICS_URL.A]: a };
    }
    return {
      [PHYSICS_OPTICS_URL.A]: a,
      [PHYSICS_OPTICS_URL.B]: b,
    };
  }, [a, b, c, r, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "snell": {
        const n1P = parsePositive(a, "n₁");
        const th1P = optionalFinite(b, "θ₁ (°)");
        const n2P = parsePositive(c, "n₂");
        const th2P = optionalFinite(r, "θ₂ (°)");
        if (!n1P.ok) return { error: n1P.error };
        if (!th1P.ok) return { error: th1P.error };
        if (!n2P.ok) return { error: n2P.error };
        if (!th2P.ok) return { error: th2P.error };
        const computed = snellsLaw({
          n1: n1P.value,
          theta1Deg: th1P.value,
          n2: n2P.value,
          theta2Deg: th2P.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `θ₁ = ${num(computed.theta1Deg)}°, θ₂ = ${num(computed.theta2Deg)}°`,
          primaryLabel: "Angles",
          rows: [
            { label: "n₁", value: num(n1P.value) },
            { label: "n₂", value: num(n2P.value) },
            { label: "θ₁", value: `${num(computed.theta1Deg)}°` },
            { label: "θ₂", value: `${num(computed.theta2Deg)}°` },
          ],
        };
      }
      case "refractive": {
        const speedP = parsePositive(a, "Speed in medium (m/s)");
        if (!speedP.ok) return { error: speedP.error };
        const computed = refractiveIndex({
          mode: config.refractiveMode ?? "fromSpeed",
          speedMs: speedP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.n)}`,
          primaryLabel: "Refractive index n",
          rows: [{ label: "Speed", value: `${num(speedP.value)} m/s` }],
        };
      }
      case "mirrorLens": {
        const fP = optionalFinite(a, "f");
        const uP = optionalFinite(b, "u");
        const vP = optionalFinite(c, "v");
        if (!fP.ok) return { error: fP.error };
        if (!uP.ok) return { error: uP.error };
        if (!vP.ok) return { error: vP.error };
        const computed = mirrorOrLensFormula({ f: fP.value, u: uP.value, v: vP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `f = ${num(computed.f)}, u = ${num(computed.u)}, v = ${num(computed.v)}`,
          primaryLabel: "Solved distances",
          rows: [
            { label: "f", value: num(computed.f) },
            { label: "u", value: num(computed.u) },
            { label: "v", value: num(computed.v) },
          ],
        };
      }
      case "magnification": {
        const uP = parseFiniteNumber(a, "Object distance u");
        const vP = parseFiniteNumber(b, "Image distance v");
        if (!uP.ok) return { error: uP.error };
        if (!vP.ok) return { error: vP.error };
        const computed = magnificationOptics({
          mode: config.magMode ?? "fromUV",
          u: uP.value,
          v: vP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.m)}`,
          primaryLabel: "Magnification m",
          rows: [
            { label: "u", value: num(uP.value) },
            { label: "v", value: num(vP.value) },
          ],
        };
      }
    }
  }, [config.mode, config.refractiveMode, config.magMode, a, b, c, r]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "snell" ? (
            <>
              <div>
                <FieldLabel htmlFor="po-n1">n₁</FieldLabel>
                <FieldInput id="po-n1" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="po-th1">θ₁ (°, leave blank to solve)</FieldLabel>
                <FieldInput id="po-th1" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="po-n2">n₂</FieldLabel>
                <FieldInput id="po-n2" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="po-th2">θ₂ (°, leave blank to solve)</FieldLabel>
                <FieldInput id="po-th2" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "refractive" ? (
            <div>
              <FieldLabel htmlFor="po-speed">Speed in medium (m/s)</FieldLabel>
              <FieldInput id="po-speed" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "mirrorLens" ? (
            <>
              <div>
                <FieldLabel htmlFor="po-f">Focal length f (leave blank to solve)</FieldLabel>
                <FieldInput id="po-f" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="po-u">Object distance u (leave blank to solve)</FieldLabel>
                <FieldInput id="po-u" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="po-v">Image distance v (leave blank to solve)</FieldLabel>
                <FieldInput id="po-v" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "magnification" ? (
            <>
              <div>
                <FieldLabel htmlFor="po-mu">Object distance u</FieldLabel>
                <FieldInput id="po-mu" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="po-mv">Image distance v</FieldLabel>
                <FieldInput id="po-mv" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
