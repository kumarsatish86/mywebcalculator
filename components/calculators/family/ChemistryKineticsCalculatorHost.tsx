"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  CHEMISTRY_KINETICS_URL,
  arrhenius,
  halfLifeKinetics,
  rateConstant,
  reactionRate,
} from "@/lib/calculators/chemistryKinetics";

type KineticsSlug =
  | "reaction-rate-calculator"
  | "rate-constant-calculator"
  | "half-life-reaction-kinetics-calculator"
  | "arrhenius-equation-calculator";

type Mode = "rate" | "k" | "halfLife" | "arrhenius";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  kDefault: string;
  eDefault: string;
};

const CONFIG: Record<KineticsSlug, Config> = {
  "reaction-rate-calculator": {
    title: "Reaction rate",
    description: "Average rate magnitude |Δ[A]/Δt| between two concentration–time points.",
    mode: "rate",
    aDefault: "1",
    bDefault: "0.5",
    cDefault: "10",
    rDefault: "",
    tDefault: "0",
    kDefault: "",
    eDefault: "",
  },
  "rate-constant-calculator": {
    title: "Rate constant",
    description: "First- or second-order integrated rate law for k. Default order: 1.",
    mode: "k",
    aDefault: "1",
    bDefault: "0.5",
    cDefault: "",
    rDefault: "1",
    tDefault: "10",
    kDefault: "",
    eDefault: "",
  },
  "half-life-reaction-kinetics-calculator": {
    title: "Half-life (kinetics)",
    description: "t½ = ln2/k (1st order) or 1/(k[A]₀) (2nd). Default order: 1.",
    mode: "halfLife",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    rDefault: "1",
    tDefault: "",
    kDefault: "0.0693",
    eDefault: "",
  },
  "arrhenius-equation-calculator": {
    title: "Arrhenius equation",
    description: "Mode forward: k = A e^(−Ea/RT). Mode ea: Ea from two (T,k) points. Default: forward.",
    mode: "arrhenius",
    aDefault: "1e10",
    bDefault: "",
    cDefault: "",
    rDefault: "forward",
    tDefault: "300",
    kDefault: "",
    eDefault: "50000",
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

function parseOrder(raw: string): 1 | 2 | { error: string } {
  const t = raw.trim();
  if (t === "" || t === "1") return 1;
  if (t === "2") return 2;
  return { error: "Order: enter 1 or 2." };
}

function parseArrheniusMode(raw: string): "forward" | "ea" | { error: string } {
  const t = raw.trim().toLowerCase();
  if (t === "" || t === "forward") return "forward";
  if (t === "ea") return "ea";
  return { error: "Mode: enter forward or ea." };
}

export function ChemistryKineticsCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as KineticsSlug] ?? CONFIG["reaction-rate-calculator"];
  const [a, setA] = useState(useLoanInitialInput(CHEMISTRY_KINETICS_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CHEMISTRY_KINETICS_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CHEMISTRY_KINETICS_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(CHEMISTRY_KINETICS_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(CHEMISTRY_KINETICS_URL.T, config.tDefault));
  const [k, setK] = useState(useLoanInitialInput(CHEMISTRY_KINETICS_URL.K, config.kDefault));
  const [e, setE] = useState(useLoanInitialInput(CHEMISTRY_KINETICS_URL.E, config.eDefault));

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
      case "rate":
        put(CHEMISTRY_KINETICS_URL.A, a);
        put(CHEMISTRY_KINETICS_URL.B, b);
        put(CHEMISTRY_KINETICS_URL.T, t);
        put(CHEMISTRY_KINETICS_URL.C, c);
        break;
      case "k":
        put(CHEMISTRY_KINETICS_URL.R, r);
        put(CHEMISTRY_KINETICS_URL.A, a);
        put(CHEMISTRY_KINETICS_URL.B, b);
        put(CHEMISTRY_KINETICS_URL.T, t);
        break;
      case "halfLife":
        put(CHEMISTRY_KINETICS_URL.R, r);
        put(CHEMISTRY_KINETICS_URL.K, k);
        put(CHEMISTRY_KINETICS_URL.A, a);
        break;
      case "arrhenius":
        put(CHEMISTRY_KINETICS_URL.R, r);
        put(CHEMISTRY_KINETICS_URL.A, a);
        put(CHEMISTRY_KINETICS_URL.B, b);
        put(CHEMISTRY_KINETICS_URL.C, c);
        put(CHEMISTRY_KINETICS_URL.T, t);
        put(CHEMISTRY_KINETICS_URL.K, k);
        put(CHEMISTRY_KINETICS_URL.E, e);
        break;
    }
    return out;
  }, [a, b, c, r, t, k, e, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t, k, e]);

  const arrMode = parseArrheniusMode(r || "forward");
  const orderHint = (r || "1").trim() || "1";

  const result = useMemo(() => {
    switch (config.mode) {
      case "rate": {
        const c1 = parseNonNegative(a, "[A]₁");
        const c2 = parseNonNegative(b, "[A]₂");
        const t1 = parseNonNegative(t, "t₁");
        const t2 = parseNonNegative(c, "t₂");
        if (!c1.ok) return { error: c1.error };
        if (!c2.ok) return { error: c2.error };
        if (!t1.ok) return { error: t1.error };
        if (!t2.ok) return { error: t2.error };
        const computed = reactionRate({
          conc1: c1.value,
          conc2: c2.value,
          t1: t1.value,
          t2: t2.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.rate),
          primaryLabel: "Average rate |Δ[A]/Δt|",
          rows: [
            { label: "[A]₁", value: num(c1.value) },
            { label: "[A]₂", value: num(c2.value) },
            { label: "t₁", value: num(t1.value) },
            { label: "t₂", value: num(t2.value) },
          ],
        };
      }
      case "k": {
        const order = parseOrder(r || "1");
        if (typeof order === "object") return { error: order.error };
        const a0 = parsePositive(a, "[A]₀");
        const aT = parsePositive(b, "[A]");
        const time = parsePositive(t, "Time t");
        if (!a0.ok) return { error: a0.error };
        if (!aT.ok) return { error: aT.error };
        if (!time.ok) return { error: time.error };
        const computed = rateConstant({
          order,
          a0: a0.value,
          a: aT.value,
          t: time.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.k),
          primaryLabel: "Rate constant k",
          rows: [
            { label: "Order", value: `${order}` },
            { label: "[A]₀", value: num(a0.value) },
            { label: "[A]", value: num(aT.value) },
            { label: "t", value: num(time.value) },
          ],
        };
      }
      case "halfLife": {
        const order = parseOrder(r || "1");
        if (typeof order === "object") return { error: order.error };
        const kP = parsePositive(k, "Rate constant k");
        if (!kP.ok) return { error: kP.error };
        if (order === 1) {
          const computed = halfLifeKinetics({ order: 1, k: kP.value });
          if ("error" in computed) return { error: computed.error };
          return {
            primary: num(computed.halfLife),
            primaryLabel: "Half-life t½",
            rows: [
              { label: "Order", value: "1" },
              { label: "k", value: num(kP.value) },
            ],
          };
        }
        const a0 = parsePositive(a, "[A]₀");
        if (!a0.ok) return { error: a0.error };
        const computed = halfLifeKinetics({ order: 2, k: kP.value, a0: a0.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.halfLife),
          primaryLabel: "Half-life t½",
          rows: [
            { label: "Order", value: "2" },
            { label: "k", value: num(kP.value) },
            { label: "[A]₀", value: num(a0.value) },
          ],
        };
      }
      case "arrhenius": {
        const mode = parseArrheniusMode(r || "forward");
        if (typeof mode === "object") return { error: mode.error };
        if (mode === "forward") {
          const aFactor = parsePositive(a, "Pre-exponential A");
          const eaJ = parseNonNegative(e, "Ea (J/mol)");
          const tK = parsePositive(t, "T (K)");
          if (!aFactor.ok) return { error: aFactor.error };
          if (!eaJ.ok) return { error: eaJ.error };
          if (!tK.ok) return { error: tK.error };
          const computed = arrhenius({
            mode: "forward",
            aFactor: aFactor.value,
            eaJ: eaJ.value,
            tK: tK.value,
          });
          if ("error" in computed) return { error: computed.error };
          return {
            primary: num(computed.k ?? NaN),
            primaryLabel: "Rate constant k",
            rows: [
              { label: "Mode", value: "forward" },
              { label: "A", value: num(aFactor.value) },
              { label: "Ea", value: `${num(eaJ.value)} J/mol` },
              { label: "T", value: `${num(tK.value)} K` },
            ],
          };
        }
        const k1 = parsePositive(k, "k₁");
        const t1 = parsePositive(b, "T₁ (K)");
        const k2 = parsePositive(c, "k₂");
        const t2 = parsePositive(t, "T₂ (K)");
        if (!k1.ok) return { error: k1.error };
        if (!t1.ok) return { error: t1.error };
        if (!k2.ok) return { error: k2.error };
        if (!t2.ok) return { error: t2.error };
        const computed = arrhenius({
          mode: "ea",
          k1: k1.value,
          t1K: t1.value,
          k2: k2.value,
          t2K: t2.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.eaJ ?? NaN)} J/mol`,
          primaryLabel: "Activation energy Ea",
          rows: [
            { label: "Mode", value: "ea" },
            { label: "k₁", value: num(k1.value) },
            { label: "T₁", value: `${num(t1.value)} K` },
            { label: "k₂", value: num(k2.value) },
            { label: "T₂", value: `${num(t2.value)} K` },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, k, e]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "rate" ? (
            <>
              <div>
                <FieldLabel htmlFor="ck-c1">[A]₁</FieldLabel>
                <FieldInput id="ck-c1" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ck-c2">[A]₂</FieldLabel>
                <FieldInput id="ck-c2" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ck-t1">t₁</FieldLabel>
                <FieldInput id="ck-t1" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ck-t2">t₂</FieldLabel>
                <FieldInput id="ck-t2" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "k" ? (
            <>
              <div>
                <FieldLabel htmlFor="ck-order">Order (1 / 2)</FieldLabel>
                <FieldInput id="ck-order" value={r} onChange={(ev) => setR(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="ck-a0">[A]₀</FieldLabel>
                <FieldInput id="ck-a0" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ck-a">[A] at time t</FieldLabel>
                <FieldInput id="ck-a" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ck-t">Time t</FieldLabel>
                <FieldInput id="ck-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "halfLife" ? (
            <>
              <div>
                <FieldLabel htmlFor="ck-hl-order">Order (1 / 2)</FieldLabel>
                <FieldInput id="ck-hl-order" value={r} onChange={(ev) => setR(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="ck-hl-k">Rate constant k</FieldLabel>
                <FieldInput id="ck-hl-k" value={k} onChange={(ev) => setK(ev.target.value)} inputMode="decimal" />
              </div>
              {orderHint === "2" ? (
                <div>
                  <FieldLabel htmlFor="ck-hl-a0">[A]₀ (2nd order)</FieldLabel>
                  <FieldInput id="ck-hl-a0" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
                </div>
              ) : null}
            </>
          ) : null}

          {config.mode === "arrhenius" ? (
            <>
              <div>
                <FieldLabel htmlFor="ck-ar-mode">Mode (forward / ea)</FieldLabel>
                <FieldInput id="ck-ar-mode" value={r} onChange={(ev) => setR(ev.target.value)} />
              </div>
              {typeof arrMode === "string" && arrMode === "ea" ? (
                <>
                  <div>
                    <FieldLabel htmlFor="ck-k1">k₁</FieldLabel>
                    <FieldInput id="ck-k1" value={k} onChange={(ev) => setK(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="ck-t1k">T₁ (K)</FieldLabel>
                    <FieldInput id="ck-t1k" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="ck-k2">k₂</FieldLabel>
                    <FieldInput id="ck-k2" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="ck-t2k">T₂ (K)</FieldLabel>
                    <FieldInput id="ck-t2k" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <FieldLabel htmlFor="ck-afactor">Pre-exponential A</FieldLabel>
                    <FieldInput
                      id="ck-afactor"
                      value={a}
                      onChange={(ev) => setA(ev.target.value)}
                      inputMode="decimal"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="ck-ea">Ea (J/mol)</FieldLabel>
                    <FieldInput id="ck-ea" value={e} onChange={(ev) => setE(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="ck-tk">T (K)</FieldLabel>
                    <FieldInput id="ck-tk" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
                  </div>
                </>
              )}
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
