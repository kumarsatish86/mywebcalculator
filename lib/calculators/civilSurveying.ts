/** Civil surveying & leveling — estimation only. */

export type CivilSurveyingSlug =
  | "civil-leveling-calculator"
  | "civil-elevation-calculator"
  | "civil-slope-calculator-civil"
  | "civil-land-survey-calculator"
  | "civil-cut-fill-calculator";

export type CivilSurveyingInput = {
  bs?: number;
  isReading?: number;
  fs?: number;
  knownRL?: number;
  rise?: number;
  run?: number;
  lengthM?: number;
  widthM?: number;
  cutDepthM?: number;
  fillDepthM?: number;
  areaM2?: number;
};

export type CivilSurveyingResult =
  | { ok: false; error: string }
  | {
      ok: true;
      rl?: number;
      hi?: number;
      slopePct?: number;
      slopeRatio?: string;
      areaM2?: number;
      cutM3?: number;
      fillM3?: number;
      netM3?: number;
      note: string;
    };

function fin(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n)) return { error: `${label} must be a number.` };
  return n;
}

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeCivilSurveying(
  slug: CivilSurveyingSlug,
  input: CivilSurveyingInput,
): CivilSurveyingResult {
  switch (slug) {
    case "civil-leveling-calculator":
    case "civil-elevation-calculator": {
      const bs = fin(input.bs, "Backsight");
      if (typeof bs !== "number") return { ok: false, error: bs.error };
      const rl = fin(input.knownRL, "Known RL");
      if (typeof rl !== "number") return { ok: false, error: rl.error };
      const hi = rl + bs;
      const reading = input.fs ?? input.isReading;
      if (reading === undefined || !Number.isFinite(reading)) {
        return { ok: true, hi, rl, note: "HI = RL + BS. Enter FS/IS to get next RL." };
      }
      return {
        ok: true,
        hi,
        rl: hi - reading,
        note: "RL = HI − foresight/intermediate sight.",
      };
    }
    case "civil-slope-calculator-civil": {
      const rise = fin(input.rise, "Rise");
      if (typeof rise !== "number") return { ok: false, error: rise.error };
      const run = p(input.run, "Run");
      if (typeof run !== "number") return { ok: false, error: run.error };
      const pct = (rise / run) * 100;
      const ratio = `1:${(run / Math.abs(rise)).toFixed(2)}`;
      return { ok: true, slopePct: pct, slopeRatio: ratio, note: "Slope % = (rise/run)×100; also as 1:n." };
    }
    case "civil-land-survey-calculator": {
      const L = p(input.lengthM, "Length");
      if (typeof L !== "number") return { ok: false, error: L.error };
      const W = p(input.widthM, "Width");
      if (typeof W !== "number") return { ok: false, error: W.error };
      return { ok: true, areaM2: L * W, note: "Simple rectangular parcel area. Irregular plots need traverse methods." };
    }
    case "civil-cut-fill-calculator": {
      const A =
        input.areaM2 && input.areaM2 > 0
          ? input.areaM2
          : (() => {
              const L = input.lengthM;
              const W = input.widthM;
              if (!L || !W || L <= 0 || W <= 0) return undefined;
              return L * W;
            })();
      if (!A) return { ok: false, error: "Provide area or length×width." };
      const cutD = input.cutDepthM && input.cutDepthM > 0 ? input.cutDepthM : 0;
      const fillD = input.fillDepthM && input.fillDepthM > 0 ? input.fillDepthM : 0;
      if (!cutD && !fillD) return { ok: false, error: "Provide cut and/or fill depth." };
      const cutM3 = A * cutD;
      const fillM3 = A * fillD;
      return {
        ok: true,
        areaM2: A,
        cutM3,
        fillM3,
        netM3: cutM3 - fillM3,
        note: "Prismoidal simplification: area × average depth. Survey grids refine this.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
