"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parsePositive } from "@/lib/calculators/loanInputParse";
import {
  BIOLOGY_MOLECULAR_URL,
  codonUsage,
  dnaRnaMolecularWeight,
  gcContent,
  primerMeltingTemperature,
  proteinMolecularWeight,
} from "@/lib/calculators/biologyMolecular";

type MolecularSlug =
  | "dna-rna-molecular-weight-calculator"
  | "primer-melting-temperature-tm-calculator"
  | "gc-content-calculator"
  | "codon-usage-calculator"
  | "protein-molecular-weight-calculator";

type Mode = "mw" | "tm" | "gc" | "codon" | "protein";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  sDefault: string;
};

const CONFIG: Record<MolecularSlug, Config> = {
  "dna-rna-molecular-weight-calculator": {
    title: "DNA / RNA molecular weight",
    description: "Approx. dsDNA ≈ length × 650 Da; ssRNA ≈ length × 320 Da. Educational only.",
    mode: "mw",
    aDefault: "1000",
    bDefault: "dsdna",
    sDefault: "",
  },
  "primer-melting-temperature-tm-calculator": {
    title: "Primer melting temperature (Tm)",
    description: "Wallace rule: Tm = 2(A+T) + 4(G+C) for short oligos. Educational only.",
    mode: "tm",
    aDefault: "",
    bDefault: "",
    sDefault: "ATGCGTACGT",
  },
  "gc-content-calculator": {
    title: "GC content",
    description: "Percent G+C bases in a DNA/RNA sequence. Educational sequence math.",
    mode: "gc",
    aDefault: "",
    bDefault: "",
    sDefault: "ATGCGCGTAA",
  },
  "codon-usage-calculator": {
    title: "Codon usage",
    description: "Count codons in a coding sequence (length multiple of 3). Educational only.",
    mode: "codon",
    aDefault: "",
    bDefault: "",
    sDefault: "ATGAAAGGCTAA",
  },
  "protein-molecular-weight-calculator": {
    title: "Protein molecular weight",
    description: "Approximate MW from 1-letter amino-acid codes. Educational teaching approx.",
    mode: "protein",
    aDefault: "",
    bDefault: "",
    sDefault: "MKTAYIAKQR",
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

export function BiologyMolecularCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as MolecularSlug] ?? CONFIG["dna-rna-molecular-weight-calculator"];
  const sInitial = useLoanInitialInput(BIOLOGY_MOLECULAR_URL.S, "");
  const aInitial = useLoanInitialInput(BIOLOGY_MOLECULAR_URL.A, config.aDefault);
  const [a, setA] = useState(aInitial);
  const [b, setB] = useState(useLoanInitialInput(BIOLOGY_MOLECULAR_URL.B, config.bDefault));
  const [s, setS] = useState(
    sInitial || (config.mode === "tm" && aInitial.trim() !== "" ? aInitial : config.sDefault),
  );

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
      case "mw":
        put(BIOLOGY_MOLECULAR_URL.A, a);
        put(BIOLOGY_MOLECULAR_URL.B, b);
        break;
      case "tm":
      case "gc":
      case "codon":
      case "protein":
        put(BIOLOGY_MOLECULAR_URL.S, s);
        break;
    }
    return out;
  }, [a, b, s, config.mode]);

  useLoanUrlSync(shareParams, [a, b, s]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "mw": {
        const len = parsePositive(a, "Length");
        if (!len.ok) return { error: len.error };
        const kindRaw = b.trim().toLowerCase();
        const kind = kindRaw.includes("rna") || kindRaw === "ssrna" ? "ssrna" : "dsdna";
        const computed = dnaRnaMolecularWeight({ length: len.value, kind });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.mwKda, 3)} kDa`,
          primaryLabel: "Approximate MW",
          rows: [
            { label: "MW", value: `${num(computed.mwDa, 0)} Da` },
            { label: "Length", value: `${num(len.value, 0)} nt` },
            { label: "Kind", value: kind },
          ],
        };
      }
      case "tm": {
        const computed = primerMeltingTemperature({ sequence: s });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.tmC, 1)} °C`,
          primaryLabel: "Wallace Tm",
          rows: [
            { label: "Length", value: `${computed.length} nt` },
            { label: "GC%", value: `${num(computed.gcPct, 1)}%` },
          ],
        };
      }
      case "gc": {
        const computed = gcContent({ sequence: s });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.gcPct, 2)}%`,
          primaryLabel: "GC content",
          rows: [
            { label: "Length", value: `${computed.length} nt` },
            { label: "G+C count", value: `${computed.gcCount}` },
          ],
        };
      }
      case "codon": {
        const computed = codonUsage({ sequence: s });
        if ("error" in computed) return { error: computed.error };
        const top = Object.entries(computed.codonCounts)
          .sort((x, y) => y[1] - x[1] || x[0].localeCompare(y[0]))
          .slice(0, 8)
          .map(([codon, count]) => ({ label: codon, value: `${count}` }));
        return {
          primary: `${computed.totalCodons} codons`,
          primaryLabel: "Total codons",
          rows: top.length ? top : [{ label: "Codons", value: "—" }],
        };
      }
      case "protein": {
        const computed = proteinMolecularWeight({ sequence: s });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.mwDa, 2)} Da`,
          primaryLabel: "Approximate MW",
          rows: [
            { label: "Residues", value: `${computed.residues}` },
            { label: "kDa", value: num(computed.mwDa / 1000, 3) },
          ],
        };
      }
    }
  }, [config.mode, a, b, s]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "mw" ? (
            <>
              <div>
                <FieldLabel htmlFor="bm-a">Length (nt / bp)</FieldLabel>
                <FieldInput id="bm-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bm-b">Kind (dsdna or ssrna)</FieldLabel>
                <FieldInput id="bm-b" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "tm" || config.mode === "gc" || config.mode === "codon" ? (
            <div>
              <FieldLabel htmlFor="bm-s">
                {config.mode === "tm" ? "Primer sequence" : config.mode === "codon" ? "Coding sequence" : "DNA/RNA sequence"}
              </FieldLabel>
              <FieldInput id="bm-s" value={s} onChange={(ev) => setS(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "protein" ? (
            <div>
              <FieldLabel htmlFor="bm-s">Protein sequence (1-letter AA)</FieldLabel>
              <FieldInput id="bm-s" value={s} onChange={(ev) => setS(ev.target.value)} />
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
