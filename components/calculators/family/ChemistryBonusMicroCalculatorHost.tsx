"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseFiniteNumber, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  CHEMISTRY_BONUS_URL,
  electronConfiguration,
  orbitalDiagram,
  oxidationState,
  periodicLookup,
  valencyFinder,
} from "@/lib/calculators/chemistryBonusMicro";

type BonusSlug =
  | "periodic-table-interactive-tool"
  | "valency-finder"
  | "oxidation-state-calculator"
  | "electron-configuration-calculator"
  | "orbital-diagram-generator";

type Mode = "periodic" | "valency" | "oxidation" | "electron" | "orbital";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  zDefault: string;
};

const CONFIG: Record<BonusSlug, Config> = {
  "periodic-table-interactive-tool": {
    title: "Periodic table lookup",
    description: "Look up common elements by atomic number or symbol (mini teaching table).",
    mode: "periodic",
    aDefault: "O",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    zDefault: "",
  },
  "valency-finder": {
    title: "Valency finder",
    description: "Simplified main-group valency heuristic from periodic group number.",
    mode: "valency",
    aDefault: "1",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    zDefault: "",
  },
  "oxidation-state-calculator": {
    title: "Oxidation state",
    description: "Solve unknown oxidation number from charge balance (classroom heuristic).",
    mode: "oxidation",
    aDefault: "-2",
    bDefault: "1",
    cDefault: "2",
    rDefault: "0",
    zDefault: "",
  },
  "electron-configuration-calculator": {
    title: "Electron configuration",
    description: "Aufbau-style configuration for Z = 1–36 (educational).",
    mode: "electron",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    zDefault: "6",
  },
  "orbital-diagram-generator": {
    title: "Orbital diagram",
    description: "Text orbital boxes from electron configuration (Z = 1–36).",
    mode: "orbital",
    aDefault: "",
    bDefault: "",
    cDefault: "",
    rDefault: "",
    zDefault: "6",
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

export function ChemistryBonusMicroCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as BonusSlug] ?? CONFIG["periodic-table-interactive-tool"];
  const [a, setA] = useState(useLoanInitialInput(CHEMISTRY_BONUS_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(CHEMISTRY_BONUS_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(CHEMISTRY_BONUS_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(CHEMISTRY_BONUS_URL.R, config.rDefault));
  const [z, setZ] = useState(useLoanInitialInput(CHEMISTRY_BONUS_URL.Z, config.zDefault));

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
      case "periodic":
      case "valency":
        put(CHEMISTRY_BONUS_URL.A, a);
        break;
      case "oxidation":
        put(CHEMISTRY_BONUS_URL.A, a);
        put(CHEMISTRY_BONUS_URL.B, b);
        put(CHEMISTRY_BONUS_URL.C, c);
        put(CHEMISTRY_BONUS_URL.R, r);
        break;
      case "electron":
      case "orbital":
        put(CHEMISTRY_BONUS_URL.Z, z);
        break;
    }
    return out;
  }, [a, b, c, r, z, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, z]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "periodic": {
        const computed = periodicLookup({ query: a });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${computed.symbol} (Z=${computed.z})`,
          primaryLabel: computed.name,
          rows: [
            { label: "Atomic number", value: `${computed.z}` },
            { label: "Symbol", value: computed.symbol },
            { label: "Group hint", value: computed.groupHint },
          ],
        };
      }
      case "valency": {
        const group = parsePositive(a, "Group");
        if (!group.ok) return { error: group.error };
        const computed = valencyFinder({ group: group.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.valency, 0)}`,
          primaryLabel: "Typical valency",
          rows: [
            { label: "Group", value: num(group.value, 0) },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "oxidation": {
        const oxKnown = parseFiniteNumber(a, "Known oxidation");
        const knownCount = parsePositive(b, "Known atom count");
        const unknownCount = parsePositive(c, "Unknown atom count");
        const charge = parseFiniteNumber(r, "Total charge");
        if (!oxKnown.ok) return { error: oxKnown.error };
        if (!knownCount.ok) return { error: knownCount.error };
        if (!unknownCount.ok) return { error: unknownCount.error };
        if (!charge.ok) return { error: charge.error };
        const computed = oxidationState({
          elementOxKnown: oxKnown.value,
          atomCountKnown: knownCount.value,
          atomCountUnknown: unknownCount.value,
          totalCharge: charge.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.oxUnknown, 3),
          primaryLabel: "Unknown oxidation state",
          rows: [
            { label: "Known ox × count", value: `${num(oxKnown.value)} × ${num(knownCount.value, 0)}` },
            { label: "Unknown count", value: num(unknownCount.value, 0) },
            { label: "Total charge", value: num(charge.value) },
          ],
        };
      }
      case "electron": {
        const zP = parsePositive(z, "Atomic number Z");
        if (!zP.ok) return { error: zP.error };
        const computed = electronConfiguration({ z: zP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.config,
          primaryLabel: "Electron configuration",
          rows: [
            { label: "Z", value: num(zP.value, 0) },
            { label: "Shells (n=1…)", value: computed.shells.join(", ") },
          ],
        };
      }
      case "orbital": {
        const zP = parsePositive(z, "Atomic number Z");
        if (!zP.ok) return { error: zP.error };
        const computed = orbitalDiagram({ z: zP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.lines[0] ?? "—",
          primaryLabel: "Orbital diagram (first orbital)",
          rows: computed.lines.map((line, i) => ({ label: `Line ${i + 1}`, value: line })),
        };
      }
    }
  }, [config.mode, a, b, c, r, z]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "periodic" ? (
            <div>
              <FieldLabel htmlFor="cbm-a">Atomic number or symbol</FieldLabel>
              <FieldInput id="cbm-a" value={a} onChange={(ev) => setA(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "valency" ? (
            <div>
              <FieldLabel htmlFor="cbm-a">Periodic group (1–18)</FieldLabel>
              <FieldInput id="cbm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "oxidation" ? (
            <>
              <div>
                <FieldLabel htmlFor="cbm-a">Known element oxidation</FieldLabel>
                <FieldInput id="cbm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cbm-b">Known atom count</FieldLabel>
                <FieldInput id="cbm-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cbm-c">Unknown atom count</FieldLabel>
                <FieldInput id="cbm-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="cbm-r">Total charge</FieldLabel>
                <FieldInput id="cbm-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "electron" || config.mode === "orbital" ? (
            <div>
              <FieldLabel htmlFor="cbm-z">Atomic number Z (1–36)</FieldLabel>
              <FieldInput id="cbm-z" value={z} onChange={(ev) => setZ(ev.target.value)} inputMode="numeric" />
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
