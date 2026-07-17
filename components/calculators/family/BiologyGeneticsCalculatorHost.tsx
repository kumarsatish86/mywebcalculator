"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  BIOLOGY_GENETICS_URL,
  alleleFrequency,
  geneticDrift,
  genotypeProbability,
  hardyWeinberg,
  mutationRate,
  phenotypeRatio,
  punnettSquare,
} from "@/lib/calculators/biologyGenetics";

type GeneticsSlug =
  | "punnett-square-calculator"
  | "genotype-probability-calculator"
  | "phenotype-ratio-calculator"
  | "allele-frequency-calculator"
  | "hardy-weinberg-equilibrium-calculator"
  | "genetic-drift-simulator"
  | "mutation-rate-calculator";

type Mode =
  | "punnett"
  | "genotypeProb"
  | "phenotype"
  | "alleleFreq"
  | "hwe"
  | "drift"
  | "mutation";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
};

const CONFIG: Record<GeneticsSlug, Config> = {
  "punnett-square-calculator": {
    title: "Punnett square",
    description: "Monohybrid offspring genotype counts from two parents.",
    mode: "punnett",
    aDefault: "Aa",
    bDefault: "Aa",
    cDefault: "",
  },
  "genotype-probability-calculator": {
    title: "Genotype probability",
    description: "Probability of a target genotype from a Punnett cross.",
    mode: "genotypeProb",
    aDefault: "Aa",
    bDefault: "Aa",
    cDefault: "aa",
  },
  "phenotype-ratio-calculator": {
    title: "Phenotype ratio",
    description: "Dominant:recessive counts (uppercase = dominant allele).",
    mode: "phenotype",
    aDefault: "Aa",
    bDefault: "Aa",
    cDefault: "",
  },
  "allele-frequency-calculator": {
    title: "Allele frequency",
    description: "p = (2×AA + Aa) / (2N) from genotype counts.",
    mode: "alleleFreq",
    aDefault: "40",
    bDefault: "40",
    cDefault: "20",
  },
  "hardy-weinberg-equilibrium-calculator": {
    title: "Hardy–Weinberg equilibrium",
    description: "p², 2pq, q² from allele frequency p.",
    mode: "hwe",
    aDefault: "0.6",
    bDefault: "",
    cDefault: "",
  },
  "genetic-drift-simulator": {
    title: "Genetic drift",
    description: "He_t ≈ He₀ × (1 − 1/(2N))^t.",
    mode: "drift",
    aDefault: "0.5",
    bDefault: "50",
    cDefault: "10",
  },
  "mutation-rate-calculator": {
    title: "Mutation rate",
    description: "μ = mutations / (sites × generations).",
    mode: "mutation",
    aDefault: "2",
    bDefault: "10000",
    cDefault: "100",
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

export function BiologyGeneticsCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as GeneticsSlug] ?? CONFIG["punnett-square-calculator"];
  const [a, setA] = useState(useLoanInitialInput(BIOLOGY_GENETICS_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(BIOLOGY_GENETICS_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(BIOLOGY_GENETICS_URL.C, config.cDefault));

  const num = (n: number, d = 4) => {
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return n.toExponential(4);
    return n.toFixed(d);
  };

  const shareParams = useCallback(() => {
    if (config.mode === "hwe") {
      return { [BIOLOGY_GENETICS_URL.A]: a };
    }
    if (config.mode === "genotypeProb" || config.mode === "alleleFreq" || config.mode === "drift" || config.mode === "mutation") {
      return {
        [BIOLOGY_GENETICS_URL.A]: a,
        [BIOLOGY_GENETICS_URL.B]: b,
        [BIOLOGY_GENETICS_URL.C]: c,
      };
    }
    return {
      [BIOLOGY_GENETICS_URL.A]: a,
      [BIOLOGY_GENETICS_URL.B]: b,
    };
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "punnett": {
        const computed = punnettSquare({ parent1: a, parent2: b });
        if ("error" in computed) return { error: computed.error };
        const rows = Object.entries(computed.offspring)
          .sort(([g1], [g2]) => g1.localeCompare(g2))
          .map(([g, n]) => ({ label: g, value: `${n}/4` }));
        return {
          primary: `${computed.total} offspring slots`,
          primaryLabel: "Punnett total",
          rows: [
            { label: "Parent 1", value: a.trim() || "—" },
            { label: "Parent 2", value: b.trim() || "—" },
            ...rows,
          ],
        };
      }
      case "genotypeProb": {
        const computed = genotypeProbability({ parent1: a, parent2: b, target: c });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.probability * 100, 2)}%`,
          primaryLabel: "Probability",
          rows: [
            { label: "Target", value: c.trim() || "—" },
            { label: "Count", value: `${computed.count}/4` },
            { label: "Parent 1", value: a.trim() || "—" },
            { label: "Parent 2", value: b.trim() || "—" },
          ],
        };
      }
      case "phenotype": {
        const computed = phenotypeRatio({ parent1: a, parent2: b });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.ratio,
          primaryLabel: "Dominant:recessive",
          rows: [
            { label: "Dominant", value: `${computed.dominant}` },
            { label: "Recessive", value: `${computed.recessive}` },
            { label: "Parent 1", value: a.trim() || "—" },
            { label: "Parent 2", value: b.trim() || "—" },
          ],
        };
      }
      case "alleleFreq": {
        const aaP = parseNonNegative(a, "AA count");
        const hetP = parseNonNegative(b, "Heterozygous count");
        const recP = parseNonNegative(c, "Recessive count");
        if (!aaP.ok) return { error: aaP.error };
        if (!hetP.ok) return { error: hetP.error };
        if (!recP.ok) return { error: recP.error };
        const computed = alleleFrequency({
          aa: aaP.value,
          heterozygous: hetP.value,
          recessive: recP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `p=${num(computed.p)}, q=${num(computed.q)}`,
          primaryLabel: "Allele frequencies",
          rows: [
            { label: "p (A)", value: num(computed.p) },
            { label: "q (a)", value: num(computed.q) },
            { label: "AA", value: num(aaP.value) },
            { label: "Het", value: num(hetP.value) },
            { label: "aa", value: num(recP.value) },
          ],
        };
      }
      case "hwe": {
        const pP = parseNonNegative(a, "p");
        if (!pP.ok) return { error: pP.error };
        const computed = hardyWeinberg({ p: pP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `p²=${num(computed.p2)}, 2pq=${num(computed.twoPq)}, q²=${num(computed.q2)}`,
          primaryLabel: "HWE genotype frequencies",
          rows: [
            { label: "p", value: num(pP.value) },
            { label: "q", value: num(computed.q) },
            { label: "p²", value: num(computed.p2) },
            { label: "2pq", value: num(computed.twoPq) },
            { label: "q²", value: num(computed.q2) },
          ],
        };
      }
      case "drift": {
        const heP = parseNonNegative(a, "He₀");
        const nP = parsePositive(b, "Population N");
        const genP = parseNonNegative(c, "Generations");
        if (!heP.ok) return { error: heP.error };
        if (!nP.ok) return { error: nP.error };
        if (!genP.ok) return { error: genP.error };
        const computed = geneticDrift({
          he0: heP.value,
          population: nP.value,
          generations: genP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.heT),
          primaryLabel: "Expected heterozygosity He_t",
          rows: [
            { label: "He₀", value: num(heP.value) },
            { label: "N", value: num(nP.value) },
            { label: "Generations", value: num(genP.value) },
          ],
        };
      }
      case "mutation": {
        const mutP = parseNonNegative(a, "Mutations");
        const sitesP = parsePositive(b, "Sites");
        const genP = parsePositive(c, "Generations");
        if (!mutP.ok) return { error: mutP.error };
        if (!sitesP.ok) return { error: sitesP.error };
        if (!genP.ok) return { error: genP.error };
        const computed = mutationRate({
          mutations: mutP.value,
          sites: sitesP.value,
          generations: genP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.rate, 6),
          primaryLabel: "Mutation rate μ",
          rows: [
            { label: "Mutations", value: num(mutP.value) },
            { label: "Sites", value: num(sitesP.value) },
            { label: "Generations", value: num(genP.value) },
          ],
        };
      }
    }
  }, [config.mode, a, b, c]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "punnett" || config.mode === "phenotype" ? (
            <>
              <div>
                <FieldLabel htmlFor="bg-p1">Parent 1 genotype</FieldLabel>
                <FieldInput id="bg-p1" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="bg-p2">Parent 2 genotype</FieldLabel>
                <FieldInput id="bg-p2" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "genotypeProb" ? (
            <>
              <div>
                <FieldLabel htmlFor="bg-gp1">Parent 1 genotype</FieldLabel>
                <FieldInput id="bg-gp1" value={a} onChange={(ev) => setA(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="bg-gp2">Parent 2 genotype</FieldLabel>
                <FieldInput id="bg-gp2" value={b} onChange={(ev) => setB(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="bg-target">Target genotype</FieldLabel>
                <FieldInput id="bg-target" value={c} onChange={(ev) => setC(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "alleleFreq" ? (
            <>
              <div>
                <FieldLabel htmlFor="bg-aa">AA count</FieldLabel>
                <FieldInput id="bg-aa" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bg-het">Heterozygous count</FieldLabel>
                <FieldInput id="bg-het" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bg-rec">Recessive (aa) count</FieldLabel>
                <FieldInput id="bg-rec" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "hwe" ? (
            <div>
              <FieldLabel htmlFor="bg-p">Allele frequency p</FieldLabel>
              <FieldInput id="bg-p" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}

          {config.mode === "drift" ? (
            <>
              <div>
                <FieldLabel htmlFor="bg-he0">Initial heterozygosity He₀</FieldLabel>
                <FieldInput id="bg-he0" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bg-n">Population N</FieldLabel>
                <FieldInput id="bg-n" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bg-gen">Generations t</FieldLabel>
                <FieldInput id="bg-gen" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "mutation" ? (
            <>
              <div>
                <FieldLabel htmlFor="bg-mut">Mutations</FieldLabel>
                <FieldInput id="bg-mut" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bg-sites">Sites</FieldLabel>
                <FieldInput id="bg-sites" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="bg-mgen">Generations</FieldLabel>
                <FieldInput id="bg-mgen" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
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
