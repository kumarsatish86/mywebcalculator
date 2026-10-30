"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { TRAVEL_URL } from "@/lib/calculators/travelHelpers";
import {
  computeTravelMisc,
  type TravelMiscInput,
  type TravelMiscResult,
  type TravelMiscSlug,
} from "@/lib/calculators/travelMisc";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode =
  | "driveTime"
  | "tz"
  | "jetLag"
  | "avgSpeed"
  | "insurance"
  | "cover"
  | "medical"
  | "carbon"
  | "offset"
  | "trainFly"
  | "ecoHotel"
  | "split"
  | "perDiem"
  | "mileage"
  | "blended"
  | "billable"
  | "envelope"
  | "tweak"
  | "compare"
  | "ota";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  lDefault: string;
  wDefault: string;
  hDefault: string;
  dDefault: string;
  nDefault: string;
  pDefault: string;
  qDefault: string;
  mDefault: string;
  vDefault: string;
  sDefault: string;
};

const EMPTY = {
  aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "",
  lDefault: "", wDefault: "", hDefault: "", dDefault: "", nDefault: "",
  pDefault: "", qDefault: "", mDefault: "", vDefault: "", sDefault: "",
};

const DISCLAIMER =
  "Daily-life travel planning estimate only — rates, fees, and policies vary. Verify with carriers and providers.";

const CONFIG: Record<TravelMiscSlug, Config> = {
  "travel-drive-time-calculator": {
    title: "Drive time",
    description: `Time = distance ÷ speed. ${DISCLAIMER}`,
    mode: "driveTime",
    ...EMPTY, aDefault: "320", bDefault: "90",
  },
  "travel-time-zone-difference-calculator": {
    title: "Time zone difference",
    description: `UTC offset difference origin → destination. ${DISCLAIMER}`,
    mode: "tz",
    ...EMPTY, aDefault: "-5", bDefault: "1",
  },
  "travel-jet-lag-adjustment-estimator": {
    title: "Jet lag adjustment",
    description: `Rough recovery days from zones crossed. ${DISCLAIMER}`,
    mode: "jetLag",
    ...EMPTY, nDefault: "6",
  },
  "travel-average-speed-trip-calculator": {
    title: "Average speed",
    description: `Avg speed = distance ÷ hours. ${DISCLAIMER}`,
    mode: "avgSpeed",
    ...EMPTY, aDefault: "450", hDefault: "5.5",
  },
  "travel-insurance-premium-estimator": {
    title: "Insurance premium",
    description: `Premium ≈ trip cost × %. ${DISCLAIMER}`,
    mode: "insurance",
    ...EMPTY, aDefault: "2500", pDefault: "5",
  },
  "travel-cancellation-cover-value-calculator": {
    title: "Cancellation cover value",
    description: `Net cover value after premium. ${DISCLAIMER}`,
    mode: "cover",
    ...EMPTY, aDefault: "2000", bDefault: "80", pDefault: "100",
  },
  "travel-medical-cover-comparison-calculator": {
    title: "Medical cover comparison",
    description: `Compare two medical cover limits. ${DISCLAIMER}`,
    mode: "medical",
    ...EMPTY, aDefault: "100000", bDefault: "250000",
  },
  "travel-gear-cover-calculator": {
    title: "Gear cover",
    description: `Gear cover value net of premium. ${DISCLAIMER}`,
    mode: "cover",
    ...EMPTY, aDefault: "1500", bDefault: "40", pDefault: "100",
  },
  "travel-trip-carbon-footprint-estimator": {
    title: "Trip carbon footprint",
    description: `CO₂ from distance × kg/km factor. ${DISCLAIMER}`,
    mode: "carbon",
    ...EMPTY, aDefault: "1200", bDefault: "0.12",
  },
  "travel-carbon-offset-cost-calculator": {
    title: "Carbon offset cost",
    description: `Offset cost from kg CO₂ and $/ton. ${DISCLAIMER}`,
    mode: "offset",
    ...EMPTY, aDefault: "400", bDefault: "20",
  },
  "travel-train-vs-fly-emissions-calculator": {
    title: "Train vs fly emissions",
    description: `Compare kg CO₂ for train and fly. ${DISCLAIMER}`,
    mode: "trainFly",
    ...EMPTY, aDefault: "250", bDefault: "40",
  },
  "travel-eco-hotel-premium-calculator": {
    title: "Eco hotel premium",
    description: `Extra cost of eco vs standard hotel. ${DISCLAIMER}`,
    mode: "ecoHotel",
    ...EMPTY, aDefault: "140", bDefault: "165",
  },
  "travel-group-expense-split-calculator": {
    title: "Group expense split",
    description: `Split a shared expense across people. ${DISCLAIMER}`,
    mode: "split",
    ...EMPTY, aDefault: "600", nDefault: "4",
  },
  "travel-shared-accommodation-per-person-calculator": {
    title: "Shared accommodation",
    description: `Lodging cost per person. ${DISCLAIMER}`,
    mode: "split",
    ...EMPTY, aDefault: "480", nDefault: "3",
  },
  "travel-pooled-fuel-split-calculator": {
    title: "Pooled fuel split",
    description: `Fuel cost split among riders. ${DISCLAIMER}`,
    mode: "split",
    ...EMPTY, aDefault: "90", nDefault: "3",
  },
  "travel-tour-package-per-head-calculator": {
    title: "Tour package per head",
    description: `Package total ÷ travelers. ${DISCLAIMER}`,
    mode: "split",
    ...EMPTY, aDefault: "3600", nDefault: "6",
  },
  "travel-business-per-diem-calculator": {
    title: "Business per diem",
    description: `Per diem × days. ${DISCLAIMER}`,
    mode: "perDiem",
    ...EMPTY, aDefault: "75", dDefault: "5",
  },
  "travel-reimbursable-mileage-calculator": {
    title: "Reimbursable mileage",
    description: `Miles × reimbursement rate. ${DISCLAIMER}`,
    mode: "mileage",
    ...EMPTY, aDefault: "180", bDefault: "0.67",
  },
  "travel-blended-business-leisure-cost-calculator": {
    title: "Blended business/leisure",
    description: `Business share of a blended trip. ${DISCLAIMER}`,
    mode: "blended",
    ...EMPTY, aDefault: "2000", pDefault: "60",
  },
  "travel-client-billable-travel-calculator": {
    title: "Client billable travel",
    description: `Travel cost with markup for billing. ${DISCLAIMER}`,
    mode: "billable",
    ...EMPTY, aDefault: "850", pDefault: "10",
  },
  "travel-ai-itinerary-budget-envelope-calculator": {
    title: "AI itinerary budget envelope",
    description: `Planning envelope for an itinerary. ${DISCLAIMER}`,
    mode: "envelope",
    ...EMPTY, aDefault: "2800",
  },
  "travel-ai-scenario-cost-tweak-calculator": {
    title: "AI scenario cost tweak",
    description: `Adjust base budget by tweak %. ${DISCLAIMER}`,
    mode: "tweak",
    ...EMPTY, aDefault: "2000", pDefault: "10",
  },
  "travel-ai-alternative-destination-cost-calculator": {
    title: "AI alternative destination",
    description: `Compare two destination cost envelopes. ${DISCLAIMER}`,
    mode: "compare",
    ...EMPTY, aDefault: "2200", bDefault: "1900",
  },
  "travel-package-quote-comparison-calculator": {
    title: "Package quote comparison",
    description: `Lower package quote wins. ${DISCLAIMER}`,
    mode: "compare",
    ...EMPTY, aDefault: "1500", bDefault: "1420",
  },
  "travel-insurance-quote-comparison-calculator": {
    title: "Insurance quote comparison",
    description: `Compare two insurance quotes. ${DISCLAIMER}`,
    mode: "compare",
    ...EMPTY, aDefault: "95", bDefault: "110",
  },
  "travel-transport-bundle-comparison-calculator": {
    title: "Transport bundle comparison",
    description: `Compare two transport bundle prices. ${DISCLAIMER}`,
    mode: "compare",
    ...EMPTY, aDefault: "320", bDefault: "295",
  },
  "travel-ota-vs-direct-booking-calculator": {
    title: "OTA vs direct booking",
    description: `Compare OTA and direct prices. ${DISCLAIMER}`,
    mode: "ota",
    ...EMPTY, aDefault: "410", bDefault: "399",
  },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function optNonNeg(raw: string, label: string): number | undefined | { error: string } {
  if (raw.trim() === "") return undefined;
  const p = parseNonNegative(raw, label);
  if (!p.ok) return { error: p.error };
  return p.value;
}

function optPos(raw: string, label: string): number | undefined | { error: string } {
  if (raw.trim() === "") return undefined;
  const p = parsePositive(raw, label);
  if (!p.ok) return { error: p.error };
  return p.value;
}

function parseFinite(raw: string, label: string): number | { error: string } {
  const n = Number(raw);
  if (!Number.isFinite(n)) return { error: `${label} must be a number.` };
  return n;
}

function formatResult(res: TravelMiscResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.hours !== undefined) rows.push({ label: "Hours", value: num(res.hours, 2) });
  if (res.tzDiff !== undefined) rows.push({ label: "TZ diff (h)", value: num(res.tzDiff, 1) });
  if (res.jetLagDays !== undefined) rows.push({ label: "Jet lag days", value: num(res.jetLagDays, 1) });
  if (res.speed !== undefined) rows.push({ label: "Speed", value: num(res.speed, 1) });
  if (res.total !== undefined) rows.push({ label: "Total", value: num(res.total, 2) });
  if (res.value !== undefined) rows.push({ label: "Value", value: num(res.value, 2) });
  if (res.kgCo2 !== undefined) rows.push({ label: "kg CO₂", value: num(res.kgCo2, 1) });
  if (res.perPerson !== undefined) rows.push({ label: "Per person", value: num(res.perPerson, 2) });
  if (res.cheaper !== undefined) rows.push({ label: "Cheaper / better", value: res.cheaper });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.hours !== undefined ? num(res.hours, 2)
    : res.tzDiff !== undefined ? num(res.tzDiff, 1)
    : res.jetLagDays !== undefined ? num(res.jetLagDays, 1)
    : res.speed !== undefined ? num(res.speed, 1)
    : res.kgCo2 !== undefined ? num(res.kgCo2, 1)
    : res.perPerson !== undefined ? num(res.perPerson, 2)
    : res.value !== undefined ? num(res.value, 2)
    : res.total !== undefined ? num(res.total, 2)
    : res.cheaper !== undefined ? res.cheaper
    : "—";
  const primaryLabel =
    res.hours !== undefined ? "Hours"
    : res.tzDiff !== undefined ? "TZ difference"
    : res.jetLagDays !== undefined ? "Recovery days"
    : res.speed !== undefined ? "Avg speed"
    : res.kgCo2 !== undefined ? "kg CO₂"
    : res.perPerson !== undefined ? "Per person"
    : res.cheaper !== undefined && res.total === undefined ? "Winner"
    : "Total";
  return { primary, primaryLabel, rows };
}

export function TravelMiscCalculatorHost({ slug }: { slug: string }) {
  const key = slug as TravelMiscSlug;
  const config = CONFIG[key] ?? CONFIG["travel-drive-time-calculator"];
  const [a, setA] = useState(useLoanInitialInput(TRAVEL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(TRAVEL_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(TRAVEL_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(TRAVEL_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(TRAVEL_URL.T, config.tDefault));
  const [l, setL] = useState(useLoanInitialInput(TRAVEL_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(TRAVEL_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(TRAVEL_URL.H, config.hDefault));
  const [d, setD] = useState(useLoanInitialInput(TRAVEL_URL.D, config.dDefault));
  const [n, setN] = useState(useLoanInitialInput(TRAVEL_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(TRAVEL_URL.P, config.pDefault));
  const [q, setQ] = useState(useLoanInitialInput(TRAVEL_URL.Q, config.qDefault));
  const [m, setM] = useState(useLoanInitialInput(TRAVEL_URL.M, config.mDefault));
  const [v, setV] = useState(useLoanInitialInput(TRAVEL_URL.V, config.vDefault));
  const [s, setS] = useState(useLoanInitialInput(TRAVEL_URL.S, config.sDefault));

  const num = (nVal: number, dec = 2) => {
    if (!Number.isFinite(nVal)) return "—";
    const abs = Math.abs(nVal);
    if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) return nVal.toExponential(4);
    return nVal.toFixed(dec);
  };

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "driveTime":
      case "tz":
      case "medical":
      case "carbon":
      case "offset":
      case "trainFly":
      case "ecoHotel":
      case "mileage":
      case "compare":
      case "ota":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.B, b);
        break;
      case "jetLag":
        put(TRAVEL_URL.N, n);
        break;
      case "avgSpeed":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.H, h);
        break;
      case "insurance":
      case "blended":
      case "billable":
      case "tweak":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.P, p);
        break;
      case "cover":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.B, b); put(TRAVEL_URL.P, p);
        break;
      case "split":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.N, n);
        break;
      case "perDiem":
        put(TRAVEL_URL.A, a); put(TRAVEL_URL.D, d);
        break;
      case "envelope":
        put(TRAVEL_URL.A, a);
        break;
    }
    return out;
  }, [a, b, config.mode, d, h, n, p]);

  useLoanUrlSync(shareParams, [a, b, c, d, h, l, m, n, p, q, r, s, t, v, w]);

  const result = useMemo(() => {
    const input: TravelMiscInput = {};
    switch (config.mode) {
      case "driveTime": {
        const dist = parsePositive(a, "Distance");
        if (!dist.ok) return { error: dist.error };
        input.distanceKm = dist.value;
        const spd = parsePositive(b, "Speed km/h");
        if (!spd.ok) return { error: spd.error };
        input.speedKmh = spd.value;
        break;
      }
      case "tz": {
        const from = parseFinite(a, "Origin UTC offset");
        if (typeof from === "object") return { error: from.error };
        input.tzFrom = from;
        const to = parseFinite(b, "Dest UTC offset");
        if (typeof to === "object") return { error: to.error };
        input.tzTo = to;
        break;
      }
      case "jetLag": {
        const zones = parsePositive(n, "Zones crossed");
        if (!zones.ok) return { error: zones.error };
        input.zonesCrossed = zones.value;
        break;
      }
      case "avgSpeed": {
        const dist = parsePositive(a, "Distance");
        if (!dist.ok) return { error: dist.error };
        input.distanceKm = dist.value;
        const hrs = parsePositive(h, "Hours");
        if (!hrs.ok) return { error: hrs.error };
        input.hours = hrs.value;
        break;
      }
      case "insurance": {
        const trip = parsePositive(a, "Trip cost");
        if (!trip.ok) return { error: trip.error };
        input.tripCost = trip.value;
        const pct = optNonNeg(p, "Premium %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.premiumPct = pct;
        break;
      }
      case "cover": {
        const value = parsePositive(a, "Covered value");
        if (!value.ok) return { error: value.error };
        input.claimValue = value.value;
        input.gearValue = value.value;
        const prem = optNonNeg(b, "Premium");
        if (prem && typeof prem === "object") return { error: prem.error };
        if (typeof prem === "number") input.premium = prem;
        const pct = optNonNeg(p, "Cover %");
        if (pct && typeof pct === "object") return { error: pct.error };
        if (typeof pct === "number") input.coverPct = pct;
        break;
      }
      case "medical": {
        const coverA = parsePositive(a, "Cover A");
        if (!coverA.ok) return { error: coverA.error };
        input.coverA = coverA.value;
        const coverB = parsePositive(b, "Cover B");
        if (!coverB.ok) return { error: coverB.error };
        input.coverB = coverB.value;
        break;
      }
      case "carbon": {
        const dist = parsePositive(a, "Distance");
        if (!dist.ok) return { error: dist.error };
        input.distanceKm = dist.value;
        const factor = optPos(b, "kg CO₂/km");
        if (factor && typeof factor === "object") return { error: factor.error };
        if (typeof factor === "number") input.kgCo2PerKm = factor;
        break;
      }
      case "offset": {
        const kg = parsePositive(a, "kg CO₂");
        if (!kg.ok) return { error: kg.error };
        input.kgCo2PerKm = kg.value;
        const price = optPos(b, "$/ton");
        if (price && typeof price === "object") return { error: price.error };
        if (typeof price === "number") input.offsetPricePerTon = price;
        break;
      }
      case "trainFly": {
        const fly = parsePositive(a, "Fly kg CO₂");
        if (!fly.ok) return { error: fly.error };
        input.flyKg = fly.value;
        const train = parsePositive(b, "Train kg CO₂");
        if (!train.ok) return { error: train.error };
        input.trainKg = train.value;
        break;
      }
      case "ecoHotel": {
        const std = parsePositive(a, "Standard hotel");
        if (!std.ok) return { error: std.error };
        input.hotelStd = std.value;
        const eco = parsePositive(b, "Eco hotel");
        if (!eco.ok) return { error: eco.error };
        input.hotelEco = eco.value;
        break;
      }
      case "split": {
        const total = parsePositive(a, "Total");
        if (!total.ok) return { error: total.error };
        input.expense = total.value;
        input.lodging = total.value;
        input.fuel = total.value;
        input.packageTotal = total.value;
        const people = optPos(n, "People");
        if (people && typeof people === "object") return { error: people.error };
        if (typeof people === "number") input.people = people;
        break;
      }
      case "perDiem": {
        const pd = parsePositive(a, "Per diem");
        if (!pd.ok) return { error: pd.error };
        input.perDiem = pd.value;
        const days = parsePositive(d, "Days");
        if (!days.ok) return { error: days.error };
        input.days = days.value;
        break;
      }
      case "mileage": {
        const miles = parsePositive(a, "Miles");
        if (!miles.ok) return { error: miles.error };
        input.miles = miles.value;
        const rate = parsePositive(b, "Rate/mile");
        if (!rate.ok) return { error: rate.error };
        input.ratePerMile = rate.value;
        break;
      }
      case "blended": {
        const trip = parsePositive(a, "Trip cost");
        if (!trip.ok) return { error: trip.error };
        input.tripCost = trip.value;
        const biz = optNonNeg(p, "Business %");
        if (biz && typeof biz === "object") return { error: biz.error };
        if (typeof biz === "number") input.businessSharePct = biz;
        break;
      }
      case "billable": {
        const cost = parsePositive(a, "Travel cost");
        if (!cost.ok) return { error: cost.error };
        input.tripCost = cost.value;
        const markup = optNonNeg(p, "Markup %");
        if (markup && typeof markup === "object") return { error: markup.error };
        if (typeof markup === "number") input.markupPct = markup;
        break;
      }
      case "envelope": {
        const base = parsePositive(a, "Envelope");
        if (!base.ok) return { error: base.error };
        input.baseBudget = base.value;
        break;
      }
      case "tweak": {
        const base = parsePositive(a, "Base");
        if (!base.ok) return { error: base.error };
        input.baseBudget = base.value;
        if (p.trim() !== "") {
          const tweak = parseFinite(p, "Tweak %");
          if (typeof tweak === "object") return { error: tweak.error };
          input.tweakPct = tweak;
        }
        break;
      }
      case "compare": {
        const optA = parsePositive(a, "Option A");
        if (!optA.ok) return { error: optA.error };
        input.destA = optA.value;
        input.quoteA = optA.value;
        const optB = parsePositive(b, "Option B");
        if (!optB.ok) return { error: optB.error };
        input.destB = optB.value;
        input.quoteB = optB.value;
        break;
      }
      case "ota": {
        const ota = parsePositive(a, "OTA price");
        if (!ota.ok) return { error: ota.error };
        input.ota = ota.value;
        const direct = parsePositive(b, "Direct price");
        if (!direct.ok) return { error: direct.error };
        input.direct = direct.value;
        break;
      }
    }
    return formatResult(
      computeTravelMisc(key in CONFIG ? key : "travel-drive-time-calculator", input),
      num,
    );
  }, [a, b, config.mode, d, h, key, n, p]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "driveTime" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">Distance (km)</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-b">Speed (km/h)</FieldLabel><FieldInput id="tmi-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "tz" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">Origin UTC offset</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-b">Dest UTC offset</FieldLabel><FieldInput id="tmi-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "jetLag" ? (
            <div><FieldLabel htmlFor="tmi-n">Zones crossed</FieldLabel><FieldInput id="tmi-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "avgSpeed" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">Distance (km)</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-h">Hours</FieldLabel><FieldInput id="tmi-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "insurance" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">Trip cost</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-p">Premium %</FieldLabel><FieldInput id="tmi-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "cover" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">Covered value</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-b">Premium</FieldLabel><FieldInput id="tmi-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-p">Cover % (optional)</FieldLabel><FieldInput id="tmi-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "medical" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">Cover A</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-b">Cover B</FieldLabel><FieldInput id="tmi-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "carbon" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">Distance (km)</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-b">kg CO₂ per km</FieldLabel><FieldInput id="tmi-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "offset" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">kg CO₂</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-b">$/ton</FieldLabel><FieldInput id="tmi-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "trainFly" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">Fly kg CO₂</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-b">Train kg CO₂</FieldLabel><FieldInput id="tmi-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "ecoHotel" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">Standard hotel</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-b">Eco hotel</FieldLabel><FieldInput id="tmi-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "split" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">Total</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-n">People</FieldLabel><FieldInput id="tmi-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "perDiem" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">Per diem</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-d">Days</FieldLabel><FieldInput id="tmi-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "mileage" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">Miles</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-b">Rate per mile</FieldLabel><FieldInput id="tmi-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "blended" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">Trip cost</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-p">Business %</FieldLabel><FieldInput id="tmi-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "billable" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">Travel cost</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-p">Markup %</FieldLabel><FieldInput id="tmi-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "envelope" ? (
            <div><FieldLabel htmlFor="tmi-a">Budget envelope</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "tweak" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">Base budget</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-p">Tweak %</FieldLabel><FieldInput id="tmi-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "compare" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">Option A</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-b">Option B</FieldLabel><FieldInput id="tmi-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "ota" ? (
            <>
              <div><FieldLabel htmlFor="tmi-a">OTA price</FieldLabel><FieldInput id="tmi-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="tmi-b">Direct price</FieldLabel><FieldInput id="tmi-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
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
                {result.rows.map((row) => (<Row key={row.label} label={row.label} value={row.value} />))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
