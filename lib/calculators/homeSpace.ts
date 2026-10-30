/** Home space & area — daily-life estimates. */

export type HomeSpaceSlug =
  | "home-room-area-calculator"
  | "home-carpet-area-calculator"
  | "home-built-up-area-calculator"
  | "home-super-built-up-area-calculator"
  | "home-tile-calculator"
  | "home-flooring-cost-calculator"
  | "home-paint-quantity-calculator"
  | "home-wallpaper-calculator";

export type HomeSpaceInput = {
  lengthM?: number;
  widthM?: number;
  heightM?: number;
  carpetFactor?: number;
  loadingPct?: number;
  tileLMm?: number;
  tileWMm?: number;
  wastePct?: number;
  ratePerM2?: number;
  coats?: number;
  coverageM2PerL?: number;
  rollCoverageM2?: number;
};

export type HomeSpaceResult =
  | { ok: false; error: string }
  | {
      ok: true;
      areaM2?: number;
      tiles?: number;
      cost?: number;
      liters?: number;
      rolls?: number;
      note: string;
    };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeHomeSpace(slug: HomeSpaceSlug, input: HomeSpaceInput): HomeSpaceResult {
  const rect = () => {
    const L = p(input.lengthM, "Length");
    if (typeof L !== "number") return L;
    const W = p(input.widthM, "Width");
    if (typeof W !== "number") return W;
    return L * W;
  };

  switch (slug) {
    case "home-room-area-calculator":
    case "home-carpet-area-calculator": {
      const area = rect();
      if (typeof area !== "number") return { ok: false, error: area.error };
      const f = input.carpetFactor && input.carpetFactor > 0 ? input.carpetFactor : 1;
      return { ok: true, areaM2: area * f, note: f === 1 ? "Area = L×W." : `Carpet-style area = L×W×${f}.` };
    }
    case "home-built-up-area-calculator": {
      const area = rect();
      if (typeof area !== "number") return { ok: false, error: area.error };
      return { ok: true, areaM2: area, note: "Built-up ≈ outer L×W (simplified)." };
    }
    case "home-super-built-up-area-calculator": {
      const area = rect();
      if (typeof area !== "number") return { ok: false, error: area.error };
      const load = input.loadingPct !== undefined && input.loadingPct >= 0 ? input.loadingPct / 100 : 0.25;
      return { ok: true, areaM2: area * (1 + load), note: `Super built-up ≈ carpet/built-up × (1+${load * 100}% loading).` };
    }
    case "home-tile-calculator": {
      const area = rect();
      if (typeof area !== "number") return { ok: false, error: area.error };
      const tl = (input.tileLMm ?? 600) / 1000;
      const tw = (input.tileWMm ?? 600) / 1000;
      const waste = input.wastePct !== undefined && input.wastePct >= 0 ? input.wastePct / 100 : 0.1;
      const tiles = Math.ceil((area / (tl * tw)) * (1 + waste));
      return { ok: true, areaM2: area, tiles, note: "Tiles = area ÷ tile face + waste." };
    }
    case "home-flooring-cost-calculator": {
      const area = rect();
      if (typeof area !== "number") return { ok: false, error: area.error };
      const rate = p(input.ratePerM2, "Rate/m²");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return { ok: true, areaM2: area, cost: area * rate, note: "Flooring cost = area × rate." };
    }
    case "home-paint-quantity-calculator": {
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      const H = p(input.heightM ?? 2.7, "Height");
      if (typeof H !== "number") return { ok: false, error: H.error };
      const wall = 2 * (L + W) * H;
      const coats = input.coats && input.coats > 0 ? input.coats : 2;
      const cov = input.coverageM2PerL && input.coverageM2PerL > 0 ? input.coverageM2PerL : 10;
      return { ok: true, areaM2: wall, liters: (wall * coats) / cov, note: `Paint L ≈ wall area × coats ÷ ${cov} m²/L.` };
    }
    case "home-wallpaper-calculator": {
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const H = p(input.heightM ?? 2.7, "Height");
      if (typeof H !== "number") return { ok: false, error: H.error };
      const W = input.widthM && input.widthM > 0 ? input.widthM : L;
      const area = 2 * (L + W) * H;
      const roll = input.rollCoverageM2 && input.rollCoverageM2 > 0 ? input.rollCoverageM2 : 5;
      const waste = input.wastePct !== undefined ? input.wastePct / 100 : 0.1;
      return {
        ok: true,
        areaM2: area,
        rolls: Math.ceil((area * (1 + waste)) / roll),
        note: `Rolls ≈ wall area × (1+waste) ÷ ${roll} m²/roll.`,
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
