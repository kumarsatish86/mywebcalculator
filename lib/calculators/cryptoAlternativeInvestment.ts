import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { annualReturn } from "./coreInvestment";

export type CryptoAltCurrencyCode = LoanCurrencyCode;

export const CRYPTO_ALT_URL = {
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
  F: "f",
  Q: "q",
} as const;

export function formatCryptoAltMoney(amount: number, currency: CryptoAltCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseCryptoAltSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(CRYPTO_ALT_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function cryptoProfit(params: {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  feePercent?: number;
}): {
  costBasis: number;
  proceeds: number;
  fees: number;
  profit: number;
  profitPercent: number;
} | { error: string } {
  if (params.buyPrice <= 0) return { error: "Buy price must be positive." };
  if (params.sellPrice < 0) return { error: "Sell price cannot be negative." };
  if (params.quantity <= 0) return { error: "Quantity must be positive." };
  const feePct = params.feePercent ?? 0;
  if (feePct < 0 || feePct > 100) return { error: "Fee % must be between 0 and 100." };

  const grossBuy = params.buyPrice * params.quantity;
  const grossSell = params.sellPrice * params.quantity;
  const fees = (grossBuy + grossSell) * (feePct / 100);
  const costBasis = grossBuy + grossBuy * (feePct / 100);
  const proceeds = grossSell - grossSell * (feePct / 100);
  const profit = proceeds - costBasis;
  return {
    costBasis,
    proceeds,
    fees,
    profit,
    profitPercent: (profit / costBasis) * 100,
  };
}

export function cryptoCagr(params: {
  initialValue: number;
  finalValue: number;
  years: number;
}): ReturnType<typeof annualReturn> {
  return annualReturn(params);
}

/** Compound staking rewards at APY for a holding period. */
export function stakingReward(params: {
  principal: number;
  apyPercent: number;
  years: number;
  compoundPerYear?: number;
}): {
  principal: number;
  rewards: number;
  endingBalance: number;
  effectiveYieldPercent: number;
} | { error: string } {
  if (params.principal <= 0) return { error: "Staked amount must be positive." };
  if (params.apyPercent < 0) return { error: "APY cannot be negative." };
  if (params.years <= 0) return { error: "Years must be positive." };
  const n = params.compoundPerYear ?? 365;
  if (n <= 0) return { error: "Compounds per year must be positive." };

  const endingBalance =
    params.principal * Math.pow(1 + params.apyPercent / 100 / n, n * params.years);
  const rewards = endingBalance - params.principal;
  return {
    principal: params.principal,
    rewards,
    endingBalance,
    effectiveYieldPercent: (rewards / params.principal) * 100,
  };
}

export function nftRoi(params: {
  mintOrBuyCost: number;
  sellPrice: number;
  gasAndFees?: number;
  marketplaceFeePercent?: number;
}): {
  totalCost: number;
  netProceeds: number;
  profit: number;
  roiPercent: number;
} | { error: string } {
  if (params.mintOrBuyCost < 0) return { error: "Buy/mint cost cannot be negative." };
  if (params.sellPrice < 0) return { error: "Sell price cannot be negative." };
  const gas = params.gasAndFees ?? 0;
  const mktFee = params.marketplaceFeePercent ?? 0;
  if (gas < 0) return { error: "Gas/fees cannot be negative." };
  if (mktFee < 0 || mktFee > 100) return { error: "Marketplace fee % must be 0–100." };

  const totalCost = params.mintOrBuyCost + gas;
  const netProceeds = params.sellPrice * (1 - mktFee / 100);
  const profit = netProceeds - totalCost;
  if (totalCost <= 0 && profit === 0) return { error: "Enter a cost or sale price." };
  const roiPercent = totalCost > 0 ? (profit / totalCost) * 100 : 0;
  return { totalCost, netProceeds, profit, roiPercent };
}

/** Gold: buy weight × price, optional making charges, hold with price appreciation. */
export function goldInvestment(params: {
  grams: number;
  buyPricePerGram: number;
  sellPricePerGram: number;
  makingChargePercent?: number;
  years?: number;
}): {
  buyCost: number;
  makingCharges: number;
  totalInvested: number;
  sellValue: number;
  profit: number;
  profitPercent: number;
  cagrPercent: number | null;
} | { error: string } {
  if (params.grams <= 0) return { error: "Grams must be positive." };
  if (params.buyPricePerGram <= 0) return { error: "Buy price per gram must be positive." };
  if (params.sellPricePerGram < 0) return { error: "Sell price cannot be negative." };
  const makingPct = params.makingChargePercent ?? 0;
  if (makingPct < 0) return { error: "Making charge % cannot be negative." };

  const buyCost = params.grams * params.buyPricePerGram;
  const makingCharges = buyCost * (makingPct / 100);
  const totalInvested = buyCost + makingCharges;
  const sellValue = params.grams * params.sellPricePerGram;
  const profit = sellValue - totalInvested;
  const profitPercent = (profit / totalInvested) * 100;
  let cagrPercent: number | null = null;
  if (params.years !== undefined && params.years > 0) {
    cagrPercent = (Math.pow(sellValue / totalInvested, 1 / params.years) - 1) * 100;
  }
  return {
    buyCost,
    makingCharges,
    totalInvested,
    sellValue,
    profit,
    profitPercent,
    cagrPercent,
  };
}

/** Real estate: appreciation + net rental income vs total invested. */
export function realEstateRoi(params: {
  purchasePrice: number;
  currentOrSaleValue: number;
  annualRent: number;
  annualExpenses: number;
  yearsHeld: number;
  closingCosts?: number;
}): {
  totalInvested: number;
  totalNetRent: number;
  equityGain: number;
  totalProfit: number;
  roiPercent: number;
  annualizedRoiPercent: number;
} | { error: string } {
  if (params.purchasePrice <= 0) return { error: "Purchase price must be positive." };
  if (params.currentOrSaleValue < 0) return { error: "Current/sale value cannot be negative." };
  if (params.yearsHeld <= 0) return { error: "Years held must be positive." };
  if (params.annualRent < 0 || params.annualExpenses < 0) {
    return { error: "Rent and expenses cannot be negative." };
  }
  const closing = params.closingCosts ?? 0;
  if (closing < 0) return { error: "Closing costs cannot be negative." };

  const totalInvested = params.purchasePrice + closing;
  const totalNetRent = (params.annualRent - params.annualExpenses) * params.yearsHeld;
  const equityGain = params.currentOrSaleValue - params.purchasePrice;
  const totalProfit = equityGain + totalNetRent - closing;
  const roiPercent = (totalProfit / totalInvested) * 100;
  const annualizedRoiPercent =
    (Math.pow((totalInvested + totalProfit) / totalInvested, 1 / params.yearsHeld) - 1) * 100;

  return {
    totalInvested,
    totalNetRent,
    equityGain,
    totalProfit,
    roiPercent,
    annualizedRoiPercent,
  };
}

export function rentalYield(params: {
  propertyValue: number;
  annualRent: number;
  annualExpenses?: number;
}): {
  grossYieldPercent: number;
  netYieldPercent: number;
  monthlyRent: number;
  netAnnualIncome: number;
} | { error: string } {
  if (params.propertyValue <= 0) return { error: "Property value must be positive." };
  if (params.annualRent < 0) return { error: "Annual rent cannot be negative." };
  const expenses = params.annualExpenses ?? 0;
  if (expenses < 0) return { error: "Expenses cannot be negative." };

  const netAnnualIncome = params.annualRent - expenses;
  return {
    grossYieldPercent: (params.annualRent / params.propertyValue) * 100,
    netYieldPercent: (netAnnualIncome / params.propertyValue) * 100,
    monthlyRent: params.annualRent / 12,
    netAnnualIncome,
  };
}
