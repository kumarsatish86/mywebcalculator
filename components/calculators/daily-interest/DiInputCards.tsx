"use client";

import { FieldInput, FieldLabel } from "@/components/fields";
import {
  LOAN_PRESETS,
  type DiMode,
  type LoanPresetId,
} from "@/lib/calculators/dailyInterestDecision";

const PRESET_IDS = Object.keys(LOAN_PRESETS) as LoanPresetId[];

type Props = {
  mode: DiMode;
  presetId: LoanPresetId;
  onPreset: (id: LoanPresetId) => void;
  principal: string;
  setPrincipal: (v: string) => void;
  apr: string;
  setApr: (v: string) => void;
  days: string;
  setDays: (v: string) => void;
  delayDays: string;
  setDelayDays: (v: string) => void;
  penaltyFlat: string;
  setPenaltyFlat: (v: string) => void;
  prepayAmount: string;
  setPrepayAmount: (v: string) => void;
  extraMonthly: string;
  setExtraMonthly: (v: string) => void;
  inflation: string;
  setInflation: (v: string) => void;
  remainingMonths: string;
  setRemainingMonths: (v: string) => void;
};

export function DiInputCards(p: Props) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Balance</p>
        <div className="mt-3">
          <FieldLabel htmlFor="di-p">Outstanding / principal</FieldLabel>
          <FieldInput
            id="di-p"
            value={p.principal}
            onChange={(e) => p.setPrincipal(e.target.value)}
            inputMode="decimal"
          />
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Rate</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PRESET_IDS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => p.onPreset(id)}
              className={`rounded-lg border px-2 py-1 text-[10px] ${
                p.presetId === id
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent-bright)]"
                  : "border-[var(--border)] text-[var(--text)]"
              }`}
            >
              {LOAN_PRESETS[id].label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[10px] text-[var(--muted)]">
          Presets set illustrative APRs — override anytime. Not live bank quotes.
        </p>
        <div className="mt-3">
          <FieldLabel htmlFor="di-a">APR %</FieldLabel>
          <FieldInput id="di-a" value={p.apr} onChange={(e) => p.setApr(e.target.value)} inputMode="decimal" />
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Horizon</p>
        <div className="mt-3">
          <FieldLabel htmlFor="di-u">Days</FieldLabel>
          <FieldInput id="di-u" value={p.days} onChange={(e) => p.setDays(e.target.value)} inputMode="numeric" />
        </div>
      </div>

      {p.mode === "planner" || p.mode === "prepay" ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Planner</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="di-pp">Prepay lump</FieldLabel>
              <FieldInput
                id="di-pp"
                value={p.prepayAmount}
                onChange={(e) => p.setPrepayAmount(e.target.value)}
                inputMode="decimal"
              />
            </div>
            <div>
              <FieldLabel htmlFor="di-ex">Extra monthly</FieldLabel>
              <FieldInput
                id="di-ex"
                value={p.extraMonthly}
                onChange={(e) => p.setExtraMonthly(e.target.value)}
                inputMode="decimal"
              />
            </div>
            <div>
              <FieldLabel htmlFor="di-rm">Remaining months</FieldLabel>
              <FieldInput
                id="di-rm"
                value={p.remainingMonths}
                onChange={(e) => p.setRemainingMonths(e.target.value)}
                inputMode="numeric"
              />
            </div>
            {p.mode === "planner" ? (
              <div>
                <FieldLabel htmlFor="di-inf">Inflation %</FieldLabel>
                <FieldInput
                  id="di-inf"
                  value={p.inflation}
                  onChange={(e) => p.setInflation(e.target.value)}
                  inputMode="decimal"
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {p.mode === "delay" || p.mode === "penalty" ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)]/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
            {p.mode === "delay" ? "Delay" : "Penalty"}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="di-dd">Delay days</FieldLabel>
              <FieldInput
                id="di-dd"
                value={p.delayDays}
                onChange={(e) => p.setDelayDays(e.target.value)}
                inputMode="numeric"
              />
            </div>
            <div>
              <FieldLabel htmlFor="di-pen">Late / penalty flat</FieldLabel>
              <FieldInput
                id="di-pen"
                value={p.penaltyFlat}
                onChange={(e) => p.setPenaltyFlat(e.target.value)}
                inputMode="decimal"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
