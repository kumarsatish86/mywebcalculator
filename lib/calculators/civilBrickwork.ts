/** Civil brickwork & masonry — estimation only. */

export type CivilBrickworkSlug =
  | "civil-brick-calculator"
  | "civil-number-of-bricks-calculator"
  | "civil-mortar-brickwork-calculator"
  | "civil-brick-wall-volume-calculator"
  | "civil-brick-bond-calculator"
  | "civil-block-calculator-aac-concrete"
  | "civil-plaster-brick-wall-calculator";

export type CivilBrickworkInput = {
  lengthM?: number;
  heightM?: number;
  thicknessM?: number;
  brickLMm?: number;
  brickWMm?: number;
  brickHMm?: number;
  mortarThickMm?: number;
  wastePct?: number;
  plasterThickMm?: number;
  openingsM2?: number;
  bondName?: string;
};

export type CivilBrickworkResult =
  | { ok: false; error: string }
  | {
      ok: true;
      wallAreaM2?: number;
      wallVolumeM3?: number;
      bricks?: number;
      mortarM3?: number;
      plasterM3?: number;
      blocks?: number;
      note: string;
    };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeCivilBrickwork(slug: CivilBrickworkSlug, input: CivilBrickworkInput): CivilBrickworkResult {
  const waste = input.wastePct !== undefined && input.wastePct >= 0 ? input.wastePct / 100 : 0.05;
  const open = input.openingsM2 && input.openingsM2 > 0 ? input.openingsM2 : 0;

  const wallArea = () => {
    const L = p(input.lengthM, "Length");
    if (typeof L !== "number") return L;
    const H = p(input.heightM, "Height");
    if (typeof H !== "number") return H;
    return Math.max(0, L * H - open);
  };

  switch (slug) {
    case "civil-brick-wall-volume-calculator": {
      const area = wallArea();
      if (typeof area !== "number") return { ok: false, error: area.error };
      const t = p(input.thicknessM ?? 0.23, "Thickness");
      if (typeof t !== "number") return { ok: false, error: t.error };
      return { ok: true, wallAreaM2: area, wallVolumeM3: area * t, note: "Gross masonry volume (openings deducted from area)." };
    }
    case "civil-brick-calculator":
    case "civil-number-of-bricks-calculator": {
      const area = wallArea();
      if (typeof area !== "number") return { ok: false, error: area.error };
      const bl = (input.brickLMm ?? 190) / 1000;
      const bh = (input.brickHMm ?? 90) / 1000;
      const mt = (input.mortarThickMm ?? 10) / 1000;
      const module = (bl + mt) * (bh + mt);
      const bricks = Math.ceil((area / module) * (1 + waste));
      return { ok: true, wallAreaM2: area, bricks, note: "Brick count from modular size + mortar joint + waste." };
    }
    case "civil-mortar-brickwork-calculator": {
      const area = wallArea();
      if (typeof area !== "number") return { ok: false, error: area.error };
      const t = p(input.thicknessM ?? 0.23, "Thickness");
      if (typeof t !== "number") return { ok: false, error: t.error };
      const mortarFrac = 0.25;
      const mortarM3 = area * t * mortarFrac * (1 + waste);
      return { ok: true, wallAreaM2: area, mortarM3, note: "Rough mortar ~25% of wall volume (site mixes vary)." };
    }
    case "civil-brick-bond-calculator": {
      const area = wallArea();
      if (typeof area !== "number") return { ok: false, error: area.error };
      const bond = (input.bondName ?? "english").toLowerCase();
      const factor = bond.includes("flemish") ? 1.05 : 1;
      const bl = (input.brickLMm ?? 190) / 1000;
      const bh = (input.brickHMm ?? 90) / 1000;
      const mt = (input.mortarThickMm ?? 10) / 1000;
      const bricks = Math.ceil((area / ((bl + mt) * (bh + mt))) * factor * (1 + waste));
      return {
        ok: true,
        wallAreaM2: area,
        bricks,
        note: `${bond} bond estimate (factor ${factor}). Pattern detailing is separate.`,
      };
    }
    case "civil-block-calculator-aac-concrete": {
      const area = wallArea();
      if (typeof area !== "number") return { ok: false, error: area.error };
      const bl = (input.brickLMm ?? 600) / 1000;
      const bh = (input.brickHMm ?? 200) / 1000;
      const mt = (input.mortarThickMm ?? 3) / 1000;
      const blocks = Math.ceil((area / ((bl + mt) * (bh + mt))) * (1 + waste));
      return { ok: true, wallAreaM2: area, blocks, note: "AAC/concrete block count from face module + thin joint." };
    }
    case "civil-plaster-brick-wall-calculator": {
      const area = wallArea();
      if (typeof area !== "number") return { ok: false, error: area.error };
      const thick = (input.plasterThickMm ?? 12) / 1000;
      const plasterM3 = area * thick * 1.3 * (1 + waste);
      return { ok: true, wallAreaM2: area, plasterM3, note: "Plaster wet volume with ~1.3 dry factor on thickness." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
