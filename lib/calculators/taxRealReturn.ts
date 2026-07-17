import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { inflationAdjustedReturn, sipFutureValue } from "./coreInvestment";

export type TaxRealReturnCurrencyCode = LoanCurrencyCode;

export const TAX_REAL_RETURN_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  T: "t",
  Y: "y",
  I: "i",
  M: "m",
  G: "g",
  H: "h",
} as const;

export type CapGainRegime = "india-equity" | "global-flat";

/** India equity planning defaults (editable in UI). */
export const DEFAULT_INDIA_STCG = 20;
export const DEFAULT_INDIA_LTCG = 12.5;
export const DEFAULT_LTCG_EXEMPTION = 125000;
export const DEFAULT_80C_LIMIT = 150000;

export function formatTaxRealMoney(amount: number, currency: TaxRealReturnCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseTaxRealReturnSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(TAX_REAL_RETURN_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function capitalGainsTax(params: {
  buyValue: number;
  sellValue: number;
  holdingYears: number;
  regime: CapGainRegime;
  /** Used for india-equity */
  stcgRatePercent?: number;
  ltcgRatePercent?: number;
  ltcgExemption?: number;
  /** Used for global-flat */
  flatTaxRatePercent?: number;
  longTermYearsThreshold?: number;
}): {
  gain: number;
  isLongTerm: boolean;
  taxableGain: number;
  taxEstimate: number;
  netProceeds: number;
  effectiveTaxRatePercent: number;
  regimeLabel: string;
} | { error: string } {
  if (params.buyValue <= 0) return { error: "Buy / cost value must be positive." };
  if (params.sellValue < 0) return { error: "Sell value cannot be negative." };
  if (params.holdingYears < 0) return { error: "Holding years cannot be negative." };

  const gain = params.sellValue - params.buyValue;
  const threshold = params.longTermYearsThreshold ?? (params.regime === "india-equity" ? 1 : 1);
  const isLongTerm = params.holdingYears > threshold;

  let taxableGain = 0;
  let taxEstimate = 0;
  let regimeLabel = "";

  if (gain <= 0) {
    return {
      gain,
      isLongTerm,
      taxableGain: 0,
      taxEstimate: 0,
      netProceeds: params.sellValue - params.buyValue,
      effectiveTaxRatePercent: 0,
      regimeLabel: params.regime === "india-equity" ? "India equity (planning)" : "Global flat rate",
    };
  }

  if (params.regime === "india-equity") {
    regimeLabel = "India equity (planning)";
    const stcg = params.stcgRatePercent ?? DEFAULT_INDIA_STCG;
    const ltcg = params.ltcgRatePercent ?? DEFAULT_INDIA_LTCG;
    const exemption = params.ltcgExemption ?? DEFAULT_LTCG_EXEMPTION;
    if (isLongTerm) {
      taxableGain = Math.max(0, gain - exemption);
      taxEstimate = taxableGain * (ltcg / 100);
    } else {
      taxableGain = gain;
      taxEstimate = gain * (stcg / 100);
    }
  } else {
    regimeLabel = "Global flat rate";
    const rate = params.flatTaxRatePercent ?? 15;
    taxableGain = gain;
    taxEstimate = gain * (rate / 100);
  }

  return {
    gain,
    isLongTerm,
    taxableGain,
    taxEstimate,
    netProceeds: gain - taxEstimate,
    effectiveTaxRatePercent: (taxEstimate / gain) * 100,
    regimeLabel,
  };
}

/** Section 80C-style tax saving from eligible investment. */
export function taxSavingInvestment(params: {
  investmentAmount: number;
  marginalTaxRatePercent: number;
  annualLimit?: number;
}): {
  eligibleAmount: number;
  taxSaved: number;
  unusedLimit: number;
  netCostOfInvestment: number;
} | { error: string } {
  if (params.investmentAmount < 0) return { error: "Investment cannot be negative." };
  if (params.marginalTaxRatePercent < 0 || params.marginalTaxRatePercent > 100) {
    return { error: "Tax rate must be between 0 and 100." };
  }
  const limit = params.annualLimit ?? DEFAULT_80C_LIMIT;
  const eligibleAmount = Math.min(params.investmentAmount, limit);
  const taxSaved = eligibleAmount * (params.marginalTaxRatePercent / 100);
  return {
    eligibleAmount,
    taxSaved,
    unusedLimit: Math.max(0, limit - eligibleAmount),
    netCostOfInvestment: params.investmentAmount - taxSaved,
  };
}

/** ELSS: growth + optional 80C tax benefit on amount invested (capped). */
export function elssCalc(params: {
  monthlySip: number;
  years: number;
  expectedReturnPercent: number;
  marginalTaxRatePercent: number;
  /** Years of SIP that count toward 80C in first year approximation — use annual invest */
}): {
  totalInvested: number;
  maturityValue: number;
  gains: number;
  annualInvestFor80c: number;
  firstYearTaxSaved: number;
  lockInNote: string;
} | { error: string } {
  const sip = sipFutureValue({
    monthlyInvestment: params.monthlySip,
    annualRatePercent: params.expectedReturnPercent,
    years: params.years,
  });
  if ("error" in sip) return sip;

  const annualInvestFor80c = Math.min(params.monthlySip * 12, DEFAULT_80C_LIMIT);
  const firstYearTaxSaved = annualInvestFor80c * (params.marginalTaxRatePercent / 100);

  return {
    totalInvested: sip.totalInvested,
    maturityValue: sip.futureValue,
    gains: sip.gains,
    annualInvestFor80c,
    firstYearTaxSaved,
    lockInNote: "ELSS units typically lock in for 3 years from each purchase date.",
  };
}

export function afterTaxReturn(params: {
  preTaxReturnPercent: number;
  taxRatePercent: number;
}): {
  preTaxReturnPercent: number;
  taxRatePercent: number;
  afterTaxReturnPercent: number;
  taxDragPercent: number;
} | { error: string } {
  if (params.taxRatePercent < 0 || params.taxRatePercent > 100) {
    return { error: "Tax rate must be between 0 and 100." };
  }
  const afterTaxReturnPercent = params.preTaxReturnPercent * (1 - params.taxRatePercent / 100);
  return {
    preTaxReturnPercent: params.preTaxReturnPercent,
    taxRatePercent: params.taxRatePercent,
    afterTaxReturnPercent,
    taxDragPercent: params.preTaxReturnPercent - afterTaxReturnPercent,
  };
}

export function realRateOfReturn(params: {
  nominalReturnPercent: number;
  inflationPercent: number;
}): ReturnType<typeof inflationAdjustedReturn> {
  return inflationAdjustedReturn(params);
}

/** Compare wealth growth: nominal vs real purchasing power over years. */
export function inflationVsReturn(params: {
  principal: number;
  nominalReturnPercent: number;
  inflationPercent: number;
  years: number;
}): {
  principal: number;
  nominalFutureValue: number;
  realFutureValue: number;
  purchasingPowerLoss: number;
  realReturnPercent: number;
  nominalGain: number;
} | { error: string } {
  if (params.principal <= 0) return { error: "Principal must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };

  const real = inflationAdjustedReturn({
    nominalReturnPercent: params.nominalReturnPercent,
    inflationPercent: params.inflationPercent,
  });
  const nominalFutureValue =
    params.principal * Math.pow(1 + params.nominalReturnPercent / 100, params.years);
  const realFutureValue =
    params.principal * Math.pow(1 + real.realReturnPercent / 100, params.years);
  // Purchasing power of nominal FV in today's money
  const fvInTodayMoney =
    nominalFutureValue / Math.pow(1 + params.inflationPercent / 100, params.years);

  return {
    principal: params.principal,
    nominalFutureValue,
    realFutureValue,
    purchasingPowerLoss: nominalFutureValue - fvInTodayMoney,
    realReturnPercent: real.realReturnPercent,
    nominalGain: nominalFutureValue - params.principal,
  };
}
