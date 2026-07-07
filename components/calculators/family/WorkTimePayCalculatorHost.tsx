"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { WorkTimeCurrencyCode } from "@/lib/calculators/workTimePay";
import {
  DEFAULT_DOUBLE_PAY_MULTIPLIER,
  DEFAULT_OT_MULTIPLIER,
  WORK_TIME_URL,
  doublePayHoliday,
  formatWorkTimeMoney,
  hourlyWageFromAnnual,
  hourlyWageFromRate,
  nightShiftAllowance,
  overtimePay,
  shiftPay,
  timesheetPay,
  workHours,
} from "@/lib/calculators/workTimePay";

type WorkTimeSlug =
  | "hourly-wage-calculator"
  | "overtime-pay-calculator"
  | "double-pay-holiday-pay-calculator"
  | "work-hours-calculator"
  | "timesheet-calculator"
  | "shift-pay-calculator"
  | "night-shift-allowance-calculator";

type WorkTimeMode =
  | "hourlyFromRate"
  | "hourlyFromAnnual"
  | "overtime"
  | "doublePay"
  | "workHours"
  | "timesheet"
  | "shiftPay"
  | "nightShift";

type Config = {
  title: string;
  description: string;
  mode: WorkTimeMode;
  amountLabel: string;
  amountDefault: string;
  showHourlyMode?: boolean;
  showHoursPerWeek?: boolean;
  showRate?: boolean;
  rateDefault?: string;
  showRegularHours?: boolean;
  showOvertimeHours?: boolean;
  showMultiplier?: boolean;
  multiplierDefault?: string;
  multiplierLabel?: string;
  showHolidayHours?: boolean;
  showDailyHours?: boolean;
  showDaysPerWeek?: boolean;
  showShiftHours?: boolean;
  showNightHours?: boolean;
  showDifferential?: boolean;
  differentialDefault?: string;
  differentialLabel?: string;
};

const CONFIG: Record<WorkTimeSlug, Config> = {
  "hourly-wage-calculator": {
    title: "Hourly wage calculator",
    description: "Convert hourly rate to weekly, monthly, and annual pay—or derive hourly rate from annual salary.",
    mode: "hourlyFromRate",
    amountLabel: "Hourly rate",
    amountDefault: "500",
    showHourlyMode: true,
    showHoursPerWeek: true,
  },
  "overtime-pay-calculator": {
    title: "Overtime pay calculator",
    description: "Calculate regular and overtime pay with a configurable overtime multiplier (e.g. 1.5×).",
    mode: "overtime",
    amountLabel: "Hourly rate",
    amountDefault: "500",
    showRate: true,
    rateDefault: "500",
    showRegularHours: true,
    showOvertimeHours: true,
    showMultiplier: true,
    multiplierDefault: String(DEFAULT_OT_MULTIPLIER),
    multiplierLabel: "Overtime multiplier",
  },
  "double-pay-holiday-pay-calculator": {
    title: "Double pay / holiday pay calculator",
    description: "Estimate holiday or premium pay when worked hours earn a multiple of the normal hourly rate.",
    mode: "doublePay",
    amountLabel: "Hourly rate",
    amountDefault: "500",
    showRate: true,
    rateDefault: "500",
    showHolidayHours: true,
    showMultiplier: true,
    multiplierDefault: String(DEFAULT_DOUBLE_PAY_MULTIPLIER),
    multiplierLabel: "Pay multiplier",
  },
  "work-hours-calculator": {
    title: "Work hours calculator",
    description: "Convert daily hours and days per week into weekly, monthly, and annual hours worked.",
    mode: "workHours",
    amountLabel: "Hours per day",
    amountDefault: "8",
    showDailyHours: true,
    showDaysPerWeek: true,
  },
  "timesheet-calculator": {
    title: "Timesheet calculator",
    description: "Total pay for a period from regular hours, overtime hours, and hourly rate.",
    mode: "timesheet",
    amountLabel: "Hourly rate",
    amountDefault: "400",
    showRate: true,
    rateDefault: "400",
    showRegularHours: true,
    showOvertimeHours: true,
    showMultiplier: true,
    multiplierDefault: String(DEFAULT_OT_MULTIPLIER),
    multiplierLabel: "Overtime multiplier",
  },
  "shift-pay-calculator": {
    title: "Shift pay calculator",
    description: "Add a shift differential percentage on top of base hourly pay for shift hours worked.",
    mode: "shiftPay",
    amountLabel: "Base hourly rate",
    amountDefault: "500",
    showRate: true,
    rateDefault: "500",
    showShiftHours: true,
    showDifferential: true,
    differentialDefault: "15",
    differentialLabel: "Shift differential %",
  },
  "night-shift-allowance-calculator": {
    title: "Night shift allowance calculator",
    description: "Estimate night shift pay with an extra allowance percentage on the base hourly rate.",
    mode: "nightShift",
    amountLabel: "Base hourly rate",
    amountDefault: "500",
    showRate: true,
    rateDefault: "500",
    showNightHours: true,
    showDifferential: true,
    differentialDefault: "20",
    differentialLabel: "Night allowance %",
  },
};

const CURRENCIES: WorkTimeCurrencyCode[] = ["INR", "USD", "EUR", "GBP"];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function WorkTimePayCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as WorkTimeSlug] ?? CONFIG["hourly-wage-calculator"];
  const [currency, setCurrency] = useState<WorkTimeCurrencyCode>("INR");
  const [amount, setAmount] = useState(useLoanInitialInput(WORK_TIME_URL.A, config.amountDefault));
  const [hoursPerWeek, setHoursPerWeek] = useState(useLoanInitialInput(WORK_TIME_URL.H, "40"));
  const [weeksPerYear, setWeeksPerYear] = useState(useLoanInitialInput(WORK_TIME_URL.X, "52"));
  const [hourlyMode, setHourlyMode] = useState<"rate" | "annual">(
    useLoanInitialInput(WORK_TIME_URL.MD, "rate") === "annual" ? "annual" : "rate",
  );
  const [rate, setRate] = useState(useLoanInitialInput(WORK_TIME_URL.R, config.rateDefault ?? "500"));
  const [regularHours, setRegularHours] = useState(useLoanInitialInput(WORK_TIME_URL.A, "40"));
  const [overtimeHours, setOvertimeHours] = useState(useLoanInitialInput(WORK_TIME_URL.B, "10"));
  const [multiplier, setMultiplier] = useState(
    useLoanInitialInput(WORK_TIME_URL.M, config.multiplierDefault ?? String(DEFAULT_OT_MULTIPLIER)),
  );
  const [holidayHours, setHolidayHours] = useState(useLoanInitialInput(WORK_TIME_URL.H, "8"));
  const [dailyHours, setDailyHours] = useState(useLoanInitialInput(WORK_TIME_URL.A, "8"));
  const [daysPerWeek, setDaysPerWeek] = useState(useLoanInitialInput(WORK_TIME_URL.D, "5"));
  const [shiftHours, setShiftHours] = useState(useLoanInitialInput(WORK_TIME_URL.H, "8"));
  const [nightHours, setNightHours] = useState(useLoanInitialInput(WORK_TIME_URL.H, "8"));
  const [differential, setDifferential] = useState(
    useLoanInitialInput(WORK_TIME_URL.P, config.differentialDefault ?? "15"),
  );

  const fmt = useCallback((n: number) => formatWorkTimeMoney(n, currency), [currency]);

  const shareParams = useCallback(() => {
    const base: Record<string, string> = {
      [WORK_TIME_URL.R]: rate,
      [WORK_TIME_URL.M]: multiplier,
      [WORK_TIME_URL.P]: differential,
      [WORK_TIME_URL.X]: weeksPerYear,
    };
    switch (config.mode) {
      case "hourlyFromRate":
      case "hourlyFromAnnual":
        return {
          ...base,
          [WORK_TIME_URL.A]: amount,
          [WORK_TIME_URL.H]: hoursPerWeek,
          [WORK_TIME_URL.MD]: hourlyMode,
        };
      case "overtime":
      case "timesheet":
        return {
          ...base,
          [WORK_TIME_URL.R]: rate,
          [WORK_TIME_URL.A]: regularHours,
          [WORK_TIME_URL.B]: overtimeHours,
          [WORK_TIME_URL.M]: multiplier,
        };
      case "doublePay":
        return { ...base, [WORK_TIME_URL.R]: rate, [WORK_TIME_URL.H]: holidayHours, [WORK_TIME_URL.M]: multiplier };
      case "workHours":
        return { ...base, [WORK_TIME_URL.A]: dailyHours, [WORK_TIME_URL.D]: daysPerWeek, [WORK_TIME_URL.X]: weeksPerYear };
      case "shiftPay":
        return { ...base, [WORK_TIME_URL.R]: rate, [WORK_TIME_URL.H]: shiftHours, [WORK_TIME_URL.P]: differential };
      case "nightShift":
        return { ...base, [WORK_TIME_URL.R]: rate, [WORK_TIME_URL.H]: nightHours, [WORK_TIME_URL.P]: differential };
      default:
        return base;
    }
  }, [
    amount,
    config.mode,
    dailyHours,
    daysPerWeek,
    differential,
    holidayHours,
    hourlyMode,
    hoursPerWeek,
    multiplier,
    nightHours,
    overtimeHours,
    rate,
    regularHours,
    shiftHours,
    weeksPerYear,
  ]);

  useLoanUrlSync(shareParams, [
    amount,
    hoursPerWeek,
    weeksPerYear,
    hourlyMode,
    rate,
    regularHours,
    overtimeHours,
    multiplier,
    holidayHours,
    dailyHours,
    daysPerWeek,
    shiftHours,
    nightHours,
    differential,
  ]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "hourlyFromRate":
      case "hourlyFromAnnual": {
        const hpw = parsePositive(hoursPerWeek, "Hours per week");
        const wpy = parsePositive(weeksPerYear, "Weeks per year");
        if (!hpw.ok) return { error: hpw.error };
        if (!wpy.ok) return { error: wpy.error };
        if (hourlyMode === "annual") {
          const annual = parsePositive(amount, "Annual salary");
          if (!annual.ok) return { error: annual.error };
          const computed = hourlyWageFromAnnual({
            annualSalary: annual.value,
            hoursPerWeek: hpw.value,
            weeksPerYear: wpy.value,
          });
          return {
            primary: fmt(computed.hourlyRate),
            primaryLabel: "Hourly rate",
            rows: [
              { label: "Annual salary", value: fmt(computed.annualSalary) },
              { label: "Hours per week", value: String(computed.hoursPerWeek) },
              { label: "Hourly rate", value: fmt(computed.hourlyRate) },
              { label: "Weekly pay", value: fmt(computed.weeklyPay) },
              { label: "Monthly pay", value: fmt(computed.monthlyPay) },
            ],
          };
        }
        const hourly = parsePositive(amount, "Hourly rate");
        if (!hourly.ok) return { error: hourly.error };
        const computed = hourlyWageFromRate({
          hourlyRate: hourly.value,
          hoursPerWeek: hpw.value,
          weeksPerYear: wpy.value,
        });
        return {
          primary: fmt(computed.annualPay),
          primaryLabel: "Annual pay",
          rows: [
            { label: "Hourly rate", value: fmt(computed.hourlyRate) },
            { label: "Hours per week", value: String(computed.hoursPerWeek) },
            { label: "Weekly pay", value: fmt(computed.weeklyPay) },
            { label: "Monthly pay", value: fmt(computed.monthlyPay) },
            { label: "Annual pay", value: fmt(computed.annualPay) },
          ],
        };
      }
      case "overtime":
      case "timesheet": {
        const r = parsePositive(rate, "Hourly rate");
        const reg = parseNonNegative(regularHours, "Regular hours");
        const ot = parseNonNegative(overtimeHours, "Overtime hours");
        const mult = parsePositive(multiplier, config.multiplierLabel ?? "Multiplier");
        if (!r.ok) return { error: r.error };
        if (!reg.ok) return { error: reg.error };
        if (!ot.ok) return { error: ot.error };
        if (!mult.ok) return { error: mult.error };
        const computed =
          config.mode === "timesheet"
            ? timesheetPay({
                hourlyRate: r.value,
                regularHours: reg.value,
                overtimeHours: ot.value,
                overtimeMultiplier: mult.value,
              })
            : overtimePay({
                hourlyRate: r.value,
                regularHours: reg.value,
                overtimeHours: ot.value,
                overtimeMultiplier: mult.value,
              });
        return {
          primary: fmt(computed.totalPay),
          primaryLabel: config.mode === "timesheet" ? "Timesheet total pay" : "Total pay",
          rows: [
            { label: "Hourly rate", value: fmt(computed.hourlyRate) },
            { label: "Regular hours", value: String(computed.regularHours) },
            { label: "Regular pay", value: fmt(computed.regularPay) },
            { label: "Overtime hours", value: String(computed.overtimeHours) },
            { label: "Overtime pay", value: fmt(computed.overtimePay) },
            { label: "Total pay", value: fmt(computed.totalPay) },
            { label: "Effective hourly", value: fmt(computed.effectiveHourly) },
          ],
        };
      }
      case "doublePay": {
        const r = parsePositive(rate, "Hourly rate");
        const hrs = parsePositive(holidayHours, "Holiday hours");
        const mult = parsePositive(multiplier, config.multiplierLabel ?? "Multiplier");
        if (!r.ok) return { error: r.error };
        if (!hrs.ok) return { error: hrs.error };
        if (!mult.ok) return { error: mult.error };
        const computed = doublePayHoliday({ hourlyRate: r.value, holidayHours: hrs.value, multiplier: mult.value });
        return {
          primary: fmt(computed.totalPay),
          primaryLabel: "Holiday / premium pay",
          rows: [
            { label: "Hourly rate", value: fmt(computed.hourlyRate) },
            { label: "Hours worked", value: String(computed.holidayHours) },
            { label: "Multiplier", value: `${computed.multiplier}×` },
            { label: "Base pay", value: fmt(computed.basePay) },
            { label: "Premium", value: fmt(computed.premiumPay) },
            { label: "Total pay", value: fmt(computed.totalPay) },
          ],
        };
      }
      case "workHours": {
        const daily = parsePositive(dailyHours, "Hours per day");
        const days = parsePositive(daysPerWeek, "Days per week");
        const wpy = parsePositive(weeksPerYear, "Weeks per year");
        if (!daily.ok) return { error: daily.error };
        if (!days.ok) return { error: days.error };
        if (!wpy.ok) return { error: wpy.error };
        const computed = workHours({ dailyHours: daily.value, daysPerWeek: days.value, weeksPerYear: wpy.value });
        return {
          primary: `${computed.weeklyHours.toFixed(1)}h`,
          primaryLabel: "Weekly hours",
          rows: [
            { label: "Hours per day", value: String(computed.dailyHours) },
            { label: "Days per week", value: String(computed.daysPerWeek) },
            { label: "Weekly hours", value: `${computed.weeklyHours.toFixed(1)}` },
            { label: "Monthly hours", value: `${computed.monthlyHours.toFixed(1)}` },
            { label: "Annual hours", value: `${computed.annualHours.toFixed(0)}` },
          ],
        };
      }
      case "shiftPay": {
        const r = parsePositive(rate, "Hourly rate");
        const hrs = parsePositive(shiftHours, "Shift hours");
        const diff = parseAprPercent(differential, config.differentialLabel ?? "Differential %");
        if (!r.ok) return { error: r.error };
        if (!hrs.ok) return { error: hrs.error };
        if (!diff.ok) return { error: diff.error };
        const computed = shiftPay({ hourlyRate: r.value, shiftHours: hrs.value, differentialPercent: diff.value });
        return {
          primary: fmt(computed.totalPay),
          primaryLabel: "Shift pay",
          rows: [
            { label: "Base hourly rate", value: fmt(computed.hourlyRate) },
            { label: "Shift hours", value: String(computed.shiftHours) },
            { label: "Differential", value: `${computed.differentialPercent}%` },
            { label: "Base pay", value: fmt(computed.basePay) },
            { label: "Differential pay", value: fmt(computed.differentialPay) },
            { label: "Total pay", value: fmt(computed.totalPay) },
            { label: "Effective hourly", value: fmt(computed.effectiveHourly) },
          ],
        };
      }
      case "nightShift": {
        const r = parsePositive(rate, "Hourly rate");
        const hrs = parsePositive(nightHours, "Night hours");
        const allow = parseAprPercent(differential, config.differentialLabel ?? "Allowance %");
        if (!r.ok) return { error: r.error };
        if (!hrs.ok) return { error: hrs.error };
        if (!allow.ok) return { error: allow.error };
        const computed = nightShiftAllowance({
          hourlyRate: r.value,
          nightHours: hrs.value,
          allowancePercent: allow.value,
        });
        return {
          primary: fmt(computed.totalPay),
          primaryLabel: "Night shift pay",
          rows: [
            { label: "Base hourly rate", value: fmt(computed.hourlyRate) },
            { label: "Night hours", value: String(computed.nightHours) },
            { label: "Allowance", value: `${computed.allowancePercent}%` },
            { label: "Base pay", value: fmt(computed.basePay) },
            { label: "Allowance pay", value: fmt(computed.allowancePay) },
            { label: "Total pay", value: fmt(computed.totalPay) },
            { label: "Effective hourly", value: fmt(computed.effectiveHourly) },
          ],
        };
      }
      default:
        return { error: "Unknown calculator mode." };
    }
  }, [
    amount,
    config,
    dailyHours,
    daysPerWeek,
    differential,
    fmt,
    holidayHours,
    hourlyMode,
    hoursPerWeek,
    multiplier,
    nightHours,
    overtimeHours,
    rate,
    regularHours,
    shiftHours,
    weeksPerYear,
  ]);

  const showCurrency = config.mode !== "workHours";

  return (
    <CalculatorShell
      title={config.title}
      description={config.description}
      result={
        "error" in result ? (
          <p className="text-sm font-medium text-rose-700">{result.error}</p>
        ) : (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-[var(--muted)]">{result.primaryLabel}</p>
              <p className="font-mono text-3xl font-semibold text-[var(--accent-bright)]">{result.primary}</p>
            </div>
            <div className="grid gap-2 border-t border-[var(--border)] pt-4">
              {result.rows.map((row) => (
                <Row key={row.label} label={row.label} value={row.value} />
              ))}
            </div>
          </div>
        )
      }
    >
      {showCurrency ? (
        <div className="mb-4">
          <FieldLabel htmlFor="currency">Currency</FieldLabel>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as WorkTimeCurrencyCode)}
            className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:max-w-xs"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {config.showHourlyMode ? (
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="hourlyMode">Input mode</FieldLabel>
            <select
              id="hourlyMode"
              value={hourlyMode}
              onChange={(e) => setHourlyMode(e.target.value as "rate" | "annual")}
              className="mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:max-w-xs"
            >
              <option value="rate">Hourly rate → annual pay</option>
              <option value="annual">Annual salary → hourly rate</option>
            </select>
          </div>
        ) : null}

        {config.mode === "hourlyFromRate" || config.mode === "hourlyFromAnnual" ? (
          <>
            <div>
              <FieldLabel htmlFor="amount">
                {hourlyMode === "annual" ? "Annual salary" : config.amountLabel}
              </FieldLabel>
              <FieldInput
                id="amount"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <FieldLabel htmlFor="hoursPerWeek">Hours per week</FieldLabel>
              <FieldInput
                id="hoursPerWeek"
                inputMode="decimal"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <FieldLabel htmlFor="weeksPerYear">Weeks per year</FieldLabel>
              <FieldInput
                id="weeksPerYear"
                inputMode="decimal"
                value={weeksPerYear}
                onChange={(e) => setWeeksPerYear(e.target.value)}
                className="mt-2"
              />
            </div>
          </>
        ) : null}

        {config.showRate && config.mode !== "hourlyFromRate" && config.mode !== "hourlyFromAnnual" ? (
          <div>
            <FieldLabel htmlFor="rate">{config.amountLabel}</FieldLabel>
            <FieldInput
              id="rate"
              inputMode="decimal"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showRegularHours ? (
          <div>
            <FieldLabel htmlFor="regularHours">Regular hours</FieldLabel>
            <FieldInput
              id="regularHours"
              inputMode="decimal"
              value={regularHours}
              onChange={(e) => setRegularHours(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showOvertimeHours ? (
          <div>
            <FieldLabel htmlFor="overtimeHours">Overtime hours</FieldLabel>
            <FieldInput
              id="overtimeHours"
              inputMode="decimal"
              value={overtimeHours}
              onChange={(e) => setOvertimeHours(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showMultiplier ? (
          <div>
            <FieldLabel htmlFor="multiplier">{config.multiplierLabel}</FieldLabel>
            <FieldInput
              id="multiplier"
              inputMode="decimal"
              value={multiplier}
              onChange={(e) => setMultiplier(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showHolidayHours ? (
          <div>
            <FieldLabel htmlFor="holidayHours">Holiday / premium hours</FieldLabel>
            <FieldInput
              id="holidayHours"
              inputMode="decimal"
              value={holidayHours}
              onChange={(e) => setHolidayHours(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showDailyHours ? (
          <div>
            <FieldLabel htmlFor="dailyHours">Hours per day</FieldLabel>
            <FieldInput
              id="dailyHours"
              inputMode="decimal"
              value={dailyHours}
              onChange={(e) => setDailyHours(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showDaysPerWeek ? (
          <div>
            <FieldLabel htmlFor="daysPerWeek">Days per week</FieldLabel>
            <FieldInput
              id="daysPerWeek"
              inputMode="decimal"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.mode === "workHours" ? (
          <div>
            <FieldLabel htmlFor="weeksPerYearWork">Weeks per year</FieldLabel>
            <FieldInput
              id="weeksPerYearWork"
              inputMode="decimal"
              value={weeksPerYear}
              onChange={(e) => setWeeksPerYear(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showShiftHours ? (
          <div>
            <FieldLabel htmlFor="shiftHours">Shift hours</FieldLabel>
            <FieldInput
              id="shiftHours"
              inputMode="decimal"
              value={shiftHours}
              onChange={(e) => setShiftHours(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showNightHours ? (
          <div>
            <FieldLabel htmlFor="nightHours">Night shift hours</FieldLabel>
            <FieldInput
              id="nightHours"
              inputMode="decimal"
              value={nightHours}
              onChange={(e) => setNightHours(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}

        {config.showDifferential ? (
          <div>
            <FieldLabel htmlFor="differential">{config.differentialLabel}</FieldLabel>
            <FieldInput
              id="differential"
              inputMode="decimal"
              value={differential}
              onChange={(e) => setDifferential(e.target.value)}
              className="mt-2"
            />
          </div>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
