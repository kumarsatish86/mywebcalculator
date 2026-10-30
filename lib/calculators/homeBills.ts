/** Home bills & expenses — daily-life estimates. */

export type HomeBillsSlug =
  | "home-monthly-expense-calculator"
  | "home-household-budget-calculator"
  | "home-cost-of-living-calculator"
  | "home-ott-subscription-cost-calculator"
  | "home-internet-bill-calculator"
  | "home-mobile-recharge-cost-calculator"
  | "home-gas-bill-calculator"
  | "home-lpg-usage-calculator"
  | "home-garbage-utility-fee-calculator";

export type HomeBillsInput = {
  a?: number;
  b?: number;
  c?: number;
  d?: number;
  income?: number;
  subscriptions?: number;
  priceEach?: number;
  count?: number;
  cylinders?: number;
  pricePerCylinder?: number;
  daysPerCylinder?: number;
  fee?: number;
};

export type HomeBillsResult =
  | { ok: false; error: string }
  | { ok: true; total?: number; remaining?: number; perMonth?: number; note: string };

export function computeHomeBills(slug: HomeBillsSlug, input: HomeBillsInput): HomeBillsResult {
  const sum = (...vals: (number | undefined)[]) =>
    vals.reduce<number>((s, v) => s + (v && v > 0 ? v : 0), 0);

  switch (slug) {
    case "home-monthly-expense-calculator":
    case "home-cost-of-living-calculator": {
      const total = sum(input.a, input.b, input.c, input.d);
      if (total <= 0) return { ok: false, error: "Enter at least one expense category." };
      return { ok: true, total, note: "Sum of expense line items." };
    }
    case "home-household-budget-calculator": {
      const income = input.income;
      if (!income || income <= 0) return { ok: false, error: "Income must be positive." };
      const expenses = sum(input.a, input.b, input.c, input.d);
      return {
        ok: true,
        total: expenses,
        remaining: income - expenses,
        note: "Budget remaining = income − expenses.",
      };
    }
    case "home-ott-subscription-cost-calculator": {
      const n = input.count ?? input.subscriptions ?? 1;
      const price = input.priceEach ?? input.a;
      if (!n || n <= 0 || !price || price <= 0) return { ok: false, error: "Count and price must be positive." };
      return { ok: true, perMonth: n * price, total: n * price * 12, note: "OTT monthly = count × price; annual ×12." };
    }
    case "home-internet-bill-calculator":
    case "home-mobile-recharge-cost-calculator":
    case "home-garbage-utility-fee-calculator": {
      const fee = input.fee ?? input.a ?? input.priceEach;
      if (!fee || fee <= 0) return { ok: false, error: "Bill/fee amount must be positive." };
      const months = input.count && input.count > 0 ? input.count : 1;
      return { ok: true, perMonth: fee, total: fee * months, note: months > 1 ? `Total over ${months} months.` : "Single period amount." };
    }
    case "home-gas-bill-calculator": {
      const units = input.a;
      const rate = input.b;
      if (!units || units <= 0 || !rate || rate <= 0) return { ok: false, error: "Usage and rate must be positive." };
      return { ok: true, total: units * rate, note: "Gas bill = usage × rate." };
    }
    case "home-lpg-usage-calculator": {
      const cyl = input.cylinders ?? 1;
      const days = input.daysPerCylinder ?? 30;
      const price = input.pricePerCylinder ?? input.a ?? 0;
      if (cyl <= 0 || days <= 0) return { ok: false, error: "Cylinders and days/cylinder must be positive." };
      const perMonth = (30 / days) * cyl;
      return {
        ok: true,
        perMonth,
        total: price > 0 ? perMonth * price : undefined,
        note: "Cylinders/month ≈ (30 ÷ days per cylinder) × count.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
