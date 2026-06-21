import type { AiInsight, ChartSlice } from "@/lib/calculators/aiFinanceSmartRich";
import {
  bestDealFinderRich,
  billPlannerRich,
  discountOptimizerRich,
  expenseSplitterRich,
  fuelCostPredictorRich,
  lifestyleCostRich,
  priceComparisonAdvisorRich,
  travelBudgetOptimizerRich,
  tripCostPlannerRich,
} from "@/lib/calculators/aiDailyLifeSmartRich";
import { parseRoundTrip, parseSplitMethod, parseTripStyle, type SplitMethod, type TripStyle } from "@/lib/calculators/aiDailyLifeSmart";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import type { Mode } from "./aiDailyLifeHostTypes";

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
      settlements?: { name: string; amount: number; direction: string }[];
      usageTips?: string[];
      milestones?: { week: number; target: number }[];
      allocation?: { category: string; amount: number }[];
    };

export type HostInputs = Record<string, string | SplitMethod | TripStyle>;

function billRows(raw: HostInputs) {
  return [
    { name: String(raw.b1n || "Rent"), amount: Number(raw.b1a) || 0 },
    { name: String(raw.b2n || "Utilities"), amount: Number(raw.b2a) || 0 },
    { name: String(raw.b3n || "Internet"), amount: Number(raw.b3a) || 0 },
    { name: String(raw.b4n || "Insurance"), amount: Number(raw.b4a) || 0 },
  ].filter((b) => b.amount > 0);
}

export function computeDailyLifeHostResult(mode: Mode, raw: HostInputs): HostResult {
  switch (mode) {
    case "expenseSplitter": {
      const tot = parsePositive(String(raw.tot || "2500"), "Bill total");
      const ppl = parsePositive(String(raw.ppl || "4"), "People");
      const tip = parseAprPercent(String(raw.tip || "10"), "Tip");
      if (!tot.ok) return { error: tot.error };
      if (!ppl.ok) return { error: ppl.error };
      if (!tip.ok) return { error: tip.error };
      const r = expenseSplitterRich({
        total: tot.value,
        people: ppl.value,
        tipPct: tip.value,
        method: parseSplitMethod(String(raw.method || "equal")),
        shares: [Number(raw.p1) || 1, Number(raw.p2) || 1, Number(raw.p3) || 1, Number(raw.p4) || 1],
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `₹${r.perPerson.toLocaleString("en-IN")}`,
        primaryLabel: `Per person · ${r.grandTotal.toLocaleString("en-IN")} total`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        settlements: r.settlements,
        usageTips: r.usageTips,
      };
    }
    case "billPlanner": {
      const inc = parsePositive(String(raw.inc || "50000"), "Income");
      if (!inc.ok) return { error: inc.error };
      const r = billPlannerRich({ income: inc.value, bills: billRows(raw) });
      if ("error" in r) return { error: r.error };
      return {
        primary: `₹${r.leftover.toLocaleString("en-IN")}`,
        primaryLabel: `Left after bills · ${r.billLoadPct.toFixed(0)}% load`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        schedule: r.schedule,
        projection: r.projection,
        rows: [{ label: "Total bills", value: `₹${r.totalBills.toLocaleString("en-IN")}` }],
      };
    }
    case "lifestyleCost": {
      const r = lifestyleCostRich({
        rent: Number(raw.rent) || 15000,
        food: Number(raw.food) || 8000,
        transport: Number(raw.trn) || 3000,
        subscriptions: Number(raw.sub) || 1500,
        entertainment: Number(raw.ent) || 2000,
        savingsGoal: Number(raw.sv) || 5000,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `₹${r.total.toLocaleString("en-IN")}`,
        primaryLabel: "Monthly lifestyle total",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        scenarios: r.scenarios,
        rows: [
          { label: "Needs", value: `${r.needsPct.toFixed(0)}%` },
          { label: "Wants", value: `${r.wantsPct.toFixed(0)}%` },
          { label: "Savings", value: `${r.savingsPct.toFixed(0)}%` },
        ],
      };
    }
    case "bestDealFinder": {
      const r = bestDealFinderRich({
        offers: [
          { label: "Store A", price: Number(raw.pr1) || 299, qty: Number(raw.q1) || 1 },
          { label: "Store B", price: Number(raw.pr2) || 549, qty: Number(raw.q2) || 2 },
          { label: "Store C", price: Number(raw.pr3) || 799, qty: Number(raw.q3) || 3 },
        ],
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: r.bestLabel,
        primaryLabel: `Best deal · ₹${r.unitPrice.toFixed(2)}/unit`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        compareRows: r.compareRows,
        rankedItems: r.rankedItems,
        usageTips: r.usageTips,
      };
    }
    case "discountOptimizer": {
      const orig = parsePositive(String(raw.orig || "5000"), "Original price");
      const disc = parseAprPercent(String(raw.disc || "20"), "Discount");
      const cpn = parseNonNegative(String(raw.cpn || "200"), "Coupon");
      const cb = parseAprPercent(String(raw.cb || "5"), "Cashback");
      if (!orig.ok) return { error: orig.error };
      if (!disc.ok) return { error: disc.error };
      if (!cpn.ok) return { error: cpn.error };
      if (!cb.ok) return { error: cb.error };
      const r = discountOptimizerRich({
        original: orig.value,
        discountPct: disc.value,
        coupon: cpn.value,
        cashbackPct: cb.value,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `₹${r.finalPrice.toLocaleString("en-IN")}`,
        primaryLabel: `${r.effectiveDiscount.toFixed(1)}% effective off`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        steps: r.steps,
        rows: [{ label: "Total saved", value: `₹${r.totalSaved.toLocaleString("en-IN")}` }],
      };
    }
    case "priceComparison": {
      const r = priceComparisonAdvisorRich({
        offers: [
          { label: "Retailer A", price: Number(raw.o1) || 12000, shipping: Number(raw.s1) || 0, warranty: Number(raw.w1) || 70 },
          { label: "Retailer B", price: Number(raw.o2) || 11500, shipping: Number(raw.s2) || 199, warranty: Number(raw.w2) || 85 },
          { label: "Retailer C", price: Number(raw.o3) || 11800, shipping: Number(raw.s3) || 99, warranty: Number(raw.w3) || 60 },
        ],
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: r.recommended,
        primaryLabel: "Recommended pick",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        compareRows: r.compareRows,
        rankedItems: r.rankedItems,
      };
    }
    case "tripCost": {
      const dys = parsePositive(String(raw.dys || "5"), "Days");
      const trv = parsePositive(String(raw.trv || "2"), "Travelers");
      if (!dys.ok) return { error: dys.error };
      if (!trv.ok) return { error: trv.error };
      const r = tripCostPlannerRich({
        days: dys.value,
        travelers: trv.value,
        flight: Number(raw.flt) || 8000,
        hotelPerNight: Number(raw.htl) || 3500,
        foodPerDay: Number(raw.fd) || 800,
        activities: Number(raw.act) || 2000,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `₹${Math.round(r.total).toLocaleString("en-IN")}`,
        primaryLabel: `₹${Math.round(r.perPerson).toLocaleString("en-IN")}/person · ${dys.value} days`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        projection: r.projection,
        rows: [{ label: "Daily burn", value: `₹${Math.round(r.perDay).toLocaleString("en-IN")}` }],
      };
    }
    case "travelBudget": {
      const bud = parsePositive(String(raw.bud || "50000"), "Budget");
      const dys = parsePositive(String(raw.dys || "5"), "Days");
      if (!bud.ok) return { error: bud.error };
      if (!dys.ok) return { error: dys.error };
      const r = travelBudgetOptimizerRich({
        budget: bud.value,
        days: dys.value,
        style: parseTripStyle(String(raw.style || "comfort")),
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `₹${Math.round(bud.value / dys.value).toLocaleString("en-IN")}/day`,
        primaryLabel: `${parseTripStyle(String(raw.style || "comfort"))} trip allocation`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        scenarios: r.scenarios,
        allocation: r.allocation,
      };
    }
    case "fuelCost": {
      const dist = parsePositive(String(raw.dist || "120"), "Distance");
      const mpg = parsePositive(String(raw.mpg || "15"), "Mileage");
      const fuel = parsePositive(String(raw.fuel || "102"), "Fuel price");
      if (!dist.ok) return { error: dist.error };
      if (!mpg.ok) return { error: mpg.error };
      if (!fuel.ok) return { error: fuel.error };
      const r = fuelCostPredictorRich({
        distanceKm: dist.value,
        mileageKmPerL: mpg.value,
        fuelPricePerL: fuel.value,
        roundTrip: parseRoundTrip(String(raw.rnd || "1")),
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `₹${r.totalCost.toLocaleString("en-IN")}`,
        primaryLabel: `${r.liters} L · ₹${r.costPerKm}/km`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        compareRows: r.compareRows,
        projection: r.projection,
        milestones: r.milestones,
      };
    }
    default:
      return { error: "Unknown mode." };
  }
}
