/** Home water utility — daily-life estimates. */

export type HomeWaterSlug =
  | "home-water-consumption-household-calculator"
  | "home-daily-water-usage-calculator"
  | "home-monthly-water-bill-calculator"
  | "home-rainwater-harvesting-calculator"
  | "home-water-tank-capacity-calculator"
  | "home-borewell-depth-estimator"
  | "home-pipe-flow-rate-calculator"
  | "home-water-pressure-calculator"
  | "home-leak-loss-calculator";

export type HomeWaterInput = {
  people?: number;
  litersPerPerson?: number;
  days?: number;
  ratePerKl?: number;
  areaM2?: number;
  rainfallMm?: number;
  runoff?: number;
  lengthM?: number;
  widthM?: number;
  heightM?: number;
  diameterM?: number;
  velocityMs?: number;
  headM?: number;
  leakLpm?: number;
  hours?: number;
};

export type HomeWaterResult =
  | { ok: false; error: string }
  | {
      ok: true;
      liters?: number;
      cost?: number;
      volumeM3?: number;
      flowLps?: number;
      pressureKPa?: number;
      depthM?: number;
      note: string;
    };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeHomeWater(slug: HomeWaterSlug, input: HomeWaterInput): HomeWaterResult {
  switch (slug) {
    case "home-water-consumption-household-calculator":
    case "home-daily-water-usage-calculator": {
      const people = p(input.people, "People");
      if (typeof people !== "number") return { ok: false, error: people.error };
      const lpp = p(input.litersPerPerson ?? 135, "L/person/day");
      if (typeof lpp !== "number") return { ok: false, error: lpp.error };
      const days = input.days && input.days > 0 ? input.days : 1;
      return { ok: true, liters: people * lpp * days, note: `Usage = people × L/person × ${days} day(s).` };
    }
    case "home-monthly-water-bill-calculator": {
      const liters = p(input.litersPerPerson ?? input.people, "Monthly liters");
      // Prefer liters via areaM2 misuse - use rainfallMm as kl? Better: people*lpp*30 or explicit liters in lengthM
      const monthlyL =
        input.lengthM && input.lengthM > 0
          ? input.lengthM
          : (() => {
              const people = input.people ?? 0;
              const lpp = input.litersPerPerson ?? 135;
              return people > 0 ? people * lpp * 30 : 0;
            })();
      if (monthlyL <= 0) return { ok: false, error: "Provide monthly liters (lengthM) or people × L/person." };
      const rate = p(input.ratePerKl ?? 20, "Rate per kL");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return { ok: true, liters: monthlyL, cost: (monthlyL / 1000) * rate, note: "Bill ≈ (liters/1000)×rate/kL." };
    }
    case "home-rainwater-harvesting-calculator": {
      const area = p(input.areaM2, "Catchment m²");
      if (typeof area !== "number") return { ok: false, error: area.error };
      const rain = p(input.rainfallMm, "Rainfall mm");
      if (typeof rain !== "number") return { ok: false, error: rain.error };
      const c = input.runoff && input.runoff > 0 ? input.runoff : 0.8;
      const liters = area * (rain / 1000) * c * 1000;
      return { ok: true, liters, volumeM3: liters / 1000, note: "Harvest ≈ area × rainfall × runoff coeff." };
    }
    case "home-water-tank-capacity-calculator": {
      if (input.diameterM && input.heightM) {
        const d = p(input.diameterM, "Diameter");
        if (typeof d !== "number") return { ok: false, error: d.error };
        const h = p(input.heightM, "Height");
        if (typeof h !== "number") return { ok: false, error: h.error };
        const vol = Math.PI * (d / 2) ** 2 * h;
        return { ok: true, volumeM3: vol, liters: vol * 1000, note: "Cylinder tank volume." };
      }
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      const H = p(input.heightM, "Height");
      if (typeof H !== "number") return { ok: false, error: H.error };
      const vol = L * W * H;
      return { ok: true, volumeM3: vol, liters: vol * 1000, note: "Rectangular tank volume." };
    }
    case "home-borewell-depth-estimator": {
      const head = p(input.headM ?? input.heightM, "Target head / depth hint");
      if (typeof head !== "number") return { ok: false, error: head.error };
      return {
        ok: true,
        depthM: head,
        note: "Educational depth placeholder — actual borewells need hydrogeology / local drilling data.",
      };
    }
    case "home-pipe-flow-rate-calculator": {
      const d = p(input.diameterM, "Diameter m");
      if (typeof d !== "number") return { ok: false, error: d.error };
      const v = p(input.velocityMs ?? 1, "Velocity m/s");
      if (typeof v !== "number") return { ok: false, error: v.error };
      const q = Math.PI * (d / 2) ** 2 * v;
      return { ok: true, flowLps: q * 1000, volumeM3: q, note: "Q = A×v (full pipe)." };
    }
    case "home-water-pressure-calculator": {
      const head = p(input.headM, "Head height m");
      if (typeof head !== "number") return { ok: false, error: head.error };
      // ρgh ≈ 9.81 kPa per meter
      return { ok: true, pressureKPa: head * 9.81, note: "Static pressure ≈ 9.81 kPa × head (m)." };
    }
    case "home-leak-loss-calculator": {
      const lpm = p(input.leakLpm, "Leak L/min");
      if (typeof lpm !== "number") return { ok: false, error: lpm.error };
      const hrs = p(input.hours ?? 24, "Hours");
      if (typeof hrs !== "number") return { ok: false, error: hrs.error };
      return { ok: true, liters: lpm * 60 * hrs, note: "Loss = L/min × 60 × hours." };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
