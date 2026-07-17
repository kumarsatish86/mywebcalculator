import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { annualReturn } from "./coreInvestment";

export type StockMarketCurrencyCode = LoanCurrencyCode;

export const STOCK_MARKET_URL = {
  A: "a",
  B: "b",
  C: "c",
  D: "d",
  E: "e",
  F: "f",
  G: "g",
  H: "h",
  Q: "q",
  R: "r",
  Y: "y",
  P: "p",
  S: "s",
  T: "t",
} as const;

export function formatStockMoney(amount: number, currency: StockMarketCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseStockMarketSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(STOCK_MARKET_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function stockReturn(params: {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  dividendsPerShare?: number;
}): {
  invested: number;
  proceeds: number;
  dividendIncome: number;
  absoluteProfit: number;
  returnPercent: number;
} | { error: string } {
  if (params.buyPrice <= 0) return { error: "Buy price must be positive." };
  if (params.sellPrice < 0) return { error: "Sell price cannot be negative." };
  if (params.quantity <= 0) return { error: "Quantity must be positive." };
  const div = params.dividendsPerShare ?? 0;
  if (div < 0) return { error: "Dividend per share cannot be negative." };
  const invested = params.buyPrice * params.quantity;
  const proceeds = params.sellPrice * params.quantity;
  const dividendIncome = div * params.quantity;
  const absoluteProfit = proceeds + dividendIncome - invested;
  return {
    invested,
    proceeds,
    dividendIncome,
    absoluteProfit,
    returnPercent: (absoluteProfit / invested) * 100,
  };
}

export function stockCagr(params: {
  initialValue: number;
  finalValue: number;
  years: number;
}): ReturnType<typeof annualReturn> {
  return annualReturn(params);
}

export function dividendYield(params: {
  annualDividendPerShare: number;
  sharePrice: number;
}): {
  annualDividendPerShare: number;
  sharePrice: number;
  yieldPercent: number;
} | { error: string } {
  if (params.sharePrice <= 0) return { error: "Share price must be positive." };
  if (params.annualDividendPerShare < 0) return { error: "Dividend cannot be negative." };
  return {
    annualDividendPerShare: params.annualDividendPerShare,
    sharePrice: params.sharePrice,
    yieldPercent: (params.annualDividendPerShare / params.sharePrice) * 100,
  };
}

/** Growth of shares via DRIP: dividends reinvested at assumed share price growth. */
export function dividendReinvestment(params: {
  initialShares: number;
  sharePrice: number;
  annualDividendPerShare: number;
  years: number;
  priceGrowthPercent: number;
}): {
  endingShares: number;
  endingValue: number;
  dividendsReinvested: number;
  totalReturnPercent: number;
} | { error: string } {
  if (params.initialShares <= 0) return { error: "Initial shares must be positive." };
  if (params.sharePrice <= 0) return { error: "Share price must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  if (params.annualDividendPerShare < 0) return { error: "Dividend cannot be negative." };

  let shares = params.initialShares;
  let price = params.sharePrice;
  let dividendsReinvested = 0;
  const startValue = params.initialShares * params.sharePrice;
  const g = params.priceGrowthPercent / 100;

  for (let y = 0; y < params.years; y += 1) {
    const divCash = shares * params.annualDividendPerShare;
    dividendsReinvested += divCash;
    if (price > 0) shares += divCash / price;
    price *= 1 + g;
  }

  const endingValue = shares * price;
  return {
    endingShares: shares,
    endingValue,
    dividendsReinvested,
    totalReturnPercent: ((endingValue - startValue) / startValue) * 100,
  };
}

export function stockAverage(params: {
  qty1: number;
  price1: number;
  qty2: number;
  price2: number;
}): {
  totalShares: number;
  totalCost: number;
  averagePrice: number;
} | { error: string } {
  if (params.qty1 <= 0 || params.qty2 <= 0) return { error: "Quantities must be positive." };
  if (params.price1 <= 0 || params.price2 <= 0) return { error: "Prices must be positive." };
  const totalShares = params.qty1 + params.qty2;
  const totalCost = params.qty1 * params.price1 + params.qty2 * params.price2;
  return {
    totalShares,
    totalCost,
    averagePrice: totalCost / totalShares,
  };
}

export function intradayPnL(params: {
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  brokeragePercent?: number;
  otherCharges?: number;
}): {
  grossPnL: number;
  totalCharges: number;
  netPnL: number;
  returnPercent: number;
} | { error: string } {
  if (params.buyPrice <= 0) return { error: "Buy price must be positive." };
  if (params.sellPrice < 0) return { error: "Sell price cannot be negative." };
  if (params.quantity <= 0) return { error: "Quantity must be positive." };
  const turnover = (params.buyPrice + params.sellPrice) * params.quantity;
  const brokeragePct = params.brokeragePercent ?? 0.03;
  const brokerage = turnover * (brokeragePct / 100);
  const other = params.otherCharges ?? 0;
  const totalCharges = brokerage + other;
  const grossPnL = (params.sellPrice - params.buyPrice) * params.quantity;
  const netPnL = grossPnL - totalCharges;
  const invested = params.buyPrice * params.quantity;
  return {
    grossPnL,
    totalCharges,
    netPnL,
    returnPercent: invested > 0 ? (netPnL / invested) * 100 : 0,
  };
}

/** Equity delivery-style brokerage estimate (buy + sell). */
export function brokerageCalc(params: {
  buyValue: number;
  sellValue: number;
  brokeragePercent: number;
  flatFeePerSide?: number;
  sttPercent?: number;
  exchangePercent?: number;
  gstPercent?: number;
}): {
  brokerage: number;
  stt: number;
  exchange: number;
  gst: number;
  totalCharges: number;
  netProceeds: number;
} | { error: string } {
  if (params.buyValue < 0 || params.sellValue < 0) return { error: "Trade values cannot be negative." };
  const flat = params.flatFeePerSide ?? 0;
  const brokerage =
    params.buyValue * (params.brokeragePercent / 100) +
    params.sellValue * (params.brokeragePercent / 100) +
    flat * 2;
  const sttPct = params.sttPercent ?? 0.1;
  const exchPct = params.exchangePercent ?? 0.00345;
  const gstPct = params.gstPercent ?? 18;
  const stt = params.sellValue * (sttPct / 100);
  const exchange = (params.buyValue + params.sellValue) * (exchPct / 100);
  const gst = (brokerage + exchange) * (gstPct / 100);
  const totalCharges = brokerage + stt + exchange + gst;
  return {
    brokerage,
    stt,
    exchange,
    gst,
    totalCharges,
    netProceeds: params.sellValue - params.buyValue - totalCharges,
  };
}

/** Equity capital gains: LTCG > 1 year (India planning: 12.5% above exemption), STCG otherwise. */
export function capitalGainEquity(params: {
  buyValue: number;
  sellValue: number;
  holdingYears: number;
  ltcgRatePercent?: number;
  stcgRatePercent?: number;
  ltcgExemption?: number;
}): {
  gain: number;
  isLongTerm: boolean;
  taxableGain: number;
  taxEstimate: number;
  netAfterTax: number;
} | { error: string } {
  if (params.buyValue <= 0) return { error: "Buy value must be positive." };
  if (params.sellValue < 0) return { error: "Sell value cannot be negative." };
  if (params.holdingYears < 0) return { error: "Holding period cannot be negative." };
  const gain = params.sellValue - params.buyValue;
  const isLongTerm = params.holdingYears > 1;
  const ltcgRate = params.ltcgRatePercent ?? 12.5;
  const stcgRate = params.stcgRatePercent ?? 20;
  const exemption = params.ltcgExemption ?? 125000;
  let taxableGain = 0;
  let taxEstimate = 0;
  if (gain > 0) {
    if (isLongTerm) {
      taxableGain = Math.max(0, gain - exemption);
      taxEstimate = taxableGain * (ltcgRate / 100);
    } else {
      taxableGain = gain;
      taxEstimate = gain * (stcgRate / 100);
    }
  }
  return {
    gain,
    isLongTerm,
    taxableGain,
    taxEstimate,
    netAfterTax: gain - taxEstimate,
  };
}

export function portfolioReturn(params: {
  valueA: number;
  returnAPercent: number;
  valueB: number;
  returnBPercent: number;
  valueC?: number;
  returnCPercent?: number;
}): {
  totalValue: number;
  weightedReturnPercent: number;
  endingValue: number;
} | { error: string } {
  const holdings = [
    { value: params.valueA, ret: params.returnAPercent },
    { value: params.valueB, ret: params.returnBPercent },
  ];
  if (params.valueC !== undefined && params.valueC > 0) {
    holdings.push({ value: params.valueC, ret: params.returnCPercent ?? 0 });
  }
  if (holdings.some((h) => h.value < 0)) return { error: "Values cannot be negative." };
  const totalValue = holdings.reduce((s, h) => s + h.value, 0);
  if (totalValue <= 0) return { error: "Total portfolio value must be positive." };
  const weightedReturnPercent = holdings.reduce((s, h) => s + (h.value / totalValue) * h.ret, 0);
  return {
    totalValue,
    weightedReturnPercent,
    endingValue: totalValue * (1 + weightedReturnPercent / 100),
  };
}

/** Simple risk–return: Sharpe-like = (return − riskFree) / volatility */
export function riskVsReturn(params: {
  expectedReturnPercent: number;
  riskFreePercent: number;
  volatilityPercent: number;
}): {
  excessReturnPercent: number;
  sharpeLike: number;
  verdict: "attractive" | "fair" | "unfavourable";
} | { error: string } {
  if (params.volatilityPercent <= 0) return { error: "Volatility (risk %) must be positive." };
  const excessReturnPercent = params.expectedReturnPercent - params.riskFreePercent;
  const sharpeLike = excessReturnPercent / params.volatilityPercent;
  let verdict: "attractive" | "fair" | "unfavourable" = "fair";
  if (sharpeLike >= 0.5) verdict = "attractive";
  else if (sharpeLike < 0.2) verdict = "unfavourable";
  return { excessReturnPercent, sharpeLike, verdict };
}
