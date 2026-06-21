import type { AiInsight, ChartSlice } from "@/lib/calculators/aiFinanceSmartRich";
import {
  currencyTrendPredictorRich,
  dailyRoutineOptimizerRich,
  productivityScoreRich,
  timeManagementPlannerRich,
  timeZonePlannerRich,
  unitConversionAdvisorRich,
} from "@/lib/calculators/aiConversionSmartRich";
import { parseEnergy, parseUnit, type EnergyLevel, type UnitKey } from "@/lib/calculators/aiConversionSmart";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { Mode } from "./aiConversionHostTypes";

export type HostResult =
  | { error: string }
  | {
      primary: string;
      primaryLabel: string;
      rows?: { label: string; value: string }[];
      healthScore?: number;
      grade?: string;
      insights?: AiInsight[];
      chartSlices?: ChartSlice[];
      compareRows?: { label: string; target: number; actual: number }[];
      projection?: { month: number; balance: number }[];
      scenarios?: { label: string; months: number; monthly: number }[];
      schedule?: { time: string; activity: string }[];
      steps?: { step: number; text: string }[];
      rankedItems?: { name: string; score: number; status: string }[];
      milestones?: { week: number; target: number }[];
      usageTips?: string[];
      phases?: { phase: string; days: number; focus: string }[];
      relatedUnits?: { unit: string; value: number }[];
      overlapWindows?: { slot: string; zones: string }[];
      rankedLevers?: { name: string; save: number; effort: string }[];
    };

export type HostInputs = Record<string, string | UnitKey | EnergyLevel>;

export function computeConversionHostResult(mode: Mode, raw: HostInputs): HostResult {
  switch (mode) {
    case "unitConversion": {
      const val = parsePositive(String(raw.val || "100"), "Value");
      if (!val.ok) return { error: val.error };
      const from = parseUnit(String(raw.from || "km"));
      const to = parseUnit(String(raw.to || "mi"));
      const r = unitConversionAdvisorRich({ value: val.value, from, to });
      if ("error" in r) return { error: r.error };
      return {
        primary: String(r.result),
        primaryLabel: `${val.value} ${from} → ${to} (${r.category})`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        steps: r.steps,
        relatedUnits: r.relatedUnits,
        usageTips: r.usageTips,
        rows: [{ label: "Precision", value: `${r.precision} decimals` }],
      };
    }
    case "currencyTrend": {
      const amt = parsePositive(String(raw.amt || "1000"), "Amount");
      const rate = parsePositive(String(raw.rate || "83.5"), "Exchange rate");
      const trend = parseAprPercent(String(raw.trend || "1.2"), "Trend");
      const vol = parseAprPercent(String(raw.vol || "6"), "Volatility");
      const days = parsePositive(String(raw.days || "30"), "Horizon days");
      if (!amt.ok) return { error: amt.error };
      if (!rate.ok) return { error: rate.error };
      if (!trend.ok) return { error: trend.error };
      if (!vol.ok) return { error: vol.error };
      if (!days.ok) return { error: days.error };
      const r = currencyTrendPredictorRich({ amount: amt.value, rate: rate.value, trendPct: trend.value, volatility: vol.value, horizonDays: days.value });
      if ("error" in r) return { error: r.error };
      return {
        primary: `₹${Math.round(r.forecastMid).toLocaleString("en-IN")}`,
        primaryLabel: `${days.value}-day mid forecast · spot ₹${Math.round(r.convertedNow).toLocaleString("en-IN")}`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        projection: r.projection,
        scenarios: r.scenarios,
        milestones: r.milestones,
        steps: r.steps,
        usageTips: r.usageTips,
        rows: [
          { label: "Low band", value: `₹${Math.round(r.forecastLow).toLocaleString("en-IN")}` },
          { label: "High band", value: `₹${Math.round(r.forecastHigh).toLocaleString("en-IN")}` },
        ],
      };
    }
    case "timeZonePlanner": {
      const tz1 = Number(raw.tz1 ?? "0");
      const tz2 = Number(raw.tz2 ?? "5.5");
      const tz3 = Number(raw.tz3 ?? "8");
      const ws = parseNonNegative(String(raw.ws || "9"), "Work start");
      const we = parsePositive(String(raw.we || "18"), "Work end");
      const mdur = parsePositive(String(raw.mdur || "60"), "Meeting duration");
      if (!ws.ok) return { error: ws.error };
      if (!we.ok) return { error: we.error };
      if (!mdur.ok) return { error: mdur.error };
      const r = timeZonePlannerRich({ offsets: [tz1, tz2, tz3], workStart: ws.value, workEnd: we.value, meetingMin: mdur.value });
      if ("error" in r) return { error: r.error };
      return {
        primary: r.bestSlot,
        primaryLabel: `${r.overlapHours.toFixed(1)}h overlap · ${mdur.value}min meetings`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        compareRows: r.compareRows,
        schedule: r.schedule,
        overlapWindows: r.overlapWindows,
        steps: r.steps,
        milestones: r.milestones,
        rows: [{ label: "Overlap", value: `${r.overlapHours.toFixed(1)}h` }],
      };
    }
    case "timeManagement": {
      const hrs = parsePositive(String(raw.hrs || "8"), "Hours available");
      if (!hrs.ok) return { error: hrs.error };
      const r = timeManagementPlannerRich({
        hoursAvailable: hrs.value,
        tasks: [
          { name: String(raw.t1 || "Deep project"), hours: Number(raw.h1) || 3, priority: Number(raw.p1) || 9 },
          { name: String(raw.t2 || "Meetings"), hours: Number(raw.h2) || 2, priority: Number(raw.p2) || 7 },
          { name: String(raw.t3 || "Email & admin"), hours: Number(raw.h3) || 1.5, priority: Number(raw.p3) || 5 },
          { name: String(raw.t4 || "Learning"), hours: Number(raw.h4) || 1, priority: Number(raw.p4) || 6 },
        ],
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.utilization.toFixed(0)}%`,
        primaryLabel: `${r.scheduled.toFixed(1)}h scheduled · ${r.bufferHours.toFixed(1)}h buffer`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        schedule: r.schedule,
        steps: r.steps,
        rankedItems: r.rankedItems,
        milestones: r.milestones,
        rows: [{ label: "Buffer", value: `${r.bufferHours.toFixed(1)}h` }],
      };
    }
    case "productivityScore": {
      const fcs = parseNonNegative(String(raw.fcs || "5"), "Focus hours");
      const intr = parseNonNegative(String(raw.intr || "12"), "Interruptions");
      const done = parseNonNegative(String(raw.done || "7"), "Tasks completed");
      const plan = parsePositive(String(raw.plan || "9"), "Tasks planned");
      const deep = parseNonNegative(String(raw.deep || "2"), "Deep work hours");
      if (!fcs.ok) return { error: fcs.error };
      if (!intr.ok) return { error: intr.error };
      if (!done.ok) return { error: done.error };
      if (!plan.ok) return { error: plan.error };
      if (!deep.ok) return { error: deep.error };
      const r = productivityScoreRich({ focusHours: fcs.value, interruptions: intr.value, completed: done.value, planned: plan.value, deepWorkHours: deep.value });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.productivityScore.toFixed(0)}/100`,
        primaryLabel: `Productivity · ${r.completionRate.toFixed(0)}% completion`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        projection: r.projection,
        milestones: r.milestones,
        steps: r.steps,
        rankedLevers: r.rankedLevers,
        rows: [
          { label: "Deep work", value: `${deep.value}h` },
          { label: "Interruptions", value: `${intr.value}/day` },
        ],
      };
    }
    case "dailyRoutine": {
      const wake = parseNonNegative(String(raw.wake || "6"), "Wake hour");
      const sleep = parsePositive(String(raw.sleep || "23"), "Sleep hour");
      if (!wake.ok) return { error: wake.error };
      if (!sleep.ok) return { error: sleep.error };
      const r = dailyRoutineOptimizerRich({
        wakeHour: wake.value,
        sleepHour: sleep.value,
        blocks: [
          { name: String(raw.a1 || "Exercise"), duration: Number(raw.d1) || 1, energy: parseEnergy(String(raw.e1 || "high")) },
          { name: String(raw.a2 || "Deep work"), duration: Number(raw.d2) || 3, energy: parseEnergy(String(raw.e2 || "high")) },
          { name: String(raw.a3 || "Meetings"), duration: Number(raw.d3) || 2, energy: parseEnergy(String(raw.e3 || "medium")) },
          { name: String(raw.a4 || "Family time"), duration: Number(raw.d4) || 2, energy: parseEnergy(String(raw.e4 || "low")) },
          { name: String(raw.a5 || "Reading"), duration: Number(raw.d5) || 0.5, energy: parseEnergy(String(raw.e5 || "low")) },
        ],
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.efficiency.toFixed(0)}%`,
        primaryLabel: `Routine efficiency · ${r.scheduledHours.toFixed(1)}h of ${r.awakeHours.toFixed(1)}h awake`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        schedule: r.schedule,
        phases: r.phases,
        milestones: r.milestones,
        steps: r.steps,
        usageTips: r.usageTips,
        rows: [{ label: "Free time", value: `${(r.awakeHours - r.scheduledHours).toFixed(1)}h` }],
      };
    }
    default:
      return { error: "Unknown mode." };
  }
}
