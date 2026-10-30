/** Civil area & volume measurement — estimation only. */

export type CivilAreaVolumeSlug =
  | "civil-area-calculator-shapes"
  | "civil-volume-calculator"
  | "civil-perimeter-calculator"
  | "civil-floor-area-calculator"
  | "civil-built-up-area-calculator"
  | "civil-carpet-area-calculator"
  | "civil-plot-area-calculator"
  | "civil-excavation-volume-calculator";

export type CivilAreaVolumeInput = {
  lengthM?: number;
  widthM?: number;
  heightM?: number;
  radiusM?: number;
  shape?: string;
  sides?: number;
  sideM?: number;
  builtUpM2?: number;
  carpetFactor?: number;
  depthM?: number;
};

export type CivilAreaVolumeResult =
  | { ok: false; error: string }
  | {
      ok: true;
      areaM2?: number;
      volumeM3?: number;
      perimeterM?: number;
      carpetM2?: number;
      builtUpM2?: number;
      note: string;
    };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeCivilAreaVolume(slug: CivilAreaVolumeSlug, input: CivilAreaVolumeInput): CivilAreaVolumeResult {
  switch (slug) {
    case "civil-area-calculator-shapes": {
      const shape = (input.shape ?? "rectangle").toLowerCase();
      if (shape === "circle") {
        const r = p(input.radiusM, "Radius");
        if (typeof r !== "number") return { ok: false, error: r.error };
        return { ok: true, areaM2: Math.PI * r * r, note: "Circle area πr²." };
      }
      if (shape === "triangle") {
        const L = p(input.lengthM, "Base");
        if (typeof L !== "number") return { ok: false, error: L.error };
        const W = p(input.widthM, "Height");
        if (typeof W !== "number") return { ok: false, error: W.error };
        return { ok: true, areaM2: 0.5 * L * W, note: "Triangle area ½×base×height." };
      }
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      return { ok: true, areaM2: L * W, note: "Rectangle / square plan area." };
    }
    case "civil-volume-calculator": {
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      const H = p(input.heightM ?? input.depthM, "Height/depth");
      if (typeof H !== "number") return { ok: false, error: H.error };
      return { ok: true, volumeM3: L * W * H, note: "Rectangular prism volume." };
    }
    case "civil-perimeter-calculator": {
      if (input.sides && input.sideM) {
        const n = p(input.sides, "Sides");
        if (typeof n !== "number") return { ok: false, error: n.error };
        const s = p(input.sideM, "Side length");
        if (typeof s !== "number") return { ok: false, error: s.error };
        return { ok: true, perimeterM: n * s, note: "Regular polygon perimeter n×side." };
      }
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      return { ok: true, perimeterM: 2 * (L + W), note: "Rectangle perimeter 2(L+W)." };
    }
    case "civil-floor-area-calculator":
    case "civil-plot-area-calculator": {
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      return {
        ok: true,
        areaM2: L * W,
        note: slug.includes("plot") ? "Plot / site area (rectangle)." : "Floor plate area (rectangle).",
      };
    }
    case "civil-built-up-area-calculator": {
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      return { ok: true, builtUpM2: L * W, areaM2: L * W, note: "Built-up ≈ outer dimensions product (simplified)." };
    }
    case "civil-carpet-area-calculator": {
      const built =
        input.builtUpM2 && input.builtUpM2 > 0
          ? input.builtUpM2
          : (() => {
              const L = input.lengthM;
              const W = input.widthM;
              if (!L || !W || L <= 0 || W <= 0) return undefined;
              return L * W;
            })();
      if (!built) return { ok: false, error: "Provide built-up area or length×width." };
      const f = input.carpetFactor && input.carpetFactor > 0 && input.carpetFactor <= 1 ? input.carpetFactor : 0.7;
      return {
        ok: true,
        builtUpM2: built,
        carpetM2: built * f,
        note: `Carpet ≈ built-up × ${f} (rule of thumb; legal definitions vary by region).`,
      };
    }
    case "civil-excavation-volume-calculator": {
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      const D = p(input.depthM ?? input.heightM, "Depth");
      if (typeof D !== "number") return { ok: false, error: D.error };
      return { ok: true, volumeM3: L * W * D, note: "Excavation bank volume (no bulking). Add swell separately." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
