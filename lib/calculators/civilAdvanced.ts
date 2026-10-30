/** Civil advanced / niche — estimation only. */

export type CivilAdvancedSlug =
  | "civil-earthwork-calculator"
  | "civil-retaining-wall-calculator"
  | "civil-staircase-calculator"
  | "civil-formwork-calculator"
  | "civil-shuttering-calculator"
  | "civil-scaffolding-calculator"
  | "civil-wind-load-calculator"
  | "civil-seismic-load-calculator"
  | "civil-bearing-capacity-calculator"
  | "civil-soil-compaction-calculator";

export type CivilAdvancedInput = {
  lengthM?: number;
  widthM?: number;
  heightM?: number;
  depthM?: number;
  thicknessM?: number;
  risers?: number;
  riserMm?: number;
  treadMm?: number;
  areaM2?: number;
  pressureKPa?: number;
  windSpeedMs?: number;
  Cd?: number;
  seismicCoeff?: number;
  weightKN?: number;
  cohesionKPa?: number;
  gammaKN?: number;
  footingWidthM?: number;
  dryDensity?: number;
  bulkDensity?: number;
  moisturePct?: number;
  maxDryDensity?: number;
};

export type CivilAdvancedResult =
  | { ok: false; error: string }
  | {
      ok: true;
      volumeM3?: number;
      areaM2?: number;
      risers?: number;
      goingM?: number;
      loadKN?: number;
      bearingKPa?: number;
      compactionPct?: number;
      note: string;
    };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeCivilAdvanced(slug: CivilAdvancedSlug, input: CivilAdvancedInput): CivilAdvancedResult {
  switch (slug) {
    case "civil-earthwork-calculator": {
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      const D = p(input.depthM ?? input.heightM, "Depth");
      if (typeof D !== "number") return { ok: false, error: D.error };
      return { ok: true, volumeM3: L * W * D, note: "Earthwork bank volume. Apply bulking/shrinkage factors on site." };
    }
    case "civil-retaining-wall-calculator": {
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const H = p(input.heightM, "Height");
      if (typeof H !== "number") return { ok: false, error: H.error };
      const T = p(input.thicknessM, "Thickness");
      if (typeof T !== "number") return { ok: false, error: T.error };
      return {
        ok: true,
        volumeM3: L * H * T,
        areaM2: L * H,
        note: "Stem concrete volume only. Stability (sliding/overturning) is a design check.",
      };
    }
    case "civil-staircase-calculator": {
      const H = p(input.heightM, "Total rise");
      if (typeof H !== "number") return { ok: false, error: H.error };
      const riserMm = input.riserMm && input.riserMm > 0 ? input.riserMm : 175;
      const treadMm = input.treadMm && input.treadMm > 0 ? input.treadMm : 250;
      const risers = input.risers && input.risers > 0 ? input.risers : Math.ceil((H * 1000) / riserMm);
      const goingM = ((risers - 1) * treadMm) / 1000;
      return {
        ok: true,
        risers,
        goingM,
        note: `~${risers} risers @ ${riserMm} mm; going ≈ ${goingM.toFixed(2)} m. Check local stair rules.`,
      };
    }
    case "civil-formwork-calculator":
    case "civil-shuttering-calculator": {
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      const H = p(input.heightM ?? input.depthM, "Height/depth");
      if (typeof H !== "number") return { ok: false, error: H.error };
      // Contact area for a rectangular beam/column-ish: 2(L+W)*H + LW optional soffit
      const sides = 2 * (L + W) * H;
      const soffit = L * W;
      return {
        ok: true,
        areaM2: sides + soffit,
        note: "Shuttering contact area ≈ sides + soffit (reusable sets not modeled).",
      };
    }
    case "civil-scaffolding-calculator": {
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const H = p(input.heightM, "Height");
      if (typeof H !== "number") return { ok: false, error: H.error };
      return {
        ok: true,
        areaM2: L * H,
        note: "Scaffold face area L×H for rough hire/coverage. Bay design is separate.",
      };
    }
    case "civil-wind-load-calculator": {
      const A = p(input.areaM2, "Area");
      if (typeof A !== "number") return { ok: false, error: A.error };
      const v = p(input.windSpeedMs, "Wind speed");
      if (typeof v !== "number") return { ok: false, error: v.error };
      const Cd = input.Cd && input.Cd > 0 ? input.Cd : 1.2;
      const q = 0.5 * 1.225 * v * v;
      const F = q * Cd * A;
      return {
        ok: true,
        loadKN: F / 1000,
        note: "Educational F = ½ρv²·Cd·A (ρ=1.225). Codes use terrain/gust factors.",
      };
    }
    case "civil-seismic-load-calculator": {
      const W = p(input.weightKN, "Seismic weight");
      if (typeof W !== "number") return { ok: false, error: W.error };
      const ah = input.seismicCoeff && input.seismicCoeff > 0 ? input.seismicCoeff : 0.1;
      return {
        ok: true,
        loadKN: W * ah,
        note: `Base shear proxy V ≈ Ah×W with Ah=${ah}. Not a response-spectrum design.`,
      };
    }
    case "civil-bearing-capacity-calculator": {
      const c = input.cohesionKPa ?? 0;
      const gamma = input.gammaKN && input.gammaKN > 0 ? input.gammaKN : 18;
      const B = p(input.footingWidthM, "Footing width");
      if (typeof B !== "number") return { ok: false, error: B.error };
      const D = input.depthM && input.depthM > 0 ? input.depthM : 1;
      // Terzaghi-ish for φ=0: qu ≈ 5.14c + γD
      const qu = 5.14 * c + gamma * D;
      return {
        ok: true,
        bearingKPa: qu,
        note: "Undrained φ=0 ultimate proxy 5.14c+γD. Use site investigation + code factors.",
      };
    }
    case "civil-soil-compaction-calculator": {
      const dd = p(input.dryDensity, "Dry density");
      if (typeof dd !== "number") return { ok: false, error: dd.error };
      const mdd = p(input.maxDryDensity, "Max dry density");
      if (typeof mdd !== "number") return { ok: false, error: mdd.error };
      return {
        ok: true,
        compactionPct: (dd / mdd) * 100,
        note: "Relative compaction = (γd / MDD) × 100%. Field method (sand cone/nuclear) separate.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
