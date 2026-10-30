"use client";

import { FieldInput, FieldLabel } from "@/components/fields";
import {
  BUILDING_PRESETS,
  type BuildingPresetId,
  type LpsClass,
} from "@/lib/calculators/engineering/lightningProtection";

const PRESET_IDS = Object.keys(BUILDING_PRESETS) as BuildingPresetId[];
const CLASSES: LpsClass[] = ["I", "II", "III", "IV"];

type Props = {
  mode: "quick" | "expert";
  buildingId: BuildingPresetId;
  onPreset: (id: BuildingPresetId) => void;
  height: string;
  setHeight: (v: string) => void;
  length: string;
  setLength: (v: string) => void;
  width: string;
  setWidth: (v: string) => void;
  rho: string;
  setRho: (v: string) => void;
  rod: string;
  setRod: (v: string) => void;
  lpsClass: LpsClass;
  setLpsClass: (v: LpsClass) => void;
  angle: string;
  setAngle: (v: string) => void;
  air: string;
  setAir: (v: string) => void;
  sphere: string;
  setSphere: (v: string) => void;
};

export function LpsInputCards(p: Props) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Building</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PRESET_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => p.onPreset(id)}
              className={`rounded-lg border px-2.5 py-1 text-[11px] ${
                p.buildingId === id
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent-bright)]"
                  : "border-[var(--border)] text-[var(--text)]"
              }`}
            >
              {BUILDING_PRESETS[id].label}
            </button>
          ))}
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor="lps-h">Height</FieldLabel>
            <FieldInput id="lps-h" value={p.height} onChange={(e) => p.setHeight(e.target.value)} placeholder="18m" />
            <p className="mt-0.5 text-[10px] text-[var(--muted)]">m · cm · ft · in</p>
          </div>
          <div>
            <FieldLabel htmlFor="lps-l">Length</FieldLabel>
            <FieldInput id="lps-l" value={p.length} onChange={(e) => p.setLength(e.target.value)} />
          </div>
          <div>
            <FieldLabel htmlFor="lps-w">Width</FieldLabel>
            <FieldInput id="lps-w" value={p.width} onChange={(e) => p.setWidth(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Grounding</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="lps-rho">Soil resistivity</FieldLabel>
            <FieldInput id="lps-rho" value={p.rho} onChange={(e) => p.setRho(e.target.value)} placeholder="100 ohm-m" />
          </div>
          <div>
            <FieldLabel htmlFor="lps-rod">Rod length</FieldLabel>
            <FieldInput id="lps-rod" value={p.rod} onChange={(e) => p.setRod(e.target.value)} placeholder="3m" />
          </div>
        </div>
      </div>

      {p.mode === "expert" ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Expert parameters</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="lps-cls">LPS class</FieldLabel>
              <select
                id="lps-cls"
                value={p.lpsClass}
                onChange={(e) => p.setLpsClass(e.target.value as LpsClass)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
              >
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="lps-ang">Protective angle (°)</FieldLabel>
              <FieldInput id="lps-ang" value={p.angle} onChange={(e) => p.setAngle(e.target.value)} placeholder="auto" />
            </div>
            <div>
              <FieldLabel htmlFor="lps-at">Air terminators</FieldLabel>
              <FieldInput id="lps-at" value={p.air} onChange={(e) => p.setAir(e.target.value)} />
            </div>
            <div>
              <FieldLabel htmlFor="lps-sph">Rolling-sphere R</FieldLabel>
              <FieldInput id="lps-sph" value={p.sphere} onChange={(e) => p.setSphere(e.target.value)} placeholder="auto" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
