/** pH / acid–base: pH, pOH, pKa, buffers, dissociation, titration (educational). */

export const CHEMISTRY_PH_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  M: "m",
  V: "v",
} as const;

export function parseChemistryPhSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CHEMISTRY_PH_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

/** pH from [H⁺] (mol/L), or from pOH (leave h blank). */
export function phFromConcentration(params: {
  hPlus: number | null;
  pOh: number | null;
}): { ph: number; hPlus: number; pOh: number } | { error: string } {
  if (params.hPlus != null && Number.isFinite(params.hPlus)) {
    if (params.hPlus <= 0) return { error: "[H⁺] must be positive." };
    const ph = -Math.log10(params.hPlus);
    return { ph, hPlus: params.hPlus, pOh: 14 - ph };
  }
  if (params.pOh != null && Number.isFinite(params.pOh)) {
    const ph = 14 - params.pOh;
    return { ph, hPlus: 10 ** -ph, pOh: params.pOh };
  }
  return { error: "Enter [H⁺] or pOH." };
}

export function pohFromConcentration(params: {
  ohMinus: number | null;
  ph: number | null;
}): { pOh: number; ohMinus: number; ph: number } | { error: string } {
  if (params.ohMinus != null && Number.isFinite(params.ohMinus)) {
    if (params.ohMinus <= 0) return { error: "[OH⁻] must be positive." };
    const pOh = -Math.log10(params.ohMinus);
    return { pOh, ohMinus: params.ohMinus, ph: 14 - pOh };
  }
  if (params.ph != null && Number.isFinite(params.ph)) {
    const pOh = 14 - params.ph;
    return { pOh, ohMinus: 10 ** -pOh, ph: params.ph };
  }
  return { error: "Enter [OH⁻] or pH." };
}

/** pKa ↔ Ka (leave one blank). */
export function pKa(params: {
  ka: number | null;
  pka: number | null;
}): { ka: number; pka: number } | { error: string } {
  if (params.ka != null && Number.isFinite(params.ka)) {
    if (params.ka <= 0) return { error: "Ka must be positive." };
    return { ka: params.ka, pka: -Math.log10(params.ka) };
  }
  if (params.pka != null && Number.isFinite(params.pka)) {
    return { ka: 10 ** -params.pka, pka: params.pka };
  }
  return { error: "Enter Ka or pKa." };
}

/** Henderson–Hasselbalch: pH = pKa + log10([A⁻]/[HA]). */
export function hendersonHasselbalch(params: {
  pka: number;
  salt: number;
  acid: number;
}): { ph: number; ratio: number } | { error: string } {
  if (params.salt <= 0 || params.acid <= 0) {
    return { error: "[A⁻] and [HA] must be positive." };
  }
  const ratio = params.salt / params.acid;
  return { ph: params.pka + Math.log10(ratio), ratio };
}

/** Weak acid approx: [H⁺] ≈ √(Ka × C₀), α = [H⁺]/C₀ (when x ≪ C₀). */
export function acidBaseDissociation(params: {
  ka: number;
  c0: number;
}): { hPlus: number; ph: number; alpha: number; note: string } | { error: string } {
  if (params.ka <= 0 || params.c0 <= 0) return { error: "Ka and C₀ must be positive." };
  const hPlus = Math.sqrt(params.ka * params.c0);
  if (hPlus > 0.05 * params.c0) {
    return {
      error: "Approximation x ≪ C₀ fails — use a quadratic solver for this Ka/C₀ pair.",
    };
  }
  return {
    hPlus,
    ph: -Math.log10(hPlus),
    alpha: hPlus / params.c0,
    note: "Uses √(Ka·C₀) approximation for dilute weak acids.",
  };
}

/** M1 V1 = M2 V2 (1:1 titration). */
export function titrationChemistry(params: {
  m1: number | null;
  v1: number | null;
  m2: number | null;
  v2: number | null;
}): { m1: number; v1: number; m2: number; v2: number } | { error: string } {
  const known = [params.m1, params.v1, params.m2, params.v2].filter(
    (x) => x != null && Number.isFinite(x),
  ).length;
  if (known < 3) return { error: "Enter any three of M1, V1, M2, V2." };
  let { m1, v1, m2, v2 } = params;
  if (m1 == null && v1 != null && m2 != null && v2 != null) {
    if (v1 <= 0) return { error: "V1 must be positive." };
    m1 = (m2 * v2) / v1;
  } else if (v1 == null && m1 != null && m2 != null && v2 != null) {
    if (m1 <= 0) return { error: "M1 must be positive." };
    v1 = (m2 * v2) / m1;
  } else if (m2 == null && m1 != null && v1 != null && v2 != null) {
    if (v2 <= 0) return { error: "V2 must be positive." };
    m2 = (m1 * v1) / v2;
  } else if (v2 == null && m1 != null && v1 != null && m2 != null) {
    if (m2 <= 0) return { error: "M2 must be positive." };
    v2 = (m1 * v1) / m2;
  } else {
    return { error: "Could not solve." };
  }
  return { m1: m1!, v1: v1!, m2: m2!, v2: v2! };
}
