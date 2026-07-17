/** Chemistry micro tools: Z lookup, valency, oxidation, e⁻ config (educational). */

export const CHEMISTRY_BONUS_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  Z: "z",
  W: "w",
} as const;

export function parseChemistryBonusSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CHEMISTRY_BONUS_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const ELEMENTS: { z: number; symbol: string; name: string; groupHint: string }[] = [
  { z: 1, symbol: "H", name: "Hydrogen", groupHint: "1" },
  { z: 2, symbol: "He", name: "Helium", groupHint: "18" },
  { z: 3, symbol: "Li", name: "Lithium", groupHint: "1" },
  { z: 6, symbol: "C", name: "Carbon", groupHint: "14" },
  { z: 7, symbol: "N", name: "Nitrogen", groupHint: "15" },
  { z: 8, symbol: "O", name: "Oxygen", groupHint: "16" },
  { z: 9, symbol: "F", name: "Fluorine", groupHint: "17" },
  { z: 11, symbol: "Na", name: "Sodium", groupHint: "1" },
  { z: 12, symbol: "Mg", name: "Magnesium", groupHint: "2" },
  { z: 13, symbol: "Al", name: "Aluminium", groupHint: "13" },
  { z: 16, symbol: "S", name: "Sulfur", groupHint: "16" },
  { z: 17, symbol: "Cl", name: "Chlorine", groupHint: "17" },
  { z: 19, symbol: "K", name: "Potassium", groupHint: "1" },
  { z: 20, symbol: "Ca", name: "Calcium", groupHint: "2" },
  { z: 26, symbol: "Fe", name: "Iron", groupHint: "8" },
  { z: 29, symbol: "Cu", name: "Copper", groupHint: "11" },
  { z: 30, symbol: "Zn", name: "Zinc", groupHint: "12" },
];

export function periodicLookup(params: {
  query: string;
}): { z: number; symbol: string; name: string; groupHint: string } | { error: string } {
  const q = params.query.trim();
  if (!q) return { error: "Enter atomic number or symbol (H, Fe, …)." };
  const asZ = Number(q);
  if (Number.isFinite(asZ) && asZ > 0) {
    const hit = ELEMENTS.find((e) => e.z === asZ);
    if (!hit) return { error: "Element not in this mini table (common Z only)." };
    return hit;
  }
  const hit = ELEMENTS.find((e) => e.symbol.toLowerCase() === q.toLowerCase());
  if (!hit) return { error: "Symbol not in this mini table." };
  return hit;
}

/** Common main-group valency heuristic from group number */
export function valencyFinder(params: {
  group: number;
}): { valency: number; note: string } | { error: string } {
  if (params.group < 1 || params.group > 18) return { error: "Group should be 1–18." };
  if (params.group <= 2) return { valency: params.group, note: "Typical s-block cation valency." };
  if (params.group >= 13 && params.group <= 17) {
    const v = params.group - 10;
    return { valency: v > 4 ? 8 - v : v, note: "Common main-group bonding pattern (simplified)." };
  }
  if (params.group === 18) return { valency: 0, note: "Noble gas — typically 0." };
  return { valency: 2, note: "Transition metals vary — 2 shown as a classroom default." };
}

/** Oxidation from formula heuristics: sum = 0 or ion charge */
export function oxidationState(params: {
  elementOxKnown: number;
  atomCountKnown: number;
  atomCountUnknown: number;
  totalCharge: number;
}): { oxUnknown: number } | { error: string } {
  if (params.atomCountKnown <= 0 || params.atomCountUnknown <= 0) {
    return { error: "Atom counts must be positive." };
  }
  const oxUnknown =
    (params.totalCharge - params.elementOxKnown * params.atomCountKnown) /
    params.atomCountUnknown;
  return { oxUnknown };
}

export function electronConfiguration(params: {
  z: number;
}): { config: string; shells: number[] } | { error: string } {
  if (params.z < 1 || params.z > 36) return { error: "Supports Z = 1–36 in this tool." };
  const order = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p"];
  const caps: Record<string, number> = {
    "1s": 2,
    "2s": 2,
    "2p": 6,
    "3s": 2,
    "3p": 6,
    "4s": 2,
    "3d": 10,
    "4p": 6,
  };
  let left = params.z;
  const parts: string[] = [];
  const shells = [0, 0, 0, 0];
  for (const orb of order) {
    if (left <= 0) break;
    const take = Math.min(caps[orb]!, left);
    parts.push(`${orb}${take}`);
    const n = Number(orb[0]);
    shells[n - 1] = (shells[n - 1] ?? 0) + take;
    left -= take;
  }
  return { config: parts.join(" "), shells };
}

export function orbitalDiagram(params: {
  z: number;
}): { lines: string[] } | { error: string } {
  const cfg = electronConfiguration(params);
  if ("error" in cfg) return cfg;
  const lines = cfg.config.split(" ").map((term) => {
    const m = /^(\d)([spdf])(\d+)$/.exec(term);
    if (!m) return term;
    const n = Number(m[3]);
    const boxes = "↑↓".repeat(Math.floor(n / 2)) + (n % 2 ? "↑" : "");
    return `${m[1]}${m[2]}: ${boxes || "—"} (${n} e⁻)`;
  });
  return { lines };
}
