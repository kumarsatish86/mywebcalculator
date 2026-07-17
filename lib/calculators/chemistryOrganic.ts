/** Organic chemistry helpers — formula, DU, teaching name/group tools (not live AI). */

export const CHEMISTRY_ORGANIC_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  N: "n",
  X: "x",
} as const;

export function parseChemistryOrganicSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CHEMISTRY_ORGANIC_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export type HydrocarbonKind = "alkane" | "alkene" | "alkyne";

/** Cn formula for saturated/unsaturated open-chain hydrocarbons. */
export function hydrocarbonFormula(params: {
  n: number;
  kind: HydrocarbonKind;
}): { formula: string; general: string } | { error: string } {
  const n = Math.round(params.n);
  if (n < 1) return { error: "Carbon count n must be ≥ 1." };
  if (params.kind === "alkane") {
    return { formula: `C${n}H${2 * n + 2}`, general: "CnH2n+2" };
  }
  if (params.kind === "alkene") {
    if (n < 2) return { error: "Alkenes need n ≥ 2." };
    return { formula: `C${n}H${2 * n}`, general: "CnH2n" };
  }
  if (n < 2) return { error: "Alkynes need n ≥ 2." };
  return { formula: `C${n}H${2 * n - 2}`, general: "CnH2n−2" };
}

/** Degree of unsaturation: DU = (2C + 2 + N − H − X) / 2 */
export function degreeOfUnsaturation(params: {
  c: number;
  h: number;
  n?: number;
  x?: number;
}): { du: number } | { error: string } {
  const c = Math.round(params.c);
  const h = Math.round(params.h);
  const n = Math.round(params.n ?? 0);
  const x = Math.round(params.x ?? 0);
  if (c < 0 || h < 0 || n < 0 || x < 0) return { error: "Atom counts cannot be negative." };
  const du = (2 * c + 2 + n - h - x) / 2;
  if (!Number.isFinite(du)) return { error: "Could not compute DU." };
  return { du };
}

const ALKANE_NAMES = [
  "",
  "methane",
  "ethane",
  "propane",
  "butane",
  "pentane",
  "hexane",
  "heptane",
  "octane",
  "nonane",
  "decane",
];

/** Teaching-name helper for unbranched Cn hydrocarbons (not a full IUPAC engine). */
export function iupacNameTeaching(params: {
  n: number;
  kind: HydrocarbonKind;
}): { name: string; note: string } | { error: string } {
  const n = Math.round(params.n);
  if (n < 1 || n > 10) return { error: "Enter n from 1–10 for this teaching helper." };
  const base = ALKANE_NAMES[n];
  if (!base) return { error: "Unsupported n." };
  if (params.kind === "alkane") {
    return { name: base, note: "Unbranched alkane stem only — not a full IUPAC name generator." };
  }
  if (params.kind === "alkene") {
    if (n < 2) return { error: "Alkenes need n ≥ 2." };
    return {
      name: base.replace(/ane$/, "ene"),
      note: "Unbranched alkene stem (no locants) — educational only.",
    };
  }
  if (n < 2) return { error: "Alkynes need n ≥ 2." };
  return {
    name: base.replace(/ane$/, "yne"),
    note: "Unbranched alkyne stem (no locants) — educational only.",
  };
}

const FUNCTIONAL_GROUPS: Record<string, string> = {
  oh: "Alcohol (−OH) — hydroxy group on a carbon chain.",
  alcohol: "Alcohol (−OH) — hydroxy group on a carbon chain.",
  cooh: "Carboxylic acid (−COOH).",
  acid: "Carboxylic acid (−COOH) when referring to organic acids.",
  cho: "Aldehyde (−CHO).",
  aldehyde: "Aldehyde (−CHO).",
  ketone: "Ketone (C=O between two carbons).",
  co: "Ketone / carbonyl (context-dependent — often ketone in teaching drills).",
  nh2: "Amine (−NH₂).",
  amine: "Amine (−NH₂).",
  ether: "Ether (R−O−R′).",
  ester: "Ester (−COO−).",
  amide: "Amide (−CONH₂ / −CONHR).",
};

export function functionalGroupIdentifier(params: {
  keyword: string;
}): { group: string } | { error: string } {
  const k = params.keyword.trim().toLowerCase().replace(/\s+/g, "");
  if (!k) return { error: "Enter a group keyword (e.g. OH, ketone, COOH)." };
  const hit = Object.entries(FUNCTIONAL_GROUPS).find(([key]) => k.includes(key));
  if (!hit) {
    return {
      group:
        "No preset match. Try OH, alcohol, COOH, aldehyde, ketone, amine, ether, ester, or amide.",
    };
  }
  return { group: hit[1] };
}

const REACTION_PRESETS: Record<string, string> = {
  "alkene+h2": "Catalytic hydrogenation: alkene + H₂ → alkane (teaching pattern).",
  "alkane+br2": "Free-radical halogenation of alkanes (UV/heat) — multiple products possible.",
  "alcohol+oxid": "Primary alcohol → aldehyde → acid; secondary → ketone (oxidizing agent).",
  esterification: "Carboxylic acid + alcohol ⇌ ester + water (acid-catalyzed).",
  "sn2": "Bimolecular nucleophilic substitution — inversion at the carbon center (teaching).",
};

export function organicReactionPredictor(params: {
  query: string;
}): { prediction: string } | { error: string } {
  const key = params.query.trim().toLowerCase().replace(/\s+/g, "");
  if (!key) return { error: "Enter a short reaction hint (e.g. alkene+H2)." };
  const hit = Object.entries(REACTION_PRESETS).find(([k]) => key.includes(k));
  if (!hit) {
    return {
      prediction:
        "No preset match. Rule-based teaching patterns only — not a live AI reaction predictor.",
    };
  }
  return { prediction: hit[1] };
}
