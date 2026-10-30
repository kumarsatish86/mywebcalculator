/** Civil estimation & cost — estimation only. */

export type CivilEstimationSlug =
  | "civil-construction-cost-calculator"
  | "civil-house-construction-cost-calculator"
  | "civil-material-cost-estimator"
  | "civil-labor-cost-calculator"
  | "civil-project-cost-calculator"
  | "civil-boq-bill-of-quantity-calculator"
  | "civil-rate-analysis-calculator";

export type CivilEstimationInput = {
  areaM2?: number;
  costPerM2?: number;
  materialCost?: number;
  laborCost?: number;
  overheadPct?: number;
  profitPct?: number;
  quantity?: number;
  rate?: number;
  days?: number;
  workers?: number;
  wagePerDay?: number;
  items?: number;
};

export type CivilEstimationResult =
  | { ok: false; error: string }
  | {
      ok: true;
      totalCost?: number;
      materialCost?: number;
      laborCost?: number;
      overhead?: number;
      profit?: number;
      unitRate?: number;
      note: string;
    };

function p(n: number | undefined, label: string): number | { error: string } {
  if (n === undefined || !Number.isFinite(n) || n <= 0) return { error: `${label} must be positive.` };
  return n;
}

export function computeCivilEstimation(
  slug: CivilEstimationSlug,
  input: CivilEstimationInput,
): CivilEstimationResult {
  const oh = input.overheadPct !== undefined && input.overheadPct >= 0 ? input.overheadPct / 100 : 0.1;
  const pr = input.profitPct !== undefined && input.profitPct >= 0 ? input.profitPct / 100 : 0.1;

  switch (slug) {
    case "civil-construction-cost-calculator":
    case "civil-house-construction-cost-calculator": {
      const A = p(input.areaM2, "Built-up area");
      if (typeof A !== "number") return { ok: false, error: A.error };
      const rate = p(input.costPerM2, "Cost per m²");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return {
        ok: true,
        totalCost: A * rate,
        note: "Rough construction cost = area × rate/m². Specs and finish grade dominate.",
      };
    }
    case "civil-material-cost-estimator": {
      const q = p(input.quantity, "Quantity");
      if (typeof q !== "number") return { ok: false, error: q.error };
      const r = p(input.rate, "Unit rate");
      if (typeof r !== "number") return { ok: false, error: r.error };
      return { ok: true, materialCost: q * r, totalCost: q * r, note: "Material line = quantity × rate." };
    }
    case "civil-labor-cost-calculator": {
      const days = p(input.days, "Days");
      if (typeof days !== "number") return { ok: false, error: days.error };
      const workers = p(input.workers ?? 1, "Workers");
      if (typeof workers !== "number") return { ok: false, error: workers.error };
      const wage = p(input.wagePerDay, "Wage per day");
      if (typeof wage !== "number") return { ok: false, error: wage.error };
      const labor = days * workers * wage;
      return { ok: true, laborCost: labor, totalCost: labor, note: "Labor = days × crew × daily wage." };
    }
    case "civil-project-cost-calculator": {
      const mat = input.materialCost ?? 0;
      const lab = input.laborCost ?? 0;
      if (mat < 0 || lab < 0 || (!mat && !lab)) {
        return { ok: false, error: "Provide material and/or labor cost." };
      }
      const base = mat + lab;
      const overhead = base * oh;
      const profit = (base + overhead) * pr;
      return {
        ok: true,
        materialCost: mat,
        laborCost: lab,
        overhead,
        profit,
        totalCost: base + overhead + profit,
        note: "Project rollup with overhead and profit percentages.",
      };
    }
    case "civil-boq-bill-of-quantity-calculator": {
      const q = p(input.quantity, "Quantity");
      if (typeof q !== "number") return { ok: false, error: q.error };
      const r = p(input.rate, "Rate");
      if (typeof r !== "number") return { ok: false, error: r.error };
      const items = input.items && input.items > 0 ? input.items : 1;
      return {
        ok: true,
        totalCost: q * r * items,
        unitRate: r,
        note: "BOQ line amount = qty × rate (× line items if aggregated).",
      };
    }
    case "civil-rate-analysis-calculator": {
      const mat = input.materialCost ?? 0;
      const lab = input.laborCost ?? 0;
      const q = p(input.quantity ?? 1, "Quantity");
      if (typeof q !== "number") return { ok: false, error: q.error };
      const base = mat + lab;
      const withOh = base * (1 + oh);
      const total = withOh * (1 + pr);
      return {
        ok: true,
        materialCost: mat,
        laborCost: lab,
        overhead: base * oh,
        profit: withOh * pr,
        totalCost: total,
        unitRate: total / q,
        note: "Rate analysis: materials + labor + OH + profit, then unit rate.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
