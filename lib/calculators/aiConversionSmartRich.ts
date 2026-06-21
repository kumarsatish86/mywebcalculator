import type { AiInsight, ChartSlice } from "./aiFinanceSmartRich";
import {
  CONVERSION_TIPS,
  CURRENCY_BENCHMARKS,
  FX_TIPS,
  PRODUCTIVITY_BENCHMARKS,
  ROUTINE_TIPS,
  TIME_MGMT_STEPS,
  TZ_CITIES,
  UNIT_TO_BASE,
} from "./aiConversionKnowledge";
import type { EnergyLevel, UnitKey } from "./aiConversionSmart";

function gradeFromScore(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  return "Needs attention";
}

type RichResult = {
  healthScore: number;
  grade: string;
  insights: AiInsight[];
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

const FILLS = ["#6548f5", "#0d9488", "#f59e0b", "#94a3b8", "#f43f5e", "#22c55e"];

function convertTemperature(value: number, from: UnitKey, to: UnitKey): number | { error: string } {
  if (from === to) return value;
  if (from !== "c" && from !== "f") return { error: "Temperature units must be °C or °F." };
  if (to !== "c" && to !== "f") return { error: "Temperature units must be °C or °F." };
  const celsius = from === "c" ? value : ((value - 32) * 5) / 9;
  return to === "c" ? celsius : (celsius * 9) / 5 + 32;
}

export function convertUnits(value: number, from: UnitKey, to: UnitKey): number | { error: string } {
  const fromMeta = UNIT_TO_BASE[from];
  const toMeta = UNIT_TO_BASE[to];
  if (fromMeta.category === "temperature") return convertTemperature(value, from, to);
  if (fromMeta.category !== toMeta.category) return { error: `Cannot convert ${fromMeta.category} to ${toMeta.category}. Pick units in the same category.` };
  const baseValue = value * fromMeta.factor;
  return baseValue / toMeta.factor;
}

export function unitConversionAdvisorRich(params: {
  value: number;
  from: UnitKey;
  to: UnitKey;
}): RichResult & { result: number; precision: number; category: string } | { error: string } {
  if (params.value < 0 && UNIT_TO_BASE[params.from].category !== "temperature") {
    return { error: "Value must be non-negative for this unit type." };
  }

  const converted = convertUnits(params.value, params.from, params.to);
  if (typeof converted === "object") return converted;

  const category = UNIT_TO_BASE[params.from].category;
  const precision = Math.abs(converted) >= 1000 ? 2 : Math.abs(converted) >= 1 ? 4 : 6;
  const rounded = Number(converted.toFixed(precision));

  const sameCategory = (Object.keys(UNIT_TO_BASE) as UnitKey[]).filter(
    (u) => UNIT_TO_BASE[u].category === category && u !== params.to,
  );
  const relatedUnits = sameCategory.slice(0, 4).map((u) => {
    const v = convertUnits(params.value, params.from, u);
    return { unit: UNIT_TO_BASE[u].label, value: typeof v === "number" ? Number(v.toFixed(precision)) : 0 };
  });

  const ratio = params.value !== 0 ? converted / params.value : 0;
  let healthScore = 92;
  if (Math.abs(ratio) > 1000 || (Math.abs(ratio) < 0.001 && ratio !== 0)) healthScore -= 10;

  return {
    result: rounded,
    precision,
    category,
    relatedUnits,
    healthScore,
    grade: "Exact conversion",
    insights: [
      { priority: "high", title: "Result", detail: `${params.value} ${UNIT_TO_BASE[params.from].label} = ${rounded} ${UNIT_TO_BASE[params.to].label} (${category}).` },
      { priority: "medium", title: "Conversion factor", detail: `Multiply by ${ratio.toFixed(precision)} — verify significant figures for scientific use.` },
      { priority: category === "temperature" ? "high" : "low", title: "Precision note", detail: category === "temperature" ? "Temperature offsets are non-linear — never add/subtract like length units." : `Rounded to ${precision} decimal places for display.` },
      { priority: "low", title: "Related", detail: relatedUnits.map((r) => `${r.value} ${r.unit}`).join(" · ") || "—" },
    ],
    chartSlices: relatedUnits.map((r, i) => ({ name: r.unit.split(" ")[0] ?? r.unit, value: Math.abs(r.value), fill: FILLS[i % FILLS.length] })),
    compareRows: relatedUnits.slice(0, 3).map((r) => ({ label: r.unit, target: rounded, actual: r.value })),
    steps: CONVERSION_TIPS.map((text, i) => ({ step: i + 1, text })),
    usageTips: CONVERSION_TIPS,
  };
}

export function currencyTrendPredictorRich(params: {
  amount: number;
  rate: number;
  trendPct: number;
  volatility: number;
  horizonDays: number;
}): RichResult & { convertedNow: number; forecastMid: number; forecastHigh: number; forecastLow: number } | { error: string } {
  if (params.amount <= 0) return { error: "Amount must be positive." };
  if (params.rate <= 0) return { error: "Exchange rate must be positive." };
  if (params.horizonDays <= 0) return { error: "Horizon must be at least 1 day." };

  const convertedNow = params.amount * params.rate;
  const dailyTrend = params.trendPct / 100 / 30;
  const volBand = (params.volatility / 100) * Math.sqrt(params.horizonDays / 30);

  const forecastMid = convertedNow * (1 + dailyTrend * params.horizonDays);
  const forecastHigh = forecastMid * (1 + volBand);
  const forecastLow = forecastMid * (1 - volBand);

  let healthScore = 70;
  if (params.volatility <= CURRENCY_BENCHMARKS.lowVol) healthScore += 15;
  else if (params.volatility > CURRENCY_BENCHMARKS.highVol) healthScore -= 20;
  if (Math.abs(params.trendPct) > 5) healthScore -= 5;

  return {
    convertedNow,
    forecastMid,
    forecastHigh,
    forecastLow,
    healthScore,
    grade: params.volatility <= CURRENCY_BENCHMARKS.medVol ? "Stable band" : "Volatile — widen scenarios",
    insights: [
      { priority: "high", title: "Spot conversion", detail: `₹${params.amount.toLocaleString("en-IN")} × ${params.rate} = ₹${Math.round(convertedNow).toLocaleString("en-IN")} today.` },
      { priority: "medium", title: `${params.horizonDays}-day outlook`, detail: `Mid ₹${Math.round(forecastMid).toLocaleString("en-IN")} · range ₹${Math.round(forecastLow).toLocaleString("en-IN")}–₹${Math.round(forecastHigh).toLocaleString("en-IN")} at ${params.volatility}% vol.` },
      { priority: params.trendPct > 0 ? "low" : "medium", title: "Trend", detail: `${params.trendPct >= 0 ? "+" : ""}${params.trendPct}% / 30d — ${params.trendPct > 2 ? "quote strengthening" : params.trendPct < -2 ? "quote weakening" : "sideways"}.` },
      { priority: "low", title: "Planning band", detail: "Use low/high scenarios for budgeting, not point forecasts." },
    ],
    chartSlices: [
      { name: "Low", value: forecastLow, fill: FILLS[4] },
      { name: "Mid", value: forecastMid, fill: FILLS[2] },
      { name: "High", value: forecastHigh, fill: FILLS[2] },
    ],
    compareRows: [
      { label: "Volatility %", target: CURRENCY_BENCHMARKS.medVol, actual: params.volatility },
      { label: "Trend %/30d", target: 0, actual: params.trendPct },
      { label: "Horizon days", target: 30, actual: params.horizonDays },
    ],
    projection: [0, 7, 14, 21, 30].filter((d) => d <= params.horizonDays || d === 0).map((d) => ({
      month: d,
      balance: Math.round(convertedNow * (1 + dailyTrend * d)),
    })),
    scenarios: [
      { label: "Bearish", months: params.horizonDays, monthly: forecastLow },
      { label: "Base", months: params.horizonDays, monthly: forecastMid },
      { label: "Bullish", months: params.horizonDays, monthly: forecastHigh },
    ],
    milestones: [7, 14, 30, 90].filter((d) => d <= params.horizonDays).map((d) => ({
      week: d,
      target: Math.round(convertedNow * (1 + dailyTrend * d)),
    })),
    steps: FX_TIPS.map((text, i) => ({ step: i + 1, text })),
    usageTips: FX_TIPS,
  };
}

function formatHour(h: number): string {
  const norm = ((h % 24) + 24) % 24;
  const hr = Math.floor(norm);
  const min = Math.round((norm - hr) * 60);
  return `${String(hr).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

export function timeZonePlannerRich(params: {
  offsets: number[];
  workStart: number;
  workEnd: number;
  meetingMin: number;
}): RichResult & { bestSlot: string; overlapHours: number } | { error: string } {
  const zones = params.offsets.filter((z) => !Number.isNaN(z));
  if (zones.length < 2) return { error: "Add at least 2 time zones." };

  const ref = zones[0];
  const slots: { utcHour: number; ok: boolean }[] = [];

  for (let utc = 0; utc < 24; utc += 0.5) {
    const ok = zones.every((off) => {
      const local = utc + off;
      const norm = ((local % 24) + 24) % 24;
      return norm >= 9 && norm < 18;
    });
    slots.push({ utcHour: utc, ok });
  }

  const goodSlots = slots.filter((s) => s.ok);
  const overlapHours = goodSlots.length * 0.5;
  const meetBlocks = Math.floor((overlapHours * 60) / params.meetingMin);
  const bestUtc = goodSlots[0]?.utcHour ?? 12;

  const overlapWindows = goodSlots.slice(0, 4).map((s) => ({
    slot: `${formatHour(s.utcHour + ref)}–${formatHour(s.utcHour + ref + params.meetingMin / 60)} (ref)`,
    zones: zones.map((off) => `${TZ_CITIES[String(off)] ?? `UTC${off >= 0 ? "+" : ""}${off}`}: ${formatHour(s.utcHour + off)}`).join(" · "),
  }));

  let healthScore = 60;
  if (overlapHours >= 3) healthScore += 25;
  else if (overlapHours >= 1) healthScore += 10;
  if (meetBlocks >= 3) healthScore += 10;

  return {
    bestSlot: overlapHours > 0 ? `${formatHour(bestUtc + ref)} ref · ${formatHour(bestUtc)} UTC` : "No overlap — async or rotate",
    overlapHours,
    overlapWindows,
    healthScore: overlapHours > 0 ? healthScore : 35,
    grade: overlapHours >= 3 ? "Wide overlap" : overlapHours >= 1 ? "Narrow window" : "Hard to schedule",
    insights: [
      { priority: overlapHours < 1 ? "high" : "medium", title: "Overlap", detail: `${overlapHours.toFixed(1)}h mutual 9–18 window · ~${meetBlocks} × ${params.meetingMin}min slots.` },
      { priority: "high", title: "Best slot", detail: overlapHours > 0 ? `Start ${formatHour(bestUtc + ref)} in reference zone (UTC ${formatHour(bestUtc)}).` : "Try fewer zones or extend async updates." },
      { priority: "medium", title: "Zones", detail: zones.map((z) => TZ_CITIES[String(z)] ?? `UTC${z >= 0 ? "+" : ""}${z}`).join(" · ") },
      { priority: "low", title: "Tip", detail: overlapHours < 2 ? "Rotate meeting time weekly to share timezone pain fairly." : "Block overlap window as recurring invite." },
    ],
    compareRows: zones.map((z, i) => ({
      label: TZ_CITIES[String(z)]?.split(" ")[0] ?? `Zone ${i + 1}`,
      target: 8,
      actual: overlapHours,
    })),
    schedule: overlapWindows.length ? overlapWindows.map((w) => ({ time: w.slot, activity: w.zones })) : [{ time: "—", activity: "No shared 9–18 window for all zones" }],
    milestones: [1, 2, 3, 4].map((w) => ({ week: w, target: Math.round(overlapHours * 10) / 10 })),
    steps: [
      { step: 1, text: "Share overlap window as default recurring slot." },
      { step: 2, text: "Record meetings for async teammates in shared doc." },
      { step: 3, text: "Use UTC in calendar invites to avoid DST confusion." },
    ],
  };
}

export function timeManagementPlannerRich(params: {
  hoursAvailable: number;
  tasks: { name: string; hours: number; priority: number }[];
}): RichResult & { utilization: number; bufferHours: number; scheduled: number } | { error: string } {
  if (params.hoursAvailable <= 0) return { error: "Available hours must be positive." };
  const tasks = params.tasks.filter((t) => t.name.trim() && t.hours > 0);
  if (!tasks.length) return { error: "Add at least one task." };

  const sorted = [...tasks].sort((a, b) => b.priority - a.priority);
  const bufferHours = params.hoursAvailable * 0.15;
  const schedulable = params.hoursAvailable - bufferHours;
  let cursor = 9;
  const schedule: { time: string; activity: string }[] = [];
  let scheduled = 0;

  for (const t of sorted) {
    if (scheduled + t.hours > schedulable) break;
    schedule.push({ time: `${formatHour(cursor)}–${formatHour(cursor + t.hours)}`, activity: `${t.name} (P${t.priority})` });
    cursor += t.hours;
    scheduled += t.hours;
  }
  if (bufferHours > 0) schedule.push({ time: `${formatHour(cursor)}–${formatHour(cursor + bufferHours)}`, activity: "Buffer / interrupts" });

  const utilization = (scheduled / params.hoursAvailable) * 100;
  let healthScore = 75;
  if (utilization > 95) healthScore -= 20;
  else if (utilization >= 70 && utilization <= 85) healthScore += 10;

  return {
    utilization,
    bufferHours,
    scheduled,
    healthScore,
    grade: utilization > 90 ? "Overpacked" : utilization >= 70 ? "Balanced" : "Under-planned",
    insights: [
      { priority: utilization > 90 ? "high" : "medium", title: "Day load", detail: `${scheduled.toFixed(1)}h scheduled + ${bufferHours.toFixed(1)}h buffer of ${params.hoursAvailable}h (${utilization.toFixed(0)}% util).` },
      { priority: "high", title: "Top block", detail: `${sorted[0]?.name} first (${sorted[0]?.hours}h) — protect this slot.` },
      { priority: scheduled < tasks.reduce((s, t) => s + t.hours, 0) ? "high" : "low", title: "Overflow", detail: scheduled < tasks.reduce((s, t) => s + t.hours, 0) ? "Not all tasks fit — defer lowest priority or extend day." : "All tasks fit with buffer." },
      { priority: "low", title: "Review", detail: TIME_MGMT_STEPS[3] },
    ],
    chartSlices: sorted.map((t, i) => ({ name: t.name.slice(0, 12), value: t.hours, fill: FILLS[i % FILLS.length] })),
    compareRows: sorted.map((t) => ({ label: t.name.slice(0, 10), target: schedulable / tasks.length, actual: t.hours })),
    schedule,
    steps: TIME_MGMT_STEPS.map((text, i) => ({ step: i + 1, text })),
    rankedItems: sorted.map((t) => ({ name: t.name, score: t.priority, status: t.priority >= 8 ? "Must do" : t.priority >= 5 ? "Should do" : "If time" })),
    milestones: [1, 2, 3, 4].map((h) => ({ week: h, target: Math.round((scheduled / tasks.length) * h) })),
  };
}

export function productivityScoreRich(params: {
  focusHours: number;
  interruptions: number;
  completed: number;
  planned: number;
  deepWorkHours: number;
}): RichResult & { productivityScore: number; completionRate: number } | { error: string } {
  if (params.planned <= 0) return { error: "Planned tasks must be at least 1." };

  const completionRate = (params.completed / params.planned) * 100;
  let score = 50;
  score += Math.min(25, params.focusHours * 5);
  score += Math.min(20, params.deepWorkHours * 8);
  score += Math.min(20, completionRate * 0.2);
  score -= Math.min(25, params.interruptions * 2);
  score = Math.max(0, Math.min(100, score));

  const rankedLevers = [
    { name: "Reduce interruptions", save: Math.round(params.interruptions * 3), effort: "Medium" },
    { name: "Add deep work block", save: Math.round(Math.max(0, PRODUCTIVITY_BENCHMARKS.deepWorkMin - params.deepWorkHours) * 8), effort: "Low" },
    { name: "Raise completion rate", save: Math.round(Math.max(0, PRODUCTIVITY_BENCHMARKS.completionMin - completionRate)), effort: "Medium" },
    { name: "Extend focus window", save: Math.round(Math.max(0, PRODUCTIVITY_BENCHMARKS.focusMin - params.focusHours) * 5), effort: "Low" },
  ].sort((a, b) => b.save - a.save);

  return {
    productivityScore: score,
    completionRate,
    rankedLevers,
    healthScore: score,
    grade: gradeFromScore(score),
    insights: [
      { priority: score < 60 ? "high" : "medium", title: "Productivity score", detail: `${score.toFixed(0)}/100 · ${params.focusHours}h focus · ${params.deepWorkHours}h deep work · ${completionRate.toFixed(0)}% tasks done.` },
      { priority: params.interruptions > PRODUCTIVITY_BENCHMARKS.interruptMax ? "high" : "low", title: "Interruptions", detail: `${params.interruptions}/day — target ≤${PRODUCTIVITY_BENCHMARKS.interruptMax}. Top lever: ${rankedLevers[0]?.name}.` },
      { priority: "medium", title: "Deep work", detail: `${params.deepWorkHours}h vs ${PRODUCTIVITY_BENCHMARKS.deepWorkMin}h target — schedule one 90-min block tomorrow.` },
      { priority: "low", title: "Completion", detail: `${params.completed}/${params.planned} tasks — ${completionRate >= PRODUCTIVITY_BENCHMARKS.completionMin ? "on track" : "trim plan to top 3 must-dos"}.` },
    ],
    chartSlices: [
      { name: "Focus", value: params.focusHours, fill: FILLS[0] },
      { name: "Deep work", value: params.deepWorkHours, fill: FILLS[2] },
      { name: "Interruptions", value: params.interruptions, fill: FILLS[4] },
    ],
    compareRows: [
      { label: "Focus h", target: PRODUCTIVITY_BENCHMARKS.focusMin, actual: params.focusHours },
      { label: "Deep work h", target: PRODUCTIVITY_BENCHMARKS.deepWorkMin, actual: params.deepWorkHours },
      { label: "Completion %", target: PRODUCTIVITY_BENCHMARKS.completionMin, actual: completionRate },
    ],
    projection: [0, 1, 2, 3, 4].map((w) => ({ month: w, balance: Math.min(100, score + w * 5) })),
    milestones: [1, 2, 4, 8].map((w) => ({ week: w, target: Math.min(100, score + w * 6) })),
    steps: rankedLevers.slice(0, 3).map((l, i) => ({ step: i + 1, text: `${l.name} (+${l.save} pts potential, ${l.effort} effort).` })),
  };
}

const ENERGY_ORDER: Record<EnergyLevel, number> = { high: 0, medium: 1, low: 2 };

export function dailyRoutineOptimizerRich(params: {
  wakeHour: number;
  sleepHour: number;
  blocks: { name: string; duration: number; energy: EnergyLevel }[];
}): RichResult & { awakeHours: number; scheduledHours: number; efficiency: number } | { error: string } {
  const awake = params.sleepHour > params.wakeHour ? params.sleepHour - params.wakeHour : 24 - params.wakeHour + params.sleepHour;
  if (awake <= 4 || awake > 20) return { error: "Check wake and sleep times — awake window should be 4–20 hours." };

  const blocks = params.blocks.filter((b) => b.name.trim() && b.duration > 0);
  if (!blocks.length) return { error: "Add at least one activity block." };

  const scheduledHours = blocks.reduce((s, b) => s + b.duration, 0);
  if (scheduledHours > awake) return { error: `Activities total ${scheduledHours.toFixed(1)}h but only ${awake.toFixed(1)}h awake.` };

  const optimized = [...blocks].sort((a, b) => ENERGY_ORDER[a.energy] - ENERGY_ORDER[b.energy]);
  let cursor = params.wakeHour;
  const schedule: { time: string; activity: string }[] = [];

  for (const b of optimized) {
    schedule.push({
      time: `${formatHour(cursor)}–${formatHour(cursor + b.duration)}`,
      activity: `${b.name} · ${b.energy} energy`,
    });
    cursor += b.duration;
  }

  const freeHours = awake - scheduledHours;
  const efficiency = Math.min(100, (scheduledHours / awake) * 100 + optimized.filter((b) => b.energy === "high").length * 5);

  let healthScore = 70;
  if (efficiency >= 85) healthScore += 15;
  if (freeHours >= awake * 0.15) healthScore += 5;
  if (scheduledHours / awake > 0.95) healthScore -= 15;

  return {
    awakeHours: awake,
    scheduledHours,
    efficiency,
    healthScore,
    grade: efficiency >= 85 ? "Well structured" : efficiency >= 65 ? "Room to optimize" : "Overpacked",
    insights: [
      { priority: scheduledHours / awake > 0.9 ? "high" : "medium", title: "Day structure", detail: `${scheduledHours.toFixed(1)}h planned · ${freeHours.toFixed(1)}h free · ${awake.toFixed(1)}h awake window.` },
      { priority: "high", title: "Energy order", detail: `Front-load: ${optimized[0]?.name} (${optimized[0]?.energy}) → ${optimized[optimized.length - 1]?.name} (${optimized[optimized.length - 1]?.energy}) last.` },
      { priority: "medium", title: "Efficiency", detail: `${efficiency.toFixed(0)}% routine score — high-energy tasks in first 40% of day.` },
      { priority: "low", title: "Sleep", detail: `${formatHour(params.wakeHour)}–${formatHour(params.sleepHour)} sleep window preserved.` },
    ],
    chartSlices: blocks.map((b, i) => ({ name: b.name.slice(0, 10), value: b.duration, fill: FILLS[i % FILLS.length] })),
    compareRows: blocks.map((b) => ({ label: b.name.slice(0, 8), target: awake / blocks.length, actual: b.duration })),
    schedule,
    phases: [
      { phase: "Morning peak", days: 1, focus: optimized.filter((b) => b.energy === "high").map((b) => b.name).join(", ") || "Deep work" },
      { phase: "Midday", days: 1, focus: optimized.filter((b) => b.energy === "medium").map((b) => b.name).join(", ") || "Meetings & admin" },
      { phase: "Evening wind-down", days: 1, focus: optimized.filter((b) => b.energy === "low").map((b) => b.name).join(", ") || "Light tasks" },
    ],
    milestones: [1, 2, 3, 4].map((w) => ({ week: w, target: Math.min(100, efficiency + w * 3) })),
    steps: ROUTINE_TIPS.map((text, i) => ({ step: i + 1, text })),
    usageTips: ROUTINE_TIPS,
  };
}
