"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { HOME_URL } from "@/lib/calculators/homeHelpers";
import {
  computeHomeWater,
  type HomeWaterInput,
  type HomeWaterResult,
  type HomeWaterSlug,
} from "@/lib/calculators/homeWater";
import { parsePositive } from "@/lib/calculators/loanInputParse";

type Mode = "consumption" | "bill" | "harvest" | "tankRect" | "tankCyl" | "borewell" | "flow" | "pressure" | "leak";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  nDefault: string;
  pDefault: string;
  dDefault: string;
  rDefault: string;
  lDefault: string;
  wDefault: string;
  hDefault: string;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  tDefault: string;
  qDefault: string;
};

const DISCLAIMER =
  "Daily-life planning estimate only — tariffs, taxes, and local rules vary. Verify current rates before budgeting.";

const CONFIG: Record<HomeWaterSlug, Config> = {
  "home-water-consumption-household-calculator": {
    title: "Household water consumption",
    description: `Liters from people × L/person/day. ${DISCLAIMER}`,
    mode: "consumption", nDefault: "4", pDefault: "135", dDefault: "30", rDefault: "",
    lDefault: "", wDefault: "", hDefault: "", aDefault: "", bDefault: "", cDefault: "", tDefault: "", qDefault: "",
  },
  "home-daily-water-usage-calculator": {
    title: "Daily water usage",
    description: `Daily liters per household. ${DISCLAIMER}`,
    mode: "consumption", nDefault: "3", pDefault: "135", dDefault: "1", rDefault: "",
    lDefault: "", wDefault: "", hDefault: "", aDefault: "", bDefault: "", cDefault: "", tDefault: "", qDefault: "",
  },
  "home-monthly-water-bill-calculator": {
    title: "Monthly water bill",
    description: `Bill from monthly liters or people × usage. ${DISCLAIMER}`,
    mode: "bill", nDefault: "4", pDefault: "135", dDefault: "", rDefault: "20",
    lDefault: "", wDefault: "", hDefault: "", aDefault: "", bDefault: "", cDefault: "", tDefault: "", qDefault: "",
  },
  "home-rainwater-harvesting-calculator": {
    title: "Rainwater harvesting",
    description: `Harvest from roof area × rainfall. ${DISCLAIMER}`,
    mode: "harvest", nDefault: "", pDefault: "", dDefault: "", rDefault: "",
    lDefault: "", wDefault: "", hDefault: "", aDefault: "100", bDefault: "800", cDefault: "0.8", tDefault: "", qDefault: "",
  },
  "home-water-tank-capacity-calculator": {
    title: "Water tank capacity",
    description: `Rectangular or cylindrical tank volume. ${DISCLAIMER}`,
    mode: "tankRect", nDefault: "", pDefault: "", dDefault: "", rDefault: "",
    lDefault: "2", wDefault: "1.5", hDefault: "2", aDefault: "rect", bDefault: "", cDefault: "", tDefault: "", qDefault: "",
  },
  "home-borewell-depth-estimator": {
    title: "Borewell depth",
    description: `Educational depth placeholder. ${DISCLAIMER}`,
    mode: "borewell", nDefault: "", pDefault: "", dDefault: "", rDefault: "",
    lDefault: "", wDefault: "", hDefault: "60", aDefault: "", bDefault: "", cDefault: "", tDefault: "", qDefault: "",
  },
  "home-pipe-flow-rate-calculator": {
    title: "Pipe flow rate",
    description: `Q = area × velocity. ${DISCLAIMER}`,
    mode: "flow", nDefault: "", pDefault: "", dDefault: "0.05", rDefault: "",
    lDefault: "", wDefault: "", hDefault: "", aDefault: "", bDefault: "", cDefault: "1", tDefault: "", qDefault: "",
  },
  "home-water-pressure-calculator": {
    title: "Water pressure",
    description: `Static pressure from head height. ${DISCLAIMER}`,
    mode: "pressure", nDefault: "", pDefault: "", dDefault: "", rDefault: "",
    lDefault: "", wDefault: "", hDefault: "15", aDefault: "", bDefault: "", cDefault: "", tDefault: "", qDefault: "",
  },
  "home-leak-loss-calculator": {
    title: "Leak loss",
    description: `Water lost from leak rate × time. ${DISCLAIMER}`,
    mode: "leak", nDefault: "", pDefault: "", dDefault: "", rDefault: "",
    lDefault: "", wDefault: "", hDefault: "", aDefault: "2", bDefault: "24", cDefault: "", tDefault: "", qDefault: "",
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

function formatResult(res: HomeWaterResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.liters !== undefined) rows.push({ label: "Liters", value: num(res.liters, 0) });
  if (res.cost !== undefined) rows.push({ label: "Cost", value: num(res.cost, 2) });
  if (res.volumeM3 !== undefined) rows.push({ label: "Volume (m³)", value: num(res.volumeM3, 3) });
  if (res.flowLps !== undefined) rows.push({ label: "Flow (L/s)", value: num(res.flowLps, 2) });
  if (res.pressureKPa !== undefined) rows.push({ label: "Pressure (kPa)", value: num(res.pressureKPa, 1) });
  if (res.depthM !== undefined) rows.push({ label: "Depth (m)", value: num(res.depthM, 1) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.cost !== undefined ? num(res.cost, 2)
    : res.liters !== undefined ? num(res.liters, 0)
    : res.flowLps !== undefined ? num(res.flowLps, 2)
    : res.pressureKPa !== undefined ? num(res.pressureKPa, 1)
    : res.volumeM3 !== undefined ? num(res.volumeM3, 3)
    : res.depthM !== undefined ? num(res.depthM, 1)
    : "—";
  const primaryLabel =
    res.cost !== undefined ? "Bill"
    : res.flowLps !== undefined ? "Flow (L/s)"
    : res.pressureKPa !== undefined ? "Pressure (kPa)"
    : res.volumeM3 !== undefined ? "Volume (m³)"
    : res.depthM !== undefined ? "Depth (m)"
    : "Liters";
  return { primary, primaryLabel, rows };
}

export function HomeWaterCalculatorHost({ slug }: { slug: string }) {
  const key = slug as HomeWaterSlug;
  const config = CONFIG[key] ?? CONFIG["home-water-consumption-household-calculator"];
  const [n, setN] = useState(useLoanInitialInput(HOME_URL.N, config.nDefault));
  const [p, setP] = useState(useLoanInitialInput(HOME_URL.P, config.pDefault));
  const [d, setD] = useState(useLoanInitialInput(HOME_URL.D, config.dDefault));
  const [r, setR] = useState(useLoanInitialInput(HOME_URL.R, config.rDefault));
  const [l, setL] = useState(useLoanInitialInput(HOME_URL.L, config.lDefault));
  const [w, setW] = useState(useLoanInitialInput(HOME_URL.W, config.wDefault));
  const [h, setH] = useState(useLoanInitialInput(HOME_URL.H, config.hDefault));
  const [a, setA] = useState(useLoanInitialInput(HOME_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(HOME_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(HOME_URL.C, config.cDefault));
  const [t, setT] = useState(useLoanInitialInput(HOME_URL.T, config.tDefault));
  const [q, setQ] = useState(useLoanInitialInput(HOME_URL.Q, config.qDefault));

  const num = (nVal: number, dec = 2) => (Number.isFinite(nVal) ? nVal.toFixed(dec) : "—");

  const shareParams = useCallback(() => {
    const out: Record<string, string> = {};
    const put = (k: string, val: string) => { if (val.trim() !== "") out[k] = val; };
    switch (config.mode) {
      case "consumption":
        put(HOME_URL.N, n); put(HOME_URL.P, p); put(HOME_URL.D, d);
        break;
      case "bill":
        put(HOME_URL.L, l); put(HOME_URL.N, n); put(HOME_URL.P, p); put(HOME_URL.R, r);
        break;
      case "harvest":
        put(HOME_URL.A, a); put(HOME_URL.B, b); put(HOME_URL.C, c);
        break;
      case "tankRect":
        put(HOME_URL.A, a); put(HOME_URL.L, l); put(HOME_URL.W, w); put(HOME_URL.H, h);
        break;
      case "tankCyl":
        put(HOME_URL.D, d); put(HOME_URL.H, h);
        break;
      case "borewell":
        put(HOME_URL.H, h);
        break;
      case "flow":
        put(HOME_URL.D, d); put(HOME_URL.C, c);
        break;
      case "pressure":
        put(HOME_URL.H, h);
        break;
      case "leak":
        put(HOME_URL.A, a); put(HOME_URL.B, b);
        break;
    }
    return out;
  }, [a, b, c, config.mode, d, h, l, n, p, q, r, t, w]);

  useLoanUrlSync(shareParams, [a, b, c, d, h, l, n, p, q, r, t, w]);

  const tankShape = a.trim().toLowerCase();
  const isCylinder = tankShape === "cylinder" || tankShape === "circular";

  const result = useMemo(() => {
    const input: HomeWaterInput = {};
    switch (config.mode) {
      case "consumption": {
        const people = parsePositive(n, "People");
        if (!people.ok) return { error: people.error };
        input.people = people.value;
        const lpp = optPos(p, "L/person/day");
        if (lpp && typeof lpp === "object") return { error: lpp.error };
        if (typeof lpp === "number") input.litersPerPerson = lpp;
        const days = optPos(d, "Days");
        if (days && typeof days === "object") return { error: days.error };
        if (typeof days === "number") input.days = days;
        break;
      }
      case "bill": {
        if (l.trim() !== "") {
          const monthlyL = parsePositive(l, "Monthly liters");
          if (!monthlyL.ok) return { error: monthlyL.error };
          input.lengthM = monthlyL.value;
        } else {
          const people = optPos(n, "People");
          if (people && typeof people === "object") return { error: people.error };
          if (typeof people === "number") input.people = people;
          const lpp = optPos(p, "L/person/day");
          if (lpp && typeof lpp === "object") return { error: lpp.error };
          if (typeof lpp === "number") input.litersPerPerson = lpp;
        }
        const rate = optPos(r, "Rate per kL");
        if (rate && typeof rate === "object") return { error: rate.error };
        if (typeof rate === "number") input.ratePerKl = rate;
        break;
      }
      case "harvest": {
        const area = parsePositive(a, "Catchment m²");
        if (!area.ok) return { error: area.error };
        input.areaM2 = area.value;
        const rain = parsePositive(b, "Rainfall mm");
        if (!rain.ok) return { error: rain.error };
        input.rainfallMm = rain.value;
        const runoff = optPos(c, "Runoff coefficient");
        if (runoff && typeof runoff === "object") return { error: runoff.error };
        if (typeof runoff === "number") input.runoff = runoff;
        break;
      }
      case "tankRect":
      case "tankCyl": {
        if (isCylinder) {
          const diam = parsePositive(d, "Diameter (m)");
          if (!diam.ok) return { error: diam.error };
          input.diameterM = diam.value;
          const ht = parsePositive(h, "Height (m)");
          if (!ht.ok) return { error: ht.error };
          input.heightM = ht.value;
        } else {
          const L = parsePositive(l, "Length (m)");
          if (!L.ok) return { error: L.error };
          input.lengthM = L.value;
          const W = parsePositive(w, "Width (m)");
          if (!W.ok) return { error: W.error };
          input.widthM = W.value;
          const H = parsePositive(h, "Height (m)");
          if (!H.ok) return { error: H.error };
          input.heightM = H.value;
        }
        break;
      }
      case "borewell": {
        const head = parsePositive(h, "Target head / depth (m)");
        if (!head.ok) return { error: head.error };
        input.headM = head.value;
        break;
      }
      case "flow": {
        const diam = parsePositive(d, "Diameter (m)");
        if (!diam.ok) return { error: diam.error };
        input.diameterM = diam.value;
        const vel = optPos(c, "Velocity (m/s)");
        if (vel && typeof vel === "object") return { error: vel.error };
        if (typeof vel === "number") input.velocityMs = vel;
        break;
      }
      case "pressure": {
        const head = parsePositive(h, "Head height (m)");
        if (!head.ok) return { error: head.error };
        input.headM = head.value;
        break;
      }
      case "leak": {
        const lpm = parsePositive(a, "Leak (L/min)");
        if (!lpm.ok) return { error: lpm.error };
        input.leakLpm = lpm.value;
        const hrs = optPos(b, "Hours");
        if (hrs && typeof hrs === "object") return { error: hrs.error };
        if (typeof hrs === "number") input.hours = hrs;
        break;
      }
    }
    return formatResult(
      computeHomeWater(key in CONFIG ? key : "home-water-consumption-household-calculator", input),
      num,
    );
  }, [a, b, c, config.mode, d, h, isCylinder, key, l, n, p, r, w]);

  const showTankRect = config.mode === "tankRect" && !isCylinder;
  const showTankCyl = config.mode === "tankRect" && isCylinder;

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "consumption" ? (
            <>
              <div><FieldLabel htmlFor="hw-n">People</FieldLabel><FieldInput id="hw-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hw-p">Liters per person/day</FieldLabel><FieldInput id="hw-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hw-d">Days</FieldLabel><FieldInput id="hw-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "bill" ? (
            <>
              <div><FieldLabel htmlFor="hw-l">Monthly liters (optional override)</FieldLabel><FieldInput id="hw-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hw-n">People</FieldLabel><FieldInput id="hw-n" value={n} onChange={(ev) => setN(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hw-p">Liters per person/day</FieldLabel><FieldInput id="hw-p" value={p} onChange={(ev) => setP(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hw-r">Rate per kL</FieldLabel><FieldInput id="hw-r" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "harvest" ? (
            <>
              <div><FieldLabel htmlFor="hw-a">Catchment area (m²)</FieldLabel><FieldInput id="hw-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hw-b">Rainfall (mm)</FieldLabel><FieldInput id="hw-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hw-c">Runoff coefficient</FieldLabel><FieldInput id="hw-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "tankRect" ? (
            <>
              <div><FieldLabel htmlFor="hw-a">Shape (rect or cylinder)</FieldLabel><FieldInput id="hw-a" value={a} onChange={(ev) => setA(ev.target.value)} /></div>
              {showTankRect ? (
                <>
                  <div><FieldLabel htmlFor="hw-l">Length (m)</FieldLabel><FieldInput id="hw-l" value={l} onChange={(ev) => setL(ev.target.value)} inputMode="decimal" /></div>
                  <div><FieldLabel htmlFor="hw-w">Width (m)</FieldLabel><FieldInput id="hw-w" value={w} onChange={(ev) => setW(ev.target.value)} inputMode="decimal" /></div>
                  <div><FieldLabel htmlFor="hw-h">Height (m)</FieldLabel><FieldInput id="hw-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
                </>
              ) : null}
              {showTankCyl ? (
                <>
                  <div><FieldLabel htmlFor="hw-d">Diameter (m)</FieldLabel><FieldInput id="hw-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
                  <div><FieldLabel htmlFor="hw-h">Height (m)</FieldLabel><FieldInput id="hw-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
                </>
              ) : null}
            </>
          ) : null}
          {config.mode === "borewell" ? (
            <div><FieldLabel htmlFor="hw-h">Target head / depth hint (m)</FieldLabel><FieldInput id="hw-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "flow" ? (
            <>
              <div><FieldLabel htmlFor="hw-d">Diameter (m)</FieldLabel><FieldInput id="hw-d" value={d} onChange={(ev) => setD(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hw-c">Velocity (m/s)</FieldLabel><FieldInput id="hw-c" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" /></div>
            </>
          ) : null}
          {config.mode === "pressure" ? (
            <div><FieldLabel htmlFor="hw-h">Head height (m)</FieldLabel><FieldInput id="hw-h" value={h} onChange={(ev) => setH(ev.target.value)} inputMode="decimal" /></div>
          ) : null}
          {config.mode === "leak" ? (
            <>
              <div><FieldLabel htmlFor="hw-a">Leak (L/min)</FieldLabel><FieldInput id="hw-a" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" /></div>
              <div><FieldLabel htmlFor="hw-b">Hours</FieldLabel><FieldInput id="hw-b" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" /></div>
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
