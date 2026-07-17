"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import {
  CHEMISTRY_SOLID_URL,
  crystalStructure,
  densitySolidState,
  packingEfficiency,
  unitCell,
} from "@/lib/calculators/chemistrySolidState";

type SolidSlug =
  | "density-calculator-solid-state"
  | "unit-cell-calculator"
  | "packing-efficiency-calculator"
  | "crystal-structure-calculator";

type Mode = "density" | "unitCell" | "packing" | "crystal";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  rDefault: string;
  zDefault: string;
  mDefault: string;
};

const CONFIG: Record<SolidSlug, Config> = {
  "density-calculator-solid-state": {
    title: "Solid-state density",
    description: "ρ = (Z × M) / (N_A × a³) with edge a in cm and M in g/mol → g/cm³.",
    mode: "density",
    aDefault: "3.5e-8",
    bDefault: "",
    rDefault: "",
    zDefault: "4",
    mDefault: "58.7",
  },
  "unit-cell-calculator": {
    title: "Unit cell",
    description: "Default mode volume: V = a³. Mode edgeFromDensity solves a from ρ, Z, M.",
    mode: "unitCell",
    aDefault: "2",
    bDefault: "",
    rDefault: "volume",
    zDefault: "",
    mDefault: "",
  },
  "packing-efficiency-calculator": {
    title: "Packing efficiency",
    description: "Ideal hard-sphere packing % for sc, bcc, or fcc (type in text field).",
    mode: "packing",
    aDefault: "fcc",
    bDefault: "",
    rDefault: "",
    zDefault: "",
    mDefault: "",
  },
  "crystal-structure-calculator": {
    title: "Crystal structure",
    description: "Z, nearest-neighbor distance, and packing % for sc / bcc / fcc with edge a.",
    mode: "crystal",
    aDefault: "fcc",
    bDefault: "3.5e-8",
    rDefault: "",
    zDefault: "",
    mDefault: "",
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

function parseLatticeType(raw: string): "sc" | "bcc" | "fcc" | { error: string } {
  const t = raw.trim().toLowerCase();
  if (t === "sc" || t === "bcc" || t === "fcc") return t;
  return { error: "Type: enter sc, bcc, or fcc." };
}

function parseUnitCellMode(raw: string): "volume" | "edgeFromDensity" | { error: string } {
  const t = raw.trim().toLowerCase();
  if (t === "" || t === "volume") return "volume";
  if (t === "edgefromdensity") return "edgeFromDensity";
  return { error: "Mode: enter volume or edgeFromDensity." };
}

export function ChemistrySolidStateCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as SolidSlug] ?? CONFIG["density-calculator-solid-state"];
  const [a, setA] = useState(useLoanInitialInput(CHEMISTRY_SOLID_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CHEMISTRY_SOLID_URL.B, config.bDefault));
  const [r, setR] = useState(useLoanInitialInput(CHEMISTRY_SOLID_URL.R, config.rDefault));
  const [z, setZ] = useState(useLoanInitialInput(CHEMISTRY_SOLID_URL.Z, config.zDefault));
  const [m, setM] = useState(useLoanInitialInput(CHEMISTRY_SOLID_URL.M, config.mDefault));

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
      case "density":
        put(CHEMISTRY_SOLID_URL.Z, z);
        put(CHEMISTRY_SOLID_URL.M, m);
        put(CHEMISTRY_SOLID_URL.A, a);
        break;
      case "unitCell":
        put(CHEMISTRY_SOLID_URL.R, r);
        put(CHEMISTRY_SOLID_URL.A, a);
        put(CHEMISTRY_SOLID_URL.B, b);
        put(CHEMISTRY_SOLID_URL.Z, z);
        put(CHEMISTRY_SOLID_URL.M, m);
        break;
      case "packing":
        put(CHEMISTRY_SOLID_URL.A, a);
        break;
      case "crystal":
        put(CHEMISTRY_SOLID_URL.A, a);
        put(CHEMISTRY_SOLID_URL.B, b);
        break;
    }
    return out;
  }, [a, b, r, z, m, config.mode]);

  useLoanUrlSync(shareParams, [a, b, r, z, m]);

  const unitMode = parseUnitCellMode(r || "volume");

  const result = useMemo(() => {
    switch (config.mode) {
      case "density": {
        const zP = parsePositive(z, "Z");
        const mP = parsePositive(m, "Molar mass M");
        const edge = parsePositive(a, "Edge a (cm)");
        if (!zP.ok) return { error: zP.error };
        if (!mP.ok) return { error: mP.error };
        if (!edge.ok) return { error: edge.error };
        const computed = densitySolidState({
          z: zP.value,
          molarMass: mP.value,
          edgeCm: edge.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.density)} g/cm³`,
          primaryLabel: "Density ρ",
          rows: [
            { label: "Z", value: num(zP.value, 0) },
            { label: "M", value: `${num(mP.value)} g/mol` },
            { label: "a", value: `${num(edge.value)} cm` },
          ],
        };
      }
      case "unitCell": {
        const mode = parseUnitCellMode(r || "volume");
        if (typeof mode === "object") return { error: mode.error };
        if (mode === "volume") {
          const edge = parsePositive(a, "Edge a (cm)");
          if (!edge.ok) return { error: edge.error };
          const computed = unitCell({ mode: "volume", edgeCm: edge.value });
          if ("error" in computed) return { error: computed.error };
          return {
            primary: `${num(computed.volumeCm3 ?? NaN)} cm³`,
            primaryLabel: "Unit-cell volume",
            rows: [
              { label: "Mode", value: "volume" },
              { label: "a", value: `${num(edge.value)} cm` },
            ],
          };
        }
        const zP = parsePositive(z, "Z");
        const mP = parsePositive(m, "Molar mass M");
        const dens = parsePositive(b, "Density");
        if (!zP.ok) return { error: zP.error };
        if (!mP.ok) return { error: mP.error };
        if (!dens.ok) return { error: dens.error };
        const computed = unitCell({
          mode: "edgeFromDensity",
          z: zP.value,
          molarMass: mP.value,
          density: dens.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.edgeCm ?? NaN)} cm`,
          primaryLabel: "Edge length a",
          rows: [
            { label: "Mode", value: "edgeFromDensity" },
            { label: "Volume", value: `${num(computed.volumeCm3 ?? NaN)} cm³` },
            { label: "Z", value: num(zP.value, 0) },
            { label: "M", value: num(mP.value) },
            { label: "ρ", value: num(dens.value) },
          ],
        };
      }
      case "packing": {
        const type = parseLatticeType(a);
        if (typeof type === "object") return { error: type.error };
        const computed = packingEfficiency({ type });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.percent, 2)} %`,
          primaryLabel: "Packing efficiency",
          rows: [
            { label: "Type", value: type },
            { label: "Z", value: `${computed.z}` },
          ],
        };
      }
      case "crystal": {
        const type = parseLatticeType(a);
        if (typeof type === "object") return { error: type.error };
        const edge = parsePositive(b, "Edge a (cm)");
        if (!edge.ok) return { error: edge.error };
        const computed = crystalStructure({ type, edgeCm: edge.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.packingPercent, 2)} % packing`,
          primaryLabel: `${type.toUpperCase()} structure`,
          rows: [
            { label: "Z / atoms per cell", value: `${computed.atomsPerCell}` },
            { label: "Nearest neighbor", value: num(computed.nearestNeighbor) },
            { label: "Edge a", value: `${num(edge.value)} cm` },
          ],
        };
      }
    }
  }, [config.mode, a, b, r, z, m]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "density" ? (
            <>
              <div>
                <FieldLabel htmlFor="css-z">Z (formula units / cell)</FieldLabel>
                <FieldInput id="css-z" value={z} onChange={(ev) => setZ(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="css-m">Molar mass M (g/mol)</FieldLabel>
                <FieldInput id="css-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="css-a">Edge a (cm)</FieldLabel>
                <FieldInput id="css-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "unitCell" ? (
            <>
              <div>
                <FieldLabel htmlFor="css-uc-mode">Mode (volume / edgeFromDensity)</FieldLabel>
                <FieldInput id="css-uc-mode" value={r} onChange={(ev) => setR(ev.target.value)} />
              </div>
              {typeof unitMode === "string" && unitMode === "edgeFromDensity" ? (
                <>
                  <div>
                    <FieldLabel htmlFor="css-uc-z">Z</FieldLabel>
                    <FieldInput id="css-uc-z" value={z} onChange={(ev) => setZ(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="css-uc-m">Molar mass M (g/mol)</FieldLabel>
                    <FieldInput id="css-uc-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" />
                  </div>
                  <div>
                    <FieldLabel htmlFor="css-uc-d">Density ρ (g/cm³)</FieldLabel>
                    <FieldInput id="css-uc-d" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
                  </div>
                </>
              ) : (
                <div>
                  <FieldLabel htmlFor="css-uc-a">Edge a (cm)</FieldLabel>
                  <FieldInput id="css-uc-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
                </div>
              )}
            </>
          ) : null}

          {config.mode === "packing" ? (
            <div>
              <FieldLabel htmlFor="css-pack-type">Lattice type (sc / bcc / fcc)</FieldLabel>
              <FieldInput id="css-pack-type" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "crystal" ? (
            <>
              <div>
                <FieldLabel htmlFor="css-cr-type">Lattice type (sc / bcc / fcc)</FieldLabel>
                <FieldInput id="css-cr-type" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="css-cr-a">Edge a (cm)</FieldLabel>
                <FieldInput id="css-cr-a" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
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
