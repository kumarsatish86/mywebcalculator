/** Civil concrete & materials — estimation only. */

export type CivilConcreteSlug =
  | "civil-concrete-volume-calculator"
  | "civil-concrete-mix-ratio-calculator"
  | "civil-cement-calculator"
  | "civil-sand-calculator"
  | "civil-aggregate-calculator"
  | "civil-cement-bags-calculator"
  | "civil-dry-to-wet-volume-calculator"
  | "civil-ready-mix-concrete-rmc-calculator"
  | "civil-concrete-cost-calculator"
  | "civil-concrete-strength-estimator";

export type CivilConcreteInput = {
  lengthM?: number;
  widthM?: number;
  depthM?: number;
  volumeM3?: number;
  mixPartsCement?: number;
  mixPartsSand?: number;
  mixPartsAgg?: number;
  dryFactor?: number;
  cementDensityKgM3?: number;
  bagKg?: number;
  cementPricePerBag?: number;
  sandPricePerM3?: number;
  aggPricePerM3?: number;
  rmcPricePerM3?: number;
  targetGradeMpa?: number;
  wastePct?: number;
};

export type CivilConcreteResult =
  | { ok: false; error: string }
  | {
      ok: true;
      volumeM3?: number;
      dryVolumeM3?: number;
      cementM3?: number;
      sandM3?: number;
      aggM3?: number;
      cementKg?: number;
      bags?: number;
      totalCost?: number;
      estimatedMpa?: number;
      note: string;
    };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

/** Nominal mix parts for common grades (cement:sand:agg). */
const GRADE_MIX: Record<number, [number, number, number]> = {
  10: [1, 3, 6],
  15: [1, 2, 4],
  20: [1, 1.5, 3],
  25: [1, 1, 2],
  30: [1, 1, 2],
};

export function computeCivilConcrete(slug: CivilConcreteSlug, input: CivilConcreteInput): CivilConcreteResult {
  const dryF = input.dryFactor && input.dryFactor > 0 ? input.dryFactor : 1.54;
  const dens = input.cementDensityKgM3 && input.cementDensityKgM3 > 0 ? input.cementDensityKgM3 : 1440;
  const bag = input.bagKg && input.bagKg > 0 ? input.bagKg : 50;
  const waste = input.wastePct !== undefined && input.wastePct >= 0 ? input.wastePct / 100 : 0.02;

  const volFromDims = () => {
    const L = p(input.lengthM, "Length");
    if (typeof L !== "number") return L;
    const W = p(input.widthM, "Width");
    if (typeof W !== "number") return W;
    const D = p(input.depthM, "Depth");
    if (typeof D !== "number") return D;
    return L * W * D * (1 + waste);
  };

  const resolveVolume = (): number | { error: string } => {
    if (input.volumeM3 !== undefined && Number.isFinite(input.volumeM3) && input.volumeM3 > 0) {
      return input.volumeM3 * (1 + waste);
    }
    return volFromDims();
  };

  const mixParts = (): [number, number, number] | { error: string } => {
    if (input.targetGradeMpa && GRADE_MIX[input.targetGradeMpa]) {
      return GRADE_MIX[input.targetGradeMpa];
    }
    const c = p(input.mixPartsCement ?? 1, "Cement parts");
    if (typeof c !== "number") return c;
    const s = p(input.mixPartsSand ?? 1.5, "Sand parts");
    if (typeof s !== "number") return s;
    const a = p(input.mixPartsAgg ?? 3, "Aggregate parts");
    if (typeof a !== "number") return a;
    return [c, s, a];
  };

  switch (slug) {
    case "civil-concrete-volume-calculator": {
      const v = resolveVolume();
      if (typeof v !== "number") return { ok: false, error: v.error };
      return { ok: true, volumeM3: v, note: "Rectangular pour volume with optional waste allowance." };
    }
    case "civil-dry-to-wet-volume-calculator": {
      const wet = p(input.volumeM3, "Wet volume");
      if (typeof wet !== "number") return { ok: false, error: wet.error };
      return {
        ok: true,
        volumeM3: wet,
        dryVolumeM3: wet * dryF,
        note: `Dry volume ≈ wet × ${dryF} (bulking / voids factor; site practice varies).`,
      };
    }
    case "civil-concrete-mix-ratio-calculator":
    case "civil-cement-calculator":
    case "civil-sand-calculator":
    case "civil-aggregate-calculator":
    case "civil-cement-bags-calculator": {
      const wet = resolveVolume();
      if (typeof wet !== "number") return { ok: false, error: wet.error };
      const mix = mixParts();
      if (!Array.isArray(mix)) return { ok: false, error: mix.error };
      const [c, s, a] = mix;
      const sum = c + s + a;
      const dry = wet * dryF;
      const cementM3 = (dry * c) / sum;
      const sandM3 = (dry * s) / sum;
      const aggM3 = (dry * a) / sum;
      const cementKg = cementM3 * dens;
      const bags = cementKg / bag;
      return {
        ok: true,
        volumeM3: wet,
        dryVolumeM3: dry,
        cementM3,
        sandM3,
        aggM3,
        cementKg,
        bags,
        note: `Mix ${c}:${s}:${a}. Educational nominal proportions — not a design mix.`,
      };
    }
    case "civil-ready-mix-concrete-rmc-calculator": {
      const wet = resolveVolume();
      if (typeof wet !== "number") return { ok: false, error: wet.error };
      const price = input.rmcPricePerM3 ?? 0;
      return {
        ok: true,
        volumeM3: wet,
        totalCost: price > 0 ? wet * price : undefined,
        note: "RMC order volume with waste. Confirm plant tolerances and slump separately.",
      };
    }
    case "civil-concrete-cost-calculator": {
      const wet = resolveVolume();
      if (typeof wet !== "number") return { ok: false, error: wet.error };
      const mix = mixParts();
      if (!Array.isArray(mix)) return { ok: false, error: mix.error };
      const [c, s, a] = mix;
      const sum = c + s + a;
      const dry = wet * dryF;
      const cementM3 = (dry * c) / sum;
      const sandM3 = (dry * s) / sum;
      const aggM3 = (dry * a) / sum;
      const bags = (cementM3 * dens) / bag;
      const cost =
        bags * (input.cementPricePerBag ?? 0) +
        sandM3 * (input.sandPricePerM3 ?? 0) +
        aggM3 * (input.aggPricePerM3 ?? 0);
      return {
        ok: true,
        volumeM3: wet,
        bags,
        sandM3,
        aggM3,
        totalCost: cost,
        note: "Material cost from bagged cement + sand + aggregate unit rates.",
      };
    }
    case "civil-concrete-strength-estimator": {
      const grade = p(input.targetGradeMpa ?? 20, "Target grade (MPa)");
      if (typeof grade !== "number") return { ok: false, error: grade.error };
      return {
        ok: true,
        estimatedMpa: grade,
        note: `Nominal target ~${grade} MPa (M${grade}). Cube/cylinder testing governs actual strength.`,
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
