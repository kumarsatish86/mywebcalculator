"use client";

import type { CurBasicSlug } from "@/lib/calculators/curBasic";
import type { CurAdvancedSlug } from "@/lib/calculators/curAdvanced";
import type { CurForexSlug } from "@/lib/calculators/curForex";
import type { CurCryptoSlug } from "@/lib/calculators/curCrypto";
import type { CurBankingSlug } from "@/lib/calculators/curBanking";
import type { CurTravelSlug } from "@/lib/calculators/curTravel";
import type { CurBusinessSlug } from "@/lib/calculators/curBusiness";
import type { CurInflationSlug } from "@/lib/calculators/curInflation";
import type { CurSmartSlug } from "@/lib/calculators/curSmart";
import type { CurTimeSlug } from "@/lib/calculators/curTime";
import type { CurMicroSlug } from "@/lib/calculators/curMicro";
import { CurBasicCalculatorHost } from "./CurBasicCalculatorHost";
import { CurAdvancedCalculatorHost } from "./CurAdvancedCalculatorHost";
import { CurForexCalculatorHost } from "./CurForexCalculatorHost";
import { CurCryptoCalculatorHost } from "./CurCryptoCalculatorHost";
import { CurBankingCalculatorHost } from "./CurBankingCalculatorHost";
import { CurTravelCalculatorHost } from "./CurTravelCalculatorHost";
import { CurBusinessCalculatorHost } from "./CurBusinessCalculatorHost";
import { CurInflationCalculatorHost } from "./CurInflationCalculatorHost";
import { CurSmartCalculatorHost } from "./CurSmartCalculatorHost";
import { CurTimeCalculatorHost } from "./CurTimeCalculatorHost";
import { CurMicroCalculatorHost } from "./CurMicroCalculatorHost";

const BASIC = new Set<string>([
  "cur-currency-converter-global",
  "cur-usd-to-inr-converter",
  "cur-inr-to-usd-converter",
  "cur-eur-to-usd-converter",
  "cur-gbp-to-inr-converter",
  "cur-aed-to-inr-converter",
  "cur-sgd-to-inr-converter",
  "cur-cad-to-inr-converter",
  "cur-aud-to-inr-converter",
  "cur-crypto-to-fiat-converter",
] satisfies CurBasicSlug[]);

const ADVANCED = new Set<string>([
  "cur-multi-currency-converter",
  "cur-bulk-currency-converter-csv",
  "cur-reverse-currency-calculator",
  "cur-currency-rate-comparison-tool",
  "cur-currency-conversion-with-fees",
  "cur-currency-converter-historical-rates",
] satisfies CurAdvancedSlug[]);

const FOREX = new Set<string>([
  "cur-forex-profit-calculator",
  "cur-forex-lot-size-calculator",
  "cur-pip-value-calculator",
  "cur-margin-calculator-forex",
  "cur-leverage-calculator",
  "cur-risk-reward-ratio-calculator",
  "cur-stop-loss-calculator",
  "cur-swap-calculator",
  "cur-position-size-calculator",
] satisfies CurForexSlug[]);

const CRYPTO = new Set<string>([
  "cur-bitcoin-to-inr-calculator",
  "cur-ethereum-to-usd-calculator",
  "cur-crypto-profit-calculator",
  "cur-crypto-mining-calculator",
  "cur-crypto-staking-calculator",
  "cur-crypto-tax-calculator",
  "cur-crypto-portfolio-calculator",
  "cur-crypto-roi-calculator",
  "cur-ethereum-gas-fee-calculator",
] satisfies CurCryptoSlug[]);

const BANKING = new Set<string>([
  "cur-international-money-transfer-calculator",
  "cur-remittance-calculator-india",
  "cur-wire-transfer-fee-calculator",
  "cur-paypal-fee-calculator",
  "cur-stripe-fee-calculator",
  "cur-currency-conversion-fee-calculator",
  "cur-bank-exchange-rate-calculator",
] satisfies CurBankingSlug[]);

const TRAVEL = new Set<string>([
  "cur-travel-currency-calculator",
  "cur-foreign-trip-budget-calculator",
  "cur-airport-vs-bank-exchange-calculator",
  "cur-travel-expense-split-calculator",
  "cur-daily-travel-budget-calculator",
] satisfies CurTravelSlug[]);

const BUSINESS = new Set<string>([
  "cur-import-export-cost-calculator",
  "cur-currency-pricing-calculator",
  "cur-cross-border-pricing-calculator",
  "cur-shopify-currency-converter-tool",
  "cur-international-pricing-margin-calculator",
] satisfies CurBusinessSlug[]);

const INFLATION = new Set<string>([
  "cur-inflation-calculator-currency-value",
  "cur-purchasing-power-calculator",
  "cur-historical-currency-value-calculator",
  "cur-cost-of-living-comparison-tool",
] satisfies CurInflationSlug[]);

const SMART = new Set<string>([
  "cur-ai-currency-prediction-tool",
  "cur-ai-forex-advisor",
  "cur-ai-travel-budget-planner",
  "cur-ai-investment-currency-optimizer",
] satisfies CurSmartSlug[]);

const TIME = new Set<string>([
  "cur-currency-rate-history-chart",
  "cur-currency-trend-analyzer",
  "cur-best-time-to-exchange-calculator",
  "cur-currency-volatility-calculator",
] satisfies CurTimeSlug[]);

const MICRO = new Set<string>([
  "cur-usd-to-inr-today-calculator",
  "cur-best-exchange-rate-india-calculator",
  "cur-send-money-abroad-india-calculator",
  "cur-dollar-rate-india-calculator",
  "cur-rupee-depreciation-calculator",
  "cur-currency-converter-offline-logic-tool",
] satisfies CurMicroSlug[]);

export function CurrencyCalculatorRouter({ slug }: { slug: string }) {
  if (BASIC.has(slug)) return <CurBasicCalculatorHost slug={slug} />;
  if (ADVANCED.has(slug)) return <CurAdvancedCalculatorHost slug={slug} />;
  if (FOREX.has(slug)) return <CurForexCalculatorHost slug={slug} />;
  if (CRYPTO.has(slug)) return <CurCryptoCalculatorHost slug={slug} />;
  if (BANKING.has(slug)) return <CurBankingCalculatorHost slug={slug} />;
  if (TRAVEL.has(slug)) return <CurTravelCalculatorHost slug={slug} />;
  if (BUSINESS.has(slug)) return <CurBusinessCalculatorHost slug={slug} />;
  if (INFLATION.has(slug)) return <CurInflationCalculatorHost slug={slug} />;
  if (SMART.has(slug)) return <CurSmartCalculatorHost slug={slug} />;
  if (TIME.has(slug)) return <CurTimeCalculatorHost slug={slug} />;
  if (MICRO.has(slug)) return <CurMicroCalculatorHost slug={slug} />;
  return <CurBasicCalculatorHost slug={slug} />;
}
