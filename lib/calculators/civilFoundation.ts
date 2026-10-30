/** Civil foundation & structural quantity — estimation only. */

export type CivilFoundationSlug =
  | "civil-footing-calculator"
  | "civil-foundation-volume-calculator"
  | "civil-column-calculator"
  | "civil-beam-calculator"
  | "civil-slab-calculator"
  | "civil-load-calculation-basic"
  | "civil-structural-weight-calculator"
  | "civil-pile-foundation-calculator";

export type CivilFoundationInput = {
  lengthM?: number;
  widthM?: number;
  depthM?: number;
  heightM?: number;
  diameterM?: number;
  count?: number;
  liveLoadKPa?: number;
  deadLoadKPa?: number;
  densityKgM3?: number;
  piles?: number;
};

export type CivilFoundationResult =
  | { ok: false; error: string }
  | {
      ok: true;
      volumeM3?: number;
      areaM2?: number;
      loadKN?: number;
      weightKg?: number;
      note: string;
    };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeCivilFoundation(
  slug: CivilFoundationSlug,
  input: CivilFoundationInput,
): CivilFoundationResult {
  const n = input.count && input.count > 0 ? input.count : 1;

  switch (slug) {
    case "civil-footing-calculator":
    case "civil-foundation-volume-calculator": {
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      const D = p(input.depthM, "Depth");
      if (typeof D !== "number") return { ok: false, error: D.error };
      return {
        ok: true,
        volumeM3: L * W * D * n,
        areaM2: L * W,
        note: "Footing / foundation concrete volume (rectangular).",
      };
    }
    case "civil-column-calculator": {
      const L = p(input.lengthM, "Breadth");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      const H = p(input.heightM, "Height");
      if (typeof H !== "number") return { ok: false, error: H.error };
      return { ok: true, volumeM3: L * W * H * n, note: "Column concrete volume × count." };
    }
    case "civil-beam-calculator": {
      const L = p(input.lengthM, "Span length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      const D = p(input.depthM, "Depth");
      if (typeof D !== "number") return { ok: false, error: D.error };
      return { ok: true, volumeM3: L * W * D * n, note: "Beam concrete volume × count." };
    }
    case "civil-slab-calculator": {
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      const D = p(input.depthM, "Thickness");
      if (typeof D !== "number") return { ok: false, error: D.error };
      return { ok: true, volumeM3: L * W * D, areaM2: L * W, note: "Slab area and concrete volume." };
    }
    case "civil-load-calculation-basic": {
      const A = (() => {
        const L = p(input.lengthM, "Length");
        if (typeof L !== "number") return L;
        const W = p(input.widthM, "Width");
        if (typeof W !== "number") return W;
        return L * W;
      })();
      if (typeof A !== "number") return { ok: false, error: A.error };
      const ll = input.liveLoadKPa ?? 2;
      const dl = input.deadLoadKPa ?? 1;
      return {
        ok: true,
        areaM2: A,
        loadKN: A * (ll + dl),
        note: "Basic area × (LL+DL) in kN (1 kPa·m² = 1 kN). Not a structural design check.",
      };
    }
    case "civil-structural-weight-calculator": {
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      const D = p(input.depthM ?? input.heightM, "Thickness");
      if (typeof D !== "number") return { ok: false, error: D.error };
      const dens = input.densityKgM3 && input.densityKgM3 > 0 ? input.densityKgM3 : 2500;
      const vol = L * W * D * n;
      return { ok: true, volumeM3: vol, weightKg: vol * dens, note: `Self-weight from volume × ${dens} kg/m³.` };
    }
    case "civil-pile-foundation-calculator": {
      const dia = p(input.diameterM, "Diameter");
      if (typeof dia !== "number") return { ok: false, error: dia.error };
      const H = p(input.heightM ?? input.depthM, "Length");
      if (typeof H !== "number") return { ok: false, error: H.error };
      const piles = input.piles && input.piles > 0 ? input.piles : n;
      const vol = Math.PI * (dia / 2) ** 2 * H * piles;
      return { ok: true, volumeM3: vol, note: "Cylindrical pile concrete volume × pile count." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
