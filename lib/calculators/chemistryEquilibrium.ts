/** Chemical equilibrium: Kc/Kp, Q, ICE (1:1), Le Chatelier text, Ksp (educational). */

export const CHEMISTRY_EQ_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  K: "k",
  N: "n",
  S: "s",
} as const;

export function parseChemistryEqSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CHEMISTRY_EQ_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const R_L_ATM = 0.082057; // L·atm/(mol·K)

/**
 * Kc = (products) / (reactants) from concentration product fields.
 * If deltaN and T given, also Kp = Kc (RT)^Δn with R in L·atm.
 */
export function equilibriumConstant(params: {
  products: number;
  reactants: number;
  deltaN?: number;
  tK?: number;
}): { kc: number; kp?: number } | { error: string } {
  if (params.products < 0 || params.reactants <= 0) {
    return { error: "Product quotient ≥ 0 and reactant quotient > 0." };
  }
  const kc = params.products / params.reactants;
  if (params.deltaN != null && params.tK != null) {
    if (params.tK <= 0) return { error: "Temperature must be positive Kelvin." };
    const kp = kc * (R_L_ATM * params.tK) ** params.deltaN;
    return { kc, kp };
  }
  return { kc };
}

export function reactionQuotient(params: {
  products: number;
  reactants: number;
  k?: number;
}): { q: number; direction?: string } | { error: string } {
  if (params.products < 0 || params.reactants <= 0) {
    return { error: "Product quotient ≥ 0 and reactant quotient > 0." };
  }
  const q = params.products / params.reactants;
  if (params.k == null) return { q };
  if (params.k <= 0) return { error: "K must be positive when comparing Q." };
  let direction: string;
  if (q < params.k) direction = "Q < K → net forward (toward products)";
  else if (q > params.k) direction = "Q > K → net reverse (toward reactants)";
  else direction = "Q = K → at equilibrium";
  return { q, direction };
}

/**
 * Simple ICE for A ⇌ 2B style weak: K = 4x²/(C₀−x) ≈ 4x²/C₀ when x≪C₀,
 * or for A ⇌ B+C: K = x²/(C₀−x) ≈ x²/C₀.
 * mode "ab": K=x²/(C0-x); mode "a2b": K=4x²/(C0-x).
 */
export function iceTable(params: {
  k: number;
  c0: number;
  mode?: "ab" | "a2b";
}): { x: number; equilibriumA: number; note: string } | { error: string } {
  if (params.k <= 0 || params.c0 <= 0) return { error: "K and C₀ must be positive." };
  const mode = params.mode ?? "ab";
  const factor = mode === "a2b" ? 4 : 1;
  // Solve factor*x² + K*x − K*C0 = 0 → x = (−K + √(K²+4factor K C0))/(2factor)
  const disc = params.k ** 2 + 4 * factor * params.k * params.c0;
  const x = (-params.k + Math.sqrt(disc)) / (2 * factor);
  if (x <= 0 || x >= params.c0) return { error: "No physical root in (0, C₀)." };
  return {
    x,
    equilibriumA: params.c0 - x,
    note:
      mode === "a2b"
        ? "Solved K = 4x²/(C₀−x) for A ⇌ 2B."
        : "Solved K = x²/(C₀−x) for A ⇌ B + C.",
  };
}

const LE_CHATELIER: Record<string, string> = {
  heatforward: "Exothermic forward: adding heat shifts reverse; removing heat shifts forward.",
  heatreverse: "Endothermic forward: adding heat shifts forward; removing heat shifts reverse.",
  pressure: "Increasing P favors fewer gas moles; decreasing P favors more gas moles.",
  product: "Adding product shifts reverse; removing product shifts forward.",
  reactant: "Adding reactant shifts forward; removing reactant shifts reverse.",
  catalyst: "Catalyst speeds both directions equally — K unchanged; equilibrium reached faster.",
};

export function leChatelier(params: {
  stress: string;
}): { prediction: string } | { error: string } {
  const k = params.stress.trim().toLowerCase().replace(/\s+/g, "");
  if (!k) return { error: "Enter a stress keyword (heatforward, pressure, product, …)." };
  const hit = Object.entries(LE_CHATELIER).find(([key]) => k.includes(key));
  if (!hit) {
    return {
      prediction:
        "No preset match. Try heatforward, heatreverse, pressure, product, reactant, or catalyst.",
    };
  }
  return { prediction: hit[1] };
}

/**
 * Ksp helpers:
 * - mode "fromS": AB → Ksp=s²; AB2 → Ksp=4s³; A2B → Ksp=4s³
 * - mode "fromKsp": solve s from Ksp
 */
export function solubilityProduct(params: {
  mode: "fromS" | "fromKsp";
  type: "ab" | "ab2" | "a2b";
  s?: number;
  ksp?: number;
}): { ksp?: number; s?: number } | { error: string } {
  const { type } = params;
  if (params.mode === "fromS") {
    const s = params.s ?? 0;
    if (s < 0) return { error: "Solubility s cannot be negative." };
    if (type === "ab") return { ksp: s * s, s };
    return { ksp: 4 * s ** 3, s };
  }
  const ksp = params.ksp ?? 0;
  if (ksp < 0) return { error: "Ksp cannot be negative." };
  if (type === "ab") return { ksp, s: Math.sqrt(ksp) };
  return { ksp, s: Math.cbrt(ksp / 4) };
}
