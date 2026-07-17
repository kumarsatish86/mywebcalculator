/** Physics: wave speed, frequency, wavelength, intensity, Doppler (SI). */

export const PHYSICS_WAVES_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  F: "f",
  V: "v",
  L: "l",
} as const;

export function parsePhysicsWavesSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(PHYSICS_WAVES_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

const I0 = 1e-12; // W/m² reference

export function waveSpeed(params: {
  frequencyHz: number;
  wavelengthM: number;
}): { speedMs: number } | { error: string } {
  if (params.frequencyHz <= 0) return { error: "Frequency must be positive." };
  if (params.wavelengthM <= 0) return { error: "Wavelength must be positive." };
  return { speedMs: params.frequencyHz * params.wavelengthM };
}

export function frequencyFromWave(params: {
  speedMs: number;
  wavelengthM: number;
}): { frequencyHz: number } | { error: string } {
  if (params.speedMs <= 0) return { error: "Speed must be positive." };
  if (params.wavelengthM <= 0) return { error: "Wavelength must be positive." };
  return { frequencyHz: params.speedMs / params.wavelengthM };
}

export function wavelength(params: {
  speedMs: number;
  frequencyHz: number;
}): { wavelengthM: number } | { error: string } {
  if (params.speedMs <= 0) return { error: "Speed must be positive." };
  if (params.frequencyHz <= 0) return { error: "Frequency must be positive." };
  return { wavelengthM: params.speedMs / params.frequencyHz };
}

export function soundIntensity(params: {
  powerW: number;
  areaM2: number;
}): { intensity: number; db: number } | { error: string } {
  if (params.powerW < 0) return { error: "Power cannot be negative." };
  if (params.areaM2 <= 0) return { error: "Area must be positive." };
  const intensity = params.powerW / params.areaM2;
  const db = 10 * Math.log10(intensity / I0);
  return { intensity, db };
}

/**
 * Moving observer/source Doppler (air): f' = f (v ± vo) / (v ± vs)
 * Signs: observer toward source → +vo; source toward observer → −vs (denominator).
 */
export function dopplerEffect(params: {
  f0: number;
  vSound: number;
  vObserver: number;
  vSource: number;
  observerToward: boolean;
  sourceToward: boolean;
}): { fHeard: number } | { error: string } {
  if (params.f0 <= 0) return { error: "Source frequency must be positive." };
  if (params.vSound <= 0) return { error: "Sound speed must be positive." };
  if (params.vObserver < 0 || params.vSource < 0) {
    return { error: "Speeds cannot be negative (use direction toggles)." };
  }
  const vo = params.observerToward ? params.vObserver : -params.vObserver;
  const vs = params.sourceToward ? -params.vSource : params.vSource;
  const denom = params.vSound + vs;
  if (denom === 0) return { error: "Invalid source speed (denominator zero)." };
  return { fHeard: params.f0 * ((params.vSound + vo) / denom) };
}
