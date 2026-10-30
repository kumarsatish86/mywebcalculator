"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { HOME_URL } from "@/lib/calculators/homeHelpers";
import {
  computeHomeElectricity,
  type HomeElectricityInput,
  type HomeElectricityResult,
  type HomeElectricitySlug,
} from "@/lib/calculators/homeElectricity";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";

type Mode =
  | "bill"
  | "usage"
  | "costPerUnit"
  | "annual"
  | "standby"
  | "solarCost"
  | "solarSize"
  | "solarSavings"
  | "solarRoi"
  | "battery"
  | "inverter"
  | "generator";

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

const DISCLAIMER =
  "Daily-life planning estimate only — tariffs, taxes, and local rules vary. Verify current rates before budgeting.";

const CONFIG: Record<HomeElectricitySlug, Config> = {
  "home-electricity-bill-calculator": {
    title: "Electricity bill",
    description: `Monthly bill from kWh, rate, and fixed charge. ${DISCLAIMER}`,
    mode: "bill",
    aDefault: "350", bDefault: "0.12", cDefault: "", rDefault: "", tDefault: "15",
    lDefault: "", wDefault: "", hDefault: "", dDefault: "", nDefault: "", pDefault: "",
    qDefault: "", mDefault: "", vDefault: "", sDefault: "",
  },
  "home-unit-consumption-calculator": {
    title: "Unit consumption",
    description: `kWh from appliance watts and runtime. ${DISCLAIMER}`,
    mode: "usage",
    aDefault: "", bDefault: "0.12", cDefault: "1500", rDefault: "", tDefault: "",
    lDefault: "", wDefault: "", hDefault: "4", dDefault: "30", nDefault: "", pDefault: "",
    qDefault: "", mDefault: "", vDefault: "", sDefault: "",
  },
  "home-cost-per-unit-calculator": {
    title: "Cost per unit",
    description: `Effective rate from bill amount and units consumed. ${DISCLAIMER}`,
    mode: "costPerUnit",
    aDefault: "350", bDefault: "", cDefault: "", rDefault: "", tDefault: "",
    lDefault: "", wDefault: "", hDefault: "", dDefault: "", nDefault: "", pDefault: "",
    qDefault: "", mDefault: "42", vDefault: "", sDefault: "",
  },
  "home-appliance-energy-consumption-calculator": {
    title: "Appliance energy",
    description: `Energy use from rated watts and hours. ${DISCLAIMER}`,
    mode: "usage",
    aDefault: "", bDefault: "0.12", cDefault: "200", rDefault: "", tDefault: "",
    lDefault: "", wDefault: "", hDefault: "8", dDefault: "30", nDefault: "", pDefault: "",
    qDefault: "", mDefault: "", vDefault: "", sDefault: "",
  },
  "home-monthly-electricity-cost-estimator": {
    title: "Monthly electricity cost",
    description: `Estimate monthly cost from usage and tariff. ${DISCLAIMER}`,
    mode: "bill",
    aDefault: "400", bDefault: "0.11", cDefault: "", rDefault: "", tDefault: "10",
    lDefault: "", wDefault: "", hDefault: "", dDefault: "", nDefault: "", pDefault: "",
    qDefault: "", mDefault: "", vDefault: "", sDefault: "",
  },
  "home-annual-energy-cost-calculator": {
    title: "Annual energy cost",
    description: `Yearly cost from monthly kWh or monthly bill. ${DISCLAIMER}`,
    mode: "annual",
    aDefault: "350", bDefault: "0.12", cDefault: "", rDefault: "", tDefault: "",
    lDefault: "", wDefault: "", hDefault: "", dDefault: "", nDefault: "", pDefault: "",
    qDefault: "", mDefault: "", vDefault: "", sDefault: "",
  },
  "home-power-usage-kwh-calculator": {
    title: "Power usage (kWh)",
    description: `Convert watts × time to kWh. ${DISCLAIMER}`,
    mode: "usage",
    aDefault: "", bDefault: "", cDefault: "100", rDefault: "", tDefault: "",
    lDefault: "", wDefault: "", hDefault: "24", dDefault: "30", nDefault: "", pDefault: "",
    qDefault: "", mDefault: "", vDefault: "", sDefault: "",
  },
  "home-standby-power-consumption-calculator": {
    title: "Standby power",
    description: `Vampire load cost from standby watts. ${DISCLAIMER}`,
    mode: "standby",
    aDefault: "", bDefault: "0.12", cDefault: "5", rDefault: "", tDefault: "",
    lDefault: "", wDefault: "", hDefault: "", dDefault: "30", nDefault: "", pDefault: "",
    qDefault: "", mDefault: "", vDefault: "", sDefault: "",
  },
  "home-solar-panel-cost-calculator": {
    title: "Solar panel cost",
    description: `Installed system cost from kW and $/W. ${DISCLAIMER}`,
    mode: "solarCost",
    aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "",
    lDefault: "5", wDefault: "", hDefault: "", dDefault: "", nDefault: "", pDefault: "50",
    qDefault: "", mDefault: "", vDefault: "", sDefault: "",
  },
  "home-solar-savings-calculator": {
    title: "Solar savings",
    description: `Monthly savings from solar generation × tariff. ${DISCLAIMER}`,
    mode: "solarSavings",
    aDefault: "400", bDefault: "0.12", cDefault: "", rDefault: "", tDefault: "",
    lDefault: "", wDefault: "", hDefault: "", dDefault: "", nDefault: "", pDefault: "",
    qDefault: "", mDefault: "", vDefault: "", sDefault: "",
  },
  "home-solar-panel-size-calculator": {
    title: "Solar panel size",
    description: `Array kW from daily kWh and peak sun hours. ${DISCLAIMER}`,
    mode: "solarSize",
    aDefault: "20", bDefault: "", cDefault: "", rDefault: "", tDefault: "",
    lDefault: "", wDefault: "", hDefault: "", dDefault: "", nDefault: "", pDefault: "",
    qDefault: "4", mDefault: "", vDefault: "", sDefault: "",
  },
  "home-solar-roi-calculator": {
    title: "Solar ROI",
    description: `Simple payback years from cost and annual savings. ${DISCLAIMER}`,
    mode: "solarRoi",
    aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "",
    lDefault: "", wDefault: "", hDefault: "", dDefault: "", nDefault: "", pDefault: "",
    qDefault: "", mDefault: "15000", vDefault: "", sDefault: "1800",
  },
  "home-battery-backup-calculator": {
    title: "Battery backup",
    description: `Backup hours from Ah, voltage, and load. ${DISCLAIMER}`,
    mode: "battery",
    aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "0.5",
    lDefault: "500", wDefault: "", hDefault: "", dDefault: "", nDefault: "200", pDefault: "0.85",
    qDefault: "", mDefault: "", vDefault: "12", sDefault: "",
  },
  "home-inverter-load-calculator": {
    title: "Inverter load",
    description: `Inverter/VA sizing from load watts and power factor. ${DISCLAIMER}`,
    mode: "inverter",
    aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "",
    lDefault: "800", wDefault: "", hDefault: "", dDefault: "", nDefault: "", pDefault: "0.8",
    qDefault: "", mDefault: "", vDefault: "", sDefault: "",
  },
  "home-battery-backup-time-calculator": {
    title: "Battery backup time",
    description: `Runtime hours from battery specs and load. ${DISCLAIMER}`,
    mode: "battery",
    aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "0.5",
    lDefault: "600", wDefault: "", hDefault: "", dDefault: "", nDefault: "150", pDefault: "0.85",
    qDefault: "", mDefault: "", vDefault: "12", sDefault: "",
  },
  "home-ups-calculator": {
    title: "UPS sizing",
    description: `UPS VA rating from load and power factor. ${DISCLAIMER}`,
    mode: "inverter",
    aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "",
    lDefault: "400", wDefault: "", hDefault: "", dDefault: "", nDefault: "", pDefault: "0.8",
    qDefault: "", mDefault: "", vDefault: "", sDefault: "",
  },
  "home-generator-fuel-consumption-calculator": {
    title: "Generator fuel",
    description: `Fuel use and cost from L/h and run hours. ${DISCLAIMER}`,
    mode: "generator",
    aDefault: "", bDefault: "", cDefault: "", rDefault: "", tDefault: "",
    lDefault: "2.5", wDefault: "", hDefault: "4", dDefault: "", nDefault: "", pDefault: "1.2",
    qDefault: "", mDefault: "", vDefault: "", sDefault: "",
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

function optPos(raw: string, label: string): number | undefined | { error: string } {
  if (raw.trim() === "") return undefined;
  const p = parsePositive(raw, label);
  if (!p.ok) return { error: p.error };
  return p.value;
}

function optNonNeg(raw: string, label: string): number | undefined | { error: string } {
  if (raw.trim() === "") return undefined;
  const p = parseNonNegative(raw, label);
  if (!p.ok) return { error: p.error };
  return p.value;
}

function formatResult(res: HomeElectricityResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.kwh !== undefined) rows.push({ label: "kWh", value: num(res.kwh, 2) });
  if (res.cost !== undefined) rows.push({ label: "Cost", value: num(res.cost, 2) });
  if (res.rate !== undefined) rows.push({ label: "Rate/unit", value: num(res.rate, 4) });
  if (res.kw !== undefined) rows.push({ label: "kW / kVA", value: num(res.kw, 2) });
  if (res.hours !== undefined) rows.push({ label: "Hours", value: num(res.hours, 2) });
  if (res.years !== undefined) rows.push({ label: "Payback (years)", value: num(res.years, 1) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.cost !== undefined ? num(res.cost, 2)
    : res.kwh !== undefined ? num(res.kwh, 2)
    : res.rate !== undefined ? num(res.rate, 4)
    : res.kw !== undefined ? num(res.kw, 2)
    : res.hours !== undefined ? num(res.hours, 2)
    : res.years !== undefined ? num(res.years, 1)
    : "—";
  const primaryLabel =
    res.cost !== undefined ? "Cost"
    : res.rate !== undefined ? "Effective rate"
    : res.kw !== undefined ? "Size (kW)"
    : res.hours !== undefined ? "Backup hours"
    : res.years !== undefined ? "Payback"
    : "kWh";
  return { primary, primaryLabel, rows };
}

export function HomeElectricityCalculatorHost({ slug }: { slug: string }) {
  const key = slug as HomeElectricitySlug;
  const config = CONFIG[key] ?? CONFIG["home-electricity-bill-calculator"];
  const [a, setA] = useState(useLoanInitialInput(HOME_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(HOME_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(HOME_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(HOME_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(HOME_URL.T, config.tDefault));
  const [l, setL] = useState(useLoanInitialInput(HOME_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(HOME_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(HOME_URL.H, config.hDefault));
  const [d, setD] = useState(useLoanInitialInput(HOME_URL.D, config.dDefault));
  const [n, setN] = useState(useLoanInitialInput(HOME_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(HOME_URL.P, config.pDefault));
  const [q, setQ] = useState(useLoanInitialInput(HOME_URL.Q, config.qDefault));
  const [m, setM] = useState(useLoanInitialInput(HOME_URL.M, config.mDefault));
  const [v, setV] = useState(useLoanInitialInput(HOME_URL.V, config.vDefault));
  const [s, setS] = useState(useLoanInitialInput(HOME_URL.S, config.sDefault));

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
      case "bill":
        put(HOME_URL.A, a); put(HOME_URL.B, b); put(HOME_URL.T, t);
        break;
      case "usage":
        put(HOME_URL.C, c); put(HOME_URL.H, h); put(HOME_URL.D, d); put(HOME_URL.B, b);
        break;
      case "costPerUnit":
        put(HOME_URL.A, a); put(HOME_URL.M, m);
        break;
      case "annual":
        put(HOME_URL.A, a); put(HOME_URL.B, b); put(HOME_URL.M, m);
        break;
      case "standby":
        put(HOME_URL.C, c); put(HOME_URL.D, d); put(HOME_URL.B, b);
        break;
      case "solarCost":
        put(HOME_URL.L, l); put(HOME_URL.P, p);
        break;
      case "solarSize":
        put(HOME_URL.A, a); put(HOME_URL.Q, q);
        break;
      case "solarSavings":
        put(HOME_URL.A, a); put(HOME_URL.B, b);
        break;
      case "solarRoi":
        put(HOME_URL.M, m); put(HOME_URL.S, s);
        break;
      case "battery":
        put(HOME_URL.N, n); put(HOME_URL.V, v); put(HOME_URL.L, l); put(HOME_URL.T, t); put(HOME_URL.P, p);
        break;
      case "inverter":
        put(HOME_URL.L, l); put(HOME_URL.P, p);
        break;
      case "generator":
        put(HOME_URL.L, l); put(HOME_URL.H, h); put(HOME_URL.P, p);
        break;
    }
    return out;
  }, [a, b, c, config.mode, d, h, l, m, n, p, q, s, t, v]);

  useLoanUrlSync(shareParams, [a, b, c, d, h, l, m, n, p, q, r, s, t, v, w]);

  const result = useMemo(() => {
    const input: HomeElectricityInput = {};
    switch (config.mode) {
      case "bill": {
        const kwh = parsePositive(a, "kWh");
        if (!kwh.ok) return { error: kwh.error };
        input.kwh = kwh.value;
        const rate = parsePositive(b, "Rate/kWh");
        if (!rate.ok) return { error: rate.error };
        input.ratePerKwh = rate.value;
        const fixed = optNonNeg(t, "Fixed charge");
        if (fixed && typeof fixed === "object") return { error: fixed.error };
        if (typeof fixed === "number") input.fixedCharge = fixed;
        break;
      }
      case "usage": {
        const watts = parsePositive(c, "Watts");
        if (!watts.ok) return { error: watts.error };
        input.watts = watts.value;
        const hrs = optPos(h, "Hours/day");
        if (hrs && typeof hrs === "object") return { error: hrs.error };
        if (typeof hrs === "number") input.hoursPerDay = hrs;
        const days = optPos(d, "Days");
        if (days && typeof days === "object") return { error: days.error };
        if (typeof days === "number") input.days = days;
        const rate = optPos(b, "Rate/kWh");
        if (rate && typeof rate === "object") return { error: rate.error };
        if (typeof rate === "number") input.ratePerKwh = rate;
        break;
      }
      case "costPerUnit": {
        const bill = parsePositive(m, "Bill amount");
        if (!bill.ok) return { error: bill.error };
        input.systemCost = bill.value;
        const units = parsePositive(a, "Units consumed");
        if (!units.ok) return { error: units.error };
        input.kwh = units.value;
        break;
      }
      case "annual": {
        if (m.trim() !== "") {
          const monthly = parsePositive(m, "Monthly cost");
          if (!monthly.ok) return { error: monthly.error };
          input.systemCost = monthly.value;
        } else {
          const kwh = parsePositive(a, "Monthly kWh");
          if (!kwh.ok) return { error: kwh.error };
          input.kwh = kwh.value;
          const rate = parsePositive(b, "Rate/kWh");
          if (!rate.ok) return { error: rate.error };
          input.ratePerKwh = rate.value;
        }
        break;
      }
      case "standby": {
        const sw = parsePositive(c, "Standby watts");
        if (!sw.ok) return { error: sw.error };
        input.standbyWatts = sw.value;
        const days = optPos(d, "Days");
        if (days && typeof days === "object") return { error: days.error };
        if (typeof days === "number") input.days = days;
        const rate = optPos(b, "Rate/kWh");
        if (rate && typeof rate === "object") return { error: rate.error };
        if (typeof rate === "number") input.ratePerKwh = rate;
        break;
      }
      case "solarCost": {
        const kw = parsePositive(l, "System kW");
        if (!kw.ok) return { error: kw.error };
        input.panelKw = kw.value;
        const cpw = optPos(p, "Cost per watt");
        if (cpw && typeof cpw === "object") return { error: cpw.error };
        if (typeof cpw === "number") input.costPerWatt = cpw;
        break;
      }
      case "solarSize": {
        const kwh = parsePositive(a, "Daily kWh");
        if (!kwh.ok) return { error: kwh.error };
        input.kwh = kwh.value;
        const sun = optPos(q, "Peak sun hours");
        if (sun && typeof sun === "object") return { error: sun.error };
        if (typeof sun === "number") input.sunHours = sun;
        break;
      }
      case "solarSavings": {
        const kwh = parsePositive(a, "Monthly solar kWh");
        if (!kwh.ok) return { error: kwh.error };
        input.kwh = kwh.value;
        const rate = parsePositive(b, "Tariff");
        if (!rate.ok) return { error: rate.error };
        input.ratePerKwh = rate.value;
        break;
      }
      case "solarRoi": {
        const cost = parsePositive(m, "System cost");
        if (!cost.ok) return { error: cost.error };
        input.systemCost = cost.value;
        const save = parsePositive(s, "Annual savings");
        if (!save.ok) return { error: save.error };
        input.annualSavings = save.value;
        break;
      }
      case "battery": {
        const ah = parsePositive(n, "Battery Ah");
        if (!ah.ok) return { error: ah.error };
        input.ah = ah.value;
        const volt = optPos(v, "Voltage");
        if (volt && typeof volt === "object") return { error: volt.error };
        if (typeof volt === "number") input.voltage = volt;
        const load = parsePositive(l, "Load watts");
        if (!load.ok) return { error: load.error };
        input.loadWatts = load.value;
        const dod = optPos(t, "Depth of discharge");
        if (dod && typeof dod === "object") return { error: dod.error };
        if (typeof dod === "number") input.dod = dod;
        const eff = optPos(p, "Efficiency");
        if (eff && typeof eff === "object") return { error: eff.error };
        if (typeof eff === "number") input.efficiency = eff;
        break;
      }
      case "inverter": {
        const load = parsePositive(l, "Load watts");
        if (!load.ok) return { error: load.error };
        input.loadWatts = load.value;
        const eff = optPos(p, "Power factor");
        if (eff && typeof eff === "object") return { error: eff.error };
        if (typeof eff === "number") input.efficiency = eff;
        break;
      }
      case "generator": {
        const lph = parsePositive(l, "Fuel L/h");
        if (!lph.ok) return { error: lph.error };
        input.fuelLPerHour = lph.value;
        const hrs = optPos(h, "Run hours");
        if (hrs && typeof hrs === "object") return { error: hrs.error };
        if (typeof hrs === "number") input.runHours = hrs;
        const price = optNonNeg(p, "Fuel price/L");
        if (price && typeof price === "object") return { error: price.error };
        if (typeof price === "number") input.fuelPrice = price;
        break;
      }
    }
    return formatResult(
      computeHomeElectricity(key in CONFIG ? key : "home-electricity-bill-calculator", input),
      num,
    );
  }, [a, b, c, config.mode, d, h, key, l, m, n, p, q, s, t, v]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "bill" ? (
            <>
              <div><FieldLabel htmlFor="he-a">kWh (units)</FieldLabel><FieldInput id="he-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-b">Rate per kWh</FieldLabel><FieldInput id="he-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-t">Fixed charge (optional)</FieldLabel><FieldInput id="he-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "usage" ? (
            <>
              <div><FieldLabel htmlFor="he-c">Watts</FieldLabel><FieldInput id="he-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-h">Hours per day</FieldLabel><FieldInput id="he-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-d">Days</FieldLabel><FieldInput id="he-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-b">Rate per kWh (optional)</FieldLabel><FieldInput id="he-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "costPerUnit" ? (
            <>
              <div><FieldLabel htmlFor="he-m">Bill amount</FieldLabel><FieldInput id="he-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-a">Units consumed (kWh)</FieldLabel><FieldInput id="he-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "annual" ? (
            <>
              <div><FieldLabel htmlFor="he-a">Monthly kWh</FieldLabel><FieldInput id="he-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-b">Rate per kWh</FieldLabel><FieldInput id="he-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-m">Or monthly cost (override)</FieldLabel><FieldInput id="he-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "standby" ? (
            <>
              <div><FieldLabel htmlFor="he-c">Standby watts</FieldLabel><FieldInput id="he-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-d">Days</FieldLabel><FieldInput id="he-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-b">Rate per kWh (optional)</FieldLabel><FieldInput id="he-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "solarCost" ? (
            <>
              <div><FieldLabel htmlFor="he-l">System kW</FieldLabel><FieldInput id="he-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-p">Cost per watt</FieldLabel><FieldInput id="he-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "solarSize" ? (
            <>
              <div><FieldLabel htmlFor="he-a">Daily kWh need</FieldLabel><FieldInput id="he-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-q">Peak sun hours</FieldLabel><FieldInput id="he-q" value={q} onChange={(ev) => setQ(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "solarSavings" ? (
            <>
              <div><FieldLabel htmlFor="he-a">Monthly solar kWh</FieldLabel><FieldInput id="he-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-b">Tariff</FieldLabel><FieldInput id="he-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "solarRoi" ? (
            <>
              <div><FieldLabel htmlFor="he-m">System cost</FieldLabel><FieldInput id="he-m" value={m} onChange={(ev) => setM(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-s">Annual savings</FieldLabel><FieldInput id="he-s" value={s} onChange={(ev) => setS(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "battery" ? (
            <>
              <div><FieldLabel htmlFor="he-n">Battery Ah</FieldLabel><FieldInput id="he-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-v">Voltage</FieldLabel><FieldInput id="he-v" value={v} onChange={(ev) => setV(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-l">Load watts</FieldLabel><FieldInput id="he-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-t">Depth of discharge (0–1)</FieldLabel><FieldInput id="he-t" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-p">Efficiency (optional)</FieldLabel><FieldInput id="he-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "inverter" ? (
            <>
              <div><FieldLabel htmlFor="he-l">Load watts</FieldLabel><FieldInput id="he-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-p">Power factor (optional)</FieldLabel><FieldInput id="he-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "generator" ? (
            <>
              <div><FieldLabel htmlFor="he-l">Fuel L/h</FieldLabel><FieldInput id="he-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-h">Run hours</FieldLabel><FieldInput id="he-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="he-p">Fuel price/L (optional)</FieldLabel><FieldInput id="he-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
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
