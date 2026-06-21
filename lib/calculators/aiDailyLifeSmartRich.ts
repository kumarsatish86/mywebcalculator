import type { AiInsight, ChartSlice } from "./aiFinanceSmartRich";
import { DEAL_TIPS, LIFESTYLE_BENCHMARKS, SPLIT_TIPS, TRAVEL_CATEGORIES } from "./aiDailyLifeKnowledge";
import type { SplitMethod, TripStyle } from "./aiDailyLifeSmart";

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
  settlements?: { name: string; amount: number; direction: string }[];
  usageTips?: string[];
  milestones?: { week: number; target: number }[];
};

const FILLS = ["#6548f5", "#0d9488", "#f59e0b", "#94a3b8", "#f43f5e", "#22c55e"];

export function expenseSplitterRich(params: {
  total: number;
  people: number;
  tipPct: number;
  shares?: number[];
  method: SplitMethod;
}): RichResult & { perPerson: number; grandTotal: number; settlements: { name: string; amount: number; direction: string }[] } | { error: string } {
  if (params.total <= 0) return { error: "Bill total must be positive." };
  if (params.people < 2 || params.people > 20) return { error: "Group size must be 2–20." };

  const tip = params.total * (params.tipPct / 100);
  const grandTotal = params.total + tip;
  const shares = params.shares?.slice(0, params.people) ?? Array(params.people).fill(1);
  while (shares.length < params.people) shares.push(1);
  const shareSum = shares.reduce((s, x) => s + Math.max(0, x), 0) || params.people;

  const amounts = shares.map((s) => Math.round((grandTotal * Math.max(0, s)) / shareSum));
  const diff = Math.round(grandTotal) - amounts.reduce((s, x) => s + x, 0);
  if (amounts.length) amounts[0] += diff;

  const perPerson = grandTotal / params.people;
  const settlements = amounts.map((a, i) => ({
    name: `Person ${i + 1}`,
    amount: a,
    direction: params.method === "equal" ? "Owes" : a > perPerson ? "Owes extra" : "Standard share",
  }));

  return {
    perPerson: Math.round(perPerson),
    grandTotal: Math.round(grandTotal),
    settlements,
    healthScore: params.tipPct <= 20 ? 88 : 72,
    grade: "Fair split",
    insights: [
      { priority: "high", title: "Grand total", detail: `₹${params.total.toLocaleString("en-IN")} + ${params.tipPct}% tip = ₹${Math.round(grandTotal).toLocaleString("en-IN")} split across ${params.people}.` },
      { priority: "medium", title: "Per person", detail: `Equal share ~₹${Math.round(perPerson).toLocaleString("en-IN")}; adjust for custom weights if someone ordered more.` },
      { priority: "low", title: "Settle up", detail: SPLIT_TIPS[0] },
    ],
    chartSlices: settlements.map((s, i) => ({ name: s.name, value: s.amount, fill: FILLS[i % FILLS.length] })),
    compareRows: settlements.map((s) => ({ label: s.name, target: perPerson, actual: s.amount })),
    usageTips: SPLIT_TIPS,
  };
}

export function billPlannerRich(params: {
  income: number;
  bills: { name: string; amount: number }[];
}): RichResult & { totalBills: number; leftover: number; billLoadPct: number } | { error: string } {
  if (params.income <= 0) return { error: "Monthly income must be positive." };
  const bills = params.bills.filter((b) => b.name.trim() && b.amount > 0);
  if (!bills.length) return { error: "Add at least one bill." };

  const totalBills = bills.reduce((s, b) => s + b.amount, 0);
  const leftover = params.income - totalBills;
  const billLoadPct = (totalBills / params.income) * 100;

  let healthScore = 80;
  if (billLoadPct <= 50) healthScore += 10;
  if (leftover < 0) healthScore = 35;
  else if (leftover < params.income * 0.1) healthScore -= 15;

  return {
    totalBills,
    leftover,
    billLoadPct,
    healthScore,
    grade: leftover >= params.income * 0.2 ? "Healthy buffer" : leftover >= 0 ? "Tight" : "Over budget",
    insights: [
      { priority: leftover < 0 ? "high" : "medium", title: "Cash flow", detail: `Bills ₹${totalBills.toLocaleString("en-IN")} (${billLoadPct.toFixed(0)}% of income) → ₹${leftover.toLocaleString("en-IN")} left.` },
      { priority: "medium", title: "Largest bill", detail: `${[...bills].sort((a, b) => b.amount - a.amount)[0]?.name} is your top fixed cost — review annually.` },
      { priority: "low", title: "Automation", detail: "Align due dates to payday week 1 to avoid overdraft surprises." },
    ],
    chartSlices: bills.map((b, i) => ({ name: b.name.slice(0, 12), value: b.amount, fill: FILLS[i % FILLS.length] })),
    compareRows: bills.map((b) => ({ label: b.name.slice(0, 10), target: params.income / bills.length, actual: b.amount })),
    schedule: bills.map((b, i) => ({ time: `Bill ${i + 1}`, activity: `${b.name} · ₹${b.amount.toLocaleString("en-IN")}` })),
    projection: [0, 1, 2, 3].map((m) => ({ month: m, balance: leftover })),
  };
}

export function lifestyleCostRich(params: {
  rent: number;
  food: number;
  transport: number;
  subscriptions: number;
  entertainment: number;
  savingsGoal: number;
}): RichResult & { total: number; needsPct: number; wantsPct: number; savingsPct: number } | { error: string } {
  const vals = Object.values(params);
  if (vals.some((v) => v < 0)) return { error: "Amounts cannot be negative." };

  const needs = params.rent + params.food + params.transport;
  const wants = params.subscriptions + params.entertainment;
  const total = needs + wants + params.savingsGoal;
  if (total <= 0) return { error: "Enter at least one category amount." };

  const needsPct = (needs / total) * 100;
  const wantsPct = (wants / total) * 100;
  const savingsPct = (params.savingsGoal / total) * 100;

  let healthScore = 70;
  if (savingsPct >= LIFESTYLE_BENCHMARKS.savingsMin * 100) healthScore += 15;
  if (needsPct <= LIFESTYLE_BENCHMARKS.needsMax * 100) healthScore += 10;
  if (wantsPct > LIFESTYLE_BENCHMARKS.wantsMax * 100) healthScore -= 10;
  healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

  return {
    total,
    needsPct,
    wantsPct,
    savingsPct,
    healthScore,
    grade: gradeFromScore(healthScore),
    insights: [
      { priority: savingsPct < 15 ? "high" : "medium", title: "50/30/20 check", detail: `Needs ${needsPct.toFixed(0)}% · wants ${wantsPct.toFixed(0)}% · savings ${savingsPct.toFixed(0)}% of ₹${total.toLocaleString("en-IN")}/mo.` },
      { priority: "medium", title: "Trim target", detail: wantsPct > 30 ? "Cut subscriptions or dining first — smallest pain, fastest savings." : "Wants share looks reasonable." },
      { priority: "low", title: "Annual view", detail: `Savings goal ≈ ₹${(params.savingsGoal * 12).toLocaleString("en-IN")}/year if maintained.` },
    ],
    chartSlices: [
      { name: "Needs", value: needs, fill: FILLS[0] },
      { name: "Wants", value: wants, fill: FILLS[1] },
      { name: "Savings", value: params.savingsGoal, fill: FILLS[2] },
    ],
    compareRows: [
      { label: "Needs", target: 50, actual: needsPct },
      { label: "Wants", target: 30, actual: wantsPct },
      { label: "Save", target: 20, actual: savingsPct },
    ],
    scenarios: [
      { label: "Current", months: 12, monthly: params.savingsGoal },
      { label: "+5% trim wants", months: 12, monthly: params.savingsGoal + wants * 0.05 },
      { label: "Full 20% save", months: 12, monthly: total * 0.2 },
    ],
  };
}

export function bestDealFinderRich(params: {
  offers: { price: number; qty: number; label: string }[];
}): RichResult & { bestLabel: string; unitPrice: number } | { error: string } {
  const offers = params.offers.filter((o) => o.price > 0 && o.qty > 0);
  if (offers.length < 2) return { error: "Enter at least two offers with price and quantity." };

  const ranked = offers
    .map((o) => ({ ...o, unit: o.price / o.qty }))
    .sort((a, b) => a.unit - b.unit);
  const best = ranked[0];
  const worst = ranked[ranked.length - 1];
  const savingsPct = worst ? ((worst.unit - best.unit) / worst.unit) * 100 : 0;

  return {
    bestLabel: best.label,
    unitPrice: best.unit,
    healthScore: Math.min(95, Math.round(70 + savingsPct)),
    grade: savingsPct >= 15 ? "Strong save" : "Moderate save",
    rankedItems: ranked.map((o, i) => ({
      name: o.label,
      score: Math.round(o.unit * 100) / 100,
      status: i === 0 ? "Best" : i === ranked.length - 1 ? "Costliest" : "Mid",
    })),
    insights: [
      { priority: "high", title: "Best unit price", detail: `${best.label}: ₹${best.unit.toFixed(2)}/unit vs ${worst.label} at ₹${worst.unit.toFixed(2)} (${savingsPct.toFixed(0)}% cheaper).` },
      { priority: "medium", title: "Total spend", detail: `Lowest pack costs ₹${best.price.toLocaleString("en-IN")} for qty ${best.qty}.` },
      { priority: "low", title: "Checklist", detail: DEAL_TIPS[0] },
    ],
    compareRows: ranked.map((o) => ({ label: o.label.slice(0, 8), target: best.unit, actual: o.unit })),
    usageTips: DEAL_TIPS.slice(0, 3),
  };
}

export function discountOptimizerRich(params: {
  original: number;
  discountPct: number;
  coupon: number;
  cashbackPct: number;
}): RichResult & { finalPrice: number; totalSaved: number; effectiveDiscount: number } | { error: string } {
  if (params.original <= 0) return { error: "Original price must be positive." };

  const afterPct = params.original * (1 - params.discountPct / 100);
  const afterCoupon = Math.max(0, afterPct - params.coupon);
  const cashback = afterCoupon * (params.cashbackPct / 100);
  const finalPrice = afterCoupon - cashback;
  const totalSaved = params.original - finalPrice;
  const effectiveDiscount = (totalSaved / params.original) * 100;

  return {
    finalPrice: Math.round(finalPrice),
    totalSaved: Math.round(totalSaved),
    effectiveDiscount,
    healthScore: Math.min(95, Math.round(50 + effectiveDiscount)),
    grade: effectiveDiscount >= 30 ? "Stacked well" : effectiveDiscount >= 15 ? "Decent deal" : "Light discount",
    steps: [
      { step: 1, text: `List price ₹${params.original.toLocaleString("en-IN")}` },
      { step: 2, text: `After ${params.discountPct}% off → ₹${afterPct.toFixed(0)}` },
      { step: 3, text: `Coupon −₹${params.coupon} → ₹${afterCoupon.toFixed(0)}` },
      { step: 4, text: `Cashback ${params.cashbackPct}% → pay effectively ₹${Math.round(finalPrice).toLocaleString("en-IN")}` },
    ],
    insights: [
      { priority: "high", title: "Effective discount", detail: `${effectiveDiscount.toFixed(1)}% off list — saved ₹${Math.round(totalSaved).toLocaleString("en-IN")}.` },
      { priority: "medium", title: "Stack order", detail: "Apply % discount first, flat coupon second, cashback last on payable amount." },
      { priority: "low", title: "Watch floor price", detail: DEAL_TIPS[2] },
    ],
    compareRows: [
      { label: "List", target: params.original, actual: params.original },
      { label: "After %", target: finalPrice, actual: afterPct },
      { label: "Final", target: finalPrice, actual: finalPrice },
    ],
    chartSlices: [
      { name: "You pay", value: finalPrice, fill: FILLS[0] },
      { name: "Saved", value: totalSaved, fill: FILLS[2] },
    ],
  };
}

export function priceComparisonAdvisorRich(params: {
  offers: { price: number; shipping: number; warranty: number; label: string }[];
}): RichResult & { recommended: string; scores: { label: string; score: number }[] } | { error: string } {
  const offers = params.offers.filter((o) => o.price > 0);
  if (offers.length < 2) return { error: "Compare at least two offers." };

  const scores = offers.map((o) => {
    const total = o.price + o.shipping;
    const minTotal = Math.min(...offers.map((x) => x.price + x.shipping));
    const priceScore = (minTotal / total) * 50;
    const warrantyScore = (o.warranty / 100) * 30;
    const shipScore = o.shipping === 0 ? 20 : Math.max(0, 20 - o.shipping / 100);
    return { label: o.label, score: Math.round(priceScore + warrantyScore + shipScore), total };
  }).sort((a, b) => b.score - a.score);

  return {
    recommended: scores[0].label,
    scores,
    healthScore: scores[0].score,
    grade: scores[0].score >= 80 ? "Best value" : "Acceptable",
    rankedItems: scores.map((s, i) => ({ name: s.label, score: s.score, status: i === 0 ? "Pick" : "Alt" })),
    insights: [
      { priority: "high", title: "Recommendation", detail: `${scores[0].label} scores ${scores[0].score}/100 — balances price, shipping, warranty.` },
      { priority: "medium", title: "Land cost", detail: `True cost = price + shipping; top pick all-in ~₹${scores[0].total.toLocaleString("en-IN")}.` },
      { priority: "low", title: "Warranty", detail: DEAL_TIPS[1] },
    ],
    compareRows: scores.map((s) => ({ label: s.label.slice(0, 8), target: 80, actual: s.score })),
  };
}

export function tripCostPlannerRich(params: {
  days: number;
  travelers: number;
  flight: number;
  hotelPerNight: number;
  foodPerDay: number;
  activities: number;
}): RichResult & { total: number; perPerson: number; perDay: number } | { error: string } {
  if (params.days <= 0 || params.travelers <= 0) return { error: "Days and travelers must be positive." };

  const stay = params.hotelPerNight * params.days;
  const food = params.foodPerDay * params.days * params.travelers;
  const transport = params.flight * params.travelers;
  const activities = params.activities * params.travelers;
  const total = transport + stay + food + activities;
  const perPerson = total / params.travelers;
  const perDay = total / params.days;

  return {
    total,
    perPerson,
    perDay,
    healthScore: perDay <= 5000 ? 85 : perDay <= 10000 ? 72 : 60,
    grade: gradeFromScore(perDay <= 5000 ? 85 : 72),
    insights: [
      { priority: "high", title: "Trip total", detail: `₹${Math.round(total).toLocaleString("en-IN")} for ${params.travelers} × ${params.days} days (₹${Math.round(perPerson).toLocaleString("en-IN")}/person).` },
      { priority: "medium", title: "Biggest slice", detail: stay >= transport ? `Stay ~${((stay / total) * 100).toFixed(0)}% — book early or split Airbnb.` : `Flights ~${((transport / total) * 100).toFixed(0)}% — flexible dates save most.` },
      { priority: "low", title: "Daily burn", detail: `~₹${Math.round(perDay).toLocaleString("en-IN")}/day all-in — keep 10% buffer for surprises.` },
    ],
    chartSlices: [
      { name: "Flights", value: transport, fill: FILLS[0] },
      { name: "Stay", value: stay, fill: FILLS[1] },
      { name: "Food", value: food, fill: FILLS[2] },
      { name: "Activities", value: activities, fill: FILLS[3] },
    ],
    compareRows: TRAVEL_CATEGORIES.map((c) => {
      const val = c.id === "transport" ? transport : c.id === "stay" ? stay : c.id === "food" ? food : activities;
      return { label: c.label, target: total * c.defaultShare, actual: val };
    }),
    projection: Array.from({ length: Math.min(params.days, 10) + 1 }, (_, i) => ({
      month: i,
      balance: Math.round((total / params.days) * i),
    })),
  };
}

export function travelBudgetOptimizerRich(params: {
  budget: number;
  days: number;
  style: TripStyle;
}): RichResult & { allocation: { category: string; amount: number }[] } | { error: string } {
  if (params.budget <= 0 || params.days <= 0) return { error: "Budget and days must be positive." };

  const mult = params.style === "luxury" ? 1.2 : params.style === "comfort" ? 1 : 0.85;
  const daily = params.budget / params.days;

  const shares = TRAVEL_CATEGORIES.map((c) => ({
    category: c.label,
    share: c.defaultShare * (c.id === "stay" && params.style === "luxury" ? 1.15 : 1),
  }));
  const shareSum = shares.reduce((s, x) => s + x.share, 0);
  const allocation = shares.map((s) => ({
    category: s.category,
    amount: Math.round((params.budget * s.share) / shareSum),
  }));

  return {
    allocation,
    healthScore: daily >= 2000 && daily <= 15000 ? 82 : 68,
    grade: params.style === "budget" ? "Frugal plan" : params.style === "luxury" ? "Premium plan" : "Balanced",
    insights: [
      { priority: "high", title: "Daily budget", detail: `₹${Math.round(daily).toLocaleString("en-IN")}/day for ${params.days} days (${params.style} style ×${mult.toFixed(2)}).` },
      { priority: "medium", title: "Flex fund", detail: `Hold 10% (₹${Math.round(params.budget * 0.1).toLocaleString("en-IN")}) for transport delays or extra activities.` },
      { priority: "low", title: "Book order", detail: "Flights + stay first when prices rise; activities last." },
    ],
    chartSlices: allocation.map((a, i) => ({ name: a.category, value: a.amount, fill: FILLS[i % FILLS.length] })),
    compareRows: allocation.map((a) => ({ label: a.category.slice(0, 8), target: params.budget / 4, actual: a.amount })),
    scenarios: [
      { label: "Budget", months: params.days, monthly: params.budget * 0.9 },
      { label: "Plan", months: params.days, monthly: params.budget },
      { label: "+10% buffer", months: params.days, monthly: params.budget * 1.1 },
    ],
  };
}

export function fuelCostPredictorRich(params: {
  distanceKm: number;
  mileageKmPerL: number;
  fuelPricePerL: number;
  roundTrip: boolean;
}): RichResult & { liters: number; totalCost: number; costPerKm: number } | { error: string } {
  if (params.distanceKm <= 0) return { error: "Distance must be positive." };
  if (params.mileageKmPerL <= 0) return { error: "Mileage must be positive." };
  if (params.fuelPricePerL <= 0) return { error: "Fuel price must be positive." };

  const dist = params.roundTrip ? params.distanceKm * 2 : params.distanceKm;
  const liters = dist / params.mileageKmPerL;
  const totalCost = liters * params.fuelPricePerL;
  const costPerKm = totalCost / dist;

  const monthlyTrips = 20;
  const monthlyCost = totalCost * monthlyTrips;

  return {
    liters: Math.round(liters * 10) / 10,
    totalCost: Math.round(totalCost),
    costPerKm: Math.round(costPerKm * 100) / 100,
    healthScore: params.mileageKmPerL >= 15 ? 88 : params.mileageKmPerL >= 10 ? 75 : 62,
    grade: params.mileageKmPerL >= 15 ? "Efficient" : "Average",
    insights: [
      { priority: "high", title: "Trip fuel", detail: `${dist} km → ${liters.toFixed(1)} L → ₹${Math.round(totalCost).toLocaleString("en-IN")} at ₹${params.fuelPricePerL}/L.` },
      { priority: "medium", title: "Monthly commute", detail: `If ${monthlyTrips} similar trips/mo ≈ ₹${Math.round(monthlyCost).toLocaleString("en-IN")} — carpool or WFH 1 day saves ~${Math.round(monthlyCost / monthlyTrips).toLocaleString("en-IN")}.` },
      { priority: "low", title: "Efficiency tip", detail: DEAL_TIPS[3] },
    ],
    compareRows: [
      { label: "Per km", target: 5, actual: costPerKm },
      { label: "Liters", target: liters, actual: liters },
      { label: "Total ₹", target: totalCost, actual: totalCost },
    ],
    projection: [1, 5, 10, 20].map((trips) => ({ month: trips, balance: Math.round(totalCost * trips) })),
    milestones: [1, 4, 12].map((w, i) => ({ week: w, target: Math.round(totalCost * (i + 1) * 4) })),
  };
}
