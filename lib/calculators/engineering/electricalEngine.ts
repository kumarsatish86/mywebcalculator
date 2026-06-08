/** Pure electrical study helpers — simplified textbook models only. */

export type ElectricalLine = { label: string; value: string };
export type ElectricalResult = { lines: ElectricalLine[]; error?: string };

const KW_PER_HP = 0.745699872;
const SQRT3 = Math.sqrt(3);

export function n(x: unknown): number | null {
  if (typeof x !== "number" || !Number.isFinite(x)) return null;
  return x;
}

function fmt(x: number, d = 4): string {
  if (!Number.isFinite(x)) return "—";
  const ax = Math.abs(x);
  if (ax >= 1e6 || (ax < 1e-3 && ax > 0)) return x.toExponential(4);
  return x.toFixed(Math.min(d, ax >= 100 ? 2 : 4));
}

/** Count how many of three values are positive and finite. */
function countKnown(a: number | null, b: number | null, c: number | null): number {
  return [a, b, c].filter((v) => v != null && v > 0).length;
}

function ohmLaw(V: number | null, I: number | null, R: number | null): ElectricalResult {
  const known = countKnown(V, I, R);
  if (known < 2) {
    return {
      error: "Enter any two of voltage (V), current (A), and resistance (Ω) to solve the third.",
      lines: [],
    };
  }
  const lines: ElectricalLine[] = [];
  let v = V,
    i = I,
    r = R;
  if (v != null && i != null && r == null) {
    r = v / i;
    lines.push({ label: "Resistance R = V / I", value: `${fmt(r)} Ω` });
  } else if (v != null && r != null && i == null) {
    i = v / r;
    lines.push({ label: "Current I = V / R", value: `${fmt(i)} A` });
  } else if (i != null && r != null && v == null) {
    v = i * r;
    lines.push({ label: "Voltage V = I × R", value: `${fmt(v)} V` });
  } else {
    const vi = Math.abs((v ?? 0) - (i ?? 0) * (r ?? 0));
    lines.push({
      label: "Consistency check |V − I·R|",
      value: vi < 1e-6 ? "OK (values satisfy Ohm’s law)" : `Residual ${fmt(vi)} (inputs may round differently)`,
    });
  }
  if (v != null) lines.unshift({ label: "Voltage", value: `${fmt(v)} V` });
  if (i != null) lines.unshift({ label: "Current", value: `${fmt(i)} A` });
  if (r != null) lines.unshift({ label: "Resistance", value: `${fmt(r)} Ω` });
  return { lines };
}

function dcPower(V: number | null, I: number | null, P: number | null): ElectricalResult {
  const known = countKnown(V, I, P);
  if (known < 2) {
    return { error: "Enter two of P (W), V (V), and I (A) for P = V × I.", lines: [] };
  }
  const lines: ElectricalLine[] = [];
  let v = V,
    i = I,
    p = P;
  if (p != null && v != null && i == null) i = p / v;
  else if (p != null && i != null && v == null) v = p / i;
  else if (v != null && i != null && p == null) p = v * i;
  lines.push({ label: "Power P", value: `${fmt(p ?? 0)} W` });
  lines.push({ label: "Voltage V", value: `${fmt(v ?? 0)} V` });
  lines.push({ label: "Current I", value: `${fmt(i ?? 0)} A` });
  return { lines };
}

function energyKwh(Pkw: number | null, hours: number | null): ElectricalResult {
  const P = n(Pkw);
  const h = n(hours);
  if (P == null || h == null || P < 0 || h < 0) {
    return { error: "Enter average power in kW and time in hours (both ≥ 0).", lines: [] };
  }
  const kwh = P * h;
  return {
    lines: [
      { label: "Energy E = P × t", value: `${fmt(kwh, 3)} kWh` },
      { label: "Energy (MJ, 1 kWh = 3.6 MJ)", value: `${fmt(kwh * 3.6, 3)} MJ` },
    ],
  };
}

function acSinglePhase(P: number | null, V: number | null, I: number | null, pf: number | null): ElectricalResult {
  const pfUse = pf ?? 1;
  if (pfUse <= 0 || pfUse > 1) return { error: "Power factor must be between 0 and 1.", lines: [] };
  const known = [P, V, I].filter((x) => x != null && (x as number) > 0).length;
  if (known < 2) {
    return { error: "Enter two of real power P (W), voltage V (V), and current I (A). Uses P = V·I·PF.", lines: [] };
  }
  let p = P,
    v = V,
    i = I;
  if (p != null && v != null && i == null) i = p / (v * pfUse);
  else if (p != null && i != null && v == null) v = p / (i * pfUse);
  else if (v != null && i != null && p == null) p = v * i * pfUse;
  return {
    lines: [
      { label: "Real power P", value: `${fmt(p!)} W` },
      { label: "Voltage V", value: `${fmt(v!)} V` },
      { label: "Current I", value: `${fmt(i!)} A` },
      { label: "Power factor PF (assumed)", value: `${fmt(pfUse, 3)}` },
    ],
  };
}

function acThreePhase(P: number | null, Vll: number | null, I: number | null, pf: number | null): ElectricalResult {
  const pfUse = pf ?? 1;
  if (pfUse <= 0 || pfUse > 1) return { error: "Power factor must be between 0 and 1.", lines: [] };
  const known = [P, Vll, I].filter((x) => x != null && (x as number) > 0).length;
  if (known < 2) {
    return {
      error: "Enter two of total real power P (W), line voltage VLL (V), and line current IL (A). Uses P = √3·VLL·IL·PF.",
      lines: [],
    };
  }
  let p = P,
    v = Vll,
    i = I;
  if (p != null && v != null && i == null) i = p / (SQRT3 * v * pfUse);
  else if (p != null && i != null && v == null) v = p / (SQRT3 * i * pfUse);
  else if (v != null && i != null && p == null) p = SQRT3 * v * i * pfUse;
  return {
    lines: [
      { label: "Real power P", value: `${fmt(p!)} W` },
      { label: "Line voltage VLL", value: `${fmt(v!)} V` },
      { label: "Line current IL", value: `${fmt(i!)} A` },
      { label: "Power factor PF (assumed)", value: `${fmt(pfUse, 3)}` },
    ],
  };
}

function kvaToKw(kva: number | null, pf: number | null): ElectricalResult {
  const k = n(kva);
  const pfUse = pf ?? 0.9;
  if (k == null || k <= 0) return { error: "Enter apparent power in kVA (> 0).", lines: [] };
  if (pfUse <= 0 || pfUse > 1) return { error: "Power factor must be between 0 and 1.", lines: [] };
  const kw = k * pfUse;
  return {
    lines: [
      { label: "Real power (kW) ≈ kVA × PF", value: `${fmt(kw, 3)} kW` },
      { label: "Reactive kVAR (rough, from right triangle)", value: `${fmt(k * Math.sqrt(Math.max(0, 1 - pfUse * pfUse)), 3)} kVAR` },
    ],
  };
}

function kwToHp(kw: number | null): ElectricalResult {
  const k = n(kw);
  if (k == null) return { error: "Enter power in kW.", lines: [] };
  return { lines: [{ label: "Mechanical HP", value: `${fmt(k / KW_PER_HP, 3)} hp` }] };
}

function hpToKw(hp: number | null): ElectricalResult {
  const h = n(hp);
  if (h == null) return { error: "Enter power in horsepower.", lines: [] };
  return { lines: [{ label: "Power", value: `${fmt(h * KW_PER_HP, 3)} kW` }] };
}

function kvaToAmps(kva: number | null, vll: number | null, pf: number | null): ElectricalResult {
  const s = n(kva);
  const v = n(vll);
  if (s == null || v == null || s <= 0 || v <= 0) {
    return { error: "Enter three-phase kVA and line-to-line voltage in volts.", lines: [] };
  }
  const sVa = s * 1000;
  const i = sVa / (SQRT3 * v);
  const p = s * (pf ?? 1) * 1000;
  return {
    lines: [
      { label: "Line current IL (approx)", value: `${fmt(i, 3)} A` },
      { label: "Note", value: "Assumes balanced load; PF only affects real power, not this IL from kVA." },
      { label: "Real power at PF", value: `${fmt((pf ?? 1) <= 1 && (pf ?? 1) > 0 ? p / 1000 : 0, 3)} kW` },
    ],
  };
}

function wattToAmp(P: number | null, V: number | null): ElectricalResult {
  const p = n(P);
  const v = n(V);
  if (p == null || v == null || v === 0) return { error: "Enter power in watts and voltage in volts.", lines: [] };
  return { lines: [{ label: "Current I = P / V", value: `${fmt(p / v, 3)} A` }] };
}

function ampToWatt(I: number | null, V: number | null): ElectricalResult {
  const i = n(I);
  const v = n(V);
  if (i == null || v == null) return { error: "Enter current in amps and voltage in volts.", lines: [] };
  return { lines: [{ label: "Power P = V × I", value: `${fmt(i * v, 3)} W` }] };
}

function apparentVa(V: number | null, I: number | null): ElectricalResult {
  return dcPower(V, I, null);
}

function reactiveFromSP(Sva: number | null, Pw: number | null): ElectricalResult {
  const s = n(Sva);
  const p = n(Pw);
  if (s == null || p == null || s * s < p * p) {
    return { error: "Enter apparent S (VA) and real P (W) with |P| ≤ S.", lines: [] };
  }
  const q = Math.sqrt(Math.max(0, s * s - p * p));
  return {
    lines: [
      { label: "Reactive Q", value: `${fmt(q, 3)} VAR` },
      { label: "Power factor PF = P / S", value: `${fmt(p / s, 4)}` },
    ],
  };
}

function impedanceMag(R: number | null, X: number | null): ElectricalResult {
  const r = n(R) ?? 0;
  const x = n(X) ?? 0;
  const z = Math.hypot(r, x);
  return {
    lines: [
      { label: "|Z| = √(R² + X²)", value: `${fmt(z, 4)} Ω` },
      { label: "Angle θ = atan2(X, R)", value: `${fmt((Math.atan2(x, r) * 180) / Math.PI, 2)}°` },
    ],
  };
}

function resonantF(L: number | null, C: number | null): ElectricalResult {
  const l = n(L);
  const c = n(C);
  if (l == null || c == null || l <= 0 || c <= 0) {
    return { error: "Enter inductance L (H) and capacitance C (F), both > 0.", lines: [] };
  }
  const f = 1 / (2 * Math.PI * Math.sqrt(l * c));
  return { lines: [{ label: "Resonant frequency f₀", value: `${fmt(f, 3)} Hz` }] };
}

function xl(f: number | null, L: number | null): ElectricalResult {
  const ff = n(f);
  const ll = n(L);
  if (ff == null || ll == null) return { error: "Enter frequency (Hz) and inductance L (H).", lines: [] };
  const xlVal = 2 * Math.PI * ff * ll;
  return { lines: [{ label: "Inductive reactance XL", value: `${fmt(xlVal, 4)} Ω` }] };
}

function xc(f: number | null, C: number | null): ElectricalResult {
  const ff = n(f);
  const cc = n(C);
  if (ff == null || cc == null || cc === 0) return { error: "Enter frequency (Hz) and capacitance C (F).", lines: [] };
  const xcVal = 1 / (2 * Math.PI * ff * cc);
  return { lines: [{ label: "Capacitive reactance XC", value: `${fmt(xcVal, 4)} Ω` }] };
}

function electricBill(kwh: number | null, rate: number | null): ElectricalResult {
  const k = n(kwh);
  const r = n(rate);
  if (k == null || r == null || k < 0 || r < 0) {
    return { error: "Enter kWh used and cost per kWh (same currency).", lines: [] };
  }
  return { lines: [{ label: "Estimated cost", value: `${fmt(k * r, 2)}` }] };
}

function batteryAhRuntime(ah: number | null, loadA: number | null): ElectricalResult {
  const a = n(ah);
  const i = n(loadA);
  if (a == null || i == null || i <= 0) return { error: "Enter capacity in Ah and load current in A (> 0).", lines: [] };
  return {
    lines: [
      { label: "Ideal runtime (Peukert not applied)", value: `${fmt(a / i, 2)} h` },
      { label: "Note", value: "Real batteries derate with rate and temperature." },
    ],
  };
}

function lineToPhaseVoltage(vll: number | null): ElectricalResult {
  const v = n(vll);
  if (v == null) return { error: "Enter line-to-line voltage VLL.", lines: [] };
  return { lines: [{ label: "Line-to-neutral VLN", value: `${fmt(v / SQRT3, 3)} V` }] };
}

function phaseToLineVoltage(vln: number | null): ElectricalResult {
  const v = n(vln);
  if (v == null) return { error: "Enter line-to-neutral voltage VLN.", lines: [] };
  return { lines: [{ label: "Line-to-line VLL", value: `${fmt(v * SQRT3, 3)} V` }] };
}

function aiLoadPlanner(watts: number | null, hours: number | null, tariff: number | null): ElectricalResult {
  const w = n(watts);
  const h = n(hours);
  const t = n(tariff);
  if (w == null || h == null) return { error: "Enter average load in watts and hours per day.", lines: [] };
  const kwh = (w / 1000) * h;
  const lines: ElectricalLine[] = [
    { label: "Daily energy", value: `${fmt(kwh, 3)} kWh` },
    { label: "Monthly (×30)", value: `${fmt(kwh * 30, 2)} kWh` },
  ];
  if (t != null) lines.push({ label: "Rough monthly cost at tariff/kWh", value: `${fmt(kwh * 30 * t, 2)}` });
  lines.push({
    label: "Planner note",
    value: "This is a simple energy tally—not a certified load study.",
  });
  return { lines };
}

export function computeElectrical(slug: string, f: Record<string, unknown>): ElectricalResult {
  const V = n(f.V);
  const I = n(f.I);
  const R = n(f.R);
  const P = n(f.P);
  const Pkw = n(f.Pkw);
  const hours = n(f.hours);
  const pf = n(f.PF);
  const kva = n(f.kVA);
  const hp = n(f.hp);
  const kw = n(f.kW);
  const vll = n(f.Vll);
  const sva = n(f.Sva);
  const X = n(f.X);
  const L = n(f.L);
  const C = n(f.C);
  const hz = n(f.f);

  if (slug === "elec-ohms-law-calculator") return ohmLaw(V, I, R);
  if (slug === "elec-voltage-calculator") return ohmLaw(V, I, R);
  if (slug === "elec-current-calculator") return ohmLaw(V, I, R);
  if (slug === "elec-resistance-calculator") return ohmLaw(V, I, R);
  if (slug === "elec-power-calculator-p-vi") return dcPower(V, I, P);
  if (slug === "elec-dc-power-calculator") return dcPower(V, I, P);
  if (slug === "elec-energy-calculator-kwh") return energyKwh(Pkw, hours);
  if (slug === "elec-electrical-work-calculator") return energyKwh(Pkw, hours);
  if (slug === "elec-electric-bill-calculator") {
    const kWhVal = n(f.kWh) ?? (Pkw != null && hours != null ? Pkw * hours : null);
    return electricBill(kWhVal, n(f.tariff));
  }
  if (slug === "elec-energy-consumption-calculator") return energyKwh(Pkw, hours);

  if (slug === "elec-kw-to-hp-converter") return kwToHp(kw);
  if (slug === "elec-hp-to-kw-converter") return hpToKw(hp);
  if (slug === "elec-kva-to-kw-calculator") return kvaToKw(kva, pf);
  if (slug === "elec-kw-to-kva-calculator") {
    const k = n(f.kWreal);
    const pff = pf ?? 0.9;
    if (k == null || pff <= 0) return { error: "Enter real kW and optional PF (default 0.9).", lines: [] };
    return { lines: [{ label: "Apparent kVA ≈ kW / PF", value: `${fmt(k / pff, 3)} kVA` }] };
  }
  if (slug === "elec-kva-to-amps-calculator") return kvaToAmps(kva, vll, pf);
  if (slug === "elec-amps-to-kva-calculator") {
    const i = n(f.Iline);
    const vv = n(f.Vll);
    if (i == null || vv == null) return { error: "Enter line current and line-to-line voltage.", lines: [] };
    const s = (SQRT3 * vv * i) / 1000;
    return { lines: [{ label: "Apparent power S", value: `${fmt(s, 3)} kVA` }] };
  }
  if (slug === "elec-watt-to-amp-calculator") return wattToAmp(P, V);
  if (slug === "elec-amp-to-watt-calculator") return ampToWatt(I, V);
  if (slug === "elec-volt-to-watt-converter") return ampToWatt(I, V);
  if (slug === "elec-watt-to-volt-converter") return wattToAmp(P, V);
  if (slug === "elec-amp-to-volt-converter") {
    if (P == null || I == null || I === 0) return { error: "Enter power (W) and current (A).", lines: [] };
    return { lines: [{ label: "Voltage V = P / I", value: `${fmt(P / I, 3)} V` }] };
  }
  if (slug === "elec-volt-to-amp-converter") return wattToAmp(P, V);

  if (slug === "elec-ac-power-single-phase-calculator") return acSinglePhase(P, V, I, pf);
  if (slug === "elec-ac-power-three-phase-calculator") return acThreePhase(P, vll, I, pf);
  if (slug === "elec-power-factor-calculator") {
    if (P == null || sva == null || sva === 0) return { error: "Enter real power P (W) and apparent S (VA).", lines: [] };
    return { lines: [{ label: "Power factor PF = P / S", value: `${fmt(P / sva, 4)}` }] };
  }
  if (slug === "elec-reactive-power-var-calculator") return reactiveFromSP(sva, P);
  if (slug === "elec-apparent-power-va-calculator") {
    if (V == null || I == null) return { error: "Enter V and I for S = V × I (single-phase magnitude).", lines: [] };
    return { lines: [{ label: "Apparent S", value: `${fmt(V * I, 3)} VA` }] };
  }
  if (slug === "elec-impedance-calculator") return impedanceMag(n(f.R), X);
  if (slug === "elec-dc-voltage-drop-calculator") {
    const len = n(f.lengthM);
    const rho = n(f.rhoOhmM) ?? 0.017; // copper-ish Ω·mm²/m order; user can override
    const area = n(f.areaMm2);
    const curr = n(f.I);
    if (!len || !area || !curr) return { error: "Enter length (m), cross-section (mm²), and current (A).", lines: [] };
    const r = (rho * len) / area;
    return {
      lines: [
        { label: "Estimated loop resistance R", value: `${fmt(r, 4)} Ω` },
        { label: "Voltage drop V = I·R", value: `${fmt(curr * r, 3)} V` },
      ],
    };
  }
  if (slug === "elec-dc-circuit-calculator") return dcPower(V, I, P);

  if (slug === "elec-total-load-calculator") {
    const n1 = n(f.P1) ?? 0;
    const n2 = n(f.P2) ?? 0;
    const n3 = n(f.P3) ?? 0;
    return { lines: [{ label: "Sum of loads", value: `${fmt(n1 + n2 + n3, 3)} W` }] };
  }
  if (slug === "elec-battery-capacity-calculator-ah") {
    const ah = n(f.Ah);
    const vnom = n(f.Vnom) ?? 12;
    if (ah == null) return { error: "Enter capacity in Ah.", lines: [] };
    return {
      lines: [{ label: "Energy at nominal V", value: `${fmt((vnom * ah) / 1000, 3)} kWh (approx)` }],
    };
  }
  if (slug === "elec-battery-backup-time-calculator") return batteryAhRuntime(n(f.Ah), I);
  if (slug === "elec-ups-load-calculator") return wattToAmp(P, V);
  if (slug === "elec-ups-backup-time-calculator") return batteryAhRuntime(n(f.Ah), P != null && V != null && V > 0 ? P / V : null);
  if (slug === "elec-inverter-size-calculator") {
    if (P == null) return { error: "Enter AC load power in watts.", lines: [] };
    const surge = n(f.surgeFactor) ?? 1.25;
    return { lines: [{ label: "Suggested inverter VA (rough)", value: `${fmt(P * surge, 0)} VA` }] };
  }
  if (slug === "elec-solar-battery-calculator") return batteryAhRuntime(n(f.Ah), I);

  if (slug === "elec-solar-panel-calculator") {
    const w = n(f.panelW);
    const num = n(f.numPanels) ?? 1;
    if (w == null) return { error: "Enter panel wattage.", lines: [] };
    return { lines: [{ label: "Array DC nameplate", value: `${fmt(w * num, 0)} W` }] };
  }
  if (slug === "elec-solar-system-size-calculator") {
    const kwhDay = n(f.kwhPerDay);
    const sun = n(f.sunHours) ?? 4;
    if (kwhDay == null) return { error: "Enter daily kWh needed.", lines: [] };
    const kwdc = kwhDay / sun;
    return {
      lines: [
        { label: "Rough DC kW (kWh/day ÷ sun hours)", value: `${fmt(kwdc, 2)} kW` },
        { label: "Assumed sun hours", value: `${fmt(sun, 1)} h` },
      ],
    };
  }
  if (slug === "elec-solar-battery-size-calculator") return energyKwh(Pkw, hours);
  if (slug === "elec-solar-panel-output-calculator") {
    const w = n(f.panelW);
    const eff = n(f.efficiency) ?? 0.2;
    const area = n(f.areaM2);
    if (w != null) return { lines: [{ label: "Nameplate max", value: `${fmt(w, 0)} W` }] };
    if (area != null) return { lines: [{ label: "Rough DC at STC-ish", value: `${fmt(area * 1000 * eff, 0)} W` }] };
    return { error: "Enter panel watts or area (m²).", lines: [] };
  }
  if (slug === "elec-solar-roi-calculator" || slug === "elec-solar-payback-period-calculator") {
    const cost = n(f.systemCost);
    const save = n(f.annualSavings);
    if (cost == null || save == null || save <= 0) {
      return { error: "Enter system cost and estimated annual savings (same currency).", lines: [] };
    }
    return {
      lines: [
        { label: "Simple payback", value: `${fmt(cost / save, 1)} years` },
        { label: "Note", value: "Ignores discounting, O&M, and incentive timing." },
      ],
    };
  }
  if (slug === "elec-solar-energy-generation-calculator") return energyKwh(Pkw, hours);

  if (slug === "elec-three-phase-current-calculator") return kvaToAmps(kva, vll, pf);
  if (slug === "elec-three-phase-power-calculator") return acThreePhase(P, vll, I, pf);
  if (slug === "elec-star-to-delta-conversion-calculator") {
    const ra = n(f.Ra);
    if (ra == null) return { error: "Enter one star branch resistance Ra (Ω).", lines: [] };
    const rd = 3 * ra;
    return { lines: [{ label: "Delta resistor (balanced)", value: `${fmt(rd, 4)} Ω` }] };
  }
  if (slug === "elec-delta-to-star-conversion-calculator") {
    const rd = n(f.Rd);
    if (rd == null) return { error: "Enter one delta branch resistance Rd (Ω).", lines: [] };
    return { lines: [{ label: "Star resistor (balanced)", value: `${fmt(rd / 3, 4)} Ω` }] };
  }
  if (slug === "elec-line-to-phase-voltage-calculator") return lineToPhaseVoltage(vll);
  if (slug === "elec-phase-to-line-voltage-calculator") return phaseToLineVoltage(n(f.Vln));

  if (slug === "elec-ohm-to-kohm-converter") {
    const oh = n(f.ohms);
    if (oh == null) return { error: "Enter resistance in Ω.", lines: [] };
    return { lines: [{ label: "kiloohms", value: `${fmt(oh / 1000, 6)} kΩ` }] };
  }
  if (slug === "elec-frequency-converter-hz-khz-mhz") {
    const val = n(f.freqValue);
    const from = typeof f.freqUnit === "string" ? f.freqUnit : "Hz";
    if (val == null) return { error: "Enter frequency value.", lines: [] };
    let hzVal = val;
    if (from === "kHz") hzVal *= 1000;
    if (from === "MHz") hzVal *= 1e6;
    return {
      lines: [
        { label: "Hz", value: `${fmt(hzVal, 4)}` },
        { label: "kHz", value: `${fmt(hzVal / 1000, 6)}` },
        { label: "MHz", value: `${fmt(hzVal / 1e6, 6)}` },
      ],
    };
  }

  if (slug === "elec-wire-size-calculator" || slug === "elec-cable-size-calculator") {
    return {
      lines: [
        { label: "Guidance", value: "Use local code ampacity tables; enter I (A) below for a rough Cu area hint." },
        ...(I != null ? [{ label: "Very rough Cu area hint (mm²)", value: `${fmt((I * 0.25) ** 1.1, 2)}` }] : []),
      ],
    };
  }
  if (slug === "elec-voltage-drop-calculator") {
    const i = n(f.I);
    const r = n(f.Rwire);
    if (i == null || r == null) return { error: "Enter current (A) and one-way wire resistance (Ω).", lines: [] };
    return { lines: [{ label: "Drop (one way) V = I·R", value: `${fmt(i * r, 3)} V` }] };
  }
  if (slug === "elec-cable-current-capacity-calculator") {
    const area = n(f.areaMm2);
    if (area == null) return { error: "Enter conductor area in mm².", lines: [] };
    return {
      lines: [
        { label: "Very rough ampacity hint (Cu, open air)", value: `${fmt(area * 6, 0)} A` },
        { label: "Note", value: "Derate for bundling, temperature, and insulation per code." },
      ],
    };
  }
  if (slug === "elec-awg-to-mm2-converter") {
    const awg = n(f.awg);
    if (awg == null) return { error: "Enter AWG gauge number (e.g. 12).", lines: [] };
    const mm2 = 0.127 * 92 ** ((36 - awg) / 39);
    return { lines: [{ label: "Approximate area", value: `${fmt(mm2, 3)} mm²` }] };
  }
  if (slug === "elec-conduit-fill-calculator") {
    const wires = n(f.numWires) ?? 1;
    const dia = n(f.wireDiaMm) ?? 2;
    const fill = wires * Math.PI * (dia / 2) ** 2;
    return { lines: [{ label: "Approximate total conductor area", value: `${fmt(fill, 2)} mm²` }] };
  }
  if (slug === "elec-cable-length-calculator") {
    const r = n(f.RperM);
    const target = n(f.targetR);
    if (r == null || target == null || r === 0) return { error: "Enter Ω/m and target R.", lines: [] };
    return { lines: [{ label: "Length", value: `${fmt(target / r, 2)} m` }] };
  }

  if (slug === "elec-motor-power-calculator") return dcPower(V, I, P);
  if (slug === "elec-motor-current-calculator") return wattToAmp(P, V);
  if (slug === "elec-motor-efficiency-calculator") {
    const pin = n(f.Pin);
    const pout = n(f.Pout);
    if (pin == null || pout == null || pin <= 0) return { error: "Enter input and output power (W).", lines: [] };
    return { lines: [{ label: "Efficiency η", value: `${fmt((100 * pout) / pin, 2)} %` }] };
  }
  if (slug === "elec-motor-speed-rpm-calculator") {
    const freqHz = n(f.fSupply) ?? 50;
    const poles = n(f.poles) ?? 4;
    const slip = n(f.slipPct) ?? 3;
    const ns = (120 * freqHz) / poles;
    const nr = ns * (1 - slip / 100);
    return {
      lines: [
        { label: "Synchronous speed ns", value: `${fmt(ns, 2)} rpm` },
        { label: "Approx rotor speed", value: `${fmt(nr, 2)} rpm` },
      ],
    };
  }
  if (slug === "elec-slip-calculator") {
    const ns = n(f.ns);
    const nr = n(f.nr);
    if (ns == null || nr == null || ns === 0) return { error: "Enter synchronous and rotor rpm.", lines: [] };
    const s = ((ns - nr) / ns) * 100;
    return { lines: [{ label: "Slip s", value: `${fmt(s, 3)} %` }] };
  }
  if (slug === "elec-generator-size-calculator") {
    const load = n(f.loadW);
    const margin = n(f.marginPct) ?? 25;
    if (load == null) return { error: "Enter load watts.", lines: [] };
    return { lines: [{ label: "Suggested nameplate (rough)", value: `${fmt(load * (1 + margin / 100), 0)} W` }] };
  }
  if (slug === "elec-generator-fuel-consumption-calculator") {
    const rate = n(f.litersPerKwh) ?? 0.3;
    const e = n(f.energyKwh);
    if (e == null) return { error: "Enter energy produced in kWh.", lines: [] };
    return { lines: [{ label: "Fuel (very rough)", value: `${fmt(e * rate, 2)} L` }] };
  }

  if (slug === "elec-transformer-kva-calculator") {
    const v = n(f.Vpri);
    const ip = n(f.Ipri);
    if (v == null || ip == null) return { error: "Enter primary voltage and current.", lines: [] };
    return { lines: [{ label: "Apparent S (single-phase)", value: `${fmt((v * ip) / 1000, 3)} kVA` }] };
  }
  if (slug === "elec-transformer-current-calculator") return wattToAmp(P, V);
  if (slug === "elec-transformer-turns-ratio-calculator") {
    const np = n(f.Np);
    const ns = n(f.Ns);
    if (np == null || ns == null || ns === 0) return { error: "Enter primary and secondary turns.", lines: [] };
    return { lines: [{ label: "Np : Ns", value: `${fmt(np / ns, 4)} : 1` }] };
  }
  if (slug === "elec-transformer-efficiency-calculator") {
    const pin = n(f.Pin);
    const pout = n(f.Pout);
    if (pin == null || pout == null || pin <= 0) return { error: "Enter input and output power (W).", lines: [] };
    return { lines: [{ label: "Efficiency η", value: `${fmt((100 * pout) / pin, 2)} %` }] };
  }
  if (slug === "elec-transformer-loss-calculator") {
    const pin = n(f.Pin);
    const pout = n(f.Pout);
    if (pin == null || pout == null) return { error: "Enter input and output power.", lines: [] };
    return { lines: [{ label: "Losses", value: `${fmt(pin - pout, 2)} W` }] };
  }

  if (slug === "elec-load-balancing-calculator") {
    const a = n(f.Ia) ?? 0;
    const b = n(f.Ib) ?? 0;
    const c = n(f.Ic) ?? 0;
    const max = Math.max(a, b, c);
    const min = Math.min(a, b, c);
    return { lines: [{ label: "Phase imbalance (max − min)", value: `${fmt(max - min, 3)} A` }] };
  }
  if (slug === "elec-demand-factor-calculator") {
    const connected = n(f.connectedKw);
    const demand = n(f.demandKw);
    if (connected == null || demand == null || connected === 0) {
      return { error: "Enter connected load and diversified demand (kW).", lines: [] };
    }
    return { lines: [{ label: "Demand factor", value: `${fmt(demand / connected, 3)}` }] };
  }
  if (slug === "elec-diversity-factor-calculator") {
    const ind = n(f.individualSum);
    const sim = n(f.simultaneous);
    if (ind == null || sim == null || sim === 0) return { error: "Enter sum of individual maxima and simultaneous demand.", lines: [] };
    return { lines: [{ label: "Diversity factor", value: `${fmt(ind / sim, 3)}` }] };
  }
  if (slug === "elec-short-circuit-current-calculator" || slug === "elec-fault-current-calculator") {
    const v = n(f.Vll);
    const z = n(f.Ztotal);
    if (v == null || z == null || z === 0) return { error: "Enter VLL (V) and total impedance (Ω).", lines: [] };
    const isc = v / (SQRT3 * z);
    return {
      lines: [
        { label: "Symmetrical AC line current (idealized)", value: `${fmt(isc, 0)} A` },
        { label: "Warning", value: "Utility fault currents need utility data and standards." },
      ],
    };
  }
  if (slug === "elec-earthing-grounding-calculator" || slug === "elec-earthing-resistance-calculator") {
    const rho = n(f.rhoOhmM) ?? 100;
    const len = n(f.rodLengthM) ?? 3;
    const r = rho / (2 * Math.PI * len);
    return {
      lines: [
        { label: "Very rough single-rod estimate R", value: `${fmt(r, 1)} Ω` },
        { label: "Note", value: "Wenner measurements and code tables are authoritative." },
      ],
    };
  }

  if (slug === "elec-fuse-size-calculator" || slug === "elec-circuit-breaker-size-calculator") {
    const i = n(f.Iload);
    if (i == null) return { error: "Enter continuous load current (A).", lines: [] };
    return { lines: [{ label: "Next standard multiple (125% rule, illustrative)", value: `${fmt(i * 1.25, 1)} A` }] };
  }
  if (slug === "elec-lightning-protection-calculator") {
    return {
      lines: [
        {
          label: "Study note",
          value: "Lightning protection is code-driven; use this page only for ballpark resistance math.",
        },
      ],
    };
  }

  if (slug === "elec-rlc-circuit-calculator") return impedanceMag(n(f.R), X);
  if (slug === "elec-resonant-frequency-calculator") return resonantF(L, C);
  if (slug === "elec-inductance-calculator") return xl(hz, L);
  if (slug === "elec-capacitance-calculator-electrical") return xc(hz, C);
  if (slug === "elec-reactance-xl-xc-calculator") {
    const rx = xl(hz, L);
    const cx = xc(hz, C);
    if (rx.error && cx.error) return { error: "Enter f and L for XL and/or f and C for XC.", lines: [] };
    return { lines: [...rx.lines, ...cx.lines] };
  }
  if (slug === "elec-harmonics-calculator") {
    const fund = n(f.I1);
    const h3 = n(f.I3) ?? 0;
    if (fund == null) return { error: "Enter fundamental RMS current (A).", lines: [] };
    const rms = Math.sqrt(fund ** 2 + h3 ** 2);
    return { lines: [{ label: "RMS with selected harmonics (partial)", value: `${fmt(rms, 3)} A` }] };
  }

  if (
    slug === "elec-ai-electrical-load-planner" ||
    slug === "elec-ai-solar-recommendation-tool" ||
    slug === "elec-ai-power-consumption-optimizer"
  ) {
    return aiLoadPlanner(n(f.loadW), n(f.hoursDay), n(f.tariff));
  }

  return {
    error:
      "Select inputs on the left for this calculator type. If fields are missing, this slug may need more specific inputs—try related electrical tools in the hub.",
    lines: [],
  };
}
