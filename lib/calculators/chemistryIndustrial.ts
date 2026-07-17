/** Industrial / applied chemistry process math (educational). */

export const CHEMISTRY_INDUSTRIAL_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
} as const;

export function parseChemistryIndustrialSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CHEMISTRY_INDUSTRIAL_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function processYield(params: {
  actual: number;
  theoretical: number;
}): { percent: number } | { error: string } {
  if (params.actual < 0) return { error: "Actual amount cannot be negative." };
  if (params.theoretical <= 0) return { error: "Theoretical amount must be positive." };
  return { percent: (params.actual / params.theoretical) * 100 };
}

/** V = F / spaceVelocity  or  V = τ × volumetricFlow */
export function reactorVolume(params: {
  mode: "tau" | "sv";
  flowM3s?: number;
  tauS?: number;
  spaceVelocity?: number;
}): { volumeM3: number } | { error: string } {
  if (params.mode === "tau") {
    const f = params.flowM3s ?? 0;
    const tau = params.tauS ?? 0;
    if (f < 0 || tau < 0) return { error: "Flow and residence time cannot be negative." };
    return { volumeM3: f * tau };
  }
  const f = params.flowM3s ?? 0;
  const sv = params.spaceVelocity ?? 0;
  if (f < 0 || sv <= 0) return { error: "Flow ≥ 0 and space velocity must be positive." };
  return { volumeM3: f / sv };
}

export function conversionEfficiency(params: {
  reacted: number;
  fed: number;
}): { conversion: number; percent: number } | { error: string } {
  if (params.reacted < 0 || params.fed <= 0) return { error: "Fed must be positive; reacted ≥ 0." };
  if (params.reacted > params.fed) return { error: "Reacted cannot exceed fed." };
  const conversion = params.reacted / params.fed;
  return { conversion, percent: conversion * 100 };
}

/** Simple balance: in − out − consumed + generated = accumulation */
export function materialBalance(params: {
  inlet: number;
  outlet: number;
  consumed: number;
  generated: number;
}): { accumulation: number; closed: boolean } | { error: string } {
  if ([params.inlet, params.outlet, params.consumed, params.generated].some((x) => x < 0)) {
    return { error: "All streams must be non-negative." };
  }
  const accumulation = params.inlet - params.outlet - params.consumed + params.generated;
  return { accumulation, closed: Math.abs(accumulation) < 1e-9 };
}
