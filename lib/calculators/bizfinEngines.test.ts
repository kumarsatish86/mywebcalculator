import { describe, expect, it } from "vitest";
import { computeBizfinProfit, BIZFIN_PROFIT_SLUGS } from "./bizfinProfit";
import { computeBizfinInvest, BIZFIN_INVEST_SLUGS } from "./bizfinInvest";
import { computeBizfinCost, BIZFIN_COST_SLUGS } from "./bizfinCost";
import { computeBizfinPricing, BIZFIN_PRICING_SLUGS } from "./bizfinPricing";
import { computeBizfinCash, BIZFIN_CASH_SLUGS } from "./bizfinCash";
import { computeBizfinRatios, BIZFIN_RATIOS_SLUGS } from "./bizfinRatios";
import { computeBizfinTax, BIZFIN_TAX_SLUGS } from "./bizfinTax";
import { computeBizfinInventory, BIZFIN_INVENTORY_SLUGS } from "./bizfinInventory";
import { computeBizfinOps, BIZFIN_OPS_SLUGS } from "./bizfinOps";
import { computeBizfinPayroll, BIZFIN_PAYROLL_SLUGS } from "./bizfinPayroll";
import { computeBizfinSaas, BIZFIN_SAAS_SLUGS } from "./bizfinSaas";
import { computeBizfinMarketing, BIZFIN_MARKETING_SLUGS } from "./bizfinMarketing";
import { computeBizfinForecast, BIZFIN_FORECAST_SLUGS } from "./bizfinForecast";
import { computeBizfinIntl, BIZFIN_INTL_SLUGS } from "./bizfinIntl";
import { computeBizfinAdvanced, BIZFIN_ADVANCED_SLUGS } from "./bizfinAdvanced";
import { BUSINESS_FINANCE_SECTIONS } from "../business/business-finance-sections";

const ALL = [
  ...BIZFIN_PROFIT_SLUGS,
  ...BIZFIN_INVEST_SLUGS,
  ...BIZFIN_COST_SLUGS,
  ...BIZFIN_PRICING_SLUGS,
  ...BIZFIN_CASH_SLUGS,
  ...BIZFIN_RATIOS_SLUGS,
  ...BIZFIN_TAX_SLUGS,
  ...BIZFIN_INVENTORY_SLUGS,
  ...BIZFIN_OPS_SLUGS,
  ...BIZFIN_PAYROLL_SLUGS,
  ...BIZFIN_SAAS_SLUGS,
  ...BIZFIN_MARKETING_SLUGS,
  ...BIZFIN_FORECAST_SLUGS,
  ...BIZFIN_INTL_SLUGS,
  ...BIZFIN_ADVANCED_SLUGS,
];

describe("bizfin engines smoke", () => {
  it("covers all 117 live hub slugs", () => {
    const hubSlugs = BUSINESS_FINANCE_SECTIONS.flatMap((s) => s.calculators.map((c) => c.slug));
    expect(ALL.length).toBe(117);
    expect(new Set(ALL).size).toBe(117);
    expect(hubSlugs.length).toBe(117);
    expect(new Set(ALL)).toEqual(new Set(hubSlugs));
  });

  it("profit section ok", () => {
    for (const slug of BIZFIN_PROFIT_SLUGS) {
      const r = computeBizfinProfit(slug, {
        revenue: 100000,
        cogs: 40000,
        expenses: 70000,
        opex: 25000,
        interest: 3000,
        tax: 5000,
        depreciation: 8000,
        amortization: 0,
        variableCosts: 45000,
        profit: 18000,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("invest section ok", () => {
    for (const slug of BIZFIN_INVEST_SLUGS) {
      const r = computeBizfinInvest(slug, {
        cost: 100000,
        gain: 150000,
        years: 3,
        ratePct: 10,
        cf0: -100000,
        cf1: 40000,
        cf2: 50000,
        cf3: 60000,
        investment: 100000,
        annualCf: 25000,
        buy: 100,
        sell: 140,
        ebitda: 500000,
        multiple: 8,
        equityValue: 4000000,
        netDebt: 500000,
        cash: 200000,
        debt: 700000,
        marketCap: 4000000,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("cost section ok", () => {
    for (const slug of BIZFIN_COST_SLUGS) {
      const r = computeBizfinCost(slug, {
        cost: 80,
        markupPct: 25,
        marginPct: 20,
        sellingPrice: 100,
        fixedCosts: 50000,
        variablePerUnit: 15,
        pricePerUnit: 40,
        fixedA: 20000,
        fixedB: 15000,
        fixedC: 15000,
        units: 1000,
        variableTotal: 30000,
        overhead: 12000,
        beginningInventory: 10000,
        purchases: 80000,
        endingInventory: 15000,
        materials: 30000,
        labor: 20000,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("pricing section ok", () => {
    for (const slug of BIZFIN_PRICING_SLUGS) {
      const r = computeBizfinPricing(slug, {
        cost: 40,
        price: 60,
        originalPrice: 100,
        salePrice: 80,
        markupPct: 50,
        marginPct: 30,
        demandFactor: 1.1,
        wholesale: 50,
        retailMarginPct: 40,
        discountPct: 20,
        pctPriceChange: -10,
        pctQtyChange: 15,
        perceivedValue: 120,
        valueCapturePct: 50,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("cash section ok", () => {
    for (const slug of BIZFIN_CASH_SLUGS) {
      const r = computeBizfinCash(slug, {
        inflows: 120000,
        outflows: 95000,
        ocf: 80000,
        capex: 25000,
        netIncome: 50000,
        depreciation: 10000,
        wcChange: 5000,
        currentAssets: 180000,
        currentLiabilities: 90000,
        inventory: 40000,
        dio: 45,
        dso: 30,
        dpo: 25,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("ratios section ok", () => {
    for (const slug of BIZFIN_RATIOS_SLUGS) {
      const r = computeBizfinRatios(slug, {
        revenue: 1000000,
        grossProfit: 400000,
        netIncome: 120000,
        assets: 800000,
        equity: 500000,
        ebit: 180000,
        capitalEmployed: 700000,
        cogs: 600000,
        inventory: 100000,
        receivables: 80000,
        payables: 50000,
        debt: 200000,
        interest: 20000,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("tax section ok", () => {
    for (const slug of BIZFIN_TAX_SLUGS) {
      const r = computeBizfinTax(slug, {
        income: 1000000,
        taxRatePct: 25,
        amount: 11800,
        gstPct: 18,
        inclusive: 1,
        deductions: 150000,
        cost: 100000,
        salvage: 10000,
        lifeYears: 5,
        bookValue: 80000,
        dbRatePct: 40,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("inventory section ok", () => {
    for (const slug of BIZFIN_INVENTORY_SLUGS) {
      const r = computeBizfinInventory(slug, {
        units: 1000,
        unitCost: 50,
        holdingPct: 20,
        demand: 12000,
        orderCost: 100,
        holdingCost: 2,
        zScore: 1.65,
        demandStd: 40,
        leadTime: 5,
        avgDemand: 100,
        safetyStock: 50,
        cogs: 500000,
        avgInventory: 100000,
        days: 365,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("ops section ok", () => {
    for (const slug of BIZFIN_OPS_SLUGS) {
      const r = computeBizfinOps(slug, {
        machines: 4,
        hours: 160,
        ratePerHour: 50,
        output: 9000,
        capacity: 10000,
        workers: 10,
        wage: 25,
        usedHours: 140,
        availableHours: 160,
        downtimeHours: 8,
        costPerHour: 500,
        units: 1200,
        timeHours: 8,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("payroll section ok", () => {
    for (const slug of BIZFIN_PAYROLL_SLUGS) {
      const r = computeBizfinPayroll(slug, {
        employees: 25,
        salary: 50000,
        employerTaxPct: 20,
        benefits: 10000,
        basic: 40000,
        allowances: 35000,
        employerContrib: 10000,
        hours: 10,
        hourlyRate: 500,
        otMultiplier: 1.5,
        ctc: 100000,
        basicPct: 40,
        hraPct: 20,
        replacements: 5,
        costPerHire: 150000,
        lostProductivity: 200000,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("saas section ok", () => {
    for (const slug of BIZFIN_SAAS_SLUGS) {
      const r = computeBizfinSaas(slug, {
        expenses: 120000,
        revenue: 40000,
        cash: 1200000,
        burn: 80000,
        salesMarketing: 50000,
        newCustomers: 100,
        arpu: 100,
        grossMarginPct: 80,
        churnPct: 3,
        ltv: 2667,
        cac: 500,
        customers: 500,
        mrr: 24500,
        lostCustomers: 15,
        startCustomers: 500,
        startValue: 20000,
        endValue: 24500,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("marketing section ok", () => {
    for (const slug of BIZFIN_MARKETING_SLUGS) {
      const r = computeBizfinMarketing(slug, {
        conversions: 40,
        visitors: 2000,
        spend: 5000,
        leads: 100,
        acquisitions: 40,
        impressions: 500000,
        clicks: 250,
        startValue: 100000,
        endValue: 125000,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("forecast section ok", () => {
    for (const slug of BIZFIN_FORECAST_SLUGS) {
      const r = computeBizfinForecast(slug, {
        base: 1000000,
        growthPct: 12,
        years: 3,
        costs: 700000,
        costGrowthPct: 8,
        planned: 100000,
        actual: 108000,
        baseCase: 100000,
        bestCase: 150000,
        worstCase: 60000,
        fixedCosts: 50000,
        pricePerUnit: 40,
        variablePerUnit: 15,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("intl section ok", () => {
    for (const slug of BIZFIN_INTL_SLUGS) {
      const r = computeBizfinIntl(slug, {
        amount: 1000,
        rate: 83.5,
        cifValue: 50000,
        dutyPct: 10,
        otherFees: 1500,
        exportRevenue: 100000,
        exportCost: 70000,
        duties: 5000,
        present: 100000,
        inflationPct: 5,
        years: 10,
      });
      expect(r.ok, slug).toBe(true);
    }
  });

  it("advanced section ok", () => {
    for (const slug of BIZFIN_ADVANCED_SLUGS) {
      const r = computeBizfinAdvanced(slug, {
        recentProfit: 200000,
        growthPct: 10,
        years: 3,
        cost: 40,
        elasticity: 1.2,
        targetMarginPct: 35,
        currentPrice: 55,
        marginPct: 15,
        currentRatio: 1.8,
        debtToEquity: 0.6,
        revenueGrowthPct: 12,
        preMoney: 4000000,
        raise: 1000000,
        founderPct: 80,
        invest: 500000,
        exitValue: 20000000,
        ownershipPct: 10,
      });
      expect(r.ok, slug).toBe(true);
    }
  });
});
