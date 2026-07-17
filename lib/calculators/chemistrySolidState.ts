/** Solid state: density, unit cell, packing, crystal type (educational). */

export const CHEMISTRY_SOLID_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Z: "z",
  M: "m",
} as const;

export function parseChemistrySolidSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CHEMISTRY_SOLID_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const NA = 6.02214076e23;

/** ρ = (Z × M) / (N_A × a³) with a in cm, M g/mol → g/cm³ */
export function densitySolidState(params: {
  z: number;
  molarMass: number;
  edgeCm: number;
}): { density: number } | { error: string } {
  if (params.z <= 0 || params.molarMass <= 0 || params.edgeCm <= 0) {
    return { error: "Z, molar mass, and edge length must be positive." };
  }
  return { density: (params.z * params.molarMass) / (NA * params.edgeCm ** 3) };
}

/** a from density, or volume = a³ */
export function unitCell(params: {
  mode: "edgeFromDensity" | "volume";
  z?: number;
  molarMass?: number;
  density?: number;
  edgeCm?: number;
}): { edgeCm?: number; volumeCm3?: number } | { error: string } {
  if (params.mode === "volume") {
    const a = params.edgeCm ?? 0;
    if (a <= 0) return { error: "Edge length must be positive." };
    return { edgeCm: a, volumeCm3: a ** 3 };
  }
  const z = params.z ?? 0;
  const m = params.molarMass ?? 0;
  const d = params.density ?? 0;
  if (z <= 0 || m <= 0 || d <= 0) return { error: "Z, M, and density must be positive." };
  const edgeCm = Math.cbrt((z * m) / (NA * d));
  return { edgeCm, volumeCm3: edgeCm ** 3 };
}

/** Packing efficiency % for sc/bcc/fcc (hard-sphere ideal) */
export function packingEfficiency(params: {
  type: "sc" | "bcc" | "fcc";
}): { percent: number; z: number } | { error: string } {
  if (params.type === "sc") return { percent: (Math.PI / 6) * 100, z: 1 };
  if (params.type === "bcc") return { percent: ((Math.PI * Math.sqrt(3)) / 8) * 100, z: 2 };
  return { percent: ((Math.PI * Math.sqrt(2)) / 6) * 100, z: 4 };
}

export function crystalStructure(params: {
  type: "sc" | "bcc" | "fcc";
  edgeCm: number;
}): { z: number; atomsPerCell: number; nearestNeighbor: number; packingPercent: number } | { error: string } {
  if (params.edgeCm <= 0) return { error: "Edge length must be positive." };
  const pe = packingEfficiency({ type: params.type });
  if ("error" in pe) return pe;
  let nearestNeighbor: number;
  if (params.type === "sc") nearestNeighbor = params.edgeCm;
  else if (params.type === "bcc") nearestNeighbor = (params.edgeCm * Math.sqrt(3)) / 2;
  else nearestNeighbor = (params.edgeCm * Math.sqrt(2)) / 2;
  return {
    z: pe.z,
    atomsPerCell: pe.z,
    nearestNeighbor,
    packingPercent: pe.percent,
  };
}
