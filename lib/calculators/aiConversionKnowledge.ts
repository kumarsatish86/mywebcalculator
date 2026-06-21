import type { UnitKey } from "./aiConversionSmart";

/** Factor to multiply value to get base SI-ish unit per category */
export const UNIT_TO_BASE: Record<UnitKey, { base: UnitKey; factor: number; category: string; label: string }> = {
  m: { base: "m", factor: 1, category: "length", label: "Meters" },
  km: { base: "m", factor: 1000, category: "length", label: "Kilometers" },
  mi: { base: "m", factor: 1609.344, category: "length", label: "Miles" },
  ft: { base: "m", factor: 0.3048, category: "length", label: "Feet" },
  cm: { base: "m", factor: 0.01, category: "length", label: "Centimeters" },
  kg: { base: "kg", factor: 1, category: "weight", label: "Kilograms" },
  g: { base: "kg", factor: 0.001, category: "weight", label: "Grams" },
  lb: { base: "kg", factor: 0.453592, category: "weight", label: "Pounds" },
  oz: { base: "kg", factor: 0.0283495, category: "weight", label: "Ounces" },
  c: { base: "c", factor: 1, category: "temperature", label: "Celsius" },
  f: { base: "c", factor: 1, category: "temperature", label: "Fahrenheit" },
  l: { base: "l", factor: 1, category: "volume", label: "Liters" },
  ml: { base: "l", factor: 0.001, category: "volume", label: "Milliliters" },
  gal: { base: "l", factor: 3.78541, category: "volume", label: "US Gallons" },
};

export const CONVERSION_TIPS = [
  "Always confirm unit system — US gallons ≠ imperial gallons.",
  "For temperature, never add offsets like length — use proper formulas.",
  "Round only at the final step to preserve precision in chained conversions.",
  "When converting cooking measures, verify wet vs dry volume.",
];

export const CURRENCY_BENCHMARKS = { lowVol: 3, medVol: 8, highVol: 15 };

export const FX_TIPS = [
  "Trend extrapolation ignores black-swan events — use as planning band only.",
  "Compare mid-market rate vs your bank's spread before large transfers.",
  "Hedge large exposures with forward contracts if volatility exceeds 10%.",
];

export const TZ_CITIES: Record<string, string> = {
  "-8": "Los Angeles (UTC−8)",
  "-5": "New York (UTC−5)",
  "0": "London (UTC+0)",
  "5.5": "Mumbai (UTC+5:30)",
  "8": "Singapore (UTC+8)",
  "9": "Tokyo (UTC+9)",
};

export const PRODUCTIVITY_BENCHMARKS = { focusMin: 4, deepWorkMin: 2, interruptMax: 8, completionMin: 75 };

export const ROUTINE_TIPS = [
  "Front-load cognitively demanding work in first 2 hours after peak energy.",
  "Batch shallow tasks (email, messages) into 2 fixed windows.",
  "Protect sleep window — shifting ±1h costs more than skipping a task.",
];

export const TIME_MGMT_STEPS = [
  "Time-box top priority first — immovable calendar block.",
  "Batch similar tasks to cut context-switch cost ~40%.",
  "Leave 15% unscheduled buffer for overruns.",
  "Review plan each evening — adjust tomorrow's top 3 only.",
];
