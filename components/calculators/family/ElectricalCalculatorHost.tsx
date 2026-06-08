"use client";

import { useState } from "react";
import { computeElectrical } from "@/lib/calculators/engineering/electricalEngine";

type Props = { slug: string };

const inputCls =
  "mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";
const labelCls = "block text-xs font-medium uppercase tracking-wide text-[var(--muted)]";

function parseNum(s: string): number | undefined {
  const t = s.trim();
  if (!t) return undefined;
  const v = Number(t);
  return Number.isFinite(v) ? v : undefined;
}

export function ElectricalCalculatorHost({ slug }: Props) {
  const [raw, setRaw] = useState<Record<string, string>>({});
  const [out, setOut] = useState<ReturnType<typeof computeElectrical> | null>(null);

  const set = (k: string, v: string) => setRaw((p) => ({ ...p, [k]: v }));

  const run = () => {
    const f: Record<string, unknown> = { freqUnit: raw.freqUnit ?? "Hz" };
    const numKeys = [
      "V",
      "I",
      "R",
      "P",
      "Pkw",
      "hours",
      "PF",
      "kVA",
      "hp",
      "kW",
      "kWreal",
      "Vll",
      "Vln",
      "kWh",
      "tariff",
      "Sva",
      "X",
      "L",
      "C",
      "f",
      "lengthM",
      "areaMm2",
      "rhoOhmM",
      "P1",
      "P2",
      "P3",
      "Ah",
      "Vnom",
      "surgeFactor",
      "panelW",
      "numPanels",
      "kwhPerDay",
      "sunHours",
      "efficiency",
      "areaM2",
      "systemCost",
      "annualSavings",
      "Iline",
      "freqValue",
      "awg",
      "numWires",
      "wireDiaMm",
      "RperM",
      "targetR",
      "Pin",
      "Pout",
      "fSupply",
      "poles",
      "slipPct",
      "ns",
      "nr",
      "loadW",
      "marginPct",
      "litersPerKwh",
      "energyKwh",
      "Np",
      "Ns",
      "Vpri",
      "Ipri",
      "connectedKw",
      "demandKw",
      "individualSum",
      "simultaneous",
      "Ztotal",
      "rodLengthM",
      "Iload",
      "Ia",
      "Ib",
      "Ic",
      "I1",
      "I3",
      "hoursDay",
    ] as const;
    for (const k of numKeys) {
      const v = parseNum(raw[k] ?? "");
      if (v !== undefined) f[k] = v;
    }
    setOut(computeElectrical(slug, f));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <p className="text-sm leading-relaxed text-[var(--muted)]">
        Textbook-style estimates for study—not a substitute for licensed engineering, utility data sheets, or
        local electrical codes. Enter values in SI-friendly units as labeled, then press Calculate.
      </p>
      <div className="grid gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Voltage V (V)</label>
          <input className={inputCls} inputMode="decimal" value={raw.V ?? ""} onChange={(e) => set("V", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Current I (A)</label>
          <input className={inputCls} inputMode="decimal" value={raw.I ?? ""} onChange={(e) => set("I", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Resistance R (Ω)</label>
          <input className={inputCls} inputMode="decimal" value={raw.R ?? ""} onChange={(e) => set("R", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Power P (W)</label>
          <input className={inputCls} inputMode="decimal" value={raw.P ?? ""} onChange={(e) => set("P", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Power (kW)</label>
          <input className={inputCls} inputMode="decimal" value={raw.Pkw ?? ""} onChange={(e) => set("Pkw", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Time (hours)</label>
          <input className={inputCls} inputMode="decimal" value={raw.hours ?? ""} onChange={(e) => set("hours", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Power factor PF (0–1)</label>
          <input className={inputCls} inputMode="decimal" value={raw.PF ?? ""} onChange={(e) => set("PF", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Apparent S (kVA)</label>
          <input className={inputCls} inputMode="decimal" value={raw.kVA ?? ""} onChange={(e) => set("kVA", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Horsepower (hp)</label>
          <input className={inputCls} inputMode="decimal" value={raw.hp ?? ""} onChange={(e) => set("hp", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Real power (kW)</label>
          <input className={inputCls} inputMode="decimal" value={raw.kW ?? ""} onChange={(e) => set("kW", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Real power for kVA↔kW (kW)</label>
          <input className={inputCls} inputMode="decimal" value={raw.kWreal ?? ""} onChange={(e) => set("kWreal", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Line-to-line VLL (V)</label>
          <input className={inputCls} inputMode="decimal" value={raw.Vll ?? ""} onChange={(e) => set("Vll", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Line-to-neutral VLN (V)</label>
          <input className={inputCls} inputMode="decimal" value={raw.Vln ?? ""} onChange={(e) => set("Vln", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Apparent S (VA)</label>
          <input className={inputCls} inputMode="decimal" value={raw.Sva ?? ""} onChange={(e) => set("Sva", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Reactance X (Ω)</label>
          <input className={inputCls} inputMode="decimal" value={raw.X ?? ""} onChange={(e) => set("X", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Inductance L (H)</label>
          <input className={inputCls} inputMode="decimal" value={raw.L ?? ""} onChange={(e) => set("L", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Capacitance C (F)</label>
          <input className={inputCls} inputMode="decimal" value={raw.C ?? ""} onChange={(e) => set("C", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Frequency f (Hz)</label>
          <input className={inputCls} inputMode="decimal" value={raw.f ?? ""} onChange={(e) => set("f", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Energy (kWh)</label>
          <input className={inputCls} inputMode="decimal" value={raw.kWh ?? ""} onChange={(e) => set("kWh", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Tariff (per kWh)</label>
          <input className={inputCls} inputMode="decimal" value={raw.tariff ?? ""} onChange={(e) => set("tariff", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Capacity Ah</label>
          <input className={inputCls} inputMode="decimal" value={raw.Ah ?? ""} onChange={(e) => set("Ah", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Nominal V (e.g. 12)</label>
          <input className={inputCls} inputMode="decimal" value={raw.Vnom ?? ""} onChange={(e) => set("Vnom", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Freq value (converter)</label>
          <input className={inputCls} inputMode="decimal" value={raw.freqValue ?? ""} onChange={(e) => set("freqValue", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Freq unit</label>
          <select className={inputCls} value={raw.freqUnit ?? "Hz"} onChange={(e) => set("freqUnit", e.target.value)}>
            <option value="Hz">Hz</option>
            <option value="kHz">kHz</option>
            <option value="MHz">MHz</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>AWG</label>
          <input className={inputCls} inputMode="decimal" value={raw.awg ?? ""} onChange={(e) => set("awg", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Pin (W)</label>
          <input className={inputCls} inputMode="decimal" value={raw.Pin ?? ""} onChange={(e) => set("Pin", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Pout (W)</label>
          <input className={inputCls} inputMode="decimal" value={raw.Pout ?? ""} onChange={(e) => set("Pout", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Line current Iline (A)</label>
          <input className={inputCls} inputMode="decimal" value={raw.Iline ?? ""} onChange={(e) => set("Iline", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Hours / day (planner)</label>
          <input className={inputCls} inputMode="decimal" value={raw.hoursDay ?? ""} onChange={(e) => set("hoursDay", e.target.value)} />
        </div>
      </div>
      <button
        type="button"
        onClick={run}
        className="rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-bright)] px-6 py-2.5 text-sm font-semibold text-[var(--text-on-gradient)] shadow-[var(--shadow-glow)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        Calculate
      </button>
      {out ? (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-5">
          {out.error ? <p className="text-sm text-amber-700">{out.error}</p> : null}
          <ul className="mt-2 space-y-2 text-sm">
            {out.lines.map((l) => (
              <li key={l.label} className="flex flex-wrap justify-between gap-2 border-b border-[var(--border)]/60 py-2 last:border-0">
                <span className="text-[var(--muted)]">{l.label}</span>
                <span className="font-mono font-medium text-[var(--text)]">{l.value}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
