/** Cryptocurrency calculators — illustrative price teaching estimates. */
import { ILLUSTRATIVE, nonNeg, pos } from "./curHelpers";

export type CurCryptoSlug =
  | "cur-bitcoin-to-inr-calculator"
  | "cur-ethereum-to-usd-calculator"
  | "cur-crypto-profit-calculator"
  | "cur-crypto-mining-calculator"
  | "cur-crypto-staking-calculator"
  | "cur-crypto-tax-calculator"
  | "cur-crypto-portfolio-calculator"
  | "cur-crypto-roi-calculator"
  | "cur-ethereum-gas-fee-calculator";

export const ALL_CUR_CRYPTO_SLUGS: CurCryptoSlug[] = [
  "cur-bitcoin-to-inr-calculator",
  "cur-ethereum-to-usd-calculator",
  "cur-crypto-profit-calculator",
  "cur-crypto-mining-calculator",
  "cur-crypto-staking-calculator",
  "cur-crypto-tax-calculator",
  "cur-crypto-portfolio-calculator",
  "cur-crypto-roi-calculator",
  "cur-ethereum-gas-fee-calculator",
];

export type CurCryptoInput = {
  amount?: number;
  rate?: number;
  buyPrice?: number;
  sellPrice?: number;
  feePct?: number;
  hashrate?: number;
  rewardPerDay?: number;
  powerCost?: number;
  days?: number;
  apyPct?: number;
  gain?: number;
  taxPct?: number;
  holdingA?: number;
  priceA?: number;
  holdingB?: number;
  priceB?: number;
  cost?: number;
  current?: number;
  gasUnits?: number;
  gwei?: number;
  ethPrice?: number;
};

export type CurCryptoResult =
  | { ok: false; error: string }
  | {
      ok: true;
      converted?: number;
      profit?: number;
      netMining?: number;
      stakingYield?: number;
      tax?: number;
      portfolio?: number;
      roiPct?: number;
      gasFee?: number;
      note: string;
    };

export function computeCurCrypto(slug: CurCryptoSlug, input: CurCryptoInput): CurCryptoResult {
  switch (slug) {
    case "cur-bitcoin-to-inr-calculator": {
      const amt = pos(input.amount, "BTC amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const rate = pos(input.rate ?? ILLUSTRATIVE.BTC_INR, "BTC/INR");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return {
        ok: true,
        converted: amt * rate,
        note: "Illustrative BTC→INR (example ~55L). Not live market data.",
      };
    }
    case "cur-ethereum-to-usd-calculator": {
      const amt = pos(input.amount, "ETH amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const rate = pos(input.rate ?? ILLUSTRATIVE.ETH_USD, "ETH/USD");
      if (typeof rate !== "number") return { ok: false, error: rate.error };
      return {
        ok: true,
        converted: amt * rate,
        note: "Illustrative ETH→USD (example 3200). Not live market data.",
      };
    }
    case "cur-crypto-profit-calculator": {
      const amt = pos(input.amount, "Units");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const buy = pos(input.buyPrice, "Buy price");
      if (typeof buy !== "number") return { ok: false, error: buy.error };
      const sell = pos(input.sellPrice, "Sell price");
      if (typeof sell !== "number") return { ok: false, error: sell.error };
      const feePct = nonNeg(input.feePct ?? 0, "Fee %");
      if (typeof feePct !== "number") return { ok: false, error: feePct.error };
      const gross = (sell - buy) * amt;
      const fees = (buy + sell) * amt * (feePct / 100);
      return { ok: true, profit: gross - fees, note: "Profit ≈ (sell−buy)×units − round-trip fees." };
    }
    case "cur-crypto-mining-calculator": {
      const reward = pos(input.rewardPerDay, "Daily reward value");
      if (typeof reward !== "number") return { ok: false, error: reward.error };
      const days = pos(input.days ?? 30, "Days");
      if (typeof days !== "number") return { ok: false, error: days.error };
      const power = nonNeg(input.powerCost ?? 0, "Daily power cost");
      if (typeof power !== "number") return { ok: false, error: power.error };
      const scale = input.hashrate && input.hashrate > 0 ? input.hashrate : 1;
      return {
        ok: true,
        netMining: (reward * scale - power) * days,
        note: "Net ≈ (reward×hash scale − power)×days. Teaching estimate.",
      };
    }
    case "cur-crypto-staking-calculator": {
      const amt = pos(input.amount, "Staked amount");
      if (typeof amt !== "number") return { ok: false, error: amt.error };
      const apy = nonNeg(input.apyPct ?? 0, "APY %");
      if (typeof apy !== "number") return { ok: false, error: apy.error };
      const days = pos(input.days ?? 365, "Days");
      if (typeof days !== "number") return { ok: false, error: days.error };
      return {
        ok: true,
        stakingYield: amt * (apy / 100) * (days / 365),
        note: "Yield ≈ stake × APY × days/365 (simple, not compounded).",
      };
    }
    case "cur-crypto-tax-calculator": {
      const gain = nonNeg(input.gain ?? input.amount, "Taxable gain");
      if (typeof gain !== "number") return { ok: false, error: gain.error };
      const taxPct = nonNeg(input.taxPct ?? 0, "Tax %");
      if (typeof taxPct !== "number") return { ok: false, error: taxPct.error };
      return { ok: true, tax: gain * (taxPct / 100), note: "Tax ≈ gain × tax%. Not tax advice." };
    }
    case "cur-crypto-portfolio-calculator": {
      const a = nonNeg(input.holdingA ?? 0, "Holding A");
      if (typeof a !== "number") return { ok: false, error: a.error };
      const pa = nonNeg(input.priceA ?? 0, "Price A");
      if (typeof pa !== "number") return { ok: false, error: pa.error };
      const b = nonNeg(input.holdingB ?? 0, "Holding B");
      if (typeof b !== "number") return { ok: false, error: b.error };
      const pb = nonNeg(input.priceB ?? 0, "Price B");
      if (typeof pb !== "number") return { ok: false, error: pb.error };
      return {
        ok: true,
        portfolio: a * pa + b * pb,
        note: "Portfolio = Σ(holding × illustrative price).",
      };
    }
    case "cur-crypto-roi-calculator": {
      const cost = pos(input.cost, "Cost basis");
      if (typeof cost !== "number") return { ok: false, error: cost.error };
      const current = pos(input.current ?? input.amount, "Current value");
      if (typeof current !== "number") return { ok: false, error: current.error };
      return {
        ok: true,
        roiPct: ((current - cost) / cost) * 100,
        profit: current - cost,
        note: "ROI% = (current − cost) ÷ cost × 100.",
      };
    }
    case "cur-ethereum-gas-fee-calculator": {
      const gas = pos(input.gasUnits, "Gas units");
      if (typeof gas !== "number") return { ok: false, error: gas.error };
      const gwei = pos(input.gwei, "Gwei");
      if (typeof gwei !== "number") return { ok: false, error: gwei.error };
      const ethPrice = pos(input.ethPrice ?? ILLUSTRATIVE.ETH_USD, "ETH price");
      if (typeof ethPrice !== "number") return { ok: false, error: ethPrice.error };
      const eth = (gas * gwei) / 1e9;
      return {
        ok: true,
        gasFee: eth * ethPrice,
        converted: eth,
        note: "Fee = gas × gwei / 1e9 ETH × illustrative ETH/USD.",
      };
    }
    default:
      return { ok: false, error: "Unknown calculator." };
  }
}
