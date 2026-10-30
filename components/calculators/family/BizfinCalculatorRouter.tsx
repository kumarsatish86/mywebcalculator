"use client";

import type { BizfinProfitSlug } from "@/lib/calculators/bizfinProfit";
import type { BizfinInvestSlug } from "@/lib/calculators/bizfinInvest";
import type { BizfinCostSlug } from "@/lib/calculators/bizfinCost";
import type { BizfinPricingSlug } from "@/lib/calculators/bizfinPricing";
import type { BizfinCashSlug } from "@/lib/calculators/bizfinCash";
import type { BizfinRatiosSlug } from "@/lib/calculators/bizfinRatios";
import type { BizfinTaxSlug } from "@/lib/calculators/bizfinTax";
import type { BizfinInventorySlug } from "@/lib/calculators/bizfinInventory";
import type { BizfinOpsSlug } from "@/lib/calculators/bizfinOps";
import type { BizfinPayrollSlug } from "@/lib/calculators/bizfinPayroll";
import type { BizfinSaasSlug } from "@/lib/calculators/bizfinSaas";
import type { BizfinMarketingSlug } from "@/lib/calculators/bizfinMarketing";
import type { BizfinForecastSlug } from "@/lib/calculators/bizfinForecast";
import type { BizfinIntlSlug } from "@/lib/calculators/bizfinIntl";
import type { BizfinAdvancedSlug } from "@/lib/calculators/bizfinAdvanced";
import { BizfinProfitCalculatorHost } from "./BizfinProfitCalculatorHost";
import { BizfinInvestCalculatorHost } from "./BizfinInvestCalculatorHost";
import { BizfinCostCalculatorHost } from "./BizfinCostCalculatorHost";
import { BizfinPricingCalculatorHost } from "./BizfinPricingCalculatorHost";
import { BizfinCashCalculatorHost } from "./BizfinCashCalculatorHost";
import { BizfinRatiosCalculatorHost } from "./BizfinRatiosCalculatorHost";
import { BizfinTaxCalculatorHost } from "./BizfinTaxCalculatorHost";
import { BizfinInventoryCalculatorHost } from "./BizfinInventoryCalculatorHost";
import { BizfinOpsCalculatorHost } from "./BizfinOpsCalculatorHost";
import { BizfinPayrollCalculatorHost } from "./BizfinPayrollCalculatorHost";
import { BizfinSaasCalculatorHost } from "./BizfinSaasCalculatorHost";
import { BizfinMarketingCalculatorHost } from "./BizfinMarketingCalculatorHost";
import { BizfinForecastCalculatorHost } from "./BizfinForecastCalculatorHost";
import { BizfinIntlCalculatorHost } from "./BizfinIntlCalculatorHost";
import { BizfinAdvancedCalculatorHost } from "./BizfinAdvancedCalculatorHost";

const PROFIT = new Set<string>([
  "bizfin-profit-calculator",
  "bizfin-gross-profit-calculator",
  "bizfin-net-profit-calculator",
  "bizfin-operating-profit-calculator",
  "bizfin-profit-margin-calculator",
  "bizfin-gross-margin-calculator",
  "bizfin-net-margin-calculator",
  "bizfin-contribution-margin-calculator",
  "bizfin-ebitda-calculator",
  "bizfin-ebit-calculator",
] satisfies BizfinProfitSlug[]);

const INVEST = new Set<string>([
  "bizfin-roi-calculator",
  "bizfin-annualized-roi-calculator",
  "bizfin-irr-calculator",
  "bizfin-npv-calculator",
  "bizfin-payback-period-calculator",
  "bizfin-discounted-payback-period-calculator",
  "bizfin-capital-gain-calculator",
  "bizfin-business-valuation-calculator",
  "bizfin-equity-value-calculator",
  "bizfin-enterprise-value-calculator",
] satisfies BizfinInvestSlug[]);

const COST = new Set<string>([
  "bizfin-cost-price-calculator",
  "bizfin-selling-price-calculator",
  "bizfin-break-even-calculator",
  "bizfin-fixed-cost-calculator",
  "bizfin-variable-cost-calculator",
  "bizfin-total-cost-calculator",
  "bizfin-unit-cost-calculator",
  "bizfin-overhead-cost-calculator",
  "bizfin-cogs-calculator",
  "bizfin-production-cost-calculator",
] satisfies BizfinCostSlug[]);

const PRICING = new Set<string>([
  "bizfin-markup-calculator",
  "bizfin-markdown-calculator",
  "bizfin-pricing-strategy-calculator",
  "bizfin-dynamic-pricing-calculator",
  "bizfin-wholesale-price-calculator",
  "bizfin-retail-price-calculator",
  "bizfin-discount-pricing-calculator",
  "bizfin-price-elasticity-calculator",
  "bizfin-value-based-pricing-calculator",
] satisfies BizfinPricingSlug[]);

const CASH = new Set<string>([
  "bizfin-cash-flow-calculator",
  "bizfin-free-cash-flow-calculator",
  "bizfin-operating-cash-flow-calculator",
  "bizfin-working-capital-calculator",
  "bizfin-cash-conversion-cycle-calculator",
  "bizfin-liquidity-ratio-calculator",
  "bizfin-current-ratio-calculator",
  "bizfin-quick-ratio-calculator",
] satisfies BizfinCashSlug[]);

const RATIOS = new Set<string>([
  "bizfin-profitability-ratios-calculator",
  "bizfin-roa-calculator",
  "bizfin-roe-calculator",
  "bizfin-roce-calculator",
  "bizfin-inventory-turnover-ratio-calculator",
  "bizfin-asset-turnover-calculator",
  "bizfin-accounts-receivable-turnover-calculator",
  "bizfin-accounts-payable-turnover-calculator",
  "bizfin-debt-to-equity-calculator",
  "bizfin-debt-ratio-calculator",
  "bizfin-interest-coverage-ratio-calculator",
] satisfies BizfinRatiosSlug[]);

const TAX = new Set<string>([
  "bizfin-corporate-tax-calculator",
  "bizfin-gst-calculator-india",
  "bizfin-vat-calculator",
  "bizfin-sales-tax-calculator",
  "bizfin-taxable-income-calculator",
  "bizfin-depreciation-calculator",
  "bizfin-straight-line-depreciation-calculator",
  "bizfin-declining-balance-depreciation-calculator",
] satisfies BizfinTaxSlug[]);

const INVENTORY = new Set<string>([
  "bizfin-inventory-cost-calculator",
  "bizfin-eoq-calculator",
  "bizfin-safety-stock-calculator",
  "bizfin-reorder-point-calculator",
  "bizfin-inventory-turnover-operations-calculator",
  "bizfin-holding-cost-calculator",
  "bizfin-order-quantity-calculator",
] satisfies BizfinInventorySlug[]);

const OPS = new Set<string>([
  "bizfin-production-capacity-calculator",
  "bizfin-machine-efficiency-calculator",
  "bizfin-labor-cost-calculator",
  "bizfin-utilization-rate-calculator",
  "bizfin-downtime-cost-calculator",
  "bizfin-throughput-calculator",
] satisfies BizfinOpsSlug[]);

const PAYROLL = new Set<string>([
  "bizfin-payroll-calculator",
  "bizfin-employee-cost-calculator",
  "bizfin-ctc-calculator",
  "bizfin-overtime-pay-calculator",
  "bizfin-salary-breakup-calculator",
  "bizfin-attrition-cost-calculator",
] satisfies BizfinPayrollSlug[]);

const SAAS = new Set<string>([
  "bizfin-burn-rate-calculator",
  "bizfin-runway-calculator",
  "bizfin-cac-calculator",
  "bizfin-ltv-calculator",
  "bizfin-ltv-cac-ratio-calculator",
  "bizfin-mrr-calculator",
  "bizfin-arr-calculator",
  "bizfin-churn-rate-calculator",
  "bizfin-saas-growth-rate-calculator",
] satisfies BizfinSaasSlug[]);

const MARKETING = new Set<string>([
  "bizfin-conversion-rate-calculator",
  "bizfin-cpl-calculator",
  "bizfin-cpa-calculator",
  "bizfin-cpm-calculator",
  "bizfin-cpc-calculator",
  "bizfin-sales-growth-calculator",
  "bizfin-revenue-growth-calculator",
] satisfies BizfinMarketingSlug[]);

const FORECAST = new Set<string>([
  "bizfin-revenue-forecast-calculator",
  "bizfin-profit-forecast-calculator",
  "bizfin-budget-calculator",
  "bizfin-scenario-analysis-calculator",
  "bizfin-break-even-analysis-tool",
  "bizfin-financial-projection-calculator",
] satisfies BizfinForecastSlug[]);

const INTL = new Set<string>([
  "bizfin-currency-exchange-calculator",
  "bizfin-import-duty-calculator",
  "bizfin-export-profit-calculator",
  "bizfin-inflation-calculator",
  "bizfin-purchasing-power-calculator",
] satisfies BizfinIntlSlug[]);

const ADVANCED = new Set<string>([
  "bizfin-ai-business-profit-predictor",
  "bizfin-ai-pricing-optimizer",
  "bizfin-business-health-score-calculator",
  "bizfin-startup-funding-dilution-calculator",
  "bizfin-investor-return-calculator",
] satisfies BizfinAdvancedSlug[]);

export function BizfinCalculatorRouter({ slug }: { slug: string }) {
  if (PROFIT.has(slug)) return <BizfinProfitCalculatorHost slug={slug} />;
  if (INVEST.has(slug)) return <BizfinInvestCalculatorHost slug={slug} />;
  if (COST.has(slug)) return <BizfinCostCalculatorHost slug={slug} />;
  if (PRICING.has(slug)) return <BizfinPricingCalculatorHost slug={slug} />;
  if (CASH.has(slug)) return <BizfinCashCalculatorHost slug={slug} />;
  if (RATIOS.has(slug)) return <BizfinRatiosCalculatorHost slug={slug} />;
  if (TAX.has(slug)) return <BizfinTaxCalculatorHost slug={slug} />;
  if (INVENTORY.has(slug)) return <BizfinInventoryCalculatorHost slug={slug} />;
  if (OPS.has(slug)) return <BizfinOpsCalculatorHost slug={slug} />;
  if (PAYROLL.has(slug)) return <BizfinPayrollCalculatorHost slug={slug} />;
  if (SAAS.has(slug)) return <BizfinSaasCalculatorHost slug={slug} />;
  if (MARKETING.has(slug)) return <BizfinMarketingCalculatorHost slug={slug} />;
  if (FORECAST.has(slug)) return <BizfinForecastCalculatorHost slug={slug} />;
  if (INTL.has(slug)) return <BizfinIntlCalculatorHost slug={slug} />;
  if (ADVANCED.has(slug)) return <BizfinAdvancedCalculatorHost slug={slug} />;
  return <BizfinProfitCalculatorHost slug={slug} />;
}
