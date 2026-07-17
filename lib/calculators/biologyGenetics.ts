/** Genetics: Punnett, HWE, allele freq, drift, mutation (educational). */

export const BIOLOGY_GENETICS_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
  P: "p",
  N: "n",
} as const;

export function parseBiologyGeneticsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BIOLOGY_GENETICS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

function allelesOf(g: string): [string, string] | { error: string } {
  const s = g.trim();
  if (s.length !== 2) return { error: "Genotype must be two letters (e.g. Aa)." };
  return [s[0]!, s[1]!];
}

/** Monohybrid Punnett from two diploid genotypes. */
export function punnettSquare(params: {
  parent1: string;
  parent2: string;
}): { offspring: Record<string, number>; total: number } | { error: string } {
  const a1 = allelesOf(params.parent1);
  if ("error" in a1) return a1;
  const a2 = allelesOf(params.parent2);
  if ("error" in a2) return a2;
  const offspring: Record<string, number> = {};
  for (const x of a1) {
    for (const y of a2) {
      const pair = [x, y].sort().join("");
      offspring[pair] = (offspring[pair] ?? 0) + 1;
    }
  }
  return { offspring, total: 4 };
}

export function genotypeProbability(params: {
  parent1: string;
  parent2: string;
  target: string;
}): { probability: number; count: number } | { error: string } {
  const sq = punnettSquare(params);
  if ("error" in sq) return sq;
  const key = params.target.trim().split("").sort().join("");
  const count = sq.offspring[key] ?? 0;
  return { probability: count / sq.total, count };
}

/** Dominant phenotype if any uppercase allele present (simple). */
export function phenotypeRatio(params: {
  parent1: string;
  parent2: string;
}): { dominant: number; recessive: number; ratio: string } | { error: string } {
  const sq = punnettSquare(params);
  if ("error" in sq) return sq;
  let dominant = 0;
  let recessive = 0;
  for (const [g, n] of Object.entries(sq.offspring)) {
    if (g !== g.toLowerCase()) dominant += n;
    else recessive += n;
  }
  return {
    dominant,
    recessive,
    ratio: `${dominant}:${recessive}`,
  };
}

/** p = (2×AA + Aa) / (2N) from genotype counts */
export function alleleFrequency(params: {
  aa: number;
  heterozygous: number;
  recessive: number;
}): { p: number; q: number } | { error: string } {
  if (params.aa < 0 || params.heterozygous < 0 || params.recessive < 0) {
    return { error: "Counts cannot be negative." };
  }
  const n = params.aa + params.heterozygous + params.recessive;
  if (n <= 0) return { error: "Total individuals must be positive." };
  const p = (2 * params.aa + params.heterozygous) / (2 * n);
  return { p, q: 1 - p };
}

export function hardyWeinberg(params: {
  p: number;
}): { p2: number; twoPq: number; q2: number; q: number } | { error: string } {
  if (params.p < 0 || params.p > 1) return { error: "p must be between 0 and 1." };
  const q = 1 - params.p;
  return { p2: params.p ** 2, twoPq: 2 * params.p * q, q2: q ** 2, q };
}

/** Expected heterozygosity drift: He_t ≈ He0 × (1 − 1/(2N))^t */
export function geneticDrift(params: {
  he0: number;
  population: number;
  generations: number;
}): { heT: number } | { error: string } {
  if (params.he0 < 0 || params.he0 > 1) return { error: "He₀ must be 0–1." };
  if (params.population < 1) return { error: "Population must be ≥ 1." };
  if (params.generations < 0) return { error: "Generations cannot be negative." };
  const factor = 1 - 1 / (2 * params.population);
  return { heT: params.he0 * factor ** params.generations };
}

/** μ = mutations / (sites × generations) */
export function mutationRate(params: {
  mutations: number;
  sites: number;
  generations: number;
}): { rate: number } | { error: string } {
  if (params.mutations < 0) return { error: "Mutations cannot be negative." };
  if (params.sites <= 0 || params.generations <= 0) {
    return { error: "Sites and generations must be positive." };
  }
  return { rate: params.mutations / (params.sites * params.generations) };
}
