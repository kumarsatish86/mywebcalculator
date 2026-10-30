/** Civil steel & reinforcement — estimation only. */

export type CivilSteelSlug =
  | "civil-steel-weight-calculator"
  | "civil-rebar-calculator"
  | "civil-steel-quantity-estimator"
  | "civil-reinforcement-bar-calculator"
  | "civil-bbs-bar-bending-schedule-calculator"
  | "civil-steel-cost-calculator"
  | "civil-lap-length-calculator"
  | "civil-development-length-calculator";

export type CivilSteelInput = {
  diaMm?: number;
  lengthM?: number;
  bars?: number;
  densityKgM3?: number;
  pricePerKg?: number;
  concreteGradeMpa?: number;
  steelFyMpa?: number;
  lapFactor?: number;
  ldFactor?: number;
};

export type CivilSteelResult =
  | { ok: false; error: string }
  | {
      ok: true;
      weightKg?: number;
      totalLengthM?: number;
      unitWeightKgPerM?: number;
      cost?: number;
      lapLengthMm?: number;
      developmentLengthMm?: number;
      note: string;
    };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

/** kg/m ≈ d²/162 (d in mm) — common thumb rule. */
function unitWt(diaMm: number): number {
  return (diaMm * diaMm) / 162;
}

export function computeCivilSteel(slug: CivilSteelSlug, input: CivilSteelInput): CivilSteelResult {
  switch (slug) {
    case "civil-steel-weight-calculator":
    case "civil-rebar-calculator":
    case "civil-reinforcement-bar-calculator":
    case "civil-steel-quantity-estimator":
    case "civil-bbs-bar-bending-schedule-calculator": {
      const d = p(input.diaMm, "Diameter");
      if (typeof d !== "number") return { ok: false, error: d.error };
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const n = p(input.bars ?? 1, "Number of bars");
      if (typeof n !== "number") return { ok: false, error: n.error };
      const uw = unitWt(d);
      const totalLengthM = L * n;
      const weightKg = uw * totalLengthM;
      return {
        ok: true,
        unitWeightKgPerM: uw,
        totalLengthM,
        weightKg,
        note: "Weight from d²/162 rule. BBS cutting lengths need hooks/bends separately.",
      };
    }
    case "civil-steel-cost-calculator": {
      const d = p(input.diaMm, "Diameter");
      if (typeof d !== "number") return { ok: false, error: d.error };
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const n = p(input.bars ?? 1, "Number of bars");
      if (typeof n !== "number") return { ok: false, error: n.error };
      const price = input.pricePerKg ?? 0;
      const weightKg = unitWt(d) * L * n;
      return {
        ok: true,
        weightKg,
        cost: price > 0 ? weightKg * price : undefined,
        note: "Steel cost = weight × unit rate. Add wastage/transport separately.",
      };
    }
    case "civil-lap-length-calculator": {
      const d = p(input.diaMm, "Diameter");
      if (typeof d !== "number") return { ok: false, error: d.error };
      const factor = input.lapFactor && input.lapFactor > 0 ? input.lapFactor : 40;
      return {
        ok: true,
        lapLengthMm: factor * d,
        note: `Lap ≈ ${factor}×d (tension thumb rule). Code clauses govern design laps.`,
      };
    }
    case "civil-development-length-calculator": {
      const d = p(input.diaMm, "Diameter");
      if (typeof d !== "number") return { ok: false, error: d.error };
      const fy = input.steelFyMpa && input.steelFyMpa > 0 ? input.steelFyMpa : 500;
      const fck = input.concreteGradeMpa && input.concreteGradeMpa > 0 ? input.concreteGradeMpa : 25;
      const factor = input.ldFactor && input.ldFactor > 0 ? input.ldFactor : 1;
      // Simplified Ld ≈ (φ×σs)/(4τbd) with τbd ~ 1.2√fck style educational proxy
      const tau = 1.2 * Math.sqrt(fck);
      const sigma = 0.87 * fy;
      const ld = ((d * sigma) / (4 * tau)) * factor;
      return {
        ok: true,
        developmentLengthMm: ld,
        note: "Educational Ld estimate. Use the governing code for design anchorage.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
