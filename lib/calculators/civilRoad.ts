/** Civil road & infrastructure — estimation only. */

export type CivilRoadSlug =
  | "civil-road-construction-calculator"
  | "civil-asphalt-calculator"
  | "civil-bitumen-quantity-calculator"
  | "civil-road-base-material-calculator"
  | "civil-pavement-thickness-calculator"
  | "civil-road-cost-calculator";

export type CivilRoadInput = {
  lengthM?: number;
  widthM?: number;
  thicknessM?: number;
  densityKgM3?: number;
  bitumenPct?: number;
  layers?: number;
  costPerM3?: number;
  costPerM2?: number;
};

export type CivilRoadResult =
  | { ok: false; error: string }
  | {
      ok: true;
      areaM2?: number;
      volumeM3?: number;
      massKg?: number;
      bitumenKg?: number;
      thicknessM?: number;
      totalCost?: number;
      note: string;
    };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeCivilRoad(slug: CivilRoadSlug, input: CivilRoadInput): CivilRoadResult {
  const areaVol = () => {
    const L = p(input.lengthM, "Length");
    if (typeof L !== "number") return L;
    const W = p(input.widthM, "Width");
    if (typeof W !== "number") return W;
    const T = p(input.thicknessM, "Thickness");
    if (typeof T !== "number") return T;
    return { area: L * W, vol: L * W * T, T };
  };

  switch (slug) {
    case "civil-road-construction-calculator":
    case "civil-asphalt-calculator":
    case "civil-road-base-material-calculator": {
      const av = areaVol();
      if (!("area" in av)) return { ok: false, error: av.error };
      const dens = input.densityKgM3 && input.densityKgM3 > 0 ? input.densityKgM3 : 2300;
      return {
        ok: true,
        areaM2: av.area,
        volumeM3: av.vol,
        massKg: av.vol * dens,
        note: "Course volume and mass from length × width × thickness.",
      };
    }
    case "civil-bitumen-quantity-calculator": {
      const av = areaVol();
      if (!("area" in av)) return { ok: false, error: av.error };
      const dens = input.densityKgM3 && input.densityKgM3 > 0 ? input.densityKgM3 : 2300;
      const pct = input.bitumenPct && input.bitumenPct > 0 ? input.bitumenPct / 100 : 0.05;
      const mass = av.vol * dens;
      return {
        ok: true,
        volumeM3: av.vol,
        massKg: mass,
        bitumenKg: mass * pct,
        note: `Bitumen ≈ ${pct * 100}% of mix mass (mix design governs).`,
      };
    }
    case "civil-pavement-thickness-calculator": {
      const layers = input.layers && input.layers > 0 ? input.layers : 1;
      const t = p(input.thicknessM ?? 0.05, "Layer thickness");
      if (typeof t !== "number") return { ok: false, error: t.error };
      return {
        ok: true,
        thicknessM: t * layers,
        note: `Total thickness ≈ ${layers} × layer thickness. Structural design is separate.`,
      };
    }
    case "civil-road-cost-calculator": {
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      const area = L * W;
      if (input.costPerM2 && input.costPerM2 > 0) {
        return { ok: true, areaM2: area, totalCost: area * input.costPerM2, note: "Cost from area × rate/m²." };
      }
      const T = p(input.thicknessM, "Thickness");
      if (typeof T !== "number") return { ok: false, error: T.error };
      const vol = area * T;
      const rate = input.costPerM3 ?? 0;
      return {
        ok: true,
        areaM2: area,
        volumeM3: vol,
        totalCost: rate > 0 ? vol * rate : undefined,
        note: "Cost from volume × rate/m³ (or provide cost/m²).",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
