"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { UNIT_URL } from "@/lib/calculators/unitHelpers";
import {
  computeUnitConvert,
  type UnitConvertInput,
  type UnitConvertResult,
  type UnitConvertSlug,
} from "@/lib/calculators/unitConvert";
import { parseFiniteNumber, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode =
  | "pair"
  | "temp"
  | "chain"
  | "gallon"
  | "molarity"
  | "cement"
  | "sand"
  | "brick"
  | "yarn";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  aLabel: string;
};

const EMPTY = { aDefault: "", bDefault: "", cDefault: "", aLabel: "Value" };

const DISCLAIMER =
  "Unit conversion teaching aid — factors are standard SI/imperial references; specialty trades may use different conventions.";

const CONFIG: Record<UnitConvertSlug, Config> = {
  "unit-meter-kilometer-converter": {
    title: "Meter ↔ Kilometer",
    description: `Convert meters to kilometers. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1000", aLabel: "m",
  },
  "unit-centimeter-meter-converter": {
    title: "Centimeter ↔ Meter",
    description: `Convert centimeters to meters. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "100", aLabel: "cm",
  },
  "unit-millimeter-meter-converter": {
    title: "Millimeter ↔ Meter",
    description: `Convert millimeters to meters. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1000", aLabel: "mm",
  },
  "unit-inch-centimeter-converter": {
    title: "Inch ↔ Centimeter",
    description: `Convert inches to centimeters. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "12", aLabel: "in",
  },
  "unit-feet-meter-converter": {
    title: "Feet ↔ Meter",
    description: `Convert feet to meters. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "10", aLabel: "ft",
  },
  "unit-yard-meter-converter": {
    title: "Yard ↔ Meter",
    description: `Convert yards to meters. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "10", aLabel: "yd",
  },
  "unit-mile-kilometer-converter": {
    title: "Mile ↔ Kilometer",
    description: `Convert miles to kilometers. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "mi",
  },
  "unit-nautical-mile-converter": {
    title: "Nautical mile ↔ Kilometer",
    description: `Convert nautical miles to kilometers. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "nmi",
  },
  "unit-gram-kilogram-converter": {
    title: "Gram ↔ Kilogram",
    description: `Convert grams to kilograms. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1000", aLabel: "g",
  },
  "unit-kilogram-pound-converter": {
    title: "Kilogram ↔ Pound",
    description: `Convert kilograms to pounds. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "kg",
  },
  "unit-pound-ounce-converter": {
    title: "Pound ↔ Ounce",
    description: `Convert pounds to ounces. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "lb",
  },
  "unit-ton-kilogram-converter": {
    title: "Ton ↔ Kilogram",
    description: `Convert metric tons to kilograms. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "t (metric)",
  },
  "unit-stone-pound-converter": {
    title: "Stone ↔ Pound",
    description: `Convert stone to pounds. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "st",
  },
  "unit-square-meter-square-feet-converter": {
    title: "Square meter ↔ Square feet",
    description: `Convert square meters to square feet. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "m²",
  },
  "unit-acre-hectare-converter": {
    title: "Acre ↔ Hectare",
    description: `Convert acres to hectares. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "acre",
  },
  "unit-square-kilometer-square-mile-converter": {
    title: "Square kilometer ↔ Square mile",
    description: `Convert square kilometers to square miles. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "km²",
  },
  "unit-square-yard-square-feet-converter": {
    title: "Square yard ↔ Square feet",
    description: `Convert square yards to square feet. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "yd²",
  },
  "unit-liter-milliliter-converter": {
    title: "Liter ↔ Milliliter",
    description: `Convert liters to milliliters. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "L",
  },
  "unit-liter-gallon-us-uk-converter": {
    title: "Liter ↔ Gallon (US/UK)",
    description: `Convert liters to US and UK gallons. ${DISCLAIMER}`,
    mode: "gallon",
    ...EMPTY, aDefault: "1", aLabel: "L",
  },
  "unit-cubic-meter-liter-converter": {
    title: "Cubic meter ↔ Liter",
    description: `Convert cubic meters to liters. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "m³",
  },
  "unit-cup-milliliter-converter": {
    title: "Cup ↔ Milliliter",
    description: `Convert US cups to milliliters. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "cup (US)",
  },
  "unit-tablespoon-teaspoon-converter": {
    title: "Tablespoon ↔ Teaspoon",
    description: `Convert tablespoons to teaspoons. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "tbsp",
  },
  "unit-celsius-fahrenheit-converter": {
    title: "Celsius ↔ Fahrenheit",
    description: `Convert Celsius to Fahrenheit. ${DISCLAIMER}`,
    mode: "temp",
    ...EMPTY, aDefault: "25", aLabel: "°C",
  },
  "unit-celsius-kelvin-converter": {
    title: "Celsius ↔ Kelvin",
    description: `Convert Celsius to Kelvin. ${DISCLAIMER}`,
    mode: "temp",
    ...EMPTY, aDefault: "25", aLabel: "°C",
  },
  "unit-fahrenheit-kelvin-converter": {
    title: "Fahrenheit ↔ Kelvin",
    description: `Convert Fahrenheit to Kelvin. ${DISCLAIMER}`,
    mode: "temp",
    ...EMPTY, aDefault: "77", aLabel: "°F",
  },
  "unit-seconds-minutes-hours-converter": {
    title: "Seconds ↔ Minutes ↔ Hours",
    description: `Convert seconds to minutes and hours. ${DISCLAIMER}`,
    mode: "chain",
    ...EMPTY, aDefault: "3600", aLabel: "s",
  },
  "unit-days-weeks-months-years-converter": {
    title: "Days ↔ Weeks ↔ Months ↔ Years",
    description: `Convert days to weeks, months, and years (mean lengths). ${DISCLAIMER}`,
    mode: "chain",
    ...EMPTY, aDefault: "365", aLabel: "days",
  },
  "unit-milliseconds-seconds-converter": {
    title: "Milliseconds ↔ Seconds",
    description: `Convert milliseconds to seconds. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1000", aLabel: "ms",
  },
  "unit-kmh-ms-converter": {
    title: "km/h ↔ m/s",
    description: `Convert kilometers per hour to meters per second. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "36", aLabel: "km/h",
  },
  "unit-mph-kmh-converter": {
    title: "mph ↔ km/h",
    description: `Convert miles per hour to kilometers per hour. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "60", aLabel: "mph",
  },
  "unit-knot-kmh-converter": {
    title: "Knot ↔ km/h",
    description: `Convert knots to kilometers per hour. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "10", aLabel: "kn",
  },
  "unit-joule-kilojoule-converter": {
    title: "Joule ↔ Kilojoule",
    description: `Convert joules to kilojoules. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1000", aLabel: "J",
  },
  "unit-calorie-kilocalorie-converter": {
    title: "Calorie ↔ Kilocalorie",
    description: `Convert calories to kilocalories. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1000", aLabel: "cal",
  },
  "unit-kwh-joule-converter": {
    title: "kWh ↔ Joule",
    description: `Convert kilowatt-hours to joules. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "kWh",
  },
  "unit-btu-joule-converter": {
    title: "BTU ↔ Joule",
    description: `Convert BTU to joules. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "BTU",
  },
  "unit-watt-kilowatt-converter": {
    title: "Watt ↔ Kilowatt",
    description: `Convert watts to kilowatts. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1000", aLabel: "W",
  },
  "unit-horsepower-watt-converter": {
    title: "Horsepower ↔ Watt",
    description: `Convert mechanical horsepower to watts. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "hp (mech)",
  },
  "unit-hz-khz-mhz-ghz-converter": {
    title: "Hz ↔ kHz ↔ MHz ↔ GHz",
    description: `Convert hertz through SI frequency prefixes. ${DISCLAIMER}`,
    mode: "chain",
    ...EMPTY, aDefault: "1000", aLabel: "Hz",
  },
  "unit-rpm-hz-converter": {
    title: "RPM ↔ Hz",
    description: `Convert revolutions per minute to hertz. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "60", aLabel: "rpm",
  },
  "unit-pascal-bar-converter": {
    title: "Pascal ↔ Bar",
    description: `Convert pascals to bar. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "100000", aLabel: "Pa",
  },
  "unit-psi-bar-converter": {
    title: "PSI ↔ Bar",
    description: `Convert pounds per square inch to bar. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "14.5", aLabel: "psi",
  },
  "unit-atm-pascal-converter": {
    title: "atm ↔ Pascal",
    description: `Convert atmospheres to pascals. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "atm",
  },
  "unit-mmhg-torr-converter": {
    title: "mmHg ↔ Torr",
    description: `Convert mmHg to Torr. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "760", aLabel: "mmHg",
  },
  "unit-degree-radian-converter": {
    title: "Degree ↔ Radian",
    description: `Convert degrees to radians. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "180", aLabel: "°",
  },
  "unit-degree-gradian-converter": {
    title: "Degree ↔ Gradian",
    description: `Convert degrees to gradians. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "90", aLabel: "°",
  },
  "unit-arcminute-degree-converter": {
    title: "Arcminute ↔ Degree",
    description: `Convert arcminutes to degrees. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "60", aLabel: "′",
  },
  "unit-kb-mb-gb-tb-converter": {
    title: "KB ↔ MB ↔ GB ↔ TB",
    description: `Convert kilobytes through terabytes (decimal SI). ${DISCLAIMER}`,
    mode: "chain",
    ...EMPTY, aDefault: "1000", aLabel: "KB",
  },
  "unit-byte-bit-converter": {
    title: "Byte ↔ Bit",
    description: `Convert bytes to bits. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "B",
  },
  "unit-mb-mib-converter": {
    title: "MB ↔ MiB",
    description: `Convert decimal megabytes to mebibytes. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "MB (decimal)",
  },
  "unit-megabit-per-second-megabyte-per-second": {
    title: "Mbps ↔ MBps",
    description: `Convert megabits per second to megabytes per second. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "100", aLabel: "Mbps",
  },
  "unit-kbps-mbps-converter": {
    title: "Kbps ↔ Mbps",
    description: `Convert kilobits per second to megabits per second. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1000", aLabel: "Kbps",
  },
  "unit-gbps-mbps-converter": {
    title: "Gbps ↔ Mbps",
    description: `Convert gigabits per second to megabits per second. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "Gbps",
  },
  "unit-km-per-liter-mpg-converter": {
    title: "km/L ↔ mpg (US)",
    description: `Convert kilometers per liter to US miles per gallon. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "15", aLabel: "km/L",
  },
  "unit-mpg-us-mpg-uk-converter": {
    title: "mpg (US) ↔ mpg (UK)",
    description: `Convert US mpg to UK mpg. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "30", aLabel: "mpg (US)",
  },
  "unit-kg-per-m3-g-per-cm3-converter": {
    title: "kg/m³ ↔ g/cm³",
    description: `Convert kilograms per cubic meter to grams per cubic centimeter. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1000", aLabel: "kg/m³",
  },
  "unit-newton-kgf-converter": {
    title: "Newton ↔ kgf",
    description: `Convert newtons to kilogram-force. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "9.80665", aLabel: "N",
  },
  "unit-newton-pound-force-converter": {
    title: "Newton ↔ Pound-force",
    description: `Convert newtons to pounds-force. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "N",
  },
  "unit-molarity-converter": {
    title: "Molarity",
    description: `Molarity from moles of solute and solution volume. ${DISCLAIMER}`,
    mode: "molarity",
    ...EMPTY, aDefault: "1", bDefault: "1", aLabel: "moles",
  },
  "unit-mg-per-liter-ppm-converter": {
    title: "mg/L ↔ ppm",
    description: `Convert mg/L to ppm for dilute aqueous solutions. ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "1", aLabel: "mg/L",
  },
  "unit-cement-bag-kilogram-converter": {
    title: "Cement bag ↔ kg",
    description: `Convert cement bags to kilograms. ${DISCLAIMER}`,
    mode: "cement",
    ...EMPTY, aDefault: "10", bDefault: "50", aLabel: "bags",
  },
  "unit-sand-volume-converter": {
    title: "Sand volume",
    description: `Estimate sand mass from volume and density. ${DISCLAIMER}`,
    mode: "sand",
    ...EMPTY, aDefault: "1", bDefault: "1600", aLabel: "m³",
  },
  "unit-brick-calculator-units": {
    title: "Brick calculator units",
    description: `Estimate brick count from wall area, face size, and waste %. ${DISCLAIMER}`,
    mode: "brick",
    ...EMPTY, aDefault: "10", bDefault: "0.0143", cDefault: "5", aLabel: "m²",
  },
  "unit-gsm-oz-per-yd2-converter": {
    title: "GSM ↔ oz/yd²",
    description: `Convert fabric weight from g/m² to oz/yd². ${DISCLAIMER}`,
    mode: "pair",
    ...EMPTY, aDefault: "150", aLabel: "g/m²",
  },
  "unit-yarn-count-converter": {
    title: "Yarn count (Nm ↔ Ne)",
    description: `Convert metric yarn count Nm to approximate Ne. ${DISCLAIMER}`,
    mode: "yarn",
    ...EMPTY, aDefault: "40", aLabel: "Nm",
  },
};

const FALLBACK: UnitConvertSlug = "unit-meter-kilometer-converter";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function formatResult(res: UnitConvertResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.a !== undefined) rows.push({ label: res.labelA ?? "A", value: num(res.a) });
  if (res.b !== undefined) rows.push({ label: res.labelB ?? "B", value: num(res.b) });
  if (res.c !== undefined) rows.push({ label: res.labelC ?? "C", value: num(res.c) });
  if (res.d !== undefined) rows.push({ label: res.labelD ?? "D", value: num(res.d) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.b !== undefined ? num(res.b)
    : res.a !== undefined ? num(res.a)
    : res.c !== undefined ? num(res.c)
    : res.d !== undefined ? num(res.d)
    : "—";
  const primaryLabel =
    res.b !== undefined ? (res.labelB ?? "Result")
    : res.a !== undefined ? (res.labelA ?? "Result")
    : res.c !== undefined ? (res.labelC ?? "Result")
    : res.d !== undefined ? (res.labelD ?? "Result")
    : "Result";
  return { primary, primaryLabel, rows };
}

export function UnitConvertersCalculatorHost({ slug }: { slug: string }) {
  const key = (slug in CONFIG ? slug : FALLBACK) as UnitConvertSlug;
  const config = CONFIG[key];
  const [a, setA] = useState(useLoanInitialInput(UNIT_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(UNIT_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(UNIT_URL.C, config.cDefault));

  const num = (nVal: number, dec = 6) => {
    if (!Number.isFinite(nVal)) return "—";
    const abs = Math.abs(nVal);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-4)) return nVal.toExponential(4);
    const fixed = nVal.toFixed(dec);
    return fixed.replace(/\.?0+$/, "") || "0";
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => {
      if (val.trim() !== "") out[k] = val;
    };
    switch (config.mode) {
      case "pair":
      case "temp":
      case "chain":
      case "gallon":
      case "yarn":
        put(UNIT_URL.A, a);
        break;
      case "molarity":
      case "cement":
      case "sand":
        put(UNIT_URL.A, a);
        put(UNIT_URL.B, b);
        break;
      case "brick":
        put(UNIT_URL.A, a);
        put(UNIT_URL.B, b);
        put(UNIT_URL.C, c);
        break;
    }
    return out;
  }, [a, b, c, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c]);

  const result = useMemo(() => {
    const input: UnitConvertInput = {};
    switch (config.mode) {
      case "pair":
      case "temp":
      case "gallon": {
        const v = parseFiniteNumber(a, config.aLabel);
        if (!v.ok) return { error: v.error };
        input.value = v.value;
        break;
      }
      case "chain": {
        const v = parseNonNegative(a, config.aLabel);
        if (!v.ok) return { error: v.error };
        input.value = v.value;
        break;
      }
      case "yarn": {
        const v = parsePositive(a, "Metric count Nm");
        if (!v.ok) return { error: v.error };
        input.nm = v.value;
        input.value = v.value;
        break;
      }
      case "molarity": {
        const moles = parseNonNegative(a, "Moles of solute");
        if (!moles.ok) return { error: moles.error };
        input.moles = moles.value;
        const liters = parsePositive(b, "Solution liters");
        if (!liters.ok) return { error: liters.error };
        input.liters = liters.value;
        break;
      }
      case "cement": {
        const bags = parseNonNegative(a, "Bags");
        if (!bags.ok) return { error: bags.error };
        input.bags = bags.value;
        const bagKg = parsePositive(b, "kg per bag");
        if (!bagKg.ok) return { error: bagKg.error };
        input.bagKg = bagKg.value;
        break;
      }
      case "sand": {
        const vol = parsePositive(a, "Volume m³");
        if (!vol.ok) return { error: vol.error };
        input.volumeM3 = vol.value;
        const dens = parsePositive(b, "Density kg/m³");
        if (!dens.ok) return { error: dens.error };
        input.densityKgM3 = dens.value;
        break;
      }
      case "brick": {
        const area = parsePositive(a, "Wall area m²");
        if (!area.ok) return { error: area.error };
        input.wallAreaM2 = area.value;
        const face = parsePositive(b, "Brick face m²");
        if (!face.ok) return { error: face.error };
        input.brickFaceM2 = face.value;
        const waste = parseNonNegative(c, "Waste %");
        if (!waste.ok) return { error: waste.error };
        input.mortarPct = waste.value;
        break;
      }
    }
    return formatResult(computeUnitConvert(key, input), num);
  }, [a, b, c, config.aLabel, config.mode, key]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "pair" || config.mode === "temp" || config.mode === "chain" || config.mode === "gallon" ? (
            <div>
              <FieldLabel htmlFor="uc-a">{config.aLabel}</FieldLabel>
              <FieldInput id="uc-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}
          {config.mode === "yarn" ? (
            <div>
              <FieldLabel htmlFor="uc-a">Metric count (Nm)</FieldLabel>
              <FieldInput id="uc-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
            </div>
          ) : null}
          {config.mode === "molarity" ? (
            <>
              <div>
                <FieldLabel htmlFor="uc-a">Moles of solute</FieldLabel>
                <FieldInput id="uc-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="uc-b">Solution liters</FieldLabel>
                <FieldInput id="uc-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}
          {config.mode === "cement" ? (
            <>
              <div>
                <FieldLabel htmlFor="uc-a">Bags</FieldLabel>
                <FieldInput id="uc-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="uc-b">kg per bag</FieldLabel>
                <FieldInput id="uc-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}
          {config.mode === "sand" ? (
            <>
              <div>
                <FieldLabel htmlFor="uc-a">Volume (m³)</FieldLabel>
                <FieldInput id="uc-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="uc-b">Density (kg/m³)</FieldLabel>
                <FieldInput id="uc-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}
          {config.mode === "brick" ? (
            <>
              <div>
                <FieldLabel htmlFor="uc-a">Wall area (m²)</FieldLabel>
                <FieldInput id="uc-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="uc-b">Brick face (m²)</FieldLabel>
                <FieldInput id="uc-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="uc-c">Waste / mortar %</FieldLabel>
                <FieldInput id="uc-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          {"error" in result ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--muted)]">{result.primaryLabel}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{result.primary}</p>
              </div>
              <div className="space-y-2 text-sm">
                {result.rows.map((row) => (
                  <Row key={row.label} label={row.label} value={row.value} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
