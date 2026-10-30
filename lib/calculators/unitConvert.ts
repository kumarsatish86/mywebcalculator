/** Unit converters — SI/imperial and specialty teaching conversions. */
import { finite, pos, nonNeg } from "./unitHelpers";

export type UnitConvertSlug =
  | "unit-meter-kilometer-converter"
  | "unit-centimeter-meter-converter"
  | "unit-millimeter-meter-converter"
  | "unit-inch-centimeter-converter"
  | "unit-feet-meter-converter"
  | "unit-yard-meter-converter"
  | "unit-mile-kilometer-converter"
  | "unit-nautical-mile-converter"
  | "unit-gram-kilogram-converter"
  | "unit-kilogram-pound-converter"
  | "unit-pound-ounce-converter"
  | "unit-ton-kilogram-converter"
  | "unit-stone-pound-converter"
  | "unit-square-meter-square-feet-converter"
  | "unit-acre-hectare-converter"
  | "unit-square-kilometer-square-mile-converter"
  | "unit-square-yard-square-feet-converter"
  | "unit-liter-milliliter-converter"
  | "unit-liter-gallon-us-uk-converter"
  | "unit-cubic-meter-liter-converter"
  | "unit-cup-milliliter-converter"
  | "unit-tablespoon-teaspoon-converter"
  | "unit-celsius-fahrenheit-converter"
  | "unit-celsius-kelvin-converter"
  | "unit-fahrenheit-kelvin-converter"
  | "unit-seconds-minutes-hours-converter"
  | "unit-days-weeks-months-years-converter"
  | "unit-milliseconds-seconds-converter"
  | "unit-kmh-ms-converter"
  | "unit-mph-kmh-converter"
  | "unit-knot-kmh-converter"
  | "unit-joule-kilojoule-converter"
  | "unit-calorie-kilocalorie-converter"
  | "unit-kwh-joule-converter"
  | "unit-btu-joule-converter"
  | "unit-watt-kilowatt-converter"
  | "unit-horsepower-watt-converter"
  | "unit-hz-khz-mhz-ghz-converter"
  | "unit-rpm-hz-converter"
  | "unit-pascal-bar-converter"
  | "unit-psi-bar-converter"
  | "unit-atm-pascal-converter"
  | "unit-mmhg-torr-converter"
  | "unit-degree-radian-converter"
  | "unit-degree-gradian-converter"
  | "unit-arcminute-degree-converter"
  | "unit-kb-mb-gb-tb-converter"
  | "unit-byte-bit-converter"
  | "unit-mb-mib-converter"
  | "unit-megabit-per-second-megabyte-per-second"
  | "unit-kbps-mbps-converter"
  | "unit-gbps-mbps-converter"
  | "unit-km-per-liter-mpg-converter"
  | "unit-mpg-us-mpg-uk-converter"
  | "unit-kg-per-m3-g-per-cm3-converter"
  | "unit-newton-kgf-converter"
  | "unit-newton-pound-force-converter"
  | "unit-molarity-converter"
  | "unit-mg-per-liter-ppm-converter"
  | "unit-cement-bag-kilogram-converter"
  | "unit-sand-volume-converter"
  | "unit-brick-calculator-units"
  | "unit-gsm-oz-per-yd2-converter"
  | "unit-yarn-count-converter";

export type UnitConvertInput = {
  value?: number;
  valueB?: number;
  moles?: number;
  liters?: number;
  bagKg?: number;
  bags?: number;
  volumeM3?: number;
  densityKgM3?: number;
  wallAreaM2?: number;
  brickFaceM2?: number;
  mortarPct?: number;
  nm?: number;
  ne?: number;
};

export type UnitConvertResult =
  | { ok: false; error: string }
  | {
      ok: true;
      a?: number;
      b?: number;
      c?: number;
      d?: number;
      labelA?: string;
      labelB?: string;
      labelC?: string;
      labelD?: string;
      note: string;
    };

/** Multiply A → B factor (valueB = valueA * factor). */
const PAIR: Partial<Record<UnitConvertSlug, { factor: number; labelA: string; labelB: string; note: string }>> = {
  "unit-meter-kilometer-converter": { factor: 0.001, labelA: "m", labelB: "km", note: "1 km = 1000 m." },
  "unit-centimeter-meter-converter": { factor: 0.01, labelA: "cm", labelB: "m", note: "1 m = 100 cm." },
  "unit-millimeter-meter-converter": { factor: 0.001, labelA: "mm", labelB: "m", note: "1 m = 1000 mm." },
  "unit-inch-centimeter-converter": { factor: 2.54, labelA: "in", labelB: "cm", note: "1 in = 2.54 cm." },
  "unit-feet-meter-converter": { factor: 0.3048, labelA: "ft", labelB: "m", note: "1 ft = 0.3048 m." },
  "unit-yard-meter-converter": { factor: 0.9144, labelA: "yd", labelB: "m", note: "1 yd = 0.9144 m." },
  "unit-mile-kilometer-converter": { factor: 1.609344, labelA: "mi", labelB: "km", note: "1 mi = 1.609344 km." },
  "unit-nautical-mile-converter": { factor: 1.852, labelA: "nmi", labelB: "km", note: "1 nmi = 1.852 km." },
  "unit-gram-kilogram-converter": { factor: 0.001, labelA: "g", labelB: "kg", note: "1 kg = 1000 g." },
  "unit-kilogram-pound-converter": { factor: 2.2046226218, labelA: "kg", labelB: "lb", note: "1 kg ≈ 2.20462 lb." },
  "unit-pound-ounce-converter": { factor: 16, labelA: "lb", labelB: "oz", note: "1 lb = 16 oz." },
  "unit-ton-kilogram-converter": { factor: 1000, labelA: "t (metric)", labelB: "kg", note: "1 metric ton = 1000 kg." },
  "unit-stone-pound-converter": { factor: 14, labelA: "st", labelB: "lb", note: "1 stone = 14 lb." },
  "unit-square-meter-square-feet-converter": { factor: 10.7639104167, labelA: "m²", labelB: "ft²", note: "1 m² ≈ 10.764 ft²." },
  "unit-acre-hectare-converter": { factor: 0.40468564224, labelA: "acre", labelB: "ha", note: "1 acre ≈ 0.4047 ha." },
  "unit-square-kilometer-square-mile-converter": { factor: 0.38610215855, labelA: "km²", labelB: "mi²", note: "1 km² ≈ 0.3861 mi²." },
  "unit-square-yard-square-feet-converter": { factor: 9, labelA: "yd²", labelB: "ft²", note: "1 yd² = 9 ft²." },
  "unit-liter-milliliter-converter": { factor: 1000, labelA: "L", labelB: "mL", note: "1 L = 1000 mL." },
  "unit-cubic-meter-liter-converter": { factor: 1000, labelA: "m³", labelB: "L", note: "1 m³ = 1000 L." },
  "unit-cup-milliliter-converter": { factor: 236.5882365, labelA: "cup (US)", labelB: "mL", note: "1 US cup ≈ 236.59 mL." },
  "unit-tablespoon-teaspoon-converter": { factor: 3, labelA: "tbsp", labelB: "tsp", note: "1 tbsp = 3 tsp." },
  "unit-milliseconds-seconds-converter": { factor: 0.001, labelA: "ms", labelB: "s", note: "1 s = 1000 ms." },
  "unit-kmh-ms-converter": { factor: 1 / 3.6, labelA: "km/h", labelB: "m/s", note: "1 m/s = 3.6 km/h." },
  "unit-mph-kmh-converter": { factor: 1.609344, labelA: "mph", labelB: "km/h", note: "1 mph = 1.609344 km/h." },
  "unit-knot-kmh-converter": { factor: 1.852, labelA: "kn", labelB: "km/h", note: "1 knot = 1.852 km/h." },
  "unit-joule-kilojoule-converter": { factor: 0.001, labelA: "J", labelB: "kJ", note: "1 kJ = 1000 J." },
  "unit-calorie-kilocalorie-converter": { factor: 0.001, labelA: "cal", labelB: "kcal", note: "1 kcal = 1000 cal." },
  "unit-kwh-joule-converter": { factor: 3_600_000, labelA: "kWh", labelB: "J", note: "1 kWh = 3.6×10⁶ J." },
  "unit-btu-joule-converter": { factor: 1055.05585262, labelA: "BTU", labelB: "J", note: "1 BTU ≈ 1055.06 J." },
  "unit-watt-kilowatt-converter": { factor: 0.001, labelA: "W", labelB: "kW", note: "1 kW = 1000 W." },
  "unit-horsepower-watt-converter": { factor: 745.699871582, labelA: "hp (mech)", labelB: "W", note: "1 mechanical hp ≈ 745.7 W." },
  "unit-rpm-hz-converter": { factor: 1 / 60, labelA: "rpm", labelB: "Hz", note: "Hz = rpm ÷ 60." },
  "unit-pascal-bar-converter": { factor: 1e-5, labelA: "Pa", labelB: "bar", note: "1 bar = 10⁵ Pa." },
  "unit-psi-bar-converter": { factor: 0.06894757293, labelA: "psi", labelB: "bar", note: "1 psi ≈ 0.06895 bar." },
  "unit-atm-pascal-converter": { factor: 101325, labelA: "atm", labelB: "Pa", note: "1 atm = 101325 Pa." },
  "unit-mmhg-torr-converter": { factor: 1, labelA: "mmHg", labelB: "Torr", note: "1 mmHg ≈ 1 Torr (exact by definition in teaching use)." },
  "unit-degree-radian-converter": { factor: Math.PI / 180, labelA: "°", labelB: "rad", note: "π rad = 180°." },
  "unit-degree-gradian-converter": { factor: 10 / 9, labelA: "°", labelB: "gon", note: "1° = 10/9 gon." },
  "unit-arcminute-degree-converter": { factor: 1 / 60, labelA: "′", labelB: "°", note: "1° = 60′." },
  "unit-byte-bit-converter": { factor: 8, labelA: "B", labelB: "bit", note: "1 byte = 8 bits." },
  "unit-mb-mib-converter": { factor: 1e6 / 2 ** 20, labelA: "MB (decimal)", labelB: "MiB", note: "1 MB = 10⁶ B; 1 MiB = 2²⁰ B." },
  "unit-megabit-per-second-megabyte-per-second": { factor: 0.125, labelA: "Mbps", labelB: "MBps", note: "1 MBps = 8 Mbps." },
  "unit-kbps-mbps-converter": { factor: 0.001, labelA: "Kbps", labelB: "Mbps", note: "1 Mbps = 1000 Kbps." },
  "unit-gbps-mbps-converter": { factor: 1000, labelA: "Gbps", labelB: "Mbps", note: "1 Gbps = 1000 Mbps." },
  "unit-km-per-liter-mpg-converter": { factor: 2.352145833, labelA: "km/L", labelB: "mpg (US)", note: "mpg US ≈ km/L × 2.352." },
  "unit-mpg-us-mpg-uk-converter": { factor: 1.2009499255, labelA: "mpg (US)", labelB: "mpg (UK)", note: "1 mpg UK ≈ 1.201 mpg US." },
  "unit-kg-per-m3-g-per-cm3-converter": { factor: 0.001, labelA: "kg/m³", labelB: "g/cm³", note: "1 g/cm³ = 1000 kg/m³." },
  "unit-newton-kgf-converter": { factor: 1 / 9.80665, labelA: "N", labelB: "kgf", note: "1 kgf = 9.80665 N." },
  "unit-newton-pound-force-converter": { factor: 0.2248089431, labelA: "N", labelB: "lbf", note: "1 lbf ≈ 4.448 N." },
  "unit-mg-per-liter-ppm-converter": { factor: 1, labelA: "mg/L", labelB: "ppm (water)", note: "For dilute aqueous solutions, 1 mg/L ≈ 1 ppm." },
  "unit-gsm-oz-per-yd2-converter": { factor: 0.0294935, labelA: "g/m²", labelB: "oz/yd²", note: "1 oz/yd² ≈ 33.906 g/m²." },
};

function pairResult(slug: UnitConvertSlug, value: number): UnitConvertResult {
  const p = PAIR[slug];
  if (!p) return { ok: false, error: "Unknown pair converter." };
  return {
    ok: true,
    a: value,
    b: value * p.factor,
    labelA: p.labelA,
    labelB: p.labelB,
    note: p.note,
  };
}

export function computeUnitConvert(slug: UnitConvertSlug, input: UnitConvertInput): UnitConvertResult {
  if (PAIR[slug]) {
    const v = finite(input.value, "Value");
    if (typeof v !== "number") return { ok: false, error: v.error };
    return pairResult(slug, v);
  }

  switch (slug) {
    case "unit-liter-gallon-us-uk-converter": {
      const L = finite(input.value, "Liters");
      if (typeof L !== "number") return { ok: false, error: L.error };
      return {
        ok: true,
        a: L,
        b: L / 3.785411784,
        c: L / 4.54609,
        labelA: "L",
        labelB: "gal (US)",
        labelC: "gal (UK)",
        note: "US gal = 3.785411784 L; UK gal = 4.54609 L.",
      };
    }
    case "unit-celsius-fahrenheit-converter": {
      const c = finite(input.value, "Celsius");
      if (typeof c !== "number") return { ok: false, error: c.error };
      return {
        ok: true,
        a: c,
        b: (c * 9) / 5 + 32,
        labelA: "°C",
        labelB: "°F",
        note: "°F = °C × 9/5 + 32.",
      };
    }
    case "unit-celsius-kelvin-converter": {
      const c = finite(input.value, "Celsius");
      if (typeof c !== "number") return { ok: false, error: c.error };
      return {
        ok: true,
        a: c,
        b: c + 273.15,
        labelA: "°C",
        labelB: "K",
        note: "K = °C + 273.15.",
      };
    }
    case "unit-fahrenheit-kelvin-converter": {
      const f = finite(input.value, "Fahrenheit");
      if (typeof f !== "number") return { ok: false, error: f.error };
      const c = ((f - 32) * 5) / 9;
      return {
        ok: true,
        a: f,
        b: c + 273.15,
        labelA: "°F",
        labelB: "K",
        note: "Via °C = (°F − 32) × 5/9.",
      };
    }
    case "unit-seconds-minutes-hours-converter": {
      const s = nonNeg(input.value, "Seconds");
      if (typeof s !== "number") return { ok: false, error: s.error };
      return {
        ok: true,
        a: s,
        b: s / 60,
        c: s / 3600,
        labelA: "s",
        labelB: "min",
        labelC: "h",
        note: "1 h = 3600 s; 1 min = 60 s.",
      };
    }
    case "unit-days-weeks-months-years-converter": {
      const days = nonNeg(input.value, "Days");
      if (typeof days !== "number") return { ok: false, error: days.error };
      return {
        ok: true,
        a: days,
        b: days / 7,
        c: days / 30.436875,
        d: days / 365.2425,
        labelA: "days",
        labelB: "weeks",
        labelC: "months (avg)",
        labelD: "years (avg)",
        note: "Uses mean Gregorian month/year lengths — not calendar date math.",
      };
    }
    case "unit-hz-khz-mhz-ghz-converter": {
      const hz = nonNeg(input.value, "Hz");
      if (typeof hz !== "number") return { ok: false, error: hz.error };
      return {
        ok: true,
        a: hz,
        b: hz / 1e3,
        c: hz / 1e6,
        d: hz / 1e9,
        labelA: "Hz",
        labelB: "kHz",
        labelC: "MHz",
        labelD: "GHz",
        note: "SI decimal prefixes (×1000).",
      };
    }
    case "unit-kb-mb-gb-tb-converter": {
      const kb = nonNeg(input.value, "KB");
      if (typeof kb !== "number") return { ok: false, error: kb.error };
      return {
        ok: true,
        a: kb,
        b: kb / 1000,
        c: kb / 1e6,
        d: kb / 1e9,
        labelA: "KB",
        labelB: "MB",
        labelC: "GB",
        labelD: "TB",
        note: "Decimal (SI) prefixes: 1000 KB = 1 MB.",
      };
    }
    case "unit-molarity-converter": {
      const moles = nonNeg(input.moles ?? input.value, "Moles of solute");
      if (typeof moles !== "number") return { ok: false, error: moles.error };
      const lit = pos(input.liters ?? input.valueB, "Solution liters");
      if (typeof lit !== "number") return { ok: false, error: lit.error };
      return {
        ok: true,
        a: moles / lit,
        labelA: "mol/L (M)",
        note: "Molarity = moles ÷ liters of solution.",
      };
    }
    case "unit-cement-bag-kilogram-converter": {
      const bags = nonNeg(input.bags ?? input.value, "Bags");
      if (typeof bags !== "number") return { ok: false, error: bags.error };
      const kgPer = pos(input.bagKg ?? 50, "kg per bag");
      if (typeof kgPer !== "number") return { ok: false, error: kgPer.error };
      return {
        ok: true,
        a: bags,
        b: bags * kgPer,
        labelA: "bags",
        labelB: "kg",
        note: `Uses ${kgPer} kg/bag (common site default 50 kg).`,
      };
    }
    case "unit-sand-volume-converter": {
      const vol = pos(input.volumeM3 ?? input.value, "Volume m³");
      if (typeof vol !== "number") return { ok: false, error: vol.error };
      const dens = pos(input.densityKgM3 ?? 1600, "Density kg/m³");
      if (typeof dens !== "number") return { ok: false, error: dens.error };
      return {
        ok: true,
        a: vol,
        b: (vol * dens) / 1000,
        labelA: "m³",
        labelB: "metric tons",
        note: `Mass = volume × density (default ${dens} kg/m³).`,
      };
    }
    case "unit-brick-calculator-units": {
      const area = pos(input.wallAreaM2 ?? input.value, "Wall area m²");
      if (typeof area !== "number") return { ok: false, error: area.error };
      const face = pos(input.brickFaceM2 ?? 0.0143, "Brick face m²");
      if (typeof face !== "number") return { ok: false, error: face.error };
      const waste = nonNeg(input.mortarPct ?? 5, "Waste %");
      if (typeof waste !== "number") return { ok: false, error: waste.error };
      const count = (area / face) * (1 + waste / 100);
      return {
        ok: true,
        a: count,
        labelA: "bricks (est.)",
        note: "Bricks ≈ (area ÷ face area) × (1 + waste%). Teaching estimate only.",
      };
    }
    case "unit-yarn-count-converter": {
      const nm = pos(input.nm ?? input.value, "Metric count Nm");
      if (typeof nm !== "number") return { ok: false, error: nm.error };
      // Approximate Nm → Ne (cotton): Ne ≈ Nm × 0.5905
      const ne = nm * 0.5905;
      return {
        ok: true,
        a: nm,
        b: ne,
        labelA: "Nm",
        labelB: "Ne (approx)",
        note: "Ne ≈ Nm × 0.5905 (cotton teaching factor).",
      };
    }
    default:
      return { ok: false, error: "Unknown converter." };
  }
}

/** All unit-converter slugs (for router / tests). */
export const ALL_UNIT_CONVERT_SLUGS: UnitConvertSlug[] = [
  "unit-meter-kilometer-converter",
  "unit-centimeter-meter-converter",
  "unit-millimeter-meter-converter",
  "unit-inch-centimeter-converter",
  "unit-feet-meter-converter",
  "unit-yard-meter-converter",
  "unit-mile-kilometer-converter",
  "unit-nautical-mile-converter",
  "unit-gram-kilogram-converter",
  "unit-kilogram-pound-converter",
  "unit-pound-ounce-converter",
  "unit-ton-kilogram-converter",
  "unit-stone-pound-converter",
  "unit-square-meter-square-feet-converter",
  "unit-acre-hectare-converter",
  "unit-square-kilometer-square-mile-converter",
  "unit-square-yard-square-feet-converter",
  "unit-liter-milliliter-converter",
  "unit-liter-gallon-us-uk-converter",
  "unit-cubic-meter-liter-converter",
  "unit-cup-milliliter-converter",
  "unit-tablespoon-teaspoon-converter",
  "unit-celsius-fahrenheit-converter",
  "unit-celsius-kelvin-converter",
  "unit-fahrenheit-kelvin-converter",
  "unit-seconds-minutes-hours-converter",
  "unit-days-weeks-months-years-converter",
  "unit-milliseconds-seconds-converter",
  "unit-kmh-ms-converter",
  "unit-mph-kmh-converter",
  "unit-knot-kmh-converter",
  "unit-joule-kilojoule-converter",
  "unit-calorie-kilocalorie-converter",
  "unit-kwh-joule-converter",
  "unit-btu-joule-converter",
  "unit-watt-kilowatt-converter",
  "unit-horsepower-watt-converter",
  "unit-hz-khz-mhz-ghz-converter",
  "unit-rpm-hz-converter",
  "unit-pascal-bar-converter",
  "unit-psi-bar-converter",
  "unit-atm-pascal-converter",
  "unit-mmhg-torr-converter",
  "unit-degree-radian-converter",
  "unit-degree-gradian-converter",
  "unit-arcminute-degree-converter",
  "unit-kb-mb-gb-tb-converter",
  "unit-byte-bit-converter",
  "unit-mb-mib-converter",
  "unit-megabit-per-second-megabyte-per-second",
  "unit-kbps-mbps-converter",
  "unit-gbps-mbps-converter",
  "unit-km-per-liter-mpg-converter",
  "unit-mpg-us-mpg-uk-converter",
  "unit-kg-per-m3-g-per-cm3-converter",
  "unit-newton-kgf-converter",
  "unit-newton-pound-force-converter",
  "unit-molarity-converter",
  "unit-mg-per-liter-ppm-converter",
  "unit-cement-bag-kilogram-converter",
  "unit-sand-volume-converter",
  "unit-brick-calculator-units",
  "unit-gsm-oz-per-yd2-converter",
  "unit-yarn-count-converter",
];
