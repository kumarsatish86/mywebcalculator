"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  PHYSICS_WAVES_URL,
  dopplerEffect,
  frequencyFromWave,
  soundIntensity,
  waveSpeed,
  wavelength,
} from "@/lib/calculators/physicsWavesSound";

type WavesSlug =
  | "wave-speed-calculator"
  | "frequency-calculator-waves"
  | "wavelength-calculator"
  | "sound-intensity-calculator"
  | "doppler-effect-calculator";

type Mode = "waveSpeed" | "frequency" | "wavelength" | "intensity" | "doppler";

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

const CONFIG: Record<WavesSlug, Config> = {
  "wave-speed-calculator": {
    title: "Wave speed",
    description: "v = f λ from frequency and wavelength.",
    mode: "waveSpeed",
    aDefault: "440",
    bDefault: "0.78",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    wDefault: "",
  },
  "frequency-calculator-waves": {
    title: "Frequency from wave",
    description: "f = v / λ from wave speed and wavelength.",
    mode: "frequency",
    aDefault: "343",
    bDefault: "0.78",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    wDefault: "",
  },
  "wavelength-calculator": {
    title: "Wavelength",
    description: "λ = v / f from wave speed and frequency.",
    mode: "wavelength",
    aDefault: "343",
    bDefault: "440",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    wDefault: "",
  },
  "sound-intensity-calculator": {
    title: "Sound intensity",
    description: "I = P / A with level in dB re 10⁻¹² W/m².",
    mode: "intensity",
    aDefault: "0.001",
    bDefault: "1",
    cDefault: "",
    rDefault: "",
    tDefault: "",
    wDefault: "",
  },
  "doppler-effect-calculator": {
    title: "Doppler effect",
    description: "Heard frequency with moving observer/source (use 1/0 toward flags).",
    mode: "doppler",
    aDefault: "440",
    bDefault: "343",
    cDefault: "0",
    rDefault: "20",
    tDefault: "0",
    wDefault: "1",
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

export function PhysicsWavesSoundCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as WavesSlug] ?? CONFIG["wave-speed-calculator"];
  const [a, setA] = useState(useLoanInitialInput(PHYSICS_WAVES_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(PHYSICS_WAVES_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(PHYSICS_WAVES_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(PHYSICS_WAVES_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(PHYSICS_WAVES_URL.T, config.tDefault));
  const [w, setW] = useState(useLoanInitialInput("w", config.wDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    if (config.mode === "doppler") {
      return {
        [PHYSICS_WAVES_URL.A]: a,
        [PHYSICS_WAVES_URL.B]: b,
        [PHYSICS_WAVES_URL.C]: c,
        [PHYSICS_WAVES_URL.R]: r,
        [PHYSICS_WAVES_URL.T]: t,
        w,
      };
    }
    return {
      [PHYSICS_WAVES_URL.A]: a,
      [PHYSICS_WAVES_URL.B]: b,
    };
  }, [a, b, c, r, t, w, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t, w]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "waveSpeed": {
        const fP = parsePositive(a, "Frequency f");
        const lamP = parsePositive(b, "Wavelength λ");
        if (!fP.ok) return { error: fP.error };
        if (!lamP.ok) return { error: lamP.error };
        const computed = waveSpeed({ frequencyHz: fP.value, wavelengthM: lamP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.speedMs)} m/s`,
          primaryLabel: "Wave speed v",
          rows: [
            { label: "f", value: `${num(fP.value)} Hz` },
            { label: "λ", value: `${num(lamP.value)} m` },
          ],
        };
      }
      case "frequency": {
        const vP = parsePositive(a, "Speed v");
        const lamP = parsePositive(b, "Wavelength λ");
        if (!vP.ok) return { error: vP.error };
        if (!lamP.ok) return { error: lamP.error };
        const computed = frequencyFromWave({ speedMs: vP.value, wavelengthM: lamP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.frequencyHz)} Hz`,
          primaryLabel: "Frequency f",
          rows: [
            { label: "v", value: `${num(vP.value)} m/s` },
            { label: "λ", value: `${num(lamP.value)} m` },
          ],
        };
      }
      case "wavelength": {
        const vP = parsePositive(a, "Speed v");
        const fP = parsePositive(b, "Frequency f");
        if (!vP.ok) return { error: vP.error };
        if (!fP.ok) return { error: fP.error };
        const computed = wavelength({ speedMs: vP.value, frequencyHz: fP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.wavelengthM)} m`,
          primaryLabel: "Wavelength λ",
          rows: [
            { label: "v", value: `${num(vP.value)} m/s` },
            { label: "f", value: `${num(fP.value)} Hz` },
          ],
        };
      }
      case "intensity": {
        const pP = parseNonNegative(a, "Power");
        const areaP = parsePositive(b, "Area");
        if (!pP.ok) return { error: pP.error };
        if (!areaP.ok) return { error: areaP.error };
        const computed = soundIntensity({ powerW: pP.value, areaM2: areaP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.intensity)} W/m²`,
          primaryLabel: "Intensity I",
          rows: [
            { label: "Level", value: `${num(computed.db, 2)} dB` },
            { label: "Power", value: `${num(pP.value)} W` },
            { label: "Area", value: `${num(areaP.value)} m²` },
          ],
        };
      }
      case "doppler": {
        const f0P = parsePositive(a, "Source frequency f₀");
        const vsP = parsePositive(b, "Sound speed");
        const voP = parseNonNegative(c, "Observer speed");
        const vsrcP = parseNonNegative(r, "Source speed");
        if (!f0P.ok) return { error: f0P.error };
        if (!vsP.ok) return { error: vsP.error };
        if (!voP.ok) return { error: voP.error };
        if (!vsrcP.ok) return { error: vsrcP.error };
        const observerToward = t.trim() === "1";
        const sourceToward = w.trim() === "1";
        const computed = dopplerEffect({
          f0: f0P.value,
          vSound: vsP.value,
          vObserver: voP.value,
          vSource: vsrcP.value,
          observerToward,
          sourceToward,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.fHeard)} Hz`,
          primaryLabel: "Heard frequency f′",
          rows: [
            { label: "f₀", value: `${num(f0P.value)} Hz` },
            { label: "Observer toward", value: observerToward ? "yes (1)" : "no (0)" },
            { label: "Source toward", value: sourceToward ? "yes (1)" : "no (0)" },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "waveSpeed" ? (
            <>
              <div>
                <FieldLabel htmlFor="pw-f">Frequency f (Hz)</FieldLabel>
                <FieldInput id="pw-f" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pw-lam">Wavelength λ (m)</FieldLabel>
                <FieldInput id="pw-lam" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "frequency" ? (
            <>
              <div>
                <FieldLabel htmlFor="pw-v">Wave speed v (m/s)</FieldLabel>
                <FieldInput id="pw-v" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pw-flam">Wavelength λ (m)</FieldLabel>
                <FieldInput id="pw-flam" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "wavelength" ? (
            <>
              <div>
                <FieldLabel htmlFor="pw-wv">Wave speed v (m/s)</FieldLabel>
                <FieldInput id="pw-wv" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pw-wf">Frequency f (Hz)</FieldLabel>
                <FieldInput id="pw-wf" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "intensity" ? (
            <>
              <div>
                <FieldLabel htmlFor="pw-p">Acoustic power (W)</FieldLabel>
                <FieldInput id="pw-p" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pw-area">Area (m²)</FieldLabel>
                <FieldInput id="pw-area" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "doppler" ? (
            <>
              <div>
                <FieldLabel htmlFor="pw-f0">Source frequency f₀ (Hz)</FieldLabel>
                <FieldInput id="pw-f0" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pw-vs">Sound speed (m/s)</FieldLabel>
                <FieldInput id="pw-vs" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pw-vo">Observer speed (m/s)</FieldLabel>
                <FieldInput id="pw-vo" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pw-vsrc">Source speed (m/s)</FieldLabel>
                <FieldInput id="pw-vsrc" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="pw-ot">Observer toward source (1 = yes, 0 = no)</FieldLabel>
                <FieldInput id="pw-ot" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="numeric" />
              </div>
              <div>
                <FieldLabel htmlFor="pw-st">Source toward observer (1 = yes, 0 = no)</FieldLabel>
                <FieldInput id="pw-st" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="numeric" />
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
