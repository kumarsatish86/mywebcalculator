/** Civil plastering & finishing — estimation only. */

export type CivilPlasteringSlug =
  | "civil-plastering-calculator"
  | "civil-wall-plaster-calculator"
  | "civil-ceiling-plaster-calculator"
  | "civil-paint-quantity-calculator"
  | "civil-tile-calculator"
  | "civil-flooring-material-calculator"
  | "civil-putty-calculator";

export type CivilPlasteringInput = {
  lengthM?: number;
  widthM?: number;
  heightM?: number;
  thicknessMm?: number;
  coats?: number;
  coverageM2PerL?: number;
  paintLitersPerCoat?: number;
  tileLMm?: number;
  tileWMm?: number;
  wastePct?: number;
  openingsM2?: number;
  puttyKgPerM2?: number;
};

export type CivilPlasteringResult =
  | { ok: false; error: string }
  | {
      ok: true;
      areaM2?: number;
      plasterM3?: number;
      paintL?: number;
      tiles?: number;
      puttyKg?: number;
      flooringM2?: number;
      note: string;
    };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeCivilPlastering(slug: CivilPlasteringSlug, input: CivilPlasteringInput): CivilPlasteringResult {
  const waste = input.wastePct !== undefined && input.wastePct >= 0 ? input.wastePct / 100 : 0.05;
  const open = input.openingsM2 && input.openingsM2 > 0 ? input.openingsM2 : 0;

  const wallArea = () => {
    const L = p(input.lengthM, "Length");
    if (typeof L !== "number") return L;
    const H = p(input.heightM, "Height");
    if (typeof H !== "number") return H;
    return Math.max(0, L * H - open);
  };

  const floorArea = () => {
    const L = p(input.lengthM, "Length");
    if (typeof L !== "number") return L;
    const W = p(input.widthM, "Width");
    if (typeof W !== "number") return W;
    return L * W;
  };

  switch (slug) {
    case "civil-plastering-calculator":
    case "civil-wall-plaster-calculator": {
      const area = wallArea();
      if (typeof area !== "number") return { ok: false, error: area.error };
      const t = (input.thicknessMm ?? 12) / 1000;
      return {
        ok: true,
        areaM2: area,
        plasterM3: area * t * 1.3 * (1 + waste),
        note: "Wall plaster volume with dry factor 1.3 + waste.",
      };
    }
    case "civil-ceiling-plaster-calculator": {
      const area = floorArea();
      if (typeof area !== "number") return { ok: false, error: area.error };
      const t = (input.thicknessMm ?? 10) / 1000;
      return {
        ok: true,
        areaM2: area,
        plasterM3: area * t * 1.3 * (1 + waste),
        note: "Ceiling plaster from plan area × thickness.",
      };
    }
    case "civil-paint-quantity-calculator": {
      const area = wallArea();
      if (typeof area !== "number") return { ok: false, error: area.error };
      const coats = input.coats && input.coats > 0 ? input.coats : 2;
      const cov = input.coverageM2PerL && input.coverageM2PerL > 0 ? input.coverageM2PerL : 10;
      const paintL = ((area * coats) / cov) * (1 + waste);
      return { ok: true, areaM2: area, paintL, note: `Paint liters for ${coats} coat(s) at ~${cov} m²/L.` };
    }
    case "civil-tile-calculator":
    case "civil-flooring-material-calculator": {
      const area = floorArea();
      if (typeof area !== "number") return { ok: false, error: area.error };
      const tl = (input.tileLMm ?? 600) / 1000;
      const tw = (input.tileWMm ?? 600) / 1000;
      const tiles = Math.ceil((area / (tl * tw)) * (1 + waste));
      return {
        ok: true,
        flooringM2: area,
        areaM2: area,
        tiles,
        note: "Tile / flooring piece count from area ÷ tile face + waste.",
      };
    }
    case "civil-putty-calculator": {
      const area = wallArea();
      if (typeof area !== "number") return { ok: false, error: area.error };
      const rate = input.puttyKgPerM2 && input.puttyKgPerM2 > 0 ? input.puttyKgPerM2 : 1.5;
      return {
        ok: true,
        areaM2: area,
        puttyKg: area * rate * (1 + waste),
        note: `Putty ≈ ${rate} kg/m² × area (product datasheets vary).`,
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
