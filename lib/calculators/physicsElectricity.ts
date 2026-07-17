/** Physics: Ohm’s law, power, energy, series/parallel R, capacitor (SI). */

export const PHYSICS_ELECTRICITY_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  W: "w",
  V: "v",
  I: "i",
  P: "p",
} as const;

export function parsePhysicsElectricitySearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(PHYSICS_ELECTRICITY_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

function parseCsv(csv: string): number[] {
  return csv
    .split(/[,;\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

export function ohmsLaw(params: {
  v: number | null;
  i: number | null;
  r: number | null;
}): { v: number; i: number; r: number; solved: string } | { error: string } {
  const known = [params.v, params.i, params.r].filter((x) => x != null && x > 0).length;
  if (known < 2) {
    return { error: "Enter any two of V, I, R (positive) to solve the third." };
  }
  let { v, i, r } = params;
  let solved = "check";
  if (v != null && i != null && (r == null || r <= 0)) {
    r = v / i;
    solved = "R";
  } else if (v != null && r != null && (i == null || i <= 0)) {
    i = v / r;
    solved = "I";
  } else if (i != null && r != null && (v == null || v <= 0)) {
    v = i * r;
    solved = "V";
  }
  return { v: v!, i: i!, r: r!, solved };
}

export function voltageFromIR(params: {
  i: number;
  r: number;
}): { v: number } | { error: string } {
  if (params.i < 0 || params.r < 0) return { error: "I and R cannot be negative." };
  return { v: params.i * params.r };
}

export function currentFromVR(params: {
  v: number;
  r: number;
}): { i: number } | { error: string } {
  if (params.v < 0) return { error: "Voltage cannot be negative." };
  if (params.r <= 0) return { error: "Resistance must be positive." };
  return { i: params.v / params.r };
}

export function resistanceFromVI(params: {
  v: number;
  i: number;
}): { r: number } | { error: string } {
  if (params.v < 0) return { error: "Voltage cannot be negative." };
  if (params.i <= 0) return { error: "Current must be positive." };
  return { r: params.v / params.i };
}

export function electricalPower(params: {
  v: number | null;
  i: number | null;
  r: number | null;
}): { pW: number; mode: string } | { error: string } {
  if (params.v != null && params.i != null) {
    return { pW: params.v * params.i, mode: "P = V × I" };
  }
  if (params.i != null && params.r != null) {
    return { pW: params.i ** 2 * params.r, mode: "P = I²R" };
  }
  if (params.v != null && params.r != null) {
    if (params.r <= 0) return { error: "Resistance must be positive for V²/R." };
    return { pW: params.v ** 2 / params.r, mode: "P = V²/R" };
  }
  return { error: "Enter V&I, I&R, or V&R." };
}

export function energyConsumption(params: {
  powerW: number;
  hours: number;
}): { energyWh: number; energyJ: number; energyKwh: number } | { error: string } {
  if (params.powerW < 0 || params.hours < 0) {
    return { error: "Power and hours cannot be negative." };
  }
  const energyWh = params.powerW * params.hours;
  return {
    energyWh,
    energyKwh: energyWh / 1000,
    energyJ: params.powerW * params.hours * 3600,
  };
}

export function seriesResistance(params: {
  ohmsCsv: string;
}): { totalOhm: number; count: number } | { error: string } {
  const rs = parseCsv(params.ohmsCsv);
  if (rs.length < 1) return { error: "Enter at least one resistance (Ω)." };
  if (rs.some((r) => r < 0)) return { error: "Resistances cannot be negative." };
  return { totalOhm: rs.reduce((a, b) => a + b, 0), count: rs.length };
}

export function parallelResistance(params: {
  ohmsCsv: string;
}): { totalOhm: number; count: number } | { error: string } {
  const rs = parseCsv(params.ohmsCsv);
  if (rs.length < 1) return { error: "Enter at least one resistance (Ω)." };
  if (rs.some((r) => r <= 0)) return { error: "Each resistance must be positive." };
  const inv = rs.reduce((s, r) => s + 1 / r, 0);
  return { totalOhm: 1 / inv, count: rs.length };
}

export function capacitorQV(params: {
  qC: number | null;
  v: number | null;
  cF: number | null;
}): { qC: number; v: number; cF: number; solved: string } | { error: string } {
  const known = [params.qC, params.v, params.cF].filter((x) => x != null && x > 0).length;
  if (known < 2) return { error: "Enter any two of Q, V, C (positive) to solve the third." };
  let { qC, v, cF } = params;
  let solved = "check";
  if (qC != null && v != null && (cF == null || cF <= 0)) {
    cF = qC / v;
    solved = "C";
  } else if (qC != null && cF != null && (v == null || v <= 0)) {
    v = qC / cF;
    solved = "V";
  } else if (v != null && cF != null && (qC == null || qC <= 0)) {
    qC = cF * v;
    solved = "Q";
  }
  return { qC: qC!, v: v!, cF: cF!, solved };
}
