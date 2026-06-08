/** Educational body-metric estimates — not for diagnosis. */

function n(x: unknown): number | null {
  if (typeof x !== "number" || !Number.isFinite(x)) return null;
  return x;
}

export type BodyLine = { label: string; value: string };
export type BodyResult = { lines: BodyLine[]; error?: string };

function fmt(x: number, d = 2): string {
  if (!Number.isFinite(x)) return "—";
  return x.toFixed(d);
}

function bmi(weightKg: number, heightCm: number): BodyResult {
  if (weightKg <= 0 || heightCm <= 0) return { error: "Enter weight (kg) and height (cm), both positive.", lines: [] };
  const m = heightCm / 100;
  const b = weightKg / (m * m);
  return {
    lines: [
      { label: "BMI", value: `${fmt(b, 1)} kg/m²` },
      {
        label: "WHO-style band (approx)",
        value: b < 18.5 ? "Underweight range" : b < 25 ? "Normal range" : b < 30 ? "Overweight range" : "Obesity range",
      },
    ],
  };
}

/** Mifflin–St Jeor (kcal/day) */
function bmrMifflin(weightKg: number, heightCm: number, age: number, sex: "male" | "female"): number {
  const s = sex === "male" ? 5 : -161;
  return 10 * weightKg + 6.25 * heightCm - 5 * age + s;
}

function bsaDuBois(weightKg: number, heightCm: number): number {
  return 0.007184 * weightKg ** 0.425 * heightCm ** 0.725;
}

/** US Navy body fat (1990) — measurements converted from cm to inches for the standard coefficients. */
function navyBodyFat(
  sex: "male" | "female",
  heightCm: number,
  waistCm: number,
  neckCm: number,
  hipCm?: number,
): number | null {
  if (heightCm <= 0 || waistCm <= 0 || neckCm <= 0) return null;
  const toIn = (cm: number) => cm / 2.54;
  const h = toIn(heightCm);
  const w = toIn(waistCm);
  const n = toIn(neckCm);
  if (sex === "male") {
    if (w <= n) return null;
    const log1 = Math.log10(w - n);
    const log2 = Math.log10(h);
    return 86.01 * log1 - 70.041 * log2 + 36.76;
  }
  if (hipCm == null || hipCm <= 0) return null;
  const hp = toIn(hipCm);
  if (w + hp <= n) return null;
  const log1 = Math.log10(w + hp - n);
  const log2 = Math.log10(h);
  return 163.205 * log1 - 97.684 * log2 - 78.387;
}

export function computeBodyMetric(slug: string, f: Record<string, unknown>): BodyResult {
  const w = n(f.weightKg);
  const h = n(f.heightCm);
  const age = n(f.ageYears);
  const sex = f.sex === "female" ? "female" : "male";
  const waist = n(f.waistCm);
  const neck = n(f.neckCm);
  const hip = n(f.hipCm);
  const bfPct = n(f.bodyFatPct);

  if (slug === "body-bmi-calculator") return bmi(w ?? 0, h ?? 0);

  if (slug === "body-bmr-calculator") {
    if (w == null || h == null || age == null) {
      return { error: "Enter weight (kg), height (cm), and age (years).", lines: [] };
    }
    const b = bmrMifflin(w, h, age, sex);
    return {
      lines: [
        { label: "BMR (Mifflin–St Jeor)", value: `${fmt(b, 0)} kcal/day` },
        { label: "Sex factor", value: sex === "male" ? "+5 kcal/day term" : "−161 kcal/day term" },
      ],
    };
  }

  if (slug === "body-bsa-calculator") {
    if (w == null || h == null) return { error: "Enter weight and height.", lines: [] };
    const bsa = bsaDuBois(w, h);
    return { lines: [{ label: "BSA (Du Bois)", value: `${fmt(bsa, 2)} m²` }] };
  }

  if (slug === "body-fat-percentage-calculator") {
    if (w == null || h == null || waist == null || neck == null) {
      return { error: "Enter weight, height, waist, and neck (cm). Women also need hip circumference.", lines: [] };
    }
    const bf = navyBodyFat(sex, h, waist, neck, hip ?? undefined);
    if (bf == null || !Number.isFinite(bf)) {
      return { error: "Could not estimate body fat from inputs (check measurements).", lines: [] };
    }
    return {
      lines: [
        { label: "Estimated body fat (Navy method)", value: `${fmt(bf, 1)} %` },
        { label: "Note", value: "Training and hydration change circumference; this is not a DXA scan." },
      ],
    };
  }

  if (slug === "body-lean-body-mass-calculator") {
    if (w == null) return { error: "Enter weight (kg).", lines: [] };
    if (bfPct != null) {
      const lbm = w * (1 - bfPct / 100);
      return { lines: [{ label: "Lean body mass", value: `${fmt(lbm, 1)} kg` }] };
    }
    if (h == null || waist == null || neck == null) {
      return { error: "Enter weight and either body fat %, or Navy measurements (height, waist, neck).", lines: [] };
    }
    const bf = navyBodyFat(sex, h, waist, neck, hip ?? undefined);
    if (bf == null) return { error: "Add hip (cm) for women, or enter body fat % directly.", lines: [] };
    const lbm = w * (1 - bf / 100);
    return { lines: [{ label: "Lean body mass (from Navy BF%)", value: `${fmt(lbm, 1)} kg` }] };
  }

  if (slug === "body-ideal-body-weight-calculator") {
    if (h == null) return { error: "Enter height (cm).", lines: [] };
    const m = h / 100;
    const devineMen = 50 + 2.3 * ((h / 2.54) - 60 > 0 ? (h / 2.54) - 60 : 0);
    const devineWomen = 45.5 + 2.3 * ((h / 2.54) - 60 > 0 ? (h / 2.54) - 60 : 0);
    const rob = sex === "male" ? 52 + 1.9 * (h - 152.4) / 2.54 : 49 + 1.7 * (h - 152.4) / 2.54;
    return {
      lines: [
        { label: "Devine (typical textbook, " + sex + ")", value: `${fmt(sex === "male" ? devineMen : devineWomen, 1)} kg` },
        { label: "Robinson variant (approx)", value: `${fmt(rob, 1)} kg` },
        { label: "BMI=22 set-point", value: `${fmt(22 * m * m, 1)} kg` },
      ],
    };
  }

  if (slug === "body-adjusted-body-weight-calculator") {
    if (w == null || bfPct == null) return { error: "Enter actual weight and estimated body fat %.", lines: [] };
    const lbm = w * (1 - bfPct / 100);
    const adj = lbm + 0.4 * (w - lbm);
    return { lines: [{ label: "Adjusted body weight (common formula)", value: `${fmt(adj, 1)} kg` }] };
  }

  if (slug === "body-fat-mass-calculator") {
    if (w == null || bfPct == null) return { error: "Enter weight and body fat %.", lines: [] };
    return { lines: [{ label: "Fat mass", value: `${fmt((w * bfPct) / 100, 1)} kg` }] };
  }
  if (slug === "body-fat-free-mass-calculator") {
    if (w == null || bfPct == null) return { error: "Enter weight and body fat %.", lines: [] };
    return { lines: [{ label: "Fat-free mass", value: `${fmt(w * (1 - bfPct / 100), 1)} kg` }] };
  }
  if (slug === "body-muscle-mass-calculator" || slug === "body-skeletal-muscle-mass-calculator") {
    if (w == null || bfPct == null) return { error: "Enter weight and body fat % for a rough FFM-based muscle estimate.", lines: [] };
    const ffm = w * (1 - bfPct / 100);
    const mus = ffm * 0.44;
    return {
      lines: [
        { label: "Rough skeletal muscle mass (44% of FFM heuristic)", value: `${fmt(mus, 1)} kg` },
        { label: "Note", value: "Imaging (DXA/MRI) measures muscle; this is not imaging." },
      ],
    };
  }
  if (slug === "body-visceral-fat-calculator" || slug === "body-subcutaneous-fat-calculator") {
    if (w == null || waist == null || h == null) {
      return { error: "Enter weight, waist, and height for a rough surrogate index.", lines: [] };
    }
    const m = h / 100;
    const whr = waist / 100 / m;
    return {
      lines: [
        { label: "Waist-to-height (waist m / height m)", value: `${fmt(whr, 2)}` },
        { label: "Interpretation", value: "Higher values correlate with cardiometabolic risk in population studies—see a clinician for personal risk." },
      ],
    };
  }
  if (slug === "body-bone-mass-calculator") {
    if (w == null || h == null) return { error: "Enter weight and height.", lines: [] };
    const bone = 0.043 * h ** 0.45 * w ** 0.55;
    return {
      lines: [
        { label: "Very rough bone mass estimate", value: `${fmt(bone, 1)} kg` },
        { label: "Note", value: "Population regression—not DXA bone mineral." },
      ],
    };
  }
  if (slug === "body-total-body-water-calculator") {
    if (w == null) return { error: "Enter weight (kg).", lines: [] };
    const tbw = sex === "male" ? 0.6 * w : 0.5 * w;
    return {
      lines: [
        { label: "Typical TBW fraction estimate", value: `${fmt(tbw, 1)} L (assuming ~${sex === "male" ? 60 : 50}% of weight)` },
      ],
    };
  }

  // Default: BMI if possible
  if (w != null && h != null) return bmi(w, h);
  return { error: "Enter at least weight (kg) and height (cm), or the measurements described in the FAQ.", lines: [] };
}
