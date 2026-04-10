import type { SectionNode } from "../hub-section-types";

const p = (slug: string, title: string) => ({ slug, title, status: "planned" as const });

export const CONVERSION_UNIT_CONVERTERS_SECTIONS: SectionNode[] = [
  {
    slug: "unit-length-distance",
    title: "Length and distance converters",
    description: "SI and imperial length pairs for everyday and engineering measurements.",
    calculators: [
      p("unit-meter-kilometer-converter", "Meter ↔ Kilometer"),
      p("unit-centimeter-meter-converter", "Centimeter ↔ Meter"),
      p("unit-millimeter-meter-converter", "Millimeter ↔ Meter"),
      p("unit-inch-centimeter-converter", "Inch ↔ cm"),
      p("unit-feet-meter-converter", "Feet ↔ Meter"),
      p("unit-yard-meter-converter", "Yard ↔ Meter"),
      p("unit-mile-kilometer-converter", "Mile ↔ Kilometer"),
      p("unit-nautical-mile-converter", "Nautical Mile Converter"),
    ],
  },
  {
    slug: "unit-weight-mass",
    title: "Weight and mass converters",
    description: "Grams to tons and common imperial mass units.",
    calculators: [
      p("unit-gram-kilogram-converter", "Gram ↔ Kilogram"),
      p("unit-kilogram-pound-converter", "Kilogram ↔ Pound"),
      p("unit-pound-ounce-converter", "Pound ↔ Ounce"),
      p("unit-ton-kilogram-converter", "Ton ↔ Kilogram"),
      p("unit-stone-pound-converter", "Stone ↔ Pound"),
    ],
  },
  {
    slug: "unit-area",
    title: "Area converters",
    description: "Floor plans, land, and survey-style area unit swaps.",
    calculators: [
      p("unit-square-meter-square-feet-converter", "Square Meter ↔ Square Feet"),
      p("unit-acre-hectare-converter", "Acre ↔ Hectare"),
      p("unit-square-kilometer-square-mile-converter", "Square Kilometer ↔ Square Mile"),
      p("unit-square-yard-square-feet-converter", "Square Yard ↔ Square Feet"),
    ],
  },
  {
    slug: "unit-volume",
    title: "Volume converters",
    description: "Cooking, fluid, and cubic volume conversions.",
    calculators: [
      p("unit-liter-milliliter-converter", "Liter ↔ Milliliter"),
      p("unit-liter-gallon-us-uk-converter", "Liter ↔ Gallon (US/UK)"),
      p("unit-cubic-meter-liter-converter", "Cubic Meter ↔ Liter"),
      p("unit-cup-milliliter-converter", "Cup ↔ ml"),
      p("unit-tablespoon-teaspoon-converter", "Tablespoon ↔ Teaspoon"),
    ],
  },
  {
    slug: "unit-temperature",
    title: "Temperature converters",
    description: "Celsius, Fahrenheit, and Kelvin for science and weather.",
    calculators: [
      p("unit-celsius-fahrenheit-converter", "Celsius ↔ Fahrenheit"),
      p("unit-celsius-kelvin-converter", "Celsius ↔ Kelvin"),
      p("unit-fahrenheit-kelvin-converter", "Fahrenheit ↔ Kelvin"),
    ],
  },
  {
    slug: "unit-time-duration",
    title: "Time unit and duration converters",
    description: "Seconds through years as pure unit math—not calendar date arithmetic.",
    calculators: [
      p("unit-seconds-minutes-hours-converter", "Seconds ↔ Minutes ↔ Hours"),
      p("unit-days-weeks-months-years-converter", "Days ↔ Weeks ↔ Months ↔ Years"),
      p("unit-milliseconds-seconds-converter", "Milliseconds ↔ Seconds"),
    ],
  },
  {
    slug: "unit-speed",
    title: "Speed converters",
    description: "Velocity units for vehicles, wind, and maritime use.",
    calculators: [
      p("unit-kmh-ms-converter", "km/h ↔ m/s"),
      p("unit-mph-kmh-converter", "mph ↔ km/h"),
      p("unit-knot-kmh-converter", "Knot ↔ km/h"),
    ],
  },
  {
    slug: "unit-energy",
    title: "Energy converters",
    description: "Joules, calories, kWh, and BTU for physics and utilities.",
    calculators: [
      p("unit-joule-kilojoule-converter", "Joule ↔ kJ"),
      p("unit-calorie-kilocalorie-converter", "Calorie ↔ kcal"),
      p("unit-kwh-joule-converter", "kWh ↔ Joule"),
      p("unit-btu-joule-converter", "BTU ↔ Joule"),
    ],
  },
  {
    slug: "unit-power",
    title: "Power converters",
    description: "Watts, kilowatts, and mechanical horsepower.",
    calculators: [
      p("unit-watt-kilowatt-converter", "Watt ↔ Kilowatt"),
      p("unit-horsepower-watt-converter", "HP ↔ Watt"),
    ],
  },
  {
    slug: "unit-frequency",
    title: "Frequency converters",
    description: "Hz through GHz and rotation rate to frequency.",
    calculators: [
      p("unit-hz-khz-mhz-ghz-converter", "Hz ↔ kHz ↔ MHz ↔ GHz"),
      p("unit-rpm-hz-converter", "RPM ↔ Hz"),
    ],
  },
  {
    slug: "unit-pressure",
    title: "Pressure converters",
    description: "Pascal, bar, PSI, atm, and medical pressure units.",
    calculators: [
      p("unit-pascal-bar-converter", "Pascal ↔ Bar"),
      p("unit-psi-bar-converter", "PSI ↔ Bar"),
      p("unit-atm-pascal-converter", "atm ↔ Pascal"),
      p("unit-mmhg-torr-converter", "mmHg ↔ Torr"),
    ],
  },
  {
    slug: "unit-angle",
    title: "Angle converters",
    description: "Degrees, radians, gradians, and arcminutes.",
    calculators: [
      p("unit-degree-radian-converter", "Degree ↔ Radian"),
      p("unit-degree-gradian-converter", "Degree ↔ Gradian"),
      p("unit-arcminute-degree-converter", "Arcminute ↔ Degree"),
    ],
  },
  {
    slug: "unit-digital-storage",
    title: "Digital storage converters",
    description: "Decimal and binary prefixes for bytes, bits, and storage tiers.",
    calculators: [
      p("unit-kb-mb-gb-tb-converter", "KB ↔ MB ↔ GB ↔ TB"),
      p("unit-byte-bit-converter", "Byte ↔ Bit"),
      p("unit-mb-mib-converter", "MB ↔ MiB"),
    ],
  },
  {
    slug: "unit-data-transfer-rate",
    title: "Data transfer rate converters",
    description: "Mbps, MBps, and related networking throughput units.",
    calculators: [
      p("unit-megabit-per-second-megabyte-per-second", "Mbps ↔ MBps"),
      p("unit-kbps-mbps-converter", "Kbps ↔ Mbps"),
      p("unit-gbps-mbps-converter", "Gbps ↔ Mbps"),
    ],
  },
  {
    slug: "unit-fuel-economy",
    title: "Fuel economy converters",
    description: "km/l, mpg US, and mpg UK for vehicles.",
    calculators: [
      p("unit-km-per-liter-mpg-converter", "km/l ↔ mpg"),
      p("unit-mpg-us-mpg-uk-converter", "mpg (US) ↔ mpg (UK)"),
    ],
  },
  {
    slug: "unit-density",
    title: "Density converters",
    description: "Mass per volume for materials and lab work.",
    calculators: [p("unit-kg-per-m3-g-per-cm3-converter", "kg/m³ ↔ g/cm³")],
  },
  {
    slug: "unit-force",
    title: "Force converters",
    description: "Newtons and common force equivalents.",
    calculators: [
      p("unit-newton-kgf-converter", "Newton ↔ kgf"),
      p("unit-newton-pound-force-converter", "Newton ↔ Pound-force"),
    ],
  },
  {
    slug: "unit-concentration",
    title: "Concentration converters",
    description: "Molarity and mass-per-volume for chemistry and water quality.",
    calculators: [
      p("unit-molarity-converter", "Molarity"),
      p("unit-mg-per-liter-ppm-converter", "mg/L ↔ ppm"),
    ],
  },
  {
    slug: "unit-construction",
    title: "Construction unit converters",
    description: "Cement, sand, and brick-related unit helpers for sites.",
    calculators: [
      p("unit-cement-bag-kilogram-converter", "Cement Bag ↔ kg"),
      p("unit-sand-volume-converter", "Sand Volume Converter"),
      p("unit-brick-calculator-units", "Brick Calculator Units"),
    ],
  },
  {
    slug: "unit-textile-fabric",
    title: "Textile and fabric unit converters",
    description: "Fabric weight and yarn count conversions for textiles.",
    calculators: [
      p("unit-gsm-oz-per-yd2-converter", "GSM ↔ oz/yd²"),
      p("unit-yarn-count-converter", "Yarn Count Converter"),
    ],
  },
];
