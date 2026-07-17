/** Molecular biology: MW, Tm, GC%, codon usage (educational). */

export const BIOLOGY_MOLECULAR_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  S: "s",
  N: "n",
} as const;

export function parseBiologyMolecularSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(BIOLOGY_MOLECULAR_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

function cleanSeq(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^ACGTU]/g, "");
}

/** dsDNA ≈ length×650 Da; ssRNA ≈ length×320 Da (approx). */
export function dnaRnaMolecularWeight(params: {
  length: number;
  kind: "dsdna" | "ssrna";
}): { mwDa: number; mwKda: number } | { error: string } {
  if (params.length <= 0) return { error: "Length must be positive." };
  const per = params.kind === "dsdna" ? 650 : 320;
  const mwDa = params.length * per;
  return { mwDa, mwKda: mwDa / 1000 };
}

/** Wallace rule: Tm = 2(A+T) + 4(G+C) for short oligos. */
export function primerMeltingTemperature(params: {
  sequence: string;
}): { tmC: number; length: number; gcPct: number } | { error: string } {
  const s = cleanSeq(params.sequence).replace(/U/g, "T");
  if (s.length < 5) return { error: "Enter a primer sequence (≥ 5 nt)." };
  if (s.length > 35) return { error: "Wallace rule best for primers ≤ 35 nt." };
  let at = 0;
  let gc = 0;
  for (const ch of s) {
    if (ch === "A" || ch === "T") at++;
    else if (ch === "G" || ch === "C") gc++;
  }
  return {
    tmC: 2 * at + 4 * gc,
    length: s.length,
    gcPct: (gc / s.length) * 100,
  };
}

export function gcContent(params: {
  sequence: string;
}): { gcPct: number; length: number; gcCount: number } | { error: string } {
  const s = cleanSeq(params.sequence).replace(/U/g, "T");
  if (s.length < 1) return { error: "Enter a DNA/RNA sequence." };
  let gc = 0;
  for (const ch of s) if (ch === "G" || ch === "C") gc++;
  return { gcPct: (gc / s.length) * 100, length: s.length, gcCount: gc };
}

export function codonUsage(params: {
  sequence: string;
}): { codonCounts: Record<string, number>; totalCodons: number } | { error: string } {
  const s = cleanSeq(params.sequence).replace(/U/g, "T");
  if (s.length < 3) return { error: "Sequence too short." };
  if (s.length % 3 !== 0) return { error: "Coding sequence length must be a multiple of 3." };
  const codonCounts: Record<string, number> = {};
  for (let i = 0; i < s.length; i += 3) {
    const codon = s.slice(i, i + 3);
    codonCounts[codon] = (codonCounts[codon] ?? 0) + 1;
  }
  return { codonCounts, totalCodons: s.length / 3 };
}

const AA_MASS: Record<string, number> = {
  A: 89.09,
  R: 174.2,
  N: 132.12,
  D: 133.1,
  C: 121.16,
  E: 147.13,
  Q: 146.15,
  G: 75.07,
  H: 155.16,
  I: 131.17,
  L: 131.17,
  K: 146.19,
  M: 149.21,
  F: 165.19,
  P: 115.13,
  S: 105.09,
  T: 119.12,
  W: 204.23,
  Y: 181.19,
  V: 117.15,
};

/** Protein MW from AA sequence (monoisotopic approx, water loss ignored for teaching). */
export function proteinMolecularWeight(params: {
  sequence: string;
}): { mwDa: number; residues: number } | { error: string } {
  const s = params.sequence.trim().toUpperCase().replace(/[^A-Z]/g, "");
  if (s.length < 1) return { error: "Enter a protein sequence (1-letter AA codes)." };
  let mw = 18.015; // + H2O for termini teaching approx
  for (const ch of s) {
    const m = AA_MASS[ch];
    if (m == null) return { error: `Unknown residue: ${ch}` };
    mw += m - 18.015; // peptide bond water loss
  }
  return { mwDa: mw, residues: s.length };
}
