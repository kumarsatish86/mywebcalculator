/** Civil water & plumbing — estimation only. */

export type CivilWaterSlug =
  | "civil-water-tank-volume-calculator"
  | "civil-pipe-volume-calculator"
  | "civil-flow-rate-calculator-civil"
  | "civil-drainage-calculator"
  | "civil-rainwater-harvesting-calculator"
  | "civil-plumbing-material-calculator";

export type CivilWaterInput = {
  lengthM?: number;
  widthM?: number;
  heightM?: number;
  diameterM?: number;
  radiusM?: number;
  shape?: string;
  velocityMs?: number;
  areaM2?: number;
  rainfallMm?: number;
  runoffCoeff?: number;
  pipeDiaMm?: number;
  pipeLengthM?: number;
  fittings?: number;
};

export type CivilWaterResult =
  | { ok: false; error: string }
  | {
      ok: true;
      volumeM3?: number;
      volumeL?: number;
      flowM3s?: number;
      flowLps?: number;
      harvestM3?: number;
      pipeLengthM?: number;
      note: string;
    };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeCivilWater(slug: CivilWaterSlug, input: CivilWaterInput): CivilWaterResult {
  switch (slug) {
    case "civil-water-tank-volume-calculator": {
      const shape = (input.shape ?? "rect").toLowerCase();
      let vol: number;
      if (shape === "cylinder" || shape === "circular") {
        const r = p(input.radiusM ?? (input.diameterM ? input.diameterM / 2 : undefined), "Radius");
        if (typeof r !== "number") return { ok: false, error: r.error };
        const H = p(input.heightM, "Height");
        if (typeof H !== "number") return { ok: false, error: H.error };
        vol = Math.PI * r * r * H;
      } else {
        const L = p(input.lengthM, "Length");
        if (typeof L !== "number") return { ok: false, error: L.error };
        const W = p(input.widthM, "Width");
        if (typeof W !== "number") return { ok: false, error: W.error };
        const H = p(input.heightM, "Height");
        if (typeof H !== "number") return { ok: false, error: H.error };
        vol = L * W * H;
      }
      return { ok: true, volumeM3: vol, volumeL: vol * 1000, note: "Tank capacity (full). Freeboard reduces usable volume." };
    }
    case "civil-pipe-volume-calculator": {
      const d = p(input.diameterM ?? (input.pipeDiaMm ? input.pipeDiaMm / 1000 : undefined), "Diameter");
      if (typeof d !== "number") return { ok: false, error: d.error };
      const L = p(input.lengthM ?? input.pipeLengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const vol = Math.PI * (d / 2) ** 2 * L;
      return { ok: true, volumeM3: vol, volumeL: vol * 1000, note: "Internal pipe volume (full bore)." };
    }
    case "civil-flow-rate-calculator-civil": {
      const v = p(input.velocityMs, "Velocity");
      if (typeof v !== "number") return { ok: false, error: v.error };
      let area: number;
      if (input.areaM2 && input.areaM2 > 0) {
        area = input.areaM2;
      } else {
        const d = p(input.diameterM ?? (input.pipeDiaMm ? input.pipeDiaMm / 1000 : undefined), "Diameter");
        if (typeof d !== "number") return { ok: false, error: d.error };
        area = Math.PI * (d / 2) ** 2;
      }
      const q = area * v;
      return { ok: true, flowM3s: q, flowLps: q * 1000, note: "Q = A×v. Continuity only — not a pump/curve design." };
    }
    case "civil-drainage-calculator": {
      const A = p(input.areaM2, "Catchment area");
      if (typeof A !== "number") return { ok: false, error: A.error };
      const rain = p(input.rainfallMm, "Rainfall intensity (mm)");
      if (typeof rain !== "number") return { ok: false, error: rain.error };
      const C = input.runoffCoeff && input.runoffCoeff > 0 ? input.runoffCoeff : 0.7;
      // Rational-ish: Q(m3/s) ≈ C·i·A with i in m/s if rain is mm over 1 hour → mm/h / 3.6e6
      const iMs = rain / 1000 / 3600;
      const q = C * iMs * A;
      return {
        ok: true,
        flowM3s: q,
        flowLps: q * 1000,
        note: "Educational runoff from C·i·A (rainfall treated as mm/h intensity).",
      };
    }
    case "civil-rainwater-harvesting-calculator": {
      const A = p(input.areaM2, "Roof / catchment area");
      if (typeof A !== "number") return { ok: false, error: A.error };
      const rain = p(input.rainfallMm, "Rainfall (mm)");
      if (typeof rain !== "number") return { ok: false, error: rain.error };
      const C = input.runoffCoeff && input.runoffCoeff > 0 ? input.runoffCoeff : 0.8;
      const harvest = A * (rain / 1000) * C;
      return {
        ok: true,
        harvestM3: harvest,
        volumeL: harvest * 1000,
        note: "Harvest ≈ area × rainfall depth × runoff coefficient.",
      };
    }
    case "civil-plumbing-material-calculator": {
      const L = p(input.pipeLengthM ?? input.lengthM, "Pipe length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const fittings = input.fittings && input.fittings >= 0 ? input.fittings : Math.ceil(L / 3);
      return {
        ok: true,
        pipeLengthM: L,
        note: `Pipe run ${L} m with ~${fittings} fittings allowance (rule of thumb).`,
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
