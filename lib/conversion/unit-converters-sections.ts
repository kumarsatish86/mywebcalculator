import type { SectionNode } from "../hub-section-types";

const live = (slug: string, title: string) => ({ slug, title });

export const CONVERSION_UNIT_CONVERTERS_SECTIONS: SectionNode[] = [
  {
    slug: "unit-length-distance",
    title: "Length and distance converters",
    description: "SI and imperial length pairs for everyday and engineering measurements.",
    calculators: [
      live("unit-meter-kilometer-converter", "Meter ↔ Kilometer"),
      live("unit-centimeter-meter-converter", "Centimeter ↔ Meter"),
      live("unit-millimeter-meter-converter", "Millimeter ↔ Meter"),
      live("unit-inch-centimeter-converter", "Inch ↔ cm"),
      live("unit-feet-meter-converter", "Feet ↔ Meter"),
      live("unit-yard-meter-converter", "Yard ↔ Meter"),
      live("unit-mile-kilometer-converter", "Mile ↔ Kilometer"),
      live("unit-nautical-mile-converter", "Nautical Mile Converter"),
    ],
  },
  {
    slug: "unit-weight-mass",
    title: "Weight and mass converters",
    description: "Grams to tons and common imperial mass units.",
    calculators: [
      live("unit-gram-kilogram-converter", "Gram ↔ Kilogram"),
      live("unit-kilogram-pound-converter", "Kilogram ↔ Pound"),
      live("unit-pound-ounce-converter", "Pound ↔ Ounce"),
      live("unit-ton-kilogram-converter", "Ton ↔ Kilogram"),
      live("unit-stone-pound-converter", "Stone ↔ Pound"),
    ],
  },
  {
    slug: "unit-area",
    title: "Area converters",
    description: "Floor plans, land, and survey-style area unit swaps.",
    calculators: [
      live("unit-square-meter-square-feet-converter", "Square Meter ↔ Square Feet"),
      live("unit-acre-hectare-converter", "Acre ↔ Hectare"),
      live("unit-square-kilometer-square-mile-converter", "Square Kilometer ↔ Square Mile"),
      live("unit-square-yard-square-feet-converter", "Square Yard ↔ Square Feet"),
    ],
  },
  {
    slug: "unit-volume",
    title: "Volume converters",
    description: "Cooking, fluid, and cubic volume conversions.",
    calculators: [
      live("unit-liter-milliliter-converter", "Liter ↔ Milliliter"),
      live("unit-liter-gallon-us-uk-converter", "Liter ↔ Gallon (US/UK)"),
      live("unit-cubic-meter-liter-converter", "Cubic Meter ↔ Liter"),
      live("unit-cup-milliliter-converter", "Cup ↔ ml"),
      live("unit-tablespoon-teaspoon-converter", "Tablespoon ↔ Teaspoon"),
    ],
  },
  {
    slug: "unit-temperature",
    title: "Temperature converters",
    description: "Celsius, Fahrenheit, and Kelvin for science and weather.",
    calculators: [
      live("unit-celsius-fahrenheit-converter", "Celsius ↔ Fahrenheit"),
      live("unit-celsius-kelvin-converter", "Celsius ↔ Kelvin"),
      live("unit-fahrenheit-kelvin-converter", "Fahrenheit ↔ Kelvin"),
    ],
  },
  {
    slug: "unit-time-duration",
    title: "Time unit and duration converters",
    description: "Seconds through years as pure unit math—not calendar date arithmetic.",
    calculators: [
      live("unit-seconds-minutes-hours-converter", "Seconds ↔ Minutes ↔ Hours"),
      live("unit-days-weeks-months-years-converter", "Days ↔ Weeks ↔ Months ↔ Years"),
      live("unit-milliseconds-seconds-converter", "Milliseconds ↔ Seconds"),
    ],
  },
  {
    slug: "unit-speed",
    title: "Speed converters",
    description: "Velocity units for vehicles, wind, and maritime use.",
    calculators: [
      live("unit-kmh-ms-converter", "km/h ↔ m/s"),
      live("unit-mph-kmh-converter", "mph ↔ km/h"),
      live("unit-knot-kmh-converter", "Knot ↔ km/h"),
    ],
  },
  {
    slug: "unit-energy",
    title: "Energy converters",
    description: "Joules, calories, kWh, and BTU for physics and utilities.",
    calculators: [
      live("unit-joule-kilojoule-converter", "Joule ↔ kJ"),
      live("unit-calorie-kilocalorie-converter", "Calorie ↔ kcal"),
      live("unit-kwh-joule-converter", "kWh ↔ Joule"),
      live("unit-btu-joule-converter", "BTU ↔ Joule"),
    ],
  },
  {
    slug: "unit-power",
    title: "Power converters",
    description: "Watts, kilowatts, and mechanical horsepower.",
    calculators: [
      live("unit-watt-kilowatt-converter", "Watt ↔ Kilowatt"),
      live("unit-horsepower-watt-converter", "HP ↔ Watt"),
    ],
  },
  {
    slug: "unit-frequency",
    title: "Frequency converters",
    description: "Hz through GHz and rotation rate to frequency.",
    calculators: [
      live("unit-hz-khz-mhz-ghz-converter", "Hz ↔ kHz ↔ MHz ↔ GHz"),
      live("unit-rpm-hz-converter", "RPM ↔ Hz"),
    ],
  },
  {
    slug: "unit-pressure",
    title: "Pressure converters",
    description: "Pascal, bar, PSI, atm, and medical pressure units.",
    calculators: [
      live("unit-pascal-bar-converter", "Pascal ↔ Bar"),
      live("unit-psi-bar-converter", "PSI ↔ Bar"),
      live("unit-atm-pascal-converter", "atm ↔ Pascal"),
      live("unit-mmhg-torr-converter", "mmHg ↔ Torr"),
    ],
  },
  {
    slug: "unit-angle",
    title: "Angle converters",
    description: "Degrees, radians, gradians, and arcminutes.",
    calculators: [
      live("unit-degree-radian-converter", "Degree ↔ Radian"),
      live("unit-degree-gradian-converter", "Degree ↔ Gradian"),
      live("unit-arcminute-degree-converter", "Arcminute ↔ Degree"),
    ],
  },
  {
    slug: "unit-digital-storage",
    title: "Digital storage converters",
    description: "Decimal and binary prefixes for bytes, bits, and storage tiers.",
    calculators: [
      live("unit-kb-mb-gb-tb-converter", "KB ↔ MB ↔ GB ↔ TB"),
      live("unit-byte-bit-converter", "Byte ↔ Bit"),
      live("unit-mb-mib-converter", "MB ↔ MiB"),
    ],
  },
  {
    slug: "unit-data-transfer-rate",
    title: "Data transfer rate converters",
    description: "Mbps, MBps, and related networking throughput units.",
    calculators: [
      live("unit-megabit-per-second-megabyte-per-second", "Mbps ↔ MBps"),
      live("unit-kbps-mbps-converter", "Kbps ↔ Mbps"),
      live("unit-gbps-mbps-converter", "Gbps ↔ Mbps"),
    ],
  },
  {
    slug: "unit-fuel-economy",
    title: "Fuel economy converters",
    description: "km/l, mpg US, and mpg UK for vehicles.",
    calculators: [
      live("unit-km-per-liter-mpg-converter", "km/l ↔ mpg"),
      live("unit-mpg-us-mpg-uk-converter", "mpg (US) ↔ mpg (UK)"),
    ],
  },
  {
    slug: "unit-density",
    title: "Density converters",
    description: "Mass per volume for materials and lab work.",
    calculators: [live("unit-kg-per-m3-g-per-cm3-converter", "kg/m³ ↔ g/cm³")],
  },
  {
    slug: "unit-force",
    title: "Force converters",
    description: "Newtons and common force equivalents.",
    calculators: [
      live("unit-newton-kgf-converter", "Newton ↔ kgf"),
      live("unit-newton-pound-force-converter", "Newton ↔ Pound-force"),
    ],
  },
  {
    slug: "unit-concentration",
    title: "Concentration converters",
    description: "Molarity and mass-per-volume for chemistry and water quality.",
    calculators: [
      live("unit-molarity-converter", "Molarity"),
      live("unit-mg-per-liter-ppm-converter", "mg/L ↔ ppm"),
    ],
  },
  {
    slug: "unit-construction",
    title: "Construction unit converters",
    description: "Cement, sand, and brick-related unit helpers for sites.",
    calculators: [
      live("unit-cement-bag-kilogram-converter", "Cement Bag ↔ kg"),
      live("unit-sand-volume-converter", "Sand Volume Converter"),
      live("unit-brick-calculator-units", "Brick Calculator Units"),
    ],
  },
  {
    slug: "unit-textile-fabric",
    title: "Textile and fabric unit converters",
    description: "Fabric weight and yarn count conversions for textiles.",
    calculators: [
      live("unit-gsm-oz-per-yd2-converter", "GSM ↔ oz/yd²"),
      live("unit-yarn-count-converter", "Yarn Count Converter"),
    ],
  },
];
